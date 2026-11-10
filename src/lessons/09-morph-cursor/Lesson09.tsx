import { useState } from "react";
import StampMenu from "../05-stamp-menu/StampMenu";
import MorphCursor from "./MorphCursor";
import "./lesson09.css";

const items = ["About", "Projects", "Experience", "Skills", "Contact"];

export default function Lesson09() {
  const [selected, setSelected] = useState(0);
  const [speed, setSpeed] = useState(120);
  const [blend, setBlend] = useState(true);

  return (
    <div className="l09">
      <div className="controls">
        <label className="l09__field">
          Morph every {speed}ms
          <input type="range" min={60} max={500} step={10} value={speed} onChange={(e) => setSpeed(+e.target.value)} />
        </label>
        <label className="l09__check">
          <input type="checkbox" checked={blend} onChange={(e) => setBlend(e.target.checked)} />
          mix-blend-mode: screen
        </label>
      </div>

      <div className="l09__stage halftone">
        <StampMenu
          items={items}
          selected={selected}
          onSelect={setSelected}
          label="Morph cursor demo"
          renderCursor={(box) => <MorphCursor box={box} speed={speed} blend={blend} />}
        />
      </div>

      <p className="note">
        Hover or use <kbd>↑</kbd> <kbd>↓</kbd>. Three animations run at once: the cursor <em>glides</em> to the
        selected item, its two layers <em>morph</em> every {speed}ms, and the selected label <em>jitters</em>.
        Untick the blend box to see the red and cyan layers as they really are.
      </p>
    </div>
  );
}
