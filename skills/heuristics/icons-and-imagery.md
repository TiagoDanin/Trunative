# Icons and imagery

On a phone the icon is frequently the whole control. A glyph in a tab bar or a toolbar, beside a label that had to be shortened or was never written, is what the user aims a thumb at. And a picture reaches the screen late, over a cellular link, into a column exactly one image wide, so the space it will occupy has to exist before it does.

Both fail the same way: the set was assembled rather than chosen, and the box was sized by the bytes rather than by the layout.

Sizes, axis ranges, density buckets and asset paths are in `references/icon-and-image-assets.md`. This file is the rules.

## <Rule id="icon-one-set" description="An icon set is a set, not a collection" />

One set for the whole app, at one weight and one style. Two sets on one screen is the defect that reads from across the room: it takes no interaction to find and no expertise to name, and it is what a screen assembled out of search results looks like.

- Take the platform's set unless something rules it out. It arrives already matched to the system font, ready to scale with the text setting once it is configured to, and already carrying the variants the platform's own bars expect.
- A custom set is a decision rather than a leftover: one grid, one stroke width, one corner treatment, one perspective, and enough detail removed that the glyph survives at the size it is actually drawn. A custom symbol on iOS has to match the system ones in detail, optical weight, alignment and perspective, or it reads as borrowed.
- The selected state comes from the set's own fill, the `FILL` axis or the filled variant, not from a second file drawn by hand. On iOS the system updates that appearance itself inside standard bars and buttons. On Android and in Flutter the bar takes the state from you, so the selected destination is handed the filled variant explicitly. That the selection then reads without depending on colour is `button-tabs`.
- Directional glyphs turn around in a right-to-left language and a few of them must not. Which is which is `l10n-no-mirror`.
- Icons live in the theme, reached by name, so the whole set can be swapped at once. Twenty asset paths typed at twenty call sites is twenty places the next set will not reach.
- Count the icon dependencies. The answer is one, or one plus a stated reason.

## <Rule id="icon-weight" evidence="device" description="The icon is sized against the label, not against the box" />

An icon next to text is part of that line, and every property it has is borrowed from the text.

- Match the weight. An icon heavier than its label turns the picture into the heading, and the platform sets exist to make this exact: the symbol weights map one to one onto the font weights.
- On iOS, align on the text baseline rather than on the centre of the line box: every system symbol carries baseline information and `firstTextBaseline` uses it. Centre alignment is what makes an icon look like it is floating a pixel high. A Compose or Flutter `Icon` publishes no baseline for a parent to align to, so there the icon is centred against the line box and the residue is corrected by eye.
- Where the set is a variable font with an optical size axis, set that axis alongside the size, because the two do not track: Flutter pairs a default size of 24 with a default optical size of 48, so a project that has brought in Material Symbols draws a 24dp glyph at the stroke meant for a 48dp one until it sets `opticalSize`. SF Symbols answers the same need with scale, and a Compose `Icon` drawing a vector has no such axis at all.
- An icon that labels text grows with the user's text setting. Flutter's `applyTextScaling` is off until it is turned on, in the widget or the `IconTheme`.
- Asymmetric glyphs need optical centring, and the offset belongs inside the asset as padding, so that centring the box centres the picture. The correction is small and it is the difference between a toolbar that looks drawn and one that looks placed.
- Light artwork on a dark ground blooms. Where the set has a grade axis, take it down rather than dropping a weight.

An icon rarely carries a verb on its own, so what is written next to it is `button-label` and what is spoken instead of it is `a11y-name`. Meaningful icons owe the same contrast as any other non-text mark: `color-contrast`. And the glyph is only the drawing: the target around it is a separate object with its own floor, which is `touch-floor`.

## <Rule id="icon-no-emoji" description="An emoji is content, never an icon" />

Emoji inside a message, a reaction, or a name somebody typed is content and stays. Emoji standing in for an icon is the most reliable tell of a generated screen, and it is not a shortcut, because none of the four things an icon does survives it.

- It is drawn by the system emoji font, which is a different picture on each platform and each release. The glyph that shipped is not the glyph that appears.
- It ignores tint, weight and text style, so it can neither match the label beside it nor follow the theme, and it stays in colour inside a monochrome bar.
- Its reading is cultural and its variants carry skin tone and gender, so it does not translate and it cannot be reviewed by the person translating it.
- A screen reader speaks its catalogue name, so a control announces a picture instead of an action.

