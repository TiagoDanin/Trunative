# Privacy on screen

A phone is used on a train, in a queue, and across a table. The person beside the user is close enough to read a six inch screen, has no reason to look away, and is part of the threat model in a way no desktop design assumes. On top of that the operating system photographs the app without asking, to draw the app switcher.

This file covers two things: what a stranger standing there can see, and what leaves the device as a record of what the user did. Asking for access to data is `permissions.md`. Identity and the session are `auth.md`. What a notification shows over a locked screen is `notify-lockscreen`; here the screen is unlocked and the app is the one drawing it.

Two of the platform capabilities below are weaker than they are usually assumed to be, and one does not exist at all on iOS. Design so the screen is safe without them, then add them.

## <Rule id="priv-shoulder" evidence="device" description="Show the shortest form of a value that still does the job" />

Take the inventory per screen: amounts and balances, one-time codes, card and account numbers, tokens and recovery phrases, health figures, home and precise addresses, legal or immigration status, and message bodies shown in a preview.

- The resting state is the shortest form that identifies the thing. The last four digits, the initials, a band instead of a figure. That short form is for a value sitting beside something else: a value the screen exists to show is already at its shortest form when it is shown in full, so the balance on the account screen somebody opened to read it is drawn plainly and gets a hide control, not a band.
- A value the interface never needs in full is not masked, it is truncated in the model before it reaches the view, and then there is nothing to leak.
- Where the whole value is genuinely needed sometimes, it rests masked and is revealed on request, which is `priv-reveal`.
- The mask is a fixed shape at a fixed width, not the real string with dots painted over it. Six dots against a six digit balance has masked the glyphs and published the magnitude.
- Masking follows the value everywhere it is drawn: the list row, the summary card, the search result, the share preview and the sample data in an empty state.
- Copying takes the whole value off the screen whatever the field was showing. The system preview drawn after the copy and the next app to read the clipboard both get it, so a copy control on one of these values marks the copy as sensitive, which is `share-copy`.
- Content the user wrote and opened on purpose is not masked. Blurring someone's own messages until they tap is theatre, it slows down the only person entitled to read them, and it is the version of this rule that gets the whole thing switched off.

## <Rule id="priv-reveal" evidence="device" description="Revealing is a deliberate act, and it ends by itself" />

- The control is a real target at the platform floor (`touch-floor`) and it carries its state, so a screen reader says hidden or shown rather than naming an eye (`a11y-name`).
- Nothing reveals on scroll, on a long press with no affordance, or because the screen finished loading. The user asks, every time.
- It reverts on leaving the screen, on the app going to the background, and after an idle period the product decides once. No platform publishes a number for that period, so choose it from what the screen holds and record it in `STACK.md` beside the re-authentication window `auth-reauth` keeps there.
- Revealing puts the value on the screen and nowhere else: not into a toast, not into a log, not into an announcement fired by an unrelated event.
- Where the reveal is itself the sensitive act, a recovery phrase or a full card number, put `priv-gate` in front of it instead of a toggle.

## <Rule id="priv-switcher" evidence="device" description="The switcher snapshot is taken without asking, so the cover goes up first" />

The system captures the last frame to represent the app in the switcher. The user never consented to that capture, cannot see it happen, cannot tell which frame was taken, and the image is written to storage rather than held for a moment. A balance left visible there is readable by anyone who picks up the unlocked phone.

- On any screen holding something from the `priv-shoulder` inventory, draw an opaque cover as the app leaves the foreground and take it down on return. A screen with nothing on that list owes no cover. Blur is not a cover: at thumbnail size a blurred number is still a number shaped mass in the right place, and a hand rolled blur ignores the reduce transparency setting.
- Which lifecycle callback runs before the capture is not something to assume. Background the app from the sensitive screen, open the switcher, and look at the thumbnail. That is the only result that counts.
- On iOS the cover is entirely app authored and hangs from the transition to the background. `applicationDidEnterBackground` on the app delegate, or the matching scene callback, is where to start, and the thumbnail check above is what settles whether it ran early enough. There is no API that suppresses the snapshot and no platform guidance on the subject, so a screen that needs a cover and does not draw one simply leaks.
- On Android, `FLAG_SECURE` already blanks the Overview thumbnail, so a screen carrying it for `priv-capture-block` needs no second mechanism. `Activity.setRecentsScreenshotEnabled(false)` (API 33) is the narrower control: it suppresses the Overview representation and nothing else, leaving the user's own screenshot untouched. `android:excludeFromRecents` drops the task from Overview altogether, which is a decision about how the app is re-entered rather than a privacy control.
- A cover is not a gate. Coming back through it restores the screen exactly as it was, so a screen that must not return unlocked needs `priv-gate` as well.
- Coming back after the process was killed is `nav-restore`, and the restored screen starts masked like any other.

