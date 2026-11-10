import type { Lesson } from "./types";
import Lesson01 from "./01-palette-texture/Lesson01";

// The sidebar is generated from this list. Add a lesson = add one entry.
export const lessons: Lesson[] = [
  { id: "01", title: "Palette & texture", folder: "01-palette-texture", Component: Lesson01, summary: "Design tokens plus starburst and halftone textures made from pure CSS gradients. No images." },
];
