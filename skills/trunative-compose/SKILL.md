---
name: trunative-compose
description: Design and review mobile app UI in Jetpack Compose. Use when building a screen, component, navigation flow, or form for a phone, or when reviewing existing mobile UI. Install this copy only in a Jetpack Compose project.
---

# Trunative

Mobile-only design. This file routes, it does not hold the content: the rules live in `heuristics/` and `platform/`, the procedures in `flow/`, the lookup material in `references/`.

A phone is not a small desktop. Input is imprecise and one-handed, the session gets interrupted, the network drops, the OS owns gestures and insets and permissions, text scales to whatever the user set, and the battery is finite. Design for that, not for a narrow viewport.

**Explore before you optimise.** The first plausible layout is the most familiar one, which is not the same as the best one. So generating and judging are separate jobs here: while a composition is being searched for, how far apart the candidates are matters more than whether each detail complies, and once one is chosen, compliance and usability matter more than novelty.

**Variation is not exploration.** Changing spacing, colour, radius, type, wording or the size of a component does not produce a second layout. A second layout changes where things sit relative to each other, or how the person operates them.

## Flow

Follow it in order. Never skip init, never end on build.

1. **init**, read `flow/init.md`. Once per project, and again whenever `npx trunative doctor` fails.
2. **spec**, read `flow/spec.md`. Whenever the task establishes or changes hierarchy, actions, states or navigation, which a new screen, a new component with state of its own, or a new flow always does. It writes the screen brief, with the person's goal and the context they are in, then renders the chosen composition as a greyscale wireframe, and asks the user when the structure is a real decision. Skipping it is a verdict written in one line, never a default: only a cosmetic or local change goes straight to build.
3. **explore**, read `flow/explore.md`. Inside spec, between the brief and the wireframe. It names the layout the screen would get by default, writes three candidates that differ in structure, each from the brief alone, measures how far apart they are, and only then judges them and picks one.
4. **build**, read `flow/build.md`. One screen, one component, or one flow at a time.
5. **review**, read `flow/review.md`. Runs on the code that was just written, and again on request over a finished screen. It scores every rule in scope from 1 to 5, or pass or fail where the rule is binary. A 1, a 2 or a fail is a violation, and a violation on a P0 or P1 rule blocks the screen whatever the percentage says.
6. **loop**, back to build while review reports violations. Stop when review comes back clean.

Every hand-off after build carries the status line of the review that ran on it, or the words `review not run` with the reason. A hand-off with neither is how a skipped review passes for a finished one.

Loaded by build, not a step: `flow/firebase.md`, whenever the screen touches Firebase.

## Heuristics

One concern per file, in two tiers. The tier decides when a file is opened, not how much it counts: a rule in an extra file binds exactly like a rule in a base file once the screen touches it.

No screen answers to every rule in the folder. How a rule reaches a screen has four levels, and knowing which one a rule sits at is what keeps a simple screen from being graded against hundreds of lines that are not about it:

- **Required.** The nine under Always in scope. Scored on every screen, never `n/a`.
- **Applicable.** A rule in a base file, whenever the thing it is about is on the screen. `button-one-primary` applies once there is an action, and `form-label` once there is a field. A base rule about something the screen lacks is `n/a` in one line and nobody argues it.
- **Contextual.** A rule in an extra file, only once the pass over the Extra table opens that file. `chat-new-arrival` exists for a transcript and `cam-thermal` for sustained capture, and neither is in the review of a screen with no conversation and no camera.
- **Informative.** Everything in `references/`. Read for a value, never graded.

Rules also carry a severity, printed on the heading and in the rubric: **P0** is a person who cannot complete the job or loses work, **P1** is a person who is excluded or misled, **P2** is friction or a convention broken, which is what an unmarked rule is, and **P3** is polish. Severity decides what blocks, in `flow/review.md`. It never decides what is read.

The rules mix three kinds of statement and it helps to know which one is in front of you. A design principle says what the person should experience and holds on every stack forever. A platform convention says how iOS or Android already does it, and changes when the platform does. An implementation line names an API, and is an example of one way to satisfy the rule on one stack at the time of writing: when the API has moved on, the principle above it still binds and the line is what gets replaced. The files in `platform/`, which name the most APIs, say in their intro the newest platform versions they mention.

### Base

