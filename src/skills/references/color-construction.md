# Color construction

How a palette is built once the reference is chosen. The output is vivid: one saturated hue on a clean ground (`color-vivid`), never a set of muted ones. `color-derived` decides where the colors come from and `color-assigned` decides what they are spent on; this is the arithmetic in between, and it is arithmetic rather than taste. Open it when a palette is being written for the first time, or when one on screen reads washed out, two-toned or muddy and nobody can say why.

Work in OKLCH, or in LCH where OKLCH is unavailable. The reason is not novelty: in HSL a change to L drags apparent colorfulness with it, and S reports a warm off-white as heavily saturated, so neither number can be used as a test. In OKLCH, L is perceived lightness and C is perceived colorfulness, and both can be stated as a target somebody else can check.

## The numbers a palette answers to

| Role | Lightness (OKLCH L) | Chroma (OKLCH C) | What the number is for |
|---|---|---|---|
| ground | light 0.97 to 1.0, dark 0.13 to 0.20 | 0 to 0.01 in light, up to 0.02 in dark | A clean neutral. White is a fine ground. Above about 0.01 in light it turns cream, beige or a tinted grey, which is the muted screen `color-vivid` rejects. |
| surface | light: one step from ground, about 0.02 to 0.04 of L, either white raised on a near-white ground or a near-white raised on white; dark: lighter than ground by 0.04 to 0.08 | same as ground | Depth by lightness step, which is also what survives dark (`color-dark-composed`). |
| ink | far from ground, at least 0.6 of L between them | 0 to 0.03 | Near black or near white. |
| accent | light theme 0.45 to 0.75, set by contrast | **0.15 or more, usually 0.18 to 0.26**; teal and cyan, which sRGB caps near 0.12 to 0.14, take the gamut's maximum at that lightness | The brand. Duolingo's green, Nubank's purple, Netflix's red and Google's blue all sit in this band. Under 0.12 it reads as dusty, under 0.06 as grey. Dark theme: about a tenth to a fifth less chroma, never under 0.13. |
| accent, deep tone | about 0.15 to 0.25 lower than the accent | same hue, as much chroma as sRGB allows there | Only for a light accent (lime, yellow, cyan): text, icons and outlines on a light ground, where the bright tone cannot reach contrast. Exempt from the 0.15 floor, which the gamut does not reach at this lightness. |
| status | set by contrast | 0.15 or more for fills and icons | A muted danger colour is not restraint, it is a warning nobody sees. A status tone darkened to carry text at 4.5:1 keeps its hue and takes what chroma the gamut allows. |
| brand region in dark | about 0.40 to 0.55 | 0.09 to 0.13 | A header band or hero filled with the brand in dark, for mid and dark hues (blue, violet, red, green). Large saturated areas burn on black, so the region sits under the accent's floor while buttons keep it. Light hues (yellow, lime, amber, orange) stay bright with a dark label instead, since lowering them gives olive or brown. |

Status hue bands, as OKLCH hue: danger 15 to 40, warning 60 to 95, success 130 to 165, information 225 to 265.

Numbers are a starting band, not a spec. What matters is that the palette states its own and can be checked against them.

## Relating the hues

The accent hue comes from the reference. Every other hue on the screen stands in a stated relationship to it, and the relationship is named in `DESIGN.md` rather than arrived at:

- **Analogous**, within about 30 degrees. Quiet, and it risks a screen where the accent and the status colors blur into one another.
- **Complementary**, about 180 degrees away. One supporting hue, maximum separation, and it is the relationship that most often produces a second colour worth having.
- **Split complementary**, about 150 and 210 degrees. Two supporting hues that stay apart from each other as well as from the accent.
- **Triadic**, about 120 degrees apart. Three hues that hold their own, which suits a product that genuinely has three coordinate things to name and nothing else.

Two rules of separation hold whatever the scheme:

- Any two hues a reader has to tell apart sit at least 30 degrees apart, and 60 is comfortable. Under 30 they read as the same colour rendered twice.
- Status colours keep the hue bands above. Distance is measured to the status colour actually in use, and a status the product never shows reserves nothing. A brand may share a band, red brands with a red error, green brands with a green success, when the status keeps its icon, its word and its own surface treatment and the brand never fills an alert; where the two would still be confused, the accent moves 30 degrees from the status colour.

## Per item color

Where a set of items each carry their own hue (`color-variety` names when that is legitimate), space them around the wheel rather than picking them one at a time: for n items, step 360/n degrees from the accent, then pull each to a common lightness and chroma so no single item shouts. Hand-picked per-item colours drift in lightness, and the brightest one reads as the important one whether or not it is.

## Checking it

- Convert every pair that carries meaning and run the contrast floors in `color-contrast`.
- Render the screen in greyscale: what stops being distinguishable is what colour was carrying, which is `color-assigned`.
- Render it under protanopia, deuteranopia and tritanopia: pairs that collapse are `color-not-alone`.
- Look at the neutral ramp alone. If the greys lean toward the accent by more than the ground's own chroma, they were generated from the accent instead of chosen.
