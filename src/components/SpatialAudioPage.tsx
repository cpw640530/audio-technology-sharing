import type { ReactNode } from "react";
import { TopicReadingLayout } from "./TopicReadingLayout";
import { ArrowLeft, BookOpen, CircuitBoard } from "lucide-react";
import type { Category, Language, Topic } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type DisplayTopic = Topic & { category: Category };

type Localized = Record<"zh" | "en" | "ja" | "ko", string>;

type SpatialAudioPageProps = {
  relatedTopics?: ReactNode;
  language: Language;
  topic: DisplayTopic;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenPrevious?: () => void;
};

const spatialFlow = [
  {
    number: "01",
    title: { zh: "内容与声源", en: "Content and sources", ja: "コンテンツと音源", ko: "콘텐츠 및 음원" },
    detail: { zh: "输入单声道素材、声道床或带位置元数据的对象音频。", en: "Start with mono assets, a channel bed, or objects carrying position metadata.", ja: "モノ素材、チャンネルベッド、または位置メタデータを持つオブジェクト音声を入力する。", ko: "모노 소스, 채널 베드 또는 위치 메타데이터가 있는 객체 오디오를 입력함." }
  },
  {
    number: "02",
    title: { zh: "空间线索", en: "Spatial cues", ja: "空間手掛かり", ko: "공간 단서" },
    detail: { zh: "计算角度、距离、ITD、ILD、耳廓滤波和房间反射。", en: "Compute angle, distance, ITD, ILD, pinna filtering, and room reflections.", ja: "角度、距離、ITD、ILD、耳介フィルター、部屋の反射を計算する。", ko: "각도, 거리, ITD, ILD, 귓바퀴 필터 및 실내 반사를 계산함." }
  },
  {
    number: "03",
    title: { zh: "渲染与映射", en: "Render and map", ja: "レンダリングとマッピング", ko: "렌더링 및 매핑" },
    detail: { zh: "耳机使用 HRIR 卷积；扬声器使用布局、延迟、增益和校正。", en: "Headphones use HRIR convolution; speakers use layout, delay, gain, and calibration.", ja: "ヘッドホンでは HRIR 畳み込みを使い、スピーカーでは配置、遅延、ゲイン、補正を使う。", ko: "헤드폰은 HRIR 컨볼루션을 사용하고, 스피커는 배치, 지연, 게인 및 보정을 사용함." }
  },
  {
    number: "04",
    title: { zh: "播放声场", en: "Playback field", ja: "再生音場", ko: "재생 음장" },
    detail: { zh: "输出双耳 PCM 或多扬声器信号，听者据此感知方向和距离。", en: "Output binaural PCM or multi-speaker signals for perceived direction and distance.", ja: "バイノーラル PCM またはマルチスピーカー信号を出力し、聴取者が方向と距離を知覚できるようにする。", ko: "바이노럴 PCM 또는 다중 스피커 신호를 출력해 청취자가 방향과 거리를 지각하도록 함." }
  }
];

