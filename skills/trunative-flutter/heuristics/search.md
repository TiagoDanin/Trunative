# Search

Search is how somebody finds a thing they already know is in there. On a phone it runs against a keyboard that takes half the screen, a list with no scrollbar, and a connection that may be a cell tower two bars down. Where search sits in the app's structure is `nav-search`. This file is the surface itself, from the field down to the last result row.

Two failures account for most of what goes wrong: a plain text field with a magnifier icon standing in for the platform's search control, and a query fired at the server on every keystroke.

## `search-surface` An inline filter and a search screen are two different things

Decide which one the screen needs before writing the field.

- **An inline filter** narrows what is already in front of the user (`nav-search`). It stays with the list it filters rather than moving up into the chrome.
- **A search screen** reaches past what is in front of the user. While it is open it owns the whole screen: a dropdown panel hanging under the bar is the tablet arrangement, and on a phone it only makes the result list shorter.

Focus on open belongs to the search screen, the single-field exception `form-input` already allows, and it forks by platform. On Android the expanded search view raises the keyboard by default and that is correct there; an inline filter that must not cover the list it filters turns it off with `app:autoShowKeyboard="false"` rather than leaving it to the default. On iOS nothing forces focus onto a surface the user did not open in order to type, so the field that arrives focused is the button-style search tab or a screen entered to type into.

On Android a screen pairing the search bar with the search view does not resize under the keyboard, because the resize runs during the expand and collapse animation and breaks it. Everywhere else the constraint is the outcome rather than a window flag: the field being typed into stays visible (`touch-keyboard`), and the result rows do not shift under a thumb already on its way down.

## `search-stock-field` Use the platform's search control, do not assemble one

Both platforms ship the whole control, and every part of it is a part somebody forgets when rebuilding it from a text field: the clear button that appears with the text, the cancel that dismisses the keyboard and the surface together, the search return key, and the expand and collapse transition. `references/search-controls.md` names the control per stack.

- The return key is the search action, not Done and not a newline (`form-input`).
- One clear control, appearing only when the field holds text. Clearing the field is not cancelling the search: clear leaves the user on the search surface with an empty query.
- Do not restyle the bar into something unrecognisable. The Android search bar refuses a custom background on purpose, and a search field that does not look like one is a field nobody finds.
- The Android search view takes the screen behind out of the reader's path while it is open and puts it back on hide. Nothing hands that over on iOS or in a hand-built surface, so there it is owed rather than inherited: while search owns the screen, what is underneath is not what the reader walks into (`a11y-hidden`).
- A voice entry point, where there is one, is the platform's, and it lives in the field rather than as a second control beside it. The keyboard already carries dictation, so a hand-drawn microphone next to it is the same button twice. What is dictated lands in the field as a query the user can read and correct, never as a search that has already run.

## `search-placement` Where the field goes forks by platform

There is no cross-platform answer here, and shipping one platform's arrangement on the other is visible immediately. One codebase cannot hold both at once, so it either chooses the arrangement at runtime by platform or picks one for both and records the choice and its reason in `STACK.md`.

- **Android:** the search bar belongs in the top app bar and behaves as part of it, either fixed, lifting on scroll, or scrolling away with the content. That is the top of the screen, and `nav-search` makes search structural rather than rare once a collection is big enough to need it, so on a large phone the screen owes a second path to it within thumb reach (`touch-reach`).
- **iOS:** three entry points, and the field belongs to one of them: a tab in the tab bar, a toolbar at the bottom or the top, or an inline field directly above the content it searches. Prefer the bottom toolbar where there is one with room, because that is where the thumb already is (`touch-reach`). Put search at the top instead when the content at the bottom of the screen is what has to be deferred to, or when the screen carries no bottom toolbar at all, and expect the top entry to sit collapsed as a button that opens into a field above the keyboard.

An iOS search tab comes in two flavours and they answer different products: a standard tab lands on a search page with suggestions, for browsing and discovery; a button-style tab opens the field focused and returns to the previous tab on exit, for people who arrived knowing what they want. Pick one deliberately.

