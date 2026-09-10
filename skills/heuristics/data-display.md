# Data display

Numbers, tables, charts, timestamps and units, in a column that starts around 320dp wide, read at a glance by someone who is walking. There is no second monitor for the detail, no hover to reveal it, and no room for a legend, so whatever a value means has to be on the glass at the moment it is read.

Two failures produce most of the damage. The first is precision the data does not have: a float printed whole, a percentage carried to four decimals, an average over six samples shown as though it were measured. The second is a desktop shape moved across intact: six columns, a legend off to one side, a chart drawn wide and then scaled down until its own labels are unreadable.

Neither platform will stop either one. Android ships no chart component and no data table component, in Material or in androidx, and iOS publishes no guidance for a sortable multicolumn table on a phone. Every grid and every chart on a phone is something someone decided to build from nothing.

## <Rule id="data-precision" evidence="device" description="Never show more digits than the value carries" />

Decide the digits from the measurement, not from the type. A step count is an integer, a body weight is one decimal, a currency is the minor units its code declares, and a ratio computed from two small integers is not a four decimal percentage no matter what the division returns. The column is narrow enough that a digit spent is a digit not spent on the label beside it.

- One rounding rule per quantity, applied in one place. The same value showing as 12.4 on the detail screen and 12 in the list is a bug report waiting to be filed, and the reader is right to file it.
- Where the figure is rounded and someone might act on the exact one, say it is rounded and give a route to the exact figure. There is no hover and no tooltip here, so that route is a target: a tap, a detail row, an expanded state. Implying exactness costs more than the extra tap.
- A figure the reader will carry somewhere else, a reference, an account number, a code, a total, is selectable or has a copy affordance on it, because the alternative is transcribing it by hand from a screen they cannot put beside anything. `share-copy` owns what confirms the copy.
- An amount being paid, transferred or owed is never rounded for display.
- A derived figure inherits the worst input's precision. Converting, averaging or summing does not create digits, which is also `data-units`.
- `copy-numbers` rules the figure inside a sentence, and `l10n-format` produces the separators and the symbol.

## <Rule id="data-table-shape" description="A table that does not fit becomes a different shape, not a sideways scroll" />

A horizontal scroll inside a vertical list moves the columns it hides off screen with nothing on the glass saying they are there, so the value the user came for is unreachable by anyone who does not already know to drag. That missing edge is `scroll-affordance`. There are three honest answers instead:

- **Fewer columns.** Two or three, chosen because they answer the question the screen exists for. The rest live one level down.
- **A row that opens a detail.** The row carries the identifier and the one number being compared, and the full record opens as its own screen. This is the answer nearly every time, and `list-row` sizes the row.
- **A different shape entirely.** A grouped list, a chart, or two records compared side by side with the third reachable by paging.

Column headings are nouns or short noun phrases, and a single column of figures still needs a label saying what it counts; `data-units` rules the unit that sits over a column. Figures sit at the trailing edge of their column with the decimal point in one place, `l10n-direction` deciding which edge that is and `type-strings` supplying the tabular figures that hold it there. Where a genuine grid is the product, editable or read only, it is its own screen with a leading identifier column pinned, a visible cut at the trailing edge so the row is seen to continue, and its own selection model, and `STACK.md` records it as an exception rather than a component reused elsewhere.

## <Rule id="data-chart-earns-it" description="A chart shows a relationship, or it is a number wearing a costume" />

If the user needs the values themselves, a list beats a chart: the figures are exact and the reader can move through them. A chart is for a trend over time, a comparison across categories, or a part against a whole. One value inside a known range is a labelled number or a gauge, and a gauge states its current value and both endpoints.

Use bar, line and point marks, which need no explanation. A chart shape the reader has to learn arrives with the sentence that teaches it, or it does not ship. Where several charts show the same data, keep one type, one set of colors and one layout across them, because a changed encoding reads as changed data.

## <Rule id="data-chart-scale" description="The chart carries its own axis, units and baseline" />

A phone chart is read without a legend and without a caption, so the plot area gets the full width of the column and everything else earns its space.

- Put the unit in the title or the axis label once, never on every tick. Keep vertical axis labels short, and move a long category label inside the plot area where it does not cover a mark.
- Use a tick sequence a reader recognises without arithmetic: 0, 5, 10 rather than 1, 6, 11.
- The lower bound is a decision, and it is the one that changes what the chart says. A bar chart of totals usually starts at zero. A chart of a value that never approaches zero, such as a heart rate, hides its whole story if it does.
- Grid lines are the smallest number that still lets a mark be estimated. Beyond that they compete with the data for the same pixels.
- Series are told apart by shape, pattern, position or a wide lightness gap as well as by hue, which is `color-not-alone`. Adjacent filled areas need a visible separation between them.
- Series are labelled where they are drawn, at the end of the line or on the bar itself, or in the headline text above the plot. A key sitting off to one side asks the reader to map it back onto the marks, and the column has no room for it anyway.
- Chart text scales with the user's setting like every other string on the screen. A plot drawn by hand takes its label sizes in fixed units and ignores the setting entirely, so labels stay small while everything around them grows. Where a label cannot reflow, the chart drops it rather than shrinking it, and the chart and any column of figures get looked at again at the largest accessibility step, which is `type-scaling`.
- A missing sample is a gap in the line, not a zero and not an interpolation across it, which is `data-empty-null-zero`.

