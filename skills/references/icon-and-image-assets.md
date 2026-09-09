# Icon and image assets, per stack

Lookup only. The rules live in `heuristics/icons-and-imagery.md`. Open this file for one size, one axis or one API name, not as background reading.

## Symbol sets

| Set | Axes and variants | What it gives for free |
|---|---|---|
| SF Symbols (iOS) | 9 weights, ultralight to black, each mapped to a San Francisco font weight; 3 scales (small, medium, large) defined against the cap height; outline, fill, slash and enclosed variants | Baseline information on every symbol, Dynamic Type scaling when configured with a text style, and per-script variants that follow the device language |
| Material Symbols (Android, web) | One variable font in Outlined, Rounded and Sharp. `opsz` 20 to 48, default 24. `wght` 100 to 700, default 400. `GRAD` -50 to 200, default 0. `FILL` 0 to 1, default 0 | One file for every weight and fill; `FILL` is animatable for selection |

Axis meanings: `wght` is the stroke weight and moves the overall size a little. `GRAD` changes thickness more finely with almost no size change; -50 is the value for light artwork on a dark ground. `opsz` retunes the stroke so the glyph looks the same at a different size. `FILL` is for state.

Only the 20 px and 24 px Material Symbols are drawn on a perfect pixel grid.

Flutter's bundled `Icons` is the older Material Icons set, while its `Icon` widget already takes `fill`, `weight`, `grade` and `opticalSize`. A project that wants current Material Symbols imports the font or the SVGs itself.

`IconThemeData.fallback()` in Flutter: size 24.0, fill 0.0, weight 400.0, grade 0.0, opticalSize 48.0. Note the mismatch: the default optical size is 48 while the default size is 24. `applyTextScaling` resolves to false unless set on the widget or the `IconTheme`.

Compose `Icon` is 24.dp when the painter has no intrinsic size, and is tinted with `LocalContentColor.current`. The `material-icons` and `material-icons-extended` artifacts are no longer recommended by Google.

## Raster variants, by stack

| Stack | How a variant is named | Notes |
|---|---|---|
| iOS asset catalog | `@2x` and `@3x` filename suffixes | iOS ships at 2x and 3x. `scale` and `nativeScale` can differ |
| Android resources | `res/drawable-<bucket>/` | A vector drawable goes in the default `res/drawable/` with no per-density copy |
| Flutter | `2.0x/name.png` beside `name.png` | Nominal densities 1.5x, 2.0x, 3.0x, 4.0x. List only the main asset or its folder in `pubspec.yaml` |
| React Native | `name@2x.png` sibling files, one `require` | The closest density is picked when the exact one is missing. A `uri` source carries no dimensions |

## Android density buckets

| Bucket | Approx dpi | Scale | A 48 px mdpi bitmap becomes |
|---|---|---|---|
| ldpi | 120 | 0.75x | 36 px |
| mdpi | 160 (baseline) | 1x | 48 px |
| hdpi | 240 | 1.5x | 72 px |
| xhdpi | 320 | 2x | 96 px |
| xxhdpi | 480 | 3x | 144 px |
| xxxhdpi | 640 | 4x | 192 px |

Ratio 3:4:6:8:12:16. `px = dp * (dpi / 160)`, converted with `TypedValue.applyDimension()` rather than hardcoded. `nodpi` is never scaled. `sp` matches `dp` until the user changes the text size, and is never used for layout.

## Vector drawables

Android has no native SVG. Convert with Vector Asset Studio (`res` > New > Vector Asset). Keep one at 200 by 200 dp or under, past which it takes too long to draw. Author a tintable icon in solid black (`android:fillColor="#FF000000"`). `VectorDrawable` and `AnimatedVectorDrawable` land in API 21, with `VectorDrawableCompat` and `AnimatedVectorDrawableCompat` below it.

## Formats

Flat artwork that scales: PDF or SVG. Bitmap work: de-interlaced PNG, or an 8-bit palette where 24-bit colour is not needed. Photographs: JPEG or HEIC. Design at the lowest resolution and scale up, keeping control points on whole values so the shape stays on the raster grid at 2x and 3x.

## Fill and fit

| Stack | Fill the frame and crop | Fit inside the frame |
|---|---|---|
| SwiftUI | `.scaledToFill()` with `.clipped()` | `.scaledToFit()` |
| UIKit | `.scaleAspectFill` | `.scaleAspectFit` |
| Compose | `ContentScale.Crop` | `ContentScale.Fit` |
| Flutter | `BoxFit.cover` | `BoxFit.contain` |
| React Native | `resizeMode="cover"` | `resizeMode="contain"` |
| Mobile web | `object-fit: cover` | `object-fit: contain` |

## Dark variants

iOS: a second appearance inside the asset catalog entry, resolved by the system. Android: `res/drawable-night/` beside `res/drawable/`. Flutter and React Native resolve the file themselves from the platform brightness.

## App icon

| Platform | Canvas | Structure |
|---|---|---|
| iOS | 1024 by 1024 px, square, no transparency, no rounded corners | Layered: one background plus one or more foreground layers, assembled in Icon Composer. Prefer SVG or PDF layers; PNG only for mesh gradients and raster art. Ship layers unmasked |
| Android adaptive | 108 by 108 dp layers | `<adaptive-icon>` in `res/mipmap-anydpi-v26/ic_launcher.xml` with `<background>`, `<foreground>` and `<monochrome>`. Referenced from the manifest as `android:icon`, with `android:roundIcon` alongside it for the launchers that ask for a round variant |
| Play listing | 512 by 512 px, 32-bit PNG with alpha, 1024 KB maximum | Feature graphic 1024 by 500 px, JPEG or 24-bit PNG, no alpha |

Adaptive icon geometry: a 72 dp masked viewport out of the 108 dp canvas, with the outer 18 dp on each side reserved for masking and for parallax or pulse effects. Keep the mark inside the 66 dp safe box and at least 48 dp across. Layers carry no mask and no outline shadow, and vectors are preferred over bitmaps.

Themed icons need the `<monochrome>` layer. User theming arrives in Android 13 (API 33). From Android 16 QPR 2 the system themes icons for apps that supply no monochrome layer.

iOS appearances: default, dark, clear light, clear dark, tinted light, tinted dark. The system generates any variant not supplied, and each alternate app icon needs its own set. Colour spaces: sRGB, Gray Gamma 2.2, Display P3.

Let the system draw the specular highlight, the shadow between layers, the bevel, the blur and the glow. Avoid soft or feathered edges on foreground shapes, extremely thin strokes and sharp corners.

Licensing: system symbols may not be used in an app icon, a logo or any other trademarked use, and platform hardware may not be reproduced.

Expo keys: `icon`; `ios.icon` taking either a path to a `.icon` directory (SDK 54 and later) or an object of `light`, `dark` and `tinted` PNGs; `android.icon`; `android.adaptiveIcon.foregroundImage`, `.backgroundColor`, `.backgroundImage` and `.monochromeImage`.

## Loading APIs

Android decodes at the size drawn: `BitmapFactory.Options.inJustDecodeBounds` reads `outWidth` and `outHeight` without allocating, then `inSampleSize` decodes down. In practice a library does this: Glide, Coil (`AsyncImage`), Picasso or Fresco. Compose loads bundled assets with `painterResource`, which handles PNG, JPEG, WEBP, vector drawables and animated vector drawables. SwiftUI has `AsyncImage` for network images and `Image(decorative:)` for an unlabelled one.
