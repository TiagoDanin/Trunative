# Media playback

A phone plays media in a pocket, on a commute, on a battery, on a connection somebody is paying for by the megabyte, and over a call that can arrive in the middle of any sentence. The player is the one surface in an app that has to keep working after the screen goes dark and after the user has walked away from it.

Here: the player surface, the transport controls, full screen and rotation, picture in picture, background audio, the lock screen, and what happens when something else on the device wants the speaker. Captions and anything an audio track carries alone are `a11y-media`. Whether a clip may start by itself is `motion-autoplay`. Sound the app makes outside a player is not playback and is not here.

## <Rule id="media-system-player" description="Play through the platform's engine, and finish any transport you draw yourself" />

The engine is `AVPlayer` on iOS and ExoPlayer on Android, with a wrapper over one of them in every cross-platform stack. Nothing here asks anyone to write a decoder. What varies is who draws the transport, and each system view hands over a different set: `AVPlayerViewController` and SwiftUI's `VideoPlayer` carry the route picker, the caption menu the system caption setting drives, and picture in picture once the capability is on, while Media3's `PlayerView` carries subtitles, artwork and the controls, with picture in picture and Cast wired separately beside it.

Drawing your own transport is allowed and common. What is not allowed is dropping what the system view gave you: model each control on the one it replaces, and re-provide route picking, picture in picture, the caption menu and a scrub target a thumb can hit. A control added beside that standard set earns its place by doing something the platform does not offer, such as a chapter list, a per-episode speed or a skip increment of your own. Restyling play and pause is not one. Name every icon-only button (`a11y-name`).

## <Rule id="media-controls" description="Controls retreat, and a tap anywhere brings them back" />

- The video is the whole glass and there is no cursor to wake the chrome with, so the reveal target is the surface itself rather than a hotspot in a corner. The system view already reveals on a tap, already holds the controls while playback is paused, and already keeps its hide delay in one place; a custom transport re-provides all three (`media-system-player`).
- Two cases no system view gets right, and they are where the work is. Controls stay up while the player is buffering, which is the moment the user most wants to see whether anything is moving. And they do not retreat on a timer at all while a screen reader is running, because a control that has already left cannot be found again by exploring the glass.
- In full screen the controls still sit inside the safe area, which nothing insets for you once the chrome is gone (`layout-insets`).
- The system volume owns the final level and the app only balances its own tracks against each other, so no in-app master volume competes with the hardware buttons. Where a level control belongs on the screen, iOS has the system volume view for exactly that. Whether the silent switch reaches you at all is an iOS question answered by the audio session category, with no Android counterpart, and that nothing in the app moves the system volume is `sound-silenced`.

## <Rule id="media-scrub" description="The scrubber is a thumb target and the position is text" />

- A progress track drawn 2 to 4dp tall is a 2 to 4dp target unless somebody widened the hit area, and this is the control people drag while walking. The scrub area reaches the floor in `touch-floor`, measured on the hit rect and never on the drawn track.
- Elapsed and total are both printed, because a position along a bar is not readable on a moving train, and both are formatted by the locale (`l10n-format`). While the finger is down the target time is shown, and the frame does not commit until the finger lifts.
- A skip control prints its increment on itself. Media3 ships 5 seconds back and 15 forward; iOS ships no default, so the number is yours and it is written down once rather than picked per screen.

## <Rule id="media-unasked-sound" description="Claim the speaker at the moment of play, never at launch" />

Somebody is already listening to something. Activating the audio session or taking audio focus during startup stops their podcast for a screen that is not playing anything yet.

- The activation call sits on the play path: set the category at launch, call `setActive` when playback begins, request focus when the first sample plays. Handing the speaker back is the same path in reverse and it is the half that goes missing: `setActive(false, options: .notifyOthersOnDeactivation)` on iOS and abandoning the focus request on Android, on the stop path and on the error branch alike. Without it the other app's music never comes back, which is the bug the user actually hears.
- The category matches how the app uses sound. `.ambient` mixes with whatever else is playing and is right for incidental sound; `.playback` is for sound that has to survive the silent switch, and whether it mixes or takes the output alone is an option set on it rather than a property of the category. Media the user chose is one case for it. Occasional spoken audio over someone else's music, turn-by-turn directions or a coach counting reps, is the other, and it is `.playback` with ducking rather than a category of its own.
- Whether a surface may start by itself is `motion-autoplay`, and that it starts muted when it does is `a11y-media`. What belongs here is where that mute state lives: on the feed, not on the item. Unmuting one card and getting silence on the next is the bug; getting sound the user did not ask for on the next is the other one.

