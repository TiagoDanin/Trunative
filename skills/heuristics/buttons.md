# Buttons and controls

Everything a user taps to act or to choose: buttons, the floating action button, chips, tabs and segmented controls. Navigation structure is a separate question; this file is about the controls themselves and about which one wins.

A phone shows one screen at a time to someone who is usually doing something else. The whole point of a control vocabulary here is that the answer to "what do I do now" arrives before any reading happens.

## <Rule id="button-one-primary" description="One primary action per screen. One." />

This is the rule the rest of the file exists to protect, and it is the one generated screens break most often.

Emphasis is relative and nothing else. A filled button reads as *the* action only because the controls around it are not filled. Put two filled buttons side by side and neither one is primary any more: the visual system says both are the answer, so the user has to stop and decide which, and that decision is one you were supposed to make for them.

**Count them.** Look at the screen as the user sees it and count the filled, prominent or otherwise heaviest controls visible at once. The answer is one, or zero on a screen that only reads or browses. Two is a defect, not a preference.

What counts in that number:

- the button pinned to the bottom, the one in the top bar, and the one inside the content, all at the same time;
- the FAB, which is a primary action and not an exception to the count;
- controls that live in different files or different components but land on the same glass. The count is per screen, not per widget.

A sheet, a dialog or a full-screen modal is its own decision point, so it gets its own single primary, and while it is open it owns the count.

When two actions genuinely feel equal, that is the screen telling you it has two jobs. Split it, or pick the one the product wants and demote the other. Save and "save and add another" are not two primaries: one is the primary and the other is a secondary, a menu item, or a checkbox next to the first.

Cancel, Back, Skip and Dismiss are never the emphasized control. They are the exit, and the exit does not need to be sold. A destructive action is not the top of the ladder either: it is a role of its own, it keeps its distance from the frequent controls, and it is never the primary of a screen the user opened to do something else.

## <Rule id="button-ladder" description="Use the ladder the platform already defines" />

Below the primary there are two useful rungs, no more: a secondary for the alternative, and a quiet tertiary for the optional. Reach for them by name instead of inventing a parallel set of styles.

- **Material:** filled, then filled tonal, then elevated, then outlined, then text, in that order of weight, with the FAB sitting above all of them for the one action a screen exists for.
- **iOS:** prominent, then bordered, then plain. On recent versions the same ladder is expressed through the system glass styles, which is where translucency comes from; a hand-built blur behind a button is not the same control.

The iOS convention worth knowing: the primary action there is frequently a navigation bar item or a plain tinted row of text, not a large filled block in the middle of the content. A full-width filled button dropped into an iOS settings screen is an Android accent, and it reads as one.

Three different button styles at the same rank on one screen is the composite look of a screen assembled from parts. Pick a style per rank and hold it, then style it once in the theme rather than at each call site, because twenty locally styled buttons are twenty future inconsistencies. The same action wears the same control everywhere in the app: if Save is filled on one screen and a text button on the next, one of them is wrong.

Button labels sit at the label role of the type scale, which on Material is 14sp at weight 500. Not 400, and not bold.

## <Rule id="button-target" description="The drawn height is not the touch target" />

Material's default button is 36dp tall, with a size range that runs from 32dp to 56dp, and the framework component quietly extends its own touch area to reach the 48dp floor. Draw that button by hand at 36dp with no extended area and it is a target that fails, while looking identical to the one that passes.

The whole control is tappable, not the text inside it. A full-width primary at the bottom of the screen is a good fit for a thumb, and it is also a large accidental target, so nothing destructive belongs beside it.

## <Rule id="button-label" description="The label says what will happen" />

Write the verb of the action and the object it acts on: Send, Pay 42, Delete photo. OK, Submit and Yes describe nothing, and Yes in particular forces the user back up to reread the question.

