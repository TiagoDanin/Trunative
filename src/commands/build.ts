import { join, relative, sep } from 'node:path'

import { AGENTS, STACKS, type Target } from '../compile.js'
import { readSources, resolve, write } from '../emit.js'
import { AGENT_DIR, compiledSkillsDir, variantName } from '../paths.js'

export interface BuildOptions {
	version: string
}

export async function build(options: BuildOptions): Promise<number> {
	const sources = await readSources()
	const variants: (string | undefined)[] = [undefined, ...STACKS]

	let written = 0
	for (const agent of AGENTS) {
		for (const stack of variants) {
			const target: Target = stack ? { agent, stack } : { agent }
			const destination = join(
				compiledSkillsDir,
				AGENT_DIR[agent] ?? `.${agent}`,
				'skills',
				variantName('trunative', stack),
			)
			written += await write(resolve(sources, target), destination)
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