The same applies to a glyph pulled out of a typeface drawn for prose. A check mark, an arrow or a bullet borrowed from the body face is the emoji defect in a quieter coat. An icon font that ships as an icon set is the opposite case and is exactly what to use.

## <Rule id="icon-vector" description="Vector where the artwork allows, densities where it does not" />

- Flat artwork, meaning icons, marks, line illustrations and anything built from paths, ships as vector. One file covers every density and every size, and nothing has to be regenerated when a size changes.
- A tintable vector is authored in one solid colour so the theme's tint lands on it cleanly. An icon with its colours baked in cannot follow a role and cannot follow dark.
- Photographs stay raster. A raster used as an interface asset is authored at every density the platform asks for, which is not the same as carrying all of them in the binary: what each device downloads is `perf-size`. Authored at one density only, it is soft on a 3x screen or lands more decoded pixels in the box than the box has, which is `perf-decode`.
- Vector is not free at every size: a large or heavily pathed drawable costs more to draw than the bitmap it replaced, which is why Android recommends keeping an in-app vector drawable at 200 by 200 dp or under. iOS publishes no equivalent limit. The launch surface icon is outside that ceiling: it is a vector at the size the platform fixes for it, which is `splash-contents`.

## <Rule id="icon-reserve" description="The box exists before the bytes do" />

Every image whose source is a URL gets its dimensions from the layout, decided before the request is made, and those dimensions are also what it decodes to: `perf-decode`. Row images are `list-images`; this is everything else, the header, the hero, the card, the article body, the avatar.

- The box is the row rule applied off the list: `list-images`. What stands in it while the bytes are in flight is `state-loading`.
- Nothing below the image moves when it lands. In one column that reflow is the rest of the screen, under a thumb already on its way down.
- Some stacks give a bundled image its size and give a remote one nothing. In React Native a `uri` source has no intrinsic dimensions, so it needs an explicit width and height, and the fast link on the development machine hides what a slow one does.
- The image that never arrives is a designed state at the same dimensions, not a gap: `state-error`.

## <Rule id="icon-crop" description="The surface decides the ratio, the photo does not" />

Fix one aspect ratio per surface, once, then crop everything entering it to fill. A surface may instead offer a short fixed list of ratios and let each item pick from it, which is how a feed of user photographs works. What it may not do is take an arbitrary ratio out of the bytes, because in one column the shape of the image is the shape of the screen, and that hands the layout to whatever the last user uploaded.

- Fill and clip. Letterboxing puts bars inside the content, and stretching to fit is a defect users see and cannot name.
- Decide what a portrait photo loses inside a landscape frame before one arrives. A centre crop keeps the middle, and faces, text and the subject of the shot are frequently not in the middle.
- Fit-inside is right where the whole image is the point: a logo, a scanned document, a diagram. There the frame keeps its own background instead of leaving transparent bars.
- Where a crop is destructive to the user's own content, the frame is a preview and the full image is one tap away.

## <Rule id="icon-alt" description="A picture is content or it is decoration, and it says which" />

Content describes what it shows. Decoration is hidden instead of described, which is `a11y-hidden`. Nothing sits between the two, both answers compile, and a screen where every image says nothing looks identical to one where every image is right.

- The description is what the picture shows, not what the file is: `contentDescription`, `accessibilityLabel`, `semanticLabel`. In one column the picture is frequently the whole payload of the screen, so for a user who is not seeing it that sentence is the screen.
- Two descriptions pass every automated check and carry nothing: the file name, and the word image, photo or icon.
- A chart, a diagram, or the illustration holding an empty state's meaning owes the sentence it is making rather than an inventory of its parts.
- An icon that is the only label on a control is not this rule. What is spoken there is the action, which is `a11y-name`.

## <Rule id="icon-dark" evidence="device" description="Artwork that cannot be tinted needs a second asset" />

A single-colour glyph needs no dark variant, because it is tinted from a theme role and follows it. Everything else does.

- Illustrations, marketing art, logo lockups and anything with colour baked in ship a light file and a dark file, selected through the asset system rather than by a conditional written inside a component.
- The asset carrying its own opaque background is the one to hunt for. A white-backed PNG on a dark surface is a white rectangle, and it survives review because review happens in light.
- An inverted copy is not a dark variant. Inverting artwork shifts every hue in it, and inverting a photograph is simply wrong: `color-dark-composed`.
- Screenshots of the product inside the product are recaptured in dark, or they are not shown in dark.

