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

	return `${text.trimEnd()}\n\n## Reaches\n\nThe rules this file cites and the files that hold them. Open one when a citation above decides something this file does not.\n\n${lines.join('\n')}\n`
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
