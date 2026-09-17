# Maps

A map fills the phone's whole screen and takes the drag with it. It is also the least readable surface an app can ship: a canvas of tiles with pins on it carries nothing to a screen reader, nothing in direct sunlight, and nothing to somebody glancing down while walking. And it arrives with a contract, because every major provider requires its own credit on the tiles and most of them bill for the tiles themselves.

Here: the map surface and its gestures, the initial camera, markers and clusters, following the user, the route as text, tiles that did not arrive, the cost of holding a map, attribution, and the equivalent representation that has to exist beside it. The location ask is `perm-scope` and `perm-rationale`, the uncertainty circle drawn around the user is `sense-accuracy`, location switched off above the app is `sense-off-system`, a follow that keeps running once the user has left is `bg-location`, and how the result list beside the map reads is `list-a11y`. A map drawn by a web page inside the app takes `webview-surface-choice` for the surface it sits in and every rule below for what is on it.

## `map-camera` The first frame is a decision: framed on the content, padded for the chrome, and bounded

One screenful and no second pane. A map that opens on the whole world is an ocean to pinch out of with one thumb, and a map that opens centred behind a sheet has spent its only screenful on a region nobody can see.

- Set the initial camera explicitly. An unset camera is a real state rather than a safe default: on Android the camera option is nullable and falls back to a position nobody picked.
- Frame the smallest region that holds the content the screen is about, and pass the padding for everything drawn over the map so the frame lands inside the part that is visible. The calls are `newLatLngBounds(bounds, padding)` on Android, `setVisibleMapRect(_:edgePadding:animated:)` on Apple, and `MapCameraPosition.automatic` in SwiftUI, which frames the map's content for you.
- The published zoom-to-detail steps on Android are 1 world, 5 continent, 10 city, 15 streets, 20 buildings. Pick the one that matches the question being asked, and expect the permitted range to vary with target, map type and screen size.
- A map the user is not meant to leave carries a pan bound or a minimum zoom, so one hard swipe does not lose the venue off the edge.
- Where no location has resolved yet, the fallback camera is written down rather than left at zero, which is a coordinate in the ocean.

## `map-gesture-owner` Where a map sits inside a scrolling parent, one drag has one owner and the code names it

One finger, one drag, and the map takes the full width, so no margin is left for the thumb to scroll the page by. Map gestures ship enabled, scroll and rotate included, so nothing yields on its own and the content under the map becomes unreachable.

- `scroll-nest` owns the same-axis handoff in general. What is map-specific is that the map view does not join the nested-scroll chain, so the parent is told to stop intercepting: `requestDisallowInterceptTouchEvent(true)` in the Android view system and through the `AndroidView` interop in Compose.
- The map side, one line per stack: `MapInteractionModes` in SwiftUI, with `pan`, `zoom`, `pitch`, `rotate` and no interaction at all from an empty set; `gestureRecognizers` on Flutter's `GoogleMap`; `scrollEnabled`, `zoomEnabled`, `rotateEnabled` and `pitchEnabled` in React Native; and `gestureHandling` on mobile web, whose cooperative value scrolls the page on one finger and pans the map on two.
- Where the map is not the point of the screen, it is a picture. A lite-mode map or a static image still carries markers, a tap and the my-location layer with no pan and no zoom, and that is the answer for a map inside a stream.

## `map-marker-target` A marker is a control, and where geography will not let it be big enough the escape is another route to the same place

A fingertip leaves a 16 to 20mm oval and a thumb pad leaves more, while a pin is drawn at a coordinate that cannot be nudged to make room. This is the one surface where the target floor and the content genuinely conflict: two places 30 metres apart sit under one fingertip at street zoom, whatever size the pins are drawn.

- The conflict is in the spacing between pins, not in the drawing. Every marker's hit area reaches the floor in `touch-floor` wherever its neighbours leave the room for it, and no marker is drawn larger than the area that answers a tap.
- Where they do collide, the escape is the same place reachable from a list (`map-not-alone`).
- The default marker tap is not inert. On Android it moves the camera and opens an info window unless the handler returns true, and the map toolbar, on by default, offers to open the place or its directions in the Google Maps app. Leaving the app on a marker tap is a decision to make, not a default to inherit.
- A text glyph on a pin is 2 or 3 characters. More than that is unreadable at pin size.
- Marker and cluster controls carry a name and a role (`a11y-name`), and a decorative overlay is hidden rather than walked (`a11y-hidden`).