## `search-typing` A keystroke is not a request

Filtering a collection already on the device happens as the user types. A network search does not.

- At most one search request in flight. Which query wins when two answers race, and how the superseded one is cancelled, is `net-cancel` and is not restated here. The ceiling of one is this file's own: keying requests by their parameters treats every prefix of a word as a different question and lets all of them run.
- The pause between the last keystroke and the request is one constant, named once in the code and recorded in `STACK.md`, not a number retyped at each call site.
- Failures back off on the schedule in `net-backoff`. Retrying per keystroke turns one bad connection into a burst that holds the radio up (`perf-power`) and spends somebody's data (`net-metered`).
- Typing is never blocked by a request. The field accepts input while the previous search is still out.

## `search-suggest` A suggestion says what it will do

Suggestions come in two kinds and they are not interchangeable: one completes the query into the field, the other opens a result and ends the search. Make which is which readable from the row, because guessing wrong costs a screen and a back gesture.

- A suggestion that returns nothing when tapped costs a screen push, a back gesture, and the keyboard coming down and going up again. That is why it is worse here than a wasted click: suggest from what the corpus actually contains.
- The list does not reorder under a finger already on its way down. Rows that resequence on the next keystroke produce a tap on whatever slid into that spot (`touch-spacing`).
- The suggestion list is a list: it recycles (`list-virtualise`) and it scrolls. Only the rows above the keyboard get read, so the strongest candidate is first.

## `search-recent` Recent searches are the cheapest query on a phone

Retyping is the expensive part of searching with two thumbs, so by default the search surface with an empty field shows what this person searched before, and tapping one re-runs it rather than just filling the field.

- A search history the user cannot clear is not shippable. One control clears the whole history, and it lives on the search surface, not down a settings trip.
- The history is on the device and belongs to this app. It does not travel to another surface or another account without the user saying so.
- A phone screen gets read over a shoulder. Showing history is the default; suppressing it is a decision the app is allowed to make, recorded in `STACK.md` with its reason, and content somebody would not want visible on a bus is that reason. The clearing control above is not a decision either way.

## `search-scope` The screen says what it is searching

A phone has no sidebar and no visible category tree, so the corpus being searched has to be stated on the surface itself, by the placeholder that names it, the screen title, or a scope statement under the field. Only Apple ships a stock control for that last one, so on Android and in the cross-platform stacks the scope statement is a row of selected filter chips (`button-chips`) instead of a scope bar nobody hands you.

- The placeholder names the thing: Search messages, Search saved recipes. The bare word Search says nothing, and on the search screen of an app with several kinds of content it is a guess the user has to make.
- Default to the widest scope and let people narrow. Somebody who does not know which section holds the thing cannot choose the section first.
- Changing scope keeps the query that was typed. Retyping to switch scope makes the control cost more than it saves.

## `search-filters` What is narrowing the results stays on screen

Filters on a phone live in a sheet, and the sheet closes. After it does, nothing tells the user the set is narrowed unless the results screen says so.

- The applied filters are visible with the results, as chips (`button-chips`) or as a count on the filter control. Zero is shown as no marker at all, never as a badge reading 0.
- Each applied filter comes off in one tap, and Clear all is allowed here: it is the exception `form-submit` names, because rebuilding a filter set costs a few taps rather than a retyped form.
- Whether a new query keeps the current filters or drops them is a decision recorded in `STACK.md`, and the screen shows the answer either way.

## `search-pending` The results on screen stay up while the next query is out

Between the request leaving and the answer landing is the state a search screen spends most of its life in on a cell connection, and it is the one that gets built by emptying the list.

- What is already on screen stays there until the new results replace it, marked as the answer to the previous query (`state-stale`). Clearing to a placeholder on every keystroke is a list that flickers for as long as somebody is typing.
- The in-flight marker sits in or beside the field, not over the rows. A cover across the results hides the thing the user is reading in order to refine the query.
- The placeholder in `state-loading`, with its 300ms and 500ms floors, is for the first search of a session, when there is nothing on screen yet to keep. Those floors are never applied per keystroke, where they hold a placeholder over results that have already arrived.

