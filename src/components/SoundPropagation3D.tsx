import { useEffect, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RotateCcw } from "lucide-react";
import { text } from "../content/language";
import type { Language } from "../content/knowledge";

export default function SoundPropagation3D({ displacements, language, children }: { displacements: number[]; language: Language; children: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{ update: (displacements: number[]) => void; reset: () => void }>();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!window.WebGLRenderingContext) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { return; }
    const container = host.current!;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minAzimuthAngle = -.7; controls.maxAzimuthAngle = .7;
    controls.minPolarAngle = .65; controls.maxPolarAngle = 2.3;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x617870, 2.5));
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(-5, 7, 10); scene.add(light);
    const resources: Array<{ dispose: () => void }> = [];
    const geometry = new THREE.SphereGeometry(.065, 12, 8);
    const material = new THREE.MeshStandardMaterial({ color: "#267c70", roughness: .4 });
    const particles = new THREE.InstancedMesh(geometry, material, 49 * 4 * 4);
    particles.frustumCulled = false;
    scene.add(particles); resources.push(geometry, material);
    const plateGeometry = new THREE.BoxGeometry(.07, 2.1, 2.1);
    const plateMaterial = new THREE.MeshStandardMaterial({ color: "#267c70", transparent: true, opacity: .28 });
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    scene.add(plate); resources.push(plateGeometry, plateMaterial);
    const probeBox = new THREE.BoxGeometry(.01, 2.2, 2.2);
    const probeGeometry = new THREE.EdgesGeometry(probeBox);
    probeBox.dispose();
    const probeMaterial = new THREE.LineBasicMaterial({ color: "#a94d1d" });
    scene.add(new THREE.LineSegments(probeGeometry, probeMaterial));
    resources.push(probeGeometry, probeMaterial);
    const markerGeometry = new THREE.SphereGeometry(.11, 16, 12);
    const markerMaterial = new THREE.MeshStandardMaterial({ color: "#c26a20" });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    scene.add(marker); resources.push(markerGeometry, markerMaterial);
    const arrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-3.6, 1.7, 0), 7.2, 0x526a63, .25, .14);
    scene.add(arrow);
    const render = () => renderer.render(scene, camera);
    const matrix = new THREE.Matrix4();
    api.current = {
      update(value) {
        let index = 0;
        for (let i = 0; i < 49; i++) {
          const x = -4 + i / 48 * 8 + value[i];
          for (let y = 0; y < 4; y++) for (let z = 0; z < 4; z++) {
            matrix.makeTranslation(x, -.75 + y * .5, -.75 + z * .5);
            particles.setMatrixAt(index++, matrix);
          }
        }
        particles.instanceMatrix.needsUpdate = true;
        plate.position.x = -4.25 + value[0];
        marker.position.set(value[24], .25, .75);
        render();
      },
      reset() { camera.position.set(3.5, 3.1, 12.5); controls.target.set(0, .2, 0); controls.update(); render(); }
    };
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // Keep the whole air volume visible even on a portrait screen.
      camera.zoom = Math.min(1.8, width / height / 1.25);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height); render();
    };
    const observer = new ResizeObserver(resize); observer.observe(container);
    controls.addEventListener("change", render);
    api.current.reset(); api.current.update(displacements); resize(); setReady(true);
    return () => {
      api.current = undefined; observer.disconnect(); controls.dispose();
      resources.forEach(resource => resource.dispose());
      arrow.line.geometry.dispose(); arrow.cone.geometry.dispose();
      (arrow.line.material as THREE.Material).dispose(); (arrow.cone.material as THREE.Material).dispose();
      renderer.dispose(); renderer.domElement.remove();
    };
  }, []);
  useEffect(() => { api.current?.update(displacements); }, [displacements]);
  const resetLabel = text(language, "复位视角", "Reset view", "視点を戻す", "시점 초기화");
  return <>
    <div className="sound-air-three" ref={host} role="img" aria-label={text(language, "三维空气质点、振膜和固定观察面", "3D air parcels, diaphragm and fixed observation plane", "3D空気粒子、振動板と固定観測面", "3D 공기 입자, 진동판 및 고정 관측면")} style={!ready ? { height: 0, overflow: "hidden" } : undefined} />
    {ready ? <div className="sound-air-three-legend">
      <p>{text(language, "橙色球点：跟踪一个空气小体积；橙色框：固定观察面。", "Orange dot: one tracked air parcel; orange frame: fixed observation plane.", "橙色の点：追跡する空気の小体積。橙色の枠：固定観測面。", "주황색 점: 추적하는 작은 공기 부피. 주황색 틀: 고정 관측면.")}</p>
      <button type="button" className="sound-topic-back" title={resetLabel} aria-label={resetLabel} onClick={() => api.current?.reset()}><RotateCcw size={18} /></button>
    </div> : children}
  </>;
}
