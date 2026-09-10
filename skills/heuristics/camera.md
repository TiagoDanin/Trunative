# Camera capture

A capture screen is aimed. The user holds the phone in one hand while the other holds the receipt, the label, the pet or the page, at whatever distance an arm reaches, in whatever light the room has. Nothing on it can be read from a static mockup, because the only background any control has is live video nobody on the team chose.

The preview itself is `sense-preview`: its fit and crop, the shutter being inert until the session is live, the screen held awake, and the scanner's time bound and camera-free route. Whether the hardware exists at all is `sense-absent`, the system taking it back is `sense-interrupted`, and saying it is running is `sense-running`. The permission belongs to permissions.md, from `perm-inventory` through `perm-answers`, playing back what was captured is `media-system-player`, and the app switcher snapshot is `priv-switcher`.

## <Rule id="cam-system-first" description="When one photo is the whole requirement, the system's capture screen is the capture screen" />

The phone already ships a capture screen the user has fired a thousand times, with a shutter, a torch, a lens switch and a retake. Drawing a second one buys a permission, a session lifecycle and every rule below it.

- Android's image capture intent hands the whole capture to the device camera app, so the calling app needs no camera permission, unless its own manifest declares `CAMERA`, in which case the action raises a `SecurityException` until that permission is granted. Without the output extra it returns a thumbnail under the extras key `data`; with it, the full frame lands at the URI supplied. Guard the intent, either by catching `ActivityNotFoundException` or by resolving it first.
- On iOS `UIImagePickerController` with `sourceType` `.camera` is the system capture UI and is not deprecated. Gate it on `isSourceTypeAvailable(_:)` and `availableMediaTypes(for:)`, expect portrait only, and accept that its one sanctioned customisation is `cameraOverlayView`. Movie capture stops at 10 minutes unless `videoMaximumDuration` says otherwise.
- Drawing the surface yourself is for when the surface is the feature: a scanner with its own reticle, a document edge finder, a recorder showing its own level. Picking a photo that already exists is never that, which is `perm-ask-less`.

## <Rule id="cam-shutter" evidence="device" description="The shutter is the biggest target on the screen, in the bottom third, on a ground the app owns" />

The subject is in the other hand, so the phone is held and fired one-handed. And the preview underneath is a moving image the app does not control, so no control on this screen has a background to measure itself against.

- The shutter's hit rect meets the floor in `touch-floor` and is the largest target on the screen. Every capture control sits in the bottom third (`touch-reach`), spaced by `touch-spacing`, inside the safe area (`layout-insets`) and clear of the platform capture indicator's bounds (`sense-running`).
- Each control carries its own opaque or scrimmed ground. `color-contrast` needs a measured pair and live video supplies none, so the pair is the glyph against the ground the app drew, not against whatever is being filmed.
- One press, one capture. The shutter is disabled for the duration of the capture rather than queueing a second frame behind the first.
- On iPhone the hardware camera control draws a system overlay from the bezel, so app controls stay outside that strip in both portrait and landscape, no control appears in both the overlay and the screen, and any name shown there stays short because it follows Dynamic Type and a long one covers the viewfinder. The shutter, torch and lens controls are icon-only, so each carries a name (`a11y-name`).

## <Rule id="cam-torch" description="The torch is read from the hardware and observed while the screen is open" />

The LED is the only light the user can add, and the hardware takes it away when the phone gets warm. The front camera has no LED at all, so the same button has to mean something else or not exist.

- Presence and availability are two reads. On iOS `hasTorch` reports the hardware and `isTorchAvailable` reports whether it is usable right now, going false when the device overheats and needs to cool off; both are observable. On Android `CameraInfo.hasFlashUnit()` reports the hardware and the observed torch state reports the value, which is off wherever there is no flash unit. Bind the control's enabled state to the live value rather than reading it once at bind time.
- On the front camera, offer the screen flash or offer no torch. Android's screen flash mode needs a screen-flash instance set first and always behaves like on rather than auto.
- The torch is off when the screen opens. Android's capture flash mode defaults to off, and iOS low-light boost also defaults to off, is settable only where supported, and may drop frames as it engages, so enabling either is a decision written down rather than a switch left on.
- Missing hardware removes the control rather than disabling it (`sense-absent`), settled by the presence read above rather than by a second query.

