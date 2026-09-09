# Accessibility

Everything else in this repository describes what the screen looks like. This file describes what is underneath it: the name of each control, the order they are reached in, and what the app says when something changes. That layer is the whole interface for someone using a screen reader, a switch, or their voice, and it is invisible in a screenshot, so it is the layer that gets shipped empty.

A phone sharpens every part of it. There is no width for labels, so controls become icons with no text at all. There is no keyboard, so actions become gestures that a reader user cannot perform. One screen shows at a time, so content is swapped in place rather than loaded as a new page, and nothing announces the swap. And the settings that change the interface live in the operating system, apply to every app at once, and are already on when the app launches.

Four neighbours carry pieces of this and are not repeated here: `color-not-alone`, `touch-floor`, `touch-spacing` and `type-scaling`. `list-a11y` is a fifth of a different kind: it is these rules applied to a list row, so the two are read together.

## `a11y-name` Every control carries a name, a role and a value

Three separate things, and the last two are the ones that go missing.

The **name** says the action and its object, in the words the user would use. It is not the icon, not the asset, not the glyph identifier. A control announced as `ic_chevron_right` or `star.fill` is not a poorly named control, it is an unusable one. `button-label` governs the visible label; this is what gets read when there is no visible label at all, which on a phone is most of the toolbar.

- Leave the control type out of the name. The role already carries it, so "Add button" is announced as "Add button button".
- Leave the surrounding context out too. Inside a player, "Play", not "Play song".
- No two controls a voice user could address carry the same name. Three buttons all called "More" give a voice user nothing to say and a switch user nothing to aim at. Two rows that genuinely hold the same words are not that failure.

The **role** arrives free with a real control and has to be declared on anything built from a container plus a tap handler: `Role` in Compose, a trait in SwiftUI, the `button`/`header`/`slider` flags in Flutter, `accessibilityRole` in React Native.

The **value** is the current state, and it changes while the name does not: `stateDescription` in Compose, `accessibilityValue` in SwiftUI, `Semantics(value:)` in Flutter. A real control brings its own: a `Switch` reports checked or not checked and a `Toggle` reports on or off with nobody writing a line, so declaring a value over that is noise. Two cases are not covered. A container plus a tap handler standing in for a control reports no state at all. And a default can be right and still misleading, which is what an override is for: a mute button announced as "selected" is describing the widget rather than the sound. The same trap catches any control whose name should change with its state: a play control that keeps the name it was built with is lying half the time.

Anything drawn onto a canvas (a chart, a custom picker, a signature field) has no child elements and is a single blank node until semantics are written for it by hand, with `ExploreByTouchHelper` on Android views or a semantics tree in the declarative kits.

## `a11y-hidden` Decoration is hidden, not described

Every node in the tree is a stop the user has to step through. An icon sitting beside the label it duplicates, a divider, a background image, a chevron that only says the row opens: hide each one rather than naming it. `contentDescription = null` in Compose, `.accessibilityHidden(true)` in SwiftUI, `ExcludeSemantics` in Flutter. What matters is the outcome: a node that produces no semantics of its own, a spacer, a divider drawn as a background, already costs nothing and needs no declaration written over it.

The opposite failure is just as common and reads worse: decoration given a description of its own picture, so the reader says "grey rounded rectangle with a blue circle". Text needs nothing, because it announces itself. And a loading placeholder is decoration until real content replaces it, so the shimmer blocks are hidden and the arrival is announced once (`state-loading`, `a11y-announce`).

## `a11y-order` Reading order is the order, and grouping decides how many stops

Traversal order comes from the layout tree, walked in the reading direction of the content. It breaks wherever drawing order and layout order disagree: an absolutely positioned element, a bar drawn after the content it sits above, a floating button declared last in the file, an overlay stacked on top of the screen it belongs to.

Fix it by fixing the declaration order. An override is the second answer: in Compose that is `isTraversalGroup` on the parent with `traversalIndex` on the children, and `traversalIndex` alone does nothing without the group flag on the parent.

Grouping is the other half of the same rule. A card holding an image, a title, two lines of body and a badge is one thing to the user and six stops to a reader. Merge it so it reads as one sentence. `list-a11y` covers list rows; the identical problem appears in a card, a stat block, a labelled value pair, and a field with its helper text and its error.

The screen title is announced first on arrival, so a screen whose title exists only inside a custom header view arrives in silence. Give it a title the system knows about: the navigation title where the stack has one, and `paneTitle` in Compose on a screen whose header is a composable of your own. Headings are what a reader jumps between instead of walking every element, and the trait that makes one is `list-a11y`.

## `a11y-collection` A collection says how long it is and where in it you are

A phone has no scrollbar, and a recycling list keeps roughly a screenful of nodes alive at a time (`list-virtualise`). So a reader user walking it is told neither how many items exist nor which one this is, and there is nothing on screen to answer either question.

