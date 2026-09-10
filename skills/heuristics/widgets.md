# Widgets and live surfaces

A home screen widget, a Live Activity with its Dynamic Island presentations, and an Android ongoing notification promoted to a live surface are the parts of the app that get drawn while the app is not running. The system decides when each one is redrawn, at what size, and whether it appears at all, so none of them is a small screen: each is a report the app files and then loses control of. All of them are read in a second, from arm's length, by somebody who is not going to open the app to check.

Here: the update budget, stating what is stale, what fits at the size the user chose, the sizes themselves, the tap, the states nobody draws, what a stranger reads off the surface, what the surface may carry, the labels, the Dynamic Island, the final frame of a live one, and Android promotion. Whether a persistent live surface may exist at all, and what dismissing one means, is `notify-ongoing`. Scheduling the work behind an update is the `bg-` prefix, resolving the link the tap carries is `nav-deeplink`, and the inventory of what counts as sensitive is `priv-shoulder`.

## <Rule id="widget-budget" description="The system decides when the surface is redrawn, so the app declares a policy and never a clock" />

The app does not own the clock out here, and every redraw is battery the phone is rationing (`perf-power`). iOS spends a budget per widget instance that it tunes to how often that person looks, typically 40 to 70 refreshes across a day, roughly one every 15 to 60 minutes. Android will not deliver a periodic widget update more than once every 30 minutes and recommends no more than once an hour. A surface asking for a 60 second refresh does not get a fast surface, it gets a throttled one.

- Declare a policy, never a timer. On iOS a timeline ends in `atEnd`, `never` or `after(_:)`, with `WidgetCenter.reloadTimelines` from the app when something actually changed; on Android `updatePeriodMillis` is either 0 with WorkManager behind it or an hour or more. Nothing polls, and no code path treats the interval it asked for as the interval it gets.
- Build on the redraws that cost nothing on iOS: the containing app in the foreground, an active audio or navigation session, a button or toggle running an app intent, an animation, and a locale or text size change.
- The update is not the work. An Android widget receiver is treated as non-responsive after 10 seconds, so anything slow moves to `goAsync()` or WorkManager, and a Live Activity cannot reach the network or a location at all: its data is pushed in from the app or a server. What may run while the app is away is `bg-not-running` and `bg-periodic`.
- Live Activity pushes have their own hourly budget and get throttled past it. Send at priority 5, which does not count against it, and keep priority 10 for the update the user would notice missing; frequent updates need the property list flag and the user can switch them off (`bg-wake-push`).

## <Rule id="widget-stale" description="The surface states what it is showing and when it was true" />

The redraw is the system's decision, so this surface is showing old data by definition. There is no pull to refresh on a home screen and nothing to tap that means try again, and a number with no age on it is read as current by somebody who is about to act on it without opening anything.

- The age is on the surface, in the same place on every redraw, and the crossover from a relative age to a date is `data-time-relative`. That cached content carries its age at all is `state-stale`.
- Dates and times are drawn by the platform's own date facility rather than recomputed per reload, so a clock counting forward does not spend refreshes the surface needs for its content.
- The state behind a Live Activity's stale date is a drawn state rather than the last frame left standing (`notify-ongoing` owns that the date is set at all). Without it, a delivery frozen at eleven minutes away still reads as eleven minutes away.

## <Rule id="widget-fits" description="No scroll, no keyboard, no spinner, so every state fits the size the user chose" />

No scrolling API exists for an iOS widget, no text entry exists on either platform, and there is nowhere for a spinner to lead. Whatever does not fit is simply gone, and it is gone at the size that person picked rather than the one in the preview.

- The interactive elements iOS documents are a whole-surface link, a `Link`, a `Button(intent:)` and a `Toggle(isOn:intent:)`. No field, no sheet, no nested navigation. Android collection widgets do scroll vertically through the collection views, and that is the only scrolling either platform offers here.
- The loading state is a placeholder in the shape of the finished content, which is `state-loading` on a surface with nowhere to put a spinner. Android requires an initial layout for exactly this moment.
- Both surfaces are stateless. The app stores the value and the surface renders it (`off-local-first`); an Android checkbox, switch or radio on a widget carries a look, not a value.
- Every string is sized at its longest translation (`l10n-expansion`), because it truncates against a fixed cell instead of wrapping into more room. A Live Activity holds inside 4 KB of static plus dynamic data.

