/** One thing a detector found, always named by the rule it belongs to. */
export interface Finding {
	/** The rule id. A finding with no rule has nowhere to land in the review. */
	rule: string
	/** Project-relative path, forward slashes. */
	file: string
	/** 1-based. 0 when the finding is about the file rather than a line. */
	line: number
	/** The line as written, trimmed. Empty for a whole-file finding. */
	snippet: string
	/** What is wrong, in one sentence, in the skill's own vocabulary. */
	message: string
}

/**
 * A detector answers one rule mechanically, over the languages it understands.
 * It reads text and never a rendered screen, so everything it returns is source
 * evidence: it can raise a finding, and its silence proves nothing.
 */
export interface Detector {
	rule: string
	/** File extensions it reads, lowercase, with the dot. */
	extensions: string[]
	run(file: string, source: string): Finding[]
}

/** Lines with their 1-based numbers, with block comments already dropped. */
export function lines(source: string): { line: number; text: string }[] {
	return source
		.replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ' '))
		.split(/\r?\n/)
		.map((text, index) => ({ line: index + 1, text }))
		.filter(({ text }) => !/^\s*(\/\/|#|<!--)/.test(text))
}

/**
 * Every match of a pattern, with the line it sits on and the text that follows
 * it. Widgets span lines, so a per-line test calls a labelled control unlabelled
 * whenever the label is on the next line.
 */
export function occurrences(
	source: string,
	pattern: RegExp,
	span = 600,
): { line: number; text: string; window: string }[] {
	const clean = source.replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ' '))
	const found: { line: number; text: string; window: string }[] = []
	const global = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`)

	for (const match of clean.matchAll(global)) {
		const index = match.index ?? 0
		const before = clean.slice(0, index)
		const start = before.lastIndexOf('\n') + 1
		const text = clean.slice(start, clean.indexOf('\n', index) === -1 ? undefined : clean.indexOf('\n', index))
		if (/^\s*(\/\/|#|<!--)/.test(text)) {
			continue
		}
		found.push({
			line: before.split('\n').length,
			text,
			window: clean.slice(index, index + span),
		})
	}

	return found
}

export function finding(
	rule: string,
	file: string,
	line: number,
	text: string,
	message: string,
): Finding {
	return { rule, file, line, snippet: text.trim().slice(0, 160), message }
}
