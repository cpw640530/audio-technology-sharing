import { RouteBoundary } from "./components/RouteBoundary";
import { ReadingMemoryProvider, ReadingShelf, useReadingMemory } from "./components/ReadingMemory";
import { LabSession } from "./hooks/useLabState";
import { RelatedTopics } from "./components/RelatedTopics";
import { KnowledgeNavigationContext } from "./components/KnowledgeNavigation";
import { LanguageContext, languageNames, text } from "./content/language";
import { LearningPaths } from "./components/LearningPaths";
import { WelcomePage } from "./components/WelcomePage";
import { WelcomeMusic } from "./components/WelcomeMusic";
import { ReferenceSites } from "./components/ReferenceSites";
import { getTopicKey, type TopicKey } from "./content/relatedTopics";
import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CategoryTabs } from "./components/CategoryTabs";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { KnowledgeOutline } from "./components/KnowledgeOutline";
import { SearchBar } from "./components/SearchBar";
import { topicRoutes, topicHref, type TopicView } from "./content/topicRoutes";
import { useHashRoute } from "./hooks/useHashRoute";
import { TopicGrid } from "./components/TopicGrid";
import {
  categories,
  interfaceCopy,
  type Category,
  type AiAudioLabId,
  type Language,
  type Topic
} from "./content/knowledge";
import "./styles.css";

const WaveSpectrumPage = lazy(() => import("./components/WaveSpectrumPage").then(module => ({ default: module.WaveSpectrumPage })));
const WaveSpectrumLab = lazy(() => import("./components/WaveSpectrumLab").then(module => ({ default: module.WaveSpectrumLab })));
const AiAudioLab = lazy(() => import("./components/AiAudioLab").then(module => ({ default: module.AiAudioLab })));
const AiAudioTopicPage = lazy(() => import("./components/AiAudioTopicPage").then(module => ({ default: module.AiAudioTopicPage })));
const ApplicationTopicPage = lazy(() => import("./components/ApplicationTopicPage").then(module => ({ default: module.ApplicationTopicPage })));
const AlsaLab = lazy(() => import("./components/AlsaLab").then(module => ({ default: module.AlsaLab })));
const AlsaPage = lazy(() => import("./components/AlsaPage").then(module => ({ default: module.AlsaPage })));
const AmplifierSpeakerLab = lazy(() => import("./components/AmplifierSpeakerLab").then(module => ({ default: module.AmplifierSpeakerLab })));
const AudioCodecPage = lazy(() => import("./components/AudioCodecPage").then(module => ({ default: module.AudioCodecPage })));
const AudioUnitsLab = lazy(() => import("./components/AudioUnitsLab").then(module => ({ default: module.AudioUnitsLab })));
const AudioUnitsPage = lazy(() => import("./components/AudioUnitsPage").then(module => ({ default: module.AudioUnitsPage })));
const AutomotiveAudioLab = lazy(() => import("./components/AutomotiveAudioLab").then(module => ({ default: module.AutomotiveAudioLab })));
const RobotAudioLab = lazy(() => import("./components/RobotAudioLab").then(module => ({ default: module.RobotAudioLab })));
const BluetoothAudioLab = lazy(() => import("./components/BluetoothAudioLab").then(module => ({ default: module.BluetoothAudioLab })));
const CoreSignalProcessingLab = lazy(() => import("./components/CoreSignalProcessingLab").then(module => ({ default: module.CoreSignalProcessingLab })));
const CoreSignalProcessingPage = lazy(() => import("./components/CoreSignalProcessingPage").then(module => ({ default: module.CoreSignalProcessingPage })));
const DigitalAudioLab = lazy(() => import("./components/DigitalAudioLab").then(module => ({ default: module.DigitalAudioLab })));
const DigitalAudioPage = lazy(() => import("./components/DigitalAudioPage").then(module => ({ default: module.DigitalAudioPage })));
const DigitalInterfaceLab = lazy(() => import("./components/DigitalInterfaceLab").then(module => ({ default: module.DigitalInterfaceLab })));
const HardwareTopicPage = lazy(() => import("./components/HardwareTopicPage").then(module => ({ default: module.HardwareTopicPage })));
const TechnicalNotesPage = lazy(() => import("./components/TechnicalNotesPage").then(module => ({ default: module.TechnicalNotesPage })));
const ListeningMetricsLab = lazy(() => import("./components/ListeningMetricsLab").then(module => ({ default: module.ListeningMetricsLab })));
const ListeningMetricsPage = lazy(() => import("./components/ListeningMetricsPage").then(module => ({ default: module.ListeningMetricsPage })));
const MicrophoneLab = lazy(() => import("./components/MicrophoneLab").then(module => ({ default: module.MicrophoneLab })));
const RealtimeAudioLab = lazy(() => import("./components/RealtimeAudioLab").then(module => ({ default: module.RealtimeAudioLab })));
const RealtimeAudioPage = lazy(() => import("./components/RealtimeAudioPage").then(module => ({ default: module.RealtimeAudioPage })));
const SpeechEnhancementLab = lazy(() => import("./components/SpeechEnhancementLab").then(module => ({ default: module.SpeechEnhancementLab })));
const SpeechEnhancementPage = lazy(() => import("./components/SpeechEnhancementPage").then(module => ({ default: module.SpeechEnhancementPage })));
const SoundWaveLab = lazy(() => import("./components/SoundWaveLab").then(module => ({ default: module.SoundWaveLab })));
const SoundTopicPage = lazy(() => import("./components/SoundTopicPage").then(module => ({ default: module.SoundTopicPage })));
const SpatialAudioLab = lazy(() => import("./components/SpatialAudioLab").then(module => ({ default: module.SpatialAudioLab })));
const SpatialAudioPage = lazy(() => import("./components/SpatialAudioPage").then(module => ({ default: module.SpatialAudioPage })));
const SystemAudioPage = lazy(() => import("./components/SystemAudioPage").then(module => ({ default: module.SystemAudioPage })));

