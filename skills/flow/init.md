# Init

Runs once per project, and again whenever `doctor` fails. Nothing else in the flow starts before this passes.

## 1. Run the doctor

```sh
npx trunative doctor
```

It checks three things and exits non-zero if any fails:

- the product brief, at `.trunative/PRODUCT.md` or `PRODUCT.md`
- the design brief, at `.trunative/DESIGN.md` or `DESIGN.md`
- the installed skill, against the hash in `.trunative/skill.lock`

## 2. Fix what it reports

**Skill missing or stale.** Run `npx trunative install`, then run the doctor again. Do not hand-edit the copy inside the agent directory: the hash check exists to catch exactly that, and the edit is lost on the next install.

**Product brief missing.** Interview the user, then write `.trunative/PRODUCT.md`. Do not invent answers, and do not fill a template with plausible text. Ask:

- who uses this, and in what situation (walking, driving, at a counter, at home)
- the two or three jobs the app exists to do
- what a session looks like: seconds or minutes, one-handed or two, foreground or interrupted
- the constraints that are already decided: platforms, stack, minimum OS versions, offline requirements

**Design brief missing.** Read the codebase first, then write `.trunative/DESIGN.md` from what is actually there, asking the user only about what the code cannot answer. Record:

- the stack and its UI primitives, with the exact names used in this project
- design tokens that already exist: spacing, radii, type scale, color roles, elevation
- navigation shape: tabs, stack, modals, sheets
- component inventory worth reusing, with file paths
- deliberate exceptions to the heuristics, each with the reason

## 3. Confirm

Run `npx trunative doctor` again. Every check must pass before the build step. If the user declines to answer something, write down what is unknown instead of guessing, and treat it as a risk in review.
