import {
  Document, Page, Text, View, Image, StyleSheet, Font,
} from "@react-pdf/renderer";
import coverBg from "@/assets/cover-bg.png";
import reportFirst from "@/assets/report-first.png";
import reportLast from "@/assets/report-last.png";

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
const BG = "#f1f5f9";

const styles = StyleSheet.create({
  page: { backgroundColor: "#ffffff", padding: 0, fontFamily: "Helvetica" },

  // --- COVER ---
  coverImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  // Fallback background saat gambar gagal load
  coverFallback: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: NAVY,
  },
  coverContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 50,
    justifyContent: "space-between",
  },
  coverTitle: { fontSize: 36, fontWeight: 700, color: "#ffffff" },
  coverSub: { fontSize: 14, color: "#ffffff", opacity: 0.9, marginTop: 8 },
  coverBox: {
    backgroundColor: "rgba(255,255,255,0.18)",
    padding: 20,
    borderRadius: 8,
    marginTop: 30,
  },
  coverLabel: {
    fontSize: 9,
    color: "#ffffff",
    opacity: 0.85,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  coverValue: { fontSize: 16, color: "#ffffff", fontWeight: 700, marginTop: 4 },

  // --- PRAKATA ---
  prakataBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  prakataBgFallback: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#f8fafc",
  },
  prakata: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 50,
    justifyContent: "center",
  },
  prakataBadge: {
    alignSelf: "flex-start",
    backgroundColor: NAVY,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 16,
  },
  prakataBadgeTxt: { color: "#ffffff", fontSize: 9, fontWeight: 700, letterSpacing: 1.5 },
  prakataTitle: { fontSize: 26, fontWeight: 700, color: NAVY, marginBottom: 6 },
  prakataLine: { width: 50, height: 4, backgroundColor: "#f59e0b", marginBottom: 20 },
  prakataBody: { fontSize: 10, color: "#334155", lineHeight: 1.8 },
  prakataSign: { marginTop: 32 },
  prakataSignTxt: { fontSize: 10, color: "#334155" },
  prakataSignName: { fontSize: 11, fontWeight: 700, color: NAVY, marginTop: 28 },

  // --- BODY PAGES ---
  header: {
    backgroundColor: NAVY,
    color: "#ffffff",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: "#ffffff", fontSize: 14, fontWeight: 700 },
  body: { padding: 24, flexGrow: 1 },
  studentCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: BG,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  avatar: { width: 70, height: 70, borderRadius: 8, backgroundColor: "#cbd5e1" },
  studentInfo: { flex: 1, justifyContent: "center" },
  studentName: { fontSize: 13, fontWeight: 700, color: "#0f172a" },
  studentMeta: { fontSize: 9, color: "#475569", marginTop: 3 },
  rataCard: {
    width: 130,
    backgroundColor: BG,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rataLabel: { fontSize: 8, color: "#475569" },
  rataValue: { fontSize: 22, fontWeight: 700, color: NAVY, marginTop: 4 },
  matCard: {
    marginTop: 10,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  matHeader: {
    backgroundColor: BG,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  matTitle: { fontSize: 11, fontWeight: 700, color: "#0f172a" },
  matNilai: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 700,
    color: NAVY,
  },
  row: {
    flexDirection: "row",
    padding: 6,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    alignItems: "center",
  },
  rowKode: { width: 50, fontSize: 8, color: "#475569" },
  rowDesc: { flex: 1, fontSize: 8, color: "#0f172a", paddingHorizontal: 6 },
  rowMax: { width: 30, fontSize: 8, color: "#94a3b8", textAlign: "right" },
  badge: {
    width: 32,
    padding: 4,
    borderRadius: 4,
    color: "#ffffff",
    fontSize: 9,
    fontWeight: 700,
    textAlign: "center",
  },

  // --- LAST PAGE ---
  lastTitle: { fontSize: 14, fontWeight: 700, color: "#0f172a", marginTop: 20 },
  scaleRow: { flexDirection: "row", marginTop: 8, gap: 8, alignItems: "center" },
  scaleRange: { width: 70, padding: 6, borderRadius: 6, textAlign: "center", fontSize: 9, fontWeight: 700 },
  scaleLabel: {
    width: 130,
    padding: 6,
    borderRadius: 6,
    textAlign: "center",
    fontSize: 9,
    fontWeight: 700,
    color: "#ffffff",
  },
  signBlock: { marginTop: 30, alignItems: "flex-end" },
  signTxt: { fontSize: 10, color: "#0f172a" },
  footer: {
    position: "absolute",
    bottom: 12,
    left: 24,
    right: 24,
    fontSize: 8,
    color: "#94a3b8",
    textAlign: "center",
  },
});

