import { cp, mkdir, rm, stat } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

import { writeLock } from '../lock.js'
import { AGENT_ROOTS, DEFAULT_AGENT_ROOT, packagedSkillDir } from '../paths.js'
import { hashSkill, isSkillFile, readSkillName } from '../skill.js'

export interface InstallOptions {
	cwd: string
	version: string
	/** Explicit destination directories, project-relative. Overrides detection. */
	dirs?: string[]
}

async function exists(path: string): Promise<boolean> {
	try {
		await stat(path)
		return true
	} catch {
		return false
	}
}

/**
 * Agent directories already present in the project. A project with no agent
 * directory gets .claude, which is the common default.
 */
async function detectAgentRoots(cwd: string): Promise<string[]> {
	const found: string[] = []
	for (const root of AGENT_ROOTS) {
		if (await exists(join(cwd, root))) {
			found.push(root)
		}
	}
	return found.length > 0 ? found : [DEFAULT_AGENT_ROOT]
}

export async function install(options: InstallOptions): Promise<number> {
	const { cwd, version } = options

	const name = await readSkillName(packagedSkillDir)
	const hash = await hashSkill(packagedSkillDir)

	const roots = options.dirs ?? (await detectAgentRoots(cwd))
	const targets = options.dirs
		? roots
		: roots.map((root) => [root, 'skills', name].join('/'))

	for (const target of targets) {
		const destination = join(cwd, ...target.split('/'))
		await rm(destination, { recursive: true, force: true })
		await mkdir(destination, { recursive: true })
		await cp(packagedSkillDir, destination, {
			recursive: true,
			filter: (source) => {
				const rel = relative(packagedSkillDir, source)
				return rel === '' || rel.split(sep).every(isSkillFile)
			},
		})
		console.log(`installed ${name} into ${target}`)
	}

	await writeLock(cwd, {
		version,
		skill: name,
		hash,
		installedAt: new Date().toISOString(),
		targets,
	})

	console.log(`wrote .trunative/skill.lock (${hash.slice(0, 19)})`)
	console.log('run "npx trunative doctor" to check the project briefs')
	return 0
}
