import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import coverBg from "@/assets/cover-bg.png";
import akhirBg from "@/assets/report-last.png";

// ============================================
// DATA TYPES - MATCH YOUR ACTUAL DATABASE STRUCTURE
// ============================================
export interface PdfIndicator {
  id: number;
  kode: string;
  deskripsi: string;
  nilai_max: number;
  nilai?: number | null;
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
    photoUrl?: string | null;
    nama_kelas?: string;
  };
  semester: { 
    nama_semester: string; 
    tahun_ajaran: string 
  };
  teacher?: { 
    nama: string; 
    ttdUrl?: string | null 
  };
  catatan?: string;
  materials: PdfMaterial[];
  schoolName?: string;
}

// ============================================
// STYLES
// ============================================
const NAVY = "#1e3a5f";
const YELLOW = "#f5a623";
const SOFT_BG = "#f4f6f9";
const GRAY_TEXT = "#4a5568";
const LIGHT_BORDER = "#e2e8f0";

const FOREWORD = `Alhamdulillahirabbil Alamin, segala puja dan puji syukur kami panjatkan kepada Allah subhanahu wa ta'ala, tanpa karunia-Nya, mustahil rasanya naskah laporan pencapaian belajar siswa ini terselesaikan tepat waktu mengingat tugas dan kewajiban lain yang bersamaan hadir.

Kami benar-benar merasa tertantang untuk mewujudkan naskah laporan ini sebagai bagian dari bentuk kewajiban kami sebagai guru untuk melaporkan pencapaian yang telah siswa dapatkan selama satu semester.

Berdasarkan pembelajaran selama satu semester siswa mengalami berbagai perkembangan yang wajib kami laporkan kepada wali siswa gunanya sebagai motivasi bagi seluruh elemen baik guru, siswa, wali siswa untuk mewujudkan tujuan kita bersama yang sesuai dengan slogan SMP - SMK IDN Boarding School yaitu "Expert Factory".

Kami juga menyampaikan ucapan terima kasih kepada seluruh elemen terkait yang telah memberikan sumbangsih terwujudnya laporan pencapaian siswa pada semester ini, kami menyadari bahwa masih banyak kekurangan dalam penyajian laporan ini, karena itu, kami berharap agar pembaca berkenan menyampaikan masukan yang membangun.

Akhir kata, kami berharap agar laporan ini dapat membawa manfaat kepada pembaca. Secara khusus, kami berharap semoga laporan ini dapat menginspirasi siswa agar menjadi generasi yang siap menghadapi perubahan teknologi kedepannya yang disertai dengan akhlak yang baik.`;

