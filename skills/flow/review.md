# Review

Runs after every build, on the code that was just written, and again on request over a finished screen. Reviewing your own output is the point: the build step optimizes for getting the screen working, and this step optimizes for finding where it fails in a hand.

One grader, one scale, one set of rule ids. What changes between a run on a diff and a run on a screen is not the standard, it is how much of the screen was actually seen, and the report says so.

## The scale

Every rule in scope gets a number from 1 to 5. The same words on every rule, on every run, because a rule that invents its own wording for a 3 makes two runs incomparable.

- **1**: broken. What the rule exists to prevent is on the screen and the person using the app meets it.
- **3**: met on the ordinary path, and nothing beyond it was asked.
- **5**: met on the ordinary path and on the edges the rule itself names, with the evidence to say so.
- **2** and **4** are the gaps. A 2 is something in place that does not hold: met on one screen and dropped on the next, or met for the default case while the rule's own case is the exception. A 4 is a 5 with one thing outstanding.

A **violation** is a 1 or a 2, and that is the whole of the gate: the build loop continues while any rule is at 1 or 2. Nothing at 3 or above blocks a build, which does not make it finished.

Two answers that are not scores:

- **`n/a`**, with the reason in the row: the feature does not exist here, the platform does not have it, or `STACK.md` records the exception. Not available for the nine rules under **Always in scope** in `SKILL.md`.
- **`unrun`**: the rule applied, nothing was checked, and the run knows it. A rule you did not check is never a pass.

Anchors are not a curve. Most rules on a screen built with this skill land at 3 and 4, a 5 is earned by evidence rather than by the absence of a complaint, and a screen with no 1s and no 2s is a screen that ships, which is a lower bar than a good screen.

## 1. Re-read the code

Review the actual code, not your memory of writing it. Open the files that changed.

After a build that is the diff. On request it is the screen: the widget, view or composable that renders it plus whatever it pushes and presents, opened on a device or a simulator.

## 2. Scope and checklist

The scope is every base file plus the extra files this screen touches, settled by your own pass over the Extra table in `SKILL.md` rather than by what the build says it opened. The nine always-in-scope rules sit inside the base files and are never `n/a`. Write the scope down before grading. A scope chosen once the scores are in is a scope chosen to flatter them.

An identity the build had to settle because `DESIGN.md` did not carry one is part of the scope, not a note beside it. It is graded by `color-derived`, `type-face`, `layout-shape` and `icon-depicts`, against the five lines the build wrote, and a screen whose identity would fit any other product in the category scores a 1 on the first of them however clean the rest of the code is.

Name the screen first, the same way build does, and derive the scope from the name. A build that named it wrong took the wrong files with it, and a review that inherits the build's list inherits the mistake. Where your pass reaches a file the build never opened, its rules are in scope all the same and every one of them is `unrun` until it is checked: a rule nobody looked at is not a rule that passed.

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

A screen is never closed on `source` alone. Render it, look at it, and keep the capture beside the report. What the file hides and the picture shows in a second: the last row of content sitting under a pinned bar, the primary action stranded in the middle of an empty frame, a hero occupying a third of the height and depicting nothing, placeholder text standing in as the content. None of that is arguable from code, and all of it is what a person sees first.

<If stack="web">
```sh
chrome --headless --window-size=402,874 --screenshot=screen.png file:///absolute/path/screen.html
```
</If>

<If stack="flutter,react-native,swiftui,compose">
```sh
xcrun simctl io booted screenshot screen.png   # iOS simulator
adb exec-out screencap -p > screen.png         # Android emulator or device
```
</If>

<If stack="other">
Capture the running screen the way this platform captures one, and scroll to the end of the content before the capture.
</If>

Scroll to the end of the content before capturing, or the collision `layout-chrome` exists to catch stays hidden.

When the app is running on a device, split the work in two and keep the halves apart, because a grader who has already read the measurements grades the measurements:

**Judging.** Reads the source, drives the screen, and fills in every row.

**Measuring.** Produces numbers and captures, no scores at all, each keyed to a rule id. Start with the one measurement that needs no device:

```sh
npx trunative detect lib/screens/checkout_screen.dart
```

It reads the files and answers the part of a `Check` line a file can settle, reporting per rule id. Three things follow from that and none of them is optional: every finding is `source` evidence, so it never settles a rule marked `[device]`; a finding is a place to look rather than a score; and its silence proves nothing, so a rule it did not answer stays with the grader. It exits 2 when it finds something, which is not a failure.

