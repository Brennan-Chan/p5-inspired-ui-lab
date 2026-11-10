# Lesson 09: The morphing selection cursor

**Goal:** recreate the selection effect from Daniel Dango's ["Persona 5 Menu UI" CodePen](https://codepen.io/dangodev/pen/qXdxOO): a red-and-cyan shape that constantly wobbles and slides from item to item. This lesson also upgrades the pause menu from Lesson 08 to use it.

## How the original pen works

I read the pen's source. It has three parts:
1. **Two SVG polygons**, red and cyan, inside one "selector" element.
2. **Every 120ms**, both polygons get 4 new random corner points, animated with the Snap.svg library.
3. The cyan layer has **`mix-blend-mode: screen`**. The pen's own comment calls this "where all the magic happens".

The menu text and the character art in the pen are pre-made images, so I didn't reuse those. Only the technique carries over.

## What's different here

| Original pen | This lab | Why |
|---|---|---|
| SVG polygons + Snap.svg | Two `<span>`s with CSS `clip-path: polygon()` + a CSS `transition` | No library. Browsers can interpolate between two polygons with the same number of points. |
| Hard-coded % positions per menu item | Measures the real selected button (`offsetLeft/Top/Width/Height`) | Works with any text, font or screen size |
| Cursor jumps between items | Cursor **glides** with `--ease-slam` | The "transition animation" between buttons |
| Always animating | Stops if the OS "reduce motion" setting is on | Accessibility (Lesson 07) |

## 1. Screen blending: three colors from two shapes

`screen` works like two projectors pointed at the same wall: light adds up.
- Red light + cyan light = **white** (red is R; cyan is G+B; together, all three).
- Red alone stays red. Cyan alone stays cyan.

So two overlapping, wobbling shapes produce a red/white/cyan cursor whose white center keeps changing shape. Untick the checkbox in the demo to see the two plain layers.

`isolation: isolate` on the cursor keeps the blend *inside* the cursor, so the cyan doesn't also blend with the page behind it.

## 2. Morphing: random corners + a CSS transition

```ts
setInterval(() => setShapes([randomQuad(), randomQuad()]), 120);
```
```css
.morph-cursor__red { transition: clip-path 120ms linear; }
```

React sets a new `clip-path` every 120ms. The transition lasts exactly as long as the interval, so each wobble flows straight into the next. `randomQuad()` keeps each corner in its own quadrant (top-left corner stays top-left), so the shape never folds inside-out. Horizontal ranges are kept tight (0–16% and 84–100%) so the ends of long words stay covered, and the selected label gets a thin white `text-shadow` halo for the moments they aren't.

### Gotcha: measuring position inside animated rows

`offsetLeft`/`offsetTop` are measured from the nearest *offsetParent*. Any ancestor with a `transform`, like a row still holding its slam-in keyframe, becomes that parent, and suddenly every button reports position `0`. `StampMenu` adds up offsets while walking up to the `<ul>`, which gives the right answer whatever the rows are doing.

**Analogy:** a rubber band held at four points by four fidgety fingers. Each finger only moves within its own corner.

Performance note: only `<MorphCursor>` holds the shape state, so the 8-times-a-second re-render touches two spans, not the whole menu.

## 3. Gliding: one shared cursor

`StampMenu` now accepts a `renderCursor` prop. When it's set, the menu:
1. measures the selected button inside a `useLayoutEffect` (runs before paint, so there's never a frame with the cursor in the wrong spot),
2. passes that box to your cursor component,
3. hides the per-item stamps from Lesson 05.

The cursor moves with `transform: translate(x, y) rotate(tilt)`, which gets a 150ms `--ease-slam` transition, so it overshoots slightly as it lands on the new item.

`renderCursor` is a **render prop**: the menu decides *where*, and you decide *what* gets drawn there. That keeps `StampMenu` reusable; you could pass in a completely different cursor.

## 4. Label hover and press animations (applies to Lessons 05, 08 and 09)

- **Hover / selection:** the label pops to 118% and tilts, using `scale` and `rotate` as separate CSS properties, so they don't fight with the jitter.
- **Jitter:** the selected label boils between two positions with `steps(1, end)` (Lesson 07).
- **Press:** `:active` squashes the label to 105% for 60ms, a tactile "click".

## Try it

1. Slide the speed to 60ms (frantic) and 500ms (lazy). 100–150ms matches the game's feel.
2. Change the cyan to yellow (`#ffe600`). Screen with red then gives orange-white.
3. Widen the quadrant ranges in `randomQuad()` (e.g. `0, 45`) for wilder shapes.

## Porting to your site

Copy `MorphCursor.tsx` + `morph-cursor.css` along with `StampMenu` and pass:
```tsx
<StampMenu ... renderCursor={(box) => <MorphCursor box={box} />} />
```
