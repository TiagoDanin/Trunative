# Network

The phone is the device where the connection is worst and the person holding it is least patient. The link is high latency, it costs money on most plans, and it changes underneath a running screen: Wi-Fi to cellular at the door, one cell to the next on a train, three bars to nothing in a lift.

Online and slow is the problem this file exists for, and it is a different problem from offline. Nothing throws, so no error branch runs. The request is still open, the screen is still waiting, and the only thing that ends it is the user closing the app.

This file owns the request and the radio: deadlines, retries, cancellation, how many calls a screen makes and how many bytes each one costs. What is stored on the device and what is queued while disconnected is `heuristics/offline.md`. What the screen shows while any of it happens is `state-loading`, `state-offline` and `state-stale`.

## <Rule id="net-timeout" evidence="device" description="Every request carries a deadline the app chose" />

`state-loading` owns what the screen draws when a deadline is reached. This rule owns the deadline itself, which no stack sets on the app's behalf.

The stock values bound parts of a call, not the call. On iOS `timeoutIntervalForRequest` defaults to 60 seconds and is an idle timer, reset every time a byte arrives, so a connection dripping one packet at a time never trips it at all; `timeoutIntervalForResource`, the cap on the whole transfer, defaults to seven days. OkHttp bounds connect, read and write at ten seconds each and leaves `callTimeout` at zero, so the call as a whole is unbounded. The trickling connection is the ordinary way a phone link fails, and none of those defaults ends it.

So bound the whole call, not just its idle gaps. Give each class of request its own deadline (an interactive read, a submit, a background sync, a media transfer), keep them as named constants in one place instead of per call site, and hand each one to `state-loading` with its branch already written.

The two background classes carry an exception. A background `URLSession` transfer is bounded by `timeoutIntervalForResource` rather than by the request timeout, and it retries a timed-out upload or download itself, so the attempt ceiling in `net-backoff` does not apply there and a hand-rolled retry stacked on top of it counts twice.

## <Rule id="net-backoff" evidence="device" description="Retry backs off with jitter, and stops at a written number of attempts" />

`state-retry` settles that automatic retry backs off, stops, and fires on the platform's reconnect signal. Three things it leaves open, and this rule owns them.

- **Jitter.** That reconnect signal fires on every phone at once: a carriage empties onto a platform, a tower comes back, a train leaves a tunnel. A fixed schedule turns the fleet into one synchronised wave that arrives at a server already struggling. Randomise every delay.
- **A ceiling that exists as a constant.** Attempts are counted and the count is written down, so the retry ends in a message rather than in a loop nobody watched.
- **Only what is safe to retry.** A lost connection, a timeout, a 429 and a 5xx are worth another attempt. A 400, 403 or 404 gives the same answer the second time, and spending attempts on it only delays the sentence the user needs. Where the server sends `Retry-After`, it wins over the schedule.
- **A 401 is the one 4xx that is retried.** It means authenticate and try again, so the app refreshes the token and replays the request once, through the hook built for it (`Authenticator` in OkHttp, a request interceptor on iOS and in Flutter). Deduplicate the refresh, or an hour spent backgrounded ends with every queued request firing its own. Sign the user out only when the refresh itself is refused.

A retried write carries the same client-generated key on every attempt, so the server can tell the second arrival is the first one coming round again. Without it, a confirmation that dies on the return trip charges the card twice. `off-queue` holds that key for queued work; a foreground retry of a submit needs it just as much.

## <Rule id="net-cancel" evidence="device" description="Leaving the screen cancels its requests, and a late answer never lands on the current one" />

What the first half hunts is the detached request: `GlobalScope`, a bare `Task {}`, a `fetch` with no signal, a client nobody disposes. Owned by nothing, it holds the radio up and delivers into a screen that has been popped. The idiomatic APIs already end on their own, so this is a defect of going around them rather than of forgetting a call: `.task` and `lifecycleScope` die with the screen, an `AbortController` aborts with the effect that made it, a Flutter cancel token is disposed with the widget. `viewModelScope` is the deliberate exception, because a ViewModel survives the rotation that destroys and rebuilds the screen, which is what makes the second half of this rule load-bearing rather than free.

That second half is ordering. Two answers to the same question come back out of order, and on a slow link they routinely do: the search for "ma" lands after the search for "mango" and overwrites it. What has to be true is that a response never writes state for a question the user has moved on from. A latest-wins operator gets there by construction (`flatMapLatest` or `collectLatest`, `.task(id:)`, `switchMap`, a token swapped per query) and correct code built that way has no "am I still current" line anywhere in it; an explicit generation check gets there by hand. Either satisfies the rule. The phone makes the failure constant rather than rare, because back is a cheap edge gesture, screens are destroyed and rebuilt, and with a single screen visible the overwrite happens under the eyes of the person who caused it.

## <Rule id="net-dedupe" description="One read in flight per thing being asked for" />

Key in-flight reads on the endpoint and its parameters. On a phone the same read is fired twice from ordinary places the user never touched: two components on one screen wanting the same record, a screen that re-requests on every resume, an effect that repeats on a re-render.

