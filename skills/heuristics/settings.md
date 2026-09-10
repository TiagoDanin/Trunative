# Settings

A setting is a decision the product declined to make. Somebody else will now make it, from a two word label, with less information than the team that gave up on it had.

On a phone that costs more than it costs anywhere else. Opening settings suspends whatever the person came to do; the screen is one column, so six rows is already most of it; every subscreen is a full navigation with nothing left beside it to compare against; and the label has to land at a glance, one-handed, on a moving bus. So the first question about a row is never where to file it. It is whether a better default deletes it.

Two neighbours own things that look like they belong here. Text size, bold text, contrast, reduced motion, language and region are system settings the app reads, under `a11y-settings` and `l10n-per-app`, and a second copy inside the app is the defect `set-system-owned` names. How a row is worded is `copy.md`.

## <Rule id="set-default-first" description="A setting is a default nobody was willing to pick" />

For every row, write down the value most people would keep, and why, in `STACK.md` beside the sync marking `set-sync` already asks for there, so one table holds the key, its default, the reason, and device-local against account-level. The row survives only if two reasonable people would keep different values and nothing the app can observe says which of them is in front of it.

- The app does not ask for what it can detect: the connected accessory, the current appearance, the locale, whether the connection is metered, whether this is the device that already has the data.
- A default is not a coin toss. It is the value that is quiet, cheap in battery and data, safe to be wrong about, and reversible with one tap.
- Count the rows in the whole tree, subscreens included. That count is the number of decisions handed back to the user, and it is a finding about the product before it is a problem with the screen.

## <Rule id="set-in-context" evidence="device" description="What gets changed often is not a setting" />

Sort order, filter, list density, playback speed, muting this one conversation, the unit on this one chart: each belongs on the screen it changes, where the result is visible while the choice is made. Filed under settings instead, it makes somebody leave the thing, guess, and come back to find out what happened.

Settings holds the rare and the app-wide. The test runs one way only: a control whose effect is visible on one particular screen belongs on that screen. Run backwards it deletes settings entirely, because a notification preference, a unit, a data saver or a privacy choice has no single screen to show its effect on, and those are exactly what the screen is for.

## <Rule id="set-system-owned" description="A copy of a system setting is a bug, not a convenience" />

An app-level switch for something the OS already owns tells the user that the system's own choice may not apply here, and the two go out of sync the first time either one is touched.

Never given an app-wide duplicate in the settings screen: text size, bold text, contrast, reduced motion and transparency (`a11y-settings`), permissions (`state-permission`), the device's biometric enrolment (`auth-biometric-session`). The exemption is a control over the app's own content, sitting on the screen it affects under `set-in-context` and layering on top of the system value rather than replacing it: the type size inside a reader, not a second global text size row in settings. Language is a different shape again. The app never keeps its own language preference, and an in-app language row is allowed where it writes through the platform API, which is `l10n-per-app`.

Where the app cannot change the thing itself, the row is a route out to the system rather than a control:

- iOS: `UIApplication.openSettingsURLString` for the app's own page, and `openNotificationSettingsURLString` from iOS 16 for its notification page.
- Android: `ACTION_APPLICATION_DETAILS_SETTINGS` with a `package:` data URI, `ACTION_APP_NOTIFICATION_SETTINGS` with `EXTRA_APP_PACKAGE`, `ACTION_CHANNEL_NOTIFICATION_SETTINGS` with `EXTRA_APP_PACKAGE` and `EXTRA_CHANNEL_ID` both, since without the channel id it lands nowhere, `ACTION_APP_LOCALE_SETTINGS`. Resolve each intent before drawing the row that uses it, because the matching activity is not guaranteed to exist on a given device and a row that does nothing is worse than no row.

Each of those lands on the app's own page or on the one setting the feature needs, and a row that sends somebody off to turn off Wi-Fi or a security feature the app does not own fails review on iOS and deserves to. Which side of the line a preference lives on forks by platform too: iOS lets a handful of the most rarely changed ones be published into the system Settings app through a settings bundle, Android has no equivalent, so on a product that ships to both, the screen inside the app is the one that has to be complete.

One override is worth building rather than reading: appearance. Both platforms accept an app-level light or dark choice, `overrideUserInterfaceStyle` on iOS and `AppCompatDelegate.setDefaultNightMode` on Android, so where the product wants one the row carries three values with Match system as the default, never two, or somebody who set the system to dark cannot get back. The stored value is read and applied before the first frame is drawn, because applied any later it opens every cold start in the system appearance and then flips, which is the seam `splash-appearance` rules out from the other side.

One of these is not optional. An app that asked for the notification permission carries an in-app place where that answer can be changed, and on both platforms that place is a link into the system's notification settings rather than a second switch sitting beside the real one. What the channels behind it are is `notify-channels`.

