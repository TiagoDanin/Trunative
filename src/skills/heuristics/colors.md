# Color

On a phone a palette has to survive half brightness in daylight, an OLED panel, whichever theme the system is set to, and a thumb covering part of the screen. Almost everything that breaks it was decided long before any of that got tested.

Colors already written into `DESIGN.md` are settled. This file covers how they are used in code, what to derive for a role the brief left empty, and what to verify before handing the screen back.

When the screen already exists, work out three things before touching a value: which colors someone chose on purpose, which are placeholders nobody ever defended, and whether the request is a color change or an identity change. The last one is an edit to `DESIGN.md` and needs the user, not a quiet rewrite inside a component. A screen built entirely from neutrals with one blue button is usually not restraint: it is hierarchy and state that never got assigned a color, which is `color-assigned`.

## <Rule id="color-roles" description="Reach color through the role, not the value" />

Decide what the screen needs a color for before deciding which color: the base surface and the ones raised above it, the text that sits on each of those at both levels of emphasis, the interactive color, focus and selection, dividers and outlines, the four status meanings, and any series or scale the screen plots.

Every stack already names those:

- Material, on Android and in Flutter: `MaterialTheme.colorScheme` and `Theme.of(context).colorScheme`, each foreground taking the `on` role belonging to its background.
- iOS and Cupertino: the semantic system colors, or a catalog color that carries both appearances.
- Mobile web: custom properties resolved under `prefers-color-scheme`.

A hex written straight into a component looks like a shortcut and behaves like a bug. It stays put when the system switches to dark, it ignores Increase Contrast on iOS and high contrast text on Android, and nothing can reach it when the theme is retuned later. Retheming should touch the role table and nothing else.

## <Rule id="color-derived" description="The palette that shows up by itself is not a choice" />

Two of them show up. Indigo through violet under a gradient is the median of everything a model read, Tailwind's default button included. Warm cream with a rust accent is what appears the moment violet is forbidden: take the violet away and it comes back as cream in six screens out of ten, the same reflex in a different coat. Neither reflex is free-floating: violet echoes a decade of default component libraries, and warm rust on an off white ground echoes a real shipped assistant identity, so a model trained on the whole internet has read both defaults many times before it ever reads this file.

Neither family is banned, and the hex values are not the tell. Cream and rust pulled off film stock, in an app that edits photos, is those two colors doing work. The reflex is the same pair arriving with nothing behind it. What is banned is being unable to say, in terms of this product, why it landed there.

A chart pairing blue with trust and red with urgency is not a derivation either, and citing one is no different from citing an adjective: the pairing is repeated at the same rate whether or not it holds outside the deck it was printed in, and it moves by market and by culture in exactly the way a real derivation should not. The one part of that literature worth keeping is not a color's mood, it is distance from the category: a color the two or three closest competitors do not already occupy earns more than a color chosen for what it supposedly feels like. That is a sharper version of the category-habit line below, not a separate excuse to reach for a mood board instead of a reference.

Look at the ground rather than at the accent. The accent is what gets swapped the moment the reflex is named, and the ground is what nobody looks at twice, so it survives the swap and gives the family away. One family is a near neutral ground whose small remaining chroma leans warm, under an almost black ink, and it stays that family whether the accent lands on terracotta, gold, olive or nothing at all. The other is an accent in the blue to violet band, on any ground. Judge the ground by chroma and not by saturation: a warm off-white reports as heavily saturated in HSL and is still an off-white. Quote the number when the verdict is written, because a family is something a palette measurably is rather than something its author reports feeling. The verdict that names no chroma is the one that finds its own candidate outside both families while shipping the ground of one, and it costs nothing to make: landing in a family is allowed and only ever asked for a reason, so the answer worth distrusting is the one that avoids owing it.

Those two are instances and not the whole of it. What they have in common is the general case: a ground within a step or two of white, an ink near black, and one accent desaturated far enough that it would be acceptable in any other product. That combination is where a palette lands when the reference is consulted and then quietly overruled, and it passes a check written against the two families above because it is not quite either of them. Independent derivations that produce five different references and five interchangeable screens have not escaped the reflex, they have captioned it five times.

The check that catches it is the material. A reference is a thing with a lightness of its own: a printed slip is pale, a departure board is dark, cut rubber is nearly black, enamel is saturated. The ground takes that lightness rather than converting it. When the named reference is dark and the screen is light, or the reference is vivid and the screen is muted, the reference was decoration and the ground came from somewhere else, which is the reflex arriving under a name. Say what the material's own ground is, and where the screen's differs from it, say why in terms the material supports.

