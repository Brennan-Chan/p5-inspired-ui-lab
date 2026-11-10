import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import "../04-slam-in/slam.css";
import "./stamp-menu.css";

/** Where the selected item sits inside the menu (px, relative to the <ul>). Used by Lesson 09's cursor. */
export interface CursorBox {
  x: number;
  y: number;
  w: number;
  h: number;
  tilt: number;
}

export interface StampMenuProps {
  items: string[];
  /** Index of the highlighted item. The parent owns this state. */
  selected: number;
  onSelect: (index: number) => void;
  /** Fired on Enter / Space / click. */
  onConfirm?: (index: number) => void;
  /** Play the Lesson 04 slam-in when the menu first appears. */
  animateIn?: boolean;
  /** Accessible name for the menu, e.g. "Main menu". */
  label?: string;
  /**
   * Lesson 09: instead of a stamp behind each item, render ONE shared cursor that
   * slides to whichever item is selected. Receives the selected item's position.
   */
  renderCursor?: (box: CursorBox | null) => ReactNode;
}

// Fixed tilt + indent per row: a hand-placed look that never changes between renders.
const TILTS = [-4, 2, -2, 4, -3, 1, -1, 3];
const INDENTS = [0, 26, 10, 38, 18, 44, 8, 30];

/**
 * A vertical menu where the selected item gets a red "stamp" slammed behind it.
 * "Controlled" component: it doesn't store which item is selected; the parent
 * passes `selected` in and is told about changes through `onSelect`.
 */
export default function StampMenu({
  items,
  selected,
  onSelect,
  onConfirm,
  animateIn = false,
  label = "Menu",
  renderCursor,
}: StampMenuProps) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLUListElement>(null);
  const [box, setBox] = useState<CursorBox | null>(null);

  // Lesson 09: measure the selected button so a shared cursor can move to it.
  // useLayoutEffect runs after the DOM updates but before the browser paints,
  // so the cursor never shows a frame in the wrong place.
  const wantsCursor = Boolean(renderCursor);
  useLayoutEffect(() => {
    if (!wantsCursor) return;
    const measure = () => {
      const btn = buttons.current[selected];
      const list = listRef.current;
      if (!btn || !list) return;
      // offsetLeft/Top are measured from the nearest "offsetParent". Any element
      // with a transform (like a row mid slam-in) becomes one, so add up offsets
      // until we reach the <ul>. Unlike getBoundingClientRect, this ignores
      // rotations/skews, which is what we want for a stable cursor position.
      let x = 0;
      let y = 0;
      let el: HTMLElement | null = btn;
      while (el && el !== list) {
        x += el.offsetLeft;
        y += el.offsetTop;
        el = el.offsetParent as HTMLElement | null;
      }
      setBox({
        x,
        y,
        w: btn.offsetWidth,
        h: btn.offsetHeight,
        tilt: TILTS[selected % TILTS.length],
      });
    };
    measure();
    // Re-measure when the layout changes size or the web fonts finish loading.
    const ro = new ResizeObserver(measure);
    if (listRef.current) ro.observe(listRef.current);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [selected, items.length, wantsCursor]);

  const move = (to: number) => {
    const next = (to + items.length) % items.length; // wrap around top/bottom
    onSelect(next);
    buttons.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const keys: Record<string, () => void> = {
      ArrowDown: () => move(selected + 1),
      ArrowUp: () => move(selected - 1),
      Home: () => move(0),
      End: () => move(items.length - 1),
    };
    if (keys[e.key]) {
      e.preventDefault(); // stop the page from scrolling
      keys[e.key]();
    }
  };

  return (
    <nav aria-label={label}>
      <ul ref={listRef} className={`stamp-menu ${renderCursor ? "has-cursor" : ""}`} onKeyDown={onKeyDown}>
        {renderCursor?.(box)}
        {items.map((item, i) => {
          const isSelected = i === selected;
          const style = {
            "--i": i,
            "--tilt": `${TILTS[i % TILTS.length]}deg`,
            "--indent": `${INDENTS[i % INDENTS.length]}px`,
          } as CSSProperties;

          return (
            <li
              key={item}
              style={style}
              className={`stamp-menu__row ${animateIn ? "slam-in" : ""} ${isSelected ? "is-selected" : ""}`}
            >
              <button
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                className="stamp-menu__btn"
                // Only the selected item is in the Tab order ("roving tabindex"):
                // Tab enters/leaves the menu, arrow keys move inside it.
                tabIndex={isSelected ? 0 : -1}
                aria-current={isSelected ? "true" : undefined}
                onMouseEnter={() => onSelect(i)}
                onFocus={() => onSelect(i)}
                onClick={() => onConfirm?.(i)}
              >
                <span className="stamp-menu__label">{item}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
