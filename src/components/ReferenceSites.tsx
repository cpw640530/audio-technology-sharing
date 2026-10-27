import { ArrowUpRight } from "lucide-react";
import type { Language } from "../content/knowledge";

const sites = [
  {
    name: "Sound · Bartosz Ciechanowski",
    url: "https://ciechanow.ski/sound/",
    description: { zh: "通过交互图解理解空气振动、声波传播与波形叠加。", en: "Interactive explanations of air vibration, sound propagation, and wave superposition." }
  },
  {
    name: "Ableton Learning Synths",
    url: "https://learningsynths.ableton.com/",
    description: { zh: "在浏览器中探索声音合成，听见参数调整带来的变化。", en: "Explore synthesis in the browser and hear how changing parameters shapes sound." }
  },
  {
    name: "Chrome Music Lab",
    url: "https://musiclab.chromeexperiments.com/",
    description: { zh: "通过简短的互动实验探索声音、音乐与科学。", en: "Hands-on experiments connecting sound, music, and science." }
  },
  {
    name: "SoundLab",
    url: "https://soundlab.sciencemusic.org/",
    description: { zh: "面向声音与声学教学的开放式网页应用。", en: "An open-access web app for exploring sound and acoustics." }
  },
  {
    name: "Why You Hear What You Hear",
    url: "https://www.whyyouhearwhatyouhear.com/",
    description: { zh: "结合音频示例、动画和交互工具学习声音与心理声学。", en: "Sound and psychoacoustics through audio examples, animations, and interactive tools." }
  },
  {
    name: "Digital Audio and Acoustics",
    url: "https://asp.virtual-acoustics.org/",
    description: { zh: "围绕信号理论、声学量与数字音频处理的交互学习资源。", en: "Interactive learning resources for signal theory, acoustic quantities, and digital audio." }
  },
  {
    name: "Sound On Sound · Techniques",
    url: "https://www.soundonsound.com/techniques",
    description: { zh: "音频制作与工程实践文章，连接技术概念与实际应用。", en: "Audio production and engineering articles connecting concepts to practical applications." }
  }
];

export function ReferenceSites({ language }: { language: Language }) {
  return (
    <section className="reference-sites" aria-labelledby="reference-sites-title">
      <h2 id="reference-sites-title">{language === "zh" ? "参考与延伸阅读" : "References and Further Reading"}</h2>
      <ul>
        {sites.map(site => (
          <li key={site.url}>
            <a href={site.url} target="_blank" rel="noopener noreferrer">
              <span>{site.name}</span>
              <ArrowUpRight size={18} aria-hidden="true" />
              <span className="reference-sites-sr">{language === "zh" ? "（在新标签页打开）" : " (opens in a new tab)"}</span>
            </a>
            <p>{site.description[language]}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
