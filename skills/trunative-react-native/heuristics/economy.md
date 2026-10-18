# Economy

Virtual currency, lives, energy, daily caps and unlock costs: anything the app counts and spends on the person's behalf that is not money. Games carry most of it, learning apps carry lives or a daily limit, and generative tools carry credits that run out and reset. The person cannot audit any of it outside the app, so every rule here is about showing the count and the cost at the moment they decide.

Real money stays in `heuristics/payments.md`. A pack of currency bought with money is a purchase under `pay-rail` and `pay-price-source`, and only what happens after it lands in the balance is this file's. The parts of a shop screen, the balance header, the pack list and the first-purchase pack, are in `references/paywall-anatomy.md`.

Rules in this file, in order: `econ-cost-shown`, `econ-contents`, `econ-afford`, `econ-gate`, `econ-disabled`, `econ-bundle`, `econ-pack-value`, `econ-balances`, `econ-real-money`.

## `econ-cost-shown` The cost sits on the control, and the balance is on the same screen [P1]

A spend the person cannot see before committing is a spend they did not agree to.

- Every control that spends shows its cost on the control itself, in the unit it is paid in, with the unit's icon and its name for the screen reader (`a11y-name`).
- The current balance of that unit is visible on the same screen, so the comparison is made without leaving it.
- A spend that cannot be undone, or that is large against the balance, takes a confirmation that repeats the cost (`fb-confirm-test`). A small, frequent spend does not.

## `econ-contents` What is bought is shown before the purchase, and a random reward discloses its odds [P1]

- A bundle, a pack or a chest lists what is inside before it is bought.
- Where the contents are random, the odds of each outcome are shown before the purchase, on the screen where the purchase is made. Both stores require this of a randomised item bought directly or through a currency bought with money.
- After the purchase, the result is shown in full before anything else is offered.

## `econ-afford` Whether something is affordable is said in words or shape, never by colour alone

A price turned red is the whole message for some people and no message at all for others (`color-not-alone`).

- A control the person cannot afford says so with text or a state the screen reader reads, and shows the shortfall: how much more is needed.
- It also shows the route to the shortfall when one exists: play another round, wait, watch an offer, buy.
- Where the route is a purchase, the first pack offered is the smallest one that covers the shortfall, and the amount left over after the spend is shown with it. Packs sized so that something is always left over are a second purchase sold in advance.

## `econ-gate` A gate is shown where the person enters, not after they start [P1]

Lives, energy and daily caps stop the person from doing something. The worst place to learn that is halfway in.

- The entry point shows the gate before the tap: how many remain, and when none remain, the time until the next one, the cost of refilling against the balance, and the free route if there is one.
- An action the gate blocks does not let the person start and then stop them. A level that can be opened with no lives left, then refuses at the first move, is the failure.
- The time to refill counts down in the unit a person reads (`data-time-relative`) and survives the app being closed, because it is computed from a stored instant rather than a running timer.
- When a gate refills while the app is closed, the person finds out when they return, or through a notification they opted into, never through a notification nobody asked for (`notify-earns-it`).

## `econ-disabled` A disabled buy or refill control says why it is disabled [pass or fail]

A greyed button with no reason sends the person tapping at it, then looking for a setting that does not exist.

- The reason is visible next to the control or on it: not enough of the currency, already full, already owned, available again at a stated time.
- A tap on the disabled control answers with the same reason rather than doing nothing (`button-state`).

## `econ-bundle` A bundle is offered only to people who do not already own its parts

A bundle priced as a saving is a loss for someone who already owns half of it.

- Hide a bundle whose every part is owned, and either hide or reprice one whose parts are partly owned, saying which parts are already theirs.
- The same holds for an offer to remove a limit the person already removed, and for a starter pack shown after the start.

## `econ-pack-value` A bonus or best value badge is arithmetic from the smallest pack, and the ladder only climbs

Nobody does division in a shop. Comparing 1000 plus 100 with 3000 plus 600 at two prices is a sum the badge exists to do, so the badge has to be the sum.

