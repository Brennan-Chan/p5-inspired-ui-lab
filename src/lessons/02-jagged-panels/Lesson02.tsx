import { useState } from "react";
import JaggedPanel, { jaggedPolygon } from "./JaggedPanel";
import "./lesson02.css";

export default function Lesson02() {
  const [tilt, setTilt] = useState(-3);
  const [skew, setSkew] = useState(-8);
  const [chaos, setChaos] = useState(5);
  const [tone, setTone] = useState<"black" | "white" | "red">("black");

  return (
    <div className="l02">
      <h3 className="l02__h">Build-up: rectangle → cutout</h3>
      <div className="l02__steps">
        <div>
          <div className="l02__plain">Plain box</div>
          <p className="note">A normal div with a border.</p>
        </div>
        <div>
          <div className="l02__plain l02__plain--clipped">Clipped</div>
          <p className="note">
            + <code>clip-path: polygon()</code>. Note the border got cut off too.
          </p>
        </div>
        <div>
          <JaggedPanel tilt={-3} skew={-8} chaos={5}>
            Cutout
          </JaggedPanel>
          <p className="note">+ skew, rotation, and an outline drawn by the parent's drop-shadow.</p>
        </div>
      </div>

      <h3 className="l02__h">Playground</h3>
      <div className="controls">
        <label>
          Tilt {tilt}°
          <input type="range" min={-15} max={15} value={tilt} onChange={(e) => setTilt(+e.target.value)} />
        </label>
        <label>
          Skew {skew}°
          <input type="range" min={-25} max={25} value={skew} onChange={(e) => setSkew(+e.target.value)} />
        </label>
        <label>
          Chaos {chaos}%
          <input type="range" min={0} max={14} value={chaos} onChange={(e) => setChaos(+e.target.value)} />
        </label>
        {(["black", "white", "red"] as const).map((t) => (
          <button key={t} className="btn" onClick={() => setTone(t)} aria-pressed={tone === t}>
            {t}
          </button>
        ))}
      </div>

      <div className="l02__stage">
        <JaggedPanel tilt={tilt} skew={skew} chaos={chaos} tone={tone}>
          <h4 className="l02__panelTitle">Projects</h4>
          <p>Text inside stays upright because the content div counter-skews.</p>
        </JaggedPanel>
      </div>

      <pre className="l02__code">
        {`transform: rotate(${tilt}deg);           /* outer */
transform: skewX(${skew}deg);            /* shape */
clip-path: ${jaggedPolygon(chaos)};
transform: skewX(${-skew}deg);           /* content (counter-skew) */`}
      </pre>
    </div>
  );
}
