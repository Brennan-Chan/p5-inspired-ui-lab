import { useEffect, useState } from "react";
import { lessons } from "./lessons";

/** Reads "#/03" from the URL so a refresh keeps you on the same lesson. */
function lessonFromHash(): string {
  const id = window.location.hash.replace("#/", "");
  return lessons.some((l) => l.id === id) ? id : lessons[0]?.id ?? "";
}

export default function App() {
  const [currentId, setCurrentId] = useState(lessonFromHash);

  // Keep state and URL in sync (back/forward buttons work too).
  useEffect(() => {
    const onHash = () => setCurrentId(lessonFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const lesson = lessons.find((l) => l.id === currentId);

  return (
    <div className="app">
      <aside className="sidebar">
        <h1 className="sidebar__title">
          UI <span>Lab</span>
        </h1>
        <nav>
          <ol className="sidebar__list">
            {lessons.map((l) => (
              <li key={l.id}>
                <a
                  href={`#/${l.id}`}
                  className={l.id === currentId ? "is-active" : undefined}
                  aria-current={l.id === currentId ? "page" : undefined}
                >
                  <span className="sidebar__num">{l.id}</span>
                  {l.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <p className="sidebar__foot">
          Fan-inspired study. No game assets used.
        </p>
      </aside>

      <main className="lesson">
        {lesson ? (
          <>
            <header className="lesson__header">
              <p className="lesson__eyebrow">Lesson {lesson.id}</p>
              <h2 className="lesson__title">{lesson.title}</h2>
              <p className="lesson__summary">{lesson.summary}</p>
              <p className="lesson__readme">
                Full walkthrough: <code>src/lessons/{lesson.folder}/README.md</code>
              </p>
            </header>
            <section className="lesson__demo">
              <lesson.Component />
            </section>
          </>
        ) : (
          <p>No lessons yet. Check out a later git tag (see README).</p>
        )}
      </main>
    </div>
  );
}
