import { GRID_HEADERS, TOTEMS, selectionsFromCell } from "./typeGrid";
import { COIN_READINGS, MAIN_COIN_COUNT, PENDING } from "./readingData";
import TotemCurve, { totemScoreX } from "./TotemCurve";
import Molecule from "./Molecule";

// Reading tab ("Cómo se lee", see como-se-lee.md): one card per coin in
// Elimination Tool order. Each coin is in one of four states:
//   marked    - the user picked a side.
//   deduced   - not picked, but every surviving grid candidate agrees on it.
//   undecided - the candidates disagree: both sides are shown side by side.
//   missing   - a modality row nobody picked (modalities are never deduced).

function coinStates(selections, extraSelections, survivors) {
  const candidates = survivors.map(({ cell, col }) => selectionsFromCell(cell, GRID_HEADERS[col]));
  return COIN_READINGS.map((coin, i) => {
    if (i >= MAIN_COIN_COUNT) {
      const side = extraSelections[i - MAIN_COIN_COUNT];
      return { coin, index: i, status: side ? "marked" : "missing", side };
    }
    if (selections[i]) return { coin, index: i, status: "marked", side: selections[i] };
    const first = candidates[0]?.[i];
    if (first && candidates.every((c) => c[i] === first)) {
      return { coin, index: i, status: "deduced", side: first };
    }
    return { coin, index: i, status: "undecided", side: null };
  });
}

function faceOf(state) {
  return state.side === "left" ? state.coin.faces[0] : state.coin.faces[1];
}

function Text({ value }) {
  return <span className={value === PENDING ? "reading-pending" : undefined}>{value}</span>;
}

function TextList({ label, items }) {
  return (
    <div className="reading-field">
      <div className="reading-label">{label}</div>
      <ul className="reading-list">
        {items.map((item, i) => (
          <li key={i}>
            <Text value={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function CardHead({ coin, badge }) {
  return (
    <div className="reading-card-head">
      <span className="reading-coin-num">{coin.coin}</span>
      <span className="reading-coin-name">{coin.name}</span>
      {badge && <span className={`reading-badge ${badge.kind}`}>{badge.label}</span>}
    </div>
  );
}

function ResolvedCard({ state }) {
  const { coin } = state;
  const face = faceOf(state);
  const oppositeFace = coin.faces.find((f) => f !== face);
  const side = coin.sides[face];
  return (
    <article className="reading-card">
      <CardHead coin={coin} badge={state.status === "deduced" ? { kind: "deduced", label: "deducida" } : null} />
      <h3 className="reading-side-title">
        {side.title} <span className="reading-face">[{face}]</span>
      </h3>
      <p className="reading-decides">{coin.decides}</p>
      <div className="reading-field">
        <div className="reading-label">Definición</div>
        <p className="reading-text">
          <Text value={side.definition} />
        </p>
      </div>
      <div className="reading-field">
        <div className="reading-label">Contraste con {coin.sides[oppositeFace].title}</div>
        <p className="reading-text">
          <Text value={side.contrast} />
        </p>
      </div>
      <TextList label="En la vida diaria" items={side.everyday} />
      <TextList label="Confusiones frecuentes" items={side.pitfalls} />
      <TextList label="Se verifica con" items={side.crossChecks} />
    </article>
  );
}

function UndecidedCard({ state, onSelect }) {
  const { coin } = state;
  return (
    <article className="reading-card">
      <CardHead coin={coin} badge={{ kind: "undecided", label: "sin decidir" }} />
      <p className="reading-decides">{coin.decides}</p>
      <div className="reading-sides">
        {coin.faces.map((face, i) => {
          const side = coin.sides[face];
          return (
            <div className="reading-side" key={face}>
              <h3 className="reading-side-title">
                {side.title} <span className="reading-face">[{face}]</span>
              </h3>
              <p className="reading-text">
                <Text value={side.definition} />
              </p>
              <TextList label="En la vida diaria" items={side.everyday} />
              <button
                type="button"
                className="reading-pick"
                onClick={() => onSelect(state.index, i === 0 ? "left" : "right")}
              >
                Elegir {side.title}
              </button>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function MissingModalityCard({ state, onSelectExtra }) {
  const { coin } = state;
  return (
    <article className="reading-card">
      <CardHead coin={coin} badge={{ kind: "missing", label: "falta elegir" }} />
      <p className="reading-decides">{coin.decides}</p>
      <div className="reading-pick-row">
        {coin.faces.map((face, i) => (
          <button
            type="button"
            key={face}
            className="reading-pick"
            onClick={() => onSelectExtra(state.index - MAIN_COIN_COUNT, i === 0 ? "left" : "right")}
          >
            {coin.toggles[i]} · {coin.sides[face].title}
          </button>
        ))}
      </div>
    </article>
  );
}

function scaleLabel(headers) {
  const totems = headers.map((h) => TOTEMS[h]).sort((a, b) => totemScoreX(a.score) - totemScoreX(b.score));
  if (totems.length === 1) {
    const t = totems[0];
    return `${t.score} ${t.score.startsWith("+") ? "Extraversion" : "Introversion"} · ${t.name} ${t.emoji}`;
  }
  return `de ${totems[0].score} a ${totems[totems.length - 1].score} · ${totems.length} animales posibles`;
}

export default function ReadingTab({ selections, extraSelections, survivors, fullCode, onSelect, onSelectExtra }) {
  if (survivors.length === 0) {
    return (
      <div className="tab-panel reading">
        <div className="checklist-empty">
          Ningún tipo coincide con las monedas marcadas. Desmarcá alguna o usá Reset.
        </div>
      </div>
    );
  }

  const states = coinStates(selections, extraSelections, survivors);
  const longCode = states
    .map((s) => (s.side ? faceOf(s) : s.index >= MAIN_COIN_COUNT ? `_${s.coin.faces[0].slice(1)}` : "_"))
    .join("/");
  const undecided = states.filter((s) => s.status === "undecided").length;
  const missing = states.filter((s) => s.status === "missing").length;

  const headers = [...new Set(survivors.map((s) => GRID_HEADERS[s.col]))];
  const pairs = [...new Set(survivors.map((s) => s.cell.text))];

  let summary;
  if (survivors.length > 1) {
    summary = `Quedan ${survivors.length} tipos posibles · ${undecided} ${undecided === 1 ? "moneda" : "monedas"} sin decidir`;
  } else {
    summary = "Tipo resuelto";
  }
  if (missing) summary += ` · falta elegir ${missing === 1 ? "una modalidad" : "las dos modalidades"}`;

  return (
    <div className="tab-panel reading">
      <div className="reading-header">
        <div className="reading-code">{fullCode}</div>
        <div className="reading-long">{longCode}</div>
        <div className="reading-summary">{summary}</div>
      </div>

      <TotemCurve
        selected={headers}
        showRange
        dimOthers
        caption={`Escala I/E de -7 a +7: ${scaleLabel(headers)}`}
      />

      {pairs.length === 1 && (
        <div className="reading-molecule">
          <div className="reading-label">Molécula</div>
          <Molecule pair={pairs[0]} />
        </div>
      )}

      <div className="reading-cards">
        {states.map((state) => {
          if (state.status === "undecided") {
            return <UndecidedCard key={state.index} state={state} onSelect={onSelect} />;
          }
          if (state.status === "missing") {
            return <MissingModalityCard key={state.index} state={state} onSelectExtra={onSelectExtra} />;
          }
          return <ResolvedCard key={state.index} state={state} />;
        })}
      </div>
    </div>
  );
}
