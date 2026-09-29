---
name: trunative-full
description: Design and review mobile app UI for any stack (React Native, Expo, Flutter, SwiftUI, Jetpack Compose, mobile web). Use when building a screen, component, navigation flow, or form for a phone, or when reviewing existing mobile UI. This copy carries every rule, procedure and reference inline, in one file, for a context that cannot read files. Never install it in a project or beside another trunative copy: a project uses the tiered copy that "npx trunative install" writes.
---

Every file this skill is made of is inlined below, each under a heading that is its path. A line pointing at `heuristics/colors.md` or `flow/build.md` is pointing at a section of this document, so nothing here has to be opened and nothing is missing. The tiered copy, where a rule is read only once a screen touches it, is the one a project installs; this one is for a context that gets filled once and cannot read files.

Two lists are generated rather than written. Each rule file opens with its own rule ids in order, and closes with a Reaches section naming the ids it cites and the file that holds each one, which here is the section that holds it.

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

# flow/init.md

## Init

Runs once per project, and again whenever `doctor` fails. Nothing else in the flow starts before this passes.

### Asking

This step runs on answers, not on guesses. Every decision below that the code cannot settle is a question for the user, asked one at a time: one decision per question, the options in the order given, the recommended one first and named as the recommendation, and each option phrased as what it costs the design.

The user chooses. A recommendation is a default worth stating, not a decision already taken, and an answer that goes against it wins with no argument back.

### 1. Run the doctor

```sh
npx trunative doctor
```

It checks four things and exits non-zero if any fails:

- the product brief, at `.trunative/PRODUCT.md` or `PRODUCT.md`
- the design brief, at `.trunative/DESIGN.md` or `DESIGN.md`
- the stack brief, at `.trunative/STACK.md` or `STACK.md`
- the installed skill, against the hash in `.trunative/skill.lock`

The doctor only checks that a brief exists. Whether it says anything useful is your job, here in init.

### 2. Fix what it reports

**Skill missing or stale.** Run `npx trunative install`, then run the doctor again. Do not hand-edit the copy inside the agent directory: the hash check exists to catch exactly that, and the edit is lost on the next install.

When the doctor says the installed copy is newer than the CLI running it, the CLI is what is out of date: run the version it names, and never `install` from the older one, which deletes whatever the older package lacks. When it reports a full copy beside the installed one, remove that copy; it puts the whole skill in the context at once and the tiers never get to decide what is read.

A failing doctor is never an exception in `STACK.md`. That file records design decisions the user accepted, and a check nobody can make pass is a tooling fault to report to the user, not a decision.

**Product brief missing.** Interview the user, then write `.trunative/PRODUCT.md`. Do not invent answers, and do not fill a template with plausible text. Ask:

- who uses this, and in what situation (walking, driving, at a counter, at home)
- the two or three jobs the app exists to do
- what a session looks like: seconds or minutes, one-handed or two, foreground or interrupted
- the constraints that are already decided: platforms, stack, minimum OS versions, offline requirements

A document the user hands over, a product spec, a pitch, a prompt written for another tool, is input to this interview and not a replacement for it. Read it first, then ask what it does not answer. Such documents describe features and rarely the person: who holds the phone, where, for how long and while doing what is exactly the part they leave out, and it is the part every later composition is decided by.

**Design brief missing.** `DESIGN.md` follows the [design.md specification](https://github.com/google-labs-code/design.md) from Google Labs, so any agent that already reads it gets the visual identity for free. Do not invent a second format.

Read the codebase first and derive the tokens from what is actually there. Ask the user only about what the code cannot answer, and about the intent behind values the code shows but does not explain.

Ask whether there is a reference to match: a mockup, a screenshot, another app, a brand sheet. When there is, it outranks both the code and any derivation, and `DESIGN.md` is read off it. Go through what a picture settles and a description loses, one by one, and write each down with the reference it came from: the ground and whether it is tinted, the ink, the accent and what it is spent on, the weight of titles against body, the icon set and whether a selected icon fills, the back glyph, how a selected item in a bar or a list is marked, what carries depth, and the radii. A token nobody wrote down from the reference gets filled in from the framework's defaults, and the user then spends the next week pointing at the difference.

Ask which appearances the product ships: following the system, which builds both and is the recommendation, or one of them forced. Record the answer in the Overview. It decides what `color-dark-composed` grades, and it is the user's to decide rather than a default either way.

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

**No stack yet.** There is no code to read when the project is empty, so `STACK.md` records a decision instead of an observation. Never pick the stack silently, and never lay the options out as equivalent: a flat list of frameworks is the absence of a recommendation.

**Flutter is the recommended option, and it goes first with the reason in one line.** The reason is design control, which is the whole point of this skill:

- Flutter draws its own widgets instead of delegating to the OS, so a spacing, weight or radius decision lands identically on both platforms. Everywhere else the same code renders two different screens and the design work has to be done twice.
- Material 3 and Cupertino both ship inside the SDK, so the token tables the heuristics reference are already in the framework, with no third-party UI library to pick, pin and outgrow.
- Text scale, safe areas and semantics are first-class (`MediaQuery.textScaler`, `SafeArea`, `Semantics`), so the accessibility floor is reachable without extra packages.
- Hot reload keeps the build and review loop short, and this flow runs that loop on every screen.

**A stated constraint moves the recommendation off Flutter**, and only a stated one does. Never a preference of yours. When code already exists, or the team already ships in another stack, use what is there and do not ask at all. Otherwise:

**Flutter and Expo and React Native and SwiftUI and Jetpack Compose and Mobile web**

This copy of the skill was built for one stack, which is the answer. Record it in `STACK.md` with the reason it was chosen, and do not ask.

There is no code to read yet, so the stack is a decision rather than an observation. Which one?

Ask this in plain text, ending in a question mark, under the label "Stack", with the options below listed in that order and the recommended one named as the recommendation. Wait for the answer before writing anything.

- **Flutter.** One rendering engine, so every spacing, weight and radius decision lands identically on both platforms and the design work is done once. (recommended)
- **React Native or Expo.** Right when the product is a feature inside an app that already ships in it. Two renderers, so every design decision is verified twice.
- **SwiftUI or Jetpack Compose.** One platform only, with integration no cross-platform layer reaches: widgets, App Clips, deep system APIs. The other platform is a second product.
- **Mobile web.** The target is a website. The browser owns gestures, insets and the keyboard, and the heuristics apply to what it leaves.

Write the answer into `STACK.md` as its first line, `Stack:` followed by exactly one of `flutter`, `expo`, `react-native`, `swiftui`, `compose` or `web`, because that line is what decides which copy of this skill the project installs next. Under it, the reason, naming the constraint that moved the recommendation when one did. A stack chosen off the recommendation and a stack chosen against it are different facts, and review needs to tell them apart.

### 3. Check the project is not wearing another app's identity

Apps are routinely started from a fork, a template, or a sibling product in the same account, and the copy keeps everything the original had. This matters here because step 2 derives the briefs **from the code**, so anything inherited gets recorded as a deliberate decision and then defended in every later review.

The tell is that none of it fails. The app builds, runs and looks finished while pointing at another product's identity and another product's services.

Ask the user what the app is, then check the code against the answer:

- **Identity**: the display name, the bundle or package identifier, and the copyright line.
- **Launch artwork**: the icon and the launch surface, plus the config files their generators read. A generator config carried over from the original names the original's artwork paths, and the tool then succeeds while producing the wrong app's icon.
- **Third-party project targets**: analytics, crash reporting, push, feature flags, ads. These are identifiers in a config file, and an identifier from the source project is the worst case, because it works: the new app quietly reports into the old app's dashboards.
- **Brand tokens**: colours, typography and the launch background, which is where the previous product's palette survives longest.
- **Written-down URLs**: support, marketing, privacy and terms.

Two rules for what you find:

- **Report, do not silently fix.** Some of it is intentional: a shared account, a deliberately shared analytics project, a house palette. The user knows which; you do not.
- **Never assume the value in the code is the intent.** In a derived project the code is evidence of where it came from, not of what it is meant to be. Where the code and the user disagree, the user decides, and `STACK.md` records that it was inherited rather than chosen.

An app with no ancestor answers this in one line and moves on.

### 4. Confirm

Run `npx trunative doctor` again. Every check must pass before the build step. If the user declines to answer something, write down what is unknown instead of guessing, and treat it as a risk in review.

# flow/spec.md

## Spec

Settles what is on the screen before anything draws it. Runs between init and build, whenever the task establishes or changes structure.

Structure is four things: hierarchy, actions, states, navigation. A new screen, a new component with state of its own, or a new flow settles all four at once, so it always comes through here: nothing is being changed because everything is being decided, and that is the maximum case rather than an exemption. An existing screen comes through when the task moves any of the four.

The step ends with a composition chosen between alternatives, a wireframe rendered and looked at, and the gate in section 4 either asked or skipped on one of the grounds written there. A spec step that wrote a brief and went on to code did not run.

```text
"Build the login screen."             spec, new screen
"Add a settings screen to the app."   spec, new screen
"Move People above Recently Viewed."  spec
"Add Google sign-in."                 spec
"This screen has no empty state."     spec
"Send the row to a detail screen."    spec

"Make the button blue."               build
"Four more points of padding."        build
"The transition is too slow."         build
"Rename the view model."              build
```

Write the verdict in one line before anything else, naming which of the four the task touches or naming that it touches none. A verdict nobody wrote is a step nobody ran, and it fails in one direction only: writing code is the attractor, so the unwritten answer is always "straight to build".

The distinction is the whole economy of this step. A brief demanded for every cosmetic edit is ceremony people route around, and a brief skipped on a structural edit is a decision that dies with the session.

### 1. The screen brief

One file per screen, at `.trunative/screens/<name>.md`. It is the fourth brief: `PRODUCT.md` is the product, `DESIGN.md` is the identity, `STACK.md` is the codebase, and this is one screen.

#### Frontmatter

```yaml
---
target: lib/screens/memories_screen.dart
user_goal: find the trip from last spring again without remembering what it was called
context:
  environment: at home, often beside someone they are showing it to
  posture: seated
  hands: one, the other holds nothing in particular
  attention: full
  session_length: a few minutes
  frequency: a few times a month
  interruption: rare
  urgency: none
primary_action: "Explore Memories"
states:
  loading: skeleton cards in the rail, same row height as the real ones
  empty: no memories yet, offers creating the first
  error: retry without losing the active filter
  offline: cached memories, carrying their age
  partial: n/a, the rail loads whole or fails
  permission: n/a, nothing here is behind a grant
scope:
  open: [lists, navigation, media, scrolling, offline]
  closed:
    forms: there is no input field, the filter is a chip
    search: filtering by person is not a text query
  auto_excluded: [chat, maps, camera, payments, ads]
---
```

Six fields. Nothing joins them without a consumer already reading it.

**`target`** is the file that implements the screen, relative to the project root. It is what links the brief to everything else: `flow/review.md` computes its archive slug from that path, and `npx trunative detect` reads it. There is no `id` field, because the target is the identity and the filename is a convenience. Before the code exists it is the path build will write, and build points it at the real file when that turns out different.

A screen that ships in variants, for a test between arrangements or per audience, gets one brief per variant, each with its own target and its own wireframe. One brief holding three hierarchies has no single structure to compare the code against.

**`user_goal`** is what the person is trying to get done, in their terms and not the screen's. "Show today's departures" is what the screen does. "Know whether to run for this train or wait for the next" is the goal, and it produces a different screen: the first is a list and the second is one figure and a verdict. Write it as the person would say it, including the constraint they are under, because the constraint is usually what decides the layout.

**`context`** is the moment of use, in eight fixed keys: `environment`, `posture`, `hands`, `attention`, `session_length`, `frequency`, `interruption`, `urgency`. Plain words, no numbers with units. Take it from `PRODUCT.md` where that file says it and from the task where it does not, and write `unknown` for a key nobody knows, which is an honest answer and a different one from leaving it out. `flow/explore.md` reads this block before it writes a candidate, and `comp-context` grades the screen against it. The keys are fixed for the same reason the state keys are: a free list leaves out the one that would have argued with the layout already in mind.

**`primary_action`** is the label the user reads, in quotes, not an identifier. `button-label`, `copy-first-word` and `copy-case` all judge the visible string, and the comparison against the code only works on the string. One by default, which is what `button-one-primary` protects. Three other forms exist, and nothing else:

- a choice between two outcomes of equal weight names both labels, each in its own quotes, joined by `or`, and owes the reason that rule asks for;
- a primary that changes with the state of the thing, one label while it runs and another while it is stopped, takes the same form, `"Start" or "Stop"`, and the States section of the body says which state shows which;
- a screen with no primary action, one that is read, or whose rows each lead somewhere, writes `none` followed by the reason, the way a state writes `n/a`.

A label is the words on the control, a few of them. A sentence in quotes explaining where the action lives is a note about the screen, and it belongs in the body under Primary action.

**`states`** carries the six keys `state-set` names, always all six: `loading`, `empty`, `error`, `offline`, `partial`, `permission`. Each value is one line saying what the screen shows, or `n/a` followed by the reason. A missing key, an empty value, or an `n/a` with no reason is a defect in the brief.

The keys are fixed because a free list is a loophole. A screen that picks its own five states declares five, ships five and reads as complete, while the rule asks for six. Fixed keys make the absence something somebody had to write down and sign.

A screen driving a camera, a microphone, location, a motion sensor or a radio owes the five further states in `sense-states` on top of these, in the body.

**`scope`** names files from the Extra table in `SKILL.md`, by the stem or by the rule prefix beside it, whichever the row put in front of you: `localization` and `l10n` are the same row. Never a rule id, and never a file from the Base table, such as `states` or `layout`: base files are opened on every screen, so declaring one says nothing. `open` is what build reads and what `npx trunative rubric --only` takes. `closed` carries the rows a reader would expect to be open, each with the sentence `SKILL.md` requires. Not the whole table: the near misses, which are the only ones anybody argues about later. `auto_excluded` is optional and carries stems alone, for the rows the screen plainly has nothing of. It owes no sentence, and it is there for the reviewer who wants to see that a row was looked at and not forgotten. A row in neither list is simply excluded. When in doubt whether a row is a near miss, it is one, and it goes under `closed` with its sentence.

#### Body

In this order, and nothing else:

1. **Purpose.** One sentence, the job the screen does for the goal in `user_goal`, from `PRODUCT.md`. Then one line on what this product does here that its neighbours in the category do not, which is where `comp-distinct` starts.
2. **Hierarchy.** What wins the screen, in one line, before anything is listed: the one thing a reader lands on, and what every other region is subordinate to. Then the order, numbered, top to bottom. Written without that line it comes out as an inventory of the request's own clauses, which is what this step produces whenever nobody composes anything: each clause becomes a region, the regions stack in the order the clauses were written, and the screen is a transcript of what was asked for rather than an answer to it.
3. **Components.** What is on the screen, named as the thing it is.
4. **Primary action.** The action and where the thumb reaches it.
5. **Interactions.** One line per gesture, as target then result.
6. **Navigation.** Where this screen leads and how it is reached, when either changed.
7. **States.** A subsection per state that needs more than its frontmatter line.

#### The ceiling

Two tests, and the brief fails on either:

- If every line of this screen's code were deleted, could the intent and the structure be rebuilt from this file?
- Does the file contain a number with a unit? Padding, radius, font size, width, a hex colour and a shadow belong in `DESIGN.md`. A brief that starts carrying them is a layout format wearing a brief's name.

### 2. A screen that already exists

Nobody reconstructs a codebase by hand. When a screen has no brief and a structural change arrives, derive the brief from the implementation first, the same way init derives the project briefs from the code, then make the change against it.

Derive what the code shows and nothing more. A state the code does not implement is not written as implemented: it is the `n/a` that has no reason, which is exactly the finding that sends the screen back to build.

This section is for code that existed before the task. A screen written in this session gets its brief before its code, and a brief written afterwards to complete the record is not a spec step: it recorded what was built, and nobody chose it.

### 3. The wireframe

The brief preserves the decision. It does not let anyone see it. A hierarchy list reads in thirty seconds and hides what an image gives away at once: the primary action stranded in an empty frame, the last row of content under the pinned bar, a hero eating a third of the height, a density that does not fit. `flow/review.md` says the same thing when it refuses to close a screen on source evidence alone.

So the brief gets rendered before it gets approved, and the rendering is a page the agent writes.

Before it is a page, it needs a shape. Handed a hierarchy and a primary action and nothing else, an agent reaches for the same shape every time: a bar over a stack of equal-height cards, because that shape is the most common answer to almost every screen it has ever read. Landing there is not wrong by itself; landing there because it was the only shape considered is what the rest of this section stops.

Run `flow/explore.md` now. It names the default, writes three candidates through three lenses with each one written from the brief alone, measures how far apart they are, and only then opens the rules and picks one. It hands back a composition and the reason it won. Only then draw it.

The shapes in `references/wireframe-frame.md` and the relations in `references/design-grammars.md` are prompts for that step, never templates: when neither holds the composition this screen needs, the candidate is invented and named.

Write `.trunative/screens/<name>.wireframe.html` from the brief. The frame, the greyscale palette, the placeholder conventions and the shape vocabulary are in `references/wireframe-frame.md`, which holds the canvas and the drawing conventions to copy, so two screens come out in the same drawing. The canvas is copied. The composition inside it is never copied, from that file or from another screen.

- A wireframe keeps open what has not been decided. It says what dominates, what sits beside what, where the action is and what scrolls, and it stops there: no component styling, no final radius, no production height on a button. The question it answers is "what is the composition", never "what will the component look like". A frame that reads as the finished app with the colour removed has settled a dozen things nobody was asked about, and it draws an approval of all of them.
- Proportions are approximate and are allowed to be uneven. A block can be much larger than its neighbours, sit off the column, overlap a ground, or take a form no stock component has. Drawing only what a component library already contains is how every screen becomes the same one.
- Greyscale, outlines, placeholders, a cross for an image, one system typeface, hierarchy by size.
- Never a brand colour, a gradient, a shadow, a real photograph, an icon set, or any token from `DESIGN.md`. The wireframe settles structure, and a wireframe carrying identity collects an approval nobody asked for.
- HTML even when the project ships Flutter, Compose or SwiftUI. Writing the wireframe in the project's stack is writing the screen twice, which is the cost this step exists to avoid.
- The default state always. One more frame per state whose composition is genuinely different, which in practice is the empty one. Never all six: six frames cost more than the screen.
- A screen that rotates, or whose job is watched from a distance on a phone set down sideways, gets a landscape frame beside the portrait one. Its composition is its own decision, not the portrait one stretched, and a screen that only ever got a portrait frame has a landscape layout nobody chose.
- The file opens with the explore record, the lines `flow/explore.md` hands back, inside an `<!-- explore ... -->` comment. It is what lets anyone, and `npx trunative spec`, see that the composition was chosen between candidates.

Then render it and look at it yourself, before anyone else does:

```sh
chrome --headless --window-size=393,852 --screenshot=wireframe.png .trunative/screens/<name>.wireframe.html
```

Open the PNG however this harness shows an image, and read it as a picture. That pass is the cheap half of this step: the collisions `flow/review.md` can only catch on a device show up here for the price of one HTML file. When the harness cannot show you an image at all, say so in the hand-off and leave the judgement to the user rather than claiming the frame was checked.

What the wireframe settles: the first screenful (`layout-fold`), content colliding with fixed chrome (`layout-chrome`), grouping and density (`layout-grouping`), reach for the primary action (`touch-reach`), and whether the real words fit (`copy-budget`).

What it does not settle, and does not try: contrast, the dark appearance, text at the accessibility steps, measured hit areas, the screen reader, motion. Those are the nine always in scope, they are answered on a device in `flow/review.md`, and they are why the gate below approves structure rather than a finished screen.

The wireframe is scaffolding, not a second contract. After approval nothing reads it: review does not open it, drift does not consult it, and no check validates it. It stays in the repository as the record of what was approved, and a later structural change rewrites it from the brief instead of patching it. One contract, brief against code, and no second surface to diverge.

### 4. The gate

Run the checker first:

```sh
npx trunative spec .trunative/screens/<name>.md
```

It reads the six fields, the context and state keys, the scope, the ceiling, the wireframe's greyscale and the explore record. A finding is fixed before the gate, the same way a pair under the floor stops explore: a brief that fails its own checker is not a structure anyone should approve.

Then show the frame and five lines, per screen:

```text
Memories

Goal           find the trip from last spring again without its name
Hierarchy      title, filters, recent memories, people, navigation
Primary        "Explore Memories", bottom third
States         loading, empty, error, offline; partial and permission n/a
Scope          lists, navigation, media, scrolling, offline

Approve?
```

The approval is about hierarchy, actions, states and navigation. It is not about colour, typeface, spacing or polish, and an answer about those goes to `DESIGN.md` rather than into the brief.

- One screen per question. Several screens approved in one answer are approved as a batch, and the one that needed a second look went through with the rest.
- Rejecting is always an option, beside approving, and so is asking for a different candidate. A question whose only answers are two kinds of yes is not a gate.
- The question is about the structure. A question about an implementation cost, a data source or a library, asked in its place, leaves the structure unapproved however it is answered.
- When the user supplied a reference, the frame is shown beside it and every place the structure departs from it is listed, each with the reason. A departure described in a sentence under a greyscale frame is one the user cannot see, and it comes back after the build.

Never grant it yourself. Writing the brief, drawing the frame and deciding it looks right is this step doing its own homework, not the gate: the gate is the one part of the step the user sees, and a step reporting "approved" with no question asked has claimed something that did not happen.

Ask when the structure is a real decision, meaning any of these holds:

- the winner of `flow/explore.md` is not the arrangement the request described or an ordinary reader of it would expect;
- the screen changes what the product does: a new destination, a changed navigation model, a job moved from one screen to another;
- an interaction is irreversible or costs money, and the structure decides how easy it is to reach;
- the new structure contradicts one the user already approved;
- it is the first structural task of the session, so the user sees once how this step draws.

Proceed without asking when none of them holds: the request already fixed the hierarchy, the actions and the navigation, and the chosen composition is what it asked for. The brief is still written, the candidates still compared and the frame still drawn and looked at. Say in the hand-off that the gate was skipped and on what ground, show the frame and the five lines anyway, and carry on to build. That is a report and not an approval, and the user can stop it there. A loop of build, ask, wait on every component is a gate people learn to click through, which protects nothing.

When the harness cannot show the user a picture, say so and put the five lines in front of them anyway. A gate answered on the text alone is weaker than one answered on the frame, and it is still the user answering.

### 5. Hand off

Say what the brief settled, which extra files its scope opened and which near misses it closed, the lines `flow/explore.md` handed back, what the wireframe pass caught, that `npx trunative spec` passed, and whether the gate was asked or skipped and on what ground. Then run `flow/build.md`.

# flow/explore.md

## Explore

Searches for a composition before one gets chosen. Runs inside `flow/spec.md`, after the screen brief is written and before the wireframe is drawn, on every task that reached spec.

The first layout that comes to mind is the most familiar one, which is a fact about what has been seen most often and says nothing about this screen. A step that draws it and then checks it against the rules has reviewed one answer, however carefully. This step exists so that the choice is made between answers.

Two jobs happen here and they are kept apart on purpose. Generating wants room: a candidate written with the whole checklist open is filtered before it is finished, and what survives that is the layout every rule was written while looking at. Judging wants rigour: once the candidates exist, they are held to everything. So the rules stay closed while candidates are written and open once all of them exist.

Variation is not exploration. Spacing, radius, type size, wording, colour and the size of a component can all change while the screen stays the same screen. A new candidate changes where things sit relative to each other, or how the person operates them.

### 1. Name the default

Before any candidate, write one line describing the layout this screen would get if nobody thought about it: the regions, top to bottom, and where the action lands. Be literal about it.

```text
Default: top bar, a row of filter chips, equal cards in one column, a full-width button pinned low.
```

When the user supplied an arrangement, a mockup, a sketch, a screen from another app they want this one to follow, that arrangement is the conventional candidate, written off the reference and not from memory. The other two lenses still run, since the user may not have seen the alternatives, but the supplied one is what they asked for: a different winner is a departure `flow/spec.md` puts in front of them beside the reference, and `comp-distinct` is never the reason to leave it.

That line is not a candidate yet. It is the thing the other candidates are measured against, and writing it down is what stops it from arriving later under a different name. It may still win in step 5, as the conventional candidate, with a reason. What it may not do is win because nothing else was on the table, or be the first thing written: when the candidates are written one after another, the spatial and the contextual ones come first and the conventional one last, so that the familiar layout is never the text the other two are written under.

### 2. Read the context

Take the `context` block and the `user_goal` from the brief, and say in one line what they demand of the layout. A person standing, one hand busy, glancing for a few seconds, wants one large thing and an action under the thumb. A person seated, both hands free, working through a long session, can take density and a second level. A screen opened forty times a day wants its answer visible before any touch, and a screen opened once a year wants to explain itself.

This line is input to every candidate. A candidate that ignores it is not unusual, it is unfinished.

### 3. Generate three candidates, each from the brief alone

Each candidate is written through one lens. The lenses are what makes the three differ in kind instead of in degree:

- **Conventional.** The strongest established mobile pattern for this job, done properly. This is where the default from step 1 belongs when it deserves to compete.
- **Spatial.** The screen solved through position, proportion and proximity instead of through containers. What would normally sit in a card gets its grouping from space, and what would normally stack gets a different relation: beside, over, anchored, pulled out of the scroll.
- **Contextual.** The screen built around the moment in step 2, even when the result is unusual. Start from what the person is doing with their body and attention, and let the components follow.

The three are allowed different amounts of distance from the default, and the amounts are the point. The conventional candidate may be the default done well. The spatial candidate has to change the structure: what dominates, how things are grouped, what contains them. The contextual candidate has to change the interaction model, meaning what the hand does to get the job done: a tap where there was a form, a glance where there was a tap, a hold, a drag, a single control that replaces a screen of them. A third candidate operated exactly like the first has not used its lens.

`references/design-grammars.md` holds the spatial relations a candidate can be built from, and the shape list in `references/wireframe-frame.md` holds compositions that already have names. Both are prompts. A candidate that fits none of them is drawn anyway and given a name of its own, in two words, the way `hero-split` or `canvas-overlay` were: a name is what lets the next screen refer to it.

A candidate is five lines and no drawing:

```text
Candidate B, spatial: "departure board"
Dominant     the next departure, as a single large figure
Order        figure, the platform beside it, later departures as a quiet strip below
Action       "Set alert", attached to the figure it acts on
Grouping     by proximity, no cards
Operates     one tap on the figure, horizontal swipe through later departures
```

Write each one from the brief, not from the previous candidate. A candidate written with another one in view comes out as a revision of it.

When this harness can spawn sub-agents at all, spawn one per lens: that is an instruction, not an option to weigh against speed. Each gets the brief, the context line, the lens and the two reference files, and nothing else. Only when it cannot, write the candidates one at a time, re-reading the brief before each and never quoting, comparing against or referring to a candidate already written. The comparison happens in step 4, and doing it earlier is how three candidates become one.

Heuristics stay closed during this step. The one constraint a candidate carries while it is being written is the brief: the hierarchy line, the primary action, the six states and the context.

### 4. Measure the distance

Two candidates are different when the relations inside them differ, and these are the nine relations:

1. the dominant element
2. the reading direction
3. how content is grouped
4. where the primary action sits
5. how the screen relates to navigation
6. the container strategy: cards, plain rows, full-bleed, none
7. the scroll strategy: one axis, a pinned region, paged, none
8. information density
9. the interaction model: what the person does with their hand to get the job done

Compare every pair and count the relations that differ. Write the three counts.

```text
Candidates         3
Default named      yes
A against B        5   dominant, grouping, action, containers, interaction
A against C        4   dominant, action, scroll, density
B against C        3   reading direction, scroll, interaction
Action placement   A pinned low, B attached to its object, C the whole figure
Context fit        A medium, B high, C high
Project so far     two approved screens are stacks, none is built on a figure
```

This is a gate and it is mechanical. Until the table shows three candidates and every pair at three or more, the step does not move on to judging.

A pair under three is one hypothesis written twice. Drop the weaker of the two and generate a replacement through the same lens, from the brief. Do not repair a candidate by nudging it until the count passes: a candidate edited toward a number differs on paper and not on the screen.

The count is a floor and nothing more. It says the candidates are far enough apart to be worth comparing. It does not say any of them is good.

### 5. Judge, then choose

Now open the rules. Every base file, and the extra files in the brief's `scope`. Each candidate is read against them, and against these questions, in this order:

1. Which one makes the job in `user_goal` obvious soonest?
2. Which one costs the fewest touches and the least reach for the primary action?
3. Which one fits the context line from step 2?
4. Which one carries the hierarchy line from the brief without flattening it?
5. On which one does every region say what is behind it before it is touched? A person follows a label, a shape or a preview toward what they want, and a region that gives none of those gets skipped or opened by mistake.
6. Which one has the least structure doing no work?
7. Which one could only belong to this product? That is `comp-distinct`.

Then look at what the project already has: `.trunative/screens/*.wireframe.html`. A composition that has already won twice in this project needs a reason to win a third time, which is `comp-repeat`. Screens of one product should be recognisably related and should not be the same screen with different content.

Compare them as pictures, not only as lines. Draw the candidates as rough frames side by side in one page, using the canvas in `references/wireframe-frame.md`, one `.shot` per candidate labelled A, B and C, and render it the way `flow/spec.md` renders a wireframe. Rough means blocks and real words, a few minutes each: what is being compared is where the weight sits on the first screenful, and five lines of text hide that as well as code does. The page is scratch, so write it outside `.trunative/screens/` and do not keep it. When the harness cannot show an image, say so and judge on the lines.

A candidate that breaks a rule is not dropped for that alone. Ask whether the break is in the composition or in a detail: a primary action out of reach is the composition, and a row that would need a taller hit area is a detail build settles.

Novelty is never the criterion. The candidates were pushed apart so that the choice would be real, and the one that wins is the one that serves the person best, which is sometimes the conventional one. When it is, write why the other two lost. Convergence on the familiar is what owes the explanation, because it is the outcome that happens by itself.

### 6. Hand back

Write it into the response, and at the top of the wireframe inside an `<!-- explore ... -->` comment, one key per line with the value after two spaces or more, never into the brief. The comment is what `npx trunative spec` reads: without it, a skipped explore step looks exactly like one that ran.

```text
Default      top bar, filter chips, equal cards, pinned button
Context      standing on a platform, one hand, a glance every minute or so
Candidates   A "timetable" (conventional), B "departure board" (spatial), C "countdown" (contextual)
Distance     A/B 5, A/C 4, B/C 3
Default used no, it competed as A and lost
Chosen       B, because the next departure is the whole job and A buries it in a list
Lost         A reads as a schedule to study, C hides later departures behind a gesture
```

`Default`, `Context`, `Candidates`, `Distance`, `Chosen` and `Lost` are required, and `Distance` counts all three pairs as `A/B`, `A/C` and `B/C`.

Then return to `flow/spec.md` and draw the chosen candidate. The hierarchy in the brief is updated when the winner reordered it, since the brief is the contract and this step is allowed to change its mind.

# flow/build.md

## Build

Writes or changes one screen, one component, or one flow. Never runs before init passes.

### 1. Frame the screen

Before anything else, write one line saying whether this task establishes or changes hierarchy, actions, states or navigation. If it touches any of the four, stop here and run `flow/spec.md`: a new screen, a new component with state of its own, or a new flow touches all four by definition, and arriving at this file with one of those in hand means the step was skipped rather than judged.

That line is written, not recalled. Unwritten, the answer is always the same one, because code is what this step is for and the pull is toward starting it.

**When the screen has a brief**, at `.trunative/screens/<name>.md`, read it and build what it says. The person's goal and the moment they are in, the hierarchy, the primary action, the six states and the scope were settled in `flow/spec.md`, and the composition was chosen between alternatives in `flow/explore.md`. Rederiving them here is the context this step exists to save. Build the composition that won, as it was drawn: the pull while writing code is back toward the stock arrangement the framework's widgets suggest, and a screen that quietly reverts to a bar over equal cards has thrown the choice away, which review reports as drift and scores under `comp-context`. Where the brief and the request disagree, the brief is stale: go back to `flow/spec.md` and change it rather than building against a file that now lies.

**When it has none**, and the line above says the task touches none of the four, state in one or two lines before writing code:

- the single job this screen does, taken from `PRODUCT.md`
- the one primary action, and where the thumb reaches it
- what happens on a slow network, on failure, and with no data

If the screen has more than one primary action, it is more than one screen. Split it and say so.

If framing it turns out to move hierarchy, actions, states or navigation after all, the change was structural and misjudged. Stop and run `flow/spec.md`.

### 2. Load only what applies

Read `DESIGN.md` for the tokens and `STACK.md` for the primitives that reach them. Then open every file under **Base** in `SKILL.md`, and from **Extra** the files this screen triggers. Do not read the whole folder. Use `references/` on demand, for a specific number or platform API, never as background reading.

Base is not part of this choice. Colour, text, targets, layout, states, actions, words, motion and artwork are on a splash screen and on a chart alike, so deciding a screen does not touch one of them is not a decision this step gets to make.

Extra is not a feeling either. Name the screen in one line, as the thing it is rather than as the feature it belongs to, then run that line down the Covers column of the Extra table in `SKILL.md`, row by row. Open every row whose words are on the screen. Leave a row closed only with a sentence naming what this screen does not have that the row is about. List what you opened, and what you closed and why, before writing anything, because a file opened after the screen exists reviews it rather than shapes it.

A brief's `scope` has already made that pass. Open what `scope.open` names and reuse the sentences in `scope.closed`, and run the pass yourself for anything the brief does not cover, because a screen grows between the brief and the code.

When the screen touches Firebase, in any of auth, Firestore, Storage, Messaging, Remote Config or Crashlytics, read `flow/firebase.md` as well. It is loaded here the way a heuristic is, and it is not a step.

**When the user supplied a reference for this screen**, an image, a sketch, another app's screen, read it before the tokens and build what it shows. It is not a mood to be interpreted: the ground, the weights, the glyphs, the spacing between groups and how a selected item is marked are all in it, and a value the reference shows is not a gap to fill with a derivation. Where the rules and the reference disagree, build the reference, record the conflict for review, and tell the user which rule it breaks and what that costs.

**When `DESIGN.md` is missing, or says nothing about a role this screen needs.** Init writes that file and `doctor` is what notices it is gone, but screens get built in the gap anyway, and what fills the gap on its own is the median of everything a model has read: a system font, a violet button, a rounded card, and a screen that would fit any other product. Settle the identity in writing before the first line of code, in five lines:

- the material or reference this product evokes, named. Newsprint, film stock, enamel signage, a receipt, a ledger. An adjective is not a reference.
- ground, ink and accent derived from it, as roles rather than as values typed into the screen (`color-derived`, `color-roles`).
- the display face and the interface face, each with the reason it was picked (`type-face`).
- the shape language: which radii exist, which edges stay square, and how depth arrives (`layout-shape`).
- what the artwork on this screen depicts (`icon-depicts`).

Write the reference before any value, never the other way round. What arrives first in this gap is the median of everything the model read, and it arrives with a reference attached to it afterwards, which reads exactly like a derivation. When the palette lands in either family `color-derived` names, the second derivation it asks for happens here, before the first line of code, and the identity says which of the two was kept and why.

Those five lines are provisional and say so. They go to the user to confirm into `DESIGN.md`, and until that happens they live in one place in the code rather than inside the components that read them. The next screen built in the same gap uses the same five lines, or the product has two identities and nobody decided which one it has.

### 3. Write it

- Reuse the tokens `DESIGN.md` defines and the components `STACK.md` lists. A raw value where a token exists is a defect, and a new primitive needs a reason.
- Apply the heuristics as you write, not as a pass afterwards.
- Where a heuristic cannot be met, leave the code correct and record the conflict for review. Do not silently drop the rule.

### 4. Look at it

The screen has been written, not seen. Everything above this line is source: the token reached for, the rule applied as the line went down, the conflict recorded. None of that is the screen, and the defects that survive a correct diff are the ones that only exist once something is drawn: a region that depicts nothing, a hierarchy that reads flat at arm's length, a control that sinks into the surface behind it, an identity that is named in `DESIGN.md` and absent from the render.

So render it and look at it yourself, before anyone else does, the way `flow/spec.md` already looks at its own wireframe. How this project renders a screen is what `STACK.md` is for.

Open the capture however this harness shows an image, and read it as a picture rather than as a file that was produced.

When the user supplied a reference, put the capture beside it at the same width and list every difference a person would point at: a ground that is grey where the reference is white, a title weight, a glyph, an indicator, a gap between groups, a control that moves when it is selected. Fix them or name them in the hand-off. Saying the screen matches without having looked at the two together is how the same correction comes back from the user one item at a time.

Then say where the reference behind the identity is visible on the screen. One named thing a stranger could point at is enough. A reference that cannot be found anywhere in the render was a caption rather than a derivation, which is the failure `color-derived` names one level down, arriving here instead.

This pass is cheap and it is not the review. It catches what the author can still fix in the same turn, which is the half of `flow/review.md` that would otherwise come back as a violation and spend a second pass on it. When the screen cannot be rendered here at all, say so in the hand-off instead of reporting it as looked at: a screen nobody has seen reaches review as a screen nobody has seen, and review is told that rather than left to discover it.

### 5. Hand off

Say which heuristics files you applied and which you deliberately skipped, with the reason, and name the triggers that opened the extra ones. When this screen had to settle an identity because `DESIGN.md` did not, the five lines go in the hand-off, marked provisional. Name the brief you built against, or say the change was not structural and had none. Then run `flow/review.md`. Build is never the last step.

Where the code had to depart from the brief, change the brief in the same turn and say what moved. A brief left behind is what review reports as drift, and it is cheaper to correct here than to explain there. The same holds when the user asks for the change: a request that moves an item the brief names under Hierarchy, Interactions or Navigation, or removes a screen another brief links to, rewrites those briefs in the same turn, and a structural change also redraws the wireframe through `flow/spec.md`.

Then run `npx trunative spec` over the briefs this build touched. A build renames and splits files, and a `target` pointing at a file that no longer renders the screen is a brief that joins to nothing.

A plan that builds several screens builds them one at a time, each through this file and each reviewed before the next starts. Writing every screen first and the briefs afterwards, to complete the record, turns spec into paperwork about decisions nobody made.

# flow/review.md

## Review

Runs after every build, on the code that was just written, and again on request over a finished screen. Reviewing your own output is the point: the build step optimizes for getting the screen working, and this step optimizes for finding where it fails in a hand.

One grader, one scale, one set of rule ids. What changes between a run on a diff and a run on a screen is not the standard, it is how much of the screen was actually seen, and the report says so.

### The scale

Every rule in scope gets a number from 1 to 5. The same words on every rule, on every run, because a rule that invents its own wording for a 3 makes two runs incomparable.

A score is a claim about what was observed, never about how the screen feels. Each level has a test, and the test is a thing somebody can point at:

| Score | Means | The test |
|---|---|---|
| 1 | Critical violation | What the rule exists to prevent is on the screen, on the ordinary path, and the person meets it on every visit. You can name the element and what happens to them. |
| 2 | Clear violation | Something is in place and it does not hold. Met here and dropped on the next screen, met for the default case while the case the rule is about is the exception, or met in code that never runs. You can name where it fails. |
| 3 | Acceptable | The Check line is true on the ordinary path, and you can point at the line or the capture that makes it true. None of the edges the rule names was examined. |
| 4 | Well resolved | A 3, plus every edge the rule's own text names was examined, and exactly one is still open. You can name that one. |
| 5 | Reference | A 4 with nothing open, and the evidence is attached: the measurement, the capture, the device run. Another screen in the project could copy this one. |

Three consequences, and they are what stops a number from being a mood. A 3 with nothing to point at is `unrun`. A 4 that cannot name its one open edge is a 3. A 5 without attached evidence is a 4, and a 5 on a `[device]` rule without a device run does not exist.

Some rules are not a matter of degree. A control has an accessible name or it does not, a string is hardcoded or it is not, a list is virtualised or it is not. A row the checklist prints as `pass or fail` takes one of four answers and never a number, since a 1 to 5 on it would be precision nobody measured:

- **`pass`**: the Check line is true, and you can point at why.
- **`fail`**: it is not.
- **`n/a`** and **`unrun`**, as below.

A `pass` counts as 5 out of 5 and a `fail` as 1 out of 5 in the total, so the percentage still reads across runs.

A **violation** is a 1, a 2 or a `fail`. The build loop continues while there is one. Nothing at 3 or above blocks a build, which does not make it finished.

#### Severity and the blocked screen

Every row carries a severity, from the rule's own heading:

- **P0**: the person cannot complete the job, or loses work.
- **P1**: the person is excluded or misled. Every one of the nine always in scope is at least this.
- **P2**: friction, or a platform convention broken. A rule with no mark is P2.
- **P3**: polish.

The overall score cannot outvote a severe failure. When any P0 or P1 rule is a violation, the status of the screen is `BLOCKED`, and it is printed in the header beside the percentage, never in place of it: `92%, BLOCKED by a11y-name` is a legitimate header, and it means what it says. Ninety-nine rules at 5 and one P0 at 1 is a screen somebody cannot use. The band in section 4 is not printed for a blocked screen, because "Nothing structural left" above a P0 failure is false.

Two answers that are not scores. Not applicable is written `n/a` and never 0, because a zero in a table of scores reads as the worst one and ends up in somebody's sum:

- **`n/a`**, with the reason in the row: the feature does not exist here, the platform does not have it, or `STACK.md` records the exception. Not available for the nine rules under **Always in scope** in `SKILL.md`. An `n/a` written in a screen brief is a claim the brief's author made before the code existed, so it is checked here like any other claim, and it never arrives as an exemption. Exceptions accepted on purpose live in `STACK.md`, which is the only file that grants one.
- **`unrun`**: the rule applied, nothing was checked, and the run knows it. A rule you did not check is never a pass.

Anchors are not a curve. Most rules on a screen built with this skill land at 3 and 4, a 5 is earned by evidence rather than by the absence of a complaint, and a screen with no 1s and no 2s is a screen that ships, which is a lower bar than a good screen.

### 1. Re-read the code

Review the actual code, not your memory of writing it. Open the files that changed.

After a build that is the diff, including a build that went straight from a one-line verdict to code: a change too small for spec is still a change someone will hold, and its review is the same file with a smaller scope, printed with its header. On request it is the screen: the widget, view or composable that renders it plus whatever it pushes and presents, opened on a device or a simulator.

### 2. Scope and checklist

The scope is every base file plus the extra files this screen touches, settled by your own pass over the Extra table in `SKILL.md` rather than by what the build says it opened. The nine always-in-scope rules sit inside the base files and are never `n/a`. Write the scope down before grading. A scope chosen once the scores are in is a scope chosen to flatter them.

An identity the build had to settle because `DESIGN.md` did not carry one is part of the scope, not a note beside it. It is graded by `color-derived`, `type-face`, `layout-shape` and `icon-depicts`, against the five lines the build wrote, and the arrangement answers to `comp-distinct` in the same way, and a screen whose identity would fit any other product in the category scores a 1 on the first of them however clean the rest of the code is.

Name the screen first, the same way build does, and derive the scope from the name. A build that named it wrong took the wrong files with it, and a review that inherits the build's list inherits the mistake. Where your pass reaches a file the build never opened, its rules are in scope all the same and every one of them is `unrun` until it is checked: a rule nobody looked at is not a rule that passed.

A screen brief at `.trunative/screens/<name>.md` does not change that. Its `scope` is what the spec step decided and what the rubric was generated from, and it may widen your scope and never shrink it. Where your own pass reaches a file the brief left out, grade it and report the difference as drift.

```sh
npx trunative rubric --only forms --only search
```

Base is in every rubric. `--only` adds extras, by file stem, by rule prefix such as `form-`, or by a single rule id, and repeats. `--format=ids` prints the ids alone, which is what a diff against the previous run reads to catch a rename.

The checklist is generated, never written by hand:

- Do not add a row. A rule that should exist belongs in `heuristics/`, and the next run picks it up with no second edit.
- Do not delete a row. A rule that does not apply is `n/a` with a reason, which is a different fact from a rule nobody looked at.
- Do not grade a rule that is not on the checklist. An id that is not there was renamed or removed, and a score for it is a score for nothing.

Each row carries the rule's own Check line, which is the criterion. Grade against that sentence, not against a memory of the heuristic. A row marked `[device]` is a rule the file cannot settle from the source, which decides the evidence in step 3.

### 3. Grade

Every row gets a score, one line of finding, and its evidence:

- `source`: the code was read. The claim is about intent.
- `device`: the screen was driven. The claim is about the app.
- `source+device`: both, and they agreed. Where they disagree the device wins, and the disagreement is a finding.

A rule the checklist prints `[device]` on may not take `source`: its own file has already said a diff cannot settle it, so a number from the source alone is a guess wearing a score. The paragraph that file closes its Check section with, printed under the group as `Not from a diff`, says why. Those rules are `device`, `source+device`, or `unrun`. A rule without the mark can be graded from the source, and is still worth seeing on a device.

A screen is never closed on `source` alone. Render it, look at it, and keep the capture beside the report. What the file hides and the picture shows in a second: the last row of content sitting under a pinned bar, the primary action stranded in the middle of an empty frame, a hero occupying a third of the height and depicting nothing, placeholder text standing in as the content. None of that is arguable from code, and all of it is what a person sees first.

**Mobile web**

```sh
chrome --headless --window-size=402,874 --screenshot=screen.png file:///absolute/path/screen.html
```

**Flutter and React Native and SwiftUI and Jetpack Compose**

```sh
xcrun simctl io booted screenshot screen.png   # iOS simulator
adb exec-out screencap -p > screen.png         # Android emulator or device
```

**Any other stack**

Capture the running screen the way this platform captures one, and scroll to the end of the content before the capture.

Scroll to the end of the content before capturing, or the collision `layout-chrome` exists to catch stays hidden.

When the app is running on a device, split the work in two and keep the halves apart, because a grader who has already read the measurements grades the measurements:

**Judging.** Reads the source, drives the screen, and fills in every row.

**Measuring.** Produces numbers and captures, no scores at all, each keyed to a rule id. Start with the one measurement that needs no device:

```sh
npx trunative detect lib/screens/checkout_screen.dart
```

It reads the files and answers the part of a `Check` line a file can settle, reporting per rule id. Three things follow from that and none of them is optional: every finding is `source` evidence, so it never settles a rule marked `[device]`; a finding is a place to look rather than a score; and its silence proves nothing, so a rule it did not answer stays with the grader. It exits 2 when it finds something, which is not a failure.

Then the measurements that do need a device: both appearances on the narrowest and widest device class, the largest accessibility text step on the narrowest, hit area bounds read from the inspector rather than estimated from a screenshot, the primary flow completed with the screen reader on, the screen with the network off and after a process kill the system would have made itself, and real records rather than seed data, meaning a null, a zero, a long string, an old timestamp and an empty list. When the app can reach a real account, use it: demo data was written to look right, which is the one thing real data does not do.

Some defects only exist over time, and a capture of the settled screen shows none of them. Capture the screen while it loads and again once content arrives, and compare where things sit, since `state-loading` fails in the step between the two. Leave the screen open for a minute and look again: a relative time that never changes, a figure that should have refreshed, a banner that should have gone. Time the ordinary interactions, the sheet opening, the tab switching, the list returning, instead of judging them by feel.

A device the user is working on is theirs. Before changing a setting on it, font scale, display size, rotation lock, theme, locale, animations, language, say which, and put every one back before the hand-off, listing what was changed and restored. A test that leaves the phone at double text size or with rotation locked has broken the next thing the user tries.

How the two are kept apart depends on the harness you are running in:

When this harness can spawn sub-agents at all, run them as two, spawned so that neither reads the other's output: that is an instruction, not an option to weigh against speed. Only when it cannot, finish the judging pass and record it, then measure.

Then reconcile: the judged score stands unless a measurement contradicts it, and every score a measurement moved is printed with both numbers. The report is one table, not one pass after the other. When they could not be kept apart, the report says so on its first line.

### 4. The numbers

The maximum is 5 times the number of rules actually scored from 1 to 5. Nothing else is in it.

- The denominator is never the size of the scope. A scope of 74 rules with 9 `n/a` and 5 `unrun` scores out of 300, not out of 440.
- Report coverage beside the total: scored, `n/a` and `unrun`, out of the scope. A run that skipped the device work does not come out ahead of one that did it.
- Record which ids were `n/a` and which were `unrun`. A later comparison against a run that hid them is a comparison of two different measurements.

The percentage is an average, and an average hides exactly the thing this step is for: one rule at 1 disappears among ninety at 5. So it is never reported alone. It travels with the status (`BLOCKED`, `VIOLATIONS` or `CLEAN`), the count of violations by severity, and the coverage. The band is read only when the status is `CLEAN`.

Bands read off the percentage, since the maximum moves with the scope:

| Percentage | Band |
|---|---|
| 90 and above | Nothing structural left. |
| 75 to 89 | Solid, with named gaps. |
| 60 to 74 | It works, and the edges do not. |
| 40 to 59 | Structural work before polish. |
| Under 40 | Not designed for a phone yet. |

### 5. Report

The report goes in the response, in this order:

1. **Header.** What was reviewed, the scope, the status first, then the violations counted by severity, the total, the percentage, the coverage, and the band when the status is `CLEAN`. `BLOCKED` names the rule ids that block.
2. **The table.** Columns: rule, severity, score or pass and fail, evidence, finding. Print every rule at 4 or below and every one of the always-in-scope nine, then one line per file for the rest: file, rules scored, average, lowest.
3. **Violations.** Every rule at 1, 2 or `fail`, ordered by severity and then by what it costs the person using the app, and never by how easy it is to fix. Each names the rule id, the file and line, what the user meets, and the fix. Say plainly when the screen is unusable one-handed, loses work on interruption, or has no failure state, and do not bury it under smaller findings.
4. **Spec drift.** Only when the screen has a brief, and unscored. Start with `npx trunative spec` on that brief, whose findings are drift already written down, then read the brief's Hierarchy, Interactions and Navigation against the code, and the screens it names against the briefs that exist. Each entry quotes what the brief says and what the code does: a hierarchy in a different order, a `primary_action` whose label is not the one on screen, a state declared and not implemented, a scope the brief left out. Where the divergence also breaks a rule, name the id that already scores it, such as `state-offline` for a declared state that is not there, and do not score it twice. Drift is a fact about two files disagreeing, and the moment it carries a number this file has two graders in it.
5. **What moved.** Scores a measurement changed, with both numbers.

If a violation is a deliberate exception recorded in `STACK.md`, it is `n/a` with that exception as the reason, not a 1 defended in prose. Whether the exception is a good one is a separate question with its own test, in `references/accepted-exceptions.md`: a rule written as a default admits a reasoned exception, a reason that fails that test is reported as a finding against `STACK.md`, and the nine always in scope and every P0 rule admit none.

Name the element, say what it costs, give the fix. Nothing in the report is an invitation to look into something later.

### 6. Record

Every run gets archived, the partial ones included. A run that left rules `unrun` lists them in its frontmatter, and the trend below says so whenever that list differs from the previous run's: a partial run hidden from the history is not avoided, it is merely forgotten, and the next session starts again from nothing. Rules on a device are the ones most often left `unrun` on a working machine, so a history that only kept complete runs would stay empty.

Write the report to `.trunative/review/<slug>-<YYYY-MM-DD-HHmm>.md`, one file per run, kept in version control. The slug comes from the primary file's project-relative path: lowercase it, replace every run of characters that is not a letter or a digit with a single hyphen, and drop a leading and trailing one, so `lib/screens/checkout_screen.dart` becomes `lib-screens-checkout-screen-dart`. It is computed the same way on every run and never invented, because the trend reads it.

Frontmatter, machine readable:

```yaml
---
target: lib/screens/checkout_screen.dart
slug: lib-screens-checkout-screen-dart
spec: .trunative/screens/checkout.md
date: 2026-09-08T14:22
skill: sha256:6f0a...
scope: [touch, forms, states, layout, typography, colors, motion, accessibility]
status: VIOLATIONS
violations: [p0: 0, p1: 0, p2: 2, p3: 1]
total: 236
max: 300
percent: 79
scored: 60
na: [pay-restore: no purchases on this screen, ads-report: no Android build]
unrun: [a11y-announce, type-scaling]
---
```

`unrun` is empty on a complete run, and never left out. `skill` is the hash in `.trunative/skill.lock`. It says which set of rules produced the numbers, which is how a later run knows the rulebook moved under it. `spec` is the screen brief this run graded against, omitted when the screen has none, so a later comparison can tell a screen that changed from a screen whose declared intent changed.

Then read the newest five archived runs with the same slug and print one line:

> Trend for `lib-screens-checkout-screen-dart`: 61%, 74%, 79% (236/300 this run).

The comparison is only honest when the measurement is the same, so name any of these that changed since the previous run, on the same line: the skill hash moved, so some of the difference is rules rather than the screen; the scope changed, and which files joined or left; or the `n/a` set or the `unrun` set changed, since a rule that was excused or skipped last time and scored now moved the total on its own. The scope may grow between runs and may not silently shrink: a later run covering fewer files is not a better run.

First run: there is nothing to compare against. Say so in one line, name it the baseline, and name the file the next run will read.

### 7. Loop

- Any rule at 1, 2 or `fail`: go back to `flow/build.md` with this report and fix them, P0 and P1 first, then review again.
- A violation in a `comp-` rule where the arrangement itself is the problem is not a build fix. Go back to `flow/explore.md`: a composition nobody chose is repaired by choosing one, and patching the code leaves it unchosen.
- Drift where the code is right and the brief is stale: correct the brief and carry on. Drift where the brief is right and the code left the approved structure: that is hierarchy, actions, states or navigation moving without anyone deciding it, so go back to `flow/spec.md`, not to build.
- Stop when all four of these hold, and not because a number was reached. An average of 4.2 closes nothing by itself:
  1. no P0 or P1 rule is a violation, so the status is not `BLOCKED`;
  2. no rule at all is at 1, 2 or `fail`;
  3. no spec drift is left unresolved, in either direction;
  4. every rule the checklist marks `[device]`, and every one of the nine always in scope, has been checked on the evidence it requires, so none of them is `unrun`.

  Then report what was built, what was checked, what was excused and what was not seen. A run that meets the first three and not the fourth has not closed the screen: it says which checks are outstanding and what would run them.

Two consecutive reviews finding the same violation means the fix is not working. Say so and ask the user, instead of looping a third time.

Do not fix and grade in the same pass. A grader that edits the code it just graded has no second opinion left for the next run.

# flow/firebase.md

## Firebase

Loaded by `flow/build.md`, never as a step of its own, whenever the screen touches auth, Firestore, Storage, Messaging, Remote Config or Crashlytics.

It exists because Firebase decides things this skill already has rules about. Offline persistence changes what an honest loading state is. Local writes come back before the server has seen them, so what the screen shows is a claim rather than a fact. An agent that wires it up without knowing that produces screens the heuristics then have to fight.

Two lines of scope, said once rather than left to silence:

- Security rules, indexes, quotas and billing are not design. This skill does not review them, and a screen that looks right over rules that let anyone read the collection is still the project's problem to fix.
- Mobile web is out. The JavaScript SDK is a different product with different offline behaviour, and a project on `web` uses this file for nothing but the auth gate below.

### 1. Auth is a navigation gate with three states

The signed-out and signed-in pair is the one everybody builds. The third is **restoring**: the moment between launch and the SDK answering from its own persisted session. It is not a loading spinner over the app, it is a state the router has to name.

- The first frame while the session resolves is the launch surface handing over, not a screen that flashes and replaces itself. That is `splash-first-frame` and `splash-entry`.
- Each of the three states lands somewhere written down, and the signed-in landing is the product's own screen rather than a home that then redirects. `nav-restore` and `onboard-first-action`.
- The restoring state is short and bounded, so nothing in it measures anything (`splash-no-progress`), and a session that fails to restore is a signed-out user rather than an error screen.
- A route guard that runs before the session resolves sends a signed-in user to the sign-in screen for one frame. That frame is the defect.

### 2. Sign in methods

The order, the provider buttons and the account the routes resolve to are `auth-methods` and `auth-provider-button`. The web flow leaving the app is `auth-web-flow`. The OTP screen, its autofill and its error recovery are `auth-code-screen` plus `form-autofill` and `form-error`.

What belongs here rather than there: Firebase returns one user object from every provider, so two routes that reach the same person must reach the same uid. Linking a credential to the current user rather than signing in again is what makes that true, and it is the step that gets skipped.

### 3. Firestore persistence is on, so the honest state is queued

Offline persistence is enabled by default on the mobile SDKs. A write goes into the local store, the listener fires immediately, and the server sees it later.

- A screen waiting on a server that was never needed is a defect, not a loading state. Read the local snapshot and render.
- The state for an unconfirmed write is pending, not done and not failed. That is `state-queued`, and the snapshot's own pending-writes flag is where it comes from.
- Cached content carries its age (`state-stale`), and the snapshot's from-cache flag is the source of that mark.
- The network being off is not an error class here. `state-offline` names four states and this is the cached one.

### 4. Latency compensation makes optimistic UI the default

The local write returns before the round trip, so the screen is already optimistic whether or not anyone decided it. Two consequences:

- The rollback path is the one that gets skipped. A write the server finally rejects has to undo what the screen already showed, keep what the user typed, and say what happened without blaming them: `state-retry` and `copy-error`.
- A rejection can arrive minutes later, on another screen. It lands in the quietest vehicle that still reaches the user (`fb-ladder`), attached to the item rather than to wherever they happen to be.

### 5. Storage uploads outlive the screen

Progress counted in real bytes, a resume handle that survives the process, and a transfer that does not die with the screen are `net-upload` and `off-queue`. The photo still going up is a row with its space reserved (`list-images`), not a blocking dialog.

### 6. Messaging and the push permission

The system prompt is one tap and it is spent forever. Everything about when to ask, what the screen before it says and what the denied path does is `perm-notify-ask`, `perm-rationale` and `perm-answers`. The in-app equivalent for someone who said no is `notify-inapp`.

Firebase-specific: the token is per install and it rotates. Nothing in the interface promises delivery, and a screen that says notifications are on because a token exists is reporting the wrong fact.

### 7. Remote Config arrives after the first frame

The screen has to be correct before any value lands, which means shipped defaults rather than empty strings, and no layout that shifts when the fetch returns.

- Defaults are set in code and the screen renders from them. A paywall whose price appears a second late is `pay-price-source` and `icon-reserve` at once.
- A value that changes what the user is looking at waits for the next screen rather than rewriting the current one.

### 8. Crashlytics and Analytics, the part that is design

- Screen names match the flow the user walks, so the funnel and the navigation graph are the same thing.
- Nothing the user typed leaves the device in an event, a log or a crash report. That is `priv-instrument`, and it is the rule an analytics call breaks fastest.
- What the store declaration says has to match what the SDKs actually collect: `priv-declared`.

### 9. Setup

Only commands and file paths live here. Every design consequence above applies whatever the stack is.

**Flutter**

Add the plugins with `flutterfire configure`, which writes `lib/firebase_options.dart` and both native config files. Initialise with `Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform)` before `runApp`, and keep that off the launch path beyond what the first screen draws (`perf-cold-start`). Persistence is on by default; the settings object is `FirebaseFirestore.instance.settings`.

**React Native**

Install `@react-native-firebase/app` plus one package per product. Put `GoogleService-Info.plist` in the iOS target and `google-services.json` in `android/app/`, then apply the `com.google.gms.google-services` plugin in the app-level Gradle file. The modular API is the current one; the namespaced calls are deprecated. Expo needs a development build and the config plugin rather than Expo Go.

**SwiftUI**

Add the Firebase SDK through Swift Package Manager, put `GoogleService-Info.plist` in the app target, and call `FirebaseApp.configure()` in the `App` initialiser or an `AppDelegate` adaptor. Persistence is on by default.

**Jetpack Compose**

Add the Google services plugin and the Firebase BoM to Gradle, put `google-services.json` in `app/`, and let the content provider initialise Firebase rather than calling it from `Application.onCreate`. Persistence is on by default.

### What review scores this against

This file adds no rules. It says what Firebase does to the screen, and review scores the result against the rules that already exist:

| What Firebase decided | Scored as |
|---|---|
| The restoring state and where each of the three lands | `state-set`, `nav-restore`, `splash-first-frame` |
| One uid behind every route on the sign-in screen | `auth-methods` |
| Reading the local store instead of waiting on the server | `off-local-first`, `state-loading` |
| The pending-writes flag drawn as pending, the cache flag as age | `state-queued`, `state-stale` |
| The rejection that arrives after the screen already showed the write | `state-retry`, `copy-error`, `fb-ladder` |
| The upload that outlives the screen | `net-upload`, `off-queue` |
| The push prompt and the denied path | `perm-notify-ask`, `perm-rationale`, `notify-inapp` |
| Shipped Remote Config defaults and a screen that does not shift | `pay-price-source`, `icon-reserve` |
| Screen names, and nothing typed leaving the device | `priv-instrument`, `priv-declared` |

Two of them are answered on a device rather than in the router, and both pass on a warm app with a fast connection, which is the only condition the code was written against. Cold start with a stored session and watch the first two frames, then turn the network off, make a write, and look at what the row says while the server has not seen it.

# heuristics/accessibility.md

## Accessibility

Everything else in this repository describes what the screen looks like. This file describes what is underneath it: the name of each control, the order they are reached in, and what the app says when something changes. That layer is the whole interface for someone using a screen reader, a switch, or their voice, and it is invisible in a screenshot, so it is the layer that gets shipped empty.

A phone sharpens every part of it. There is no width for labels, so controls become icons with no text at all. There is no keyboard, so actions become gestures that a reader user cannot perform. One screen shows at a time, so content is swapped in place rather than loaded as a new page, and nothing announces the swap. And the settings that change the interface live in the operating system, apply to every app at once, and are already on when the app launches.

Four neighbours carry pieces of this and are not repeated here: `color-not-alone`, `touch-floor`, `touch-spacing` and `type-scaling`. `list-a11y` is a fifth of a different kind: it is these rules applied to a list row, so the two are read together.

Rules in this file, in order: `a11y-name`, `a11y-hidden`, `a11y-order`, `a11y-collection`, `a11y-announce`, `a11y-focus`, `a11y-gesture`, `a11y-alt-input`, `a11y-settings`, `a11y-media`, `a11y-test`.

### `a11y-name` Every control carries a name, a role and a value [P1, pass or fail]

Three separate things, and the last two are the ones that go missing.

The **name** says the action and its object, in the words the user would use. It is not the icon, not the asset, not the glyph identifier. A control announced as `ic_chevron_right` or `star.fill` is not a poorly named control, it is an unusable one. `button-label` governs the visible label; this is what gets read when there is no visible label at all, which on a phone is most of the toolbar.

- Leave the control type out of the name. The role already carries it, so "Add button" is announced as "Add button button".
- Leave the surrounding context out too. Inside a player, "Play", not "Play song".
- No two controls a voice user could address carry the same name. Three buttons all called "More" give a voice user nothing to say and a switch user nothing to aim at. Two rows that genuinely hold the same words are not that failure.

The **role** arrives free with a real control and has to be declared on anything built from a container plus a tap handler: `Role` in Compose, a trait in SwiftUI, the `button`/`header`/`slider` flags in Flutter, `accessibilityRole` in React Native.

The **value** is the current state, and it changes while the name does not: `stateDescription` in Compose, `accessibilityValue` in SwiftUI, `Semantics(value:)` in Flutter. A real control brings its own: a `Switch` reports checked or not checked and a `Toggle` reports on or off with nobody writing a line, so declaring a value over that is noise. Two cases are not covered. A container plus a tap handler standing in for a control reports no state at all. And a default can be right and still misleading, which is what an override is for: a mute button announced as "selected" is describing the widget rather than the sound. The same trap catches any control whose name should change with its state: a play control that keeps the name it was built with is lying half the time.

Anything drawn onto a canvas (a chart, a custom picker, a signature field) has no child elements and is a single blank node until semantics are written for it by hand, with `ExploreByTouchHelper` on Android views or a semantics tree in the declarative kits.

### `a11y-hidden` Decoration is hidden, not described

Every node in the tree is a stop the user has to step through. An icon sitting beside the label it duplicates, a divider, a background image, a chevron that only says the row opens: hide each one rather than naming it. `contentDescription = null` in Compose, `.accessibilityHidden(true)` in SwiftUI, `ExcludeSemantics` in Flutter. What matters is the outcome: a node that produces no semantics of its own, a spacer, a divider drawn as a background, already costs nothing and needs no declaration written over it.

The opposite failure is just as common and reads worse: decoration given a description of its own picture, so the reader says "grey rounded rectangle with a blue circle". Text needs nothing, because it announces itself. And a loading placeholder is decoration until real content replaces it, so the shimmer blocks are hidden and the arrival is announced once (`state-loading`, `a11y-announce`).

### `a11y-order` Reading order is the order, and grouping decides how many stops

Traversal order comes from the layout tree, walked in the reading direction of the content. It breaks wherever drawing order and layout order disagree: an absolutely positioned element, a bar drawn after the content it sits above, a floating button declared last in the file, an overlay stacked on top of the screen it belongs to.

Fix it by fixing the declaration order. An override is the second answer: in Compose that is `isTraversalGroup` on the parent with `traversalIndex` on the children, and `traversalIndex` alone does nothing without the group flag on the parent.

Grouping is the other half of the same rule. A card holding an image, a title, two lines of body and a badge is one thing to the user and six stops to a reader. Merge it so it reads as one sentence. `list-a11y` covers list rows; the identical problem appears in a card, a stat block, a labelled value pair, and a field with its helper text and its error.

The screen title is announced first on arrival, so a screen whose title exists only inside a custom header view arrives in silence. Give it a title the system knows about: the navigation title where the stack has one, and `paneTitle` in Compose on a screen whose header is a composable of your own. Headings are what a reader jumps between instead of walking every element, and the trait that makes one is `list-a11y`.

### `a11y-collection` A collection says how long it is and where in it you are

A phone has no scrollbar, and a recycling list keeps roughly a screenful of nodes alive at a time (`list-virtualise`). So a reader user walking it is told neither how many items exist nor which one this is, and there is nothing on screen to answer either question.

A list, a grid or a carousel declares itself as a collection and each child declares its position in it, so the reader announces item three of two hundred. The platform list primitives do it on their own; anything assembled by hand does it explicitly, with `collectionInfo = CollectionInfo(rowCount, columnCount)` on the container and `collectionItemInfo = CollectionItemInfo(...)` on each child in Compose, and `IndexedSemantics` in Flutter. The total is how many items the data holds, not how many rows are realised: a count that follows the recycler tells the user the list is shrinking while they walk it.

### `a11y-announce` Content that changes without a navigation has to say so

Almost nothing on a phone is a page load. A filter narrows the list in place, a total recalculates, a field turns red, a banner slides in at the top. A sighted user catches all of it in peripheral vision. A reader user is three stops away and is told nothing at all.

- Mark the region that changes and let the platform speak it: `liveRegion = LiveRegionMode.Polite` in Compose, an announcement notification on iOS, `Semantics(liveRegion: true)` in Flutter.
- Polite by default. Assertive cuts off whatever the user is listening to, so it is reserved for the thing that stops them: a failure, a payment result, a session ending.
- Four that must never fire: one per keystroke inside a field, one per frame of a progress bar, one per row of an incoming page, one per tick of a countdown. Announce the outcome, never the process.
- The announcement is the same sentence the screen shows, which means it is a translated string (`l10n-strings`) and, for a failed field, the message `form-error` already placed beside it.
- An announcement is heard once, and the field keeps failing after it. So the field declares the failure on its own node, in those same words, and somebody who reaches it a minute later hears why instead of hearing the label alone: `error("...")` in the Compose semantics, the value and the traits on iOS.

### `a11y-focus` Focus moves where the screen moved, and comes back

- When a sheet, dialog or cover opens, focus moves into it and cannot leave. On a phone the new surface covers the whole screen, so a reader that can still walk the layer beneath is reading a screen the user cannot see. The platform primitives settle it by presenting in their own context or window: `.sheet` and `.fullScreenCover` in SwiftUI, `Dialog` and `ModalBottomSheet` in Compose. An overlay stacked by hand inside a `ZStack` or a `Box` does not, so there the layer beneath is made inert by hand: `.accessibilityHidden(true)` in SwiftUI, `Modifier.clearAndSetSemantics {}` in Compose, `ExcludeSemantics` in Flutter, `accessibilityViewIsModal` on iOS with `importantForAccessibility="no-hide-descendants"` on Android in React Native.
- On dismissal, focus returns to the control that opened it. Dropping the user at the top of the screen makes them traverse the whole thing again to get back to where they were.
- The way out has to be reachable from inside the surface, which is `nav-modal` stated for a user who cannot perform the dismissing gesture.
- Focus never moves unless the user asked it to. Taking it on load talks over the screen title, and taking it on every state change makes the screen impossible to read. Two moves are asked for and stay: onto the single field a screen exists for, such as search or a code (`form-input`), and onto the first failing field after a submit (`form-error`).

### `a11y-gesture` A gesture is never the only route [P1]

A swipe, a long press, a drag to reorder, a pinch, anything with two fingers: none of these can be performed by someone using a reader, a switch, or a keyboard. Each one needs a named route to the same result, and where that route comes from depends on what drew the gesture.

- Where the primitive already projects the gesture into the tree, the work is naming it. `Modifier.combinedClickable(onLongClickLabel = "Pin conversation")` puts the verb into the long press the platform is already offering, and a platform swipe row carries its actions with whatever labels they were given. An action left unnamed is announced as a generic one, and that is the defect rather than a missing declaration.
- Where nothing projects it, a swipe layer assembled by hand, a drag to reorder, a pinch, the route is a custom action on the same node, named with the verb: `customActions` in Compose, `.accessibilityAction(named:)` in SwiftUI, `CustomSemanticsAction` in Flutter, `accessibilityActions` in React Native. `list-a11y` is this rule applied to a row.
- A value that is dragged (a slider, a reorder handle, a rating) gets the adjustable action instead, so it moves one step at a time.
- Custom multi-finger gestures have no route at all. Use the simplest gesture that works, and keep the visible equivalent that `list-swipe` and `list-refresh` already require.

### `a11y-alt-input` Switch and voice reach the app through names and targets

A switch moves one highlight through everything focusable, in order, one press per step. Voice control acts on whatever the user can read out loud off the screen.

- The spoken name matches the visible words. A button reading "Send" whose name is "Submit your message" cannot be spoken to. Where the two genuinely have to differ, the visible words are added rather than swapped in: `accessibilityInputLabels(_:)` is the iOS hook, and on Android there is no separate field, so the visible words go inside the description itself.
- Anything that takes the highlight is something the user can act on. Decoration left in the tree (`a11y-hidden`) turns a five-step screen into a twenty-step one, and each of those steps is a physical press.
- The highlight has to be visible, and it is the one piece of this that gets deleted on purpose. `outline: none` on mobile web, and any focus style suppressed because it looked wrong under a finger, leaves the switch and keyboard user pressing forward with nothing on screen saying where they are. Replace the default indicator with a better one; never remove it and leave nothing.
- Every action is reachable by stepping, in a finite number of steps. A control that only appears mid-drag, or only under a long press with no custom action, does not exist for this user.
- Nothing that carries the only copy of something dismisses itself on a timer: a toast holding an error message, a snackbar holding the only undo, a code that expires while the highlight is still walking toward the field. Stepping across a screen takes several times as long as tapping it. Prefer an explicit dismissal.

### `a11y-settings` The system settings are people, not options

Larger text, bold text, increased contrast, reduced motion, reduced transparency. Each one is switched on by a user who needed it, and each one is already on before the app launches.

- Larger text and bold text are `type-scaling` and `type-weight`. Both are honoured by taking every style from the theme rather than typing a size or a weight into a component, and the size the interface has to survive is the largest step `type-scaling` names.
- Reduced motion belongs to `motion.md` in full. Read the setting, honour it, and do not restate it here.
- Increased contrast is read as `colorSchemeContrast` in SwiftUI or `isDarkerSystemColorsEnabled` in UIKit, where the symbol name does not contain the word, and as `UiModeManager.getContrast()` from API 34 on Android. On iOS the semantic system colors answer it on their own; on Android the response has to be written, and either way a hex typed into a component cannot follow it (`color-roles`).
- Reduced transparency is an iOS setting with no Android counterpart, so an Android-only build answers it as not applicable. On iOS it is honoured by the platform's own material and ignored by a blur rebuilt by hand, which is one more reason `color-gradient` sends you to the system one.
- All of these are live values, not launch-time facts. Somebody will change one while the app is open, from the accessibility shortcut, and the screen has to follow: `addContrastChangeListener` on Android, the matching change notification on iOS.

### `a11y-media` Nothing is carried by audio alone

Phones are used muted, in public, and by people who cannot hear them.

- One of these the system already answers, which is the half a diff can be checked against: `isClosedCaptioningEnabled` on iOS and `CaptioningManager.isEnabled()` on Android say captions are wanted. Read it at launch and on its change notification, and start the player the way it says. Whether video may start by itself is `motion-autoplay`.
- The rest is designed rather than read. Video carrying speech or meaningful sound carries captions, with the control to turn them on inside the player rather than buried in settings.
- Sound is never the only signal. A success chime, an error beep, a haptic with no visible change: pair every one with something the screen shows (`touch-feedback`).
- Audio that starts on its own is gated by `motion-autoplay` and `sound-unasked`, and the control to stop it is reachable in one step.

### `a11y-test` Drive one whole flow with the reader on

- Run the platform scanner first, on every screen that changed. It catches the missing name, the small target and the low contrast, and it catches none of the four things above it: wrong order, wrong name, missing announcement, missing route.
- Then use the app without looking at it. One complete flow, start to finish, stepping forward through every element with the screen reader on. Count the stops on the busiest screen: a card or a row costs one stop plus one for each separately tappable control it carries, which `list-row` caps at two. Above that, the merge `a11y-order` and `list-a11y` ask for did not happen.
- Run it once more at the largest text size, and once with the reader off using a switch or a hardware keyboard.

### Check

Review answers each of these against the code, pointing at the line:

- Every interactive element has a name that is not its icon or asset, a declared role, and a declared value wherever the platform's own is missing or misleading, and no two controls a voice user could address share a name. `a11y-name`
- No decorative element produces a stop, and nothing decorative carries a description of its own appearance. `a11y-hidden`
- Traversal follows declaration order, any `traversalIndex` sits under an `isTraversalGroup` and carries the reason the order itself could not be fixed, each composite reads as one stop, and the screen has a title the system knows about. `a11y-order`
- Every list, grid and carousel declares its collection and each child its position, with a total taken from the data rather than from the realised rows. `a11y-collection`
- Every in-place content change has a live region or an announcement, polite unless it stops the user, none fires per keystroke, per frame, per row or per tick, and a failed field declares the failure on its own node. `a11y-announce`
- Modals contain focus and return it to the opening control on dismissal, a hand-built overlay makes the layer beneath inert, and focus moves nowhere else except onto a single-field screen or the first failure after a submit. `a11y-focus`
- Every swipe, long press, drag and multi-finger gesture reaches the same result through a named action: the primitive's own label where it projects one, a custom action where nothing does. `a11y-gesture`
- Spoken names match visible labels, nothing decorative takes the highlight, the focus indicator is visible and was never merely removed, every action is reachable by stepping, and nothing holding the only copy of something dismisses on a timer. `a11y-alt-input`
- Increased contrast is read and honoured on each platform it exists on, reduced transparency on iOS is left to the system material, and every setting is read live rather than cached at launch. `a11y-settings`
- The system captions preference is read, video with speech has captions, no signal is audio or haptic only, and anything that starts on its own can be stopped in one step. `a11y-media`
- The scanner was run on the changed screens and one full flow was completed with the screen reader on. `a11y-test`

The last line is not answerable from a diff. `a11y-order`, `a11y-collection`, `a11y-announce` and `a11y-focus` are only half answerable from one: the tree they describe exists at runtime, so a file can show the intent and only a running screen shows the result.

### Reaches

- `heuristics/buttons.md`: `button-label`
- `heuristics/colors.md`: `color-not-alone`, `color-roles`, `color-gradient`
- `heuristics/forms.md`: `form-error`, `form-input`
- `heuristics/lists.md`: `list-a11y`, `list-virtualise`, `list-swipe`, `list-refresh`, `list-row`
- `heuristics/localization.md`: `l10n-strings`
- `heuristics/motion.md`: `motion-autoplay`
- `heuristics/navigation.md`: `nav-modal`
- `heuristics/sound.md`: `sound-unasked`
- `heuristics/states.md`: `state-loading`
- `heuristics/touch.md`: `touch-floor`, `touch-spacing`, `touch-feedback`
- `heuristics/typography.md`: `type-scaling`, `type-weight`

# heuristics/ads.md

## Ads

Advertising is the one part of a mobile interface designed against the person holding the phone, so most of what governs it is store policy rather than taste. Breaking a rule here is a rejection, a takedown or a suspended ad account, not a critique.

A phone hands an ad the whole screen and hands the user one thumb. There is no window frame saying where the app stops and the ad starts, no hover before a tap commits, and every pixel a banner takes is a pixel the content does not get. The rules below all follow from those three facts.

An app that carries no ad SDK skips this file. An app that carries one reads all of it, because a single ad unit brings the whole policy surface with it. It starts with the store data declaration: the dependency collects on its own account, so the diff that adds it is the diff that leaves the filing stale, which is `priv-declared`.

Rules in this file, in order: `ads-labelled`, `ads-close`, `ads-placement`, `ads-frequency`, `ads-reserve`, `ads-adjacency`, `ads-rewarded`, `ads-consent`, `ads-report`, `ads-a11y`, `ads-entitlement`, `ads-cost`, `ads-children`.

### `ads-labelled` An ad says it is an ad, and never wears the app's clothes

Both stores require this. Apple's display advertising rule says an ad that interrupts or blocks must clearly indicate that it is an ad and must not manipulate or trick users into tapping it. Play's ads policy bans ads that simulate or impersonate the interface of any app feature, notifications included, and requires that it be clear which app is serving each ad.

- On a phone the ad takes the same full-bleed surface every real screen takes, so the container edge is the only thing marking that ownership changed. This skill's implementation of the requirement follows from that: the label lives on the container and is drawn by the app, the plain word, in the app's own type, legible rather than the smallest grey on the screen. Neither store dictates who draws it; drawing it yourself is what makes it survive a creative that would rather it did not.
- A native unit borrows the row's layout, never its meaning. Styled as a feed item, a search result, a chat message or a system alert, it is the pattern the policies exist to stop.
- Nothing dressed as a permission prompt, a notification, a download control or a piece of navigation, and nothing the app draws itself pointing at the unit: an arrow, a badge, a count, a caption suggesting a tap.

### `ads-close` The close control is visible in the first frame and sized like a target

Apple requires any interrupting ad to provide easily accessible and visible close or skip buttons, large enough to dismiss with ease, and attaches no delay to that anywhere. Play requires ads that interfere with normal use to be easily dismissible without penalty, and only forbids a full-screen interstitial still uncloseable after 15 seconds, dropping to 5 seconds where the app declares a child target audience. Those permissions do not overlap, so build the strict one: an exit present from the first frame.

- Where the app draws the surface (a house banner, a sponsored card, an offer), the close control is yours and it takes the platform floor from `touch-floor`. A small X in the corner of a creative is the target that gets missed, and the miss is a click on the ad.
- Where the SDK draws it, the choice of format and its close configuration is still yours. Run each format on a real device and watch for the frame the control appears in, because some defaults hold the user longer than the strict rule allows.
- Play states that ads must not interfere with the operation of the device, system or device buttons included. The back gesture keeps working while the ad is up, and it is never the only way out.

### `ads-placement` The full screen ad marks the end of something, never the start of it

Play forbids full-screen interstitials that appear unexpectedly, typically when the user has chosen to do something else, and forbids them at the beginning of a level or content segment. Google's own SDK guidance points at the pause between levels. Both are satisfied only when the ad closes the segment the user just finished instead of standing in front of the next one.

Where it may not go:

- **Launch.** Play bans a full-screen video interstitial before the app's launch surface, and AdMob's placement policy bans interstitials on app load and on exit outright. That ban is about interstitials. The dedicated app-open format is a different product with its own rules, and this file does not settle it: a team using one answers it from that network's own guidance rather than from this bullet. What may hold the launch is `splash-hold`.
- **Inside a task.** A form being filled, a payment, a message being sent, a video playing. This is where a mis-tap is worth the most, and AdMob names exactly these: a game being played, a form being filled, content being read.
- **On back.** Returning to a previous screen is navigation, not a break in attention.
- **Immediately after another interstitial the user just closed.**
- **Anywhere but this app.** Apple keeps display advertising in the main app binary and out of extensions, App Clips, widgets, notifications, keyboards and watch apps. Play allows an ad only inside the app serving it and names overlays, companion functionality and widgetised ad units as things it may not become.

The result is a surface the user did not open. It is not a modal in the sense `nav-modal` means: there is no work to keep, no commit verb to name, and the single exit `ads-close` requires is the whole of it. What does transfer is the system back event, which behaves as `nav-back` describes, and containment plus the return of focus, which is `a11y-focus`.

The segment boundary above is the only thing that buys the full screen. Everything else about a surface nobody asked for is `fb-unprompted`, which names this placement as its one exception and keeps the rest: the dismissal remembered for a written period, the plain close rather than a trick one, and the shapes an app may not borrow.

### `ads-frequency` The cap is a number in the code, not whatever the network sends

Neither store publishes a frequency figure. AdMob does, as a ceiling on its own publishers: no more than one interstitial after every two user actions. This skill borrows that number as the default wherever the network in use publishes none of its own. Treat it as the maximum and pick something lower.

Enforce it at the call site rather than in the mediation dashboard, which changes without a build and is not in the diff. And remember what a session is here: minutes long, interrupted constantly (`state-interrupt`). A counter that resets on every resume is not a cap, so the interval is wall clock time as well as a count.

### `ads-reserve` The slot is the right size before the ad exists

An ad comes over the network, so it arrives late, after the reading has started and the thumb is already moving. A container that grows when it fills shoves everything below it and the tap lands on whatever slid into place. Reserve the declared ad size as a fixed height, the same way `icon-reserve` reserves a picture's box. Where the format sizes itself from the device width, the height is available before the request is sent: ask for it and reserve that, rather than letting the container find out on fill.

- Decide the no-fill state in advance: keep the space or collapse it, once, not on every refresh. A banner that vanishes and returns on rotation is layout shift on a schedule.
- A pinned banner shortens the scroll rather than floating over its last row, `layout-chrome`.
- It also comes out of the first screenful, `layout-fold`. The content budget pays for the banner; the banner does not arrive from somewhere else.

### `ads-adjacency` Nothing the user aims at shares an edge with an ad

AdMob's placement policy says an ad may not be placed so that it interferes with navigating or interacting with the app's core content and functionality, and Play's families policy names ads that suddenly appear in areas of the app where the user usually taps for another function. A mis-tap here earns money, and Apple bans both halves of that trade: artificially increasing impressions or click-throughs, and apps designed predominantly to display ads.

- `touch-spacing` puts 8dp between two of the app's own targets. An ad edge is worth more, because the mis-tap pays: leave at least 16dp between the ad container and the nearest control, and 24dp where that control is the screen's primary action.
- The bottom third is where the thumb lands (`touch-reach`) and where the tab bar, the primary button and the banner all want to sit. At least one of the three moves.
- No ad on a screen that exists for one decision: a confirmation, a payment, a permission rationale, anything destructive.

### `ads-rewarded` The trade is stated before it starts, and the reward survives the process

A rewarded ad is one of the two places an ad may interrupt honestly. The other is the end of a segment the user just finished (`ads-placement`); this one qualifies because the user chose it. Tapping the offer is the consent, so the offer has to be complete: what they get, and roughly how long it takes.

- Persist the grant on the reward callback, before drawing anything. Google guarantees its own reward callback fires before its dismissal callback; no other network promises that, and a mediation adapter is where the promise goes. So the instruction has to hold without it: grant on the reward callback wherever the SDK raises one, and never on dismissal. The process can be killed while a full-screen ad is up, and the user who watched it is owed the reward either way.
- What is bought is always an extra. Play states that an app cannot force a user to click an ad, or submit personal information for advertising, before they can fully use it, so the app's own function never sits behind an ad.
- No dead ends. Declining the offer returns to the screen it was made on, and the exit rules in `ads-close` apply to the rewarded unit exactly as they apply to any other full-screen ad.

### `ads-consent` The consent state is read when the request is built, and the no path is the normal one

- **iOS.** An ad SDK that links this app's data to what other companies collected needs the tracking permission and `NSUserTrackingUsageDescription` in the property list; without that key, the app can crash the first time a user opens it. Whether the prompt is owed at all, and how it is introduced, is `perm-tracking`.
- **Android.** Declare `com.google.android.gms.permission.AD_ID` when targeting Android 13 or above. It is not `androidx.ads.identifier.provider.HIGH_PRIORITY`, which is the provider side of the same feature and belongs to nobody shipping an app. Ask for the ID fresh on every request instead of caching it, and expect a string of zeros from anyone who opted out or deleted theirs.
- The advertising ID is for advertising and user analytics and nothing else. Play states that outright, so it does not become a device key, a login hint or a join across other data the app holds.
- Build the request so the non-personalised answer is the default and consent upgrades it. An ad stack that only serves after a yes turns a legitimate refusal into a broken screen.
- Read the state at request time. Play requires the opt out of interest-based advertising or ads personalisation setting to be verified, and a value captured at launch is stale the moment someone changes it in system settings and comes back.
- Some signals are barred from targeting whatever the answer was. Apple names health and medical data, school and classroom data, and anything from children. Nothing in those categories reaches an ad request, which is a question about what the app passes to the SDK, not about the consent flag.

### `ads-report` The user can see why this ad reached them, and report it, without leaving the app

Apple requires both halves: all the information used to target an ad has to be visible without leaving the app, and the app has to include a way to report an inappropriate or age-inappropriate ad. Where a unit ships an affordance, open it and watch where it lands, because one that opens a browser is the failure rather than the pass, and check it renders and responds on the smallest supported screen at the largest text size. Where a format has none, the app supplies the route itself, next to the reporting path in `set-diagnostics`.

Apple also requires the served creatives to suit the app's own age rating. That is a setting on the ad unit, not a property of the ad stack: put the content rating ceiling on the unit rather than leaving it at whatever the network defaults to, which is how a 12+ app ends up carrying 17+ creatives. The child audience case is a harder fork, `ads-children`.

### `ads-a11y` Someone using a screen reader has to be able to get out

Third-party creative is content nobody on the team wrote and nobody can relabel, so the app owns the frame around it.

- The close control is a real control with a name (`a11y-name`). A full-screen ad is a presented surface, so it takes containment from `a11y-focus` exactly as a sheet does: focus moves into the ad and cannot walk the screen underneath, the close control is reachable from inside it, and focus returns where it was on dismissal. That is the containment move `a11y-focus` already describes, not a new one.
- The container announces itself as an ad, and the creative under it is one stop rather than a walk through every element inside it.
- Drive one interstitial and one banner with the reader on before shipping, as `a11y-test` requires of any flow.

### `ads-entitlement` Someone who paid to remove ads has to stop seeing them everywhere

An app that sells any removal of advertising (a one-off unlock, a paid tier, a subscription, or a bundle that happens to include it) carries an entitlement, and every ad call site reads it before requesting anything. Not before showing: before requesting, so nothing is fetched, no impression is counted and no data leaves the device.

One missed call site is the whole feature failing, because the user only has to see one ad to know they were charged for nothing. That is a refund, a one-star review naming the exact screen, and the store's own complaint route.

- The check lives with the ad request, in one place both the banner and the interstitial paths go through, not repeated per screen where a new screen forgets it.
- The entitlement resolves before the first ad opportunity, including on a cold start with no network. Unknown is not treated as unentitled: a paying user offline is still a paying user, and the last known state is what the app acts on until the store answers.
- It survives reinstall and a new device through restore, which is `pay-restore`. An entitlement that only lives in local storage is lost with the app.
- Removing ads removes the space too. A paid user does not get the reserved slot from `ads-reserve` as a blank rectangle, and the layout closes up.
- Anything the paid tier still shows, a house promo or a cross-sell for another app of yours, is still an ad under `ads-labelled`, and selling their removal and then showing them is the pattern users report.
- Apple's Developer Code of Conduct, guideline 5.6, names charging for features or content that are not delivered as conduct that terminates the developer account. An ad shown to someone who paid to remove ads is that sentence, with the receipt attached.

### `ads-cost` The ad stack is paid for in launch time, memory and the user's data

- Initialising an ad SDK is not launch work. Keep it off the path to the first frame, `perf-cold-start`.
- The Google Mobile Ads SDK treats a preloaded ad as stale after an hour, and endorses a cache of them cleared and reloaded on that hour. This rule overrides that: hold one at a time, because a pool of full-screen creatives is the largest thing the app keeps for nothing, and `perf-memory` is what the phone kills the app over.
- Video creatives are the heaviest thing the app fetches and nobody asked for them. Do not prefetch them on a metered connection, `net-metered`.
- Each SDK is download size the user sees before any of the design does, `perf-size`, and mediation adds one per network.

### `ads-children` A child audience declaration forks the ad design per store

Neither store binds on who is observed using the app. It binds on what the app declared: submission to Apple's Kids Category, and a child or mixed target audience declared on Play. An app children use that made neither declaration is not under these rules, and one that made them is, whoever ends up holding the phone.

Apple's Kids Category rule keeps third-party advertising out altogether, with a narrow exception for contextual services that publicly document their practices for that category and put human review on the creatives. Play's families policy allows ads and constrains them instead: certified ads SDKs only, no interest-based advertising or remarketing, no interstitial immediately on app launch, nothing uncloseable after 5 seconds including rewarded and opt-in formats, one banner or video per page, and no offerwall or immersive format that is not clearly distinguishable from app content.

No single configuration satisfies both. Decide from `PRODUCT.md` whether the app makes either declaration, and where it does, record the per-store ad configuration in `STACK.md` before any unit is added.

### Check

Review answers each of these against the code, pointing at the line:

- Every ad container carries a visible label drawn by the app, and no unit is styled as a feed row, a system alert, navigation or a download control. `ads-labelled`
- Every ad the app can show has an exit present in its first frame, meeting the platform touch floor, with the back gesture still working. `ads-close`
- No interstitial call site sits at launch, on exit, on back, inside a task or at the start of a segment, and no ad unit is built outside the app itself, in an extension, a widget, a notification, a keyboard or a watch app. `ads-placement`
- A frequency cap with a written number and a time interval is enforced in code, not in the mediation config. `ads-frequency`
- Every ad slot reserves its declared size before it fills, has a decided no-fill state, and shortens the scroll rather than covering it. `ads-reserve`
- At least 16dp separates every ad container from the nearest control and 24dp from a primary action, and screens that exist for one decision carry no ad at all. `ads-adjacency`
- A rewarded offer states what is traded, grants on the reward callback and persists it, and nothing the app is for sits behind an ad. `ads-rewarded`
- The consent state is read at request time, the non-personalised request is the default path, `NSUserTrackingUsageDescription` is in the property list and `com.google.android.gms.permission.AD_ID` is declared where the build targets Android 13 or above, and no health, classroom or child data reaches a request. `ads-consent`
- Targeting information and an ad report route are both reachable without leaving the app, and the unit carries a content rating ceiling matching the app's own age rating; a codebase that ships only to Android answers this not applicable. `ads-report`
- The close control has a name, the ad contains focus and returns it on dismissal, and the creative is a single stop for the reader. `ads-a11y`
- Where any purchase removes advertising, one entitlement check guards every ad request rather than each display, resolves before the first opportunity, treats unknown as the last known state, survives restore, and collapses the reserved slot. `ads-entitlement`
- Ad SDK initialisation is off the cold start path, the preload pool is one, and video is not prefetched on a metered connection. `ads-cost`
- Where the app is submitted to the Kids Category or declares a child target audience, the ad configuration is per store and written into `STACK.md`. `ads-children`

Four of these are only half answerable from a diff, because the SDK draws what the file cannot show. On a device, run every ad format the app can serve and watch which frame the close control appears in (`ads-close`), open the targeting and report affordances and confirm they stayed inside the app at the largest text size on the smallest supported screen (`ads-report`), drive one interstitial and one banner with the screen reader on (`ads-a11y`), and measure the distance from the rendered ad container to its nearest control (`ads-adjacency`). A call site is where the rest of the file is checked; these four are settled on the running screen.

### Reaches

- `heuristics/accessibility.md`: `a11y-focus`, `a11y-name`, `a11y-test`
- `heuristics/feedback.md`: `fb-unprompted`
- `heuristics/icons-and-imagery.md`: `icon-reserve`
- `heuristics/layout.md`: `layout-chrome`, `layout-fold`
- `heuristics/navigation.md`: `nav-modal`, `nav-back`
- `heuristics/payments.md`: `pay-restore`
- `heuristics/permissions.md`: `perm-tracking`
- `heuristics/privacy-ui.md`: `priv-declared`
- `heuristics/settings.md`: `set-diagnostics`
- `heuristics/splashscreen.md`: `splash-hold`
- `heuristics/states.md`: `state-interrupt`
- `heuristics/touch.md`: `touch-floor`, `touch-spacing`, `touch-reach`
- `platform/network.md`: `net-metered`
- `platform/performance.md`: `perf-cold-start`, `perf-memory`, `perf-size`

# heuristics/auth.md

## Identity and the session

Signing in is the one screen where a phone is worst at everything it does: a keyboard covering half the display, characters that are masked as they are typed, and a device that is handed around, backgrounded mid task and killed without notice. Every character of a password costs more here than anywhere else, so most of this file is about not asking for one.

Whether an account is needed before the first useful action is `onboard-look-first`, and what offering account creation obliges the app to do is `onboard-account`. This file is the rest of the life of an identity: the returning sign-in, what a fingerprint result is allowed to mean, the session ending in the middle of a task, which account is acting, getting out, and getting deleted.

The field mechanics belong to forms: `form-input` and `form-autofill`. The biometric prompt as a surface, and the eight ways it can end, are `sense-biometric`. System permission prompts are a different thing and live in `permissions.md`.

Rules in this file, in order: `auth-methods`, `auth-provider-button`, `auth-web-flow`, `auth-magic-link`, `auth-last-used`, `auth-code-screen`, `auth-biometric-session`, `auth-expiry`, `auth-reauth`, `auth-active-account`, `auth-signout`, `auth-delete`.

### `auth-methods` Every route on the screen reaches the same account

Count the sign-in routes a returning user can tap without scrolling. The count is not the rule: what fails is two routes that open separate accounts for the same person, which is where somebody taps the wrong logo and lands in a second account holding none of their data. Which routes have to be on that screen at all, and how they are sized against each other, is `onboard-account`. The order they appear in is decided once and does not reshuffle between visits.

- On Android the first route is Credential Manager, which `onboard-account` already requires: passkeys, saved passwords and federated accounts arrive inside that one sheet rather than as buttons beside it. The sheet is dismissible, so a persistent control sits beside it to reopen the flow without restarting the app, and that control is the entry point rather than one more provider.
- On iOS there is no such sheet and nothing federated lives inside the platform route. Saved passwords and passkeys are offered on the username field itself, which is `form-autofill`, and Sign in with Apple is a button sitting beside that field under `onboard-account` rather than an item inside it.
- Prefer a passkey where the app is not already offering Sign in with Apple, and on Android wherever Credential Manager is the entry point. Where the app still accepts a password, the passkey is offered at the first successful sign-in that does not use one.
- Registering or asserting a passkey needs the app and the site associated first, and each side has its own file and its own failure: the `webcredentials` associated domain on iOS, where a missing one returns an error, and on Android an `assetlinks.json` at the domain's well-known path carrying the login-credentials relation for the app's package and its release signing fingerprint, where a mismatched package or fingerprint fails both create and get. The association ships with the button or the button does not ship.

### `auth-provider-button` A provider button is a component, not a style

Apple ships a component and Google ships artwork, so the two are built differently. Take Apple's wherever the stack can reach it: `ASAuthorizationAppleIDButton` in UIKit, `SignInWithAppleButton` in SwiftUI, or a wrapper that renders one of those. A hand-built copy where the component is reachable loses the approved appearance, the automatic translation and the accessibility label that came with it. Only where the stack cannot reach it, Flutter included, is the button a replica, and then it owes the published specification exactly. Google publishes marks and a specification rather than a button, so that one is always built and always measured against the specification.

- Both publish the same three titles: sign in with, sign up with, or continue with. Apple's component enforces them; on Google's side what is unmodifiable is the mark, so a button carrying anything else is checked against the mark rules rather than assumed safe. Both titles translate with the rest of the app, under `l10n-strings`, and localizing them is expected rather than tolerated.
- Apple's artwork stops being compliant below 140x30pt, with clear space of one tenth of its height around it, and the logo-only form is a PNG only at 44x44pt and vector at every other size. That 30pt is the floor for the artwork, not for the control: 44pt is already Apple's recommended default button height, and either way the hit area answers to `touch-floor` while the artwork keeps its own minimum and its clear space inside that hit area.
- Google's mark keeps its standard colors at its standard size: never monochrome, never the letter alone without the button around it, and the button preserves its aspect ratio.
- The narrow column is what breaks these. A full-width stack of buttons stretches a fixed-ratio asset, so scale the button and let the artwork keep its ratio inside it.

### `auth-web-flow` The provider's page opens outside the app

A provider sign-in that opens a web page opens it in the system authentication session: `ASWebAuthenticationSession` on iOS, Custom Tabs on Android. `SFSafariViewController` is not one of these. It is a browsing surface: what happens inside it is not visible to the app, and nothing guarantees the callback comes back to the app that opened it rather than to another app registering the same scheme. An embedded web view under the app's own control is worse still, refused outright by the provider, and it puts somebody else's password field inside a surface this app can read.

- The return leg lands back on the screen the flow started from, with its state, rather than on a fresh stack or the home screen. It arrives through the session's own callback on iOS, a registered callback scheme or, from iOS 17.4, an https callback, and through a claimed app link on Android.
- A cancelled or failed return leaves that screen intact and says what happened beside the route that failed, under `form-error`.

### `auth-magic-link` A sign-in link has to survive the trip through a mail app

- The link is a claimed universal link or app link, so tapping it opens the app rather than a web view inside the mail client, where the session waiting for it does not exist. Its landing is `nav-deeplink`.
- The screen that is waiting is going to be backgrounded and is often process-killed before the link is tapped. It comes back under `state-interrupt` and finishes there, rather than restarting the flow with a second link.
- A link opened on a different device from the one waiting says so and offers the code route in `auth-code-screen` instead of failing silently, and the link is spent when the person acts on it rather than when something fetches it, because a mail scanner or a link preview fetches it first.

### `auth-last-used` The phone remembers which door this person used

A phone is one device belonging to one person far more often than a browser is, and that is the fact a sign-in screen should be spending. Store which method succeeded on this device and mark it on the next visit, because a returning user offered four identical buttons and no memory is how one person acquires three accounts and files a ticket saying their data disappeared.

- The marker names the method, never the account: "you used Google here" and not the address, because the device gets handed over and the sign-in screen is visible before anyone authenticates.
- Where a new sign-up arrives with an address that already has an account, offer to link the two instead of creating the second.

### `auth-code-screen` The code lands on the device that is showing the field

One field with the one time code content type, paste never blocked, is `form-autofill`. The screen around it is this rule, and it exists because the user has to leave the app to read the code and the app has to still be there when they get back.

- Leaving for the messages app and returning restores the code screen with its state, not the start of the flow. The mechanism is `state-interrupt` and `nav-restore`.
- The screen says where the code was sent and lets that be corrected without restarting the sign-in. Resend exists beside it and is disabled behind a visible countdown, so the control is never dead with no explanation.
- An autofilled code may submit itself once. A rejected code returns to an editable field with a message beside it, under `form-error`, and never back to the first screen.

### `auth-biometric-session` Rule on the API, not on the sensor

The division is the API and not the gesture, and the same face drives both. A credential API assertion, which is what a passkey is, signs the user in: the verification gesture releases a key and the server verifies what comes back. A `LocalAuthentication` or `BiometricPrompt` success does not: it re-authorizes a session that already exists. The credential API is the sign-in on every platform, the prompt is the re-authorization, and the bullets below land on the prompt alone.

- A prompt result proves the enrolled owner of this device is present. It tells the server nothing about who the account is, so it is not a second factor and it is never the only way into an account. Locking an app the user is already signed into behind that check is the case it is for, and that lock keeps the device credential behind it.
- The switch that turns that lock on decides whether this app asks and never whether the device biometric is on: on Android an in-app control for it is the documented pattern, while iOS discourages a standalone opt-in for biometric authentication, so on both it is named for the thing it protects and sits beside it rather than standing alone as a biometric preference.
- The non-sensor route to the same place, the enrolment route where nothing is enrolled yet, and the eight ways the prompt can end, are `sense-biometric`. What this rule adds is that the route exists in the same session, because a wet hand on the payment screen is not a reason to sign out. Name the fallback control from the platform rather than from one shared string: Android's device credential is the user's PIN, pattern or password, while on iOS a passcode is the device unlock and Apple's own services, so nothing this app owns is called one.
- Where the check gates money, credentials or identity documents, require the strong class. Android names them Class 3 and Class 2, and accepting whatever is enrolled accepts the weak one.
- Two authenticator sets do not work on API level 29 and below: `DEVICE_CREDENTIAL` alone, and `BIOMETRIC_STRONG | DEVICE_CREDENTIAL`, which is the usual way to satisfy the bullet above. On those releases check for a PIN, pattern or password with `KeyguardManager.isDeviceSecure()` instead of asking the prompt for it.

### `auth-expiry` Expiry interrupts the task, it does not restart the app

Tokens die while the app is backgrounded, which on a phone is most of the time, so the expiry is usually discovered on the way back into a half-finished screen. That screen is what is at stake.

- A refresh that could not reach the server is not a sign-out. That distinction is `off-session`.
- What was typed is still there afterwards: `form-persist`. Where the person lands is the screen they were on, with its scroll offset and its sheet, under `nav-restore`, and never the home screen.
- Re-authentication arrives over the task as a modal, under `nav-modal`, rather than as a navigation that unwinds the stack the task was living in, and several requests expiring at once produce one prompt over that task rather than one per request. Deduplicating the refresh underneath and replaying what failed is `net-backoff`.
- The session lifetime is recorded in `STACK.md` and read from one constant at every call site, rather than scattered as literals.

### `auth-reauth` A sensitive action asks again, and the window is written down once

An unlocked phone is regularly in someone else's hands, which is why a live session is not proof of anything for the actions below.

- Ask again for: changing the password, the email address or the phone number; adding or editing a payout or payment destination; revealing a full card or document number; exporting the data; deleting the account.
- The re-authentication window is recorded in `STACK.md` and applied from there at every call site, because three literals become three windows.
- Never draw a surface that imitates the system biometric or credential prompt, which is `sense-biometric`: that is the one thing the user has no way to see through. The app's own password or PIN challenge is a legitimate route, and where the sensor is unavailable the device credential is the fallback rather than a dead end.
- Ordinary activity does not extend the window. Reading is not proving.
- A refused re-authentication returns to the screen with the action untaken and says so. It is never a sign-out.

### `auth-active-account` The screen that acts names the account acting

A phone has no window title and no persistent chrome to keep an avatar in, so on a device carrying a work account and a personal one, the identity has to be on the screen where the action happens.

- Anything that posts, pays, sends, uploads or shares under an identity shows which identity in the surface that confirms it, before the tap and not in a settings screen two levels away.
- Switching accounts happens in one place and states what is changing.
- After a switch, nothing from the previous account remains on screen: cached lists, badges, avatars and the contents of the outgoing queue in `off-queue` all belong to the account that made them.

### `auth-signout` Nobody is signed out quietly

An app stays signed in for months, so an unasked-for sign-in screen reads as data loss. It is also the only privacy control many users have on a shared device, which is why it has to be findable.

- Sign out is a visible control in one place, and it happens because the user asked. An expired token, a failed refresh, a dropped connection and an app update are not sign-outs.
- Where the server genuinely refuses the session, the sign-in screen carries one sentence saying what happened. A bare sign-in screen with no explanation is the failure this rule exists for.
- The screen says what leaves the device before it leaves: unsent work is drained or named first, under `off-session`, and then the credential, the cached content, the downloads and that account's pending notifications go together.
- What survives is a decision rather than an accident. Device-level things stay, such as theme, language and the fact that onboarding was seen.
- Sign out is not account deletion. They never share a row, a color or an adjacent position, under `touch-destructive`.

### `auth-delete` Deletion has two routes, a scope and a date

The stores do not ask for the same shape and an app has to satisfy both: an in-app path to delete the account and its data, plus a web resource where the same request can be made. Shipping only the in-app path passes one store and fails the other. The web route is excused for an app that is permanently private and for one whose job is enterprise device management, so an app claiming any other excuse is guessing.

- Where the route sits is `onboard-account`: inside the app, in account settings, and not inside a policy or terms page, and the same rule revokes the federated tokens as part of the deletion.
- The web route is the same flow rather than a longer one. Its address is declared to Play in the data safety section, which is the store that asks for it; the App Store has no such field and asks instead that the in-app route be reachable rather than buried. A web route Play was never told about is a route that does not count.
- It deletes the account rather than deactivating it, and the confirmation screen says what is removed, what is kept, and under what obligation it is kept.
- Say how long it will take, and tell the person when it is done. Where deletion can be scheduled for later, immediate deletion is offered beside it.
- A subscription bought through a store keeps billing until it is cancelled there, and the deletion screen says so rather than letting the person discover it next month.
- The confirmation is a re-authentication under `auth-reauth`, not a checkbox.

### Check

Review answers each of these against the code, pointing at the line:

- Every route on the sign-in screen resolves to one account identifier through one call site, the platform credential entry point is one of them with a persistent control to reopen it on Android, both domain association files are configured for the passkey route, and the order is fixed rather than computed per visit. `auth-methods`
- Apple's button is the platform component wherever the stack can reach one and matches the published specification where it cannot, Google's is built to its specification with the mark unmodified, and both keep their hit area at the touch floor while the artwork keeps its own minimum and clear space. `auth-provider-button`
- Every provider sign-in that leaves the app opens in the system authentication session rather than a browsing surface or an app-owned web view, and returns through that session's own callback to the screen it started from. `auth-web-flow`
- The sign-in link is a claimed link that opens the app rather than a mail web view, the waiting screen is restored and finishes there, and the link is spent on the person's action rather than on a fetch. `auth-magic-link`
- The last successful method is stored per device and marked on return, naming the method and not the account. `auth-last-used`
- The code screen names the destination, restores itself after a trip to another app, and gates resend behind a visible countdown. `auth-code-screen`
- No prompt result is treated as a sign-in or as a factor, any check gating money or credentials requires the strong class, and the device credential path is guarded on API level 29 and below. `auth-biometric-session`
- Expiry produces one interruption over the current screen, the typed values and the scroll position survive it, and the lifetime is recorded once. `auth-expiry`
- Each sensitive action calls re-authentication, all of them read the same recorded window, no surface imitates the system prompt, and a refusal leaves the session intact. `auth-reauth`
- Every screen that acts under an identity displays that identity, and a switch clears the previous account's content, badges and queue. `auth-active-account`
- Sign out happens only on the user's request, states what it clears, drains unsent work first, and sits away from deletion. `auth-signout`
- Account deletion is reachable in-app, the web route's address is held as a recorded constant rather than a literal, and the screen states scope and timing and confirms through re-authentication. `auth-delete`

Five of these do not come out of a diff. Open the sign-in screen at the largest text size to see what is actually reachable without scrolling, background the code screen and come back to it, force a token to expire with a form half typed, read on a device which biometric class the prompt was granted rather than which constant was passed to it, and check in the Play console that the deletion URL declared there is the one the app ships.

### Reaches

- `heuristics/forms.md`: `form-input`, `form-autofill`, `form-error`, `form-persist`
- `heuristics/localization.md`: `l10n-strings`
- `heuristics/navigation.md`: `nav-deeplink`, `nav-restore`, `nav-modal`
- `heuristics/offline.md`: `off-session`, `off-queue`
- `heuristics/onboarding.md`: `onboard-look-first`, `onboard-account`
- `heuristics/sense.md`: `sense-biometric`
- `heuristics/states.md`: `state-interrupt`
- `heuristics/touch.md`: `touch-floor`, `touch-destructive`
- `platform/network.md`: `net-backoff`

# heuristics/buttons.md

## Buttons and controls

Everything a user taps to act or to choose: buttons, the floating action button, chips, tabs and segmented controls. Navigation structure is a separate question; this file is about the controls themselves and about which one wins.

A phone shows one screen at a time to someone who is usually doing something else. The whole point of a control vocabulary here is that the answer to "what do I do now" arrives before any reading happens.

Rules in this file, in order: `button-one-primary`, `button-ladder`, `button-target`, `button-label`, `button-state`, `button-fab`, `button-chips`, `button-tabs`.

### `button-one-primary` One primary action per screen, and a second one owes a reason

This is the rule the rest of the file exists to protect, and it is the one generated screens break most often.

Emphasis is relative and nothing else. A filled button reads as *the* action only because the controls around it are not filled. Put two filled buttons side by side and neither one is primary any more: the visual system says both are the answer, so the user has to stop and decide which, and that decision is one you were supposed to make for them.

**Count them.** Look at the screen as the user sees it and count the filled, prominent or otherwise heaviest controls visible at once. The answer is one, or zero on a screen that only reads or browses. Two with no reason recorded is a defect, not a preference.

What counts in that number:

- the button pinned to the bottom, the one in the top bar, and the one inside the content, all at the same time;
- the FAB, which is a primary action and not an exception to the count;
- controls that live in different files or different components but land on the same glass. The count is per screen, not per widget.

A sheet, a dialog or a full-screen modal is its own decision point, so it gets its own single primary, and while it is open it owns the count.

When two actions feel equal, the first reading is that the screen has two jobs. Split it, or pick the one the product wants and demote the other. Save and "save and add another" are not two primaries: one is the primary and the other is a secondary, a menu item, or a checkbox next to the first.

**Default.** One primary, or none.
**Exception.** A screen whose whole job is a choice between two outcomes the product has no preference between, where ranking them would be the product putting its thumb on the scale: answer or decline a call, approve or reject a request, keep mine or keep theirs in a conflict, pick one of two plans being compared. There the pair is the primary. Both carry the same weight, sit side by side at the same height, and nothing else on the screen competes with them.
**Reason required.** The brief's `primary_action` names both labels and says in one line why neither is preferred. "Both seemed important" is not that line: if the product would rather the person chose one, that one is the primary.

Cancel, Back, Skip and Dismiss are never the emphasized control. They are the exit, and the exit does not need to be sold. A destructive action is not the top of the ladder either: it is a role of its own, it keeps its distance from the frequent controls, and it is never the primary of a screen the user opened to do something else.

### `button-ladder` Use the ladder the platform already defines

Below the primary there are two useful rungs, no more: a secondary for the alternative, and a quiet tertiary for the optional. Reach for them by name instead of inventing a parallel set of styles.

- **Material:** filled, then filled tonal, then elevated, then outlined, then text, in that order of weight, with the FAB sitting above all of them for the one action a screen exists for.
- **iOS:** prominent, then bordered, then plain. On recent versions the same ladder is expressed through the system glass styles, which is where translucency comes from; a hand-built blur behind a button is not the same control.

The iOS convention worth knowing: the primary action there is frequently a navigation bar item or a plain tinted row of text, not a large filled block in the middle of the content. A full-width filled button dropped into an iOS settings screen is an Android accent, and it reads as one.

Three different button styles at the same rank on one screen is the composite look of a screen assembled from parts. Pick a style per rank and hold it, then style it once in the theme rather than at each call site, because twenty locally styled buttons are twenty future inconsistencies. The same action wears the same control everywhere in the app: if Save is filled on one screen and a text button on the next, one of them is wrong.

Button labels sit at the label role of the type scale, which on Material is 14sp at weight 500. Not 400, and not bold.

### `button-target` The drawn height is not the touch target

Material's default button is 36dp tall, with a size range that runs from 32dp to 56dp, and the framework component quietly extends its own touch area to reach the 48dp floor. Draw that button by hand at 36dp with no extended area and it is a target that fails, while looking identical to the one that passes.

The whole control is tappable, not the text inside it. A full-width primary at the bottom of the screen is a good fit for a thumb, and it is also a large accidental target, so nothing destructive belongs beside it.

### `button-label` The label says what will happen

Write the verb of the action and the object it acts on: Send, Pay 42, Delete photo. OK, Submit and Yes describe nothing, and Yes in particular forces the user back up to reread the question.

- No trailing period, and never "click" on a device with no cursor.
- Keep it short enough to survive translation and a 200% text size, and decide now what a long label does: wrap onto a second line and let the control grow taller, never scale the text down to fit (`type-scaling`), never quietly truncate the verb.
- An icon-only button carries an accessibility label saying the action, not the picture. On Android, navigation destinations always carry a visible text label as well.

### `button-state` A button has four states, and two of them are usually missing

Rest and pressed are covered by the touch rules. The two that get skipped:

**Disabled.** A primary that starts disabled at the top of an empty form gives the user nothing to act on and no reason why. Prefer leaving it enabled and answering on tap with what is still missing, pointed at the field that is missing it. Where disabled is genuinely right, the reason has to be visible next to it, not inferred.

Disabled also promises that something the person can do will enable it. A control nothing on this screen can ever enable, in the configuration the person is in, is not disabled, it is absent: a pager over a single page, a sort control over one item, a next and previous pair with nowhere to go, a range the data source does not keep. Offering an option the system cannot answer is the same defect one step later, when the person picks it and gets an empty result that looks like no data.

**In flight.** The moment it is tapped, the control stops accepting taps and says that work is happening, in place, at the same width, so the layout does not jump under the finger that is still there. A button that looks identical during a three second request gets pressed again, and the second press is a duplicate order.

### `button-fab` One FAB, for the action the screen exists for

The FAB is Material. It does not belong in an iOS build, where the same action goes in the navigation bar or the toolbar.

Where it is right, it *is* the primary action of that screen, which means there is no second filled button underneath it competing for the same job. One per screen. Stacked FABs, a FAB spent on something secondary, and a speed dial that unfolds into four more FABs are all the same mistake: a menu wearing the costume of a primary action.

Use the extended form when the action needs a word to be understandable, since an icon alone rarely carries a verb. And remember it floats over content: the scrolling list underneath needs bottom padding equal to the FAB plus its margin, or the last row spends its life beneath it.

### `button-chips` Chips are not small buttons

Four kinds, four jobs. Assist chips offer an action in context. Filter chips narrow a set and can be multi-selected. Input chips represent something the user already entered and can remove. Suggestion chips offer content the system is proposing.

- Selection has to be legible without color: a check mark, a filled container, a shape change. A chip that only changes tint when selected disappears for a good share of users.
- A row of chips scrolls horizontally. Letting them wrap turns a filter row into a growing wall that pushes the content it filters off the screen.
- Chips do not carry the primary action, and they are not a navigation control. A chip that changes screen is a tab wearing the wrong clothes.

### `button-tabs` Tabs are navigation, not action

Three to five destinations, and they are the top level of the app rather than a place for actions. They belong at the bottom, where the thumb is.

- Every destination is labelled. Icon-only navigation asks the user to guess, and the guess is wrong often enough to matter.
- The selected destination is obvious without relying on color alone: an indicator, a filled icon variant, a weight change. Selection changes how an item is drawn and never where it sits: the selected icon, label and indicator occupy the same box as the resting ones, so nothing in the bar moves when the selection does.
- The set does not change from screen to screen, and it does not vanish when a screen is pushed. Tabs that come and go stop being a map.
- Top tabs and bottom tabs on the same screen is two navigation systems arguing. Pick one.
- A segmented control is not a tab bar. It filters or switches the view in front of the user, it holds about three options, and past that it becomes a menu or a filter screen.

### Check

Review answers each of these against the code, pointing at the line:

- At most one primary action is visible on the screen, counting the bottom bar, the top bar, the content and the FAB together, any sheet or dialog carries its own single primary, and a pair of equal primaries exists only where the brief names both and says why neither is preferred. `button-one-primary`
- Emphasis comes from the platform's ladder, one style per rank, styled in the theme rather than per call site, and the same action looks the same across screens. `button-ladder`
- Every button's touch area reaches the platform floor even where the drawn height is smaller. `button-target`
- Labels name the action and its object, are capitalised as `copy-case` requires, and survive the longest translation at the largest text size. `button-label`
- Disabled states explain themselves, no control is shown that nothing on the screen can enable, no option is offered that the data source cannot answer, and every button that starts work becomes unpressable and shows it, without resizing. `button-state`
- At most one FAB, holding the screen's defining action, absent on iOS, with the list underneath padded to clear it. `button-fab`
- Chip selection is visible without color, chip rows scroll instead of wrapping, and no chip is doing a tab's job. `button-chips`
- Three to five labelled destinations, a selected state that is not color alone and moves nothing, and one navigation system per screen. `button-tabs`

### Reaches

- `heuristics/copy.md`: `copy-case`
- `heuristics/typography.md`: `type-scaling`

# heuristics/camera.md

## Camera capture

A capture screen is aimed. The user holds the phone in one hand while the other holds the receipt, the label, the pet or the page, at whatever distance an arm reaches, in whatever light the room has. Nothing on it can be read from a static mockup, because the only background any control has is live video nobody on the team chose.

The preview itself is `sense-preview`: its fit and crop, the shutter being inert until the session is live, the screen held awake, and the scanner's time bound and camera-free route. Whether the hardware exists at all is `sense-absent`, the system taking it back is `sense-interrupted`, and saying it is running is `sense-running`. The permission belongs to permissions.md, from `perm-inventory` through `perm-answers`, playing back what was captured is `media-system-player`, and the app switcher snapshot is `priv-switcher`.

Rules in this file, in order: `cam-system-first`, `cam-shutter`, `cam-torch`, `cam-lens-zoom`, `cam-aim`, `cam-scan-decides`, `cam-review`, `cam-unusable`, `cam-orientation`, `cam-bytes`, `cam-limited`, `cam-thermal`.

### `cam-system-first` When one photo is the whole requirement, the system's capture screen is the capture screen

The phone already ships a capture screen the user has fired a thousand times, with a shutter, a torch, a lens switch and a retake. Drawing a second one buys a permission, a session lifecycle and every rule below it.

- Android's image capture intent hands the whole capture to the device camera app, so the calling app needs no camera permission, unless its own manifest declares `CAMERA`, in which case the action raises a `SecurityException` until that permission is granted. Without the output extra it returns a thumbnail under the extras key `data`; with it, the full frame lands at the URI supplied. Guard the intent, either by catching `ActivityNotFoundException` or by resolving it first.
- On iOS `UIImagePickerController` with `sourceType` `.camera` is the system capture UI and is not deprecated. Gate it on `isSourceTypeAvailable(_:)` and `availableMediaTypes(for:)`, expect portrait only, and accept that its one sanctioned customisation is `cameraOverlayView`. Movie capture stops at 10 minutes unless `videoMaximumDuration` says otherwise.
- Drawing the surface yourself is for when the surface is the feature: a scanner with its own reticle, a document edge finder, a recorder showing its own level. Picking a photo that already exists is never that, which is `perm-ask-less`.

### `cam-shutter` The shutter is the biggest target on the screen, in the bottom third, on a ground the app owns

The subject is in the other hand, so the phone is held and fired one-handed. And the preview underneath is a moving image the app does not control, so no control on this screen has a background to measure itself against.

- The shutter's hit rect meets the floor in `touch-floor` and is the largest target on the screen. Every capture control sits in the bottom third (`touch-reach`), spaced by `touch-spacing`, inside the safe area (`layout-insets`) and clear of the platform capture indicator's bounds (`sense-running`).
- Each control carries its own opaque or scrimmed ground. `color-contrast` needs a measured pair and live video supplies none, so the pair is the glyph against the ground the app drew, not against whatever is being filmed.
- One press, one capture. The shutter is disabled for the duration of the capture rather than queueing a second frame behind the first.
- On iPhone the hardware camera control draws a system overlay from the bezel, so app controls stay outside that strip in both portrait and landscape, no control appears in both the overlay and the screen, and any name shown there stays short because it follows Dynamic Type and a long one covers the viewfinder. The shutter, torch and lens controls are icon-only, so each carries a name (`a11y-name`).

### `cam-torch` The torch is read from the hardware and observed while the screen is open

The LED is the only light the user can add, and the hardware takes it away when the phone gets warm. The front camera has no LED at all, so the same button has to mean something else or not exist.

- Presence and availability are two reads. On iOS `hasTorch` reports the hardware and `isTorchAvailable` reports whether it is usable right now, going false when the device overheats and needs to cool off; both are observable. On Android `CameraInfo.hasFlashUnit()` reports the hardware and the observed torch state reports the value, which is off wherever there is no flash unit. Bind the control's enabled state to the live value rather than reading it once at bind time.
- On the front camera, offer the screen flash or offer no torch. Android's screen flash mode needs a screen-flash instance set first and always behaves like on rather than auto.
- The torch is off when the screen opens. Android's capture flash mode defaults to off, and iOS low-light boost also defaults to off, is settable only where supported, and may drop frames as it engages, so enabling either is a decision written down rather than a switch left on.
- Missing hardware removes the control rather than disabling it (`sense-absent`), settled by the presence read above rather than by a second query.

### `cam-lens-zoom` The lens stops and the zoom range are read from the device, and zoom past the optical range is a crop

One binary installs on a phone with three rear lenses and on one with a single fixed lens, so a hardcoded row of 0.5x, 1x and 2x is wrong on the cheap device. A pinch also needs two hands, which is exactly what this screen does not have.

- The range comes from the device. On iOS the zoom factor runs from 1.0, the full field of view, to the active format's maximum; on Android the zoom state carries the minimum and maximum. Every lens stop drawn is one the device reported.
- Zoom is a centre crop. Past the format's upscale threshold the device scales that crop up and the quality goes with it, so the top of the range is not a free stop. Setting the factor jumps; ramping is the smooth change, and the configuration lock is taken first or the set raises.
- A pinch has a tap or stepper equivalent (`a11y-gesture`). Android's camera controller handles tap-to-focus and pinch-to-zoom for you, while the provider API and AVFoundation hand both back to the app.

### `cam-aim` The frame drawn on the glass is the region the app actually reads

The user is holding the phone over a barcode or a form and cannot see the buffer being analysed. A reticle that does not match the analysed rectangle trains them to aim at the wrong place, and the app gets blamed for not reading a code that was never in frame.

- The drawn frame is derived from the same rectangle handed to the analyser: the region of interest on the iOS data scanner, the analyser's crop rect on Android. One value, two consumers.
- Reading text or a code has a resolution floor. The smallest meaningful unit of a code needs at least 2 pixels of width, and 2 of height for a 2D code, which puts an EAN-13 frame at 190 pixels wide and a dense PDF417 nearer 1156; analysing at 1280x720 or 1920x1080 is what lets a code be read from further away. Poor focus costs accuracy on its own.
- On-screen guidance names the condition: too far, too dark, hold still. Repeating that it is scanning tells the user nothing they cannot see. Codes are recognised at any orientation, so nothing asks the user to turn anything.
- `sense-preview` already requires a target, a time bound and a route that needs no camera. Where the thing being aimed at is a page, the iOS document camera controller is the platform's own answer to all of it.

### `cam-scan-decides` A scan resolves by itself, once, and the app says which formats it reads

The hand that would press a confirm button is the hand holding the phone steady over the code. A scanner that waits for a tap loses the aim at the moment it had it.

- A scan surface the app drew accepts on recognition rather than on a tap, and the same value is not accepted twice before the screen is left.
- The formats scanned are an explicit list. Detecting everything is slower and it accepts things this screen was not for.
- Where the app draws no overlay of its own, the platform scanner is the scanner. Android's code scanner runs inside Play services, ships its own UI and needs no camera permission from the app, though its library is unbundled so the download is a state on the screen. The iOS data scanner arrives from iOS 16 behind two separate reads, one for whether the device supports scanning and one for the grant, and still needs its purpose string (`perm-purpose-string`); its own documented interaction is a tap on the highlighted item, so a screen that wants acceptance without a tap reads the recognised-items stream instead.
- The confirmation is `fb-silent-success` plus the one haptic `sense-haptic` allows once a scan resolves.

### `cam-review` A capture is a proposal until the user accepts it

The phone was moving when the shutter fired and the preview is three inches wide, so the first frame is often unusable. The iOS picker returns only once the person picks the frame just captured, and on Android the confirmation belongs to whichever camera app answers the intent, so an app drawing its own shutter is re-providing a step it removed, and without it the only way to fix a photo is to start the flow again, backing out of a form the keyboard is already covering.

- Every capture path the app draws itself has a review state carrying accept and retake. Retake returns to a live preview and discards nothing already captured, which is the same obligation `sense-interrupted` places on a take the system stopped.
- Accept is the only thing that commits, uploads or closes the screen. What waits behind it is `state-queued` and `net-upload`; the drawn exit from a capture screen presented as a task is `nav-modal`.
- A cancel that would discard captures says what is lost, and says nothing at all when nothing has been captured yet.

### `cam-unusable` A capture the app will not accept is a designed screen that names which thing is wrong

The capture happened in a moving hand, in the light that was available, at whatever distance the user could reach. Neither platform publishes a blur, exposure or framing test, so the verdict is the app's own and the message cannot hide behind the platform's.

- Every automatic rejection names its cause: too dark, out of focus, nothing found, wrong shape. The wording is `copy-error`.
- The capture stays on screen while the app says so, because the user cannot tell from a vanished thumbnail what to change.
- Retake, plus use anyway wherever the app can still proceed. A retry that loses the frame is the second failure `state-retry` names.
- A scan or a detection that found nothing is a `state-empty` case rather than a `state-error` one.

### `cam-orientation` Rotation and mirroring are metadata, so the bytes are normalised before anything but a platform image view sees them

The device is turned freely while the app's own screen is usually locked to portrait, so the sensor and the screen disagree on every capture. System galleries and platform image views apply the orientation tag; a cross-platform image component, a backend, an inference pipeline and a coordinate-based crop do not. The sideways photo therefore appears only after the bytes have left the phone.

- Every capture path reads its rotation, from the EXIF orientation tag with its 8 values or from the frame's in-memory rotation degrees, then either bakes it into the pixels or forwards it with them. iOS encodes the frame in the sensor's native landscape orientation and writes right for a portrait capture, expecting the reader to rotate 90 degrees clockwise. Getting it right matters to face detection and any other analysis, not only to display.
- The front-camera mirror is a deliberate flag rather than something inherited from the preview: on iOS the photo output applies it with Exif tags and the movie output with a track matrix, and on Android it is the reversed-horizontal flag on the capture metadata.
- A screen with a locked orientation still updates target rotation from an orientation listener, on every use case except the preview. That listener is the provider path's obligation: Android's camera controller sets target rotation itself, the same way it handles tap-to-focus and pinch-to-zoom. Ignoring it hands the analyser wrongly rotated frames.
- What gets stripped on the way out of the app is `share-payload-clean`.

### `cam-bytes` The capture asks for a size, and the file lands where the app said it would

The default is the sensor's largest frame at near-lossless compression, travelling over somebody's data plan onto a phone whose storage is already full. This is the one screen where a single tap generates tens of megabytes.

- Ask for a size. Android's capture defaults to the largest available resolution, prefers 4:3, and writes JPEG at 95 in the low-latency capture mode and 100 in the quality one. State the resolution and the compression the screen actually needs: a code being read wants no more than about 2 megapixels. The decoded cost of what is kept is `perf-decode`.
- Name the destination. App-specific storage is unreachable by other apps and goes with the uninstall, the shared media store is for files meant to be shared, and writing into the user's photo library is a separate add-only grant (`perm-scope`, `perm-purpose-string`).
- Nothing the user captured reaches an analytics or advertising payload (`priv-instrument`). App Store Review Guideline 5.1.2(vi) bars data gathered from camera, photo, depth or facial mapping APIs from marketing, advertising and use-based data mining, third parties included, and 4.10 bars monetizing the camera itself.
- The transfer is `net-upload` and `net-metered`, and the queue it waits in is `off-queue`.

### `cam-limited` On a limited photo grant the screen shows the granted set as the granted set

The phone is where the user's whole photo library lives, so a grant of three photos and an empty library look identical on a small grid. The user who granted three then reads the app as broken. `perm-answers` owns the branch; this rule owns what a grid the app drew over the library has to draw, and a screen that hands the job to the system picker never reaches it.

- The grid tells a limited grant apart from an empty library in its own sentence, with a route to change the selection. Those are two of the three sentences `state-empty` asks for.
- Under a limited grant the selection is the whole of what the app can reach, and user albums can be neither created nor listed, so album affordances are absent rather than empty. An asset the app creates joins the selection by itself.
- Both platforms have the state. iOS reports it only through the access-level form of the authorization status, because the older status and request pair report a limited grant as authorized. Android grants selected photos and videos through `READ_MEDIA_VISUAL_USER_SELECTED`, and an app declaring no read-media permission at all is run in a compatibility mode whose grants last one session, which is the same state with a shorter life.
- The selection changes at any time, so it is re-read rather than cached: from the library change notification on iOS, and on resume on Android, where the grant can move between onStart and onResume. Widening it goes through a control the app drew that re-requests the read-media permission, never a silent re-prompt (`perm-ask-less`).

### `cam-thermal` The capture screen counts what it binds, and degrades on purpose when the phone gets hot

The camera is the most expensive thing on the phone and the phone is a sealed object in a warm hand. The platform takes the hardware back rather than let it cook, and a screen binding four pipelines to draw one preview reaches that point sooner.

- Bind only the pipelines the screen draws, one instance each. Android allows one preview, one video capture, one image analysis and one image capture; with extensions on, only image capture plus preview is guaranteed, video capture is unavailable and analysis may not work. Combining preview, video capture and either of the other two on mid-tier hardware can require stream sharing, which the platform states costs processing, latency and battery, and some cameras allow the combination only at a lower resolution.
- System pressure gets a stated degradation: a lower resolution, the torch dropped, analysis throttled. On iOS it is one of 6 interruption reasons and the only one about heat, so it does not share an answer with another app holding the camera or with the app being sent to the background. Saying the capture stopped is `sense-interrupted`, and what an open session costs is `perf-power`.

### Check

Review answers each of these against the code, pointing at the line:

- Every capture entry point that needs one photo goes through the platform capture intent or picker controller, each capture surface the app draws instead has a reticle, an edge finder or a level of its own, and the intent path is guarded by a resolve or a caught `ActivityNotFoundException` while the picker path is gated on `isSourceTypeAvailable(_:)`. `cam-system-first`
- The shutter's hit rect meets the platform floor and is the largest target on the screen, every capture control sits in the bottom third clear of the safe area, the platform indicator bounds and the hardware camera control's overlay strip in both orientations, each one carries its own opaque or scrimmed ground rather than relying on the preview and its own name, and the shutter is disabled for the duration of a capture rather than queueing a second frame. `cam-shutter`
- The torch control is drawn from the hardware presence query with its enabled state bound to the live availability value rather than read once, the front-camera path offers the screen flash or no torch, and the torch is off when the screen opens. `cam-torch`
- The zoom range and every lens stop come from values the device reports rather than from constants, no offered stop sits above the format's upscale threshold, a zoom change ramps rather than jumps and takes the configuration lock first, and a pinch has a tap or stepper equivalent. `cam-lens-zoom`
- The drawn reticle is derived from the same rectangle handed to the analyser, the analysed resolution is set at the call site rather than left at the pipeline default and clears 2 pixels per module for the smallest format the screen accepts, and the guidance names the condition instead of repeating that it is scanning. `cam-aim`
- A scan surface the app drew accepts on recognition rather than on a tap and never accepts the same value twice, the formats detected are an explicit list, and a screen drawing no overlay of its own uses the platform scanner on the platform's own terms. `cam-scan-decides`
- Every capture path the app draws has a review state with accept and retake, retake keeps what is already captured, accept is the only thing that commits, uploads or closes, and a cancel that would discard captures names what is lost while a cancel with nothing captured is silent. `cam-review`
- Every automatic rejection names its cause, keeps the capture on screen while it says so, offers retake plus use-anyway wherever the app can still proceed, and a scan or detection that found nothing renders the empty state rather than the error one. `cam-unusable`
- Every capture path reads its rotation and either bakes it in or forwards it, the front-camera mirror is set explicitly on the capture output rather than inherited from the preview, and a locked-orientation screen on the provider path updates target rotation from an orientation listener. `cam-orientation`
- Every capture sets a resolution and a compression rather than accepting the sensor maximum, the destination is named at the call site as one of app-specific storage, the shared media store or the user's library under an add-only grant, and no captured image or derived face data reaches an analytics or advertising payload. `cam-bytes`
- The photo grid tells a limited grant apart from an empty library in its own sentence with a route to change the selection, album affordances are absent under that status, and the granted set is re-read rather than cached: from the library change notification on iOS, on resume on Android, where widening it runs through a control the app drew that re-requests the read-media permission. `cam-limited`
- The screen binds only the capture pipelines it draws, at most one instance of each, and system pressure is answered with a stated degradation rather than an error. `cam-thermal`

Two of these cannot be settled from a diff. Drive the capture screen one-handed on the smallest and largest supported devices, with the platform capture indicator drawn, and measure the rendered hit rect of the shutter and of every control beside it (`cam-shutter`). Then hold a real capture session open until the device throttles, and watch what happens to the torch, the frame rate and the session (`cam-thermal`).

### Reaches

- `heuristics/accessibility.md`: `a11y-name`, `a11y-gesture`
- `heuristics/colors.md`: `color-contrast`
- `heuristics/copy.md`: `copy-error`
- `heuristics/feedback.md`: `fb-silent-success`
- `heuristics/layout.md`: `layout-insets`
- `heuristics/media.md`: `media-system-player`
- `heuristics/navigation.md`: `nav-modal`
- `heuristics/offline.md`: `off-queue`
- `heuristics/permissions.md`: `perm-inventory`, `perm-answers`, `perm-ask-less`, `perm-purpose-string`, `perm-scope`
- `heuristics/privacy-ui.md`: `priv-switcher`, `priv-instrument`
- `heuristics/sense.md`: `sense-preview`, `sense-absent`, `sense-interrupted`, `sense-running`, `sense-haptic`
- `heuristics/sharing.md`: `share-payload-clean`
- `heuristics/states.md`: `state-queued`, `state-retry`, `state-empty`, `state-error`
- `heuristics/touch.md`: `touch-floor`, `touch-reach`, `touch-spacing`
- `platform/network.md`: `net-upload`, `net-metered`
- `platform/performance.md`: `perf-decode`, `perf-power`

# heuristics/chat.md

## Conversation

A conversation screen is one column that grows from its bottom, read in glances, with half of it under a keyboard for as long as anyone is answering. It is opened several times a day, more often from a notification than from inside the app, and every entry lands in the middle of something. Its failures are not the generic list failures: they are the screen moving under a thumb, and the message that left the composer and then quietly stopped existing.

Here: the transcript's anchor and where it opens, paging history upward, the row, arrivals, grouping and time, the composer, the state of one message, attachments, presence, the empty conversation and announcing an arrival. Recycling is `list-virtualise` and the row as a target is `list-row`. The keyboard as layout is `touch-keyboard` and `scroll-keyboard`. The write queue itself is the `off-` prefix, telling somebody a message arrived is the `notify-` prefix, and field configuration is the `form-` prefix. A link tapped in a message opens through `webview-surface-choice`, and a place attached to one is the static or lite-mode map `map-cost` requires of any recycled row.

Rules in this file, in order: `chat-anchor`, `chat-open-position`, `chat-history`, `chat-new-arrival`, `chat-grouping`, `chat-row`, `chat-empty`, `chat-composer`, `chat-message-state`, `chat-attach`, `chat-presence`, `chat-a11y`.

### `chat-anchor` The transcript opens at its newest end and stays there as it grows

The only reason anyone opened the conversation is the last message, there is no second pane holding it in view, and the container changes size under it twice: once when the keyboard arrives, and again every time the composer takes another line.

- Declare the anchor instead of scrolling to it after the first frame: SwiftUI `defaultScrollAnchor(.bottom)`, Compose `LazyColumn(reverseLayout = true)`, Flutter `ListView(reverse: true)`, React Native `FlatList` `inverted`. All four are off by default, so the anchor is one line somebody writes.
- A reversed Compose list already holds a conversation shorter than one screen at its bottom, and the one thing that breaks it is a `verticalArrangement` passed by hand. Bubble spacing is where that happens, so the spacing arrangement carries the alignment with it: `Arrangement.spacedBy(n.dp, Alignment.Bottom)`.
- React Native's `inverted` is a scale transform of -1 that `FlatList` undoes on every cell, so only what is drawn outside a cell (a sticky header, an absolutely positioned overlay, a hand-rolled inverted `ScrollView`) undoes it itself.

### `chat-open-position` Re-entering the conversation lands on the boundary between read and unread

An interruption ended this conversation somewhere in the middle of it. The very bottom skips whatever arrived since; the top is a week of scrolling to get back.

- The boundary comes from the app's own read marker, because no platform publishes an unread anchor, and a conversation with no unread messages takes a written fallback.
- It is applied as the list's initial position rather than as an animated scroll after the first frame: Compose `rememberLazyListState(initialFirstVisibleItemIndex = ...)` sets it before the first layout, and SwiftUI separates the opening position from the growth response only from iOS 18, through `defaultScrollAnchor(_:for:)` with `.initialOffset` against `.sizeChanges`.
- `scroll-restore` owns the place keyed to the item, `nav-restore` which screen comes back, and `notify-destination` that a tap lands on what the notification named.

### `chat-history` Older messages arrive above without moving the message being read

`scroll-anchor` already rules that nothing arrives above the reading position, and already names a thread loading history upward as the case that ships broken most often. What is this file's is the paging itself.

- The page is requested a written distance before the oldest row is reached, so the rows land before the thumb gets there. `list-end` pages the other direction and owns the load-more control, the end marker and the failed page.
- The position is held by item key or by the platform's own mechanism, never by an index: a Compose item `key` keeps the keyed row first visible across an insertion above it, React Native has `maintainVisibleContentPosition` with `minIndexForVisible` (and forbids reordering while it is on), and Flutter answers it with `CustomScrollView.center`, since `ListView.builder` anchors nothing. Scroll anchoring reaches Safari only at Safari 27, so a web transcript that supports anything older reverses its layout or owns the offset itself.
- The loading indicator sits above the oldest row and never replaces the transcript.

### `chat-new-arrival` A message arriving while the user is reading further up is a pill, never a jump

One screenful, one thumb. A programmatic scroll issued while somebody is dragging takes the screen away from a hand that is already using it, and there is no second region to put the new message in.

- Auto-scrolling on arrival is gated on a written distance from the newest end. Inside it the transcript follows the message; past it nothing moves, which is also what `scroll-programmatic` requires of a scroll during a drag.
- Exactly one pill, and it carries the user to the newest message. No platform ships the control, so it is drawn: it lands by `fb-place`, and it is not transient feedback, so it stays until it is used or the user reaches the end rather than timing out under `fb-duration`.
- The pill states that something arrived. It carries a count only where the count is already in hand, and never fires a request to produce one.

### `chat-grouping` Consecutive messages collapse into a run, and time is printed at a written interval

The column is too narrow to spend a line per row on a timestamp, and the only time question a glance asks is whether this arrived just now or overnight.

- A run of consecutive messages from one sender prints the sender's name and avatar at most once, at one end of the run, and a one-to-one thread prints neither. `icon-avatar` owns the fallback for the picture that is missing.
- One written interval decides when a timestamp or a day divider is emitted, since no platform publishes a grouping window or an interval. The divider is a section header and not a row, which is `list-sections`, and it carries the heading trait per `list-a11y`.
- Every time value is stored as an instant and formatted by the locale (`data-time-instant`, `l10n-format`), and anything relative takes the written crossover in `data-time-relative`.

### `chat-row` One row holds a paragraph, a single character, or nothing but a file

One narrow column at the reader's own text size, and nothing to spill into sideways. A bubble sized by hand survives the default and breaks on the three inputs that arrive every day: a pasted wall of text, a one-emoji reply, and a photo sent with no caption.

- A maximum bubble width written into `STACK.md` as a number, because no platform publishes one. The row height is the platform target floor, which is `touch-floor`. Text wraps and no message row truncates.
- An attachment-only message renders without an empty text container behind it.
- Alignment is leading and trailing rather than left and right (`l10n-direction`), the measure follows `type-measure`, the row survives the largest text size (`type-scaling`), and the text can be selected and copied.
- `list-density` already forbids padding every row up to the tallest, and `list-row` caps the controls inside one row at two, which a reaction control plus an overflow already spends.

### `chat-empty` An empty conversation says who it is with and what to send

A blank column under a name is the entire screen, and the keyboard is the only thing that would fill it, so whether it opens by itself is worth deciding rather than inheriting.

- One sentence naming the other party and the first thing worth sending, never a blank column and never a generic no-results line. `state-empty` rules the three empties and `copy-absence` the wording of text standing where content is not.
- A conversation that has never held a message is nothing but a composer, so it is the one chat screen that opens focused. Everywhere else the transcript is what was opened, and nothing takes focus.
- The first screenful still answers what this is and what to do, which is `layout-fold`.

### `chat-composer` The composer grows to a written ceiling, then scrolls, and never takes the transcript's last row

The keyboard is half the screen. A composer with no ceiling plus a keyboard leaves a conversation with no conversation visible in it, and its height arrives without warning while somebody is typing.

- A minimum and a maximum line count, both as numbers, and it scrolls past the maximum: Compose takes `lineLimits = TextFieldLineLimits.MultiLine(min, max)` (`minLines` and `maxLines` on the legacy overload), SwiftUI pairs `TextField(axis: .vertical)` with `lineLimit(1...n)` and a field past the limit becomes scrollable, Flutter grows without limit at `maxLines: null` and is bounded only by its parent, and React Native caps with `numberOfLines`, on iOS only under the New Architecture, and publishes nothing about the growth between the minimum and that maximum. Not one of the four bounds a multiline field on its own, so the ceiling is written on all four.
- The composer's height is subtracted from the transcript rather than lying over its last row, through the platform's own inset and never a guessed spacer. `scroll-keyboard` owns the keyboard inset on the container, `touch-keyboard` the focused field staying visible, and `layout-chrome` the padding under anything pinned.
- Send is a drawn control and never the return key, which on a multiline React Native field inserts a line break by default. It is disabled while the composer holds neither text nor an attachment, so a send with nothing in it is not possible. It takes `button-target`, `button-state`, `button-label` and `a11y-name`.
- Unsent text survives leaving the conversation and coming back, by `form-persist` and `state-interrupt`.

### `chat-message-state` The state of one message lives on that message, and a failed one keeps its place

The radio drops inside a single session, so a send is the likeliest thing in the app to fail, and there is one screen, so that failure has nowhere else to be shown.

- A written set of states covering at least sending, sent and failed, carried by the message and not by the screen. `state-queued` already rules that pending is a property of the item, and that an item vanishing into a sync error is the worst available outcome.
- A failed message stays in its position with a retry on it (`state-retry`) and does not block the messages queued behind it.
- A send with no network becomes a queued row in send order while the composer empties: local first per `off-write-mode`, durable with an id reused across retries so a lost reply is one message and not two per `off-queue`, marked per `off-fresh-marks`, and waiting on the failed request rather than on a connectivity callback (`state-offline`).
- No tick and no state is carried by color alone, which is `color-not-alone`.

### `chat-attach` Attaching is one control opening the system picker, and what it produced is a row

The camera and the library are on this device, and the platform picker reaches the library without a permission. A hand-assembled menu is what costs: it draws its own browser over a picker the system already ships, or it asks for a permission the system route would not have needed, on the screen where somebody is trying to answer a person.

- One attach control, opening the platform's own picker. Android's photo picker grants access to the selected images and videos instead of the whole media library, ships natively from Android 13, reaches Android 11 and 12 through the Google Play services module, and falls back to `ACTION_OPEN_DOCUMENT` where it is unavailable; on iOS it is `PHPickerViewController` from iOS 14, which needs no photo library permission because it runs out of process. `perm-ask-less` and `perm-scope` settle the rest.
- Taking a photo now is the other source, and which surface that capture opens in is `cam-system-first`. Every further source is ruled the same way: it opens the platform's own picker, and one that costs a permission has to earn that permission before it reaches the menu.
- A pending attachment is a transcript row with its box reserved before the bytes arrive (`icon-reserve`, `list-images`), its pending mark from `chat-message-state`, and a transfer that outlives the screen (`net-upload`). On Android the picker's returned URI is granted only until the app stops, so that transfer takes `takePersistableUriPermission` first.
- What arrives from somewhere else is declared narrowly and then distrusted, which is `share-accepts`.

### `chat-presence` A typing indicator and a read receipt are somebody else's data, and both answer one switch

The device is carried, so a read receipt states where a person was and whether they were awake, and it is usually produced by a glance at a notification rather than a deliberate open. Nothing about presence is a platform default and nothing about it is a store requirement.

- One setting governs both directions, so turning it off stops the outbound event as well as the inbound display. It shows its current value without being opened (`set-status`) and its default is picked once (`set-default-first`).
- The typing event is throttled to a written interval and expires on its own rather than waiting for a message to clear it. An unthrottled event publishes when each key was pressed, and wakes the other device once per keystroke to say so.
- The indicator does not loop next to text being read (`motion-loop`) and communicates without moving under reduced motion (`motion-reduced`). What a presence channel may cost in wakeups is `bg-wake-push`.

### `chat-a11y` An arriving message is announced once, politely, and the transcript is walkable

A screen reader user cannot glance. The transcript is the whole screen, an arrival is silent unless something says so, and the composer sits between the reader and the newest row.

- The arrival is announced through a polite live region rather than one announcement per message: `ACCESSIBILITY_LIVE_REGION_POLITE` on Android, `LiveRegionMode.Polite` in Compose. `announceForAccessibility` is deprecated as of API 36 and an event sent that way may be ignored by the service. Assertive interrupts speech already running, which an arriving message is not worth.
- UIKit and SwiftUI publish no live region. The iOS native mechanism is a posted accessibility announcement, and from iOS 17 its priority is set on the string, where the low priority queues behind speech in progress instead of cutting it off. A web transcript uses a live region set to `aria-live="polite"` on either platform.
- One arrival, one announcement, naming the sender. A live region over a fast transcript announces every change and makes the screen unusable, so a burst is announced once.
- Each message row is one stop (`list-a11y`, `a11y-collection`, `a11y-order`), the composer and the send control both carry names (`a11y-name`), content changing without a navigation is `a11y-announce`, and switch and voice reach all of it through `a11y-alt-input`.

### Check

Review answers each of these against the code, pointing at the line:

- The transcript declares an explicit bottom anchor, where a reversed list passes a vertical arrangement of its own that arrangement carries a bottom alignment, and anything drawn outside a cell in an inverted React Native list applies its own counter-transform. `chat-anchor`
- The opening position is computed from an unread boundary with a written fallback, and applied as the list's initial position rather than as a scroll after the first frame. `chat-open-position`
- Paging upward is triggered a written distance before the oldest row, its indicator sits above that row, and the position is held by item keys or the platform's maintain-position mechanism rather than by an index, and a page landing above the viewport leaves the row under the thumb where it was. `chat-history`
- Auto-scrolling on arrival is gated on a written distance from the newest end; past that distance exactly one pill appears, carries the user to the newest message, is dismissed by use or by reaching the end rather than by a timer, and carries a count only where the count is already in hand; and an arrival during an active drag moves nothing. `chat-new-arrival`
- A run of consecutive messages from one sender prints the sender's name and avatar at most once and a one-to-one thread prints neither, timestamps and day dividers are emitted on a written interval as section headers rather than rows, and every time value is formatted by the locale from a stored instant. `chat-grouping`
- Every message row wraps rather than truncates, holds a written maximum bubble width, renders an attachment-only message without an empty text container, aligns by leading and trailing, and its text can be copied. `chat-row`
- A conversation with no messages renders a sentence naming the other party and the first thing to send, and the composer takes focus on open only where the conversation has never held a message. `chat-empty`
- The composer declares a minimum and a maximum line count as numbers and scrolls past the maximum, sits above the keyboard through the platform's inset mechanism, has its height subtracted from the transcript, sends from a drawn control rather than the return key with that control disabled while the composer holds neither text nor an attachment, and keeps unsent text across leaving the screen. `chat-composer`
- Every message carries its own state from a written set covering at least sending, sent and failed; a failed one stays in place with a retry and does not block the queue; a send with no network becomes a queued row while the composer empties; and no state is carried by color alone. `chat-message-state`
- One attach control opens the platform picker rather than a hand-assembled menu of sources, a camera source is scored under `cam-system-first` rather than here, and a pending attachment is a transcript row with its space reserved and a transfer that outlives the screen. `chat-attach`
- One setting governs presence in both directions, the typing event is throttled to a written interval and expires on its own, and the indicator neither loops beside the transcript nor animates under reduced motion. `chat-presence`
- An arrival is announced once rather than once per message, through a polite live region on Android, Compose and the web and a posted announcement at low priority on iOS, the announcement names the sender and does not interrupt speech in progress, each row is one stop, and the composer and send control carry names. `chat-a11y`

Three of these are not settled by the file. On a device, page a conversation holding more than one screenful of history and watch whether the row under the thumb moves (`chat-history`); drive an arrival while scrolled a screenful up, and again while a drag is in progress, and watch whether the screen jumps (`chat-new-arrival`); and send and receive through one whole conversation with the screen reader running, as `a11y-test` requires of any flow (`chat-a11y`).

### Reaches

- `heuristics/accessibility.md`: `a11y-name`, `a11y-collection`, `a11y-order`, `a11y-announce`, `a11y-alt-input`, `a11y-test`
- `heuristics/buttons.md`: `button-target`, `button-state`, `button-label`
- `heuristics/camera.md`: `cam-system-first`
- `heuristics/colors.md`: `color-not-alone`
- `heuristics/copy.md`: `copy-absence`
- `heuristics/data-display.md`: `data-time-instant`, `data-time-relative`
- `heuristics/feedback.md`: `fb-place`, `fb-duration`
- `heuristics/forms.md`: `form-persist`
- `heuristics/icons-and-imagery.md`: `icon-avatar`, `icon-reserve`
- `heuristics/layout.md`: `layout-fold`, `layout-chrome`
- `heuristics/lists.md`: `list-virtualise`, `list-row`, `list-end`, `list-sections`, `list-a11y`, `list-density`, `list-images`
- `heuristics/localization.md`: `l10n-format`, `l10n-direction`
- `heuristics/maps.md`: `map-cost`
- `heuristics/motion.md`: `motion-loop`, `motion-reduced`
- `heuristics/navigation.md`: `nav-restore`
- `heuristics/notifications.md`: `notify-destination`
- `heuristics/offline.md`: `off-write-mode`, `off-queue`, `off-fresh-marks`
- `heuristics/permissions.md`: `perm-ask-less`, `perm-scope`
- `heuristics/scrolling.md`: `scroll-keyboard`, `scroll-restore`, `scroll-anchor`, `scroll-programmatic`
- `heuristics/settings.md`: `set-status`, `set-default-first`
- `heuristics/sharing.md`: `share-accepts`
- `heuristics/states.md`: `state-empty`, `state-interrupt`, `state-queued`, `state-retry`, `state-offline`
- `heuristics/touch.md`: `touch-keyboard`, `touch-floor`
- `heuristics/typography.md`: `type-measure`, `type-scaling`
- `heuristics/webviews.md`: `webview-surface-choice`
- `platform/background-work.md`: `bg-wake-push`
- `platform/network.md`: `net-upload`

# heuristics/colors.md

## Color

On a phone a palette has to survive half brightness in daylight, an OLED panel, whichever theme the system is set to, and a thumb covering part of the screen. Almost everything that breaks it was decided long before any of that got tested.

Colors already written into `DESIGN.md` are settled. This file covers how they are used in code, what to derive for a role the brief left empty, and what to verify before handing the screen back.

When the screen already exists, work out three things before touching a value: which colors someone chose on purpose, which are placeholders nobody ever defended, and whether the request is a color change or an identity change. The last one is an edit to `DESIGN.md` and needs the user, not a quiet rewrite inside a component. A screen built entirely from neutrals with one blue button is usually not restraint: it is hierarchy and state that never got assigned a color, which is `color-assigned`.

Rules in this file, in order: `color-roles`, `color-derived`, `color-constructed`, `color-ramp-hsl`, `color-one-accent`, `color-assigned`, `color-variety`, `color-gradient`, `color-dark-composed`, `color-contrast`, `color-not-alone`, `color-dynamic`.

### `color-roles` Reach color through the role, not the value

Decide what the screen needs a color for before deciding which color: the base surface and the ones raised above it, the text that sits on each of those at both levels of emphasis, the interactive color, focus and selection, dividers and outlines, the four status meanings, and any series or scale the screen plots.

Every stack already names those:

- Material, on Android and in Flutter: `MaterialTheme.colorScheme` and `Theme.of(context).colorScheme`, each foreground taking the `on` role belonging to its background.
- iOS and Cupertino: the semantic system colors, or a catalog color that carries both appearances.
- Mobile web: custom properties resolved under `prefers-color-scheme`.

A hex written straight into a component looks like a shortcut and behaves like a bug. It stays put when the system switches to dark, it ignores Increase Contrast on iOS and high contrast text on Android, and nothing can reach it when the theme is retuned later. Retheming should touch the role table and nothing else.

### `color-derived` The palette that shows up by itself is not a choice

Two of them show up. Indigo through violet under a gradient is the median of everything a model read, Tailwind's default button included. Warm cream with a rust accent is what appears the moment violet is forbidden: take the violet away and it comes back as cream in six screens out of ten, the same reflex in a different coat. Neither reflex is free-floating: violet echoes a decade of default component libraries, and warm rust on an off white ground echoes a real shipped assistant identity, so a model trained on the whole internet has read both defaults many times before it ever reads this file.

All of what follows is for a palette nobody supplied. When the user hands over the identity, a mockup, a screenshot, a brand sheet, an existing app to match, that is the reference, and it is read rather than derived: the ground, the ink, the accent and where the accent is spent come off what was supplied, and `DESIGN.md` says which reference they came from. A departure from it is an identity change and goes to the user, as the intro of this file says, never a correction made because the supplied colours landed in a family below. Deriving three candidates over the top of a supplied identity replaces the user's decision with the model's.

Neither family is banned, and the hex values are not the tell. Cream and rust pulled off film stock, in an app that edits photos, is those two colors doing work. The reflex is the same pair arriving with nothing behind it. What is banned is being unable to say, in terms of this product, why it landed there.

A chart pairing blue with trust and red with urgency is not a derivation either, and citing one is no different from citing an adjective: the pairing is repeated at the same rate whether or not it holds outside the deck it was printed in, and it moves by market and by culture in exactly the way a real derivation should not. The one part of that literature worth keeping is not a color's mood, it is distance from the category: a color the two or three closest competitors do not already occupy earns more than a color chosen for what it supposedly feels like. That is a sharper version of the category-habit line below, not a separate excuse to reach for a mood board instead of a reference.

Look at the ground rather than at the accent. The accent is what gets swapped the moment the reflex is named, and the ground is what nobody looks at twice, so it survives the swap and gives the family away. One family is a near neutral ground whose small remaining chroma leans warm, under an almost black ink, and it stays that family whether the accent lands on terracotta, gold, olive or nothing at all. The other is an accent in the blue to violet band, on any ground. Judge the ground by chroma and not by saturation: a warm off-white reports as heavily saturated in HSL and is still an off-white. Quote the number when the verdict is written, because a family is something a palette measurably is rather than something its author reports feeling. The verdict that names no chroma is the one that finds its own candidate outside both families while shipping the ground of one, and it costs nothing to make: landing in a family is allowed and only ever asked for a reason, so the answer worth distrusting is the one that avoids owing it.

Those two are instances and not the whole of it. What they have in common is the general case: a ground within a step or two of white, an ink near black, and one accent desaturated far enough that it would be acceptable in any other product. That combination is where a palette lands when the reference is consulted and then quietly overruled, and it passes a check written against the two families above because it is not quite either of them. Independent derivations that produce five different references and five interchangeable screens have not escaped the reflex, they have captioned it five times.

The check that catches it is the material. A reference is a thing with a lightness of its own: a printed slip is pale, a departure board is dark, cut rubber is nearly black, enamel is saturated. The ground takes that lightness rather than converting it. When the named reference is dark and the screen is light, or the reference is vivid and the screen is muted, the reference was decoration and the ground came from somewhere else, which is the reflex arriving under a name. Say what the material's own ground is, and where the screen's differs from it, say why in terms the material supports.

Landing in either family is not a violation, it is a prompt to do the work twice. Derive a second full palette from the same reference, in a different key: what the reference looks like at night, in a different material, or lit differently. Put the two side by side and keep the one a stranger could tie back to this product without being told the reference. A reference that only ever yields the palette that was already there was a caption written after the fact, and the second pass is the only thing that tells a caption from a derivation. Record the comparison as one line per candidate, reference named, family it lands in, kept or not, and the reason: a table for review, not an essay for a reader, and the same fact either way.

That check runs once, on whichever appearance gets designed first, and it has to run again on the other rather than being inherited for free. A light palette built by holding the dark palette's hue and shedding chroma for contrast lands on exactly the two axes a reflex family is judged on, ground lightness and accent hue, so it can drift back into cream and rust on its own even when the dark original earned its way out of it. `color-dark-composed` already treats dark as a second design rather than a switch; the same holds from dark to light.

- Ground, ink and accent follow from what the app does and who is holding it, which is `PRODUCT.md`. A category habit is not a derivation: finance is not blue, health is not green, fitness is not neon.
- Generate three candidate references before judging any of them, each from a different source: one from what the product's job actually involves handling, the object, the document or the surface it puts in front of someone; one from where it gets used, the room, the light, the material underfoot; one from what it replaces or descends from, the paper form, the printed ticket, the physical dial it moved off of. Three sources is what stops the first idea being the only one considered, the same reason a wireframe's shape gets picked from more than one candidate. Pick the one that could not be swapped for another app's without also swapping what it evokes. An adjective survives that swap every time, so modern, friendly and premium derive nothing.
- Look at the neutrals alone before handing off. Greys that all lean toward the accent were generated from the accent instead of chosen.

### `color-constructed` A palette is built, not collected

Naming a reference settles where the colours come from. It does not produce them, and a reference read straight off into hex values, one at a time, by eye, is how five products derived from five different references arrive at the same screen: a ground a step from white, an ink near black, one accent muted enough to be inoffensive anywhere. Every value below is a number somebody can check, and the construction is in `references/color-construction.md`.

- **Chroma is the tell, and the accent is where it is missing.** An accent under roughly 0.06 chroma in OKLCH is a grey that happens to lean, and a screen built on one reads as uncoloured no matter how many roles were assigned. Ground and surface hold chroma low by design, around 0.02 and under; above about 0.03 a ground has become a pale wash of the accent, which is the pastel screen nobody chose.
- **Every hue after the first stands in a stated relationship to it**, analogous, complementary, split complementary or triadic, written down as that word. Two hues a reader must tell apart sit at least 30 degrees from each other. A second colour that arrived because the screen needed one is the reflex under another name.
- **Status hues keep their band and the accent moves.** Where an accent lands within 30 degrees of a status meaning, the accent is the one that changes, because a user can be taught a brand colour and cannot be taught that this red means something else.
- **The neutral ramp holds one hue and walks lightness** (`color-ramp-hsl`), and it is checked on its own: greys leaning toward the accent by more than the ground's own chroma were generated from the accent rather than chosen.

A palette that cannot state these numbers has not been constructed, it has been collected, and a collection is what the reflex looks like once it has a reference attached.

### `color-ramp-hsl` Move one axis at a time [P3]

Build the ramp in HSL: hold the hue, walk the lightness. Lightness is the axis contrast lives on, so every step becomes something you can defend. Surfaces go up, text and borders go down, and the family stays recognisable because H never moved.

HSL then fails in two places, both of which matter here:

- **Its S number does not measure colorfulness.** `#F4EFE7` reports 37% saturation and is an off-white. Whether a value counts as neutral is a question for chroma in OKLCH or LCH, or for the plain distance between the channels.
- **Holding S while L moves breaks both ends.** Bring saturation down as the steps approach white and black, or the extremes drift out of the family.

Where the stack supports OKLCH, work there: lightness moves without dragging colorfulness along. On Android, hand a seed color to the tonal palette generator instead of picking tones one at a time. Restating a palette that already works in a newer notation is not an improvement.

### `color-one-accent` One color means touchable

An accent works by being scarce. iOS gives the app a single tint and expects everything interactive to wear it; Material puts the action on `primary` and keeps `tertiary` for occasional contrast. Under both, the user learns one color and stops scanning for buttons.

- Spend it on the action. A card border, an illustration or a section heading in the same color costs the user that shortcut.
- When a color has to be loud, give it a whole region or a whole role instead of sprinkling it in six places.
- Secondary text on a colored surface comes from that surface's own hue, or from opacity over it. Grey dropped onto a color reads as a rendering fault.
- Status colors keep their jobs. Error red used for branding spends the one color a user reads without thinking.

**Default.** One accent, spent on what can be touched.
**Exception.** A product whose content is colour coded by the person or by the domain: calendars the person coloured themselves, transit lines that have had their colours for decades, categories the person assigned. That colour is data, it sits on the content and never on a control, and the accent stays the only colour meaning "touch here". How a hue per item stays a palette is `color-variety`.
**Reason required.** Where the colours come from, and that none of them is the accent or a status colour.

### `color-assigned` Restraint and absence are not the same screen

`color-one-accent` rations the accent. It does not say the rest of the screen goes uncoloured, and applied on its own it produces exactly the screen this rule is about: four greys, one tinted button, and nothing else on the page carrying a hue at all. Every other rule in this file is a ceiling. Without a floor beside them, the palette that satisfies all of them perfectly is no palette.

Work out what on this screen carries a state and assign that state a colour: what is selected, what is active, what is finished, what failed, what is overdue, which surface sits above which. Those assignments are what a screen is read by at arm's length, and they come before anything anybody would call decoration.

- The test is subtraction. Render the screen in greyscale and name what a reader can no longer tell apart. Nothing lost means no colour was doing anything, and what shipped is a wireframe with a tint on the primary button.
- Losing something in greyscale is not a breach of `color-not-alone`, which asks for a second carrier and never for no colour. The two hold together: the state is coloured, and the icon, the word or the position beside it says the same thing again.
- Neutrals are an assignment too. A ground, a raised surface and a line taken as three steps of one ramp is a surface system. The same three left at whatever the framework hands over is the absence of one, and it is the most common form of this defect, because nothing about it looks wrong.
- A screen that genuinely wants one accent and nothing else exists, and it says which states it has and what carries each of them instead, in weight, size or position. Unwritten, the answer is that nobody assigned them.

### `color-variety` A hue per row is not a palette

Four badges in four pastels, three avatars in three gradients, a tint cycling by position down a list. Nobody can say what the second colour means, because it means that the item is the second one.

- Hue that varies across repeated items encodes a difference the reader can name: the category, the status, the account, the series on the chart. Otherwise every item in the set wears the same surface.
- Where the difference is real, the mapping is fixed and written down once, so the same category is the same colour on every screen it appears on. A colour assigned by index changes the moment the list reorders.
- Generated-per-item colour is legitimate in exactly one place, the avatar fallback for a person or an account, where it is derived from a stable identifier and stands in for a photograph: `icon-avatar`. Artwork carrying a subject of its own never reaches that exception, and a row of filled rectangles tinted one hue each is the defect this rule is about wearing a fallback's clothes. What belongs there is the picture, which is `icon-depicts`.
- Variety that is genuinely wanted is a job for the artwork, not for the interface. Illustrations carry as many colours as they need; the rows around them do not.

### `color-gradient` A gradient has to be doing a job

Three qualify on mobile:

- a scrim under fixed chrome, so its labels stay legible while content scrolls beneath;
- the platform's own translucent material under sheets and fixed bars, at whatever thickness the OS decides;
- depth, distance or light inside artwork that was actually drawn.

The rest give the screen away: two hues blended in place of a logo, gradient-filled text, a gradient primary button, a gradient app background, a colored glow at zero offset standing in for elevation. A raised surface on Android steps up the tonal scale and takes a shadow where the spec gives it one. On iOS the system material exists for exactly this, and a blur rebuilt by hand renders without the vibrancy pass and ignores Reduce Transparency.

A gradient that stays brings three constraints with it:

- Its contrast is a range, not a number. Measure the worst point along the run, and remember a scrim sits over moving content, so the worst point moves too.
- A long ramp bands on an 8-bit panel, which is what a phone becomes once brightness drops.
- Translucency stacked on translucency leaves the final ratio at the mercy of whatever happens to scroll past. Opaque values can be checked; these cannot.

### `color-dark-composed` Dark is a second design, not a switch [P1]

This is the part that gets done last and shows it.

- **The ground is not `#000000`.** Full black flattens every elevation cue and smears while a list scrolls on OLED. Take the platform surface roles, or start at `#121212` and build real steps above it. Full black is the cheapest for battery and the most expensive for structure, so it is a decision per surface, never a starting point.
- **Body text is not `#FFFFFF`.** Around `#E0E0E0`, with secondary a visible step below.
- **Depth arrives as the surface getting lighter,** because a shadow has nothing left to darken once the background is already dark.
- **Accents shed chroma.** A hue tuned against white burns against black. Take the colorfulness down and leave the hue alone.
- **Every pair gets measured again.** Passing in light says nothing about dark.
- **Neither appearance inherits the other's derivation.** `color-derived`'s reflex check runs again here, on whichever appearance was built from the other: shedding chroma from a hue that already escaped the reflex can still land that appearance back inside it.

Following the system setting is the default, and both appearances get built. Shipping one appearance is a product decision the user takes, recorded in `DESIGN.md`, never one this rule leaves to whoever writes the theme. Once it is taken, the rule grades the other half of it: the app forces that appearance everywhere it draws, so a phone set to the other one never produces a half-themed screen. The status bar icons, the keyboard, date and time pickers, dialogs from the platform, web content and the launch surface all follow the forced appearance, and each is checked with the system set the opposite way.

### `color-contrast` Measure the pair, do not eyeball it [P1]

| What | Minimum |
|---|---|
| body text | 4.5:1 |
| text at 18pt+, or 14pt+ bold | 3:1 |
| icons, controls, focus and selection indicators | 3:1 |

These are floors rather than targets because of where phones get used. Sunlight lifts the black point, auto-brightness runs out, and nobody can move the sun. Pale grey on white that reads fine at a desk is gone at a bus stop.

Measure the pressed, selected, disabled and placeholder states as well, plus text sitting over an image, in both themes. The 14pt row is a weight rule as much as a size rule: drop that text to regular and it owes 4.5:1, without a single color having changed.

### `color-not-alone` Color never carries a meaning by itself [P1]

Red against green is the pair that fails, and roughly one man in twelve sees them differently. Grayscale and wind-down modes take hue away from everyone else, and glare eats hue before it eats lightness.

So every status, state and series gets a second carrier: an icon, a word, a shape, a position, or a lightness gap wide enough to survive desaturation. Run a protanopia, deuteranopia and tritanopia pass over the rendered screen. The pairs that collapse are rarely the ones the token names predicted.

### `color-dynamic` Dynamic Color, where the platform hands it over

On Android 12 and up, Material You builds the scheme from the user's wallpaper. Take it where it fits, keep a static scheme for older releases and for users who turn it off, and open the app under a few wallpapers to see whether it still reads as this product. A brand that only exists at its own hex value does not survive the feature.

### Check

Review answers each of these against the code, pointing at the line:

- No component holds a raw hex, and every color arrives through a token or a platform role. `color-roles`
- Where the user supplied an identity, the palette is read off it, `DESIGN.md` names the source, and every departure from it was approved by the user. Otherwise the palette is derived from a named material or reference this product evokes, chosen among three candidates from three different sources rather than the first one considered, never from a color-emotion pairing or a category habit, and the same screen in a competitor's app would need a different one. The neutral ramp is not tinted toward the accent. A palette in either reflex family carries the second derivation it was compared against, recorded as a short table, and the reason this one survived, checked separately for whichever appearance was built from the other. Each family verdict quotes the ground's chroma and the ink's lightness rather than asserting a family from impression. `color-derived`
- The palette states the lightness and chroma of each role, the accent carries at least about 0.10 chroma in OKLCH and never under 0.06, ground and surface stay under about 0.03, every hue past the first names its relationship to the accent, no two hues a reader must separate sit within 30 degrees, and the neutral ramp does not lean toward the accent. `color-constructed`
- Ramp steps hold the hue and shed saturation toward both ends. `color-ramp-hsl`
- The accent marks what is interactive and nothing else, and no grey sits on a colored surface. `color-one-accent`
- Colour is assigned to the screen's states and surfaces rather than to the primary action alone, the neutral steps were chosen rather than inherited, and rendering the screen in greyscale loses something a reader can name. `color-assigned`
- Hue that varies across repeated items encodes a difference the reader can name, the mapping is fixed rather than positional, and nothing carries a tint picked for variety. `color-variety`
- Every gradient does work flat color cannot: no gradient-filled text, no gradient primary button, no gradient app background, and no colored glow at zero offset standing in for elevation. `color-gradient`
- Dark has its own ground, its own accent values and its own measurements, and the ground is not full black. Whichever appearance was built from the other was checked against `color-derived`'s reflex families on its own, not assumed clean because the first one was. Where `DESIGN.md` records a single appearance, the app forces it on every surface it draws or hosts, with the system set to the other appearance. `color-dark-composed`
- Contrast is calculated for every pair, including pressed, disabled and text over images, in both themes. `color-contrast`
- Nothing is communicated by color alone. `color-not-alone`
- Where Dynamic Color applies there is a static fallback, and the product still reads as itself under a wallpaper-derived scheme. `color-dynamic`

Check the last four on a rendered screen in both appearances rather than in the token table. Overlays, translucent material and anything painted over the background all land after the tokens, so the token table is the one place a light theme can look fine while dark quietly fails.

### Reaches

- `heuristics/icons-and-imagery.md`: `icon-avatar`, `icon-depicts`

# heuristics/composition.md

## Composition

How the parts of a screen relate in space, and whether anybody chose it. Everything else in this folder judges a part: a colour, a target, a label, a state. This file judges the arrangement, which is the thing a person recognises before reading a word of it.

Generated screens fail here in one direction. Every rule about parts gets met, and the arrangement is the one a thousand other apps have: a bar, a row of chips, equal cards in a column, a button pinned low, a tab bar. Nothing in it is wrong and nothing in it was decided. Two products in different fields, built with the same care, come out as the same screen with different nouns.

Searching for the arrangement is a procedure, and it lives in `flow/explore.md`. The relations an arrangement is made of are in `references/design-grammars.md`. What follows is what review holds the result to. Spacing and grouping are `layout-grouping`, the first screenful is `layout-fold`, and an identity that would fit any product in its category is `color-derived`, `type-face` and `layout-shape`.

Rules in this file, in order: `comp-chosen`, `comp-distance`, `comp-context`, `comp-distinct`, `comp-repeat`.

### `comp-chosen` A composition is chosen between alternatives, never arrived at [P2]

A layout with no runner-up was not picked. It is what came first, and what comes first is what has been seen most, which is a property of everything else that exists and not of this screen.

So a structural screen has a record, left by `flow/explore.md` at the top of its wireframe: the default it would have been, the candidates that competed, how far apart they were, and why the winner won. The record is short and it is the difference between a familiar layout somebody defended and a familiar layout nobody noticed.

Landing on the familiar arrangement is allowed, and is sometimes right: a settings list should look like a settings list, because the person has used a hundred of them and the pattern is the affordance. What the rule asks is that the familiar one wins an argument. The burden sits on convergence, since convergence is what happens unattended, and an unusual arrangement owes no apology beyond serving the person better.

**Default.** Every screen that went through spec carries the record.
**Exception.** A screen whose pattern the platform owns outright: a system settings list, a share sheet, a permission prompt, a capture screen handed to the system. There the alternatives are worse by construction.
**Reason required.** The name of the platform pattern, in the hand-off, in place of the record.

### `comp-distance` Candidates differ in relations, and a change of spacing is not a candidate [P3]

Two layouts are different when the relations inside them differ: what dominates, the direction it reads in, how content is grouped, where the primary action sits, how the screen meets navigation, what contains things, what scrolls, how dense it is, and what the hand does. They are the same layout when only spacing, radius, type size, wording, colour or the size of a component moved, however different the two look side by side.

The test is mechanical on purpose. Count the relations that differ between two candidates. Under three, they were one idea, and comparing them was comparing a thing with itself. The count says nothing about quality, and a pair that passes it can both be poor. What it guards is the comparison, which is only worth making between things that differ.

### `comp-context` The moment of use outranks the component library [P1]

A screen is used somewhere, by a body in some position, with some share of somebody's attention, for some length of time, some number of times a day. Those facts are in the brief's `context` block, and they decide the arrangement before any component does.

A glance of a few seconds wants one dominant thing, readable at arm's length, and nothing to scroll. One occupied hand wants the action under the thumb and no precision. A screen opened dozens of times a day wants its answer on the first frame with no touch at all, and every tap on its ordinary path is paid dozens of times. A long seated session can take density, a second level and a smaller type role. A screen opened twice a year has to explain itself, because nobody remembers it.

An arrangement that would be identical whatever the context block said has not read it. The common form of the failure is a dashboard of equal cards on a screen whose person has four seconds: every card is defensible, and the one number they came for is the same size as the six they did not.

### `comp-distinct` The arrangement could only be this product's [P2]

Remove the words, the colour and the pictures, leaving grey blocks. Could the product still be told from another in a different field? For most generated screens the answer is no, and that is the defect: the structure carries nothing about the job.

What makes an arrangement a product's own is that it is shaped like the thing the product does. An app about a sequence in time is built on a line. An app about one number is built around that number at a size no list row would give it. An app whose person acts on a live ground puts the ground full-bleed and floats the rest. The distinctive part is where the product's own behaviour shows, and there is usually exactly one: a screen that is unusual everywhere is as unreadable as one that is unusual nowhere.

Four questions, answered in the brief's Purpose and Hierarchy or in the hand-off:

- What does this product do that its neighbours in the category do not, and where on this screen does that show?
- Which one component or relation here is deliberately not the stock one, and what does it buy?
- What stays conventional so that the unusual part can be learned? Navigation, back, system gestures and form fields almost always do.
- If a competitor's content were poured into this arrangement, what would stop fitting?

Distinctive never outranks usable. A relation that breaks `touch-reach`, `nav-back` or `a11y-gesture` to be memorable has been memorable at the person's expense.

Nor does it outrank the user. An arrangement the user supplied, as a mockup or as a screen to follow, answers these questions by having been chosen by the person who owns the product, and leaving it to score better here replaces their decision with the grader's.

### `comp-repeat` Screens of one product are related, not identical [P3]

A product's screens should be recognisable as siblings: the same grid, the same type roles, the same way of grouping. They should not be one template with the content swapped. When the list, the detail, the profile and the summary are all a bar over equal cards, the arrangement has stopped saying what kind of screen this is, and the person reads the title to find out where they are.

Before choosing, look at what the project already approved. An arrangement that has won twice needs a reason to win a third time, and "it fits" is true of a stack on every screen ever made. Repetition is right where the jobs repeat: two list screens are both lists. It is wrong where the jobs differ and the arrangement does not.

**Default.** A different job gets a visibly different arrangement.
**Exception.** Screens that are instances of one job, such as every category list in a catalogue, share one arrangement on purpose.
**Reason required.** The job they share, in one line.

### Check

Review answers each of these against the code, pointing at the line:

- The screen has a record of the default it would have been, the candidates considered and why the winner won, or names the platform pattern that made alternatives moot. `comp-chosen`
- The candidates on record differ from each other on at least three of the nine relations, and none differs only in spacing, radius, type size, wording, colour or component size. `comp-distance`
- The dominant element, the position of the primary action and the density follow from the brief's context block, and the arrangement would have to change if that block said something else. `comp-context`
- Reduced to grey blocks the arrangement still says what the product does, through one deliberate relation, while navigation, back and system gestures stay conventional, or the arrangement is the one the user supplied. `comp-distinct`
- The arrangement differs from the project's other approved screens wherever the job differs, and where it repeats, the shared job is named. `comp-repeat`

### Reaches

- `heuristics/accessibility.md`: `a11y-gesture`
- `heuristics/colors.md`: `color-derived`
- `heuristics/layout.md`: `layout-grouping`, `layout-fold`, `layout-shape`
- `heuristics/navigation.md`: `nav-back`
- `heuristics/touch.md`: `touch-reach`
- `heuristics/typography.md`: `type-face`

# heuristics/copy.md

## Copy

Most of what an app says, it says in fewer than ten words, to someone reading at a glance with the other hand busy. Count the parts of the surfaces the words land on and the reason is obvious: two answers under a title on an alert, roughly two words on a settings row, one line on a locked screen that decides whether the app is opened at all. Add a keyboard covering the lower half and there is no room left for a sentence that has to be read twice. There is no hover, no tooltip and no second window either, so a word the reader does not know is where the reader stops.

This file owns wording. Whether a message exists at all belongs to the file that owns the surface it lands on. Everything here is a string in the catalogue rather than a literal in a component (`l10n-strings`), which is also what makes most of these rules searchable.

Rules in this file, in order: `copy-budget`, `copy-first-word`, `copy-voice`, `copy-tells`, `copy-error`, `copy-jargon`, `copy-terms`, `copy-case`, `copy-absence`, `copy-sample-data`, `copy-numbers`, `copy-claims`, `copy-rationale`.

### `copy-budget` Decide the count before writing the sentence

Length is a decision taken before the wording, and it is a count.

- A title holds 1 line and never wraps past 2.
- Body text is 1 sentence. A second one has to carry a fact the first did not.
- An answer on an alert or a dialog is 1 or 2 words. `button-label` owns the rest of the buttons.
- A notification is finished at its first line (`notify-lockscreen`).

Each fact appears once across the group. A title that names the situation and a body that restates it costs two reads and delivers one.

Count the source string, because that is the shortest form it will ever take: translation lengthens it (`l10n-expansion`) and the reader's text size stretches it again (`type-scaling`). Going under the meaning is a different defect, not a stricter version of this one. The test is whether the reader can still act after the cut.

### `copy-first-word` The first two words decide whether the rest is read

A list row, a settings label, a section header and a notification line are all read inside a column of neighbours that begin the same way. Scanning stops at the first two words.

- Lead with the word that separates this string from its siblings, and delete the leading noun they all share.
- Nothing repeats the header above it. `nav-location` owns saying where the screen is, `set-shape` owns which rows exist and in what order.
- A row that is a destination never opens with a generic verb: Set, Change, Edit, Modify, Manage, Use, Select, Choose. The row leads somewhere, so the verb spends both scanned words saying nothing. A menu or action sheet row is the opposite case, since there the verb is the whole content, and `button-label` governs it.
- Neutral beats negated. Block, not Don't allow.

### `copy-voice` Second person, present tense, active, and nobody is 'the user'

- The reader is you. Not the user, not I or my. A possessive is usually dead weight, since Favourites says what Your favourites says in one word instead of two.
- A control that names a thing is a noun: Notifications, not Notify me. Keep sentences for where the app is genuinely speaking to the reader.
- Active voice, present tense, and the subject of a failure is the thing that failed. "Messages did not load" beats "We had trouble loading your messages". We and our stand for the company or they come out, and in an error they stand for nobody.
- Cut please, sorry, oops, uh-oh and the exclamation mark. An alert about money, access or data owns the whole screen while it stands there, so the reader has nothing else to look at and the performance is all that is on offer.
- No idioms and no colloquialisms. An idiom is the first thing to break in translation and the last thing to land for anyone reading a second language.
- Humour is weighed rather than banned, and it costs more than it looks: it travels badly between cultures and lands on a stranger reading one line off a locked screen. Keep it out of errors, permission asks, money and destructive confirmations entirely.
- No gendered reference the sentence does not need. Write the plural or the role, because a language that inflects for gender has to resolve one the source string invented for no reason. A disability never stands in for a fault or a weakness.

### `copy-tells` The string nobody decided the wording of

A string whose wording was filled in rather than chosen has a shape, and it is the same shape across every app that shipped one. All of it is searchable in the catalogue, which is what makes it a rule instead of a taste.

- **No dash.** The em and en dash are what gets reached for instead of choosing between a full stop, a comma, a colon and a pair of brackets, and a four word title has no clause to join in the first place. Neither character is on the phone keyboard, both widen a line in a column with nothing to spare, and screen readers disagree on whether to announce them at all. Rewrite the sentence rather than substituting a shorter dash: split it in two, or use the punctuation it actually wanted. The hyphen inside a compound word is a different character and stays.
- **Vocabulary that sells instead of saying**: seamless, effortless, unlock, elevate, supercharge, robust, powerful, leverage, empower, journey, delve, revolutionary. It clusters in empty states, paywalls and onboarding, which are precisely the screens where the reader is deciding whether to continue.
- **Significance the screen has not earned.** A settings row is not a milestone and a first upload is not a journey. Say what happened.
- **Chat leftovers**: Great question, I hope this helps, Let me know if, Here is what you need to know. They arrive in apps whose strings were drafted in a chat window, and again in any feature that renders model output as interface.
- **Not X but Y**, where the negative half names something nobody claimed. "Not just a list, but a workspace" spends a line of a narrow screen arguing with a reader who was not arguing.

### `copy-error` Name the failure, rule on the retry, end on the fix

Three answers in at most two sentences, and they are owed wherever an operation the app ran has failed: a request, a write, a sync. A field rejecting what was just typed is a single instruction instead, and `form-error` owns it. `state-error` sorts the failure classes and forbids naming a cause the app did not verify, and `fb-place` decides where the message lands. This rule is the sentence itself.

- Name the thing the reader owns, not the operation that ran on it. "Your reply was not posted" leaves the reader somewhere to go; "Request failed" names machinery they never agreed to learn.
- One string covering every failure is the shape an app falls into by default, and it is why "Something went wrong" is still shipping. It fits everywhere and helps nowhere. Count the distinct failure sentences against the distinct moves `state-error` sorts by, not against its four classes: two classes leaving the reader the same move may share one sentence.
- Say whether trying again is the move, and where it is not, say what is instead. `state-retry` owns the control.
- End on the next step, in the same verb as the control that performs it.
- Instruct, never scold. "Names take letters only" beats "Don't use numbers", and both beat "Invalid name".
- No code inside the sentence. An identifier that support will ask for is a secondary line the reader can copy.
- Never spell out a settings path. Name the one thing to turn on and let the control beside it open the page (`state-permission`). A written path is wrong the moment the OS renames a screen, and its segments are the system's strings rather than the app's, so nothing translates them.

### `copy-jargon` The codebase does not get to speak

All of this is greppable in the string catalogue, which is why it is a rule rather than an opinion.

- Mechanism words: null, undefined, NaN, exception and class names, HTTP status numbers and the phrases that go with them, token, payload, endpoint, entity, instance, config. Also sync, cache and queue anywhere the reader would say sent, saved or waiting.
- Vocabulary carried in from the code that nobody wants on a screen: blacklist, whitelist, kill, sanity check, master and slave, dummy. Every one has a plain replacement that is also shorter.
- An acronym stays only where the audience in `PRODUCT.md` already uses it. Anything else is spelled out at its first appearance on that surface, because the phone offers nowhere to look it up.

### `copy-terms` One name per thing, and it is the reader's name for it

The same object gets named in a tab, a screen title, a notification and a confirmation, and no two of those are ever on screen together. The drift is invisible to whoever writes it and obvious to whoever uses the app.

- One term per concept, written into `STACK.md` with the words it replaces listed beside it so review can search for them. What is archived on one screen is not hidden on the next.
- The term is what the reader calls the thing, not the column it is stored in.
- Gesture verbs come from the device: tap, touch and hold, swipe, drag. Never click, and never tap on.
- A confirmation repeats the verb of the control that raised it, so the reader is not matching two words to one action.
- The accessible name agrees with the visible label (`a11y-alt-input`).

### `copy-case` Case is picked per element type, once, and the platform overrules it in four places

iOS fixes four of them, and they are not the app's to choose: a button title is title case with no ending punctuation; an alert message is a complete sentence in sentence case with a full stop; a usage description is the same; an alert title takes sentence case and a full stop when it is a sentence, title case and no punctuation when it is a fragment.

Everything the platform has not fixed is the app's own decision, taken once per element type and then held everywhere: one case for titles, one for section headers, one for the lines standing in for missing content. Two screens disagreeing is the defect, not the case that was picked.

Material's own convention is sentence case for titles, headings, labels and menu items. It does not bind the way the four iOS cases do, so the app still picks one case per element type on top of it and holds it everywhere. `button-label` owns what the button says; the case it says it in is here, and the button is where the two platforms part.

Material leaves a trap underneath that. The legacy Material 2 button text appearance sets `android:textAllCaps` to true and uppercases whatever string was authored, while every Material 3 typescale sets it to false. Resolve whether the theme uppercases the label before concluding that it renders as written. Capitals are for a short label at most (`type-strings`), and a theme that uppercases is applying them to translations nobody has looked at.

### `copy-absence` Text standing where content is not

Three strings do a different job from the sentences around them, and each has a shape of its own.

- **A hint inside a field shows the format by example**, such as `name@example.com`. The field's name there is a label that vanishes at the moment it is needed (`form-label`), and the validation rules there arrive too late to prevent anything (`form-error`). A search field is the exception, and it names the collection instead (`search-scope`).
- **A line where content is missing names its cause and ends on a verb.** `state-empty` separates the three empties; the two that have a next move end on the verb of the control that takes it (`search-zero`, `list-end`).
- **A waiting line says which operation is running**, and moves a determinate bar only where the app holds a real figure to move it with. `state-loading` owns when that line appears and what a long wait owes on top of it.

### `copy-sample-data` The screen shows the product's own content

`you@example.com` in the field, `Enter your password` under it, three rows called Item one, Item two and Item three. Nothing on the screen came from the product, so nothing on it can be judged, and a reader learns only that somebody laid out boxes.

- Every string and figure belongs to this domain and arrives in the shape the app will really receive: a merchant with a plausible name, a price with the locale's currency and separator, a timestamp the day would produce, a distance the sport actually covers.
- The screen carries at least one concrete value a reader recognises. A price, a time, a name, an address, a measurement. A screen of headings and buttons with no data on it has not been designed against its content.
- The figures reconcile. A yearly price and a monthly price produce the saving that is printed, timestamps in a list run one way, a total is the sum of its rows, a percentage matches the bar drawn beside it. One figure contradicting the one next to it tells the reader that none of them is real.
- The sample covers what the layout has to survive rather than what flatters it: the long name, the zero, the negative, the empty list, the year-old record. `type-strings` owns the length side of this, `data-empty-null-zero` the difference between nothing and zero.
- A hint inside a field is a format example and never the content, which is `copy-absence` and `form-label`.
- Sample imagery is sample content as much as the strings are, and it is held to the same standard: a screen whose text is the product's own and whose every picture is a filled rectangle was designed down to the text and no further. What stands in for a picture, and what is never allowed to stand in for one, is `icon-stand-in`.

### `copy-numbers` The figure, not the word

A digit is scanned and a spelled-out number is read, and scanning is all a phone gets.

- So the figure is written as a numeral: 3 photos, not three photos.
- Anything destructive states the exact count and the object it acts on, so the reader can check it against what they selected. `touch-destructive` places the control and `fb-confirm-test` decides whether a confirmation exists at all.
- The locale formats it and pluralises it (`l10n-format`, `l10n-plurals`), and `data-precision` rules how many digits a figure carries and where the rounding lives.
- The unit travels with the figure and is not dropped to save width. Figures stacked in a column line up on tabular figures instead (`type-strings`); this rule is the figure inside a sentence.

### `copy-claims` A number that describes the product is derived, not typed

Copy that states how much the product gives (how many items, how much storage, how many devices, how long the trial runs, what the limit is) is a promise, and it is checkable against the code. Typed into the view as part of the sentence, it is correct exactly once: on the day it was written.

The failure is quiet and it compounds. The constant changes, the string does not, and now the screen advertises a figure the app no longer delivers. Worse, the same figure was copied into the store listing, the marketing site and the onboarding, and none of those is read again when the constant moves.

What it looks like in a real codebase: the same quantity living as a literal inside the screen's text, as a constant in the view model, and as a different constant in the layer that actually computes it. Three values, all reachable, none agreeing, and the one the user reads is the one nobody owns.

- The figure comes from the same constant the behaviour uses, interpolated into the string, so a change moves both together. Pluralisation still goes through `l10n-plurals`.
- Where it genuinely cannot be derived, it lives in one named place that the domain code also reads, never inline in a component.
- A cap the product enforces is stated as the cap, not as the theoretical maximum. Advertising a ceiling that a limit elsewhere prevents anyone from reaching is a false claim, and it is the version that reaches a store reviewer.
- Store listing text, screenshots and onboarding repeat these figures. When one changes, they are part of the change.

Grep the view layer for digits inside display strings. Each hit is a claim, and each claim has an owner in the code or it is a defect.

### `copy-rationale` The permission sentence has a punctuation rule, and one place where longer wins

`perm-rationale` owns the screen and `perm-purpose-string` owns what the sentence claims. Three things sit on top of those.

- The iOS usage description is one complete sentence in sentence case, active, ending in a full stop. App review reads it before any user does.
- On the app's own screen in front of the system dialog, the control that opens that dialog reads Continue or Next. What else stands on that screen is `perm-rationale`'s call. A word resembling the dialog's own accept trains the finger to answer before the eye has read the alert, which lands one second later on the same piece of glass.
- A disclosure about data being collected is the one string where clarity outranks the budget: why it is wanted, what is taken and how it is used, on the app's screen before the dialog rather than behind a link to a policy. It stands on its own, with nothing unrelated to that collection folded in beside it, and a thirteen year old is the reading level it aims at.

### Check

Review answers each of these against the code, pointing at the string:

- No title wraps past 2 lines, no body runs past 1 sentence without a new fact in it, and no alert answer exceeds 2 words. `copy-budget`
- 0 destination rows open with a generic verb, and 0 strings in a scannable column repeat their header or lead with a negated term. `copy-first-word`
- 0 occurrences of "the user", "I", "my", "please", "sorry", "oops" and "!" in user-facing strings, "we" only where the sentence is about the company, and 0 gendered references the sentence does not need. `copy-voice`
- 0 em dashes and 0 en dashes in the string catalogue, 0 sales vocabulary anywhere in the interface, and 0 chat leftovers. `copy-tells`
- Every string reporting a failed operation carries all 3 answers, the distinct failure sentences match the distinct moves rather than the 4 classes, and 0 of them lead with a code, blame the reader or spell out a settings path. `copy-error`
- 0 mechanism words, exception names or HTTP numbers in the string catalogue, sync, cache and queue only where the reader uses the word too, and every acronym either known to the audience or spelled out once. `copy-jargon`
- 1 term per concept across the catalogue, listed in `STACK.md`, with 0 uses of "click" and 0 confirmations whose verb differs from the control that raised them. `copy-terms`
- 1 case style per element type across every screen, the 4 iOS-fixed cases correct, whether the theme uppercases the label answered before the authored string is trusted (on Android Views that is `android:textAllCaps`), and 0 strings longer than a short label authored in capitals. `copy-case`
- Field hints show a format, each line standing in for missing content names its cause and the 2 empties with a next move end on the verb of the control that takes it, and 0 waiting lines claim unmeasured progress. `copy-absence`
- Every string and figure belongs to the product's domain, the screen shows at least one concrete value a reader would recognise, and the figures on it reconcile with each other. `copy-sample-data`
- Numbers are numerals, destructive strings state the exact count and object, and formatting and plurals come from the locale. `copy-numbers`
- Every figure that describes what the product delivers is interpolated from the constant the behaviour uses, or lives in one named place the domain also reads, and no advertised ceiling is unreachable because of a limit elsewhere. `copy-claims`
- Every usage description is 1 sentence-case sentence ending in a full stop, the control that opens the system dialog reads Continue or Next, and any data disclosure says why, what and how before the dialog with nothing unrelated bundled into it. `copy-rationale`

Read the strings in the running app, not in the catalogue. Terminology drift only shows up when the screens are walked in the order the user walks them, and a string that is correct in the file can still be the wrong length once the device's text size is applied to it.

### Reaches

- `heuristics/accessibility.md`: `a11y-alt-input`
- `heuristics/buttons.md`: `button-label`
- `heuristics/data-display.md`: `data-empty-null-zero`, `data-precision`
- `heuristics/feedback.md`: `fb-place`, `fb-confirm-test`
- `heuristics/forms.md`: `form-error`, `form-label`
- `heuristics/icons-and-imagery.md`: `icon-stand-in`
- `heuristics/lists.md`: `list-end`
- `heuristics/localization.md`: `l10n-strings`, `l10n-expansion`, `l10n-format`, `l10n-plurals`
- `heuristics/navigation.md`: `nav-location`
- `heuristics/notifications.md`: `notify-lockscreen`
- `heuristics/permissions.md`: `perm-rationale`, `perm-purpose-string`
- `heuristics/search.md`: `search-scope`, `search-zero`
- `heuristics/settings.md`: `set-shape`
- `heuristics/states.md`: `state-error`, `state-retry`, `state-permission`, `state-empty`, `state-loading`
- `heuristics/touch.md`: `touch-destructive`
- `heuristics/typography.md`: `type-scaling`, `type-strings`

# heuristics/data-display.md

## Data display

Numbers, tables, charts, timestamps and units, in a column that starts around 320dp wide, read at a glance by someone who is walking. There is no second monitor for the detail, no hover to reveal it, and no room for a legend, so whatever a value means has to be on the glass at the moment it is read.

Two failures produce most of the damage. The first is precision the data does not have: a float printed whole, a percentage carried to four decimals, an average over six samples shown as though it were measured. The second is a desktop shape moved across intact: six columns, a legend off to one side, a chart drawn wide and then scaled down until its own labels are unreadable.

Neither platform will stop either one. Android ships no chart component and no data table component, in Material or in androidx, and iOS publishes no guidance for a sortable multicolumn table on a phone. Every grid and every chart on a phone is something someone decided to build from nothing.

Rules in this file, in order: `data-precision`, `data-table-shape`, `data-subject-shape`, `data-chart-earns-it`, `data-chart-scale`, `data-chart-reach`, `data-time-relative`, `data-time-instant`, `data-units`, `data-date-entry`, `data-empty-null-zero`.

### `data-precision` Never show more digits than the value carries

Decide the digits from the measurement, not from the type. A step count is an integer, a body weight is one decimal, a currency is the minor units its code declares, and a ratio computed from two small integers is not a four decimal percentage no matter what the division returns. The column is narrow enough that a digit spent is a digit not spent on the label beside it.

- One rounding rule per quantity, applied in one place. The same value showing as 12.4 on the detail screen and 12 in the list is a bug report waiting to be filed, and the reader is right to file it.
- Where the figure is rounded and someone might act on the exact one, say it is rounded and give a route to the exact figure. There is no hover and no tooltip here, so that route is a target: a tap, a detail row, an expanded state. Implying exactness costs more than the extra tap.
- A figure the reader will carry somewhere else, a reference, an account number, a code, a total, is selectable or has a copy affordance on it, because the alternative is transcribing it by hand from a screen they cannot put beside anything. `share-copy` owns what confirms the copy.
- An amount being paid, transferred or owed is never rounded for display.
- A derived figure inherits the worst input's precision. Converting, averaging or summing does not create digits, which is also `data-units`.
- `copy-numbers` rules the figure inside a sentence, and `l10n-format` produces the separators and the symbol.

### `data-table-shape` A table that does not fit becomes a different shape, not a sideways scroll

A horizontal scroll inside a vertical list moves the columns it hides off screen with nothing on the glass saying they are there, so the value the user came for is unreachable by anyone who does not already know to drag. That missing edge is `scroll-affordance`. There are three honest answers instead:

- **Fewer columns.** Two or three, chosen because they answer the question the screen exists for. The rest live one level down.
- **A row that opens a detail.** The row carries the identifier and the one number being compared, and the full record opens as its own screen. This is the answer nearly every time, and `list-row` sizes the row.
- **A different shape entirely.** A grouped list, a chart, or two records compared side by side with the third reachable by paging.

Column headings are nouns or short noun phrases, and a single column of figures still needs a label saying what it counts; `data-units` rules the unit that sits over a column. Figures sit at the trailing edge of their column with the decimal point in one place, `l10n-direction` deciding which edge that is and `type-strings` supplying the tabular figures that hold it there. Where a genuine grid is the product, editable or read only, it is its own screen with a leading identifier column pinned, a visible cut at the trailing edge so the row is seen to continue, and its own selection model, and `STACK.md` records it as an exception rather than a component reused elsewhere.

### `data-subject-shape` A subject with a shape is drawn, not only tabulated

`data-chart-earns-it` below is a gate: it decides whether a chart may sit beside the content. It never asks the question that comes before it, which is whether the content has a shape at all. Many subjects do: a course over time, a position in space, a level between two bounds, a distribution across a set, a run of days kept and broken. A reader takes the shape of one of those in a glance, and takes the same fact, set as figures down a column, one row at a time.

Where the subject has a shape, drawing it is a candidate for being the screen rather than for a card inside it. A screen that renders its subject at the size the subject deserves, with the controls over it and the exact figure beside the point being asked about, has answered with the thing. A screen that renders rows of figures with a small chart in a corner has described it instead. Both pass every other rule in this file, which is why this one exists.

- The test is what the reader came for. Someone asking how it is going is asking for the shape and is answered by drawing it. Someone asking what it was on a particular day is asking for a value and is answered by a list, which is what `data-chart-earns-it` protects and this rule does not overrule.
- Drawing the subject is not licence to invent an encoding. The marks stay the ones that need no explanation, and the exact figure stays reachable at the point the drawing is read.
- A subject with no shape is not given one. A balance, a name, a setting, a single reading: nothing to plot, and a sparkline under each of them is decoration arriving disguised as data, which is `icon-depicts`.

### `data-chart-earns-it` A chart shows a relationship, or it is a number wearing a costume

If the user needs the values themselves, a list beats a chart: the figures are exact and the reader can move through them. A chart is for a trend over time, a comparison across categories, or a part against a whole. One value inside a known range is a labelled number or a gauge, and a gauge states its current value and both endpoints.

Use bar, line and point marks, which need no explanation. A chart shape the reader has to learn arrives with the sentence that teaches it, or it does not ship. Where several charts show the same data, keep one type, one set of colors and one layout across them, because a changed encoding reads as changed data.

### `data-chart-scale` The chart carries its own axis, units and baseline

A phone chart is read without a legend and without a caption, so the plot area gets the full width of the column and everything else earns its space.

- Put the unit in the title or the axis label once, never on every tick. Keep vertical axis labels short, and move a long category label inside the plot area where it does not cover a mark.
- Use a tick sequence a reader recognises without arithmetic: 0, 5, 10 rather than 1, 6, 11.
- The lower bound is a decision, and it is the one that changes what the chart says. A bar chart of totals usually starts at zero. A chart of a value that never approaches zero, such as a heart rate, hides its whole story if it does.
- Grid lines are the smallest number that still lets a mark be estimated. Beyond that they compete with the data for the same pixels.
- Series are told apart by shape, pattern, position or a wide lightness gap as well as by hue, which is `color-not-alone`. Adjacent filled areas need a visible separation between them.
- Series are labelled where they are drawn, at the end of the line or on the bar itself, or in the headline text above the plot. A key sitting off to one side asks the reader to map it back onto the marks, and the column has no room for it anyway.
- Chart text scales with the user's setting like every other string on the screen. A plot drawn by hand takes its label sizes in fixed units and ignores the setting entirely, so labels stay small while everything around them grows. Where a label cannot reflow, the chart drops it rather than shrinking it, and the chart and any column of figures get looked at again at the largest accessibility step, which is `type-scaling`.
- A missing sample is a gap in the line, not a zero and not an interpolation across it, which is `data-empty-null-zero`.

### `data-chart-reach` The point of the chart is legible before anyone touches it

Interaction is a way to get more, never the only way to get the essential. Put the headline figure in text above or beside the plot, so a glance answers the question and the chart explains it.

- Where marks are too small to hit, the scrub target is the whole plot area rather than the marks, and it still meets `touch-floor`.
- A canvas has no children to find, which is `a11y-name`. What a chart adds is where the tree comes from: on iOS the chart descriptor types, which also drive Audio Graphs, and on Android real semantics on the drawing rather than one label over the whole picture. The summarising sentence `icon-alt` asks of a chart stays and the mark or group labels sit under it: the sentence says what the chart is making of the data, the labels carry the data, and neither one replaces the other.
- Decide per chart whether every mark is a stop or whether groups of marks are, then write each label with the value and the context that makes it mean something, such as its date or its category. Actual values, not "rapidly" or "almost", and no ambiguous abbreviation: "June 6" and "60 minutes" rather than "6/6" and "60m". Naming a control is `a11y-name`; this is naming the data inside it.
- Once the marks carry those labels, hide the visible axis and tick labels from assistive technology so the same numbers are not read twice.

### `data-time-relative` Relative time ages while it is on screen, and it has a written crossover

Take the string whole from the platform's relative formatter and place it on its own. Those strings are built as standalone phrases, and embedding one in a sentence is not reliably grammatical.

- The point where relative stops and an absolute date takes over is a named constant in the code, because neither platform picks it. On Android it is a threshold argument the caller passes; the iOS formatter exposes no crossover parameter at all, so the app owns the threshold there.
- Set the floor too. Below it a single string, "just now", instead of "0 minutes ago".
- A label already rendered keeps aging. Recompute it on a timer while the screen is visible and again when the app returns to the foreground, or "just now" is still on screen twenty minutes later.
- Decide whether "yesterday" means a calendar day or a rolling twenty four hours, and hold that decision everywhere. The Android date helper counts from midnight, so an event at 23:50 is "yesterday" ten minutes later, and whatever is written on iOS matches whichever answer was chosen.
- Never compute a span against a constant year. The one in the Android platform is fifty two weeks, which is 364 days, and anything built on it drifts.
- Where the exact moment matters, a transaction or a message, the absolute time is one tap or one long press away.
- Cached content saying how old it is is `state-stale`, and this rule is how that sentence is produced.

### `data-time-instant` Stored as an instant, displayed in the reader's zone and clock

Persist an instant, plus the event's own zone where the zone is part of the fact, such as a flight or a booked appointment. Format it at the moment of display against the device's current zone, never at the moment it was fetched.

- A date with no time, a birthday or a due date, is a calendar date. Running it through a zone conversion is what moves it a day.
- The twelve or twenty four hour clock is a system setting the user changed on purpose. On Android the ICU formatter does not read it, so take the setting from the framework class, `android.text.format.DateFormat.is24HourFormat(context)`, and hand the matching skeleton to the ICU formatter instead of trusting its default. The two `DateFormat` classes are different types and only the framework one answers that question.
- The locale data behind the formatters is pinned per OS release, so the same locale produces different output on different versions. Never compare, parse or assert against a formatted string, and never route one back into storage.
- `l10n-format` owns the formatter and the calendar; this rule is what gets handed to it.

### `data-units` One system per screen, converted once, at the edge

Store the canonical unit and convert only where the value is drawn. iOS ships a measurement formatter that carries the conversion, the style and the locale together; on Android the conversion is the app's own and the formatter renders only the number and its symbol. Two units from different systems on one screen is the failure that gets noticed: kilometres in the summary and miles in the row beneath it, or Celsius on the card and Fahrenheit in its detail.

- The region setting decides the system, and it is not the language setting. `l10n-format` covers that; what belongs here is that a screen picks one and holds it.
- A conversion does not add precision. 5 km shown as 3.10686 miles claims a measurement nobody made, which is `data-precision`.
- The unit stays with the figure, or once in the heading of a column where every value shares it, and is never dropped to reclaim width. If the width is the problem, the layout is the problem. `copy-numbers` rules the same figure inside a sentence.
- Spell out anything a screen reader would mangle, and never reverse the digits inside a number when the layout mirrors.

### `data-date-entry` Match the control to the distance, not to the field type

Near dates go in the platform picker: a compact field or inline calendar on iOS, a docked or modal date picker on Android. Far dates get typed. A birthdate entered on a wheel is hundreds of flicks, and both platforms offer a keyboard input mode for exactly that.

- Constrain the range on the picker itself rather than validating afterwards, and use a range picker where two dates relate so the end cannot precede the start.
- A minute list holds sixty values by default. Where the task does not need them, use an interval that divides evenly into sixty, such as quarter hours.
- A duration is not a time of day, and it never goes in through a time of day picker. On iOS the countdown mode is that control and it stops at 23 hours 59 minutes. Android ships no countdown picker, so a duration is assembled from number fields or a control written for it.
- The time picker is constructed with the system twelve or twenty four hour setting rather than the parameter default, which on Android is twelve hour whatever the device is set to. This is the entry side of `data-time-instant`.
- Do not open a new screen just to show a picker, and do not build a calendar grid by hand: it will miss the locale's first day of week, its week numbering and its non Gregorian calendars.
- `form-input` rules that a closed value set gets a picker at all. This rule is which picker, and in which direction the entry is going.

### `data-empty-null-zero` Zero, unknown and not applicable are three values

They are three different facts and they must not render as the same glyph. Zero is a measurement. Unknown is the absence of one. Not applicable means the question does not apply to this row. In a column this narrow there is no neighbouring cell to compare against and nothing to hover for an explanation, so the glyph is the entire answer the reader gets.

- Zero renders as `0` in the value's own format, with its unit. A dash where a zero belongs makes a working feature look broken.
- Unknown says so in a word, and where it matters, why: not synced yet, not recorded, only available on the paid plan. A blank cell is indistinguishable from a rendering failure.
- Not applicable is the one case where a dash is the right mark, because there is no value to report and never was one. It never shares its glyph with unknown, and where a screen uses a dash for both, unknown is the one that changes.
- A total or an average over an incomplete set says how many values it covers. Silently treating unknown as zero moves the average, and nothing on screen says it moved.
- Zero as a whole screen is a different thing again, and `state-empty` rules it.

### Check

Review answers each of these against the code, pointing at the line:

- No figure reaches a view through a raw float or a default string conversion, each quantity's rounding lives in one named place, and anything rounded that could be acted on says so and offers a route to the exact value. `data-precision`
- No tabular data scrolls sideways: it is cut to two or three labelled columns, opened as a detail, or reshaped; figures align on the trailing edge; and any genuine grid is its own screen with a pinned leading column and a recorded exception. `data-table-shape`
- Where the screen's subject has a shape over time, space or a range, that shape is drawn at a size it can be read at, with the exact figure reachable from it, rather than left as figures in rows; and where the subject has no shape, nothing was plotted to fill the space. `data-subject-shape`
- Every chart shows a trend, a comparison or a part to whole; a single value in a range is a labelled number or a gauge; and any unfamiliar chart shape ships with the sentence that explains it. `data-chart-earns-it`
- Units appear once, ticks follow a recognisable sequence, the axis lower bound is a stated decision, series are labelled on the plot and separable without hue, and the chart still reads at the largest text step. `data-chart-scale`
- The headline figure is in text without interaction, the scrub target is the plot area at the touch floor, and the marks carry accessibility labels with values and context in a tree that was actually built. `data-chart-reach`
- Relative strings come whole from the platform formatter, the crossover to absolute and the floor are named constants, on-screen labels are recomputed, and no span is measured against a constant year. `data-time-relative`
- Instants are stored with a zone where the zone is a fact, calendar dates are never zone converted, the clock setting is read on Android, and no formatted string is parsed or asserted against. `data-time-instant`
- One measurement system per screen, converted at the display edge without gaining precision, and no figure reaches the screen without its unit on it or over its column. `data-units`
- Near dates use the platform picker and far dates a keyboard entry mode, ranges use a range picker, minute intervals divide into sixty, durations never use a time of day picker, the time picker takes the system clock setting, and no calendar grid is hand built. `data-date-entry`
- Zero, unknown and not applicable render as three different things with the dash reserved for the last of them, unknown says why where it matters, and aggregates over incomplete sets declare their coverage. `data-empty-null-zero`

Run `data-precision`, `data-time-relative` and `data-empty-null-zero` against real records rather than the mock ones. Seeded data has no nulls, no zeros, no thirteen digit floats and no timestamps from last year, which is exactly why the screen looks finished.

### Reaches

- `heuristics/accessibility.md`: `a11y-name`
- `heuristics/colors.md`: `color-not-alone`
- `heuristics/copy.md`: `copy-numbers`
- `heuristics/forms.md`: `form-input`
- `heuristics/icons-and-imagery.md`: `icon-depicts`, `icon-alt`
- `heuristics/lists.md`: `list-row`
- `heuristics/localization.md`: `l10n-format`, `l10n-direction`
- `heuristics/scrolling.md`: `scroll-affordance`
- `heuristics/sharing.md`: `share-copy`
- `heuristics/states.md`: `state-stale`, `state-empty`
- `heuristics/touch.md`: `touch-floor`
- `heuristics/typography.md`: `type-strings`, `type-scaling`

# heuristics/feedback.md

## Feedback

The app has something to say to somebody who is already holding the phone and looking at the screen. There is one screen, so every message is taken out of the content it covers, and the vehicle is the whole decision: an interruption costs the user the task, and a message that expires costs them the fact.

The ladder runs from nothing at all up to a dialog that stops everything, and the rungs are not interchangeable. A message that arrives from outside the app is `heuristics/notifications.md`, and the state a failed screen sits in is `state-error`. Wording is owned by the rules that already hold it: `button-label` for the answers, `l10n-strings` for every sentence that ships. This file owns which vehicle carries a message while the user is in the app, where it lands, and how long it lives.

One structural fact decides half of this. Android ships a transient actionable message as a component, with a host that positions it and decides what becomes of the next one. Apple ships none: it has alerts, action sheets and inline status, and nothing that slides in and leaves. Anything transient on iOS is a component somebody in this codebase has to build and maintain, which is a cost worth knowing before the design assumes one.

Rules in this file, in order: `fb-ladder`, `fb-silent-success`, `fb-confirm-test`, `fb-undo`, `fb-place`, `fb-duration`, `fb-reach`, `fb-queue`, `fb-survives`, `fb-blocking-shape`, `fb-unprompted`, `fb-review-prompt`.

### `fb-ladder` Four rungs, and the first one is nothing

- **Nothing.** The result is already on the screen. The row disappeared, the toggle moved, the total changed.
- **Inline.** A line inside the region it is about, which stays until it stops being true.
- **Transient.** A message over the content that leaves on its own, for something the interface cannot show by itself. On Android that is the snackbar host and never a `Toast`: a toast takes no action at all, so it cannot carry the retry or the undo that has to travel with the message, and in an app targeting API 31 or higher it is limited to two lines with the app icon beside them. Anything the user might act on goes to the snackbar while the app is in front, and while it is not, what arrives from outside and how it lands on return is `notify-inapp`. Every host that exists exposes exactly 1 action, so a message needing two answers has outgrown the rung; a component built here takes as many as it is handed and has to hold that count itself.
- **Blocking.** A dialog, for a decision that cannot be deferred.

Take the quietest rung that still does the job, and climb only with a reason. Every rung up spends more of a screen the user came here for something else. Nothing the app has to say blocks the launch: an app that puts an informational dialog of its own in front of the first screen has spent its one interruption before the user has done anything. The single system prompt a required resource is allowed there is `onboard-ask-order`. The other thing allowed there is not a message at all: where the user genuinely cannot proceed for a stated external reason, a required update or a consent that has to be given again, that is a screen of its own saying what is required and what they can do about it, never a dialog laid over a first screen they are not allowed to use.

Count the blocking dialogs one flow can raise. More than one is a design problem rather than a messaging problem, and splitting the flow is what fixes it where rewording never will.

### `fb-silent-success` The screen showing the result is the confirmation

People expect what they did to work, so the outcome worth reporting is failure. A message reading "Saved" over a screen that already shows the saved value is decoration that lands across the bottom of the screen, which is exactly where the next tap was going.

Confirm explicitly only what the screen cannot show: money moved, something went to another person, a file left the device, an item was removed from a list the user is no longer looking at. Anything irreversible or financial takes the confirmation `state-queued` already specifies, which no transient rung can be.

### `fb-confirm-test` Uncommon and irreversible, both at once

Destructive is not the test. Both halves have to be true before an alert stops the user: the user does this rarely, and nothing brings it back. Deleting one photo out of ten thousand is destructive, common and recoverable, so it happens and offers undo. Deleting the account is rare and final, so it interrupts.

A common action that cannot be undone is not exempt, it is a different surface: offering the user choices about something they deliberately started is the sheet case in `fb-blocking-shape`, not a lighter alert. Discarding a draft the user just chose to abandon is that case, and it is common.

Irreversible is judged by what the action does in the world, not by whether a switch can be flipped back. Stopping a live service, ending a call for everyone on it, cutting other people's sessions, sending, publishing: the control can be pressed again, and the outage, the dropped call and the message already read cannot be taken back. An action whose effect reaches other people or a running system counts as irreversible here, however easily its toggle returns.

On a phone the accidental destruction arrives through a fat tap or a swipe rather than through a menu, so recovery matters more than the extra question, and `touch-destructive` already puts distance between the destructive control and the frequent one. Where the destruction is what the user deliberately chose, the button carrying it out is not styled as the destructive one: it is performing their intent, and the escape beside it is what needs the emphasis.

### `fb-undo` Either the work waits inside a real window, or it lands somewhere it can be fetched back from

Two shapes are honest and there is no third. Either the work has not committed yet and the window is the delay before it does, or it commits at once into a place the user can reach and take it back from, a trash, an archive or a recently deleted, where the restore is guaranteed to work. What is banned is the commit with nothing behind it: fire the delete, keep the Undo on screen, and undo becomes a re-create against a server that has already forgotten, which fails differently and sometimes silently.

- Write the window down in `STACK.md` and let it be the authority: a number where the host takes one, and the host's own named length where it takes only a name, in which case the window is however long that name lasts and no second number is invented beside it. The message offering undo never outlives the window, and the work commits when the window closes, when the message is dismissed, or when the user leaves the screen or backgrounds the app, whichever comes first. A visible Undo whose commit already fired, with no destination behind it, is the failure this rule opens by banning.
- Undo reaches as far as the action did. A delete that has already gone to the queue is past its window: `off-destructive-offline` and `state-queued`.
- A system gesture is not the only route. Shake and the three-finger swipe are invisible and undiscoverable, so undo is also reachable without one: the action on the message, a button in the bar or toolbar, or a named custom action on the affected node, which is what `a11y-gesture` asks for. The system gestures keep working alongside it, and nothing here redefines them.
- A screen where the user makes many small edits owes an undo stack, not one slot that the second edit overwrites.

### `fb-place` The message lands on the smallest thing that contains it

`state-error` sets this scope for failures and `form-error` for fields. What this rule adds is that everything else obeys it too: a confirmation, a limit reached, a setting that took effect, all land on the smallest surface that contains the cause, and a fact about a single control never takes the whole screen. Anything that could be said next to the control is not a dialog, and a dialog raised for a fact is a dialog raised for nothing.

The transient rung is the one that cannot obey. Its surface is fixed at the bottom edge, so it answers a control in the top bar from as far away as the screen allows, and it answers the bottom bar from under the thumb that just left. `layout-overlays` owns where it stacks and `touch-feedback` keeps the result off the touch point; what is left here is the choice of rung. A message that has to name its cause to make sense is inline, not transient.

### `fb-duration` The host owns the duration, and where there is no host the component declares one

Hosts come in two shapes and the rule differs by shape. A named host takes short, long or indefinite and nothing between, which is Compose Material3: ask it by name, and accept that an exact number cannot be expressed through it at all. A numeric host takes a duration, which is the Flutter snackbar and the Android view snackbar, the latter also accepting its two names. Even the names disagree across hosts in one design system: the view snackbar runs 1500ms and 2750ms where Compose starts at 4000ms and 10000ms. So a duration never comes from the screen. It is the host's name, or it is one number written in `STACK.md` and read from there by every call that needs one.

Where none exists, which is every hand-built bar and every transient message on iOS, the choice does not disappear, it moves: the codebase owns one component, and that component fixes the duration, the dismissal and the announcement for the whole app in `STACK.md`. A screen that passes its own milliseconds has reinvented the host badly.

- Where the host does not apply the user's timeout, apply it: `getRecommendedTimeoutMillis` on Android takes the original duration plus flags for icons, text and controls, and Compose reaches the same thing through the accessibility manager. A component built here asks the same service before it starts a timer of its own.
- A message offering an action does not race the person reaching for it. Compose defaults an action-bearing snackbar to indefinite, so it stays until it is used or dismissed, and code that assumes it clears itself leaves it on screen. A hand-built bar carrying an action makes that call deliberately, because nothing sets it a default.
- Every transient message is dismissible by the user. On the Android view system swipe to dismiss only exists when the host is a `CoordinatorLayout`, so outside one, and in anything built here, there is a close affordance or there is no way out.
- Nothing exists only inside it: retry, undo and the detail behind the message all keep a permanent home, which `a11y-alt-input` already requires of anything that dismisses itself on a timer. What the phone adds is the rotation, after which the bar is gone for good and the user who was mid-step never sees it again.

### `fb-reach` A message that is only drawn, or only felt, was not delivered

The route differs by platform and both count as delivery. Where there are live regions, on Android views, Compose and Flutter, the region carrying the message is marked live, and on Android that is the only route left now that `announceForAccessibility` and the `TYPE_ANNOUNCEMENT` event are deprecated. iOS has no live region, so the message is posted as an announcement instead. `a11y-announce` holds the mechanics and the polite versus assertive call. A platform snackbar host speaks its own text. A bar built by hand out of a positioned view is drawn and never announced: its words sit in the tree, reachable by exploring for them, and nowhere in the user's ear until it takes whichever of those two routes its platform has.

Haptics accompany a message and never carry it. `touch-feedback` owns the vocabulary and `sense-haptic` the hardware and the switches under it, so the rule here is only the pairing: a success or error pattern fires alongside something visible, never instead of it, because the phone is as often on a table as in a hand. Color follows `color-not-alone`.

### `fb-queue` Coalesce by cause, and drop the backlog rather than replaying it

Three requests in flight on a slow radio come back as three failures within a second of each other. How many may be on screen is `layout-overlays`, and iOS asks that two alerts are never up at once, so the design question here is not the visible message, it is the other two.

- Coalesce by cause. Three failures of the same kind are one message with a count, not a queue three deep. No host does this for you, and the two Android ones fail in opposite directions: the view host shows one at a time and dismisses whatever was there, so an uncoalesced message is lost without a trace, while the Compose host serialises them and suspends each call until the one in front has been dealt with, which is the stale backlog the next bullet bans and which wedges behind an action-bearing message that never times out by itself. Coalescing is code on every stack, and cancelling what is already pending is half of it.
- Drop what has gone stale. A message about a screen the user has already left never shows, and a backlog that plays back after they move on describes a past they cannot act on.
- Stacking above the bottom bar, the floating button and the inset is `layout-overlays`.

### `fb-survives` A confirmation the user never saw did not happen

Rotation rebuilds the screen, the system reclaims the process while it is in the background, and both are ordinary on a phone. A message fired as a side effect during a build or a composition either vanishes on the rotation or fires again on every one, and both versions ship.

Hold the message as state with a consumed flag, so it survives the rebuild once and only once. A blocking dialog is state under the same rule, including whatever action it is holding: an alert reconstructed after a process death with its callback gone is a dialog whose buttons do nothing. Where the screen itself comes back is `nav-restore`, and what the app admits it lost is `state-interrupt`.

### `fb-blocking-shape` If it has to block, it is small, finite and escapable

- Pick the surface before the wording. A yes or no about one irreversible thing is an alert. Anything offering choices about an action the user deliberately started is not: that is an action sheet (`confirmationDialog` in SwiftUI), whose stack puts the destructive choice at the top and the escape at the bottom, or, on Android, a dialog or a bottom sheet, where the choices are a row of roles rather than a stack: the confirming action, the dismissive one beside it, and a third only where a real third answer exists. Building every confirmation as an alert spends the loudest surface on the ordinary case.
- At most 3 buttons. On Android the builder settles it: one positive, one negative, one neutral, and no fourth slot to fill. Nothing on iOS enforces the ceiling, so there it is a rule the code keeps by itself. A fourth choice on either platform means the surface is a sheet or a screen.
- A cancel is present whenever one of the options destroys something, it is not the default, and it sits at the bottom of a stack or on the leading side of a row, away from the destructive one that `touch-destructive` keeps at a distance.
- It does not scroll. A dialog with enough content to scroll is a screen, so build the screen: scrolling under a row of buttons is an accidental tap waiting to happen.
- Buttons are named by their result, which is `button-label`. A dialog whose answers are yes and no makes the user reread the question to find out what they agreed to.
- No blocking progress. Android deprecated its progress dialog for the reason that decides this whole file, that it stopped the user touching anything while the work ran. Nothing about the other platform makes one better there. Waiting is `state-loading`, and a dialog over a dialog is `nav-modal`.

### `fb-unprompted` An interruption the user did not cause starts at the bottom of the ladder

Every rung above answers something the user just did. A promotion, a paywall raised mid-session, a what's new sheet, a survey, a full-screen ad: nobody asked for any of it, so none of it gets the rung a real answer would.

- It takes the quietest rung that can carry it and never the blocking one. A dialog is for a decision the user cannot defer, and this is one they never opened. One surface is the stated exception, and only in the shape `ads-placement` earns: a full-screen ad closing a segment the user just finished, never standing in front of the next one, carrying the exit present in its first frame that `ads-close` requires. A rewarded ad is not an exception at all, because the user tapped the offer and it is no longer uninvited (`ads-rewarded`).
- It waits for a finished task. Firing at launch costs the user the reason they opened the app, and firing mid-flow costs them the flow.
- A task is finished once the person has seen its result, not once the button was pressed. Nothing unprompted stands between an action and the screen that shows what it produced.
- One per moment. Two of them never land on the same transition, an ad and then an offer, a what's new sheet and then a rating prompt, even where each one alone would be allowed there: the second arrives on a person who has just dismissed the first and is still no closer to what they came for.
- One tap closes it, the close is the plain one and not a trick, and the dismissal is remembered for a period written in `STACK.md` rather than asked again on the next screen.
- It never borrows the shape of a system message. An app promotion drawn as a permission prompt or a system alert is asking for a tap the user did not agree to give.

### `fb-review-prompt` The ask for a rating is the loudest thing the app does

Use the system prompt and nothing else. The system rate limits it, at most 3 per app per 365 days on iOS and an unpublished quota on Play, so the app does not get to know whether anything appeared.

- No question in front of it. Asking whether the user is enjoying the app and routing only the happy ones onward is banned outright on Play, which allows nothing to be asked before or while the card is shown, and it costs the app the negative feedback it needed while spending the moment the system prompt was timing for itself.
- Not on a button. Both platforms say the ask does not follow from something the user tapped, and the prompt may not appear when it is called anyway, which leaves a control that does nothing. A deliberate ask opens the store listing on its write-a-review route instead.
- Not during a task, not during the first run, and not while something is being fixed. It goes after a moment that went well: `onboard-defer`.
- The card is shown as the system draws it, with nothing over it, around it, or removing it once it appears.

### Check

Review answers each of these against the code, pointing at the line:

- Every message takes the quietest rung that works, no actionable Android message is a `Toast`, no transient message offers more than 1 action, and the only dialog standing in front of the first screen is the one `onboard-ask-order` allows. A flow raising more than one blocking dialog is reported as a problem with the flow rather than counted as a violation. `fb-ladder`
- No success message duplicates a result the screen already shows, and the ones that remain are for outcomes the screen cannot show. `fb-silent-success`
- Every alert that stops the user is both rare and irreversible, counting effects on other people and on running systems as irreversible, and everything else acts and offers undo. `fb-confirm-test`
- Undo either holds the work for a window written down in `STACK.md` or commits into a place the user can restore from, the message offering it never outlives that window, and it is reachable without a system gesture. `fb-undo`
- Each message sits at the smallest scope that contains its cause, nothing that fits beside a control is raised as a dialog, and a message that has to name its cause is inline rather than transient. `fb-place`
- Every duration is the host's named length or the one number in `STACK.md`, never a value written at a call site, the user's accessibility timeout is applied, every message is dismissible, and nothing lives only inside one. `fb-duration`
- Every transient message is announced by its platform's own route rather than only drawn, and no outcome is carried by a haptic alone. `fb-reach`
- Repeats of one cause arrive as one message with a count, and a stale backlog is dropped instead of replayed. `fb-queue`
- Messages and dialogs are held as state with a consumed flag, so one rotation shows them once and not twice. `fb-survives`
- An alert is used only for a yes or no about one irreversible action, blocking surfaces carry at most 3 buttons, do not scroll, name their buttons by result, and never hold a progress bar. `fb-blocking-shape`
- Nothing the user did not ask for blocks or interrupts them, apart from the segment-boundary ad `ads-placement` allows: it waits for a finished task whose result the person has already seen, never shares a transition with another unprompted surface, closes in one tap, and stays closed for a stated period. `fb-unprompted`
- The rating prompt is the system one, is not preceded by a question, is not wired to a button, and is not raised during onboarding. `fb-review-prompt`

### Reaches

- `heuristics/accessibility.md`: `a11y-gesture`, `a11y-alt-input`, `a11y-announce`
- `heuristics/ads.md`: `ads-placement`, `ads-close`, `ads-rewarded`
- `heuristics/buttons.md`: `button-label`
- `heuristics/colors.md`: `color-not-alone`
- `heuristics/forms.md`: `form-error`
- `heuristics/layout.md`: `layout-overlays`
- `heuristics/localization.md`: `l10n-strings`
- `heuristics/navigation.md`: `nav-restore`, `nav-modal`
- `heuristics/notifications.md`: `notify-inapp`
- `heuristics/offline.md`: `off-destructive-offline`
- `heuristics/onboarding.md`: `onboard-ask-order`, `onboard-defer`
- `heuristics/sense.md`: `sense-haptic`
- `heuristics/states.md`: `state-error`, `state-queued`, `state-interrupt`, `state-loading`
- `heuristics/touch.md`: `touch-destructive`, `touch-feedback`

# heuristics/forms.md

## Forms

Typing on a phone is the slowest, least accurate thing the device asks anyone to do. The field is a small box, the finger is imprecise, half the screen is keyboard, and the person is usually standing up and about to be interrupted. Every field is a chance to lose them, and the ones that lose them are rarely the hard questions: they are the field that opened the wrong keyboard, the label that vanished, and the error that arrived before the answer was finished.

The keyboard, its type per field and its return key belong to `touch-keyboard`. The emphasis and the in-flight behaviour of the submit control belong to `button-one-primary` and `button-state`. What a failure message says belongs to `state-error`, and what survives an interruption to `state-interrupt`. This file is about what the fields ask for and what happens to the answers.

Per-field keyboard types, return keys and autofill names for each stack are in `references/input-fields.md`, to be opened for one lookup.

Rules in this file, in order: `form-column`, `form-count`, `form-label`, `form-required`, `form-input`, `form-autofill`, `form-validate`, `form-error`, `form-persist`, `form-steps`, `form-submit`.

### `form-column` One field per row, at the full width of the column

Fields stack in a single column. Two fields side by side cost the reader on three counts, all of them mechanical: the eye leaves the vertical line it was following, each field loses half an already narrow width, and the label over a half-width field is the first thing to wrap once text scales up, per `type-scaling`.

One exception, and it is a test rather than a list. Two controls may share a row when they produce a single answer and one of them is a picker or a value of two to four characters: card expiry beside its security code, both read off the same card in one glance and both numeric; an amount beside its currency; a quantity beside its unit. The row survives only while each half still fits its label on one line at the largest accessibility text size. Where it does not, they stack.

Width carries no meaning here. On a wide form a short box hints at a short answer; in a single phone column every field is the same width, so the hint has to come from the keyboard, the mask and the maximum length instead.

### `form-count` Every field is a keyboard round trip

An average checkout asks for eleven fields and can be answered in six to eight. Removing one field is worth more than styling all of them.

- Ask only for what cannot be derived. City and state follow from a postal code, the country from the device region, the currency from the account.
- Never ask for the same value twice. Confirm-email and confirm-password fields double the typing on the device where typing is worst, and a reveal toggle on the single password field does the same job better.
- Past six questions, split the form into labelled groups or into steps, related fields together and the personal ones last.
- Prefill anything already known, and leave it editable.
- Every hardcoded default is named in the code alongside the reason it is the default. A wrong default is worse than an empty field, because a filled field looks answered and gets scrolled past, and a default nobody can justify is an answer the user never reads.

### `form-label` The label stays on screen while the field is being filled

A placeholder is not a label. It leaves on the first keystroke, which is exactly when someone looks back to check what they are answering, and on a phone the field and the keyboard are often the whole screen, so there is nothing above to look back at. It also reads as an answer to anyone scanning, and it is the weakest thing a screen reader can be handed. Apple's guidance allows a placeholder to stand in for the label where it is sufficient; on a form it is not, for the reasons above, and this rule overrides it.

- The label is visible the whole time the field holds a value, in one or two words. A floating label that rises on focus still counts; a hint that disappears does not.
- Every field is tied to its label in code, not merely positioned near it.
- Position follows the platform: above the field on Material and on the web, leading inside the row in an iOS grouped form.
- Where a placeholder remains, it shows an example of the value and is visibly lighter than entered text.
- Format rules, eligibility and the reason for a sensitive question go in helper text under the field, under 100 characters, and stay visible while the field is being typed into. Format hidden in a placeholder is gone at the moment it is needed.

### `form-required` Mark the minority, and mark it with a word

If most fields are required, mark the optional ones. If most are optional, mark the required ones. Marking every row costs the reader the scan and tells them nothing.

Use the word "Optional" rather than an asterisk alone. A phone form is read one field at a time, and the legend that explains the asterisk has scrolled off the top by the second question, so the mark has to carry its meaning where it stands. An asterisk is also announced as a star. The mark goes in the label, never in the placeholder, where it disappears with everything else.

### `form-input` Configure the field before the finger arrives

Each field declares what it holds, and the rest follows from that declaration. The keyboard type and the return key it produces are `touch-keyboard`; what the field does with what arrives is here.

- A numeric code or a card number takes a numeric keyboard over a text field, never a number field with its stepper, which also drops leading zeros.
- Capitalise names and street lines. Turn capitalisation and autocorrect off for email, usernames, codes and anything the dictionary will not know. Autocorrect on an email field silently substitutes a value the user believes they typed.
- Mask and format as they type, so spaces in a card number and separators in a phone number are the field's job rather than a rejection afterwards.
- Where the value set is closed, use a picker, a date picker or a segmented control. A closed set typed by hand is an error being manufactured for later.
- Focus a field on open only when the screen exists for that one field, such as search or a code. Anywhere else the keyboard covers the form before it has been read.
- On mobile web the field's own text size is a layout decision. Safari on iOS zooms the page into any field it is about to focus whose text is under 16px, and it does not zoom back out, so the user finishes the form on a page wider than the screen with the submit button off to one side. Set 16px or larger on the field itself. The viewport is the wrong lever for this: Safari has ignored `user-scalable`, `minimum-scale` and `maximum-scale` on a web page since iOS 10, precisely so that a page cannot take zoom away from the user, and where those values do still apply, which is a web view embedded in an app, what they buy is a page nobody can enlarge.

### `form-autofill` The fastest field is the one the platform fills [pass or fail]

Both platforms will fill a whole form from the password manager, the contact card, the wallet and an arriving SMS, and none of it happens unless each field declares its content type. This is the highest value line in a form and it is the line generated code leaves out.

- Declare a content type per field: email, username, current password, new password, name, address lines, postal code, country, telephone, card number, expiry, security code.
- Group the fields of one credential and tell the platform the form is finished when it is submitted, or nothing is offered for saving and the next visit is typed again from scratch.
- A one time code is one field with the one time code content type. Six boxes drawn over that one field are fine; six separate inputs break both autofill and paste, which were the only reasons the field was fast.
- A sign-in screen puts the saved credential, the biometric or the passkey ahead of the typed password. Typing a password on glass is the slowest path the device offers.
- A new password field declares itself as new, so the manager offers to generate and store one instead of watching someone invent it.
- Paste is never blocked on a password, a one time code or a card field, and no field strips or reformats a pasted value on arrival. Blocking paste defeats the manager every content type above was declared for.

### `form-validate` Not while they are still typing

Per-keystroke validation reports an error on every value on its way to being right: an email address is invalid until its final character. Validate when the field loses focus, or after 500 to 1000ms without typing.

- Never validate a field on focus. An error on something untouched is an accusation.
- Three things validate live, because live is their whole purpose: password strength, username availability and a character counter.
- Accept the shapes people type. Spaces in a card number, brackets around a dialling code, a trailing space from the keyboard: normalise them rather than refusing them. A phone keyboard puts those marks there.
- A field that cannot hold an invalid value needs no validation at all, which is why the mask and the picker in `form-input` are the cheaper fix.
- Never clear a field because it failed. Retyping a value on a phone is a punishment for a typo.

### `form-error` The message sits with the field it is about

The message goes under its field, on screen at the same time as the field, with the first failing field scrolled into view and focused when a submit fails. A summary above the form is allowed in addition to those messages and never in place of them: on its own it is a list the user has to scroll away from before they can act on it.

- What the message says and how it says it are `state-error`. What this rule adds is the room it gets: the message shares the screen with the keyboard and has about one line, so the fix has to be in the first few words.
- The error is not a color. It carries an icon or the message itself, per `color-not-alone`, and the label stays readable rather than being repainted red.
- One message per field, replacing the helper text rather than stacking above it, so the row does not grow and push the submit control off screen.

### `form-persist` The form outlives the process [P0]

A phone form is interrupted by definition: the code arrives in another app, a call lands, the OS reclaims the process while the user is in their password manager. Returning to an empty form is the most expensive failure in this file.

- What survives backgrounding, process death and a configuration change, text size as much as rotation, is `state-interrupt`, and where the user lands on the way back is `nav-restore`. The rule here is the outcome, not the mechanism: the values are on screen again. Which mechanism gets them there is the stack's, and on some stacks it is already the default.
- The field that had focus comes back too, so the keyboard reopens on the question that was being answered.
- A form of six or more questions writes a draft it offers back on the next visit, or `STACK.md` records the decision not to. Losing it silently is neither.

### `form-steps` A step is a screen, and back moves one step

Splitting a long form into steps only helps if moving back through them works the way the phone already works.

- Show which step of how many. Without it the form has no visible end, and the choice to carry on is made with nothing to base it on.
- System back, the Android gesture and the iOS edge swipe move one step back rather than leaving the flow. Leaving is a deliberate action with a confirmation, because it discards every answer behind it.
- A step re-entered still shows what was typed into it, forwards as well as back.
- The last step names what submitting will do, so nobody presses it to find out.

### `form-submit` One action, and the input survives its failure

One submit per form, with its emphasis from `button-one-primary` and its in-flight state from `button-state`.

- No Clear or Reset control on a data entry form. It is a full-form undo parked next to the submit button on a surface where taps land approximately, and the price of a mis-tap is retyping all of it. A filter or search sheet is the exception: Clear all there is the way out of a filter state, and it costs one tap to rebuild.
- Failure keeps everything, and what a retry returns to is `state-retry`. A network error that empties the form is worse than the network error.
- Success says what happened and where the person now is, in place or on the screen they land on.

### Check

Review answers each of these against the code, pointing at the line:

- Every field has its own row at the full content width, and any shared row produces one answer whose halves still fit their labels at the largest text size. `form-column`
- The visible fields were counted, none asks for the same value twice, six or more questions are grouped or stepped, what is known is prefilled, and every default carries the reason it is one. `form-count`
- Every field has a label that stays visible, bound to it in code and positioned per platform, no placeholder is doing a label's job, and helper text stays under 100 characters. `form-label`
- Required or optional is marked on the minority only, as a word, in the label. `form-required`
- Capitalisation, autocorrect and any mask are set per field, closed value sets use a picker rather than free text, nothing takes focus on open except a single-field screen, and on mobile web no field's text sits under 16px. `form-input`
- Every field declares its autofill content type, credential fields are grouped and committed on submit, the one time code is a single field, and paste is blocked nowhere. `form-autofill`
- Nothing validates per keystroke or on focus, blur or a 500 to 1000ms pause triggers it, and accepted formats are normalised rather than rejected. `form-validate`
- Each message sits under its own field, names the fix in its first few words, does not depend on color, no summary stands in for those messages, and the first failure is scrolled to and focused. `form-error`
- Values, scroll and the focused field come back after backgrounding and process death, and a form of six or more questions either drafts or records that it does not. `form-persist`
- A stepped form shows the step and the total, system back moves one step rather than out, answers survive going back, and the last step names what submitting does. `form-steps`
- One submit control, no reset outside a filter sheet, and nothing lost on failure. `form-submit`

`form-persist` is answered by backgrounding the app with the form half filled and coming back, not by reading the state code. `form-autofill` is answered by triggering the platform's own fill on a device, because a content type spelled wrong fails silently and looks exactly like one spelled right.

### Reaches

- `heuristics/buttons.md`: `button-one-primary`, `button-state`
- `heuristics/colors.md`: `color-not-alone`
- `heuristics/navigation.md`: `nav-restore`
- `heuristics/states.md`: `state-error`, `state-interrupt`, `state-retry`
- `heuristics/touch.md`: `touch-keyboard`
- `heuristics/typography.md`: `type-scaling`

# heuristics/icons-and-imagery.md

## Icons and imagery

On a phone the icon is frequently the whole control. A glyph in a tab bar or a toolbar, beside a label that had to be shortened or was never written, is what the user aims a thumb at. And a picture reaches the screen late, over a cellular link, into a column exactly one image wide, so the space it will occupy has to exist before it does.

Both fail the same way: the set was assembled rather than chosen, and the box was sized by the bytes rather than by the layout.

Sizes, axis ranges, density buckets and asset paths are in `references/icon-and-image-assets.md`. This file is the rules.

Rules in this file, in order: `icon-one-set`, `icon-weight`, `icon-no-emoji`, `icon-vector`, `icon-reserve`, `icon-crop`, `icon-depicts`, `icon-stand-in`, `icon-alt`, `icon-dark`, `icon-avatar`, `icon-app`.

### `icon-one-set` An icon set is a set, not a collection [pass or fail]

One set for the whole app, at one weight and one style. Two sets on one screen is the defect that reads from across the room: it takes no interaction to find and no expertise to name, and it is what a screen assembled out of search results looks like.

- Take the platform's set unless something rules it out. It arrives already matched to the system font, ready to scale with the text setting once it is configured to, and already carrying the variants the platform's own bars expect.
- A custom set is a decision rather than a leftover: one grid, one stroke width, one corner treatment, one perspective, and enough detail removed that the glyph survives at the size it is actually drawn. A custom symbol on iOS has to match the system ones in detail, optical weight, alignment and perspective, or it reads as borrowed.
- The selected state comes from the set's own fill, the `FILL` axis or the filled variant, not from a second file drawn by hand. On iOS the system updates that appearance itself inside standard bars and buttons. On Android and in Flutter the bar takes the state from you, so the selected destination is handed the filled variant explicitly. That the selection then reads without depending on colour is `button-tabs`.
- Directional glyphs turn around in a right-to-left language and a few of them must not. Which is which is `l10n-no-mirror`.
- Icons live in the theme, reached by name, so the whole set can be swapped at once. Twenty asset paths typed at twenty call sites is twenty places the next set will not reach.
- Count the icon dependencies. The answer is one, or one plus a stated reason.

### `icon-weight` The icon is sized against the label, not against the box

An icon next to text is part of that line, and every property it has is borrowed from the text.

- Match the weight. An icon heavier than its label turns the picture into the heading, and the platform sets exist to make this exact: the symbol weights map one to one onto the font weights.
- On iOS, align on the text baseline rather than on the centre of the line box: every system symbol carries baseline information and `firstTextBaseline` uses it. Centre alignment is what makes an icon look like it is floating a pixel high. A Compose or Flutter `Icon` publishes no baseline for a parent to align to, so there the icon is centred against the line box and the residue is corrected by eye.
- Where the set is a variable font with an optical size axis, set that axis alongside the size, because the two do not track: Flutter pairs a default size of 24 with a default optical size of 48, so a project that has brought in Material Symbols draws a 24dp glyph at the stroke meant for a 48dp one until it sets `opticalSize`. SF Symbols answers the same need with scale, and a Compose `Icon` drawing a vector has no such axis at all.
- An icon that labels text grows with the user's text setting. Flutter's `applyTextScaling` is off until it is turned on, in the widget or the `IconTheme`.
- Asymmetric glyphs need optical centring, and the offset belongs inside the asset as padding, so that centring the box centres the picture. The correction is small and it is the difference between a toolbar that looks drawn and one that looks placed.
- Light artwork on a dark ground blooms. Where the set has a grade axis, take it down rather than dropping a weight.

An icon rarely carries a verb on its own, so what is written next to it is `button-label` and what is spoken instead of it is `a11y-name`. Meaningful icons owe the same contrast as any other non-text mark: `color-contrast`. And the glyph is only the drawing: the target around it is a separate object with its own floor, which is `touch-floor`.

### `icon-no-emoji` An emoji is content, never an icon [pass or fail]

Emoji inside a message, a reaction, or a name somebody typed is content and stays. Emoji standing in for an icon is the most reliable tell of a generated screen, and it is not a shortcut, because none of the four things an icon does survives it.

- It is drawn by the system emoji font, which is a different picture on each platform and each release. The glyph that shipped is not the glyph that appears.
- It ignores tint, weight and text style, so it can neither match the label beside it nor follow the theme, and it stays in colour inside a monochrome bar.
- Its reading is cultural and its variants carry skin tone and gender, so it does not translate and it cannot be reviewed by the person translating it.
- A screen reader speaks its catalogue name, so a control announces a picture instead of an action.

The same applies to a glyph pulled out of a typeface drawn for prose. A check mark, an arrow or a bullet borrowed from the body face is the emoji defect in a quieter coat. An icon font that ships as an icon set is the opposite case and is exactly what to use.

### `icon-vector` Vector where the artwork allows, densities where it does not

- Flat artwork, meaning icons, marks, line illustrations and anything built from paths, ships as vector. One file covers every density and every size, and nothing has to be regenerated when a size changes.
- A tintable vector is authored in one solid colour so the theme's tint lands on it cleanly. An icon with its colours baked in cannot follow a role and cannot follow dark.
- Photographs stay raster. A raster used as an interface asset is authored at every density the platform asks for, which is not the same as carrying all of them in the binary: what each device downloads is `perf-size`. Authored at one density only, it is soft on a 3x screen or lands more decoded pixels in the box than the box has, which is `perf-decode`.
- Vector is not free at every size: a large or heavily pathed drawable costs more to draw than the bitmap it replaced, which is why Android recommends keeping an in-app vector drawable at 200 by 200 dp or under. iOS publishes no equivalent limit. The launch surface icon is outside that ceiling: it is a vector at the size the platform fixes for it, which is `splash-contents`.

### `icon-reserve` The box exists before the bytes do

Every image whose source is a URL gets its dimensions from the layout, decided before the request is made, and those dimensions are also what it decodes to: `perf-decode`. Row images are `list-images`; this is everything else, the header, the hero, the card, the article body, the avatar.

- The box is the row rule applied off the list: `list-images`. What stands in it while the bytes are in flight is `state-loading`.
- Nothing below the image moves when it lands. In one column that reflow is the rest of the screen, under a thumb already on its way down.
- Some stacks give a bundled image its size and give a remote one nothing. In React Native a `uri` source has no intrinsic dimensions, so it needs an explicit width and height, and the fast link on the development machine hides what a slow one does.
- The image that never arrives is a designed state at the same dimensions, not a gap: `state-error`.

### `icon-crop` The surface decides the ratio, the photo does not

Fix one aspect ratio per surface, once, then crop everything entering it to fill. A surface may instead offer a short fixed list of ratios and let each item pick from it, which is how a feed of user photographs works. What it may not do is take an arbitrary ratio out of the bytes, because in one column the shape of the image is the shape of the screen, and that hands the layout to whatever the last user uploaded.

- Fill and clip. Letterboxing puts bars inside the content, and stretching to fit is a defect users see and cannot name.
- Decide what a portrait photo loses inside a landscape frame before one arrives. A centre crop keeps the middle, and faces, text and the subject of the shot are frequently not in the middle.
- Fit-inside is right where the whole image is the point: a logo, a scanned document, a diagram. There the frame keeps its own background instead of leaving transparent bars.
- Where a crop is destructive to the user's own content, the frame is a preview and the full image is one tap away.

### `icon-depicts` Artwork that depicts nothing is spending the screen

The blurred oval behind the form, the glow under the logo tile, the three gradient bands standing where a feed's photographs go. Each one takes the area a person looks at first and reports nothing back, and that is the shape a generated screen has: the only decision behind the biggest element was to fill it.

- Anything larger than a touch target that is not text, a control or data depicts something this product can name. The item being bought, the route being taken, the record being read, the state being waited on.
- A container is not the artwork. An icon centred in a rounded tile is a hero that decided nothing, and on a first screen it is the most common form of this defect.
- Where the real image does not exist yet, draw the subject, hold the frame it will occupy (`icon-reserve`), or leave the space. A placeholder that depicts nothing is worse than an honest gap, because it looks finished.
- Texture is not subject. A pattern, a grain pass or a wash over artwork that already shows something is treatment. The same wash on its own is the defect.
- Abstract is allowed where the product is abstract, and the test does not care about style: somebody who has not seen the app can say what the picture shows.

### `icon-stand-in` A domain with pictures in it gets pictures

Some products are mostly text and some are not. Where the thing the screen is about has a look, what it looks like is content: the dish, the movement, the place, the garment, the room, the face of the person the row is about. A screen that replaces those with a glyph centred in a filled rectangle has not drawn its content, it has labelled the absence of it, and a column of those is the screen saying it has nothing to show. That is `icon-depicts` in the form it takes most often, because a glyph is easy and a picture is not.

The absence of real bytes is not the reason. A screen drawn before its backend exists still has to be judged, and it is judged on what a picture does to the weight, the reading order and the density around it, which a grey block does not do.

- Stand in with a photograph, seeded from the item's stable identifier so it stays attached to its row, or draw the subject as vector. The services and their costs are in `references/icon-and-image-assets.md`, and sample imagery is sample content under the same fence as the rest of it: `copy-sample-data`.
- What stands in does not ship. A build pointing at somebody else's photo service carries a third-party request per row (`priv-instrument`) and a payload nobody budgeted (`net-payload`, `net-metered`), and the licence to the picture is not the product's.
- A glyph is right where the thing genuinely has no appearance: a category, a setting, a state, an action. Those are labels and the glyph is the label.
- The picture keeps the edge its medium gives it (`layout-shape`). A decorative rule or a coloured frame added around content artwork is treatment standing where the subject should be, and it reads as a sticker.

### `icon-alt` A picture is content or it is decoration, and it says which

Content describes what it shows. Decoration is hidden instead of described, which is `a11y-hidden`. Nothing sits between the two, both answers compile, and a screen where every image says nothing looks identical to one where every image is right.

- The description is what the picture shows, not what the file is: `contentDescription`, `accessibilityLabel`, `semanticLabel`. In one column the picture is frequently the whole payload of the screen, so for a user who is not seeing it that sentence is the screen.
- Two descriptions pass every automated check and carry nothing: the file name, and the word image, photo or icon.
- A chart, a diagram, or the illustration holding an empty state's meaning owes the sentence it is making rather than an inventory of its parts.
- An icon that is the only label on a control is not this rule. What is spoken there is the action, which is `a11y-name`.

### `icon-dark` Artwork that cannot be tinted needs a second asset

A single-colour glyph needs no dark variant, because it is tinted from a theme role and follows it. Everything else does.

- Illustrations, marketing art, logo lockups and anything with colour baked in ship a light file and a dark file, selected through the asset system rather than by a conditional written inside a component.
- The asset carrying its own opaque background is the one to hunt for. A white-backed PNG on a dark surface is a white rectangle, and it survives review because review happens in light.
- An inverted copy is not a dark variant. Inverting artwork shifts every hue in it, and inverting a photograph is simply wrong: `color-dark-composed`.
- Screenshots of the product inside the product are recaptured in dark, or they are not shown in dark.

### `icon-avatar` The fallback is the common case

Most accounts have no photo, so the fallback is the state to design first and the one that will be on screen most.

It works because a person has no subject to draw: an initial or a generated shape identifies them, and there was never a picture of something to show instead. Artwork that does have a subject is `icon-depicts`, whatever it stands in for, and a letter on a filled square in its place abbreviates a picture rather than identifying an account.

- Initials from the name, or a shape generated from a stable identifier, so the same person keeps the same avatar between sessions and between devices. One shared silhouette for every user is decoration, and a list of them carries no information at all.
- The fallback fills the same box the photo would, so a list of people keeps its rhythm while photos load.
- Never a broken image frame, an alt-text box, or the platform's missing-asset glyph. At the size an avatar is actually drawn that is a dark square with a question mark in it, repeated down the list.
- Initials come from the display name as the locale orders it, one or two characters, and they are measured against their generated background like any other text: `l10n-personal`, `color-contrast`.
- The missing name is a case too. Deleted accounts, invited users who never joined, and system actors all arrive at the same component.
- Never a drawn human face. It puts an invented person on somebody's account, it is the same face every time the component renders, and a column of them is three strangers who look related. Initials, a generated shape, or the product's own mark.

### `icon-app` One asset, no words, no fine detail

The app icon is drawn at about the size of a fingertip, beside twenty others, inside a mask the launcher picks and at whatever smaller sizes the system generates for search and settings.

- No text in it. Words in an app icon are never translated and never read out, and at the drawn size they are texture.
- No screenshot of the interface, no hairline strokes, no small detail. Each of them survives the 1024px master and none survives the home screen.
- Ship the layers unmasked and square, with no shadow, bevel, glow or highlight painted in. The system applies its own, dynamically, and a pre-lit or pre-masked layer fights it and produces jagged edges.
- Respect the launcher's geometry, which fails at both ends. On Android the outer band of the canvas belongs to the mask and to the parallax effect, so a mark drawn to the edge loses its edge to whatever shape that launcher applies; a mark drawn too small floats in the middle of a canvas everyone else fills. The safe box has a floor as well as a ceiling, and both are in the reference.
- Ship the monochrome layer on Android, and the dark and tinted appearances on iOS. Both systems generate any variant that is not supplied, so the choice is not whether the app has one, it is whether anybody drew it. An alternate app icon needs its own full set.
- The mark is the product's own. System symbols may not be used in an app icon or a logo, and platform hardware may not be drawn inside one.

### Check

Review answers each of these against the code, pointing at the line:

- One icon set is in use, with one dependency or a stated reason for a second, every glyph on a screen comes from that set at the weight of the text beside it, and a filled selected state is that set's own fill rather than a second file. `icon-one-set`
- Every icon beside text matches its weight, scales with the user's text setting, sets the optical size wherever the set carries that axis, and sits on the text baseline on iOS. `icon-weight`
- No emoji and no glyph borrowed from a prose typeface stands in for an icon, a bullet, an arrow or a button mark anywhere in the interface. `icon-no-emoji`
- Flat artwork is vector and tintable in one colour, and every raster interface asset is authored at each density the platform asks for. `icon-vector`
- Every remote image outside a list takes its dimensions from the layout before the request is made, and nothing below it moves when it lands. `icon-reserve`
- Each image surface names one aspect ratio, or a fixed short list of them, plus one fill mode, and images crop rather than stretch or letterbox. `icon-crop`
- Every region larger than a touch target that is not text, a control or data depicts something nameable in the product, and no glow, blob, wash or abstract gradient stands where an image belongs. `icon-depicts`
- Everything the screen is about that has an appearance is shown as a photograph or a drawing of its subject, seeded so it stays with its item, rather than as a glyph on a filled rectangle; nothing that stands in for missing bytes ships; and no content artwork carries an added decorative frame. `icon-stand-in`
- Every image either describes what it shows or is hidden as decoration, and no description is a file name or the word image. `icon-alt`
- Every asset that cannot be tinted has a dark counterpart selected by the asset system, and no asset carries an opaque light background. `icon-dark`
- The avatar has a generated fallback at the same size, stable per user, covering the missing name, carrying no drawn human face, and no path renders a broken image. `icon-avatar`
- The app icon carries no text, ships unmasked layers with no baked effects, keeps its mark inside the safe box, and supplies the monochrome layer on Android and the dark and tinted appearances on iOS rather than letting the system invent them. `icon-app`

Check `icon-dark`, `icon-avatar` and `icon-app` on a rendered screen in dark appearance, and `icon-weight` at the largest text step. All four pass a light-theme, default-size screenshot.

### Reaches

- `heuristics/accessibility.md`: `a11y-name`, `a11y-hidden`
- `heuristics/buttons.md`: `button-tabs`, `button-label`
- `heuristics/colors.md`: `color-contrast`, `color-dark-composed`
- `heuristics/copy.md`: `copy-sample-data`
- `heuristics/layout.md`: `layout-shape`
- `heuristics/lists.md`: `list-images`
- `heuristics/localization.md`: `l10n-no-mirror`, `l10n-personal`
- `heuristics/privacy-ui.md`: `priv-instrument`
- `heuristics/splashscreen.md`: `splash-contents`
- `heuristics/states.md`: `state-loading`, `state-error`
- `heuristics/touch.md`: `touch-floor`
- `platform/network.md`: `net-payload`, `net-metered`
- `platform/performance.md`: `perf-size`, `perf-decode`

# heuristics/layout.md

## Layout

A phone hands the app one narrow column, and the operating system takes part of it back before the first widget renders. Bars at both ends, a cutout, a gesture strip, a keyboard that arrives unannounced, and text at whatever size the reader chose. Layout here is the composition of what is left over, and the part the system reserves is a measurement read at runtime, not a margin guessed at the end.

Values already written into `DESIGN.md`, the spacing scale and the screen margin among them, are settled. This file is how a screen is built inside them, and what to use for the ones the brief left unset.

Neighbouring rules own the parts that are not geometry: thumb zones are `touch-reach`, the system gesture strips are `touch-gestures`, the keyboard is `touch-keyboard`, and long collections belong to `heuristics/lists.md`.

Rules in this file, in order: `layout-insets`, `layout-grid`, `layout-grouping`, `layout-shape`, `layout-column`, `layout-width`, `layout-chrome`, `layout-overlays`, `layout-axis`, `layout-fold`, `layout-short`, `layout-orientation`.

### `layout-insets` The safe area is geometry, not padding added at the end [P1]

Read the inset at runtime and lay the screen out inside it. A constant copied off one device (34, 44, 48) is right on that phone and wrong on the next, and it is wrong on the same phone the moment a call banner or an expanded status bar changes the number.

- SwiftUI respects the safe area already. `.ignoresSafeArea()` belongs to a background fill or an image and never to text or a control, and a pinned bar takes `safeAreaInset(edge:)` so the content behind it scrolls clear.
- Compose: `enableEdgeToEdge()` with `Scaffold`, which insets its own bars, plus `WindowInsets.safeDrawing` on anything drawn outside it.
- Flutter: `MediaQuery.paddingOf(context)`, or `SafeArea` with the edges named.
- React Native: the safe area context hook, read per render, rather than a stored constant.
- Mobile web inside a shell: `viewport-fit=cover` plus `env(safe-area-inset-*)`, which report zero until that meta tag is set.

On a current Android target there is no opt out, since the manifest flag that used to disable edge to edge is ignored, so the inset is a runtime measurement on every build. Nor is it one number: a three-button device reports a taller bottom inset than the same phone using gestures. What a pinned control does when that measurement is skipped is `touch-gestures`.

A pinned bar carries the inset inside itself: its own height for the controls, plus the bottom inset underneath them, in one component. Padding the bar from outside leaves a strip of the wrong background color under it, and a sheet or a dialog opened over the screen owes the same treatment, since it becomes the bottom of the screen while it is up.

Four edges, not one. The top holds the status bar and the cutout or Dynamic Island. The bottom holds the home indicator or the navigation bar. The side insets are zero in portrait and stop being zero once the phone is turned, where they are applied to both sides and the cutout is on one of them. Scrolling content may pass under any of them and often should, because the content ending in a hard line above the bar wastes the screen. Anything read or tapped may not, and that includes the last row of a list, the buttons inside a sheet, and a snackbar.

### `layout-grid` One spacing scale, and every gap sits on it

Every value is a multiple of 4, and a multiple of 8 once it is above 16: 4, 8, 12, 16, then 24, 32, 40, 48, 56, 64. A 22 or a 35 landing between those steps is not a fine adjustment, it is a value that came from nudging one component until it looked right, and the next person has nothing to reuse.

Where `DESIGN.md` leaves the margin token unset, the default is 16 on both platforms. It applies to the leading edge of the text column and it holds across screens, because two screens whose text starts at different distances from the edge read as two products. Full-bleed content is exempt by definition: a hero image, a map, a media player and a carousel that runs off the edge are meant to reach it. So are the platform list containers, which carry their own row insets (SwiftUI `Form` and `List`, Material `ListItem`) and are not corrected back to 16 by hand.

Spacing carries more weight on a phone than anywhere else: in a column around 360 wide it is the only grouping tool available, and there is no spare whitespace to absorb an odd value the way a wide layout does.

This is countable. List the distinct vertical gaps on the screen. Four or five is a rhythm. Eleven of them is a screen assembled one component at a time.

### `layout-grouping` Space groups content, a border only draws around it

Set proximity first and reach for a container only when space alone cannot carry the relationship. Related rows tighten, unrelated blocks separate, and a heading takes more space above it than below so it belongs to what follows it.

Every container costs width the phone does not have. A card padded 16 inside a screen margin of 16 pushes its text 32 in from each edge, which on a 320 wide device spends a fifth of the line on nothing. Nested cards, a border plus a divider plus a shadow around the same group, and a card wrapped around the entire screen are all the same move: structure that space was supposed to express.

Density follows the situation in `PRODUCT.md`: an app used while walking wants fewer things per screen and larger intervals, a tool someone works in seated can hold more. Fix it as numbers rather than as an intention. One row height and one section gap per kind of screen, written once and identical everywhere that kind appears, so a screen that is generous at the top and cramped at the bottom shows up as two different gaps instead of as a feeling.

### `layout-shape` Radius, edge and crop are one decision

Corner radius is identity, the same way the palette and the typeface are. `DESIGN.md` carries it as `rounded` and in its Shapes section, and a component that picks its own number is a component that voted on the brand.

A screen where a card, a photograph, a chip, a field and a button are all rounded to the same number has no shape language. It has one habit applied nine times, which is the reason so many generated screens read as the same app.

- The radii come from the shape language: a small one for controls, a larger one for surfaces, a full round for what is meant to read as a pill or a circle. Three values on a screen is a system, nine is a reflex.
- A square edge is a choice available to every surface. Photographs, thumbnails, tables and anything that reads as printed are frequently better with the edge the medium gives them, and a hairline rule does work that a rounded card cannot.
- The radius of a nested surface is smaller than the one containing it, by the padding between them, or the two curves fight along the same corner.
- Elevation is part of the same decision. Shadow, outline and fill are three ways to lift a surface, and a screen that reaches for all three at once has not decided how depth works.

### `layout-column` One column, one scrolling axis

There is no second column to escape into, and that changes what happens when something does not fit. Two halves side by side on a 320 wide screen leave each about 140 after the margins and the gap, and at the largest text step the same pair becomes two words per line. Whatever wants a second column is a row that should stack, a table that should be a list, or content that deserves its own screen. The exception is a pair of short fields whose format fixes their length in advance, expiry beside CVC being the one everybody ships: those fit at 140 and go on fitting at the largest step. Two fields on one line is otherwise the version of this that ships most often, and `form-column` owns it.

**Default.** One column of content.
**Exception.** Items that are pictures first and text second, where a second column shows more of the thing being chosen: a photo library, a wall of covers, a grid of swatches. Also an uneven split where one region is a persistent ground and the other acts on it, which is a composition and not a second column of reading. The test for both is that no item's text has to be read across the gap to make sense.
**Reason required.** What the person is scanning for, and that every tile still holds its label on the narrowest device at the largest text step, which is `layout-width` and `type-scaling` and not an assumption.

The screen scrolls in one place and along one axis. Put a vertical scroll inside another vertical scroll and the drag has two possible owners, so the inner one, holding the content the finger was aiming at, sits still while the page moves instead. Nesting on the same axis is only ever safe under the platform contract that `scroll-nest` owns. A horizontal strip inside a vertical page needs none of that, precisely because the axes differ. Virtualising what is inside the scroll is `list-virtualise`.

### `layout-width` The narrow device is the one that breaks

Design against a range. Supported iPhones run about 375 to 440pt wide, the narrow end being installed base rather than anything still on sale, and Android compact devices report from about 320dp upward. The small end is where a layout fails first, and it is on far fewer desks than it is in hands.

- Nothing holding content carries a fixed width. Let it fill and constrain it with a maximum, so the same row survives both ends of the range.
- A row of three fixed cards, a horizontal group of buttons and a label paired with a value are the three that overflow first. Check them at 320dp before anything else.
- A fixed height is the same defect turned ninety degrees. A container sized to hold two lines holds one and a half as soon as the string is translated or the text scale moves, so heights follow content and only maximums are pinned.
- Width and text size fail together. Recheck the narrow device at the largest accessibility step, which is `type-scaling`.

### `layout-chrome` Anything pinned covers the content underneath it

A bar sitting in the platform's own bar slot is already handled: a Compose `Scaffold` reports the padding its top and bottom bars take, for the content to apply, and a SwiftUI `TabView` or `safeAreaInset(edge:)` extends the scroll view's safe area itself. Use the slot and there is no number to invent.

Hand-placed chrome is the case that bites: an overlay dropped into a `Box` or a `ZStack`, a floating button, a mini player, a standing banner. It sits on top of the scroll rather than shortening it, so the last row lives underneath and can be read only by overscrolling. Nothing in the code looks wrong, and the screen looks correct until the data is long enough to reach the bottom, which is why it survives review so often. The floating button is `button-fab` and the bottom of a collection is `list-end`.

The padding is derived, not typed. Measure the bar, add the inset, and let the scroll read that value, because a hardcoded 80 goes stale the first time the bar gains a second line or the device has a taller gesture area.

Chrome is rationed as well as cleared. Besides the system bars, a phone screen carries at most two persistent bars, and each one earns its height by doing something on every screen it appears on. A third is the sign that navigation, a banner and a player are all claiming the same edge, and the one to cut is the one that does nothing on the screen currently in front of the user.

### `layout-overlays` A transient surface stacks above the pinned ones

A snackbar, a toast or an undo bar arrives over a screen that already has a bottom bar, a floating button, and an inset under both. The stacking order is the whole rule: the transient surface sits above every pinned bar and above the bottom inset, and it pushes the floating button up rather than covering it.

Take it from the platform's host, because that is where the displacement is already written: the `snackbarHost` slot of a `Scaffold`, or the equivalent presentation the stack provides. One hand-placed in a `Box` renders under the bottom bar or over the button, and that is the version that ships.

One at a time, and never behind something else. Two messages stacked, a toast drawn behind an open sheet, and a snackbar left under a keyboard that has just opened are the same defect: a surface positioned by hand into a stack whose heights it does not know.

### `layout-axis` Centred means on the screen's centre line, not in the space left over

A title, a selector or a figure placed between a group on the leading side and a group on the trailing side is centred on the screen, whatever the two groups hold. Put it in the space the groups leave and it sits wherever their difference in width pushes it: one icon on the left and three on the right drags it left, and it moves again the moment a group gains or loses an item. The eye reads the centre of the screen, and an element slightly off it reads as a mistake rather than as a choice.

The platforms already do it this way. The iOS navigation bar centres its title on the bar, and Material's centre-aligned top app bar does the same, so a stock bar is correct and a hand-built row is where it breaks. Give both flanks the width of the wider one, or lay the centred element over the full width with the groups on either side of it, and let it truncate before it moves off the axis.

### `layout-fold` The first screenful answers what this is and what to do

At the narrow end, at default text size, with nothing scrolled, three things are visible: what the screen is, the beginning of its real content, and the primary action. That action has two acceptable places and no third. Either it sits inside the first screenful, or it lives in a bar pinned above the bottom inset and is visible at rest, before anything has been scrolled.

Scrolling costs more here than the wheel costs on a desk, because it takes the hand that is holding the phone, so the first screenful is the one thing the user gets without paying for it. A header that spends it on promotion or decoration, an illustration, a stack of marketing cards, a brand banner, has pushed the first row of real content past the edge for nothing. Where the media is the subject, a photo detail screen, a listing, an artist page, a full-bleed onboarding screen, the hero is both the subject and the start of the content, and the rule is already met.

Where content continues below, saying so is `scroll-affordance`. Everything past that line is a decision the user has to earn, so order the screen by what the job needs first, not by what the API returned first.

### `layout-short` Content that does not fill the height still has a bottom

Every rule above assumes the screen scrolls. The other case, a three-field form, an empty state, a detail screen holding two rows, is where a bottom action drifts: centred into the empty middle at one content length, and scrolled out of sight as soon as one more field arrives. There is no viewport height to fall back on the way a page has one.

Both lengths run the same code. The scaffold's bottom bar slot pins it outright. Where the action belongs to the scrolling content instead, give the scroll a fill-height frame and a spacer that pushes the action down, so short content holds it against the bottom edge and long content lets it scroll away with the rest.

The failure has a look, and only the short length shows it: a frame where the content stops a third of the way down, the action floats in the middle, and the bottom of the screen is empty. Nothing in the source says so, because the source is the long case.

### `layout-orientation` Turned sideways the screen loses height, not width

A large phone held horizontally keeps a wide line and takes its portrait width as its height, about 390 to 440pt, most of which the keyboard takes when a field has focus. Two outcomes are acceptable and nothing between them: the screen reflows, which is the default, or it locks to one orientation because the user decided it should, recorded in `STACK.md` with that decision. A lock is a product decision about how the phone is held, and the person writing the layout does not grant it to themselves to avoid drawing a second one.

Locks also hold in fewer places than they used to. From Android 16, an app targeting API 36 has its orientation and resizability restrictions ignored on displays at least 600dp wide, which covers tablets, foldables open and desktop windows, so a screen with no landscape layout meets landscape there anyway.

A screen that is watched rather than held, propped on a stand or lying beside the person while they do something else, is the case that most needs its landscape composition drawn on purpose. `flow/spec.md` gives it a frame of its own.

Reflowing means the primary action stays visible without hunting for it, and the reading column keeps its measure rather than running the full width (`type-measure`). A turn is also a configuration change, so what has to survive it is `state-interrupt`. The geometry is the part this rule owns.

### Check

Review answers each of these against the code, pointing at the line:

- The screen takes its insets from the framework's inset source rather than from a constant, and nothing readable or tappable sits outside them. `layout-insets`
- Every gap is a multiple of 4, and of 8 above 16, the text column starts at the same margin on every screen outside full-bleed content and the platform list containers, and the screen uses about five distinct vertical gaps rather than a new one per component. `layout-grid`
- Grouping comes from space before containers, no container is nested inside another that already groups the same content, and the row height and section gap are the numbers this kind of screen uses everywhere else. `layout-grouping`
- Radius comes from the shape language rather than per component, the screen holds at most three radius values, a nested surface curves less than the one around it, and depth arrives through one of shadow, outline or fill rather than all three. `layout-shape`
- One column, no same-axis nesting outside what `scroll-nest` permits, and nothing side by side that would leave either half under about 140 wide apart from short fixed-format fields. `layout-column`
- No content container carries a fixed width, and the screen was rendered at its own width and again at 320dp with nothing cut at an edge and nothing overflowing sideways. `layout-width`
- Bars sit in the platform's bar slot, hand-placed chrome derives its padding from the measured bar plus the inset instead of a typed number, no more than two persistent bars stand besides the system ones, and on a rendered screen no line of content sits under a pinned bar, at the top edge or at the bottom one. `layout-chrome`
- The snackbar comes from the platform's host slot rather than a hand-placed overlay, it clears the bottom bar and the inset, it moves the floating button rather than covering it, and one is on screen at a time. `layout-overlays`
- On the narrow device at default text size, the screen's subject and the start of its content are visible unscrolled, and the primary action is either in that screenful or in a bar pinned above the bottom inset and visible at rest. `layout-fold`
- Rendered at its shortest content, the screen holds its action against the bottom rather than centred above an empty lower third, through the same code that lets it scroll once the content grows. `layout-short`
- Landscape reflows, with the action still visible and the measure still capped at the shorter height, or is locked by a decision of the user recorded in `STACK.md`, and the screen still holds where the platform ignores the lock. `layout-orientation`
- A lone element meant to be centred between unequal groups sits on the screen's centre line, through equal flanks or an overlay across the full width. `layout-axis`

`layout-insets`, `layout-width`, `layout-fold` and `layout-chrome` are answered on a rendered screen at the narrow end of the range, on a device using three-button navigation as well as gestures. The token table and the component tree both look correct while the bottom bar is sitting under the navigation bar. `layout-chrome` needs the screen scrolled to both ends with enough content to reach the pinned bars, because the collision is invisible until a row arrives under one of them, and the top bar hides the first row as readily as the bottom bar hides the last. `layout-short` needs the opposite render, the screen at its shortest content, which is the only length at which the action drifts into the middle.

### Reaches

- `heuristics/buttons.md`: `button-fab`
- `heuristics/forms.md`: `form-column`
- `heuristics/lists.md`: `list-virtualise`, `list-end`
- `heuristics/scrolling.md`: `scroll-nest`, `scroll-affordance`
- `heuristics/states.md`: `state-interrupt`
- `heuristics/touch.md`: `touch-reach`, `touch-gestures`, `touch-keyboard`
- `heuristics/typography.md`: `type-scaling`, `type-measure`

# heuristics/lists.md

## Lists

Most of a phone app is lists. It is the screen the user opens most, scrolls fastest, and comes back to after every interruption, and it is where three failures arrive together: jank on a device slower than the one it was built on, memory that climbs until the system kills the process, and a wall of rows that all look the same because nothing inside them was ranked.

Loading, empty, error, offline and stale belong to `heuristics/states.md`. This file is what is specific to a collection: what a row is, how many exist at once, and what the top and the bottom of the list do.

Rules in this file, in order: `list-virtualise`, `list-density`, `list-separator`, `list-row`, `list-swipe`, `list-images`, `list-sections`, `list-end`, `list-refresh`, `list-select`, `list-a11y`.

### `list-virtualise` Rows recycle, or the list breaks on real data [pass or fail]

Ten rows in a mockup and two thousand in production run the same code. A scrolling container wrapped around a mapped array constructs every row up front, keeps all of them alive, and misses the frame budget on the way, which `perf-frame` states. This is the single most reliable performance defect in generated mobile code.

Reach for the recycling primitive every time, including on a list that looks short today:

- SwiftUI: `List`, or `LazyVStack` inside a `ScrollView`.
- Compose: `LazyColumn`, with a `key` on each item.
- Flutter: `ListView.builder`, or `.separated` where the rows carry dividers.
- React Native: `FlatList` or `FlashList`. A `ScrollView` around a `.map()` is the defect.
- Mobile web: a windowing library. `content-visibility: auto` skips the layout and paint of an off-screen row but keeps it in the DOM and in the accessibility tree, so it answers the frame cost and not the memory one, and it needs `contain-intrinsic-size` beside it or the skipped rows collapse to zero height and the scroll jumps as they come back.

Three things the recycler needs before it delivers anything. A key taken from the item's own identity, never from its position, because a positional key hands one row's state to a different item as soon as the data reorders. A size hint where rows are uniform (`itemExtent`, `getItemLayout`, `contain-intrinsic-size`), so scroll geometry stops being measured row by row, on the stacks that still take one: FlashList v2 measures for itself and rejects the estimate its first version required. And a row that does not rebuild on every scroll frame, which means the work inside it is memoised and the callbacks it takes are stable.

Putting a windowed list inside another scroller running the same direction cancels the windowing outright: the outer scroller asks for the full height, so every row is built and kept, and the primitive costs more than the plain column it replaced. The gesture half of that mistake is `scroll-nest`.

### `list-density` A wall of identical rows is a missing hierarchy, not consistency

Material sizes its list item by content: 56dp for one line of text, 72dp for two, 88dp for three. iOS names no tiers, only the 44pt row it grows upward from. Take whichever set the stack belongs to and pick the height the content needs, instead of padding every row up to the tallest one in the list. These are density steps rather than touch targets, and the target floor is a separate number (`touch-floor`).

Inside the row there are usually three jobs: the thing itself, what qualifies it, and its state or its metadata. Those three are not one size and not one weight (`type-weight`, `type-roles`). A row where the title, the subtitle and the timestamp share a size and a color holds three pieces of content and no answer to the question the user is actually scanning for.

Let the rows differ where the content differs. An unread item outweighs a read one, a row with a picture is taller than a row without, and a group of two does not get the treatment a group of forty needs. Forty rows carrying three things each, identical in height, weight and color, force the user to read every one, which is slower than looking and slower still while walking. The exception is the row that carries one thing: a menu of single labels, each with its chevron, is uniform because the content is uniform, and ranking there invents a difference the screen does not have. Hierarchy is owed wherever a row holds two pieces of content or more.

### `list-separator` One device separates rows, not three [P3]

Dividers, spacing and cards all answer the same question. Choose one per list, because on a phone a line that only repeats what the gap already said is width and ink spent for nothing. The grouped iOS list is not the thing being warned about: an inset rounded section with hairline rules between its rows is a single platform device, and it stays the right default for a settings or a form list. What is assembled from parts is a card per row that also carries an internal divider, dropped into a stack that is already gapped.

- **Spacing** is the default on a column this narrow. It groups without drawing anything, and it costs no width.
- **Dividers** suit dense uniform rows where the eye needs a line to track along. Where they are drawn by hand, in Compose or on the web, inset them to the text rather than to the leading icon and leave none after the final row. SwiftUI and `ListView.separated` already do both, so this is a review point only on the stacks that do not.
- **Cards** suit rows that are genuinely separate objects carrying their own actions. One card per row across forty rows is forty containers, each spending side padding the content wanted.

### `list-row` The row is one target, and every control inside it is another

That the row itself is a target, and how big it has to be, is `touch-floor`. What belongs to this file is what may sit inside it. A control living in the row is a second target on the same line: a favourite toggle, an overflow button, a checkbox. A chevron is not one of those, it is decoration on the row's own tap. Each real control takes its own hit area and its own dead space away from the row around it (`touch-spacing`), or the user opens a detail screen while trying to star something. Two controls is the ceiling; past that the row needs an overflow menu or a long press.

A row that navigates, and toggles, and expands, is three gestures competing over 56dp of glass held in a moving hand. Give the row one meaning and put the rest behind a control.

### `list-swipe` A swipe is a shortcut, never the only route

Every stack draws them: `.swipeActions`, `SwipeToDismissBox`, `Dismissible`, a swipeable row. They are fast for the person who knows and invisible to everyone else.

- Each swipe action also exists somewhere visible: the row's overflow menu, the detail screen, or selection mode. A swipe-only delete does not exist for a screen reader (`touch-gestures`).
- Two per edge is the ceiling. A third narrows all of them at the exact moment the finger is already travelling sideways.
- A destructive swipe resolves into undo rather than a confirmation (`touch-destructive`). Swipes fire by accident during a scroll, which is precisely when nobody is reading a dialog.
- Leave the gesture findable: a partial reveal the first time, or the action drawn in the row until it has been used.
- The horizontal gesture and the vertical scroll begin at the same point, so the horizontal one commits past a distance threshold instead of on sideways drift. The platform's own touch slop, about 8dp on Android, is the floor for that threshold, and anything under it fires during ordinary scrolling.
- Drag to reorder falls under the same rule: a visible handle or a move action in the menu, not a long press nobody discovers.

### `list-images` The row reserves the picture's space before the picture arrives

Images reach a row late, out of order, and at whatever resolution the server holds.

- **The container has fixed dimensions.** Row height comes from the layout, never from the bytes. An image that sizes itself on arrival reflows the list under a thumb already in motion, and the row somebody was about to tap slides out from under it.
- **The placeholder occupies the exact final box.** A neutral fill or a skeleton at that size. Not a spinner, and not a zero-height box that expands later.
- **The decode is scaled to the box on screen**, which is `perf-decode`.

Fixed dimensions is not the same as one aspect ratio for every list, and choosing the ratio and the crop is `icon-crop`.

### `list-sections` Sections tell the user where they are

Past a screenful or two, a list needs structure the user can navigate by: date, status, alphabet, whatever the order actually follows.

- A section header names a group and is not a row. It does not tap and it does not borrow the row's type styles, and `list-a11y` covers what it owes a screen reader.
- A sticky header stays legible over whatever scrolls beneath it. An opaque fill or the platform's own material settles that outright. A scrim is allowed under `color-gradient` and then owes that rule's measurement, since the content moving underneath moves the worst point along with it.
- One level of grouping. Nested sections in a column this narrow produce indentation nobody can follow.
- Position is worth more here than anywhere else: somebody scrolls two hundred rows, opens one, and comes back to a list that has to be where they left it. What survives that trip, and the mechanism that carries it, is `state-interrupt`.

### `list-end` The bottom of the list is a designed state

Pick one and commit to it.

- **Continuous loading** for feeds and anything browsed rather than searched. Fetch the next page about a screenful of rows before the last one, so it has landed by the time the thumb arrives, and guard the request so a fast flick cannot fire it twice.
- **An explicit load-more control** where the set is finite and the user is hunting for one thing. It is the honest choice whenever somebody needs to be able to stop.

Numbered pagination is a desktop control: there is nowhere on a phone to put page numbers a thumb can hit, and nobody navigates a feed by page number. A list that fetches pages says when the data has run out, with a closing marker, a total or a line of text, because the user cannot otherwise tell the end from a page that never arrived. And a page that does fail becomes a retry at the bottom, leaving the rows above it alone, rather than an error that discards what already loaded. A list holding everything it has needs none of that: the scroll reports its own end.

The last row also has to clear whatever floats above the list, whether that is a fixed bar, a tab bar, a FAB or a mini player. `layout-chrome` owns that padding and the inset that belongs in it.

### `list-refresh` Pull to refresh is one path to fresh data, not the path

Use the platform control rather than a hand-built one (`refreshable`, `PullToRefreshBox`, `RefreshIndicator`, `RefreshControl`), so the threshold, the haptic and the animation match every other app on the device.

- It belongs only where the data changes somewhere else. A pull that re-renders a local array is theatre.
- The same refresh is reachable without the gesture, through a menu item or a button. Somebody driving the screen with a screen reader cannot perform the pull at all.
- It does not replace refreshing on return, and it is not how a user recovers from a failed load. That is the error state's retry (`state-retry`).
- Refreshing keeps the user's place: new items arrive without discarding the row currently under the thumb.

### `list-select` Selection is a mode, and the screen says so

Bulk actions on a phone take over the screen, because there is no modifier key and no width for a permanent column of checkboxes.

- Entering selection is deliberate: a long press on a row, or a Select control. A normal tap never starts it.
- While it is on, the screen shows the count, an obvious way out, and the actions that apply. Rows select instead of navigating, and that change of meaning is visible before the first tap rather than after it.
- Selected is marked by a check mark, a box or a container change, never by tint alone (`color-not-alone`).
- The bulk action says what it did and offers undo, because one mis-tap here costs forty items instead of one (`touch-destructive`).
- Select all in a list that is still paging means selecting what has loaded, and the label has to admit that.

### `list-a11y` A row is one stop, not four

A screen reader moves stop by stop and there is no pointer here to skip ahead with. A row left as its icon, then its title, then its subtitle, then its badge is four stops, so two hundred rows become eight hundred and the list stops being navigable long before it stops being correct.

- Each row is a single node reading as one sentence: `Modifier.semantics(mergeDescendants = true)` or `MergeSemantics` in Compose, `.accessibilityElement(children: .combine)` in SwiftUI, `MergeSemantics` in Flutter, `accessible` on the row in React Native. A control that stays separately tappable stays its own node, which is why two per row is already the ceiling.
- Every swipe and every long press is also an action on that node: `customActions` in Compose, `.accessibilityAction` in SwiftUI, `CustomSemanticsAction` in Flutter, `accessibilityActions` in React Native. The visible equivalent under `list-swipe` is what a sighted user reaches for, and this is the route a screen reader has.
- A section header carries the heading trait, so the reader can jump between groups instead of walking every row: `heading()`, `.accessibilityAddTraits(.isHeader)`, `Semantics(header: true)`.

### Check

Review answers each of these against the code, pointing at the line:

- Every list uses the stack's recycling primitive with a stable non-positional key, and uniform rows carry a size hint where the stack takes one. `list-virtualise`
- Row height follows the content instead of one padded maximum, and any row carrying two or more pieces of content ranks them by size, weight or color. `list-density`
- Rows are separated by one device rather than three, and hand-drawn dividers are inset to the text with none after the last row. `list-separator`
- At most two controls sit inside a row, each with its own hit area and its own clearance, and a chevron is not counted as one. `list-row`
- Every swipe action has a visible equivalent, at most two per edge, destructive swipes end in undo, and the gesture commits past a distance threshold rather than on drift. `list-swipe`
- Image containers carry fixed dimensions with a placeholder at the same size. `list-images`
- Section headers are headings rather than rows, grouping goes one level deep, and a sticky header stays legible over the content moving under it. `list-sections`
- The list loads continuously or offers a load-more control and never numbered pages, and a list that pages states where the data ends and turns a failed page into a retry at the bottom. `list-end`
- Pull to refresh uses the platform control, and the same refresh is reachable without the gesture. `list-refresh`
- Selection mode is entered deliberately, shows its count and its exit, marks selection without color alone, and offers undo. `list-select`
- Each row is one merged accessibility node, every swipe or long press is also an accessibility action, and section headers carry the heading trait. `list-a11y`

`list-virtualise` and `list-density` both pass at ten rows and fail at a thousand, so neither is answered from the file alone. Fill the list with production-sized data and scroll it on the slowest device the app supports.

### Reaches

- `heuristics/colors.md`: `color-gradient`, `color-not-alone`
- `heuristics/icons-and-imagery.md`: `icon-crop`
- `heuristics/layout.md`: `layout-chrome`
- `heuristics/scrolling.md`: `scroll-nest`
- `heuristics/states.md`: `state-interrupt`, `state-retry`
- `heuristics/touch.md`: `touch-floor`, `touch-spacing`, `touch-gestures`, `touch-destructive`
- `heuristics/typography.md`: `type-weight`, `type-roles`
- `platform/performance.md`: `perf-frame`, `perf-decode`

# heuristics/localization.md

## Localization

A phone carries an ordered list of languages, a separate region, a calendar and a digit preference, and the user can point one app at a language the rest of the system is not using. None of that is yours to set. The app renders in a language nobody on the team reads, at a length nobody typed, on a layout that may run the other way.

Shipping one language today is fine. Almost everything in this file costs nothing while the app has one language and is a rewrite once it has forty screens, which is the reason it belongs in the build step rather than in a later project.

Rules in this file, in order: `l10n-strings`, `l10n-direction`, `l10n-no-mirror`, `l10n-expansion`, `l10n-format`, `l10n-plurals`, `l10n-script`, `l10n-personal`, `l10n-collate`, `l10n-per-app`, `l10n-change`, `l10n-pseudo`.

### `l10n-strings` No user-facing text lives in code [pass or fail]

Every string a person reads comes out of the catalogue under a key: a String Catalog on iOS, `strings.xml` on Android, ARB files in Flutter, locale files in a React Native or web project. A literal sitting in a widget is what this file is here to find, and it survives review because nothing on the device gives it away: the screen looks finished until the phone is set to another language and one label stays behind in English.

- The catalogue holds whole sentences. Two literals concatenated cannot be reordered by a translator, and word order is the first thing a language changes.
- Accessibility labels, error text, empty states, notification copy and anything a formatter returns are all user-facing and all belong in the catalogue. So do the two that sit outside the layout and get missed for exactly that reason: the iOS usage descriptions (`perm-purpose-string`) and the Android notification channel names (`notify-channels`).
- Text the server composes never reaches the catalogue at all: a push payload, a mail, a message an API returns. The backend is told which language to answer in, and what it is told is the language the app resolved rather than the one the device is set to.
- Machine-readable strings do not: keys, URLs, analytics event names, log lines. Those stay literal.
- Every key carries a comment saying where it appears and what it does. A translator sees the string and nothing around it.

### `l10n-direction` Leading and trailing, never left and right

Under a right to left language the layout mirrors as a whole: the back chevron, the row disclosure, the progress fill, the drawer edge, the order of everything sitting in a row. The system does this for free, but only for the attributes that describe direction rather than sides.

- iOS: leading and trailing constraints, and natural text alignment. A label pinned to the left stays on the left in Arabic.
- Android: `start` and `end` in place of `left` and `right` on gravity, padding, margin, drawables and relative positioning, plus `android:supportsRtl="true"` on the application element, without which none of them resolve. Compose reads `LocalLayoutDirection`, and in a custom layout `placeRelative()` mirrors where `place()` does not.
- Flutter: `EdgeInsetsDirectional`, `AlignmentDirectional`, and direction taken from `Directionality`.
- A value inserted into a translated sentence carries its own direction. A name, an ID or a file name dropped into an Arabic sentence drags the punctuation around it to the wrong end unless it is wrapped for bidirectional text.
- The back control mirrors with everything else, and on iOS the edge that pops the screen mirrors with it, so the interactive pop is a swipe in from the trailing edge.

### `l10n-no-mirror` Some things are physical and do not turn around

Mirroring is the default. These are the exceptions, and each one gets pinned to an absolute direction on purpose:

- media transport and the timeline scrubber, which follow the recording rather than the text;
- clocks, and anything else running clockwise;
- musical notation;
- chart axes, which hold their orientation so the plot stays readable;
- photographs, illustrations and artwork, unless the image itself is carrying a direction.

An arrow decides its own case: an arrow that means forward or back mirrors, an arrow that means left or right does not. The SF Symbols names draw the same line, with `.forward` and `.backward` flipping while `.left` and `.right` stay put. On Android an asset opts in with `android:autoMirrored="true"`, and on iOS a view carries a semantic content attribute whose playback value is exactly the scrubber case.

Phone numbers are laid out left to right in every language, including the right to left ones.

### `l10n-expansion` The label you sized is the shortest one it will ever be

Budget by the length of the source string, because the short ones grow the most. Up to 10 characters, expect two to three times the width. From 11 to 20, about double. From 21 to 30, three quarters again. From 31 to 50, half again. From 51 characters up it settles near a third more. Chinese and Japanese go the other way and leave a button looking half empty.

The breakage is `type-strings` and `layout-width`. What this rule adds is which strings are at risk: a tab label, a chip and a button verb are the shortest strings in the app, so they are the ones that double. Decide per label whether it wraps to a second line, steps down the scale, or moves to a stacked layout, and never let it truncate the verb (`button-label`).

### `l10n-format` The locale formats it, not a pattern someone typed

Dates, times, numbers, currency, percentages, byte counts, measurements and durations all come from the platform formatter carrying the user's locale, a value the device already holds and the reader has already set: `formatted(.currency(code:))` and the `FormatStyle` family on iOS, `NumberFormat` and `DateFormat` on Android and in Flutter's `intl`, `Intl.NumberFormat` on the web.

- `dd/MM/yyyy` is a guess, and it is the wrong guess for the reader who takes 03/04 as April. Ask for a date style, not a pattern, and take the calendar from the locale as well (`Calendar.current`), because the year on screen in Thailand or under a Hijri calendar is not the Gregorian one. What the user types back is parsed against that same locale, so a comma typed on a German keypad is a decimal point.
- Digits are not universal. Android alone carries 27 Arabic locales, some preferring ASCII digits and others native ones, so a number is substituted at runtime even when its value was known while the code was being written, and a percent sign or a currency symbol is never concatenated onto the end of it.
- Currency is a code and an amount handed to a formatter, which decides the symbol, which side it sits on, and the separators. A hardcoded `$` is a bug in two directions at once.
- Units follow the region's measurement system, which is not the same setting as the language. Someone reads Japanese and lives in Germany.

### `l10n-plurals` A count and a string cannot be glued together

Plural forms live in the platform's plural resource: `<plurals>` on Android, read through `pluralStringResource` in Compose, the plural entries in a String Catalog or stringsdict on iOS, `Intl.plural` in Flutter. Six categories exist across languages, `zero`, `one`, `two`, `few`, `many` and `other`, and which one a number selects is a fact about the language rather than about the number.

- English uses two of the six and Arabic uses all of them. An `if (count == 1)` in the app ships English grammar to every other language.
- The categories are grammatical, so one language never selects `zero` even when the count is zero, and another selects `other` for every count there is.
- If the sentence does not contain the number, it is not a plural. Use an ordinary key.
- Gender and any other grammatical selection go through the same resource, never through string surgery in the app.

### `l10n-script` The face has to have the letters, and the line has to have the room

`type-face` picks the family. This is whether it can draw the languages the app ships.

- A bundled font usually covers Latin and stops there. Check every shipped script in the face that will actually render it, and inspect the fallback chain rather than assuming one, because a missing glyph arrives on screen as a box.
- Non-Latin scripts are taller and want more space between lines: Thai, Devanagari and Arabic in a Nastaliq face all clip inside a box measured against English. Vietnamese does the same without leaving the Latin alphabet, because its tone marks stack above and below the vowel.
- So the leading is a ratio of the font size rather than a point value, taking the ratio `type-roles` sets for that role, and the box it sits in follows its content (`layout-width`).

### `l10n-personal` Names, addresses and phone numbers have no universal shape

- One field for the full name, in the order the person types it. Two required fields for a first and last name shut out anyone with a single name and misfile anyone whose family name comes first. They ship only where an outside format demands the split, a ticket, a KYC check or a card network, and `STACK.md` names which one.
- Address parts follow from the country, which is why the country is picked first. A required postcode, a dropdown of US states and a fixed city, state and zip row are one country's paper form.
- Deriving a city and a state from a postal code, which `form-count` asks for, is a prefill in the countries whose postal system carries it, never a field taken away from the rest. The device region is where the country guess comes from and not where the answer comes from, since people travel and ship abroad.
- A phone number keeps its country code and is not forced through a fixed mask. Validate it loosely and format it for display. Formatting as it is typed is `form-input`, and the mask it uses belongs to the country the number is in. The keyboard under it is `touch-keyboard`.

### `l10n-collate` A to Z is not the same alphabet everywhere

Sorting display names by code point puts accented words after Z, splits the cases apart, and produces an order no reader recognises. Use the platform's locale-aware collator: `Collator` on Android, `localizedStandardCompare` on iOS.

- Section headers and the fast-scroll rail down a long list come from that collator, `UILocalizedIndexedCollation` where iOS builds the index for you, never from the first character of the string. Ch, Ñ and Ø are letters in their own right where the list is being read, and this is what `list-sections` is built from.
- Search matches without regard to case, accents or character width, so typing `jose` finds José.

### `l10n-per-app` The app language and the system language are two different facts

Both platforms let someone point a single app at a language of its own, so the app cannot read the system language and assume that is what it is rendering in.

- Android needs `android:localeConfig` listing the shipped locales before the entry appears in system Settings, and `AppCompatDelegate.setApplicationLocales` to set it from code, with an empty list meaning back to the system default. The Settings entry itself arrives with Android 13, and below that the same call still switches the language inside the app.
- iOS walks the user's ordered preferred languages, takes the first one the bundle has, falls back from a regional variant to the generic language, and lands on the development region only when nothing matched. Android walks the same shape: the exact locale, then the language without its region, then another region of that language, then the next language the user listed.
- So store resources under the widest parent dialect the strings are correct for, and a device asking for a country you never shipped still resolves to something readable.
- An in-app language picker that writes to your own preference store leaves the app disagreeing with the OS about what language it is in. Where one is offered, it writes through the platform API.

### `l10n-change` The language can change while the app is running

- The locale is read where it is used. A `Locale` captured at launch, a formatter built once inside a singleton, or a string preformatted into a cache leaves the screen rendering half in each language after the switch.
- Changing the app or the system language recreates the screen on Android the way a rotation does, so what the user had on it comes back with it, which is `state-interrupt`.
- Anything told the locale once is told it again: the push token registration, the requests that return user-facing text, and any preference the backend stores.

### `l10n-pseudo` Run the fake languages before the real ones

Most of this is findable without a translator, on a device, before any string is sent out.

- An expanding pseudolocale accents and lengthens every string and brackets each one, so a clipped label and a string that never reached the catalogue both surface in the same pass. On Android that is `en-XA`, switched on for the debug build type; in Xcode it is the Double Length or the Accented pseudolanguage, picked in the scheme's App Language menu.
- A mirrored pseudolocale flips the direction and reverses the characters, which makes right to left testable with no Arabic or Hebrew in the binary. On Android that is `ar-XB`; Xcode offers a right-to-left pseudolanguage in the scheme's App Language menu.
- Android's Force RTL layout direction switch in Developer Options mirrors the layout and nothing else. It is a quick look, not the pseudolocale pass.
- Take the pass on the device and at the text step `layout-width` and `type-scaling` already name, which is where a translated string and a scaled one fail on top of each other.

### Check

Review answers each of these against the code, pointing at the line:

- Zero user-facing literals in the diff, the usage descriptions and channel names included, whole sentences rather than concatenations, every key carries a comment, and the backend is told which language to answer in. `l10n-strings`
- No `left` or `right` in any positioning, padding, margin or alignment except on the absolute-direction cases `l10n-no-mirror` names, RTL is enabled where the platform requires it, and inserted values are wrapped for bidirectional text. `l10n-direction`
- Transport controls, clocks, notation, chart axes and artwork are pinned against mirroring, directional arrows mirror, and phone numbers stay left to right. `l10n-no-mirror`
- Every short label has a decided behaviour for the length it will arrive at, wrapping, a step down the scale or a stacked layout, and none of them truncates the verb. `l10n-expansion`
- Every date, number, currency, percentage, unit and duration goes through a locale formatter carrying the locale's own calendar, with no format pattern and no concatenated symbol anywhere, and a typed value is parsed back through the same locale. `l10n-format`
- Every counted string reads from a plural resource, with no count compared to 1 in app code. `l10n-plurals`
- The typeface covers every shipped script with a fallback chain, and the leading is a ratio rather than a point value. `l10n-script`
- One full-name field unless an outside format demands the split and `STACK.md` names it, address fields chosen after the country, and no single mask applied to every phone number. `l10n-personal`
- Lists sort and section through a locale collator, and search ignores case and accents. `l10n-collate`
- The shipped locales are declared to the system, resources sit at the widest correct dialect, and no language picker bypasses the platform API. `l10n-per-app`
- No locale is cached at launch, a language change keeps what was on the screen, and everything told the locale once is told it again. `l10n-change`
- Both passes were taken, the expanding one and the mirrored one, by whichever mechanism the stack provides, and the screen was seen under each. `l10n-pseudo`

`l10n-direction`, `l10n-no-mirror`, `l10n-expansion`, `l10n-script` and `l10n-pseudo` are answered on a rendered screen rather than in the resource files. A catalogue can be complete, a formatter correct and a plural resource well formed while the screen itself still clips, mirrors the wrong element, or falls back to a face that has no glyphs.

### Reaches

- `heuristics/buttons.md`: `button-label`
- `heuristics/forms.md`: `form-count`, `form-input`
- `heuristics/layout.md`: `layout-width`
- `heuristics/lists.md`: `list-sections`
- `heuristics/notifications.md`: `notify-channels`
- `heuristics/permissions.md`: `perm-purpose-string`
- `heuristics/states.md`: `state-interrupt`
- `heuristics/touch.md`: `touch-keyboard`
- `heuristics/typography.md`: `type-strings`, `type-face`, `type-roles`, `type-scaling`

# heuristics/maps.md

## Maps

A map fills the phone's whole screen and takes the drag with it. It is also the least readable surface an app can ship: a canvas of tiles with pins on it carries nothing to a screen reader, nothing in direct sunlight, and nothing to somebody glancing down while walking. And it arrives with a contract, because every major provider requires its own credit on the tiles and most of them bill for the tiles themselves.

Here: the map surface and its gestures, the initial camera, markers and clusters, following the user, the route as text, tiles that did not arrive, the cost of holding a map, attribution, and the equivalent representation that has to exist beside it. The location ask is `perm-scope` and `perm-rationale`, the uncertainty circle drawn around the user is `sense-accuracy`, location switched off above the app is `sense-off-system`, a follow that keeps running once the user has left is `bg-location`, and how the result list beside the map reads is `list-a11y`. A map drawn by a web page inside the app takes `webview-surface-choice` for the surface it sits in and every rule below for what is on it.

Rules in this file, in order: `map-camera`, `map-gesture-owner`, `map-marker-target`, `map-cluster`, `map-not-alone`, `map-follow`, `map-legible`, `map-steps`, `map-offline`, `map-cost`, `map-attribution`, `map-terms`.

### `map-camera` The first frame is a decision: framed on the content, padded for the chrome, and bounded

One screenful and no second pane. A map that opens on the whole world is an ocean to pinch out of with one thumb, and a map that opens centred behind a sheet has spent its only screenful on a region nobody can see.

- Set the initial camera explicitly. An unset camera is a real state rather than a safe default: on Android the camera option is nullable and falls back to a position nobody picked.
- Frame the smallest region that holds the content the screen is about, and pass the padding for everything drawn over the map so the frame lands inside the part that is visible. The calls are `newLatLngBounds(bounds, padding)` on Android, `setVisibleMapRect(_:edgePadding:animated:)` on Apple, and `MapCameraPosition.automatic` in SwiftUI, which frames the map's content for you.
- The published zoom-to-detail steps on Android are 1 world, 5 continent, 10 city, 15 streets, 20 buildings. Pick the one that matches the question being asked, and expect the permitted range to vary with target, map type and screen size.
- A map the user is not meant to leave carries a pan bound or a minimum zoom, so one hard swipe does not lose the venue off the edge.
- Where no location has resolved yet, the fallback camera is written down rather than left at zero, which is a coordinate in the ocean.

### `map-gesture-owner` Where a map sits inside a scrolling parent, one drag has one owner and the code names it

One finger, one drag, and the map takes the full width, so no margin is left for the thumb to scroll the page by. Map gestures ship enabled, scroll and rotate included, so nothing yields on its own and the content under the map becomes unreachable.

- `scroll-nest` owns the same-axis handoff in general. What is map-specific is that the map view does not join the nested-scroll chain, so the parent is told to stop intercepting: `requestDisallowInterceptTouchEvent(true)` in the Android view system and through the `AndroidView` interop in Compose.
- The map side, one line per stack: `MapInteractionModes` in SwiftUI, with `pan`, `zoom`, `pitch`, `rotate` and no interaction at all from an empty set; `gestureRecognizers` on Flutter's `GoogleMap`; `scrollEnabled`, `zoomEnabled`, `rotateEnabled` and `pitchEnabled` in React Native; and `gestureHandling` on mobile web, whose cooperative value scrolls the page on one finger and pans the map on two.
- Where the map is not the point of the screen, it is a picture. A lite-mode map or a static image still carries markers, a tap and the my-location layer with no pan and no zoom, and that is the answer for a map inside a stream.

### `map-marker-target` A marker is a control, and where geography will not let it be big enough the escape is another route to the same place

A fingertip leaves a 16 to 20mm oval and a thumb pad leaves more, while a pin is drawn at a coordinate that cannot be nudged to make room. This is the one surface where the target floor and the content genuinely conflict: two places 30 metres apart sit under one fingertip at street zoom, whatever size the pins are drawn.

- The conflict is in the spacing between pins, not in the drawing. Every marker's hit area reaches the floor in `touch-floor` wherever its neighbours leave the room for it, and no marker is drawn larger than the area that answers a tap.
- Where they do collide, the escape is the same place reachable from a list (`map-not-alone`).
- The default marker tap is not inert. On Android it moves the camera and opens an info window unless the handler returns true, and the map toolbar, on by default, offers to open the place or its directions in the Google Maps app. Leaving the app on a marker tap is a decision to make, not a default to inherit.
- A text glyph on a pin is 2 or 3 characters. More than that is unreadable at pin size.
- Marker and cluster controls carry a name and a role (`a11y-name`), and a decorative overlay is hidden rather than walked (`a11y-hidden`).

### `map-cluster` Neither platform clusters by itself, so hundreds of markers stay one blob until something is written

The screen is 320 to 440dp wide, so a set that separates cleanly on a wide map collapses into a single shape here, and every marker is a live view on a device already spending its frame budget drawing tiles (`perf-frame`).

- Opt in. MapKit clusters only where a clustering identifier is set, and that is nil by default. Android has no clustering in the map SDK at all: it takes the separate utility library, wired by pointing the camera-idle and marker-click listeners at a cluster manager.
- That library's defaults are the numbers to start from: 4 markers minimum per cluster, 100dp collision distance, and cluster labels bucketed at 10, 20, 50, 100, 200, 500 and 1000.
- A cluster prints its count, and tapping one ends somewhere a person can act: a tighter camera, or the list of what is inside it. A cluster that zooms one step and re-clusters forever is a dead end. The alternative to clustering is a declared overlap policy rather than luck, and Android's advanced markers choose between required, required and hides optional, and optional and hides lower priority.

### `map-not-alone` The map is never the only representation, because a canvas of tiles reads as two words

A screen reader gets nothing from tiles. The Android default announcement for the entire map surface is the two words "Google Map", and a marker carries nothing but the content description set on `MarkerOptions.contentDescription`, which is unset by default. The phone shows one thing at a time, so there is no side panel where the equivalent already sits: it has to be a route somebody can reach.

- The map view carries an accessibility label of its own, a content description on Android and a Semantics label in Flutter, naming what it is showing and how much is on it rather than the provider's default string. Every marker built in code carries one too, because the provider sets none.
- Every place, route, area and count on the map is reachable as text inside the same flow: a list, a step list, a place card. How well that list reads is `list-a11y` and `a11y-collection`. What this rule owns is that it exists and is one step away.
- Nothing on the map means anything by hue alone (`color-not-alone`), and no map interaction is gesture-only (`a11y-gesture`).
- That same list is the escape `map-marker-target` leans on and the surface `map-offline` still has when the tiles do not arrive. One list answers three rules, which is why it is not optional.

### `map-follow` Following the user is a mode with a visible state, a way out, and a bill

A camera locked to a moving position fights the thumb: every drag is undone by the next fix. It also runs the radio and holds the display for as long as it is on, the two most expensive things a phone does, while the person holding it is walking or driving.

- Following is a state the screen shows, on a stock control: `MKUserTrackingButton` or SwiftUI's `MapUserLocationButton` on Apple, the my-location button on Android. Apple ships three modes, none, follow, and follow with heading; Android ships only a one-shot recenter, so on Android the mode and its exit are written by the app.
- A pan by the user ends the follow instead of being snapped back. Apple resets the camera to positioned-by-user for you. Everywhere else it is a line somebody writes.
- Turning it off stops the location updates, not only the camera. A follow left running behind a still map is the whole battery cost with none of the benefit.
- Nothing holds the screen awake past the end of the follow. The flag is per window on Android and app-wide on Apple, where nothing but the app releases it, and its release on every branch including the failure branch is `perf-power`.
- The grant is `perm-scope` and `perm-rationale`, running usefully on an approximate grant is `perm-answers`, and agreeing with the indicator the system already drew is `sense-running`.

### `map-legible` The map is a photograph the app did not choose, and everything drawn on it owes its own contrast

Held in sunlight, held at night, held at arm's length while walking. The base map is the one background in the app whose colour nobody picked, and it changes under the finger as the tiles move, so a control that measured fine over one tile fails over the next.

- Measure every control, marker, label and overlay against the tiles it can actually sit on, the pale road and the dark park and the satellite layer, not against one fixed colour. `color-contrast` is the method, and a graphical part needed to understand the content takes 3:1.
- A thin stroke, a light drop shadow or a scrim under the control is the fix, and it costs less than restyling the map.
- Choose the base map rather than inheriting it. Apple publishes two emphasis styles, default and muted, where muted desaturates the map so information-rich content on top of it stands out. On Android the colour scheme defaults to light and ignores the device setting until it is set to follow the system, and it is not kept once the map is destroyed. Dark is a second design either way (`color-dark-composed`), label weight on it is `type-dark`, and the map itself does not turn around in a right-to-left layout (`l10n-no-mirror`).

### `map-steps` A route is text before it is a line, and turn-by-turn is a product rather than a feature

The person reading it is moving, holding the phone in one hand, and looking down for about a second at a time. A polyline is unreadable at that glance.

- Any route drawn on a map is also a numbered step list with distances and street names, in one unit system (`data-units`), formatted by the locale (`l10n-format`). An overlay that encodes a quantity instead of a route owes its scale and units to `data-chart-scale`.
- Do not assemble real-time turn-by-turn on a standard map SDK. Google's terms forbid combining directions, geolocation and the maps SDK into navigation substantially similar to its own app, so the two shipping answers are a dedicated navigation SDK or a handoff to the maps app, and on Android that handoff already exists in the default map toolbar.

### `map-offline` Tiles that did not arrive are a state the app draws, not a cache the app builds

A lift, a basement, a tunnel, a car park, a metered plan. The map is the heaviest thing on the screen and the first thing to fail, and a grey grid with a pin floating on it is the app looking broken at the moment somebody is trying to work out where they are.

- A map with no tiles draws a named state instead of blank tiles, inside the four network states of `state-offline`, saying what failed (`state-error`) with a retry that keeps the camera rather than resetting it (`state-retry`). Tiles still arriving is `state-loading`; a map with nothing to put on it is `state-empty`.
- Everything still true offline stays drawn and carries its age (`state-stale`): the last camera, the pins, the addresses, the step list.
- Where the provider's terms bar it, do not build a tile cache: Google bars pre-fetching, bulk downloading and rehosting outright, with no developer offline mode behind that, only a navigation SDK holding 15 to 20 minutes of route ahead of the user. Where a provider sells an offline store, the download is a sized region the user asked for, with an expiry, rather than a background crawl.
- Tiles are somebody's data plan (`net-metered`), and tiles for a region nobody will look at are `net-prefetch`.

### `map-cost` One map at a time, released when its screen goes, and never one per row

A map is the most expensive view a phone app can hold: it renders continuously, keeps tiles in memory and holds a connection open. Two of them alive at once, or one per row in a recycled list, is the shape that gets the process killed on the device the app was not built on (`perf-memory`).

- One live map instance per screen, released on the exit path and on the error path alike (`perf-power`).
- A map inside a list row is a static image or a lite-mode map, never a live one. `list-virtualise` recycles that row, and a live map is not a thing to recycle. A static map image is a picture and owes `icon-alt`.
- Reuse annotation views rather than building one per marker. Registering a view class, or dequeuing by identifier, is how the app opts in, and the map then builds a view only where no reused one is available.

### `map-attribution` The provider's logo and legal link are drawn by the map, moved only by its own padding, and never removed, hidden or restyled

The map fills the screen, so the bottom edge where every provider puts its credit is exactly where the phone also puts the sheet, the recenter button, the FAB and the tab bar. Covering it is the default outcome of the layout rather than an edge case, and it is a contract term rather than a matter of taste.

- Give the map padding instead of giving the chrome a margin. Padding the map's four edges moves the zoom controls, the compass and the copyright notice inside the visible region and recentres camera movements on it; Apple's edge padding does the same for framing. Anything pinned over the map declares that padding (`layout-chrome`), a sheet stacking above it is `layout-overlays`, and the safe area under it is geometry (`layout-insets`).
- Keep the credit fixed to the map rather than moving it with the interface, and clear of a pull-up card at its lowest resting position, 10 points above it on Apple, whose own padding figures are 7 points at the sides and 10 above and below.
- Never remove, hide, resize, recolour, localise, wrap or redraw it. Google's mark runs 16dp to 19dp tall with 10dp of clear space left, right and top and 5dp below; the text form is Google Maps unchanged, on one line, at 4.5:1 against its background, and it carries an accessibility label reading Google Maps.
- Where the response credits a third-party data provider, that name is printed alongside the mark. The provider mark on its own is not attribution then.

### `map-terms` The map arrives with a contract: the notice belongs in the app's own terms and the tiles are not the app's to keep

A phone app has no page footer to carry a legal line, and its binary only changes through the store, so the notice is routed to a screen somebody can reach rather than patched in later. The phone has no room for a second copy of the provider's data either, and the offline instinct it creates is exactly what the contract forbids.

- The app's own terms name the map provider and link the provider's end-user terms and privacy policy, on a surface reachable from where the version and the report route already live (`set-diagnostics`).
- Nothing is scraped: no pre-fetching, indexing, rehosting or bulk downloading of tiles, geocodes, directions or places, and no copying of business names, addresses or reviews into the app's own store. A place leaving the app leaves as a link or a coordinate rather than a rendered picture of the tiles, which is `share-link-not-shot`.
- What may be kept is narrow, and it is written down with its expiry in `off-cache-policy`: place IDs with no deletion deadline but refreshed at 12 months, latitude and longitude for at most 30 consecutive days. The empty store on a first run with no network is `off-no-cache`.
- A user's location is not obtained or cached without their express, prior, revocable consent, which is a promise the app makes on top of the permission grant.

### Check

Review answers each of these against the code, pointing at the line:

- Every map sets an explicit initial camera framed on its own content, passes padding for anything overlapping it, carries a pan bound or a minimum zoom where the user is not meant to leave the area, and uses a written coordinate rather than zero for the frame before any location resolves. `map-camera`
- Every map inside a same-axis scrolling parent names the mechanism that assigns the drag on one side or the other, and every map with no gesture enabled is a static image or a lite-mode map rather than a live one. `map-gesture-owner`
- Marker hit areas reach the platform touch floor where spacing allows, no marker is drawn larger than its hit rect, the marker tap handler is written rather than inherited so the map toolbar is deliberately kept or deliberately disabled, and two adjacent pins at production scale are separately hittable with a thumb. `map-marker-target`
- Any map whose marker list is not a fixed small set at the call site opts into clustering or a declared overlap policy, and a cluster prints its count and expands to somewhere a person can act. `map-cluster`
- The map view and every marker built in code carry an accessibility label of their own, every place, route, area and count on the map is reachable as text one step away in the same flow, and driving that flow with the reader on reaches all of them. `map-not-alone`
- Following is a shown state on a stock control, a user pan ends it, turning it off stops the location updates, and no screen-awake flag outlives the follow. `map-follow`
- Controls, markers, labels and overlays are measured against the tiles they sit on rather than one fixed colour, and the emphasis style or colour scheme of the base map is set explicitly. `map-legible`
- Every route on a map is also a numbered step list with locale-formatted distances and street names, and no real-time turn-by-turn is assembled on a standard map SDK. `map-steps`
- A map with no tiles draws a named state with a retry that keeps the camera, anything still true offline stays drawn and marked stale, and no code pre-fetches or persists tiles except through an offline API the provider publishes. `map-offline`
- At most one live map instance exists per screen, it is released on the exit and error paths, no live map sits in a recycled row, and annotation views are reused. `map-cost`
- The map is padded for every piece of chrome overlapping it, the credit moves only through the map's own padding API and no code removes, hides, resizes, recolours or redraws it, third-party data providers named in the response are printed alongside it, and the credit stays visible with every overlay at its lowest resting position. `map-attribution`
- The app's terms name the map provider and link its end-user terms and privacy policy, nothing scrapes or rehosts provider content, and no stored latitude and longitude has a retention beyond 30 consecutive days. `map-terms`

Four of these cannot be settled from a diff. On a device, raise the sheet to its lowest resting position and look for the provider credit under it (`map-attribution`); load production-scale markers and try to hit two adjacent pins with a thumb (`map-marker-target`); measure a control against the tile beneath it in both colour schemes and in sunlight (`map-legible`); and drive the whole map flow with the screen reader on to find out whether anything past the words "Google Map" is reachable at all (`map-not-alone`), which is the run `a11y-test` asks for.

### Reaches

- `heuristics/accessibility.md`: `a11y-name`, `a11y-hidden`, `a11y-collection`, `a11y-gesture`, `a11y-test`
- `heuristics/colors.md`: `color-not-alone`, `color-contrast`, `color-dark-composed`
- `heuristics/data-display.md`: `data-units`, `data-chart-scale`
- `heuristics/icons-and-imagery.md`: `icon-alt`
- `heuristics/layout.md`: `layout-chrome`, `layout-overlays`, `layout-insets`
- `heuristics/lists.md`: `list-a11y`, `list-virtualise`
- `heuristics/localization.md`: `l10n-no-mirror`, `l10n-format`
- `heuristics/offline.md`: `off-cache-policy`, `off-no-cache`
- `heuristics/permissions.md`: `perm-scope`, `perm-rationale`, `perm-answers`
- `heuristics/scrolling.md`: `scroll-nest`
- `heuristics/sense.md`: `sense-accuracy`, `sense-off-system`, `sense-running`
- `heuristics/settings.md`: `set-diagnostics`
- `heuristics/sharing.md`: `share-link-not-shot`
- `heuristics/states.md`: `state-offline`, `state-error`, `state-retry`, `state-loading`, `state-empty`, `state-stale`
- `heuristics/touch.md`: `touch-floor`
- `heuristics/typography.md`: `type-dark`
- `heuristics/webviews.md`: `webview-surface-choice`
- `platform/background-work.md`: `bg-location`
- `platform/network.md`: `net-metered`, `net-prefetch`
- `platform/performance.md`: `perf-frame`, `perf-power`, `perf-memory`

# heuristics/media.md

## Media playback

A phone plays media in a pocket, on a commute, on a battery, on a connection somebody is paying for by the megabyte, and over a call that can arrive in the middle of any sentence. The player is the one surface in an app that has to keep working after the screen goes dark and after the user has walked away from it.

Here: the player surface, the transport controls, full screen and rotation, picture in picture, background audio, the lock screen, and what happens when something else on the device wants the speaker. Captions and anything an audio track carries alone are `a11y-media`. Whether a clip may start by itself is `motion-autoplay`. Sound the app makes outside a player is not playback and is not here.

Rules in this file, in order: `media-system-player`, `media-controls`, `media-scrub`, `media-unasked-sound`, `media-focus`, `media-noisy`, `media-background`, `media-remote`, `media-resume`, `media-pip`, `media-away`, `media-fullscreen`, `media-awake`, `media-start`, `media-quality`, `media-live`.

### `media-system-player` Play through the platform's engine, and finish any transport you draw yourself

The engine is `AVPlayer` on iOS and ExoPlayer on Android, with a wrapper over one of them in every cross-platform stack. Nothing here asks anyone to write a decoder. What varies is who draws the transport, and each system view hands over a different set: `AVPlayerViewController` and SwiftUI's `VideoPlayer` carry the route picker, the caption menu the system caption setting drives, and picture in picture once the capability is on, while Media3's `PlayerView` carries subtitles, artwork and the controls, with picture in picture and Cast wired separately beside it.

Drawing your own transport is allowed and common. What is not allowed is dropping what the system view gave you: model each control on the one it replaces, and re-provide route picking, picture in picture, the caption menu and a scrub target a thumb can hit. A control added beside that standard set earns its place by doing something the platform does not offer, such as a chapter list, a per-episode speed or a skip increment of your own. Restyling play and pause is not one. Name every icon-only button (`a11y-name`).

### `media-controls` Controls retreat, and a tap anywhere brings them back

- The video is the whole glass and there is no cursor to wake the chrome with, so the reveal target is the surface itself rather than a hotspot in a corner. The system view already reveals on a tap, already holds the controls while playback is paused, and already keeps its hide delay in one place; a custom transport re-provides all three (`media-system-player`).
- Two cases no system view gets right, and they are where the work is. Controls stay up while the player is buffering, which is the moment the user most wants to see whether anything is moving. And they do not retreat on a timer at all while a screen reader is running, because a control that has already left cannot be found again by exploring the glass.
- In full screen the controls still sit inside the safe area, which nothing insets for you once the chrome is gone (`layout-insets`).
- The system volume owns the final level and the app only balances its own tracks against each other, so no in-app master volume competes with the hardware buttons. Where a level control belongs on the screen, iOS has the system volume view for exactly that. Whether the silent switch reaches you at all is an iOS question answered by the audio session category, with no Android counterpart, and that nothing in the app moves the system volume is `sound-silenced`.

### `media-scrub` The scrubber is a thumb target and the position is text

- A progress track drawn 2 to 4dp tall is a 2 to 4dp target unless somebody widened the hit area, and this is the control people drag while walking. The scrub area reaches the floor in `touch-floor`, measured on the hit rect and never on the drawn track.
- Elapsed and total are both printed, because a position along a bar is not readable on a moving train, and both are formatted by the locale (`l10n-format`). While the finger is down the target time is shown, and the frame does not commit until the finger lifts.
- A skip control prints its increment on itself. Media3 ships 5 seconds back and 15 forward; iOS ships no default, so the number is yours and it is written down once rather than picked per screen.

### `media-unasked-sound` Claim the speaker at the moment of play, never at launch

Somebody is already listening to something. Activating the audio session or taking audio focus during startup stops their podcast for a screen that is not playing anything yet.

- The activation call sits on the play path: set the category at launch, call `setActive` when playback begins, request focus when the first sample plays. Handing the speaker back is the same path in reverse and it is the half that goes missing: `setActive(false, options: .notifyOthersOnDeactivation)` on iOS and abandoning the focus request on Android, on the stop path and on the error branch alike. Without it the other app's music never comes back, which is the bug the user actually hears.
- The category matches how the app uses sound. `.ambient` mixes with whatever else is playing and is right for incidental sound; `.playback` is for sound that has to survive the silent switch, and whether it mixes or takes the output alone is an option set on it rather than a property of the category. Media the user chose is one case for it. Occasional spoken audio over someone else's music, turn-by-turn directions or a coach counting reps, is the other, and it is `.playback` with ducking rather than a category of its own.
- Whether a surface may start by itself is `motion-autoplay`, and that it starts muted when it does is `a11y-media`. What belongs here is where that mute state lives: on the feed, not on the item. Unmuting one card and getting silence on the next is the bug; getting sound the user did not ask for on the next is the other one.

### `media-focus` Ask for the output, hand it back, and decide what happens after

`ExoPlayer.Builder` defaults to not handling audio focus, so `setAudioAttributes(attributes, true)` is a line somebody writes or the app never yields the speaker at all. Three kinds of loss, three answers, plus a fourth case: an app targeting Android 15 is refused focus outright unless it is the top app or running a foreground service, and from Android 17 playback held without focus is silenced whatever the app targets, with nothing thrown and nothing logged. The two gates are different, so the branch has to exist in both builds. Handle the refusal, because the failure that reaches the user is silence on a device where the same build sounded fine in front of you.

- **Permanent.** Pause and stay paused. No gain callback is coming, so a person is the only thing that starts it again.
- **Transient with ducking.** From Android 8 the system ducks you silently, except for `CONTENT_TYPE_SPEECH` content and apps that asked to be told instead. Speech cannot be ducked and stay useful, so speech pauses. On iOS the ducking belongs to the app that wants to be heard, not to the app being lowered: it activates its session with `duckOthers`, or with `interruptSpokenAudioAndMixWithOthers` where the sound is occasional speech over someone's music, and the system takes the other level down at activate and restores it at deactivate. The app being ducked gets no callback and writes nothing.
- **Transient.** Pause, then resume or do not, which is a decision recorded once per kind of content in `STACK.md` rather than a default. iOS publishes whether the interruption was resumable and expects a media app to check first; Android 12 and up mutes for an incoming call and unmutes when it ends. Long-form audio the user chose resumes where it stopped, and anything the user never started does not resume at all.

### `media-noisy` The headphones came out, and on Android that pause is yours to write

iOS reroutes to the speaker and pauses; the platform carries it. Android only broadcasts that audio is about to become noisy, and Media3's `handleAudioBecomingNoisy` defaults to `false`, so the shipped default is your podcast playing out loud on a bus. Turn it on, or register for `ACTION_AUDIO_BECOMING_NOISY` when playback starts and unregister when it stops. A player with on-screen controls pauses; something with no controls at all may keep going.

### `media-background` Background audio is a declared capability, a service type and a store answer

`bg-service-last` says to look for the narrower API first, and for video that narrower API is picture in picture rather than a service. For audio the service is right, and it arrives with paperwork.

- iOS: the background mode covering audio, AirPlay and picture in picture, plus the `.playback` category. Without the capability the lock screen silences you.
- Android: a `MediaSessionService`, `FOREGROUND_SERVICE` and `FOREGROUND_SERVICE_MEDIA_PLAYBACK`, and `android:foregroundServiceType="mediaPlayback"`. From Android 14 that type is also a store declaration stating the user impact of interrupting it. The service starts while the app is still on screen: one started after the user has already left is too late, and from Android 17 background audio with no service behind it is simply muted.
- The session ends when playback ends. Releasing the player clears the notification and hands back the hardware video decoder another app is waiting for, on the failure branch as well as the happy one (`perf-memory`). A media capability held open to keep the process alive for something else is what `bg-declared` refuses. How the ongoing notification reads is `notify-ongoing`.

### `media-remote` Once the screen is off, the lock screen is your player

Fill in the metadata and register the commands; the layout is the system's and you do not get to design it. `MPNowPlayingInfoCenter` with `MPRemoteCommandCenter` on iOS, `MediaSession` with `MediaMetadata` on Android, where background audio also requires a `MediaStyle` notification.

- Title, subtitle or artist, artwork and duration are all populated. On iOS that is the whole of the job, because the presentation is the system's and you do not get to choose what it shows: fill in every property you have. A blank tile on a lock screen is the app's fault and not the system's.
- The counts are Android's. The controls take up to 5 actions and only the first 3 survive the collapsed view, and how the buttons are derived changed at Android 13, so a hardcoded list of five is wrong on one side of that line. Decide which 3 matter.
- Register only the commands the app supports, and answer a transport command only while this app is the thing playing, because responding to a headset button otherwise stops someone's music from a screen they are not looking at. Tapping the tile returns to the item that is playing, not to the app's home screen.

### `media-resume` Come back where playback stopped, and say when it is paused

- The position is persisted per item while it plays rather than on the way out, because the process can be killed without a way out, and returning opens that item where it stopped instead of at zero. A queue keeps its place in the queue as well as its place in the track.
- A player that comes back paused shows that it is paused, because silent and idle reads as broken and the next move is to leave rather than to press play. On Android the playback resumption callback is answered too, so the system's own tile can restart the last item after a reboot without the app being opened first; what that tile carries once it is playing is `media-remote`.

### `media-pip` Picture in picture is what leaving the app means, and its button is conditional

An app that plays video supports picture in picture: the alternative is that a message arriving mid-episode ends the episode. On iOS it also requires the background audio capability, so it is not free.

- The affordance is drawn only after the support check passes, on both platforms, because a dead picture in picture button is worse than none. Entering and leaving reuses the same player: a fresh instance costs a black frame, the buffer and the position. Two sources must never mix, so a video moving into the window while a game's soundtrack plays underneath is the failure both platforms warn about, and one of the two has to yield.
- On Android the window is configured rather than accepted: ask the platform how many actions it takes instead of hardcoding the 3 that are a floor a device may raise, keep play and pause among them, and read back the aspect ratio you were given, because the one you request is clamped. From Android 12, auto-enter on the home gesture with a source rect hint, so leaving mid-episode needs no button at all. On iOS none of that is yours: the system draws the transport and sizes the window, and the two decisions the app makes are the support check and the background audio capability behind it.
- It is not the only route out. Where it is unsupported or refused, playback continuing while the user moves around inside the app keeps a docked bar carrying the title, play and pause, and a tap back to the full player, with the content beneath it padded to clear it (`layout-chrome`).

### `media-away` The eyes left, the ears did not

- Video with no picture in picture and no background capability pauses as the app goes away, and comes back at the same frame. The app switch itself is free (`state-interrupt`), which is exactly why nobody writes the pause and the user returns having missed a minute of the episode. Where picture in picture is available it takes the place of the pause (`media-pip`).
- Audio the user chose keeps playing, which is the whole point of `media-background`. The same event gets opposite answers on the two kinds of content on purpose, and the platforms lean opposite ways on the video half, so the answer is written down in `STACK.md` per surface rather than inherited from whichever one the code was ported from.

### `media-fullscreen` Turning the phone does not restart the video

Rotation is a configuration change, which is `state-interrupt`, and the shape of a sideways phone is `layout-orientation`. What belongs to the player is that one instance survives the turn: recreating it costs the buffer, the position, and on a metered connection the bytes a second time. Full screen keeps the controls reachable (`media-controls`) and an exit that is drawn rather than left to the back gesture.

- Never bake letterbox or pillarbox bars into the asset. One phone plays the same file full screen, embedded in a list, rotated and inside a picture in picture window, and baked padding is visible in three of those four.
- Where a custom transport picks the gravity itself, follow what the system player already does with the ratio: fill for 2:1 through 2.40:1, fit for 4:3, 16:9 and anything up to 2:1, and fit again above 2.40:1. Through the system view there is nothing to write.

### `media-awake` Keep the screen on while it is being watched, and let it go when nobody is

This is a window flag on the watched screen itself, `FLAG_KEEP_SCREEN_ON` or `android:keepScreenOn` on Android and `isIdleTimerDisabled` on iOS. It is not a wake lock, and a service cannot hold it.

Video is the common case and not the only one. A screen whose job is to be read from a distance or between touches, a running timer, a recipe step while the hands are busy, a boarding pass at the gate, directions on a dashboard mount, a presenter's notes, dims and locks at the worst moment when it does not hold the flag, and the person has to put down what they are doing to wake it. Those screens hold it while the thing they show is live, and the same screens are where hiding the system bars, with the platform's swipe from the edge to bring them back, gives the content the whole glass.

- Audio-only playback never keeps the screen on. Not needing the screen is the point of playing audio.
- Only the watched screen holds it, and only while it is live: a stopped timer, a finished route and a closed pass release it.
- It clears on pause, on stop, on leaving the screen and on the error branch, which is the deterministic end `perf-power` asks of anything holding hardware open. ExoPlayer's wake mode is a separate setting whose default is not the one you want in either direction, so set that one explicitly beside the service.

### `media-start` One second to sound, or to a sign that sound is coming

Within one second of the tap, either audio is playing or something on screen says it is being prepared. A player that looks identical for four seconds gets tapped again, and the second tap is a stop.

- The first load is `state-loading`: a placeholder in the shape of the player, not a spinner over a black rectangle. A rebuffer mid-playback is a different state. It does not tear down the controls, does not reset the position, and does not flip the play control to paused, because the user did not pause. A stream that dies instead says what failed and offers a retry that keeps the position (`state-error`, `state-retry`).

### `media-quality` The metered ceiling is set once, and the choice sticks

- `net-metered` decides what counts as metered and rules that a tap is still answered; what is left here is the number. An adaptive stream gets an explicit bitrate cap under the flag instead of being left to find its own ceiling on somebody's data plan.
- A manual quality choice outlives the item it was made on, and switching quality keeps the position rather than restarting playback.
- Downloading for later waits for an unmetered connection by default and is queued rather than tied to the screen (`off-queue`); preloading the next item stops entirely under the flag (`net-prefetch`).

### `media-live` Live has no total duration and its edge keeps moving

- Live is labelled as live, and the label does not rely on color (`color-not-alone`). No total-duration text and no percentage on a stream with no end, and where seeking back exists, a control returns to the edge and says how far behind the user currently sits.
- A live video surface the user has navigated away from inside the app, with nothing left playing it, stops rather than spending bytes on something nobody is watching. A recording is paused and kept where it stopped; a live edge cannot be. An app that has done `media-background` properly, with a session and a service behind it, is playing in the background on purpose and this does not touch it. A stall recovers by jumping to the edge rather than replaying what was missed.

### Check

Review answers each of these against the code, pointing at the line:

- Playback runs through the platform's player component, and any custom control exists for a command the system does not offer. `media-system-player`
- A tap on the video surface reveals the controls, they stay up while buffering and do not retreat on a timer under a screen reader, they sit inside the safe area, and no in-app volume control competes with the hardware buttons. `media-controls`
- The scrub hit area reaches the touch floor, elapsed and total are both text, and every skip control prints its increment. `media-scrub`
- The audio session is activated and focus requested on the play path rather than at startup, the category matches the use, and an auto-started surface starts muted with the mute state held above the item. `media-unasked-sound`
- Focus is requested at start and abandoned at stop, all three losses have a branch, the refused request has one too, and resuming afterwards is an explicit decision per content type. `media-focus`
- Playback pauses when the output becomes noisy, with the Android default flipped rather than assumed. `media-noisy`
- Background audio declares the capability, the service type and the permissions, starts the service from the foreground, and releases the player on every exit path. `media-background`
- Title, artwork and duration reach the system controls, only supported commands are registered, the Android collapsed view is designed for its first 3 actions, and the tap returns to the playing item. `media-remote`
- The position is stored per item as it plays and restored on return, a player that returns paused says so, and the Android resumption callback is answered. `media-resume`
- The picture in picture affordance is behind a support check, the window keeps the same player instance, the Android action count is read from the platform with play and pause among them, and playback that continues inside the app keeps a docked bar leading back to the player. `media-pip`
- Video with no picture in picture and no background capability pauses when the app leaves the foreground and resumes at the same frame, while audio the user chose keeps playing. `media-away`
- One player instance survives rotation and the full-screen transition, no bars are baked into the asset, and any custom transport picks its fit mode from the aspect ratio. `media-fullscreen`
- The screen-on flag is set only on a screen that is watched rather than touched, video or otherwise, only while what it shows is live, never for audio alone, and cleared on pause, stop, exit and error. `media-awake`
- Sound or a preparing indicator arrives within one second of the tap, and a rebuffer leaves the controls and the position alone. `media-start`
- A metered connection has a written bitrate cap, a manual quality choice persists, and downloads wait for unmetered. `media-quality`
- A live stream is labelled without relying on color, shows no total duration, offers a return to the edge, and stops once its surface is left with nothing playing it. `media-live`

### Reaches

- `heuristics/accessibility.md`: `a11y-media`, `a11y-name`
- `heuristics/colors.md`: `color-not-alone`
- `heuristics/layout.md`: `layout-insets`, `layout-chrome`, `layout-orientation`
- `heuristics/localization.md`: `l10n-format`
- `heuristics/motion.md`: `motion-autoplay`
- `heuristics/notifications.md`: `notify-ongoing`
- `heuristics/offline.md`: `off-queue`
- `heuristics/sound.md`: `sound-silenced`
- `heuristics/states.md`: `state-interrupt`, `state-loading`, `state-error`, `state-retry`
- `heuristics/touch.md`: `touch-floor`
- `platform/background-work.md`: `bg-service-last`, `bg-declared`
- `platform/network.md`: `net-metered`, `net-prefetch`
- `platform/performance.md`: `perf-memory`, `perf-power`

# heuristics/motion.md

## Motion

A phone shows one screen at a time, so every screen replaces the last one outright. Motion is what stops that from being a cut: it says where a thing came from, where it went, and that the tap registered. That is the whole job. Everything else is time added between a finger and the content it was reaching for, on a device where the same transition plays dozens of times a day and is paid for in battery.

Generated screens fail this in a recognisable way: motion appears everywhere except the three places it was needed, an entrance animation on content that never changed, a pulse on a badge, a fade-in on the first screenful, and no fallback at all for a person who turned movement off.

Press feedback timing is `touch-feedback`. Loading and skeleton behaviour is `state-loading`. The predictive back gesture is `touch-gestures`. Token values and per-stack API names are in `references/motion-tokens.md`.

Rules in this file, in order: `motion-job`, `motion-answered`, `motion-platform`, `motion-model`, `motion-duration`, `motion-choreo`, `motion-loop`, `motion-autoplay`, `motion-blocks`, `motion-cheap`, `motion-reduced`.

### `motion-job` Every animation answers a question, and there are three questions

Continuity: this came from that, or it went there. Latency: work is happening and here is the shape of it. Acknowledgement: your touch landed. Point at an animation and name which of the three it serves. If the answer is that the screen felt static, delete it.

The frequent interactions are already animated, and the two platforms want different things done about it. On iOS, do not add motion to a switch, a row selection or a tab change: the system tuned those and a hand-written replacement trades something tuned for something invented. On Android those same components move from the theme's motion scheme, so a build that wants them calmer or livelier changes the scheme rather than animating the component where it is used.

The count is per screen, and at rest means no work outstanding, no gesture in progress and no media playing. In that condition nothing moves, with one exception: an indicator saying work is still happening, which is `state-loading`.

### `motion-answered` The three questions are obligations, not only permissions

`motion-job` reads as a gate: point at an animation and name which of the three it serves. Read only that way it leaves the opposite case unexamined, and the screen that satisfies every rule in this file with nothing to point at is the one where a change happened and none of the three was answered. A row is there and then it is not. A value is one number and then another. A panel is shut and then open. Nothing moved, so nothing broke a rule, and the reader is left to work out from the after what the before became.

The obligation runs the same three ways the permission does:

- **Continuity** is owed by a change of place. What opens from a point, expands into a screen, or leaves toward somewhere, does it from where that thing actually is. One surface replaced outright by another has had the relationship between them deleted, and the reader rebuilds it from memory every time.
- **Acknowledgement** is owed by a touch that commits something, and the floor for it is `touch-feedback`.
- **Latency** is owed by anything the user waits on, and its shape is `state-loading`.

This is not licence to animate. At rest nothing moves, which `motion-job` settles, and an animation serving none of the three is still deleted. What changes is that a change arriving with nothing answered is a finding rather than a screen that happened to be quiet.

### `motion-platform` The transition between screens is not yours to write

Push, sheet, cover and dismissal come with motion attached. Where the container ends through a gesture, which is the interactive pop, the sheet drag and predictive back, that motion is interruptible and driven by the finger rather than played at it. A custom route transition replaces it with a fixed animation that runs to the end, and one that never reads the gesture's progress leaves the system drawing a back preview the transition itself ignores. Driving it from that progress instead is `touch-gestures`.

Custom transition code between screens (`PageRouteBuilder` with a hand-written `transitionsBuilder`, `enterTransition`, `exitTransition`, `popEnterTransition` or `popExitTransition` overriding a `composable()` destination's preset, a `UIViewControllerAnimatedTransitioning` for an ordinary push) needs a reason written next to it. Which container is right in the first place is `nav-container`.

### `motion-model` Name the platform's model, never a literal value

Two motion systems, and using the wrong one is what makes a build feel foreign.

- **iOS is spring based.** `Animation.spring(response:dampingFraction:)` or `UIView.animate(springDuration:bounce:)`, and the parameter is bounce, not a curve. Apple publishes no duration table for UI motion, so a millisecond figure attributed to iOS was invented by whoever wrote it.
- **Material ships both.** The Views library still carries sixteen duration tokens and seven easing tokens, and adds six springs beside them. The Compose Material scheme carries no duration and no easing at all: `MaterialTheme.motionScheme` exposes six specs, three spatial and three effects, in a standard or an expressive scheme, and `MaterialExpressiveTheme` defaults to expressive. Material motion on Compose is therefore reached as a spring spec. `tween` and the easing curves stay available for animations outside the Material scheme.

Spatial springs move a thing and may overshoot. Effects springs carry color and opacity, where overshoot means the value passes its own target and the color is briefly wrong.

The rule the two systems share is that no motion value is invented at the call site, the way `color-roles` allows no hex there. `spring(dampingRatio = 0.4f, stiffness = 120f)` written inline is the motion equivalent of a raw hex, and twenty of them are twenty different feels in one app. Where the value is reached from differs, and only one platform hands you a theme:

- **Android** has one, so use it: `MaterialTheme.motionScheme` on Compose, the `?attr/motionSpring*` and duration attributes in Views.
- **iOS** ships no motion theme, so the app is the one that has to hold the set. Put the named `Animation` constants in a single file and refer to them by name from every call site.

### `motion-duration` Where duration applies, it is latency, and it scales with distance

Press feedback has its own deadline, which is `touch-feedback`. What this rule owns is everything after it: a routine transition finishes inside 300ms, and past 400ms the animation stops being motion and becomes a wait, one the user pays on every navigation for the life of the app.

Duration rises with the area covered: a chip changing tint and a full screen cover arriving do not share a number. In Material terms the short tokens (50 to 200ms) carry small in-place changes and the medium tokens (250 to 400ms) carry a transition, with a full screen change at the top of that band and nothing above it. The long and extra-long tokens start at 450ms, so they belong only to motion no interaction is waiting on.

### `motion-choreo` One thing leads [P3]

When several elements move at once, the eye needs one anchor. Give the change a single subject, either an element that persists across the transition (`SharedTransitionLayout` on Compose, `.navigationTransition(.zoom(sourceID:in:))` on iOS 18, `Hero` on Flutter) or one region that moves while the rest holds still. Four independent animations at four different durations is not choreography, it is four animations.

Stagger only where the content genuinely arrives as a list, only on first appearance, and only within a budget: at most 30ms of step between rows and at most 200ms of added delay across the visible ones, so the last row is not waiting on the first. A stagger that replays on every scroll, every refresh or every filter change turns the list into a slot machine, and it re-runs on recycled rows, so it fires for rows that were already on screen.

### `motion-loop` Nothing loops next to something being read

An animation that repeats without end has no question to answer: the tap already landed, the content already arrived. Beside text, it takes the reading away from everyone and makes it impossible for some.

- Motion that starts on its own, runs longer than 5 seconds and sits beside other content needs a control to pause, stop or hide it. Motion the user is waiting on is the exception and needs no such control: a shimmer or a progress indicator is doing the job `state-loading` gives it.
- Auto-updating information gets the same control at any duration, because a figure that rewrites itself under the eye has no safe length.
- Nothing flashes more than 3 times in any 1 second.
- Every animation ends when its reason ends. One still running after its cause is gone is a bug with an animation on it.
- A parallax or collapsing header tracks the finger and never plays by itself. What is banned outright is an element pulsing to attract attention and an entrance animation on the first screenful (`layout-fold`). Content the user opened the app for is already the reason they are looking; fading it in delays it and says nothing.

### `motion-autoplay` Video and animated images start because the user started them

The longest-running motion in a real app is usually not an animation anyone wrote: it is a video preview, a looping clip or an animated image in a feed. Nothing above governs it, and muted autoplay is still motion beside the thing being read. Where the platform publishes a preference, it is read rather than assumed: on iOS `UIAccessibility.isVideoAutoplayEnabled` carries the Auto-Play Video Previews switch, and the animated images setting sits beside it.

- Where the setting is off, the asset shows its first frame with a play control and waits.
- Anything that does autoplay carries a visible stop within one step, never buried behind a long press.
- A looping asset stops when its screen goes away, rather than playing on behind whatever came next.
- The sound half is `a11y-media`, and stopping autoplay on a metered or power-saving device is `state-offline`.

### `motion-blocks` Motion never holds the user still

Nothing waits for an animation to finish. A second tap during a transition does not queue a second transition, the back gesture interrupts whatever is playing, and no input is gated on a completion callback. This matters more the more often the animation runs: a sequence that charms once is an obstacle by the fiftieth launch.

Anything the user cannot skip and did not ask for is the failure case: a splash sequence played out before the content is reachable, a success animation held for a beat after the work is done, a modal that cannot be dismissed until its entrance completes.

### `motion-cheap` Hand-written animation moves transform and opacity, not layout

The test is who owns the animation, not which property moves. The framework's own layout animations are tuned and batched, so a shared element or container transform, `AnimatedVisibility`, `Modifier.animateContentSize`, `Modifier.animateItem` and Flutter's implicit `Animated*` widgets are all correct, including where they animate bounds. What this rule bans is the hand-written kind: a value driven per frame on the main thread into width, height, margin, padding or a static offset, which re-runs measurement every frame and is how a smooth-looking animation becomes the dropped-frame complaint. The frame budget it has to fit inside is `perf-frame`, and a 120Hz panel halves it.

- React Native: `useNativeDriver: true`, or Reanimated, so the animation is not sitting behind whatever the JS thread is doing. Layout properties do not support the native driver at all.
- Compose: animating a static offset value re-runs composition and measurement, so take the lambda form of `Modifier.offset`, which defers the read to placement, or `graphicsLayer`, which defers it to draw.
- Flutter: `FadeTransition` or `AnimatedOpacity` for a fade and `SlideTransition` or `ScaleTransition` for movement. Animating an `Opacity` widget directly rebuilds its subtree every frame; `Transform` is for a static transform.
- Mobile web: `transform` and `opacity` only.

Blur, shadow and shader work stay bounded to a region, and the count of things animating at once is small enough to name.

### `motion-reduced` The reduced build still communicates, it just does not move [P1]

Reduce Motion on iOS and Remove animations on Android are settings real people turn on because motion makes them ill. Neither is answered by setting duration to zero and calling it done, and the two ask for different things, which is why one implementation cannot serve both.

- **iOS asks you to substitute.** A cross fade replaces a slide or a zoom, parallax and depth changes go entirely, springs lose their bounce, and nothing animates into or out of a blur. Check `UIAccessibility.prefersCrossFadeTransitions` before substituting a cross fade; SwiftUI reads that one through UIKit, since there is no environment value for it.
- **Android asks you to remove.** The signal is the animator duration scale, so a substituted animation will not run either. The requirement is that the screen still reads correctly with nothing animating at all, and on Compose that the scheme drops to `MotionScheme.standard()`, because nothing swaps the expressive one by itself.

Feedback survives on both, because a person who turned motion off still needs to know the tap worked.

Read the flag per stack, which is the trap: on Flutter, `MediaQuery.disableAnimationsOf` carries Android's setting and iOS Reduce Motion arrives only through `AccessibilityFeatures.reduceMotion`, so reading one silently drops the other platform's users. The names are in `references/motion-tokens.md`.

Motion is also never the only carrier of a change. Anything that says its piece by moving says nothing to the person who turned movement off, and nothing to a screen reader either.

### Check

Review answers each of these against the code, pointing at the line:

- Every animation on the screen serves continuity, latency or acknowledgement; and separately, with no work outstanding, no gesture in progress and no media playing, the only thing still moving is a latency indicator. `motion-job`
- Every change of place, every commit and every wait leaves its own question answered, and no surface is swapped for another without the two being connected. `motion-answered`
- No custom transition replaces a platform push, sheet, cover or dismissal without a written reason. `motion-platform`
- iOS motion is expressed as springs reached from one named set, Android motion through the scheme or the tokens, and no duration, curve or stiffness is a literal at a call site. `motion-model`
- Routine transitions finish under 300ms, nothing an interaction waits on exceeds 400ms, and larger movements take longer than smaller ones. `motion-duration`
- One element or region leads each transition, and any stagger runs on first appearance only, stepping at most 30ms per row and adding at most 200ms overall. `motion-choreo`
- Nothing pulses to attract attention, nothing animates in on the first screenful, self-starting motion beside other content has a pause control past 5 seconds, auto-updating figures have one at any duration, nothing flashes more than 3 times a second, and every animation ends when its reason ends. `motion-loop`
- Autoplay is gated on the platform setting, anything that autoplays has a visible stop, and a looping asset stops with its screen. `motion-autoplay`
- No input, dismissal or back gesture is blocked by an animation, and a repeated tap does not queue a second one. `motion-blocks`
- Layout properties are animated only by the framework's own layout animations, hand-written animation stays on transform and opacity, and the React Native animations declare the native driver. `motion-cheap`
- The reduced-motion flag is read on every platform the app ships to, iOS substitutes rather than deletes, and the Android screen still reads with nothing animating. `motion-reduced`

Three of these are not answered from the file. `motion-reduced` is answered on a device with the setting turned on, because a reduced-motion path that was written and never wired to the flag reads exactly like one that works. `motion-cheap` is answered half in the source, where the native driver and the animated properties are visible, and half in the frame profiler, which is the only place a dropped frame exists. `motion-blocks` is answered by tapping through a transition and pressing back during one.

### Reaches

- `heuristics/accessibility.md`: `a11y-media`
- `heuristics/colors.md`: `color-roles`
- `heuristics/layout.md`: `layout-fold`
- `heuristics/navigation.md`: `nav-container`
- `heuristics/states.md`: `state-loading`, `state-offline`
- `heuristics/touch.md`: `touch-feedback`, `touch-gestures`
- `platform/performance.md`: `perf-frame`

# heuristics/navigation.md

## Navigation

There is one surface and nothing around it. No window title, no breadcrumb trail, no second pane still holding the place the user came from: the current screen is the entire map, and whatever it says about where it sits is all the user gets.

Then the session breaks. Someone walks away mid task, the system reclaims the process to free memory, a notification drops them into the middle of the app without passing the front door. Structure is the part of the design that has to survive all three, and it is decided in the router long before anyone looks at a screen.

`STACK.md` records which navigator this codebase uses and what its destinations are. This file is about the structure those choices produce. The tab bar as a control is `button-tabs`; the back gesture, the predictive animation and the system edge zones are `touch-gestures`. Container and restoration APIs per stack sit in `references/navigation-containers.md`, for one lookup rather than a read through.

Rules in this file, in order: `nav-depth`, `nav-container`, `nav-modal`, `nav-back`, `nav-back-control`, `nav-location`, `nav-deeplink`, `nav-tab-stack`, `nav-cross-tab`, `nav-drawer`, `nav-search`, `nav-restore`.

### `nav-depth` Three levels, and the job within two taps

Destination, list, detail. Three is what someone holds in their head without a map, and a fourth needs a reason written into `STACK.md`. Count it from a top-level destination to the deepest screen reachable under it.

The other half is distance: the job this app exists for, the one named in `PRODUCT.md`, is at most two taps from a top-level destination. Depth is cheap to add in a router and expensive in a hand, because every level is another screen to re-recognise after an interruption.

A fourth level is usually a filter wearing a screen. If the new screen is the previous list narrowed, narrow the list instead.

### `nav-container` The container comes from the relationship, not from convenience

Five containers, five different relationships to what is underneath them:

| Container | What it means | How it ends |
|---|---|---|
| Pushed screen | more about the thing that was tapped | back |
| Top-level destination | another section of the app, always available | selecting another one |
| Bottom sheet | a short task or a set of options belonging to the screen under it | swipe down, scrim, back |
| Full screen cover | a self-contained task that needs the whole screen | an explicit Cancel and a named commit |
| Alert or dialog | one decision that genuinely cannot wait | choosing an answer, and on Android a back dismiss unless that was turned off on purpose |

The reflex to watch is presenting everything modally. A modal is presented rather than routed, so unless the stack gives it a route of its own it has no address and no history, and someone who leaves it cannot get back to where they were. So a **place** in the app is pushed or is a destination; only a **task**, one the user starts, finishes and returns from, gets a sheet or a cover. Settings presented as a sheet is the usual tell.

The sheet, cover or dialog carries its own primary action: `button-one-primary`.

### `nav-modal` A modal is a task, and its exit is one you drew

On a phone the modal covers its parent, so there is no visible background to click away to and no window edge to close. The only way out is the one on the screen.

- Name both exits. Cancel abandons, and the commit is the verb of the task. A lone X leaves the user guessing whether the work was kept.
- Interactive dismissal is already on, so the line to look for is the one that turns it off: `interactiveDismissDisabled`, a sheet state that refuses to hide. It belongs only where dismissing loses work, and where it appears the question appears with it, which is not the same as trapping.
- Never open a modal over a modal. The second one is a pushed screen inside the first.

### `nav-back` Back unwinds the stack and nothing else [P0]

On Android back is a system event that reaches every screen, sheet, cover and dialog, and the components dismiss the top surface with it already. That it exists and must not be swallowed is `touch-gestures`. iOS sends no such event: a full screen cover and an alert there end only through a control the app drew, which is what `nav-container` and `nav-modal` ask for. What is left here is what back means against the stack.

- Back pops the surface on top. It is not bound to a control that moves the user sideways to another destination, forward through a wizard, or backward through an edit.
- Intercepting it is allowed; ending in nothing is not. An interception resolves into a dismissal or a question, never into a screen that consumes the event and stays where it is.
- From a top-level destination that is not the start destination, back unwinds to the start destination first, and only leaves the app from there. Dropping someone out of the app from the third tab ends the session by accident. That unwinding is the stack emptying, not back being repurposed.
- Where an interception guards work that was typed and not saved, what happens to that work is `form-persist`.

### `nav-back-control` A custom back control keeps the gesture it replaced

On iOS the edge swipe that pops a screen is wired to the system's own back button. Hide that button or swap it out and the gesture leaves with it, silently: `navigationBarBackButtonHidden`, a custom `leftBarButtonItem`, `setNavigationBarHidden`. The screen still shows something that looks like back, so nothing is visible in a screenshot, while everyone who navigates by thumb has lost the fastest way out.

Keep the system control. Where a custom one has to replace it, restore the interactive pop on that screen in the same place, and make sure the replacement still reads as back rather than as a new action.

### `nav-location` Every screen says where it is

There is no window title and no breadcrumb, so a screen that names nothing leaves its position to be inferred from the content. That inference fails fastest where it costs most: three levels down, on the screen a notification just opened, in an app that was closed a second ago.

Every pushed destination carries a title naming what it is, and every top-level destination carries its own. Where more than one screen leads to this one, the back control names the destination it returns to instead of showing a bare arrow. Which top-level destination is selected stays visible throughout, which is `button-tabs`.

### `nav-deeplink` Arriving in the middle still needs everything above it

Phone apps are entered from outside constantly, and usually cold: notification, widget, share sheet, a link in a message, with the process dead and nothing in memory.

- Build the stack the user would have walked: start destination at the bottom, the linked screen on top, the ancestors in between. Android synthesises it from `navDeepLink` on the destination and React Navigation from the `linking` config, so there the answer is that the route is declared; on SwiftUI the path is rebuilt by hand, which is where this is real work. A linked screen whose back leaves the app is a dead end.
- Test from a killed process. The warm path passes by itself and hides the cold one, which is where this fails in production.
- A link that needs auth remembers where it was going and lands there after sign in, not on the home screen.
- A target that no longer exists lands on the nearest real screen and says what happened; what that screen says is `state-error`.
- The toolbar arrow on a screen entered from outside climbs this app's hierarchy. Wiring it to the same dismiss the device back calls hands the user back to the app they came from while pointing at this one.

### `nav-tab-stack` Each top-level destination keeps its own stack

Switching away and coming back returns to the screen that was left, not the root of that section. This is how people check one thing mid task and resume, and losing it costs them the work in progress on that branch.

The frameworks disagree on the default here, so it is a decision to make rather than a behaviour to inherit. Selecting the destination that is already selected is the way back to its root, and pops to it.

The stability of the destination set itself belongs to `button-tabs`.

### `nav-cross-tab` An item reached from another section opens where the person already is

Data does not respect the sections of an app. An order lists the product, a thread names the contact, a project holds its members, and each of those has a home under another top-level destination. Tapping one from here pushes its detail onto the current stack: the selected destination does not change, and back returns to the screen that was left, with its scroll and its filters intact.

Switching the tab to show the item in its home section is the tempting version, because the route already exists there. It costs the person twice. Back now lands on that section's list, which they never visited, and the screen they came from is one tab away in a state they have to rebuild. It also rewrites the other section's stack under the person who had left it somewhere on purpose, which is what `nav-tab-stack` protects.

A jump to another section is right only when the action is itself navigation to that section, "Show all in Library", and the control says so in its label.

### `nav-drawer` A drawer is not primary navigation on a phone

Navigation behind a hamburger costs a tap before it can even be read, and what people cannot see they do not use. The trigger also lives in the top corner, which is the hardest point on the screen to reach one-handed: `touch-reach`. iOS has no drawer convention at all, so a drawer there reads as a port.

Material allows the modal drawer at a phone's width, and this skill overrules that, with the cost stated: a map nobody sees, behind a control in the hard region, paid on every session. Primary destinations are visible without a tap. Where the app has more sections than the bar holds, the overflow is a destination of its own: a screen with a title and a back path, not a panel sliding over the app. A drawer that survives is a secondary surface for account switching, rare settings or a long secondary list, and every job `PRODUCT.md` names is reachable without opening it.

### `nav-search` Search becomes structure once a collection outgrows the thumb

There is no sidebar to park a filter tree in, and scanning by thumb gives out long before a list does. The trigger is what the collection is for: once people arrive at it to find one specific item rather than to browse, it needs search. Roughly 50 items is this skill's working number for where that flips, and an app whose content makes it lower or higher sets its own in `STACK.md`.

- Search that spans the app is a top-level destination with its own stack, not a screen pushed onto whatever happened to be open. Which surface it becomes, and everything inside it, is `search-surface`.

### `nav-restore` The process will be killed, and nobody asked for that

Backgrounded apps get reclaimed, on both platforms, without warning. Coming back to a different screen than the one that was left is a bug even when the process died in between.

What comes back is the place: the selected destination, its stack, the selection on the screen that was left, the filters that were applied, and the sheet that was open. Where in a collection the screen resumes is `scroll-restore`. The values in an unfinished form are `form-persist`. Saving at the moment the system says to save, and admitting anything that did not survive, is `state-interrupt`.

The cutoff is a decision rather than a default. Restore the exact place when the app was left within about the last day, and open at the root of its top-level destination beyond that, so nobody resumes into week-old content they have to work out. Record the number in `STACK.md`. Content refreshes on the way in; only the place is restored.

### Check

Review answers each of these against the code, pointing at the line:

- Hierarchy runs at most three levels below a top-level destination, or the fourth is recorded in `STACK.md` with its reason, and the app's main job is within two taps of one. `nav-depth`
- Nothing that is a place in the app is presented modally: a surface a deep link resolves to, or one that appears in the destination list, belongs in a pushed screen or a destination. `nav-container`
- Every modal names both exits, turns interactive dismissal off only where work would be lost and asks there, and no modal opens over another. `nav-modal`
- Back pops the surface on top, is not bound to a sideways or forward move, resolves every interception, and does not exit the app from a destination that is not the start destination. `nav-back`
- No screen hides or replaces the system back control without restoring the interactive pop gesture alongside it. `nav-back-control`
- Every route builder sets a title, and a back control with more than one origin names where it returns to. `nav-location`
- Every deep link target opens from a killed process with a full stack above it, survives a sign in, and fails onto a real screen. `nav-deeplink`
- Each top-level destination keeps its own stack across a switch, and re-selecting the current one pops it to its root. `nav-tab-stack`
- An item whose home is another top-level destination opens on the current stack, the selected destination does not change, and back returns to the screen it was opened from, unless the control is labelled as a move to that section. `nav-cross-tab`
- Primary destinations are visible without a tap, and every job named in `PRODUCT.md` is reachable without opening a drawer. `nav-drawer`
- A collection people come to search rather than browse either carries a search field on its own screen or is covered by an app-wide search destination that keeps its query. `nav-search`
- The destination, its stack, scroll, selection, filters and the open sheet come back after the process is killed, and the restore cutoff is a set number rather than forever. `nav-restore`

`nav-deeplink` and `nav-restore` are answered by killing the process and launching from a link, not by reading the router. A graph that looks correct in the file is exactly the one that loses the stack on a cold link.

### Reaches

- `heuristics/buttons.md`: `button-tabs`, `button-one-primary`
- `heuristics/forms.md`: `form-persist`
- `heuristics/scrolling.md`: `scroll-restore`
- `heuristics/search.md`: `search-surface`
- `heuristics/states.md`: `state-error`, `state-interrupt`
- `heuristics/touch.md`: `touch-gestures`, `touch-reach`

# heuristics/notifications.md

## Notifications

A notification is the only interface this app gets to put on a screen belonging to someone who did not open it. On a phone that screen is in a pocket, on a desk in a meeting, or on a bedside table at 3am, and it is read once, for about a second, by whoever happens to be looking at it.

So the default answer to sending one is no, and the cost of getting it wrong is not a bad screen. It is the app being switched off, along with the notifications that mattered.

The permission prompt itself is `perm-notify-ask`. This file is about what the app sends once it has one.

Rules in this file, in order: `notify-earns-it`, `notify-channels`, `notify-level`, `notify-quiet`, `notify-lockscreen`, `notify-destination`, `notify-actions`, `notify-shade`, `notify-ongoing`, `notify-badge`, `notify-inapp`.

### `notify-earns-it` Every send site names the event, and the event is the user's

Tolerance here is a single account that cannot be topped up. When it runs out people do not silence the noisy kind, they silence the app, and the transactional notification they actually wanted goes with it.

Every place in the code that posts a notification names the event behind it, and that event passes three tests:

- **It happened to this user or to something this user owns, or the user asked in advance to be interrupted at this moment.** An alarm, a calendar reminder, a dose reminder and a practice reminder all pass on the second branch, because the user scheduled or subscribed to them. Feature announcements, streaks the app invented, "we miss you" and anything measured in re-engagement fail no matter how they are worded.
- **It could not wait for the next launch.** If it could, it is `notify-inapp`.
- **There is something to do about it, or it is something the user is waiting for.** Delivered, landed, paid, approved and the emergency alert all qualify with no action attached. What fails is the send nobody was waiting for and nobody can act on.

Cross-promotion and advertising of another product sent through notifications are prohibited by the Play Store, so on Android that part is a shipping question rather than a matter of taste. Promoting this app's own product is this skill's rule instead: it needs its own opt-in inside the app, the system grant is not that opt-in, and nothing goes out until the user turns it on.

### `notify-channels` One channel per kind, so a user can silence one without silencing the app

Android has required every notification to carry a channel since API 26: post one without a channel and it does not appear at all, the system logs an error and drops it. That requirement is met by a single channel called General, which is how most apps meet it, and one channel is the same as no channels, because the only control it gives the user is off.

- Count the kinds of thing the app sends and create that many channels, named for what the user will recognise (Order updates, Mentions, Delivery status) rather than for the system that emits them.
- The importance, sound and vibration are fixed at creation and belong to the user afterwards. Nothing in the app can change them again; only the user can, from system settings. A channel created at the wrong importance is permanent for everyone who already installed, and correcting it means creating a different channel.
- iOS has no system-side equivalent. Categories, registered through `setNotificationCategories(_:)`, carry the actions in `notify-actions` and the hidden-preview text, and give the user no per-kind sound, importance or on switch at all. So on iOS the per-kind control lives on a settings screen inside the app, and the app requests `providesAppNotificationSettings` so the system offers a button straight to it.
- Do not rebuild the Android channel toggles in the app's own settings. Link to the system page for the channel, for the reason `set-system-owned` gives. A product-level preference is a different thing and stays in the app: which kinds this account wants at all, and the promotional opt-in `notify-earns-it` requires.

### `notify-level` Pick the quietest level that still does the job

iOS has exactly four interruption levels. `.passive` adds it to the list without lighting the screen or playing a sound. `.active` is the default and presents immediately. `.timeSensitive` breaks through Focus and the notification summary, but only where the user has allowed it. `.critical` bypasses the mute switch and needs an approved entitlement.

Android has five usable importance constants: `IMPORTANCE_HIGH` makes noise and peeks as a heads-up, `IMPORTANCE_DEFAULT` makes noise without intruding, `IMPORTANCE_LOW` is silent but sits in the shade, `IMPORTANCE_MIN` sits below the fold and out of the status bar, `IMPORTANCE_NONE` does not show in the shade. `IMPORTANCE_MAX` is documented as unused and is never the answer.

`IMPORTANCE_LOW` and above always reach the drawer and the launcher badge, so quiet is not invisible. `IMPORTANCE_MIN` reaches the drawer below the fold but not the status bar, and `IMPORTANCE_NONE` reaches nothing, so neither is the level for something the user is meant to find later. The two loud settings are for things a person would want to be interrupted for at that moment, which is a much shorter list than it looks. One trap worth knowing: `UNAuthorizationOptions.timeSensitive` is deprecated and is a different symbol from the interruption level that does the work.

A foreground service notification is the exception that must not go quiet. From API 26 the level lives on its channel, which is created at `IMPORTANCE_LOW` or higher, with `setPriority(PRIORITY_LOW)` covering 7.1 and earlier. Below that the system adds its own message to the drawer telling the user about the service anyway. What earns one at all is `notify-ongoing`.

### `notify-quiet` Do not engineer around Do Not Disturb

Android's Do Not Disturb has three levels: total silence blocks every sound and vibration, alarms only lets alarms through, and priority only lets the user pick which categories may interrupt. iOS Focus filters which people and which apps get through. Both are the user telling the phone what it may do, and every symbol that gets past them is gated or restricted for precisely that reason.

- Full-screen intents on Android 14 and above are limited to apps that provide calling and alarms, and Play revokes the default grant for anything else. Check `canUseFullScreenIntent()` rather than assuming it.
- A locally scheduled notification is scheduled against the device's time zone. Where the send comes from a server the client still has a job: report the current time zone alongside the push token, and report it again when it changes, or one UTC send time is the middle of the night for a share of the users every time.
- Something the user snoozed, muted or filtered stays that way. Reposting the same event on a louder channel to get past a filter is the move that ends with the whole app switched off.

### `notify-lockscreen` The first line is the whole notification, and a stranger can read it

Write it to stand alone: what happened, and who or what it concerns. There is no second glance.

- Do not open with the app's name. The system already shows it, and repeating it spends the only line there is.
- Name the specific thing. "You have a new update" is a notification that told nobody anything.
- Both platforms let the user hide previews while locked. iOS reports it through `showPreviewsSetting` and shows `hiddenPreviewsBodyPlaceholder` from the category in place of the body; Android takes a per-notification `VISIBILITY_PUBLIC`, `VISIBILITY_PRIVATE` or `VISIBILITY_SECRET`, and under private the icon and the content title can still be shown.
- So the title is written as though a stranger reads it, and the redaction is a variant written on purpose: the alternative notification attached with `setPublicVersion()`, and the placeholder on iOS. Without them the full text leaks because no visibility was ever set.
- The text still has to survive the longest translation and the largest text size, which is `type-strings`.

### `notify-destination` The tap lands on the thing the notification named

- The payload carries the destination and the identifier of its subject, so routing needs no second network call. On Android that arrives through the `PendingIntent` given to `setContentIntent()`, which every notification needs to respond to a tap at all. A push that says "new message" and opens the inbox threw away what it already knew.
- The handler reads that payload before the app renders its default destination on the warm path, and the cold one is `splash-entry`. Building the stack above the destination, the cold-start test and what happens when the subject is gone all belong to `nav-deeplink`; this rule owns the payload and the tap.
- Tapping it removes it: `setAutoCancel(true)` on Android, and on iOS the system removes a delivered notification on tap by itself. Whatever the tap resolves settles the badge with it.

### `notify-actions` Design for two actions, because two is what fits

Actions belong to the category on iOS and to the builder on Android, and they exist so the common answer does not require opening the app: reply, mark read, accept, snooze. iOS shows up to ten where there is unlimited room and at most two where there is not; Android shows up to three. The constrained presentation is the one people actually see, so two is the number to design for on both.

- Order them so the first is the safe one, which on Android is also the first button under the thumb. On a paired watch it stops being decoration entirely: the hardware gesture invokes the first non-destructive action directly.
- A conversation carries `NotificationCompat.MessagingStyle` and the direct reply action, so the answer is typed from the shade rather than in the app.
- An action completed from the shade updates the notification and the badge too, or the user does the same work twice inside the app.
- Nothing destructive and unconfirmed sits on a notification. `touch-destructive` applies with more force on a surface people tap half awake.

### `notify-shade` One event, one line, cleared once it is dealt with

- Group related notifications and post a summary: on Android, `setGroup()` on each child plus a separate summary carrying `setGroupSummary(true)` at a constant id; on iOS, the same `threadIdentifier` on every request, with `categorySummaryFormat` naming the stack. Without one, recent Android releases group on the app's behalf and the result is whatever the system decides. Group only where each child is worth reading on its own.
- Every child in an Android group carries `GROUP_ALERT_SUMMARY`, so the summary is the only thing that makes a sound. The default alerts on all of them, which turns five children plus a summary into six interruptions.
- Ten notifications about one conversation is one notification about a conversation. Update in place, by posting the same Android id again or by reusing the iOS request identifier, instead of adding another.
- One event produces one notification across all of the user's devices. Three phones buzzing at once is one bug, not three notifications, and it is settled in the service that sends rather than in the client.
- When the user handles it somewhere else, on another device or in the app itself, cancel it: by id on Android, `removeDeliveredNotifications(withIdentifiers:)` on iOS. A shade full of things already done teaches people to clear the app without reading it.
- Something that stops being true removes itself. A queue position, an offer, a match or an arrival time gets a `setTimeoutAfter()` for its lifetime, and anything already stale is dismissed rather than left there to be read as current.

### `notify-ongoing` A notification that will not go away is for work that is actually happening

Only a live event holds a permanent place in the shade: playback, a call, navigation, an upload, a delivery on its way. Anything else that stays is a banner the user is not allowed to close.

- The work runs in a foreground service posting under a non-zero id, on a channel that follows `notify-level`.
- From Android 14 the user can swipe that notification away while the service keeps running. Dismissal is not a stop signal and not a crash: the work continues, the notification is reposted when the state changes, and the app never treats its presence as where the state is stored.
- A journey with a start and an end shows how far along it is rather than repeating one static line. Android 16 has `Notification.ProgressStyle` for exactly this, which is the delivery, the ride and the route.
- iOS does this job with a Live Activity, which can only be started while the app is in the foreground. It stays active for up to eight hours and on the Lock Screen for up to twelve, so it carries a `staleDate` for the point its content stops being trustworthy and an `ActivityUIDismissalPolicy` for how it leaves. End it when the work ends instead of letting the ceiling end it.

### `notify-badge` A badge is a count of things waiting, or it is nothing

- The number is countable and actionable: unread, waiting, needing this person. A badge raised for a promotion is how badges get turned off for the whole app.
- The number is true. If it says 3 there are 3, and it matches what the app shows on opening. A count nobody believes is worse than no count.
- Using the app normally clears it. iOS sets an absolute value through `setBadgeCount(_:)`, so the app owns the number and has to set it down as well as up. Android draws its dot from the active notifications by itself, so clearing means cancelling them and a counted number needs `setNumber()`, and channels that should never count (ongoing status, media controls, alarms) carry `setShowBadge(false)`.

### `notify-inapp` Someone who never allowed notifications still has to find out

Notifications are off by default for new installs on Android 13 and above, and iOS has always required consent, so a large part of the user base receives nothing. An app that only announces things through push announces them to a fraction of its users.

- Everything the app would send has a home inside it: an activity list, an unread mark on the row, a count on a section. That surface is the product, and the notification is a shortcut to it.
- A notification arriving while the app is open is not a banner. The user is already looking, so it lands where the content lives, quietly, without taking the screen away from the task in hand. On iOS that means returning no banner or sound option from `willPresent`, which is also what happens with no delegate at all; on Android a heads-up does appear over the app's own foreground, so it is suppressed or routed into the screen instead.
- Check `areNotificationsEnabled()` on Android, and `getNotificationSettings` with its `authorizationStatus` on iOS, before treating a send as delivered.

### Check

Review answers each of these against the code, pointing at the line:

- Every call that posts a notification names its triggering event, that event happened to the user or was scheduled by the user, and anything promotional sits behind its own in-app opt-in. `notify-earns-it`
- Each kind the app sends has its own Android channel, named for the user rather than the sender and not duplicated as an in-app toggle, and on iOS the per-kind switches live in the app with `providesAppNotificationSettings` requested. `notify-channels`
- Each channel and each payload states its importance or interruption level, none uses `IMPORTANCE_MAX`, and the foreground service's channel is created at `IMPORTANCE_LOW` or higher. `notify-level`
- Nothing escalates to get past Focus or Do Not Disturb, full-screen intent use is checked at runtime, and locally scheduled sends use the device's time zone while the token registration carries one. `notify-quiet`
- Every notification's first line names the event without the app name, and anything private sets an explicit visibility with a `setPublicVersion()` or a `hiddenPreviewsBodyPlaceholder` behind it. `notify-lockscreen`
- The payload carries a destination and a subject id reached through `setContentIntent()`, the routing runs on a cold launch from a killed process, and the tap clears the notification. `notify-destination`
- No more than two actions are relied on and none exceeds the platform's ceiling, the first is non-destructive, conversations use `MessagingStyle` with direct reply, and completing an action from the shade updates the notification and the badge. `notify-actions`
- Related notifications share a group or thread with a summary, children alert with `GROUP_ALERT_SUMMARY`, repeat events update in place, and anything handled elsewhere or no longer true is cancelled or times out. `notify-shade`
- Anything persistent is a real ongoing event, the app keeps working when the user dismisses it, and a Live Activity carries a stale date and an explicit end. `notify-ongoing`
- The badge counts something the user can act on, matches what the app shows, and reaches zero through normal use. `notify-badge`
- Every notification the app sends has an in-app equivalent that works with notifications denied, and a foreground arrival lands in the content instead of presenting as a banner. `notify-inapp`

`notify-destination`, `notify-lockscreen`, `notify-shade` and `notify-ongoing` are answered on a device with the app force stopped and the screen locked, not by reading the payload builder.

### Reaches

- `heuristics/navigation.md`: `nav-deeplink`
- `heuristics/permissions.md`: `perm-notify-ask`
- `heuristics/settings.md`: `set-system-owned`
- `heuristics/splashscreen.md`: `splash-entry`
- `heuristics/touch.md`: `touch-destructive`
- `heuristics/typography.md`: `type-strings`

# heuristics/offline.md

## Offline and the local copy

A phone loses the network as a normal condition of use: lifts, tunnels, basements, aircraft, rural roads, a hotel portal that answers every request with its own login page, and a full bar of signal attached to nothing. Sessions that start, end or spend their middle in one of those are a predictable share of all sessions, not an edge case.

This file is about the copy the app keeps on the device: what is stored, for how long, what is deliberately never stored, what happens to a write made while disconnected, and what the app becomes when that copy is gone. The request itself, its timeout and its retry, is `platform/network.md`. How the screen says offline, pending or stale is `state-offline`, `state-queued` and `state-stale`. Everything here is the layer underneath those three.

Rules in this file, in order: `off-local-first`, `off-sync-scope`, `off-fresh-marks`, `off-cache-policy`, `off-reclaimable`, `off-write-mode`, `off-queue`, `off-session`, `off-destructive-offline`, `off-conflict`, `off-no-cache`.

### `off-local-first` The screen reads the store, and the network writes to the store

The local store is the source of truth for the content the app is expected to be able to show again: what the person already opened, and the core of what they come back for. A response updates the store, and the store updates the screen. For that content, nothing in the view layer waits on a request to draw its first frame.

That ordering is what makes the app usable in a lift: rendering runs at disk speed and the radio is free to answer late, or never. A screen whose state starts at loading and is only ever filled by a fetch has no offline behaviour to design, it has a spinner.

The scope is the critical subset, not every byte. A collection the device has never held still draws the placeholder in `state-loading`, and a live price, a video call or a search against a server has nothing to render from a store. What the rule forbids is content already sitting on the device, hidden behind a spinner anyway.

- Relational or paged content goes in a database (Room, SQLite, Core Data). Small settings go in a key-value store. Blobs go in files.
- The view model observes the store. A repository that hands the network result back to the caller and writes the cache on the side is keeping two truths, and they disagree the first time a write fails.
- What is deliberately not stored is a decision rather than an oversight, and it is written down beside the rest of the storage policy in `off-cache-policy`.

### `off-sync-scope` Decide what is kept on the device, how far back, and what fills it

`off-local-first` makes the store the thing the screen reads. This rule decides what is in it, which is otherwise whatever the user happened to open. Per collection in `STACK.md`: kept complete or only what was visited, how far back it goes as a count or a window, and which of two ways it fills.

- **Pull.** The app asks as a screen needs a page and a paging source backed by the store fills the gaps (`RemoteMediator` on Android). It is the simpler half and the more expensive one, and it fails in exactly the situation this file is about: a long stretch with no signal ends at a screen whose store is stale or empty.
- **Push.** The server says what changed, so the device can stay offline indefinitely on far less data. It needs a backend that supports synchronisation, which makes it a decision taken with the API rather than inside the app.

A bulk fill is deferred work: unmetered, and left to the system to run when it suits the battery (`NetworkType.UNMETERED`, `isDiscretionary`). A fill the user asked for is neither deferred nor budgeted against `net-prefetch`, which spends on the next screen of this session rather than on the working set that has to survive a tunnel.

### `off-fresh-marks` Every stored record knows when it arrived and whether the server has seen it

Two fields, not one: the time the value was written, and its origin, meaning confirmed by the server or written on this device and not yet sent. `state-stale` renders the first and `state-queued` renders the second, and neither can render what the schema does not hold.

On a device that spends part of every session disconnected, those two fields are the only things separating a cached row from a live one, and there is one screen, so the difference has nowhere else to be shown. The time comes from the record, not from a file's modification date, which says when this device wrote the file rather than when the server produced the value.

Add the version or timestamp that `off-conflict` needs at the same time. Retrofitting it is a migration that runs on data already sitting on people's phones, with no earlier value to backfill it from.

### `off-cache-policy` What is cached, for how long, and what is never cached

This rule is about what sits on disk. Write it per collection in `STACK.md`: what is stored, its lifetime, and what evicts it. A store with no lifetime grows until the OS deletes all of it at once, which is the worst moment for it to happen. The in-memory tier of the same cache is `perf-memory`, and an image cache with both tiers owes both rules.

The never-cached list goes in the same entry: a one-time code, a live price, anything the product is not allowed to keep, named once per collection rather than defended at each read. It is a privacy decision as much as a storage one, because a phone is lost, lent and handed across a counter in a way a desk machine is not.

- **Tokens are not content.** On iOS the auth token goes in the Keychain. On Android the Keystore holds keys rather than secrets, so the token is stored encrypted under a key the Keystore holds, and the sign-in credential itself belongs to Credential Manager. Either way it is never a row in the offline store.
- **Encryption at rest is already the default** for app-private storage on current versions of both platforms. What the app owes is the part the default does not do: raising the protection class where content has to stay unreadable while the device is locked (`FileProtectionType.complete` rather than the class applied automatically), and covering the two places outside app-private storage, which are anything written to shared or external storage and anything the app syncs to a backend.
- **Settings sync stores are for settings.** The platform key-value store that syncs between a person's devices is sized for preferences (iCloud's holds 1 MB in total), so content does not go in it and neither does anything the queue depends on.

None of this becomes a user-facing setting. People expect their content to be available and do not want to manage the storage of individual items.

### `off-reclaimable` Discardable storage gets discarded, and the app has to survive it

Both platforms reclaim cache locations under storage pressure: `Library/Caches` and the `URLCache` on iOS, `getCacheDir()` on Android, best-effort buckets on the web. Every read of a cached file checks that the file is still there before using it.

So nothing the user made, and nothing the queue needs, lives in a cache directory. Queued writes, drafts and downloads the user asked for go in durable app storage.

Backup follows the same line silently. Android Auto Backup always excludes `getCacheDir()`, `getCodeCacheDir()` and `getNoBackupFilesDir()` and cannot be told to include them, with 25 MB per app per user for everything else. On iOS `isExcludedFromBackupKey` resets during common file operations, so it is set on every save rather than once. On the web `navigator.storage.persist()` is a request the browser may refuse, and `estimate()` returns an approximation, so neither is a guarantee to design against.

A phone with a full camera roll is the ordinary device, not the low-storage one.

### `off-write-mode` Every write declares which of three things it is

Decide per action, in the code that performs it:

- **Online only.** It has to reach the server now: a payment, a transfer, a booking. The request still goes out and the failure is the answer, said plainly, with everything the user entered still on screen. Before the tap the control may say what the action needs, a connection, but it is not disabled by a reachability flag: `net-reachability` keeps the check out from between the tap and the socket, and `button-state` prefers a live control that answers when it is pressed.
- **Local first, then queued.** The write lands in the store immediately and is queued for the server. This is the default for anything the user authored, because the alternative is losing it.
- **Queued and droppable.** Analytics and logs. Queued, trimmed when the queue is trimmed, never surfaced to the user.

A screen where every mutation is optimistic will eventually tell someone in a tunnel that their transfer went through.

### `off-queue` The queue is durable, identified, and drained by the platform's own scheduler [P0]

- **Durable.** Rows in the database. Not an array in a view model, and not a cache directory, which `off-reclaimable` can empty between the write and the drain.
- **Identified.** The device generates the entry's id before the first attempt and reuses it on every retry, so a reply lost on the way back becomes one order rather than two.
- **Drained by the platform.** WorkManager unique work constrained to `NetworkType.CONNECTED` with `Result.retry()` on Android, a background `URLSession` or `BGTaskScheduler` on iOS, the service worker `sync` event on the web with a foreground drain behind it because Background Sync is not available in every browser. A foreground timer does not run while the app is not running, which is most of the day.
- **Ordered.** Entries drain in the order they were made, and one that depends on an earlier entry never goes before it. A create, an edit and a delete of the same record either collapse to their final state before anything is sent, or carry that dependency explicitly. Drained out of order they produce a 404 on the edit, a row resurrected after its delete, and a child whose parent never landed.
- **On the scheduler's schedule.** WorkManager backs off exponentially from 30 seconds by default, floors at 10 seconds, and ceilings at 5 hours, with the floor on repeating work under `bg-periodic`. `BGTaskRequest.earliestBeginDate` is a floor with no ceiling. Nothing in the interface promises a time.

Cancelling an entry is two operations rather than one: the entry leaves the queue, and the local write it made is reversed. Whether pending work is shown on the item or on a surface of its own is `state-queued`.

### `off-session` A token that could not be refreshed is not a sign-out

Refreshing needs a server, so a token that expires on a disconnected device says nothing about whether the person is still signed in. Treating it as a sign-out clears the store the rest of this file rests on and turns a lost signal into lost work.

- An expired token with no path to the server leaves the app in its cached form: content still renders, writes still queue, and the credentials are exchanged again on the next request that reaches. Signing the user out is what happens when the server refuses the refresh, never when it cannot be asked. `net-backoff` owns the refresh itself.
- Sign-out is the other half. A queue with entries in it is drained first, or discarded with the user told what is going, and only then is local data cleared. Wiping the store on the way out deletes work the person watched the app accept.

### `off-destructive-offline` A delete is answered by how far it reaches, not by whether it is queued

`state-queued` settles that destructive actions do not queue silently. What is left is which of two mechanisms covers a given delete, and they are not both owed on the same one.

The default is the local hold. Mark the record deleted on the device, take it out of the list, and let the drain be what makes it final. While it is still there the undo `touch-destructive` prefers is still open, so nothing has to be asked, and the queue entry is cancelled the way `off-queue` cancels any other.

What earns a confirmation is reach. A removal on a synced account lands on every device the person owns, which is as true on a full signal as it is in a tunnel, so it is asked at the tap in both, and only where the hold cannot take it back. The wording of that confirmation is `touch-destructive`. What is forbidden is the silent version: the row disappears, the queue carries it away, and the user finds out on another device a day later.

### `off-conflict` Somebody's edit loses, and it is never the one still on screen

Two devices, one account, both edited. Resolve automatically wherever the shape of the data allows it, and design the rest.

- The strategy is written down per collection. Last write wins is a choice that needs version or timestamp metadata to work at all, not the accident of which request arrived first.
- The losing version is kept, and the person is told about it in a quiet, non-blocking marker with a way to open both. Silently discarding the copy the user typed is the failure this rule exists to prevent.
- Resolution happens as early as the app can detect the collision, before more work is poured into a version that is about to lose.
- Not an alert, and not at launch. An app that opens onto a modal about sync has spent the user's first tap on its own plumbing. Show the stored copy with the marker on it.

### `off-no-cache` The empty store happens twice, and one screen answers both

It happens on first launch, and it happens again after the OS reclaimed everything under `off-reclaimable`. That is the same screen, reached by the same code path, and it must be reachable in testing by clearing app storage rather than only by reinstalling.

What it renders is one of two states, and which depends on whether a request can still be made: `state-empty`'s nothing yet on a first launch with a working connection, and `state-offline`'s fourth state when there is no connection to fill it from. What this rule adds is on the storage side: the path is not gated on a first-run flag, and whatever that screen stands on (seeded rows, the app's own help) ships inside the binary, so it is there to be read at the moment the store is not.

### Check

Review answers each of these against the code, pointing at the line:

- The view layer observes the local store, and content the device already holds renders without waiting on a request. `off-local-first`
- Every collection names what is kept on the device and how far back, whether it fills by pull or by push, and bulk fills run deferred and unmetered while a user-requested one does not. `off-sync-scope`
- Every cached record carries a written-at time and a synced or pending origin, plus the version conflict resolution needs. `off-fresh-marks`
- Every collection on disk has a written lifetime and eviction rule, every collection deliberately not stored is named beside them, the token sits in the Keychain or encrypted under a Keystore key rather than in the store, content that must be unreadable on a locked device raises its protection class, and none of it is exposed as a user setting. `off-cache-policy`
- No queued write, draft or user-requested download lives in a cache directory, and every read of a cached file handles the file being gone. `off-reclaimable`
- Every mutation is one of the three modes, and the online-only ones attempt the request and fail with the input kept rather than being disabled ahead of the tap. `off-write-mode`
- Queue entries are rows in durable storage with device-generated ids reused across retries, drained in order by the platform scheduler with dependent writes collapsed or chained, with no promised time in the interface, and cancel removes the entry and reverses its local write. `off-queue`
- A refresh that fails for want of a network leaves the session and the store intact, and a sign-out drains or explicitly discards the queue before clearing local data. `off-session`
- A delete stays reversible on the device until the drain makes it final, and a removal that reaches the person's other devices is confirmed at the tap whether or not there is a connection. `off-destructive-offline`
- The conflict strategy is written down per collection, the losing version is kept and surfaced quietly, and nothing resolves by discarding what the user typed. `off-conflict`
- Clearing app storage lands on the same screen as a first launch, and that screen shows bundled content rather than a blank. `off-no-cache`

Test the last five with the device actually offline. Airplane mode on a warm app, a write made in it, a force quit, then reconnect, is the one pass that exercises the store, the queue and the drain together. What it proves differs by platform, so read the result accordingly: WorkManager carries on with the app gone, while a kill by the user on iOS stops background transfers until the app is opened again, which is `net-upload`, so there the pass is that the drain resumes at the next launch with nothing lost.

### Reaches

- `heuristics/buttons.md`: `button-state`
- `heuristics/states.md`: `state-offline`, `state-queued`, `state-stale`, `state-loading`, `state-empty`
- `heuristics/touch.md`: `touch-destructive`
- `platform/background-work.md`: `bg-periodic`
- `platform/network.md`: `net-prefetch`, `net-reachability`, `net-backoff`, `net-upload`
- `platform/performance.md`: `perf-memory`

# heuristics/onboarding.md

## Onboarding

The first run is the only session where the user has no reason to stay. The app was installed a minute ago, it is competing with everything else on that home screen, and deleting it costs one long press. Every screen between the icon and the first real action is a screen someone can quit on.

So the first run is designed as a sequence and measured as one: what the system draws before the app exists, what gets explained, what gets deferred, when identity is asked for, and what the user is finally standing on when it ends.

The shape of a permission request is `perm-rationale`. The screen a new account lands on is `state-empty`. The surface the system draws before any of this runs is `heuristics/splashscreen.md`.

Rules in this file, in order: `onboard-splash`, `onboard-screens`, `onboard-in-place`, `onboard-defer`, `onboard-ask-order`, `onboard-look-first`, `onboard-account`, `onboard-first-action`, `onboard-resume`.

### `onboard-splash` A branded moment goes inside the app, never in front of it

If the product genuinely needs a branded frame, it belongs at the head of the first run, after launching has finished. This is a screen the app draws, so everything about it is the app's decision, and there is only one thing to decide well: how little of the user's time it takes.

- It is short enough that skipping it would not be a feature, and nothing the user came for is waiting behind it. A branded sequence played out before the content is reachable is the failure case in `motion-blocks`.
- It runs on the first run and not on later launches. A brand gate paid once is a decision; paid five times a day it is the slowest part of the product.

### `onboard-screens` Three panels of explanation is the ceiling, and skip is on every one

Count the full-screen panels between launching and the first real screen. Three is the ceiling this file sets, no platform states a number, and zero is a legitimate answer for an app whose home screen explains itself.

- Each panel shows the product actually doing the thing. A drawing and a slogan is what a generated first run reaches for by default, which is why the three-dot pager of stock illustrations is the single most recognisable first-run shape there is. If a panel would work unchanged in a competitor's app, it is not carrying anything.
- Skip is visible on every panel, meets `touch-floor`, and lands on the app rather than on a sign-in screen.
- Skipping is permanent. The flow does not come back on the next launch, and it stays reachable from settings or help for whoever wants it later.
- A first run of more than one step says where the user is in it, through a pager or a progress indicator that cannot be mistaken for decoration or for something to tap. Someone who can see two steps left finishes them; someone counting an unmarked sequence quits. Where the steps are fields, `form-steps` owns the rest.
- The panels are content, so they reflow at the largest text setting rather than clipping the button off the bottom: `type-scaling`.

**Default.** Three panels at most, and none where the first screen explains itself.
**Exception.** A first run that is setup and not explanation: pairing a device, importing an account, choosing what a feed is built from. Those steps are the product's first real action and they take as many screens as the task has steps, under `form-steps` and `onboard-resume`. The ceiling counts panels that only explain.
**Reason required.** What each step beyond the third collects or connects, and that the app cannot do its job without it.

### `onboard-in-place` A tour is what gets built when the interface does not explain itself

Nobody remembers a slideshow about an interface they have not used yet, and a phone has no hover to hang a hint on. Teach at the control, at the moment it first matters.

- One tip at a time, one or two sentences, pointing at something visible on the screen the user is already on.
- A feature that needs more than three actions explained is not a tip. It is a screen that needs redesigning.
- A tip is dismissible and never blocks the thing it describes. Coach marks that have to be tapped through in order are a tour with a spotlight on it.
- Do not teach the phone. Scrolling, tabs, back and the share sheet were understood before the app was installed.

### `onboard-defer` Only what the first use needs happens before the first use

Sort the setup into two lists: what the app cannot start without, and what can be defaulted now or answered later. The second list is longer than it first looks, and everything on it that stays in the flow is a screen paying rent it does not earn. These screens are read one at a time on a device where the exit is a home swipe, and anything the first run downloads arrives on whatever data the user is standing in.

- Ship a working default instead of asking, which is `set-default-first`.
- No rating prompt and no purchase ask before the user has seen the product work.
- The first run does not wait on a download. Content packs, models and offline data arrive in the background while the app is already usable.
- Terms and licensing are not one of the three panels. Where consent is legally required it is one line with a link at the point it applies, not a wall to scroll to the bottom of.

### `onboard-ask-order` A permission dialog during the first run is the exception, and it costs a screen

Both platforms want the ask attached to the feature, and the system gives the app roughly one chance per permission. What the explanation says is `perm-rationale` and `perm-purpose-string`. What this rule owns is when it happens, and what the one screen allowed in front of a first-run dialog is shaped like.

- Count the system dialogs raised between the app icon and the first real screen. The answer is zero, unless the resource is required for the app to function, in which case it is one, with its explanation in front of it.
- The notification prompt is not that dialog. It attaches to the moment the user makes something worth being told about, which is after the first real screen by definition: `perm-notify-ask`.
- The one explanation screen this rule puts in front of a first-run dialog has a single button, worded under `copy-rationale`, and no exit that skips the alert. A decline control sitting there is a rehearsal for dismissing the system alert behind it.
- A refusal reaches the reduced app that `state-permission` defines, not a wall and not a retry: `perm-no-coercion`.

### `onboard-look-first` Let them look before they sign up

The account screen is the most expensive screen in the app: it arrives before anything has been earned, it needs a keyboard on a device that is bad at typing, and uninstalling is one tap away.

- An account is required only where the core job needs an identity: syncing, paying, posting, or anything involving another person. Reading, browsing, searching and trying are not on that list, and a store requires access without a login where they are the app.
- The ask attaches to the moment: sign in at the save, at the checkout, at the post. In a shop the account comes after the purchase, not before the catalogue.
- Whatever was made before signing in is still there afterwards. Losing the first note to the sign-up is the last thing that app ever gets to do.
- The sign-in screen says in one sentence why the account exists and what it gets them. "Sign in to continue" is not that sentence.

### `onboard-account` Offering account creation signs the app up for the rest of it

- Deleting the account happens inside the app, and the route to it is findable rather than buried in a policy page. Where a social or federated login is offered, disconnecting it is in the app too, and deleting the account revokes the tokens that login issued. This is a store requirement, not a courtesy.
- The App Store requires that a third-party or social login not be the only option: an equivalent has to sit beside it that takes only a name and an email address, lets that address stay private, and does not collect in-app behaviour for advertising. That requirement lifts for an app whose users sign in with an existing enterprise or education account, for a government or industry-backed citizen ID, and for a client whose whole job is one named third-party service the user signs into to reach their own content.
- Get there through the platform's own credential UI rather than a hand-built form: Sign in with Apple and passkeys on iOS, Credential Manager on Android, which puts passkeys, saved passwords and federated accounts behind one entry point. What appears first on that screen is `form-autofill`. Neither platform wants an invented authentication scheme, and password-only is below the floor on both.
- The two platforms want different arrangements and both are satisfiable: on iOS the Sign in with Apple button is no smaller than any other sign-in button on the screen and is visible without scrolling to it; on Android one button opens the system sheet and the providers live inside it.
- Collect the minimum at creation. Anything else is asked later, marked optional, and refusing it locks no feature.
- Recovery is on the screen, not behind a support address. A password or a device is going to be lost.
- Someone who already has an account and is setting up a new phone arrives signed in and past the first run: Restore Credentials through Credential Manager on Android, the platform credential store on iOS. Making an existing user re-authenticate by hand on a new device is the same defect as showing them the first run twice on the old one.

### `onboard-first-action` The first run ends on the product's own action

Run it on a device from a clean install and count the taps between the icon and something real. That count is a design decision somebody makes on purpose or inherits by accident, and every screen this file argues about is one line of it.

- Real means the product's action, not the app's: a note written, a track played, a receipt scanned. Finishing the tour is not an action.
- Where the law puts a gate in front of that, identity or age verification, the gate is named as one and designed as one. It is not onboarding to be trimmed, and it is the one thing `onboard-defer` cannot defer.
- A first run that completes into a blank home screen has failed with a perfect completion rate. That landing screen is the first-use empty from `state-empty`.

### `onboard-resume` A killed process resumes the step, never the flow

The system reclaims backgrounded apps without asking, and a setup flow is exactly where a user leaves to fetch a code from another app.

- Persist the step as it completes, not a single flag at the end. Coming back to panel one after finishing panel three is how a half finished setup turns into an uninstall.
- The done flag is written the moment the flow is completed or skipped, and it is read before anything is drawn, so nobody sees the first run twice.
- Where the user lands is `nav-restore`, what they typed is `form-persist`, and the save points are `state-interrupt`. What this rule owns is the step index and the flag.
- A notification or a link can arrive before the first run has ever happened. That path opens its destination without replaying the flow: `nav-deeplink`.

### Check

Review answers each of these against the code, pointing at the line:

- Any branded frame sits after launching, is brief, blocks nothing, and does not run on later launches. `onboard-splash`
- Three or fewer explanation panels, each showing the real product, with skip on every one, skip permanent, progress shown wherever there is more than one step, and the flow findable afterwards. `onboard-screens`
- Teaching happens at the control it applies to, one tip at a time, dismissible, never blocking, and nothing explains the phone. `onboard-in-place`
- Every setup step left in the flow is one the app cannot start without; the rest have defaults, and no rating, purchase, download or licensing wall sits in the path. `onboard-defer`
- Zero system permission dialogs before the first real screen, or exactly one for a resource the app cannot function without, behind a single-button explanation screen, with a refusal reaching the reduced app. `onboard-ask-order`
- The app can be used before an account exists, the sign-in attaches to the feature that needs it, work made beforehand survives it, and the screen says why. `onboard-look-first`
- Account deletion and social disconnection are both reachable in the app, any social login has an equivalent beside it or falls under a named exemption, credentials go through the platform's own UI, a new device restores the session, and only required data is collected at creation. `onboard-account`
- The first run ends on the product's own action rather than a blank screen, with any legal gate named as one. `onboard-first-action`
- The step is persisted as it completes and the done flag is read before the first draw, so a process kill resumes the step and a second launch shows nothing. `onboard-resume`

`onboard-splash`, `onboard-first-action` and `onboard-resume` are answered from a clean install on a device, in both appearances, with the process killed mid flow the way the system would kill it. None of them can be settled by reading the router, because a flow that is correct in the file is exactly the one that starts over from panel one.

### Reaches

- `heuristics/copy.md`: `copy-rationale`
- `heuristics/forms.md`: `form-steps`, `form-autofill`, `form-persist`
- `heuristics/motion.md`: `motion-blocks`
- `heuristics/navigation.md`: `nav-restore`, `nav-deeplink`
- `heuristics/permissions.md`: `perm-rationale`, `perm-purpose-string`, `perm-notify-ask`, `perm-no-coercion`
- `heuristics/settings.md`: `set-default-first`
- `heuristics/states.md`: `state-empty`, `state-permission`, `state-interrupt`
- `heuristics/touch.md`: `touch-floor`
- `heuristics/typography.md`: `type-scaling`

# heuristics/payments.md

## Payments

Taking money on a phone is the one design problem where a wrong decision is not a bad experience but a rejected build. Two store policies decide which payment rail is even legal for a given item, and they decide it by what is being sold rather than by what the team would prefer to integrate.

Everything after that is a form on a small screen, held by someone who is about to hand over money and is looking for a reason not to.

Rules in this file, in order: `pay-rail`, `pay-steering`, `pay-wallet-first`, `pay-sheet`, `pay-total`, `pay-price-source`, `pay-subscription-terms`, `pay-cancel`, `pay-restore`, `pay-card`, `pay-handoff`, `pay-outcome`, `pay-honest-paywall`.

### `pay-rail` What is being sold decides the rail, and it is not a preference

Answer this before drawing anything, because it determines the whole screen.

- Digital content or functionality consumed inside the app, which includes subscriptions, in-game currency, levels, premium content and unlocking a full version, goes through the store's own billing. Both stores require it. A licence key, a QR code or a redeemed voucher used to unlock the same thing is the same violation wearing a costume.
- Physical goods, and services consumed outside the app such as transport, delivery, cleaning, tickets to a live event or a gym membership, must NOT use store billing. These take a normal processor, a wallet or a card.
- Real-time services between two individuals, such as tutoring or a consultation, may use another method. One-to-many does not.

Getting it backwards is a rejection in both directions: store billing on a taxi ride is as wrong as a card form on a game level. When the app sells both kinds, it carries both rails and picks per item rather than per screen.

### `pay-steering` A link to your own checkout is a storefront question, not a design choice

On the United States storefront an iOS app may include buttons, external links and calls to action pointing at the developer's own purchase page, with no entitlement. In other storefronts the same link is either gated behind an entitlement or prohibited outright, and Play runs its own enrolment programs for leading users out.

So the link is conditional on the storefront the app is actually running in, decided at runtime. An app that ships one link everywhere passes review in one country and fails in the rest, which is the common way this rule is broken. Record in `STACK.md` which storefronts the build enables it for.

### `pay-wallet-first` The wallet is why paying on a phone is bearable

A saved card in the platform wallet turns a two minute typing session into one authentication. Treat it as the default path, not as one option among several.

- Where wallet credentials exist, the wallet button is the primary payment option, not a peer sitting beside a card form.
- It is not a separate step or a separate flow reached from somewhere else.
- It is no smaller than the other payment buttons and does not require scrolling to find.
- Use the platform's own button API. A redrawn copy of it is both a policy violation and the shape a phishing screen takes.
- Every choice the purchase depends on, such as size, colour, shipping method or pickup location, is settled before the sheet appears, because the sheet is not the place to go back and change one.

### `pay-sheet` The system purchase sheet belongs to the system

The confirmation sheet exists to stop accidental purchases, and the platform is explicit that it must not be modified or replicated. A hand-built screen that looks like it is asking for the store password is the single most dangerous thing in this file.

The app's job is what comes before the sheet and what happens after it. The sheet itself is not styled, not wrapped, not preceded by a lookalike, and not dismissed programmatically.

### `pay-total` The total is visible before the commitment, not after it [P1]

State the full amount to be billed for anything on offer, of any type. On a phone the surprise arrives late, because the screen is short and the fee lands at the bottom.

- Shipping, tax and every fee are visible on the screen where the user commits, not one step later.
- Currency, grouping and decimals come from the locale, which is `l10n-format`, and figures in a column align under `type-strings`.
- Rounding never flatters: `data-precision` owns what a displayed number is allowed to imply.
- The price is not smaller than the button next to it, and it does not need a scroll to reach.

### `pay-price-source` The price is read from the store, never written in the app

Every price on screen comes from the product object the store returns for that user, already formatted for their storefront. Not a constant, not a config file, not a string in the component.

A price typed into the code is wrong in every currency but one, and it is wrong in that one too the moment the price changes, a regional price is set, a sale runs, or tax is included differently. What the user reads and what the system sheet charges then disagree, which is a rejection, a refund, and a support thread.

It is the easiest defect to introduce and the hardest to see in review, because a hardcoded price renders perfectly on the reviewer's device.

- The amount, the currency and the formatting are the store's, taken from the product query. The app does not build the string, convert a currency, or append a symbol.
- A struck-through "was" price is only the store's own reference or introductory price. Inventing one to show a discount is promoting a false price, which guideline 2.3.1(a) makes grounds for removing the app and terminating the account, and `pay-honest-paywall` owns the rest of that shape.
- The product query is a network call that is slow, fails, and returns fewer products than asked for. The screen needs a loading state and a failure state under `state-loading`, and neither of them is a placeholder amount.
- A product the store did not return is not for sale on this device, and it does not render as a disabled row with a price beside it. Separate that from a query that failed: Play reports each product it could not fetch with a reason for the failure, and a transient one is `state-error` on the paywall rather than an item silently vanishing from it.
- The same rule holds for anything derived from the price, including the per-period figure on an annual plan and any "save 30%" badge.

Search for a currency symbol in the view layer. Every hit is either this defect or a comment.

### `pay-subscription-terms` A subscription screen has required contents

Before anyone can subscribe, the screen carries the subscription name, the period, what the money buys during each period, and the billing amount localised for the storefront being sold to. Also on that screen, not one level deeper, a way for an existing subscriber to sign in or restore.

- A free trial says plainly that a payment starts automatically when it ends, and when that is.
- An introductory price states the intro amount, how long it lasts, and the standard price that follows.
- Changing an existing app to a subscription does not take away what current users already paid for.

### `pay-cancel` Cancelling is easy or the app is hostile

The platform owns the actual cancellation screen, so the app links to the system page rather than rebuilding it, which is `set-system-owned`. What the app owns is whether that link is findable.

A manage-subscription entry buried several levels down reads as obstruction, and it is called out as such by the platform. It belongs where someone looks for it, next to the account exit that `set-account-exit` places. Cancelling a subscription and deleting an account are different actions with different consequences, and `auth-delete` owns the second.

### `pay-restore` Restore exists, or a paying customer is locked out

A reinstall, a new device, a factory reset and a sign-in from another platform are all normal. Any restorable purchase needs a restore path, and the paywall is one of the places it is reachable from.

Restore is a labelled control, not a hidden gesture, and it reports what happened: restored, nothing to restore, or failed with a reason under `state-error`. A paywall with no restore turns an existing customer into someone being asked to pay twice.

### `pay-card` When a card form is the legal rail, it is still a form on a phone

Typing sixteen digits with a thumb is the most expensive interaction in the app.

- Autofill and card scanning are the primary route, which is `form-autofill`, and the fields carry the right keyboard and content type under `form-input`.
- One column, the number field first, expiry and code side by side only if both stay above the width `layout-column` allows.
- Nothing typed is lost when a payment is declined, which is `form-persist`. Re-entering a card after a failure is where the sale dies.
- Ask for what the network actually needs and nothing else. A billing address collected out of habit is three more fields.

### `pay-handoff` The payment that leaves the app has to come back

Strong authentication, a bank app, a wallet redirect or a browser step takes the user out of the process mid transaction, and the app may be killed while they are gone.

- Treat it as an interruption that must survive, which is `state-interrupt`, with the pending order held where the system can save it.
- The return arrives as a link and is routed under `nav-deeplink`, landing on the outcome rather than on the home screen.
- Design for the user who never comes back. The payment may have succeeded anyway, so the app reconciles on next launch rather than assuming failure.

### `pay-outcome` Pending is a real answer, and a retry must not charge twice [P0]

A payment has four outcomes, not two: succeeded, failed, still pending, and reversed later by a refund or a chargeback. Each gets a state under `state-set`.

- A result the app does not yet know is shown as pending with what happens next, never as success and never as a spinner without an end, which `net-timeout` bounds.
- Every attempt carries an idempotency key so a retry, a double tap or a reconnect cannot bill twice. This is the payment case of `net-dedupe`, and here the cost of getting it wrong is money.
- A receipt is reachable after the fact, from inside the app, without searching an inbox.

### `pay-honest-paywall` The paywall is where scam patterns get apps removed [P1]

Tricking someone into a subscription is grounds for removal from the store, and the patterns are well known enough to be worth naming.

- The close control is visible, reachable and meets `touch-floor`. A paywall that has to be escaped by a system gesture is the pattern the rule exists for.
- Terms are legible at the size everything else is, not in the smallest type on the screen.
- The selected plan is the one the user picked, not a pre-selected annual with the monthly option one tap away in grey.
- No invented urgency: a countdown that resets on relaunch is a lie the screen tells.
- What the user gets is described before the price is asked for, and `onboard-look-first` already rules that people may see the product first.
- Purchases involving children carry the same restraint `ads-children` demands.

### Check

Review answers each of these against the code, pointing at the line:

- Each purchasable item is on the rail its type requires, store billing for digital goods consumed in the app and an outside processor for physical goods and outside services, with both present where the app sells both. `pay-rail`
- Any link to an external purchase page is conditional on the storefront at runtime, and the enabled storefronts are recorded. `pay-steering`
- The wallet button is the primary payment option where credentials exist, drawn by the platform API, no smaller than the alternatives and visible without scrolling, with all purchase options settled before the sheet. `pay-wallet-first`
- No screen imitates, wraps or precedes the system purchase sheet with a lookalike. `pay-sheet`
- The full billed amount, including shipping, tax and fees, is on the screen where the user commits, formatted for the locale. `pay-total`
- Every displayed price, and everything derived from one, comes from the store's product object, with a loading and a failure state instead of a placeholder amount and no invented reference price. No currency symbol appears in the view layer. `pay-price-source`
- The subscription screen carries name, period, what is included, the localised price, restore or sign-in, and the automatic charge at the end of any trial. `pay-subscription-terms`
- A link to the system cancellation page is reachable from the account area rather than buried. `pay-cancel`
- A labelled restore control exists, is reachable from the paywall, and reports its result. `pay-restore`
- Card fields use autofill and the right keyboards, sit in one column, and survive a declined payment with the input intact. `pay-card`
- A payment that leaves the app holds its pending order across the trip, routes the return to the outcome, and reconciles on next launch when the user does not return. `pay-handoff`
- Pending is a rendered state, and every attempt carries an idempotency key so no retry can bill twice. `pay-outcome`
- The paywall has a visible close control meeting the touch floor, legible terms, no pre-selected plan the user did not choose, and no countdown that resets. `pay-honest-paywall`

`pay-rail` and `pay-steering` are answered against the store policy that applies to the item and the storefront, not against taste. When the two rails disagree with a product decision, the policy wins and the product decision changes.

### Reaches

- `heuristics/ads.md`: `ads-children`
- `heuristics/auth.md`: `auth-delete`
- `heuristics/data-display.md`: `data-precision`
- `heuristics/forms.md`: `form-autofill`, `form-input`, `form-persist`
- `heuristics/layout.md`: `layout-column`
- `heuristics/localization.md`: `l10n-format`
- `heuristics/navigation.md`: `nav-deeplink`
- `heuristics/onboarding.md`: `onboard-look-first`
- `heuristics/settings.md`: `set-system-owned`, `set-account-exit`
- `heuristics/states.md`: `state-loading`, `state-error`, `state-interrupt`, `state-set`
- `heuristics/touch.md`: `touch-floor`
- `heuristics/typography.md`: `type-strings`
- `platform/network.md`: `net-timeout`, `net-dedupe`

# heuristics/permissions.md

## Permissions

A permission is a question the operating system asks on the app's behalf, in a dialog the app cannot restyle, usually once. The app writes one sentence inside it and gets a word back. A wrong answer is expensive to reverse: the user has to leave the app, find it in a system settings list and come back, so most of them never do.

That makes the ask itself a design object. What is asked for at all, at which moment, after what explanation, and what the app becomes when the answer is no or half a yes.

`state-permission` already covers denial as a screen state. This file covers the request.

Rules in this file, in order: `perm-inventory`, `perm-ask-less`, `perm-scope`, `perm-rationale`, `perm-purpose-string`, `perm-answers`, `perm-recheck`, `perm-no-coercion`, `perm-notify-ask`, `perm-tracking`.

### `perm-inventory` Every permission traces to a feature the user can point at

The declared set is public. On Android the Play listing shows it before install, on both platforms the system permission screen shows it after, and store review reads it against what the app claims to do. Each entry is a cost paid whether or not the prompt ever fires.

Name the feature behind each entry, and hold each class to its own standard: a runtime permission needs a feature the user can point at, an install-time one only has to be used at all. Anything left unnamed goes, including whatever a library, a template or a starter project dragged in: a dependency that declares location does not give the app a reason to have it. A permission for a feature that was removed leaves with the feature.

The source manifest is not the answer, because library permissions arrive through manifest merging and never appear in it. Read the merged manifest report under the build outputs, or the effective list on an installed build, and the `Info.plist` inside the built app rather than the one in the project.

### `perm-ask-less` The right answer is usually a component that asks for nothing

Both platforms ship system UI that runs outside the app, hands back exactly what the user picked, and needs no permission at all. Reaching past it for the permission is the most common way an app asks for more than it needs.

| What the app needs | What it uses instead of a prompt |
|---|---|
| existing photos or videos | the system photo picker: no library authorization on iOS, none of the media permissions on Android, available from Android 11 and backported below it |
| a document or a file | the system document picker |
| a location for one task | the system location button on iOS; or, inside the standard dialog, the user's own "Allow Once" on iOS and "Only this time" on Android from Android 11 |

Raw access is for when the capture surface is the feature: a scanner drawing its own frame, a recorder showing its own level. Picking an existing image is never that.

Where library access is genuinely needed it is still partial: iOS has a limited state where the user chooses the visible subset, and Android 14 adds a selected-photos grant beside allow-all and deny. In both, what the app can see is a subset the user can change later, so the code reads a set that may shrink between launches.

- A subset is grown in place, not by asking again for everything. Re-open the picker for more items on Android; on iOS 18 `ContactAccessButton` and `contactAccessPicker(isPresented:completionHandler:)` widen a limited contacts grant with no prompt at all. Widening is the third answer beside grant and deny, and the only route out of a subset that turned out too small.
- An app on limited photo access owns its own re-prompt. Set `PHPhotoLibraryPreventAutomaticLimitedAccessAlert` and raise the selection change at the point the user is looking for more photos, or the system raises that alert at launch on the app's behalf and the user reads it as the app nagging.

### `perm-scope` Ask for the level the feature uses, not the level that would be convenient

Every permission with a strong and a weak form gets the weak one first.

- Location, declared: coarse always, fine only where the feature genuinely benefits from it. Precise is defensible for turn-by-turn and pointless for a weather panel or a nearest-store list.
- Location, requested: accuracy is the user's choice inside one system dialog on both platforms, never a staged pair of asks. Android takes `ACCESS_FINE_LOCATION` and `ACCESS_COARSE_LOCATION` in a single runtime request and ignores a fine-only one. Escalating to precise is that same paired request again on Android, and `requestTemporaryFullAccuracyAuthorization(withPurposeKey:)` on iOS, each carrying its own reason.
- Location, scope: when-in-use before always. Background location is its own later ask from Android 10, and it never rides along with the first one.
- Photos: add-only when the app only saves. That is a distinct key on iOS, and on Android from 10 writing through `MediaStore` needs no permission at all.
- Notifications and tracking are their own asks and travel with nothing.

An upgrade is requested the first time the stronger level is actually used, not at the moment the weaker one is granted.

### `perm-rationale` The screen before the dialog is what earns the dialog

The system dialog is a yes or a no with one app-written sentence in it. Everything else the user needs in order to decide has to arrive before it, on a screen the app owns. The dialog is modal over the one surface the phone has: the feature it is asking about cannot be shown behind it, and a user who declines has nowhere else on screen to go, so the reduced form has to already be on the screen they were standing on.

That screen says three things: what the feature does, what the data is used for, and what the user gets. Then it offers two exits that both continue: a control that triggers the real dialog, and a decline that returns to the app with the feature in its reduced form.

- Read the current status before drawing anything. A rationale shown to someone who already granted is noise, and one shown to someone who can no longer be prompted is a lie. On Android `shouldShowRequestPermissionRationale` returning true means show the educational screen, and nothing more: it is false before the first ask as well as after a permanent denial, so it is not a test for either. Permanent denial is read from the request returning with no dialog shown, or from the platform status on iOS.
- It does not imitate the system alert. A fake dialog with Allow and Don't Allow teaches the user to dismiss the real one behind it.
- One rationale screen per feature, covering the permissions that one feature needs, and never a queue of asks chained across unrelated features. Where the platform requires or documents a bundle it goes out as one ask: paired location, or camera plus microphone for a single capture surface, through `RequestMultiplePermissions` on Android.
- It sits at the feature. A permission without which the app has no first screen at all may be asked for earlier, and then that screen has to make the reason obvious before the dialog appears.

### `perm-purpose-string` The sentence inside the dialog is written, not generated

iOS drops the app's usage description into the system alert. The Android request API takes permission strings and nothing else, so there is nowhere for an app sentence to go and the rationale screen carries the entire explanation. Either way somebody writes copy.

An active sentence naming the feature and the use: "Records at night to detect snoring." Not "needed for a better experience", which says nothing, and not "Turn on microphone access", which restates the button.

On iOS every protected resource has its own key, and a missing one is not a warning: the access fails, the app is terminated on the spot, and review rejects the build. The seven in common use are `NSCameraUsageDescription`, `NSMicrophoneUsageDescription`, `NSPhotoLibraryUsageDescription`, `NSPhotoLibraryAddUsageDescription`, `NSLocationWhenInUseUsageDescription`, `NSLocationAlwaysAndWhenInUseUsageDescription` and `NSUserTrackingUsageDescription`. They are user-visible strings, so they localize, and they are as long as the language makes them.

### `perm-answers` A permission has more than two answers

Granted or denied is the branch most code has. The states that exist:

- **granted**, and at what scope, because a yes to approximate is not a yes to precise;
- **denied and still askable**, which exists on Android and only there: the first Deny leaves a second chance, the second one spends it;
- **denied permanently**, where the dialog never appears again and the request call does nothing at all. On iOS a single Deny produces this, so the two denial branches are written once per platform rather than once for both;
- **not determined**, nobody asked yet, which is also where an expired one-time grant lands;
- **restricted**, where the device does not allow the user to grant it and no copy the app writes will change that.

Each is a different screen. Permanent denial is the one that gets folded into plain denied and produces a control that silently fails: the user taps Allow, no dialog appears, nothing moves, and the app has no explanation for it.

Partial grants belong here too. An approximate location, a single session of access, a subset of a library. The feature either runs on what it was given or names the part of itself that is missing, and a partial yes is never handled as a no.

### `perm-recheck` A grant is a current value, not a fact

Check immediately before each access instead of caching the answer at launch.

The user can revoke anything from system settings while the app sits in the background, a one-time grant ends with the task and reverts to not determined rather than to denied, so the next touch of that feature is a fresh ask and not a settings route, the visible subset of a library changes without a prompt, and from Android 11 the system resets the runtime permissions of an app nobody has opened for a few months. A returning user can arrive without something they granted, through no decision either of you made.

The screen that assumes otherwise crashes, or shows an empty list where the content used to be and blames the server.

### `perm-no-coercion` A no is an answer the app has to live with [P1]

`state-permission` owns the degraded screen and the route back into system settings. What that route must not turn into:

- No re-ask while the status is denied, and no ask the user did not trigger. On Android a prompt after a refusal spends the last chance the app had. A status of not determined at the next launch, including one an expired one-time grant left behind, is a first ask and belongs to `perm-rationale`.
- Nothing is held hostage. Content, a paid feature or a reward cannot be priced at a permission, and an unrelated feature is never gated on an unrelated permission. The App Store rules name notifications, location and tracking specifically; Play states the same prohibition generally and adds that the app must accommodate the user who says no.
- The note about what is missing sits where that feature's results would have been and names only the feature affected.
- Consent is withdrawn where it was given. Every permission the app holds is reachable from inside the app, as a link to the system page for it rather than a second switch, which is `set-system-owned`, and any consent the app stores itself, a tracking flag or an analytics opt-in, is turned off where `set-account-exit` puts it. Where the user has turned tracking off in Settings, a shortcut back there is allowed.

### `perm-notify-ask` The notification prompt comes after the user makes something worth being told about

Consent is required before a single notification is sent, and this ask follows the same rule as the others: it belongs to the moment the user places the order, sets the reminder or follows the thread, not to the first screen.

- On Android it is a runtime permission from Android 13. An app targeting anything older loses control of the timing completely: the system raises the dialog itself the first time an activity starts once a notification channel exists, with no context at all, and a refusal there stands until the app is reinstalled or its target level reaches 33. Raising the target level is the fix, not a workaround.
- iOS has a provisional level that sends with no prompt, delivering quietly to the notification list where the user can keep it or turn it off. That is the honest way to earn the loud one.
- Promotional messages get their own opt-in inside the app, and the system grant is not it.

### `perm-tracking` The tracking prompt exists only if the app actually tracks (iOS)

From iOS 14.5, linking this app's data to data other companies collected, or passing it to a data broker, needs the tracking prompt and its own usage description. Without a grant the advertising identifier comes back as all zeros.

An analytics or advertising SDK that pools users across other developers' apps counts even when the app never asks it to, so the dependency list decides this, not intent. No tracking means no prompt and no key. Tracking means the app still works whole when the answer is no: nothing withheld, nothing asked twice.

### Check

Review answers each of these against the code, pointing at the line:

- Every entry in the merged manifest and in the built app's `Info.plist` names the feature that uses it, and every runtime one names a feature the user can point at. `perm-inventory`
- No permission is requested for something a system picker or access button already returns without one, a partial grant is widened in place rather than re-asked, and the automatic limited-access alert is suppressed and replaced. `perm-ask-less`
- Each request asks for the weakest usable level, location goes out as the paired request, and always, precise and background are separate later asks. `perm-scope`
- Each request is preceded by an app-owned screen stating use and benefit, gated on the current status, with a decline that continues except on the first-run required-resource screen `onboard-ask-order` defines, and one screen per feature rather than a queue. `perm-rationale`
- Every usage description is an active sentence naming the feature and the use rather than restating the button. `perm-purpose-string`
- The code branches on permanent denial and on partial grants, not on a granted boolean. `perm-answers`
- Permission status is read at the point of access, never cached from launch. `perm-recheck`
- No re-prompt while the status is denied, no feature or content gated on an unrelated grant, and every permission and stored consent the app holds is reversible from inside it. `perm-no-coercion`
- The notification request follows a user action that creates something to notify about, not app start. `perm-notify-ask`
- On iOS a tracking prompt exists if and only if a dependency tracks, and denial changes no feature; a codebase that ships only to Android answers this not applicable. `perm-tracking`

Run the last five with the permission revoked and the app cold started, because every one of them passes on a device where the grant is already in place. Reach each state on purpose rather than waiting to meet it: on Android, `adb shell dumpsys package PACKAGE_NAME` reports the flags per permission, where `USER_SET` is one denial and `USER_FIXED` is the permanent one, and `adb shell pm clear-permission-flags PACKAGE_NAME PERMISSION_NAME user-set user-fixed` resets between runs; on iOS, Reset Location & Privacy returns every permission to not determined. A state nobody can enter deliberately gets answered from the granted device every time, which is the same as not running the check.

### Reaches

- `heuristics/onboarding.md`: `onboard-ask-order`
- `heuristics/settings.md`: `set-system-owned`, `set-account-exit`
- `heuristics/states.md`: `state-permission`

# heuristics/privacy-ui.md

## Privacy on screen

A phone is used on a train, in a queue, and across a table. The person beside the user is close enough to read a six inch screen, has no reason to look away, and is part of the threat model in a way no desktop design assumes. On top of that the operating system photographs the app without asking, to draw the app switcher.

This file covers two things: what a stranger standing there can see, and what leaves the device as a record of what the user did. Asking for access to data is `permissions.md`. Identity and the session are `auth.md`. What a notification shows over a locked screen is `notify-lockscreen`; here the screen is unlocked and the app is the one drawing it.

Two of the platform capabilities below are weaker than they are usually assumed to be, and one does not exist at all on iOS. Design so the screen is safe without them, then add them.

Rules in this file, in order: `priv-shoulder`, `priv-reveal`, `priv-switcher`, `priv-capture-block`, `priv-capture-detect`, `priv-gate`, `priv-instrument`, `priv-delete-data`, `priv-declared`.

### `priv-shoulder` Show the shortest form of a value that still does the job

Take the inventory per screen: amounts and balances, one-time codes, card and account numbers, tokens and recovery phrases, health figures, home and precise addresses, legal or immigration status, and message bodies shown in a preview.

- The resting state is the shortest form that identifies the thing. The last four digits, the initials, a band instead of a figure. That short form is for a value sitting beside something else: a value the screen exists to show is already at its shortest form when it is shown in full, so the balance on the account screen somebody opened to read it is drawn plainly and gets a hide control, not a band.
- A value the interface never needs in full is not masked, it is truncated in the model before it reaches the view, and then there is nothing to leak.
- Where the whole value is genuinely needed sometimes, it rests masked and is revealed on request, which is `priv-reveal`.
- The mask is a fixed shape at a fixed width, not the real string with dots painted over it. Six dots against a six digit balance has masked the glyphs and published the magnitude.
- Masking follows the value everywhere it is drawn: the list row, the summary card, the search result, the share preview and the sample data in an empty state.
- Copying takes the whole value off the screen whatever the field was showing. The system preview drawn after the copy and the next app to read the clipboard both get it, so a copy control on one of these values marks the copy as sensitive, which is `share-copy`.
- Content the user wrote and opened on purpose is not masked. Blurring someone's own messages until they tap is theatre, it slows down the only person entitled to read them, and it is the version of this rule that gets the whole thing switched off.

### `priv-reveal` Revealing is a deliberate act, and it ends by itself

- The control is a real target at the platform floor (`touch-floor`) and it carries its state, so a screen reader says hidden or shown rather than naming an eye (`a11y-name`).
- Nothing reveals on scroll, on a long press with no affordance, or because the screen finished loading. The user asks, every time.
- It reverts on leaving the screen, on the app going to the background, and after an idle period the product decides once. No platform publishes a number for that period, so choose it from what the screen holds and record it in `STACK.md` beside the re-authentication window `auth-reauth` keeps there.
- Revealing puts the value on the screen and nowhere else: not into a toast, not into a log, not into an announcement fired by an unrelated event.
- Where the reveal is itself the sensitive act, a recovery phrase or a full card number, put `priv-gate` in front of it instead of a toggle.

### `priv-switcher` The switcher snapshot is taken without asking, so the cover goes up first

The system captures the last frame to represent the app in the switcher. The user never consented to that capture, cannot see it happen, cannot tell which frame was taken, and the image is written to storage rather than held for a moment. A balance left visible there is readable by anyone who picks up the unlocked phone.

- On any screen holding something from the `priv-shoulder` inventory, draw an opaque cover as the app leaves the foreground and take it down on return. A screen with nothing on that list owes no cover. Blur is not a cover: at thumbnail size a blurred number is still a number shaped mass in the right place, and a hand rolled blur ignores the reduce transparency setting.
- Which lifecycle callback runs before the capture is not something to assume. Background the app from the sensitive screen, open the switcher, and look at the thumbnail. That is the only result that counts.
- On iOS the cover is entirely app authored and hangs from the transition to the background. `applicationDidEnterBackground` on the app delegate, or the matching scene callback, is where to start, and the thumbnail check above is what settles whether it ran early enough. There is no API that suppresses the snapshot and no platform guidance on the subject, so a screen that needs a cover and does not draw one simply leaks.
- On Android, `FLAG_SECURE` already blanks the Overview thumbnail, so a screen carrying it for `priv-capture-block` needs no second mechanism. `Activity.setRecentsScreenshotEnabled(false)` (API 33) is the narrower control: it suppresses the Overview representation and nothing else, leaving the user's own screenshot untouched. `android:excludeFromRecents` drops the task from Overview altogether, which is a decision about how the app is re-entered rather than a privacy control.
- A cover is not a gate. Coming back through it restores the screen exactly as it was, so a screen that must not return unlocked needs `priv-gate` as well.
- Coming back after the process was killed is `nav-restore`, and the restored screen starts masked like any other.

### `priv-capture-block` Blocking capture is a partial Android capability and no iOS capability at all

- Android's `FLAG_SECURE` keeps a window's content out of screenshots and off non secure displays. Google puts it at around 70% of devices reliably on Android 11 and lower, and says it is not reliable against an overlay attack. It raises the cost. It is not a guarantee, and a design that assumes it is has no fallback.
- It applies per window, so set it entering the sensitive screen and clear it leaving. Flagging the whole app also blocks every legitimate screenshot the user wanted, and Google suggests a setting that lets the user toggle the flag. Where the product ships that row, its default and the reason for it go down with the others (`set-default-first`).
- From API 35 `View.setContentSensitivity(CONTENT_SENSITIVITY_SENSITIVE)` marks one view rather than the window, and the hosting window is treated as secure for the duration of a media projection session. `CONTENT_SENSITIVITY_AUTO` reaches the same place from autofill hints, so tagging the username, password and card fields for autofill is also what hides them during a screen share (`form-autofill`).
- iOS publishes no equivalent. `isSecureTextEntry` hides the characters and disables copying, and Apple's own wording says it prevents recording and broadcasting only in some cases. That is a hedge, not a promise, and there is nothing else.
- Android 15 already hides password input from a remote viewer, redacts notification content during a screen share, and from QPR1 gives the user a status bar chip that stops the projection. None of that is worth rebuilding. What is left to the app is its own screen.
- The control that always works is composition. A full card number beside its security code, or a recovery phrase beside the account it belongs to, is a capture problem no flag repairs. Split the screen instead.

### `priv-capture-detect` Screenshot detection lands after the pixels are gone, mirroring is known while it happens

- iOS posts a notification once a screenshot has been taken. Android 14 offers a per activity capture callback behind the install time `DETECT_SCREEN_CAPTURE` permission, and it fires only for the hardware button screenshot.
- Neither of those hands over the image, neither can refuse it, and both arrive after the shot was already taken. Detection is a notice. An app that treats it as protection has a security model made of a toast.
- Android shows the user its own notice when that callback fires, so tell them first, in context, as they enter the screen that watches. A system message nobody was expecting reads as an accusation.
- Whether the screen is being mirrored or recorded right now is a different question, and both platforms answer it while it is happening. iOS exposes the state as `UITraitCollection.sceneCaptureState` from iOS 17, superseding the deprecated `UIScreen.isCaptured`. Android 15 calls back as the app becomes visible or invisible inside a screen recording, through `addScreenRecordingCallback` and `SCREEN_RECORDING_STATE_VISIBLE`.
- What to do with that signal is the app's call, and the default is to hide the sensitive region rather than end the session under someone who is in a meeting. Playback is the exception Apple documents: a media app pausing and saying why is the right answer there, and it stays with `media.md`.
- Recording that a capture happened is instrumentation and obeys `priv-instrument`. It never records what was on the screen at the time.

### `priv-gate` A second gate covers an area, never the whole app

The mechanism is `auth-biometric-session`: a device prompt re-authorizes a session that already exists. Which actions have to ask again is already `auth-reauth`, which lists revealing a full card or document number among them and keeps the window in `STACK.md`. What is left here is a privacy decision, and it is three questions.

- **What it covers.** The sensitive area, not the app: the account tab, the document, the phrase. Locking the whole app for the sake of one screen makes the frequent case pay for the rare one, and the user turns it off in a week.
- **When it re-locks.** On leaving the area, on the app coming back from the background, and after an idle period, on the window `STACK.md` already holds. A gate that only fires at cold start is decoration.
- **What it does not cover.** A gate with no `priv-switcher` cover is read straight off the switcher thumbnail of the screen behind it. Both, or neither is worth having.
- The way out stays open when the check cannot run. Sign out, deletion and support are reachable with the sensor unavailable or unenrolled, which is `sense-biometric`.

### `priv-instrument` Nothing the user typed leaves the device in a log, a crash report or an event

Apple requires explicit consent and a clear visual or audible indication when an app records or logs user activity, and names screen recordings and other user inputs in that requirement. Session replay is therefore a store rule before it is a taste question.

- Write the event schema down and name every field. No field carries free text, the contents of a masked value, a token, a precise coordinate, or a full identifier where a stable hash does the job.
- Analytics and crash SDKs capture screens, taps and the view hierarchy by default, and that default is the whole failure. Put the sensitive views in the SDK's redaction list at the same moment the screen decides to mask them, and confirm it by replaying a captured session rather than by reading the configuration.
- A crash report carries state with it. Strip request bodies, credential bearing headers and every field the screen masks before it is sent.
- The debug log ships. A line that prints a response body is a leak the moment the phone is plugged into a laptop, and it is the cheapest of these to remove.
- Whether any of it crosses to another company is `perm-tracking`. The answer to that prompt does not change what is inside the payload.

### `priv-delete-data` Deleting data and deleting the account are two different actions

`auth-delete` owns the account route and its obligations. This rule owns what the word delete promises the person tapping it.

- Where the app holds things the user can point at, a history, a document, a conversation, a downloaded set, deleting those is offered on its own. An app whose only delete is the account is asking someone to burn it down to clear a search box.
- Say which copy went. Dropping the row locally while the server keeps it is a lie the user discovers on their next device, and deleting server side while the phone keeps a cached copy is the same lie facing the other way.
- The on device leftovers are the part that gets missed: caches, thumbnails, drafts, search history, downloaded media and anything still sitting in the outbound queue. `off-cache-policy` says what is stored, and the delete has to reach all of it.
- Delete means gone, not hidden. On the account route Play requires the associated user data to be removed rather than the account frozen, and a per-object delete that flips a flag and leaves the row in place is the same failure at smaller scale.
- Anything retained is named as a thing with its reason beside it, in a sentence: the invoices stay because tax law keeps them. A link to a policy page is not an answer to somebody whose thumb is already on the button.
- It is a one way row and sits with the other one way rows (`set-destructive`). A short window in which the work can still be called back beats a second confirmation dialog (`fb-undo`).

### `priv-declared` The store declaration is derived from the code, not from intent

Both stores require this and both require it to be accurate, and each asks for two separate things. Play requires a complete data safety section for every app, consistent with the privacy policy. Apple's counterpart is the privacy details submitted with the app, which the store then shows on the product page: what is collected and what it is used for. Alongside that, Apple requires a privacy policy linked in the store metadata and reachable inside the app, identifying what is collected, how, every use of it, and the retention and deletion terms.

- Derive it from the requests the app actually makes and from the dependency list, never from what the feature was meant to do. Every SDK collects on its own account, and that collection is the app's.
- Both forms live in the consoles, where nothing in the repository can be compared against them, so what was filed is written into `STACK.md` beside the dependency list it came from: one line per data type, naming the SDK or the endpoint it comes from and the use declared for it.
- Adding an analytics, advertising, attribution or crash dependency is a change to the filing. A diff that adds one and leaves the declaration alone ships out of date.
- Collection with no system prompt in front of it still owes the user a disclosure, and Play requires it inside the app during normal use rather than in the listing or behind a settings screen. The permission case is `perm-rationale`; this is the case with no dialog to attach to.
- The policy is reachable from inside the app and not only from the store listing; the row that holds it is `set-account-exit`.

### Check

Review answers each of these against the code, pointing at the line:

- Every sensitive value on the screen is drawn in the shortest form that identifies it, and the mask is a fixed shape rather than the real string covered up. `priv-shoulder`
- Reveal is an explicit, named, labelled action that reverts on leaving, on backgrounding and on a written idle period. `priv-reveal`
- Every screen holding something from the inventory covers itself as the app leaves the foreground: an opaque cover removed on return on iOS, that cover or `FLAG_SECURE` on Android, and somebody has looked at the switcher thumbnail to confirm it. `priv-switcher`
- Capture blocking is scoped to the screen that needs it, is not relied on as a guarantee, and no screen puts two halves of one secret together. `priv-capture-block`
- Capture detection is used as a notice the user was warned about, never as protection, and the live mirroring signal is read on both platforms and answered by hiding the region rather than by ending the session. `priv-capture-detect`
- The gate covers an area rather than the app, re-locks on background and idle, and ships together with the switcher cover. `priv-gate`
- No log, crash report, analytics event or replay session carries typed text, masked values, tokens or full identifiers. `priv-instrument`
- Data deletion exists separately from account deletion, removes the row rather than hiding it, says which copies went, names what is retained and why, and reaches the on device leftovers. `priv-delete-data`
- `STACK.md` records what both stores were told, that record matches the dependency list and the requests in the diff, and the in-app disclosure and the policy route both exist. `priv-declared`

Check the first three on a running build rather than in the source: the cover, the mask on every route onto the screen, and the reveal reverting are all things a screen can be written to do and still fail to do. Two more do not come out of the app at all. Open the data safety form in the Play console and the privacy details in App Store Connect and read both against what `STACK.md` records, and confirm on the server, not in the app, that a delete took the row away rather than flagging it.

### Reaches

- `heuristics/accessibility.md`: `a11y-name`
- `heuristics/auth.md`: `auth-reauth`, `auth-biometric-session`, `auth-delete`
- `heuristics/feedback.md`: `fb-undo`
- `heuristics/forms.md`: `form-autofill`
- `heuristics/navigation.md`: `nav-restore`
- `heuristics/notifications.md`: `notify-lockscreen`
- `heuristics/offline.md`: `off-cache-policy`
- `heuristics/permissions.md`: `perm-tracking`, `perm-rationale`
- `heuristics/sense.md`: `sense-biometric`
- `heuristics/settings.md`: `set-default-first`, `set-destructive`, `set-account-exit`
- `heuristics/sharing.md`: `share-copy`
- `heuristics/touch.md`: `touch-floor`

# heuristics/scrolling.md

## Scrolling

Scrolling is the movement a phone gets the most of. The screen is a few hundred points tall, so nearly everything past the first card is reached by dragging, and the drag is the one interaction the hand pays for directly. That is why a scroll that stutters, jumps, or loses somebody's place is felt within a second, and why the defects here are the ones users describe as the app being broken rather than as a design they dislike.

This file is the scroll itself: its axis, its position over time, the chrome that moves with it, and the effects the platform owns. The collection inside the scroll is `heuristics/lists.md`. The column it runs in, the bars pinned over it and the insets around it are `heuristics/layout.md`.

Rules in this file, in order: `scroll-nest`, `scroll-affordance`, `scroll-collapse`, `scroll-edge`, `scroll-anchor`, `scroll-restore`, `scroll-top`, `scroll-programmatic`, `scroll-overscroll`, `scroll-keyboard`.

### `scroll-nest` Same-axis nesting needs a wired handoff, and the fling is part of it

Whether a same-axis nest is allowed at all is `layout-column`. This rule is what has to hold once one is: the two scrollers are connected, so at every moment a delta has one owner rather than two competing for it. Android's collapsing app bar is that arrangement and works for exactly that reason, while a scroll view hand-placed inside another of the same orientation is the same shape with nothing joining the halves.

The connection is the whole rule. Deltas travel up to the outermost parent before the child moves, the child consumes what is left, the remainder goes back up, and a fling repeats that cycle with its own pre and post phases. Those fling phases run for touch gestures only, so a handoff that feels correct under a thumb does nothing under an accessibility or hardware scroll.

Three places the wiring is missing and the arrangement still compiles:

- In Compose, `verticalScroll`, `horizontalScroll`, `scrollable`, the `Lazy` APIs and `TextField` join the nested-scroll chain on their own. A `Box` or a `Column` does not, until `Modifier.nestedScroll` is added.
- Across the interop boundary, `RecyclerView` and `ViewPager2` do not implement the nested-scrolling interfaces, so a Compose parent receives nothing from them however it is configured.
- In mobile web and in wrapper stacks there is no nested-scroll contract to opt into. Two same-axis scrollers there are simply two scrollers, and which one moves is settled by where the finger landed.

A windowed list inside a plain scroller is a different failure and `list-virtualise` owns it.

### `scroll-affordance` The edge says there is more

Touch scroll indicators appear during the drag and fade, so on a still screen there is nothing telling the user the region moves. The content has to say it: let the next item be cut by the edge it continues past, rather than ending the visible set flush against the margin. A horizontal row of cards whose last card lands exactly at the padding reads as a complete set, and most people never drag it.

A paged horizontal scroll is the exception that needs a control instead. On a phone the paged region takes the full width and nothing else on a still screen says where in the set the user is, so it gets a page indicator. Where the platform also draws a scroll indicator on that axis, drop it rather than report the same fact twice.

The stock page indicator is a control, not a read-out: it handles its own touches, and its hit area is the whole control rather than one dot, so nothing in it needs inflating and working tap-to-page behaviour is not a defect. A row of dots assembled by hand has only the target its author gave it, and that one owes `touch-floor`.

### `scroll-collapse` What collapses is chrome, never the last way out

The two platforms hand you opposite starting points. On iOS a large title shrinks to a standard title as scrolling begins and returns at the top, with no work. On Android nothing collapses unless it is asked to: the scroll behaviour parameter on every Material 3 top app bar defaults to none, and in the view system the scroll flags default to `noScroll`, while Google's own layout guidance says the bar should collapse. So on Android this is a decision, and which behaviour is chosen has consequences.

An enter-always bar comes back on any downward drag. An exit-until-collapsed bar only re-expands once the content is scrolled all the way to the top. Put the only route to an action inside the second kind and the user has to travel back through the entire list to reach it.

- What may not collapse to zero is the only route out. A small top app bar taking its back arrow fully offscreen is a supported Material configuration and costs nothing, because the system back gesture is untouched by it. A modal close, a cancel, or an action that exists nowhere but that bar is the case that has to survive the collapse, since scrolling it away leaves the screen with no exit at all.
- The screen's primary action does not live in the collapsing region (`button-one-primary`).
- The collapse position is saved state, so rotation does not re-expand a bar over content the user had scrolled past. Material's app bar state carries the offset for this.
- Material disables the scroll behaviour on its bottom app bar while touch exploration is running, and applies no such guard to the top bars, so write that guard for a top bar that hides a control. A collapse is reached by dragging, and a control that only returns after a drag has no route for someone who does not drag (`a11y-gesture`).

### `scroll-edge` The line between content and chrome is drawn by the platform

A bar pinned over a scroll has two conditions, content resting at the edge and content passing underneath, and both platforms already decide what each looks like. iOS gives a bar a separate scroll edge appearance and switches to it the moment scrolled content reaches the bar, so a bar transparent at rest picks up its background by itself. Android's app bar lifts when content scrolls under it, taking a container surface color as it does, and that behaviour is on by default.

Take the transition from there. A shadow painted by hand, a divider pinned under the bar, and a bar left permanently opaque all trade a conditional behaviour for a fixed one: the opaque bar spends the edge-to-edge look while nothing is even scrolled, and the drawn line stays put at the top where the platform would have removed it. Apply one such effect per scroll view, and leave the status bar area translucent so content reads as passing under the bar rather than being cut off by it.

### `scroll-anchor` Nothing arrives above the reading position

This is the defect that makes people lose their place. An image finishing its decode, a banner resolving, a consent strip appearing, or a page of older messages prepending: each one inserts height above the viewport and pushes the sentence being read off the top. One column means the insertion has nowhere to go sideways, so it moves the whole screen at once, and it lands while the thumb is still travelling.

Reserve the space before the content exists, which `icon-reserve` covers for pictures and boxes. A placeholder at the final height makes the arrival a change of pixels rather than a change of layout.

Where the insertion is real rather than late, the anchoring is the framework's job and stable keys are what it needs to do it. A keyed lazy list holds the row that was first visible when rows arrive above it, so the index moves and the visible content does not. What review has to check is the cases nothing covers: a list whose items have no keys, a plain scroller with the rows laid out by hand, and mobile web where scroll anchoring is switched off. A thread that loads history upward is the case that ships broken most often.

Content appended below the viewport is free. Refreshing in place keeps the row under the thumb, which is `list-refresh`.

### `scroll-restore` The place comes back keyed to the item, not to the index

Restoration is ordinal by default, and that default is the bug. A Compose lazy list does keep the key of its first visible item in memory, which is what lets it stay on the same row when items are added or removed above it while the screen is alive. What it writes to saved state is two integers: the index of the first visible item and its pixel offset. So the identity is there until the process dies and absent after it, and in a list whose items were never given keys it is absent from the start. Either way the list comes back at whatever now sits at that index, which after a re-sort or an insertion at the top is a different piece of content. RecyclerView admits the same problem from the other side with a restoration policy that withholds state until the adapter has items, because index 40 is meaningless during the first layout of an asynchronously loaded list.

- Give the items stable keys, `key = { it.id }` on a lazy list, so there is an identity to hold at all. This is the one-line fix and it is the one most often missing.
- Persist that identity yourself, because the framework does not write it down. A position held only in a view model survives rotation and dies with the process, and the process gets killed without anyone asking (`state-interrupt`).
- Restore by resolving the identity, and fall back to the top when the item no longer exists.
- Restore after the data is there, never during the first empty layout.

Which screen comes back is `nav-restore`. Unfinished input is `form-persist`.

### `scroll-top` Returning to the top is a system gesture on iOS and yours to build on Android

On iOS the status bar tap does it, it is on by default, and it breaks quietly: on iPhone the gesture has no effect when more than one scroll view on screen still has it enabled. A horizontal carousel inside a feed is enough to kill it. Turn it off on every scroller except the one the screen is about.

Android publishes no equivalent gesture, so a screen whose scroll has no fixed end builds the affordance: a tap on the already-selected tab, or a control that appears once the user is far enough down. It is sized to the touch floor (`touch-floor`), and it arrives at the top without a long animated ride through everything in between.

### `scroll-programmatic` Code never moves the screen under a finger that is moving it

A touch becomes a scroll after a small amount of travel, 8 dp by the Android default and adjustable per device, which means the user is scrolling well before anything looks like a scroll. A programmatic scroll issued in that window takes the screen away from a hand that is already using it.

- Fire only when no drag is in progress. Where the animation runs through the container's own scroll state, a user drag outranks it and cancels it already. Where it does not, an imperative scroll aimed at a different container, a `scrollTo` in mobile web landing mid-touch, that guard has to be written.
- Move as far as is needed to bring the thing the user just acted on back into view, and no further. Auto-scroll restores context; it does not relocate people.
- Animate only across a short distance. An animated scroll to a distant index rides through everything between and lasts as long as the distance. Jump instead, and let the destination be the first frame the user sees.
- Reduced motion turns the animated ones into jumps (`motion-reduced`).

### `scroll-overscroll` The end-of-content effect belongs to the operating system

Android 12 replaced the edge glow with a stretch that bounces back on drag and on fling, for every app on the device. iOS bounces elastically and expects apps to keep that behaviour. In both cases the scrolling container already provides it, so a hand-built rubber band is a second bounce arguing with the first: it starts at a different velocity and settles on a different curve, and it reads as a rendering fault rather than as a style.

- Do not remove it. On a screen with no persistent scrollbar it is often the only signal that the content has ended, and what the end then says is `list-end`. The switches to look for are `android:overScrollMode` set to never on Android and a scroll view with its bounce turned off on iOS.
- Do not switch it off to quiet a nesting fault. That hides `scroll-nest` instead of fixing it.
- Android publishes a hook for replacing the effect, an `OverscrollEffect` applied with `Modifier.overscroll` or supplied for the whole theme. iOS publishes no equivalent, so there the effect is kept rather than restyled. On neither is it rebuilt by intercepting touches.
- Anything driven by scroll offset is recomputed on every frame of the drag, so it stays on transform and opacity (`motion-cheap`) and never triggers layout.

### `scroll-keyboard` The keyboard shortens the scroll, it does not cover it

Half the screen disappears with no warning, and the scrolling container has to lose that height rather than keep it underneath. A container that stays full height while the keyboard sits over its bottom third makes everything below the focused field unreachable at the exact moment it is wanted.

- The keyboard inset is applied to the scroll container itself, not simulated with a spacer view whose height is guessed. On Android that is the IME inset, `WindowInsets.ime` or `Modifier.imePadding`, with the window's soft input mode set to resize. On iOS it is the keyboard layout guide, or a content inset driven by the keyboard frame.
- Dragging the content dismisses the keyboard, interactively where the platform offers it, which on iOS is the scroll view's interactive dismiss mode. Nobody should have to aim at a done button before they can read.
- The focused field staying visible is `touch-keyboard`.

### Check

Review answers each of these against the code, pointing at the line:

- Every same-axis nesting names the connection that wires it, and no scrollable was placed inside another simply because its content did not fit. `scroll-nest`
- Each scrollable region shows content cut by the edge it continues past, and a paged one carries a page indicator rather than a scroll indicator on that axis. `scroll-affordance`
- Every collapsing bar names its behaviour, leaves a route out of the screen that does not depend on it, holds no primary action, saves its position, and pins under a screen reader. `scroll-collapse`
- The bar over a scroll takes its resting and scrolled appearances from the platform rather than from a drawn shadow, a pinned divider or a permanently opaque background. `scroll-edge`
- Nothing above the current position changes height after it renders, and anything that prepends is either keyed or anchors the first visible row itself. `scroll-anchor`
- List items carry stable keys, the position is persisted as an item identity that survives the process, restored after the data loads, and falls back to the top when the item is gone. `scroll-restore`
- On iPhone exactly one scroll view per screen keeps scroll-to-top enabled; on Android any unbounded scroll offers a built return-to-top at the touch floor. `scroll-top`
- Every programmatic scroll is guarded against an in-progress drag, moves the minimum needed, and animates only over a short distance. `scroll-programmatic`
- No hand-written bounce, overscroll is not disabled, and scroll-linked effects move only transform and opacity. `scroll-overscroll`
- The scroll container consumes the keyboard inset, and dragging the content dismisses the keyboard. `scroll-keyboard`

Check nesting, the scroll affordance, anchoring and restoration on a device with real data rather than in the layout code. All four look correct in a short mock list and fail only once the content outruns the screen.

### Reaches

- `heuristics/accessibility.md`: `a11y-gesture`
- `heuristics/buttons.md`: `button-one-primary`
- `heuristics/forms.md`: `form-persist`
- `heuristics/icons-and-imagery.md`: `icon-reserve`
- `heuristics/layout.md`: `layout-column`
- `heuristics/lists.md`: `list-virtualise`, `list-refresh`, `list-end`
- `heuristics/motion.md`: `motion-reduced`, `motion-cheap`
- `heuristics/navigation.md`: `nav-restore`
- `heuristics/states.md`: `state-interrupt`
- `heuristics/touch.md`: `touch-floor`, `touch-keyboard`

# heuristics/search.md

## Search

Search is how somebody finds a thing they already know is in there. On a phone it runs against a keyboard that takes half the screen, a list with no scrollbar, and a connection that may be a cell tower two bars down. Where search sits in the app's structure is `nav-search`. This file is the surface itself, from the field down to the last result row.

Two failures account for most of what goes wrong: a plain text field with a magnifier icon standing in for the platform's search control, and a query fired at the server on every keystroke.

Rules in this file, in order: `search-surface`, `search-stock-field`, `search-placement`, `search-typing`, `search-suggest`, `search-recent`, `search-scope`, `search-filters`, `search-pending`, `search-result`, `search-zero`, `search-return`.

### `search-surface` An inline filter and a search screen are two different things

Decide which one the screen needs before writing the field.

- **An inline filter** narrows what is already in front of the user (`nav-search`). It stays with the list it filters rather than moving up into the chrome.
- **A search screen** reaches past what is in front of the user. While it is open it owns the whole screen: a dropdown panel hanging under the bar is the tablet arrangement, and on a phone it only makes the result list shorter.

Focus on open belongs to the search screen, the single-field exception `form-input` already allows, and it forks by platform. On Android the expanded search view raises the keyboard by default and that is correct there; an inline filter that must not cover the list it filters turns it off with `app:autoShowKeyboard="false"` rather than leaving it to the default. On iOS nothing forces focus onto a surface the user did not open in order to type, so the field that arrives focused is the button-style search tab or a screen entered to type into.

On Android a screen pairing the search bar with the search view does not resize under the keyboard, because the resize runs during the expand and collapse animation and breaks it. Everywhere else the constraint is the outcome rather than a window flag: the field being typed into stays visible (`touch-keyboard`), and the result rows do not shift under a thumb already on its way down.

### `search-stock-field` Use the platform's search control, do not assemble one

Both platforms ship the whole control, and every part of it is a part somebody forgets when rebuilding it from a text field: the clear button that appears with the text, the cancel that dismisses the keyboard and the surface together, the search return key, and the expand and collapse transition. `references/search-controls.md` names the control per stack.

- The return key is the search action, not Done and not a newline (`form-input`).
- One clear control, appearing only when the field holds text. Clearing the field is not cancelling the search: clear leaves the user on the search surface with an empty query.
- Do not restyle the bar into something unrecognisable. The Android search bar refuses a custom background on purpose, and a search field that does not look like one is a field nobody finds.
- The Android search view takes the screen behind out of the reader's path while it is open and puts it back on hide. Nothing hands that over on iOS or in a hand-built surface, so there it is owed rather than inherited: while search owns the screen, what is underneath is not what the reader walks into (`a11y-hidden`).
- A voice entry point, where there is one, is the platform's, and it lives in the field rather than as a second control beside it. The keyboard already carries dictation, so a hand-drawn microphone next to it is the same button twice. What is dictated lands in the field as a query the user can read and correct, never as a search that has already run.

### `search-placement` Where the field goes forks by platform

There is no cross-platform answer here, and shipping one platform's arrangement on the other is visible immediately. One codebase cannot hold both at once, so it either chooses the arrangement at runtime by platform or picks one for both and records the choice and its reason in `STACK.md`.

- **Android:** the search bar belongs in the top app bar and behaves as part of it, either fixed, lifting on scroll, or scrolling away with the content. That is the top of the screen, and `nav-search` makes search structural rather than rare once a collection is big enough to need it, so on a large phone the screen owes a second path to it within thumb reach (`touch-reach`).
- **iOS:** three entry points, and the field belongs to one of them: a tab in the tab bar, a toolbar at the bottom or the top, or an inline field directly above the content it searches. Prefer the bottom toolbar where there is one with room, because that is where the thumb already is (`touch-reach`). Put search at the top instead when the content at the bottom of the screen is what has to be deferred to, or when the screen carries no bottom toolbar at all, and expect the top entry to sit collapsed as a button that opens into a field above the keyboard.

An iOS search tab comes in two flavours and they answer different products: a standard tab lands on a search page with suggestions, for browsing and discovery; a button-style tab opens the field focused and returns to the previous tab on exit, for people who arrived knowing what they want. Pick one deliberately.

### `search-typing` A keystroke is not a request

Filtering a collection already on the device happens as the user types. A network search does not.

- At most one search request in flight. Which query wins when two answers race, and how the superseded one is cancelled, is `net-cancel` and is not restated here. The ceiling of one is this file's own: keying requests by their parameters treats every prefix of a word as a different question and lets all of them run.
- The pause between the last keystroke and the request is one constant, named once in the code and recorded in `STACK.md`, not a number retyped at each call site.
- Failures back off on the schedule in `net-backoff`. Retrying per keystroke turns one bad connection into a burst that holds the radio up (`perf-power`) and spends somebody's data (`net-metered`).
- Typing is never blocked by a request. The field accepts input while the previous search is still out.

### `search-suggest` A suggestion says what it will do

Suggestions come in two kinds and they are not interchangeable: one completes the query into the field, the other opens a result and ends the search. Make which is which readable from the row, because guessing wrong costs a screen and a back gesture.

- A suggestion that returns nothing when tapped costs a screen push, a back gesture, and the keyboard coming down and going up again. That is why it is worse here than a wasted click: suggest from what the corpus actually contains.
- The list does not reorder under a finger already on its way down. Rows that resequence on the next keystroke produce a tap on whatever slid into that spot (`touch-spacing`).
- The suggestion list is a list: it recycles (`list-virtualise`) and it scrolls. Only the rows above the keyboard get read, so the strongest candidate is first.

### `search-recent` Recent searches are the cheapest query on a phone

Retyping is the expensive part of searching with two thumbs, so by default the search surface with an empty field shows what this person searched before, and tapping one re-runs it rather than just filling the field.

- A search history the user cannot clear is not shippable. One control clears the whole history, and it lives on the search surface, not down a settings trip.
- The history is on the device and belongs to this app. It does not travel to another surface or another account without the user saying so.
- A phone screen gets read over a shoulder. Showing history is the default; suppressing it is a decision the app is allowed to make, recorded in `STACK.md` with its reason, and content somebody would not want visible on a bus is that reason. The clearing control above is not a decision either way.

### `search-scope` The screen says what it is searching

A phone has no sidebar and no visible category tree, so the corpus being searched has to be stated on the surface itself, by the placeholder that names it, the screen title, or a scope statement under the field. Only Apple ships a stock control for that last one, so on Android and in the cross-platform stacks the scope statement is a row of selected filter chips (`button-chips`) instead of a scope bar nobody hands you.

- The placeholder names the thing: Search messages, Search saved recipes. The bare word Search says nothing, and on the search screen of an app with several kinds of content it is a guess the user has to make.
- Default to the widest scope and let people narrow. Somebody who does not know which section holds the thing cannot choose the section first.
- Changing scope keeps the query that was typed. Retyping to switch scope makes the control cost more than it saves.

### `search-filters` What is narrowing the results stays on screen

Filters on a phone live in a sheet, and the sheet closes. After it does, nothing tells the user the set is narrowed unless the results screen says so.

- The applied filters are visible with the results, as chips (`button-chips`) or as a count on the filter control. Zero is shown as no marker at all, never as a badge reading 0.
- Each applied filter comes off in one tap, and Clear all is allowed here: it is the exception `form-submit` names, because rebuilding a filter set costs a few taps rather than a retyped form.
- Whether a new query keeps the current filters or drops them is a decision recorded in `STACK.md`, and the screen shows the answer either way.

### `search-pending` The results on screen stay up while the next query is out

Between the request leaving and the answer landing is the state a search screen spends most of its life in on a cell connection, and it is the one that gets built by emptying the list.

- What is already on screen stays there until the new results replace it, marked as the answer to the previous query (`state-stale`). Clearing to a placeholder on every keystroke is a list that flickers for as long as somebody is typing.
- The in-flight marker sits in or beside the field, not over the rows. A cover across the results hides the thing the user is reading in order to refine the query.
- The placeholder in `state-loading`, with its 300ms and 500ms floors, is for the first search of a session, when there is nothing on screen yet to keep. Those floors are never applied per keystroke, where they hold a placeholder over results that have already arrived.

### `search-result` The row says why it matched

One narrow column, no hover, no preview pane. Everything somebody needs in order to choose between two results is in the row itself.

- Show the text that matched, in the field it matched in. A row whose title does not contain the query still has to carry the line that does. How the query is matched against the content, case, accents and character width included, is `l10n-collate`.
- The match marker is not color alone (`color-not-alone`): weight, a highlight behind the run, or the field label beside it.
- Most relevant first, and the ordering is one the user could predict. A result set spanning several kinds is grouped by kind rather than interleaved (`list-sections`), and each group header carries how many it holds.
- The results replace the list without a navigation, so the list declares its length (`a11y-collection`) and the settled count is announced once typing has paused and the results have landed. Never one announcement per keystroke, which is the first thing `a11y-announce` forbids. Nothing on screen otherwise says whether this is 3 results or 300.

### `search-zero` A query that matched nothing offers the next move

Keeping the query and the filters on screen is `state-empty`'s second empty. What makes it sharper here is the screen: there is one of them and no results pane beside the query, so whatever excluded everything is off screen entirely unless this screen is the thing holding it.

- Offer at least one next move: drop a named filter, widen the scope to everything, or the corrected spelling. A dead end with a shrugging illustration is the failure this rule exists for.
- Nothing matched is not a failure state. A request that could not complete is `state-error` with a retry (`state-retry`), and the two never render as the same screen.
- Do not fill the space with results that do not match. Related content is allowed below the statement that nothing matched, labelled as what it is.

### `search-return` Coming back from a result comes back to the search

Opening a result pushes a screen, and back returns to the query, the scope, the filters, the results and the scroll position, with the keyboard still down. Restarting the search is the most expensive thing this surface can do to somebody.

- The same state survives the process being killed (`nav-restore`).
- Cancel is a different move from back: it closes the search surface and returns the user to the screen they opened it from, with that screen as they left it.

### Check

Review answers each of these against the code, pointing at the line:

- Each search field is declared as one of the two surfaces, the expanded one takes the full screen rather than a dropdown, and focus on open answers per platform: the Android search view keeps its default while an inline filter switches it off, and no iOS surface is focused that was not opened in order to type. `search-surface`
- The field is the platform's own search control, with exactly one clear control that appears only when there is text, a search return key, the screen behind out of the reader's path while search is open, and any voice entry point inside the field rather than beside it. `search-stock-field`
- Search sits in the top app bar on Android and in one of the three sanctioned iOS entry points on iOS, and a single codebase either forks at runtime or records in `STACK.md` which one arrangement it ships. `search-placement`
- No more than one search request is in flight, the debounce is a single named constant, and retries are backed off rather than per keystroke. `search-typing`
- Every suggestion row shows whether it completes the query or opens a result, suggestions come from real content, and the list recycles. `search-suggest`
- Recent searches re-run on tap and any surface showing them carries one control that clears the whole history, with an app that shows none recording why in `STACK.md`. `search-recent`
- The corpus being searched is named by the placeholder, the title or a scope statement in the form that platform actually has, the default scope is the widest one, and switching scope keeps the query. `search-scope`
- Applied filters are visible with the results, each removable in one tap, with Clear all permitted rather than required, and the query-to-filter behaviour recorded. `search-filters`
- Results already on screen survive the next query, the in-flight marker sits at the field rather than over the rows, and the loading placeholder is used for the first search only. `search-pending`
- The result row carries the matched text, marks the match by something other than color, groups a mixed set by kind, and the count is announced once the results settle rather than per keystroke. `search-result`
- Zero results renders its own screen, keeps the query and filters visible, offers at least one next move, and is never the error screen. `search-zero`
- Back from a result restores the query, scope, filters, results and scroll position, and cancel returns to the originating screen unchanged. `search-return`

The last one is answered by running it, not by reading the diff: leave the search, come back, and check that nothing had to be typed again.

### Reaches

- `heuristics/accessibility.md`: `a11y-hidden`, `a11y-collection`, `a11y-announce`
- `heuristics/buttons.md`: `button-chips`
- `heuristics/colors.md`: `color-not-alone`
- `heuristics/forms.md`: `form-input`, `form-submit`
- `heuristics/lists.md`: `list-virtualise`, `list-sections`
- `heuristics/localization.md`: `l10n-collate`
- `heuristics/navigation.md`: `nav-search`, `nav-restore`
- `heuristics/states.md`: `state-stale`, `state-loading`, `state-empty`, `state-error`, `state-retry`
- `heuristics/touch.md`: `touch-keyboard`, `touch-reach`, `touch-spacing`
- `platform/network.md`: `net-cancel`, `net-backoff`, `net-metered`
- `platform/performance.md`: `perf-power`

# heuristics/sense.md

## Device capabilities

The camera, the microphone, location, the motion sensors, the biometric reader, the vibration motor, the short range radios. None of them is a feature. The feature is what the screen shows while the capability runs, when the value it returns is vague, when the device does not have the hardware at all, and when it is returning nothing worth reading.

The ask belongs to `permissions.md`: what is requested, at which moment, after which screen, and what a refusal leaves behind. `state-permission` owns the denied screen. This file starts after all of that, because a granted permission is where most integrations stop and where the states below begin.

Per-stack presence, status and accuracy APIs are in `references/capability-checks.md`, for one lookup rather than a read through.

Rules in this file, in order: `sense-states`, `sense-absent`, `sense-off-system`, `sense-running`, `sense-interrupted`, `sense-accuracy`, `sense-preview`, `sense-biometric`, `sense-haptic`, `sense-motion`, `sense-radio`.

### `sense-states` Five states past the grant, and a granted boolean covers one

A capability is not on or off. Five states exist whether or not anybody was ever prompted:

1. **Absent.** The device has no such hardware. This is never an error and never a message.
2. **Switched off above the app.** A system toggle or a radio switch holds it, and the app is usually handed empty data rather than a failure.
3. **Running.** Live, holding the hardware, and visible to the user through the platform's own indicator.
4. **Imprecise.** A value arrived with an uncertainty attached to it, and it is still a value.
5. **Failing.** Calibrating, no fix yet, nothing in range, held by another app, locked out after too many attempts, throttled by heat.

Count the branches around every capability the app touches. Granted against denied is one pair, it answers `perm-answers` and nothing here, and it is the whole integration in most generated code. Where the capability returns a value over time (the camera, the microphone, location, the motion sensors, a connected radio) each of the five is a different screen with a different thing for the user to do, so each needs its own branch or its own written reason for being folded into another. The rest answer from what the hardware is rather than from a note in the source: a vibration motor has no imprecise state to design.

### `sense-absent` Ask the device before drawing the entry point

One binary installs on a phone with three cameras and on one with no gyroscope, no barometer and no biometric reader. There is no build time answer to which; the app asks at runtime and gets a real no often enough to design for.

Query first, then decide whether the surface exists. When the answer is no, the entry point is not drawn: no disabled button, no dialog explaining that the device is not supported, no empty screen where the feature used to be. The app is simply smaller on that device, and every neighbouring screen still adds up.

On Android this also decides distribution. A hardware feature declared as required removes the app from the store for every device without it, so anything the app runs without is declared not required and detected at runtime instead. A capability dragged in by a dependency ends up in that declaration too, which is `perm-inventory`.

### `sense-off-system` Off at the system level is a different question from denied, and the app asks both

From Android 12 a device-wide toggle gives every app a blank camera feed and silent audio while the permission still reads as granted, and rate-limits the motion sensors at the same time. Location services switched off at the OS level makes the last known location null, and switching them off clears the cached fix, so a device that answered a minute ago now answers with nothing.

Permission granted and service available are two reads, and the code that only does the first blames the network, the server or the user's grant for a state none of them caused.

- Each answer has its own sentence and its own destination, and neither is a retry button. The permission route is the one `state-permission` already owns. Location services are a second route to a different page, the system's location settings, deep linked the same way. The device-wide camera and microphone toggle is a quick settings tile with nothing to link to, so that sentence names where the tile is instead of promising a link nobody can write.
- A retry loop is the failure mode here. Nothing the app can do changes the answer, so a spinner that keeps trying is a screen that never resolves.

### `sense-running` Say it is running, agreeing with the indicator the system already drew

From iOS 14 the microphone shows an orange dot, the camera or camera with microphone shows a green one, and the orange becomes a square when Differentiate Without Color is on. From Android 12 the same use puts an icon in the status bar, moved into the top right corner when the app is immersive. The user sees these before they see anything the app draws.

- The capturing surface carries its own running state and a way to stop, so the platform indicator and the app say the same thing at the same moment.
- Nothing is placed where the indicator lands. Android hands back those bounds; a full bleed capture screen that puts the shutter, the timer or the close control under them loses the control.
- The indicator is never imitated. A dot of the same colour drawn somewhere else teaches the user to distrust the real one.
- A capture the user did not start as an ongoing task ends with the surface that started it. One meant to outlive its screen (a voice recording, a route, a tracked run) carries the platform's ongoing surface for as long as it runs, which is `notify-ongoing`, and ends when the task does. What never ships is the third case: a capability still live with nothing on screen saying so, the platform reporting a capture the app has stopped mentioning. `perf-power` owns what it costs.

### `sense-interrupted` The system takes the hardware back, and the take is what is at stake

A call arrives during a recording, another app claims the microphone, the headphones come out and the audio route changes, the app goes to the background and the camera is released. `state-interrupt` covers what the view holds through that and the OS carries it for free; the capture session is not carried, and the user meets a recording that stopped without saying so and a take that is gone.

- The surface says the capture stopped and what stopped it, at the moment it happens rather than when the user comes back and reads a timer that never moved.
- What was already captured is kept, named and reachable. A partial take is worth more than a clean start, and a discarded one is unrecoverable.
- Returning re-establishes the session and offers to continue. Resumption is offered rather than assumed, and never left as a dead preview with a shutter that does nothing.

### `sense-accuracy` The uncertainty arrives with the value, and the screen shows it

Every fix comes with a horizontal accuracy radius in metres beside the coordinate, and the number is not the same measurement everywhere: Android reports it at the 68th percentile, the web at the 95th, and Apple as a radius of uncertainty. A threshold tuned against one of those is wrong against the others, and code that reads the coordinate and drops the radius is claiming a precision nobody offered.

The gap is wide. An approximate grant on Android covers roughly 3 square kilometres, while a precise one is usually within about 50 metres and sometimes a few. Apple publishes no figure for its reduced accuracy, so the 3 km does not travel there.

- A map draws the circle it was given, not a pin at the centre of it. Both platforms have a way of saying there is no radius, and both draw as a perfect fix when that check is skipped: a negative `horizontalAccuracy` on iOS means the coordinate is invalid, and Android's `getAccuracy()` returns zero unless `hasAccuracy()` is true. Missing accuracy is the imprecise state.
- Text states the level it has: approximate, within 50 metres, the neighbourhood instead of the address.
- Anything that needs precision says so on a reduced fix rather than computing quietly on it. That the feature runs on a reduced grant instead of routing to a denial is `perm-answers`.
- The same applies to every other estimate: a heading before the compass is calibrated, a step count, a barometric altitude. Where the platform hands over an accuracy field, something on screen is derived from it.

### `sense-preview` A live preview is a surface with a crop, not an image view

The defaults disagree, so the fit is chosen rather than inherited. CameraX's `PreviewView` fills and crops by default, which shows the user a narrower frame than the one that gets captured and only admits it after the shutter. `AVCaptureVideoPreviewLayer` defaults the other way, fitting the frame inside its bounds, so a crop there is `resizeAspectFill` asked for on purpose; Flutter's `CameraPreview` fits as well. Whichever way it is set, what was framed is what is saved.

- The preview keeps the sensor's aspect ratio. Stretching it to a container is visible on every face in it.
- Coming up is a state. Binding the camera takes time, and what the frame shows while it does is `state-loading`. What belongs here is the shutter: inert until the session is actually live. A capture control that accepts a tap before there is anything to capture is the most common defect on this screen.
- A surface the user has to aim, and any recording that is running, holds the screen awake for exactly as long as the session lasts, and the path that releases it is `perf-power`. A scanner that dims and locks while the code is still being lined up has failed at the one thing it was on screen for.
- It takes the safe area like any other content (`layout-insets`), and the shutter sits where a thumb reaches (`touch-reach`).
- A scanner adds three things: a target to aim at, a bound on how long it tries before offering something else, and a route that does not need the camera at all, such as typing the code or picking an existing photo.

### `sense-biometric` The system prompt is the surface, and the fallback is drawn rather than assumed

Never build a face or fingerprint screen. The prompt belongs to the platform and it is the only one the user has been trained to trust, so an imitation is a security problem the user has no way to see through. Face authentication in particular runs through the platform's authentication framework rather than an AR or face recognition library, and an account holder under 13 is authenticated some other way.

- Name the method the device actually has, read from the platform rather than guessed from the OS. A button offering Face ID on a device with a fingerprint reader is wrong on the one screen where being wrong costs the most.
- The result set is eight branches, not two: no hardware, hardware busy, nothing enrolled, locked out after repeated failures, no device passcode set, cancelled by the user, cancelled by the system, and a fallback requested where the policy has none. That last one is a dead end the design created by offering a button with nothing behind it.
- Nothing enrolled has its own answer, which is the system enrolment screen, not the failure copy.
- Every biometric route has a second route to the same place that does not need the sensor, reachable in the same session. Faces get covered, hands get wet, and readers fail.
- Whether this app asks for a check at all, and what that check protects, is `auth-biometric-session`. Android refuses to combine a custom negative button with the device credential option, so one of those is the fallback and the other does not ship.

### `sense-haptic` The pattern the device cannot render is the one the design leans on

`touch-feedback` sets the vocabulary: one meaning per pattern, nothing on scroll. This is the hardware underneath it, which varies more than any other output on the phone.

- Use the platform's named feedback rather than an authored waveform. On Android the order is the view's own haptic constants first, which need no vibrate permission and honour the user's touch feedback setting, then a predefined effect, then a composition of primitives. Raw one shot and waveform calls are discouraged even where they run, because they are too loud to read as feedback: a good key click is 10 to 20 milliseconds and the actuator rings on for another 20 to 50 after it.
- On iOS the named vocabulary is the three feedback generators, impact, notification and selection, each used for the meaning it is documented to carry. Core Haptics is the authored layer below them and needs a reason before it is reached for. iOS gives the app nothing to read about whether the user wants haptics at all, so the app carries its own switch for them and stays usable with it off.
- Ask the actuator what it supports and design for the answer. That query returns three values, yes, no and unknown, and unknown means the hardware does not report and no call will settle it. Every rich pattern has a plain one behind it.
- Nothing fires while a reading is in flight: an exposure, a running video or audio recording, a motion sensor sample. The motor shakes the device the sensor is measuring. A confirmation after a scan resolves is the correct use of one, and on a scanner it is the only non-visual confirmation the surface has.
- Either switch, the system's or the app's, can silence all of it, so a haptic never carries a message on its own.

### `sense-motion` Motion sensors are data, not an input method

Where the reading is the content the user came for, a heading, a tilt, the orientation of a camera held in space, the sensor drives the view and that is the whole feature. What does not ship is motion standing in for a control the finger already has: those gestures are hard to perform precisely, and they are difficult or impossible for anyone who cannot move the device freely.

- Three get generated by reflex: tilt parallax, shake to act, and turn to scroll. Shake carries one meaning, undo, and only where the platform already gives it that meaning. The other two survive neither `motion-reduced` nor `a11y-gesture`, so if they ship at all they are decoration with an off switch and a second route.
- Sampling has a ceiling. From Android 12 a listener is capped at 200 Hz and a direct channel at about 50 Hz, and exceeding either without the high sampling rate permission throws. Which rate to ask for under that ceiling is `perf-power`.
- A compass is wrong until it is calibrated, so a heading gets a calibration state before it gets a needle.
- On mobile web the motion permission request has to be triggered by a real tap and the API is missing in some browsers, so the control that asks is one the user pressed, and the missing API is the absent state rather than a crash.

### `sense-radio` An adapter that is off is not a permission that was denied

Bluetooth and NFC split the way the camera splits in `sense-off-system`: the permission reads as granted while the adapter is switched off, and that is a different sentence with a different move behind it. iOS raises its own system alert for a powered-off adapter and the app does not draw or control it, and Android answers with its own enable request rather than a screen the app owns.

- Paired, in range and connected are three states rather than one flag, and losing the peripheral is ordinary rather than exceptional. The surface says it is gone, keeps working on everything that does not need it, and reconnects without making the user start the task again. Nothing draws a dropped connection as live.
- A nearby interaction is never the only route to its task. Distance and direction degrade behind a body, a bag or a wall, and direction disappears entirely once the phone is not roughly pointed at the other device, so there is always a way to finish without it.

### Check

Review answers each of these against the code, pointing at the line:

- Every capability that returns a value over time branches on absent, off at the system level, running, imprecise and failing, or names which of the five it folded and why. `sense-states`
- Presence is queried at runtime before the entry point is drawn, absence removes the surface rather than disabling it, and no hardware feature is declared as required unless the app cannot run without it. `sense-absent`
- Permission status and service availability are two separate reads, each with its own sentence, the ones that have a system page are deep linked to it, and neither resolves into a retry loop. `sense-off-system`
- The capturing surface shows its own running state with a stop, draws nothing inside the platform indicator's bounds, imitates no indicator, and ends with its screen unless it carries an ongoing notification or Live Activity. `sense-running`
- A capture the system stops says so on the surface as it happens, keeps and names what was already captured, and re-establishes the session on return rather than leaving a dead one. `sense-interrupted`
- The accuracy radius is read, checked for validity and rendered, no accuracy threshold is shared across platforms, and a reduced fix runs the feature in a stated form. `sense-accuracy`
- The preview's fit is set deliberately, keeps the sensor aspect ratio, has an inert shutter until the session is live, holds the screen awake while it aims or records (`perf-power`), and any scanner has a target, a time bound and a route that does not use the camera. `sense-preview`
- The platform prompt is used unmodified, named for the method the device reports, with an enrolment path and a non-biometric route in the same session. `sense-biometric`
- Haptics use each platform's named feedback with a plain fallback where support is unknown, iOS carries an in-app switch for them, none fires while a reading is in flight, and none carries a meaning alone. `sense-haptic`
- The motion sensors drive the view only where the reading is the content, no gesture stands in for a control, and a heading has a calibration state. `sense-motion`
- An adapter switched off is answered separately from a denied permission, pairing, range and disconnection each have a state, and no nearby interaction is the only route to its task. `sense-radio`

Run these on a device that is missing something on purpose: location services off, the system camera toggle off, no biometric enrolled, Bluetooth off, a call placed mid recording. Each of those states passes on a fully equipped device with everything granted, which is the only device the code was written against.

### Reaches

- `heuristics/accessibility.md`: `a11y-gesture`
- `heuristics/auth.md`: `auth-biometric-session`
- `heuristics/layout.md`: `layout-insets`
- `heuristics/motion.md`: `motion-reduced`
- `heuristics/notifications.md`: `notify-ongoing`
- `heuristics/permissions.md`: `perm-answers`, `perm-inventory`
- `heuristics/states.md`: `state-permission`, `state-interrupt`, `state-loading`
- `heuristics/touch.md`: `touch-reach`, `touch-feedback`
- `platform/performance.md`: `perf-power`

# heuristics/settings.md

## Settings

A setting is a decision the product declined to make. Somebody else will now make it, from a two word label, with less information than the team that gave up on it had.

On a phone that costs more than it costs anywhere else. Opening settings suspends whatever the person came to do; the screen is one column, so six rows is already most of it; every subscreen is a full navigation with nothing left beside it to compare against; and the label has to land at a glance, one-handed, on a moving bus. So the first question about a row is never where to file it. It is whether a better default deletes it.

Two neighbours own things that look like they belong here. Text size, bold text, contrast, reduced motion, language and region are system settings the app reads, under `a11y-settings` and `l10n-per-app`, and a second copy inside the app is the defect `set-system-owned` names. How a row is worded is `copy.md`.

Rules in this file, in order: `set-default-first`, `set-in-context`, `set-system-owned`, `set-shape`, `set-status`, `set-controls`, `set-effect`, `set-wired`, `set-sync`, `set-destructive`, `set-search`, `set-account-exit`, `set-diagnostics`.

### `set-default-first` A setting is a default nobody was willing to pick

For every row, write down the value most people would keep, and why, in `STACK.md` beside the sync marking `set-sync` already asks for there, so one table holds the key, its default, the reason, and device-local against account-level. The row survives only if two reasonable people would keep different values and nothing the app can observe says which of them is in front of it.

- The app does not ask for what it can detect: the connected accessory, the current appearance, the locale, whether the connection is metered, whether this is the device that already has the data.
- A default is not a coin toss. It is the value that is quiet, cheap in battery and data, safe to be wrong about, and reversible with one tap.
- Count the rows in the whole tree, subscreens included. That count is the number of decisions handed back to the user, and it is a finding about the product before it is a problem with the screen.

### `set-in-context` What gets changed often is not a setting

Sort order, filter, list density, playback speed, muting this one conversation, the unit on this one chart: each belongs on the screen it changes, where the result is visible while the choice is made. Filed under settings instead, it makes somebody leave the thing, guess, and come back to find out what happened.

Settings holds the rare and the app-wide. The test runs one way only: a control whose effect is visible on one particular screen belongs on that screen. Run backwards it deletes settings entirely, because a notification preference, a unit, a data saver or a privacy choice has no single screen to show its effect on, and those are exactly what the screen is for.

### `set-system-owned` A copy of a system setting is a bug, not a convenience

An app-level switch for something the OS already owns tells the user that the system's own choice may not apply here, and the two go out of sync the first time either one is touched.

Never given an app-wide duplicate in the settings screen: text size, bold text, contrast, reduced motion and transparency (`a11y-settings`), permissions (`state-permission`), the device's biometric enrolment (`auth-biometric-session`). The exemption is a control over the app's own content, sitting on the screen it affects under `set-in-context` and layering on top of the system value rather than replacing it: the type size inside a reader, not a second global text size row in settings. Language is a different shape again. The app never keeps its own language preference, and an in-app language row is allowed where it writes through the platform API, which is `l10n-per-app`.

Where the app cannot change the thing itself, the row is a route out to the system rather than a control:

- iOS: `UIApplication.openSettingsURLString` for the app's own page, and `openNotificationSettingsURLString` from iOS 16 for its notification page.
- Android: `ACTION_APPLICATION_DETAILS_SETTINGS` with a `package:` data URI, `ACTION_APP_NOTIFICATION_SETTINGS` with `EXTRA_APP_PACKAGE`, `ACTION_CHANNEL_NOTIFICATION_SETTINGS` with `EXTRA_APP_PACKAGE` and `EXTRA_CHANNEL_ID` both, since without the channel id it lands nowhere, `ACTION_APP_LOCALE_SETTINGS`. Resolve each intent before drawing the row that uses it, because the matching activity is not guaranteed to exist on a given device and a row that does nothing is worse than no row.

Each of those lands on the app's own page or on the one setting the feature needs, and a row that sends somebody off to turn off Wi-Fi or a security feature the app does not own fails review on iOS and deserves to. Which side of the line a preference lives on forks by platform too: iOS lets a handful of the most rarely changed ones be published into the system Settings app through a settings bundle, Android has no equivalent, so on a product that ships to both, the screen inside the app is the one that has to be complete.

One override is worth building rather than reading: appearance. Both platforms accept an app-level light or dark choice, `overrideUserInterfaceStyle` on iOS and `AppCompatDelegate.setDefaultNightMode` on Android, so where the product wants one the row carries three values with Match system as the default, never two, or somebody who set the system to dark cannot get back. The stored value is read and applied before the first frame is drawn, because applied any later it opens every cold start in the system appearance and then flips, which is the seam `splash-appearance` rules out from the other side.

One of these is not optional. An app that asked for the notification permission carries an in-app place where that answer can be changed, and on both platforms that place is a link into the system's notification settings rather than a second switch sitting beside the real one. What the channels behind it are is `notify-channels`.

### `set-shape` Ten rows is the ceiling, and frequency is the order

- Group under a heading with a divider, around a job the user recognises rather than the module that implements it. A group of one is not a group. Sections are `list-sections`.
- Order by how often something is changed, most changed at the top. Alphabetical and source order are both the absence of a decision.
- At ten rows on one screen the remainder moves to a subscreen, and the parent row then carries that group's own status so the level above still reads. Fifteen is not a judgement call, it is the failure: on one column that is two screenfuls of decisions before anything has been read.
- An Advanced section hides at least three rows or it does not exist, and its single line of subtext names what is inside it. A collapsed section with no preview is a locked drawer.
- A feature screen whose whole feature can be turned off carries one main switch, at the top, above everything it governs. The rows under it stay visible and disabled rather than vanishing and reflowing the screen under a thumb already on its way down, and a disabled row says what turns it back on.
- Repeating one setting in two places is allowed when two different situations send people looking in two different places. It is one setting on one subscreen with two entry points, never two controls writing the same value, and where what is repeated is a whole feature, that one control is its main switch.

**Default.** Ten rows to a screen, the rest one level down.
**Exception.** A list of instances and not of decisions: one row per account, per device, per notification kind, per blocked contact. The count is the person's own data, the rows are all the same shape, and splitting them across subscreens hides the one being looked for. Past a screenful it takes a filter, which is `search-surface`.
**Reason required.** That the rows are instances of one thing, and what they are instances of.

### `set-status` Every row shows its current value without being opened

Title, then the value it is currently set to, on the row itself. In one column this is the whole difference between reading the screen and opening six subscreens to find out how the app is configured.

- The value is a value, not the title again. Sync, Wi-Fi only. Not Sync, On.
- A switch is its own value, and anything that opens a subscreen states its value beside the chevron. The row is one target and any control on it is another, under `list-row`.

### `set-controls` Two shapes carry nearly all of it

- **On or off:** a switch on the row. A checkbox is for the negative case, restricting or blocking something, where a switch would have to be labelled with a "don't" and read backwards.
- **One of several:** a subscreen or a sheet with the options as rows. A menu that drops open under the finger is covered by that same finger, and it hides how many options exist until it is opened.
- Sliders and free text fields are the exceptions, each one costing a fine gesture or a keyboard, and each shows its current value as text next to it.
- A row that leaves the app for a web page says so before it is tapped. A settings screen assembled out of links is a website wearing a title bar.

### `set-effect` Instant or saved, and never both on one screen

- **Instant:** the change is stored and applied as it is made, with no Save. There is no Cancel either, so nothing that cannot be undone by moving the control back belongs on an instant screen.
- **Saved:** for values that only mean something as a set, such as an address or a server and its credentials. One commit action, the typed input surviving a failed commit under `form-submit`, and leaving with uncommitted changes asks first.
- The mixed screen is the defect: a switch that applies immediately sitting above a Save button, where nothing on the screen says which of the two rules the switch is following. It is what a generated settings screen produces by default, and the back gesture makes it worse, because the user can leave at any moment with no OK button in the way.
- A write that failed reports at the control that failed, under `fb-place`, and that control returns to the value actually stored rather than sitting on the one that did not take.

### `set-wired` A control nothing reads is a picture of a control

A settings screen generated from a feature list is a column of switches bound to screen-local state. They move under the thumb, they store nothing, and no code anywhere asks what they are set to. The screen looks finished, which is why this one survives to release.

- Every control writes to the preference store the stack actually uses, and at least one place outside the settings screen reads that key. A key nothing reads is a row to delete, not a row to wire up later.
- Every read states the value to use when the store answers with nothing, because it will: first launch, a reinstall, a store not ready yet. What came back empty is never written back as though the person had chosen it.
- Kill the process and open the screen again. A preference that did not survive that was never stored, whatever the switch was showing.

### `set-sync` Say what follows the account and what stays on this phone

A preference that silently appears on the other device, or silently does not, is a bug report either way.

- Decide it per setting and record it in `STACK.md`: device-local, such as appearance, downloads, and which notifications this device shows, against account-level, such as units, content preferences and privacy choices.
- A synced group says so once, in a few words, on the group. A device-local row inside an otherwise synced group says so on the row. An account-level row waits in `state-loading` until its stored value has arrived, rather than sitting interactive at a coded guess somebody will flip believing it was theirs.
- Two devices will write the same preference at different moments, so last write wins is a decision to make rather than a default to inherit, under `off-conflict`.
- What survives signing out is already ruled by `auth-signout`.

### `set-destructive` The one-way rows sit apart from the weekly ones

Clear cache, remove downloads, reset settings, leave the group, sign out, delete the account. Distance is the mechanism and the confirmation rules are `touch-destructive`.

- They are grouped at the end or on a subscreen of their own, never next to a switch somebody flips weekly, and never next to each other when one is recoverable and the next one is not. Sign out and delete do not share a group, under `auth-signout`.
- Each one names what it removes and how much of it, in the unit the person counts in: delete 1.2 GB of downloaded episodes, not clear data.
- Reset states its scope and keeps to it, meaning this group of settings rather than everything the app holds.

### `set-search` A settings tree that needs search is telling you something first

The trigger is depth, not taste: the moment one row sits three levels below the root, nobody navigates to it any more, they hunt for it. Depth that `set-shape` produced by itself does not count toward that, because an overflow subscreen and an Advanced section are its fix for a crowded screen rather than evidence of a deep tree. Then the root gets a field that matches row titles, group names and current values, and lands on the subscreen with the row it found marked. Which surface that field is and how it behaves is `search-surface`. Read the finding before shipping the fix, though: search makes a deep settings tree survivable, it does not make it right, and the row count that drove it there is the count `set-default-first` is asking about.

### `set-account-exit` Settings is where people go when they want out

Whatever else it holds, this is the screen somebody opens to stop paying, stop being sent things, or stop having an account. Burying any of them costs goodwill, and burying most of them costs a store review as well.

- The account row names who is signed in, under `auth-active-account`, and this screen also carries the entry point for signing out (`auth-signout`) and the one for deleting the account (`auth-delete`), placed apart from each other by `set-destructive`. All three belong here and none of them is redesigned here.
- A subscription sold inside the app carries a row here that manages and cancels it. Play names the missing link on the account settings screen or its equivalent as a violation, and takes either the Subscription Center at `play.google.com/store/account/subscriptions` or that same address carrying `sku` and `package` for the one subscription the row is about; on iOS the row opens the system's own sheet through `AppStore.showManageSubscriptions(in:)` from iOS 15.
- The privacy policy is reachable from inside the app rather than only from the store listing, and that one is a review requirement rather than a courtesy. The terms and a way to withdraw any consent the app collected sit here too, by this skill's placement decision: what is required of the withdrawal is that it is easy to reach and easy to understand, and settings is where this skill puts it.

### `set-diagnostics` The version, and a way to report something

The version and build are the first thing a support reply asks for, and somebody has to be able to read them out loud off a phone they are holding at arm's length. They go on an About subscreen with the licences, one level down, rather than taking a row at the top from something adjustable. Beside them sits one route to support that attaches the version, the device and the locale by itself: a report typed with a thumb will not carry them, and without them it cannot be answered.

### Check

Review answers each of these against the code, pointing at the line:

- Every setting has a line in `STACK.md` naming its default and why that default could not settle the row, nothing is asked for that the app can detect, and the total row count across the tree is reported. `set-default-first`
- No frequently changed option, filter or sort lives in settings instead of on the screen it changes. `set-in-context`
- No app-wide row duplicates a system setting, no language preference is stored outside the platform API, every row the app cannot fulfil itself is a deep link resolved before it is drawn and aimed at the app's own page, including one in-app place to change the notification answer, and any appearance row offers three values with Match system as the default and applies the stored one before the first frame. `set-system-owned`
- No screen holds more than ten rows, groups carry headings, order runs by frequency, any Advanced section hides at least three rows behind one line of subtext, and a feature that can be switched off entirely has one main switch above dependent rows that stay visible and disabled. `set-shape`
- Every row shows its current value, and no subscreen has to be opened to find out what the app is set to. `set-status`
- On and off is a switch, one of several is a subscreen or sheet rather than a dropdown, and every slider or text field shows its value. `set-controls`
- The screen is instant or saved, stated by what it shows, with no instant control on a screen that has a commit action. `set-effect`
- Every control writes to the preference store, every key is read somewhere outside the settings screen, every read declares a default, and the values survive killing the process. `set-wired`
- Every preference is marked device-local or account-level, the screen says which, an account-level row waits for its stored value instead of offering a guess, and the collision rule for two devices is written down. `set-sync`
- Destructive rows are grouped away from frequent ones, each names what it removes and how much, and sign out is not adjacent to delete. `set-destructive`
- No row sits three levels below the root without a search field on the root, counting depth the shape rules did not create, and the tree's row count is reported as a finding alongside it. `set-search`
- The signed-in account, a subscription route that works on both stores, the policy links, the consent withdrawal and the entry points for sign out and deletion are all present and reachable in one screen. `set-account-exit`
- Version and build are on an About subscreen, and the support route carries version, device and locale without the user typing them. `set-diagnostics`

Three of these are not in the diff. Kill the process from outside the app, with Don't keep activities or `adb shell am kill`, then reopen the screen to find out which of `set-wired`'s values were really stored. The frequency judgements in `set-in-context` and `set-shape` are answered by which controls the app's own screens change often, which is a question for the product rather than for the settings file.

### Reaches

- `heuristics/accessibility.md`: `a11y-settings`
- `heuristics/auth.md`: `auth-biometric-session`, `auth-signout`, `auth-active-account`, `auth-delete`
- `heuristics/feedback.md`: `fb-place`
- `heuristics/forms.md`: `form-submit`
- `heuristics/lists.md`: `list-sections`, `list-row`
- `heuristics/localization.md`: `l10n-per-app`
- `heuristics/notifications.md`: `notify-channels`
- `heuristics/offline.md`: `off-conflict`
- `heuristics/search.md`: `search-surface`
- `heuristics/splashscreen.md`: `splash-appearance`
- `heuristics/states.md`: `state-permission`, `state-loading`
- `heuristics/touch.md`: `touch-destructive`

# heuristics/sharing.md

## Sharing

Sharing is how the app leaves the phone. Something inside it becomes a message, a post, a file in someone else's app, and then comes back the other way when this app is the destination. Sending a copy out and taking one in is the whole of the subject here. Inviting someone into a document to work on it alongside you is collaboration, which is a different problem and is not covered.

Two things make it a phone problem rather than a general one. The share surface is not yours: the system sheet is drawn by the OS, ranked by the OS, and populated from apps you cannot enumerate. And the app is suspended the moment it opens, so whatever gets handed over has to be finished, small, and correct before the sheet appears. Coming back in, a share arrives on a device already showing something else, on top of work the user was in the middle of.

Rules in this file, in order: `share-sheet-only`, `share-payload`, `share-link-not-shot`, `share-preview`, `share-ready`, `share-file-uri`, `share-outcome`, `share-payload-clean`, `share-accepts`, `share-arrives`, `share-targets`, `share-copy`, `share-paste`, `share-invite`.

### `share-sheet-only` The system sheet is the share UI

A drawn row of service logos is the pattern to delete. Both platforms land in the same place from opposite sides: no app-drawn list of share targets and no variation on the sheet, because the Share control is expected to open the system activity view and anything else in its place only confuses. The sheet is the only surface that knows which apps are installed on this phone, which conversations are recent, and which system destinations exist at all. Six hardcoded logos are a guess about a stranger's device, and they rot every time one of those apps changes a URL scheme.

| Stack | Entry point |
|---|---|
| SwiftUI | `ShareLink` |
| UIKit | `UIActivityViewController` |
| Compose and Android views | `Intent.createChooser()` wrapping `ACTION_SEND`, or `ShareCompat` |
| Flutter, React Native | the bridge to the two rows above, never a drawn list |
| Mobile web | `navigator.share()`, offered only when `navigator.canShare?.(data)` agrees for the exact payload |

Skipping `createChooser()` on Android gets the intent resolver's disambiguation dialog instead of the Sharesheet, which is a different and worse surface. Put the control in the chrome on the platform's own share glyph (`icon-one-set`), sized as a target like anything else (`touch-floor`), and exclude what does not apply: your own targets on Android with `EXTRA_EXCLUDE_COMPONENTS`, system activities the content cannot go to on iOS with `excludedActivityTypes`.

On the web the sheet is conditional in a way it never is in a native build: `navigator.share()` exists only in a secure context and is missing from browsers that are still in use, so the copy path (`share-copy`) is the route, not a courtesy. Test the property before calling it and test the payload you are about to send, because `canShare()` with no argument is false everywhere: a bare `if (navigator.canShare())` hides the control on the browsers that support it fully, and reaching the method at all throws on the ones that do not have it.

### `share-payload` One item, one concrete type

`ACTION_SEND` carries a single item and `ACTION_SEND_MULTIPLE` a list, with the content in `EXTRA_TEXT` or `EXTRA_STREAM`. Declare the MIME type the content actually is. A wildcard is never that type: most receiving apps cannot take anything, so `*/*` fills the sheet with destinations that will fail on the payload. On the web, `navigator.share()` rejects with a `TypeError` unless at least one of `title`, `text`, `url` or `files` is present, so a share assembled from a half-loaded model throws instead of opening. Text and its link are one payload, not two shares, and the wording of that text is `copy-budget`.

### `share-link-not-shot` Share the thing, not a picture of the thing

A screenshot cannot be opened, followed, or read by anyone using a screen reader. Share a URL that resolves to a real page for someone without the app and opens the app for someone who has it: a universal link declared through the `applinks:` entitlement, an App Link with `android:autoVerify="true"`. Both are verified from a file the domain serves over HTTPS at `/.well-known/`, `apple-app-site-association` and `assetlinks.json`, and neither is live the moment the file goes up. On iOS the association file is fetched through a CDN within 24 hours and devices re-check it about once a week. On Android verification runs at install and at update, inspectable with `pm get-app-links` and re-runnable with `pm verify-app-links --re-verify`. Either way a domain change is not live for anyone already holding the app. A custom scheme such as `myapp://` pasted into a message is plain text on every device that has not installed you. Routing the link once it arrives is `nav-deeplink`.

### `share-preview` Hand the preview over, do not make the destination fetch it

From Android 10 (API 29) the Sharesheet shows a preview of shared text, built from `EXTRA_TITLE` plus a thumbnail passed as a content URI with read permission granted. On iOS the two entry points behave differently. `ShareLink` with no supplied preview shows a placeholder link icon beside the bare URL while it pulls the metadata over the network, and a supplied preview renders immediately with no fetch at all. `UIActivityViewController` derives nothing on its own: the preview comes from `activityViewControllerLinkMetadata(_:)` or an `LPLinkMetadata` handed over at the call site, and without one there is no preview. That fetch runs on the same phone connection the user is already waiting on, in front of a sheet that is already open.

The system can only derive a preview for a bare URL or a plain string. Anything else, and anything whose title should read differently from the page's own, is supplied at the call site: the title, the image and the type. The preview is also the last thing the sender sees before the send, so it is the place a wrong image or a stale title gets noticed, which is a reason to get it right rather than a reason to omit it.

### `share-ready` The payload is finished before the sheet opens, and not built on the drawing thread

The item-source callbacks on iOS run on the drawing thread, so nothing that takes real time to produce belongs inside one: that is what the provider and placeholder forms exist for (`perf-main-thread`). On iOS and Android, prepare the item on tap, show a placeholder while it resolves, and open the sheet on data that exists.

The web will not take that shape. `navigator.share()` requires transient activation, so an `await` between the tap and the call spends the gesture and the promise rejects with `NotAllowedError`, and unlike the clipboard write there is no promise the call will accept and wait on. So on the web the payload exists before the tap or the control is not offered yet, and `share()` is called synchronously in the handler. Either path is held to the thresholds in `perf-main-thread`, measured on the slowest device you support (`perf-measure`).

### `share-file-uri` A file leaves as a granted content URI

On Android, hand out `FileProvider.getUriForFile()` and grant it with `addFlags(FLAG_GRANT_READ_URI_PERMISSION)`, which is the secure route and is preferred over calling `grantUriPermission()` yourself. A `file://` URI from `Uri.fromFile()` needs the receiving app to hold storage permission, which major targets such as Gmail do not, so the share fails on exactly the destinations that matter. Resize and crop before handing over instead of sending the original capture: those bytes cross a phone network first and the destination re-encodes them anyway. WebP or AVIF for images and AV1 or HEVC for video carry the same picture in less (`net-upload`).

### `share-outcome` The app does not get to say where it went

Web Share is fire and forget: the promise resolves with `undefined` and never names the target, and its rejection is worse than useless, since one and the same `AbortError` covers the user cancelling and the device having no share target at all. Android tells you the chosen component only if you pass an `IntentSender` to `createChooser()` and read `EXTRA_CHOOSER_RESULT` back. So "Shared to WhatsApp" is usually a fiction, and on most paths a cancelled sheet is indistinguishable from a completed share.

The sheet closing is the feedback (`fb-silent-success`), and a toast fired on dismissal claims something that did not necessarily happen. Nothing in the product is unlocked, rewarded, counted or advanced on the strength of a share the app cannot observe.

### `share-payload-clean` What goes out is what the user saw

The code adds things the user did not: EXIF location and device model inside a photo, a session token or account id appended to a share URL, an internal identifier in a filename. Strip metadata the destination has no use for, and build the outgoing link from public identifiers only. Anyone the link reaches can open it, so it may not carry anything that authenticates the person who sent it, and a share is not a hole in `priv-instrument`.

The sheet itself is a transfer the user asked for and picked the destination of, so it falls outside the store's data sharing declaration. What does turn that declaration on is anything the app sends alongside or behind the share: an analytics event carrying the content, an SDK handed the same payload, a server-side copy taken on the way past. Those are declared like any other transfer (`priv-declared`).

### `share-accepts` Declare narrowly what the app receives, then distrust all of it

Being a share target is an intent filter on `ACTION_SEND` or `ACTION_SEND_MULTIPLE` with category `DEFAULT` and a concrete `mimeType`, or a share extension on iOS. Accept the widest range you genuinely handle, and never declare `*/*` unless that claim is true. Then treat everything that arrives as written by a stranger, because it was: the wrong type under the right label, an image far larger than the screen, a file that is not what its type says. Decode it off the UI thread. What cannot be handled gets a real failure state with a way forward (`state-error`), never a crash and never a silent discard.

### `share-arrives` A share lands on a phone that was already busy

The user was mid-form somewhere else, so the incoming share is an interruption rather than a launch (`state-interrupt`, `form-persist`). Decide before building whether it opens its own task or joins the one in progress, and write that decision where it can be read: the launch mode and task flags on the receiving activity, `documentLaunchMode` where each share becomes its own document, the extension's own dismissal path on iOS. Either way the interrupted work is still there on return (`nav-restore`). Keep the receiving surface to a few steps: a share or action extension finishes the job quickly and stacks no further modal views inside itself. Work that takes real time continues in the background with its status visible in the main app, and finishing it is not by itself worth a notification.

### `share-targets` Do not inject destinations, publish them

The two directions have opposite answers. As the sender you add no destinations of your own: on Android `EXTRA_CHOOSER_TARGETS` and `EXTRA_INITIAL_INTENTS` are capped at two apiece and discouraged either way, since each one displaces a target the system would have ranked better. As the receiver you expose your own conversations through the Sharing Shortcuts API, which since Android 11 (API 30) is the only mechanism, the older chooser target service having been deprecated there. Publish long-lived shortcuts ordered by importance, report use so ranking has a signal, and drop stale ones, a conversation with no activity in the last 30 days counting as stale.

An action is not a destination, and both platforms leave room for one: custom sheet actions on Android 14 (API 34), a custom activity on iOS, which the sheet lists ahead of the system ones. Either is for something your app does to the content, never a second copy of a destination the sheet already carries, and its title is a short verb phrase with no product name in it.

### `share-copy` Copy is the fallback, and its confirmation is per platform

Copy to clipboard is the answer when there is no destination to share to, when the user needs the raw string such as a code or an address, and on any path where the sheet is unavailable. The confirmation is not one decision. Android 13 (API 33) and later shows a system confirmation with a preview of what was copied, so the app's own toast or snackbar is removed at that level, while API 32 and below still needs the app to say something. iOS shows nothing at all, so there the app owns the feedback (`fb-ladder`). Copying a password, a card number or a recovery code sets `ClipDescription.EXTRA_IS_SENSITIVE`, so the system preview does not put the secret on screen.

### `share-paste` Reading the clipboard is a visible act

Android 12 (API 31) and later shows the user a toast naming your app when it calls `getPrimaryClip()`. iOS 16 and later puts a permission alert in front of a programmatic read, and exactly three routes skip it: the system Paste menu item, the keyboard shortcut, and `UIPasteControl`, where the tap itself is the consent. A Paste button you draw yourself and wire to `UIPasteboard.general.string` is a programmatic read and raises the alert like any other. So a clipboard read happens because the user asked for one through one of those routes, never at launch and never to sniff a referral code out of the background. Inspecting without reading raises neither notice: `getPrimaryClipDescription()` on Android and `detectPatterns(for:completionHandler:)` on iOS, and knowing the type is usually enough to decide whether to offer a paste at all.

### `share-invite` An invite link opens a screen, not a login wall

Where the sign-in is to a specific social network, the App Store requires access without it or through some other mechanism, and it names inviting friends and sharing to a social network as things that do not count as core functionality. A referral programme is not what makes such a sign-in core, and social network credentials and tokens are never stored off the device. Where the gate is your own account and the app has no significant account-based features behind it, the guideline is softer but points the same way: let people in and ask later. The screen someone reaches from an invite shows what they were invited to before it asks for anything (`onboard-look-first`), and it is not the cold-launch home screen: the link named a thing and that thing is what opens (`nav-deeplink`). Attribution comes from the referrer the platform hands you, not from the clipboard (`share-paste`).

### Check

Review answers each of these against the code, pointing at the line:

- Sharing goes through the platform's own sheet, no component draws a list of service targets, and Android calls `createChooser()`. `share-sheet-only`
- The payload declares a concrete MIME type, never a wildcard, and cannot be assembled empty. `share-payload`
- What is shared is a link that opens for a stranger and is verified from `/.well-known/`, not a screenshot and not a custom scheme. `share-link-not-shot`
- Title, thumbnail and type are supplied to the sheet rather than left for the destination to fetch. `share-preview`
- Payload construction happens off the drawing thread and completes before the sheet is opened, with no `await` between the tap and a web share. `share-ready`
- Files are shared as granted content URIs, never as filesystem paths, and are resized before they leave. `share-file-uri`
- No UI names the destination of a share, and nothing is rewarded or unlocked on a share completing. `share-outcome`
- The outgoing payload carries no EXIF or device metadata, session token or internal id. `share-payload-clean`
- Declared incoming types match what the app actually handles, and every incoming item is validated and decoded off the UI thread. `share-accepts`
- The receiving entry point states its launch mode, task behaviour or dismissal path, and the work the share interrupted is still there afterwards. `share-arrives`
- No custom chooser targets or initial intents on Android, any iOS custom activity acts on the content instead of duplicating a destination, and conversations the app owns are published as system share shortcuts with stale ones removed. `share-targets`
- Copy feedback follows the platform: no app toast where the system already confirms, and sensitive copies are flagged. `share-copy`
- The clipboard is read only from a user action, never at launch. `share-paste`
- Invites and referrals are reachable without an account, and their link opens the thing it named. `share-invite`

### Reaches

- `heuristics/copy.md`: `copy-budget`
- `heuristics/feedback.md`: `fb-silent-success`, `fb-ladder`
- `heuristics/forms.md`: `form-persist`
- `heuristics/icons-and-imagery.md`: `icon-one-set`
- `heuristics/navigation.md`: `nav-deeplink`, `nav-restore`
- `heuristics/onboarding.md`: `onboard-look-first`
- `heuristics/privacy-ui.md`: `priv-instrument`, `priv-declared`
- `heuristics/states.md`: `state-error`, `state-interrupt`
- `heuristics/touch.md`: `touch-floor`
- `platform/network.md`: `net-upload`
- `platform/performance.md`: `perf-main-thread`, `perf-measure`

# heuristics/sound.md

## Sound

Sound the app makes on its own: a tap tone, a success chime, an error beep, a loop under a screen. It is the only output the app has that reaches people who never installed it, so the cost is paid by the room and the benefit is collected by one person. A phone is carried into meetings, waiting rooms, buses and bedrooms, and silencing it is what people do on the way in.

The player and the audio somebody pressed play on are `media-system-player` and `media-unasked-sound`. The sound attached to a notification is fixed on its channel, which is `notify-channels` and `notify-level`. Haptics are `touch-feedback` and `sense-haptic`. What is left, the noise the interface makes by itself, is this file, and for most apps the right size of it is zero.

Rules in this file, in order: `sound-inventory`, `sound-silenced`, `sound-mixes`, `sound-system-sound`, `sound-never-alone`, `sound-unasked`, `sound-off-switch`.

### `sound-inventory` A short list with fixed meanings, and an empty list is a legitimate answer

Write the set down in `STACK.md` before any of it is coded: the event, what the sound means, and what the screen shows at the same moment. Every play site in the code maps to one entry, and nothing plays that is not in it.

- One sound per meaning and one meaning per sound. Two samples that both mean "done" teach nothing, and one sample doing duty for saved and for deleted teaches the wrong thing.
- Frequency decides what survives. The more often an action happens, the worse a sound on it ages, so the first cuts are the ones on taps, scroll, keystrokes, screen changes and content arriving. What is left is rare and consequential: a payment sent, a scan matched, a timer that has run out while the phone was face down. The exception is a control whose platform behaviour already includes a sound, a keyboard key, a dialpad or a shutter: that one is played through the platform's own gated API (`sound-system-sound`) and counts as one entry rather than one per press.
- A sound is worth its slot only when the user's eyes may be elsewhere. Anything confirming something already visible on screen is decoration, and `fb-silent-success` has already ruled on it.
- Nothing plays while the app is not the thing on screen. Sound coming out of a screen nobody is looking at is a notification wearing the wrong clothes, and a notification is silenceable per kind while this is not.

### `sound-silenced` One platform settles it with a category, the other leaves most of it to the app

On iOS the answer is the audio session category, chosen once for the app rather than branched on at each play site.

| Category | Hardware silent switch | Other apps' audio |
|---|---|---|
| `.ambient` | silences the app | mixes with it |
| `.soloAmbient`, the default | silences the app | takes the output |
| `.playback` | keeps playing | mixes only if the option is set |

Interface sound is `.ambient`. `.playback` survives the hardware switch and belongs to the two cases `media-unasked-sound` owns, neither of which is interface sound. Picking it for a chime is the app deciding the hardware switch does not apply to it. Note that the silent-switch half of `.ambient` is already what the `.soloAmbient` default gives you, so the thing `.ambient` is actually chosen for is mixing, which is `sound-mixes`.

Android has no session category, and no single user gesture answers the same question for an app's own sound. Do Not Disturb at total silence is the case that does reach it: under `INTERRUPTION_FILTER_NONE` every audio stream except a phone call is muted along with the notifications and the vibration. The ringer mode and the volume keys act on streams rather than on a category the app declared once, so between those the discipline is largely the app's own. Two things exist to use:

- `Settings.System.SOUND_EFFECTS_ENABLED`, the user's own toggle for interface sound. `View.playSoundEffect` and the `AudioManager.playSoundEffect(int)` overload fire only when it is on. The overload that takes an explicit volume, `playSoundEffect(int, float)`, carries no such gate, so it is read against the setting like any sample the app plays through its own player. That reading happens before the sound plays, or the app is the one noise left on a phone where the user switched interface sound off.
- `AudioAttributes` built with `USAGE_ASSISTANCE_SONIFICATION` and `CONTENT_TYPE_SONIFICATION`, which is how the system is told this is interface sound. Untagged, it is filed as media and treated as media.

Sound and haptics are not gated the same way there, and a helper that switches both on one flag is wrong on one of them. Sound still asks: the framework's own click checks the user's setting, and an app-played sample has to. Vibration no longer does, because the setting behind it was deprecated at API 33 in favour of vibration usages the system applies on the app's behalf.

The app never sets the system volume or the ringer mode. On iOS the system volume governs what leaves the speaker, and repurposing the volume buttons or defeating the Ring/Silent switch is an App Store rejection rather than a taste question. On Android the APIs to move both exist and only a ringer change that would toggle Do Not Disturb is gated, behind Notification Policy Access, so there the rule is discipline rather than a wall and a reviewer should expect to find the call rather than a compile error. Balancing one of the app's own sounds against another is fine, so a sound that is too quiet is mixed too quiet rather than fixed by turning the device up.

The decision is made once, at the level where the platform exposes it, and never as a runtime test of whether the phone happens to be silenced right now. Code that plays a sound only after inspecting the ringer or the mute state has moved a system guarantee into a branch that will be wrong on some device, some launch, or some version.

### `sound-mixes` A chime lands on top of whatever is already coming out of the speaker

The failure is loud and the documented default is the one that produces it. `.soloAmbient` is the default iOS category and it does not mix, so an app that never states a category can put its first chime through a podcast that then does not come back. Say which category the app uses rather than inheriting one.

- Interface sound mixes. On iOS that is the `.ambient` category. On Android it is a sonification-tagged sample short enough to be over before it could duck anything, so it rides alongside the music rather than competing for it. Nothing outside a player is worth taking the output for.
- A UI sound never activates and deactivates a session around itself. Whether a sample has to hold audio focus at all on a current Android is a playback question, and `media-focus` owns it along with the gains, the losses and the ducking.
- A sound has no route back. If the other app's music is quieter after the chime, or gone, the category is the first place to look: a non-mixing `.soloAmbient`, a `.playback` with the mixing option unset, or a focus request that should not have been made. Where a session really is being activated around the sound, the missing deactivation belongs to `media-unasked-sound`.
- Test it the way it will happen: start music in another app, then use the screen. Every sound the app makes should land on top of that music without changing it, and the music should be at the same level when the screen is closed.

### `sound-system-sound` Play the platform's sound before shipping one

The system already has the sounds for the actions the system invented, and its versions are the ones the user recognises from every other app on the phone.

- iOS: Audio Services for short sounds. Android: `View.playSoundEffect` with `SoundEffectConstants.CLICK`, which arrives already gated on the user's setting. Flutter reaches a deliberately small set through `SystemSound.play`, where `click` is the value that carries on phones and the others are documented as platform-limited, so confirm one runs on both before an action depends on it.
- Shipping a sample for a key press, a lock, a shutter or a click replaces something recognised with something that is not, and every asset is download size the user sees before any of the design (`perf-size`).
- The constraints on the short-sound path are real: through iOS Audio Services the file is at most 30 seconds, linear PCM or IMA4, packaged as `.caf`, `.aif` or `.wav`, with no volume control, no looping, no stereo placement, and one sound at a time. An mp3 is not a supported format there. That path also plays on the device speakers without audio routing, so the chime comes out of the phone rather than the headphones the user is wearing, which on its own decides whether it suits the sound. Anything richer is an audio session, which is `media-unasked-sound`.
- Mobile web has neither a system sound to borrow nor an interface-sound setting to read. Audio there is gated on the user having interacted with the page, so a sound not started from a touch may never fire at all, and a build that ships to the browser as well carries the signal on the screen and treats the sound as the part that may be missing.
- A sound on a repeated action is varied per play in pitch and level rather than shipped as one identical sample. The system does exactly that for the keyboard, and it is why forty taps in a row stay bearable.
- A haptic beside a sound is written, not inherited. The iOS alert-sound path vibrates only where the user has switched vibration on for the ringer, and drops the vibration entirely while the session is set to `.record` or `.playAndRecord`, so an app that leans on it for the felt half of a signal loses that half on two ordinary devices. Pair the sound with a feedback generator explicitly, under `sense-haptic`.

### `sound-never-alone` Design the screen muted, then decide whether to add sound

An install may never hear any of it: the phone is silenced, muted, in a pocket, on a table across the room, or held by somebody who cannot hear it. `a11y-media` and `color-not-alone` set the law; the working rule is the order in which the screen gets built.

Build and review it with the device muted first, so nothing on it depends on being heard. A chime firing alongside a snackbar is an addition. A chime firing instead of one is a state that was never drawn, and `fb-reach` calls that undelivered. A sound and a haptic are not substitutes for each other either, since either can be switched off on its own.

The two places this breaks are worth naming, because both look finished on a developer's desk with the volume up. A failure that beeps and changes nothing on screen leaves the user tapping again. A long operation that announces its end with a sound and no visible completion leaves someone who put the phone down with no way to find out it worked, which is the exact situation the sound was added for.

### `sound-unasked` Nothing starts making noise because a screen opened

Sound follows a touch. Launching, arriving at a screen, a card scrolling into view, a fanfare over a result nobody asked to celebrate: each one plays into a room the app cannot see, and it lands on whoever is nearest rather than on the user.

- Where a soundtrack or an ambient loop is genuinely the point, it starts from a control the user reaches on the first screen, not before it, and stopping it is one step from anywhere it can be heard.
- Audio that does start by itself owes a control that stops it, or its own volume separate from the system's. On the web that is an accessibility floor rather than a courtesy, and WCAG puts the line at anything running past 3 seconds. Native publishes no number, so take the same 3 seconds as the working one, and it applies to a splash animation and a game menu alike.
- Whether a media surface may start by itself is `motion-autoplay`, and claiming the speaker at launch is `media-unasked-sound`. The addition here is that outside a player there is no case for it at all.

### `sound-off-switch` One switch, in the place that already owns the sound

An app-level control is right only where nothing above it can turn the sound off. A click played through the framework's effect API already obeys the user's system setting, and a notification's sound is not this file's to switch at all: `notify-channels` owns it on both platforms, including the iOS half where the per-kind control does belong inside the app. Duplicating a control the system already offers is the bug `set-system-owned` names.

- Samples the app plays itself are the case that needs one: a single switch for the app's own sound, sitting beside what it affects, read by every play site (`set-wired`), and persisted across launches.
- One switch for the whole set, not one per event. A set small enough to defend under `sound-inventory` is small enough to turn off as a unit, and a sound settings screen with six rows is the inventory admitting it is too long.
- A better default is cheaper than a switch (`set-default-first`). Where the sound is decoration rather than a signal, that default is off, and the switch exists for the people who want it back.

### Check

Review answers each of these against the code, pointing at the line:

- Every play site maps to an entry in a written set of sounds, each with one meaning, and a sound on a frequent event survives only where it is the platform's own behaviour for that control, played through the platform's gated API. `sound-inventory`
- iOS interface sound uses `.ambient` rather than `.playback`, Android tags it as sonification and reads the user's interface-sound setting before playing its own sample, and nothing in the app changes the system volume or the volume buttons. `sound-silenced`
- The audio session is configured rather than left at the default, no play site activates a session or requests focus around a UI sound, and other apps' audio is at the level it was at before. `sound-mixes`
- Recognised system actions use the platform's own sound, and any shipped asset meets the format limits of the API playing it and varies when it repeats. `sound-system-sound`
- Every play site sits beside a visible state change, and the screen was built and reviewed muted. `sound-never-alone`
- No sound starts on launch, on navigation or on content appearing, and anything self-starting past 3 seconds has a stop control or its own volume. `sound-unasked`
- Sound the system cannot already silence has exactly one in-app switch, wired into every play site and persisted, and nothing duplicates a control the system already offers. `sound-off-switch`

Two of those halves are not answerable from a diff. Whether other apps' audio comes back at the level it was at, and whether the muted screen still carries every signal, are settled on a device with music playing and the volume down; what the code can show is the half stated before each of them, that no play site claims a session or focus and that every play site has a visible state change beside it.

### Reaches

- `heuristics/accessibility.md`: `a11y-media`
- `heuristics/colors.md`: `color-not-alone`
- `heuristics/feedback.md`: `fb-silent-success`, `fb-reach`
- `heuristics/media.md`: `media-system-player`, `media-unasked-sound`, `media-focus`
- `heuristics/motion.md`: `motion-autoplay`
- `heuristics/notifications.md`: `notify-channels`, `notify-level`
- `heuristics/sense.md`: `sense-haptic`
- `heuristics/settings.md`: `set-system-owned`, `set-wired`, `set-default-first`
- `heuristics/touch.md`: `touch-feedback`
- `platform/performance.md`: `perf-size`

# heuristics/splashscreen.md

## Launch surface

The one surface in a mobile app the app does not draw. The operating system puts it up the moment the app is launched, from the icon or from anywhere else, before a single line of the product has run, and takes it down when the first real frame is ready. It exists to hide that gap. It is not a title card, not a brand moment, and not a place to say anything.

It is also the highest frequency screen in the product. It appears on every cold and warm open for the life of the install, which is several times a day, for years. Every millisecond added to it is spent again on each of those opens.

One naming trap sits under the whole subject and it breaks rules written from either platform alone. iOS calls this the launch screen and forbids a logo on it, reserving the word splash for a branded graphic shown later, inside the app. Android calls its version the splash screen and puts the app icon on it by default. "Show the logo on the splash" is correct on one platform and a violation on the other.

The branded moment that happens once, inside the app, is `onboard-splash`. The wait that continues after this surface is gone is `state-loading`. Per stack keys, attributes and dismissal APIs are in `references/launch-surface.md`, for one lookup rather than a read through.

Rules in this file, in order: `splash-system`, `splash-double`, `splash-contents`, `splash-match`, `splash-no-progress`, `splash-hold`, `splash-no-floor`, `splash-appearance`, `splash-animation`, `splash-daily`, `splash-entry`, `splash-first-frame`.

### `splash-system` The system draws it, the app only configures it

There is no code running on this surface. On iOS it is a property list dictionary or an inert storyboard with no outlets, no actions and no custom classes. On Android 12 and up it is a set of theme attributes, and the compat library puts the same surface back on older releases from a single theme.

A screen the app draws is a different thing wearing the same name. A splash route in the navigator, a dedicated splash Activity, a `<Splash />` component with its own timer: each of those runs *after* launching has already finished, so it adds time to the open rather than covering it. The enter animation belongs to the system and cannot be replaced.

### `splash-double` One surface between the icon and the first screen

Count them. The answer is one.

Two is what ships when a dedicated splash Activity survives into Android 12: it now plays after the system splash instead of being the only one. On the cross platform stacks the same shape appears as a splash component rendered on top of an already dismissed native surface.

Where a routing activity has to stay, hold the system surface across it rather than drawing a second one, so the same surface transfers to the destination.

### `splash-contents` What may be on it is narrower than the design assumes

Two element sets, one per platform. One asset shipped to both is wrong on one of them.

- **iOS:** only what is already on the first real screen. A background color, and the empty navigation, tab or tool bars if that screen has them. No text of any kind, no logo, no illustration, unless it is a fixed part of the first screen. If the first screen is a solid color, the launch screen is that solid color and nothing else.
- **Android:** a single opaque window background color, the app icon as a vector, and optionally a circle behind it. One third of the icon foreground is masked, so anything drawn in the outer third is gone. The window background carries no transparency, and the centre icon is not guaranteed: the platform decides whether it appears unless the app opts in through `windowSplashScreenBehavior`. The branding image slot at the bottom stays empty. Every size the icon and that slot have to hit is in `references/launch-surface.md`.

Neither platform gets a tagline, a version string, a copyright line or a loading message.

### `splash-match` It matches the frame that replaces it

The background is the first real screen's background token, at the same value, in the same appearance. Not the brand color, unless those are the same thing. Anything that differs shows up as a flash on every open, which is the exact opposite of what the surface is for.

Orientation follows what the app itself supports. An app that runs in both orientations launches in the one the device is already held in, and an app locked under `layout-orientation` launches in the orientation it is locked to.

On Android the background reaches the surface through the splash screen attributes. A launch theme that sets `android:windowBackground` is the pre Android 12 pattern, and from Android 12 the system discards that theme and draws its own default splash instead, so the color that was matched so carefully never appears at all.

### `splash-no-progress` Nothing on it measures anything

No spinner, no progress bar, no percentage, no status line naming a step. The surface is a static image the system composites, with no access to the work happening behind it, so any number written on it was invented. A staged sequence of stages and percentages is a script driven by a timer, and it reports on nothing.

Once the app is stable enough to take the surface down, there is nothing left to spin about. A spinner that feels necessary here is the signal that the surface was held too long: `splash-hold`.

### `splash-hold` Hold it only for work that has a bound

What legitimately holds it: a session token read from local storage, a theme or token set resolving, a font loading. Local, fast, and finite.

What does not: a network request. There is no bound on one, and on iOS a launch that never draws its first frame is killed by the watchdog, while on Android the surface times out and the wait simply becomes visible.

The budget the hold is spent from is `perf-cold-start`. The moment the work stops being local and bounded, take the surface down and let the real screen do the waiting with a placeholder, which is `state-loading`. Every hold mechanism takes a condition that has to become false, so write the failure path first: name what flips it when the read fails, returns nothing, or hangs.

### `splash-no-floor` No artificial minimum

A timer that keeps the surface up for a fixed two seconds so a logo can be admired is time taken from the user on every open, several times a day, forever. Ready in 180 ms means shown for 180 ms.

Read the dismissal path. Any duration in it that is not the platform's own fade is a floor, and it is the single most common thing added to a launch surface that should not be there.

### `splash-appearance` It cannot read a theme, translate, or scale

It resolves before the app runs, which decides three things rather than one.

- Dark and light are separate resources: an appearance aware color set on iOS, a night qualified resource on Android, the dark block in the config on the cross platform stacks. A light asset in front of a dark first screen flashes on every open in dark mode.
- No text is a localization rule, not a taste one. The string layer cannot reach this surface, so anything written on it ships in one language to everyone: `l10n-strings`.
- Nothing on it responds to the text size setting either, which is the second reason nothing on it is text: `type-scaling`.

### `splash-animation` Movement on it extends the wait it exists to hide

The iOS launch screen is static and has no mechanism to be otherwise. On Android the centre icon may be an animated vector, under three limits: at most 166 ms of delay before it starts, which the platform bounds; at most 1000 ms of animation, which is this file's ceiling; and a loop rather than a longer one shot if the app is still not ready. The declared duration only reports the animation's length to a custom exit. It changes neither the animation nor how long the surface stays up.

Taking over the exit animation makes the app responsible for removing the surface, and a path that skips the removal leaves it on screen permanently. That exit is also the only movement here `motion-reduced` can reach: the enter animation belongs to the system, which answers the device's animation setting on its own, and no app code is running yet to read a flag.

### `splash-daily` It belongs to the cold open, not the first one

Three kinds of open, and this surface belongs to two of them. Cold, with no process: it shows. Warm, process gone but the app in the recents list: it shows. Hot, coming back from the background with everything alive: it does not, and a build that draws its own splash on resume has turned a free return into a wait.

So nothing on it is a first run event. No welcome, no version notice, no changelog, no tip. Whatever appears here appears on the thousandth open as well.

### `splash-entry` It hands over to whatever the launch was for

Most opens are not an icon tap. A notification, a deep link, a widget and a share sheet all start the same cold launch, and the surface comes down onto whatever the app draws first. Draw the home screen and push the target after it, and the user watches a second transition, which is precisely the transition this surface existed to hide.

So the destination is resolved before the first draw, from the intent, the launch URL or the payload, rather than in an effect that runs once a screen is already up. Every cold entry point the app declares is one of these. What sits underneath the destination is `nav-deeplink`, and the payload that names it is `notify-destination`.

### `splash-first-frame` The frame after it is already the screen

The handoff is invisible only if what replaces the surface is the screen and not a stand in for it. That frame already carries the chrome (navigation bar, tab bar, header), sits inside the safe area (`layout-insets`), and shows the content as placeholders in its real shape (`state-loading`).

A blank screen, a centered spinner or a second background color after the launch surface means the surface covered nothing and the wait simply moved.

### Check

Review answers each of these against the code, pointing at the line:

- The launch surface is configured through the platform mechanism, and no route, activity or component draws a second one on the launch path; a first run branded frame is `onboard-splash` and is not this surface. `splash-system`
- Exactly one surface sits between the launch and the first real screen. `splash-double`
- The surface holds only the elements its platform allows, and the iOS and Android assets are not the same file. `splash-contents`
- Its background is the first screen's background token at the same value, declared through the splash screen attributes rather than `android:windowBackground`, and its orientation matches what the app supports (`layout-orientation`). `splash-match`
- Zero spinners, progress bars, percentages and status lines on it. `splash-no-progress`
- Everything the hold condition waits on is local and bounded, and each one has a named path that releases it on failure. `splash-hold`
- The dismissal path contains no duration other than the platform fade. `splash-no-floor`
- A dark resource and a light resource both exist, and the surface carries zero strings. `splash-appearance`
- Any icon animation stays within 1000 ms, starts within 166 ms, and loops rather than running longer, and a custom exit removes the surface on every path. `splash-animation`
- Nothing on the surface is first run content, and nothing draws it on a hot resume. `splash-daily`
- Every cold entry point the app declares resolves its destination before the first draw, so the frame after the surface is the target rather than the home screen. `splash-entry`
- The first frame after it carries the chrome, the insets and placeholder content, not a spinner. `splash-first-frame`

Check `splash-match`, `splash-appearance` and `splash-first-frame` by opening the app cold in both appearances and watching the handoff, rather than by reading the config. A mismatch of one step is invisible in a token table and obvious as a flash.

### Reaches

- `heuristics/layout.md`: `layout-orientation`, `layout-insets`
- `heuristics/localization.md`: `l10n-strings`
- `heuristics/motion.md`: `motion-reduced`
- `heuristics/navigation.md`: `nav-deeplink`
- `heuristics/notifications.md`: `notify-destination`
- `heuristics/onboarding.md`: `onboard-splash`
- `heuristics/states.md`: `state-loading`
- `heuristics/typography.md`: `type-scaling`
- `platform/performance.md`: `perf-cold-start`

# heuristics/states.md

## States

A screen has the one state its author looked at and five or six the user meets. Generated screens render as though the data is already there: the list is full, the request succeeded, the radio is on, and nothing was ever interrupted. That screen is finished for the screenshot and unfinished for the device.

The phone is where the gap costs most. The connection comes and goes inside a single session, in a lift, a tunnel, a train, a carrier handoff or a hotel portal that connects to nothing. The OS takes the app away for a call and can kill the process while it is gone. And there is one surface, so a region that fails has nowhere else to be.

Every state below needs its own words and its own way forward. A generic message is the same as no state at all, because it leaves the user with nothing to do next.

Rules in this file, in order: `state-set`, `state-loading`, `state-empty`, `state-error`, `state-retry`, `state-offline`, `state-stale`, `state-queued`, `state-partial`, `state-permission`, `state-interrupt`.

### `state-set` Six states, named before the happy path is written [P1]

For any screen that loads, sends or stores anything, write the line it shows in each of six: **loading**, **empty**, **error**, **offline or stale**, **partial**, and **permission denied or read only**. Produce that list in `flow/spec.md`, where it is the screen brief's six state keys, before the layout exists. A screen changed without a brief produces it while framing in `flow/build.md` instead.

A screen that cannot enter a state answers it as not applicable and says which: no network call means no offline and no stale, a single indivisible payload means no partial, no protected capability means no permission state. A screen driving a camera, microphone, location, motion sensor or radio owes the five further states in `sense-states` on top of these. Every state the screen can reach is owed its line, and "not applicable" is a claim a reviewer can check, while a blank is not.

Half of the six are conditions the device imposes rather than paths the user chooses, which is why they never show up while writing the happy path and always show up in a hand. A state discovered afterwards arrives as a branch bolted onto a layout built for one case, and it shows.

### `state-loading` A placeholder in the shape of the content, never a spinner over it

The first load draws the real layout with its content replaced by blocks: same row height, same position for the thing the user is waiting for, and roughly as many as fill the screen, since the length of the response is not known yet. `list-virtualise` owns the count inside a list. iOS has `.redacted(reason: .placeholder)` for exactly this. A placeholder whose geometry does not match shifts the layout at the moment the data lands, and in a narrow column that moves a target sideways under a thumb already coming down.

- A spinner is right in two places: inside the control that was tapped, which is `button-state`, and where the layout genuinely is not known yet. A spinner covering the whole screen is not a loading state, it is the absence of one.
- Under 300ms, show nothing. Once it is shown, hold it 500ms even if the data arrives sooner. The threshold alone produces the flicker it exists to prevent, on every response that lands a moment after it.
- Past ten seconds, indeterminate stops being honest. Name the stage or count what is done, and offer a way out of the wait, because the only other exit a phone user has is the force quit.
- The deadline itself is `net-timeout`. The half nobody writes is what happens when it is hit. Write that branch, or the timeout expires into the same animation and the wait has no end after all.
- Three loads look different: first load fills the screen with the placeholder, refresh keeps the current content and marks it as updating, and loading more is `list-end` and `list-refresh`.
- The transition is announced, not only drawn. Loading, loaded and failed are silent to VoiceOver and TalkBack unless the region is marked live: `liveRegion` in Compose semantics, `accessibilityLiveRegion` on Android views, an announcement notification on iOS.

Acknowledging the tap comes before all of this and belongs to `touch-feedback`.

### `state-empty` Three different empties, three different sentences

- **Nothing yet.** First run, and the only one of the three that is a teaching screen: say what will live here and give the single action that puts the first item in it.
- **Nothing matched.** A search or a filter excluded everything. The way out is clearing it, so the filter stays visible and the action offered is removing it, not creating something new.
- **Genuinely zero.** No unread mail, nothing owed, nothing overdue. This is usually good news and should read like it, with no call to action invented to fill the space.

Printing "No results" for all three is the tell. The first leaves a new user with no idea what the app is for, the second hides the filter that is doing the excluding, and the third turns success into a reprimand.

### `state-error` Say what failed, and do not guess at why

There are four failure classes and they are not interchangeable: the radio has nothing, the request ran out of time, the server answered with a fault, or the server understood and refused. Sort them by the move they leave the user, and write one sentence per move: nothing connected sends the user to the connection, timeout and server fault both land on retry and may share a sentence, and a refusal needs something changed or somebody asked, which retry will never fix. One shared sentence for all four leaves the user with no move to make and, more often, with the wrong one.

- A cause you did not verify is a false instruction. Blaming the network for a fault the server reported sends someone to power-cycle a router that is fine.
- Never dress a failure as an empty. "No messages" and "could not load messages" are opposite claims, and code that returns an empty list on failure makes them identical on screen.
- The message lands where the failure is: at the field for a field, in the region for a region, on the screen for the screen. `heuristics/forms.md` owns field-level validation. A modal alert for something that could be said inline charges the user an interruption, and whether the message reaches a screen reader at all is `fb-reach`. How it is worded is `copy-error` and `copy-jargon`.

### `state-retry` A retry that loses what was typed is a second failure [P0]

- The manual retry is always present and always visible once something failed. Automatic retry does not replace it.
- Retrying returns to the same state: the input, the selection, the scroll offset, the sheet that was open. On a phone the typed content is the expensive part, thumbed in one character at a time, and it is never recoverable from anywhere else.
- Retry only what failed, not the whole screen.
- Automatic retry backs off and then stops, and it fires on the platform's reconnect signal (`NWPathMonitor`, `ConnectivityManager.NetworkCallback`) rather than on a fixed timer. A loop on an interval spends battery the user will attribute to this app. That signal is allowed to drive retry and prefetch. It is never allowed to drive the message, which is `state-offline`.

### `state-offline` Four network states, not two

1. **Online and fast.** The one everything was built and demonstrated in.
2. **Online and slow.** The most common and the least designed. It has no branch of its own, so what carries it is the ceiling in `state-loading` and whatever renders when that ceiling is hit.
3. **Offline with a cache.** The app still works, in a reduced form, and says so.
4. **Offline with nothing cached.** The only one that earns a full-screen message, and even that one names what is still possible.

Tell the user when what they can do changes, not when the radio changed. The message waits on a failed request and never on the connectivity callback, because a path reporting satisfied means a radio came up, not that a server answered: that is the hotel portal at the top of this file. Most drops are over in seconds, and a bar that appears for each one is a bar the user stops reading by the second day. Which parts of the app keep working without a network is a decision written down, not whatever happens to be in memory.

Across all four, the OS may report a constraint the user asked for: Low Data Mode and Data Saver, whose flags `net-metered` reads, and Low Power Mode (`ProcessInfo.isLowPowerModeEnabled`, `PowerManager.isPowerSaveMode()`). Where one is set, autoplay stops, prefetch stops, images come at the smaller size, and the screen says what it is holding back with a way to ask for it anyway. A screen that never reads the flag spends a metered radio the user explicitly asked it not to spend.

### `state-stale` Cached content carries its age

Show the content and say when it was fetched. "Updated 2 hours ago" beats a spinner, and it beats a stale number presented as current by more than that.

How fast a screen goes stale is per screen: a price, a balance or an arrival time is wrong within seconds, an article is not. Pick the threshold, and mark staleness with a word rather than a dimmed color alone, which is `color-not-alone`.

### `state-queued` Anything the server has not confirmed reads as pending, not as done

Optimistic updates are right on a phone, because waiting for a round trip on a slow radio makes the whole app feel broken. The optimism has to be reversible in the interface as well as in the data.

- Draw the item as pending. When it fails, roll it back where the user is looking, keep the content, and offer the fix there. An item that vanishes into a sync error is the worst outcome on this page.
- Pending is a property of the item, not of a screen somewhere else: the item says it is waiting and offers a way out of it in place. An aggregate queue surface is owed only where more than one action can be outstanding at once.
- Confirmation lands in something that stays. When the server accepts, the item stops being pending and names what changed, in a form that survives the user looking away. A screen that goes quiet after a submit has confirmed nothing, and neither has a toast that dismisses itself, so nothing irreversible or financial is confirmed by one alone.
- A queued action survives a force quit, or it was never queued.
- Destructive actions do not queue silently. A delete that syncs an hour later has outlived its undo, and undo is the mechanism `touch-destructive` relies on.

### `state-partial` Some of it arrived, so show that

One region failing does not take the screen down. Render what loaded, mark the region that did not, and let that region retry by itself.

The phone shows one thing at a time, so replacing the whole screen because an avatar, a price chart or a recommendation strip failed costs the user everything that had already arrived, and the thing they came for is usually in the part that worked.

### `state-permission` Denied is a state with a way forward, never a dead end

The ask itself, the reason shown before it and how many chances are left belong to `perm-rationale` and `perm-answers`. What this rule owns is the screen the user is left holding once the answer is no.

- Denied leaves a working app with less in it: manual entry instead of the camera, a typed address instead of location, and the system picker that needs no permission at all where one exists.
- The recovery path is the system Settings page, deep linked from the app, next to the sentence saying what to turn on. A permission is not an app preference, which is what `set-system-owned` rules out.
- Read only belongs here too: viewing allowed and editing not. `button-state` starts by leaving the control live and answering on tap with what is missing; where it genuinely has to be disabled, that rule's fallback applies and the reason sits beside it rather than being left to be inferred.
- No screen is a wall that cannot be left without granting.

### `state-interrupt` The phone takes the app away mid task [P0]

A call, a notification pulled down and an app switch stop the screen without destroying it, and the OS carries what is in memory through all three for free. Two events do not, and they are the ones this rule is about: a configuration change (rotation, multi-window, and the text size and theme changes `type-scaling` sends you to go and set), and the system killing the process while the app is in the background.

- Hold the unsent input and the current step where the system can save them: `rememberSaveable` and `SavedStateHandle` on Android, `@SceneStorage` and the `scenePhase` transitions on iOS, `RestorationMixin` in Flutter. A configuration change loses anything held only in the view; process death loses anything held only in memory.
- Where the user lands on return is `nav-restore`, which owns the restored place: destination, stack, selection and filters, with the position inside a collection under `scroll-restore`. The values in a form, the focused field and the abandoned draft are `form-persist`. What is left here is the lifecycle: saving where the system says to save, and saying so when something did not make it back.
- If something was lost, say so. A form silently emptied claims nothing happened, and the user finds out by reading it back.
- Long work resumes rather than restarting from zero, and a cancelled screen cancels its own requests and timers on the way out.

### Check

Review answers each of these against the code, pointing at the line:

- Every state the screen can enter has a line in the code, and each one it cannot is answered as not applicable with the reason. `state-set`
- First load draws a placeholder matching the final layout, no spinner covers the screen, nothing appears under 300ms or leaves within 500ms of appearing, ten seconds names a stage and offers an exit, the timeout has a written branch behind it, and the transitions are announced. `state-loading`
- The three empties render three different sentences, with an action on the first two and none invented for the third. `state-empty`
- There is a message per next action, with connection and refusal never sharing one, no cause is asserted that was not verified, no failure renders as an empty, no message carries a status code, and the message reaches a screen reader. `state-error`
- A visible manual retry exists, retrying restores the input, the selection and the scroll position, and automatic retry backs off, stops, and never writes the message. `state-retry`
- Offline is handled as slow, cached and uncached rather than as a boolean, the message is triggered by a failed request rather than by the radio, and the constrained, metered and power-saving flags are read where media and prefetch run. `state-offline`
- Content that decays (a price, a balance, an arrival time, a count, availability) carries its age against a threshold that exists as a named constant; screens outside that set answer not applicable. `state-stale`
- Unconfirmed actions render as pending with a way out on the item itself, a failed one rolls back on screen with the content kept, and a confirmed one names what changed in something that does not dismiss itself. `state-queued`
- A failed region marks itself and retries alone, leaving the rest of the screen. `state-partial`
- Denial degrades to a working screen, and the route back is a deep link into the system Settings page. `state-permission`
- In-progress work survives a configuration change and a system-initiated process death. `state-interrupt`

`state-offline` and `state-stale` are answered on a device with the network actually off. `state-interrupt` is answered against a rotation and a kill the system would have made itself, using Don't keep activities or `adb shell am kill`, never a swipe out of the recents list: that gesture is the user asking for a clean start, and nothing is meant to come back from it. `state-queued` is the one that keeps the recents-swipe test, because persisted work is exactly what has to outlive a dismissal. Nothing in the file proves any of them, and a state that was never entered is unrun rather than passing.

### Reaches

- `heuristics/buttons.md`: `button-state`
- `heuristics/colors.md`: `color-not-alone`
- `heuristics/copy.md`: `copy-error`, `copy-jargon`
- `heuristics/feedback.md`: `fb-reach`
- `heuristics/forms.md`: `form-persist`
- `heuristics/lists.md`: `list-virtualise`, `list-end`, `list-refresh`
- `heuristics/navigation.md`: `nav-restore`
- `heuristics/permissions.md`: `perm-rationale`, `perm-answers`
- `heuristics/scrolling.md`: `scroll-restore`
- `heuristics/sense.md`: `sense-states`
- `heuristics/settings.md`: `set-system-owned`
- `heuristics/touch.md`: `touch-feedback`, `touch-destructive`
- `heuristics/typography.md`: `type-scaling`
- `platform/network.md`: `net-timeout`, `net-metered`

# heuristics/touch.md

## Touch

A finger is not a cursor, and every rule here follows from three differences.

It is blunt: the contact patch is an oval of 16 to 20mm for a fingertip and more for a thumb pad, so the input is a smudge and not a point. It has no hover: there is no state between not touching and committed, so anything a desktop design revealed on the way to a click has nowhere to live. And it is opaque: the finger covers the thing it presses along with a ring around it, so feedback drawn under the contact point did not happen.

Add the fourth condition that belongs to the device rather than the hand: the grip changes constantly, often within a single task, so nothing can assume the phone is being held the way it was a moment ago.

Rules in this file, in order: `touch-floor`, `touch-spacing`, `touch-nested`, `touch-reach`, `touch-destructive`, `touch-feedback`, `touch-gestures`, `touch-keyboard`.

### `touch-floor` The target is the hit area, never the drawing [P1]

44pt on iOS, 48dp on Android, for everything a user can activate. Both land under a centimetre of glass, which is already smaller than the finger arriving at it. That is why they are floors and not goals.

The drawn control and the target are two different objects. A 24dp icon centred in a 48dp target is right; growing the icon to fill the target and shrinking the target to hug the icon are both wrong. Reach for the mechanism the stack already has:

**SwiftUI**

A minimum frame plus `.contentShape()`, so the padding is tappable and not just the glyph.

**Jetpack Compose**

`Modifier.minimumInteractiveComponentSize()`, which Material components already apply.

**Flutter**

`MaterialTapTargetSize.padded`, or a sized box around the gesture detector with an opaque hit test behaviour.

**React Native**

`hitSlop` on the pressable.

**Mobile web**

Padding on the control, never margin, since margin does not take taps.

**Any other stack**

Whatever the framework offers to grow a hit area past the drawn control without growing the drawing.

Two consequences that get missed. A list row is a target: full width, at least 48dp tall, and the whole row responds rather than the label inside it. And a target that is marginal at the top of the screen is worse at the bottom, where the thumb arrives at a shallow angle and the contact oval stretches.

The web accessibility floor is lower than the platform one and does not replace it. WCAG 2.2 asks for 24 by 24 CSS pixels at AA, with exceptions, and 44 by 44 only at AAA. On a phone the platform number wins, every time.

### `touch-spacing` Two correct targets can still produce a wrong tap

Leave at least 8dp of dead space between neighbouring targets. Adjacent controls that each meet the floor still collect mis-taps, because the contact oval straddles the boundary between them and the system awards the tap to whichever one owns the centre.

Watch the places it concentrates: a row of icon buttons in a toolbar, a line of chips, a close control sitting beside another control, and two swipe actions revealed on the same row. When a target has to be smaller than the floor, the distance to its neighbours has to grow to compensate, which is the same trade WCAG makes with its spacing exception.

### `touch-nested` One point answers to one target, and a picture of a control is not a target

When two pressables overlap, the system hands the tap to the innermost one and the outer one never hears it. So a control placed inside a tappable card is a hole in the card: a tap there does the control's job, or nothing at all, and never the card's.

That is right when the inner control is a real second action, a favourite on a row or a menu on a card. Then it is its own target, it meets `touch-floor` and `touch-spacing` against the edge of the card, and its tap does not also fire the card underneath.

It is wrong when the inner control is only drawn. A theme previewed on a sample screen, a keyboard skin in a store, a widget in a gallery of widgets, a mockup of an app inside a portfolio tile: these are pictures of controls, and they are content. They are excluded from hit testing and from the accessibility tree, so the tap goes to the card and a screen reader reads the card rather than a button that does nothing.

**Flutter**

Wrap the drawn subtree in `IgnorePointer` and `ExcludeSemantics`.

**SwiftUI**

Give the drawn view `.allowsHitTesting(false)` and `.accessibilityHidden(true)`.

**Jetpack Compose**

Put no `clickable` inside the drawing, and lay `Modifier.clearAndSetSemantics {}` over it.

**React Native**

Give the drawn view `pointerEvents="none"`, with `accessibilityElementsHidden` on iOS and `importantForAccessibility="no-hide-descendants"` on Android.

**Mobile web**

Put the `inert` attribute on the drawn subtree.

**Any other stack**

Take the drawn subtree out of hit testing and out of the accessibility tree, with whatever the framework offers for each.

A drawn control that still takes a tap is found by pressing it: it ripples, and nothing happens.

### `touch-reach` The bottom third is the only easy part of the screen

Roughly half of phone use is one-handed, and about two thirds of that is a right thumb. A layout that only works for one hand fails a large minority of users, so check the mirror before shipping.

Three regions, mirrored for a left hand:

- **Easy:** the bottom third, leaning toward the side opposite the thumb. The primary action, the primary navigation and whatever gets used most.
- **Stretch:** mid screen and across to the far side. Secondary actions.
- **Hard:** the top corners, worst at the diagonal from the holding thumb. Search, settings, anything used rarely.

Past about six inches of screen, the top is not reachable one-handed at all. Anything essential up there needs a second path: a bottom sheet, a pull-down, a duplicate control in reach. A bottom tab bar is not a stylistic preference, it is where the thumb is.

Since the grip changes mid-task, the design has to survive the change rather than assume a posture. A control that only works while the phone is cradled in two hands is a control that fails while walking.

### `touch-destructive` Distance is the safety mechanism

Delete, unsubscribe, cancel the order and send the payment do not belong in the easy region, and never beside something used often. The whole point of the hard region is that reaching it takes a deliberate second movement.

Prefer undo over a confirmation dialog. Undo is faster for the person who meant it, recoverable for the person who did not, and it does not train users to dismiss dialogs without reading them. When a dialog is the right vehicle instead is `fb-confirm-test`.

### `touch-feedback` If it happened under the finger, it did not happen [P1]

Every touch gets an acknowledgement inside about 100ms, before the work behind it finishes. Latency between contact and response is the loudest quality signal a phone app has.

- The pressed state is mandatory, and it has to be visible with a finger parked over the middle of the control. Change the whole surface, not a small area at the centre.
- Use the platform's own idiom: a ripple originating at the contact point on Android, a highlight or dim on iOS. Invented feedback that neither platform uses reads as a malfunction.
- Confirmation of a result belongs above the touch point or in another region entirely, never underneath it.
- Disable the control while its action runs, or a second tap fires the same request twice.
- Haptics are a vocabulary, not decoration. One meaning per pattern, distinct signals for success and failure, nothing on scroll. Constant haptic feedback is worse than none.

The touch state set is its own thing: rest, pressed, long press where the element has one, dragging where it moves, plus disabled, loading, error and empty. `hover` does not exist here, and `focus` belongs to a hardware keyboard or switch control rather than to a finger. Nothing may hide behind either.

### `touch-gestures` The edges belong to the operating system

A gesture that starts at a screen edge is competing with the OS and will lose. On iOS that is back from the left edge, the shade from the top left, the control panel from the top right, and home from the bottom. On Android it is back from either side, home from the bottom, and the shade from the top. Where a drag genuinely has to begin at an edge, claim the strip explicitly through the system's gesture exclusion mechanism and keep it as small as possible.

- The back gesture is the system's, and what this rule owns of it is the gesture: on Android the modern callback rather than an override of the old back method, keeping the predictive animation the system draws while the finger is still down and interpolating any custom transition from its progress. Where back lands, and a handler that consumes it and leaves no way out, is `nav-back`, and it is scored there and not twice.
- Use the standard gesture for the standard meaning. Repurposing pull to refresh, long press or edge swipe costs the user the muscle memory built by every other app on the device.
- Every gesture needs a visible equivalent, because a swipe-only action does not exist for someone who has never been shown it. That is the sighted half. The route for a reader, a switch or a keyboard is a named action, and `a11y-gesture` owns it.
- A gesture nobody discovers is a feature nobody has. Leave a partial reveal at rest, a grabber, or a one-time hint.
- Give a swipe region real height, and keep two swipeable things from overlapping where their gestures begin.

Content runs underneath the system bars on current Android targets, so a control pinned to the bottom edge without inset handling ends up beneath the gesture strip: visible, and not tappable. The inset geometry itself is `layout-insets`.

### `touch-keyboard` Half the screen, arriving without warning

The keyboard is not an overlay that happens to the screen, it is part of the screen for as long as someone is typing, and it deserves the same design attention as anything else that takes up that much room.

- The focused field stays visible when it opens. Test the last field of a form, not the first: the first one always passes.
- Which keyboard opens, and what its return key does, is decided per field rather than globally. `form-input` covers that in full.
- A fixed bottom action either rises with the keyboard or is reachable above it. Leaving it underneath means the user types and then cannot submit.

### Check

Review answers each of these against the code, pointing at the line:

- Every interactive element measures at least 44pt or 48dp in its hit area, and list rows are tappable across their full width. `touch-floor`
- Adjacent targets are separated by at least 8dp of dead space. `touch-spacing`
- No point on the screen belongs to two targets unless the inner one is a real second action that meets the floor and does not fire the outer one, and every control drawn as content is excluded from hit testing and from the accessibility tree. `touch-nested`
- Primary action and primary navigation sit in the bottom third, and the layout was checked mirrored for a left thumb. `touch-reach`
- Destructive actions sit outside the easy region, and the vehicle carrying the confirmation is the one `fb-confirm-test` selects. `touch-destructive`
- Pressed state is visible under a covering finger, feedback lands within about 100ms outside the occluded area, and nothing depends on hover. `touch-feedback`
- No custom gesture starts in a system edge zone without an explicit exclusion, the system's back gesture keeps its own predictive animation, standard gestures keep their standard meaning, and every gesture has a visible equivalent on screen. `touch-gestures`
- With the keyboard open, the focused field is visible and the primary action is reachable. `touch-keyboard`

Hit areas are measured, not estimated: read the bounds in the inspector or the layout tree. A target that looks big enough next to a 24dp icon is exactly the one that is not.

### Reaches

- `heuristics/accessibility.md`: `a11y-gesture`
- `heuristics/feedback.md`: `fb-confirm-test`
- `heuristics/forms.md`: `form-input`
- `heuristics/layout.md`: `layout-insets`
- `heuristics/navigation.md`: `nav-back`

# heuristics/typography.md

## Typography

Type on a phone gets read close up, in a hand that moves, in light nobody chose, at a size the reader picked and you will never see. Two of those are OS settings the app is expected to obey: the text size slider, which runs past 200%, and the system preference for heavier text. Generated type tends to fail one of them long before anyone argues about taste.

`DESIGN.md` holds the families and the ramp. This file is how they land in code, and what has to hold before the screen ships. Per-role sizes, weights and line heights sit in `references/type-scales.md`, to be opened for one lookup rather than read through.

Rules in this file, in order: `type-scale`, `type-roles`, `type-hierarchy`, `type-weight`, `type-face`, `type-measure`, `type-scaling`, `type-strings`, `type-dark`.

### `type-scale` The ramp already exists on both platforms [P1, pass or fail]

Each platform publishes a complete role scale that is optically tuned, wired to the size setting, and understood by the screen reader. Pick the role that matches the job and adjust from there. Inventing a parallel ramp discards those three properties and returns nothing.

- Text reaches the screen through a style: `MaterialTheme.typography.bodyLarge`, `.font(.body)`, `Theme.of(context).textTheme`. A size typed into a component is a defect even when the value happens to be right.
- The unit belongs to the platform as well. Android text is `sp`, and `dp` freezes it. On iOS, `.system(size:)` with no text style behind it is the identical failure in another language.
- Body lands at 16sp or 17pt. Eleven is the floor, and it belongs to text at the margin of meaning, never to something a user has to read in order to act.
- When the readers are older or the app lives outdoors, move the whole ramp up rather than granting one role an exception.

### `type-roles` About four jobs per screen

Material publishes fifteen roles and iOS eleven styles. A single screen usually needs four of them: what this screen is, what it says, what a control is called, and what qualifies the rest. Name each one after its job.

A row that shows up on two screens carries the same style in both, or the product reads as though two teams built it without speaking. Seven distinct sizes on one screen is not hierarchy, it is seven unmade decisions.

Line height is a property of the role, not of the paragraph: near 1.2 where the type is display sized, 1.4 to 1.5 for body. The ratio has to widen as the type gets smaller, which is why one global multiplier comes out wrong at both ends.

### `type-hierarchy` Four roles a reader cannot tell apart is one role

`type-roles` asks for about four roles and `type-weight` takes weight out of the running for most of them, which leaves size carrying the structure. Neither says how far apart those sizes have to be, and the screen that exposes the gap passes both: a title two points above a section head, a section head one above body, a caption below it. Four roles, five sizes, nothing hardcoded, every rule in this file satisfied, and a reader at arm's length sees one grey block.

The published ramps are far apart on purpose: a display or large-title role runs near twice body, not a step above it. A screen drawing only from the middle of the ramp has chosen the stretch where the roles stop being distinguishable, and it reads as a wireframe that was never promoted.

- The test is the glance, before a word is read. The subject of the screen and the start of its content separate, or they do not. Look at it from across the room or out of focus: what survives is the hierarchy, and when nothing survives there was none.
- The gap is optical rather than numeric. The same two steps that separate under one face collapse under another, and they collapse again in the other appearance, which is what `type-dark` is about.
- Spending the range is not using more of it. `type-roles` still caps the count; this is about the distance between the few, never about adding a sixth.
- A ramp that has to stay compressed, for density, for a table, for something worked in all day, says what carries the hierarchy instead: weight, space, a rule line, or colour (`color-assigned`). Unwritten, the compression was not a decision.

### `type-weight` Weight is structure, and the user has a say in it

Both systems let someone ask for heavier text: Bold Text on iOS, `fontWeightAdjustment` from API 31 on Android. Styles that come from the theme respond by themselves. A weight typed into a component (`weight: .semibold`, `FontWeight.Bold`) does not, so the preference gets dropped in silence and nothing in the build says a word about it.

What the two scales actually do with weight runs against the web instinct:

- Large text is not bold text. M3 holds titles at 400 up to 22sp, and iOS sets every title Regular. Size is the signal.
- 500 and semibold are reserved for the small roles that name controls: buttons, tabs, chips, and iOS `headline`.
- `headline` and `body` on iOS are both 17pt, and weight is the entire difference between them. Nothing demonstrates better that weight on its own can hold a hierarchy.

Two constraints on the ramp itself. Nothing below 400: fine strokes fragment at small sizes, wash out in direct sun, and pull down the effective contrast even where the color ratio passes. And when weight marks a step, jump a grade, because 400 beside 500 looks like a typo while 400 beside 600 or 700 looks intended. A static family only holds the cuts that were drawn for it, so asking for a weight it lacks returns either the nearest cut or a synthetic bold, and the synthetic one always loses.

Weight is relative, which means it gets judged across the whole screen and never element by element. It reads as emphasis only while most of the screen is not carrying it. A screen where the title, every row label and every price all sit at 600 has no emphasis anywhere on it: nothing was promoted, the page just got heavier and harder to read, and the reader now has to find the important thing by reading instead of by looking. The regular cut is the ground the screen is written on, and the heavier cut is spent on the few things that have to win.

This is countable. Take the distinct text elements on the screen and look at how the weights fall across them. Most of them at 400 with two or three above it is a distributed hierarchy. Most of them above 400 is a flat screen wearing a heavy coat, and the fix is to take weight away rather than to add more of it somewhere else.

The distribution has a floor as well as a ceiling, and the floor is the one this rule is usually read without. Most of the screen at 400 with two or three things above it is the target; every single thing at 400 is not the restrained version of that, it is a screen where nothing was promoted. Something on the screen is what the reader came for, and on a screen with no heavy cut anywhere the reader finds it by reading rather than by looking, which is the cost this rule exists to avoid paying.

Build the hierarchy from weight and space before size. The reader has a slider for size and none for the others: at 200% a 24pt title and 17pt body are both large, and the distance that structured the screen at 100% is doing much less of the work.

### `type-face` A typeface nobody chose

Inter turns up on its own for the same reason violet does: it is the most common interface face in the training data. Inter is a fine typeface, which is exactly why finding it there says nothing about this product.

- Shipping the system face is a legitimate decision. SF Pro and Roboto are tuned for their own rendering stack, carry every weight, cover the scripts the product ships in, and load for free. Picking one deliberately is an answer; arriving at Inter by default is not.
- A brand face gets themed into the scale, taking display and headline where the strings are short, while the system face keeps body, labels and controls. Applying a face component by component throws away the size setting and what the screen reader expects, in one move.
- Two families is the ceiling, and the second earns its place by doing something the first cannot.
- A custom face ships only when it scales with the user's setting, carries every weight the roles call for, covers the languages, and has been subset and paid for out of the launch budget. One usable weight leaves size doing all the structural work by itself.

What each platform and stack can reach without shipping a file, and what the Google Fonts route costs on each, is in `references/fonts.json`.

### `type-measure` A narrow column, because the device is narrow

Body copy wants 40 to 60 characters per line, and the lower half of that band is normal here. The 65 to 75 everyone quotes was measured on a wide page at desk distance. A phone sits about a foot away with a column a few inches wide, and the return sweep to the next line is short to match.

The usual failure is a paragraph running edge to edge on a large phone held sideways. Cap the column instead.

### `type-scaling` Render it at maximum before calling it done [P1]

No other check in this file surfaces as many genuine defects. Turn the text size to the platform's largest accessibility step, walk every screen, and look for:

- a container with a fixed height that its own content has outgrown;
- a control row that needed to become a column and stayed a row;
- text drawn on top of a neighbour instead of displacing it;
- a one-line label now wrapping to two, pushing the primary action under the fold or beneath a fixed bottom bar;
- a string cut into ambiguity: a button reading "Cont..." has lost its meaning, not merely some letters.

Layouts reflow; they do not truncate. A screen that only holds together at 100% has failed exactly the people who moved the setting.

Nor do they shrink the text back. Scaling a label down to fit its box, through `FittedBox`, `minimumScaleFactor`, `adjustsFontSizeToFitWidth`, an auto-size text widget or a size computed from the width, turns the setting off exactly where it was needed, and whatever sits in the same box, an icon button included, shrinks with it under `touch-floor`. It passes a check that only looks for clipping, which is why it is named here. The exception is a single display figure whose size is the layout, a clock or a score on a screen built around it, and it is recorded as that, with every control kept outside the scaled box.

### `type-strings` The text in the layout is not the text you typed

Real strings come from translators, from an API and from users, and they run longer and stranger than the ones in a mockup.

- Size the labels against the longest language the product ships in, not against English. Compounds in German, Finnish and Portuguese set the minimum width.
- Numbers stacked in a column need tabular figures, or the alignment shifts every time a value updates.
- Names, titles and anything user-authored need a line limit and a truncation point chosen per role, settled in the design rather than discovered in production.
- An identifier cut short, a file name, an address, a reference code, a version, a hash, has to be reachable in full on the next surface, and copyable there. The person truncated it to scan a list, not to lose it, and the part that got cut is usually the part that tells two of them apart.
- All caps is for a short label at most. Applied to body text it removes the word shapes people actually read by.

### `type-dark` Light on dark reads lighter than it measures

Pale text on a dark ground bleeds into it, so an identical face at an identical weight looks thinner in dark theme than in light. Low brightness on an OLED panel exaggerates it.

Where a screen carries real reading, compensate in the dark theme only: one step of weight if the face has it, a little more tracking, a little more line height. None of this shows up in the token values, so it gets judged on a rendered screen or not at all.

### Check

Review answers each of these against the code, pointing at the line:

- Text styles trace back to the platform scale or to a written-down extension of it, no component carries a literal size, and Android text is in `sp`. `type-scale`
- The screen works from about four named roles and carries no more than five distinct sizes, and a role that repeats across screens is identical every time. `type-roles`
- The screen's subject and the start of its content separate at a glance rather than sitting a step apart, the ramp reaches its display end instead of staying in the middle, and a ramp kept compressed names what carries the hierarchy in its place. `type-hierarchy`
- Nothing below 400, no weight hardcoded outside a theme style, and every weight step jumps a grade. Weight is distributed across the screen, with most text on the regular cut and the heavy cut spent on a few elements, and something on the screen does carry it. `type-weight`
- The typeface choice can be stated as a reason, a brand face stays in the display roles, and any custom face scales. `type-face`
- Body copy runs 40 to 60 characters per line. `type-measure`
- The screen was rendered at the largest accessibility step, and nothing clips, overlaps or truncates into ambiguity, and no text is scaled back down to fit its box, except a recorded display figure with no control inside its scaled region. `type-scaling`
- The longest localized string fits, numeric columns are tabular, every truncation point was chosen deliberately, and a truncated identifier can be read in full and copied one tap away. `type-strings`
- Dark theme text was judged on a rendered screen. `type-dark`

`type-scaling` and `type-dark` are answered with a rendered screen or they are not answered at all. Everything else gets a file and a line number.

### Reaches

- `heuristics/colors.md`: `color-assigned`
- `heuristics/touch.md`: `touch-floor`

# heuristics/updates.md

## Updates and migrations

The update that matters here is the one the user did not install: it arrived in the background while the phone charged, and the version that opens in a queue the next morning is one nobody chose and nobody read anything about.

This file covers what that person meets: a screen that will not let them in, an install that happens under them, and the first launch of a new binary over a store the old one wrote. The surface the app launches onto is `heuristics/splashscreen.md`, the screen a failed migration shows is `heuristics/states.md`, and the first run of a fresh install is `heuristics/onboarding.md`.

Rules in this file, in order: `upd-block-test`, `upd-min-version`, `upd-gate-screen`, `upd-prompt-shape`, `upd-flexible-install`, `upd-restart-state`, `upd-migration-once`, `upd-migration-path`, `upd-migration-visible`, `upd-no-wipe`, `upd-carry-over`, `upd-whats-new`, `upd-store-channel`.

### `upd-block-test` A block is earned by what broke, not by a version number being behind

Four conditions earn a wall: the client speaks a contract the server has stopped honouring, a security fix that has to be everywhere, a bug that damages data while the app runs, or a legal requirement the installed build cannot satisfy. The list is closed. Everything else offers and lets the person carry on, and a fifth reason is a named exception in `STACK.md` saying what it costs the people it locks out.

`installedVersion < latestVersion` is not one of those conditions. Written that way every release becomes mandatory, and someone standing at a barrier with a ticket in the app pays for a copy change with a download on whatever signal the platform has. Decide blocking or flexible per release, from the failure, and record the test in `STACK.md`.

On Play the urgency travels as a property of the release: an integer from 0 to 5, defaulting to 0, set when the release rolls out and not editable afterwards. A release published as routine can never be promoted later, which is one more reason the decision to block belongs to something the app can still ask.

### `upd-min-version` The floor is an answer from the server, never a constant in the build

A blocked client is the one you can no longer ship to, so the number that blocks it has to stay changeable after the build has left. A minimum version compiled in is a wall that cannot be lowered when it turns out to be wrong.

- The check is one request with a deadline (`net-timeout`) and a stated default, and the default is that the app opens. A gate that fails closed locks out everyone whenever that endpoint is down or the user is on a train.
- Apple publishes no in-app update flow and no version-check API, so whatever an iOS build knows about its own currency, it asked your backend for. Android can read the store's answer, and that answer says only that a newer build exists. The urgency travelling with it is the developer's own, set at rollout and frozen there, so it is a message from a past release rather than a judgement about this client.
- The reason arrives with the floor. The server names what stopped working so the wall can say it, rather than the client guessing from a number.

### `upd-gate-screen` The wall states the reason, and it leads somewhere

It is the shape of `state-permission`: a stated reason and a route out, never a dead end. That rule allows no wall at all, because a refused permission still leaves an app that works with less. This is the one wall the skill allows, because the break is in the client itself and nothing in the build repairs it, so the route out goes to the store rather than to a reduced screen.

- The version check never holds the launch surface (`splash-hold`), so the app draws its first real screen with the check still outstanding and the wall is raised over that screen once the answer lands. A slow or failed check therefore leaves a usable app rather than a held launch, which is the same default `upd-min-version` states from the network side.
- One sentence naming what stopped working and what the move is, written as `copy-error` writes a failure. "This version is no longer supported" names nothing. Where that sentence comes from the server it travels as a reason code the client has strings for, because a wall is the last screen that can afford to be in the wrong language (`l10n-strings`).
- One action, labelled with where it goes (`button-label`), opening this app's store listing. Check what it does when the store app is absent or the link does not resolve, because that branch is the whole screen.
- The wall names only what it can also reach. Where the old binary still renders something correctly, a cached ticket, a phone number, a saved pass, a second and quieter action opens it, which makes the gate a sheet over a reduced app rather than a terminal screen. Listing what the user cannot get to is the failure this bullet exists to prevent, so anything unreachable goes unmentioned.
- The version and build stay legible on the wall itself. Support asks for them first and the About screen that normally holds them (`set-diagnostics`) is behind the wall.

### `upd-prompt-shape` The offer is not an alert, and launch is not the moment

Someone opened the app to do one thing. A dialog standing in front of the first screen is the interruption `fb-unprompted` ranks lowest, and it arrives before the user has any context for the choice.

- The offer appears after the first screen is up (`splash-first-frame`), on a surface that can be left without answering, and never between the user and the task.
- The dismissal is persisted for a period written in `STACK.md`, which is `fb-unprompted` and needs nothing added here. Re-asking every cold start is the wall built out of a prompt.
- What is decided here is the second number, how stale an install has to be before the offer returns, and where staleness is measured from. Take it from the store's own count of days since the release became available; where the store publishes no count, the release date comes back beside the floor from the endpoint `upd-min-version` already calls. Both platforms then compare against a date the server owns rather than a timer in the build.

### `upd-flexible-install` The download runs in the background, the install moment is the user's

Android's flexible flow downloads while the app stays usable, and it hands back three answers rather than one: accepted, cancelled, and failed. Cancelled is an answer, so the app carries on.

- When the install state reaches downloaded, offer the restart on a surface the user can ignore. The flow is defined as the one where it is acceptable to keep using the app while the download runs, so calling `completeUpdate()` on your own schedule takes back the thing that made it flexible.
- Ask whether the flow is allowed on this install before drawing the entry point, since it is not available everywhere, and fall back to the store listing when it is not.
- Two things are picked up on return and they are not the same check: a blocking flow the app started and that was interrupted is still in progress and is re-entered, while a background download that finished while the user was away is offered its restart. Both are checked at every entry point, not on the one screen that started it, or the user sits in a half installed state with nothing offering to finish it.
- iOS has none of this. There the offer is a link, and the user leaves to take it.

### `upd-restart-state` The next run is a cold launch of a different binary

An install ends the process that was running, and whoever opens the app next, the store or the user, opens it cold. The stack, the scroll position, the open sheet and everything typed and not yet saved are gone unless they were already written down.

So the update flow starts by committing: `form-persist` for what was typed, `nav-restore` for the place, `state-interrupt` for the save points. A prompt raised in the middle of a form with no save behind it is a data loss the user attributes to the app rather than to the store.

The binary that comes back is a different one, so a restored destination has to still exist in it. A route removed in this release opens its root, not a crash.

### `upd-migration-once` The first launch after an update runs the migration once, all of it or none of it

The stored schema version is the trigger, and the new number is written in the same transaction as the work it describes. Written first, a process killed halfway leaves a store that claims to be migrated and is not. Backgrounded apps are reclaimed without warning, and a slow first launch is exactly when someone switches away.

Where the store belongs to the framework, that transaction comes free: the version lands inside the framework's own migration, so a killed process rolls the whole thing back and the next launch starts again from the beginning. The clause bites on migrations written by hand, and on the work that leaves the store entirely: a file moved on disk, a preference key renamed, a keychain item rewritten. Those are the steps that can be found half done, so those are the ones that have to survive being run twice. A step that appends rows doubles them on the second pass, and what crosses that seam is `upd-carry-over`.

Each stack names the mechanism: Room's automated migrations with a spec carrying the renames and deletions, or `Migration(startVersion, endVersion)` handed to the builder; Core Data's lightweight migration through `NSMigratePersistentStoresAutomaticallyOption` and `NSInferMappingModelAutomaticallyOption`, with `NSMappingModel.inferredMappingModel(forSourceModel:destinationModel:)` answering whether the change is inferrable at all before you assume it; SwiftData's `SchemaMigrationPlan`, one lightweight or custom stage per version pair.

### `upd-migration-path` Someone opens the app a year late

The path runs from every version still installed, not from the previous one. Steps chain, and each pair is tested against a store written by that version rather than by the current build.

- The installed base is a range by construction. Apple's phased release ramps over seven fixed days at 1, 2, 5, 10, 20, 50 and 100 percent, pausable up to 30 days in total and not otherwise reshapable, while Play's percentage is the developer's and can be halted, which strands everyone already updated on a version nobody else will get. Two versions live at once is the normal state.
- Missing paths fail differently and neither failure is quiet: Room throws when it cannot find one, and Core Data returns no inferred model.
- Downgrades happen: a reinstall from the store after a halt or a withdrawal serves the build that was live before it, and a restored device backup or a sideload puts back whatever it was holding. Decide what a store written by a newer version does, because with no path declared in that direction the store simply fails to open.

### `upd-migration-visible` A migration is work with an end, and nobody watches a launch surface for it

It does not belong on the launch path: `perf-cold-start` puts database open and migration off it, and `splash-hold` takes only bounded local reads.

- Fast enough and nothing is shown. Slower, and it happens on a real screen with a placeholder shaped like what is coming, then names the stage or counts what is done once the wait gets long, which is `state-loading` and needs nothing new here.
- Measure it against the largest store a real user has. The first launch after an update is the one moment the biggest store meets the newest code, and an empty simulator never reproduces it.
- Failure is a designed screen with a move (`state-error`), never a launch that hangs and never an empty screen implying the data is gone.

### `upd-no-wipe` A schema bump is not permission to delete what the user has [P0, pass or fail]

The destructive escape hatches are one line each and they read like configuration: the destructive migration fallbacks delete every row in the tables, and the widespread raw SQLite upgrade that drops the tables and recreates them does the same thing by hand.

On a phone the device is the copy. There is no file the user can put back, and for anything never synced there is no server to fetch it from again.

Where a wipe is genuinely right, because the store holds nothing but a cache of server data, say so at the call site and confirm what the next launch shows while it refills: `off-no-cache`.

### `upd-carry-over` Queued work and drafts cross the version boundary

- The queue is the sharp edge. The new build arrived without anyone asking for it, so those entries were written by a build the user never chose to leave, and on a phone there is no second machine, no export and no earlier install to recover them from. Entries written by the old build have to be readable by the new one, or drained before the schema moves. Dropping them on upgrade discards writes the user was already told had been accepted (`state-queued`, `off-queue`).
- A renamed preference key or a moved file path with no code to carry the value across is the loss that ships most often, because it looks like a tidy rename in the diff.
- Cached content is the only one allowed to be discarded. Name what this version invalidates and let it refill (`off-cache-policy`). A draft is not in that category (`form-persist`).
- There is one way to test it: install the old version, make real data, install the new build over the top. A fresh install passes every time and proves nothing.

### `upd-whats-new` Almost nothing earns a screen

A release that moved something the user relied on has something to say. A release of fixes does not, and neither does a panel selling a feature nobody asked about, which is the tour `onboard-in-place` exists to refuse. Nobody asked for the sheet either, so `fb-unprompted` has already set the rung it takes and the moment it may appear.

Where there is one, it is a single screen, skippable, shown once, and after the first screen is up rather than in front of it; `onboard-screens` sets the ceiling on how many panels anyone sits through. Better than any of that: point at the thing that moved, where it moved to, the first time that screen is opened.

The store listing is a separate obligation with published rules. Apple requires the What's New text to describe new features and product changes, allowing a generic line only for bug fixes, security updates and performance work. Play caps release notes at 500 characters per language, and its console guidance is that they inform about the release rather than promote or solicit an action. Neither governs the in-app screen.

### `upd-store-channel` The store is the only thing that changes the binary

Both stores put this in policy rather than guidance. Apple requires apps to be self contained in their bundles and not to download, install or execute code that introduces or changes features. Play forbids an app distributed through it from modifying, replacing or updating itself by any mechanism other than Play's, with a narrow exception for code running in an interpreter or virtual machine, such as JavaScript in a webview.

The case that reaches this rule most often is not a self updating binary but a remote bundle: a JavaScript payload fetched at launch and swapped under the running app. Play's exception is written for interpreted code and Apple names no equivalent, so any interpreted path is checked against the current guidelines before a release plan is built on it. The design rules do not move either way. A payload that changes behaviour is an update the user did not install, crossing a schema boundary with no store install and no version number they can see, so it answers to `upd-restart-state` for the state it destroys, to `upd-migration-once` for the migration it runs, and to `upd-block-test` for whether it may stop anyone at all. It is not a way around that test.

So no surface in the app is an update button that updates. It is a link to a listing, and every rule above is written around a channel the app does not own.

### Check

Review answers each of these against the code, pointing at the line:

- The blocking condition names a broken contract, a security fix, data damage or a legal requirement, is not a comparison of the installed version against the latest, and anything outside that list is a named exception in `STACK.md`. `upd-block-test`
- The minimum version arrives over the network with a deadline, and the app opens when that request fails. `upd-min-version`
- The gate screen is raised over a drawn screen rather than held launch, states a reason in the reader's language, carries a working route to the store listing with a fallback, shows the version, and gives an action reaching anything it names as still working. `upd-gate-screen`
- The offer is not a launch dialog, its dismissal is persisted, and the interval before it returns is written in `STACK.md`. `upd-prompt-shape`
- The install completes on the user's tap, the entry point is drawn only where the flow is allowed, and both an interrupted flow and a finished download are picked up at every entry point. `upd-flexible-install`
- Everything unsaved is committed before the update flow starts, and a restored destination that no longer exists opens a root. `upd-restart-state`
- The migration is keyed off a stored schema version, writes that version in the same transaction as the work, and every step that leaves the framework's store is safe to run twice. `upd-migration-once`
- A migration path exists from every version still installed, chained and tested pairwise, with a defined behaviour for a newer store. `upd-migration-path`
- Migration is off the launch path, shows a real loading state when it is slow, and has a designed failure screen. `upd-migration-visible`
- No destructive migration fallback and no drop-and-recreate upgrade, except over a store that is purely a cache and says so. `upd-no-wipe`
- Queued entries and drafts written by the previous version are readable or drained, and every renamed key moves its value. `upd-carry-over`
- Any what's new screen is single, skippable, shown once, and not in front of the first screen. `upd-whats-new`
- Nothing in the app downloads or installs a new version itself, and any remote bundle that changes behaviour is held to the same restart, migration and blocking rules. `upd-store-channel`

### Reaches

- `heuristics/buttons.md`: `button-label`
- `heuristics/copy.md`: `copy-error`
- `heuristics/feedback.md`: `fb-unprompted`
- `heuristics/forms.md`: `form-persist`
- `heuristics/localization.md`: `l10n-strings`
- `heuristics/navigation.md`: `nav-restore`
- `heuristics/offline.md`: `off-no-cache`, `off-queue`, `off-cache-policy`
- `heuristics/onboarding.md`: `onboard-in-place`, `onboard-screens`
- `heuristics/settings.md`: `set-diagnostics`
- `heuristics/splashscreen.md`: `splash-hold`, `splash-first-frame`
- `heuristics/states.md`: `state-permission`, `state-interrupt`, `state-loading`, `state-error`, `state-queued`
- `platform/network.md`: `net-timeout`
- `platform/performance.md`: `perf-cold-start`

# heuristics/webviews.md

## Web views

Web content inside a native app: an in-app browser, a help page, a checkout, a page the team publishes without shipping a build. This file is about that surface, not about the mobile web stack. A product that ships as a website and not as an app in a store skips this file. An app that ships a store binary wrapping a site reads all of it, starting at `webview-wrapper`.

Here: which surface a URL opens in, what the wrapper has to carry, what back does, and how content nobody on the team can restyle behaves against the theme, the text size setting, the safe area and the keyboard. The sign-in flow itself is `auth-web-flow`. A link resolving back into the app is `nav-deeplink`. The load and failure states are `state-loading`, `state-error` and `state-retry`. What the page asks the device for is the `perm-` prefix. Every setting named below is an engine setting: in a Flutter, React Native or Expo codebase the wrapper exposes the same one under its own name, and that property is where the rule is scored.

Rules in this file, in order: `webview-surface-choice`, `webview-signin`, `webview-chrome`, `webview-back`, `webview-leaving`, `webview-appearance`, `webview-text-size`, `webview-viewport`, `webview-transfers`, `webview-session`, `webview-wrapper`.

### `webview-surface-choice` Three surfaces, and the raw web view is the narrowest of them

A phone shows one thing at a time. There is no second window and no tab strip, so a web surface takes the whole screen and the only browser chrome the user gets is whatever this app handed them. The three are the system browser, the platform in-app browser (`SFSafariViewController` on iOS, Custom Tabs on Android) and a raw web view drawn by the app (`WKWebView`, `android.webkit.WebView`).

- The raw web view is for content the team controls: your own origin, your own HTML, or a page the app injects script into. Android splits it on the same line and adds that a URL outside your own domains is likelier right in a Custom Tab.
- Everything else opens in the in-app browser or the system browser, because that surface is the user's browser. A Custom Tab shares the browser's cookie jar and permission grants, so a site they are already signed into stays signed in, and their browsing session, saved passwords, payment methods and addresses are all there. A raw web view starts from a store the app owns rather than the browser's, so the same person signs in again inside it.
- The other direction is discouraged rather than forbidden: rebuilding Safari inside a web view repeats what the browser on this phone already does, so a surface people will read several pages in supports forward and back rather than growing an address bar and a tab strip.
- A raw web view owns every permission the page asks for, and each one lands in the app's own inventory, `perm-inventory` and `perm-purpose-string`.
- A checkout in a web surface does not change which rail applies, `pay-rail`, and a link out to your own is a storefront question, `pay-steering`.

### `webview-signin` Somebody else's credential field never lives in a web surface this app can read

The keyboard, the masked characters and the missing address bar all arrive on the same full-bleed screen, so somebody typing a password into a raw web view has no way to see whose page it is. The app drawing that surface can read every keystroke.

- No page carrying a credential this app does not own is loaded into `WKWebView` or `android.webkit.WebView`: a bank, a carrier, a partner, an employer's directory. The host app reaches the full credential rather than the grant it was owed, and can record keystrokes, submit forms and copy session cookies. The app's own sign-in page is first-party content and is ruled on by `webview-surface-choice`.
- The surface also has nowhere to prove whose page it is. Verifying the requested URI and the connection security is what an address bar with a security indicator is for, and the title `webview-chrome` asks for does not supply it, because the app draws that title itself.
- An identity provider's own sign-in is the same harm with an owner. `auth-web-flow` rules which surface it opens in and how its return leg lands, and it is scored there rather than here. The providers that enforce it refuse an authorization request sent to an embedded user-agent outright, one of them with `disallowed_useragent`.

### `webview-chrome` A raw web view arrives with no chrome, so the app draws where you are and how to leave

An Android web view carries no navigation controls and no address bar: by default it shows a page and nothing else. Nothing marks that ownership changed from the app to something nobody on the team wrote, and a page that fails to load is a blank full screen with no exit.

- Copy the set the platform in-app browser already ships. Apple's carries a read-only address field with a security indicator, a Done button, forward and back, and a button opening the page in Safari. The app's own wrapper carries three of them: the title or the host, a close control, and a route to open this page outside the app.
- The close control is a real control. It meets `touch-floor`, and icon-only it carries a name (`a11y-name`). The screen still says where it is, `nav-location`, and a share affordance is the system sheet and nothing else, `share-sheet-only`.
- Do not remove what a Custom Tab gives away: no `OPEN_IN_BROWSER_STATE_OFF`, the close button stays enabled, and showing the title costs one call.
- What this rule is about is a page opened over the app's own screens. The root surface of an app that is a wrapped site has nothing to close back to and no outside to hand itself to, and it answers `webview-wrapper` instead.

### `webview-back` Back resolves inside the page before it leaves the screen

Back is the phone's one universal exit and on both platforms it is a gesture, so it gets used without looking. An Android web view hands the first back straight past the page: by default the system exits the activity, throwing away every page read inside it.

- Android: wire an `OnBackPressedCallback` calling `goBack()` while `canGoBack()` is true. It is the only route left, because an app targeting `targetSdk` 36 is never dispatched the back key at all. `goBack()` and `goForward()` do nothing at the end of history, so the callback falls through to the stack by itself, where `nav-back` takes over.
- iOS: `allowsBackForwardNavigationGestures` is false by default. Turn it on, or wire a drawn control to `goBack()` against `canGoBack`. A drawn back control keeps the gesture it replaced (`nav-back-control`), and the system edge zones are `touch-gestures`.
- The in-app browser and the system browser resolve their own page history and need none of this.

### `webview-leaving` A link that leaves the page leaves the surface

Other apps on this phone hold the schemes a page hands out. `mailto`, `tel`, a store link and an `intent` URL are not http, so a web view given one loads nothing and the tap dies with no feedback, while an http link to somewhere else turns a one-page surface into an unlabelled browser.

- Every raw web view has a navigation policy: a written list of hosts that stay inside, everything else handed to the platform. The decision point is `shouldOverrideUrlLoading` on Android and `WKNavigationDelegate` on iOS. A URL outside the listed hosts opens in the default browser rather than inside the surface. The in-app browser and the system browser have no such list to set.
- Non-http schemes are dispatched rather than loaded, and a dispatch nothing on the device can receive fails with a message rather than as a dead tap.
- A link resolving back into this app is `nav-deeplink`, and the link the app hands out is `share-link-not-shot`.

### `webview-appearance` The page did not read the theme, so hand it the appearance or accept the one it has

A white full-screen page arriving in the middle of a dark app at night is the whole screen going white, on an OLED panel, held close to the face. There is no surrounding window to soften it.

- An Android web view sets `prefers-color-scheme` from the app theme's `isLightTheme`, so a page with its own dark styles already follows. Algorithmic darkening is disallowed by default, so for a page with no dark styles `setAlgorithmicDarkeningAllowed(true)` is the only lever, and it needs `targetSdkVersion` 33 or above, where `setForceDark` does nothing at all.
- A Custom Tab left alone already follows the system: `COLOR_SCHEME_SYSTEM` is the default, so the failure is a colour set once. A tab that sets a toolbar colour sets two, light and dark, through `setColorSchemeParams`, and pins neither `COLOR_SCHEME_LIGHT` nor `COLOR_SCHEME_DARK` against the system.
- On iOS the page reads the appearance of the view it sits in, so an app forcing an appearance over the web view forces the page's `prefers-color-scheme` with it. What is missing there is the algorithmic lever: a page shipping no dark styles stays light inside a dark app, and a first-party page is where those styles get written. Dark is a second design (`color-dark-composed`), and what happens to weight in it is `type-dark`.

### `webview-text-size` The text size setting reaches the page, or the page can be enlarged

Android scales system text to 200% on a non-linear curve and iOS carries accessibility sizes above its default, and the web surface is the one screen in the app that can ignore all of it.

- An Android web view already follows the system font scale, taking its initial text zoom from the configuration. Calling `setTextZoom()` severs that permanently, so the violation is a line that exists rather than one that is missing.
- Leave every page loaded from a URL zoomable: `setBuiltInZoomControls(true)` with `setDisplayZoomControls(false)`, because the built-in mechanism is the only supported one and the on-screen buttons are deprecated. A first-party page sets no `user-scalable=no` and no `maximum-scale`, which `form-input` rules on alongside the field size.
- In `WKWebView` a first-party page asks for the setting instead of inheriting it: size text with the `-apple-system-body`, `-apple-system-headline`, `-apple-system-subheadline`, `-apple-system-caption1`, `-apple-system-caption2` and `-apple-system-footnote` values of the CSS `font` shorthand rather than fixed pixels. They are WebKit values and no other engine implements them, so the Android side is the font scale above and nothing more. The app side is `type-scaling` and `a11y-settings`.

### `webview-viewport` The insets are paid once, and the keyboard shortens the visual viewport only

The notch, the home indicator and the gesture bar are all on this device, the keyboard takes half the screen, and neither the page nor the native container knows what the other one already paid for. Padding twice and not padding at all land on the same screen.

- Insets are applied in exactly one place per surface. Android forwards cutout and system bar dimensions to the page as `safe-area-inset-*`, and only where that system UI overlaps the web view's own bounds: a surface already inset away from the edges reads zeros, which is the documented answer and not a bug. Where they do arrive, a container that also pads from `WindowInsets` without returning the handled types zeroed doubles them, and a 40px status bar becomes an 80px gap. `WindowInsetsCompat.CONSUMED` is worse: the web view is never told the insets changed and keeps the previous padding. Edge-to-edge is enforced at `targetSdk` 35 and cannot be opted out of at 36, so there is no version to wait for. The native half is `layout-insets` and `layout-chrome`.
- On iOS web content is inset inside the safe area for you. `viewport-fit=cover` turns that off, and a page setting it pads its own four edges with `env(safe-area-inset-*)`, floored through `max()`, or the sensor housing covers content.
- The keyboard resizes the visual viewport and not the initial one, so nothing derived from `vh` shrinks and a control pinned to a `vh` bottom sits under the keyboard. Android resizes only the bottom edge, by the web view's intersection with the window, and an app opting out manages the resize itself or `scrollIntoView()` fails and the keyboard covers the focused field. A page clearing focus from a resize handler flaps: focus, keyboard, resize, blur, keyboard gone. `touch-keyboard` and `scroll-keyboard` own the native half.

### `webview-transfers` A download and a file picker inside a web surface are the app's work, or they fail silently

A phone shows no filesystem, so a download producing nothing looks exactly like a slow one, and the second tap is what the user does next. A file input that opens no picker is a dead control on a screen with no cursor to hover it with.

- Android cancels every file request by default. `onShowFileChooser` is overridden, returns true and keeps the callback, or the page's file input does nothing at all. The web view reaches every file the app can reach, so the chooser is scoped to what the page asked for and no wider.
- Android performs no download itself: it notifies the app through a registered `DownloadListener`, carrying the URL, the MIME type and the length. On iOS `WKDownloadDelegate` has one required method and it exists to name the destination the system writes to.
- Every path ends somewhere the user can reach the file, and a failure says so under `state-error`. A Custom Tab keeps its download button, which is on by default. Handing the file on is `share-file-uri`, and the transfer out is `net-upload`.

### `webview-session` What happens inside a web surface is not the app's session, and the app cannot read it

The browser on this device already holds this person's sessions. A raw web view starts from a store of the app's own, so it asks them to sign in again by hand, on a keyboard, and whatever it keeps afterwards is the app's to clear.

- Nothing reads an outcome out of the platform in-app browser: interactions with that web interface are not visible to the app, which cannot reach autofill data, browsing history or website data. An outcome that matters arrives from the server or through a claimed link, `nav-deeplink`.
- No access token, session cookie or account identifier is handed to a page. The wider version is `priv-instrument`.
- Sharing is a decision rather than a default. A Custom Tab shares the browser's cookies unless `setEphemeralBrowsingEnabled` is set, and the iOS authentication session, whose surface belongs to `auth-web-flow`, shares unless `prefersEphemeralWebBrowserSession` is set before `start()`. A raw web view's store is the app's own: the default `WKWebsiteDataStore` writes to disk and `nonPersistent()` does not, so anything holding a signed-in session is cleared on sign-out, `auth-signout` and `off-session`.
- The trade is worth naming once. The browser gives the saved-credential behaviour of `form-autofill` and a separate authentication context at the same time; a raw web view gives neither.

### `webview-wrapper` A wrapped site inherits none of the floors this file sets

A site in a frame gets nothing for free. The touch floor, the safe area, the text size setting, the back gesture and the keyboard all stop being the platform's job and become the page's, and the page was drawn for a pointer on a screen that never moved.

- Every web surface the app ships is listed in `STACK.md` beside what it does natively, so the next one is a decision rather than a habit. Each one on that list still answers `touch-floor`, `webview-back`, `webview-text-size` and `webview-viewport` on its own account.
- Apps that browse the web on iOS use WebKit, and an entitlement is the only route to another engine. What may change the shipped binary at all is `upd-store-channel`.

### Check

Review answers each of these against the code, pointing at the line:

- Every URL outside a domain the team controls opens in the platform in-app browser or the system browser, each raw web view loads a first-party origin or HTML bundled with the app, and no raw web view carries an editable address field or a tab strip. `webview-surface-choice`
- No `WKWebView` or `android.webkit.WebView` load call takes a page carrying a third party's credential field, a bank, a carrier or a partner included; an identity provider's sign-in is scored under `auth-web-flow` rather than here. `webview-signin`
- Every raw web view opened over a native screen carries the page title or its host, a close control at the touch floor with a name, and a route to open the page outside the app, and no Custom Tab passes `OPEN_IN_BROWSER_STATE_OFF` or disables its close button. `webview-chrome`
- Every Android web view wires an `OnBackPressedCallback` to `goBack()` while `canGoBack()` is true, and every `WKWebView` either sets `allowsBackForwardNavigationGestures` to true or wires a drawn control to `goBack()`. `webview-back`
- Each raw web view has a navigation policy naming the hosts that stay inside, non-http schemes are dispatched to the platform rather than loaded, and every dispatch has a no-receiver path that shows a message rather than failing silently. `webview-leaving`
- No `setForceDark` call remains, every Android web view loading a page with no dark styles allows algorithmic darkening at `targetSdk` 33 or above, every Custom Tab that sets a toolbar colour sets both `setColorSchemeParams` variants rather than pinning one scheme, and no page arrives white while the system is in dark appearance. `webview-appearance`
- No `setTextZoom` call overrides the system font scale, every `android.webkit.WebView` that loads a URL rather than HTML bundled with the app sets `setBuiltInZoomControls(true)` with `setDisplayZoomControls(false)`, no first-party page sets `user-scalable=no` or `maximum-scale`, and at maximum text size no text is clipped, truncated or overlapped and no control has left the screen. `webview-text-size`
- Insets are applied in one place per web surface, no web view's inset handler returns `WindowInsetsCompat.CONSUMED`, no page sets `viewport-fit=cover` without `env()` padding of its own, no page pins a control to a `vh` bottom, and with a field inside the page focused no control sits under the keyboard and neither edge is padded twice nor left unpadded. `webview-viewport`
- Every `android.webkit.WebView` overrides `onShowFileChooser` returning true and registers a `DownloadListener`, every iOS download path implements `WKDownloadDelegate` with a named destination, no Custom Tab disables its download button, and that destination is either a directory the user can open or a path ending in the system share sheet, `share-file-uri`. `webview-transfers`
- Nothing reads an outcome out of a platform in-app browser, no token or account identifier is handed to a page, every Custom Tab and authentication session either sets `setEphemeralBrowsingEnabled` or `prefersEphemeralWebBrowserSession` explicitly or `STACK.md` records the shared session as intended, and any raw web view holding a signed-in session is cleared on sign-out. `webview-session`
- Every web surface the app ships is listed in `STACK.md` beside what it does natively, and each entry on that list is scored against `touch-floor`, `webview-back`, `webview-text-size` and `webview-viewport` on its own account rather than inherited from the native screens. `webview-wrapper`

Three of these are only half answerable from a diff, because what the page does with what it was handed is not in the code. Drive one screen three ways on the narrowest supported device: with the system in dark appearance, to see whether the page followed or arrived white (`webview-appearance`); with the text size at maximum, to see whether the page grew with nothing clipped, truncated, overlapped or pushed off the screen (`webview-text-size`); and with a field inside the page focused, to see what the keyboard covers and whether either edge of the screen is padded twice or not at all (`webview-viewport`).

### Reaches

- `heuristics/accessibility.md`: `a11y-name`, `a11y-settings`
- `heuristics/auth.md`: `auth-web-flow`, `auth-signout`
- `heuristics/colors.md`: `color-dark-composed`
- `heuristics/forms.md`: `form-input`, `form-autofill`
- `heuristics/layout.md`: `layout-insets`, `layout-chrome`
- `heuristics/navigation.md`: `nav-deeplink`, `nav-location`, `nav-back`, `nav-back-control`
- `heuristics/offline.md`: `off-session`
- `heuristics/payments.md`: `pay-rail`, `pay-steering`
- `heuristics/permissions.md`: `perm-inventory`, `perm-purpose-string`
- `heuristics/privacy-ui.md`: `priv-instrument`
- `heuristics/scrolling.md`: `scroll-keyboard`
- `heuristics/sharing.md`: `share-sheet-only`, `share-link-not-shot`, `share-file-uri`
- `heuristics/states.md`: `state-loading`, `state-error`, `state-retry`
- `heuristics/touch.md`: `touch-floor`, `touch-gestures`, `touch-keyboard`
- `heuristics/typography.md`: `type-dark`, `type-scaling`
- `heuristics/updates.md`: `upd-store-channel`
- `platform/network.md`: `net-upload`

# heuristics/widgets.md

## Widgets and live surfaces

A home screen widget, a Live Activity with its Dynamic Island presentations, and an Android ongoing notification promoted to a live surface are the parts of the app that get drawn while the app is not running. The system decides when each one is redrawn, at what size, and whether it appears at all, so none of them is a small screen: each is a report the app files and then loses control of. All of them are read in a second, from arm's length, by somebody who is not going to open the app to check.

Here: the update budget, stating what is stale, what fits at the size the user chose, the sizes themselves, the tap, the states nobody draws, what a stranger reads off the surface, what the surface may carry, the labels, the Dynamic Island, the final frame of a live one, and Android promotion. Whether a persistent live surface may exist at all, and what dismissing one means, is `notify-ongoing`. Scheduling the work behind an update is the `bg-` prefix, resolving the link the tap carries is `nav-deeplink`, and the inventory of what counts as sensitive is `priv-shoulder`.

Rules in this file, in order: `widget-budget`, `widget-stale`, `widget-fits`, `widget-sizes`, `widget-tap`, `widget-states`, `widget-shoulder`, `widget-scope`, `widget-a11y`, `widget-island`, `widget-live-end`, `widget-promoted`.

### `widget-budget` The system decides when the surface is redrawn, so the app declares a policy and never a clock

The app does not own the clock out here, and every redraw is battery the phone is rationing (`perf-power`). iOS spends a budget per widget instance that it tunes to how often that person looks, typically 40 to 70 refreshes across a day, roughly one every 15 to 60 minutes. Android will not deliver a periodic widget update more than once every 30 minutes and recommends no more than once an hour. A surface asking for a 60 second refresh does not get a fast surface, it gets a throttled one.

- Declare a policy, never a timer. On iOS a timeline ends in `atEnd`, `never` or `after(_:)`, with `WidgetCenter.reloadTimelines` from the app when something actually changed; on Android `updatePeriodMillis` is either 0 with WorkManager behind it or an hour or more. Nothing polls, and no code path treats the interval it asked for as the interval it gets.
- Build on the redraws that cost nothing on iOS: the containing app in the foreground, an active audio or navigation session, a button or toggle running an app intent, an animation, and a locale or text size change.
- The update is not the work. An Android widget receiver is treated as non-responsive after 10 seconds, so anything slow moves to `goAsync()` or WorkManager, and a Live Activity cannot reach the network or a location at all: its data is pushed in from the app or a server. What may run while the app is away is `bg-not-running` and `bg-periodic`.
- Live Activity pushes have their own hourly budget and get throttled past it. Send at priority 5, which does not count against it, and keep priority 10 for the update the user would notice missing; frequent updates need the property list flag and the user can switch them off (`bg-wake-push`).

### `widget-stale` The surface states what it is showing and when it was true

The redraw is the system's decision, so this surface is showing old data by definition. There is no pull to refresh on a home screen and nothing to tap that means try again, and a number with no age on it is read as current by somebody who is about to act on it without opening anything.

- The age is on the surface, in the same place on every redraw, and the crossover from a relative age to a date is `data-time-relative`. That cached content carries its age at all is `state-stale`.
- Dates and times are drawn by the platform's own date facility rather than recomputed per reload, so a clock counting forward does not spend refreshes the surface needs for its content.
- The state behind a Live Activity's stale date is a drawn state rather than the last frame left standing (`notify-ongoing` owns that the date is set at all). Without it, a delivery frozen at eleven minutes away still reads as eleven minutes away.

### `widget-fits` No scroll, no keyboard, no spinner, so every state fits the size the user chose

No scrolling API exists for an iOS widget, no text entry exists on either platform, and there is nowhere for a spinner to lead. Whatever does not fit is simply gone, and it is gone at the size that person picked rather than the one in the preview.

- The interactive elements iOS documents are a whole-surface link, a `Link`, a `Button(intent:)` and a `Toggle(isOn:intent:)`. No field, no sheet, no nested navigation. Android collection widgets do scroll vertically through the collection views, and that is the only scrolling either platform offers here.
- The loading state is a placeholder in the shape of the finished content, which is `state-loading` on a surface with nowhere to put a spinner. Android requires an initial layout for exactly this moment.
- Both surfaces are stateless. The app stores the value and the surface renders it (`off-local-first`); an Android checkbox, switch or radio on a widget carries a look, not a value.
- Every string is sized at its longest translation (`l10n-expansion`), because it truncates against a fixed cell instead of wrapping into more room. A Live Activity holds inside 4 KB of static plus dynamic data.

### `widget-sizes` Content is authored per size, and a size nobody drew is not offered

A phone home screen is a grid the user resizes by hand, so the same widget sits in two cells for one person and twelve for another. Stretching one layout to fill a bigger cell is what a window does, and this is not a window: the small size carries one fact and the large one is a different design, not the same design with air around it.

- Author per size, then offer only the sizes authored. The iPhone families are small, medium and large on the home screen plus the circular, rectangular and inline lock screen accessories; extra large is not a phone size. Android declares its default in launcher cells through `targetCellWidth` and `targetCellHeight`, with the dp minimums as the fallback for older releases.
- One layout per size band rather than one per pixel: Glance's responsive size mode maps a set of layouts and lets the system pick, while its exact mode rebuilds the surface on every resize and jumps while it does.
- The system's own content margins stay, 16pt on iOS and 11pt where a tighter grouping is wanted, and nothing adds a second inset on top of them. A full-bleed background switches the default margins off and re-applies them to the content inside, and the corner radius comes from the container rather than a typed value.
- Portrait and landscape both, at the narrowest supported device (`layout-width`).

### `widget-tap` The tap is a deep link carrying its subject, and it resolves from a killed process

The tap arrives from a home screen, so the process is usually dead. There is no hover and no second tap to disambiguate, and on a small or inline widget the whole surface is a single target, which makes whatever it points at the only thing it can point at.

- The payload names the destination and the subject, an id in the URL or in the pending intent, never a bare route to the app's home screen. Building the stack above that target, the cold launch, the auth case and the missing target are all `nav-deeplink`.
- Count the targets. One whole-surface link per widget, because a second one is undefined behaviour on iOS, and an inline accessory has exactly one. Android collection rows take a pending intent template on the collection plus a fill-in intent per row, since a row cannot carry a click intent of its own.
- A control drawn on the surface is a target with a hit area, and the number comes from `touch-floor`, because neither platform publishes one for this surface.
- Launched from a lock screen, the destination either requires authentication or declares that it shows when locked. Buttons and toggles on a Live Activity do nothing in CarPlay, so nothing is reachable only through them.

### `widget-states` Signed out, empty and error are drawn states, at the smallest size the surface offers

These are the states nobody draws, and here they are the ones with no way out: no scroll, no room for a retry control worth the space, no route to a sign-in screen. A blank rectangle sits on somebody's home screen for hours as the app's only visible face, and the next move is to remove it rather than to open the app.

- Three states written and fitting the smallest declared size: signed out naming what signing in would show, empty saying which of the three empties this is (`state-empty`), and failed saying what failed without guessing why (`state-error`).
- A token that could not be refreshed is not a sign-out and is not drawn as one (`off-session`). It draws the last known content with its age.
- Availability is a state as well. A Live Activity checks that activities are enabled before starting, since the user can switch them off, and telling them so belongs in the app rather than on a surface that never appears.
- No state resolves to a blank surface or a bare error string.

### `widget-shoulder` Whoever is standing beside the phone reads this surface, and on Android it is on the lock screen unless the app says otherwise

This is the part of the app drawn on a screen that is switched on without the app being opened: in a queue, on a table, on a locked phone with an always-on display. Android puts a widget on the keyguard by default and the app has to opt out, so a surface designed for a home screen reaches the lock screen with the app never having declared it should.

- Every value takes the shortest form that still does its job, which is `priv-shoulder`, and that file owns the inventory of what counts as sensitive.
- A widget that must not reach the keyguard declares the `not_keyguard` category, which exists from Android 16. It is a request the surface is expected to honour rather than a guarantee, so nothing depends on it alone.
- Anything a Live Activity would not publish becomes an innocuous summary that opens the app for the rest, or a view marked privacy sensitive so the system redacts it. An iOS lock screen widget is also desaturated to a monochrome vibrant rendering and can be tinted by the user, so nothing there is carried by colour (`color-not-alone`).
- What a notification's own first line says to a stranger is `notify-lockscreen`.

### `widget-scope` The surface carries this app's own content and nothing else

This is space on somebody's home screen granted to one app, and the one surface where a promotion cannot be scrolled past or swiped away. Apple's guideline 2.5.16 says widgets, extensions and notifications should be related to the app's own content and functionality, and 2.5.18 says display advertising should be limited to the main app binary, which `ads-placement` already enforces at the call site.

- No advertising, no promotion, no cross-sell, no shortcut unrelated to what the surface reports. Android's own list of what does not qualify as a live update opens with ads and promotions and includes quick access to app features.
- The surface is the summary and the app is the detail, so everything on it exists in more depth one tap away. A surface carrying something the app itself never shows is a second app.

### `widget-a11y` Every element carries a name, and the name changes when the picture does

These surfaces reach a screen reader without the app being open, and they are mostly icons and bare numbers with nothing around them to supply a label. A widget also has to hold from the default text size up to the largest accessibility size inside a cell it cannot grow, which is a case that only exists because the container is a phone home screen grid.

- Every image and icon-only element carries a label (`a11y-name`, `icon-alt`), and a label reporting a status changes when the status changes. A delivery glyph labelled once at build time is wrong for the rest of the run.
- No text rasterized into an image, on any presentation. Text stays text so it scales and can be read out.
- Nothing below 11pt, and the layout survives the largest accessibility text size (`type-scaling`) at the smallest size the surface declares.
- Drive each presentation with the reader on, as `a11y-test` asks of any flow.

### `widget-island` Four presentations, each one designed rather than derived

The Dynamic Island is the only place this app appears while the user is inside another app, and its shape comes from the camera hardware rather than from a layout. A Live Activity has four presentations, three of them in the Island (compact, minimal, expanded) and one on the lock screen, and an app that only designed the expanded one becomes an unidentifiable dot.

- Minimal is 36.67pt tall and 36.67 to 45pt wide, and it is what the system picks once a second Live Activity is running. It has to be recognisable alone, which for a single glyph means the app's own mark rather than a progress ring.
- Compact leading and trailing run 52.33 to 62.33pt wide by 36.67pt tall. Content stays as narrow as it can and snug against the camera.
- Expanded opens on touch and hold. It and the lock screen presentation both run 84 to 160pt tall, the lock screen one with a 14pt margin, and the system may truncate anything above 160.
- No image asset larger than the presentation drawing it, since an oversized one can stop the activity starting at all. Animation caps at two seconds (`motion-duration`) and does not run on an always-on display at reduced luminance, so nothing is legible only while it moves.

### `widget-live-end` The end of a live surface is a final state, not a disappearance

The surface outlives the event it was reporting: an ended Live Activity stays on the lock screen for up to four more hours, and the frame it stopped on is the last thing that person sees. A phone gets one glance, so that frame has to say the ride arrived rather than freeze eleven minutes out.

- The final content states the outcome, arrived, delivered, cancelled, finished, instead of holding the last in-progress frame.
- A dismissal time is chosen rather than left at the four hour default. The time is proportional to the activity, and 15 to 30 minutes is adequate for most of them.
- Whether a persistent live surface is allowed at all, what its ceiling is, ending it on the event that ends the work and what a dismissal means are all `notify-ongoing`. Where the surface exists to watch long user-started work, the progress and the stop control belong to `bg-visible-stoppable`.

### `widget-promoted` An Android live update is a request, and it has to read correctly when it is refused

Android promotes an ongoing notification to a status bar chip, the top of the drawer and the lock screen, and it can decline. The user can demote it, the manufacturer can add criteria, and the app only learns the outcome at runtime, so a surface designed for the promoted presentation alone is a surface most phones never draw.

- Its own title and body carry the state, so it reads as an ordinary notification when promotion is refused, and that is the presentation to design first.
- The requirements are all of these, with no partial pass: the promoted notifications permission declared, promotion requested on the builder, the ongoing flag set, a content title present, one of the standard, big text, call, progress or metric styles, no custom content view, not a group summary, not colorized, and a channel above minimum importance.
- Ask the platform whether the notification can be promoted and whether the user allows it, and hand the user the app's promoted notification setting rather than guessing. Nothing is reposted after they dismiss it.
- Four things qualify: active navigation, an ongoing call, rideshare tracking and food delivery tracking. Chat messages, alerts, a calendar event that has not started, package tracking and ambient information do not. Alert only on a critical status change (`notify-level`), and keep the timestamp format identical between the chip and the expanded card.

### Check

Review answers each of these against the code, pointing at the line:

- Every outside surface refreshes through a declared reload policy or a system-scheduled trigger rather than a timer or a poll, `updatePeriodMillis` is 0 with work behind it or at least an hour, and every ActivityKit push is sent at priority 5 except a state change the user is waiting on, with no routine progress update at priority 10. `widget-budget`
- Every outside surface renders the age of what it shows, dates and times come from the platform's own date facility, and every Live Activity draws a designed state behind its stale date. `widget-stale`
- No outside surface depends on scrolling, text entry or a spinner, its loading state is a placeholder shaped like the content, its state is stored by the app, and every string is sized against its longest translation rather than the English one. `widget-fits`
- Every size a surface declares has content written for it, none is a smaller layout stretched or a larger one clipped, the Android declaration names its default cells, and the surface keeps the system's default content margins rather than adding a second inset. `widget-sizes`
- Every tappable region carries a URL or pending intent naming both destination and subject, each widget declares at most one whole-surface link, collection rows use the template plus fill-in form, and drawn controls meet the touch floor. `widget-tap`
- Each surface has a signed-out, empty and error state written as its own layout branch at the smallest size it declares, a failed token refresh is not drawn as a sign-out, no state resolves to a blank surface, and a Live Activity is started only behind an activities-enabled check. `widget-states`
- No value on an outside surface appears in a longer form than `priv-shoulder` allows for its category, any widget that must not reach the keyguard declares `not_keyguard`, and anything sensitive on a Live Activity is a summary or a privacy-marked view. `widget-shoulder`
- No outside surface carries a promotion, a cross-sell or a shortcut unrelated to what it reports, and everything it shows exists in more detail inside the app; an ad unit built into one is scored under `ads-placement`. `widget-scope`
- Every image and icon-only element on every presentation has a label, status labels change with the status, no text is rasterized, nothing is drawn below 11pt, and the layout still holds at the largest accessibility text size at the smallest size the surface declares. `widget-a11y`
- All four Live Activity presentations have their own layout rather than one reused across them, the minimal one draws the app's own mark, expanded and lock screen hold inside 160pt of height, and no image asset exceeds the presentation drawing it; a codebase that ships only to Android answers this not applicable. `widget-island`
- Every Live Activity sets a chosen dismissal time rather than taking the four hour default, and its final content states the outcome rather than the last in-progress frame. `widget-live-end`
- Every promoted notification meets all nine promotion requirements, carries its state in its own title and body so nothing depends on the promoted presentation, checks promotability and user permission at runtime, and is not reposted after a dismissal; a codebase that ships only to iOS answers this not applicable. `widget-promoted`

Two of these cannot be settled from the source. Run the app on a device with the reader on and walk every presentation, confirming each image has a name that follows its status and that the layout survives the largest accessibility text size at the smallest declared size (`widget-a11y`), and start a second Live Activity so the system falls back to the minimal presentation, then touch and hold to expand, and check the surface stays identifiable and untruncated in all four (`widget-island`).

### Reaches

- `heuristics/accessibility.md`: `a11y-name`, `a11y-test`
- `heuristics/ads.md`: `ads-placement`
- `heuristics/colors.md`: `color-not-alone`
- `heuristics/data-display.md`: `data-time-relative`
- `heuristics/icons-and-imagery.md`: `icon-alt`
- `heuristics/layout.md`: `layout-width`
- `heuristics/localization.md`: `l10n-expansion`
- `heuristics/motion.md`: `motion-duration`
- `heuristics/navigation.md`: `nav-deeplink`
- `heuristics/notifications.md`: `notify-ongoing`, `notify-lockscreen`, `notify-level`
- `heuristics/offline.md`: `off-local-first`, `off-session`
- `heuristics/privacy-ui.md`: `priv-shoulder`
- `heuristics/states.md`: `state-stale`, `state-loading`, `state-empty`, `state-error`
- `heuristics/touch.md`: `touch-floor`
- `heuristics/typography.md`: `type-scaling`
- `platform/background-work.md`: `bg-not-running`, `bg-periodic`, `bg-wake-push`, `bg-visible-stoppable`
- `platform/performance.md`: `perf-power`

# platform/background-work.md

## Background work

The moment the app leaves the screen its own execution is on a countdown. iOS suspends it. Android leaves it a window of a few minutes and then stops its services as though `stopSelf` had been called. Either way the operating system decides whether the app wakes again, when, and for how long, and it decides that against battery, thermals, and how often this person actually opens the app. Almost every generated background feature is written as though none of that were true: a timer that keeps ticking, a poll every thirty seconds, a sync that assumes the process is still there.

This file covers whether work may run at all and under what constraint. What sits in the pending queue is `off-queue`, what the work costs in battery and heat is `perf-power`, and how the notification attached to it is written is `notifications.md`. Audio that keeps playing while the app is away is `media-background`, and a transfer the user started and is watching is `net-upload`.

Platform versions named in this file run up to Android 16 and iOS 26. Each rule states a behaviour first and an API second. On a release newer than those, the behaviour still binds and the API name is the part to check against the platform's current documentation.

Rules in this file, in order: `bg-not-running`, `bg-now-or-later`, `bg-leaving`, `bg-periodic`, `bg-visible-stoppable`, `bg-service-last`, `bg-declared`, `bg-location`, `bg-exact-time`, `bg-wake-push`, `bg-restricted`, `bg-exemption`, `bg-failed-away`.

### `bg-not-running` The app is not running, so nothing the app schedules by itself will fire

A timer, an interval, a countdown or a polling loop only runs while the process is alive, and the process is not alive. So none of those is ever the mechanism. Work meant to happen while the user is elsewhere is handed to something the platform owns and wakes on its own terms. The scheduler is the default of those, `WorkManager` on Android and `BGTaskScheduler` on iOS, whichever of the two the cross-platform wrapper reaches. The others are named as they come up: a transfer session (`net-upload`), a queue the system drains (`off-queue`), a push that wakes the app (`bg-wake-push`), a location trigger (`bg-location`), a media session (`media-background`), a foreground service where nothing narrower fits (`bg-service-last`).

The tell in a diff is a repeating callback registered in a screen, a store, or app startup, with a comment about keeping data fresh. Whatever a screen left running on its way out is the other half of the same bug, and `perf-power` owns it.

### `bg-now-or-later` Sort every unit of work into must-finish-now and can-wait, and there is no third pile

Now means the user just started it and is watching or expects a result: an upload they tapped, a payment, an export. Later means everything else, and everything else is the majority.

Later work is expressed as conditions the system evaluates, never as a clock the app invented. "When the device is charging and on unmetered network" is a constraint. "At 2am" is a timer, and it will not fire at 2am.

The two platforms do not offer the same conditions, and the longer list does not degrade into the shorter one by itself.

- **Android.** A network type (connected, unmetered, not roaming), charging, battery not low, storage not low, device idle.
- **iOS.** A processing task takes network connectivity and external power, and nothing else. A refresh task takes no constraints at all, only the earliest time it may begin, which is what most apps schedule. Anything finer is a check the app runs itself once the task has started.

Runtime is budgeted on both. A scheduled refresh on iOS gets up to 30 seconds, so it fetches and stores one thing rather than running a whole sync. Android budgets by standby bucket: 10 minutes of job runtime per rolling 4 hours in the working set, per 12 hours in the frequent bucket, per 24 hours in the rare one.

Either pile can have its process killed between the schedule call and the run, so nothing about a unit lives only in memory across that gap, and every unit carries the identity `off-queue` defines: an id generated before the first attempt and reused on every attempt after it, so a second arrival reads as the first one coming round again rather than as a second charge.

### `bg-leaving` Work already in flight when the user leaves is finished or handed over, never dropped

This is the other half of the now pile, and it is the most common background moment in a real app: the request is open, the write is half done, and the user goes to answer a message. Both platforms give the app a short assertion to finish what is already running, `beginBackgroundTask` with its expiration handler on iOS and a promoted unit or expedited work on Android, and neither publishes how long it lasts. So the window is unknown and the expiration is certain, which leaves one safe design: finish or persist. The assertion is spent on the unit that was nearly done, the expiration handler writes whatever is left into the durable queue (`off-queue`) or onto the scheduler instead of cancelling it into nothing, and the assertion is ended on every branch (`perf-power`). What the screen has to remember on the way out is `state-interrupt`; this rule is the work, not the view.

### `bg-periodic` A repeat interval is a floor, and the count of them is the real number

On Android the shortest repeat WorkManager accepts is 15 minutes, and 15 minutes is the earliest the work may run rather than a promise that it will. The system stretches that interval as the app is used less, batches it with other apps' work, and defers it to the next maintenance window while the device sits idle off charger, and those windows get rarer the longer the idle lasts. iOS publishes no minimum and no cadence at all: `BGAppRefreshTaskRequest.earliestBeginDate` is a floor the app sets, with no ceiling and no promised frequency, so any "refreshes every N minutes" figure is invented.

So: count the recurring jobs the app schedules, list them in `STACK.md`, and give each one a sentence there saying what breaks if it does not run today. An app with six periodic jobs has six wakeups it cannot justify and one bug report about battery.

### `bg-visible-stoppable` Work that keeps running while the app is away is visible, and the stop actually stops it

Long user-started background work goes behind a system surface the person can see and cancel: on Android a foreground service with its required notification, on iOS 26 and up a continued-processing task whose progress the system shows in a Live Activity with a cancel control the user can hit. Below that iOS floor no such surface exists, and a user-started transfer belongs in a background `URLSession` instead (`net-upload`).

That surface is an interface, not a formality.

- It reports real progress. On iOS the system prioritises terminating the tasks that report little or none once resources tighten, so a fake indeterminate spinner is also a shorter task.
- Its stop cancels the work. The cancel affordance built into that surface, the stop action in the notification (`createCancelPendingIntent` behind it) and the cancel control in the Live Activity, ends the unit itself rather than hiding the surface it was watched through. A job that carries on writing after its own stop was hit is the failure users notice on the battery screen.
- After a stop, the partial result is either kept and marked as partial, or discarded and said to be discarded. See `state-partial` and `state-queued`.
- What the notification says, and what a swipe away means, are both `notify-ongoing`.

### `bg-service-last` A foreground service is the last route, and it arrives with a declared type and a budget

Check the narrower API first: a user-initiated data transfer job instead of a generic data sync, picture-in-picture instead of a media playback service, the companion device manager instead of a connected device service. Each of those exists precisely so the service does not have to.

Where the service is genuinely right, it comes with hard edges:

- On Android 14 and up it declares one of the published service types in the manifest and requests the permission matching that type, and the store reviews the type and the stated use before the app ships.
- A long-running worker promoted with `setForeground` is a foreground service underneath, so it declares the same type, requests the same permission and meets the same review. Reaching it through WorkManager avoids none of that.
- A service started with `startForegroundService` has 5 seconds from being created to call `startForeground` or the app crashes. Where the start came from does not extend that, so a service started from a visible screen owes the call just as fast.
- A short service runs about 3 minutes and cannot start another service. For apps targeting API 35 and up, data sync and media processing services share 6 hours per rolling 24 across every service of that type, and the clock resets only when the user brings the app to the front.
- From Android 16, jobs started from a foreground service still count against the app's ordinary job quota, so wrapping work in a service no longer buys unlimited scheduling.
- An app already in the background may not start one at all on Android 12 and up, outside a short exemption list. The start point is a user action inside the app, or a high-priority push.
- The boot broadcast may not launch several of the declared types, so a receiver that runs at boot schedules the work and lets the scheduler pick it up rather than starting a service on the spot.

### `bg-declared` Every declared background capability names a feature that uses it

The declaration is a list and the list is reviewed. On iOS it is `UIBackgroundModes`: audio, location, voip, external-accessory, bluetooth-central, bluetooth-peripheral, fetch, processing, remote-notification and the rest. On Android it is the foreground service types in the manifest, each with the permission it requires.

- Each entry maps to a shipping feature that uses it for the purpose the entry names. Both stores review background use against its stated purpose, and a mode declared for convenience, inherited from a template, or held open to keep the process alive is a rejection rather than a warning.
- An entry with no feature behind it is deleted from the manifest rather than left in and ignored, and the app reaches for the alternative wherever one exists.
- Audio is the common legitimate case, and `media-background` owns its paperwork.

### `bg-location` Continuous background location is the last form to try, not the first

Both stores police this harder than any other background capability and both ask the same question: which shipping feature needs it, and what does the person holding the phone get from it.

- Significant-change monitoring and geofences wake the app on the events a feature actually reacts to, at a fraction of the power, and they cover most of what continuous updates get used for. Continuous updates are for a feature that follows a moving position while the user is away from the screen, such as turn-by-turn or an active recording.
- Where it is right it is declared: the location background mode on iOS, the `location` foreground service type with its permission on Android, and the indicator the platform draws stays visible (`sense-running`).
- The feature that needs it is named in the same place the permission is asked for, and that ask is the separate, later one `perm-scope` describes.

### `bg-exact-time` Exact timing is expensive, gated, and almost never what the feature needs

Default to an inexact window. For an app targeting Android 12 and up, a requested window shorter than 10 minutes is normally widened to 10, so the design assumes 10 rather than the number it asked for, and an alarm permitted to fire through device idle may fire at most once per 9 minutes per app.

Two Android permissions cover exact alarms and they are not interchangeable. `SCHEDULE_EXACT_ALARM` is granted by the user, revocable, not pre-granted to a fresh install targeting Android 13 and up, and open to a broader set of uses. `USE_EXACT_ALARM` is granted automatically and cannot be revoked, and store policy restricts it to alarm, timer and calendar apps.

The thing that earns exact timing is a time the user themselves set, and `setAlarmClock` is the form that serves it: it is the alarm device idle does not defer, and it is the case those permissions exist for. Where the alarm only has to fire while the app is alive, the `OnAlarmListener` form needs no exact alarm permission at all. A refresh, a reminder to come back, a cache expiry and a nightly cleanup earn none of it. iOS has no exact alarm to ask for at all: a time the user set is a local notification scheduled for that time, and firing it runs no app code, so the notification carries what the user has to read, and anything that has to be computed at that moment is computed when the app is next opened or when the notification is acted on.

### `bg-wake-push` A push that wakes the app to fetch is a budget, and the budget is small

iOS rate limits an app that sends more than 3 background pushes per hour, and gives 30 seconds of runtime when one is delivered. Android downgrades an app's high-priority messages once it notices them arriving without a notification following.

So a silent wake-up is spent on content the user is actually waiting for, and content they must be told about arrives as a notification that stands on its own: see `notify-earns-it`. An app that pushes on every server-side change to keep a cache warm loses the channel it will need later.

### `bg-restricted` The user restricting the app is a state to degrade in, not a bug to route around

Read the state before promising anything. Background refresh is a switch the user owns on iOS, and where the system reports it as restricted rather than off the app says nothing about it at all. On Android there are two restricted states and they are not the same one. The battery state the user sets, which the system itself offers after the app holds a partial wake lock for an hour with the screen off, runs no jobs, fires no alarms and reaches no network except while the app is in the foreground, starts no foreground service and demotes any already running, and while the app targets Android 13 and up does not even deliver the boot broadcast. That is the stock behaviour, and the manufacturer decides what its own build does on top of it, which is why the same scheduling code that runs on one phone never fires on another. The restricted standby bucket is the system's own classification of a rarely used app: one job a day for up to 10 minutes, one alarm a day, and no network or push delivery in the background at all.

A force quit is the same answer in a blunter form. Swiped out of the switcher, the app is simply not running: its scheduled work does not fire, wake-up pushes do not reach it, and its transfers stay stopped until the person opens it again (`net-upload`). So no screen anywhere promises that a background feature keeps going, and every feature that leans on one is designed to be found stale on return (`bg-failed-away`).

Degrading means the feature that depends on background work says what it can still do, where that feature lives, in one line: content is current as of when the app was last open. It does not mean an interstitial on launch, and it is never a retry loop, for the reason `sense-off-system` gives about any switch sitting above the app. A grant here is a current value and not a fact, same shape as `perm-recheck`.

### `bg-exemption` Asking for a battery exemption is a last resort that has to name its reason

Store policy prohibits requesting a direct exemption from power management unless the app's core function is impaired without it, and the accepted reasons are a short published list. For everything else the app may only open the battery settings screen, never prompt for the exemption directly, and only after the user has hit the limitation and been told plainly what it costs them. On iOS there is no equivalent to ask for, and instructing the user to change a system setting unrelated to the app's core function is a rejection.

This is never the first answer to work not running. Almost every time, the work was scheduled wrong, ran too long, or should have been deferred. See `perf-power`.

### `bg-failed-away` Work that failed while nobody was looking is visible when they look

The sync that failed at 3am is a state the screen shows at 8am, not a log line. Work the app retries itself gives up at the attempt ceiling `net-backoff` owns, which exists as a named constant rather than as a number buried in a loop, then writes a state the UI reads: the affected content marked stale with its age (`state-stale`), anything unsent marked as pending rather than done (`state-queued`), and a route to retry that does not lose what was queued (`state-retry`). A transfer the platform session retries on the app's behalf is the exception `net-timeout` names, and an attempt ceiling stacked on top of it counts the attempts twice.

Silent failure is worse here than anywhere else in the app, because the user had no way to see it happen and every reason to believe it worked.

### Check

Review answers each of these against the code, pointing at the line:

- No timer, interval or polling loop is the mechanism for work expected to happen while the app is away, and every such unit is handed to a platform-owned mechanism instead: the scheduler, a transfer session, a drained queue, a push, a location trigger or a declared service. `bg-not-running`
- Every deferrable job declares at least one system constraint where the platform offers them, no job encodes a wall clock time the app chose, and every unit carries an id generated before the first attempt that makes a retry recognisable as the same request. `bg-now-or-later`
- Work in flight when the app is backgrounded takes the platform's short assertion, and the expiration hands what is left to the queue or the scheduler rather than dropping it. `bg-leaving`
- Count the recurring jobs the app schedules: each one has its reason written in `STACK.md`, and none assumes its interval is a schedule. `bg-periodic`
- Every long-running background unit reports real progress through the platform's visible surface and carries a stop that cancels the work itself. `bg-visible-stoppable`
- Each foreground service names a declared type with its matching permission, calls `startForeground` within 5 seconds of the service being created wherever the start came from, and was chosen only after the narrower API was ruled out. `bg-service-last`
- Every declared background mode and foreground service type maps to a shipping feature that uses it for that purpose, and anything else is deleted from the manifest. `bg-declared`
- Background location uses significant-change monitoring or a geofence unless a moving position has to be followed, and the feature that needs it is named where the permission is asked for. `bg-location`
- Count the exact alarms: each one is a time the user set, and everything else uses an inexact window. `bg-exact-time`
- Wake-up pushes are sent for content the user is waiting on, and the app does not send them per server-side change. `bg-wake-push`
- The app reads the restriction state, no screen promises that background work keeps running, and the dependent feature degrades in place, in one line, rather than blocking or nagging. `bg-restricted`
- No code path prompts for a battery optimisation exemption, and any settings route is reached after the user hits the limit and reads why. `bg-exemption`
- Every background job's failure path writes a state a screen reads, and every retry the app runs itself stops at an attempt ceiling held in a named constant. `bg-failed-away`

### Reaches

- `heuristics/media.md`: `media-background`
- `heuristics/notifications.md`: `notify-ongoing`, `notify-earns-it`
- `heuristics/offline.md`: `off-queue`
- `heuristics/permissions.md`: `perm-scope`, `perm-recheck`
- `heuristics/sense.md`: `sense-running`, `sense-off-system`
- `heuristics/states.md`: `state-interrupt`, `state-partial`, `state-queued`, `state-stale`, `state-retry`
- `platform/network.md`: `net-upload`, `net-backoff`, `net-timeout`
- `platform/performance.md`: `perf-power`

# platform/network.md

## Network

The phone is the device where the connection is worst and the person holding it is least patient. The link is high latency, it costs money on most plans, and it changes underneath a running screen: Wi-Fi to cellular at the door, one cell to the next on a train, three bars to nothing in a lift.

Online and slow is the problem this file exists for, and it is a different problem from offline. Nothing throws, so no error branch runs. The request is still open, the screen is still waiting, and the only thing that ends it is the user closing the app.

This file owns the request and the radio: deadlines, retries, cancellation, how many calls a screen makes and how many bytes each one costs. What is stored on the device and what is queued while disconnected is `heuristics/offline.md`. What the screen shows while any of it happens is `state-loading`, `state-offline` and `state-stale`.

Platform versions named in this file run up to Android API 35. Each rule states a behaviour first and an API second. On a release newer than that, the behaviour still binds and the API name is the part to check against the platform's current documentation.

Rules in this file, in order: `net-timeout`, `net-backoff`, `net-cancel`, `net-dedupe`, `net-fanout`, `net-payload`, `net-conditional`, `net-metered`, `net-reachability`, `net-prefetch`, `net-upload`.

### `net-timeout` Every request carries a deadline the app chose [pass or fail]

`state-loading` owns what the screen draws when a deadline is reached. This rule owns the deadline itself, which no stack sets on the app's behalf.

The stock values bound parts of a call, not the call. On iOS `timeoutIntervalForRequest` defaults to 60 seconds and is an idle timer, reset every time a byte arrives, so a connection dripping one packet at a time never trips it at all; `timeoutIntervalForResource`, the cap on the whole transfer, defaults to seven days. OkHttp bounds connect, read and write at ten seconds each and leaves `callTimeout` at zero, so the call as a whole is unbounded. The trickling connection is the ordinary way a phone link fails, and none of those defaults ends it.

So bound the whole call, not just its idle gaps. Give each class of request its own deadline (an interactive read, a submit, a background sync, a media transfer), keep them as named constants in one place instead of per call site, and hand each one to `state-loading` with its branch already written.

The two background classes carry an exception. A background `URLSession` transfer is bounded by `timeoutIntervalForResource` rather than by the request timeout, and it retries a timed-out upload or download itself, so the attempt ceiling in `net-backoff` does not apply there and a hand-rolled retry stacked on top of it counts twice.

### `net-backoff` Retry backs off with jitter, and stops at a written number of attempts

`state-retry` settles that automatic retry backs off, stops, and fires on the platform's reconnect signal. Three things it leaves open, and this rule owns them.

- **Jitter.** That reconnect signal fires on every phone at once: a carriage empties onto a platform, a tower comes back, a train leaves a tunnel. A fixed schedule turns the fleet into one synchronised wave that arrives at a server already struggling. Randomise every delay.
- **A ceiling that exists as a constant.** Attempts are counted and the count is written down, so the retry ends in a message rather than in a loop nobody watched.
- **Only what is safe to retry.** A lost connection, a timeout, a 429 and a 5xx are worth another attempt. A 400, 403 or 404 gives the same answer the second time, and spending attempts on it only delays the sentence the user needs. Where the server sends `Retry-After`, it wins over the schedule.
- **A 401 is the one 4xx that is retried.** It means authenticate and try again, so the app refreshes the token and replays the request once, through the hook built for it (`Authenticator` in OkHttp, a request interceptor on iOS and in Flutter). Deduplicate the refresh, or an hour spent backgrounded ends with every queued request firing its own. Sign the user out only when the refresh itself is refused.

A retried write carries the same client-generated key on every attempt, so the server can tell the second arrival is the first one coming round again. Without it, a confirmation that dies on the return trip charges the card twice. `off-queue` holds that key for queued work; a foreground retry of a submit needs it just as much.

### `net-cancel` Leaving the screen cancels its requests, and a late answer never lands on the current one

What the first half hunts is the detached request: `GlobalScope`, a bare `Task {}`, a `fetch` with no signal, a client nobody disposes. Owned by nothing, it holds the radio up and delivers into a screen that has been popped. The idiomatic APIs already end on their own, so this is a defect of going around them rather than of forgetting a call: `.task` and `lifecycleScope` die with the screen, an `AbortController` aborts with the effect that made it, a Flutter cancel token is disposed with the widget. `viewModelScope` is the deliberate exception, because a ViewModel survives the rotation that destroys and rebuilds the screen, which is what makes the second half of this rule load-bearing rather than free.

That second half is ordering. Two answers to the same question come back out of order, and on a slow link they routinely do: the search for "ma" lands after the search for "mango" and overwrites it. What has to be true is that a response never writes state for a question the user has moved on from. A latest-wins operator gets there by construction (`flatMapLatest` or `collectLatest`, `.task(id:)`, `switchMap`, a token swapped per query) and correct code built that way has no "am I still current" line anywhere in it; an explicit generation check gets there by hand. Either satisfies the rule. The phone makes the failure constant rather than rare, because back is a cheap edge gesture, screens are destroyed and rebuilt, and with a single screen visible the overwrite happens under the eyes of the person who caused it.

### `net-dedupe` One read in flight per thing being asked for

Key in-flight reads on the endpoint and its parameters. On a phone the same read is fired twice from ordinary places the user never touched: two components on one screen wanting the same record, a screen that re-requests on every resume, an effect that repeats on a re-render.

- A duplicate arriving from code joins the request already running instead of opening a second one.
- A duplicate arriving from the user preempts it. A pull to refresh is a request for the value as of now, so it cancels the refresh already in flight and fetches again; joining that one answers the gesture with bytes fetched before the thumb moved, which is the single thing the gesture exists to rule out. `list-refresh` owns the gesture itself.
- Writes are never deduplicated by request shape. Two identical writes are two writes: the same message sent twice, a second unit of the same item, a measurement logged again. What collapses a duplicate write is the client key in `net-backoff`, carried on every attempt so the server can recognise it, with `button-state` stopping the control accepting the second tap in the first place.

### `net-fanout` Count the calls a screen makes, and the count does not grow with the rows

A list that fires one request per row is a defect rather than a slow screen. The clients pool connections, so the bill is not twenty handshakes: it is twenty round trips on a link where one round trip is already the slowest thing on the screen, and a radio held at full power across the whole span instead of for a single burst.

- The first render of a screen makes a fixed number of calls, and that number is written down. Rows arrive carrying what they draw, or their ids go out in one batched call.
- Chains pay their latency end to end. Independent calls start together; only a call that genuinely needs the previous answer waits for it.
- Polling is fan-out spread over time. Where the product needs live data, a subscription or a push costs one connection instead of one per interval. The interval a poll is allowed to keep, and ending it when its screen goes away, is `perf-power`.

### `net-payload` Ask for the size the screen draws and the fields it renders

- **Images.** Request the variant sized for the box it lands in, at the device's pixel ratio, from the server or the image CDN. Decoding to the drawn size is `list-images` and `perf-decode`, which are memory; this is the bytes crossing a metered link, and shipping a full-resolution photograph to fill a 48dp circle spends both.
- **Fields.** Ask for what the screen renders. A row showing a name and a thumbnail does not need the record behind it, and a mobile-shaped response is a server change worth asking for rather than a filter applied after the download.
- **Pages.** Page size is a constant derived from what fills the viewport plus a screenful of headroom. Page by cursor rather than by offset: a phone feed is re-entered a dozen times across a day of interruptions and each return resumes paging from where the thumb stopped, so rows that shifted in between make an offset repeat some and skip others, in the one place the user is looking.
- Nothing sets `Accept-Encoding` by hand. The clients add it and decompress the response transparently, and both stop the moment a header interceptor writes that header itself, leaving the app fetching uncompressed bytes and holding a decode it did not ask for.

### `net-conditional` Refreshing something already held asks whether it changed

The cheapest answer on a metered radio is the one with no body in it. A record kept locally keeps the validator it arrived with, `ETag` or `Last-Modified`, and the refresh sends it back as `If-None-Match` or `If-Modified-Since`. A 304 then moves the freshness mark that `state-stale` renders and leaves the content on screen untouched.

Skip it and every pull to refresh downloads a page the device already holds byte for byte, which is the most expensive way to learn that nothing happened. The validator lives in the record's own row, beside the fields `off-fresh-marks` names, because a header cache the OS is free to reclaim cannot be relied on to still hold it.

### `net-metered` Metered is a setting the user chose, not a transport you detect

Read the flag the platform publishes: `NWPath.isConstrained` and `allowsConstrainedNetworkAccess` for Low Data Mode, `getRestrictBackgroundStatus()` and `NET_CAPABILITY_NOT_METERED` for Data Saver and metered networks, `isConnectionExpensive` in React Native, `navigator.connection.saveData` on the web where it exists at all, which is a hint and not a guarantee.

- Metered is defined by what the connection costs the person, not by which radio carries it. A tethered hotspot arrives over Wi-Fi and is metered; an unlimited plan is cellular and is not. Code that branches on "is this Wi-Fi" gets both cases wrong.
- Limit on any metered connection, whether or not the system setting is on, and whether or not the app has been exempted from the restriction. The exemption is permission to keep working, not permission to stop caring.
- What changes under the flag is listed in `state-offline`. What must not change is the tap: user-initiated work is delivered, in a smaller form if it has to be, and never blocked. Do not put up a dialog asking whether they really meant it. They set the flag on purpose, and the app is being asked to spend less, not to ask more.

### `net-reachability` A connectivity check defers optional work, it never gates a tap

Having a network and reaching a server are different states, and the platforms report them separately: on Android `NET_CAPABILITY_INTERNET` means the network is set up while `NET_CAPABILITY_VALIDATED` means it was actually probed, and a captive portal holds the first without the second. React Native splits the same pair into `isConnected` and `isInternetReachable`, and `navigator.onLine` on the web counts a LAN with no route out as online.

- The check never decides whether a request the user has committed to is allowed out. Send it, and let the failure be the answer, because a check saying no on a working connection is an outage the app invented. It may shape the control before the tap, which is the online-only mode in `off-write-mode`, and it may skip optional traffic. It may not sit between the tap and the socket.
- Where it earns its place is deferring the optional: prefetch, analytics and background sync skip rather than sending the radio hunting for a signal that is not there.
- Subscribe rather than poll: `NWPathMonitor`, `registerDefaultNetworkCallback`. Capabilities change under a running app, and a value read a moment ago is already a guess.
- There is a third answer besides sent and failed. `waitsForConnectivity` holds a task until a path exists instead of failing it, and reports through `urlSession(_:taskIsWaitingForConnectivity:)`, which is where the app gets to say so. That wait takes the same deadline as everything else and surfaces through `state-offline`, rather than sitting silently inside a loading state with no end. Background sessions ignore the flag and always wait.

### `net-prefetch` Prefetch spends data on content that may never be read

It is a trade, so it gets a budget rather than an instinct. Fetch in a shape that needs another download only every 2 to 5 minutes and in the order of 1 to 5 megabytes, and pull large media in chunks on that same interval instead of in one go. What the repeated waking costs the battery is `perf-power`.

- Write down what is prefetched, how much of it, and what triggers it. The next page of a list already being scrolled and the detail behind the row under the thumb both earn it. A whole feed of full-size media does not.
- It never runs during launch, where `perf-cold-start` already keeps preloads for unopened screens off the path to the first frame, and it never runs under the flag in `net-metered`.

### `net-upload` A transfer outlives the screen, and its progress counts bytes

`off-queue` owns the durable queue of writes and the scheduler that drains it. What is left here is the transfer the user started and is watching, which runs long enough that the app is suspended before it ends. Hand it to the platform service that matches its shape.

- **iOS.** A background `URLSession`. Its upload body has to be a file on disk: a background session refuses one built from a `Data` or a stream, which is the failure that kills the transfer at the first suspension.
- **Android.** WorkManager where the transfer is short and interruptible. A user-initiated data transfer job (`setUserInitiated(true)`, permission `RUN_USER_INITIATED_JOBS`, API 34 and up) where it is long and the user started it, scheduled while the app is still visible. `DownloadManager` where the thing is a download, since it already retries across connectivity changes and reboots and takes its own metered and roaming limits. The long-running foreground-service worker is what is left below API 34, and for apps targeting API 35 and up its data sync time is capped at 6 hours in any 24, with the timer reset each time the user brings the app back to the foreground.

Then:

- Chunk it and keep a resume handle in durable storage, so an interruption continues instead of starting over. On iOS a download resumes from `resumeData` only where the request was a GET, the server sent `ETag` or `Last-Modified`, and byte ranges are supported; miss one and the whole file comes down again. An upload has no client-side equivalent: its resume point lives on the server, through a chunked or resumable upload protocol.
- The transfer does not survive everything, and the interface must not imply it does. Swiping the app out of the switcher cancels iOS background transfers until the person opens the app again.
- Progress is real bytes moved over bytes total, emitted by the transfer rather than estimated from elapsed time. How that number is drawn, whether pause stands beside cancel, and what the user is told cancelling costs are all `state-loading`.

### Check

Review answers each of these against the code, pointing at the line:

- Every class of request has a total deadline on the whole call, held as a named constant, and background transfers take the resource timeout rather than the request one. `net-timeout`
- Automatic retry randomises its delays, counts attempts against a constant, retries only transient failures, 5xx and one deduplicated token refresh on a 401, and repeats a write under the same client key. `net-backoff`
- No request runs on a detached scope, and a response to a question the user has left cannot write state, whether by a latest-wins operator or by an explicit generation check. `net-cancel`
- Reads in flight are keyed and shared, a refresh gesture preempts the request already running rather than joining it, and no write is collapsed by its shape. `net-dedupe`
- The number of calls a screen makes to render is fixed and written down, does not scale with row count, and independent calls do not run in a chain. `net-fanout`
- Image requests carry the drawn size, responses carry only rendered fields, pages are cursor-based at a size derived from the viewport, and nothing sets `Accept-Encoding` by hand. `net-payload`
- A refresh of a stored record sends the validator it was stored with, and a 304 updates its freshness mark without touching the content on screen. `net-conditional`
- The metered and Low Data Mode flags are read from the platform rather than inferred from the transport, and no user-initiated request is blocked or questioned because one is set. `net-metered`
- No connectivity check stands between a committed tap and the request it sends, and the app subscribes to path changes rather than polling them. `net-reachability`
- Prefetch has a written budget and trigger, and runs neither during launch nor on a metered connection. `net-prefetch`
- Long transfers run on the platform service matching their shape, carry a durable resume handle, and report progress from real byte counts. `net-upload`

Answer `net-timeout`, `net-backoff` and `net-cancel` on a throttled connection rather than on a fast one, because every one of them passes by accident when the response arrives in 40ms. `net-fanout` is answered by counting the calls on a proxy while one screen opens, not by reading the repository.

### Reaches

- `heuristics/buttons.md`: `button-state`
- `heuristics/lists.md`: `list-refresh`, `list-images`
- `heuristics/offline.md`: `off-queue`, `off-fresh-marks`, `off-write-mode`
- `heuristics/states.md`: `state-loading`, `state-offline`, `state-stale`, `state-retry`
- `platform/performance.md`: `perf-power`, `perf-decode`, `perf-cold-start`

# platform/performance.md

## Performance

A phone runs the app on a battery, in one hand, on hardware picked for a price, at whatever thermal budget is left over from whatever the user did before opening it. That turns performance into a design constraint rather than an engineering one, because past a certain wait the user cannot tell a slow screen from a broken screen: they decide nothing happened and press again.

The device this fails on is never the device it was built on. It is a few years old, its storage is slow, its memory is shared with everything else the user left open, and it has been warm since before the app launched.

Row recycling is `list-virtualise`. Which properties an animation may move is `motion-cheap`. Request weight, timeouts and retries are `platform/network.md`. What a sensor or a location subscription is allowed to do, and what stops it, is `heuristics/sense.md`; this file owns only what holding one costs. What the screen shows while any of this is happening is `state-loading`, and the launch surface is `splash-system`.

Platform versions named in this file run up to Android API 34. Each rule states a behaviour first and an API second. On a release newer than that, the behaviour still binds and the API name is the part to check against the platform's current documentation.

Rules in this file, in order: `perf-cold-start`, `perf-main-thread`, `perf-frame`, `perf-overdraw`, `perf-decode`, `perf-memory`, `perf-power`, `perf-size`, `perf-measure`.

### `perf-cold-start` Only what the first screen draws happens before the first screen draws

Three ways in, and they cost different things: cold, with the process built from nothing; warm, with the first screen recreated while the process or part of the app is still resident; hot, with the app returning and its interface intact. Cold is the one that is designed for and the one that is never measured, because the phone on the desk is always warm.

Two numbers exist per launch. Time to initial display ends the moment a frame is on screen, and both platforms report it without the app doing anything. Time to full display ends when the screen holds real content, and it exists only if the app says so: `reportFullyDrawn()` on Android, a signpost on the points-of-interest log on iOS. An app whose first frame is a placeholder and that reports only the first number is timing the placeholder; where the first frame already carries real content the two are the same moment and nothing extra is owed. Android's store calls a cold start of 5s or a warm start of 2s excessive, which is the bar for bad rather than a target.

Everything else starts on first use, or on the first idle frame. What is found on the launch path and does not belong there:

- analytics beyond installing the crash handler, remote config, and feature flags;
- attribution, advertising and payment SDKs;
- database open and migration, and any synchronous file or preference read the first screen does not need; the small local reads that legitimately hold the launch surface are named in `splash-hold`;
- font and image preloads for screens nobody has opened yet;
- location, and any sensor or radio the first screen does not display;
- anything imported at module scope that the first render never touches, since it is parsed and evaluated before that render.

One dependency is usually most of the cost, so the cost is attributed per dependency rather than to launch in general. Each stack then has its own lever. On Android a baseline profile listing the startup path gets that code compiled ahead of time instead of interpreted, which is roughly 30% faster code execution from the first launch. On iOS the equivalent levers are the number of dynamic frameworks and everything that runs before `main`: static constructors, `+load`, and constructor attributes. On Flutter and React Native the engine or runtime start is a fixed cost underneath all of the above, so what the first screen does not need is deferred or lazily loaded rather than carried in the first bundle.

### `perf-main-thread` The thread that draws does nothing else

Under 100ms a discrete tap reads as instant. A main thread busy for 250ms is what the iOS tools start reporting as a hang. At 5s of undelivered input Android raises an ANR, and iOS terminates an app whose main thread has stopped answering. On a phone there is no second window to look at while it recovers, so every one of those is a crash as far as the user is concerned.

What keeps turning up there and does not belong:

- JSON parsing, and any deserialization of a response big enough to page;
- database queries, file reads and preference reads, which are all slower on the storage a cheap phone ships with;
- image decode, crypto, and a regular expression run over a long string;
- sorting or filtering a whole collection to render a screenful of it;
- a state update scoped so wide that one keystroke rebuilds the screen.

Each stack names the way off, and the move is written at the call site rather than assumed: a dispatcher on Android, an actor boundary and an async context on iOS, an isolate for anything long in Flutter, work kept off the JS thread in React Native. A background thread that then hops back to publish a result once per element of a list has moved the problem rather than solved it.

### `perf-frame` The budget is one refresh interval, and 60 is not a constant

One refresh interval is 16.6ms at 60Hz and 8.3ms on a 120Hz panel. What follows from it is that no value in the code may assume it. A 16ms timer, a frame count used as a duration, or an animation stepped by a fixed interval is a build tuned for one panel that stutters on the next one, and phone panels now run at 60Hz, 90Hz and 120Hz in the same product line. Motion comes from the stack's own frame callback or from `motion-cheap`.

Two ceilings sit above the budget. No frame in the app may take longer than 700ms, which is the point a frame stops being slow and reads as the app having stopped. And Android's vitals dashboard counts frames against a fixed 16ms whatever the panel is doing, so a build that meets a 120Hz deadline still reads as slow there. That is a reporting convention rather than a bar the store enforces, and the number to design against stays the device's own refresh interval.

### `perf-overdraw` The look has a per-frame price, and a still screen pays it too

Blur, translucency, shadow and gradient are decisions taken in the design and settled in GPU time, charged on every frame the screen is up rather than only while something moves. `motion-cheap` bounds them during an animation; this rule is the screen sitting still.

- One blurred or translucent layer over scrolling content, never two stacked. The second has nothing left to reveal and doubles the sampling behind it.
- Elevation is a token count rather than a per-card decision. Forty rows each carrying a soft shadow is forty extra passes, and a divider, a spacing step or a tonal surface says the same thing for nothing.
- A gradient or a shader is bounded to the region doing the work (`color-gradient`), not stretched behind the whole screen.
- Backgrounds do not stack. An opaque window under an opaque container under an opaque card paints the same pixel three times, and on a mid-range device those repeats are the frame.

### `perf-decode` An image costs its decoded size, and its decoded size is not its file size

A decoded bitmap is width times height times four bytes, taken from the pixels it was decoded to. A 4000 by 3000 photo is roughly 48MB resident whether it fills the screen or sits in a 48dp avatar, and a handful of those is more than the process is given. A 300KB file on disk says nothing about that number.

So the decode target is the box the image is drawn into. Where the loader derives that box from the layout it already satisfies the rule and owes nothing at the call site, which is the ordinary Android case with Coil or Glide. Where it cannot, the size is declared where the image is loaded: `cacheWidth` and `cacheHeight` in Flutter, the thumbnail size option on iOS, explicit dimensions on a React Native `uri` source, a width parameter on the URL where the pictures come from a service that can resize. A decode with no layout bound behind it is the defect this hunts. The decode itself never runs on the drawing thread, whatever sized it. Reserving the space before the bytes arrive is `icon-reserve`, and for a row it is `list-images`.

### `perf-memory` Every cache states a ceiling, because the system decides who dies

A phone app rarely runs out of memory. It gets killed, usually while backgrounded, sometimes to protect a different app entirely. That is a state the app returns from, not an error, and it never shows one: where it returns to is `nav-restore`.

What makes this app the one chosen: an image or response cache with no bound, a list holding every page it has ever loaded, a screen whose objects outlive it through a listener, timer, subscription or observer that nothing removed, and assets preloaded for a screen that has since closed. So every cache the app wrote itself carries a maximum in entries or in bytes and an eviction rule. A library cache satisfies the same requirement where its default bound is left in place or set deliberately, so what review is looking for is the hand-rolled dictionary and the loader someone configured with its bound removed. Every listener, observer and subscription a screen registers is removed with it, and the ones whose cost is power rather than retention are `perf-power`.

One trap specific to Android: the trim-memory warning levels are deprecated and have not been delivered since API 34, leaving only the background and UI-hidden levels live. Code written to free memory when the system warns is code that now runs never, and it reads in review as memory pressure being handled.

### `perf-power` A warm device makes every other number worse

Thermal throttling is the failure that hides all the others: the same code that met the frame budget a minute ago misses it once the device has been working, and no profiling run on a cold phone will show it. A screen's cost is therefore not what it does once, it is what it keeps doing.

- Which accuracy and which sampling rate a location or sensor subscription may take is `perm-scope` and `sense-motion`, and stopping one with the screen that started it is `sense-running`. What lands here is the price of holding hardware open at all: continuous scanning over a short range radio, a connection kept alive, a subscription still sampling behind a screen nobody is looking at.
- A repeating timer or a polling loop is a design decision with an interval to defend, not an implementation detail, and it is cancelled when its screen stops being visible.
- Anything that keeps the device awake or a service alive ends on a deterministic path including the failure path: a wake lock or a foreground service on Android, a background task assertion whose end handler runs on every branch and `isIdleTimerDisabled` on iOS. Android's store reports excessive partial wake locks by name.
- Both platforms publish a thermal level and both are read: the Android thermal status, whose severe level is where the experience is largely affected, and `ProcessInfo.thermalState` with its change notification on iOS. Anything doing sustained work reads that level and does less, instead of waiting to be throttled into jank.
- Doze and the standby buckets are respected rather than worked around, because work scheduled to defeat them is deferred anyway, at the cost of the battery figure the user sees with the app's name next to it. What the app changes under battery saver and Low Power Mode is `state-offline`.

### `perf-size` Download size is a number the user sees before any of the design

The install is a conversion step taken on a cellular connection, on a device that is often nearly full. Google Play shows a warning on a mobile data connection above 200MB and reports uninstalls on devices with under 2GB free; iOS flags any device variant above its 200MB over-the-air download limit. Staying far below either is the normal case rather than an achievement.

The store builds already do most of the work: an app bundle and app thinning each send one density and one architecture to the device. What still fails is the build that goes around them, a universal or fat binary made for sideloading or for CI carrying every density and every ABI at once, which is what `flutter build apk` produces until it is split per ABI. The assets are authored at every density the platform asks for (`icon-vector`) and exactly one of them lands on the phone. Fonts ship the weights the type scale actually names and no others, which is usually two or three. Anything large that the first session does not open is downloaded after install rather than carried inside the build.

### `perf-measure` The slowest supported device, a release build, and production-scale data

All three conditions, or the reading is not evidence. The slowest device the app supports, not the emulator and not the phone on the desk. A release or profile build, because every stack here runs its debug build slower than the one that ships, which makes a debug measurement useless in both directions. And production-scale data, because a list is smooth at twenty rows in any implementation.

Then the reading is compared against something. `STACK.md` names that device and the budget each measurement has to beat: cold start, frames on the longest list, memory after a few screens. The measurements themselves live wherever the tooling writes them, each with the date it was taken, because a number with no date stops being evidence and keeps looking like it. A feeling is not a reading either, and an optimisation with a number on only one side of it is a guess that cost code. Each stack already ships the instrument:

- **iOS:** the App Launch, Time Profiler and Hangs instruments, the Launch Time, Hitches and Hangs panes for what shipped, and MetricKit for the field.
- **Android:** Macrobenchmark for startup and scrolling, JankStats for jank in the field, and the vitals the store reports back for the devices nobody tested on.
- **Flutter:** `flutter run --profile`, with the UI thread and the raster thread read as two separate numbers.
- **React Native:** the performance monitor, with the JS frame rate and the UI frame rate read as two separate numbers.
- **Mobile web inside the app:** 2.5s to the largest contentful paint, 200ms interaction to next paint, and 0.1 of cumulative layout shift, each measured at the 75th percentile rather than as an average.

### Check

Review answers each of these against the code, pointing at the line:

- Nothing initializes on the launch path that the first screen does not draw, and any launch whose first frame is a placeholder reports its own time to full display. `perf-cold-start`
- Zero parses, queries, file reads, decodes or whole-collection sorts run on the drawing thread, and each one names where it moved to. `perf-main-thread`
- No timer, duration or step count assumes 60Hz, and every hand-written animation is driven by the stack's frame callback. `perf-frame`
- No two translucent or blurred layers stack over the same content, elevation comes from a token count rather than a per-card decision, and no gradient or shader runs behind a whole screen. `perf-overdraw`
- Every decode targets the box the image is drawn into, declared at the load site wherever the loader cannot derive it, and no decode runs on the drawing thread. `perf-decode`
- Every cache the app wrote states a maximum and an eviction rule and no library cache has had its bound removed, every listener, observer and subscription a screen registers is removed with it, and nothing depends on a trim-memory level the platform no longer sends. `perf-memory`
- Every repeating timer, scanning subscription, wake lock and background assertion names the interval it defends and has exactly one path that ends it, including the failure path, and sustained work reads the thermal level. `perf-power`
- The shipped build sends one density and one architecture per device rather than a universal binary, only the font weights the type scale names, and nothing large that the first session does not open. `perf-size`
- `STACK.md` names the slowest supported device and a budget for cold start, for frames on the longest list, and for memory after a few screens. `perf-measure`

`perf-measure` is the one answered by whether the budgets exist at all, and a missing budget is the violation rather than a slow number. `perf-frame` and `perf-power` are answered in the source first, where a hardcoded 16ms and a subscription with no stop are both visible, and then again on hardware that has been working long enough to get warm, because thermal behaviour and sustained frame pacing exist nowhere else.

### Reaches

- `heuristics/colors.md`: `color-gradient`
- `heuristics/icons-and-imagery.md`: `icon-reserve`, `icon-vector`
- `heuristics/lists.md`: `list-virtualise`, `list-images`
- `heuristics/motion.md`: `motion-cheap`
- `heuristics/navigation.md`: `nav-restore`
- `heuristics/permissions.md`: `perm-scope`
- `heuristics/sense.md`: `sense-motion`, `sense-running`
- `heuristics/splashscreen.md`: `splash-system`, `splash-hold`
- `heuristics/states.md`: `state-loading`, `state-offline`

# references/accepted-exceptions.md

## Accepted exceptions

What a good exception looks like, so that a rule written as a default is not read as a law, and a default is not dissolved by the first inconvenience either. Read it when a screen seems to need to break a rule, before writing the exception into `STACK.md`.

### The form

Most rules in `heuristics/` state a default. A default is what is right when nothing special is going on, which is most screens. Where a rule has exceptions worth knowing in advance it carries three lines:

```text
Default.          what to do when nothing argues otherwise
Exception.        the situations where the default is the wrong answer
Reason required.  what has to be written down to claim the exception
```

A rule without those lines still admits an exception. It simply has none common enough to list, and the claim goes through the same test.

A few rules are requirements and not defaults: the nine always in scope in `SKILL.md`, and anything marked P0. A control with no accessible name, text that cannot scale, content under the system bars, a form that loses what was typed. No product reason outweighs those, because what they protect is whether a person can use the screen at all.

### The test for an exception

An exception is good when all four are true:

1. **It comes from the job or the person, not from the build.** "The person is choosing between two equal outcomes" is a reason. "The component we already have does it this way" is not, and neither is the deadline.
2. **It names the cost and who pays it.** Every default protects someone. The exception says who loses that protection and why that is acceptable here, or what replaces it.
3. **It is narrow.** It covers this screen or this component, not "the app". An exception that would apply to every screen is a disagreement with the rule, and that conversation belongs in the repository of the skill, not in one project's `STACK.md`.
4. **Somebody could disagree with it.** A reason nobody could argue against ("it looks better", "it felt right") has said nothing.

### Where it is recorded

`STACK.md` grants exceptions, and nothing else does. A screen brief records intent and never grants one, and an `n/a` in a brief is a claim review checks. In review, a rule with a recorded exception is `n/a` with that exception as the reason. It is never a low score defended in prose, and never a high score awarded for the quality of the excuse.

### Worked examples

These show the shape. None of them is a licence: the same words on a different screen can fail the test.

**Two primaries, accepted.** An incoming call screen. Answer and Decline are the whole job, the product prefers neither, and ranking them would be the product deciding for the person. Both get equal weight, side by side. Rule: `button-one-primary`.

**Two primaries, refused.** A checkout with "Pay now" and "Continue shopping" both filled. The product plainly prefers one, so the other is a secondary. The claim fails point 1: the equality is a styling accident and nothing about the job.

**A second column, accepted.** A cover wall in a reading app. The person is scanning pictures, the title under each is a confirmation and never the thing being read, and two columns show twice the choice per screenful. Checked at the narrowest width and the largest text step. Rule: `layout-column`.

**A second column, refused.** Two text fields side by side to make a form look shorter. The length is the same and each field is now half as wide. Fails point 2: the cost lands on the person with large text, and nothing replaces what they lost. Rule: `form-column`.

**A custom screen transition, accepted.** A photo that expands from its thumbnail into the viewer. The motion answers where the viewer came from, which the platform push does not, and it reverses on back. Reduced motion gets a cross-fade. Rules: `motion-platform`, `motion-answered`, `motion-reduced`.

**A custom screen transition, refused.** Every push replaced by a slide from below, for brand feel. It answers none of the three questions in `motion-job`, and it breaks the back gesture's own animation. Fails point 3 as well: it is the whole app.

**A fourth level of navigation, accepted.** A file manager, where depth is the content and the person made it. The path stays visible and every level is one tap from the root. Rule: `nav-depth`.

**Colour on more than the accent, accepted.** A calendar whose events carry the colours the person assigned. The colour is their data, it sits on content, and the accent still means "touch here" alone. Rules: `color-one-accent`, `color-variety`.

**An unusual arrangement, accepted with no exception needed.** A screen built around one large figure with its action attached, where the category ships a list. No rule is broken, so nothing is recorded in `STACK.md`: an arrangement is a choice and not an exception, and the record `flow/explore.md` leaves is all it owes. Rule: `comp-chosen`.

# references/capability-checks.md

## Capability presence, status and accuracy, per stack

Lookup only. The rules live in `heuristics/sense.md`, and the grant flow lives in `heuristics/permissions.md`. Open this file for one name, not as background reading.

Nothing here decides anything. Every entry answers one of three questions: does this device have the hardware, is the capability usable right now, and how good is the value it just returned.

### Does the device have it

| Capability | iOS | Android | Flutter | Expo and React Native | Mobile web |
|---|---|---|---|---|---|
| Any camera | `AVCaptureDevice.DiscoverySession` returns no devices | `PackageManager.hasSystemFeature(FEATURE_CAMERA_ANY)` | `availableCameras()` returns empty | `CameraView` unavailable on the platform | `enumerateDevices()` lists no `videoinput` |
| Front camera | discovery session with `.front` | `FEATURE_CAMERA_FRONT` | `availableCameras()` lens direction | same | same, by `deviceId` |
| Microphone | `AVCaptureDevice` for `.audio` | `FEATURE_MICROPHONE` | `camera` package audio flag | `useMicrophonePermissions()` | no `audioinput` in `enumerateDevices()` |
| Location hardware | always present | `FEATURE_LOCATION`, `FEATURE_LOCATION_GPS`, `FEATURE_LOCATION_NETWORK` | `Geolocator.isLocationServiceEnabled()` | `Location.hasServicesEnabledAsync()` | `navigator.geolocation` undefined |
| Accelerometer, gyroscope, compass | `CMMotionManager.isGyroAvailable` and siblings | `SensorManager.getDefaultSensor()` returns null; `FEATURE_SENSOR_ACCELEROMETER`, `FEATURE_SENSOR_GYROSCOPE`, `FEATURE_SENSOR_COMPASS` | `sensors_plus` stream errors | `expo-sensors` `isAvailableAsync()` | `DeviceMotionEvent` undefined |
| Biometric reader | `LAContext.canEvaluatePolicy` plus `biometryType` | `BiometricManager.canAuthenticate()` returning `BIOMETRIC_ERROR_NO_HARDWARE`; `FEATURE_FINGERPRINT`, `FEATURE_FACE`, `FEATURE_IRIS` | `isDeviceSupported()`, `canCheckBiometrics` | `hasHardwareAsync()` | not available |
| Vibration motor | always present | `Vibrator.hasVibrator()` | `HapticFeedback` is a no-op where absent | `expo-haptics` is a no-op where absent | `navigator.vibrate` undefined |
| Named haptic feedback | `UIImpactFeedbackGenerator`, `UINotificationFeedbackGenerator`, `UISelectionFeedbackGenerator` | `View.performHapticFeedback()` constants, then `VibrationEffect.createPredefined()` | `HapticFeedback` on `Feedback` | `expo-haptics` impact, notification and selection | `navigator.vibrate` only |
| Rich haptic patterns | `CHHapticEngine` capabilities | `Vibrator.areEffectsSupported()`, `arePrimitivesSupported()` | not exposed | not exposed | not available |

Android's answer for a vibration effect has three values, `VIBRATION_EFFECT_SUPPORT_YES`, `_NO` and `_UNKNOWN`. Unknown means the hardware does not report its effects, so nothing will tell you whether a call produces anything.

Presence and distribution are separate. `<uses-feature android:name="android.hardware.sensor.gyroscope" android:required="false" />` keeps the app installable on devices without the sensor; `required="true"` removes it from the store for them.

### Is it usable right now

| Question | iOS | Android | Flutter | Expo | Web |
|---|---|---|---|---|---|
| Permission status | `AVCaptureDevice.authorizationStatus(for:)`, `CLLocationManager.authorizationStatus` | `ContextCompat.checkSelfPermission()` | `Geolocator.checkPermission()` | `getCameraPermissionsAsync()` | Permissions API `query()` |
| Location services on | `CLLocationManager.locationServicesEnabled()` | `LocationManager.isProviderEnabled()` | `Geolocator.isLocationServiceEnabled()`, `getServiceStatusStream()` | `hasServicesEnabledAsync()` | rejection code `POSITION_UNAVAILABLE` |
| Device-wide sensor toggle | not present | `SensorPrivacyManager.supportsSensorToggle(Sensors.CAMERA / Sensors.MICROPHONE)` | not exposed | not exposed | not present |
| Hardware held or broken | `AVCaptureSession` runtime error notification | camera provider fails to bind | `CameraException` | promise rejects | `NotReadableError` |
| Nothing enrolled | `LAError.biometryNotEnrolled`, `.passcodeNotSet` | `BIOMETRIC_ERROR_NONE_ENROLLED`, then `Settings.ACTION_BIOMETRIC_ENROLL` | `authenticate()` throws | `isEnrolledAsync()` | not available |
| Locked out | `LAError.biometryLockout` | `BIOMETRIC_ERROR_LOCKOUT` | throws | throws | not available |
| No such device | discovery session empty | provider throws | `CameraException` | throws | `NotFoundError` |
| Route to system settings | `UIApplication.openSettingsURLString` | `Settings.ACTION_APPLICATION_DETAILS_SETTINGS`, `ACTION_LOCATION_SOURCE_SETTINGS` | `openAppSettings()`, `openLocationSettings()` | `Linking.openSettings()` | none, the browser owns it |

The iOS biometric error set worth branching on: `biometryNotAvailable`, `biometryNotEnrolled`, `biometryLockout`, `passcodeNotSet`, `userCancel`, `systemCancel`, `appCancel`, `userFallback`. The last one fires when the user asks for a fallback the policy does not have.

### How good is the value

| What | iOS | Android | Flutter and Expo | Web |
|---|---|---|---|---|
| Horizontal accuracy | `CLLocation.horizontalAccuracy`, a radius in metres, negative meaning the coordinate is invalid | `Location.getAccuracy()`, a radius in metres at the 68th percentile, valid only where `hasAccuracy()` is true and zero otherwise | `Position.accuracy` in metres, from the platform value | `coords.accuracy` in metres at 95% confidence |
| Vertical accuracy | `verticalAccuracy` | `getVerticalAccuracyMeters()` | `altitudeAccuracy` | `altitudeAccuracy` |
| Granted accuracy level | `CLAccuracyAuthorization.fullAccuracy` or `.reducedAccuracy` | `ACCESS_FINE_LOCATION` against `ACCESS_COARSE_LOCATION` | `LocationAccuracy` | not exposed |
| Requested accuracy | `desiredAccuracy` | `Priority` on the location request | `LocationAccuracy`, `Accuracy.Balanced` and siblings | `enableHighAccuracy` |
| Upgrade to precise | `requestTemporaryFullAccuracyAuthorization(withPurposeKey:)` with `NSLocationTemporaryUsageDescriptionDictionary` | request the fine and coarse pair again | via the plugin's permission call | not available |
| Compass calibration | `CLLocationManager` heading calibration display | `SensorManager.SENSOR_STATUS_ACCURACY_LOW` and siblings through `onAccuracyChanged` | `flutter_compass` accuracy field | not available |

The three accuracy radii are not the same measurement. A threshold in metres tuned on one platform does not transfer to another.

Published figures: an approximate Android grant is accurate to roughly 3 square kilometres, a precise one usually to within about 50 metres and sometimes a few. Apple states no metric figure for reduced accuracy, so there is nothing to compare it against.

### Sampling ceilings

From Android 12, `SensorManager.registerListener()` is capped at 200 Hz and `SensorDirectChannel` at `RATE_NORMAL`, about 50 Hz. Going past either without `HIGH_SAMPLING_RATE_SENSORS` throws a `SecurityException`. The device-wide microphone and camera toggle rate-limits motion sensors regardless of that permission.

On mobile web, `DeviceMotionEvent.requestPermission()` needs a secure context and transient activation, so it has to run inside a tap handler, and it rejects with `NotAllowedError` otherwise. `navigator.vibrate()` needs sticky user activation. Neither is available in every browser.

# references/color-construction.md

## Color construction

How a palette is built once the reference is chosen. `color-derived` decides where the colors come from and `color-assigned` decides what they are spent on; this is the arithmetic in between, and it is arithmetic rather than taste. Open it when a palette is being written for the first time, or when one on screen reads washed out, two-toned or muddy and nobody can say why.

Work in OKLCH, or in LCH where OKLCH is unavailable. The reason is not novelty: in HSL a change to L drags apparent colorfulness with it, and S reports a warm off-white as heavily saturated, so neither number can be used as a test. In OKLCH, L is perceived lightness and C is perceived colorfulness, and both can be stated as a target somebody else can check.

### The numbers a palette answers to

| Role | Lightness (OKLCH L) | Chroma (OKLCH C) | What the number is for |
|---|---|---|---|
| ground | the end the reference dictates, light around 0.95 to 0.98, dark around 0.15 to 0.22 | 0.004 to 0.02 | A tinted neutral. Above about 0.03 it stops being a ground and starts being a pale version of the accent, which is the pastel screen. |
| surface | one step toward the ink from ground, about 0.03 to 0.05 of L | same as ground | Depth by lightness step, which is also what survives dark (`color-dark-composed`). |
| ink | far from ground, at least 0.6 of L between them | 0.01 to 0.04 | Near black or near white, carrying the ground's hue rather than a pure neutral. |
| accent | wherever contrast puts it against its own ground | **0.10 or more** | Below about 0.06 an accent reads as a grey that happens to be slightly coloured, and the screen reads as uncoloured. This is the single number most often missing. |
| status | set by contrast | 0.10 or more | Same floor. A muted danger colour is not restraint, it is a warning nobody sees. |

Numbers are a starting band, not a spec. What matters is that the palette states its own and can be checked against them.

### Relating the hues

The accent hue comes from the reference. Every other hue on the screen stands in a stated relationship to it, and the relationship is named in `DESIGN.md` rather than arrived at:

- **Analogous**, within about 30 degrees. Quiet, and it risks a screen where the accent and the status colors blur into one another.
- **Complementary**, about 180 degrees away. One supporting hue, maximum separation, and it is the relationship that most often produces a second colour worth having.
- **Split complementary**, about 150 and 210 degrees. Two supporting hues that stay apart from each other as well as from the accent.
- **Triadic**, about 120 degrees apart. Three hues that hold their own, which suits a product that genuinely has three coordinate things to name and nothing else.

Two rules of separation hold whatever the scheme:

- Any two hues a reader has to tell apart sit at least 30 degrees apart, and 60 is comfortable. Under 30 they read as the same colour rendered twice.
- Status colours keep their conventional hue bands and are not borrowed for the accent. Where the accent lands within 30 degrees of a status hue, the accent moves, because the status meaning is the one that cannot be relearned.

### Per item color

Where a set of items each carry their own hue (`color-variety` names when that is legitimate), space them around the wheel rather than picking them one at a time: for n items, step 360/n degrees from the accent, then pull each to a common lightness and chroma so no single item shouts. Hand-picked per-item colours drift in lightness, and the brightest one reads as the important one whether or not it is.

### Checking it

- Convert every pair that carries meaning and run the contrast floors in `color-contrast`.
- Render the screen in greyscale: what stops being distinguishable is what colour was carrying, which is `color-assigned`.
- Render it under protanopia, deuteranopia and tritanopia: pairs that collapse are `color-not-alone`.
- Look at the neutral ramp alone. If the greys lean toward the accent by more than the ground's own chroma, they were generated from the accent instead of chosen.

# references/design-grammars.md

## Design grammars

The spatial relations a composition is made of. `flow/explore.md` sends a candidate here while it is being written, to choose how the parts relate before choosing which components they are.

A component list answers "what is on the screen". A grammar answers "what is next to what, what is over what, and what stays while the rest moves". Two screens with the same components and different grammars are different screens, and two screens with different components and the same grammar are usually the same one.

The shape list in `references/wireframe-frame.md` names whole compositions. These are the relations underneath them, and a composition normally combines two or three. Neither list is closed: a relation the screen needs and this file lacks still gets used, and named.

### Flow

```text
A
B
C
```

Parts follow one another and the order is the message: steps, a story, a feed. It is what a screen becomes when no other relation was chosen, so it owes a reason when it is the whole composition. Right when the order truly carries meaning. Wrong when the parts are peers, or when one of them matters more than the rest, because a sequence gives every part the same weight.

### Focus

```text
      A
  b   b   b
      c
```

One part dominates and the rest are visibly subordinate to it, by size and by the space left around it. Right when the job has a single answer: a balance, a next departure, a remaining time. The dominant part is sized to what it needs to be read from the distance the context implies, not to a habitual fraction of the height.

### Anchor

```text
content
content
content
           [action]
```

One part is fixed to the viewport while the rest moves under it. Right when the action applies to the whole screen and has to be reachable at any scroll position. What it costs is in `layout-chrome`: the anchored part covers content, and the end of the scroll has to clear it.

### Object and action

```text
[ object ]
[ what can be done to it ]
```

The action sits with the thing it changes, not at the edge of the screen. Right when a screen holds several objects with their own actions, or when the action only makes sense while looking at its object. It trades reach for clarity, so check it against `touch-reach` when the object sits high.

### Contextual action

```text
item
item   [ action, only while it applies ]
item
```

The action is not on the screen at rest. It appears at the place and the moment it makes sense: beside a selection once something is selected, on a row once that row is in the state the action needs, over a ground once the ground shows something to act on. Right when an action applies to a fraction of the screen's life, since a control that is permanently present and mostly disabled is chrome. It owes two things. The person has to be able to predict it, so it appears in the same place every time, and it needs a route that does not depend on reaching the triggering state by gesture, which is `a11y-gesture`.

### Split

```text
+-----------+
|     A     |
+-----+-----+
|  b  |  c  |
+-----+-----+
```

The frame is divided into regions with different jobs, each visibly its own. Right when two kinds of content are both needed at once and neither is a detail of the other. The division is unequal on purpose: equal halves say the two are peers, which they rarely are.

### Layer

```text
+-------------+
| ground      |
|    object   |
|      +------+
|      | over |
+------+------+
```

Parts sit over one another instead of beside one another. A full-bleed ground (a map, a viewfinder, an artwork) with controls above it. Right when the ground is the content and chrome would shrink it. Everything over the ground answers to `layout-overlays`, and text over a ground nobody chose answers to `color-contrast`.

### Proximity

```text
TITLE

item
item

TITLE

item
```

Groups are made by distance alone: near things belong together, and the gap between groups is visibly larger than the gap inside one. No border, no card. Right far more often than it is used, and the rule behind it is `layout-grouping`. It fails when the two gaps are close enough to be confused.

### Disclosure

```text
what matters
   > detail
      > rarely needed
```

Depth replaces length. The first level is complete by itself and the rest is reachable, in place or one level down. Right when most visits need only the top. Wrong when the hidden part is needed on every visit, since a tap has been added to the ordinary path.

### Persistent and transient

```text
+-------------+
| stays       |
+-------------+
| changes     |
| changes     |
+-------------+
```

One region holds still while another is replaced, paged or scrolled: a player over a queue, a preview over its settings, a total over its line items. Right when the person acts in one region to see the effect in the other. The persistent region is the smaller one unless it is the content.

### Combining them

Name the relations a candidate uses, in the order they dominate. "Focus, then object and action, over proximity" is a composition. "Flow" alone is the default, and is sometimes the answer.

A relation earns its place by what the context asks for. A glance asks for focus. One hand asks for anchor, or for an object low enough to carry its own action. A long seated session can afford split and disclosure. A ground worth looking at asks for layer.

# references/fonts.json

```json
{
  "note": "Typefaces reachable per platform and per stack, and what it costs to reach them. Lookup only: the rules are in heuristics/typography.md and the per-role sizes are in type-scales.md.",
  "updated": "2026-09-06",
  "sources": [
    "https://developer.apple.com/fonts/",
    "https://fonts.google.com",
    "https://github.com/material-components/material-components-android"
  ],
  "rules_of_thumb": [
    "A face that ships with the OS costs no download, no cold start and no licence review. Start there and leave it only for a reason you can state.",
    "A face that arrives without a reason is the tell. Inter unchosen is not a choice.",
    "Two families is the ceiling, and the second one needs a job the first cannot do.",
    "Whichever face wins, it reaches the screen through the platform text style, so the user's size setting still applies.",
    "Before committing to a face for a localised app, check that it covers the scripts the product ships in. Coverage is per family, not per foundry."
  ],
  "platforms": {
    "ios": {
      "ui_default": "SF Pro",
      "licence": "SF Pro, SF Compact, SF Mono and New York are licensed by Apple for use on Apple platforms. They do not travel to an Android build or a website.",
      "system_faces": [
        {
          "family": "SF Pro",
          "kind": "sans",
          "note": "the UI face. Optical sizes switch on their own: Text below 20pt, Display at 20pt and above"
        },
        {
          "family": "SF Pro Rounded",
          "kind": "sans",
          "note": "softer register, same metrics"
        },
        {
          "family": "SF Compact",
          "kind": "sans",
          "note": "narrower, drawn for cramped UI"
        },
        {
          "family": "SF Mono",
          "kind": "mono",
          "note": "code and fixed-width data"
        },
        {
          "family": "New York",
          "kind": "serif",
          "note": "the system serif, cut to pair with SF at the same optical sizes"
        }
      ],
      "preinstalled": {
        "note": "Reachable by family name with no bundling. These are not the UI face and Apple does not guarantee them across OS versions, so confirm before depending on one.",
        "sans": [
          "Arial",
          "Avenir",
          "Avenir Next",
          "Futura",
          "Gill Sans",
          "Helvetica",
          "Helvetica Neue",
          "Optima",
          "Trebuchet MS",
          "Verdana"
        ],
        "serif": [
          "American Typewriter",
          "Baskerville",
          "Bodoni 72",
          "Charter",
          "Cochin",
          "Didot",
          "Georgia",
          "Hoefler Text",
          "Palatino",
          "Times New Roman"
        ],
        "mono": [
          "Courier New",
          "Menlo"
        ],
        "display_script": [
          "Chalkboard SE",
          "Copperplate",
          "Marker Felt",
          "Papyrus",
          "Snell Roundhand",
          "Zapfino"
        ]
      }
    },
    "android": {
      "ui_default": "Roboto on AOSP",
      "licence": "Roboto and Noto are Apache-2.0 and can be bundled anywhere, including into an iOS build or a website.",
      "warning": "The UI face is whatever the OEM shipped. Samsung One UI, OnePlus and MIUI each substitute their own, and the user can change it in settings. Roboto is the AOSP default, not a promise, so never let a layout depend on Roboto metrics.",
      "system_aliases": {
        "note": "How the bundled faces are actually reached, in XML or in Compose FontFamily.",
        "sans-serif": "Roboto",
        "sans-serif-condensed": "Roboto Condensed",
        "sans-serif-medium": "Roboto at 500",
        "sans-serif-light": "Roboto at 300, below the weight floor for body text",
        "sans-serif-thin": "Roboto at 100, display only, and rarely even then",
        "serif": "Noto Serif",
        "monospace": "Droid Sans Mono",
        "serif-monospace": "Cutive Mono",
        "casual": "Coming Soon",
        "cursive": "Dancing Script"
      },
      "other_bundled": [
        {
          "family": "Roboto Flex",
          "note": "variable, full axis set. Bundled only on recent releases: check the API level before relying on it instead of shipping it"
        },
        {
          "family": "Noto",
          "note": "the script coverage behind the system. This is what renders text the UI face has no glyphs for"
        },
        {
          "family": "Noto Color Emoji",
          "note": "emoji come from here, and they are not a substitute for an icon set"
        }
      ],
      "downloadable_fonts": {
        "note": "The whole Google Fonts catalogue without bundling a file, served and cached by Google Play Services. This is the Android answer to a brand face on a size budget.",
        "provider": "com.google.android.gms.fonts",
        "xml": "<font-family app:fontProviderAuthority=\"com.google.android.gms.fonts\" app:fontProviderQuery=\"Manrope\" .../>",
        "compose": "androidx.compose.ui.text.googlefonts.GoogleFont with GoogleFont.Provider",
        "caution": "The first request can miss, and the device may have no Play Services at all. Always declare a bundled or system fallback, and never let the first screen wait on it."
      }
    }
  },
  "stacks": {
    "flutter": {
      "default": "Material widgets fall back to Roboto, which the framework carries; Cupertino widgets take the system face on Apple platforms.",
      "custom": "Declare the family in pubspec.yaml, or use the google_fonts package.",
      "caution": "google_fonts downloads at runtime by default, which means a fallback frame and a network dependency. For a face used on the first screen, bundle the file instead."
    },
    "react_native_expo": {
      "default": "fontFamily: 'System' resolves to SF on iOS and to the OEM UI face on Android.",
      "custom": "expo-font, or the @expo-google-fonts/<family> packages, which bundle the file.",
      "caution": "Fonts load asynchronously. Hold the splash screen until they are ready, or the first paint ships in the fallback face and reflows in front of the user."
    },
    "swiftui_uikit": {
      "default": ".font(.body) and the rest of the text styles.",
      "custom": "Font.custom(_:size:relativeTo:) in SwiftUI, UIFontMetrics in UIKit. A custom face without one of those does not scale and does not ship."
    },
    "jetpack_compose": {
      "default": "MaterialTheme.typography, which resolves to the platform face.",
      "custom": "FontFamily from a bundled resource or from the Google Fonts provider, wired into a Typography object rather than applied per Text."
    },
    "mobile_web": {
      "default": "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "custom": "Self-host the subset files and declare font-display: swap. Preload only the faces the first screen needs.",
      "caution": "Loading from the Google Fonts CDN sends the visitor's IP to a third party, which has been ruled a problem under GDPR in at least one jurisdiction. Self-hosting removes the question and is usually faster anyway."
    }
  },
  "google_fonts": {
    "note": "Open licence (OFL or Apache-2.0), free to bundle and subset. The catalogue is the practical answer for every stack except a pure Apple build, where the system face is already better integrated.",
    "how_to_choose": [
      "Pick the workhorse first: it carries body, labels and controls, and it needs every weight and the right scripts.",
      "A display face is a second decision, and it only earns its place if the product has display-sized moments.",
      "Prefer a variable family where the stack supports it: the weight axis interpolates, so a hierarchy step never lands on a cut that was never drawn.",
      "Numeric columns need tabular figures. Most families here support the tnum feature, but confirm it before designing a table around it."
    ],
    "interface": [
      {
        "family": "Inter",
        "variable": true,
        "scripts": "latin, cyrillic, greek",
        "good_for": "neutral UI at small sizes",
        "caution": "the default a model reaches for. Fine when chosen on purpose, a tell when it just appears"
      },
      {
        "family": "Roboto",
        "variable": true,
        "scripts": "latin, cyrillic, greek",
        "good_for": "matching the Android platform look deliberately"
      },
      {
        "family": "Roboto Flex",
        "variable": true,
        "axes": "weight, width, optical size, grade and more",
        "scripts": "latin, cyrillic, greek",
        "good_for": "one file covering the whole ramp, including the M3 expressive axes"
      },
      {
        "family": "Noto Sans",
        "variable": true,
        "scripts": "the widest coverage in the catalogue",
        "good_for": "a product shipping in scripts other families drop"
      },
      {
        "family": "Open Sans",
        "variable": true,
        "scripts": "latin, cyrillic, greek",
        "good_for": "plain, legible, very broad language support"
      },
      {
        "family": "Source Sans 3",
        "variable": true,
        "scripts": "latin, cyrillic, greek",
        "good_for": "a neutral workhorse with a matching serif and mono"
      },
      {
        "family": "IBM Plex Sans",
        "variable": true,
        "scripts": "latin, cyrillic, greek",
        "good_for": "an engineered voice, with Serif, Mono and Condensed siblings"
      },
      {
        "family": "Public Sans",
        "variable": true,
        "scripts": "latin",
        "good_for": "civic and utility products that want no accent at all"
      },
      {
        "family": "DM Sans",
        "variable": true,
        "scripts": "latin",
        "good_for": "geometric product UI with slightly rounded forms"
      },
      {
        "family": "Plus Jakarta Sans",
        "variable": true,
        "scripts": "latin",
        "good_for": "product UI with a little more character than Inter"
      },
      {
        "family": "Manrope",
        "variable": true,
        "scripts": "latin, cyrillic, greek",
        "good_for": "semi-geometric UI, reads well at label sizes"
      },
      {
        "family": "Figtree",
        "variable": true,
        "scripts": "latin",
        "good_for": "friendly consumer apps"
      },
      {
        "family": "Work Sans",
        "variable": true,
        "scripts": "latin",
        "good_for": "a grotesque with warmth, good from label to headline"
      },
      {
        "family": "Archivo",
        "variable": true,
        "axes": "weight and width",
        "scripts": "latin, cyrillic, greek",
        "good_for": "dense UI where a width axis solves a long-label problem"
      },
      {
        "family": "Instrument Sans",
        "variable": true,
        "scripts": "latin",
        "good_for": "neutral with an edge, holds up in both UI and headline roles"
      },
      {
        "family": "Space Grotesk",
        "variable": true,
        "scripts": "latin",
        "good_for": "a technical voice",
        "caution": "distinctive enough that it tires at body length"
      }
    ],
    "reading_and_display": [
      {
        "family": "Literata",
        "variable": true,
        "kind": "serif",
        "good_for": "long reading on a screen, which is what it was drawn for"
      },
      {
        "family": "Source Serif 4",
        "variable": true,
        "kind": "serif",
        "good_for": "body serif that pairs with Source Sans"
      },
      {
        "family": "Newsreader",
        "variable": true,
        "kind": "serif",
        "good_for": "editorial body and headline in one family"
      },
      {
        "family": "Lora",
        "variable": true,
        "kind": "serif",
        "good_for": "warm body serif for reading-heavy screens"
      },
      {
        "family": "Fraunces",
        "variable": true,
        "kind": "serif display",
        "axes": "weight, optical size, softness, wonk",
        "good_for": "display with a real point of view",
        "caution": "display sizes only"
      },
      {
        "family": "Playfair Display",
        "variable": true,
        "kind": "serif display",
        "good_for": "high contrast headlines",
        "caution": "the thin strokes disappear at small sizes and in sunlight"
      },
      {
        "family": "Instrument Serif",
        "variable": false,
        "kind": "serif display",
        "good_for": "a single large moment per screen"
      },
      {
        "family": "Bricolage Grotesque",
        "variable": true,
        "kind": "display",
        "good_for": "an opinionated headline face that still has a usable weight range"
      }
    ],
    "mono": [
      {
        "family": "JetBrains Mono",
        "variable": true,
        "good_for": "code, with a tall x-height that survives small sizes"
      },
      {
        "family": "IBM Plex Mono",
        "variable": false,
        "good_for": "code and data next to Plex Sans"
      },
      {
        "family": "Roboto Mono",
        "variable": true,
        "good_for": "code and tabular data in an Android-native product"
      },
      {
        "family": "Space Mono",
        "variable": false,
        "good_for": "short technical labels",
        "caution": "not a reading face"
      }
    ]
  }
}
```

# references/icon-and-image-assets.md

## Icon and image assets, per stack

Lookup only. The rules live in `heuristics/icons-and-imagery.md`. Open this file for one size, one axis or one API name, not as background reading.

### Symbol sets

| Set | Axes and variants | What it gives for free |
|---|---|---|
| SF Symbols (iOS) | 9 weights, ultralight to black, each mapped to a San Francisco font weight; 3 scales (small, medium, large) defined against the cap height; outline, fill, slash and enclosed variants | Baseline information on every symbol, Dynamic Type scaling when configured with a text style, and per-script variants that follow the device language |
| Material Symbols (Android, web) | One variable font in Outlined, Rounded and Sharp. `opsz` 20 to 48, default 24. `wght` 100 to 700, default 400. `GRAD` -50 to 200, default 0. `FILL` 0 to 1, default 0 | One file for every weight and fill; `FILL` is animatable for selection |

Axis meanings: `wght` is the stroke weight and moves the overall size a little. `GRAD` changes thickness more finely with almost no size change; -50 is the value for light artwork on a dark ground. `opsz` retunes the stroke so the glyph looks the same at a different size. `FILL` is for state.

Only the 20 px and 24 px Material Symbols are drawn on a perfect pixel grid.

Flutter's bundled `Icons` is the older Material Icons set, while its `Icon` widget already takes `fill`, `weight`, `grade` and `opticalSize`. A project that wants current Material Symbols imports the font or the SVGs itself.

`IconThemeData.fallback()` in Flutter: size 24.0, fill 0.0, weight 400.0, grade 0.0, opticalSize 48.0. Note the mismatch: the default optical size is 48 while the default size is 24. `applyTextScaling` resolves to false unless set on the widget or the `IconTheme`.

Compose `Icon` is 24.dp when the painter has no intrinsic size, and is tinted with `LocalContentColor.current`. The `material-icons` and `material-icons-extended` artifacts are no longer recommended by Google.

### Raster variants, by stack

| Stack | How a variant is named | Notes |
|---|---|---|
| iOS asset catalog | `@2x` and `@3x` filename suffixes | iOS ships at 2x and 3x. `scale` and `nativeScale` can differ |
| Android resources | `res/drawable-<bucket>/` | A vector drawable goes in the default `res/drawable/` with no per-density copy |
| Flutter | `2.0x/name.png` beside `name.png` | Nominal densities 1.5x, 2.0x, 3.0x, 4.0x. List only the main asset or its folder in `pubspec.yaml` |
| React Native | `name@2x.png` sibling files, one `require` | The closest density is picked when the exact one is missing. A `uri` source carries no dimensions |

### Android density buckets

| Bucket | Approx dpi | Scale | A 48 px mdpi bitmap becomes |
|---|---|---|---|
| ldpi | 120 | 0.75x | 36 px |
| mdpi | 160 (baseline) | 1x | 48 px |
| hdpi | 240 | 1.5x | 72 px |
| xhdpi | 320 | 2x | 96 px |
| xxhdpi | 480 | 3x | 144 px |
| xxxhdpi | 640 | 4x | 192 px |

Ratio 3:4:6:8:12:16. `px = dp * (dpi / 160)`, converted with `TypedValue.applyDimension()` rather than hardcoded. `nodpi` is never scaled. `sp` matches `dp` until the user changes the text size, and is never used for layout.

### Vector drawables

Android has no native SVG. Convert with Vector Asset Studio (`res` > New > Vector Asset). Keep one at 200 by 200 dp or under, past which it takes too long to draw. Author a tintable icon in solid black (`android:fillColor="#FF000000"`). `VectorDrawable` and `AnimatedVectorDrawable` land in API 21, with `VectorDrawableCompat` and `AnimatedVectorDrawableCompat` below it.

### Formats

Flat artwork that scales: PDF or SVG. Bitmap work: de-interlaced PNG, or an 8-bit palette where 24-bit colour is not needed. Photographs: JPEG or HEIC. Design at the lowest resolution and scale up, keeping control points on whole values so the shape stays on the raster grid at 2x and 3x.

### Fill and fit

| Stack | Fill the frame and crop | Fit inside the frame |
|---|---|---|
| SwiftUI | `.scaledToFill()` with `.clipped()` | `.scaledToFit()` |
| UIKit | `.scaleAspectFill` | `.scaleAspectFit` |
| Compose | `ContentScale.Crop` | `ContentScale.Fit` |
| Flutter | `BoxFit.cover` | `BoxFit.contain` |
| React Native | `resizeMode="cover"` | `resizeMode="contain"` |
| Mobile web | `object-fit: cover` | `object-fit: contain` |

### Dark variants

iOS: a second appearance inside the asset catalog entry, resolved by the system. Android: `res/drawable-night/` beside `res/drawable/`. Flutter and React Native resolve the file themselves from the platform brightness.

### App icon

| Platform | Canvas | Structure |
|---|---|---|
| iOS | 1024 by 1024 px, square, no transparency, no rounded corners | Layered: one background plus one or more foreground layers, assembled in Icon Composer. Prefer SVG or PDF layers; PNG only for mesh gradients and raster art. Ship layers unmasked |
| Android adaptive | 108 by 108 dp layers | `<adaptive-icon>` in `res/mipmap-anydpi-v26/ic_launcher.xml` with `<background>`, `<foreground>` and `<monochrome>`. Referenced from the manifest as `android:icon`, with `android:roundIcon` alongside it for the launchers that ask for a round variant |
| Play listing | 512 by 512 px, 32-bit PNG with alpha, 1024 KB maximum | Feature graphic 1024 by 500 px, JPEG or 24-bit PNG, no alpha |

Adaptive icon geometry: a 72 dp masked viewport out of the 108 dp canvas, with the outer 18 dp on each side reserved for masking and for parallax or pulse effects. Keep the mark inside the 66 dp safe box and at least 48 dp across. Layers carry no mask and no outline shadow, and vectors are preferred over bitmaps.

Themed icons need the `<monochrome>` layer. User theming arrives in Android 13 (API 33). From Android 16 QPR 2 the system themes icons for apps that supply no monochrome layer.

iOS appearances: default, dark, clear light, clear dark, tinted light, tinted dark. The system generates any variant not supplied, and each alternate app icon needs its own set. Colour spaces: sRGB, Gray Gamma 2.2, Display P3.

Let the system draw the specular highlight, the shadow between layers, the bevel, the blur and the glow. Avoid soft or feathered edges on foreground shapes, extremely thin strokes and sharp corners.

Licensing: system symbols may not be used in an app icon, a logo or any other trademarked use, and platform hardware may not be reproduced.

Expo keys: `icon`; `ios.icon` taking either a path to a `.icon` directory (SDK 54 and later) or an object of `light`, `dark` and `tinted` PNGs; `android.icon`; `android.adaptiveIcon.foregroundImage`, `.backgroundColor`, `.backgroundImage` and `.monochromeImage`.

### Generating the icon set

Every stack has a generator that takes one master image and writes every density, catalog entry and adaptive layer. Five things about them cost an afternoon each, and none of them surfaces as an error.

**The dedicated config file wins over the manifest block.** Where a generator reads configuration from two places, a file of its own at the project root and a block inside the dependency manifest, the file is tried first and the manifest block is only the fallback. `flutter_launcher_icons` loads `flutter_launcher_icons.yaml` and drops to the `pubspec.yaml` block only when that returns nothing, with no message either way. A project forked from another app carries that file with the *other app's* artwork paths, so the generator runs, reports success, and produces the wrong app's icon. Look for the dedicated file before writing any configuration, and when finished leave one of the two, not both.

**The generator applies its own inset, so the safe zone gets applied twice.** It wraps the foreground in an `<inset>` inside the adaptive icon XML, expressed as a percentage: `flutter_launcher_icons` writes `android:inset="16%"` unless `adaptive_icon_foreground_inset` says otherwise, which already accounts for most of the 108/72/66 dp geometry. Artwork pre-shrunk to the 66 dp safe box before handing it over comes out visibly small inside the mask. Either hand over full-bleed artwork and let the inset do the work, or raise the artwork's radius so that radius times the remaining fraction lands inside the safe box. The inset is configurable; editing the generated XML by hand is not, because the next run overwrites it.

**Measure the output, do not infer it.** Open the generated foreground, measure the bounding box of the non-transparent pixels, and compare its radius against the safe box. This is the only check that catches the double inset, and it takes one command.

**Rasterisers drop what the design tool shows.** Blend modes, filters and effects are commonly ignored when an SVG is converted to PNG, so the raster differs from the artboard. Open the generated file and look at it. When judging a transparent foreground, composite it over the real background colour first: white artwork on the viewer's white backdrop reads as an empty file, and the natural conclusion, that the conversion lost the shape, is wrong.

**Generators overwrite what they still produce and orphan the rest.** Switching an adaptive background from image to colour leaves the old background bitmap in every density bucket; dropping a platform leaves its whole directory. Nothing reports it, the files ship inside the binary, and the stale artwork resurfaces later. After changing artwork or configuration, delete the generated directories and regenerate, rather than generating over the top, then scan the output for the old palette to prove nothing survived.

### Loading APIs

Android decodes at the size drawn: `BitmapFactory.Options.inJustDecodeBounds` reads `outWidth` and `outHeight` without allocating, then `inSampleSize` decodes down. In practice a library does this: Glide, Coil (`AsyncImage`), Picasso or Fresco. Compose loads bundled assets with `painterResource`, which handles PNG, JPEG, WEBP, vector drawables and animated vector drawables. SwiftUI has `AsyncImage` for network images and `Image(decorative:)` for an unlabelled one.

### Stand-in photography

For a screen drawn before its content exists: a prototype, a design review, a screen whose backend is not built. It is sample content and it is fenced the same way, which is `copy-sample-data`: none of it ships.

| Source | URL shape | What it gives |
|---|---|---|
| Lorem Picsum | `https://picsum.photos/seed/<seed>/<w>/<h>` | Unsplash photographs, no key and no attribution, seeded so one item keeps one photograph across renders. The subject cannot be asked for. |
| Unsplash API | `https://api.unsplash.com/photos/random?query=<term>` | The subject can be asked for, so the picture can plausibly be the thing rather than any thing. Needs a registered key, attribution, and a download event per use. |

`https://source.unsplash.com` is the endpoint most examples still reach for, and it is deprecated. It answers, from a pool frozen when it was retired, so a screen built on it is dated by construction.

Seed from the item's stable identifier rather than its position, for the reason `icon-avatar` gives: a list that reorders keeps each picture attached to its own row. Where the screen may not reach the network at all, the subject gets drawn instead, which is `icon-depicts`.

# references/input-fields.md

## Input fields

Lookup only. The rules live in `heuristics/forms.md`. Open this file for one field's keyboard or autofill name, not as background reading.

Two settings per field, and they are separate: the keyboard decides what the user can type, the content type decides what the platform can fill in for them. Setting one does not set the other.

### Keyboard type

| Field | SwiftUI `.keyboardType` | Compose `KeyboardType` | Flutter `TextInputType` | React Native `keyboardType` | Web `inputmode` |
|---|---|---|---|---|---|
| email | `.emailAddress` | `Email` | `.emailAddress` | `email-address` | `email` |
| telephone | `.phonePad` | `Phone` | `.phone` | `phone-pad` | `tel` |
| whole number | `.numberPad` | `Number` | `.number` | `number-pad` | `numeric` |
| money or measure | `.decimalPad` | `Decimal` | `.numberWithOptions(decimal: true)` | `decimal-pad` | `decimal` |
| URL | `.URL` | `Uri` | `.url` | `url` | `url` |
| search | `.webSearch` | `Text` | `.text` | `web-search` | `search` |
| password | `.default` | `Password` | `.visiblePassword` where shown | `default` | `text` |
| multi-line note | `.default` | `Text` | `.multiline` | `default` | `text` |

Card numbers and one time codes are numeric keyboards over a text field, never a number field. A number field brings steppers, drops leading zeros, and on the web turns a mistyped digit into a scroll event.

### Return key

| Meaning | SwiftUI | Compose | Flutter | React Native | Web |
|---|---|---|---|---|---|
| next field | `.submitLabel(.next)` | `ImeAction.Next` | `TextInputAction.next` | `returnKeyType="next"` | `enterkeyhint="next"` |
| last field | `.submitLabel(.done)` | `ImeAction.Done` | `TextInputAction.done` | `"done"` | `"done"` |
| submit now | `.submitLabel(.go)` | `ImeAction.Go` | `TextInputAction.go` | `"go"` | `"go"` |
| search | `.submitLabel(.search)` | `ImeAction.Search` | `TextInputAction.search` | `"search"` | `"search"` |

### Autofill content type

| Value | SwiftUI `.textContentType` | Compose `ContentType` | Flutter `AutofillHints` | React Native `autoComplete` | Web `autocomplete` |
|---|---|---|---|---|---|
| email | `.emailAddress` | `EmailAddress` | `.email` | `email` | `email` |
| username | `.username` | `Username` | `.username` | `username` | `username` |
| existing password | `.password` | `Password` | `.password` | `current-password` | `current-password` |
| new password | `.newPassword` | `NewPassword` | `.newPassword` | `new-password` | `new-password` |
| one time code | `.oneTimeCode` | `SmsOtpCode` | `.oneTimeCode` | `sms-otp` | `one-time-code` |
| full name | `.name` | `PersonFullName` | `.name` | `name` | `name` |
| given name | `.givenName` | `PersonFirstName` | `.givenName` | `given-name` | `given-name` |
| family name | `.familyName` | `PersonLastName` | `.familyName` | `family-name` | `family-name` |
| telephone | `.telephoneNumber` | `PhoneNumber` | `.telephoneNumber` | `tel` | `tel` |
| street | `.streetAddressLine1` | `AddressStreet` | `.streetAddressLine1` | `street-address` | `street-address` |
| city | `.addressCity` | `AddressLocality` | `.addressCity` | `postal-address-locality` | `address-level2` |
| postal code | `.postalCode` | `PostalCode` | `.postalCode` | `postal-code` | `postal-code` |
| country | `.countryName` | `AddressCountry` | `.countryName` | `country` | `country-name` |
| card number | `.creditCardNumber` | `CreditCardNumber` | `.creditCardNumber` | `cc-number` | `cc-number` |
| card expiry | `.creditCardExpiration` | `CreditCardExpirationDate` | `.creditCardExpirationDate` | `cc-exp` | `cc-exp` |
| security code | `.creditCardSecurityCode` | `CreditCardSecurityCode` | `.creditCardSecurityCode` | `cc-csc` | `cc-csc` |

On iOS, the same attribute is `textContentType` on `UITextField` and a prop of the same name in React Native, which is the one that drives fill on that platform.

On Android, the Compose semantics property landed in Compose 1.8; view layouts use `android:autofillHints` with the `AUTOFILL_HINT_*` string of the same meaning.

### Grouping and saving

A credential is filled and saved as a set, so the fields have to be declared as one.

- SwiftUI: fields in the same form are grouped by the system; submit ends the session.
- Compose: read `LocalAutofillManager` and call `commit()` when the form is submitted, or nothing is offered for saving.
- Flutter: wrap the fields in `AutofillGroup`, then call `TextInput.finishAutofillContext()` on submit.
- React Native: `importantForAutofill` on the container, plus the props above per field.
- Web: one `<form>` element around the fields, and a real submit.

### One time codes

One field, numeric keyboard, the one time code content type. The platform reads the message and offers the digits above the keyboard.

- iOS fills from Messages with no extra work once `.oneTimeCode` is set.
- Android reads the SMS through the SMS Retriever API, or the User Consent API where the message is not formatted for retrieval.
- Mobile web can additionally use the WebOTP API through `navigator.credentials.get()` with an `otp` request.

### Capitalisation and correction

| Field | Capitalisation | Autocorrect |
|---|---|---|
| email, username, password, code, URL | none | off |
| person or street name | words | off |
| free text, note, message | sentences | on |

The names of these settings: `.textInputAutocapitalization()` and `.autocorrectionDisabled()` in SwiftUI, `KeyboardOptions(capitalization =, autoCorrectEnabled =)` in Compose, `textCapitalization` and `autocorrect` in Flutter, `autoCapitalize` and `autoCorrect` in React Native, `autocapitalize` and `autocorrect` in HTML.

# references/launch-surface.md

## Launch surface configuration, per stack

Lookup only. The rules live in `heuristics/splashscreen.md`. Open this file for one key, one attribute or one dismissal API, not as background reading.

Nothing here is a design decision. The decision is in the heuristic; this is where the name of the knob lives.

### iOS: the two supported routes

Pick one. Both satisfy the same requirement.

| Route | Key | What it holds |
|---|---|---|
| Property list | `UILaunchScreen` dictionary in `Info.plist` | `UIColorName` (background color), `UIImageName`, `UIImageRespectsSafeAreaInsets`, plus `UINavigationBar`, `UITabBar`, `UIToolbar` to draw empty bars |
| Interface file | `UILaunchStoryboardName` pointing at `LaunchScreen.storyboard` | UIKit views only |
| Per URL scheme | `UILaunchScreens` | one launch screen per scheme |
| Legacy | `UILaunchImages` | deprecated, do not add it |

The storyboard route is deliberately inert: one root `UIView` or `UIViewController`, UIKit classes only, no outlets, no actions, no custom classes, no user defined runtime attributes. Nothing in it executes.

The launch screen is required on iOS and iPadOS. No size, resolution or file weight limit is published for it, because the property list route takes a color and the storyboard route is constraint based.

A launch that never draws its first frame is killed by the system watchdog. The crash carries termination reason `SPRINGBOARD`, code `0x8badf00d`, and a `scene-create` watchdog event.

### Android: theme attributes

Two sets with the same job. The compat set has no `android:` prefix and is the one to use, because it produces the same surface back to older releases.

| Purpose | Platform (Android 12+) | Compat (`androidx.core:core-splashscreen`) |
|---|---|---|
| Window background, one opaque color | `android:windowSplashScreenBackground` | `windowSplashScreenBackground` |
| Centre icon | `android:windowSplashScreenAnimatedIcon` | `windowSplashScreenAnimatedIcon` |
| Icon animation duration | `android:windowSplashScreenAnimationDuration` | `windowSplashScreenAnimationDuration` |
| Circle behind the icon | `android:windowSplashScreenIconBackgroundColor` | `windowSplashScreenIconBackgroundColor` |
| Theme applied once the surface goes | (the activity theme) | `postSplashScreenTheme`, required |
| Icon size | (fixed) | `splashScreenIconSize` |
| Branding image at the bottom | `android:windowSplashScreenBrandingImage` | not present |
| Always show the icon | `android:windowSplashScreenBehavior`, value `icon_preferred` | not present |

Compat themes: `Theme.SplashScreen` as the parent, `Theme.SplashScreen.IconBackground` when the icon sits on a circle. Some Android documentation writes the icon background attribute without the `Color` suffix; the library only declares `windowSplashScreenIconBackgroundColor`.

Setting `android:windowBackground` in a launch theme is the pre Android 12 pattern. From Android 12 the system discards that custom splash and shows its own default one instead, so the configured background never appears. A dedicated splash Activity is the separate case, and it produces two surfaces rather than one wrong one. Do not pin a `core-splashscreen` version from prose; read the current one from the dependency catalogue.

### Android: holding and dismissing

| Need | API |
|---|---|
| Install the surface | `installSplashScreen(activity)`, called before `super.onCreate()` |
| Hold it | `setKeepOnScreenCondition { }`, returning `true` to hold. Compat only |
| Hold it without the library | `ViewTreeObserver.OnPreDrawListener` on `android.R.id.content`, returning `false` to suspend |
| Own the exit | `setOnExitAnimationListener { }`, then `SplashScreenViewProvider.remove()` |
| Remaining icon time | `iconAnimationStartMillis`, `iconAnimationDurationMillis` |

The framework interface `android.window.SplashScreen` carries only `setOnExitAnimationListener`, `clearOnExitAnimationListener` and `setSplashScreenTheme`. There is no keep on screen condition outside the compat library.

### Asset geometry, Android

| Asset | Size | Visible area |
|---|---|---|
| Icon with an icon background | 240x240 dp | fits a 160 dp circle |
| Icon without an icon background | 288x288 dp | fits a 192 dp circle |
| Animated vector icon | 432 dp icon area | 288 dp inner area |
| Branding image | 200x80 dp | leave it empty |

One third of the icon foreground is masked. Anything drawn in the outer third does not survive.

### Flutter

| Platform | Where |
|---|---|
| iOS | `ios/Runner/Base.lproj/LaunchScreen.storyboard`, assets in the `LaunchImage` set inside `Runner/Assets.xcassets` |
| Android | `LaunchTheme` in `android/app/src/main/res/values/styles.xml`, with a `values-night` copy for dark |
| Android handoff | manifest `meta-data` on the Flutter activity, `io.flutter.embedding.android.NormalTheme` pointing at `@style/NormalTheme` |

The Flutter template still teaches `android:windowBackground` on `LaunchTheme`. On Android 12 and up, put the `windowSplashScreen*` attributes there instead, or add the compat library. Keep `NormalTheme` on the same background color as the first Flutter frame.

### Expo

| Need | Where |
|---|---|
| Configure | the `expo-splash-screen` config plugin, under `expo.plugins` in the app config |
| Properties | `backgroundColor`, `image`, `imageWidth`, `resizeMode` (`contain`, `cover`, `native`), `dark` with its own `backgroundColor` and `image`, plus per platform `android` and `ios` blocks |
| Hold it | `SplashScreen.preventAutoHideAsync()`, called in module scope rather than inside a component |
| Dismiss it | `SplashScreen.hide()` or `SplashScreen.hideAsync()` |
| Exit options | `SplashScreen.setOptions({ duration, fade })`, `fade` iOS only |

The icon must be a PNG. Any other format fails the production build. A 1024x1024 source with a transparent background is the recommended input.

### Bare React Native

No core API exists. The surface is the platform's own, `UILaunchScreen` or the storyboard on iOS and `Theme.SplashScreen` on Android, reached either directly or through a package recorded in `STACK.md`.

### Mobile web

There is no OS drawn launch surface for a page. An installed web app gets one from the manifest: `background_color`, `theme_color`, `name` and the icon set. A first paint that arrives quickly is the only equivalent a browser tab has.

# references/motion-tokens.md

## Motion tokens and APIs

Lookup only. The rules live in `heuristics/motion.md`. Open this file for a specific token, value or API name, not as background reading.

### Material durations

Sixteen tokens, reached as `?attr/motionDuration<Name>` or through `MotionUtils.resolveThemeDuration`. Available from the Material components library 1.6.0.

| Token | Value | Token | Value |
|---|---|---|---|
| Short1 | 50ms | Long1 | 450ms |
| Short2 | 100ms | Long2 | 500ms |
| Short3 | 150ms | Long3 | 550ms |
| Short4 | 200ms | Long4 | 600ms |
| Medium1 | 250ms | ExtraLong1 | 700ms |
| Medium2 | 300ms | ExtraLong2 | 800ms |
| Medium3 | 350ms | ExtraLong3 | 900ms |
| Medium4 | 400ms | ExtraLong4 | 1000ms |

The rule attached to the table: duration rises as the area covered or the distance travelled rises. A chip's tint and a full screen cover do not share a number.

### Material easing

Seven tokens, reached as `?attr/motionEasing<Name>Interpolator`. Emphasized is the styled set, standard the utility set.

| Token | Curve |
|---|---|
| Standard | `cubic-bezier(0.2, 0, 0, 1)` |
| StandardDecelerate | `cubic-bezier(0, 0, 0, 1)` |
| StandardAccelerate | `cubic-bezier(0.3, 0, 1, 1)` |
| Emphasized | path `M 0,0 C 0.05,0 0.133333,0.06 0.166666,0.4 C 0.208333,0.82 0.25,1 1,1` |
| EmphasizedDecelerate | `cubic-bezier(0.05, 0.7, 0.1, 1)` |
| EmphasizedAccelerate | `cubic-bezier(0.3, 0, 0.8, 0.15)` |
| Linear | `cubic-bezier(0, 0, 1, 1)` |

### Material springs

Three speeds by two kinds. Fast is for a small component such as a switch, slow for a full screen transition, default for everything in between. Spatial springs move a thing (position, size, shape) and are allowed to overshoot; effects springs carry color and opacity, where overshoot is a defect.

Standard scheme. These are the six Views theme attributes (`?attr/motionSpring<Speed><Kind>`, library 1.13.0 and up) and the Compose `StandardMotionTokens`, at identical values.

| Spec | Damping | Stiffness |
|---|---|---|
| fast spatial | 0.9 | 1400 |
| fast effects | 1.0 | 3800 |
| default spatial | 0.9 | 700 |
| default effects | 1.0 | 1600 |
| slow spatial | 0.9 | 300 |
| slow effects | 1.0 | 800 |

Expressive scheme, Compose only. The Views theme does not publish these, so a rule that says "use the expressive spring" is not implementable from XML attributes alone.

| Spec | Damping | Stiffness |
|---|---|---|
| fast spatial | 0.6 | 800 |
| fast effects | 1.0 | 3800 |
| default spatial | 0.8 | 380 |
| default effects | 1.0 | 1600 |
| slow spatial | 0.8 | 200 |
| slow effects | 1.0 | 800 |

In Compose the scheme is a theme value, not a per-animation choice: `MaterialTheme.motionScheme`, holding `MotionScheme.standard()` or `MotionScheme.expressive()`, exposing `defaultSpatialSpec()`, `fastSpatialSpec()`, `slowSpatialSpec()` and the three effects equivalents, and no duration or easing at all. `MaterialExpressiveTheme` defaults the scheme to `expressive()`.

Compose spring constants outside Material: `Spring.DampingRatioNoBouncy` 1.0, `LowBouncy` 0.75, `MediumBouncy` 0.5, `HighBouncy` 0.2; `Spring.StiffnessVeryLow` 50, `StiffnessLow` 200, `StiffnessMediumLow` 400, `StiffnessMedium` 1500, which is what a bare `spring()` uses.

### Where motion lives per stack

| Stack | Animate | Continuity across screens |
|---|---|---|
| SwiftUI | `withAnimation`, `.animation(_:value:)`, `Animation.spring(response:dampingFraction:)` | `.navigationTransition(.zoom(sourceID:in:))` with `.matchedTransitionSource(id:in:)`, iOS 18; `matchedGeometryEffect` before that |
| UIKit | `UIView.animate(springDuration:bounce:)`, iOS 17; `UIViewPropertyAnimator` | `preferredTransition = .zoom(options:sourceViewProvider:)`, iOS 18 |
| Compose | `animate*AsState`, `AnimatedVisibility`, `AnimatedContent`, `Crossfade` | `SharedTransitionLayout` with `Modifier.sharedElement` or `sharedBounds` |
| Views | `SpringAnimation` and `SpringForce` from dynamicanimation | `com.google.android.material.transition`: container transform, shared axis, fade through, fade |
| Flutter | implicit `Animated*` widgets, `AnimationController`, `TweenAnimationBuilder` | `Hero`, `PageRouteBuilder` |
| React Native | Reanimated worklets; `Animated` with `useNativeDriver: true` | `react-navigation` presets, `react-native-screens` |
| Mobile web | CSS transitions and keyframes, Web Animations API | View Transitions where supported |

### Reduced motion flags per stack

| Stack | Read |
|---|---|
| SwiftUI | `@Environment(\.accessibilityReduceMotion)` |
| UIKit | `UIAccessibility.isReduceMotionEnabled`, plus `prefersCrossFadeTransitions` before substituting a cross fade; `reduceMotionStatusDidChangeNotification` to react to a change |
| Android | no single API on phones: `ValueAnimator.areAnimatorsEnabled()` from API 26, or `Settings.Global.ANIMATOR_DURATION_SCALE` and `TRANSITION_ANIMATION_SCALE`. `LocalReduceMotion` exists only on Wear |
| Flutter | both of `MediaQuery.disableAnimationsOf(context)` and `AccessibilityFeatures.reduceMotion`, because the first carries Android and the second carries iOS |
| React Native | `AccessibilityInfo.isReduceMotionEnabled()`, and the `reduceMotionChanged` event; on Android it tracks the transition animation scale |
| Mobile web | `@media (prefers-reduced-motion: reduce)`, equivalent to the bare `@media (prefers-reduced-motion)` |

The user-facing names differ. On iOS the setting is Reduce Motion, with Prefer Cross-Fade Transitions beside it. On Android it is Remove animations, under Color and motion in Accessibility.

# references/navigation-containers.md

## Navigation containers and restoration, per stack

Lookup only. The rules live in `heuristics/navigation.md`. Open this file for one container, one API name or one restoration mechanism, not as background reading.

The concept is portable and the name is not. Pick the row for the relationship, then read the column for the stack in `STACK.md`.

### Containers

| Container | SwiftUI | Jetpack Compose | Flutter | React Native | Mobile web |
|---|---|---|---|---|---|
| Pushed screen | `NavigationStack` with `navigationDestination` | `NavHost` with `navController.navigate` | `Navigator.push`, `MaterialPageRoute`, `context.push` on GoRouter | native stack, `navigation.navigate` | History API `pushState`, or the router's push |
| Top-level destinations | `TabView` with `Tab` | `NavigationBar` over one nested graph per destination | `NavigationBar` in a `Scaffold`, plus `IndexedStack` or a `Navigator` per branch | bottom tab navigator, one stack inside each tab | one route prefix per section |
| Bottom sheet | `.sheet` with `.presentationDetents` | `ModalBottomSheet` | `showModalBottomSheet` | a sheet library, or a native stack screen with `presentation: 'formSheet'` | `<dialog>` positioned to the bottom edge |
| Full screen cover | `.fullScreenCover` | a route on the graph, or `Dialog(usePlatformDefaultWidth = false)` | `MaterialPageRoute(fullscreenDialog: true)` | native stack screen with `presentation: 'fullScreenModal'` | a route of its own |
| Alert or dialog | `.alert`, `.confirmationDialog` | `AlertDialog` | `showDialog` with `AlertDialog` or `CupertinoAlertDialog` | `Alert.alert` | `<dialog>` with `showModal()` |

Bare React Native ships no bottom sheet. Reaching for one means adding a dependency, which is a `STACK.md` decision rather than a detail.

### Back and dismissal

| Need | SwiftUI | Jetpack Compose | Flutter | React Native | Mobile web |
|---|---|---|---|---|---|
| Dismiss the current surface | `@Environment(\.dismiss)` | `navController.popBackStack()` | `Navigator.pop` | `navigation.goBack()` | `history.back()` |
| Intercept back | `.interactiveDismissDisabled`, then present the question yourself | `BackHandler` from `androidx.activity.compose` | `PopScope` with `canPop` and `onPopInvokedWithResult` | `beforeRemove` listener, plus `BackHandler` for the Android button | `popstate` with a pushed sentinel entry |
| Guard unsaved work | `.interactiveDismissDisabled(hasEdits)` plus a confirmation dialog | `BackHandler(enabled = hasEdits)` | `PopScope(canPop: !hasEdits)` | `beforeRemove` with `e.preventDefault()` | `beforeunload` for the tab, the sentinel for in-app |

Android's back callback is the modern one, not an override of the old back method, which is what keeps the predictive animation the system draws. `touch-gestures` owns that side.

### Deep links

| Stack | Where the route is declared | Where the incoming link is received |
|---|---|---|
| SwiftUI | `NavigationPath` rebuilt from the URL | `.onOpenURL`, plus Associated Domains for universal links |
| Jetpack Compose | `navDeepLink` on the destination | intent filters in the manifest, verified as App Links |
| Flutter | route patterns on GoRouter or the router delegate | `onGenerateRoute`, or the platform link plugin |
| React Native | the `linking` config, with `getStateFromPath` for a synthesized stack | `Linking.getInitialURL` for a cold start, the `url` event while running |
| Mobile web | the URL itself | the router's own resolution |

Two paths to test, always: the app already running, and the app killed. Only the second one builds the stack from nothing, and it is the one that fails.

### State restoration

| Stack | Mechanism | Notes |
|---|---|---|
| SwiftUI | `@SceneStorage` for per screen state, plus a codable `NavigationPath` | `@State` does not survive process death |
| Jetpack Compose | `rememberSaveable`, `SavedStateHandle`, and the nav graph's own saved state | pass `saveState` and `restoreState` when switching top-level destinations, or each switch resets that branch |
| Flutter | `RestorationMixin` with a `restorationScopeId`, and `RestorableProperty` values | restoration is off until a scope id is set |
| React Native | persist the navigator state from `onStateChange` and feed it back as `initialState` | gate the first render until the saved state has loaded |
| Mobile web | `history.state` for the route, `sessionStorage` for the screen | `sessionStorage` clears with the tab |

Restore the place. Refetch the content.

# references/search-controls.md

## Search controls

Lookup only. The rules live in `heuristics/search.md`. Open this file for the control name in one stack, not as background reading.

### The control per stack

| Stack | Field and entry point | Expanded state and results |
|---|---|---|
| SwiftUI | `.searchable(text:placement:prompt:)`, placement from `SearchFieldPlacement` | `.searchSuggestions`, `.searchCompletion`, `.searchScopes`, `isSearching`, `dismissSearch` |
| UIKit | `UISearchController` on `navigationItem.searchController` | `searchResultsUpdater`, `automaticallyShowsCancelButton`, `automaticallyShowsScopeBar` |
| Compose Material 3 | `SearchBar(state:inputField:)` with `rememberSearchBarState`, or `AppBarWithSearch` | `ExpandedFullScreenSearchBar` on a phone; `ExpandedDockedSearchBar` is the tablet form |
| Android Views | `com.google.android.material.search.SearchBar` inside the app bar | `com.google.android.material.search.SearchView`, holding history, suggestions and results |
| Flutter Material | `SearchAnchor`, or `SearchAnchor.bar` for the bar plus view together | `suggestionsBuilder`, `SearchController.openView`, full screen by default on mobile |
| Flutter Cupertino | `CupertinoSearchTextField` | list of your own below it |
| React Native | `TextInput` with `returnKeyType="search"`, or the navigator's own search header | list of your own below it |
| Mobile web | `<input type="search">` | list of your own below it |

### Things the stock control already does

- **Clear button.** Present on the iOS search field and on the Material `SearchView`, which shows and hides it with the text. Do not draw a second one.
- **Focus and keyboard.** The Material `SearchView` raises the keyboard on open by default (`app:autoShowKeyboard`, default true), and the Compose expanded search bar requests focus on first expansion and dismisses the keyboard itself on collapse. On iOS, do not force focus on a surface the user did not open in order to type.
- **Accessibility.** The Material `SearchView` marks its siblings as unimportant for accessibility while open and restores them on hide. Removing it from the tree while it is still open skips that restore, so call `setModalForAccessibility(false)` by hand in that case.
- **Predictive back.** Automatic on Android when a `SearchView` is connected to a `SearchBar`.

### Android configuration worth knowing

- Soft input mode for a screen using `SearchBar` with `SearchView` is `adjustNothing`. `adjustResize` resizes the window during the expand and collapse animation, and resizing is not useful to somebody who is searching.
- `SearchBar` does not accept `android:background`. It extends `Toolbar`, so navigation icon and menu APIs work as usual.
- Under Material 3 Expressive the `SearchBar` goes inside an `AppBarLayout` themed with `ThemeOverlay.Material3Expressive.AppBarWithSearch`.
- Recent queries have a platform store in the Views stack: a `SearchRecentSuggestionsProvider` with `setupSuggestions(AUTHORITY, MODE)`, then `saveRecentQuery(query, null)` and `clearHistory()`.
- Material Search needs `com.google.android.material` 1.8.0 or later.

### Compose API drift

The `SearchBar(inputField, expanded, onExpandedChange, ...)` and `DockedSearchBar(inputField, expanded, ...)` overloads are deprecated, as are the older `query` and `onQueryChange` forms and `TopSearchBar`, which is now `AppBarWithSearch`. Write the `SearchBarState` form with `ExpandedFullScreenSearchBar`.

Full screen expansion also needs the layout to cooperate: no parent may constrain the search bar's size, and the host activity sets `WindowCompat.setDecorFitsSystemWindows(window, false)`.

### Sizes

| Value | Number |
|---|---|
| collapsed search bar height, Material | 56dp |
| full-screen search view header height, Material | 72dp |
| docked search view header height, Material | 56dp |
| search field text size, Material Views | 16sp |
| search bar horizontal and vertical margin, Material Views | 16dp |

There is no platform-standard debounce interval, suggestion count, minimum query length or retention limit for search history. Those four are the project's own numbers, picked once and written into `STACK.md`.

# references/type-scales.md

## Type scales

Lookup only. The rules live in `heuristics/typography.md`. Open this file for a specific role, size or weight, not as background reading.

### Material 3

Fifteen baseline roles. Weight is 400 everywhere except title medium, title small and the three labels, which are 500. Nothing in the baseline scale is 600 or 700.

| Role | Size | Line height | Weight | Used for |
|---|---|---|---|---|
| displayLarge | 57sp | 64sp | 400 | hero and onboarding text |
| displayMedium | 45sp | 52sp | 400 | large feature text |
| displaySmall | 36sp | 44sp | 400 | prominent display |
| headlineLarge | 32sp | 40sp | 400 | screen titles |
| headlineMedium | 28sp | 36sp | 400 | section headers |
| headlineSmall | 24sp | 32sp | 400 | card titles |
| titleLarge | 22sp | 28sp | 400 | top app bar title |
| titleMedium | 16sp | 24sp | 500 | tabs, navigation |
| titleSmall | 14sp | 20sp | 500 | subtitles |
| bodyLarge | 16sp | 24sp | 400 | primary body text |
| bodyMedium | 14sp | 20sp | 400 | secondary body text |
| bodySmall | 12sp | 16sp | 400 | captions |
| labelLarge | 14sp | 20sp | 500 | buttons, prominent labels |
| labelMedium | 12sp | 16sp | 500 | chips, smaller labels |
| labelSmall | 11sp | 16sp | 500 | timestamps, annotations |

Floors: body content does not go below 12sp, labels not below 11sp. Reach these through `MaterialTheme.typography`, never as literal sizes, and always in `sp`.

M3 Expressive adds fifteen *emphasized* styles that run parallel to these, at heavier weights, for selection, actions, headlines and editorial moments. They are a second scale to reach into deliberately, not permission to raise the weight of the first one. Where the project ships a variable face, the same feature set covers the expressive axes (weight, grade, width, optical size); those belong to display and headline, which are short enough to carry them.

### iOS text styles

Sizes at the Large content size, which is the default.

| Style | Size | Line height | Weight |
|---|---|---|---|
| largeTitle | 34pt | 41pt | Regular |
| title1 | 28pt | 34pt | Regular |
| title2 | 22pt | 28pt | Regular |
| title3 | 20pt | 25pt | Regular |
| headline | 17pt | 22pt | Semibold |
| body | 17pt | 22pt | Regular |
| callout | 16pt | 21pt | Regular |
| subheadline | 15pt | 20pt | Regular |
| footnote | 13pt | 18pt | Regular |
| caption1 | 12pt | 16pt | Regular |
| caption2 | 11pt | 13pt | Regular |

Floor is 11pt (`caption2`), body is 17pt. Reach these through the text styles, so Dynamic Type carries them; a custom face is registered against a style with `relativeTo:` or `UIFontMetrics` rather than given a fixed size.

Second-hand tables often print the titles as Bold. They are Regular. The only style that ships semibold is `headline`, and it is the same 17pt as `body`.

Letter spacing is not listed here. It comes from the theme, and a guessed tracking value is worse than no value at all.

### What the two scales agree on

- Large text is not bold text. Both platforms grow the size and leave the weight at the regular end.
- Weight above regular is reserved for the small roles that label a control: M3 labels and title medium at 500, iOS `headline` at semibold.
- The floor is 11 in both, and it is for genuinely peripheral text.
- Line height sits near 1.2 at the display end and near 1.4 to 1.5 at the body end. It is a ratio that widens as the text gets smaller, not a constant.

# references/wireframe-frame.md

## Wireframe frame

The skeleton every wireframe copies, so two screens in the same project come out in the same drawing and a reviewer compares structure instead of style. Read it when `flow/spec.md` sends you to render a brief, and copy it rather than reinventing a set of conventions per screen.

Sections, in order: The frame, Shapes, Known defaults, The skeleton, Rules the skeleton encodes, Landscape, Rendering. Reading for the shape ladder stops after Known defaults; the skeleton and what follows it are only needed once a shape is picked.

### The frame

393 by 852 is a reference canvas for structure. It is not a device specification, and it stands for no platform: the project may ship on Android, on iOS or on the mobile web, and the same canvas is used for all of them, because what gets compared between two wireframes is structure and that needs one constant frame.

Two things are kept apart here that a drawing tends to merge.

**The canvas** is the rectangle and its proportions: a tall, narrow frame about the shape of a phone in one hand. That is all it claims.

**System chrome and insets** belong to the device and are read at runtime, which is `layout-insets`. The canvas reserves a band at the top and a band at the bottom only to say that content cannot use those edges. Their heights in the skeleton are placeholders for "some system area", never the height of any real status bar, cutout, gesture area or navigation bar, and no number from this file goes into a layout. A screen that has to hold on a device with a larger cutout or a three-button bar is checked for that on the device in `flow/review.md`, not here.

Everything is greyscale by construction: four greys, one ink, and nothing else. A wireframe that acquires a colour has stopped being a wireframe, and `flow/spec.md` says why.

### Shapes

`flow/explore.md` sends the agent here while it writes candidates, to name a shape rather than fall into one. The list is a set of prompts, not a set of templates and not a closed vocabulary. When none of these gives the screen a composition of its own, invent one and name it in two words, the way these were named: a line everything hangs from became `timeline`, and a screen built around one ring of progress might be `focus-ring`, a control surface under a live ground `command-deck`. The name is what lets the next screen in the project refer to it. The relations a new shape is assembled from are in `references/design-grammars.md`.

- **stack**: a single vertical column, one full-width block after another. The shape almost anything defaults to; not forbidden, but it owes a reason when it wins.
- **rail**: a horizontally scrolling strip of equal items, anchored inside a vertical flow around it.
- **hero-split**: one dominant region, sized to what it actually needs, over a visibly different second region below it.
- **grid-wall**: a symmetric grid of equal tiles filling most of the frame.
- **timeline**: a single column where every item anchors to a line or marker running through it, order carrying meaning.
- **bottom-sheet**: chrome and controls anchored low, over content running full-bleed behind them, instead of a top bar.
- **tab-cluster**: content split into switchable panes at the same position, not one continuous scroll.
- **split-focus**: two unequal regions, one persistent (a map, a preview, a player) and one scrollable that acts on it.
- **canvas-overlay**: a full-bleed background with controls floating over it, instead of content sitting inside bounded cards.

### Known defaults

A wireframe that lands on one of these without a reason recorded is not a choice, it is the shape nobody chose:

- A top bar over a stack of equal-height cards, on a screen whose brief names a hierarchy: the stack flattens a lead item, a highlighted item or a different-shaped item into the same row as everything else.
- A symmetric grid of equal tiles as the whole content of a screen whose brief names an order or a lead item: the grid has no way to hold one.
- The primary action as a full-width button pinned to the bottom, when the brief's hierarchy puts it mid-scroll or beside the thing it acts on.
- A hero sized to a fixed familiar fraction of the frame, independent of what the screen's hierarchy actually needs the fold for.

None of these are banned; a screen can genuinely be a stack. What `flow/explore.md` stops is arriving at one of them with nothing else considered and no reason recorded for why it won, which is `comp-chosen`.

### The skeleton

Save as `.trunative/screens/<name>.wireframe.html`, one file, no imports, no CDN, no framework.

What is copied from below is the canvas, the greys and the drawing conventions: the cross, the text bar, the label. The classes for a card, a chip, a button and a tab bar are a convenience for drawing those things quickly when the composition has them, and every size in them is a drawing size. None of them is a component specification, none of their numbers reaches the build, and none of them is a reason for a screen to contain a card, a chip row or a tab bar. A composition that needs a block of another proportion, an uneven split, something overlapping a ground or a form no class here draws writes its own few lines of CSS in the same greys. The example screen shows the conventions in use. It is not a layout to start from, and a wireframe that begins by editing it has skipped `flow/explore.md`.

```html
<!doctype html>
<meta charset="utf-8">
<title>Wireframe</title>
<style>
  :root {
    --ink: #1c1c1e;
    --mute: #8e8e93;
    --line: #c7c7cc;
    --fill: #e5e5ea;
    --ground: #f2f2f7;
    --paper: #ffffff;
  }
  body {
    margin: 0;
    padding: 24px;
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    background: #d9d9de;
    font: 15px/1.35 -apple-system, "Segoe UI", Roboto, sans-serif;
    color: var(--ink);
  }
  /* The label is a sibling, never a child: the frame clips its own content. */
  .shot { display: flex; flex-direction: column; gap: 6px; }
  .label { font-size: 12px; color: #55555a; }
  .frame {
    width: 393px;
    height: 852px;
    display: flex;
    flex-direction: column;
    background: var(--ground);
    border: 1px solid var(--line);
    border-radius: 44px;
    overflow: hidden;
    position: relative;
  }
  .status, .indicator {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--mute);
    font-size: 11px;
  }
  .status { height: 59px; }
  .indicator { height: 34px; }
  .indicator::after {
    content: "";
    width: 140px;
    height: 5px;
    border-radius: 3px;
    background: var(--line);
  }
  .content {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .bar {
    flex: none;
    display: flex;
    align-items: center;
    gap: 12px;
    height: 44px;
    font-size: 22px;
    font-weight: 600;
  }
  .bar .spacer { flex: 1; }
  .row { display: flex; align-items: center; gap: 8px; }
  .scroller { display: flex; gap: 8px; overflow: hidden; }
  .chip {
    flex: none;
    padding: 7px 14px;
    border: 1px solid var(--line);
    border-radius: 999px;
    font-size: 13px;
    color: var(--mute);
    white-space: nowrap;
  }
  .card {
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 12px;
  }
  .box {
    background: var(--fill);
    border: 1px solid var(--line);
    border-radius: 10px;
  }
  /* A cross means an image nobody has chosen yet. */
  .image {
    background:
      linear-gradient(to top right, transparent calc(50% - 1px), var(--line) 50%, transparent calc(50% + 1px)),
      linear-gradient(to bottom right, transparent calc(50% - 1px), var(--line) 50%, transparent calc(50% + 1px)),
      var(--fill);
    border: 1px solid var(--line);
    border-radius: 10px;
  }
  .avatar { width: 56px; height: 56px; border-radius: 50%; }
  .text { height: 12px; border-radius: 3px; background: var(--fill); }
  .text.short { width: 40%; }
  .text.half { width: 55%; }
  .caption { font-size: 13px; color: var(--mute); }
  .section { font-size: 17px; font-weight: 600; }
  .button {
    height: 48px;
    border: 1px solid var(--ink);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }
  .tabbar {
    flex: none;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 64px;
    margin: 0 16px;
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 20px;
    font-size: 11px;
    color: var(--mute);
  }
  .tabbar .on { color: var(--ink); font-weight: 600; }
</style>

<div class="shot">
<div class="label">Memories, default</div>
<div class="frame">
  <div class="status">status bar</div>
  <div class="content">
    <div class="bar">Memories<span class="spacer"></span><span class="caption">menu</span></div>
    <div class="scroller">
      <div class="chip">Filter</div>
      <div class="chip">You (12)</div>
      <div class="chip">Natalia (20)</div>
      <div class="chip">Favorites (0)</div>
    </div>
    <div class="section">You recently viewed</div>
    <div class="card">
      <div class="row">
        <div class="image" style="width:96px;height:96px"></div>
        <div class="image" style="width:96px;height:96px"></div>
        <div class="box" style="width:96px;height:96px"></div>
      </div>
      <div class="text half" style="margin-top:12px"></div>
      <div class="caption" style="margin-top:6px">29 Memories, 2023 to 2025</div>
    </div>
    <div class="row">
      <div class="section">People</div>
      <span class="spacer" style="flex:1"></span>
      <div class="caption">View all</div>
    </div>
    <div class="row" style="justify-content:space-between">
      <div class="avatar box"></div>
      <div class="avatar box"></div>
      <div class="avatar box"></div>
      <div class="avatar box"></div>
      <div class="avatar box"></div>
    </div>
    <div class="button">Explore Memories</div>
  </div>
  <div class="tabbar">
    <span>Home</span><span class="on">Memories</span><span>Create</span>
    <span>Profiles</span><span>Account</span>
  </div>
  <div class="indicator"></div>
</div>
</div>
```

### Rules the skeleton encodes

- **The frame clips.** `.content` sets `overflow: hidden`, so anything that does not fit is cut off exactly as it would be on the device. A wireframe that scrolls its own frame hides the collision the render exists to find, which is `layout-fold` and `layout-chrome`.
- **Fixed chrome is a sibling, not an overlay.** The tab bar sits outside `.content`. When a real screen pins something over the content instead, draw it over, and then check what it covers at the end of the scroll.
- **Real strings only.** Type the words the screen will actually show, including the longest name and the largest count. Lorem text passes every layout and proves none, which is `copy-budget` and `copy-sample-data`.
- **A cross means an unchosen image**, a plain `.box` means a deliberate empty slot such as an add tile, and neither ever becomes a photograph.
- **The label names the frame, not the thinking.** The screen and its state, in the fewest words that tell two frames apart. Which shape was picked, why it beat the runner-up, and anything else settled on the way here is reasoning that happened before this file existed. Written into the drawing it becomes part of what gets looked at, and a frame that explains itself is being defended rather than read.
- **One frame per structurally different state.** Put a second `.shot` beside the first and set its `.label`. They sit side by side on one page, which is how a reviewer sees them in a single capture.
- **The explore record is a comment.** It opens the file as `<!-- explore ... -->`, before the doctype, so it is in the file for `npx trunative spec` and for whoever opens it, and absent from the render, which keeps the label rule above intact.

### Landscape

A screen that rotates, or is watched from a phone set down on its side, gets a landscape frame as its own `.shot`, drawn as its own composition. The canvas turns, and so do the reserved bands: the cutout sits on one short edge and the home indicator along the bottom.

```html
<style>
  .frame.land { width: 852px; height: 393px; flex-direction: row; }
  .frame.land .status { width: 59px; height: auto; }
  .frame.land .indicator { position: absolute; left: 0; right: 0; bottom: 0; height: 21px; }
</style>
<div class="shot">
  <div class="label">Recipe step, landscape</div>
  <div class="frame land">
    <div class="status"></div>
    <div class="content"><!-- the landscape composition --></div>
    <div class="indicator"></div>
  </div>
</div>
```

Render a page holding a landscape frame at least 900 wide, and add 440 for each portrait frame beside it.

### Rendering

```sh
chrome --headless --window-size=393,852 --screenshot=wireframe.png .trunative/screens/<name>.wireframe.html
```

Widen `--window-size` by 440 for every frame past the first, so two frames want about 900 and three about 1340. A window that is a few points short wraps the last frame below the fold and it is missing from the capture with no error, so count the frames rather than guessing the width. Any Chromium binary works, `chromium` and `msedge` included. When none is installed, open the file in whatever browser is and capture it by hand: the HTML is the artefact, and the PNG is a view of it that nothing else depends on.
