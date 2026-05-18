import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";

/* ============================================================================
 * TYPES - sesuai template PDF yang diupload
 * ========================================================================== */

export interface ProjectDesign {
  judul: string;
  screenshot?: string | null; // ssdesain
  kompetensi_siswa?: string;
  teknologi?: string;
  deskripsi?: string;
}

export interface ProjectRobotik {
  judul: string;
  screenshot?: string | null; // ssiot / ssrobotik
  kompetensi_siswa?: string;
  teknologi?: string;
  deskripsi?: string;
}

export interface ProjectVideo {
  thumbnail?: string | null; // vd1
  qr?: string | null; // vd1_qr
  judul_video: string;
  deskripsi_video?: string;
  link_youtube: string;
}

export interface ProjectMengajar {
  foto1?: string | null; // ftmgj1
  foto2?: string | null; // ftmgj2
  lokasi?: string;
  tanggal?: string;
  tema?: string;
  jumlah_peserta?: number;
  cerita_siswa?: string;
  testimoni_peserta?: string;
}

export interface ProjectCertificate {
  gambar?: string | null;
  lingkup?: string;
  tanggal?: string;
  tema?: string;
}

export interface ProjectSummary {
  // Summary page vars
  nama: string;
  itpt: number;     // total_tercapai
  itpb: number;     // belum_tercapai
  itsl: number;     // selesai
  itbl: number;     // belum_selesai
  ittuntas: number; // tuntas
  ityt: number;     // total_video_youtube
  itc: number;      // total_sertifikat
  itm: number;      // total_mengajar
  itb: number;      // total_buku
  itl: number;      // total_lomba_it
  itr: number;      // total_robotik
  itd: number;      // total_desain
}

export interface ProjectReportData {
  summary: ProjectSummary;
  designs: ProjectDesign[];
  robotics: ProjectRobotik[];
  videos: ProjectVideo[];
  mengajar: ProjectMengajar[];
  certificates: ProjectCertificate[];
}

/* ============================================================================
 * COLORS
 * ========================================================================== */

const BLUE = "#3b3ec6";       // Purple-blue from template header
const DARK_BLUE = "#1e1e6e";  // Footer dark blue
const TEAL = "#00b4b4";       // Teal accent (Tercapai)
const ORANGE = "#f5a623";     // Orange badge
const PINK = "#e83e8c";       // Pink badge
const LIGHT_BG = "#f0f0f0";   // Light gray placeholder
const WHITE = "#ffffff";
const TEXT = "#1a1a1a";
const MUTED = "#666";

/* ============================================================================
 * STYLES
 * ========================================================================== */

