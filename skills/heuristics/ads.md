# Ads

Advertising is the one part of a mobile interface designed against the person holding the phone, so most of what governs it is store policy rather than taste. Breaking a rule here is a rejection, a takedown or a suspended ad account, not a critique.

A phone hands an ad the whole screen and hands the user one thumb. There is no window frame saying where the app stops and the ad starts, no hover before a tap commits, and every pixel a banner takes is a pixel the content does not get. The rules below all follow from those three facts.

An app that carries no ad SDK skips this file. An app that carries one reads all of it, because a single ad unit brings the whole policy surface with it. It starts with the store data declaration: the dependency collects on its own account, so the diff that adds it is the diff that leaves the filing stale, which is `priv-declared`.

## `ads-labelled` An ad says it is an ad, and never wears the app's clothes

Both stores require this. Apple's display advertising rule says an ad that interrupts or blocks must clearly indicate that it is an ad and must not manipulate or trick users into tapping it. Play's ads policy bans ads that simulate or impersonate the interface of any app feature, notifications included, and requires that it be clear which app is serving each ad.

- On a phone the ad takes the same full-bleed surface every real screen takes, so the container edge is the only thing marking that ownership changed. This skill's implementation of the requirement follows from that: the label lives on the container and is drawn by the app, the plain word, in the app's own type, legible rather than the smallest grey on the screen. Neither store dictates who draws it; drawing it yourself is what makes it survive a creative that would rather it did not.
- A native unit borrows the row's layout, never its meaning. Styled as a feed item, a search result, a chat message or a system alert, it is the pattern the policies exist to stop.
- Nothing dressed as a permission prompt, a notification, a download control or a piece of navigation, and nothing the app draws itself pointing at the unit: an arrow, a badge, a count, a caption suggesting a tap.

## `ads-close` The close control is visible in the first frame and sized like a target

Apple requires any interrupting ad to provide easily accessible and visible close or skip buttons, large enough to dismiss with ease, and attaches no delay to that anywhere. Play requires ads that interfere with normal use to be easily dismissible without penalty, and only forbids a full-screen interstitial still uncloseable after 15 seconds, dropping to 5 seconds where the app declares a child target audience. Those permissions do not overlap, so build the strict one: an exit present from the first frame.

- Where the app draws the surface (a house banner, a sponsored card, an offer), the close control is yours and it takes the platform floor from `touch-floor`. A small X in the corner of a creative is the target that gets missed, and the miss is a click on the ad.
- Where the SDK draws it, the choice of format and its close configuration is still yours. Run each format on a real device and watch for the frame the control appears in, because some defaults hold the user longer than the strict rule allows.
- Play states that ads must not interfere with the operation of the device, system or device buttons included. The back gesture keeps working while the ad is up, and it is never the only way out.

## `ads-placement` The full screen ad marks the end of something, never the start of it

Play forbids full-screen interstitials that appear unexpectedly, typically when the user has chosen to do something else, and forbids them at the beginning of a level or content segment. Google's own SDK guidance points at the pause between levels. Both are satisfied only when the ad closes the segment the user just finished instead of standing in front of the next one.

Where it may not go:

- **Launch.** Play bans a full-screen video interstitial before the app's launch surface, and AdMob's placement policy bans interstitials on app load and on exit outright. That ban is about interstitials. The dedicated app-open format is a different product with its own rules, and this file does not settle it: a team using one answers it from that network's own guidance rather than from this bullet. What may hold the launch is `splash-hold`.
- **Inside a task.** A form being filled, a payment, a message being sent, a video playing. This is where a mis-tap is worth the most, and AdMob names exactly these: a game being played, a form being filled, content being read.
- **On back.** Returning to a previous screen is navigation, not a break in attention.
- **Immediately after another interstitial the user just closed.**
- **Anywhere but this app.** Apple keeps display advertising in the main app binary and out of extensions, App Clips, widgets, notifications, keyboards and watch apps. Play allows an ad only inside the app serving it and names overlays, companion functionality and widgetised ad units as things it may not become.

The result is a surface the user did not open. It is not a modal in the sense `nav-modal` means: there is no work to keep, no commit verb to name, and the single exit `ads-close` requires is the whole of it. What does transfer is the system back event, which behaves as `nav-back` describes, and containment plus the return of focus, which is `a11y-focus`.

The segment boundary above is the only thing that buys the full screen. Everything else about a surface nobody asked for is `fb-unprompted`, which names this placement as its one exception and keeps the rest: the dismissal remembered for a written period, the plain close rather than a trick one, and the shapes an app may not borrow.

## `ads-frequency` The cap is a number in the code, not whatever the network sends

Neither store publishes a frequency figure. AdMob does, as a ceiling on its own publishers: no more than one interstitial after every two user actions. This skill borrows that number as the default wherever the network in use publishes none of its own. Treat it as the maximum and pick something lower.

