import { ArrowUpRight } from "lucide-react";
import type { Language } from "../content/knowledge";

const sites = [
  {
    name: "Sound · Bartosz Ciechanowski",
    url: "https://ciechanow.ski/sound/",
    description: { zh: "通过交互图解理解空气振动、声波传播与波形叠加。", en: "Interactive explanations of air vibration, sound propagation, and wave superposition.", ja:"空気の振動、音の伝わり方、波の重ね合わせを対話的に解説。", ko:"공기 진동, 소리 전파 및 파동 중첩에 대한 인터랙티브 해설." }
  },
  {
    name: "Ableton Learning Synths",
    url: "https://learningsynths.ableton.com/",
    description: { zh: "在浏览器中探索声音合成，听见参数调整带来的变化。", en: "Explore synthesis in the browser and hear how changing parameters shapes sound.", ja:"ブラウザーで音の合成を試し、パラメーターによる音の変化を聴く。", ko:"브라우저에서 합성을 탐구하고 매개변수에 따른 소리 변화를 듣습니다." }
  },
  {
    name: "Chrome Music Lab",
    url: "https://musiclab.chromeexperiments.com/",
    description: { zh: "通过简短的互动实验探索声音、音乐与科学。", en: "Hands-on experiments connecting sound, music, and science.", ja:"音、音楽、科学をつなぐ体験型実験。", ko:"소리, 음악, 과학을 연결하는 체험형 실험." }
  },
  {
    name: "SoundLab",
    url: "https://soundlab.sciencemusic.org/",
    description: { zh: "面向声音与声学教学的开放式网页应用。", en: "An open-access web app for exploring sound and acoustics.", ja:"音と音響を学ぶための公開 Web アプリ。", ko:"소리와 음향을 탐구하는 공개 웹 앱." }
  },
  {
    name: "Why You Hear What You Hear",
    url: "https://www.whyyouhearwhatyouhear.com/",
    description: { zh: "结合音频示例、动画和交互工具学习声音与心理声学。", en: "Sound and psychoacoustics through audio examples, animations, and interactive tools.", ja:"音声例、アニメーション、対話型ツールで音と心理音響を学ぶ。", ko:"음성 예시, 애니메이션 및 인터랙티브 도구로 배우는 소리와 심리음향." }
  },
  {
    name: "Digital Audio and Acoustics",
    url: "https://asp.virtual-acoustics.org/",
    description: { zh: "围绕信号理论、声学量与数字音频处理的交互学习资源。", en: "Interactive learning resources for signal theory, acoustic quantities, and digital audio.", ja:"信号理論、音響量、デジタルオーディオの対話型学習資料。", ko:"신호 이론, 음향량 및 디지털 오디오를 위한 인터랙티브 학습 자료." }
  },
  {
    name: "Sound On Sound · Techniques",
    url: "https://www.soundonsound.com/techniques",
    description: { zh: "音频制作与工程实践文章，连接技术概念与实际应用。", en: "Audio production and engineering articles connecting concepts to practical applications.", ja:"概念と実践をつなぐ音声制作・技術記事。", ko:"개념과 실제 응용을 연결하는 오디오 제작 및 엔지니어링 글." }
  }
];

export function ReferenceSites({ language }: { language: Language }) {
  return (
    <section className="reference-sites" aria-labelledby="reference-sites-title">
      <h2 id="reference-sites-title">{({zh:"参考与延伸阅读",en:"References and Further Reading",ja:"参考資料と関連サイト",ko:"참고 자료 및 더 읽을거리"})[language]}</h2>
      <ul>
        {sites.map(site => (
          <li key={site.url}>
            <a href={site.url} target="_blank" rel="noopener noreferrer">
              <span>{site.name}</span>
              <ArrowUpRight size={18} aria-hidden="true" />
              <span className="reference-sites-sr">{({zh:"（在新标签页打开）",en:" (opens in a new tab)",ja:"（新しいタブで開く）",ko:" (새 탭에서 열림)"})[language]}</span>
            </a>
            <p>{site.description[language]}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
