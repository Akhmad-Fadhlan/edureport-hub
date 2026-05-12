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
  coverPreTitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 40,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  coverMainTitle: {
    color: "#ffffff",
    fontSize: 70,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 3,
    marginBottom: 18,
  },
  coverTagline: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 30,
    maxWidth: 500,
  },
  coverBuilding: {
    flex: 1,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    marginTop: "auto",
  },
  coverBuildingGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    backgroundGradient: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
    opacity: 0.15,
    borderRadius: "10px 10px 0 0",
    zIndex: 0,
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
    textIndent: 36,
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
  },
  progressBarWrap: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 70,
    minWidth: 200,
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
    marginTop: 250,
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
  return `${gradeNum}<sup>th</sup> Grade`;
}

function getSemesterLabel(semesterNum: number): string {
  const ordinals: Record<number, string> = { 1: "1<sup>st</sup>", 2: "2<sup>nd</sup>", 3: "3<sup>rd</sup>" };
  const ord = ordinals[semesterNum] || `${semesterNum}<sup>th</sup>`;
  return `${ord} Semester`;
}

// Progress Bar Component
function ProgressBar({ nilai, max = 5 }: { nilai: number; max: number }) {
  const totalSegs = 5;
  const filled = Math.round((nilai / max) * totalSegs);

  return (
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
  );
}

// Wrap text helper (simplified for PDF)
function wrapText(text: string, maxWords: number = 10): string {
  const words = text.split(" ");
  if (words.length <= maxWords) return text;
  // For PDF, we just return the text as is since react-pdf handles wrapping
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
  const teacherName = data.teacher?.nama || "Guru IT";
  const studentName = data.student.nama || "-";
  const studentEmail = data.student.email || "-";
  const studentLinkedIn = data.student.linkedin || "-";
  const studentClass = data.student.nama_kelas || "-";
  const noteText = data.note || "Belum ada catatan.";
  const initials = getInitials(studentName);

  // Get semester number for label
  const semesterNum = data.semester.semester || 1;

  // Organize materials by kode_rapor order (preserve order from API)
  const materials = data.materials;

  // Page materials per page (2 per page as per PHP layout)
  const materialPages = chunkMaterials(materials, 2);
  const totalReportPages = materialPages.length;

  return (
    <Document>
      {/* COVER PAGE */}
      <Page size="A4" style={styles.page}>
        {data.coverBgDataUrl && <Image src={data.coverBgDataUrl} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />}
        <View style={styles.cover}>
          {/* Watermark */}
          <View style={styles.coverWatermark}>
            <Text>IDN RAPOR DIGITAL IDN RAPOR DIGITAL IDN RAPOR DIGITAL </Text>
          </View>

          <View style={styles.coverContent}>
            <Text style={styles.coverPreTitle}>Competence Report of SMP</Text>
            <Text style={styles.coverMainTitle}>JAGOAN IT</Text>
            <Text style={styles.coverTagline}>Global Tech Starts with Global Communication</Text>

            <View style={styles.coverBuilding}>
              <View style={styles.coverBuildingGradient} />
            </View>

            <Text style={styles.coverFooterLine}>{studentName}</Text>
            <Text style={styles.coverFooterLine}>
              {getGradeLabel(studentClass)} | {getSemesterLabel(semesterNum)}
            </Text>
          </View>
        </View>
      </Page>

      {/* FOREWORD PAGE */}
      <Page size="A4" style={styles.page}>
        <View style={styles.forewordPage}>
          <Text style={styles.forewordTitle}>Prakata</Text>
          <View style={styles.forewordBody}>
            <Text style={styles.forewordParagraph}>
              Alhamdulillahirabbil Alamin, segala puja dan puji syukur kami panjatkan kepada Allah subhanahu wa ta'ala, tanpa karunia-Nya, mustahil rasanya naskah laporan pencapaian belajar siswa ini terselesaikan tepat waktu mengingat tugas dan kewajiban lain yang bersamaan hadir.
            </Text>
            <Text style={styles.forewordParagraph}>
              Kami benar-benar merasa tertantang untuk mewujudkan naskah laporan ini sebagai bagian dari bentuk kewajiban kami sebagai guru untuk melaporkan pencapaian yang telah siswa dapatkan selama satu semester.
            </Text>
            <Text style={styles.forewordParagraph}>
              Berdasarkan pembelajaran selama satu semester siswa mengalami berbagai perkembangan yang wajib kami laporkan kepada wali siswa gunanya sebagai motivasi bagi seluruh elemen baik guru, siswa, wali siswa untuk mewujudkan tujuan kita bersama yang sesuai dengan slogan SMP - SMK IDN Boarding School yaitu "Expert Factory".
            </Text>
            <Text style={styles.forewordParagraph}>
              Kami juga menyampaikan ucapan terima kasih kepada seluruh elemen terkait yang telah memberikan sumbangsih terwujudnya laporan pencapaian siswa pada semester ini, kami menyadari bahwa masih banyak kekurangan dalam penyajian laporan ini, karena itu, kami berharap agar pembaca berkenan menyampaikan masukan yang membangun.
            </Text>
            <Text style={styles.forewordParagraph}>
              Akhir kata, kami berharap agar laporan ini dapat membawa manfaat kepada pembaca. Secara khusus, kami berharap semoga laporan ini dapat menginspirasi siswa agar menjadi generasi yang siap menghadapi perubahan teknologi kedepannya yang disertai dengan akhlak yang baik.
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
            <View style={[styles.reportBody, { position: "relative", zIndex: 1, flex: 1 }]}>
              {/* Student Card - only on first report page */}
              {isFirstReportPage && (
                <View style={styles.studentCard}>
                  <View style={styles.scLeft}>
                    {/* Photo */}
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
                      <View style={styles.scDetail}>
                        <Text>{studentEmail}</Text>
                      </View>
                      <View style={styles.scDetail}>
                        <Text>{studentLinkedIn}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.scRight}>
                    <Text style={styles.scAvgValue}>{overallAvg.toFixed(2)}</Text>
                    <View style={[styles.scAvgBadge, { backgroundColor: badgeColor }]}>
                      <Text>{badgeLabel}</Text>
                    </View>
                  </View>
                </View>
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
                          <Text>{matAvg.toFixed(1)}</Text>
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
                                <ProgressBar nilai={nilai} max={maxNilai} />
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Comment and Signature - only on last report page */}
              {isLastReportPage && (
                <>
                  <View style={styles.commentBox}>
                    <View style={styles.commentTitle}>
                      <Text>📝 Komentar Akademik</Text>
                    </View>
                    <View style={styles.commentText}>
                      <Text>{noteText}</Text>
                    </View>
                  </View>

                  <View style={styles.sigSection}>
                    <View style={styles.sigBlock}>
                      <View style={styles.sigMeta}>
                        <Text>Bogor, {currentDate}</Text>
                        <Text>Guru Pembimbing IT</Text>
                      </View>
                      <View style={styles.sigBox}>
                        {data.teacher?.ttdDataUrl && (
                          <Image
                            src={data.teacher.ttdDataUrl}
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                          />
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
