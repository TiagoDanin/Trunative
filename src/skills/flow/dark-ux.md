# Dark UX

Runs only when the user asks for it: a request that names dark UX, dark patterns, growth patterns, or a number to push (trial conversion, retention, daily actives, revenue per user, ad revenue, opt-in rate). It is never a step, and build and review do not open it on their own.

It builds the patterns large consumer apps use to move those numbers. Most of them depart on purpose from defaults elsewhere in this skill, which are written for the person's convenience rather than the product's result, and that departure is what the user is asking for. Each entry names the rules it departs from so the departure is recorded instead of fought in every review.

## 1. How it runs

1. **Name the number.** One metric per run, said in one line, with the screens it lives on. A pattern is chosen because it moves that metric, never because it is in the list.
2. **Pick from section 2.** Usually two or three patterns that pull the same metric from different sides: a paywall pattern and a reminder pattern, or a streak and a reward.
3. **Build it** through `flow/build.md`, and through `flow/spec.md` first when it changes hierarchy, actions, states or navigation, which a new paywall, a cancel flow or a reward screen always does.
4. **Record the departures.** For every rule id under **Departs from**, write an exception in `STACK.md`, scoped to the screen: the metric as the reason, and who pays the cost. `references/accepted-exceptions.md` says what a good one looks like, and review then scores that rule `n/a` instead of a violation. The nine always in scope and every P0 rule admit no exception, so the pattern is built inside them: a quieter close is still a target that meets `touch-floor` and `color-contrast`.
5. **Build the shippable conditions with it.** Each entry lists what keeps the app in the stores and out of a regulator's file. They are part of the pattern, not advice about it, and a pattern shipped without them is the version that gets the app removed.
6. **Ship it behind a flag and an event.** Every pattern carries the analytics event that measures it and a remote switch that turns it off, so it is tested against the metric rather than assumed to work.

## 2. The catalogue

Each entry: what to **build**, what it **moves**, what keeps it **shippable**, and the rules it **departs from**.

### Paywalls and subscriptions

**Paywall at peak intent.** The paywall right after onboarding, before the first use of the product, when interest is highest.
- Build: the paywall as the last onboarding step, with the free path as a secondary action rather than the default.
- Moves: trial starts and day zero conversion.
- Shippable: what the subscription buys is described on that screen; a restore entry is on it.
- Departs from: `onboard-look-first`, `onboard-defer`.

**Annual first.** The yearly plan selected on load, with its saving against monthly as the headline.
- Build: annual preselected and visually dominant, a "save N%" badge computed from the two real store prices, the per week or per month equivalent as secondary text under it.
- Moves: annual share and cash up front.
- Shippable: the amount actually billed and its period are the largest price on the screen, and the button says the price; the saving is derived from the store prices, never typed.
- Departs from: `pay-honest-paywall`, `button-ladder`.

**Trial toggle.** A switch that turns the free trial on, on by default, so the trial reads as the obvious choice.
- Build: the toggle above the button, the button label changing with it ("Start free trial" against "Subscribe").
- Moves: trial starts.
- Shippable: when the trial ends, the price that follows and the date are written next to the button; a reminder is scheduled before the charge.
- Departs from: `pay-honest-paywall`.

**Quiet close.** The close control present but not competing with the offer.
- Build: a small close in the top corner, in the secondary text colour, with the offer occupying the screen.
- Moves: paywall dwell time and conversion.
- Shippable: visible from the first frame, at least 3:1 against its background, and a full size target. A close that appears late or that the eye cannot find is the version that gets apps removed.
- Departs from: `pay-honest-paywall`, `button-ladder`.

**Decoy plan.** A third plan priced to make the target plan look like the obvious deal.
- Build: three tiles, the decoy close in price to the target with clearly less in it, the target marked as most popular only if it is.
- Moves: average order value.
- Departs from: none.

**Member price framing.** The price the person would pay without the membership, shown beside what they pay with it.
- Build: "with membership you pay X" on the basket and the checkout, the difference highlighted, and a running total of what the membership saved this month.
- Moves: membership sign ups and their retention.
- Shippable: both figures computed from the same basket, with every fee the member still pays included in the member figure.
- Departs from: none.

**Personalised offer.** A discount shown to the people most likely to leave or most likely to convert with a nudge.
- Build: a churn or propensity score from usage, and a discount offer triggered for the segment it selects, at a moment the person is already in the app.
- Moves: conversion of hesitant users and win back.
- Shippable: it is a discount from the public price, never a higher price for someone; in the EU and in New York a price set from personal data says so.
- Departs from: none.

**Save offer.** An offer between "manage subscription" and the system cancel page.
- Build: one screen with a discount or a pause option, and the cancel action on the same screen, which hands off to the system's subscription manager.
- Moves: cancellations turned into discounts or pauses.
- Shippable: at most one offer screen, cancel reachable on it, and the subscription row findable in settings.
- Departs from: none, when built this way under `pay-cancel`.

