import { useEffect, useRef, useState } from "react";
import RansomText from "../03-ransom-text/RansomText";
import JaggedPanel from "../02-jagged-panels/JaggedPanel";
import StampMenu from "../05-stamp-menu/StampMenu";
import WipeTransition from "../06-wipe-transition/WipeTransition";
import "../07-jitter-a11y/motion-safety.css";
import "../07-jitter-a11y/stop-motion.css";
import "./pause-menu.css";

export interface Section {
  id: string;
  label: string;
  title: string;
  body: string;
}

/** Placeholder content. Swap in your real sections. */
export const defaultSections: Section[] = [
  { id: "about", label: "About", title: "About me", body: "Who you are in two sentences." },
  { id: "projects", label: "Projects", title: "Projects", body: "Your best three projects, each one line." },
  { id: "experience", label: "Experience", title: "Experience", body: "Roles, places and dates." },
  { id: "skills", label: "Skills", title: "Skills", body: "Languages, tools and frameworks." },
  { id: "contact", label: "Contact", title: "Contact", body: "Email, LinkedIn, GitHub." },
];

export default function PauseMenu({ sections = defaultSections }: { sections?: Section[] }) {
  const [open, setOpen] = useState(false);
  const [openCount, setOpenCount] = useState(0); // remount key: replays entrance animations
  const [selected, setSelected] = useState(0);
  const [confirmed, setConfirmed] = useState(0); // remount key for the "confirm" stamp
  const stageRef = useRef<HTMLDivElement>(null);

  // A ref mirrors `open` so the window listener below (created once) always sees the current value.
  const openRef = useRef(open);
  openRef.current = open;

  const toggle = () => {
    if (!openRef.current) setOpenCount((n) => n + 1);
    setOpen(!openRef.current);
  };

  // Esc opens/closes the menu, like a game's pause button.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // When the menu opens, put keyboard focus on the selected item so arrows work immediately.
  useEffect(() => {
    if (open) {
      stageRef.current?.querySelector<HTMLButtonElement>('.stamp-menu__btn[tabindex="0"]')?.focus();
    }
  }, [open, openCount]);

  const section = sections[selected];

  return (
    <div className="pause" ref={stageRef}>
      {!open ? (
        <div className="pause__scene">
          <p>The "game" is running.</p>
          <button className="btn" onClick={toggle}>
            Pause (Esc)
          </button>
        </div>
      ) : (
        <div className="pause__menu" key={openCount}>
          {/* Layer 1: background */}
          <div className="pause__burst starburst spin-slow" aria-hidden="true" />
          <div className="pause__dots halftone" aria-hidden="true" />
          <div className="pause__slab" aria-hidden="true" />

          {/* Layer 2: title + menu */}
          <div className="pause__left">
            <span className="pause__title boil">
              <RansomText text="Menu" seed={9} size={84} />
            </span>
            <StampMenu
              items={sections.map((s) => s.label)}
              selected={selected}
              onSelect={setSelected}
              onConfirm={() => setConfirmed((c) => c + 1)}
              animateIn
              label="Pause menu"
            />
          </div>

          {/* Layer 3: content panel that wipes on every selection change */}
          <WipeTransition pageKey={section.id} className="pause__right">
            <div className="pause__panel">
              <JaggedPanel tilt={-3} skew={-6} tone="white">
                <h3 className="pause__panelTitle">{section.title}</h3>
                <p className="pause__panelBody">{section.body}</p>
              </JaggedPanel>
              {confirmed > 0 && (
                <span key={confirmed} className="pause__stamp" aria-live="polite">
                  Selected!
                </span>
              )}
            </div>
          </WipeTransition>

          {/* Layer 4: button hints */}
          <ul className="pause__hints" aria-hidden="true">
            <li>
              <kbd>↑↓</kbd> Select
            </li>
            <li>
              <kbd>Enter</kbd> Confirm
            </li>
            <li>
              <kbd>Esc</kbd> Close
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
