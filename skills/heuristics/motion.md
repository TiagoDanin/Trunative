# Motion

A phone shows one screen at a time, so every screen replaces the last one outright. Motion is what stops that from being a cut: it says where a thing came from, where it went, and that the tap registered. That is the whole job. Everything else is time added between a finger and the content it was reaching for, on a device where the same transition plays dozens of times a day and is paid for in battery.

Generated screens fail this in a recognisable way: motion appears everywhere except the three places it was needed, an entrance animation on content that never changed, a pulse on a badge, a fade-in on the first screenful, and no fallback at all for a person who turned movement off.

Press feedback timing is `touch-feedback`. Loading and skeleton behaviour is `state-loading`. The predictive back gesture is `touch-gestures`. Token values and per-stack API names are in `references/motion-tokens.md`.

## `motion-job` Every animation answers a question, and there are three questions

Continuity: this came from that, or it went there. Latency: work is happening and here is the shape of it. Acknowledgement: your touch landed. Point at an animation and name which of the three it serves. If the answer is that the screen felt static, delete it.

The frequent interactions are already animated, and the two platforms want different things done about it. On iOS, do not add motion to a switch, a row selection or a tab change: the system tuned those and a hand-written replacement trades something tuned for something invented. On Android those same components move from the theme's motion scheme, so a build that wants them calmer or livelier changes the scheme rather than animating the component where it is used.

The count is per screen, and at rest means no work outstanding, no gesture in progress and no media playing. In that condition nothing moves, with one exception: an indicator saying work is still happening, which is `state-loading`.

## `motion-platform` The transition between screens is not yours to write

Push, sheet, cover and dismissal come with motion attached. Where the container ends through a gesture, which is the interactive pop, the sheet drag and predictive back, that motion is interruptible and driven by the finger rather than played at it. A custom route transition replaces it with a fixed animation that runs to the end, and one that never reads the gesture's progress leaves the system drawing a back preview the transition itself ignores. Driving it from that progress instead is `touch-gestures`.

