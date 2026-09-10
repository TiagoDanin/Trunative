# Scrolling

Scrolling is the movement a phone gets the most of. The screen is a few hundred points tall, so nearly everything past the first card is reached by dragging, and the drag is the one interaction the hand pays for directly. That is why a scroll that stutters, jumps, or loses somebody's place is felt within a second, and why the defects here are the ones users describe as the app being broken rather than as a design they dislike.

This file is the scroll itself: its axis, its position over time, the chrome that moves with it, and the effects the platform owns. The collection inside the scroll is `heuristics/lists.md`. The column it runs in, the bars pinned over it and the insets around it are `heuristics/layout.md`.

## <Rule id="scroll-nest" evidence="device" description="Same-axis nesting needs a wired handoff, and the fling is part of it" />

Whether a same-axis nest is allowed at all is `layout-column`. This rule is what has to hold once one is: the two scrollers are connected, so at every moment a delta has one owner rather than two competing for it. Android's collapsing app bar is that arrangement and works for exactly that reason, while a scroll view hand-placed inside another of the same orientation is the same shape with nothing joining the halves.

The connection is the whole rule. Deltas travel up to the outermost parent before the child moves, the child consumes what is left, the remainder goes back up, and a fling repeats that cycle with its own pre and post phases. Those fling phases run for touch gestures only, so a handoff that feels correct under a thumb does nothing under an accessibility or hardware scroll.

Three places the wiring is missing and the arrangement still compiles:

- In Compose, `verticalScroll`, `horizontalScroll`, `scrollable`, the `Lazy` APIs and `TextField` join the nested-scroll chain on their own. A `Box` or a `Column` does not, until `Modifier.nestedScroll` is added.
- Across the interop boundary, `RecyclerView` and `ViewPager2` do not implement the nested-scrolling interfaces, so a Compose parent receives nothing from them however it is configured.
- In mobile web and in wrapper stacks there is no nested-scroll contract to opt into. Two same-axis scrollers there are simply two scrollers, and which one moves is settled by where the finger landed.

A windowed list inside a plain scroller is a different failure and `list-virtualise` owns it.

## <Rule id="scroll-affordance" evidence="device" description="The edge says there is more" />

Touch scroll indicators appear during the drag and fade, so on a still screen there is nothing telling the user the region moves. The content has to say it: let the next item be cut by the edge it continues past, rather than ending the visible set flush against the margin. A horizontal row of cards whose last card lands exactly at the padding reads as a complete set, and most people never drag it.

A paged horizontal scroll is the exception that needs a control instead. On a phone the paged region takes the full width and nothing else on a still screen says where in the set the user is, so it gets a page indicator. Where the platform also draws a scroll indicator on that axis, drop it rather than report the same fact twice.

The stock page indicator is a control, not a read-out: it handles its own touches, and its hit area is the whole control rather than one dot, so nothing in it needs inflating and working tap-to-page behaviour is not a defect. A row of dots assembled by hand has only the target its author gave it, and that one owes `touch-floor`.

## <Rule id="scroll-collapse" description="What collapses is chrome, never the last way out" />

The two platforms hand you opposite starting points. On iOS a large title shrinks to a standard title as scrolling begins and returns at the top, with no work. On Android nothing collapses unless it is asked to: the scroll behaviour parameter on every Material 3 top app bar defaults to none, and in the view system the scroll flags default to `noScroll`, while Google's own layout guidance says the bar should collapse. So on Android this is a decision, and which behaviour is chosen has consequences.

An enter-always bar comes back on any downward drag. An exit-until-collapsed bar only re-expands once the content is scrolled all the way to the top. Put the only route to an action inside the second kind and the user has to travel back through the entire list to reach it.

- What may not collapse to zero is the only route out. A small top app bar taking its back arrow fully offscreen is a supported Material configuration and costs nothing, because the system back gesture is untouched by it. A modal close, a cancel, or an action that exists nowhere but that bar is the case that has to survive the collapse, since scrolling it away leaves the screen with no exit at all.
- The screen's primary action does not live in the collapsing region (`button-one-primary`).
- The collapse position is saved state, so rotation does not re-expand a bar over content the user had scrolled past. Material's app bar state carries the offset for this.
- Material disables the scroll behaviour on its bottom app bar while touch exploration is running, and applies no such guard to the top bars, so write that guard for a top bar that hides a control. A collapse is reached by dragging, and a control that only returns after a drag has no route for someone who does not drag (`a11y-gesture`).

