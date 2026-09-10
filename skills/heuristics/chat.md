# Conversation

A conversation screen is one column that grows from its bottom, read in glances, with half of it under a keyboard for as long as anyone is answering. It is opened several times a day, more often from a notification than from inside the app, and every entry lands in the middle of something. Its failures are not the generic list failures: they are the screen moving under a thumb, and the message that left the composer and then quietly stopped existing.

Here: the transcript's anchor and where it opens, paging history upward, the row, arrivals, grouping and time, the composer, the state of one message, attachments, presence, the empty conversation and announcing an arrival. Recycling is `list-virtualise` and the row as a target is `list-row`. The keyboard as layout is `touch-keyboard` and `scroll-keyboard`. The write queue itself is the `off-` prefix, telling somebody a message arrived is the `notify-` prefix, and field configuration is the `form-` prefix. A link tapped in a message opens through `web-surface-choice`, and a place attached to one is the static or lite-mode map `map-cost` requires of any recycled row.

## <Rule id="chat-anchor" description="The transcript opens at its newest end and stays there as it grows" />

The only reason anyone opened the conversation is the last message, there is no second pane holding it in view, and the container changes size under it twice: once when the keyboard arrives, and again every time the composer takes another line.

- Declare the anchor instead of scrolling to it after the first frame: SwiftUI `defaultScrollAnchor(.bottom)`, Compose `LazyColumn(reverseLayout = true)`, Flutter `ListView(reverse: true)`, React Native `FlatList` `inverted`. All four are off by default, so the anchor is one line somebody writes.
- A reversed Compose list already holds a conversation shorter than one screen at its bottom, and the one thing that breaks it is a `verticalArrangement` passed by hand. Bubble spacing is where that happens, so the spacing arrangement carries the alignment with it: `Arrangement.spacedBy(n.dp, Alignment.Bottom)`.
- React Native's `inverted` is a scale transform of -1 that `FlatList` undoes on every cell, so only what is drawn outside a cell (a sticky header, an absolutely positioned overlay, a hand-rolled inverted `ScrollView`) undoes it itself.

## <Rule id="chat-open-position" description="Re-entering the conversation lands on the boundary between read and unread" />

An interruption ended this conversation somewhere in the middle of it. The very bottom skips whatever arrived since; the top is a week of scrolling to get back.

- The boundary comes from the app's own read marker, because no platform publishes an unread anchor, and a conversation with no unread messages takes a written fallback.
- It is applied as the list's initial position rather than as an animated scroll after the first frame: Compose `rememberLazyListState(initialFirstVisibleItemIndex = ...)` sets it before the first layout, and SwiftUI separates the opening position from the growth response only from iOS 18, through `defaultScrollAnchor(_:for:)` with `.initialOffset` against `.sizeChanges`.
- `scroll-restore` owns the place keyed to the item, `nav-restore` which screen comes back, and `notify-destination` that a tap lands on what the notification named.

## <Rule id="chat-history" evidence="device" description="Older messages arrive above without moving the message being read" />

`scroll-anchor` already rules that nothing arrives above the reading position, and already names a thread loading history upward as the case that ships broken most often. What is this file's is the paging itself.

- The page is requested a written distance before the oldest row is reached, so the rows land before the thumb gets there. `list-end` pages the other direction and owns the load-more control, the end marker and the failed page.
- The position is held by item key or by the platform's own mechanism, never by an index: a Compose item `key` keeps the keyed row first visible across an insertion above it, React Native has `maintainVisibleContentPosition` with `minIndexForVisible` (and forbids reordering while it is on), and Flutter answers it with `CustomScrollView.center`, since `ListView.builder` anchors nothing. Scroll anchoring reaches Safari only at Safari 27, so a web transcript that supports anything older reverses its layout or owns the offset itself.
- The loading indicator sits above the oldest row and never replaces the transcript.

## <Rule id="chat-new-arrival" evidence="device" description="A message arriving while the user is reading further up is a pill, never a jump" />

