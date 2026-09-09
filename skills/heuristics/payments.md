# Payments

Taking money on a phone is the one design problem where a wrong decision is not a bad experience but a rejected build. Two store policies decide which payment rail is even legal for a given item, and they decide it by what is being sold rather than by what the team would prefer to integrate.

Everything after that is a form on a small screen, held by someone who is about to hand over money and is looking for a reason not to.

## `pay-rail` What is being sold decides the rail, and it is not a preference

Answer this before drawing anything, because it determines the whole screen.

- Digital content or functionality consumed inside the app, which includes subscriptions, in-game currency, levels, premium content and unlocking a full version, goes through the store's own billing. Both stores require it. A licence key, a QR code or a redeemed voucher used to unlock the same thing is the same violation wearing a costume.
- Physical goods, and services consumed outside the app such as transport, delivery, cleaning, tickets to a live event or a gym membership, must NOT use store billing. These take a normal processor, a wallet or a card.
- Real-time services between two individuals, such as tutoring or a consultation, may use another method. One-to-many does not.

Getting it backwards is a rejection in both directions: store billing on a taxi ride is as wrong as a card form on a game level. When the app sells both kinds, it carries both rails and picks per item rather than per screen.

## `pay-steering` A link to your own checkout is a storefront question, not a design choice

On the United States storefront an iOS app may include buttons, external links and calls to action pointing at the developer's own purchase page, with no entitlement. In other storefronts the same link is either gated behind an entitlement or prohibited outright, and Play runs its own enrolment programs for leading users out.

So the link is conditional on the storefront the app is actually running in, decided at runtime. An app that ships one link everywhere passes review in one country and fails in the rest, which is the common way this rule is broken. Record in `STACK.md` which storefronts the build enables it for.

## `pay-wallet-first` The wallet is why paying on a phone is bearable

A saved card in the platform wallet turns a two minute typing session into one authentication. Treat it as the default path, not as one option among several.

- Where wallet credentials exist, the wallet button is the primary payment option, not a peer sitting beside a card form.
- It is not a separate step or a separate flow reached from somewhere else.
- It is no smaller than the other payment buttons and does not require scrolling to find.
- Use the platform's own button API. A redrawn copy of it is both a policy violation and the shape a phishing screen takes.
- Every choice the purchase depends on, such as size, colour, shipping method or pickup location, is settled before the sheet appears, because the sheet is not the place to go back and change one.

## `pay-sheet` The system purchase sheet belongs to the system

The confirmation sheet exists to stop accidental purchases, and the platform is explicit that it must not be modified or replicated. A hand-built screen that looks like it is asking for the store password is the single most dangerous thing in this file.

The app's job is what comes before the sheet and what happens after it. The sheet itself is not styled, not wrapped, not preceded by a lookalike, and not dismissed programmatically.

## `pay-total` The total is visible before the commitment, not after it

State the full amount to be billed for anything on offer, of any type. On a phone the surprise arrives late, because the screen is short and the fee lands at the bottom.

- Shipping, tax and every fee are visible on the screen where the user commits, not one step later.
- Currency, grouping and decimals come from the locale, which is `l10n-format`, and figures in a column align under `type-strings`.
- Rounding never flatters: `data-precision` owns what a displayed number is allowed to imply.
- The price is not smaller than the button next to it, and it does not need a scroll to reach.

## `pay-subscription-terms` A subscription screen has required contents

Before anyone can subscribe, the screen carries the subscription name, the period, what the money buys during each period, and the billing amount localised for the storefront being sold to. Also on that screen, not one level deeper, a way for an existing subscriber to sign in or restore.

- A free trial says plainly that a payment starts automatically when it ends, and when that is.
- An introductory price states the intro amount, how long it lasts, and the standard price that follows.
- Changing an existing app to a subscription does not take away what current users already paid for.

## `pay-cancel` Cancelling is easy or the app is hostile

The platform owns the actual cancellation screen, so the app links to the system page rather than rebuilding it, which is `set-system-owned`. What the app owns is whether that link is findable.

A manage-subscription entry buried several levels down reads as obstruction, and it is called out as such by the platform. It belongs where someone looks for it, next to the account exit that `set-account-exit` places. Cancelling a subscription and deleting an account are different actions with different consequences, and `auth-delete` owns the second.

## `pay-restore` Restore exists, or a paying customer is locked out

