# Navigation

There is one surface and nothing around it. No window title, no breadcrumb trail, no second pane still holding the place the user came from: the current screen is the entire map, and whatever it says about where it sits is all the user gets.

Then the session breaks. Someone walks away mid task, the system reclaims the process to free memory, a notification drops them into the middle of the app without passing the front door. Structure is the part of the design that has to survive all three, and it is decided in the router long before anyone looks at a screen.

`STACK.md` records which navigator this codebase uses and what its destinations are. This file is about the structure those choices produce. The tab bar as a control is `button-tabs`; the back gesture, the predictive animation and the system edge zones are `touch-gestures`. Container and restoration APIs per stack sit in `references/navigation-containers.md`, for one lookup rather than a read through.

## `nav-depth` Three levels, and the job within two taps

Destination, list, detail. Three is what someone holds in their head without a map, and a fourth needs a reason written into `STACK.md`. Count it from a top-level destination to the deepest screen reachable under it.

The other half is distance: the job this app exists for, the one named in `PRODUCT.md`, is at most two taps from a top-level destination. Depth is cheap to add in a router and expensive in a hand, because every level is another screen to re-recognise after an interruption.

A fourth level is usually a filter wearing a screen. If the new screen is the previous list narrowed, narrow the list instead.

## `nav-container` The container comes from the relationship, not from convenience

Five containers, five different relationships to what is underneath them:

| Container | What it means | How it ends |
|---|---|---|
| Pushed screen | more about the thing that was tapped | back |
| Top-level destination | another section of the app, always available | selecting another one |
| Bottom sheet | a short task or a set of options belonging to the screen under it | swipe down, scrim, back |
| Full screen cover | a self-contained task that needs the whole screen | an explicit Cancel and a named commit |
| Alert or dialog | one decision that genuinely cannot wait | choosing an answer, and on Android a back dismiss unless that was turned off on purpose |

The reflex to watch is presenting everything modally. A modal is presented rather than routed, so unless the stack gives it a route of its own it has no address and no history, and someone who leaves it cannot get back to where they were. So a **place** in the app is pushed or is a destination; only a **task**, one the user starts, finishes and returns from, gets a sheet or a cover. Settings presented as a sheet is the usual tell.

The sheet, cover or dialog carries its own primary action: `button-one-primary`.

## `nav-modal` A modal is a task, and its exit is one you drew

On a phone the modal covers its parent, so there is no visible background to click away to and no window edge to close. The only way out is the one on the screen.

- Name both exits. Cancel abandons, and the commit is the verb of the task. A lone X leaves the user guessing whether the work was kept.
- Interactive dismissal is already on, so the line to look for is the one that turns it off: `interactiveDismissDisabled`, a sheet state that refuses to hide. It belongs only where dismissing loses work, and where it appears the question appears with it, which is not the same as trapping.
- Never open a modal over a modal. The second one is a pushed screen inside the first.

## `nav-back` Back unwinds the stack and nothing else

On Android back is a system event that reaches every screen, sheet, cover and dialog, and the components dismiss the top surface with it already. That it exists and must not be swallowed is `touch-gestures`. iOS sends no such event: a full screen cover and an alert there end only through a control the app drew, which is what `nav-container` and `nav-modal` ask for. What is left here is what back means against the stack.

- Back pops the surface on top. It is not bound to a control that moves the user sideways to another destination, forward through a wizard, or backward through an edit.
- Intercepting it is allowed; ending in nothing is not. An interception resolves into a dismissal or a question, never into a screen that consumes the event and stays where it is.
- From a top-level destination that is not the start destination, back unwinds to the start destination first, and only leaves the app from there. Dropping someone out of the app from the third tab ends the session by accident. That unwinding is the stack emptying, not back being repurposed.
- Where an interception guards work that was typed and not saved, what happens to that work is `form-persist`.

## `nav-back-control` A custom back control keeps the gesture it replaced

On iOS the edge swipe that pops a screen is wired to the system's own back button. Hide that button or swap it out and the gesture leaves with it, silently: `navigationBarBackButtonHidden`, a custom `leftBarButtonItem`, `setNavigationBarHidden`. The screen still shows something that looks like back, so nothing is visible in a screenshot, while everyone who navigates by thumb has lost the fastest way out.

Keep the system control. Where a custom one has to replace it, restore the interactive pop on that screen in the same place, and make sure the replacement still reads as back rather than as a new action.

## `nav-location` Every screen says where it is

There is no window title and no breadcrumb, so a screen that names nothing leaves its position to be inferred from the content. That inference fails fastest where it costs most: three levels down, on the screen a notification just opened, in an app that was closed a second ago.

Every pushed destination carries a title naming what it is, and every top-level destination carries its own. Where more than one screen leads to this one, the back control names the destination it returns to instead of showing a bare arrow. Which top-level destination is selected stays visible throughout, which is `button-tabs`.

## `nav-deeplink` Arriving in the middle still needs everything above it

