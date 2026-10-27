import { describe, expect, it } from "vitest";
import { GRID_HEADERS, GRID_LEGEND, GRID_ROWS, formatHeaderCode, mbtiTypeFromCell, selectionsFromCell } from "./typeGrid.js";
import {
  animalOf,
  editBinary,
  parse,
  readPaste,
  selectionsToBinary,
  stackOf,
  toLong,
  toSelections,
  toShort,
  validate,
} from "./typeCode.js";

const BASE_SHORT = "MF-Ni/Fe-BP/C(S)";
const BASE_LONG = "O/De/Oi/N/F/P/B/INFO/E/M-S/F-De";
const BASE_BINARY = "10010001101";

function parseOk(code) {
  const result = parse(code);
  expect(result.errors).toBeUndefined();
  return result.value;
}

// Every code the app can produce: 128 cells x 4 modalities.
const ALL_CODES = GRID_ROWS.flatMap((row) =>
  row.flatMap((cell, col) =>
    ["FF", "FM", "MF", "MM"].map((m) => ({
      cell,
      header: GRID_HEADERS[col],
      code: `${m}-${cell.text}-${formatHeaderCode(GRID_HEADERS[col])}`,
    }))
  )
);

describe("caso base MF-Ni/Fe-BP/C(S)", () => {
  it.each([BASE_SHORT, `INFJ ${BASE_SHORT}`, `  ${BASE_SHORT}  `])("parsea %j", (code) => {
    const value = parseOk(code);
    expect(value.modalities).toEqual({ s: "M", de: "F" });
    expect(value.saviors).toEqual(["Ni", "Fe"]);
    expect(value.animals).toEqual(["B", "P", "C", "S"]);
    expect(validate(value)).toEqual([]);
    expect(toLong(value)).toBe(BASE_LONG);
  });

  it("da el binario de la app", () => {
    const { selections, extraSelections } = toSelections(parseOk(BASE_SHORT));
    expect(selectionsToBinary(extraSelections, selections)).toBe(BASE_BINARY);
  });

  it("la forma larga vuelve a la corta", () => {
    const value = parseOk(BASE_LONG);
    expect(validate(value)).toEqual([]);
    expect(toShort(value)).toBe(BASE_SHORT);
  });

  it("acepta el tipo social", () => {
    const value = parseOk(`INFJ ${BASE_SHORT} #2`);
    expect(value.social).toBe(2);
    expect(toShort(value)).toBe(`${BASE_SHORT} #2`);
  });
});

describe("las 512 combinaciones de la grilla", () => {
  it("todas parsean, validan y van y vuelven entre forma corta y larga", () => {
    for (const { code } of ALL_CODES) {
      const value = parseOk(code);
      expect(validate(value), code).toEqual([]);
      expect(toShort(value), code).toBe(code);
      expect(toShort(parseOk(toLong(value))), code).toBe(code);
    }
  });

  it("todas aceptan el MBTI que muestra la app", () => {
    for (const { cell, code } of ALL_CODES) {
      const value = parseOk(`${mbtiTypeFromCell(cell)} ${code}`);
      expect(validate(value), code).toEqual([]);
    }
  });

  it("toSelections coincide con el clic en la grilla", () => {
    for (const { cell, header, code } of ALL_CODES) {
      expect(toSelections(parseOk(code)).selections, code).toEqual(selectionsFromCell(cell, header));
    }
  });
});

