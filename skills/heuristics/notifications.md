# Notifications

A notification is the only interface this app gets to put on a screen belonging to someone who did not open it. On a phone that screen is in a pocket, on a desk in a meeting, or on a bedside table at 3am, and it is read once, for about a second, by whoever happens to be looking at it.

So the default answer to sending one is no, and the cost of getting it wrong is not a bad screen. It is the app being switched off, along with the notifications that mattered.

The permission prompt itself is `perm-notify-ask`. This file is about what the app sends once it has one.

## `notify-earns-it` Every send site names the event, and the event is the user's

Tolerance here is a single account that cannot be topped up. When it runs out people do not silence the noisy kind, they silence the app, and the transactional notification they actually wanted goes with it.

Every place in the code that posts a notification names the event behind it, and that event passes three tests:

- **It happened to this user or to something this user owns, or the user asked in advance to be interrupted at this moment.** An alarm, a calendar reminder, a dose reminder and a practice reminder all pass on the second branch, because the user scheduled or subscribed to them. Feature announcements, streaks the app invented, "we miss you" and anything measured in re-engagement fail no matter how they are worded.
- **It could not wait for the next launch.** If it could, it is `notify-inapp`.
- **There is something to do about it, or it is something the user is waiting for.** Delivered, landed, paid, approved and the emergency alert all qualify with no action attached. What fails is the send nobody was waiting for and nobody can act on.

Cross-promotion and advertising of another product sent through notifications are prohibited by the Play Store, so on Android that part is a shipping question rather than a matter of taste. Promoting this app's own product is this skill's rule instead: it needs its own opt-in inside the app, the system grant is not that opt-in, and nothing goes out until the user turns it on.

## `notify-channels` One channel per kind, so a user can silence one without silencing the app

Android has required every notification to carry a channel since API 26: post one without a channel and it does not appear at all, the system logs an error and drops it. That requirement is met by a single channel called General, which is how most apps meet it, and one channel is the same as no channels, because the only control it gives the user is off.

- Count the kinds of thing the app sends and create that many channels, named for what the user will recognise (Order updates, Mentions, Delivery status) rather than for the system that emits them.
- The importance, sound and vibration are fixed at creation and belong to the user afterwards. Nothing in the app can change them again; only the user can, from system settings. A channel created at the wrong importance is permanent for everyone who already installed, and correcting it means creating a different channel.
- iOS has no system-side equivalent. Categories, registered through `setNotificationCategories(_:)`, carry the actions in `notify-actions` and the hidden-preview text, and give the user no per-kind sound, importance or on switch at all. So on iOS the per-kind control lives on a settings screen inside the app, and the app requests `providesAppNotificationSettings` so the system offers a button straight to it.
- Do not rebuild the Android channel toggles in the app's own settings. Link to the system page for the channel, for the reason `state-permission` gives. A product-level preference is a different thing and stays in the app: which kinds this account wants at all, and the promotional opt-in `notify-earns-it` requires.

## `notify-level` Pick the quietest level that still does the job

iOS has exactly four interruption levels. `.passive` adds it to the list without lighting the screen or playing a sound. `.active` is the default and presents immediately. `.timeSensitive` breaks through Focus and the notification summary, but only where the user has allowed it. `.critical` bypasses the mute switch and needs an approved entitlement.

Android has five usable importance constants: `IMPORTANCE_HIGH` makes noise and peeks as a heads-up, `IMPORTANCE_DEFAULT` makes noise without intruding, `IMPORTANCE_LOW` is silent but sits in the shade, `IMPORTANCE_MIN` sits below the fold and out of the status bar, `IMPORTANCE_NONE` does not show in the shade. `IMPORTANCE_MAX` is documented as unused and is never the answer.

`IMPORTANCE_LOW` and above always reach the drawer and the launcher badge, so quiet is not invisible. `IMPORTANCE_MIN` reaches the drawer below the fold but not the status bar, and `IMPORTANCE_NONE` reaches nothing, so neither is the level for something the user is meant to find later. The two loud settings are for things a person would want to be interrupted for at that moment, which is a much shorter list than it looks. One trap worth knowing: `UNAuthorizationOptions.timeSensitive` is deprecated and is a different symbol from the interruption level that does the work.

A foreground service notification is the exception that must not go quiet. From API 26 the level lives on its channel, which is created at `IMPORTANCE_LOW` or higher, with `setPriority(PRIORITY_LOW)` covering 7.1 and earlier. Below that the system adds its own message to the drawer telling the user about the service anyway. What earns one at all is `notify-ongoing`.

## `notify-quiet` Do not engineer around Do Not Disturb