Then the measurements that do need a device: both appearances on the narrowest and widest device class, the largest accessibility text step on the narrowest, hit area bounds read from the inspector rather than estimated from a screenshot, the primary flow completed with the screen reader on, the screen with the network off and after a process kill the system would have made itself, and real records rather than seed data, meaning a null, a zero, a long string, an old timestamp and an empty list.

How the two are kept apart depends on the harness you are running in:

<If agent="claude">
Run them as sub-agents, spawned in one message so they work at the same time and neither reads the other's output.
</If>

<If agent="other">
Run them as sub-agents when this harness has them, spawned so that neither reads the other's output. When it does not, finish the judging pass and record it, then measure.
</If>

Then reconcile: the judged score stands unless a measurement contradicts it, and every score a measurement moved is printed with both numbers. The report is one table, not one pass after the other. When they could not be kept apart, the report says so on its first line.

## 4. The numbers

The maximum is 5 times the number of rules actually scored from 1 to 5. Nothing else is in it.

- The denominator is never the size of the scope. A scope of 74 rules with 9 `n/a` and 5 `unrun` scores out of 300, not out of 440.
- Report coverage beside the total: scored, `n/a` and `unrun`, out of the scope. A run that skipped the device work does not come out ahead of one that did it.
- Record which ids were `n/a` and which were `unrun`. A later comparison against a run that hid them is a comparison of two different measurements.

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

1. **Header.** What was reviewed, the scope, the total, the percentage, the band and the coverage.
2. **The table.** Columns: rule, score, evidence, finding. Print every rule at 4 or below and every one of the always-in-scope nine, then one line per file for the rest: file, rules scored, average, lowest.
3. **Violations.** Every rule at 1 or 2, ordered by what it costs the person using the app and not by how easy it is to fix. Each names the rule id, the file and line, what the user meets, and the fix. Say plainly when the screen is unusable one-handed, loses work on interruption, or has no failure state, and do not bury it under smaller findings.
4. **What moved.** Scores a measurement changed, with both numbers.

If a violation is a deliberate exception recorded in `STACK.md`, it is `n/a` with that exception as the reason, not a 1 defended in prose.

Name the element, say what it costs, give the fix. Nothing in the report is an invitation to look into something later.

## 6. Record

A run with nothing `unrun` is a complete measurement and gets archived. A run that left rules unchecked prints its table and stops here, naming the rules that blocked the archive, because a partial run in the history makes every later comparison lie.

Write the report to `.trunative/review/<slug>-<YYYY-MM-DD-HHmm>.md`, one file per run, kept in version control. The slug comes from the primary file's project-relative path: lowercase it, replace every run of characters that is not a letter or a digit with a single hyphen, and drop a leading and trailing one, so `lib/screens/checkout_screen.dart` becomes `lib-screens-checkout-screen-dart`. It is computed the same way on every run and never invented, because the trend reads it.

Frontmatter, machine readable:

```yaml
---
target: lib/screens/checkout_screen.dart
slug: lib-screens-checkout-screen-dart
date: 2026-09-08T14:22
skill: sha256:6f0a...
scope: [touch, forms, states, layout, typography, colors, motion, accessibility]
total: 236
max: 300
percent: 79
scored: 60
na: [pay-restore: no purchases on this screen, ads-report: no Android build]
---
```

`skill` is the hash in `.trunative/skill.lock`. It says which set of rules produced the numbers, which is how a later run knows the rulebook moved under it.

Then read the newest five archived runs with the same slug and print one line:

> Trend for `lib-screens-checkout-screen-dart`: 61%, 74%, 79% (236/300 this run).

The comparison is only honest when the measurement is the same, so name any of these that changed since the previous run, on the same line: the skill hash moved, so some of the difference is rules rather than the screen; the scope changed, and which files joined or left; or the `n/a` set changed, since a rule that was excused last time and scored now moved the total on its own. The scope may grow between runs and may not silently shrink: a later run covering fewer files is not a better run.

First run: there is nothing to compare against. Say so in one line, name it the baseline, and name the file the next run will read.

## 7. Loop

- Any rule at 1 or 2: go back to `flow/build.md` with this report and fix them, then review again.
- Nothing below 3: stop. Report what was built, what was checked, what was excused and what was not seen.

Two consecutive reviews finding the same violation means the fix is not working. Say so and ask the user, instead of looping a third time.

Do not fix and grade in the same pass. A grader that edits the code it just graded has no second opinion left for the next run.
