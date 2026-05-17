export const CABANG_LIST = [
  "jonggol",
  "pamijahan",
  "solo",
  "akhwat",
  "sentul",
] as const;

export type Cabang = (typeof CABANG_LIST)[number];

export const CABANG_LABEL: Record<Cabang, string> = {
  jonggol: "Jonggol",
  pamijahan: "Pamijahan",
  solo: "Solo",
  akhwat: "Akhwat",
  sentul: "Sentul",
};

export const CABANG_COLOR: Record<Cabang, string> = {
  jonggol: "bg-blue-100 text-blue-700 border-blue-200",
  pamijahan: "bg-emerald-100 text-emerald-700 border-emerald-200",
  solo: "bg-amber-100 text-amber-700 border-amber-200",
  akhwat: "bg-pink-100 text-pink-700 border-pink-200",
  sentul: "bg-violet-100 text-violet-700 border-violet-200",
};

export function isCabang(v: unknown): v is Cabang {
  return typeof v === "string" && (CABANG_LIST as readonly string[]).includes(v);
}
