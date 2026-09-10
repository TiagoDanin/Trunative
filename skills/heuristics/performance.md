# Performance

A phone runs the app on a battery, in one hand, on hardware picked for a price, at whatever thermal budget is left over from whatever the user did before opening it. That turns performance into a design constraint rather than an engineering one, because past a certain wait the user cannot tell a slow screen from a broken screen: they decide nothing happened and press again.

The device this fails on is never the device it was built on. It is a few years old, its storage is slow, its memory is shared with everything else the user left open, and it has been warm since before the app launched.

Row recycling is `list-virtualise`. Which properties an animation may move is `motion-cheap`. Request weight, timeouts and retries are `heuristics/network.md`. What a sensor or a location subscription is allowed to do, and what stops it, is `heuristics/sense.md`; this file owns only what holding one costs. What the screen shows while any of this is happening is `state-loading`, and the launch surface is `splash-system`.

## <Rule id="perf-cold-start" description="Only what the first screen draws happens before the first screen draws" />

Three ways in, and they cost different things: cold, with the process built from nothing; warm, with the first screen recreated while the process or part of the app is still resident; hot, with the app returning and its interface intact. Cold is the one that is designed for and the one that is never measured, because the phone on the desk is always warm.

Two numbers exist per launch. Time to initial display ends the moment a frame is on screen, and both platforms report it without the app doing anything. Time to full display ends when the screen holds real content, and it exists only if the app says so: `reportFullyDrawn()` on Android, a signpost on the points-of-interest log on iOS. An app whose first frame is a placeholder and that reports only the first number is timing the placeholder; where the first frame already carries real content the two are the same moment and nothing extra is owed. Android's store calls a cold start of 5s or a warm start of 2s excessive, which is the bar for bad rather than a target.

Everything else starts on first use, or on the first idle frame. What is found on the launch path and does not belong there:

- analytics beyond installing the crash handler, remote config, and feature flags;
- attribution, advertising and payment SDKs;
- database open and migration, and any synchronous file or preference read the first screen does not need; the small local reads that legitimately hold the launch surface are named in `splash-hold`;
- font and image preloads for screens nobody has opened yet;
- location, and any sensor or radio the first screen does not display;
- anything imported at module scope that the first render never touches, since it is parsed and evaluated before that render.

One dependency is usually most of the cost, so the cost is attributed per dependency rather than to launch in general. Each stack then has its own lever. On Android a baseline profile listing the startup path gets that code compiled ahead of time instead of interpreted, which is roughly 30% faster code execution from the first launch. On iOS the equivalent levers are the number of dynamic frameworks and everything that runs before `main`: static constructors, `+load`, and constructor attributes. On Flutter and React Native the engine or runtime start is a fixed cost underneath all of the above, so what the first screen does not need is deferred or lazily loaded rather than carried in the first bundle.

## <Rule id="perf-main-thread" description="The thread that draws does nothing else" />

Under 100ms a discrete tap reads as instant. A main thread busy for 250ms is what the iOS tools start reporting as a hang. At 5s of undelivered input Android raises an ANR, and iOS terminates an app whose main thread has stopped answering. On a phone there is no second window to look at while it recovers, so every one of those is a crash as far as the user is concerned.

What keeps turning up there and does not belong:

- JSON parsing, and any deserialization of a response big enough to page;
- database queries, file reads and preference reads, which are all slower on the storage a cheap phone ships with;
- image decode, crypto, and a regular expression run over a long string;
- sorting or filtering a whole collection to render a screenful of it;
- a state update scoped so wide that one keystroke rebuilds the screen.

Each stack names the way off, and the move is written at the call site rather than assumed: a dispatcher on Android, an actor boundary and an async context on iOS, an isolate for anything long in Flutter, work kept off the JS thread in React Native. A background thread that then hops back to publish a result once per element of a list has moved the problem rather than solved it.

## <Rule id="perf-frame" evidence="device" description="The budget is one refresh interval, and 60 is not a constant" />

One refresh interval is 16.6ms at 60Hz and 8.3ms on a 120Hz panel. What follows from it is that no value in the code may assume it. A 16ms timer, a frame count used as a duration, or an animation stepped by a fixed interval is a build tuned for one panel that stutters on the next one, and phone panels now run at 60Hz, 90Hz and 120Hz in the same product line. Motion comes from the stack's own frame callback or from `motion-cheap`.

