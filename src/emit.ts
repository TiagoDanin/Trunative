import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative, sep } from 'node:path'

import { compile, type Target } from './compile.js'
import { parseHeuristic } from './heuristics.js'
import { packagedSkillDir, variantName } from './paths.js'
import { narrowReferences } from './references.js'
import { isSkillFile } from './skill.js'

/** One resolved file, keyed by its path inside the skill. */
export type Sources = Map<string, Buffer>

const STACK_LABELS: Record<string, string> = {
	flutter: 'Flutter',
	expo: 'Expo',
	'react-native': 'React Native',
	swiftui: 'SwiftUI',
	compose: 'Jetpack Compose',
	web: 'mobile web',
}

/** Every file of the source skill, project-relative, in a stable order. */
export async function listSkillFiles(root = packagedSkillDir): Promise<string[]> {
	const found: string[] = []

	async function walk(dir: string): Promise<void> {
		for (const entry of await readdir(dir, { withFileTypes: true })) {
			if (!isSkillFile(entry.name)) {
				continue
			}
			const full = join(dir, entry.name)
			if (entry.isDirectory()) {
				await walk(full)
			} else if (entry.isFile()) {
				found.push(relative(root, full).split(sep).join('/'))
			}
		}
	}

	await walk(root)
	return found.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
}

/** The written skill, read once and reused for every variant. */
export async function readSources(root = packagedSkillDir): Promise<Sources> {
	const sources: Sources = new Map()
	for (const file of await listSkillFiles(root)) {
		sources.set(file, await readFile(join(root, file)))
	}
	return sources
}

/**
 * The entry file names the skill, and a stack variant is a different skill with
 * a different name, or an agent would see several skills claiming one id.
 */
function retitle(source: string, stack: string | undefined): string {
	if (!stack) {
		return source
	}

	const label = STACK_LABELS[stack] ?? stack
	return source
		.replace(/^name:\s*(.+)$/m, (_, name: string) => `name: ${variantName(name.trim(), stack)}`)
		.replace(
			/^description:\s*(.+)$/m,
			(_, text: string) =>
				`description: ${text.trim().replace(/for any stack \([^)]*\)/, `in ${label}`)} Install this copy only in a ${label} project.`,
		)
}

const HEURISTICS = 'heuristics/'
/** A backticked token, the same shape `lint` reads a citation as. */
const CITATION = /`([a-z0-9][a-z0-9-]*)`/g
/**
 * The line that says what a Reaches section is. It is a constant because the
 * flattened copy carries forty of these sections in one document and says it
 * once at the top instead, and a sentence written twice drifts once.
 */
const REACHES_NOTE =
	'The rules this file cites and the files that hold them. Open one when a citation above decides something this file does not.'

/**
 * Which file owns each rule id. Built through the one parser that walks rule
 * ids rather than a second regex, so a change to what counts as a rule reaches
 * this at the same time it reaches `lint` and `rubric`.
 */
function ownership(sources: Sources): Map<string, string> {
	const owner = new Map<string, string>()

	for (const [file, content] of sources) {
		if (!file.startsWith(HEURISTICS) || !file.endsWith('.md')) {
			continue
		}
		const stem = file.slice(HEURISTICS.length, -'.md'.length)
		for (const rule of parseHeuristic(stem, file, content.toString('utf8'), []).rules) {
			if (rule.id && !owner.has(rule.id)) {
				owner.set(rule.id, file)
			}
		}
	}

	return owner
}

/**
 * Every heuristics file ends with the files it reaches into, derived from the
 * ids it cites. A rule cites a neighbour by id and the reader has no way to
 * know which file that id lives in, so following a citation means opening the
 * folder and guessing. Generated here rather than written by hand, because a
 * hand-written list is wrong the first time a rule moves between files and
 * nothing would report it.
 */
function withCrossReferences(text: string, file: string, owner: Map<string, string>): string {
	const cited = new Map<string, string[]>()

	for (const match of text.matchAll(CITATION)) {
		const id = match[1]!
		const home = owner.get(id)
		if (!home || home === file) {
			continue
		}
		const ids = cited.get(home) ?? []
		if (!ids.includes(id)) {
			ids.push(id)
		}
		cited.set(home, ids)
	}

	if (cited.size === 0) {
		return text
	}

	const lines = [...cited.entries()]
		.sort(([left], [right]) => (left < right ? -1 : 1))
		.map(([home, ids]) => `- \`${home}\`: ${ids.map((id) => `\`${id}\``).join(', ')}`)

	return `${text.trimEnd()}\n\n## Reaches\n\n${REACHES_NOTE}\n\n${lines.join('\n')}\n`
}

