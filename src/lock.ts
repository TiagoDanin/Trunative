import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { CONFIG_DIR, LOCK_FILE } from './paths.js'

/** One installed copy: which agent and stack it was resolved for. */
export interface LockTarget {
	/** Project-relative directory, such as ".claude/skills/trunative-flutter". */
	dir: string
	/** Agent whose branches this copy resolves. */
	agent: string
	/** Stack it was resolved for, absent on the generic copy. */
	stack?: string
	/** Content hash of the resolved copy, which is not the hash of the source. */
	hash: string
}

export interface SkillLock {
	/** Version of the trunative package that performed the install. */
	version: string
	/** Skill name, taken from the SKILL.md frontmatter. */
	skill: string
	/** Content hash of the written skill, before any tag was resolved. */
	hash: string
	installedAt: string
	targets: LockTarget[]
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
