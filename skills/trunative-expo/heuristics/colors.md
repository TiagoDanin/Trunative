# Color

On a phone a palette has to survive half brightness in daylight, an OLED panel, whichever theme the system is set to, and a thumb covering part of the screen. Almost everything that breaks it was decided long before any of that got tested.

Colors already written into `DESIGN.md` are settled. This file covers how they are used in code, what to derive for a role the brief left empty, and what to verify before handing the screen back.

When the screen already exists, work out three things before touching a value: which colors someone chose on purpose, which are placeholders nobody ever defended, and whether the request is a color change or an identity change. The last one is an edit to `DESIGN.md` and needs the user, not a quiet rewrite inside a component. A screen built entirely from neutrals with one blue button is usually not restraint: it is hierarchy and state that never got assigned a color.

## `color-roles` Reach color through the role, not the value

Decide what the screen needs a color for before deciding which color: the base surface and the ones raised above it, the text that sits on each of those at both levels of emphasis, the interactive color, focus and selection, dividers and outlines, the four status meanings, and any series or scale the screen plots.

Every stack already names those:

- Material, on Android and in Flutter: `MaterialTheme.colorScheme` and `Theme.of(context).colorScheme`, each foreground taking the `on` role belonging to its background.
- iOS and Cupertino: the semantic system colors, or a catalog color that carries both appearances.
- Mobile web: custom properties resolved under `prefers-color-scheme`.

A hex written straight into a component looks like a shortcut and behaves like a bug. It stays put when the system switches to dark, it ignores Increase Contrast on iOS and high contrast text on Android, and nothing can reach it when the theme is retuned later. Retheming should touch the role table and nothing else.

## `color-derived` The palette that shows up by itself is not a choice

Two of them show up. Indigo through violet under a gradient is the median of everything a model read, Tailwind's default button included. Warm cream with a rust accent is what appears the moment violet is forbidden: take the violet away and it comes back as cream in six screens out of ten, the same reflex in a different coat.

Neither family is banned, and the hex values are not the tell. Cream and rust pulled off film stock, in an app that edits photos, is those two colors doing work. The reflex is the same pair arriving with nothing behind it. What is banned is being unable to say, in terms of this product, why it landed there.

Look at the ground rather than at the accent. The accent is what gets swapped the moment the reflex is named, and the ground is what nobody looks at twice, so it survives the swap and gives the family away. One family is a near neutral ground whose small remaining chroma leans warm, under an almost black ink, and it stays that family whether the accent lands on terracotta, gold, olive or nothing at all. The other is an accent in the blue to violet band, on any ground. Judge the ground by chroma and not by saturation: a warm off-white reports as heavily saturated in HSL and is still an off-white.

Landing in either family is not a violation, it is a prompt to do the work twice. Derive a second full palette from the same reference, in a different key: what the reference looks like at night, in a different material, or lit differently. Put the two side by side and keep the one a stranger could tie back to this product without being told the reference. A reference that only ever yields the palette that was already there was a caption written after the fact, and the second pass is the only thing that tells a caption from a derivation.

- Ground, ink and accent follow from what the app does and who is holding it, which is `PRODUCT.md`. A category habit is not a derivation: finance is not blue, health is not green, fitness is not neon.
- Name the material or the reference the palette comes from, something this product actually evokes: newsprint, film stock, a transit sign, a receipt, a ledger. An adjective is not a reference, so modern, friendly and premium derive nothing. If the palette would fit another app just as well, that is decoration talking.
- Look at the neutrals alone before handing off. Greys that all lean toward the accent were generated from the accent instead of chosen.

## `color-ramp-hsl` Move one axis at a time

Build the ramp in HSL: hold the hue, walk the lightness. Lightness is the axis contrast lives on, so every step becomes something you can defend. Surfaces go up, text and borders go down, and the family stays recognisable because H never moved.

HSL then fails in two places, both of which matter here:

- **Its S number does not measure colorfulness.** `#F4EFE7` reports 37% saturation and is an off-white. Whether a value counts as neutral is a question for chroma in OKLCH or LCH, or for the plain distance between the channels.
- **Holding S while L moves breaks both ends.** Bring saturation down as the steps approach white and black, or the extremes drift out of the family.

Where the stack supports OKLCH, work there: lightness moves without dragging colorfulness along. On Android, hand a seed color to the tonal palette generator instead of picking tones one at a time. Restating a palette that already works in a newer notation is not an improvement.

## `color-one-accent` One color means touchable

An accent works by being scarce. iOS gives the app a single tint and expects everything interactive to wear it; Material puts the action on `primary` and keeps `tertiary` for occasional contrast. Under both, the user learns one color and stops scanning for buttons.

- Spend it on the action. A card border, an illustration or a section heading in the same color costs the user that shortcut.
- When a color has to be loud, give it a whole region or a whole role instead of sprinkling it in six places.
- Secondary text on a colored surface comes from that surface's own hue, or from opacity over it. Grey dropped onto a color reads as a rendering fault.
- Status colors keep their jobs. Error red used for branding spends the one color a user reads without thinking.

## `color-variety` A hue per row is not a palette

Four badges in four pastels, three avatars in three gradients, a tint cycling by position down a list. Nobody can say what the second colour means, because it means that the item is the second one.

