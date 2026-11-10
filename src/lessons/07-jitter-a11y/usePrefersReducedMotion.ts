import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * True when the user has asked their OS for less motion.
 * CSS handles most cases (see motion-safety.css); use this hook when the
 * motion is driven by JavaScript (canvas, react-spring, scroll effects...).
 */
export default function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => window.matchMedia(QUERY).matches);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange); // updates live if the setting is toggled
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