## `search-result` The row says why it matched

One narrow column, no hover, no preview pane. Everything somebody needs in order to choose between two results is in the row itself.

- Show the text that matched, in the field it matched in. A row whose title does not contain the query still has to carry the line that does. How the query is matched against the content, case, accents and character width included, is `l10n-collate`.
- The match marker is not color alone (`color-not-alone`): weight, a highlight behind the run, or the field label beside it.
- Most relevant first, and the ordering is one the user could predict. A result set spanning several kinds is grouped by kind rather than interleaved (`list-sections`), and each group header carries how many it holds.
- The results replace the list without a navigation, so the list declares its length (`a11y-collection`) and the settled count is announced once typing has paused and the results have landed. Never one announcement per keystroke, which is the first thing `a11y-announce` forbids. Nothing on screen otherwise says whether this is 3 results or 300.

## `search-zero` A query that matched nothing offers the next move

Keeping the query and the filters on screen is `state-empty`'s second empty. What makes it sharper here is the screen: there is one of them and no results pane beside the query, so whatever excluded everything is off screen entirely unless this screen is the thing holding it.

- Offer at least one next move: drop a named filter, widen the scope to everything, or the corrected spelling. A dead end with a shrugging illustration is the failure this rule exists for.
- Nothing matched is not a failure state. A request that could not complete is `state-error` with a retry (`state-retry`), and the two never render as the same screen.
- Do not fill the space with results that do not match. Related content is allowed below the statement that nothing matched, labelled as what it is.

## `search-return` Coming back from a result comes back to the search

Opening a result pushes a screen, and back returns to the query, the scope, the filters, the results and the scroll position, with the keyboard still down. Restarting the search is the most expensive thing this surface can do to somebody.

- The same state survives the process being killed (`nav-restore`).
- Cancel is a different move from back: it closes the search surface and returns the user to the screen they opened it from, with that screen as they left it.

## Check

Review answers each of these against the code, pointing at the line:

- Each search field is declared as one of the two surfaces, the expanded one takes the full screen rather than a dropdown, and focus on open answers per platform: the Android search view keeps its default while an inline filter switches it off, and no iOS surface is focused that was not opened in order to type. `search-surface`
- The field is the platform's own search control, with exactly one clear control that appears only when there is text, a search return key, the screen behind out of the reader's path while search is open, and any voice entry point inside the field rather than beside it. `search-stock-field`
- Search sits in the top app bar on Android and in one of the three sanctioned iOS entry points on iOS, and a single codebase either forks at runtime or records in `STACK.md` which one arrangement it ships. `search-placement`
- No more than one search request is in flight, the debounce is a single named constant, and retries are backed off rather than per keystroke. `search-typing`
- Every suggestion row shows whether it completes the query or opens a result, suggestions come from real content, and the list recycles. `search-suggest`
- Recent searches re-run on tap and any surface showing them carries one control that clears the whole history, with an app that shows none recording why in `STACK.md`. `search-recent`
- The corpus being searched is named by the placeholder, the title or a scope statement in the form that platform actually has, the default scope is the widest one, and switching scope keeps the query. `search-scope`
- Applied filters are visible with the results, each removable in one tap, with Clear all permitted rather than required, and the query-to-filter behaviour recorded. `search-filters`
- Results already on screen survive the next query, the in-flight marker sits at the field rather than over the rows, and the loading placeholder is used for the first search only. `search-pending`
- The result row carries the matched text, marks the match by something other than color, groups a mixed set by kind, and the count is announced once the results settle rather than per keystroke. `search-result`
- Zero results renders its own screen, keeps the query and filters visible, offers at least one next move, and is never the error screen. `search-zero`
- Back from a result restores the query, scope, filters, results and scroll position, and cancel returns to the originating screen unchanged. `search-return`

The last one is answered by running it, not by reading the diff: leave the search, come back, and check that nothing had to be typed again.
