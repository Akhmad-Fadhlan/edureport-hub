import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

/* ============================================================================
 * TYPES
 * ========================================================================== */

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

  materials: PdfMaterial[];
  note?: string | null;
  schoolName?: string;

  coverBgDataUrl?: string | null;
  reportFirstBgDataUrl?: string | null;
  reportLastBgDataUrl?: string | null;
  maskBgDataUrl?: string | null;
}

/* ============================================================================
 * COLORS
 * ========================================================================== */

const NAVY = "#1e3a8a";
const ORANGE = "#f59e0b";
const TEXT = "#1e293b";
const MUTED = "#64748b";
const SOFT = "#f8fafc";

/* ============================================================================
 * STYLES
 * ========================================================================== */

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    color: TEXT,
  },

  /* ==========================================================================
   * BACKGROUNDS
   * ======================================================================== */

  bgAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },

  maskAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.08,
  },

  /* ==========================================================================
   * COVER
   * ======================================================================== */

  coverTopContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 48,
    paddingRight: 48,
    paddingTop: 60,
  },

  coverReportLabel: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 2,
  },

  coverSchoolName: {
    fontSize: 52,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    lineHeight: 1.1,
    marginBottom: 12,
  },

  coverTagline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 1.5,
  },

  coverBottomContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 48,
    paddingLeft: 48,
    paddingRight: 48,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  coverGradeText: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
  },

  coverSeparator: {
    width: 1,
    height: 18,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 12,
  },

  coverSemesterText: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
  },

  /* ==========================================================================
   * FOREWORD
   * ======================================================================== */

  forewordPage: {
    paddingTop: 80,
    paddingHorizontal: 55,
    paddingBottom: 55,
  },

  forewordSmallTitle: {
    fontSize: 12,
    color: MUTED,
    textAlign: "center",
    marginBottom: 4,
  },

  forewordTitle: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    textAlign: "center",
    marginBottom: 26,
  },

  forewordParagraph: {
    fontSize: 11,
    lineHeight: 1.85,
    textAlign: "justify",
    color: "#334155",
    marginBottom: 14,
  },

  /* ==========================================================================
   * REPORT BODY
   * ======================================================================== */

  reportBody: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 42,
  },

  watermark: {
    position: "absolute",
    top: "42%",
    left: 60,
    fontSize: 44,
    color: "rgba(30,41,59,0.04)",
    transform: "rotate(-20deg)",
    fontFamily: "Helvetica-Bold",
  },

  /* ==========================================================================
   * STUDENT CARD
   * ======================================================================== */

  studentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 22,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#dbe4f0",
  },

  scLeft: {
    flexDirection: "row",
    flex: 1,
  },

  scPhotoWrap: {
    width: 82,
    height: 82,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#e2e8f0",
  },

  scPhoto: {
    width: 82,
    height: 82,
    objectFit: "cover",
  },

  avatarPlaceholder: {
    width: 82,
    height: 82,
    backgroundColor: "#94a3b8",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarInitials: {
    fontSize: 28,
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
  },

  scInfo: {
    marginLeft: 14,
    paddingTop: 10,
    flex: 1,
  },

  scName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 10,
  },

  detailText: {
    fontSize: 10.5,
    color: MUTED,
    marginBottom: 5,
  },

  scRight: {
    alignItems: "flex-end",
    minWidth: 100,
  },

  scAvgValue: {
    fontSize: 42,
    lineHeight: 1,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 8,
  },

  scAvgBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },

  scAvgBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },

  /* ==========================================================================
   * MATERIALS
   * ======================================================================== */

  compSection: {
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dbe4f0",
    overflow: "hidden",
    marginBottom: 14,
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
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    flex: 1,
    marginRight: 10,
  },

  compScoreText: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },

  compIndicators: {
    paddingVertical: 12,
  },

  indRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  indNum: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: SOFT,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    textAlign: "center",
    paddingTop: 5,
  },

  indText: {
    flex: 1,
    fontSize: 8.5,
    lineHeight: 1.45,
    color: "#334155",
    marginLeft: 8,
    marginRight: 10,
  },

  /* ==========================================================================
   * PROGRESS BAR
   * ======================================================================== */

  progressWrapper: {
    width: 130,
    flexShrink: 0,
  },

  progressBarWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  progressSegmentsRow: {
    flexDirection: "row",
    width: 86,
    gap: 2,
  },

  progressSegment: {
    width: 14,
    height: 8,
    borderRadius: 10,
  },

  progressValue: {
    width: 34,
    height: 20,
    borderRadius: 5,
    backgroundColor: ORANGE,
    justifyContent: "center",
    alignItems: "center",
  },

  progressValueText: {
    color: "#ffffff",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },

  progressLabel: {
    fontSize: 7,
    color: MUTED,
    marginTop: 3,
    textAlign: "right",
  },

  /* ==========================================================================
   * LAST PAGE EXTRAS
   * ======================================================================== */

  nilaiExplanation: {
    marginTop: 12,
    padding: 10,
    backgroundColor: SOFT,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  nilaiExplanationTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 4,
  },

  nilaiExplanationText: {
    fontSize: 8,
    color: MUTED,
    lineHeight: 1.5,
  },

  commentBox: {
    backgroundColor: "#fefce8",
    borderLeftWidth: 4,
    borderLeftColor: ORANGE,
    borderRadius: 8,
    padding: 14,
    marginTop: 14,
  },

  commentTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 6,
  },

  commentText: {
    fontSize: 10,
    color: "#475569",
    lineHeight: 1.5,
  },

  sigSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },

  sigBlock: {
    width: 180,
    alignItems: "center",
  },

  sigMeta: {
    fontSize: 10,
    color: "#475569",
    marginBottom: 4,
  },

  sigBox: {
    width: 160,
    height: 70,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  sigName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
  },

  pageNumber: {
    position: "absolute",
    bottom: 12,
    right: 22,
    fontSize: 9,
    color: "#64748b",
  },
});