- A duplicate arriving from code joins the request already running instead of opening a second one.
- A duplicate arriving from the user preempts it. A pull to refresh is a request for the value as of now, so it cancels the refresh already in flight and fetches again; joining that one answers the gesture with bytes fetched before the thumb moved, which is the single thing the gesture exists to rule out. `list-refresh` owns the gesture itself.
- Writes are never deduplicated by request shape. Two identical writes are two writes: the same message sent twice, a second unit of the same item, a measurement logged again. What collapses a duplicate write is the client key in `net-backoff`, carried on every attempt so the server can recognise it, with `button-state` stopping the control accepting the second tap in the first place.

## <Rule id="net-fanout" evidence="device" description="Count the calls a screen makes, and the count does not grow with the rows" />

A list that fires one request per row is a defect rather than a slow screen. The clients pool connections, so the bill is not twenty handshakes: it is twenty round trips on a link where one round trip is already the slowest thing on the screen, and a radio held at full power across the whole span instead of for a single burst.

- The first render of a screen makes a fixed number of calls, and that number is written down. Rows arrive carrying what they draw, or their ids go out in one batched call.
- Chains pay their latency end to end. Independent calls start together; only a call that genuinely needs the previous answer waits for it.
- Polling is fan-out spread over time. Where the product needs live data, a subscription or a push costs one connection instead of one per interval. The interval a poll is allowed to keep, and ending it when its screen goes away, is `perf-power`.

## <Rule id="net-payload" description="Ask for the size the screen draws and the fields it renders" />

- **Images.** Request the variant sized for the box it lands in, at the device's pixel ratio, from the server or the image CDN. Decoding to the drawn size is `list-images` and `perf-decode`, which are memory; this is the bytes crossing a metered link, and shipping a full-resolution photograph to fill a 48dp circle spends both.
- **Fields.** Ask for what the screen renders. A row showing a name and a thumbnail does not need the record behind it, and a mobile-shaped response is a server change worth asking for rather than a filter applied after the download.
- **Pages.** Page size is a constant derived from what fills the viewport plus a screenful of headroom. Page by cursor rather than by offset: a phone feed is re-entered a dozen times across a day of interruptions and each return resumes paging from where the thumb stopped, so rows that shifted in between make an offset repeat some and skip others, in the one place the user is looking.
- Nothing sets `Accept-Encoding` by hand. The clients add it and decompress the response transparently, and both stop the moment a header interceptor writes that header itself, leaving the app fetching uncompressed bytes and holding a decode it did not ask for.

## <Rule id="net-conditional" description="Refreshing something already held asks whether it changed" />

The cheapest answer on a metered radio is the one with no body in it. A record kept locally keeps the validator it arrived with, `ETag` or `Last-Modified`, and the refresh sends it back as `If-None-Match` or `If-Modified-Since`. A 304 then moves the freshness mark that `state-stale` renders and leaves the content on screen untouched.

Skip it and every pull to refresh downloads a page the device already holds byte for byte, which is the most expensive way to learn that nothing happened. The validator lives in the record's own row, beside the fields `off-fresh-marks` names, because a header cache the OS is free to reclaim cannot be relied on to still hold it.

## <Rule id="net-metered" description="Metered is a setting the user chose, not a transport you detect" />

Read the flag the platform publishes: `NWPath.isConstrained` and `allowsConstrainedNetworkAccess` for Low Data Mode, `getRestrictBackgroundStatus()` and `NET_CAPABILITY_NOT_METERED` for Data Saver and metered networks, `isConnectionExpensive` in React Native, `navigator.connection.saveData` on the web where it exists at all, which is a hint and not a guarantee.

- Metered is defined by what the connection costs the person, not by which radio carries it. A tethered hotspot arrives over Wi-Fi and is metered; an unlimited plan is cellular and is not. Code that branches on "is this Wi-Fi" gets both cases wrong.
- Limit on any metered connection, whether or not the system setting is on, and whether or not the app has been exempted from the restriction. The exemption is permission to keep working, not permission to stop caring.
- What changes under the flag is listed in `state-offline`. What must not change is the tap: user-initiated work is delivered, in a smaller form if it has to be, and never blocked. Do not put up a dialog asking whether they really meant it. They set the flag on purpose, and the app is being asked to spend less, not to ask more.

## <Rule id="net-reachability" description="A connectivity check defers optional work, it never gates a tap" />

Having a network and reaching a server are different states, and the platforms report them separately: on Android `NET_CAPABILITY_INTERNET` means the network is set up while `NET_CAPABILITY_VALIDATED` means it was actually probed, and a captive portal holds the first without the second. React Native splits the same pair into `isConnected` and `isInternetReachable`, and `navigator.onLine` on the web counts a LAN with no route out as online.

