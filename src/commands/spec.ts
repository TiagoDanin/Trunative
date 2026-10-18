import { execFile } from 'node:child_process'
import { readdir, readFile, stat } from 'node:fs/promises'
import { join, posix, relative, sep } from 'node:path'
import { promisify } from 'node:util'

import { readHeuristics, readIndex, readIndexFiles } from '../heuristics.js'
import { CONFIG_DIR, packagedSkillDir } from '../paths.js'

export interface SpecOptions {
	cwd: string
	/** Briefs to check, or folders holding them. Empty means every one in .trunative/screens. */
	paths: string[]
	/** List the screen files no brief targets, instead of checking the briefs. */
	coverage?: boolean
}

interface Finding {
	kind: string
	detail: string
	file: string
	line: number
}

/** The keys a screen brief carries, and no others. */
const FIELDS = ['target', 'user_goal', 'context', 'primary_action', 'states', 'scope']

/**
 * The eight things about the moment of use that change a composition. Fixed for
 * the reason the state keys are: a brief that picks its own context keys leaves
 * out the one that would have argued with the layout it already had in mind.
 */
const CONTEXT = [
	'environment',
	'posture',
	'hands',
	'attention',
	'session_length',
	'frequency',
	'interruption',
	'urgency',
]

/**
 * Longer than this, a quoted primary action is a sentence about the control
 * rather than the words on it, which is what `button-label` judges.
 */
const LABEL_WORDS = 6

/**
 * The lines `flow/explore.md` hands back, kept in a comment at the top of the
 * wireframe so a skipped explore step is visible to this checker and not only
 * to whoever read the response it was written into.
 */
const EXPLORE = ['Default', 'Context', 'Candidates', 'Distance', 'Chosen', 'Lost']

/** The floor on how many of the nine relations each pair of candidates differs in. */
const DISTANCE_FLOOR = 3

/** The six `state-set` names, which are the six keys, always all six. */
const STATES = ['loading', 'empty', 'error', 'offline', 'partial', 'permission']

/**
 * What the brief may never carry. A number with a unit, or a line that reads
 * like a declaration, is the layout format growing inside the brief, and
 * `flow/spec.md` sends both to DESIGN.md.
 */
const MEASURED = /(^|[^a-z0-9])\d+(\.\d+)?\s?(px|pt|dp|sp|rem|em|%)\b/i
const DECLARED =
	/^\s*[-*]?\s*(padding|margin|gap|radius|border-radius|font-size|font-weight|line-height|width|height|spacing|shadow|opacity|elevation|z-index)\s*[:=]/i
const HEX = /#[0-9a-f]{6}\b/gi
const DASH = /[—–]/

/**
 * Import tokens that mean a file has reached a capability, each named by a rule
 * its file owns rather than by a stem, so a renamed file cannot leave this list
 * pointing at nothing. Matched against import lines only, and kept timid: a
 * token two capabilities share (StoreKit is purchases and the review prompt) is
 * left out rather than guessed.
 */
const CAPABILITIES: { rule: string; tokens: string[] }[] = [
	{
		rule: 'ads-labelled',
		tokens: ['google_mobile_ads', 'react-native-google-mobile-ads', 'com.google.android.gms.ads', 'GoogleMobileAds'],
	},
	{
		rule: 'notify-earns-it',
		tokens: [
			'flutter_local_notifications',
			'firebase_messaging',
			'awesome_notifications',
			'expo-notifications',
			'@react-native-firebase/messaging',
			'@notifee/react-native',
			'UserNotifications',
			'NotificationCompat',
			'com.google.firebase.messaging',
		],
	},
	{
		rule: 'fb-review-prompt',
		tokens: ['in_app_review', 'expo-store-review', 'react-native-in-app-review', 'com.google.android.play.core.review'],
	},
	{
		rule: 'cam-system-first',
		tokens: ['package:camera/', 'mobile_scanner', 'expo-camera', 'react-native-vision-camera', 'androidx.camera'],
	},
	{
		rule: 'map-camera',
		tokens: [
			'google_maps_flutter',
			'flutter_map',
			'react-native-maps',
			'MapKit',
			'com.google.android.gms.maps',
			'com.google.maps.android',
		],
	},
	{
		rule: 'pay-rail',
		tokens: [
			'in_app_purchase',
			'purchases_flutter',
			'react-native-iap',
			'react-native-purchases',
			'com.android.billingclient',
			'RevenueCat',
		],
	},
	{ rule: 'share-sheet-only', tokens: ['share_plus', 'expo-sharing', 'react-native-share'] },
	{
		rule: 'auth-methods',
		tokens: [
			'firebase_auth',
			'google_sign_in',
			'sign_in_with_apple',
			'@react-native-firebase/auth',
			'expo-auth-session',
			'AuthenticationServices',
			'com.google.firebase.auth',
			'androidx.credentials',
		],
	},
]

