/**
 * Best-effort Tajweed colour coding, derived purely by pattern-matching the
 * Uthmani Unicode text (Tanzil-style encoding) — no external tajweed
 * annotation data required. Covers the rules that are reliably detectable
 * from the diacritics already present in the script: ghunnah, qalqalah,
 * iqlab, idgham (with/without ghunnah), ikhfa, and hamzat wasl.
 *
 * It does not attempt madd-length classification (2/4/6 counts) — that
 * needs positional/phonetic context beyond what a regex over the bare
 * text can reliably determine, and getting it wrong is worse than
 * leaving it uncoloured.
 */

export type TajweedRule =
  | "ghunnah"
  | "qalqalah"
  | "iqlab"
  | "idgham"
  | "idghamNoGhunnah"
  | "ikhfa"
  | "hamzatWasl";

export type TajweedSegment = { text: string; rule: TajweedRule | null };

export const TAJWEED_RULE_INFO: {
  rule: TajweedRule;
  label: string;
  description: string;
}[] = [
  { rule: "ghunnah", label: "Ghunnah", description: "Nasal sound on doubled ن / م" },
  { rule: "qalqalah", label: "Qalqalah", description: "Echoing bounce on ق ط ب ج د" },
  { rule: "iqlab", label: "Iqlab", description: "ن sound turned into hidden م before ب" },
  { rule: "idgham", label: "Idgham (ghunnah)", description: "Merged into ي ن م و with nasal sound" },
  { rule: "idghamNoGhunnah", label: "Idgham (no ghunnah)", description: "Merged into ل ر, no nasal sound" },
  { rule: "ikhfa", label: "Ikhfa", description: "Hidden pronunciation before 15 letters" },
  { rule: "hamzatWasl", label: "Hamzat Wasl", description: "Connecting hamza, dropped mid-speech" },
];

// Uthmani character constants (matching the Tanzil-style encoding used by
// the underlying Quran text source).
const NUN = "ن";
const MIM = "م";
const QAF = "ق";
const TOA = "ط";
const BA = "ب";
const JIM = "ج";
const DAL = "د";
const SOAD = "ص";
const ZAL = "ذ";
const THA = "ث";
const KAF = "ك";
const WAW = "و";
const SHIN = "ش";
const SEEN = "س";
const ZAY = "ز";
const FA = "ف";
const TA = "ت";
const DOAD = "ض";
const ZOA = "ظ";
const RA = "ر";
const LAM = "ل";
const YA = "ي";

const FATHATAIN = "ً";
const DAMMATAIN = "ٌ";
const KASRATAIN = "ٍ";
const SHADDA = "ّ";
const SUKUN = "ْ";
const CURVY_SUKUN = "ۡ"; // alternate sukun used in some renderings
const SILENT_ALIF_CARRIER = "اى"; // bare alif / alif maksura riding a sakin letter
const SUPERSCRIPT_ALIF = "ٰ";
const HAMZAT_WASL = "ٱ";
const SPACE = " ";

// Small pause / stop marks that can sit between two letters without
// breaking a tajweed rule that spans across them.
const STOP_SIGNS = "ۖۗۘۙۚۛ";

const TANWEEN = `${FATHATAIN}${DAMMATAIN}${KASRATAIN}`;
const SAKIN_MARKS = `${SUKUN}${CURVY_SUKUN}`;
const NUN_SAKIN_OR_TANWEEN = `[${NUN}][${SAKIN_MARKS}]|[${TANWEEN}]`;
// Small meem marks (iqlab annotations), silent alif/ya carriers and stop
// signs can sit — in any order — between a sakin/tanween and the letter
// that governs its rule; skip over any run of them.
const SMALL_MEEM_MARKS = "ۭۢ";
const BRIDGE = `[${SILENT_ALIF_CARRIER}${SMALL_MEEM_MARKS}${STOP_SIGNS}]*${SPACE}?`;

