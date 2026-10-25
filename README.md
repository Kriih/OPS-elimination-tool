# OPS Elimination Tool

**Versión publicada:** https://kriih.github.io/OPS-elimination-tool/

Interfaz en React para el "Elimination Tool" del sistema Objective Personality (OPS): una serie de toggles binarios que van descartando columnas de la grilla de 128 tipos hasta llegar a un código de tipo concreto.

## Cómo correrlo

Requiere Node.js (probado con v20 y v24).

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173/OPS-elimination-tool/`. La ruta lleva ese prefijo porque el `base` de Vite está fijado para GitHub Pages. Si el puerto 5173 está ocupado, Vite usa el siguiente libre (5174, …).

## Tests

```bash
cd frontend
npm test
```

Corre con Vitest los tests del parser y validador de códigos (`src/typeCode.test.js`) contra la grilla de 128 tipos.

## Publicar en GitHub Pages

```bash
cd frontend
npm run deploy
```

Compila con `vite build` y sube `dist/` a la rama `gh-pages`.

## Qué incluye

- **Elimination Tool**: 9 filas de toggles (O/D, Di/De, Oi/Oe, N/S, F/T, Sleep/Play, Consume/Blast, Info/Energy, I/E). Cada una se puede desmarcar.
- **Modalidades F/M**: dos filas extra ("weak/strong", "cat/dog") que no afectan la grilla y solo aportan un prefijo de 2 letras al código final.
- **Type Grid**: la grilla de 128 tipos (8 funciones × 16 códigos de animal), portada de [alexanderehelmer.github.io](https://alexanderehelmer.github.io/). Las columnas incompatibles con los toggles marcados se desvanecen en vivo, y al hacer clic en una celda se fijan los toggles de ese tipo.
- **Código resultante**: código MBTI estimado más el código de tipo (ej. `INTJ MF-Ni/Te-BS/P(C)`; la I/E del MBTI sale de la primera función). Si quedan varios candidatos, se combinan sus códigos y aparece `_` en las posiciones en que difieren.
- **Binario editable**: un binario de 11 dígitos (con `X` para los toggles sin marcar) que se puede editar como texto para fijar los toggles. Tanto el código como el binario tienen botón de copiar.
- **Caja para pegar**: acepta un código completo, en forma corta (`MF-Ni/Fe-BP/C(S)`) o larga (`O/De/Oi/N/F/P/B/INFO/E/M-S/F-De`), un código parcial (ej. `Ti/Ne-CS/B(P)`) o un binario, y marca los toggles correspondientes.
- **Reset**: botón debajo de los toggles que los desmarca todos.
- **Tabs Checklist / Traits / Interpretation / Emoji**: el checklist completo (Human Needs, Letters, Functions, Animals, Modalities), sus interpretaciones y el animal-totem resultante con emoji, más una curva normal con los 16 animales según su puntaje. Basado en [subjectivepersonality.com](https://app.subjectivepersonality.com/).

Para notas de diseño, conceptos de OPS y decisiones no obvias, ver [`contexto.md`](contexto.md).

## Carpeta `backend/`

Contiene una API en Python (FastAPI) de un proyecto anterior (generación de fractales). El frontend actual no la usa; se dejó el código por si se quiere retomar.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
