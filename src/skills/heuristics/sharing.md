# Sharing

Sharing is how the app leaves the phone. Something inside it becomes a message, a post, a file in someone else's app, and then comes back the other way when this app is the destination. Sending a copy out and taking one in is the whole of the subject here. Inviting someone into a document to work on it alongside you is collaboration, which is a different problem and is not covered.

Two things make it a phone problem rather than a general one. The share surface is not yours: the system sheet is drawn by the OS, ranked by the OS, and populated from apps you cannot enumerate. And the app is suspended the moment it opens, so whatever gets handed over has to be finished, small, and correct before the sheet appears. Coming back in, a share arrives on a device already showing something else, on top of work the user was in the middle of.

## <Rule id="share-sheet-only" description="The system sheet is the share UI" />

A drawn row of service logos is the pattern to delete. Both platforms land in the same place from opposite sides: no app-drawn list of share targets and no variation on the sheet, because the Share control is expected to open the system activity view and anything else in its place only confuses. The sheet is the only surface that knows which apps are installed on this phone, which conversations are recent, and which system destinations exist at all. Six hardcoded logos are a guess about a stranger's device, and they rot every time one of those apps changes a URL scheme.

| Stack | Entry point |
|---|---|
| SwiftUI | `ShareLink` |
| UIKit | `UIActivityViewController` |
| Compose and Android views | `Intent.createChooser()` wrapping `ACTION_SEND`, or `ShareCompat` |
| Flutter, React Native | the bridge to the two rows above, never a drawn list |
| Mobile web | `navigator.share()`, offered only when `navigator.canShare?.(data)` agrees for the exact payload |

Skipping `createChooser()` on Android gets the intent resolver's disambiguation dialog instead of the Sharesheet, which is a different and worse surface. Put the control in the chrome on the platform's own share glyph (`icon-one-set`), sized as a target like anything else (`touch-floor`), and exclude what does not apply: your own targets on Android with `EXTRA_EXCLUDE_COMPONENTS`, system activities the content cannot go to on iOS with `excludedActivityTypes`.

On the web the sheet is conditional in a way it never is in a native build: `navigator.share()` exists only in a secure context and is missing from browsers that are still in use, so the copy path (`share-copy`) is the route, not a courtesy. Test the property before calling it and test the payload you are about to send, because `canShare()` with no argument is false everywhere: a bare `if (navigator.canShare())` hides the control on the browsers that support it fully, and reaching the method at all throws on the ones that do not have it.

## <Rule id="share-payload" description="One item, one concrete type" />

`ACTION_SEND` carries a single item and `ACTION_SEND_MULTIPLE` a list, with the content in `EXTRA_TEXT` or `EXTRA_STREAM`. Declare the MIME type the content actually is. A wildcard is never that type: most receiving apps cannot take anything, so `*/*` fills the sheet with destinations that will fail on the payload. On the web, `navigator.share()` rejects with a `TypeError` unless at least one of `title`, `text`, `url` or `files` is present, so a share assembled from a half-loaded model throws instead of opening. Text and its link are one payload, not two shares, and the wording of that text is `copy-budget`.

## <Rule id="share-link-not-shot" description="Share the thing, not a picture of the thing" />

A screenshot cannot be opened, followed, or read by anyone using a screen reader. Share a URL that resolves to a real page for someone without the app and opens the app for someone who has it: a universal link declared through the `applinks:` entitlement, an App Link with `android:autoVerify="true"`. Both are verified from a file the domain serves over HTTPS at `/.well-known/`, `apple-app-site-association` and `assetlinks.json`, and neither is live the moment the file goes up. On iOS the association file is fetched through a CDN within 24 hours and devices re-check it about once a week. On Android verification runs at install and at update, inspectable with `pm get-app-links` and re-runnable with `pm verify-app-links --re-verify`. Either way a domain change is not live for anyone already holding the app. A custom scheme such as `myapp://` pasted into a message is plain text on every device that has not installed you. Routing the link once it arrives is `nav-deeplink`.

## <Rule id="share-preview" description="Hand the preview over, do not make the destination fetch it" />

From Android 10 (API 29) the Sharesheet shows a preview of shared text, built from `EXTRA_TITLE` plus a thumbnail passed as a content URI with read permission granted. On iOS the two entry points behave differently. `ShareLink` with no supplied preview shows a placeholder link icon beside the bare URL while it pulls the metadata over the network, and a supplied preview renders immediately with no fetch at all. `UIActivityViewController` derives nothing on its own: the preview comes from `activityViewControllerLinkMetadata(_:)` or an `LPLinkMetadata` handed over at the call site, and without one there is no preview. That fetch runs on the same phone connection the user is already waiting on, in front of a sheet that is already open.

