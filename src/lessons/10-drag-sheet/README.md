# Lesson 10: Drag-to-reveal sheet ("Drag up for more")

**Goal:** a bottom sheet you pull up with a finger or mouse. The sheet, a black-and-red wipe band and the page dimming all track your drag *live*, and when you let go, it snaps open or closed depending on how far and how fast you dragged.

Everything before this lesson animated *on its own* once triggered. This one is **direct manipulation**: the user's finger *is* the animation's timeline.

**Analogy:** a window blind. While you're holding the cord, the blind goes exactly where your hand goes. Let go partway and it either rolls up or drops down, depending on which way you were pulling and how hard.

---

## 1. Pointer Events: one API for mouse, touch and pen

Old code needed `mousedown/mousemove` *and* `touchstart/touchmove`. **Pointer Events** cover all of them:

```tsx
<button
  onPointerDown={onPointerDown}
  onPointerMove={onPointerMove}
  onPointerUp={onPointerEnd}
  onPointerCancel={onPointerEnd}   // e.g. a phone call interrupts the touch
>
```

### Pointer capture

```ts
e.currentTarget.setPointerCapture(e.pointerId);
```

Without this, the moment your finger slides off the small handle, the handle stops receiving `pointermove` and the drag dies. Capture says "send me every move from *this* pointer until it lifts, wherever it goes."

### `touch-action: none` (the most important line for phones)

```css
.sheet__handle { touch-action: none; }
```

By default, a vertical swipe on a phone **scrolls the page**. The browser decides that before your JavaScript even runs. `touch-action: none` on the handle tells it: "I'll handle drags here myself." Leave it off and the page scrolls instead of the sheet moving.

It's only on the **handle**, not the whole sheet. The sheet's body still scrolls normally, so a long description stays readable.

---

## 2. Following the finger without re-rendering React

A drag fires 60–120 `pointermove` events per second. If each one called `setState`, React would re-render the component that often, which is wasteful and can stutter on cheap phones.

Instead:
- Drag data (start position, velocity...) lives in a **`useRef`**. Changing a ref doesn't trigger a render.
- Each move calls `apply(y)`, which writes **two CSS variables** onto the stage:

```ts
stage.setProperty("--y", `${y}px`);              // sheet offset (0 = open)
stage.setProperty("--p", (1 - y / closedY));     // progress 0..1
```

- CSS does the rest. Every moving part reads those two numbers:

```css
.sheet               { transform: translateY(var(--y)); }
.sheet-stage__wipe   { transform: translateY(calc(var(--y) - var(--p) * 90px)); }
.sheet-stage__dim    { opacity: calc(var(--p) * 0.55); }
.sheet__hint         { opacity: calc(1 - var(--p) * 3); }   /* gone by ~33% */
.sheet__title        { opacity: calc(var(--p) * 3 - 1); }   /* appears after ~33% */
```

React state (`open`) only changes **twice per gesture**: when it snaps open or closed. That's the same split as every earlier lesson (state for *what*, CSS for *how*), just pushed to 60fps.

**Analogy:** a puppeteer. JS pulls exactly two strings (`--y`, `--p`), and every part of the puppet is tied to those strings.

---

## 3. Tracking vs. snapping

While dragging, transitions must be **off**, or the sheet would lag behind your finger like it's on a rubber band:

```css
.sheet-stage.is-dragging { transition: none; }
```

On release, the class comes off, transitions come back on, and the final `--y`/`--p` values animate into place.

### Why `@property`?

```css
@property --p { syntax: "<number>"; inherits: true; initial-value: 0; }
.sheet-stage  { transition: --p 340ms ..., --y 340ms ...; }
```

Normally the browser treats custom properties as plain text and can't tween between `"0.4"` and `"1"`, so they jump. Registering them with a type (`<number>`, `<length>`) makes them animatable. That one registration is why a single transition moves the sheet, the wipe, the dim and the text fades in perfect sync.

