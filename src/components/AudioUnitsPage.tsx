import { text } from "../content/language";
import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, Gauge, Ruler } from "lucide-react";
import { categories, type Language } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type AudioUnitsPageProps = {
  relatedTopics?: ReactNode;
  language: Language;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenPrevious: () => void;
  onOpenNext: () => void;
};

const audioUnitsTopic = categories
  .find((category) => category.id === "fundamentals")
  ?.topics.find((topic) => topic.title.en === "Sound and Audio Units")!;

if (!audioUnitsTopic) {
  throw new Error("The audio units topic is required for the professional unit guide.");
}

const references: Record<string, Record<Language, string>> = {
  dB: { zh: "比例：必须先说明比较对象", en: "Ratio: always name the compared quantities", ja: "比：比較する量を明示する", ko: "비율: 비교 대상을 명시" },
  dBSPL: { zh: "声压参考：20 µPa", en: "Acoustic reference: 20 µPa", ja: "音圧の基準：20 µPa", ko: "음압 기준: 20 µPa" },
  dBFS: { zh: "数字参考：0 dBFS 满刻度", en: "Digital reference: 0 dBFS full scale", ja: "デジタルの基準：0 dBFS フルスケール", ko: "디지털 기준: 0 dBFS 풀 스케일" },
  "dBu / dBV": { zh: "模拟电压：0.775 / 1 Vrms", en: "Analog voltage: 0.775 / 1 Vrms", ja: "アナログ電圧：0.775 / 1 Vrms", ko: "아날로그 전압: 0.775 / 1 Vrms" }
};