Custom transition code between screens (`PageRouteBuilder` with a hand-written `transitionsBuilder`, `enterTransition`, `exitTransition`, `popEnterTransition` or `popExitTransition` overriding a `composable()` destination's preset, a `UIViewControllerAnimatedTransitioning` for an ordinary push) needs a reason written next to it. Which container is right in the first place is `nav-container`.

## `motion-model` Name the platform's model, never a literal value

Two motion systems, and using the wrong one is what makes a build feel foreign.

- **iOS is spring based.** `Animation.spring(response:dampingFraction:)` or `UIView.animate(springDuration:bounce:)`, and the parameter is bounce, not a curve. Apple publishes no duration table for UI motion, so a millisecond figure attributed to iOS was invented by whoever wrote it.
- **Material ships both.** The Views library still carries sixteen duration tokens and seven easing tokens, and adds six springs beside them. The Compose Material scheme carries no duration and no easing at all: `MaterialTheme.motionScheme` exposes six specs, three spatial and three effects, in a standard or an expressive scheme, and `MaterialExpressiveTheme` defaults to expressive. Material motion on Compose is therefore reached as a spring spec. `tween` and the easing curves stay available for animations outside the Material scheme.

Spatial springs move a thing and may overshoot. Effects springs carry color and opacity, where overshoot means the value passes its own target and the color is briefly wrong.

The rule the two systems share is that no motion value is invented at the call site, the way `color-roles` allows no hex there. `spring(dampingRatio = 0.4f, stiffness = 120f)` written inline is the motion equivalent of a raw hex, and twenty of them are twenty different feels in one app. Where the value is reached from differs, and only one platform hands you a theme:

- **Android** has one, so use it: `MaterialTheme.motionScheme` on Compose, the `?attr/motionSpring*` and duration attributes in Views.
- **iOS** ships no motion theme, so the app is the one that has to hold the set. Put the named `Animation` constants in a single file and refer to them by name from every call site.

## `motion-duration` Where duration applies, it is latency, and it scales with distance

Press feedback has its own deadline, which is `touch-feedback`. What this rule owns is everything after it: a routine transition finishes inside 300ms, and past 400ms the animation stops being motion and becomes a wait, one the user pays on every navigation for the life of the app.

Duration rises with the area covered: a chip changing tint and a full screen cover arriving do not share a number. In Material terms the short tokens (50 to 200ms) carry small in-place changes and the medium tokens (250 to 400ms) carry a transition, with a full screen change at the top of that band and nothing above it. The long and extra-long tokens start at 450ms, so they belong only to motion no interaction is waiting on.

## `motion-choreo` One thing leads

When several elements move at once, the eye needs one anchor. Give the change a single subject, either an element that persists across the transition (`SharedTransitionLayout` on Compose, `.navigationTransition(.zoom(sourceID:in:))` on iOS 18, `Hero` on Flutter) or one region that moves while the rest holds still. Four independent animations at four different durations is not choreography, it is four animations.

Stagger only where the content genuinely arrives as a list, only on first appearance, and only within a budget: at most 30ms of step between rows and at most 200ms of added delay across the visible ones, so the last row is not waiting on the first. A stagger that replays on every scroll, every refresh or every filter change turns the list into a slot machine, and it re-runs on recycled rows, so it fires for rows that were already on screen.

## `motion-loop` Nothing loops next to something being read

An animation that repeats without end has no question to answer: the tap already landed, the content already arrived. Beside text, it takes the reading away from everyone and makes it impossible for some.

- Motion that starts on its own, runs longer than 5 seconds and sits beside other content needs a control to pause, stop or hide it. Motion the user is waiting on is the exception and needs no such control: a shimmer or a progress indicator is doing the job `state-loading` gives it.
- Auto-updating information gets the same control at any duration, because a figure that rewrites itself under the eye has no safe length.
- Nothing flashes more than 3 times in any 1 second.
- Every animation ends when its reason ends. One still running after its cause is gone is a bug with an animation on it.
- A parallax or collapsing header tracks the finger and never plays by itself. What is banned outright is an element pulsing to attract attention and an entrance animation on the first screenful (`layout-fold`). Content the user opened the app for is already the reason they are looking; fading it in delays it and says nothing.

## `motion-autoplay` Video and animated images start because the user started them

The longest-running motion in a real app is usually not an animation anyone wrote: it is a video preview, a looping clip or an animated image in a feed. Nothing above governs it, and muted autoplay is still motion beside the thing being read. Where the platform publishes a preference, it is read rather than assumed: on iOS `UIAccessibility.isVideoAutoplayEnabled` carries the Auto-Play Video Previews switch, and the animated images setting sits beside it.

- Where the setting is off, the asset shows its first frame with a play control and waits.
- Anything that does autoplay carries a visible stop within one step, never buried behind a long press.
- A looping asset stops when its screen goes away, rather than playing on behind whatever came next.
- The sound half is `a11y-media`, and stopping autoplay on a metered or power-saving device is `state-offline`.

## `motion-blocks` Motion never holds the user still

Nothing waits for an animation to finish. A second tap during a transition does not queue a second transition, the back gesture interrupts whatever is playing, and no input is gated on a completion callback. This matters more the more often the animation runs: a sequence that charms once is an obstacle by the fiftieth launch.

Anything the user cannot skip and did not ask for is the failure case: a splash sequence played out before the content is reachable, a success animation held for a beat after the work is done, a modal that cannot be dismissed until its entrance completes.

## `motion-cheap` Hand-written animation moves transform and opacity, not layout

The test is who owns the animation, not which property moves. The framework's own layout animations are tuned and batched, so a shared element or container transform, `AnimatedVisibility`, `Modifier.animateContentSize`, `Modifier.animateItem` and Flutter's implicit `Animated*` widgets are all correct, including where they animate bounds. What this rule bans is the hand-written kind: a value driven per frame on the main thread into width, height, margin, padding or a static offset, which re-runs measurement every frame and is how a smooth-looking animation becomes the dropped-frame complaint. The frame budget it has to fit inside is `perf-frame`, and a 120Hz panel halves it.

- React Native: `useNativeDriver: true`, or Reanimated, so the animation is not sitting behind whatever the JS thread is doing. Layout properties do not support the native driver at all.
- Compose: animating a static offset value re-runs composition and measurement, so take the lambda form of `Modifier.offset`, which defers the read to placement, or `graphicsLayer`, which defers it to draw.
- Flutter: `FadeTransition` or `AnimatedOpacity` for a fade and `SlideTransition` or `ScaleTransition` for movement. Animating an `Opacity` widget directly rebuilds its subtree every frame; `Transform` is for a static transform.
- Mobile web: `transform` and `opacity` only.

Blur, shadow and shader work stay bounded to a region, and the count of things animating at once is small enough to name.

## `motion-reduced` The reduced build still communicates, it just does not move

Reduce Motion on iOS and Remove animations on Android are settings real people turn on because motion makes them ill. Neither is answered by setting duration to zero and calling it done, and the two ask for different things, which is why one implementation cannot serve both.

- **iOS asks you to substitute.** A cross fade replaces a slide or a zoom, parallax and depth changes go entirely, springs lose their bounce, and nothing animates into or out of a blur. Check `UIAccessibility.prefersCrossFadeTransitions` before substituting a cross fade; SwiftUI reads that one through UIKit, since there is no environment value for it.
- **Android asks you to remove.** The signal is the animator duration scale, so a substituted animation will not run either. The requirement is that the screen still reads correctly with nothing animating at all, and on Compose that the scheme drops to `MotionScheme.standard()`, because nothing swaps the expressive one by itself.

Feedback survives on both, because a person who turned motion off still needs to know the tap worked.

Read the flag per stack, which is the trap: on Flutter, `MediaQuery.disableAnimationsOf` carries Android's setting and iOS Reduce Motion arrives only through `AccessibilityFeatures.reduceMotion`, so reading one silently drops the other platform's users. The names are in `references/motion-tokens.md`.

Motion is also never the only carrier of a change. Anything that says its piece by moving says nothing to the person who turned movement off, and nothing to a screen reader either.

## Check

Review answers each of these against the code, pointing at the line:

- Every animation on the screen serves continuity, latency or acknowledgement; and separately, with no work outstanding, no gesture in progress and no media playing, the only thing still moving is a latency indicator. `motion-job`
- No custom transition replaces a platform push, sheet, cover or dismissal without a written reason. `motion-platform`
- iOS motion is expressed as springs reached from one named set, Android motion through the scheme or the tokens, and no duration, curve or stiffness is a literal at a call site. `motion-model`
- Routine transitions finish under 300ms, nothing an interaction waits on exceeds 400ms, and larger movements take longer than smaller ones. `motion-duration`
- One element or region leads each transition, and any stagger runs on first appearance only, stepping at most 30ms per row and adding at most 200ms overall. `motion-choreo`
- Self-starting motion beside other content has a pause control past 5 seconds, auto-updating figures have one at any duration, nothing flashes more than 3 times a second, and every animation ends when its reason ends. `motion-loop`
- Autoplay is gated on the platform setting, anything that autoplays has a visible stop, and a looping asset stops with its screen. `motion-autoplay`
- No input, dismissal or back gesture is blocked by an animation, and a repeated tap does not queue a second one. `motion-blocks`
- Layout properties are animated only by the framework's own layout animations, hand-written animation stays on transform and opacity, and the React Native animations declare the native driver. `motion-cheap`
- The reduced-motion flag is read on every platform the app ships to, iOS substitutes rather than deletes, and the Android screen still reads with nothing animating. `motion-reduced`

Three of these are not answered from the file. `motion-reduced` is answered on a device with the setting turned on, because a reduced-motion path that was written and never wired to the flag reads exactly like one that works. `motion-cheap` is answered half in the source, where the native driver and the animated properties are visible, and half in the frame profiler, which is the only place a dropped frame exists. `motion-blocks` is answered by tapping through a transition and pressing back during one.
