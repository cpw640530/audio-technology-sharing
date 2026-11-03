import { Activity, ArrowDown } from "lucide-react";
import type { Language } from "../content/knowledge";
import { categories, interfaceCopy } from "../content/knowledge";
import { HeroSignalMap } from "./HeroSignalMap";
import { text } from "../content/language";

export function Hero({ language, totalTopics }: { language: Language; totalTopics: number }) {
  return (
    <section className="hero home-intro" id="top">
      <div className="hero-copy">
        <h1>{interfaceCopy.title[language]}</h1>
        <p className="hero-subtitle">{text(language, "从声音原理到 AI 模型，连接音频硬件、软件与算法。通过图解和交互实验，理解每一步信号处理。", "Connect sound, hardware, software and AI. Explore the signal chain through clear explanations and interactive experiments.", "音の原理から AI モデルまで、ハードウェア・ソフトウェア・アルゴリズムをつなぎ、図解と実験で信号処理を学びます。", "소리의 원리부터 AI 모델까지 하드웨어, 소프트웨어, 알고리즘을 연결합니다. 도해와 실험으로 신호 처리의 각 단계를 이해하세요.")}</p>
      </div>
      <div className="home-intro-footer">
        <a className="hero-action" href="#knowledge-content">
          <span>{text(language, "开始探索", "Explore topics", "トピックを探す", "주제 살펴보기")}</span><ArrowDown size={17} aria-hidden="true" />
        </a>
        <p className="home-index-count">{categories.length} {text(language, "知识分类", "knowledge areas", "分野", "분야")}<span aria-hidden="true"> / </span>{totalTopics} {text(language, "主题", "topics", "トピック", "주제")}<span aria-hidden="true"> / </span>AI + DSP</p>
      </div>
      <div className="signal-panel" data-testid="animated-signal-panel" aria-hidden="true">
        <div className="signal-header">
          <span className="signal-title"><Activity size={16} />audio.signal.map</span>
          <span className="signal-live"><i /> {text(language, "DEMO", "DEMO", "デモ", "데모")}</span>
        </div>
        <div className="signal-readout">
          <span><small>{text(language, "INPUT", "INPUT", "入力", "입력")}</small><strong>-12.4 dBFS</strong></span>
          <span><small>{text(language, "RATE", "RATE", "標本化周波数", "샘플링 주파수")}</small><strong>48 kHz</strong></span>
          <span><small>{text(language, "LATENCY", "LATENCY", "遅延", "지연")}</small><strong>8.0 ms</strong></span>
        </div>
        <HeroSignalMap />
        <div className="pipeline">
          {[text(language, "Mic", "Mic", "マイク", "마이크"), "ADC", "DSP", "AI", text(language, "Output", "Output", "出力", "출력")].map((node, index) => (
            <span key={node} style={{ "--node-delay": `${index * 0.22}s` } as React.CSSProperties}>{node}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
