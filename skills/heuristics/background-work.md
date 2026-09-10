# Background work

The moment the app leaves the screen its own execution is on a countdown. iOS suspends it. Android leaves it a window of a few minutes and then stops its services as though `stopSelf` had been called. Either way the operating system decides whether the app wakes again, when, and for how long, and it decides that against battery, thermals, and how often this person actually opens the app. Almost every generated background feature is written as though none of that were true: a timer that keeps ticking, a poll every thirty seconds, a sync that assumes the process is still there.

This file covers whether work may run at all and under what constraint. What sits in the pending queue is `off-queue`, what the work costs in battery and heat is `perf-power`, and how the notification attached to it is written is `notifications.md`. Audio that keeps playing while the app is away is `media-background`, and a transfer the user started and is watching is `net-upload`.

## <Rule id="bg-not-running" description="The app is not running, so nothing the app schedules by itself will fire" />

A timer, an interval, a countdown or a polling loop only runs while the process is alive, and the process is not alive. So none of those is ever the mechanism. Work meant to happen while the user is elsewhere is handed to something the platform owns and wakes on its own terms. The scheduler is the default of those, `WorkManager` on Android and `BGTaskScheduler` on iOS, whichever of the two the cross-platform wrapper reaches. The others are named as they come up: a transfer session (`net-upload`), a queue the system drains (`off-queue`), a push that wakes the app (`bg-wake-push`), a location trigger (`bg-location`), a media session (`media-background`), a foreground service where nothing narrower fits (`bg-service-last`).

The tell in a diff is a repeating callback registered in a screen, a store, or app startup, with a comment about keeping data fresh. Whatever a screen left running on its way out is the other half of the same bug, and `perf-power` owns it.

## <Rule id="bg-now-or-later" description="Sort every unit of work into must-finish-now and can-wait, and there is no third pile" />

Now means the user just started it and is watching or expects a result: an upload they tapped, a payment, an export. Later means everything else, and everything else is the majority.

Later work is expressed as conditions the system evaluates, never as a clock the app invented. "When the device is charging and on unmetered network" is a constraint. "At 2am" is a timer, and it will not fire at 2am.

The two platforms do not offer the same conditions, and the longer list does not degrade into the shorter one by itself.

- **Android.** A network type (connected, unmetered, not roaming), charging, battery not low, storage not low, device idle.
- **iOS.** A processing task takes network connectivity and external power, and nothing else. A refresh task takes no constraints at all, only the earliest time it may begin, which is what most apps schedule. Anything finer is a check the app runs itself once the task has started.

Runtime is budgeted on both. A scheduled refresh on iOS gets up to 30 seconds, so it fetches and stores one thing rather than running a whole sync. Android budgets by standby bucket: 10 minutes of job runtime per rolling 4 hours in the working set, per 12 hours in the frequent bucket, per 24 hours in the rare one.

Either pile can have its process killed between the schedule call and the run, so nothing about a unit lives only in memory across that gap, and every unit carries the identity `off-queue` defines: an id generated before the first attempt and reused on every attempt after it, so a second arrival reads as the first one coming round again rather than as a second charge.

## <Rule id="bg-leaving" description="Work already in flight when the user leaves is finished or handed over, never dropped" />

This is the other half of the now pile, and it is the most common background moment in a real app: the request is open, the write is half done, and the user goes to answer a message. Both platforms give the app a short assertion to finish what is already running, `beginBackgroundTask` with its expiration handler on iOS and a promoted unit or expedited work on Android, and neither publishes how long it lasts. So the window is unknown and the expiration is certain, which leaves one safe design: finish or persist. The assertion is spent on the unit that was nearly done, the expiration handler writes whatever is left into the durable queue (`off-queue`) or onto the scheduler instead of cancelling it into nothing, and the assertion is ended on every branch (`perf-power`). What the screen has to remember on the way out is `state-interrupt`; this rule is the work, not the view.

## <Rule id="bg-periodic" description="A repeat interval is a floor, and the count of them is the real number" />

On Android the shortest repeat WorkManager accepts is 15 minutes, and 15 minutes is the earliest the work may run rather than a promise that it will. The system stretches that interval as the app is used less, batches it with other apps' work, and defers it to the next maintenance window while the device sits idle off charger, and those windows get rarer the longer the idle lasts. iOS publishes no minimum and no cadence at all: `BGAppRefreshTaskRequest.earliestBeginDate` is a floor the app sets, with no ceiling and no promised frequency, so any "refreshes every N minutes" figure is invented.

So: count the recurring jobs the app schedules, list them in `STACK.md`, and give each one a sentence there saying what breaks if it does not run today. An app with six periodic jobs has six wakeups it cannot justify and one bug report about battery.

## <Rule id="bg-visible-stoppable" description="Work that keeps running while the app is away is visible, and the stop actually stops it" />

Long user-started background work goes behind a system surface the person can see and cancel: on Android a foreground service with its required notification, on iOS 26 and up a continued-processing task whose progress the system shows in a Live Activity with a cancel control the user can hit. Below that iOS floor no such surface exists, and a user-started transfer belongs in a background `URLSession` instead (`net-upload`).

