# Contexto del proyecto — OPS Elimination Tool

Este archivo es para retomar el proyecto en otra sesión (de Claude Code o de
cualquier otra persona). Reúne qué es el proyecto, cómo correrlo, dónde vive
cada cosa, y las decisiones/trampas no obvias que costó descubrir.

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

- El sandbox de Claude Code en esta máquina **no tiene Node.js** en su
  PATH ni en su filesystem visible. Node SÍ está instalado en el *host*
  real en `~/.local/opt/node/bin` (node v20.17), pero esa ruta tampoco es
  visible directamente desde el sandbox.
- Para correr cualquier comando de `npm`/`node`, hay que usar
  `/app/bin/host-spawn` (delega el comando al shell real del host) y
  agregar `~/.local/opt/node/bin` al `PATH` a mano, ej:
  ```bash
  /app/bin/host-spawn bash -lc 'export PATH=/home/cro/.local/opt/node/bin:$PATH; cd /home/cro/Desktop/OPS/frontend && npm run dev'
  ```
- El sandbox y el host **comparten red** (localhost:5173 es accesible
  desde ambos lados), pero **no comparten todo el filesystem** — el
  sandbox ve `~/Desktop` pero no `~/.local`. Para copiar archivos entre
  ambos (ej. screenshots) hay que pasar por una carpeta compartida como
  `~/Desktop/OPS` usando `host-spawn ... cp ...`.
- El servidor de dev corre en background en el *host* (con `nohup ... &
  disown`), así que sobrevive a que termine la sesión de Claude Code, pero
  **no sobrevive a un reinicio de la máquina** — si `curl localhost:5173`
  falla, hay que volver a levantarlo con el comando de arriba.
- No hay `gh` (GitHub CLI) instalado. Git normal sí, y ya tiene
  credenciales guardadas (`credential.helper=store`, usuario `Kriih`), así
  que `git push` funciona directo sin pedir nada.
- El token de git guardado **no tiene el scope `workflow`**, así que no se
  puede pushear/editar `.github/workflows/*.yml` por git normal (GitHub lo
  rechaza). Por eso `.github/workflows/deploy.yml` existe localmente pero
  quedó **sin trackear en git** (ver `.gitignore`/estado del repo) — es un
  workflow de GitHub Actions ya armado para deploy automático a Pages, pero
  no se puede subir hasta que el usuario regenere su token con ese scope.
  Mientras tanto, publicar es manual con `npm run deploy` (ver arriba).
- Para tomar capturas de pantalla de la app sin navegador visible, se usó
  Firefox headless desde el host (con perfil temporal aislado porque solo
  puede haber una instancia normal de Firefox corriendo a la vez):
  ```bash
  /app/bin/host-spawn bash -lc 'rm -rf /tmp/ffprofileX; mkdir -p /tmp/ffprofileX; firefox --headless -no-remote -profile /tmp/ffprofileX --window-size=1000,1600 --screenshot=/tmp/shot.png "http://localhost:5173/OPS-elimination-tool/"'
  ```

## Estructura del código (`frontend/src/`)

- **`App.jsx`** — todo el componente principal y el layout de la página.
- **`typeGrid.js`** — los datos "duros" del sistema: la grilla de 128 tipos
  (`GRID_ROWS`/`GRID_HEADERS`), las reglas de qué se desvanece con cada
  toggle (`FADE_RULES`), la regla de Introvertido/Extrovertido
  (`isIntrovertHeader`), el cálculo del código MBTI (`mbtiTypeFromCell`), el
  parser de código pegado / clic en la grilla (`parsePastedCode`,
  `selectionsFromCell`), y la tabla de animales-totem con emoji (`TOTEMS`).
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
  del sistema OPS real (`De Feminine/Masculine` y `S Feminine/Masculine`).
  Por convención (la misma que usa subjectivepersonality.com en su
  parámetro `m=`), el orden es **[De F/M][S F/M]** — por eso
  `weak/strong` se interpreta como el eje De y `cat/dog` como el eje S en
  el checklist, aunque las etiquetas visibles de esos toggles las eligió
  el usuario y no se renombraron.
- **Código de tipo** (ej. `MF-Ni/Te-BS/P(C)`): `[modalidad FM]-[par de
  funciones]-[header de columna con la 4ta letra entre paréntesis]`.
- **Código MBTI** (ej. `ENTP`, se antepone al código de tipo): N/S y F/T
  salen directo de las 2 funciones del par. **I/E reutiliza la regla de
  arriba** (última posición del ranking de animales), no la regla clásica
  de MBTI (que no funciona para los pares "del mismo signo" Sleep/Play,
  donde ninguna de las 2 funciones es extrovertida). **J/P sale del eje
  primario de la celda**: Oi→J, Oe→P, Di→P, De→J — es la misma regla que
  usa la leyenda de la grilla original (`ExxP`/`IxxJ`/`ExxJ`/`IxxP`), y es
  la única que funciona también para Sleep/Play.
- **Ambiguo / sin coincidencia**: si quedan 0 o más de 1 celda sin
  desvanecer en la grilla (según las coins marcadas), el código de tipo
  muestra `(sin coincidencia)` o `(ambiguo)` en vez de un tipo concreto.

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

- Le gusta poder **deseleccionar** cualquier toggle (volver a `null`/`X`),
  no forzar que todo esté siempre definido.
- Pidió explícitamente **compresión vertical** (poco padding, todo
  compacto) y **sin verde** en la paleta — solo la familia de rojo
  `#b53241`.
- Antes de dar por buena una tanda de cambios, conviene levantar el dev
  server y sacar una captura (headless Firefox) para confirmar visualmente
  — no alcanza con que compile.
- Los cambios se suben a git solo cuando el usuario lo pide explícitamente
  ("sube los cambios", "súbelo a GitHub"), no automáticamente después de
  cada tanda de ediciones.
