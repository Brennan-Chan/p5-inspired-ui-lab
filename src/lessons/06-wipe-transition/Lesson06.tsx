import { useState, type CSSProperties } from "react";
import WipeTransition, { type WipePhase } from "./WipeTransition";
import JaggedPanel from "../02-jagged-panels/JaggedPanel";
import "./lesson06.css";

const pages = [
  { id: "about", title: "About", body: "A short intro paragraph would go here." },
  { id: "projects", title: "Projects", body: "Cards for each project would go here." },
  { id: "contact", title: "Contact", body: "Email, LinkedIn and GitHub links would go here." },
];

export default function Lesson06() {
  const [page, setPage] = useState(pages[0].id);
  const [phase, setPhase] = useState<WipePhase>("idle");
  const [slow, setSlow] = useState(false);
  const current = pages.find((p) => p.id === page)!;

  return (
    <div className="l06" style={{ "--slowmo": slow ? 5 : 1 } as CSSProperties}>
      <div className="controls">
        {pages.map((p) => (
          <button key={p.id} className="btn" aria-pressed={p.id === page} onClick={() => setPage(p.id)}>
            {p.title}
          </button>
        ))}
        <label className="l06__check">
          <input type="checkbox" checked={slow} onChange={(e) => setSlow(e.target.checked)} />
          Slow motion (5x)
        </label>
        <code className={`l06__phase l06__phase--${phase}`}>phase: {phase}</code>
      </div>

      <WipeTransition pageKey={page} onPhaseChange={setPhase} className="l06__stage halftone">
        <div className="l06__page">
          <JaggedPanel tilt={-2} tone="white">
            <h3 className="l06__title">{current.title}</h3>
            <p className="l06__body">{current.body}</p>
          </JaggedPanel>
        </div>
      </WipeTransition>

      <p className="note">
        Turn on slow motion and click between pages. Watch the phase label: <code>cover</code> → content
        swaps → <code>reveal</code> → <code>idle</code>. Try clicking quickly; the component always lands
        on the last page you picked.
      </p>
    </div>
  );
}