That surface is an interface, not a formality.

- It reports real progress. On iOS the system prioritises terminating the tasks that report little or none once resources tighten, so a fake indeterminate spinner is also a shorter task.
- Its stop cancels the work. The cancel affordance built into that surface, the stop action in the notification (`createCancelPendingIntent` behind it) and the cancel control in the Live Activity, ends the unit itself rather than hiding the surface it was watched through. A job that carries on writing after its own stop was hit is the failure users notice on the battery screen.
- After a stop, the partial result is either kept and marked as partial, or discarded and said to be discarded. See `state-partial` and `state-queued`.
- What the notification says, and what a swipe away means, are both `notify-ongoing`.

## <Rule id="bg-service-last" description="A foreground service is the last route, and it arrives with a declared type and a budget" />

Check the narrower API first: a user-initiated data transfer job instead of a generic data sync, picture-in-picture instead of a media playback service, the companion device manager instead of a connected device service. Each of those exists precisely so the service does not have to.

Where the service is genuinely right, it comes with hard edges:

- On Android 14 and up it declares one of the published service types in the manifest and requests the permission matching that type, and the store reviews the type and the stated use before the app ships.
- A long-running worker promoted with `setForeground` is a foreground service underneath, so it declares the same type, requests the same permission and meets the same review. Reaching it through WorkManager avoids none of that.
- A service started with `startForegroundService` has 5 seconds from being created to call `startForeground` or the app crashes. Where the start came from does not extend that, so a service started from a visible screen owes the call just as fast.
- A short service runs about 3 minutes and cannot start another service. For apps targeting API 35 and up, data sync and media processing services share 6 hours per rolling 24 across every service of that type, and the clock resets only when the user brings the app to the front.
- From Android 16, jobs started from a foreground service still count against the app's ordinary job quota, so wrapping work in a service no longer buys unlimited scheduling.
- An app already in the background may not start one at all on Android 12 and up, outside a short exemption list. The start point is a user action inside the app, or a high-priority push.
- The boot broadcast may not launch several of the declared types, so a receiver that runs at boot schedules the work and lets the scheduler pick it up rather than starting a service on the spot.

## <Rule id="bg-declared" description="Every declared background capability names a feature that uses it" />

The declaration is a list and the list is reviewed. On iOS it is `UIBackgroundModes`: audio, location, voip, external-accessory, bluetooth-central, bluetooth-peripheral, fetch, processing, remote-notification and the rest. On Android it is the foreground service types in the manifest, each with the permission it requires.

- Each entry maps to a shipping feature that uses it for the purpose the entry names. Both stores review background use against its stated purpose, and a mode declared for convenience, inherited from a template, or held open to keep the process alive is a rejection rather than a warning.
- An entry with no feature behind it is deleted from the manifest rather than left in and ignored, and the app reaches for the alternative wherever one exists.
- Audio is the common legitimate case, and `media-background` owns its paperwork.

## <Rule id="bg-location" description="Continuous background location is the last form to try, not the first" />

Both stores police this harder than any other background capability and both ask the same question: which shipping feature needs it, and what does the person holding the phone get from it.

- Significant-change monitoring and geofences wake the app on the events a feature actually reacts to, at a fraction of the power, and they cover most of what continuous updates get used for. Continuous updates are for a feature that follows a moving position while the user is away from the screen, such as turn-by-turn or an active recording.
- Where it is right it is declared: the location background mode on iOS, the `location` foreground service type with its permission on Android, and the indicator the platform draws stays visible (`sense-running`).
- The feature that needs it is named in the same place the permission is asked for, and that ask is the separate, later one `perm-scope` describes.

## <Rule id="bg-exact-time" description="Exact timing is expensive, gated, and almost never what the feature needs" />

Default to an inexact window. For an app targeting Android 12 and up, a requested window shorter than 10 minutes is normally widened to 10, so the design assumes 10 rather than the number it asked for, and an alarm permitted to fire through device idle may fire at most once per 9 minutes per app.

Two Android permissions cover exact alarms and they are not interchangeable. `SCHEDULE_EXACT_ALARM` is granted by the user, revocable, not pre-granted to a fresh install targeting Android 13 and up, and open to a broader set of uses. `USE_EXACT_ALARM` is granted automatically and cannot be revoked, and store policy restricts it to alarm, timer and calendar apps.

The thing that earns exact timing is a time the user themselves set, and `setAlarmClock` is the form that serves it: it is the alarm device idle does not defer, and it is the case those permissions exist for. Where the alarm only has to fire while the app is alive, the `OnAlarmListener` form needs no exact alarm permission at all. A refresh, a reminder to come back, a cache expiry and a nightly cleanup earn none of it. iOS has no exact alarm to ask for at all: a time the user set is a local notification scheduled for that time, and firing it runs no app code, so the notification carries what the user has to read, and anything that has to be computed at that moment is computed when the app is next opened or when the notification is acted on.

## <Rule id="bg-wake-push" description="A push that wakes the app to fetch is a budget, and the budget is small" />

iOS rate limits an app that sends more than 3 background pushes per hour, and gives 30 seconds of runtime when one is delivered. Android downgrades an app's high-priority messages once it notices them arriving without a notification following.

