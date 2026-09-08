# States

A screen has the one state its author looked at and five or six the user meets. Generated screens render as though the data is already there: the list is full, the request succeeded, the radio is on, and nothing was ever interrupted. That screen is finished for the screenshot and unfinished for the device.

The phone is where the gap costs most. The connection comes and goes inside a single session, in a lift, a tunnel, a train, a carrier handoff or a hotel portal that connects to nothing. The OS takes the app away for a call and can kill the process while it is gone. And there is one surface, so a region that fails has nowhere else to be.

Every state below needs its own words and its own way forward. A generic message is the same as no state at all, because it leaves the user with nothing to do next.

## `state-set` Six states, named before the happy path is written

For any screen that loads, sends or stores anything, write the line it shows in each of six: **loading**, **empty**, **error**, **offline or stale**, **partial**, and **permission denied or read only**. Produce that list while framing the screen in `flow/build.md`, before the layout exists.

A screen that cannot enter a state answers it as not applicable and says which: no network call means no offline and no stale, a single indivisible payload means no partial, no protected capability means no permission state. Every state the screen can reach is owed its line, and "not applicable" is a claim a reviewer can check, while a blank is not.

Half of the six are conditions the device imposes rather than paths the user chooses, which is why they never show up while writing the happy path and always show up in a hand. A state discovered afterwards arrives as a branch bolted onto a layout built for one case, and it shows.

## `state-loading` A placeholder in the shape of the content, never a spinner over it

The first load draws the real layout with its content replaced by blocks: same row height, same position for the thing the user is waiting for, and roughly as many as fill the screen, since the length of the response is not known yet. `list-states` owns the count inside a list. iOS has `.redacted(reason: .placeholder)` for exactly this. A placeholder whose geometry does not match shifts the layout at the moment the data lands, and in a narrow column that moves a target sideways under a thumb already coming down.

- A spinner is right in two places: inside the control that was tapped, which is `button-state`, and where the layout genuinely is not known yet. A spinner covering the whole screen is not a loading state, it is the absence of one.
- Under 300ms, show nothing. Once it is shown, hold it 500ms even if the data arrives sooner. The threshold alone produces the flicker it exists to prevent, on every response that lands a moment after it.
- Past ten seconds, indeterminate stops being honest. Name the stage or count what is done, and offer a way out of the wait, because the only other exit a phone user has is the force quit.
- The stacks already impose the ceiling: `URLSession` gives a request 60 seconds, OkHttp gives connect, read and write 10 seconds each. The half nobody writes is what happens when the ceiling is hit. Write that branch, or the timeout expires into the same animation and the wait has no end after all.
- Three loads look different: first load fills the screen with the placeholder, refresh keeps the current content and marks it as updating, and loading more is `list-states`, which owns pagination and pull to refresh.
- The transition is announced, not only drawn. Loading, loaded and failed are silent to VoiceOver and TalkBack unless the region is marked live: `liveRegion` in Compose semantics, `accessibilityLiveRegion` on Android views, an announcement notification on iOS.

Acknowledging the tap comes before all of this and belongs to `touch-feedback`.

## `state-empty` Three different empties, three different sentences

- **Nothing yet.** First run, and the only one of the three that is a teaching screen: say what will live here and give the single action that puts the first item in it.
- **Nothing matched.** A search or a filter excluded everything. The way out is clearing it, so the filter stays visible and the action offered is removing it, not creating something new.
- **Genuinely zero.** No unread mail, nothing owed, nothing overdue. This is usually good news and should read like it, with no call to action invented to fill the space.

Printing "No results" for all three is the tell. The first leaves a new user with no idea what the app is for, the second hides the filter that is doing the excluding, and the third turns success into a reprimand.

## `state-error` Say what failed, and do not guess at why

There are four failure classes and they are not interchangeable: the radio has nothing, the request ran out of time, the server answered with a fault, or the server understood and refused. Sort them by the move they leave the user, and write one sentence per move: nothing connected sends the user to the connection, timeout and server fault both land on retry and may share a sentence, and a refusal needs something changed or somebody asked, which retry will never fix. One shared sentence for all four leaves the user with no move to make and, more often, with the wrong one.

