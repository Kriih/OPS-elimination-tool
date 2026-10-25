import { describe, expect, it } from "vitest";
import { GRID_HEADERS, GRID_ROWS, formatHeaderCode, mbtiTypeFromCell, selectionsFromCell } from "./typeGrid.js";
import { parse, selectionsToBinary, toLong, toSelections, toShort, validate } from "./typeCode.js";

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