The system can only derive a preview for a bare URL or a plain string. Anything else, and anything whose title should read differently from the page's own, is supplied at the call site: the title, the image and the type. The preview is also the last thing the sender sees before the send, so it is the place a wrong image or a stale title gets noticed, which is a reason to get it right rather than a reason to omit it.

## <Rule id="share-ready" description="The payload is finished before the sheet opens, and not built on the drawing thread" />

The item-source callbacks on iOS run on the drawing thread, so nothing that takes real time to produce belongs inside one: that is what the provider and placeholder forms exist for (`perf-main-thread`). On iOS and Android, prepare the item on tap, show a placeholder while it resolves, and open the sheet on data that exists.

The web will not take that shape. `navigator.share()` requires transient activation, so an `await` between the tap and the call spends the gesture and the promise rejects with `NotAllowedError`, and unlike the clipboard write there is no promise the call will accept and wait on. So on the web the payload exists before the tap or the control is not offered yet, and `share()` is called synchronously in the handler. Either path is held to the thresholds in `perf-main-thread`, measured on the slowest device you support (`perf-measure`).

## <Rule id="share-file-uri" description="A file leaves as a granted content URI" />

On Android, hand out `FileProvider.getUriForFile()` and grant it with `addFlags(FLAG_GRANT_READ_URI_PERMISSION)`, which is the secure route and is preferred over calling `grantUriPermission()` yourself. A `file://` URI from `Uri.fromFile()` needs the receiving app to hold storage permission, which major targets such as Gmail do not, so the share fails on exactly the destinations that matter. Resize and crop before handing over instead of sending the original capture: those bytes cross a phone network first and the destination re-encodes them anyway. WebP or AVIF for images and AV1 or HEVC for video carry the same picture in less (`net-upload`).

## <Rule id="share-outcome" description="The app does not get to say where it went" />

Web Share is fire and forget: the promise resolves with `undefined` and never names the target, and its rejection is worse than useless, since one and the same `AbortError` covers the user cancelling and the device having no share target at all. Android tells you the chosen component only if you pass an `IntentSender` to `createChooser()` and read `EXTRA_CHOOSER_RESULT` back. So "Shared to WhatsApp" is usually a fiction, and on most paths a cancelled sheet is indistinguishable from a completed share.

The sheet closing is the feedback (`fb-silent-success`), and a toast fired on dismissal claims something that did not necessarily happen. Nothing in the product is unlocked, rewarded, counted or advanced on the strength of a share the app cannot observe.

## <Rule id="share-payload-clean" description="What goes out is what the user saw" />

The code adds things the user did not: EXIF location and device model inside a photo, a session token or account id appended to a share URL, an internal identifier in a filename. Strip metadata the destination has no use for, and build the outgoing link from public identifiers only. Anyone the link reaches can open it, so it may not carry anything that authenticates the person who sent it, and a share is not a hole in `priv-instrument`.

The sheet itself is a transfer the user asked for and picked the destination of, so it falls outside the store's data sharing declaration. What does turn that declaration on is anything the app sends alongside or behind the share: an analytics event carrying the content, an SDK handed the same payload, a server-side copy taken on the way past. Those are declared like any other transfer (`priv-declared`).

## <Rule id="share-accepts" description="Declare narrowly what the app receives, then distrust all of it" />

Being a share target is an intent filter on `ACTION_SEND` or `ACTION_SEND_MULTIPLE` with category `DEFAULT` and a concrete `mimeType`, or a share extension on iOS. Accept the widest range you genuinely handle, and never declare `*/*` unless that claim is true. Then treat everything that arrives as written by a stranger, because it was: the wrong type under the right label, an image far larger than the screen, a file that is not what its type says. Decode it off the UI thread. What cannot be handled gets a real failure state with a way forward (`state-error`), never a crash and never a silent discard.

## <Rule id="share-arrives" description="A share lands on a phone that was already busy" />

The user was mid-form somewhere else, so the incoming share is an interruption rather than a launch (`state-interrupt`, `form-persist`). Decide before building whether it opens its own task or joins the one in progress, and write that decision where it can be read: the launch mode and task flags on the receiving activity, `documentLaunchMode` where each share becomes its own document, the extension's own dismissal path on iOS. Either way the interrupted work is still there on return (`nav-restore`). Keep the receiving surface to a few steps: a share or action extension finishes the job quickly and stacks no further modal views inside itself. Work that takes real time continues in the background with its status visible in the main app, and finishing it is not by itself worth a notification.

## <Rule id="share-targets" description="Do not inject destinations, publish them" />

