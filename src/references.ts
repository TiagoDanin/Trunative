/**
 * Narrowing the lookup material to one stack.
 *
 * A reference file is a table of what every framework calls the same thing, and
 * that shape carries no tag: a column belongs to a framework because of the
 * word in its header, and a row because of the word in its first cell. The
 * compiler cannot resolve what was never branched, so a Flutter copy of the
 * skill was shipping the React Native column beside the Flutter one.
 *
 * This reads those labels and keeps the ones the target stack answers to. It
 * runs over "references/" only: a heuristics file lists every framework's
 * mechanism inside the rule on purpose, and a flow file already branches with
 * <If stack>.
 */

/**
 * What each stack answers to. Platform names are deliberately absent: an "iOS"
 * or "Android" row belongs to every stack that ships on them, and dropping it
 * would take the app icon sizes out of a Flutter copy.
 */
const OWNS: Record<string, string[]> = {
	flutter: ['Flutter'],
	expo: ['Expo', 'React Native'],
	'react-native': ['React Native'],
	swiftui: ['SwiftUI', 'UIKit'],
	compose: ['Jetpack Compose', 'Compose', 'Views'],
	web: ['Mobile web', 'Web'],
}

/** Every framework word. A label carrying none of them is left where it is. */
const VOCABULARY = [...new Set(Object.values(OWNS).flat())]

/**
 * Word bounded and case insensitive, so "Compose" matches "Compose Material 3"
 * and "Jetpack Compose" but not "Icon Composer", and a label reads as a label
 * rather than as a substring of one.
 */
function names(text: string, tokens: string[]): boolean {
	return tokens.some((token) => new RegExp(`\\b${token.replace(/ /g, '\\s+')}\\b`, 'i').test(text))
}

/** A label is dropped only when it names a framework and not the target's. */
function keeps(label: string, stack: string): boolean {
	return !names(label, VOCABULARY) || names(label, OWNS[stack] ?? [])
}

function isRow(line: string): boolean {
	return /^\s*\|/.test(line)
}

function isDelimiter(line: string): boolean {
	return /^\s*\|[\s:|-]+\|\s*$/.test(line)
}

/** The cells of a table row. A pipe inside a cell is escaped, so it is skipped. */
function cells(line: string): string[] {
	const trimmed = line.trim()
	const inner = trimmed.replace(/^\|/, '').replace(/\|$/, '')
	return inner.split(/(?<!\\)\|/)
}

function row(parts: string[]): string {
	return `|${parts.join('|')}|`
}

/** One table, from its header line to the last row. */
interface Table {
	start: number
	header: string
	delimiter: string
	rows: string[]
}

function tableAt(lines: string[], index: number): Table | undefined {
	const header = lines[index]
	const delimiter = lines[index + 1]
	if (header === undefined || delimiter === undefined) {
		return undefined
	}
	if (!isRow(header) || isDelimiter(header) || !isDelimiter(delimiter)) {
		return undefined
	}

	const rows: string[] = []
	for (let at = index + 2; at < lines.length; at += 1) {
		const line = lines[at]!
		if (!isRow(line)) {
			break
		}
		rows.push(line)
	}

	return { start: index, header, delimiter, rows }
}

/**
 * Drops the columns headed by another framework. A table keeps every column
 * when fewer than two would survive, because a table narrowed to one column is
 * a list that lost its subject.
 */
function narrowColumns(table: Table, stack: string): Table {
	const heads = cells(table.header)
	const keep = heads.map((head) => keeps(head, stack))
	if (keep.every(Boolean) || keep.filter(Boolean).length < 2) {
		return table
	}

	const pick = (line: string): string => {
		const parts = cells(line)
		return parts.length === heads.length ? row(parts.filter((_, at) => keep[at])) : line
	}

	return {
		...table,
		header: pick(table.header),
		delimiter: pick(table.delimiter),
		rows: table.rows.map(pick),
	}
}

/**
 * Drops the rows led by another framework. Every row surviving the cut is the
 * signal that the first column is not a framework list at all, so the table is
 * left alone rather than emptied.
 */
function narrowRows(table: Table, stack: string): Table {
	const kept = table.rows.filter((line) => keeps(cells(line)[0] ?? '', stack))
	return kept.length === 0 ? table : { ...table, rows: kept }
}

/** A bullet naming a framework, as "- Flutter: wrap the fields in ...". */
function bulletKeeps(line: string, stack: string): boolean {
	const match = /^\s*[-*]\s+([^:]{1,40}):/.exec(line)
	return match ? keeps(match[1]!, stack) : true
}

/** The file narrowed to one stack. Called with no stack, nothing is dropped. */
export function narrowReferences(source: string, stack: string | undefined): string {
	if (!stack) {
		return source
	}

	const lines = source.split('\n')
	const out: string[] = []

	for (let at = 0; at < lines.length; ) {
		const table = tableAt(lines, at)
		if (!table) {
			const line = lines[at]!
			if (bulletKeeps(line, stack)) {
				out.push(line)
			}
			at += 1
			continue
		}

		const narrowed = narrowRows(narrowColumns(table, stack), stack)
		out.push(narrowed.header, narrowed.delimiter, ...narrowed.rows)
		at += 2 + table.rows.length
	}

	return out.join('\n')
}
