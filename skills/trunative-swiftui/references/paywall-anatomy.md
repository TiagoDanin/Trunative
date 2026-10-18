# Paywall anatomy

Lookup for any screen that sells: a paywall, an upgrade sheet at a limit, a currency shop, a checkout summary. Read it when `flow/explore.md` is writing candidates for one of those screens, and again in build for the parts and the states. The rules these parts answer to are `sub-`, `pay-` and `econ-`; nothing here overrides them, and nothing here is a template. The compositions are prompts in the sense `references/wireframe-frame.md` uses the word, and a candidate that needs none of them still gets drawn.

Sections, in order: Compositions, Parts, States, Platform, Shops.

## Compositions

Each is named so a brief and a wireframe can refer to it. What it suits, and the rule it most often breaks when built carelessly.

- **media-dock.** A full-bleed ground of the product at work, a looping clip, a wall of real outputs, the person's own content, with the choice and the action docked in a panel along the bottom. Suits a product whose value is visible in a second. Breaks `sub-exit` first, because the exit sits over the brightest part of the ground; a scrim under the top corners is part of the composition, not a fix added later.
- **compare-columns.** Rows of capability against two or three columns, free and paid, with the paid column carried as one continuous emphasised band and the action under it. Suits an upgrade where the free tier is real and the difference is the point. Breaks `color-not-alone` when the only difference between a check and a lock is colour, and `layout-fold` when the action falls below a long table.
- **statement-offer.** One sentence carrying the offer and its terms, large, in the middle of an otherwise empty screen, a single action low. Suits a single plan with a trial. Breaks `sub-billed-first` when the sentence leads with the equivalent rather than the billed amount, and is the composition where that order is easiest to get right.
- **timeline-offer.** The trial as three dated stops on a line, unlock today, reminder, charge, with the action directly under the last stop. Suits trial-led offers to people wary of forgetting. It is the `timeline` shape, and it breaks `sub-trial-end` when the dates are typed rather than computed.
- **plan-rail.** Plans as equal tiles in a row that scrolls sideways, the next tile cut by the edge so the row reads as more than one screen wide. Suits several durations or tiers. Breaks `sub-billed-first` when each tile normalises to a different unit, and `a11y-collection` when the tiles are not announced as one group with a count.
- **plan-rows.** Plans as full-width rows, one under another, each with its radio, name, billed amount and badge. Suits two or three options where the labels are long or translated. The quietest way to meet `sub-plan-choice`.
- **value-pages.** Two or three pages of benefit or a question about the person's goal, then the prices on the last page. Suits an offer that needs explaining or a headline that should repeat the goal the person picked. Breaks `sub-exit` when the exit lives only on the last page.
- **limit-sheet.** A sheet raised over the feature the person just hit the limit in, the feature still visible behind it, the meter at zero and its refill time beside the offer. Suits a quota or a locked tool. It is `nav-sheet` with `econ-gate`, and it keeps the free path, waiting, on the sheet.
- **split-offer.** For a landscape app: the plans or tiers as a list on one side and the selected one in detail, with its action, on the other. Suits games and anything held sideways. It exists because a portrait paywall rotated into landscape loses its exit and its action past the edges (`layout-orientation`).
- **pack-shelf.** A currency or credits shop: the balance at the top, packs as rows or a two-column grid in ascending order, each pack's price as its own button. Suits any store of consumables. See Shops below.
- **summary-dock.** A checkout whose items, fees and choices scroll above a docked bar holding the total and the commit action. Suits physical goods and services. The total in the dock is `pay-total`, and the optional lines above it start at none.

## Parts

In the order a person reads them on most selling screens. A screen leaves out what it does not need; what it keeps has these properties.

