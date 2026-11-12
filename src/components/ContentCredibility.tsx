import { Calculator, Film, FlaskConical } from "lucide-react";
import type { Language } from "../content/knowledge";
import type { TopicKey } from "../content/relatedTopics";
import { text } from "../content/language";
import { aiModelReferences, aiModelReviewDate } from "../content/aiModelReferences";
import { topicCredibility, evidenceKinds } from "../content/topicCredibility";

const icons = { calculation: Calculator, simulation: FlaskConical, illustration: Film };

export function ContentCredibility({ topicKey, language, lab = false }: { topicKey: TopicKey; language: Language; lab?: boolean }) {
  const info = topicCredibility[topicKey];
  const model = info.model ? aiModelReferences[info.model] : undefined;
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  return <aside className={`content-credibility${lab ? " content-credibility-lab" : ""}`} data-topic={topicKey}
    aria-label={t("内容依据与实验性质", "Content sources and experiment methods", "内容の根拠と実験方法", "콘텐츠 근거와 실험 방식")}>
    <div className="credibility-meta">
      <strong>{t("内容依据", "Content provenance", "内容の根拠", "콘텐츠 근거")}</strong>
      <span>{t("说明更新", "Notes updated", "説明更新", "설명 업데이트")}: <time dateTime={info.updatedAt}>{info.updatedAt}</time></span>
      <div className="credibility-kinds">{info.methods.map(method => {
        const Icon = icons[method.kind];
        return <span key={method.kind} title={evidenceKinds[method.kind].meaning[language]}><Icon size={14} aria-hidden="true" />{evidenceKinds[method.kind].label[language]}</span>;
      })}</div>
    </div>
    {model && <p className="credibility-ai-notice">{t("本页未运行参考模型推理；演示结果不代表模型实测性能。", "This page does not run the referenced models; demo results are not model benchmarks.", "このページは参照モデルの推論を実行しておらず、デモはモデルの実測性能ではありません。", "이 페이지는 참고 모델을 추론하지 않으며 데모 결과는 모델 실측 성능이 아닙니다.")}</p>}
    <details key={topicKey}>
      <summary>{t("参考来源、模型假设与计算范围", "Sources, assumptions and computation scope", "出典・モデルの仮定・計算範囲", "참고 자료·모델 가정·계산 범위")}</summary>
      <dl className="credibility-methods">{info.methods.map(method => <div key={method.kind}>
        <dt>{evidenceKinds[method.kind].label[language]}</dt>
        <dd>{method.scope[language]}<small>{evidenceKinds[method.kind].meaning[language]}</small></dd>
      </div>)}</dl>
      <p><strong>{t("模型假设与边界", "Assumptions and limits", "モデルの仮定と限界", "모델 가정과 한계")}: </strong>{info.assumptions[language]}</p>
      {model && <p className="credibility-model-version">
        <strong>{model.name}</strong> · {t("发布 / 论文", "Release / paper", "公開 / 論文", "공개 / 논문")}: {model.release}<br />
        {t("模型资料原核查日期", "Model references last reviewed", "モデル資料の最終確認日", "모델 자료 최종 검토일")}: <time dateTime={aiModelReviewDate}>{aiModelReviewDate}</time>
      </p>}
      <strong>{t("主要参考来源", "Primary references", "主な参考資料", "주요 참고 자료")}</strong>
      <ul className="credibility-sources">{info.sources.map(source => <li key={source.url}>
        <a href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a>
      </li>)}</ul>
      <p className="credibility-date-note">{t("日期记录本页依据与演示说明的维护，不代表重新实测硬件或复现论文；外部链接用于核对相应原理。", "The date records maintenance of these notes, not a new hardware test or paper reproduction. External sources support the corresponding principles.", "日付は根拠・デモ説明の更新日であり、ハードウェアの再測定や論文再現の日付ではありません。出典は対応する原理の確認用です。", "날짜는 근거·데모 설명의 갱신일이며 하드웨어 재측정이나 논문 재현 날짜가 아닙니다. 출처는 해당 원리 확인용입니다.")}</p>
    </details>
  </aside>;
}