## <Rule id="widget-sizes" description="Content is authored per size, and a size nobody drew is not offered" />

A phone home screen is a grid the user resizes by hand, so the same widget sits in two cells for one person and twelve for another. Stretching one layout to fill a bigger cell is what a window does, and this is not a window: the small size carries one fact and the large one is a different design, not the same design with air around it.

- Author per size, then offer only the sizes authored. The iPhone families are small, medium and large on the home screen plus the circular, rectangular and inline lock screen accessories; extra large is not a phone size. Android declares its default in launcher cells through `targetCellWidth` and `targetCellHeight`, with the dp minimums as the fallback for older releases.
- One layout per size band rather than one per pixel: Glance's responsive size mode maps a set of layouts and lets the system pick, while its exact mode rebuilds the surface on every resize and jumps while it does.
- The system's own content margins stay, 16pt on iOS and 11pt where a tighter grouping is wanted, and nothing adds a second inset on top of them. A full-bleed background switches the default margins off and re-applies them to the content inside, and the corner radius comes from the container rather than a typed value.
- Portrait and landscape both, at the narrowest supported device (`layout-width`).

## <Rule id="widget-tap" description="The tap is a deep link carrying its subject, and it resolves from a killed process" />

The tap arrives from a home screen, so the process is usually dead. There is no hover and no second tap to disambiguate, and on a small or inline widget the whole surface is a single target, which makes whatever it points at the only thing it can point at.

- The payload names the destination and the subject, an id in the URL or in the pending intent, never a bare route to the app's home screen. Building the stack above that target, the cold launch, the auth case and the missing target are all `nav-deeplink`.
- Count the targets. One whole-surface link per widget, because a second one is undefined behaviour on iOS, and an inline accessory has exactly one. Android collection rows take a pending intent template on the collection plus a fill-in intent per row, since a row cannot carry a click intent of its own.
- A control drawn on the surface is a target with a hit area, and the number comes from `touch-floor`, because neither platform publishes one for this surface.
- Launched from a lock screen, the destination either requires authentication or declares that it shows when locked. Buttons and toggles on a Live Activity do nothing in CarPlay, so nothing is reachable only through them.

## <Rule id="widget-states" description="Signed out, empty and error are drawn states, at the smallest size the surface offers" />

These are the states nobody draws, and here they are the ones with no way out: no scroll, no room for a retry control worth the space, no route to a sign-in screen. A blank rectangle sits on somebody's home screen for hours as the app's only visible face, and the next move is to remove it rather than to open the app.

- Three states written and fitting the smallest declared size: signed out naming what signing in would show, empty saying which of the three empties this is (`state-empty`), and failed saying what failed without guessing why (`state-error`).
- A token that could not be refreshed is not a sign-out and is not drawn as one (`off-session`). It draws the last known content with its age.
- Availability is a state as well. A Live Activity checks that activities are enabled before starting, since the user can switch them off, and telling them so belongs in the app rather than on a surface that never appears.
- No state resolves to a blank surface or a bare error string.

## <Rule id="widget-shoulder" description="Whoever is standing beside the phone reads this surface, and on Android it is on the lock screen unless the app says otherwise" />

This is the part of the app drawn on a screen that is switched on without the app being opened: in a queue, on a table, on a locked phone with an always-on display. Android puts a widget on the keyguard by default and the app has to opt out, so a surface designed for a home screen reaches the lock screen with the app never having declared it should.

- Every value takes the shortest form that still does its job, which is `priv-shoulder`, and that file owns the inventory of what counts as sensitive.
- A widget that must not reach the keyguard declares the `not_keyguard` category, which exists from Android 16. It is a request the surface is expected to honour rather than a guarantee, so nothing depends on it alone.
- Anything a Live Activity would not publish becomes an innocuous summary that opens the app for the rest, or a view marked privacy sensitive so the system redacts it. An iOS lock screen widget is also desaturated to a monochrome vibrant rendering and can be tinted by the user, so nothing there is carried by colour (`color-not-alone`).
- What a notification's own first line says to a stranger is `notify-lockscreen`.

