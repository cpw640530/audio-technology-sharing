import { ArrowLeft } from "lucide-react";
import type { Language } from "../content/knowledge";

type MeetingCommunicationLabProps = {
  language: Language;
  onBack: () => void;
};

type LocalizedText = Record<Language, string>;

const flowModules = [
  {
    title: { zh: "麦克风阵列", en: "Mic array" },
    body: {
      zh: "采集近端说话，也会拾取扬声器回放、键盘声和房间混响。",
      en: "Captures near-end speech, plus speaker playback, keyboard noise, and room reverb."
    }
  },
  {
    title: { zh: "AEC 回声消除", en: "AEC echo cancellation" },
    body: {
      zh: "用回采参考信号估计扬声器回声，从麦克风信号中抵消。",
      en: "Uses render reference to estimate speaker echo and subtract it from microphone audio."
    }
  },
  {
    title: { zh: "NS / ANR 降噪", en: "NS / ANR noise reduction" },
    body: {
      zh: "压低风扇、空调、键盘等稳定或突发噪声，目标是保留语音。",
      en: "Suppresses fan, HVAC, keyboard, and burst noise while preserving speech."
    }
  },
  {
    title: { zh: "AGC 自动增益", en: "AGC auto gain" },
    body: {
      zh: "把远近不同的说话音量拉到合适范围，避免太小或削波。",
      en: "Keeps speech level in a usable range and avoids being too quiet or clipped."
    }
  },
  {
    title: { zh: "编码与网络", en: "Codec and network" },
    body: {
      zh: "把 PCM 压成 Opus 等实时码流，并随网络质量调整码率和冗余。",
      en: "Compresses PCM into real-time streams such as Opus and adapts bitrate or redundancy to the network."
    }
  },
  {
    title: { zh: "Jitter Buffer", en: "Jitter buffer" },
    body: {
      zh: "吸收网络包到达时间抖动，用少量延迟换连续播放。",
      en: "Absorbs packet arrival jitter, trading a little latency for continuous playback."
    }
  },
  {
    title: { zh: "PLC 丢包隐藏", en: "PLC packet-loss concealment" },
    body: {
      zh: "网络丢包时根据前后音频推测缺失片段，降低断续感。",
      en: "Fills missing packets from surrounding audio to reduce dropouts."
    }
  },
  {
    title: { zh: "ASR / 字幕 / 翻译", en: "ASR / captions / translation" },
    body: {
      zh: "把增强后的语音送入识别和翻译链路，输出字幕、纪要或同传结果。",
      en: "Feeds enhanced speech into recognition and translation to produce captions, notes, or interpretation."
    }
  }
] satisfies Array<{ title: LocalizedText; body: LocalizedText }>;

const issueCards = [
  {
    title: { zh: "回声大", en: "Loud echo" },
    cause: {
      zh: "常见原因是回采参考没接入、参考与播放不同步、扬声器太响、房间混响长，或双讲时 AEC 抑制策略不稳。",
      en: "Common causes include missing render reference, reference/playback misalignment, loud speakers, long room reverb, or unstable double-talk behavior."
    },
    checks: [
      { zh: "先看回采参考是否正确进入 AEC。", en: "First check whether render reference correctly enters AEC." },
      { zh: "再看参考和麦克风采集是否时间对齐。", en: "Then check whether reference and microphone capture are time-aligned." },
      { zh: "最后看扬声器音量、房间反射和双讲策略。", en: "Finally inspect speaker level, room reflections, and double-talk policy." }
    ]
  },
  {
    title: { zh: "听不清", en: "Poor intelligibility" },
    cause: {
      zh: "可能来自麦克风距离远、混响重、降噪过强、AGC 泵动、编码码率过低或多人同时说话。",
      en: "It can come from distant microphones, heavy reverb, over-aggressive denoising, AGC pumping, low bitrate, or overlapping talkers."
    },
    checks: [
      { zh: "先看原始采集 SNR 和是否削波。", en: "First inspect raw capture SNR and clipping." },
      { zh: "再分别旁路 NS、AGC、编码，定位哪个模块损伤语音。", en: "Then bypass NS, AGC, and codec separately to locate speech damage." },
      { zh: "多麦设备还要看波束方向和说话人位置。", en: "For array devices, also check beam direction and speaker position." }
    ]
  },
  {
    title: { zh: "字幕慢", en: "Delayed captions" },
    cause: {
      zh: "字幕延迟通常不是单点问题，而是端点检测、分帧、网络、模型推理、翻译和稳定出字策略累加。",
      en: "Caption delay is usually cumulative: endpointing, frames, network, model inference, translation, and partial-result stabilization."
    },
    checks: [
      { zh: "先区分音频播放延迟和字幕链路延迟。", en: "First separate playback latency from caption-chain latency." },
      { zh: "再看 VAD/端点检测是否等太久才提交语音。", en: "Then check whether VAD/endpointing waits too long before submitting speech." },
      { zh: "最后看 ASR 流式输出、翻译和 UI 稳定策略。", en: "Finally inspect streaming ASR, translation, and UI stabilization policy." }
    ]
  }
] satisfies Array<{ title: LocalizedText; cause: LocalizedText; checks: LocalizedText[] }>;

