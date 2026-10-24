# Tracking

Something the person started and then handed to the world: a meal being cooked and carried across town, a car on its way, a parcel between depots, a transfer clearing between banks, a booked journey, a laptop at a repair desk. The app does not do the work, it reports on it, and the report arrives in pieces from systems that lag, disagree and go quiet. The person checks it in glances, often from a notification, usually while doing something else, and decides from it whether to go downstairs, call someone or wait. Every rule here is about the gap between what the screen says and what is actually happening.

The surfaces outside the app belong elsewhere: the Dynamic Island and Live Activity are `widget-island`, their last frame is `widget-live-end`, an ongoing notification is `notify-ongoing` and where its tap lands is `notify-destination`. Cached content and its age is `state-stale`, relative time that ages on screen is `data-time-relative`, and a map that keeps the moving thing in frame is `map-follow`. Paying for the thing being tracked is `heuristics/payments.md`.

## <Rule id="track-stages" description="The process is a named list of stages, and the current one is said in words" />

A progress bar with no labels tells the person something is happening and nothing about what. The stages are what they plan around: accepted means it can still be changed, picked up means it is coming, at the depot means not today.

- The stages are named in the person's terms and listed in order, with the ones already passed, the current one and the ones still to come all visible on the screen.
- The current stage is said in text, and the screen reader reads it as the current one. Position on a line, a filled dot or a coloured segment is decoration on top of that (`color-not-alone`).
- A stage that was skipped, failed or repeated is drawn as what it was. A parcel that went back to the depot does not show an unbroken line to the door.
- Each passed stage carries the time it was reached, because "picked up at 18:40" answers a question "picked up" does not.

## <Rule id="track-estimate" severity="p1" description="An estimate is a range with the time it was made, and it says when it moves" />

A single minute figure promises a precision no courier, driver or clearing system has. The person reads it as a commitment and acts on it.

- Show the estimate as a window, 18:40 to 18:55 or 2 to 3 working days, at the precision the source actually has (`data-precision`).
- The estimate states when it was computed, either beside it or through the freshness `track-fresh` asks for.
- When it changes by more than its own width, the screen says that it moved and which way, rather than replacing the number silently. A delivery that was due at seven and is now due at eight reads differently to someone who saw seven.
- Nothing counts down from data that stopped arriving. A countdown is computed from the estimate and the clock, and once the estimate is older than its update interval, the countdown stops and the screen shows the last estimate as last known (`data-time-relative`).

## <Rule id="track-fresh" evidence="device" description="A live status carries its age, and a lost connection shows the last known state as last known" />

The screen is updated by a feed the app does not control. A courier's phone in a lift, a tunnel or a basement stops reporting, and the dot on the map stays exactly where it was, looking live.

- Every position and every status carries the instant it was reported, and the screen shows that age once it passes the feed's normal interval (`state-stale`).
- The live update is the information, so it is the essential case `motion-loop` allows and owes no pause control; what it owes instead is that the update moves numbers and positions in place, never the layout, and that a screen reader hears changes only at the milestones `a11y-announce` names.
- A moving marker whose last report is old stops looking live: no pulsing, no smooth interpolation toward a guess, and a label with the age. Following it on the map is `map-follow`'s mode, and that mode ends when the data does.
- The person's own connection dropping is a different fact from the other side going quiet, and the two are said differently: one is "you are offline", the other is "no update from the driver for 6 minutes".
- Refreshing does not need a pull. The screen updates itself while it is open, and a manual refresh, if offered, is a second route (`list-refresh`).

## <Rule id="track-late" severity="p1" description="Late, stuck and waiting on someone are drawn states, never a frozen estimate" />

Things go wrong in the middle of a process far more often than at its start, and the default failure is the screen that keeps showing the original plan after the plan is gone.

- Late is a state the screen enters when the estimate passes without the stage changing. It says so, with the new estimate where there is one and without one where there is not.
- Stuck is a stage that has not moved in longer than it normally takes. The screen says how long and what the app is doing about it.
- Needs action is a state that names the person who has to act and what they have to do: confirm an address, be present for a signature, upload a document, answer the driver. When it is the person themselves, the action is on this screen, not behind a menu.
- Each of these states says what happens next: it will be retried, it will be refunded, support will call, or nothing until the person does something. A state with no next step is a dead end (`state-error`).

## <Rule id="track-contact" description="The other side can be reached from the screen for as long as the process runs" />

When something goes wrong in the middle, the person needs whoever is holding their thing, and they need them now, on this screen.

- The courier, the driver, the shop or support is one tap away from the tracking screen while the process is running, and the control says who it reaches.
- Calls and messages go through masked numbers or in-app messaging where the service offers them, so neither side's personal number is exposed (`priv-shoulder`). The other side's name and photo are enough to recognise them, and nothing more of theirs is shown.
- After the final state, the direct channel closes and a support route takes its place. A driver's number that still works the next day is a privacy leak in both directions.
- A message thread opened from here is a conversation and follows the `chat-` prefix.

## <Rule id="track-change" description="What can still be changed is on the screen with its cutoff, and past the cutoff the control says why it is gone" />

Every process has a point after which the address cannot change and the order cannot be cancelled. The person learns where that point is either before it passes or after it is too late.

