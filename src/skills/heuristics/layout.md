# Layout

A phone hands the app one narrow column, and the operating system takes part of it back before the first widget renders. Bars at both ends, a cutout, a gesture strip, a keyboard that arrives unannounced, and text at whatever size the reader chose. Layout here is the composition of what is left over, and the part the system reserves is a measurement read at runtime, not a margin guessed at the end.

Values already written into `DESIGN.md`, the spacing scale and the screen margin among them, are settled. This file is how a screen is built inside them, and what to use for the ones the brief left unset.

Neighbouring rules own the parts that are not geometry: thumb zones are `touch-reach`, the system gesture strips are `touch-gestures`, the keyboard is `touch-keyboard`, and long collections belong to `heuristics/lists.md`.

## <Rule id="layout-insets" evidence="device" description="The safe area is geometry, not padding added at the end" />

Read the inset at runtime and lay the screen out inside it. A constant copied off one device (34, 44, 48) is right on that phone and wrong on the next, and it is wrong on the same phone the moment a call banner or an expanded status bar changes the number.

- SwiftUI respects the safe area already. `.ignoresSafeArea()` belongs to a background fill or an image and never to text or a control, and a pinned bar takes `safeAreaInset(edge:)` so the content behind it scrolls clear.
- Compose: `enableEdgeToEdge()` with `Scaffold`, which insets its own bars, plus `WindowInsets.safeDrawing` on anything drawn outside it.
- Flutter: `MediaQuery.paddingOf(context)`, or `SafeArea` with the edges named.
- React Native: the safe area context hook, read per render, rather than a stored constant.
- Mobile web inside a shell: `viewport-fit=cover` plus `env(safe-area-inset-*)`, which report zero until that meta tag is set.

On a current Android target there is no opt out, since the manifest flag that used to disable edge to edge is ignored, so the inset is a runtime measurement on every build. Nor is it one number: a three-button device reports a taller bottom inset than the same phone using gestures. What a pinned control does when that measurement is skipped is `touch-gestures`.

A pinned bar carries the inset inside itself: its own height for the controls, plus the bottom inset underneath them, in one component. Padding the bar from outside leaves a strip of the wrong background color under it, and a sheet or a dialog opened over the screen owes the same treatment, since it becomes the bottom of the screen while it is up.

Four edges, not one. The top holds the status bar and the cutout or Dynamic Island. The bottom holds the home indicator or the navigation bar. The side insets are zero in portrait and stop being zero once the phone is turned, where they are applied to both sides and the cutout is on one of them. Scrolling content may pass under any of them and often should, because the content ending in a hard line above the bar wastes the screen. Anything read or tapped may not, and that includes the last row of a list, the buttons inside a sheet, and a snackbar.

## <Rule id="layout-grid" description="One spacing scale, and every gap sits on it" />

Every value is a multiple of 4, and a multiple of 8 once it is above 16: 4, 8, 12, 16, then 24, 32, 40, 48, 56, 64. A 22 or a 35 landing between those steps is not a fine adjustment, it is a value that came from nudging one component until it looked right, and the next person has nothing to reuse.

Where `DESIGN.md` leaves the margin token unset, the default is 16 on both platforms. It applies to the leading edge of the text column and it holds across screens, because two screens whose text starts at different distances from the edge read as two products. Full-bleed content is exempt by definition: a hero image, a map, a media player and a carousel that runs off the edge are meant to reach it. So are the platform list containers, which carry their own row insets (SwiftUI `Form` and `List`, Material `ListItem`) and are not corrected back to 16 by hand.

Spacing carries more weight on a phone than anywhere else: in a column around 360 wide it is the only grouping tool available, and there is no spare whitespace to absorb an odd value the way a wide layout does.

This is countable. List the distinct vertical gaps on the screen. Four or five is a rhythm. Eleven of them is a screen assembled one component at a time.

## <Rule id="layout-grouping" description="Space groups content, a border only draws around it" />

Set proximity first and reach for a container only when space alone cannot carry the relationship. Related rows tighten, unrelated blocks separate, and a heading takes more space above it than below so it belongs to what follows it.

Every container costs width the phone does not have. A card padded 16 inside a screen margin of 16 pushes its text 32 in from each edge, which on a 320 wide device spends a fifth of the line on nothing. Nested cards, a border plus a divider plus a shadow around the same group, and a card wrapped around the entire screen are all the same move: structure that space was supposed to express.

Density follows the situation in `PRODUCT.md`: an app used while walking wants fewer things per screen and larger intervals, a tool someone works in seated can hold more. Fix it as numbers rather than as an intention. One row height and one section gap per kind of screen, written once and identical everywhere that kind appears, so a screen that is generous at the top and cramped at the bottom shows up as two different gaps instead of as a feeling.

## <Rule id="layout-shape" description="Radius, edge and crop are one decision" />

Corner radius is identity, the same way the palette and the typeface are. `DESIGN.md` carries it as `rounded` and in its Shapes section, and a component that picks its own number is a component that voted on the brand.

