# Touch

A finger is not a cursor, and every rule here follows from three differences.

It is blunt: the contact patch is an oval of 16 to 20mm for a fingertip and more for a thumb pad, so the input is a smudge and not a point. It has no hover: there is no state between not touching and committed, so anything a desktop design revealed on the way to a click has nowhere to live. And it is opaque: the finger covers the thing it presses along with a ring around it, so feedback drawn under the contact point did not happen.

Add the fourth condition that belongs to the device rather than the hand: the grip changes constantly, often within a single task, so nothing can assume the phone is being held the way it was a moment ago.

## <Rule id="touch-floor" evidence="device" description="The target is the hit area, never the drawing" />

44pt on iOS, 48dp on Android, for everything a user can activate. Both land under a centimetre of glass, which is already smaller than the finger arriving at it. That is why they are floors and not goals.

The drawn control and the target are two different objects. A 24dp icon centred in a 48dp target is right; growing the icon to fill the target and shrinking the target to hug the icon are both wrong. Reach for the mechanism the stack already has:

- SwiftUI: a minimum frame plus `.contentShape()`, so the padding is tappable and not just the glyph.
- Compose: `Modifier.minimumInteractiveComponentSize()`, which Material components already apply.
- Flutter: `MaterialTapTargetSize.padded`, or a sized box around the gesture detector with an opaque hit test behaviour.
- React Native: `hitSlop` on the pressable.
- Mobile web: padding on the control, never margin, since margin does not take taps.

Two consequences that get missed. A list row is a target: full width, at least 48dp tall, and the whole row responds rather than the label inside it. And a target that is marginal at the top of the screen is worse at the bottom, where the thumb arrives at a shallow angle and the contact oval stretches.

The web accessibility floor is lower than the platform one and does not replace it. WCAG 2.2 asks for 24 by 24 CSS pixels at AA, with exceptions, and 44 by 44 only at AAA. On a phone the platform number wins, every time.

## <Rule id="touch-spacing" description="Two correct targets can still produce a wrong tap" />

Leave at least 8dp of dead space between neighbouring targets. Adjacent controls that each meet the floor still collect mis-taps, because the contact oval straddles the boundary between them and the system awards the tap to whichever one owns the centre.

Watch the places it concentrates: a row of icon buttons in a toolbar, a line of chips, a close control sitting beside another control, and two swipe actions revealed on the same row. When a target has to be smaller than the floor, the distance to its neighbours has to grow to compensate, which is the same trade WCAG makes with its spacing exception.

## <Rule id="touch-reach" description="The bottom third is the only easy part of the screen" />

Roughly half of phone use is one-handed, and about two thirds of that is a right thumb. A layout that only works for one hand fails a large minority of users, so check the mirror before shipping.

Three regions, mirrored for a left hand:

- **Easy:** the bottom third, leaning toward the side opposite the thumb. The primary action, the primary navigation and whatever gets used most.
- **Stretch:** mid screen and across to the far side. Secondary actions.
- **Hard:** the top corners, worst at the diagonal from the holding thumb. Search, settings, anything used rarely.

Past about six inches of screen, the top is not reachable one-handed at all. Anything essential up there needs a second path: a bottom sheet, a pull-down, a duplicate control in reach. A bottom tab bar is not a stylistic preference, it is where the thumb is.

Since the grip changes mid-task, the design has to survive the change rather than assume a posture. A control that only works while the phone is cradled in two hands is a control that fails while walking.

## <Rule id="touch-destructive" description="Distance is the safety mechanism" />

Delete, unsubscribe, cancel the order and send the payment do not belong in the easy region, and never beside something used often. The whole point of the hard region is that reaching it takes a deliberate second movement.

Prefer undo over a confirmation dialog. Undo is faster for the person who meant it, recoverable for the person who did not, and it does not train users to dismiss dialogs without reading them. When a dialog is the right vehicle instead is `fb-confirm-test`.

## <Rule id="touch-feedback" description="If it happened under the finger, it did not happen" />