type DisplayTopic = Topic & {
  category: Category;
};

const languageStorageKey = "audio-technology-language";

function getInitialLanguage(): Language {
  if (typeof window === "undefined") {
    return "en";
  }

  let storedLanguage: string | null = null;
  try { storedLanguage = window.localStorage.getItem(languageStorageKey); } catch { return "en"; }

  return storedLanguage && Object.prototype.hasOwnProperty.call(languageNames, storedLanguage) ? storedLanguage as Language : "en";
}

function topicMatchesSearch(topic: DisplayTopic, query: string): boolean {
  if (!query.trim()) {
    return true;
  }

  const normalizedQuery = query.trim().toLowerCase();
  const searchableText = [
    ...[topic.category.title, topic.title, topic.summary, topic.detail.explanation,
      topic.detail.misconception, topic.detail.contentDirection,
      ...topic.bullets, ...topic.detail.keyConcepts].flatMap(value => Object.values(value)),
    ...(topic.detail.termExplanations?.flatMap(term => [...Object.values(term.name), ...Object.values(term.explanation)]) ?? []),
    ...(topic.detail.diagram
      ? [
          ...Object.values(topic.detail.diagram.label),
          ...Object.values(topic.detail.diagram.caption)
        ]
      : []),
    ...(topic.detail.lab
      ? [
          ...Object.values(topic.detail.lab.title),
          ...Object.values(topic.detail.lab.description),
          ...Object.values(topic.detail.lab.buttonLabel)
        ]
      : [])
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedQuery);
}

export default function App() {
  const [autoplayMusic] = useState(() => ["", "#welcome"].includes(window.location.hash));
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  function selectLanguage(next: Language) {
    setLanguage(next);
    try { window.localStorage.setItem(languageStorageKey, next); } catch { /* Language still changes for this session. */ }
  }
  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : language;
  }, [language]);
  return <LanguageContext.Provider value={selectLanguage}><ReadingMemoryProvider>
    <AppContent language={language} />
    <aside className="welcome-motion site-music" aria-label={text(language, "背景音乐", "Background music", "BGM", "배경 음악")}>
      <WelcomeMusic language={language} autoplay={autoplayMusic} />
    </aside>
  </ReadingMemoryProvider></LanguageContext.Provider>;
}

