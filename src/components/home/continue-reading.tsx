"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getLastRead, type LastRead } from "@/lib/reading-progress";

export function ContinueReading() {
  const [lastRead, setLastRead] = useState<LastRead | null>(null);

  useEffect(() => {
    // localStorage only exists client-side; this hydrates state after mount
    // so SSR output (null) matches the client's first render and avoids a
    // hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLastRead(getLastRead());
  }, []);

  if (!lastRead) return null;

  return (
    <Link
      href={`/surah/${lastRead.surah}?ayah=${lastRead.ayah}`}
      className="flex items-center justify-between gap-4 rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 transition-opacity hover:opacity-90"
    >
      <span>
        <span className="block text-xs font-medium uppercase tracking-wide text-accent-strong">
          Continue reading
        </span>
        <span className="mt-0.5 block text-sm text-foreground">
          {lastRead.surahTitle} · Ayah {lastRead.ayah}
        </span>
      </span>
      <span className="text-lg text-foreground" aria-hidden>
        {lastRead.surahTitleAr}
      </span>
    </Link>
  );
}
