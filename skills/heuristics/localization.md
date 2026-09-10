# Localization

A phone carries an ordered list of languages, a separate region, a calendar and a digit preference, and the user can point one app at a language the rest of the system is not using. None of that is yours to set. The app renders in a language nobody on the team reads, at a length nobody typed, on a layout that may run the other way.

Shipping one language today is fine. Almost everything in this file costs nothing while the app has one language and is a rewrite once it has forty screens, which is the reason it belongs in the build step rather than in a later project.

## <Rule id="l10n-strings" description="No user-facing text lives in code" />

Every string a person reads comes out of the catalogue under a key: a String Catalog on iOS, `strings.xml` on Android, ARB files in Flutter, locale files in a React Native or web project. A literal sitting in a widget is what this file is here to find, and it survives review because nothing on the device gives it away: the screen looks finished until the phone is set to another language and one label stays behind in English.

- The catalogue holds whole sentences. Two literals concatenated cannot be reordered by a translator, and word order is the first thing a language changes.
- Accessibility labels, error text, empty states, notification copy and anything a formatter returns are all user-facing and all belong in the catalogue. So do the two that sit outside the layout and get missed for exactly that reason: the iOS usage descriptions (`perm-purpose-string`) and the Android notification channel names (`notify-channels`).
- Text the server composes never reaches the catalogue at all: a push payload, a mail, a message an API returns. The backend is told which language to answer in, and what it is told is the language the app resolved rather than the one the device is set to.
- Machine-readable strings do not: keys, URLs, analytics event names, log lines. Those stay literal.
- Every key carries a comment saying where it appears and what it does. A translator sees the string and nothing around it.

## <Rule id="l10n-direction" evidence="device" description="Leading and trailing, never left and right" />

Under a right to left language the layout mirrors as a whole: the back chevron, the row disclosure, the progress fill, the drawer edge, the order of everything sitting in a row. The system does this for free, but only for the attributes that describe direction rather than sides.

- iOS: leading and trailing constraints, and natural text alignment. A label pinned to the left stays on the left in Arabic.
- Android: `start` and `end` in place of `left` and `right` on gravity, padding, margin, drawables and relative positioning, plus `android:supportsRtl="true"` on the application element, without which none of them resolve. Compose reads `LocalLayoutDirection`, and in a custom layout `placeRelative()` mirrors where `place()` does not.
- Flutter: `EdgeInsetsDirectional`, `AlignmentDirectional`, and direction taken from `Directionality`.
- A value inserted into a translated sentence carries its own direction. A name, an ID or a file name dropped into an Arabic sentence drags the punctuation around it to the wrong end unless it is wrapped for bidirectional text.
- The back control mirrors with everything else, and on iOS the edge that pops the screen mirrors with it, so the interactive pop is a swipe in from the trailing edge.

## <Rule id="l10n-no-mirror" evidence="device" description="Some things are physical and do not turn around" />

Mirroring is the default. These are the exceptions, and each one gets pinned to an absolute direction on purpose:

- media transport and the timeline scrubber, which follow the recording rather than the text;
- clocks, and anything else running clockwise;
- musical notation;
- chart axes, which hold their orientation so the plot stays readable;
- photographs, illustrations and artwork, unless the image itself is carrying a direction.

An arrow decides its own case: an arrow that means forward or back mirrors, an arrow that means left or right does not. The SF Symbols names draw the same line, with `.forward` and `.backward` flipping while `.left` and `.right` stay put. On Android an asset opts in with `android:autoMirrored="true"`, and on iOS a view carries a semantic content attribute whose playback value is exactly the scrubber case.

Phone numbers are laid out left to right in every language, including the right to left ones.

## <Rule id="l10n-expansion" evidence="device" description="The label you sized is the shortest one it will ever be" />

Budget by the length of the source string, because the short ones grow the most. Up to 10 characters, expect two to three times the width. From 11 to 20, about double. From 21 to 30, three quarters again. From 31 to 50, half again. From 51 characters up it settles near a third more. Chinese and Japanese go the other way and leave a button looking half empty.

The breakage is `type-strings` and `layout-width`. What this rule adds is which strings are at risk: a tab label, a chip and a button verb are the shortest strings in the app, so they are the ones that double. Decide per label whether it wraps to a second line, steps down the scale, or moves to a stacked layout, and never let it truncate the verb (`button-label`).

## <Rule id="l10n-format" description="The locale formats it, not a pattern someone typed" />

