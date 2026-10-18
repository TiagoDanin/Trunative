# Generated answers

An answer written by a model for this person, now: an assistant thread, a summary placed over a document, a suggested reply, a drafted description. It differs from everything else the app shows in three ways. It arrives in pieces over several seconds, so the screen changes while it is being read. It can be wrong while sounding certain, so the person needs a way to check it. And it often costs something per request, in money or in a quota, so a failure or a limit takes something the person already spent.

Here: following text as it arrives, the wait before it does, stopping, failing halfway, where a claim came from, generated content leaving the conversation, earlier versions, limits and cost, the composer's modes, and what the screen reader hears. The transcript as a column that grows from its bottom is `chat-anchor`, the composer's ceiling is `chat-composer` and attaching is `chat-attach`. Loading placeholders are `state-loading`, failure wording is `state-error` and keeping the input across a retry is `state-retry`. A scroll during a drag is `scroll-programmatic`. A link opened from an answer goes through `webview-surface-choice`, and an upgrade offered at a limit answers to `pay-honest-paywall`.

## <Rule id="ai-stream" evidence="device" description="Text arriving in pieces never moves what is being read" />

A streamed answer grows the column under the eye several times a second, for as long as the generation runs, and the person starts reading the first sentence long before the last one exists.

- The view follows the newest text only while the person is at the end of it, within a written distance of the bottom. The first drag away from the end stops following, and nothing pulls the view back down while the answer keeps growing, which is `scroll-programmatic`.
- Once following has stopped, one control carries the person back to the end, drawn the way `chat-new-arrival` draws its pill, and it stays until it is used or the end is reached.
- Text grows at the end of the answer and nowhere above the reading position (`scroll-anchor`). A block that resolves late inside the answer, a table, an image, a code block, a source card, reserves its box when it starts rather than when it finishes.
- A new answer opens with its own first line at the top of the visible area once it is longer than a screen, rather than being scrolled past to its last line: the person reads an answer from the start, unlike a message they glance at.

## <Rule id="ai-waiting" description="The wait before the first word says that work is happening, and which work" />

The gap before the first piece can be a second or a minute, and a request that runs tools, reads files or searches spends most of its time in steps the person cannot see.

- The moment the request leaves, the screen shows that it was received and is being worked on, in the place the answer will appear.
- A step that takes longer than a couple of seconds is named while it runs: reading the attachment, searching, running the calculation. The name is the step, not a generic "thinking".
- No skeleton shaped like a finished answer, and no placeholder text that could be read as the answer. `state-loading` rules placeholders shaped like content that is known; the length and shape of an answer that does not exist yet is not known.
- A wait past a written threshold says that it is still going and offers the stop from `ai-stop`, rather than looking identical at second two and at second ninety.

## <Rule id="ai-stop" description="A stop control is there for the whole generation, and stopping keeps what arrived" />

The person often knows within the first lines that the answer is going the wrong way, and every further second costs their time and, where generation is metered, their quota.

- Stop is visible from the moment the request leaves until the last piece arrives, in the place send occupies, at the platform target floor (`touch-floor`), with a name the screen reader reads (`a11y-name`).
- Stopping keeps every piece that already arrived, marks the answer as stopped, and leaves the prompt editable. A stop that throws the partial answer away punishes the person for using it.
- Send does not return while a generation is in flight unless sending again is a defined action, queued or replacing, and the control says which.

## <Rule id="ai-failure" description="A failure halfway keeps the partial answer and says it is incomplete" />

A stream can break after forty lines: the connection drops, the request times out, the service refuses to continue. Of all the requests the app makes, this is the one most likely to fail late, after the person has started reading.

- What arrived stays on screen, marked as incomplete in words, never left looking like a finished answer that happens to end mid sentence.
- The error says what failed and does not invent why (`state-error`), and retry is offered on the answer itself.
- Retrying never loses the prompt, its attachments or the chosen mode (`state-retry`). A retry that makes the person type the question again is a second failure.
- A refusal by the model is not a failure of the transport, and it is not drawn as one: it is an answer, shown as text, with the next move the person has.

## <Rule id="ai-sources" severity="p1" description="A claim of fact says where it came from, at the place it is made" />

A generated answer reads with the same confidence whether it is right or not, so the screen is the only place the person can tell a checked claim from a guess.

- Where the answer draws on documents, pages or the person's own data, the source is attached to the sentence or the paragraph that uses it, not collected in a list at the bottom that nobody connects back.
- Tapping a source opens it in the surface `webview-surface-choice` picks, and the person comes back to the answer at the same place.
- An answer produced with no sources does not wear the look of one that has them: no numbered markers that lead nowhere, no source card for a page that was not read.
- Figures, dates, prices, dosages and anything the person could act on are the claims that need it most, and an answer that offers to act on such a figure shows the figure and its source in the confirmation.

## <Rule id="ai-marked" severity="p1" description="Generated content stays marked as generated, and nothing leaves without the person's own tap" />

Generated text travels: into a reply, a post, a form field, an email, an order. Once it has left the thread nothing distinguishes it from what the person wrote, and the person is the one answerable for it.

- Generated content placed anywhere outside the conversation, a drafted reply in a composer, a filled field, a summary above a document, is marked as generated where it sits, until the person edits or accepts it.
- Nothing generated is sent, posted, published, booked or paid on the model's initiative. The final step is a control the person taps, on a screen that shows exactly what will go and to whom, in their own words if they edited it.
- An action with a cost or a recipient repeats what it will do in the confirmation (`fb-confirm-test`, `pay-total`). A suggestion is an offer, and dismissing it is one tap.