So a silent wake-up is spent on content the user is actually waiting for, and content they must be told about arrives as a notification that stands on its own: see `notify-earns-it`. An app that pushes on every server-side change to keep a cache warm loses the channel it will need later.

## <Rule id="bg-restricted" description="The user restricting the app is a state to degrade in, not a bug to route around" />

Read the state before promising anything. Background refresh is a switch the user owns on iOS, and where the system reports it as restricted rather than off the app says nothing about it at all. On Android there are two restricted states and they are not the same one. The battery state the user sets, which the system itself offers after the app holds a partial wake lock for an hour with the screen off, runs no jobs, fires no alarms and reaches no network except while the app is in the foreground, starts no foreground service and demotes any already running, and while the app targets Android 13 and up does not even deliver the boot broadcast. That is the stock behaviour, and the manufacturer decides what its own build does on top of it, which is why the same scheduling code that runs on one phone never fires on another. The restricted standby bucket is the system's own classification of a rarely used app: one job a day for up to 10 minutes, one alarm a day, and no network or push delivery in the background at all.

A force quit is the same answer in a blunter form. Swiped out of the switcher, the app is simply not running: its scheduled work does not fire, wake-up pushes do not reach it, and its transfers stay stopped until the person opens it again (`net-upload`). So no screen anywhere promises that a background feature keeps going, and every feature that leans on one is designed to be found stale on return (`bg-failed-away`).

Degrading means the feature that depends on background work says what it can still do, where that feature lives, in one line: content is current as of when the app was last open. It does not mean an interstitial on launch, and it is never a retry loop, for the reason `sense-off-system` gives about any switch sitting above the app. A grant here is a current value and not a fact, same shape as `perm-recheck`.

## <Rule id="bg-exemption" description="Asking for a battery exemption is a last resort that has to name its reason" />

Store policy prohibits requesting a direct exemption from power management unless the app's core function is impaired without it, and the accepted reasons are a short published list. For everything else the app may only open the battery settings screen, never prompt for the exemption directly, and only after the user has hit the limitation and been told plainly what it costs them. On iOS there is no equivalent to ask for, and instructing the user to change a system setting unrelated to the app's core function is a rejection.

This is never the first answer to work not running. Almost every time, the work was scheduled wrong, ran too long, or should have been deferred. See `perf-power`.

## <Rule id="bg-failed-away" description="Work that failed while nobody was looking is visible when they look" />

The sync that failed at 3am is a state the screen shows at 8am, not a log line. Work the app retries itself gives up at the attempt ceiling `net-backoff` owns, which exists as a named constant rather than as a number buried in a loop, then writes a state the UI reads: the affected content marked stale with its age (`state-stale`), anything unsent marked as pending rather than done (`state-queued`), and a route to retry that does not lose what was queued (`state-retry`). A transfer the platform session retries on the app's behalf is the exception `net-timeout` names, and an attempt ceiling stacked on top of it counts the attempts twice.

Silent failure is worse here than anywhere else in the app, because the user had no way to see it happen and every reason to believe it worked.

## Check

Review answers each of these against the code, pointing at the line:

- No timer, interval or polling loop is the mechanism for work expected to happen while the app is away, and every such unit is handed to a platform-owned mechanism instead: the scheduler, a transfer session, a drained queue, a push, a location trigger or a declared service. `bg-not-running`
- Every deferrable job declares at least one system constraint where the platform offers them, no job encodes a wall clock time the app chose, and every unit carries an id generated before the first attempt that makes a retry recognisable as the same request. `bg-now-or-later`
- Work in flight when the app is backgrounded takes the platform's short assertion, and the expiration hands what is left to the queue or the scheduler rather than dropping it. `bg-leaving`
- Count the recurring jobs the app schedules: each one has its reason written in `STACK.md`, and none assumes its interval is a schedule. `bg-periodic`
- Every long-running background unit reports real progress through the platform's visible surface and carries a stop that cancels the work itself. `bg-visible-stoppable`
- Each foreground service names a declared type with its matching permission, calls `startForeground` within 5 seconds of the service being created wherever the start came from, and was chosen only after the narrower API was ruled out. `bg-service-last`
- Every declared background mode and foreground service type maps to a shipping feature that uses it for that purpose, and anything else is deleted from the manifest. `bg-declared`
- Background location uses significant-change monitoring or a geofence unless a moving position has to be followed, and the feature that needs it is named where the permission is asked for. `bg-location`
- Count the exact alarms: each one is a time the user set, and everything else uses an inexact window. `bg-exact-time`
- Wake-up pushes are sent for content the user is waiting on, and the app does not send them per server-side change. `bg-wake-push`
- The app reads the restriction state, no screen promises that background work keeps running, and the dependent feature degrades in place, in one line, rather than blocking or nagging. `bg-restricted`
- No code path prompts for a battery optimisation exemption, and any settings route is reached after the user hits the limit and reads why. `bg-exemption`
- Every background job's failure path writes a state a screen reads, and every retry the app runs itself stops at an attempt ceiling held in a named constant. `bg-failed-away`
