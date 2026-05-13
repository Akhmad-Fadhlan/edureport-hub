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

// Color palette
const NAVY = "#1e1b4b";
const ORANGE = "#f59e0b";
const SOFT = "#f8fafc";
const TEXT = "#1e293b";
const MUTED = "#64748b";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    color: TEXT,
  },

  // ─── Cover ───────────────────────────────────────────────────────────────
  // Background image sudah mengandung:
  //   - Logo IDN Boarding School (kiri atas)
  //   - Garis kuning dekoratif
  //   - Foto gedung (area bawah)
  //   - Watermark teks IDN di seluruh halaman
  // Yang ditambahkan via kode (semua absolute, di atas bg):
  //   - Teks statis: label, judul program, tagline
  //   - Teks dinamis: nama siswa, kelas
  //   - Footer: grade & semester dari data API

  coverBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },

  // Blok teks statis — posisi di bawah logo & garis kuning yang sudah ada di bg
  // Mengikuti layout referensi gambar: ~170px dari atas, margin kiri 36px
  coverStaticBlock: {
    position: "absolute",
    top: 170,
    left: 36,
    right: 36,
  },
  coverReportLabel: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  coverProgramTitle: {
    fontSize: 48,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  coverTagline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.90)",
    lineHeight: 1.5,
  },

  // Nama siswa & kelas — area tengah-bawah cover
  coverStudentBlock: {
    position: "absolute",
    top: 400,
    left: 36,
    right: 36,
  },
  coverStudentLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.65)",
    marginBottom: 4,
    letterSpacing: 1,
  },
  coverStudentName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 6,
  },
  coverStudentClass: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
  },

  // Footer grade | semester — paling bawah center, sesuai referensi
  coverFooterBlock: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  coverFooterText: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textAlign: "center",
  },

  // ─── Foreword ─────────────────────────────────────────────────────────────
  forewordPage: {
    padding: "60px 56px",
  },
  forewordTitle: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    textAlign: "center",
    marginBottom: 28,
  },
  forewordParagraph: {
    fontSize: 11.5,
    lineHeight: 1.85,
    color: "#333333",
    textAlign: "justify",
    marginBottom: 14,
  },

  // ─── Report body ──────────────────────────────────────────────────────────
  contentBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  reportBody: {
    padding: "110px 36px 22px 36px",
  },

  // ─── Student card ─────────────────────────────────────────────────────────
  studentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 14,
    marginBottom: 18,
  },
  scLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  scPhotoWrap: {
    width: 82,
    height: 82,
    borderRadius: 8,
    overflow: "hidden",
    flexShrink: 0,
    marginTop: 2,
    backgroundColor: "#e2e8f0",
  },
  scPhoto: {
    width: 82,
    height: 82,
  },
  avatarPlaceholder: {
    width: 82,
    height: 82,
    backgroundColor: "#94a3b8",
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
  scInfo: {
    paddingTop: 20,
    marginLeft: 12,
    flex: 1,
  },
  scName: {
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 10,
  },
  scDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: {
    fontSize: 11,
    color: MUTED,
  },
  scRight: {
    flexDirection: "column",
    alignItems: "flex-end",
    paddingTop: 10,
    paddingRight: 10,
    flexShrink: 0,
    minWidth: 80,
  },
  scAvgValue: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 6,
  },
  scAvgBadge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 20,
    color: "#ffffff",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },

  // ─── Materials ────────────────────────────────────────────────────────────
  twoMaterialsGrid: {
    flexDirection: "column",
    gap: 16,
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
    padding: "10px 16px",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    borderLeftWidth: 4,
    borderLeftColor: NAVY,
  },
  compTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  compTitleDot: {
    width: 9,
    height: 9,
    backgroundColor: NAVY,
    borderRadius: 2,
    marginRight: 6,
  },
  compTitleText: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
  },
  compScore: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  compScoreText: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#000000",
  },
  compIndicators: {
    paddingVertical: 12,
  },
  indRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  indNum: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    backgroundColor: SOFT,
    width: 22,
    height: 22,
    textAlign: "center",
    borderRadius: 5,
    flexShrink: 0,
    paddingTop: 5,
  },
  indText: {
    flex: 1,
    fontSize: 9.5,
    color: "#334155",
    lineHeight: 1.45,
    fontFamily: "Helvetica-Bold",
    marginLeft: 8,
    marginRight: 8,
    maxWidth: 240,
  },

  // ─── Progress bar ─────────────────────────────────────────────────────────
  progressWrapper: {
    flexShrink: 0,
    width: 160,
  },
  progressBarWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 3,
  },
  progressSegmentsRow: {
    flexDirection: "row",
    gap: 3,
    width: 112,
  },
  progressSegment: {
    width: 20,
    height: 9,
    borderRadius: 3,
  },
  progressValue: {
    width: 34,
    height: 24,
    backgroundColor: ORANGE,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  progressValueText: {
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    textAlign: "center",
  },
  progressLabel: {
    fontSize: 8,
    color: MUTED,
    textAlign: "right",
  },

  // ─── Nilai explanation ────────────────────────────────────────────────────
  nilaiExplanation: {
    marginTop: 16,
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
    marginBottom: 5,
  },
  nilaiExplanationText: {
    fontSize: 8.5,
    color: MUTED,
    lineHeight: 1.5,
  },

  // ─── Comment box ──────────────────────────────────────────────────────────
  commentBox: {
    backgroundColor: "#fefce8",
    borderLeftWidth: 4,
    borderLeftColor: ORANGE,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  commentTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginBottom: 8,
  },
  commentText: {
    fontSize: 10.5,
    color: "#475569",
    lineHeight: 1.6,
  },

  // ─── Signature ────────────────────────────────────────────────────────────
  sigSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  sigBlock: {
    minWidth: 180,
    alignItems: "center",
  },
  sigMeta: {
    fontSize: 10,
    color: "#475569",
    marginBottom: 4,
    alignSelf: "flex-start",
  },
  sigBox: {
    width: 180,
    height: 65,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 7,
    marginVertical: 6,
    backgroundColor: "#faf9fe",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  sigPlaceholderText: {
    color: MUTED,
    fontSize: 10,
  },
  sigName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
  },
});

