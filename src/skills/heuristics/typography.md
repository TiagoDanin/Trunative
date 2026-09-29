# Typography

Type on a phone gets read close up, in a hand that moves, in light nobody chose, at a size the reader picked and you will never see. Two of those are OS settings the app is expected to obey: the text size slider, which runs past 200%, and the system preference for heavier text. Generated type tends to fail one of them long before anyone argues about taste.

`DESIGN.md` holds the families and the ramp. This file is how they land in code, and what has to hold before the screen ships. Per-role sizes, weights and line heights sit in `references/type-scales.md`, to be opened for one lookup rather than read through.

## <Rule id="type-scale" severity="p1" grade="binary" description="The ramp already exists on both platforms" />

Each platform publishes a complete role scale that is optically tuned, wired to the size setting, and understood by the screen reader. Pick the role that matches the job and adjust from there. Inventing a parallel ramp discards those three properties and returns nothing.

- Text reaches the screen through a style: `MaterialTheme.typography.bodyLarge`, `.font(.body)`, `Theme.of(context).textTheme`. A size typed into a component is a defect even when the value happens to be right.
- The unit belongs to the platform as well. Android text is `sp`, and `dp` freezes it. On iOS, `.system(size:)` with no text style behind it is the identical failure in another language.
- Body lands at 16sp or 17pt. Eleven is the floor, and it belongs to text at the margin of meaning, never to something a user has to read in order to act.
- When the readers are older or the app lives outdoors, move the whole ramp up rather than granting one role an exception.

## <Rule id="type-roles" description="About four jobs per screen" />

Material publishes fifteen roles and iOS eleven styles. A single screen usually needs four of them: what this screen is, what it says, what a control is called, and what qualifies the rest. Name each one after its job.

A row that shows up on two screens carries the same style in both, or the product reads as though two teams built it without speaking. Seven distinct sizes on one screen is not hierarchy, it is seven unmade decisions.

Line height is a property of the role, not of the paragraph: near 1.2 where the type is display sized, 1.4 to 1.5 for body. The ratio has to widen as the type gets smaller, which is why one global multiplier comes out wrong at both ends.

## <Rule id="type-hierarchy" description="Four roles a reader cannot tell apart is one role" />

`type-roles` asks for about four roles and `type-weight` takes weight out of the running for most of them, which leaves size carrying the structure. Neither says how far apart those sizes have to be, and the screen that exposes the gap passes both: a title two points above a section head, a section head one above body, a caption below it. Four roles, five sizes, nothing hardcoded, every rule in this file satisfied, and a reader at arm's length sees one grey block.

The published ramps are far apart on purpose: a display or large-title role runs near twice body, not a step above it. A screen drawing only from the middle of the ramp has chosen the stretch where the roles stop being distinguishable, and it reads as a wireframe that was never promoted.

- The test is the glance, before a word is read. The subject of the screen and the start of its content separate, or they do not. Look at it from across the room or out of focus: what survives is the hierarchy, and when nothing survives there was none.
- The gap is optical rather than numeric. The same two steps that separate under one face collapse under another, and they collapse again in the other appearance, which is what `type-dark` is about.
- Spending the range is not using more of it. `type-roles` still caps the count; this is about the distance between the few, never about adding a sixth.
- A ramp that has to stay compressed, for density, for a table, for something worked in all day, says what carries the hierarchy instead: weight, space, a rule line, or colour (`color-assigned`). Unwritten, the compression was not a decision.

## <Rule id="type-weight" description="Weight is structure, and the user has a say in it" />

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

## <Rule id="type-face" description="A typeface nobody chose" />

Inter turns up on its own for the same reason violet does: it is the most common interface face in the training data. Inter is a fine typeface, which is exactly why finding it there says nothing about this product.

- Shipping the system face is a legitimate decision. SF Pro and Roboto are tuned for their own rendering stack, carry every weight, cover the scripts the product ships in, and load for free. Picking one deliberately is an answer; arriving at Inter by default is not.
- A brand face gets themed into the scale, taking display and headline where the strings are short, while the system face keeps body, labels and controls. Applying a face component by component throws away the size setting and what the screen reader expects, in one move.
- Two families is the ceiling, and the second earns its place by doing something the first cannot.
- A custom face ships only when it scales with the user's setting, carries every weight the roles call for, covers the languages, and has been subset and paid for out of the launch budget. One usable weight leaves size doing all the structural work by itself.

What each platform and stack can reach without shipping a file, and what the Google Fonts route costs on each, is in `references/fonts.json`.

