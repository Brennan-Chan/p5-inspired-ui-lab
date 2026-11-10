import { useRef, type CSSProperties, type KeyboardEvent } from "react";
import "../04-slam-in/slam.css";
import "./stamp-menu.css";

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
}: StampMenuProps) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

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
      <ul className="stamp-menu" onKeyDown={onKeyDown}>
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
