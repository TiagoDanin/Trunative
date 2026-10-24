# Review

Runs after every build, on the code that was just written, and again on request over a finished screen. Reviewing your own output is the point: the build step optimizes for getting the screen working, and this step optimizes for finding where it fails in a hand.

One grader, one scale, one set of rule ids. What changes between a run on a diff and a run on a screen is not the standard, it is how much of the screen was actually seen, and the report says so.

## The scale

Every rule in scope gets a number from 1 to 5. The same words on every rule, on every run, because a rule that invents its own wording for a 3 makes two runs incomparable.

A score is a claim about what was observed, never about how the screen feels. Each level has a test, and the test is a thing somebody can point at:

| Score | Means | The test |
|---|---|---|
| 1 | Critical violation | What the rule exists to prevent is on the screen, on the ordinary path, and the person meets it on every visit. You can name the element and what happens to them. |
| 2 | Clear violation | Something is in place and it does not hold. Met here and dropped on the next screen, met for the default case while the case the rule is about is the exception, or met in code that never runs. You can name where it fails. |
| 3 | Acceptable | The Check line is true on the ordinary path, and you can point at the line or the capture that makes it true. None of the edges the rule names was examined. |
| 4 | Well resolved | A 3, plus every edge the rule's own text names was examined, and exactly one is still open. You can name that one. |
| 5 | Reference | A 4 with nothing open, and the evidence is attached: the measurement, the capture, the device run. Another screen in the project could copy this one. |

Three consequences, and they are what stops a number from being a mood. A 3 with nothing to point at is `unrun`. A 4 that cannot name its one open edge is a 3. A 5 without attached evidence is a 4, and a 5 on a `[device]` rule without a device run does not exist.

Some rules are not a matter of degree. A control has an accessible name or it does not, a string is hardcoded or it is not, a list is virtualised or it is not. A row the checklist prints as `pass or fail` takes one of four answers and never a number, since a 1 to 5 on it would be precision nobody measured:

- **`pass`**: the Check line is true, and you can point at why.
- **`fail`**: it is not.
- **`n/a`** and **`unrun`**, as below.

A `pass` counts as a 5 and a `fail` as a 1 in the total, each times the rule's weight from section 4, so the percentage still reads across runs.

A **violation** is a 1, a 2 or a `fail`. The build loop continues while there is one. Nothing at 3 or above blocks a build, which does not make it finished.

### Severity and the blocked screen

Every row carries a severity, from the rule's own heading:

- **P0**: the person cannot complete the job, or loses work.
- **P1**: the person is excluded or misled. Every one of the nine always in scope is at least this.
- **P2**: friction, or a platform convention broken. A rule with no mark is P2.
- **P3**: polish.

The overall score cannot outvote a severe failure. When any P0 or P1 rule is a violation, the status of the screen is `BLOCKED`, and it is printed in the header beside the percentage, never in place of it: `92%, BLOCKED by a11y-name` is a legitimate header, and it means what it says. Ninety-nine rules at 5 and one P0 at 1 is a screen somebody cannot use. The band in section 4 is not printed for a blocked screen, because "Nothing structural left" above a P0 failure is false.

Severity does a second job, and it is a different one: it weighs each rule in the total, in section 4. Blocking says whether the screen may ship at all. The weight says how much each rule moves the number of a screen that does not block. Neither stands in for the other.

Two answers that are not scores. Not applicable is written `n/a` and never 0, because a zero in a table of scores reads as the worst one and ends up in somebody's sum:

- **`n/a`**, with the reason in the row: the feature does not exist here, the platform does not have it, or `STACK.md` records the exception. Not available for the nine rules under **Always in scope** in `SKILL.md`. An `n/a` written in a screen brief is a claim the brief's author made before the code existed, so it is checked here like any other claim, and it never arrives as an exemption. Exceptions accepted on purpose live in `STACK.md`, which is the only file that grants one.
- **`unrun`**: the rule applied, nothing was checked, and the run knows it. A rule you did not check is never a pass.

