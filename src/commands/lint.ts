import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { readGraph, type Finding } from '../graph.js'
import { packageRoot, packagedSkillDir } from '../paths.js'

export interface LintOptions {
	cwd: string
}

/** Written prose the skill never ships, checked here rather than by eye. */
const FORBIDDEN: { pattern: RegExp; kind: string; detail: string }[] = [
	{ pattern: /[—–]/, kind: 'dash', detail: 'em dash or en dash' },
	{ pattern: /<if:|<endif>|<else>/, kind: 'old syntax', detail: 'pre-MDX conditional' },
]

async function prose(skillDir: string, files: string[]): Promise<Finding[]> {
	const findings: Finding[] = []

	for (const file of files) {
		let source: string
		try {
			source = await readFile(join(skillDir, file), 'utf8')
		} catch {
			continue
		}
		source.split(/\r?\n/).forEach((line, index) => {
			for (const rule of FORBIDDEN) {
				if (rule.pattern.test(line)) {
					findings.push({ kind: rule.kind, detail: rule.detail, file, line: index + 1 })
				}
			}
		})
	}

	return findings
}

/**
 * The README summarises the rules and cites them by id, so a rename that misses
 * it leaves the entry point of the repository pointing at nothing.
 */
async function readmeCitations(graph: Awaited<ReturnType<typeof readGraph>>): Promise<Finding[]> {
	const findings: Finding[] = []
	let source: string
	try {
		source = await readFile(join(packageRoot, 'README.md'), 'utf8')
	} catch {
		return findings
	}

	const ids = new Set(graph.rules.map((rule) => rule.id))
	const prefixes = [...new Set(graph.rules.map((rule) => rule.id.split('-')[0]! + '-'))]

	source.split(/\r?\n/).forEach((line, index) => {
		for (const match of line.matchAll(/`([a-z0-9][a-z0-9-]*)`/g)) {
			const token = match[1]!
			if (ids.has(token) || prefixes.includes(token) || !prefixes.some((p) => token.startsWith(p))) {
				continue
			}
			findings.push({
				kind: 'dangling id',
				detail: `\`${token}\` is defined nowhere`,
				file: 'README.md',
				line: index + 1,
			})
		}
	})

	return findings
}

export async function lint(options: LintOptions): Promise<number> {
	const graph = await readGraph(packagedSkillDir)

	const markdown = [
		'SKILL.md',
		...graph.files.flow,
		...graph.files.heuristics,
		...graph.files.references,
	].filter((file) => file.endsWith('.md'))

	const findings = [
		...graph.findings,
		...(await prose(packagedSkillDir, markdown)),
		...(await prose(packageRoot, ['README.md'])),
		...(await readmeCitations(graph)),
	]

	if (findings.length === 0) {
		console.log(`PASS  ${graph.rules.length} rules, ${graph.mentions.length} citations, 0 findings`)
		console.log(`      run against ${options.cwd === packageRoot ? 'this repository' : packagedSkillDir}`)
		return 0
	}

	const width = Math.max(...findings.map((finding) => finding.kind.length))
	for (const finding of findings) {
		const where = finding.file ? `${finding.file}${finding.line ? `:${finding.line}` : ''}  ` : ''
		console.log(`FAIL  ${finding.kind.padEnd(width)}  ${where}${finding.detail}`)
	}

	console.log(`\n${findings.length} finding(s) in the written skill.`)
	return 1
}
