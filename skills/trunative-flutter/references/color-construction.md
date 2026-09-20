# Color construction

How a palette is built once the reference is chosen. `color-derived` decides where the colors come from and `color-assigned` decides what they are spent on; this is the arithmetic in between, and it is arithmetic rather than taste. Open it when a palette is being written for the first time, or when one on screen reads washed out, two-toned or muddy and nobody can say why.

Work in OKLCH, or in LCH where OKLCH is unavailable. The reason is not novelty: in HSL a change to L drags apparent colorfulness with it, and S reports a warm off-white as heavily saturated, so neither number can be used as a test. In OKLCH, L is perceived lightness and C is perceived colorfulness, and both can be stated as a target somebody else can check.

## The numbers a palette answers to

| Role | Lightness (OKLCH L) | Chroma (OKLCH C) | What the number is for |
|---|---|---|---|
| ground | the end the reference dictates, light around 0.95 to 0.98, dark around 0.15 to 0.22 | 0.004 to 0.02 | A tinted neutral. Above about 0.03 it stops being a ground and starts being a pale version of the accent, which is the pastel screen. |
| surface | one step toward the ink from ground, about 0.03 to 0.05 of L | same as ground | Depth by lightness step, which is also what survives dark (`color-dark-composed`). |
| ink | far from ground, at least 0.6 of L between them | 0.01 to 0.04 | Near black or near white, carrying the ground's hue rather than a pure neutral. |
| accent | wherever contrast puts it against its own ground | **0.10 or more** | Below about 0.06 an accent reads as a grey that happens to be slightly coloured, and the screen reads as uncoloured. This is the single number most often missing. |
| status | set by contrast | 0.10 or more | Same floor. A muted danger colour is not restraint, it is a warning nobody sees. |

Numbers are a starting band, not a spec. What matters is that the palette states its own and can be checked against them.

## Relating the hues

The accent hue comes from the reference. Every other hue on the screen stands in a stated relationship to it, and the relationship is named in `DESIGN.md` rather than arrived at:

- **Analogous**, within about 30 degrees. Quiet, and it risks a screen where the accent and the status colors blur into one another.
- **Complementary**, about 180 degrees away. One supporting hue, maximum separation, and it is the relationship that most often produces a second colour worth having.
- **Split complementary**, about 150 and 210 degrees. Two supporting hues that stay apart from each other as well as from the accent.
- **Triadic**, about 120 degrees apart. Three hues that hold their own, which suits a product that genuinely has three coordinate things to name and nothing else.

Two rules of separation hold whatever the scheme:

- Any two hues a reader has to tell apart sit at least 30 degrees apart, and 60 is comfortable. Under 30 they read as the same colour rendered twice.
- Status colours keep their conventional hue bands and are not borrowed for the accent. Where the accent lands within 30 degrees of a status hue, the accent moves, because the status meaning is the one that cannot be relearned.

## Per item color

Where a set of items each carry their own hue (`color-variety` names when that is legitimate), space them around the wheel rather than picking them one at a time: for n items, step 360/n degrees from the accent, then pull each to a common lightness and chroma so no single item shouts. Hand-picked per-item colours drift in lightness, and the brightest one reads as the important one whether or not it is.

## Checking it

- Convert every pair that carries meaning and run the contrast floors in `color-contrast`.
- Render the screen in greyscale: what stops being distinguishable is what colour was carrying, which is `color-assigned`.
- Render it under protanopia, deuteranopia and tritanopia: pairs that collapse are `color-not-alone`.
- Look at the neutral ramp alone. If the greys lean toward the accent by more than the ground's own chroma, they were generated from the accent instead of chosen.
