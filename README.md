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

It checks that the project has a product brief and a design brief (`.trunative/PRODUCT.md` and `.trunative/DESIGN.md`, or the same names at the root), and that the installed skill matches the current version. It reports and exits 1, it never writes the briefs: that is the agent's job in the init step.

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

## Design Principles

The rules the skill enforces. Each is a hard constraint, not a preference.

## License

[MIT](LICENSE) © Tiago Danin