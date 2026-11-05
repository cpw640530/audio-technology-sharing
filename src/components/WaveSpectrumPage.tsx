import type { ReactNode } from "react";
import { ArrowLeft, BookOpen, Waves } from "lucide-react";
import type { Language } from "../content/knowledge";
import { text } from "../content/language";
import { signalExamples, waveSpectrumSections, waveSpectrumTopic as topic } from "../content/waveSpectrum";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { TopicPager } from "./TopicPager";

export function WaveSpectrumPage({ language, onBack, onOpenLab, onPrevious, onNext, relatedTopics }: {
  language: Language; onBack: () => void; onOpenLab: () => void; onPrevious: () => void; onNext: () => void; relatedTopics: ReactNode;
}) {
  return <main className="sound-topic-page wave-spectrum-page" aria-labelledby="wave-spectrum-title">
    <header className="sound-topic-hero">
      <button className="sound-topic-back" onClick={onBack}><ArrowLeft size={17} aria-hidden="true" />{text(language, "返回知识库", "Back to knowledge base", "知識ベースに戻る", "지식 모음으로 돌아가기")}</button>
      <div className="sound-topic-kicker"><BookOpen size={16} aria-hidden="true" />{text(language, "音频基础 · 读图入门", "Audio fundamentals · Reading plots", "音声の基礎 · 図を読む", "오디오 기초 · 그래프 읽기")}</div>
      <h1 id="wave-spectrum-title">{topic.title[language]}</h1>
      <p className="sound-topic-lede">{topic.summary[language]}</p>
    </header>
    <TopicReadingLayout language={language}>
      <section className="sound-topic-section">
        <h2>{text(language, "先把两张图对应起来", "Connect the two views", "二つの図を結び付ける", "두 그래프 연결하기")}</h2>
        <p>{topic.detail.explanation[language]}</p>
        <div className="wave-spectrum-entry">
          <Waves size={24} aria-hidden="true" />
          <p>{topic.detail.lab!.description[language]}</p>
          <button className="diagram-open-button" onClick={onOpenLab}>{topic.detail.lab!.buttonLabel[language]}</button>
        </div>
      </section>
      {waveSpectrumSections.map((section, index) => <section className="sound-topic-section" key={section.title.en}>
        <h2>{section.title[language]}</h2><p>{section.body[language]}</p>
        {index === 1 && <div className="sound-topic-formula-block">
          <code>x(t) = A₁ sin(2π · 250t) + A₂ sin(2π · 500t) + A₃ sin(2π · 750t + φ₃)</code>
          <p>{text(language, "t 的单位为秒，A 为各分量峰值振幅，公式中的 φ₃ 用弧度；实验室将角度换算为弧度后计算。", "t is in seconds, A is each component's peak amplitude, and φ₃ is in radians; the lab converts degrees to radians.", "t は秒、A は各成分のピーク振幅、φ₃ はラジアンです。実験室では度をラジアンに変換します。", "t는 초, A는 각 성분의 피크 진폭, φ₃는 라디안입니다. 실험실은 도를 라디안으로 변환합니다.")}</p>
        </div>}
        {index === 1 && <table className="wave-spectrum-table">
          <caption>{text(language, "典型信号的读图线索", "Clues in typical signals", "典型的な信号の見分け方", "대표 신호의 그래프 단서")}</caption>
          <thead><tr>{[
            text(language, "信号", "Signal", "信号", "신호"),
            text(language, "波形", "Waveform", "波形", "파형"),
            text(language, "频谱", "Spectrum", "スペクトル", "스펙트럼")
          ].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
          <tbody>{signalExamples.map(([name, time, frequency]) => <tr key={name.en}><th scope="row">{name[language]}</th><td>{time[language]}</td><td>{frequency[language]}</td></tr>)}</tbody>
        </table>}
      </section>)}
      <section className="sound-topic-section">
        <h2>{text(language, "核心判断", "Key checks", "確認のポイント", "핵심 확인 사항")}</h2>
        <ul>{topic.detail.keyConcepts.map(item => <li key={item.en}>{item[language]}</li>)}</ul>
        <p className="sound-topic-note">{topic.detail.contentDirection[language]}</p>
        <p><a href="https://www.dspguide.com/ch8.htm" target="_blank" rel="noreferrer">DSP Guide · Chapter 8</a> · <a href="https://www.w3.org/TR/webaudio/#PeriodicWave" target="_blank" rel="noreferrer">Web Audio · PeriodicWave</a></p>
      </section>
    </TopicReadingLayout>
    {relatedTopics}
    <TopicPager language={language} onBack={onBack} onPrevious={onPrevious} onNext={onNext} />
  </main>;
}
