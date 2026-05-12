import {
  Document, Page, Text, View, Image, StyleSheet,
} from "@react-pdf/renderer";
import coverBg from "@/assets/cover-bg.png";

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
  semester: { nama_semester: string; tahun_ajaran: string };
  teacher?: { nama: string; ttdUrl?: string | null };
  catatan?: string;
  materials: PdfMaterial[];
  schoolName?: string;
}

const NAVY = "#3730a3";
const YELLOW = "#f59e0b";
const SOFT_BG = "#f1f5f9";

const FOREWORD = `Alhamdulillahirabbil Alamin, segala puja dan puji syukur kami panjatkan kepada Allah subhanahu wa ta'ala, tanpa karunia-Nya, mustahil rasanya naskah laporan pencapaian belajar siswa ini terselesaikan tepat waktu mengingat tugas dan kewajiban lain yang bersamaan hadir.

Kami benar-benar merasa tertantang untuk mewujudkan naskah laporan ini sebagai bagian dari bentuk kewajiban kami sebagai guru untuk melaporkan pencapaian yang telah siswa dapatkan selama satu semester.

Berdasarkan pembelajaran selama satu semester siswa mengalami berbagai perkembangan yang wajib kami laporkan kepada wali siswa gunanya sebagai motivasi bagi seluruh elemen baik guru, siswa, wali siswa untuk mewujudkan tujuan kita bersama yang sesuai dengan slogan SMP - SMK IDN Boarding School yaitu "Expert Factory".

Kami juga menyampaikan ucapan terima kasih kepada seluruh elemen terkait yang telah memberikan sumbangsih terwujudnya laporan pencapaian siswa pada semester ini, kami menyadari bahwa masih banyak kekurangan dalam penyajian laporan ini, karena itu, kami berharap agar pembaca berkenan menyampaikan masukan yang membangun.

Akhir kata, kami berharap agar laporan ini dapat membawa manfaat kepada pembaca. Secara khusus, kami berharap semoga laporan ini dapat menginspirasi siswa agar menjadi generasi yang siap menghadapi perubahan teknologi kedepannya yang disertai dengan akhlak yang baik.`;

