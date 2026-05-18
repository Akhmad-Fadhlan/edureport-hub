import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Svg,
  Path,
  Circle,
  Rect,
  Polygon,
} from "@react-pdf/renderer";

/* ============================================================================
 * TYPES
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
  itpt: number;    // persentase tercapai
  itpb: number;    // persentase belum
  itsl: number;    // total selesai
  itbl: number;    // total proses
  ittuntas: number;
  ityt: number;    // video youtube
  itc: number;     // sertifikat
  itg: number;     // game dev
  itw: number;     // website
  itm: number;     // idn mengajar
  itb: number;     // karya buku
  itr: number;     // robotik
  iti: number;     // iot
  itl: number;     // lomba
  itd: number;     // desain
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

const C = {
  blue:      "#3b3ec6",
  blueDark:  "#2a2da8",
  blueDeep:  "#1e1e6e",
  blueLight: "#eef2ff",
  teal:      "#00b4b4",
  tealDark:  "#007f7f",
  orange:    "#f5a623",
  orangeDrk: "#b87209",
  pink:      "#e83e8c",
  pinkDark:  "#a82868",
  white:     "#ffffff",
  text:      "#1a1a1a",
  muted:     "#6b7280",
  bg:        "#f4f4f8",
  shadow:    "#a8a8cc",   // shadow utama (ungu-abu)
  shadowDrk: "#7878a8",   // shadow lebih gelap
  dark:      "#1f2937",
  darkShad:  "#0f172a",
};

/* ============================================================================
 * SVG ICONS — solusi 100% native react-pdf, tanpa font emoji
 * Setiap icon dibuat dari shape primitif SVG (Circle, Rect, Polygon, Path)
 * ========================================================================== */

const IcoVideo = ({ n = 22 }: { n?: number }) => (
  <Svg width={n} height={n} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="11" fill="#ef4444" />
    <Polygon points="9,7 9,17 18,12" fill={C.white} />
  </Svg>
);

const IcoCert = ({ n = 22 }: { n?: number }) => (
  <Svg width={n} height={n} viewBox="0 0 24 24">
    <Polygon
      points="12,2 14.9,8.3 22,9.3 17,14.2 18.2,21.1 12,17.8 5.8,21.1 7,14.2 2,9.3 9.1,8.3"
      fill="#f59e0b"
    />
    <Polygon
      points="12,5.5 14.1,9.9 19,10.5 15.5,13.8 16.4,18.7 12,16.3 7.6,18.7 8.5,13.8 5,10.5 9.9,9.9"
      fill="#fcd34d"
    />
  </Svg>
);

const IcoGame = ({ n = 22 }: { n?: number }) => (
  <Svg width={n} height={n} viewBox="0 0 24 24">
    <Rect x="1" y="7" width="22" height="10" rx="5" fill="#7c3aed" />
    <Rect x="4.5" y="11" width="5" height="2" rx="1" fill={C.white} />
    <Rect x="6" y="9.5" width="2" height="5" rx="1" fill={C.white} />
    <Circle cx="16" cy="11" r="1.3" fill={C.white} />
    <Circle cx="18.5" cy="13" r="1.3" fill={C.white} />
  </Svg>
);

const IcoWebsite = ({ n = 22 }: { n?: number }) => (
  <Svg width={n} height={n} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" fill="none" stroke="#3b82f6" strokeWidth="2" />
    <Path d="M12 2 Q8.5 7 8.5 12 Q8.5 17 12 22 Q15.5 17 15.5 12 Q15.5 7 12 2Z" fill="#bfdbfe" />
    <Path d="M2 9 Q12 7 22 9" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
    <Path d="M2 15 Q12 17 22 15" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
  </Svg>
);

