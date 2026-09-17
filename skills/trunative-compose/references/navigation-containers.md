# Navigation containers and restoration, per stack

Lookup only. The rules live in `heuristics/navigation.md`. Open this file for one container, one API name or one restoration mechanism, not as background reading.

The concept is portable and the name is not. Pick the row for the relationship, then read the column for the stack in `STACK.md`.

## Containers

| Container | Jetpack Compose |
|---|---|
| Pushed screen | `NavHost` with `navController.navigate` |
| Top-level destinations | `NavigationBar` over one nested graph per destination |
| Bottom sheet | `ModalBottomSheet` |
| Full screen cover | a route on the graph, or `Dialog(usePlatformDefaultWidth = false)` |
| Alert or dialog | `AlertDialog` |

Bare React Native ships no bottom sheet. Reaching for one means adding a dependency, which is a `STACK.md` decision rather than a detail.

## Back and dismissal

| Need | Jetpack Compose |
|---|---|
| Dismiss the current surface | `navController.popBackStack()` |
| Intercept back | `BackHandler` from `androidx.activity.compose` |
| Guard unsaved work | `BackHandler(enabled = hasEdits)` |

Android's back callback is the modern one, not an override of the old back method, which is what keeps the predictive animation the system draws. `touch-gestures` owns that side.

## Deep links

| Stack | Where the route is declared | Where the incoming link is received |
|---|---|---|
| Jetpack Compose | `navDeepLink` on the destination | intent filters in the manifest, verified as App Links |

Two paths to test, always: the app already running, and the app killed. Only the second one builds the stack from nothing, and it is the one that fails.

## State restoration

| Stack | Mechanism | Notes |
|---|---|---|
| Jetpack Compose | `rememberSaveable`, `SavedStateHandle`, and the nav graph's own saved state | pass `saveState` and `restoreState` when switching top-level destinations, or each switch resets that branch |

Restore the place. Refetch the content.