Anchors are not a curve. Most rules on a screen built with this skill land at 3 and 4, a 5 is earned by evidence rather than by the absence of a complaint, and a screen with no 1s and no 2s is a screen that ships, which is a lower bar than a good screen.

## 1. Re-read the code

Review the actual code, not your memory of writing it. Open the files that changed.

After a build that is the diff, including a build that went straight from a one-line verdict to code: a change too small for spec is still a change someone will hold, and its review is the same file with a smaller scope, printed with its header. That holds for a change that did not look like screen work: an analytics event that also fires a review prompt, an ad integration, a notification, a permission request, a paywall variant. What the person sees is reviewed whoever thought they were writing it. On request it is the screen: the widget, view or composable that renders it plus whatever it pushes and presents, opened on a device or a simulator.

## 2. Scope and checklist

The scope is every base file plus the extra files this screen touches, settled by your own pass over the Extra table in `SKILL.md` rather than by what the build says it opened. The nine always-in-scope rules sit inside the base files and are never `n/a`. Write the scope down before grading. A scope chosen once the scores are in is a scope chosen to flatter them.

An identity the build had to settle because `DESIGN.md` did not carry one is part of the scope, not a note beside it. It is graded by `color-derived`, `type-face`, `layout-shape` and `icon-depicts`, against the five lines the build wrote, and the arrangement answers to `comp-distinct` in the same way, and a screen whose identity would fit any other product in the category scores a 1 on the first of them however clean the rest of the code is.

Name the screen first, the same way build does, and derive the scope from the name. A build that named it wrong took the wrong files with it, and a review that inherits the build's list inherits the mistake. Where your pass reaches a file the build never opened, its rules are in scope all the same and every one of them is `unrun` until it is checked: a rule nobody looked at is not a rule that passed.

A screen brief at `.trunative/screens/<name>.md` does not change that. Its `scope` is what the spec step decided and what the rubric was generated from, and it may widen your scope and never shrink it. Where your own pass reaches a file the brief left out, grade it and report the difference as drift.

A play surface in a game, the screen where the game itself runs under a HUD, is graded with the review profile `heuristics/game.md` states: that file says which families close on a play surface and why, so the rows it closes are `n/a` with its reason rather than a hundred rows argued one at a time. Menus, settings, shops and result screens in the same game are ordinary screens and get the ordinary scope.

### A follow-up review

A screen that already passed a full review, then changed, does not need every row graded again to know whether the change held. The scope of a follow-up run is:

- the nine always-in-scope rules, every time;
- every rule whose Check line names something the diff added, changed or removed: a control, a string, a colour, a state, a sheet, a route, a request;
- every rule of an Extra file the diff brought into scope for the first time, such as a screen that gained an ad, a notification, a review prompt or a second locale. A file newly in scope is graded whole, because nothing about it was ever seen.

Every other row carries its grade from the last full review, marked carried, with the date of that run. A carried grade is not a fresh one, and the report counts it apart.

The follow-up is the same review with a narrower scope, never a second procedure. It is not available for a new screen, for a change spec judged structural, or when the last full run is older than the skill hash in `.trunative/skill.lock`: those run the full scope. Choosing the follow-up to avoid a row that would fail is choosing the scope after the scores, which the paragraph above already forbids.

```sh
npx trunative rubric --only forms --only search
```

Base is in every rubric. `--only` adds extras, by file stem, by rule prefix such as `form-`, or by a single rule id, and repeats. `--format=ids` prints the ids alone, which is what a diff against the previous run reads to catch a rename.

The checklist is generated, never written by hand:

- Do not add a row. A rule that should exist belongs in `heuristics/`, and the next run picks it up with no second edit.
- Do not delete a row. A rule that does not apply is `n/a` with a reason, which is a different fact from a rule nobody looked at.
- Do not grade a rule that is not on the checklist. An id that is not there was renamed or removed, and a score for it is a score for nothing.

Each row carries the rule's own Check line, which is the criterion. Grade against that sentence, not against a memory of the heuristic. A row marked `[device]` is a rule the file cannot settle from the source, which decides the evidence in step 3.

## 3. Grade

Every row gets a score, one line of finding, and its evidence:

