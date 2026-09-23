// 128-type grid, ported from https://alexanderehelmer.github.io/ (grid128 table).
// Each cell keeps the original site's class tags so selections from the
// Elimination Tool above can fade out (cross out) incompatible columns.

export const GRID_HEADERS = [
  "SC/BP", "SC/PB", "SB/CP", "SB/PC",
  "CS/BP", "CS/PB", "CP/SB", "CP/BS",
  "BS/CP", "BS/PC", "BP/SC", "BP/CS",
  "PC/SB", "PC/BS", "PB/SC", "PB/CS",
];

// Animal totem + emoji per 16-column animal stack, ported from
// subjectivepersonality.com's OPS Type Analyzer (its "Emoji" tab).
export const TOTEMS = {
  "SC/BP": { name: "Owls", emoji: "🦉" },
  "SC/PB": { name: "Hedgehogs", emoji: "🦔" },
  "SB/CP": { name: "Rhinos", emoji: "🦏" },
  "SB/PC": { name: "Beavers", emoji: "🦫" },
  "CS/BP": { name: "Turtles", emoji: "🐢" },
  "CS/PB": { name: "Pandas", emoji: "🐼" },
  "CP/SB": { name: "Hares", emoji: "🐰" },
  "CP/BS": { name: "Zebras", emoji: "🦓" },
  "BS/CP": { name: "Deer", emoji: "🦌" },
  "BS/PC": { name: "Raccoons", emoji: "🦝" },
  "BP/SC": { name: "Otters", emoji: "🦦" },
  "BP/CS": { name: "Kangaroos", emoji: "🦘" },
  "PC/SB": { name: "Tigers", emoji: "🐯" },
  "PC/BS": { name: "Foxes", emoji: "🦊" },
  "PB/SC": { name: "Seals", emoji: "🦭" },
  "PB/CS": { name: "Dolphins", emoji: "🐬" },
};

function row(cells) {
  return cells.map(([text, classes]) => ({ text, classes: classes.split(" ") }));
}

