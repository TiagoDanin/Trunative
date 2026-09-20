import { readdir, readFile } from 'node:fs/promises'
import { basename, join } from 'node:path'

import { tokenize } from './mdx.js'

/** One rule: a `## <Rule id="..." />` section and the Check line that verifies it. */
export interface Rule {
	id: string
	/** The heading's description attribute. Empty when only a Check line defines the rule. */
	title: string
	/** The Check line without its trailing id. Empty when the rule has none. */
	check: string
	/** Stem of the file that owns it, such as "touch". */
	file: string
	/** Listed under "Always in scope" in SKILL.md, so every run scores it. */
	always: boolean
	/** 1-based line of the "## `id`" heading, or 0 when there is none. */
	line: number
	/** 1-based line of the Check bullet that verifies it, or 0 when there is none. */
	checkLine: number
	/**
	 * "device" when the heading carries evidence="device", meaning a diff cannot
	 * settle the rule. "source" otherwise.
	 */
	evidence: 'source' | 'device'
	/**
	 * What the rule costs the person using the app when it fails. "p0" and "p1"
	 * block a screen whatever the percentage says. "p2" when the heading says nothing.
	 */
	severity: Severity
	/**
	 * "binary" when the heading carries grade="binary": the rule is met or it is
	 * not, and a 1 to 5 on it would be precision nobody measured. "scale" otherwise.
	 */
	grade: 'scale' | 'binary'
}

/**
 * The directories that hold rules. `heuristics/` is what the person should
 * experience, and `platform/` is the engineering underneath it: transport,
 * scheduling, performance. Same tags, same parser, same review, different shelf.
 */
export const RULE_DIRS = ['heuristics', 'platform'] as const

/** True for a path such as "heuristics/touch.md" or "platform/network.md". */
export function isRuleFile(file: string): boolean {
	return RULE_DIRS.some((dir) => file.startsWith(`${dir}/`))
}

export const SEVERITIES =['p0', 'p1', 'p2', 'p3'] as const
export type Severity = (typeof SEVERITIES)[number]

function severity(value: string | undefined): Severity {
	return (SEVERITIES as readonly string[]).includes(value ?? '') ? (value as Severity) : 'p2'
}

/** One heuristics file, in the order its rules appear. */
export interface Heuristic {
	/** Stem, such as "touch". */
	file: string
	/** Path relative to the skill directory. */
	path: string
	/** The H1 title. */
	title: string
	rules: Rule[]
	/**
	 * Whatever the Check section says after its bullets. That paragraph is where
	 * a file names the rules a diff cannot settle, so the rubric carries it.
	 */
	device: string
}

/** A rule heading: `## <Rule id="touch-floor" evidence="device" description="..." />`. */
const HEADING = /^## <Rule\s+([^>]*?)\s*\/>\s*$/
const ATTRIBUTE = /([a-z]+)="([^"]*)"/g
const CHECK_LINE = /^- (.*?)\s*`([a-z0-9-]+)`\s*$/

function attributes(source: string): Record<string, string> {
	const found: Record<string, string> = {}
	for (const match of source.matchAll(ATTRIBUTE)) {
		found[match[1]!] = match[2]!
	}
	return found
}

/**
 * The lines of the list an <Index of="..." /> marker in SKILL.md announces,
 * up to the next heading or the next marker. Empty when the marker is absent.
 */
export async function readIndex(skillDir: string, of: string): Promise<string[]> {
	let source: string
	try {
		source = await readFile(join(skillDir, 'SKILL.md'), 'utf8')
	} catch {
		return []
	}

	const lines = source.split(/\r?\n/)
	const start = lines.findIndex((line) => line.trim() === `<Index of="${of}" />`)
	if (start === -1) {
		return []
	}

	const found: string[] = []
	for (const line of lines.slice(start + 1)) {
		if (line.startsWith('#') || line.trim().startsWith('<Index ')) {
			break
		}
		found.push(line)
	}
	return found
}

/** Ids listed under the "always" index in SKILL.md. */
export async function readAlwaysInScope(skillDir: string): Promise<string[]> {
	const ids: string[] = []
	for (const line of await readIndex(skillDir, 'always')) {
		if (!line.startsWith('- ')) {
			continue
		}
		for (const match of line.matchAll(/`([a-z0-9-]+)`/g)) {
			const id = match[1]!
			if (id.includes('-') && !ids.includes(id)) {
				ids.push(id)
			}
		}
	}
	return ids
}