One screenful, one thumb. A programmatic scroll issued while somebody is dragging takes the screen away from a hand that is already using it, and there is no second region to put the new message in.

- Auto-scrolling on arrival is gated on a written distance from the newest end. Inside it the transcript follows the message; past it nothing moves, which is also what `scroll-programmatic` requires of a scroll during a drag.
- Exactly one pill, and it carries the user to the newest message. No platform ships the control, so it is drawn: it lands by `fb-place`, and it is not transient feedback, so it stays until it is used or the user reaches the end rather than timing out under `fb-duration`.
- The pill states that something arrived. It carries a count only where the count is already in hand, and never fires a request to produce one.

## <Rule id="chat-grouping" description="Consecutive messages collapse into a run, and time is printed at a written interval" />

The column is too narrow to spend a line per row on a timestamp, and the only time question a glance asks is whether this arrived just now or overnight.

- A run of consecutive messages from one sender prints the sender's name and avatar at most once, at one end of the run, and a one-to-one thread prints neither. `icon-avatar` owns the fallback for the picture that is missing.
- One written interval decides when a timestamp or a day divider is emitted, since no platform publishes a grouping window or an interval. The divider is a section header and not a row, which is `list-sections`, and it carries the heading trait per `list-a11y`.
- Every time value is stored as an instant and formatted by the locale (`data-time-instant`, `l10n-format`), and anything relative takes the written crossover in `data-time-relative`.

## <Rule id="chat-row" description="One row holds a paragraph, a single character, or nothing but a file" />

One narrow column at the reader's own text size, and nothing to spill into sideways. A bubble sized by hand survives the default and breaks on the three inputs that arrive every day: a pasted wall of text, a one-emoji reply, and a photo sent with no caption.

- A maximum bubble width written into `STACK.md` as a number, because no platform publishes one. The row height is the platform target floor, which is `touch-floor`. Text wraps and no message row truncates.
- An attachment-only message renders without an empty text container behind it.
- Alignment is leading and trailing rather than left and right (`l10n-direction`), the measure follows `type-measure`, the row survives the largest text size (`type-scaling`), and the text can be selected and copied.
- `list-density` already forbids padding every row up to the tallest, and `list-row` caps the controls inside one row at two, which a reaction control plus an overflow already spends.

## <Rule id="chat-empty" description="An empty conversation says who it is with and what to send" />

A blank column under a name is the entire screen, and the keyboard is the only thing that would fill it, so whether it opens by itself is worth deciding rather than inheriting.

- One sentence naming the other party and the first thing worth sending, never a blank column and never a generic no-results line. `state-empty` rules the three empties and `copy-absence` the wording of text standing where content is not.
- A conversation that has never held a message is nothing but a composer, so it is the one chat screen that opens focused. Everywhere else the transcript is what was opened, and nothing takes focus.
- The first screenful still answers what this is and what to do, which is `layout-fold`.

## <Rule id="chat-composer" description="The composer grows to a written ceiling, then scrolls, and never takes the transcript's last row" />

The keyboard is half the screen. A composer with no ceiling plus a keyboard leaves a conversation with no conversation visible in it, and its height arrives without warning while somebody is typing.

- A minimum and a maximum line count, both as numbers, and it scrolls past the maximum: Compose takes `lineLimits = TextFieldLineLimits.MultiLine(min, max)` (`minLines` and `maxLines` on the legacy overload), SwiftUI pairs `TextField(axis: .vertical)` with `lineLimit(1...n)` and a field past the limit becomes scrollable, Flutter grows without limit at `maxLines: null` and is bounded only by its parent, and React Native caps with `numberOfLines`, on iOS only under the New Architecture, and publishes nothing about the growth between the minimum and that maximum. Not one of the four bounds a multiline field on its own, so the ceiling is written on all four.
- The composer's height is subtracted from the transcript rather than lying over its last row, through the platform's own inset and never a guessed spacer. `scroll-keyboard` owns the keyboard inset on the container, `touch-keyboard` the focused field staying visible, and `layout-chrome` the padding under anything pinned.
- Send is a drawn control and never the return key, which on a multiline React Native field inserts a line break by default. It is disabled while the composer holds neither text nor an attachment, so a send with nothing in it is not possible. It takes `button-target`, `button-state`, `button-label` and `a11y-name`.
- Unsent text survives leaving the conversation and coming back, by `form-persist` and `state-interrupt`.

