---
name: trunative
description: Design and review mobile app UI for any stack (React Native, Expo, Flutter, SwiftUI, Jetpack Compose, mobile web). Use when building a screen, component, navigation flow, or form for a phone, or when reviewing existing mobile UI.
---

# Trunative

Mobile-only design. This file routes, it does not hold the content: the rules live in `heuristics/`, the procedures in `flow/`, the lookup material in `references/`.

A phone is not a small desktop. Input is imprecise and one-handed, the session gets interrupted, the network drops, the OS owns gestures and insets and permissions, text scales to whatever the user set, and the battery is finite. Design for that, not for a narrow viewport.

## Flow

Follow it in order. Never skip init, never end on build.

1. **init**, read `flow/init.md`. Once per project, and again whenever `npx trunative doctor` fails.
2. **build**, read `flow/build.md`. One screen, one component, or one flow at a time.
3. **review**, read `flow/review.md`. Runs on the code that was just written.
4. **loop**, back to build while review reports violations. Stop when review comes back clean.

## Loading rules

- Load only the heuristics the current screen touches. Reading the whole folder wastes the context that the actual code needs.
- Read `references/` on demand, for one specific number or API. Never as background.
- `PRODUCT.md` and `DESIGN.md` in the project override nothing in `heuristics/`, but they decide which rules apply and record the exceptions that were accepted on purpose.

## Non-negotiable

- Mobile only. There is no desktop breakpoint to defer a decision to.
- A rule that was not checked is a violation, not a pass.
- Never hand-edit the installed copy of this skill. Change it in the repository and run `npx trunative install`.
