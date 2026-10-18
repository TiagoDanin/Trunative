# Dark UX

Runs only when the user asks for it: a request that names dark UX, dark patterns, growth patterns, or a number to push (trial conversion, retention, daily actives, revenue per user, ad revenue, opt-in rate). It is never a step, and build and review do not open it on their own.

It builds the patterns large consumer apps use to move those numbers. Most of them depart on purpose from defaults elsewhere in this skill, which are written for the person's convenience rather than the product's result, and that departure is what the user is asking for. Each entry names the rules it departs from so the departure is recorded instead of fought in every review.

## 1. How it runs

1. **Name the number.** One metric per run, said in one line, with the screens it lives on. A pattern is chosen because it moves that metric, never because it is in the list.
2. **Pick from section 2.** Usually two or three patterns that pull the same metric from different sides: a paywall pattern and a reminder pattern, or a streak and a reward.
3. **Build it** through `flow/build.md`, and through `flow/spec.md` first when it changes hierarchy, actions, states or navigation, which a new paywall, a cancel flow or a reward screen always does.
4. **Record the departures.** For every rule id under **Departs from**, write an exception in `STACK.md`, scoped to the screen: the metric as the reason, and who pays the cost. `references/accepted-exceptions.md` says what a good one looks like, and review then scores that rule `n/a` instead of a violation. The nine always in scope and every P0 rule admit no exception, so the pattern is built inside them: a quieter close is still a target that meets `touch-floor` and `color-contrast`.
5. **Build the shippable conditions with it.** Each entry lists what keeps the app in the stores and out of a regulator's file. They are part of the pattern, not advice about it, and a pattern shipped without them is the version that gets the app removed.
6. **Ship it behind a flag and an event.** Every pattern carries the analytics event that measures it and a remote switch that turns it off, so it is tested against the metric rather than assumed to work. A pattern that sells sits on a named placement. On a Firebase project, `flow/firebase.md` says how Remote Config, A/B Testing, Cloud Functions and the stores' server notifications carry the switch, the experiment, the entitlement and the reminders without another service.

## 2. The catalogue

Each entry: what to **build**, what it **moves**, what keeps it **shippable**, and the rules it **departs from**.

### Targeting and experiments

The patterns below the first four read who the person is. These four are what they read from.

**Return probability.** A per person estimate of coming back tomorrow, recomputed every day, that decides which intervention each person gets.
- Build: features from the last weeks of use (sessions per day, how each session started, from a notification or from the icon, mistakes or failures in the last session, a crash since the last open, days since the last purchase), a model trained on whether the person came back the next day, a score stored per person, and the previous score kept beside it so a drop is visible. Below a threshold, the person gets the cheapest intervention that works for their segment: an easier session, a reminder, a streak freeze, a discount.
- Moves: next day retention, and the cost of keeping each person.
- Shippable: the signals used are declared in the store privacy answers, and nothing the person typed is a feature.
- Departs from: `priv-instrument`, when crash and mistake counts become features.

**Ad value per player.** Each player's worth to the ad network estimated, and ad formats and offers allocated by it.
- Build: a value table by device model and country, kept as remote config; the player's own history (rewarded ads watched to the end, revenue reported per impression); high value players get more rewarded offers and the high paying placements; a player who has finished several rewarded ads gets offers when a high paying ad is loaded; low value players are steered toward the purchase that removes ads.
- Moves: ad revenue per daily user.
- Shippable: personalised ads only with the consent state the request reads, and no tracking identifier on iOS without the system permission; device model and country need neither.
- Departs from: none.

**Offer bandit.** Every offer with several variants, and an algorithm moving traffic toward the one that works.
- Build: variants as arms (the length of a revive countdown, the size of a reward, the discount, the hour of a reminder), success measured per show (a revive taken, an offer accepted), allocation by a multi-armed bandit, and a small fixed holdout that never sees the offer so its total effect can be measured.
- Moves: whatever the offer is for, and how fast the best variant is found.
- Shippable: every arm is one this file would ship on its own.
- Departs from: none.

**Remote rule set.** Each pattern a named rule the server turns on, targets and tests without a release.
- Build: one module per pattern with a stable name, a remote config entry per rule holding its switch, its parameters and its targeting (country, device, segment, return probability, days since install), assignment to experiments by the same system, and every analytics event tagged with the rules active when it fired.
- Moves: the speed of every experiment above.
- Shippable: the default with no config fetched is the safe one, and the screen is correct before any value arrives.
- Departs from: none.