Landing in either family is not a violation, it is a prompt to do the work twice. Derive a second full palette from the same reference, in a different key: what the reference looks like at night, in a different material, or lit differently. Put the two side by side and keep the one a stranger could tie back to this product without being told the reference. A reference that only ever yields the palette that was already there was a caption written after the fact, and the second pass is the only thing that tells a caption from a derivation. Record the comparison as one line per candidate, reference named, family it lands in, kept or not, and the reason: a table for review, not an essay for a reader, and the same fact either way.

That check runs once, on whichever appearance gets designed first, and it has to run again on the other rather than being inherited for free. A light palette built by holding the dark palette's hue and shedding chroma for contrast lands on exactly the two axes a reflex family is judged on, ground lightness and accent hue, so it can drift back into cream and rust on its own even when the dark original earned its way out of it. `color-dark-composed` already treats dark as a second design rather than a switch; the same holds from dark to light.

- Ground, ink and accent follow from what the app does and who is holding it, which is `PRODUCT.md`. A category habit is not a derivation: finance is not blue, health is not green, fitness is not neon.
- Generate three candidate references before judging any of them, each from a different source: one from what the product's job actually involves handling, the object, the document or the surface it puts in front of someone; one from where it gets used, the room, the light, the material underfoot; one from what it replaces or descends from, the paper form, the printed ticket, the physical dial it moved off of. Three sources is what stops the first idea being the only one considered, the same reason a wireframe's shape gets picked from more than one candidate. Pick the one that could not be swapped for another app's without also swapping what it evokes. An adjective survives that swap every time, so modern, friendly and premium derive nothing.
- Look at the neutrals alone before handing off. Greys that all lean toward the accent were generated from the accent instead of chosen.

## <Rule id="color-constructed" description="A palette is built, not collected" />

Naming a reference settles where the colours come from. It does not produce them, and a reference read straight off into hex values, one at a time, by eye, is how five products derived from five different references arrive at the same screen: a ground a step from white, an ink near black, one accent muted enough to be inoffensive anywhere. Every value below is a number somebody can check, and the construction is in `references/color-construction.md`.

- **Chroma is the tell, and the accent is where it is missing.** An accent under roughly 0.06 chroma in OKLCH is a grey that happens to lean, and a screen built on one reads as uncoloured no matter how many roles were assigned. Ground and surface hold chroma low by design, around 0.02 and under; above about 0.03 a ground has become a pale wash of the accent, which is the pastel screen nobody chose.
- **Every hue after the first stands in a stated relationship to it**, analogous, complementary, split complementary or triadic, written down as that word. Two hues a reader must tell apart sit at least 30 degrees from each other. A second colour that arrived because the screen needed one is the reflex under another name.
- **Status hues keep their band and the accent moves.** Where an accent lands within 30 degrees of a status meaning, the accent is the one that changes, because a user can be taught a brand colour and cannot be taught that this red means something else.
- **The neutral ramp holds one hue and walks lightness** (`color-ramp-hsl`), and it is checked on its own: greys leaning toward the accent by more than the ground's own chroma were generated from the accent rather than chosen.

A palette that cannot state these numbers has not been constructed, it has been collected, and a collection is what the reflex looks like once it has a reference attached.

## <Rule id="color-ramp-hsl" severity="p3" description="Move one axis at a time" />

Build the ramp in HSL: hold the hue, walk the lightness. Lightness is the axis contrast lives on, so every step becomes something you can defend. Surfaces go up, text and borders go down, and the family stays recognisable because H never moved.

HSL then fails in two places, both of which matter here:

- **Its S number does not measure colorfulness.** `#F4EFE7` reports 37% saturation and is an off-white. Whether a value counts as neutral is a question for chroma in OKLCH or LCH, or for the plain distance between the channels.
- **Holding S while L moves breaks both ends.** Bring saturation down as the steps approach white and black, or the extremes drift out of the family.

Where the stack supports OKLCH, work there: lightness moves without dragging colorfulness along. On Android, hand a seed color to the tonal palette generator instead of picking tones one at a time. Restating a palette that already works in a newer notation is not an improvement.

## <Rule id="color-one-accent" description="One color means touchable" />

An accent works by being scarce. iOS gives the app a single tint and expects everything interactive to wear it; Material puts the action on `primary` and keeps `tertiary` for occasional contrast. Under both, the user learns one color and stops scanning for buttons.

- Spend it on the action. A card border, an illustration or a section heading in the same color costs the user that shortcut.
- When a color has to be loud, give it a whole region or a whole role instead of sprinkling it in six places.
- Secondary text on a colored surface comes from that surface's own hue, or from opacity over it. Grey dropped onto a color reads as a rendering fault.
- Status colors keep their jobs. Error red used for branding spends the one color a user reads without thinking.

