# Commerce

Catalogues, product pages and carts for anything physical or consumed outside the app: food, groceries, retail, tickets, rentals. The person is comparing things on a narrow screen, one item at a time, usually in short sessions that get interrupted, and what they put together over those sessions is work. Every rule here is about the item meaning what it says, and the basket still being there.

A deadline on an offer, a flash sale's countdown, a price that ends at a time, a stock count shown as urgency, follows `sub-honest` and `shop-stock` whatever is being sold: the deadline is real and stated as a time, and the count is read rather than invented.

Paying is `heuristics/payments.md`: the rail, the total at the moment of commitment (`pay-total`), the four outcomes of a charge (`pay-outcome`). Where a price for store-billed goods comes from is `pay-price-source`. Counts the app spends on the person's behalf that are not money are the `econ-` prefix, and fields and choice groups are the `form-` prefix. Taking something back after a removal is `fb-undo`, and what the first screenful has to show is `layout-fold`.

## <Rule id="shop-price-unit" severity="p1" description="A price sits with the quantity it buys, and a reduction is measured against a price that was charged" />

A number on its own is not a price. Two bottles of oil at different prices are only comparable once each says how much oil it is.

- The quantity the price buys is printed beside it, in the same line or the line under it: the pack size, the weight, the volume, the count, the duration of a booking. A tile showing a price and a photograph leaves the person to guess from the photograph.
- Where a list puts items side by side for comparison, each one also shows a unit price in one unit for the whole list, per kilogram or per litre or per item, converted once at the edge (`data-units`). Mixing per 100 g on one row and per kg on the next is the same as showing no unit price.
- A struck-through reference is a price this seller charged for this item before the reduction, for a period someone could have paid it. A reference nobody paid turns the saving into a claim the screen cannot back, and the percentage badge beside it inherits the same problem.
- A price that depends on a choice not yet made, a size, a slot, a delivery distance, says "from" and the lowest amount, and becomes the exact amount the moment the choice is made.

## <Rule id="shop-variant" description="Variants are visible choices, and the one that cannot be had says why" />

Size, colour, flavour, pack and date are choices the person makes on the product page, and they follow `form-choice`: the group says how many it takes, and the current pick is legible without colour (`color-not-alone`).

- Every variant is shown, including the ones that cannot be bought right now. An unavailable one stays in its place, drawn as unavailable with a word, and the reason sits with it or on tap: sold out, not sold in this area, back on a date. Hiding it makes the person wonder whether it exists; greying it with no word makes them tap it repeatedly.
- The page follows the selection. The photograph, the price, the quantity line from `shop-price-unit` and the stock state all change to the chosen variant, and nothing on the page still describes the one before it.
- A variant chosen on the list carries into the page, and back again. Opening an item in a size and landing on its default is a choice the person has to make twice.

## <Rule id="shop-stock" severity="p1" description="Stock is a state with words, and it is checked again before the person commits" />

Availability changes while somebody is deciding, and it changes most for the items people want.

- Four states, each with its own sentence rather than a colour: available, running low with the number where the number is real, unavailable, and expected back on a date. A count of remaining items is shown only when it is read from stock, never typed to create pressure.
- An unavailable item stays reachable. Its page offers the nearest alternative, or a way to be told when it returns, and that notice is something the person asked for (`notify-earns-it`).
- Stock is re-read before the order is committed. An item that ran out in the meantime is named on the screen where the person commits, with what was done about it, rather than discovered on the receipt.
- A price that changed since the item was added is treated the same way: the item, the old price and the new one, before the commitment.

## <Rule id="shop-add" evidence="device" description="Adding answers on the item, and the person stays where they were" />

Adding to the cart is the most repeated action in a catalogue, and the person is usually mid list when they do it.

- The confirmation is the item itself changing: the add control becomes a quantity control showing one, which is `fb-silent-success`. A toast that says "Added" over a list that already shows the count is noise, and a jump to the cart after every add throws away the place in the list.
- The cart's count and running total are visible on every screen of the catalogue, in a bar or on the cart entry, and they change at the same moment the item does.
- An add control drawn on top of a product tile is its own target with its own floor, apart from the tile that opens the page (`touch-nested`). A tap meant for the plus that opens the product, or the reverse, is the failure.
- The change is announced to the screen reader in one short phrase naming the item and the new count (`a11y-announce`).
- An add that needs a choice first, a size or a required option, opens the choice rather than adding a default the person did not pick.

## <Rule id="shop-quantity" description="A quantity control states its bounds, and the step below the minimum is a removal that can be undone" />

- The control shows the current number between its two buttons, and both buttons meet the touch floor even when the drawing is small.
- The maximum is stated when it is reached: a purchase limit, the stock left, a household limit. A plus that silently stops working at nine reads as broken.
- At the minimum, the minus changes into a remove control, drawn as removal, and the removal is undoable for a real window (`fb-undo`). A minus that deletes a line the person spent time configuring, with no way back, is the case this rule exists for.
- A quantity that is often large, cases of water, sheets of paper, guests at an event, can also be typed, through a numeric field configured under `form-input`.
- Changing the quantity updates the line total and the cart total in place, at the same width, so nothing moves under the finger.

## <Rule id="shop-cart-life" severity="p0" evidence="device" description="The cart outlives the process, the session and signing in" />

A cart is often filled across several sittings. Losing it is losing the person's work, and they rarely rebuild it.

