"use client";

import { useMemo, useState } from "react";
import type { JuzMeta, SurahMeta } from "@/lib/types";
import { SurahCard } from "./surah-card";
import { JuzCard } from "./juz-card";
import { ContinueReading } from "./continue-reading";

export function HomeBrowser({
  surahs,
  juzList,
}: {
  surahs: SurahMeta[];
  juzList: JuzMeta[];
}) {
  const [tab, setTab] = useState<"surah" | "juz">("surah");
  const [query, setQuery] = useState("");

  const filteredSurahs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return surahs;
    return surahs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.titleAr.includes(query.trim()) ||
        s.index.replace(/^0+/, "").includes(q),
    );
  }, [surahs, query]);

  return (
    <div className="flex flex-col gap-4">
      <ContinueReading />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Browse by"
          className="inline-flex rounded-lg border border-border bg-surface p-1 self-start"
        >
          <button
            role="tab"
            aria-selected={tab === "surah"}
            onClick={() => setTab("surah")}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === "surah"
                ? "bg-accent text-surface"
                : "text-muted hover:text-foreground"
            }`}
          >
            Surah
          </button>
          <button
            role="tab"
            aria-selected={tab === "juz"}
            onClick={() => setTab("juz")}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === "juz"
                ? "bg-accent text-surface"
                : "text-muted hover:text-foreground"
            }`}
          >
            Juz&apos;
          </button>
        </div>

        {tab === "surah" && (
          <input
            type="search"
            inputMode="search"
            placeholder="Search surah…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring sm:w-56"
          />
        )}
      </div>

      {tab === "surah" ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {filteredSurahs.map((s) => (
            <SurahCard key={s.index} surah={s} />
          ))}
          {filteredSurahs.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-muted">
              No surah matches &quot;{query}&quot;.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {juzList.map((j) => (
            <JuzCard key={j.index} juz={j} />
          ))}
        </div>
      )}
    </div>
  );
}
