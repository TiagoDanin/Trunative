# Launch surface

The one surface in a mobile app the app does not draw. The operating system puts it up the moment the app is launched, from the icon or from anywhere else, before a single line of the product has run, and takes it down when the first real frame is ready. It exists to hide that gap. It is not a title card, not a brand moment, and not a place to say anything.

It is also the highest frequency screen in the product. It appears on every cold and warm open for the life of the install, which is several times a day, for years. Every millisecond added to it is spent again on each of those opens.

One naming trap sits under the whole subject and it breaks rules written from either platform alone. iOS calls this the launch screen and forbids a logo on it, reserving the word splash for a branded graphic shown later, inside the app. Android calls its version the splash screen and puts the app icon on it by default. "Show the logo on the splash" is correct on one platform and a violation on the other.

The branded moment that happens once, inside the app, is `onboard-splash`. The wait that continues after this surface is gone is `state-loading`. Per stack keys, attributes and dismissal APIs are in `references/launch-surface.md`, for one lookup rather than a read through.

## `splash-system` The system draws it, the app only configures it

There is no code running on this surface. On iOS it is a property list dictionary or an inert storyboard with no outlets, no actions and no custom classes. On Android 12 and up it is a set of theme attributes, and the compat library puts the same surface back on older releases from a single theme.

A screen the app draws is a different thing wearing the same name. A splash route in the navigator, a dedicated splash Activity, a `<Splash />` component with its own timer: each of those runs *after* launching has already finished, so it adds time to the open rather than covering it. The enter animation belongs to the system and cannot be replaced.

## `splash-double` One surface between the icon and the first screen

Count them. The answer is one.

Two is what ships when a dedicated splash Activity survives into Android 12: it now plays after the system splash instead of being the only one. On the cross platform stacks the same shape appears as a splash component rendered on top of an already dismissed native surface.

Where a routing activity has to stay, hold the system surface across it rather than drawing a second one, so the same surface transfers to the destination.

## `splash-contents` What may be on it is narrower than the design assumes

Two element sets, one per platform. One asset shipped to both is wrong on one of them.

- **iOS:** only what is already on the first real screen. A background color, and the empty navigation, tab or tool bars if that screen has them. No text of any kind, no logo, no illustration, unless it is a fixed part of the first screen. If the first screen is a solid color, the launch screen is that solid color and nothing else.
- **Android:** a single opaque window background color, the app icon as a vector, and optionally a circle behind it. One third of the icon foreground is masked, so anything drawn in the outer third is gone. The window background carries no transparency, and the centre icon is not guaranteed: the platform decides whether it appears unless the app opts in through `windowSplashScreenBehavior`. The branding image slot at the bottom stays empty. Every size the icon and that slot have to hit is in `references/launch-surface.md`.

Neither platform gets a tagline, a version string, a copyright line or a loading message.

## `splash-match` It matches the frame that replaces it

The background is the first real screen's background token, at the same value, in the same appearance. Not the brand color, unless those are the same thing. Anything that differs shows up as a flash on every open, which is the exact opposite of what the surface is for.

Orientation follows what the app itself supports. An app that runs in both orientations launches in the one the device is already held in, and an app locked under `layout-orientation` launches in the orientation it is locked to.

On Android the background reaches the surface through the splash screen attributes. A launch theme that sets `android:windowBackground` is the pre Android 12 pattern, and from Android 12 the system discards that theme and draws its own default splash instead, so the color that was matched so carefully never appears at all.

## `splash-no-progress` Nothing on it measures anything

No spinner, no progress bar, no percentage, no status line naming a step. The surface is a static image the system composites, with no access to the work happening behind it, so any number written on it was invented. A staged sequence of stages and percentages is a script driven by a timer, and it reports on nothing.

Once the app is stable enough to take the surface down, there is nothing left to spin about. A spinner that feels necessary here is the signal that the surface was held too long: `splash-hold`.

## `splash-hold` Hold it only for work that has a bound

What legitimately holds it: a session token read from local storage, a theme or token set resolving, a font loading. Local, fast, and finite.

What does not: a network request. There is no bound on one, and on iOS a launch that never draws its first frame is killed by the watchdog, while on Android the surface times out and the wait simply becomes visible.

The budget the hold is spent from is `perf-cold-start`. The moment the work stops being local and bounded, take the surface down and let the real screen do the waiting with a placeholder, which is `state-loading`. Every hold mechanism takes a condition that has to become false, so write the failure path first: name what flips it when the read fails, returns nothing, or hangs.

## `splash-no-floor` No artificial minimum

