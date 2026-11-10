import type { Lesson } from "./types";
import Lesson01 from "./01-palette-texture/Lesson01";
import Lesson02 from "./02-jagged-panels/Lesson02";
import Lesson03 from "./03-ransom-text/Lesson03";
import Lesson04 from "./04-slam-in/Lesson04";
import Lesson05 from "./05-stamp-menu/Lesson05";
import Lesson06 from "./06-wipe-transition/Lesson06";
import Lesson07 from "./07-jitter-a11y/Lesson07";
import Lesson08 from "./08-pause-menu/Lesson08";
import Lesson09 from "./09-morph-cursor/Lesson09";

// The sidebar is generated from this list. Add a lesson = add one entry.
export const lessons: Lesson[] = [
  { id: "01", title: "Palette & texture", folder: "01-palette-texture", Component: Lesson01, summary: "Design tokens plus starburst and halftone textures made from pure CSS gradients. No images." },
  { id: "02", title: "Jagged panels", folder: "02-jagged-panels", Component: Lesson02, summary: "clip-path, skew and drop-shadow turn a rectangle into a paper cutout." },
  { id: "03", title: "Ransom text", folder: "03-ransom-text", Component: Lesson03, summary: "Split a word into letters and give each its own font, tilt and paper, with seeded randomness so it stays stable." },
  { id: "04", title: "Easing & slam-in", folder: "04-slam-in", Component: Lesson04, summary: "Why easing curves decide how motion feels, and a reusable staggered entrance animation." },
  { id: "05", title: "Stamp menu", folder: "05-stamp-menu", Component: Lesson05, summary: "Keyboard and mouse interaction: React state picks the item, CSS transitions slam the stamp in." },
  { id: "06", title: "Wipe transition", folder: "06-wipe-transition", Component: Lesson06, summary: "Sequence cover → swap → reveal with a small state machine driven by animationend events." },
  { id: "07", title: "Jitter & a11y", folder: "07-jitter-a11y", Component: Lesson07, summary: "Stop-motion boil with steps(), ambient spin, and respecting the reduce-motion setting." },
  { id: "08", title: "Pause menu", folder: "08-pause-menu", Component: Lesson08, summary: "Every piece combined into one interactive pause screen. Press Esc." },
  { id: "09", title: "Morph cursor", folder: "09-morph-cursor", Component: Lesson09, summary: "A red/cyan selection cursor that wobbles constantly and glides between items, plus hover and press animations on the labels." },
];
