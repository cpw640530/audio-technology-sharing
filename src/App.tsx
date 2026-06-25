import { useEffect, useMemo, useState } from "react";
import { AiAudioLab } from "./components/AiAudioLab";
import { AmplifierSpeakerLab } from "./components/AmplifierSpeakerLab";
import { AudioCodecLab } from "./components/AudioCodecLab";
import { AudioUnitsLab } from "./components/AudioUnitsLab";
import { AutomotiveAudioLab } from "./components/AutomotiveAudioLab";
import { CategoryTabs } from "./components/CategoryTabs";
import { CodecHardwareLab } from "./components/CodecHardwareLab";
import { CoreSignalProcessingLab } from "./components/CoreSignalProcessingLab";
import { DigitalAudioLab } from "./components/DigitalAudioLab";
import { DigitalInterfaceLab } from "./components/DigitalInterfaceLab";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { IotContentLab } from "./components/IotContentLab";
import { KnowledgeOutline } from "./components/KnowledgeOutline";
import { ListeningMetricsLab } from "./components/ListeningMetricsLab";
import { MeetingCommunicationLab } from "./components/MeetingCommunicationLab";
import { MicrophoneLab } from "./components/MicrophoneLab";
import { RealtimeAudioLab } from "./components/RealtimeAudioLab";
import { SearchBar } from "./components/SearchBar";
import { SpeechEnhancementLab } from "./components/SpeechEnhancementLab";
import { SoundWaveLab } from "./components/SoundWaveLab";
import { SpatialAudioLab } from "./components/SpatialAudioLab";
import { SystemAudioLab } from "./components/SystemAudioLab";
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
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeView, setActiveView] = useState<
    | "knowledge"
    | "soundLab"
    | "audioUnitsLab"
    | "digitalLab"
    | "listeningLab"
    | "meetingCommunicationLab"
    | "automotiveAudioLab"
    | "iotContentLab"
    | "microphoneLab"
    | "codecLab"
    | "digitalInterfaceLab"
    | "amplifierSpeakerLab"
    | "systemAudioLab"
    | "audioCodecLab"
    | "realtimeAudioLab"
    | "coreSignalProcessingLab"
    | "speechEnhancementLab"
    | "spatialAudioLab"
    | "aiAudioLab"
  >("knowledge");
  const [aiAudioLabId, setAiAudioLabId] = useState<AiAudioLabId>("event");
  const [query, setQuery] = useState("");

  const [selectedTopic, setSelectedTopic] = useState<DisplayTopic | null>(null);

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

  const selectedTopicKey = selectedTopic
    ? `${selectedTopic.category.id}-${selectedTopic.title.en}`
    : undefined;

  function toggleLanguage() {
    setLanguage((current) => {
      const nextLanguage = current === "zh" ? "en" : "zh";
      window.localStorage.setItem(languageStorageKey, nextLanguage);
      return nextLanguage;
    });
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
  }, [activeView]);

  if (activeView === "soundLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
          onToggleLanguage={toggleLanguage}
        />
        <SoundWaveLab language={language} onBack={() => setActiveView("knowledge")} />
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
        <AudioUnitsLab language={language} onBack={() => setActiveView("knowledge")} />
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
        <DigitalAudioLab language={language} onBack={() => setActiveView("knowledge")} />
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
        <ListeningMetricsLab language={language} onBack={() => setActiveView("knowledge")} />
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
        <MicrophoneLab language={language} onBack={() => setActiveView("knowledge")} />
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
        <MeetingCommunicationLab language={language} onBack={() => setActiveView("knowledge")} />
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
        <AutomotiveAudioLab language={language} onBack={() => setActiveView("knowledge")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
      </div>
    );
  }

  if (activeView === "iotContentLab") {
    return (
      <div className="app-shell">
        <Header
          language={language}
          onToggleLanguage={toggleLanguage}
        />
        <IotContentLab language={language} onBack={() => setActiveView("knowledge")} />
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
        <CodecHardwareLab language={language} onBack={() => setActiveView("knowledge")} />
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
        <DigitalInterfaceLab language={language} onBack={() => setActiveView("knowledge")} />
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
        <AmplifierSpeakerLab language={language} onBack={() => setActiveView("knowledge")} />
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
        <SystemAudioLab language={language} onBack={() => setActiveView("knowledge")} />
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
        <AudioCodecLab language={language} onBack={() => setActiveView("knowledge")} />
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
        <RealtimeAudioLab language={language} onBack={() => setActiveView("knowledge")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
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
        <CoreSignalProcessingLab language={language} onBack={() => setActiveView("knowledge")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
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
        <SpeechEnhancementLab language={language} onBack={() => setActiveView("knowledge")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
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
        <SpatialAudioLab language={language} onBack={() => setActiveView("knowledge")} />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
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
          language={language}
          onBack={() => setActiveView("knowledge")}
        />
        <footer className="site-footer">
          <span>{interfaceCopy.footer[language]}</span>
        </footer>
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
        <div className="content-layout">
          <KnowledgeOutline categories={categories} language={language} />
          <SearchBar language={language} value={query} onChange={setQuery} />
          <CategoryTabs
            activeCategory={activeCategory}
            categories={categories}
            language={language}
            onSelectCategory={setActiveCategory}
          />
          <TopicGrid
            language={language}
            onSelectTopic={setSelectedTopic}
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
              onOpenAudioCodecLab={() => {
                setSelectedTopic(null);
                setActiveView("audioCodecLab");
              }}
              onOpenAudioUnitsLab={() => {
                setSelectedTopic(null);
                setActiveView("audioUnitsLab");
              }}
              onOpenAutomotiveAudioLab={() => {
                setSelectedTopic(null);
                setActiveView("automotiveAudioLab");
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
              onOpenDigitalLab={() => {
                setSelectedTopic(null);
                setActiveView("digitalLab");
              }}
              onOpenDigitalInterfaceLab={() => {
                setSelectedTopic(null);
                setActiveView("digitalInterfaceLab");
              }}
              onOpenListeningMetricsLab={() => {
                setSelectedTopic(null);
                setActiveView("listeningLab");
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
      </main>
      <footer className="site-footer">
        <span>{interfaceCopy.footer[language]}</span>
      </footer>
    </div>
  );
}
