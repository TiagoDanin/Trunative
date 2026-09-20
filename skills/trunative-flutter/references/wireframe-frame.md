# Wireframe frame

The skeleton every wireframe copies, so two screens in the same project come out in the same drawing and a reviewer compares structure instead of style. Read it when `flow/spec.md` sends you to render a brief, and copy it rather than reinventing a set of conventions per screen.

Sections, in order: The frame, Shapes, Known defaults, The skeleton, Rules the skeleton encodes, Rendering. Reading for the shape ladder stops after Known defaults; the skeleton and what follows it are only needed once a shape is picked.

## The frame

393 by 852 is a reference canvas for structure. It is not a device specification, and it stands for no platform: the project may ship on Android, on iOS or on the mobile web, and the same canvas is used for all of them, because what gets compared between two wireframes is structure and that needs one constant frame.

Two things are kept apart here that a drawing tends to merge.

**The canvas** is the rectangle and its proportions: a tall, narrow frame about the shape of a phone in one hand. That is all it claims.

**System chrome and insets** belong to the device and are read at runtime, which is `layout-insets`. The canvas reserves a band at the top and a band at the bottom only to say that content cannot use those edges. Their heights in the skeleton are placeholders for "some system area", never the height of any real status bar, cutout, gesture area or navigation bar, and no number from this file goes into a layout. A screen that has to hold on a device with a larger cutout or a three-button bar is checked for that on the device in `flow/review.md`, not here.

Everything is greyscale by construction: four greys, one ink, and nothing else. A wireframe that acquires a colour has stopped being a wireframe, and `flow/spec.md` says why.

## Shapes

`flow/explore.md` sends the agent here while it writes candidates, to name a shape rather than fall into one. The list is a set of prompts, not a set of templates and not a closed vocabulary. When none of these gives the screen a composition of its own, invent one and name it in two words, the way these were named: a line everything hangs from became `timeline`, and a screen built around one ring of progress might be `focus-ring`, a control surface under a live ground `command-deck`. The name is what lets the next screen in the project refer to it. The relations a new shape is assembled from are in `references/design-grammars.md`.

- **stack**: a single vertical column, one full-width block after another. The shape almost anything defaults to; not forbidden, but it owes a reason when it wins.
- **rail**: a horizontally scrolling strip of equal items, anchored inside a vertical flow around it.
- **hero-split**: one dominant region, sized to what it actually needs, over a visibly different second region below it.
- **grid-wall**: a symmetric grid of equal tiles filling most of the frame.
- **timeline**: a single column where every item anchors to a line or marker running through it, order carrying meaning.
- **bottom-sheet**: chrome and controls anchored low, over content running full-bleed behind them, instead of a top bar.
- **tab-cluster**: content split into switchable panes at the same position, not one continuous scroll.
- **split-focus**: two unequal regions, one persistent (a map, a preview, a player) and one scrollable that acts on it.
- **canvas-overlay**: a full-bleed background with controls floating over it, instead of content sitting inside bounded cards.

## Known defaults

A wireframe that lands on one of these without a reason recorded is not a choice, it is the shape nobody chose:

- A top bar over a stack of equal-height cards, on a screen whose brief names a hierarchy: the stack flattens a lead item, a highlighted item or a different-shaped item into the same row as everything else.
- A symmetric grid of equal tiles as the whole content of a screen whose brief names an order or a lead item: the grid has no way to hold one.
- The primary action as a full-width button pinned to the bottom, when the brief's hierarchy puts it mid-scroll or beside the thing it acts on.
- A hero sized to a fixed familiar fraction of the frame, independent of what the screen's hierarchy actually needs the fold for.

None of these are banned; a screen can genuinely be a stack. What `flow/explore.md` stops is arriving at one of them with nothing else considered and no reason recorded for why it won, which is `comp-chosen`.

## The skeleton

Save as `.trunative/screens/<name>.wireframe.html`, one file, no imports, no CDN, no framework.

What is copied from below is the canvas, the greys and the drawing conventions: the cross, the text bar, the label. The classes for a card, a chip, a button and a tab bar are a convenience for drawing those things quickly when the composition has them, and every size in them is a drawing size. None of them is a component specification, none of their numbers reaches the build, and none of them is a reason for a screen to contain a card, a chip row or a tab bar. A composition that needs a block of another proportion, an uneven split, something overlapping a ground or a form no class here draws writes its own few lines of CSS in the same greys. The example screen shows the conventions in use. It is not a layout to start from, and a wireframe that begins by editing it has skipped `flow/explore.md`.

