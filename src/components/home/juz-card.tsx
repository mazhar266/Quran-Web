import Link from "next/link";
import type { JuzMeta } from "@/lib/types";

export function JuzCard({ juz }: { juz: JuzMeta }) {
  const number = Number(juz.index);
  const startAyah = Number(juz.start.verse.replace("verse_", ""));

  return (
    <Link
      href={`/surah/${Number(juz.start.index)}?ayah=${startAyah}`}
      className="flex items-center gap-4 rounded-xl border border-border bg-surface px-4 py-3 transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/40 text-sm font-medium text-accent-strong">
        {number}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-foreground">
          Juz {number}
        </span>
        <span className="mt-0.5 block text-xs text-muted">
          {juz.start.name} {startAyah} — {juz.end.name}{" "}
          {juz.end.verse.replace("verse_", "")}
        </span>
      </span>
    </Link>
  );
}