## <Rule id="media-focus" description="Ask for the output, hand it back, and decide what happens after" />

`ExoPlayer.Builder` defaults to not handling audio focus, so `setAudioAttributes(attributes, true)` is a line somebody writes or the app never yields the speaker at all. Three kinds of loss, three answers, plus a fourth case: an app targeting Android 15 is refused focus outright unless it is the top app or running a foreground service, and from Android 17 playback held without focus is silenced whatever the app targets, with nothing thrown and nothing logged. The two gates are different, so the branch has to exist in both builds. Handle the refusal, because the failure that reaches the user is silence on a device where the same build sounded fine in front of you.

- **Permanent.** Pause and stay paused. No gain callback is coming, so a person is the only thing that starts it again.
- **Transient with ducking.** From Android 8 the system ducks you silently, except for `CONTENT_TYPE_SPEECH` content and apps that asked to be told instead. Speech cannot be ducked and stay useful, so speech pauses. On iOS the ducking belongs to the app that wants to be heard, not to the app being lowered: it activates its session with `duckOthers`, or with `interruptSpokenAudioAndMixWithOthers` where the sound is occasional speech over someone's music, and the system takes the other level down at activate and restores it at deactivate. The app being ducked gets no callback and writes nothing.
- **Transient.** Pause, then resume or do not, which is a decision recorded once per kind of content in `STACK.md` rather than a default. iOS publishes whether the interruption was resumable and expects a media app to check first; Android 12 and up mutes for an incoming call and unmutes when it ends. Long-form audio the user chose resumes where it stopped, and anything the user never started does not resume at all.

## <Rule id="media-noisy" description="The headphones came out, and on Android that pause is yours to write" />

iOS reroutes to the speaker and pauses; the platform carries it. Android only broadcasts that audio is about to become noisy, and Media3's `handleAudioBecomingNoisy` defaults to `false`, so the shipped default is your podcast playing out loud on a bus. Turn it on, or register for `ACTION_AUDIO_BECOMING_NOISY` when playback starts and unregister when it stops. A player with on-screen controls pauses; something with no controls at all may keep going.

## <Rule id="media-background" description="Background audio is a declared capability, a service type and a store answer" />

`bg-service-last` says to look for the narrower API first, and for video that narrower API is picture in picture rather than a service. For audio the service is right, and it arrives with paperwork.

- iOS: the background mode covering audio, AirPlay and picture in picture, plus the `.playback` category. Without the capability the lock screen silences you.
- Android: a `MediaSessionService`, `FOREGROUND_SERVICE` and `FOREGROUND_SERVICE_MEDIA_PLAYBACK`, and `android:foregroundServiceType="mediaPlayback"`. From Android 14 that type is also a store declaration stating the user impact of interrupting it. The service starts while the app is still on screen: one started after the user has already left is too late, and from Android 17 background audio with no service behind it is simply muted.
- The session ends when playback ends. Releasing the player clears the notification and hands back the hardware video decoder another app is waiting for, on the failure branch as well as the happy one (`perf-memory`). A media capability held open to keep the process alive for something else is what `bg-declared` refuses. How the ongoing notification reads is `notify-ongoing`.

## <Rule id="media-remote" description="Once the screen is off, the lock screen is your player" />

Fill in the metadata and register the commands; the layout is the system's and you do not get to design it. `MPNowPlayingInfoCenter` with `MPRemoteCommandCenter` on iOS, `MediaSession` with `MediaMetadata` on Android, where background audio also requires a `MediaStyle` notification.

- Title, subtitle or artist, artwork and duration are all populated. On iOS that is the whole of the job, because the presentation is the system's and you do not get to choose what it shows: fill in every property you have. A blank tile on a lock screen is the app's fault and not the system's.
- The counts are Android's. The controls take up to 5 actions and only the first 3 survive the collapsed view, and how the buttons are derived changed at Android 13, so a hardcoded list of five is wrong on one side of that line. Decide which 3 matter.
- Register only the commands the app supports, and answer a transport command only while this app is the thing playing, because responding to a headset button otherwise stops someone's music from a screen they are not looking at. Tapping the tile returns to the item that is playing, not to the app's home screen.