```html
<!doctype html>
<meta charset="utf-8">
<title>Wireframe</title>
<style>
  :root {
    --ink: #1c1c1e;
    --mute: #8e8e93;
    --line: #c7c7cc;
    --fill: #e5e5ea;
    --ground: #f2f2f7;
    --paper: #ffffff;
  }
  body {
    margin: 0;
    padding: 24px;
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    background: #d9d9de;
    font: 15px/1.35 -apple-system, "Segoe UI", Roboto, sans-serif;
    color: var(--ink);
  }
  /* The label is a sibling, never a child: the frame clips its own content. */
  .shot { display: flex; flex-direction: column; gap: 6px; }
  .label { font-size: 12px; color: #55555a; }
  .frame {
    width: 393px;
    height: 852px;
    display: flex;
    flex-direction: column;
    background: var(--ground);
    border: 1px solid var(--line);
    border-radius: 44px;
    overflow: hidden;
    position: relative;
  }
  .status, .indicator {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--mute);
    font-size: 11px;
  }
  .status { height: 59px; }
  .indicator { height: 34px; }
  .indicator::after {
    content: "";
    width: 140px;
    height: 5px;
    border-radius: 3px;
    background: var(--line);
  }
  .content {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .bar {
    flex: none;
    display: flex;
    align-items: center;
    gap: 12px;
    height: 44px;
    font-size: 22px;
    font-weight: 600;
  }
  .bar .spacer { flex: 1; }
  .row { display: flex; align-items: center; gap: 8px; }
  .scroller { display: flex; gap: 8px; overflow: hidden; }
  .chip {
    flex: none;
    padding: 7px 14px;
    border: 1px solid var(--line);
    border-radius: 999px;
    font-size: 13px;
    color: var(--mute);
    white-space: nowrap;
  }
  .card {
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 12px;
  }
  .box {
    background: var(--fill);
    border: 1px solid var(--line);
    border-radius: 10px;
  }
  /* A cross means an image nobody has chosen yet. */
  .image {
    background:
      linear-gradient(to top right, transparent calc(50% - 1px), var(--line) 50%, transparent calc(50% + 1px)),
      linear-gradient(to bottom right, transparent calc(50% - 1px), var(--line) 50%, transparent calc(50% + 1px)),
      var(--fill);
    border: 1px solid var(--line);
    border-radius: 10px;
  }
  .avatar { width: 56px; height: 56px; border-radius: 50%; }
  .text { height: 12px; border-radius: 3px; background: var(--fill); }
  .text.short { width: 40%; }
  .text.half { width: 55%; }
  .caption { font-size: 13px; color: var(--mute); }
  .section { font-size: 17px; font-weight: 600; }
  .button {
    height: 48px;
    border: 1px solid var(--ink);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }
  .tabbar {
    flex: none;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 64px;
    margin: 0 16px;
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 20px;
    font-size: 11px;
    color: var(--mute);
  }
  .tabbar .on { color: var(--ink); font-weight: 600; }
</style>

<div class="shot">
<div class="label">Memories, default</div>
<div class="frame">
  <div class="status">status bar</div>
  <div class="content">
    <div class="bar">Memories<span class="spacer"></span><span class="caption">menu</span></div>
    <div class="scroller">
      <div class="chip">Filter</div>
      <div class="chip">You (12)</div>
      <div class="chip">Natalia (20)</div>
      <div class="chip">Favorites (0)</div>
    </div>
    <div class="section">You recently viewed</div>
    <div class="card">
      <div class="row">
        <div class="image" style="width:96px;height:96px"></div>
        <div class="image" style="width:96px;height:96px"></div>
        <div class="box" style="width:96px;height:96px"></div>
      </div>
      <div class="text half" style="margin-top:12px"></div>
      <div class="caption" style="margin-top:6px">29 Memories, 2023 to 2025</div>
    </div>
    <div class="row">
      <div class="section">People</div>
      <span class="spacer" style="flex:1"></span>
      <div class="caption">View all</div>
    </div>
    <div class="row" style="justify-content:space-between">
      <div class="avatar box"></div>
      <div class="avatar box"></div>
      <div class="avatar box"></div>
      <div class="avatar box"></div>
      <div class="avatar box"></div>
    </div>
    <div class="button">Explore Memories</div>
  </div>
  <div class="tabbar">
    <span>Home</span><span class="on">Memories</span><span>Create</span>
    <span>Profiles</span><span>Account</span>
  </div>
  <div class="indicator"></div>
</div>
</div>
```

## Rules the skeleton encodes

- **The frame clips.** `.content` sets `overflow: hidden`, so anything that does not fit is cut off exactly as it would be on the device. A wireframe that scrolls its own frame hides the collision the render exists to find, which is `layout-fold` and `layout-chrome`.
- **Fixed chrome is a sibling, not an overlay.** The tab bar sits outside `.content`. When a real screen pins something over the content instead, draw it over, and then check what it covers at the end of the scroll.
- **Real strings only.** Type the words the screen will actually show, including the longest name and the largest count. Lorem text passes every layout and proves none, which is `copy-budget` and `copy-sample-data`.
- **A cross means an unchosen image**, a plain `.box` means a deliberate empty slot such as an add tile, and neither ever becomes a photograph.
- **The label names the frame, not the thinking.** The screen and its state, in the fewest words that tell two frames apart. Which shape was picked, why it beat the runner-up, and anything else settled on the way here is reasoning that happened before this file existed. Written into the drawing it becomes part of what gets looked at, and a frame that explains itself is being defended rather than read.
- **One frame per structurally different state.** Put a second `.shot` beside the first and set its `.label`. They sit side by side on one page, which is how a reviewer sees them in a single capture.

## Rendering

```sh
chrome --headless --window-size=393,852 --screenshot=wireframe.png .trunative/screens/<name>.wireframe.html
```

Widen `--window-size` by 440 for every frame past the first, so two frames want about 900 and three about 1340. A window that is a few points short wraps the last frame below the fold and it is missing from the capture with no error, so count the frames rather than guessing the width. Any Chromium binary works, `chromium` and `msedge` included. When none is installed, open the file in whatever browser is and capture it by hand: the HTML is the artefact, and the PNG is a view of it that nothing else depends on.
