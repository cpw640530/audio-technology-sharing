import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { Language } from "../content/knowledge";
import { text } from "../content/language";
import { createSoundGas } from "./soundGasModel";
import { animationLoop } from "./animationLoop";

export default function SoundGasExperiment({ language }: { language: Language }) {
  const host = useRef<HTMLDivElement>(null);
  const run = useRef(false);
  const api = useRef<{ reset: () => void; setPlaying?: (playing: boolean) => void }>();
  const [running, setRunning] = useState(false);
  const [volume, setVolume] = useState(1);
  const [reset, setReset] = useState(0);
  const [hits, setHits] = useState(0);
  const [unavailable, setUnavailable] = useState(false);
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  useEffect(() => { run.current = running; api.current?.setPlaying?.(running); }, [running]);
  useEffect(() => {
    setHits(0);
    if (!window.WebGLRenderingContext) { setUnavailable(true); return; }
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { setUnavailable(true); return; }
    const container = host.current!;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); container.appendChild(renderer.domElement);
    const gas = createSoundGas(volume);
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x547269, 3));
    const light = new THREE.DirectionalLight(0xffffff, 2); light.position.set(4, 5, 6); scene.add(light);
    const camera = new THREE.PerspectiveCamera(40, 1, .1, 100);
    const controls = new OrbitControls(camera, renderer.domElement); controls.enablePan = false; controls.enableZoom = false;
    const geometry = new THREE.SphereGeometry(.075, 12, 8);
    const material = new THREE.MeshStandardMaterial({ roughness: .4 });
    const spheres = new THREE.InstancedMesh(geometry, material, 48); spheres.frustumCulled = false; scene.add(spheres);
    const box = new THREE.BoxGeometry(gas.side, gas.side, gas.side);
    const edges = new THREE.EdgesGeometry(box); box.dispose();
    const lineMaterial = new THREE.LineBasicMaterial({ color: "#7c958a" }); scene.add(new THREE.LineSegments(edges, lineMaterial));
    const matrix = new THREE.Matrix4();
    const green = new THREE.Color("#227a70"), orange = new THREE.Color("#bf651d"), red = new THREE.Color("#c63b45");
    const draw = () => {
      gas.bodies.forEach((body, i) => {
        matrix.makeTranslation(body.position.x, body.position.y, body.position.z); spheres.setMatrixAt(i, matrix);
        spheres.setColorAt(i, gas.flashes[i] > 0 ? red : i === 0 ? orange : green);
      });
      spheres.instanceMatrix.needsUpdate = true; if (spheres.instanceColor) spheres.instanceColor.needsUpdate = true;
      renderer.render(scene, camera);
    };
    api.current = { reset() { camera.position.set(6, 4, 7); controls.target.set(0, 0, 0); controls.update(); draw(); } };
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height; camera.zoom = Math.min(1.2, width / height); camera.updateProjectionMatrix();
      renderer.setSize(width, height); draw();
    };
    const observer = new ResizeObserver(resize); observer.observe(container);
    controls.addEventListener("change", draw);
    api.current.reset(); resize();
    let accumulator = 0, statsElapsed = 0;
    const animation = animationLoop(container, delta => {
      // Preserve the model's 120 fixed physics steps per simulated second.
      accumulator += delta;
      while (accumulator >= 1 / 120) { gas.step(); accumulator -= 1 / 120; }
      draw();
      statsElapsed += delta;
      if (statsElapsed >= .25) { setHits(gas.wallHits); statsElapsed %= .25; }
    }, { fps: 60, respectReducedMotion: false });
    api.current.setPlaying = animation.setPlaying;
    animation.setPlaying(run.current);
    return () => {
      animation.dispose(); observer.disconnect(); controls.dispose(); api.current = undefined;
      geometry.dispose(); material.dispose(); edges.dispose(); lineMaterial.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, [volume, reset]);
  return <div className="sound-gas-experiment">
    <div className="sound-propagation-controls">
      <label>{t("容器体积", "Container volume", "容器の体積", "용기 부피")} {Math.round(volume * 100)}%<input type="range" min="0.5" max="1" step="0.05" value={volume} onChange={e => { setRunning(false); setVolume(Number(e.target.value)); }} /></label>
      <div className="sound-propagation-actions">
        <button type="button" className="sound-topic-back" onClick={() => setRunning(v => !v)} disabled={unavailable}>{running ? <Pause size={18} /> : <Play size={18} />}{running ? t("暂停分子", "Pause molecules", "分子を停止", "분자 일시 정지") : t("观察分子", "Observe molecules", "分子を観察", "분자 관찰")}</button>
        <button type="button" className="sound-topic-back" onClick={() => { setRunning(false); setReset(v => v + 1); }} title={t("重置分子", "Reset molecules", "分子をリセット", "분자 초기화")} aria-label={t("重置分子", "Reset molecules", "分子をリセット", "분자 초기화")}><RotateCcw size={18} /></button>
        <button type="button" className="sound-topic-back" onClick={() => api.current?.reset()} title={t("分子视角复位", "Reset molecular view", "分子の視点を戻す", "분자 시점 초기화")} aria-label={t("分子视角复位", "Reset molecular view", "分子の視点を戻す", "분자 시점 초기화")}><RotateCcw size={18} /></button>
      </div>
    </div>
    <div className="sound-gas-canvas" ref={host} role="img" aria-label={t("三维分子碰撞与容器", "3D molecular collisions in a container", "容器内の3D分子衝突", "용기 내부 3D 분자 충돌")} />
    {unavailable && <p role="status">{t("当前浏览器不支持三维；仍可调整体积查看下方理想气体关系。", "3D is unavailable; the ideal-gas volume comparison below remains available.", "3D は利用できませんが、下の理想気体の比較は利用できます。", "3D를 사용할 수 없지만 아래 이상기체 비교는 가능합니다.")}</p>}
    <div className="sound-gas-values"><span>{t("碰壁次数", "Wall contacts", "壁との衝突", "벽 충돌")}: {hits}</span><span>p / p₀ = {(1 / volume).toFixed(2)} <small>{t("等温理论值", "isothermal prediction", "等温理論値", "등온 이론값")}</small></span></div>
    <p>{t("红色闪烁标出碰撞，橙色标出一个被跟踪的粒子。碰壁次数是模拟计数；压力比是 pV = NkT 的等温理论值，不是从少量碰撞直接测得。", "Red flashes mark collisions; orange identifies one tracked particle. Wall contacts are simulated counts. The pressure ratio is the isothermal pV = NkT prediction, not a measurement from these few collisions.", "赤は衝突、橙色は追跡する粒子です。衝突数はシミュレーション値、圧力比は pV = NkT の等温理論値で、衝突からの測定ではありません。", "빨강은 충돌, 주황은 추적 입자입니다. 충돌은 시뮬레이션 횟수이며 압력비는 충돌 측정이 아닌 pV = NkT 등온 이론값입니다.")}</p>
    <p className="sound-topic-note">{t("等质量硬球、近似弹性碰撞、无重力，采用数值碰撞引擎；大小和速度不是实际分子尺度。改变体积会以相同初始动能重新放置粒子，比较相同温度的两个状态，不是在模拟绝热压缩。", "Equal-mass hard spheres, approximately elastic collisions, no gravity, using a numerical collision engine; sizes and speeds are illustrative. Changing volume resets particles with the same initial kinetic energy to compare equal-temperature states, not adiabatic compression.", "等質量の硬球、近似的な弾性衝突、重力なしの数値モデルです。大きさと速さは模式的です。体積変更では同じ初期運動エネルギーで再配置し、等温状態を比較します。断熱圧縮ではありません。", "같은 질량의 단단한 구, 근사 탄성 충돌, 무중력 수치 모델입니다. 크기와 속도는 예시입니다. 부피 변경 시 같은 초기 운동에너지로 재배치해 등온 상태를 비교하며 단열 압축이 아닙니다.")}</p>
  </div>;
}