const styles = StyleSheet.create({
  page: { backgroundColor: "#ffffff", padding: 0, fontFamily: "Helvetica" },
  // cover
  coverImage: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" },
  coverContent: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, padding: 50, justifyContent: "space-between" },
  coverTopLabel: { color: "#fff", fontSize: 11, opacity: 0.9, letterSpacing: 2 },
  coverDivider: { width: 60, height: 4, backgroundColor: YELLOW, marginTop: 8 },
  coverTitleSm: { fontSize: 14, color: "#fff", opacity: 0.9, marginTop: 6 },
  coverTitle: { fontSize: 40, fontWeight: 700, color: "#fff", marginTop: 4 },
  coverTagline: { fontSize: 11, color: "#fff", opacity: 0.85, marginTop: 6, fontStyle: "italic" },
  coverNameBox: { marginTop: 28, padding: 20, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 10 },
  coverNameLabel: { fontSize: 9, color: "#fff", opacity: 0.8, textTransform: "uppercase", letterSpacing: 1.4 },
  coverNameValue: { fontSize: 22, color: "#fff", fontWeight: 700, marginTop: 4 },
  coverMetaRow: { flexDirection: "row", marginTop: 16, gap: 10 },
  coverMetaItem: { flex: 1 },
  coverMetaLabel: { fontSize: 8, color: "#fff", opacity: 0.7, letterSpacing: 1 },
  coverMetaValue: { fontSize: 13, color: "#fff", fontWeight: 700, marginTop: 3 },
  coverFooter: { color: "#fff", fontSize: 9, opacity: 0.85 },

  // foreword
  forewordPage: { padding: 50, backgroundColor: "#ffffff" },
  forewordTitle: { fontSize: 28, fontWeight: 700, color: NAVY },
  forewordSub: { fontSize: 14, color: "#64748b", marginTop: 4 },
  forewordBar: { width: 50, height: 3, backgroundColor: YELLOW, marginTop: 10, marginBottom: 18 },
  forewordText: { fontSize: 11, color: "#1e293b", lineHeight: 1.7, textAlign: "justify", marginBottom: 10 },

  // IT report intro
  introPage: { padding: 0 },
  introBg: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" },
  introContent: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, padding: 50, justifyContent: "center", alignItems: "center" },
  introBigTitle: { fontSize: 56, fontWeight: 700, color: "#fff", letterSpacing: 4 },
  introSub: { fontSize: 14, color: "#fff", opacity: 0.95, marginTop: 8, letterSpacing: 1 },

  // student report pages
  header: {
    backgroundColor: NAVY, paddingHorizontal: 24, paddingVertical: 14, flexDirection: "row",
    alignItems: "center", justifyContent: "space-between",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerLogo: { color: "#fff", fontSize: 18, fontWeight: 700 },
  headerTitle: { color: "#fff", fontSize: 14, fontWeight: 700 },
  headerPage: { color: "#fff", fontSize: 9, opacity: 0.85 },

  body: { padding: 24, flexGrow: 1 },

  topRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  studentCard: { flex: 1, flexDirection: "row", gap: 12, backgroundColor: SOFT_BG, padding: 12, borderRadius: 8 },
  avatar: { width: 70, height: 70, borderRadius: 8, backgroundColor: "#cbd5e1", objectFit: "cover" },
  studentInfo: { flex: 1, justifyContent: "center" },
  studentName: { fontSize: 13, fontWeight: 700, color: "#0f172a" },
  studentMeta: { fontSize: 9, color: "#475569", marginTop: 3 },
  rataCard: { width: 130, backgroundColor: SOFT_BG, padding: 10, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  rataLabel: { fontSize: 8, color: "#475569" },
  rataValue: { fontSize: 22, fontWeight: 700, color: NAVY, marginTop: 4 },

  matCard: { marginTop: 10, borderRadius: 8, overflow: "hidden", borderWidth: 1, borderColor: "#e2e8f0" },
  matHeader: { backgroundColor: SOFT_BG, padding: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  matTitle: { fontSize: 11, fontWeight: 700, color: "#0f172a" },
  matNilai: { backgroundColor: "#fff", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, fontSize: 11, fontWeight: 700, color: NAVY },
  row: { flexDirection: "row", padding: 6, borderTopWidth: 1, borderTopColor: "#e2e8f0", alignItems: "center" },
  rowKode: { width: 38, fontSize: 8, color: "#475569" },
  rowDesc: { flex: 1, fontSize: 8.5, color: "#0f172a", paddingHorizontal: 6, lineHeight: 1.4 },
  rowMax: { width: 26, fontSize: 8, color: "#94a3b8", textAlign: "right" },
  badge: { width: 36, padding: 4, borderRadius: 6, fontSize: 9, fontWeight: 700, textAlign: "center" },

  // last page
  sectionTitle: { fontSize: 13, fontWeight: 700, color: "#0f172a", marginTop: 14, marginBottom: 6 },
  scaleRow: { flexDirection: "row", marginTop: 6, gap: 8, alignItems: "center" },
  scaleRange: { width: 70, padding: 6, borderRadius: 6, textAlign: "center", fontSize: 9, fontWeight: 700 },
  scaleLabel: { width: 140, padding: 6, borderRadius: 6, textAlign: "center", fontSize: 9, fontWeight: 700, color: "#fff" },
  signRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 30 },
  signCol: { flex: 1, alignItems: "center" },
  signTxt: { fontSize: 10, color: "#0f172a" },
  signNameLabel: { fontSize: 9, color: "#475569", marginBottom: 60 },
  signName: { fontSize: 10, fontWeight: 700, color: "#0f172a", borderTopWidth: 1, borderTopColor: "#0f172a", paddingTop: 4, paddingHorizontal: 16 },

  footer: { position: "absolute", bottom: 14, left: 24, right: 24, fontSize: 8, color: "#94a3b8", textAlign: "center" },
});

