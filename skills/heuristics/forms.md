# Forms

Typing on a phone is the slowest, least accurate thing the device asks anyone to do. The field is a small box, the finger is imprecise, half the screen is keyboard, and the person is usually standing up and about to be interrupted. Every field is a chance to lose them, and the ones that lose them are rarely the hard questions: they are the field that opened the wrong keyboard, the label that vanished, and the error that arrived before the answer was finished.

The keyboard, its type per field and its return key belong to `touch-keyboard`. The emphasis and the in-flight behaviour of the submit control belong to `button-one-primary` and `button-state`. What a failure message says belongs to `state-error`, and what survives an interruption to `state-interrupt`. This file is about what the fields ask for and what happens to the answers.

Per-field keyboard types, return keys and autofill names for each stack are in `references/input-fields.md`, to be opened for one lookup.

## <Rule id="form-column" description="One field per row, at the full width of the column" />

Fields stack in a single column. Two fields side by side cost the reader on three counts, all of them mechanical: the eye leaves the vertical line it was following, each field loses half an already narrow width, and the label over a half-width field is the first thing to wrap once text scales up, per `type-scaling`.

One exception, and it is a test rather than a list. Two controls may share a row when they produce a single answer and one of them is a picker or a value of two to four characters: card expiry beside its security code, both read off the same card in one glance and both numeric; an amount beside its currency; a quantity beside its unit. The row survives only while each half still fits its label on one line at the largest accessibility text size. Where it does not, they stack.

Width carries no meaning here. On a wide form a short box hints at a short answer; in a single phone column every field is the same width, so the hint has to come from the keyboard, the mask and the maximum length instead.

## <Rule id="form-count" description="Every field is a keyboard round trip" />

An average checkout asks for eleven fields and can be answered in six to eight. Removing one field is worth more than styling all of them.

- Ask only for what cannot be derived. City and state follow from a postal code, the country from the device region, the currency from the account.
- Never ask for the same value twice. Confirm-email and confirm-password fields double the typing on the device where typing is worst, and a reveal toggle on the single password field does the same job better.
- Past six questions, split the form into labelled groups or into steps, related fields together and the personal ones last.
- Prefill anything already known, and leave it editable.
- Every hardcoded default is named in the code alongside the reason it is the default. A wrong default is worse than an empty field, because a filled field looks answered and gets scrolled past, and a default nobody can justify is an answer the user never reads.

## <Rule id="form-label" description="The label stays on screen while the field is being filled" />

A placeholder is not a label. It leaves on the first keystroke, which is exactly when someone looks back to check what they are answering, and on a phone the field and the keyboard are often the whole screen, so there is nothing above to look back at. It also reads as an answer to anyone scanning, and it is the weakest thing a screen reader can be handed. Apple's guidance allows a placeholder to stand in for the label where it is sufficient; on a form it is not, for the reasons above, and this rule overrides it.

- The label is visible the whole time the field holds a value, in one or two words. A floating label that rises on focus still counts; a hint that disappears does not.
- Every field is tied to its label in code, not merely positioned near it.
- Position follows the platform: above the field on Material and on the web, leading inside the row in an iOS grouped form.
- Where a placeholder remains, it shows an example of the value and is visibly lighter than entered text.
- Format rules, eligibility and the reason for a sensitive question go in helper text under the field, under 100 characters, and stay visible while the field is being typed into. Format hidden in a placeholder is gone at the moment it is needed.

## <Rule id="form-required" description="Mark the minority, and mark it with a word" />

If most fields are required, mark the optional ones. If most are optional, mark the required ones. Marking every row costs the reader the scan and tells them nothing.

Use the word "Optional" rather than an asterisk alone. A phone form is read one field at a time, and the legend that explains the asterisk has scrolled off the top by the second question, so the mark has to carry its meaning where it stands. An asterisk is also announced as a star. The mark goes in the label, never in the placeholder, where it disappears with everything else.

## <Rule id="form-input" description="Configure the field before the finger arrives" />

Each field declares what it holds, and the rest follows from that declaration. The keyboard type and the return key it produces are `touch-keyboard`; what the field does with what arrives is here.

- A numeric code or a card number takes a numeric keyboard over a text field, never a number field with its stepper, which also drops leading zeros.
- Capitalise names and street lines. Turn capitalisation and autocorrect off for email, usernames, codes and anything the dictionary will not know. Autocorrect on an email field silently substitutes a value the user believes they typed.
- Mask and format as they type, so spaces in a card number and separators in a phone number are the field's job rather than a rejection afterwards.
- Where the value set is closed, use a picker, a date picker or a segmented control. A closed set typed by hand is an error being manufactured for later.
- Focus a field on open only when the screen exists for that one field, such as search or a code. Anywhere else the keyboard covers the form before it has been read.
- On mobile web the field's own text size is a layout decision. Safari on iOS zooms the page into any field it is about to focus whose text is under 16px, and it does not zoom back out, so the user finishes the form on a page wider than the screen with the submit button off to one side. Set 16px or larger on the field itself. The viewport is the wrong lever for this: Safari has ignored `user-scalable`, `minimum-scale` and `maximum-scale` on a web page since iOS 10, precisely so that a page cannot take zoom away from the user, and where those values do still apply, which is a web view embedded in an app, what they buy is a page nobody can enlarge.

## <Rule id="form-autofill" evidence="device" description="The fastest field is the one the platform fills" />

Both platforms will fill a whole form from the password manager, the contact card, the wallet and an arriving SMS, and none of it happens unless each field declares its content type. This is the highest value line in a form and it is the line generated code leaves out.