Two ceilings sit above the budget. No frame in the app may take longer than 700ms, which is the point a frame stops being slow and reads as the app having stopped. And Android's vitals dashboard counts frames against a fixed 16ms whatever the panel is doing, so a build that meets a 120Hz deadline still reads as slow there. That is a reporting convention rather than a bar the store enforces, and the number to design against stays the device's own refresh interval.

## <Rule id="perf-overdraw" description="The look has a per-frame price, and a still screen pays it too" />

Blur, translucency, shadow and gradient are decisions taken in the design and settled in GPU time, charged on every frame the screen is up rather than only while something moves. `motion-cheap` bounds them during an animation; this rule is the screen sitting still.

- One blurred or translucent layer over scrolling content, never two stacked. The second has nothing left to reveal and doubles the sampling behind it.
- Elevation is a token count rather than a per-card decision. Forty rows each carrying a soft shadow is forty extra passes, and a divider, a spacing step or a tonal surface says the same thing for nothing.
- A gradient or a shader is bounded to the region doing the work (`color-gradient`), not stretched behind the whole screen.
- Backgrounds do not stack. An opaque window under an opaque container under an opaque card paints the same pixel three times, and on a mid-range device those repeats are the frame.

## <Rule id="perf-decode" description="An image costs its decoded size, and its decoded size is not its file size" />

A decoded bitmap is width times height times four bytes, taken from the pixels it was decoded to. A 4000 by 3000 photo is roughly 48MB resident whether it fills the screen or sits in a 48dp avatar, and a handful of those is more than the process is given. A 300KB file on disk says nothing about that number.

So the decode target is the box the image is drawn into. Where the loader derives that box from the layout it already satisfies the rule and owes nothing at the call site, which is the ordinary Android case with Coil or Glide. Where it cannot, the size is declared where the image is loaded: `cacheWidth` and `cacheHeight` in Flutter, the thumbnail size option on iOS, explicit dimensions on a React Native `uri` source, a width parameter on the URL where the pictures come from a service that can resize. A decode with no layout bound behind it is the defect this hunts. The decode itself never runs on the drawing thread, whatever sized it. Reserving the space before the bytes arrive is `icon-reserve`, and for a row it is `list-images`.

## <Rule id="perf-memory" description="Every cache states a ceiling, because the system decides who dies" />

A phone app rarely runs out of memory. It gets killed, usually while backgrounded, sometimes to protect a different app entirely. That is a state the app returns from, not an error, and it never shows one: where it returns to is `nav-restore`.

What makes this app the one chosen: an image or response cache with no bound, a list holding every page it has ever loaded, a screen whose objects outlive it through a listener, timer, subscription or observer that nothing removed, and assets preloaded for a screen that has since closed. So every cache the app wrote itself carries a maximum in entries or in bytes and an eviction rule. A library cache satisfies the same requirement where its default bound is left in place or set deliberately, so what review is looking for is the hand-rolled dictionary and the loader someone configured with its bound removed. Every listener, observer and subscription a screen registers is removed with it, and the ones whose cost is power rather than retention are `perf-power`.

One trap specific to Android: the trim-memory warning levels are deprecated and have not been delivered since API 34, leaving only the background and UI-hidden levels live. Code written to free memory when the system warns is code that now runs never, and it reads in review as memory pressure being handled.

## <Rule id="perf-power" evidence="device" description="A warm device makes every other number worse" />

Thermal throttling is the failure that hides all the others: the same code that met the frame budget a minute ago misses it once the device has been working, and no profiling run on a cold phone will show it. A screen's cost is therefore not what it does once, it is what it keeps doing.

- Which accuracy and which sampling rate a location or sensor subscription may take is `perm-scope` and `sense-motion`, and stopping one with the screen that started it is `sense-running`. What lands here is the price of holding hardware open at all: continuous scanning over a short range radio, a connection kept alive, a subscription still sampling behind a screen nobody is looking at.
- A repeating timer or a polling loop is a design decision with an interval to defend, not an implementation detail, and it is cancelled when its screen stops being visible.
- Anything that keeps the device awake or a service alive ends on a deterministic path including the failure path: a wake lock or a foreground service on Android, a background task assertion whose end handler runs on every branch and `isIdleTimerDisabled` on iOS. Android's store reports excessive partial wake locks by name.
- Both platforms publish a thermal level and both are read: the Android thermal status, whose severe level is where the experience is largely affected, and `ProcessInfo.thermalState` with its change notification on iOS. Anything doing sustained work reads that level and does less, instead of waiting to be throttled into jank.
- Doze and the standby buckets are respected rather than worked around, because work scheduled to defeat them is deferred anyway, at the cost of the battery figure the user sees with the app's name next to it. What the app changes under battery saver and Low Power Mode is `state-offline`.

