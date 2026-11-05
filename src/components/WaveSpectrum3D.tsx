import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RotateCcw } from "lucide-react";
import type { Language } from "../content/knowledge";
import { text } from "../content/language";
import { componentFrequencies, componentSample, mixtureSample } from "./waveSpectrumModel";

export default function WaveSpectrum3D({ amplitudes, phase, language }: { amplitudes: number[]; phase: number; language: Language }) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{ update: (a: number[], p: number) => void; view: (mode: string) => void }>();
  const [unavailable, setUnavailable] = useState(false);
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);

  useEffect(() => {
    const container = host.current!;
    if (!window.WebGLRenderingContext) { setUnavailable(true); return; }
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true }); }
    catch { setUnavailable(true); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#172b27");
    const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 9; controls.maxDistance = 28;
    controls.enablePan = false;
    const render = () => renderer.render(scene, camera);
    const resources: Array<{ dispose: () => void }> = [];
    function line(points: THREE.Vector3[], color: string) {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color });
      resources.push(geometry, material);
      const object = new THREE.Line(geometry, material); scene.add(object); return object;
    }
    function label(value: string, x: number, y: number, z: number) {
      const canvas = document.createElement("canvas"); canvas.width = 512; canvas.height = 64;
      const ctx = canvas.getContext("2d")!;
      ctx.font = "44px sans-serif"; ctx.fillStyle = "#edf7f4"; ctx.textAlign = "center";
      ctx.fillText(value, 256, 42);
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture, depthTest: false });
      const sprite = new THREE.Sprite(material); sprite.position.set(x, y, z); sprite.scale.set(5, .625, 1);
      scene.add(sprite); resources.push(texture, material);
    }
    const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
    // Three.js uses vertical Y; scientific amplitude is the vertical dimension here.
    for (const z of [-2, 0, 2]) line([v(-4, 0, z), v(4, 0, z)], "#55716b");
    for (const x of [-4, -2, 0, 2, 4]) {
      line([v(x, 0, -2), v(x, 0, 2)], "#36524a");
      label(String(x + 4), x, -.35, 2.8);
    }
    label("t (ms)", 0, -.5, 3.7);
    line([v(-4, -3, -2), v(-4, 3, -2)], "#93b5a9");
    for (const a of [-1, 0, 1]) label(String(a), -4.55, a * 3, -2);
    label("A", -4.4, 3.5, -2);
    componentFrequencies.forEach((f, i) => label(`${f} Hz`, 5.1, 0, 2 - i * 2));
    label("x(t) = Σ components", 0, -1.4, 5.3);
    const curves = ["#7ee7d8", "#f0c470", "#f29a9a", "#ffffff"].map(color => line(Array.from({ length: 257 }, () => v(0, 0, 0)), color));
    line([v(-4, 0, 5), v(4, 0, 5)], "#55716b");
    api.current = {
      update(a, p) {
        curves.forEach((curve, i) => {
          const points = curve.geometry.getAttribute("position") as THREE.BufferAttribute;
          for (let n = 0; n <= 256; n++) {
            const time = n / 256 * .008;
            const sample = i === 3 ? mixtureSample(time, a, p) : componentSample(time, i, a[i], i === 2 ? p : 0);
            points.setXYZ(n, n / 256 * 8 - 4, sample * 3, i === 3 ? 5 : 2 - i * 2);
          }
          points.needsUpdate = true; curve.geometry.computeBoundingSphere();
        }); render();
      },
      view(mode) {
        controls.target.set(0, 0, 1);
        camera.position.set(...(mode === "time" ? [0, 1, 20] : mode === "frequency" ? [20, 2, 1] : [11, 9, 15]) as [number, number, number]);
        controls.update(); render();
      }
    };
    const resize = () => { const { width, height } = container.getBoundingClientRect(); renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); render(); };
    const observer = new ResizeObserver(resize); observer.observe(container);
    controls.addEventListener("change", render);
    api.current.view("reset"); api.current.update(amplitudes, phase); resize();
    return () => { api.current = undefined; observer.disconnect(); controls.dispose(); resources.forEach(r => r.dispose()); renderer.dispose(); renderer.domElement.remove(); };
  }, []);
  useEffect(() => { api.current?.update(amplitudes, phase); }, [amplitudes, phase]);

  return <section className="wave-spectrum-three">
    <div className="wave-spectrum-three-heading"><h2>{t("三维：分量与合成", "3D: components and sum", "3D：成分と合成", "3D: 성분과 합성")}</h2>
      <div className="wave-spectrum-commands">
        <button className="sine-button" onClick={() => api.current?.view("time")}>{t("时间视角", "Time view", "時間方向", "시간 보기")}</button>
        <button className="sine-button" onClick={() => api.current?.view("frequency")}>{t("频率视角", "Frequency view", "周波数方向", "주파수 보기")}</button>
        <button className="sine-button" title={t("复位视角", "Reset view", "視点を戻す", "시점 초기화")} aria-label={t("复位视角", "Reset view", "視点を戻す", "시점 초기화")} onClick={() => api.current?.view("reset")}><RotateCcw size={18} /></button>
      </div></div>
    <div className="wave-spectrum-three-canvas" ref={host} role="img" aria-label={t("时间、频率与瞬时幅度三维分量图", "3D components: time, frequency and instantaneous amplitude", "時間・周波数・瞬時振幅の3D図", "시간, 주파수, 순간 진폭의 3D 그래프")} />
    {unavailable && <p role="status">{t("三维视图不可用，请使用下方二维图。", "3D unavailable; use the 2D plots below.", "3D を利用できません。下の2D図をご覧ください。", "3D를 사용할 수 없습니다. 아래 2D 그래프를 이용하세요.")}</p>}
    <p className="wave-spectrum-caption">{t("彩色曲线位于各自频率处，高度为瞬时幅度（±1 固定标度）。白线是同一时刻的代数和，单独放置，不代表一个频率。视角投影不是傅里叶变换，也不是 STFT 时频图。", "Colored curves sit at their frequencies; height is instantaneous amplitude (fixed ±1 scale). White is their pointwise sum, placed separately, not a frequency. Camera projections are neither Fourier transforms nor STFT spectrograms.", "色付き曲線の高さは瞬時振幅（±1固定）です。白線は各時刻の和で、周波数位置を持ちません。視点の投影はフーリエ変換やSTFTではありません。", "색 곡선의 높이는 순간 진폭(±1 고정)입니다. 흰 선은 시점별 합으로 별도로 배치하며 특정 주파수가 아닙니다. 시점 투영은 푸리에 변환이나 STFT가 아닙니다.")}</p>
  </section>;
}
