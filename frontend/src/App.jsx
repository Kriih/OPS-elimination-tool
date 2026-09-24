import { useState } from "react";
import {
  GRID_HEADERS,
  GRID_ROWS,
  GRID_LEGEND,
  FADE_RULES,
  TOTEMS,
  TOTEMS_ORDERED,
  isIntrovertHeader,
  formatHeaderCode,
  mbtiTypeFromCell,
  parsePastedCode,
  selectionsFromCell,
} from "./typeGrid";
import { CHECKLIST_SECTIONS, checklistItemChecked, findChecklistItem } from "./checklistData";

const NAV_TABS = ["Checklist", "Traits", "Interpretation", "Emoji"];

const PAIRS = [
  {
    left: "O",
    right: "D",
    time: "5m",
    leftDesc: "Stuck on info & pathways, not stuck on others point of view",
    rightDesc: "Stuck on people, judgment, fairness, not stuck on missing info",
  },
  {
    left: "Di",
    right: "De",
    time: "5m",
    leftDesc: "Me-story, what I want, I'm allowed, leaves the tribe behind",
    rightDesc: "We-story, drags in others, void in what they want, not allowed",
  },
  {
    left: "Oi",
    right: "Oe",
    time: "4m",
    leftDesc: "Has a way, same story, concludes, narrows, shoves away new",
    rightDesc: "Channel change, we'll see, wants control - but doesn't",
  },
  {
    left: "N",
    right: "S",
    time: "5m",
    leftDesc: "Summarizing, categories, abstract, void in supporting facts",
    rightDesc: "Proving, gives facts, grounded, not jumping or summarizing",
  },
  {
    left: "F",
    right: "T",
    time: "3m",
    leftDesc: "Values, likes, hates, weak reasons, won't make it work",
    rightDesc: "Works, get it done, logic, reasons, unowned emotions",
  },
  {
    left: "S",
    right: "P",
    time: "3m",
    leftDesc: "Same story about self, processed, resolved, won't jump in",
    rightDesc: "Random story about others, unresolved, won't hit the brakes",
  },
  {
    left: "C",
    right: "B",
    time: "2m",
    leftDesc: "Random story about self, takes you along, trails off, not ready",
    rightDesc: "Same story about others, lessons, jumps in, overextended",
  },
  {
    left: "Info",
    right: "Energy",
    time: "1m",
    leftDesc: "Balance in learning and sharing info, works/rests in swings",
    rightDesc: "Balance in work and rest, learns/talks in swings",
  },
  {
    left: "I",
    right: "E",
    time: "4m",
    leftDesc: 'Always "kicked" by the tribe to talk and move, outbursts later',
    rightDesc: "Always tiring out self and tribe, then crashes later",
  },
];

// Extra rows: pure labels, don't touch the grid, only feed the code prefix.
const EXTRA_PAIRS = [
  { left: "weak", leftCode: "F", right: "strong", rightCode: "M" },
  { left: "cat", leftCode: "F", right: "dog", rightCode: "M" },
];

// Bell-curve chart (Emoji tab): places each of the 16 totems along a normal
// distribution using their own score (-7..+7) as the x position. "-0" and
// "+0" share the numeric value 0, so they're nudged to -0.5/+0.5 to keep
// their markers from overlapping at the curve's peak.
const CURVE_WIDTH = 600;
const CURVE_HEIGHT = 220;
const CURVE_PAD_X = 32;
const CURVE_TOP = 34;
const CURVE_BASELINE = 172;
const CURVE_SIGMA = 4;

