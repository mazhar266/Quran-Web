import type { TajweedSegment } from "./tajweed";

export type SurahMeta = {
  index: string;
  title: string;
  titleAr: string;
  place: "Mecca" | "Medina";
  type: string;
  count: number;
  pages: string;
};

export type SurahText = {
  index: string;
  name: string;
  count: number;
  verses: {
    number: number;
    arabic: string;
    tajweed: TajweedSegment[];
  }[];
  bismillah: string | null;
};

export type TranslationLang = "en" | "id" | "ar";

export type JuzMeta = {
  index: string;
  start: { index: string; verse: string; name: string };
  end: { index: string; verse: string; name: string };
};

export type ReadingMode = "mushaf" | "translation";

export type ThemeName = "sepia" | "light" | "dark";
