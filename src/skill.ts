import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

export const FALLBACK_SKILL_NAME = 'trunative'

/**
 * Files starting with a dot are repository plumbing (.gitkeep and friends).
 * Skipping them keeps the packaged hash equal to the installed hash.
 */
export function isSkillFile(name: string): boolean {
	return !name.startsWith('.')
}

async function listFiles(root: string): Promise<string[]> {
	const found: string[] = []

	async function walk(dir: string): Promise<void> {
		const entries = await readdir(dir, { withFileTypes: true })
		for (const entry of entries) {
			if (!isSkillFile(entry.name)) {
				continue
			}
			const full = join(dir, entry.name)
			if (entry.isDirectory()) {
				await walk(full)
			} else if (entry.isFile()) {
				found.push(full)
			}
		}
	}

	await walk(root)
	return found
}

/**
 * Content hash of a skill directory. Stable across machines: paths are
 * normalized to forward slashes and sorted before hashing.
 */
export async function hashSkill(root: string): Promise<string> {
	const files = await listFiles(root)
	const relative_paths = files
		.map((file) => relative(root, file).split(sep).join('/'))
		.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))

	const hash = createHash('sha256')
	for (const path of relative_paths) {
		hash.update(path)
		hash.update('\0')
		hash.update(await readFile(join(root, path)))
		hash.update('\0')
	}

	return `sha256:${hash.digest('hex')}`
}

/** Reads the "name" field from the SKILL.md frontmatter. */
export async function readSkillName(skillDir: string): Promise<string> {
	let source: string
	try {
		source = await readFile(join(skillDir, 'SKILL.md'), 'utf8')
	} catch {
		return FALLBACK_SKILL_NAME
	}

	const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)
	if (!match) {
		return FALLBACK_SKILL_NAME
	}

	const name = /^name:\s*(.+)$/m.exec(match[1]!)
	return name ? name[1]!.trim().replace(/^["']|["']$/g, '') : FALLBACK_SKILL_NAME
}
