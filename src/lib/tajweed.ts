/**
 * Tajweed colour coding sourced from quranjson's `tajweed/surah_N.json`
 * annotations (start/end character offsets + rule name per verse).
 *
 * That offset data was computed in 2019 against an older, non-Uthmani
 * rendering of the Arabic text ("الرحمن" style, no hamzat wasl / dagger
 * alif) that was later rewritten to proper Uthmani script — a change
 * confirmed in the submodule's own git history (commit "Arabic version
 * was missing 'Al-Madd' in all verses", applied right after the tajweed
 * commit). The raw offsets therefore drift out of alignment with today's
 * text: cross-checking ~61k annotations against the expected Arabic
 * letter for each rule shows only ~55% land correctly as-is.
 *
 * To use the data anyway, each annotation is reconciled against the
 * *current* verse text at render time: we look at what letter the rule
 * expects (e.g. hamzat_wasl always sits on ٱ) and search a small window
 * around the recorded offset for the nearest match. That resolves ~92%
 * of annotations with good confidence; the rest are dropped rather than
 * mis-coloured.
 */

export type TajweedRule =
  | "hamzatWasl"
  | "lamShamsiyyah"
  | "silent"
  | "ghunnah"
  | "qalqalah"
  | "ikhfa"
  | "iqlab"
  | "idgham"
  | "idghamNoGhunnah"
  | "madd2"
  | "madd246"
  | "madd6"
  | "maddMunfasil"
  | "maddMuttasil";

export type TajweedSegment = { text: string; rule: TajweedRule | null };

export type RawTajweedAnnotation = { rule: string; start: number; end: number };

export const TAJWEED_RULE_INFO: {
  rule: TajweedRule;
  label: string;
  description: string;
  cssVar: string;
}[] = [
  { rule: "hamzatWasl", label: "Hamzat Wasl", description: "Connecting hamza, dropped mid-speech", cssVar: "--tajweed-hamzat-wasl" },
  { rule: "lamShamsiyyah", label: "Lam Shamsiyyah", description: "Silent ل before a sun letter", cssVar: "--tajweed-lam-shamsiyyah" },
  { rule: "silent", label: "Silent letter", description: "Written but not pronounced", cssVar: "--tajweed-silent" },
  { rule: "ghunnah", label: "Ghunnah", description: "Nasal sound on doubled ن / م", cssVar: "--tajweed-ghunnah" },
  { rule: "qalqalah", label: "Qalqalah", description: "Echoing bounce on ق ط ب ج د", cssVar: "--tajweed-qalqalah" },
  { rule: "ikhfa", label: "Ikhfa", description: "Hidden pronunciation before 15 letters", cssVar: "--tajweed-ikhfa" },
  { rule: "iqlab", label: "Iqlab", description: "ن sound turned into hidden م before ب", cssVar: "--tajweed-iqlab" },
  { rule: "idgham", label: "Idgham (ghunnah)", description: "Merged with a nasal sound", cssVar: "--tajweed-idgham" },
  { rule: "idghamNoGhunnah", label: "Idgham (no ghunnah)", description: "Merged into ل ر, no nasal sound", cssVar: "--tajweed-idgham-no-ghunnah" },
  { rule: "madd2", label: "Madd (2 counts)", description: "Natural elongation", cssVar: "--tajweed-madd-2" },
  { rule: "madd246", label: "Madd (2/4/6 counts)", description: "Variable elongation at a pause", cssVar: "--tajweed-madd-246" },
  { rule: "madd6", label: "Madd (6 counts)", description: "Obligatory long elongation", cssVar: "--tajweed-madd-6" },
  { rule: "maddMunfasil", label: "Madd Munfasil", description: "Elongation across two words", cssVar: "--tajweed-madd-munfasil" },
  { rule: "maddMuttasil", label: "Madd Muttasil", description: "Obligatory elongation before hamza", cssVar: "--tajweed-madd-muttasil" },
];

// Maps the raw rule names found in tajweed/surah_N.json to our display
// rule, and the set of Arabic characters that rule is expected to land
// on in the *current* Uthmani text (used to re-anchor drifted offsets).
const MADD_CHARS = new Set("اويٰىۥۦ");
const SAKIN_TRIGGER_CHARS = new Set("نمًٌٍۭۢ");