export const GRID_ROWS = [
  row([
    ["Fi/Ni", "decider di oi2 f n cs e4"], ["Fi/Ni", "decider di oi2 f n cs i4"],
    ["Fi/Ni", "decider di oi2 f n sb e4"], ["Fi/Ni", "decider di oi2 f n sb i4"],
    ["Fi/Ne", "decider di oe2 f n cs e4"], ["Fi/Ne", "decider di oe2 f n cs i4"],
    ["Fi/Ne", "decider di oe2 f n cp i4"], ["Fi/Ne", "decider di oe2 f n cp e4"],
    ["Ni/Fe", "observer oi de2 n f sb e4"], ["Ni/Fe", "observer oi de2 n f sb i4"],
    ["Ni/Fe", "observer oi de2 n f pb i4"], ["Ni/Fe", "observer oi de2 n f pb e4"],
    ["Fe/Ne", "decider de oe2 f n cp i4"], ["Fe/Ne", "decider de oe2 f n cp e4"],
    ["Fe/Ne", "decider de oe2 f n pb i4"], ["Fe/Ne", "decider de oe2 f n pb e4"],
  ]),
  row([
    ["Fi/Si", "decider di oi2 f s cs e4"], ["Fi/Si", "decider di oi2 f s cs i4"],
    ["Fi/Si", "decider di oi2 f s sb e4"], ["Fi/Si", "decider di oi2 f s sb i4"],
    ["Fi/Se", "decider di oe2 f s cs e4"], ["Fi/Se", "decider di oe2 f s cs i4"],
    ["Fi/Se", "decider di oe2 f s cp i4"], ["Fi/Se", "decider di oe2 f s cp e4"],
    ["Ni/Te", "observer oi de2 n t sb e4"], ["Ni/Te", "observer oi de2 n t sb i4"],
    ["Ni/Te", "observer oi de2 n t pb i4"], ["Ni/Te", "observer oi de2 n t pb e4"],
    ["Fe/Se", "decider de oe2 f s cp i4"], ["Fe/Se", "decider de oe2 f s cp e4"],
    ["Fe/Se", "decider de oe2 f s pb i4"], ["Fe/Se", "decider de oe2 f s pb e4"],
  ]),
  row([
    ["Ni/Fi", "observer oi di2 n f cs e4"], ["Ni/Fi", "observer oi di2 n f cs i4"],
    ["Ni/Fi", "observer oi di2 n f sb e4"], ["Ni/Fi", "observer oi di2 n f sb i4"],
    ["Ti/Ne", "decider di oe2 t n cs e4"], ["Ti/Ne", "decider di oe2 t n cs i4"],
    ["Ti/Ne", "decider di oe2 t n cp i4"], ["Ti/Ne", "decider di oe2 t n cp e4"],
    ["Si/Fe", "observer oi de2 s f sb e4"], ["Si/Fe", "observer oi de2 s f sb i4"],
    ["Si/Fe", "observer oi de2 s f pb i4"], ["Si/Fe", "observer oi de2 s f pb e4"],
    ["Ne/Fe", "observer oe de2 n f cp i4"], ["Ne/Fe", "observer oe de2 n f cp e4"],
    ["Ne/Fe", "observer oe de2 n f pb i4"], ["Ne/Fe", "observer oe de2 n f pb e4"],
  ]),
  row([
    ["Ni/Ti", "observer oi di2 n t cs e4"], ["Ni/Ti", "observer oi di2 n t cs i4"],
    ["Ni/Ti", "observer oi di2 n t sb e4"], ["Ni/Ti", "observer oi di2 n t sb i4"],
    ["Ti/Se", "decider di oe2 t s cs e4"], ["Ti/Se", "decider di oe2 t s cs i4"],
    ["Ti/Se", "decider di oe2 t s cp i4"], ["Ti/Se", "decider di oe2 t s cp e4"],
    ["Si/Te", "observer oi de2 s t sb e4"], ["Si/Te", "observer oi de2 s t sb i4"],
    ["Si/Te", "observer oi de2 s t pb i4"], ["Si/Te", "observer oi de2 s t pb e4"],
    ["Ne/Te", "observer oe de2 n t cp i4"], ["Ne/Te", "observer oe de2 n t cp e4"],
    ["Ne/Te", "observer oe de2 n t pb i4"], ["Ne/Te", "observer oe de2 n t pb e4"],
  ]),
  row([
    ["Si/Fi", "observer oi di2 s f cs e4"], ["Si/Fi", "observer oi di2 s f cs i4"],
    ["Si/Fi", "observer oi di2 s f sb e4"], ["Si/Fi", "observer oi di2 s f sb i4"],
    ["Ne/Fi", "observer oe di2 n f cs e4"], ["Ne/Fi", "observer oe di2 n f cs i4"],
    ["Ne/Fi", "observer oe di2 n f cp i4"], ["Ne/Fi", "observer oe di2 n f cp e4"],
    ["Fe/Ni", "decider de oi2 f n sb e4"], ["Fe/Ni", "decider de oi2 f n sb i4"],
    ["Fe/Ni", "decider de oi2 f n pb i4"], ["Fe/Ni", "decider de oi2 f n pb e4"],
    ["Se/Fe", "observer oe de2 s f cp i4"], ["Se/Fe", "observer oe de2 s f cp e4"],
    ["Se/Fe", "observer oe de2 s f pb i4"], ["Se/Fe", "observer oe de2 s f pb e4"],
  ]),
  row([
    ["Si/Ti", "observer oi di2 s t cs e4"], ["Si/Ti", "observer oi di2 s t cs i4"],
    ["Si/Ti", "observer oi di2 s t sb e4"], ["Si/Ti", "observer oi di2 s t sb i4"],
    ["Ne/Ti", "observer oe di2 n t cs e4"], ["Ne/Ti", "observer oe di2 n t cs i4"],
    ["Ne/Ti", "observer oe di2 n t cp i4"], ["Ne/Ti", "observer oe di2 n t cp e4"],
    ["Fe/Si", "decider de oi2 f s sb e4"], ["Fe/Si", "decider de oi2 f s sb i4"],
    ["Fe/Si", "decider de oi2 f s pb i4"], ["Fe/Si", "decider de oi2 f s pb e4"],
    ["Se/Te", "observer oe de2 s t cp i4"], ["Se/Te", "observer oe de2 s t cp e4"],
    ["Se/Te", "observer oe de2 s t pb i4"], ["Se/Te", "observer oe de2 s t pb e4"],
  ]),
  row([
    ["Ti/Ni", "decider di oi2 t n cs e4"], ["Ti/Ni", "decider di oi2 t n cs i4"],
    ["Ti/Ni", "decider di oi2 t n sb e4"], ["Ti/Ni", "decider di oi2 t n sb i4"],
    ["Se/Fi", "observer oe di2 s f cs e4"], ["Se/Fi", "observer oe di2 s f cs i4"],
    ["Se/Fi", "observer oe di2 s f cp i4"], ["Se/Fi", "observer oe di2 s f cp e4"],
    ["Te/Ni", "decider de oi2 t n sb e4"], ["Te/Ni", "decider de oi2 t n sb i4"],
    ["Te/Ni", "decider de oi2 t n pb i4"], ["Te/Ni", "decider de oi2 t n pb e4"],
    ["Te/Ne", "decider de oe2 t n cp i4"], ["Te/Ne", "decider de oe2 t n cp e4"],
    ["Te/Ne", "decider de oe2 t n pb i4"], ["Te/Ne", "decider de oe2 t n pb e4"],
  ]),
  row([
    ["Ti/Si", "decider di oi2 t s cs e4"], ["Ti/Si", "decider di oi2 t s cs i4"],
    ["Ti/Si", "decider di oi2 t s sb e4"], ["Ti/Si", "decider di oi2 t s sb i4"],
    ["Se/Ti", "observer oe di2 s t cs e4"], ["Se/Ti", "observer oe di2 s t cs i4"],
    ["Se/Ti", "observer oe di2 s t cp i4"], ["Se/Ti", "observer oe di2 s t cp e4"],
    ["Te/Si", "decider de oi2 t s sb e4"], ["Te/Si", "decider de oi2 t s sb i4"],
    ["Te/Si", "decider de oi2 t s pb i4"], ["Te/Si", "decider de oi2 t s pb e4"],
    ["Te/Se", "decider de oe2 t s cp i4"], ["Te/Se", "decider de oe2 t s cp e4"],
    ["Te/Se", "decider de oe2 t s pb i4"], ["Te/Se", "decider de oe2 t s pb e4"],
  ]),
];

