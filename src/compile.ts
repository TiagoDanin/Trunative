import { tokenize, values, type Tag, type Token } from './mdx.js'

/**
 * A build target. The agent is always resolved, because a built copy lives in
 * one agent's directory. The stack is resolved only in a per-stack variant; the
 * generic variant keeps every branch, labelled.
 */
export interface Target {
	agent: string
	stack?: string
}

/** Agent values a block may carry. Zed and anything else reads the "other" build. */
export const AGENTS = ['claude', 'codex', 'antigravity', 'opencode', 'other'] as const

/** Stack values a block may carry, in the order STACK.md may record them. */
export const STACKS = ['flutter', 'expo', 'react-native', 'swiftui', 'compose', 'web'] as const

/** Expo runs React Native, so it follows that branch when it has none of its own. */
const INHERITS: Record<string, string> = { expo: 'react-native' }

const STACK_LABELS: Record<string, string> = {
	flutter: 'Flutter',
	expo: 'Expo',
	'react-native': 'React Native',
	swiftui: 'SwiftUI',
	compose: 'Jetpack Compose',
	web: 'Mobile web',
	other: 'Any other stack',
}

/**
 * How a question reaches the user, per harness. The compiler writes one of
 * these in front of the question, so no flow file carries the mechanism.
 */
const ASK: Record<string, (header: string) => string> = {
	claude: (header) =>
		`Ask this with the AskUserQuestion tool: \`header\` is "${header}", the options below are the options in that order, and the recommended one carries "(recommended)" at the end of its label. Wait for the answer before writing anything.`,
	codex: (header) =>
		`Ask this with the harness's question tool when the session exposes one, labelled "${header}", the options below in that order with the recommended one first and named as the recommendation. When it does not, ask in plain text ending in a question mark. Wait for the answer before writing anything.`,
	antigravity: (header) =>
		`Ask this with the harness's question tool when the session exposes one, labelled "${header}", the options below in that order with the recommended one first and named as the recommendation. When it does not, ask in plain text ending in a question mark. Wait for the answer before writing anything.`,
	opencode: (header) =>
		`Ask this in plain text, ending in a question mark, under the label "${header}", with the options below listed in that order and the recommended one named as the recommendation. Wait for the answer before writing anything.`,
	other: (header) =>
		`Ask this in plain text, ending in a question mark, under the label "${header}", with the options below listed in that order and the recommended one named as the recommendation. Wait for the answer before writing anything.`,
}

function matches(tag: Tag, target: Target): boolean | 'label' {
	const agent = values(tag.attributes['agent'])
	if (agent.length > 0) {
		return agent.includes(target.agent)
	}

	const stack = values(tag.attributes['stack'])
	if (stack.includes('undecided')) {
		return !target.stack
	}
	if (!target.stack) {
		return 'label'
	}
	if (stack.includes(target.stack)) {
		return true
	}
	const inherited = INHERITS[target.stack]
	return inherited ? stack.includes(inherited) : false
}

/**
 * Sibling blocks, meaning a run of <If> blocks with nothing but blank lines
 * between them. An "other" branch answers for its own run, not for the file.
 */
function groupsOf(tokens: Token[]): Map<Tag, Tag[]> {
	const groups = new Map<Tag, Tag[]>()
	let group: Tag[] = []
	let depth = 0

	const flush = (): void => {
		for (const tag of group) {
			groups.set(tag, group)
		}
		group = []
	}

	for (const token of tokens) {
		if (token.type === 'tag') {
			if (token.tag.name !== 'If') {
				continue
			}
			if (token.tag.kind === 'open') {
				if (depth === 0) {
					group.push(token.tag)
				}
				depth += 1
			} else if (token.tag.kind === 'close') {
				depth = Math.max(0, depth - 1)
			}
			continue
		}
		if (depth === 0 && token.text.trim() !== '' && group.length > 0) {
			flush()
		}
	}

	flush()
	return groups
}

