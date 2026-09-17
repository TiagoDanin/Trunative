# Web views

Web content inside a native app: an in-app browser, a help page, a checkout, a page the team publishes without shipping a build. This file is about that surface, not about the mobile web stack. A product that ships as a website and not as an app in a store skips this file. An app that ships a store binary wrapping a site reads all of it, starting at `webview-wrapper`.

Here: which surface a URL opens in, what the wrapper has to carry, what back does, and how content nobody on the team can restyle behaves against the theme, the text size setting, the safe area and the keyboard. The sign-in flow itself is `auth-web-flow`. A link resolving back into the app is `nav-deeplink`. The load and failure states are `state-loading`, `state-error` and `state-retry`. What the page asks the device for is the `perm-` prefix. Every setting named below is an engine setting: in a Flutter, React Native or Expo codebase the wrapper exposes the same one under its own name, and that property is where the rule is scored.

## <Rule id="webview-surface-choice" description="Three surfaces, and the raw web view is the narrowest of them" />

A phone shows one thing at a time. There is no second window and no tab strip, so a web surface takes the whole screen and the only browser chrome the user gets is whatever this app handed them. The three are the system browser, the platform in-app browser (`SFSafariViewController` on iOS, Custom Tabs on Android) and a raw web view drawn by the app (`WKWebView`, `android.webkit.WebView`).

- The raw web view is for content the team controls: your own origin, your own HTML, or a page the app injects script into. Android splits it on the same line and adds that a URL outside your own domains is likelier right in a Custom Tab.
- Everything else opens in the in-app browser or the system browser, because that surface is the user's browser. A Custom Tab shares the browser's cookie jar and permission grants, so a site they are already signed into stays signed in, and their browsing session, saved passwords, payment methods and addresses are all there. A raw web view starts from a store the app owns rather than the browser's, so the same person signs in again inside it.
- The other direction is discouraged rather than forbidden: rebuilding Safari inside a web view repeats what the browser on this phone already does, so a surface people will read several pages in supports forward and back rather than growing an address bar and a tab strip.
- A raw web view owns every permission the page asks for, and each one lands in the app's own inventory, `perm-inventory` and `perm-purpose-string`.
- A checkout in a web surface does not change which rail applies, `pay-rail`, and a link out to your own is a storefront question, `pay-steering`.

## <Rule id="webview-signin" description="Somebody else's credential field never lives in a web surface this app can read" />

The keyboard, the masked characters and the missing address bar all arrive on the same full-bleed screen, so somebody typing a password into a raw web view has no way to see whose page it is. The app drawing that surface can read every keystroke.

- No page carrying a credential this app does not own is loaded into `WKWebView` or `android.webkit.WebView`: a bank, a carrier, a partner, an employer's directory. The host app reaches the full credential rather than the grant it was owed, and can record keystrokes, submit forms and copy session cookies. The app's own sign-in page is first-party content and is ruled on by `webview-surface-choice`.
- The surface also has nowhere to prove whose page it is. Verifying the requested URI and the connection security is what an address bar with a security indicator is for, and the title `webview-chrome` asks for does not supply it, because the app draws that title itself.
- An identity provider's own sign-in is the same harm with an owner. `auth-web-flow` rules which surface it opens in and how its return leg lands, and it is scored there rather than here. The providers that enforce it refuse an authorization request sent to an embedded user-agent outright, one of them with `disallowed_useragent`.

## <Rule id="webview-chrome" description="A raw web view arrives with no chrome, so the app draws where you are and how to leave" />

An Android web view carries no navigation controls and no address bar: by default it shows a page and nothing else. Nothing marks that ownership changed from the app to something nobody on the team wrote, and a page that fails to load is a blank full screen with no exit.

- Copy the set the platform in-app browser already ships. Apple's carries a read-only address field with a security indicator, a Done button, forward and back, and a button opening the page in Safari. The app's own wrapper carries three of them: the title or the host, a close control, and a route to open this page outside the app.
- The close control is a real control. It meets `touch-floor`, and icon-only it carries a name (`a11y-name`). The screen still says where it is, `nav-location`, and a share affordance is the system sheet and nothing else, `share-sheet-only`.
- Do not remove what a Custom Tab gives away: no `OPEN_IN_BROWSER_STATE_OFF`, the close button stays enabled, and showing the title costs one call.
- What this rule is about is a page opened over the app's own screens. The root surface of an app that is a wrapped site has nothing to close back to and no outside to hand itself to, and it answers `webview-wrapper` instead.