## <Rule id="widget-scope" description="The surface carries this app's own content and nothing else" />

This is space on somebody's home screen granted to one app, and the one surface where a promotion cannot be scrolled past or swiped away. Apple's guideline 2.5.16 says widgets, extensions and notifications should be related to the app's own content and functionality, and 2.5.18 says display advertising should be limited to the main app binary, which `ads-placement` already enforces at the call site.

- No advertising, no promotion, no cross-sell, no shortcut unrelated to what the surface reports. Android's own list of what does not qualify as a live update opens with ads and promotions and includes quick access to app features.
- The surface is the summary and the app is the detail, so everything on it exists in more depth one tap away. A surface carrying something the app itself never shows is a second app.

## <Rule id="widget-a11y" evidence="device" description="Every element carries a name, and the name changes when the picture does" />

These surfaces reach a screen reader without the app being open, and they are mostly icons and bare numbers with nothing around them to supply a label. A widget also has to hold from the default text size up to the largest accessibility size inside a cell it cannot grow, which is a case that only exists because the container is a phone home screen grid.

- Every image and icon-only element carries a label (`a11y-name`, `icon-alt`), and a label reporting a status changes when the status changes. A delivery glyph labelled once at build time is wrong for the rest of the run.
- No text rasterized into an image, on any presentation. Text stays text so it scales and can be read out.
- Nothing below 11pt, and the layout survives the largest accessibility text size (`type-scaling`) at the smallest size the surface declares.
- Drive each presentation with the reader on, as `a11y-test` asks of any flow.

## <Rule id="widget-island" evidence="device" description="Four presentations, each one designed rather than derived" />

The Dynamic Island is the only place this app appears while the user is inside another app, and its shape comes from the camera hardware rather than from a layout. A Live Activity has four presentations, three of them in the Island (compact, minimal, expanded) and one on the lock screen, and an app that only designed the expanded one becomes an unidentifiable dot.

- Minimal is 36.67pt tall and 36.67 to 45pt wide, and it is what the system picks once a second Live Activity is running. It has to be recognisable alone, which for a single glyph means the app's own mark rather than a progress ring.
- Compact leading and trailing run 52.33 to 62.33pt wide by 36.67pt tall. Content stays as narrow as it can and snug against the camera.
- Expanded opens on touch and hold. It and the lock screen presentation both run 84 to 160pt tall, the lock screen one with a 14pt margin, and the system may truncate anything above 160.
- No image asset larger than the presentation drawing it, since an oversized one can stop the activity starting at all. Animation caps at two seconds (`motion-duration`) and does not run on an always-on display at reduced luminance, so nothing is legible only while it moves.

## <Rule id="widget-live-end" description="The end of a live surface is a final state, not a disappearance" />

The surface outlives the event it was reporting: an ended Live Activity stays on the lock screen for up to four more hours, and the frame it stopped on is the last thing that person sees. A phone gets one glance, so that frame has to say the ride arrived rather than freeze eleven minutes out.

- The final content states the outcome, arrived, delivered, cancelled, finished, instead of holding the last in-progress frame.
- A dismissal time is chosen rather than left at the four hour default. The time is proportional to the activity, and 15 to 30 minutes is adequate for most of them.
- Whether a persistent live surface is allowed at all, what its ceiling is, ending it on the event that ends the work and what a dismissal means are all `notify-ongoing`. Where the surface exists to watch long user-started work, the progress and the stop control belong to `bg-visible-stoppable`.

## <Rule id="widget-promoted" description="An Android live update is a request, and it has to read correctly when it is refused" />

Android promotes an ongoing notification to a status bar chip, the top of the drawer and the lock screen, and it can decline. The user can demote it, the manufacturer can add criteria, and the app only learns the outcome at runtime, so a surface designed for the promoted presentation alone is a surface most phones never draw.

