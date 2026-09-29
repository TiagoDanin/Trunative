import { stat } from 'node:fs/promises'
import { join, relative } from 'node:path'

import { type Target } from '../compile.js'
import { readSources, resolve } from '../emit.js'
import { compareVersions, readLock } from '../lock.js'
import { AGENT_ROOTS, briefCandidates, fullName, packagedSkillDir } from '../paths.js'
import { hashFiles, hashSkill, readSkillName } from '../skill.js'

export interface DoctorOptions {
	cwd: string
	version: string
}

interface Check {
	name: string
	ok: boolean
	detail: string
}

async function exists(path: string): Promise<boolean> {
	try {
		await stat(path)
		return true
	} catch {
		return false
	}
}

async function checkBrief(cwd: string, file: string, label: string): Promise<Check> {
	for (const candidate of briefCandidates(cwd, file)) {
		if (await exists(candidate)) {
			return { name: label, ok: true, detail: relative(cwd, candidate).replace(/\\/g, '/') }
		}
	}

	return {
		name: label,
		ok: false,
		detail: `not found, expected .trunative/${file} or ${file}`,
	}
}

/**
 * Compares each installed copy against the same variant resolved from the
 * skill shipping in this package. Every target has its own hash, because a copy
 * resolved for one agent and one stack is not the same bytes as another.
 */
async function checkSkill(cwd: string, version: string): Promise<Check[]> {
	const source = await hashSkill(packagedSkillDir)
	const name = await readSkillName(packagedSkillDir)
	const lock = await readLock(cwd)

	if (!lock) {
		return [
			{
				name: 'skill installed',
				ok: false,
				detail: 'no .trunative/skill.lock, run "npx trunative install"',
			},
		]
	}

	const checks: Check[] = [
		{
			name: 'skill installed',
			ok: true,
			detail: `${lock.skill} in ${lock.targets.map((target) => target.dir).join(', ')}`,
		},
	]

	const sources = await readSources()
	const missing: string[] = []
	const stale: string[] = []

	for (const target of lock.targets) {
		const destination = join(cwd, ...target.dir.split('/'))
		if (!(await exists(destination))) {
			missing.push(target.dir)
			continue
		}
		const shape: Target = target.stack
			? { agent: target.agent, stack: target.stack }
			: { agent: target.agent }
		if ((await hashSkill(destination)) !== hashFiles(resolve(sources, shape))) {
			stale.push(target.dir)
		}
	}

	if (missing.length > 0) {
		checks.push({
			name: 'skill present',
			ok: false,
			detail: `missing in ${missing.join(', ')}, run "npx trunative install"`,
		})
	}

	if (compareVersions(lock.version, version) > 0) {
		// The copy is newer than this CLI, so the difference is this package and
		// not the project. Installing from here would delete what it lacks.
		checks.push({
			name: 'skill up to date',
			ok: false,
			detail: `installed with trunative@${lock.version}, newer than this CLI (${version}): run "npx trunative@${lock.version} doctor", and never install with this one, it would downgrade the skill`,
		})
	} else if (stale.length > 0 || lock.hash !== source) {
		const reason =
			stale.length > 0
				? `content differs in ${stale.join(', ')}, from a hand edit, a copy taken from another project or another installer`
				: `installed with trunative@${lock.version}, this is ${version}`
		checks.push({
			name: 'skill up to date',
			ok: false,
			detail: `${reason}, run "npx trunative install"`,
		})
	} else {
		checks.push({ name: 'skill up to date', ok: true, detail: `${name} ${source.slice(0, 19)}` })
	}

	return checks
}

/**
 * The single-file copy beside an agent's skills. It is the whole skill inlined,
 * so an agent that loads it reads every rule, procedure and reference in one go
 * and loses the lot at the first compaction.
 */
async function checkFullCopy(cwd: string): Promise<Check> {
	const full = fullName(await readSkillName(packagedSkillDir))
	const found: string[] = []
	for (const root of AGENT_ROOTS) {
		const dir = [root, 'skills', full].join('/')
		if (await exists(join(cwd, ...dir.split('/')))) {
			found.push(dir)
		}
	}
	if (found.length === 0) {
		return { name: 'no full copy', ok: true, detail: `no ${full} in an agent directory` }
	}
	return {
		name: 'no full copy',
		ok: false,
		detail: `${found.join(', ')} inlines the whole skill into the context, remove it or run "npx trunative install"`,
	}
}

export async function doctor(options: DoctorOptions): Promise<number> {
	const { cwd, version } = options

	const checks: Check[] = [
		await checkBrief(cwd, 'PRODUCT.md', 'product brief'),
		await checkBrief(cwd, 'DESIGN.md', 'design brief'),
		await checkBrief(cwd, 'STACK.md', 'stack brief'),
		...(await checkSkill(cwd, version)),
		await checkFullCopy(cwd),
	]

	const width = Math.max(...checks.map((check) => check.name.length))
	for (const check of checks) {
		console.log(`${check.ok ? 'PASS' : 'FAIL'}  ${check.name.padEnd(width)}  ${check.detail}`)
	}

	const failed = checks.filter((check) => !check.ok)
	if (failed.length === 0) {
		console.log('\nReady. Start the build step.')
		return 0
	}

	console.log(`\n${failed.length} check(s) failed. Fix them before the build step.`)
	return 1
}
