# Onboarding

The first run is the only session where the user has no reason to stay. The app was installed a minute ago, it is competing with everything else on that home screen, and deleting it costs one long press. Every screen between the icon and the first real action is a screen someone can quit on.

So the first run is designed as a sequence and measured as one: what the system draws before the app exists, what gets explained, what gets deferred, when identity is asked for, and what the user is finally standing on when it ends.

The shape of a permission request is `perm-rationale`. The screen a new account lands on is `state-empty`. The surface the system draws before any of this runs is `heuristics/splashscreen.md`.

## <Rule id="onboard-splash" evidence="device" description="A branded moment goes inside the app, never in front of it" />

If the product genuinely needs a branded frame, it belongs at the head of the first run, after launching has finished. This is a screen the app draws, so everything about it is the app's decision, and there is only one thing to decide well: how little of the user's time it takes.

- It is short enough that skipping it would not be a feature, and nothing the user came for is waiting behind it. A branded sequence played out before the content is reachable is the failure case in `motion-blocks`.
- It runs on the first run and not on later launches. A brand gate paid once is a decision; paid five times a day it is the slowest part of the product.

## <Rule id="onboard-screens" description="Three panels of explanation is the ceiling, and skip is on every one" />

Count the full-screen panels between launching and the first real screen. Three is the ceiling this file sets, no platform states a number, and zero is a legitimate answer for an app whose home screen explains itself.

- Each panel shows the product actually doing the thing. A drawing and a slogan is what a generated first run reaches for by default, which is why the three-dot pager of stock illustrations is the single most recognisable first-run shape there is. If a panel would work unchanged in a competitor's app, it is not carrying anything.
- Skip is visible on every panel, meets `touch-floor`, and lands on the app rather than on a sign-in screen.
- Skipping is permanent. The flow does not come back on the next launch, and it stays reachable from settings or help for whoever wants it later.
- A first run of more than one step says where the user is in it, through a pager or a progress indicator that cannot be mistaken for decoration or for something to tap. Someone who can see two steps left finishes them; someone counting an unmarked sequence quits. Where the steps are fields, `form-steps` owns the rest.
- The panels are content, so they reflow at the largest text setting rather than clipping the button off the bottom: `type-scaling`.

## <Rule id="onboard-in-place" description="A tour is what gets built when the interface does not explain itself" />

Nobody remembers a slideshow about an interface they have not used yet, and a phone has no hover to hang a hint on. Teach at the control, at the moment it first matters.

- One tip at a time, one or two sentences, pointing at something visible on the screen the user is already on.
- A feature that needs more than three actions explained is not a tip. It is a screen that needs redesigning.
- A tip is dismissible and never blocks the thing it describes. Coach marks that have to be tapped through in order are a tour with a spotlight on it.
- Do not teach the phone. Scrolling, tabs, back and the share sheet were understood before the app was installed.

## <Rule id="onboard-defer" description="Only what the first use needs happens before the first use" />

Sort the setup into two lists: what the app cannot start without, and what can be defaulted now or answered later. The second list is longer than it first looks, and everything on it that stays in the flow is a screen paying rent it does not earn. These screens are read one at a time on a device where the exit is a home swipe, and anything the first run downloads arrives on whatever data the user is standing in.

- Ship a working default instead of asking, which is `set-default-first`.
- No rating prompt and no purchase ask before the user has seen the product work.
- The first run does not wait on a download. Content packs, models and offline data arrive in the background while the app is already usable.
- Terms and licensing are not one of the three panels. Where consent is legally required it is one line with a link at the point it applies, not a wall to scroll to the bottom of.

## <Rule id="onboard-ask-order" description="A permission dialog during the first run is the exception, and it costs a screen" />

Both platforms want the ask attached to the feature, and the system gives the app roughly one chance per permission. What the explanation says is `perm-rationale` and `perm-purpose-string`. What this rule owns is when it happens, and what the one screen allowed in front of a first-run dialog is shaped like.

- Count the system dialogs raised between the app icon and the first real screen. The answer is zero, unless the resource is required for the app to function, in which case it is one, with its explanation in front of it.
- The notification prompt is not that dialog. It attaches to the moment the user makes something worth being told about, which is after the first real screen by definition: `perm-notify-ask`.
- The one explanation screen this rule puts in front of a first-run dialog has a single button, worded under `copy-rationale`, and no exit that skips the alert. A decline control sitting there is a rehearsal for dismissing the system alert behind it.
- A refusal reaches the reduced app that `state-permission` defines, not a wall and not a retry: `perm-no-coercion`.

## <Rule id="onboard-look-first" description="Let them look before they sign up" />

The account screen is the most expensive screen in the app: it arrives before anything has been earned, it needs a keyboard on a device that is bad at typing, and uninstalling is one tap away.