## <Rule id="set-shape" evidence="device" description="Ten rows is the ceiling, and frequency is the order" />

- Group under a heading with a divider, around a job the user recognises rather than the module that implements it. A group of one is not a group. Sections are `list-sections`.
- Order by how often something is changed, most changed at the top. Alphabetical and source order are both the absence of a decision.
- At ten rows on one screen the remainder moves to a subscreen, and the parent row then carries that group's own status so the level above still reads. Fifteen is not a judgement call, it is the failure: on one column that is two screenfuls of decisions before anything has been read.
- An Advanced section hides at least three rows or it does not exist, and its single line of subtext names what is inside it. A collapsed section with no preview is a locked drawer.
- A feature screen whose whole feature can be turned off carries one main switch, at the top, above everything it governs. The rows under it stay visible and disabled rather than vanishing and reflowing the screen under a thumb already on its way down, and a disabled row says what turns it back on.
- Repeating one setting in two places is allowed when two different situations send people looking in two different places. It is one setting on one subscreen with two entry points, never two controls writing the same value, and where what is repeated is a whole feature, that one control is its main switch.

## <Rule id="set-status" description="Every row shows its current value without being opened" />

Title, then the value it is currently set to, on the row itself. In one column this is the whole difference between reading the screen and opening six subscreens to find out how the app is configured.

- The value is a value, not the title again. Sync, Wi-Fi only. Not Sync, On.
- A switch is its own value, and anything that opens a subscreen states its value beside the chevron. The row is one target and any control on it is another, under `list-row`.

## <Rule id="set-controls" description="Two shapes carry nearly all of it" />

- **On or off:** a switch on the row. A checkbox is for the negative case, restricting or blocking something, where a switch would have to be labelled with a "don't" and read backwards.
- **One of several:** a subscreen or a sheet with the options as rows. A menu that drops open under the finger is covered by that same finger, and it hides how many options exist until it is opened.
- Sliders and free text fields are the exceptions, each one costing a fine gesture or a keyboard, and each shows its current value as text next to it.
- A row that leaves the app for a web page says so before it is tapped. A settings screen assembled out of links is a website wearing a title bar.

## <Rule id="set-effect" description="Instant or saved, and never both on one screen" />

- **Instant:** the change is stored and applied as it is made, with no Save. There is no Cancel either, so nothing that cannot be undone by moving the control back belongs on an instant screen.
- **Saved:** for values that only mean something as a set, such as an address or a server and its credentials. One commit action, the typed input surviving a failed commit under `form-submit`, and leaving with uncommitted changes asks first.
- The mixed screen is the defect: a switch that applies immediately sitting above a Save button, where nothing on the screen says which of the two rules the switch is following. It is what a generated settings screen produces by default, and the back gesture makes it worse, because the user can leave at any moment with no OK button in the way.
- A write that failed reports at the control that failed, under `fb-place`, and that control returns to the value actually stored rather than sitting on the one that did not take.

## <Rule id="set-wired" evidence="device" description="A control nothing reads is a picture of a control" />

A settings screen generated from a feature list is a column of switches bound to screen-local state. They move under the thumb, they store nothing, and no code anywhere asks what they are set to. The screen looks finished, which is why this one survives to release.

- Every control writes to the preference store the stack actually uses, and at least one place outside the settings screen reads that key. A key nothing reads is a row to delete, not a row to wire up later.
- Every read states the value to use when the store answers with nothing, because it will: first launch, a reinstall, a store not ready yet. What came back empty is never written back as though the person had chosen it.
- Kill the process and open the screen again. A preference that did not survive that was never stored, whatever the switch was showing.

## <Rule id="set-sync" description="Say what follows the account and what stays on this phone" />

A preference that silently appears on the other device, or silently does not, is a bug report either way.

- Decide it per setting and record it in `STACK.md`: device-local, such as appearance, downloads, and which notifications this device shows, against account-level, such as units, content preferences and privacy choices.
- A synced group says so once, in a few words, on the group. A device-local row inside an otherwise synced group says so on the row. An account-level row waits in `state-loading` until its stored value has arrived, rather than sitting interactive at a coded guess somebody will flip believing it was theirs.
- Two devices will write the same preference at different moments, so last write wins is a decision to make rather than a default to inherit, under `off-conflict`.
- What survives signing out is already ruled by `auth-signout`.

## <Rule id="set-destructive" description="The one-way rows sit apart from the weekly ones" />

Clear cache, remove downloads, reset settings, leave the group, sign out, delete the account. Distance is the mechanism and the confirmation rules are `touch-destructive`.