// Column index (0-based) -> legend chip shown under the grid, ported verbatim
// from the source page's footer row (it only labels the middle 4 of 16
// columns; the IxxP/IxxJ/ExxJ/ExxP pattern repeats within every 4-column
// animal group, so this is the reference site's own shorthand, not an error).
export const GRID_LEGEND = [
  { col: 6, label: "ExxP", classes: ["observer", "oe"] },
  { col: 7, label: "IxxJ", classes: ["observer", "oi"] },
  { col: 8, label: "ExxJ", classes: ["decider", "de"] },
  { col: 9, label: "IxxP", classes: ["decider", "di"] },
];

// For Elimination Tool rows 0-7 (by index), which grid-cell classes get
// faded out when the left or right side is selected.
//
// Sleep/Play and Consume/Blast don't map to a single fixed animal per
// column - each column's header (e.g. "SC/BP") ranks all four animals, and
// the "cs"/"sb"/"cp"/"pb" cell classes mark which two are the leading pair
// (before the slash), in either order (so "C" matches both "CS/.." and
// "SC/.." headers, not just one). Marking S/P or C/B narrows the grid down
// to columns whose leading pair actually contains that animal.
//
// Row 8 (I/E) is handled separately (see isIntrovertHeader below): it isn't
// a cell-class rule, it reads the column header directly.
export const FADE_RULES = [
  { left: ["decider"], right: ["observer"] }, // O / D
  { left: ["de", "de2"], right: ["di", "di2"] }, // Di / De
  { left: ["oe", "oe2"], right: ["oi", "oi2"] }, // Oi / Oe
  { left: ["s"], right: ["n"] }, // N / S
  { left: ["t"], right: ["f"] }, // F / T
  { left: ["cp", "pb"], right: ["cs", "sb"] }, // Sleep / Play (leading pair contains S / contains P)
  { left: ["sb", "pb"], right: ["cs", "cp"] }, // Consume / Blast (leading pair contains C / contains B)
  { left: ["i4"], right: ["e4"] }, // Info / Energy
];

// I is the group whose weakest (4th-ranked, last letter of the header)
// animal is Blast or Play; E is the group whose weakest is Sleep or
// Consume. Equivalently: I when Sleep+Consume are both in the top 3,
// E when Blast+Play are both in the top 3.
export function isIntrovertHeader(header) {
  const last = header[header.length - 1];
  return last === "B" || last === "P";
}

// "BS/PC" -> "BS/P(C)" - restores the source PDF's parenthesized-4th-place
// notation for display.
export function formatHeaderCode(header) {
  return `${header.slice(0, -1)}(${header.slice(-1)})`;
}