- An account is required only where the core job needs an identity: syncing, paying, posting, or anything involving another person. Reading, browsing, searching and trying are not on that list, and a store requires access without a login where they are the app.
- The ask attaches to the moment: sign in at the save, at the checkout, at the post. In a shop the account comes after the purchase, not before the catalogue.
- Whatever was made before signing in is still there afterwards. Losing the first note to the sign-up is the last thing that app ever gets to do.
- The sign-in screen says in one sentence why the account exists and what it gets them. "Sign in to continue" is not that sentence.

## <Rule id="onboard-account" description="Offering account creation signs the app up for the rest of it" />

- Deleting the account happens inside the app, and the route to it is findable rather than buried in a policy page. Where a social or federated login is offered, disconnecting it is in the app too, and deleting the account revokes the tokens that login issued. This is a store requirement, not a courtesy.
- The App Store requires that a third-party or social login not be the only option: an equivalent has to sit beside it that takes only a name and an email address, lets that address stay private, and does not collect in-app behaviour for advertising. That requirement lifts for an app whose users sign in with an existing enterprise or education account, for a government or industry-backed citizen ID, and for a client whose whole job is one named third-party service the user signs into to reach their own content.
- Get there through the platform's own credential UI rather than a hand-built form: Sign in with Apple and passkeys on iOS, Credential Manager on Android, which puts passkeys, saved passwords and federated accounts behind one entry point. What appears first on that screen is `form-autofill`. Neither platform wants an invented authentication scheme, and password-only is below the floor on both.
- The two platforms want different arrangements and both are satisfiable: on iOS the Sign in with Apple button is no smaller than any other sign-in button on the screen and is visible without scrolling to it; on Android one button opens the system sheet and the providers live inside it.
- Collect the minimum at creation. Anything else is asked later, marked optional, and refusing it locks no feature.
- Recovery is on the screen, not behind a support address. A password or a device is going to be lost.
- Someone who already has an account and is setting up a new phone arrives signed in and past the first run: Restore Credentials through Credential Manager on Android, the platform credential store on iOS. Making an existing user re-authenticate by hand on a new device is the same defect as showing them the first run twice on the old one.

## <Rule id="onboard-first-action" evidence="device" description="The first run ends on the product's own action" />

Run it on a device from a clean install and count the taps between the icon and something real. That count is a design decision somebody makes on purpose or inherits by accident, and every screen this file argues about is one line of it.

- Real means the product's action, not the app's: a note written, a track played, a receipt scanned. Finishing the tour is not an action.
- Where the law puts a gate in front of that, identity or age verification, the gate is named as one and designed as one. It is not onboarding to be trimmed, and it is the one thing `onboard-defer` cannot defer.
- A first run that completes into a blank home screen has failed with a perfect completion rate. That landing screen is the first-use empty from `state-empty`.

## <Rule id="onboard-resume" evidence="device" description="A killed process resumes the step, never the flow" />

The system reclaims backgrounded apps without asking, and a setup flow is exactly where a user leaves to fetch a code from another app.

- Persist the step as it completes, not a single flag at the end. Coming back to panel one after finishing panel three is how a half finished setup turns into an uninstall.
- The done flag is written the moment the flow is completed or skipped, and it is read before anything is drawn, so nobody sees the first run twice.
- Where the user lands is `nav-restore`, what they typed is `form-persist`, and the save points are `state-interrupt`. What this rule owns is the step index and the flag.
- A notification or a link can arrive before the first run has ever happened. That path opens its destination without replaying the flow: `nav-deeplink`.

## Check

Review answers each of these against the code, pointing at the line:

- Any branded frame sits after launching, is brief, blocks nothing, and does not run on later launches. `onboard-splash`
- Three or fewer explanation panels, each showing the real product, with skip on every one, skip permanent, progress shown wherever there is more than one step, and the flow findable afterwards. `onboard-screens`
- Teaching happens at the control it applies to, one tip at a time, dismissible, never blocking, and nothing explains the phone. `onboard-in-place`
- Every setup step left in the flow is one the app cannot start without; the rest have defaults, and no rating, purchase, download or licensing wall sits in the path. `onboard-defer`
- Zero system permission dialogs before the first real screen, or exactly one for a resource the app cannot function without, behind a single-button explanation screen, with a refusal reaching the reduced app. `onboard-ask-order`
- The app can be used before an account exists, the sign-in attaches to the feature that needs it, work made beforehand survives it, and the screen says why. `onboard-look-first`
- Account deletion and social disconnection are both reachable in the app, any social login has an equivalent beside it or falls under a named exemption, credentials go through the platform's own UI, a new device restores the session, and only required data is collected at creation. `onboard-account`
- The first run ends on the product's own action rather than a blank screen, with any legal gate named as one. `onboard-first-action`
- The step is persisted as it completes and the done flag is read before the first draw, so a process kill resumes the step and a second launch shows nothing. `onboard-resume`

`onboard-splash`, `onboard-first-action` and `onboard-resume` are answered from a clean install on a device, in both appearances, with the process killed mid flow the way the system would kill it. None of them can be settled by reading the router, because a flow that is correct in the file is exactly the one that starts over from panel one.
