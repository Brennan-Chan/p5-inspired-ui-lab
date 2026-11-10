import PauseMenu from "./PauseMenu";

export default function Lesson08() {
  return (
    <div>
      <PauseMenu />
      <p className="note">
        Press <kbd>Esc</kbd> (or the button) to pause. Everything here is built from the pieces in Lessons
        01–07; open <code>PauseMenu.tsx</code> and you'll recognize every import.
      </p>
    </div>
  );
}
