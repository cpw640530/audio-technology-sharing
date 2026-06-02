import { ArrowLeft } from "lucide-react";

import type { Language } from "../content/knowledge";

type AmplifierSpeakerLabProps = {
  language: Language;
  onBack: () => void;
};

const chainLabels = {
  zh: ["DAC / Codec 输出", "功放", "分频 / 保护", "扬声器单元", "空气声波"],
  en: ["DAC / Codec out", "Amplifier", "Crossover / protection", "Speaker driver", "Air pressure"]
} satisfies Record<Language, string[]>;

export function AmplifierSpeakerLab({ language, onBack }: AmplifierSpeakerLabProps) {
  return (
    <main className="codec-lab-page amp-lab">
      <section className="sound-lab-hero" aria-labelledby="amplifier-speaker-lab-title">
        <button className="sound-lab-back" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          {language === "zh" ? "返回知识库" : "Back to knowledge base"}
        </button>
        <div>
          <span className="section-kicker">{language === "zh" ? "硬件实验" : "Hardware lab"}</span>
          <h1 id="amplifier-speaker-lab-title">
            {language === "zh" ? "功放与扬声器实验室" : "Amplifier and Speaker Lab"}
          </h1>
          <p>
            {language === "zh"
              ? "观察小信号如何变成功率输出、振膜运动和空气声波，并试听常见功放与扬声器问题。"
              : "Inspect how a small signal becomes power output, diaphragm motion, and air pressure while auditioning common amplifier and speaker problems."}
          </p>
        </div>
      </section>

      <section
        aria-label={language === "zh" ? "功放与扬声器信号链" : "Amplifier and speaker signal chain"}
        className="amp-lab-chain"
      >
        {chainLabels[language].map((label, index) => (
          <div className="amp-chain-node" key={label}>
            <span>{label}</span>
            {index < chainLabels[language].length - 1 ? <strong aria-hidden="true">→</strong> : null}
          </div>
        ))}
      </section>
    </main>
  );
}
