# Updates and migrations

The update that matters here is the one the user did not install: it arrived in the background while the phone charged, and the version that opens in a queue the next morning is one nobody chose and nobody read anything about.

This file covers what that person meets: a screen that will not let them in, an install that happens under them, and the first launch of a new binary over a store the old one wrote. The surface the app launches onto is `heuristics/splashscreen.md`, the screen a failed migration shows is `heuristics/states.md`, and the first run of a fresh install is `heuristics/onboarding.md`.

## <Rule id="upd-block-test" description="A block is earned by what broke, not by a version number being behind" />

Four conditions earn a wall: the client speaks a contract the server has stopped honouring, a security fix that has to be everywhere, a bug that damages data while the app runs, or a legal requirement the installed build cannot satisfy. The list is closed. Everything else offers and lets the person carry on, and a fifth reason is a named exception in `STACK.md` saying what it costs the people it locks out.

`installedVersion < latestVersion` is not one of those conditions. Written that way every release becomes mandatory, and someone standing at a barrier with a ticket in the app pays for a copy change with a download on whatever signal the platform has. Decide blocking or flexible per release, from the failure, and record the test in `STACK.md`.

On Play the urgency travels as a property of the release: an integer from 0 to 5, defaulting to 0, set when the release rolls out and not editable afterwards. A release published as routine can never be promoted later, which is one more reason the decision to block belongs to something the app can still ask.

## <Rule id="upd-min-version" description="The floor is an answer from the server, never a constant in the build" />

A blocked client is the one you can no longer ship to, so the number that blocks it has to stay changeable after the build has left. A minimum version compiled in is a wall that cannot be lowered when it turns out to be wrong.

- The check is one request with a deadline (`net-timeout`) and a stated default, and the default is that the app opens. A gate that fails closed locks out everyone whenever that endpoint is down or the user is on a train.
- Apple publishes no in-app update flow and no version-check API, so whatever an iOS build knows about its own currency, it asked your backend for. Android can read the store's answer, and that answer says only that a newer build exists. The urgency travelling with it is the developer's own, set at rollout and frozen there, so it is a message from a past release rather than a judgement about this client.
- The reason arrives with the floor. The server names what stopped working so the wall can say it, rather than the client guessing from a number.

## <Rule id="upd-gate-screen" description="The wall states the reason, and it leads somewhere" />

It is the shape of `state-permission`: a stated reason and a route out, never a dead end. That rule allows no wall at all, because a refused permission still leaves an app that works with less. This is the one wall the skill allows, because the break is in the client itself and nothing in the build repairs it, so the route out goes to the store rather than to a reduced screen.

- The version check never holds the launch surface (`splash-hold`), so the app draws its first real screen with the check still outstanding and the wall is raised over that screen once the answer lands. A slow or failed check therefore leaves a usable app rather than a held launch, which is the same default `upd-min-version` states from the network side.
- One sentence naming what stopped working and what the move is, written as `copy-error` writes a failure. "This version is no longer supported" names nothing. Where that sentence comes from the server it travels as a reason code the client has strings for, because a wall is the last screen that can afford to be in the wrong language (`l10n-strings`).
- One action, labelled with where it goes (`button-label`), opening this app's store listing. Check what it does when the store app is absent or the link does not resolve, because that branch is the whole screen.
- The wall names only what it can also reach. Where the old binary still renders something correctly, a cached ticket, a phone number, a saved pass, a second and quieter action opens it, which makes the gate a sheet over a reduced app rather than a terminal screen. Listing what the user cannot get to is the failure this bullet exists to prevent, so anything unreachable goes unmentioned.
- The version and build stay legible on the wall itself. Support asks for them first and the About screen that normally holds them (`set-diagnostics`) is behind the wall.

## <Rule id="upd-prompt-shape" description="The offer is not an alert, and launch is not the moment" />

Someone opened the app to do one thing. A dialog standing in front of the first screen is the interruption `fb-unprompted` ranks lowest, and it arrives before the user has any context for the choice.

- The offer appears after the first screen is up (`splash-first-frame`), on a surface that can be left without answering, and never between the user and the task.
- The dismissal is persisted for a period written in `STACK.md`, which is `fb-unprompted` and needs nothing added here. Re-asking every cold start is the wall built out of a prompt.
- What is decided here is the second number, how stale an install has to be before the offer returns, and where staleness is measured from. Take it from the store's own count of days since the release became available; where the store publishes no count, the release date comes back beside the floor from the endpoint `upd-min-version` already calls. Both platforms then compare against a date the server owns rather than a timer in the build.

## <Rule id="upd-flexible-install" description="The download runs in the background, the install moment is the user's" />