function colorFor(avg: number): { bg: string; color: string } {
  if (avg >= 4.6) return { bg: "#16a34a", color: "#ffffff" };
  if (avg >= 3.6) return { bg: "#3b82f6", color: "#ffffff" };
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
  materials.forEach((m) =>
    m.indicators.forEach((i) => {
      if (i.nilai != null) all.push(Number(i.nilai));
    })
  );
  if (!all.length) return 0;
  return all.reduce((a, b) => a + b, 0) / all.length;
}

export function StudentReportPdf({ data }: { data: PdfReportData }) {
  const pages = chunk(data.materials, 2);
  const overall = avg(data.materials);
  const overallColor = colorFor(overall);
  const today = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const schoolName = data.schoolName || "SMP IDN Boarding School";

  return (
    <Document>
      {/* ─────────── COVER ─────────── */}
      <Page size="A4" style={styles.page}>
        {/* Fallback navy dulu, lalu gambar di atasnya */}
        <View style={styles.coverFallback} />
        <Image src={coverBg} style={styles.coverImage} />

        {/* Teks selalu di layer paling atas */}
        <View style={styles.coverContent}>
          <View>
            <Text style={{ color: "#ffffff", fontSize: 11, opacity: 0.9, letterSpacing: 2 }}>
              STUDENT REPORT
            </Text>
            <View style={{ width: 60, height: 4, backgroundColor: "#f59e0b", marginTop: 8 }} />
          </View>

          <View>
            <Text style={styles.coverTitle}>{data.student.nama?.toUpperCase()}</Text>
            <Text style={styles.coverSub}>{data.semester.nama_semester}</Text>
            <View style={styles.coverBox}>
              <Text style={styles.coverLabel}>Kelas</Text>
              <Text style={styles.coverValue}>{data.student.nama_kelas || "-"}</Text>
              <Text style={[styles.coverLabel, { marginTop: 12 }]}>Tahun Ajaran</Text>
              <Text style={styles.coverValue}>{data.semester.tahun_ajaran}</Text>
            </View>
          </View>

          <Text style={{ color: "#ffffff", fontSize: 9, opacity: 0.85 }}>{schoolName}</Text>
        </View>
      </Page>

      {/* ─────────── PRAKATA ─────────── */}
      <Page size="A4" style={styles.page}>
        {/* Fallback putih, lalu gambar report-first di atasnya */}
        <View style={styles.prakataBgFallback} />
        <Image src={reportFirst} style={styles.prakataBg} />

        {/* Konten prakata di layer paling atas */}
        <View style={styles.prakata}>
          <View style={styles.prakataBadge}>
            <Text style={styles.prakataBadgeTxt}>PRAKATA</Text>
          </View>

          <Text style={styles.prakataTitle}>Kata Pengantar</Text>
          <View style={styles.prakataLine} />

          <Text style={styles.prakataBody}>
            Assalamu'alaikum Warahmatullahi Wabarakatuh,{"\n\n"}
            Puji syukur kehadirat Allah SWT atas segala rahmat dan karunia-Nya sehingga
            laporan perkembangan siswa semester ini dapat diselesaikan dengan baik.{"\n\n"}
            Rapor digital ini disusun sebagai bentuk pertanggungjawaban kami kepada orang tua/wali
            siswa mengenai perkembangan akademik dan kompetensi skill {data.student.nama} selama
            semester {data.semester.nama_semester} tahun ajaran {data.semester.tahun_ajaran}.{"\n\n"}
            Kami berharap laporan ini dapat menjadi bahan evaluasi dan motivasi bagi siswa untuk
            terus berkembang. Dukungan dan sinergi antara pihak sekolah dan keluarga sangat kami
            harapkan demi kemajuan bersama.{"\n\n"}
            Wassalamu'alaikum Warahmatullahi Wabarakatuh.
          </Text>

          <View style={styles.prakataSign}>
            <Text style={styles.prakataSignTxt}>{today}</Text>
            <Text style={styles.prakataSignTxt}>{schoolName}</Text>
            {data.teacher?.ttdUrl && (
              <Image
                src={data.teacher.ttdUrl}
                style={{ width: 100, height: 50, marginTop: 6 }}
              />
            )}
            <Text style={styles.prakataSignName}>{data.teacher?.nama || "Guru Pengampu"}</Text>
          </View>
        </View>
      </Page>

      {/* ─────────── CONTENT PAGES ─────────── */}
      {pages.map((pageMats, pi) => (
        <Page key={pi} size="A4" style={styles.page}>
          <View style={styles.header}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: 700 }}>iD</Text>
              <Text style={styles.headerTitle}>Student Report</Text>
            </View>
            <Text style={{ color: "#ffffff", fontSize: 9, opacity: 0.85 }}>
              Hal {pi + 3}
            </Text>
          </View>

          <View style={styles.body}>
            {pi === 0 && (
              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={[styles.studentCard, { flex: 1 }]}>
                  {data.student.photoUrl ? (
                    <Image src={data.student.photoUrl} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatar} />
                  )}
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{data.student.nama}</Text>
                    <Text style={styles.studentMeta}>✉ {data.student.email}</Text>
                    {data.student.linkedin && (
                      <Text style={styles.studentMeta}>
                        🔗 {data.student.linkedin.substring(0, 45)}...
                      </Text>
                    )}
                    <Text style={styles.studentMeta}>Kelas: {data.student.nama_kelas || "-"}</Text>
                  </View>
                </View>
                <View style={styles.rataCard}>
                  <Text style={styles.rataLabel}>Nilai Rata-rata</Text>
                  <Text style={styles.rataValue}>{overall.toFixed(2)}</Text>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: overallColor.bg,
                        color: overallColor.color,
                        width: "auto",
                        paddingHorizontal: 8,
                      },
                    ]}
                  >
                    <Text>
                      {overall >= 4.6
                        ? "Memuaskan"
                        : overall >= 3.6
                        ? "Baik"
                        : overall >= 2.5
                        ? "Cukup"
                        : "Butuh Perbaikan"}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {pageMats.map((m) => {
              const matAvg = m.indicators.length
                ? m.indicators.reduce((a, b) => a + (Number(b.nilai) || 0), 0) /
                  m.indicators.length
                : 0;
              return (
                <View key={m.id} style={styles.matCard}>
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
                        <Text
                          style={[
                            styles.badge,
                            { backgroundColor: c.bg, color: c.color },
                          ]}
                        >
                          {i.nilai != null ? Number(i.nilai).toFixed(1) : "-"}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              );
            })}

            {pi === pages.length - 1 && (
              <>
                <Text style={styles.lastTitle}>Skala Nilai Rata-rata :</Text>
                <View style={styles.scaleRow}>
                  <Text style={[styles.scaleRange, { backgroundColor: "#fee2e2", color: "#dc2626" }]}>
                    0 - 2.4
                  </Text>
                  <Text style={[styles.scaleLabel, { backgroundColor: "#fecaca", color: "#dc2626" }]}>
                    Butuh Perbaikan
                  </Text>
                </View>
                <View style={styles.scaleRow}>
                  <Text style={[styles.scaleRange, { backgroundColor: "#fef3c7", color: "#92400e" }]}>
                    2.5 - 3.5
                  </Text>
                  <Text style={[styles.scaleLabel, { backgroundColor: "#f59e0b", color: "#0f172a" }]}>
                    Cukup
                  </Text>
                </View>
                <View style={styles.scaleRow}>
                  <Text style={[styles.scaleRange, { backgroundColor: "#dbeafe", color: "#1e40af" }]}>
                    3.6 - 4.5
                  </Text>
                  <Text style={[styles.scaleLabel, { backgroundColor: "#3b82f6" }]}>Baik</Text>
                </View>
                <View style={styles.scaleRow}>
                  <Text style={[styles.scaleRange, { backgroundColor: "#dcfce7", color: "#15803d" }]}>
                    4.6 - 5
                  </Text>
                  <Text style={[styles.scaleLabel, { backgroundColor: "#16a34a" }]}>Memuaskan</Text>
                </View>

                {data.catatan && (
                  <View style={{ marginTop: 16, padding: 10, backgroundColor: BG, borderRadius: 6 }}>
                    <Text style={{ fontSize: 9, fontWeight: 700, marginBottom: 4 }}>Catatan Guru</Text>
                    <Text style={{ fontSize: 9, color: "#334155" }}>{data.catatan}</Text>
                  </View>
                )}

                <View style={styles.signBlock}>
                  <Text style={styles.signTxt}>{today}</Text>
                  {data.teacher?.ttdUrl && (
                    <Image
                      src={data.teacher.ttdUrl}
                      style={{ width: 100, height: 50, marginTop: 6 }}
                    />
                  )}
                  <Text style={[styles.signTxt, { marginTop: 30, fontWeight: 700 }]}>
                    {data.teacher?.nama || "Guru Pengampu"}
                  </Text>
                </View>
              </>
            )}
          </View>

          <Text style={styles.footer}>{schoolName} — Rapor Digital</Text>
        </Page>
      ))}

      {pages.length === 0 && (
        <Page size="A4" style={styles.page}>
          <Image src={reportLast} style={{ width: "100%", height: "100%" }} />
        </Page>
      )}
    </Document>
  );
}
