import { ArrowLeft, BookOpen, Ear, Gauge } from "lucide-react";
import { categories, type Language } from "../content/knowledge";
import { TopicPager } from "./TopicPager";

type ListeningMetricsPageProps = {
  language: Language;
  onBack: () => void;
  onOpenLab: () => void;
  onOpenPrevious: () => void;
};

const listeningTopic = categories
  .find((category) => category.id === "fundamentals")
  ?.topics.find((topic) => topic.title.en === "Listening Perception and Metrics")!;

if (!listeningTopic) {
  throw new Error("The listening metrics topic is required for the professional guide.");
}

const perceptionMap = [
  {
    cue: { zh: "忽大忽小", en: "Uneven loudness" },
    metric: "LUFS / True Peak",
    check: { zh: "先看时间尺度和峰值余量", en: "Check time scale and peak headroom" }
  },
  {
    cue: { zh: "明亮或浑浊", en: "Bright or muddy" },
    metric: { zh: "频响 / 频谱", en: "Response / spectrum" },
    check: { zh: "再排除内容与播放设备影响", en: "Then exclude content and playback effects" }
  },
  {
    cue: { zh: "底噪明显", en: "Audible noise floor" },
    metric: "SNR",
    check: { zh: "注明带宽、计权和测量电平", en: "State bandwidth, weighting, and test level" }
  },
  {
    cue: { zh: "破音或粗糙", en: "Clipping or roughness" },
    metric: "THD / THD+N",
    check: { zh: "同时看谐波阶次与输入电平", en: "Also inspect harmonic order and input level" }
  },
  {
    cue: { zh: "没有起伏", en: "Flat dynamics" },
    metric: { zh: "动态范围 / 峰均比", en: "Dynamic range / crest factor" },
    check: { zh: "检查阈值、压缩比和增益衰减", en: "Check threshold, ratio, and gain reduction" }
  },
  {
    cue: { zh: "声像偏移", en: "Image shift" },
    metric: "ILD / ITD",
    check: { zh: "区分声道电平差与时间差", en: "Separate level and timing differences" }
  }
] as const;

const metricDefinitions = [
  {
    title: "LUFS",
    formula: "K-weighting → channel weighting → gating → integration",
    note: {
      zh: "用于节目响度与真峰值管理，不是声压级，也不能直接换算成 dBSPL。",
      en: "Used for program loudness and true-peak management; it is not SPL and cannot be converted directly to dBSPL."
    }
  },
  {
    title: "SNR",
    formula: "SNR = 20 log10(Srms / Nrms) dB",
    note: {
      zh: "适用于同阻抗下的幅度或电压比；比较前必须统一带宽、计权和测量条件。",
      en: "Applies to amplitude or voltage ratios at equal impedance; bandwidth, weighting, and conditions must match."
    }
  },
  {
    title: "THD",
    formula: "THD = √(V2² + … + Vn²) / V1 × 100%",
    note: {
      zh: "THD 只统计谐波，THD+N 还包含噪声；同一百分比也可能因谐波分布不同而听感不同。",
      en: "THD counts harmonics; THD+N also includes noise. The same percentage can sound different with a different harmonic distribution."
    }
  },
  {
    title: { zh: "压缩器静态曲线", en: "Compressor static curve" },
    formula: "Lout = T + (Lin − T) / R,  Lin > T",
    note: {
      zh: "电平以 dB 表示。阈值 T 和压缩比 R 决定稳态增益衰减，Attack / Release 决定随时间如何跟随。",
      en: "Levels are in dB. Threshold T and ratio R set steady-state reduction; attack and release set its timing."
    }
  },
  {
    title: "ILD / ITD",
    formula: "ILD = 20 log10(Lrms / Rrms),  ITD = tL − tR",
    note: {
      zh: "左右电平差和到达时间差是水平方向定位的主要线索；扬声器串音与耳机监听条件不同。",
      en: "Interaural level and arrival-time differences are key horizontal cues; loudspeaker crosstalk differs from headphones."
    }
  },
  {
    title: "RT60",
    formula: "L(t + RT60) = L(t) − 60 dB",
    note: {
      zh: "实际常从 20 dB 或 30 dB 衰减段外推，避免噪声底阻碍完整 60 dB 测量。",
      en: "In practice it is often extrapolated from a 20 or 30 dB decay because the noise floor can hide a full 60 dB decay."
    }
  }
] as const;