// ─── Helpers ───────────────────────────────────────────────────────────────

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
  let total = 0, count = 0;
  for (const material of materials)
    for (const indicator of material.indicators)
      if (indicator.nilai !== null && indicator.nilai !== undefined) {
        total += Number(indicator.nilai);
        count++;
      }
  return count > 0 ? total / count : 0;
}

function calculateMaterialAverage(material: PdfMaterial): number {
  let total = 0, count = 0;
  for (const indicator of material.indicators)
    if (indicator.nilai !== null && indicator.nilai !== undefined) {
      total += Number(indicator.nilai);
      count++;
    }
  return count > 0 ? total / count : 0;
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

function formatDate(): string {
  const date = new Date();
  const months = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getGradeLabel(className: string): string {
  const match = className.match(/(\d+)/);
  const num = match ? parseInt(match[1]) : 7;
  const ordinals: Record<number, string> = {
    7: "7th", 8: "8th", 9: "9th", 10: "10th", 11: "11th", 12: "12th",
  };
  return ordinals[num] ? `${ordinals[num]} Grade` : `${num}th Grade`;
}

function getSemesterOrdinal(semesterNum: number): string {
  const ordinals: Record<number, string> = { 1: "1st", 2: "2nd", 3: "3rd" };
  return ordinals[semesterNum]
    ? `${ordinals[semesterNum]} Semester`
    : `${semesterNum}th Semester`;
}

function chunkMaterials<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}

// ─── Progress bar component ────────────────────────────────────────────────

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
                { backgroundColor: i < filled ? NAVY : "#e2e8f0" },
              ]}
            />
          ))}
        </View>
        <View style={styles.progressValue}>
          <Text style={styles.progressValueText}>{nilai.toFixed(1)}</Text>
        </View>
      </View>
      <Text style={styles.progressLabel}>{percentage}% dari {max}</Text>
    </View>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

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
  const semesterNum = data.semester.semester || 1;

  // Cover footer: "7th Grade | 2nd Semester" — dari data API
  const gradeLabel = getGradeLabel(studentClass);
  const semesterLabel = getSemesterOrdinal(semesterNum);
  const coverFooter = `${gradeLabel} | ${semesterLabel}`;

  const materials = data.materials;
  const materialPages = chunkMaterials(materials, 2);
  const totalReportPages = materialPages.length;

  return (
    <Document>

      {/* ── 1. COVER PAGE ─────────────────────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        {/* Layer 1: background image */}
        {data.coverBgDataUrl && (
          <Image src={data.coverBgDataUrl} style={styles.coverBg} />
        )}

        {/* Layer 2: teks statis */}
        <View style={styles.coverStaticBlock}>
          <Text style={styles.coverReportLabel}>Competence Report of SMP</Text>
          <Text style={styles.coverProgramTitle}>JAGOAN IT</Text>
          <Text style={styles.coverTagline}>
            Global Tech Starts with Global{"\n"}Communication
          </Text>
        </View>

        {/* Layer 3: nama siswa & kelas dari data API */}
        <View style={styles.coverStudentBlock}>
          <Text style={styles.coverStudentLabel}>Nama Siswa</Text>
          <Text style={styles.coverStudentName}>{studentName}</Text>
          <Text style={styles.coverStudentClass}>{studentClass}</Text>
        </View>

        {/* Layer 4: footer grade | semester dari data API */}
        <View style={styles.coverFooterBlock}>
          <Text style={styles.coverFooterText}>{coverFooter}</Text>
        </View>
      </Page>

      {/* ── 2. KATA PENGANTAR ─────────────────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.forewordPage}>
          <Text style={styles.forewordTitle}>Kata Pengantar</Text>
          <Text style={styles.forewordParagraph}>
            Puji syukur kita panjatkan kehadirat Allah SWT yang telah melimpahkan rahmat dan
            hidayah-Nya, sehingga laporan pencapaian belajar siswa semester ini dapat diselesaikan
            dengan baik. Laporan ini merupakan bentuk pertanggungjawaban kami sebagai pendidik dalam
            memantau dan mengevaluasi perkembangan belajar siswa selama satu semester.
          </Text>
          <Text style={styles.forewordParagraph}>
            Kami menyadari bahwa setiap siswa memiliki potensi dan keunikan masing-masing dalam
            proses pembelajaran. Oleh karena itu, laporan ini tidak hanya berisi nilai akademik,
            tetapi juga mencakup pencapaian kompetensi dan keterampilan yang telah dikuasai siswa
            selama periode pembelajaran berlangsung.
          </Text>
          <Text style={styles.forewordParagraph}>
            Laporan ini dibuat berdasarkan observasi, penilaian harian, tugas-tugas, serta ujian
            yang telah dilaksanakan selama satu semester. Kami berharap laporan ini dapat
            memberikan gambaran yang jelas tentang perkembangan dan pencapaian belajar siswa.
          </Text>
          <Text style={styles.forewordParagraph}>
            Ucapan terima kasih kami sampaikan kepada seluruh pihak yang telah membantu dalam
            proses pembelajaran dan penyusunan laporan ini, terutama kepada orang tua/wali yang
            telah memberikan dukungan penuh kepada siswa dalam mengikuti pembelajaran.
          </Text>
          <Text style={styles.forewordParagraph}>
            Kami menyadari bahwa laporan ini masih jauh dari sempurna. Kritik dan saran yang
            membangun sangat kami harapkan untuk perbaikan di masa yang akan datang. Semoga laporan
            ini bermanfaat bagi semua pihak, khususnya bagi siswa dalam meningkatkan prestasi
            belajarnya.
          </Text>
        </View>
      </Page>

      {/* ── 3. HALAMAN STUDENT REPORT ─────────────────────────────────────── */}
      {materialPages.map((pageMaterials, pageIndex) => {
        const isFirstReportPage = pageIndex === 0;
        const isLastReportPage = pageIndex === totalReportPages - 1;

        // reportFirstBgDataUrl → halaman pertama student report
        // reportLastBgDataUrl  → halaman terakhir student report
        let bgUrl: string | null = null;
        if (isFirstReportPage && data.reportFirstBgDataUrl) bgUrl = data.reportFirstBgDataUrl;
        else if (isLastReportPage && data.reportLastBgDataUrl) bgUrl = data.reportLastBgDataUrl;

        // Hitung nomor urut indikator kumulatif antar halaman
        let indicatorCounter = 1;
        for (let i = 0; i < pageIndex; i++)
          for (const mat of materialPages[i])
            indicatorCounter += mat.indicators.length;

        return (
          <Page key={pageIndex} size="A4" style={styles.page}>
            {bgUrl && <Image src={bgUrl} style={styles.contentBg} />}
            {data.maskBgDataUrl && (
              <Image
                src={data.maskBgDataUrl}
                style={{
                  position: "absolute",
                  top: 0, left: 0,
                  width: "100%", height: "100%",
                  opacity: 0.12,
                }}
              />
            )}

            <View style={styles.reportBody}>

              {/* Student card — hanya di halaman pertama student report */}
              {isFirstReportPage && (
                <View style={styles.studentCard}>
                  <View style={styles.scLeft}>
                    <View style={styles.scPhotoWrap}>
                      {data.student.photoDataUrl ? (
                        <Image src={data.student.photoDataUrl} style={styles.scPhoto} />
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
                          <Text style={styles.detailText}>{studentEmail}</Text>
                        </View>
                      )}
                      {studentLinkedIn && studentLinkedIn !== "-" && (
                        <View style={styles.scDetail}>
                          <Text style={styles.detailText}>{studentLinkedIn}</Text>
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
              )}

              {/* Grid material */}
              <View style={styles.twoMaterialsGrid}>
                {pageMaterials.map((material) => {
                  const matAvg = calculateMaterialAverage(material);
                  return (
                    <View key={material.id} style={styles.compSection}>
                      <View style={styles.compHeader}>
                        <View style={styles.compTitleRow}>
                          <View style={styles.compTitleDot} />
                          <Text style={styles.compTitleText}>{material.judul}</Text>
                        </View>
                        <View style={styles.compScore}>
                          <Text style={styles.compScoreText}>Rata-rata: {matAvg.toFixed(1)}</Text>
                        </View>
                      </View>
                      <View style={styles.compIndicators}>
                        {material.indicators.map((indicator) => {
                          const indNum = indicatorCounter++;
                          const nilai = indicator.nilai ?? 0;
                          const maxNilai = indicator.nilai_max || 5;
                          return (
                            <View key={indicator.id} style={styles.indRow}>
                              <Text style={styles.indNum}>{indNum}</Text>
                              <Text style={styles.indText}>{indicator.deskripsi}</Text>
                              <ProgressBar nilai={nilai} max={maxNilai} />
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Keterangan nilai — hanya di halaman terakhir */}
              {isLastReportPage && (
                <View style={styles.nilaiExplanation}>
                  <Text style={styles.nilaiExplanationTitle}>Keterangan Nilai:</Text>
                  <Text style={styles.nilaiExplanationText}>
                    4.6 - 5.0 : Sangat Memuaskan  |  3.6 - 4.5 : Sangat Baik  |  2.5 - 3.5 : Cukup  |  Kurang dari 2.5 : Butuh Perbaikan
                  </Text>
                </View>
              )}

              {/* Komentar guru — hanya di halaman terakhir */}
              {isLastReportPage && (
                <View style={styles.commentBox}>
                  <Text style={styles.commentTitle}>Komentar Guru Pembimbing</Text>
                  <Text style={styles.commentText}>{noteText}</Text>
                </View>
              )}

              {/* Tanda tangan — hanya di halaman terakhir */}
              {isLastReportPage && (
                <View style={styles.sigSection}>
                  <View style={styles.sigBlock}>
                    <Text style={styles.sigMeta}>Bogor, {currentDate}</Text>
                    <Text style={styles.sigMeta}>{data.teacher?.jabatan || "Guru Pembimbing"}</Text>
                    <View style={styles.sigBox}>
                      {data.teacher?.ttdDataUrl ? (
                        <Image
                          src={data.teacher.ttdDataUrl}
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      ) : (
                        <Text style={styles.sigPlaceholderText}>(Tanda Tangan)</Text>
                      )}
                    </View>
                    <Text style={styles.sigName}>{teacherName}</Text>
                  </View>
                </View>
              )}

            </View>
          </Page>
        );
      })}
    </Document>
  );
}