## <Rule id="data-chart-reach" description="The point of the chart is legible before anyone touches it" />

Interaction is a way to get more, never the only way to get the essential. Put the headline figure in text above or beside the plot, so a glance answers the question and the chart explains it.

- Where marks are too small to hit, the scrub target is the whole plot area rather than the marks, and it still meets `touch-floor`.
- A canvas has no children to find, which is `a11y-name`. What a chart adds is where the tree comes from: on iOS the chart descriptor types, which also drive Audio Graphs, and on Android real semantics on the drawing rather than one label over the whole picture. The summarising sentence `icon-alt` asks of a chart stays and the mark or group labels sit under it: the sentence says what the chart is making of the data, the labels carry the data, and neither one replaces the other.
- Decide per chart whether every mark is a stop or whether groups of marks are, then write each label with the value and the context that makes it mean something, such as its date or its category. Actual values, not "rapidly" or "almost", and no ambiguous abbreviation: "June 6" and "60 minutes" rather than "6/6" and "60m". Naming a control is `a11y-name`; this is naming the data inside it.
- Once the marks carry those labels, hide the visible axis and tick labels from assistive technology so the same numbers are not read twice.

## <Rule id="data-time-relative" evidence="device" description="Relative time ages while it is on screen, and it has a written crossover" />

Take the string whole from the platform's relative formatter and place it on its own. Those strings are built as standalone phrases, and embedding one in a sentence is not reliably grammatical.

- The point where relative stops and an absolute date takes over is a named constant in the code, because neither platform picks it. On Android it is a threshold argument the caller passes; the iOS formatter exposes no crossover parameter at all, so the app owns the threshold there.
- Set the floor too. Below it a single string, "just now", instead of "0 minutes ago".
- A label already rendered keeps aging. Recompute it on a timer while the screen is visible and again when the app returns to the foreground, or "just now" is still on screen twenty minutes later.
- Decide whether "yesterday" means a calendar day or a rolling twenty four hours, and hold that decision everywhere. The Android date helper counts from midnight, so an event at 23:50 is "yesterday" ten minutes later, and whatever is written on iOS matches whichever answer was chosen.
- Never compute a span against a constant year. The one in the Android platform is fifty two weeks, which is 364 days, and anything built on it drifts.
- Where the exact moment matters, a transaction or a message, the absolute time is one tap or one long press away.
- Cached content saying how old it is is `state-stale`, and this rule is how that sentence is produced.

## <Rule id="data-time-instant" description="Stored as an instant, displayed in the reader's zone and clock" />

Persist an instant, plus the event's own zone where the zone is part of the fact, such as a flight or a booked appointment. Format it at the moment of display against the device's current zone, never at the moment it was fetched.

- A date with no time, a birthday or a due date, is a calendar date. Running it through a zone conversion is what moves it a day.
- The twelve or twenty four hour clock is a system setting the user changed on purpose. On Android the ICU formatter does not read it, so take the setting from the framework class, `android.text.format.DateFormat.is24HourFormat(context)`, and hand the matching skeleton to the ICU formatter instead of trusting its default. The two `DateFormat` classes are different types and only the framework one answers that question.
- The locale data behind the formatters is pinned per OS release, so the same locale produces different output on different versions. Never compare, parse or assert against a formatted string, and never route one back into storage.
- `l10n-format` owns the formatter and the calendar; this rule is what gets handed to it.

## <Rule id="data-units" description="One system per screen, converted once, at the edge" />

Store the canonical unit and convert only where the value is drawn. iOS ships a measurement formatter that carries the conversion, the style and the locale together; on Android the conversion is the app's own and the formatter renders only the number and its symbol. Two units from different systems on one screen is the failure that gets noticed: kilometres in the summary and miles in the row beneath it, or Celsius on the card and Fahrenheit in its detail.

- The region setting decides the system, and it is not the language setting. `l10n-format` covers that; what belongs here is that a screen picks one and holds it.
- A conversion does not add precision. 5 km shown as 3.10686 miles claims a measurement nobody made, which is `data-precision`.
- The unit stays with the figure, or once in the heading of a column where every value shares it, and is never dropped to reclaim width. If the width is the problem, the layout is the problem. `copy-numbers` rules the same figure inside a sentence.
- Spell out anything a screen reader would mangle, and never reverse the digits inside a number when the layout mirrors.

