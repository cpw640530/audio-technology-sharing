import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Bookmark, History, RotateCcw, Trash2 } from "lucide-react";
import { topicRoutes, topicHref } from "../content/topicRoutes";
import { clearLocalLearning, emptyReadingMemory, learningStorageKey, readLocal, sanitizeReadingMemory, writeLocal, type ReadingMemory, type Visit } from "../content/localLearning";
import type { Language } from "../content/knowledge";
import { text } from "../content/language";
import { KnowledgeNavigationContext } from "./KnowledgeNavigation";
import { LabSessionContext } from "../hooks/useLabState";

const knownTopics = new Map<string, boolean>(topicRoutes.map(entry => [entry.key, Boolean(entry.labView)]));
const ReadingContext = createContext<{
  data: ReadingMemory; failed: boolean; reportError: () => void;
  visit: (key: string, kind: Visit["kind"]) => void;
  toggle: (key: string) => void; clear: () => void;
} | null>(null);
export const useReadingMemory = () => useContext(ReadingContext);

export function ReadingMemoryProvider({ children }: { children: ReactNode }) {
  const [failed, setFailed] = useState(false);
  const reportError = useCallback(() => setFailed(true), []);
  const readFailed = useRef(false);
  const [data, setData] = useState(() => sanitizeReadingMemory(readLocal(learningStorageKey, () => { readFailed.current = true; }), knownTopics));
  const latest = useRef(data);
  const memoryOnly = useRef(false);
  const update = useCallback((change: (data: ReadingMemory) => ReadingMemory) => {
    let unavailable = false;
    const saved = readLocal(learningStorageKey, () => { unavailable = true; reportError(); });
    const next = change(unavailable || memoryOnly.current ? latest.current : sanitizeReadingMemory(saved, knownTopics));
    latest.current = next;
    setData(next);
    memoryOnly.current = !writeLocal(learningStorageKey, next, reportError);
  }, [reportError]);
  const visit = useCallback((key: string, kind: Visit["kind"]) => {
    if (!knownTopics.has(key) || (kind === "lab" && !knownTopics.get(key))) return;
    update(previous => ({ ...previous, recent: [{ key, kind, at: Date.now() }, ...previous.recent.filter(item => item.key !== key)].slice(0, 8) }));
  }, [update]);
  const toggle = useCallback((key: string) => {
    if (!knownTopics.has(key)) return;
    update(previous => ({ ...previous, favorites: previous.favorites.includes(key) ? previous.favorites.filter(item => item !== key) : [...previous.favorites, key] }));
  }, [update]);
  const clear = useCallback(() => {
    clearLocalLearning(reportError);
    latest.current = emptyReadingMemory();
    setData(latest.current);
  }, [reportError]);
  useEffect(() => {
    if (readFailed.current) reportError();
    const sync = (event: StorageEvent) => {
      if (event.key !== null && event.key !== learningStorageKey) return;
      latest.current = sanitizeReadingMemory(readLocal(learningStorageKey, reportError), knownTopics);
      setData(latest.current);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [reportError]);
  return <ReadingContext.Provider value={{ data, failed, reportError, visit, toggle, clear }}>{children}</ReadingContext.Provider>;
}

function StorageWarning({ language }: { language: Language }) {
  const memory = useReadingMemory();
  return memory?.failed ? <p className="reading-storage-warning" role="status">{text(language, "本地保存不可用，更改可能在离开后丢失。", "Local saving is unavailable. Changes may be lost when you leave.", "端末への保存ができません。ページを離れると変更が失われる場合があります。", "로컬 저장을 사용할 수 없습니다. 페이지를 떠나면 변경 사항이 사라질 수 있습니다.")}</p> : null;
}

export function ReadingActions({ language }: { language: Language }) {
  const navigation = useContext(KnowledgeNavigationContext);
  const session = useContext(LabSessionContext);
  const memory = useReadingMemory();
  const key = navigation?.labTopic ?? navigation?.current;
  const kind = navigation?.labTopic ? "lab" : "topic";
  const visit = memory?.visit;
  useEffect(() => { if (key) visit?.(key, kind); }, [key, kind, visit]);
  if (!key || !memory) return null;
  const saved = memory.data.favorites.includes(key);
  const label = saved ? text(language, "取消收藏", "Remove bookmark", "ブックマークを解除", "북마크 삭제") : text(language, "收藏主题", "Bookmark topic", "トピックを保存", "주제 북마크");
  return <div className="reading-actions">
    <button type="button" className="reading-icon-button" aria-label={label} title={label} aria-pressed={saved} onClick={() => memory.toggle(key)}><Bookmark size={17} fill={saved ? "currentColor" : "none"} aria-hidden="true" /><span>{saved ? text(language, "已收藏", "Bookmarked", "保存済み", "북마크됨") : text(language, "收藏", "Bookmark", "保存", "북마크")}</span></button>
    {session && <button type="button" className="reading-icon-button" onClick={session.reset}><RotateCcw size={16} aria-hidden="true" />{text(language, "恢复实验默认参数", "Reset lab parameters", "実験の設定をリセット", "실험 설정 초기화")}</button>}
    <StorageWarning language={language} />
  </div>;
}

export function ReadingShelf({ language }: { language: Language }) {
  const memory = useReadingMemory();
  const [tab, setTab] = useState<"recent" | "favorites">("recent");
  const [confirmClear, setConfirmClear] = useState(false);
  if (!memory) return null;
  const t = (zh: string, en: string, ja: string, ko: string) => text(language, zh, en, ja, ko);
  const recentLabel = t("最近阅读", "Recently viewed", "最近の閲覧", "최근 열람");
  const favoritesLabel = t("我的收藏", "Bookmarks", "ブックマーク", "북마크");
  const entries = tab === "recent" ? memory.data.recent : memory.data.favorites.map(key => ({ key, kind: "topic" as const }));
  return <section className="reading-shelf" aria-label={t("继续学习", "Continue learning", "学習を続ける", "학습 이어가기")}>
    <div className="reading-shelf-header">
      <div className="reading-tabs" role="group" aria-label={t("阅读记录分类", "Reading collection", "閲覧コレクション", "열람 목록")}>
        <button type="button" aria-pressed={tab === "recent"} onClick={() => setTab("recent")}><History size={16} aria-hidden="true" />{recentLabel}</button>
        <button type="button" aria-pressed={tab === "favorites"} onClick={() => setTab("favorites")}><Bookmark size={16} aria-hidden="true" />{favoritesLabel}</button>
      </div>
      <button type="button" className="reading-icon-button" aria-expanded={confirmClear} title={t("清除本地学习数据", "Clear local learning data", "端末の学習データを削除", "로컬 학습 데이터 삭제")} aria-label={t("清除本地学习数据", "Clear local learning data", "端末の学習データを削除", "로컬 학습 데이터 삭제")} onClick={() => setConfirmClear(!confirmClear)}><Trash2 size={16} aria-hidden="true" /></button>
    </div>
    {confirmClear && <div className="reading-clear-confirm">
      <p>{t("清除最近阅读、收藏和全部实验参数？语言设置不会改变。", "Clear recent visits, bookmarks and all lab parameters? Language settings will remain.", "最近の閲覧・ブックマーク・全実験設定を削除しますか？言語設定は変わりません。", "최근 열람, 북마크 및 모든 실험 설정을 삭제할까요? 언어 설정은 유지됩니다.")}</p>
      <button type="button" onClick={() => { memory.clear(); setConfirmClear(false); }}>{t("确认清除", "Confirm clear", "削除を確定", "삭제 확인")}</button>
      <button type="button" onClick={() => setConfirmClear(false)}>{t("取消", "Cancel", "キャンセル", "취소")}</button>
    </div>}
    <ul className="reading-shelf-list" aria-label={tab === "recent" ? recentLabel : favoritesLabel}>{entries.map(item => {
      const entry = topicRoutes.find(entry => entry.key === item.key);
      if (!entry) return null;
      const remove = t("取消收藏", "Remove bookmark", "ブックマークを解除", "북마크 삭제");
      return <li key={item.key}><a href={topicHref(entry.key, item.kind)}>{entry.topic.title[language]}{item.kind === "lab" && <small>{t("实验室", "Lab", "実験室", "실험실")}</small>}</a>{tab === "favorites" && <button type="button" className="reading-icon-button" aria-label={`${remove}: ${entry.topic.title[language]}`} title={remove} onClick={() => memory.toggle(item.key)}><Bookmark size={15} fill="currentColor" aria-hidden="true" /></button>}</li>;
    })}</ul>
    {!entries.length && <p className="reading-empty">{tab === "recent" ? t("暂无阅读记录", "No recent visits", "閲覧履歴はありません", "최근 열람 기록 없음") : t("暂无收藏", "No bookmarks yet", "ブックマークはありません", "북마크 없음")}</p>}
    <small className="reading-local-note">{t("仅保存在此浏览器，不上传或跨设备同步。", "Stored only in this browser. No upload or cross-device sync.", "このブラウザ内のみ保存。アップロードや端末間同期はありません。", "이 브라우저에만 저장되며 업로드나 기기 간 동기화는 없습니다.")}</small>
    <StorageWarning language={language} />
  </section>;
}
