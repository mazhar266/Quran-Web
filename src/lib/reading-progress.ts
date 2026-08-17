export type LastRead = {
  surah: number;
  surahTitle: string;
  surahTitleAr: string;
  ayah: number;
  updatedAt: number;
};

const STORAGE_KEY = "quran-last-read-v1";

export function getLastRead(): LastRead | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LastRead) : null;
  } catch {
    return null;
  }
}

export function setLastRead(entry: Omit<LastRead, "updatedAt">) {
  if (typeof window === "undefined") return;
  try {
    const value: LastRead = { ...entry, updatedAt: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // ignore storage failures
  }
}
