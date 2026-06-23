import { ArrowLeft } from "lucide-react";
import type { Language } from "../content/knowledge";

type IotContentLabProps = {
  language: Language;
  onBack: () => void;
};

type LocalizedText = Record<Language, string>;

const workflowModules = [
  {
    title: { zh: "边缘语音唤醒", en: "Edge wake word" },
    body: {
      zh: "设备在低功耗状态持续听固定唤醒词，只在命中后打开更高功耗的采集、识别或联网链路。重点指标是误唤醒、漏唤醒、功耗和响应时间。",
      en: "The device listens for a wake word in a low-power state and only enables higher-power capture, recognition, or network paths after a hit. Key metrics are false accepts, false rejects, power, and response time."
    }
  },
  {
    title: { zh: "本地命令与云端能力", en: "Local commands and cloud capability" },
    body: {
      zh: "开灯、暂停、音量调节等固定命令适合本地识别；开放问答、复杂意图和多轮对话通常需要云端 ASR/LLM 或更强边缘 NPU。",
      en: "Fixed commands such as light on, pause, and volume control fit local recognition; open Q&A, complex intent, and multi-turn dialogue usually need cloud ASR/LLM or a stronger edge NPU."
    }
  },
  {
    title: { zh: "内容响度与动态", en: "Content loudness and dynamics" },
    body: {
      zh: "播客、短视频和直播需要控制底噪、齿音、爆音、动态范围和响度目标，避免用户切换节目或平台时音量忽大忽小。",
      en: "Podcasts, shorts, and live streams manage noise floor, sibilance, plosives, dynamic range, and loudness targets so listeners do not hear large level jumps across programs or platforms."
    }
  },
  {
    title: { zh: "实时直播链路", en: "Live streaming chain" },
    body: {
      zh: "直播更接近实时系统：麦克风、声卡、降噪、压缩、混音、编码和平台推流都要控制延迟，处理不能太重。",
      en: "Live streaming is closer to a real-time system: microphone, interface, denoising, compression, mixing, encoding, and platform upload all need controlled latency and modest processing."
    }
  },
  {
    title: { zh: "AI 配音与自动母带", en: "AI dubbing and auto mastering" },
    body: {
      zh: "AI 配音负责把文本变成符合角色和语气的语音，自动母带负责统一响度、动态和频响。它们提高效率，但仍要检查语义、情绪、版权和平台规范。",
      en: "AI dubbing turns text into voice with suitable role and tone, while auto mastering normalizes loudness, dynamics, and tonal balance. They improve efficiency but still need checks for meaning, emotion, rights, and platform rules."
    }
  },
  {
    title: { zh: "交付与复用", en: "Delivery and reuse" },
    body: {
      zh: "同一份内容可能要导出成播客、短视频、直播回放、多语言版本和字幕包。好的工具链会保留工程文件、素材版本和可追溯处理参数。",
      en: "One project may become a podcast, short video, stream replay, multilingual edition, and caption package. A good workflow preserves project files, asset versions, and traceable processing settings."
    }
  }
] satisfies Array<{ title: LocalizedText; body: LocalizedText }>;

