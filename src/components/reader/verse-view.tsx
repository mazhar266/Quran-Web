"use client";

import type { SurahText, TranslationLang } from "@/lib/types";
import type { TajweedSegment } from "@/lib/tajweed";
import { toArabicIndicNumeral } from "@/lib/arabic-numerals";

function TajweedText({ segments }: { segments: TajweedSegment[] }) {
  return (
    <>
      {segments.map((seg, i) =>
        seg.rule ? (
          <span key={i} data-rule={seg.rule}>
            {seg.text}
          </span>
        ) : (
          seg.text
        ),
      )}
    </>
  );
}

export function VerseView({
  text,
  translations,
  translationLang,
  readingMode,
  arabicClassName,
  fontSize,
  currentAyah,
  onAyahClick,
  flashAyah,
  tajweedEnabled,
}: {
  text: SurahText;
  translations: Record<TranslationLang, Record<number, string>>;
  translationLang: TranslationLang;
  readingMode: "mushaf" | "translation";
  arabicClassName: string;
  fontSize: number;
  currentAyah: number | null;
  onAyahClick: (ayah: number) => void;
  flashAyah: number | null;
  tajweedEnabled: boolean;
}) {
  const translationMap = translations[translationLang];

  if (readingMode === "mushaf") {
    return (
      <div className="mushaf-border bg-surface px-5 py-8 sm:px-8 sm:py-10">
        <div
          dir="rtl"
          className={`${arabicClassName} ruled-lines-mushaf text-justify text-foreground ${
            tajweedEnabled ? "tajweed-on" : ""
          }`}
          style={{ fontSize: `${fontSize}rem`, lineHeight: 2.35 }}
        >
          {text.verses.map((v) => (
            <span
              key={v.number}
              data-ayah={v.number}
              className={`rounded transition-colors duration-700 ${
                currentAyah === v.number || flashAyah === v.number
                  ? "bg-accent-soft"
                  : ""
              }`}
            >
              <TajweedText segments={v.tajweed} />{" "}
              <button
                type="button"
                onClick={() => onAyahClick(v.number)}
                data-active={currentAyah === v.number}
                className="ayah-marker cursor-pointer hover:bg-accent-soft"
                aria-label={`Play verse ${v.number}`}
              >
                {toArabicIndicNumeral(v.number)}
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {text.verses.map((v) => (
        <div
          key={v.number}
          data-ayah={v.number}
          className={`mushaf-border bg-surface px-4 py-4 transition-colors duration-700 sm:px-6 sm:py-5 ${
            currentAyah === v.number || flashAyah === v.number
              ? "border-accent"
              : ""
          }`}
        >
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => onAyahClick(v.number)}
              data-active={currentAyah === v.number}
              className="ayah-marker mt-1 shrink-0 cursor-pointer hover:bg-accent-soft"
              aria-label={`Play verse ${v.number}`}
            >
              {toArabicIndicNumeral(v.number)}
            </button>
            <p
              dir="rtl"
              className={`${arabicClassName} ruled-lines-verse flex-1 text-right text-foreground ${
                tajweedEnabled ? "tajweed-on" : ""
              }`}
              style={{ fontSize: `${fontSize}rem`, lineHeight: 1.9 }}
            >
              <TajweedText segments={v.tajweed} />
            </p>
          </div>
          {translationMap?.[v.number] && (
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {translationMap[v.number]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