## `map-cluster` Neither platform clusters by itself, so hundreds of markers stay one blob until something is written

The screen is 320 to 440dp wide, so a set that separates cleanly on a wide map collapses into a single shape here, and every marker is a live view on a device already spending its frame budget drawing tiles (`perf-frame`).

- Opt in. MapKit clusters only where a clustering identifier is set, and that is nil by default. Android has no clustering in the map SDK at all: it takes the separate utility library, wired by pointing the camera-idle and marker-click listeners at a cluster manager.
- That library's defaults are the numbers to start from: 4 markers minimum per cluster, 100dp collision distance, and cluster labels bucketed at 10, 20, 50, 100, 200, 500 and 1000.
- A cluster prints its count, and tapping one ends somewhere a person can act: a tighter camera, or the list of what is inside it. A cluster that zooms one step and re-clusters forever is a dead end. The alternative to clustering is a declared overlap policy rather than luck, and Android's advanced markers choose between required, required and hides optional, and optional and hides lower priority.

## `map-not-alone` The map is never the only representation, because a canvas of tiles reads as two words

A screen reader gets nothing from tiles. The Android default announcement for the entire map surface is the two words "Google Map", and a marker carries nothing but the content description set on `MarkerOptions.contentDescription`, which is unset by default. The phone shows one thing at a time, so there is no side panel where the equivalent already sits: it has to be a route somebody can reach.

- The map view carries an accessibility label of its own, a content description on Android and a Semantics label in Flutter, naming what it is showing and how much is on it rather than the provider's default string. Every marker built in code carries one too, because the provider sets none.
- Every place, route, area and count on the map is reachable as text inside the same flow: a list, a step list, a place card. How well that list reads is `list-a11y` and `a11y-collection`. What this rule owns is that it exists and is one step away.
- Nothing on the map means anything by hue alone (`color-not-alone`), and no map interaction is gesture-only (`a11y-gesture`).
- That same list is the escape `map-marker-target` leans on and the surface `map-offline` still has when the tiles do not arrive. One list answers three rules, which is why it is not optional.

## `map-follow` Following the user is a mode with a visible state, a way out, and a bill

A camera locked to a moving position fights the thumb: every drag is undone by the next fix. It also runs the radio and holds the display for as long as it is on, the two most expensive things a phone does, while the person holding it is walking or driving.

- Following is a state the screen shows, on a stock control: `MKUserTrackingButton` or SwiftUI's `MapUserLocationButton` on Apple, the my-location button on Android. Apple ships three modes, none, follow, and follow with heading; Android ships only a one-shot recenter, so on Android the mode and its exit are written by the app.
- A pan by the user ends the follow instead of being snapped back. Apple resets the camera to positioned-by-user for you. Everywhere else it is a line somebody writes.
- Turning it off stops the location updates, not only the camera. A follow left running behind a still map is the whole battery cost with none of the benefit.
- Nothing holds the screen awake past the end of the follow. The flag is per window on Android and app-wide on Apple, where nothing but the app releases it, and its release on every branch including the failure branch is `perf-power`.
- The grant is `perm-scope` and `perm-rationale`, running usefully on an approximate grant is `perm-answers`, and agreeing with the indicator the system already drew is `sense-running`.

## `map-legible` The map is a photograph the app did not choose, and everything drawn on it owes its own contrast

Held in sunlight, held at night, held at arm's length while walking. The base map is the one background in the app whose colour nobody picked, and it changes under the finger as the tiles move, so a control that measured fine over one tile fails over the next.

