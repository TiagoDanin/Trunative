# Firebase

Loaded by `flow/build.md`, never as a step of its own, whenever the screen touches auth, Firestore, Storage, Messaging, Remote Config, A/B Testing, In-App Messaging or Crashlytics, or sells something on a project that uses Firebase.

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
- A purchase event is logged from the transaction the store confirmed, never from the tap on the button. A tap counted as a sale inflates conversion and hides the pending outcome that `pay-outcome` requires, and it is the event every paywall test is judged on. It carries the placement and the variant that sold it.

## 9. Selling without another service

A paywall needs four things besides the store: a way to choose what it shows, a way to test that choice, a record of who has paid, and messages around a trial. Firebase carries all four.

- **What shows where.** Each moment that can sell has a stable placement name, and a Remote Config parameter per placement holds the store product ids, the copy keys and the layout variant. Conditions on that parameter target by country, platform, app version or a user property. Remote Config chooses products, never prices: the amount is read from the store's product object (`pay-price-source`), and a parameter holding a price string is a constant that ships later.
- **Testing it.** An A/B Testing experiment on that parameter splits the audience, keeps a control group as the holdout, and is judged on the purchase event above rather than on taps. The variant is fixed when the paywall opens and does not change while it is on screen (section 7).
- **Who has paid.** The entitlement lives in Firestore and is written only by a Cloud Function that receives the stores' server notifications (App Store Server Notifications, Real-time developer notifications from Play) and verifies the transaction. The client never writes it. Read from the persisted cache, it is the last known state that `ads-entitlement` requires on a cold start with no network, and it is what `sub-restore` finds again on a new device.
- **Around a trial.** The same notifications carry the trial's end and an auto renew switched off. A function schedules the reminder `sub-trial-end` promises from that date and sends it through Cloud Messaging only to a token whose owner allowed notifications, or by email; a renewal switched off queues the single save offer for the next open.

## 10. In-App Messaging is a surface nobody asked for

A campaign that opens on launch or on an analytics event is an unprompted surface the moment it appears.

- It answers to `fb-unprompted`: dismissal remembered, a plain close, and never over a task in progress.
- A message promoting another product, a sale or a partner is a house ad under `ads-labelled`, and on launch it is the placement `ads-placement` forbids for an interstitial.
- A campaign that opens the paywall is a placement like any other, and the paywall it opens answers to the whole `sub-` prefix.

## 11. Setup

Only commands and file paths live here. Every design consequence above applies whatever the stack is.

Add the plugins with `flutterfire configure`, which writes `lib/firebase_options.dart` and both native config files. Initialise with `Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform)` before `runApp`, and keep that off the launch path beyond what the first screen draws (`perf-cold-start`). Persistence is on by default; the settings object is `FirebaseFirestore.instance.settings`.

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
| Purchases counted from the confirmed transaction, with placement and variant | `pay-outcome` |
| Paywall products chosen by Remote Config, prices from the store, variant fixed while open | `pay-price-source`, `sub-billed-first` |
| The entitlement written by the server and read from the cache | `ads-entitlement`, `sub-restore` |
| Trial reminders scheduled from the store's dates and sent only where allowed | `sub-trial-end`, `perm-notify-ask`, `notify-earns-it` |
| In-App Messaging campaigns | `fb-unprompted`, `ads-labelled`, `ads-placement` |

Two of them are answered on a device rather than in the router, and both pass on a warm app with a fast connection, which is the only condition the code was written against. Cold start with a stored session and watch the first two frames, then turn the network off, make a write, and look at what the row says while the server has not seen it.
