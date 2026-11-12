import { categories, type Topic } from "./knowledge";
import { getTopicKey, type TopicKey } from "./relatedTopics";

const articleViews = {
  "sound-wave": "soundTopicPage",
  "wave-spectrum": "waveSpectrumPage",
  "sampling-quantization": "digitalTopicPage",
  "audio-units": "audioUnitsPage",
  "listening-metrics": "listeningTopicPage",
  "system-audio": "systemAudioPage",
  alsa: "alsaPage",
  "realtime-audio": "realtimeAudioPage",
  "audio-codec": "audioCodecPage",
  "core-signal-processing": "coreSignalProcessingPage",
  "speech-enhancement": "speechEnhancementPage",
  "spatial-audio": "spatialAudioPage"
} as const;

const labViews = {
  "sound-wave": "soundLab",
  "wave-spectrum": "waveSpectrumLab",
  "sampling-quantization": "digitalLab",
  "audio-units": "audioUnitsLab",
  "listening-metrics": "listeningLab",
  microphone: "microphoneLab",
  "digital-interface": "digitalInterfaceLab",
  "amplifier-speaker": "amplifierSpeakerLab",
  alsa: "alsaLab",
  "realtime-audio": "realtimeAudioLab",
  "core-signal-processing": "coreSignalProcessingLab",
  "speech-enhancement": "speechEnhancementLab",
  "spatial-audio": "spatialAudioLab",
  "ai-audio": "aiAudioLab",
  "automotive-audio": "automotiveAudioLab",
  "robot-audio": "robotAudioLab",
  "bluetooth-audio": "bluetoothAudioLab"
} as const;

type ArticleView = (typeof articleViews)[keyof typeof articleViews] | "hardwareTopicPage" | "aiAudioPage" | "applicationTopicPage";
type LabView = (typeof labViews)[keyof typeof labViews];
export type TopicView = ArticleView | LabView | "knowledge";

export const topicRoutes = categories.flatMap(category => category.topics.map(topic => {
  const key = getTopicKey(topic);
  const articleView: ArticleView | undefined = category.id === "hardware" ? "hardwareTopicPage"
    : category.id === "ai" ? "aiAudioPage"
    : category.id === "applications" ? "applicationTopicPage"
    : articleViews[key as keyof typeof articleViews];
  if (!key || !articleView) throw new Error(`Missing article route: ${topic.title.en}`);
  const labView = topic.detail.lab ? labViews[topic.detail.lab.type as keyof typeof labViews] : undefined;
  return { key, topic: { ...topic, category }, articleView, labView };
}));

type TopicRouteEntry = (typeof topicRoutes)[number];
export type SiteRoute = { kind: "welcome" | "home" | "notes" | "missing" }
  | { kind: "topic" | "lab"; entry: TopicRouteEntry };

export function topicHref(topic: Topic | TopicKey, kind: "topic" | "lab" = "topic"): string {
  const key = typeof topic === "string" ? topic : getTopicKey(topic);
  return key ? `#/${kind === "lab" ? "labs" : "topics"}/${key}` : "#top";
}

export function parseSiteRoute(hash: string): SiteRoute {
  if (!hash || hash === "#welcome") return { kind: "welcome" };
  if (["#top", "#knowledge-content"].includes(hash)) return { kind: "home" };
  if (hash === "#technical-notes") return { kind: "notes" };
  const match = /^#\/(topics|labs)\/([a-z0-9-]+)\/?$/.exec(hash);
  const entry = match ? topicRoutes.find(route => route.key === match[2])
    : topicRoutes.find(({ topic }) => hash === `#topic-${topic.category.id}-${encodeURIComponent(topic.title.en)}`);
  if (!entry || (match?.[1] === "labs" && !entry.labView)) return { kind: "missing" };
  return { kind: match?.[1] === "labs" ? "lab" : "topic", entry };
}

export function isPlainNavigation(event: { button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean; defaultPrevented: boolean }): boolean {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}