A timer that keeps the surface up for a fixed two seconds so a logo can be admired is time taken from the user on every open, several times a day, forever. Ready in 180 ms means shown for 180 ms.

Read the dismissal path. Any duration in it that is not the platform's own fade is a floor, and it is the single most common thing added to a launch surface that should not be there.

## `splash-appearance` It cannot read a theme, translate, or scale

It resolves before the app runs, which decides three things rather than one.

- Dark and light are separate resources: an appearance aware color set on iOS, a night qualified resource on Android, the dark block in the config on the cross platform stacks. A light asset in front of a dark first screen flashes on every open in dark mode.
- No text is a localization rule, not a taste one. The string layer cannot reach this surface, so anything written on it ships in one language to everyone: `l10n-strings`.
- Nothing on it responds to the text size setting either, which is the second reason nothing on it is text: `type-scaling`.

## `splash-animation` Movement on it extends the wait it exists to hide

The iOS launch screen is static and has no mechanism to be otherwise. On Android the centre icon may be an animated vector, under three limits: at most 166 ms of delay before it starts, which the platform bounds; at most 1000 ms of animation, which is this file's ceiling; and a loop rather than a longer one shot if the app is still not ready. The declared duration only reports the animation's length to a custom exit. It changes neither the animation nor how long the surface stays up.

Taking over the exit animation makes the app responsible for removing the surface, and a path that skips the removal leaves it on screen permanently. That exit is also the only movement here `motion-reduced` can reach: the enter animation belongs to the system, which answers the device's animation setting on its own, and no app code is running yet to read a flag.

## `splash-daily` It belongs to the cold open, not the first one

Three kinds of open, and this surface belongs to two of them. Cold, with no process: it shows. Warm, process gone but the app in the recents list: it shows. Hot, coming back from the background with everything alive: it does not, and a build that draws its own splash on resume has turned a free return into a wait.

So nothing on it is a first run event. No welcome, no version notice, no changelog, no tip. Whatever appears here appears on the thousandth open as well.

## `splash-entry` It hands over to whatever the launch was for

Most opens are not an icon tap. A notification, a deep link, a widget and a share sheet all start the same cold launch, and the surface comes down onto whatever the app draws first. Draw the home screen and push the target after it, and the user watches a second transition, which is precisely the transition this surface existed to hide.

So the destination is resolved before the first draw, from the intent, the launch URL or the payload, rather than in an effect that runs once a screen is already up. Every cold entry point the app declares is one of these. What sits underneath the destination is `nav-deeplink`, and the payload that names it is `notify-destination`.

## `splash-first-frame` The frame after it is already the screen

The handoff is invisible only if what replaces the surface is the screen and not a stand in for it. That frame already carries the chrome (navigation bar, tab bar, header), sits inside the safe area (`layout-insets`), and shows the content as placeholders in its real shape (`state-loading`).

A blank screen, a centered spinner or a second background color after the launch surface means the surface covered nothing and the wait simply moved.

## Check

Review answers each of these against the code, pointing at the line:

- The launch surface is configured through the platform mechanism, and no route, activity or component draws a second one on the launch path; a first run branded frame is `onboard-splash` and is not this surface. `splash-system`
- Exactly one surface sits between the launch and the first real screen. `splash-double`
- The surface holds only the elements its platform allows, and the iOS and Android assets are not the same file. `splash-contents`
- Its background is the first screen's background token at the same value, declared through the splash screen attributes rather than `android:windowBackground`, and its orientation matches what the app supports (`layout-orientation`). `splash-match`
- Zero spinners, progress bars, percentages and status lines on it. `splash-no-progress`
- Everything the hold condition waits on is local and bounded, and each one has a named path that releases it on failure. `splash-hold`
- The dismissal path contains no duration other than the platform fade. `splash-no-floor`
- A dark resource and a light resource both exist, and the surface carries zero strings. `splash-appearance`
- Any icon animation stays within 1000 ms, starts within 166 ms, and loops rather than running longer, and a custom exit removes the surface on every path. `splash-animation`
- Nothing on the surface is first run content, and nothing draws it on a hot resume. `splash-daily`
- Every cold entry point the app declares resolves its destination before the first draw, so the frame after the surface is the target rather than the home screen. `splash-entry`
- The first frame after it carries the chrome, the insets and placeholder content, not a spinner. `splash-first-frame`

Check `splash-match`, `splash-appearance` and `splash-first-frame` by opening the app cold in both appearances and watching the handoff, rather than by reading the config. A mismatch of one step is invisible in a token table and obvious as a flash.
