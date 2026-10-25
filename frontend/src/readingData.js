// Reading tab content: one entry per coin, in Elimination Tool order, plus
// the two modalities (see como-se-lee.md, 2.2 and 4.4). The array order
// matches the app state: entries 0-8 are `selections[0..8]` and entries
// 9-10 are `extraSelections[0..1]`. `faces` is [left, right] in long-form
// notation, and `sides` is keyed by those same codes.
//
// The card texts are placeholders until CognitiveNotes delivers the real
// ones: replace the PENDING values in place and keep the field names.

export const PENDING = "Texto pendiente (lo escribe CognitiveNotes).";

function side(title) {
  return {
    title,
    definition: PENDING,
    contrast: PENDING,
    everyday: [PENDING],
    pitfalls: [PENDING],
    crossChecks: [PENDING],
  };
}

export const COIN_READINGS = [
  {
    coin: 1,
    name: "Observer / Decider",
    decides: "Si la 1ª Savior es de percepción (Observer: N/S) o de juicio (Decider: F/T).",
    faces: ["O", "D"],
    sides: { O: side("Observer"), D: side("Decider") },
  },
  {
    coin: 2,
    name: "Di / De",
    decides: "La orientación de la Savior Decider: hacia uno mismo (Fi/Ti) o hacia la tribu (Fe/Te).",
    faces: ["Di", "De"],
    sides: { Di: side("Decider introvertido"), De: side("Decider extravertido") },
  },
  {
    coin: 3,
    name: "Oi / Oe",
    decides: "La orientación de la Savior Observer: organizar lo conocido (Ni/Si) o recolectar lo nuevo (Ne/Se).",
    faces: ["Oi", "Oe"],
    sides: { Oi: side("Observer introvertido"), Oe: side("Observer extravertido") },
  },
  {
    coin: 4,
    name: "N / S",
    decides: "La letra de la Savior Observer: Intuición o Sensación.",
    faces: ["N", "S"],
    sides: { N: side("Intuición"), S: side("Sensación") },
  },
  {
    coin: 5,
    name: "F / T",
    decides: "La letra de la Savior Decider: Sentimiento o Pensamiento.",
    faces: ["F", "T"],
    sides: { F: side("Sentimiento"), T: side("Pensamiento") },
  },
  {
    coin: 6,
    name: "Sleep / Play",
    decides: "Cuál de los dos animales, Sleep o Play, está entre los dos primeros.",
    faces: ["S", "P"],
    sides: { S: side("Sleep"), P: side("Play") },
  },
  {
    coin: 7,
    name: "Consume / Blast",
    decides: "Cuál de los dos animales, Consume o Blast, está entre los dos primeros.",
    faces: ["C", "B"],
    sides: { C: side("Consume"), B: side("Blast") },
  },
  {
    coin: 8,
    name: "Info / Energy",
    decides: "El último animal: Sleep o Play último da Info; Consume o Blast último da Energy.",
    faces: ["INFO", "ENERGY"],
    sides: { INFO: side("Info"), ENERGY: side("Energy") },
  },
  {
    coin: 9,
    name: "Introvertido / Extravertido",
    decides: "El último animal: Play o Blast último da Introvertido; Sleep o Consume último da Extravertido.",
    faces: ["I", "E"],
    sides: { I: side("Introvertido"), E: side("Extravertido") },
  },
  {
    coin: 10,
    name: "Sensorial F / M",
    decides: "Si la función Sensorial es Femenina o Masculina.",
    faces: ["F-S", "M-S"],
    toggles: ["weak", "strong"],
    sides: { "F-S": side("Sensorial femenina"), "M-S": side("Sensorial masculina") },
  },
  {
    coin: 11,
    name: "De F / M",
    decides: "Si el Decider extravertido es Femenino o Masculino: cómo ve a la tribu y cómo se ve frente a ella.",
    faces: ["F-De", "M-De"],
    toggles: ["cat", "dog"],
    sides: { "F-De": side("De femenino"), "M-De": side("De masculino") },
  },
];

export const MAIN_COIN_COUNT = 9;
