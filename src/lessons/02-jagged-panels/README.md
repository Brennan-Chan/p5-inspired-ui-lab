# Lesson 02: Jagged panels

**Goal:** turn a plain rectangle into a slanted "paper cutout" panel, and wrap it in a reusable `<JaggedPanel>` component.

## The three ingredients

| Property | What it does | Analogy |
|---|---|---|
| `clip-path: polygon(...)` | Cuts the element to any shape you list corner-by-corner | Scissors |
| `transform: skewX()` / `rotate()` | Slants or tilts the element | Pushing the top of a card sideways |
| `filter: drop-shadow()` | Draws a shadow that follows the *clipped* shape | Tracing around the cutout |

## clip-path

```css
clip-path: polygon(3% 5%, 100% 0%, 96% 97%, 0% 100%);
/*                 top-left  top-right  bottom-right  bottom-left */
```

Each pair is `x y` measured from the element's top-left corner. A normal rectangle is `0 0, 100% 0, 100% 100%, 0 100%`. Nudge a few corners inward and you get the jagged look.

**The catch:** clip-path cuts away *everything* outside the shape, including `border` and `box-shadow` on that same element. You can see this in the "Clipped" demo: the border is sliced off at the corners.

## The fix: two wrappers

```
<div class="jagged">            ← rotate + drop-shadow (outline)
  <div class="jagged__shape">   ← clip-path + skew + background
    <div class="jagged__content">  ← counter-skew so text is readable
```

`filter: drop-shadow()` on the **parent** sees the child's final, clipped shape and draws a shadow around it. Four zero-blur drop-shadows (left, right, up, down) make a solid outline, and a fifth offset one makes the red "printed slightly off" shadow.

## Counter-skewing

If you skew a box by -8°, the text inside is slanted too. Skewing the inner content by +8° cancels it out:

```css
.jagged__shape   { transform: skewX(var(--skew)); }
.jagged__content { transform: skewX(calc(var(--skew) * -1)); }
```

Rotation is left alone. Slightly rotated text still reads fine and looks intentional.

## Driving CSS from React with variables

The component passes props into CSS variables instead of writing whole style strings:

```tsx
const style = { "--tilt": `${tilt}deg`, "--skew": `${skew}deg`, "--clip": jaggedPolygon(chaos) } as CSSProperties;
```

The CSS reads `var(--tilt)`. This keeps all the visual rules in the CSS file, and React only feeds it numbers. The sliders in the demo are just `useState` values flowing into those variables.

## Why not `Math.random()` for the corners?

React re-renders often. A random shape would jump around every time. `jaggedPolygon()` uses fixed multipliers so the same `chaos` value always gives the same shape. (Lesson 03 shows how to get *stable* randomness with a seed.)

## Try it

1. Add a 5th or 6th point to the polygon for a notch on one side.
2. Change the red offset shadow from `10px 10px` to `-10px 14px`.
3. Use `<JaggedPanel tone="white">` and see why the outline color had to swap.

## Porting to your site

Copy `JaggedPanel.tsx` + `jagged-panel.css` into `src/components/`. CRA imports CSS files the same way Vite does, so no changes are needed.
