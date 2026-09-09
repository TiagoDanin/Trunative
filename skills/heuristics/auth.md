# Identity and the session

Signing in is the one screen where a phone is worst at everything it does: a keyboard covering half the display, characters that are masked as they are typed, and a device that is handed around, backgrounded mid task and killed without notice. Every character of a password costs more here than anywhere else, so most of this file is about not asking for one.

Whether an account is needed before the first useful action is `onboard-look-first`, and what offering account creation obliges the app to do is `onboard-account`. This file is the rest of the life of an identity: the returning sign-in, what a fingerprint result is allowed to mean, the session ending in the middle of a task, which account is acting, getting out, and getting deleted.

The field mechanics belong to forms: `form-input` and `form-autofill`. The biometric prompt as a surface, and the eight ways it can end, are `sense-biometric`. System permission prompts are a different thing and live in `permissions.md`.

## `auth-methods` Every route on the screen reaches the same account

Count the sign-in routes a returning user can tap without scrolling. The count is not the rule: what fails is two routes that open separate accounts for the same person, which is where somebody taps the wrong logo and lands in a second account holding none of their data. Which routes have to be on that screen at all, and how they are sized against each other, is `onboard-account`. The order they appear in is decided once and does not reshuffle between visits.

- On Android the first route is Credential Manager, which `onboard-account` already requires: passkeys, saved passwords and federated accounts arrive inside that one sheet rather than as buttons beside it. The sheet is dismissible, so a persistent control sits beside it to reopen the flow without restarting the app, and that control is the entry point rather than one more provider.
- On iOS there is no such sheet and nothing federated lives inside the platform route. Saved passwords and passkeys are offered on the username field itself, which is `form-autofill`, and Sign in with Apple is a button sitting beside that field under `onboard-account` rather than an item inside it.
- Prefer a passkey where the app is not already offering Sign in with Apple, and on Android wherever Credential Manager is the entry point. Where the app still accepts a password, the passkey is offered at the first successful sign-in that does not use one.
- Registering or asserting a passkey needs the app and the site associated first, and each side has its own file and its own failure: the `webcredentials` associated domain on iOS, where a missing one returns an error, and on Android an `assetlinks.json` at the domain's well-known path carrying the login-credentials relation for the app's package and its release signing fingerprint, where a mismatched package or fingerprint fails both create and get. The association ships with the button or the button does not ship.

## `auth-provider-button` A provider button is a component, not a style

Apple ships a component and Google ships artwork, so the two are built differently. Take Apple's wherever the stack can reach it: `ASAuthorizationAppleIDButton` in UIKit, `SignInWithAppleButton` in SwiftUI, or a wrapper that renders one of those. A hand-built copy where the component is reachable loses the approved appearance, the automatic translation and the accessibility label that came with it. Only where the stack cannot reach it, Flutter included, is the button a replica, and then it owes the published specification exactly. Google publishes marks and a specification rather than a button, so that one is always built and always measured against the specification.

- Both publish the same three titles: sign in with, sign up with, or continue with. Apple's component enforces them; on Google's side what is unmodifiable is the mark, so a button carrying anything else is checked against the mark rules rather than assumed safe. Both titles translate with the rest of the app, under `l10n-strings`, and localizing them is expected rather than tolerated.
- Apple's artwork stops being compliant below 140x30pt, with clear space of one tenth of its height around it, and the logo-only form is a PNG only at 44x44pt and vector at every other size. That 30pt is the floor for the artwork, not for the control: 44pt is already Apple's recommended default button height, and either way the hit area answers to `touch-floor` while the artwork keeps its own minimum and its clear space inside that hit area.
- Google's mark keeps its standard colors at its standard size: never monochrome, never the letter alone without the button around it, and the button preserves its aspect ratio.
- The narrow column is what breaks these. A full-width stack of buttons stretches a fixed-ratio asset, so scale the button and let the artwork keep its ratio inside it.

## `auth-web-flow` The provider's page opens outside the app

A provider sign-in that opens a web page opens it in the system authentication session: `ASWebAuthenticationSession` on iOS, Custom Tabs on Android. `SFSafariViewController` is not one of these. It is a browsing surface: what happens inside it is not visible to the app, and nothing guarantees the callback comes back to the app that opened it rather than to another app registering the same scheme. An embedded web view under the app's own control is worse still, refused outright by the provider, and it puts somebody else's password field inside a surface this app can read.

- The return leg lands back on the screen the flow started from, with its state, rather than on a fresh stack or the home screen. It arrives through the session's own callback on iOS, a registered callback scheme or, from iOS 17.4, an https callback, and through a claimed app link on Android.
- A cancelled or failed return leaves that screen intact and says what happened beside the route that failed, under `form-error`.

## `auth-magic-link` A sign-in link has to survive the trip through a mail app

