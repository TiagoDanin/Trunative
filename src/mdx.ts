/**
 * The tag syntax the skill is written in. Every tag sits alone on its line,
 * optionally behind a heading marker, and nothing inside a fenced code block is
 * a tag. This module is the only place that knows the grammar.
 */

export type TagKind = 'open' | 'close' | 'self'

export interface Tag {
	/** 0-based index of the line the tag sits on. */
	line: number
	name: string
	kind: TagKind
	/** Heading marker in front of the tag, such as "## ". Empty when there is none. */
	prefix: string
	attributes: Record<string, string>
	/** Attributes written without a value, such as "recommended". */
	flags: string[]
}

/** A line of a file: either a tag or the text it is not. */
export type Token = { type: 'tag'; tag: Tag } | { type: 'text'; line: number; text: string }

const TAG_LINE = /^(#{1,6}\s+)?<\s*(\/?)\s*([A-Z][A-Za-z]*)\s*([^>]*?)\s*(\/?)>\s*$/
const ATTRIBUTE = /([a-zA-Z-]+)(?:="([^"]*)")?/g
const FENCE = /^\s*(```|~~~)/

function parseAttributes(source: string): Pick<Tag, 'attributes' | 'flags'> {
	const attributes: Record<string, string> = {}
	const flags: string[] = []

	for (const match of source.matchAll(ATTRIBUTE)) {
		if (match[2] === undefined) {
			flags.push(match[1]!)
		} else {
			attributes[match[1]!] = match[2]
		}
	}

	return { attributes, flags }
}

/** Every line of the file, with the tag lines parsed. Code fences pass as text. */
export function tokenize(source: string): Token[] {
	const tokens: Token[] = []
	let fence = ''

	source.split(/\r?\n/).forEach((text, line) => {
		const opener = FENCE.exec(text)
		if (fence) {
			if (opener && text.trim().startsWith(fence)) {
				fence = ''
			}
			tokens.push({ type: 'text', line, text })
			return
		}
		if (opener) {
			fence = opener[1]!
			tokens.push({ type: 'text', line, text })
			return
		}

		const match = TAG_LINE.exec(text)
		if (!match) {
			tokens.push({ type: 'text', line, text })
			return
		}

		const closing = match[2] === '/'
		const self = match[5] === '/'
		tokens.push({
			type: 'tag',
			tag: {
				line,
				name: match[3]!,
				kind: closing ? 'close' : self ? 'self' : 'open',
				prefix: match[1] ?? '',
				...parseAttributes(match[4] ?? ''),
			},
		})
	})

	return tokens
}

/** Comma separated attribute values, such as agent="codex, antigravity". */
export function values(attribute: string | undefined): string[] {
	return (attribute ?? '')
		.split(',')
		.map((value) => value.trim())
		.filter(Boolean)
}
