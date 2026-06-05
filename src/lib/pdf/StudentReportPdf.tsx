import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";

/* ============================================================================
 * TYPES
 * ========================================================================== */

/* ============================================================================
 * PRINT CSS — inject this into the page that renders the PDF viewer.
 *
 * Usage in your React component:
 *   import { PRINT_PORTRAIT_CSS } from "./StudentReportPdf";
 *   useEffect(() => {
 *     const style = document.createElement("style");
 *     style.textContent = PRINT_PORTRAIT_CSS;
 *     document.head.appendChild(style);
 *     return () => document.head.removeChild(style);
 *   }, []);
 *
 * Or add it globally in your index.css / globals.css.
 * ========================================================================== */
export const PRINT_PORTRAIT_CSS = `
@page {
  size: A4 portrait;
  margin: 0;
}
@media print {
  html, body {
    width: 210mm;
    height: 297mm;
  }
  iframe, embed, object {
    width: 210mm !important;
    height: 297mm !important;
    page-break-inside: avoid;
  }
}
`;

export interface PdfIndicator {
  id: number;
  kode: string;
  deskripsi: string;
  nilai_max: number;
  nilai?: number | null;
  urutan?: number;
}

export interface PdfMaterial {
  id: number;
  judul: string;
  kode_rapor: string;
  nama_mapel?: string;
  indicators: PdfIndicator[];
}

export interface PdfReportData {
  student: {
    nama: string;
    email: string;
    linkedin?: string;
    photoDataUrl?: string | null;
    nama_kelas?: string;
  };
  semester: {
    nama_semester: string;
    tahun_ajaran: string;
    semester?: number;
  };
  teacher?: {
    nama: string;
    jabatan?: string;
    ttdDataUrl?: string | null;
  };
  generatedDate?: string;
  materials: PdfMaterial[];
  note?: string | null;
  comment?: string | null;
  schoolName?: string;
  coverBgDataUrl?: string | null;
  reportFirstBgDataUrl?: string | null;
  reportLastBgDataUrl?: string | null;
  dividerBgDataUrl?: string | null;
}

/* ============================================================================
 * COLORS
 * ========================================================================== */

const NAVY   = "#1e3a8a";
const ORANGE = "#f59e0b";
const TEXT   = "#1e293b";
const MUTED  = "#64748b";
const SOFT   = "#f8fafc";

/* ============================================================================
 * A4 LAYOUT CONSTANTS (unit: pt)
 * A4 = 595 x 842 pt
 *
 * Rumus: usable rows = 842 - paddingTop - paddingBottom - fixed sections
 *
 * paddingTop   : first=80, middle/last=55
 * paddingBottom: last=20, others=40
 * Student card : ~152pt (first only) — diukur dari komponen aktual
 * Comment+TTD  : ~215pt (last only)
 * Card overhead: header(40) + paddingV(24) + marginBottom(14) = 78pt per card
 * ========================================================================== */

const PAGE_H = 842;

// Page padding
// - first : larger top for bg image aesthetic
// - middle: tight top+bottom — no decorative elements, maximize card space
// - last  : tight bottom, normal top
const PAD_TOP_FIRST  = 80;
const PAD_TOP_MIDDLE = 28;   // was 55 — reduced to remove excess top space
const PAD_TOP_LAST   = 28;   // same as middle
const PAD_BOT_MIDDLE = 24;   // was 40 — reduced to remove excess bottom space
const PAD_BOT_LAST   = 20;
const PAD_BOT_FIRST  = 28;

// Fixed block heights (measured from rendered components)
// Student card: photoWrap(85) + scInfo paddingTop(10) + scName(18+12mb) +
//               detailText×2(10.5×2+10mb×2) + studentCard marginBottom(24)
const STUDENT_CARD_H  = 152;

// Comment+bottom: commentHeader(34) + commentBody(min56+padding28) +
//                 bottomSection paddingTop(14) + border(1) + skala(4×28=112) +
//                 marginTop(8) = ~253; use conservative 215 since minHeight flexible
const COMMENT_BLOCK_H = 215;

// Per-card fixed overhead
const CARD_HEADER_H  = 40;   // compHeader paddingV(10+10) + content
const CARD_PADDING_V = 24;   // compIndicators paddingVertical (12+12)
const CARD_MARGIN_B  = 14;   // compSection marginBottom

const IND_ROW_MIN_H = 22;
const IND_ROW_MAX_H = 34;

