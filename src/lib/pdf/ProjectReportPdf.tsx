import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

/* ============================================================================
 * TYPES - Tetap sesuai struktur API
 * ========================================================================== */

export interface ProjectDesign {
  judul: string;
  screenshot?: string | null;
  kompetensi_siswa?: string;
  teknologi?: string;
  deskripsi?: string;
}

export interface ProjectRobotik {
  judul: string;
  screenshot?: string | null;
  kompetensi_siswa?: string;
  teknologi?: string;
  deskripsi?: string;
}

export interface ProjectVideo {
  thumbnail?: string | null;
  qr?: string | null;
  judul_video: string;
  deskripsi_video?: string;
  link_youtube: string;
}

export interface ProjectMengajar {
  foto1?: string | null;
  foto2?: string | null;
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
  nama: string;
  itpt: number;
  itpb: number;
  itsl: number;
  itbl: number;
  ittuntas: number;
  ityt: number;
  itc: number;
  itm: number;
  itb: number;
  itl: number;
  itr: number;
  itd: number;
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

const BLUE = "#3b3ec6";
const DARK_BLUE = "#1e1e6e";
const TEAL = "#00b4b4";
const ORANGE = "#f5a623";
const PINK = "#e83e8c";
const LIGHT_BG = "#f4f4f8";
const WHITE = "#ffffff";
const TEXT = "#1a1a1a";
const MUTED = "#6b7280";

/* ============================================================================
 * STYLES - Optimized for @react-pdf/renderer
 * ========================================================================== */

const s = StyleSheet.create({
  page: {
    backgroundColor: WHITE,
    fontFamily: "Helvetica",
    color: TEXT,
    position: "relative",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: DARK_BLUE,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  footerText: {
    color: WHITE,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
    textAlign: "center",
  },

  content: {
    padding: 28,
    paddingBottom: 44, // 12px clearance above footer
  },

  // ── COVER PAGE ────────────────────────────────────────────────────────────
  coverPage: {
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    padding: 48,
    height: "100%",
  },
  coverLogo: { fontSize: 44, marginBottom: 16 },
  coverTitle: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    marginBottom: 6,
    textAlign: "center",
  },
  coverSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 28,
    textAlign: "center",
  },
  coverProfile: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  coverProfileIcon: { fontSize: 36, color: WHITE },
  coverName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    marginBottom: 4,
  },
  coverRole: { fontSize: 10, color: "rgba(255,255,255,0.8)" },

