import { readdir, readFile } from 'node:fs/promises'
import { basename, join } from 'node:path'

import { AGENTS, STACKS } from './compile.js'
import { parseHeuristic, readIndex, type Heuristic, type Rule } from './heuristics.js'
import { tokenize, values, type Tag } from './mdx.js'
import { packagedSkillDir } from './paths.js'

/** A rule id written in backticks somewhere, and where it was written. */
export interface Mention {
	id: string
	file: string
	line: number
	/** The rule whose section holds the mention, when it sits inside one. */
	from?: string
}

/** A link to a file under references/, and who made it. */
export interface Link {
	target: string
	file: string
	line: number
}

export interface Finding {
	kind: string
	detail: string
	file?: string
	line?: number
}

export interface Graph {
	heuristics: Heuristic[]
	/** Rule ids, in the order the files define them. */
	rules: Rule[]
	mentions: Mention[]
	links: Link[]
	/** Files on disk, project-relative to the skill root. */
	files: { flow: string[]; heuristics: string[]; references: string[] }
	/** What SKILL.md lists, which is what the agent can reach. */
	index: { flow: string[]; base: string[]; extra: string[]; references: string[] }
	always: string[]
	tags: { tag: Tag; file: string }[]
	findings: Finding[]
}

const BACKTICKED = /`([a-z0-9][a-z0-9-]*)`/g
const REFERENCE = /`(references\/[a-z0-9-]+\.(?:md|json))`/g
const PREFIX_ROW = /\|\s*`heuristics\/([a-z0-9-]+)\.md`\s*\|\s*`([a-z0-9-]+)`\s*\|/

async function listDir(skillDir: string, dir: string): Promise<string[]> {
	try {
		return (await readdir(join(skillDir, dir)))
			.filter((name) => !name.startsWith('.'))
			.map((name) => `${dir}/${name}`)
			.sort()
	} catch {
		return []
	}
}

/** Paths a SKILL.md index names, such as "flow/init.md". */
function indexed(lines: string[], dir: string): string[] {
	const found: string[] = []
	const pattern = new RegExp('`(' + dir + '/[a-z0-9-]+\\.(?:md|json))`', 'g')
	for (const line of lines) {
		for (const match of line.matchAll(pattern)) {
			if (!found.includes(match[1]!)) {
				found.push(match[1]!)
			}
		}
	}
	return found
}

/** Declared prefix per heuristics file, read from the base and extra tables. */
function prefixes(lines: string[]): Map<string, string> {
	const found = new Map<string, string>()
	for (const line of lines) {
		const row = PREFIX_ROW.exec(line)
		if (row) {
			found.set(row[1]!, row[2]!)
		}
	}
	return found
}

export async function readGraph(skillDir = packagedSkillDir): Promise<Graph> {
	const files = {
		flow: await listDir(skillDir, 'flow'),
		heuristics: await listDir(skillDir, 'heuristics'),
		references: await listDir(skillDir, 'references'),
	}

	const baseLines = await readIndex(skillDir, 'base')
	const extraLines = await readIndex(skillDir, 'extra')
	const index = {
		flow: indexed(await readIndex(skillDir, 'flow'), 'flow'),
		base: indexed(baseLines, 'heuristics'),
		extra: indexed(extraLines, 'heuristics'),
		references: indexed(await readIndex(skillDir, 'references'), 'references'),
	}

	const alwaysLines = await readIndex(skillDir, 'always')
	const always: string[] = []
	for (const line of alwaysLines) {
		for (const match of line.matchAll(BACKTICKED)) {
			if (match[1]!.includes('-') && !always.includes(match[1]!)) {
				always.push(match[1]!)
			}
		}
	}

	const declared = prefixes([...baseLines, ...extraLines])
	const heuristics: Heuristic[] = []
	for (const path of files.heuristics.filter((file) => file.endsWith('.md'))) {
		const source = await readFile(join(skillDir, path), 'utf8')
		heuristics.push(parseHeuristic(basename(path, '.md'), path, source, always))
	}

	const rules = heuristics.flatMap((heuristic) => heuristic.rules)
	const ids = new Set(rules.map((rule) => rule.id))

	/**
	 * A backticked token is a citation when it sits in the prefix namespace the
	 * index declares. Everything else in backticks is a platform constant, and
	 * `email-address` is not a broken link to a rule nobody wrote.
	 */
	const namespace = [...declared.values()]
	const cites = (token: string): boolean =>
		!namespace.includes(token) && namespace.some((prefix) => token.startsWith(prefix))

	const everyFile = ['SKILL.md', ...files.flow, ...files.heuristics, ...files.references]
	const mentions: Mention[] = []
	const links: Link[] = []
	const tags: { tag: Tag; file: string }[] = []

	for (const path of everyFile.filter((file) => file.endsWith('.md'))) {
		const source = await readFile(join(skillDir, path), 'utf8')
		let section: string | undefined

		for (const token of tokenize(source)) {
			if (token.type === 'tag') {
				tags.push({ tag: token.tag, file: path })
				if (token.tag.name === 'Rule') {
					section = token.tag.attributes['id']
				}
			}

			const text = token.type === 'text' ? token.text : token.tag.content
			const line = token.type === 'text' ? token.line : token.tag.line

			for (const match of text.matchAll(BACKTICKED)) {
				const id = match[1]!
				if (ids.has(id) || cites(id)) {
					mentions.push({ id, file: path, line: line + 1, ...(section ? { from: section } : {}) })
				}
			}
			for (const match of text.matchAll(REFERENCE)) {
				links.push({ target: match[1]!, file: path, line: line + 1 })
			}
		}
	}

	return {
		heuristics,
		rules,
		mentions,
		links,
		files,
		index,
		always,
		tags,
		findings: check({ heuristics, rules, mentions, links, files, index, always, tags, declared }),
	}
}

