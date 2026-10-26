import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { Language } from "../content/knowledge";

export function TopicReadingLayout({ language, children }: { language: Language; children: ReactNode }) {
  const content = useRef<HTMLDivElement>(null);
  const [chapters, setChapters] = useState<{ id: string; title: string; element: HTMLHeadingElement }[]>([]);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(true);
  const jump = useRef<{ id: string; y: number } | null>(null);

  useLayoutEffect(() => {
    const headings = Array.from(content.current?.querySelectorAll("h2") ?? []);
    const next = headings.map((element, index) => {
      if (!element.id || element.id.startsWith("topic-chapter-")) {
        element.id = `topic-chapter-${index + 1}`;
      }
      element.tabIndex = -1;
      return { id: element.id, title: element.textContent ?? "", element };
    });
    jump.current = null;
    setChapters(next);
    setActive(next[0]?.id ?? "");
  }, [children, language]);

  useEffect(() => {
    if (!window.matchMedia) return;
    const desktop = window.matchMedia("(min-width: 1100px)");
    const sync = () => setOpen(desktop.matches);
    sync();
    desktop.addEventListener("change", sync);
    return () => desktop.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!chapters.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      // Near the page bottom, scrolling may stop before the selected section reaches the top.
      if (jump.current && Math.abs(window.scrollY - jump.current.y) < 1) {
        setActive(jump.current.id);
        return;
      }
      jump.current = null;
      let current = chapters[0].id;
      for (const chapter of chapters) {
        const section = chapter.element;
        if (section && section.getBoundingClientRect().top <= 140) current = chapter.id;
      }
      if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = chapters[chapters.length - 1].id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [chapters]);

  return (
    <div className="topic-reading-layout">
    <aside className="topic-contents">
      <details open={open} onToggle={event => setOpen(event.currentTarget.open)}>
        <summary>{language === "zh" ? "本页目录" : "On this page"}</summary>
        <nav aria-label={language === "zh" ? "章节目录" : "Page contents"}>
          {chapters.map(chapter => (
            <a key={chapter.id} href={`#${chapter.id}`}
              aria-current={active === chapter.id ? "location" : undefined}
              onClick={event => {
                const section = chapter.element;
                if (!section) return;
                event.preventDefault();
                section.focus({ preventScroll: true });
                section.scrollIntoView({ block: "start", behavior: "instant" });
                jump.current = { id: chapter.id, y: window.scrollY };
                setActive(chapter.id);
              }}>
              {chapter.title}
            </a>
          ))}
        </nav>
      </details>
    </aside>
    <div className="sound-topic-content" ref={content}>{children}</div>
    </div>
  );
}
