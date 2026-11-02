import { useState } from "react";
import { ArrowRight, Headphones, Pause, Play } from "lucide-react";
import type { Language } from "../content/knowledge";

export function WelcomePage({ language, onToggleLanguage }: {
  language: Language;
  onToggleLanguage: () => void;
}) {
  const [paused, setPaused] = useState(false);
  const zh = language === "zh";
  return (
    <div className="welcome-page" data-paused={paused} lang={language}>
      <header className="welcome-header">
        <span className="welcome-brand"><Headphones size={22} aria-hidden="true" />Audio Technology Sharing</span>
        <button type="button" onClick={onToggleLanguage}>{zh ? "English" : "中文"}</button>
      </header>
      <main>
        <section className="welcome-hero" aria-labelledby="welcome-title">
          <img className="welcome-listener" src={`${import.meta.env.BASE_URL}images/welcome-listener-light.png`}
            alt={zh ? "戴着耳机，闭眼聆听的人物插画" : "An illustrated listener wearing headphones with eyes gently closed"}
            width="1536" height="1024" loading="eager" />
          <div className="welcome-copy">
            <p className="welcome-greeting">{zh ? "欢迎来到我的" : "Welcome to my"}</p>
            <h1 id="welcome-title">{zh ? <>音频知识<br />分享网站</> : <>Audio Knowledge<br />Sharing Website</>}</h1>
            <p className="welcome-message">{zh ? "希望你能在这里学到音频相关知识，发现声音背后的原理。" : "I hope you learn something about audio here and discover how sound works."}</p>
            <a className="welcome-enter" href="#top">{zh ? "进入音频知识库" : "Explore audio knowledge"}<ArrowRight size={20} aria-hidden="true" /></a>
          </div>
          <div className="welcome-motion">
            <div className="welcome-equalizer" aria-hidden="true">{[12, 22, 36, 18, 42, 28, 16, 32, 46, 24, 14, 30].map((height, index) => <i key={index} style={{ height, animationDelay: `${index * -0.17}s` }} />)}</div>
            <button type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}
              aria-label={zh ? "暂停背景动画" : "Pause background animation"}
              title={zh ? "暂停背景动画" : "Pause background animation"}>
              {paused ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
            </button>
          </div>
        </section>
        <footer className="welcome-footer">
          <span>{zh ? "从听见声音，到理解声音。" : "From hearing sound to understanding it."}</span>
          <span>{zh ? "基础 · 硬件 · 算法 · AI 音频" : "Fundamentals · Hardware · Algorithms · AI audio"}</span>
        </footer>
      </main>
    </div>
  );
}
