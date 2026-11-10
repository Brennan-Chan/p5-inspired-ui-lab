import { useState, type CSSProperties } from "react";
import "./slam.css";
import "./lesson04.css";

const curves = [
  { name: "linear", value: "linear", note: "Constant speed. Feels robotic." },
  { name: "ease", value: "ease", note: "Browser default. Smooth, but soft." },
  { name: "--ease-snap", value: "var(--ease-snap)", note: "Slow start, fast finish. Punchy." },
  { name: "--ease-slam", value: "var(--ease-slam)", note: "Overshoots then settles. The P5 feel." },
];

const items = ["About", "Projects", "Experience", "Skills", "Contact"];

export default function Lesson04() {
  // Changing a React `key` throws away the old elements and mounts new ones,
  // which restarts their CSS animations. That's the whole "replay" trick.
  const [run, setRun] = useState(0);
  const [slow, setSlow] = useState(false);

  const rootStyle = { "--slowmo": slow ? 5 : 1 } as CSSProperties;

  return (
    <div className="l04" style={rootStyle}>
      <div className="controls">
        <button className="btn" onClick={() => setRun((r) => r + 1)}>
          Replay
        </button>
        <label className="l04__check">
          <input type="checkbox" checked={slow} onChange={(e) => setSlow(e.target.checked)} />
          Slow motion (5x)
        </label>
      </div>

      <h3 className="l04__h">1. Easing race: same distance, same duration</h3>
      <div className="l04__race" key={`race-${run}`}>
        {curves.map((c) => (
          <div className="l04__lane" key={c.name}>
            <code className="l04__label">{c.name}</code>
            <div className="l04__track">
              <div className="l04__runner" style={{ "--curve": c.value } as CSSProperties} />
            </div>
            <span className="l04__note">{c.note}</span>
          </div>
        ))}
      </div>

      <h3 className="l04__h">2. Staggered slam-in</h3>
      <ul className="l04__list" key={`list-${run}`}>
        {items.map((label, i) => (
          <li key={label} className="l04__item slam-in" style={{ "--i": i } as CSSProperties}>
            {label}
          </li>
        ))}
      </ul>
      <p className="note">
        Each item has the same animation; only <code>--i</code> differs, which pushes its{" "}
        <code>animation-delay</code> back by 55ms × i.
      </p>
    </div>
  );
}
