import { useState } from "react";
import RansomText from "./RansomText";
import "./lesson03.css";

export default function Lesson03() {
  const [text, setText] = useState("Press start");
  const [seed, setSeed] = useState(7);
  const [size, setSize] = useState(56);

  return (
    <div className="l03">
      <div className="controls">
        <label className="l03__field">
          Text
          <input value={text} onChange={(e) => setText(e.target.value)} maxLength={40} />
        </label>
        <label className="l03__field">
          Size {size}px
          <input type="range" min={24} max={96} value={size} onChange={(e) => setSize(+e.target.value)} />
        </label>
        <button className="btn" onClick={() => setSeed((s) => s + 1)}>
          Reshuffle (seed {seed})
        </button>
      </div>

      <div className="l03__stage starburst">
        <div className="l03__dots halftone" />
        <RansomText text={text || " "} seed={seed} size={size} />
      </div>

      <p className="note">
        Type in the box: the letters you already typed keep their look because the random sequence is
        seeded. Hit reshuffle to change the seed. Inspect a letter in DevTools (F12) to see the CSS
        variables each <code>&lt;span&gt;</code> gets.
      </p>

      <h3 className="l03__h">Same component, different seeds</h3>
      <div className="l03__row">
        {[3, 11, 42].map((s) => (
          <div key={s} className="l03__mini">
            <RansomText text="Projects" seed={s} size={36} />
            <code>seed={s}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
