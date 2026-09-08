import { useEffect, useRef, useState } from "react";

const DEFAULTS = {
  numLines: 3,
  angleBetween: 35,
  initialLength: 140,
  lengthFactor: 0.67,
  maxDepth: 6,
  startAngle: 270,
  palette: "rainbow",
  animate: true,
  rotationSpeed: 15,
  pendulum: false,
  pendulumPeriod: 4,
};

const PALETTES = ["rainbow", "fuego", "hielo", "mono"];
const MAX_LINES_BUDGET = 15000;

function maxDepthFor(numLines) {
  if (numLines <= 1) return 12;
  let total = 0;
  let levelCount = numLines;
  let depth = 0;
  while (total + levelCount <= MAX_LINES_BUDGET && depth < 14) {
    total += levelCount;
    levelCount *= numLines;
    depth += 1;
  }
  return Math.max(1, depth);
}

function colorForDepth(depth, maxDepth, palette) {
  const t = maxDepth > 0 ? depth / maxDepth : 0;
  switch (palette) {
    case "fuego":
      return `hsl(${28 - t * 25}, 100%, ${45 + t * 25}%)`;
    case "hielo":
      return `hsl(${195 + t * 45}, 90%, ${35 + t * 40}%)`;
    case "mono":
      return `hsla(224, 90%, 68%, ${1 - t * 0.65})`;
    case "rainbow":
    default:
      return `hsl(${(t * 300 + depth * 14) % 360}, 85%, 60%)`;
  }
}

function triangleWaveAngle(elapsedSeconds, period) {
  if (period <= 0) return 0;
  const cycle = 2 * period;
  const pos = elapsedSeconds % cycle;
  return pos <= period
    ? (pos / period) * 360
    : 360 - ((pos - period) / period) * 360;
}

function drawFractal(ctx, width, height, opts) {
  const {
    numLines,
    angleBetween,
    initialLength,
    lengthFactor,
    maxDepth,
    startAngle,
    palette,
    rotationAngle,
  } = opts;

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.lineCap = "round";

  const mid = (numLines - 1) / 2;
  const MIN_LENGTH = 0.6;
  let drawn = 0;

  function branch(x, y, angle, length, depth) {
    if (depth > maxDepth) return;
    if (Math.abs(length) < MIN_LENGTH) return;
    if (drawn > MAX_LINES_BUDGET) return;

    for (let i = 0; i < numLines; i += 1) {
      if (drawn > MAX_LINES_BUDGET) break;
      const branchAngle = angle + (i - mid) * angleBetween + rotationAngle;
      const rad = (branchAngle * Math.PI) / 180;
      const nx = x + length * Math.cos(rad);
      const ny = y + length * Math.sin(rad);

      ctx.strokeStyle = colorForDepth(depth, maxDepth, palette);
      ctx.lineWidth = Math.max(0.5, 3.2 - depth * 0.35);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(nx, ny);
      ctx.stroke();
      drawn += 1;

      branch(nx, ny, branchAngle, length * lengthFactor, depth + 1);
    }
  }

  branch(0, 0, startAngle, initialLength, 0);
  ctx.restore();
}

