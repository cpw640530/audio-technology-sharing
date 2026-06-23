import { ArrowLeft } from "lucide-react";
import type { Language } from "../content/knowledge";

type AutomotiveAudioLabProps = {
  language: Language;
  onBack: () => void;
};

type LocalizedText = Record<Language, string>;

const vehicleModules = [
  {
    title: { zh: "麦克风与扬声器位置", en: "Microphone and speaker placement" },
    body: {
      zh: "车顶/顶灯、内后视镜、中控、头枕或 B 柱常放麦克风；仪表台、A 柱、门板、后环绕和低音炮常放扬声器。位置决定拾音距离、声像方向和可校准空间。",
      en: "Microphones are often placed near the roof lamp, mirror, console, headrests, or B-pillars; speakers often sit in the dash, A-pillars, doors, rear surrounds, and subwoofer positions. Placement determines pickup distance, image direction, and calibration space."
    }
  },
  {
    title: { zh: "车载语音助手交互", en: "In-car voice assistant interaction" },
    body: {
      zh: "链路通常是唤醒词 -> ASR -> NLU/LLM -> 车辆控制 / 语音反馈。和手机助手不同，车内还要判断座位、驾驶状态、权限和当前车辆环境。",
      en: "The chain is typically wake word -> ASR -> NLU/LLM -> vehicle control / voice response. Unlike a phone assistant, the car must also consider seat, driving state, permission, and live vehicle context."
    }
  },
  {
    title: { zh: "声源定位与分区拾音", en: "Localization and zone pickup" },
    body: {
      zh: "通过多麦之间的到达时间差、相位差和能量差估计说话方向，再把目标座位增强、其他座位和回放声压低。",
      en: "Arrival-time, phase, and level differences across microphones estimate direction, then the target seat is enhanced while other seats and playback leakage are reduced."
    }
  },
  {
    title: { zh: "座舱空间音频", en: "Cabin spatial audio" },
    body: {
      zh: "根据扬声器布局、座位补偿、延迟、EQ 和相位，把音乐、导航、提示音和助手反馈放到合适方向；安全告警应覆盖娱乐声场。",
      en: "Uses speaker layout, seat compensation, delay, EQ, and phase to place music, navigation, alerts, and assistant feedback in useful directions; safety alerts should override entertainment imaging."
    }
  },
  {
    title: { zh: "主动降噪 ANC / RNC", en: "ANC / road-noise cancellation" },
    body: {
      zh: "用参考传感器或车内误差麦估计低频噪声，通过扬声器播放反相信号抵消。它适合发动机、胎噪、路噪等稳定低频，不适合强行消除人声和突发高频。",
      en: "Reference sensors or in-cabin error microphones estimate low-frequency noise, then speakers emit anti-phase sound. It fits engine, tire, and road noise better than speech or transient high-frequency sounds."
    }
  },
  {
    title: { zh: "车内噪声与回放干扰", en: "Cabin noise and playback leakage" },
    body: {
      zh: "路噪、风噪、空调、音乐和多人说话会同时进入麦克风。语音系统要结合 AEC、降噪、分区拾音和上下文策略，避免误唤醒和误控制。",
      en: "Road noise, wind, HVAC, music, and overlapping speech enter the microphones together. The voice system combines AEC, denoising, zone pickup, and context policy to avoid false wakes and wrong controls."
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
    title: { zh: "定位漂移", en: "Localization drift" },
    cause: {
      zh: "可能来自麦克风通道延迟不一致、车内强反射、音乐泄漏、乘客重叠说话，或阵列几何与实际装车位置不匹配。",
      en: "It can come from inconsistent mic-channel delay, strong cabin reflections, music leakage, overlapping talkers, or array geometry that does not match the installed position."
    },
    checks: [
      { zh: "先校验多麦通道顺序、采样同步和固定延迟。", en: "First verify mic channel order, sampling sync, and fixed delay." },
      { zh: "再看不同座位、车窗开闭和音乐播放时的 DOA 分布。", en: "Then inspect DOA distribution across seats, window states, and music playback." },
      { zh: "最后看定位结果是否被唤醒、ASR 或车辆控制链路正确使用。", en: "Finally check whether localization is correctly consumed by wake, ASR, or vehicle-control logic." }
    ]
  },
  {
    title: { zh: "ANC 压耳或轰鸣", en: "ANC pressure or rumble" },
    cause: {
      zh: "通常和反相信号相位错、误差麦位置、低频反馈、参考信号延迟或路况模型不匹配有关，严重时会让低频更突出。",
      en: "Usually related to wrong anti-phase timing, error-mic placement, low-frequency feedback, reference delay, or road-model mismatch; in severe cases low-frequency noise becomes stronger."
    },
    checks: [
      { zh: "先确认误差麦、参考传感器和扬声器通道对应关系。", en: "First verify the mapping among error microphones, reference sensors, and speaker channels." },
      { zh: "再看 40-200 Hz 低频段的相位、延迟和环路稳定性。", en: "Then inspect phase, delay, and loop stability around the 40-200 Hz low band." },
      { zh: "最后确认 ANC 不会覆盖导航、告警和语音助手反馈。", en: "Finally confirm ANC does not mask navigation, alerts, or assistant feedback." }
    ]
  }
] satisfies Array<{ title: LocalizedText; cause: LocalizedText; checks: LocalizedText[] }>;

function AutomotiveCabinDiagram({ language }: { language: Language }) {
  return (
    <figure className="automotive-diagram">
      <svg
        aria-label={language === "zh" ? "车载声学座舱部件位置图" : "In-car acoustics cabin component layout diagram"}
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
          {language === "zh" ? "车载声学：麦克风、扬声器、语音交互、空间音频和 ANC 在同一个座舱里协同" : "In-car acoustics: microphones, speakers, voice UX, spatial audio, and ANC in one cabin"}
        </text>

        <g className="auto-car">
          <path className="auto-body" d="M290 74 C230 116 204 214 212 333 C220 442 282 510 490 510 C698 510 760 442 768 333 C776 214 750 116 690 74 C634 42 346 42 290 74Z" />
          <path className="auto-window" d="M330 98 C288 146 272 218 278 300 L702 300 C708 218 692 146 650 98 C600 78 380 78 330 98Z" />
          <path className="auto-console" d="M470 116 H510 V432 H470Z" />
          <circle className="auto-wheel" cx="400" cy="178" r="34" />
          <circle className="auto-mic roof" cx="470" cy="100" r="8" />
          <circle className="auto-mic roof" cx="490" cy="100" r="8" />
          <circle className="auto-mic roof" cx="510" cy="100" r="8" />
          <circle className="auto-mic mirror" cx="490" cy="138" r="7" />
          <circle className="auto-error-mic" cx="376" cy="332" r="8" />
          <circle className="auto-error-mic" cx="604" cy="332" r="8" />
          <circle className="auto-speaker dash" cx="490" cy="158" r="13" />
          <circle className="auto-speaker pillar" cx="306" cy="146" r="11" />
          <circle className="auto-speaker pillar" cx="674" cy="146" r="11" />
          <circle className="auto-speaker door" cx="270" cy="246" r="14" />
          <circle className="auto-speaker door" cx="710" cy="246" r="14" />
          <circle className="auto-speaker door" cx="282" cy="408" r="14" />
          <circle className="auto-speaker door" cx="698" cy="408" r="14" />
          <circle className="auto-subwoofer" cx="490" cy="488" r="17" />
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

        <rect className="auto-component-label" height="32" rx="16" width="156" x="332" y="74" />
        <text className="auto-component-text" x="410" y="95" textAnchor="middle">{language === "zh" ? "顶灯麦克风阵列" : "roof mic array"}</text>
        <path className="auto-component-line mic-line" d="M458 90 L470 100" />
        <rect className="auto-component-label speaker-label" height="32" rx="16" width="122" x="760" y="232" />
        <text className="auto-component-text" x="821" y="253" textAnchor="middle">{language === "zh" ? "门板扬声器" : "door speakers"}</text>
        <path className="auto-component-line speaker-line" d="M760 248 L710 246" />
        <rect className="auto-component-label speaker-label" height="32" rx="16" width="122" x="548" y="140" />
        <text className="auto-component-text" x="609" y="161" textAnchor="middle">{language === "zh" ? "中置扬声器" : "center speaker"}</text>
        <path className="auto-component-line speaker-line" d="M548 156 L503 158" />
        <rect className="auto-component-label anc-label" height="32" rx="16" width="120" x="218" y="320" />
        <text className="auto-component-text" x="278" y="341" textAnchor="middle">{language === "zh" ? "ANC 误差麦" : "ANC error mic"}</text>
        <path className="auto-component-line anc-line" d="M338 336 L376 332" />

        <rect className="auto-assistant-panel" height="104" rx="14" width="268" x="640" y="54" />
        <text className="auto-panel-title" x="774" y="84" textAnchor="middle">{language === "zh" ? "语音助手" : "Voice assistant"}</text>
        <text className="auto-panel-copy" x="774" y="112" textAnchor="middle">
          {language === "zh" ? "唤醒词 -> ASR -> NLU / LLM -> 车辆控制 / 语音反馈" : "Wake -> ASR -> NLU / LLM -> control / response"}
        </text>
        <path className="auto-voice-arrow" d="M384 216 C512 142 584 108 640 106" markerEnd="url(#autoVoiceArrow)" />

        <rect className="auto-spatial-panel" height="96" rx="14" width="226" x="62" y="382" />
        <text className="auto-panel-title" x="175" y="412" textAnchor="middle">{language === "zh" ? "座舱空间音频" : "Cabin spatial audio"}</text>
        <text className="auto-panel-copy" x="175" y="438" textAnchor="middle">{language === "zh" ? "音乐 / 导航 / 告警 / 语音反馈" : "Music / navigation / alerts / voice"}</text>
        <path className="auto-spatial-ring" d="M290 172 C380 122 600 122 710 172" />
        <path className="auto-spatial-ring" d="M270 408 C384 492 596 492 710 408" />

        <rect className="auto-anc-panel" height="78" rx="14" width="190" x="760" y="374" />
        <text className="auto-panel-title" x="855" y="404" textAnchor="middle">{language === "zh" ? "主动降噪 ANC" : "Active noise control"}</text>
        <text className="auto-panel-copy" x="855" y="430" textAnchor="middle">{language === "zh" ? "低频噪声 + 反相信号" : "low noise + anti-phase"}</text>
        <path className="auto-anc-wave" d="M760 410 C732 388 726 355 698 408" />
        <path className="auto-anc-wave inverse" d="M760 424 C732 446 726 479 698 408" />

        <rect className="auto-noise-chip" height="30" rx="15" width="74" x="784" y="224" />
        <text className="auto-noise-text" x="821" y="244" textAnchor="middle">{language === "zh" ? "路噪" : "road"}</text>
        <rect className="auto-noise-chip" height="30" rx="15" width="74" x="786" y="270" />
        <text className="auto-noise-text" x="823" y="290" textAnchor="middle">{language === "zh" ? "空调" : "HVAC"}</text>
        <rect className="auto-noise-chip" height="30" rx="15" width="74" x="786" y="316" />
        <text className="auto-noise-text" x="823" y="336" textAnchor="middle">{language === "zh" ? "音乐" : "music"}</text>

        <text className="auto-legend" x="332" y="536">
          {language === "zh" ? "示意位置参考常见车内饰布局：实际车型会因座舱、扬声器数量、麦克风数量和成本目标而变化。" : "Positions are representative of common cabin layouts; real vehicles vary by cabin, speaker count, mic count, and cost target."}
        </text>
      </svg>
      <figcaption>
        {language === "zh"
          ? "图中用常见车内饰位置示意麦克风、扬声器和 ANC 误差麦：麦克风负责拾音与定位，扬声器负责语音反馈、音乐声场和反相信号，DSP/助手链路负责把语音交互、安全策略和声学处理串起来。"
          : "The diagram uses common cabin positions for microphones, speakers, and ANC error microphones: microphones handle pickup and localization, speakers render assistant feedback, music imaging, and anti-phase sound, while DSP and assistant chains connect voice UX, safety policy, and acoustic processing."}
      </figcaption>
    </figure>
  );
}

export function AutomotiveAudioLab({ language, onBack }: AutomotiveAudioLabProps) {
  return (
    <main className="automotive-lab-page" aria-label={language === "zh" ? "车载声学实验室" : "In-Car Acoustics Lab"}>
      <section className="sound-lab-hero automotive-lab-hero">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="details-category">{language === "zh" ? "应用场景" : "Applications"}</span>
          <h1>{language === "zh" ? "车载声学实验室" : "In-Car Acoustics Lab"}</h1>
          <p>
            {language === "zh"
              ? "用一张车内饰示意图理解车载声学：麦克风和扬声器放在哪里，语音助手如何交互，声源定位、座舱空间音频和主动降噪如何互相影响。"
              : "Use one cabin layout to understand in-car acoustics: where microphones and speakers sit, how voice interaction works, and how localization, spatial audio, and ANC affect one another."}
          </p>
        </div>
      </section>

      <section className="automotive-diagram-section" aria-label={language === "zh" ? "车载声学座舱部件位置" : "In-car acoustics cabin component layout"}>
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
