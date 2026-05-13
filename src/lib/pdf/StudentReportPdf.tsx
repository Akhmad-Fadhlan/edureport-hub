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
  comment?: string | null;

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
    top: 200,
    left: 58,
    fontSize: 30,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    letterSpacing: 1.5,
  },

  coverSchoolName: {
    position: "absolute",
    top: 240,
    left: 55,
    fontSize: 65,
    lineHeight: 2,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    letterSpacing: 1,
  },

  coverSubtitle: {
    position: "absolute",
    top: 325,
    left: 55,
    fontSize: 20,
    lineHeight: 1,
    color: "#ffffff",
    letterSpacing: 0.5,
  },

  coverBottomInfo: {
    position: "absolute",
    bottom: 50,
    left: 225,
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "Helvetica",
    letterSpacing: 0.5,
  },

  /* ==========================================================================
   * FOREWORD
   * ======================================================================== */

  forewordPage: {
    paddingTop: 70,
    paddingHorizontal: 60,
    paddingBottom: 60,
  },

  forewordHeading: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 2,
  },

  forewordSubheading: {
    fontSize: 14,
    color: NAVY,
    marginBottom: 28,
  },

  forewordParagraph: {
    fontSize: 11,
    lineHeight: 1.9,
    textAlign: "justify",
    color: "#334155",
    marginBottom: 14,
    textIndent: 30,
  },

  forewordParagraphNoIndent: {
    fontSize: 11,
    lineHeight: 1.9,
    textAlign: "justify",
    color: "#334155",
    marginBottom: 14,
  },

  /* ==========================================================================
   * REPORT BODY
   * ======================================================================== */

  reportBody: {
    paddingTop: 55,
    paddingHorizontal: 42,
    paddingBottom: 40,
  },

  reportBodyFirst: {
    paddingTop: 80,
  },

  reportBodyLast: {
    paddingBottom: 20,
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
    paddingTop: 10,
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 12,
  },

  detailText: {
    paddingLeft: 25,
    fontSize: 10.5,
    color: MUTED,
    marginBottom: 5,
  },

  scRight: {
    alignItems: "flex-end",
    paddingRight: 33,
    paddingTop: 28,
  },

  scAvgLabel: {
    fontSize: 10,
    color: MUTED,
    marginBottom: 4,
    textAlign: "right",
  },

  scAvgValue: {
    fontSize: 38,
    lineHeight: 1,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 8,
    paddingRight: 5,
  },

  scAvgBadge: {
    borderRadius: 20,
    paddingLeft: 5,
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
   * COMMENT BOX — now inside reportBody, below material cards
   * ======================================================================== */

  commentOuter: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
    marginBottom: 14,
  },

  commentHeader: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  commentTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: TEXT,
  },

  commentBody: {
    backgroundColor: "#f8fafc",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    padding: 14,
    minHeight: 60,
  },

  commentText: {
    fontSize: 10,
    color: "#475569",
    lineHeight: 1.6,
  },

  /* ==========================================================================
   * BOTTOM SECTION — Skala Nilai + TTD Guru
   * ======================================================================== */

  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 8,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },

  /* Skala Nilai (kiri) */
  scaleSection: {
    flex: 1,
    paddingRight: 20,
  },

  scaleTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: TEXT,
    marginBottom: 8,
  },

  scaleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },

  scaleBadge: {
    width: 52,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    alignItems: "center",
  },

  scaleBadgeText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },

  scaleLabel: {
    flex: 1,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  scaleLabelTextRed: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#dc2626",
  },

  scaleLabelTextOrange: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#ea580c",
  },

  scaleLabelTextBlue: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#2563eb",
  },

  scaleLabelTextGreen: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#16a34a",
  },

  /* TTD Guru (kanan) */
  signatureSection: {
    alignItems: "center",
    minWidth: 160,
  },

  signatureDate: {
    fontSize: 9,
    color: MUTED,
    marginBottom: 2,
    textAlign: "center",
  },

  signatureSubLabel: {
    fontSize: 9,
    color: MUTED,
    textAlign: "center",
    marginBottom: 8,
  },

  signaturePlaceholder: {
    width: 130,
    height: 65,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  signatureImage: {
    width: 130,
    height: 65,
    objectFit: "contain",
    marginBottom: 8,
  },

  signatureName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    textAlign: "center",
  },

  signatureRole: {
    fontSize: 8,
    color: MUTED,
    textAlign: "center",
    marginTop: 2,
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
  return photo || null;
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

function ProgressBar({ nilai, max = 5 }: { nilai: number; max: number }) {
  const totalSegs = 5;
  const filled = Math.min(Math.round((nilai / max) * totalSegs), totalSegs);

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
    </View>
  );
}

