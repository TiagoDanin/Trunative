# Offline and the local copy

A phone loses the network as a normal condition of use: lifts, tunnels, basements, aircraft, rural roads, a hotel portal that answers every request with its own login page, and a full bar of signal attached to nothing. Sessions that start, end or spend their middle in one of those are a predictable share of all sessions, not an edge case.

This file is about the copy the app keeps on the device: what is stored, for how long, what is deliberately never stored, what happens to a write made while disconnected, and what the app becomes when that copy is gone. The request itself, its timeout and its retry, is `heuristics/network.md`. How the screen says offline, pending or stale is `state-offline`, `state-queued` and `state-stale`. Everything here is the layer underneath those three.

## <Rule id="off-local-first" description="The screen reads the store, and the network writes to the store" />

The local store is the source of truth for the content the app is expected to be able to show again: what the person already opened, and the core of what they come back for. A response updates the store, and the store updates the screen. For that content, nothing in the view layer waits on a request to draw its first frame.

That ordering is what makes the app usable in a lift: rendering runs at disk speed and the radio is free to answer late, or never. A screen whose state starts at loading and is only ever filled by a fetch has no offline behaviour to design, it has a spinner.

The scope is the critical subset, not every byte. A collection the device has never held still draws the placeholder in `state-loading`, and a live price, a video call or a search against a server has nothing to render from a store. What the rule forbids is content already sitting on the device, hidden behind a spinner anyway.

- Relational or paged content goes in a database (Room, SQLite, Core Data). Small settings go in a key-value store. Blobs go in files.
- The view model observes the store. A repository that hands the network result back to the caller and writes the cache on the side is keeping two truths, and they disagree the first time a write fails.
- What is deliberately not stored is a decision rather than an oversight, and it is written down beside the rest of the storage policy in `off-cache-policy`.

## <Rule id="off-sync-scope" description="Decide what is kept on the device, how far back, and what fills it" />

`off-local-first` makes the store the thing the screen reads. This rule decides what is in it, which is otherwise whatever the user happened to open. Per collection in `STACK.md`: kept complete or only what was visited, how far back it goes as a count or a window, and which of two ways it fills.

- **Pull.** The app asks as a screen needs a page and a paging source backed by the store fills the gaps (`RemoteMediator` on Android). It is the simpler half and the more expensive one, and it fails in exactly the situation this file is about: a long stretch with no signal ends at a screen whose store is stale or empty.
- **Push.** The server says what changed, so the device can stay offline indefinitely on far less data. It needs a backend that supports synchronisation, which makes it a decision taken with the API rather than inside the app.

A bulk fill is deferred work: unmetered, and left to the system to run when it suits the battery (`NetworkType.UNMETERED`, `isDiscretionary`). A fill the user asked for is neither deferred nor budgeted against `net-prefetch`, which spends on the next screen of this session rather than on the working set that has to survive a tunnel.

## <Rule id="off-fresh-marks" description="Every stored record knows when it arrived and whether the server has seen it" />

Two fields, not one: the time the value was written, and its origin, meaning confirmed by the server or written on this device and not yet sent. `state-stale` renders the first and `state-queued` renders the second, and neither can render what the schema does not hold.

On a device that spends part of every session disconnected, those two fields are the only things separating a cached row from a live one, and there is one screen, so the difference has nowhere else to be shown. The time comes from the record, not from a file's modification date, which says when this device wrote the file rather than when the server produced the value.

Add the version or timestamp that `off-conflict` needs at the same time. Retrofitting it is a migration that runs on data already sitting on people's phones, with no earlier value to backfill it from.

## <Rule id="off-cache-policy" description="What is cached, for how long, and what is never cached" />

This rule is about what sits on disk. Write it per collection in `STACK.md`: what is stored, its lifetime, and what evicts it. A store with no lifetime grows until the OS deletes all of it at once, which is the worst moment for it to happen. The in-memory tier of the same cache is `perf-memory`, and an image cache with both tiers owes both rules.

The never-cached list goes in the same entry: a one-time code, a live price, anything the product is not allowed to keep, named once per collection rather than defended at each read. It is a privacy decision as much as a storage one, because a phone is lost, lent and handed across a counter in a way a desk machine is not.

