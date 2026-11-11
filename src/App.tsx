import { RelatedTopics } from "./components/RelatedTopics";
import { KnowledgeGraph } from "./components/KnowledgeGraph";
import { KnowledgeNavigationContext } from "./components/KnowledgeNavigation";
import { LayoutGrid, Network } from "lucide-react";
import { WaveSpectrumPage } from "./components/WaveSpectrumPage";
import { WaveSpectrumLab } from "./components/WaveSpectrumLab";
import { LanguageContext, languageNames, text } from "./content/language";
import { LearningPaths } from "./components/LearningPaths";
import { WelcomePage } from "./components/WelcomePage";
import { WelcomeMusic } from "./components/WelcomeMusic";
import { ReferenceSites } from "./components/ReferenceSites";
import { getTopicKey, type TopicKey } from "./content/relatedTopics";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AiAudioLab } from "./components/AiAudioLab";
import { AiAudioTopicPage } from "./components/AiAudioTopicPage";
import { ApplicationTopicPage } from "./components/ApplicationTopicPage";
import { AlsaLab } from "./components/AlsaLab";
import { AlsaPage } from "./components/AlsaPage";
import { AmplifierSpeakerLab } from "./components/AmplifierSpeakerLab";
import { AudioCodecPage } from "./components/AudioCodecPage";
import { AudioUnitsLab } from "./components/AudioUnitsLab";
import { AudioUnitsPage } from "./components/AudioUnitsPage";
import { AutomotiveAudioLab } from "./components/AutomotiveAudioLab";
import { RobotAudioLab } from "./components/RobotAudioLab";
import { BluetoothAudioLab } from "./components/BluetoothAudioLab";
import { CategoryTabs } from "./components/CategoryTabs";
import { CoreSignalProcessingLab } from "./components/CoreSignalProcessingLab";
import { CoreSignalProcessingPage } from "./components/CoreSignalProcessingPage";
import { DigitalAudioLab } from "./components/DigitalAudioLab";
import { DigitalAudioPage } from "./components/DigitalAudioPage";
import { DigitalInterfaceLab } from "./components/DigitalInterfaceLab";
import { Header } from "./components/Header";
import { HardwareTopicPage } from "./components/HardwareTopicPage";
import { Hero } from "./components/Hero";
import { TechnicalNotesPage } from "./components/TechnicalNotesPage";
import { KnowledgeOutline } from "./components/KnowledgeOutline";
import { ListeningMetricsLab } from "./components/ListeningMetricsLab";
import { ListeningMetricsPage } from "./components/ListeningMetricsPage";
import { MicrophoneLab } from "./components/MicrophoneLab";
import { RealtimeAudioLab } from "./components/RealtimeAudioLab";
import { RealtimeAudioPage } from "./components/RealtimeAudioPage";
import { SearchBar } from "./components/SearchBar";
import { SpeechEnhancementLab } from "./components/SpeechEnhancementLab";
import { SpeechEnhancementPage } from "./components/SpeechEnhancementPage";
import { SoundWaveLab } from "./components/SoundWaveLab";
import { SoundTopicPage } from "./components/SoundTopicPage";
import { SpatialAudioLab } from "./components/SpatialAudioLab";
import { SpatialAudioPage } from "./components/SpatialAudioPage";
import { SystemAudioPage } from "./components/SystemAudioPage";
import { TopicDetails } from "./components/TopicDetails";
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

type DisplayTopic = Topic & {
  category: Category;
};

const languageStorageKey = "audio-technology-language";

function getInitialLanguage(): Language {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLanguage = window.localStorage.getItem(languageStorageKey);

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
    window.localStorage.setItem(languageStorageKey, next);
  }
  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : language;
    document.title = interfaceCopy.title[language];
  }, [language]);
  return <LanguageContext.Provider value={selectLanguage}>
    <AppContent language={language} />
    <aside className="welcome-motion site-music" aria-label={text(language, "背景音乐", "Background music", "BGM", "배경 음악")}>
      <WelcomeMusic language={language} autoplay={autoplayMusic} />
    </aside>
  </LanguageContext.Provider>;
}

