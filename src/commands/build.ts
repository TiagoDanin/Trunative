import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative, sep } from 'node:path'

import { AGENTS, compile, variantStacks, type Target } from '../compile.js'
import { AGENT_DIR, compiledSkillsDir, packagedSkillDir, variantName } from '../paths.js'
import { isSkillFile } from '../skill.js'

export interface BuildOptions {
	version: string
}

const STACK_DESCRIPTIONS: Record<string, string> = {
	flutter: 'Flutter',
	expo: 'Expo',
	'react-native': 'React Native',
	swiftui: 'SwiftUI',
	compose: 'Jetpack Compose',
	web: 'mobile web',
}

/** Every file of the source skill, project-relative, in a stable order. */
async function listFiles(root: string): Promise<string[]> {
	const found: string[] = []

	async function walk(dir: string): Promise<void> {
		for (const entry of await readdir(dir, { withFileTypes: true })) {
			if (!isSkillFile(entry.name)) {
				continue
			}
			const full = join(dir, entry.name)
			if (entry.isDirectory()) {
				await walk(full)
			} else if (entry.isFile()) {
				found.push(relative(root, full).split(sep).join('/'))
			}
		}
	}

	await walk(root)
	return found.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
}

/**
 * The entry file names the skill, and a stack variant is a different skill with
 * a different name, or the agent would see several skills claiming one id.
 */
function retitle(source: string, stack: string | undefined): string {
	if (!stack) {
		return source
	}

	const label = STACK_DESCRIPTIONS[stack] ?? stack
	return source
		.replace(/^name:\s*(.+)$/m, (_, name: string) => `name: ${variantName(name.trim(), stack)}`)
		.replace(/^description:\s*(.+)$/m, (_, text: string) =>
			`description: ${text.trim().replace(/for any stack \([^)]*\)/, `in ${label}`)} Install this copy only in a ${label} project.`,
		)
}

export async function build(options: BuildOptions): Promise<number> {
	const files = await listFiles(packagedSkillDir)
	const sources = new Map<string, string>()
	for (const file of files) {
		sources.set(file, await readFile(join(packagedSkillDir, file), 'utf8'))
	}

	const variants: (string | undefined)[] = [undefined, ...variantStacks()]

	await rm(compiledSkillsDir, { recursive: true, force: true })

	let written = 0
	for (const agent of AGENTS) {
		for (const stack of variants) {
			const target: Target = stack ? { agent, stack } : { agent }
			const root = join(
				compiledSkillsDir,
				AGENT_DIR[agent] ?? `.${agent}`,
				'skills',
				variantName('trunative', stack),
			)

			for (const file of files) {
				const source = sources.get(file)!
				const destination = join(root, ...file.split('/'))
				await mkdir(dirname(destination), { recursive: true })

				if (!file.endsWith('.md')) {
					await writeFile(destination, source)
					written += 1
					continue
				}

				const output = compile(source, target)
				await writeFile(destination, file === 'SKILL.md' ? retitle(output, stack) : output, 'utf8')
				written += 1
			}
		}
	}

	const names = variants.map((stack) => variantName('trunative', stack)).join(', ')
	const dirs = AGENTS.map((agent) => AGENT_DIR[agent] ?? `.${agent}`).join(', ')
	console.log(`built ${written} files for trunative ${options.version}`)
	console.log(`directories: ${dirs}`)
	console.log(`skills in each: ${names}`)
	console.log(`into ${relative(process.cwd(), compiledSkillsDir).split(sep).join('/')}`)
	return 0
}