const IcoMengajar = ({ n = 22 }: { n?: number }) => (
  <Svg width={n} height={n} viewBox="0 0 24 24">
    <Circle cx="8" cy="6" r="3.5" fill="#f59e0b" />
    <Path d="M1 22 Q1.5 14 8 14 Q14.5 14 15 22Z" fill="#f59e0b" />
    <Rect x="15" y="8" width="8" height="9" rx="1.5" fill={C.blue} />
    <Rect x="16.5" y="10" width="5" height="1.2" rx="0.6" fill={C.white} />
    <Rect x="16.5" y="12.5" width="5" height="1.2" rx="0.6" fill={C.white} />
    <Rect x="16.5" y="15" width="3.5" height="1.2" rx="0.6" fill={C.white} />
  </Svg>
);

const IcoBuku = ({ n = 22 }: { n?: number }) => (
  <Svg width={n} height={n} viewBox="0 0 24 24">
    <Rect x="4" y="3" width="13" height="16" rx="2" fill={C.pink} />
    <Rect x="6" y="7"  width="9" height="1.5" rx="0.75" fill={C.white} />
    <Rect x="6" y="10" width="9" height="1.5" rx="0.75" fill={C.white} />
    <Rect x="6" y="13" width="6" height="1.5" rx="0.75" fill={C.white} />
    <Rect x="4" y="18.5" width="13" height="2.5" rx="1.25" fill={C.pinkDark} />
  </Svg>
);

const IcoRobot = ({ n = 22 }: { n?: number }) => (
  <Svg width={n} height={n} viewBox="0 0 24 24">
    <Rect x="5" y="7"  width="14" height="12" rx="3" fill={C.blue} />
    <Rect x="8" y="10" width="3"  height="3"  rx="1.5" fill="#00e5ff" />
    <Rect x="13" y="10" width="3" height="3"  rx="1.5" fill="#00e5ff" />
    <Rect x="8" y="15" width="8"  height="1.5" rx="0.75" fill={C.white} />
    <Rect x="11" y="3" width="2"  height="4"  rx="1" fill="#9ca3af" />
    <Circle cx="12" cy="2.5" r="1.5" fill="#9ca3af" />
    <Rect x="1" y="9"  width="4" height="7" rx="2" fill="#9ca3af" />
    <Rect x="19" y="9" width="4" height="7" rx="2" fill="#9ca3af" />
  </Svg>
);

const IcoIoT = ({ n = 22 }: { n?: number }) => (
  <Svg width={n} height={n} viewBox="0 0 24 24">
    <Path d="M3 8.5 Q12 3 21 8.5"  stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M6 13 Q12 8.5 18 13"  stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M9 17 Q12 14.5 15 17" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Circle cx="12" cy="20" r="1.8" fill="#10b981" />
  </Svg>
);

const IcoLomba = ({ n = 22 }: { n?: number }) => (
  <Svg width={n} height={n} viewBox="0 0 24 24">
    <Path d="M6 3 L18 3 L16.5 12 Q16 16 12 16 Q8 16 7.5 12 Z" fill="#f59e0b" />
    <Path d="M6 3 L3 3 L3 9 Q3 12 6 12" stroke="#f59e0b" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Path d="M18 3 L21 3 L21 9 Q21 12 18 12" stroke="#f59e0b" strokeWidth="2" fill="none" strokeLinecap="round" />
    <Rect x="10.5" y="16" width="3"  height="4"  fill="#d97706" />
    <Rect x="7"    y="20" width="10" height="2"  rx="1" fill="#d97706" />
    <Path d="M9 6.5 Q10 5.5 11 7" stroke={C.white} strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </Svg>
);

const IcoDesain = ({ n = 22 }: { n?: number }) => (
  <Svg width={n} height={n} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="9" fill="none" stroke={C.orange} strokeWidth="1.5" />
    <Circle cx="12"   cy="5.5" r="3.2" fill="#ef4444" />
    <Circle cx="17.5" cy="15" r="3.2" fill="#3b82f6" />
    <Circle cx="6.5"  cy="15" r="3.2" fill="#22c55e" />
  </Svg>
);

const IcoPlay = ({ n = 48 }: { n?: number }) => (
  <Svg width={n} height={n} viewBox="0 0 48 48">
    <Circle cx="24" cy="24" r="23" fill="#ef4444" />
    <Polygon points="18,12 18,36 38,24" fill={C.white} />
  </Svg>
);