- Measure every control, marker, label and overlay against the tiles it can actually sit on, the pale road and the dark park and the satellite layer, not against one fixed colour. `color-contrast` is the method, and a graphical part needed to understand the content takes 3:1.
- A thin stroke, a light drop shadow or a scrim under the control is the fix, and it costs less than restyling the map.
- Choose the base map rather than inheriting it. Apple publishes two emphasis styles, default and muted, where muted desaturates the map so information-rich content on top of it stands out. On Android the colour scheme defaults to light and ignores the device setting until it is set to follow the system, and it is not kept once the map is destroyed. Dark is a second design either way (`color-dark-composed`), label weight on it is `type-dark`, and the map itself does not turn around in a right-to-left layout (`l10n-no-mirror`).

## `map-steps` A route is text before it is a line, and turn-by-turn is a product rather than a feature

The person reading it is moving, holding the phone in one hand, and looking down for about a second at a time. A polyline is unreadable at that glance.

- Any route drawn on a map is also a numbered step list with distances and street names, in one unit system (`data-units`), formatted by the locale (`l10n-format`). An overlay that encodes a quantity instead of a route owes its scale and units to `data-chart-scale`.
- Do not assemble real-time turn-by-turn on a standard map SDK. Google's terms forbid combining directions, geolocation and the maps SDK into navigation substantially similar to its own app, so the two shipping answers are a dedicated navigation SDK or a handoff to the maps app, and on Android that handoff already exists in the default map toolbar.

## `map-offline` Tiles that did not arrive are a state the app draws, not a cache the app builds

A lift, a basement, a tunnel, a car park, a metered plan. The map is the heaviest thing on the screen and the first thing to fail, and a grey grid with a pin floating on it is the app looking broken at the moment somebody is trying to work out where they are.

- A map with no tiles draws a named state instead of blank tiles, inside the four network states of `state-offline`, saying what failed (`state-error`) with a retry that keeps the camera rather than resetting it (`state-retry`). Tiles still arriving is `state-loading`; a map with nothing to put on it is `state-empty`.
- Everything still true offline stays drawn and carries its age (`state-stale`): the last camera, the pins, the addresses, the step list.
- Where the provider's terms bar it, do not build a tile cache: Google bars pre-fetching, bulk downloading and rehosting outright, with no developer offline mode behind that, only a navigation SDK holding 15 to 20 minutes of route ahead of the user. Where a provider sells an offline store, the download is a sized region the user asked for, with an expiry, rather than a background crawl.
- Tiles are somebody's data plan (`net-metered`), and tiles for a region nobody will look at are `net-prefetch`.

## `map-cost` One map at a time, released when its screen goes, and never one per row

A map is the most expensive view a phone app can hold: it renders continuously, keeps tiles in memory and holds a connection open. Two of them alive at once, or one per row in a recycled list, is the shape that gets the process killed on the device the app was not built on (`perf-memory`).

- One live map instance per screen, released on the exit path and on the error path alike (`perf-power`).
- A map inside a list row is a static image or a lite-mode map, never a live one. `list-virtualise` recycles that row, and a live map is not a thing to recycle. A static map image is a picture and owes `icon-alt`.
- Reuse annotation views rather than building one per marker. Registering a view class, or dequeuing by identifier, is how the app opts in, and the map then builds a view only where no reused one is available.

## `map-attribution` The provider's logo and legal link are drawn by the map, moved only by its own padding, and never removed, hidden or restyled

The map fills the screen, so the bottom edge where every provider puts its credit is exactly where the phone also puts the sheet, the recenter button, the FAB and the tab bar. Covering it is the default outcome of the layout rather than an edge case, and it is a contract term rather than a matter of taste.

- Give the map padding instead of giving the chrome a margin. Padding the map's four edges moves the zoom controls, the compass and the copyright notice inside the visible region and recentres camera movements on it; Apple's edge padding does the same for framing. Anything pinned over the map declares that padding (`layout-chrome`), a sheet stacking above it is `layout-overlays`, and the safe area under it is geometry (`layout-insets`).
- Keep the credit fixed to the map rather than moving it with the interface, and clear of a pull-up card at its lowest resting position, 10 points above it on Apple, whose own padding figures are 7 points at the sides and 10 above and below.
- Never remove, hide, resize, recolour, localise, wrap or redraw it. Google's mark runs 16dp to 19dp tall with 10dp of clear space left, right and top and 5dp below; the text form is Google Maps unchanged, on one line, at 4.5:1 against its background, and it carries an accessibility label reading Google Maps.
- Where the response credits a third-party data provider, that name is printed alongside the mark. The provider mark on its own is not attribution then.

