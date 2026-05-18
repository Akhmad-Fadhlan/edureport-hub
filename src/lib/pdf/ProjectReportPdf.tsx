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
  itpt: number;
  itpb: number;
  itsl: number;
  itbl: number;
  ittuntas: number;
  ityt: number;
  itc: number;
  itg: number;
  itw: number;
  itm: number;
  itb: number;
  itr: number;
  iti: number;
  itl: number;
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
  shadow:    "#a8a8cc",
  shadowDrk: "#7878a8",
  dark:      "#1f2937",
  darkShad:  "#0f172a",
};

/* ============================================================================
 * SVG ICONS
 * ========================================================================== */

const IcoVideo = ({ n = 32 }: { n?: number }) => (
  <Svg width={n} height={n} viewBox="0 0 48 48">
    <Circle cx="24" cy="24" r="22" fill="#ef4444" />
    <Circle cx="24" cy="24" r="18" fill="#dc2626" />
    <Polygon points="19,14 19,34 36,24" fill="#ffffff" />
  </Svg>
);

const IcoCert = ({ n = 32 }: { n?: number }) => (
  <Svg width={n} height={n} viewBox="0 0 48 48">
    <Circle cx="24" cy="20" r="14" fill="#f59e0b" />
    <Circle cx="24" cy="20" r="10" fill="#fcd34d" />
    <Polygon points="24,12 26.4,17.6 32.5,18.3 28.3,22.3 29.4,28.4 24,25.4 18.6,28.4 19.7,22.3 15.5,18.3 21.6,17.6" fill="#f59e0b" />
    <Rect x="19" y="33" width="10" height="4" rx="2" fill="#d97706" />
    <Rect x="21" y="31" width="6" height="3" rx="1" fill="#f59e0b" />
    <Rect x="15" y="37" width="18" height="3" rx="1.5" fill="#d97706" />
  </Svg>
);

const IcoGame = ({ n = 32 }: { n?: number }) => (
  <Svg width={n} height={n} viewBox="0 0 48 48">
    <Rect x="4" y="14" width="40" height="20" rx="10" fill="#7c3aed" />
    <Rect x="4" y="14" width="40" height="20" rx="10" fill="none" stroke="#6d28d9" strokeWidth="2" />
    <Rect x="10" y="22" width="10" height="4" rx="2" fill="#ddd6fe" />
    <Rect x="13" y="19" width="4" height="10" rx="2" fill="#ddd6fe" />
    <Circle cx="32" cy="21" r="3" fill="#ddd6fe" />
    <Circle cx="37" cy="25" r="3" fill="#ddd6fe" />
    <Circle cx="27" cy="25" r="2" fill="#a78bfa" />
  </Svg>
);

const IcoWebsite = ({ n = 32 }: { n?: number }) => (
  <Svg width={n} height={n} viewBox="0 0 48 48">
    <Circle cx="24" cy="24" r="20" fill="#1d4ed8" />
    <Circle cx="24" cy="24" r="20" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
    <Path d="M24 4 Q18 12 18 24 Q18 36 24 44 Q30 36 30 24 Q30 12 24 4Z" fill="#3b82f6" />
    <Path d="M4 18 Q24 14 44 18" stroke="#93c5fd" strokeWidth="2" fill="none" />
    <Path d="M4 30 Q24 34 44 30" stroke="#93c5fd" strokeWidth="2" fill="none" />
    <Rect x="2" y="22" width="44" height="4" fill="#60a5fa" />
    <Circle cx="24" cy="24" r="20" fill="none" stroke="#93c5fd" strokeWidth="0.5" />
  </Svg>
);

const IcoMengajar = ({ n = 32 }: { n?: number }) => (
  <Svg width={n} height={n} viewBox="0 0 48 48">
    <Circle cx="16" cy="12" r="7" fill="#f59e0b" />
    <Path d="M2 44 Q3 28 16 28 Q29 28 30 44Z" fill="#f59e0b" />
    <Rect x="30" y="16" width="16" height="18" rx="3" fill="#3b3ec6" />
    <Rect x="33" y="20" width="10" height="2.5" rx="1.25" fill="#ffffff" />
    <Rect x="33" y="25" width="10" height="2.5" rx="1.25" fill="#ffffff" />
    <Rect x="33" y="30" width="7" height="2.5" rx="1.25" fill="#a5b4fc" />
  </Svg>
);

