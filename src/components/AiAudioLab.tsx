import { traditional } from "../content/traditional";
import { ArrowLeft } from "lucide-react";
import { AiDenoiseWalkthrough } from "./AiDenoiseWalkthrough";
import { AsrWalkthrough } from "./AsrWalkthrough";
import { TtsWalkthrough } from "./TtsWalkthrough";
import { AudioGenerationWalkthrough } from "./AudioGenerationWalkthrough";
import { AudioEventWalkthrough } from "./AudioEventWalkthrough";
import { AiModelReference } from "./AiModelReference";
import type { AiAudioLabId, Language } from "../content/knowledge";

type AiAudioLabProps = {
  labId?: Exclude<AiAudioLabId, "overview">;
  language: Language;
  onBack: () => void;
  onBackToDetails?: () => void;
};

import { aiArticles, type LocalizedAiArticle } from "../content/aiArticles";

const aiUiText = (language: Language, zh: string, en: string, jaText: string, koText: string): string => ({
  zh, "zh-Hant": traditional(zh),
  en,
  ja: jaText,
  ko: koText
})[language];

type LabTransitionCopy = { zh: string; en: string; ja: string; ko: string };

const labTransitions: Record<Exclude<AiAudioLabId, "overview">, LabTransitionCopy> = {
  asr: {
    zh: "演示先把声学特征变成逐步的 token 分布；随后 CTC、RNN-T 或注意力解码按不同对齐规则把分布变成文字。",
    en: "The walkthrough first turns acoustic features into stepwise token distributions; CTC, RNN-T, or attention decoding then maps them to text with different alignment rules.",
    ja: "デモでは音響特徴を段階的な token 分布に変換し、CTC・RNN-T・Attention の各デコードが異なる整列規則で文字列に変換します。",
    ko: "데모는 음향 특징을 단계별 token 분포로 바꾸고, CTC·RNN-T·Attention 디코딩이 서로 다른 정렬 규칙으로 문자로 변환합니다."
  },
  tts: {
    zh: "时长展开先决定声学表示占用多少帧；随后各条路线把 Mel 或 speech token 交给声码器或匹配解码器，才得到 PCM。这里的显式时长是 FastSpeech 类教学假设，并非所有 TTS 都有独立时长预测器。",
    en: "Duration expansion first determines how many acoustic frames are allocated; each route then sends Mel or speech tokens to a vocoder or matching decoder to obtain PCM. This explicit duration is a FastSpeech-style teaching assumption. Not every TTS uses a separate duration predictor.",
    ja: "長さの展開で音響表現に割り当てるフレーム数を決め、その後に各経路が Mel または音声 token をボコーダや対応デコーダへ渡して PCM にします。明示的な長さは FastSpeech 型の教材上の仮定で、すべての TTS に独立した長さ予測器があるわけではありません。",
    ko: "길이 확장은 음향 표현에 할당할 프레임 수를 먼저 정하고, 각 경로가 Mel 또는 음성 token을 보코더나 대응 디코더로 보내 PCM을 만듭니다. 이 명시적 길이는 FastSpeech 방식의 교육 가정이며 모든 TTS가 별도 길이 예측기를 사용하는 것은 아닙니다."
  },
  generation: {
    zh: "条件与表示预算决定模型要处理的 latent/token 序列；解码阶段再把这些表示映射回可播放音频。",
    en: "Conditions and representation budgets determine the latent/token sequence the model would process; decoding then maps that representation back to playable audio.",
    ja: "条件と表現の予算がモデルの latent/token 列を決め、デコード段階でその表現を再生可能な音声へ戻します。",
    ko: "조건과 표현 예산이 모델이 처리할 latent/token 시퀀스를 정하고, 디코딩 단계에서 그 표현을 재생 가능한 오디오로 되돌립니다."
  },
  event: {
    zh: "本演示的输入是逐帧类别分数；阈值、连续区间合并和最短时长规则再把分数变成事件区间。",
    en: "This walkthrough starts from per-frame class scores; thresholding, contiguous-run merging, and minimum-duration rules turn those scores into event intervals.",
    ja: "このデモはフレームごとのクラススコアから始まり、閾値・連続区間の結合・最短長の規則でイベント区間に変換します。",
    ko: "이 데모는 프레임별 클래스 점수에서 시작하며, 임계값·연속 구간 병합·최소 지속 시간 규칙으로 이벤트 구간을 만듭니다."
  },
  enhancement: {
    zh: "本教学模型先从局部时频特征估计 mask，再把 mask 作用于幅度并保留相位重建输出；滑块会局部复算选中位置，但不会重新训练或改变音频。",
    en: "This teaching model estimates a mask from local time-frequency features, applies it to magnitude while retaining phase, and reconstructs the output; sliders recompute selected local values but do not retrain the model or change the audio.",
    ja: "この教材モデルは局所的な時間周波数特徴から mask を推定し、位相を保ったまま振幅へ適用して出力を再構成します。スライダーは選択位置の値を局所的に再計算しますが、再学習や音声変更はしません。",
    ko: "이 교육 모델은 국소 시간-주파수 특징에서 mask를 추정하고 위상을 유지한 채 진폭에 적용해 출력을 재구성합니다. 슬라이더는 선택 위치의 값을 국소적으로 다시 계산하지만 재학습하거나 오디오를 바꾸지는 않습니다."
  },
  codec: {
    zh: "量化把连续向量变成码本索引；索引级数和每秒帧数决定原始码率，匹配的神经解码器再据此重建 PCM。",
    en: "Quantization turns continuous vectors into codebook indices; index levels and frames per second determine raw bitrate, after which a matching neural decoder reconstructs PCM.",
    ja: "量子化で連続ベクトルをコードブックの index に変換し、段数と毎秒フレーム数で生のビットレートを決め、対応するニューラルデコーダが PCM を再構成します。",
    ko: "양자화는 연속 벡터를 코드북 인덱스로 바꾸며, 단계 수와 초당 프레임 수가 원시 비트레이트를 정한 뒤 대응 신경 디코더가 PCM을 복원합니다."
  }
};

