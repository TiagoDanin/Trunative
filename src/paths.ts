import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Root of the installed trunative package, resolved from this module. */
export const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * The skill as it is written, with its tags still in it. It sits under "src"
 * because a skill index walks the repository root one level deep and the
 * "skills" directory three: a source tree named "skills" is served as a skill,
 * tags and all. Nested under "src" it is out of both walks.
 */
export const packagedSkillDir = join(packageRoot, 'src', 'skills')

/**
 * Where "trunative build" writes the resolved copies. Inside it the layout is
 * the one a project has, so ".claude/skills/trunative-flutter" here is the same
 * path it lands on there.
 */
export const compiledSkillsDir = join(packageRoot, 'dist', 'agents')

/**
 * The published copies, in the flat layout a skill index reads. One directory
 * per stack variant, resolved for the "other" agent, because an index hands
 * every harness the same bytes and "other" is the branch that names no harness.
 */
export const publishedSkillsDir = join(packageRoot, 'skills')

/** The agent a published copy resolves. See publishedSkillsDir. */
export const PUBLISHED_AGENT = 'other'

/**
 * The directory each agent reads in a project. Zed and anything else reading
 * the shared root gets the "other" build, which resolves no harness branch.
 */
export const AGENT_DIR: Record<string, string> = {
	claude: '.claude',
	codex: '.codex',
	antigravity: '.antigravity',
	opencode: '.opencode',
	other: '.agents',
}

/** "trunative" for the generic copy, "trunative-flutter" for a stack variant. */
export function variantName(name: string, stack?: string): string {
	return stack ? `${name}-${stack}` : name
}

/** Where trunative keeps its own files inside a consumer project. */
export const CONFIG_DIR = '.trunative'

export const LOCK_FILE = 'skill.lock'

/**
 * Agent roots we install into. Only the ones that already exist in the project
 * are used, so we never create a directory for an agent the user does not have.
 */
export const AGENT_ROOTS = ['.claude', '.agents', '.antigravity', '.codex', '.opencode']

/** Used when the project has no agent directory at all. */
export const DEFAULT_AGENT_ROOT = '.claude'

/** The agent whose branches a directory's copy resolves. */
export function agentFor(root: string): string {
	const found = Object.entries(AGENT_DIR).find(([, dir]) => dir === root)
	return found ? found[0] : 'other'
}

/**
 * Both places a brief may live, in priority order. The bare filename is
 * supported so a project can keep the briefs next to its README.
 */
export function briefCandidates(cwd: string, file: string): string[] {
	return [join(cwd, CONFIG_DIR, file), join(cwd, file)]
}
