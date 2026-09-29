import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

import { doctor } from '../src/commands/doctor.js'
import { install } from '../src/commands/install.js'
import { spec } from '../src/commands/spec.js'
import { AGENTS, variantStacks } from '../src/compile.js'
import { readSources, resolve } from '../src/emit.js'
import { readGraph } from '../src/graph.js'
import { readHeuristics } from '../src/heuristics.js'
import { packagedSkillDir } from '../src/paths.js'

/** Lines outside a code fence, which is where a leftover tag would be a defect. */
function prose(text: string): string[] {
	const out: string[] = []
	let fenced = false
	for (const line of text.split(/\r?\n/)) {
		if (/^\s*(```|~~~)/.test(line)) {
			fenced = !fenced
			continue
		}
		if (!fenced) {
			out.push(line)
		}
	}
	return out
}

test('the written skill has no lint findings', async () => {
	const graph = await readGraph()
	assert.deepEqual(graph.findings, [])
})

test('the flow runs init, spec, explore, build, review', async () => {
	const graph = await readGraph()
	const order = ['flow/init.md', 'flow/spec.md', 'flow/explore.md', 'flow/build.md', 'flow/review.md']
	assert.deepEqual(
		graph.index.flow.filter((file) => order.includes(file)),
		order,
	)
})

test('nine rules are always in scope, and none of them is below P1', async () => {
	const graph = await readGraph()
	assert.equal(graph.always.length, 9)
	for (const id of graph.always) {
		const rule = graph.rules.find((candidate) => candidate.id === id)
		assert.ok(rule, `${id} is defined`)
		assert.ok(['p0', 'p1'].includes(rule.severity), `${id} is ${rule.severity}`)
	}
})

test('every rule directory is read, and a rule id is owned by one file', async () => {
	const heuristics = await readHeuristics(packagedSkillDir)
	assert.ok(heuristics.some((heuristic) => heuristic.path.startsWith('platform/')))
	assert.ok(heuristics.some((heuristic) => heuristic.path.startsWith('heuristics/')))

	const seen = new Map<string, string>()
	for (const heuristic of heuristics) {
		for (const rule of heuristic.rules) {
			assert.equal(seen.get(rule.id), undefined, `${rule.id} is in ${seen.get(rule.id)} and ${heuristic.path}`)
			seen.set(rule.id, heuristic.path)
		}
	}
})

test('no variant ships a tag, for any agent or any stack', async () => {
	const sources = await readSources()
	const tag = /^(#{1,6}\s+)?<\/?(Rule|If|Ask|Option|Index|Check|Verify|Device)\b/

	for (const agent of AGENTS) {
		for (const stack of [undefined, ...variantStacks()]) {
			const files = resolve(sources, stack ? { agent, stack } : { agent })
			for (const [file, content] of files) {
				if (!file.endsWith('.md')) {
					continue
				}
				const left = prose(content.toString('utf8')).filter((line) => tag.test(line))
				assert.deepEqual(left, [], `${file} for ${agent}/${stack ?? 'generic'}`)
			}
		}
	}
})

test('a compiled rule heading carries its severity and its pass or fail grade', async () => {
	const files = resolve(await readSources(), { agent: 'other' })
	const accessibility = files.get('heuristics/accessibility.md')!.toString('utf8')
	assert.match(accessibility, /^## `a11y-name` .* \[P1, pass or fail\]$/m)
})

test('the version line in a platform file matches the newest version it names', async () => {
	for (const stem of ['network', 'performance', 'background-work']) {
		const source = await readFile(join(packagedSkillDir, 'platform', `${stem}.md`), 'utf8')
		const line = source.split(/\r?\n/).find((text) => text.startsWith('Platform versions named in this file'))
		assert.ok(line, `${stem} has a version line`)

		const rest = source.replace(line, '')
		for (const [label, pattern] of [
			['Android API', /\bAPI (?:level )?(\d{2})\b/g],
			['Android', /\bAndroid (\d{2})\b/g],
			['iOS', /\biOS (\d{2})\b/g],
		] as const) {
			const named = [...rest.matchAll(pattern)].map((match) => Number(match[1]))
			const claimed = new RegExp(`\\b${label} (\\d{2})\\b`).exec(line)
			if (claimed && named.length > 0) {
				assert.equal(Number(claimed[1]), Math.max(...named), `${stem}: ${label}`)
			}
		}
	}
})

const BRIEF = `---
target: lib/screen.dart
user_goal: know whether to leave now or wait
context:
  environment: on a platform, outdoors
  posture: standing
  hands: one
  attention: a glance
  session_length: seconds
  frequency: many times a day
  interruption: constant
  urgency: high
primary_action: "Set alert"
states:
  loading: a placeholder in the shape of the figure
  empty: no departures today, says when service resumes
  error: retry, keeping the chosen stop
  offline: the last timetable, carrying its age
  partial: n/a, the board loads whole or fails
  permission: n/a, nothing here is behind a grant
scope:
  open: [offline]
  closed:
    lists: later departures are a strip of three, not a list
  auto_excluded: [chat, camera]
---

# Departures
`

const WIREFRAME = `<!-- explore
Default      top bar, filter chips, equal cards, pinned button
Context      standing on a platform, one hand, a glance every minute or so
Candidates   A "timetable" (conventional), B "departure board" (spatial), C "countdown" (contextual)
Distance     A/B 5, A/C 4, B/C 3
Chosen       B, because the next departure is the whole job and A buries it in a list
Lost         A reads as a schedule to study, C hides later departures behind a gesture
-->
<!doctype html>
<div class="frame" style="background:#f4f4f4;color:#222"></div>
`

async function project(brief: string, wireframe: string | null = WIREFRAME): Promise<string> {
	const cwd = await mkdtemp(join(tmpdir(), 'trunative-'))
	await mkdir(join(cwd, 'lib'), { recursive: true })
	await mkdir(join(cwd, '.trunative', 'screens'), { recursive: true })
	await writeFile(join(cwd, 'lib', 'screen.dart'), '')
	await writeFile(join(cwd, '.trunative', 'screens', 'departures.md'), brief)
	if (wireframe !== null) {
		await writeFile(join(cwd, '.trunative', 'screens', 'departures.wireframe.html'), wireframe)
	}
	return cwd
}

async function checks(brief: string, wireframe?: string | null): Promise<number> {
	const cwd = await project(brief, wireframe)
	try {
		return await spec({ cwd, paths: [] })
	} finally {
		await rm(cwd, { recursive: true, force: true })
	}
}

test('a brief with all six fields passes the checker', async () => {
	assert.equal(await checks(BRIEF), 0)
})

test('a brief with no context, or with a context key missing, fails it', async () => {
	for (const broken of [
		BRIEF.replace(/context:\n(  .+\n){8}/, ''),
		BRIEF.replace('  hands: one\n', ''),
		BRIEF.replace('auto_excluded: [chat, camera]', 'auto_excluded: [chat, offline]'),
	]) {
		assert.equal(await checks(broken), 1)
	}
})

test('a primary action is one label, two labels joined by or, or none with its reason', async () => {
	for (const value of ['"Start" or "Stop"', 'none, the screen is read and each row opens its own detail']) {
		assert.equal(await checks(BRIEF.replace('"Set alert"', value)), 0, value)
	}
	for (const value of [
		'Set alert',
		'none',
		'"Open a row; the screen reads and carries no filled button"',
		'"Start, or Stop when the machine is running"',
	]) {
		assert.equal(await checks(BRIEF.replace('"Set alert"', value)), 1, value)
	}
})

test('a brief needs a wireframe carrying the explore record, every pair over the floor', async () => {
	assert.equal(await checks(BRIEF, null), 1)
	assert.equal(await checks(BRIEF, WIREFRAME.replace(/<!-- explore[\s\S]*?-->\n/, '')), 1)
	assert.equal(await checks(BRIEF, WIREFRAME.replace('B/C 3', 'B/C 2')), 1)
	assert.equal(await checks(BRIEF, WIREFRAME.replace(/^Lost .*\n/m, '')), 1)
})

test('install refuses to replace a copy a newer trunative wrote', async () => {
	const cwd = await mkdtemp(join(tmpdir(), 'trunative-'))
	try {
		await mkdir(join(cwd, '.trunative'), { recursive: true })
		await writeFile(
			join(cwd, '.trunative', 'skill.lock'),
			JSON.stringify({ version: '999.0.0', skill: 'trunative', hash: '', installedAt: '', targets: [] }),
		)
		assert.equal(await install({ cwd, version: '1.0.0' }), 1)
	} finally {
		await rm(cwd, { recursive: true, force: true })
	}
})

test('install removes a full copy beside the one it writes, and doctor flags one', async () => {
	const cwd = await mkdtemp(join(tmpdir(), 'trunative-'))
	try {
		const full = join(cwd, '.claude', 'skills', 'trunative-full')
		await mkdir(full, { recursive: true })
		await writeFile(join(full, 'SKILL.md'), '')
		assert.equal(await doctor({ cwd, version: '1.0.0' }), 1)
		assert.equal(await install({ cwd, version: '1.0.0' }), 0)
		await assert.rejects(stat(full))
	} finally {
		await rm(cwd, { recursive: true, force: true })
	}
})