export function ListeningMetricsPage({ language, onBack, onOpenLab, onOpenPrevious }: ListeningMetricsPageProps) {
  const detail = listeningTopic.detail;
  const evaluationFlow = language === "zh"
    ? ["固定播放条件", "匹配响度", "参考与处理盲听", "测量关键指标", "结合场景下结论"]
    : ["Fix playback conditions", "Level-match", "Blind A/B with reference", "Measure key metrics", "Conclude for the use case"];

  return (
    <main className="sound-topic-page listening-topic-page" aria-labelledby="listening-topic-title">
      <header className="sound-topic-hero">
        <button className="sound-topic-back" type="button" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div className="sound-topic-kicker">
          <BookOpen size={16} aria-hidden="true" />
          {language === "zh" ? "音频基础 · 感知与测量" : "Audio fundamentals · Perception and measurement"}
        </div>
        <h1 id="listening-topic-title">{listeningTopic.title[language]}</h1>
        <p className="sound-topic-lede">{listeningTopic.summary[language]}</p>
        <div className="sound-topic-meta">
          <span>{language === "zh" ? "主观听感" : "Perception"}</span>
          <span>{language === "zh" ? "客观测量" : "Measurement"}</span>
          <span>{language === "zh" ? "受控评价" : "Controlled evaluation"}</span>
        </div>
      </header>

      <div className="sound-topic-content">
        <section className="sound-topic-section sound-topic-intro">

          <div>
            <h2>{language === "zh" ? "听感不是某一个数字" : "Perception is not one number"}</h2>
            <p>{detail.explanation[language]}</p>
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{language === "zh" ? "从听到的问题，找到测量入口" : "Map an audible problem to a measurement"}</h2>
              <p>{language === "zh" ? "指标用于缩小排查范围，不是给音质做单一排名。" : "Metrics narrow the investigation; they do not provide a single ranking of sound quality."}</p>
            </div>
          </div>
          <div className="digital-topic-codec-grid listening-topic-map">
            {perceptionMap.map((item) => (
              <article key={typeof item.metric === "string" ? item.metric : item.metric.en}>
                <div>
                  <h3>{item.cue[language]}</h3>
                  <strong>{typeof item.metric === "string" ? item.metric : item.metric[language]}</strong>
                </div>
                <p>{item.check[language]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{language === "zh" ? "指标的定义与边界" : "Definitions and boundaries"}</h2>
              <p>{language === "zh" ? "公式只有在参考量、带宽、时间尺度和测量条件一致时才可比较。" : "A formula is comparable only when reference, bandwidth, time scale, and conditions match."}</p>
            </div>
          </div>
          <div className="digital-topic-equation-grid listening-topic-equations">
            {metricDefinitions.map((metric) => (
              <article className="digital-topic-equation-card" key={typeof metric.title === "string" ? metric.title : metric.title.en}>
                <span>{typeof metric.title === "string" ? metric.title : metric.title[language]}</span>
                <code>{metric.formula}</code>
                <p>{metric.note[language]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sound-topic-section">
          <div className="sound-topic-section-heading">

            <div>
              <h2>{language === "zh" ? "怎样做可信的听感评价" : "How to make listening evaluation credible"}</h2>
              <p>{language === "zh" ? "先控制变量，再盲听，最后用测量解释差异；否则音量更大的版本往往会被误判为更好。" : "Control variables, listen blind, then use measurements to explain differences; otherwise the louder version is often mistaken for the better one."}</p>
            </div>
          </div>
          <ol className="sound-topic-flow listening-topic-flow" aria-label={language === "zh" ? "听感评价流程" : "Listening evaluation flow"}>
            {evaluationFlow.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
          <p className="sound-topic-note">{detail.misconception[language]}</p>
        </section>

        <section className="sound-topic-section sound-topic-bottom-grid">
          <div>

            <h2>{language === "zh" ? "先描述现象，再选择指标" : "Describe first, measure second"}</h2>
            <p>{language === "zh" ? "“刺耳”“浑浊”“靠右”是排查线索，不是测量结论。记录内容、播放电平、设备和环境，结果才可复现。" : "Harsh, muddy, or right-heavy are investigation cues, not measurement conclusions. Record content, level, device, and room so results are reproducible."}</p>
          </div>
          <div className="sound-topic-cta">
            <Ear size={22} aria-hidden="true" />
            <h2>{language === "zh" ? "进入听感实验室" : "Open the listening lab"}</h2>
            <p>{language === "zh" ? "切换频响、噪声、失真、压缩和声像，观察教学曲线并试听参数变化。" : "Switch among response, noise, distortion, compression, and stereo image to inspect teaching curves and hear parameter changes."}</p>
            <button className="diagram-open-button" type="button" onClick={onOpenLab}>
              <Gauge size={16} aria-hidden="true" />
              {detail.lab?.buttonLabel[language]}
            </button>
          </div>
        </section>
      </div>
      <TopicPager language={language} onPrevious={onOpenPrevious} onBack={onBack} />
    </main>
  );
}
