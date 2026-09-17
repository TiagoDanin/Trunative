# Wireframe frame

The skeleton every wireframe copies, so two screens in the same project come out in the same drawing and a reviewer compares structure instead of style. Read it when `flow/spec.md` sends you to render a brief, and copy it rather than reinventing a set of conventions per screen.

## The frame

393 by 852 is the reference phone. The status bar occupies the first 59 points and the home indicator the last 34, and both are drawn as occupied area rather than as margin, because the point of the frame is that content cannot use them.

Everything is greyscale by construction: four greys, one ink, and nothing else. A wireframe that acquires a colour has stopped being a wireframe, and `flow/spec.md` says why.

## The skeleton

Save as `.trunative/screens/<name>.wireframe.html`, one file, no imports, no CDN, no framework.

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
- **One frame per structurally different state.** Put a second `.shot` beside the first and set its `.label`. They sit side by side on one page, which is how a reviewer sees them in a single capture.

## Rendering

```sh
chrome --headless --window-size=393,852 --screenshot=wireframe.png .trunative/screens/<name>.wireframe.html
```

Widen `--window-size` by 440 for every frame past the first, so two frames want about 900 and three about 1340. A window that is a few points short wraps the last frame below the fold and it is missing from the capture with no error, so count the frames rather than guessing the width. Any Chromium binary works, `chromium` and `msedge` included. When none is installed, open the file in whatever browser is and capture it by hand: the HTML is the artefact, and the PNG is a view of it that nothing else depends on.