## <Rule id="perf-size" description="Download size is a number the user sees before any of the design" />

The install is a conversion step taken on a cellular connection, on a device that is often nearly full. Google Play shows a warning on a mobile data connection above 200MB and reports uninstalls on devices with under 2GB free; iOS flags any device variant above its 200MB over-the-air download limit. Staying far below either is the normal case rather than an achievement.

The store builds already do most of the work: an app bundle and app thinning each send one density and one architecture to the device. What still fails is the build that goes around them, a universal or fat binary made for sideloading or for CI carrying every density and every ABI at once, which is what `flutter build apk` produces until it is split per ABI. The assets are authored at every density the platform asks for (`icon-vector`) and exactly one of them lands on the phone. Fonts ship the weights the type scale actually names and no others, which is usually two or three. Anything large that the first session does not open is downloaded after install rather than carried inside the build.

## <Rule id="perf-measure" description="The slowest supported device, a release build, and production-scale data" />

All three conditions, or the reading is not evidence. The slowest device the app supports, not the emulator and not the phone on the desk. A release or profile build, because every stack here runs its debug build slower than the one that ships, which makes a debug measurement useless in both directions. And production-scale data, because a list is smooth at twenty rows in any implementation.

Then the reading is compared against something. `STACK.md` names that device and the budget each measurement has to beat: cold start, frames on the longest list, memory after a few screens. The measurements themselves live wherever the tooling writes them, each with the date it was taken, because a number with no date stops being evidence and keeps looking like it. A feeling is not a reading either, and an optimisation with a number on only one side of it is a guess that cost code. Each stack already ships the instrument:

- **iOS:** the App Launch, Time Profiler and Hangs instruments, the Launch Time, Hitches and Hangs panes for what shipped, and MetricKit for the field.
- **Android:** Macrobenchmark for startup and scrolling, JankStats for jank in the field, and the vitals the store reports back for the devices nobody tested on.
- **Flutter:** `flutter run --profile`, with the UI thread and the raster thread read as two separate numbers.
- **React Native:** the performance monitor, with the JS frame rate and the UI frame rate read as two separate numbers.
- **Mobile web inside the app:** 2.5s to the largest contentful paint, 200ms interaction to next paint, and 0.1 of cumulative layout shift, each measured at the 75th percentile rather than as an average.

<Check>

<Verify rule="perf-cold-start">Nothing initializes on the launch path that the first screen does not draw, and any launch whose first frame is a placeholder reports its own time to full display.</Verify>
<Verify rule="perf-main-thread">Zero parses, queries, file reads, decodes or whole-collection sorts run on the drawing thread, and each one names where it moved to.</Verify>
<Verify rule="perf-frame">No timer, duration or step count assumes 60Hz, and every hand-written animation is driven by the stack's frame callback.</Verify>
<Verify rule="perf-overdraw">No two translucent or blurred layers stack over the same content, elevation comes from a token count rather than a per-card decision, and no gradient or shader runs behind a whole screen.</Verify>
<Verify rule="perf-decode">Every decode targets the box the image is drawn into, declared at the load site wherever the loader cannot derive it, and no decode runs on the drawing thread.</Verify>
<Verify rule="perf-memory">Every cache the app wrote states a maximum and an eviction rule and no library cache has had its bound removed, every listener, observer and subscription a screen registers is removed with it, and nothing depends on a trim-memory level the platform no longer sends.</Verify>
<Verify rule="perf-power">Every repeating timer, scanning subscription, wake lock and background assertion names the interval it defends and has exactly one path that ends it, including the failure path, and sustained work reads the thermal level.</Verify>
<Verify rule="perf-size">The shipped build sends one density and one architecture per device rather than a universal binary, only the font weights the type scale names, and nothing large that the first session does not open.</Verify>
<Verify rule="perf-measure">`STACK.md` names the slowest supported device and a budget for cold start, for frames on the longest list, and for memory after a few screens.</Verify>

<Device>`perf-measure` is the one answered by whether the budgets exist at all, and a missing budget is the violation rather than a slow number. `perf-frame` and `perf-power` are answered in the source first, where a hardcoded 16ms and a subscription with no stop are both visible, and then again on hardware that has been working long enough to get warm, because thermal behaviour and sustained frame pacing exist nowhere else.</Device>

</Check>