  // ── SUMMARY PAGE ──────────────────────────────────────────────────────────
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  summaryAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  summaryAvatarIcon: { fontSize: 22, color: WHITE },
  summaryNameBox: { flex: 1, minWidth: 0 },
  summaryName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: TEXT,
    marginBottom: 2,
  },
  summaryRole: { fontSize: 9, color: MUTED },

  summaryTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
    marginBottom: 14,
  },

  summaryCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    padding: 16,
  },

  summaryRow: {
    flexDirection: "row",
    marginBottom: 12,
  },

  nameBox: {
    width: "42%",
    backgroundColor: "#eef2ff",
    borderRadius: 8,
    padding: 12,
    justifyContent: "center",
    marginRight: 12,
  },
  nameText: {
    fontSize: 14,
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
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  persenRow: { flexDirection: "row", marginRight: -8 },
  persenItem: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 6,
    padding: 8,
    alignItems: "center",
    marginRight: 8,
  },
  persenLabel: { color: WHITE, fontSize: 7 },
  persenValue: { color: WHITE, fontSize: 18, fontFamily: "Helvetica-Bold" },

  keteranganBox: {
    width: "42%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 12,
    marginRight: 12,
  },
  keteranganLabel: { fontSize: 8, color: MUTED, marginBottom: 4 },
  keteranganValue: { fontSize: 20, fontFamily: "Helvetica-Bold", color: TEXT },

  totalBox: {
    flex: 1,
    backgroundColor: "#1f2937",
    borderRadius: 8,
    padding: 12,
  },
  totalTitle: { color: WHITE, fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  totalRow: { flexDirection: "row", marginRight: -8 },
  totalItem: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 6,
    padding: 8,
    alignItems: "center",
    marginRight: 8,
  },
  totalLabel: { color: "#9ca3af", fontSize: 7 },
  totalValue: { color: WHITE, fontSize: 16, fontFamily: "Helvetica-Bold" },

  // Badges Grid - Fixed for PDF
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  badgeItem: {
    width: "23.5%",
    marginBottom: 10,
    marginRight: "2%",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 10,
  },
  badgeItemLastInRow: {
    marginRight: 0,
  },
  badgeEmoji: { fontSize: 18, marginBottom: 4, textAlign: "center" },
  badgeLabel: {
    fontSize: 7,
    color: MUTED,
    marginBottom: 4,
    textAlign: "center",
    lineHeight: 1.2,
    minHeight: 16,
  },
  badgeValue: {
    backgroundColor: ORANGE,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    color: WHITE,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    minWidth: 20,
  },
  badgeValuePink: {
    backgroundColor: PINK,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    color: WHITE,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    minWidth: 20,
  },

  // ── PROJECT PAGES ─────────────────────────────────────────────────────────
  projectHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  projectIcon: { fontSize: 18, marginRight: 8 },
  projectTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
  },
  projectSubtitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: TEXT,
    marginBottom: 12,
  },
  screenshotBox: {
    width: "100%",
    height: 240,
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    marginBottom: 14,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  screenshotImg: { width: "100%", height: "100%" },
  screenshotPlaceholder: { color: "#9ca3af", fontSize: 10, textAlign: "center" },

  infoRow: { flexDirection: "row", marginRight: -10 },
  infoBox: {
    flex: 1,
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    padding: 10,
    minHeight: 60,
    marginRight: 10,
    minWidth: 0, // Prevent overflow
  },
  infoBoxWide: {
    flex: 2,
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    padding: 10,
    minHeight: 60,
    marginRight: 10,
    minWidth: 0,
  },
  infoTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: TEXT,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: { fontSize: 8, color: TEXT, lineHeight: 1.4, wrap: true },

  // ── VIDEO PAGE ────────────────────────────────────────────────────────────
  videoHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  videoHeaderIcon: { fontSize: 14, marginRight: 8 },
  videoHeaderText: { fontSize: 11, fontFamily: "Helvetica-Bold", color: BLUE },

  videoThumb: {
    width: "100%",
    height: 200,
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    marginBottom: 12,
    overflow: "hidden",
  },
  videoPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  ytRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ytLogoBox: {
    width: 50,
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    padding: 6,
    alignItems: "center",
    marginRight: 10,
  },
  ytLogoText: { fontSize: 7, color: "#dc2626", fontFamily: "Helvetica-Bold" },
  ytTitleBox: { flex: 1, minWidth: 0 },
  ytLabel: { fontSize: 7, fontFamily: "Helvetica-Bold", color: ORANGE },
  ytTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: TEXT, wrap: true },

  competenceBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    padding: 10,
  },
  competenceLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: ORANGE,
    marginBottom: 4,
  },
  competenceText: { fontSize: 8, color: TEXT, lineHeight: 1.4, wrap: true },

  // ── MENGAJAR PAGE ─────────────────────────────────────────────────────────
  mengajarTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  mengajarIcon: { fontSize: 18, marginRight: 8 },

  photoRow: { flexDirection: "row", marginRight: -10, marginBottom: 10 },
  photoBox: {
    flex: 1,
    height: 160,
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    overflow: "hidden",
    marginRight: 10,
  },

  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  metaItem: {
    backgroundColor: LIGHT_BG,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  metaLabel: { fontSize: 7, fontFamily: "Helvetica-Bold", color: MUTED, marginRight: 4 },
  metaValue: { fontSize: 8, color: TEXT },

  storyRow: { flexDirection: "row", marginRight: -10 },
  storyBox: {
    flex: 1,
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    padding: 10,
    minHeight: 70,
    marginRight: 10,
    minWidth: 0,
  },
  storyTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: TEXT, marginBottom: 4 },
  storyText: { fontSize: 8, color: TEXT, lineHeight: 1.4, wrap: true },

  // ── CERTIFICATE PAGE ──────────────────────────────────────────────────────
  certTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  certIcon: { fontSize: 18, marginRight: 8 },
  certGrid: { flexDirection: "row", flexWrap: "wrap", marginRight: -12 },
  certItem: {
    width: "48%",
    marginBottom: 12,
    marginRight: "4%",
  },
  certItemLast: { marginRight: 0 },
  certImgBox: {
    width: "100%",
    height: 160,
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  certMeta: { fontSize: 7, color: MUTED },
  certTema: { fontSize: 9, fontFamily: "Helvetica-Bold", color: TEXT, marginBottom: 2 },
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

function CoverPage({ name }: { name: string }) {
  return (
    <Page size="A4" style={s.page}>
      <View style={s.coverPage}>
        <Text style={s.coverLogo}>🎓</Text>
        <Text style={s.coverTitle}>PORTFOLIO REPORT</Text>
        <Text style={s.coverSubtitle}>Talent Achievement • IT & Robotics</Text>
        <View style={s.coverProfile}>
          <Text style={s.coverProfileIcon}>👤</Text>
        </View>
        <Text style={s.coverName}>{name}</Text>
        <Text style={s.coverRole}>Student Developer & Designer</Text>
      </View>
      <FooterBar />
    </Page>
  );
}

function SummaryPage({ summary }: { summary: ProjectSummary }) {
  const badges = [
    { emoji: "🎬", label: "Video", value: summary.ityt, color: "orange" },
    { emoji: "🏅", label: "Sertifikat", value: summary.itc, color: "orange" },
    { emoji: "🎮", label: "Game", value: 0, color: "gray" },
    { emoji: "🌐", label: "Website", value: 0, color: "gray" },
    { emoji: "👨‍🏫", label: "IDN Mengajar", value: summary.itm, color: "pink" },
    { emoji: "📚", label: "Karya Buku", value: summary.itb, color: "pink" },
    { emoji: "🤖", label: "Robotik", value: summary.itr, color: "orange" },
    { emoji: "💡", label: "IoT", value: 0, color: "gray" },
    { emoji: "🏆", label: "Lomba IT", value: summary.itl, color: "orange" },
    { emoji: "🎨", label: "Desain", value: summary.itd, color: "orange" },
  ];

  return (
    <Page size="A4" style={s.page}>
      <View style={s.content}>
        <View style={s.summaryHeader}>
          <View style={s.summaryAvatar}>
            <Text style={s.summaryAvatarIcon}>👤</Text>
          </View>
          <View style={s.summaryNameBox}>
            <Text style={s.summaryName}>{summary.nama}</Text>
            <Text style={s.summaryRole}>IT & Robotics Student Portfolio</Text>
          </View>
        </View>

        <Text style={s.summaryTitle}>📊 Summary IT</Text>
        <View style={s.summaryCard}>
          {/* Row 1 */}
          <View style={s.summaryRow}>
            <View style={s.nameBox}>
              <Text style={s.nameText}>Progress Status</Text>
            </View>
            <View style={s.persenBox}>
              <Text style={s.persenTitle}>Persentase</Text>
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

          {/* Row 2 */}
          <View style={s.summaryRow}>
            <View style={s.keteranganBox}>
              <Text style={s.keteranganLabel}>Keterangan Project :</Text>
              <Text style={s.keteranganValue}>{summary.ittuntas} Tuntas</Text>
            </View>
            <View style={s.totalBox}>
              <Text style={s.totalTitle}>Total Project</Text>
              <View style={s.totalRow}>
                <View style={s.totalItem}>
                  <Text style={s.totalLabel}>Selesai</Text>
                  <Text style={s.totalValue}>{summary.itsl}</Text>
                </View>
                <View style={s.totalItem}>
                  <Text style={s.totalLabel}>Proses</Text>
                  <Text style={s.totalValue}>{summary.itbl}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Badges */}
          <View style={s.badgesGrid}>
            {badges.map((b, i) => {
              const isLastInRow = (i + 1) % 4 === 0;
              return (
                <View key={i} style={[s.badgeItem, isLastInRow && s.badgeItemLastInRow]}>
                  <Text style={s.badgeEmoji}>{b.emoji}</Text>
                  <Text style={s.badgeLabel}>{b.label}</Text>
                  <Text style={b.color === "pink" ? s.badgeValuePink : s.badgeValue}>
                    {b.value}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
      <FooterBar />
    </Page>
  );
}

function ProjectPage({
  project,
  type = "IT Project",
  icon = "💻",
}: {
  project: ProjectDesign | ProjectRobotik;
  type?: string;
  icon?: string;
}) {
  return (
    <Page size="A4" style={s.page}>
      <View style={s.content}>
        <View style={s.projectHeader}>
          <Text style={s.projectIcon}>{icon}</Text>
          <Text style={s.projectTitle}>{type}</Text>
        </View>
        <Text style={s.projectSubtitle}>{project.judul}</Text>

        <View style={s.screenshotBox}>
          {project.screenshot ? (
            <Image src={project.screenshot} style={s.screenshotImg} />
          ) : (
            <Text style={s.screenshotPlaceholder}>📷 [ Screenshot Karya ]</Text>
          )}
        </View>

        <View style={s.infoRow}>
          <View style={s.infoBox}>
            <Text style={s.infoTitle}>🎓 Student Competence</Text>
            <Text style={s.infoText}>{project.kompetensi_siswa || "-"}</Text>
          </View>
          <View style={s.infoBoxWide}>
            <Text style={s.infoTitle}>📝 Description</Text>
            <Text style={s.infoText}>{project.deskripsi || "-"}</Text>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={{ ...s.infoBox, width: "100%", marginRight: 0 }}>
            <Text style={s.infoTitle}>⚙️ Technology</Text>
            <Text style={s.infoText}>{project.teknologi || "-"}</Text>
          </View>
        </View>
      </View>
      <FooterBar />
    </Page>
  );
}

function VideoPage({ video }: { video: ProjectVideo }) {
  return (
    <Page size="A4" style={s.page}>
      <View style={s.content}>
        <View style={s.videoHeader}>
          <Text style={s.videoHeaderIcon}>🎬</Text>
          <Text style={s.videoHeaderText}>Project Video Tutorial</Text>
        </View>

        <View style={s.videoThumb}>
          {video.thumbnail ? (
            <Image src={video.thumbnail} style={{ width: "100%", height: "100%" }} />
          ) : (
            <View style={s.videoPlaceholder}>
              <Text style={{ fontSize: 40, color: "#dc2626" }}>▶️</Text>
            </View>
          )}
        </View>

        <View style={s.ytRow}>
          <View style={s.ytLogoBox}>
            <Text style={s.ytLogoText}>YouTube</Text>
            {video.qr && (
              <Image src={video.qr} style={{ width: 36, height: 36, marginTop: 4 }} />
            )}
          </View>
          <View style={s.ytTitleBox}>
            <Text style={s.ytLabel}>VIDEO TITLE</Text>
            <Text style={s.ytTitle}>{video.judul_video}</Text>
          </View>
        </View>

        <View style={s.competenceBox}>
          <View>
            <Text style={s.competenceLabel}>💡 COMPETENCE</Text>
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

function MengajarPage({ item }: { item: ProjectMengajar }) {
  return (
    <Page size="A4" style={s.page}>
      <View style={s.content}>
        <View style={s.mengajarTitle}>
          <Text style={s.mengajarIcon}>👨‍🏫</Text>
          <Text>IDN Mengajar</Text>
        </View>

        <View style={s.photoRow}>
          {[item.foto1, item.foto2].map((foto, i) => (
            <View key={i} style={s.photoBox}>
              {foto ? (
                <Image src={foto} style={{ width: "100%", height: "100%" }} />
              ) : (
                <View style={{ alignItems: "center", justifyContent: "center", height: "100%" }}>
                  <Text style={{ color: "#9ca3af", fontSize: 9 }}>📷 [ Foto {i + 1} ]</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={s.metaRow}>
          {[
            { label: "📍", value: item.lokasi },
            { label: "📅", value: item.tanggal },
            { label: "🎯", value: item.tema },
            { label: "👥", value: item.jumlah_peserta ? `${item.jumlah_peserta} Orang` : undefined },
          ]
            .filter((m) => m.value)
            .map((m, i) => (
              <View key={i} style={s.metaItem}>
                <Text style={s.metaLabel}>{m.label}</Text>
                <Text style={s.metaValue}>{m.value}</Text>
              </View>
            ))}
        </View>

        <View style={s.storyRow}>
          <View style={s.storyBox}>
            <Text style={s.storyTitle}>📖 Story</Text>
            <Text style={s.storyText}>{item.cerita_siswa || "-"}</Text>
          </View>
          <View style={s.storyBox}>
            <Text style={s.storyTitle}>💬 Testimoni</Text>
            <Text style={s.storyText}>{item.testimoni_peserta || "-"}</Text>
          </View>
        </View>
      </View>
      <FooterBar />
    </Page>
  );
}

function CertificatesPage({ certs }: { certs: ProjectCertificate[] }) {
  const pairs: [ProjectCertificate, ProjectCertificate | null][] = [];
  for (let i = 0; i < certs.length; i += 2) {
    pairs.push([certs[i], certs[i + 1] ?? null]);
  }

  return (
    <>
      {pairs.map((pair, pageIdx) => (
        <Page key={pageIdx} size="A4" style={s.page}>
          <View style={s.content}>
            <View style={s.certTitle}>
              <Text style={s.certIcon}>🏅</Text>
              <Text>Certificates</Text>
            </View>
            <View style={s.certGrid}>
              {pair
                .filter(Boolean)
                .map((cert, i) =>
                  cert ? (
                    <View key={i} style={[s.certItem, i === pair.filter(Boolean).length - 1 ? s.certItemLast : null]}>
                      <View style={s.certImgBox}>
                        {cert.gambar ? (
                          <Image src={cert.gambar} style={{ width: "100%", height: "100%" }} />
                        ) : (
                          <Text style={{ color: "#9ca3af", fontSize: 8 }}>📜 [ Sertifikat ]</Text>
                        )}
                      </View>
                      <Text style={s.certTema}>{cert.tema || "(Tanpa tema)"}</Text>
                      <Text style={s.certMeta}>
                        {[cert.lingkup, cert.tanggal].filter(Boolean).join(" • ")}
                      </Text>
                    </View>
                  ) : null
                )}
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
      <CoverPage name={data.summary.nama} />
      <SummaryPage summary={data.summary} />

      {data.designs.map((d, i) => (
        <ProjectPage key={`design-${i}`} project={d} type="🎨 Design Project" icon="🎨" />
      ))}

      {data.robotics.map((r, i) => (
        <ProjectPage key={`robotik-${i}`} project={r} type="🤖 Robotics Project" icon="🤖" />
      ))}

      {data.videos.map((v, i) => (
        <VideoPage key={`video-${i}`} video={v} />
      ))}

      {data.mengajar.map((m, i) => (
        <MengajarPage key={`mengajar-${i}`} item={m} />
      ))}

      {data.certificates.length > 0 && <CertificatesPage certs={data.certificates} />}
    </Document>
  );
}