function AppContent({ language }: { language: Language }) {
  const [showWelcome, setShowWelcome] = useState(() => ["", "#welcome"].includes(window.location.hash));
  const [showNotes, setShowNotes] = useState(() => window.location.hash === "#technical-notes");
  useEffect(() => {
    const syncNotes = () => {
      if (!["", "#welcome", "#top", "#technical-notes"].includes(window.location.hash)) return;
      setShowWelcome(["", "#welcome"].includes(window.location.hash));
      setShowNotes(window.location.hash === "#technical-notes");
      setActiveView("knowledge");
      setSelectedTopic(null);
      if (!window.navigator.userAgent.toLowerCase().includes("jsdom")) window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("hashchange", syncNotes);
    return () => window.removeEventListener("hashchange", syncNotes);
  }, []);
  const [activeCategory, setActiveCategory] = useState("all");
  const [browseMode, setBrowseMode] = useState<"cards" | "graph">("cards");
  const [activeView, setActiveView] = useState<
    | "knowledge"
    | "hardwareTopicPage"
    | "soundTopicPage"
    | "waveSpectrumPage"
    | "waveSpectrumLab"
    | "audioUnitsPage"
    | "digitalTopicPage"
    | "listeningTopicPage"
    | "soundLab"
    | "audioUnitsLab"
    | "digitalLab"
    | "listeningLab"
    | "automotiveAudioLab"
    | "robotAudioLab"
    | "bluetoothAudioLab"
    | "microphoneLab"
    | "digitalInterfaceLab"
    | "amplifierSpeakerLab"
    | "systemAudioPage"
    | "alsaPage"
    | "alsaLab"
    | "realtimeAudioPage"
    | "realtimeAudioLab"
    | "audioCodecPage"
    | "coreSignalProcessingPage"
    | "coreSignalProcessingLab"
    | "speechEnhancementPage"
    | "speechEnhancementLab"
    | "spatialAudioPage"
    | "spatialAudioLab"
    | "aiAudioPage"
    | "aiAudioLab"
    | "applicationTopicPage"
  >("knowledge");
  const [aiAudioLabId, setAiAudioLabId] = useState<Exclude<AiAudioLabId, "overview">>("event");
  const [query, setQuery] = useState("");

  const [selectedTopic, setSelectedTopic] = useState<DisplayTopic | null>(null);
  const [activeHardwareTopic, setActiveHardwareTopic] = useState<DisplayTopic | null>(null);
  const [activeSoftwareTopic, setActiveSoftwareTopic] = useState<DisplayTopic | null>(null);
  const [activeApplicationTopic, setActiveApplicationTopic] = useState<DisplayTopic | null>(null);

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

  const selectedTopicKey = selectedTopic
    ? `${selectedTopic.category.id}-${selectedTopic.title.en}`
    : undefined;
  const activeSoftwareTopicIndex = activeSoftwareTopic
    ? softwareTopics.findIndex((topic) => topic.title.en === activeSoftwareTopic.title.en)
    : -1;
  const coreSignalProcessingTopic = allTopics.find((topic) => topic.detail.lab?.type === "core-signal-processing");
  const speechEnhancementTopic = allTopics.find((topic) => topic.detail.lab?.type === "speech-enhancement");
  const spatialAudioTopic = allTopics.find((topic) => topic.detail.lab?.type === "spatial-audio");
  const [activeAiTopic, setActiveAiTopic] = useState<DisplayTopic | null>(null);
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
    setSelectedTopic(null);
    setActiveView("knowledge");
  }

  function returnToHardware() {
    setQuery("");
    setActiveCategory("hardware");
    setSelectedTopic(null);
    setActiveHardwareTopic(null);
    setActiveView("knowledge");
  }

  function returnToSoftware() {
    setQuery("");
    setActiveCategory("software");
    setSelectedTopic(null);
    setActiveSoftwareTopic(null);
    setActiveView("knowledge");
  }

  function returnToTraditionalDsp() {
    setQuery("");
    setActiveCategory("dsp");
    setSelectedTopic(null);
    setActiveView("knowledge");
  }

  function openTopic(topic: DisplayTopic) {
    setSelectedTopic(null);
    if (topic.category.id === "hardware") {
      setActiveHardwareTopic(topic);
      setActiveView("hardwareTopicPage");
      return;
    }
    if (topic.category.id === "software") {
      openSoftwareTopic(topic);
      return;
    }
    if (topic.category.id === "ai") {
      setActiveAiTopic(topic);
      setActiveView("aiAudioPage");
      return;
    }
    if (topic.category.id === "applications") {
      setActiveApplicationTopic(topic);
      setActiveView("applicationTopicPage");
      return;
    }
    switch (topic.detail.lab?.type) {
      case "sound-wave": setActiveView("soundTopicPage"); break;
      case "wave-spectrum": setActiveView("waveSpectrumPage"); break;
      case "audio-units": setActiveView("audioUnitsPage"); break;
      case "sampling-quantization": setActiveView("digitalTopicPage"); break;
      case "listening-metrics": setActiveView("listeningTopicPage"); break;
      case "core-signal-processing": setActiveView("coreSignalProcessingPage"); break;
      case "speech-enhancement": setActiveView("speechEnhancementPage"); break;
      case "spatial-audio": setActiveView("spatialAudioPage"); break;
      default: setSelectedTopic(topic);
    }
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
    if (nextTopic) setActiveHardwareTopic(nextTopic);
  }

  function openSoftwareTopic(topic: DisplayTopic) {
    const pageByLab = {
      "system-audio": "systemAudioPage",
      alsa: "alsaPage",
      "realtime-audio": "realtimeAudioPage",
      "audio-codec": "audioCodecPage"
    } as const;
    const topicKey = getTopicKey(topic);
    const page = topicKey ? pageByLab[topicKey as keyof typeof pageByLab] : undefined;

    if (!page) {
      setSelectedTopic(topic);
      return;
    }

    setSelectedTopic(null);
    setActiveSoftwareTopic(topic);
    setActiveView(page);
  }

  function openAdjacentSoftwareTopic(direction: -1 | 1) {
    if (!activeSoftwareTopic) return;
    const currentIndex = softwareTopics.findIndex((topic) => topic.title.en === activeSoftwareTopic.title.en);
    const nextTopic = softwareTopics[currentIndex + direction];
    if (nextTopic) openSoftwareTopic(nextTopic);
  }

  function openAdjacentTraditionalTopic(topic: DisplayTopic, direction: -1 | 1) {
    const currentIndex = traditionalTopicIndex(topic);
    const nextTopic = traditionalTopics[currentIndex + direction];
    if (nextTopic) openTopic(nextTopic);
  }

  function returnToAiAudio() {
    setQuery("");
    setActiveCategory("ai");
    setSelectedTopic(null);
    setActiveAiTopic(null);
    setActiveView("knowledge");
  }

  function openAdjacentAiTopic(direction: -1 | 1) {
    if (!activeAiTopic) return;
    const nextTopic = aiTopics[activeAiTopicIndex + direction];
    if (nextTopic) {
      setActiveAiTopic(nextTopic);
      setActiveView("aiAudioPage");
    }
  }

  function returnToApplications() {
    setQuery("");
    setActiveCategory("applications");
    setSelectedTopic(null);
    setActiveApplicationTopic(null);
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
      setActiveApplicationTopic(nextTopic);
      setActiveView("applicationTopicPage");
    }
  }

  useEffect(() => {
    if (!selectedTopic) {
      return undefined;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedTopic(null);
      }
    }

    document.body.classList.add("details-open");
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("details-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedTopic]);

  const fixedTopicKeys: Record<string, TopicKey> = {
    soundTopicPage: "sound-wave", waveSpectrumPage: "wave-spectrum", digitalTopicPage: "sampling-quantization",
    audioUnitsPage: "audio-units", listeningTopicPage: "listening-metrics", coreSignalProcessingPage: "core-signal-processing",
    speechEnhancementPage: "speech-enhancement", spatialAudioPage: "spatial-audio"
  };
  const currentArticle = activeView === "hardwareTopicPage" ? activeHardwareTopic
    : activeView === "aiAudioPage" ? activeAiTopic
    : activeView === "applicationTopicPage" ? activeApplicationTopic
    : ["systemAudioPage", "alsaPage", "audioCodecPage", "realtimeAudioPage"].includes(activeView) ? activeSoftwareTopic : null;
  const currentTopicKey = fixedTopicKeys[activeView] ?? (currentArticle ? getTopicKey(currentArticle) : undefined);
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
  }, [activeView, currentTopicKey]);

  function renderView() {
  if (showWelcome) {
    return <WelcomePage language={language} />;
  }

  if (showNotes) {
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
            setAiAudioLabId(mode);
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
      <main className={`quartz-home${browseMode === "graph" ? " quartz-home-graph" : ""}`}>
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
        <div className="knowledge-browse-bar" role="group" aria-label={text(language, "浏览方式", "Browse view", "表示方式", "탐색 방식")}>
          <button type="button" aria-pressed={browseMode === "cards"} onClick={() => setBrowseMode("cards")}><LayoutGrid size={17}/>{text(language, "卡片", "Cards", "カード", "카드")}</button>
          <button type="button" aria-pressed={browseMode === "graph"} onClick={() => setBrowseMode("graph")}><Network size={17}/>{text(language, "关系图", "Graph", "グラフ", "그래프")}</button>
        </div>
        <div className={`content-layout${browseMode === "graph" ? " graph-layout" : ""}`} id="knowledge-content">
          <CategoryTabs
            activeCategory={activeCategory}
            categories={categories}
            language={language}
            onSelectCategory={setActiveCategory}
          />
          {browseMode === "graph" ? <KnowledgeGraph topics={visibleTopics} language={language} onOpen={openTopic} onSelectCategory={setActiveCategory}/> : <TopicGrid
            language={language}
            onSelectTopic={openTopic}
            selectedTopicKey={selectedTopicKey}
            topics={visibleTopics}
          />}
          {selectedTopic ? (
            <TopicDetails
              language={language}
              onOpenWaveSpectrumLab={() => { setSelectedTopic(null); setActiveView("waveSpectrumLab"); }}
              onClose={() => setSelectedTopic(null)}
              onOpenAmplifierSpeakerLab={() => {
                setSelectedTopic(null);
                setActiveView("amplifierSpeakerLab");
              }}
              onOpenAlsaLab={() => {
                setSelectedTopic(null);
                setActiveView("alsaLab");
              }}
              onOpenAudioUnitsLab={() => {
                setSelectedTopic(null);
                setActiveView("audioUnitsLab");
              }}
              onOpenAudioUnitsPage={() => {
                setSelectedTopic(null);
                setActiveView("audioUnitsPage");
              }}
              onOpenAutomotiveAudioLab={() => {
                setSelectedTopic(null);
                setActiveView("automotiveAudioLab");
              }}
              onOpenRobotAudioLab={() => {
                setSelectedTopic(null);
                setActiveView("robotAudioLab");
              }}
              onOpenBluetoothAudioLab={() => {
                setSelectedTopic(null);
                setActiveView("bluetoothAudioLab");
              }}
              onOpenAiAudioLab={(initialMode) => {
                if (initialMode === "overview") return;
                setSelectedTopic(null);
                setAiAudioLabId(initialMode ?? "event");
                setActiveView("aiAudioLab");
              }}
              onOpenSoundLab={() => {
                setSelectedTopic(null);
                setActiveView("soundLab");
              }}
              onOpenSoundTopicPage={() => {
                setSelectedTopic(null);
                setActiveView("soundTopicPage");
              }}
              onOpenDigitalLab={() => {
                setSelectedTopic(null);
                setActiveView("digitalLab");
              }}
              onOpenDigitalPage={() => {
                setSelectedTopic(null);
                setActiveView("digitalTopicPage");
              }}
              onOpenDigitalInterfaceLab={() => {
                setSelectedTopic(null);
                setActiveView("digitalInterfaceLab");
              }}
              onOpenListeningMetricsLab={() => {
                setSelectedTopic(null);
                setActiveView("listeningLab");
              }}
              onOpenListeningMetricsPage={() => {
                setSelectedTopic(null);
                setActiveView("listeningTopicPage");
              }}
              onOpenMicrophoneLab={() => {
                setSelectedTopic(null);
                setActiveView("microphoneLab");
              }}
              onOpenRealtimeAudioLab={() => {
                setSelectedTopic(null);
                setActiveView("realtimeAudioLab");
              }}
              onOpenCoreSignalProcessingLab={() => {
                setSelectedTopic(null);
                setActiveView("coreSignalProcessingLab");
              }}
              onOpenSpeechEnhancementLab={() => {
                setSelectedTopic(null);
                setActiveView("speechEnhancementLab");
              }}
              onOpenSpatialAudioLab={() => {
                setSelectedTopic(null);
                setActiveView("spatialAudioLab");
              }}
              topic={selectedTopic}
            />
          ) : null}
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
  return <KnowledgeNavigationContext.Provider value={{ current: currentTopicKey, onOpen: openTopic }}>{renderView()}</KnowledgeNavigationContext.Provider>;
}
