# Feedback

The app has something to say to somebody who is already holding the phone and looking at the screen. There is one screen, so every message is taken out of the content it covers, and the vehicle is the whole decision: an interruption costs the user the task, and a message that expires costs them the fact.

The ladder runs from nothing at all up to a dialog that stops everything, and the rungs are not interchangeable. A message that arrives from outside the app is `heuristics/notifications.md`, and the state a failed screen sits in is `state-error`. Wording is owned by the rules that already hold it: `button-label` for the answers, `l10n-strings` for every sentence that ships. This file owns which vehicle carries a message while the user is in the app, where it lands, and how long it lives.

One structural fact decides half of this. Android ships a transient actionable message as a component, with a host that positions it and decides what becomes of the next one. Apple ships none: it has alerts, action sheets and inline status, and nothing that slides in and leaves. Anything transient on iOS is a component somebody in this codebase has to build and maintain, which is a cost worth knowing before the design assumes one.

## <Rule id="fb-ladder" description="Four rungs, and the first one is nothing" />

- **Nothing.** The result is already on the screen. The row disappeared, the toggle moved, the total changed.
- **Inline.** A line inside the region it is about, which stays until it stops being true.
- **Transient.** A message over the content that leaves on its own, for something the interface cannot show by itself. On Android that is the snackbar host and never a `Toast`: a toast takes no action at all, so it cannot carry the retry or the undo that has to travel with the message, and in an app targeting API 31 or higher it is limited to two lines with the app icon beside them. Anything the user might act on goes to the snackbar while the app is in front, and while it is not, what arrives from outside and how it lands on return is `notify-inapp`. Every host that exists exposes exactly 1 action, so a message needing two answers has outgrown the rung; a component built here takes as many as it is handed and has to hold that count itself.
- **Blocking.** A dialog, for a decision that cannot be deferred.

Take the quietest rung that still does the job, and climb only with a reason. Every rung up spends more of a screen the user came here for something else. Nothing the app has to say blocks the launch: an app that puts an informational dialog of its own in front of the first screen has spent its one interruption before the user has done anything. The single system prompt a required resource is allowed there is `onboard-ask-order`. The other thing allowed there is not a message at all: where the user genuinely cannot proceed for a stated external reason, a required update or a consent that has to be given again, that is a screen of its own saying what is required and what they can do about it, never a dialog laid over a first screen they are not allowed to use.

Count the blocking dialogs one flow can raise. More than one is a design problem rather than a messaging problem, and splitting the flow is what fixes it where rewording never will.

## <Rule id="fb-silent-success" description="The screen showing the result is the confirmation" />

People expect what they did to work, so the outcome worth reporting is failure. A message reading "Saved" over a screen that already shows the saved value is decoration that lands across the bottom of the screen, which is exactly where the next tap was going.

Confirm explicitly only what the screen cannot show: money moved, something went to another person, a file left the device, an item was removed from a list the user is no longer looking at. Anything irreversible or financial takes the confirmation `state-queued` already specifies, which no transient rung can be.

## <Rule id="fb-confirm-test" description="Uncommon and irreversible, both at once" />

Destructive is not the test. Both halves have to be true before an alert stops the user: the user does this rarely, and nothing brings it back. Deleting one photo out of ten thousand is destructive, common and recoverable, so it happens and offers undo. Deleting the account is rare and final, so it interrupts.

A common action that cannot be undone is not exempt, it is a different surface: offering the user choices about something they deliberately started is the sheet case in `fb-blocking-shape`, not a lighter alert. Discarding a draft the user just chose to abandon is that case, and it is common.

On a phone the accidental destruction arrives through a fat tap or a swipe rather than through a menu, so recovery matters more than the extra question, and `touch-destructive` already puts distance between the destructive control and the frequent one. Where the destruction is what the user deliberately chose, the button carrying it out is not styled as the destructive one: it is performing their intent, and the escape beside it is what needs the emphasis.

## <Rule id="fb-undo" description="Either the work waits inside a real window, or it lands somewhere it can be fetched back from" />

