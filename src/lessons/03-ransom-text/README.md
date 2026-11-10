# Lesson 03: Ransom-note lettering

**Goal:** a `<RansomText>` component that splits a word into letters and gives each one a different font, size, tilt and "paper", without the result changing every time React re-renders.

## The idea

Persona 5's headings look like letters cut out of different magazines. On the web, that means:
1. Split the string into individual characters.
2. Wrap each in its own `<span>`.
3. Give each span a randomly chosen font, scale, rotation and background.

**Analogy:** a deck of cards. Shuffling with the same seed is like using a deck that was stacked in a known order: deal it again and you get the same hand. That's what keeps the letters stable.

## Step 1: splitting text

```ts
Array.from(text) // "Hi" -> ["H", "i"]
```

`Array.from` (instead of `text.split("")`) handles emoji and accented characters correctly.

## Step 2: why not `Math.random()`?

React calls your component function every time state changes, including when you type one more letter. With `Math.random()`, every letter would get a new font on every keystroke and the heading would flicker.

The fix is a **seeded** random generator (`seededRandom` in `RansomText.tsx`). Give it the same seed and it returns the same sequence of numbers every time. On top of that, `useMemo` skips the work entirely unless `text` or `seed` actually changed:

```ts
const letters = useMemo(() => { /* pick styles */ }, [text, seed]);
```

## Step 3: CSS variables per letter

Each span gets its random values as variables:

```tsx
style={{ "--font": "var(--font-serif)", "--scale": 1.1, "--rot": "-4deg" }}
```

and one CSS rule turns them into styling:

```css
.ransom__char {
  font-family: var(--font);
  font-size: calc(1em * var(--scale));
  transform: translateY(var(--lift)) rotate(var(--rot));
}
```

Same pattern as Lesson 02: JavaScript decides the numbers, and CSS decides what they mean.

## Step 4: accessibility (don't skip this)

A screen reader would read each span separately ("T. a. k. e."). So:
- The wrapper gets `aria-label="Take your time"` and `role="img"`, which tells assistive tech "read this as one thing".
- Every letter span gets `aria-hidden="true"`.

Same look, and it still reads as a normal word.

## Try it

1. Add a 7th font to `FONTS` (pick one from Google Fonts and add it to `index.html`).
2. Change the rotation range from ±8° to ±20° and see where it stops being readable.
3. Give `"red"` more weight in `TONES` by listing it twice.

## Porting to your site

Copy `RansomText.tsx` + `ransom-text.css`. Add the Google Fonts `<link>` from this repo's `index.html` to your site's `public/index.html`. Use it sparingly, for section titles only, never body text.
