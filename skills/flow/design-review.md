# Design review

A graded audit of a screen that already exists. Every rule in scope gets a number from 1 to 5, the run ends with a total, and the total is written down so the next run can be compared against it.

This is not part of the build loop. It runs on a screen that is finished enough to open on a device, at the point where the question stops being "does this ship" and becomes "how good is it".

## The boundary with review

`flow/review.md` is the gate. It runs after every build, on the diff, and answers pass, violation or not applicable. It is fast because it has to run every time.

This flow is the audit. It runs when someone asks for it, on a screen rather than a diff, and it grades.

They share the rule ids and they share the Check lines, so they cannot both be the authority on the same rule. The split:

- Review decides whether the code ships. It never prints a score.
- The audit decides how good it is. It never blocks a build.
- The two vocabularies are locked together: a 1 or a 2 is what review calls a violation, a 3 or above is what review calls a pass.
- When the audit grades a rule below 3 that review passed, the audit is right and review was wrong, because review read a file and the audit watched the screen. Say that in the report, naming the rule, so nobody reconciles the two by hand later.
- The audit does not reopen an exception recorded in `STACK.md`. It scores the rule `n/a`, with the exception as the reason.

## 1. Fix the target

Resolve what is being reviewed to concrete files, not to a description. "The checkout screen" becomes the widget, view or composable that renders it, plus whatever it pushes and presents.

Derive the slug from the primary file's project-relative path: lowercase it, replace every run of characters that is not a letter or a digit with a single hyphen, and drop a leading and trailing hyphen. `lib/screens/checkout_screen.dart` becomes `lib-screens-checkout-screen-dart`. The slug is what the trend reads, so it is computed the same way on every run and never invented.

## 2. Decide the scope

The scope is the set of heuristics files this screen touches, decided the same way `flow/build.md` decides it, plus the nine rules under **Always in scope** in `SKILL.md`, which are in scope on every screen and are never `n/a`.

Two rules about the scope, because it is the denominator:

- Write it down before grading, not after. A scope chosen once the scores are in is a scope chosen to flatter them.
- It may grow between runs and it may not silently shrink. A later run covering fewer files is not a better run, and the report says which files left and why.

## 3. Generate the checklist

```sh
npx trunative rubric --only touch --only forms --only states
```

`--only` takes a heuristics file stem, a rule prefix such as `touch-`, or a single rule id, and repeats. The nine always-in-scope rules are added whatever the scope is.

The worksheet is generated, never written by hand:

- Do not add a row. A rule that should exist belongs in `heuristics/`, and the next run picks it up with no second edit.
- Do not delete a row. A rule that does not apply is graded `n/a` with a reason, which is a different fact from a rule nobody looked at.
- Do not grade a rule that is not on the worksheet. An id that is not there was renamed or removed, and a score for it is a score for nothing.

Each row carries the rule's own Check line, which is the criterion. Grade against that sentence, not against a memory of the heuristic. Where the file closes its Check section by saying what a diff cannot settle, that paragraph is printed under the group as `Not from a diff`, and it decides the evidence in step 6.

`--format=json` prints the same set for tooling, `--format=ids` prints the ids alone, which is what a diff against the previous run reads to catch a rename.

## 4. Two passes, kept apart

The audit runs twice over the same screen, once judging and once measuring, and the two must not see each other while they work. A grader who has already read the measurements grades the measurements.

**Pass A, the grading.** Reads the source and drives the running screen, and fills in every row: score, evidence, one line of finding.

**Pass B, the measuring.** Produces numbers and captures, no scores at all, each keyed to a rule id:

- Both appearances, on the narrowest and the widest device class the app supports.
- The largest accessibility text step, on the narrowest one.
- Hit area bounds read from the inspector or the layout tree, never estimated from a screenshot.
- The primary flow completed with the screen reader on, and again with the keyboard closed and reopened.
- The screen with the network off, and after a process kill the system would have made itself.
- Real records rather than seed data: a null, a zero, a long string, an old timestamp, an empty list.

<if:claude>
Run A and B as two sub-agents, spawned in one message so they run at the same time and neither reads the other's output.
<else>
Run A and B as two sub-agents when this harness has them, spawned so that neither reads the other's output. When it does not, run A to completion and record it, then run B.
<endif>

When they cannot run apart, the first line of the report is `Single pass: <reason>`. A run that merged the passes and did not say so is a run whose numbers cannot be trusted against the previous one.

Then synthesise. A's score stands unless B measured something that contradicts it, and every score B moved is printed with both numbers. The report is one table, not pass A followed by pass B.

## 5. What the numbers mean

The same words on every rule, on every run. A rule that invents its own wording for a 3 makes the total incomparable, which is the only thing the total is for.