Every touch gets an acknowledgement inside about 100ms, before the work behind it finishes. Latency between contact and response is the loudest quality signal a phone app has.

- The pressed state is mandatory, and it has to be visible with a finger parked over the middle of the control. Change the whole surface, not a small area at the centre.
- Use the platform's own idiom: a ripple originating at the contact point on Android, a highlight or dim on iOS. Invented feedback that neither platform uses reads as a malfunction.
- Confirmation of a result belongs above the touch point or in another region entirely, never underneath it.
- Disable the control while its action runs, or a second tap fires the same request twice.
- Haptics are a vocabulary, not decoration. One meaning per pattern, distinct signals for success and failure, nothing on scroll. Constant haptic feedback is worse than none.

The touch state set is its own thing: rest, pressed, long press where the element has one, dragging where it moves, plus disabled, loading, error and empty. `hover` does not exist here, and `focus` belongs to a hardware keyboard or switch control rather than to a finger. Nothing may hide behind either.

## <Rule id="touch-gestures" description="The edges belong to the operating system" />

A gesture that starts at a screen edge is competing with the OS and will lose. On iOS that is back from the left edge, the shade from the top left, the control panel from the top right, and home from the bottom. On Android it is back from either side, home from the bottom, and the shade from the top. Where a drag genuinely has to begin at an edge, claim the strip explicitly through the system's gesture exclusion mechanism and keep it as small as possible.

- Back works on every screen, sheets included. On Android that means the modern callback rather than an override of the old back method, keeping the predictive animation the system draws while the finger is still down and interpolating any custom transition from its progress. Consuming back without leaving a way out is the most common navigation defect in generated code.
- Use the standard gesture for the standard meaning. Repurposing pull to refresh, long press or edge swipe costs the user the muscle memory built by every other app on the device.
- Every gesture needs a visible equivalent. A swipe-only action does not exist for a new user, for a screen reader, or for anyone with a motor impairment.
- A gesture nobody discovers is a feature nobody has. Leave a partial reveal at rest, a grabber, or a one-time hint.
- Give a swipe region real height, and keep two swipeable things from overlapping where their gestures begin.

Content runs underneath the system bars on current Android targets, so a control pinned to the bottom edge without inset handling ends up beneath the gesture strip: visible, and not tappable. The inset geometry itself is `layout-insets`.

## <Rule id="touch-keyboard" description="Half the screen, arriving without warning" />

The keyboard is not an overlay that happens to the screen, it is part of the screen for as long as someone is typing, and it deserves the same design attention as anything else that takes up that much room.

- The focused field stays visible when it opens. Test the last field of a form, not the first: the first one always passes.
- Which keyboard opens, and what its return key does, is decided per field rather than globally. `form-input` covers that in full.
- A fixed bottom action either rises with the keyboard or is reachable above it. Leaving it underneath means the user types and then cannot submit.

<Check>

<Verify rule="touch-floor">Every interactive element measures at least 44pt or 48dp in its hit area, and list rows are tappable across their full width.</Verify>
<Verify rule="touch-spacing">Adjacent targets are separated by at least 8dp of dead space.</Verify>
<Verify rule="touch-reach">Primary action and primary navigation sit in the bottom third, and the layout was checked mirrored for a left thumb.</Verify>
<Verify rule="touch-destructive">Destructive actions sit outside the easy region, and the vehicle carrying the confirmation is the one `fb-confirm-test` selects.</Verify>
<Verify rule="touch-feedback">Pressed state is visible under a covering finger, feedback lands within about 100ms outside the occluded area, and nothing depends on hover.</Verify>
<Verify rule="touch-gestures">Back works on every screen including sheets, no custom gesture starts in a system edge zone, and every gesture has a visible alternative.</Verify>
<Verify rule="touch-keyboard">With the keyboard open, the focused field is visible and the primary action is reachable.</Verify>

<Device>Hit areas are measured, not estimated: read the bounds in the inspector or the layout tree. A target that looks big enough next to a 24dp icon is exactly the one that is not.</Device>

</Check>