Opened on every screen, before writing. Every screen has colour, text, targets, a layout, a composition, states, at least one action, words, a decision about motion, and something drawn, so nobody gets to decide a screen does not touch these. The decision about motion includes deciding that nothing animates: `motion-job` has a still screen at rest, and what is owed is the look at every change of state, not a movement.

| File | Prefix | Covers |
|---|---|---|
| `heuristics/colors.md` | `color-` | palette roles and tokens, the default palette, ramps, the accent, colour that varies per item, gradients, dark theme, contrast, color as state |
| `heuristics/typography.md` | `type-` | the platform type scale, roles per screen, weight and its distribution, typeface choice, measure, text scaling, real strings |
| `heuristics/touch.md` | `touch-` | hit areas and spacing, controls inside controls and pictures of controls, thumb reach, where destructive actions go, press feedback, gestures and system edges, the keyboard as layout |
| `heuristics/buttons.md` | `button-` | one primary per screen, the emphasis ladder, labels, button states, the FAB, chips, tabs and segmented controls |
| `heuristics/layout.md` | `layout-` | insets and safe areas, the spacing scale, grouping and density, radius and shape, one column, the width range, centring between unequal groups, fixed chrome and overlays, the first screenful, orientation |
| `heuristics/composition.md` | `comp-` | a composition chosen between alternatives, how far apart candidates have to be, the moment of use deciding the arrangement, an arrangement that could only be this product's, sibling screens that are not one template |
| `heuristics/states.md` | `state-` | the full state set, loading and skeletons, the three empties, error classes and retry, offline and queued work, stale and partial data, permission, interruption |
| `heuristics/motion.md` | `motion-` | what earns an animation, the platform's own transitions, springs against durations, choreography, loops, motion that blocks input, cheap properties, reduced motion |
| `heuristics/accessibility.md` | `a11y-` | names, roles and values, hidden decoration, focus order, announcements, focus containment, gesture alternatives, alternative input, the system settings, media, how to test it |
| `heuristics/copy.md` | `copy-` | the word budget, the first word, voice, error wording, jargon, one term per thing, capitalisation, what absence says, sample content and its arithmetic, numbers, figures that describe the product, rationale text |
| `heuristics/icons-and-imagery.md` | `icon-` | one icon set, icon weight, emoji standing in for an icon, vector and density, reserving space, cropping, artwork that depicts nothing, dark variants, avatars, the app icon |

### Extra

Opened when the screen touches the concern, and left closed otherwise. The list is what exists, not what to read.

Whether it is touched is settled by a pass over this table, not by recall. Say in one line what is in front of you, as the thing it is rather than as the feature it belongs to, then read the Covers column against that line, row by row. A row whose words are on the screen gets opened. A row the screen plainly has nothing of is excluded by name and owes no sentence: a calculator has no map, no chat and no camera, and writing three reasons for that is effort taken from the design. The sentence is owed by the ambiguous rows, the ones a reader would expect to be open: there a row stays closed only when you can name what this screen does not have that the row is about, and "it does not seem relevant" is not that sentence.

The pass runs before the first line of code. A file opened afterwards reviews the screen instead of shaping it, and the rule it carries has become a rewrite rather than a decision.

It fails in two quiet ways. Judging by the feature closes a file that owns something the screen plainly shows, because the feature has a name and the screen has content. Judging by how simple the screen looks closes the file whose rules that screen is about to break, since a concern a screen does not advertise is precisely the one nobody designed for.

