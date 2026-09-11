import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'

import { STACKS, type Target } from '../compile.js'
import { readSources, resolve, write } from '../emit.js'
import { writeLock, type LockTarget } from '../lock.js'
import {
	AGENT_ROOTS,
	DEFAULT_AGENT_ROOT,
	agentFor,
	briefCandidates,
	packagedSkillDir,
	variantName,
} from '../paths.js'
import { hashFiles, hashSkill, readSkillName } from '../skill.js'

export interface InstallOptions {
	cwd: string
	version: string
	/** Explicit destination directories, project-relative. Overrides detection. */
	dirs?: string[]
	/** Stack to resolve for, overriding the one STACK.md records. */
	stack?: string
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

/**
 * The stack the project recorded, from the "Stack:" line init writes at the top
 * of STACK.md. Absent means the generic copy, which carries every branch.
 */
export async function readStack(cwd: string): Promise<string | undefined> {
	for (const candidate of briefCandidates(cwd, 'STACK.md')) {
		let source: string
		try {
			source = await readFile(candidate, 'utf8')
		} catch {
			continue
		}
		const match = /^Stack:\s*([a-z-]+)\s*$/m.exec(source)
		const stack = match?.[1]
		return stack && (STACKS as readonly string[]).includes(stack) ? stack : undefined
	}
	return undefined
}

export async function install(options: InstallOptions): Promise<number> {
	const { cwd, version } = options

	const name = await readSkillName(packagedSkillDir)
	const sources = await readSources()
	const stack = options.stack ?? (await readStack(cwd))
	const skill = variantName(name, stack)

	const roots = options.dirs ?? (await detectAgentRoots(cwd))
	const targets: LockTarget[] = []

	for (const root of roots) {
		const agent = options.dirs ? 'other' : agentFor(root)
		const target: Target = stack ? { agent, stack } : { agent }
		const files = resolve(sources, target)
		const dir = options.dirs ? root : [root, 'skills', skill].join('/')

		await write(files, join(cwd, ...dir.split('/')))
		targets.push({ dir, agent, ...(stack ? { stack } : {}), hash: hashFiles(files) })
		console.log(`installed ${skill} into ${dir} (resolved for ${agent})`)
	}

	await writeLock(cwd, {
		version,
		skill,
		hash: await hashSkill(packagedSkillDir),
		installedAt: new Date().toISOString(),
		targets,
	})

	console.log(`wrote .trunative/skill.lock (${stack ? `stack ${stack}` : 'no stack recorded yet'})`)
	console.log('run "npx trunative doctor" to check the project briefs')
	return 0
}
