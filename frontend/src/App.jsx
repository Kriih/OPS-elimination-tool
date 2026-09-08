import { useState } from "react";
import {
  GRID_HEADERS,
  GRID_ROWS,
  GRID_LEGEND,
  FADE_RULES,
  TOTEMS,
  isIntrovertHeader,
  formatHeaderCode,
} from "./typeGrid";
import { CHECKLIST_SECTIONS, checklistItemChecked } from "./checklistData";

const NAV_TABS = ["Checklist", "Emoji"];

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

export default function App() {
  const [selections, setSelections] = useState(Array(PAIRS.length).fill(null));
  const [extraSelections, setExtraSelections] = useState(Array(EXTRA_PAIRS.length).fill(null));
  const [activeTab, setActiveTab] = useState(null);

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

  let survivor = null;
  let survivorCount = 0;
  for (let r = 0; r < GRID_ROWS.length; r++) {
    for (let c = 0; c < GRID_HEADERS.length; c++) {
      const cell = GRID_ROWS[r][c];
      if (!isFaded(cell, c)) {
        survivorCount += 1;
        if (!survivor) survivor = { cell, col: c };
      }
    }
  }

  const extraCode = extraSelections
    .map((side, i) =>
      side === "left" ? EXTRA_PAIRS[i].leftCode : side === "right" ? EXTRA_PAIRS[i].rightCode : "_"
    )
    .join("");

  const typeCode =
    survivorCount === 0
      ? "(sin coincidencia)"
      : survivorCount > 1
      ? "(ambiguo)"
      : `${survivor.cell.text}-${formatHeaderCode(GRID_HEADERS[survivor.col])}`;

  const fullCode = `${extraCode}-${typeCode}`;

  const resolvedHeader = survivorCount === 1 ? GRID_HEADERS[survivor.col] : null;
  const totem = resolvedHeader ? TOTEMS[resolvedHeader] : null;
  const saviorFunctions = survivorCount === 1 ? survivor.cell.text.split("/") : null;

  const binaryLength = EXTRA_PAIRS.length + PAIRS.length;

  const binary =
    extraSelections.map((side) => (side === "right" ? "1" : side === "left" ? "0" : "X")).join("") +
    selections.map((side) => (side === "right" ? "1" : side === "left" ? "0" : "X")).join("");

  function handleBinaryChange(e) {
    const raw = e.target.value.replace(/[^01xX]/g, "").slice(0, binaryLength);
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
                <span className="time">{pair.time}</span>
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
                {cells.map((cell, c) => (
                  <td key={c} className={isFaded(cell, c) ? "faded" : ""}>
                    {cell.text}
                  </td>
                ))}
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
        <div className="result-code">{fullCode}</div>
        <input
          className="result-binary"
          type="text"
          inputMode="numeric"
          maxLength={binaryLength}
          value={binary}
          onChange={handleBinaryChange}
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
                const checked = checklistItemChecked(item.test, {
                  selections,
                  extraSelections,
                  saviorFunctions,
                });
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

      {activeTab === "Emoji" && (
        <div className="tab-panel emoji-panel">
          {totem ? (
            <>
              <div className="emoji-big">{totem.emoji}</div>
              <div className="emoji-name">{totem.name}</div>
            </>
          ) : (
            <div className="emoji-placeholder">
              ❓{" "}
              {survivorCount === 0
                ? "Sin coincidencia con las coins actuales"
                : "Definí más coins para determinar el animal"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
