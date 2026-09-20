# Accepted exceptions

What a good exception looks like, so that a rule written as a default is not read as a law, and a default is not dissolved by the first inconvenience either. Read it when a screen seems to need to break a rule, before writing the exception into `STACK.md`.

## The form

Most rules in `heuristics/` state a default. A default is what is right when nothing special is going on, which is most screens. Where a rule has exceptions worth knowing in advance it carries three lines:

```text
Default.          what to do when nothing argues otherwise
Exception.        the situations where the default is the wrong answer
Reason required.  what has to be written down to claim the exception
```

A rule without those lines still admits an exception. It simply has none common enough to list, and the claim goes through the same test.

A few rules are requirements and not defaults: the nine always in scope in `SKILL.md`, and anything marked P0. A control with no accessible name, text that cannot scale, content under the system bars, a form that loses what was typed. No product reason outweighs those, because what they protect is whether a person can use the screen at all.

## The test for an exception

An exception is good when all four are true:

1. **It comes from the job or the person, not from the build.** "The person is choosing between two equal outcomes" is a reason. "The component we already have does it this way" is not, and neither is the deadline.
2. **It names the cost and who pays it.** Every default protects someone. The exception says who loses that protection and why that is acceptable here, or what replaces it.
3. **It is narrow.** It covers this screen or this component, not "the app". An exception that would apply to every screen is a disagreement with the rule, and that conversation belongs in the repository of the skill, not in one project's `STACK.md`.
4. **Somebody could disagree with it.** A reason nobody could argue against ("it looks better", "it felt right") has said nothing.

## Where it is recorded

`STACK.md` grants exceptions, and nothing else does. A screen brief records intent and never grants one, and an `n/a` in a brief is a claim review checks. In review, a rule with a recorded exception is `n/a` with that exception as the reason. It is never a low score defended in prose, and never a high score awarded for the quality of the excuse.

## Worked examples

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
