import { useState } from "react";
import StampMenu from "./StampMenu";
import "./lesson05.css";

const items = ["About", "Projects", "Experience", "Skills", "Contact"];

export default function Lesson05() {
  const [selected, setSelected] = useState(0);
  const [confirmed, setConfirmed] = useState<{ index: number; n: number } | null>(null);

  return (
    <div className="l05">
      <div className="l05__stage halftone">
        <StampMenu
          items={items}
          selected={selected}
          onSelect={setSelected}
          onConfirm={(i) => setConfirmed((c) => ({ index: i, n: (c?.n ?? 0) + 1 }))}
          label="Demo menu"
        />

        <div className="l05__readout">
          <p>
            <span>selected</span> {selected} ({items[selected]})
          </p>
          {confirmed && (
            // key forces a remount so the flash animation replays on every confirm
            <p key={confirmed.n} className="l05__flash">
              <span>confirmed</span> {items[confirmed.index]}
            </p>
          )}
        </div>
      </div>

      <p className="note">
        Click the menu (or press Tab to reach it), then use <kbd>↑</kbd> <kbd>↓</kbd>, <kbd>Home</kbd>,{" "}
        <kbd>End</kbd> and <kbd>Enter</kbd>. Mouse hover also moves the selection. The red stamp is a{" "}
        <code>::before</code> pseudo-element that scales from 0 to 1.
      </p>
    </div>
  );
}