- Its own title and body carry the state, so it reads as an ordinary notification when promotion is refused, and that is the presentation to design first.
- The requirements are all of these, with no partial pass: the promoted notifications permission declared, promotion requested on the builder, the ongoing flag set, a content title present, one of the standard, big text, call, progress or metric styles, no custom content view, not a group summary, not colorized, and a channel above minimum importance.
- Ask the platform whether the notification can be promoted and whether the user allows it, and hand the user the app's promoted notification setting rather than guessing. Nothing is reposted after they dismiss it.
- Four things qualify: active navigation, an ongoing call, rideshare tracking and food delivery tracking. Chat messages, alerts, a calendar event that has not started, package tracking and ambient information do not. Alert only on a critical status change (`notify-level`), and keep the timestamp format identical between the chip and the expanded card.

<Check>

<Verify rule="widget-budget">Every outside surface refreshes through a declared reload policy or a system-scheduled trigger rather than a timer or a poll, `updatePeriodMillis` is 0 with work behind it or at least an hour, and every ActivityKit push is sent at priority 5 except a state change the user is waiting on, with no routine progress update at priority 10.</Verify>
<Verify rule="widget-stale">Every outside surface renders the age of what it shows, dates and times come from the platform's own date facility, and every Live Activity draws a designed state behind its stale date.</Verify>
<Verify rule="widget-fits">No outside surface depends on scrolling, text entry or a spinner, its loading state is a placeholder shaped like the content, its state is stored by the app, and every string is sized against its longest translation rather than the English one.</Verify>
<Verify rule="widget-sizes">Every size a surface declares has content written for it, none is a smaller layout stretched or a larger one clipped, the Android declaration names its default cells, and the surface keeps the system's default content margins rather than adding a second inset.</Verify>
<Verify rule="widget-tap">Every tappable region carries a URL or pending intent naming both destination and subject, each widget declares at most one whole-surface link, collection rows use the template plus fill-in form, and drawn controls meet the touch floor.</Verify>
<Verify rule="widget-states">Each surface has a signed-out, empty and error state written as its own layout branch at the smallest size it declares, a failed token refresh is not drawn as a sign-out, no state resolves to a blank surface, and a Live Activity is started only behind an activities-enabled check.</Verify>
<Verify rule="widget-shoulder">No value on an outside surface appears in a longer form than `priv-shoulder` allows for its category, any widget that must not reach the keyguard declares `not_keyguard`, and anything sensitive on a Live Activity is a summary or a privacy-marked view.</Verify>
<Verify rule="widget-scope">No outside surface carries a promotion, a cross-sell or a shortcut unrelated to what it reports, and everything it shows exists in more detail inside the app; an ad unit built into one is scored under `ads-placement`.</Verify>
<Verify rule="widget-a11y">Every image and icon-only element on every presentation has a label, status labels change with the status, no text is rasterized, nothing is drawn below 11pt, and the layout still holds at the largest accessibility text size at the smallest size the surface declares.</Verify>
<Verify rule="widget-island">All four Live Activity presentations have their own layout rather than one reused across them, the minimal one draws the app's own mark, expanded and lock screen hold inside 160pt of height, and no image asset exceeds the presentation drawing it; a codebase that ships only to Android answers this not applicable.</Verify>
<Verify rule="widget-live-end">Every Live Activity sets a chosen dismissal time rather than taking the four hour default, and its final content states the outcome rather than the last in-progress frame.</Verify>
<Verify rule="widget-promoted">Every promoted notification meets all nine promotion requirements, carries its state in its own title and body so nothing depends on the promoted presentation, checks promotability and user permission at runtime, and is not reposted after a dismissal; a codebase that ships only to iOS answers this not applicable.</Verify>

<Device>Two of these cannot be settled from the source. Run the app on a device with the reader on and walk every presentation, confirming each image has a name that follows its status and that the layout survives the largest accessibility text size at the smallest declared size (`widget-a11y`), and start a second Live Activity so the system falls back to the minimal presentation, then touch and hold to expand, and check the surface stays identifiable and untruncated in all four (`widget-island`).</Device>

</Check>
