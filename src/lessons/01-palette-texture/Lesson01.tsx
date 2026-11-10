import "./lesson01.css";

const swatches = [
  { name: "--p5-red", note: "Primary. Selection, danger, energy." },
  { name: "--p5-red-dark", note: "Shadow red for stripes and depth." },
  { name: "--p5-black", note: "Base. Most of the screen." },
  { name: "--p5-white", note: "Text and paper-cutout outlines." },
];

export default function Lesson01() {
  return (
    <div className="l01">
      <h3 className="l01__h">1. The palette (CSS variables)</h3>
      <div className="l01__swatches">
        {swatches.map((s) => (
          <figure key={s.name} className="l01__swatch">
            <div className="l01__chip" style={{ background: `var(${s.name})` }} />
            <figcaption>
              <code>{s.name}</code>
              <span>{s.note}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <h3 className="l01__h">2. Three textures, all pure CSS (no images)</h3>
      <div className="l01__tiles">
        <div className="l01__tile">
          <div className="l01__sample starburst" />
          <p>
            <strong>Starburst</strong>: <code>repeating-conic-gradient</code> slices a
            circle into alternating red wedges.
          </p>
        </div>
        <div className="l01__tile">
          <div className="l01__sample l01__sample--white halftone" />
          <p>
            <strong>Halftone</strong>: one <code>radial-gradient</code> dot, tiled with{" "}
            <code>background-size</code>.
          </p>
        </div>
        <div className="l01__tile">
          <div className="l01__sample l01__sample--stack starburst">
            <div className="l01__overlay halftone" />
          </div>
          <p>
            <strong>Stacked</strong>: halftone layered over starburst with{" "}
            <code>mix-blend-mode: multiply</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