## <Rule id="media-resume" description="Come back where playback stopped, and say when it is paused" />

- The position is persisted per item while it plays rather than on the way out, because the process can be killed without a way out, and returning opens that item where it stopped instead of at zero. A queue keeps its place in the queue as well as its place in the track.
- A player that comes back paused shows that it is paused, because silent and idle reads as broken and the next move is to leave rather than to press play. On Android the playback resumption callback is answered too, so the system's own tile can restart the last item after a reboot without the app being opened first; what that tile carries once it is playing is `media-remote`.

## <Rule id="media-pip" description="Picture in picture is what leaving the app means, and its button is conditional" />

An app that plays video supports picture in picture: the alternative is that a message arriving mid-episode ends the episode. On iOS it also requires the background audio capability, so it is not free.

- The affordance is drawn only after the support check passes, on both platforms, because a dead picture in picture button is worse than none. Entering and leaving reuses the same player: a fresh instance costs a black frame, the buffer and the position. Two sources must never mix, so a video moving into the window while a game's soundtrack plays underneath is the failure both platforms warn about, and one of the two has to yield.
- On Android the window is configured rather than accepted: ask the platform how many actions it takes instead of hardcoding the 3 that are a floor a device may raise, keep play and pause among them, and read back the aspect ratio you were given, because the one you request is clamped. From Android 12, auto-enter on the home gesture with a source rect hint, so leaving mid-episode needs no button at all. On iOS none of that is yours: the system draws the transport and sizes the window, and the two decisions the app makes are the support check and the background audio capability behind it.
- It is not the only route out. Where it is unsupported or refused, playback continuing while the user moves around inside the app keeps a docked bar carrying the title, play and pause, and a tap back to the full player, with the content beneath it padded to clear it (`layout-chrome`).

## <Rule id="media-away" description="The eyes left, the ears did not" />

- Video with no picture in picture and no background capability pauses as the app goes away, and comes back at the same frame. The app switch itself is free (`state-interrupt`), which is exactly why nobody writes the pause and the user returns having missed a minute of the episode. Where picture in picture is available it takes the place of the pause (`media-pip`).
- Audio the user chose keeps playing, which is the whole point of `media-background`. The same event gets opposite answers on the two kinds of content on purpose, and the platforms lean opposite ways on the video half, so the answer is written down in `STACK.md` per surface rather than inherited from whichever one the code was ported from.

## <Rule id="media-fullscreen" description="Turning the phone does not restart the video" />

Rotation is a configuration change, which is `state-interrupt`, and the shape of a sideways phone is `layout-orientation`. What belongs to the player is that one instance survives the turn: recreating it costs the buffer, the position, and on a metered connection the bytes a second time. Full screen keeps the controls reachable (`media-controls`) and an exit that is drawn rather than left to the back gesture.

- Never bake letterbox or pillarbox bars into the asset. One phone plays the same file full screen, embedded in a list, rotated and inside a picture in picture window, and baked padding is visible in three of those four.
- Where a custom transport picks the gravity itself, follow what the system player already does with the ratio: fill for 2:1 through 2.40:1, fit for 4:3, 16:9 and anything up to 2:1, and fit again above 2.40:1. Through the system view there is nothing to write.

## <Rule id="media-awake" description="Keep the screen on for video only, and let it go when playback stops" />

This is a window flag on the player's own screen, `FLAG_KEEP_SCREEN_ON` or `android:keepScreenOn` on Android and `isIdleTimerDisabled` on iOS. It is not a wake lock, and a service cannot hold it.

- Audio-only playback never keeps the screen on. Not needing the screen is the point of playing audio.
- It clears on pause, on stop, on leaving the screen and on the error branch, which is the deterministic end `perf-power` asks of anything holding hardware open. ExoPlayer's wake mode is a separate setting whose default is not the one you want in either direction, so set that one explicitly beside the service.

## <Rule id="media-start" description="One second to sound, or to a sign that sound is coming" />