| File | Prefix | Covers |
|---|---|---|
| `heuristics/navigation.md` | `nav-` | how deep the hierarchy goes, choosing between screen, tab, modal and sheet, back and up, deep links, per-destination stacks, an item whose home is another section, search, state after interruption |
| `heuristics/lists.md` | `list-` | virtualisation, row density and the row as a target, separators, swipe actions, images, sections, the end of the list, refresh, selection |
| `heuristics/forms.md` | `form-` | one column, field count, persistent labels, input type and autofill, when to validate, error recovery, what survives backgrounding, submit |
| `heuristics/chat.md` | `chat-` | the transcript's anchor and where it opens, paging history upward, arrivals while reading, grouping and time, the row, the empty conversation, the composer's ceiling, the state of one message, attachments, presence, announcing an arrival |
| `heuristics/permissions.md` | `perm-` | the inventory, asking for less, scope, the rationale before the prompt, purpose strings, the three answers to a prompt, re-checking, coercion, tracking |
| `heuristics/onboarding.md` | `onboard-` | the branded frame, how many screens, explaining in place, what to defer, the order of the asks, looking before signing up, account obligations, the first real action, resuming |
| `heuristics/localization.md` | `l10n-` | no hardcoded strings, direction and what never mirrors, text expansion, locale formats, plurals, script coverage, personal data shapes, collation, per-app language, pseudolocalisation |
| `heuristics/notifications.md` | `notify-` | what earns an interruption, channels and categories, interruption level, quiet delivery, the lock screen, destination, actions, the shade, badges, the in-app equivalent |
| `heuristics/widgets.md` | `widget-` | the update budget, stating what is stale, fitting a size with no scroll, per-size authoring, the tap as a deep link, signed-out and empty and error, the stranger reading it, staying on the app's own content, labels on every presentation, the Dynamic Island, the final frame, Android promotion |
| `heuristics/sense.md` | `sense-` | a capability past the grant: absent hardware, switched off above the app, running, imprecise, failing, plus preview, biometrics, haptics and motion |
| `heuristics/camera.md` | `cam-` | handing off to the system capture screen, the shutter and its ground, torch, lens stops and zoom, the frame that matches what is analysed, a scan resolving by itself, review and retake, a capture the app rejects, orientation and mirroring, size and destination, the limited photo grant, thermal pressure |
| `heuristics/offline.md` | `off-` | local first, freshness marks, cache policy, reclaimable storage, write modes, the queue, destructive work offline, conflict, the empty cache |
| `heuristics/splashscreen.md` | `splash-` | the system launch surface, the double splash, what it may contain, matching the first frame, fake progress, what may hold it, appearance, the entry it hands over to |
| `heuristics/feedback.md` | `fb-` | the vehicle ladder, silent success, when a dialog is justified, undo, where a message lands, duration, reach, queueing, surviving rotation, the review prompt |
| `heuristics/search.md` | `search-` | the two search surfaces, the stock control, placement per platform, typing and suggestions, recents, scope, filters, the result row, zero results, coming back |
| `heuristics/auth.md` | `auth-` | the methods and their order, provider buttons, web flows, last used, code screens, biometrics over a session, expiry, re-auth, the active account, sign out, deletion |
| `heuristics/webviews.md` | `webview-` | which surface a URL opens in, somebody else's credential field, the wrapper's own chrome, back inside the page, links that leave it, theme and text size reaching content nobody can restyle, insets and the keyboard, downloads and file pickers, the session the app cannot read, the wrapped site |
| `heuristics/settings.md` | `set-` | a better default before a switch, settings in context, what the system owns, shape and status, controls, effect, what syncs, destructive rows, search, the account exit, diagnostics |
| `heuristics/media.md` | `media-` | the system player, controls and scrubbing, unasked sound, audio focus, becoming noisy, background audio, remote controls, picture in picture, fullscreen, keeping the screen awake for anything watched rather than touched, quality, live |
| `heuristics/maps.md` | `map-` | the first camera, who owns the drag, markers as targets, clustering, the equivalent list, following the user, legibility over tiles nobody chose, routes as text, tiles that did not arrive, the cost of a live map, attribution, the provider's contract |
| `heuristics/privacy-ui.md` | `priv-` | the stranger beside the user, masked values, the app switcher snapshot, blocking capture and merely detecting it, the second gate, what gets instrumented, deleting data, the declaration matching the code |
| `heuristics/sharing.md` | `share-` | the system sheet and nothing hand-rolled, the payload and its preview, a link rather than a screenshot, readiness, file access, the outcome, what the app accepts and how it arrives, clipboard and paste, invites |
| `heuristics/updates.md` | `upd-` | the test for blocking at all, minimum version, the gate screen, prompt shape, flexible install, restart state, migration running once and its path, never wiping, carrying work over, what changed, the store channel |
| `heuristics/scrolling.md` | `scroll-` | nesting on one axis, the affordance that says there is more, collapsing chrome, anchoring, restoration, return to top, programmatic scrolls, overscroll, scrolling with the keyboard up |
| `heuristics/data-display.md` | `data-` | precision that does not lie, the shape of a table that does not fit, when a chart earns its place, scale and reach, relative against absolute time, units, entering a date, empty against null against zero |
| `heuristics/sound.md` | `sound-` | the inventory, being silenced by the switch and the ringer, mixing with other audio, system sounds, never sound alone, unasked sound, the off switch |
| `heuristics/payments.md` | `pay-` | which rail the item legally takes, linking out by storefront, the wallet first, the system sheet, the total, where the price comes from, subscription terms, cancelling, restore, card entry, leaving and returning, pending and idempotency, the honest paywall |
| `heuristics/ads.md` | `ads-` | labelled as advertising, the close control, placement, frequency, reserved space, adjacency to a real action, rewarded and consent flows, reporting, accessibility, the paid-to-remove entitlement, cost, children |