## <Rule id="type-measure" description="A narrow column, because the device is narrow" />

Body copy wants 40 to 60 characters per line, and the lower half of that band is normal here. The 65 to 75 everyone quotes was measured on a wide page at desk distance. A phone sits about a foot away with a column a few inches wide, and the return sweep to the next line is short to match.

The usual failure is a paragraph running edge to edge on a large phone held sideways. Cap the column instead.

## <Rule id="type-scaling" severity="p1" evidence="device" description="Render it at maximum before calling it done" />

No other check in this file surfaces as many genuine defects. Turn the text size to the platform's largest accessibility step, walk every screen, and look for:

- a container with a fixed height that its own content has outgrown;
- a control row that needed to become a column and stayed a row;
- text drawn on top of a neighbour instead of displacing it;
- a one-line label now wrapping to two, pushing the primary action under the fold or beneath a fixed bottom bar;
- a string cut into ambiguity: a button reading "Cont..." has lost its meaning, not merely some letters.

Layouts reflow; they do not truncate. A screen that only holds together at 100% has failed exactly the people who moved the setting.

Nor do they shrink the text back. Scaling a label down to fit its box, through `FittedBox`, `minimumScaleFactor`, `adjustsFontSizeToFitWidth`, an auto-size text widget or a size computed from the width, turns the setting off exactly where it was needed, and whatever sits in the same box, an icon button included, shrinks with it under `touch-floor`. It passes a check that only looks for clipping, which is why it is named here. The exception is a single display figure whose size is the layout, a clock or a score on a screen built around it, and it is recorded as that, with every control kept outside the scaled box.

## <Rule id="type-strings" description="The text in the layout is not the text you typed" />

Real strings come from translators, from an API and from users, and they run longer and stranger than the ones in a mockup.

- Size the labels against the longest language the product ships in, not against English. Compounds in German, Finnish and Portuguese set the minimum width.
- Numbers stacked in a column need tabular figures, or the alignment shifts every time a value updates.
- Names, titles and anything user-authored need a line limit and a truncation point chosen per role, settled in the design rather than discovered in production.
- An identifier cut short, a file name, an address, a reference code, a version, a hash, has to be reachable in full on the next surface, and copyable there. The person truncated it to scan a list, not to lose it, and the part that got cut is usually the part that tells two of them apart.
- All caps is for a short label at most. Applied to body text it removes the word shapes people actually read by.

## <Rule id="type-dark" evidence="device" description="Light on dark reads lighter than it measures" />

Pale text on a dark ground bleeds into it, so an identical face at an identical weight looks thinner in dark theme than in light. Low brightness on an OLED panel exaggerates it.

Where a screen carries real reading, compensate in the dark theme only: one step of weight if the face has it, a little more tracking, a little more line height. None of this shows up in the token values, so it gets judged on a rendered screen or not at all.

<Check>

<Verify rule="type-scale">Text styles trace back to the platform scale or to a written-down extension of it, no component carries a literal size, and Android text is in `sp`.</Verify>
<Verify rule="type-roles">The screen works from about four named roles and carries no more than five distinct sizes, and a role that repeats across screens is identical every time.</Verify>
<Verify rule="type-hierarchy">The screen's subject and the start of its content separate at a glance rather than sitting a step apart, the ramp reaches its display end instead of staying in the middle, and a ramp kept compressed names what carries the hierarchy in its place.</Verify>
<Verify rule="type-weight">Nothing below 400, no weight hardcoded outside a theme style, and every weight step jumps a grade. Weight is distributed across the screen, with most text on the regular cut and the heavy cut spent on a few elements, and something on the screen does carry it.</Verify>
<Verify rule="type-face">The typeface choice can be stated as a reason, a brand face stays in the display roles, and any custom face scales.</Verify>
<Verify rule="type-measure">Body copy runs 40 to 60 characters per line.</Verify>
<Verify rule="type-scaling">The screen was rendered at the largest accessibility step, and nothing clips, overlaps or truncates into ambiguity, and no text is scaled back down to fit its box, except a recorded display figure with no control inside its scaled region.</Verify>
<Verify rule="type-strings">The longest localized string fits, numeric columns are tabular, every truncation point was chosen deliberately, and a truncated identifier can be read in full and copied one tap away.</Verify>
<Verify rule="type-dark">Dark theme text was judged on a rendered screen.</Verify>

<Device>`type-scaling` and `type-dark` are answered with a rendered screen or they are not answered at all. Everything else gets a file and a line number.</Device>

</Check>