## <Rule id="chat-message-state" description="The state of one message lives on that message, and a failed one keeps its place" />

The radio drops inside a single session, so a send is the likeliest thing in the app to fail, and there is one screen, so that failure has nowhere else to be shown.

- A written set of states covering at least sending, sent and failed, carried by the message and not by the screen. `state-queued` already rules that pending is a property of the item, and that an item vanishing into a sync error is the worst available outcome.
- A failed message stays in its position with a retry on it (`state-retry`) and does not block the messages queued behind it.
- A send with no network becomes a queued row in send order while the composer empties: local first per `off-write-mode`, durable with an id reused across retries so a lost reply is one message and not two per `off-queue`, marked per `off-fresh-marks`, and waiting on the failed request rather than on a connectivity callback (`state-offline`).
- No tick and no state is carried by color alone, which is `color-not-alone`.

## <Rule id="chat-attach" description="Attaching is one control opening the system picker, and what it produced is a row" />

The camera and the library are on this device, and the platform picker reaches the library without a permission. A hand-assembled menu is what costs: it draws its own browser over a picker the system already ships, or it asks for a permission the system route would not have needed, on the screen where somebody is trying to answer a person.

- One attach control, opening the platform's own picker. Android's photo picker grants access to the selected images and videos instead of the whole media library, ships natively from Android 13, reaches Android 11 and 12 through the Google Play services module, and falls back to `ACTION_OPEN_DOCUMENT` where it is unavailable; on iOS it is `PHPickerViewController` from iOS 14, which needs no photo library permission because it runs out of process. `perm-ask-less` and `perm-scope` settle the rest.
- Taking a photo now is the other source, and which surface that capture opens in is `cam-system-first`. Every further source is ruled the same way: it opens the platform's own picker, and one that costs a permission has to earn that permission before it reaches the menu.
- A pending attachment is a transcript row with its box reserved before the bytes arrive (`icon-reserve`, `list-images`), its pending mark from `chat-message-state`, and a transfer that outlives the screen (`net-upload`). On Android the picker's returned URI is granted only until the app stops, so that transfer takes `takePersistableUriPermission` first.
- What arrives from somewhere else is declared narrowly and then distrusted, which is `share-accepts`.

## <Rule id="chat-presence" description="A typing indicator and a read receipt are somebody else's data, and both answer one switch" />

The device is carried, so a read receipt states where a person was and whether they were awake, and it is usually produced by a glance at a notification rather than a deliberate open. Nothing about presence is a platform default and nothing about it is a store requirement.

- One setting governs both directions, so turning it off stops the outbound event as well as the inbound display. It shows its current value without being opened (`set-status`) and its default is picked once (`set-default-first`).
- The typing event is throttled to a written interval and expires on its own rather than waiting for a message to clear it. An unthrottled event publishes when each key was pressed, and wakes the other device once per keystroke to say so.
- The indicator does not loop next to text being read (`motion-loop`) and communicates without moving under reduced motion (`motion-reduced`). What a presence channel may cost in wakeups is `bg-wake-push`.

## <Rule id="chat-a11y" evidence="device" description="An arriving message is announced once, politely, and the transcript is walkable" />

A screen reader user cannot glance. The transcript is the whole screen, an arrival is silent unless something says so, and the composer sits between the reader and the newest row.