- `source`: the code was read. The claim is about intent.
- `device`: the screen was driven. The claim is about the app.
- `source+device`: both, and they agreed. Where they disagree the device wins, and the disagreement is a finding.

A rule the checklist prints `[device]` on may not take `source`: its own file has already said a diff cannot settle it, so a number from the source alone is a guess wearing a score. The paragraph that file closes its Check section with, printed under the group as `Not from a diff`, says why. Those rules are `device`, `source+device`, or `unrun`. A rule without the mark can be graded from the source, and is still worth seeing on a device.

Where no screen reader can be driven, a dump of the accessibility tree taken from the running app is `device` evidence for the rules about names, roles, reading order and grouping: what each node is called, which nodes merged, and in what order they come. It is not evidence for announcements, focus moves or gestures, which only exist while a screen reader is running, and those stay `unrun` without one. The dump is attached to the report beside the capture.

Unity UI reaches the platform's screen reader only through what the app registers: from Unity 6, an `AccessibilityHierarchy` of `AccessibilityNode`s with labels and roles, made active through `AssistiveSupport.activeHierarchy`. On Android `adb-agent ui dump --json` against the running build shows whether those nodes arrived, and on iOS the Accessibility Inspector in Xcode does. A tree with one node for the whole screen is itself the finding, for every name and order rule on it.

A screen is never closed on `source` alone. Render it, look at it, and keep the capture beside the report. What the file hides and the picture shows in a second: the last row of content sitting under a pinned bar, the primary action stranded in the middle of an empty frame, a hero occupying a third of the height and depicting nothing, placeholder text standing in as the content. None of that is arguable from code, and all of it is what a person sees first.

```sh
xcrun simctl io booted screenshot screen.png   # iOS simulator
adb-agent screen shot --out screen.png         # Android emulator or device
```

Scroll to the end of the content before capturing, or the collision `layout-chrome` exists to catch stays hidden.

When the app is running on a device, split the work in two and keep the halves apart, because a grader who has already read the measurements grades the measurements:

**Judging.** Reads the source, drives the screen, and fills in every row.

**Measuring.** Produces numbers and captures, no scores at all, each keyed to a rule id. Start with the one measurement that needs no device:

```sh
npx trunative detect lib/screens/checkout_screen.dart
```

It reads the files and answers the part of a `Check` line a file can settle, reporting per rule id. Three things follow from that and none of them is optional: every finding is `source` evidence, so it never settles a rule marked `[device]`; a finding is a place to look rather than a score; and its silence proves nothing, so a rule it did not answer stays with the grader. It exits 2 when it finds something, which is not a failure.

Then the measurements that do need a device: both appearances on the narrowest and widest device class, the largest accessibility text step on the narrowest, hit area bounds read from the inspector rather than estimated from a screenshot, the primary flow completed with the screen reader on, the screen with the network off and after a process kill the system would have made itself, and real records rather than seed data, meaning a null, a zero, a long string, an old timestamp and an empty list. When the app can reach a real account, use it: demo data was written to look right, which is the one thing real data does not do.

On an Android emulator or device, drive all of it with `adb-agent`, the shell counterpart of an Android debug bridge server: every command answers `--json`, exits non zero on failure, and reads the screen by label instead of by guessed coordinates. When it is not on the path, `npx -p android-debug-bridge-mcp adb-agent` runs it, and `adb-agent skills get adb-cli` prints its full guide. Run `adb-agent doctor` once before the first measurement, since a run that cannot reach `uiautomator` produces no tree and the rows it was meant to settle stay `unrun`.