const styles = StyleSheet.create({
  page: { 
    backgroundColor: "#ffffff", 
    padding: 0, 
    fontFamily: "Helvetica" 
  },
  
  // Cover styles
  coverImage: { 
    position: "absolute", 
    top: 0, 
    left: 0, 
    width: "100%", 
    height: "100%" 
  },
  coverContent: { 
    position: "absolute", 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    padding: 45, 
    justifyContent: "space-between" 
  },
  coverTopLabel: { 
    color: "#fff", 
    fontSize: 12, 
    opacity: 0.9, 
    letterSpacing: 3, 
    fontWeight: 500 
  },
  coverDivider: { 
    width: 70, 
    height: 4, 
    backgroundColor: YELLOW, 
    marginTop: 8 
  },
  coverTitleSm: { 
    fontSize: 14, 
    color: "#fff", 
    opacity: 0.9, 
    marginTop: 8, 
    fontWeight: 300 
  },
  coverTitle: { 
    fontSize: 42, 
    fontWeight: "bold", 
    color: "#fff", 
    marginTop: 6, 
    letterSpacing: 2 
  },
  coverTagline: { 
    fontSize: 11, 
    color: "#fff", 
    opacity: 0.85, 
    marginTop: 8, 
    fontStyle: "italic" 
  },
  coverNameBox: { 
    marginTop: 30, 
    padding: 24, 
    backgroundColor: "rgba(255,255,255,0.15)", 
    borderRadius: 12 
  },
  coverNameLabel: { 
    fontSize: 10, 
    color: "#fff", 
    opacity: 0.8, 
    textTransform: "uppercase", 
    letterSpacing: 1.5, 
    marginBottom: 4 
  },
  coverNameValue: { 
    fontSize: 24, 
    color: "#fff", 
    fontWeight: "bold", 
    marginBottom: 12 
  },
  coverMetaRow: { 
    flexDirection: "row", 
    marginTop: 8, 
    gap: 12 
  },
  coverMetaItem: { 
    flex: 1 
  },
  coverMetaLabel: { 
    fontSize: 8, 
    color: "#fff", 
    opacity: 0.7, 
    letterSpacing: 1 
  },
  coverMetaValue: { 
    fontSize: 12, 
    color: "#fff", 
    fontWeight: "bold", 
    marginTop: 3 
  },
  coverFooter: { 
    color: "#fff", 
    fontSize: 9, 
    opacity: 0.85, 
    textAlign: "center" 
  },

  // Foreword styles
  forewordPage: { 
    padding: 50, 
    backgroundColor: "#ffffff" 
  },
  forewordTitle: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: NAVY 
  },
  forewordSub: { 
    fontSize: 14, 
    color: GRAY_TEXT, 
    marginTop: 4 
  },
  forewordBar: { 
    width: 60, 
    height: 3, 
    backgroundColor: YELLOW, 
    marginTop: 12, 
    marginBottom: 20 
  },
  forewordText: { 
    fontSize: 11, 
    color: "#2d3748", 
    lineHeight: 1.7, 
    textAlign: "justify", 
    marginBottom: 10 
  },

  // IT Report intro styles
  introPage: { 
    padding: 0 
  },
  introBg: { 
    position: "absolute", 
    top: 0, 
    left: 0, 
    width: "100%", 
    height: "100%" 
  },
  introContent: { 
    position: "absolute", 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    padding: 50, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  introBigTitle: { 
    fontSize: 52, 
    fontWeight: "bold", 
    color: "#fff", 
    letterSpacing: 6 
  },
  introSub: { 
    fontSize: 16, 
    color: "#fff", 
    opacity: 0.95, 
    marginTop: 12, 
    letterSpacing: 2 
  },

  // Header styles
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 30,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 12 
  },
  headerLogo: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  headerTitle: { 
    color: "#fff", 
    fontSize: 13, 
    fontWeight: "bold", 
    opacity: 0.9 
  },
  headerPage: { 
    color: "#fff", 
    fontSize: 10, 
    opacity: 0.8 
  },

  // Body styles
  body: { 
    padding: 30, 
    flexGrow: 1 
  },

  // Student info row
  topRow: { 
    flexDirection: "row", 
    gap: 15, 
    marginBottom: 20 
  },
  studentCard: {
    flex: 1,
    flexDirection: "row",
    gap: 15,
    backgroundColor: SOFT_BG,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LIGHT_BORDER,
  },
  avatar: { 
    width: 70, 
    height: 70, 
    borderRadius: 10, 
    backgroundColor: "#cbd5e1", 
    objectFit: "cover" 
  },
  studentInfo: { 
    flex: 1, 
    justifyContent: "center" 
  },
  studentName: { 
    fontSize: 14, 
    fontWeight: "bold", 
    color: "#1a202c", 
    marginBottom: 4 
  },
  studentMeta: { 
    fontSize: 9, 
    color: GRAY_TEXT, 
    marginTop: 2 
  },
  rataCard: {
    width: 140,
    backgroundColor: SOFT_BG,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: LIGHT_BORDER,
  },
  rataLabel: { 
    fontSize: 9, 
    color: GRAY_TEXT, 
    fontWeight: 500 
  },
  rataValue: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: NAVY, 
    marginTop: 6 
  },
  rataBadge: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 9,
    fontWeight: "bold",
  },

  // Material card styles
  matCard: { 
    marginTop: 15, 
    borderRadius: 10, 
    overflow: "hidden", 
    borderWidth: 1, 
    borderColor: LIGHT_BORDER,
    breakInside: "avoid",
  },
  matHeader: { 
    backgroundColor: SOFT_BG, 
    padding: 12, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  matTitle: { 
    fontSize: 12, 
    fontWeight: "bold", 
    color: NAVY 
  },
  matNilai: { 
    backgroundColor: "#fff", 
    paddingHorizontal: 12, 
    paddingVertical: 5, 
    borderRadius: 20, 
    fontSize: 11, 
    fontWeight: "bold", 
    color: NAVY 
  },
  
  // Indicator row styles
  row: { 
    flexDirection: "row", 
    padding: 10, 
    borderTopWidth: 1, 
    borderTopColor: LIGHT_BORDER, 
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  rowKode: { 
    width: 45, 
    fontSize: 9, 
    color: GRAY_TEXT, 
    fontWeight: "500",
    paddingTop: 2,
  },
  rowDesc: { 
    flex: 1, 
    fontSize: 9, 
    color: "#1a202c", 
    paddingHorizontal: 8, 
    lineHeight: 1.4,
    paddingTop: 2,
  },
  rowMax: { 
    width: 35, 
    fontSize: 8, 
    color: "#a0aec0", 
    textAlign: "right",
    paddingTop: 2,
  },
  rowNilai: { 
    width: 45,
    padding: 4,
    borderRadius: 8,
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },

  // Last page styles
  akhirBgImage: { 
    position: "absolute", 
    top: 0, 
    left: 0, 
    width: "100%", 
    height: "100%", 
    opacity: 0.08 
  },
  sectionTitle: { 
    fontSize: 14, 
    fontWeight: "bold", 
    color: NAVY, 
    marginTop: 20, 
    marginBottom: 10 
  },
  scaleRow: { 
    flexDirection: "row", 
    marginTop: 8, 
    gap: 12, 
    alignItems: "center", 
    flexWrap: "wrap" 
  },
  scaleRange: { 
    width: 80, 
    padding: 8, 
    borderRadius: 8, 
    textAlign: "center", 
    fontSize: 9, 
    fontWeight: "bold" 
  },
  scaleLabel: { 
    width: 150, 
    padding: 8, 
    borderRadius: 8, 
    textAlign: "center", 
    fontSize: 9, 
    fontWeight: "bold", 
    color: "#fff" 
  },
  scaleText: { 
    fontSize: 10, 
    color: GRAY_TEXT 
  },
  commentBox: { 
    padding: 14, 
    backgroundColor: SOFT_BG, 
    borderRadius: 10, 
    minHeight: 80, 
    borderWidth: 1, 
    borderColor: LIGHT_BORDER 
  },
  commentText: { 
    fontSize: 10, 
    color: "#2d3748", 
    lineHeight: 1.6 
  },
  signRow: { 
    flexDirection: "row", 
    justifyContent: "flex-end", 
    marginTop: 40 
  },
  signCol: { 
    alignItems: "center", 
    width: 200 
  },
  signTxt: { 
    fontSize: 10, 
    color: GRAY_TEXT, 
    marginBottom: 4 
  },
  signNameLabel: { 
    fontSize: 9, 
    color: GRAY_TEXT, 
    marginBottom: 45, 
    marginTop: 4 
  },
  signName: { 
    fontSize: 10, 
    fontWeight: "bold", 
    color: "#1a202c", 
    borderTopWidth: 1, 
    borderTopColor: "#1a202c", 
    paddingTop: 5, 
    paddingHorizontal: 16, 
    textAlign: "center" 
  },

  footer: { 
    position: "absolute", 
    bottom: 14, 
    left: 30, 
    right: 30, 
    fontSize: 8, 
    color: "#a0aec0", 
    textAlign: "center" 
  },
});