Dates, times, numbers, currency, percentages, byte counts, measurements and durations all come from the platform formatter carrying the user's locale, a value the device already holds and the reader has already set: `formatted(.currency(code:))` and the `FormatStyle` family on iOS, `NumberFormat` and `DateFormat` on Android and in Flutter's `intl`, `Intl.NumberFormat` on the web.

- `dd/MM/yyyy` is a guess, and it is the wrong guess for the reader who takes 03/04 as April. Ask for a date style, not a pattern, and take the calendar from the locale as well (`Calendar.current`), because the year on screen in Thailand or under a Hijri calendar is not the Gregorian one. What the user types back is parsed against that same locale, so a comma typed on a German keypad is a decimal point.
- Digits are not universal. Android alone carries 27 Arabic locales, some preferring ASCII digits and others native ones, so a number is substituted at runtime even when its value was known while the code was being written, and a percent sign or a currency symbol is never concatenated onto the end of it.
- Currency is a code and an amount handed to a formatter, which decides the symbol, which side it sits on, and the separators. A hardcoded `$` is a bug in two directions at once.
- Units follow the region's measurement system, which is not the same setting as the language. Someone reads Japanese and lives in Germany.

## <Rule id="l10n-plurals" description="A count and a string cannot be glued together" />

Plural forms live in the platform's plural resource: `<plurals>` on Android, read through `pluralStringResource` in Compose, the plural entries in a String Catalog or stringsdict on iOS, `Intl.plural` in Flutter. Six categories exist across languages, `zero`, `one`, `two`, `few`, `many` and `other`, and which one a number selects is a fact about the language rather than about the number.

- English uses two of the six and Arabic uses all of them. An `if (count == 1)` in the app ships English grammar to every other language.
- The categories are grammatical, so one language never selects `zero` even when the count is zero, and another selects `other` for every count there is.
- If the sentence does not contain the number, it is not a plural. Use an ordinary key.
- Gender and any other grammatical selection go through the same resource, never through string surgery in the app.

## <Rule id="l10n-script" evidence="device" description="The face has to have the letters, and the line has to have the room" />

`type-face` picks the family. This is whether it can draw the languages the app ships.

- A bundled font usually covers Latin and stops there. Check every shipped script in the face that will actually render it, and inspect the fallback chain rather than assuming one, because a missing glyph arrives on screen as a box.
- Non-Latin scripts are taller and want more space between lines: Thai, Devanagari and Arabic in a Nastaliq face all clip inside a box measured against English. Vietnamese does the same without leaving the Latin alphabet, because its tone marks stack above and below the vowel.
- So the leading is a ratio of the font size rather than a point value, taking the ratio `type-roles` sets for that role, and the box it sits in follows its content (`layout-width`).

## <Rule id="l10n-personal" description="Names, addresses and phone numbers have no universal shape" />

- One field for the full name, in the order the person types it. Two required fields for a first and last name shut out anyone with a single name and misfile anyone whose family name comes first. They ship only where an outside format demands the split, a ticket, a KYC check or a card network, and `STACK.md` names which one.
- Address parts follow from the country, which is why the country is picked first. A required postcode, a dropdown of US states and a fixed city, state and zip row are one country's paper form.
- Deriving a city and a state from a postal code, which `form-count` asks for, is a prefill in the countries whose postal system carries it, never a field taken away from the rest. The device region is where the country guess comes from and not where the answer comes from, since people travel and ship abroad.
- A phone number keeps its country code and is not forced through a fixed mask. Validate it loosely and format it for display. Formatting as it is typed is `form-input`, and the mask it uses belongs to the country the number is in. The keyboard under it is `touch-keyboard`.

## <Rule id="l10n-collate" description="A to Z is not the same alphabet everywhere" />

Sorting display names by code point puts accented words after Z, splits the cases apart, and produces an order no reader recognises. Use the platform's locale-aware collator: `Collator` on Android, `localizedStandardCompare` on iOS.

- Section headers and the fast-scroll rail down a long list come from that collator, `UILocalizedIndexedCollation` where iOS builds the index for you, never from the first character of the string. Ch, Ñ and Ø are letters in their own right where the list is being read, and this is what `list-sections` is built from.
- Search matches without regard to case, accents or character width, so typing `jose` finds José.

## <Rule id="l10n-per-app" description="The app language and the system language are two different facts" />

