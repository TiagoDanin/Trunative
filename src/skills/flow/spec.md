# Spec

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

## 1. The screen brief

One file per screen, at `.trunative/screens/<name>.md`. It is the fourth brief: `PRODUCT.md` is the product, `DESIGN.md` is the identity, `STACK.md` is the codebase, and this is one screen.

### Frontmatter

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

**`target`** is the file that implements the screen, relative to the project root. It is what links the brief to everything else: `flow/review.md` computes its archive slug from that path, and `npx trunative detect` reads it. There is no `id` field, because the target is the identity and the filename is a convenience.

**`user_goal`** is what the person is trying to get done, in their terms and not the screen's. "Show today's departures" is what the screen does. "Know whether to run for this train or wait for the next" is the goal, and it produces a different screen: the first is a list and the second is one figure and a verdict. Write it as the person would say it, including the constraint they are under, because the constraint is usually what decides the layout.

**`context`** is the moment of use, in eight fixed keys: `environment`, `posture`, `hands`, `attention`, `session_length`, `frequency`, `interruption`, `urgency`. Plain words, no numbers with units. Take it from `PRODUCT.md` where that file says it and from the task where it does not, and write `unknown` for a key nobody knows, which is an honest answer and a different one from leaving it out. `flow/explore.md` reads this block before it writes a candidate, and `comp-context` grades the screen against it. The keys are fixed for the same reason the state keys are: a free list leaves out the one that would have argued with the layout already in mind.

**`primary_action`** is the label the user reads, in quotes, not an identifier. `button-label`, `copy-first-word` and `copy-case` all judge the visible string, and the comparison against the code only works on the string. One by default, which is what `button-one-primary` protects. A screen whose job is a choice between two outcomes of equal weight names both labels in the one string, joined by "or", and owes the reason that rule asks for.

**`states`** carries the six keys `state-set` names, always all six: `loading`, `empty`, `error`, `offline`, `partial`, `permission`. Each value is one line saying what the screen shows, or `n/a` followed by the reason. A missing key, an empty value, or an `n/a` with no reason is a defect in the brief.

The keys are fixed because a free list is a loophole. A screen that picks its own five states declares five, ships five and reads as complete, while the rule asks for six. Fixed keys make the absence something somebody had to write down and sign.

A screen driving a camera, a microphone, location, a motion sensor or a radio owes the five further states in `sense-states` on top of these, in the body.

**`scope`** names files from the Extra table in `SKILL.md`, by the stem or by the rule prefix beside it, whichever the row put in front of you: `localization` and `l10n` are the same row. Never a rule id, and never one of the nine always in scope, which are not optional and so are never declared. `open` is what build reads and what `npx trunative rubric --only` takes. `closed` carries the rows a reader would expect to be open, each with the sentence `SKILL.md` requires. Not the whole table: the near misses, which are the only ones anybody argues about later. `auto_excluded` is optional and carries stems alone, for the rows the screen plainly has nothing of. It owes no sentence, and it is there for the reviewer who wants to see that a row was looked at and not forgotten. A row in neither list is simply excluded. When in doubt whether a row is a near miss, it is one, and it goes under `closed` with its sentence.

### Body

In this order, and nothing else:

1. **Purpose.** One sentence, the job the screen does for the goal in `user_goal`, from `PRODUCT.md`. Then one line on what this product does here that its neighbours in the category do not, which is where `comp-distinct` starts.
2. **Hierarchy.** What wins the screen, in one line, before anything is listed: the one thing a reader lands on, and what every other region is subordinate to. Then the order, numbered, top to bottom. Written without that line it comes out as an inventory of the request's own clauses, which is what this step produces whenever nobody composes anything: each clause becomes a region, the regions stack in the order the clauses were written, and the screen is a transcript of what was asked for rather than an answer to it.
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

Show the frame and five lines:

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

Never grant it yourself. Writing the brief, drawing the frame and deciding it looks right is this step doing its own homework, not the gate: the gate is the one part of the step the user sees, and a step reporting "approved" with no question asked has claimed something that did not happen.

Ask when the structure is a real decision, meaning any of these holds:

- the winner of `flow/explore.md` is not the arrangement the request described or an ordinary reader of it would expect;
- the screen changes what the product does: a new destination, a changed navigation model, a job moved from one screen to another;
- an interaction is irreversible or costs money, and the structure decides how easy it is to reach;
- the new structure contradicts one the user already approved;
- it is the first structural task of the session, so the user sees once how this step draws.

Proceed without asking when none of them holds: the request already fixed the hierarchy, the actions and the navigation, and the chosen composition is what it asked for. The brief is still written, the candidates still compared and the frame still drawn and looked at. Say in the hand-off that the gate was skipped and on what ground, show the frame and the four lines anyway, and carry on to build. That is a report and not an approval, and the user can stop it there. A loop of build, ask, wait on every component is a gate people learn to click through, which protects nothing.

When the harness cannot show the user a picture, say so and put the four lines in front of them anyway. A gate answered on the text alone is weaker than one answered on the frame, and it is still the user answering.

## 5. Hand off

Say what the brief settled, which extra files its scope opened and which near misses it closed, the lines `flow/explore.md` handed back, what the wireframe pass caught, and whether the gate was asked or skipped and on what ground. Then run `flow/build.md`.
