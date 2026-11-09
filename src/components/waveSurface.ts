import {
  Color, DoubleSide, Mesh, OrthographicCamera, PlaneGeometry,
  Scene, ShaderMaterial, WebGLRenderer
} from "three";
import { animationLoop } from "./animationLoop";

export function createWaveSurface(canvas: HTMLCanvasElement, onAvailable: (available: boolean) => void = () => {}) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setClearColor(0x000000, 0);
  const scene = new Scene();
  const camera = new OrthographicCamera(-20, 20, 12, -12, 0.1, 100);
  camera.position.set(8, 13, 19);
  camera.lookAt(0, 0, 0);
  const style = getComputedStyle(document.documentElement);
  const color = (name: string, fallback: string) => new Color(
    `rgb(${(style.getPropertyValue(name).trim() || fallback).split(/\s+/).join(",")})`
  );
  const geometry = new PlaneGeometry(44, 28, 120, 80);
  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    uniforms: {
      time: { value: 0 },
      teal: { value: color("--background-wave-deep", "31 117 105") },
      amber: { value: color("--background-wave-secondary", "196 111 42") }
    },
    vertexShader: `
      uniform float time;
      varying vec2 surfaceUv;
      varying float elevation;
      void main() {
        surfaceUv = uv;
        float x = position.x;
        float z = position.y;
        elevation = 1.05 * sin(x * 0.43 + z * 0.21 - time * 0.42)
          + 0.48 * cos(z * 0.62 + time * 0.27) * cos(x * 0.19)
          + 0.2 * sin(x * 0.9 - z * 0.33 + time * 0.18);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(x, elevation, z, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 teal;
      uniform vec3 amber;
      varying vec2 surfaceUv;
      varying float elevation;
      void main() {
        vec2 grid = surfaceUv * vec2(66.0, 42.0);
        vec2 distanceToLine = abs(fract(grid - 0.5) - 0.5) / max(fwidth(grid), vec2(0.0001));
        float line = 1.0 - smoothstep(0.25, 1.1, min(distanceToLine.x, distanceToLine.y));
        vec2 edge = smoothstep(vec2(0.0), vec2(0.12), surfaceUv)
          * smoothstep(vec2(0.0), vec2(0.12), 1.0 - surfaceUv);
        float fade = edge.x * edge.y;
        vec3 ink = mix(teal, amber, smoothstep(0.25, 0.9, surfaceUv.x));
        float shade = 0.85 + elevation * 0.07;
        gl_FragColor = vec4(ink * shade, fade * (0.025 + line * 0.28));
        #include <colorspace_fragment>
      }
    `
  });
  const surface = new Mesh(geometry, material);
  // Shader displacement exceeds the flat geometry bounds.
  surface.frustumCulled = false;
  scene.add(surface);
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let elapsed = 0;
  let lost = false;
  let disposed = false;

  function render() {
    if (disposed || lost) return;
    material.uniforms.time.value = reducedMotion.matches ? 0 : elapsed;
    renderer.render(scene, camera);
  }

  function resize() {
    const aspect = innerWidth / Math.max(innerHeight, 1);
    camera.left = -12 * aspect;
    camera.right = 12 * aspect;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.setSize(innerWidth, innerHeight);
    render();
  }

  function contextLost(event: Event) { event.preventDefault(); lost = true; onAvailable(false); animation.setPlaying(false); }
  function contextRestored() { lost = false; resize(); onAvailable(true); animation.setPlaying(true); }
  resize();
  onAvailable(true);
  const animation = animationLoop(canvas, delta => { elapsed += delta; render(); });
  window.addEventListener("resize", resize);
  canvas.addEventListener("webglcontextlost", contextLost);
  canvas.addEventListener("webglcontextrestored", contextRestored);
  return () => {
    disposed = true;
    animation.dispose();
    window.removeEventListener("resize", resize);
    canvas.removeEventListener("webglcontextlost", contextLost);
    canvas.removeEventListener("webglcontextrestored", contextRestored);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  };
}
