import { stat } from 'node:fs/promises'
import { join, relative } from 'node:path'

import { readLock } from '../lock.js'
import { briefCandidates, packagedSkillDir } from '../paths.js'
import { hashSkill, readSkillName } from '../skill.js'

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
 * Compares the skill installed in the project against the one shipping in this
 * package. A different hash means the project is running an older copy.
 */
async function checkSkill(cwd: string, version: string): Promise<Check[]> {
	const expected = await hashSkill(packagedSkillDir)
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
		{ name: 'skill installed', ok: true, detail: `${lock.skill} in ${lock.targets.join(', ')}` },
	]

	const missing: string[] = []
	const stale: string[] = []

	for (const target of lock.targets) {
		const destination = join(cwd, ...target.split('/'))
		if (!(await exists(destination))) {
			missing.push(target)
			continue
		}
		if ((await hashSkill(destination)) !== expected) {
			stale.push(target)
		}
	}

	if (missing.length > 0) {
		checks.push({
			name: 'skill present',
			ok: false,
			detail: `missing in ${missing.join(', ')}, run "npx trunative install"`,
		})
	}

	if (stale.length > 0 || lock.hash !== expected) {
		const reason =
			stale.length > 0
				? `content differs in ${stale.join(', ')}`
				: `installed with trunative@${lock.version}, this is ${version}`
		checks.push({
			name: 'skill up to date',
			ok: false,
			detail: `${reason}, run "npx trunative install"`,
		})
	} else {
		checks.push({ name: 'skill up to date', ok: true, detail: `${name} ${expected.slice(0, 19)}` })
	}

	return checks
}

export async function doctor(options: DoctorOptions): Promise<number> {
	const { cwd, version } = options

	const checks: Check[] = [
		await checkBrief(cwd, 'PRODUCT.md', 'product brief'),
		await checkBrief(cwd, 'DESIGN.md', 'design brief'),
		...(await checkSkill(cwd, version)),
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