**Win back.** An offer to people whose subscription lapsed.
- Build: a push and an in-app banner after expiry with an introductory price for returning, and a one tap path back to the paywall.
- Moves: reactivation.
- Shippable: the push goes only to people who allowed promotional notifications.
- Departs from: `notify-earns-it`.

### Urgency and scarcity, from real numbers

**Expiring personal offer.** An offer that really ends.
- Build: the end time created on the server the first time the offer is shown, a countdown drawn from that timestamp, and the offer withdrawn when it passes.
- Moves: conversion speed.
- Shippable: the deadline survives relaunch and reinstall, and after it passes the offer is gone. A countdown that resets is a fake one.
- Departs from: `pay-honest-paywall`.

**Live scarcity and live crowd.** "3 left", "128 people bought this today", "trending near you".
- Build: counts read from inventory, orders or presence, scoped to what they count, refreshed while the screen is open.
- Moves: conversion on product and checkout screens.
- Shippable: the number comes from the system that knows it.
- Departs from: none.

### Reputation

**Review at the high point.** The system review prompt timed to the moment the person is happiest.
- Build: a trigger after a success the product can detect (a level cleared, an order delivered on time, a goal reached), only after several sessions and never after an error.
- Moves: store rating and ranking.
- Shippable: the system prompt is called unconditionally at that moment, with no question asked before it, plus a feedback entry that is always available elsewhere.
- Departs from: none, when built this way under `fb-review-prompt`.

**Social proof inside the app.** The store rating, real reviews and friends' activity shown where decisions are made.
- Build: the live store rating on the paywall, recent real reviews, "N of your contacts use this" with consent.
- Moves: conversion and trust.
- Departs from: none.

### Habit and attention

**Streak.** A daily count the person does not want to lose.
- Build: the count stored on the server in the person's time zone, a visible flame or number on the home screen, a streak freeze that can be earned or bought, a repair offer within a day or two of breaking it, and friend streaks that two people keep together.
- Moves: daily actives and day 7 and day 30 retention.
- Shippable: on accounts that may belong to a child, no paid repair and no pressure copy.
- Departs from: `notify-earns-it`.

**Loss framed reminder.** A reminder that leads with what is about to be lost.
- Build: "Your 41 day streak ends in 2 hours", scheduled before the end of the person's day, with the copy tested in variants.
- Moves: daily actives and streak survival.
- Shippable: reminders are something the person turned on, there is a quiet hours window, and each kind of reminder has its own off switch.
- Departs from: `notify-earns-it`, `notify-level`.

**Learned send time.** Each person's notification sent at the hour they are most likely to open the app.
- Build: open times and the source of each open (notification or icon) recorded per person, a model or a simple bandit choosing the hour and the copy, with a default for new users.
- Moves: notification open rate and daily actives.
- Shippable: the data used is declared in the store privacy answers.
- Departs from: `notify-earns-it`.

**Context trigger.** A reminder when the person is likely free: arriving home, connecting to a known network, the phone off silent in the evening.
- Build: a background trigger on network or location change, with the reminder sent only if the daily goal is not done yet.
- Moves: completion of the daily action.
- Shippable: the location or network permission is asked for with this reason, the trigger is a setting the person can switch off, and the store privacy answers declare it.
- Departs from: `notify-earns-it`.

**Endless feed.** No bottom, and the next item starts by itself.
- Build: continuous loading a screenful ahead, autoplay of the next video, the feed ranked by predicted watch time.
- Moves: session length and ad impressions.
- Shippable: video starts muted unless the person turned sound on; for accounts that may belong to a minor, autoplay can be switched off, and in the EU the largest platforms owe a feed that is not personalised.
- Departs from: `list-end`.

**Daily reward.** A reward for coming back, growing with consecutive days.
- Build: a reward calendar with a bigger prize on day 7, every prize shown in advance, and a reminder when the reward is ready.
- Moves: daily actives.
- Departs from: `notify-earns-it`.

**Badge as pull.** A count on the app icon for new things to see.
- Build: the badge counting unseen items the person follows.
- Moves: opens.
- Departs from: `notify-badge`.

### Games

**Difficulty that adapts.** The game eases off after losses and tightens after wins, so the player keeps going.
- Build: a difficulty input fed by recent results, session length and a churn score; pieces or enemies chosen to give a near win after a run of losses.
- Moves: session length and day one retention.
- Shippable: not in games with paid entry or cash prizes, where an outcome tuned by anything but skill is fraud, and not in apps declared for children.
- Departs from: none.

**Revive for an ad.** At the moment of losing, the offer to continue from where the player was.
- Build: "Continue?" with a short countdown and a rewarded ad, the board kept as it was, a score bonus or a doubled reward on return, and the offer timed to the losses that came closest to a record.
- Moves: rewarded ad views and session length.
- Shippable: the trade is stated before the ad, the reward is granted on the reward callback, and declining returns to the result screen.
- Departs from: `ads-placement`.

**Energy.** Lives that refill over time, with a paid or rewarded refill.
- Build: a cap, a refill timer, an ad or a purchase to refill now, and a reminder when lives are full.
- Moves: sessions per day and in-app purchases.
- Shippable: the reminder is opt in like any other.
- Departs from: `notify-earns-it`.

