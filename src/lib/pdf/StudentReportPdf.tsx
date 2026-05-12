import {
  Document, Page, Text, View, Image, StyleSheet,
} from "@react-pdf/renderer";

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

// Color palette matching the PHP version
const NAVY = "#1e1b4b";
const BLUE = "#2563eb";
const ORANGE = "#f59e0b";
const SOFT = "#f8fafc";
const TEXT = "#1e293b";
const MUTED = "#64748b";

const styles = StyleSheet.create({
  page: { 
    backgroundColor: "#ffffff", 
    fontFamily: "Helvetica", 
    color: TEXT,
    position: "relative",
  },

  // Cover Page Styles (matching PHP cover)
  cover: {
    position: "relative",
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "290px 80px 0 80px",
    overflow: "hidden",
  },
  coverWatermark: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    color: "rgba(255,255,255,0.05)",
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    padding: 20,
    zIndex: 0,
  },
  coverContent: {
    position: "relative",
    zIndex: 1,
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  coverTitle: {
    fontSize: 52,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 16,
    textAlign: "center",
  },
  coverSubtitle: {
    fontSize: 24,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 8,
    textAlign: "center",
  },
  coverStudentName: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginTop: "auto",
    marginBottom: 16,
    textAlign: "center",
  },
  coverClassInfo: {
    fontSize: 20,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginBottom: 40,
  },
  coverFooter: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.28)",
    paddingVertical: 20,
    textAlign: "center",
    color: "#ffffff",
    fontSize: 19,
    fontFamily: "Helvetica-Bold",
  },
  coverFooterLine: {
    marginBottom: 8,
  },

  // Foreword Page (Prakata)
  forewordPage: {
    padding: "60px 56px",
  },
  forewordTitle: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    textAlign: "center",
    marginBottom: 32,
  },
  forewordBody: {
    fontSize: 12,
    lineHeight: 1.85,
    color: "#333",
    textAlign: "justify",
  },
  forewordParagraph: {
    marginBottom: 16,
  },

  // Content Page (Report Body)
  reportBody: {
    padding: "110px 36px 22px 36px",
    position: "relative",
    zIndex: 1,
    flex: 1,
  },
  contentBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  // Student Card
  studentCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "4px 6px 14px 6px",
    marginBottom: 18,
  },
  scLeft: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    flex: 1,
  },
  scPhoto: {
    width: 82,
    height: 82,
    borderRadius: 8,
    flexShrink: 0,
    marginTop: 2,
  },
  scInfo: {
    paddingTop: 20,
    marginLeft: 58,
  },
  scName: {
    fontSize: 19,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 39,
  },
  scDetail: {
    paddingLeft: 22,
    fontSize: 16,
    color: MUTED,
    marginBottom: 9,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    maxWidth: 280,
  },
  scRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    textAlign: "right",
    paddingTop: 60,
    paddingRight: 75,
    flexShrink: 0,
    minWidth: 80,
  },
  scAvgValue: {
    fontSize: 36,
    marginBottom: 15,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
  },
  scAvgBadge: {
    display: "inline-block",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 20,
    color: "#ffffff",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },

  // Materials Grid
  twoMaterialsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  compSection: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
    marginBottom: 4,
  },
  compHeader: {
    backgroundColor: SOFT,
    padding: "11px 16px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    borderLeftWidth: 4,
    borderLeftColor: NAVY,
  },
  compTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  compTitleDot: {
    width: 10,
    height: 10,
    backgroundColor: NAVY,
    borderRadius: 2,
  },
  compScore: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ffffff",
    color: "#000000",
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  compIndicators: {
    paddingVertical: 14,
  },
  indRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 14,
    paddingHorizontal: 16,
    paddingVertical: 3,
  },
  indNum: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    backgroundColor: SOFT,
    width: 24,
    height: 24,
    textAlign: "center",
    lineHeight: 24,
    borderRadius: 6,
    flexShrink: 0,
  },
  indText: {
    flex: 1,
    fontSize: 10,
    color: "#334155",
    lineHeight: 1.5,
    fontFamily: "Helvetica-Bold",
    minWidth: 160,
    maxWidth: 360,
  },
  indTextLine: {
    display: "block",
    marginBottom: 1,
  },
  progressWrapper: {
    flexShrink: 0,
    marginLeft: "auto",
    minWidth: 180,
  },
  progressBarContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minWidth: 180,
  },
  progressBarWrap: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressSegments: {
    display: "flex",
    flexDirection: "row",
    gap: 4,
    flex: 1,
  },
  progressSegment: {
    flex: 1,
    height: 10,
    borderRadius: 3,
  },
  progressValue: {
    width: 38,
    height: 27,
    backgroundColor: ORANGE,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 27,
    flexShrink: 0,
  },
  progressText: {
    fontSize: 9,
    color: MUTED,
    textAlign: "right",
  },

  // Comment Box
  commentBox: {
    backgroundColor: "#fefce8",
    borderLeftWidth: 4,
    borderLeftColor: ORANGE,
    borderRadius: 10,
    padding: 18,
    marginVertical: 24,
    marginHorizontal: 0,
  },
  commentTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  commentText: {
    fontSize: 11,
    color: "#475569",
    lineHeight: 1.65,
  },

  // Signature Section
  sigSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 40,
    gap: 20,
  },
  sigBlock: {
    minWidth: 200,
    textAlign: "center",
  },
  sigMeta: {
    fontSize: 10.5,
    color: "#475569",
    marginBottom: 6,
    textAlign: "left",
  },
  sigBox: {
    width: "100%",
    height: 70,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: "#faf9fe",
  },
  sigName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
  },

  // Nilai Explanation
  nilaiExplanation: {
    marginTop: 20,
    padding: 12,
    backgroundColor: SOFT,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  nilaiExplanationTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 8,
  },
  nilaiExplanationText: {
    fontSize: 9,
    color: MUTED,
    lineHeight: 1.5,
  },

  // Placeholder
  avatarPlaceholder: {
    width: 82,
    height: 82,
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textAlign: "center",
  },
  detailText: {
    fontSize: 16,
    color: MUTED,
  },
});