const IcoBuku = ({ n = 32 }: { n?: number }) => (
  <Svg width={n} height={n} viewBox="0 0 48 48">
    <Rect x="8" y="6" width="26" height="32" rx="4" fill="#e83e8c" />
    <Rect x="12" y="14" width="18" height="3" rx="1.5" fill="#ffffff" />
    <Rect x="12" y="20" width="18" height="3" rx="1.5" fill="#ffffff" />
    <Rect x="12" y="26" width="12" height="3" rx="1.5" fill="#ffb3d1" />
    <Rect x="8" y="37" width="26" height="5" rx="2.5" fill="#a82868" />
    <Rect x="5" y="6" width="4" height="36" rx="2" fill="#c02070" />
  </Svg>
);

const IcoRobot = ({ n = 32 }: { n?: number }) => (
  <Svg width={n} height={n} viewBox="0 0 48 48">
    <Rect x="10" y="14" width="28" height="24" rx="6" fill="#3b3ec6" />
    <Rect x="10" y="14" width="28" height="24" rx="6" fill="none" stroke="#2a2da8" strokeWidth="1.5" />
    <Rect x="15" y="20" width="7" height="7" rx="3.5" fill="#00e5ff" />
    <Rect x="26" y="20" width="7" height="7" rx="3.5" fill="#00e5ff" />
    <Circle cx="18.5" cy="23.5" r="2" fill="#ffffff" />
    <Circle cx="29.5" cy="23.5" r="2" fill="#ffffff" />
    <Rect x="16" y="30" width="16" height="3" rx="1.5" fill="#a5b4fc" />
    <Rect x="22" y="6" width="4" height="8" rx="2" fill="#9ca3af" />
    <Circle cx="24" cy="5" r="3" fill="#9ca3af" />
    <Rect x="2" y="18" width="8" height="14" rx="4" fill="#9ca3af" />
    <Rect x="38" y="18" width="8" height="14" rx="4" fill="#9ca3af" />
  </Svg>
);

const IcoIoT = ({ n = 32 }: { n?: number }) => (
  <Svg width={n} height={n} viewBox="0 0 48 48">
    <Path d="M6 17 Q24 6 42 17" stroke="#10b981" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <Path d="M12 26 Q24 17 36 26" stroke="#10b981" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <Path d="M18 35 Q24 29 30 35" stroke="#10b981" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <Circle cx="24" cy="41" r="4" fill="#10b981" />
    <Circle cx="24" cy="41" r="2" fill="#d1fae5" />
  </Svg>
);

const IcoLomba = ({ n = 32 }: { n?: number }) => (
  <Svg width={n} height={n} viewBox="0 0 48 48">
    <Path d="M12 6 L36 6 L33 24 Q32 32 24 32 Q16 32 15 24 Z" fill="#f59e0b" />
    <Path d="M12 6 L6 6 L6 18 Q6 24 12 24" stroke="#f59e0b" strokeWidth="4" fill="none" strokeLinecap="round" />
    <Path d="M36 6 L42 6 L42 18 Q42 24 36 24" stroke="#f59e0b" strokeWidth="4" fill="none" strokeLinecap="round" />
    <Rect x="21" y="32" width="6" height="8" fill="#d97706" />
    <Rect x="14" y="40" width="20" height="4" rx="2" fill="#d97706" />
    <Path d="M18 13 Q20 11 22 14" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <Circle cx="27" cy="16" r="2.5" fill="#fef3c7" />
  </Svg>
);