## <Rule id="scroll-edge" description="The line between content and chrome is drawn by the platform" />

A bar pinned over a scroll has two conditions, content resting at the edge and content passing underneath, and both platforms already decide what each looks like. iOS gives a bar a separate scroll edge appearance and switches to it the moment scrolled content reaches the bar, so a bar transparent at rest picks up its background by itself. Android's app bar lifts when content scrolls under it, taking a container surface color as it does, and that behaviour is on by default.

Take the transition from there. A shadow painted by hand, a divider pinned under the bar, and a bar left permanently opaque all trade a conditional behaviour for a fixed one: the opaque bar spends the edge-to-edge look while nothing is even scrolled, and the drawn line stays put at the top where the platform would have removed it. Apply one such effect per scroll view, and leave the status bar area translucent so content reads as passing under the bar rather than being cut off by it.

## <Rule id="scroll-anchor" evidence="device" description="Nothing arrives above the reading position" />

This is the defect that makes people lose their place. An image finishing its decode, a banner resolving, a consent strip appearing, or a page of older messages prepending: each one inserts height above the viewport and pushes the sentence being read off the top. One column means the insertion has nowhere to go sideways, so it moves the whole screen at once, and it lands while the thumb is still travelling.

Reserve the space before the content exists, which `icon-reserve` covers for pictures and boxes. A placeholder at the final height makes the arrival a change of pixels rather than a change of layout.

Where the insertion is real rather than late, the anchoring is the framework's job and stable keys are what it needs to do it. A keyed lazy list holds the row that was first visible when rows arrive above it, so the index moves and the visible content does not. What review has to check is the cases nothing covers: a list whose items have no keys, a plain scroller with the rows laid out by hand, and mobile web where scroll anchoring is switched off. A thread that loads history upward is the case that ships broken most often.

Content appended below the viewport is free. Refreshing in place keeps the row under the thumb, which is `list-refresh`.

## <Rule id="scroll-restore" evidence="device" description="The place comes back keyed to the item, not to the index" />

Restoration is ordinal by default, and that default is the bug. A Compose lazy list does keep the key of its first visible item in memory, which is what lets it stay on the same row when items are added or removed above it while the screen is alive. What it writes to saved state is two integers: the index of the first visible item and its pixel offset. So the identity is there until the process dies and absent after it, and in a list whose items were never given keys it is absent from the start. Either way the list comes back at whatever now sits at that index, which after a re-sort or an insertion at the top is a different piece of content. RecyclerView admits the same problem from the other side with a restoration policy that withholds state until the adapter has items, because index 40 is meaningless during the first layout of an asynchronously loaded list.

- Give the items stable keys, `key = { it.id }` on a lazy list, so there is an identity to hold at all. This is the one-line fix and it is the one most often missing.
- Persist that identity yourself, because the framework does not write it down. A position held only in a view model survives rotation and dies with the process, and the process gets killed without anyone asking (`state-interrupt`).
- Restore by resolving the identity, and fall back to the top when the item no longer exists.
- Restore after the data is there, never during the first empty layout.

Which screen comes back is `nav-restore`. Unfinished input is `form-persist`.

## <Rule id="scroll-top" description="Returning to the top is a system gesture on iOS and yours to build on Android" />

On iOS the status bar tap does it, it is on by default, and it breaks quietly: on iPhone the gesture has no effect when more than one scroll view on screen still has it enabled. A horizontal carousel inside a feed is enough to kill it. Turn it off on every scroller except the one the screen is about.

Android publishes no equivalent gesture, so a screen whose scroll has no fixed end builds the affordance: a tap on the already-selected tab, or a control that appears once the user is far enough down. It is sized to the touch floor (`touch-floor`), and it arrives at the top without a long animated ride through everything in between.

## <Rule id="scroll-programmatic" description="Code never moves the screen under a finger that is moving it" />

A touch becomes a scroll after a small amount of travel, 8 dp by the Android default and adjustable per device, which means the user is scrolling well before anything looks like a scroll. A programmatic scroll issued in that window takes the screen away from a hand that is already using it.