- Hue that varies across repeated items encodes a difference the reader can name: the category, the status, the account, the series on the chart. Otherwise every item in the set wears the same surface.
- Where the difference is real, the mapping is fixed and written down once, so the same category is the same colour on every screen it appears on. A colour assigned by index changes the moment the list reorders.
- Generated-per-item colour is legitimate in exactly one place, the avatar fallback, where it is derived from a stable identifier and stands in for a photograph: `icon-avatar`.
- Variety that is genuinely wanted is a job for the artwork, not for the interface. Illustrations carry as many colours as they need; the rows around them do not.

## `color-gradient` A gradient has to be doing a job

Three qualify on mobile:

- a scrim under fixed chrome, so its labels stay legible while content scrolls beneath;
- the platform's own translucent material under sheets and fixed bars, at whatever thickness the OS decides;
- depth, distance or light inside artwork that was actually drawn.

The rest give the screen away: two hues blended in place of a logo, gradient-filled text, a gradient primary button, a gradient app background, a colored glow at zero offset standing in for elevation. A raised surface on Android steps up the tonal scale and takes a shadow where the spec gives it one. On iOS the system material exists for exactly this, and a blur rebuilt by hand renders without the vibrancy pass and ignores Reduce Transparency.

A gradient that stays brings three constraints with it:

- Its contrast is a range, not a number. Measure the worst point along the run, and remember a scrim sits over moving content, so the worst point moves too.
- A long ramp bands on an 8-bit panel, which is what a phone becomes once brightness drops.
- Translucency stacked on translucency leaves the final ratio at the mercy of whatever happens to scroll past. Opaque values can be checked; these cannot.

## `color-dark-composed` Dark is a second design, not a switch

This is the part that gets done last and shows it.

- **The ground is not `#000000`.** Full black flattens every elevation cue and smears while a list scrolls on OLED. Take the platform surface roles, or start at `#121212` and build real steps above it. Full black is the cheapest for battery and the most expensive for structure, so it is a decision per surface, never a starting point.
- **Body text is not `#FFFFFF`.** Around `#E0E0E0`, with secondary a visible step below.
- **Depth arrives as the surface getting lighter,** because a shadow has nothing left to darken once the background is already dark.
- **Accents shed chroma.** A hue tuned against white burns against black. Take the colorfulness down and leave the hue alone.
- **Every pair gets measured again.** Passing in light says nothing about dark.

Light-only ships broken, and the system setting is what the app follows by default.

## `color-contrast` Measure the pair, do not eyeball it

| What | Minimum |
|---|---|
| body text | 4.5:1 |
| text at 18pt+, or 14pt+ bold | 3:1 |
| icons, controls, focus and selection indicators | 3:1 |

These are floors rather than targets because of where phones get used. Sunlight lifts the black point, auto-brightness runs out, and nobody can move the sun. Pale grey on white that reads fine at a desk is gone at a bus stop.

Measure the pressed, selected, disabled and placeholder states as well, plus text sitting over an image, in both themes. The 14pt row is a weight rule as much as a size rule: drop that text to regular and it owes 4.5:1, without a single color having changed.

## `color-not-alone` Color never carries a meaning by itself

Red against green is the pair that fails, and roughly one man in twelve sees them differently. Grayscale and wind-down modes take hue away from everyone else, and glare eats hue before it eats lightness.

So every status, state and series gets a second carrier: an icon, a word, a shape, a position, or a lightness gap wide enough to survive desaturation. Run a protanopia, deuteranopia and tritanopia pass over the rendered screen. The pairs that collapse are rarely the ones the token names predicted.

## `color-dynamic` Dynamic Color, where the platform hands it over

On Android 12 and up, Material You builds the scheme from the user's wallpaper. Take it where it fits, keep a static scheme for older releases and for users who turn it off, and open the app under a few wallpapers to see whether it still reads as this product. A brand that only exists at its own hex value does not survive the feature.

## Check

Review answers each of these against the code, pointing at the line:

- No component holds a raw hex, and every color arrives through a token or a platform role. `color-roles`
- The palette is derived from a named material or reference this product evokes, the same screen in a competitor's app would need a different one, and the neutral ramp is not tinted toward the accent. A palette in either family carries the second derivation it was compared against and the reason this one survived. `color-derived`
- Ramp steps hold the hue and shed saturation toward both ends. `color-ramp-hsl`
- The accent marks what is interactive and nothing else, and no grey sits on a colored surface. `color-one-accent`
- Hue that varies across repeated items encodes a difference the reader can name, the mapping is fixed rather than positional, and nothing carries a tint picked for variety. `color-variety`
- Every gradient does work flat color cannot: no gradient-filled text, no gradient primary button, no gradient app background, and no colored glow at zero offset standing in for elevation. `color-gradient`
- Dark has its own ground, its own accent values and its own measurements, and the ground is not full black. `color-dark-composed`
- Contrast is calculated for every pair, including pressed, disabled and text over images, in both themes. `color-contrast`
- Nothing is communicated by color alone. `color-not-alone`
- Where Dynamic Color applies there is a static fallback, and the product still reads as itself under a wallpaper-derived scheme. `color-dynamic`

Check the last four on a rendered screen in both appearances rather than in the token table. Overlays, translucent material and anything painted over the background all land after the tokens, so the token table is the one place a light theme can look fine while dark quietly fails.
