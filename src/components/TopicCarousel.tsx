import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PerspectiveCamera, Scene } from "three";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { text } from "../content/language";
import type { Language } from "../content/knowledge";
import type { DisplayTopic } from "./TopicGrid";

type Props = { language: Language; topics: DisplayTopic[]; onSelectTopic: (topic: DisplayTopic) => void };

export default function TopicCarousel({ language, topics, onSelectTopic }: Props) {
  const [category, setCategory] = useState(topics[0].category.id);
  const groups = [...new Map(topics.map(topic => [topic.category.id, topic.category])).values()];
  const active = groups.some(group => group.id === category) ? category : groups[0].id;
  const cards = topics.filter(topic => topic.category.id === active);
  return <div className="topic-carousel">
    {groups.length > 1 && <label className="carousel-category">{text(language, "当前分类", "Current category", "現在の分類", "현재 분류")}
      <select value={active} onChange={event => setCategory(event.target.value)}>{groups.map(group => <option key={group.id} value={group.id}>{group.title[language]}</option>)}</select>
    </label>}
    <CardRing key={cards.map(card => card.title.en).join("|")} language={language} topics={cards} onSelectTopic={onSelectTopic} />
  </div>;
}

function CardRing({ language, topics, onSelectTopic }: Props) {
  const [position, setPosition] = useState(0);
  const host = useRef<HTMLDivElement>(null);
  const animation = useRef<(position: number, immediate?: boolean) => void>();
  const drag = useRef<{ id: number; x: number; y: number; position: number; moved: boolean }>();
  const suppressClick = useRef(false);
  const elements = useMemo(() => topics.map(() => document.createElement("div")), [topics.length]);
  const count = topics.length;
  const index = ((position % count) + count) % count;
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);

  useEffect(() => {
    const root = host.current!;
    const renderer = new CSS3DRenderer();
    root.appendChild(renderer.domElement);
    const scene = new Scene();
    const camera = new PerspectiveCamera(45, 1, 1, 5000);
    const objects = elements.map(element => {
      element.className = "carousel-object";
      const object = new CSS3DObject(element);
      scene.add(object);
      return object;
    });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let current = 0, target = 0, frame = 0, last = 0, width = 1;
    const paint = () => {
      const mobile = width < 600;
      // Keep the original seven-card AI layout even when a category has fewer topics.
      const radius = 7 * 62;
      const focalDistance = root.clientHeight / (2 * Math.tan(Math.PI / 8));
      camera.position.z = mobile ? focalDistance : radius + focalDistance;
      objects.forEach((object, i) => {
        const offset = ((i - current + count / 2) % count + count) % count - count / 2;
        const angle = offset * Math.PI * 2 / 7;
        object.position.set(mobile ? offset * 330 : Math.sin(angle) * radius, 0, mobile ? 0 : Math.cos(angle) * radius);
        // Turn side cards toward the reader instead of exposing their backs.
        object.rotation.y = mobile ? 0 : angle * .4;
        // Fade the far card at the wrap point of a short arc instead of visibly teleporting it.
        const wrapOpacity = count >= 3 && count < 7 ? Math.min(1, (count / 2 - Math.abs(offset)) * 2) : 1;
        object.element.style.opacity = String(mobile ? 1 : (.25 + .75 * Math.max(0, Math.cos(angle))) * wrapOpacity);
        object.element.style.visibility = mobile && Math.abs(offset) > 1.2 ? "hidden" : "visible";
      });
      renderer.render(scene, camera);
    };
    const tick = (time: number) => {
      const elapsed = Math.min(50, time - (last || time - 16));
      last = time;
      current += (target - current) * (1 - Math.exp(-elapsed / 85));
      if (Math.abs(target - current) < .002) current = target;
      paint();
      frame = current === target ? 0 : requestAnimationFrame(tick);
    };
    animation.current = (next, immediate = false) => {
      target = next;
      if (immediate || reduced.matches) {
        cancelAnimationFrame(frame); frame = 0; current = target; paint();
      } else if (!frame) { last = 0; frame = requestAnimationFrame(tick); }
    };
    const resize = () => {
      width = root.clientWidth;
      const height = root.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix(); paint();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(root); resize();
    const motionChanged = () => { if (reduced.matches) animation.current?.(target, true); };
    reduced.addEventListener("change", motionChanged);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); animation.current = undefined;
      reduced.removeEventListener("change", motionChanged);
      objects.forEach(object => scene.remove(object));
      renderer.domElement.remove();
    };
  }, [elements, count]);

  useEffect(() => {
    animation.current?.(position);
    if (host.current?.contains(document.activeElement)) elements[index].querySelector("button")?.focus({ preventScroll: true });
  }, [position, elements, index]);

  function select(i: number) {
    if (suppressClick.current) { suppressClick.current = false; return; }
    if (i === index) onSelectTopic(topics[i]);
    else setPosition(position + ((i - index + count * 1.5) % count - count / 2));
  }

  return <div className="carousel-ring" onKeyDown={event => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); setPosition(value => value + (event.key === "ArrowLeft" ? -1 : 1)); }
  }} onPointerDown={event => {
    if (!host.current?.contains(event.target as Node) || (event.pointerType === "mouse" && event.button !== 0)) return;
    suppressClick.current = false;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, position, moved: false };
  }} onPointerMove={event => {
    const start = drag.current;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    if (!start.moved && Math.abs(event.clientY - start.y) > Math.abs(dx) + 8) { drag.current = undefined; return; }
    if (Math.abs(dx) > 8 && count > 1) {
      start.moved = true; suppressClick.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      animation.current?.(start.position - dx / 240, true);
    }
  }} onPointerUp={event => {
    const start = drag.current; drag.current = undefined;
    if (!start || start.id !== event.pointerId || !start.moved) return;
    const next = start.position - Math.round((event.clientX - start.x) / 240);
    animation.current?.(next); setPosition(next);
  }} onPointerCancel={() => { drag.current = undefined; animation.current?.(position); }}>
    <div className="carousel-stage" ref={host} />
    {elements.map((element, i) => {
      const topic = topics[i]; const Icon = topic.category.icon;
      return createPortal(<button type="button" className="topic-card carousel-card" tabIndex={i === index ? 0 : -1}
        aria-label={topic.title[language]} aria-current={i === index ? "true" : undefined}
        style={{ "--accent": topic.category.accent } as React.CSSProperties} onClick={() => select(i)}>
        <div className="topic-card-topline"><Icon size={26} aria-hidden="true" /><span className="topic-meta">{topic.category.title[language]}</span></div>
        <span className="carousel-card-number">{String(i + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
        <h3>{topic.title[language]}</h3><p>{topic.summary[language]}</p>
        <span className="topic-card-entry">{t("阅读与探索", "Read and explore", "読んで探る", "읽고 탐구하기")}<ArrowUpRight size={16} aria-hidden="true" /></span>
      </button>, element, topic.title.en);
    })}
    <div className="carousel-navigation">
      <button type="button" disabled={count < 2} title={t("向左旋转", "Rotate left", "左へ回転", "왼쪽 회전")} aria-label={t("向左旋转", "Rotate left", "左へ回転", "왼쪽 회전")} onClick={() => setPosition(value => value - 1)}><ArrowLeft size={20} /></button>
      <output aria-live="polite">{index + 1} / {count}<span>{topics[index].title[language]}</span></output>
      <button type="button" disabled={count < 2} title={t("向右旋转", "Rotate right", "右へ回転", "오른쪽 회전")} aria-label={t("向右旋转", "Rotate right", "右へ回転", "오른쪽 회전")} onClick={() => setPosition(value => value + 1)}><ArrowRight size={20} /></button>
    </div>
  </div>;
}
