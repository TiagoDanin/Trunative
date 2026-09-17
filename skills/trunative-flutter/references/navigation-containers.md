# Navigation containers and restoration, per stack

Lookup only. The rules live in `heuristics/navigation.md`. Open this file for one container, one API name or one restoration mechanism, not as background reading.

The concept is portable and the name is not. Pick the row for the relationship, then read the column for the stack in `STACK.md`.

## Containers

| Container | Flutter |
|---|---|
| Pushed screen | `Navigator.push`, `MaterialPageRoute`, `context.push` on GoRouter |
| Top-level destinations | `NavigationBar` in a `Scaffold`, plus `IndexedStack` or a `Navigator` per branch |
| Bottom sheet | `showModalBottomSheet` |
| Full screen cover | `MaterialPageRoute(fullscreenDialog: true)` |
| Alert or dialog | `showDialog` with `AlertDialog` or `CupertinoAlertDialog` |

Bare React Native ships no bottom sheet. Reaching for one means adding a dependency, which is a `STACK.md` decision rather than a detail.

## Back and dismissal

| Need | Flutter |
|---|---|
| Dismiss the current surface | `Navigator.pop` |
| Intercept back | `PopScope` with `canPop` and `onPopInvokedWithResult` |
| Guard unsaved work | `PopScope(canPop: !hasEdits)` |

Android's back callback is the modern one, not an override of the old back method, which is what keeps the predictive animation the system draws. `touch-gestures` owns that side.

## Deep links

| Stack | Where the route is declared | Where the incoming link is received |
|---|---|---|
| Flutter | route patterns on GoRouter or the router delegate | `onGenerateRoute`, or the platform link plugin |

Two paths to test, always: the app already running, and the app killed. Only the second one builds the stack from nothing, and it is the one that fails.

## State restoration

| Stack | Mechanism | Notes |
|---|---|---|
| Flutter | `RestorationMixin` with a `restorationScopeId`, and `RestorableProperty` values | restoration is off until a scope id is set |

Restore the place. Refetch the content.
