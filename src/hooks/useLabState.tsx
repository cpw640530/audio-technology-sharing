import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { clearLocalLearning, labStoragePrefix, readLocal, writeLocal } from "../content/localLearning";

type LabSessionValue = { topic: string; active: { current: boolean }; reset: () => void; onError: () => void };
export const LabSessionContext = createContext<LabSessionValue | null>(null);

export function LabSession({ topic, children, onError }: { topic: string; children: ReactNode; onError: () => void }) {
  const [revision, setRevision] = useState(0);
  const session = useMemo<LabSessionValue>(() => {
    const active = { current: true };
    return { topic, active, onError, reset: () => {
      // Prevent unmount flushes from restoring parameters that the user just cleared.
      active.current = false;
      clearLocalLearning(onError, topic);
      setRevision(value => value + 1);
    } };
  }, [topic, revision, onError]);
  return <LabSessionContext.Provider key={revision} value={session}>{children}</LabSessionContext.Provider>;
}

export function useLabState<T>(name: string, initial: T | (() => T), validate: (value: unknown) => value is T): [T, Dispatch<SetStateAction<T>>] {
  const session = useContext(LabSessionContext);
  const storageKey = `${labStoragePrefix}${session?.topic}:${name}`;
  const readFailed = useRef(false);
  const [value, setValue] = useState<T>(() => {
    const saved = session ? readLocal(storageKey, () => { readFailed.current = true; }) : undefined;
    return validate(saved) ? saved : typeof initial === "function" ? (initial as () => T)() : initial;
  });
  const current = useRef(value);
  const dirty = useRef(false);
  const validation = useRef(validate);
  validation.current = validate;
  const change = useCallback<Dispatch<SetStateAction<T>>>((update) => {
    const next = typeof update === "function" ? (update as (previous: T) => T)(current.current) : update;
    if (Object.is(next, current.current)) return;
    current.current = next;
    dirty.current = true;
    setValue(current.current);
  }, []);
  const flush = useCallback(() => {
    if (!session?.active.current || !dirty.current || !validation.current(current.current)) return;
    writeLocal(storageKey, current.current, session.onError);
    dirty.current = false;
  }, [session, storageKey]);
  useEffect(() => {
    if (!session) return;
    if (readFailed.current) session?.onError();
    const timer = window.setTimeout(flush, 250);
    return () => window.clearTimeout(timer);
  }, [value, flush, session]);
  useEffect(() => {
    if (!session) return;
    const onHidden = () => { if (document.hidden) flush(); };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      flush();
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, [flush, session]);
  return [value, change];
}