function MeetingChainDiagram({ language }: { language: Language }) {
  return (
    <figure className="meeting-diagram">
      <svg
        aria-label={language === "zh" ? "会议与通信端到端音频链路图" : "End-to-end conferencing audio chain diagram"}
        role="img"
        viewBox="0 0 980 520"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="meetingArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
            <path d="M0 0 8 4 0 8Z" fill="#1f7569" />
          </marker>
          <marker id="meetingEchoArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
            <path d="M0 0 8 4 0 8Z" fill="#b44c6d" />
          </marker>
        </defs>
        <rect className="meeting-diagram-bg" height="520" rx="18" width="980" />
        <text className="meeting-diagram-title" x="40" y="46">
          {language === "zh" ? "会议音频同时有上行、下行和回采参考三条关键路径" : "Meeting audio has uplink, downlink, and render-reference paths"}
        </text>

        <text className="meeting-lane-title" x="48" y="94">{language === "zh" ? "上行：本端说话送到远端" : "Uplink: local speech to remote"}</text>
        <rect className="meeting-box capture" height="58" rx="10" width="128" x="48" y="116" />
        <text className="meeting-box-title" x="112" y="140" textAnchor="middle">{language === "zh" ? "麦克风阵列" : "Mic array"}</text>
        <text className="meeting-box-sub" x="112" y="160" textAnchor="middle">near-end PCM</text>

        <rect className="meeting-box process" height="58" rx="10" width="112" x="218" y="116" />
        <text className="meeting-box-title" x="274" y="140" textAnchor="middle">AEC</text>
        <text className="meeting-box-sub" x="274" y="160" textAnchor="middle">{language === "zh" ? "回声消除" : "echo cancel"}</text>

        <rect className="meeting-box process" height="58" rx="10" width="112" x="370" y="116" />
        <text className="meeting-box-title" x="426" y="140" textAnchor="middle">NS / ANR</text>
        <text className="meeting-box-sub" x="426" y="160" textAnchor="middle">{language === "zh" ? "降噪" : "denoise"}</text>

        <rect className="meeting-box process" height="58" rx="10" width="112" x="522" y="116" />
        <text className="meeting-box-title" x="578" y="140" textAnchor="middle">AGC</text>
        <text className="meeting-box-sub" x="578" y="160" textAnchor="middle">{language === "zh" ? "音量稳定" : "leveling"}</text>

        <rect className="meeting-box network" height="58" rx="10" width="128" x="674" y="116" />
        <text className="meeting-box-title" x="738" y="140" textAnchor="middle">{language === "zh" ? "编码 / RTP" : "Codec / RTP"}</text>
        <text className="meeting-box-sub" x="738" y="160" textAnchor="middle">Opus / FEC</text>

        <rect className="meeting-box remote" height="58" rx="10" width="108" x="842" y="116" />
        <text className="meeting-box-title" x="896" y="140" textAnchor="middle">{language === "zh" ? "远端" : "Remote"}</text>
        <text className="meeting-box-sub" x="896" y="160" textAnchor="middle">{language === "zh" ? "听到你" : "hears you"}</text>

        <path className="meeting-arrow" d="M176 145 H218" markerEnd="url(#meetingArrow)" />
        <path className="meeting-arrow" d="M330 145 H370" markerEnd="url(#meetingArrow)" />
        <path className="meeting-arrow" d="M482 145 H522" markerEnd="url(#meetingArrow)" />
        <path className="meeting-arrow" d="M634 145 H674" markerEnd="url(#meetingArrow)" />
        <path className="meeting-arrow" d="M802 145 H842" markerEnd="url(#meetingArrow)" />

        <text className="meeting-lane-title" x="48" y="254">{language === "zh" ? "下行：远端声音在本端播放" : "Downlink: remote voice plays locally"}</text>
        <rect className="meeting-box network" height="58" rx="10" width="126" x="48" y="276" />
        <text className="meeting-box-title" x="111" y="300" textAnchor="middle">{language === "zh" ? "网络包" : "Packets"}</text>
        <text className="meeting-box-sub" x="111" y="320" textAnchor="middle">RTP / SRTP</text>

        <rect className="meeting-box buffer" height="58" rx="10" width="126" x="216" y="276" />
        <text className="meeting-box-title" x="279" y="300" textAnchor="middle">Jitter Buffer</text>
        <text className="meeting-box-sub" x="279" y="320" textAnchor="middle">{language === "zh" ? "抗抖动" : "de-jitter"}</text>

        <rect className="meeting-box buffer" height="58" rx="10" width="112" x="384" y="276" />
        <text className="meeting-box-title" x="440" y="300" textAnchor="middle">PLC</text>
        <text className="meeting-box-sub" x="440" y="320" textAnchor="middle">{language === "zh" ? "丢包隐藏" : "loss conceal"}</text>

        <rect className="meeting-box playback" height="58" rx="10" width="112" x="538" y="276" />
        <text className="meeting-box-title" x="594" y="300" textAnchor="middle">{language === "zh" ? "解码 / 混音" : "Decode / mix"}</text>
        <text className="meeting-box-sub" x="594" y="320" textAnchor="middle">PCM</text>

        <rect className="meeting-box playback" height="58" rx="10" width="126" x="692" y="276" />
        <text className="meeting-box-title" x="755" y="300" textAnchor="middle">{language === "zh" ? "扬声器播放" : "Speaker render"}</text>
        <text className="meeting-box-sub" x="755" y="320" textAnchor="middle">{language === "zh" ? "远端参考来源" : "reference source"}</text>

        <path className="meeting-arrow" d="M174 305 H216" markerEnd="url(#meetingArrow)" />
        <path className="meeting-arrow" d="M342 305 H384" markerEnd="url(#meetingArrow)" />
        <path className="meeting-arrow" d="M496 305 H538" markerEnd="url(#meetingArrow)" />
        <path className="meeting-arrow" d="M650 305 H692" markerEnd="url(#meetingArrow)" />

        <path className="meeting-echo-arrow" d="M755 276 C742 220 382 220 286 174" markerEnd="url(#meetingEchoArrow)" />
        <rect className="meeting-reference-chip" height="32" rx="16" width="178" x="584" y="204" />
        <text className="meeting-reference-text" x="673" y="225" textAnchor="middle">
          {language === "zh" ? "回采参考信号 -> AEC" : "Render reference -> AEC"}
        </text>

        <text className="meeting-lane-title" x="48" y="414">{language === "zh" ? "字幕 / 翻译旁路" : "Caption / translation side path"}</text>
        <rect className="meeting-box caption" height="58" rx="10" width="144" x="48" y="436" />
        <text className="meeting-box-title" x="120" y="460" textAnchor="middle">{language === "zh" ? "增强后语音" : "Enhanced speech"}</text>
        <text className="meeting-box-sub" x="120" y="480" textAnchor="middle">clean PCM</text>

        <rect className="meeting-box caption" height="58" rx="10" width="126" x="238" y="436" />
        <text className="meeting-box-title" x="301" y="460" textAnchor="middle">ASR</text>
        <text className="meeting-box-sub" x="301" y="480" textAnchor="middle">{language === "zh" ? "流式识别" : "streaming"}</text>

        <rect className="meeting-box caption" height="58" rx="10" width="126" x="410" y="436" />
        <text className="meeting-box-title" x="473" y="460" textAnchor="middle">{language === "zh" ? "翻译 / 摘要" : "Translate / notes"}</text>
        <text className="meeting-box-sub" x="473" y="480" textAnchor="middle">{language === "zh" ? "可选" : "optional"}</text>

        <rect className="meeting-box caption" height="58" rx="10" width="126" x="582" y="436" />
        <text className="meeting-box-title" x="645" y="460" textAnchor="middle">{language === "zh" ? "字幕显示" : "Captions UI"}</text>
        <text className="meeting-box-sub" x="645" y="480" textAnchor="middle">{language === "zh" ? "稳定出字" : "stabilized text"}</text>

        <path className="meeting-arrow" d="M192 465 H238" markerEnd="url(#meetingArrow)" />
        <path className="meeting-arrow" d="M364 465 H410" markerEnd="url(#meetingArrow)" />
        <path className="meeting-arrow" d="M536 465 H582" markerEnd="url(#meetingArrow)" />
      </svg>
      <figcaption>
        {language === "zh"
          ? "图里把会议音频拆成上行、下行和字幕旁路。回采参考不是用户能听到的新声音，而是 AEC 用来判断哪些麦克风信号来自扬声器回放。"
          : "The diagram separates meeting audio into uplink, downlink, and caption side paths. The render reference is not new audible sound; it tells AEC which microphone content came from speaker playback."}
      </figcaption>
    </figure>
  );
}