Both platforms let someone point a single app at a language of its own, so the app cannot read the system language and assume that is what it is rendering in.

- Android needs `android:localeConfig` listing the shipped locales before the entry appears in system Settings, and `AppCompatDelegate.setApplicationLocales` to set it from code, with an empty list meaning back to the system default. The Settings entry itself arrives with Android 13, and below that the same call still switches the language inside the app.
- iOS walks the user's ordered preferred languages, takes the first one the bundle has, falls back from a regional variant to the generic language, and lands on the development region only when nothing matched. Android walks the same shape: the exact locale, then the language without its region, then another region of that language, then the next language the user listed.
- So store resources under the widest parent dialect the strings are correct for, and a device asking for a country you never shipped still resolves to something readable.
- An in-app language picker that writes to your own preference store leaves the app disagreeing with the OS about what language it is in. Where one is offered, it writes through the platform API.

## <Rule id="l10n-change" description="The language can change while the app is running" />

- The locale is read where it is used. A `Locale` captured at launch, a formatter built once inside a singleton, or a string preformatted into a cache leaves the screen rendering half in each language after the switch.
- Changing the app or the system language recreates the screen on Android the way a rotation does, so what the user had on it comes back with it, which is `state-interrupt`.
- Anything told the locale once is told it again: the push token registration, the requests that return user-facing text, and any preference the backend stores.

## <Rule id="l10n-pseudo" evidence="device" description="Run the fake languages before the real ones" />

Most of this is findable without a translator, on a device, before any string is sent out.

- An expanding pseudolocale accents and lengthens every string and brackets each one, so a clipped label and a string that never reached the catalogue both surface in the same pass. On Android that is `en-XA`, switched on for the debug build type; in Xcode it is the Double Length or the Accented pseudolanguage, picked in the scheme's App Language menu.
- A mirrored pseudolocale flips the direction and reverses the characters, which makes right to left testable with no Arabic or Hebrew in the binary. On Android that is `ar-XB`; Xcode offers a right-to-left pseudolanguage in the scheme's App Language menu.
- Android's Force RTL layout direction switch in Developer Options mirrors the layout and nothing else. It is a quick look, not the pseudolocale pass.
- Take the pass on the device and at the text step `layout-width` and `type-scaling` already name, which is where a translated string and a scaled one fail on top of each other.

## Check

Review answers each of these against the code, pointing at the line:

- Zero user-facing literals in the diff, the usage descriptions and channel names included, whole sentences rather than concatenations, every key carries a comment, and the backend is told which language to answer in. `l10n-strings`
- No `left` or `right` in any positioning, padding, margin or alignment except on the absolute-direction cases `l10n-no-mirror` names, RTL is enabled where the platform requires it, and inserted values are wrapped for bidirectional text. `l10n-direction`
- Transport controls, clocks, notation, chart axes and artwork are pinned against mirroring, directional arrows mirror, and phone numbers stay left to right. `l10n-no-mirror`
- Every short label has a decided behaviour for the length it will arrive at, wrapping, a step down the scale or a stacked layout, and none of them truncates the verb. `l10n-expansion`
- Every date, number, currency, percentage, unit and duration goes through a locale formatter carrying the locale's own calendar, with no format pattern and no concatenated symbol anywhere, and a typed value is parsed back through the same locale. `l10n-format`
- Every counted string reads from a plural resource, with no count compared to 1 in app code. `l10n-plurals`
- The typeface covers every shipped script with a fallback chain, and the leading is a ratio rather than a point value. `l10n-script`
- One full-name field unless an outside format demands the split and `STACK.md` names it, address fields chosen after the country, and no single mask applied to every phone number. `l10n-personal`
- Lists sort and section through a locale collator, and search ignores case and accents. `l10n-collate`
- The shipped locales are declared to the system, resources sit at the widest correct dialect, and no language picker bypasses the platform API. `l10n-per-app`
- No locale is cached at launch, a language change keeps what was on the screen, and everything told the locale once is told it again. `l10n-change`
- Both passes were taken, the expanding one and the mirrored one, by whichever mechanism the stack provides, and the screen was seen under each. `l10n-pseudo`

`l10n-direction`, `l10n-no-mirror`, `l10n-expansion`, `l10n-script` and `l10n-pseudo` are answered on a rendered screen rather than in the resource files. A catalogue can be complete, a formatter correct and a plural resource well formed while the screen itself still clips, mirrors the wrong element, or falls back to a face that has no glyphs.