## <Rule id="priv-capture-block" description="Blocking capture is a partial Android capability and no iOS capability at all" />

- Android's `FLAG_SECURE` keeps a window's content out of screenshots and off non secure displays. Google puts it at around 70% of devices reliably on Android 11 and lower, and says it is not reliable against an overlay attack. It raises the cost. It is not a guarantee, and a design that assumes it is has no fallback.
- It applies per window, so set it entering the sensitive screen and clear it leaving. Flagging the whole app also blocks every legitimate screenshot the user wanted, and Google suggests a setting that lets the user toggle the flag. Where the product ships that row, its default and the reason for it go down with the others (`set-default-first`).
- From API 35 `View.setContentSensitivity(CONTENT_SENSITIVITY_SENSITIVE)` marks one view rather than the window, and the hosting window is treated as secure for the duration of a media projection session. `CONTENT_SENSITIVITY_AUTO` reaches the same place from autofill hints, so tagging the username, password and card fields for autofill is also what hides them during a screen share (`form-autofill`).
- iOS publishes no equivalent. `isSecureTextEntry` hides the characters and disables copying, and Apple's own wording says it prevents recording and broadcasting only in some cases. That is a hedge, not a promise, and there is nothing else.
- Android 15 already hides password input from a remote viewer, redacts notification content during a screen share, and from QPR1 gives the user a status bar chip that stops the projection. None of that is worth rebuilding. What is left to the app is its own screen.
- The control that always works is composition. A full card number beside its security code, or a recovery phrase beside the account it belongs to, is a capture problem no flag repairs. Split the screen instead.

## <Rule id="priv-capture-detect" description="Screenshot detection lands after the pixels are gone, mirroring is known while it happens" />

- iOS posts a notification once a screenshot has been taken. Android 14 offers a per activity capture callback behind the install time `DETECT_SCREEN_CAPTURE` permission, and it fires only for the hardware button screenshot.
- Neither of those hands over the image, neither can refuse it, and both arrive after the shot was already taken. Detection is a notice. An app that treats it as protection has a security model made of a toast.
- Android shows the user its own notice when that callback fires, so tell them first, in context, as they enter the screen that watches. A system message nobody was expecting reads as an accusation.
- Whether the screen is being mirrored or recorded right now is a different question, and both platforms answer it while it is happening. iOS exposes the state as `UITraitCollection.sceneCaptureState` from iOS 17, superseding the deprecated `UIScreen.isCaptured`. Android 15 calls back as the app becomes visible or invisible inside a screen recording, through `addScreenRecordingCallback` and `SCREEN_RECORDING_STATE_VISIBLE`.
- What to do with that signal is the app's call, and the default is to hide the sensitive region rather than end the session under someone who is in a meeting. Playback is the exception Apple documents: a media app pausing and saying why is the right answer there, and it stays with `media.md`.
- Recording that a capture happened is instrumentation and obeys `priv-instrument`. It never records what was on the screen at the time.

## <Rule id="priv-gate" description="A second gate covers an area, never the whole app" />

The mechanism is `auth-biometric-session`: a device prompt re-authorizes a session that already exists. Which actions have to ask again is already `auth-reauth`, which lists revealing a full card or document number among them and keeps the window in `STACK.md`. What is left here is a privacy decision, and it is three questions.

- **What it covers.** The sensitive area, not the app: the account tab, the document, the phrase. Locking the whole app for the sake of one screen makes the frequent case pay for the rare one, and the user turns it off in a week.
- **When it re-locks.** On leaving the area, on the app coming back from the background, and after an idle period, on the window `STACK.md` already holds. A gate that only fires at cold start is decoration.
- **What it does not cover.** A gate with no `priv-switcher` cover is read straight off the switcher thumbnail of the screen behind it. Both, or neither is worth having.
- The way out stays open when the check cannot run. Sign out, deletion and support are reachable with the sensor unavailable or unenrolled, which is `sense-biometric`.

## <Rule id="priv-instrument" description="Nothing the user typed leaves the device in a log, a crash report or an event" />

Apple requires explicit consent and a clear visual or audible indication when an app records or logs user activity, and names screen recordings and other user inputs in that requirement. Session replay is therefore a store rule before it is a taste question.

