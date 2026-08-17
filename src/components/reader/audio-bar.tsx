"use client";

import { useEffect, useState, type RefObject } from "react";

export function AudioBar({
  audioRef,
  surahTitle,
  currentAyah,
  totalVerses,
  isPlaying,
  onTogglePlay,
  onPrev,
  onNext,
  onClose,
}: {
  audioRef: RefObject<HTMLAudioElement | null>;
  surahTitle: string;
  currentAyah: number;
  totalVerses: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    audio.addEventListener("timeupdate", onTimeUpdate);
    return () => audio.removeEventListener("timeupdate", onTimeUpdate);
  }, [audioRef, currentAyah]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = Number(e.target.value) * audio.duration;
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface-raised/95 backdrop-blur supports-[backdrop-filter]:bg-surface-raised/80">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentAyah <= 1}
          aria-label="Previous verse"
          className="rounded-full p-2 text-foreground disabled:opacity-30"
        >
          <PrevIcon />
        </button>

        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-surface"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={currentAyah >= totalVerses}
          aria-label="Next verse"
          className="rounded-full p-2 text-foreground disabled:opacity-30"
        >
          <NextIcon />
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-foreground">
            {surahTitle} · Ayah {currentAyah}
          </p>
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={Number.isFinite(progress) ? progress : 0}
            onChange={handleSeek}
            aria-label="Seek"
            className="mt-1 h-1 w-full cursor-pointer appearance-none rounded-full bg-border accent-accent"
          />
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Stop"
          className="rounded-full p-2 text-muted hover:text-foreground"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 2.5v11l10-5.5-10-5.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 2.5h3v11H4v-11Zm5 0h3v11H9v-11Z" />
    </svg>
  );
}

function PrevIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 3v10h1.5V8.7L12 13V3L5.5 7.3V3H4Z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
      <path d="M12 3v10h-1.5V8.7L4 13V3l6.5 4.3V3H12Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M3.3 3.3a1 1 0 0 1 1.4 0L8 6.6l3.3-3.3a1 1 0 1 1 1.4 1.4L9.4 8l3.3 3.3a1 1 0 0 1-1.4 1.4L8 9.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L6.6 8 3.3 4.7a1 1 0 0 1 0-1.4Z" />
    </svg>
  );
}
