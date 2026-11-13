import { useEffect, useRef, useState } from "react";
import { ArrowRight, Headphones, Pause, Play } from "lucide-react";
import { interfaceCopy, type Language } from "../content/knowledge";
import { LanguageSelect, text } from "../content/language";

export function WelcomePage({ language }: {
  language: Language;
}) {
  const welcomeImageBase = `${import.meta.env.BASE_URL}images/`;
  const hero = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    let inView = true;
    const sync = () => setVisible(inView && !document.hidden);
    const observer = typeof IntersectionObserver === "undefined" ? undefined : new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    if (hero.current) observer?.observe(hero.current);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => { observer?.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);

  return (
    <div className="welcome-page" lang={language}>
      <header className="welcome-header">
        <span className="welcome-brand"><Headphones size={22} aria-hidden="true" />Audio Technology Sharing</span>
        <LanguageSelect language={language} />
      </header>
      <main>
        <section className="welcome-hero" aria-labelledby="welcome-title" ref={hero} data-motion-paused={paused || !visible}>
          <picture>
            <source type="image/webp"
              srcSet={`${welcomeImageBase}welcome-listener-mobile.webp 768w, ${welcomeImageBase}welcome-listener-light.webp 1536w`}
              sizes="100vw" />
            <img className="welcome-listener" src={`${welcomeImageBase}welcome-listener-light.png`}
              alt={text(language, "戴着耳机，闭眼聆听的人物插画", "An illustrated listener wearing headphones with eyes gently closed", "ヘッドホンを着け、目を閉じて聴く人物", "헤드폰을 쓰고 눈을 감은 인물")}
              width="1536" height="1024" loading="eager" {...{ fetchpriority: "high" }} />
          </picture>
          <div className="welcome-copy">
            <p className="welcome-greeting">{text(language, "欢迎来到我的", "Welcome to my", "ようこそ", "환영합니다")}</p>
            <h1 id="welcome-title">{interfaceCopy.title[language]}</h1>
            <p className="welcome-message">{text(language, "从声音基础到音频硬件、信号处理与 AI，通过图解和交互实验理解声音背后的原理。", "Learn sound, hardware, signal processing and AI through diagrams and interactive experiments.", "音の基礎からオーディオ機器、信号処理、AI まで。図解と対話型の実験で、音の仕組みを学びます。", "소리의 기초부터 오디오 하드웨어, 신호 처리와 AI까지. 도해와 인터랙티브 실험으로 소리의 원리를 이해하세요.")}</p>
            <a className="welcome-enter" href="#top">{text(language, "进入知识库", "Explore audio knowledge", "オーディオ知識を探る", "오디오 지식 살펴보기")}<ArrowRight size={20} aria-hidden="true" /></a>
          </div>
          <button type="button" className="welcome-portrait-motion"
            aria-label={text(language, paused ? "播放人物动态" : "暂停人物动态", paused ? "Play portrait motion" : "Pause portrait motion", paused ? "人物の動きを再生" : "人物の動きを停止", paused ? "인물 움직임 재생" : "인물 움직임 일시 정지")}
            title={text(language, paused ? "播放人物动态" : "暂停人物动态", paused ? "Play portrait motion" : "Pause portrait motion", paused ? "人物の動きを再生" : "人物の動きを停止", paused ? "인물 움직임 재생" : "인물 움직임 일시 정지")}
            onClick={() => setPaused(value => !value)}>
            {paused ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
          </button>
        </section>
        <footer className="welcome-footer">
          <span>{text(language, "从听见声音，到理解声音。", "From hearing sound to understanding it.", "音を聴くことから、理解することへ。", "소리를 듣는 것에서 이해하는 것으로.")}</span>
          <span>{text(language, "基础 · 硬件 · 算法 · AI 音频", "Fundamentals · Hardware · Algorithms · AI audio", "基礎 · ハードウェア · アルゴリズム · AI オーディオ", "기초 · 하드웨어 · 알고리즘 · AI 오디오")}</span>
        </footer>
      </main>
    </div>
  );
}