Enforce it at the call site rather than in the mediation dashboard, which changes without a build and is not in the diff. And remember what a session is here: minutes long, interrupted constantly (`state-interrupt`). A counter that resets on every resume is not a cap, so the interval is wall clock time as well as a count.

## `ads-reserve` The slot is the right size before the ad exists

An ad comes over the network, so it arrives late, after the reading has started and the thumb is already moving. A container that grows when it fills shoves everything below it and the tap lands on whatever slid into place. Reserve the declared ad size as a fixed height, the same way `icon-reserve` reserves a picture's box. Where the format sizes itself from the device width, the height is available before the request is sent: ask for it and reserve that, rather than letting the container find out on fill.

- Decide the no-fill state in advance: keep the space or collapse it, once, not on every refresh. A banner that vanishes and returns on rotation is layout shift on a schedule.
- A pinned banner shortens the scroll rather than floating over its last row, `layout-chrome`.
- It also comes out of the first screenful, `layout-fold`. The content budget pays for the banner; the banner does not arrive from somewhere else.

## `ads-adjacency` Nothing the user aims at shares an edge with an ad

AdMob's placement policy says an ad may not be placed so that it interferes with navigating or interacting with the app's core content and functionality, and Play's families policy names ads that suddenly appear in areas of the app where the user usually taps for another function. A mis-tap here earns money, and Apple bans both halves of that trade: artificially increasing impressions or click-throughs, and apps designed predominantly to display ads.

- `touch-spacing` puts 8dp between two of the app's own targets. An ad edge is worth more, because the mis-tap pays: leave at least 16dp between the ad container and the nearest control, and 24dp where that control is the screen's primary action.
- The bottom third is where the thumb lands (`touch-reach`) and where the tab bar, the primary button and the banner all want to sit. At least one of the three moves.
- No ad on a screen that exists for one decision: a confirmation, a payment, a permission rationale, anything destructive.

## `ads-rewarded` The trade is stated before it starts, and the reward survives the process

A rewarded ad is one of the two places an ad may interrupt honestly. The other is the end of a segment the user just finished (`ads-placement`); this one qualifies because the user chose it. Tapping the offer is the consent, so the offer has to be complete: what they get, and roughly how long it takes.

- Persist the grant on the reward callback, before drawing anything. Google guarantees its own reward callback fires before its dismissal callback; no other network promises that, and a mediation adapter is where the promise goes. So the instruction has to hold without it: grant on the reward callback wherever the SDK raises one, and never on dismissal. The process can be killed while a full-screen ad is up, and the user who watched it is owed the reward either way.
- What is bought is always an extra. Play states that an app cannot force a user to click an ad, or submit personal information for advertising, before they can fully use it, so the app's own function never sits behind an ad.
- No dead ends. Declining the offer returns to the screen it was made on, and the exit rules in `ads-close` apply to the rewarded unit exactly as they apply to any other full-screen ad.

## `ads-consent` The consent state is read when the request is built, and the no path is the normal one

- **iOS.** An ad SDK that links this app's data to what other companies collected needs the tracking permission and `NSUserTrackingUsageDescription` in the property list; without that key, the app can crash the first time a user opens it. Whether the prompt is owed at all, and how it is introduced, is `perm-tracking`.
- **Android.** Declare `com.google.android.gms.permission.AD_ID` when targeting Android 13 or above. It is not `androidx.ads.identifier.provider.HIGH_PRIORITY`, which is the provider side of the same feature and belongs to nobody shipping an app. Ask for the ID fresh on every request instead of caching it, and expect a string of zeros from anyone who opted out or deleted theirs.
- The advertising ID is for advertising and user analytics and nothing else. Play states that outright, so it does not become a device key, a login hint or a join across other data the app holds.
- Build the request so the non-personalised answer is the default and consent upgrades it. An ad stack that only serves after a yes turns a legitimate refusal into a broken screen.
- Read the state at request time. Play requires the opt out of interest-based advertising or ads personalisation setting to be verified, and a value captured at launch is stale the moment someone changes it in system settings and comes back.
- Some signals are barred from targeting whatever the answer was. Apple names health and medical data, school and classroom data, and anything from children. Nothing in those categories reaches an ad request, which is a question about what the app passes to the SDK, not about the consent flag.

## `ads-report` The user can see why this ad reached them, and report it, without leaving the app

Apple requires both halves: all the information used to target an ad has to be visible without leaving the app, and the app has to include a way to report an inappropriate or age-inappropriate ad. Where a unit ships an affordance, open it and watch where it lands, because one that opens a browser is the failure rather than the pass, and check it renders and responds on the smallest supported screen at the largest text size. Where a format has none, the app supplies the route itself, next to the reporting path in `set-diagnostics`.

