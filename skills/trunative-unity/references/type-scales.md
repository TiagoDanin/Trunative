# Type scales

Lookup only. The rules live in `heuristics/typography.md`. Open this file for a specific role, size or weight, not as background reading.

## Material 3

Fifteen baseline roles. Weight is 400 everywhere except title medium, title small and the three labels, which are 500. Nothing in the baseline scale is 600 or 700.

| Role | Size | Line height | Weight | Used for |
|---|---|---|---|---|
| displayLarge | 57sp | 64sp | 400 | hero and onboarding text |
| displayMedium | 45sp | 52sp | 400 | large feature text |
| displaySmall | 36sp | 44sp | 400 | prominent display |
| headlineLarge | 32sp | 40sp | 400 | screen titles |
| headlineMedium | 28sp | 36sp | 400 | section headers |
| headlineSmall | 24sp | 32sp | 400 | card titles |
| titleLarge | 22sp | 28sp | 400 | top app bar title |
| titleMedium | 16sp | 24sp | 500 | tabs, navigation |
| titleSmall | 14sp | 20sp | 500 | subtitles |
| bodyLarge | 16sp | 24sp | 400 | primary body text |
| bodyMedium | 14sp | 20sp | 400 | secondary body text |
| bodySmall | 12sp | 16sp | 400 | captions |
| labelLarge | 14sp | 20sp | 500 | buttons, prominent labels |
| labelMedium | 12sp | 16sp | 500 | chips, smaller labels |
| labelSmall | 11sp | 16sp | 500 | timestamps, annotations |

Floors: body content does not go below 12sp, labels not below 11sp. Reach these through `MaterialTheme.typography`, never as literal sizes, and always in `sp`.

M3 Expressive adds fifteen *emphasized* styles that run parallel to these, at heavier weights, for selection, actions, headlines and editorial moments. They are a second scale to reach into deliberately, not permission to raise the weight of the first one. Where the project ships a variable face, the same feature set covers the expressive axes (weight, grade, width, optical size); those belong to display and headline, which are short enough to carry them.

## iOS text styles

Sizes at the Large content size, which is the default.

| Style | Size | Line height | Weight |
|---|---|---|---|
| largeTitle | 34pt | 41pt | Regular |
| title1 | 28pt | 34pt | Regular |
| title2 | 22pt | 28pt | Regular |
| title3 | 20pt | 25pt | Regular |
| headline | 17pt | 22pt | Semibold |
| body | 17pt | 22pt | Regular |
| callout | 16pt | 21pt | Regular |
| subheadline | 15pt | 20pt | Regular |
| footnote | 13pt | 18pt | Regular |
| caption1 | 12pt | 16pt | Regular |
| caption2 | 11pt | 13pt | Regular |

Floor is 11pt (`caption2`), body is 17pt. Reach these through the text styles, so Dynamic Type carries them; a custom face is registered against a style with `relativeTo:` or `UIFontMetrics` rather than given a fixed size.

Second-hand tables often print the titles as Bold. They are Regular. The only style that ships semibold is `headline`, and it is the same 17pt as `body`.

Letter spacing is not listed here. It comes from the theme, and a guessed tracking value is worse than no value at all.

## What the two scales agree on

- Large text is not bold text. Both platforms grow the size and leave the weight at the regular end.
- Weight above regular is reserved for the small roles that label a control: M3 labels and title medium at 500, iOS `headline` at semibold.
- The floor is 11 in both, and it is for genuinely peripheral text.
- Line height sits near 1.2 at the display end and near 1.4 to 1.5 at the body end. It is a ratio that widens as the text gets smaller, not a constant.
