import { traditional } from "../content/traditional";
import { useState } from "react";
import { ArrowLeft, NotebookPen } from "lucide-react";
import type { Language } from "../content/knowledge";

const sections = [
  { id: "ai", zh: "AI 与模型实践", "zh-Hant": traditional("AI 与模型实践"), en: "AI and models", ja:"AI とモデルの実践", ko:"AI 및 모델 실습", description: { zh: "模型学习、推理部署、量化与实际应用。", "zh-Hant": traditional("模型学习、推理部署、量化与实际应用。"), en: "Model concepts, inference deployment, quantization, and applications.", ja:"モデルの学習、推論の導入、量子化と応用。", ko:"모델 학습, 추론 배포, 양자화 및 응용." } },
  { id: "rf", zh: "RF 与无线技术", "zh-Hant": traditional("RF 与无线技术"), en: "RF and wireless", ja:"RF と無線技術", ko:"RF 및 무선 기술", description: { zh: "射频基础、天线与匹配、无线通信和测试排障。", "zh-Hant": traditional("射频基础、天线与匹配、无线通信和测试排障。"), en: "RF fundamentals, antennas, matching, wireless communication, and troubleshooting.", ja:"RF の基礎、アンテナ、整合、無線通信とトラブル対応。", ko:"RF 기초, 안테나, 정합, 무선 통신 및 문제 해결." } },
  { id: "ha", zh: "HA 智能家居", "zh-Hant": traditional("HA 智能家居"), en: "Home Assistant", ja:"Home Assistant", ko:"Home Assistant", description: { zh: "Home Assistant、设备接入、MQTT、自动化与场景联动。", "zh-Hant": traditional("Home Assistant、设备接入、MQTT、自动化与场景联动。"), en: "Home Assistant, device integration, MQTT, automations, and connected routines.", ja:"Home Assistant、機器の接続、MQTT、自動化と連携。", ko:"Home Assistant, 장치 연동, MQTT, 자동화 및 시나리오 연계." } },
  { id: "agent", zh: "AI Agent", "zh-Hant": traditional("AI Agent"), en: "AI agents", ja:"AI エージェント", ko:"AI 에이전트", description: { zh: "工具调用、RAG、工作流与 Agent 开发实践。", "zh-Hant": traditional("工具调用、RAG、工作流与 Agent 开发实践。"), en: "Tool calling, RAG, workflows, and agent development.", ja:"ツール呼び出し、RAG、ワークフローとエージェント開発。", ko:"도구 호출, RAG, 워크플로 및 에이전트 개발." } },
  { id: "embedded", zh: "嵌入式与开发实践", "zh-Hant": traditional("嵌入式与开发实践"), en: "Embedded development", ja:"組み込み開発", ko:"임베디드 개발", description: { zh: "MCU、Linux、驱动、构建工具和设备调试。", "zh-Hant": traditional("MCU、Linux、驱动、构建工具和设备调试。"), en: "MCUs, Linux, drivers, build tools, and device debugging.", ja:"MCU、Linux、ドライバー、ビルドツールと機器デバッグ。", ko:"MCU, Linux, 드라이버, 빌드 도구 및 장치 디버깅." } }
];

export function TechnicalNotesPage({ language }: { language: Language }) {
  const [selected, setSelected] = useState("all");
  const section = sections.find((item) => item.id === selected);
  return <main className="sound-topic-page technical-notes-page" aria-labelledby="notes-title">
    <header className="sound-topic-hero">
      <a className="sound-topic-back" href="#top"><ArrowLeft size={17} aria-hidden="true" />{({zh:"返回音频知识库", "zh-Hant": traditional("返回音频知识库"),en:"Back to audio knowledge",ja:"オーディオ知識に戻る",ko:"오디오 지식으로 돌아가기"})[language]}</a>
      <div className="sound-topic-kicker"><NotebookPen size={16} aria-hidden="true" />{({zh:"工作实践与学习记录", "zh-Hant": traditional("工作实践与学习记录"),en:"Work and learning notes",ja:"業務と学習の記録",ko:"업무 및 학습 기록"})[language]}</div>
      <h1 id="notes-title">{({zh:"技术笔记", "zh-Hant": traditional("技术笔记"),en:"Technical notes",ja:"技術ノート",ko:"기술 노트"})[language]}</h1>
      <p className="sound-topic-lede">{({zh:"记录工作中接触的技术、项目实践与问题排查。", "zh-Hant": traditional("记录工作中接触的技术、项目实践与问题排查。"),en:"Notes on technologies, projects, and troubleshooting encountered at work.",ja:"業務で扱う技術、プロジェクト、問題解決の記録。",ko:"업무에서 접한 기술, 프로젝트 및 문제 해결을 기록합니다."})[language]}</p>
    </header>
    <section className="sound-topic-section" aria-label={({zh:"笔记分类", "zh-Hant": traditional("笔记分类"),en:"Note categories",ja:"ノートの分類",ko:"노트 분류"})[language]}>
      <div className="category-tabs">
        <button type="button" className={`category-tab${selected === "all" ? " active" : ""}`} aria-pressed={selected === "all"} onClick={() => setSelected("all")}>{({zh:"全部笔记", "zh-Hant": traditional("全部笔记"),en:"All notes",ja:"すべてのノート",ko:"모든 노트"})[language]}</button>
        {sections.map((item) => <button type="button" key={item.id} className={`category-tab${selected === item.id ? " active" : ""}`} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>{item[language]}</button>)}
      </div>
    </section>
    <section className="sound-topic-section" aria-live="polite">
      <h2>{section ? section[language] : ({zh:"全部笔记", "zh-Hant": traditional("全部笔记"),en:"All notes",ja:"すべてのノート",ko:"모든 노트"})[language]}</h2>
      {section && <p>{section.description[language]}</p>}
      <p>{({zh:"暂无已发布笔记。", "zh-Hant": traditional("暂无已发布笔记。"),en:"No published notes yet.",ja:"公開済みのノートはまだありません。",ko:"아직 게시된 노트가 없습니다."})[language]}</p>
    </section>
  </main>;
}
