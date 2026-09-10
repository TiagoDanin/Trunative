# Copy

Most of what an app says, it says in fewer than ten words, to someone reading at a glance with the other hand busy. Count the parts of the surfaces the words land on and the reason is obvious: two answers under a title on an alert, roughly two words on a settings row, one line on a locked screen that decides whether the app is opened at all. Add a keyboard covering the lower half and there is no room left for a sentence that has to be read twice. There is no hover, no tooltip and no second window either, so a word the reader does not know is where the reader stops.

This file owns wording. Whether a message exists at all belongs to the file that owns the surface it lands on. Everything here is a string in the catalogue rather than a literal in a component (`l10n-strings`), which is also what makes most of these rules searchable.

## <Rule id="copy-budget" evidence="device" description="Decide the count before writing the sentence" />

Length is a decision taken before the wording, and it is a count.

- A title holds 1 line and never wraps past 2.
- Body text is 1 sentence. A second one has to carry a fact the first did not.
- An answer on an alert or a dialog is 1 or 2 words. `button-label` owns the rest of the buttons.
- A notification is finished at its first line (`notify-lockscreen`).

Each fact appears once across the group. A title that names the situation and a body that restates it costs two reads and delivers one.

Count the source string, because that is the shortest form it will ever take: translation lengthens it (`l10n-expansion`) and the reader's text size stretches it again (`type-scaling`). Going under the meaning is a different defect, not a stricter version of this one. The test is whether the reader can still act after the cut.

## <Rule id="copy-first-word" description="The first two words decide whether the rest is read" />

A list row, a settings label, a section header and a notification line are all read inside a column of neighbours that begin the same way. Scanning stops at the first two words.

- Lead with the word that separates this string from its siblings, and delete the leading noun they all share.
- Nothing repeats the header above it. `nav-location` owns saying where the screen is, `set-shape` owns which rows exist and in what order.
- A row that is a destination never opens with a generic verb: Set, Change, Edit, Modify, Manage, Use, Select, Choose. The row leads somewhere, so the verb spends both scanned words saying nothing. A menu or action sheet row is the opposite case, since there the verb is the whole content, and `button-label` governs it.
- Neutral beats negated. Block, not Don't allow.

## <Rule id="copy-voice" description="Second person, present tense, active, and nobody is 'the user'" />

- The reader is you. Not the user, not I or my. A possessive is usually dead weight, since Favourites says what Your favourites says in one word instead of two.
- A control that names a thing is a noun: Notifications, not Notify me. Keep sentences for where the app is genuinely speaking to the reader.
- Active voice, present tense, and the subject of a failure is the thing that failed. "Messages did not load" beats "We had trouble loading your messages". We and our stand for the company or they come out, and in an error they stand for nobody.
- Cut please, sorry, oops, uh-oh and the exclamation mark. An alert about money, access or data owns the whole screen while it stands there, so the reader has nothing else to look at and the performance is all that is on offer.
- No idioms and no colloquialisms. An idiom is the first thing to break in translation and the last thing to land for anyone reading a second language.
- Humour is weighed rather than banned, and it costs more than it looks: it travels badly between cultures and lands on a stranger reading one line off a locked screen. Keep it out of errors, permission asks, money and destructive confirmations entirely.
- No gendered reference the sentence does not need. Write the plural or the role, because a language that inflects for gender has to resolve one the source string invented for no reason. A disability never stands in for a fault or a weakness.

## <Rule id="copy-tells" description="The string nobody decided the wording of" />

A string whose wording was filled in rather than chosen has a shape, and it is the same shape across every app that shipped one. All of it is searchable in the catalogue, which is what makes it a rule instead of a taste.

- **No dash.** The em and en dash are what gets reached for instead of choosing between a full stop, a comma, a colon and a pair of brackets, and a four word title has no clause to join in the first place. Neither character is on the phone keyboard, both widen a line in a column with nothing to spare, and screen readers disagree on whether to announce them at all. Rewrite the sentence rather than substituting a shorter dash: split it in two, or use the punctuation it actually wanted. The hyphen inside a compound word is a different character and stays.
- **Vocabulary that sells instead of saying**: seamless, effortless, unlock, elevate, supercharge, robust, powerful, leverage, empower, journey, delve, revolutionary. It clusters in empty states, paywalls and onboarding, which are precisely the screens where the reader is deciding whether to continue.
- **Significance the screen has not earned.** A settings row is not a milestone and a first upload is not a journey. Say what happened.
- **Chat leftovers**: Great question, I hope this helps, Let me know if, Here is what you need to know. They arrive in apps whose strings were drafted in a chat window, and again in any feature that renders model output as interface.
- **Not X but Y**, where the negative half names something nobody claimed. "Not just a list, but a workspace" spends a line of a narrow screen arguing with a reader who was not arguing.

## <Rule id="copy-error" description="Name the failure, rule on the retry, end on the fix" />