// ============================================
// HELPER FUNCTIONS
// ============================================
function colorFor(avg: number): { bg: string; color: string } {
  if (avg >= 4.6) return { bg: "#2e7d32", color: "#fff" };
  if (avg >= 3.6) return { bg: "#1976d2", color: "#fff" };
  if (avg >= 2.5) return { bg: "#f5a623", color: "#1a202c" };
  return { bg: "#ef5350", color: "#fff" };
}

function badgeText(avg: number): string {
  if (avg >= 4.6) return "Memuaskan";
  if (avg >= 3.6) return "Baik";
  if (avg >= 2.5) return "Cukup";
  return "Butuh Perbaikan";
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function calculateOverallAverage(materials: PdfMaterial[]): number {
  const allScores: number[] = [];
  materials.forEach((m) =>
    m.indicators.forEach((i) => {
      if (i.nilai != null && typeof i.nilai === 'number') {
        allScores.push(i.nilai);
      }
    })
  );
  if (allScores.length === 0) return 0;
  const sum = allScores.reduce((a, b) => a + b, 0);
  return sum / allScores.length;
}

function calculateMaterialAverage(indicators: PdfIndicator[]): number {
  const scores = indicators.filter(i => i.nilai != null).map(i => Number(i.nilai));
  if (scores.length === 0) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

// ============================================
// PAGE HEADER COMPONENT
// ============================================
function PageHeader({ pageNo }: { pageNo: number }) {
  return (
    <View style={styles.header} fixed>
      <View style={styles.headerLeft}>
        <Text style={styles.headerLogo}>IDN</Text>
        <Text style={styles.headerTitle}>Student Competence Report</Text>
      </View>
      <Text style={styles.headerPage}>Page {pageNo}</Text>
    </View>
  );
}

// ============================================
// MAIN PDF COMPONENT
// ============================================
export function StudentReportPdf({ data }: { data: PdfReportData }) {
  const materialPages = chunkArray(data.materials, 2);
  const overallAverage = calculateOverallAverage(data.materials);
  const overallColor = colorFor(overallAverage);
  const today = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const school = data.schoolName || "SMP IDN Boarding School";

  // Validate and log data for debugging
  console.log("Rendering PDF with data:", {
    studentName: data.student?.nama,
    materialCount: data.materials?.length,
    totalIndicators: data.materials?.reduce((sum, m) => sum + (m.indicators?.length || 0), 0)
  });

  return (
    <Document>
      {/* COVER PAGE */}
      <Page size="A4" style={styles.page}>
        <Image src={coverBg} style={styles.coverImage} />
        <View style={styles.coverContent}>
          <View>
            <Text style={styles.coverTopLabel}>STUDENT COMPETENCE REPORT</Text>
            <View style={styles.coverDivider} />
            <Text style={styles.coverTitleSm}>Semester Report of</Text>
            <Text style={styles.coverTitle}>INFORMATION TECHNOLOGY</Text>
            <Text style={styles.coverTagline}>Building Future Tech Leaders with Strong Character</Text>
          </View>
          <View>
            <View style={styles.coverNameBox}>
              <Text style={styles.coverNameLabel}>Student Name</Text>
              <Text style={styles.coverNameValue}>{data.student?.nama || "-"}</Text>
              <View style={styles.coverMetaRow}>
                <View style={styles.coverMetaItem}>
                  <Text style={styles.coverMetaLabel}>CLASS</Text>
                  <Text style={styles.coverMetaValue}>{data.student?.nama_kelas || "-"}</Text>
                </View>
                <View style={styles.coverMetaItem}>
                  <Text style={styles.coverMetaLabel}>SEMESTER</Text>
                  <Text style={styles.coverMetaValue}>{data.semester?.nama_semester || "-"}</Text>
                </View>
                <View style={styles.coverMetaItem}>
                  <Text style={styles.coverMetaLabel}>ACADEMIC YEAR</Text>
                  <Text style={styles.coverMetaValue}>{data.semester?.tahun_ajaran || "-"}</Text>
                </View>
              </View>
            </View>
          </View>
          <Text style={styles.coverFooter}>{school}</Text>
        </View>
      </Page>

      {/* FOREWORD PAGE */}
      <Page size="A4" style={styles.forewordPage}>
        <Text style={styles.forewordTitle}>Foreword</Text>
        <Text style={styles.forewordSub}>Prakata</Text>
        <View style={styles.forewordBar} />
        {FOREWORD.split("\n\n").map((p, i) => (
          <Text key={i} style={styles.forewordText}>
            {p.trim()}
          </Text>
        ))}
        <Text style={styles.footer}>{school} — Digital Report</Text>
      </Page>

      {/* IT REPORT INTRO PAGE */}
      <Page size="A4" style={styles.introPage}>
        <Image src={coverBg} style={styles.introBg} />
        <View style={styles.introContent}>
          <Text style={styles.introBigTitle}>IT REPORT</Text>
          <View style={[styles.coverDivider, { marginTop: 16 }]} />
          <Text style={styles.introSub}>Student's Competences & Achievements</Text>
        </View>
      </Page>

      {/* CONTENT PAGES */}
      {materialPages.map((pageMaterials, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <PageHeader pageNo={pageIndex + 4} />
          <View style={styles.body}>
            {/* Student info only on first content page */}
            {pageIndex === 0 && (
              <View style={styles.topRow}>
                <View style={styles.studentCard}>
                  {data.student?.photoUrl ? (
                    <Image src={data.student.photoUrl} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatar} />
                  )}
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{data.student?.nama || "-"}</Text>
                    {data.student?.email && (
                      <Text style={styles.studentMeta}>✉ {data.student.email}</Text>
                    )}
                    {data.student?.linkedin && (
                      <Text style={styles.studentMeta}>🔗 {data.student.linkedin}</Text>
                    )}
                    <Text style={styles.studentMeta}>Class: {data.student?.nama_kelas || "-"}</Text>
                  </View>
                </View>
                <View style={styles.rataCard}>
                  <Text style={styles.rataLabel}>Average Score</Text>
                  <Text style={styles.rataValue}>{overallAverage.toFixed(2)}</Text>
                  <View style={[styles.rataBadge, { backgroundColor: overallColor.bg }]}>
                    <Text style={{ color: overallColor.color, fontSize: 9, fontWeight: "bold" }}>
                      {badgeText(overallAverage)}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Materials */}
            {pageMaterials.map((material) => {
              const materialAverage = calculateMaterialAverage(material.indicators);
              return (
                <View key={material.id} style={styles.matCard} wrap={false}>
                  <View style={styles.matHeader}>
                    <Text style={styles.matTitle}>
                      Kompetensi Skill - {material.judul}
                    </Text>
                    <Text style={styles.matNilai}>{materialAverage.toFixed(2)}</Text>
                  </View>
                  
                  {material.indicators.map((indicator) => {
                    const nilai = indicator.nilai != null ? Number(indicator.nilai) : 0;
                    const nilaiColor = colorFor(nilai);
                    return (
                      <View key={indicator.id} style={styles.row}>
                        <Text style={styles.rowKode}>{indicator.kode}</Text>
                        <Text style={styles.rowDesc}>{indicator.deskripsi}</Text>
                        <Text style={styles.rowMax}>/{indicator.nilai_max}</Text>
                        <Text style={[styles.rowNilai, { backgroundColor: nilaiColor.bg, color: nilaiColor.color }]}>
                          {indicator.nilai != null ? nilai.toFixed(1) : "-"}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
          <Text style={styles.footer} fixed>
            {school} — Digital Report
          </Text>
        </Page>
      ))}

      {/* LAST PAGE with akhir.png background */}
      <Page size="A4" style={styles.page}>
        <Image src={akhirBg} style={styles.akhirBgImage} />
        <PageHeader pageNo={materialPages.length + 4} />
        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Skala Nilai Rata-rata :</Text>
          
          <View style={styles.scaleRow}>
            <Text style={[styles.scaleRange, { backgroundColor: "#ffebee", color: "#c62828" }]}>0 - 2.4</Text>
            <Text style={[styles.scaleLabel, { backgroundColor: "#ef5350" }]}>Butuh Perbaikan</Text>
            <Text style={styles.scaleText}>Need Improvement</Text>
          </View>
          
          <View style={styles.scaleRow}>
            <Text style={[styles.scaleRange, { backgroundColor: "#fff8e1", color: "#f57c00" }]}>2.5 - 3.5</Text>
            <Text style={[styles.scaleLabel, { backgroundColor: "#f5a623" }]}>Cukup</Text>
            <Text style={styles.scaleText}>Sufficient</Text>
          </View>
          
          <View style={styles.scaleRow}>
            <Text style={[styles.scaleRange, { backgroundColor: "#e3f2fd", color: "#1565c0" }]}>3.6 - 4.5</Text>
            <Text style={[styles.scaleLabel, { backgroundColor: "#1976d2" }]}>Baik</Text>
            <Text style={styles.scaleText}>Good</Text>
          </View>
          
          <View style={styles.scaleRow}>
            <Text style={[styles.scaleRange, { backgroundColor: "#e8f5e9", color: "#2e7d32" }]}>4.6 - 5.0</Text>
            <Text style={[styles.scaleLabel, { backgroundColor: "#2e7d32" }]}>Memuaskan</Text>
            <Text style={styles.scaleText}>Excellent</Text>
          </View>

          <Text style={styles.sectionTitle}>Comment</Text>
          <View style={styles.commentBox}>
            <Text style={styles.commentText}>{data.catatan || "-"}</Text>
          </View>

          <View style={styles.signRow}>
            <View style={styles.signCol}>
              <Text style={styles.signTxt}>{today}</Text>
              <Text style={styles.signNameLabel}>Guru Pengampu</Text>
              {data.teacher?.ttdUrl ? (
                <Image src={data.teacher.ttdUrl} style={{ width: 100, height: 50, marginBottom: 6 }} />
              ) : (
                <View style={{ height: 30 }} />
              )}
              <Text style={styles.signName}>{data.teacher?.nama || "Guru Pengampu"}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.footer} fixed>
          {school} — Digital Report
        </Text>
      </Page>
    </Document>
  );
}