---

## 4. Deciding where to land: distance + velocity

```ts
if (velocity < -FLICK_SPEED) toOpen = true;        // fast flick up
else if (velocity > FLICK_SPEED) toOpen = false;   // fast flick down
else toOpen = y < closedY / 2;                     // slow drag: whichever side is closer
```

- **Velocity** = change in pointer position ÷ change in time, between the last two moves (lightly smoothed). Units are px per millisecond. `0.5` = 500px per second.
- A short, quick flick should open the sheet even if it only moved 60px. Phones have trained everyone to expect that.

### Rubber-banding

Dragging past fully open (or below closed) moves at 30% speed instead of stopping dead. It's the "stretchy" feel iOS lists have.

```ts
if (y < 0) y = y * RUBBER;   // RUBBER = 0.3
```

---

## 5. Tap vs. drag

The handle is a `<button>`, so:
- **Tap / click** toggles it (`onClick`).
- **Enter / Space** toggles it, so keyboard users get the full feature without dragging.
- But a drag *also* fires `click` when you release. So if the pointer moved more than 6px (`TAP_SLOP`), the next click is ignored.

Other accessibility details:
- `aria-expanded` tells screen readers whether it's open.
- **Esc** closes it, and so does tapping the dimmed backdrop.
- While closed, the body is `inert`, so Tab can't land on invisible links.
- With "reduce motion" on (Lesson 07), the snap is instant. Dragging still follows your finger: that's direct manipulation, not decorative motion.

---

## 6. Making the background react to the drag

Because `--p` is set on the stage and CSS variables **inherit**, *anything* inside the stage can read it, including the page behind the sheet. No extra JavaScript needed:

```css
.l10__burst {                                  /* the starburst behind the page */
  rotate: calc(var(--p) * 140deg);             /* turns as you pull */
  scale:  calc(1 + var(--p) * 0.3);            /* and zooms in a little */
}
.l10__hero {                                   /* the title + card in front */
  translate: 0 calc(var(--p) * -48px);         /* lifts */
  scale:     calc(1 - var(--p) * 0.08);        /* and shrinks slightly */
}
```

- **It's tied to the pull, not to time.** Drag 100px and it turns about 33°; drag back down and it un-turns. Stop and it stops.
- **The snap carries it through.** On release, `--p` transitions to 0 or 1 (that's the `@property` from section 3), so the spin finishes the turn smoothly and even overshoots a hair with the sheet.
- **Two depths = parallax.** The background turns and zooms while the foreground slides, so they move by different amounts. That difference is what your eye reads as depth.
- **Ambient + drag add together.** The burst also has `.spin-slow` from Lesson 07, which animates `transform`. The drag uses the separate `rotate` property, so the two rotations stack instead of overwriting each other: a slow idle drift, plus the extra turn from your pull.

**Analogy:** the sheet's handle is a crank. Turning it lifts the sheet *and* drives a gear (the starburst) through the same axle (`--p`).

Swap in your own mapping: `calc(var(--p) * 360deg)` for a full turn, a negative number to spin the other way, or `translate` on a background photo for a vertical parallax scroll.

## Try it

1. Change `FLICK_SPEED` to `0.2` (twitchy) and `1.2` (needs a hard flick).
2. Change `RUBBER` to `0` (hard wall) and `0.8` (barely resists).
3. Change the wipe lead from `90px` to `200px` for a dramatic band.
4. Add a half-open "peek" stop at 50%: snap to the closest of three positions instead of two.

## Porting to your site

```tsx
<DragSheet title="Project details" background={<YourProjectCard />}>
  ...long details...
</DragSheet>
```

For a real page, make the stage the whole viewport: `position: fixed; inset: 0;` on `.sheet-stage`, and give `.sheet-stage__page` your normal content. Copy `DragSheet.tsx` + `drag-sheet.css`. It has no dependencies on other lessons.