## `map-terms` The map arrives with a contract: the notice belongs in the app's own terms and the tiles are not the app's to keep

A phone app has no page footer to carry a legal line, and its binary only changes through the store, so the notice is routed to a screen somebody can reach rather than patched in later. The phone has no room for a second copy of the provider's data either, and the offline instinct it creates is exactly what the contract forbids.

- The app's own terms name the map provider and link the provider's end-user terms and privacy policy, on a surface reachable from where the version and the report route already live (`set-diagnostics`).
- Nothing is scraped: no pre-fetching, indexing, rehosting or bulk downloading of tiles, geocodes, directions or places, and no copying of business names, addresses or reviews into the app's own store. A place leaving the app leaves as a link or a coordinate rather than a rendered picture of the tiles, which is `share-link-not-shot`.
- What may be kept is narrow, and it is written down with its expiry in `off-cache-policy`: place IDs with no deletion deadline but refreshed at 12 months, latitude and longitude for at most 30 consecutive days. The empty store on a first run with no network is `off-no-cache`.
- A user's location is not obtained or cached without their express, prior, revocable consent, which is a promise the app makes on top of the permission grant.

## Check

Review answers each of these against the code, pointing at the line:

- Every map sets an explicit initial camera framed on its own content, passes padding for anything overlapping it, carries a pan bound or a minimum zoom where the user is not meant to leave the area, and uses a written coordinate rather than zero for the frame before any location resolves. `map-camera`
- Every map inside a same-axis scrolling parent names the mechanism that assigns the drag on one side or the other, and every map with no gesture enabled is a static image or a lite-mode map rather than a live one. `map-gesture-owner`
- Marker hit areas reach the platform touch floor where spacing allows, no marker is drawn larger than its hit rect, the marker tap handler is written rather than inherited so the map toolbar is deliberately kept or deliberately disabled, and two adjacent pins at production scale are separately hittable with a thumb. `map-marker-target`
- Any map whose marker list is not a fixed small set at the call site opts into clustering or a declared overlap policy, and a cluster prints its count and expands to somewhere a person can act. `map-cluster`
- The map view and every marker built in code carry an accessibility label of their own, every place, route, area and count on the map is reachable as text one step away in the same flow, and driving that flow with the reader on reaches all of them. `map-not-alone`
- Following is a shown state on a stock control, a user pan ends it, turning it off stops the location updates, and no screen-awake flag outlives the follow. `map-follow`
- Controls, markers, labels and overlays are measured against the tiles they sit on rather than one fixed colour, and the emphasis style or colour scheme of the base map is set explicitly. `map-legible`
- Every route on a map is also a numbered step list with locale-formatted distances and street names, and no real-time turn-by-turn is assembled on a standard map SDK. `map-steps`
- A map with no tiles draws a named state with a retry that keeps the camera, anything still true offline stays drawn and marked stale, and no code pre-fetches or persists tiles except through an offline API the provider publishes. `map-offline`
- At most one live map instance exists per screen, it is released on the exit and error paths, no live map sits in a recycled row, and annotation views are reused. `map-cost`
- The map is padded for every piece of chrome overlapping it, the credit moves only through the map's own padding API and no code removes, hides, resizes, recolours or redraws it, third-party data providers named in the response are printed alongside it, and the credit stays visible with every overlay at its lowest resting position. `map-attribution`
- The app's terms name the map provider and link its end-user terms and privacy policy, nothing scrapes or rehosts provider content, and no stored latitude and longitude has a retention beyond 30 consecutive days. `map-terms`

Four of these cannot be settled from a diff. On a device, raise the sheet to its lowest resting position and look for the provider credit under it (`map-attribution`); load production-scale markers and try to hit two adjacent pins with a thumb (`map-marker-target`); measure a control against the tile beneath it in both colour schemes and in sunlight (`map-legible`); and drive the whole map flow with the screen reader on to find out whether anything past the words "Google Map" is reachable at all (`map-not-alone`), which is the run `a11y-test` asks for.