Apple also requires the served creatives to suit the app's own age rating. That is a setting on the ad unit, not a property of the ad stack: put the content rating ceiling on the unit rather than leaving it at whatever the network defaults to, which is how a 12+ app ends up carrying 17+ creatives. The child audience case is a harder fork, `ads-children`.

## `ads-a11y` Someone using a screen reader has to be able to get out

Third-party creative is content nobody on the team wrote and nobody can relabel, so the app owns the frame around it.

- The close control is a real control with a name (`a11y-name`). A full-screen ad is a presented surface, so it takes containment from `a11y-focus` exactly as a sheet does: focus moves into the ad and cannot walk the screen underneath, the close control is reachable from inside it, and focus returns where it was on dismissal. That is the containment move `a11y-focus` already describes, not a new one.
- The container announces itself as an ad, and the creative under it is one stop rather than a walk through every element inside it.
- Drive one interstitial and one banner with the reader on before shipping, as `a11y-test` requires of any flow.

## `ads-cost` The ad stack is paid for in launch time, memory and the user's data

- Initialising an ad SDK is not launch work. Keep it off the path to the first frame, `perf-cold-start`.
- The Google Mobile Ads SDK treats a preloaded ad as stale after an hour, and endorses a cache of them cleared and reloaded on that hour. This rule overrides that: hold one at a time, because a pool of full-screen creatives is the largest thing the app keeps for nothing, and `perf-memory` is what the phone kills the app over.
- Video creatives are the heaviest thing the app fetches and nobody asked for them. Do not prefetch them on a metered connection, `net-metered`.
- Each SDK is download size the user sees before any of the design does, `perf-size`, and mediation adds one per network.

## `ads-children` A child audience declaration forks the ad design per store

Neither store binds on who is observed using the app. It binds on what the app declared: submission to Apple's Kids Category, and a child or mixed target audience declared on Play. An app children use that made neither declaration is not under these rules, and one that made them is, whoever ends up holding the phone.

Apple's Kids Category rule keeps third-party advertising out altogether, with a narrow exception for contextual services that publicly document their practices for that category and put human review on the creatives. Play's families policy allows ads and constrains them instead: certified ads SDKs only, no interest-based advertising or remarketing, no interstitial immediately on app launch, nothing uncloseable after 5 seconds including rewarded and opt-in formats, one banner or video per page, and no offerwall or immersive format that is not clearly distinguishable from app content.

No single configuration satisfies both. Decide from `PRODUCT.md` whether the app makes either declaration, and where it does, record the per-store ad configuration in `STACK.md` before any unit is added.

## Check

Review answers each of these against the code, pointing at the line:

- Every ad container carries a visible label drawn by the app, and no unit is styled as a feed row, a system alert, navigation or a download control. `ads-labelled`
- Every ad the app can show has an exit present in its first frame, meeting the platform touch floor, with the back gesture still working. `ads-close`
- No interstitial call site sits at launch, on exit, on back, inside a task or at the start of a segment, and no ad unit is built outside the app itself, in an extension, a widget, a notification, a keyboard or a watch app. `ads-placement`
- A frequency cap with a written number and a time interval is enforced in code, not in the mediation config. `ads-frequency`
- Every ad slot reserves its declared size before it fills, has a decided no-fill state, and shortens the scroll rather than covering it. `ads-reserve`
- At least 16dp separates every ad container from the nearest control and 24dp from a primary action, and screens that exist for one decision carry no ad at all. `ads-adjacency`
- A rewarded offer states what is traded, grants on the reward callback and persists it, and nothing the app is for sits behind an ad. `ads-rewarded`
- The consent state is read at request time, the non-personalised request is the default path, `NSUserTrackingUsageDescription` is in the property list and `com.google.android.gms.permission.AD_ID` is declared where the build targets Android 13 or above, and no health, classroom or child data reaches a request. `ads-consent`
- Targeting information and an ad report route are both reachable without leaving the app, and the unit carries a content rating ceiling matching the app's own age rating; a codebase that ships only to Android answers this not applicable. `ads-report`
- The close control has a name, the ad contains focus and returns it on dismissal, and the creative is a single stop for the reader. `ads-a11y`
- Ad SDK initialisation is off the cold start path, the preload pool is one, and video is not prefetched on a metered connection. `ads-cost`
- Where the app is submitted to the Kids Category or declares a child target audience, the ad configuration is per store and written into `STACK.md`. `ads-children`

Four of these are only half answerable from a diff, because the SDK draws what the file cannot show. On a device, run every ad format the app can serve and watch which frame the close control appears in (`ads-close`), open the targeting and report affordances and confirm they stayed inside the app at the largest text size on the smallest supported screen (`ads-report`), drive one interstitial and one banner with the screen reader on (`ads-a11y`), and measure the distance from the rendered ad container to its nearest control (`ads-adjacency`). A call site is where the rest of the file is checked; these four are settled on the running screen.