- Write the event schema down and name every field. No field carries free text, the contents of a masked value, a token, a precise coordinate, or a full identifier where a stable hash does the job.
- Analytics and crash SDKs capture screens, taps and the view hierarchy by default, and that default is the whole failure. Put the sensitive views in the SDK's redaction list at the same moment the screen decides to mask them, and confirm it by replaying a captured session rather than by reading the configuration.
- A crash report carries state with it. Strip request bodies, credential bearing headers and every field the screen masks before it is sent.
- The debug log ships. A line that prints a response body is a leak the moment the phone is plugged into a laptop, and it is the cheapest of these to remove.
- Whether any of it crosses to another company is `perm-tracking`. The answer to that prompt does not change what is inside the payload.

## <Rule id="priv-delete-data" evidence="device" description="Deleting data and deleting the account are two different actions" />

`auth-delete` owns the account route and its obligations. This rule owns what the word delete promises the person tapping it.

- Where the app holds things the user can point at, a history, a document, a conversation, a downloaded set, deleting those is offered on its own. An app whose only delete is the account is asking someone to burn it down to clear a search box.
- Say which copy went. Dropping the row locally while the server keeps it is a lie the user discovers on their next device, and deleting server side while the phone keeps a cached copy is the same lie facing the other way.
- The on device leftovers are the part that gets missed: caches, thumbnails, drafts, search history, downloaded media and anything still sitting in the outbound queue. `off-cache-policy` says what is stored, and the delete has to reach all of it.
- Delete means gone, not hidden. On the account route Play requires the associated user data to be removed rather than the account frozen, and a per-object delete that flips a flag and leaves the row in place is the same failure at smaller scale.
- Anything retained is named as a thing with its reason beside it, in a sentence: the invoices stay because tax law keeps them. A link to a policy page is not an answer to somebody whose thumb is already on the button.
- It is a one way row and sits with the other one way rows (`set-destructive`). A short window in which the work can still be called back beats a second confirmation dialog (`fb-undo`).

## <Rule id="priv-declared" evidence="device" description="The store declaration is derived from the code, not from intent" />

Both stores require this and both require it to be accurate, and each asks for two separate things. Play requires a complete data safety section for every app, consistent with the privacy policy. Apple's counterpart is the privacy details submitted with the app, which the store then shows on the product page: what is collected and what it is used for. Alongside that, Apple requires a privacy policy linked in the store metadata and reachable inside the app, identifying what is collected, how, every use of it, and the retention and deletion terms.

- Derive it from the requests the app actually makes and from the dependency list, never from what the feature was meant to do. Every SDK collects on its own account, and that collection is the app's.
- Both forms live in the consoles, where nothing in the repository can be compared against them, so what was filed is written into `STACK.md` beside the dependency list it came from: one line per data type, naming the SDK or the endpoint it comes from and the use declared for it.
- Adding an analytics, advertising, attribution or crash dependency is a change to the filing. A diff that adds one and leaves the declaration alone ships out of date.
- Collection with no system prompt in front of it still owes the user a disclosure, and Play requires it inside the app during normal use rather than in the listing or behind a settings screen. The permission case is `perm-rationale`; this is the case with no dialog to attach to.
- The policy is reachable from inside the app and not only from the store listing; the row that holds it is `set-account-exit`.

## Check

Review answers each of these against the code, pointing at the line:

- Every sensitive value on the screen is drawn in the shortest form that identifies it, and the mask is a fixed shape rather than the real string covered up. `priv-shoulder`
- Reveal is an explicit, named, labelled action that reverts on leaving, on backgrounding and on a written idle period. `priv-reveal`
- Every screen holding something from the inventory covers itself as the app leaves the foreground: an opaque cover removed on return on iOS, that cover or `FLAG_SECURE` on Android, and somebody has looked at the switcher thumbnail to confirm it. `priv-switcher`
- Capture blocking is scoped to the screen that needs it, is not relied on as a guarantee, and no screen puts two halves of one secret together. `priv-capture-block`
- Capture detection is used as a notice the user was warned about, never as protection, and the live mirroring signal is read on both platforms and answered by hiding the region rather than by ending the session. `priv-capture-detect`
- The gate covers an area rather than the app, re-locks on background and idle, and ships together with the switcher cover. `priv-gate`
- No log, crash report, analytics event or replay session carries typed text, masked values, tokens or full identifiers. `priv-instrument`
- Data deletion exists separately from account deletion, removes the row rather than hiding it, says which copies went, names what is retained and why, and reaches the on device leftovers. `priv-delete-data`
- `STACK.md` records what both stores were told, that record matches the dependency list and the requests in the diff, and the in-app disclosure and the policy route both exist. `priv-declared`

Check the first three on a running build rather than in the source: the cover, the mask on every route onto the screen, and the reveal reverting are all things a screen can be written to do and still fail to do. Two more do not come out of the app at all. Open the data safety form in the Play console and the privacy details in App Store Connect and read both against what `STACK.md` records, and confirm on the server, not in the app, that a delete took the row away rather than flagging it.