- **Exit.** In the top corner the platform uses for dismissal, or as a text decline under the action. Visible in the first frame, sized to `touch-floor`, contrasted against the rendered ground (`sub-exit`). A scrim, a tinted circle behind the mark or a solid bar under the status area are the usual ways to keep it legible over media. Restore goes elsewhere.
- **Hero.** Proof that the product does the thing: a real result, the person's own content, a short silent loop of the feature in use. A clip loops only while visible, starts muted (`media-unasked-sound`), stops for reduced motion (`motion-reduced`) and has a poster frame so the first frame is never blank (`icon-reserve`). Abstract art says nothing the headline does not.
- **Headline.** The outcome for the person, in their terms, in one line or two (`copy-budget`). It may repeat the goal they chose earlier in onboarding.
- **Benefits.** Three to five lines, strongest first, each a concrete capability with its quantity where it has one (`copy-claims`), a glyph from the app's own set (`icon-one-set`). A list that needs a sixth line is a compare-columns screen.
- **Proof.** A rating, a review, a count, only when sourced under `copy-claims`. Placed near the decision rather than at the top, where it competes with the headline.
- **Plan option.** Content in this order: the plan's name, the billed amount with its period as the largest figure, the equivalent below it in a smaller size, the trial or intro terms where they apply. A badge ("most chosen", "save 40% against monthly") sits on the option's top edge, outside the text flow, and says what it measures. Selection is shown by a border and a mark, not by fill colour alone, and the group is announced as one choice (`sub-plan-choice`).
- **Trial controls.** A switch row that turns the trial on and off, a reminder row under it, or a timeline. Each changes the billing line and the button label when it changes (`sub-trial-end`). A reminder row appears only when the reminder can be sent.
- **Offer dock.** Pinned above the bottom inset (`layout-chrome`), holding, top to bottom: the billing line for the selected option ("7 days free, then 49.99 a year, from 12 March"), the action with a label naming what happens (`button-label`), a reassurance line only when it is true ("Nothing is charged today" holds during a trial and not otherwise), and one row of small links: Terms, Privacy, Restore, Redeem a code. The billing line is body size, not legal size.
- **Decline.** Where the screen offers a free path, a text action under the dock that names it ("Continue with the free plan"), same weight as the link row or more.

## States

Every selling screen has these, and each is drawn in the wireframe as its own frame when it changes the structure (`state-set`).

- **Products loading.** The plan options keep their size with an empty price box; no placeholder amount, no zero (`pay-price-source`, `state-loading`). The exit works from the first frame regardless.
- **Products failed.** One line saying the prices could not be loaded, a retry, the exit. A product the store did not return is absent, not drawn disabled.
- **Not eligible for the trial.** Someone who already used an introductory offer sees the plan without it: the trial switch, the timeline and "free" disappear, and the billing line and button switch to paying now. Eligibility is the store's answer for this user, never assumed.
- **Already subscribed.** The current plan, its renewal date, the way to change plan, and the route to manage or cancel (`sub-cancel`). Never a purchase screen for what the person already has (`econ-bundle` is the same idea for packs).
- **Purchase pending.** A purchase waiting for a parent's approval or a delayed payment method is pending, says so, and unlocks when the store confirms (`pay-outcome`).
- **Success.** The unlock confirmed in place, what is now available, and the person returned to what they were doing when the offer appeared, not to a home screen.
- **Restore results.** Restored, nothing to restore, or failed with a reason (`sub-restore`).
- **Offline.** The screen says the store cannot be reached; the exit and the free path still work (`state-offline`).

## Platform

StoreKit ships a paywall: `SubscriptionStoreView` for a subscription group and `StoreView` for other products, drawing localised prices, trial terms, purchase and restore from the store itself. Start there, show restore with `.storeButton(.visible, for: .restorePurchases)`, and put the app's own hero and benefits in its marketing content; build a custom screen only when a composition above cannot be expressed with it. Trial eligibility is `isEligibleForIntroOffer` on the product's subscription info.

## Shops

A store of consumables, coins, credits, lives, has its own parts.

- **Balance header.** Every balance the shop sells or spends, with the bought and the earned shown separately where both exist, and the date any of them expires (`econ-balances`).
- **Pack list.** Ascending by amount, each row the currency icon and amount, any bonus as a figure, and the store price on the buy control (`econ-pack-value`, `econ-real-money`). A two-column grid when packs are many and short, rows when the amounts or bonuses need words.
- **Value marks.** "Best value" on the pack with the lowest price per unit, computed; "most popular" only from sales.
- **First-purchase pack.** Shown once, above the list, with its contents itemised (`econ-contents`), and gone after it is bought (`econ-bundle`).
- **Subscriptions in a shop.** A membership or a currency subscription sits in its own section, labelled as renewing, with its billing line, apart from one-off packs (`sub-terms`).
- **Limits.** A purchase limit the app enforces is shown with what remains of it, before the person reaches it (`shop-quantity` treats the same for goods).
- **Entry from a shortfall.** Opened from an unaffordable item, the shop scrolls to the smallest pack that covers the shortfall and says what will be left (`econ-afford`).
