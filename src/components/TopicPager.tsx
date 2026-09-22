import { ArrowLeft, ArrowRight, Library } from "lucide-react";
import type { Language } from "../content/knowledge";

type TopicPagerProps = {
  language: Language;
  onPrevious?: () => void;
  onBack: () => void;
  onNext?: () => void;
};

export function TopicPager({ language, onPrevious, onBack, onNext }: TopicPagerProps) {
  const isChinese = language === "zh";

  return (
    <nav className="topic-pager" aria-label={isChinese ? "详细内容导航" : "Detailed topic navigation"}>
      <button type="button" className="topic-pager-button" disabled={!onPrevious} onClick={onPrevious}>
        <ArrowLeft size={17} aria-hidden="true" />
        <span>{isChinese ? "上一张卡片" : "Previous topic"}</span>
      </button>
      <button type="button" className="topic-pager-button topic-pager-home" onClick={onBack}>
        <Library size={17} aria-hidden="true" />
        <span>{isChinese ? "返回知识分类" : "Back to topics"}</span>
      </button>
      <button type="button" className="topic-pager-button" disabled={!onNext} onClick={onNext}>
        <span>{isChinese ? "下一张卡片" : "Next topic"}</span>
        <ArrowRight size={17} aria-hidden="true" />
      </button>
    </nav>
  );
}