export function MeetingCommunicationLab({ language, onBack }: MeetingCommunicationLabProps) {
  return (
    <main className="meeting-lab-page" aria-label={language === "zh" ? "会议与通信实验室" : "Conferencing and Communication Lab"}>
      <section className="sound-lab-hero meeting-lab-hero">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="details-category">{language === "zh" ? "应用场景" : "Applications"}</span>
          <h1>{language === "zh" ? "会议与通信实验室" : "Conferencing and Communication Lab"}</h1>
          <p>
            {language === "zh"
              ? "从端到端产品链路理解会议音频：本端说话如何送到远端，远端声音如何播放，回声为什么会回来，以及字幕为什么会慢。"
              : "Understand meeting audio as an end-to-end product chain: how local speech reaches remote users, how remote audio plays locally, why echo returns, and why captions can lag."}
          </p>
        </div>
      </section>

      <section className="meeting-diagram-section" aria-label={language === "zh" ? "会议与通信端到端链路" : "End-to-end conferencing chain"}>
        <MeetingChainDiagram language={language} />
      </section>

      <section className="meeting-module-section" aria-label={language === "zh" ? "链路模块解释" : "Chain module explanations"}>
        <div className="meeting-section-heading">
          <span>{language === "zh" ? "链路模块" : "Chain modules"}</span>
          <h2>{language === "zh" ? "每个模块解决什么问题" : "What each module solves"}</h2>
        </div>
        <div className="meeting-module-grid">
          {flowModules.map((module) => (
            <article className="meeting-module-card" key={module.title.en}>
              <h3>{module.title[language]}</h3>
              <p>{module.body[language]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="meeting-issue-section" aria-label={language === "zh" ? "典型问题诊断" : "Common issue troubleshooting"}>
        <div className="meeting-section-heading">
          <span>{language === "zh" ? "排查思路" : "Troubleshooting"}</span>
          <h2>{language === "zh" ? "典型问题诊断" : "Common Issue Troubleshooting"}</h2>
        </div>
        <div className="meeting-issue-grid">
          {issueCards.map((issue) => (
            <article className="meeting-issue-card" key={issue.title.en}>
              <h3>{issue.title[language]}</h3>
              <p>{issue.cause[language]}</p>
              <ol>
                {issue.checks.map((check) => (
                  <li key={check.en}>{check[language]}</li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
