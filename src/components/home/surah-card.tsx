import Link from "next/link";
import type { SurahMeta } from "@/lib/types";
import { toArabicIndicNumeral } from "@/lib/arabic-numerals";

export function SurahCard({ surah }: { surah: SurahMeta }) {
  const number = Number(surah.index);
  return (
    <Link
      href={`/surah/${number}`}
      className="group flex items-center gap-4 rounded-xl border border-border bg-surface px-4 py-3 transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/40 text-sm font-medium text-accent-strong">
        {number}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate font-medium text-foreground">
            {surah.title}
          </span>
          <span className="shrink-0 text-lg leading-none text-foreground">
            {surah.titleAr}
          </span>
        </span>
        <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
          <span>{surah.place === "Mecca" ? "Meccan" : "Medinan"}</span>
          <span aria-hidden>·</span>
          <span>{surah.count} verses</span>
        </span>
      </span>
      <span
        className="shrink-0 text-xs text-muted opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden
      >
        {toArabicIndicNumeral(number)}
      </span>
    </Link>
  );
}
