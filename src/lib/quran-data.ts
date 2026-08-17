import fs from "node:fs";
import path from "node:path";
import { parseTajweed } from "./tajweed";
import type { JuzMeta, SurahMeta, SurahText, TranslationLang } from "./types";

const DATA_ROOT = path.join(process.cwd(), "quranjson", "source");

function readJson<T>(relativePath: string): T {
  const file = path.join(DATA_ROOT, relativePath);
  return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
}

export function getSurahList(): SurahMeta[] {
  return readJson<SurahMeta[]>("surah.json");
}

export function getSurahMeta(number: number): SurahMeta | undefined {
  return getSurahList().find((s) => Number(s.index) === number);
}

export function getJuzList(): JuzMeta[] {
  return readJson<JuzMeta[]>("juz.json");
}

export function getSurahText(number: number): SurahText {
  const raw = readJson<{
    index: string;
    name: string;
    count: number;
    verse: Record<string, string>;
  }>(`surah/surah_${number}.json`);

  const bismillah = raw.verse.verse_0 ?? null;
  const verses = Object.entries(raw.verse)
    .filter(([key]) => key !== "verse_0")
    .map(([key, arabic]) => ({
      number: Number(key.replace("verse_", "")),
      arabic,
      tajweed: parseTajweed(arabic),
    }))
    .sort((a, b) => a.number - b.number);

  return {
    index: raw.index,
    name: raw.name,
    count: raw.count,
    verses,
    bismillah,
  };
}

export function getTranslation(
  number: number,
  lang: TranslationLang,
): Record<number, string> {
  const raw = readJson<{ verse: Record<string, string> }>(
    `translation/${lang}/${lang}_translation_${number}.json`,
  );
  const out: Record<number, string> = {};
  for (const [key, text] of Object.entries(raw.verse)) {
    if (key === "verse_0") continue;
    out[Number(key.replace("verse_", ""))] = text;
  }
  return out;
}

export function getAudioPath(surah: number, ayah: number): string {
  const surahPadded = String(surah).padStart(3, "0");
  const ayahPadded = String(ayah).padStart(3, "0");
  return path.join(DATA_ROOT, "audio", surahPadded, `${ayahPadded}.mp3`);
}