- No trailing period, and never "click" on a device with no cursor.
- Keep it short enough to survive translation and a 200% text size, and decide now what a long label does: wrap, or shrink the container, never quietly truncate the verb.
- An icon-only button carries an accessibility label saying the action, not the picture. On Android, navigation destinations always carry a visible text label as well.

## <Rule id="button-state" description="A button has four states, and two of them are usually missing" />

Rest and pressed are covered by the touch rules. The two that get skipped:

**Disabled.** A primary that starts disabled at the top of an empty form gives the user nothing to act on and no reason why. Prefer leaving it enabled and answering on tap with what is still missing, pointed at the field that is missing it. Where disabled is genuinely right, the reason has to be visible next to it, not inferred.

**In flight.** The moment it is tapped, the control stops accepting taps and says that work is happening, in place, at the same width, so the layout does not jump under the finger that is still there. A button that looks identical during a three second request gets pressed again, and the second press is a duplicate order.

## <Rule id="button-fab" description="One FAB, for the action the screen exists for" />

The FAB is Material. It does not belong in an iOS build, where the same action goes in the navigation bar or the toolbar.

Where it is right, it *is* the primary action of that screen, which means there is no second filled button underneath it competing for the same job. One per screen. Stacked FABs, a FAB spent on something secondary, and a speed dial that unfolds into four more FABs are all the same mistake: a menu wearing the costume of a primary action.

Use the extended form when the action needs a word to be understandable, since an icon alone rarely carries a verb. And remember it floats over content: the scrolling list underneath needs bottom padding equal to the FAB plus its margin, or the last row spends its life beneath it.

## <Rule id="button-chips" description="Chips are not small buttons" />

Four kinds, four jobs. Assist chips offer an action in context. Filter chips narrow a set and can be multi-selected. Input chips represent something the user already entered and can remove. Suggestion chips offer content the system is proposing.

- Selection has to be legible without color: a check mark, a filled container, a shape change. A chip that only changes tint when selected disappears for a good share of users.
- A row of chips scrolls horizontally. Letting them wrap turns a filter row into a growing wall that pushes the content it filters off the screen.
- Chips do not carry the primary action, and they are not a navigation control. A chip that changes screen is a tab wearing the wrong clothes.

## <Rule id="button-tabs" description="Tabs are navigation, not action" />

Three to five destinations, and they are the top level of the app rather than a place for actions. They belong at the bottom, where the thumb is.

- Every destination is labelled. Icon-only navigation asks the user to guess, and the guess is wrong often enough to matter.
- The selected destination is obvious without relying on color alone: an indicator, a filled icon variant, a weight change.
- The set does not change from screen to screen, and it does not vanish when a screen is pushed. Tabs that come and go stop being a map.
- Top tabs and bottom tabs on the same screen is two navigation systems arguing. Pick one.
- A segmented control is not a tab bar. It filters or switches the view in front of the user, it holds about three options, and past that it becomes a menu or a filter screen.

## Check

Review answers each of these against the code, pointing at the line:

- Exactly one primary action is visible on the screen, counting the bottom bar, the top bar, the content and the FAB together, and any sheet or dialog carries its own single primary. `button-one-primary`
- Emphasis comes from the platform's ladder, one style per rank, styled in the theme rather than per call site, and the same action looks the same across screens. `button-ladder`
- Every button's touch area reaches the platform floor even where the drawn height is smaller. `button-target`
- Labels name the action and its object, are capitalised as `copy-case` requires, and survive the longest translation at the largest text size. `button-label`
- Disabled states explain themselves, and every button that starts work becomes unpressable and shows it, without resizing. `button-state`
- At most one FAB, holding the screen's defining action, absent on iOS, with the list underneath padded to clear it. `button-fab`
- Chip selection is visible without color, chip rows scroll instead of wrapping, and no chip is doing a tab's job. `button-chips`
- Three to five labelled destinations, a selected state that is not color alone, and one navigation system per screen. `button-tabs`