## <Rule id="webview-back" description="Back resolves inside the page before it leaves the screen" />

Back is the phone's one universal exit and on both platforms it is a gesture, so it gets used without looking. An Android web view hands the first back straight past the page: by default the system exits the activity, throwing away every page read inside it.

- Android: wire an `OnBackPressedCallback` calling `goBack()` while `canGoBack()` is true. It is the only route left, because an app targeting `targetSdk` 36 is never dispatched the back key at all. `goBack()` and `goForward()` do nothing at the end of history, so the callback falls through to the stack by itself, where `nav-back` takes over.
- iOS: `allowsBackForwardNavigationGestures` is false by default. Turn it on, or wire a drawn control to `goBack()` against `canGoBack`. A drawn back control keeps the gesture it replaced (`nav-back-control`), and the system edge zones are `touch-gestures`.
- The in-app browser and the system browser resolve their own page history and need none of this.

## <Rule id="webview-leaving" description="A link that leaves the page leaves the surface" />

Other apps on this phone hold the schemes a page hands out. `mailto`, `tel`, a store link and an `intent` URL are not http, so a web view given one loads nothing and the tap dies with no feedback, while an http link to somewhere else turns a one-page surface into an unlabelled browser.

- Every raw web view has a navigation policy: a written list of hosts that stay inside, everything else handed to the platform. The decision point is `shouldOverrideUrlLoading` on Android and `WKNavigationDelegate` on iOS. A URL outside the listed hosts opens in the default browser rather than inside the surface. The in-app browser and the system browser have no such list to set.
- Non-http schemes are dispatched rather than loaded, and a dispatch nothing on the device can receive fails with a message rather than as a dead tap.
- A link resolving back into this app is `nav-deeplink`, and the link the app hands out is `share-link-not-shot`.

## <Rule id="webview-appearance" evidence="device" description="The page did not read the theme, so hand it the appearance or accept the one it has" />

A white full-screen page arriving in the middle of a dark app at night is the whole screen going white, on an OLED panel, held close to the face. There is no surrounding window to soften it.

- An Android web view sets `prefers-color-scheme` from the app theme's `isLightTheme`, so a page with its own dark styles already follows. Algorithmic darkening is disallowed by default, so for a page with no dark styles `setAlgorithmicDarkeningAllowed(true)` is the only lever, and it needs `targetSdkVersion` 33 or above, where `setForceDark` does nothing at all.
- A Custom Tab left alone already follows the system: `COLOR_SCHEME_SYSTEM` is the default, so the failure is a colour set once. A tab that sets a toolbar colour sets two, light and dark, through `setColorSchemeParams`, and pins neither `COLOR_SCHEME_LIGHT` nor `COLOR_SCHEME_DARK` against the system.
- On iOS the page reads the appearance of the view it sits in, so an app forcing an appearance over the web view forces the page's `prefers-color-scheme` with it. What is missing there is the algorithmic lever: a page shipping no dark styles stays light inside a dark app, and a first-party page is where those styles get written. Dark is a second design (`color-dark-composed`), and what happens to weight in it is `type-dark`.

## <Rule id="webview-text-size" evidence="device" description="The text size setting reaches the page, or the page can be enlarged" />

Android scales system text to 200% on a non-linear curve and iOS carries accessibility sizes above its default, and the web surface is the one screen in the app that can ignore all of it.

- An Android web view already follows the system font scale, taking its initial text zoom from the configuration. Calling `setTextZoom()` severs that permanently, so the violation is a line that exists rather than one that is missing.
- Leave every page loaded from a URL zoomable: `setBuiltInZoomControls(true)` with `setDisplayZoomControls(false)`, because the built-in mechanism is the only supported one and the on-screen buttons are deprecated. A first-party page sets no `user-scalable=no` and no `maximum-scale`, which `form-input` rules on alongside the field size.
- In `WKWebView` a first-party page asks for the setting instead of inheriting it: size text with the `-apple-system-body`, `-apple-system-headline`, `-apple-system-subheadline`, `-apple-system-caption1`, `-apple-system-caption2` and `-apple-system-footnote` values of the CSS `font` shorthand rather than fixed pixels. They are WebKit values and no other engine implements them, so the Android side is the font scale above and nothing more. The app side is `type-scaling` and `a11y-settings`.

