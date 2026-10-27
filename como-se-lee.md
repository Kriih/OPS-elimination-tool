# Pestaña "Cómo se lee": plan y especificación

> Para pegar en la raíz de `OPS-elimination-tool/`. Viene del proyecto `CognitiveNotes` (`/home/cri/Projects/CognitiveNotes`). El flujo completo está en `workflow/01 - Lectura del tipo/` de ese repo.
> Fecha: 2026-10-24 · Estado: **plan para revisar, todavía sin implementar**.

## 1. Qué se quiere hacer

Sumar a la app una lectura explicada del resultado. Dado un tipo, por ejemplo:

```
Código corto:  MF-Ni/Fe-BP/C(S)
Monedas:       O/De/Oi/N/F/P/B/INFO/E/M-S/F-De
Escala:        [I/E][-7,7]: +6 Extraversion
```

la app muestra dos cosas:

1. **Cómo se lee:** una ficha por cada moneda que salió, en el orden de la Elimination Tool, que explica qué significa ese lado y en qué se diferencia del opuesto.
2. **Ficha del tipo:** la lectura de las cuatro funciones del stack (para Ni/Fe: Ni, Fe, Ti, Se) con un diagrama de **molécula**: un nodo por función y aristas que muestran cómo se conectan.

División del trabajo:
- **CognitiveNotes** escribe el contenido (las fichas), basado en sus documentos de OPS, en Jung y en el PDF "OPS traducido".
- **Esta app** tiene el código: regex, parser, validador, la pestaña y el diagrama.

## 2. Las dos notaciones

### 2.1 Forma corta (la que ya usa la app)

```
MF-Ni/Fe-BP/C(S)
││ │  │  ││ │ └─ 4º animal (último)
││ │  │  ││ └─── 3º animal
││ │  │  │└───── 2º animal (en el ejemplo, Play = doblemente activado)
││ │  │  └────── 1º animal (el que forman las dos Savior)
││ │  └───────── 2ª Savior
││ └──────────── 1ª Savior
│└────────────── 2ª letra: De M/F   (F = Feminine extraverted Decider)
└─────────────── 1ª letra: Sensorial M/F (M = Masculine Sensory)
```

Sufijo opcional que todavía no está en la app: el tipo social, ` #1` a ` #4`.

**Orden de las modalidades (confirmado por el usuario el 2026-10-24):** la 1ª letra es la **sensorial** y la 2ª es el **De**. `MF` = Masculine Sensory + Feminine extraverted Decider. **Corregido en la app el 2026-10-25:** `weak/strong` es el eje S (1ª letra) y `cat/dog` el eje De (2ª letra). Ver 5.1.

### 2.2 Forma larga: las 11 monedas

Es el resultado moneda por moneda, en el orden de la Elimination Tool, más las dos modalidades:

| # | Moneda | Lados | En el ejemplo | Se deriva de |
|---|---|---|---|---|
| 1 | Observer / Decider | `O` · `D` | `O` | si la 1ª Savior es S/N u F/T |
| 2 | Di / De | `Di` · `De` | `De` | orientación de la Savior Decider |
| 3 | Oi / Oe | `Oi` · `Oe` | `Oi` | orientación de la Savior Observer |
| 4 | N / S | `N` · `S` | `N` | letra de la Savior Observer |
| 5 | F / T | `F` · `T` | `F` | letra de la Savior Decider |
| 6 | Sleep / Play | `S` · `P` | `P` | cuál de los dos está entre los 2 primeros animales |
| 7 | Consume / Blast | `C` · `B` | `B` | ídem |
| 8 | Info / Energy | `INFO` · `ENERGY` | `INFO` | último animal (ver 3) |
| 9 | Introvertido / Extravertido | `I` · `E` | `E` | último animal (ver 3) |
| 10 | Sensorial M / F | `M-S` · `F-S` | `M-S` | letra de modalidad |
| 11 | De M / F | `M-De` · `F-De` | `F-De` | letra de modalidad |