- **Tokens are not content.** On iOS the auth token goes in the Keychain. On Android the Keystore holds keys rather than secrets, so the token is stored encrypted under a key the Keystore holds, and the sign-in credential itself belongs to Credential Manager. Either way it is never a row in the offline store.
- **Encryption at rest is already the default** for app-private storage on current versions of both platforms. What the app owes is the part the default does not do: raising the protection class where content has to stay unreadable while the device is locked (`FileProtectionType.complete` rather than the class applied automatically), and covering the two places outside app-private storage, which are anything written to shared or external storage and anything the app syncs to a backend.
- **Settings sync stores are for settings.** The platform key-value store that syncs between a person's devices is sized for preferences (iCloud's holds 1 MB in total), so content does not go in it and neither does anything the queue depends on.

None of this becomes a user-facing setting. People expect their content to be available and do not want to manage the storage of individual items.

## <Rule id="off-reclaimable" description="Discardable storage gets discarded, and the app has to survive it" />

Both platforms reclaim cache locations under storage pressure: `Library/Caches` and the `URLCache` on iOS, `getCacheDir()` on Android, best-effort buckets on the web. Every read of a cached file checks that the file is still there before using it.

So nothing the user made, and nothing the queue needs, lives in a cache directory. Queued writes, drafts and downloads the user asked for go in durable app storage.

Backup follows the same line silently. Android Auto Backup always excludes `getCacheDir()`, `getCodeCacheDir()` and `getNoBackupFilesDir()` and cannot be told to include them, with 25 MB per app per user for everything else. On iOS `isExcludedFromBackupKey` resets during common file operations, so it is set on every save rather than once. On the web `navigator.storage.persist()` is a request the browser may refuse, and `estimate()` returns an approximation, so neither is a guarantee to design against.

A phone with a full camera roll is the ordinary device, not the low-storage one.

## <Rule id="off-write-mode" description="Every write declares which of three things it is" />

Decide per action, in the code that performs it:

- **Online only.** It has to reach the server now: a payment, a transfer, a booking. The request still goes out and the failure is the answer, said plainly, with everything the user entered still on screen. Before the tap the control may say what the action needs, a connection, but it is not disabled by a reachability flag: `net-reachability` keeps the check out from between the tap and the socket, and `button-state` prefers a live control that answers when it is pressed.
- **Local first, then queued.** The write lands in the store immediately and is queued for the server. This is the default for anything the user authored, because the alternative is losing it.
- **Queued and droppable.** Analytics and logs. Queued, trimmed when the queue is trimmed, never surfaced to the user.

A screen where every mutation is optimistic will eventually tell someone in a tunnel that their transfer went through.

## <Rule id="off-queue" evidence="device" description="The queue is durable, identified, and drained by the platform's own scheduler" />

- **Durable.** Rows in the database. Not an array in a view model, and not a cache directory, which `off-reclaimable` can empty between the write and the drain.
- **Identified.** The device generates the entry's id before the first attempt and reuses it on every retry, so a reply lost on the way back becomes one order rather than two.
- **Drained by the platform.** WorkManager unique work constrained to `NetworkType.CONNECTED` with `Result.retry()` on Android, a background `URLSession` or `BGTaskScheduler` on iOS, the service worker `sync` event on the web with a foreground drain behind it because Background Sync is not available in every browser. A foreground timer does not run while the app is not running, which is most of the day.
- **Ordered.** Entries drain in the order they were made, and one that depends on an earlier entry never goes before it. A create, an edit and a delete of the same record either collapse to their final state before anything is sent, or carry that dependency explicitly. Drained out of order they produce a 404 on the edit, a row resurrected after its delete, and a child whose parent never landed.
- **On the scheduler's schedule.** WorkManager backs off exponentially from 30 seconds by default, floors at 10 seconds, and ceilings at 5 hours, with the floor on repeating work under `bg-periodic`. `BGTaskRequest.earliestBeginDate` is a floor with no ceiling. Nothing in the interface promises a time.

Cancelling an entry is two operations rather than one: the entry leaves the queue, and the local write it made is reversed. Whether pending work is shown on the item or on a surface of its own is `state-queued`.

## <Rule id="off-session" evidence="device" description="A token that could not be refreshed is not a sign-out" />

Refreshing needs a server, so a token that expires on a disconnected device says nothing about whether the person is still signed in. Treating it as a sign-out clears the store the rest of this file rests on and turns a lost signal into lost work.

- An expired token with no path to the server leaves the app in its cached form: content still renders, writes still queue, and the credentials are exchanged again on the next request that reaches. Signing the user out is what happens when the server refuses the refresh, never when it cannot be asked. `net-backoff` owns the refresh itself.
- Sign-out is the other half. A queue with entries in it is drained first, or discarded with the user told what is going, and only then is local data cleared. Wiping the store on the way out deletes work the person watched the app accept.

