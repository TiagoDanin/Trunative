# Subscriptions

A subscription is the one purchase that keeps charging after the screen that sold it is gone, so whatever the person misread there is billed again every period. On a phone the offer is read in seconds, on one screen, with the price competing against artwork for the same space, and the system sheet that confirms it shows little more than an amount and a period. Every rule here is about what the person agrees to on the paywall matching what that sheet then charges.

The rail, the system sheet and where every price comes from are `heuristics/payments.md`: `pay-rail`, `pay-sheet`, `pay-price-source`. A struck price on physical goods is `shop-price-unit`. Credits, lives and currency that a subscription grants are the `econ-` prefix.

## <Rule id="sub-terms" description="The offer screen carries the terms, the price and the way back in" />

On the screen where the person commits, not one level deeper:

- The subscription's name, its period, and what each period buys, in quantities where there are any: how much storage, how many credits, which content. Every benefit listed is one the entitlement grants (`copy-claims`).
- The renewal price, localised for the storefront and read from the store (`pay-price-source`). A screen that starts a subscription or a trial with no price anywhere on it fails, however the trial is worded.
- A way for an existing subscriber to sign in or restore (`sub-restore`).
- Whether the app is usable without subscribing, and what that use includes, wherever it is. Play lists a promotion that hides this as a violation.
- An introductory price states the intro amount, how long it lasts and the standard price after it. Moving an existing app to a subscription does not take away what current users already paid for.

## <Rule id="sub-billed-first" severity="p1" description="The amount that will be billed is the most prominent price on each option" />

The system sheet confirms an amount and a period. When the paywall led with a different number, the person approved one figure and is charged another.

- On each option, the billed amount and its period are the largest price. A per week, per day or per month equivalent, and any saving, sit in a smaller size and a subordinate position. Apple's subscription guidance states this order, and Play lists an annual plan that leads with a monthly cost as a violation.
- The price of a trial or of an introductory period never stands where the plan's price goes. A tile that reads zero for a plan billing every month is the failure.
- Equivalents use one unit across every option on the screen. Per week on one tile and per day on the next leaves nothing to compare.
- The button, or the line directly above it, repeats what the selected option bills and when.

## <Rule id="sub-discount" severity="p1" description="A saving names what it is measured against, and a struck price is one somebody paid" />

- A struck reference is the store's standard price behind an introductory offer, or a price the product actually charged for that plan. One computed backwards from the discount, the sale price divided by one minus the percentage or simply doubled, is a price nobody paid, and guideline 2.3.1(a) makes promoting a false price grounds for removal. Where EU price indication law applies, an announced reduction is measured from the lowest price of the previous 30 days. The same rule for goods is `shop-price-unit`.
- A "save N%" badge names its comparison, such as twelve months of the monthly plan, and is computed from the two store prices rather than typed. The plan it is compared with is on the same screen.
- The percentage rounds down, never up (`data-precision`).

A reference price computed in code from the sale price is this defect whatever it renders as, and it is visible in the formula.

## <Rule id="sub-trial-end" severity="p1" description="The end of a trial is a date and an amount beside the button, and a promised reminder arrives" />

A free trial turns into a charge with no action from the person. Knowing when is their only protection, and this screen is the only place they read it.

- Beside the button, at the screen's body size and not only in the legal text: the date the trial ends, the amount billed then and its period. Apple asks for the trial length and the price billed after it, and Play for how and when the trial converts and how to cancel.
- The date is computed from the trial length the store returns for this user, not from a constant.
- A control promising a reminder before the trial ends exists only where the reminder can reach the person: notifications already allowed, asked for at that moment under `perm-notify-ask`, or an email address the screen names. Schedule it on the server from the store's renewal data, since a reminder scheduled on the device dies with a reinstall.
- A switch that turns the trial on or off changes the button label and the billing line with it, in both positions.

## <Rule id="sub-plan-choice" description="The plans are one choice, and the button commits to exactly the selected one" />

- The options are a single-choice group: one selected at a time, the selection legible without colour (`color-not-alone`), and each option read as a radio with its name, billed amount, period and selected state (`a11y-name`).
- Preselecting an option is allowed. The button commits to the option visibly selected, and that option's billed amount is on the screen.
- The button names what happens, starting a trial or paying now, with the amount where it is not the wallet button (`button-label`). Continue on a button that starts a charge describes nothing.
- A plan reached through a "view all plans" link answers to every rule in this file on the screen it opens.

## <Rule id="sub-exit" severity="p1" grade="binary" evidence="device" description="The way out is visible in the first frame, against whatever is actually behind it" />

Play lists a trial whose dismiss button is missing or hard to see as a violation, and a paywall escaped only by a system gesture is the shape the stores remove apps for.

