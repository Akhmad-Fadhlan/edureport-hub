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
    position: "relative",
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    color: TEXT,
  },

  absoluteBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  pageContent: {
    flex: 1,
    position: "relative",
  },

  /* ==========================================================================
   * COVER
   * ======================================================================== */

  coverContent: {
    position: "relative",
    width: "100%",
    height: "100%",
  },

  coverTitle: {
    position: "absolute",
    top: 180,
    left: 62,

    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },

  coverSchoolName: {
    position: "absolute",
    top: 235,
    left: 62,

    fontSize: 56,
    lineHeight: 1.1,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },

  coverSubtitle: {
    position: "absolute",
    top: 385,
    left: 62,

    width: 320,

    fontSize: 18,
    lineHeight: 1.4,
    color: "#ffffff",
  },

  coverStudentName: {
    position: "absolute",
    bottom: 135,
    left: 62,

    fontSize: 30,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },

  coverClassInfo: {
    position: "absolute",
    bottom: 95,
    left: 62,

    fontSize: 18,
    color: "#ffffff",
  },

  coverSemester: {
    position: "absolute",
    bottom: 70,
    left: 62,

    fontSize: 18,
    color: "#ffffff",
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
    paddingTop: 120,
    paddingHorizontal: 42,
    paddingBottom: 40,
  },

  reportBodyFirst: {
    paddingTop: 150,
  },

  reportBodyLast: {
    paddingBottom: 180,
  },

  /* ==========================================================================
   * STUDENT CARD
   * ======================================================================== */

  studentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
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
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#94a3b8",
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
    backgroundColor: "#ffffff",
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
   * PROGRESS
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
   * LAST PAGE
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

  pageNumber: {
    position: "absolute",
    bottom: 14,
    right: 24,
    fontSize: 9,
    color: "#64748b",
  },
});

/* ============================================================================
 * HELPERS
 * ========================================================================== */

function getPhotoSrc(photo?: string | null) {
  if (!photo) return null;

  if (photo.startsWith("data:image")) {
    return photo;
  }

  return `data:image/png;base64,${photo}`;
}

function calculateOverallAverage(materials: PdfMaterial[]) {
  let total = 0;
  let count = 0;

  materials.forEach((m) => {
    m.indicators.forEach((i) => {
      if (i.nilai !== null && i.nilai !== undefined) {
        total += Number(i.nilai);
        count++;
      }
    });
  });

  return count > 0 ? total / count : 0;
}

function calculateMaterialAverage(material: PdfMaterial[]) {
  let total = 0;
  let count = 0;

  material.forEach((m) => {
    m.indicators.forEach((i) => {
      if (i.nilai !== null && i.nilai !== undefined) {
        total += Number(i.nilai);
        count++;
      }
    });
  });

  return count > 0 ? total / count : 0;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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

function chunkMaterials<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}

/* ============================================================================
 * PROGRESS BAR
 * ========================================================================== */

