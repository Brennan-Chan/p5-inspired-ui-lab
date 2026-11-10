# Lesson 04: Easing and the slam-in

**Goal:** understand *easing* (the thing that makes motion feel snappy or soft), then build a reusable staggered entrance animation.

## Easing in one sentence

Easing controls **how speed changes over the animation's duration**. Two animations with the same distance and duration can feel completely different.

**Analogy:** driving the same block in 10 seconds. `linear` is cruise control. `ease` is a careful driver. `--ease-slam` floors it, slightly overshoots the stop line and jolts back. Persona's menus drive like that.

## cubic-bezier

Every easing is a curve defined by two control points:

```css
--ease-slam: cubic-bezier(0.2, 1.6, 0.4, 1);
/*                        x1   y1   x2   y2 */
```

The y-values are "progress". **A y-value above 1 means the element goes past its destination**, then comes back. That's the overshoot. Play with curves at [cubic-bezier.com](https://cubic-bezier.com).

## CSS `@keyframes`

A keyframe animation lists states at percentages of the timeline:

```css
@keyframes p5-slam-in {
  0%   { opacity: 0; transform: translateX(-140%) skewX(-25deg); }
  60%  { opacity: 1; transform: translateX(8%)    skewX(-6deg);  }  /* overshoot */
  100% { opacity: 1; transform: translateX(0)     skewX(-10deg); }  /* settle */
}
.slam-in { animation: p5-slam-in 320ms var(--ease-out) both; }
```

Here the overshoot is written into the keyframes (at 60%) instead of the easing curve. Both approaches work. Keyframes give you more control, like changing the skew mid-flight.

`both` (the fill mode) means: hold the 0% frame *before* the animation starts (so staggered items don't flash in their final spot during the delay) and hold the 100% frame after it ends.

## Staggering with one variable

```tsx
<li className="slam-in" style={{ "--i": i }}>
```
```css
.slam-in { animation-delay: calc(var(--i) * 55ms); }
```

One animation, five items, five start times. No JavaScript timers.

## Performance rule of thumb

Animate **`transform` and `opacity`** wherever possible. The browser can hand those to the GPU without recalculating layout. Animating `left`, `width` or `margin` forces layout work every frame. (The easing race deliberately animates `left` to keep the demo simple; the slam-in uses `transform`, as real UI should.)

## Replaying an animation in React

CSS animations run once, when the element appears. To replay, make React create *new* elements by changing their `key`:

```tsx
<ul key={`list-${run}`}>   // run++ on click → new <ul> → animations restart
```

## The slow-mo trick

All durations are multiplied by `var(--slowmo, 1)`. Setting `--slowmo: 5` on a parent slows everything inside 5×. Use this whenever you're tuning motion; at full speed your eyes can't see what's wrong.

## Try it

1. Change the 60% keyframe's `translateX(8%)` to `20%` for a bigger overshoot.
2. Change the stagger from 55ms to 120ms. Notice when it starts to feel slow.
3. Add a 5th lane to the race with your own `cubic-bezier`.

## Porting to your site

Copy `slam.css` and add `className="slam-in"` + `style={{ "--i": index }}` to any list (nav links, project cards). Your site already has **react-spring**. It does physics-based springs instead of fixed curves; see the root README for when to reach for it.
