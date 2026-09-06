# Init

Runs once per project, and again whenever `doctor` fails. Nothing else in the flow starts before this passes.

## 1. Run the doctor

```sh
npx trunative doctor
```

It checks four things and exits non-zero if any fails:

- the product brief, at `.trunative/PRODUCT.md` or `PRODUCT.md`
- the design brief, at `.trunative/DESIGN.md` or `DESIGN.md`
- the stack brief, at `.trunative/STACK.md` or `STACK.md`
- the installed skill, against the hash in `.trunative/skill.lock`

The doctor only checks that a brief exists. Whether it says anything useful is your job, here in init.

## 2. Fix what it reports

**Skill missing or stale.** Run `npx trunative install`, then run the doctor again. Do not hand-edit the copy inside the agent directory: the hash check exists to catch exactly that, and the edit is lost on the next install.

**Product brief missing.** Interview the user, then write `.trunative/PRODUCT.md`. Do not invent answers, and do not fill a template with plausible text. Ask:

- who uses this, and in what situation (walking, driving, at a counter, at home)
- the two or three jobs the app exists to do
- what a session looks like: seconds or minutes, one-handed or two, foreground or interrupted
- the constraints that are already decided: platforms, stack, minimum OS versions, offline requirements

**Design brief missing.** `DESIGN.md` follows the [design.md specification](https://github.com/google-labs-code/design.md) from Google Labs, so any agent that already reads it gets the visual identity for free. Do not invent a second format.

Read the codebase first and derive the tokens from what is actually there. Ask the user only about what the code cannot answer, and about the intent behind values the code shows but does not explain.

- YAML frontmatter: `name` is required. Add `version`, `description`, and the token groups the project has: `colors`, `typography`, `rounded`, `spacing`, `components`. List what the project genuinely does not define under `omitted`, instead of inventing values to fill the schema.
- Markdown body, in this order: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts. The body is where the reason lives. A token without a reason gets copied into the wrong place later.
- Run `npx @google/design.md spec` for the authoritative schema and `npx @google/design.md lint` to check the file. The doctor does not lint, it only checks the file exists.

**Stack brief missing.** `DESIGN.md` describes the visual identity and nothing else. Everything specific to this codebase goes in `.trunative/STACK.md`, written from the code, not from the user's description of the code:

- the stack and its UI primitives, with the exact names used in this project
- how the DESIGN.md tokens are actually reached in code: the theme object, the CSS variables, the constants file
- navigation shape: tabs, stack, modals, sheets, and which library provides them
- component inventory worth reusing, with file paths
- platform floors: minimum OS versions, target devices, offline requirements
- deliberate exceptions to the heuristics, each with the reason and the date

## 3. Confirm

Run `npx trunative doctor` again. Every check must pass before the build step. If the user declines to answer something, write down what is unknown instead of guessing, and treat it as a risk in review.
