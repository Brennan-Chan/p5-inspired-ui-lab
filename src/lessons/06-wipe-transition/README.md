# Lesson 06: Page transitions (the red wipe)

**Goal:** when the page changes, a slanted red wedge sweeps across, the content swaps while it's hidden, and the wedge sweeps off. Wrapped as `<WipeTransition pageKey={...}>`.

## The problem

Up to now, every animation was "one element moves". A page transition is a **sequence**: cover, *then* swap, *then* reveal. The swap must happen at the exact moment the screen is covered.

**Analogy:** a stage crew changing sets. The curtain closes, the crew swaps the furniture, the curtain opens. If they swap before the curtain is fully closed, the audience sees it.

## A tiny state machine

```
idle ──(pageKey changes)──▶ cover ──(animationend)──▶ reveal ──(animationend)──▶ idle
                                       │
                                       └─ swap content here, while fully covered
```

`phase` is React state. Each phase renders the wedge with a different class, and each class runs a different keyframe:

```css
.wipe--cover  { animation: p5-wipe-in  320ms var(--ease-snap) both; }
.wipe--reveal { animation: p5-wipe-out 320ms var(--ease-snap) both; }
```

### Chaining with `animationend`

The browser fires `animationend` when a CSS animation finishes. That's the cue to move to the next phase:

```ts
if (phase === "cover")  { setShown(latest.current); setPhase("reveal"); }
if (phase === "reveal") { setPhase("idle"); }
```

No `setTimeout(…, 320)` guessing. If you change the duration in CSS, the sequence still lines up.

`e.target !== e.currentTarget` skips events bubbling up from child elements that have their own animations. Without that check, a child's animation ending would advance the phase early.

## Showing the *old* page during the cover

`shown` holds what's actually on screen, and it only updates during the swap. `latest` (a `useRef`) always holds the newest request. Refs update without causing re-renders, so they're the right tool for "remember the newest value for later".

If you click three pages quickly, the running wipe isn't interrupted. `latest` just ends up holding the last one, and when the reveal finishes it checks for that and loops back to `cover` if needed. You always land where you last clicked.

The content wrapper also gets `key={shown.key}`, so React remounts it on every swap and its small pop-in animation replays (same `key` trick as Lesson 04's replay button).

## The wedge itself

Two layers (black, then red) with the same slanted `clip-path`, the black one shifted 9% behind. One element would look flat; two offset layers read as depth. The layers are 150% wide (`left: -25%; right: -25%`) so the slant never shows a gap at the edges, and the stage has `overflow: hidden` to crop them.

## Try it

1. Swap the direction: make `p5-wipe-in` start at `translateX(160%)` so it comes from the right.
2. Add a third layer (white) for even more depth.
3. Use `--ease-slam` instead of `--ease-snap` for the cover and see why overshoot is bad *here*: it uncovers the swap.

## Porting to your site

Wrap whatever renders the current section: `<WipeTransition pageKey={activeSection}>{...}</WipeTransition>`. It works with any state, a tab index or a router path (`useLocation().pathname`).