/* ============================================================================
 * HELPERS
 * ========================================================================== */

function extractProgramName(schoolName: string): string {
  // "SMP JAGOAN IT" → "JAGOAN IT"
  // "SMP IDN Boarding School" → "IDN Boarding School"
  // "JAGOAN IT" → "JAGOAN IT" (no change if no prefix)
  return schoolName.replace(/^SMP\s+/i, "").trim();
}

function getBadgeLabel(avg: number): string {
  if (avg >= 4.6) return "Sangat Memuaskan";
  if (avg >= 3.6) return "Sangat Baik";
  if (avg >= 2.5) return "Cukup";
  return "Butuh Perbaikan";
}

function getBadgeColor(avg: number): string {
  if (avg >= 4.6) return "#16a34a";
  if (avg >= 3.6) return "#2563eb";
  if (avg >= 2.5) return "#ea580c";
  return "#dc2626";
}

function calculateOverallAverage(materials: PdfMaterial[]): number {
  let total = 0;
  let count = 0;
  for (const material of materials) {
    for (const indicator of material.indicators) {
      if (indicator.nilai !== null && indicator.nilai !== undefined) {
        total += Number(indicator.nilai);
        count++;
      }
    }
  }
  return count > 0 ? total / count : 0;
}

function calculateMaterialAverage(material: PdfMaterial): number {
  let total = 0;
  let count = 0;
  for (const indicator of material.indicators) {
    if (indicator.nilai !== null && indicator.nilai !== undefined) {
      total += Number(indicator.nilai);
      count++;
    }
  }
  return count > 0 ? total / count : 0;
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function chunkMaterials<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/* ============================================================================
 * PROGRESS BAR COMPONENT
 * ========================================================================== */

function ProgressBar({ nilai, max = 5 }: { nilai: number; max: number }) {
  const totalSegs = 5;
  const filled = Math.min(Math.round((nilai / max) * totalSegs), totalSegs);
  const percentage = ((nilai / max) * 100).toFixed(0);

  return (
    <View style={styles.progressWrapper}>
      <View style={styles.progressBarWrap}>
        <View style={styles.progressSegmentsRow}>
          {Array.from({ length: totalSegs }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressSegment,
                { backgroundColor: i < filled ? NAVY : "#dbe4f0" },
              ]}
            />
          ))}
        </View>
        <View style={styles.progressValue}>
          <Text style={styles.progressValueText}>{nilai.toFixed(1)}</Text>
        </View>
      </View>
      <Text style={styles.progressLabel}>
        {percentage}% dari {max}
      </Text>
    </View>
  );
}

/* ============================================================================
 * MAIN DOCUMENT COMPONENT
 * ========================================================================== */