describe("códigos inválidos", () => {
  it.each([
    ["mf-ni/fe-bp/c(s)", "No es un código completo"],
    ["M_-Ni/F_-B_/_(_)", "No es un código completo"],
    ["MF-Ni/Fe-BP/CS", "No es un código completo"],
    ["O/De/Oi/N/F/S/C/INFO/E/M-S/F-De", "no incluyen a Blast"],
    ["O/De/Oi/N/F/P/B/ENERGY/I/M-S/F-De", "lo ponen entre los dos primeros"],
  ])("parse rechaza %j", (code, message) => {
    const result = parse(code);
    expect(result.ok).toBe(false);
    expect(result.errors.join(" ")).toContain(message);
  });

  it.each([
    ["MF-Ni/Se-BP/C(S)", "son dos Observer"],
    ["MF-Fi/Te-BP/C(S)", "son dos Decider"],
    ["MF-Ni/Fe-BB/C(S)", "se repite B"],
    ["MF-Ni/Fe-SP/C(B)", "el 1º animal tiene que ser Blast (B)"],
    ["MF-Ni/Fe-BC/P(S)", "es el opuesto del 1º"],
    ["ENFJ MF-Ni/Fe-BP/C(S)", "El MBTI de Ni/Fe es INFJ, no ENFJ"],
  ])("validate rechaza %j", (code, message) => {
    const errors = validate(parseOk(code));
    expect(errors.join(" ")).toContain(message);
  });

  it("el chequeo contra la grilla no tiene agujeros", () => {
    // Every syntactically valid short code either fails a specific check or
    // exists in the grid, so the generic "no aparece en la columna" message
    // never has to fire.
    const fns = ["Ni", "Ne", "Si", "Se", "Fi", "Fe", "Ti", "Te"];
    const animals = ["S", "P", "C", "B"];
    for (const f1 of fns) for (const f2 of fns) {
      for (const a1 of animals) for (const a2 of animals) for (const a3 of animals) for (const a4 of animals) {
        const errors = validate(parseOk(`MF-${f1}/${f2}-${a1}${a2}/${a3}(${a4})`));
        expect(errors.join(" ")).not.toContain("no aparece en la columna");
      }
    }
  });
});

describe("stack de funciones", () => {
  it("Ni/Fe es Ni, Fe, Ti, Se", () => {
    expect(stackOf("Ni/Fe")).toEqual(["Ni", "Fe", "Ti", "Se"]);
  });

  it("en los 32 pares de la grilla: 4 letras distintas, 2 i y 2 e, ejes opuestos", () => {
    const pairs = [...new Set(GRID_ROWS.flatMap((row) => row.map((cell) => cell.text)))];
    expect(pairs).toHaveLength(32);
    for (const pair of pairs) {
      const stack = stackOf(pair);
      expect(new Set(stack.map((f) => f[0])).size, pair).toBe(4);
      expect(stack.filter((f) => f[1] === "i"), pair).toHaveLength(2);
      for (const [x, y] of [[0, 3], [1, 2]]) {
        expect(stack[x][1], pair).not.toBe(stack[y][1]);
      }
    }
  });

  it("las dos Savior forman el 1º animal de su columna", () => {
    for (const row of GRID_ROWS) {
      row.forEach((cell, col) => {
        const [a, b] = cell.text.split("/");
        const observer = "NS".includes(a[0]) ? a : b;
        const decider = observer === a ? b : a;
        expect(animalOf(observer, decider), cell.text).toBe(GRID_HEADERS[col][0]);
      });
    }
  });
});

describe("caja de pegar", () => {
  it.each([BASE_SHORT, BASE_LONG, `INFJ ${BASE_SHORT}`, `  ${BASE_SHORT}  `])("%j carga el caso base", (code) => {
    const { selections, extraSelections, errors } = readPaste(code);
    expect(errors).toBeUndefined();
    expect(selectionsToBinary(extraSelections, selections)).toBe(BASE_BINARY);
  });

  it.each([
    ["MF-Ni/Fe-BB/C(S)", "se repite B"],
    ["MF-Ni/Fe-BP/C(P)", "se repite P"],
    ["ENFJ MF-Ni/Fe-BP/C(S)", "El MBTI de Ni/Fe es INFJ, no ENFJ"],
    ["MF-Ni/Ne-BP/C(S)", "son dos Observer"],
    ["O/De/Oi/N/F/S/C/INFO/E/M-S/F-De", "no incluyen a Blast"],
  ])("%j no toca los toggles y da el motivo", (code, message) => {
    const result = readPaste(code);
    expect(result.selections).toBeUndefined();
    expect(result.extraSelections).toBeUndefined();
    expect(result.partial).toBeUndefined();
    expect(result.binary).toBeUndefined();
    expect(result.errors.join(" ")).toContain(message);
  });

  it("un código parcial sigue yendo al parser tolerante", () => {
    const { partial, errors } = readPaste("Ti/Ne-CS/B(P)");
    expect(errors).toBeUndefined();
    const col = GRID_HEADERS.indexOf("CS/BP");
    const cell = GRID_ROWS.map((row) => row[col]).find((c) => c.text === "Ti/Ne");
    expect(partial.selections).toEqual(selectionsFromCell(cell, "CS/BP"));
    expect(partial.extraSelections).toBeUndefined();
  });

  it("un binario parcial se aplica tal cual", () => {
    expect(readPaste("1001")).toEqual({ binary: "1001" });
    expect(readPaste(" 10-01 ")).toEqual({ binary: "1001" });
  });

  it("el texto vacío no marca nada", () => {
    expect(readPaste("")).toEqual({ partial: {} });
  });
});