// Helper functions
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
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function formatDate(): string {
  const date = new Date();
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getGradeLabel(className: string): string {
  const match = className.match(/(\d+)/);
  const gradeNum = match ? match[1] : "7";
  return `${gradeNum}th Grade`;
}

function getSemesterLabel(semesterNum: number): string {
  const ordinals: Record<number, string> = { 1: "1st", 2: "2nd", 3: "3rd" };
  const ord = ordinals[semesterNum] || `${semesterNum}th`;
  return `${ord} Semester`;
}

// Progress Bar Component with label
function ProgressBar({ nilai, max = 5, indicatorId }: { nilai: number; max: number; indicatorId: number }) {
  const totalSegs = 5;
  const filled = Math.round((nilai / max) * totalSegs);
  const percentage = ((nilai / max) * 100).toFixed(0);

  return (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarWrap}>
        <View style={styles.progressSegments}>
          {Array.from({ length: totalSegs }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressSegment,
                { backgroundColor: i < filled ? NAVY : "#e2e8f0" },
              ]}
            />
          ))}
        </View>
        <View style={styles.progressValue}>
          <Text>{nilai.toFixed(1)}</Text>
        </View>
      </View>
      <Text style={styles.progressText}>{percentage}% dari {max}</Text>
    </View>
  );
}

// Wrap text helper (simplified for PDF)
function wrapText(text: string, maxWords: number = 10): string {
  const words = text.split(" ");
  if (words.length <= maxWords) return text;
  return text;
}