**Default.** One accent, spent on what can be touched.
**Exception.** A product whose content is colour coded by the person or by the domain: calendars the person coloured themselves, transit lines that have had their colours for decades, categories the person assigned. That colour is data, it sits on the content and never on a control, and the accent stays the only colour meaning "touch here". How a hue per item stays a palette is `color-variety`.
**Reason required.** Where the colours come from, and that none of them is the accent or a status colour.

## <Rule id="color-assigned" description="Restraint and absence are not the same screen" />

`color-one-accent` rations the accent. It does not say the rest of the screen goes uncoloured, and applied on its own it produces exactly the screen this rule is about: four greys, one tinted button, and nothing else on the page carrying a hue at all. Every other rule in this file is a ceiling. Without a floor beside them, the palette that satisfies all of them perfectly is no palette.

Work out what on this screen carries a state and assign that state a colour: what is selected, what is active, what is finished, what failed, what is overdue, which surface sits above which. Those assignments are what a screen is read by at arm's length, and they come before anything anybody would call decoration.

- The test is subtraction. Render the screen in greyscale and name what a reader can no longer tell apart. Nothing lost means no colour was doing anything, and what shipped is a wireframe with a tint on the primary button.
- Losing something in greyscale is not a breach of `color-not-alone`, which asks for a second carrier and never for no colour. The two hold together: the state is coloured, and the icon, the word or the position beside it says the same thing again.
- Neutrals are an assignment too. A ground, a raised surface and a line taken as three steps of one ramp is a surface system. The same three left at whatever the framework hands over is the absence of one, and it is the most common form of this defect, because nothing about it looks wrong.
- A screen that genuinely wants one accent and nothing else exists, and it says which states it has and what carries each of them instead, in weight, size or position. Unwritten, the answer is that nobody assigned them.

## <Rule id="color-variety" description="A hue per row is not a palette" />

Four badges in four pastels, three avatars in three gradients, a tint cycling by position down a list. Nobody can say what the second colour means, because it means that the item is the second one.

- Hue that varies across repeated items encodes a difference the reader can name: the category, the status, the account, the series on the chart. Otherwise every item in the set wears the same surface.
- Where the difference is real, the mapping is fixed and written down once, so the same category is the same colour on every screen it appears on. A colour assigned by index changes the moment the list reorders.
- Generated-per-item colour is legitimate in exactly one place, the avatar fallback for a person or an account, where it is derived from a stable identifier and stands in for a photograph: `icon-avatar`. Artwork carrying a subject of its own never reaches that exception, and a row of filled rectangles tinted one hue each is the defect this rule is about wearing a fallback's clothes. What belongs there is the picture, which is `icon-depicts`.
- Variety that is genuinely wanted is a job for the artwork, not for the interface. Illustrations carry as many colours as they need; the rows around them do not.

## <Rule id="color-gradient" description="A gradient has to be doing a job" />

Three qualify on mobile:

- a scrim under fixed chrome, so its labels stay legible while content scrolls beneath;
- the platform's own translucent material under sheets and fixed bars, at whatever thickness the OS decides;
- depth, distance or light inside artwork that was actually drawn.

The rest give the screen away: two hues blended in place of a logo, gradient-filled text, a gradient primary button, a gradient app background, a colored glow at zero offset standing in for elevation. A raised surface on Android steps up the tonal scale and takes a shadow where the spec gives it one. On iOS the system material exists for exactly this, and a blur rebuilt by hand renders without the vibrancy pass and ignores Reduce Transparency.

A gradient that stays brings three constraints with it:

- Its contrast is a range, not a number. Measure the worst point along the run, and remember a scrim sits over moving content, so the worst point moves too.
- A long ramp bands on an 8-bit panel, which is what a phone becomes once brightness drops.
- Translucency stacked on translucency leaves the final ratio at the mercy of whatever happens to scroll past. Opaque values can be checked; these cannot.

## <Rule id="color-dark-composed" severity="p1" evidence="device" description="Dark is a second design, not a switch" />

This is the part that gets done last and shows it.

- **The ground is not `#000000`.** Full black flattens every elevation cue and smears while a list scrolls on OLED. Take the platform surface roles, or start at `#121212` and build real steps above it. Full black is the cheapest for battery and the most expensive for structure, so it is a decision per surface, never a starting point.
- **Body text is not `#FFFFFF`.** Around `#E0E0E0`, with secondary a visible step below.
- **Depth arrives as the surface getting lighter,** because a shadow has nothing left to darken once the background is already dark.
- **Accents shed chroma.** A hue tuned against white burns against black. Take the colorfulness down and leave the hue alone.
- **Every pair gets measured again.** Passing in light says nothing about dark.
- **Neither appearance inherits the other's derivation.** `color-derived`'s reflex check runs again here, on whichever appearance was built from the other: shedding chroma from a hue that already escaped the reflex can still land that appearance back inside it.