/** File stems listed under one of the file indexes in SKILL.md, such as "base". */
export async function readIndexFiles(skillDir: string, of: string): Promise<string[]> {
	const stems: string[] = []
	for (const line of await readIndex(skillDir, of)) {
		for (const match of line.matchAll(/`(?:heuristics|platform)\/([a-z0-9-]+)\.md`/g)) {
			if (!stems.includes(match[1]!)) {
				stems.push(match[1]!)
			}
		}
	}
	return stems
}

export function parseHeuristic(
	file: string,
	path: string,
	source: string,
	always: string[],
): Heuristic {
	const lines = source.split(/\r?\n/)
	const rules: Rule[] = []
	const order = new Map<string, Rule>()

	const title = lines.find((line) => line.startsWith('# '))?.slice(2).trim() ?? file

	lines.forEach((line, index) => {
		const heading = HEADING.exec(line)
		if (!heading) {
			return
		}
		const attrs = attributes(heading[1]!)
		const id = attrs['id']
		if (!id) {
			return
		}
		const rule: Rule = {
			id,
			title: attrs['description'] ?? '',
			check: '',
			file,
			always: always.includes(id),
			line: index + 1,
			checkLine: 0,
			evidence: attrs['evidence'] === 'device' ? 'device' : 'source',
			severity: severity(attrs['severity']),
			grade: attrs['grade'] === 'binary' ? 'binary' : 'scale',
		}
		rules.push(rule)
		order.set(rule.id, rule)
	})

	const device: string[] = []

	for (const token of tokenize(source)) {
		if (token.type !== 'tag' || token.tag.kind !== 'inline') {
			continue
		}
		if (token.tag.name === 'Device') {
			device.push(token.tag.content)
			continue
		}
		if (token.tag.name !== 'Verify') {
			continue
		}
		const id = token.tag.attributes['rule'] ?? ''
		const known = order.get(id)
		if (known) {
			known.check = token.tag.content
			known.checkLine = token.tag.line + 1
			continue
		}
		const rule: Rule = {
			id,
			title: '',
			check: token.tag.content,
			file,
			always: always.includes(id),
			line: 0,
			checkLine: token.tag.line + 1,
			evidence: 'source',
			severity: 'p2',
			grade: 'scale',
		}
		rules.push(rule)
		order.set(id, rule)
	}

	const start = rules.some((rule) => rule.checkLine > 0)
		? -1
		: lines.findIndex((line) => line.trim() === '## Check')

	if (start !== -1) {
		let seenBullet = false
		for (let index = start + 1; index < lines.length; index += 1) {
			const line = lines[index]!
			if (line.startsWith('## ')) {
				break
			}
			const check = CHECK_LINE.exec(line)
			if (check) {
				seenBullet = true
				const id = check[2]!
				const known = order.get(id)
				if (known) {
					known.check = check[1]!
					known.checkLine = index + 1
				} else {
					const rule: Rule = {
						id,
						title: '',
						check: check[1]!,
						file,
						always: always.includes(id),
						line: 0,
						checkLine: index + 1,
						evidence: 'source',
						severity: 'p2',
						grade: 'scale',
					}
					rules.push(rule)
					order.set(id, rule)
				}
				continue
			}
			if (seenBullet && line.trim() !== '') {
				device.push(line.trim())
			}
		}
	}

	return { file, path, title, rules, device: device.join(' ') }
}

/** Every rule file in the skill, from every rule directory, in filename order. */
export async function readHeuristics(skillDir: string): Promise<Heuristic[]> {
	const always = await readAlwaysInScope(skillDir)
	const heuristics: Heuristic[] = []

	for (const folder of RULE_DIRS) {
		const dir = join(skillDir, folder)
		let names: string[]
		try {
			names = (await readdir(dir)).filter((name) => name.endsWith('.md'))
		} catch {
			// A copy with no platform files in it is still a whole skill.
			continue
		}
		for (const name of names) {
			const source = await readFile(join(dir, name), 'utf8')
			heuristics.push(parseHeuristic(basename(name, '.md'), `${folder}/${name}`, source, always))
		}
	}

	return heuristics.sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : 0))
}