## <Rule id="webview-viewport" evidence="device" description="The insets are paid once, and the keyboard shortens the visual viewport only" />

The notch, the home indicator and the gesture bar are all on this device, the keyboard takes half the screen, and neither the page nor the native container knows what the other one already paid for. Padding twice and not padding at all land on the same screen.

- Insets are applied in exactly one place per surface. Android forwards cutout and system bar dimensions to the page as `safe-area-inset-*`, and only where that system UI overlaps the web view's own bounds: a surface already inset away from the edges reads zeros, which is the documented answer and not a bug. Where they do arrive, a container that also pads from `WindowInsets` without returning the handled types zeroed doubles them, and a 40px status bar becomes an 80px gap. `WindowInsetsCompat.CONSUMED` is worse: the web view is never told the insets changed and keeps the previous padding. Edge-to-edge is enforced at `targetSdk` 35 and cannot be opted out of at 36, so there is no version to wait for. The native half is `layout-insets` and `layout-chrome`.
- On iOS web content is inset inside the safe area for you. `viewport-fit=cover` turns that off, and a page setting it pads its own four edges with `env(safe-area-inset-*)`, floored through `max()`, or the sensor housing covers content.
- The keyboard resizes the visual viewport and not the initial one, so nothing derived from `vh` shrinks and a control pinned to a `vh` bottom sits under the keyboard. Android resizes only the bottom edge, by the web view's intersection with the window, and an app opting out manages the resize itself or `scrollIntoView()` fails and the keyboard covers the focused field. A page clearing focus from a resize handler flaps: focus, keyboard, resize, blur, keyboard gone. `touch-keyboard` and `scroll-keyboard` own the native half.

## <Rule id="webview-transfers" description="A download and a file picker inside a web surface are the app's work, or they fail silently" />

A phone shows no filesystem, so a download producing nothing looks exactly like a slow one, and the second tap is what the user does next. A file input that opens no picker is a dead control on a screen with no cursor to hover it with.

- Android cancels every file request by default. `onShowFileChooser` is overridden, returns true and keeps the callback, or the page's file input does nothing at all. The web view reaches every file the app can reach, so the chooser is scoped to what the page asked for and no wider.
- Android performs no download itself: it notifies the app through a registered `DownloadListener`, carrying the URL, the MIME type and the length. On iOS `WKDownloadDelegate` has one required method and it exists to name the destination the system writes to.
- Every path ends somewhere the user can reach the file, and a failure says so under `state-error`. A Custom Tab keeps its download button, which is on by default. Handing the file on is `share-file-uri`, and the transfer out is `net-upload`.

## <Rule id="webview-session" description="What happens inside a web surface is not the app's session, and the app cannot read it" />

The browser on this device already holds this person's sessions. A raw web view starts from a store of the app's own, so it asks them to sign in again by hand, on a keyboard, and whatever it keeps afterwards is the app's to clear.

- Nothing reads an outcome out of the platform in-app browser: interactions with that web interface are not visible to the app, which cannot reach autofill data, browsing history or website data. An outcome that matters arrives from the server or through a claimed link, `nav-deeplink`.
- No access token, session cookie or account identifier is handed to a page. The wider version is `priv-instrument`.
- Sharing is a decision rather than a default. A Custom Tab shares the browser's cookies unless `setEphemeralBrowsingEnabled` is set, and the iOS authentication session, whose surface belongs to `auth-web-flow`, shares unless `prefersEphemeralWebBrowserSession` is set before `start()`. A raw web view's store is the app's own: the default `WKWebsiteDataStore` writes to disk and `nonPersistent()` does not, so anything holding a signed-in session is cleared on sign-out, `auth-signout` and `off-session`.
- The trade is worth naming once. The browser gives the saved-credential behaviour of `form-autofill` and a separate authentication context at the same time; a raw web view gives neither.

## <Rule id="webview-wrapper" description="A wrapped site inherits none of the floors this file sets" />

A site in a frame gets nothing for free. The touch floor, the safe area, the text size setting, the back gesture and the keyboard all stop being the platform's job and become the page's, and the page was drawn for a pointer on a screen that never moved.

