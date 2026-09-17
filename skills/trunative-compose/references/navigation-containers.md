# Navigation containers and restoration, per stack

Lookup only. The rules live in `heuristics/navigation.md`. Open this file for one container, one API name or one restoration mechanism, not as background reading.

The concept is portable and the name is not. Pick the row for the relationship, then read the column for the stack in `STACK.md`.

## Containers

| Container | SwiftUI | Jetpack Compose | Flutter | React Native | Mobile web |
|---|---|---|---|---|---|
| Pushed screen | `NavigationStack` with `navigationDestination` | `NavHost` with `navController.navigate` | `Navigator.push`, `MaterialPageRoute`, `context.push` on GoRouter | native stack, `navigation.navigate` | History API `pushState`, or the router's push |
| Top-level destinations | `TabView` with `Tab` | `NavigationBar` over one nested graph per destination | `NavigationBar` in a `Scaffold`, plus `IndexedStack` or a `Navigator` per branch | bottom tab navigator, one stack inside each tab | one route prefix per section |
| Bottom sheet | `.sheet` with `.presentationDetents` | `ModalBottomSheet` | `showModalBottomSheet` | a sheet library, or a native stack screen with `presentation: 'formSheet'` | `<dialog>` positioned to the bottom edge |
| Full screen cover | `.fullScreenCover` | a route on the graph, or `Dialog(usePlatformDefaultWidth = false)` | `MaterialPageRoute(fullscreenDialog: true)` | native stack screen with `presentation: 'fullScreenModal'` | a route of its own |
| Alert or dialog | `.alert`, `.confirmationDialog` | `AlertDialog` | `showDialog` with `AlertDialog` or `CupertinoAlertDialog` | `Alert.alert` | `<dialog>` with `showModal()` |

Bare React Native ships no bottom sheet. Reaching for one means adding a dependency, which is a `STACK.md` decision rather than a detail.

## Back and dismissal

| Need | SwiftUI | Jetpack Compose | Flutter | React Native | Mobile web |
|---|---|---|---|---|---|
| Dismiss the current surface | `@Environment(\.dismiss)` | `navController.popBackStack()` | `Navigator.pop` | `navigation.goBack()` | `history.back()` |
| Intercept back | `.interactiveDismissDisabled`, then present the question yourself | `BackHandler` from `androidx.activity.compose` | `PopScope` with `canPop` and `onPopInvokedWithResult` | `beforeRemove` listener, plus `BackHandler` for the Android button | `popstate` with a pushed sentinel entry |
| Guard unsaved work | `.interactiveDismissDisabled(hasEdits)` plus a confirmation dialog | `BackHandler(enabled = hasEdits)` | `PopScope(canPop: !hasEdits)` | `beforeRemove` with `e.preventDefault()` | `beforeunload` for the tab, the sentinel for in-app |

Android's back callback is the modern one, not an override of the old back method, which is what keeps the predictive animation the system draws. `touch-gestures` owns that side.

## Deep links

| Stack | Where the route is declared | Where the incoming link is received |
|---|---|---|
| SwiftUI | `NavigationPath` rebuilt from the URL | `.onOpenURL`, plus Associated Domains for universal links |
| Jetpack Compose | `navDeepLink` on the destination | intent filters in the manifest, verified as App Links |
| Flutter | route patterns on GoRouter or the router delegate | `onGenerateRoute`, or the platform link plugin |
| React Native | the `linking` config, with `getStateFromPath` for a synthesized stack | `Linking.getInitialURL` for a cold start, the `url` event while running |
| Mobile web | the URL itself | the router's own resolution |

Two paths to test, always: the app already running, and the app killed. Only the second one builds the stack from nothing, and it is the one that fails.

## State restoration

| Stack | Mechanism | Notes |
|---|---|---|
| SwiftUI | `@SceneStorage` for per screen state, plus a codable `NavigationPath` | `@State` does not survive process death |
| Jetpack Compose | `rememberSaveable`, `SavedStateHandle`, and the nav graph's own saved state | pass `saveState` and `restoreState` when switching top-level destinations, or each switch resets that branch |
| Flutter | `RestorationMixin` with a `restorationScopeId`, and `RestorableProperty` values | restoration is off until a scope id is set |
| React Native | persist the navigator state from `onStateChange` and feed it back as `initialState` | gate the first render until the saved state has loaded |
| Mobile web | `history.state` for the route, `sessionStorage` for the screen | `sessionStorage` clears with the tab |

Restore the place. Refetch the content.