/** True when nothing else in the run matched, so the "other" branch answers. */
function otherWins(group: Tag[] | undefined, tag: Tag, target: Target): boolean {
	return !(group ?? [tag]).some((sibling) => sibling !== tag && matches(sibling, target) === true)
}

function label(kind: 'agent' | 'stack', tag: Tag): string {
	const list = values(tag.attributes[kind])
	return list.map((value) => STACK_LABELS[value] ?? value).join(' and ')
}

function collapse(lines: string[]): string[] {
	const out: string[] = []
	let fence = false
	for (const line of lines) {
		if (/^\s*(```|~~~)/.test(line)) {
			fence = !fence
		}
		if (!fence && line.trim() === '' && out.length > 0 && out[out.length - 1]!.trim() === '') {
			continue
		}
		out.push(line)
	}
	while (out.length > 0 && out[out.length - 1]!.trim() === '') {
		out.pop()
	}
	return out
}

/** One rule heading, as the shipped file spells it. */
function heading(tag: Tag): string {
	const id = tag.attributes['id'] ?? ''
	const description = tag.attributes['description'] ?? ''
	return `${tag.prefix}\`${id}\` ${description}`.trimEnd()
}

/**
 * Turns one source file into the text a given agent reads. Every tag is either
 * resolved or rendered as prose: nothing tagged survives into the output.
 */
export function compile(source: string, target: Target): string {
	const tokens = tokenize(source)
	const groups = groupsOf(tokens)

	const out: string[] = []
	let skipDepth = 0
	let ask: {
		header: string
		question: string[]
		options: string[]
		current: string[] | null
		recommended: boolean
	} | null = null

	for (const token of tokens) {
		if (token.type === 'text') {
			if (skipDepth > 0) {
				continue
			}
			if (ask) {
				if (ask.current) {
					ask.current.push(token.text)
				} else {
					ask.question.push(token.text)
				}
				continue
			}
			out.push(token.text)
			continue
		}

		const tag = token.tag

		if (tag.name === 'If') {
			if (tag.kind === 'close') {
				if (skipDepth > 0) {
					skipDepth -= 1
				}
				continue
			}
			if (skipDepth > 0) {
				skipDepth += 1
				continue
			}
			const verdict = matches(tag, target)
			if (verdict === 'label') {
				out.push(`**${label('stack', tag)}**`, '')
				continue
			}
			const isOther =
				values(tag.attributes['agent']).includes('other') ||
				values(tag.attributes['stack']).includes('other')
			if (verdict === true || (isOther && otherWins(groups.get(tag), tag, target))) {
				continue
			}
			skipDepth = 1
			continue
		}

		if (skipDepth > 0) {
			continue
		}

		if (tag.name === 'Rule') {
			out.push(heading(tag))
			continue
		}

		if (tag.name === 'Index') {
			continue
		}

		if (tag.name === 'Ask') {
			if (tag.kind === 'open') {
				ask = {
					header: tag.attributes['header'] ?? '',
					question: [],
					options: [],
					current: null,
					recommended: false,
				}
				continue
			}
			if (ask) {
				const lead = (ASK[target.agent] ?? ASK['other']!)(ask.header)
				out.push(...collapse(ask.question), '', lead, '', ...ask.options)
				ask = null
			}
			continue
		}

		if (tag.name === 'Option' && ask) {
			if (tag.kind === 'open') {
				ask.current = []
				ask.recommended = tag.flags.includes('recommended')
				continue
			}
			const text = collapse(ask.current ?? [])
				.map((line) => line.trim())
				.filter(Boolean)
				.join(' ')
			ask.options.push(`- ${text}${ask.recommended ? ' (recommended)' : ''}`)
			ask.current = null
			ask.recommended = false
			continue
		}
	}

	return `${collapse(out).join('\n')}\n`
}

/**
 * A rule heading is the one tag that carries content rather than a decision, so
 * a file with nothing but headings still differs between variants only through
 * the blocks around it. Every stack gets a copy regardless: the entry file names
 * the stack it was resolved for, and an undecided block is dropped from it.
 */
export function variantStacks(): string[] {
	return [...STACKS]
}
