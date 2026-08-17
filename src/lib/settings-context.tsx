"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_ARABIC_FONT, type ArabicFontKey } from "./fonts";
import type { ReadingMode, ThemeName, TranslationLang } from "./types";

export type ReaderSettings = {
  theme: ThemeName;
  fontKey: ArabicFontKey;
  fontSize: number;
  readingMode: ReadingMode;
  translationLang: TranslationLang;
  tajweedEnabled: boolean;
};

const DEFAULT_SETTINGS: ReaderSettings = {
  theme: "sepia",
  fontKey: DEFAULT_ARABIC_FONT,
  fontSize: 2.1,
  readingMode: "mushaf",
  translationLang: "en",
  tajweedEnabled: true,
};

const STORAGE_KEY = "quran-reader-settings-v1";

type SettingsContextValue = {
  settings: ReaderSettings;
  update: (patch: Partial<ReaderSettings>) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // localStorage only exists client-side; this hydrates state after
        // mount so SSR output (defaults) matches the client's first render.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSettings((prev) => ({ ...prev, ...JSON.parse(raw) }));
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore storage failures (private mode, quota, etc.)
    }
  }, [settings]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      update: (patch) => setSettings((prev) => ({ ...prev, ...patch })),
    }),
    [settings],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useReaderSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useReaderSettings must be used within SettingsProvider");
  }
  return ctx;
}
