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

## Heuristics

One concern per file. The list is what exists, not what to read.

| File | Covers |
|---|---|
| `heuristics/colors.md` | palette roles and tokens, the default palette, ramps, the accent, gradients, dark theme, contrast, color as state |
| `heuristics/typography.md` | the platform type scale, roles per screen, weight and its distribution, typeface choice, measure, text scaling, real strings |
| `heuristics/touch.md` | hit areas and spacing, thumb reach, where destructive actions go, press feedback, gestures and system edges, the keyboard as layout |
| `heuristics/buttons.md` | one primary per screen, the emphasis ladder, labels, button states, the FAB, chips, tabs and segmented controls |
| `heuristics/layout.md` | insets and safe areas, the spacing scale, grouping and density, one column, the width range, fixed chrome and overlays, the first screenful, orientation |
| `heuristics/navigation.md` | how deep the hierarchy goes, choosing between screen, tab, modal and sheet, back and up, deep links, per-destination stacks, search, state after interruption |
| `heuristics/lists.md` | virtualisation, row density and the row as a target, separators, swipe actions, images, sections, the end of the list, refresh, selection |
| `heuristics/forms.md` | one column, field count, persistent labels, input type and autofill, when to validate, error recovery, what survives backgrounding, submit |
| `heuristics/states.md` | the full state set, loading and skeletons, the three empties, error classes and retry, offline and queued work, stale and partial data, permission, interruption |

Lookup material, read on demand for one value and never as background: `references/type-scales.md`, `references/fonts.json`, `references/input-fields.md`, `references/navigation-containers.md`.

## Loading rules

- Load only the heuristics the current screen touches. Reading the whole folder wastes the context that the actual code needs.
- Read `references/` on demand, for one specific number or API. Never as background.
- The project briefs override nothing in `heuristics/`, but they decide which rules apply and record the exceptions accepted on purpose. `PRODUCT.md` is who uses this and for what, `DESIGN.md` is the visual identity in the [design.md format](https://github.com/google-labs-code/design.md), and `STACK.md` is this codebase: primitives, navigation, components, exceptions.

## Non-negotiable

- Mobile only. There is no desktop breakpoint to defer a decision to.
- A rule that was not checked is a violation, not a pass.
- Never hand-edit the installed copy of this skill. Change it in the repository and run `npx trunative install`.
