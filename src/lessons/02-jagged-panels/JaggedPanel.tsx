import type { CSSProperties, ReactNode } from "react";
import "./jagged-panel.css";

export interface JaggedPanelProps {
  children: ReactNode;
  /** Whole-panel rotation in degrees. */
  tilt?: number;
  /** Horizontal skew of the shape in degrees (text is counter-skewed so it stays readable). */
  skew?: number;
  /** How far (in %) the corners are pushed inward. 0 = a normal rectangle. */
  chaos?: number;
  tone?: "black" | "white" | "red";
  className?: string;
}

/**
 * Builds a 4-corner clip-path where each corner is nudged inward a little.
 * Fixed multipliers (not Math.random) so the shape doesn't change on every render.
 */
export function jaggedPolygon(chaos: number): string {
  const c = chaos;
  return `polygon(${c * 0.6}% ${c}%, 100% 0%, ${100 - c * 0.8}% ${100 - c * 0.5}%, 0% 100%)`;
}

/**
 * A reusable "paper cutout" panel:
 *   outer div  -> rotation + drop-shadow outline (filters see the clipped shape)
 *   shape div  -> clip-path + skew
 *   content    -> counter-skew so text isn't slanted
 */
export default function JaggedPanel({
  children,
  tilt = -2,
  skew = -6,
  chaos = 4,
  tone = "black",
  className = "",
}: JaggedPanelProps) {
  const style = {
    "--tilt": `${tilt}deg`,
    "--skew": `${skew}deg`,
    "--clip": jaggedPolygon(chaos),
  } as CSSProperties;

  return (
    <div className={`jagged jagged--${tone} ${className}`} style={style}>
      <div className="jagged__shape">
        <div className="jagged__content">{children}</div>
      </div>
    </div>
  );
}