const copy = {
  back: { zh: "返回知识库", en: "Back to knowledge base", ja: "知識ベースに戻る", ko: "지식 베이스로 돌아가기" },
  kicker: { zh: "传统算法 · 专业内容", en: "Traditional DSP · Deep dive", ja: "従来アルゴリズム · 専門解説", ko: "전통 알고리즘 · 전문 해설" },
  localization: { zh: "空间定位", en: "Localization", ja: "空間定位", ko: "공간 위치화" },
  binaural: { zh: "双耳渲染", en: "Binaural rendering", ja: "バイノーラルレンダリング", ko: "바이노럴 렌더링" },
  tracking: { zh: "头部追踪", en: "Head tracking", ja: "ヘッドトラッキング", ko: "헤드 트래킹" },
  intro: { zh: "空间音频先解决一个问题：声音应该位于哪里", en: "Spatial audio answers one question first: where should a sound be?", ja: "空間オーディオがまず解く問題：音はどこにあるべきか", ko: "공간 오디오는 먼저 한 가지를 해결함: 소리는 어디에 있어야 하는가" },
  sourceField: { zh: "从声源到空间声场", en: "From source to spatial field", ja: "音源から空間音場へ", ko: "음원에서 공간 음장으로" },
  sourceFieldLead: { zh: "空间音频不是把左右声道简单拉宽，而是把内容、空间线索和播放设备连接成一条渲染链路。", en: "Spatial audio is not simply widening stereo; it connects content, spatial cues, and playback hardware in one rendering path.", ja: "空間オーディオは左右チャンネルを単に広げることではなく、コンテンツ、空間手掛かり、再生機器を 1 本のレンダリング経路でつなぐ。", ko: "공간 오디오는 단순히 좌우 채널을 넓히는 것이 아니라 콘텐츠, 공간 단서 및 재생 장치를 하나의 렌더링 경로로 연결함." },
  flowAria: { zh: "空间音频处理流程", en: "Spatial audio processing flow", ja: "空間オーディオ処理の流れ", ko: "공간 오디오 처리 흐름" },
  outputPaths: { zh: "耳机与扬声器是两条输出路径", en: "Headphones and speakers are two output paths", ja: "ヘッドホンとスピーカーは別々の出力経路", ko: "헤드폰과 스피커는 서로 다른 출력 경로" },
  outputPathsLead: { zh: "相同的空间对象，必须针对不同播放设备重新渲染，不能直接复用同一组左右声道。", en: "The same spatial object must be rendered for the playback device; one fixed stereo pair cannot serve every output.", ja: "同じ空間オブジェクトでも再生機器ごとに再レンダリングが必要で、固定した 1 組の左右チャンネルをそのまま使い回せない。", ko: "같은 공간 객체라도 재생 장치에 맞게 다시 렌더링해야 하며, 하나의 고정 스테레오 쌍을 모든 출력에 그대로 사용할 수 없음." },
  headphones: { zh: "耳机：双耳渲染", en: "Headphones: binaural rendering", ja: "ヘッドホン：バイノーラルレンダリング", ko: "헤드폰: 바이노럴 렌더링" },
  headphonesText: { zh: "渲染器根据声源方位选择对应 HRIR，并分别与左、右耳滤波器卷积，再叠加距离衰减和房间响应，输出两路双耳 PCM。头部追踪开启后，声源的世界坐标还要实时转换为相对头部的角度。", en: "The renderer selects direction-specific HRIRs, convolves the source with left and right filters, then adds distance loss and room response to produce binaural PCM. With head tracking, world coordinates are continuously converted to head-relative angles.", ja: "レンダラーは音源方向に対応する HRIR を選び、左右のフィルターとそれぞれ畳み込み、距離減衰と部屋の応答を加えて 2 チャンネルのバイノーラル PCM を出力する。ヘッドトラッキング時は世界座標を頭部基準の角度へ連続的に変換する。", ko: "렌더러는 음원 방향에 맞는 HRIR을 선택해 좌우 필터와 각각 컨볼루션하고 거리 감쇠 및 실내 응답을 더해 두 채널 바이노럴 PCM을 출력함. 헤드 트래킹을 켜면 세계 좌표를 머리 기준 각도로 계속 변환함." },
  speakers: { zh: "扬声器：声道与对象映射", en: "Speakers: channel and object mapping", ja: "スピーカー：チャンネルとオブジェクトのマッピング", ko: "스피커: 채널 및 객체 매핑" },
  speakersText: { zh: "渲染器把声道床或对象音频分配到实际扬声器，例如 5.1、7.1、Atmos 或车载多扬声器布局，并通过延迟、增益、EQ 和房间校正让声像落在正确位置。", en: "The renderer maps a channel bed or objects to real layouts such as 5.1, 7.1, Atmos, or in-car speakers, using delay, gain, EQ, and room correction to place images correctly.", ja: "レンダラーはチャンネルベッドやオブジェクト音声を 5.1、7.1、Atmos、車載マルチスピーカーなどの実配置へ割り当て、遅延、ゲイン、EQ、室内補正で音像を正しい位置に置く。", ko: "렌더러는 채널 베드나 객체 오디오를 5.1, 7.1, Atmos 또는 차량용 다중 스피커 배치에 매핑하고 지연, 게인, EQ 및 실내 보정으로 음상을 올바른 위치에 배치함." },
  labAria: { zh: "当前主题实验室入口", en: "Current topic lab entry", ja: "現在のテーマのラボ入口", ko: "현재 주제 실험실 입구" },
  labTitle: { zh: "进入空间音频实验室", en: "Open the spatial audio lab", ja: "空間オーディオラボを開く", ko: "공간 오디오 실험실 열기" },
  concepts: { zh: "核心知识点", en: "Core concepts", ja: "核心概念", ko: "핵심 개념" },
  conceptsLead: { zh: "先分清定位线索、内容格式和渲染器，再理解具体标准。", en: "Separate localization cues, content formats, and renderers before studying specific standards.", ja: "具体的な規格を学ぶ前に、定位手掛かり、コンテンツ形式、レンダラーを区別する。", ko: "구체적인 표준을 이해하기 전에 위치 단서, 콘텐츠 형식 및 렌더러를 구분함." },
  terms: { zh: "空间音频术语", en: "Spatial audio terms", ja: "空間オーディオ用語", ko: "공간 오디오 용어" },
  termsLead: { zh: "这些术语描述的是线索、表示方式或播放阶段。", en: "These terms describe cues, representations, or playback stages.", ja: "これらは手掛かり、表現形式、再生段階を表す用語。", ko: "이 용어들은 단서, 표현 방식 또는 재생 단계를 설명함." },
  boundary: { zh: "工程边界", en: "Engineering boundary", ja: "エンジニアリング上の境界", ko: "엔지니어링 경계" }
} satisfies Record<string, Localized>;

