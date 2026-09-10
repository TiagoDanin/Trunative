# Lists

Most of a phone app is lists. It is the screen the user opens most, scrolls fastest, and comes back to after every interruption, and it is where three failures arrive together: jank on a device slower than the one it was built on, memory that climbs until the system kills the process, and a wall of rows that all look the same because nothing inside them was ranked.

Loading, empty, error, offline and stale belong to `heuristics/states.md`. This file is what is specific to a collection: what a row is, how many exist at once, and what the top and the bottom of the list do.

## <Rule id="list-virtualise" evidence="device" description="Rows recycle, or the list breaks on real data" />

Ten rows in a mockup and two thousand in production run the same code. A scrolling container wrapped around a mapped array constructs every row up front, keeps all of them alive, and misses the frame budget on the way, which `perf-frame` states. This is the single most reliable performance defect in generated mobile code.

Reach for the recycling primitive every time, including on a list that looks short today:

- SwiftUI: `List`, or `LazyVStack` inside a `ScrollView`.
- Compose: `LazyColumn`, with a `key` on each item.
- Flutter: `ListView.builder`, or `.separated` where the rows carry dividers.
- React Native: `FlatList` or `FlashList`. A `ScrollView` around a `.map()` is the defect.
- Mobile web: a windowing library. `content-visibility: auto` skips the layout and paint of an off-screen row but keeps it in the DOM and in the accessibility tree, so it answers the frame cost and not the memory one, and it needs `contain-intrinsic-size` beside it or the skipped rows collapse to zero height and the scroll jumps as they come back.

Three things the recycler needs before it delivers anything. A key taken from the item's own identity, never from its position, because a positional key hands one row's state to a different item as soon as the data reorders. A size hint where rows are uniform (`itemExtent`, `getItemLayout`, `contain-intrinsic-size`), so scroll geometry stops being measured row by row, on the stacks that still take one: FlashList v2 measures for itself and rejects the estimate its first version required. And a row that does not rebuild on every scroll frame, which means the work inside it is memoised and the callbacks it takes are stable.

Putting a windowed list inside another scroller running the same direction cancels the windowing outright: the outer scroller asks for the full height, so every row is built and kept, and the primitive costs more than the plain column it replaced. The gesture half of that mistake is `scroll-nest`.

## <Rule id="list-density" evidence="device" description="A wall of identical rows is a missing hierarchy, not consistency" />

Material sizes its list item by content: 56dp for one line of text, 72dp for two, 88dp for three. iOS names no tiers, only the 44pt row it grows upward from. Take whichever set the stack belongs to and pick the height the content needs, instead of padding every row up to the tallest one in the list. These are density steps rather than touch targets, and the target floor is a separate number (`touch-floor`).

Inside the row there are usually three jobs: the thing itself, what qualifies it, and its state or its metadata. Those three are not one size and not one weight (`type-weight`, `type-roles`). A row where the title, the subtitle and the timestamp share a size and a color holds three pieces of content and no answer to the question the user is actually scanning for.

Let the rows differ where the content differs. An unread item outweighs a read one, a row with a picture is taller than a row without, and a group of two does not get the treatment a group of forty needs. Forty rows carrying three things each, identical in height, weight and color, force the user to read every one, which is slower than looking and slower still while walking. The exception is the row that carries one thing: a menu of single labels, each with its chevron, is uniform because the content is uniform, and ranking there invents a difference the screen does not have. Hierarchy is owed wherever a row holds two pieces of content or more.

## <Rule id="list-separator" description="One device separates rows, not three" />

Dividers, spacing and cards all answer the same question. Choose one per list, because on a phone a line that only repeats what the gap already said is width and ink spent for nothing. The grouped iOS list is not the thing being warned about: an inset rounded section with hairline rules between its rows is a single platform device, and it stays the right default for a settings or a form list. What is assembled from parts is a card per row that also carries an internal divider, dropped into a stack that is already gapped.

- **Spacing** is the default on a column this narrow. It groups without drawing anything, and it costs no width.
- **Dividers** suit dense uniform rows where the eye needs a line to track along. Where they are drawn by hand, in Compose or on the web, inset them to the text rather than to the leading icon and leave none after the final row. SwiftUI and `ListView.separated` already do both, so this is a review point only on the stacks that do not.
- **Cards** suit rows that are genuinely separate objects carrying their own actions. One card per row across forty rows is forty containers, each spending side padding the content wanted.