function totemScoreX(score) {
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

export default function App() {
  const [selections, setSelections] = useState(Array(PAIRS.length).fill(null));
  const [extraSelections, setExtraSelections] = useState(Array(EXTRA_PAIRS.length).fill(null));
  const [activeTab, setActiveTab] = useState(null);
  const [pasteValue, setPasteValue] = useState("");
  const [copiedField, setCopiedField] = useState(null);

  function handleCopy(text, field) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField((f) => (f === field ? null : f)), 1200);
    });
  }

  function setSelection(index, side) {
    setSelections((prev) =>
      prev.map((v, i) => (i === index ? (v === side ? null : side) : v))
    );
  }

  function setExtraSelection(index, side) {
    setExtraSelections((prev) =>
      prev.map((v, i) => (i === index ? (v === side ? null : side) : v))
    );
  }

  function isFaded(cell, colIndex) {
    return selections.some((side, i) => {
      if (!side) return false;
      if (i === 8) {
        const introvert = isIntrovertHeader(GRID_HEADERS[colIndex]);
        return side === "left" ? !introvert : introvert;
      }
      const fadeClasses = FADE_RULES[i][side];
      return fadeClasses.some((c) => cell.classes.includes(c));
    });
  }

  const survivors = [];
  for (let r = 0; r < GRID_ROWS.length; r++) {
    for (let c = 0; c < GRID_HEADERS.length; c++) {
      const cell = GRID_ROWS[r][c];
      if (!isFaded(cell, c)) {
        survivors.push({ cell, col: c });
      }
    }
  }
  const survivor = survivors[0] || null;
  const survivorCount = survivors.length;

  // Merges every surviving candidate's "Fi/Ne-CS/B(P)" string position by
  // position: a letter that agrees across all of them is kept, one that
  // doesn't (still-undetermined coin) becomes "_". The "-", "/", "(", ")"
  // separators always agree since the format is fixed-width, so they pass
  // through untouched.
  function mergeAmbiguousCode(candidates) {
    const strings = candidates.map(
      ({ cell, col }) => `${cell.text}-${formatHeaderCode(GRID_HEADERS[col])}`
    );
    return strings[0]
      .split("")
      .map((ch, i) => (strings.every((s) => s[i] === ch) ? ch : "_"))
      .join("");
  }

  const extraCode = extraSelections
    .map((side, i) =>
      side === "left" ? EXTRA_PAIRS[i].leftCode : side === "right" ? EXTRA_PAIRS[i].rightCode : "_"
    )
    .join("");

  const resolvedHeader = survivorCount === 1 ? GRID_HEADERS[survivor.col] : null;
  const totem = resolvedHeader ? TOTEMS[resolvedHeader] : null;
  const saviorFunctions = survivorCount === 1 ? survivor.cell.text.split("/") : null;
  const mbti =
    survivorCount === 1 ? mbtiTypeFromCell(survivor.cell, isIntrovertHeader(resolvedHeader)) : null;

  const typeCode =
    survivorCount === 0
      ? "(sin coincidencia)"
      : survivorCount > 1
      ? mergeAmbiguousCode(survivors)
      : `${survivor.cell.text}-${formatHeaderCode(resolvedHeader)}`;

  const fullCode = `${mbti ? mbti + " " : ""}${extraCode}-${typeCode}`;

  const checklistCtx = { selections, extraSelections, saviorFunctions };
  const checkedItems = CHECKLIST_SECTIONS.flatMap((section) =>
    section.items
      .filter((item) => checklistItemChecked(item.test, checklistCtx))
      .map((item) => ({ section: section.title, item }))
  );

  const binaryLength = EXTRA_PAIRS.length + PAIRS.length;

  const binary =
    extraSelections.map((side) => (side === "right" ? "1" : side === "left" ? "0" : "X")).join("") +
    selections.map((side) => (side === "right" ? "1" : side === "left" ? "0" : "X")).join("");

  function applyBinaryString(raw) {
    const extraRaw = raw.slice(0, EXTRA_PAIRS.length);
    const mainRaw = raw.slice(EXTRA_PAIRS.length);

    setExtraSelections((prev) =>
      prev.map((old, i) => {
        if (i >= extraRaw.length) return old;
        const ch = extraRaw[i];
        if (ch === "1") return "right";
        if (ch === "0") return "left";
        return null;
      })
    );
    setSelections((prev) =>
      prev.map((old, i) => {
        if (i >= mainRaw.length) return old;
        const ch = mainRaw[i];
        if (ch === "1") return "right";
        if (ch === "0") return "left";
        return null;
      })
    );
  }

  function handleBinaryChange(e) {
    const input = e.target;
    const cursor = input.selectionStart;
    const before = input.value.length;
    const raw = input.value.replace(/[^01xX]/g, "").slice(0, binaryLength);
    applyBinaryString(raw);

    // The field's value is always re-derived from state (it can normalize
    // stray characters), which would otherwise throw the caret to the end
    // after every keystroke. Put it back where the user was typing.
    requestAnimationFrame(() => {
      if (document.activeElement === input) {
        const shrink = before - input.value.length;
        const pos = Math.max(0, cursor - Math.max(shrink, 0));
        input.setSelectionRange(pos, pos);
      }
    });
  }

  function handlePasteCode(e) {
    const value = e.target.value;
    setPasteValue(value);

    // Looks like a (possibly partial) binary string, e.g "010X1..." or
    // "FM010010111" - apply it the same way the binary field does.
    const stripped = value.replace(/[\s-]/g, "");
    if (stripped.length > 0 && /^[01xX]+$/.test(stripped)) {
      applyBinaryString(stripped.slice(0, binaryLength));
      return;
    }

    const parsed = parsePastedCode(value);
    if (parsed.selections) {
      setSelections((prev) => prev.map((old, i) => (parsed.selections[i] === undefined ? old : parsed.selections[i])));
    }
    if (parsed.extraSelections) {
      setExtraSelections((prev) =>
        prev.map((old, i) => (parsed.extraSelections[i] === undefined ? old : parsed.extraSelections[i]))
      );
    }
  }

  function handleGridCellClick(cell, colIndex) {
    setSelections(selectionsFromCell(cell, GRID_HEADERS[colIndex]));
  }

  return (
    <div className="page">
      <h1 className="title">Elimination Tool</h1>

      <div className="table">
        {PAIRS.map((pair, i) => {
          const state = selections[i];
          return (
            <div className="row" key={i}>
              <div className={`side side-left ${state === "left" ? "selected" : ""}`}>
                {pair.leftDesc}
              </div>

              <div className="switch">
                <button
                  className={`opt ${state === "left" ? "active" : ""}`}
                  onClick={() => setSelection(i, "left")}
                  aria-pressed={state === "left"}
                >
                  {pair.left}
                </button>
                <button
                  className={`opt ${state === "right" ? "active" : ""}`}
                  onClick={() => setSelection(i, "right")}
                  aria-pressed={state === "right"}
                >
                  {pair.right}
                </button>
              </div>

              <div className={`side side-right ${state === "right" ? "selected" : ""}`}>
                {pair.rightDesc}
              </div>
            </div>
          );
        })}
      </div>

      <div className="table extra-table">
        {EXTRA_PAIRS.map((pair, i) => {
          const state = extraSelections[i];
          return (
            <div className="row" key={i}>
              <div className={`side side-left ${state === "left" ? "selected" : ""}`}>
                {pair.left}
              </div>

              <div className="switch">
                <button
                  className={`opt ${state === "left" ? "active" : ""}`}
                  onClick={() => setExtraSelection(i, "left")}
                  aria-pressed={state === "left"}
                >
                  {pair.leftCode}
                </button>
                <button
                  className={`opt ${state === "right" ? "active" : ""}`}
                  onClick={() => setExtraSelection(i, "right")}
                  aria-pressed={state === "right"}
                >
                  {pair.rightCode}
                </button>
              </div>

              <div className={`side side-right ${state === "right" ? "selected" : ""}`}>
                {pair.right}
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="title grid-title">Type Grid</h2>

      <div className="grid-scroll">
        <table className="grid-table">
          <thead>
            <tr>
              {GRID_HEADERS.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GRID_ROWS.map((cells, r) => (
              <tr key={r}>
                {cells.map((cell, c) => {
                  const isSelected = survivorCount === 1 && survivor.cell === cell && survivor.col === c;
                  return (
                    <td
                      key={c}
                      className={`${isFaded(cell, c) ? "faded" : ""} ${isSelected ? "selected" : ""}`}
                      onClick={() => handleGridCellClick(cell, c)}
                    >
                      {cell.text}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="legend">
        {GRID_LEGEND.map((item) => (
          <span key={item.label} className={`legend-chip ${item.classes.join(" ")}`}>
            {item.label}
          </span>
        ))}
      </div>

      <div className="result">
        <div className="result-row">
          <div className="result-code">{fullCode}</div>
          <button
            type="button"
            className="copy-btn"
            onClick={() => handleCopy(fullCode, "code")}
            aria-label="Copiar código"
            title="Copiar código"
          >
            {copiedField === "code" ? "✓" : "⧉"}
          </button>
        </div>
        <div className="result-row">
          <input
            className="result-binary"
            type="text"
            inputMode="numeric"
            maxLength={binaryLength}
            value={binary}
            onChange={handleBinaryChange}
          />
          <button
            type="button"
            className="copy-btn"
            onClick={() => handleCopy(binary, "binary")}
            aria-label="Copiar binario"
            title="Copiar binario"
          >
            {copiedField === "binary" ? "✓" : "⧉"}
          </button>
        </div>
        <input
          className="result-paste"
          type="text"
          placeholder="Pegar código o binario (ej: Ti/Ne-CS/B(P) o 010010111)"
          value={pasteValue}
          onChange={handlePasteCode}
        />
      </div>

      <div className="navbar">
        {NAV_TABS.map((tab) => (
          <button
            key={tab}
            className={`nav-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(activeTab === tab ? null : tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Checklist" && (
        <div className="tab-panel checklist">
          {CHECKLIST_SECTIONS.map((section) => (
            <div className="checklist-section" key={section.title}>
              <h3 className="checklist-section-title">{section.title}</h3>
              {section.items.map((item, i) => {
                const checked = checklistItemChecked(item.test, checklistCtx);
                return (
                  <div className="checklist-item" key={i}>
                    <span className={`check ${checked ? "checked" : ""}`}>{checked ? "✓" : "—"}</span>
                    <div className="checklist-body">
                      <div className="checklist-heading">
                        <span className="checklist-title">{item.title}</span>
                        {item.subtitle && <span className="checklist-subtitle">{item.subtitle}</span>}
                        {item.tag && <span className="checklist-tag">{item.tag}</span>}
                      </div>
                      {item.lines.map((line, li) => (
                        <div className="checklist-line" key={li}>
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {activeTab === "Traits" && (
        <div className="tab-panel checklist">
          {checkedItems.length === 0 && <div className="checklist-empty">Todavía no hay coins marcadas.</div>}
          {checkedItems.map(({ section, item }, i) => (
            <div className="checklist-item" key={i}>
              <span className="check checked">✓</span>
              <div className="checklist-body">
                <div className="checklist-heading">
                  <span className="checklist-section-inline">{section}</span>
                  <span className="checklist-title">{item.title}</span>
                  {item.subtitle && <span className="checklist-subtitle">{item.subtitle}</span>}
                  {item.tag && <span className="checklist-tag">{item.tag}</span>}
                </div>
                {item.lines.map((line, li) => (
                  <div className="checklist-line" key={li}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Interpretation" && (
        <div className="tab-panel checklist">
          {checkedItems.length === 0 && <div className="checklist-empty">Todavía no hay coins marcadas.</div>}
          {checkedItems.map(({ section, item }, i) => {
            const opp = item.opposite ? findChecklistItem(item.opposite) : null;
            return (
              <div className="interpretation-item" key={i}>
                <div className="checklist-heading">
                  <span className="checklist-section-inline">{section}</span>
                  <span className="checklist-title">{item.title}</span>
                </div>
                <p className="interpretation-text">
                  {item.interpretation} <em>Por ejemplo: {item.example}</em>
                </p>
                {opp && (
                  <p className="interpretation-counter">
                    <strong>Contraejemplo — {opp.title}:</strong> {opp.interpretation} <em>Por ejemplo: {opp.example}</em>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "Emoji" && (
        <div className="tab-panel emoji-panel">
          {totem ? (
            <>
              <div className="emoji-big">{totem.emoji}</div>
              <div className="emoji-name">
                {totem.name} <span className="emoji-score">{totem.score}</span>
              </div>
            </>
          ) : (
            <div className="emoji-placeholder">
              ❓{" "}
              {survivorCount === 0
                ? "Sin coincidencia con las coins actuales"
                : "Definí más coins para determinar el animal"}
            </div>
          )}

          <div className="totem-grid">
            {TOTEMS_ORDERED.map((t) => (
              <div key={t.header} className={`totem-cell ${t.header === resolvedHeader ? "selected" : ""}`}>
                <span className="totem-emoji">{t.emoji}</span>
                <span className="totem-score">{t.score}</span>
                <span className="totem-name">{t.name}</span>
              </div>
            ))}
          </div>

          <div className="totem-curve">
            <div className="totem-curve-caption">
              Distribución normal — eje: puntaje del animal, altura: frecuencia
            </div>
            <svg
              className="totem-curve-svg"
              viewBox={`0 0 ${CURVE_WIDTH} ${CURVE_HEIGHT}`}
              role="img"
              aria-label="Animales distribuidos según su puntaje en una curva normal"
            >
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
                const selected = t.header === resolvedHeader;
                return (
                  <g key={t.header} className={`curve-point ${selected ? "selected" : ""}`}>
                    <line x1={x} y1={y} x2={x} y2={CURVE_BASELINE} className="curve-stem" />
                    <circle cx={x} cy={y} r={selected ? 13 : 10} className="curve-marker" />
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
        </div>
      )}
    </div>
  );
}