Android's flexible flow downloads while the app stays usable, and it hands back three answers rather than one: accepted, cancelled, and failed. Cancelled is an answer, so the app carries on.

- When the install state reaches downloaded, offer the restart on a surface the user can ignore. The flow is defined as the one where it is acceptable to keep using the app while the download runs, so calling `completeUpdate()` on your own schedule takes back the thing that made it flexible.
- Ask whether the flow is allowed on this install before drawing the entry point, since it is not available everywhere, and fall back to the store listing when it is not.
- Two things are picked up on return and they are not the same check: a blocking flow the app started and that was interrupted is still in progress and is re-entered, while a background download that finished while the user was away is offered its restart. Both are checked at every entry point, not on the one screen that started it, or the user sits in a half installed state with nothing offering to finish it.
- iOS has none of this. There the offer is a link, and the user leaves to take it.

## <Rule id="upd-restart-state" description="The next run is a cold launch of a different binary" />

An install ends the process that was running, and whoever opens the app next, the store or the user, opens it cold. The stack, the scroll position, the open sheet and everything typed and not yet saved are gone unless they were already written down.

So the update flow starts by committing: `form-persist` for what was typed, `nav-restore` for the place, `state-interrupt` for the save points. A prompt raised in the middle of a form with no save behind it is a data loss the user attributes to the app rather than to the store.

The binary that comes back is a different one, so a restored destination has to still exist in it. A route removed in this release opens its root, not a crash.

## <Rule id="upd-migration-once" description="The first launch after an update runs the migration once, all of it or none of it" />

The stored schema version is the trigger, and the new number is written in the same transaction as the work it describes. Written first, a process killed halfway leaves a store that claims to be migrated and is not. Backgrounded apps are reclaimed without warning, and a slow first launch is exactly when someone switches away.

Where the store belongs to the framework, that transaction comes free: the version lands inside the framework's own migration, so a killed process rolls the whole thing back and the next launch starts again from the beginning. The clause bites on migrations written by hand, and on the work that leaves the store entirely: a file moved on disk, a preference key renamed, a keychain item rewritten. Those are the steps that can be found half done, so those are the ones that have to survive being run twice. A step that appends rows doubles them on the second pass, and what crosses that seam is `upd-carry-over`.

Each stack names the mechanism: Room's automated migrations with a spec carrying the renames and deletions, or `Migration(startVersion, endVersion)` handed to the builder; Core Data's lightweight migration through `NSMigratePersistentStoresAutomaticallyOption` and `NSInferMappingModelAutomaticallyOption`, with `NSMappingModel.inferredMappingModel(forSourceModel:destinationModel:)` answering whether the change is inferrable at all before you assume it; SwiftData's `SchemaMigrationPlan`, one lightweight or custom stage per version pair.

## <Rule id="upd-migration-path" description="Someone opens the app a year late" />

The path runs from every version still installed, not from the previous one. Steps chain, and each pair is tested against a store written by that version rather than by the current build.

- The installed base is a range by construction. Apple's phased release ramps over seven fixed days at 1, 2, 5, 10, 20, 50 and 100 percent, pausable up to 30 days in total and not otherwise reshapable, while Play's percentage is the developer's and can be halted, which strands everyone already updated on a version nobody else will get. Two versions live at once is the normal state.
- Missing paths fail differently and neither failure is quiet: Room throws when it cannot find one, and Core Data returns no inferred model.
- Downgrades happen: a reinstall from the store after a halt or a withdrawal serves the build that was live before it, and a restored device backup or a sideload puts back whatever it was holding. Decide what a store written by a newer version does, because with no path declared in that direction the store simply fails to open.

## <Rule id="upd-migration-visible" description="A migration is work with an end, and nobody watches a launch surface for it" />

It does not belong on the launch path: `perf-cold-start` puts database open and migration off it, and `splash-hold` takes only bounded local reads.

- Fast enough and nothing is shown. Slower, and it happens on a real screen with a placeholder shaped like what is coming, then names the stage or counts what is done once the wait gets long, which is `state-loading` and needs nothing new here.
- Measure it against the largest store a real user has. The first launch after an update is the one moment the biggest store meets the newest code, and an empty simulator never reproduces it.
- Failure is a designed screen with a move (`state-error`), never a launch that hangs and never an empty screen implying the data is gone.

## <Rule id="upd-no-wipe" description="A schema bump is not permission to delete what the user has" />

The destructive escape hatches are one line each and they read like configuration: the destructive migration fallbacks delete every row in the tables, and the widespread raw SQLite upgrade that drops the tables and recreates them does the same thing by hand.

On a phone the device is the copy. There is no file the user can put back, and for anything never synced there is no server to fetch it from again.

