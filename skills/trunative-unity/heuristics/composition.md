# Composition

How the parts of a screen relate in space, and whether anybody chose it. Everything else in this folder judges a part: a colour, a target, a label, a state. This file judges the arrangement, which is the thing a person recognises before reading a word of it.

Generated screens fail here in one direction. Every rule about parts gets met, and the arrangement is the one a thousand other apps have: a bar, a row of chips, equal cards in a column, a button pinned low, a tab bar. Nothing in it is wrong and nothing in it was decided. Two products in different fields, built with the same care, come out as the same screen with different nouns.

Searching for the arrangement is a procedure, and it lives in `flow/explore.md`. The relations an arrangement is made of are in `references/design-grammars.md`. What follows is what review holds the result to. Spacing and grouping are `layout-grouping`, the first screenful is `layout-fold`, and an identity that would fit any product in its category is `color-derived`, `type-face` and `layout-shape`.

Rules in this file, in order: `comp-chosen`, `comp-distance`, `comp-context`, `comp-distinct`, `comp-repeat`.

## `comp-chosen` A composition is chosen between alternatives, never arrived at [P2]

A layout with no runner-up was not picked. It is what came first, and what comes first is what has been seen most, which is a property of everything else that exists and not of this screen.

So a structural screen has a record, left by `flow/explore.md` at the top of its wireframe: the default it would have been, the candidates that competed, how far apart they were, and why the winner won. The record is short and it is the difference between a familiar layout somebody defended and a familiar layout nobody noticed.

Landing on the familiar arrangement is allowed, and is sometimes right: a settings list should look like a settings list, because the person has used a hundred of them and the pattern is the affordance. What the rule asks is that the familiar one wins an argument. The burden sits on convergence, since convergence is what happens unattended, and an unusual arrangement owes no apology beyond serving the person better.

**Default.** Every screen that went through spec carries the record.
**Exception.** A screen whose pattern the platform owns outright: a system settings list, a share sheet, a permission prompt, a capture screen handed to the system. There the alternatives are worse by construction.
**Reason required.** The name of the platform pattern, in the hand-off, in place of the record.

## `comp-distance` Candidates differ in relations, and a change of spacing is not a candidate [P3]

Two layouts are different when the relations inside them differ: what dominates, the direction it reads in, how content is grouped, where the primary action sits, how the screen meets navigation, what contains things, what scrolls, how dense it is, and what the hand does. They are the same layout when only spacing, radius, type size, wording, colour or the size of a component moved, however different the two look side by side.

The test is mechanical on purpose. Count the relations that differ between two candidates. Under three, they were one idea, and comparing them was comparing a thing with itself. The count says nothing about quality, and a pair that passes it can both be poor. What it guards is the comparison, which is only worth making between things that differ.

## `comp-context` The moment of use outranks the component library [P1]

A screen is used somewhere, by a body in some position, with some share of somebody's attention, for some length of time, some number of times a day. Those facts are in the brief's `context` block, and they decide the arrangement before any component does.

A glance of a few seconds wants one dominant thing, readable at arm's length, and nothing to scroll. One occupied hand wants the action under the thumb and no precision. A screen opened dozens of times a day wants its answer on the first frame with no touch at all, and every tap on its ordinary path is paid dozens of times. A long seated session can take density, a second level and a smaller type role. A screen opened twice a year has to explain itself, because nobody remembers it.

An arrangement that would be identical whatever the context block said has not read it. The common form of the failure is a dashboard of equal cards on a screen whose person has four seconds: every card is defensible, and the one number they came for is the same size as the six they did not.

## `comp-distinct` The arrangement could only be this product's [P2]

Remove the words, the colour and the pictures, leaving grey blocks. Could the product still be told from another in a different field? For most generated screens the answer is no, and that is the defect: the structure carries nothing about the job.

What makes an arrangement a product's own is that it is shaped like the thing the product does. An app about a sequence in time is built on a line. An app about one number is built around that number at a size no list row would give it. An app whose person acts on a live ground puts the ground full-bleed and floats the rest. The distinctive part is where the product's own behaviour shows, and there is usually exactly one: a screen that is unusual everywhere is as unreadable as one that is unusual nowhere.

Four questions, answered in the brief's Purpose and Hierarchy or in the hand-off:

- What does this product do that its neighbours in the category do not, and where on this screen does that show?
- Which one component or relation here is deliberately not the stock one, and what does it buy?
- What stays conventional so that the unusual part can be learned? Navigation, back, system gestures and form fields almost always do.
- If a competitor's content were poured into this arrangement, what would stop fitting?

Distinctive never outranks usable. A relation that breaks `touch-reach`, `nav-back` or `a11y-gesture` to be memorable has been memorable at the person's expense.

Nor does it outrank the user. An arrangement the user supplied, as a mockup or as a screen to follow, answers these questions by having been chosen by the person who owns the product, and leaving it to score better here replaces their decision with the grader's.

## `comp-repeat` Screens of one product are related, not identical [P3]

A product's screens should be recognisable as siblings: the same grid, the same type roles, the same way of grouping. They should not be one template with the content swapped. When the list, the detail, the profile and the summary are all a bar over equal cards, the arrangement has stopped saying what kind of screen this is, and the person reads the title to find out where they are.

Before choosing, look at what the project already approved. An arrangement that has won twice needs a reason to win a third time, and "it fits" is true of a stack on every screen ever made. Repetition is right where the jobs repeat: two list screens are both lists. It is wrong where the jobs differ and the arrangement does not.

**Default.** A different job gets a visibly different arrangement.
**Exception.** Screens that are instances of one job, such as every category list in a catalogue, share one arrangement on purpose.
**Reason required.** The job they share, in one line.

## Check

Review answers each of these against the code, pointing at the line:

- The screen has a record of the default it would have been, the candidates considered and why the winner won, or names the platform pattern that made alternatives moot. `comp-chosen`
- The candidates on record differ from each other on at least three of the nine relations, and none differs only in spacing, radius, type size, wording, colour or component size. `comp-distance`
- The dominant element, the position of the primary action and the density follow from the brief's context block, and the arrangement would have to change if that block said something else. `comp-context`
- Reduced to grey blocks the arrangement still says what the product does, through one deliberate relation, while navigation, back and system gestures stay conventional, or the arrangement is the one the user supplied. `comp-distinct`
- The arrangement differs from the project's other approved screens wherever the job differs, and where it repeats, the shared job is named. `comp-repeat`

## Reaches

The rules this file cites and the files that hold them. Open one when a citation above decides something this file does not.

- `heuristics/accessibility.md`: `a11y-gesture`
- `heuristics/colors.md`: `color-derived`
- `heuristics/layout.md`: `layout-grouping`, `layout-fold`, `layout-shape`
- `heuristics/navigation.md`: `nav-back`
- `heuristics/touch.md`: `touch-reach`
- `heuristics/typography.md`: `type-face`