Two shapes are honest and there is no third. Either the work has not committed yet and the window is the delay before it does, or it commits at once into a place the user can reach and take it back from, a trash, an archive or a recently deleted, where the restore is guaranteed to work. What is banned is the commit with nothing behind it: fire the delete, keep the Undo on screen, and undo becomes a re-create against a server that has already forgotten, which fails differently and sometimes silently.

- Write the window down in `STACK.md` and let it be the authority: a number where the host takes one, and the host's own named length where it takes only a name, in which case the window is however long that name lasts and no second number is invented beside it. The message offering undo never outlives the window, and the work commits when the window closes, when the message is dismissed, or when the user leaves the screen or backgrounds the app, whichever comes first. A visible Undo whose commit already fired, with no destination behind it, is the failure this rule opens by banning.
- Undo reaches as far as the action did. A delete that has already gone to the queue is past its window: `off-destructive-offline` and `state-queued`.
- A system gesture is not the only route. Shake and the three-finger swipe are invisible and undiscoverable, so undo is also reachable without one: the action on the message, a button in the bar or toolbar, or a named custom action on the affected node, which is what `a11y-gesture` asks for. The system gestures keep working alongside it, and nothing here redefines them.
- A screen where the user makes many small edits owes an undo stack, not one slot that the second edit overwrites.

## <Rule id="fb-place" description="The message lands on the smallest thing that contains it" />

`state-error` sets this scope for failures and `form-error` for fields. What this rule adds is that everything else obeys it too: a confirmation, a limit reached, a setting that took effect, all land on the smallest surface that contains the cause, and a fact about a single control never takes the whole screen. Anything that could be said next to the control is not a dialog, and a dialog raised for a fact is a dialog raised for nothing.

The transient rung is the one that cannot obey. Its surface is fixed at the bottom edge, so it answers a control in the top bar from as far away as the screen allows, and it answers the bottom bar from under the thumb that just left. `layout-overlays` owns where it stacks and `touch-feedback` keeps the result off the touch point; what is left here is the choice of rung. A message that has to name its cause to make sense is inline, not transient.

## <Rule id="fb-duration" description="The host owns the duration, and where there is no host the component declares one" />

Hosts come in two shapes and the rule differs by shape. A named host takes short, long or indefinite and nothing between, which is Compose Material3: ask it by name, and accept that an exact number cannot be expressed through it at all. A numeric host takes a duration, which is the Flutter snackbar and the Android view snackbar, the latter also accepting its two names. Even the names disagree across hosts in one design system: the view snackbar runs 1500ms and 2750ms where Compose starts at 4000ms and 10000ms. So a duration never comes from the screen. It is the host's name, or it is one number written in `STACK.md` and read from there by every call that needs one.

Where none exists, which is every hand-built bar and every transient message on iOS, the choice does not disappear, it moves: the codebase owns one component, and that component fixes the duration, the dismissal and the announcement for the whole app in `STACK.md`. A screen that passes its own milliseconds has reinvented the host badly.

- Where the host does not apply the user's timeout, apply it: `getRecommendedTimeoutMillis` on Android takes the original duration plus flags for icons, text and controls, and Compose reaches the same thing through the accessibility manager. A component built here asks the same service before it starts a timer of its own.
- A message offering an action does not race the person reaching for it. Compose defaults an action-bearing snackbar to indefinite, so it stays until it is used or dismissed, and code that assumes it clears itself leaves it on screen. A hand-built bar carrying an action makes that call deliberately, because nothing sets it a default.
- Every transient message is dismissible by the user. On the Android view system swipe to dismiss only exists when the host is a `CoordinatorLayout`, so outside one, and in anything built here, there is a close affordance or there is no way out.
- Nothing exists only inside it: retry, undo and the detail behind the message all keep a permanent home, which `a11y-alt-input` already requires of anything that dismisses itself on a timer. What the phone adds is the rotation, after which the bar is gone for good and the user who was mid-step never sees it again.

## <Rule id="fb-reach" description="A message that is only drawn, or only felt, was not delivered" />

