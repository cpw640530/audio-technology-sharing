import { ArrowLeft } from "lucide-react";
import type { Language } from "../content/knowledge";

type AutomotiveAudioLabProps = {
  language: Language;
  onBack: () => void;
};

type LocalizedText = Record<Language, string>;

const vehicleModules = [
  {
    title: { zh: "多麦阵列与分区拾音", en: "Mic array and zone pickup" },
    body: {
      zh: "车顶、中控或后视镜附近的多麦阵列采集全舱声音，再按座位区域增强目标乘员语音。",
      en: "Microphone arrays near the roof, console, or mirror capture the cabin and enhance speech by seat zone."
    }
  },
  {
    title: { zh: "声源定位与座位识别", en: "Localization and seat detection" },
    body: {
      zh: "利用到达时间差、相位差和能量差判断谁在说话、坐在哪里，以及是否在对车辆发指令。",
      en: "Uses arrival-time, phase, and level differences to infer who is speaking, where they sit, and whether they address the car."
    }
  },
  {
    title: { zh: "语音助手链路", en: "Voice assistant chain" },
    body: {
      zh: "典型链路是唤醒词 -> ASR -> NLU/LLM -> 车辆控制，同时受车速、驾驶状态和安全策略约束。",
      en: "A typical chain is wake word -> ASR -> NLU/LLM -> vehicle control, constrained by speed, driving state, and safety policy."
    }
  },
  {
    title: { zh: "座舱空间音频", en: "Cabin spatial audio" },
    body: {
      zh: "根据座位和扬声器布局渲染音乐、导航、提示音和语音反馈，并让安全提示拥有更高优先级。",
      en: "Renders music, navigation, alerts, and voice feedback by seat and speaker layout while prioritizing safety alerts."
    }
  },
  {
    title: { zh: "噪声与回放干扰", en: "Noise and playback interference" },
    body: {
      zh: "路噪、风噪、空调、音乐和乘客重叠说话都会影响唤醒、识别和定位稳定性。",
      en: "Road noise, wind, HVAC, music, and overlapping passengers all affect wake, recognition, and localization stability."
    }
  },
  {
    title: { zh: "上下文感知", en: "Context awareness" },
    body: {
      zh: "结合乘员身份、座位、驾驶状态、外部环境和车辆传感器，让语音交互更个性化也更受控制。",
      en: "Combines occupant identity, seat, driving state, outside context, and vehicle sensors for personalized but constrained voice UX."
    }
  }
] satisfies Array<{ title: LocalizedText; body: LocalizedText }>;

const vehicleIssues = [
  {
    title: { zh: "唤醒错人", en: "Wrong wake owner" },
    cause: {
      zh: "常见原因是多人同时说话、音乐泄漏到麦克风、波束方向不稳，或座位定位阈值没有按车内反射校准。",
      en: "Common causes are overlapping talkers, music leakage into microphones, unstable beam direction, or seat-localization thresholds not calibrated for cabin reflections."
    },
    checks: [
      { zh: "先看声源定位是否稳定落在正确座位。", en: "First check whether localization stays on the correct seat." },
      { zh: "再看唤醒词模型是否使用了定位结果做分区确认。", en: "Then check whether the wake model uses localization for zone confirmation." },
      { zh: "最后看音乐回放、路噪和乘客重叠说话的测试集覆盖。", en: "Finally inspect coverage for music playback, road noise, and overlapping passengers." }
    ]
  },
  {
    title: { zh: "助手听错", en: "Assistant misunderstands" },
    cause: {
      zh: "可能来自 ASR 识别错误、车内噪声、方言口音、NLU 意图边界不清，或车辆实时状态没有进入上下文。",
      en: "It can come from ASR errors, cabin noise, accents, unclear NLU intent boundaries, or missing live vehicle state in context."
    },
    checks: [
      { zh: "先分开看 ASR 文本是否正确。", en: "First separate whether ASR text is correct." },
      { zh: "如果文本正确，再看 NLU/LLM 是否误判意图或槽位。", en: "If text is correct, check whether NLU/LLM misread intent or slots." },
      { zh: "涉及车辆控制时，还要看车速、挡位和权限策略。", en: "For vehicle control, also inspect speed, gear, and permission policy." }
    ]
  },
  {
    title: { zh: "声场不对", en: "Wrong sound field" },
    cause: {
      zh: "通常和扬声器布局、座位补偿、HRTF/虚拟声像、导航提示优先级或安全告警 ducking 策略有关。",
      en: "Usually related to speaker layout, seat compensation, HRTF/phantom imaging, navigation priority, or safety-alert ducking policy."
    },
    checks: [
      { zh: "先确认声道映射和扬声器相位。", en: "First verify channel mapping and speaker phase." },
      { zh: "再看驾驶员、副驾和后排是否使用不同补偿曲线。", en: "Then check whether driver, passenger, and rear seats use different compensation curves." },
      { zh: "最后确认导航、语音助手和告警是否能覆盖音乐声场。", en: "Finally confirm navigation, assistant voice, and alerts can override the music field." }
    ]
  }
] satisfies Array<{ title: LocalizedText; cause: LocalizedText; checks: LocalizedText[] }>;