**Named placements.** Every moment that can sell has a stable name, and the server decides what appears there.
- Build: one id per moment (end of onboarding, a locked feature tapped, a limit reached, a result screen, a link opened, a lapsed subscriber returning), one paywall component that takes its products, copy and layout from the remote rule set for that id, an experiment per placement with its own holdout, and the placement and variant attached to every purchase event the store confirms.
- Moves: the speed of every paywall test, and knowing which moment earns.
- Shippable: a placement with no config shows the default paywall or nothing, never an empty frame, and the variant does not change while it is on screen.
- Departs from: none.

**Acquisition-matched paywall.** The paywall shown to someone matches the campaign that brought them.
- Build: the install source read once at first launch and stored, and a placement variant per source, so the promise in the ad is the first thing the paywall repeats.
- Moves: day zero conversion from paid installs.
- Shippable: the attribution data is declared in the store privacy answers, and on iOS anything linked to other companies' data waits for the tracking permission (`perm-tracking`).
- Departs from: none.

### Paywalls and subscriptions

**Paywall at peak intent.** The paywall right after onboarding, before the first use of the product, when interest is highest.
- Build: the paywall as the last onboarding step, with the free path as a secondary action rather than the default.
- Moves: trial starts and day zero conversion.
- Shippable: what the subscription buys is described on that screen; a restore entry is on it.
- Departs from: `onboard-look-first`, `onboard-defer`.

**Annual first.** The yearly plan selected on load, with its saving against monthly as the headline.
- Build: annual preselected and visually dominant, a "save N%" badge computed from the two real store prices, the per week or per month equivalent as secondary text under it.
- Moves: annual share and cash up front.
- Shippable: the amount actually billed and its period are the largest price on the screen (`sub-billed-first`), and the button says the price; the saving names the monthly plan it is measured against and is derived from the store prices (`sub-discount`).
- Departs from: `button-ladder`.

**Weekly anchor.** A short plan as the default, with the long plan sold as the saving against it.
- Build: a weekly or monthly plan preselected, the annual beside it with its saving measured against the short plan paid for a year, and the per week equivalent of the annual under its billed price.
- Moves: revenue per paying user, from people who keep the short plan, and annual share, from people the saving persuades.
- Shippable: the comparison plan is on the same screen and named in the badge, and every option leads with its billed amount (`sub-discount`, `sub-billed-first`).
- Departs from: none.

**Lifetime option.** A one time purchase priced near the annual plan, beside the subscriptions.
- Build: a non consumable product as a third option, labelled as paid once, restorable like the subscription.
- Moves: conversion of people who refuse subscriptions, and cash up front.
- Shippable: restore covers it (`sub-restore`), and the product is a store product, never a long subscription called lifetime.
- Departs from: none.

**Trial toggle.** A switch that turns the free trial on, on by default, so the trial reads as the obvious choice.
- Build: the toggle above the button, the button label changing with it ("Start free trial" against "Subscribe").
- Moves: trial starts.
- Shippable: when the trial ends, the price that follows and the date are written next to the button, and the label and that line change with the switch (`sub-trial-end`).
- Departs from: none.

**Trial timeline.** The trial drawn as three dated steps: today, the reminder, the charge.
- Build: a short vertical timeline above the button with the unlock today, the reminder two days before the end, and the charge with its date and amount, plus a reminder switch beside it that is on.
- Moves: trial starts from people afraid of forgetting to cancel.
- Shippable: the dates come from the trial length the store returns, and the reminder is real, scheduled on the server from the store's renewal data and sent through a channel the person allowed (`sub-trial-end`).
- Departs from: none.

**Trial or pay now.** The choice framed as two ways in: a free trial, or a short paid period.
- Build: two options of equal shape, a free trial that converts to the annual plan, and a first month at a low introductory price, or a free week against a longer paid trial.
- Moves: conversion of people who distrust a trial that converts by itself.
- Shippable: each option says on itself what it becomes after its first period and at what price.
- Departs from: none.

**Reverse trial.** The paid tier given without a card for a set number of days, then taken back.
- Build: premium unlocked on sign up, a visible end date from day one, a reminder before the end listing what the person used, and a paywall on the day it ends naming what goes back to the free tier.
- Moves: conversion at the end of the period, from people who have already used the paid features.
- Shippable: nothing is charged without a purchase the person makes, and work made with paid features stays readable after the downgrade.
- Departs from: none.