- A cause you did not verify is a false instruction. Blaming the network for a fault the server reported sends someone to power-cycle a router that is fine.
- Never dress a failure as an empty. "No messages" and "could not load messages" are opposite claims, and code that returns an empty list on failure makes them identical on screen.
- The message lands where the failure is: at the field for a field, in the region for a region, on the screen for the screen. `heuristics/forms.md` owns field-level validation. A modal alert for something that could be said inline charges the user an interruption, and a message that is only drawn never reaches a screen reader: the region it lands in is live, or the message is posted as an announcement.
- No status codes, no exception names, no stack. Those go to the log, not into the sentence.

## `state-retry` A retry that loses what was typed is a second failure

- The manual retry is always present and always visible once something failed. Automatic retry does not replace it.
- Retrying returns to the same state: the input, the selection, the scroll offset, the sheet that was open. On a phone the typed content is the expensive part, thumbed in one character at a time, and it is never recoverable from anywhere else.
- Retry only what failed, not the whole screen.
- Automatic retry backs off and then stops, and it fires on the platform's reconnect signal (`NWPathMonitor`, `ConnectivityManager.NetworkCallback`) rather than on a fixed timer. A loop on an interval spends battery the user will attribute to this app. That signal is allowed to drive retry and prefetch. It is never allowed to drive the message, which is `state-offline`.

## `state-offline` Four network states, not two

1. **Online and fast.** The one everything was built and demonstrated in.
2. **Online and slow.** The most common and the least designed. It has no branch of its own, so what carries it is the ceiling in `state-loading` and whatever renders when that ceiling is hit.
3. **Offline with a cache.** The app still works, in a reduced form, and says so.
4. **Offline with nothing cached.** The only one that earns a full-screen message, and even that one names what is still possible.

Tell the user when what they can do changes, not when the radio changed. The message waits on a failed request and never on the connectivity callback, because a path reporting satisfied means a radio came up, not that a server answered: that is the hotel portal at the top of this file. Most drops are over in seconds, and a bar that appears for each one is a bar the user stops reading by the second day. Which parts of the app keep working without a network is a decision written down, not whatever happens to be in memory.

Across all four, the OS may report a constraint the user asked for: Low Data Mode (`NWPath.isConstrained`, `allowsConstrainedNetworkAccess`), Data Saver (`ConnectivityManager.getRestrictBackgroundStatus()`), Low Power Mode (`ProcessInfo.isLowPowerModeEnabled`, `PowerManager.isPowerSaveMode()`). Where one is set, autoplay stops, prefetch stops, images come at the smaller size, and the screen says what it is holding back with a way to ask for it anyway. A screen that never reads the flag spends a metered radio the user explicitly asked it not to spend.

## `state-stale` Cached content carries its age

Show the content and say when it was fetched. "Updated 2 hours ago" beats a spinner, and it beats a stale number presented as current by more than that.

How fast a screen goes stale is per screen: a price, a balance or an arrival time is wrong within seconds, an article is not. Pick the threshold, and mark staleness with a word rather than a dimmed color alone, which is `color-not-alone`.

## `state-queued` Anything the server has not confirmed reads as pending, not as done

Optimistic updates are right on a phone, because waiting for a round trip on a slow radio makes the whole app feel broken. The optimism has to be reversible in the interface as well as in the data.

- Draw the item as pending. When it fails, roll it back where the user is looking, keep the content, and offer the fix there. An item that vanishes into a sync error is the worst outcome on this page.
- Pending is a property of the item, not of a screen somewhere else: the item says it is waiting and offers a way out of it in place. An aggregate queue surface is owed only where more than one action can be outstanding at once.
- Confirmation lands in something that stays. When the server accepts, the item stops being pending and names what changed, in a form that survives the user looking away. A screen that goes quiet after a submit has confirmed nothing, and neither has a toast that dismisses itself, so nothing irreversible or financial is confirmed by one alone.
- A queued action survives a force quit, or it was never queued.
- Destructive actions do not queue silently. A delete that syncs an hour later has outlived its undo, and undo is the mechanism `touch-destructive` relies on.

## `state-partial` Some of it arrived, so show that

One region failing does not take the screen down. Render what loaded, mark the region that did not, and let that region retry by itself.

The phone shows one thing at a time, so replacing the whole screen because an avatar, a price chart or a recommendation strip failed costs the user everything that had already arrived, and the thing they came for is usually in the part that worked.