- The cart is stored as soon as it changes, not when the app goes to the background, and it comes back after the process is killed (`form-persist`, `state-interrupt`).
- Signing in merges the cart built while signed out into the account's cart, and says so when both held items. Replacing one with the other silently loses half the work.
- On return, anything that changed since the item was added, a price, availability, a variant withdrawn, is named at the top of the cart with the item it concerns, not discovered at checkout.
- A cart with a natural expiry, a held ticket, a reserved slot, shows the time it is held until as a time, and what happens when it lapses (`data-time-relative`).

## <Rule id="shop-cart-scope" severity="p1" description="A cart bound to one store, date or address says so, and nothing replaces it without warning" />

Many carts are only valid inside one scope: one shop, one delivery slot, one cinema showing, one destination. That scope is what `nav-scope` puts at the top of the screen, and the cart has to carry it too.

- The cart shows what it is bound to, in words, on the cart and on the bar that summarises it.
- Adding an item from outside that scope does not clear the cart quietly. The screen states the consequence first, names what would be lost, and offers keeping the current cart as the default answer.
- Changing the scope itself, the address or the slot, re-checks every line against the new one, and names the lines that no longer apply instead of dropping them.

## <Rule id="shop-upsell" evidence="device" description="Suggestions inside the cart never push the way to checkout off the screen" />

The cart is where the person has already decided. Anything added to it is competing with the one action the screen exists for.

- The checkout action is pinned above the bottom inset and visible at rest, whatever the suggestions above it hold (`layout-fold`, `layout-chrome`).
- Suggestions sit below the lines the person chose, never between the lines and the total, and they are a secondary emphasis: there is one primary on the screen, and it is checkout (`button-one-primary`).
- A suggested item added from the cart follows `shop-add`, in place, without opening a new page.
- Something added by default, a bag fee, a tip, an extended warranty, insurance, is a line the person can see and remove, and anything that costs money starts off.

## <Rule id="shop-substitute" severity="p1" description="What happens to a missing item is the person's choice, made before ordering, and reported line by line" />

Some orders are assembled by someone else after they are placed: a grocery picker, a kitchen, a warehouse. Between the order and the delivery, items run out.

- Before the order is committed, the person chooses what happens to each item that might be missing: replace it with something similar, ask first, or leave it out and refund it. A default applies to the whole order, and any line can override it.
- When an item is replaced, the person sees the replacement, its price and the reason, and has a way to refuse it while the order can still change.
- After the order, what arrived is reported item by item: delivered as ordered, replaced with what, missing and refunded. A total that simply came out lower leaves the person to work out which line went.

## <Rule id="shop-reorder" description="Ordering again shows what changed before it fills the cart" />

Repeating a past order is the shortest path in a catalogue, and the one most likely to bring back something that no longer exists.

- Before the cart is filled, the screen lists what is different from last time: items no longer sold, items now unavailable, prices that moved, options that were withdrawn.
- The items that can still be had go into the cart, the ones that cannot are named rather than dropped, and the nearest alternative is offered where one exists.
- A reorder into a cart that already holds items adds to it, or asks, under `shop-cart-scope`. It never replaces what is there.

<Check>

<Verify rule="shop-price-unit">Every price shows the quantity it buys, comparable items share a unit price in one unit, a price that depends on an open choice says "from", and every struck-through reference is a price this seller actually charged.</Verify>
<Verify rule="shop-variant">Every variant is shown, an unavailable one is labelled with its reason rather than hidden or greyed alone, and photo, price, quantity and stock all follow the chosen variant, carried between list and page.</Verify>
<Verify rule="shop-stock">Available, low, unavailable and back on a date each have words, a remaining count appears only when read from stock, an unavailable item offers an alternative or a notice, and stock and price are re-read with any change named before the person commits.</Verify>
<Verify rule="shop-add">Adding turns the add control into a quantity control on the item, the cart count and total update on the same frame, no navigation or redundant toast follows, the add target is separate from the tile, the change is announced, and an item needing a choice opens the choice.</Verify>
<Verify rule="shop-quantity">The quantity control shows its value, meets the touch floor on both buttons, states its maximum when reached, turns the minus into an undoable remove at the minimum, offers typed entry where large quantities are common, and updates totals without resizing.</Verify>
<Verify rule="shop-cart-life">The cart is stored on every change and survives process death, a sign in merges rather than replaces it, changes since adding are named on return, and a held cart shows when the hold ends.</Verify>
<Verify rule="shop-cart-scope">A scoped cart names its scope, adding from outside it states the loss and defaults to keeping the cart, and changing the scope names the lines that stop applying.</Verify>
<Verify rule="shop-upsell">Checkout stays pinned and visible at rest, suggestions sit below the chosen lines at secondary emphasis, adding from them happens in place, and every default line is visible, removable and off when it costs money.</Verify>
<Verify rule="shop-substitute">Where items can go missing after ordering, the substitution preference is set before commitment with a per line override, replacements show item, price and reason and can be refused, and the outcome is reported per line.</Verify>
<Verify rule="shop-reorder">A reorder lists what changed since the last order before filling the cart, names what cannot be had with an alternative where one exists, and never replaces an existing cart.</Verify>

<Device>`shop-add` is answered with the screen reader on and with a thumb on a narrow device: the add target has to be hit without opening the tile, and the announcement has to name the item. `shop-cart-life` needs the process killed with items in the cart, and a sign in performed with a cart already built while signed out. `shop-upsell` is a rendered cart at the narrow end with a long suggestion block, where the checkout action has to be visible without scrolling.</Device>

</Check>