type PageType = "first" | "middle" | "last" | "firstlast";

/**
 * Total fixed overhead (pt) consumed by non-indicator content on a given page.
 */
function pageFixedOverhead(pageType: PageType): number {
  let padTop: number;
  let padBot: number;

  if (pageType === "first") {
    padTop = PAD_TOP_FIRST; padBot = PAD_BOT_FIRST;
  } else if (pageType === "last") {
    padTop = PAD_TOP_LAST; padBot = PAD_BOT_LAST;
  } else if (pageType === "firstlast") {
    padTop = PAD_TOP_FIRST; padBot = PAD_BOT_LAST;
  } else {
    padTop = PAD_TOP_MIDDLE; padBot = PAD_BOT_MIDDLE;
  }

  const studentCard  = pageType === "first" || pageType === "firstlast" ? STUDENT_CARD_H  : 0;
  const commentBlock = pageType === "last"  || pageType === "firstlast" ? COMMENT_BLOCK_H : 0;
  const cardsOverhead = 2 * (CARD_HEADER_H + CARD_PADDING_V + CARD_MARGIN_B);

  return padTop + padBot + studentCard + commentBlock + cardsOverhead;
}

/**
 * Compute the ideal indicator row height so that all indicator rows across
 * the 2 cards on this page fit exactly within A4 height.
 * Clamped between IND_ROW_MIN_H and IND_ROW_MAX_H.
 */
function calcIndRowHeight(mats: PdfMaterial[], pageType: PageType): number {
  const totalInds    = mats.reduce((s, m) => s + m.indicators.length, 0);
  const fixed        = pageFixedOverhead(pageType);
  const availForRows = PAGE_H - fixed;
  const ideal        = totalInds > 0 ? availForRows / totalInds : IND_ROW_MAX_H;
  return Math.max(IND_ROW_MIN_H, Math.min(IND_ROW_MAX_H, ideal));
}

/* ============================================================================
 * STATIC STYLES
 * ========================================================================== */

