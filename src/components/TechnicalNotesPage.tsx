import { useState } from "react";
import { ArrowLeft, NotebookPen } from "lucide-react";
import type { Language } from "../content/knowledge";

const sections = [
  { id: "ai", zh: "AI 与模型实践", en: "AI and models", description: { zh: "模型学习、推理部署、量化与实际应用。", en: "Model concepts, inference deployment, quantization, and applications." } },
  { id: "rf", zh: "RF 与无线技术", en: "RF and wireless", description: { zh: "射频基础、天线与匹配、无线通信和测试排障。", en: "RF fundamentals, antennas, matching, wireless communication, and troubleshooting." } },
  { id: "ha", zh: "HA 智能家居", en: "Home Assistant", description: { zh: "Home Assistant、设备接入、MQTT、自动化与场景联动。", en: "Home Assistant, device integration, MQTT, automations, and connected routines." } },
  { id: "agent", zh: "AI Agent", en: "AI agents", description: { zh: "工具调用、RAG、工作流与 Agent 开发实践。", en: "Tool calling, RAG, workflows, and agent development." } },
  { id: "embedded", zh: "嵌入式与开发实践", en: "Embedded development", description: { zh: "MCU、Linux、驱动、构建工具和设备调试。", en: "MCUs, Linux, drivers, build tools, and device debugging." } }
];

export function TechnicalNotesPage({ language }: { language: Language }) {
  const [selected, setSelected] = useState("all");
  const section = sections.find((item) => item.id === selected);
  const zh = language === "zh";
  return <main className="sound-topic-page technical-notes-page" aria-labelledby="notes-title">
    <header className="sound-topic-hero">
      <a className="sound-topic-back" href="#top"><ArrowLeft size={17} aria-hidden="true" />{zh ? "返回音频知识库" : "Back to audio knowledge"}</a>
      <div className="sound-topic-kicker"><NotebookPen size={16} aria-hidden="true" />{zh ? "工作实践与学习记录" : "Work and learning notes"}</div>
      <h1 id="notes-title">{zh ? "技术笔记" : "Technical notes"}</h1>
      <p className="sound-topic-lede">{zh ? "记录工作中接触的技术、项目实践与问题排查。" : "Notes on technologies, projects, and troubleshooting encountered at work."}</p>
    </header>
    <section className="sound-topic-section" aria-label={zh ? "笔记分类" : "Note categories"}>
      <div className="category-tabs">
        <button type="button" className={`category-tab${selected === "all" ? " active" : ""}`} aria-pressed={selected === "all"} onClick={() => setSelected("all")}>{zh ? "全部笔记" : "All notes"}</button>
        {sections.map((item) => <button type="button" key={item.id} className={`category-tab${selected === item.id ? " active" : ""}`} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>{item[language]}</button>)}
      </div>
    </section>
    <section className="sound-topic-section" aria-live="polite">
      <h2>{section ? section[language] : zh ? "全部笔记" : "All notes"}</h2>
      {section && <p>{section.description[language]}</p>}
      <p>{zh ? "暂无已发布笔记。" : "No published notes yet."}</p>
    </section>
  </main>;
}