export function SpatialAudioPage({ relatedTopics, language, topic, onBack, onOpenLab, onOpenPrevious }: SpatialAudioPageProps) {
  const detail = topic.detail;

  return (
    <main className="sound-topic-page spatial-topic-page" aria-labelledby="spatial-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {copy.back[language]}
        </button>
        <div className="sound-topic-kicker"><BookOpen size={16} aria-hidden="true" />{copy.kicker[language]}</div>
        <h1 id="spatial-topic-title">{topic.title[language]}</h1>
        <p className="sound-topic-lede">{topic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{copy.localization[language]}</span>
          <span>{copy.binaural[language]}</span>
          <span>{copy.tracking[language]}</span>
        </div>
      </header>

      <TopicReadingLayout language={language}>
        <section className="sound-topic-section sound-topic-intro">
          <div>
            <h2>{copy.intro[language]}</h2>
            <p>{detail.explanation[language]}</p>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading"><div>
            <h2>{copy.sourceField[language]}</h2>
            <p>{copy.sourceFieldLead[language]}</p>
          </div></div>
          <ol className="spatial-topic-flow" aria-label={copy.flowAria[language]}>
            {spatialFlow.map((stage) => <li key={stage.number}><span>{stage.number}</span><h3>{stage.title[language]}</h3><p>{stage.detail[language]}</p></li>)}
          </ol>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading"><div>
            <h2>{copy.outputPaths[language]}</h2>
            <p>{copy.outputPathsLead[language]}</p>
          </div></div>
          <div className="spatial-topic-output-grid">
            <article>
              <h3>{copy.headphones[language]}</h3>
              <p>{copy.headphonesText[language]}</p>
            </article>
            <article>
              <h3>{copy.speakers[language]}</h3>
              <p>{copy.speakersText[language]}</p>
            </article>
          </div>
        </section>

        <section className="sound-topic-section spatial-topic-lab-entry" aria-label={copy.labAria[language]}>
          <div className="sound-topic-cta"><CircuitBoard size={22} aria-hidden="true" /><h2>{copy.labTitle[language]}</h2><p>{detail.lab?.description[language]}</p><button className="diagram-open-button" type="button" onClick={onOpenLab}>{detail.lab?.buttonLabel[language]}</button></div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading"><div><h2>{copy.concepts[language]}</h2><p>{copy.conceptsLead[language]}</p></div></div>
          <div className="sound-topic-glossary spatial-topic-key-points">{detail.keyConcepts.map((concept) => <article key={concept.en}><p>{concept[language]}</p></article>)}</div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading"><div><h2>{copy.terms[language]}</h2><p>{copy.termsLead[language]}</p></div></div>
          <div className="sound-topic-glossary">{detail.termExplanations?.map((term) => <article key={term.name.en}><h3>{term.name[language]}</h3><p>{term.explanation[language]}</p></article>)}</div>
        </section>

        <section className="sound-topic-section"><div><h2>{copy.boundary[language]}</h2><p>{detail.misconception[language]}</p></div></section>
      </TopicReadingLayout>
      {relatedTopics}
      <TopicPager language={language} onBack={onBack} onPrevious={onOpenPrevious} />
    </main>
  );
}
