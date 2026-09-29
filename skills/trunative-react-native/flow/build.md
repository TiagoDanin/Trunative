# Build

Writes or changes one screen, one component, or one flow. Never runs before init passes.

## 1. Frame the screen

Before anything else, write one line saying whether this task establishes or changes hierarchy, actions, states or navigation. If it touches any of the four, stop here and run `flow/spec.md`: a new screen, a new component with state of its own, or a new flow touches all four by definition, and arriving at this file with one of those in hand means the step was skipped rather than judged.

That line is written, not recalled. Unwritten, the answer is always the same one, because code is what this step is for and the pull is toward starting it.

**When the screen has a brief**, at `.trunative/screens/<name>.md`, read it and build what it says. The person's goal and the moment they are in, the hierarchy, the primary action, the six states and the scope were settled in `flow/spec.md`, and the composition was chosen between alternatives in `flow/explore.md`. Rederiving them here is the context this step exists to save. Build the composition that won, as it was drawn: the pull while writing code is back toward the stock arrangement the framework's widgets suggest, and a screen that quietly reverts to a bar over equal cards has thrown the choice away, which review reports as drift and scores under `comp-context`. Where the brief and the request disagree, the brief is stale: go back to `flow/spec.md` and change it rather than building against a file that now lies.

**When it has none**, and the line above says the task touches none of the four, state in one or two lines before writing code:

- the single job this screen does, taken from `PRODUCT.md`
- the one primary action, and where the thumb reaches it
- what happens on a slow network, on failure, and with no data

If the screen has more than one primary action, it is more than one screen. Split it and say so.

If framing it turns out to move hierarchy, actions, states or navigation after all, the change was structural and misjudged. Stop and run `flow/spec.md`.

## 2. Load only what applies

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

## 3. Write it

- Reuse the tokens `DESIGN.md` defines and the components `STACK.md` lists. A raw value where a token exists is a defect, and a new primitive needs a reason.
- Apply the heuristics as you write, not as a pass afterwards.
- Where a heuristic cannot be met, leave the code correct and record the conflict for review. Do not silently drop the rule.

## 4. Look at it

The screen has been written, not seen. Everything above this line is source: the token reached for, the rule applied as the line went down, the conflict recorded. None of that is the screen, and the defects that survive a correct diff are the ones that only exist once something is drawn: a region that depicts nothing, a hierarchy that reads flat at arm's length, a control that sinks into the surface behind it, an identity that is named in `DESIGN.md` and absent from the render.

So render it and look at it yourself, before anyone else does, the way `flow/spec.md` already looks at its own wireframe. How this project renders a screen is what `STACK.md` is for.

Open the capture however this harness shows an image, and read it as a picture rather than as a file that was produced.

When the user supplied a reference, put the capture beside it at the same width and list every difference a person would point at: a ground that is grey where the reference is white, a title weight, a glyph, an indicator, a gap between groups, a control that moves when it is selected. Fix them or name them in the hand-off. Saying the screen matches without having looked at the two together is how the same correction comes back from the user one item at a time.

Then say where the reference behind the identity is visible on the screen. One named thing a stranger could point at is enough. A reference that cannot be found anywhere in the render was a caption rather than a derivation, which is the failure `color-derived` names one level down, arriving here instead.

This pass is cheap and it is not the review. It catches what the author can still fix in the same turn, which is the half of `flow/review.md` that would otherwise come back as a violation and spend a second pass on it. When the screen cannot be rendered here at all, say so in the hand-off instead of reporting it as looked at: a screen nobody has seen reaches review as a screen nobody has seen, and review is told that rather than left to discover it.

## 5. Hand off

Say which heuristics files you applied and which you deliberately skipped, with the reason, and name the triggers that opened the extra ones. When this screen had to settle an identity because `DESIGN.md` did not, the five lines go in the hand-off, marked provisional. Name the brief you built against, or say the change was not structural and had none. Then run `flow/review.md`. Build is never the last step.

Where the code had to depart from the brief, change the brief in the same turn and say what moved. A brief left behind is what review reports as drift, and it is cheaper to correct here than to explain there. The same holds when the user asks for the change: a request that moves an item the brief names under Hierarchy, Interactions or Navigation, or removes a screen another brief links to, rewrites those briefs in the same turn, and a structural change also redraws the wireframe through `flow/spec.md`.

Then run `npx trunative spec` over the briefs this build touched. A build renames and splits files, and a `target` pointing at a file that no longer renders the screen is a brief that joins to nothing.

A plan that builds several screens builds them one at a time, each through this file and each reviewed before the next starts. Writing every screen first and the briefs afterwards, to complete the record, turns spec into paperwork about decisions nobody made.
