# Lesson 05: The stamp menu (interaction)

**Goal:** the first truly *interactive* piece: a menu you drive with keyboard and mouse, where the selected item gets a red stamp slammed behind it.

This is where animation and interaction meet. The pattern is:

> **State decides *what* is selected. CSS decides *how* that looks and moves.**

React never animates anything here. It just flips an `is-selected` class, and CSS transitions do the motion.

**Analogy:** a light switch and a dimmer. React is the switch (on or off). The CSS `transition` is the dimmer that makes the change fade in at a speed you choose.

## 1. Controlled component

`StampMenu` doesn't own its selection. The parent does:

```tsx
const [selected, setSelected] = useState(0);
<StampMenu items={items} selected={selected} onSelect={setSelected} onConfirm={...} />
```

Why: in Lesson 08 the *same* `selected` value also drives which content panel is shown. If the menu kept its own state, the two would drift apart.

## 2. The stamp: pseudo-elements + transition

Each button has two pseudo-elements (`::before` red, `::after` white) that are always there, just scaled to zero:

```css
.stamp-menu__btn::before { transform: scale(0) rotate(-12deg); transition: transform 160ms var(--ease-slam); }
.is-selected .stamp-menu__btn::before { transform: scale(1) rotate(-3deg); }
```

When the class appears, the browser animates between those two transforms using the overshooting `--ease-slam` curve from Lesson 04. The white stamp has `transition-delay: 40ms`, so it lands a beat after the red one. That tiny delay sells the "layered paper" feel.

**`transition` vs `@keyframes`:** use a *transition* for A ↔ B state changes (selected / not selected) and *keyframes* for one-off sequences (an entrance).

## 3. Keyboard support

```ts
ArrowDown: () => move(selected + 1),
ArrowUp:   () => move(selected - 1),
```

- `(to + items.length) % items.length` wraps from the bottom back to the top.
- `e.preventDefault()` stops the arrow keys from scrolling the page.
- `move()` also calls `.focus()` on the new button, so focus and selection never disagree.

### Roving tabindex

Only the selected button has `tabIndex={0}`; the rest have `-1`. Result: **Tab** jumps into the menu and out again, while **arrow keys** move within it. That's the standard pattern for menus and toolbars and what screen-reader users expect.

## 4. Mouse

`onMouseEnter` selects and `onClick` confirms. `onFocus` also selects, which covers clicking and tabbing.

## Try it

1. Change the stamp's `clip-path` to a different shape (try a 6-point star-ish polygon).
2. Make the selected label red text on a white stamp instead.
3. Add a sound: `new Audio("/click.wav").play()` inside `move()`. Put your own `.wav` in a `public/` folder. Use your own sound file, not one ripped from a game.

## Porting to your site

`StampMenu` is a drop-in nav: copy the folder plus `04-slam-in/slam.css`. Hook `onConfirm` up to scroll to a section (`document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })`).