Phone apps are entered from outside constantly, and usually cold: notification, widget, share sheet, a link in a message, with the process dead and nothing in memory.

- Build the stack the user would have walked: start destination at the bottom, the linked screen on top, the ancestors in between. Android synthesises it from `navDeepLink` on the destination and React Navigation from the `linking` config, so there the answer is that the route is declared; on SwiftUI the path is rebuilt by hand, which is where this is real work. A linked screen whose back leaves the app is a dead end.
- Test from a killed process. The warm path passes by itself and hides the cold one, which is where this fails in production.
- A link that needs auth remembers where it was going and lands there after sign in, not on the home screen.
- A target that no longer exists lands on the nearest real screen and says what happened; what that screen says is `state-error`.
- The toolbar arrow on a screen entered from outside climbs this app's hierarchy. Wiring it to the same dismiss the device back calls hands the user back to the app they came from while pointing at this one.

## `nav-tab-stack` Each top-level destination keeps its own stack

Switching away and coming back returns to the screen that was left, not the root of that section. This is how people check one thing mid task and resume, and losing it costs them the work in progress on that branch.

The frameworks disagree on the default here, so it is a decision to make rather than a behaviour to inherit. Selecting the destination that is already selected is the way back to its root, and pops to it.

The stability of the destination set itself belongs to `button-tabs`.

## `nav-drawer` A drawer is not primary navigation on a phone

Navigation behind a hamburger costs a tap before it can even be read, and what people cannot see they do not use. The trigger also lives in the top corner, which is the hardest point on the screen to reach one-handed: `touch-reach`. iOS has no drawer convention at all, so a drawer there reads as a port.

Material allows the modal drawer at a phone's width, and this skill overrules that, with the cost stated: a map nobody sees, behind a control in the hard region, paid on every session. Primary destinations are visible without a tap. Where the app has more sections than the bar holds, the overflow is a destination of its own: a screen with a title and a back path, not a panel sliding over the app. A drawer that survives is a secondary surface for account switching, rare settings or a long secondary list, and every job `PRODUCT.md` names is reachable without opening it.

## `nav-search` Search becomes structure once a collection outgrows the thumb

There is no sidebar to park a filter tree in, and scanning by thumb gives out long before a list does. The trigger is what the collection is for: once people arrive at it to find one specific item rather than to browse, it needs search. Roughly 50 items is this skill's working number for where that flips, and an app whose content makes it lower or higher sets its own in `STACK.md`.

- Search that narrows what is already on screen is a field on that screen, and the results replace the list in place.
- Search that spans the app is a top-level destination with its own stack, so a result is pushed and back returns to the query with the typed text still there.
- The query survives leaving and returning: `nav-restore`.

## `nav-restore` The process will be killed, and nobody asked for that

Backgrounded apps get reclaimed, on both platforms, without warning. Coming back to a different screen than the one that was left is a bug even when the process died in between.

What comes back is the place: the selected destination, its stack, the scroll offset and selection on the screen that was left, the filters that were applied, and the sheet that was open. The values in an unfinished form are `form-persist`. Saving at the moment the system says to save, and admitting anything that did not survive, is `state-interrupt`.

The cutoff is a decision rather than a default. Restore the exact place when the app was left within about the last day, and open at the root of its top-level destination beyond that, so nobody resumes into week-old content they have to work out. Record the number in `STACK.md`. Content refreshes on the way in; only the place is restored.

## Check

Review answers each of these against the code, pointing at the line:

- Hierarchy runs at most three levels below a top-level destination, or the fourth is recorded in `STACK.md` with its reason, and the app's main job is within two taps of one. `nav-depth`
- Nothing that is a place in the app is presented modally: a surface a deep link resolves to, or one that appears in the destination list, belongs in a pushed screen or a destination. `nav-container`
- Every modal names both exits, turns interactive dismissal off only where work would be lost and asks there, and no modal opens over another. `nav-modal`
- Back pops the surface on top, is not bound to a sideways or forward move, resolves every interception, and does not exit the app from a destination that is not the start destination. `nav-back`
- No screen hides or replaces the system back control without restoring the interactive pop gesture alongside it. `nav-back-control`
- Every route builder sets a title, and a back control with more than one origin names where it returns to. `nav-location`
- Every deep link target opens from a killed process with a full stack above it, survives a sign in, and fails onto a real screen. `nav-deeplink`
- Each top-level destination keeps its own stack across a switch, and re-selecting the current one pops it to its root. `nav-tab-stack`
- Primary destinations are visible without a tap, and every job named in `PRODUCT.md` is reachable without opening a drawer. `nav-drawer`
- A collection people come to search rather than browse either carries a search field on its own screen or is covered by an app-wide search destination that keeps its query. `nav-search`
- The destination, its stack, scroll, selection, filters and the open sheet come back after the process is killed, and the restore cutoff is a set number rather than forever. `nav-restore`

`nav-deeplink` and `nav-restore` are answered by killing the process and launching from a link, not by reading the router. A graph that looks correct in the file is exactly the one that loses the stack on a cold link.
