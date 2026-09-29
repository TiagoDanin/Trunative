import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'

import { readIndex, readIndexFiles } from '../heuristics.js'
import { CONFIG_DIR, packagedSkillDir } from '../paths.js'

export interface SpecOptions {
	cwd: string
	/** Briefs to check. Empty means every one in .trunative/screens. */
	paths: string[]
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

async function checkBrief(
	cwd: string,
	file: string,
	extra: Map<string, string>,
	base: string[],
): Promise<Finding[]> {
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
export async function spec(options: SpecOptions): Promise<number> {
	const { cwd } = options
	const dir = join(CONFIG_DIR, 'screens')

	let files = options.paths.map((path) => path.replace(/\\/g, '/'))
	if (files.length === 0) {
		try {
			files = (await readdir(join(cwd, dir)))
				.filter((name) => name.endsWith('.md'))
				.sort()
				.map((name) => `${dir}/${name}`)
		} catch {
			files = []
		}
	}

	if (files.length === 0) {
		console.log(`PASS  no screen briefs in ${dir}`)
		console.log('      flow/spec.md writes one when a task changes structure.')
		return 0
	}

	const extra = await stems(packagedSkillDir)
	const base = await readIndexFiles(packagedSkillDir, 'base')

	const findings: Finding[] = []
	for (const file of files) {
		if (!(await exists(join(cwd, file)))) {
			findings.push({ kind: 'missing', detail: 'not on disk', file, line: 0 })
			continue
		}
		findings.push(...(await checkBrief(cwd, file, extra, base)))
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
