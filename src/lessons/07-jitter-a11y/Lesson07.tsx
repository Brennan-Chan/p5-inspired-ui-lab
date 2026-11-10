import { useState } from "react";
import RansomText from "../03-ransom-text/RansomText";
import usePrefersReducedMotion from "./usePrefersReducedMotion";
import "./motion-safety.css";
import "./stop-motion.css";
import "./lesson07.css";

export default function Lesson07() {
  const osReduced = usePrefersReducedMotion();
  const [simulate, setSimulate] = useState(false);

  return (
    <div className="l07">
      <h3 className="l07__h">1. Stop-motion "boil": steps() vs smooth</h3>
      <div className="l07__pair">
        <div className="l07__cell">
          <span className="boil">
            <RansomText text="Stepped" seed={4} size={44} />
          </span>
          <code>steps(1, end)</code>
        </div>
        <div className="l07__cell">
          <span className="boil boil--smooth">
            <RansomText text="Smooth" seed={4} size={44} />
          </span>
          <code>ease-in-out</code>
        </div>
      </div>
      <p className="note">
        Same two keyframes. The stepped one jumps between them like animation drawn on paper; the smooth
        one just looks seasick.
      </p>

      <h3 className="l07__h">2. Respecting "reduce motion"</h3>
      <div className="controls">
        <label className="l07__check">
          <input type="checkbox" checked={simulate} onChange={(e) => setSimulate(e.target.checked)} />
          Simulate reduced motion
        </label>
        <code>OS setting detected: {osReduced ? "reduce" : "no preference"}</code>
      </div>

      <div className={`l07__stage ${simulate ? "reduce-motion" : ""}`}>
        <div className="l07__burst starburst spin-slow" />
        <div className="l07__dots halftone" />
        <span className="boil l07__title">
          <RansomText text="Pause" seed={21} size={72} />
        </span>
      </div>
      <p className="note">
        Spinning backgrounds and constant jitter can make some people dizzy or nauseous. With reduced
        motion on, everything still <em>arrives</em> in its final state, it just doesn't keep moving.
      </p>
    </div>
  );
}