```sh
adb-agent test folder checkout                        # one folder of artifacts per run
adb-agent system deeplink "myapp://checkout" --package com.example.app
adb-agent ui wait "Pay"                               # wait for content, never for a clock
adb-agent ui dump --json                              # labels, bounds, clickable, order
adb-agent screen shot --test checkout --step default
adb-agent input scroll down --amount 0.9              # then capture again, at the end of the content

adb-agent system setting get system font_scale        # the value to put back
adb-agent system setting put system font_scale 2.0    # largest text step, then capture
adb-agent system shell cmd uimode night yes           # the other appearance, then capture
adb-agent system shell wm size 720x1280               # narrowest class, wm size reset after
adb-agent system shell cmd overlay enable com.android.internal.systemui.navbar.threebutton
adb-agent system shell cmd overlay enable com.android.internal.systemui.navbar.gestural

adb-agent system airplane on                          # network off, then off again after
adb-agent input key HOME
adb-agent system shell am kill com.example.app        # the kill the system makes in the background
adb-agent input key RECENTS                           # return the way a person does, then dump

adb-agent system logcat --package com.example.app --priority E --lines 100
adb-agent test artifacts checkout                     # what the report attaches
```

What each answer settles, and what it does not:

- **Hit areas** come from the `bounds` of each element in `ui dump --json`, in pixels. Divide by the density over 160, read with `adb-agent system shell wm density`, to get dp, and compare against `touch-floor`. That is the inspector reading step 3 asks for, never an estimate off a capture.
- **Names, roles and order** come from the same dump: an element with an empty label that is `clickable` is an `a11y-name` failure with its bounds attached, and the order of `elements` is the order TalkBack walks.
- **The dump has no z-order.** An element under a pinned bar still reports its full bounds, so a dump never settles `layout-chrome` or `layout-insets`: the capture at the end of the content does, in both navigation modes.
- **A WebView or an engine canvas is often one node.** That single node is the finding for every name and order rule inside it, and coordinates for driving it come from the capture.
- **The screen reader.** Turning TalkBack on is `adb-agent system setting put secure enabled_accessibility_services com.google.android.marvin.talkback/com.google.android.marvin.talkback.TalkBackService` on an image that ships it. On one that does not, the dump stands for names, roles and order as above, and announcements and focus stay `unrun`.
- **Crashes and errors** a flow raised without showing them are in the logcat read, cleared first with `adb-agent system clear-logcat`, and an error there during the primary flow is a finding even when the screen looked fine.

Every `put`, `night`, `wm size`, overlay and airplane change above is a setting on the person's device, so the paragraph below holds: `setting get` before each `put` is the value to restore, and the hand-off lists each one put back, `wm size reset` and the original navigation mode included. Never run `adb-agent app clear` on a device you did not set up for the test, because it wipes the account and the data on it, and `app restart` gives the fresh process without that.

Some defects only exist over time, and a capture of the settled screen shows none of them. Capture the screen while it loads and again once content arrives, and compare where things sit, since `state-loading` fails in the step between the two. Leave the screen open for a minute and look again: a relative time that never changes, a figure that should have refreshed, a banner that should have gone. Time the ordinary interactions, the sheet opening, the tab switching, the list returning, instead of judging them by feel.

A device the user is working on is theirs. Before changing a setting on it, font scale, display size, rotation lock, theme, locale, animations, language, say which, and put every one back before the hand-off, listing what was changed and restored. A test that leaves the phone at double text size or with rotation locked has broken the next thing the user tries.

How the two are kept apart depends on the harness you are running in:

When this harness can spawn sub-agents and the review covers one screen or one flow, run them as two, spawned so that neither reads the other's output. When it cannot, or the review is one pass over a batch of screens, finish the judging pass and record it, then measure.

Then reconcile: the judged score stands unless a measurement contradicts it, and every score a measurement moved is printed with both numbers. The report is one table, not one pass after the other. When they could not be kept apart, the report says so on its first line.

## 4. The numbers

Every scored rule counts with the weight of its severity, so the total says how much of what matters held, not how many rules did:

| Severity | Weight |
|---|---|
| P0 | 4 |
| P1 | 3 |
| P2 | 2 |
| P3 | 1 |

A rule's points are its score times its weight. The total is the sum of the points, and the maximum is 5 times the sum of the weights of the rules actually scored, from 1 to 5 or as `pass` and `fail`. Nothing else is in it.

Unweighted, a scope that is mostly P2 lets friction carry the number: forty P2 rules at 5 hide two P1 rules at 3 the same way an average hides one rule at 1. The weights make a 3 on a rule about exclusion cost half as much again as a 3 on a rule about friction, and a 3 on a P0 cost twice as much.