Three answers in at most two sentences, and they are owed wherever an operation the app ran has failed: a request, a write, a sync. A field rejecting what was just typed is a single instruction instead, and `form-error` owns it. `state-error` sorts the failure classes and forbids naming a cause the app did not verify, and `fb-place` decides where the message lands. This rule is the sentence itself.

- Name the thing the reader owns, not the operation that ran on it. "Your reply was not posted" leaves the reader somewhere to go; "Request failed" names machinery they never agreed to learn.
- One string covering every failure is the shape an app falls into by default, and it is why "Something went wrong" is still shipping. It fits everywhere and helps nowhere. Count the distinct failure sentences against the distinct moves `state-error` sorts by, not against its four classes: two classes leaving the reader the same move may share one sentence.
- Say whether trying again is the move, and where it is not, say what is instead. `state-retry` owns the control.
- End on the next step, in the same verb as the control that performs it.
- Instruct, never scold. "Names take letters only" beats "Don't use numbers", and both beat "Invalid name".
- No code inside the sentence. An identifier that support will ask for is a secondary line the reader can copy.
- Never spell out a settings path. Name the one thing to turn on and let the control beside it open the page (`state-permission`). A written path is wrong the moment the OS renames a screen, and its segments are the system's strings rather than the app's, so nothing translates them.

## <Rule id="copy-jargon" description="The codebase does not get to speak" />

All of this is greppable in the string catalogue, which is why it is a rule rather than an opinion.

- Mechanism words: null, undefined, NaN, exception and class names, HTTP status numbers and the phrases that go with them, token, payload, endpoint, entity, instance, config. Also sync, cache and queue anywhere the reader would say sent, saved or waiting.
- Vocabulary carried in from the code that nobody wants on a screen: blacklist, whitelist, kill, sanity check, master and slave, dummy. Every one has a plain replacement that is also shorter.
- An acronym stays only where the audience in `PRODUCT.md` already uses it. Anything else is spelled out at its first appearance on that surface, because the phone offers nowhere to look it up.

## <Rule id="copy-terms" evidence="device" description="One name per thing, and it is the reader's name for it" />

The same object gets named in a tab, a screen title, a notification and a confirmation, and no two of those are ever on screen together. The drift is invisible to whoever writes it and obvious to whoever uses the app.

- One term per concept, written into `STACK.md` with the words it replaces listed beside it so review can search for them. What is archived on one screen is not hidden on the next.
- The term is what the reader calls the thing, not the column it is stored in.
- Gesture verbs come from the device: tap, touch and hold, swipe, drag. Never click, and never tap on.
- A confirmation repeats the verb of the control that raised it, so the reader is not matching two words to one action.
- The accessible name agrees with the visible label (`a11y-alt-input`).

## <Rule id="copy-case" description="Case is picked per element type, once, and the platform overrules it in four places" />

iOS fixes four of them, and they are not the app's to choose: a button title is title case with no ending punctuation; an alert message is a complete sentence in sentence case with a full stop; a usage description is the same; an alert title takes sentence case and a full stop when it is a sentence, title case and no punctuation when it is a fragment.

Everything the platform has not fixed is the app's own decision, taken once per element type and then held everywhere: one case for titles, one for section headers, one for the lines standing in for missing content. Two screens disagreeing is the defect, not the case that was picked.

Material's own convention is sentence case for titles, headings, labels and menu items. It does not bind the way the four iOS cases do, so the app still picks one case per element type on top of it and holds it everywhere. `button-label` owns what the button says; the case it says it in is here, and the button is where the two platforms part.

Material leaves a trap underneath that. The legacy Material 2 button text appearance sets `android:textAllCaps` to true and uppercases whatever string was authored, while every Material 3 typescale sets it to false. Resolve whether the theme uppercases the label before concluding that it renders as written. Capitals are for a short label at most (`type-strings`), and a theme that uppercases is applying them to translations nobody has looked at.

## <Rule id="copy-absence" description="Text standing where content is not" />

Three strings do a different job from the sentences around them, and each has a shape of its own.

- **A hint inside a field shows the format by example**, such as `name@example.com`. The field's name there is a label that vanishes at the moment it is needed (`form-label`), and the validation rules there arrive too late to prevent anything (`form-error`). A search field is the exception, and it names the collection instead (`search-scope`).
- **A line where content is missing names its cause and ends on a verb.** `state-empty` separates the three empties; the two that have a next move end on the verb of the control that takes it (`search-zero`, `list-end`).
- **A waiting line says which operation is running**, and moves a determinate bar only where the app holds a real figure to move it with. `state-loading` owns when that line appears and what a long wait owes on top of it.

## <Rule id="copy-numbers" description="The figure, not the word" />

A digit is scanned and a spelled-out number is read, and scanning is all a phone gets.

- So the figure is written as a numeral: 3 photos, not three photos.
- Anything destructive states the exact count and the object it acts on, so the reader can check it against what they selected. `touch-destructive` places the control and `fb-confirm-test` decides whether a confirmation exists at all.
- The locale formats it and pluralises it (`l10n-format`, `l10n-plurals`), and `data-precision` rules how many digits a figure carries and where the rounding lives.
- The unit travels with the figure and is not dropped to save width. Figures stacked in a column line up on tabular figures instead (`type-strings`); this rule is the figure inside a sentence.