- Declare a content type per field: email, username, current password, new password, name, address lines, postal code, country, telephone, card number, expiry, security code.
- Group the fields of one credential and tell the platform the form is finished when it is submitted, or nothing is offered for saving and the next visit is typed again from scratch.
- A one time code is one field with the one time code content type. Six boxes drawn over that one field are fine; six separate inputs break both autofill and paste, which were the only reasons the field was fast.
- A sign-in screen puts the saved credential, the biometric or the passkey ahead of the typed password. Typing a password on glass is the slowest path the device offers.
- A new password field declares itself as new, so the manager offers to generate and store one instead of watching someone invent it.
- Paste is never blocked on a password, a one time code or a card field, and no field strips or reformats a pasted value on arrival. Blocking paste defeats the manager every content type above was declared for.

## <Rule id="form-validate" description="Not while they are still typing" />

Per-keystroke validation reports an error on every value on its way to being right: an email address is invalid until its final character. Validate when the field loses focus, or after 500 to 1000ms without typing.

- Never validate a field on focus. An error on something untouched is an accusation.
- Three things validate live, because live is their whole purpose: password strength, username availability and a character counter.
- Accept the shapes people type. Spaces in a card number, brackets around a dialling code, a trailing space from the keyboard: normalise them rather than refusing them. A phone keyboard puts those marks there.
- A field that cannot hold an invalid value needs no validation at all, which is why the mask and the picker in `form-input` are the cheaper fix.
- Never clear a field because it failed. Retyping a value on a phone is a punishment for a typo.

## <Rule id="form-error" description="The message sits with the field it is about" />

The message goes under its field, on screen at the same time as the field, with the first failing field scrolled into view and focused when a submit fails. A summary above the form is allowed in addition to those messages and never in place of them: on its own it is a list the user has to scroll away from before they can act on it.

- What the message says and how it says it are `state-error`. What this rule adds is the room it gets: the message shares the screen with the keyboard and has about one line, so the fix has to be in the first few words.
- The error is not a color. It carries an icon or the message itself, per `color-not-alone`, and the label stays readable rather than being repainted red.
- One message per field, replacing the helper text rather than stacking above it, so the row does not grow and push the submit control off screen.

## <Rule id="form-persist" evidence="device" description="The form outlives the process" />

A phone form is interrupted by definition: the code arrives in another app, a call lands, the OS reclaims the process while the user is in their password manager. Returning to an empty form is the most expensive failure in this file.

- What survives backgrounding, process death and a configuration change, text size as much as rotation, is `state-interrupt`, and where the user lands on the way back is `nav-restore`. The rule here is the outcome, not the mechanism: the values are on screen again. Which mechanism gets them there is the stack's, and on some stacks it is already the default.
- The field that had focus comes back too, so the keyboard reopens on the question that was being answered.
- A form of six or more questions writes a draft it offers back on the next visit, or `STACK.md` records the decision not to. Losing it silently is neither.

## <Rule id="form-steps" description="A step is a screen, and back moves one step" />

Splitting a long form into steps only helps if moving back through them works the way the phone already works.

- Show which step of how many. Without it the form has no visible end, and the choice to carry on is made with nothing to base it on.
- System back, the Android gesture and the iOS edge swipe move one step back rather than leaving the flow. Leaving is a deliberate action with a confirmation, because it discards every answer behind it.
- A step re-entered still shows what was typed into it, forwards as well as back.
- The last step names what submitting will do, so nobody presses it to find out.

## <Rule id="form-submit" description="One action, and the input survives its failure" />

One submit per form, with its emphasis from `button-one-primary` and its in-flight state from `button-state`.

- No Clear or Reset control on a data entry form. It is a full-form undo parked next to the submit button on a surface where taps land approximately, and the price of a mis-tap is retyping all of it. A filter or search sheet is the exception: Clear all there is the way out of a filter state, and it costs one tap to rebuild.
- Failure keeps everything, and what a retry returns to is `state-retry`. A network error that empties the form is worse than the network error.
- Success says what happened and where the person now is, in place or on the screen they land on.

## Check

Review answers each of these against the code, pointing at the line:

- Every field has its own row at the full content width, and any shared row produces one answer whose halves still fit their labels at the largest text size. `form-column`
- The visible fields were counted, none asks for the same value twice, six or more questions are grouped or stepped, what is known is prefilled, and every default carries the reason it is one. `form-count`
- Every field has a label that stays visible, bound to it in code and positioned per platform, no placeholder is doing a label's job, and helper text stays under 100 characters. `form-label`
- Required or optional is marked on the minority only, as a word, in the label. `form-required`
- Capitalisation, autocorrect and any mask are set per field, closed value sets use a picker rather than free text, nothing takes focus on open except a single-field screen, and on mobile web no field's text sits under 16px. `form-input`
- Every field declares its autofill content type, credential fields are grouped and committed on submit, the one time code is a single field, and paste is blocked nowhere. `form-autofill`
- Nothing validates per keystroke or on focus, blur or a 500 to 1000ms pause triggers it, and accepted formats are normalised rather than rejected. `form-validate`
- Each message sits under its own field, names the fix in its first few words, does not depend on color, no summary stands in for those messages, and the first failure is scrolled to and focused. `form-error`
- Values, scroll and the focused field come back after backgrounding and process death, and a form of six or more questions either drafts or records that it does not. `form-persist`
- A stepped form shows the step and the total, system back moves one step rather than out, answers survive going back, and the last step names what submitting does. `form-steps`
- One submit control, no reset outside a filter sheet, and nothing lost on failure. `form-submit`

`form-persist` is answered by backgrounding the app with the form half filled and coming back, not by reading the state code. `form-autofill` is answered by triggering the platform's own fill on a device, because a content type spelled wrong fails silently and looks exactly like one spelled right.
