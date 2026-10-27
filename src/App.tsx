import { RelatedTopics } from "./components/RelatedTopics";
import { ReferenceSites } from "./components/ReferenceSites";
import { getTopicKey, type TopicKey } from "./content/relatedTopics";
import { useEffect, useMemo, useState } from "react";
import { AiAudioLab } from "./components/AiAudioLab";
import { AiAudioTopicPage } from "./components/AiAudioTopicPage";
import { ApplicationTopicPage } from "./components/ApplicationTopicPage";
import { AlsaLab } from "./components/AlsaLab";
import { AlsaPage } from "./components/AlsaPage";
import { AmplifierSpeakerLab } from "./components/AmplifierSpeakerLab";
import { AudioCodecLab } from "./components/AudioCodecLab";
import { AudioCodecPage } from "./components/AudioCodecPage";
import { AudioUnitsLab } from "./components/AudioUnitsLab";
import { AudioUnitsPage } from "./components/AudioUnitsPage";
import { AutomotiveAudioLab } from "./components/AutomotiveAudioLab";
import { RobotAudioLab } from "./components/RobotAudioLab";
import { BluetoothAudioLab } from "./components/BluetoothAudioLab";
import { CategoryTabs } from "./components/CategoryTabs";
import { CodecHardwareLab } from "./components/CodecHardwareLab";
import { CoreSignalProcessingLab } from "./components/CoreSignalProcessingLab";
import { CoreSignalProcessingPage } from "./components/CoreSignalProcessingPage";
import { DigitalAudioLab } from "./components/DigitalAudioLab";
import { DigitalAudioPage } from "./components/DigitalAudioPage";
import { DigitalInterfaceLab } from "./components/DigitalInterfaceLab";
import { Header } from "./components/Header";
import { HardwareTopicPage } from "./components/HardwareTopicPage";
import { Hero } from "./components/Hero";
import { TechnicalNotesPage } from "./components/TechnicalNotesPage";
import { IotContentLab } from "./components/IotContentLab";
import { KnowledgeOutline } from "./components/KnowledgeOutline";
import { ListeningMetricsLab } from "./components/ListeningMetricsLab";
import { ListeningMetricsPage } from "./components/ListeningMetricsPage";
import { MeetingCommunicationLab } from "./components/MeetingCommunicationLab";
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
import { SystemAudioLab } from "./components/SystemAudioLab";
import { SystemAudioPage } from "./components/SystemAudioPage";
import { TopicDetails } from "./components/TopicDetails";
import { getTopicElementId, TopicGrid } from "./components/TopicGrid";
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

  return storedLanguage === "zh" || storedLanguage === "en" ? storedLanguage : "en";
}

function topicMatchesSearch(topic: DisplayTopic, query: string): boolean {
  if (!query.trim()) {
    return true;
  }

  const normalizedQuery = query.trim().toLowerCase();
  const searchableText = [
    topic.category.title.zh,
    topic.category.title.en,
    topic.title.zh,
    topic.title.en,
    topic.summary.zh,
    topic.summary.en,
    topic.detail.explanation.zh,
    topic.detail.explanation.en,
    topic.detail.misconception.zh,
    topic.detail.misconception.en,
    topic.detail.contentDirection.zh,
    topic.detail.contentDirection.en,
    ...topic.bullets.flatMap((bullet) => [bullet.zh, bullet.en]),
    ...topic.detail.keyConcepts.flatMap((concept) => [concept.zh, concept.en]),
    ...(topic.detail.termExplanations?.flatMap((term) => [
      term.name.zh,
      term.name.en,
      term.explanation.zh,
      term.explanation.en
    ]) ?? []),
    ...(topic.detail.diagram
      ? [
          topic.detail.diagram.label.zh,
          topic.detail.diagram.label.en,
          topic.detail.diagram.caption.zh,
          topic.detail.diagram.caption.en
        ]
      : []),
    ...(topic.detail.lab
      ? [
          topic.detail.lab.title.zh,
          topic.detail.lab.title.en,
          topic.detail.lab.description.zh,
          topic.detail.lab.description.en,
          topic.detail.lab.buttonLabel.zh,
          topic.detail.lab.buttonLabel.en
        ]
      : [])
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedQuery);
}