A screen where a card, a photograph, a chip, a field and a button are all rounded to the same number has no shape language. It has one habit applied nine times, which is the reason so many generated screens read as the same app.

- The radii come from the shape language: a small one for controls, a larger one for surfaces, a full round for what is meant to read as a pill or a circle. Three values on a screen is a system, nine is a reflex.
- A square edge is a choice available to every surface. Photographs, thumbnails, tables and anything that reads as printed are frequently better with the edge the medium gives them, and a hairline rule does work that a rounded card cannot.
- The radius of a nested surface is smaller than the one containing it, by the padding between them, or the two curves fight along the same corner.
- Elevation is part of the same decision. Shadow, outline and fill are three ways to lift a surface, and a screen that reaches for all three at once has not decided how depth works.

## <Rule id="layout-column" description="One column, one scrolling axis" />

There is no second column to escape into, and that changes what happens when something does not fit. Two halves side by side on a 320 wide screen leave each about 140 after the margins and the gap, and at the largest text step the same pair becomes two words per line. Whatever wants a second column is a row that should stack, a table that should be a list, or content that deserves its own screen. The exception is a pair of short fields whose format fixes their length in advance, expiry beside CVC being the one everybody ships: those fit at 140 and go on fitting at the largest step. Two fields on one line is otherwise the version of this that ships most often, and `form-column` owns it.

The screen scrolls in one place and along one axis. Put a vertical scroll inside another vertical scroll and the drag has two possible owners, so the inner one, holding the content the finger was aiming at, sits still while the page moves instead. Nesting on the same axis is only ever safe under the platform contract that `scroll-nest` owns. A horizontal strip inside a vertical page needs none of that, precisely because the axes differ. Virtualising what is inside the scroll is `list-virtualise`.

## <Rule id="layout-width" evidence="device" description="The narrow device is the one that breaks" />

Design against a range. Supported iPhones run about 375 to 440pt wide, the narrow end being installed base rather than anything still on sale, and Android compact devices report from about 320dp upward. The small end is where a layout fails first, and it is on far fewer desks than it is in hands.

- Nothing holding content carries a fixed width. Let it fill and constrain it with a maximum, so the same row survives both ends of the range.
- A row of three fixed cards, a horizontal group of buttons and a label paired with a value are the three that overflow first. Check them at 320dp before anything else.
- A fixed height is the same defect turned ninety degrees. A container sized to hold two lines holds one and a half as soon as the string is translated or the text scale moves, so heights follow content and only maximums are pinned.
- Width and text size fail together. Recheck the narrow device at the largest accessibility step, which is `type-scaling`.

## <Rule id="layout-chrome" evidence="device" description="Anything pinned covers the content underneath it" />

A bar sitting in the platform's own bar slot is already handled: a Compose `Scaffold` reports the padding its top and bottom bars take, for the content to apply, and a SwiftUI `TabView` or `safeAreaInset(edge:)` extends the scroll view's safe area itself. Use the slot and there is no number to invent.

Hand-placed chrome is the case that bites: an overlay dropped into a `Box` or a `ZStack`, a floating button, a mini player, a standing banner. It sits on top of the scroll rather than shortening it, so the last row lives underneath and can be read only by overscrolling. Nothing in the code looks wrong, and the screen looks correct until the data is long enough to reach the bottom, which is why it survives review so often. The floating button is `button-fab` and the bottom of a collection is `list-end`.

The padding is derived, not typed. Measure the bar, add the inset, and let the scroll read that value, because a hardcoded 80 goes stale the first time the bar gains a second line or the device has a taller gesture area.

Chrome is rationed as well as cleared. Besides the system bars, a phone screen carries at most two persistent bars, and each one earns its height by doing something on every screen it appears on. A third is the sign that navigation, a banner and a player are all claiming the same edge, and the one to cut is the one that does nothing on the screen currently in front of the user.

## <Rule id="layout-overlays" description="A transient surface stacks above the pinned ones" />

A snackbar, a toast or an undo bar arrives over a screen that already has a bottom bar, a floating button, and an inset under both. The stacking order is the whole rule: the transient surface sits above every pinned bar and above the bottom inset, and it pushes the floating button up rather than covering it.

Take it from the platform's host, because that is where the displacement is already written: the `snackbarHost` slot of a `Scaffold`, or the equivalent presentation the stack provides. One hand-placed in a `Box` renders under the bottom bar or over the button, and that is the version that ships.

One at a time, and never behind something else. Two messages stacked, a toast drawn behind an open sheet, and a snackbar left under a keyboard that has just opened are the same defect: a surface positioned by hand into a stack whose heights it does not know.

## <Rule id="layout-fold" evidence="device" description="The first screenful answers what this is and what to do" />

At the narrow end, at default text size, with nothing scrolled, three things are visible: what the screen is, the beginning of its real content, and the primary action. That action has two acceptable places and no third. Either it sits inside the first screenful, or it lives in a bar pinned above the bottom inset and is visible at rest, before anything has been scrolled.

