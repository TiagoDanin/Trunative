# Navigation containers and restoration, per stack

Lookup only. The rules live in `heuristics/navigation.md`. Open this file for one container, one API name or one restoration mechanism, not as background reading.

The concept is portable and the name is not. Pick the row for the relationship, then read the column for the stack in `STACK.md`.

## Containers

| Container | React Native |
|---|---|
| Pushed screen | native stack, `navigation.navigate` |
| Top-level destinations | bottom tab navigator, one stack inside each tab |
| Bottom sheet | a sheet library, or a native stack screen with `presentation: 'formSheet'` |
| Full screen cover | native stack screen with `presentation: 'fullScreenModal'` |
| Alert or dialog | `Alert.alert` |

Bare React Native ships no bottom sheet. Reaching for one means adding a dependency, which is a `STACK.md` decision rather than a detail.

## Back and dismissal

| Need | React Native |
|---|---|
| Dismiss the current surface | `navigation.goBack()` |
| Intercept back | `beforeRemove` listener, plus `BackHandler` for the Android button |
| Guard unsaved work | `beforeRemove` with `e.preventDefault()` |

Android's back callback is the modern one, not an override of the old back method, which is what keeps the predictive animation the system draws. `touch-gestures` owns that side.

## Deep links

| Stack | Where the route is declared | Where the incoming link is received |
|---|---|---|
| React Native | the `linking` config, with `getStateFromPath` for a synthesized stack | `Linking.getInitialURL` for a cold start, the `url` event while running |

Two paths to test, always: the app already running, and the app killed. Only the second one builds the stack from nothing, and it is the one that fails.

## State restoration

| Stack | Mechanism | Notes |
|---|---|---|
| React Native | persist the navigator state from `onStateChange` and feed it back as `initialState` | gate the first render until the saved state has loaded |

Restore the place. Refetch the content.