Android's Do Not Disturb has three levels: total silence blocks every sound and vibration, alarms only lets alarms through, and priority only lets the user pick which categories may interrupt. iOS Focus filters which people and which apps get through. Both are the user telling the phone what it may do, and every symbol that gets past them is gated or restricted for precisely that reason.

- Full-screen intents on Android 14 and above are limited to apps that provide calling and alarms, and Play revokes the default grant for anything else. Check `canUseFullScreenIntent()` rather than assuming it.
- A locally scheduled notification is scheduled against the device's time zone. Where the send comes from a server the client still has a job: report the current time zone alongside the push token, and report it again when it changes, or one UTC send time is the middle of the night for a share of the users every time.
- Something the user snoozed, muted or filtered stays that way. Reposting the same event on a louder channel to get past a filter is the move that ends with the whole app switched off.

## `notify-lockscreen` The first line is the whole notification, and a stranger can read it

Write it to stand alone: what happened, and who or what it concerns. There is no second glance.

- Do not open with the app's name. The system already shows it, and repeating it spends the only line there is.
- Name the specific thing. "You have a new update" is a notification that told nobody anything.
- Both platforms let the user hide previews while locked. iOS reports it through `showPreviewsSetting` and shows `hiddenPreviewsBodyPlaceholder` from the category in place of the body; Android takes a per-notification `VISIBILITY_PUBLIC`, `VISIBILITY_PRIVATE` or `VISIBILITY_SECRET`, and under private the icon and the content title can still be shown.
- So the title is written as though a stranger reads it, and the redaction is a variant written on purpose: the alternative notification attached with `setPublicVersion()`, and the placeholder on iOS. Without them the full text leaks because no visibility was ever set.
- The text still has to survive the longest translation and the largest text size, which is `type-strings`.

## `notify-destination` The tap lands on the thing the notification named

- The payload carries the destination and the identifier of its subject, so routing needs no second network call. On Android that arrives through the `PendingIntent` given to `setContentIntent()`, which every notification needs to respond to a tap at all. A push that says "new message" and opens the inbox threw away what it already knew.
- The handler reads that payload before the app renders its default destination, on the cold path as well as the warm one. Building the stack above the destination, the cold-start test and what happens when the subject is gone all belong to `nav-deeplink`; this rule owns the payload and the tap.
- Tapping it removes it: `setAutoCancel(true)` on Android, and on iOS the system removes a delivered notification on tap by itself. Whatever the tap resolves settles the badge with it.

## `notify-actions` Design for two actions, because two is what fits

Actions belong to the category on iOS and to the builder on Android, and they exist so the common answer does not require opening the app: reply, mark read, accept, snooze. iOS shows up to ten where there is unlimited room and at most two where there is not; Android shows up to three. The constrained presentation is the one people actually see, so two is the number to design for on both.

- Order them so the first is the safe one, which on Android is also the first button under the thumb. On a paired watch it stops being decoration entirely: the hardware gesture invokes the first non-destructive action directly.
- A conversation carries `NotificationCompat.MessagingStyle` and the direct reply action, so the answer is typed from the shade rather than in the app.
- An action completed from the shade updates the notification and the badge too, or the user does the same work twice inside the app.
- Nothing destructive and unconfirmed sits on a notification. `touch-destructive` applies with more force on a surface people tap half awake.

## `notify-shade` One event, one line, cleared once it is dealt with

- Group related notifications and post a summary: on Android, `setGroup()` on each child plus a separate summary carrying `setGroupSummary(true)` at a constant id; on iOS, the same `threadIdentifier` on every request, with `categorySummaryFormat` naming the stack. Without one, recent Android releases group on the app's behalf and the result is whatever the system decides. Group only where each child is worth reading on its own.
- Every child in an Android group carries `GROUP_ALERT_SUMMARY`, so the summary is the only thing that makes a sound. The default alerts on all of them, which turns five children plus a summary into six interruptions.
- Ten notifications about one conversation is one notification about a conversation. Update in place, by posting the same Android id again or by reusing the iOS request identifier, instead of adding another.
- One event produces one notification across all of the user's devices. Three phones buzzing at once is one bug, not three notifications, and it is settled in the service that sends rather than in the client.
- When the user handles it somewhere else, on another device or in the app itself, cancel it: by id on Android, `removeDeliveredNotifications(withIdentifiers:)` on iOS. A shade full of things already done teaches people to clear the app without reading it.
- Something that stops being true removes itself. A queue position, an offer, a match or an arrival time gets a `setTimeoutAfter()` for its lifetime, and anything already stale is dismissed rather than left there to be read as current.

