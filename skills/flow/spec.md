# Spec

Settles what is on the screen before anything draws it. Runs between init and build, whenever the task establishes or changes structure.

Structure is four things: hierarchy, actions, states, navigation. A new screen, a new component with state of its own, or a new flow settles all four at once, so it always comes through here: nothing is being changed because everything is being decided, and that is the maximum case rather than an exemption. An existing screen comes through when the task moves any of the four.

The step ends with two things, and neither is optional: a wireframe rendered and looked at, and a question the user answered. A spec step that wrote a brief and went on to code did not run.

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

## 1. The screen brief

One file per screen, at `.trunative/screens/<name>.md`. It is the fourth brief: `PRODUCT.md` is the product, `DESIGN.md` is the identity, `STACK.md` is the codebase, and this is one screen.

### Frontmatter

```yaml
---
target: lib/screens/memories_screen.dart
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
---
```

Four fields. Nothing joins them without a consumer already reading it.

**`target`** is the file that implements the screen, relative to the project root. It is what links the brief to everything else: `flow/review.md` computes its archive slug from that path, and `npx trunative detect` reads it. There is no `id` field, because the target is the identity and the filename is a convenience.

**`primary_action`** is the label the user reads, in quotes, not an identifier. `button-label`, `copy-first-word` and `copy-case` all judge the visible string, and the comparison against the code only works on the string. Exactly one: a screen with two primary actions is two screens, and `button-one-primary` is what says so.

**`states`** carries the six keys `state-set` names, always all six: `loading`, `empty`, `error`, `offline`, `partial`, `permission`. Each value is one line saying what the screen shows, or `n/a` followed by the reason. A missing key, an empty value, or an `n/a` with no reason is a defect in the brief.

The keys are fixed because a free list is a loophole. A screen that picks its own five states declares five, ships five and reads as complete, while the rule asks for six. Fixed keys make the absence something somebody had to write down and sign.

A screen driving a camera, a microphone, location, a motion sensor or a radio owes the five further states in `sense-states` on top of these, in the body.

**`scope`** names files from the Extra table in `SKILL.md`, by the stem or by the rule prefix beside it, whichever the row put in front of you: `localization` and `l10n` are the same row. Never a rule id, and never one of the nine always in scope, which are not optional and so are never declared. `open` is what build reads and what `npx trunative rubric --only` takes. `closed` carries the rows a reader would expect to be open, each with the sentence `SKILL.md` requires. Not the whole table: the near misses, which are the only ones anybody argues about later.

### Body

In this order, and nothing else:

1. **Purpose.** One sentence, the job the screen does, from `PRODUCT.md`.
2. **Hierarchy.** Numbered, top to bottom, in reading order.
3. **Components.** What is on the screen, named as the thing it is.
4. **Primary action.** The action and where the thumb reaches it.
5. **Interactions.** One line per gesture, as target then result.
6. **Navigation.** Where this screen leads and how it is reached, when either changed.
7. **States.** A subsection per state that needs more than its frontmatter line.

### The ceiling

Two tests, and the brief fails on either:

- If every line of this screen's code were deleted, could the intent and the structure be rebuilt from this file?
- Does the file contain a number with a unit? Padding, radius, font size, width, a hex colour and a shadow belong in `DESIGN.md`. A brief that starts carrying them is a layout format wearing a brief's name.

## 2. A screen that already exists

Nobody reconstructs a codebase by hand. When a screen has no brief and a structural change arrives, derive the brief from the implementation first, the same way init derives the project briefs from the code, then make the change against it.

Derive what the code shows and nothing more. A state the code does not implement is not written as implemented: it is the `n/a` that has no reason, which is exactly the finding that sends the screen back to build.

## 3. The wireframe

The brief preserves the decision. It does not let anyone see it. A hierarchy list reads in thirty seconds and hides what an image gives away at once: the primary action stranded in an empty frame, the last row of content under the pinned bar, a hero eating a third of the height, a density that does not fit. `flow/review.md` says the same thing when it refuses to close a screen on source evidence alone.

So the brief gets rendered before it gets approved, and the rendering is a page the agent writes.

Write `.trunative/screens/<name>.wireframe.html` from the brief. The frame, the greyscale palette and the placeholder conventions are in `references/wireframe-frame.md`, which is a skeleton to copy rather than a thing to reinvent per screen.

- Greyscale, outlines, placeholders, a cross for an image, one system typeface, hierarchy by size.
- Never a brand colour, a gradient, a shadow, a real photograph, an icon set, or any token from `DESIGN.md`. The wireframe settles structure, and a wireframe carrying identity collects an approval nobody asked for.
- HTML even when the project ships Flutter, Compose or SwiftUI. Writing the wireframe in the project's stack is writing the screen twice, which is the cost this step exists to avoid.
- The default state always. One more frame per state whose composition is genuinely different, which in practice is the empty one. Never all six: six frames cost more than the screen.

Then render it and look at it yourself, before anyone else does:

```sh
chrome --headless --window-size=393,852 --screenshot=wireframe.png .trunative/screens/<name>.wireframe.html
```

<If agent="claude">
Open the PNG with the Read tool and read it as a picture. That pass is the cheap half of this step: the collisions `flow/review.md` can only catch on a device show up here for the price of one HTML file.
</If>

<If agent="codex,antigravity,opencode,other">
Open the PNG however this harness shows an image, and read it as a picture. That pass is the cheap half of this step: the collisions `flow/review.md` can only catch on a device show up here for the price of one HTML file. When the harness cannot show you an image at all, say so in the hand-off and leave the judgement to the user rather than claiming the frame was checked.
</If>

What the wireframe settles: the first screenful (`layout-fold`), content colliding with fixed chrome (`layout-chrome`), grouping and density (`layout-grouping`), reach for the primary action (`touch-reach`), and whether the real words fit (`copy-budget`).

What it does not settle, and does not try: contrast, the dark appearance, text at the accessibility steps, measured hit areas, the screen reader, motion. Those are the nine always in scope, they are answered on a device in `flow/review.md`, and they are why the gate below approves structure rather than a finished screen.

The wireframe is scaffolding, not a second contract. After approval nothing reads it: review does not open it, drift does not consult it, and no check validates it. It stays in the repository as the record of what was approved, and a later structural change rewrites it from the brief instead of patching it. One contract, brief against code, and no second surface to diverge.

## 4. The gate

Show the frame and four lines, and ask once:

```text
Memories

Hierarchy      title, filters, recent memories, people, navigation
Primary        "Explore Memories", bottom third
States         loading, empty, error, offline; partial and permission n/a
Scope          lists, navigation, media, scrolling, offline

Approve?
```

The approval is about hierarchy, actions, states and navigation. It is not about colour, typeface, spacing or polish, and an answer about those goes to `DESIGN.md` rather than into the brief.

Ask the user, and never grant it yourself. Writing the brief, drawing the frame and deciding it looks right is this step doing its own homework, not the gate: the gate is the one part of the step the user sees, and a step reporting "approved" with no question asked has skipped exactly that part.

One question per session, which is not none. The first structural task of a session always asks. After it, the brief is still written and the frame still drawn, and the question comes back when a new structure contradicts one already approved.

When the harness cannot show the user a picture, say so and put the four lines in front of them anyway. A gate answered on the text alone is weaker than one answered on the frame, and it is still the user answering.

## 5. Hand off

Say what the brief settled, which extra files its scope opened and which near misses it closed, and what the wireframe pass caught. Then run `flow/build.md`.
