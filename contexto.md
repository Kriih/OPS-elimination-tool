# Contexto del proyecto — OPS Elimination Tool

Este archivo es para retomar el proyecto en otra sesión (de Claude Code o de
cualquier otra persona). Reúne qué es el proyecto, cómo correrlo, dónde vive
cada cosa, y las decisiones/trampas no obvias que costó descubrir.

Plan en curso: ver [`como-se-lee.md`](como-se-lee.md) (pestaña "Cómo se
lee", parser/validador de códigos, molécula, colores de función, y el
orden de trabajo pendiente).

## Qué es esto

Una app React/Vite de una sola página que implementa el **Elimination Tool**
del sistema **Objective Personality (OPS)**: una serie de preguntas
binarias ("coins") que van descartando tipos hasta llegar a uno de los 128
tipos posibles, con una grilla visual, un código de tipo, un código MBTI
estimado, un checklist detallado y un emoji de "animal totem".

No hay backend involucrado — `backend/` es un resto de un proyecto anterior
(un generador de fractales en FastAPI) que no se usa. Todo el proyecto real
vive en `frontend/`.

## Cómo correrlo

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173/OPS-elimination-tool/` (el `base` de Vite está
fijado a `/OPS-elimination-tool/` en `vite.config.js` porque así queda
publicado en GitHub Pages — **no sacar ese base** aunque en dev moleste).

Para publicar la versión estática a GitHub Pages:

```bash
cd frontend
npm run deploy
```

Esto corre `vite build` y usa el paquete `gh-pages` para pushear `dist/` a
la rama `gh-pages` del repo. La página pública queda en:

**https://kriih.github.io/OPS-elimination-tool/**

Repo: **https://github.com/Kriih/OPS-elimination-tool**

### Detalle del entorno de esta máquina (por si hace falta de nuevo)

El proyecto se movió de máquina: antes vivía en `/home/cro/Desktop/OPS`
dentro de un sandbox sin Node (había que usar `/app/bin/host-spawn`).
**Eso ya no aplica.** El entorno actual es:

- Repo en `/home/cri/Projects/OPS-elimination-tool` (Linux, PikaOS).
- Node v24 y npm 12 están en el PATH normal (`/usr/bin/node`); se corren
  directo, sin trucos.
- npm bloquea por defecto el postinstall de `esbuild` ("install scripts
  blocked because they are not covered by allowScripts"). Se puede
  ignorar: Vite funciona igual porque el binario viene por la dependencia
  opcional de plataforma.
- `.claude/launch.json` tiene una configuración `frontend` (`npm --prefix
  frontend run dev`, puerto 5173) para levantar el dev server desde el
  panel de preview de Claude Code.
- **Conflicto de puerto 5173**: en esta máquina también corre el proyecto
  Docker Compose `troppo` (14 contenedores: `troppo_frontend`,
  `troppo_backend`, postgres, rabbitmq, grafana, etc.), y
  `troppo_frontend` ocupa el 5173. Si Vite salta a 5174, es eso. Para
  liberar el puerto (solo si el usuario lo pide):
  ```bash
  docker stop $(docker ps -q --filter label=com.docker.compose.project=troppo)
  ```
  y para volver a levantarlos:
  ```bash
  docker start $(docker ps -aq --filter label=com.docker.compose.project=troppo)
  ```
- `gh` (GitHub CLI) está instalado y logueado como `Kriih`, con scopes
  `repo` y `workflow`. Git usa HTTPS contra
  `https://github.com/Kriih/OPS-elimination-tool.git`.
- En la máquina anterior el token no tenía scope `workflow`, por eso el
  `.github/workflows/deploy.yml` (deploy automático a Pages) nunca se
  subió. **Ese archivo no existe en este checkout**; si se quiere deploy
  automático habría que rearmarlo, y ahora sí se podría pushear.
  Mientras tanto, publicar es manual con `npm run deploy`.
- Para verificar visualmente cambios se usa el navegador integrado de
  Claude Code (panel de preview) sobre
  `http://localhost:5173/OPS-elimination-tool/`, en vez del Firefox
  headless que se usaba antes.

## Estructura del código (`frontend/src/`)