## `notify-ongoing` A notification that will not go away is for work that is actually happening

Only a live event holds a permanent place in the shade: playback, a call, navigation, an upload, a delivery on its way. Anything else that stays is a banner the user is not allowed to close.

- The work runs in a foreground service posting under a non-zero id, on a channel that follows `notify-level`.
- From Android 14 the user can swipe that notification away while the service keeps running. Dismissal is not a stop signal and not a crash: the work continues, the notification is reposted when the state changes, and the app never treats its presence as where the state is stored.
- A journey with a start and an end shows how far along it is rather than repeating one static line. Android 16 has `Notification.ProgressStyle` for exactly this, which is the delivery, the ride and the route.
- iOS does this job with a Live Activity, which can only be started while the app is in the foreground. It stays active for up to eight hours and on the Lock Screen for up to twelve, so it carries a `staleDate` for the point its content stops being trustworthy and an `ActivityUIDismissalPolicy` for how it leaves. End it when the work ends instead of letting the ceiling end it.

## `notify-badge` A badge is a count of things waiting, or it is nothing

- The number is countable and actionable: unread, waiting, needing this person. A badge raised for a promotion is how badges get turned off for the whole app.
- The number is true. If it says 3 there are 3, and it matches what the app shows on opening. A count nobody believes is worse than no count.
- Using the app normally clears it. iOS sets an absolute value through `setBadgeCount(_:)`, so the app owns the number and has to set it down as well as up. Android draws its dot from the active notifications by itself, so clearing means cancelling them and a counted number needs `setNumber()`, and channels that should never count (ongoing status, media controls, alarms) carry `setShowBadge(false)`.

## `notify-inapp` Someone who never allowed notifications still has to find out

Notifications are off by default for new installs on Android 13 and above, and iOS has always required consent, so a large part of the user base receives nothing. An app that only announces things through push announces them to a fraction of its users.

- Everything the app would send has a home inside it: an activity list, an unread mark on the row, a count on a section. That surface is the product, and the notification is a shortcut to it.
- A notification arriving while the app is open is not a banner. The user is already looking, so it lands where the content lives, quietly, without taking the screen away from the task in hand. On iOS that means returning no banner or sound option from `willPresent`, which is also what happens with no delegate at all; on Android a heads-up does appear over the app's own foreground, so it is suppressed or routed into the screen instead.
- Check `areNotificationsEnabled()` on Android, and `getNotificationSettings` with its `authorizationStatus` on iOS, before treating a send as delivered.

## Check

Review answers each of these against the code, pointing at the line:

- Every call that posts a notification names its triggering event, that event happened to the user or was scheduled by the user, and anything promotional sits behind its own in-app opt-in. `notify-earns-it`
- Each kind the app sends has its own Android channel, named for the user rather than the sender and not duplicated as an in-app toggle, and on iOS the per-kind switches live in the app with `providesAppNotificationSettings` requested. `notify-channels`
- Each channel and each payload states its importance or interruption level, none uses `IMPORTANCE_MAX`, and the foreground service's channel is created at `IMPORTANCE_LOW` or higher. `notify-level`
- Nothing escalates to get past Focus or Do Not Disturb, full-screen intent use is checked at runtime, and locally scheduled sends use the device's time zone while the token registration carries one. `notify-quiet`
- Every notification's first line names the event without the app name, and anything private sets an explicit visibility with a `setPublicVersion()` or a `hiddenPreviewsBodyPlaceholder` behind it. `notify-lockscreen`
- The payload carries a destination and a subject id reached through `setContentIntent()`, the routing runs on a cold launch from a killed process, and the tap clears the notification. `notify-destination`
- No more than two actions are relied on and none exceeds the platform's ceiling, the first is non-destructive, conversations use `MessagingStyle` with direct reply, and completing an action from the shade updates the notification and the badge. `notify-actions`
- Related notifications share a group or thread with a summary, children alert with `GROUP_ALERT_SUMMARY`, repeat events update in place, and anything handled elsewhere or no longer true is cancelled or times out. `notify-shade`
- Anything persistent is a real ongoing event, the app keeps working when the user dismisses it, and a Live Activity carries a stale date and an explicit end. `notify-ongoing`
- The badge counts something the user can act on, matches what the app shows, and reaches zero through normal use. `notify-badge`
- Every notification the app sends has an in-app equivalent that works with notifications denied, and a foreground arrival lands in the content instead of presenting as a banner. `notify-inapp`

`notify-destination`, `notify-lockscreen`, `notify-shade` and `notify-ongoing` are answered on a device with the app force stopped and the screen locked, not by reading the payload builder.