The route differs by platform and both count as delivery. Where there are live regions, on Android views, Compose and Flutter, the region carrying the message is marked live, and on Android that is the only route left now that `announceForAccessibility` and the `TYPE_ANNOUNCEMENT` event are deprecated. iOS has no live region, so the message is posted as an announcement instead. `a11y-announce` holds the mechanics and the polite versus assertive call. A platform snackbar host speaks its own text. A bar built by hand out of a positioned view is drawn and never announced: its words sit in the tree, reachable by exploring for them, and nowhere in the user's ear until it takes whichever of those two routes its platform has.

Haptics accompany a message and never carry it. `touch-feedback` owns the vocabulary and `sense-haptic` the hardware and the switches under it, so the rule here is only the pairing: a success or error pattern fires alongside something visible, never instead of it, because the phone is as often on a table as in a hand. Color follows `color-not-alone`.

## <Rule id="fb-queue" description="Coalesce by cause, and drop the backlog rather than replaying it" />

Three requests in flight on a slow radio come back as three failures within a second of each other. How many may be on screen is `layout-overlays`, and iOS asks that two alerts are never up at once, so the design question here is not the visible message, it is the other two.

- Coalesce by cause. Three failures of the same kind are one message with a count, not a queue three deep. No host does this for you, and the two Android ones fail in opposite directions: the view host shows one at a time and dismisses whatever was there, so an uncoalesced message is lost without a trace, while the Compose host serialises them and suspends each call until the one in front has been dealt with, which is the stale backlog the next bullet bans and which wedges behind an action-bearing message that never times out by itself. Coalescing is code on every stack, and cancelling what is already pending is half of it.
- Drop what has gone stale. A message about a screen the user has already left never shows, and a backlog that plays back after they move on describes a past they cannot act on.
- Stacking above the bottom bar, the floating button and the inset is `layout-overlays`.

## <Rule id="fb-survives" description="A confirmation the user never saw did not happen" />

Rotation rebuilds the screen, the system reclaims the process while it is in the background, and both are ordinary on a phone. A message fired as a side effect during a build or a composition either vanishes on the rotation or fires again on every one, and both versions ship.

Hold the message as state with a consumed flag, so it survives the rebuild once and only once. A blocking dialog is state under the same rule, including whatever action it is holding: an alert reconstructed after a process death with its callback gone is a dialog whose buttons do nothing. Where the screen itself comes back is `nav-restore`, and what the app admits it lost is `state-interrupt`.

## <Rule id="fb-blocking-shape" description="If it has to block, it is small, finite and escapable" />

- Pick the surface before the wording. A yes or no about one irreversible thing is an alert. Anything offering choices about an action the user deliberately started is not: that is an action sheet (`confirmationDialog` in SwiftUI), whose stack puts the destructive choice at the top and the escape at the bottom, or, on Android, a dialog or a bottom sheet, where the choices are a row of roles rather than a stack: the confirming action, the dismissive one beside it, and a third only where a real third answer exists. Building every confirmation as an alert spends the loudest surface on the ordinary case.
- At most 3 buttons. On Android the builder settles it: one positive, one negative, one neutral, and no fourth slot to fill. Nothing on iOS enforces the ceiling, so there it is a rule the code keeps by itself. A fourth choice on either platform means the surface is a sheet or a screen.
- A cancel is present whenever one of the options destroys something, it is not the default, and it sits at the bottom of a stack or on the leading side of a row, away from the destructive one that `touch-destructive` keeps at a distance.
- It does not scroll. A dialog with enough content to scroll is a screen, so build the screen: scrolling under a row of buttons is an accidental tap waiting to happen.
- Buttons are named by their result, which is `button-label`. A dialog whose answers are yes and no makes the user reread the question to find out what they agreed to.
- No blocking progress. Android deprecated its progress dialog for the reason that decides this whole file, that it stopped the user touching anything while the work ran. Nothing about the other platform makes one better there. Waiting is `state-loading`, and a dialog over a dialog is `nav-modal`.

## <Rule id="fb-unprompted" description="An interruption the user did not cause starts at the bottom of the ladder" />