const IcoStar = ({ n = 40 }: { n?: number }) => (
  <Svg width={n} height={n} viewBox="0 0 40 40">
    <Polygon
      points="20,3 24.8,13.8 36.7,15.5 28.4,23.6 30.6,35.5 20,29.8 9.4,35.5 11.6,23.6 3.3,15.5 15.2,13.8"
      fill="#fbbf24"
    />
  </Svg>
);

/* ============================================================================
 * 3D CARD PRIMITIVES
 * Teknik: border bawah+kanan tebal (shadow) + border atas+kiri tipis (highlight)
 * Menghasilkan ilusi permukaan yang naik / timbul (emboss effect).
 * ========================================================================== */

function Card3D({
  children,
  bg = C.white,
  shad = C.shadow,
  depth = 4,
  r = 10,
  pad = 0,
  style,
}: {
  children: React.ReactNode;
  bg?: string;
  shad?: string;
  depth?: number;
  r?: number;
  pad?: number;
  style?: object;
}) {
  return (
    <View
      style={{
        backgroundColor: bg,
        borderRadius: r,
        padding: pad,
        borderBottomWidth: depth,
        borderRightWidth: depth,
        borderBottomColor: shad,
        borderRightColor: shad,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderTopColor: "rgba(255,255,255,0.9)",
        borderLeftColor: "rgba(255,255,255,0.9)",
        ...style,
      }}
    >
      {children}
    </View>
  );
}

function TealCard3D({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: C.teal,
        borderRadius: 10,
        padding: 12,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderBottomColor: C.tealDark,
        borderRightColor: C.tealDark,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderTopColor: "rgba(255,255,255,0.3)",
        borderLeftColor: "rgba(255,255,255,0.3)",
      }}
    >
      {children}
    </View>
  );
}

function DarkCard3D({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: C.dark,
        borderRadius: 10,
        padding: 12,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderBottomColor: C.darkShad,
        borderRightColor: C.darkShad,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderTopColor: "rgba(255,255,255,0.1)",
        borderLeftColor: "rgba(255,255,255,0.1)",
      }}
    >
      {children}
    </View>
  );
}

/* ============================================================================
 * STYLES (hanya yang tidak bisa diekspresikan via Card3D inline)
 * ========================================================================== */

