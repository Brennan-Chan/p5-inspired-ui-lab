# Lesson 07: Stop-motion jitter and motion accessibility

**Goal:** add the constant "alive" feeling (jittering text, a slowly spinning background), then make sure it switches off for people who need it to.

## 1. Stop-motion with `steps()`

Persona's UI doesn't wobble smoothly. It *boils*: a couple of slightly different frames flip back and forth, like hand-drawn animation. CSS can do that with a stepped timing function:

```css
@keyframes p5-boil {
  0%, 100% { transform: rotate(-1.2deg) translate(0, 0); }
  50%      { transform: rotate(1deg) translate(1px, -2px); }
}
.boil { animation: p5-boil 360ms steps(1, end) infinite; }
```

`steps(1, end)` means "one jump per keyframe segment": hold frame A, snap to frame B, snap back. No in-between frames.

**Analogy:** a flipbook with two pages versus a video of the same motion. The flipbook's choppiness is the style.

This is also how the original TouchDesigner project did its `paper*1.png` / `paper*2.png` pairs: two images swapped on a timer. Here it's two *transforms* swapped, so no images are needed.

## 2. Ambient background motion

A conic-gradient starburst on an oversized element, spun with `linear` easing over 60 seconds. Linear is right *here*: constant background motion shouldn't speed up or slow down and draw attention.

## 3. `prefers-reduced-motion` (not optional)

Some people get dizzy, nauseous or distracted from motion, especially continuous motion and large movement. Every OS has a "reduce motion" setting, and browsers expose it to CSS:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
  }
}
```

Two details matter:
- **1ms, not 0 or `none`.** Animations still run (instantly) and still fire `animationend`. Lesson 06's wipe depends on that event; with `animation: none` it would get stuck on `cover` forever.
- **Iteration count 1.** That stops infinite loops (the boil and the spin) after their first instant pass.

For motion driven by JavaScript (canvas, react-spring), CSS can't reach it, so use the `usePrefersReducedMotion()` hook and skip or shorten the animation yourself.

### Testing it on Windows

Settings → Accessibility → Visual effects → **Animation effects: Off**. The "OS setting detected" label updates live. Or use the "Simulate" checkbox, which applies the same rules with a class.

## Try it

1. Add a third keyframe to `p5-boil` (at 33% and 66%) and use `steps(1, end)` for a 3-frame boil.
2. Speed the boil up to 200ms and slow it to 600ms. Too fast reads as glitchy, too slow reads as broken.
3. Turn on the OS setting and click through Lessons 04–06. Everything should still work, just instantly.

## Porting to your site

Import `motion-safety.css` **once** at the root (`src/index.js`). Do this before adding any of the other effects to your portfolio. Your site already uses react-spring; pass `immediate: reduced` from the hook to its springs so they respect the setting too.