const styles = StyleSheet.create({
  page: {
    position: "relative",
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    color: TEXT,
    // Explicit dimensions lock the PDF MediaBox to A4 portrait (595×842 pt).
    // This prevents printer drivers from auto-rotating pages when content
    // height > width is not explicitly declared in the page dictionary.
    width: 595,
    height: 842,
    minWidth: 595,
    maxWidth: 595,
    minHeight: 842,
    maxHeight: 842,
  },

  absoluteBg: {
    position: "absolute",
    top: 0, left: 0,
    // Use explicit pt values (595×842) instead of "100%" to guarantee the image
    // never exceeds the page dimensions — prevents landscape inference by viewers.
    width: 595,
    height: 842,
    objectFit: "fill",
  },

  pageContent: { flex: 1, position: "relative" },

  coverContent: { position: "relative", width: "100%", height: "100%" },

  coverStudentName: {
    position: "absolute",
    bottom: 78, left: 0, right: 0,
    fontSize: 18,
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
    textAlign: "center",
  },

  coverSemesterLine: {
    position: "absolute",
    bottom: 50, left: 0, right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  coverSemesterText: {
    fontSize: 14, color: "#ffffff",
    fontFamily: "Helvetica", letterSpacing: 0.5,
  },

  coverSemesterSuffix: {
    fontSize: 8, color: "#ffffff",
    fontFamily: "Helvetica", lineHeight: 1, marginTop: -1,
  },

  forewordPage: { paddingTop: 70, paddingHorizontal: 60, paddingBottom: 60 },

  forewordHeading: {
    fontSize: 28, fontFamily: "Helvetica-Bold",
    color: NAVY, marginBottom: 2,
  },

  forewordSubheading: { fontSize: 14, color: NAVY, marginBottom: 28 },

  forewordParagraph: {
    fontSize: 11, lineHeight: 1.9, textAlign: "justify",
    color: "#334155", marginBottom: 14, textIndent: 30,
  },

  forewordParagraphNoIndent: {
    fontSize: 11, lineHeight: 1.9, textAlign: "justify",
    color: "#334155", marginBottom: 14,
  },

  // Base report body — middle pages
  // maxHeight clips content so it never pushes page beyond 842pt (which causes
  // printer drivers to auto-rotate to landscape).
  reportBody: {
    paddingTop: PAD_TOP_MIDDLE,
    paddingHorizontal: 42,
    paddingBottom: PAD_BOT_MIDDLE,
    maxHeight: 842,
    overflow: "hidden",
  },

  // Overrides for first / last pages
  reportBodyFirst: { paddingTop: PAD_TOP_FIRST },
  reportBodyLast:  { paddingTop: PAD_TOP_LAST, paddingBottom: PAD_BOT_LAST },

  // ── Student Card ─────────────────────────────────────────────────────────
  studentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },

  scLeft:   { flexDirection: "row", flex: 1 },

  scPhotoWrap: {
    width: 82, height: 85,
    borderRadius: 10, overflow: "hidden",
    backgroundColor: "#e2e8f0",
    marginTop: 13, marginLeft: 2,
  },

  scPhoto: { width: "100%", height: "100%", objectFit: "cover" },

  avatarPlaceholder: {
    width: "100%", height: "100%",
    justifyContent: "center", alignItems: "center",
    backgroundColor: "#94a3b8",
  },

  avatarInitials: {
    fontSize: 28, color: "#ffffff", fontFamily: "Helvetica-Bold",
  },

  scInfo: { marginLeft: 14, paddingTop: 10, flex: 1 },

  scName: {
    paddingTop: 10, fontSize: 18,
    fontFamily: "Helvetica-Bold", color: NAVY, marginBottom: 12,
  },

  detailText: {
    paddingLeft: 25, fontSize: 10.5, color: MUTED, marginBottom: 10,
  },

  scRight: { alignItems: "flex-end", paddingRight: 33, paddingTop: 28 },

  scAvgValue: {
    fontSize: 38, lineHeight: 1,
    fontFamily: "Helvetica-Bold", color: NAVY,
    marginBottom: 8, paddingRight: 5,
  },

  scAvgBadge: {
    borderRadius: 20, paddingLeft: 5,
    paddingHorizontal: 12, paddingVertical: 5,
  },

  scAvgBadgeText: {
    color: "#ffffff", fontSize: 10, fontFamily: "Helvetica-Bold",
  },

  // ── Material Card ─────────────────────────────────────────────────────────
  compSection: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dbe4f0",
    overflow: "hidden",
    marginBottom: CARD_MARGIN_B,
  },

  compHeader: {
    backgroundColor: "#f8fafc",
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 5,
    borderLeftColor: NAVY,
  },

  compTitleText: {
    fontSize: 12, fontFamily: "Helvetica-Bold",
    color: NAVY, flex: 1, marginRight: 10,
  },

  compScoreText: {
    fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827",
  },

  compIndicators: { paddingVertical: 12 },

  indRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  indNum: {
    width: 20, height: 20,
    borderRadius: 4,
    backgroundColor: SOFT,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    textAlign: "center",
    paddingTop: 4,
    flexShrink: 0,
  },

  indText: {
    flex: 1,
    fontSize: 8,
    lineHeight: 1.35,
    color: "#334155",
    marginLeft: 7,
    marginRight: 18,
  },

  progressWrapper: { width: 124, flexShrink: 0 },

  progressBarWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  progressSegmentsRow: {
    flexDirection: "row",
    width: 82,
    gap: 2,
  },

  progressSegment: {
    width: 13, height: 7, borderRadius: 10,
  },

  progressSegmentPartial: {
    width: 13, height: 7, borderRadius: 10,
    overflow: "hidden", flexDirection: "row",
  },

  progressSegmentPartialFill:  { height: 7, backgroundColor: ORANGE },
  progressSegmentPartialEmpty: { height: 7, backgroundColor: "#dbe4f0" },

  progressValue: {
    width: 32, height: 18,
    borderRadius: 4,
    backgroundColor: ORANGE,
    justifyContent: "center",
    alignItems: "center",
  },

  progressValueText: {
    color: "#ffffff", fontSize: 8, fontFamily: "Helvetica-Bold",
  },

  // ── Comment + Bottom Section ──────────────────────────────────────────────
  commentOuter: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
    marginBottom: 14,
  },

  commentHeader: { paddingVertical: 10, paddingHorizontal: 14 },

  commentTitle: {
    fontSize: 12, fontFamily: "Helvetica-Bold", color: TEXT,
  },

  commentBody: {
    backgroundColor: "#f8fafc",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    padding: 14,
    minHeight: 56,
  },

  commentText: { fontSize: 10, color: "#475569", lineHeight: 1.6 },

  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 8,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },

  scaleSection: { flex: 1, paddingRight: 20 },

  scaleTitle: {
    fontSize: 10, fontFamily: "Helvetica-Bold",
    color: TEXT, marginBottom: 8,
  },

  scaleRow: {
    flexDirection: "row", alignItems: "center",
    marginBottom: 6, gap: 6,
  },

  scaleBadge: {
    width: 52, borderRadius: 4,
    paddingVertical: 4, paddingHorizontal: 6, alignItems: "center",
  },

  scaleBadgeText: {
    fontSize: 8, fontFamily: "Helvetica-Bold", color: "#ffffff",
  },

  scaleLabel: {
    flex: 1, borderRadius: 4, paddingVertical: 4, paddingHorizontal: 8,
  },

  scaleLabelTextRed:    { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#dc2626" },
  scaleLabelTextOrange: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#ea580c" },
  scaleLabelTextBlue:   { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#2563eb" },
  scaleLabelTextGreen:  { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#16a34a" },

  signatureSection: { alignItems: "center", minWidth: 160 },

  signatureDate: {
    fontSize: 9, color: MUTED, marginBottom: 2, textAlign: "center",
  },

  signaturePlaceholder: {
    width: 130, height: 60,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  signatureImage: {
    width: 130, height: 60, objectFit: "contain", marginBottom: 8,
  },

  signatureName: {
    fontSize: 10, fontFamily: "Helvetica-Bold",
    color: NAVY, textAlign: "center",
  },

  signatureRole: {
    fontSize: 8, color: MUTED, textAlign: "center", marginTop: 2,
  },

  pageNumber: {
    position: "absolute",
    bottom: 14, right: 24,
    fontSize: 9, color: "#64748b",
  },
});

/* ============================================================================
 * HELPERS
 * ========================================================================== */

function toDirectImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  if (driveFileMatch) return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
  const driveIdMatch = url.match(/drive\.google\.com\/(?:open|uc)\?(?:.*&)?id=([^&]+)/);
  if (driveIdMatch) return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
  return url;
}

function truncateText(text: string, maxLength = 26): string {
  if (!text) return text;
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function calculateOverallAverage(materials: PdfMaterial[]) {
  let total = 0, count = 0;
  materials.forEach((m) =>
    m.indicators.forEach((i) => {
      if (i.nilai !== null && i.nilai !== undefined) { total += Number(i.nilai); count++; }
    })
  );
  return count > 0 ? total / count : 0;
}

function calculateMaterialAverage(material: PdfMaterial[]) {
  let total = 0, count = 0;
  material.forEach((m) =>
    m.indicators.forEach((i) => {
      if (i.nilai !== null && i.nilai !== undefined) { total += Number(i.nilai); count++; }
    })
  );
  return count > 0 ? total / count : 0;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function getBadgeLabel(avg: number) {
  if (avg >= 4.6) return "Sangat Memuaskan";
  if (avg >= 3.6) return "Sangat Baik";
  if (avg >= 2.5) return "Cukup";
  return "Butuh Perbaikan";
}

function getBadgeColor(avg: number) {
  if (avg >= 4.6) return "#16a34a";
  if (avg >= 3.6) return "#2563eb";
  if (avg >= 2.5) return "#ea580c";
  return "#dc2626";
}

function getScaleColor(nilai: number) {
  if (nilai >= 4.6) return "#16a34a";
  if (nilai >= 3.6) return "#2563eb";
  if (nilai >= 2.5) return "#ea580c";
  return "#dc2626";
}

function splitSemesterLabel(label: string) {
  if (label === "1st semester") return { number: "1", suffix: "st ", rest: " Semester" };
  if (label === "2nd semester") return { number: "2", suffix: "nd ", rest: " Semester" };
  return null;
}

/** Selalu 2 material per halaman, kecuali sisa 1 */
function chunkMaterials<T>(arr: T[], size = 2): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}

/* ============================================================================
 * PROGRESS BAR
 * ========================================================================== */

function ProgressBar({ nilai, max = 5 }: { nilai: number; max: number }) {
  const totalSegs = 5;
  const exactFill = (nilai / max) * totalSegs;
  const fullSegs  = Math.floor(exactFill);
  const partial   = exactFill - fullSegs;
  const color     = getScaleColor(nilai);

  return (
    <View style={styles.progressWrapper}>
      <View style={styles.progressBarWrap}>
        <View style={styles.progressSegmentsRow}>
          {Array.from({ length: totalSegs }).map((_, i) => {
            if (i < fullSegs) {
              return <View key={i} style={[styles.progressSegment, { backgroundColor: color }]} />;
            } else if (i === fullSegs && partial > 0 && partial < 1) {
              return (
                <View key={i} style={styles.progressSegmentPartial}>
                  <View style={[styles.progressSegmentPartialFill, { backgroundColor: color, width: `${partial * 100}%` }]} />
                  <View style={[styles.progressSegmentPartialEmpty, { width: `${(1 - partial) * 100}%` }]} />
                </View>
              );
            } else {
              return <View key={i} style={[styles.progressSegment, { backgroundColor: "#dbe4f0" }]} />;
            }
          })}
        </View>
        <View style={[styles.progressValue, { backgroundColor: color }]}>
          <Text style={styles.progressValueText}>{nilai.toFixed(1)}</Text>
        </View>
      </View>
    </View>
  );
}

/* ============================================================================
 * SKALA ROW
 * ========================================================================== */

function SkalaRow({ range, label, badgeColor, bgColor, textStyle }: {
  range: string; label: string; badgeColor: string; bgColor: string; textStyle: any;
}) {
  return (
    <View style={styles.scaleRow}>
      <View style={[styles.scaleBadge, { backgroundColor: badgeColor }]}>
        <Text style={styles.scaleBadgeText}>{range}</Text>
      </View>
      <View style={[styles.scaleLabel, { backgroundColor: bgColor }]}>
        <Text style={textStyle}>{label}</Text>
      </View>
    </View>
  );
}

/* ============================================================================
 * MATERIAL CARD — indRowH adaptif
 * ========================================================================== */

function MaterialCard({
  material,
  indRowH,
}: {
  material: PdfMaterial;
  indRowH: number;
}) {
  const avg = calculateMaterialAverage([material]);
  return (
    <View style={styles.compSection}>
      {/* Header: fixed height = CARD_HEADER_H (40pt) */}
      <View style={styles.compHeader}>
        <Text style={styles.compTitleText}>{material.judul}</Text>
        <Text style={styles.compScoreText}>{avg.toFixed(1)}</Text>
      </View>

      {/* Indicators: paddingVertical 12pt each side = CARD_PADDING_V (24pt) total */}
      <View style={styles.compIndicators}>
        {material.indicators.map((ind, idx) => (
          <View
            key={ind.id}
            style={[
              styles.indRow,
              {
                height: indRowH,
                // No extra marginBottom — height is the full row budget
              },
            ]}
          >
            <Text style={styles.indNum}>{idx + 1}</Text>
            <Text style={styles.indText} numberOfLines={2}>{ind.deskripsi}</Text>
            <ProgressBar nilai={ind.nilai ?? 0} max={ind.nilai_max} />
          </View>
        ))}
      </View>
    </View>
  );
}

/* ============================================================================
 * MAIN COMPONENT
 * ========================================================================== */

export function StudentReportPdf({ data }: { data: PdfReportData }) {
  const overallAvg  = calculateOverallAverage(data.materials);
  const badgeColor  = getBadgeColor(overallAvg);
  const badgeLabel  = getBadgeLabel(overallAvg);
  const studentName = data.student.nama || "-";

  const namaKelasRaw = data.student.nama_kelas || "-";
  const kelasMatch   = namaKelasRaw.match(/^(\d+)/);
  const kelasNum     = kelasMatch ? parseInt(kelasMatch[1]) : null;
  const studentClass = kelasNum === 7 || kelasNum === 8 ? String(kelasNum) : namaKelasRaw;

  let semesterLabel = data.semester.nama_semester || "";
  const semNum  = data.semester.semester;
  const lower   = (data.semester.nama_semester || "").toLowerCase();
  if (semNum === 1 || lower.includes("ganjil"))
    semesterLabel = "1st semester";
  else if (semNum === 2 || lower.includes("genap") || lower.includes("gasal"))
    semesterLabel = "2nd semester";

  const semesterParts = splitSemesterLabel(semesterLabel);
  const photoUrl      = toDirectImageUrl(data.student.photoDataUrl);
  const ttdUrl        = toDirectImageUrl(data.teacher?.ttdDataUrl);

  // Always 2 materials per page (last page may have 1)
  const materialPages = chunkMaterials(data.materials, 2);
  const totalPages    = materialPages.length;

  return (
    <Document
      pageLayout="singlePage"
      creator="StudentReport"
      producer="react-pdf"
    >

      {/* ── COVER ──────────────────────────────────────────────────────────── */}
      <Page size={[595, 842]} orientation="portrait" style={styles.page}>
        {data.coverBgDataUrl && (
          <Image src={data.coverBgDataUrl} style={styles.absoluteBg} fixed />
        )}
        <View style={styles.pageContent}>
          <View style={styles.coverContent}>
            <Text style={styles.coverStudentName}>{studentName}</Text>
            <View style={styles.coverSemesterLine}>
              <Text style={styles.coverSemesterText}>{studentClass} Grade | </Text>
              {semesterParts ? (
                <>
                  <Text style={styles.coverSemesterText}>{semesterParts.number}</Text>
                  <Text style={styles.coverSemesterSuffix}>{semesterParts.suffix}</Text>
                  <Text style={styles.coverSemesterText}>{semesterParts.rest}</Text>
                </>
              ) : (
                <Text style={styles.coverSemesterText}>{semesterLabel}</Text>
              )}
            </View>
          </View>
        </View>
      </Page>

      {/* ── FOREWORD ───────────────────────────────────────────────────────── */}
      <Page size={[595, 842]} orientation="portrait" style={styles.page}>
        <View style={styles.forewordPage}>
          <Text style={styles.forewordHeading}>Foreword</Text>
          <Text style={styles.forewordSubheading}>Prakata</Text>
          <Text style={styles.forewordParagraph}>
            Alhamdulillahirabbil Alamin, segala puja dan puji syukur kami panjatkan kepada Allah
            subhanahu wa ta'ala, tanpa karunia-Nya, mustahil rasanya naskah laporan pencapaian
            belajar siswa ini terselesaikan tepat waktu mengingat tugas dan kewajiban lain yang
            bersamaan hadir.
          </Text>
          <Text style={styles.forewordParagraphNoIndent}>
            Kami benar-benar merasa tertantang untuk mewujudkan naskah laporan ini sebagai
            bagian dari bentuk kewajiban kami sebagai guru untuk melaporkan pencapaian yang
            telah siswa dapatkan selama satu semester.
          </Text>
          <Text style={styles.forewordParagraphNoIndent}>
            Berdasarkan pembelajaran selama satu semester siswa mengalami berbagai perkembangan
            yang wajib kami laporkan kepada wali siswa gunanya sebagai motivasi bagi seluruh
            elemen baik guru, siswa, wali siswa untuk mewujudkan tujuan kita bersama yang sesuai
            dengan slogan SMP - SMK IDN Boarding School yaitu "Expert Factory".
          </Text>
          <Text style={styles.forewordParagraphNoIndent}>
            Kami juga menyampaikan ucapan terima kasih kepada seluruh elemen terkait yang telah
            memberikan sumbangsih terwujudnya laporan pencapaian siswa pada semester ini, kami
            menyadari bahwa masih banyak kekurangan dalam penyajian laporan ini, karena itu,
            kami berharap agar pembaca berkenan menyampaikan masukan yang membangun.
          </Text>
          <Text style={styles.forewordParagraphNoIndent}>
            Akhir kata, kami berharap agar laporan ini dapat membawa manfaat kepada pembaca.
            Secara khusus, kami berharap semoga laporan ini dapat menginspirasi siswa agar
            menjadi generasi yang siap menghadapi perubahan teknologi kedepannya yang disertai
            dengan akhlak yang baik.
          </Text>
        </View>
      </Page>

      {/* ── DIVIDER ────────────────────────────────────────────────────────── */}
      <Page size={[595, 842]} orientation="portrait" style={styles.page}>
        {data.dividerBgDataUrl && (
          <Image src={data.dividerBgDataUrl} style={styles.absoluteBg} />
        )}
      </Page>

      {/* ── REPORT PAGES — tepat 2 material per halaman, layout adaptif ───── */}
      {materialPages.map((pageMaterials, pageIndex) => {
        const isFirst     = pageIndex === 0;
        const isLast      = pageIndex === totalPages - 1;
        const isFirstLast = isFirst && isLast;

        const pageType: PageType = isFirstLast ? "firstlast"
          : isFirst ? "first"
          : isLast  ? "last"
          : "middle";

        // Adaptive row height: fills available space, never under-/over-flows A4
        const indRowH = calcIndRowHeight(pageMaterials, pageType);

        // Background image: first page uses reportFirstBg, last uses reportLastBg
        const bgUrl: string | null = isFirst
          ? (data.reportFirstBgDataUrl ?? null)
          : isLast
            ? (data.reportLastBgDataUrl ?? null)
            : null;

        return (
          <Page
            key={pageIndex}
            size={[595, 842]}
            orientation="portrait"
            style={styles.page}
            wrap={false}
          >
            {bgUrl && <Image src={bgUrl} style={styles.absoluteBg} />}

            <View style={styles.pageContent}>
              <View
                style={[
                  styles.reportBody,
                  isFirst ? styles.reportBodyFirst : {},
                  isLast  ? styles.reportBodyLast  : {},
                ]}
              >
                {/* ── Student Card — first page only ───────────────────────── */}
                {isFirst && (
                  <View style={styles.studentCard}>
                    <View style={styles.scLeft}>
                      <View style={styles.scPhotoWrap}>
                        {photoUrl ? (
                          <Image src={photoUrl} style={styles.scPhoto} />
                        ) : (
                          <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarInitials}>{getInitials(studentName)}</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.scInfo}>
                        <Text style={styles.scName}>{studentName}</Text>
                        <Text style={styles.detailText}>{truncateText(data.student.email)}</Text>
                        {data.student.linkedin && (
                          <Text style={styles.detailText}>{truncateText(data.student.linkedin)}</Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.scRight}>
                      <Text style={styles.scAvgValue}>{overallAvg.toFixed(2)}</Text>
                      <View style={[styles.scAvgBadge, { backgroundColor: badgeColor }]}>
                        <Text style={styles.scAvgBadgeText}>{badgeLabel}</Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* ── 2 Material Cards ─────────────────────────────────────── */}
                {pageMaterials.map((material) => (
                  <MaterialCard
                    key={material.id}
                    material={material}
                    indRowH={indRowH}
                  />
                ))}

                {/* ── Comment + Scale + Signature — last page only ─────────── */}
                {isLast && (
                  <>
                    <View style={styles.commentOuter}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentTitle}>Comment</Text>
                      </View>
                      <View style={styles.commentBody}>
                        <Text style={styles.commentText}>
                          {data.comment ||
                            "Disini akan tampil feedback dari guru pengampu tentang progres mapping skill dan ability siswa dalam pelajaran bahasa inggris dan praktek nya."}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.bottomSection}>
                      <View style={styles.scaleSection}>
                        <Text style={styles.scaleTitle}>Skala Nilai Rata-rata :</Text>
                        <SkalaRow
                          range="0 - 2.4"
                          label="Butuh Perbaikan"
                          badgeColor="#dc2626"
                          bgColor="#fee2e2"
                          textStyle={styles.scaleLabelTextRed}
                        />
                        <SkalaRow
                          range="2.5 - 3.5"
                          label="Cukup"
                          badgeColor="#ea580c"
                          bgColor="#ffedd5"
                          textStyle={styles.scaleLabelTextOrange}
                        />
                        <SkalaRow
                          range="3.6 - 4.5"
                          label="Sangat Baik"
                          badgeColor="#2563eb"
                          bgColor="#dbeafe"
                          textStyle={styles.scaleLabelTextBlue}
                        />
                        <SkalaRow
                          range="4.6 - 5"
                          label="Sangat Memuaskan"
                          badgeColor="#16a34a"
                          bgColor="#dcfce7"
                          textStyle={styles.scaleLabelTextGreen}
                        />
                      </View>

                      <View style={styles.signatureSection}>
                        <Text style={styles.signatureDate}>{data.generatedDate || "Tanggal"}</Text>
                        {ttdUrl ? (
                          <Image src={ttdUrl} style={styles.signatureImage} />
                        ) : (
                          <View style={styles.signaturePlaceholder}>
                            <Text style={{ fontSize: 8, color: MUTED }}>TTD</Text>
                          </View>
                        )}
                        <Text style={styles.signatureName}>{data.teacher?.nama || "Nama Guru"}</Text>
                        <Text style={styles.signatureRole}>{data.teacher?.jabatan || "Guru"}</Text>
                      </View>
                    </View>
                  </>
                )}
              </View>

              {/* Page number */}
              <Text
                style={styles.pageNumber}
                render={({ pageNumber }) => `${pageNumber}`}
                fixed
              />
            </View>
          </Page>
        );
      })}
    </Document>
  );
}
