# Design grammars

The spatial relations a composition is made of. `flow/explore.md` sends a candidate here while it is being written, to choose how the parts relate before choosing which components they are.

A component list answers "what is on the screen". A grammar answers "what is next to what, what is over what, and what stays while the rest moves". Two screens with the same components and different grammars are different screens, and two screens with different components and the same grammar are usually the same one.

The shape list in `references/wireframe-frame.md` names whole compositions. These are the relations underneath them, and a composition normally combines two or three. Neither list is closed: a relation the screen needs and this file lacks still gets used, and named.

## Flow

```text
A
B
C
```

Parts follow one another and the order is the message: steps, a story, a feed. It is what a screen becomes when no other relation was chosen, so it owes a reason when it is the whole composition. Right when the order truly carries meaning. Wrong when the parts are peers, or when one of them matters more than the rest, because a sequence gives every part the same weight.

## Focus

```text
      A
  b   b   b
      c
```

One part dominates and the rest are visibly subordinate to it, by size and by the space left around it. Right when the job has a single answer: a balance, a next departure, a remaining time. The dominant part is sized to what it needs to be read from the distance the context implies, not to a habitual fraction of the height.

## Anchor

```text
content
content
content
           [action]
```

One part is fixed to the viewport while the rest moves under it. Right when the action applies to the whole screen and has to be reachable at any scroll position. What it costs is in `layout-chrome`: the anchored part covers content, and the end of the scroll has to clear it.

## Object and action

```text
[ object ]
[ what can be done to it ]
```

The action sits with the thing it changes, not at the edge of the screen. Right when a screen holds several objects with their own actions, or when the action only makes sense while looking at its object. It trades reach for clarity, so check it against `touch-reach` when the object sits high.

## Contextual action

```text
item
item   [ action, only while it applies ]
item
```

The action is not on the screen at rest. It appears at the place and the moment it makes sense: beside a selection once something is selected, on a row once that row is in the state the action needs, over a ground once the ground shows something to act on. Right when an action applies to a fraction of the screen's life, since a control that is permanently present and mostly disabled is chrome. It owes two things. The person has to be able to predict it, so it appears in the same place every time, and it needs a route that does not depend on reaching the triggering state by gesture, which is `a11y-gesture`.

## Split

```text
+-----------+
|     A     |
+-----+-----+
|  b  |  c  |
+-----+-----+
```

The frame is divided into regions with different jobs, each visibly its own. Right when two kinds of content are both needed at once and neither is a detail of the other. The division is unequal on purpose: equal halves say the two are peers, which they rarely are.

## Layer

```text
+-------------+
| ground      |
|    object   |
|      +------+
|      | over |
+------+------+
```

Parts sit over one another instead of beside one another. A full-bleed ground (a map, a viewfinder, an artwork) with controls above it. Right when the ground is the content and chrome would shrink it. Everything over the ground answers to `layout-overlays`, and text over a ground nobody chose answers to `color-contrast`.

## Proximity

```text
TITLE

item
item

TITLE

item
```

Groups are made by distance alone: near things belong together, and the gap between groups is visibly larger than the gap inside one. No border, no card. Right far more often than it is used, and the rule behind it is `layout-grouping`. It fails when the two gaps are close enough to be confused.

## Disclosure

```text
what matters
   > detail
      > rarely needed
```

Depth replaces length. The first level is complete by itself and the rest is reachable, in place or one level down. Right when most visits need only the top. Wrong when the hidden part is needed on every visit, since a tap has been added to the ordinary path.

## Persistent and transient

```text
+-------------+
| stays       |
+-------------+
| changes     |
| changes     |
+-------------+
```

One region holds still while another is replaced, paged or scrolled: a player over a queue, a preview over its settings, a total over its line items. Right when the person acts in one region to see the effect in the other. The persistent region is the smaller one unless it is the content.

## Combining them

Name the relations a candidate uses, in the order they dominate. "Focus, then object and action, over proximity" is a composition. "Flow" alone is the default, and is sometimes the answer.

A relation earns its place by what the context asks for. A glance asks for focus. One hand asks for anchor, or for an object low enough to carry its own action. A long seated session can afford split and disclosure. A ground worth looking at asks for layer.
