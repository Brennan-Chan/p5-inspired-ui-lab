# Lesson 01: Palette and texture

**Goal:** set up the colors, fonts and background textures every later lesson uses, with zero image files.

## Why start here

Before anything moves, the style has to look right standing still. Persona 5's menus get most of their identity from three things: a strict red, black and white palette, hard contrast, and busy print-style textures (starbursts, halftone dots). Get these right and even a plain box reads as "on-brand".

**Analogy:** this is mixing your paints before you start painting. Every later lesson dips into the same jars.

## 1. Design tokens (`src/styles/tokens.css`)

Every color, font and easing curve is a CSS custom property (a "variable") on `:root`:

```css
:root {
  --p5-red: #e60012;
  --p5-black: #0b0b0b;
  --ease-slam: cubic-bezier(0.2, 1.6, 0.4, 1);
}
.button { background: var(--p5-red); }
```

Why variables instead of typing `#e60012` everywhere:
- Change the red once and the whole site updates.
- JavaScript can change them at runtime (`el.style.setProperty("--skew", "12deg")`), which Lesson 02 uses for its slider.
- When you port a component to your portfolio, you copy the token block and the component works.

## 2. Starburst: `repeating-conic-gradient`

A *conic* gradient sweeps colors around a center point, like a clock hand. *Repeating* it with hard stops makes wedges:

```css
.starburst {
  background: repeating-conic-gradient(
    from 0deg at 30% 60%,          /* center of the burst */
    var(--p5-red) 0deg 9deg,       /* red from 0° to 9° */
    var(--p5-red-dark) 9deg 18deg  /* dark red from 9° to 18°, then repeat */
  );
}
```

Two colors that share a boundary angle (9deg) give a hard edge instead of a blend. Try changing `9deg 18deg` to `4deg 8deg` for thinner rays.

## 3. Halftone: one dot, tiled

```css
.halftone {
  background-image: radial-gradient(circle, rgba(0,0,0,.45) 1.6px, transparent 1.8px);
  background-size: 9px 9px;
}
```

`radial-gradient` draws a single dot (solid out to 1.6px, transparent from 1.8px). `background-size` sets the tile size, and the browser repeats it. Smaller tile = denser dots.

## 4. Stacking with `mix-blend-mode`

An absolutely positioned overlay with `mix-blend-mode: multiply` darkens whatever is beneath it, the same way two transparencies stacked on a projector do. That's how the dots print onto the red.

## Try it

1. In `tokens.css`, change `--p5-red` to a blue (`#0050ff`). Every lesson changes. That's the payoff of tokens.
2. Move the burst center: `at 30% 60%` → `at 50% 50%`.
3. Swap `multiply` for `screen` or `overlay` and compare.

## Porting to your site

Your site uses styled-components. Tokens go in a global style once; the textures work inside a styled component unchanged:

```tsx
const Hero = styled.section`
  background: repeating-conic-gradient(from 0deg at 30% 60%, var(--p5-red) 0 9deg, var(--p5-red-dark) 9deg 18deg);
`;
```
