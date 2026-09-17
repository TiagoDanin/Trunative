# Navigation containers and restoration, per stack

Lookup only. The rules live in `heuristics/navigation.md`. Open this file for one container, one API name or one restoration mechanism, not as background reading.

The concept is portable and the name is not. Pick the row for the relationship, then read the column for the stack in `STACK.md`.

## Containers

| Container | SwiftUI |
|---|---|
| Pushed screen | `NavigationStack` with `navigationDestination` |
| Top-level destinations | `TabView` with `Tab` |
| Bottom sheet | `.sheet` with `.presentationDetents` |
| Full screen cover | `.fullScreenCover` |
| Alert or dialog | `.alert`, `.confirmationDialog` |

Bare React Native ships no bottom sheet. Reaching for one means adding a dependency, which is a `STACK.md` decision rather than a detail.

## Back and dismissal

| Need | SwiftUI |
|---|---|
| Dismiss the current surface | `@Environment(\.dismiss)` |
| Intercept back | `.interactiveDismissDisabled`, then present the question yourself |
| Guard unsaved work | `.interactiveDismissDisabled(hasEdits)` plus a confirmation dialog |

Android's back callback is the modern one, not an override of the old back method, which is what keeps the predictive animation the system draws. `touch-gestures` owns that side.

## Deep links

| Stack | Where the route is declared | Where the incoming link is received |
|---|---|---|
| SwiftUI | `NavigationPath` rebuilt from the URL | `.onOpenURL`, plus Associated Domains for universal links |

Two paths to test, always: the app already running, and the app killed. Only the second one builds the stack from nothing, and it is the one that fails.

## State restoration

| Stack | Mechanism | Notes |
|---|---|---|
| SwiftUI | `@SceneStorage` for per screen state, plus a codable `NavigationPath` | `@State` does not survive process death |

Restore the place. Refetch the content.
