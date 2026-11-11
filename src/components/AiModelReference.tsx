import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { AiAudioLabId, Language } from "../content/knowledge";
import { traditional } from "../content/traditional";
import { aiModelReferences, aiModelReviewDate } from "../content/aiModelReferences";

export function AiModelReference({ mode, language, compact = false }: {
  mode: AiAudioLabId;
  language: Language;
  compact?: boolean;
}) {
  const model = aiModelReferences[mode];
  const [selection, setSelection] = useState({ mode, step: 0 });
  const step = selection.mode === mode ? selection.step : 0;
  const id = `ai-reference-${mode}`;
  const t = (zh: string, en: string, ja: string, ko: string) => ({ zh, "zh-Hant": traditional(zh), en, ja, ko })[language];
  return <section className="ai-model-reference" aria-labelledby={`${id}-title`}>
    <div className="ai-reference-meta">
      <span>{t("参考模型与版本", "Model and version", "モデルとバージョン", "모델과 버전")}</span>
      <span>{t("发布 / 论文", "Release / paper", "公開 / 論文", "공개 / 논문")}: {model.release}</span>
      <span>{t("核查", "Reviewed", "確認", "확인")}: <time dateTime={aiModelReviewDate}>{aiModelReviewDate}</time></span>
    </div>
    <h2 id={`${id}-title`}>{model.name}</h2>
    <p>{model.purpose[language]}</p>
    {!compact && <>
      <ol className="ai-reference-flow" aria-label={t("模型处理阶段", "Model processing stages", "モデル処理段階", "모델 처리 단계")}>
        {model.stages.map((stage, index) => <li key={stage.name.en}>
          <button type="button" aria-pressed={step === index} aria-controls={`${id}-stage`} onClick={() => setSelection({ mode, step: index })}>
            <span>{String(index + 1).padStart(2, "0")}</span>{stage.name[language]}
          </button>
          {index < model.stages.length - 1 && <ArrowRight size={16} aria-hidden="true" />}
        </li>)}
      </ol>
      <div className="ai-reference-stage" id={`${id}-stage`} aria-live="polite" aria-atomic="true">
        <h3>{model.stages[step].name[language]}</h3>
        <p>{model.stages[step].detail[language]}</p>
      </div>
      <p className="ai-reference-scope">{t("结构图解，不在浏览器运行模型；下方机制演示也不代表此模型的实测输出。", "Architecture walkthrough, not browser inference; mechanism demos below are not measured outputs of this model.", "構造の説明で、ブラウザ上でモデルは実行しません。下の仕組みのデモもこのモデルの実測出力ではありません。", "구조 설명이며 브라우저에서 모델을 실행하지 않습니다. 아래 원리 데모도 이 모델의 실측 출력이 아닙니다.")}</p>
    </>}
    <details className="ai-reference-boundary">
      <summary>{t("可复现性、边界与经典对照", "Reproducibility, limits and comparisons", "再現性・限界・従来方式との比較", "재현성·한계·고전 방식 비교")}</summary>
      <p>{model.boundary[language]}</p>
      <p>{model.comparison[language]}</p>
    </details>
    <ul className="ai-reference-sources" aria-label={t("官方来源", "Primary sources", "公式資料", "공식 자료")}>
      {model.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.name}</a></li>)}
    </ul>
  </section>;
}
