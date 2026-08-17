import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getSurahMeta,
  getSurahText,
  getTranslation,
} from "@/lib/quran-data";
import { SurahReader } from "@/components/reader/surah-reader";

type PageParams = { number: string };
type PageSearchParams = { ayah?: string };

export function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({ number: String(i + 1) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { number } = await params;
  const meta = getSurahMeta(Number(number));
  if (!meta) return {};
  return {
    title: `${meta.title} (${meta.titleAr}) — Mushaf`,
    description: `Read Surah ${meta.title}, ${meta.count} verses, ${meta.place === "Mecca" ? "revealed in Mecca" : "revealed in Medina"}.`,
  };
}

export default async function SurahPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
}) {
  const { number } = await params;
  const { ayah } = await searchParams;
  const surahNumber = Number(number);

  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    notFound();
  }

  const meta = getSurahMeta(surahNumber);
  if (!meta) notFound();

  const text = getSurahText(surahNumber);
  const translations = {
    en: getTranslation(surahNumber, "en"),
    id: getTranslation(surahNumber, "id"),
    ar: getTranslation(surahNumber, "ar"),
  };
  const prev = surahNumber > 1 ? getSurahMeta(surahNumber - 1) ?? null : null;
  const next =
    surahNumber < 114 ? getSurahMeta(surahNumber + 1) ?? null : null;

  const initialAyah = ayah ? Number(ayah) : undefined;

  return (
    <SurahReader
      meta={meta}
      text={text}
      translations={translations}
      prev={prev}
      next={next}
      initialAyah={
        Number.isInteger(initialAyah) && initialAyah! > 0
          ? initialAyah
          : undefined
      }
    />
  );
}