function AutomotiveCabinDiagram({ language }: { language: Language }) {
  return (
    <figure className="automotive-diagram">
      <svg
        aria-label={language === "zh" ? "智能汽车座舱音频拓扑图" : "Intelligent vehicle cabin audio topology diagram"}
        role="img"
        viewBox="0 0 980 560"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="autoArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
            <path d="M0 0 8 4 0 8Z" fill="#1f7569" />
          </marker>
          <marker id="autoVoiceArrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
            <path d="M0 0 8 4 0 8Z" fill="#b44c6d" />
          </marker>
        </defs>
        <rect className="auto-diagram-bg" height="560" rx="18" width="980" />
        <text className="auto-diagram-title" x="40" y="46">
          {language === "zh" ? "座舱音频把“谁在说、助手怎么响应、声音从哪来”放在同一张图里" : "Cabin audio combines who speaks, how the assistant responds, and where sound appears"}
        </text>

        <g className="auto-car">
          <path className="auto-body" d="M290 74 C230 116 204 214 212 333 C220 442 282 510 490 510 C698 510 760 442 768 333 C776 214 750 116 690 74 C634 42 346 42 290 74Z" />
          <path className="auto-window" d="M330 98 C288 146 272 218 278 300 L702 300 C708 218 692 146 650 98 C600 78 380 78 330 98Z" />
          <path className="auto-console" d="M470 116 H510 V432 H470Z" />
          <circle className="auto-wheel" cx="400" cy="178" r="34" />
          <circle className="auto-mic" cx="490" cy="100" r="10" />
          <circle className="auto-mic" cx="388" cy="128" r="8" />
          <circle className="auto-mic" cx="592" cy="128" r="8" />
          <circle className="auto-speaker" cx="270" cy="172" r="13" />
          <circle className="auto-speaker" cx="710" cy="172" r="13" />
          <circle className="auto-speaker" cx="270" cy="408" r="13" />
          <circle className="auto-speaker" cx="710" cy="408" r="13" />
        </g>

        <g className="auto-seat driver-seat">
          <rect className="auto-seat-back" height="88" rx="18" width="92" x="338" y="178" />
          <rect className="auto-seat-base" height="58" rx="18" width="106" x="331" y="254" />
          <text className="auto-seat-label" x="384" y="288" textAnchor="middle">{language === "zh" ? "驾驶员" : "Driver"}</text>
        </g>
        <g className="auto-seat passenger-seat">
          <rect className="auto-seat-back" height="88" rx="18" width="92" x="550" y="178" />
          <rect className="auto-seat-base" height="58" rx="18" width="106" x="543" y="254" />
          <text className="auto-seat-label" x="596" y="288" textAnchor="middle">{language === "zh" ? "副驾" : "Passenger"}</text>
        </g>
        <g className="auto-seat rear-seat">
          <rect className="auto-seat-back" height="76" rx="18" width="260" x="360" y="354" />
          <rect className="auto-seat-base" height="56" rx="18" width="286" x="347" y="418" />
          <text className="auto-seat-label" x="490" y="452" textAnchor="middle">{language === "zh" ? "后排乘客" : "Rear passengers"}</text>
        </g>

        <path className="auto-localization-beam" d="M490 100 C444 130 414 166 384 216" markerEnd="url(#autoArrow)" />
        <path className="auto-localization-beam" d="M490 100 C542 132 570 166 596 216" markerEnd="url(#autoArrow)" />
        <path className="auto-localization-beam rear" d="M490 100 C490 220 490 300 490 390" markerEnd="url(#autoArrow)" />
        <rect className="auto-chip localization" height="36" rx="18" width="132" x="70" y="118" />
        <text className="auto-chip-text" x="136" y="141" textAnchor="middle">{language === "zh" ? "声源定位" : "Localization"}</text>
        <path className="auto-arrow" d="M202 136 C250 126 320 132 380 180" markerEnd="url(#autoArrow)" />

        <rect className="auto-assistant-panel" height="104" rx="14" width="268" x="640" y="54" />
        <text className="auto-panel-title" x="774" y="84" textAnchor="middle">{language === "zh" ? "语音助手" : "Voice assistant"}</text>
        <text className="auto-panel-copy" x="774" y="112" textAnchor="middle">
          {language === "zh" ? "唤醒词 -> ASR -> NLU / LLM -> 车辆控制" : "Wake -> ASR -> NLU / LLM -> vehicle control"}
        </text>
        <path className="auto-voice-arrow" d="M384 216 C512 142 584 108 640 106" markerEnd="url(#autoVoiceArrow)" />

        <rect className="auto-spatial-panel" height="96" rx="14" width="226" x="62" y="382" />
        <text className="auto-panel-title" x="175" y="412" textAnchor="middle">{language === "zh" ? "座舱空间音频" : "Cabin spatial audio"}</text>
        <text className="auto-panel-copy" x="175" y="438" textAnchor="middle">{language === "zh" ? "音乐 / 导航 / 告警 / 语音反馈" : "Music / navigation / alerts / voice"}</text>
        <path className="auto-spatial-ring" d="M290 172 C380 122 600 122 710 172" />
        <path className="auto-spatial-ring" d="M270 408 C384 492 596 492 710 408" />

        <rect className="auto-noise-chip" height="30" rx="15" width="74" x="784" y="224" />
        <text className="auto-noise-text" x="821" y="244" textAnchor="middle">{language === "zh" ? "路噪" : "road"}</text>
        <rect className="auto-noise-chip" height="30" rx="15" width="74" x="786" y="270" />
        <text className="auto-noise-text" x="823" y="290" textAnchor="middle">{language === "zh" ? "空调" : "HVAC"}</text>
        <rect className="auto-noise-chip" height="30" rx="15" width="74" x="786" y="316" />
        <text className="auto-noise-text" x="823" y="336" textAnchor="middle">{language === "zh" ? "音乐" : "music"}</text>

        <text className="auto-legend" x="332" y="536">
          {language === "zh" ? "麦克风阵列先判断座位和方向，再把语音助手、车辆控制和空间音频策略串起来。" : "The mic array first estimates seat and direction, then connects assistant, vehicle control, and spatial rendering policy."}
        </text>
      </svg>
      <figcaption>
        {language === "zh"
          ? "汽车图像把声源定位、语音助手和座舱空间音频放在同一个座舱拓扑里：定位负责判断谁在说，助手负责理解和执行，空间音频负责把声音放回正确方向和座位。"
          : "The car image places localization, voice assistant, and cabin spatial audio in one topology: localization decides who speaks, the assistant understands and acts, and spatial audio renders sound to the right direction and seat."}
      </figcaption>
    </figure>
  );
}