const issueCards = [
  {
    title: { zh: "误唤醒", en: "False wake" },
    cause: {
      zh: "常见原因是唤醒词太短、环境噪声相似、播放内容里出现近似词、阈值过低，或麦克风结构导致远场噪声被放大。",
      en: "Common causes include short wake words, similar environmental sounds, near-matches in playback, too-low thresholds, or microphone design that emphasizes far-field noise."
    },
    checks: [
      { zh: "先看误唤醒音频是不是来自真实人声、电视/音箱回放，还是环境噪声。", en: "First classify whether false wakes come from human speech, TV/speaker playback, or environmental noise." },
      { zh: "再看唤醒阈值、二次确认和回放 AEC 是否开启。", en: "Then inspect wake threshold, second-stage confirmation, and playback AEC." },
      { zh: "最后看低功耗模型是否覆盖目标语言、口音和家庭噪声。", en: "Finally check whether the low-power model covers target languages, accents, and household noise." }
    ]
  },
  {
    title: { zh: "直播声音忽大忽小", en: "Live level jumps" },
    cause: {
      zh: "可能来自麦克风距离变化、AGC 泵动、压缩器释放时间不合适、背景音乐 ducking 过强，或平台二次响度处理。",
      en: "It can come from changing mic distance, AGC pumping, unsuitable compressor release, excessive music ducking, or platform-side loudness processing."
    },
    checks: [
      { zh: "先固定麦克风距离和输入增益，确认原始电平是否稳定。", en: "First fix microphone distance and input gain, then check raw level stability." },
      { zh: "再旁路 AGC、压缩、限幅和 ducking，定位哪个模块在拉扯音量。", en: "Then bypass AGC, compression, limiting, and ducking to locate which module is moving the level." },
      { zh: "最后按平台响度目标导出或推流，避免二次处理过大。", en: "Finally export or stream against the platform loudness target to avoid heavy second-stage processing." }
    ]
  },
  {
    title: { zh: "AI 配音不自然", en: "Unnatural AI dubbing" },
    cause: {
      zh: "通常和文本断句、情绪标签、说话速度、专有名词读音、声线选择、背景音乐掩蔽和后期混音有关。",
      en: "Usually related to text segmentation, emotion tags, speaking rate, proper-noun pronunciation, voice choice, music masking, and post mix."
    },
    checks: [
      { zh: "先把长句拆成自然口语短句，并标出停顿和重音。", en: "First split long sentences into natural spoken phrases and mark pauses or emphasis." },
      { zh: "再检查专有名词、数字、英文缩写和多音字读音。", en: "Then check proper nouns, numbers, acronyms, and ambiguous pronunciations." },
      { zh: "最后用 EQ、压缩和响度匹配让配音融入原始内容。", en: "Finally use EQ, compression, and loudness matching to make the dubbing sit in the original content." }
    ]
  }
] satisfies Array<{ title: LocalizedText; cause: LocalizedText; checks: LocalizedText[] }>;

