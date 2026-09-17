# Navigation containers and restoration, per stack

Lookup only. The rules live in `heuristics/navigation.md`. Open this file for one container, one API name or one restoration mechanism, not as background reading.

The concept is portable and the name is not. Pick the row for the relationship, then read the column for the stack in `STACK.md`.

## Containers

| Container | Mobile web |
|---|---|
| Pushed screen | History API `pushState`, or the router's push |
| Top-level destinations | one route prefix per section |
| Bottom sheet | `<dialog>` positioned to the bottom edge |
| Full screen cover | a route of its own |
| Alert or dialog | `<dialog>` with `showModal()` |

Bare React Native ships no bottom sheet. Reaching for one means adding a dependency, which is a `STACK.md` decision rather than a detail.

## Back and dismissal

| Need | Mobile web |
|---|---|
| Dismiss the current surface | `history.back()` |
| Intercept back | `popstate` with a pushed sentinel entry |
| Guard unsaved work | `beforeunload` for the tab, the sentinel for in-app |

Android's back callback is the modern one, not an override of the old back method, which is what keeps the predictive animation the system draws. `touch-gestures` owns that side.

## Deep links

| Stack | Where the route is declared | Where the incoming link is received |
|---|---|---|
| Mobile web | the URL itself | the router's own resolution |

Two paths to test, always: the app already running, and the app killed. Only the second one builds the stack from nothing, and it is the one that fails.

## State restoration

| Stack | Mechanism | Notes |
|---|---|---|
| Mobile web | `history.state` for the route, `sessionStorage` for the screen | `sessionStorage` clears with the tab |

Restore the place. Refetch the content.