const QALQALAH_LETTERS = `${QAF}${TOA}${BA}${JIM}${DAL}`;
const IKHFA_LETTERS = `${TA}${THA}${JIM}${DAL}${ZAL}${ZAY}${SEEN}${SHIN}${SOAD}${DOAD}${TOA}${ZOA}${FA}${QAF}${KAF}`;
const IDGHAM_GHUNNAH_LETTERS = `${YA}${NUN}${MIM}${WAW}`;
const IDGHAM_NO_GHUNNAH_LETTERS = `${LAM}${RA}`;

type Matcher = { rule: TajweedRule; pattern: RegExp };

const RULES: Matcher[] = [
  // Lowest priority first — later matches win where rules overlap.
  { rule: "hamzatWasl", pattern: new RegExp(HAMZAT_WASL, "g") },
  {
    rule: "qalqalah",
    pattern: new RegExp(
      `[${QALQALAH_LETTERS}](?:${SUKUN}|${CURVY_SUKUN}|$)`,
      "g",
    ),
  },
  { rule: "ghunnah", pattern: new RegExp(`[${NUN}${MIM}]${SHADDA}`, "g") },
  // Ikhfa: noon sakinah/tanween before one of the 15 ikhfa letters, or
  // meem sakinah before ba (ikhfa shafawi).
  {
    rule: "ikhfa",
    pattern: new RegExp(
      `(?:${NUN_SAKIN_OR_TANWEEN})${BRIDGE}[${IKHFA_LETTERS}]|${MIM}[${SAKIN_MARKS}]?${SPACE}?${BA}`,
      "g",
    ),
  },
  // Idgham without ghunnah: noon sakinah/tanween before lam or ra.
  {
    rule: "idghamNoGhunnah",
    pattern: new RegExp(
      `(?:${NUN_SAKIN_OR_TANWEEN})${BRIDGE}[${IDGHAM_NO_GHUNNAH_LETTERS}]`,
      "g",
    ),
  },
  // Idgham with ghunnah: noon sakinah/tanween before ي ن م و, or meem
  // sakinah before meem (idgham mithlain).
  {
    rule: "idgham",
    pattern: new RegExp(
      `(?:${NUN_SAKIN_OR_TANWEEN})${BRIDGE}[${IDGHAM_GHUNNAH_LETTERS}]${SHADDA}?|${MIM}[${STOP_SIGNS}${SAKIN_MARKS}]?${SPACE}${MIM}`,
      "g",
    ),
  },
  // Iqlab: noon sakinah/tanween before ba (often marked with a small
  // meem ۭ / ۢ in the Uthmani script).
  {
    rule: "iqlab",
    pattern: new RegExp(`(?:${NUN_SAKIN_OR_TANWEEN})${BRIDGE}${BA}`, "g"),
  },
];

/** Extend a match to swallow a trailing harakah/shadda so a letter's
 * diacritics never get split across two colours. */
function extendEnd(text: string, end: number): number {
  if (text[end] === SHADDA) {
    return text[end + 2] === SUPERSCRIPT_ALIF ? end + 3 : end + 2;
  }
  if (text[end] === SUPERSCRIPT_ALIF) return end + 1;
  return end;
}

export function parseTajweed(arabicText: string): TajweedSegment[] {
  const ruleAt = new Array<TajweedRule | null>(arabicText.length).fill(null);

  for (const { rule, pattern } of RULES) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(arabicText))) {
      const start = match.index;
      const end = extendEnd(arabicText, start + match[0].length);
      for (let i = start; i < end && i < ruleAt.length; i++) {
        ruleAt[i] = rule;
      }
      if (match[0].length === 0) pattern.lastIndex++;
    }
  }

  const segments: TajweedSegment[] = [];
  let i = 0;
  while (i < arabicText.length) {
    const rule = ruleAt[i];
    let j = i + 1;
    while (j < arabicText.length && ruleAt[j] === rule) j++;
    segments.push({ text: arabicText.slice(i, j), rule });
    i = j;
  }
  return segments;
}