const s = StyleSheet.create({
  page: {
    backgroundColor: WHITE,
    fontFamily: "Helvetica",
    color: TEXT,
    position: "relative",
  },

  // Footer bar
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: DARK_BLUE,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  footerText: {
    color: WHITE,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },

  // Page content wrapper (leaves room for footer)
  content: {
    padding: 28,
    paddingBottom: 40,
  },

  // ── SUMMARY PAGE ──────────────────────────────────────────────────────────

  summaryTitle: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
    marginBottom: 16,
  },

  summaryCard: {
    borderRadius: 8,
    border: "1 solid #ddd",
    backgroundColor: "#f8f8ff",
    padding: 16,
  },

  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  nameBox: {
    width: "45%",
    backgroundColor: "#e8e8ff",
    borderRadius: 8,
    padding: 12,
    justifyContent: "center",
  },
  nameText: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
  },

  persenBox: {
    flex: 1,
    backgroundColor: TEAL,
    borderRadius: 8,
    padding: 12,
  },
  persenTitle: {
    color: WHITE,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  persenRow: { flexDirection: "row", gap: 8 },
  persenItem: { flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 6, padding: 8, alignItems: "center" },
  persenLabel: { color: WHITE, fontSize: 8 },
  persenValue: { color: WHITE, fontSize: 20, fontFamily: "Helvetica-Bold" },

  keteranganBox: {
    width: "45%",
    borderRadius: 8,
    border: "1 solid #ccc",
    padding: 12,
  },
  keteranganLabel: { fontSize: 9, color: MUTED, marginBottom: 4 },
  keteranganValue: { fontSize: 22, fontFamily: "Helvetica-Bold", color: TEXT },

  totalBox: {
    flex: 1,
    backgroundColor: "#2a2a4a",
    borderRadius: 8,
    padding: 12,
  },
  totalTitle: { color: WHITE, fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  totalRow: { flexDirection: "row", gap: 8 },
  totalItem: { flex: 1, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 6, padding: 8, alignItems: "center" },
  totalLabel: { color: "#aaa", fontSize: 8 },
  totalValue: { color: WHITE, fontSize: 18, fontFamily: "Helvetica-Bold" },

  // Grid of project type badges
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  badgeItem: {
    width: "22%",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 8,
    border: "1 solid #ddd",
    padding: 8,
  },
  badgeEmoji: { fontSize: 16, marginBottom: 4 },
  badgeLabel: { fontSize: 7, color: MUTED, marginBottom: 4, textAlign: "center" },
  badgeValue: {
    backgroundColor: ORANGE,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    color: WHITE,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  badgeValuePink: {
    backgroundColor: PINK,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    color: WHITE,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },

  // ── IT PROJECT PAGE ────────────────────────────────────────────────────────

  projectTitle: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
    marginBottom: 4,
  },
  projectSubtitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: TEXT,
    marginBottom: 12,
  },
  screenshotBox: {
    width: "100%",
    height: 260,
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    marginBottom: 14,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  screenshotImg: { width: "100%", height: "100%", objectFit: "cover" },
  screenshotPlaceholder: { color: "#aaa", fontSize: 11 },

  infoRow: { flexDirection: "row", gap: 12 },
  infoBox: {
    flex: 1,
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    padding: 10,
    minHeight: 60,
  },
  infoBoxWide: {
    flex: 2,
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    padding: 10,
    minHeight: 60,
  },
  infoTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: TEXT,
    marginBottom: 6,
  },
  infoText: { fontSize: 9, color: TEXT },

  // ── VIDEO PAGE ────────────────────────────────────────────────────────────

  videoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  videoHeaderText: { fontSize: 12, fontFamily: "Helvetica-Bold", color: BLUE },

  videoThumb: {
    width: "100%",
    height: 220,
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    marginBottom: 12,
    overflow: "hidden",
  },

  ytRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  ytLogoBox: {
    width: 60,
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    padding: 6,
    alignItems: "center",
  },
  ytLogoText: { fontSize: 7, color: MUTED },
  ytTitleBox: { flex: 1 },
  ytLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: ORANGE },
  ytTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: TEXT },

  competenceBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    padding: 10,
  },
  competenceLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: ORANGE, marginBottom: 4 },
  competenceText: { fontSize: 9, color: TEXT, lineHeight: 1.5 },

  // ── MENGAJAR PAGE ─────────────────────────────────────────────────────────

  mengajarTitle: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
    marginBottom: 12,
  },

  photoRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  photoBox: {
    flex: 1,
    height: 180,
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    overflow: "hidden",
  },

  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  metaItem: {
    backgroundColor: LIGHT_BG,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  metaLabel: { fontSize: 7, fontFamily: "Helvetica-Bold", color: MUTED },
  metaValue: { fontSize: 9, color: TEXT },

  storyRow: { flexDirection: "row", gap: 10 },
  storyBox: {
    flex: 1,
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    padding: 10,
    minHeight: 80,
  },
  storyTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", color: TEXT, marginBottom: 4 },
  storyText: { fontSize: 9, color: TEXT, lineHeight: 1.5 },

  // ── CERTIFICATE PAGE ──────────────────────────────────────────────────────

  certTitle: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
    marginBottom: 16,
  },
  certGrid: { flexDirection: "row", gap: 12, flexWrap: "wrap" },
  certItem: {
    width: "47%",
    marginBottom: 16,
  },
  certImgBox: {
    width: "100%",
    height: 180,
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  certMeta: { fontSize: 8, color: MUTED },
  certTema: { fontSize: 10, fontFamily: "Helvetica-Bold", color: TEXT, marginBottom: 2 },
});