A list, a grid or a carousel declares itself as a collection and each child declares its position in it, so the reader announces item three of two hundred. The platform list primitives do it on their own; anything assembled by hand does it explicitly, with `collectionInfo = CollectionInfo(rowCount, columnCount)` on the container and `collectionItemInfo = CollectionItemInfo(...)` on each child in Compose, and `IndexedSemantics` in Flutter. The total is how many items the data holds, not how many rows are realised: a count that follows the recycler tells the user the list is shrinking while they walk it.

## `a11y-announce` Content that changes without a navigation has to say so

Almost nothing on a phone is a page load. A filter narrows the list in place, a total recalculates, a field turns red, a banner slides in at the top. A sighted user catches all of it in peripheral vision. A reader user is three stops away and is told nothing at all.

- Mark the region that changes and let the platform speak it: `liveRegion = LiveRegionMode.Polite` in Compose, an announcement notification on iOS, `Semantics(liveRegion: true)` in Flutter.
- Polite by default. Assertive cuts off whatever the user is listening to, so it is reserved for the thing that stops them: a failure, a payment result, a session ending.
- Four that must never fire: one per keystroke inside a field, one per frame of a progress bar, one per row of an incoming page, one per tick of a countdown. Announce the outcome, never the process.
- The announcement is the same sentence the screen shows, which means it is a translated string (`l10n-strings`) and, for a failed field, the message `form-error` already placed beside it.
- An announcement is heard once, and the field keeps failing after it. So the field declares the failure on its own node, in those same words, and somebody who reaches it a minute later hears why instead of hearing the label alone: `error("...")` in the Compose semantics, the value and the traits on iOS.

## `a11y-focus` Focus moves where the screen moved, and comes back

- When a sheet, dialog or cover opens, focus moves into it and cannot leave. On a phone the new surface covers the whole screen, so a reader that can still walk the layer beneath is reading a screen the user cannot see. The platform primitives settle it by presenting in their own context or window: `.sheet` and `.fullScreenCover` in SwiftUI, `Dialog` and `ModalBottomSheet` in Compose. An overlay stacked by hand inside a `ZStack` or a `Box` does not, so there the layer beneath is made inert by hand: `.accessibilityHidden(true)` in SwiftUI, `Modifier.clearAndSetSemantics {}` in Compose, `ExcludeSemantics` in Flutter, `accessibilityViewIsModal` on iOS with `importantForAccessibility="no-hide-descendants"` on Android in React Native.
- On dismissal, focus returns to the control that opened it. Dropping the user at the top of the screen makes them traverse the whole thing again to get back to where they were.
- The way out has to be reachable from inside the surface, which is `nav-modal` stated for a user who cannot perform the dismissing gesture.
- Focus never moves unless the user asked it to. Taking it on load talks over the screen title, and taking it on every state change makes the screen impossible to read. Two moves are asked for and stay: onto the single field a screen exists for, such as search or a code (`form-input`), and onto the first failing field after a submit (`form-error`).

## `a11y-gesture` A gesture is never the only route

A swipe, a long press, a drag to reorder, a pinch, anything with two fingers: none of these can be performed by someone using a reader, a switch, or a keyboard. Each one needs a named route to the same result, and where that route comes from depends on what drew the gesture.

- Where the primitive already projects the gesture into the tree, the work is naming it. `Modifier.combinedClickable(onLongClickLabel = "Pin conversation")` puts the verb into the long press the platform is already offering, and a platform swipe row carries its actions with whatever labels they were given. An action left unnamed is announced as a generic one, and that is the defect rather than a missing declaration.
- Where nothing projects it, a swipe layer assembled by hand, a drag to reorder, a pinch, the route is a custom action on the same node, named with the verb: `customActions` in Compose, `.accessibilityAction(named:)` in SwiftUI, `CustomSemanticsAction` in Flutter, `accessibilityActions` in React Native. `list-a11y` is this rule applied to a row.
- A value that is dragged (a slider, a reorder handle, a rating) gets the adjustable action instead, so it moves one step at a time.
- Custom multi-finger gestures have no route at all. Use the simplest gesture that works, and keep the visible equivalent that `list-swipe` and `list-refresh` already require.

## `a11y-alt-input` Switch and voice reach the app through names and targets

A switch moves one highlight through everything focusable, in order, one press per step. Voice control acts on whatever the user can read out loud off the screen.

- The spoken name matches the visible words. A button reading "Send" whose name is "Submit your message" cannot be spoken to. Where the two genuinely have to differ, the visible words are added rather than swapped in: `accessibilityInputLabels(_:)` is the iOS hook, and on Android there is no separate field, so the visible words go inside the description itself.
- Anything that takes the highlight is something the user can act on. Decoration left in the tree (`a11y-hidden`) turns a five-step screen into a twenty-step one, and each of those steps is a physical press.
- Every action is reachable by stepping, in a finite number of steps. A control that only appears mid-drag, or only under a long press with no custom action, does not exist for this user.
- Nothing that carries the only copy of something dismisses itself on a timer: a toast holding an error message, a snackbar holding the only undo, a code that expires while the highlight is still walking toward the field. Stepping across a screen takes several times as long as tapping it. Prefer an explicit dismissal.

