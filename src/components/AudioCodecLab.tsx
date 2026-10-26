import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import type { Language } from "../content/knowledge";

type AudioCodecLabProps = {
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

type ScenarioId = "music" | "video" | "speech" | "meeting" | "bluetooth" | "lowLatency";

const encodeSteps = [
  { title: { zh: "PCM 输入", en: "PCM input" }, detail: { zh: "系统或文件中的原始样本", en: "raw samples from system or file" } },
  { title: { zh: "分帧", en: "Framing" }, detail: { zh: "按固定时长切块", en: "split into time blocks" } },
  { title: { zh: "分析 / 建模", en: "Analysis / model" }, detail: { zh: "预测、频域或听觉模型", en: "prediction, transform, or hearing model" } },
  { title: { zh: "量化 / 码率控制", en: "Quantize / rate control" }, detail: { zh: "按目标质量分配比特", en: "allocate bits for target quality" } },
  { title: { zh: "码流 / 封装", en: "Bitstream / package" }, detail: { zh: "写入文件或网络包", en: "write file or network packets" } }
] satisfies Array<{ title: Record<Language, string>; detail: Record<Language, string> }>;

const decodeSteps = [
  { title: { zh: "码流 / 文件 / 网络包", en: "Bitstream / file / packet" }, detail: { zh: "来自存储、流媒体或蓝牙", en: "from storage, streaming, or Bluetooth" } },
  { title: { zh: "解包 / 纠错", en: "Unpack / repair" }, detail: { zh: "取出帧、时间戳和冗余", en: "read frames, timestamps, redundancy" } },
  { title: { zh: "反量化 / 合成", en: "Inverse quantize / synthesize" }, detail: { zh: "还原频域或语音模型参数", en: "restore transform or speech parameters" } },
  { title: { zh: "PCM 输出", en: "PCM output" }, detail: { zh: "恢复为系统可播放样本", en: "samples ready for the system" } },
  { title: { zh: "播放 / 后处理", en: "Playback / post-process" }, detail: { zh: "混音、音效、DAC 或蓝牙输出", en: "mix, effects, DAC, or Bluetooth out" } }
] satisfies Array<{ title: Record<Language, string>; detail: Record<Language, string> }>;

const scenarios = {
  music: {
    label: { zh: "音乐存储", en: "Music storage" },
    summary: { zh: "音乐存储：优先考虑音质、文件大小和长期兼容。", en: "Music storage: prioritize quality, file size, and long-term compatibility." },
    recommendation: { zh: "推荐：FLAC / AAC / MP3", en: "Recommended: FLAC / AAC / MP3" },
    metrics: [
      { zh: "无损归档选 FLAC；日常分发常用 AAC 或 MP3。", en: "Use FLAC for lossless archive; AAC or MP3 for everyday delivery." },
      { zh: "码率越高不一定线性提升听感，内容和编码器实现同样重要。", en: "Higher bitrate does not linearly improve listening quality; content and encoder quality matter." }
    ]
  },
  video: {
    label: { zh: "在线视频", en: "Online video" },
    summary: { zh: "在线视频：关注音画同步、平台兼容和自适应码率。", en: "Online video: focus on AV sync, platform support, and adaptive bitrate." },
    recommendation: { zh: "推荐：AAC / Opus", en: "Recommended: AAC / Opus" },
    metrics: [
      { zh: "容器、时间戳和播放器缓冲会影响音画同步。", en: "Container timestamps and player buffering affect AV sync." },
      { zh: "直播更看重端到端延迟，点播更看重质量和兼容性。", en: "Live streaming values latency; on-demand values quality and compatibility." }
    ]
  },
  speech: {
    label: { zh: "语音通话", en: "Voice call" },
    summary: { zh: "语音通话：清晰度、抗丢包和低码率更关键。", en: "Voice call: intelligibility, packet-loss robustness, and low bitrate matter most." },
    recommendation: { zh: "推荐：Opus / AMR / LC3", en: "Recommended: Opus / AMR / LC3" },
    metrics: [
      { zh: "语音 Codec 会优先保留人声可懂度，而不是音乐细节。", en: "Speech codecs preserve intelligibility before musical detail." },
      { zh: "网络抖动、丢包隐藏和回声处理常比纯码率更影响体验。", en: "Jitter, packet-loss concealment, and echo handling often matter more than bitrate alone." }
    ]
  },
  meeting: {
    label: { zh: "会议", en: "Meeting" },
    summary: { zh: "会议：要在多人语音、弱网和设备切换中保持稳定。", en: "Meeting: stay stable across multi-speaker voice, weak networks, and device changes." },
    recommendation: { zh: "推荐：Opus / LC3", en: "Recommended: Opus / LC3" },
    metrics: [
      { zh: "会议链路通常还会叠加降噪、回声消除、自动增益和混音。", en: "Meeting paths usually add noise suppression, echo cancellation, AGC, and mixing." },
      { zh: "可变码率和抗丢包能力比极高保真更重要。", en: "Variable bitrate and packet-loss resilience matter more than maximum fidelity." }
    ]
  },
  bluetooth: {
    label: { zh: "蓝牙耳机", en: "Bluetooth headset" },
    summary: { zh: "蓝牙耳机：无线稳定性、功耗、延迟和设备兼容一起决定体验。", en: "Bluetooth headset: radio stability, power, latency, and compatibility decide the experience." },
    recommendation: { zh: "推荐：SBC / AAC / aptX / LDAC / LC3", en: "Recommended: SBC / AAC / aptX / LDAC / LC3" },
    metrics: [
      { zh: "LDAC 高码率需要稳定无线环境；SBC 兼容性强但效率较普通。", en: "LDAC high bitrate needs stable radio; SBC is compatible but less efficient." },
      { zh: "LE Audio 的 LC3 更重视低功耗、多设备和广播音频。", en: "LC3 in LE Audio targets low power, multi-device use, and broadcast audio." }
    ]
  },
  lowLatency: {
    label: { zh: "低延迟互动", en: "Low-latency interaction" },
    summary: { zh: "低延迟互动：帧长、缓冲、网络和解码等待都必须压低。", en: "Low-latency interaction: frame size, buffering, network, and decode wait must stay low." },
    recommendation: { zh: "推荐：Opus / LC3 / 低延迟专用链路", en: "Recommended: Opus / LC3 / dedicated low-latency paths" },
    metrics: [
      { zh: "游戏语音、实时合奏和监听返送对 100 ms 以内体验更敏感。", en: "Game chat, live jamming, and monitoring are sensitive to sub-100 ms experiences." },
      { zh: "过度追求压缩率会增加算法等待和错误恢复成本。", en: "Chasing compression ratio can increase algorithmic wait and recovery cost." }
    ]
  }
} satisfies Record<
  ScenarioId,
  {
    label: Record<Language, string>;
    summary: Record<Language, string>;
    recommendation: Record<Language, string>;
    metrics: Array<Record<Language, string>>;
  }
>;

const scenarioOrder = Object.keys(scenarios) as ScenarioId[];

const metricCards = [
  { title: { zh: "码率", en: "Bitrate" }, body: { zh: "每秒码流大小，影响文件体积、带宽和压缩余量。", en: "Bitstream size per second; affects file size, bandwidth, and compression headroom." } },
  { title: { zh: "压缩比", en: "Compression ratio" }, body: { zh: "编码后大小相对 PCM 的缩小程度，通常要和音质一起看。", en: "How much smaller the encoded stream is than PCM; must be judged with quality." } },
  { title: { zh: "延迟", en: "Latency" }, body: { zh: "包含分帧等待、编码、传输缓冲、解码和播放缓冲。", en: "Includes framing wait, encode, transport buffer, decode, and playback buffer." } },
  { title: { zh: "抗丢包", en: "Packet-loss resilience" }, body: { zh: "实时通信会用冗余、PLC 和自适应码率降低断续感。", en: "Real-time communication uses redundancy, PLC, and adaptive bitrate to reduce dropouts." } }
] satisfies Array<{ title: Record<Language, string>; body: Record<Language, string> }>;

function CodecFlowChart({
  label,
  language,
  steps,
  tone,
  title
}: {
  label: Record<Language, string>;
  language: Language;
  steps: Array<{ title: Record<Language, string>; detail: Record<Language, string> }>;
  tone: "encode" | "decode";
  title: Record<Language, string>;
}) {
  return (
    <svg
      aria-label={label[language]}
      className={`audio-codec-flow-chart ${tone}`}
      role="img"
      viewBox="0 0 960 260"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id={`audioCodecArrow-${tone}`} markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M 0 0 L 8 4 L 0 8 Z" />
        </marker>
      </defs>
      <rect className="lab-diagram-bg" height="260" rx="14" width="960" />
      <text className="lab-label" x="44" y="42">{title[language]}</text>
      {steps.map((step, index) => {
        const x = 42 + index * 176;
        return (
          <g key={step.title.en}>
            <rect className="audio-codec-pipeline-node" height="88" rx="10" width="136" x={x} y="86" />
            <text className="audio-codec-node-title" x={x + 68} y="119">{step.title[language]}</text>
            <text className="audio-codec-node-detail" x={x + 68} y="148">{step.detail[language]}</text>
            {index < steps.length - 1 ? <path className="audio-codec-pipeline-arrow" d={`M ${x + 142} 130 L ${x + 170} 130`} /> : null}
          </g>
        );
      })}
      <path className="audio-codec-bitrate-line" d="M 72 212 C 260 198 414 198 548 212 S 746 228 888 204" />
    </svg>
  );
}

export function AudioCodecLab({ language, onBack, onBackToDetails }: AudioCodecLabProps) {
  const [activeScenario, setActiveScenario] = useState<ScenarioId>("music");
  const scenario = scenarios[activeScenario];

  return (
    <main className="codec-lab-page audio-codec-lab-page">
      <section className="sound-lab-hero" aria-labelledby="audio-codec-lab-title">
        <div className="sound-lab-back-actions">
          <button className="sound-lab-back sound-lab-back-secondary" type="button" onClick={onBack}>
            {language === "zh" ? "返回知识库" : "Back to knowledge base"}
          </button>
          {onBackToDetails && <button className="sound-lab-back" type="button" onClick={onBackToDetails}>
            <ArrowLeft size={18} aria-hidden="true" />
            {language === "zh" ? "返回详细内容" : "Back to detailed content"}
          </button>}
        </div>
        <div>
          <span className="section-kicker">{language === "zh" ? "软件实验" : "Software lab"}</span>
          <h1 id="audio-codec-lab-title">{language === "zh" ? "音频编解码实验室" : "Audio Codec Lab"}</h1>
          <p>
            {language === "zh"
              ? "观察 PCM 如何被分帧、压缩成码流、传输或封装，并在播放端解码回 PCM。这里讨论的是 MP3、AAC、Opus、LC3、SBC 等压缩算法，不是硬件 Codec 芯片。"
              : "See how PCM is framed, compressed into a bitstream, transported or packaged, then decoded back to PCM. This lab covers compression algorithms such as MP3, AAC, Opus, LC3, and SBC, not hardware codec chips."}
          </p>
        </div>
      </section>

      <section className="audio-codec-workbench" aria-label={language === "zh" ? "音频编解码实验台" : "Audio codec workbench"}>
        <section className="audio-codec-visual" aria-label={language === "zh" ? "音频编码和解码流程图" : "Audio encoding and decoding flow charts"}>
          <div className="digital-lab-status">
            <strong>{language === "zh" ? "编码和解码是两个方向" : "Encoding and decoding are two directions"}</strong>
            <span>{language === "zh" ? "上行压缩，下行还原为 PCM" : "Compress on one side, reconstruct PCM on the other"}</span>
          </div>
          <div className="audio-codec-flow-grid stacked">
            <CodecFlowChart
              label={{ zh: "音频编码流程图", en: "Audio encoding flow chart" }}
              language={language}
              steps={encodeSteps}
              title={{ zh: "编码：PCM 变成更小的码流", en: "Encoding: PCM becomes a smaller bitstream" }}
              tone="encode"
            />
            <CodecFlowChart
              label={{ zh: "音频解码流程图", en: "Audio decoding flow chart" }}
              language={language}
              steps={decodeSteps}
              title={{ zh: "解码：码流还原为可播放 PCM", en: "Decoding: bitstream returns to playable PCM" }}
              tone="decode"
            />
          </div>
        </section>

        <section className="codec-mode-concepts audio-codec-metrics" aria-label={language === "zh" ? "编解码关键指标" : "Codec key metrics"}>
          <div className="codec-mode-concepts-header">
            <strong>{language === "zh" ? "关键指标" : "Key metrics"}</strong>
            <span>{language === "zh" ? "不要只看码率" : "Do not only compare bitrate"}</span>
          </div>
          <div className="codec-concept-grid">
            {metricCards.map((metric) => (
              <article key={metric.title.en}>
                <h2>{metric.title[language]}</h2>
                <p>{metric.body[language]}</p>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="audio-codec-scenarios" aria-label={language === "zh" ? "音频编解码应用场景" : "Audio codec use cases"}>
        <div className="codec-mode-concepts-header">
          <h2>{language === "zh" ? "应用场景" : "Use cases"}</h2>
          <span>{language === "zh" ? "先看用途，再选 Codec" : "Start with the use case, then pick a codec"}</span>
        </div>
        <div className="waveform-tabs audio-codec-scenario-tabs" role="group" aria-label={language === "zh" ? "应用场景" : "Use cases"}>
          {scenarioOrder.map((id) => (
            <button
              aria-pressed={activeScenario === id}
              className={activeScenario === id ? "waveform-tab active" : "waveform-tab"}
              key={id}
              type="button"
              onClick={() => setActiveScenario(id)}
            >
              {scenarios[id].label[language]}
            </button>
          ))}
        </div>
        <div className="audio-codec-scenario-card">
          <div className="lab-live-note audio-codec-scenario-note">
            <strong>{scenario.summary[language]}</strong>
            <span>{scenario.recommendation[language]}</span>
          </div>
          <div className="audio-codec-scenario-points">
            {scenario.metrics.map((metric) => (
              <p key={metric.en}>{metric[language]}</p>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