function IotContentWorkflowDiagram({ language }: { language: Language }) {
  return (
    <figure className="iot-content-diagram">
      <svg
        aria-label={language === "zh" ? "IoT 与内容创作双路径音频流程图" : "IoT and content creation dual-path audio workflow diagram"}
        role="img"
        viewBox="0 0 980 560"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="iotArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
            <path d="M0 0 8 4 0 8Z" fill="#1f7569" />
          </marker>
          <marker id="creatorArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
            <path d="M0 0 8 4 0 8Z" fill="#b44c6d" />
          </marker>
        </defs>
        <rect className="iot-diagram-bg" height="560" rx="18" width="980" />
        <text className="iot-diagram-title" x="40" y="46">
          {language === "zh" ? "同样是音频，IoT 追求实时控制，内容创作追求可编辑交付" : "The same audio tools serve real-time IoT control and editable creator delivery"}
        </text>

        <text className="iot-lane-title" x="48" y="96">{language === "zh" ? "IoT 语音控制路径" : "IoT voice control path"}</text>
        <rect className="iot-flow-box capture" height="62" rx="10" width="124" x="48" y="118" />
        <text className="iot-box-title" x="110" y="143" textAnchor="middle">{language === "zh" ? "低功耗监听" : "Low-power listen"}</text>
        <text className="iot-box-sub" x="110" y="164" textAnchor="middle">mic + DSP</text>

        <rect className="iot-flow-box wake" height="62" rx="10" width="124" x="206" y="118" />
        <text className="iot-box-title" x="268" y="143" textAnchor="middle">{language === "zh" ? "本地唤醒词" : "Local wake word"}</text>
        <text className="iot-box-sub" x="268" y="164" textAnchor="middle">{language === "zh" ? "低功耗模型" : "tiny model"}</text>

        <rect className="iot-flow-box command" height="62" rx="10" width="124" x="364" y="118" />
        <text className="iot-box-title" x="426" y="143" textAnchor="middle">{language === "zh" ? "命令识别" : "Command ASR"}</text>
        <text className="iot-box-sub" x="426" y="164" textAnchor="middle">{language === "zh" ? "本地 / 云端" : "edge / cloud"}</text>

        <rect className="iot-flow-box policy" height="62" rx="10" width="124" x="522" y="118" />
        <text className="iot-box-title" x="584" y="143" textAnchor="middle">{language === "zh" ? "意图与权限" : "Intent + policy"}</text>
        <text className="iot-box-sub" x="584" y="164" textAnchor="middle">{language === "zh" ? "安全控制" : "safe control"}</text>

        <rect className="iot-flow-box action" height="62" rx="10" width="124" x="680" y="118" />
        <text className="iot-box-title" x="742" y="143" textAnchor="middle">{language === "zh" ? "设备动作" : "Device action"}</text>
        <text className="iot-box-sub" x="742" y="164" textAnchor="middle">{language === "zh" ? "灯 / 锁 / 家电" : "light / lock / IoT"}</text>

        <rect className="iot-flow-box feedback" height="62" rx="10" width="124" x="838" y="118" />
        <text className="iot-box-title" x="900" y="143" textAnchor="middle">{language === "zh" ? "语音反馈" : "Voice response"}</text>
        <text className="iot-box-sub" x="900" y="164" textAnchor="middle">TTS / beep</text>

        <path className="iot-arrow" d="M172 149 H206" markerEnd="url(#iotArrow)" />
        <path className="iot-arrow" d="M330 149 H364" markerEnd="url(#iotArrow)" />
        <path className="iot-arrow" d="M488 149 H522" markerEnd="url(#iotArrow)" />
        <path className="iot-arrow" d="M646 149 H680" markerEnd="url(#iotArrow)" />
        <path className="iot-arrow" d="M804 149 H838" markerEnd="url(#iotArrow)" />

        <rect className="iot-note-box" height="58" rx="12" width="390" x="48" y="216" />
        <text className="iot-note-title" x="70" y="240">{language === "zh" ? "IoT 关键约束" : "IoT constraints"}</text>
        <text className="iot-note-copy" x="70" y="262">
          {language === "zh" ? "功耗、误唤醒、漏唤醒、隐私、联网失败、端侧算力" : "Power, false wakes, misses, privacy, network failure, edge compute"}
        </text>

        <text className="creator-lane-title" x="48" y="334">{language === "zh" ? "内容创作生产路径" : "Content creation production path"}</text>
        <rect className="creator-flow-box capture" height="62" rx="10" width="124" x="48" y="356" />
        <text className="creator-box-title" x="110" y="381" textAnchor="middle">{language === "zh" ? "录音 / 导入" : "Record / import"}</text>
        <text className="creator-box-sub" x="110" y="402" textAnchor="middle">voice / music</text>

        <rect className="creator-flow-box clean" height="62" rx="10" width="124" x="206" y="356" />
        <text className="creator-box-title" x="268" y="381" textAnchor="middle">{language === "zh" ? "降噪 / 清理" : "Denoise / clean"}</text>
        <text className="creator-box-sub" x="268" y="402" textAnchor="middle">{language === "zh" ? "底噪 / 爆音" : "noise / plosive"}</text>

        <rect className="creator-flow-box edit" height="62" rx="10" width="124" x="364" y="356" />
        <text className="creator-box-title" x="426" y="381" textAnchor="middle">{language === "zh" ? "剪辑 / 修音" : "Edit / polish"}</text>
        <text className="creator-box-sub" x="426" y="402" textAnchor="middle">EQ / de-ess</text>

        <rect className="creator-flow-box mix" height="62" rx="10" width="124" x="522" y="356" />
        <text className="creator-box-title" x="584" y="381" textAnchor="middle">{language === "zh" ? "压缩 / 混音" : "Compress / mix"}</text>
        <text className="creator-box-sub" x="584" y="402" textAnchor="middle">{language === "zh" ? "动态 / 音乐" : "dynamics / music"}</text>

        <rect className="creator-flow-box master" height="62" rx="10" width="124" x="680" y="356" />
        <text className="creator-box-title" x="742" y="381" textAnchor="middle">{language === "zh" ? "母带 / 响度" : "Master / loudness"}</text>
        <text className="creator-box-sub" x="742" y="402" textAnchor="middle">LUFS / true peak</text>

        <rect className="creator-flow-box export" height="62" rx="10" width="124" x="838" y="356" />
        <text className="creator-box-title" x="900" y="381" textAnchor="middle">{language === "zh" ? "多平台导出" : "Multi-platform export"}</text>
        <text className="creator-box-sub" x="900" y="402" textAnchor="middle">podcast / video</text>

        <path className="creator-arrow" d="M172 387 H206" markerEnd="url(#creatorArrow)" />
        <path className="creator-arrow" d="M330 387 H364" markerEnd="url(#creatorArrow)" />
        <path className="creator-arrow" d="M488 387 H522" markerEnd="url(#creatorArrow)" />
        <path className="creator-arrow" d="M646 387 H680" markerEnd="url(#creatorArrow)" />
        <path className="creator-arrow" d="M804 387 H838" markerEnd="url(#creatorArrow)" />

        <rect className="creator-note-box" height="58" rx="12" width="442" x="488" y="456" />
        <text className="creator-note-title" x="510" y="480">{language === "zh" ? "创作关键约束" : "Creator constraints"}</text>
        <text className="creator-note-copy" x="510" y="502">
          {language === "zh" ? "响度一致、可编辑、情绪自然、版权清晰、平台规格匹配" : "Consistent loudness, editability, natural emotion, clear rights, platform specs"}
        </text>
      </svg>
      <figcaption>
        {language === "zh"
          ? "上半部分强调 IoT 语音从低功耗监听到设备动作，关键是少耗电、少误触、快响应；下半部分强调内容创作从素材到交付，关键是好听、可改、响度稳定。"
          : "The upper path emphasizes IoT voice from low-power listening to device action, where low power, low false triggers, and fast response matter. The lower path emphasizes creator production from source material to delivery, where quality, editability, and stable loudness matter."}
      </figcaption>
    </figure>
  );
}