- The denominator is never the size of the scope. A checkout screen scoped to the base files plus `forms`, `commerce` and `payments` holds 148 rules, and with 12 `n/a` and 8 `unrun` it leaves 128 scored. At 5 P0, 18 P1, 101 P2 and 4 P3, their weights add to 5 × 4 + 18 × 3 + 101 × 2 + 4 × 1 = 280, so the maximum is 1400: not 5 times 148, and not 5 times 128.
- A weight comes from the severity on the rule's own heading, as the checklist prints it, and a run never assigns one. A rule whose weight looks wrong has the wrong severity, and that is fixed in `heuristics/`, where every later run picks it up.
- A carried grade in a follow-up run keeps its rule's current weight, so a severity changed since the full run moves the carried points too, and the trend line says the skill hash moved.
- Report coverage beside the total: scored, `n/a` and `unrun`, out of the scope. A run that skipped the device work does not come out ahead of one that did it.
- Record which ids were `n/a` and which were `unrun`. A later comparison against a run that hid them is a comparison of two different measurements.

The percentage is an average, and an average hides exactly the thing this step is for: one rule at 1 disappears among ninety at 5. So it is never reported alone. It travels with the status (`BLOCKED`, `VIOLATIONS` or `CLEAN`), the count of violations by severity, and the coverage. The band is read only when the status is `CLEAN`.

Bands read off the percentage, since the maximum moves with the scope:

| Percentage | Band |
|---|---|
| 90 and above | Nothing structural left. |
| 75 to 89 | Solid, with named gaps. |
| 60 to 74 | It works, and the edges do not. |
| 40 to 59 | Structural work before polish. |
| Under 40 | Not designed for a phone yet. |

## 5. Report

The report goes in the response, in this order:

1. **Header.** What was reviewed, the scope, the status first, then the violations counted by severity, the total, the percentage, the coverage, and the band when the status is `CLEAN`. `BLOCKED` names the rule ids that block.
2. **The table.** Columns: rule, severity, score or pass and fail, evidence, finding. Print every rule at 4 or below and every one of the always-in-scope nine, then one line per file for the rest: file, rules scored, weighted average, lowest.
3. **Violations.** Every rule at 1, 2 or `fail`, ordered by severity and then by what it costs the person using the app, and never by how easy it is to fix. Each names the rule id, the file and line, what the user meets, and the fix. Say plainly when the screen is unusable one-handed, loses work on interruption, or has no failure state, and do not bury it under smaller findings.
4. **Spec drift.** Only when the screen has a brief, and unscored. Start with `npx trunative spec` on that brief, whose findings are drift already written down, then read the brief's Hierarchy, Interactions and Navigation against the code, and the screens it names against the briefs that exist. Each entry quotes what the brief says and what the code does: a hierarchy in a different order, a `primary_action` whose label is not the one on screen, a state declared and not implemented, a scope the brief left out. Where the divergence also breaks a rule, name the id that already scores it, such as `state-offline` for a declared state that is not there, and do not score it twice. Drift is a fact about two files disagreeing, and the moment it carries a number this file has two graders in it.
5. **What moved.** Scores a measurement changed, with both numbers.

If a violation is a deliberate exception recorded in `STACK.md`, it is `n/a` with that exception as the reason, not a 1 defended in prose. Whether the exception is a good one is a separate question with its own test, in `references/accepted-exceptions.md`: a rule written as a default admits a reasoned exception, a reason that fails that test is reported as a finding against `STACK.md`, and the nine always in scope and every P0 rule admit none.

Name the element, say what it costs, give the fix. Nothing in the report is an invitation to look into something later.

## 6. Record

Every run gets archived, the partial ones included. A run that left rules `unrun` lists them in its frontmatter, and the trend below says so whenever that list differs from the previous run's: a partial run hidden from the history is not avoided, it is merely forgotten, and the next session starts again from nothing. Rules on a device are the ones most often left `unrun` on a working machine, so a history that only kept complete runs would stay empty.

