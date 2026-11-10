import type { ComponentType } from "react";

/** One entry in the lesson sidebar. */
export interface Lesson {
  /** "01", "02"... used in the URL hash (#/03) */
  id: string;
  title: string;
  /** One sentence shown above the demo. */
  summary: string;
  /** Folder name under src/lessons, so the page can point at its README. */
  folder: string;
  Component: ComponentType;
}
