# Game

A play surface is the one screen in an app where the content moves on its own and the person is answering it in real time. Everything else in this skill assumes a screen that waits for the user, and a game does not wait: the clock runs, the thumbs rest on the glass for minutes, and the eyes stay on the middle of the screen rather than reading down it. The rules below are what changes when that is true.

This file covers the play surface and the screens wrapped around it: the HUD, the controls, pause, the result of a round, and the screen that picks the next level. Menus, settings, shops and store screens of a game are ordinary screens and take the ordinary files, and a paywall in a landscape game keeps its exit in landscape (`sub-exit`). An offer raised on launch is `fb-unprompted`, not a boundary. Currency, lives and unlock costs are `econ-` rules, in `heuristics/economy.md`.

Review on a play surface stays proportional. The pass over the Extra table closes, in one line with one reason, the families a play surface cannot contain, such as chat, forms, search, auth, lists and webviews, so the review grades the rules the screen can break rather than marking a hundred rows not applicable. The nine always in scope still apply to the HUD and to every control on it.

Rules in this file, in order: `game-hud-context`, `game-centre`, `game-controls`, `game-pause`, `game-result`, `game-locks`, `game-reward-moment`, `game-segment`, `game-audio`, `game-lettered-art`.

## `game-hud-context` The HUD shows what this moment of the game needs, and no more than four things at once

A HUD is chrome that never scrolls away, so every readout on it is paid for on every frame of play. It changes with the state of the game rather than holding one fixed set.

- Decide the set per state: playing, paused, dialogue or cutscene, and result. Playing shows what the person acts on in the next few seconds. Paused shows the way out and the settings. Dialogue hides the controls it does not use. Result shows the outcome.
- At most four persistent readouts while playing. A fifth is a sign that something belongs on the pause screen, or should appear only when it changes.
- A readout that changes rarely appears when it changes and fades back, rather than holding a corner for the whole round.
- A shortcut to the shop, a "buy" or "get more" button, is a persistent element like any other and counts toward the four. It never sits in a control zone (`game-controls`), where a resting thumb buys.
- A HUD element is still text and still a control. Its size comes from the type scale, its tap area from `touch-floor`, and its edges from `layout-insets`.

## `game-centre` Nothing persistent sits over the middle of the play area

The eyes rest on the centre of the play area, and anything parked there covers the thing the person is reacting to.

- Persistent chrome lives at the edges. The middle carries the game and the transient feedback that belongs to it: a hit, a score popping from where it was earned, a short banner that leaves on its own.
- A message that needs reading stops the clock first, under `game-pause`, and appears as a pause state rather than over live play.
- Transient feedback appears near the event it describes, so the eye does not travel to a corner to learn what just happened.

## `game-controls` Controls own their zones, and nothing else is placed in them [P1]

On a play surface the thumbs rest on the glass for the whole round, so the regions under them are taken. A menu button or a banner placed there is pressed by accident, and a control placed elsewhere is out of reach mid play.

- Give the controls the lower corners and the bottom edge, mirrored for a left hand where the game allows it (`touch-reach`). Menus, pause and secondary buttons go to the top edge, outside the resting thumbs.
- Choose the input on purpose. Discrete input (taps, buttons, swipes in four directions) suits a grid or a turn. Analog input (a stick, a drag) suits continuous movement. A floating stick that appears where the thumb lands is easier to find than a fixed one, and a fixed one must be visible before the thumb arrives.
- Every control meets `touch-floor` and stays inside the safe area on all four edges, in every orientation the game supports (`layout-insets`). A system edge gesture is not overridden by a control placed on it (`touch-gestures`).
- Controls are hidden or disabled while paused, during dialogue and on the result, so a resting thumb does not act on a screen that is not playing.
- Every action a gesture triggers has a visible control as well, or a setting that provides one (`a11y-gesture`).

Put the control layer under a panel whose anchors follow `Screen.safeArea`, drive on-screen sticks and buttons with the Input System's `OnScreenStick` and `OnScreenButton` or with `EnhancedTouch`, and test the free axis at both ends of the supported aspect ratios in the Device Simulator.