## `state-permission` Denied is a state with a way forward, never a dead end

Ask at the action that needs it, with a plain reason shown before the system sheet. The two platforms count the asks differently. On iOS the system dialog appears once per permission, and after a denial the only route back is Settings. On Android the second Deny is the one that makes it permanent, and `shouldShowRequestPermissionRationale` is what tells you a second chance is still there. Either way the asks are few and finite, so a prompt fired at launch spends one on a screen with no context.

- Denied leaves a working app with less in it: manual entry instead of the camera, a typed address instead of location, and the system picker that needs no permission at all where one exists.
- The recovery path is the system Settings page, deep linked from the app, next to the sentence saying what to turn on. A permission is not an app preference, and a duplicate switch for it inside the app's own settings goes out of sync with the real one.
- Read only belongs here too: viewing allowed and editing not. `button-state` starts by leaving the control live and answering on tap with what is missing; where it genuinely has to be disabled, that rule's fallback applies and the reason sits beside it rather than being left to be inferred.
- No screen is a wall that cannot be left without granting.

## `state-interrupt` The phone takes the app away mid task

A call, a notification pulled down and an app switch stop the screen without destroying it, and the OS carries what is in memory through all three for free. Two events do not, and they are the ones this rule is about: a configuration change (rotation, multi-window, and the text size and theme changes `type-scaling` sends you to go and set), and the system killing the process while the app is in the background.

- Hold the unsent input, the scroll offset and the current step where the system can save them: `rememberSaveable` and `SavedStateHandle` on Android, `@SceneStorage` and the `scenePhase` transitions on iOS, `RestorationMixin` in Flutter. A configuration change loses anything held only in the view; process death loses anything held only in memory.
- Where the user lands on return is `nav-restore`, which owns the restored place: destination, stack, scroll, selection and filters. The values in a form, the focused field and the abandoned draft are `form-persist`. What is left here is the lifecycle: saving where the system says to save, and saying so when something did not make it back.
- If something was lost, say so. A form silently emptied claims nothing happened, and the user finds out by reading it back.
- Long work resumes rather than restarting from zero, and a cancelled screen cancels its own requests and timers on the way out.

## Check

Review answers each of these against the code, pointing at the line:

- Every state the screen can enter has a line in the code, and each one it cannot is answered as not applicable with the reason. `state-set`
- First load draws a placeholder matching the final layout, no spinner covers the screen, nothing appears under 300ms or leaves within 500ms of appearing, ten seconds names a stage and offers an exit, the timeout has a written branch behind it, and the transitions are announced. `state-loading`
- The three empties render three different sentences, with an action on the first two and none invented for the third. `state-empty`
- There is a message per next action, with connection and refusal never sharing one, no cause is asserted that was not verified, no failure renders as an empty, no message carries a status code, and the message reaches a screen reader. `state-error`
- A visible manual retry exists, retrying restores the input, the selection and the scroll position, and automatic retry backs off, stops, and never writes the message. `state-retry`
- Offline is handled as slow, cached and uncached rather than as a boolean, the message is triggered by a failed request rather than by the radio, and the constrained, metered and power-saving flags are read where media and prefetch run. `state-offline`
- Content that decays (a price, a balance, an arrival time, a count, availability) carries its age against a threshold that exists as a named constant; screens outside that set answer not applicable. `state-stale`
- Unconfirmed actions render as pending with a way out on the item itself, a failed one rolls back on screen with the content kept, and a confirmed one names what changed in something that does not dismiss itself. `state-queued`
- A failed region marks itself and retries alone, leaving the rest of the screen. `state-partial`
- Permissions are requested at the action with a reason, denial degrades to a working screen, and the route back is a deep link into the system Settings page. `state-permission`
- In-progress work survives a configuration change and a system-initiated process death. `state-interrupt`

`state-offline` and `state-stale` are answered on a device with the network actually off. `state-interrupt` is answered against a rotation and a kill the system would have made itself, using Don't keep activities or `adb shell am kill`, never a swipe out of the recents list: that gesture is the user asking for a clean start, and nothing is meant to come back from it. `state-queued` is the one that keeps the recents-swipe test, because persisted work is exactly what has to outlive a dismissal. Nothing in the file proves any of them, and a state that was never entered is unrun rather than passing.
