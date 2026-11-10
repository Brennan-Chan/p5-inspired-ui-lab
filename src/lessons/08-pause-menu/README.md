# Lesson 08: Putting it together, the pause menu

**Goal:** combine every earlier piece into one interactive, animated screen, then see how to pull parts of it into your portfolio.

## What's reused from where

| Piece | From |
|---|---|
| Red/black palette, starburst, halftone | Lesson 01 (`tokens.css`) |
| White content panel | Lesson 02 (`JaggedPanel`) |
| "MENU" heading | Lesson 03 (`RansomText`) |
| Menu items sliding in one after another | Lesson 04 (`slam.css`) |
| Keyboard/mouse menu with red stamp | Lesson 05 (`StampMenu`) |
| Content swapping behind a red wedge | Lesson 06 (`WipeTransition`) |
| Boiling title, spinning burst, reduced-motion | Lesson 07 |

`PauseMenu.tsx` itself is mostly *layout and wiring*. That's the point of building small components first: the final screen is assembly, not invention.

**Analogy:** LEGO. Lessons 01–07 made the bricks. This lesson only snaps them together.

## Layers (back to front)

1. **Background:** spinning starburst + halftone + a black diagonal slab that slides in.
2. **Left column:** boiling ransom title and the `StampMenu`.
3. **Right column:** `WipeTransition` keyed on the selected section, holding a `JaggedPanel`.
4. **Hint bar:** keyboard hints in the corner.

Stacking is handled with `position: absolute` for background layers and CSS Grid for the two columns.

## One state value drives everything

```tsx
const [selected, setSelected] = useState(0);
<StampMenu selected={selected} onSelect={setSelected} />
<WipeTransition pageKey={sections[selected].id}> … </WipeTransition>
```

Move the selection and the stamp moves (CSS transition) *and* the panel wipes (state machine). Neither component knows the other exists; they just share one number. This is the core idea of React: **state is the single source of truth, and the UI is a function of it.**

## Opening and closing

- A `keydown` listener on `window` toggles `open` on **Escape**, like a game's pause button. It's added in a `useEffect` and removed in its cleanup function, so it doesn't leak when you leave the lesson.
- Each open bumps `openCount`, which is used as the `key` of the menu wrapper. New key → new elements → every entrance animation (clip-path reveal, slab, slam-in list) replays. Same trick as Lesson 04's replay button.
- After opening, focus moves to the selected menu button so the arrow keys work immediately.

## Confirm feedback

Pressing Enter bumps a counter that keys a "Selected!" stamp, so it slams in fresh each time. `aria-live="polite"` makes screen readers announce it.

## Taking pieces to your portfolio

Ranked from "easy win" to "think twice":

1. **`motion-safety.css`:** import at the root first. Always.
2. **Tokens + `slam.css`:** stagger your project cards or nav links on load.
3. **`StampMenu`:** as your top nav or section switcher. Hook `onConfirm` to `scrollIntoView`.
4. **`JaggedPanel`:** for project cards or callouts.
5. **`RansomText`:** section headings only. Keep body text plain and readable.
6. **`WipeTransition`:** between sections if you build tabbed views.
7. **Spinning starburst:** use with care. It's eye-catching, but behind text it hurts readability. Better as a hero background with the spin slowed down a lot.

Copy each component's `.tsx` + `.css` into `src/components/` in `BrennanHonorio.online`. Both projects use React 18 + TypeScript, so they compile unchanged.

## Ideas to extend

- Gamepad support: the browser's Gamepad API (`navigator.getGamepads()`) polled in `requestAnimationFrame`.
- Sound on move/confirm with your own audio files.
- A character silhouette layer using your own illustration or photo with `filter: grayscale(1) contrast(4)` for a high-contrast poster look.
