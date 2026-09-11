import { readdir, readFile, stat } from 'node:fs/promises'
import { extname, join, relative, sep } from 'node:path'

import { DETECTORS } from '../detect/rules.js'
import { type Finding } from '../detect/types.js'

export interface DetectOptions {
	cwd: string
	/** Paths to scan. Empty means the whole project. */
	paths?: string[]
	/** Rule ids or prefixes to run. Empty means every detector. */
	only?: string[]
	format?: string
}

/** Directories a scan never enters, because nothing in them is the app. */
const SKIPPED = new Set([
	'node_modules',
	'build',
	'dist',
	'.dart_tool',
	'Pods',
	'.git',
	'.gradle',
	'DerivedData',
	'ios/Flutter',
])

const EXTENSIONS = new Set(DETECTORS.flatMap((detector) => detector.extensions))

async function walk(root: string, dir: string, found: string[]): Promise<void> {
	let entries
	try {
		entries = await readdir(dir, { withFileTypes: true })
	} catch {
		return
	}

	for (const entry of entries) {
		if (SKIPPED.has(entry.name)) {
			continue
		}
		const full = join(dir, entry.name)
		if (entry.isDirectory()) {
			await walk(root, full, found)
		} else if (entry.isFile() && EXTENSIONS.has(extname(entry.name).toLowerCase())) {
			found.push(relative(root, full).split(sep).join('/'))
		}
	}
}

/** Files the detectors can read, under the paths asked for. */
async function scannable(cwd: string, paths: string[]): Promise<string[]> {
	const found: string[] = []

	for (const path of paths.length > 0 ? paths : ['.']) {
		const full = join(cwd, path)
		const info = await stat(full).catch(() => null)
		if (!info) {
			continue
		}
		if (info.isDirectory()) {
			await walk(cwd, full, found)
		} else if (EXTENSIONS.has(extname(full).toLowerCase())) {
			found.push(relative(cwd, full).split(sep).join('/'))
		}
	}

	return found.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
}

export async function detect(options: DetectOptions): Promise<number> {
	const { cwd } = options
	const only = options.only ?? []
	const detectors = DETECTORS.filter(
		(detector) => only.length === 0 || only.some((term) => detector.rule === term || detector.rule.startsWith(term)),
	)

	if (detectors.length === 0) {
		console.error(`no detector matches --only ${only.join(', ')}`)
		console.error(`detectors: ${DETECTORS.map((detector) => detector.rule).join(', ')}`)
		return 1
	}

	const files = await scannable(cwd, options.paths ?? [])
	const findings: Finding[] = []

	for (const file of files) {
		const source = await readFile(join(cwd, ...file.split('/')), 'utf8')
		const extension = extname(file).toLowerCase()
		for (const detector of detectors) {
			if (detector.extensions.includes(extension)) {
				findings.push(...detector.run(file, source))
			}
		}
	}

	findings.sort((a, b) => (a.file === b.file ? a.line - b.line : a.file < b.file ? -1 : 1))

	if (options.format === 'json') {
		console.log(
			JSON.stringify(
				{
					scanned: files.length,
					rules: detectors.map((detector) => detector.rule),
					findings,
				},
				undefined,
				'\t',
			),
		)
		return findings.length > 0 ? 2 : 0
	}

	for (const found of findings) {
		console.log(`${found.file}:${found.line}  ${found.rule}  ${found.message}`)
	}

	console.log(
		`\n${findings.length} finding(s) in ${files.length} file(s), from ${detectors.length} detector(s).`,
	)
	console.log('Source evidence only: a finding is a place to look, and silence is not a pass.')
	return findings.length > 0 ? 2 : 0
}
