import { TOTEMS_ORDERED } from "./typeGrid";

// Bell-curve chart (Emoji and Reading tabs): places each of the 16 totems
// along a normal distribution using their own score (-7..+7) as the x
// position. "-0" and "+0" share the numeric value 0, so they're nudged to
// -0.5/+0.5 to keep their markers from overlapping at the curve's peak.
const CURVE_WIDTH = 600;
const CURVE_HEIGHT = 220;
const CURVE_PAD_X = 32;
const CURVE_TOP = 34;
const CURVE_BASELINE = 172;
const CURVE_SIGMA = 4;

export function totemScoreX(score) {
  if (score === "-0") return -0.5;
  if (score === "+0") return 0.5;
  return parseInt(score, 10);
}

function gaussian(x) {
  return Math.exp(-(x * x) / (2 * CURVE_SIGMA * CURVE_SIGMA));
}

function curveScaleX(x) {
  return CURVE_PAD_X + ((x + 7.5) / 15) * (CURVE_WIDTH - 2 * CURVE_PAD_X);
}

function curveScaleY(v) {
  return CURVE_BASELINE - v * (CURVE_BASELINE - CURVE_TOP);
}

const CURVE_LINE_D = (() => {
  const points = [];
  for (let x = -7.5; x <= 7.5 + 1e-9; x += 0.25) {
    points.push(`${curveScaleX(x)},${curveScaleY(gaussian(x))}`);
  }
  return `M${points.join(" L")}`;
})();

const CURVE_AREA_D = `${CURVE_LINE_D} L${curveScaleX(7.5)},${CURVE_BASELINE} L${curveScaleX(-7.5)},${CURVE_BASELINE} Z`;

// `selected`: headers to highlight. `showRange`: with more than one selected,
// shade the band between the lowest and highest of them. `dimOthers`: fade
// the totems that aren't selected.
export default function TotemCurve({ selected = [], showRange = false, dimOthers = false, caption }) {
  const selectedSet = new Set(selected);
  const selectedXs = TOTEMS_ORDERED.filter((t) => selectedSet.has(t.header)).map((t) =>
    curveScaleX(totemScoreX(t.score))
  );
  const band =
    showRange && selectedXs.length > 1
      ? { x1: Math.min(...selectedXs) - 14, x2: Math.max(...selectedXs) + 14 }
      : null;

  return (
    <div className="totem-curve">
      {caption && <div className="totem-curve-caption">{caption}</div>}
      <svg
        className="totem-curve-svg"
        viewBox={`0 0 ${CURVE_WIDTH} ${CURVE_HEIGHT}`}
        role="img"
        aria-label="Animales distribuidos según su puntaje en una curva normal"
      >
        {band && (
          <rect
            x={band.x1}
            y={CURVE_TOP - 18}
            width={band.x2 - band.x1}
            height={CURVE_BASELINE - CURVE_TOP + 18}
            rx={8}
            className="curve-range"
          />
        )}
        <line
          x1={CURVE_PAD_X}
          y1={CURVE_BASELINE}
          x2={CURVE_WIDTH - CURVE_PAD_X}
          y2={CURVE_BASELINE}
          className="curve-axis"
        />
        <path d={CURVE_AREA_D} className="curve-area" />
        <path d={CURVE_LINE_D} className="curve-line" />
        {TOTEMS_ORDERED.map((t) => {
          const x = curveScaleX(totemScoreX(t.score));
          const y = curveScaleY(gaussian(totemScoreX(t.score)));
          const isSelected = selectedSet.has(t.header);
          const state = isSelected ? "selected" : dimOthers ? "dim" : "";
          return (
            <g key={t.header} className={`curve-point ${state}`}>
              <line x1={x} y1={y} x2={x} y2={CURVE_BASELINE} className="curve-stem" />
              <circle cx={x} cy={y} r={isSelected ? 13 : 10} className="curve-marker" />
              <text x={x} y={y + 4} textAnchor="middle" className="curve-emoji">
                {t.emoji}
              </text>
              <text x={x} y={CURVE_BASELINE + 16} textAnchor="middle" className="curve-score">
                {t.score}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