const s = StyleSheet.create({
  page: {
    backgroundColor: C.white,
    fontFamily: "Helvetica",
    color: C.text,
    position: "relative",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: C.blueDeep,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  footerText: {
    color: C.white,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
    textAlign: "center",
  },
  content: { padding: 28, paddingBottom: 48 },

  // COVER
  coverPage: {
    backgroundColor: C.blue,
    alignItems: "center",
    justifyContent: "center",
    padding: 48,
    height: "100%",
  },
  coverBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 7,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  coverBadgeText: {
    color: C.white,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2.5,
    textAlign: "center",
  },
  coverTitle: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    marginBottom: 6,
    textAlign: "center",
  },
  coverSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 32,
    textAlign: "center",
  },
  coverDivider: {
    width: 52,
    height: 3,
    backgroundColor: C.teal,
    borderRadius: 2,
    marginBottom: 32,
  },
  coverProfile: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    // 3D ring
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: "rgba(255,255,255,0.45)",
    borderLeftColor: "rgba(255,255,255,0.45)",
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomColor: "rgba(0,0,0,0.25)",
    borderRightColor: "rgba(0,0,0,0.25)",
  },
  coverInitial: {
    fontSize: 30,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    textAlign: "center",
  },
  coverName: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    marginBottom: 8,
    textAlign: "center",
  },
  coverRoleBadge: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  coverRole: {
    fontSize: 9,
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 1.5,
    textAlign: "center",
  },
  coverFooterBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
  },
  coverFooterText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
    textAlign: "center",
  },

  // SUMMARY
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  summaryAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.blue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: "rgba(255,255,255,0.3)",
    borderLeftColor: "rgba(255,255,255,0.3)",
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: C.blueDark,
    borderRightColor: C.blueDark,
  },
  summaryAvatarInitial: { fontSize: 20, fontFamily: "Helvetica-Bold", color: C.white },
  summaryNameBox: { flex: 1, minWidth: 0 },
  summaryName: { fontSize: 18, fontFamily: "Helvetica-Bold", color: C.text, marginBottom: 2 },
  summaryRole: { fontSize: 9, color: C.muted },
  summaryTitle: { fontSize: 21, fontFamily: "Helvetica-Bold", color: C.blue, marginBottom: 14 },

  summaryRow: { flexDirection: "row", marginBottom: 12 },

  // Name box kiri (Progress Status)
  nameBox: {
    width: "42%",
    backgroundColor: C.blueLight,
    borderRadius: 10,
    padding: 12,
    justifyContent: "center",
    marginRight: 12,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: "#c7d2fe",
    borderRightColor: "#c7d2fe",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: C.white,
    borderLeftColor: C.white,
  },
  nameText: { fontSize: 13, fontFamily: "Helvetica-Bold", color: C.blue },

  // Keterangan box
  keteranganBox: {
    width: "42%",
    backgroundColor: C.white,
    borderRadius: 10,
    padding: 12,
    marginRight: 12,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: C.shadow,
    borderRightColor: C.shadow,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: C.white,
    borderLeftColor: C.white,
  },
  keteranganLabel: { fontSize: 8, color: C.muted, marginBottom: 4 },
  keteranganValue: { fontSize: 20, fontFamily: "Helvetica-Bold", color: C.text },

  // Teal inner items
  persenRow: { flexDirection: "row", marginRight: -8 },
  persenItem: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 7,
    padding: 8,
    alignItems: "center",
    marginRight: 8,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: "rgba(255,255,255,0.35)",
    borderLeftColor: "rgba(255,255,255,0.35)",
    borderBottomWidth: 3,
    borderRightWidth: 2,
    borderBottomColor: "rgba(0,0,0,0.18)",
    borderRightColor: "rgba(0,0,0,0.18)",
  },
  persenLabel: { color: C.white, fontSize: 7 },
  persenValue: { color: C.white, fontSize: 18, fontFamily: "Helvetica-Bold" },
  persenTitle: { color: C.white, fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 6 },

  // Dark inner items
  totalRow: { flexDirection: "row", marginRight: -8 },
  totalItem: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 7,
    padding: 8,
    alignItems: "center",
    marginRight: 8,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    borderLeftColor: "rgba(255,255,255,0.1)",
    borderBottomWidth: 3,
    borderRightWidth: 2,
    borderBottomColor: "rgba(0,0,0,0.35)",
    borderRightColor: "rgba(0,0,0,0.35)",
  },
  totalLabel: { color: "#9ca3af", fontSize: 7 },
  totalValue: { color: C.white, fontSize: 16, fontFamily: "Helvetica-Bold" },
  totalTitle: { color: C.white, fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 6 },

  // BADGE GRID
  badgesGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  badgeItem: {
    width: "23.5%",
    marginBottom: 10,
    marginRight: "2%",
    alignItems: "center",
    backgroundColor: C.white,
    borderRadius: 8,
    padding: 10,
    // 3D timbul per badge
    borderBottomWidth: 4,
    borderRightWidth: 3,
    borderBottomColor: C.shadow,
    borderRightColor: C.shadow,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: "rgba(255,255,255,0.95)",
    borderLeftColor: "rgba(255,255,255,0.95)",
  },
  badgeItemLastInRow: { marginRight: 0 },
  badgeLabel: {
    fontSize: 7,
    color: C.muted,
    marginBottom: 4,
    marginTop: 4,
    textAlign: "center",
    lineHeight: 1.3,
    minHeight: 16,
  },
  badgePillOrange: {
    backgroundColor: C.orange,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    color: C.white,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    minWidth: 20,
    borderBottomWidth: 2,
    borderRightWidth: 1,
    borderBottomColor: C.orangeDrk,
    borderRightColor: C.orangeDrk,
  },
  badgePillPink: {
    backgroundColor: C.pink,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    color: C.white,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    minWidth: 20,
    borderBottomWidth: 2,
    borderRightWidth: 1,
    borderBottomColor: C.pinkDark,
    borderRightColor: C.pinkDark,
  },
  badgePillGray: {
    backgroundColor: "#9ca3af",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    color: C.white,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    minWidth: 20,
    borderBottomWidth: 2,
    borderRightWidth: 1,
    borderBottomColor: "#6b7280",
    borderRightColor: "#6b7280",
  },

  // PROJECT PAGE
  projectHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  projectTypeBadge: {
    backgroundColor: C.blue,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 10,
    borderBottomWidth: 3,
    borderRightWidth: 2,
    borderBottomColor: C.blueDeep,
    borderRightColor: C.blueDeep,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    borderLeftColor: "rgba(255,255,255,0.2)",
  },
  projectTypeLabel: { fontSize: 10, fontFamily: "Helvetica-Bold", color: C.white },
  projectTitle: { fontSize: 20, fontFamily: "Helvetica-Bold", color: C.blue },
  projectSubtitle: { fontSize: 13, fontFamily: "Helvetica-Bold", color: C.text, marginBottom: 14 },

  // 3D screenshot frame
  screenshotBox: {
    width: "100%",
    height: 240,
    backgroundColor: C.bg,
    borderRadius: 10,
    marginBottom: 14,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 6,
    borderRightWidth: 5,
    borderBottomColor: C.shadowDrk,
    borderRightColor: C.shadowDrk,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: C.white,
    borderLeftColor: C.white,
  },
  screenshotImg: { width: "100%", height: "100%" },
  screenshotPlaceholder: { color: "#9ca3af", fontSize: 10, textAlign: "center" },

  // 3D info boxes
  infoRow: { flexDirection: "row", marginRight: -10 },
  infoBox: {
    flex: 1,
    backgroundColor: C.bg,
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    marginRight: 10,
    minWidth: 0,
    borderBottomWidth: 4,
    borderRightWidth: 3,
    borderBottomColor: C.shadow,
    borderRightColor: C.shadow,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: C.white,
    borderLeftColor: C.white,
  },
  infoBoxWide: {
    flex: 2,
    backgroundColor: C.bg,
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    marginRight: 10,
    minWidth: 0,
    borderBottomWidth: 4,
    borderRightWidth: 3,
    borderBottomColor: C.shadow,
    borderRightColor: C.shadow,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: C.white,
    borderLeftColor: C.white,
  },
  infoTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: C.blue, marginBottom: 6 },
  infoText: { fontSize: 8, color: C.text, lineHeight: 1.5 },

  // VIDEO PAGE
  videoHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bg,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: C.shadow,
    borderRightColor: C.shadow,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: C.white,
    borderLeftColor: C.white,
  },
  videoHeaderText: { fontSize: 11, fontFamily: "Helvetica-Bold", color: C.blue, marginLeft: 8 },
  videoThumb: {
    width: "100%",
    height: 200,
    backgroundColor: C.bg,
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
    borderBottomWidth: 6,
    borderRightWidth: 5,
    borderBottomColor: C.shadowDrk,
    borderRightColor: C.shadowDrk,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: C.white,
    borderLeftColor: C.white,
  },
  videoPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  ytRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  ytLogoBox: {
    width: 54,
    backgroundColor: C.bg,
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    marginRight: 10,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: C.shadow,
    borderRightColor: C.shadow,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: C.white,
    borderLeftColor: C.white,
  },
  ytLogoText: { fontSize: 7, color: "#dc2626", fontFamily: "Helvetica-Bold" },
  ytTitleBox: { flex: 1, minWidth: 0 },
  ytLabel: { fontSize: 7, fontFamily: "Helvetica-Bold", color: C.orange },
  ytTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: C.text },
  competenceBox: {
    backgroundColor: C.bg,
    borderRadius: 8,
    padding: 12,
    borderBottomWidth: 4,
    borderRightWidth: 3,
    borderBottomColor: C.shadow,
    borderRightColor: C.shadow,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: C.white,
    borderLeftColor: C.white,
  },
  competenceLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: C.orange, marginBottom: 4 },
  competenceText: { fontSize: 8, color: C.text, lineHeight: 1.5 },

  // MENGAJAR PAGE
  mengajarTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  mengajarTypeBadge: {
    backgroundColor: "#fef3c7",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 10,
    borderBottomWidth: 3,
    borderRightWidth: 2,
    borderBottomColor: "#fde68a",
    borderRightColor: "#fde68a",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: C.white,
    borderLeftColor: C.white,
  },
  mengajarTypeText: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#92400e" },
  mengajarTitle: { fontSize: 20, fontFamily: "Helvetica-Bold", color: C.blue },
  photoRow: { flexDirection: "row", marginRight: -10, marginBottom: 10 },
  photoBox: {
    flex: 1,
    height: 160,
    backgroundColor: C.bg,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 10,
    borderBottomWidth: 6,
    borderRightWidth: 5,
    borderBottomColor: C.shadowDrk,
    borderRightColor: C.shadowDrk,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: C.white,
    borderLeftColor: C.white,
  },
  metaRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  metaItem: {
    backgroundColor: C.bg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomColor: C.shadow,
    borderRightColor: C.shadow,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: C.white,
    borderLeftColor: C.white,
  },
  metaLabel: { fontSize: 7, fontFamily: "Helvetica-Bold", color: C.muted, marginRight: 4 },
  metaValue: { fontSize: 8, color: C.text },
  storyRow: { flexDirection: "row", marginRight: -10 },
  storyBox: {
    flex: 1,
    backgroundColor: C.bg,
    borderRadius: 8,
    padding: 10,
    minHeight: 70,
    marginRight: 10,
    minWidth: 0,
    borderBottomWidth: 4,
    borderRightWidth: 3,
    borderBottomColor: C.shadow,
    borderRightColor: C.shadow,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: C.white,
    borderLeftColor: C.white,
  },
  storyTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: C.blue, marginBottom: 4 },
  storyText: { fontSize: 8, color: C.text, lineHeight: 1.5 },

  // CERTIFICATES PAGE
  certTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  certTypeBadge: {
    backgroundColor: "#fef9c3",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 10,
    borderBottomWidth: 3,
    borderRightWidth: 2,
    borderBottomColor: "#fef08a",
    borderRightColor: "#fef08a",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: C.white,
    borderLeftColor: C.white,
  },
  certTypeText: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#854d0e" },
  certTitle: { fontSize: 20, fontFamily: "Helvetica-Bold", color: C.blue },
  certGrid: { flexDirection: "row", flexWrap: "wrap", marginRight: -12 },
  certItem: { width: "48%", marginBottom: 12, marginRight: "4%" },
  certItemLast: { marginRight: 0 },
  certImgBox: {
    width: "100%",
    height: 160,
    backgroundColor: C.bg,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 6,
    borderRightWidth: 5,
    borderBottomColor: C.shadowDrk,
    borderRightColor: C.shadowDrk,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: C.white,
    borderLeftColor: C.white,
  },
  certMeta: { fontSize: 7, color: C.muted },
  certTema: { fontSize: 9, fontFamily: "Helvetica-Bold", color: C.text, marginBottom: 2 },
});