## <Rule id="ai-versions" description="Regenerating keeps the previous answer reachable" />

A second attempt is often worse than the first, and the person cannot know that until they have read both.

- Regenerating adds a version rather than replacing one, and the person can move between versions of the same answer, with the position stated (two of three).
- Editing an earlier prompt says, before it is sent, what happens to everything after it in the thread: kept as a branch, or discarded. Discarding without saying so loses work the person did not mean to give up.
- Copying an answer copies the version on screen, as text, without the interface around it.

## <Rule id="ai-limits" description="A limit is stated before the request, and reaching it keeps what was typed" />

A quota, a per-message cost or a daily cap is a gate on the composer, and the worst place to learn about it is after writing a long prompt.

- Where requests are counted or priced, the remaining amount is visible before sending, near the composer, in the unit the limit is counted in, as `econ-gate` asks of any gate.
- Reaching the limit keeps the typed prompt and its attachments, says when the limit resets as a time, and names the routes that exist: wait, a smaller mode, an upgrade.
- An upgrade offer never replaces the input field or sits on top of it. The composer stays a composer, and the offer answers to `pay-honest-paywall`.
- A request that will cost more than the usual one, a long document, a heavier mode, says so before it is sent.

## <Rule id="ai-composer" description="Mode, model and attachments are visible state in the composer, readable before sending" />

The same prompt gives a different answer under a different mode, and the person decides what to type based on which one is active.

- The active mode or model is shown on the composer as text, not only as an icon, and changing it is one control that opens a list, never a gesture.
- Attachments waiting to be sent are rows in the composer with their names and a remove control, as `chat-attach` rules for any pending attachment, and each one says whether it was read once the answer arrives.
- Voice input shows that it is listening and what it heard before the text is sent, and the person can correct it in the field.
- The composer keeps its written ceiling from `chat-composer`, and unsent text survives leaving the screen (`form-persist`).

## <Rule id="ai-a11y" evidence="device" description="The screen reader hears the finished answer once, not every piece" />

A live region over a stream would speak every fragment as it lands, cutting itself off several times a second.

- While the answer streams, announce that a response is being written, once. When it ends, announce that it is complete, once, and let the person read it as content. Content changing without a navigation is `a11y-announce`, and the polite level `chat-a11y` uses is the one here.
- The stop control stays reachable and named for the whole generation, and focus is not moved onto the growing text.
- A stopped, failed or incomplete answer says which in text the screen reader reads, not only by a colour or an icon (`color-not-alone`).
- Each answer is one block the reader can step into and out of, with its sources and its version controls inside it (`a11y-order`).

<Check>

<Verify rule="ai-stream">The view follows a streaming answer only within a written distance of its end, the first drag away stops following, one control returns to the end, late blocks reserve their box when they start, and an answer longer than a screen is presented from its first line.</Verify>
<Verify rule="ai-waiting">A sent request shows at once that it is being worked on, in the place the answer will appear, steps longer than a couple of seconds are named, no answer-shaped skeleton or placeholder text stands in, and a wait past a written threshold says it is still going.</Verify>
<Verify rule="ai-stop">Stop is visible and named at the target floor for the whole generation in the place of send, stopping keeps the partial answer marked as stopped with the prompt still editable, and a send during generation is either unavailable or labelled with what it does.</Verify>
<Verify rule="ai-failure">A broken stream keeps its partial text marked as incomplete in words, the error names what failed, retry sits on the answer and keeps the prompt, attachments and mode, and a refusal is shown as an answer rather than as a transport error.</Verify>
<Verify rule="ai-sources">Sources are attached to the sentence or paragraph that uses them, open in the right surface and return to the same place, no source marker exists without a source behind it, and an action on a figure shows the figure and its source in the confirmation.</Verify>
<Verify rule="ai-marked">Generated content outside the conversation is marked as generated until edited or accepted, and nothing is sent, posted, booked or paid without the person's tap on a screen showing exactly what goes and to whom.</Verify>
<Verify rule="ai-versions">Regenerating adds a version the person can move between with the position stated, editing an earlier prompt says beforehand what happens to the rest of the thread, and copy takes the version on screen as plain text.</Verify>
<Verify rule="ai-limits">Remaining quota or cost is visible before sending, reaching the limit keeps the prompt and attachments and states the reset time and the routes, no offer covers or replaces the composer, and an unusually expensive request says so first.</Verify>
<Verify rule="ai-composer">The active mode or model is shown as text on the composer and changed through one listed control, pending attachments are named rows with a remove control, voice input shows what it heard before sending, and unsent text survives leaving the screen.</Verify>
<Verify rule="ai-a11y">A streaming answer is announced once when it starts and once when it completes rather than per piece, stop stays reachable and named, focus does not follow the growing text, and stopped, failed and incomplete states are spoken in words.</Verify>

<Device>Two of these are settled only on a device. Start a long answer, scroll up a screenful while it is still arriving and watch whether the view is pulled back down, then use the return control (`ai-stream`). Run the same generation with the screen reader on, confirm it is announced once at the start and once at the end, and stop it from the reader alone (`ai-a11y`).</Device>

</Check>