- The link is a claimed universal link or app link, so tapping it opens the app rather than a web view inside the mail client, where the session waiting for it does not exist. Its landing is `nav-deeplink`.
- The screen that is waiting is going to be backgrounded and is often process-killed before the link is tapped. It comes back under `state-interrupt` and finishes there, rather than restarting the flow with a second link.
- A link opened on a different device from the one waiting says so and offers the code route in `auth-code-screen` instead of failing silently, and the link is spent when the person acts on it rather than when something fetches it, because a mail scanner or a link preview fetches it first.

## `auth-last-used` The phone remembers which door this person used

A phone is one device belonging to one person far more often than a browser is, and that is the fact a sign-in screen should be spending. Store which method succeeded on this device and mark it on the next visit, because a returning user offered four identical buttons and no memory is how one person acquires three accounts and files a ticket saying their data disappeared.

- The marker names the method, never the account: "you used Google here" and not the address, because the device gets handed over and the sign-in screen is visible before anyone authenticates.
- Where a new sign-up arrives with an address that already has an account, offer to link the two instead of creating the second.

## `auth-code-screen` The code lands on the device that is showing the field

One field with the one time code content type, paste never blocked, is `form-autofill`. The screen around it is this rule, and it exists because the user has to leave the app to read the code and the app has to still be there when they get back.

- Leaving for the messages app and returning restores the code screen with its state, not the start of the flow. The mechanism is `state-interrupt` and `nav-restore`.
- The screen says where the code was sent and lets that be corrected without restarting the sign-in. Resend exists beside it and is disabled behind a visible countdown, so the control is never dead with no explanation.
- An autofilled code may submit itself once. A rejected code returns to an editable field with a message beside it, under `form-error`, and never back to the first screen.

## `auth-biometric-session` Rule on the API, not on the sensor

The division is the API and not the gesture, and the same face drives both. A credential API assertion, which is what a passkey is, signs the user in: the verification gesture releases a key and the server verifies what comes back. A `LocalAuthentication` or `BiometricPrompt` success does not: it re-authorizes a session that already exists. The credential API is the sign-in on every platform, the prompt is the re-authorization, and the bullets below land on the prompt alone.

- A prompt result proves the enrolled owner of this device is present. It tells the server nothing about who the account is, so it is not a second factor and it is never the only way into an account. Locking an app the user is already signed into behind that check is the case it is for, and that lock keeps the device credential behind it.
- The switch that turns that lock on decides whether this app asks and never whether the device biometric is on: on Android an in-app control for it is the documented pattern, while iOS discourages a standalone opt-in for biometric authentication, so on both it is named for the thing it protects and sits beside it rather than standing alone as a biometric preference.
- The non-sensor route to the same place, the enrolment route where nothing is enrolled yet, and the eight ways the prompt can end, are `sense-biometric`. What this rule adds is that the route exists in the same session, because a wet hand on the payment screen is not a reason to sign out. Name the fallback control from the platform rather than from one shared string: Android's device credential is the user's PIN, pattern or password, while on iOS a passcode is the device unlock and Apple's own services, so nothing this app owns is called one.
- Where the check gates money, credentials or identity documents, require the strong class. Android names them Class 3 and Class 2, and accepting whatever is enrolled accepts the weak one.
- Two authenticator sets do not work on API level 29 and below: `DEVICE_CREDENTIAL` alone, and `BIOMETRIC_STRONG | DEVICE_CREDENTIAL`, which is the usual way to satisfy the bullet above. On those releases check for a PIN, pattern or password with `KeyguardManager.isDeviceSecure()` instead of asking the prompt for it.

## `auth-expiry` Expiry interrupts the task, it does not restart the app

Tokens die while the app is backgrounded, which on a phone is most of the time, so the expiry is usually discovered on the way back into a half-finished screen. That screen is what is at stake.

- A refresh that could not reach the server is not a sign-out. That distinction is `off-session`.
- What was typed is still there afterwards: `form-persist`. Where the person lands is the screen they were on, with its scroll offset and its sheet, under `nav-restore`, and never the home screen.
- Re-authentication arrives over the task as a modal, under `nav-modal`, rather than as a navigation that unwinds the stack the task was living in, and several requests expiring at once produce one prompt over that task rather than one per request. Deduplicating the refresh underneath and replaying what failed is `net-backoff`.
- The session lifetime is recorded in `STACK.md` and read from one constant at every call site, rather than scattered as literals.

## `auth-reauth` A sensitive action asks again, and the window is written down once

An unlocked phone is regularly in someone else's hands, which is why a live session is not proof of anything for the actions below.

- Ask again for: changing the password, the email address or the phone number; adding or editing a payout or payment destination; revealing a full card or document number; exporting the data; deleting the account.
- The re-authentication window is recorded in `STACK.md` and applied from there at every call site, because three literals become three windows.
- Never draw a surface that imitates the system biometric or credential prompt, which is `sense-biometric`: that is the one thing the user has no way to see through. The app's own password or PIN challenge is a legitimate route, and where the sensor is unavailable the device credential is the fallback rather than a dead end.
- Ordinary activity does not extend the window. Reading is not proving.
- A refused re-authentication returns to the screen with the action untaken and says so. It is never a sign-out.