const IcoDesain = ({ n = 32 }: { n?: number }) => (
  <Svg width={n} height={n} viewBox="0 0 48 48">
    <Circle cx="24" cy="17" r="11" fill="#ef4444" />
    <Circle cx="35" cy="31" r="11" fill="#3b82f6" />
    <Circle cx="13" cy="31" r="11" fill="#22c55e" />
    <Circle cx="24" cy="17" r="11" fill="#ef4444" fillOpacity="0.85" />
    <Circle cx="35" cy="31" r="11" fill="#3b82f6" fillOpacity="0.85" />
    <Circle cx="13" cy="31" r="11" fill="#22c55e" fillOpacity="0.85" />
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

function TealCard3D({ children, style }: { children: React.ReactNode; style?: object }) {
  return (
    <View
      style={{
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
        ...style,
      }}
    >
      {children}
    </View>
  );
}

function DarkCard3D({ children, style }: { children: React.ReactNode; style?: object }) {
  return (
    <View
      style={{
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
        ...style,
      }}
    >
      {children}
    </View>
  );
}

/* ============================================================================
 * STYLES
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

  // SUMMARY — outer page bg WHITE, inner blue card
  summaryPage: {
    backgroundColor: C.white,
    fontFamily: "Helvetica",
    color: C.text,
    position: "relative",
  },
  summaryOuterContent: {
    padding: 20,
    paddingBottom: 52,
    flex: 1,
    flexDirection: "column",
  },
  summaryPageTitle: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: C.blue,
    marginBottom: 14,
  },

  // Inner BLUE card that holds everything — memanjang ke bawah
  summaryInnerCard: {
    backgroundColor: C.blue,
    borderRadius: 14,
    padding: 16,
    flex: 1,
    borderBottomWidth: 6,
    borderRightWidth: 5,
    borderBottomColor: "#1e1e6e",
    borderRightColor: "#1e1e6e",
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: "rgba(255,255,255,0.25)",
    borderLeftColor: "rgba(255,255,255,0.25)",
  },

  // Name row inside card
  summaryNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.blueDark,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: "rgba(255,255,255,0.3)",
    borderLeftColor: "rgba(255,255,255,0.3)",
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: C.blueDeep,
    borderRightColor: C.blueDeep,
  },
  summaryAvatarInitial: { fontSize: 16, fontFamily: "Helvetica-Bold", color: C.white },
  summaryName: { fontSize: 16, fontFamily: "Helvetica-Bold", color: C.white },

  // Persen + Total row
  statsRow: {
    flexDirection: "row",
    marginBottom: 12,
  },

  // Keterangan box (left) — lebih sempit
  keteranganBox: {
    width: "32%",
    backgroundColor: C.white,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomColor: C.shadow,
    borderRightColor: C.shadow,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: "rgba(255,255,255,0.9)",
    borderLeftColor: "rgba(255,255,255,0.9)",
  },
  keteranganLabel: { fontSize: 7, color: C.muted, marginBottom: 6, textAlign: "center" },
  keteranganValue: { fontSize: 30, fontFamily: "Helvetica-Bold", color: C.text, textAlign: "center" },

  // Inner persen items
  persenRow: { flexDirection: "row", gap: 6 },
  persenItem: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 7,
    padding: 8,
    alignItems: "center",
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
  persenValue: { color: C.white, fontSize: 14, fontFamily: "Helvetica-Bold" },
  persenTitle: { color: C.white, fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 6 },

  totalRow: { flexDirection: "row", gap: 6 },
  totalItem: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 7,
    padding: 8,
    alignItems: "center",
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
  totalValue: { color: C.white, fontSize: 14, fontFamily: "Helvetica-Bold" },
  totalTitle: { color: C.white, fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 6 },

  // BADGE GRID — 4 column, inside blue card so cards are white
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  badgeItem: {
    width: "23%",
    marginBottom: 6,
    marginRight: "2.67%",
    alignItems: "center",
    backgroundColor: C.white,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 4,
    borderRightWidth: 3,
    borderBottomColor: "#c7c7e8",
    borderRightColor: "#c7c7e8",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: "rgba(255,255,255,0.95)",
    borderLeftColor: "rgba(255,255,255,0.95)",
  },
  badgeLabel: {
    fontSize: 7,
    color: C.muted,
    marginBottom: 5,
    marginTop: 6,
    textAlign: "center",
    lineHeight: 1.3,
  },

  // Pill colors
  pillRed: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    color: C.white,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    minWidth: 28,
    borderBottomWidth: 2,
    borderRightWidth: 1,
    borderBottomColor: "#b91c1c",
    borderRightColor: "#b91c1c",
  },
  pillOrange: {
    backgroundColor: C.orange,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    color: C.white,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    minWidth: 28,
    borderBottomWidth: 2,
    borderRightWidth: 1,
    borderBottomColor: C.orangeDrk,
    borderRightColor: C.orangeDrk,
  },
  pillPurple: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    color: C.white,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    minWidth: 28,
    borderBottomWidth: 2,
    borderRightWidth: 1,
    borderBottomColor: "#5b21b6",
    borderRightColor: "#5b21b6",
  },
  pillBlue: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    color: C.white,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    minWidth: 28,
    borderBottomWidth: 2,
    borderRightWidth: 1,
    borderBottomColor: "#1d4ed8",
    borderRightColor: "#1d4ed8",
  },
  pillPink: {
    backgroundColor: C.pink,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    color: C.white,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    minWidth: 28,
    borderBottomWidth: 2,
    borderRightWidth: 1,
    borderBottomColor: C.pinkDark,
    borderRightColor: C.pinkDark,
  },
  pillBlueIndigo: {
    backgroundColor: C.blue,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    color: C.white,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    minWidth: 28,
    borderBottomWidth: 2,
    borderRightWidth: 1,
    borderBottomColor: C.blueDark,
    borderRightColor: C.blueDark,
  },
  pillGreen: {
    backgroundColor: "#10b981",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    color: C.white,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    minWidth: 28,
    borderBottomWidth: 2,
    borderRightWidth: 1,
    borderBottomColor: "#047857",
    borderRightColor: "#047857",
  },
  pillGray: {
    backgroundColor: "#9ca3af",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    color: C.white,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    minWidth: 28,
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

  screenshotBox: {
    width: "100%",
    height: 320,
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

/* ============================================================================
 * SUMMARY PAGE — layout sesuai referensi gambar
 * ========================================================================== */
function SummaryPage({ summary }: { summary: ProjectSummary }) {
  type PillKey = "red" | "orange" | "purple" | "blue" | "pink" | "indigoBlue" | "green" | "gray";

  const badges: {
    label: string;
    value: number;
    pill: PillKey;
    Icon: (p: { n?: number }) => JSX.Element;
  }[] = [
    { label: "Youtube",       value: summary.ityt,     pill: "red",       Icon: IcoVideo    },
    { label: "Certificates",  value: summary.itc,      pill: "orange",    Icon: IcoCert     },
    { label: "Game",          value: summary.itg ?? 0, pill: "purple",    Icon: IcoGame     },
    { label: "Website",       value: summary.itw ?? 0, pill: "blue",      Icon: IcoWebsite  },
    { label: "IDN Mengajar",  value: summary.itm,      pill: "indigoBlue",Icon: IcoMengajar },
    { label: "Karya Buku",    value: summary.itb,      pill: "pink",      Icon: IcoBuku     },
    { label: "Robotic",       value: summary.itr,      pill: "indigoBlue",Icon: IcoRobot    },
    { label: "IoT",           value: summary.iti ?? 0, pill: "green",     Icon: IcoIoT      },
    { label: "Competitions",  value: summary.itl,      pill: "gray",      Icon: IcoLomba    },
    { label: "Desain Grafis", value: summary.itd,      pill: "orange",    Icon: IcoDesain   },
  ];

  const pillStyle = (p: PillKey) => {
    const map: Record<PillKey, object> = {
      red:       s.pillRed,
      orange:    s.pillOrange,
      purple:    s.pillPurple,
      blue:      s.pillBlue,
      pink:      s.pillPink,
      indigoBlue:s.pillBlueIndigo,
      green:     s.pillGreen,
      gray:      s.pillGray,
    };
    return map[p];
  };

  // Hitung persentase: jika belum = 0 maka tercapai = 100%
  const totalProject = summary.itsl + summary.itbl;
  const pctTercapai = totalProject > 0
    ? (summary.itbl === 0 ? 100 : Math.round((summary.itsl / totalProject) * 100))
    : 0;
  const pctBelum = 100 - pctTercapai;

  // Keterangan tuntas: jika itbl = 0 hanya tampil "Tuntas" tanpa angka
  const isSemua = summary.itbl === 0;

  return (
    <Page size="A4" style={s.summaryPage}>
      <View style={s.summaryOuterContent}>
        {/* Page title — biru karena background halaman putih */}
        <Text style={s.summaryPageTitle}>Summary IT</Text>

        {/* Main BLUE inner card */}
        <View style={s.summaryInnerCard}>

          {/* Name row */}
          <View style={s.summaryNameRow}>
            <View style={s.summaryAvatar}>
              <Text style={s.summaryAvatarInitial}>{getInitials(summary.nama)}</Text>
            </View>
            <Text style={s.summaryName}>{summary.nama}</Text>
          </View>

          {/* Stats row: Keterangan (kiri) | Persen + Total menumpuk vertikal (kanan) */}
          <View style={s.statsRow}>
            {/* Keterangan — lebih tinggi karena Persen+Total dua baris */}
            <View style={[s.keteranganBox, { alignSelf: "stretch" }]}>
              <Text style={s.keteranganLabel}>Keterangan Project :</Text>
              {isSemua ? (
                <Text style={{ fontSize: 26, fontFamily: "Helvetica-Bold", color: C.text, textAlign: "center" }}>
                  Tuntas
                </Text>
              ) : (
                <>
                  <Text style={s.keteranganValue}>{summary.ittuntas}</Text>
                  <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", color: C.text, textAlign: "center" }}>
                    Tuntas
                  </Text>
                </>
              )}
            </View>

            {/* Persen + Total menumpuk vertikal */}
            <View style={{ flex: 1, flexDirection: "column" }}>
              {/* Persen teal card */}
              <TealCard3D style={{ marginBottom: 8 }}>
                <Text style={s.persenTitle}>Persen</Text>
                <View style={s.persenRow}>
                  <View style={s.persenItem}>
                    <Text style={s.persenLabel}>Tercapai</Text>
                    <Text style={s.persenValue}>{pctTercapai}%</Text>
                  </View>
                  <View style={s.persenItem}>
                    <Text style={s.persenLabel}>Belum</Text>
                    <Text style={s.persenValue}>{pctBelum}%</Text>
                  </View>
                </View>
              </TealCard3D>

              {/* Total dark card */}
              <DarkCard3D style={{}}>
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
              </DarkCard3D>
            </View>
          </View>

          {/* Badge grid — card abu muda flex:1, badge 3D putih memenuhi per baris */}
          <View style={{
            backgroundColor: "#eef0f8",
            borderRadius: 12,
            padding: 6,
            marginTop: 10,
            flex: 1,
            borderBottomWidth: 4,
            borderRightWidth: 3,
            borderBottomColor: "#c7c7e8",
            borderRightColor: "#c7c7e8",
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderTopColor: "rgba(255,255,255,0.95)",
            borderLeftColor: "rgba(255,255,255,0.95)",
          }}>
            {/* Baris 1: 4 badge */}
            <View style={{ flexDirection: "row", marginBottom: 6 }}>
              {badges.slice(0, 4).map((b, i) => (
                <View key={i} style={{
                  flex: 1,
                  alignItems: "center",
                  backgroundColor: C.white,
                  borderRadius: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 2,
                  marginRight: i < 3 ? 6 : 0,
                  borderBottomWidth: 4,
                  borderRightWidth: 3,
                  borderBottomColor: "#d0d0e8",
                  borderRightColor: "#d0d0e8",
                  borderTopWidth: 1,
                  borderLeftWidth: 1,
                  borderTopColor: C.white,
                  borderLeftColor: C.white,
                }}>
                  <b.Icon n={28} />
                  <Text style={s.badgeLabel}>{b.label}</Text>
                  <Text style={pillStyle(b.pill)}>{b.value}</Text>
                </View>
              ))}
            </View>
            {/* Baris 2: 4 badge */}
            <View style={{ flexDirection: "row", marginBottom: 6 }}>
              {badges.slice(4, 8).map((b, i) => (
                <View key={i} style={{
                  flex: 1,
                  alignItems: "center",
                  backgroundColor: C.white,
                  borderRadius: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 2,
                  marginRight: i < 3 ? 6 : 0,
                  borderBottomWidth: 4,
                  borderRightWidth: 3,
                  borderBottomColor: "#d0d0e8",
                  borderRightColor: "#d0d0e8",
                  borderTopWidth: 1,
                  borderLeftWidth: 1,
                  borderTopColor: C.white,
                  borderLeftColor: C.white,
                }}>
                  <b.Icon n={28} />
                  <Text style={s.badgeLabel}>{b.label}</Text>
                  <Text style={pillStyle(b.pill)}>{b.value}</Text>
                </View>
              ))}
            </View>
            {/* Baris 3: 2 badge + spacer */}
            <View style={{ flexDirection: "row" }}>
              {badges.slice(8, 10).map((b, i) => (
                <View key={i} style={{
                  flex: 1,
                  alignItems: "center",
                  backgroundColor: C.white,
                  borderRadius: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 2,
                  marginRight: i < 1 ? 6 : 0,
                  borderBottomWidth: 4,
                  borderRightWidth: 3,
                  borderBottomColor: "#d0d0e8",
                  borderRightColor: "#d0d0e8",
                  borderTopWidth: 1,
                  borderLeftWidth: 1,
                  borderTopColor: C.white,
                  borderLeftColor: C.white,
                }}>
                  <b.Icon n={28} />
                  <Text style={s.badgeLabel}>{b.label}</Text>
                  <Text style={pillStyle(b.pill)}>{b.value}</Text>
                </View>
              ))}
              {/* Spacer 2 kolom kosong agar baris 3 rata kiri */}
              <View style={{ flex: 2, marginLeft: 6 }} />
            </View>
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
