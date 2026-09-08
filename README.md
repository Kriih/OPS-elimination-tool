# OPS Elimination Tool

Interfaz en React para el "Elimination Tool" del sistema Objective Personality (OPS): una serie de toggles binarios que van descartando columnas de la grilla de 128 tipos hasta llegar a un código de tipo concreto.

## Cómo correrlo

Requiere Node.js.

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Qué incluye

- **Elimination Tool**: 9 filas de toggles (O/D, Di/De, Oi/Oe, N/S, F/T, Sleep/Play, Consume/Blast, Info/Energy, I/E), cada una deseleccionable.
- **Modalidades F/M**: dos filas extra ("weak/strong", "cat/dog") que no afectan la grilla, solo aportan un prefijo de 2 letras al código final.
- **Type Grid**: la grilla de 128 tipos (8 funciones × 16 códigos de animal), portada de [alexanderehelmer.github.io](https://alexanderehelmer.github.io/). Las columnas incompatibles con los toggles marcados se desvanecen en vivo.
- **Código resultante y binario editable**: al pie se arma el código de tipo (ej. `MF-Ni/Te-BS/P(C)`) y un binario de 11 dígitos (con `X` para toggles sin marcar) que se puede editar directamente como texto para fijar los toggles.
- **Checklist / Emoji**: barra de navegación al final con el checklist completo (Human Needs, Letters, Functions, Animals, Modalities) y un emoji del animal-totem resultante, basados en [subjectivepersonality.com](https://app.subjectivepersonality.com/).

## Carpeta `backend/`

Contiene una API en Python (FastAPI) de un proyecto anterior (generación de fractales). No la usa el frontend actual; se dejó el código por si se quiere retomar.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