// Derives the 4-letter MBTI-style code from a grid cell + its overall I/E.
//
// N/S and T/F just come from the two function letters. J/P comes from the
// cell's PRIMARY axis (the one that decides Decider-vs-Observer): Oi->J,
// Oe->P, Di->P, De->J - this is exactly the ExxP/IxxJ/ExxJ/IxxP rule from
// the source site's own grid legend, and it's the only rule that also
// works for the "same-attitude" Sleep/Play pairs (where classic MBTI's
// "extraverted function decides J/P" shortcut has no extraverted function
// to point at). I/E is NOT re-derived from the pair's own attitudes -
// OPS's overall Introvert/Extrovert is a property of the full animal
// ranking (isIntrovertHeader), independent of which 2 functions are shown.
export function mbtiTypeFromCell(cell, isIntrovert) {
  const { classes, text } = cell;
  const isDecider = classes.includes("decider");
  const jp = isDecider ? (classes.includes("di") ? "P" : "J") : classes.includes("oi") ? "J" : "P";
  const [a, b] = text.split("/");
  const ns = [a, b].find((f) => f[0] === "N" || f[0] === "S")[0];
  const ft = [a, b].find((f) => f[0] === "F" || f[0] === "T")[0];
  return `${isIntrovert ? "I" : "E"}${ns}${ft}${jp}`;
}

// Given one grid cell (and the header of the column it's in), derive the
// full set of 9 Elimination Tool answers it implies. Used both by clicking
// a cell directly and by parsePastedCode below.
export function selectionsFromCell(cell, header) {
  const cls = cell.classes;
  const selections = new Array(9).fill(undefined);
  selections[0] = cls.includes("observer") ? "left" : "right";
  selections[1] = cls.includes("de") || cls.includes("de2") ? "right" : cls.includes("di") || cls.includes("di2") ? "left" : undefined;
  selections[2] = cls.includes("oe") || cls.includes("oe2") ? "right" : cls.includes("oi") || cls.includes("oi2") ? "left" : undefined;
  selections[3] = cls.includes("n") ? "left" : "right";
  selections[4] = cls.includes("f") ? "left" : "right";
  selections[5] = cls.includes("cs") || cls.includes("sb") ? "left" : "right";
  selections[6] = cls.includes("cs") || cls.includes("cp") ? "left" : "right";
  selections[7] = cls.includes("e4") ? "left" : cls.includes("i4") ? "right" : undefined;
  if (header) {
    selections[8] = isIntrovertHeader(header) ? "left" : "right";
  }
  return selections;
}

// Reverse-lookup: given a pasted code fragment (any mix of an MBTI code, an
// "FM"-style modality prefix, a function pair like "Ti/Ne" and/or a header
// like "CS/BP" or "CS/B(P)"), find the matching grid cell and derive every
// Elimination Tool answer it implies. Returns as much as it can parse;
// fields that can't be determined are left undefined.
export function parsePastedCode(input) {
  const raw = (input || "").trim();
  const noParens = raw.replace(/[()]/g, "");
  const upper = noParens.toUpperCase();

  let header = null;
  let col = -1;
  for (let i = 0; i < GRID_HEADERS.length; i++) {
    if (upper.includes(GRID_HEADERS[i])) {
      header = GRID_HEADERS[i];
      col = i;
      break;
    }
  }

  const fnMatch = raw.match(/([A-Z][ie])\s*\/\s*([A-Z][ie])/);
  const functionPair = fnMatch ? `${fnMatch[1]}/${fnMatch[2]}` : null;

  const modalityMatch = raw.match(/\b([FM]{2})\b(?=-)/);
  const modality = modalityMatch ? modalityMatch[1] : null;

  let cell = null;
  let cellCol = col;
  if (functionPair) {
    outer: for (let r = 0; r < GRID_ROWS.length; r++) {
      for (let c = 0; c < GRID_HEADERS.length; c++) {
        if (GRID_ROWS[r][c].text === functionPair && (col === -1 || c === col)) {
          cell = GRID_ROWS[r][c];
          cellCol = c;
          break outer;
        }
      }
    }
    if (!cell) {
      // Function pair given but not at the matched column (or no header
      // given at all) - fall back to the first column where it appears.
      outer2: for (let r = 0; r < GRID_ROWS.length; r++) {
        for (let c = 0; c < GRID_HEADERS.length; c++) {
          if (GRID_ROWS[r][c].text === functionPair) {
            cell = GRID_ROWS[r][c];
            cellCol = c;
            break outer2;
          }
        }
      }
    }
  }

  const result = {};
  if (modality) {
    result.extraSelections = [modality[0] === "F" ? "left" : "right", modality[1] === "F" ? "left" : "right"];
  }

  if (cell) {
    result.selections = selectionsFromCell(cell, header || GRID_HEADERS[cellCol]);
  } else if (header) {
    // Only the header was found: we can still resolve S/P, C/B and I/E.
    const selections = new Array(9).fill(undefined);
    const lead = header.slice(0, 2);
    selections[5] = lead.includes("S") ? "left" : "right";
    selections[6] = lead.includes("C") ? "left" : "right";
    selections[8] = isIntrovertHeader(header) ? "left" : "right";
    result.selections = selections;
  }

  return result;
}