- **1**: broken. What the rule exists to prevent is on the screen and the person using the app meets it.
- **3**: met on the ordinary path, and nothing beyond it was asked.
- **5**: met on the ordinary path and on the edges the rule itself names, with the evidence to say so.
- **2** and **4** are the gaps. A 2 is something in place that does not hold: met on one screen and dropped on the next, or met for the default case while the rule's own case is the exception. A 4 is a 5 with one thing outstanding.

Anchors are not a curve. Most rules on a screen that was built with this skill land at 3 and 4, a 5 is earned by evidence rather than by the absence of a complaint, and a screen with no 1s and no 2s is a screen that passes review, which is a lower bar than a good screen.

## 6. Where the score came from

Every row records its evidence, in one of three values:

- `source`: the code was read. The claim is about intent.
- `device`: the screen was driven. The claim is about the app.
- `source+device`: both, and they agreed. A rule where they disagree is graded from the device, and the disagreement is a finding.

A rule its file's `Not from a diff` paragraph puts on a device may not take `source`. The file has already said a diff cannot settle it, so a number from the source alone is a guess wearing a score. Those rules are graded `device` or `source+device`, or they are `unrun`.

Some of those paragraphs name the ids and some point at the lines instead, as the last three or the last five. Count them against the group in the worksheet, which is in the file's own order. A file that closes without such a paragraph exempts nothing: every one of its rules can be graded from the source, and the ones worth seeing on a device are still worth seeing there.

`unrun` is not a score and it is not `n/a`. It means the rule applied, nothing was measured, and the run knows it. Two things follow: it leaves the total, and it counts against the run's coverage, so a run that skipped the device work cannot come out ahead of one that did it.

## 7. `n/a`, and the denominator

`n/a` is available to any rule outside the always-in-scope nine, and it always carries a reason in the row: the feature does not exist on this screen, the platform does not have it, or `STACK.md` records the exception.

The maximum is 5 times the number of rules actually scored from 1 to 5. Nothing else is in it.

- The denominator is never the size of the scope. A scope of 74 rules with 9 `n/a` and 5 `unrun` scores out of 300, not out of 440.
- Record which ids were `n/a` and which were `unrun`. A later comparison against a run that hid them is a comparison of two different measurements.
- Report coverage beside the total: scored, `n/a`, `unrun`, out of the scope.

Bands read off the percentage, since the maximum moves with the scope:

| Percentage | Band |
|---|---|
| 90 and above | Nothing structural left. |
| 75 to 89 | Solid, with named gaps. |
| 60 to 74 | It works, and the edges do not. |
| 40 to 59 | Structural work before polish. |
| Under 40 | Not designed for a phone yet. |

## 8. The report

The report is the deliverable and it goes in the response, not only in the file. In order:

1. **Header.** Target, slug, scope, how the passes ran, total, percentage, band, coverage.
2. **The table.** Columns: rule, score, evidence, finding. Print every rule scored 4 or below and every one of the always-in-scope nine, then one line per file for the rest: file, rules scored, average, lowest. The snapshot keeps every row; the response keeps the ones worth reading.
3. **What is working.** Two or three things, with the reason they work.
4. **Priority issues.** Every rule at 1 or 2, ordered by what it costs the person using the app and not by how easy it is to fix. Each one names the rule id, the file and line, what the user meets, and the fix. Say plainly when the screen is unusable one-handed, loses work on interruption, or has no failure state, and do not bury it under smaller findings.
5. **What moved.** Scores pass B changed, with both numbers, and rules that disagree with the last review verdict.

Name the element, say what it costs, give the fix. Nothing in the report is an invitation to look into something later.

## 9. The snapshot

Write the report to `.trunative/design-review/<slug>-<YYYY-MM-DD-HHmm>.md`, one file per run, kept in version control. The archive is what makes the next run comparable, so it is written after the report is delivered and never instead of it.

Frontmatter, machine readable, because this is what the trend reads:

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
unrun: [state-offline, form-persist]
---
```

`skill` is the hash in `.trunative/skill.lock`. It says which set of rules produced the numbers, which is how a later run knows the rulebook moved under it.

The body is the report as delivered, with the full table rather than the trimmed one.

## 10. The trend

Read the newest five snapshots with the same slug and print one line after the report:

> Trend for `lib-screens-checkout-screen-dart`: 61%, 74%, 79% (236/300 this run).

The comparison is only honest when the measurement is the same. Print the percentages, and name any of these that changed since the previous run, on the same line:

- **The skill hash moved.** The rulebook changed, so some of the difference is rules and not the screen.
- **The scope changed.** Say which files joined or left.
- **The `n/a` or `unrun` sets changed.** A rule that was `unrun` last time and scored now moved the total on its own.

First run: there is nothing to compare against. Say so in one line, name it the baseline, and say the file the next run will read.

## 11. Close

Hand the priority issues back to `flow/build.md`, highest cost first. Build fixes them, `flow/review.md` gates the fix, and this flow runs again when the screen is worth grading a second time. Do not fix them here: a grader that edits the code it just graded has no second opinion left for the next run.
