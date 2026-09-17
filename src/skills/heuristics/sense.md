# Device capabilities

The camera, the microphone, location, the motion sensors, the biometric reader, the vibration motor, the short range radios. None of them is a feature. The feature is what the screen shows while the capability runs, when the value it returns is vague, when the device does not have the hardware at all, and when it is returning nothing worth reading.

The ask belongs to `permissions.md`: what is requested, at which moment, after which screen, and what a refusal leaves behind. `state-permission` owns the denied screen. This file starts after all of that, because a granted permission is where most integrations stop and where the states below begin.

Per-stack presence, status and accuracy APIs are in `references/capability-checks.md`, for one lookup rather than a read through.

## <Rule id="sense-states" evidence="device" description="Five states past the grant, and a granted boolean covers one" />

A capability is not on or off. Five states exist whether or not anybody was ever prompted:

1. **Absent.** The device has no such hardware. This is never an error and never a message.
2. **Switched off above the app.** A system toggle or a radio switch holds it, and the app is usually handed empty data rather than a failure.
3. **Running.** Live, holding the hardware, and visible to the user through the platform's own indicator.
4. **Imprecise.** A value arrived with an uncertainty attached to it, and it is still a value.
5. **Failing.** Calibrating, no fix yet, nothing in range, held by another app, locked out after too many attempts, throttled by heat.

Count the branches around every capability the app touches. Granted against denied is one pair, it answers `perm-answers` and nothing here, and it is the whole integration in most generated code. Where the capability returns a value over time (the camera, the microphone, location, the motion sensors, a connected radio) each of the five is a different screen with a different thing for the user to do, so each needs its own branch or its own written reason for being folded into another. The rest answer from what the hardware is rather than from a note in the source: a vibration motor has no imprecise state to design.

## <Rule id="sense-absent" evidence="device" description="Ask the device before drawing the entry point" />

One binary installs on a phone with three cameras and on one with no gyroscope, no barometer and no biometric reader. There is no build time answer to which; the app asks at runtime and gets a real no often enough to design for.

Query first, then decide whether the surface exists. When the answer is no, the entry point is not drawn: no disabled button, no dialog explaining that the device is not supported, no empty screen where the feature used to be. The app is simply smaller on that device, and every neighbouring screen still adds up.

On Android this also decides distribution. A hardware feature declared as required removes the app from the store for every device without it, so anything the app runs without is declared not required and detected at runtime instead. A capability dragged in by a dependency ends up in that declaration too, which is `perm-inventory`.

## <Rule id="sense-off-system" evidence="device" description="Off at the system level is a different question from denied, and the app asks both" />

From Android 12 a device-wide toggle gives every app a blank camera feed and silent audio while the permission still reads as granted, and rate-limits the motion sensors at the same time. Location services switched off at the OS level makes the last known location null, and switching them off clears the cached fix, so a device that answered a minute ago now answers with nothing.

Permission granted and service available are two reads, and the code that only does the first blames the network, the server or the user's grant for a state none of them caused.

- Each answer has its own sentence and its own destination, and neither is a retry button. The permission route is the one `state-permission` already owns. Location services are a second route to a different page, the system's location settings, deep linked the same way. The device-wide camera and microphone toggle is a quick settings tile with nothing to link to, so that sentence names where the tile is instead of promising a link nobody can write.
- A retry loop is the failure mode here. Nothing the app can do changes the answer, so a spinner that keeps trying is a screen that never resolves.

## <Rule id="sense-running" evidence="device" description="Say it is running, agreeing with the indicator the system already drew" />

From iOS 14 the microphone shows an orange dot, the camera or camera with microphone shows a green one, and the orange becomes a square when Differentiate Without Color is on. From Android 12 the same use puts an icon in the status bar, moved into the top right corner when the app is immersive. The user sees these before they see anything the app draws.

- The capturing surface carries its own running state and a way to stop, so the platform indicator and the app say the same thing at the same moment.
- Nothing is placed where the indicator lands. Android hands back those bounds; a full bleed capture screen that puts the shutter, the timer or the close control under them loses the control.
- The indicator is never imitated. A dot of the same colour drawn somewhere else teaches the user to distrust the real one.
- A capture the user did not start as an ongoing task ends with the surface that started it. One meant to outlive its screen (a voice recording, a route, a tracked run) carries the platform's ongoing surface for as long as it runs, which is `notify-ongoing`, and ends when the task does. What never ships is the third case: a capability still live with nothing on screen saying so, the platform reporting a capture the app has stopped mentioning. `perf-power` owns what it costs.

## <Rule id="sense-interrupted" evidence="device" description="The system takes the hardware back, and the take is what is at stake" />

A call arrives during a recording, another app claims the microphone, the headphones come out and the audio route changes, the app goes to the background and the camera is released. `state-interrupt` covers what the view holds through that and the OS carries it for free; the capture session is not carried, and the user meets a recording that stopped without saying so and a take that is gone.