Light-only ships broken, and the system setting is what the app follows by default.

## <Rule id="color-contrast" severity="p1" evidence="device" description="Measure the pair, do not eyeball it" />

| What | Minimum |
|---|---|
| body text | 4.5:1 |
| text at 18pt+, or 14pt+ bold | 3:1 |
| icons, controls, focus and selection indicators | 3:1 |

These are floors rather than targets because of where phones get used. Sunlight lifts the black point, auto-brightness runs out, and nobody can move the sun. Pale grey on white that reads fine at a desk is gone at a bus stop.

Measure the pressed, selected, disabled and placeholder states as well, plus text sitting over an image, in both themes. The 14pt row is a weight rule as much as a size rule: drop that text to regular and it owes 4.5:1, without a single color having changed.

## <Rule id="color-not-alone" severity="p1" evidence="device" description="Color never carries a meaning by itself" />

Red against green is the pair that fails, and roughly one man in twelve sees them differently. Grayscale and wind-down modes take hue away from everyone else, and glare eats hue before it eats lightness.

So every status, state and series gets a second carrier: an icon, a word, a shape, a position, or a lightness gap wide enough to survive desaturation. Run a protanopia, deuteranopia and tritanopia pass over the rendered screen. The pairs that collapse are rarely the ones the token names predicted.

## <Rule id="color-dynamic" evidence="device" description="Dynamic Color, where the platform hands it over" />

On Android 12 and up, Material You builds the scheme from the user's wallpaper. Take it where it fits, keep a static scheme for older releases and for users who turn it off, and open the app under a few wallpapers to see whether it still reads as this product. A brand that only exists at its own hex value does not survive the feature.

<Check>

<Verify rule="color-roles">No component holds a raw hex, and every color arrives through a token or a platform role.</Verify>
<Verify rule="color-derived">The palette is derived from a named material or reference this product evokes, chosen among three candidates from three different sources rather than the first one considered, never from a color-emotion pairing or a category habit, and the same screen in a competitor's app would need a different one. The neutral ramp is not tinted toward the accent. A palette in either reflex family carries the second derivation it was compared against, recorded as a short table, and the reason this one survived, checked separately for whichever appearance was built from the other. Each family verdict quotes the ground's chroma and the ink's lightness rather than asserting a family from impression.</Verify>
<Verify rule="color-constructed">The palette states the lightness and chroma of each role, the accent carries at least about 0.10 chroma in OKLCH and never under 0.06, ground and surface stay under about 0.03, every hue past the first names its relationship to the accent, no two hues a reader must separate sit within 30 degrees, and the neutral ramp does not lean toward the accent.</Verify>
<Verify rule="color-ramp-hsl">Ramp steps hold the hue and shed saturation toward both ends.</Verify>
<Verify rule="color-one-accent">The accent marks what is interactive and nothing else, and no grey sits on a colored surface.</Verify>
<Verify rule="color-assigned">Colour is assigned to the screen's states and surfaces rather than to the primary action alone, the neutral steps were chosen rather than inherited, and rendering the screen in greyscale loses something a reader can name.</Verify>
<Verify rule="color-variety">Hue that varies across repeated items encodes a difference the reader can name, the mapping is fixed rather than positional, and nothing carries a tint picked for variety.</Verify>
<Verify rule="color-gradient">Every gradient does work flat color cannot: no gradient-filled text, no gradient primary button, no gradient app background, and no colored glow at zero offset standing in for elevation.</Verify>
<Verify rule="color-dark-composed">Dark has its own ground, its own accent values and its own measurements, and the ground is not full black. Whichever appearance was built from the other was checked against `color-derived`'s reflex families on its own, not assumed clean because the first one was.</Verify>
<Verify rule="color-contrast">Contrast is calculated for every pair, including pressed, disabled and text over images, in both themes.</Verify>
<Verify rule="color-not-alone">Nothing is communicated by color alone.</Verify>
<Verify rule="color-dynamic">Where Dynamic Color applies there is a static fallback, and the product still reads as itself under a wallpaper-derived scheme.</Verify>

<Device>Check the last four on a rendered screen in both appearances rather than in the token table. Overlays, translucent material and anything painted over the background all land after the tokens, so the token table is the one place a light theme can look fine while dark quietly fails.</Device>

</Check>
