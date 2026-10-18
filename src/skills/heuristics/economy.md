# Economy

Virtual currency, lives, energy, daily caps and unlock costs: anything the app counts and spends on the person's behalf that is not money. Games carry most of it, and learning apps carry the rest, usually as lives or a daily limit. The person cannot audit any of it outside the app, so every rule here is about showing the count and the cost at the moment they decide.

Real money stays in `heuristics/payments.md`. A pack of currency bought with money is a purchase under `pay-rail` and `pay-price-source`, and only what happens after it lands in the balance is this file's.

## <Rule id="econ-cost-shown" severity="p1" description="The cost sits on the control, and the balance is on the same screen" />

A spend the person cannot see before committing is a spend they did not agree to.

- Every control that spends shows its cost on the control itself, in the unit it is paid in, with the unit's icon and its name for the screen reader (`a11y-name`).
- The current balance of that unit is visible on the same screen, so the comparison is made without leaving it.
- A spend that cannot be undone, or that is large against the balance, takes a confirmation that repeats the cost (`fb-confirm-test`). A small, frequent spend does not.

## <Rule id="econ-contents" severity="p1" description="What is bought is shown before the purchase, and a random reward discloses its odds" />

- A bundle, a pack or a chest lists what is inside before it is bought.
- Where the contents are random, the odds of each outcome are shown before the purchase, on the screen where the purchase is made. Both stores require this of a randomised item bought directly or through a currency bought with money.
- After the purchase, the result is shown in full before anything else is offered.

## <Rule id="econ-afford" evidence="device" description="Whether something is affordable is said in words or shape, never by colour alone" />

A price turned red is the whole message for some people and no message at all for others (`color-not-alone`).

- A control the person cannot afford says so with text or a state the screen reader reads, and shows the shortfall: how much more is needed.
- It also shows the route to the shortfall when one exists: play another round, wait, watch an offer, buy.

## <Rule id="econ-gate" severity="p1" description="A gate is shown where the person enters, not after they start" />

Lives, energy and daily caps stop the person from doing something. The worst place to learn that is halfway in.

- The entry point shows the gate before the tap: how many remain, and when none remain, the time until the next one, the cost of refilling against the balance, and the free route if there is one.
- An action the gate blocks does not let the person start and then stop them. A level that can be opened with no lives left, then refuses at the first move, is the failure.
- The time to refill counts down in the unit a person reads (`data-time-relative`) and survives the app being closed, because it is computed from a stored instant rather than a running timer.
- When a gate refills while the app is closed, the person finds out when they return, or through a notification they opted into, never through a notification nobody asked for (`notify-earns-it`).

## <Rule id="econ-disabled" grade="binary" description="A disabled buy or refill control says why it is disabled" />

A greyed button with no reason sends the person tapping at it, then looking for a setting that does not exist.

- The reason is visible next to the control or on it: not enough of the currency, already full, already owned, available again at a stated time.
- A tap on the disabled control answers with the same reason rather than doing nothing (`button-state`).

## <Rule id="econ-bundle" description="A bundle is offered only to people who do not already own its parts" />

A bundle priced as a saving is a loss for someone who already owns half of it.

- Hide a bundle whose every part is owned, and either hide or reprice one whose parts are partly owned, saying which parts are already theirs.
- The same holds for an offer to remove a limit the person already removed, and for a starter pack shown after the start.

## <Rule id="econ-real-money" description="Currency bought with money shows the money" />

The point of a currency is that it hides the money, which is the reason the rules ask for the money to be visible where it is spent.

- A pack of currency shows its price in the store's local money, from the store (`pay-price-source`), and the amount of currency it gives.
- A spend in currency never sits on the same control as a spend in money, and the two are not drawn so alike that one passes for the other.
- An entitlement bought with money, such as removing ads or unlimited lives, is restored like any other (`pay-restore`) and is not converted into a currency balance that can run out.

<Check>

<Verify rule="econ-cost-shown">Every spending control shows its cost and unit, the balance is on the same screen, and an irreversible or large spend repeats the cost in a confirmation.</Verify>
<Verify rule="econ-contents">Every bundle lists its contents before purchase, every random reward shows its odds on the purchase screen, and the result is shown in full afterwards.</Verify>
<Verify rule="econ-afford">An unaffordable control says so in text the screen reader reads, shows the shortfall, and offers the route when one exists.</Verify>
<Verify rule="econ-gate">Each gated entry point shows remaining count, time to refill, refill cost against balance and the free route before the tap, a blocked action cannot be started, and the refill time is computed from a stored instant.</Verify>
<Verify rule="econ-disabled">Every disabled buy or refill control shows its reason, and a tap on it answers with that reason.</Verify>
<Verify rule="econ-bundle">No bundle is offered to someone who owns all of its parts, and a partly owned bundle is hidden or repriced with the owned parts named.</Verify>
<Verify rule="econ-real-money">Currency packs show the store's local price, currency and money spends never share a control, and money-bought entitlements are restorable rather than spendable.</Verify>

<Device>One of these is settled only on a device. Turn on a colour filter or grayscale, and with the screen reader on, confirm that an unaffordable item reads as unaffordable and its shortfall is spoken (`econ-afford`).</Device>

</Check>
