import { getJuzList, getSurahList } from "@/lib/quran-data";
import { HomeBrowser } from "@/components/home/home-browser";
import { getArabicFontClassName } from "@/lib/fonts";

export default function Home() {
  const surahs = getSurahList();
  const juzList = getJuzList();
  const brandFont = getArabicFontClassName("amiri");

  return (
    <div className="flex-1 bg-background">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 pb-24 pt-10 sm:px-6 sm:pt-16">
        <header className="flex flex-col items-center gap-2 text-center">
          <p className={`${brandFont} text-4xl leading-none text-accent`}>
            مصحف
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Mushaf
          </h1>
          <p className="max-w-sm text-sm text-muted">
            A calm space to read the Qur&apos;an — choose your Mushaf script,
            follow along with translation, and listen verse by verse.
          </p>
        </header>

        <HomeBrowser surahs={surahs} juzList={juzList} />
      </div>
    </div>
  );
}