- The surface says the capture stopped and what stopped it, at the moment it happens rather than when the user comes back and reads a timer that never moved.
- What was already captured is kept, named and reachable. A partial take is worth more than a clean start, and a discarded one is unrecoverable.
- Returning re-establishes the session and offers to continue. Resumption is offered rather than assumed, and never left as a dead preview with a shutter that does nothing.

## <Rule id="sense-accuracy" evidence="device" description="The uncertainty arrives with the value, and the screen shows it" />

Every fix comes with a horizontal accuracy radius in metres beside the coordinate, and the number is not the same measurement everywhere: Android reports it at the 68th percentile, the web at the 95th, and Apple as a radius of uncertainty. A threshold tuned against one of those is wrong against the others, and code that reads the coordinate and drops the radius is claiming a precision nobody offered.

The gap is wide. An approximate grant on Android covers roughly 3 square kilometres, while a precise one is usually within about 50 metres and sometimes a few. Apple publishes no figure for its reduced accuracy, so the 3 km does not travel there.

- A map draws the circle it was given, not a pin at the centre of it. Both platforms have a way of saying there is no radius, and both draw as a perfect fix when that check is skipped: a negative `horizontalAccuracy` on iOS means the coordinate is invalid, and Android's `getAccuracy()` returns zero unless `hasAccuracy()` is true. Missing accuracy is the imprecise state.
- Text states the level it has: approximate, within 50 metres, the neighbourhood instead of the address.
- Anything that needs precision says so on a reduced fix rather than computing quietly on it. That the feature runs on a reduced grant instead of routing to a denial is `perm-answers`.
- The same applies to every other estimate: a heading before the compass is calibrated, a step count, a barometric altitude. Where the platform hands over an accuracy field, something on screen is derived from it.

## <Rule id="sense-preview" evidence="device" description="A live preview is a surface with a crop, not an image view" />

The defaults disagree, so the fit is chosen rather than inherited. CameraX's `PreviewView` fills and crops by default, which shows the user a narrower frame than the one that gets captured and only admits it after the shutter. `AVCaptureVideoPreviewLayer` defaults the other way, fitting the frame inside its bounds, so a crop there is `resizeAspectFill` asked for on purpose; Flutter's `CameraPreview` fits as well. Whichever way it is set, what was framed is what is saved.

- The preview keeps the sensor's aspect ratio. Stretching it to a container is visible on every face in it.
- Coming up is a state. Binding the camera takes time, and what the frame shows while it does is `state-loading`. What belongs here is the shutter: inert until the session is actually live. A capture control that accepts a tap before there is anything to capture is the most common defect on this screen.
- A surface the user has to aim, and any recording that is running, holds the screen awake for exactly as long as the session lasts, and the path that releases it is `perf-power`. A scanner that dims and locks while the code is still being lined up has failed at the one thing it was on screen for.
- It takes the safe area like any other content (`layout-insets`), and the shutter sits where a thumb reaches (`touch-reach`).
- A scanner adds three things: a target to aim at, a bound on how long it tries before offering something else, and a route that does not need the camera at all, such as typing the code or picking an existing photo.

## <Rule id="sense-biometric" evidence="device" description="The system prompt is the surface, and the fallback is drawn rather than assumed" />

Never build a face or fingerprint screen. The prompt belongs to the platform and it is the only one the user has been trained to trust, so an imitation is a security problem the user has no way to see through. Face authentication in particular runs through the platform's authentication framework rather than an AR or face recognition library, and an account holder under 13 is authenticated some other way.

- Name the method the device actually has, read from the platform rather than guessed from the OS. A button offering Face ID on a device with a fingerprint reader is wrong on the one screen where being wrong costs the most.
- The result set is eight branches, not two: no hardware, hardware busy, nothing enrolled, locked out after repeated failures, no device passcode set, cancelled by the user, cancelled by the system, and a fallback requested where the policy has none. That last one is a dead end the design created by offering a button with nothing behind it.
- Nothing enrolled has its own answer, which is the system enrolment screen, not the failure copy.
- Every biometric route has a second route to the same place that does not need the sensor, reachable in the same session. Faces get covered, hands get wet, and readers fail.
- Whether this app asks for a check at all, and what that check protects, is `auth-biometric-session`. Android refuses to combine a custom negative button with the device credential option, so one of those is the fallback and the other does not ship.

## <Rule id="sense-haptic" evidence="device" description="The pattern the device cannot render is the one the design leans on" />

`touch-feedback` sets the vocabulary: one meaning per pattern, nothing on scroll. This is the hardware underneath it, which varies more than any other output on the phone.

