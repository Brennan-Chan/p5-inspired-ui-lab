import type { Lesson } from "./types";
import Lesson01 from "./01-palette-texture/Lesson01";
import Lesson02 from "./02-jagged-panels/Lesson02";

// The sidebar is generated from this list. Add a lesson = add one entry.
export const lessons: Lesson[] = [
  { id: "01", title: "Palette & texture", folder: "01-palette-texture", Component: Lesson01, summary: "Design tokens plus starburst and halftone textures made from pure CSS gradients. No images." },
  { id: "02", title: "Jagged panels", folder: "02-jagged-panels", Component: Lesson02, summary: "clip-path, skew and drop-shadow turn a rectangle into a paper cutout." },
];