Every rung above answers something the user just did. A promotion, a paywall raised mid-session, a what's new sheet, a survey, a full-screen ad: nobody asked for any of it, so none of it gets the rung a real answer would.

- It takes the quietest rung that can carry it and never the blocking one. A dialog is for a decision the user cannot defer, and this is one they never opened. One surface is the stated exception, and only in the shape `ads-placement` earns: a full-screen ad closing a segment the user just finished, never standing in front of the next one, carrying the exit present in its first frame that `ads-close` requires. A rewarded ad is not an exception at all, because the user tapped the offer and it is no longer uninvited (`ads-rewarded`).
- It waits for a finished task. Firing at launch costs the user the reason they opened the app, and firing mid-flow costs them the flow.
- One tap closes it, the close is the plain one and not a trick, and the dismissal is remembered for a period written in `STACK.md` rather than asked again on the next screen.
- It never borrows the shape of a system message. An app promotion drawn as a permission prompt or a system alert is asking for a tap the user did not agree to give.

## <Rule id="fb-review-prompt" description="The ask for a rating is the loudest thing the app does" />

Use the system prompt and nothing else. The system rate limits it, at most 3 per app per 365 days on iOS and an unpublished quota on Play, so the app does not get to know whether anything appeared.

- No question in front of it. Asking whether the user is enjoying the app and routing only the happy ones onward is banned outright on Play, which allows nothing to be asked before or while the card is shown, and it costs the app the negative feedback it needed while spending the moment the system prompt was timing for itself.
- Not on a button. Both platforms say the ask does not follow from something the user tapped, and the prompt may not appear when it is called anyway, which leaves a control that does nothing. A deliberate ask opens the store listing on its write-a-review route instead.
- Not during a task, not during the first run, and not while something is being fixed. It goes after a moment that went well: `onboard-defer`.
- The card is shown as the system draws it, with nothing over it, around it, or removing it once it appears.

<Check>

<Verify rule="fb-ladder">Every message takes the quietest rung that works, no actionable Android message is a `Toast`, no transient message offers more than 1 action, and the only dialog standing in front of the first screen is the one `onboard-ask-order` allows. A flow raising more than one blocking dialog is reported as a problem with the flow rather than counted as a violation.</Verify>
<Verify rule="fb-silent-success">No success message duplicates a result the screen already shows, and the ones that remain are for outcomes the screen cannot show.</Verify>
<Verify rule="fb-confirm-test">Every alert that stops the user is both rare and irreversible, and everything else acts and offers undo.</Verify>
<Verify rule="fb-undo">Undo either holds the work for a window written down in `STACK.md` or commits into a place the user can restore from, the message offering it never outlives that window, and it is reachable without a system gesture.</Verify>
<Verify rule="fb-place">Each message sits at the smallest scope that contains its cause, nothing that fits beside a control is raised as a dialog, and a message that has to name its cause is inline rather than transient.</Verify>
<Verify rule="fb-duration">Every duration is the host's named length or the one number in `STACK.md`, never a value written at a call site, the user's accessibility timeout is applied, every message is dismissible, and nothing lives only inside one.</Verify>
<Verify rule="fb-reach">Every transient message is announced by its platform's own route rather than only drawn, and no outcome is carried by a haptic alone.</Verify>
<Verify rule="fb-queue">Repeats of one cause arrive as one message with a count, and a stale backlog is dropped instead of replayed.</Verify>
<Verify rule="fb-survives">Messages and dialogs are held as state with a consumed flag, so one rotation shows them once and not twice.</Verify>
<Verify rule="fb-blocking-shape">An alert is used only for a yes or no about one irreversible action, blocking surfaces carry at most 3 buttons, do not scroll, name their buttons by result, and never hold a progress bar.</Verify>
<Verify rule="fb-unprompted">Nothing the user did not ask for blocks or interrupts them, apart from the segment-boundary ad `ads-placement` allows: it waits for a finished task, closes in one tap, and stays closed for a stated period.</Verify>
<Verify rule="fb-review-prompt">The rating prompt is the system one, is not preceded by a question, is not wired to a button, and is not raised during onboarding.</Verify>

</Check>