La forma larga **se deriva entera** de la forma corta. Por eso la idea es tener una sola fuente de verdad (la forma corta) y una función `toLong()`.

### 2.3 La escala de -7 a +7

Es el `score` de `TOTEMS` en `typeGrid.js`: `BP/CS` = Kangaroos = `+6`. El signo coincide con I/E (negativo = introvertido, positivo = extravertido). Falta definir qué significa el valor absoluto (ver 5.3). La pestaña Emoji ya dibuja esa campana de Gauss, y se puede reutilizar.

## 3. Reglas del sistema (para el validador)

Funciones, monedas y animales:

```
Sleep   = Oi + Di      Play  = Oe + De
Consume = Oe + Di      Blast = Oi + De
```

| Regla | Respaldo |
|---|---|
| Las dos Savior son siempre un Observer y un Decider. | Documentos OPS, grilla |
| El animal que forman las dos Savior va **1º**. | **Verificado en las 128 celdas de `GRID_ROWS`** |
| El animal **doblemente activado** es el **opuesto del último**, en la misma moneda: Sleep último ⇒ Play; Play último ⇒ Sleep; Consume último ⇒ Blast; Blast último ⇒ Consume. Puede no ser el 1º: en `BP/C(S)` es Play, en 2º lugar. | Apuntes OPS ("Play Last: Sleep doblemente activado"), confirmado por el usuario |
| Último animal Sleep o Consume ⇒ **E**; Play o Blast ⇒ **I**. | PDF "OPS traducido", `isIntrovertHeader` |
| Último animal Sleep o Play ⇒ **INFO**; Consume o Blast ⇒ **ENERGY**. | **Verificado en las 128 celdas** (clase `e4` = Info, `i4` = Energy) |
| Moneda 6 = cuál de Sleep/Play está entre los dos primeros; moneda 7, ídem con Consume/Blast. | `selectionsFromCell` |
| Cada persona tiene dos funciones masculinas y dos femeninas, en pares. | Documentos OPS (Sexuals) |

> Nota para CognitiveNotes: hay que corregir dos cosas en sus documentos. (1) Dicen que Info/Energy depende de "los animales del medio", pero la grilla muestra que depende del último animal. (2) `Animals.txt` define el doblemente activado como "el que forman las dos Savior", y eso choca con el uso del resto de los apuntes (el opuesto del último).

## 4. Implementación propuesta (a validar con el código actual)

### 4.1 Módulo `src/typeCode.js`

Las dos regex son **estrictas**: aceptan solo un código completo y bien escrito, en mayúsculas y minúsculas exactas (`parse` solo hace `.trim()` antes). Lo tolerante queda para la caja de pegar (ver abajo). Ajustadas y probadas el 2026-10-25.

- **Regex de la forma corta**, con grupos con nombre:

  ```js
  const SHORT_CODE = /^(?:(?<mbti>[IE][NS][FT][JP])\s+)?(?<m1>[FM])(?<m2>[FM])-(?<sav1>[NSFT][ie])\/(?<sav2>[NSFT][ie])-(?<a1>[SPCB])(?<a2>[SPCB])\/(?<a3>[SPCB])\((?<a4>[SPCB])\)(?:\s*#(?<social>[1-4]))?$/;
  ```

  - El **prefijo MBTI es opcional** (`INTJ MF-Ni/Te-BS/P(C)`). Hace falta porque el botón de copiar de la app copia el código con el MBTI adelante; sin ese grupo, la regex no reconocía ninguno de los 512 códigos que copia la app.
  - Probada: reconoce los 512 códigos de la app (128 celdas × 4 modalidades), con y sin MBTI, y el sufijo ` #1`–` #4`.
  - **No** reconoce, a propósito: `_` (código combinado de varios candidatos), modalidades vacías, headers sin paréntesis (`BP/CS`) ni minúsculas.