- A close control, or a text decline such as "Not now", is present from the first frame, never after a delay or below a scroll.
- It meets `touch-floor`, and 3:1 against the image or video actually behind it, measured on the rendered frame rather than against a theme colour (`color-contrast`). A pale cross over a bright photograph is the common failure.
- It survives every orientation the app supports. A paywall drawn for portrait inside a landscape game loses its exit past the edge (`layout-insets`).
- Restore, help and sign in do not take the corner where the exit usually sits, because the tap meant to leave lands on them.
- A decline naming the free option, "Continue with the free plan", is the strongest version. A decline worded as a loss is `copy-voice`.
- Closing may raise one other offer, once per decision, and that offer's own close leaves for good. A close that opens a second paywall which opens a third is the chain Play describes as purchase flows where a subscribe can be tapped by accident.
- Cancelling the system purchase sheet is the person saying no, not an error: the paywall stays as it was, with no failure message (`state-error` is for failures), and the same single offer limit applies.

## <Rule id="sub-honest" severity="p1" description="Urgency has a real deadline, and the offer is described before it is priced" />

- A deadline, "today only", "price rises soon", "limited time", has an end the server owns, it survives relaunch and reinstall, and the offer goes when it passes. A countdown that restarts, or "limited" with no end at all, is invented urgency.
- What is bought is described before the price is asked for, and people may look at the product first (`onboard-look-first`).
- A paywall placed inside onboarding is not a step of its progress, and closing it lands in the product (`onboard-first-action`).
- Ratings, user counts and rankings shown beside the offer are claims under `copy-claims`.
- The terms are legible at the size of everything else, not the smallest grey on the screen.

## <Rule id="sub-children" severity="p1" description="In an app declared for children, buying sits behind a parental gate" />

- Apple's guideline 1.3 keeps purchasing out of Kids Category apps unless it is behind a parental gate. The gate asks something a child cannot answer by reading the screen, and the purchase screen is reachable only through it.
- Play's Families policy bars blurring virtual coins and real money in apps for children, and bars emotionally manipulative tactics that push a purchase or an ad view. A sad character, a lost streak or a countdown is not a reason given for buying.
- Whether the app makes either declaration comes from `PRODUCT.md`, as it does for `ads-children`.

## <Rule id="sub-restore" description="Restore exists, or a paying customer is locked out" />

A reinstall, a new device, a factory reset and a sign in from another platform are all normal. Any restorable purchase needs a restore path, and the paywall is one of the places it is reachable from.

Restore is a labelled control, not a hidden gesture, and it reports what happened: restored, nothing to restore, or failed with a reason under `state-error`. It does not sit where the exit does (`sub-exit`). A paywall with no restore turns an existing customer into someone being asked to pay twice.

## <Rule id="sub-cancel" description="Cancelling is easy or the app is hostile" />

The platform owns the actual cancellation screen, so the app links to the system page rather than rebuilding it, which is `set-system-owned`. What the app owns is whether that link is findable, and Play requires the in-app route.

A manage-subscription entry buried several levels down reads as obstruction. It belongs where someone looks for it, next to the account exit that `set-account-exit` places. Cancelling a subscription and deleting an account are different actions with different consequences, and `auth-delete` owns the second.

<Check>

<Verify rule="sub-terms">The commit screen carries name, period, what each period buys, the localised renewal price, restore or sign in, and what works without subscribing, and no screen starts a subscription or trial without a price.</Verify>
<Verify rule="sub-billed-first">On every option the billed amount and period are the largest price, equivalents and savings are smaller and share one unit across options, and no trial price stands in for a plan price.</Verify>
<Verify rule="sub-discount">Every struck reference is a store or actually charged price, no reference is computed from the sale price, and every saving names its comparison plan and is derived from store prices, rounded down.</Verify>
<Verify rule="sub-trial-end">The trial end date, the amount billed then and its period sit beside the button at body size, the date comes from the store's trial length, any reminder control is wired to a reachable channel and scheduled on the server, and a trial switch updates the label and the billing line.</Verify>
<Verify rule="sub-plan-choice">The plans are a single-choice group read as radios with name, billed amount, period and state, the button commits to the visibly selected option, and its label names a trial or a charge.</Verify>
<Verify rule="sub-exit">An exit is present from the first frame, meets the touch floor, reaches 3:1 against the rendered background, survives every supported orientation, does not share its corner with restore, help or sign in, and leads to at most one further offer whose close leaves, with a cancelled system sheet treated as a no rather than an error.</Verify>
<Verify rule="sub-honest">Every deadline is server owned and survives reinstall, the offer is described before the price, an onboarding paywall is outside the progress and closes into the product, and the terms are body size.</Verify>
<Verify rule="sub-children">Where the app declares a child audience, every purchase sits behind a parental gate and currency prices are distinguishable from money.</Verify>
<Verify rule="sub-restore">A labelled restore control exists, is reachable from the paywall away from the exit, and reports its result.</Verify>
<Verify rule="sub-cancel">A link to the system cancellation page is reachable from the account area rather than buried.</Verify>

<Device>`sub-exit` is measured on the rendered paywall, not in the layout code: capture the first frame over its real artwork or video in every supported orientation, sample the colour behind the exit, and check its contrast and its target.</Device>

</Check>
