# Trunative

A mobile-only design skill for AI coding agents.

![skills.sh](https://skills.sh/b/TiagoDanin/Trunative)

Trunative is a [skill](https://www.skills.sh/docs) that makes coding agents treat mobile as its own platform rather than a narrow browser window. A phone is not a small desktop: input is imprecise and one-handed, the session gets interrupted by calls and notifications, the network drops mid-request, the OS owns gestures and insets and permissions, text scales to whatever the user set, the battery and the thermal budget are finite, and the whole thing is often used outdoors while walking. Those constraints, not the viewport width, are what a mobile design has to answer for.

It is stack-agnostic: the rules apply to React Native, Expo, Flutter, SwiftUI, Jetpack Compose, or mobile web, and the agent detects the framework and translates.

## Why

Coding agents are trained mostly on desktop web. Left alone, they produce mobile screens that are technically correct and physically unusable:

- ...

None of this shows up in a code review or a passing test suite. It shows up when someone holds the phone.

Trunative encodes the constraints that mobile actually imposes, such as reach, touch precision, interruption, latency, sunlight and one hand, as rules the agent applies before writing the first component, and as a checklist it verifies against afterwards. Desktop is explicitly out of scope: there is no responsive breakpoint to hide behind, so no decision gets deferred to "it'll be fine on a big screen".

## Installation

```sh
npx trunative install
```

This copies the skill into every agent directory the project already has (`.claude`, `.agents`, `.antigravity`, `.codex`, `.opencode`), and writes `.trunative/skill.lock` so the agent can tell when its copy is out of date.

Then, before the agent starts:

```sh
npx trunative doctor
```

It checks that the project has its three briefs, in `.trunative/` or at the root, and that the installed skill matches the current version:

- `PRODUCT.md`, who uses the app and what it is for.
- `DESIGN.md`, the visual identity, in the [design.md format](https://github.com/google-labs-code/design.md) from Google Labs.
- `STACK.md`, the codebase itself: UI primitives, navigation, components, accepted exceptions.

The doctor reports and exits 1, it never writes the briefs. Writing them is the agent's job in the init step.

The agent also has a generator for the review checklist:

```sh
npx trunative rubric --only touch --only forms
```

It prints one row per rule id, with that rule's own checklist line as the criterion, so the checklist comes out of the heuristics instead of being written by hand. A rule added today shows up in the next review with no second edit.

The skills.sh CLI works too, without the lockfile and the version check:

```sh
npx skills add TiagoDanin/Trunative
```

To install manually, copy the `skills/` folder into your agent's skills directory:

```sh
git clone https://github.com/TiagoDanin/Trunative.git
cp -r Trunative/skills .claude/skills/trunative
```

## Usage

The skill loads on its own when the task is mobile UI work. Building a screen, a component, a navigation flow, a form, or reviewing an existing one. No command needed:

```
Build the checkout screen for the app.
Add a filter sheet to the product list.
Review this screen does it work one-handed?
```

To force it, name it:

```
Use the trunative skill on src/screens/Checkout.tsx
```

The agent then:

1. **Detects the stack** and maps the rules to that framework's primitives (`SafeAreaView`, `SafeArea`, `WindowInsets`, `env(safe-area-inset-*)`, …).
2. **Applies the design principles** below while writing the code.
3. **Audits the result** against the checklist and reports what it could not satisfy, instead of silently shipping it.

That audit scores every rule that applies from 1 to 5, and a 1 or a 2 sends the agent back to fix it before the work is handed over.

The same review runs heavier on a screen that already exists, asked for by name:

```
Review the checkout screen
```

It drives the app instead of reading the diff, separates what was read in the source from what was seen on a device, writes the result into `.trunative/review/`, and prints the score against the last run's.

## Design Principles

The rules the skill enforces. Each is a hard constraint, not a preference, and each carries a stable id the agent reports against. `skills/heuristics/` is the source of truth; this is the summary.

Nine files open on every screen, because every screen has colour, text, targets, a layout, states, an action, words and something that moves.

**Colour** is reached through a role, never as a hex at a call site (`color-roles`). One accent means touchable and nothing else (`color-one-accent`). Dark is a second design rather than an inverted switch (`color-dark-composed`), contrast is calculated rather than eyeballed (`color-contrast`), and nothing is said by colour alone (`color-not-alone`).

**Type** comes from the platform ramp, so no component carries a literal size (`type-scale`), and the screen is rendered at the largest accessibility step before anyone calls it done (`type-scaling`). Body copy stays at a readable measure (`type-measure`) and the longest translation still fits (`type-strings`).

**Touch** is the one every desktop habit breaks. The target is the hit area and not the drawing, at 44pt or 48dp (`touch-floor`), with 8dp of dead space between neighbours (`touch-spacing`). The bottom third is the only easy part of the screen (`touch-reach`), destructive actions sit away from it (`touch-destructive`), every press answers within about 100ms outside the area the finger covers (`touch-feedback`), and the screen edges belong to the operating system (`touch-gestures`).

**Buttons** allow exactly one primary action per screen (`button-one-primary`), with emphasis taken from the platform's own ladder (`button-ladder`) and labels that name what will happen (`button-label`).

**Layout** takes its insets from the framework at runtime rather than from a constant (`layout-insets`), keeps one column and one scrolling axis (`layout-column`), and survives the narrow device (`layout-width`). The first screenful answers what the screen is and what to do (`layout-fold`).

**States** are named before the happy path is written, all six of them (`state-set`). Loading is a placeholder shaped like the content (`state-loading`), the three empties get three different sentences (`state-empty`), errors say what failed without inventing why (`state-error`), offline is four states rather than a boolean (`state-offline`), and work in progress survives the system killing the process (`state-interrupt`).

**Motion** earns its place by answering continuity, latency or acknowledgement (`motion-job`), leaves the platform's own transitions alone (`motion-platform`), never holds the user still (`motion-blocks`), and reads the reduced-motion setting on every platform it ships to (`motion-reduced`).

**Accessibility** gives every control a name, a role and a value (`a11y-name`), hides decoration rather than describing it (`a11y-hidden`), and never makes a gesture the only route to anything (`a11y-gesture`). One whole flow is driven with the screen reader on before it ships (`a11y-test`).

**Copy** decides its word budget before the sentence is written (`copy-budget`), spends the first two words on meaning (`copy-first-word`), names the failure and ends on the fix (`copy-error`), and uses one term per thing throughout (`copy-terms`).

The rest of the rules open when the screen touches them: navigation and back (`nav-`), lists (`list-`), forms (`form-`), chat (`chat-`), permissions (`perm-`), onboarding (`onboard-`), localization (`l10n-`), notifications (`notify-`), widgets and live surfaces (`widget-`), device capabilities (`sense-`), camera (`cam-`), network (`net-`), offline (`off-`), the launch surface (`splash-`), performance (`perf-`), icons and imagery (`icon-`), feedback (`fb-`), search (`search-`), auth (`auth-`), settings (`set-`), media (`media-`), background work (`bg-`), privacy (`priv-`), sharing (`share-`), updates and migrations (`upd-`), scrolling (`scroll-`), data and charts (`data-`), sound (`sound-`), payments (`pay-`), ads (`ads-`), maps (`map-`) and web views (`webview-`).

## License

[MIT](LICENSE) © Tiago Danin