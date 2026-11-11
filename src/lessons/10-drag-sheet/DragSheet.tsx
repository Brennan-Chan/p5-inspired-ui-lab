import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import "./drag-sheet.css";

export interface DragSheetProps {
  /** Text on the handle while closed, e.g. "Drag up for more". */
  hint?: string;
  /** Title shown in the sheet header. */
  title: ReactNode;
  children: ReactNode;
  /** How many px of the sheet stay visible when closed. */
  peek?: number;
  /** Optional: page content behind the sheet. */
  background?: ReactNode;
  className?: string;
}

// Tuning knobs. Change these and feel the difference.
const TAP_SLOP = 6; // px a pointer may move and still count as a tap
const FLICK_SPEED = 0.5; // px per ms. Faster than this = a flick: follow its direction
const RUBBER = 0.3; // resistance when dragging past the ends (0 = wall, 1 = no resistance)

/**
 * A bottom sheet you drag up with a finger, mouse or pen.
 *
 * On every pointer move, two CSS variables are written straight to the DOM
 * (no React re-render): --y (sheet offset in px) and --p (0 = closed, 1 = open).
 * CSS reads them to move the sheet and the wipe band, dim the page and fade text.
 */
export default function DragSheet({
  hint = "Drag up for more",
  title,
  children,
  peek = 72,
  background,
  className = "",
}: DragSheetProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  // Everything the drag needs lives in a ref: it changes 60+ times a second,
  // and putting it in state would re-render the component on every frame.
  const drag = useRef({
    active: false,
    moved: false,
    startPointerY: 0,
    startSheetY: 0,
    y: 0, // current sheet offset in px (0 = fully open)
    closedY: 0, // offset when closed
    lastY: 0,
    lastT: 0,
    velocity: 0, // px per ms, negative = moving up
    suppressClick: false,
  });

  /** Write --y and --p onto the stage. The ONLY place the DOM is touched; CSS does the rest. */
  const apply = useCallback((y: number) => {
    const d = drag.current;
    d.y = y;
    const p = d.closedY > 0 ? 1 - y / d.closedY : 0;
    const stage = stageRef.current!.style;
    stage.setProperty("--y", `${y.toFixed(1)}px`);
    stage.setProperty("--p", p.toFixed(4));
  }, []);

  /** Animate to open or closed (the CSS transition does the animating). */
  const snapTo = useCallback(
    (toOpen: boolean) => {
      stageRef.current!.classList.remove("is-dragging"); // re-enables transitions
      apply(toOpen ? 0 : drag.current.closedY);
      setOpen(toOpen);
    },
    [apply],
  );

  // Measure: closed position = sheet height minus the visible peek.
  useLayoutEffect(() => {
    const measure = () => {
      const sheet = sheetRef.current!;
      drag.current.closedY = Math.max(0, sheet.offsetHeight - peek);
      apply(open ? 0 : drag.current.closedY);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stageRef.current!);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peek, apply]);

  // While closed, the body is hidden off-screen: make it un-focusable so Tab
  // doesn't wander into invisible links. (React 18 has no `inert` prop, so set it directly.)
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.inert = !open;
  }, [open]);

  // Escape closes, like any dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && snapTo(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, snapTo]);

  // ---- Pointer events: one code path for mouse, touch and pen ----

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return; // left mouse button / primary touch only
    // Capture: keep receiving moves even if the finger leaves the handle.
    e.currentTarget.setPointerCapture(e.pointerId);
    const d = drag.current;
    Object.assign(d, {
      active: true,
      moved: false,
      startPointerY: e.clientY,
      startSheetY: d.y,
      lastY: e.clientY,
      lastT: e.timeStamp,
      velocity: 0,
    });
    stageRef.current!.classList.add("is-dragging"); // transitions off: follow the finger 1:1
  };

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const dy = e.clientY - d.startPointerY;
    if (Math.abs(dy) > TAP_SLOP) d.moved = true;

    let y = d.startSheetY + dy;
    // Rubber-band past either end instead of stopping dead.
    if (y < 0) y = y * RUBBER;
    if (y > d.closedY) y = d.closedY + (y - d.closedY) * RUBBER;
    apply(y);

    // Velocity from the last two samples (smoothed a little).
    const dt = e.timeStamp - d.lastT;
    if (dt > 0) {
      const v = (e.clientY - d.lastY) / dt;
      d.velocity = d.velocity * 0.4 + v * 0.6;
    }
    d.lastY = e.clientY;
    d.lastT = e.timeStamp;
  };

  const onPointerEnd = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (!d.moved) {
      // It was a tap: let the button's onClick toggle it.
      stageRef.current!.classList.remove("is-dragging");
      return;
    }
    d.suppressClick = true; // a drag also fires "click" on release; ignore that one

    // Decide where to land: a fast flick wins, otherwise whichever side is closer.
    let toOpen: boolean;
    if (d.velocity < -FLICK_SPEED) toOpen = true;
    else if (d.velocity > FLICK_SPEED) toOpen = false;
    else toOpen = d.y < d.closedY / 2;
    snapTo(toOpen);
  };

  const onClick = () => {
    if (drag.current.suppressClick) {
      drag.current.suppressClick = false;
      return;
    }
    snapTo(!open); // tap, Enter or Space
  };

  return (
    <div ref={stageRef} className={`sheet-stage ${open ? "is-open" : ""} ${className}`}>
      <div className="sheet-stage__page">{background}</div>
      <div className="sheet-stage__dim" onClick={() => snapTo(false)} aria-hidden="true" />
      <div className="sheet-stage__wipe" aria-hidden="true" />

      <div ref={sheetRef} className="sheet" role="region" aria-label="Details">
        <button
          className="sheet__handle"
          aria-expanded={open}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onClick={onClick}
        >
          <span className="sheet__grip" aria-hidden="true" />
          <span className="sheet__hint">{hint}</span>
          <span className="sheet__title">{title}</span>
        </button>
        {/* Normal scrolling area: only the handle drags, so the content can still scroll. */}
        <div ref={bodyRef} className="sheet__body">
          {children}
        </div>
      </div>
    </div>
  );
}
