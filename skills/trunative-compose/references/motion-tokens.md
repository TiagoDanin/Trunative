# Motion tokens and APIs

Lookup only. The rules live in `heuristics/motion.md`. Open this file for a specific token, value or API name, not as background reading.

## Material durations

Sixteen tokens, reached as `?attr/motionDuration<Name>` or through `MotionUtils.resolveThemeDuration`. Available from the Material components library 1.6.0.

| Token | Value | Token | Value |
|---|---|---|---|
| Short1 | 50ms | Long1 | 450ms |
| Short2 | 100ms | Long2 | 500ms |
| Short3 | 150ms | Long3 | 550ms |
| Short4 | 200ms | Long4 | 600ms |
| Medium1 | 250ms | ExtraLong1 | 700ms |
| Medium2 | 300ms | ExtraLong2 | 800ms |
| Medium3 | 350ms | ExtraLong3 | 900ms |
| Medium4 | 400ms | ExtraLong4 | 1000ms |

The rule attached to the table: duration rises as the area covered or the distance travelled rises. A chip's tint and a full screen cover do not share a number.

## Material easing

Seven tokens, reached as `?attr/motionEasing<Name>Interpolator`. Emphasized is the styled set, standard the utility set.

| Token | Curve |
|---|---|
| Standard | `cubic-bezier(0.2, 0, 0, 1)` |
| StandardDecelerate | `cubic-bezier(0, 0, 0, 1)` |
| StandardAccelerate | `cubic-bezier(0.3, 0, 1, 1)` |
| Emphasized | path `M 0,0 C 0.05,0 0.133333,0.06 0.166666,0.4 C 0.208333,0.82 0.25,1 1,1` |
| EmphasizedDecelerate | `cubic-bezier(0.05, 0.7, 0.1, 1)` |
| EmphasizedAccelerate | `cubic-bezier(0.3, 0, 0.8, 0.15)` |
| Linear | `cubic-bezier(0, 0, 1, 1)` |

## Material springs

Three speeds by two kinds. Fast is for a small component such as a switch, slow for a full screen transition, default for everything in between. Spatial springs move a thing (position, size, shape) and are allowed to overshoot; effects springs carry color and opacity, where overshoot is a defect.

Standard scheme. These are the six Views theme attributes (`?attr/motionSpring<Speed><Kind>`, library 1.13.0 and up) and the Compose `StandardMotionTokens`, at identical values.

| Spec | Damping | Stiffness |
|---|---|---|
| fast spatial | 0.9 | 1400 |
| fast effects | 1.0 | 3800 |
| default spatial | 0.9 | 700 |
| default effects | 1.0 | 1600 |
| slow spatial | 0.9 | 300 |
| slow effects | 1.0 | 800 |

Expressive scheme, Compose only. The Views theme does not publish these, so a rule that says "use the expressive spring" is not implementable from XML attributes alone.

| Spec | Damping | Stiffness |
|---|---|---|
| fast spatial | 0.6 | 800 |
| fast effects | 1.0 | 3800 |
| default spatial | 0.8 | 380 |
| default effects | 1.0 | 1600 |
| slow spatial | 0.8 | 200 |
| slow effects | 1.0 | 800 |

In Compose the scheme is a theme value, not a per-animation choice: `MaterialTheme.motionScheme`, holding `MotionScheme.standard()` or `MotionScheme.expressive()`, exposing `defaultSpatialSpec()`, `fastSpatialSpec()`, `slowSpatialSpec()` and the three effects equivalents, and no duration or easing at all. `MaterialExpressiveTheme` defaults the scheme to `expressive()`.

Compose spring constants outside Material: `Spring.DampingRatioNoBouncy` 1.0, `LowBouncy` 0.75, `MediumBouncy` 0.5, `HighBouncy` 0.2; `Spring.StiffnessVeryLow` 50, `StiffnessLow` 200, `StiffnessMediumLow` 400, `StiffnessMedium` 1500, which is what a bare `spring()` uses.

## Where motion lives per stack

| Stack | Animate | Continuity across screens |
|---|---|---|
| SwiftUI | `withAnimation`, `.animation(_:value:)`, `Animation.spring(response:dampingFraction:)` | `.navigationTransition(.zoom(sourceID:in:))` with `.matchedTransitionSource(id:in:)`, iOS 18; `matchedGeometryEffect` before that |
| UIKit | `UIView.animate(springDuration:bounce:)`, iOS 17; `UIViewPropertyAnimator` | `preferredTransition = .zoom(options:sourceViewProvider:)`, iOS 18 |
| Compose | `animate*AsState`, `AnimatedVisibility`, `AnimatedContent`, `Crossfade` | `SharedTransitionLayout` with `Modifier.sharedElement` or `sharedBounds` |
| Views | `SpringAnimation` and `SpringForce` from dynamicanimation | `com.google.android.material.transition`: container transform, shared axis, fade through, fade |
| Flutter | implicit `Animated*` widgets, `AnimationController`, `TweenAnimationBuilder` | `Hero`, `PageRouteBuilder` |
| React Native | Reanimated worklets; `Animated` with `useNativeDriver: true` | `react-navigation` presets, `react-native-screens` |
| Mobile web | CSS transitions and keyframes, Web Animations API | View Transitions where supported |

## Reduced motion flags per stack

| Stack | Read |
|---|---|
| SwiftUI | `@Environment(\.accessibilityReduceMotion)` |
| UIKit | `UIAccessibility.isReduceMotionEnabled`, plus `prefersCrossFadeTransitions` before substituting a cross fade; `reduceMotionStatusDidChangeNotification` to react to a change |
| Android | no single API on phones: `ValueAnimator.areAnimatorsEnabled()` from API 26, or `Settings.Global.ANIMATOR_DURATION_SCALE` and `TRANSITION_ANIMATION_SCALE`. `LocalReduceMotion` exists only on Wear |
| Flutter | both of `MediaQuery.disableAnimationsOf(context)` and `AccessibilityFeatures.reduceMotion`, because the first carries Android and the second carries iOS |
| React Native | `AccessibilityInfo.isReduceMotionEnabled()`, and the `reduceMotionChanged` event; on Android it tracks the transition animation scale |
| Mobile web | `@media (prefers-reduced-motion: reduce)`, equivalent to the bare `@media (prefers-reduced-motion)` |

The user-facing names differ. On iOS the setting is Reduce Motion, with Prefer Cross-Fade Transitions beside it. On Android it is Remove animations, under Color and motion in Accessibility.