- **Regex de la forma larga**, sin el flag `/i` del borrador (para que se comporte igual que la corta y no haya que normalizar `di`, `info`, etc. después de reconocerlos):

  ```js
  const LONG_CODE = /^(?<od>O|D)\/(?<d>Di|De)\/(?<o>Oi|Oe)\/(?<ns>N|S)\/(?<ft>F|T)\/(?<sp>S|P)\/(?<cb>C|B)\/(?<ie4>INFO|ENERGY)\/(?<ie>I|E)\/(?<ms>[MF]-S)\/(?<mde>[MF]-De)$/;
  ```

- `parse(code)` devuelve un objeto tipado o una lista de errores.
- `toLong(parsed)` arma la forma larga.
- `validate(parsed)` aplica las reglas de la sección 3. Las regex **aceptan tipos imposibles** (dos Observer como `Ni/Se`, animales repetidos como `BB/B(B)`, o `Fi/Ni` con `BP`) y eso es intencional: si la regex los rechazara, solo diría "no coincide". `validate` da el motivo:
  - Primero, chequeos con mensaje específico: una Savior Observer y una Decider; los cuatro animales, sin repetir; el 1º animal es el que forman las dos Savior.
  - Después, el chequeo de fondo: que `sav1/sav2` exista en `GRID_ROWS` en la columna `a1a2/a3a4`. Eso solo ya cubre todos los imposibles.
  - Si vino el prefijo MBTI, que coincida con `mbtiTypeFromCell` (la I/E del MBTI sale de la **primera función**, no del último animal; ver `contexto.md`).
- **Caja de pegar:** primero prueba `parse`. Si la regex estricta no coincide, sigue con la lógica tolerante de `parsePastedCode` como hoy, para no perder lo que ya acepta (códigos parciales, `_`, MBTI suelto, headers sin paréntesis). `parsePastedCode` **no** se reemplaza.
- Tests: la app no tiene framework de tests. Propuesta: sumar Vitest (combina con Vite). Casos mínimos: el **caso base** `MF-Ni/Fe-BP/C(S)` (con y sin `INFJ` adelante) tiene que dar exactamente la forma larga del ejemplo de la sección 1 y el binario `10010001101`; las 128 celdas × 4 modalidades tienen que pasar `validate`, y una lista de códigos inválidos tiene que fallar con el mensaje esperado.

### 4.2 Pestaña

- Opciones: nueva entrada en `NAV_TABS` ("Cómo se lee") o ampliar "Interpretation". Decidir después de ver qué hace hoy "Interpretation" con `checklistData.js` (`interpretation`, `example`, `opposite`).
- La pestaña recorre la forma larga y muestra la ficha de cada lado que salió. Arriba va la escala con la campana de Gauss marcando la posición del tipo.

#### Tipo incompleto (decidido por el usuario el 2026-10-25)

Estados posibles, según las monedas marcadas y los candidatos que quedan en la grilla:

| Estado | Qué muestra Reading |
|---|---|
| **Tipo resuelto y 11 monedas** | Lectura completa: encabezado, escala, molécula y 11 fichas. |
| **Monedas deducidas** (la grilla deja un solo tipo, o todos los candidatos coinciden en esa moneda, pero el usuario no la marcó) | La ficha normal, con una etiqueta **"deducida"**. |
| **Monedas sin decidir** (los candidatos difieren) | **Los dos lados en contraste** (ej. Sleep vs Play), como ayuda para elegir. Con nada marcado, son las 9 monedas en ese formato. |
| **Grilla resuelta, falta alguna modalidad** | Todo lo demás normal; la ficha de la modalidad que falta dice **"falta elegir"** con un acceso a los toggles (no muestra los dos lados). |
| **Escala de -7 a +7 con el tipo incompleto** | La campana **resalta el rango** de animales todavía posibles. |
| **Molécula con el tipo incompleto** | **Oculta** hasta que se sepan las dos Savior. |