- Cancel, change the address, change the time and add an item are on the tracking screen while they are still possible, each with the moment they stop being possible.
- Past the cutoff, the control stays where it was and says why it is no longer available, rather than vanishing (`button-state`). Something that was never possible for this process is absent, not disabled.
- A cancellation that costs money says how much on the control or in the confirmation, before the tap (`fb-confirm-test`).
- A change requested is pending until the other side accepts it, and reads as pending (`state-queued`).

## <Rule id="track-final" description="The final state stays reachable with its time and its receipt" />

Delivered, completed, cancelled and refunded are where the process ends, and they are also where disputes start: the parcel that says delivered and is not there, the refund that never arrived.

- The final state names itself, the time it was reached and, where the service records it, the evidence: a photo at the door, a signature, a reference number, the amount refunded and where it was sent.
- The process remains reachable after it ends, in a history the person can find from the place they started it, for at least as long as a dispute could be raised.
- Reporting a problem starts from the final state of this process, with the process already attached, not from a general help page.
- A rating ask is optional, comes after the final state is shown, and never stands between the person and the receipt (`fb-review-prompt`).

## <Rule id="track-entry" evidence="device" description="A notification, a widget or a live surface opens this process's screen, even from a cold start" />

Most visits to a tracking screen start outside the app: the stage changed and the phone said so. The tap has one job, which is to show that process now.

- Every outside entry point carries the process's identifier and lands on its tracking screen, not on the home screen or the list of orders (`notify-destination`, `widget-tap`).
- The landing is rebuilt from a killed process, with the screens above it in place so back goes somewhere sensible (`nav-deeplink`).
- The screen shows the latest state on arrival, fetched before or while it draws, and never the state the notification described if a newer one is already in hand.
- A process that has since ended lands on its final state, not on an error saying it is no longer active.

## <Rule id="track-outside" description="The live surface outside the app says the same thing as the screen inside it" />

The person sees the lock screen more often than the app while waiting, and the two disagreeing is the fastest way to stop trusting either.

- The live surface, the ongoing notification and the in-app screen read the same stage and the same estimate from the same source, updated by the same event (`widget-island`, `notify-ongoing`).
- The outside surface carries only what fits a glance: the current stage in words, the estimate window, and at most one action.
- When the process ends, the outside surface shows the final state and then leaves, on the schedule `widget-live-end` sets, rather than disappearing at the last update or lingering on a stage that has passed.
- A process the person dismissed from the lock screen is still running, and the app does not post it again unless the stage changes.

## <Rule id="track-several" description="Several processes at once are each named and each reachable" />

Two parcels, a ride and a food order can run at the same time, and the person has to tell them apart at a glance.

- Each running process is listed with what it is, in the person's terms, and its own stage and estimate. Three items from one shop, two shops in one basket and two baskets are three different shapes, and the screen says which one it is showing.
- Nothing is merged into one combined estimate or one combined progress bar, because the earliest arrival and the latest one lead to different decisions.
- A notification or live surface for one process names that process, so the person does not open the wrong one.

<Check>

<Verify rule="track-stages">The stages are named and listed in order, the current one is said in text the screen reader reads as current, skipped or failed stages are drawn as such, and each passed stage carries its time.</Verify>
<Verify rule="track-estimate">Every estimate is a window at the source's precision, states when it was computed, a move larger than its width is announced with its direction, and no countdown runs past the estimate's update interval.</Verify>
<Verify rule="track-fresh">Every position and status carries its report time, the age is shown past the normal interval, a stale marker stops animating as if live, the person's offline state and the other side's silence are worded differently, and the screen updates itself while open.</Verify>
<Verify rule="track-late">Late, stuck and needs-action are distinct drawn states, each says what happens next and who acts, and an action the person owes is on the tracking screen.</Verify>
<Verify rule="track-contact">The other side is one labelled tap away while the process runs, through a masked channel where the service has one, and the direct channel closes at the final state in favour of support.</Verify>
<Verify rule="track-change">Every change still possible shows its cutoff, a control past its cutoff stays and says why, a paid cancellation states the cost before the tap, and a requested change reads as pending until accepted.</Verify>
<Verify rule="track-final">The final state shows its time and evidence, stays reachable in a history for the dispute window, reporting a problem starts from it with the process attached, and any rating ask comes after the receipt and can be skipped.</Verify>
<Verify rule="track-entry">Every notification, widget and live surface tap carries the process id and lands on its tracking screen with the latest state, from a killed process, with back leading somewhere sensible, and an ended process lands on its final state.</Verify>
<Verify rule="track-outside">The live surface, the ongoing notification and the screen show the same stage and estimate from one source, the outside surface holds the stage, the window and at most one action, and it ends on the final state.</Verify>
<Verify rule="track-several">Concurrent processes are listed separately with their own stage and estimate, nothing is merged into one figure, and each outside surface names its process.</Verify>

<Device>Two of these are settled only on a device. For `track-fresh`, cut the feed or put the device in airplane mode mid process and watch the marker and the estimate: they have to stop looking live and show their age, and the two kinds of silence have to read differently. For `track-entry`, force stop the app, then tap a stage notification and a live surface: each has to land on that process's screen with its latest state and a back stack above it.</Device>

</Check>