## `game-pause` Anything on a clock stops when attention leaves, and starts again only when the person says so [P0]

A game is the one screen where losing focus costs something while the person is away: the timer runs out, the character walks off a ledge, the round is lost on a call. The system carries the memory through an app switch (`state-interrupt`), but it does not stop the game clock.

- Pause on every loss of attention: focus loss, app switch, the notification shade, an incoming call, a system dialog, and any overlay the app raises itself, including its own menu, a consent form or an ad.
- Resume only on an input from the person, from a pause screen that shows the state they are returning to. Returning to the app is not that input, and a game that resumes on focus regained has played a second without them.
- Cancel every pointer that was held at the moment of the pause. A touch that started before the interruption and never ended is still down as far as the game knows, and the character keeps moving after resume.
- Audio follows the same pause, and resumes with play rather than with the app.

Pause from `OnApplicationFocus(false)` and `OnApplicationPause(true)` on a `MonoBehaviour`: set `Time.timeScale` to zero, set `AudioListener.pause`, and drop every touch that began before the pause, so `EnhancedTouch` reports nothing still held. Resume from the pause screen, never from `OnApplicationFocus(true)`.

## `game-result` The result shows the outcome first, and dismissing an offer declines it [P1]

The end of a round is where the game is most tempted to sell, and the person is least able to read carefully: they just lost, the thumb is already moving.

- Show the outcome before any offer: won or lost, the score, what was earned. An offer that arrives first hides the one thing the person came to see.
- The outcome of a round the person played is never what is for sale. A score, a test result, the answer to a puzzle they solved: the time they spent already paid for it, and holding it back until they pay turns that time into the lever. Extra analysis may be sold after the outcome is shown in full.
- A continue offer, a doubled reward or a purchase states what it costs and what it gives (`ads-rewarded`, `sub-billed-first`). Its dismissal declines it. A close control, a tap outside, back and a countdown running out all mean no, never yes.
- The decline is as easy to find and to reach as the accept, and the round can be restarted or left from the result without passing through the offer.
- A modal raised here is still a modal: both exits named, and nothing stacked over it (`nav-modal`).

## `game-locks` A locked level says why, and what opens it

A grid of padlocks tells the person what they cannot have and nothing about how to get it.

- Every locked item shows the condition that opens it: the level before it, a score, a count of stars, a purchase. When the condition is a cost, the cost follows `econ-cost-shown`.
- A tap on a locked item answers, with the condition and the route to it, rather than doing nothing (`touch-feedback`, `button-state`).
- The next playable item is the one the screen leads with, so the person returning after a day is one tap from playing.

## `game-reward-moment` A rewarded offer appears at the end of a segment, never during play

A rewarded ad trades attention for something in the game, and the trade is only fair when the person can stop to weigh it.

- Offer it at a boundary: the result of a round, running out of a resource, the end of a level. Never over live play, and never as a surprise that pauses the game.
- The offer appears only when it can be honoured. A button that promises a reward and then finds no ad to show is a broken promise at the exact moment the person agreed.
- What the reward is, and that declining returns to the same screen, follow `ads-rewarded`.

## `game-segment` Progress survives the process, and a short attempt may restart if the game says so [P1]

A game holds two kinds of progress, and they deserve different promises.

- Meta progress, everything that outlives a round (levels opened, currency, items, settings, a run across several levels), is saved at every boundary where it changes and survives process death, under `state-interrupt`.
- A single short attempt, one level or one round of a minute or two, may restart from its beginning after the process is killed, as long as the game says so on return. Restarting silently, or showing a continue that then starts over, is the failure.
- A segment long enough that restarting it is a real loss is saved inside, at checkpoints the person can see.

## `game-audio` Music and effects are separate, and the soundtrack yields to audio already playing

In a game the soundtrack is part of the product rather than interface sound, and it is the case `sound-unasked` and `sound-off-switch` leave room for.