- The check never decides whether a request the user has committed to is allowed out. Send it, and let the failure be the answer, because a check saying no on a working connection is an outage the app invented. It may shape the control before the tap, which is the online-only mode in `off-write-mode`, and it may skip optional traffic. It may not sit between the tap and the socket.
- Where it earns its place is deferring the optional: prefetch, analytics and background sync skip rather than sending the radio hunting for a signal that is not there.
- Subscribe rather than poll: `NWPathMonitor`, `registerDefaultNetworkCallback`. Capabilities change under a running app, and a value read a moment ago is already a guess.
- There is a third answer besides sent and failed. `waitsForConnectivity` holds a task until a path exists instead of failing it, and reports through `urlSession(_:taskIsWaitingForConnectivity:)`, which is where the app gets to say so. That wait takes the same deadline as everything else and surfaces through `state-offline`, rather than sitting silently inside a loading state with no end. Background sessions ignore the flag and always wait.

## <Rule id="net-prefetch" description="Prefetch spends data on content that may never be read" />

It is a trade, so it gets a budget rather than an instinct. Fetch in a shape that needs another download only every 2 to 5 minutes and in the order of 1 to 5 megabytes, and pull large media in chunks on that same interval instead of in one go. What the repeated waking costs the battery is `perf-power`.

- Write down what is prefetched, how much of it, and what triggers it. The next page of a list already being scrolled and the detail behind the row under the thumb both earn it. A whole feed of full-size media does not.
- It never runs during launch, where `perf-cold-start` already keeps preloads for unopened screens off the path to the first frame, and it never runs under the flag in `net-metered`.

## <Rule id="net-upload" description="A transfer outlives the screen, and its progress counts bytes" />

`off-queue` owns the durable queue of writes and the scheduler that drains it. What is left here is the transfer the user started and is watching, which runs long enough that the app is suspended before it ends. Hand it to the platform service that matches its shape.

- **iOS.** A background `URLSession`. Its upload body has to be a file on disk: a background session refuses one built from a `Data` or a stream, which is the failure that kills the transfer at the first suspension.
- **Android.** WorkManager where the transfer is short and interruptible. A user-initiated data transfer job (`setUserInitiated(true)`, permission `RUN_USER_INITIATED_JOBS`, API 34 and up) where it is long and the user started it, scheduled while the app is still visible. `DownloadManager` where the thing is a download, since it already retries across connectivity changes and reboots and takes its own metered and roaming limits. The long-running foreground-service worker is what is left below API 34, and for apps targeting API 35 and up its data sync time is capped at 6 hours in any 24, with the timer reset each time the user brings the app back to the foreground.

Then:

- Chunk it and keep a resume handle in durable storage, so an interruption continues instead of starting over. On iOS a download resumes from `resumeData` only where the request was a GET, the server sent `ETag` or `Last-Modified`, and byte ranges are supported; miss one and the whole file comes down again. An upload has no client-side equivalent: its resume point lives on the server, through a chunked or resumable upload protocol.
- The transfer does not survive everything, and the interface must not imply it does. Swiping the app out of the switcher cancels iOS background transfers until the person opens the app again.
- Progress is real bytes moved over bytes total, emitted by the transfer rather than estimated from elapsed time. How that number is drawn, whether pause stands beside cancel, and what the user is told cancelling costs are all `state-loading`.

<Check>

<Verify rule="net-timeout">Every class of request has a total deadline on the whole call, held as a named constant, and background transfers take the resource timeout rather than the request one.</Verify>
<Verify rule="net-backoff">Automatic retry randomises its delays, counts attempts against a constant, retries only transient failures, 5xx and one deduplicated token refresh on a 401, and repeats a write under the same client key.</Verify>
<Verify rule="net-cancel">No request runs on a detached scope, and a response to a question the user has left cannot write state, whether by a latest-wins operator or by an explicit generation check.</Verify>
<Verify rule="net-dedupe">Reads in flight are keyed and shared, a refresh gesture preempts the request already running rather than joining it, and no write is collapsed by its shape.</Verify>
<Verify rule="net-fanout">The number of calls a screen makes to render is fixed and written down, does not scale with row count, and independent calls do not run in a chain.</Verify>
<Verify rule="net-payload">Image requests carry the drawn size, responses carry only rendered fields, pages are cursor-based at a size derived from the viewport, and nothing sets `Accept-Encoding` by hand.</Verify>
<Verify rule="net-conditional">A refresh of a stored record sends the validator it was stored with, and a 304 updates its freshness mark without touching the content on screen.</Verify>
<Verify rule="net-metered">The metered and Low Data Mode flags are read from the platform rather than inferred from the transport, and no user-initiated request is blocked or questioned because one is set.</Verify>
<Verify rule="net-reachability">No connectivity check stands between a committed tap and the request it sends, and the app subscribes to path changes rather than polling them.</Verify>
<Verify rule="net-prefetch">Prefetch has a written budget and trigger, and runs neither during launch nor on a metered connection.</Verify>
<Verify rule="net-upload">Long transfers run on the platform service matching their shape, carry a durable resume handle, and report progress from real byte counts.</Verify>

<Device>Answer `net-timeout`, `net-backoff` and `net-cancel` on a throttled connection rather than on a fast one, because every one of them passes by accident when the response arrives in 40ms. `net-fanout` is answered by counting the calls on a proxy while one screen opens, not by reading the repository.</Device>

</Check>