- **`App.jsx`** — todo el componente principal y el layout de la página:
  toggles, grilla clickeable (clic en una celda fija las coins de ese
  tipo), código resultante + binario con botones de copiar casi
  invisibles, caja para pegar un código o binario, y la barra de tabs
  (`NAV_TABS`: Checklist, Traits, Interpretation, Reading, Emoji). Debajo de los
  toggles hay un botón **Reset** que deja todos los toggles en `null` y
  vacía la caja de pegar. El **binario es editable con posiciones
  fijas** (`editBinary` en `typeCode.js`): borrar deja `X` sin correr los
  demás dígitos y escribir/pegar sobrescribe desde el cursor; el campo no
  tiene `maxLength` a propósito (si no, no se podría sobrescribir). La
  **caja de pegar** decide con `readPaste` (`typeCode.js`); si el texto
  tiene forma de código completo pero el tipo no existe, no toca los
  toggles y muestra el motivo debajo (`! ...`, en `--accent-bright`). El tab Emoji
  incluye una curva normal en SVG que ubica los 16 animales-totem según
  su puntaje (-7..+7; `-0` y `+0` se corren a ±0.5 para no superponerse).
- **`TotemCurve.jsx`** — esa curva como componente, compartido por Emoji y
  Reading (`selected`, `showRange` para la banda del rango de candidatos,
  `dimOthers`).
- **`ReadingTab.jsx`** — pestaña "Reading" ("Cómo se lee", ver
  `como-se-lee.md`): encabezado con código corto y largo, escala,
  molécula (`Molecule.jsx`, se muestra cuando se conoce el par de Savior)
  y una ficha por moneda. Cada moneda está `marked`, `deduced` (no
  marcada pero todos los candidatos de la grilla coinciden; etiqueta
  "deducida"), `undecided` (los dos lados en contraste, con botón
  "Elegir") o, solo las modalidades, `missing` ("falta elegir", con
  botones que marcan el toggle).
- **`Molecule.jsx`** — diagrama SVG del stack de funciones: las dos
  Savior arriba unidas por el enlace del 1º animal (ej. "Blast (B)"), y
  cada una sobre su opuesta, con los ejes 1–4 (90/10) y 2–3 (60/40).
  Color del nodo = letra (`--fn-*`); **forma = orientación** (disco
  relleno = introvertida, anillo = extravertida); **Savior/Demon = tamaño
  y opacidad**. El stack sale de `stackOf` en `typeCode.js` (testeado en
  los 32 pares).
- **`readingData.js`** — contenido de las fichas (`COIN_READINGS`, en el
  orden de la Elimination Tool + las 2 modalidades; `sides` indexado por
  el código de la forma larga). Los textos son `PENDING` hasta que
  CognitiveNotes entregue los reales: se reemplazan ahí, sin tocar los
  nombres de los campos.
- **`typeGrid.js`** — los datos "duros" del sistema: la grilla de 128 tipos
  (`GRID_ROWS`/`GRID_HEADERS`), las reglas de qué se desvanece con cada
  toggle (`FADE_RULES`), la regla de Introvertido/Extrovertido
  (`isIntrovertHeader`), el cálculo del código MBTI (`mbtiTypeFromCell`), el
  parser de código pegado / clic en la grilla (`parsePastedCode`,
  `selectionsFromCell`), y la tabla de animales-totem con emoji (`TOTEMS`).
- **`typeCode.js`** — parser y validador **estricto** de códigos
  completos, en forma corta (`MF-Ni/Fe-BP/C(S)`, con MBTI y ` #1`–` #4`
  opcionales) y larga (`O/De/Oi/N/F/P/B/INFO/E/M-S/F-De`): `SHORT_CODE`,
  `LONG_CODE`, `parse`, `validate` (mensajes legibles: dos Observer,
  animales repetidos, 1º animal incorrecto, 2º animal opuesto al 1º, MBTI
  que no coincide; al final busca la celda en `GRID_ROWS`), `toShort`,
  `toLong`, `toSelections` (estado de toggles de la app) y
  `selectionsToBinary` (el binario que muestra la app). La caja de pegar
  usa `readPaste`: binario (aunque sea parcial) → se aplica; texto que
  calza con `SHORT_CODE`/`LONG_CODE` → `parse` + `validate`, y si da
  motivos se muestran sin tocar los toggles (**nunca** pasa al parser
  tolerante, que cargaba otro tipo); cualquier otra cosa →
  `parsePastedCode` (tolerante: parciales, `_`, headers sueltos).
  `editBinary` aplica una edición del campo binario con posiciones fijas.
- **`typeCode.test.js`** — tests con Vitest (`npm test` en `frontend/`):
  caso base, las 512 combinaciones de la grilla (ida y vuelta corta↔larga,
  MBTI, y que `toSelections` coincida con el clic en la grilla), códigos
  inválidos con su mensaje, y un barrido de los 65.536 códigos corto
  sintácticamente válidos para confirmar que `validate` siempre da un
  motivo específico.
- **`checklistData.js`** — el contenido completo del tab "Checklist"
  (títulos, descripciones, y las interpretaciones/ejemplos del tab
  "Interpretation"), organizado en 5 secciones (Human Needs, Letters,
  Functions, Animals, Modalities). Cada ítem tiene un `test` que dice cómo
  saber si está marcado, y un `opposite` que apunta al ítem contrario.
