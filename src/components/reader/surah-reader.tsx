"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SurahMeta, SurahText, TranslationLang } from "@/lib/types";
import { getArabicFontClassName } from "@/lib/fonts";
import { useReaderSettings } from "@/lib/settings-context";
import { setLastRead } from "@/lib/reading-progress";
import { SurahHeader } from "./surah-header";
import { VerseView } from "./verse-view";
import { AudioBar } from "./audio-bar";
import { SettingsSheet } from "./settings-sheet";

export function SurahReader({
  meta,
  text,
  translations,
  prev,
  next,
  initialAyah,
}: {
  meta: SurahMeta;
  text: SurahText;
  translations: Record<TranslationLang, Record<number, string>>;
  prev: SurahMeta | null;
  next: SurahMeta | null;
  initialAyah?: number;
}) {
  const { settings } = useReaderSettings();
  const surahNumber = Number(meta.index);
  const lastVerse = text.verses[text.verses.length - 1]?.number ?? meta.count;

  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const visibleAyahRef = useRef<number | null>(null);

  const [currentAyah, setCurrentAyah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [flashAyah, setFlashAyah] = useState<number | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const arabicClassName = getArabicFontClassName(settings.fontKey);

  const scrollToAyah = useCallback((ayah: number) => {
    const el = containerRef.current?.querySelector<HTMLElement>(
      `[data-ayah="${ayah}"]`,
    );
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const playFrom = useCallback(
    (ayah: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      setCurrentAyah(ayah);
      audio.src = `/api/audio/${surahNumber}/${ayah}`;
      audio.play().catch(() => {});
      setIsPlaying(true);
      scrollToAyah(ayah);
    },
    [surahNumber, scrollToAyah],
  );

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (currentAyah === null) {
      playFrom(1);
      return;
    }
    if (audio.paused) {
      audio.play().catch(() => {});
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [currentAyah, playFrom]);

  const closeAudio = useCallback(() => {
    const audio = audioRef.current;
    audio?.pause();
    setIsPlaying(false);
    setCurrentAyah(null);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => {
      setCurrentAyah((prevAyah) => {
        if (prevAyah !== null && prevAyah < lastVerse) {
          const nextAyah = prevAyah + 1;
          audio.src = `/api/audio/${surahNumber}/${nextAyah}`;
          audio.play().catch(() => {});
          scrollToAyah(nextAyah);
          return nextAyah;
        }
        setIsPlaying(false);
        return prevAyah;
      });
    };
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [surahNumber, lastVerse, scrollToAyah]);

  // Scroll to a deep-linked ayah (e.g. from Juz navigation) on first load.
  useEffect(() => {
    if (!initialAyah) return;
    const timeout = setTimeout(() => {
      scrollToAyah(initialAyah);
      setFlashAyah(initialAyah);
    }, 80);
    const clear = setTimeout(() => setFlashAyah(null), 2600);
    return () => {
      clearTimeout(timeout);
      clearTimeout(clear);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track reading position for "Continue reading".
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { ayah: number; ratio: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const ayah = Number(
            (entry.target as HTMLElement).dataset.ayah ?? NaN,
          );
          if (!Number.isFinite(ayah)) continue;
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { ayah, ratio: entry.intersectionRatio };
          }
        }
        if (best) visibleAyahRef.current = best.ayah;
      },
      { threshold: [0.1, 0.5, 1] },
    );

    const targets = container.querySelectorAll<HTMLElement>("[data-ayah]");
    targets.forEach((t) => observer.observe(t));

    const save = () => {
      if (visibleAyahRef.current) {
        setLastRead({
          surah: surahNumber,
          surahTitle: meta.title,
          surahTitleAr: meta.titleAr,
          ayah: visibleAyahRef.current,
        });
      }
    };
    const interval = setInterval(save, 4000);
    window.addEventListener("pagehide", save);

    return () => {
      observer.disconnect();
      clearInterval(interval);
      window.removeEventListener("pagehide", save);
      save();
    };
  }, [surahNumber, meta.title, meta.titleAr, settings.readingMode]);

  return (
    <div className="flex min-h-full flex-col bg-background">
      <div className="sticky top-0 z-30 border-b border-border bg-surface-raised/90 backdrop-blur supports-[backdrop-filter]:bg-surface-raised/75">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-3 py-2.5 sm:px-6">
          <Link
            href="/"
            aria-label="Back to surah list"
            className="rounded-full p-2 text-foreground hover:bg-accent-soft"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M9.7 2.3a1 1 0 0 1 0 1.4L5.4 8l4.3 4.3a1 1 0 1 1-1.4 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.4 0Z" />
            </svg>
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {meta.title}
            </p>
          </div>
          <button
            type="button"
            onClick={togglePlayPause}
            aria-label={isPlaying ? "Pause recitation" : "Play recitation"}
            className="rounded-full p-2 text-foreground hover:bg-accent-soft"
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Reading settings"
            className="rounded-full p-2 text-foreground hover:bg-accent-soft"
          >
            <GearIcon />
          </button>
        </div>
      </div>

      <div
        className={`mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-3 py-5 sm:px-6 sm:py-8 ${
          currentAyah !== null ? "pb-24" : "pb-8"
        }`}
      >
        <SurahHeader meta={meta} text={text} arabicClassName={arabicClassName} />

        <div ref={containerRef}>
          <VerseView
            text={text}
            translations={translations}
            translationLang={settings.translationLang}
            readingMode={settings.readingMode}
            arabicClassName={arabicClassName}
            fontSize={settings.fontSize}
            currentAyah={currentAyah}
            onAyahClick={playFrom}
            flashAyah={flashAyah}
            tajweedEnabled={settings.tajweedEnabled}
          />
        </div>

        <nav className="mt-2 flex items-center justify-between gap-3 text-sm">
          {prev ? (
            <Link
              href={`/surah/${Number(prev.index)}`}
              className="flex-1 rounded-lg border border-border bg-surface px-4 py-3 text-right transition-colors hover:border-accent"
            >
              <span className="block text-xs text-muted">Previous</span>
              <span className="font-medium text-foreground">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {next ? (
            <Link
              href={`/surah/${Number(next.index)}`}
              className="flex-1 rounded-lg border border-border bg-surface px-4 py-3 text-left transition-colors hover:border-accent"
            >
              <span className="block text-xs text-muted">Next</span>
              <span className="font-medium text-foreground">
                {next.title}
              </span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </nav>
      </div>

      <audio ref={audioRef} preload="none" />

      {currentAyah !== null && (
        <AudioBar
          audioRef={audioRef}
          surahTitle={meta.title}
          currentAyah={currentAyah}
          totalVerses={lastVerse}
          isPlaying={isPlaying}
          onTogglePlay={togglePlayPause}
          onPrev={() => currentAyah > 1 && playFrom(currentAyah - 1)}
          onNext={() => currentAyah < lastVerse && playFrom(currentAyah + 1)}
          onClose={closeAudio}
        />
      )}

      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 2.5v11l10-5.5-10-5.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 2.5h3v11H4v-11Zm5 0h3v11H9v-11Z" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
      <path d="M6.4 1.5h3.2l.4 1.9c.5.2 1 .4 1.4.7l1.8-.7 1.6 2.8-1.5 1.2c.05.3.07.5.07.6s-.02.3-.07.6l1.5 1.2-1.6 2.8-1.8-.7c-.4.3-.9.5-1.4.7l-.4 1.9H6.4l-.4-1.9a5.5 5.5 0 0 1-1.4-.7l-1.8.7-1.6-2.8 1.5-1.2A4.6 4.6 0 0 1 2.6 8c0-.1.02-.3.07-.6L1.2 6.2l1.6-2.8 1.8.7c.4-.3.9-.5 1.4-.7l.4-1.9ZM8 10.5A2.5 2.5 0 1 0 8 5.5a2.5 2.5 0 0 0 0 5Z" />
    </svg>
  );
}
