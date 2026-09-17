# Launch surface configuration, per stack

Lookup only. The rules live in `heuristics/splashscreen.md`. Open this file for one key, one attribute or one dismissal API, not as background reading.

Nothing here is a design decision. The decision is in the heuristic; this is where the name of the knob lives.

## iOS: the two supported routes

Pick one. Both satisfy the same requirement.

| Route | Key | What it holds |
|---|---|---|
| Property list | `UILaunchScreen` dictionary in `Info.plist` | `UIColorName` (background color), `UIImageName`, `UIImageRespectsSafeAreaInsets`, plus `UINavigationBar`, `UITabBar`, `UIToolbar` to draw empty bars |
| Interface file | `UILaunchStoryboardName` pointing at `LaunchScreen.storyboard` | UIKit views only |
| Per URL scheme | `UILaunchScreens` | one launch screen per scheme |
| Legacy | `UILaunchImages` | deprecated, do not add it |

The storyboard route is deliberately inert: one root `UIView` or `UIViewController`, UIKit classes only, no outlets, no actions, no custom classes, no user defined runtime attributes. Nothing in it executes.

The launch screen is required on iOS and iPadOS. No size, resolution or file weight limit is published for it, because the property list route takes a color and the storyboard route is constraint based.

A launch that never draws its first frame is killed by the system watchdog. The crash carries termination reason `SPRINGBOARD`, code `0x8badf00d`, and a `scene-create` watchdog event.

## Android: theme attributes

Two sets with the same job. The compat set has no `android:` prefix and is the one to use, because it produces the same surface back to older releases.

| Purpose | Platform (Android 12+) | Compat (`androidx.core:core-splashscreen`) |
|---|---|---|
| Window background, one opaque color | `android:windowSplashScreenBackground` | `windowSplashScreenBackground` |
| Centre icon | `android:windowSplashScreenAnimatedIcon` | `windowSplashScreenAnimatedIcon` |
| Icon animation duration | `android:windowSplashScreenAnimationDuration` | `windowSplashScreenAnimationDuration` |
| Circle behind the icon | `android:windowSplashScreenIconBackgroundColor` | `windowSplashScreenIconBackgroundColor` |
| Theme applied once the surface goes | (the activity theme) | `postSplashScreenTheme`, required |
| Icon size | (fixed) | `splashScreenIconSize` |
| Branding image at the bottom | `android:windowSplashScreenBrandingImage` | not present |
| Always show the icon | `android:windowSplashScreenBehavior`, value `icon_preferred` | not present |

Compat themes: `Theme.SplashScreen` as the parent, `Theme.SplashScreen.IconBackground` when the icon sits on a circle. Some Android documentation writes the icon background attribute without the `Color` suffix; the library only declares `windowSplashScreenIconBackgroundColor`.

Setting `android:windowBackground` in a launch theme is the pre Android 12 pattern. From Android 12 the system discards that custom splash and shows its own default one instead, so the configured background never appears. A dedicated splash Activity is the separate case, and it produces two surfaces rather than one wrong one. Do not pin a `core-splashscreen` version from prose; read the current one from the dependency catalogue.

## Android: holding and dismissing

| Need | API |
|---|---|
| Install the surface | `installSplashScreen(activity)`, called before `super.onCreate()` |
| Hold it | `setKeepOnScreenCondition { }`, returning `true` to hold. Compat only |
| Hold it without the library | `ViewTreeObserver.OnPreDrawListener` on `android.R.id.content`, returning `false` to suspend |
| Own the exit | `setOnExitAnimationListener { }`, then `SplashScreenViewProvider.remove()` |
| Remaining icon time | `iconAnimationStartMillis`, `iconAnimationDurationMillis` |

The framework interface `android.window.SplashScreen` carries only `setOnExitAnimationListener`, `clearOnExitAnimationListener` and `setSplashScreenTheme`. There is no keep on screen condition outside the compat library.

## Asset geometry, Android

| Asset | Size | Visible area |
|---|---|---|
| Icon with an icon background | 240x240 dp | fits a 160 dp circle |
| Icon without an icon background | 288x288 dp | fits a 192 dp circle |
| Animated vector icon | 432 dp icon area | 288 dp inner area |
| Branding image | 200x80 dp | leave it empty |

One third of the icon foreground is masked. Anything drawn in the outer third does not survive.

## Flutter

| Platform | Where |
|---|---|
| iOS | `ios/Runner/Base.lproj/LaunchScreen.storyboard`, assets in the `LaunchImage` set inside `Runner/Assets.xcassets` |
| Android | `LaunchTheme` in `android/app/src/main/res/values/styles.xml`, with a `values-night` copy for dark |
| Android handoff | manifest `meta-data` on the Flutter activity, `io.flutter.embedding.android.NormalTheme` pointing at `@style/NormalTheme` |

The Flutter template still teaches `android:windowBackground` on `LaunchTheme`. On Android 12 and up, put the `windowSplashScreen*` attributes there instead, or add the compat library. Keep `NormalTheme` on the same background color as the first Flutter frame.

## Expo

| Need | Where |
|---|---|
| Configure | the `expo-splash-screen` config plugin, under `expo.plugins` in the app config |
| Properties | `backgroundColor`, `image`, `imageWidth`, `resizeMode` (`contain`, `cover`, `native`), `dark` with its own `backgroundColor` and `image`, plus per platform `android` and `ios` blocks |
| Hold it | `SplashScreen.preventAutoHideAsync()`, called in module scope rather than inside a component |
| Dismiss it | `SplashScreen.hide()` or `SplashScreen.hideAsync()` |
| Exit options | `SplashScreen.setOptions({ duration, fade })`, `fade` iOS only |

The icon must be a PNG. Any other format fails the production build. A 1024x1024 source with a transparent background is the recommended input.

## Bare React Native

No core API exists. The surface is the platform's own, `UILaunchScreen` or the storyboard on iOS and `Theme.SplashScreen` on Android, reached either directly or through a package recorded in `STACK.md`.

## Mobile web

There is no OS drawn launch surface for a page. An installed web app gets one from the manifest: `background_color`, `theme_color`, `name` and the icon set. A first paint that arrives quickly is the only equivalent a browser tab has.