function AppContent({ language }: { language: Language }) {
  const readingMemory = useReadingMemory();
  const { route, navigate } = useHashRoute();
  const entry = "entry" in route ? route.entry : undefined;
  const activeView: TopicView = route.kind === "topic" ? route.entry.articleView
    : route.kind === "lab" ? route.entry.labView! : "knowledge";
  const activeTopic = entry?.topic ?? null;
  const activeHardwareTopic = activeTopic?.category.id === "hardware" ? activeTopic : null;
  const activeSoftwareTopic = activeTopic?.category.id === "software" ? activeTopic : null;
  const activeApplicationTopic = activeTopic?.category.id === "applications" ? activeTopic : null;
  const activeAiTopic = activeTopic?.category.id === "ai" ? activeTopic : null;
  const aiAudioLabId = (activeAiTopic?.detail.lab?.initialMode ?? "event") as Exclude<AiAudioLabId, "overview">;
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");

  function setActiveView(view: TopicView) {
    if (view === "knowledge") { navigate("#top"); return; }
    const target = entry && (entry.articleView === view || entry.labView === view) ? entry
      : topicRoutes.find(item => item.articleView === view || item.labView === view);
    if (target) navigate(topicHref(target.key, target.labView === view ? "lab" : "topic"));
  }

  useEffect(() => {
    document.title = activeTopic ? `${activeTopic.title[language]} | ${interfaceCopy.title[language]}` : interfaceCopy.title[language];
  }, [activeTopic, language]);

  const allTopics = useMemo<DisplayTopic[]>(
    () =>
      categories.flatMap((category) =>
        category.topics.map((topic) => ({
          ...topic,
          category
        }))
      ),
    []
  );

  const visibleTopics = useMemo(
    () =>
      allTopics.filter((topic) => {
        const inCategory = activeCategory === "all" || topic.category.id === activeCategory;
        return inCategory && topicMatchesSearch(topic, query);
      }),
    [activeCategory, allTopics, query]
  );

  const hardwareTopics = useMemo(
    () => allTopics.filter((topic) => topic.category.id === "hardware"),
    [allTopics]
  );

  const softwareTopics = useMemo(
    () => allTopics.filter((topic) => topic.category.id === "software"),
    [allTopics]
  );

  const aiTopics = useMemo(
    () => allTopics.filter((topic) => topic.category.id === "ai"),
    [allTopics]
  );

  const applicationTopics = useMemo(
    () => allTopics.filter((topic) => topic.category.id === "applications"),
    [allTopics]
  );

  const traditionalTopics = useMemo(
    () => allTopics.filter((topic) => topic.category.id === "dsp"),
    [allTopics]
  );

  const activeSoftwareTopicIndex = activeSoftwareTopic
    ? softwareTopics.findIndex((topic) => topic.title.en === activeSoftwareTopic.title.en)
    : -1;
  const coreSignalProcessingTopic = allTopics.find((topic) => topic.detail.lab?.type === "core-signal-processing");
  const speechEnhancementTopic = allTopics.find((topic) => topic.detail.lab?.type === "speech-enhancement");
  const spatialAudioTopic = allTopics.find((topic) => topic.detail.lab?.type === "spatial-audio");
  const activeAiTopicIndex = activeAiTopic
    ? aiTopics.findIndex((topic) => topic.title.en === activeAiTopic.title.en)
    : -1;
  const activeApplicationTopicIndex = activeApplicationTopic
    ? applicationTopics.findIndex((topic) => topic.title.en === activeApplicationTopic.title.en)
    : -1;
  const traditionalTopicIndex = (topic: DisplayTopic | undefined) =>
    topic ? traditionalTopics.findIndex((item) => item.title.en === topic.title.en) : -1;

  function returnToFundamentals() {
    setQuery("");
    setActiveCategory("fundamentals");
    setActiveView("knowledge");
  }

  function returnToHardware() {
    setQuery("");
    setActiveCategory("hardware");
    setActiveView("knowledge");
  }

  function returnToSoftware() {
    setQuery("");
    setActiveCategory("software");
    setActiveView("knowledge");
  }

  function returnToTraditionalDsp() {
    setQuery("");
    setActiveCategory("dsp");
    setActiveView("knowledge");
  }

  function openTopic(topic: DisplayTopic) {
    navigate(topicHref(topic));
  }

  function renderRelatedTopics(topicKey: TopicKey | undefined) {
    return topicKey ? <RelatedTopics topicKey={topicKey} language={language} onOpen={openTopic} /> : null;
  }

  function openHardwareLab() {
    switch (activeHardwareTopic?.detail.lab?.type) {
      case "microphone": setActiveView("microphoneLab"); break;
      case "digital-interface": setActiveView("digitalInterfaceLab"); break;
      case "amplifier-speaker": setActiveView("amplifierSpeakerLab"); break;
      default: returnToHardware();
    }
  }

  function openAdjacentHardwareTopic(direction: -1 | 1) {
    if (!activeHardwareTopic) return;
    const currentIndex = hardwareTopics.findIndex((topic) => topic.title.en === activeHardwareTopic.title.en);
    const nextTopic = hardwareTopics[currentIndex + direction];
    if (nextTopic) openTopic(nextTopic);
  }

  function openAdjacentSoftwareTopic(direction: -1 | 1) {
    if (!activeSoftwareTopic) return;
    const currentIndex = softwareTopics.findIndex((topic) => topic.title.en === activeSoftwareTopic.title.en);
    const nextTopic = softwareTopics[currentIndex + direction];
    if (nextTopic) openTopic(nextTopic);
  }

  function openAdjacentTraditionalTopic(topic: DisplayTopic, direction: -1 | 1) {
    const currentIndex = traditionalTopicIndex(topic);
    const nextTopic = traditionalTopics[currentIndex + direction];
    if (nextTopic) openTopic(nextTopic);
  }

  function returnToAiAudio() {
    setQuery("");
    setActiveCategory("ai");
    setActiveView("knowledge");
  }

  function openAdjacentAiTopic(direction: -1 | 1) {
    if (!activeAiTopic) return;
    const nextTopic = aiTopics[activeAiTopicIndex + direction];
    if (nextTopic) {
      openTopic(nextTopic);
    }
  }

  function returnToApplications() {
    setQuery("");
    setActiveCategory("applications");
    setActiveView("knowledge");
  }

  function openApplicationLab() {
    switch (activeApplicationTopic?.detail.lab?.type) {
      case "automotive-audio": setActiveView("automotiveAudioLab"); break;
      case "robot-audio": setActiveView("robotAudioLab"); break;
      case "bluetooth-audio": setActiveView("bluetoothAudioLab"); break;
      default: returnToApplications();
    }
  }

  function backFromApplicationLab() {
    if (activeApplicationTopic) {
      setActiveView("applicationTopicPage");
    } else {
      returnToApplications();
    }
  }

  function openAdjacentApplicationTopic(direction: -1 | 1) {
    const nextTopic = applicationTopics[activeApplicationTopicIndex + direction];
    if (nextTopic) {
      openTopic(nextTopic);
    }
  }

  const currentTopicKey = route.kind === "topic" ? route.entry.key : undefined;
  const previousView = useRef(activeView);
  const readingPosition = useRef<{ key: TopicKey; top: number } | null>(null);

  useLayoutEffect(() => {
    const saved = readingPosition.current;
    const top = previousView.current.endsWith("Lab") && currentTopicKey && saved?.key === currentTopicKey ? saved.top : 0;
    previousView.current = activeView;
    document.documentElement.scrollTop = top;
    document.body.scrollTop = top;
    if (!window.navigator.userAgent.toLowerCase().includes("jsdom")) {
      window.scrollTo({ top, left: 0, behavior: "instant" });
    }
    if (!currentTopicKey) return;
    readingPosition.current = { key: currentTopicKey, top };
    const savePosition = () => { readingPosition.current = { key: currentTopicKey, top: window.scrollY }; };
    window.addEventListener("scroll", savePosition, { passive: true });
    return () => window.removeEventListener("scroll", savePosition);
  }, [activeView, currentTopicKey, route.kind]);

  function renderView() {
  if (route.kind === "missing") {
    return <div className="app-shell"><Header language={language} /><main className="sound-topic-page">
      <h1>{text(language, "页面不存在", "Page not found", "ページが見つかりません", "페이지를 찾을 수 없습니다")}</h1>
      <a href="#top">{text(language, "返回知识库", "Back to knowledge base", "知識ベースに戻る", "지식 베이스로 돌아가기")}</a>
    </main></div>;
  }
  if (route.kind === "welcome") {
    return <WelcomePage language={language} />;
  }

  if (route.kind === "notes") {
    return <div className="app-shell">
      <Header language={language} />
      <TechnicalNotesPage language={language} />
    </div>;
  }

  if (activeView === "soundLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
        />
        <SoundWaveLab language={language} onBack={() => setActiveView("knowledge")} onBackToDetails={() => setActiveView("soundTopicPage")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "waveSpectrumPage" || activeView === "waveSpectrumLab") {
    return <div className="app-shell">
      <Header language={language} />
      {activeView === "waveSpectrumPage"
        ? <WaveSpectrumPage language={language} onBack={returnToFundamentals} onPrevious={() => setActiveView("soundTopicPage")} onNext={() => setActiveView("digitalTopicPage")} onOpenLab={() => setActiveView("waveSpectrumLab")} relatedTopics={renderRelatedTopics("wave-spectrum")} />
        : <WaveSpectrumLab language={language} onBack={returnToFundamentals} onBackToDetails={() => setActiveView("waveSpectrumPage")} />}
      <footer className="site-footer"><span>{interfaceCopy.footer[language]}</span></footer>
    </div>;
  }

  if (activeView === "soundTopicPage") {
    return (
      <div className="app-shell">
        <Header
          language={language}
        />
        <SoundTopicPage
          relatedTopics={renderRelatedTopics("sound-wave")}
          language={language}
          onBack={returnToFundamentals}
          onOpenLab={() => setActiveView("soundLab")}
          onOpenNext={() => setActiveView("waveSpectrumPage")}
        />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "hardwareTopicPage" && activeHardwareTopic) {
    const hardwareIndex = hardwareTopics.findIndex((topic) => topic.title.en === activeHardwareTopic.title.en);

    return (
      <div className="app-shell">
        <Header language={language} />
        <HardwareTopicPage
          relatedTopics={renderRelatedTopics(getTopicKey(activeHardwareTopic))}
          language={language}
          topic={activeHardwareTopic}
          onBack={returnToHardware}
          onOpenLab={openHardwareLab}
          onOpenPrevious={hardwareIndex > 0 ? () => openAdjacentHardwareTopic(-1) : undefined}
          onOpenNext={hardwareIndex < hardwareTopics.length - 1 ? () => openAdjacentHardwareTopic(1) : undefined}
        />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "audioUnitsPage") {
    return (
      <div className="app-shell">
        <Header language={language} />
        <AudioUnitsPage
          relatedTopics={renderRelatedTopics("audio-units")}
          language={language}
          onBack={returnToFundamentals}
          onOpenLab={() => setActiveView("audioUnitsLab")}
          onOpenPrevious={() => setActiveView("digitalTopicPage")}
          onOpenNext={() => setActiveView("listeningTopicPage")}
        />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "systemAudioPage" && activeSoftwareTopic) {
    return (
      <div className="app-shell">
        <Header language={language} />
        <SystemAudioPage
          relatedTopics={renderRelatedTopics(getTopicKey(activeSoftwareTopic))}
          language={language}
          topic={activeSoftwareTopic}
          onBack={returnToSoftware}
          onOpenPrevious={activeSoftwareTopicIndex > 0 ? () => openAdjacentSoftwareTopic(-1) : undefined}
          onOpenNext={activeSoftwareTopicIndex < softwareTopics.length - 1 ? () => openAdjacentSoftwareTopic(1) : undefined}
        />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "audioUnitsLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
        />
        <AudioUnitsLab language={language} onBack={() => setActiveView("knowledge")} onBackToDetails={() => setActiveView("audioUnitsPage")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "digitalTopicPage") {
    return (
      <div className="app-shell">
        <Header language={language} />
        <DigitalAudioPage
          relatedTopics={renderRelatedTopics("sampling-quantization")}
          language={language}
          onBack={returnToFundamentals}
          onOpenLab={() => setActiveView("digitalLab")}
          onOpenPrevious={() => setActiveView("waveSpectrumPage")}
          onOpenNext={() => setActiveView("audioUnitsPage")}
        />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "digitalLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
        />
        <DigitalAudioLab language={language} onBack={() => setActiveView("knowledge")} onBackToDetails={() => setActiveView("digitalTopicPage")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "listeningTopicPage") {
    return (
      <div className="app-shell">
        <Header language={language} />
        <ListeningMetricsPage
          relatedTopics={renderRelatedTopics("listening-metrics")}
          language={language}
          onBack={returnToFundamentals}
          onOpenLab={() => setActiveView("listeningLab")}
          onOpenPrevious={() => setActiveView("audioUnitsPage")}
        />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "listeningLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
        />
        <ListeningMetricsLab language={language} onBack={() => setActiveView("knowledge")} onBackToDetails={() => setActiveView("listeningTopicPage")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "microphoneLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
        />
        <MicrophoneLab language={language} onBack={returnToHardware} onBackToDetails={activeHardwareTopic ? () => setActiveView("hardwareTopicPage") : undefined} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "automotiveAudioLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
        />
        <AutomotiveAudioLab language={language} onBack={returnToApplications} onBackToDetails={backFromApplicationLab} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "robotAudioLab") {
    return <div className="app-shell">
      <Header language={language} />
      <RobotAudioLab language={language} onBack={returnToApplications} onBackToDetails={backFromApplicationLab} />
      <footer className="site-footer"><span>{interfaceCopy.footer[language]}</span></footer>
    </div>;
  }

  if (activeView === "bluetoothAudioLab") {
    return <div className="app-shell">
      <Header language={language} />
      <BluetoothAudioLab language={language} onBack={returnToApplications} onBackToDetails={backFromApplicationLab} />
      <footer className="site-footer"><span>{interfaceCopy.footer[language]}</span></footer>
    </div>;
  }

  if (activeView === "digitalInterfaceLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
        />
        <DigitalInterfaceLab language={language} onBack={returnToHardware} onBackToDetails={activeHardwareTopic ? () => setActiveView("hardwareTopicPage") : undefined} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "amplifierSpeakerLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
        />
        <AmplifierSpeakerLab language={language} onBack={returnToHardware} onBackToDetails={activeHardwareTopic ? () => setActiveView("hardwareTopicPage") : undefined} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "alsaPage" && activeSoftwareTopic) {
    return (
      <div className="app-shell">
        <Header language={language} />
        <AlsaPage
          relatedTopics={renderRelatedTopics(getTopicKey(activeSoftwareTopic))}
          language={language}
          topic={activeSoftwareTopic}
          onBack={returnToSoftware}
          onOpenLab={() => setActiveView("alsaLab")}
          onOpenPrevious={activeSoftwareTopicIndex > 0 ? () => openAdjacentSoftwareTopic(-1) : undefined}
          onOpenNext={activeSoftwareTopicIndex < softwareTopics.length - 1 ? () => openAdjacentSoftwareTopic(1) : undefined}
        />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "alsaLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
        />
        <AlsaLab language={language} onBack={returnToSoftware} onBackToDetails={() => setActiveView("alsaPage")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "realtimeAudioPage" && activeSoftwareTopic) {
    return (
      <div className="app-shell">
        <Header language={language} />
        <RealtimeAudioPage
          relatedTopics={renderRelatedTopics(getTopicKey(activeSoftwareTopic))}
          language={language}
          topic={activeSoftwareTopic}
          onBack={returnToSoftware}
          onOpenLab={() => setActiveView("realtimeAudioLab")}
          onOpenPrevious={activeSoftwareTopicIndex > 0 ? () => openAdjacentSoftwareTopic(-1) : undefined}
          onOpenNext={activeSoftwareTopicIndex < softwareTopics.length - 1 ? () => openAdjacentSoftwareTopic(1) : undefined}
        />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "realtimeAudioLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
        />
        <RealtimeAudioLab language={language} onBack={returnToSoftware} onBackToDetails={() => setActiveView("realtimeAudioPage")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "audioCodecPage" && activeSoftwareTopic) {
    return (
      <div className="app-shell">
        <Header language={language} />
        <AudioCodecPage
          relatedTopics={renderRelatedTopics(getTopicKey(activeSoftwareTopic))}
          language={language}
          topic={activeSoftwareTopic}
          onBack={returnToSoftware}
          onOpenPrevious={activeSoftwareTopicIndex > 0 ? () => openAdjacentSoftwareTopic(-1) : undefined}
          onOpenNext={activeSoftwareTopicIndex < softwareTopics.length - 1 ? () => openAdjacentSoftwareTopic(1) : undefined}
        />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "coreSignalProcessingPage" && coreSignalProcessingTopic) {
    return (
      <div className="app-shell">
        <Header language={language} />
        <CoreSignalProcessingPage
          relatedTopics={renderRelatedTopics("core-signal-processing")}
          language={language}
          topic={coreSignalProcessingTopic}
          onBack={returnToTraditionalDsp}
          onOpenLab={() => setActiveView("coreSignalProcessingLab")}
          onOpenNext={traditionalTopics[traditionalTopicIndex(coreSignalProcessingTopic) + 1] ? () => openAdjacentTraditionalTopic(coreSignalProcessingTopic, 1) : undefined}
        />
        <footer className="site-footer"><span>{interfaceCopy.footer[language]}</span></footer>
      </div>
    );
  }

  if (activeView === "coreSignalProcessingLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
        />
        <CoreSignalProcessingLab
          language={language}
          onBack={returnToTraditionalDsp}
          onBackToDetails={() => setActiveView("coreSignalProcessingPage")}
        />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "speechEnhancementPage" && speechEnhancementTopic) {
    return (
      <div className="app-shell">
        <Header language={language} />
        <SpeechEnhancementPage
          relatedTopics={renderRelatedTopics("speech-enhancement")}
          language={language}
          topic={speechEnhancementTopic}
          onBack={returnToTraditionalDsp}
          onOpenLab={() => setActiveView("speechEnhancementLab")}
          onOpenPrevious={() => openAdjacentTraditionalTopic(speechEnhancementTopic, -1)}
          onOpenNext={() => openAdjacentTraditionalTopic(speechEnhancementTopic, 1)}
        />
        <footer className="site-footer"><span>{interfaceCopy.footer[language]}</span></footer>
      </div>
    );
  }

  if (activeView === "speechEnhancementLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
        />
        <SpeechEnhancementLab language={language} onBack={returnToTraditionalDsp} onBackToDetails={() => setActiveView("speechEnhancementPage")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "spatialAudioPage" && spatialAudioTopic) {
    return (
      <div className="app-shell">
        <Header language={language} />
        <SpatialAudioPage
          relatedTopics={renderRelatedTopics("spatial-audio")}
          language={language}
          topic={spatialAudioTopic}
          onBack={returnToTraditionalDsp}
          onOpenLab={() => setActiveView("spatialAudioLab")}
          onOpenPrevious={() => openAdjacentTraditionalTopic(spatialAudioTopic, -1)}
        />
        <footer className="site-footer"><span>{interfaceCopy.footer[language]}</span></footer>
      </div>
    );
  }

  if (activeView === "spatialAudioLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
        />
        <SpatialAudioLab language={language} onBack={returnToTraditionalDsp} onBackToDetails={() => setActiveView("spatialAudioPage")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "aiAudioPage" && activeAiTopic) {
    const mode = activeAiTopic.detail.lab?.initialMode ?? "overview";
    return (
      <div className="app-shell">
        <Header language={language} />
        <AiAudioTopicPage
          relatedTopics={renderRelatedTopics(getTopicKey(activeAiTopic))}
          language={language}
          topic={activeAiTopic}
          mode={mode}
          onBack={returnToAiAudio}
          onOpenTopic={(id) => {
            const topic = aiTopics.find(topic => topic.detail.lab?.initialMode === id);
            if (topic) {
              openTopic(topic);
              window.scrollTo({ top: 0, behavior: "instant" });
            }
          }}
          onOpenLab={() => {
            if (mode === "overview") return;
            setActiveView("aiAudioLab");
          }}
          onOpenPrevious={activeAiTopicIndex > 0 ? () => openAdjacentAiTopic(-1) : undefined}
          onOpenNext={activeAiTopicIndex < aiTopics.length - 1 ? () => openAdjacentAiTopic(1) : undefined}
        />
        <footer className="site-footer"><span>{interfaceCopy.footer[language]}</span></footer>
      </div>
    );
  }

  if (activeView === "aiAudioLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
        />
        <AiAudioLab
          labId={aiAudioLabId}
          language={language}
          onBack={returnToAiAudio}
          onBackToDetails={() => setActiveView("aiAudioPage")}
        />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "applicationTopicPage" && activeApplicationTopic) {
    return (
      <div className="app-shell">
        <Header language={language} />
        <ApplicationTopicPage
          relatedTopics={renderRelatedTopics(getTopicKey(activeApplicationTopic))}
          language={language}
          topic={activeApplicationTopic}
          onBack={returnToApplications}
          onOpenLab={openApplicationLab}
          onOpenPrevious={activeApplicationTopicIndex > 0 ? () => openAdjacentApplicationTopic(-1) : undefined}
          onOpenNext={activeApplicationTopicIndex < applicationTopics.length - 1 ? () => openAdjacentApplicationTopic(1) : undefined}
        />
        <footer className="site-footer"><span>{interfaceCopy.footer[language]}</span></footer>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header
        language={language}
      />
      <main className="quartz-home">
        <aside className="quartz-home-sidebar">
          <SearchBar language={language} value={query} onChange={setQuery} />
          <KnowledgeOutline
            categories={categories}
            language={language}
            onSelectTopic={(category, topic) => {
              setActiveCategory(category.id);
              setQuery("");
              openTopic({ ...topic, category });
            }}
          />
        </aside>
        <div className="quartz-home-main">
        <Hero language={language} totalTopics={allTopics.length} />
        <ReadingShelf language={language} />
        <div className="content-layout" id="knowledge-content">
          <CategoryTabs
            activeCategory={activeCategory}
            categories={categories}
            language={language}
            onSelectCategory={setActiveCategory}
          />
          <TopicGrid
            language={language}
            onSelectTopic={openTopic}
            topics={visibleTopics}
          />
        </div>
        </div>
        <aside className="quartz-home-right"><LearningPaths language={language} onOpen={openTopic}/></aside>
        <ReferenceSites language={language} />
      </main>
      <footer className="site-footer">
        <span>{interfaceCopy.footer[language]}</span>
      </footer>
    </div>
  );
  }
  return <KnowledgeNavigationContext.Provider value={{ current: currentTopicKey, labTopic: route.kind === "lab" ? route.entry.key : undefined, onOpen: openTopic }}><RouteBoundary key={window.location.hash} language={language}><Suspense fallback={<p className="route-loading" role="status">{text(language, "正在加载内容…", "Loading content…", "読み込み中…", "콘텐츠 로딩 중…")}</p>}>{route.kind === "lab" && readingMemory ? <LabSession key={route.entry.key} topic={route.entry.key} onError={readingMemory.reportError}>{renderView()}</LabSession> : renderView()}</Suspense></RouteBoundary></KnowledgeNavigationContext.Provider>;
}
