import type { SurahMeta, SurahText } from "@/lib/types";

export function SurahHeader({
  meta,
  text,
  arabicClassName,
}: {
  meta: SurahMeta;
  text: SurahText;
  arabicClassName: string;
}) {
  return (
    <div className="mushaf-border bg-surface px-5 py-6 text-center sm:px-8 sm:py-8">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
        {meta.place === "Mecca" ? "Meccan Surah" : "Medinan Surah"} ·{" "}
        {meta.count} verses
      </p>
      <h1
        className={`${arabicClassName} mt-3 text-4xl leading-relaxed text-foreground sm:text-5xl`}
      >
        {meta.titleAr}
      </h1>
      <p className="mt-2 text-lg font-medium text-accent-strong">
        {meta.title}
      </p>

      {text.bismillah && (
        <p
          className={`${arabicClassName} mt-6 border-t border-border pt-6 text-3xl leading-relaxed text-foreground sm:text-4xl`}
        >
          {text.bismillah}
        </p>
      )}
    </div>
  );
}