/** A rule the localisation file owns, so the locale check finds that file's stem. */
const LOCALE_RULE = 'l10n-strings'

const IMPORT_LINE = /^\s*(import|export|@import)\b|\bfrom\s+['"]|\brequire\(\s*['"]/

/** Folders a project walk never enters, because nothing in them is the app's own source. */
const WALK_SKIPPED = new Set([
	'node_modules',
	'build',
	'dist',
	'.dart_tool',
	'Pods',
	'.git',
	'.gradle',
	'DerivedData',
	'.fvm',
	'.expo',
	'.idea',
	'.vscode',
	'Library',
	'Temp',
	'obj',
	CONFIG_DIR,
	'.claude',
	'.agents',
	'.antigravity',
	'.codex',
	'.opencode',
])

/** Folders that hold tests and generated code, which have screens in name only. */
const NOT_SCREENS = new Set(['test', 'tests', '__tests__', 'integration_test', 'test_driver', 'androidTest', 'generated'])

const run = promisify(execFile)

interface Brief {
	/** Lines of the frontmatter, without the fences. */
	head: string[]
	/** 1-based line each frontmatter line sits on. */
	offset: number
	body: string[]
	bodyOffset: number
}

function split(source: string): Brief | undefined {
	const lines = source.split(/\r?\n/)
	if (lines[0]?.trim() !== '---') {
		return undefined
	}
	const end = lines.findIndex((line, index) => index > 0 && line.trim() === '---')
	if (end === -1) {
		return undefined
	}
	return {
		head: lines.slice(1, end),
		offset: 2,
		body: lines.slice(end + 1),
		bodyOffset: end + 2,
	}
}

/** Top-level `key: value` pairs, with the nested lines that belong to each. */
function fields(head: string[]): Map<string, { value: string; line: number; children: string[] }> {
	const found = new Map<string, { value: string; line: number; children: string[] }>()
	let current: { value: string; line: number; children: string[] } | undefined

	head.forEach((line, index) => {
		if (line.trim() === '' || line.trimStart().startsWith('#')) {
			return
		}
		const top = /^([a-z_]+):\s*(.*)$/.exec(line)
		if (top) {
			current = { value: top[2]!.trim(), line: index, children: [] }
			found.set(top[1]!, current)
			return
		}
		current?.children.push(line)
	})

	return found
}

/** `[a, b]` on the key's own line, or a block of `- a` under it. */
function list(value: string, children: string[]): string[] {
	const inline = /^\[(.*)\]$/.exec(value)
	if (inline) {
		return inline[1]!
			.split(',')
			.map((item) => item.trim())
			.filter(Boolean)
	}
	return children
		.map((line) => /^\s*-\s*(.+)$/.exec(line)?.[1]?.trim() ?? '')
		.filter(Boolean)
}

/** `key: value` pairs nested one level under a parent. */
function map(children: string[]): { key: string; value: string; line: number }[] {
	const found: { key: string; value: string; line: number }[] = []
	let indent = -1

	children.forEach((line, index) => {
		const pair = /^(\s+)([a-z_]+):\s*(.*)$/.exec(line)
		if (!pair) {
			return
		}
		const depth = pair[1]!.length
		if (indent === -1) {
			indent = depth
		}
		if (depth !== indent) {
			return
		}
		found.push({ key: pair[2]!, value: pair[3]!.trim(), line: index })
	})

	return found
}

const PREFIX_ROW = /\|\s*`(?:heuristics|platform)\/([a-z0-9-]+)\.md`\s*\|\s*`([a-z0-9-]+)`\s*\|/

/**
 * Every spelling of an extra file, resolved to its stem. The Extra table prints
 * the stem and the rule prefix side by side and they often differ, so a brief
 * that says "l10n" for `heuristics/localization.md` is naming the row it read
 * rather than making a mistake. `rubric --only` already takes either, and a
 * checker stricter than the generator is a trap with no upside.
 */
async function stems(skillDir: string): Promise<Map<string, string>> {
	const found = new Map<string, string>()
	for (const stem of await readIndexFiles(skillDir, 'extra')) {
		found.set(stem, stem)
	}
	for (const line of await readIndex(skillDir, 'extra')) {
		const row = PREFIX_ROW.exec(line)
		if (!row) {
			continue
		}
		found.set(row[2]!, row[1]!)
		found.set(row[2]!.replace(/-$/, ''), row[1]!)
	}
	return found
}

/** How far a colour is from grey, 0 to 1. Tinted greys stay low, brand does not. */
function chroma(hex: string): number {
	const channels = [1, 3, 5].map((at) => Number.parseInt(hex.slice(at, at + 2), 16))
	return (Math.max(...channels) - Math.min(...channels)) / 255
}

async function exists(path: string): Promise<boolean> {
	try {
		await stat(path)
		return true
	} catch {
		return false
	}
}

async function isFile(path: string): Promise<boolean> {
	return (await stat(path).catch(() => null))?.isFile() ?? false
}

/** Every file in the project outside the skipped folders, project-relative with forward slashes. */
async function projectFiles(cwd: string): Promise<string[]> {
	const found: string[] = []
	const walk = async (dir: string): Promise<void> => {
		let entries
		try {
			entries = await readdir(dir, { withFileTypes: true })
		} catch {
			return
		}
		for (const entry of entries) {
			if (WALK_SKIPPED.has(entry.name)) {
				continue
			}
			const full = join(dir, entry.name)
			if (entry.isDirectory()) {
				await walk(full)
			} else if (entry.isFile()) {
				found.push(relative(cwd, full).split(sep).join('/'))
			}
		}
	}
	await walk(cwd)
	return found.sort()
}

/**
 * The locales a project ships, read from the files that carry them: ARB files,
 * JSON files in a translations folder, Android `values-xx` string resources,
 * and iOS `xx.lproj` folders. A `Locales:` line in STACK.md counts as well.
 * Anything else stays unread, so a project can ship two languages and still
 * come back as one here, never the reverse.
 */
async function shippedLocales(cwd: string, files: string[]): Promise<string[]> {
	const found = new Set<string>()
	for (const file of files) {
		const parts = file.split('/')
		const name = parts.at(-1)!
		const folder = parts.at(-2) ?? ''
		const arb = /_([a-z]{2,3}(?:[_-][A-Za-z]{2,4})?)\.arb$/.exec(name)
		if (arb) {
			found.add(arb[1]!.replace('_', '-'))
			continue
		}
		const json = /^([a-z]{2,3}(?:[_-][A-Za-z]{2,4})?)\.json$/.exec(name)
		if (json && /^(translations|locales|i18n|l10n|lang|langs)$/i.test(folder)) {
			found.add(json[1]!.replace('_', '-'))
			continue
		}
		if (name === 'strings.xml') {
			const values = /^values(?:-([a-z]{2,3})(?:-r([A-Z]{2}))?)?$/.exec(folder)
			if (values) {
				found.add(values[1] ? `${values[1]}${values[2] ? `-${values[2]}` : ''}` : 'default')
			}
			continue
		}
		const lproj = /^([A-Za-z-]+)\.lproj$/.exec(folder)
		if (lproj && lproj[1] !== 'Base') {
			found.add(lproj[1]!)
		}
	}

	for (const candidate of [join(cwd, CONFIG_DIR, 'STACK.md'), join(cwd, 'STACK.md')]) {
		const source = await readFile(candidate, 'utf8').catch(() => '')
		for (const line of source.split(/\r?\n/)) {
			const declared = /^\s*[-*]?\s*\**(?:locales?|languages?)\**\s*:\s*(.+)$/i.exec(line)
			if (!declared) {
				continue
			}
			for (const token of declared[1]!.split(/[\s,/]+/)) {
				const code = /^`?([a-z]{2,3}(?:[_-][A-Z]{2})?)`?$/.exec(token)
				if (code) {
					found.add(code[1]!.replace('_', '-'))
				}
			}
		}
	}

	return [...found].sort()
}

/**
 * A file that renders a screen, by the names each stack gives one. Timid on
 * purpose: a screen named otherwise is simply not listed, which costs a line in
 * a report, where a component listed as a screen costs a brief nobody needed.
 */
function looksLikeScreen(file: string): boolean {
	const parts = file.split('/')
	const name = parts.at(-1)!
	const folders = parts.slice(0, -1).map((part) => part.toLowerCase())

	if (folders.some((folder) => NOT_SCREENS.has(folder))) {
		return false
	}
	if (/\.(g|freezed|gr|mocks)\.dart$/.test(name)) {
		return false
	}
	if (/_(screen|page|view)\.dart$/.test(name)) {
		return true
	}
	if (/Screen\.(kt|swift)$/.test(name)) {
		return true
	}
	if (/View\.swift$/.test(name) && folders.some((folder) => folder === 'views' || folder === 'screens')) {
		return true
	}
	if (/\.(tsx|jsx)$/.test(name) && !/\.(test|spec|stories)\.(tsx|jsx)$/.test(name)) {
		if (folders.includes('screens')) {
			return true
		}
		// Expo Router: every file under app/ is a route, except layouts and specials.
		const app = folders.indexOf('app')
		if ((app === 0 || (app === 1 && folders[0] === 'src')) && !/^[_+]/.test(name)) {
			return true
		}
	}
	return false
}

/** When git last saw the file change, in seconds. Undefined outside a repository or for an untracked file. */
async function changedAt(cwd: string, file: string): Promise<number | undefined> {
	try {
		const { stdout } = await run('git', ['log', '-1', '--format=%ct', '--', file], { cwd })
		const seconds = Number.parseInt(stdout.trim(), 10)
		return Number.isNaN(seconds) ? undefined : seconds
	} catch {
		return undefined
	}
}

/** The Dart package a folder belongs to, from the nearest pubspec.yaml above it. */
async function pubspec(cwd: string, from: string): Promise<{ name: string; dir: string } | undefined> {
	let dir = from
	for (;;) {
		const source = await readFile(join(cwd, dir, 'pubspec.yaml'), 'utf8').catch(() => undefined)
		if (source !== undefined) {
			const name = /^name:\s*([a-z0-9_]+)/m.exec(source)?.[1]
			return name ? { name, dir } : undefined
		}
		if (dir === '.' || dir === '') {
			return undefined
		}
		dir = posix.dirname(dir)
	}
}

/**
 * The project files a file imports directly: relative paths, and in Dart the
 * package's own `package:` imports. One level only, which is enough to see a
 * screen that reached a capability through the widget it delegates to.
 */
async function localImports(cwd: string, file: string, source: string): Promise<string[]> {
	const here = posix.dirname(file)
	const dart = file.endsWith('.dart')
	const own = dart ? await pubspec(cwd, here) : undefined
	const specifiers = [
		...source.matchAll(/^\s*(?:import|export)\s+['"]([^'"]+)['"]|\bfrom\s+['"]([^'"]+)['"]|\brequire\(\s*['"]([^'"]+)['"]/gm),
	].map((match) => match[1] ?? match[2] ?? match[3]!)

	const found: string[] = []
	for (const specifier of specifiers) {
		let base: string | undefined
		if (dart) {
			if (own && specifier.startsWith(`package:${own.name}/`)) {
				base = posix.join(own.dir, 'lib', specifier.slice(`package:${own.name}/`.length))
			} else if (!/^(dart|package):/.test(specifier)) {
				base = posix.join(here, specifier)
			}
		} else if (specifier.startsWith('.')) {
			base = posix.join(here, specifier)
		}
		if (!base) {
			continue
		}
		const scripts = ['.ts', '.tsx', '.js', '.jsx']
		const candidates = dart
			? [base]
			: [base, ...scripts.map((extension) => `${base}${extension}`), ...scripts.map((extension) => `${base}/index${extension}`)]
		for (const candidate of candidates) {
			if (await isFile(join(cwd, candidate))) {
				found.push(candidate)
				break
			}
		}
	}
	return found
}

/**
 * The capabilities a target reaches, by the import lines in it and in the files
 * it imports directly, each with the first file and token that showed it.
 */
async function reached(
	cwd: string,
	target: string,
	owners: Map<string, string>,
): Promise<Map<string, { file: string; token: string }>> {
	const found = new Map<string, { file: string; token: string }>()
	const source = await readFile(join(cwd, target), 'utf8').catch(() => '')
	const files = [{ file: target, source }]
	for (const file of await localImports(cwd, target, source)) {
		files.push({ file, source: await readFile(join(cwd, file), 'utf8').catch(() => '') })
	}

	for (const { file, source: text } of files) {
		const imports = text.split(/\r?\n/).filter((line) => IMPORT_LINE.test(line))
		for (const capability of CAPABILITIES) {
			const stem = owners.get(capability.rule)
			if (!stem || found.has(stem)) {
				continue
			}
			const token = capability.tokens.find((candidate) => imports.some((line) => line.includes(candidate)))
			if (token) {
				found.set(stem, { file, token })
			}
		}
	}
	return found
}

/**
 * The screen files in a project that no brief targets. It reports and never
 * writes: whether a screen needs a brief is the spec step's verdict, and a
 * listed file may well be a screen that never changed structure.
 */
export async function uncovered(cwd: string, briefs: string[]): Promise<string[]> {
	const targets = new Set<string>()
	for (const file of briefs) {
		const source = await readFile(join(cwd, file), 'utf8').catch(() => '')
		const target = split(source) && fields(split(source)!.head).get('target')?.value
		if (target) {
			targets.add(target.replace(/\\/g, '/').replace(/^\.\//, ''))
		}
	}
	return (await projectFiles(cwd)).filter((file) => looksLikeScreen(file) && !targets.has(file))
}

/**
 * The explore record at the top of a wireframe: the lines `flow/explore.md`
 * hands back, inside an `<!-- explore ... -->` comment. Only what can be
 * counted is checked, three candidates and every pair over the floor, since
 * whether the winner is right is the gate's question and not this checker's.
 */
function checkExplore(drawing: string, wireframe: string): Finding[] {
	const findings: Finding[] = []
	const add = (detail: string, line: number): void => {
		findings.push({ kind: 'explore', detail, file: wireframe, line })
	}

	const start = drawing.indexOf('<!-- explore')
	if (start === -1) {
		add('no <!-- explore --> record, flow/explore.md writes its hand-back there', 1)
		return findings
	}
	const end = drawing.indexOf('-->', start)
	const at = drawing.slice(0, start).split(/\r?\n/).length
	const lines = drawing.slice(start, end === -1 ? undefined : end).split(/\r?\n/)
	const value = (key: string): string | undefined =>
		lines
			.map((line) => new RegExp(`^\\s*${key}\\s{2,}(.+)$`).exec(line)?.[1]?.trim())
			.find((found) => found !== undefined)

	for (const key of EXPLORE) {
		if (!value(key)) {
			add(`the explore record has no ${key} line`, at)
		}
	}

	const candidates = value('Candidates')
	if (candidates && (candidates.match(/\b[A-C]\b/g) ?? []).length < 3) {
		add('the explore record names fewer than three candidates', at)
	}

	const distance = value('Distance')
	if (distance) {
		const pairs = [...distance.matchAll(/\b([A-C])\s*\/\s*([A-C])\s+(\d+)/g)]
		if (pairs.length < 3) {
			add('Distance must count all three pairs, as A/B, A/C and B/C', at)
		}
		for (const pair of pairs) {
			if (Number(pair[3]) < DISTANCE_FLOOR) {
				add(`${pair[1]}/${pair[2]} differ in ${pair[3]} relations, under the floor of ${DISTANCE_FLOOR}`, at)
			}
		}
	}

	return findings
}

/** What every brief is checked against, read once per run. */
interface Context {
	/** Every spelling of an extra file, to its stem. */
	extra: Map<string, string>
	base: string[]
	/** Rule id to the stem of the file that owns it. */
	owners: Map<string, string>
	/** The locales the project ships, read on first use. */
	locales: () => Promise<string[]>
}

async function checkBrief(cwd: string, file: string, against: Context): Promise<Finding[]> {
	const { extra, base, owners } = against
	const findings: Finding[] = []
	const add = (kind: string, detail: string, line: number): void => {
		findings.push({ kind, detail, file, line })
	}

	const source = await readFile(join(cwd, file), 'utf8')

	source.split(/\r?\n/).forEach((line, index) => {
		if (DASH.test(line)) {
			add('dash', 'em dash or en dash', index + 1)
		}
	})

	const brief = split(source)
	if (!brief) {
		add('frontmatter', 'no frontmatter fenced by --- on the first line', 1)
		return findings
	}

	for (const [index, line] of brief.body.entries()) {
		const at = brief.bodyOffset + index
		if (MEASURED.test(line)) {
			add('measured', 'a number with a unit, which belongs in DESIGN.md', at)
		}
		if (DECLARED.test(line)) {
			add('measured', 'a style declaration, which belongs in DESIGN.md', at)
		}
	}

	const head = fields(brief.head)

	for (const name of FIELDS) {
		if (!head.has(name)) {
			add('missing field', name, brief.offset)
		}
	}
	for (const [name, field] of head) {
		if (!FIELDS.includes(name)) {
			add('unknown field', name, brief.offset + field.line)
		}
	}

	const target = head.get('target')
	if (target) {
		if (!target.value) {
			add('target', 'empty, name the file that implements the screen', brief.offset + target.line)
		} else if (!(await exists(join(cwd, target.value)))) {
			add(
				'target',
				`${target.value} is not on disk, point it at the file that renders the screen now`,
				brief.offset + target.line,
			)
		} else {
			// A commit to the screen that left its brief alone is either cosmetic or
			// a structural change nobody wrote down, and only reading tells which.
			const briefAt = await changedAt(cwd, file)
			const targetAt = await changedAt(cwd, target.value)
			if (briefAt !== undefined && targetAt !== undefined && targetAt > briefAt) {
				add(
					'stale',
					`${target.value} changed after the brief; re-read the brief or update it`,
					brief.offset + target.line,
				)
			}
		}
	}

	const action = head.get('primary_action')
	if (action) {
		const at = brief.offset + action.line
		const none = /^none\b[\s,.:;-]*(.*)$/i.exec(action.value)
		const labels = /^"[^"]+"(\s+or\s+"[^"]+")?$/.test(action.value)
			? [...action.value.matchAll(/"([^"]+)"/g)].map((match) => match[1]!)
			: undefined
		if (none) {
			if (!none[1]) {
				add('primary action', 'none with no reason, say what the screen is for when nothing on it is pressed', at)
			}
		} else if (!labels) {
			add(
				'primary action',
				'must be the label the user reads in quotes, two labels joined by "or", or none with the reason',
				at,
			)
		} else {
			for (const label of labels) {
				if (label.includes(';') || label.split(/\s+/).length > LABEL_WORDS) {
					add('primary action', `"${label}" reads as a sentence, not as the label on the control`, at)
				}
			}
		}
	}

	const goal = head.get('user_goal')
	if (goal && !goal.value) {
		add('user goal', 'empty, say what the person is trying to get done, in their words', brief.offset + goal.line)
	}

	const context = head.get('context')
	if (context) {
		const declared = map(context.children)
		for (const name of CONTEXT) {
			if (!declared.some((entry) => entry.key === name)) {
				add('context', `${name} is missing, and all eight context keys are required`, brief.offset + context.line)
			}
		}
		for (const entry of declared) {
			const at = brief.offset + context.line + 1 + entry.line
			if (!CONTEXT.includes(entry.key)) {
				add('context', `${entry.key} is not one of the eight context keys`, at)
			} else if (!entry.value) {
				add('context', `${entry.key} is empty, write "unknown" when nobody knows`, at)
			}
		}
	}

	const states = head.get('states')
	if (states) {
		const declared = map(states.children)
		for (const name of STATES) {
			if (!declared.some((entry) => entry.key === name)) {
				add('state', `${name} is missing, and all six of state-set are required`, brief.offset + states.line)
			}
		}
		for (const entry of declared) {
			const at = brief.offset + states.line + 1 + entry.line
			if (!STATES.includes(entry.key)) {
				add('state', `${entry.key} is not one of the six state-set names`, at)
				continue
			}
			if (!entry.value) {
				add('state', `${entry.key} has no line saying what the screen shows`, at)
				continue
			}
			if (/^n\/a\b/i.test(entry.value) && entry.value.replace(/^n\/a\b[\s,.:;-]*/i, '') === '') {
				add('state', `${entry.key} is n/a with no reason`, at)
			}
		}
	}

	// Extra files the brief keeps shut, and how: closed or auto_excluded.
	const shut = new Map<string, string>()
	const scope = head.get('scope')
	if (scope) {
		const at = brief.offset + scope.line
		const parts = map(scope.children)
		const openAt = parts.find((entry) => entry.key === 'open')
		const closedAt = parts.find((entry) => entry.key === 'closed')

		const excludedAt = parts.find((entry) => entry.key === 'auto_excluded')

		// The lines under one key run until the next key at the same depth.
		const under = (from: { line: number }): string[] => {
			const next = parts.map((entry) => entry.line).filter((line) => line > from.line)
			return scope.children.slice(from.line + 1, next.length > 0 ? Math.min(...next) : undefined)
		}

		const open = openAt ? list(openAt.value, under(openAt)) : []
		const closed = closedAt ? map(under(closedAt)) : []
		const excluded = excludedAt ? list(excludedAt.value, under(excludedAt)) : []

		for (const entry of parts) {
			if (!['open', 'closed', 'auto_excluded'].includes(entry.key)) {
				add('scope', `${entry.key} is not open, closed or auto_excluded`, at + 1 + entry.line)
			}
		}

		if (!openAt) {
			add('scope', 'no open list, name the extra files this screen touches', at)
		}

		const opened = new Set<string>()
		for (const stem of open) {
			if (base.includes(stem)) {
				add('scope', `${stem} is a base file, opened on every screen and never declared, remove it from open`, at)
				continue
			}
			const canonical = extra.get(stem)
			if (!canonical) {
				add('scope', `${stem} is not a file in the Extra table`, at)
				continue
			}
			opened.add(canonical)
		}
		for (const entry of closed) {
			const line = brief.offset + scope.line + 2 + closedAt!.line + entry.line
			const canonical = extra.get(entry.key)
			if (!canonical) {
				add('scope', `${entry.key} is not a file in the Extra table`, line)
			} else if (opened.has(canonical)) {
				add('scope', `${entry.key} is both open and closed`, line)
			}
			if (!entry.value) {
				add('scope', `${entry.key} is closed with no reason`, line)
			}
		}
		// A row the screen plainly has nothing of is excluded by name and owes no
		// sentence. The sentence is kept for the near misses, under `closed`.
		for (const stem of excluded) {
			const canonical = extra.get(stem)
			if (!canonical) {
				add('scope', `${stem} is not a file in the Extra table`, at)
			} else if (opened.has(canonical)) {
				add('scope', `${stem} is both open and auto_excluded`, at)
			} else {
				shut.set(canonical, 'auto_excluded')
			}
		}
		for (const entry of closed) {
			const canonical = extra.get(entry.key)
			if (canonical && !opened.has(canonical)) {
				shut.set(canonical, 'closed')
			}
		}

		// Scope is decided once and the screen keeps growing. A file shut when
		// the brief was written is reopened by the import that brought it in.
		if (shut.size > 0 && target?.value && (await isFile(join(cwd, target.value)))) {
			for (const [stem, evidence] of await reached(cwd, target.value, owners)) {
				const how = shut.get(stem)
				if (how) {
					add('scope', `${stem} is ${how}, and ${evidence.file} imports ${evidence.token}: reopen it`, at)
				}
			}
		}

		const l10n = owners.get(LOCALE_RULE)
		const how = l10n ? shut.get(l10n) : undefined
		if (how) {
			const locales = await against.locales()
			if (locales.length > 1) {
				add('scope', `${l10n} is ${how}, and the project ships ${locales.length} locales (${locales.join(', ')}): reopen it`, at)
			}
		}
	}

	const wireframe = file.replace(/\.md$/, '.wireframe.html')
	if (!(await exists(join(cwd, wireframe)))) {
		add('wireframe', `no ${wireframe}, the spec step draws one before the gate`, 0)
	} else {
		const drawing = await readFile(join(cwd, wireframe), 'utf8')
		findings.push(...checkExplore(drawing, wireframe))
		drawing.split(/\r?\n/).forEach((line, index) => {
			for (const match of line.matchAll(HEX)) {
				if (chroma(match[0]!) > 0.1) {
					findings.push({
						kind: 'wireframe',
						detail: `${match[0]} is a colour, and a wireframe is greyscale`,
						file: wireframe,
						line: index + 1,
					})
				}
			}
		})
	}

	return findings
}

/**
 * Checks the screen briefs in a project. It is the doctor's family rather than
 * the lint's: it reads what the agent wrote into a consumer project, not the
 * skill this package ships.
 */
/** The briefs in one folder, sorted. Empty when the folder is missing. */
async function briefsIn(cwd: string, dir: string): Promise<string[]> {
	try {
		return (await readdir(join(cwd, dir)))
			.filter((name) => name.endsWith('.md'))
			.sort()
			.map((name) => `${dir}/${name}`)
	} catch {
		return []
	}
}

export async function spec(options: SpecOptions): Promise<number> {
	const { cwd } = options
	const dir = `${CONFIG_DIR}/screens`

	// A folder stands for the briefs in it, the way no argument stands for this one.
	const files: string[] = []
	for (const path of options.paths.map((path) => path.replace(/\\/g, '/').replace(/(.)\/+$/, '$1'))) {
		if ((await stat(join(cwd, path)).catch(() => null))?.isDirectory()) {
			files.push(...(await briefsIn(cwd, path)))
		} else {
			files.push(path)
		}
	}
	if (options.paths.length === 0) {
		files.push(...(await briefsIn(cwd, dir)))
	}

	if (options.coverage) {
		const missing = await uncovered(cwd, files)
		for (const file of missing) {
			console.log(`NO BRIEF  ${file}`)
		}
		console.log(
			`\n${missing.length} screen file(s) with no brief targeting them, against ${files.length} brief(s).`,
		)
		console.log('Informational: flow/spec.md decides which screens need a brief, and a cosmetic screen may need none.')
		return 0
	}

	if (files.length === 0) {
		console.log(`PASS  no screen briefs in ${options.paths.length > 0 ? options.paths.join(', ') : dir}`)
		console.log('      flow/spec.md writes one when a task changes structure.')
		return 0
	}

	const owners = new Map<string, string>()
	for (const heuristic of await readHeuristics(packagedSkillDir)) {
		for (const rule of heuristic.rules) {
			owners.set(rule.id, heuristic.file)
		}
	}
	let locales: Promise<string[]> | undefined
	const context: Context = {
		extra: await stems(packagedSkillDir),
		base: await readIndexFiles(packagedSkillDir, 'base'),
		owners,
		locales: () => (locales ??= projectFiles(cwd).then((found) => shippedLocales(cwd, found))),
	}

	const findings: Finding[] = []
	for (const file of files) {
		if (!(await exists(join(cwd, file)))) {
			findings.push({ kind: 'missing', detail: 'not on disk', file, line: 0 })
			continue
		}
		findings.push(...(await checkBrief(cwd, file, context)))
	}

	if (findings.length === 0) {
		console.log(`PASS  ${files.length} screen brief(s), 0 findings`)
		return 0
	}

	const width = Math.max(...findings.map((finding) => finding.kind.length))
	for (const finding of findings) {
		const where = `${finding.file}${finding.line ? `:${finding.line}` : ''}`
		console.log(`FAIL  ${finding.kind.padEnd(width)}  ${where}  ${finding.detail}`)
	}

	console.log(`\n${findings.length} finding(s) in ${files.length} screen brief(s).`)
	return 1
}