### 4.3 Molécula

- SVG inline en React, como la curva de la pestaña Emoji.
- Cuatro nodos en el orden del stack (1ª a 4ª). Las Savior van más grandes o rellenas y las Demon, huecas o tenues.
- Aristas: Savior–Savior (el par que forma el 1º animal) y los dos ejes de opuestos (en el ejemplo, Ni–Se y Fe–Ti), con su proporción: **90/10** en los polos (1ª–4ª) y **60/40** en el medio (2ª–3ª).

#### Colores de las funciones (decidido por el usuario el 2026-10-24)

El color va por **letra de función**. Es una excepción aprobada a la paleta monocromática roja de la app y vale **solo para los nodos de función** (molécula y fichas). El resto de la interfaz sigue en la familia de `#b53241`.

| Letra | Color | HEX | RGB |
|---|---|---|---|
| N (Ni, Ne) | amarillo | `#E8C547` | `rgb(232, 197, 71)` |
| S (Si, Se) | verde | `#4CAF6E` | `rgb(76, 175, 110)` |
| T (Ti, Te) | azul | `#4A90D9` | `rgb(74, 144, 217)` |
| F (Fi, Fe) | rojo | `#D9534F` | `rgb(217, 83, 79)` |

- **Definirlos en un solo lugar**, como variables CSS en `App.css` (`--fn-n`, `--fn-s`, `--fn-t`, `--fn-f`) y, si hace falta en JS, una constante `FUNCTION_COLORS` que las lea. No escribir los valores a mano en cada componente.
- **Anotarlos en `contexto.md`** (sección de `App.css` / paleta), con la aclaración de que son una excepción aprobada y de que se cambian ahí, para que una sesión futura no los saque pensando que rompen la regla del rojo.
- El rojo de F es distinto del acento `#b53241` de la interfaz, para que un nodo F no se confunda con un elemento de UI.
- La orientación (i/e) no cambia el color. Si se quiere distinguir Ni de Ne, se hace con forma o borde (por ejemplo, relleno sólido para la introvertida y anillo para la extravertida). Esto queda a decidir.

### 4.4 Formato de las fichas (intercambio con CognitiveNotes)

Propuesta: un `src/readingData.js` con la misma lógica que `checklistData.js`:

```js
export const COIN_READINGS = {
  O:    { title: "Observer", coin: 1, opposite: "D", decides: "...", definition: "...", contrast: "...", everyday: ["..."], pitfalls: ["..."], crossChecks: ["..."] },
  De:   { ... },
  Oi:   { ... },
  // ... las 22 caras + "INFO", "ENERGY", "M-S", "F-S", "M-De", "F-De"
};

export const TYPE_READINGS = {
  "Ni/Fe": { mbti: "INFJ", stack: ["Ni", "Fe", "Ti", "Se"], notation: "...", dominant: "...", opposites: "...", functions: { Fe: "...", Ti: "...", Se: "..." }, axes: { "Ni/Se": "...", "Fe/Ti": "..." }, jumper: "..." },
};
```

CognitiveNotes escribe el texto y esta app solo lo muestra. `notation` (notación y sigla) y `opposites` (el problema de los opuestos) se sumaron el 2026-10-25 para cubrir la sección 7; `mbti` y `stack` los calcula la app. El formato pedido a CognitiveNotes está en su `workflow/01 - Lectura del tipo/entrega desde la app 2026-10-25.md`.

## 5. Decisiones pendientes del usuario