/* ============================================================================
 * PAGE COMPONENTS
 * ========================================================================== */

function FooterBar() {
  return (
    <View style={s.footer}>
      <Text style={s.footerText}>TALENT ACHIEVEMENTS</Text>
    </View>
  );
}

// ── Page 1: Summary ───────────────────────────────────────────────────────────

function SummaryPage({ summary }: { summary: ProjectSummary }) {
  const badges = [
    { emoji: "▶", label: "Youtube", value: summary.ityt, color: "orange" },
    { emoji: "🏅", label: "Certificates", value: summary.itc, color: "orange" },
    { emoji: "🎮", label: "Game", value: 13, color: "gray" },
    { emoji: "🌐", label: "Website", value: 3, color: "gray" },
    { emoji: "👨‍🏫", label: "IDN Mengajar", value: summary.itm, color: "pink" },
    { emoji: "📚", label: "Karya Buku", value: summary.itb, color: "pink" },
    { emoji: "🤖", label: "Robotic", value: summary.itr, color: "orange" },
    { emoji: "💡", label: "IoT", value: 0, color: "gray" },
    { emoji: "🏆", label: "Competitions", value: summary.itl, color: "orange" },
    { emoji: "🎨", label: "Design", value: summary.itd, color: "orange" },
  ];

  return (
    <Page size="A4" style={s.page}>
      <View style={s.content}>
        <Text style={s.summaryTitle}>Summary IT</Text>
        <View style={s.summaryCard}>
          {/* Row 1: Name + Persen */}
          <View style={s.summaryRow}>
            <View style={s.nameBox}>
              <Text style={s.nameText}>{summary.nama}</Text>
            </View>
            <View style={s.persenBox}>
              <Text style={s.persenTitle}>Persen</Text>
              <View style={s.persenRow}>
                <View style={s.persenItem}>
                  <Text style={s.persenLabel}>Tercapai</Text>
                  <Text style={s.persenValue}>{summary.itpt}</Text>
                </View>
                <View style={s.persenItem}>
                  <Text style={s.persenLabel}>Belum</Text>
                  <Text style={s.persenValue}>{summary.itpb}</Text>
                </View>
              </View>
            </View>
          </View>
          {/* Row 2: Keterangan + Total */}
          <View style={s.summaryRow}>
            <View style={s.keteranganBox}>
              <Text style={s.keteranganLabel}>Keterangan Project :</Text>
              <Text style={s.keteranganValue}>{summary.ittuntas}</Text>
            </View>
            <View style={s.totalBox}>
              <Text style={s.totalTitle}>Total</Text>
              <View style={s.totalRow}>
                <View style={s.totalItem}>
                  <Text style={s.totalLabel}>Selesai</Text>
                  <Text style={s.totalValue}>{summary.itsl}</Text>
                </View>
                <View style={s.totalItem}>
                  <Text style={s.totalLabel}>Belum</Text>
                  <Text style={s.totalValue}>{summary.itbl}</Text>
                </View>
              </View>
            </View>
          </View>
          {/* Badge grid */}
          <View style={s.badgesGrid}>
            {badges.map((b, i) => (
              <View key={i} style={s.badgeItem}>
                <Text style={s.badgeEmoji}>{b.emoji}</Text>
                <Text style={s.badgeLabel}>{b.label}</Text>
                <Text style={b.color === "pink" ? s.badgeValuePink : b.color === "orange" ? s.badgeValue : { ...s.badgeValue, backgroundColor: "#888" }}>
                  {b.value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      <FooterBar />
    </Page>
  );
}

// ── IT Project Page (Design / Robotics) ─────────────────────────────────────

function ProjectPage({ project, index }: { project: ProjectDesign | ProjectRobotik; index: number }) {
  return (
    <Page size="A4" style={s.page}>
      <View style={s.content}>
        <Text style={s.projectTitle}>IT Project</Text>
        <Text style={s.projectSubtitle}>{project.judul}</Text>

        {/* Screenshot */}
        <View style={s.screenshotBox}>
          {project.screenshot ? (
            <Image src={project.screenshot} style={s.screenshotImg} />
          ) : (
            <Text style={s.screenshotPlaceholder}>[ Screenshot Karya ]</Text>
          )}
        </View>

        {/* Info row */}
        <View style={s.infoRow}>
          <View style={s.infoBox}>
            <Text style={s.infoTitle}>Student Competence</Text>
            <Text style={s.infoText}>{project.kompetensi_siswa || "-"}</Text>
          </View>
          <View style={s.infoBoxWide}>
            <Text style={s.infoTitle}>Description</Text>
            <Text style={s.infoText}>{project.deskripsi || "-"}</Text>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={{ ...s.infoBox, width: "40%" }}>
            <Text style={s.infoTitle}>Technology</Text>
            <Text style={s.infoText}>{project.teknologi || "-"}</Text>
          </View>
        </View>
      </View>
      <FooterBar />
    </Page>
  );
}

// ── Video Tutorial Page ───────────────────────────────────────────────────────

function VideoPage({ video }: { video: ProjectVideo }) {
  return (
    <Page size="A4" style={s.page}>
      <View style={s.content}>
        {/* Header */}
        <View style={s.videoHeader}>
          <Text style={{ fontSize: 16 }}>🎬</Text>
          <Text style={s.videoHeaderText}>Project Video Tutorial</Text>
        </View>

        {/* Thumbnail */}
        <View style={s.videoThumb}>
          {video.thumbnail ? (
            <Image src={video.thumbnail} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <View style={{ alignItems: "center", justifyContent: "center", height: "100%" }}>
              <Text style={{ fontSize: 32, color: "#cc0000" }}>▶</Text>
            </View>
          )}
        </View>

        {/* YT row */}
        <View style={s.ytRow}>
          <View style={s.ytLogoBox}>
            <Text style={{ fontSize: 14, color: "#cc0000", fontFamily: "Helvetica-Bold" }}>You Tube</Text>
            {video.qr && <Image src={video.qr} style={{ width: 40, height: 40, marginTop: 4 }} />}
          </View>
          <View style={s.ytTitleBox}>
            <Text style={s.ytLabel}>VIDEO TITLE</Text>
            <Text style={s.ytTitle}>{video.judul_video}</Text>
          </View>
        </View>

        {/* Competence */}
        <View style={s.competenceBox}>
          <View>
            <Text style={s.competenceLabel}>COMPETENCE</Text>
            <Text style={s.competenceText}>
              Ananda telah membuat 1 video dengan tema tutorial IT untuk membagikan pengetahuan yang telah dikuasai.
            </Text>
            {video.deskripsi_video && (
              <Text style={{ ...s.competenceText, marginTop: 6 }}>{video.deskripsi_video}</Text>
            )}
          </View>
        </View>
      </View>
      <FooterBar />
    </Page>
  );
}

// ── IDN Mengajar Page ─────────────────────────────────────────────────────────

function MengajarPage({ item }: { item: ProjectMengajar }) {
  return (
    <Page size="A4" style={s.page}>
      <View style={s.content}>
        <Text style={s.mengajarTitle}>IDN Mengajar</Text>

        {/* Photos */}
        <View style={s.photoRow}>
          {[item.foto1, item.foto2].map((foto, i) => (
            <View key={i} style={s.photoBox}>
              {foto ? (
                <Image src={foto} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <View style={{ alignItems: "center", justifyContent: "center", height: "100%" }}>
                  <Text style={{ color: "#bbb", fontSize: 10 }}>[ Foto {i + 1} ]</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Meta */}
        <View style={s.metaRow}>
          {[
            { label: "Lokasi", value: item.lokasi },
            { label: "Tanggal", value: item.tanggal },
            { label: "Tema", value: item.tema },
            { label: "Jumlah Peserta", value: item.jumlah_peserta ? String(item.jumlah_peserta) : undefined },
          ].filter((m) => m.value).map((m, i) => (
            <View key={i} style={s.metaItem}>
              <Text style={s.metaLabel}>{m.label}</Text>
              <Text style={s.metaValue}>{m.value}</Text>
            </View>
          ))}
        </View>

        {/* Story & Testimoni */}
        <View style={s.storyRow}>
          <View style={s.storyBox}>
            <Text style={s.storyTitle}>Story</Text>
            <Text style={s.storyText}>{item.cerita_siswa || "-"}</Text>
          </View>
          <View style={s.storyBox}>
            <Text style={s.storyTitle}>Testimoni</Text>
            <Text style={s.storyText}>{item.testimoni_peserta || "-"}</Text>
          </View>
        </View>
      </View>
      <FooterBar />
    </Page>
  );
}

// ── Certificates Page (2 per page) ───────────────────────────────────────────

function CertificatesPage({ certs }: { certs: ProjectCertificate[] }) {
  // Group certs in pairs
  const pairs: [ProjectCertificate, ProjectCertificate | null][] = [];
  for (let i = 0; i < certs.length; i += 2) {
    pairs.push([certs[i], certs[i + 1] ?? null]);
  }

  return (
    <>
      {pairs.map((pair, pageIdx) => (
        <Page key={pageIdx} size="A4" style={s.page}>
          <View style={s.content}>
            <Text style={s.certTitle}>Certificates</Text>
            <View style={s.certGrid}>
              {pair.filter(Boolean).map((cert, i) => cert && (
                <View key={i} style={s.certItem}>
                  <View style={s.certImgBox}>
                    {cert.gambar ? (
                      <Image src={cert.gambar} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <Text style={{ color: "#bbb", fontSize: 9 }}>[ Sertifikat ]</Text>
                    )}
                  </View>
                  <Text style={s.certTema}>{cert.tema || "(Tanpa tema)"}</Text>
                  <Text style={s.certMeta}>{[cert.lingkup, cert.tanggal].filter(Boolean).join(" • ")}</Text>
                </View>
              ))}
            </View>
          </View>
          <FooterBar />
        </Page>
      ))}
    </>
  );
}

/* ============================================================================
 * MAIN DOCUMENT
 * ========================================================================== */

export function ProjectReportPdf({ data }: { data: ProjectReportData }) {
  return (
    <Document>
      {/* Page 1: Summary */}
      <SummaryPage summary={data.summary} />

      {/* Design pages */}
      {data.designs.map((d, i) => (
        <ProjectPage key={`design-${i}`} project={d} index={i} />
      ))}

      {/* Robotics pages */}
      {data.robotics.map((r, i) => (
        <ProjectPage key={`robotik-${i}`} project={r} index={i} />
      ))}

      {/* Video pages */}
      {data.videos.map((v, i) => (
        <VideoPage key={`video-${i}`} video={v} />
      ))}

      {/* Mengajar pages */}
      {data.mengajar.map((m, i) => (
        <MengajarPage key={`mengajar-${i}`} item={m} />
      ))}

      {/* Certificates - 2 per page */}
      {data.certificates.length > 0 && (
        <CertificatesPage certs={data.certificates} />
      )}
    </Document>
  );
}
