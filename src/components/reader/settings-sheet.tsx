"use client";

import { useEffect, useRef } from "react";
import { ARABIC_FONTS } from "@/lib/fonts";
import { useReaderSettings } from "@/lib/settings-context";
import { TAJWEED_RULE_INFO } from "@/lib/tajweed";
import type { ThemeName } from "@/lib/types";

const THEMES: { key: ThemeName; label: string }[] = [
  { key: "sepia", label: "Sepia" },
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
];

const TRANSLATIONS: { key: "en" | "id" | "ar"; label: string }[] = [
  { key: "en", label: "English" },
  { key: "id", label: "Indonesian" },
  { key: "ar", label: "Arabic Tafsir" },
];

export function SettingsSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { settings, update } = useReaderSettings();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onOpenChange(false);
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onOpenChange]);

  return (
    <dialog
      ref={dialogRef}
      className="m-0 h-full max-h-full w-full max-w-full border-0 bg-transparent p-0 backdrop:bg-black/40 sm:m-auto sm:h-auto sm:max-w-md sm:rounded-2xl"
      onClick={(e) => {
        if (e.target === dialogRef.current) onOpenChange(false);
      }}
    >
      <div className="flex max-h-[90vh] w-full flex-col overflow-y-auto rounded-t-2xl border-t border-border bg-surface-raised p-5 sm:rounded-2xl sm:border">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            Reading settings
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close settings"
            className="rounded-full p-1.5 text-muted hover:text-foreground"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.3 3.3a1 1 0 0 1 1.4 0L8 6.6l3.3-3.3a1 1 0 1 1 1.4 1.4L9.4 8l3.3 3.3a1 1 0 0 1-1.4 1.4L8 9.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L6.6 8 3.3 4.7a1 1 0 0 1 0-1.4Z" />
            </svg>
          </button>
        </div>

        <section className="mb-5">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
            Reading mode
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => update({ readingMode: "mushaf" })}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                settings.readingMode === "mushaf"
                  ? "border-accent bg-accent-soft text-accent-strong"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              Mushaf
            </button>
            <button
              type="button"
              onClick={() => update({ readingMode: "translation" })}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                settings.readingMode === "translation"
                  ? "border-accent bg-accent-soft text-accent-strong"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              Translation
            </button>
          </div>
        </section>

        <section className="mb-5">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
            Translation language
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {TRANSLATIONS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => update({ translationLang: t.key })}
                className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                  settings.translationLang === t.key
                    ? "border-accent bg-accent-soft text-accent-strong"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted">
                Tajweed colours
              </h3>
              <p className="mt-0.5 text-[11px] text-muted">
                From Quran tajweed annotation data
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.tajweedEnabled}
              onClick={() =>
                update({ tajweedEnabled: !settings.tajweedEnabled })
              }
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                settings.tajweedEnabled ? "bg-accent" : "bg-border"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-surface-raised shadow transition-transform ${
                  settings.tajweedEnabled
                    ? "translate-x-[1.375rem]"
                    : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
          {settings.tajweedEnabled && (
            <ul className="mt-3 grid grid-cols-1 gap-1.5 rounded-lg border border-border p-2.5 sm:grid-cols-2">
              {TAJWEED_RULE_INFO.map((r) => (
                <li key={r.rule} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: `var(${r.cssVar})` }}
                  />
                  <span className="text-xs text-foreground">{r.label}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mb-5">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
            Mushaf script
          </h3>
          <div className="flex flex-col gap-1.5">
            {ARABIC_FONTS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => update({ fontKey: f.key })}
                className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${
                  settings.fontKey === f.key
                    ? "border-accent bg-accent-soft"
                    : "border-border hover:border-accent/50"
                }`}
              >
                <span>
                  <span className="block text-sm font-medium text-foreground">
                    {f.label}
                  </span>
                  <span className="block text-[11px] text-muted">
                    {f.sub}
                  </span>
                </span>
                <span
                  dir="rtl"
                  className={`${f.className} shrink-0 text-2xl text-foreground`}
                >
                  بِسْمِ
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-5">
          <h3 className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted">
            <span>Font size</span>
            <span>{settings.fontSize.toFixed(1)}</span>
          </h3>
          <input
            type="range"
            min={1.4}
            max={3.4}
            step={0.1}
            value={settings.fontSize}
            onChange={(e) => update({ fontSize: Number(e.target.value) })}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-border accent-accent"
          />
        </section>

        <section>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
            Theme
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => update({ theme: t.key })}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  settings.theme === t.key
                    ? "border-accent bg-accent-soft text-accent-strong"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>
      </div>
    </dialog>
  );
}