function ProgressBar({
  nilai,
  max = 5,
}: {
  nilai: number;
  max: number;
}) {
  const totalSegs = 5;

  const filled = Math.min(
    Math.round((nilai / max) * totalSegs),
    totalSegs
  );

  return (
    <View style={styles.progressWrapper}>
      <View style={styles.progressBarWrap}>
        <View style={styles.progressSegmentsRow}>
          {Array.from({ length: totalSegs }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressSegment,
                {
                  backgroundColor:
                    i < filled ? NAVY : "#dbe4f0",
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.progressValue}>
          <Text style={styles.progressValueText}>
            {nilai.toFixed(1)}
          </Text>
        </View>
      </View>

      <Text style={styles.progressLabel}>
        {((nilai / max) * 100).toFixed(0)}% dari {max}
      </Text>
    </View>
  );
}

/* ============================================================================
 * MAIN COMPONENT
 * ========================================================================== */

export function StudentReportPdf({
  data,
}: {
  data: PdfReportData;
}) {
  const overallAvg = calculateOverallAverage(
    data.materials
  );

  const badgeColor = getBadgeColor(overallAvg);
  const badgeLabel = getBadgeLabel(overallAvg);

  const studentName = data.student.nama || "-";
  const studentClass =
    data.student.nama_kelas || "-";

  const semesterLabel = `${data.semester.nama_semester} ${data.semester.tahun_ajaran}`;

  const materialPages = chunkMaterials(
    data.materials,
    2
  );

  return (
    <Document>

      {/* ==========================================================================
       * COVER
       * ======================================================================== */}

      <Page size="A4" style={styles.page}>
        {data.coverBgDataUrl && (
          <Image
            src={data.coverBgDataUrl}
            style={styles.absoluteBg}
            fixed
          />
        )}

        <View style={styles.pageContent}>
          <View style={styles.coverContent}>
            <Text style={styles.coverTitle}>
              Competence Report of SMP
            </Text>

            <Text style={styles.coverSchoolName}>
              JAGOAN IT
            </Text>

            <Text style={styles.coverSubtitle}>
              Global Tech Starts with Global
              Communication
            </Text>

            <Text style={styles.coverStudentName}>
              {studentName}
            </Text>

            <Text style={styles.coverClassInfo}>
              {studentClass}
            </Text>

            <Text style={styles.coverSemester}>
              {semesterLabel}
            </Text>
          </View>
        </View>
      </Page>

      {/* ==========================================================================
       * FOREWORD
       * ======================================================================== */}

      <Page size="A4" style={styles.page}>
        <View style={styles.forewordPage}>
          <Text style={styles.forewordSmallTitle}>
            Foreword
          </Text>

          <Text style={styles.forewordTitle}>
            Prakata
          </Text>

          <Text style={styles.forewordParagraph}>
            Alhamdulillahirabbil Alamin...
          </Text>
        </View>
      </Page>

      {/* ==========================================================================
       * REPORT
       * ======================================================================== */}

      {materialPages.map(
        (pageMaterials, pageIndex) => {
          // HANYA halaman pertama & terakhir yang pakai background
          let bgUrl = null;
          if (pageIndex === 0) {
            bgUrl = data.reportFirstBgDataUrl;
          } else if (pageIndex === materialPages.length - 1) {
            bgUrl = data.reportLastBgDataUrl;
          }

          return (
            <Page
              key={pageIndex}
              size="A4"
              style={styles.page}
              wrap={false}
            >
              {bgUrl && (
                <Image
                  src={bgUrl}
                  style={[styles.absoluteBg, { opacity: 0.15 }]}
                  fixed
                />
              )}

              <View style={styles.pageContent}>
                <View
                  style={[
                    styles.reportBody,
                    ...(pageIndex === 0
                      ? [styles.reportBodyFirst]
                      : []),
                    ...(pageIndex ===
                    materialPages.length - 1
                      ? [styles.reportBodyLast]
                      : []),
                  ]}
                >

                  {pageIndex === 0 && (
                    <View style={styles.studentCard}>
                      <View style={styles.scLeft}>
                        <View style={styles.scPhotoWrap}>
                          {getPhotoSrc(
                            data.student.photoDataUrl
                          ) ? (
                            <Image
                              src={
                                getPhotoSrc(
                                  data.student
                                    .photoDataUrl
                                )!
                              }
                              style={styles.scPhoto}
                            />
                          ) : (
                            <View
                              style={
                                styles.avatarPlaceholder
                              }
                            >
                              <Text
                                style={
                                  styles.avatarInitials
                                }
                              >
                                {getInitials(
                                  studentName
                                )}
                              </Text>
                            </View>
                          )}
                        </View>

                        <View style={styles.scInfo}>
                          <Text style={styles.scName}>
                            {studentName}
                          </Text>

                          <Text style={styles.detailText}>
                            {data.student.email}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.scRight}>
                        <Text style={styles.scAvgValue}>
                          {overallAvg.toFixed(2)}
                        </Text>

                        <View
                          style={[
                            styles.scAvgBadge,
                            {
                              backgroundColor:
                                badgeColor,
                            },
                          ]}
                        >
                          <Text
                            style={
                              styles.scAvgBadgeText
                            }
                          >
                            {badgeLabel}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}

                  {pageMaterials.map((material) => {
                    const avg =
                      calculateMaterialAverage([
                        material,
                      ]);

                    return (
                      <View
                        key={material.id}
                        style={styles.compSection}
                      >
                        <View
                          style={styles.compHeader}
                        >
                          <Text
                            style={
                              styles.compTitleText
                            }
                          >
                            {material.judul}
                          </Text>

                          <Text
                            style={
                              styles.compScoreText
                            }
                          >
                            {avg.toFixed(1)}
                          </Text>
                        </View>

                        <View
                          style={
                            styles.compIndicators
                          }
                        >
                          {material.indicators.map(
                            (
                              indicator,
                              index
                            ) => (
                              <View
                                key={indicator.id}
                                style={
                                  styles.indRow
                                }
                              >
                                <Text
                                  style={
                                    styles.indNum
                                  }
                                >
                                  {index + 1}
                                </Text>

                                <Text
                                  style={
                                    styles.indText
                                  }
                                >
                                  {
                                    indicator.deskripsi
                                  }
                                </Text>

                                <ProgressBar
                                  nilai={
                                    indicator.nilai ||
                                    0
                                  }
                                  max={
                                    indicator.nilai_max
                                  }
                                />
                              </View>
                            )
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>

                <Text
                  style={styles.pageNumber}
                  render={({ pageNumber }) =>
                    `${pageNumber}`
                  }
                  fixed
                />
              </View>
            </Page>
          );
        }
      )}
    </Document>
  );
}
