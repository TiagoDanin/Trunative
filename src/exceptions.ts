import { readFile } from 'node:fs/promises'
import { relative } from 'node:path'

import { briefCandidates } from './paths.js'

/** A project's STACK.md, wherever it lives, with the path it was read from. */
export async function readStack(cwd: string): Promise<{ text: string; file: string } | undefined> {
	for (const candidate of briefCandidates(cwd, 'STACK.md')) {
		try {
			const text = await readFile(candidate, 'utf8')
			return { text, file: relative(cwd, candidate).replace(/\\/g, '/') }
		} catch {
			continue
		}
	}
	return undefined
}

/** Rule ids that STACK.md excepts under some paths, and the line that says so. */
export interface PathException {
	rules: string[]
	globs: string[]
	line: number
}

const TICKED = /`([^`]+)`/g
const LIST = '(?:`[^`]+`(?:\\s*,\\s*|\\s+and\\s+)?)+'

/**
 * An exception scoped to paths, in the one shape a tool can read:
 *
 *   - `type-scale`, `touch-nested` in `lib/templates/**`: the reason.
 *
 * Rule ids before " in ", globs after it, the reason after the colon. Any other
 * exception stays prose for the review to read, and is invisible here.
 */
const SCOPED = new RegExp(`^\\s*[-*]\\s+(${LIST})\\s+in\\s+(${LIST})\\s*:`)

export function pathExceptions(text: string): PathException[] {
	const found: PathException[] = []
	text.split(/\r?\n/).forEach((source, index) => {
		const match = SCOPED.exec(source)
		if (!match) {
			return
		}
		const rules = [...match[1]!.matchAll(TICKED)].map((tick) => tick[1]!).filter((id) => /^[a-z0-9]+(-[a-z0-9]+)+$/.test(id))
		const globs = [...match[2]!.matchAll(TICKED)].map((tick) => tick[1]!)
		if (rules.length > 0 && globs.length > 0) {
			found.push({ rules, globs, line: index + 1 })
		}
	})
	return found
}

/**
 * A project-relative path against a glob. `**` crosses folders, `*` and `?`
 * stay inside one, and a glob with no wildcard names a file or everything
 * under a folder.
 */
export function matchesGlob(path: string, glob: string): boolean {
	const clean = glob.replace(/\\/g, '/').replace(/^\.\//, '')
	if (!/[*?]/.test(clean)) {
		const dir = clean.replace(/\/$/, '')
		return path === dir || path.startsWith(`${dir}/`)
	}

	let pattern = ''
	for (let index = 0; index < clean.length; index += 1) {
		const char = clean[index]!
		if (char === '*' && clean[index + 1] === '*') {
			index += 1
			if (clean[index + 1] === '/') {
				index += 1
				pattern += '(?:.*/)?'
			} else {
				pattern += '.*'
			}
		} else if (char === '*') {
			pattern += '[^/]*'
		} else if (char === '?') {
			pattern += '[^/]'
		} else {
			pattern += char.replace(/[.+^${}()|[\]\\]/g, '\\$&')
		}
	}
	return new RegExp(`^${pattern}$`).test(path)
}