export function StudentReportPdf({ data }: { data: PdfReportData }) {
  const overallAvg = calculateOverallAverage(data.materials);
  const badgeColor = getBadgeColor(overallAvg);
  const badgeLabel = getBadgeLabel(overallAvg);

  const studentName = data.student.nama || "-";
  const studentEmail = data.student.email || "-";
  const studentLinkedIn = data.student.linkedin || "-";
  const studentClass = data.student.nama_kelas || "-";
  const initials = getInitials(studentName);

  const schoolName = data.schoolName || "SMP JAGOAN IT";
  // "SMP JAGOAN IT" → label kecil pakai "SMP", baris besar pakai "JAGOAN IT"
  const programName = extractProgramName(schoolName);

  const semesterNum = data.semester.semester || 1;
  const semesterLabel =
    [data.semester.nama_semester, data.semester.tahun_ajaran]
      .filter(Boolean)
      .join(" ") || `${semesterNum}nd Semester`;

  const noteText = data.note || "Belum ada catatan.";
  const teacherName = data.teacher?.nama || "Guru Pembimbing";

  const materialPages = chunkMaterials(data.materials, 2);
  const totalReportPages = materialPages.length;

  // Grade label from class name e.g. "8A" → "8th Grade"
  const gradeMatch = studentClass.match(/(\d+)/);
  const gradeNumber = gradeMatch ? gradeMatch[1] : "7";
  const gradeLabel = `${gradeNumber}th Grade`;

  return (
    <Document>

      {/* ====================================================================
       * COVER PAGE
       * Image rendered FIRST → behind all content
       * ================================================================== */}
      <Page size="A4" style={styles.page}>

        {/* LAYER 1 — background image (first = behind) */}
        {data.coverBgDataUrl && (
          <Image src={data.coverBgDataUrl} style={styles.bgAbsolute} />
        )}

        {/* LAYER 2 — top text block: label + program name + tagline */}
        <View style={styles.coverTopContent}>
          <Text style={styles.coverReportLabel}>
            Competence Report of SMP
          </Text>
          {/* Only the program part shown large, e.g. "JAGOAN IT" */}
          <Text style={styles.coverSchoolName}>{programName}</Text>
          <Text style={styles.coverTagline}>
            Global Tech Starts with Global{"\n"}Communication
          </Text>
        </View>

        {/* LAYER 3 — bottom: grade | semester */}
        <View style={styles.coverBottomContent}>
          <Text style={styles.coverGradeText}>{gradeLabel}</Text>
          <View style={styles.coverSeparator} />
          <Text style={styles.coverSemesterText}>{semesterLabel}</Text>
        </View>

      </Page>

      {/* ====================================================================
       * FOREWORD PAGE
       * ================================================================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.forewordPage}>
          <Text style={styles.forewordSmallTitle}>Foreword</Text>
          <Text style={styles.forewordTitle}>Prakata</Text>
          <Text style={styles.forewordParagraph}>
            Alhamdulillahirabbil Alamin, segala puja dan puji syukur kami
            panjatkan kepada Allah subhanahu wa ta'ala, tanpa karunia-Nya,
            mustahil rasanya naskah laporan pencapaian belajar siswa ini
            terselesaikan tepat waktu.
          </Text>
          <Text style={styles.forewordParagraph}>
            Kami benar-benar merasa tertantang untuk mewujudkan laporan ini
            sebagai bagian dari kewajiban kami sebagai guru untuk melaporkan
            pencapaian yang telah siswa dapatkan selama satu semester.
          </Text>
          <Text style={styles.forewordParagraph}>
            Berdasarkan pembelajaran selama satu semester siswa mengalami
            berbagai perkembangan yang wajib kami laporkan kepada wali siswa.
          </Text>
          <Text style={styles.forewordParagraph}>
            Kami berharap laporan ini dapat membawa manfaat kepada pembaca dan
            menjadi motivasi untuk terus berkembang dalam menghadapi perubahan
            teknologi kedepannya.
          </Text>
        </View>
      </Page>

      {/* ====================================================================
       * REPORT PAGES
       * Image rendered FIRST per page → always behind content
       * ================================================================== */}
      {materialPages.map((pageMaterials, pageIndex) => {
        const isFirstReportPage = pageIndex === 0;
        const isLastReportPage = pageIndex === totalReportPages - 1;

        // Select background for this page
        let bgUrl: string | null = null;
        if (isFirstReportPage) {
          bgUrl = data.reportFirstBgDataUrl || null;
        } else if (isLastReportPage) {
          bgUrl = data.reportLastBgDataUrl || null;
        } else {
          bgUrl = data.reportFirstBgDataUrl || null;
        }

        // Sequential indicator numbering across pages
        let indicatorCounter = 1;
        for (let i = 0; i < pageIndex; i++) {
          for (const mat of materialPages[i]) {
            indicatorCounter += mat.indicators.length;
          }
        }

        // Dynamic padding based on template
        const topPadding =
          isFirstReportPage && data.reportFirstBgDataUrl ? 148 : 108;
        const bottomPadding =
          isLastReportPage && data.reportLastBgDataUrl ? 190 : 32;

        return (
          <Page key={pageIndex} size="A4" style={styles.page} wrap={false}>

            {/* LAYER 1 — background image (first child = behind everything) */}
            {bgUrl && (
              <Image src={bgUrl} style={styles.bgAbsolute} />
            )}

            {/* LAYER 2 — optional mask/pattern overlay */}
            {data.maskBgDataUrl && (
              <Image src={data.maskBgDataUrl} style={styles.maskAbsolute} />
            )}

            {/* LAYER 3 — faint watermark text */}
            <Text style={styles.watermark}>SMP JAGOAN IT</Text>

            {/* LAYER 4 — all report content (position absolute, on top) */}
            <View
              style={[
                styles.reportBody,
                { paddingTop: topPadding, paddingBottom: bottomPadding },
              ]}
            >

              {/* ============================================================
               * STUDENT CARD — first report page only
               * photoDataUrl comes from API (base64 or https URL)
               * ========================================================== */}
              {isFirstReportPage && (
                <View style={styles.studentCard}>
                  <View style={styles.scLeft}>

                    {/* Photo — from API data */}
                    <View style={styles.scPhotoWrap}>
                      {data.student.photoDataUrl ? (
                        <Image
                          src={data.student.photoDataUrl}
                          style={styles.scPhoto}
                        />
                      ) : (
                        <View style={styles.avatarPlaceholder}>
                          <Text style={styles.avatarInitials}>
                            {initials}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Name & contact */}
                    <View style={styles.scInfo}>
                      <Text style={styles.scName}>{studentName}</Text>
                      <Text style={styles.detailText}>
                        Email: {studentEmail}
                      </Text>
                      {studentLinkedIn !== "-" && (
                        <Text style={styles.detailText}>
                          LinkedIn: {studentLinkedIn}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Overall average */}
                  <View style={styles.scRight}>
                    <Text style={styles.scAvgValue}>
                      {overallAvg.toFixed(2)}
                    </Text>
                    <View
                      style={[
                        styles.scAvgBadge,
                        { backgroundColor: badgeColor },
                      ]}
                    >
                      <Text style={styles.scAvgBadgeText}>
                        {badgeLabel}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* ============================================================
               * COMPETENCY SECTIONS
               * ========================================================== */}
              {pageMaterials.map((material) => {
                const matAvg = calculateMaterialAverage(material);

                return (
                  <View
                    key={material.id}
                    style={styles.compSection}
                    wrap={false}
                  >
                    <View style={styles.compHeader}>
                      <Text style={styles.compTitleText}>
                        {material.judul}
                      </Text>
                      <Text style={styles.compScoreText}>
                        Rata-rata: {matAvg.toFixed(1)}
                      </Text>
                    </View>

                    <View style={styles.compIndicators}>
                      {material.indicators.map((indicator) => {
                        const nilai = indicator.nilai ?? 0;
                        const maxNilai = indicator.nilai_max || 5;
                        const indNum = indicatorCounter++;

                        return (
                          <View key={indicator.id} style={styles.indRow}>
                            <Text style={styles.indNum}>{indNum}</Text>
                            <Text style={styles.indText}>
                              {indicator.deskripsi}
                            </Text>
                            <ProgressBar nilai={nilai} max={maxNilai} />
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              })}

              {/* ============================================================
               * LAST PAGE: grade scale + comment + signatures
               * ========================================================== */}
              {isLastReportPage && (
                <>
                  <View style={styles.nilaiExplanation}>
                    <Text style={styles.nilaiExplanationTitle}>
                      Keterangan Nilai:
                    </Text>
                    <Text style={styles.nilaiExplanationText}>
                      4.6 - 5.0 : Sangat Memuaskan | 3.6 - 4.5 : Sangat Baik |
                      2.5 - 3.5 : Cukup | Kurang dari 2.5 : Butuh Perbaikan
                    </Text>
                  </View>

                  <View style={styles.commentBox}>
                    <Text style={styles.commentTitle}>
                      Komentar Guru Pembimbing
                    </Text>
                    <Text style={styles.commentText}>{noteText}</Text>
                  </View>

                  <View style={styles.sigSection}>
                    {["Multimedia", "Robotik"].map((subject) => (
                      <View key={subject} style={styles.sigBlock}>
                        <Text style={styles.sigMeta}>{subject}</Text>
                        <View style={styles.sigBox}>
                          {data.teacher?.ttdDataUrl && (
                            <Image
                              src={data.teacher.ttdDataUrl}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                            />
                          )}
                        </View>
                        <Text style={styles.sigName}>
                          {teacherName}
                        </Text>
                      </View>
                    ))}
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
          </Page>
        );
      })}
    </Document>
  );
}