function AiLabTransition({ labId, language }: { labId: Exclude<AiAudioLabId, "overview">; language: Language }) {
  const copy = labTransitions[labId];
  const value = language === "zh-Hant" ? traditional(copy.zh) : copy[language];
  return <p className="ai-lab-transition">{value}</p>;
}

function AiEquationSection({
  article,
  language
}: {
  article: LocalizedAiArticle;
  language: Language;
}) {
  return (
    <section className="ai-technical-section" aria-labelledby="ai-equation-title">
      <div className="ai-article-section-heading ai-model-heading">
        <span>{aiUiText(language, "从索引到码率", "From indices to bitrate", "インデックスからビットレートへ", "인덱스에서 비트레이트로")}</span>
        <h2 id="ai-equation-title">{aiUiText(language, "量化与码率例子", "Quantization and bitrate examples", "量子化とビットレートの例", "양자화와 비트레이트 예시")}</h2>
      </div>
      <div className="ai-equation-grid" aria-label={aiUiText(language, "核心公式", "Core equations", "主要な式", "핵심 공식")}>
        {article.equations.map((equation) => (
          <article key={equation.expression}>
            <h3>{equation.title[language]}</h3>
            <code>{equation.expression}</code>
            <p>{equation.explanation[language]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AiAudioLab({ labId = "event", language, onBack, onBackToDetails }: AiAudioLabProps) {
  const article = aiArticles[labId] ?? aiArticles.event;
  const interactive = labId === "asr" || labId === "enhancement" || labId === "tts" || labId === "generation" || labId === "event";
  const chapters = [
    ["ai-source", aiUiText(language, "来源与边界", "Sources and limits", "出典と限界", "출처와 한계")],
    ...(interactive
      ? [["ai-demo", aiUiText(language, "交互演示", "Walkthrough", "インタラクティブデモ", "인터랙티브 데모")]]
      : [["ai-equations", aiUiText(language, "量化与码率", "Quantization and bitrate", "量子化とビットレート", "양자화와 비트레이트")]])
  ];

  return (
    <main className="ai-audio-page ai-article-page" aria-label={article.title[language]}>
      <section className="sound-lab-hero ai-article-hero">
        <div className="sound-lab-back-actions">
          <button className="sound-lab-back" type="button" onClick={onBack}>
            <ArrowLeft size={18} aria-hidden="true" />
            {aiUiText(language, "返回知识库", "Back to knowledge base", "知識ベースに戻る", "지식 베이스로 돌아가기")}
          </button>
          {onBackToDetails ? <button className="sound-lab-back" type="button" onClick={onBackToDetails}>{aiUiText(language, "返回详细内容", "Back to details", "詳細ページに戻る", "상세 내용으로 돌아가기")}</button> : null}
        </div>
        <div>
          <span className="details-category">{article.eyebrow[language]}</span>
          <h1>{article.title[language]}</h1>
          <p>{article.summary[language]}</p>
        </div>
      </section>

        <nav className="ai-reading-nav" aria-label={aiUiText(language, "AI 实验室章节", "AI lab chapters", "AIラボの章", "AI 랩 장")}>
          {chapters.map(([id, label], index) => <a key={id} href={`#${id}`} onClick={event => {
            event.preventDefault();
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}>{String(index + 1).padStart(2, "0")} · {label}</a>)}
        </nav>
        <div className="ai-reading-section" id="ai-source"><AiModelReference mode={labId} language={language} compact /></div>
        {interactive ? <div className="ai-reading-section" id="ai-demo">
          <AiLabTransition labId={labId} language={language} />
          {labId === "enhancement" ? <AiDenoiseWalkthrough language={language} /> : labId === "tts" ? <TtsWalkthrough language={language} /> : labId === "generation" ? <AudioGenerationWalkthrough language={language} /> : labId === "event" ? <AudioEventWalkthrough language={language} /> : <AsrWalkthrough language={language} />}
        </div> : <div className="ai-reading-section" id="ai-equations">
          <AiLabTransition labId={labId} language={language} />
          <AiEquationSection article={article} language={language} />
        </div>}
    </main>
  );
}
