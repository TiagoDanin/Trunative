---
name: trunative
description: Design and review mobile app UI for any stack (React Native, Expo, Flutter, SwiftUI, Jetpack Compose, mobile web). Use when building a screen, component, navigation flow, or form for a phone, or when reviewing existing mobile UI.
---

# Trunative

Mobile-only design. This file routes, it does not hold the content: the rules live in `heuristics/`, the procedures in `flow/`, the lookup material in `references/`.

A phone is not a small desktop. Input is imprecise and one-handed, the session gets interrupted, the network drops, the OS owns gestures and insets and permissions, text scales to whatever the user set, and the battery is finite. Design for that, not for a narrow viewport.

## Flow

Follow it in order. Never skip init, never end on build.

<Index of="flow" />

1. **init**, read `flow/init.md`. Once per project, and again whenever `npx trunative doctor` fails.
2. **build**, read `flow/build.md`. One screen, one component, or one flow at a time.
3. **review**, read `flow/review.md`. Runs on the code that was just written, and again on request over a finished screen. It scores every rule in scope from 1 to 5, and a 1 or a 2 is a violation.
4. **loop**, back to build while review reports violations. Stop when review comes back clean.

Loaded by build, not a step: `flow/firebase.md`, whenever the screen touches Firebase.

## Heuristics

One concern per file, in two tiers. The tier decides when a file is opened, not how much it counts: a rule in an extra file binds exactly like a rule in a base file once the screen touches it.

### Base

Opened on every screen, before writing. Every screen has colour, text, targets, a layout, states, at least one action, words, and something that moves, so nobody gets to decide a screen does not touch these.

<Index of="base" />

| File | Prefix | Covers |
|---|---|---|
| `heuristics/colors.md` | `color-` | palette roles and tokens, the default palette, ramps, the accent, gradients, dark theme, contrast, color as state |
| `heuristics/typography.md` | `type-` | the platform type scale, roles per screen, weight and its distribution, typeface choice, measure, text scaling, real strings |
| `heuristics/touch.md` | `touch-` | hit areas and spacing, thumb reach, where destructive actions go, press feedback, gestures and system edges, the keyboard as layout |
| `heuristics/buttons.md` | `button-` | one primary per screen, the emphasis ladder, labels, button states, the FAB, chips, tabs and segmented controls |
| `heuristics/layout.md` | `layout-` | insets and safe areas, the spacing scale, grouping and density, one column, the width range, fixed chrome and overlays, the first screenful, orientation |
| `heuristics/states.md` | `state-` | the full state set, loading and skeletons, the three empties, error classes and retry, offline and queued work, stale and partial data, permission, interruption |
| `heuristics/motion.md` | `motion-` | what earns an animation, the platform's own transitions, springs against durations, choreography, loops, motion that blocks input, cheap properties, reduced motion |
| `heuristics/accessibility.md` | `a11y-` | names, roles and values, hidden decoration, focus order, announcements, focus containment, gesture alternatives, alternative input, the system settings, media, how to test it |
| `heuristics/copy.md` | `copy-` | the word budget, the first word, voice, error wording, jargon, one term per thing, capitalisation, what absence says, numbers, figures that describe the product, rationale text |

### Extra

Opened when the screen touches the concern, and left closed otherwise. The list is what exists, not what to read.

<Index of="extra" />