## <Rule id="copy-claims" description="A number that describes the product is derived, not typed" />

Copy that states how much the product gives (how many items, how much storage, how many devices, how long the trial runs, what the limit is) is a promise, and it is checkable against the code. Typed into the view as part of the sentence, it is correct exactly once: on the day it was written.

The failure is quiet and it compounds. The constant changes, the string does not, and now the screen advertises a figure the app no longer delivers. Worse, the same figure was copied into the store listing, the marketing site and the onboarding, and none of those is read again when the constant moves.

What it looks like in a real codebase: the same quantity living as a literal inside the screen's text, as a constant in the view model, and as a different constant in the layer that actually computes it. Three values, all reachable, none agreeing, and the one the user reads is the one nobody owns.

- The figure comes from the same constant the behaviour uses, interpolated into the string, so a change moves both together. Pluralisation still goes through `l10n-plurals`.
- Where it genuinely cannot be derived, it lives in one named place that the domain code also reads, never inline in a component.
- A cap the product enforces is stated as the cap, not as the theoretical maximum. Advertising a ceiling that a limit elsewhere prevents anyone from reaching is a false claim, and it is the version that reaches a store reviewer.
- Store listing text, screenshots and onboarding repeat these figures. When one changes, they are part of the change.

Grep the view layer for digits inside display strings. Each hit is a claim, and each claim has an owner in the code or it is a defect.

## <Rule id="copy-rationale" description="The permission sentence has a punctuation rule, and one place where longer wins" />

`perm-rationale` owns the screen and `perm-purpose-string` owns what the sentence claims. Three things sit on top of those.

- The iOS usage description is one complete sentence in sentence case, active, ending in a full stop. App review reads it before any user does.
- On the app's own screen in front of the system dialog, the control that opens that dialog reads Continue or Next. What else stands on that screen is `perm-rationale`'s call. A word resembling the dialog's own accept trains the finger to answer before the eye has read the alert, which lands one second later on the same piece of glass.
- A disclosure about data being collected is the one string where clarity outranks the budget: why it is wanted, what is taken and how it is used, on the app's screen before the dialog rather than behind a link to a policy. It stands on its own, with nothing unrelated to that collection folded in beside it, and a thirteen year old is the reading level it aims at.

<Check against="string">

<Verify rule="copy-budget">No title wraps past 2 lines, no body runs past 1 sentence without a new fact in it, and no alert answer exceeds 2 words.</Verify>
<Verify rule="copy-first-word">0 destination rows open with a generic verb, and 0 strings in a scannable column repeat their header or lead with a negated term.</Verify>
<Verify rule="copy-voice">0 occurrences of "the user", "I", "my", "please", "sorry", "oops" and "!" in user-facing strings, "we" only where the sentence is about the company, and 0 gendered references the sentence does not need.</Verify>
<Verify rule="copy-tells">0 em dashes and 0 en dashes in the string catalogue, 0 sales vocabulary on the empty, paywall and onboarding screens, and 0 chat leftovers.</Verify>
<Verify rule="copy-error">Every string reporting a failed operation carries all 3 answers, the distinct failure sentences match the distinct moves rather than the 4 classes, and 0 of them lead with a code, blame the reader or spell out a settings path.</Verify>
<Verify rule="copy-jargon">0 mechanism words, exception names or HTTP numbers in the string catalogue, sync, cache and queue only where the reader uses the word too, and every acronym either known to the audience or spelled out once.</Verify>
<Verify rule="copy-terms">1 term per concept across the catalogue, listed in `STACK.md`, with 0 uses of "click" and 0 confirmations whose verb differs from the control that raised them.</Verify>
<Verify rule="copy-case">1 case style per element type across every screen, the 4 iOS-fixed cases correct, whether the theme uppercases the label answered before the authored string is trusted (on Android Views that is `android:textAllCaps`), and 0 strings longer than a short label authored in capitals.</Verify>
<Verify rule="copy-absence">Field hints show a format, each line standing in for missing content names its cause and the 2 empties with a next move end on the verb of the control that takes it, and 0 waiting lines claim unmeasured progress.</Verify>
<Verify rule="copy-numbers">Numbers are numerals, destructive strings state the exact count and object, and formatting and plurals come from the locale.</Verify>
<Verify rule="copy-claims">Every figure that describes what the product delivers is interpolated from the constant the behaviour uses, or lives in one named place the domain also reads, and no advertised ceiling is unreachable because of a limit elsewhere.</Verify>
<Verify rule="copy-rationale">Every usage description is 1 sentence-case sentence ending in a full stop, the control that opens the system dialog reads Continue or Next, and any data disclosure says why, what and how before the dialog with nothing unrelated bundled into it.</Verify>

<Device>Read the strings in the running app, not in the catalogue. Terminology drift only shows up when the screens are walked in the order the user walks them, and a string that is correct in the file can still be the wrong length once the device's text size is applied to it.</Device>

</Check>