Within one second of the tap, either audio is playing or something on screen says it is being prepared. A player that looks identical for four seconds gets tapped again, and the second tap is a stop.

- The first load is `state-loading`: a placeholder in the shape of the player, not a spinner over a black rectangle. A rebuffer mid-playback is a different state. It does not tear down the controls, does not reset the position, and does not flip the play control to paused, because the user did not pause. A stream that dies instead says what failed and offers a retry that keeps the position (`state-error`, `state-retry`).

## <Rule id="media-quality" description="The metered ceiling is set once, and the choice sticks" />

- `net-metered` decides what counts as metered and rules that a tap is still answered; what is left here is the number. An adaptive stream gets an explicit bitrate cap under the flag instead of being left to find its own ceiling on somebody's data plan.
- A manual quality choice outlives the item it was made on, and switching quality keeps the position rather than restarting playback.
- Downloading for later waits for an unmetered connection by default and is queued rather than tied to the screen (`off-queue`); preloading the next item stops entirely under the flag (`net-prefetch`).

## <Rule id="media-live" description="Live has no total duration and its edge keeps moving" />

- Live is labelled as live, and the label does not rely on color (`color-not-alone`). No total-duration text and no percentage on a stream with no end, and where seeking back exists, a control returns to the edge and says how far behind the user currently sits.
- A live video surface the user has navigated away from inside the app, with nothing left playing it, stops rather than spending bytes on something nobody is watching. A recording is paused and kept where it stopped; a live edge cannot be. An app that has done `media-background` properly, with a session and a service behind it, is playing in the background on purpose and this does not touch it. A stall recovers by jumping to the edge rather than replaying what was missed.

<Check>

<Verify rule="media-system-player">Playback runs through the platform's player component, and any custom control exists for a command the system does not offer.</Verify>
<Verify rule="media-controls">A tap on the video surface reveals the controls, they stay up while buffering and do not retreat on a timer under a screen reader, they sit inside the safe area, and no in-app volume control competes with the hardware buttons.</Verify>
<Verify rule="media-scrub">The scrub hit area reaches the touch floor, elapsed and total are both text, and every skip control prints its increment.</Verify>
<Verify rule="media-unasked-sound">The audio session is activated and focus requested on the play path rather than at startup, the category matches the use, and an auto-started surface starts muted with the mute state held above the item.</Verify>
<Verify rule="media-focus">Focus is requested at start and abandoned at stop, all three losses have a branch, the refused request has one too, and resuming afterwards is an explicit decision per content type.</Verify>
<Verify rule="media-noisy">Playback pauses when the output becomes noisy, with the Android default flipped rather than assumed.</Verify>
<Verify rule="media-background">Background audio declares the capability, the service type and the permissions, starts the service from the foreground, and releases the player on every exit path.</Verify>
<Verify rule="media-remote">Title, artwork and duration reach the system controls, only supported commands are registered, the Android collapsed view is designed for its first 3 actions, and the tap returns to the playing item.</Verify>
<Verify rule="media-resume">The position is stored per item as it plays and restored on return, a player that returns paused says so, and the Android resumption callback is answered.</Verify>
<Verify rule="media-pip">The picture in picture affordance is behind a support check, the window keeps the same player instance, the Android action count is read from the platform with play and pause among them, and playback that continues inside the app keeps a docked bar leading back to the player.</Verify>
<Verify rule="media-away">Video with no picture in picture and no background capability pauses when the app leaves the foreground and resumes at the same frame, while audio the user chose keeps playing.</Verify>
<Verify rule="media-fullscreen">One player instance survives rotation and the full-screen transition, no bars are baked into the asset, and any custom transport picks its fit mode from the aspect ratio.</Verify>
<Verify rule="media-awake">The screen-on flag is set for video only, on the player's own screen, and cleared on pause, stop, exit and error.</Verify>
<Verify rule="media-start">Sound or a preparing indicator arrives within one second of the tap, and a rebuffer leaves the controls and the position alone.</Verify>
<Verify rule="media-quality">A metered connection has a written bitrate cap, a manual quality choice persists, and downloads wait for unmetered.</Verify>
<Verify rule="media-live">A live stream is labelled without relying on color, shows no total duration, offers a return to the edge, and stops once its surface is left with nothing playing it.</Verify>

</Check>
