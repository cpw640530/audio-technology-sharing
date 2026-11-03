import { ArrowLeft, ArrowRight, Library } from "lucide-react";
import type { Language } from "../content/knowledge";
import { text } from "../content/language";

type TopicPagerProps = {
  language: Language;
  onPrevious?: () => void;
  onBack: () => void;
  onNext?: () => void;
};

export function TopicPager({ language, onPrevious, onBack, onNext }: TopicPagerProps) {

  return (
    <nav className="topic-pager" aria-label={text(language, "详细内容导航", "Detailed topic navigation", "詳細記事のナビゲーション", "상세 주제 탐색")}>
      <button type="button" className="topic-pager-button" disabled={!onPrevious} onClick={onPrevious}>
        <ArrowLeft size={17} aria-hidden="true" />
        <span>{text(language, "上一张卡片", "Previous topic", "前のトピック", "이전 주제")}</span>
      </button>
      <button type="button" className="topic-pager-button topic-pager-home" onClick={onBack}>
        <Library size={17} aria-hidden="true" />
        <span>{text(language, "返回知识分类", "Back to topics", "トピック一覧に戻る", "주제 목록으로")}</span>
      </button>
      <button type="button" className="topic-pager-button" disabled={!onNext} onClick={onNext}>
        <span>{text(language, "下一张卡片", "Next topic", "次のトピック", "다음 주제")}</span>
        <ArrowRight size={17} aria-hidden="true" />
      </button>
    </nav>
  );
}
