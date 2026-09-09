#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parseArgs } from 'node:util'

import { doctor } from './commands/doctor.js'
import { install } from './commands/install.js'
import { rubric } from './commands/rubric.js'
import { packageRoot } from './paths.js'

const USAGE = `trunative, a mobile-only design skill for AI coding agents

Usage
  npx trunative doctor            check the project before the agent starts
  npx trunative install [--dir]   copy the skill into the agent directories
  npx trunative rubric [--only]   print the review checklist, one row per rule

Options
  --dir <path>   install into this directory instead of the detected ones
                 (repeatable)
  --cwd <path>   run against this project instead of the current directory
  --only <name>  limit the rubric to a heuristics file ("touch"), a rule
                 prefix ("touch-") or one rule id (repeatable)
  --format <f>   rubric output: markdown (default), json, ids
  -v, --version  print the version
  -h, --help     print this help

The repository layout stays compatible with skills.sh, so
"npx skills add TiagoDanin/Trunative" keeps working as an alternative.
`

async function readVersion(): Promise<string> {
	try {
		const source = await readFile(join(packageRoot, 'package.json'), 'utf8')
		return (JSON.parse(source) as { version?: string }).version ?? '0.0.0'
	} catch {
		return '0.0.0'
	}
}

async function main(): Promise<number> {
	const { values, positionals } = parseArgs({
		args: process.argv.slice(2),
		allowPositionals: true,
		options: {
			dir: { type: 'string', multiple: true },
			only: { type: 'string', multiple: true },
			format: { type: 'string' },
			cwd: { type: 'string' },
			version: { type: 'boolean', short: 'v' },
			help: { type: 'boolean', short: 'h' },
		},
	})

	const version = await readVersion()

	if (values.version) {
		console.log(version)
		return 0
	}

	const command = positionals[0]

	if (values.help || !command || command === 'help') {
		console.log(USAGE)
		return command || values.help ? 0 : 1
	}

	const cwd = values.cwd ? join(process.cwd(), values.cwd) : process.cwd()

	switch (command) {
		case 'doctor':
			return doctor({ cwd, version })
		case 'install':
			return install({ cwd, version, dirs: values.dir })
		case 'rubric':
			return rubric({ version, only: values.only, format: values.format })
		default:
			console.error(`unknown command "${command}"\n`)
			console.error(USAGE)
			return 1
	}
}

process.exitCode = await main()
