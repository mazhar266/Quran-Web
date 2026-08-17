import localFont from "next/font/local";

const uthmani = localFont({
  src: "../../fonts/arabic/QPC Hafs (Official Uthmani script font) - TTF.ttf",
  display: "swap",
  preload: false,
});

const indopak = localFont({
  src: "../../fonts/arabic/AlQuran IndoPak.ttf",
  display: "swap",
  preload: false,
});

const amiri = localFont({
  src: "../../fonts/arabic/AmiriQuran-Regular.ttf",
  display: "swap",
  preload: false,
});

const muhammadi = localFont({
  src: "../../fonts/arabic/MUHAMMADI QURANIC FONT.ttf",
  display: "swap",
  preload: false,
});

const almajeed = localFont({
  src: "../../fonts/arabic/Al Majeed Quranic Font_shiped.ttf",
  display: "swap",
  preload: false,
});

const almushaf = localFont({
  src: "../../fonts/arabic/Al Mushaf Quran.ttf",
  display: "swap",
  preload: false,
});

const pdmsSaleem = localFont({
  src: "../../fonts/arabic/PDMS_Saleem_QuranFont_shipped.ttf",
  display: "swap",
  preload: false,
});

export type ArabicFontKey =
  | "uthmani"
  | "indopak"
  | "amiri"
  | "muhammadi"
  | "almajeed"
  | "almushaf"
  | "pdmsSaleem";

export const ARABIC_FONTS: {
  key: ArabicFontKey;
  label: string;
  sub: string;
  className: string;
}[] = [
  {
    key: "uthmani",
    label: "Uthmani Hafs",
    sub: "Madinah Mushaf script",
    className: uthmani.className,
  },
  {
    key: "indopak",
    label: "IndoPak",
    sub: "South Asian Mushaf script",
    className: indopak.className,
  },
  {
    key: "amiri",
    label: "Amiri Quran",
    sub: "Classical Naskh",
    className: amiri.className,
  },
  {
    key: "muhammadi",
    label: "Muhammadi",
    sub: "Bold traditional script",
    className: muhammadi.className,
  },
  {
    key: "almajeed",
    label: "Al Majeed",
    sub: "Warm calligraphic style",
    className: almajeed.className,
  },
  {
    key: "almushaf",
    label: "Al Mushaf",
    sub: "Classic print style",
    className: almushaf.className,
  },
  {
    key: "pdmsSaleem",
    label: "PDMS Saleem",
    sub: "Elegant Naskh variant",
    className: pdmsSaleem.className,
  },
];

export const DEFAULT_ARABIC_FONT: ArabicFontKey = "uthmani";

export function getArabicFontClassName(key: ArabicFontKey): string {
  return (
    ARABIC_FONTS.find((f) => f.key === key)?.className ??
    ARABIC_FONTS[0].className
  );
}