## <Rule id="data-date-entry" description="Match the control to the distance, not to the field type" />

Near dates go in the platform picker: a compact field or inline calendar on iOS, a docked or modal date picker on Android. Far dates get typed. A birthdate entered on a wheel is hundreds of flicks, and both platforms offer a keyboard input mode for exactly that.

- Constrain the range on the picker itself rather than validating afterwards, and use a range picker where two dates relate so the end cannot precede the start.
- A minute list holds sixty values by default. Where the task does not need them, use an interval that divides evenly into sixty, such as quarter hours.
- A duration is not a time of day, and it never goes in through a time of day picker. On iOS the countdown mode is that control and it stops at 23 hours 59 minutes. Android ships no countdown picker, so a duration is assembled from number fields or a control written for it.
- The time picker is constructed with the system twelve or twenty four hour setting rather than the parameter default, which on Android is twelve hour whatever the device is set to. This is the entry side of `data-time-instant`.
- Do not open a new screen just to show a picker, and do not build a calendar grid by hand: it will miss the locale's first day of week, its week numbering and its non Gregorian calendars.
- `form-input` rules that a closed value set gets a picker at all. This rule is which picker, and in which direction the entry is going.

## <Rule id="data-empty-null-zero" evidence="device" description="Zero, unknown and not applicable are three values" />

They are three different facts and they must not render as the same glyph. Zero is a measurement. Unknown is the absence of one. Not applicable means the question does not apply to this row. In a column this narrow there is no neighbouring cell to compare against and nothing to hover for an explanation, so the glyph is the entire answer the reader gets.

- Zero renders as `0` in the value's own format, with its unit. A dash where a zero belongs makes a working feature look broken.
- Unknown says so in a word, and where it matters, why: not synced yet, not recorded, only available on the paid plan. A blank cell is indistinguishable from a rendering failure.
- Not applicable is the one case where a dash is the right mark, because there is no value to report and never was one. It never shares its glyph with unknown, and where a screen uses a dash for both, unknown is the one that changes.
- A total or an average over an incomplete set says how many values it covers. Silently treating unknown as zero moves the average, and nothing on screen says it moved.
- Zero as a whole screen is a different thing again, and `state-empty` rules it.

<Check>

<Verify rule="data-precision">No figure reaches a view through a raw float or a default string conversion, each quantity's rounding lives in one named place, and anything rounded that could be acted on says so and offers a route to the exact value.</Verify>
<Verify rule="data-table-shape">No tabular data scrolls sideways: it is cut to two or three labelled columns, opened as a detail, or reshaped; figures align on the trailing edge; and any genuine grid is its own screen with a pinned leading column and a recorded exception.</Verify>
<Verify rule="data-chart-earns-it">Every chart shows a trend, a comparison or a part to whole; a single value in a range is a labelled number or a gauge; and any unfamiliar chart shape ships with the sentence that explains it.</Verify>
<Verify rule="data-chart-scale">Units appear once, ticks follow a recognisable sequence, the axis lower bound is a stated decision, series are labelled on the plot and separable without hue, and the chart still reads at the largest text step.</Verify>
<Verify rule="data-chart-reach">The headline figure is in text without interaction, the scrub target is the plot area at the touch floor, and the marks carry accessibility labels with values and context in a tree that was actually built.</Verify>
<Verify rule="data-time-relative">Relative strings come whole from the platform formatter, the crossover to absolute and the floor are named constants, on-screen labels are recomputed, and no span is measured against a constant year.</Verify>
<Verify rule="data-time-instant">Instants are stored with a zone where the zone is a fact, calendar dates are never zone converted, the clock setting is read on Android, and no formatted string is parsed or asserted against.</Verify>
<Verify rule="data-units">One measurement system per screen, converted at the display edge without gaining precision, and no figure reaches the screen without its unit on it or over its column.</Verify>
<Verify rule="data-date-entry">Near dates use the platform picker and far dates a keyboard entry mode, ranges use a range picker, minute intervals divide into sixty, durations never use a time of day picker, the time picker takes the system clock setting, and no calendar grid is hand built.</Verify>
<Verify rule="data-empty-null-zero">Zero, unknown and not applicable render as three different things with the dash reserved for the last of them, unknown says why where it matters, and aggregates over incomplete sets declare their coverage.</Verify>

<Device>Run `data-precision`, `data-time-relative` and `data-empty-null-zero` against real records rather than the mock ones. Seeded data has no nulls, no zeros, no thirteen digit floats and no timestamps from last year, which is exactly why the screen looks finished.</Device>

</Check>