describe("edición del binario", () => {
  // What the browser leaves in the field: `prev` with [start, end) replaced
  // by `text`, caret right after the inserted text.
  function edit(prev, start, end, text = "", inputType) {
    const next = prev.slice(0, start) + text + prev.slice(end);
    return editBinary(prev, next, start + text.length, inputType);
  }

  it("Backspace tras el 4º dígito deja X sin correr los demás", () => {
    expect(edit(BASE_BINARY, 3, 4, "", "deleteContentBackward")).toEqual({ value: "100X0001101", caret: 3 });
  });

  it("escribir sobre la X la reemplaza", () => {
    expect(edit("100X0001101", 3, 3, "1", "insertText")).toEqual({ value: BASE_BINARY, caret: 4 });
  });

  it("con el campo lleno escribir sobrescribe el carácter bajo el cursor", () => {
    expect(edit(BASE_BINARY, 0, 0, "0", "insertText")).toEqual({ value: "00010001101", caret: 1 });
    expect(edit(BASE_BINARY, 2, 2, "x", "insertText")).toEqual({ value: "10X10001101", caret: 3 });
    expect(edit(BASE_BINARY, 11, 11, "0", "insertText")).toEqual({ value: BASE_BINARY, caret: 11 });
  });

  it("seleccionar todo + Supr deja todo en X", () => {
    expect(edit(BASE_BINARY, 0, 11, "", "deleteContentForward")).toEqual({ value: "XXXXXXXXXXX", caret: 0 });
  });

  it("Supr al inicio borra el 1º y pasa al siguiente", () => {
    expect(edit(BASE_BINARY, 0, 1, "", "deleteContentForward")).toEqual({ value: "X0010001101", caret: 1 });
  });

  it("borrar dentro de una tira de dígitos iguales borra el que corresponde", () => {
    // 10010001101: positions 4-6 are all "0"; deleting the 6th must not
    // clear the 5th or 7th.
    expect(edit(BASE_BINARY, 5, 6, "", "deleteContentBackward")).toEqual({ value: "10010X01101", caret: 5 });
  });

  it("escribir sobre una selección la reemplaza y deja X en el resto", () => {
    expect(edit(BASE_BINARY, 2, 6, "1", "insertText")).toEqual({ value: "101XXX01101", caret: 3 });
  });

  it("pegar varios dígitos sobrescribe desde el cursor", () => {
    expect(edit(BASE_BINARY, 2, 2, "111", "insertFromPaste")).toEqual({ value: "10111001101", caret: 5 });
    expect(edit(BASE_BINARY, 9, 9, "0000", "insertFromPaste")).toEqual({ value: "10010001100", caret: 11 });
    expect(edit(BASE_BINARY, 2, 2, "1 a-1", "insertFromPaste")).toEqual({ value: "10110001101", caret: 4 });
  });

  it("otros caracteres se ignoran", () => {
    expect(edit(BASE_BINARY, 4, 4, "a", "insertText")).toEqual({ value: BASE_BINARY, caret: 4 });
  });
});

describe("leyenda de la grilla", () => {
  it.each(GRID_LEGEND.map((item) => [item.label, item]))("%s marca justo las celdas de su grupo", (label, item) => {
    for (const row of GRID_ROWS) {
      row.forEach((cell, col) => {
        const selections = selectionsFromCell(cell, GRID_HEADERS[col]);
        const inGroup = item.classes.every((c) => cell.classes.includes(c));
        const coinsMatch = Object.entries(item.coins).every(([i, side]) => selections[i] === side);
        expect(coinsMatch, `${cell.text} ${GRID_HEADERS[col]}`).toBe(inGroup);
        if (inGroup) {
          const mbti = mbtiTypeFromCell(cell);
          expect(mbti[0] + mbti[3], `${cell.text} ${GRID_HEADERS[col]}`).toBe(label[0] + label[3]);
        }
      });
    }
  });
});
