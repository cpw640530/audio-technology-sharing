import { Component, type ReactNode } from "react";
import type { Language } from "../content/knowledge";
import { text } from "../content/language";

export class RouteBoundary extends Component<{ children: ReactNode; language: Language }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    const { language } = this.props;
    return <section className="route-loading" role="alert">
      <p>{text(language, "内容加载失败，请检查网络后重试。", "Content could not load. Check your connection and retry.", "読み込めませんでした。接続を確認して再試行してください。", "콘텐츠를 불러오지 못했습니다. 연결을 확인하고 다시 시도하세요.")}</p>
      <button type="button" onClick={() => window.location.reload()}>{text(language, "重新加载", "Reload", "再読み込み", "새로고침")}</button>
      <p><a href={`${import.meta.env.BASE_URL}#top`}>{text(language, "返回知识库", "Back to knowledge base", "知識ベースに戻る", "지식 베이스로 돌아가기")}</a></p>
    </section>;
  }
}