export function AudioUnitsPage({ relatedTopics, language, onBack, onOpenLab, onOpenPrevious, onOpenNext }: AudioUnitsPageProps) {
  const detail = audioUnitsTopic.detail;
  const terms = detail.termExplanations ?? [];
  const chain = {
    zh: ["数字样本 dBFS", "DAC 输出电压", "功放增益", "扬声器灵敏度", "测得 dBSPL"],
    en: ["Digital samples dBFS", "DAC output voltage", "Amplifier gain", "Speaker sensitivity", "Measured dBSPL"],
    ja: ["デジタル値 dBFS", "DAC 出力電圧", "アンプのゲイン", "スピーカー感度", "測定値 dBSPL"],
    ko: ["디지털 값 dBFS", "DAC 출력 전압", "앰프 게인", "스피커 감도", "측정값 dBSPL"]
  }[language];

  return (
    <main className="sound-topic-page audio-units-page" aria-labelledby="audio-units-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {text(language, "返回知识库", "Back to knowledge base", "知識ベースに戻る", "지식 모음으로 돌아가기")}
        </button>
        <div className="sound-topic-kicker">
          <BookOpen size={16} aria-hidden="true" />
          {text(language, "音频基础 · 单位体系", "Audio fundamentals · Unit system", "オーディオの基礎 · 単位体系", "오디오 기초 · 단위 체계")}
        </div>
        <h1 id="audio-units-topic-title">{audioUnitsTopic.title[language]}</h1>
        <p className="sound-topic-lede">{audioUnitsTopic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{text(language, "参考点", "Reference points", "基準値", "기준값")}</span>
          <span>{text(language, "电平与响度", "Level and loudness", "レベルとラウドネス", "레벨과 라우드니스")}</span>
          <span>{text(language, "声学测量", "Acoustic measurement", "音響測定", "음향 측정")}</span>
        </div>
      </header>

      <TopicReadingLayout language={language}>
        <section className="sound-topic-section sound-topic-intro">

          <div>
            <h2>{text(language, "先问：这个 dB 相对于什么？", "First ask: relative to what?", "まず「何を基準にした dB か」を確認", "먼저 확인: 무엇을 기준으로 한 dB인가?")}</h2>
            <p>{detail.explanation[language]}</p>
          </div>
        </section>

        <section className="sound-topic-section sound-topic-bottom-grid">
          <div>
            <h2>{text(language, "换算前先确认边界", "Check the boundary before converting", "換算の前に適用範囲を確認", "환산 전에 적용 범위 확인")}</h2>
            <p>{detail.misconception[language]}</p>
          </div>
          <div className="sound-topic-cta">
            <Gauge size={22} aria-hidden="true" />
            <h2>{text(language, "进入换算实验室", "Open the conversion lab", "単位換算実験室へ", "단위 환산 실험실 열기")}</h2>
            <p>{text(language, "输入源单位和数值，观察同一参考域内的等效结果，并用距离计算器理解理想自由场衰减。", "Enter a source unit and value, inspect equivalent results inside one reference domain, and use the distance calculator to understand ideal free-field loss.", "元の単位と値を入力し、同じ基準領域での換算結果を確認します。距離計算で理想自由音場の減衰も調べられます。", "원래 단위와 값을 입력해 같은 기준 영역 안의 환산 결과를 확인하고, 거리 계산기로 이상적인 자유 음장의 감쇠를 살펴보세요.")}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>
              {detail.lab?.buttonLabel[language]}
            </button>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{text(language, "同一个 dB，不同的参考点", "The same dB, different references", "同じ dB でも基準が異なる", "같은 dB라도 기준은 다름")}</h2>
              <p>{text(language, "后缀决定它属于声压、电压、功率还是数字系统。先分域，再比较数值。", "The suffix tells you whether the value belongs to pressure, voltage, power, or a digital system. Identify the domain before comparing numbers.", "接尾辞で音圧・電圧・電力・デジタル系のどれかが決まります。数値を比較する前に領域を確認しましょう。", "접미사는 음압, 전압, 전력, 디지털 시스템 중 어떤 영역인지 나타냅니다. 수치를 비교하기 전에 영역부터 구분하세요.")}</p>
            </div>
          </div>
          <div className="audio-units-reference-grid">
            {terms.slice(0, 4).map((term) => (
              <article key={term.name.en} className="audio-units-reference">
                <h3>{term.name[language]}</h3>
                <span>{references[term.name.en]?.[language]}</span>
                <p>{term.explanation[language]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{text(language, "从数字电平到真实声压", "From digital level to real SPL", "デジタルレベルから実際の音圧レベルへ", "디지털 레벨에서 실제 음압 레벨까지")}</h2>
              <p>{text(language, "dBFS 不是 dBSPL。中间要经过硬件增益、扬声器和测量距离。", "dBFS is not dBSPL. Hardware gain, the speaker, and measurement distance sit between them.", "dBFS と dBSPL は別の量です。その間には機器のゲイン、スピーカー、測定距離が関わります。", "dBFS와 dBSPL은 다릅니다. 둘 사이에는 하드웨어 게인, 스피커 및 측정 거리가 관여합니다.")}</p>
            </div>
          </div>
          <ol className="sound-topic-flow audio-units-chain" aria-label={text(language, "数字电平到声压的链路", "Digital level to SPL chain", "デジタルレベルから音圧への経路", "디지털 레벨에서 음압까지의 경로")}>
            {chain.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
          <div className="audio-units-formulas">
            <div>
              <code>dB = 20 log10(A2 / A1)</code>
              <p>{text(language, "幅度减半约为 -6 dB；幅度比采用相同测量定义。比较电压所对应的功率时，还需保证阻抗相同。", "Halving amplitude is about -6 dB; use the same amplitude measure. Relating voltage ratios to power also requires equal impedance.", "振幅が半分になると約 -6 dB です。同じ振幅の定義で比較してください。電圧比を電力比に対応させる場合は同じインピーダンスも必要です。", "진폭이 절반이면 약 -6 dB입니다. 같은 진폭 측정 기준을 사용해야 합니다. 전압비를 전력비와 연결하려면 임피던스도 같아야 합니다.")}</p>
            </div>
            <div>
              <code>dB = 10 log10(P2 / P1)</code>
              <p>{text(language, "功率翻倍约为 +3 dB，不要与幅度翻倍的 +6 dB 混淆。", "Doubling power is about +3 dB, unlike the +6 dB from doubling amplitude.", "電力が 2 倍なら約 +3 dB。振幅が 2 倍のときの +6 dB と区別してください。", "전력이 두 배면 약 +3 dB이며 진폭이 두 배일 때의 +6 dB와 다릅니다.")}</p>
            </div>
            <div>
              <code>Vrms = 0.775 × 10^(dBu / 20)</code>
              <p>{text(language, "+4 dBu 约等于 1.228 Vrms；这是电压参考，不是声压级。", "+4 dBu is about 1.228 Vrms: a voltage reference, not a sound pressure level.", "+4 dBu は約 1.228 Vrms です。電圧の基準であり音圧レベルではありません。", "+4 dBu는 약 1.228 Vrms로, 음압 레벨이 아닌 전압 기준입니다.")}</p>
            </div>
            <div>
              <Gauge size={18} aria-hidden="true" />
              <code>dBSPL = 20 log10(p / 20 µPa)</code>
              <p>{text(language, "声压级使用 20 µPa 作为参考，94 dBSPL 约等于 1 Pa。", "SPL uses 20 µPa as its reference; 94 dBSPL is approximately 1 Pa.", "音圧レベルの基準は 20 µPa で、94 dBSPL は約 1 Pa です。", "음압 레벨은 20 µPa를 기준으로 하며 94 dBSPL은 약 1 Pa입니다.")}</p>
            </div>
            <div>
              <Ruler size={18} aria-hidden="true" />
              <code>samples = sampleRate × time</code>
              <p>{text(language, "48 kHz 下，480 samples 对应 10 ms；这是数字延迟，不是声压。", "At 48 kHz, 480 samples equal 10 ms; this is digital latency, not acoustic pressure.", "48 kHz では 480 サンプルが 10 ms に相当します。これはデジタル遅延で、音圧ではありません。", "48 kHz에서 480샘플은 10 ms입니다. 이는 디지털 지연이며 음압이 아닙니다.")}</p>
            </div>
          </div>
          <p className="sound-topic-note">{text(language, "不能把 -6 dBFS 直接换成 94 dBSPL：必须知道 DAC 满刻度电压、功放增益、扬声器灵敏度和测量距离。", "You cannot directly convert -6 dBFS to 94 dBSPL: DAC full-scale voltage, amplifier gain, speaker sensitivity, and measurement distance must be known.", "-6 dBFS を直接 94 dBSPL に換算することはできません。DAC のフルスケール電圧、アンプのゲイン、スピーカー感度、測定距離が必要です。", "-6 dBFS를 94 dBSPL로 바로 환산할 수 없습니다. DAC 풀 스케일 전압, 앰프 게인, 스피커 감도 및 측정 거리를 알아야 합니다.")}</p>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{text(language, "常见单位词典", "Common unit glossary", "よく使う単位", "자주 쓰는 단위")}</h2>
              <p>{text(language, "把常用符号放回真实工程场景，而不是孤立背定义。", "Put common symbols back into real engineering contexts instead of memorizing isolated definitions.", "定義の暗記ではなく、実際の設計・測定の文脈で記号を理解しましょう。", "정의만 외우기보다 실제 설계 및 측정 맥락에서 기호를 이해하세요.")}</p>
            </div>
          </div>
          <div className="sound-topic-glossary">
            {terms.slice(4).map((term) => (
              <article key={term.name.en}>
                <h3>{term.name[language]}</h3>
                <p>{term.explanation[language]}</p>
              </article>
            ))}
          </div>
        </section>

      </TopicReadingLayout>
      {relatedTopics}
      <TopicPager language={language} onPrevious={onOpenPrevious} onBack={onBack} onNext={onOpenNext} />
    </main>
  );
}
