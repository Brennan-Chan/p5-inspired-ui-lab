# P5-Inspired UI Lab

A step-by-step lab for building **game-menu-style animation and interaction** for the web, inspired by Persona 5's pause menu. Eight small lessons, each building on the last, ending in a working pause menu you can take apart and reuse on a real site.

No game assets are used. Every shape, texture and effect is made from CSS and code, so anything here can go into a portfolio.

![stack](https://img.shields.io/badge/React-18-61dafb) ![ts](https://img.shields.io/badge/TypeScript-5-3178c6) ![vite](https://img.shields.io/badge/Vite-5-646cff)

---

## Run it

Requires [Node.js](https://nodejs.org) 18 or newer (check with `node -v`).

```bash
npm install     # once: downloads React, Vite, TypeScript into node_modules/
npm run dev     # starts a local server at http://localhost:5173 and opens it
```

Edit any file and save: the page updates instantly (hot reload). Stop the server with `Ctrl + C`.

Other scripts:

| Command | What it does |
|---|---|
| `npm run build` | Type-checks, then bundles an optimized site into `dist/` |
| `npm run preview` | Serves the built `dist/` folder locally, to test the production version |

---

## Walk through it lesson by lesson

Each lesson is its own git commit with a tag, so you can watch the project grow:

```bash
git tag                    # lesson-00 ... lesson-09
git checkout lesson-01     # the project as it was after Lesson 01
npm run dev                # see just that lesson
git checkout main          # back to the finished version
```

`git diff lesson-04 lesson-05` shows exactly what Lesson 05 added.

Each lesson folder has a `README.md` walkthrough (concept, analogy, key code, things to try, how to port it):

| # | Lesson | You'll learn |
|---|---|---|
| 01 | [Palette & texture](src/lessons/01-palette-texture/README.md) | CSS variables, conic/radial gradients, blend modes |
| 02 | [Jagged panels](src/lessons/02-jagged-panels/README.md) | `clip-path`, `skew`, `drop-shadow`, driving CSS from React props |
| 03 | [Ransom text](src/lessons/03-ransom-text/README.md) | Splitting text, seeded randomness, `useMemo`, accessible labels |
| 04 | [Easing & slam-in](src/lessons/04-slam-in/README.md) | Easing curves, `@keyframes`, staggering, replaying animations |
| 05 | [Stamp menu](src/lessons/05-stamp-menu/README.md) | Keyboard/mouse interaction, controlled components, transitions, roving tabindex |
| 06 | [Wipe transition](src/lessons/06-wipe-transition/README.md) | Sequencing animations with a state machine and `animationend` |
| 07 | [Jitter & a11y](src/lessons/07-jitter-a11y/README.md) | `steps()` stop-motion, ambient motion, `prefers-reduced-motion` |
| 08 | [Pause menu](src/lessons/08-pause-menu/README.md) | Composing everything; what to port to a real site |
| 09 | [Morph cursor](src/lessons/09-morph-cursor/README.md) | A wobbling red/cyan cursor (`mix-blend-mode: screen`, interpolated `clip-path`), render props, hover/press animations. Upgrades the pause menu. |

---

## Why this stack

**Language: TypeScript + React for behavior, plain CSS for looks and motion.**

- **React** handles *state*: which item is selected, which page is showing, whether the menu is open.
- **CSS** handles *motion*: transitions, keyframes, easing. The browser runs CSS animations on the GPU, they're smooth, and they need no extra library.
- **TypeScript** is JavaScript with types. It catches mistakes like passing a string where a number belongs before you even open the browser.
- **Vite** is the dev server + bundler (`npm run dev`). It's the modern replacement for Create React App, which is deprecated.

The rule that runs through every lesson:

> **React decides *what* state the UI is in. CSS decides *how* it looks and moves between states.**

This matches the stack of `BrennanHonorio.online` (React 18 + TypeScript), so components copy across unchanged.

### The wider toolbox (for later)

| Tool | Good for | Used here? |
|---|---|---|
| CSS transitions / keyframes | UI state changes, entrances, hover effects (90% of UI motion) | Yes, everywhere |
| Web Animations API (`el.animate()`) | Keyframes controlled from JS (pause, reverse, scrub) | No |
| **react-spring** (already in your site) | Physics springs, interruptible drag/gesture motion | No; see lesson READMEs for when |
| Motion (formerly Framer Motion) | Declarative React animation, exit animations, layout animations | No |
| GSAP | Complex timelines, scroll-driven storytelling | No |
| Canvas / PixiJS | Hundreds of moving sprites, particles | No |
| Three.js / React Three Fiber | Real 3D (like the original project's 3D character) | No |

Start with CSS. Reach for a library when you hit something CSS can't do cleanly, like animating an element *out* as React removes it, physics on drag, or long choreographed timelines.

---

## Project structure

```
index.html                 entry HTML (+ Google Fonts link)
src/
  main.tsx                 mounts React
  App.tsx                  sidebar + lesson switcher (hash URLs: #/05)
  styles/tokens.css        colors, fonts, easings, textures  ← copy this first
  styles/app.css           the lab's own layout (not part of any lesson)
  lessons/
    index.ts               the lesson list (sidebar is generated from it)
    01-palette-texture/    each lesson: LessonNN.tsx demo + reusable component(s) + CSS + README
    ...
    08-pause-menu/
```

Reusable components (the parts worth porting):

| Component | File |
|---|---|
| `JaggedPanel` | `src/lessons/02-jagged-panels/JaggedPanel.tsx` |
| `RansomText` | `src/lessons/03-ransom-text/RansomText.tsx` |
| `.slam-in` class | `src/lessons/04-slam-in/slam.css` |
| `StampMenu` | `src/lessons/05-stamp-menu/StampMenu.tsx` |
| `WipeTransition` | `src/lessons/06-wipe-transition/WipeTransition.tsx` |
| `usePrefersReducedMotion` + `motion-safety.css` | `src/lessons/07-jitter-a11y/` |
| `PauseMenu` | `src/lessons/08-pause-menu/PauseMenu.tsx` |
| `MorphCursor` | `src/lessons/09-morph-cursor/MorphCursor.tsx` |

---

## Debugging animations

- **Chrome DevTools → More tools → Animations** lets you slow down, pause and scrub every CSS animation on the page.
- Lessons 04 and 06 have a **slow motion** checkbox: every duration is multiplied by `var(--slowmo)`.
- Right-click → Inspect any element to see the CSS variables (`--i`, `--tilt`, `--font`) React gave it.

---

## Credits

Visual style inspired by *Persona 5* (ATLUS / SEGA). The Lesson 09 cursor technique (two morphing polygons with a screen blend) comes from Daniel Dango's [Persona 5 Menu UI CodePen](https://codepen.io/dangodev/pen/qXdxOO), reimplemented here without its images or libraries. This is an independent learning project. It contains no game art, fonts, sounds or code. Fonts are free Google Fonts.