/* ============================================================================
 * HELPERS
 * ========================================================================== */

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

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
        <View style={s.coverBadge}>
          <Text style={s.coverBadgeText}>PORTFOLIO REPORT</Text>
        </View>
        <Text style={s.coverTitle}>Talent Achievement</Text>
        <Text style={s.coverSubtitle}>IT &amp; Robotics</Text>
        <View style={s.coverDivider} />
        <View style={s.coverProfile}>
          <Text style={s.coverInitial}>{getInitials(name)}</Text>
        </View>
        <Text style={s.coverName}>{name}</Text>
        <View style={s.coverRoleBadge}>
          <Text style={s.coverRole}>STUDENT DEVELOPER &amp; DESIGNER</Text>
        </View>
      </View>
      <View style={s.coverFooterBar}>
        <Text style={s.coverFooterText}>TALENT ACHIEVEMENTS</Text>
      </View>
    </Page>
  );
}

function SummaryPage({ summary }: { summary: ProjectSummary }) {
  type BC = "orange" | "pink" | "gray";
  const badges: { label: string; value: number; color: BC; Icon: (p: { n?: number }) => JSX.Element }[] = [
    { label: "Youtube",       value: summary.ityt,     color: "orange", Icon: IcoVideo    },
    { label: "Certificates",  value: summary.itc,      color: "orange", Icon: IcoCert     },
    { label: "Game Dev",      value: summary.itg ?? 0, color: "orange", Icon: IcoGame     },
    { label: "Website",       value: summary.itw ?? 0, color: "orange", Icon: IcoWebsite  },
    { label: "IDN Mengajar",  value: summary.itm,      color: "pink",   Icon: IcoMengajar },
    { label: "Karya Buku",    value: summary.itb,      color: "pink",   Icon: IcoBuku     },
    { label: "Robotic",       value: summary.itr,      color: "orange", Icon: IcoRobot    },
    { label: "IoT Project",   value: summary.iti ?? 0, color: "gray",   Icon: IcoIoT      },
    { label: "Competitions",  value: summary.itl,      color: "orange", Icon: IcoLomba    },
    { label: "Desain Grafis", value: summary.itd,      color: "orange", Icon: IcoDesain   },
  ];

  const pill = (c: BC) =>
    c === "pink" ? s.badgePillPink : c === "gray" ? s.badgePillGray : s.badgePillOrange;

  return (
    <Page size="A4" style={s.page}>
      <View style={s.content}>
        <View style={s.summaryHeader}>
          <View style={s.summaryAvatar}>
            <Text style={s.summaryAvatarInitial}>{getInitials(summary.nama)}</Text>
          </View>
          <View style={s.summaryNameBox}>
            <Text style={s.summaryName}>{summary.nama}</Text>
            <Text style={s.summaryRole}>IT &amp; Robotics Student Portfolio</Text>
          </View>
        </View>

        <Text style={s.summaryTitle}>Summary IT</Text>

        {/* Outer card 3D */}
        <Card3D shad={C.shadowDrk} depth={5} r={10} pad={16}>
          {/* Row 1 */}
          <View style={s.summaryRow}>
            <View style={s.nameBox}>
              <Text style={s.nameText}>Progress Status</Text>
            </View>
            <TealCard3D>
              <Text style={s.persenTitle}>Persen</Text>
              <View style={s.persenRow}>
                <View style={s.persenItem}>
                  <Text style={s.persenLabel}>Tercapai</Text>
                  <Text style={s.persenValue}>{summary.itpt}%</Text>
                </View>
                <View style={s.persenItem}>
                  <Text style={s.persenLabel}>Belum</Text>
                  <Text style={s.persenValue}>{summary.itpb}%</Text>
                </View>
              </View>
            </TealCard3D>
          </View>

          {/* Row 2 */}
          <View style={s.summaryRow}>
            <View style={s.keteranganBox}>
              <Text style={s.keteranganLabel}>Keterangan Project :</Text>
              <Text style={s.keteranganValue}>{summary.ittuntas} Tuntas</Text>
            </View>
            <DarkCard3D>
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
            </DarkCard3D>
          </View>

          {/* Badge grid */}
          <View style={s.badgesGrid}>
            {badges.map((b, i) => {
              const last = (i + 1) % 4 === 0;
              return (
                <View key={i} style={[s.badgeItem, last && s.badgeItemLastInRow]}>
                  <b.Icon n={22} />
                  <Text style={s.badgeLabel}>{b.label}</Text>
                  <Text style={pill(b.color)}>{b.value}</Text>
                </View>
              );
            })}
          </View>
        </Card3D>
      </View>
      <FooterBar />
    </Page>
  );
}

