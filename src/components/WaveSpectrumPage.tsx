import type { ReactNode } from "react";
import { ArrowLeft, BookOpen, Waves } from "lucide-react";
import type { Language } from "../content/knowledge";
import { text } from "../content/language";
import { signalExamples, waveSpectrumSections, waveSpectrumTopic as topic } from "../content/waveSpectrum";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { TopicPager } from "./TopicPager";
import { SoundCompositionExperiment } from "./SoundCompositionExperiment";

export function WaveSpectrumPage({ language, onBack, onOpenLab, onPrevious, onNext, relatedTopics }: {
  language: Language; onBack: () => void; onOpenLab: () => void; onPrevious: () => void; onNext: () => void; relatedTopics: ReactNode;
}) {
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
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
        <h2>{section.title[language]}</h2>
        {index === 1 ? <>
        <h3>{t("两个声音相遇，为什么可以相加或抵消？", "How can two sounds reinforce or cancel?", "二つの音が強め合い、打ち消し合う理由", "두 소리가 더해지거나 상쇄되는 이유")}</h3>
        <p>{t("在近似线性、小振幅条件下，同一位置、同一时刻的声压可以相加。不是把图形拼在一起，而是把每个时刻的数值相加。下面两个分量具有相同频率；保持相同振幅，把 B 的相位从 0° 调到 180°，观察合成曲线如何由增强走向抵消。", "For approximately linear, small-amplitude sound, pressures add at the same place and instant. This is numerical addition at each moment, not joining drawings. Below, two equal-frequency components can reinforce at 0° or cancel at 180° when their amplitudes match.", "小振幅で線形とみなせる場合、同位置・同時刻の音圧を数値として足せます。同周波数・同振幅の二成分では、位相0°で強め合い、180°で打ち消し合います。", "작은 진폭의 선형 조건에서 같은 위치와 시점의 음압을 더할 수 있습니다. 같은 주파수와 진폭의 두 성분은 위상 0°에서 강화되고 180°에서 상쇄됩니다.")}</p>
        <SoundCompositionExperiment language={language} mode="sum" />
        <p>{t("再把 B 的振幅调小：即使相差 180°，也不再完全抵消。这里是在播放前把信号相加，用来解释叠加原理，不等于两只扬声器能让整个房间安静；真实空间里，相位差会随位置和传播路径改变。", "Reduce B's amplitude: even at 180°, cancellation is incomplete. Here signals are summed before playback to demonstrate superposition. Two loudspeakers do not silence an entire room: phase differences vary with position and propagation path.", "Bの振幅を減らすと180°でも完全には消えません。これは再生前の加算であり、二台のスピーカーで部屋全体を無音にできる意味ではありません。位相差は位置と経路で変わります。", "B의 진폭을 줄이면 180°에서도 완전히 사라지지 않습니다. 재생 전 신호 합산이며 두 스피커로 방 전체를 무음으로 만든다는 뜻이 아닙니다. 위상 차이는 위치와 경로에 따라 달라집니다.")}</p>

        <h3>{t("复杂声音：从正弦分量走向频谱", "Complex sounds: from sine components to spectra", "複雑な音：正弦成分からスペクトルへ", "복잡한 소리: 정현파 성분에서 스펙트럼으로")}</h3>
        <p>{t("同样一个音符，钢琴与吉他仍然不同。真实声音通常包含多个频率成分，以及随时间变化的起音、持续和衰减。这里先固定包络，只改变频率成分：基频 f 决定重复的基本周期，2f、3f 是它的整数倍谐波。加入谐波后，波形不再是单一正弦，但可以仍以同一基频重复。", "A piano and guitar can play the same note yet differ. Real sounds combine frequency components with evolving attacks and decays. Here we hold the envelope steady and change components: f is the fundamental, while 2f and 3f are harmonics. Adding them changes shape while retaining the fundamental repetition rate.", "同じ音でも楽器は異なります。音には周波数成分と立ち上がり・減衰があります。ここでは包絡を固定し、基音fと倍音2f、3fを変えます。形が変わっても基本周期は保てます。", "같은 음도 악기마다 다릅니다. 소리에는 주파수 성분과 시작, 감쇠가 있습니다. 여기서는 포락선을 고정하고 기본음 f와 배음 2f, 3f를 바꿉니다. 모양이 바뀌어도 기본 주기는 유지될 수 있습니다.")}</p>
        <SoundCompositionExperiment language={language} mode="spectrum" />
        <p>{t("波形回答“这一刻是多少”，幅度频谱回答“有哪些频率、各有多强”。改变相位会改变分量怎样对齐，却不改变这张幅度线谱的高度。因此仅凭幅度频谱，不能唯一还原原始波形，还需要相位。更一般的非周期声音，需要连续频谱或分帧分析，不能只用几个谐波概括。", "A waveform answers 'what value now?'; an amplitude spectrum answers 'which frequencies and how strong?'. Changing phase changes alignment, not these line heights. Magnitudes alone cannot uniquely reconstruct a waveform; phase matters. General nonperiodic sounds need continuous spectra or frame-based analysis, not just a few harmonics.", "波形は各時刻の値、振幅スペクトルは周波数と強さを示します。位相を変えても線の高さは変わりません。復元には位相も必要です。非周期音は数個の倍音だけでは表せません。", "파형은 각 시점의 값, 진폭 스펙트럼은 주파수와 강도를 나타냅니다. 위상을 바꿔도 선 높이는 같습니다. 복원에는 위상도 필요하며 비주기음은 몇 개의 배음만으로 설명할 수 없습니다.")}</p>
        <div className="sound-topic-formula-block"><code>x(t) = Σ Aₙ sin(2πfₙt + φₙ)</code><p>{t("现在再读公式：A 是每个分量的振幅，f 是重复速度，φ 是周期的起始位置，Σ 表示同一时刻逐项相加。它总结的是刚才已经观察到的过程，不是另一个孤立概念。", "Now read the formula: A is component amplitude, f is repetition rate, φ is starting phase, and Σ adds the values at each instant. It summarizes what you just observed.", "Aは振幅、fは繰り返し速度、φは初期位相、Σは同時刻の加算です。式は観察した過程をまとめています。", "A는 진폭, f는 반복 속도, φ는 초기 위상, Σ는 같은 시점의 합입니다. 공식은 방금 관찰한 과정을 요약합니다.")}</p></div>
        </> : <p>{section.body[language]}</p>}
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