| File | Prefix | Covers |
|---|---|---|
| `heuristics/navigation.md` | `nav-` | how deep the hierarchy goes, choosing between screen, tab, modal and sheet, back and up, deep links, per-destination stacks, search, state after interruption |
| `heuristics/lists.md` | `list-` | virtualisation, row density and the row as a target, separators, swipe actions, images, sections, the end of the list, refresh, selection |
| `heuristics/forms.md` | `form-` | one column, field count, persistent labels, input type and autofill, when to validate, error recovery, what survives backgrounding, submit |
| `heuristics/permissions.md` | `perm-` | the inventory, asking for less, scope, the rationale before the prompt, purpose strings, the three answers to a prompt, re-checking, coercion, tracking |
| `heuristics/onboarding.md` | `onboard-` | the branded frame, how many screens, explaining in place, what to defer, the order of the asks, looking before signing up, account obligations, the first real action, resuming |
| `heuristics/localization.md` | `l10n-` | no hardcoded strings, direction and what never mirrors, text expansion, locale formats, plurals, script coverage, personal data shapes, collation, per-app language, pseudolocalisation |
| `heuristics/notifications.md` | `notify-` | what earns an interruption, channels and categories, interruption level, quiet delivery, the lock screen, destination, actions, the shade, badges, the in-app equivalent |
| `heuristics/sense.md` | `sense-` | a capability past the grant: absent hardware, switched off above the app, running, imprecise, failing, plus preview, biometrics, haptics and motion |
| `heuristics/network.md` | `net-` | timeouts, backoff, cancellation, deduplication, fan-out, payload weight, metered connections, reachability, prefetch, uploads |
| `heuristics/offline.md` | `off-` | local first, freshness marks, cache policy, reclaimable storage, write modes, the queue, destructive work offline, conflict, the empty cache |
| `heuristics/splashscreen.md` | `splash-` | the system launch surface, the double splash, what it may contain, matching the first frame, fake progress, what may hold it, appearance, the entry it hands over to |
| `heuristics/performance.md` | `perf-` | cold start, the main thread, the frame budget, image decoding, memory, power, app size, and measuring instead of guessing |
| `heuristics/icons-and-imagery.md` | `icon-` | one icon set, icon weight, emoji standing in for an icon, vector and density, reserving space, cropping, dark variants, avatars, the app icon |
| `heuristics/feedback.md` | `fb-` | the vehicle ladder, silent success, when a dialog is justified, undo, where a message lands, duration, reach, queueing, surviving rotation, the review prompt |
| `heuristics/search.md` | `search-` | the two search surfaces, the stock control, placement per platform, typing and suggestions, recents, scope, filters, the result row, zero results, coming back |
| `heuristics/auth.md` | `auth-` | the methods and their order, provider buttons, web flows, last used, code screens, biometrics over a session, expiry, re-auth, the active account, sign out, deletion |
| `heuristics/settings.md` | `set-` | a better default before a switch, settings in context, what the system owns, shape and status, controls, effect, what syncs, destructive rows, search, the account exit, diagnostics |
| `heuristics/media.md` | `media-` | the system player, controls and scrubbing, unasked sound, audio focus, becoming noisy, background audio, remote controls, picture in picture, fullscreen, keeping awake, quality, live |
| `heuristics/background-work.md` | `bg-` | what may run at all, now or later, periodic work, visible and stoppable, the foreground service last, declared types, location, durability, exact time, push wake-ups, restriction, exemption, failing while away |
| `heuristics/privacy-ui.md` | `priv-` | the stranger beside the user, masked values, the app switcher snapshot, blocking capture and merely detecting it, the second gate, what gets instrumented, deleting data, the declaration matching the code |
| `heuristics/sharing.md` | `share-` | the system sheet and nothing hand-rolled, the payload and its preview, a link rather than a screenshot, readiness, file access, the outcome, what the app accepts and how it arrives, clipboard and paste, invites |
| `heuristics/updates.md` | `upd-` | the test for blocking at all, minimum version, the gate screen, prompt shape, flexible install, restart state, migration running once and its path, never wiping, carrying work over, what changed, the store channel |
| `heuristics/scrolling.md` | `scroll-` | nesting on one axis, the affordance that says there is more, collapsing chrome, anchoring, restoration, return to top, programmatic scrolls, overscroll, scrolling with the keyboard up |
| `heuristics/data-display.md` | `data-` | precision that does not lie, the shape of a table that does not fit, when a chart earns its place, scale and reach, relative against absolute time, units, entering a date, empty against null against zero |
| `heuristics/sound.md` | `sound-` | the inventory, being silenced by the switch and the ringer, mixing with other audio, system sounds, never sound alone, unasked sound, the off switch |
| `heuristics/payments.md` | `pay-` | which rail the item legally takes, linking out by storefront, the wallet first, the system sheet, the total, where the price comes from, subscription terms, cancelling, restore, card entry, leaving and returning, pending and idempotency, the honest paywall |
| `heuristics/ads.md` | `ads-` | labelled as advertising, the close control, placement, frequency, reserved space, adjacency to a real action, rewarded and consent flows, reporting, accessibility, the paid-to-remove entitlement, cost, children |

<Index of="references" />

Lookup material, read on demand for one value and never as background: `references/type-scales.md`, `references/fonts.json`, `references/input-fields.md`, `references/navigation-containers.md`, `references/motion-tokens.md`, `references/capability-checks.md`, `references/launch-surface.md`, `references/icon-and-image-assets.md`, `references/search-controls.md`, `references/annotations.md`.

## Always in scope

Base decides what is read on every screen. These nine decide what is scored on every review, whatever the screen is for, and `n/a` is not available for them. They are the ones a screen ships without, because nobody decided it touched that file:

<Index of="always" />

- `type-scale`, `type-scaling`: text arrives through a style with no literal size, and the screen still holds at the largest accessibility step.
- `layout-insets`: the safe area read at runtime, on all four edges.
- `touch-floor`, `touch-feedback`: the hit area meets the platform floor, and the press answers under the finger.
- `color-contrast`, `color-dark-composed`: contrast measured, and both appearances actually built.
- `a11y-name`: every control carries a name, a role and a value.
- `motion-reduced`: anything that animates reads the system setting first.

A splash screen, a settings list and a chart all answer these. Open the file that owns one when the answer is not obvious, and leave the rest of the folder closed.

## Loading rules

- Open every base file, then only the extra files the current screen touches. Reading the whole folder wastes the context that the actual code needs.
- Read `references/` on demand, for one specific number or API. Never as background.
- A tag such as `<If>`, `<Ask>`, `<Index>` or `<Rule>` is MDX syntax, not content. `references/annotations.md` says how to read each one, and it is the only reference worth opening before you have met a tag.
- The project briefs override nothing in `heuristics/`, but they decide which rules apply and record the exceptions accepted on purpose. `PRODUCT.md` is who uses this and for what, `DESIGN.md` is the visual identity in the [design.md format](https://github.com/google-labs-code/design.md), and `STACK.md` is this codebase: primitives, navigation, components, exceptions.

## Non-negotiable

- Mobile only. There is no desktop breakpoint to defer a decision to.
- A rule that was not checked is a violation, not a pass.
- Never hand-edit the installed copy of this skill. Change it in the repository and run `npx trunative install`.