function ProjectPage({
  project,
  type = "IT Project",
  typeLabel = "IT",
}: {
  project: ProjectDesign | ProjectRobotik;
  type?: string;
  typeLabel?: string;
}) {
  return (
    <Page size="A4" style={s.page}>
      <View style={s.content}>
        <View style={s.projectHeaderRow}>
          <View style={s.projectTypeBadge}>
            <Text style={s.projectTypeLabel}>{typeLabel}</Text>
          </View>
          <Text style={s.projectTitle}>{type}</Text>
        </View>
        <Text style={s.projectSubtitle}>{project.judul}</Text>

        <View style={s.screenshotBox}>
          {project.screenshot ? (
            <Image src={project.screenshot} style={s.screenshotImg} />
          ) : (
            <Text style={s.screenshotPlaceholder}>[ Screenshot Karya ]</Text>
          )}
        </View>

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
          <View style={{ ...s.infoBox, width: "100%", marginRight: 0 }}>
            <Text style={s.infoTitle}>Technology</Text>
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
          <IcoVideo n={18} />
          <Text style={s.videoHeaderText}>Project Video Tutorial</Text>
        </View>

        <View style={s.videoThumb}>
          {video.thumbnail ? (
            <Image src={video.thumbnail} style={{ width: "100%", height: "100%" }} />
          ) : (
            <View style={s.videoPlaceholder}>
              <IcoPlay n={48} />
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
          <Text style={s.competenceLabel}>COMPETENCE</Text>
          <Text style={s.competenceText}>
            Ananda telah membuat 1 video dengan tema tutorial IT untuk membagikan
            pengetahuan yang telah dikuasai.
          </Text>
          {video.deskripsi_video ? (
            <Text style={{ ...s.competenceText, marginTop: 6 }}>{video.deskripsi_video}</Text>
          ) : null}
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
        <View style={s.mengajarTitleRow}>
          <View style={s.mengajarTypeBadge}>
            <Text style={s.mengajarTypeText}>IDN</Text>
          </View>
          <Text style={s.mengajarTitle}>IDN Mengajar</Text>
        </View>

        <View style={s.photoRow}>
          {[item.foto1, item.foto2].map((foto, i) => (
            <View key={i} style={s.photoBox}>
              {foto ? (
                <Image src={foto} style={{ width: "100%", height: "100%" }} />
              ) : (
                <View style={{ alignItems: "center", justifyContent: "center", height: "100%" }}>
                  <Text style={{ color: "#9ca3af", fontSize: 9 }}>[ Foto {i + 1} ]</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={s.metaRow}>
          {[
            { label: "Lokasi",  value: item.lokasi },
            { label: "Tanggal", value: item.tanggal },
            { label: "Tema",    value: item.tema },
            { label: "Peserta", value: item.jumlah_peserta ? `${item.jumlah_peserta} Orang` : undefined },
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
            <View style={s.certTitleRow}>
              <View style={s.certTypeBadge}>
                <Text style={s.certTypeText}>CERT</Text>
              </View>
              <Text style={s.certTitle}>Certificates</Text>
            </View>
            <View style={s.certGrid}>
              {pair.filter(Boolean).map((cert, i) =>
                cert ? (
                  <View
                    key={i}
                    style={[s.certItem, i === pair.filter(Boolean).length - 1 ? s.certItemLast : null]}
                  >
                    <View style={s.certImgBox}>
                      {cert.gambar ? (
                        <Image src={cert.gambar} style={{ width: "100%", height: "100%" }} />
                      ) : (
                        <IcoStar n={40} />
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
        <ProjectPage key={`design-${i}`} project={d} type="Design Project" typeLabel="ART" />
      ))}

      {data.robotics.map((r, i) => (
        <ProjectPage key={`robotik-${i}`} project={r} type="Robotics Project" typeLabel="BOT" />
      ))}

      {data.videos.map((v, i) => (
        <VideoPage key={`video-${i}`} video={v} />
      ))}

      {data.mengajar.map((m, i) => (
        <MengajarPage key={`mengajar-${i}`} item={m} />
      ))}

      {data.certificates.length > 0 && (
        <CertificatesPage certs={data.certificates} />
      )}
    </Document>
  );
}
