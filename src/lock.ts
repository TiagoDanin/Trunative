import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { CONFIG_DIR, LOCK_FILE } from './paths.js'

export interface SkillLock {
	/** Version of the trunative package that performed the install. */
	version: string
	/** Skill name, taken from the SKILL.md frontmatter. */
	skill: string
	/** Content hash of the skill at install time. */
	hash: string
	installedAt: string
	/** Project-relative directories the skill was copied into. */
	targets: string[]
}

export function lockPath(cwd: string): string {
	return join(cwd, CONFIG_DIR, LOCK_FILE)
}

export async function readLock(cwd: string): Promise<SkillLock | null> {
	try {
		return JSON.parse(await readFile(lockPath(cwd), 'utf8')) as SkillLock
	} catch {
		return null
	}
}

export async function writeLock(cwd: string, lock: SkillLock): Promise<void> {
	await mkdir(join(cwd, CONFIG_DIR), { recursive: true })
	await writeFile(lockPath(cwd), `${JSON.stringify(lock, null, 2)}\n`, 'utf8')
}