## <Rule id="list-row" description="The row is one target, and every control inside it is another" />

That the row itself is a target, and how big it has to be, is `touch-floor`. What belongs to this file is what may sit inside it. A control living in the row is a second target on the same line: a favourite toggle, an overflow button, a checkbox. A chevron is not one of those, it is decoration on the row's own tap. Each real control takes its own hit area and its own dead space away from the row around it (`touch-spacing`), or the user opens a detail screen while trying to star something. Two controls is the ceiling; past that the row needs an overflow menu or a long press.

A row that navigates, and toggles, and expands, is three gestures competing over 56dp of glass held in a moving hand. Give the row one meaning and put the rest behind a control.

## <Rule id="list-swipe" description="A swipe is a shortcut, never the only route" />

Every stack draws them: `.swipeActions`, `SwipeToDismissBox`, `Dismissible`, a swipeable row. They are fast for the person who knows and invisible to everyone else.

- Each swipe action also exists somewhere visible: the row's overflow menu, the detail screen, or selection mode. A swipe-only delete does not exist for a screen reader (`touch-gestures`).
- Two per edge is the ceiling. A third narrows all of them at the exact moment the finger is already travelling sideways.
- A destructive swipe resolves into undo rather than a confirmation (`touch-destructive`). Swipes fire by accident during a scroll, which is precisely when nobody is reading a dialog.
- Leave the gesture findable: a partial reveal the first time, or the action drawn in the row until it has been used.
- The horizontal gesture and the vertical scroll begin at the same point, so the horizontal one commits past a distance threshold instead of on sideways drift. The platform's own touch slop, about 8dp on Android, is the floor for that threshold, and anything under it fires during ordinary scrolling.
- Drag to reorder falls under the same rule: a visible handle or a move action in the menu, not a long press nobody discovers.

## <Rule id="list-images" description="The row reserves the picture's space before the picture arrives" />

Images reach a row late, out of order, and at whatever resolution the server holds.

- **The container has fixed dimensions.** Row height comes from the layout, never from the bytes. An image that sizes itself on arrival reflows the list under a thumb already in motion, and the row somebody was about to tap slides out from under it.
- **The placeholder occupies the exact final box.** A neutral fill or a skeleton at that size. Not a spinner, and not a zero-height box that expands later.
- **The decode is scaled to the box on screen**, which is `perf-decode`.

Fixed dimensions is not the same as one aspect ratio for every list, and choosing the ratio and the crop is `icon-crop`.

## <Rule id="list-sections" description="Sections tell the user where they are" />

Past a screenful or two, a list needs structure the user can navigate by: date, status, alphabet, whatever the order actually follows.

- A section header names a group and is not a row. It does not tap and it does not borrow the row's type styles, and `list-a11y` covers what it owes a screen reader.
- A sticky header stays legible over whatever scrolls beneath it. An opaque fill or the platform's own material settles that outright. A scrim is allowed under `color-gradient` and then owes that rule's measurement, since the content moving underneath moves the worst point along with it.
- One level of grouping. Nested sections in a column this narrow produce indentation nobody can follow.
- Position is worth more here than anywhere else: somebody scrolls two hundred rows, opens one, and comes back to a list that has to be where they left it. What survives that trip, and the mechanism that carries it, is `state-interrupt`.

## <Rule id="list-end" description="The bottom of the list is a designed state" />

Pick one and commit to it.

- **Continuous loading** for feeds and anything browsed rather than searched. Fetch the next page about a screenful of rows before the last one, so it has landed by the time the thumb arrives, and guard the request so a fast flick cannot fire it twice.
- **An explicit load-more control** where the set is finite and the user is hunting for one thing. It is the honest choice whenever somebody needs to be able to stop.

Numbered pagination is a desktop control: there is nowhere on a phone to put page numbers a thumb can hit, and nobody navigates a feed by page number. A list that fetches pages says when the data has run out, with a closing marker, a total or a line of text, because the user cannot otherwise tell the end from a page that never arrived. And a page that does fail becomes a retry at the bottom, leaving the rows above it alone, rather than an error that discards what already loaded. A list holding everything it has needs none of that: the scroll reports its own end.