## <Rule id="cam-lens-zoom" description="The lens stops and the zoom range are read from the device, and zoom past the optical range is a crop" />

One binary installs on a phone with three rear lenses and on one with a single fixed lens, so a hardcoded row of 0.5x, 1x and 2x is wrong on the cheap device. A pinch also needs two hands, which is exactly what this screen does not have.

- The range comes from the device. On iOS the zoom factor runs from 1.0, the full field of view, to the active format's maximum; on Android the zoom state carries the minimum and maximum. Every lens stop drawn is one the device reported.
- Zoom is a centre crop. Past the format's upscale threshold the device scales that crop up and the quality goes with it, so the top of the range is not a free stop. Setting the factor jumps; ramping is the smooth change, and the configuration lock is taken first or the set raises.
- A pinch has a tap or stepper equivalent (`a11y-gesture`). Android's camera controller handles tap-to-focus and pinch-to-zoom for you, while the provider API and AVFoundation hand both back to the app.

## <Rule id="cam-aim" description="The frame drawn on the glass is the region the app actually reads" />

The user is holding the phone over a barcode or a form and cannot see the buffer being analysed. A reticle that does not match the analysed rectangle trains them to aim at the wrong place, and the app gets blamed for not reading a code that was never in frame.

- The drawn frame is derived from the same rectangle handed to the analyser: the region of interest on the iOS data scanner, the analyser's crop rect on Android. One value, two consumers.
- Reading text or a code has a resolution floor. The smallest meaningful unit of a code needs at least 2 pixels of width, and 2 of height for a 2D code, which puts an EAN-13 frame at 190 pixels wide and a dense PDF417 nearer 1156; analysing at 1280x720 or 1920x1080 is what lets a code be read from further away. Poor focus costs accuracy on its own.
- On-screen guidance names the condition: too far, too dark, hold still. Repeating that it is scanning tells the user nothing they cannot see. Codes are recognised at any orientation, so nothing asks the user to turn anything.
- `sense-preview` already requires a target, a time bound and a route that needs no camera. Where the thing being aimed at is a page, the iOS document camera controller is the platform's own answer to all of it.

## <Rule id="cam-scan-decides" description="A scan resolves by itself, once, and the app says which formats it reads" />

The hand that would press a confirm button is the hand holding the phone steady over the code. A scanner that waits for a tap loses the aim at the moment it had it.

- A scan surface the app drew accepts on recognition rather than on a tap, and the same value is not accepted twice before the screen is left.
- The formats scanned are an explicit list. Detecting everything is slower and it accepts things this screen was not for.
- Where the app draws no overlay of its own, the platform scanner is the scanner. Android's code scanner runs inside Play services, ships its own UI and needs no camera permission from the app, though its library is unbundled so the download is a state on the screen. The iOS data scanner arrives from iOS 16 behind two separate reads, one for whether the device supports scanning and one for the grant, and still needs its purpose string (`perm-purpose-string`); its own documented interaction is a tap on the highlighted item, so a screen that wants acceptance without a tap reads the recognised-items stream instead.
- The confirmation is `fb-silent-success` plus the one haptic `sense-haptic` allows once a scan resolves.

## <Rule id="cam-review" description="A capture is a proposal until the user accepts it" />

The phone was moving when the shutter fired and the preview is three inches wide, so the first frame is often unusable. The iOS picker returns only once the person picks the frame just captured, and on Android the confirmation belongs to whichever camera app answers the intent, so an app drawing its own shutter is re-providing a step it removed, and without it the only way to fix a photo is to start the flow again, backing out of a form the keyboard is already covering.

- Every capture path the app draws itself has a review state carrying accept and retake. Retake returns to a live preview and discards nothing already captured, which is the same obligation `sense-interrupted` places on a take the system stopped.
- Accept is the only thing that commits, uploads or closes the screen. What waits behind it is `state-queued` and `net-upload`; the drawn exit from a capture screen presented as a task is `nav-modal`.
- A cancel that would discard captures says what is lost, and says nothing at all when nothing has been captured yet.

## <Rule id="cam-unusable" description="A capture the app will not accept is a designed screen that names which thing is wrong" />

The capture happened in a moving hand, in the light that was available, at whatever distance the user could reach. Neither platform publishes a blur, exposure or framing test, so the verdict is the app's own and the message cannot hide behind the platform's.