**Quota wall.** The paywall at the moment a free allowance runs out: minutes, credits, actions per day.
- Build: the allowance shown as a meter wherever it is spent, the paywall as the placement when it reaches zero, and the time it refills stated on the paywall beside the offer.
- Moves: conversion at the moment of highest need.
- Shippable: the remaining allowance and its refill time are visible before it runs out (`econ-gate`, `econ-balances`), and waiting for the refill is offered as the free path.
- Departs from: none.

**Value pages before the offer.** Two or three pages of benefit and a question or two before the prices.
- Build: a short paged sequence, a goal or use the person picks that changes the headline of the offer page, and the prices on the last page.
- Moves: conversion, from an offer that repeats what the person just said they want.
- Shippable: every page has the exit that `sub-exit` requires, and the pages are not counted as onboarding progress (`sub-honest`).
- Departs from: none.

**Quiet close.** The close control present but not competing with the offer.
- Build: a small close in the top corner, in the secondary text colour, with the offer occupying the screen.
- Moves: paywall dwell time and conversion.
- Shippable: visible from the first frame, at least 3:1 against the rendered background behind it, and a full size target (`sub-exit`). A close that appears late or that the eye cannot find is the version that gets apps removed.
- Departs from: `button-ladder`.

**Exit offer.** Closing the paywall raises one different offer.
- Build: on close, a sheet with a restructured offer, a longer trial, the monthly plan or a discount, shown once per decision and remembered so the next close leaves straight away.
- Moves: conversion from people already leaving.
- Shippable: one offer at most, and its own close leaves for good (`sub-exit`).
- Departs from: none.

**Abandoned purchase.** An offer after the person cancels the system purchase sheet.
- Build: the cancelled result the store returns, read as its own outcome rather than an error, and one offer on it: a discount, a different plan or a single question about what stopped them.
- Moves: recovery of purchases that were nearly made.
- Shippable: no failure message for a cancel, one offer at most, and the paywall underneath unchanged (`sub-exit`).
- Departs from: none.

**Decline survey.** One question when someone declines, asking why.
- Build: a single choice with four reasons and an other, shown after a close or a cancelled sheet, answers stored per placement and variant.
- Moves: the next experiment, from the reasons people give.
- Shippable: skippable in one tap, never blocking the way out, and never shown on the same decision as the exit offer.
- Departs from: none.

**Post-purchase upsell.** A second offer right after a purchase succeeds.
- Build: after the success state, one offer for an upgrade, an add-on or a bundle, with the success itself shown first.
- Moves: average revenue per buyer.
- Shippable: the purchase just made is confirmed and usable before the offer appears, the offer is one screen, and declining lands in the product.
- Departs from: none.

**Decoy plan.** A third plan priced to make the target plan look like the obvious deal.
- Build: three tiles, the decoy close in price to the target with clearly less in it, the target marked as most popular only if it is.
- Moves: average order value.
- Departs from: none.

**Member price framing.** The price the person would pay without the membership, shown beside what they pay with it.
- Build: the member price beside the regular one on every price the person sees (item cards, the basket, the checkout), member only coupons shown in the coupon wallet as locked with a join button on them, "with the membership this order would have cost X" on the tracking screen of a non member's order, and for members a running total of what the membership saved this month.
- Moves: membership sign ups and their retention.
- Shippable: both figures computed from the same basket, with every fee the member still pays included in the member figure.
- Departs from: none.

**Personalised offer.** A discount shown to the people most likely to leave or most likely to convert with a nudge.
- Build: a churn score, or a purchase propensity score trained like return probability on whether the person bought in the following week, and a discount offer triggered for the segment it selects, at a moment the person is already in the app.
- Moves: conversion of hesitant users and win back.
- Shippable: it is a discount from the public price, never a higher price for someone; in the EU and in New York a price set from personal data says so.
- Departs from: none.

**Save offer.** An offer between "manage subscription" and the system cancel page.
- Build: one screen with a discount or a pause option, and the cancel action on the same screen, which hands off to the system's subscription manager. Where cancelling happens in the store and not in the app, the store's server notification that auto renew was switched off, during a trial or after, queues the same single screen for the next time the app opens.
- Moves: cancellations turned into discounts or pauses.
- Shippable: at most one offer screen, cancel reachable on it, and the subscription row findable in settings.
- Departs from: none, when built this way under `sub-cancel`.

**Win back.** An offer to people whose subscription lapsed.
- Build: a push, an email and an in-app banner after expiry with an introductory price for returning, each carrying a link that opens the paywall placement directly (`nav-deeplink`), and a one tap path back to the paywall.
- Moves: reactivation.
- Shippable: the push goes only to people who allowed promotional notifications.
- Departs from: `notify-earns-it`.