- Use the platform's named feedback rather than an authored waveform. On Android the order is the view's own haptic constants first, which need no vibrate permission and honour the user's touch feedback setting, then a predefined effect, then a composition of primitives. Raw one shot and waveform calls are discouraged even where they run, because they are too loud to read as feedback: a good key click is 10 to 20 milliseconds and the actuator rings on for another 20 to 50 after it.
- On iOS the named vocabulary is the three feedback generators, impact, notification and selection, each used for the meaning it is documented to carry. Core Haptics is the authored layer below them and needs a reason before it is reached for. iOS gives the app nothing to read about whether the user wants haptics at all, so the app carries its own switch for them and stays usable with it off.
- Ask the actuator what it supports and design for the answer. That query returns three values, yes, no and unknown, and unknown means the hardware does not report and no call will settle it. Every rich pattern has a plain one behind it.
- Nothing fires while a reading is in flight: an exposure, a running video or audio recording, a motion sensor sample. The motor shakes the device the sensor is measuring. A confirmation after a scan resolves is the correct use of one, and on a scanner it is the only non-visual confirmation the surface has.
- Either switch, the system's or the app's, can silence all of it, so a haptic never carries a message on its own.

## <Rule id="sense-motion" evidence="device" description="Motion sensors are data, not an input method" />

Where the reading is the content the user came for, a heading, a tilt, the orientation of a camera held in space, the sensor drives the view and that is the whole feature. What does not ship is motion standing in for a control the finger already has: those gestures are hard to perform precisely, and they are difficult or impossible for anyone who cannot move the device freely.

- Three get generated by reflex: tilt parallax, shake to act, and turn to scroll. Shake carries one meaning, undo, and only where the platform already gives it that meaning. The other two survive neither `motion-reduced` nor `a11y-gesture`, so if they ship at all they are decoration with an off switch and a second route.
- Sampling has a ceiling. From Android 12 a listener is capped at 200 Hz and a direct channel at about 50 Hz, and exceeding either without the high sampling rate permission throws. Which rate to ask for under that ceiling is `perf-power`.
- A compass is wrong until it is calibrated, so a heading gets a calibration state before it gets a needle.
- On mobile web the motion permission request has to be triggered by a real tap and the API is missing in some browsers, so the control that asks is one the user pressed, and the missing API is the absent state rather than a crash.

## <Rule id="sense-radio" evidence="device" description="An adapter that is off is not a permission that was denied" />

Bluetooth and NFC split the way the camera splits in `sense-off-system`: the permission reads as granted while the adapter is switched off, and that is a different sentence with a different move behind it. iOS raises its own system alert for a powered-off adapter and the app does not draw or control it, and Android answers with its own enable request rather than a screen the app owns.

- Paired, in range and connected are three states rather than one flag, and losing the peripheral is ordinary rather than exceptional. The surface says it is gone, keeps working on everything that does not need it, and reconnects without making the user start the task again. Nothing draws a dropped connection as live.
- A nearby interaction is never the only route to its task. Distance and direction degrade behind a body, a bag or a wall, and direction disappears entirely once the phone is not roughly pointed at the other device, so there is always a way to finish without it.

<Check>

<Verify rule="sense-states">Every capability that returns a value over time branches on absent, off at the system level, running, imprecise and failing, or names which of the five it folded and why.</Verify>
<Verify rule="sense-absent">Presence is queried at runtime before the entry point is drawn, absence removes the surface rather than disabling it, and no hardware feature is declared as required unless the app cannot run without it.</Verify>
<Verify rule="sense-off-system">Permission status and service availability are two separate reads, each with its own sentence, the ones that have a system page are deep linked to it, and neither resolves into a retry loop.</Verify>
<Verify rule="sense-running">The capturing surface shows its own running state with a stop, draws nothing inside the platform indicator's bounds, imitates no indicator, and ends with its screen unless it carries an ongoing notification or Live Activity.</Verify>
<Verify rule="sense-interrupted">A capture the system stops says so on the surface as it happens, keeps and names what was already captured, and re-establishes the session on return rather than leaving a dead one.</Verify>
<Verify rule="sense-accuracy">The accuracy radius is read, checked for validity and rendered, no accuracy threshold is shared across platforms, and a reduced fix runs the feature in a stated form.</Verify>
<Verify rule="sense-preview">The preview's fit is set deliberately, keeps the sensor aspect ratio, has an inert shutter until the session is live, holds the screen awake while it aims or records (`perf-power`), and any scanner has a target, a time bound and a route that does not use the camera.</Verify>
<Verify rule="sense-biometric">The platform prompt is used unmodified, named for the method the device reports, with an enrolment path and a non-biometric route in the same session.</Verify>
<Verify rule="sense-haptic">Haptics use each platform's named feedback with a plain fallback where support is unknown, iOS carries an in-app switch for them, none fires while a reading is in flight, and none carries a meaning alone.</Verify>
<Verify rule="sense-motion">The motion sensors drive the view only where the reading is the content, no gesture stands in for a control, and a heading has a calibration state.</Verify>
<Verify rule="sense-radio">An adapter switched off is answered separately from a denied permission, pairing, range and disconnection each have a state, and no nearby interaction is the only route to its task.</Verify>

<Device>Run these on a device that is missing something on purpose: location services off, the system camera toggle off, no biometric enrolled, Bluetooth off, a call placed mid recording. Each of those states passes on a fully equipped device with everything granted, which is the only device the code was written against.</Device>

</Check>
