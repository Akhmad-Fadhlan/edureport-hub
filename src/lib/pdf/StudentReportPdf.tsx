import {
  Document, Page, Text, View, Image, StyleSheet,
} from "@react-pdf/renderer";

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
  catatan?: string | null;
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
  semester: { nama_semester: string; tahun_ajaran: string };
  teacher?: { nama: string; jabatan?: string; ttdDataUrl?: string | null };
  materials: PdfMaterial[];
  schoolName?: string;
  coverBgDataUrl?: string | null;
  reportFirstBgDataUrl?: string | null;
  reportLastBgDataUrl?: string | null;
}

const NAVY = "#1e1b4b";
const BLUE = "#2563eb";
const SOFT = "#f1f5f9";
const TEXT = "#0f172a";
const MUTED = "#64748b";
const YELLOW = "#facc15";

const styles = StyleSheet.create({
  page: { backgroundColor: "#ffffff", fontFamily: "Helvetica", color: TEXT },
  
  // Cover
  coverImg: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" },
  coverOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15,23,42,0.55)" },
  coverWrap: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, padding: 50, justifyContent: "space-between" },
  coverEyebrow: { color: "#fff", fontSize: 10, letterSpacing: 4, fontFamily: "Helvetica-Bold" },
  coverAccent: { width: 56, height: 4, backgroundColor: YELLOW, marginTop: 10 },
  coverTitle: { color: "#fff", fontSize: 42, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  coverSub: { color: "#fff", fontSize: 14, opacity: 0.95 },
  coverBox: { backgroundColor: "rgba(255,255,255,0.14)", padding: 18, borderRadius: 10, marginTop: 22, borderWidth: 1, borderColor: "rgba(255,255,255,0.25)" },
  coverLabel: { color: "#fff", fontSize: 8, opacity: 0.85, letterSpacing: 1.5, fontFamily: "Helvetica-Bold" },
  coverValue: { color: "#fff", fontSize: 16, fontFamily: "Helvetica-Bold", marginTop: 4 },
  coverFoot: { color: "#fff", fontSize: 9, opacity: 0.85 },

  // Content
  contentPage: { backgroundColor: "#ffffff", position: "relative" },
  contentBg: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" },
  topBar: { backgroundColor: NAVY, paddingVertical: 10, paddingHorizontal: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  topBarTitle: { color: "#fff", fontSize: 13, fontFamily: "Helvetica-Bold" },
  topBarSub: { color: "#cbd5e1", fontSize: 9 },

  body: { padding: 24, flexGrow: 1, position: "relative", zIndex: 1 },

  studentRow: { flexDirection: "row", gap: 12, marginBottom: 14 },
  studentCard: { flex: 1, flexDirection: "row", gap: 12, backgroundColor: SOFT, borderRadius: 10, padding: 12, alignItems: "center" },
  avatar: { width: 70, height: 70, borderRadius: 8, backgroundColor: "#cbd5e1", objectFit: "cover" },
  avatarPlaceholder: { width: 70, height: 70, borderRadius: 8, backgroundColor: "#cbd5e1", alignItems: "center", justifyContent: "center" },
  avatarInitials: { fontSize: 28, fontWeight: "bold", color: "#fff", backgroundGradient: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)" },
  studentName: { fontSize: 14, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 4, gap: 4 },
  metaLabel: { fontSize: 8, color: MUTED, fontFamily: "Helvetica-Bold", width: 50 },
  metaVal: { fontSize: 8, color: TEXT, flex: 1 },
  rataCard: { width: 130, backgroundColor: SOFT, borderRadius: 10, padding: 12, alignItems: "center", justifyContent: "center" },
  rataLabel: { fontSize: 9, color: MUTED },
  rataValue: { fontSize: 26, color: NAVY, fontFamily: "Helvetica-Bold", marginTop: 2 },
  rataBadge: { marginTop: 6, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 4, color: "#fff", fontSize: 9, fontFamily: "Helvetica-Bold" },

  matCard: { marginTop: 14, borderRadius: 10, borderWidth: 1, borderColor: "#e2e8f0", overflow: "hidden", breakInside: "avoid" },
  matHeader: { backgroundColor: SOFT, padding: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  matTitle: { fontSize: 12, fontFamily: "Helvetica-Bold" },
  matAvg: { backgroundColor: "#fff", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, fontSize: 12, fontFamily: "Helvetica-Bold", color: TEXT, minWidth: 44, textAlign: "center" },
  indRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: "#e2e8f0", gap: 8 },
  indDesc: { flex: 1, fontSize: 8, color: TEXT, lineHeight: 1.35 },
  barWrap: { width: 110, flexDirection: "row", gap: 2 },
  barSeg: { flex: 1, height: 10, borderRadius: 3 },
  scoreBadge: { width: 32, paddingVertical: 3, borderRadius: 3, fontSize: 9, fontFamily: "Helvetica-Bold", textAlign: "center", backgroundColor: YELLOW, color: TEXT },

  commentBox: { marginTop: 10, borderRadius: 10, overflow: "hidden", borderWidth: 1, borderColor: "#e2e8f0", breakInside: "avoid" },
  commentHead: { backgroundColor: SOFT, padding: 10 },
  commentTitle: { fontSize: 12, fontFamily: "Helvetica-Bold" },
  commentBody: { backgroundColor: "#f8fafc", padding: 12, minHeight: 70 },
  commentText: { fontSize: 9, color: "#334155", lineHeight: 1.5 },

  // Footer (last page) — fixed at bottom
  footer: { position: "absolute", left: 24, right: 24, bottom: 28, flexDirection: "row", justifyContent: "space-between", zIndex: 1 },
  scaleCol: { width: 240 },
  scaleTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 8 },
  scaleRow: { flexDirection: "row", marginBottom: 5, gap: 6, alignItems: "center" },
  scaleRange: { width: 60, paddingVertical: 4, borderRadius: 4, fontSize: 9, fontFamily: "Helvetica-Bold", textAlign: "center" },
  scaleLabel: { width: 130, paddingVertical: 4, borderRadius: 4, fontSize: 9, fontFamily: "Helvetica-Bold", textAlign: "center", color: "#fff" },
  signCol: { width: 200, alignItems: "flex-end" },
  signSmall: { fontSize: 9, color: MUTED, textAlign: "right" },
  signTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", marginTop: 2, textAlign: "right" },
  signImg: { width: 100, height: 50, marginVertical: 8, objectFit: "contain", borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 4 },
  signName: { fontSize: 10, fontFamily: "Helvetica-Bold", textAlign: "right" },

  pageFooter: { position: "absolute", left: 0, right: 0, bottom: 8, fontSize: 7, color: "#94a3b8", textAlign: "center", zIndex: 1 },
  
  lastPageBody: { paddingBottom: 230 },
});