Scrolling costs more here than the wheel costs on a desk, because it takes the hand that is holding the phone, so the first screenful is the one thing the user gets without paying for it. A header that spends it on promotion or decoration, an illustration, a stack of marketing cards, a brand banner, has pushed the first row of real content past the edge for nothing. Where the media is the subject, a photo detail screen, a listing, an artist page, a full-bleed onboarding screen, the hero is both the subject and the start of the content, and the rule is already met.

Where content continues below, saying so is `scroll-affordance`. Everything past that line is a decision the user has to earn, so order the screen by what the job needs first, not by what the API returned first.

## <Rule id="layout-short" evidence="device" description="Content that does not fill the height still has a bottom" />

Every rule above assumes the screen scrolls. The other case, a three-field form, an empty state, a detail screen holding two rows, is where a bottom action drifts: centred into the empty middle at one content length, and scrolled out of sight as soon as one more field arrives. There is no viewport height to fall back on the way a page has one.

Both lengths run the same code. The scaffold's bottom bar slot pins it outright. Where the action belongs to the scrolling content instead, give the scroll a fill-height frame and a spacer that pushes the action down, so short content holds it against the bottom edge and long content lets it scroll away with the rest.

The failure has a look, and only the short length shows it: a frame where the content stops a third of the way down, the action floats in the middle, and the bottom of the screen is empty. Nothing in the source says so, because the source is the long case.

## <Rule id="layout-orientation" description="Turned sideways the screen loses height, not width" />

A large phone held horizontally keeps a wide line and takes its portrait width as its height, about 390 to 440pt, most of which the keyboard takes when a field has focus. Two outcomes are acceptable and nothing between them: the screen locks to portrait for a reason recorded in `STACK.md`, or it reflows.

Reflowing means the primary action stays visible without hunting for it, and the reading column keeps its measure rather than running the full width (`type-measure`). A turn is also a configuration change, so what has to survive it is `state-interrupt`. The geometry is the part this rule owns.

<Check>

<Verify rule="layout-insets">The screen takes its insets from the framework's inset source rather than from a constant, and nothing readable or tappable sits outside them.</Verify>
<Verify rule="layout-grid">Every gap is a multiple of 4, and of 8 above 16, the text column starts at the same margin on every screen outside full-bleed content and the platform list containers, and the screen uses about five distinct vertical gaps rather than a new one per component.</Verify>
<Verify rule="layout-grouping">Grouping comes from space before containers, no container is nested inside another that already groups the same content, and the row height and section gap are the numbers this kind of screen uses everywhere else.</Verify>
<Verify rule="layout-shape">Radius comes from the shape language rather than per component, the screen holds at most three radius values, a nested surface curves less than the one around it, and depth arrives through one of shadow, outline or fill rather than all three.</Verify>
<Verify rule="layout-column">One column, no same-axis nesting outside what `scroll-nest` permits, and nothing side by side that would leave either half under about 140 wide apart from short fixed-format fields.</Verify>
<Verify rule="layout-width">No content container carries a fixed width, and the screen was rendered at its own width and again at 320dp with nothing cut at an edge and nothing overflowing sideways.</Verify>
<Verify rule="layout-chrome">Bars sit in the platform's bar slot, hand-placed chrome derives its padding from the measured bar plus the inset instead of a typed number, no more than two persistent bars stand besides the system ones, and on a rendered screen no line of content sits under a pinned bar, at the top edge or at the bottom one.</Verify>
<Verify rule="layout-overlays">The snackbar comes from the platform's host slot rather than a hand-placed overlay, it clears the bottom bar and the inset, it moves the floating button rather than covering it, and one is on screen at a time.</Verify>
<Verify rule="layout-fold">On the narrow device at default text size, the screen's subject and the start of its content are visible unscrolled, and the primary action is either in that screenful or in a bar pinned above the bottom inset and visible at rest.</Verify>
<Verify rule="layout-short">Rendered at its shortest content, the screen holds its action against the bottom rather than centred above an empty lower third, through the same code that lets it scroll once the content grows.</Verify>
<Verify rule="layout-orientation">Landscape is either locked with a reason recorded in `STACK.md` or reflows, with the action still visible and the measure still capped at the shorter height.</Verify>

<Device>`layout-insets`, `layout-width`, `layout-fold` and `layout-chrome` are answered on a rendered screen at the narrow end of the range, on a device using three-button navigation as well as gestures. The token table and the component tree both look correct while the bottom bar is sitting under the navigation bar. `layout-chrome` needs the screen scrolled to both ends with enough content to reach the pinned bars, because the collision is invisible until a row arrives under one of them, and the top bar hides the first row as readily as the bottom bar hides the last. `layout-short` needs the opposite render, the screen at its shortest content, which is the only length at which the action drifts into the middle.</Device>

</Check>