- Every web surface the app ships is listed in `STACK.md` beside what it does natively, so the next one is a decision rather than a habit. Each one on that list still answers `touch-floor`, `webview-back`, `webview-text-size` and `webview-viewport` on its own account.
- Apps that browse the web on iOS use WebKit, and an entitlement is the only route to another engine. What may change the shipped binary at all is `upd-store-channel`.

<Check>

<Verify rule="webview-surface-choice">Every URL outside a domain the team controls opens in the platform in-app browser or the system browser, each raw web view loads a first-party origin or HTML bundled with the app, and no raw web view carries an editable address field or a tab strip.</Verify>
<Verify rule="webview-signin">No `WKWebView` or `android.webkit.WebView` load call takes a page carrying a third party's credential field, a bank, a carrier or a partner included; an identity provider's sign-in is scored under `auth-web-flow` rather than here.</Verify>
<Verify rule="webview-chrome">Every raw web view opened over a native screen carries the page title or its host, a close control at the touch floor with a name, and a route to open the page outside the app, and no Custom Tab passes `OPEN_IN_BROWSER_STATE_OFF` or disables its close button.</Verify>
<Verify rule="webview-back">Every Android web view wires an `OnBackPressedCallback` to `goBack()` while `canGoBack()` is true, and every `WKWebView` either sets `allowsBackForwardNavigationGestures` to true or wires a drawn control to `goBack()`.</Verify>
<Verify rule="webview-leaving">Each raw web view has a navigation policy naming the hosts that stay inside, non-http schemes are dispatched to the platform rather than loaded, and every dispatch has a no-receiver path that shows a message rather than failing silently.</Verify>
<Verify rule="webview-appearance">No `setForceDark` call remains, every Android web view loading a page with no dark styles allows algorithmic darkening at `targetSdk` 33 or above, every Custom Tab that sets a toolbar colour sets both `setColorSchemeParams` variants rather than pinning one scheme, and no page arrives white while the system is in dark appearance.</Verify>
<Verify rule="webview-text-size">No `setTextZoom` call overrides the system font scale, every `android.webkit.WebView` that loads a URL rather than HTML bundled with the app sets `setBuiltInZoomControls(true)` with `setDisplayZoomControls(false)`, no first-party page sets `user-scalable=no` or `maximum-scale`, and at maximum text size no text is clipped, truncated or overlapped and no control has left the screen.</Verify>
<Verify rule="webview-viewport">Insets are applied in one place per web surface, no web view's inset handler returns `WindowInsetsCompat.CONSUMED`, no page sets `viewport-fit=cover` without `env()` padding of its own, no page pins a control to a `vh` bottom, and with a field inside the page focused no control sits under the keyboard and neither edge is padded twice nor left unpadded.</Verify>
<Verify rule="webview-transfers">Every `android.webkit.WebView` overrides `onShowFileChooser` returning true and registers a `DownloadListener`, every iOS download path implements `WKDownloadDelegate` with a named destination, no Custom Tab disables its download button, and that destination is either a directory the user can open or a path ending in the system share sheet, `share-file-uri`.</Verify>
<Verify rule="webview-session">Nothing reads an outcome out of a platform in-app browser, no token or account identifier is handed to a page, every Custom Tab and authentication session either sets `setEphemeralBrowsingEnabled` or `prefersEphemeralWebBrowserSession` explicitly or `STACK.md` records the shared session as intended, and any raw web view holding a signed-in session is cleared on sign-out.</Verify>
<Verify rule="webview-wrapper">Every web surface the app ships is listed in `STACK.md` beside what it does natively, and each entry on that list is scored against `touch-floor`, `webview-back`, `webview-text-size` and `webview-viewport` on its own account rather than inherited from the native screens.</Verify>

<Device>Three of these are only half answerable from a diff, because what the page does with what it was handed is not in the code. Drive one screen three ways on the narrowest supported device: with the system in dark appearance, to see whether the page followed or arrived white (`webview-appearance`); with the text size at maximum, to see whether the page grew with nothing clipped, truncated, overlapped or pushed off the screen (`webview-text-size`); and with a field inside the page focused, to see what the keyboard covers and whether either edge of the screen is padded twice or not at all (`webview-viewport`).</Device>

</Check>