Where a wipe is genuinely right, because the store holds nothing but a cache of server data, say so at the call site and confirm what the next launch shows while it refills: `off-no-cache`.

## <Rule id="upd-carry-over" description="Queued work and drafts cross the version boundary" />

- The queue is the sharp edge. The new build arrived without anyone asking for it, so those entries were written by a build the user never chose to leave, and on a phone there is no second machine, no export and no earlier install to recover them from. Entries written by the old build have to be readable by the new one, or drained before the schema moves. Dropping them on upgrade discards writes the user was already told had been accepted (`state-queued`, `off-queue`).
- A renamed preference key or a moved file path with no code to carry the value across is the loss that ships most often, because it looks like a tidy rename in the diff.
- Cached content is the only one allowed to be discarded. Name what this version invalidates and let it refill (`off-cache-policy`). A draft is not in that category (`form-persist`).
- There is one way to test it: install the old version, make real data, install the new build over the top. A fresh install passes every time and proves nothing.

## <Rule id="upd-whats-new" description="Almost nothing earns a screen" />

A release that moved something the user relied on has something to say. A release of fixes does not, and neither does a panel selling a feature nobody asked about, which is the tour `onboard-in-place` exists to refuse. Nobody asked for the sheet either, so `fb-unprompted` has already set the rung it takes and the moment it may appear.

Where there is one, it is a single screen, skippable, shown once, and after the first screen is up rather than in front of it; `onboard-screens` sets the ceiling on how many panels anyone sits through. Better than any of that: point at the thing that moved, where it moved to, the first time that screen is opened.

The store listing is a separate obligation with published rules. Apple requires the What's New text to describe new features and product changes, allowing a generic line only for bug fixes, security updates and performance work. Play caps release notes at 500 characters per language, and its console guidance is that they inform about the release rather than promote or solicit an action. Neither governs the in-app screen.

## <Rule id="upd-store-channel" description="The store is the only thing that changes the binary" />

Both stores put this in policy rather than guidance. Apple requires apps to be self contained in their bundles and not to download, install or execute code that introduces or changes features. Play forbids an app distributed through it from modifying, replacing or updating itself by any mechanism other than Play's, with a narrow exception for code running in an interpreter or virtual machine, such as JavaScript in a webview.

The case that reaches this rule most often is not a self updating binary but a remote bundle: a JavaScript payload fetched at launch and swapped under the running app. Play's exception is written for interpreted code and Apple names no equivalent, so any interpreted path is checked against the current guidelines before a release plan is built on it. The design rules do not move either way. A payload that changes behaviour is an update the user did not install, crossing a schema boundary with no store install and no version number they can see, so it answers to `upd-restart-state` for the state it destroys, to `upd-migration-once` for the migration it runs, and to `upd-block-test` for whether it may stop anyone at all. It is not a way around that test.

So no surface in the app is an update button that updates. It is a link to a listing, and every rule above is written around a channel the app does not own.

## Check

Review answers each of these against the code, pointing at the line:

- The blocking condition names a broken contract, a security fix, data damage or a legal requirement, is not a comparison of the installed version against the latest, and anything outside that list is a named exception in `STACK.md`. `upd-block-test`
- The minimum version arrives over the network with a deadline, and the app opens when that request fails. `upd-min-version`
- The gate screen is raised over a drawn screen rather than held launch, states a reason in the reader's language, carries a working route to the store listing with a fallback, shows the version, and gives an action reaching anything it names as still working. `upd-gate-screen`
- The offer is not a launch dialog, its dismissal is persisted, and the interval before it returns is written in `STACK.md`. `upd-prompt-shape`
- The install completes on the user's tap, the entry point is drawn only where the flow is allowed, and both an interrupted flow and a finished download are picked up at every entry point. `upd-flexible-install`
- Everything unsaved is committed before the update flow starts, and a restored destination that no longer exists opens a root. `upd-restart-state`
- The migration is keyed off a stored schema version, writes that version in the same transaction as the work, and every step that leaves the framework's store is safe to run twice. `upd-migration-once`
- A migration path exists from every version still installed, chained and tested pairwise, with a defined behaviour for a newer store. `upd-migration-path`
- Migration is off the launch path, shows a real loading state when it is slow, and has a designed failure screen. `upd-migration-visible`
- No destructive migration fallback and no drop-and-recreate upgrade, except over a store that is purely a cache and says so. `upd-no-wipe`
- Queued entries and drafts written by the previous version are readable or drained, and every renamed key moves its value. `upd-carry-over`
- Any what's new screen is single, skippable, shown once, and not in front of the first screen. `upd-whats-new`
- Nothing in the app downloads or installs a new version itself, and any remote bundle that changes behaviour is held to the same restart, migration and blocking rules. `upd-store-channel`
