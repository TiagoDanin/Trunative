# Build

Writes or changes one screen, one component, or one flow. Never runs before init passes.

## 1. Frame the screen

State, in one or two lines, before writing code:

- the single job this screen does, taken from `PRODUCT.md`
- the one primary action, and where the thumb reaches it
- what happens on a slow network, on failure, and with no data

If the screen has more than one primary action, it is more than one screen. Split it and say so.

## 2. Load only what applies

Read `DESIGN.md` for the project's primitives and tokens, then load from `heuristics/` only the rules this screen actually touches. Do not read the whole folder. Use `references/` on demand, for a specific number or platform API, never as background reading.

## 3. Write it

- Reuse the components and tokens `DESIGN.md` lists. New primitives need a reason.
- Apply the heuristics as you write, not as a pass afterwards.
- Where a heuristic cannot be met, leave the code correct and record the conflict for review. Do not silently drop the rule.

## 4. Hand off

Say which heuristics files you applied and which you deliberately skipped, with the reason. Then run `flow/review.md`. Build is never the last step.