/* ============================================================================
 * SKALA NILAI — komponen keterangan penilaian
 * ========================================================================== */

function SkalaRow({
  range,
  label,
  badgeColor,
  bgColor,
  textStyle,
}: {
  range: string;
  label: string;
  badgeColor: string;
  bgColor: string;
  textStyle: object;
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
 * MAIN COMPONENT
 * ========================================================================== */

export function StudentReportPdf({ data }: { data: PdfReportData }) {
  const overallAvg = calculateOverallAverage(data.materials);
  const badgeColor = getBadgeColor(overallAvg);
  const badgeLabel = getBadgeLabel(overallAvg);
  const studentName = data.student.nama || "-";
  const studentClass = data.student.nama_kelas || "-";
  const semesterLabel = `${data.semester.nama_semester}`;
  const materialPages = chunkMaterials(data.materials, 2);

  return (
    <Document>
      {/* ====================================================================
       * COVER
       * ================================================================== */}
      <Page size="A4" style={styles.page}>
        {data.coverBgDataUrl && (
          <Image src={data.coverBgDataUrl} style={styles.absoluteBg} fixed />
        )}
        <View style={styles.pageContent}>
          <View style={styles.coverContent}>
            <Text style={styles.coverTitle}>Competence Report of SMP</Text>
            <Text style={styles.coverSchoolName}>JAGOAN IT</Text>
            <Text style={styles.coverSubtitle}>
              Global Tech Starts with Global Communication
            </Text>
            <Text style={styles.coverBottomInfo}>
              {studentClass} | {semesterLabel}
            </Text>
          </View>
        </View>
      </Page>

      {/* ====================================================================
       * FOREWORD — styled like the image reference
       * ================================================================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.forewordPage}>
          {/* Heading: bold "Foreword" + smaller "Prakata" */}
          <Text style={styles.forewordHeading}>Foreword</Text>
          <Text style={styles.forewordSubheading}>Prakata</Text>

          <Text style={styles.forewordParagraph}>
            Alhamdulillahirabbil Alamin, segala puja dan puji syukur kami panjatkan kepada Allah subhanahu wa ta'ala, tanpa karunia-Nya, mustahil rasanya naskah laporan pencapaian belajar siswa ini terselesaikan tepat waktu mengingat tugas dan kewajiban lain yang bersamaan hadir.
          </Text>

          <Text style={styles.forewordParagraphNoIndent}>
            Kami benar-benar merasa tertantang untuk untuk mewujudkan naskah laporan ini sebagai bagian dari bentuk kewajiban kami sebagai guru untuk melaporkan pencapaian yang telah siswa dapatkan selama satu semester.
          </Text>

          <Text style={styles.forewordParagraphNoIndent}>
            Berdasarkan pembelajaran selama satu semester siswa mengalami berbagai perkembangan yang wajib kami laporkan kepada wali siswa gunanya sebagai motivasi bagi seluruh elemen baik guru, siswa, wali siswa untuk mewujudkan tujuan kita bersama yang sesuai dengan slogan SMP - SMK IDN Boarding School yaitu "Expert Factory".
          </Text>

          <Text style={styles.forewordParagraphNoIndent}>
            Kami juga menyampaikan ucapan terima kasih kepada seluruh elemen terkait yang telah memberikan sumbangsih terwujudnya laporan pencapaian siswa pada semester ini, kami menyadari bahwa masih banyak kekurangan dalam penyajian laporan ini, karena itu, kami berharap agar pembaca berkenan menyampaikan masukan yang membangun.
          </Text>

          <Text style={styles.forewordParagraphNoIndent}>
            Akhir kata, kami berharap agar laporan ini dapat membawa manfaat kepada pembaca. Secara khusus, kami berharap semoga laporan ini dapat menginspirasi siswa agar menjadi generasi yang siap menghadapi perubahan teknologi kedepannya yang disertai dengan akhlak yang baik.
          </Text>
        </View>
      </Page>

      {/* ====================================================================
       * REPORT PAGES
       * ================================================================== */}
      {materialPages.map((pageMaterials, pageIndex) => {
        const isFirst = pageIndex === 0;
        const isLast = pageIndex === materialPages.length - 1;

        let bgUrl = null;
        if (isFirst) bgUrl = data.reportFirstBgDataUrl;
        else if (isLast) bgUrl = data.reportLastBgDataUrl;

        return (
          <Page key={pageIndex} size="A4" style={styles.page} wrap={false}>
            {bgUrl && (
              <Image src={bgUrl} style={[styles.absoluteBg]} fixed />
            )}

            <View style={styles.pageContent}>
              <View
                style={[
                  styles.reportBody,
                  ...(isFirst ? [styles.reportBodyFirst] : []),
                  ...(isLast ? [styles.reportBodyLast] : []),
                ]}
              >
                {/* Student Card — hanya di halaman pertama */}
                {isFirst && (
                  <View style={styles.studentCard}>
                    <View style={styles.scLeft}>
                      <View style={styles.scPhotoWrap}>
                        {getPhotoSrc(data.student.photoDataUrl) ? (
                        <Image
                          src={{
                            uri: getPhotoSrc(data.student.photoDataUrl)!,
                            method: "GET",
                            headers: {},
                          }}
                          style={styles.scPhoto}
                        />
                        ) : (
                          <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarInitials}>
                              {getInitials(studentName)}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.scInfo}>
                        <Text style={styles.scName}>{studentName}</Text>
                        <Text style={styles.detailText}>
                          {data.student.email}
                        </Text>
                        {data.student.linkedin && (
                          <Text style={styles.detailText}>
                            {data.student.linkedin}
                          </Text>
                        )}
                      </View>
                    </View>
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
                        <Text style={styles.scAvgBadgeText}>{badgeLabel}</Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Material Cards */}
                {pageMaterials.map((material) => {
                  const avg = calculateMaterialAverage([material]);
                  return (
                    <View key={material.id} style={styles.compSection}>
                      <View style={styles.compHeader}>
                        <Text style={styles.compTitleText}>
                          {material.judul}
                        </Text>
                        <Text style={styles.compScoreText}>
                          {avg.toFixed(1)}
                        </Text>
                      </View>
                      <View style={styles.compIndicators}>
                        {material.indicators.map((indicator, index) => (
                          <View key={indicator.id} style={styles.indRow}>
                            <Text style={styles.indNum}>{index + 1}</Text>
                            <Text style={styles.indText}>
                              {indicator.deskripsi}
                            </Text>
                            <ProgressBar
                              nilai={indicator.nilai || 0}
                              max={indicator.nilai_max}
                            />
                          </View>
                        ))}
                      </View>
                    </View>
                  );
                })}

                {/* ============================================================
                 * HALAMAN TERAKHIR — Comment + Skala Nilai + TTD Guru
                 * ========================================================== */}
                {isLast && (
                  <>
                    {/* Comment box — di bawah material cards, sebelum bottom section */}
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

                    {/* Bottom: Skala Nilai (kiri) + TTD Guru (kanan) */}
                    <View style={styles.bottomSection}>

                      {/* Kiri: Skala Nilai Rata-rata */}
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

                      {/* Kanan: TTD Guru */}
                      <View style={styles.signatureSection}>
                        <Text style={styles.signatureDate}>Tanggal</Text>
                        <Text style={styles.signatureSubLabel}>
                          {data.teacher?.jabatan || "Guru IT 7 SMP IDN"}
                        </Text>

                        {data.teacher?.ttdDataUrl ? (
                          <Image
                            src={data.teacher.ttdDataUrl}
                            style={styles.signatureImage}
                          />
                        ) : (
                          <View style={styles.signaturePlaceholder}>
                            <Text style={{ fontSize: 8, color: MUTED }}>
                              TTD Guru
                            </Text>
                          </View>
                        )}

                        <Text style={styles.signatureName}>
                          {data.teacher?.nama || "Nama Guru IT"}
                        </Text>
                        {data.teacher?.jabatan && (
                          <Text style={styles.signatureRole}>
                            {data.teacher.jabatan}
                          </Text>
                        )}
                      </View>
                    </View>
                  </>
                )}
              </View>

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