/** One variant, resolved in memory. Markdown is compiled, anything else copied. */
export function resolve(sources: Sources, target: Target): Map<string, Buffer> {
	const out = new Map<string, Buffer>()
	const owner = ownership(sources)

	for (const [file, content] of sources) {
		if (!file.endsWith('.md')) {
			out.set(file, content)
			continue
		}
		const compiled = compile(content.toString('utf8'), target)
		// A reference table branches by the word in its header, not by a tag, so
		// it is narrowed after the tags are gone.
		const resolved = file.startsWith('references/')
			? narrowReferences(compiled, target.stack)
			: compiled
		// The citation map is built from ids, so it lands after the tags carrying
		// them have been resolved into prose.
		const linked = file.startsWith(HEURISTICS)
			? withCrossReferences(resolved, file, owner)
			: resolved
		out.set(file, Buffer.from(file === 'SKILL.md' ? retitle(linked, target.stack) : linked, 'utf8'))
	}

	return out
}

/** Flow files lead, in the order the flow runs rather than alphabetically. */
const FLOW_ORDER = ['flow/init.md', 'flow/spec.md', 'flow/build.md', 'flow/review.md']

/**
 * Every heading one level down, so an inlined file sits under the heading
 * naming its path. Fenced blocks pass untouched: a hex value at the start of a
 * CSS line is not a heading, and neither is anything else inside a fence.
 */
function demote(text: string): string {
	const out: string[] = []
	let fence = ''

	for (const line of text.split(/\r?\n/)) {
		const opener = /^\s*(```|~~~)/.exec(line)
		if (fence) {
			if (opener && line.trim().startsWith(fence)) {
				fence = ''
			}
			out.push(line)
			continue
		}
		if (opener) {
			fence = opener[1]!
			out.push(line)
			continue
		}
		out.push(/^#{1,5} /.test(line) ? `#${line}` : line)
	}

	return out.join('\n')
}

/** The order the flattened copy lays the skill out in. */
function flattenOrder(files: Map<string, Buffer>): string[] {
	const rest = [...files.keys()].filter((file) => file !== 'SKILL.md')
	const pick = (prefix: string) =>
		rest.filter((file) => file.startsWith(prefix)).sort((a, b) => (a < b ? -1 : 1))

	const flow = pick('flow/')
	return [
		...FLOW_ORDER.filter((file) => flow.includes(file)),
		...flow.filter((file) => !FLOW_ORDER.includes(file)),
		...pick('heuristics/'),
		...pick('references/'),
	]
}

/**
 * One file holding the whole skill. The tiered copy is the one a project
 * installs, because opening a rule only when a screen touches it is the point
 * of the tiers. This one exists for the cases where there is nothing to open:
 * a context window that gets pasted into once, a harness with no file access, a
 * reviewer reading the whole thing end to end. Every path the text cites
 * becomes the heading of a section here, so a citation still navigates.
 */
export function flatten(files: Map<string, Buffer>): Map<string, Buffer> {
	const entry = files.get('SKILL.md')?.toString('utf8') ?? ''
	const parsed = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(entry)
	const frontmatter = (parsed?.[1] ?? '')
		.replace(/^name:\s*(.+)$/m, (_, name: string) => `name: ${name.trim()}-full`)
		.replace(
			/^description:\s*(.+)$/m,
			(_, text: string) =>
				`description: ${text.trim()} This copy carries every rule, procedure and reference inline, in one file.`,
		)

	const parts = [
		'---',
		frontmatter,
		'---',
		'',
		'Every file this skill is made of is inlined below, each under a heading that is its path. A line pointing at `heuristics/colors.md` or `flow/build.md` is pointing at a section of this document, so nothing here has to be opened and nothing is missing. The tiered copy, where a rule is read only once a screen touches it, is the one a project installs; this one is for a context that gets filled once and cannot read files.',
		'',
		'Two lists are generated rather than written. Each rule file opens with its own rule ids in order, and closes with a Reaches section naming the ids it cites and the file that holds each one, which here is the section that holds it.',
		'',
		parsed?.[2]?.trim() ?? entry.trim(),
	]

	for (const file of flattenOrder(files)) {
		const content = files.get(file)!.toString('utf8').trim()
		const body = file.endsWith('.md')
			? // The note under every Reaches section is identical, and forty copies
				// of one sentence in a single document is the sentence being read as
				// content. It is stated once in the preamble above instead.
				demote(content)
					.split(/\r?\n/)
					.filter((line) => line.trim() !== REACHES_NOTE)
					.join('\n')
					.replace(/\n{3,}/g, '\n\n')
			: ['```' + file.split('.').pop(), content, '```'].join('\n')
		parts.push('', `# ${file}`, '', body)
	}

	return new Map([['SKILL.md', Buffer.from(`${parts.join('\n')}\n`, 'utf8')]])
}

/** Writes a resolved variant to disk, replacing whatever was there. */
export async function write(files: Map<string, Buffer>, destination: string): Promise<number> {
	await rm(destination, { recursive: true, force: true })

	for (const [file, content] of files) {
		const path = join(destination, ...file.split('/'))
		await mkdir(dirname(path), { recursive: true })
		await writeFile(path, content)
	}

	return files.size
}
