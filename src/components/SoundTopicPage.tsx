import { text } from "../content/language";
import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, Waves } from "lucide-react";
import { categories, type Language } from "../content/knowledge";
import { SoundWaveDiagram } from "./TopicDetails";
import { TopicPager } from "./TopicPager";
import { SoundPropagationDiagram } from "./SoundPropagationDiagram";

type SoundTopicPageProps = {
  relatedTopics?: ReactNode;
  language: Language;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenNext: () => void;
};

const soundTopic = categories
  .find((category) => category.id === "fundamentals")
  ?.topics.find((topic) => topic.title.en === "What Sound Is")!;

if (!soundTopic) {
  throw new Error("The sound topic is required for the professional sound guide.");
}

export function SoundTopicPage({ relatedTopics, language, onBack, onOpenLab, onOpenNext }: SoundTopicPageProps) {
  const detail = soundTopic.detail;
  const terms = detail.termExplanations ?? [];

  return (
    <main className="sound-topic-page" aria-labelledby="sound-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {text(language, "返回知识库", "Back to knowledge base", "知識ベースに戻る", "지식 모음으로 돌아가기")}
        </button>
        <div className="sound-topic-kicker">
          <BookOpen size={16} aria-hidden="true" />
          {text(language, "音频基础 · 专业内容", "Audio fundamentals · Deep dive", "オーディオの基礎 · 詳しい解説", "오디오 기초 · 상세 설명")}
        </div>
        <h1 id="sound-topic-title">{soundTopic.title[language]}</h1>
        <p className="sound-topic-lede">{soundTopic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{text(language, "物理声学", "Acoustics", "音響学", "음향학")}</span>
          <span>{text(language, "信号模型", "Signal model", "信号モデル", "신호 모델")}</span>
          <span>{text(language, "采集前端", "Capture front end", "収音フロントエンド", "수음 프런트엔드")}</span>
        </div>
      </header>

      <TopicReadingLayout language={language}>
        <section className="sound-topic-section sound-topic-intro">

          <div>
            <h2>{text(language, "先建立一个准确的直觉", "Start with the right intuition", "まず正しいイメージをつかむ", "올바른 직관부터 이해하기")}</h2>
            <p>{detail.explanation[language]}</p>
          </div>
        </section>

        <section className="sound-topic-section sound-topic-bottom-grid">
          <div>
            <h2>{text(language, "两个必须记住的边界", "Two boundaries to remember", "覚えておきたい二つの区別", "기억해야 할 두 가지 구분")}</h2>
            <p>{detail.misconception[language]}</p>
          </div>
          <div className="sound-topic-cta">
            <Waves size={22} aria-hidden="true" />
            <h2>{text(language, "继续动手验证", "Keep experimenting", "実験で確かめる", "실험으로 확인하기")}</h2>
            <p>{text(language, "用实验室调节频率、振幅和相位，把公式和听感对应起来。", "Use the lab to connect frequency, amplitude, and phase with the formula and what you hear.", "実験室で周波数・振幅・位相を変え、式と聴こえ方を結び付けましょう。", "실험실에서 주파수, 진폭, 위상을 조절하며 수식과 들리는 소리를 연결해 보세요.")}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>
              {detail.lab?.buttonLabel[language]}
            </button>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{text(language, "从振动到 PCM：一条工程链路", "From vibration to PCM: the engineering chain", "振動から PCM までの信号経路", "진동에서 PCM까지의 신호 경로")}</h2>
              <p>{text(language, "每一步都改变信号的表达方式，但物理量和数字量不能混为一谈。", "Each step changes the representation, but physical and digital quantities must not be conflated.", "各段階で表現は変わりますが、物理量とデジタル値は区別する必要があります。", "단계마다 표현 방식은 바뀌지만 물리량과 디지털 수치를 혼동하면 안 됩니다.")}</p>
            </div>
          </div>
          <SoundPropagationDiagram language={language} />
          <p className="sound-topic-note">{terms.find((term) => term.name.en === "From pressure to PCM")?.explanation[language]}</p>
        </section>

        <section className="sound-topic-section sound-topic-model-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{text(language, "用一个正弦模型读懂声音", "Read sound through a sine model", "正弦波モデルで音を理解する", "정현파 모델로 소리 이해하기")}</h2>
              <p>{text(language, "正弦波不是所有声音，但它是理解频率、振幅和相位最清晰的起点。", "A sine wave is not every sound, but it is the clearest starting point for frequency, amplitude, and phase.", "正弦波がすべての音を表すわけではありませんが、周波数・振幅・位相を理解する出発点になります。", "정현파가 모든 소리를 나타내지는 않지만 주파수, 진폭, 위상을 이해하는 명확한 출발점입니다.")}</p>
            </div>
          </div>
          <div className="sound-topic-model-grid">
            <div className="sound-topic-formula-block">
              <code>Δp(t) = Â · sin(2πft + φ)</code>
              <dl>
                <div><dt>Â</dt><dd>{text(language, "峰值声压，决定压力变化的幅度", "Peak pressure; the size of the pressure variation", "ピーク音圧：圧力変化の大きさ", "최대 음압: 압력 변화의 크기")}</dd></div>
                <div><dt>f</dt><dd>{text(language, "频率，决定周期快慢，T = 1/f", "Frequency; cycle rate, T = 1/f", "周波数：周期の繰り返し速度、T = 1/f", "주파수: 주기의 반복 속도, T = 1/f")}</dd></div>
                <div><dt>φ</dt><dd>{text(language, "初相位，决定从周期的哪个位置开始", "Initial phase; where the cycle starts", "初期位相：周期のどこから始まるか", "초기 위상: 주기가 시작되는 위치")}</dd></div>
              </dl>
              <p>{text(language, "在空气中还可以用 λ = c/f 估算空间波长，20°C 时 c 约为 343 m/s。", "In air, spatial wavelength can be estimated with λ = c/f; at 20°C, c is about 343 m/s.", "空気中の波長は λ = c/f で求められます。20°C では音速 c は約 343 m/s です。", "공기 중 파장은 λ = c/f로 계산하며, 20°C에서 음속 c는 약 343 m/s입니다.")}</p>
            </div>
            {detail.diagram?.type === "sound-wave" ? (
              <SoundWaveDiagram caption={detail.diagram.caption} label={detail.diagram.label} language={language} />
            ) : null}
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{text(language, "核心概念词典", "Core concept glossary", "基本用語", "핵심 용어")}</h2>
              <p>{text(language, "把物理量、听感和工程单位放在同一张地图上。", "Put physical quantities, perception, and engineering units on one map.", "物理量、聴感、工学的な単位の関係を整理します。", "물리량, 청감, 공학 단위의 관계를 정리합니다.")}</p>
            </div>
          </div>
          <div className="sound-topic-glossary">
            {terms.filter((term) => term.name.en !== "From pressure to PCM").map((term) => (
              <article key={term.name.en}>
                <h3>{term.name[language]}</h3>
                <p>{term.explanation[language]}</p>
              </article>
            ))}
          </div>
        </section>

      </TopicReadingLayout>
      {relatedTopics}
      <TopicPager language={language} onBack={onBack} onNext={onOpenNext} />
    </main>
  );
}
