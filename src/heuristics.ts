import { readdir, readFile } from 'node:fs/promises'
import { basename, join } from 'node:path'

/** One rule: a "## `id` Title" section and the Check line that verifies it. */
export interface Rule {
	id: string
	/** Heading text after the id. Empty when only a Check line defines the rule. */
	title: string
	/** The Check line without its trailing id. Empty when the rule has none. */
	check: string
	/** Stem of the file that owns it, such as "touch". */
	file: string
	/** Listed under "Always in scope" in SKILL.md, so every run scores it. */
	always: boolean
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

const HEADING = /^## `([a-z0-9-]+)`\s*(.*)$/
const CHECK_LINE = /^- (.*?)\s*`([a-z0-9-]+)`\s*$/

/** Ids listed under "## Always in scope" in SKILL.md. */
export async function readAlwaysInScope(skillDir: string): Promise<string[]> {
	let source: string
	try {
		source = await readFile(join(skillDir, 'SKILL.md'), 'utf8')
	} catch {
		return []
	}

	const lines = source.split(/\r?\n/)
	const start = lines.findIndex((line) => line.trim() === '## Always in scope')
	if (start === -1) {
		return []
	}

	const ids: string[] = []
	for (const line of lines.slice(start + 1)) {
		if (line.startsWith('## ')) {
			break
		}
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

function parseHeuristic(file: string, path: string, source: string, always: string[]): Heuristic {
	const lines = source.split(/\r?\n/)
	const rules: Rule[] = []
	const order = new Map<string, Rule>()

	const title = lines.find((line) => line.startsWith('# '))?.slice(2).trim() ?? file

	for (const line of lines) {
		const heading = HEADING.exec(line)
		if (!heading) {
			continue
		}
		const rule: Rule = {
			id: heading[1]!,
			title: heading[2]!.trim(),
			check: '',
			file,
			always: always.includes(heading[1]!),
		}
		rules.push(rule)
		order.set(rule.id, rule)
	}

	const start = lines.findIndex((line) => line.trim() === '## Check')
	const device: string[] = []

	if (start !== -1) {
		let seenBullet = false
		for (const line of lines.slice(start + 1)) {
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
				} else {
					const rule: Rule = {
						id,
						title: '',
						check: check[1]!,
						file,
						always: always.includes(id),
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

/** Every heuristics file in the skill, in filename order. */
export async function readHeuristics(skillDir: string): Promise<Heuristic[]> {
	const dir = join(skillDir, 'heuristics')
	const names = (await readdir(dir))
		.filter((name) => name.endsWith('.md'))
		.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))

	const always = await readAlwaysInScope(skillDir)
	const heuristics: Heuristic[] = []

	for (const name of names) {
		const source = await readFile(join(dir, name), 'utf8')
		const file = basename(name, '.md')
		heuristics.push(parseHeuristic(file, `heuristics/${name}`, source, always))
	}

	return heuristics
}
