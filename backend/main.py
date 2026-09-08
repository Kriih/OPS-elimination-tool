import io

import numpy as np
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from PIL import Image

app = FastAPI(title="Fractal Explorer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

MAX_WIDTH = 1200
MAX_HEIGHT = 900
MAX_ITER_LIMIT = 1000

# Color palette stops (position 0..1 -> RGB). Classic smooth fractal gradient.
PALETTES = {
    "classic": [
        (0.0, (0, 7, 100)),
        (0.16, (32, 107, 203)),
        (0.42, (237, 255, 255)),
        (0.6425, (255, 170, 0)),
        (0.8575, (0, 2, 0)),
        (1.0, (0, 7, 100)),
    ],
    "fire": [
        (0.0, (0, 0, 0)),
        (0.25, (120, 0, 0)),
        (0.5, (237, 100, 0)),
        (0.75, (255, 210, 60)),
        (1.0, (255, 255, 255)),
    ],
    "ocean": [
        (0.0, (0, 5, 20)),
        (0.3, (0, 40, 90)),
        (0.6, (0, 120, 160)),
        (0.85, (120, 220, 220)),
        (1.0, (255, 255, 255)),
    ],
    "grayscale": [
        (0.0, (0, 0, 0)),
        (1.0, (255, 255, 255)),
    ],
}

LUT_SIZE = 2048


def build_lut(palette_name: str) -> np.ndarray:
    stops = PALETTES.get(palette_name, PALETTES["classic"])
    positions = np.array([s[0] for s in stops])
    colors = np.array([s[1] for s in stops], dtype=np.float64)
    t = np.linspace(0.0, 1.0, LUT_SIZE)
    lut = np.zeros((LUT_SIZE, 3), dtype=np.float64)
    for channel in range(3):
        lut[:, channel] = np.interp(t, positions, colors[:, channel])
    return lut.astype(np.uint8)


def escape_time(
    c_grid: np.ndarray,
    z0_grid: np.ndarray,
    max_iter: int,
) -> tuple[np.ndarray, np.ndarray]:
    """Vectorized escape-time computation with smooth (continuous) coloring."""
    z = z0_grid.copy()
    div_time = np.full(c_grid.shape, float(max_iter))
    still_inside = np.ones(c_grid.shape, dtype=bool)

    for i in range(max_iter):
        z[still_inside] = z[still_inside] * z[still_inside] + c_grid[still_inside]
        escaped_now = still_inside & (np.abs(z) > 2)
        if np.any(escaped_now):
            abs_z = np.abs(z[escaped_now])
            log_zn = np.log(np.maximum(abs_z, 1e-10))
            nu = np.log(log_zn / np.log(2)) / np.log(2)
            div_time[escaped_now] = (i + 1) - nu
        still_inside &= ~escaped_now
        if not still_inside.any():
            break

    return div_time, still_inside


def render_fractal(
    fractal_type: str,
    width: int,
    height: int,
    center_x: float,
    center_y: float,
    zoom: float,
    max_iter: int,
    julia_re: float,
    julia_im: float,
    palette: str,
) -> Image.Image:
    aspect = width / height
    base_span = 3.0 / max(zoom, 1e-9)
    x_span = base_span
    y_span = base_span / aspect

    xmin, xmax = center_x - x_span / 2, center_x + x_span / 2
    ymin, ymax = center_y - y_span / 2, center_y + y_span / 2

    x = np.linspace(xmin, xmax, width)
    y = np.linspace(ymin, ymax, height)
    xx, yy = np.meshgrid(x, y)
    grid = xx + 1j * yy

    if fractal_type == "julia":
        c_grid = np.full(grid.shape, complex(julia_re, julia_im))
        z0_grid = grid
    else:
        c_grid = grid
        z0_grid = np.zeros_like(grid)

    div_time, still_inside = escape_time(c_grid, z0_grid, max_iter)

    lut = build_lut(palette)
    cyclic_scale = 12.0
    idx = (div_time * cyclic_scale).astype(np.int64) % LUT_SIZE
    rgb = lut[idx]
    rgb[still_inside] = (0, 0, 0)

    return Image.fromarray(rgb.astype(np.uint8), mode="RGB")


@app.get("/api/fractal")
def get_fractal(
    type: str = Query("mandelbrot", pattern="^(mandelbrot|julia)$"),
    width: int = Query(800, ge=100, le=MAX_WIDTH),
    height: int = Query(600, ge=100, le=MAX_HEIGHT),
    max_iter: int = Query(150, ge=1, le=MAX_ITER_LIMIT),
    center_x: float = Query(-0.5),
    center_y: float = Query(0.0),
    zoom: float = Query(1.0, gt=0),
    julia_re: float = Query(-0.7),
    julia_im: float = Query(0.27015),
    palette: str = Query("classic"),
):
    if palette not in PALETTES:
        raise HTTPException(status_code=400, detail=f"Unknown palette '{palette}'")

    image = render_fractal(
        fractal_type=type,
        width=width,
        height=height,
        center_x=center_x,
        center_y=center_y,
        zoom=zoom,
        max_iter=max_iter,
        julia_re=julia_re,
        julia_im=julia_im,
        palette=palette,
    )

    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return Response(content=buffer.getvalue(), media_type="image/png")


@app.get("/api/palettes")
def get_palettes():
    return {"palettes": list(PALETTES.keys())}