- They are grouped at the end or on a subscreen of their own, never next to a switch somebody flips weekly, and never next to each other when one is recoverable and the next one is not. Sign out and delete do not share a group, under `auth-signout`.
- Each one names what it removes and how much of it, in the unit the person counts in: delete 1.2 GB of downloaded episodes, not clear data.
- Reset states its scope and keeps to it, meaning this group of settings rather than everything the app holds.

## <Rule id="set-search" description="A settings tree that needs search is telling you something first" />

The trigger is depth, not taste: the moment one row sits three levels below the root, nobody navigates to it any more, they hunt for it. Depth that `set-shape` produced by itself does not count toward that, because an overflow subscreen and an Advanced section are its fix for a crowded screen rather than evidence of a deep tree. Then the root gets a field that matches row titles, group names and current values, and lands on the subscreen with the row it found marked. Which surface that field is and how it behaves is `search-surface`. Read the finding before shipping the fix, though: search makes a deep settings tree survivable, it does not make it right, and the row count that drove it there is the count `set-default-first` is asking about.

## <Rule id="set-account-exit" description="Settings is where people go when they want out" />

Whatever else it holds, this is the screen somebody opens to stop paying, stop being sent things, or stop having an account. Burying any of them costs goodwill, and burying most of them costs a store review as well.

- The account row names who is signed in, under `auth-active-account`, and this screen also carries the entry point for signing out (`auth-signout`) and the one for deleting the account (`auth-delete`), placed apart from each other by `set-destructive`. All three belong here and none of them is redesigned here.
- A subscription sold inside the app carries a row here that manages and cancels it. Play names the missing link on the account settings screen or its equivalent as a violation, and takes either the Subscription Center at `play.google.com/store/account/subscriptions` or that same address carrying `sku` and `package` for the one subscription the row is about; on iOS the row opens the system's own sheet through `AppStore.showManageSubscriptions(in:)` from iOS 15.
- The privacy policy is reachable from inside the app rather than only from the store listing, and that one is a review requirement rather than a courtesy. The terms and a way to withdraw any consent the app collected sit here too, by this skill's placement decision: what is required of the withdrawal is that it is easy to reach and easy to understand, and settings is where this skill puts it.

## <Rule id="set-diagnostics" description="The version, and a way to report something" />

The version and build are the first thing a support reply asks for, and somebody has to be able to read them out loud off a phone they are holding at arm's length. They go on an About subscreen with the licences, one level down, rather than taking a row at the top from something adjustable. Beside them sits one route to support that attaches the version, the device and the locale by itself: a report typed with a thumb will not carry them, and without them it cannot be answered.

## Check

Review answers each of these against the code, pointing at the line:

- Every setting has a line in `STACK.md` naming its default and why that default could not settle the row, nothing is asked for that the app can detect, and the total row count across the tree is reported. `set-default-first`
- No frequently changed option, filter or sort lives in settings instead of on the screen it changes. `set-in-context`
- No app-wide row duplicates a system setting, no language preference is stored outside the platform API, every row the app cannot fulfil itself is a deep link resolved before it is drawn and aimed at the app's own page, including one in-app place to change the notification answer, and any appearance row offers three values with Match system as the default and applies the stored one before the first frame. `set-system-owned`
- No screen holds more than ten rows, groups carry headings, order runs by frequency, any Advanced section hides at least three rows behind one line of subtext, and a feature that can be switched off entirely has one main switch above dependent rows that stay visible and disabled. `set-shape`
- Every row shows its current value, and no subscreen has to be opened to find out what the app is set to. `set-status`
- On and off is a switch, one of several is a subscreen or sheet rather than a dropdown, and every slider or text field shows its value. `set-controls`
- The screen is instant or saved, stated by what it shows, with no instant control on a screen that has a commit action. `set-effect`
- Every control writes to the preference store, every key is read somewhere outside the settings screen, every read declares a default, and the values survive killing the process. `set-wired`
- Every preference is marked device-local or account-level, the screen says which, an account-level row waits for its stored value instead of offering a guess, and the collision rule for two devices is written down. `set-sync`
- Destructive rows are grouped away from frequent ones, each names what it removes and how much, and sign out is not adjacent to delete. `set-destructive`
- No row sits three levels below the root without a search field on the root, counting depth the shape rules did not create, and the tree's row count is reported as a finding alongside it. `set-search`
- The signed-in account, a subscription route that works on both stores, the policy links, the consent withdrawal and the entry points for sign out and deletion are all present and reachable in one screen. `set-account-exit`
- Version and build are on an About subscreen, and the support route carries version, device and locale without the user typing them. `set-diagnostics`

Three of these are not in the diff. Kill the process from outside the app, with Don't keep activities or `adb shell am kill`, then reopen the screen to find out which of `set-wired`'s values were really stored. The frequency judgements in `set-in-context` and `set-shape` are answered by which controls the app's own screens change often, which is a question for the product rather than for the settings file.