## `a11y-settings` The system settings are people, not options

Larger text, bold text, increased contrast, reduced motion, reduced transparency. Each one is switched on by a user who needed it, and each one is already on before the app launches.

- Larger text and bold text are `type-scaling` and `type-weight`. Both are honoured by taking every style from the theme rather than typing a size or a weight into a component, and the size the interface has to survive is the largest step `type-scaling` names.
- Reduced motion belongs to `motion.md` in full. Read the setting, honour it, and do not restate it here.
- Increased contrast is read as `colorSchemeContrast` in SwiftUI or `isDarkerSystemColorsEnabled` in UIKit, where the symbol name does not contain the word, and as `UiModeManager.getContrast()` from API 34 on Android. On iOS the semantic system colors answer it on their own; on Android the response has to be written, and either way a hex typed into a component cannot follow it (`color-roles`).
- Reduced transparency is an iOS setting with no Android counterpart, so an Android-only build answers it as not applicable. On iOS it is honoured by the platform's own material and ignored by a blur rebuilt by hand, which is one more reason `color-gradient` sends you to the system one.
- All of these are live values, not launch-time facts. Somebody will change one while the app is open, from the accessibility shortcut, and the screen has to follow: `addContrastChangeListener` on Android, the matching change notification on iOS.

## `a11y-media` Nothing is carried by audio alone

Phones are used muted, in public, and by people who cannot hear them.

- One of these the system already answers, which is the half a diff can be checked against: `isClosedCaptioningEnabled` on iOS and `CaptioningManager.isEnabled()` on Android say captions are wanted. Read it at launch and on its change notification, and start the player the way it says. Whether video may start by itself is `motion-autoplay`.
- The rest is designed rather than read. Video carrying speech or meaningful sound carries captions, with the control to turn them on inside the player rather than buried in settings.
- Sound is never the only signal. A success chime, an error beep, a haptic with no visible change: pair every one with something the screen shows (`touch-feedback`).
- Audio that starts on its own is gated by `motion-autoplay` and `sound-unasked`, and the control to stop it is reachable in one step.

## `a11y-test` Drive one whole flow with the reader on

- Run the platform scanner first, on every screen that changed. It catches the missing name, the small target and the low contrast, and it catches none of the four things above it: wrong order, wrong name, missing announcement, missing route.
- Then use the app without looking at it. One complete flow, start to finish, stepping forward through every element with the screen reader on. Count the stops on the busiest screen: a card or a row costs one stop plus one for each separately tappable control it carries, which `list-row` caps at two. Above that, the merge `a11y-order` and `list-a11y` ask for did not happen.
- Run it once more at the largest text size, and once with the reader off using a switch or a hardware keyboard.

## Check

Review answers each of these against the code, pointing at the line:

- Every interactive element has a name that is not its icon or asset, a declared role, and a declared value wherever the platform's own is missing or misleading, and no two controls a voice user could address share a name. `a11y-name`
- No decorative element produces a stop, and nothing decorative carries a description of its own appearance. `a11y-hidden`
- Traversal follows declaration order, any `traversalIndex` sits under an `isTraversalGroup` and carries the reason the order itself could not be fixed, each composite reads as one stop, and the screen has a title the system knows about. `a11y-order`
- Every list, grid and carousel declares its collection and each child its position, with a total taken from the data rather than from the realised rows. `a11y-collection`
- Every in-place content change has a live region or an announcement, polite unless it stops the user, none fires per keystroke, per frame, per row or per tick, and a failed field declares the failure on its own node. `a11y-announce`
- Modals contain focus and return it to the opening control on dismissal, a hand-built overlay makes the layer beneath inert, and focus moves nowhere else except onto a single-field screen or the first failure after a submit. `a11y-focus`
- Every swipe, long press, drag and multi-finger gesture reaches the same result through a named action: the primitive's own label where it projects one, a custom action where nothing does. `a11y-gesture`
- Spoken names match visible labels, nothing decorative takes the highlight, every action is reachable by stepping, and nothing holding the only copy of something dismisses on a timer. `a11y-alt-input`
- Increased contrast is read and honoured on each platform it exists on, reduced transparency on iOS is left to the system material, and every setting is read live rather than cached at launch. `a11y-settings`
- The system captions preference is read, video with speech has captions, no signal is audio or haptic only, and anything that starts on its own can be stopped in one step. `a11y-media`
- The scanner was run on the changed screens and one full flow was completed with the screen reader on. `a11y-test`

The last line is not answerable from a diff. `a11y-order`, `a11y-collection`, `a11y-announce` and `a11y-focus` are only half answerable from one: the tree they describe exists at runtime, so a file can show the intent and only a running screen shows the result.