The two directions have opposite answers. As the sender you add no destinations of your own: on Android `EXTRA_CHOOSER_TARGETS` and `EXTRA_INITIAL_INTENTS` are capped at two apiece and discouraged either way, since each one displaces a target the system would have ranked better. As the receiver you expose your own conversations through the Sharing Shortcuts API, which since Android 11 (API 30) is the only mechanism, the older chooser target service having been deprecated there. Publish long-lived shortcuts ordered by importance, report use so ranking has a signal, and drop stale ones, a conversation with no activity in the last 30 days counting as stale.

An action is not a destination, and both platforms leave room for one: custom sheet actions on Android 14 (API 34), a custom activity on iOS, which the sheet lists ahead of the system ones. Either is for something your app does to the content, never a second copy of a destination the sheet already carries, and its title is a short verb phrase with no product name in it.

## <Rule id="share-copy" description="Copy is the fallback, and its confirmation is per platform" />

Copy to clipboard is the answer when there is no destination to share to, when the user needs the raw string such as a code or an address, and on any path where the sheet is unavailable. The confirmation is not one decision. Android 13 (API 33) and later shows a system confirmation with a preview of what was copied, so the app's own toast or snackbar is removed at that level, while API 32 and below still needs the app to say something. iOS shows nothing at all, so there the app owns the feedback (`fb-ladder`). Copying a password, a card number or a recovery code sets `ClipDescription.EXTRA_IS_SENSITIVE`, so the system preview does not put the secret on screen.

## <Rule id="share-paste" description="Reading the clipboard is a visible act" />

Android 12 (API 31) and later shows the user a toast naming your app when it calls `getPrimaryClip()`. iOS 16 and later puts a permission alert in front of a programmatic read, and exactly three routes skip it: the system Paste menu item, the keyboard shortcut, and `UIPasteControl`, where the tap itself is the consent. A Paste button you draw yourself and wire to `UIPasteboard.general.string` is a programmatic read and raises the alert like any other. So a clipboard read happens because the user asked for one through one of those routes, never at launch and never to sniff a referral code out of the background. Inspecting without reading raises neither notice: `getPrimaryClipDescription()` on Android and `detectPatterns(for:completionHandler:)` on iOS, and knowing the type is usually enough to decide whether to offer a paste at all.

## <Rule id="share-invite" description="An invite link opens a screen, not a login wall" />

Where the sign-in is to a specific social network, the App Store requires access without it or through some other mechanism, and it names inviting friends and sharing to a social network as things that do not count as core functionality. A referral programme is not what makes such a sign-in core, and social network credentials and tokens are never stored off the device. Where the gate is your own account and the app has no significant account-based features behind it, the guideline is softer but points the same way: let people in and ask later. The screen someone reaches from an invite shows what they were invited to before it asks for anything (`onboard-look-first`), and it is not the cold-launch home screen: the link named a thing and that thing is what opens (`nav-deeplink`). Attribution comes from the referrer the platform hands you, not from the clipboard (`share-paste`).

<Check>

<Verify rule="share-sheet-only">Sharing goes through the platform's own sheet, no component draws a list of service targets, and Android calls `createChooser()`.</Verify>
<Verify rule="share-payload">The payload declares a concrete MIME type, never a wildcard, and cannot be assembled empty.</Verify>
<Verify rule="share-link-not-shot">What is shared is a link that opens for a stranger and is verified from `/.well-known/`, not a screenshot and not a custom scheme.</Verify>
<Verify rule="share-preview">Title, thumbnail and type are supplied to the sheet rather than left for the destination to fetch.</Verify>
<Verify rule="share-ready">Payload construction happens off the drawing thread and completes before the sheet is opened, with no `await` between the tap and a web share.</Verify>
<Verify rule="share-file-uri">Files are shared as granted content URIs, never as filesystem paths, and are resized before they leave.</Verify>
<Verify rule="share-outcome">No UI names the destination of a share, and nothing is rewarded or unlocked on a share completing.</Verify>
<Verify rule="share-payload-clean">The outgoing payload carries no EXIF or device metadata, session token or internal id.</Verify>
<Verify rule="share-accepts">Declared incoming types match what the app actually handles, and every incoming item is validated and decoded off the UI thread.</Verify>
<Verify rule="share-arrives">The receiving entry point states its launch mode, task behaviour or dismissal path, and the work the share interrupted is still there afterwards.</Verify>
<Verify rule="share-targets">No custom chooser targets or initial intents on Android, any iOS custom activity acts on the content instead of duplicating a destination, and conversations the app owns are published as system share shortcuts with stale ones removed.</Verify>
<Verify rule="share-copy">Copy feedback follows the platform: no app toast where the system already confirms, and sensitive copies are flagged.</Verify>
<Verify rule="share-paste">The clipboard is read only from a user action, never at launch.</Verify>
<Verify rule="share-invite">Invites and referrals are reachable without an account, and their link opens the thing it named.</Verify>

</Check>
