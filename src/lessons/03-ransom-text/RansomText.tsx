import { useMemo, type CSSProperties } from "react";
import "./ransom-text.css";

/**
 * mulberry32: a tiny "seeded" random number generator.
 * Same seed in -> same sequence of numbers out, every time.
 * That's what keeps the letters from reshuffling on every React re-render.
 */
export function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296; // 0 <= n < 1
  };
}

const FONTS = [
  "var(--font-heavy)",
  "var(--font-block)",
  "var(--font-serif)",
  "var(--font-mono)",
  "var(--font-wide)",
  "var(--font-tall)",
];

const TONES = ["plain", "plain", "inverse", "boxed", "red"] as const;

export interface RansomTextProps {
  text: string;
  /** Change the seed to get a different (but stable) arrangement. */
  seed?: number;
  /** Base font size in px. */
  size?: number;
  className?: string;
}

export default function RansomText({ text, seed = 7, size = 48, className = "" }: RansomTextProps) {
  // useMemo: only recompute the letter styles when text or seed change.
  const letters = useMemo(() => {
    const rand = seededRandom(seed);
    const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];

    return Array.from(text).map((char, i) => {
      const isFirst = i === 0;
      const style = {
        "--font": pick(FONTS),
        "--scale": isFirst ? 1.35 : 0.8 + rand() * 0.4, // first letter is bigger
        "--rot": `${(rand() - 0.5) * 16}deg`, // -8° .. +8°
        "--lift": `${(rand() - 0.5) * 0.12}em`, // small vertical wobble
      } as CSSProperties;
      return { char, style, tone: isFirst ? "boxed" : pick(TONES) };
    });
  }, [text, seed]);

  return (
    // Screen readers read the clean label; the decorated letters are hidden from them.
    <span className={`ransom ${className}`} style={{ fontSize: size }} aria-label={text} role="img">
      {letters.map(({ char, style, tone }, i) =>
        char === " " ? (
          <span key={i} className="ransom__space" aria-hidden="true" />
        ) : (
          <span key={i} className={`ransom__char ransom__char--${tone}`} style={style} aria-hidden="true">
            {char}
          </span>
        ),
      )}
    </span>
  );
}