**Platform and engineering.** Same tier and same pass as the rows above, kept in `platform/` because they are a different kind of rule. Everything in `heuristics/` says what the person experiences. These three say how the code underneath has to behave for that experience to hold: transport, scheduling, the frame budget. They name more APIs than any other file, which makes them the part that ages, so read them for the behaviour they require and treat each API as today's way of getting it. A rule here is opened, scored and blocks exactly like any other.

| File | Prefix | Covers |
|---|---|---|
| `platform/network.md` | `net-` | timeouts, backoff, cancellation, deduplication, fan-out, payload weight, metered connections, reachability, prefetch, uploads |
| `platform/performance.md` | `perf-` | cold start, the main thread, the frame budget, image decoding, memory, power, app size, and measuring instead of guessing |
| `platform/background-work.md` | `bg-` | what may run at all, now or later, periodic work, visible and stoppable, the foreground service last, declared types, location, durability, exact time, push wake-ups, restriction, exemption, failing while away |

Lookup material, read on demand for one value and never as background: `references/color-construction.md`, `references/type-scales.md`, `references/fonts.json`, `references/input-fields.md`, `references/navigation-containers.md`, `references/motion-tokens.md`, `references/capability-checks.md`, `references/launch-surface.md`, `references/icon-and-image-assets.md`, `references/search-controls.md`, `references/wireframe-frame.md`, `references/design-grammars.md`, `references/accepted-exceptions.md`.

## Always in scope

Base decides what is read on every screen. These nine decide what is scored on every review, whatever the screen is for, and `n/a` is not available for them. They are the ones a screen ships without, because nobody decided it touched that file:

- `type-scale`, `type-scaling`: text arrives through a style with no literal size, and the screen still holds at the largest accessibility step.
- `layout-insets`: the safe area read at runtime, on all four edges.
- `touch-floor`, `touch-feedback`: the hit area meets the platform floor, and the press answers under the finger.
- `color-contrast`, `color-dark-composed`: contrast measured, and both appearances actually built, or the one `DESIGN.md` records forced on every surface.
- `a11y-name`: every control carries a name, a role and a value.
- `motion-reduced`: anything that animates reads the system setting first.

A splash screen, a settings list and a chart all answer these. Open the file that owns one when the answer is not obvious, and leave the rest of the folder closed.

## Loading rules

- Open every base file, then every extra file this screen touches, settled by the pass over the Extra table rather than from memory of what the folder holds. Reading all of it wastes the context the code needs, and closing a file because the screen looked simple wastes the review.
- Read `references/` on demand, for one specific number or API. Never as background.
- What was read is gone once the context is compacted or reset, and a summary of a rule is not the rule. After either, open this file, the flow file of the current step and the screen's brief again before the next line of work.
- Work handed to a sub-agent, a workflow or a parallel worker carries the flow file of its step and the brief it builds against, by path, never a paraphrase of them. A worker that only received the orchestrator's summary is working without this skill.
- This copy was built for one agent and, when its name says so, for one stack. It is not the file that was written: the branches for other harnesses and other frameworks were resolved away at build time. Never hand-edit it, and never reason about what a branch might have said.
- The project briefs override nothing in `heuristics/`, but they decide which rules apply and record the exceptions accepted on purpose. `PRODUCT.md` is who uses this and for what, `DESIGN.md` is the visual identity in the [design.md format](https://github.com/google-labs-code/design.md), and `STACK.md` is this codebase: primitives, navigation, components, exceptions. A fourth brief is per screen rather than per project: `.trunative/screens/<name>.md` holds the structure `flow/spec.md` settled, and it records intent rather than granting an exception.

## Non-negotiable

- Mobile only. There is no desktop breakpoint to defer a decision to.
- A rule that was not checked is a violation, not a pass.
- Never hand-edit the installed copy of this skill. Change it in the repository and run `npx trunative install`.