export default function App() {
  const [showNotes, setShowNotes] = useState(() => window.location.hash === "#technical-notes");
  useEffect(() => {
    const syncNotes = () => {
      if (!["", "#top", "#technical-notes"].includes(window.location.hash)) return;
      setShowNotes(window.location.hash === "#technical-notes");
      setActiveView("knowledge");
      if (!window.navigator.userAgent.toLowerCase().includes("jsdom")) window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("hashchange", syncNotes);
    return () => window.removeEventListener("hashchange", syncNotes);
  }, []);
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeView, setActiveView] = useState<
    | "knowledge"
    | "hardwareTopicPage"
    | "soundTopicPage"
    | "audioUnitsPage"
    | "digitalTopicPage"
    | "listeningTopicPage"
    | "soundLab"
    | "audioUnitsLab"
    | "digitalLab"
    | "listeningLab"
    | "meetingCommunicationLab"
    | "automotiveAudioLab"
    | "robotAudioLab"
    | "bluetoothAudioLab"
    | "iotContentLab"
    | "microphoneLab"
    | "codecLab"
    | "digitalInterfaceLab"
    | "amplifierSpeakerLab"
    | "systemAudioPage"
    | "systemAudioLab"
    | "alsaPage"
    | "alsaLab"
    | "audioCodecLab"
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
  const [aiAudioLabId, setAiAudioLabId] = useState<AiAudioLabId>("event");
  const [query, setQuery] = useState("");
  const [outlineTargetId, setOutlineTargetId] = useState<string | null>(null);

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

  function toggleLanguage() {
    setLanguage((current) => {
      const nextLanguage = current === "zh" ? "en" : "zh";
      window.localStorage.setItem(languageStorageKey, nextLanguage);
      return nextLanguage;
    });
  }

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
      case "codec-hardware": setActiveView("codecLab"); break;
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
    const labType = topic.detail.lab?.type;
    const page = labType ? pageByLab[labType as keyof typeof pageByLab] : undefined;

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
      case "meeting-communication": setActiveView("meetingCommunicationLab"); break;
      case "automotive-audio": setActiveView("automotiveAudioLab"); break;
      case "robot-audio": setActiveView("robotAudioLab"); break;
      case "bluetooth-audio": setActiveView("bluetoothAudioLab"); break;
      case "iot-content": setActiveView("iotContentLab"); break;
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

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (!window.navigator.userAgent.toLowerCase().includes("jsdom")) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [activeView, activeHardwareTopic, activeSoftwareTopic, activeAiTopic, activeApplicationTopic]);

  useEffect(() => {
    if (!outlineTargetId) {
      return;
    }

    const target = document.getElementById(outlineTargetId);

    if (!target) {
      return;
    }

    if (!window.navigator.userAgent.toLowerCase().includes("jsdom")) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    target.focus({ preventScroll: true });
    setOutlineTargetId(null);
  }, [outlineTargetId]);

  if (showNotes) {
    return <div className="app-shell">
      <Header language={language} onToggleLanguage={toggleLanguage} />
      <TechnicalNotesPage language={language} />
    </div>;
  }

  if (activeView === "soundLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
          onToggleLanguage={toggleLanguage}
        />
        <SoundWaveLab language={language} onBack={() => setActiveView("knowledge")} onBackToDetails={() => setActiveView("soundTopicPage")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "soundTopicPage") {
    return (
      <div className="app-shell">
        <Header
          language={language}
          onToggleLanguage={toggleLanguage}
        />
        <SoundTopicPage
          relatedTopics={renderRelatedTopics("sound-wave")}
          language={language}
          onBack={returnToFundamentals}
          onOpenLab={() => setActiveView("soundLab")}
          onOpenNext={() => setActiveView("audioUnitsPage")}
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
        <Header language={language} onToggleLanguage={toggleLanguage} />
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
        <Header language={language} onToggleLanguage={toggleLanguage} />
        <AudioUnitsPage
          relatedTopics={renderRelatedTopics("audio-units")}
          language={language}
          onBack={returnToFundamentals}
          onOpenLab={() => setActiveView("audioUnitsLab")}
          onOpenPrevious={() => setActiveView("soundTopicPage")}
          onOpenNext={() => setActiveView("digitalTopicPage")}
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
        <Header language={language} onToggleLanguage={toggleLanguage} />
        <SystemAudioPage
          relatedTopics={renderRelatedTopics(getTopicKey(activeSoftwareTopic))}
          language={language}
          topic={activeSoftwareTopic}
          onBack={returnToSoftware}
          onOpenLab={() => setActiveView("systemAudioLab")}
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
          onToggleLanguage={toggleLanguage}
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
        <Header language={language} onToggleLanguage={toggleLanguage} />
        <DigitalAudioPage
          relatedTopics={renderRelatedTopics("sampling-quantization")}
          language={language}
          onBack={returnToFundamentals}
          onOpenLab={() => setActiveView("digitalLab")}
          onOpenPrevious={() => setActiveView("audioUnitsPage")}
          onOpenNext={() => setActiveView("listeningTopicPage")}
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
          onToggleLanguage={toggleLanguage}
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
        <Header language={language} onToggleLanguage={toggleLanguage} />
        <ListeningMetricsPage
          relatedTopics={renderRelatedTopics("listening-metrics")}
          language={language}
          onBack={returnToFundamentals}
          onOpenLab={() => setActiveView("listeningLab")}
          onOpenPrevious={() => setActiveView("digitalTopicPage")}
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
          onToggleLanguage={toggleLanguage}
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
          onToggleLanguage={toggleLanguage}
        />
        <MicrophoneLab language={language} onBack={returnToHardware} onBackToDetails={activeHardwareTopic ? () => setActiveView("hardwareTopicPage") : undefined} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "meetingCommunicationLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
          onToggleLanguage={toggleLanguage}
        />
        <MeetingCommunicationLab language={language} onBack={returnToApplications} onBackToDetails={backFromApplicationLab} />
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
          onToggleLanguage={toggleLanguage}
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
      <Header language={language} onToggleLanguage={toggleLanguage} />
      <RobotAudioLab language={language} onBack={returnToApplications} onBackToDetails={backFromApplicationLab} />
      <footer className="site-footer"><span>{interfaceCopy.footer[language]}</span></footer>
    </div>;
  }

  if (activeView === "bluetoothAudioLab") {
    return <div className="app-shell">
      <Header language={language} onToggleLanguage={toggleLanguage} />
      <BluetoothAudioLab language={language} onBack={returnToApplications} onBackToDetails={backFromApplicationLab} />
      <footer className="site-footer"><span>{interfaceCopy.footer[language]}</span></footer>
    </div>;
  }

  if (activeView === "iotContentLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
          onToggleLanguage={toggleLanguage}
        />
        <IotContentLab language={language} onBack={returnToApplications} onBackToDetails={backFromApplicationLab} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "codecLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
          onToggleLanguage={toggleLanguage}
        />
        <CodecHardwareLab language={language} onBack={returnToHardware} onBackToDetails={activeHardwareTopic ? () => setActiveView("hardwareTopicPage") : undefined} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "digitalInterfaceLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
          onToggleLanguage={toggleLanguage}
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
          onToggleLanguage={toggleLanguage}
        />
        <AmplifierSpeakerLab language={language} onBack={returnToHardware} onBackToDetails={activeHardwareTopic ? () => setActiveView("hardwareTopicPage") : undefined} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "systemAudioLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
          onToggleLanguage={toggleLanguage}
        />
        <SystemAudioLab language={language} onBack={returnToSoftware} onBackToDetails={() => setActiveView("systemAudioPage")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "alsaPage" && activeSoftwareTopic) {
    return (
      <div className="app-shell">
        <Header language={language} onToggleLanguage={toggleLanguage} />
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
          onToggleLanguage={toggleLanguage}
        />
        <AlsaLab language={language} onBack={returnToSoftware} onBackToDetails={() => setActiveView("alsaPage")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "audioCodecLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
          onToggleLanguage={toggleLanguage}
        />
        <AudioCodecLab language={language} onBack={returnToSoftware} onBackToDetails={() => setActiveView("audioCodecPage")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "realtimeAudioPage" && activeSoftwareTopic) {
    return (
      <div className="app-shell">
        <Header language={language} onToggleLanguage={toggleLanguage} />
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
          onToggleLanguage={toggleLanguage}
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
        <Header language={language} onToggleLanguage={toggleLanguage} />
        <AudioCodecPage
          relatedTopics={renderRelatedTopics(getTopicKey(activeSoftwareTopic))}
          language={language}
          topic={activeSoftwareTopic}
          onBack={returnToSoftware}
          onOpenLab={() => setActiveView("audioCodecLab")}
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
        <Header language={language} onToggleLanguage={toggleLanguage} />
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
          onToggleLanguage={toggleLanguage}
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
        <Header language={language} onToggleLanguage={toggleLanguage} />
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
          onToggleLanguage={toggleLanguage}
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
        <Header language={language} onToggleLanguage={toggleLanguage} />
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
          onToggleLanguage={toggleLanguage}
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
        <Header language={language} onToggleLanguage={toggleLanguage} />
        <AiAudioTopicPage
          relatedTopics={renderRelatedTopics(getTopicKey(activeAiTopic))}
          language={language}
          topic={activeAiTopic}
          mode={mode}
          onBack={returnToAiAudio}
          onOpenLab={() => { setAiAudioLabId(mode); setActiveView("aiAudioLab"); }}
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
          onToggleLanguage={toggleLanguage}
        />
        <AiAudioLab
          labId={aiAudioLabId}
          onOpen={(id) => { setAiAudioLabId(id); window.scrollTo({ top: 0, behavior: "instant" }); }}
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
        <Header language={language} onToggleLanguage={toggleLanguage} />
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
        onToggleLanguage={toggleLanguage}
      />
      <main>
        <Hero language={language} totalTopics={allTopics.length} />
        <div className="content-layout" id="knowledge-content">
          <KnowledgeOutline
            categories={categories}
            language={language}
            onSelectTopic={(category, topic) => {
              setActiveCategory(category.id);
              setQuery("");
              setOutlineTargetId(getTopicElementId(category.id, topic.title.en));
            }}
          />
          <SearchBar language={language} value={query} onChange={setQuery} />
          <CategoryTabs
            activeCategory={activeCategory}
            categories={categories}
            language={language}
            onSelectCategory={setActiveCategory}
          />
          <TopicGrid
            language={language}
            onSelectTopic={openTopic}
            selectedTopicKey={selectedTopicKey}
            topics={visibleTopics}
          />
          {selectedTopic ? (
            <TopicDetails
              language={language}
              onClose={() => setSelectedTopic(null)}
              onOpenAmplifierSpeakerLab={() => {
                setSelectedTopic(null);
                setActiveView("amplifierSpeakerLab");
              }}
              onOpenAlsaLab={() => {
                setSelectedTopic(null);
                setActiveView("alsaLab");
              }}
              onOpenAudioCodecLab={() => {
                setSelectedTopic(null);
                setActiveView("audioCodecLab");
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
              onOpenIotContentLab={() => {
                setSelectedTopic(null);
                setActiveView("iotContentLab");
              }}
              onOpenAiAudioLab={(initialMode) => {
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
              onOpenMeetingCommunicationLab={() => {
                setSelectedTopic(null);
                setActiveView("meetingCommunicationLab");
              }}
              onOpenMicrophoneLab={() => {
                setSelectedTopic(null);
                setActiveView("microphoneLab");
              }}
              onOpenRealtimeAudioLab={() => {
                setSelectedTopic(null);
                setActiveView("realtimeAudioLab");
              }}
              onOpenCodecLab={() => {
                setSelectedTopic(null);
                setActiveView("codecLab");
              }}
              onOpenCoreSignalProcessingLab={() => {
                setSelectedTopic(null);
                setActiveView("coreSignalProcessingLab");
              }}
              onOpenSystemAudioLab={() => {
                setSelectedTopic(null);
                setActiveView("systemAudioLab");
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
        <ReferenceSites language={language} />
      </main>
      <footer className="site-footer">
        <span>{interfaceCopy.footer[language]}</span>
      </footer>
    </div>
  );
}