- Every automatic rejection names its cause: too dark, out of focus, nothing found, wrong shape. The wording is `copy-error`.
- The capture stays on screen while the app says so, because the user cannot tell from a vanished thumbnail what to change.
- Retake, plus use anyway wherever the app can still proceed. A retry that loses the frame is the second failure `state-retry` names.
- A scan or a detection that found nothing is a `state-empty` case rather than a `state-error` one.

## <Rule id="cam-orientation" description="Rotation and mirroring are metadata, so the bytes are normalised before anything but a platform image view sees them" />

The device is turned freely while the app's own screen is usually locked to portrait, so the sensor and the screen disagree on every capture. System galleries and platform image views apply the orientation tag; a cross-platform image component, a backend, an inference pipeline and a coordinate-based crop do not. The sideways photo therefore appears only after the bytes have left the phone.

- Every capture path reads its rotation, from the EXIF orientation tag with its 8 values or from the frame's in-memory rotation degrees, then either bakes it into the pixels or forwards it with them. iOS encodes the frame in the sensor's native landscape orientation and writes right for a portrait capture, expecting the reader to rotate 90 degrees clockwise. Getting it right matters to face detection and any other analysis, not only to display.
- The front-camera mirror is a deliberate flag rather than something inherited from the preview: on iOS the photo output applies it with Exif tags and the movie output with a track matrix, and on Android it is the reversed-horizontal flag on the capture metadata.
- A screen with a locked orientation still updates target rotation from an orientation listener, on every use case except the preview. That listener is the provider path's obligation: Android's camera controller sets target rotation itself, the same way it handles tap-to-focus and pinch-to-zoom. Ignoring it hands the analyser wrongly rotated frames.
- What gets stripped on the way out of the app is `share-payload-clean`.

## <Rule id="cam-bytes" description="The capture asks for a size, and the file lands where the app said it would" />

The default is the sensor's largest frame at near-lossless compression, travelling over somebody's data plan onto a phone whose storage is already full. This is the one screen where a single tap generates tens of megabytes.

- Ask for a size. Android's capture defaults to the largest available resolution, prefers 4:3, and writes JPEG at 95 in the low-latency capture mode and 100 in the quality one. State the resolution and the compression the screen actually needs: a code being read wants no more than about 2 megapixels. The decoded cost of what is kept is `perf-decode`.
- Name the destination. App-specific storage is unreachable by other apps and goes with the uninstall, the shared media store is for files meant to be shared, and writing into the user's photo library is a separate add-only grant (`perm-scope`, `perm-purpose-string`).
- Nothing the user captured reaches an analytics or advertising payload (`priv-instrument`). App Store Review Guideline 5.1.2(vi) bars data gathered from camera, photo, depth or facial mapping APIs from marketing, advertising and use-based data mining, third parties included, and 4.10 bars monetizing the camera itself.
- The transfer is `net-upload` and `net-metered`, and the queue it waits in is `off-queue`.

## <Rule id="cam-limited" description="On a limited photo grant the screen shows the granted set as the granted set" />

The phone is where the user's whole photo library lives, so a grant of three photos and an empty library look identical on a small grid. The user who granted three then reads the app as broken. `perm-answers` owns the branch; this rule owns what a grid the app drew over the library has to draw, and a screen that hands the job to the system picker never reaches it.

- The grid tells a limited grant apart from an empty library in its own sentence, with a route to change the selection. Those are two of the three sentences `state-empty` asks for.
- Under a limited grant the selection is the whole of what the app can reach, and user albums can be neither created nor listed, so album affordances are absent rather than empty. An asset the app creates joins the selection by itself.
- Both platforms have the state. iOS reports it only through the access-level form of the authorization status, because the older status and request pair report a limited grant as authorized. Android grants selected photos and videos through `READ_MEDIA_VISUAL_USER_SELECTED`, and an app declaring no read-media permission at all is run in a compatibility mode whose grants last one session, which is the same state with a shorter life.
- The selection changes at any time, so it is re-read rather than cached: from the library change notification on iOS, and on resume on Android, where the grant can move between onStart and onResume. Widening it goes through a control the app drew that re-requests the read-media permission, never a silent re-prompt (`perm-ask-less`).