type RuleSpec = {
  display: TajweedRule;
  expected: Set<string>;
  confirm?: (text: string, pos: number) => boolean;
};

const RAW_RULE_MAP: Record<string, RuleSpec> = {
  hamzat_wasl: { display: "hamzatWasl", expected: new Set("ٱ") },
  lam_shamsiyyah: { display: "lamShamsiyyah", expected: new Set("ل") },
  silent: { display: "silent", expected: MADD_CHARS },
  ghunnah: {
    display: "ghunnah",
    expected: new Set("نم"),
    confirm: (text, pos) => text[pos + 1] === "ّ", // shadda
  },
  qalqalah: { display: "qalqalah", expected: new Set("قطبجد") },
  ikhfa: { display: "ikhfa", expected: SAKIN_TRIGGER_CHARS },
  ikhfa_shafawi: { display: "ikhfa", expected: SAKIN_TRIGGER_CHARS },
  iqlab: { display: "iqlab", expected: SAKIN_TRIGGER_CHARS },
  idghaam_ghunnah: { display: "idgham", expected: SAKIN_TRIGGER_CHARS },
  idghaam_shafawi: { display: "idgham", expected: SAKIN_TRIGGER_CHARS },
  idghaam_mutajanisayn: { display: "idgham", expected: SAKIN_TRIGGER_CHARS },
  idghaam_mutaqaribayn: { display: "idgham", expected: SAKIN_TRIGGER_CHARS },
  idghaam_no_ghunnah: { display: "idghamNoGhunnah", expected: SAKIN_TRIGGER_CHARS },
  madd_2: { display: "madd2", expected: MADD_CHARS },
  madd_246: { display: "madd246", expected: MADD_CHARS },
  madd_6: { display: "madd6", expected: MADD_CHARS },
  madd_munfasil: { display: "maddMunfasil", expected: MADD_CHARS },
  madd_muttasil: { display: "maddMuttasil", expected: MADD_CHARS },
};

const SNAP_WINDOW = 4;

/** Find the nearest position to `start` (within a small window) whose
 * character satisfies the rule's expected set (and confirm check, if
 * any). Returns null if nothing plausible is nearby. */
function reanchor(text: string, start: number, spec: RuleSpec): number | null {
  const isMatch = (pos: number) =>
    pos >= 0 &&
    pos < text.length &&
    spec.expected.has(text[pos]) &&
    (!spec.confirm || spec.confirm(text, pos));

  if (isMatch(start)) return start;
  for (let d = 1; d <= SNAP_WINDOW; d++) {
    if (isMatch(start - d)) return start - d;
    if (isMatch(start + d)) return start + d;
  }
  return null;
}

export function resolveTajweedSegments(
  arabicText: string,
  annotations: RawTajweedAnnotation[] | undefined,
): TajweedSegment[] {
  // A stray leading BOM shows up in one verse of the underlying data;
  // the recorded offsets assume it isn't there, so strip it first.
  const text = arabicText.startsWith("﻿")
    ? arabicText.slice(1)
    : arabicText;

  const ruleAt = new Array<TajweedRule | null>(text.length).fill(null);

  for (const raw of annotations ?? []) {
    const spec = RAW_RULE_MAP[raw.rule];
    if (!spec) continue;
    const start = raw.start;
    const end = raw.end;
    if (start < 0 || end <= start) continue;

    const anchored = reanchor(text, start, spec);
    if (anchored === null) continue;

    const delta = anchored - start;
    const newStart = Math.max(0, start + delta);
    const newEnd = Math.min(text.length, end + delta);
    for (let i = newStart; i < newEnd; i++) ruleAt[i] = spec.display;
  }

  const segments: TajweedSegment[] = [];
  let i = 0;
  while (i < text.length) {
    const rule = ruleAt[i];
    let j = i + 1;
    while (j < text.length && ruleAt[j] === rule) j++;
    segments.push({ text: text.slice(i, j), rule });
    i = j;
  }
  return segments;
}