- Each pack shows the amount of currency it gives, and any bonus as a figure measured against the rate of the smallest pack, computed from the store prices of both (`pay-price-source`).
- The amount per unit of money never falls as the pack grows. A larger pack with a smaller bonus than the one below it is a trap for the person who assumes the ladder climbs.
- "Best value" or "most popular" goes on the pack it describes: the lowest price per unit, or the one most bought, read from sales rather than chosen.
- A pack with no bonus carries no bonus badge. A flat ladder with honest amounts passes.

## `econ-balances` More than one balance says which is spent first, and credits that expire say when [P1]

Two counts behind the same icon hide which money is being spent, and a credit that resets turns a balance into a deadline.

- Where a currency comes in a bought and an earned or bonus form, the screen that spends it says which goes first, and the balance shows both.
- Credits that reset each period or expire, a monthly allowance, a bonus with a deadline, a generation quota, show the date beside the balance and on the screen that sells them. Resetting at midnight in a time zone the person is not in is still a date they need.
- Currency delivered by a subscription arrives in equal amounts each period, and the offer says whether what is left survives a cancellation. Play sells a one time benefit, such as a lump of currency, as an in-app product and not as a subscription.
- A meter of what remains is visible wherever the allowance is spent, so the limit is never first met as a refusal (`econ-gate`).

## `econ-real-money` Currency bought with money shows the money

The point of a currency is that it hides the money, which is the reason the rules ask for the money to be visible where it is spent.

- A pack of currency shows its price in the store's local money, from the store (`pay-price-source`), and the amount of currency it gives.
- A spend in currency never sits on the same control as a spend in money, and the two are not drawn so alike that one passes for the other.
- An entitlement bought with money, such as removing ads or unlimited lives, is restored like any other (`sub-restore`) and is not converted into a currency balance that can run out.

## Check

Review answers each of these against the code, pointing at the line:

- Every spending control shows its cost and unit, the balance is on the same screen, and an irreversible or large spend repeats the cost in a confirmation. `econ-cost-shown`
- Every bundle lists its contents before purchase, every random reward shows its odds on the purchase screen, and the result is shown in full afterwards. `econ-contents`
- An unaffordable control says so in text the screen reader reads, shows the shortfall, offers the route when one exists, and a purchase route leads with the smallest pack that covers it and shows what is left over. `econ-afford`
- Each gated entry point shows remaining count, time to refill, refill cost against balance and the free route before the tap, a blocked action cannot be started, and the refill time is computed from a stored instant. `econ-gate`
- Every disabled buy or refill control shows its reason, and a tap on it answers with that reason. `econ-disabled`
- No bundle is offered to someone who owns all of its parts, and a partly owned bundle is hidden or repriced with the owned parts named. `econ-bundle`
- Every pack shows its amount, every bonus is computed against the smallest pack's rate from store prices, the amount per unit of money never falls up the ladder, and a value badge sits on the pack it describes. `econ-pack-value`
- Where two balances exist, the spending screen says which goes first and both are shown, every expiring or resetting credit shows its date at the balance and at the sale, subscription currency arrives in equal amounts with its fate on cancellation stated, and a remaining meter is visible where the allowance is spent. `econ-balances`
- Currency packs show the store's local price, currency and money spends never share a control, and money-bought entitlements are restorable rather than spendable. `econ-real-money`

One of these is settled only on a device. Turn on a colour filter or grayscale, and with the screen reader on, confirm that an unaffordable item reads as unaffordable and its shortfall is spoken (`econ-afford`).

## Reaches

The rules this file cites and the files that hold them. Open one when a citation above decides something this file does not.

- `heuristics/accessibility.md`: `a11y-name`
- `heuristics/buttons.md`: `button-state`
- `heuristics/colors.md`: `color-not-alone`
- `heuristics/data-display.md`: `data-time-relative`
- `heuristics/feedback.md`: `fb-confirm-test`
- `heuristics/notifications.md`: `notify-earns-it`
- `heuristics/payments.md`: `pay-rail`, `pay-price-source`
- `heuristics/subscriptions.md`: `sub-restore`