## <Rule id="cam-thermal" evidence="device" description="The capture screen counts what it binds, and degrades on purpose when the phone gets hot" />

The camera is the most expensive thing on the phone and the phone is a sealed object in a warm hand. The platform takes the hardware back rather than let it cook, and a screen binding four pipelines to draw one preview reaches that point sooner.

- Bind only the pipelines the screen draws, one instance each. Android allows one preview, one video capture, one image analysis and one image capture; with extensions on, only image capture plus preview is guaranteed, video capture is unavailable and analysis may not work. Combining preview, video capture and either of the other two on mid-tier hardware can require stream sharing, which the platform states costs processing, latency and battery, and some cameras allow the combination only at a lower resolution.
- System pressure gets a stated degradation: a lower resolution, the torch dropped, analysis throttled. On iOS it is one of 6 interruption reasons and the only one about heat, so it does not share an answer with another app holding the camera or with the app being sent to the background. Saying the capture stopped is `sense-interrupted`, and what an open session costs is `perf-power`.

## Check

Review answers each of these against the code, pointing at the line:

- Every capture entry point that needs one photo goes through the platform capture intent or picker controller, each capture surface the app draws instead has a reticle, an edge finder or a level of its own, and the intent path is guarded by a resolve or a caught `ActivityNotFoundException` while the picker path is gated on `isSourceTypeAvailable(_:)`. `cam-system-first`
- The shutter's hit rect meets the platform floor and is the largest target on the screen, every capture control sits in the bottom third clear of the safe area, the platform indicator bounds and the hardware camera control's overlay strip in both orientations, each one carries its own opaque or scrimmed ground rather than relying on the preview and its own name, and the shutter is disabled for the duration of a capture rather than queueing a second frame. `cam-shutter`
- The torch control is drawn from the hardware presence query with its enabled state bound to the live availability value rather than read once, the front-camera path offers the screen flash or no torch, and the torch is off when the screen opens. `cam-torch`
- The zoom range and every lens stop come from values the device reports rather than from constants, no offered stop sits above the format's upscale threshold, a zoom change ramps rather than jumps and takes the configuration lock first, and a pinch has a tap or stepper equivalent. `cam-lens-zoom`
- The drawn reticle is derived from the same rectangle handed to the analyser, the analysed resolution is set at the call site rather than left at the pipeline default and clears 2 pixels per module for the smallest format the screen accepts, and the guidance names the condition instead of repeating that it is scanning. `cam-aim`
- A scan surface the app drew accepts on recognition rather than on a tap and never accepts the same value twice, the formats detected are an explicit list, and a screen drawing no overlay of its own uses the platform scanner on the platform's own terms. `cam-scan-decides`
- Every capture path the app draws has a review state with accept and retake, retake keeps what is already captured, accept is the only thing that commits, uploads or closes, and a cancel that would discard captures names what is lost while a cancel with nothing captured is silent. `cam-review`
- Every automatic rejection names its cause, keeps the capture on screen while it says so, offers retake plus use-anyway wherever the app can still proceed, and a scan or detection that found nothing renders the empty state rather than the error one. `cam-unusable`
- Every capture path reads its rotation and either bakes it in or forwards it, the front-camera mirror is set explicitly on the capture output rather than inherited from the preview, and a locked-orientation screen on the provider path updates target rotation from an orientation listener. `cam-orientation`
- Every capture sets a resolution and a compression rather than accepting the sensor maximum, the destination is named at the call site as one of app-specific storage, the shared media store or the user's library under an add-only grant, and no captured image or derived face data reaches an analytics or advertising payload. `cam-bytes`
- The photo grid tells a limited grant apart from an empty library in its own sentence with a route to change the selection, album affordances are absent under that status, and the granted set is re-read rather than cached: from the library change notification on iOS, on resume on Android, where widening it runs through a control the app drew that re-requests the read-media permission. `cam-limited`
- The screen binds only the capture pipelines it draws, at most one instance of each, and system pressure is answered with a stated degradation rather than an error. `cam-thermal`

Two of these cannot be settled from a diff. Drive the capture screen one-handed on the smallest and largest supported devices, with the platform capture indicator drawn, and measure the rendered hit rect of the shutter and of every control beside it (`cam-shutter`). Then hold a real capture session open until the device throttles, and watch what happens to the torch, the frame rate and the session (`cam-thermal`).