## `auth-active-account` The screen that acts names the account acting

A phone has no window title and no persistent chrome to keep an avatar in, so on a device carrying a work account and a personal one, the identity has to be on the screen where the action happens.

- Anything that posts, pays, sends, uploads or shares under an identity shows which identity in the surface that confirms it, before the tap and not in a settings screen two levels away.
- Switching accounts happens in one place and states what is changing.
- After a switch, nothing from the previous account remains on screen: cached lists, badges, avatars and the contents of the outgoing queue in `off-queue` all belong to the account that made them.

## `auth-signout` Nobody is signed out quietly

An app stays signed in for months, so an unasked-for sign-in screen reads as data loss. It is also the only privacy control many users have on a shared device, which is why it has to be findable.

- Sign out is a visible control in one place, and it happens because the user asked. An expired token, a failed refresh, a dropped connection and an app update are not sign-outs.
- Where the server genuinely refuses the session, the sign-in screen carries one sentence saying what happened. A bare sign-in screen with no explanation is the failure this rule exists for.
- The screen says what leaves the device before it leaves: unsent work is drained or named first, under `off-session`, and then the credential, the cached content, the downloads and that account's pending notifications go together.
- What survives is a decision rather than an accident. Device-level things stay, such as theme, language and the fact that onboarding was seen.
- Sign out is not account deletion. They never share a row, a color or an adjacent position, under `touch-destructive`.

## `auth-delete` Deletion has two routes, a scope and a date

The stores do not ask for the same shape and an app has to satisfy both: an in-app path to delete the account and its data, plus a web resource where the same request can be made. Shipping only the in-app path passes one store and fails the other. The web route is excused for an app that is permanently private and for one whose job is enterprise device management, so an app claiming any other excuse is guessing.

- Where the route sits is `onboard-account`: inside the app, in account settings, and not inside a policy or terms page, and the same rule revokes the federated tokens as part of the deletion.
- The web route is the same flow rather than a longer one. Its address is declared to Play in the data safety section, which is the store that asks for it; the App Store has no such field and asks instead that the in-app route be reachable rather than buried. A web route Play was never told about is a route that does not count.
- It deletes the account rather than deactivating it, and the confirmation screen says what is removed, what is kept, and under what obligation it is kept.
- Say how long it will take, and tell the person when it is done. Where deletion can be scheduled for later, immediate deletion is offered beside it.
- A subscription bought through a store keeps billing until it is cancelled there, and the deletion screen says so rather than letting the person discover it next month.
- The confirmation is a re-authentication under `auth-reauth`, not a checkbox.

## Check

Review answers each of these against the code, pointing at the line:

- Every route on the sign-in screen resolves to one account identifier through one call site, the platform credential entry point is one of them with a persistent control to reopen it on Android, both domain association files are configured for the passkey route, and the order is fixed rather than computed per visit. `auth-methods`
- Apple's button is the platform component wherever the stack can reach one and matches the published specification where it cannot, Google's is built to its specification with the mark unmodified, and both keep their hit area at the touch floor while the artwork keeps its own minimum and clear space. `auth-provider-button`
- Every provider sign-in that leaves the app opens in the system authentication session rather than a browsing surface or an app-owned web view, and returns through that session's own callback to the screen it started from. `auth-web-flow`
- The sign-in link is a claimed link that opens the app rather than a mail web view, the waiting screen is restored and finishes there, and the link is spent on the person's action rather than on a fetch. `auth-magic-link`
- The last successful method is stored per device and marked on return, naming the method and not the account. `auth-last-used`
- The code screen names the destination, restores itself after a trip to another app, and gates resend behind a visible countdown. `auth-code-screen`
- No prompt result is treated as a sign-in or as a factor, any check gating money or credentials requires the strong class, and the device credential path is guarded on API level 29 and below. `auth-biometric-session`
- Expiry produces one interruption over the current screen, the typed values and the scroll position survive it, and the lifetime is recorded once. `auth-expiry`
- Each sensitive action calls re-authentication, all of them read the same recorded window, no surface imitates the system prompt, and a refusal leaves the session intact. `auth-reauth`
- Every screen that acts under an identity displays that identity, and a switch clears the previous account's content, badges and queue. `auth-active-account`
- Sign out happens only on the user's request, states what it clears, drains unsent work first, and sits away from deletion. `auth-signout`
- Account deletion is reachable in-app, the web route's address is held as a recorded constant rather than a literal, and the screen states scope and timing and confirms through re-authentication. `auth-delete`

Five of these do not come out of a diff. Open the sign-in screen at the largest text size to see what is actually reachable without scrolling, background the code screen and come back to it, force a token to expire with a form half typed, read on a device which biometric class the prompt was granted rather than which constant was passed to it, and check in the Play console that the deletion URL declared there is the one the app ships.
