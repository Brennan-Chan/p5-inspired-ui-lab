import { useEffect, useRef, useState, type AnimationEvent, type ReactNode } from "react";
import "./wipe-transition.css";

export type WipePhase = "idle" | "cover" | "reveal";

export interface WipeTransitionProps {
  /** Change this value to trigger a transition (e.g. the current page id). */
  pageKey: string | number;
  children: ReactNode;
  /** Optional: lets a parent display the current phase (used by the demo). */
  onPhaseChange?: (phase: WipePhase) => void;
  className?: string;
}

/**
 * Swaps its children behind a red wedge:
 *   1. cover  - wedge slides IN over the old content
 *   2. (swap) - while fully covered, old content is replaced with the new
 *   3. reveal - wedge slides OUT, showing the new content
 * Each step starts when the previous CSS animation fires `animationend`.
 */
export default function WipeTransition({ pageKey, children, onPhaseChange, className = "" }: WipeTransitionProps) {
  const [phase, setPhaseState] = useState<WipePhase>("idle");
  // What's actually on screen. Lags behind `pageKey` until the wedge covers it.
  const [shown, setShown] = useState({ key: pageKey, node: children });

  // Always holds the newest requested page, even if it changes mid-transition.
  const latest = useRef({ key: pageKey, node: children });
  latest.current = { key: pageKey, node: children };

  const setPhase = (p: WipePhase) => {
    setPhaseState(p);
    onPhaseChange?.(p);
  };

  // A new page was requested -> start covering. If a wipe is already running,
  // do nothing: onAnimationEnd checks `latest` and catches up when it finishes.
  useEffect(() => {
    if (pageKey !== shown.key && phase === "idle") setPhase("cover");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  const onAnimationEnd = (e: AnimationEvent) => {
    if (e.target !== e.currentTarget) return; // ignore events bubbling from children
    if (phase === "cover") {
      setShown(latest.current); // swap content while it's hidden
      setPhase("reveal");
    } else if (phase === "reveal") {
      // If the user picked yet another page during the reveal, go again.
      setPhase(latest.current.key !== shown.key ? "cover" : "idle");
    }
  };

  // When idle and up to date, render live children so they can re-render normally.
  const content = phase === "idle" && pageKey === shown.key ? children : shown.node;

  return (
    <div className={`wipe-stage ${className}`}>
      {/* key = page id, so React remounts the content on swap and its pop-in animation replays */}
      <div className="wipe-stage__content" key={String(shown.key)}>
        {content}
      </div>
      {phase !== "idle" && (
        <div className={`wipe wipe--${phase}`} onAnimationEnd={onAnimationEnd} aria-hidden="true">
          <span className="wipe__black" />
          <span className="wipe__red" />
        </div>
      )}
    </div>
  );
}