A reinstall, a new device, a factory reset and a sign-in from another platform are all normal. Any restorable purchase needs a restore path, and the paywall is one of the places it is reachable from.

Restore is a labelled control, not a hidden gesture, and it reports what happened: restored, nothing to restore, or failed with a reason under `state-error`. A paywall with no restore turns an existing customer into someone being asked to pay twice.

## `pay-card` When a card form is the legal rail, it is still a form on a phone

Typing sixteen digits with a thumb is the most expensive interaction in the app.

- Autofill and card scanning are the primary route, which is `form-autofill`, and the fields carry the right keyboard and content type under `form-input`.
- One column, the number field first, expiry and code side by side only if both stay above the width `layout-column` allows.
- Nothing typed is lost when a payment is declined, which is `form-persist`. Re-entering a card after a failure is where the sale dies.
- Ask for what the network actually needs and nothing else. A billing address collected out of habit is three more fields.

## `pay-handoff` The payment that leaves the app has to come back

Strong authentication, a bank app, a wallet redirect or a browser step takes the user out of the process mid transaction, and the app may be killed while they are gone.

- Treat it as an interruption that must survive, which is `state-interrupt`, with the pending order held where the system can save it.
- The return arrives as a link and is routed under `nav-deeplink`, landing on the outcome rather than on the home screen.
- Design for the user who never comes back. The payment may have succeeded anyway, so the app reconciles on next launch rather than assuming failure.

## `pay-outcome` Pending is a real answer, and a retry must not charge twice

A payment has four outcomes, not two: succeeded, failed, still pending, and reversed later by a refund or a chargeback. Each gets a state under `state-set`.

- A result the app does not yet know is shown as pending with what happens next, never as success and never as a spinner without an end, which `net-timeout` bounds.
- Every attempt carries an idempotency key so a retry, a double tap or a reconnect cannot bill twice. This is the payment case of `net-dedupe`, and here the cost of getting it wrong is money.
- A receipt is reachable after the fact, from inside the app, without searching an inbox.

## `pay-honest-paywall` The paywall is where scam patterns get apps removed

Tricking someone into a subscription is grounds for removal from the store, and the patterns are well known enough to be worth naming.

- The close control is visible, reachable and meets `touch-floor`. A paywall that has to be escaped by a system gesture is the pattern the rule exists for.
- Terms are legible at the size everything else is, not in the smallest type on the screen.
- The selected plan is the one the user picked, not a pre-selected annual with the monthly option one tap away in grey.
- No invented urgency: a countdown that resets on relaunch is a lie the screen tells.
- What the user gets is described before the price is asked for, and `onboard-look-first` already rules that people may see the product first.
- Purchases involving children carry the same restraint `ads-children` demands.

## Check

Review answers each of these against the code, pointing at the line:

- Each purchasable item is on the rail its type requires, store billing for digital goods consumed in the app and an outside processor for physical goods and outside services, with both present where the app sells both. `pay-rail`
- Any link to an external purchase page is conditional on the storefront at runtime, and the enabled storefronts are recorded. `pay-steering`
- The wallet button is the primary payment option where credentials exist, drawn by the platform API, no smaller than the alternatives and visible without scrolling, with all purchase options settled before the sheet. `pay-wallet-first`
- No screen imitates, wraps or precedes the system purchase sheet with a lookalike. `pay-sheet`
- The full billed amount, including shipping, tax and fees, is on the screen where the user commits, formatted for the locale. `pay-total`
- The subscription screen carries name, period, what is included, the localised price, restore or sign-in, and the automatic charge at the end of any trial. `pay-subscription-terms`
- A link to the system cancellation page is reachable from the account area rather than buried. `pay-cancel`
- A labelled restore control exists, is reachable from the paywall, and reports its result. `pay-restore`
- Card fields use autofill and the right keyboards, sit in one column, and survive a declined payment with the input intact. `pay-card`
- A payment that leaves the app holds its pending order across the trip, routes the return to the outcome, and reconciles on next launch when the user does not return. `pay-handoff`
- Pending is a rendered state, and every attempt carries an idempotency key so no retry can bill twice. `pay-outcome`
- The paywall has a visible close control meeting the touch floor, legible terms, no pre-selected plan the user did not choose, and no countdown that resets. `pay-honest-paywall`

`pay-rail` and `pay-steering` are answered against the store policy that applies to the item and the storefront, not against taste. When the two rails disagree with a product decision, the policy wins and the product decision changes.