- Fire only when no drag is in progress. Where the animation runs through the container's own scroll state, a user drag outranks it and cancels it already. Where it does not, an imperative scroll aimed at a different container, a `scrollTo` in mobile web landing mid-touch, that guard has to be written.
- Move as far as is needed to bring the thing the user just acted on back into view, and no further. Auto-scroll restores context; it does not relocate people.
- Animate only across a short distance. An animated scroll to a distant index rides through everything between and lasts as long as the distance. Jump instead, and let the destination be the first frame the user sees.
- Reduced motion turns the animated ones into jumps (`motion-reduced`).

## <Rule id="scroll-overscroll" description="The end-of-content effect belongs to the operating system" />

Android 12 replaced the edge glow with a stretch that bounces back on drag and on fling, for every app on the device. iOS bounces elastically and expects apps to keep that behaviour. In both cases the scrolling container already provides it, so a hand-built rubber band is a second bounce arguing with the first: it starts at a different velocity and settles on a different curve, and it reads as a rendering fault rather than as a style.

- Do not remove it. On a screen with no persistent scrollbar it is often the only signal that the content has ended, and what the end then says is `list-end`. The switches to look for are `android:overScrollMode` set to never on Android and a scroll view with its bounce turned off on iOS.
- Do not switch it off to quiet a nesting fault. That hides `scroll-nest` instead of fixing it.
- Android publishes a hook for replacing the effect, an `OverscrollEffect` applied with `Modifier.overscroll` or supplied for the whole theme. iOS publishes no equivalent, so there the effect is kept rather than restyled. On neither is it rebuilt by intercepting touches.
- Anything driven by scroll offset is recomputed on every frame of the drag, so it stays on transform and opacity (`motion-cheap`) and never triggers layout.

## <Rule id="scroll-keyboard" description="The keyboard shortens the scroll, it does not cover it" />

Half the screen disappears with no warning, and the scrolling container has to lose that height rather than keep it underneath. A container that stays full height while the keyboard sits over its bottom third makes everything below the focused field unreachable at the exact moment it is wanted.

- The keyboard inset is applied to the scroll container itself, not simulated with a spacer view whose height is guessed. On Android that is the IME inset, `WindowInsets.ime` or `Modifier.imePadding`, with the window's soft input mode set to resize. On iOS it is the keyboard layout guide, or a content inset driven by the keyboard frame.
- Dragging the content dismisses the keyboard, interactively where the platform offers it, which on iOS is the scroll view's interactive dismiss mode. Nobody should have to aim at a done button before they can read.
- The focused field staying visible is `touch-keyboard`.

## Check

Review answers each of these against the code, pointing at the line:

- Every same-axis nesting names the connection that wires it, and no scrollable was placed inside another simply because its content did not fit. `scroll-nest`
- Each scrollable region shows content cut by the edge it continues past, and a paged one carries a page indicator rather than a scroll indicator on that axis. `scroll-affordance`
- Every collapsing bar names its behaviour, leaves a route out of the screen that does not depend on it, holds no primary action, saves its position, and pins under a screen reader. `scroll-collapse`
- The bar over a scroll takes its resting and scrolled appearances from the platform rather than from a drawn shadow, a pinned divider or a permanently opaque background. `scroll-edge`
- Nothing above the current position changes height after it renders, and anything that prepends is either keyed or anchors the first visible row itself. `scroll-anchor`
- List items carry stable keys, the position is persisted as an item identity that survives the process, restored after the data loads, and falls back to the top when the item is gone. `scroll-restore`
- On iPhone exactly one scroll view per screen keeps scroll-to-top enabled; on Android any unbounded scroll offers a built return-to-top at the touch floor. `scroll-top`
- Every programmatic scroll is guarded against an in-progress drag, moves the minimum needed, and animates only over a short distance. `scroll-programmatic`
- No hand-written bounce, overscroll is not disabled, and scroll-linked effects move only transform and opacity. `scroll-overscroll`
- The scroll container consumes the keyboard inset, and dragging the content dismisses the keyboard. `scroll-keyboard`

Check nesting, the scroll affordance, anchoring and restoration on a device with real data rather than in the layout code. All four look correct in a short mock list and fail only once the content outruns the screen.