function chunkMaterials<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// Main PDF Component
export function StudentReportPdf({ data }: { data: PdfReportData }) {
  const overallAvg = calculateOverallAverage(data.materials);
  const badgeColor = getBadgeColor(overallAvg);
  const badgeLabel = getBadgeLabel(overallAvg);
  const currentDate = formatDate();
  const teacherName = data.teacher?.nama || "Guru Pembimbing";
  const studentName = data.student.nama || "-";
  const studentEmail = data.student.email || "-";
  const studentLinkedIn = data.student.linkedin || "-";
  const studentClass = data.student.nama_kelas || "-";
  const noteText = data.note || "Belum ada catatan.";
  const initials = getInitials(studentName);
  const schoolName = data.schoolName || "SMP - SMK IDN Boarding School";

  // Get semester number for label
  const semesterNum = data.semester.semester || 1;

  // Organize materials by kode_rapor order (preserve order from API)
  const materials = data.materials;

  // Page materials per page (2 per page as per PHP layout)
  const materialPages = chunkMaterials(materials, 2);
  const totalReportPages = materialPages.length;

  return (
    <Document>
      {/* COVER PAGE - UPDATED with proper title/cover text */}
      <Page size="A4" style={styles.page}>
        {data.coverBgDataUrl && <Image src={data.coverBgDataUrl} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />}
        <View style={styles.cover}>
          {/* Watermark */}
          <View style={styles.coverWatermark}>
            <Text>LAPORAN PENCAPAIAN BELAJAR SISWA - LAPORAN PENCAPAIAN BELAJAR SISWA </Text>
          </View>

          <View style={styles.coverContent}>
            <Text style={styles.coverTitle}>LAPORAN PENCAPAIAN BELAJAR SISWA</Text>
            <Text style={styles.coverSubtitle}>{schoolName}</Text>
            <Text style={styles.coverStudentName}>{studentName}</Text>
            <Text style={styles.coverClassInfo}>
              {getGradeLabel(studentClass)} • {getSemesterLabel(semesterNum)} • {data.semester.tahun_ajaran}
            </Text>

            <Text style={styles.coverFooter}>
              <Text>Laporan Pencapaian Belajar Siswa Semester {semesterNum}</Text>
            </Text>
          </View>
        </View>
      </Page>

      {/* FOREWORD PAGE - UPDATED with proper paragraphs */}
      <Page size="A4" style={styles.page}>
        <View style={styles.forewordPage}>
          <Text style={styles.forewordTitle}>KATA PENGANTAR</Text>
          <View style={styles.forewordBody}>
            <Text style={styles.forewordParagraph}>
              Puji syukur kita panjatkan kehadirat Allah SWT yang telah melimpahkan rahmat dan hidayah-Nya, 
              sehingga laporan pencapaian belajar siswa semester ini dapat diselesaikan dengan baik. 
              Laporan ini merupakan bentuk pertanggungjawaban kami sebagai pendidik dalam memantau dan 
              mengevaluasi perkembangan belajar siswa selama satu semester.
            </Text>
            <Text style={styles.forewordParagraph}>
              Kami menyadari bahwa setiap siswa memiliki potensi dan keunikan masing-masing dalam proses pembelajaran. 
              Oleh karena itu, laporan ini tidak hanya berisi nilai akademik, tetapi juga mencakup pencapaian 
              kompetensi dan keterampilan yang telah dikuasai siswa selama periode pembelajaran berlangsung.
            </Text>
            <Text style={styles.forewordParagraph}>
              Laporan ini dibuat berdasarkan observasi, penilaian harian, tugas-tugas, serta ujian yang telah 
              dilaksanakan selama satu semester. Kami berharap laporan ini dapat memberikan gambaran yang jelas 
              tentang perkembangan dan pencapaian belajar siswa.
            </Text>
            <Text style={styles.forewordParagraph}>
              Ucapan terima kasih kami sampaikan kepada seluruh pihak yang telah membantu dalam proses pembelajaran 
              dan penyusunan laporan ini, terutama kepada orang tua/wali yang telah memberikan dukungan penuh 
              kepada siswa dalam mengikuti pembelajaran.
            </Text>
            <Text style={styles.forewordParagraph}>
              Kami menyadari bahwa laporan ini masih jauh dari sempurna. Kritik dan saran yang membangun sangat 
              kami harapkan untuk perbaikan di masa yang akan datang. Semoga laporan ini bermanfaat bagi semua 
              pihak, khususnya bagi siswa dalam meningkatkan prestasi belajarnya.
            </Text>
          </View>
        </View>
      </Page>

      {/* REPORT PAGES */}
      {materialPages.map((pageMaterials, pageIndex) => {
        const isFirstReportPage = pageIndex === 0;
        const isLastReportPage = pageIndex === totalReportPages - 1;

        // Select background based on page position
        let bgUrl = null;
        if (isFirstReportPage && data.reportFirstBgDataUrl) {
          bgUrl = data.reportFirstBgDataUrl;
        } else if (isLastReportPage && data.reportLastBgDataUrl) {
          bgUrl = data.reportLastBgDataUrl;
        }

        let indicatorCounter = 1;
        // Calculate cumulative counter for previous pages
        for (let i = 0; i < pageIndex; i++) {
          for (const mat of materialPages[i]) {
            indicatorCounter += mat.indicators.length;
          }
        }

        return (
          <Page key={pageIndex} size="A4" style={styles.page}>
            {bgUrl && <Image src={bgUrl} style={styles.contentBg} />}
            {/* Mask bg if available */}
            {data.maskBgDataUrl && (
              <Image src={data.maskBgDataUrl} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.15 }} />
            )}
            <View style={[styles.reportBody, { position: "relative", zIndex: 1, flex: 1 }]}>
              {/* Student Card - only on first report page */}
              {isFirstReportPage && (
                <>
                  <View style={styles.studentCard}>
                    <View style={styles.scLeft}>
                      {/* Photo - From API */}
                      <View style={styles.scPhoto}>
                        {data.student.photoDataUrl ? (
                          <Image
                            src={data.student.photoDataUrl}
                            style={{ width: 82, height: 82, borderRadius: 8 }}
                          />
                        ) : (
                          <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarInitials}>{initials}</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.scInfo}>
                        <Text style={styles.scName}>{studentName}</Text>
                        {studentEmail && (
                          <View style={styles.scDetail}>
                            <Text>📧 {studentEmail}</Text>
                          </View>
                        )}
                        {studentLinkedIn && (
                          <View style={styles.scDetail}>
                            <Text>🔗 {studentLinkedIn}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={styles.scRight}>
                      <Text style={styles.scAvgValue}>{overallAvg.toFixed(2)}</Text>
                      <View style={[styles.scAvgBadge, { backgroundColor: badgeColor }]}>
                        <Text>{badgeLabel}</Text>
                      </View>
                    </View>
                  </View>
                </>
              )}

              {/* Materials Grid */}
              <View style={styles.twoMaterialsGrid}>
                {pageMaterials.map((material, matIdx) => {
                  const matAvg = calculateMaterialAverage(material);
                  return (
                    <View key={material.id} style={styles.compSection}>
                      <View style={styles.compHeader}>
                        <View style={styles.compTitle}>
                          <View style={styles.compTitleDot} />
                          <Text>{material.judul}</Text>
                        </View>
                        <View style={styles.compScore}>
                          <Text>Rata-rata: {matAvg.toFixed(1)}</Text>
                        </View>
                      </View>
                      <View style={styles.compIndicators}>
                        {material.indicators.map((indicator, indIdx) => {
                          const indNum = indicatorCounter++;
                          const nilai = indicator.nilai ?? 0;
                          const maxNilai = indicator.nilai_max || 5;
                          return (
                            <View key={indicator.id} style={styles.indRow}>
                              <View style={styles.indNum}>
                                <Text>{indNum}</Text>
                              </View>
                              <View style={styles.indText}>
                                <Text>{wrapText(indicator.deskripsi, 8)}</Text>
                              </View>
                              <View style={styles.progressWrapper}>
                                <ProgressBar 
                                  nilai={nilai} 
                                  max={maxNilai} 
                                  indicatorId={indicator.id}
                                />
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Nilai Explanation Section - above comment box */}
              {isLastReportPage && (
                <View style={styles.nilaiExplanation}>
                  <Text style={styles.nilaiExplanationTitle}>📊 Keterangan Nilai:</Text>
                  <Text style={styles.nilaiExplanationText}>
                    4.6 - 5.0 : Sangat Memuaskan | 3.6 - 4.5 : Sangat Baik | 2.5 - 3.5 : Cukup | Kurang dari 2.5 : Butuh Perbaikan
                  </Text>
                </View>
              )}

              {/* Comment and Signature - only on last report page */}
              {isLastReportPage && (
                <>
                  <View style={styles.commentBox}>
                    <View style={styles.commentTitle}>
                      <Text>📝 Komentar Guru Pembimbing</Text>
                    </View>
                    <View style={styles.commentText}>
                      <Text>{noteText}</Text>
                    </View>
                  </View>

                  <View style={styles.sigSection}>
                    <View style={styles.sigBlock}>
                      <View style={styles.sigMeta}>
                        <Text>Bogor, {currentDate}</Text>
                        <Text>{data.teacher?.jabatan || "Guru Pembimbing"}</Text>
                      </View>
                      <View style={styles.sigBox}>
                        {data.teacher?.ttdDataUrl ? (
                          <Image
                            src={data.teacher.ttdDataUrl}
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                          />
                        ) : (
                          <Text style={{ textAlign: "center", marginTop: 25, color: MUTED }}>(Tanda Tangan)</Text>
                        )}
                      </View>
                      <View style={styles.sigName}>
                        <Text>{teacherName}</Text>
                      </View>
                    </View>
                  </View>
                </>
              )}
            </View>
          </Page>
        );
      })}
    </Document>
  );
}