Write the report to `.trunative/review/<slug>-<YYYY-MM-DD-HHmm>.md`, one file per run, kept in version control. The slug comes from the primary file's project-relative path: lowercase it, replace every run of characters that is not a letter or a digit with a single hyphen, and drop a leading and trailing one, so `lib/screens/checkout_screen.dart` becomes `lib-screens-checkout-screen-dart`. It is computed the same way on every run and never invented, because the trend reads it.

Frontmatter, machine readable:

```yaml
---
target: lib/screens/checkout_screen.dart
slug: lib-screens-checkout-screen-dart
spec: .trunative/screens/checkout.md
date: 2026-09-08T14:22
skill: sha256:6f0a...
mode: full
scope: [colors, typography, touch, buttons, layout, composition, states, motion, accessibility, copy, icons-and-imagery, forms, commerce, payments]
status: VIOLATIONS
violations: [p0: 0, p1: 0, p2: 2, p3: 1]
total: 1106
max: 1400
percent: 79
scored: 128
na: [pay-steering: physical goods, no storefront rule applies, shop-substitute: nothing is picked after the order is placed]
unrun: [a11y-announce, type-scaling]
---
```

`mode` is `full` or `follow-up`. A follow-up run adds `carried`, the date of the full run its carried grades come from, and the trend line below names a follow-up as one, since its percentage mixes fresh grades with carried ones. `unrun` is empty on a complete run, and never left out. `skill` is the hash in `.trunative/skill.lock`. It says which set of rules produced the numbers, which is how a later run knows the rulebook moved under it. `spec` is the screen brief this run graded against, omitted when the screen has none, so a later comparison can tell a screen that changed from a screen whose declared intent changed.

Then read the newest five archived runs with the same slug and print one line:

> Trend for `lib-screens-checkout-screen-dart`: 61%, 74%, 79% (1106/1400 this run).

The comparison is only honest when the measurement is the same, so name any of these that changed since the previous run, on the same line: the skill hash moved, so some of the difference is rules, or the severities that weigh them, rather than the screen; the scope changed, and which files joined or left; or the `n/a` set or the `unrun` set changed, since a rule that was excused or skipped last time and scored now moved the total on its own. The scope may grow between runs and may not silently shrink: a later run covering fewer files is not a better run.

First run: there is nothing to compare against. Say so in one line, name it the baseline, and name the file the next run will read.

## 7. Loop

- Any rule at 1, 2 or `fail`: go back to `flow/build.md` with this report and fix them, P0 and P1 first, then review again.
- A violation in a `comp-` rule where the arrangement itself is the problem is not a build fix. Go back to `flow/explore.md`: a composition nobody chose is repaired by choosing one, and patching the code leaves it unchosen.
- Drift where the code is right and the brief is stale: correct the brief and carry on. Drift where the brief is right and the code left the approved structure: that is hierarchy, actions, states or navigation moving without anyone deciding it, so go back to `flow/spec.md`, not to build.
- Stop when all four of these hold, and not because a number was reached. An average of 4.2 closes nothing by itself:
  1. no P0 or P1 rule is a violation, so the status is not `BLOCKED`;
  2. no rule at all is at 1, 2 or `fail`;
  3. no spec drift is left unresolved, in either direction;
  4. every rule the checklist marks `[device]`, and every one of the nine always in scope, has been checked on the evidence it requires, so none of them is `unrun`.

  Then report what was built, what was checked, what was excused and what was not seen. A run that meets the first three and not the fourth has not closed the screen: it says which checks are outstanding and what would run them.

  `layout-insets` is the check most often left for later and the one whose failure is on every screen of every session, so it is never the outstanding one: a run with it `unrun` is reported as not closed, never as passed, whatever else it covered. Both navigation modes the platform offers, gesture and buttons, and a sheet or dialog open over the screen, are what it takes.

Two consecutive reviews finding the same violation means the fix is not working. Say so and ask the user, instead of looping a third time.

Do not fix and grade in the same pass. A grader that edits the code it just graded has no second opinion left for the next run.