export default function App() {
  const [numLines, setNumLines] = useState(DEFAULTS.numLines);
  const [angleBetween, setAngleBetween] = useState(DEFAULTS.angleBetween);
  const [initialLength, setInitialLength] = useState(DEFAULTS.initialLength);
  const [lengthFactor, setLengthFactor] = useState(DEFAULTS.lengthFactor);
  const [maxDepth, setMaxDepth] = useState(DEFAULTS.maxDepth);
  const [startAngle, setStartAngle] = useState(DEFAULTS.startAngle);
  const [palette, setPalette] = useState(DEFAULTS.palette);
  const [animate, setAnimate] = useState(DEFAULTS.animate);
  const [rotationSpeed, setRotationSpeed] = useState(DEFAULTS.rotationSpeed);
  const [pendulum, setPendulum] = useState(DEFAULTS.pendulum);
  const [pendulumPeriod, setPendulumPeriod] = useState(
    DEFAULTS.pendulumPeriod
  );

  const canvasRef = useRef(null);
  const rotationRef = useRef(0);
  const pendulumTimeRef = useRef(0);
  const lastTRef = useRef(null);
  const angleBetweenDisplayRef = useRef(null);

  const depthLimit = maxDepthFor(numLines);

  useEffect(() => {
    if (maxDepth > depthLimit) setMaxDepth(depthLimit);
  }, [depthLimit, maxDepth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    let raf;

    function resizeCanvas() {
      const parent = canvas.parentElement;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
      }
      return { w, h };
    }

    function render(t) {
      const { w, h } = resizeCanvas();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (animate) {
        if (lastTRef.current != null) {
          const dt = (t - lastTRef.current) / 1000;
          if (pendulum) {
            pendulumTimeRef.current += dt;
          } else {
            rotationRef.current += dt * rotationSpeed;
          }
        }
        lastTRef.current = t;
      } else {
        lastTRef.current = null;
      }

      const liveAngleBetween = pendulum
        ? triangleWaveAngle(pendulumTimeRef.current, pendulumPeriod)
        : angleBetween;
      if (pendulum && angleBetweenDisplayRef.current) {
        angleBetweenDisplayRef.current.textContent = `${liveAngleBetween.toFixed(0)}°`;
      }

      drawFractal(ctx, w, h, {
        numLines,
        angleBetween: liveAngleBetween,
        initialLength,
        lengthFactor,
        maxDepth,
        startAngle,
        palette,
        rotationAngle: pendulum ? 0 : rotationRef.current,
      });

      if (animate) raf = requestAnimationFrame(render);
    }

    raf = requestAnimationFrame(render);

    function onResize() {
      const { w, h } = resizeCanvas();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const liveAngleBetween = pendulum
        ? triangleWaveAngle(pendulumTimeRef.current, pendulumPeriod)
        : angleBetween;
      drawFractal(ctx, w, h, {
        numLines,
        angleBetween: liveAngleBetween,
        initialLength,
        lengthFactor,
        maxDepth,
        startAngle,
        palette,
        rotationAngle: pendulum ? 0 : rotationRef.current,
      });
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [
    numLines,
    angleBetween,
    initialLength,
    lengthFactor,
    maxDepth,
    startAngle,
    palette,
    animate,
    rotationSpeed,
    pendulum,
    pendulumPeriod,
  ]);

  const handleReset = () => {
    setNumLines(DEFAULTS.numLines);
    setAngleBetween(DEFAULTS.angleBetween);
    setInitialLength(DEFAULTS.initialLength);
    setLengthFactor(DEFAULTS.lengthFactor);
    setMaxDepth(DEFAULTS.maxDepth);
    setStartAngle(DEFAULTS.startAngle);
    setPalette(DEFAULTS.palette);
    setAnimate(DEFAULTS.animate);
    setRotationSpeed(DEFAULTS.rotationSpeed);
    setPendulum(DEFAULTS.pendulum);
    setPendulumPeriod(DEFAULTS.pendulumPeriod);
    rotationRef.current = 0;
    pendulumTimeRef.current = 0;
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Fractal de Líneas</h1>
        <p>
          Un punto central emite líneas que se repiten en cada iteración según
          el ángulo y el factor de largo. Juega con las variables y actívale
          rotación para verlo evolucionar en el tiempo.
        </p>
      </header>

      <div className="layout">
        <aside className="panel">
          <div className="field">
            <label>
              Líneas por punto: <span>{numLines}</span>
            </label>
            <input
              type="range"
              min="2"
              max="16"
              value={numLines}
              onChange={(e) => setNumLines(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label>
              Ángulo entre líneas:{" "}
              {pendulum ? (
                <span ref={angleBetweenDisplayRef}>{angleBetween}°</span>
              ) : (
                <span>{angleBetween}°</span>
              )}
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={angleBetween}
              disabled={pendulum}
              onChange={(e) => setAngleBetween(Number(e.target.value))}
            />
            {pendulum && (
              <span className="field-note">
                Controlado por el modo péndulo
              </span>
            )}
          </div>

          <div className="field">
            <label>
              Ángulo inicial: <span>{startAngle}°</span>
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={startAngle}
              onChange={(e) => setStartAngle(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label>
              Largo inicial: <span>{initialLength}px</span>
            </label>
            <input
              type="range"
              min="10"
              max="300"
              value={initialLength}
              onChange={(e) => setInitialLength(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label>
              Factor de largo por iteración: <span>{lengthFactor.toFixed(2)}x</span>
            </label>
            <input
              type="range"
              min="-4"
              max="4"
              step="0.01"
              value={lengthFactor}
              onChange={(e) => {
                const v = Number(e.target.value);
                setLengthFactor(Math.abs(v) < 0.05 ? (v < 0 ? -0.05 : 0.05) : v);
              }}
            />
          </div>

          <div className="field">
            <label>
              Iteraciones: <span>{maxDepth}</span>
            </label>
            <input
              type="range"
              min="1"
              max={depthLimit}
              value={maxDepth}
              onChange={(e) => setMaxDepth(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label>Paleta de colores</label>
            <select value={palette} onChange={(e) => setPalette(e.target.value)}>
              {PALETTES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="field row">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={animate}
                onChange={(e) => setAnimate(e.target.checked)}
              />
              Rotación animada (ver en el tiempo)
            </label>
          </div>

          {animate && (
            <>
              <div className="field">
                <button
                  className={`toggle-btn ${pendulum ? "active" : ""}`}
                  onClick={() => setPendulum((p) => !p)}
                >
                  {pendulum ? "🕰️ Modo péndulo: ON" : "🕰️ Modo péndulo: OFF"}
                </button>
              </div>

              {pendulum ? (
                <div className="field">
                  <label>
                    Duración del ciclo (0°→360°→0°):{" "}
                    <span>{pendulumPeriod}s</span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="20"
                    step="0.5"
                    value={pendulumPeriod}
                    onChange={(e) =>
                      setPendulumPeriod(Number(e.target.value))
                    }
                  />
                </div>
              ) : (
                <div className="field">
                  <label>
                    Velocidad de rotación: <span>{rotationSpeed}°/s</span>
                  </label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={rotationSpeed}
                    onChange={(e) => setRotationSpeed(Number(e.target.value))}
                  />
                </div>
              )}
            </>
          )}

          <button className="reset" onClick={handleReset}>
            Restablecer valores
          </button>

          <p className="hint">
            El factor de largo negativo invierte la dirección de cada nueva
            generación de líneas. En modo péndulo, el propio{" "}
            <strong>ángulo entre líneas</strong> sube de 0° a 360° y luego
            baja de 360° a 0°, repitiendo — la duración controla cuánto tarda
            cada subida (la bajada tarda lo mismo).
          </p>
        </aside>

        <main className="canvas-area">
          <div className="canvas-wrapper canvas-wrapper--full">
            <canvas ref={canvasRef} />
          </div>
        </main>
      </div>
    </div>
  );
}