interface CheckInput {
	heuristics: Heuristic[]
	rules: Rule[]
	mentions: Mention[]
	links: Link[]
	files: Graph['files']
	index: Graph['index']
	always: string[]
	tags: { tag: Tag; file: string }[]
	declared: Map<string, string>
}

/** Where each tag is allowed to appear, by directory. */
const PLACEMENT: Record<string, (file: string) => boolean> = {
	Rule: (file) => file.startsWith('heuristics/'),
	Check: (file) => file.startsWith('heuristics/'),
	Verify: (file) => file.startsWith('heuristics/'),
	Device: (file) => file.startsWith('heuristics/'),
	If: (file) => file.startsWith('flow/') || file.startsWith('references/'),
	Ask: (file) => file.startsWith('flow/'),
	Option: (file) => file.startsWith('flow/'),
	Index: (file) => file === 'SKILL.md',
}

const ATTRIBUTES: Record<string, string[]> = {
	Rule: ['id', 'evidence', 'description'],
	Check: ['against'],
	Verify: ['rule'],
	Device: [],
	If: ['agent', 'stack'],
	Ask: ['header'],
	Option: [],
	Index: ['of'],
}

const INDEX_VALUES = ['flow', 'base', 'extra', 'always', 'references']
const STACK_VALUES = [...STACKS, 'other', 'undecided']

