import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getArabicFontClassName } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "About — Al Mushaf",
  description:
    "Al Mushaf is an open source place to read the Qur'an in calm — who made it, and the sources it's built on.",
};

export default function AboutPage() {
  const brandFont = getArabicFontClassName("amiri");

  return (
    <div className="flex-1 bg-background">
      <div className="sticky top-0 z-30 border-b border-border bg-surface-raised/90 backdrop-blur supports-[backdrop-filter]:bg-surface-raised/75">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-3 py-2.5 sm:px-6">
          <Link
            href="/"
            aria-label="Back to Al Mushaf"
            className="rounded-full p-2 text-foreground hover:bg-accent-soft"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M9.7 2.3a1 1 0 0 1 0 1.4L5.4 8l4.3 4.3a1 1 0 1 1-1.4 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.4 0Z" />
            </svg>
          </Link>
          <Image
            src="/mushaf-icon.png"
            alt=""
            width={20}
            height={20}
            className="opacity-80"
          />
          <p className="text-sm font-medium text-foreground">About</p>
        </div>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
        <header className="flex flex-col items-center gap-2 text-center">
          <p className={`${brandFont} text-4xl leading-none text-accent`}>
            مصحف
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Al Mushaf
          </h1>
          <p className="max-w-sm text-sm text-muted">
            An open source place to read the Qur&apos;an in calm.
          </p>
        </header>

        <section className="mushaf-border bg-surface px-5 py-6 sm:px-8 sm:py-8">
          <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
            Initiated by
          </h2>
          <p className="mt-2 text-lg font-medium text-foreground">
            Mazhar Ahmed
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-muted">
            <li>BA in Islamic Studies, International Open University</li>
            <li>Dawra-e-Hadith, Qawmi Madrasa, Bangladesh</li>
          </ul>
        </section>

        <section className="mushaf-border bg-surface px-5 py-6 sm:px-8 sm:py-8">
          <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
            Credits &amp; sources
          </h2>

          <dl className="mt-4 space-y-5 text-sm">
            <div>
              <dt className="font-medium text-foreground">
                Qur&apos;an text, translations, tajweed &amp; audio data
              </dt>
              <dd className="mt-1 text-muted">
                <a
                  href="https://github.com/semarketir/quranjson"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-strong underline underline-offset-2 hover:text-accent"
                >
                  quranjson
                </a>{" "}
                by Semar Ketir and contributors (MIT licensed).
              </dd>
            </div>

            <div>
              <dt className="font-medium text-foreground">Recitation audio</dt>
              <dd className="mt-1 text-muted">
                Sheikh Saad Al-Ghamadi, via{" "}
                <a
                  href="http://www.versebyversequran.com/site/licence/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-strong underline underline-offset-2 hover:text-accent"
                >
                  versebyversequran.com
                </a>
                .
              </dd>
            </div>

            <div>
              <dt className="font-medium text-foreground">Icons</dt>
              <dd className="mt-1 flex items-center gap-2 text-muted">
                <Image
                  src="/mushaf-icon.png"
                  alt="Book icon"
                  width={20}
                  height={20}
                />
                <span>
                  By{" "}
                  <a
                    href="https://www.flaticon.com/authors/ghaarizal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-strong underline underline-offset-2 hover:text-accent"
                  >
                    ghaarizal
                  </a>{" "}
                  on Flaticon.
                </span>
              </dd>
            </div>

            <div>
              <dt className="font-medium text-foreground">Mushaf scripts</dt>
              <dd className="mt-1 text-muted">
                Uthmani Hafs (QPC), IndoPak, Amiri Quran, Muhammadi, Al
                Majeed, Al Mushaf, and PDMS Saleem — thanks to the
                typographers and communities who created and shared these
                fonts.
              </dd>
            </div>

            <div>
              <dt className="font-medium text-foreground">Built with</dt>
              <dd className="mt-1 text-muted">Next.js, React, and Tailwind CSS.</dd>
            </div>
          </dl>
        </section>

        <p className="text-center text-xs text-muted">
          <Link href="/" className="underline underline-offset-2 hover:text-foreground">
            Back to reading
          </Link>
        </p>
      </div>
    </div>
  );
}
