export const learningStorageKey = "audio-learning:v1";
export const labStoragePrefix = "audio-lab:v1:";
export type Visit = { key: string; kind: "topic" | "lab"; at: number };
export type ReadingMemory = { recent: Visit[]; favorites: string[] };
export const emptyReadingMemory = (): ReadingMemory => ({ recent: [], favorites: [] });

export function readLocal(key: string, onError: () => void): unknown {
  let raw: string | null;
  try { raw = window.localStorage.getItem(key); }
  catch { onError(); return undefined; }
  if (!raw) return undefined;
  try { return JSON.parse(raw); }
  catch { return undefined; }
}

export function writeLocal(key: string, value: unknown, onError: () => void) {
  try { window.localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { onError(); return false; }
}

export function clearLocalLearning(onError: () => void, labKey?: string) {
  try {
    const prefix = labKey === undefined ? labStoragePrefix : `${labStoragePrefix}${labKey}:`;
    const keys = Object.keys(window.localStorage).filter(key => key.startsWith(prefix) || (labKey === undefined && key === learningStorageKey));
    keys.forEach(key => window.localStorage.removeItem(key));
  } catch { onError(); }
}

export function sanitizeReadingMemory(value: unknown, topics: ReadonlyMap<string, boolean>): ReadingMemory {
  const result = emptyReadingMemory();
  if (!value || typeof value !== "object") return result;
  const data = value as Record<string, unknown>;
  if (Array.isArray(data.favorites)) {
    result.favorites = [...new Set(data.favorites.filter((key): key is string => typeof key === "string" && topics.has(key)))].slice(0, topics.size);
  }
  if (Array.isArray(data.recent)) {
    for (const item of data.recent) {
      if (!item || typeof item !== "object") continue;
      const { key, kind, at } = item;
      if (typeof key !== "string" || !topics.has(key) || !["topic", "lab"].includes(kind)
        || (kind === "lab" && !topics.get(key)) || typeof at !== "number" || !Number.isFinite(at) || at < 0) continue;
      if (!result.recent.some(visit => visit.key === key)) result.recent.push({ key, kind, at });
      if (result.recent.length === 8) break;
    }
  }
  return result;
}