## <Rule id="icon-avatar" evidence="device" description="The fallback is the common case" />

Most accounts have no photo, so the fallback is the state to design first and the one that will be on screen most.

- Initials from the name, or a shape generated from a stable identifier, so the same person keeps the same avatar between sessions and between devices. One shared silhouette for every user is decoration, and a list of them carries no information at all.
- The fallback fills the same box the photo would, so a list of people keeps its rhythm while photos load.
- Never a broken image frame, an alt-text box, or the platform's missing-asset glyph. At the size an avatar is actually drawn that is a dark square with a question mark in it, repeated down the list.
- Initials come from the display name as the locale orders it, one or two characters, and they are measured against their generated background like any other text: `l10n-personal`, `color-contrast`.
- The missing name is a case too. Deleted accounts, invited users who never joined, and system actors all arrive at the same component.

## <Rule id="icon-app" evidence="device" description="One asset, no words, no fine detail" />

The app icon is drawn at about the size of a fingertip, beside twenty others, inside a mask the launcher picks and at whatever smaller sizes the system generates for search and settings.

- No text in it. Words in an app icon are never translated and never read out, and at the drawn size they are texture.
- No screenshot of the interface, no hairline strokes, no small detail. Each of them survives the 1024px master and none survives the home screen.
- Ship the layers unmasked and square, with no shadow, bevel, glow or highlight painted in. The system applies its own, dynamically, and a pre-lit or pre-masked layer fights it and produces jagged edges.
- Respect the launcher's geometry, which fails at both ends. On Android the outer band of the canvas belongs to the mask and to the parallax effect, so a mark drawn to the edge loses its edge to whatever shape that launcher applies; a mark drawn too small floats in the middle of a canvas everyone else fills. The safe box has a floor as well as a ceiling, and both are in the reference.
- Ship the monochrome layer on Android, and the dark and tinted appearances on iOS. Both systems generate any variant that is not supplied, so the choice is not whether the app has one, it is whether anybody drew it. An alternate app icon needs its own full set.
- The mark is the product's own. System symbols may not be used in an app icon or a logo, and platform hardware may not be drawn inside one.

<Check>

<Verify rule="icon-one-set">One icon set is in use, with one dependency or a stated reason for a second, every glyph on a screen comes from that set at the weight of the text beside it, and a filled selected state is that set's own fill rather than a second file.</Verify>
<Verify rule="icon-weight">Every icon beside text matches its weight, scales with the user's text setting, sets the optical size wherever the set carries that axis, and sits on the text baseline on iOS.</Verify>
<Verify rule="icon-no-emoji">No emoji and no glyph borrowed from a prose typeface stands in for an icon, a bullet, an arrow or a button mark anywhere in the interface.</Verify>
<Verify rule="icon-vector">Flat artwork is vector and tintable in one colour, and every raster interface asset is authored at each density the platform asks for.</Verify>
<Verify rule="icon-reserve">Every remote image outside a list takes its dimensions from the layout before the request is made, and nothing below it moves when it lands.</Verify>
<Verify rule="icon-crop">Each image surface names one aspect ratio, or a fixed short list of them, plus one fill mode, and images crop rather than stretch or letterbox.</Verify>
<Verify rule="icon-alt">Every image either describes what it shows or is hidden as decoration, and no description is a file name or the word image.</Verify>
<Verify rule="icon-dark">Every asset that cannot be tinted has a dark counterpart selected by the asset system, and no asset carries an opaque light background.</Verify>
<Verify rule="icon-avatar">The avatar has a generated fallback at the same size, stable per user, covering the missing name, and no path renders a broken image.</Verify>
<Verify rule="icon-app">The app icon carries no text, ships unmasked layers with no baked effects, keeps its mark inside the safe box, and supplies the monochrome layer on Android and the dark and tinted appearances on iOS rather than letting the system invent them.</Verify>

<Device>Check `icon-dark`, `icon-avatar` and `icon-app` on a rendered screen in dark appearance, and `icon-weight` at the largest text step. All four pass a light-theme, default-size screenshot.</Device>

</Check>