The last row also has to clear whatever floats above the list, whether that is a fixed bar, a tab bar, a FAB or a mini player. `layout-chrome` owns that padding and the inset that belongs in it.

## <Rule id="list-refresh" description="Pull to refresh is one path to fresh data, not the path" />

Use the platform control rather than a hand-built one (`refreshable`, `PullToRefreshBox`, `RefreshIndicator`, `RefreshControl`), so the threshold, the haptic and the animation match every other app on the device.

- It belongs only where the data changes somewhere else. A pull that re-renders a local array is theatre.
- The same refresh is reachable without the gesture, through a menu item or a button. Somebody driving the screen with a screen reader cannot perform the pull at all.
- It does not replace refreshing on return, and it is not how a user recovers from a failed load. That is the error state's retry (`state-retry`).
- Refreshing keeps the user's place: new items arrive without discarding the row currently under the thumb.

## <Rule id="list-select" description="Selection is a mode, and the screen says so" />

Bulk actions on a phone take over the screen, because there is no modifier key and no width for a permanent column of checkboxes.

- Entering selection is deliberate: a long press on a row, or a Select control. A normal tap never starts it.
- While it is on, the screen shows the count, an obvious way out, and the actions that apply. Rows select instead of navigating, and that change of meaning is visible before the first tap rather than after it.
- Selected is marked by a check mark, a box or a container change, never by tint alone (`color-not-alone`).
- The bulk action says what it did and offers undo, because one mis-tap here costs forty items instead of one (`touch-destructive`).
- Select all in a list that is still paging means selecting what has loaded, and the label has to admit that.

## <Rule id="list-a11y" description="A row is one stop, not four" />

A screen reader moves stop by stop and there is no pointer here to skip ahead with. A row left as its icon, then its title, then its subtitle, then its badge is four stops, so two hundred rows become eight hundred and the list stops being navigable long before it stops being correct.

- Each row is a single node reading as one sentence: `Modifier.semantics(mergeDescendants = true)` or `MergeSemantics` in Compose, `.accessibilityElement(children: .combine)` in SwiftUI, `MergeSemantics` in Flutter, `accessible` on the row in React Native. A control that stays separately tappable stays its own node, which is why two per row is already the ceiling.
- Every swipe and every long press is also an action on that node: `customActions` in Compose, `.accessibilityAction` in SwiftUI, `CustomSemanticsAction` in Flutter, `accessibilityActions` in React Native. The visible equivalent under `list-swipe` is what a sighted user reaches for, and this is the route a screen reader has.
- A section header carries the heading trait, so the reader can jump between groups instead of walking every row: `heading()`, `.accessibilityAddTraits(.isHeader)`, `Semantics(header: true)`.

## Check

Review answers each of these against the code, pointing at the line:

- Every list uses the stack's recycling primitive with a stable non-positional key, and uniform rows carry a size hint where the stack takes one. `list-virtualise`
- Row height follows the content instead of one padded maximum, and any row carrying two or more pieces of content ranks them by size, weight or color. `list-density`
- Rows are separated by one device rather than three, and hand-drawn dividers are inset to the text with none after the last row. `list-separator`
- At most two controls sit inside a row, each with its own hit area and its own clearance, and a chevron is not counted as one. `list-row`
- Every swipe action has a visible equivalent, at most two per edge, destructive swipes end in undo, and the gesture commits past a distance threshold rather than on drift. `list-swipe`
- Image containers carry fixed dimensions with a placeholder at the same size. `list-images`
- Section headers are headings rather than rows, grouping goes one level deep, and a sticky header stays legible over the content moving under it. `list-sections`
- The list loads continuously or offers a load-more control and never numbered pages, and a list that pages states where the data ends and turns a failed page into a retry at the bottom. `list-end`
- Pull to refresh uses the platform control, and the same refresh is reachable without the gesture. `list-refresh`
- Selection mode is entered deliberately, shows its count and its exit, marks selection without color alone, and offers undo. `list-select`
- Each row is one merged accessibility node, every swipe or long press is also an accessibility action, and section headers carry the heading trait. `list-a11y`

`list-virtualise` and `list-density` both pass at ten rows and fail at a thousand, so neither is answered from the file alone. Fill the list with production-sized data and scroll it on the slowest device the app supports.
