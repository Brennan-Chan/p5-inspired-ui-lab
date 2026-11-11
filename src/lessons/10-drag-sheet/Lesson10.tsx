import DragSheet from "./DragSheet";
import RansomText from "../03-ransom-text/RansomText";
import JaggedPanel from "../02-jagged-panels/JaggedPanel";
import "./lesson10.css";

export default function Lesson10() {
  return (
    <div className="l10">
      <div className="l10__layout">
        <DragSheet
          className="l10__phone"
          title="Project details"
          background={
            <div className="l10__page starburst">
              <div className="l10__dots halftone" />
              {/* Reads --p straight from CSS: no React state involved */}
              <div className="l10__meter" aria-hidden="true">
                <span className="l10__meterFill" />
                <code className="l10__meterLabel">--p</code>
              </div>
              <div className="l10__hero">
                <RansomText text="Projects" seed={5} size={46} />
                <JaggedPanel tilt={-3} tone="white">
                  <h3 className="l10__cardTitle">Project name</h3>
                  <p className="l10__cardText">One-line summary of what you built.</p>
                </JaggedPanel>
              </div>
            </div>
          }
        >
          <h4>What it is</h4>
          <p>A longer description lives down here, out of the way until someone asks for it.</p>
          <h4>Stack</h4>
          <p>React, TypeScript, CSS.</p>
          <h4>Links</h4>
          <p>
            <a href="#/10">Live demo</a> · <a href="#/10">Source</a>
          </p>
          <p className="l10__filler">
            This area scrolls on its own. Only the handle drags the sheet, so swiping here scrolls the text
            instead of fighting with the drag.
          </p>
        </DragSheet>

        <div className="l10__meter-wrap">
          <p className="note">
            The bar at the top of the phone shows <code>--p</code>, the drag progress from 0 (closed) to 1 (open).
            The wipe, the dimming and the hint/title fade all read that one number.
          </p>
          <p className="note">
            Drag the handle with your mouse (or finger, on a phone). Try a slow drag released halfway, then a
            fast flick. Tap or press <kbd>Enter</kbd> on the handle to toggle; <kbd>Esc</kbd> or tapping the dark
            area closes it.
          </p>
          <p className="note">
            The phone frame is just for the demo. On a real site the sheet would be <code>position: fixed</code>{" "}
            to the bottom of the screen.
          </p>
        </div>
      </div>
    </div>
  );
}