1. ~~Orden de las modalidades.~~ **Resuelto y corregido (2026-10-25):** `[Sensorial M/F][De M/F]`. El usuario confirmó que `weak/strong` = S (weak = F) y `cat/dog` = De (cat = F, "F-De los ve como gatitos"). `EXTRA_PAIRS`, el armado del código, el binario y `parsePastedCode` ya respetaban ese orden; lo que estaba invertido eran los `test` de la sección Modalities en `checklistData.js` y la nota de `contexto.md`. Las filas de la UI no se reordenaron.
2. ~~Ubicación de la pestaña.~~ **Resuelto (2026-10-25):** pestaña nueva, llamada **"Reading"** (en inglés como las demás: Checklist, Traits, Interpretation, Emoji). "Interpretation" queda como está.
3. **La escala de -7 a +7:** ¿el valor absoluto significa "qué tan extravertido" o solo el orden del sitio fuente? La ficha `[E]` lo explica según lo que se decida, y si no hay fuente lo marca como interpretación propia.
4. ~~Colores de la molécula.~~ **Resuelto:** N amarillo, S verde, T azul, F rojo (ver 4.3). Orientación i/e: implementada como **disco relleno = introvertida, anillo = extravertida**, y Savior/Demon por tamaño y opacidad (2026-10-25, propuesta de Claude; **a confirmar por el usuario**).
5. **Alcance:** las 22 caras de moneda y los 16 tipos, o primero un piloto (las 11 del ejemplo y Ni/Fe).

## 6. Orden de trabajo sugerido

1. ~~Corregir el orden de las modalidades en la app (5.1) y agregar los colores de función a `App.css` y a `contexto.md`.~~ **Hecho (2026-10-25).**
2. ~~`typeCode.js` con regex, `parse`, `toLong` y `validate`, más los tests contra la grilla.~~ **Hecho (2026-10-25):** también `toShort`, `toSelections` y `selectionsToBinary`; la caja de pegar ya usa `parse` primero. Tests con Vitest (`npm test`).
3. ~~Esqueleto de la pestaña con textos de relleno, para fijar el layout.~~ **Hecho (2026-10-25):** pestaña "Reading" (`ReadingTab.jsx`, `readingData.js`, `TotemCurve.jsx`), con los estados de "Tipo incompleto" de 4.2. La molécula todavía es solo el stack en chips.
4. ~~Molécula en SVG para Ni/Fe.~~ **Hecho (2026-10-25):** `Molecule.jsx`, sirve para cualquiera de los 32 pares.
5. Cargar las fichas que entregue CognitiveNotes (piloto primero).
6. Resto de las fichas y tipos.

## 7. Contenido de las fichas (lo escribe CognitiveNotes; acá solo como referencia)

**Fichas de moneda.** Cada una sigue esta estructura: qué decide la moneda · definición del lado · contraste con el opuesto ("todos pueden X; la diferencia está en…", con ejemplos de una misma situación) · cómo se nota en la vida diaria · confusiones frecuentes al tipar · con qué otras monedas se verifica. Extensión: 250 a 450 palabras. Tono formal, casi académico, pero claro.

Puntos clave del ejemplo:
- `[O]`: Observer/Decider, con su raíz en Jung (funciones irracionales = percepción, racionales = juicio).
- `[De]`: la tribu frente a uno mismo.
- `[Oi]`: organizar y conservar lo conocido frente a recolectar lo nuevo.
- `[N]`: ideas frente a presencia.
- `[F]`: valorar, que no es lo mismo que la emoción.
- `[P]`: gastar energía primero.
- `[B]`: responsabilidad de enseñar a la tribu.
- `[INFO]`: el equilibrio entre aprender y compartir.
- `[E]`: definido por el último animal, con la escala y la campana.
- `[M-S]`: firmeza con lo concreto y memoria de la línea de tiempo. "Masculino" no es género.
- `[F-De]`: cómo ve a la tribu, cómo se ve frente a ella y cómo interactúa.

**Ficha del tipo** (piloto Ni/Fe): notación y sigla (con la advertencia de que la sigla no siempre coincide) · molécula · Ni dominante · el problema de los opuestos (90/10 en los polos, 60/40 en el medio, y que el medio se siente "normal") · Fe, Ti y Se · ejes Ni/Se y Fe/Ti · variante jumper.
