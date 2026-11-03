import { Github, Home, LibraryBig, NotebookPen } from "lucide-react";
import type { Language } from "../content/knowledge";
import { interfaceCopy } from "../content/knowledge";
import { BackgroundWave } from "./BackgroundWave";
import { LanguageSelect, text } from "../content/language";

type HeaderProps = {
  language: Language;
};

export function Header({ language }: HeaderProps) {

  return (
    <>
      <BackgroundWave />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Audio Technology Sharing">
          <span className="brand-mark">
            <LibraryBig size={20} aria-hidden="true" />
          </span>
          <span>Audio Technology Sharing</span>
        </a>
        <nav className="header-actions" aria-label={text(language, "主导航", "Primary navigation", "メインナビゲーション", "주 탐색 메뉴")}>
          <a href="#welcome" aria-label={text(language, "返回欢迎页", "Back to welcome page", "ようこそページに戻る", "환영 페이지로 돌아가기")} title={text(language, "返回欢迎页", "Back to welcome page", "ようこそページに戻る", "환영 페이지로 돌아가기")}><Home size={18} aria-hidden="true" /></a>
          <a href="#technical-notes">
            <NotebookPen size={18} aria-hidden="true" />
            <span>{text(language, "技术笔记", "Technical notes", "技術ノート", "기술 노트")}</span>
          </a>
          <a href="https://github.com/cpw640530/audio-technology-sharing" rel="noreferrer" target="_blank">
            <Github size={18} aria-hidden="true" />
            <span>{interfaceCopy.navGithub[language]}</span>
          </a>
          <LanguageSelect language={language} />
        </nav>
      </header>
    </>
  );
}