### Urgency and scarcity, from real numbers

**Expiring personal offer.** An offer that really ends.
- Build: the end time created on the server the first time the offer is shown, a countdown drawn from that timestamp, and the offer withdrawn when it passes.
- Moves: conversion speed.
- Shippable: the deadline survives relaunch and reinstall, and after it passes the offer is gone. A countdown that resets is a fake one (`sub-honest`).
- Departs from: none.

**Live scarcity and live crowd.** "3 left", "128 people bought this today", "trending near you".
- Build: counts read from inventory, orders or presence, scoped to what they count, refreshed while the screen is open.
- Moves: conversion on product and checkout screens.
- Shippable: the number comes from the system that knows it.
- Departs from: none.

### Reputation

**Review at the high point.** The system review prompt timed to the moment the person is happiest.
- Build: one of two moments. After a success the product can detect (a level cleared, an order delivered on time, a goal reached), or during anticipation, while the person waits for something they want and nothing has gone wrong yet (an order on its way, a match being found, a download nearly done). Only after several sessions, and never after an error.
- Moves: store rating and ranking.
- Shippable: the system prompt is called unconditionally at that moment, with no question asked before it, plus a feedback entry that is always available elsewhere.
- Departs from: `fb-review-prompt` for the anticipation moment, which is during a task rather than after it.

**Social proof inside the app.** The store rating, real reviews and friends' activity shown where decisions are made.
- Build: the live store rating on the paywall, recent real reviews, "N of your contacts use this" with consent.
- Moves: conversion and trust.
- Shippable: every figure is read from its source at display time, and a ranking names who ranked it (`copy-claims`).
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

**Weekly league.** A small group of players ranked by activity for one week, with promotion and relegation.
- Build: groups of about thirty people with similar activity, points from the product's core action, the top places promoted to the next league and the bottom places relegated, the week's end held on the server, and notifications when someone overtakes the person or the week is about to close.
- Moves: weekly actives and actions per active user.
- Shippable: every name in the group is a real person or is labelled as a computer player, and the notifications are opt in.
- Departs from: `notify-earns-it`.

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

**Boost, then pressure at the ad.** The run is carried close to the player's record, and the pressure arrives when a rewarded ad is ready.
- Build: the sequence generator reads the player's record, the current score, and whether a rewarded ad is loaded and how much it pays; below the record it gives pieces that clear lines and build combos, and once the score nears the record with a valuable ad ready it gives a sequence that is hard to place, so the loss lands where the revive offer is worth the most. Each threshold is a parameter of the remote rule set and tuned by the offer bandit.
- Moves: rewarded ad views per session and ad revenue per daily user.
- Shippable: the same lines as difficulty that adapts, plus the revive offer as built under revive for an ad.
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
- Build: pack sizes with a bonus on the larger ones, a starter pack worth more than any regular pack offered once to new players, items priced in currency.
- Moves: average purchase and repeat purchase.
- Shippable: bonuses computed from the smallest pack's rate and rising with size (`econ-pack-value`), the starter pack gone once bought (`econ-bundle`), and in apps for children the real money price next to the currency price.
- Departs from: none.

**Currency by subscription.** Currency or credits delivered every period for as long as the subscription runs.
- Build: an amount credited on each renewal, a smaller daily amount for opening the app while subscribed, and the balance shown with the date of the next credit.
- Moves: recurring revenue from players who would buy packs now and then.
- Shippable: the amount is the same every period rather than a large first credit and little after, since Play sells a one time benefit as an in-app product and not a subscription, and whether credits outlive the subscription is stated at purchase (`econ-balances`).
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
- Shippable: the offer says what stays, such as rewarded videos the player chooses to watch, and the entitlement then removes everything else everywhere (`ads-entitlement`).
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
| A struck price worked out backwards from the discount, a saving against a plan the screen does not show, a trial price drawn where the plan price goes | Weekly anchor, annual first, trial toggle |
| "People who joined today" from a constant, a rating nobody gave, a "number one" nobody ranked | Social proof inside the app |
| A reminder switch that cannot remind, a close that opens a chain of offers | Trial timeline, exit offer |
| Removing ads while some still show, unannounced | Remove ads as a product, with what stays named |
| The result of a round, a test or a quiz the person finished, held back until they pay | The offer after the result, under `game-result` |

## 4. Hand-back

One row per pattern built:

| Pattern | Screen | Metric | Event | Flag | Exceptions written to STACK.md |
|---|---|---|---|---|---|

Under it, one line on how to read the result: the metric, the comparison group the flag makes possible, and the date it can be judged.