- **`App.css`** — todos los estilos. Paleta monocromática basada en un solo
  tono de rojo (`#b53241`) con variantes (`--accent`, `--accent-bright`,
  `--accent-dim`, `--accent-pale`) — **el usuario pidió explícitamente que
  no haya verde ni otros colores de acento**, solo esa familia de rojo más
  los neutros. Fuente monoespaciada en toda la app (se le pidió imitar el
  "design language" de la propia interfaz de Claude Code: fondo casi
  negro, texto monoespaciado, viñetas `●` de color antes de los títulos,
  botones tipo pill).
  **Excepción aprobada (2026-10-24):** los colores por letra de función,
  definidos en `:root` de `App.css` como `--fn-n` (N, amarillo `#e8c547`),
  `--fn-s` (S, verde `#4caf6e`), `--fn-t` (T, azul `#4a90d9`) y `--fn-f`
  (F, rojo `#d9534f`, distinto del acento de UI a propósito). Valen
  **solo para los nodos de función** (molécula y fichas de "Cómo se lee",
  ver `como-se-lee.md` 4.3); el resto de la interfaz sigue en la familia
  de `#b53241`. No sacarlos pensando que rompen la regla del rojo, y si
  hay que cambiarlos, cambiarlos ahí. La orientación i/e no cambia el
  color.
- **`App.fractal.jsx`** — código del proyecto anterior (un fractal de
  líneas), sin usar, dejado como backup por si se quiere recuperar.

## Conceptos de OPS que hay que conocer para tocar este código

- **Coin / toggle**: cada una de las 9 filas de la Elimination Tool es una
  pregunta binaria (izquierda vs derecha) sobre un rasgo de personalidad.
  Se pueden dejar sin marcar (estado `null`, se muestra como `X` en el
  binario).
- **O/D** (Observer/Decider), **Di/De** (Decider Introvertido/Extrovertido,
  funciones Fi/Ti vs Fe/Te), **Oi/Oe** (Observer Introvertido/Extrovertido,
  funciones Ni/Si vs Ne/Se), **N/S**, **F/T**: los 5 ejes que determinan
  exactamente 1 de 32 pares de funciones posibles (ej. "Ni/Fe").
- **Sleep/Play** (fila "S/P") y **Consume/Blast** (fila "C/B"): NO son la
  misma cosa que Oi/Oe+Di/De directamente — indican cuáles 2 de los 4
  "animales" (Sleep, Consume, Blast, Play) están en el **par líder** del
  ranking de 4 animales de la persona (columna de la grilla, ej.
  "SC/BP"). La clase interna que lo codifica en cada celda es
  `cs`/`sb`/`cp`/`pb` (par de animales sin importar el orden).
- **Info/Energy**: eje aparte, codificado como clase `i4`/`e4` en cada
  celda (⚠️ nombres confusos heredados del sitio fuente: clase `e4` =
  Info, clase `i4` = Energy — es contraintuitivo pero está verificado).
- **I/E (fila 9, "Introverted/Extroverted")**: **no** se deriva de las
  funciones ni de Oi/Oe — depende de cuál animal queda **último/más débil**
  en el ranking de 4: si el último es Blast o Play → Introvertido; si es
  Sleep o Consume → Extrovertido. Equivalente: mirar la ÚLTIMA letra del
  header de columna (ej. "SC/BP" termina en P → Introvertido). Esto está
  confirmado tanto por el usuario como por el texto original del PDF
  ("Play or Blast last" = Introverted).
- **Modalidades F/M** (filas extra "weak/strong" y "cat/dog", debajo de la
  Elimination Tool): son proxies del eje Femenino/Masculino de "Sexuales"
  del sistema OPS real. El orden del código es **[S F/M][De F/M]**
  (confirmado por el usuario el 2026-10-25): `MF` = Masculine Sensory +
  Feminine extraverted Decider.
  - `weak/strong` (fila 1, índice 0) = **eje S**: weak = F, strong = M.
    Da la 1ª letra del código y el 1er dígito del binario.
  - `cat/dog` (fila 2, índice 1) = **eje De** (cómo ve a la gente: F-De
    los ve como gatitos): cat = F, dog = M. Da la 2ª letra.
  - El checklist (`checklistData.js`, sección Modalities) usa `index: 0`
    para S y `index: 1` para De. Antes estaba al revés (se asumía
    `[De][S]`, la convención del parámetro `m=` de
    subjectivepersonality.com); no volver a esa lectura.
  - Por pedido del usuario las filas de la UI no se reordenaron ni se
    renombraron.
- **Código de tipo** (ej. `MF-Ni/Te-BS/P(C)`): `[modalidad FM]-[par de
  funciones]-[header de columna con la 4ta letra entre paréntesis]`.