export function AutomotiveAudioLab({ language, onBack }: AutomotiveAudioLabProps) {
  return (
    <main className="automotive-lab-page" aria-label={language === "zh" ? "智能汽车实验室" : "Intelligent Vehicle Audio Lab"}>
      <section className="sound-lab-hero automotive-lab-hero">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="details-category">{language === "zh" ? "应用场景" : "Applications"}</span>
          <h1>{language === "zh" ? "智能汽车实验室" : "Intelligent Vehicle Audio Lab"}</h1>
          <p>
            {language === "zh"
              ? "用一张座舱图理解车载语音：麦克风如何判断谁在说话，语音助手如何接入车辆控制，空间音频如何在不同座位渲染声音。"
              : "Use one cabin diagram to understand vehicle voice: how microphones identify who speaks, how the assistant controls the car, and how spatial audio renders per seat."}
          </p>
        </div>
      </section>

      <section className="automotive-diagram-section" aria-label={language === "zh" ? "智能汽车座舱音频拓扑" : "Intelligent vehicle cabin audio topology"}>
        <AutomotiveCabinDiagram language={language} />
      </section>

      <section className="automotive-module-section" aria-label={language === "zh" ? "座舱模块解释" : "Cabin module explanations"}>
        <div className="automotive-section-heading">
          <span>{language === "zh" ? "座舱模块" : "Cabin modules"}</span>
          <h2>{language === "zh" ? "每个模块解决什么问题" : "What each module solves"}</h2>
        </div>
        <div className="automotive-module-grid">
          {vehicleModules.map((module) => (
            <article className="automotive-module-card" key={module.title.en}>
              <h3>{module.title[language]}</h3>
              <p>{module.body[language]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="automotive-issue-section" aria-label={language === "zh" ? "典型问题诊断" : "Common issue troubleshooting"}>
        <div className="automotive-section-heading">
          <span>{language === "zh" ? "排查思路" : "Troubleshooting"}</span>
          <h2>{language === "zh" ? "典型问题诊断" : "Common Issue Troubleshooting"}</h2>
        </div>
        <div className="automotive-issue-grid">
          {vehicleIssues.map((issue) => (
            <article className="automotive-issue-card" key={issue.title.en}>
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
