import { rm } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

import { AGENTS, STACKS, type Target } from '../compile.js'
import { flatten, readSources, resolve, write } from '../emit.js'
import {
	AGENT_DIR,
	compiledSkillsDir,
	PUBLISHED_AGENT,
	publishedSkillsDir,
	variantName,
} from '../paths.js'

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

	// The published copies. A stale variant would keep being served, so the
	// directory is emptied rather than written over.
	await rm(publishedSkillsDir, { recursive: true, force: true })
	let published = 0
	for (const stack of variants) {
		const target: Target = stack ? { agent: PUBLISHED_AGENT, stack } : { agent: PUBLISHED_AGENT }
		const destination = join(publishedSkillsDir, variantName('trunative', stack))
		published += await write(resolve(sources, target), destination)
	}

	// One more published copy, the whole skill in a single file. It is stackless
	// and resolved for the same agent as the others, because what it is for is a
	// context that gets filled once rather than a project that reads files.
	const full = variantName('trunative', 'full')
	published += await write(
		flatten(resolve(sources, { agent: PUBLISHED_AGENT })),
		join(publishedSkillsDir, full),
	)

	const names = [...variants.map((stack) => variantName('trunative', stack)), full].join(', ')
	const dirs = AGENTS.map((agent) => AGENT_DIR[agent] ?? `.${agent}`).join(', ')
	const at = (path: string) => relative(process.cwd(), path).split(sep).join('/')
	console.log(`built ${written} files for trunative ${options.version}`)
	console.log(`directories: ${dirs}`)
	console.log(`skills in each: ${names}`)
	console.log(`into ${at(compiledSkillsDir)}`)
	console.log(
		`published ${published} files into ${at(publishedSkillsDir)} (${names}, resolved for ${PUBLISHED_AGENT})`,
	)
	return 0
}
