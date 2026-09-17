# Init

Runs once per project, and again whenever `doctor` fails. Nothing else in the flow starts before this passes.

## Asking

This step runs on answers, not on guesses. Every decision below that the code cannot settle is a question for the user, asked one at a time: one decision per question, the options in the order given, the recommended one first and named as the recommendation, and each option phrased as what it costs the design.

The user chooses. A recommendation is a default worth stating, not a decision already taken, and an answer that goes against it wins with no argument back.

## 1. Run the doctor

```sh
npx trunative doctor
```

It checks four things and exits non-zero if any fails:

- the product brief, at `.trunative/PRODUCT.md` or `PRODUCT.md`
- the design brief, at `.trunative/DESIGN.md` or `DESIGN.md`
- the stack brief, at `.trunative/STACK.md` or `STACK.md`
- the installed skill, against the hash in `.trunative/skill.lock`

The doctor only checks that a brief exists. Whether it says anything useful is your job, here in init.

## 2. Fix what it reports

**Skill missing or stale.** Run `npx trunative install`, then run the doctor again. Do not hand-edit the copy inside the agent directory: the hash check exists to catch exactly that, and the edit is lost on the next install.

**Product brief missing.** Interview the user, then write `.trunative/PRODUCT.md`. Do not invent answers, and do not fill a template with plausible text. Ask:

- who uses this, and in what situation (walking, driving, at a counter, at home)
- the two or three jobs the app exists to do
- what a session looks like: seconds or minutes, one-handed or two, foreground or interrupted
- the constraints that are already decided: platforms, stack, minimum OS versions, offline requirements

**Design brief missing.** `DESIGN.md` follows the [design.md specification](https://github.com/google-labs-code/design.md) from Google Labs, so any agent that already reads it gets the visual identity for free. Do not invent a second format.

Read the codebase first and derive the tokens from what is actually there. Ask the user only about what the code cannot answer, and about the intent behind values the code shows but does not explain.

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

## 3. Check the project is not wearing another app's identity

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

## 4. Confirm

Run `npx trunative doctor` again. Every check must pass before the build step. If the user declines to answer something, write down what is unknown instead of guessing, and treat it as a risk in review.