function check(input: CheckInput): Finding[] {
	const findings: Finding[] = []
	const add = (kind: string, detail: string, file?: string, line?: number): void => {
		findings.push({ kind, detail, ...(file ? { file } : {}), ...(line ? { line } : {}) })
	}

	const ids = new Set(input.rules.map((rule) => rule.id))

	for (const rule of input.rules) {
		if (rule.line === 0) {
			add('check without rule', `\`${rule.id}\` is verified but never defined`, `heuristics/${rule.file}.md`, rule.checkLine)
		}
		if (rule.checkLine === 0) {
			add('rule without check', `\`${rule.id}\` has no Verify line`, `heuristics/${rule.file}.md`, rule.line)
		}
		if (!rule.title) {
			add('rule without description', `\`${rule.id}\``, `heuristics/${rule.file}.md`, rule.line)
		}
		const prefix = input.declared.get(rule.file)
		if (prefix && !rule.id.startsWith(prefix)) {
			add('prefix', `\`${rule.id}\` does not start with \`${prefix}\``, `heuristics/${rule.file}.md`, rule.line)
		}
	}

	for (const mention of input.mentions) {
		if (!ids.has(mention.id)) {
			add('dangling id', `\`${mention.id}\` is defined nowhere`, mention.file, mention.line)
		}
	}

	for (const id of input.always) {
		if (!ids.has(id)) {
			add('always in scope', `\`${id}\` is listed in SKILL.md and defined nowhere`, 'SKILL.md')
		}
	}

	const base = input.index.base.map((path) => basename(path, '.md'))
	for (const id of input.always) {
		const owner = input.rules.find((rule) => rule.id === id)
		if (owner && !base.includes(owner.file)) {
			add('always in scope', `\`${id}\` lives in ${owner.file}, which is not a base file`, 'SKILL.md')
		}
	}

	const listed = new Set([...input.index.flow, ...input.index.base, ...input.index.extra, ...input.index.references])
	for (const group of ['flow', 'heuristics', 'references'] as const) {
		for (const file of input.files[group]) {
			if (!listed.has(file)) {
				add('not indexed', `${file} exists and no index in SKILL.md lists it`, 'SKILL.md')
			}
		}
		for (const file of group === 'heuristics' ? [...input.index.base, ...input.index.extra] : input.index[group]) {
			if (!input.files[group].includes(file)) {
				add('indexed and missing', `SKILL.md lists ${file} and it is not on disk`, 'SKILL.md')
			}
		}
	}

	for (const file of input.index.references) {
		if (!input.links.some((link) => link.target === file && link.file !== 'SKILL.md')) {
			add('unlinked reference', `${file} is listed and nothing points at it`, 'SKILL.md')
		}
	}
	for (const link of input.links) {
		if (!input.files.references.includes(link.target)) {
			add('dangling link', `${link.target} does not exist`, link.file, link.line)
		}
	}

	const open: { tag: Tag; file: string }[] = []
	for (const { tag, file } of input.tags) {
		const allowed = PLACEMENT[tag.name]
		if (!allowed) {
			add('unknown tag', `<${tag.name}>`, file, tag.line + 1)
			continue
		}
		if (!allowed(file)) {
			add('tag in the wrong place', `<${tag.name}> in ${file}`, file, tag.line + 1)
		}

		for (const name of Object.keys(tag.attributes)) {
			if (!ATTRIBUTES[tag.name]!.includes(name)) {
				add('unknown attribute', `${name} on <${tag.name}>`, file, tag.line + 1)
			}
		}

		if (tag.name === 'If' && tag.kind === 'open') {
			const agent = values(tag.attributes['agent'])
			const stack = values(tag.attributes['stack'])
			if (agent.length > 0 && stack.length > 0) {
				add('If', 'carries both agent and stack', file, tag.line + 1)
			}
			if (agent.length === 0 && stack.length === 0) {
				add('If', 'carries neither agent nor stack', file, tag.line + 1)
			}
			for (const value of agent) {
				if (!(AGENTS as readonly string[]).includes(value)) {
					add('unknown agent', value, file, tag.line + 1)
				}
			}
			for (const value of stack) {
				if (!STACK_VALUES.includes(value)) {
					add('unknown stack', value, file, tag.line + 1)
				}
			}
		}

		if (tag.name === 'Index') {
			const of = tag.attributes['of'] ?? ''
			if (!INDEX_VALUES.includes(of)) {
				add('unknown index', of, file, tag.line + 1)
			}
		}

		if (tag.name === 'Ask' && tag.kind === 'open') {
			const header = tag.attributes['header'] ?? ''
			if (!header) {
				add('Ask', 'has no header', file, tag.line + 1)
			} else if (header.length > 12) {
				add('Ask', `header "${header}" is longer than 12 characters`, file, tag.line + 1)
			}
		}

		if (tag.name === 'Rule' && tag.attributes['evidence'] && tag.attributes['evidence'] !== 'device') {
			add('Rule', `evidence="${tag.attributes['evidence']}" is not a value`, file, tag.line + 1)
		}

		if (tag.kind === 'open') {
			open.push({ tag, file })
		} else if (tag.kind === 'close') {
			const last = open.pop()
			if (!last || last.tag.name !== tag.name) {
				add('unbalanced tag', `</${tag.name}> closes ${last ? `<${last.tag.name}>` : 'nothing'}`, file, tag.line + 1)
			}
		}
	}
	for (const { tag, file } of open) {
		add('unbalanced tag', `<${tag.name}> is never closed`, file, tag.line + 1)
	}

	for (const of of INDEX_VALUES) {
		const count = input.tags.filter(
			(entry) => entry.tag.name === 'Index' && entry.tag.attributes['of'] === of,
		).length
		if (count !== 1) {
			add('index marker', `<Index of="${of}" /> appears ${count} times, expected once`, 'SKILL.md')
		}
	}

	const options = input.tags.filter((entry) => entry.tag.name === 'Option' && entry.tag.kind === 'open')
	const recommended = options.filter((entry) => entry.tag.flags.includes('recommended'))
	if (options.length > 0 && recommended.length > 1) {
		add('Ask', `${recommended.length} options are marked recommended`, recommended[1]!.file)
	}

	return findings
}

/** Every id the skill defines, in file order. Used by the detector registry. */
export function ruleIds(graph: Graph): string[] {
	return graph.rules.map((rule) => rule.id)
}
