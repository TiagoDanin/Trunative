import { basename } from 'node:path'

import { readGraph, type Graph } from '../graph.js'

export interface GraphOptions {
	/** File stems to expand down to their rules. Empty keeps it at file level. */
	only?: string[]
	format?: string
}

const FORMATS = ['mermaid', 'json', 'text']

function id(path: string): string {
	return path.replace(/[^a-zA-Z0-9]/g, '_')
}

/** Heuristic to heuristic, counted, so two files claiming one concern show up. */
function crossReferences(graph: Graph): Map<string, number> {
	const owner = new Map(graph.rules.map((rule) => [rule.id, rule.file]))
	const edges = new Map<string, number>()

	for (const mention of graph.mentions) {
		if (!mention.file.startsWith('heuristics/')) {
			continue
		}
		const from = basename(mention.file, '.md')
		const to = owner.get(mention.id)
		if (!to || to === from) {
			continue
		}
		const key = `${from} ${to}`
		edges.set(key, (edges.get(key) ?? 0) + 1)
	}

	return edges
}

function mermaid(graph: Graph, only: string[]): string {
	const base = graph.index.base.map((path) => basename(path, '.md'))
	const lines = ['flowchart LR', '  SKILL["SKILL.md"]']

	for (const file of graph.index.flow) {
		lines.push(`  SKILL --> ${id(file)}["${file}"]`)
	}

	for (const heuristic of graph.heuristics) {
		const tier = base.includes(heuristic.file) ? 'base' : 'extra'
		const node = id(heuristic.file)

		if (only.includes(heuristic.file)) {
			lines.push(`  subgraph ${node}_g["${heuristic.file} (${tier})"]`)
			for (const rule of heuristic.rules) {
				const mark = rule.evidence === 'device' ? ' [device]' : ''
				lines.push(`    ${id(rule.id)}["${rule.id}${mark}"]`)
			}
			lines.push('  end')
			lines.push(`  SKILL --> ${node}_g`)
			continue
		}

		lines.push(`  SKILL --> ${node}["${heuristic.file} (${tier}, ${heuristic.rules.length})"]`)
	}

	for (const [key, count] of crossReferences(graph)) {
		const [from, to] = key.split(' ') as [string, string]
		lines.push(`  ${id(from)} -.->|${count}| ${id(to)}`)
	}

	for (const file of graph.index.references) {
		const linked = new Set(
			graph.links
				.filter((link) => link.target === file && link.file.startsWith('heuristics/'))
				.map((link) => basename(link.file, '.md')),
		)
		lines.push(`  ${id(file)}(["${file}"])`)
		for (const from of linked) {
			lines.push(`  ${id(from)} --> ${id(file)}`)
		}
	}

	return lines.join('\n')
}

function text(graph: Graph, only: string[]): string {
	const base = graph.index.base.map((path) => basename(path, '.md'))
	const lines = ['SKILL.md']

	lines.push('  flow')
	for (const file of graph.index.flow) {
		lines.push(`    ${file}`)
	}

	for (const tier of ['base', 'extra'] as const) {
		lines.push(`  ${tier}`)
		for (const heuristic of graph.heuristics) {
			const isBase = base.includes(heuristic.file)
			if ((tier === 'base') !== isBase) {
				continue
			}
			lines.push(`    ${heuristic.file} (${heuristic.rules.length} rules)`)
			if (!only.includes(heuristic.file)) {
				continue
			}
			for (const rule of heuristic.rules) {
				const mark = rule.evidence === 'device' ? ' [device]' : ''
				lines.push(`      ${rule.id}${mark}  line ${rule.line}, check ${rule.checkLine}`)
			}
		}
	}

	lines.push('  references')
	for (const file of graph.index.references) {
		const count = graph.links.filter((link) => link.target === file && link.file !== 'SKILL.md').length
		lines.push(`    ${file} (${count} link${count === 1 ? '' : 's'})`)
	}

	return lines.join('\n')
}

export async function graph(options: GraphOptions): Promise<number> {
	const format = options.format ?? 'mermaid'
	if (!FORMATS.includes(format)) {
		console.error(`unknown --format "${format}", expected ${FORMATS.join(', ')}`)
		return 1
	}

	const model = await readGraph()
	const only = options.only ?? []

	if (format === 'json') {
		console.log(JSON.stringify(model, undefined, '\t'))
		return 0
	}

	console.log(format === 'text' ? text(model, only) : mermaid(model, only))
	return 0
}
