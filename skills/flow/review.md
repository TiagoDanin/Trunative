# Review

Runs after every build, on the code that was just written. Reviewing your own output is the point: the build step optimizes for getting the screen working, and this step optimizes for finding where it fails in a hand.

## 1. Re-read the diff

Review the actual code, not your memory of writing it. Open the files that changed.

## 2. Audit against the heuristics

Start with the nine rules under **Always in scope** in `SKILL.md`. They get a verdict on every review, on every screen, and `not applicable` is not available for them. Then go through every other heuristics file that applies to the changed code, including the ones the build step did not load. For each rule, one of three verdicts:

- **pass**, with the line that satisfies it
- **violation**, with file, line, and what the user would experience
- **not applicable**, with why

A rule you did not check is a violation. Do not report a rule as passing without pointing at the code.

## 3. Report

List violations ordered by what hurts the user most, not by how easy they are to fix. For each one, name the fix. Say plainly if the screen is unusable one-handed, loses data on interruption, or has no failure state, and do not bury it under smaller findings.

If a violation is a deliberate exception recorded in `STACK.md`, mark it as accepted and move on.

## 4. Loop

- Violations found: go back to `flow/build.md` with this report and fix them, then review again.
- No violations: stop. Report what was built, which rules were checked, and which exceptions were accepted.

Two consecutive reviews finding the same violation means the fix is not working. Say so and ask the user, instead of looping a third time.
