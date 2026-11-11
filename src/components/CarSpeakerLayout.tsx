import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { ArrowDown, RotateCcw, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import type { Language } from "../content/knowledge";
import { text } from "../content/language";
import { carSpeakers } from "../content/carSpeakers";
import { carAcousticPoints, carAcousticScenes, type CarAcousticMode } from "../content/carAcoustics";

const cabinPoints = [...carSpeakers, ...carAcousticPoints.map(point => ({ ...point, kind: "node" as const }))];

export default function CarSpeakerLayout({ language, module, fallback }: { language: Language; module?: CarAcousticMode; fallback?: ReactNode }) {
  const lab = module !== undefined;
  const points = lab ? cabinPoints : carSpeakers;
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{ select: (index: number, mode?: CarAcousticMode) => void; view: (mode: string) => void }>();
  const [selected, setSelected] = useState(0);
  const [unavailable, setUnavailable] = useState(false);
  const selectId = useId();
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  const sceneContent = module ? carAcousticScenes[module] : undefined;
  const visibleIndices = points.flatMap((point, index) => !sceneContent || sceneContent.points.includes(point.id) ? [index] : []);
  const selectedIndex = visibleIndices.includes(selected) ? selected : visibleIndices[0];

  useEffect(() => {
    const container = host.current!;
    if (!window.WebGLRenderingContext) { setUnavailable(true); return; }
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch { setUnavailable(true); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 60);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    controls.dampingFactor = .12;
    controls.minPolarAngle = .06;
    controls.maxPolarAngle = Math.PI * .47;
    controls.minDistance = 6;
    controls.maxDistance = 18;
    controls.target.set(0, .65, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x65746b, 2.6));
    const light = new THREE.DirectionalLight(0xfff4e5, 3.2);
    light.position.set(-4, 8, -5); scene.add(light);
    const fill = new THREE.DirectionalLight(0xd4eeff, 1.6);
    fill.position.set(5, 4, 4); scene.add(fill);
    const resources = new Set<{ dispose: () => void }>();
    const keep = <T extends { dispose: () => void }>(resource: T) => { resources.add(resource); return resource; };
    const material = (color: string, metalness = 0, roughness = .65) => keep(new THREE.MeshStandardMaterial({ color, metalness, roughness }));
    const paint = material("#9bbcb1", .35, .32);
    const trim = material("#344741");
    const upholstery = material("#667d76");
    const cushion = material("#8da49b");
    const rubber = material("#202626");
    const metal = material("#a8b5b8", .75, .3);
    const cone = material("#222f32");
    function mesh(geometry: THREE.BufferGeometry, mat: THREE.Material, position: [number, number, number]) {
      const object = new THREE.Mesh(keep(geometry), mat);
      object.position.set(...position); scene.add(object); return object;
    }
    function box(size: [number, number, number], position: [number, number, number], mat: THREE.Material, radius = .08) {
      return mesh(new RoundedBoxGeometry(...size, 2, radius), mat, position);
    }
    function tube(points: [number, number, number][], mat: THREE.Material, radius = .035) {
      const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
      return mesh(new THREE.TubeGeometry(curve, 16, radius, 6, false), mat, [0, 0, 0]);
    }
    // Open-roof, left-hand-drive teaching geometry; positions are not measurements of a vehicle.
    const outline = new THREE.Shape();
    outline.moveTo(-.95, -2.9); outline.quadraticCurveTo(-1.28, -2.85, -1.28, -2.35);
    outline.lineTo(-1.28, 2.25); outline.quadraticCurveTo(-1.25, 2.8, -.85, 2.8);
    outline.lineTo(.85, 2.8); outline.quadraticCurveTo(1.25, 2.8, 1.28, 2.25);
    outline.lineTo(1.28, -2.35); outline.quadraticCurveTo(1.28, -2.85, .95, -2.9); outline.closePath();
    const hull = mesh(new THREE.ExtrudeGeometry(outline, { depth: .28, bevelEnabled: true, bevelSize: .06, bevelThickness: .06, bevelSegments: 2, steps: 1 }), paint, [0, .4, 0]);
    hull.rotation.x = -Math.PI / 2;
    box([2.25, .32, 1.13], [0, .7, -2.25], paint, .12);
    box([2.18, .25, .65], [0, .65, 2.38], paint, .1);
    box([2.1, .13, 3.7], [0, .69, .1], trim);
    box([2.1, .32, .5], [0, .89, -1.6], trim);
    box([.36, .2, 2.75], [0, .82, .25], trim);
    const display = material("#19383e", .15, .2);
    box([.45, .28, .05], [0, 1.12, -1.31], display, .025);
    for (const side of [-1, 1]) {
      for (const z of [-.65, 1.05]) {
        box([.16, .42, 1.5], [side * 1.22, .82, z], paint);
        box([.1, .1, .45], [side * 1.12, .91, z], trim, .03);
      }
      tube([[side * 1.08, .92, -1.85], [side * 1.03, 1.3, -1.6], [side * .98, 1.65, -1.26]], paint, .05);
      for (const z of [-1.94, 1.85]) {
        const wheel = mesh(new THREE.CylinderGeometry(.39, .39, .23, 32), rubber, [side * 1.28, .36, z]); wheel.rotation.z = Math.PI / 2;
        const rim = mesh(new THREE.CylinderGeometry(.23, .23, .25, 16), metal, [side * 1.29, .36, z]); rim.rotation.z = Math.PI / 2;
        for (let spoke = 0; spoke < 5; spoke++) {
          const angle = spoke / 5 * Math.PI * 2;
          const bar = box([.02, .36, .035], [side * 1.42, .36, z], trim, .005); bar.rotation.x = angle;
        }
      }
      box([.48, .08, .07], [side * .73, .73, -2.84], material("#f7f3c7"), .02);
      box([.43, .08, .07], [side * .73, .65, 2.75], material("#ad4c4b"), .02);
    }
    const glass = keep(new THREE.MeshStandardMaterial({ color: "#c5e4e1", transparent: true, opacity: .25, side: THREE.DoubleSide, depthWrite: false, roughness: .2 }));
    const windshield = mesh(new THREE.PlaneGeometry(2.02, .87), glass, [0, 1.28, -1.57]); windshield.rotation.x = -.65;
    for (const x of [-.62, .62]) for (const z of [-.48, 1.0]) {
      box([.79, .18, .77], [x, .84, z], cushion);
      const back = box([.79, .72, .18], [x, 1.15, z + .35], upholstery); back.rotation.x = -.12;
      box([.42, .25, .19], [x, 1.65, z + .4], cushion);
    }
    const wheel = mesh(new THREE.TorusGeometry(.22, .035, 8, 32), rubber, [-.62, 1.17, -1.08]); wheel.rotation.x = -.45;
    box([.32, .05, .04], [-.62, 1.17, -1.08], metal, .015);
    box([1.05, .24, .58], [0, .77, 2.03], trim);

    const targets: THREE.Object3D[] = [];
    const speakerMaterials: THREE.MeshStandardMaterial[] = [];
    const markers: THREE.Sprite[] = [];
    const leaders: THREE.Line[] = [];
    const nodeMeshes: THREE.Mesh[] = [];
    points.forEach((speaker, index) => {
      const [x, y, z] = speaker.position;
      const radius = speaker.kind === "sub" ? .26 : speaker.kind === "door" ? .17 : .1;
      const mat = material("#c18a3d", .35, .35); speakerMaterials.push(mat);
      const surround = mesh(speaker.kind === "node" ? new THREE.SphereGeometry(.09, 16, 12) : new THREE.CylinderGeometry(radius, radius, .06, 32), mat, [x, y, z]);
      const diaphragm = mesh(new THREE.CylinderGeometry(radius * .72, radius * .9, .025, 32), cone, [x, y + .04, z]);
      if (speaker.kind === "node") { diaphragm.visible = false; nodeMeshes.push(surround); }
      if (speaker.kind === "door") {
        surround.rotation.z = Math.sign(x) * Math.PI / 2;
        diaphragm.rotation.z = surround.rotation.z;
        diaphragm.position.set(x - Math.sign(x) * .04, y, z);
      }
      surround.userData.index = index; diaphragm.userData.index = index;
      targets.push(surround, diaphragm);
      const label = document.createElement("canvas"); label.width = label.height = 96;
      const ctx = label.getContext("2d")!;
      ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(48, 48, 43, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#194f45"; ctx.beginPath(); ctx.arc(48, 48, 37, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffffff"; ctx.font = "bold 48px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(String(index + 1), 48, 50);
      const texture = keep(new THREE.CanvasTexture(label)); texture.colorSpace = THREE.SRGBColorSpace;
      const marker = new THREE.Sprite(keep(new THREE.SpriteMaterial({ map: texture, depthTest: false, depthWrite: false })));
      marker.position.set(x, y + .32, z); marker.scale.setScalar(.32); marker.renderOrder = 10; marker.userData.index = index;
      scene.add(marker); markers.push(marker); targets.push(marker);
      if (lab) {
        const leader = new THREE.Line(keep(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()])), keep(new THREE.LineBasicMaterial({ color: 0x527168, depthTest: false, depthWrite: false })));
        leader.renderOrder = 9; scene.add(leader); leaders.push(leader);
      }
    });

    const routes = new Map<CarAcousticMode, THREE.Group>();
    if (lab) for (const [mode, content] of Object.entries(carAcousticScenes)) {
      const group = new THREE.Group();
      for (const path of content.paths) {
        const from = cabinPoints.find(point => point.id === path.from)!;
        const to = cabinPoints.find(point => point.id === path.to)!;
        const start = new THREE.Vector3(...from.position).add(new THREE.Vector3(0, .32, 0));
        const end = new THREE.Vector3(...to.position).add(new THREE.Vector3(0, .32, 0));
        const direction = end.sub(start);
        const length = direction.length() - .22;
        const color = path.kind === "acoustic" ? 0x226d60 : path.kind === "feedback" ? 0xb84b72 : 0xb16b22;
        const arrow = new THREE.ArrowHelper(direction.clone().normalize(), start, length, color, .18, .12);
        arrow.line.visible = false;
        const shaft = new THREE.Mesh(keep(new THREE.CylinderGeometry(.012, .012, length - .18, 6)), keep(new THREE.MeshBasicMaterial({ color, depthTest: false, depthWrite: false })));
        shaft.position.copy(start).addScaledVector(direction.clone().normalize(), (length - .18) / 2);
        shaft.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
        shaft.renderOrder = 8; group.add(shaft);
        // Connections are schematic, not simulated rays or measured propagation paths.
        for (const object of [arrow.line, arrow.cone]) {
          object.renderOrder = 8;
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach(mat => { mat.depthTest = false; mat.depthWrite = false; keep(mat); });
          keep(object.geometry);
        }
        group.add(arrow);
      }
      group.visible = false; scene.add(group); routes.set(mode as CarAcousticMode, group);
    }
    let activePoints = new Set(points.map(point => point.id));
    let currentSelection = 0;

    // Keep numbered labels legible during orbit; leaders retain the actual component positions.
    const placeLabels = () => {
      if (!lab) return;
      const { width, height } = renderer.domElement.getBoundingClientRect();
      if (!width || !height) return;
      camera.updateMatrixWorld();
      const occupied: { x: number; y: number }[] = [];
      const order = [currentSelection, ...points.map((_, index) => index).filter(index => index !== currentSelection)];
      for (const index of order) {
        const marker = markers[index]; const leader = leaders[index];
        leader.visible = marker.visible;
        if (!marker.visible) continue;
        const anchor = new THREE.Vector3(...points[index].position);
        const projected = anchor.clone().add(new THREE.Vector3(0, .32, 0)).project(camera);
        const baseX = (projected.x + 1) * width / 2;
        const baseY = (1 - projected.y) * height / 2;
        let x = baseX; let y = baseY;
        for (let attempt = 0; attempt < 80; attempt++) {
          const radius = Math.ceil(attempt / 8) * 32;
          x = THREE.MathUtils.clamp(baseX + Math.cos(attempt * Math.PI / 4) * radius, 20, width - 20);
          y = THREE.MathUtils.clamp(baseY + Math.sin(attempt * Math.PI / 4) * radius, 20, height - 20);
          if (!occupied.some(point => Math.hypot(point.x - x, point.y - y) < 34)) break;
        }
        occupied.push({ x, y });
        marker.position.set(x / width * 2 - 1, 1 - y / height * 2, projected.z).unproject(camera);
        const depth = -marker.position.clone().applyMatrix4(camera.matrixWorldInverse).z;
        marker.scale.setScalar((index === currentSelection ? 30 : 26) * 2 * depth * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) / height);
        const positions = leader.geometry.getAttribute("position");
        positions.setXYZ(0, anchor.x, anchor.y, anchor.z);
        positions.setXYZ(1, marker.position.x, marker.position.y, marker.position.z);
        positions.needsUpdate = true; leader.geometry.computeBoundingSphere();
      }
    };

    let frame = 0;
    let disposed = false;
    const draw = () => {
      frame = 0;
      if (disposed) return;
      controls.update();
      placeLabels();
      renderer.render(scene, camera);
    };
    const requestDraw = () => { if (!frame && !disposed) frame = requestAnimationFrame(draw); };
    controls.addEventListener("change", requestDraw);
    const reset = (top = false) => {
      controls.enableDamping = false; controls.update();
      controls.target.set(0, .65, 0);
      camera.position.set(...(top ? [0, 10, .001] : [4.8, 5.2, -6.2]) as [number, number, number]);
      controls.update();
      controls.enableDamping = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      requestDraw();
    };
    api.current = {
      select(index, mode) {
        currentSelection = index;
        activePoints = new Set(mode ? carAcousticScenes[mode].points : points.map(point => point.id));
        speakerMaterials.forEach((mat, i) => { mat.color.set(!activePoints.has(points[i].id) ? "#71807a" : i === index ? "#ecb657" : "#a17c40"); mat.emissive.set(i === index ? "#6f3c08" : "#000000"); });
        markers.forEach((marker, i) => { marker.visible = activePoints.has(points[i].id); marker.scale.setScalar(i === index ? .42 : .32); });
        nodeMeshes.forEach(node => { node.visible = activePoints.has(points[node.userData.index].id); });
        routes.forEach((group, key) => { group.visible = key === mode; });
        requestDraw();
      },
      view(mode) {
        if (mode === "top" || mode === "reset") { reset(mode === "top"); return; }
        const offset = camera.position.clone().sub(controls.target);
        if (mode === "rotate") offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 6);
        else offset.setLength(THREE.MathUtils.clamp(offset.length() * (mode === "in" ? .85 : 1.15), controls.minDistance, controls.maxDistance));
        camera.position.copy(controls.target).add(offset); controls.update(); requestDraw();
      }
    };
    const raycaster = new THREE.Raycaster();
    let down: { x: number; y: number; id: number } | undefined;
    const pointerDown = (event: PointerEvent) => { down = down ? undefined : { x: event.clientX, y: event.clientY, id: event.pointerId }; };
    const cancelPick = () => { down = undefined; };
    const pointerUp = (event: PointerEvent) => {
      const start = down; down = undefined;
      if (!start || start.id !== event.pointerId || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 5) return;
      const rect = renderer.domElement.getBoundingClientRect();
      raycaster.setFromCamera(new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1), camera);
      const hit = raycaster.intersectObjects(targets.filter(target => target.visible && activePoints.has(points[target.userData.index].id)), false)[0];
      if (hit) setSelected(hit.object.userData.index as number);
    };
    const contextLost = (event: Event) => { event.preventDefault(); setUnavailable(true); };
    renderer.domElement.addEventListener("pointerdown", pointerDown);
    renderer.domElement.addEventListener("pointerup", pointerUp);
    renderer.domElement.addEventListener("pointercancel", cancelPick);
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height); camera.aspect = width / height;
      // Keep the whole cabin framed on narrow screens, without changing physical geometry.
      camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(38) / 2) / Math.min(1, camera.aspect)));
      camera.updateProjectionMatrix(); requestDraw();
    };
    const observer = new ResizeObserver(resize); observer.observe(container);
    reset(); api.current.select(0); resize();
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect();
      controls.removeEventListener("change", requestDraw); controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", pointerDown);
      renderer.domElement.removeEventListener("pointerup", pointerUp);
      renderer.domElement.removeEventListener("pointercancel", cancelPick);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      api.current = undefined; resources.forEach(resource => resource.dispose()); renderer.dispose(); renderer.domElement.remove();
    };
  }, [lab]);
  useEffect(() => { api.current?.select(selectedIndex, module); }, [selectedIndex, module]);

  if (unavailable && fallback) return <div data-testid="car-cabin-fallback">{fallback}</div>;
  const active = points[selectedIndex];
  return <div className="car-speaker-layout" data-active-module={module}>
    <div className="car-speaker-tools">
      <label htmlFor={selectId}>{lab ? t("座舱部件", "Cabin component", "車室部品", "실내 부품") : t("扬声器位置", "Speaker position", "スピーカー位置", "스피커 위치")}</label>
      <select id={selectId} value={selectedIndex} onChange={event => setSelected(Number(event.target.value))}>
        {visibleIndices.map(index => <option key={points[index].id} value={index}>{index + 1}. {points[index].title[language]}</option>)}
      </select>
      <div className="car-speaker-camera">
        {[
          { mode: "top", Icon: ArrowDown, label: t("俯视", "Top view", "上面", "위에서 보기") },
          { mode: "rotate", Icon: RotateCw, label: t("旋转视角", "Rotate view", "視点を回転", "시점 회전") },
          { mode: "in", Icon: ZoomIn, label: t("放大", "Zoom in", "拡大", "확대") },
          { mode: "out", Icon: ZoomOut, label: t("缩小", "Zoom out", "縮小", "축소") },
          { mode: "reset", Icon: RotateCcw, label: t("复位视角", "Reset view", "視点を戻す", "시점 초기화") }
        ].map(({ mode, Icon, label }) => <button type="button" key={mode} title={label} aria-label={label} disabled={unavailable} onClick={() => api.current?.view(mode)}><Icon size={18} aria-hidden="true" /></button>)}
      </div>
    </div>
    <div className="car-speaker-canvas" ref={host} role="img" hidden={unavailable} aria-label={lab ? t("车载声学三维座舱与信号连接", "3D acoustic cabin and signal connections", "車室音響の3D配置と信号接続", "실내 음향 3D 배치와 신호 연결") : t("通用左舵车座舱扬声器三维示意", "Generic left-hand-drive cabin speaker layout in 3D", "左ハンドル車の汎用スピーカー3D配置図", "일반적인 좌측 운전석 차량 스피커 3D 배치도")} />
    {sceneContent && <div className="car-acoustic-connections">
      <ul className="car-acoustic-legend">
        <li data-kind="acoustic">{t("声学传播", "Acoustic path", "音の伝搬", "음향 전달")}</li>
        <li data-kind="signal">{t("电信号 / 数据", "Electrical signal / data", "電気信号 / データ", "전기 신호 / 데이터")}</li>
        <li data-kind="feedback">{t("残余误差反馈", "Residual-error feedback", "残留誤差のフィードバック", "잔류 오차 피드백")}</li>
      </ul>
      <p>{sceneContent.caption[language]}</p>
      <ul className="car-acoustic-point-key">{visibleIndices.map(index => <li key={points[index].id}><button type="button" aria-pressed={selectedIndex === index} onClick={() => setSelected(index)}><span>{index + 1}</span>{points[index].title[language]}</button></li>)}</ul>
    </div>}
    {unavailable && <p role="status">{t("当前无法显示 3D；仍可选择位置查看说明，或切回实物照片。", "3D is unavailable. Select a position to read its description, or switch back to the photo.", "3D を表示できません。位置を選んで解説を読むか、実物写真に戻ってください。", "3D를 표시할 수 없습니다. 위치별 설명을 선택하거나 실물 사진으로 돌아가세요.")}</p>}
    <div className="car-speaker-description" aria-live="polite" aria-atomic="true">
      <h3>{selectedIndex + 1}. {active.title[language]}</h3><p>{active.purpose[language]}</p>
    </div>
    <p className="car-speaker-boundary">{t("通用开顶教学模型，非照片车型的三维扫描。位置、数量与尺寸仅作布局示意；不计算声压、指向性、延迟或 ANC 效果。", "Generic open-roof teaching model, not a 3D scan of the photographed vehicle. Positions, counts, and dimensions are illustrative; no SPL, directivity, delay, or ANC effects are computed.", "汎用の開放ルーフ教材モデルで、写真の車種の3Dスキャンではありません。位置・数・寸法は模式的で、音圧・指向性・遅延・ANC 効果は計算しません。", "사진 속 차종을 3D 스캔한 것이 아닌 일반적인 개방형 교육 모델입니다. 위치·수량·치수는 예시이며 음압·지향성·지연·ANC 효과를 계산하지 않습니다.")}</p>
  </div>;
}
