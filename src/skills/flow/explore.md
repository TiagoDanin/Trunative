# Explore

Searches for a composition before one gets chosen. Runs inside `flow/spec.md`, after the screen brief is written and before the wireframe is drawn, on every task that reached spec.

The first layout that comes to mind is the most familiar one, which is a fact about what has been seen most often and says nothing about this screen. A step that draws it and then checks it against the rules has reviewed one answer, however carefully. This step exists so that the choice is made between answers.

Two jobs happen here and they are kept apart on purpose. Generating wants room: a candidate written with the whole checklist open is filtered before it is finished, and what survives that is the layout every rule was written while looking at. Judging wants rigour: once the candidates exist, they are held to everything. So the rules stay closed while candidates are written and open once all of them exist.

Variation is not exploration. Spacing, radius, type size, wording, colour and the size of a component can all change while the screen stays the same screen. A new candidate changes where things sit relative to each other, or how the person operates them.

## 1. Name the default

Before any candidate, write one line describing the layout this screen would get if nobody thought about it: the regions, top to bottom, and where the action lands. Be literal about it.

```text
Default: top bar, a row of filter chips, equal cards in one column, a full-width button pinned low.
```

When the user supplied an arrangement, a mockup, a sketch, a screen from another app they want this one to follow, that arrangement is the conventional candidate, written off the reference and not from memory. The other two lenses still run, since the user may not have seen the alternatives, but the supplied one is what they asked for: a different winner is a departure `flow/spec.md` puts in front of them beside the reference, and `comp-distinct` is never the reason to leave it.

That line is not a candidate yet. It is the thing the other candidates are measured against, and writing it down is what stops it from arriving later under a different name. It may still win in step 5, as the conventional candidate, with a reason. What it may not do is win because nothing else was on the table, or be the first thing written: when the candidates are written one after another, the spatial and the contextual ones come first and the conventional one last, so that the familiar layout is never the text the other two are written under.

## 2. Read the context

Take the `context` block and the `user_goal` from the brief, and say in one line what they demand of the layout. A person standing, one hand busy, glancing for a few seconds, wants one large thing and an action under the thumb. A person seated, both hands free, working through a long session, can take density and a second level. A screen opened forty times a day wants its answer visible before any touch, and a screen opened once a year wants to explain itself.

This line is input to every candidate. A candidate that ignores it is not unusual, it is unfinished.

## 3. Generate three candidates, each from the brief alone

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

<If agent="claude">
Spawn three sub-agents in one message, one per lens. Each receives the brief, the context line from step 2, the lens, and the two reference files, and nothing else: not the default line, not the other lenses, not the heuristics. Each returns its five lines.
</If>

<If agent="codex,antigravity,opencode,other">
When this harness can spawn sub-agents at all, spawn one per lens: that is an instruction, not an option to weigh against speed. Each gets the brief, the context line, the lens and the two reference files, and nothing else. Only when it cannot, write the candidates one at a time, re-reading the brief before each and never quoting, comparing against or referring to a candidate already written. The comparison happens in step 4, and doing it earlier is how three candidates become one.
</If>

Heuristics stay closed during this step. The one constraint a candidate carries while it is being written is the brief: the hierarchy line, the primary action, the six states and the context.

## 4. Measure the distance

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

## 5. Judge, then choose

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

## 6. Hand back

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
