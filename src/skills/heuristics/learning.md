# Learning

Lessons, quizzes, drills, flashcards, and any tutorial that tests what it taught. A screen like this has a job no other screen has: the person is supposed to leave it knowing something they did not know when they opened it. A wrong answer here is not an error in the sense `state-error` means, it is the material working, and the screen has to treat it that way.

The audience comes from `PRODUCT.md`, and every rule below is read against it. A term a professional uses daily is jargon to a beginner, and a drill paced for a child insults an adult.

## <Rule id="learn-teach-first" severity="p1" description="Nothing is tested before it was taught" />

A question about something the person has never seen measures nothing and teaches that guessing is the game.

- Every item that is tested appears first in a teaching step: shown, explained or worked through, in the same lesson or an earlier one the person has completed.
- A placement test that deliberately probes ahead says so before the first question, and a wrong answer there costs nothing.
- The first question after a teaching step uses the same example or a close one, and the distance grows from there.

## <Rule id="learn-define" description="A term is defined where it first appears, for the declared audience" />

`copy-jargon` keeps the app's own internal words off the screen. In a lesson the subject's vocabulary is the content, so it stays, and is defined the first time it appears.

- Define a term at its first appearance in the lesson, in a sentence or a tap away, never in a glossary the person has to go and find.
- Read every term against the audience in `PRODUCT.md`. A word that needs no definition for the expert reader needs one for the beginner, and the beginner is who most lessons are for.
- Once defined, the term is used the same way everywhere after it (`copy-terms`).

## <Rule id="learn-feedback" severity="p1" description="Feedback points at the answer and at the evidence for it" />

"Wrong" teaches nothing. The person learns from seeing what was right and why.

- After every answer, show whether it was right, the correct answer, and the reason in one or two lines that point at the evidence: the part of the example, the rule, the word in the sentence that decided it.
- A right answer gets the reason too, briefly, because a right guess and a right understanding look the same from outside.
- The feedback stays until the person moves on. It is not a snackbar that leaves while they are reading it (`fb-duration`).

## <Rule id="learn-repeat" description="A missed item comes back, and the person is told when" />

Spaced repetition works, and it confuses people when it is invisible: the same question reappears and the person thinks the app is broken or stuck.

- When an item is missed, say that it will come back, and roughly when: later in this lesson, in the next session, in review.
- When it does come back, mark it as a review of an earlier miss.
- A practice set built from earlier misses says so in its title.

## <Rule id="learn-stakes" description="The weight of a wrong answer matches what is at stake" />

The error colour and the error sound exist to stop people losing work. In practice, a wrong answer loses nothing, and alarm-red with a buzzer teaches people to stop guessing, which is the opposite of practice.

- Practice and drills show a wrong answer calmly: a neutral mark, the correct answer, the reason. The error colour and its emphasis are kept for what can actually be lost.
- A graded test, a placement or anything that spends a life or a limited resource (`econ-gate`) may weigh more, and says before it starts that it counts.
- Repeated misses never turn into a scolding message. The fourth miss gets the same explanation as the first, or a different one.

## <Rule id="learn-commit" description="A single choice answers on tap, and back keeps what was answered" />

A single-choice question with a separate Next button asks for two taps to say one thing, and invites a second tap on the wrong option on the way to Next.

- In practice, a single-choice step commits on the tap of an option and shows the feedback. Where an answer is costly to get wrong, as in a graded test or one that spends a resource, a check step after the choice is right, and it is said once rather than discovered.
- Multiple choice, ordering and typed answers keep an explicit check control, since the answer is not complete at the first tap.
- Back moves to the previous step with its answer kept, and changing an answer that was already marked does not re-score silently (`form-steps`).
- Slides that teach do not advance on a timer the person did not start (`motion-autoplay`).

## <Rule id="learn-no-score-yet" grade="binary" description="Accuracy and progress show nothing before the first answer" />

"Accuracy 0%" on a lesson nobody has started tells the person they failed something they never tried. Before the first answer there is no accuracy, which is a different value from zero (`data-empty-null-zero`).

- Before the first answer, accuracy and streak figures are absent or replaced with a line saying they start with the first answer.
- A progress bar starts empty and labelled with the count, not with a percentage that implies a result.

## <Rule id="learn-progress" severity="p0" evidence="device" description="A lesson in progress survives the process, and Continue continues" />

A lesson is a sequence, and the person is interrupted in the middle of it constantly (`state-interrupt`).

- The position inside a lesson and the answers given so far are saved at every step and survive process death.
- A control labelled Continue resumes at the saved step. If the lesson cannot resume, the control says Start again and the screen says why.
- Results of a completed lesson are saved before the summary screen is shown, so killing the app on the summary loses nothing.

<Check>

<Verify rule="learn-teach-first">Every tested item appears earlier in a teaching step the person has completed, and any placement test says so before its first question.</Verify>
<Verify rule="learn-define">Every subject term is defined at its first appearance, judged against the audience in `PRODUCT.md`.</Verify>
<Verify rule="learn-feedback">After every answer the screen shows right or wrong, the correct answer and a short reason pointing at the evidence, and it stays until the person moves on.</Verify>
<Verify rule="learn-repeat">A missed item is announced as returning, and is marked as a review when it does.</Verify>
<Verify rule="learn-stakes">Practice shows a wrong answer without the error emphasis, and anything that counts says so before it starts.</Verify>
<Verify rule="learn-commit">A single-choice practice step commits on tap, multi-part answers keep a check control, and back keeps earlier answers.</Verify>
<Verify rule="learn-no-score-yet">No accuracy, streak or percentage is shown before the first answer.</Verify>
<Verify rule="learn-progress">The step and answers inside a lesson are saved at every step and survive process death, and Continue resumes at the saved step or is relabelled.</Verify>

<Device>One of these is settled only on a device. Answer two steps of a lesson, kill the process in the background, reopen, and confirm the lesson resumes at the third step with the first two answers kept, or says plainly that it starts again (`learn-progress`).</Device>

</Check>
