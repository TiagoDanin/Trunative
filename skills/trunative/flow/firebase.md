# Firebase

Loaded by `flow/build.md`, never as a step of its own, whenever the screen touches auth, Firestore, Storage, Messaging, Remote Config or Crashlytics.

It exists because Firebase decides things this skill already has rules about. Offline persistence changes what an honest loading state is. Local writes come back before the server has seen them, so what the screen shows is a claim rather than a fact. An agent that wires it up without knowing that produces screens the heuristics then have to fight.

Two lines of scope, said once rather than left to silence:

- Security rules, indexes, quotas and billing are not design. This skill does not review them, and a screen that looks right over rules that let anyone read the collection is still the project's problem to fix.
- Mobile web is out. The JavaScript SDK is a different product with different offline behaviour, and a project on `web` uses this file for nothing but the auth gate below.

## 1. Auth is a navigation gate with three states

The signed-out and signed-in pair is the one everybody builds. The third is **restoring**: the moment between launch and the SDK answering from its own persisted session. It is not a loading spinner over the app, it is a state the router has to name.

- The first frame while the session resolves is the launch surface handing over, not a screen that flashes and replaces itself. That is `splash-first-frame` and `splash-entry`.
- Each of the three states lands somewhere written down, and the signed-in landing is the product's own screen rather than a home that then redirects. `nav-restore` and `onboard-first-action`.
- The restoring state is short and bounded, so nothing in it measures anything (`splash-no-progress`), and a session that fails to restore is a signed-out user rather than an error screen.
- A route guard that runs before the session resolves sends a signed-in user to the sign-in screen for one frame. That frame is the defect.

## 2. Sign in methods

The order, the provider buttons and the account the routes resolve to are `auth-methods` and `auth-provider-button`. The web flow leaving the app is `auth-web-flow`. The OTP screen, its autofill and its error recovery are `auth-code-screen` plus `form-autofill` and `form-error`.

What belongs here rather than there: Firebase returns one user object from every provider, so two routes that reach the same person must reach the same uid. Linking a credential to the current user rather than signing in again is what makes that true, and it is the step that gets skipped.

## 3. Firestore persistence is on, so the honest state is queued

Offline persistence is enabled by default on the mobile SDKs. A write goes into the local store, the listener fires immediately, and the server sees it later.

- A screen waiting on a server that was never needed is a defect, not a loading state. Read the local snapshot and render.
- The state for an unconfirmed write is pending, not done and not failed. That is `state-queued`, and the snapshot's own pending-writes flag is where it comes from.
- Cached content carries its age (`state-stale`), and the snapshot's from-cache flag is the source of that mark.
- The network being off is not an error class here. `state-offline` names four states and this is the cached one.

## 4. Latency compensation makes optimistic UI the default

The local write returns before the round trip, so the screen is already optimistic whether or not anyone decided it. Two consequences:

- The rollback path is the one that gets skipped. A write the server finally rejects has to undo what the screen already showed, keep what the user typed, and say what happened without blaming them: `state-retry` and `copy-error`.
- A rejection can arrive minutes later, on another screen. It lands in the quietest vehicle that still reaches the user (`fb-ladder`), attached to the item rather than to wherever they happen to be.

## 5. Storage uploads outlive the screen

Progress counted in real bytes, a resume handle that survives the process, and a transfer that does not die with the screen are `net-upload` and `off-queue`. The photo still going up is a row with its space reserved (`list-images`), not a blocking dialog.

## 6. Messaging and the push permission

The system prompt is one tap and it is spent forever. Everything about when to ask, what the screen before it says and what the denied path does is `perm-notify-ask`, `perm-rationale` and `perm-answers`. The in-app equivalent for someone who said no is `notify-inapp`.

Firebase-specific: the token is per install and it rotates. Nothing in the interface promises delivery, and a screen that says notifications are on because a token exists is reporting the wrong fact.

## 7. Remote Config arrives after the first frame

The screen has to be correct before any value lands, which means shipped defaults rather than empty strings, and no layout that shifts when the fetch returns.

- Defaults are set in code and the screen renders from them. A paywall whose price appears a second late is `pay-price-source` and `icon-reserve` at once.
- A value that changes what the user is looking at waits for the next screen rather than rewriting the current one.

## 8. Crashlytics and Analytics, the part that is design

- Screen names match the flow the user walks, so the funnel and the navigation graph are the same thing.
- Nothing the user typed leaves the device in an event, a log or a crash report. That is `priv-instrument`, and it is the rule an analytics call breaks fastest.
- What the store declaration says has to match what the SDKs actually collect: `priv-declared`.

## 9. Setup

Only commands and file paths live here. Every design consequence above applies whatever the stack is.

**Flutter**

Add the plugins with `flutterfire configure`, which writes `lib/firebase_options.dart` and both native config files. Initialise with `Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform)` before `runApp`, and keep that off the launch path beyond what the first screen draws (`perf-cold-start`). Persistence is on by default; the settings object is `FirebaseFirestore.instance.settings`.

**React Native**

Install `@react-native-firebase/app` plus one package per product. Put `GoogleService-Info.plist` in the iOS target and `google-services.json` in `android/app/`, then apply the `com.google.gms.google-services` plugin in the app-level Gradle file. The modular API is the current one; the namespaced calls are deprecated. Expo needs a development build and the config plugin rather than Expo Go.

**SwiftUI**

Add the Firebase SDK through Swift Package Manager, put `GoogleService-Info.plist` in the app target, and call `FirebaseApp.configure()` in the `App` initialiser or an `AppDelegate` adaptor. Persistence is on by default.

**Jetpack Compose**

Add the Google services plugin and the Firebase BoM to Gradle, put `google-services.json` in `app/`, and let the content provider initialise Firebase rather than calling it from `Application.onCreate`. Persistence is on by default.

## What review scores this against

This file adds no rules. It says what Firebase does to the screen, and review scores the result against the rules that already exist:

| What Firebase decided | Scored as |
|---|---|
| The restoring state and where each of the three lands | `state-set`, `nav-restore`, `splash-first-frame` |
| One uid behind every route on the sign-in screen | `auth-methods` |
| Reading the local store instead of waiting on the server | `off-local-first`, `state-loading` |
| The pending-writes flag drawn as pending, the cache flag as age | `state-queued`, `state-stale` |
| The rejection that arrives after the screen already showed the write | `state-retry`, `copy-error`, `fb-ladder` |
| The upload that outlives the screen | `net-upload`, `off-queue` |
| The push prompt and the denied path | `perm-notify-ask`, `perm-rationale`, `notify-inapp` |
| Shipped Remote Config defaults and a screen that does not shift | `pay-price-source`, `icon-reserve` |
| Screen names, and nothing typed leaving the device | `priv-instrument`, `priv-declared` |

Two of them are answered on a device rather than in the router, and both pass on a warm app with a fast connection, which is the only condition the code was written against. Cold start with a stored session and watch the first two frames, then turn the network off, make a write, and look at what the row says while the server has not seen it.