- Two controls, music and effects, each persisted and reachable from the pause screen. They are two because people want one without the other, most often effects on and music off under their own playlist.
- Music may start with the game's first screen only when no other audio is playing. When something else is, the game stays quiet until the person turns its music on, and its effects still mix on top (`sound-mixes`). iOS reports this through `AVAudioSession.secondaryAudioShouldBeSilencedHint`, and Android through `AudioManager.isMusicActive`.
- Music that starts by itself has its stop one step away, which the music control on the pause screen is.
- Audio pauses with the game under `game-pause`, and nothing in the game carries information only by sound (`sound-never-alone`).

## `game-lettered-art` Words are text drawn over art, not letters painted into it

A button image with its label painted in cannot be translated, cannot scale with the text setting and cannot be read by a screen reader. That holds for any app and is `icon-lettered`. Games reach for it more than anything else because the art style wants lettering, so the game's case is spelled out here.

- Draw the word as text over the art, from the string table (`l10n-strings`), with room for longer translations (`l10n-expansion`).
- Where the lettering is the art (a title, a logo), ship one asset per supported locale and give the image the accessible name it shows (`a11y-name`).
- Numbers painted into art (a level number, a price, a counter) are text in every case, since they change.

## Check

Review answers each of these against the code, pointing at the line:

- The HUD set is decided per game state, and no more than four persistent readouts show while playing, shop shortcuts counted among them and none in a control zone. `game-hud-context`
- No persistent element sits over the middle of the play area, and messages that need reading appear in a paused state. `game-centre`
- Controls own the lower corners and bottom edge, menus and pause sit outside them, every control meets the touch floor inside the safe area in every supported orientation, and controls are hidden or disabled while not playing. `game-controls`
- The game clock and its audio pause on focus loss, app switch and every overlay, resume only from a control on a pause screen, and held pointers are cancelled at the pause. `game-pause`
- The outcome shows in full before any offer and is never itself for sale, every dismissal of an offer declines it, and the round can be restarted or left without passing through the offer. `game-result`
- Every locked item shows the condition that opens it, and a tap on it answers with that condition. `game-locks`
- Rewarded offers appear only at a segment boundary and only once the ad can be shown. `game-reward-moment`
- Meta progress is saved at every boundary and survives process death, and a short attempt that restarts after it says so on return. `game-segment`
- Music and effects have separate persisted controls reachable from pause, and music does not start by itself while other audio is playing. `game-audio`
- No label, number or price is painted into raster art, and lettering that is the art has one asset per locale and an accessible name. `game-lettered-art`

Three of these are settled only on a running game. Hold a direction, pull down the shade and come back, and confirm the game is paused and the character is still (`game-pause`). Play a round on the narrowest and the widest supported aspect ratio with the device in each supported orientation, thumbs resting on the controls, and confirm nothing is under them that is not a control (`game-controls`). Kill the process in the background mid level and mid run, then reopen, and confirm what came back matches what the game says (`game-segment`).

## Reaches

The rules this file cites and the files that hold them. Open one when a citation above decides something this file does not.

- `heuristics/accessibility.md`: `a11y-gesture`, `a11y-name`
- `heuristics/ads.md`: `ads-rewarded`
- `heuristics/buttons.md`: `button-state`
- `heuristics/economy.md`: `econ-cost-shown`
- `heuristics/feedback.md`: `fb-unprompted`
- `heuristics/icons-and-imagery.md`: `icon-lettered`
- `heuristics/layout.md`: `layout-insets`
- `heuristics/localization.md`: `l10n-strings`, `l10n-expansion`
- `heuristics/navigation.md`: `nav-modal`
- `heuristics/sound.md`: `sound-unasked`, `sound-off-switch`, `sound-mixes`, `sound-never-alone`
- `heuristics/states.md`: `state-interrupt`
- `heuristics/subscriptions.md`: `sub-exit`, `sub-billed-first`
- `heuristics/touch.md`: `touch-floor`, `touch-reach`, `touch-gestures`, `touch-feedback`