function colorFor(avg: number) {
  if (avg >= 4.6) return { bg: "#16a34a", color: "#fff", label: "Sangat Memuaskan" };
  if (avg >= 3.6) return { bg: BLUE, color: "#fff", label: "Sangat Baik" };
  if (avg >= 2.5) return { bg: "#fbbf24", color: TEXT, label: "Cukup" };
  return { bg: "#f87171", color: "#fff", label: "Butuh Perbaikan" };
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function avgAll(materials: PdfMaterial[]): number {
  const all: number[] = [];
  materials.forEach((m) => m.indicators.forEach((i) => { if (i.nilai != null) all.push(Number(i.nilai)); }));
  if (!all.length) return 0;
  return all.reduce((a, b) => a + b, 0) / all.length;
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function ProgressBar({ nilai, max }: { nilai: number; max: number }) {
  const segs = Math.max(1, Math.round(max));
  const filled = Math.min(segs, Math.round((nilai / max) * segs));
  return (
    <View style={styles.barWrap}>
      {Array.from({ length: segs }).map((_, i) => (
        <View key={i} style={[styles.barSeg, { backgroundColor: i < filled ? BLUE : "#e2e8f0" }]} />
      ))}
    </View>
  );
}

const DEFAULT_COMMENT = "Disini akan tampil feedback dari guru pengampu tentang progress mapping skill dan ability siswa dalam pelajaran ini.";

export function StudentReportPdf({ data }: { data: PdfReportData }) {
  const pages = chunk(data.materials, 2);
  const overall = avgAll(data.materials);
  const overallColor = colorFor(overall);
  const today = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
  const initials = getInitials(data.student.nama || "-");

  return (
    <Document>
      {/* COVER PAGE */}
      <Page size="A4" style={styles.page}>
        {data.coverBgDataUrl && <Image src={data.coverBgDataUrl} style={styles.coverImg} />}
        <View style={styles.coverOverlay} />
        <View style={styles.coverWrap}>
          <View>
            <Text style={styles.coverEyebrow}>STUDENT REPORT</Text>
            <View style={styles.coverAccent} />
          </View>
          <View>
            <Text style={styles.coverTitle}>{(data.student.nama || "-").toUpperCase()}</Text>
            <Text style={styles.coverSub}>{data.semester.nama_semester}</Text>
            <View style={styles.coverBox}>
              <Text style={styles.coverLabel}>KELAS</Text>
              <Text style={styles.coverValue}>{data.student.nama_kelas || "-"}</Text>
              <Text style={[styles.coverLabel, { marginTop: 12 }]}>TAHUN AJARAN</Text>
              <Text style={styles.coverValue}>{data.semester.tahun_ajaran || "-"}</Text>
            </View>
          </View>
          <Text style={styles.coverFoot}>{data.schoolName || "SMP IDN Boarding School"}</Text>
        </View>
      </Page>

      {/* CONTENT PAGES */}
      {pages.map((pageMats, pi) => {
        const isFirst = pi === 0;
        const isLast = pi === pages.length - 1;
        
        // Pilih background berdasarkan posisi halaman
        let bgUrl = null;
        if (isFirst && data.reportFirstBgDataUrl) {
          bgUrl = data.reportFirstBgDataUrl;
        } else if (isLast && data.reportLastBgDataUrl) {
          bgUrl = data.reportLastBgDataUrl;
        }
        
        return (
          <Page key={pi} size="A4" style={styles.contentPage}>
            {/* Background image untuk halaman content */}
            {bgUrl && <Image src={bgUrl} style={styles.contentBg} />}
            
            <View style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
              <View style={styles.topBar}>
                <Text style={styles.topBarTitle}>iD · Student Report</Text>
                <Text style={styles.topBarSub}>{data.semester.nama_semester}</Text>
              </View>
              
              <View style={[styles.body, isLast ? styles.lastPageBody : {}]}>
                {isFirst && (
                  <View style={styles.studentRow}>
                    <View style={styles.studentCard}>
                      {data.student.photoDataUrl ? (
                        <Image src={data.student.photoDataUrl} style={styles.avatar} />
                      ) : (
                        <View style={styles.avatarPlaceholder}>
                          <Text style={styles.avatarInitials}>{initials}</Text>
                        </View>
                      )}
                      <View style={{ flex: 1 }}>
                        <Text style={styles.studentName}>{data.student.nama}</Text>
                        <View style={styles.metaRow}>
                          <Text style={styles.metaLabel}>Email</Text>
                          <Text style={styles.metaVal}>{data.student.email || "-"}</Text>
                        </View>
                        {data.student.linkedin ? (
                          <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>LinkedIn</Text>
                            <Text style={styles.metaVal}>
                              {data.student.linkedin.length > 60
                                ? data.student.linkedin.substring(0, 60) + "…"
                                : data.student.linkedin}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                    <View style={styles.rataCard}>
                      <Text style={styles.rataLabel}>Nilai Rata-rata</Text>
                      <Text style={styles.rataValue}>{overall.toFixed(2)}</Text>
                      <Text style={[styles.rataBadge, { backgroundColor: overallColor.bg, color: overallColor.color }]}>
                        {overallColor.label}
                      </Text>
                    </View>
                  </View>
                )}

                {pageMats.map((m) => {
                  const matAvg = m.indicators.length
                    ? m.indicators.reduce((a, b) => a + (Number(b.nilai) || 0), 0) / m.indicators.length
                    : 0;
                  return (
                    <View key={m.id} wrap={false}>
                      <View style={styles.matCard}>
                        <View style={styles.matHeader}>
                          <Text style={styles.matTitle}>{m.judul}</Text>
                          <Text style={styles.matAvg}>{matAvg.toFixed(1)}</Text>
                        </View>
                        {m.indicators.map((ind, idx) => {
                          const v = Number(ind.nilai) || 0;
                          return (
                            <View key={ind.id} style={styles.indRow}>
                              <Text style={styles.indDesc}>{idx + 1}. {ind.deskripsi}</Text>
                              <ProgressBar nilai={v} max={ind.nilai_max} />
                              <Text style={styles.scoreBadge}>{ind.nilai != null ? v.toFixed(1) : "-"}</Text>
                            </View>
                          );
                        })}
                      </View>
                      <View style={styles.commentBox}>
                        <View style={styles.commentHead}>
                          <Text style={styles.commentTitle}>Comment</Text>
                        </View>
                        <View style={styles.commentBody}>
                          <Text style={styles.commentText}>{m.catatan || DEFAULT_COMMENT}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>

              {isLast && (
                <View style={styles.footer}>
                  <View style={styles.scaleCol}>
                    <Text style={styles.scaleTitle}>Skala Nilai Rata-rata :</Text>
                    <View style={styles.scaleRow}>
                      <Text style={[styles.scaleRange, { backgroundColor: "#fecaca", color: "#b91c1c" }]}>0 - 2.4</Text>
                      <Text style={[styles.scaleLabel, { backgroundColor: "#f87171" }]}>Butuh Perbaikan</Text>
                    </View>
                    <View style={styles.scaleRow}>
                      <Text style={[styles.scaleRange, { backgroundColor: "#fde68a", color: "#92400e" }]}>2.5 - 3.5</Text>
                      <Text style={[styles.scaleLabel, { backgroundColor: "#fbbf24", color: TEXT }]}>Cukup</Text>
                    </View>
                    <View style={styles.scaleRow}>
                      <Text style={[styles.scaleRange, { backgroundColor: "#bfdbfe", color: "#1e40af" }]}>3.6 - 4.5</Text>
                      <Text style={[styles.scaleLabel, { backgroundColor: BLUE }]}>Sangat Baik</Text>
                    </View>
                    <View style={styles.scaleRow}>
                      <Text style={[styles.scaleRange, { backgroundColor: "#bbf7d0", color: "#15803d" }]}>4.6 - 5</Text>
                      <Text style={[styles.scaleLabel, { backgroundColor: "#16a34a" }]}>Sangat Memuaskan</Text>
                    </View>
                  </View>
                  <View style={styles.signCol}>
                    <Text style={styles.signSmall}>Tanggal {today}</Text>
                    <Text style={styles.signTitle}>{data.teacher?.jabatan || "Guru Pengampu"}</Text>
                    {data.teacher?.ttdDataUrl ? (
                      <Image src={data.teacher.ttdDataUrl} style={styles.signImg} />
                    ) : (
                      <View style={styles.signImg} />
                    )}
                    <Text style={styles.signName}>{data.teacher?.nama || "-"}</Text>
                  </View>
                </View>
              )}

              <Text style={styles.pageFooter}>{data.schoolName || "SMP IDN Boarding School"} · Hal {pi + 2}</Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
}
