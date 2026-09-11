import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative, sep } from 'node:path'

import { compile, type Target } from './compile.js'
import { packagedSkillDir, variantName } from './paths.js'
import { isSkillFile } from './skill.js'

/** One resolved file, keyed by its path inside the skill. */
export type Sources = Map<string, Buffer>

const STACK_LABELS: Record<string, string> = {
	flutter: 'Flutter',
	expo: 'Expo',
	'react-native': 'React Native',
	swiftui: 'SwiftUI',
	compose: 'Jetpack Compose',
	web: 'mobile web',
}

/** Every file of the source skill, project-relative, in a stable order. */
export async function listSkillFiles(root = packagedSkillDir): Promise<string[]> {
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

/** The written skill, read once and reused for every variant. */
export async function readSources(root = packagedSkillDir): Promise<Sources> {
	const sources: Sources = new Map()
	for (const file of await listSkillFiles(root)) {
		sources.set(file, await readFile(join(root, file)))
	}
	return sources
}

/**
 * The entry file names the skill, and a stack variant is a different skill with
 * a different name, or an agent would see several skills claiming one id.
 */
function retitle(source: string, stack: string | undefined): string {
	if (!stack) {
		return source
	}

	const label = STACK_LABELS[stack] ?? stack
	return source
		.replace(/^name:\s*(.+)$/m, (_, name: string) => `name: ${variantName(name.trim(), stack)}`)
		.replace(
			/^description:\s*(.+)$/m,
			(_, text: string) =>
				`description: ${text.trim().replace(/for any stack \([^)]*\)/, `in ${label}`)} Install this copy only in a ${label} project.`,
		)
}

/** One variant, resolved in memory. Markdown is compiled, anything else copied. */
export function resolve(sources: Sources, target: Target): Map<string, Buffer> {
	const out = new Map<string, Buffer>()

	for (const [file, content] of sources) {
		if (!file.endsWith('.md')) {
			out.set(file, content)
			continue
		}
		const compiled = compile(content.toString('utf8'), target)
		out.set(file, Buffer.from(file === 'SKILL.md' ? retitle(compiled, target.stack) : compiled, 'utf8'))
	}

	return out
}

/** Writes a resolved variant to disk, replacing whatever was there. */
export async function write(files: Map<string, Buffer>, destination: string): Promise<number> {
	await rm(destination, { recursive: true, force: true })

	for (const [file, content] of files) {
		const path = join(destination, ...file.split('/'))
		await mkdir(dirname(path), { recursive: true })
		await writeFile(path, content)
	}

	return files.size
}
