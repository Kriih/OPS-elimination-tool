// Strict parser/validator for complete OPS type codes, in two notations:
//
//   short: "MF-Ni/Fe-BP/C(S)"  (optionally "INFJ MF-Ni/Fe-BP/C(S) #2")
//   long:  "O/De/Oi/N/F/P/B/INFO/E/M-S/F-De"  (one entry per coin)
//
// Both regexes only accept a full, well-formed, exact-case code. Partial or
// sloppy input (with "_", lowercase, a header without parentheses...) is
// left to parsePastedCode in typeGrid.js, which the paste box falls back
// to. The regexes also accept impossible types on purpose (two Observers,
// repeated animals...): validate() rejects those with a readable reason.
//
// Modality order is [Sensory M/F][De M/F]: "MF" = Masculine Sensory +
// Feminine extraverted Decider (see contexto.md).

import { GRID_HEADERS, GRID_ROWS, mbtiTypeFromCell, parsePastedCode } from "./typeGrid.js";

export const SHORT_CODE =
  /^(?:(?<mbti>[IE][NS][FT][JP])\s+)?(?<m1>[FM])(?<m2>[FM])-(?<sav1>[NSFT][ie])\/(?<sav2>[NSFT][ie])-(?<a1>[SPCB])(?<a2>[SPCB])\/(?<a3>[SPCB])\((?<a4>[SPCB])\)(?:\s*#(?<social>[1-4]))?$/;

export const LONG_CODE =
  /^(?<od>O|D)\/(?<d>Di|De)\/(?<o>Oi|Oe)\/(?<ns>N|S)\/(?<ft>F|T)\/(?<sp>S|P)\/(?<cb>C|B)\/(?<ie4>INFO|ENERGY)\/(?<ie>I|E)\/(?<ms>[MF]-S)\/(?<mde>[MF]-De)$/;

export const ANIMAL_NAMES = { S: "Sleep", P: "Play", C: "Consume", B: "Blast" };

// Sleep = Oi+Di, Play = Oe+De, Consume = Oe+Di, Blast = Oi+De.
const OPPOSITE_ANIMAL = { S: "P", P: "S", C: "B", B: "C" };

function isObserverFn(fn) {
  return fn[0] === "N" || fn[0] === "S";
}

// The animal formed by one Observer + one Decider function.
export function animalOf(observer, decider) {
  const oi = observer[1] === "i";
  const di = decider[1] === "i";
  if (oi && di) return "S";
  if (!oi && !di) return "P";
  return di ? "C" : "B";
}

const OPPOSITE_LETTER = { N: "S", S: "N", F: "T", T: "F" };

// Full function stack for a Savior pair: Ni/Fe -> [Ni, Fe, Ti, Se]. The
// 3rd function mirrors the 2nd and the 4th mirrors the 1st (opposite
// letter, opposite attitude), so 1-4 and 2-3 are the two axes of opposites.
export function stackOf(pair) {
  const [a, b] = pair.split("/");
  const mirror = (f) => `${OPPOSITE_LETTER[f[0]]}${f[1] === "i" ? "e" : "i"}`;
  return [a, b, mirror(b), mirror(a)];
}

// The animal ranked last decides both Info/Energy and I/E (coins 8 and 9):
// Sleep/Play last -> INFO, Consume/Blast last -> ENERGY;
// Sleep/Consume last -> E, Play/Blast last -> I.
const LAST_ANIMAL_BY_COINS = {
  "INFO/E": "S",
  "INFO/I": "P",
  "ENERGY/E": "C",
  "ENERGY/I": "B",
};

function findCell(saviors, animals) {
  const header = `${animals[0]}${animals[1]}/${animals[2]}${animals[3]}`;
  const col = GRID_HEADERS.indexOf(header);
  if (col === -1) return null;
  const text = saviors.join("/");
  const row = GRID_ROWS.find((r) => r[col].text === text);
  return row ? row[col] : null;
}

function parseShort(g) {
  return {
    format: "short",
    mbti: g.mbti || null,
    modalities: { s: g.m1, de: g.m2 },
    saviors: [g.sav1, g.sav2],
    animals: [g.a1, g.a2, g.a3, g.a4],
    social: g.social ? Number(g.social) : null,
  };
}

// The long form carries one answer per coin, which pins down the whole
// short form: the 5 function coins give the Savior pair, the Savior pair
// gives the 1st animal, coins 6-7 give the leading pair (so the 2nd
// animal), and coins 8-9 give the last one.
function parseLong(g) {
  const observer = `${g.ns}${g.o[1]}`;
  const decider = `${g.ft}${g.d[1]}`;
  const saviors = g.od === "O" ? [observer, decider] : [decider, observer];

  const first = animalOf(observer, decider);
  const leading = [g.sp, g.cb];
  const last = LAST_ANIMAL_BY_COINS[`${g.ie4}/${g.ie}`];

  const errors = [];
  if (!leading.includes(first)) {
    errors.push(
      `Las monedas ${g.sp}/${g.cb} no incluyen a ${ANIMAL_NAMES[first]}, ` +
        `que es el animal que forman ${saviors.join("/")} y tiene que ir 1º.`
    );
  }
  if (leading.includes(last)) {
    errors.push(
      `${g.ie4}/${g.ie} pone a ${ANIMAL_NAMES[last]} último, pero las monedas ` +
        `${g.sp}/${g.cb} lo ponen entre los dos primeros.`
    );
  }
  if (errors.length) return { errors };

  const second = leading.find((a) => a !== first);
  const third = ["S", "P", "C", "B"].find((a) => a !== first && a !== second && a !== last);

  return {
    value: {
      format: "long",
      mbti: null,
      modalities: { s: g.ms[0], de: g.mde[0] },
      saviors,
      animals: [first, second, third, last],
      social: null,
    },
  };
}

// Returns { ok: true, value } or { ok: false, errors: [...] }. Only checks
// the syntax (plus the long form's internal consistency); call validate()
// to know whether the type actually exists.
export function parse(code) {
  const raw = (code || "").trim();

  const short = raw.match(SHORT_CODE);
  if (short) return { ok: true, value: parseShort(short.groups) };

  const long = raw.match(LONG_CODE);
  if (long) {
    const { value, errors } = parseLong(long.groups);
    return errors ? { ok: false, errors } : { ok: true, value };
  }

  return {
    ok: false,
    errors: [
      "No es un código completo: ni corto (ej. MF-Ni/Fe-BP/C(S)) ni largo " +
        "(ej. O/De/Oi/N/F/P/B/INFO/E/M-S/F-De).",
    ],
  };
}

// Returns a list of readable problems; an empty list means the type is
// valid. The specific checks come first so the message says what is wrong;
// the grid lookup at the end is the catch-all.
export function validate(value) {
  const errors = [];
  const { saviors, animals, mbti } = value;
  const pair = saviors.join("/");

  const observers = saviors.filter(isObserverFn);
  const saviorsOk = observers.length === 1;
  if (!saviorsOk) {
    errors.push(
      observers.length === 2
        ? `Las dos Savior tienen que ser un Observer (N/S) y un Decider (F/T): ${pair} son dos Observer.`
        : `Las dos Savior tienen que ser un Observer (N/S) y un Decider (F/T): ${pair} son dos Decider.`
    );
  }

  const animalsOk = new Set(animals).size === 4;
  if (!animalsOk) {
    const repeated = [...new Set(animals.filter((a, i) => animals.indexOf(a) !== i))];
    errors.push(`Tienen que estar los cuatro animales (S, P, C, B) sin repetir: se repite ${repeated.join(", ")}.`);
  }

  if (saviorsOk) {
    const observer = saviors.find(isObserverFn);
    const decider = saviors.find((f) => !isObserverFn(f));
    const expected = animalOf(observer, decider);
    if (animals[0] !== expected) {
      errors.push(
        `Con ${pair} Savior el 1º animal tiene que ser ${ANIMAL_NAMES[expected]} (${expected}), ` +
          `no ${ANIMAL_NAMES[animals[0]]} (${animals[0]}).`
      );
    }
  }

  if (animalsOk && animals[1] === OPPOSITE_ANIMAL[animals[0]]) {
    errors.push(
      `El 2º animal no puede ser ${ANIMAL_NAMES[animals[1]]}: es el opuesto del 1º ` +
        `(${ANIMAL_NAMES[animals[0]]}) y no comparte ninguna función con él.`
    );
  }

  if (errors.length) return errors;

  const cell = findCell(saviors, animals);
  if (!cell) {
    return [`${pair} no aparece en la columna ${animals[0]}${animals[1]}/${animals[2]}${animals[3]} de la grilla.`];
  }

  if (mbti) {
    const expected = mbtiTypeFromCell(cell);
    if (mbti !== expected) {
      errors.push(`El MBTI de ${pair} es ${expected}, no ${mbti} (la I/E sale de la primera función).`);
    }
  }

  return errors;
}

export function toShort(value) {
  const { modalities, saviors, animals, social } = value;
  const [a1, a2, a3, a4] = animals;
  return `${modalities.s}${modalities.de}-${saviors.join("/")}-${a1}${a2}/${a3}(${a4})${social ? ` #${social}` : ""}`;
}

// Long form, one entry per coin in Elimination Tool order plus the two
// modalities. Assumes a value that passed validate().
export function toLong(value) {
  const { modalities, saviors, animals } = value;
  const observer = saviors.find(isObserverFn);
  const decider = saviors.find((f) => !isObserverFn(f));
  const leading = animals.slice(0, 2);
  const last = animals[3];
  return [
    isObserverFn(saviors[0]) ? "O" : "D",
    decider[1] === "i" ? "Di" : "De",
    observer[1] === "i" ? "Oi" : "Oe",
    observer[0],
    decider[0],
    leading.includes("S") ? "S" : "P",
    leading.includes("C") ? "C" : "B",
    last === "S" || last === "P" ? "INFO" : "ENERGY",
    last === "S" || last === "C" ? "E" : "I",
    `${modalities.s}-S`,
    `${modalities.de}-De`,
  ].join("/");
}

// The app's toggle state for a value: "left" is the first option of each
// row (O, Di, Oi, N, F, S, C, Info, I; and F for both modality rows).
export function toSelections(value) {
  const coins = toLong(value).split("/");
  const lefts = ["O", "Di", "Oi", "N", "F", "S", "C", "INFO", "I"];
  return {
    selections: lefts.map((left, i) => (coins[i] === left ? "left" : "right")),
    extraSelections: [value.modalities.s, value.modalities.de].map((m) => (m === "F" ? "left" : "right")),
  };
}

// Same format as the app's binary field: modality rows first, then the 9
// coins; "0" = left, "1" = right, "X" = unset.
export function selectionsToBinary(extraSelections, selections) {
  return [...extraSelections, ...selections]
    .map((side) => (side === "right" ? "1" : side === "left" ? "0" : "X"))
    .join("");
}

// What the paste box does with its text. Returns one of:
//   { binary: "1001" }                 (possibly partial) binary string
//   { selections, extraSelections }    complete valid code: every toggle
//   { errors: [...] }                  complete-looking code for a type that
//                                      doesn't exist: leave the toggles alone
//   { partial: {...} }                 anything else, via parsePastedCode
// "Complete-looking" means SHORT_CODE or LONG_CODE matches: those must
// never reach the lenient parser, which would load some other type.
export function readPaste(text, binaryLength = 11) {
  const raw = (text || "").trim();

  // e.g "010X1..." or "FM010010111" - applied the same way the binary field does.
  const stripped = raw.replace(/[\s-]/g, "");
  if (stripped.length > 0 && /^[01xX]+$/.test(stripped)) {
    return { binary: stripped.slice(0, binaryLength) };
  }

  if (SHORT_CODE.test(raw) || LONG_CODE.test(raw)) {
    const result = parse(raw);
    const errors = result.ok ? validate(result.value) : result.errors;
    return errors.length ? { errors } : toSelections(result.value);
  }

  return { partial: parsePastedCode(raw) };
}

// One edit of the binary field, where every position is fixed: deleting
// leaves "X" instead of shifting the rest, and typing or pasting overwrites
// from the caret. `prev` is the field's value before the edit, `next` what
// the browser left in it and `caret` its selectionEnd afterwards; inputType
// is the InputEvent's. Returns the new value and where to put the caret.
export function editBinary(prev, next, caret, inputType = "") {
  // The browser's edit is prev = head + removed + tail and
  // next = head + inserted + tail, with the inserted text ending at the
  // caret. The tail is what follows the caret; the head is whatever the
  // two still share before it (if it eats into the inserted text, those
  // characters equal the ones they overwrite, so the result is the same).
  const tailLength = Math.min(next.length - caret, prev.length);
  const removedEnd = prev.length - tailLength;
  const before = next.slice(0, caret);
  let head = 0;
  while (head < removedEnd && head < before.length && before[head] === prev[head]) head++;

  const inserted = before.slice(head).replace(/[^01xX]/g, "").toUpperCase();
  const out = prev.split("");
  for (let i = head; i < removedEnd; i++) out[i] = "X";
  for (let i = 0; i < inserted.length && head + i < out.length; i++) out[head + i] = inserted[i];

  let pos = Math.min(head + inserted.length, out.length);
  // Supr on a single character steps over the "X" it leaves, so pressing
  // it again clears the next one, as it would in a normal field.
  if (inputType === "deleteContentForward" && removedEnd - head === 1) pos = removedEnd;
  return { value: out.join(""), caret: pos };
}
