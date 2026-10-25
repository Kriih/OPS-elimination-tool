import { ANIMAL_NAMES, animalOf, stackOf } from "./typeCode";

// Function-stack "molecule" for the Reading tab (como-se-lee.md 4.3):
//
//   1st Savior ──(1st animal)── 2nd Savior
//       │ 90                        │ 60
//       │ 10                        │ 40
//   4th Demon                   3rd Demon
//
// The top bond is the Savior pair (it forms the 1st animal); the two
// vertical bonds are the axes of opposites, with the share of attention
// between their ends: 90/10 at the poles (1st-4th), 60/40 in the middle
// (2nd-3rd).
//
// Node color is the function letter (--fn-n/s/t/f, an approved exception to
// the red-only palette). Attitude is the shape: introverted = solid disc,
// extraverted = ring. Savior vs Demon is size and opacity.

const FN_CLASS = { N: "fn-n", S: "fn-s", T: "fn-t", F: "fn-f" };
const ROLE_LABELS = ["1ª Savior", "2ª Savior", "3ª Demon", "4ª Demon"];

const LEFT_X = 110;
const RIGHT_X = 250;
const TOP_Y = 58;
const BOTTOM_Y = 172;
const SAVIOR_R = 25;
const DEMON_R = 19;

// Stack index -> position: Saviors on top, each above its own opposite.
const POSITIONS = [
  { x: LEFT_X, y: TOP_Y, side: "left" },
  { x: RIGHT_X, y: TOP_Y, side: "right" },
  { x: RIGHT_X, y: BOTTOM_Y, side: "right" },
  { x: LEFT_X, y: BOTTOM_Y, side: "left" },
];

function radiusOf(i) {
  return i < 2 ? SAVIOR_R : DEMON_R;
}

function Node({ fn, index }) {
  const { x, y, side } = POSITIONS[index];
  const r = radiusOf(index);
  const introverted = fn[1] === "i";
  const labelX = side === "left" ? x - r - 10 : x + r + 10;
  return (
    <g className={`molecule-node ${FN_CLASS[fn[0]]} ${index < 2 ? "savior" : "demon"}`}>
      <circle
        cx={x}
        cy={y}
        r={introverted ? r : r - 3}
        className={introverted ? "molecule-disc" : "molecule-ring"}
      />
      <text x={x} y={y + 4} textAnchor="middle" className={introverted ? "molecule-fn on-disc" : "molecule-fn"}>
        {fn}
      </text>
      <text x={labelX} y={y + 3} textAnchor={side === "left" ? "end" : "start"} className="molecule-role">
        {ROLE_LABELS[index]}
      </text>
    </g>
  );
}

function Axis({ x, top, bottom }) {
  // Proportion labels sit on the inner side of each vertical bond.
  const inward = x === LEFT_X ? 8 : -8;
  const anchor = x === LEFT_X ? "start" : "end";
  const y1 = TOP_Y + SAVIOR_R + 4;
  const y2 = BOTTOM_Y - DEMON_R - 4;
  return (
    <g className="molecule-axis">
      <line x1={x} y1={y1} x2={x} y2={y2} className="molecule-axis-line" />
      <text x={x + inward} y={y1 + 12} textAnchor={anchor} className="molecule-share">
        {top}%
      </text>
      <text x={x + inward} y={y2 - 4} textAnchor={anchor} className="molecule-share">
        {bottom}%
      </text>
    </g>
  );
}

export default function Molecule({ pair }) {
  const stack = stackOf(pair);
  const [a, b] = stack;
  const observer = "NS".includes(a[0]) ? a : b;
  const decider = observer === a ? b : a;
  const animal = animalOf(observer, decider);

  return (
    <div className="molecule">
      <svg
        className="molecule-svg"
        viewBox="0 0 360 214"
        role="img"
        aria-label={`Molécula de ${pair}: ${stack.join(", ")}`}
      >
        <line
          x1={LEFT_X + SAVIOR_R + 4}
          y1={TOP_Y}
          x2={RIGHT_X - SAVIOR_R - 4}
          y2={TOP_Y}
          className="molecule-bond"
        />
        <text x={(LEFT_X + RIGHT_X) / 2} y={TOP_Y - 8} textAnchor="middle" className="molecule-bond-label">
          {ANIMAL_NAMES[animal]} ({animal})
        </text>

        <Axis x={LEFT_X} top={90} bottom={10} />
        <Axis x={RIGHT_X} top={60} bottom={40} />

        {stack.map((fn, i) => (
          <Node key={fn} fn={fn} index={i} />
        ))}

        <text x={180} y={206} textAnchor="middle" className="molecule-legend">
          relleno = introvertida · anillo = extravertida · tenue = Demon
        </text>
      </svg>
    </div>
  );
}
