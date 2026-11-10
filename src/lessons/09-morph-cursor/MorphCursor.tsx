import { useEffect, useState, type CSSProperties } from "react";
import type { CursorBox } from "../05-stamp-menu/StampMenu";
import usePrefersReducedMotion from "../07-jitter-a11y/usePrefersReducedMotion";
import "./morph-cursor.css";

/**
 * A random 4-corner shape. Each corner stays in its own quadrant so the shape
 * never flips inside-out: top-left corner somewhere in the top-left area, etc.
 * (Here Math.random() is exactly what we want: a new shape every tick.)
 */
function randomQuad(): string {
  const r = (min: number, max: number) => (min + Math.random() * (max - min)).toFixed(1);
  return `polygon(${r(0, 16)}% ${r(0, 40)}%, ${r(84, 100)}% ${r(0, 40)}%, ${r(84, 100)}% ${r(60, 100)}%, ${r(0, 16)}% ${r(60, 100)}%)`;
}

/** Must match `.is-selected .stamp-menu__label { scale }` in stamp-menu.css. */
const LABEL_SCALE = 1.18;

export interface MorphCursorProps {
  /** Position of the selected item, provided by StampMenu's renderCursor. */
  box: CursorBox | null;
  /** How often (ms) the shapes pick new corners. */
  speed?: number;
  /** Extra px around the item so the cursor pokes out past the text. */
  pad?: number;
  /** Turn off mix-blend-mode to see the two layers separately. */
  blend?: boolean;
}

export default function MorphCursor({ box, speed = 120, pad = 12, blend = true }: MorphCursorProps) {
  const reduced = usePrefersReducedMotion();
  const [shapes, setShapes] = useState(() => [randomQuad(), randomQuad()]);

  // Every `speed` ms, give both layers new corners. CSS transitions the clip-path
  // from the old polygon to the new one, so it wobbles instead of jumping.
  // JS-driven motion isn't covered by motion-safety.css, so check the setting here.
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setShapes([randomQuad(), randomQuad()]), speed);
    return () => window.clearInterval(id);
  }, [speed, reduced]);

  if (!box) return null;

  // The selected label is scaled to 118% (stamp-menu.css), so grow the cursor
  // to match, keeping it centered on the item, then add padding on top.
  const w = box.w * LABEL_SCALE + pad * 2;
  const h = box.h * LABEL_SCALE + pad;
  const style = {
    "--x": `${box.x - (w - box.w) / 2}px`,
    "--y": `${box.y - (h - box.h) / 2}px`,
    "--w": `${w}px`,
    "--h": `${h}px`,
    "--tilt": `${box.tilt}deg`,
    "--speed": `${speed}ms`,
  } as CSSProperties;

  return (
    <span className={`morph-cursor ${blend ? "" : "morph-cursor--no-blend"}`} style={style} aria-hidden="true">
      <span className="morph-cursor__red" style={{ clipPath: shapes[0] }} />
      <span className="morph-cursor__cyan" style={{ clipPath: shapes[1] }} />
    </span>
  );
}