export function IotContentLab({ language, onBack }: IotContentLabProps) {
  return (
    <main className="iot-content-lab-page" aria-label={language === "zh" ? "IoT 与内容创作实验室" : "IoT and Content Creation Lab"}>
      <section className="sound-lab-hero iot-content-lab-hero">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="details-category">{language === "zh" ? "应用场景" : "Applications"}</span>
          <h1>{language === "zh" ? "IoT 与内容创作实验室" : "IoT and Content Creation Lab"}</h1>
          <p>
            {language === "zh"
              ? "用双路径图对比两类音频应用：IoT 语音控制追求低功耗、低延迟和可靠触发；内容创作追求可编辑、响度一致和交付质量。"
              : "Use a dual-path diagram to compare two audio applications: IoT voice control optimizes for power, latency, and reliable triggering; content creation optimizes for editability, consistent loudness, and delivery quality."}
          </p>
        </div>
      </section>

      <section className="iot-content-diagram-section" aria-label={language === "zh" ? "IoT 与内容创作双路径流程" : "IoT and content creation dual-path workflow"}>
        <IotContentWorkflowDiagram language={language} />
      </section>

      <section className="iot-content-module-section" aria-label={language === "zh" ? "IoT 与内容创作模块解释" : "IoT and content creation module explanations"}>
        <div className="iot-content-section-heading">
          <span>{language === "zh" ? "模块拆解" : "Module breakdown"}</span>
          <h2>{language === "zh" ? "每个模块解决什么问题" : "What each module solves"}</h2>
        </div>
        <div className="iot-content-module-grid">
          {workflowModules.map((module) => (
            <article className="iot-content-module-card" key={module.title.en}>
              <h3>{module.title[language]}</h3>
              <p>{module.body[language]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="iot-content-issue-section" aria-label={language === "zh" ? "IoT 与内容创作典型问题诊断" : "IoT and content creation troubleshooting"}>
        <div className="iot-content-section-heading">
          <span>{language === "zh" ? "排查思路" : "Troubleshooting"}</span>
          <h2>{language === "zh" ? "典型问题诊断" : "Common Issue Troubleshooting"}</h2>
        </div>
        <div className="iot-content-issue-grid">
          {issueCards.map((issue) => (
            <article className="iot-content-issue-card" key={issue.title.en}>
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