function colorFor(avg: number): { bg: string; color: string } {
  if (avg >= 4.6) return { bg: "#16a34a", color: "#fff" };
  if (avg >= 3.6) return { bg: "#3b82f6", color: "#fff" };
  if (avg >= 2.5) return { bg: "#f59e0b", color: "#0f172a" };
  return { bg: "#fecaca", color: "#dc2626" };
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
function avg(materials: PdfMaterial[]): number {
  const all: number[] = [];
  materials.forEach((m) => m.indicators.forEach((i) => { if (i.nilai != null) all.push(Number(i.nilai)); }));
  if (!all.length) return 0;
  return all.reduce((a, b) => a + b, 0) / all.length;
}

function PageHeader({ pageNo }: { pageNo: number }) {
  return (
    <View style={styles.header} fixed>
      <View style={styles.headerLeft}>
        <Text style={styles.headerLogo}>iD</Text>
        <Text style={styles.headerTitle}>Student Report</Text>
      </View>
      <Text style={styles.headerPage}>Hal {pageNo}</Text>
    </View>
  );
}

export function StudentReportPdf({ data }: { data: PdfReportData }) {
  const pages = chunk(data.materials, 2);
  const overall = avg(data.materials);
  const overallC = colorFor(overall);
  const today = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
  const school = data.schoolName || "SMP IDN Boarding School";

  return (
    <Document>
      {/* COVER */}
      <Page size="A4" style={styles.page}>
        <Image src={coverBg} style={styles.coverImage} />
        <View style={styles.coverContent}>
          <View>
            <Text style={styles.coverTopLabel}>STUDENT REPORT</Text>
            <View style={styles.coverDivider} />
            <Text style={styles.coverTitleSm}>Competence Report of</Text>
            <Text style={styles.coverTitle}>JAGOAN IT</Text>
            <Text style={styles.coverTagline}>Global Tech Starts with Global Communication</Text>
          </View>
          <View>
            <View style={styles.coverNameBox}>
              <Text style={styles.coverNameLabel}>Nama Siswa</Text>
              <Text style={styles.coverNameValue}>{data.student.nama || "-"}</Text>
              <View style={styles.coverMetaRow}>
                <View style={styles.coverMetaItem}>
                  <Text style={styles.coverMetaLabel}>KELAS</Text>
                  <Text style={styles.coverMetaValue}>{data.student.nama_kelas || "-"}</Text>
                </View>
                <View style={styles.coverMetaItem}>
                  <Text style={styles.coverMetaLabel}>SEMESTER</Text>
                  <Text style={styles.coverMetaValue}>{data.semester.nama_semester || "-"}</Text>
                </View>
                <View style={styles.coverMetaItem}>
                  <Text style={styles.coverMetaLabel}>TAHUN AJARAN</Text>
                  <Text style={styles.coverMetaValue}>{data.semester.tahun_ajaran || "-"}</Text>
                </View>
              </View>
            </View>
          </View>
          <Text style={styles.coverFooter}>{school}</Text>
        </View>
      </Page>

      {/* FOREWORD */}
      <Page size="A4" style={styles.forewordPage}>
        <Text style={styles.forewordTitle}>Foreword</Text>
        <Text style={styles.forewordSub}>Prakata</Text>
        <View style={styles.forewordBar} />
        {FOREWORD.split("\n\n").map((p, i) => (
          <Text key={i} style={styles.forewordText}>{p.trim()}</Text>
        ))}
        <Text style={styles.footer}>{school} — Rapor Digital</Text>
      </Page>

      {/* IT REPORT INTRO */}
      <Page size="A4" style={styles.introPage}>
        <Image src={coverBg} style={styles.introBg} />
        <View style={styles.introContent}>
          <Text style={styles.introBigTitle}>IT REPORT</Text>
          <View style={[styles.coverDivider, { marginTop: 14 }]} />
          <Text style={styles.introSub}>Student's Competences & Achievements</Text>
        </View>
      </Page>

      {/* CONTENT PAGES */}
      {pages.map((pageMats, pi) => (
        <Page key={pi} size="A4" style={styles.page}>
          <PageHeader pageNo={pi + 4} />
          <View style={styles.body}>
            {pi === 0 && (
              <View style={styles.topRow}>
                <View style={styles.studentCard}>
                  {data.student.photoUrl ? (
                    <Image src={data.student.photoUrl} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatar} />
                  )}
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{data.student.nama}</Text>
                    {data.student.email ? <Text style={styles.studentMeta}>✉ {data.student.email}</Text> : null}
                    {data.student.linkedin ? <Text style={styles.studentMeta}>🔗 {data.student.linkedin}</Text> : null}
                    <Text style={styles.studentMeta}>Kelas: {data.student.nama_kelas || "-"}</Text>
                  </View>
                </View>
                <View style={styles.rataCard}>
                  <Text style={styles.rataLabel}>Nilai Rata-rata</Text>
                  <Text style={styles.rataValue}>{overall.toFixed(2)}</Text>
                  <View style={[styles.badge, { backgroundColor: overallC.bg, width: "auto", paddingHorizontal: 10 }]}>
                    <Text style={{ color: overallC.color, fontSize: 9, fontWeight: 700 }}>
                      {overall >= 4.6 ? "Memuaskan" : overall >= 3.6 ? "Baik" : overall >= 2.5 ? "Cukup" : "Butuh Perbaikan"}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {pageMats.map((m) => {
              const matAvg = m.indicators.length
                ? m.indicators.reduce((a, b) => a + (Number(b.nilai) || 0), 0) / m.indicators.length
                : 0;
              return (
                <View key={m.id} style={styles.matCard} wrap={false}>
                  <View style={styles.matHeader}>
                    <Text style={styles.matTitle}>Kompetensi Skill - {m.judul}</Text>
                    <Text style={styles.matNilai}>{matAvg.toFixed(2)}</Text>
                  </View>
                  {m.indicators.map((i) => {
                    const v = Number(i.nilai) || 0;
                    const c = colorFor(v);
                    return (
                      <View key={i.id} style={styles.row}>
                        <Text style={styles.rowKode}>{i.kode}</Text>
                        <Text style={styles.rowDesc}>{i.deskripsi}</Text>
                        <Text style={styles.rowMax}>/{i.nilai_max}</Text>
                        <Text style={[styles.badge, { backgroundColor: c.bg, color: c.color }]}>
                          {i.nilai != null ? Number(i.nilai).toFixed(1) : "-"}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
          <Text style={styles.footer} fixed>{school} — Rapor Digital</Text>
        </Page>
      ))}

      {/* LAST PAGE - Skala Nilai + Catatan + TTD */}
      <Page size="A4" style={styles.page}>
        <PageHeader pageNo={pages.length + 4} />
        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Skala Nilai Rata-rata :</Text>
          <View style={styles.scaleRow}>
            <Text style={[styles.scaleRange, { backgroundColor: "#fee2e2", color: "#dc2626" }]}>0 - 2.4</Text>
            <Text style={[styles.scaleLabel, { backgroundColor: "#fecaca", color: "#dc2626" }]}>Butuh Perbaikan</Text>
          </View>
          <View style={styles.scaleRow}>
            <Text style={[styles.scaleRange, { backgroundColor: "#fef3c7", color: "#92400e" }]}>2.5 - 3.5</Text>
            <Text style={[styles.scaleLabel, { backgroundColor: "#f59e0b", color: "#0f172a" }]}>Cukup</Text>
          </View>
          <View style={styles.scaleRow}>
            <Text style={[styles.scaleRange, { backgroundColor: "#dbeafe", color: "#1e40af" }]}>3.6 - 4.5</Text>
            <Text style={[styles.scaleLabel, { backgroundColor: "#3b82f6" }]}>Baik</Text>
          </View>
          <View style={styles.scaleRow}>
            <Text style={[styles.scaleRange, { backgroundColor: "#dcfce7", color: "#15803d" }]}>4.6 - 5</Text>
            <Text style={[styles.scaleLabel, { backgroundColor: "#16a34a" }]}>Memuaskan</Text>
          </View>

          <Text style={styles.sectionTitle}>Comment</Text>
          <View style={{ padding: 12, backgroundColor: SOFT_BG, borderRadius: 6, minHeight: 60 }}>
            <Text style={{ fontSize: 10, color: "#334155", lineHeight: 1.6 }}>
              {data.catatan || "-"}
            </Text>
          </View>

          <View style={styles.signRow}>
            <View style={styles.signCol}>
              <Text style={styles.signTxt}>{today}</Text>
              <Text style={[styles.signNameLabel, { marginTop: 4 }]}>Guru Pengampu</Text>
              {data.teacher?.ttdUrl ? (
                <Image src={data.teacher.ttdUrl} style={{ width: 90, height: 45, marginBottom: 4 }} />
              ) : null}
              <Text style={styles.signName}>{data.teacher?.nama || "Guru Pengampu"}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.footer} fixed>{school} — Rapor Digital</Text>
      </Page>
    </Document>
  );
}