- The arrival is announced through a polite live region rather than one announcement per message: `ACCESSIBILITY_LIVE_REGION_POLITE` on Android, `LiveRegionMode.Polite` in Compose. `announceForAccessibility` is deprecated as of API 36 and an event sent that way may be ignored by the service. Assertive interrupts speech already running, which an arriving message is not worth.
- UIKit and SwiftUI publish no live region. The iOS native mechanism is a posted accessibility announcement, and from iOS 17 its priority is set on the string, where the low priority queues behind speech in progress instead of cutting it off. A web transcript uses a live region set to `aria-live="polite"` on either platform.
- One arrival, one announcement, naming the sender. A live region over a fast transcript announces every change and makes the screen unusable, so a burst is announced once.
- Each message row is one stop (`list-a11y`, `a11y-collection`, `a11y-order`), the composer and the send control both carry names (`a11y-name`), content changing without a navigation is `a11y-announce`, and switch and voice reach all of it through `a11y-alt-input`.

## Check

Review answers each of these against the code, pointing at the line:

- The transcript declares an explicit bottom anchor, where a reversed list passes a vertical arrangement of its own that arrangement carries a bottom alignment, and anything drawn outside a cell in an inverted React Native list applies its own counter-transform. `chat-anchor`
- The opening position is computed from an unread boundary with a written fallback, and applied as the list's initial position rather than as a scroll after the first frame. `chat-open-position`
- Paging upward is triggered a written distance before the oldest row, its indicator sits above that row, and the position is held by item keys or the platform's maintain-position mechanism rather than by an index, and a page landing above the viewport leaves the row under the thumb where it was. `chat-history`
- Auto-scrolling on arrival is gated on a written distance from the newest end; past that distance exactly one pill appears, carries the user to the newest message, is dismissed by use or by reaching the end rather than by a timer, and carries a count only where the count is already in hand; and an arrival during an active drag moves nothing. `chat-new-arrival`
- A run of consecutive messages from one sender prints the sender's name and avatar at most once and a one-to-one thread prints neither, timestamps and day dividers are emitted on a written interval as section headers rather than rows, and every time value is formatted by the locale from a stored instant. `chat-grouping`
- Every message row wraps rather than truncates, holds a written maximum bubble width, renders an attachment-only message without an empty text container, aligns by leading and trailing, and its text can be copied. `chat-row`
- A conversation with no messages renders a sentence naming the other party and the first thing to send, and the composer takes focus on open only where the conversation has never held a message. `chat-empty`
- The composer declares a minimum and a maximum line count as numbers and scrolls past the maximum, sits above the keyboard through the platform's inset mechanism, has its height subtracted from the transcript, sends from a drawn control rather than the return key with that control disabled while the composer holds neither text nor an attachment, and keeps unsent text across leaving the screen. `chat-composer`
- Every message carries its own state from a written set covering at least sending, sent and failed; a failed one stays in place with a retry and does not block the queue; a send with no network becomes a queued row while the composer empties; and no state is carried by color alone. `chat-message-state`
- One attach control opens the platform picker rather than a hand-assembled menu of sources, a camera source is scored under `cam-system-first` rather than here, and a pending attachment is a transcript row with its space reserved and a transfer that outlives the screen. `chat-attach`
- One setting governs presence in both directions, the typing event is throttled to a written interval and expires on its own, and the indicator neither loops beside the transcript nor animates under reduced motion. `chat-presence`
- An arrival is announced once rather than once per message, through a polite live region on Android, Compose and the web and a posted announcement at low priority on iOS, the announcement names the sender and does not interrupt speech in progress, each row is one stop, and the composer and send control carry names. `chat-a11y`

Three of these are not settled by the file. On a device, page a conversation holding more than one screenful of history and watch whether the row under the thumb moves (`chat-history`); drive an arrival while scrolled a screenful up, and again while a drag is in progress, and watch whether the screen jumps (`chat-new-arrival`); and send and receive through one whole conversation with the screen reader running, as `a11y-test` requires of any flow (`chat-a11y`).