## <Rule id="off-destructive-offline" evidence="device" description="A delete is answered by how far it reaches, not by whether it is queued" />

`state-queued` settles that destructive actions do not queue silently. What is left is which of two mechanisms covers a given delete, and they are not both owed on the same one.

The default is the local hold. Mark the record deleted on the device, take it out of the list, and let the drain be what makes it final. While it is still there the undo `touch-destructive` prefers is still open, so nothing has to be asked, and the queue entry is cancelled the way `off-queue` cancels any other.

What earns a confirmation is reach. A removal on a synced account lands on every device the person owns, which is as true on a full signal as it is in a tunnel, so it is asked at the tap in both, and only where the hold cannot take it back. The wording of that confirmation is `touch-destructive`. What is forbidden is the silent version: the row disappears, the queue carries it away, and the user finds out on another device a day later.

## <Rule id="off-conflict" evidence="device" description="Somebody's edit loses, and it is never the one still on screen" />

Two devices, one account, both edited. Resolve automatically wherever the shape of the data allows it, and design the rest.

- The strategy is written down per collection. Last write wins is a choice that needs version or timestamp metadata to work at all, not the accident of which request arrived first.
- The losing version is kept, and the person is told about it in a quiet, non-blocking marker with a way to open both. Silently discarding the copy the user typed is the failure this rule exists to prevent.
- Resolution happens as early as the app can detect the collision, before more work is poured into a version that is about to lose.
- Not an alert, and not at launch. An app that opens onto a modal about sync has spent the user's first tap on its own plumbing. Show the stored copy with the marker on it.

## <Rule id="off-no-cache" evidence="device" description="The empty store happens twice, and one screen answers both" />

It happens on first launch, and it happens again after the OS reclaimed everything under `off-reclaimable`. That is the same screen, reached by the same code path, and it must be reachable in testing by clearing app storage rather than only by reinstalling.

What it renders is one of two states, and which depends on whether a request can still be made: `state-empty`'s nothing yet on a first launch with a working connection, and `state-offline`'s fourth state when there is no connection to fill it from. What this rule adds is on the storage side: the path is not gated on a first-run flag, and whatever that screen stands on (seeded rows, the app's own help) ships inside the binary, so it is there to be read at the moment the store is not.

## Check

Review answers each of these against the code, pointing at the line:

- The view layer observes the local store, and content the device already holds renders without waiting on a request. `off-local-first`
- Every collection names what is kept on the device and how far back, whether it fills by pull or by push, and bulk fills run deferred and unmetered while a user-requested one does not. `off-sync-scope`
- Every cached record carries a written-at time and a synced or pending origin, plus the version conflict resolution needs. `off-fresh-marks`
- Every collection on disk has a written lifetime and eviction rule, every collection deliberately not stored is named beside them, the token sits in the Keychain or encrypted under a Keystore key rather than in the store, content that must be unreadable on a locked device raises its protection class, and none of it is exposed as a user setting. `off-cache-policy`
- No queued write, draft or user-requested download lives in a cache directory, and every read of a cached file handles the file being gone. `off-reclaimable`
- Every mutation is one of the three modes, and the online-only ones attempt the request and fail with the input kept rather than being disabled ahead of the tap. `off-write-mode`
- Queue entries are rows in durable storage with device-generated ids reused across retries, drained in order by the platform scheduler with dependent writes collapsed or chained, with no promised time in the interface, and cancel removes the entry and reverses its local write. `off-queue`
- A refresh that fails for want of a network leaves the session and the store intact, and a sign-out drains or explicitly discards the queue before clearing local data. `off-session`
- A delete stays reversible on the device until the drain makes it final, and a removal that reaches the person's other devices is confirmed at the tap whether or not there is a connection. `off-destructive-offline`
- The conflict strategy is written down per collection, the losing version is kept and surfaced quietly, and nothing resolves by discarding what the user typed. `off-conflict`
- Clearing app storage lands on the same screen as a first launch, and that screen shows bundled content rather than a blank. `off-no-cache`

Test the last five with the device actually offline. Airplane mode on a warm app, a write made in it, a force quit, then reconnect, is the one pass that exercises the store, the queue and the drain together. What it proves differs by platform, so read the result accordingly: WorkManager carries on with the app gone, while a kill by the user on iOS stops background transfers until the app is opened again, which is `net-upload`, so there the pass is that the drain resumes at the next launch with nothing lost.
