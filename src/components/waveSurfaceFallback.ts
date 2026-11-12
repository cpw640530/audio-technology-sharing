import { OrthographicCamera, Vector3 } from "three";
import { animationLoop } from "./animationLoop";
import { fitWaveSurfaceCamera } from "./waveSurfaceCamera";

// Use the WebGL surface's geometry and camera, but project onto Canvas 2D when a GPU context is unavailable.
export function createWaveSurfaceFallback(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D unavailable");
  const camera = new OrthographicCamera(-20, 20, 12, -12, 0.1, 100);
  camera.position.set(8, 13, 19);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  let columns = 0;
  let rows = 0;
  let points: Vector3[][] = [];
  const style = getComputedStyle(document.documentElement);
  const teal = style.getPropertyValue("--background-wave-deep").trim() || "31 117 105";
  const amber = style.getPropertyValue("--background-wave-secondary").trim() || "196 111 42";
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let width = 1;
  let height = 1;
  let elapsed = 0;

  function draw() {
    if (!context) return;
    const time = reducedMotion.matches ? 0 : elapsed;
    context.clearRect(0, 0, width, height);
    for (let row = 0; row <= rows; row++) {
      for (let column = 0; column <= columns; column++) {
        const x = (column - columns / 2) / 1.5;
        const z = (row - rows / 2) / 1.5;
        const y = 1.05 * Math.sin(x * 0.43 + z * 0.21 - time * 0.42)
          + 0.48 * Math.cos(z * 0.62 + time * 0.27) * Math.cos(x * 0.19)
          + 0.2 * Math.sin(x * 0.9 - z * 0.33 + time * 0.18);
        const point = points[row][column].set(x, y, z).project(camera);
        point.x = (point.x + 1) * width / 2;
        point.y = (1 - point.y) * height / 2;
      }
    }
    const trace = (line: Vector3[], index: number, count: number) => {
      context.globalAlpha = 0.28 * Math.min(1, index / (count * 0.12), (count - index) / (count * 0.12));
      context.beginPath();
      line.forEach((point, i) => i === 0 ? context.moveTo(point.x, point.y) : context.lineTo(point.x, point.y));
      context.stroke();
    };
    points.forEach((line, row) => trace(line, row, rows));
    for (let column = 0; column <= columns; column++) trace(points.map(line => line[column]), column, columns);
  }

  function resize() {
    if (!context) return;
    width = Math.max(1, innerWidth);
    height = Math.max(1, innerHeight);
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const gradient = context.createLinearGradient(0, 0, width, height * 0.2);
    gradient.addColorStop(0, `rgb(${teal})`);
    gradient.addColorStop(1, `rgb(${amber})`);
    context.strokeStyle = gradient;
    context.lineWidth = 1;
    const size = fitWaveSurfaceCamera(camera, width, height);
    const nextColumns = size.width * 1.5;
    const nextRows = size.depth * 1.5;
    if (columns !== nextColumns || rows !== nextRows) {
      columns = nextColumns;
      rows = nextRows;
      points = Array.from({ length: rows + 1 }, () => Array.from({ length: columns + 1 }, () => new Vector3()));
    }
    draw();
  }

  resize();
  canvas.dataset.ready = "true";
  const animation = animationLoop(canvas, delta => { elapsed += delta; draw(); }, { fps: 15 });
  window.addEventListener("resize", resize);
  return () => {
    animation.dispose();
    window.removeEventListener("resize", resize);
    delete canvas.dataset.ready;
  };
}
