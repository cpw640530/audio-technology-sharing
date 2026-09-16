import { Activity, ArrowDown } from "lucide-react";
import type { Language } from "../content/knowledge";
import { categories, interfaceCopy } from "../content/knowledge";
import { HeroSignalMap } from "./HeroSignalMap";

export function Hero({ language, totalTopics }: { language: Language; totalTopics: number }) {
  const zh = language === "zh";
  return (
    <section className="hero home-intro" id="top">
      <div className="hero-copy">
        <h1>{interfaceCopy.title[language]}</h1>
        <p className="hero-subtitle">{zh
          ? "从声音原理到 AI 模型，连接音频硬件、软件与算法。通过图解和交互实验，理解每一步信号处理。"
          : "Connect sound, hardware, software and AI. Explore the signal chain through clear explanations and interactive experiments."}</p>
      </div>
      <div className="home-intro-footer">
        <a className="hero-action" href="#knowledge-content">
          <span>{zh ? "开始探索" : "Explore topics"}</span><ArrowDown size={17} aria-hidden="true" />
        </a>
        <p className="home-index-count">{categories.length} {zh ? "知识分类" : "knowledge areas"}<span aria-hidden="true"> / </span>{totalTopics} {zh ? "主题" : "topics"}<span aria-hidden="true"> / </span>AI + DSP</p>
      </div>
      <div className="signal-panel" data-testid="animated-signal-panel" aria-hidden="true">
        <div className="signal-header">
          <span className="signal-title"><Activity size={16} />audio.signal.map</span>
          <span className="signal-live"><i /> DEMO</span>
        </div>
        <div className="signal-readout">
          <span><small>INPUT</small><strong>-12.4 dBFS</strong></span>
          <span><small>RATE</small><strong>48 kHz</strong></span>
          <span><small>LATENCY</small><strong>8.0 ms</strong></span>
        </div>
        <HeroSignalMap />
        <div className="pipeline">
          {["Mic", "ADC", "DSP", "AI", "Output"].map((node, index) => (
            <span key={node} style={{ "--node-delay": `${index * 0.22}s` } as React.CSSProperties}>{node}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