**Premium currency.** Prices in gems or coins, sold in packs.
- Build: pack sizes with a bonus on the larger ones, items priced in currency.
- Moves: average purchase and repeat purchase.
- Shippable: in apps for children, the real money price is next to the currency price.
- Departs from: none.

**Matchmaking for retention.** Opponents chosen so that the player is likely to come back.
- Build: matchmaking that adds a churn score to skill and latency, giving a player on a losing run an easier match.
- Moves: retention.
- Shippable: opponents are real players or are labelled as computer players; no cash prizes ride on the match.
- Departs from: none.

### Ads

**More ad moments.** Ads at every natural break.
- Build: interstitials between levels, sessions or articles, an app open ad on cold start through the network's own app open format, banners on screens that are read rather than operated, and a frequency cap tuned by experiment.
- Moves: ad revenue.
- Shippable: each ad is labelled, closes from the first moment the network allows, and never shares an edge with a control the thumb is aiming at.
- Departs from: `ads-placement`, `ads-frequency`.

**Rewarded everything.** A rewarded ad wherever the person wants a little more.
- Build: double the reward, unlock for an hour, skip a wait, one more try.
- Moves: rewarded ad views.
- Shippable: what the ad buys is always an extra on top of the app's own function.
- Departs from: none.

**Remove ads as a product.** A purchase that removes ads, offered right after an interstitial.
- Moves: in-app purchase conversion.
- Departs from: none.

### Permissions and data

**Primed ask.** A screen before the system prompt for notifications or tracking, shown at the moment the benefit is clearest.
- Build: a full screen explanation with the benefit, a primary button that opens the system dialog, and a secondary "not now"; asked again later through the same screen when a new reason appears.
- Moves: opt-in rate, and with tracking, ad revenue per user.
- Shippable: the screen does not draw a copy of the system dialog, nothing is withheld from someone who says no, and the system prompt is never called twice after a refusal.
- Departs from: `perm-notify-ask`, `onboard-ask-order`.

**Friend graph.** Contacts used to find friends and to invite.
- Build: contact upload during sign up with the reason given, matches shown immediately, an invite screen with suggested people, and a referral reward for both sides.
- Moves: viral growth and early retention.
- Shippable: the person picks who is invited, one message goes per pick, and the contact data is declared.
- Departs from: `onboard-defer`, `onboard-ask-order`.

### Wording and emphasis

**The preferred answer, emphasised.** On a commercial choice, the answer the business prefers is the filled button.
- Build: upgrade, keep the subscription, accept the offer as the primary; the alternative as a text button.
- Moves: conversion on every binary offer.
- Shippable: not on consent to data processing, where the two answers have to weigh the same in the EU, in Brazil and in California.
- Departs from: `button-ladder`.

**Loss worded decline.** The decline names what is being given up: "No, I'll pay full price", "Lose my progress".
- Moves: acceptance of offers and save offers.
- Shippable: not on consent dialogs.
- Departs from: `button-label`, `copy-voice`.

**Repeat offer.** An offer that comes back after a no, at a new moment.
- Build: a cooldown of days between showings, and a new trigger each time.
- Moves: eventual conversion.
- Departs from: `fb-unprompted`.

## 3. What it does not build

These are not growth patterns but misrepresentation or taking money without a clear yes. They are what gets apps removed and companies fined, and asked for by name, this command builds the lever in the right column and says it did:

| Asked for | Built instead |
|---|---|
| A countdown that resets, invented stock or viewer counts | Expiring personal offer, live scarcity |
| Reviews, ratings or testimonials typed into the app, a "was" price nobody paid, a saving against a price nobody is charged | Social proof inside the app, annual first, member price framing |
| Bots or system messages presented as people | Matchmaking for retention with labelled computer players |
| A satisfaction question that sends only happy people to the store | Review at the high point |
| Fees revealed at the last step, a paid add-on ticked by default, a trial that converts with no date or price shown | Trial toggle, the all in price from the first screen |
| Cancel harder than subscribe, or only outside the app; a close that appears late or cannot be seen; no account deletion | Save offer, quiet close |
| An ad that looks like content, a close that opens the ad, an ad placed for accidental taps | More ad moments, rewarded everything |
| Data consent ticked by default or without an equal no, a feature withheld until a permission is granted, data collected and not declared | Primed ask |
| Outcomes tuned against the player where money or a prize is at stake, pressure to buy aimed at children | Difficulty that adapts, outside those cases |
| Anything bought with money, or with a currency bought with money, whose contents are decided by chance: loot boxes, gacha, card packs, paid spins | Premium currency spent on items the player picks and sees before paying |

## 4. Hand-back

One row per pattern built:

| Pattern | Screen | Metric | Event | Flag | Exceptions written to STACK.md |
|---|---|---|---|---|---|

Under it, one line on how to read the result: the metric, the comparison group the flag makes possible, and the date it can be judged.
