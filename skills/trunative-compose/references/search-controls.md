# Search controls

Lookup only. The rules live in `heuristics/search.md`. Open this file for the control name in one stack, not as background reading.

## The control per stack

| Stack | Field and entry point | Expanded state and results |
|---|---|---|
| SwiftUI | `.searchable(text:placement:prompt:)`, placement from `SearchFieldPlacement` | `.searchSuggestions`, `.searchCompletion`, `.searchScopes`, `isSearching`, `dismissSearch` |
| UIKit | `UISearchController` on `navigationItem.searchController` | `searchResultsUpdater`, `automaticallyShowsCancelButton`, `automaticallyShowsScopeBar` |
| Compose Material 3 | `SearchBar(state:inputField:)` with `rememberSearchBarState`, or `AppBarWithSearch` | `ExpandedFullScreenSearchBar` on a phone; `ExpandedDockedSearchBar` is the tablet form |
| Android Views | `com.google.android.material.search.SearchBar` inside the app bar | `com.google.android.material.search.SearchView`, holding history, suggestions and results |
| Flutter Material | `SearchAnchor`, or `SearchAnchor.bar` for the bar plus view together | `suggestionsBuilder`, `SearchController.openView`, full screen by default on mobile |
| Flutter Cupertino | `CupertinoSearchTextField` | list of your own below it |
| React Native | `TextInput` with `returnKeyType="search"`, or the navigator's own search header | list of your own below it |
| Mobile web | `<input type="search">` | list of your own below it |

## Things the stock control already does

- **Clear button.** Present on the iOS search field and on the Material `SearchView`, which shows and hides it with the text. Do not draw a second one.
- **Focus and keyboard.** The Material `SearchView` raises the keyboard on open by default (`app:autoShowKeyboard`, default true), and the Compose expanded search bar requests focus on first expansion and dismisses the keyboard itself on collapse. On iOS, do not force focus on a surface the user did not open in order to type.
- **Accessibility.** The Material `SearchView` marks its siblings as unimportant for accessibility while open and restores them on hide. Removing it from the tree while it is still open skips that restore, so call `setModalForAccessibility(false)` by hand in that case.
- **Predictive back.** Automatic on Android when a `SearchView` is connected to a `SearchBar`.

## Android configuration worth knowing

- Soft input mode for a screen using `SearchBar` with `SearchView` is `adjustNothing`. `adjustResize` resizes the window during the expand and collapse animation, and resizing is not useful to somebody who is searching.
- `SearchBar` does not accept `android:background`. It extends `Toolbar`, so navigation icon and menu APIs work as usual.
- Under Material 3 Expressive the `SearchBar` goes inside an `AppBarLayout` themed with `ThemeOverlay.Material3Expressive.AppBarWithSearch`.
- Recent queries have a platform store in the Views stack: a `SearchRecentSuggestionsProvider` with `setupSuggestions(AUTHORITY, MODE)`, then `saveRecentQuery(query, null)` and `clearHistory()`.
- Material Search needs `com.google.android.material` 1.8.0 or later.

## Compose API drift

The `SearchBar(inputField, expanded, onExpandedChange, ...)` and `DockedSearchBar(inputField, expanded, ...)` overloads are deprecated, as are the older `query` and `onQueryChange` forms and `TopSearchBar`, which is now `AppBarWithSearch`. Write the `SearchBarState` form with `ExpandedFullScreenSearchBar`.

Full screen expansion also needs the layout to cooperate: no parent may constrain the search bar's size, and the host activity sets `WindowCompat.setDecorFitsSystemWindows(window, false)`.

## Sizes

| Value | Number |
|---|---|
| collapsed search bar height, Material | 56dp |
| full-screen search view header height, Material | 72dp |
| docked search view header height, Material | 56dp |
| search field text size, Material Views | 16sp |
| search bar horizontal and vertical margin, Material Views | 16dp |

There is no platform-standard debounce interval, suggestion count, minimum query length or retention limit for search history. Those four are the project's own numbers, picked once and written into `STACK.md`.