- **Código MBTI** (ej. `INTJ`, se antepone al código de tipo): N/S y F/T
  salen directo de las 2 funciones del par. **I/E sale de la orientación
  de la primera función** (la 1ª Savior): Ni/Te → `I`, Ne/Ti → `E`
  (corregido por el usuario el 2026-10-25; antes se usaba el último
  animal, y eso daba `ENTJ` para Ni/Te). Ojo: **no es lo mismo que la
  moneda 9** (I/E de OPS, que sí depende del último animal), así que un
  tipo puede ser `INFJ` y extravertido en OPS a la vez (ej.
  `Ni/Fe-BP/C(S)`). **J/P sale del eje primario de la celda**: Oi→J,
  Oe→P, Di→P, De→J — es la misma regla que usa la leyenda de la grilla
  original (`ExxP`/`IxxJ`/`ExxJ`/`IxxP`), y es la única que funciona
  también para Sleep/Play.
- **Ambiguo / sin coincidencia**: si no queda ninguna celda sin
  desvanecer, el código muestra `(sin coincidencia)`. Si queda más de
  una, se combinan los códigos de todos los candidatos posición por
  posición (`mergeAmbiguousCode` en `App.jsx`): las letras en que todos
  coinciden se mantienen y las que difieren se reemplazan por `_`.

## Fuentes usadas (para no inventar de nuevo)

- **PDF "OPS traducido"** (provisto por el usuario): texto base de todas
  las descripciones/citas del Elimination Tool, Necesidades Humanas,
  Letras/Funciones específicas, Animales y Sexuales. Es la fuente principal
  de las interpretaciones del tab "Interpretation" y gran parte del
  "Checklist".
- **https://alexanderehelmer.github.io/** (tabla `#grid128`): origen de los
  datos exactos de la grilla de 128 tipos (`GRID_ROWS`/`GRID_HEADERS` en
  `typeGrid.js`) y de la lógica de qué se desvanece con cada coin
  (`FADE_RULES`, portado de su `opScript.js`).
- **https://app.subjectivepersonality.com/analyzer** (OPS Type Analyzer):
  origen de la estructura de tabs (Checklist/Emoji/etc.), el contenido
  textual completo del tab Checklist (capturado vía PDF que pasó el
  usuario), y la tabla de animal-totem + emoji (`TOTEMS`, extraída del
  bundle JS minificado del sitio, variable `vF`/`new Xt(...)`).

## Cosas sintetizadas (no vienen 100% de una fuente verificada)

- **SF/NT/ST/NF** ("Popularity"/"Nerdy"/"Reporter"/"Hippie") y
  **SC/CP/PB/BS** (combos de animales) no aparecen en el PDF de OPS —
  vienen originalmente de subjectivepersonality.com. Sus interpretaciones
  en `checklistData.js` están armadas combinando las descripciones de sus
  componentes individuales (ej. SF = Sensación + Sentimiento) que sí están
  en el PDF, no son citas textuales.
- La sección "Animals" del checklist real de subjectivepersonality.com usa
  una notación de ranking más rara para Sleep/Play/Consume/Blast (etiquetas
  "A"/"S1"/"S2"/"-" en vez de un simple ✓) cuya lógica exacta no se pudo
  verificar con confianza desde el JS minificado — en este proyecto esas
  4 filas usan un ✓/— simple según las coins S/P y C/B, no esa notación.

## Preferencias del usuario a tener en cuenta

- **Caso base para probar cualquier cambio:** `MF-Ni/Fe-BP/C(S)`, con la
  modalidad sensorial M ("audio": `strong`, S Masculine) y De F (`cat`).
  Resultado esperado: código `INFJ MF-Ni/Fe-BP/C(S)`, binario
  `10010001101`, forma larga `O/De/Oi/N/F/P/B/INFO/E/M-S/F-De`, checklist
  con ✓ en S Masculine y De Feminine. Es MBTI `INFJ` pero E en la moneda 9
  de OPS (último animal Sleep).

- Le gusta poder **deseleccionar** cualquier toggle (volver a `null`/`X`),
  no forzar que todo esté siempre definido.
- Pidió explícitamente **compresión vertical** (poco padding, todo
  compacto) y **sin verde** en la paleta — solo la familia de rojo
  `#b53241`.
- Antes de dar por buena una tanda de cambios, conviene levantar el dev
  server y sacar una captura (navegador integrado de Claude Code) para
  confirmar visualmente — no alcanza con que compile.
- Los cambios se suben a git solo cuando el usuario lo pide explícitamente
  ("sube los cambios", "súbelo a GitHub"), no automáticamente después de
  cada tanda de ediciones.
