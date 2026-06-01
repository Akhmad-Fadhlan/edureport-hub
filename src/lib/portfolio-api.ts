import { api, apiDelete } from "./api";

const BASE = "https://rapor.codestechno.com/api";

// ── TYPES ────────────────────────────────────────────────────────────────────

export interface StudentSummary {
  id: number;
  student_id: number;
  semester_id: number;
  tuntas: number;
  persentase: number;
  total_tercapai: number;
  belum_tercapai: number;
  selesai: number;
  belum_selesai: number;
  total_desain: number;
  total_robotik: number;
  total_video_youtube: number;
  total_sertifikat: number;
  total_mengajar: number;
  total_buku: number;
  total_lomba_it: number;
}

export interface TeachingActivity {
  id: number;
  student_id: number;
  semester_id: number;
  foto_mengajar_1?: string;
  foto_mengajar_2?: string;
  link_foto_1?: string;
  link_foto_2?: string;
  lokasi?: string;
  tanggal?: string;
  tema?: string;
  jumlah_peserta?: number;
  cerita_siswa?: string;
  testimoni_peserta?: string;
}

export interface DesignProject {
  id: number;
  student_id: number;
  semester_id: number;
  judul: string;
  link_file_flyer?: string;
  gambar_proyek?: string;
  link_gambar_drive?: string;
  deskripsi?: string;
  teknologi?: string;
  kompetensi_siswa?: string;
}

export interface RoboticsProject {
  id: number;
  student_id: number;
  semester_id: number;
  judul: string;
  link_file_flyer?: string;
  gambar_proyek?: string;
  link_gambar_drive?: string;
  deskripsi?: string;
  teknologi?: string;
  kompetensi_siswa?: string;
}

export interface YoutubeVideo {
  id: number;
  student_id: number;
  semester_id: number;
  judul_video: string;
  deskripsi_video?: string;
  link_youtube: string;
}

export interface Certificate {
  id: number;
  student_id: number;
  semester_id: number;
  gambar_sertifikat?: string;
  link_gambar_drive?: string;
  lingkup?: string;
  tanggal?: string;
  tema?: string;
}

export interface FullPortfolio {
  summary: StudentSummary;
  teaching_activities: TeachingActivity[];
  design_projects: DesignProject[];
  robotics_projects: RoboticsProject[];
  youtube_videos: YoutubeVideo[];
  certificates: Certificate[];
}

// ── PLATFORM VIDEO HELPERS ────────────────────────────────────────────────────

export type VideoPlatform =
  | "youtube"
  | "youtube_shorts"
  | "tiktok"
  | "linkedin"
  | "unknown";

export interface VideoMeta {
  platform: VideoPlatform;
  videoId: string;
  thumbnailUrl: string;
  embedUrl: string;
  platformLabel: string;
  platformColor: string;
  originalLink: string;
}

/**
 * Deteksi platform dari URL video.
 */
export function detectVideoPlatform(link: string): VideoPlatform {
  try {
    const url = new URL(link);
    const host = url.hostname.replace("www.", "");

    if (host.includes("youtu.be") || host.includes("youtube.com")) {
      if (url.pathname.startsWith("/shorts/")) return "youtube_shorts";
      return "youtube";
    }
    if (host.includes("tiktok.com")) return "tiktok";
    if (host.includes("linkedin.com")) return "linkedin";
  } catch {
    // ignore invalid URLs
  }
  return "unknown";
}

/**
 * Ekstrak video ID dari URL berdasarkan platform.
 */
export function extractVideoId(link: string, platform: VideoPlatform): string {
  try {
    const url = new URL(link);
    switch (platform) {
      case "youtube": {
        if (url.hostname.includes("youtu.be")) {
          return url.pathname.slice(1).split("?")[0];
        }
        return url.searchParams.get("v") ?? "";
      }
      case "youtube_shorts": {
        // URL: youtube.com/shorts/VIDEO_ID
        return url.pathname.split("/shorts/")[1]?.split("/")[0] ?? "";
      }
      case "tiktok": {
        // URL: tiktok.com/@user/video/1234567890
        const m = url.pathname.match(/\/video\/(\d+)/);
        return m?.[1] ?? "";
      }
      case "linkedin": {
        // LinkedIn tidak punya short video ID di URL publik, gunakan path sebagai identifier
        return url.pathname;
      }
      default:
        return "";
    }
  } catch {
    return "";
  }
}

/**
 * Dapatkan semua metadata video (platform, thumbnail, embed URL, dll.)
 * dari sebuah link video apapun platformnya.
 */
export function getVideoMeta(link: string): VideoMeta {
  const platform = detectVideoPlatform(link);
  const videoId = extractVideoId(link, platform);

  switch (platform) {
    case "youtube":
      return {
        platform,
        videoId,
        thumbnailUrl: videoId
          ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          : "",
        embedUrl: videoId
          ? `https://www.youtube.com/embed/${videoId}`
          : "",
        platformLabel: "YouTube",
        platformColor: "#FF0000",
        originalLink: link,
      };

    case "youtube_shorts":
      return {
        platform,
        videoId,
        // Shorts menggunakan thumbnail API yang sama dengan YouTube biasa
        thumbnailUrl: videoId
          ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          : "",
        embedUrl: videoId
          ? `https://www.youtube.com/embed/${videoId}`
          : "",
        platformLabel: "YouTube Shorts",
        platformColor: "#FF0000",
        originalLink: link,
      };

    case "tiktok":
      return {
        platform,
        videoId,
        // TikTok thumbnail diambil via oEmbed (no API key needed untuk video publik)
        // Resolver dilakukan di VideoThumbnail component secara async
        thumbnailUrl: `https://www.tiktok.com/oembed?url=${encodeURIComponent(link)}`,
        embedUrl: link,
        platformLabel: "TikTok",
        platformColor: "#010101",
        originalLink: link,
      };

    case "linkedin":
      return {
        platform,
        videoId,
        // LinkedIn tidak mengizinkan embed thumbnail publik tanpa auth
        thumbnailUrl: "",
        embedUrl: link,
        platformLabel: "LinkedIn",
        platformColor: "#0A66C2",
        originalLink: link,
      };

    default:
      return {
        platform: "unknown",
        videoId: "",
        thumbnailUrl: "",
        embedUrl: link,
        platformLabel: "Video",
        platformColor: "#6B7280",
        originalLink: link,
      };
  }
}

/**
 * Validasi apakah sebuah link adalah URL video yang didukung.
 */
export function isValidVideoLink(link: string): boolean {
  if (!link) return false;
  try {
    new URL(link);
    const platform = detectVideoPlatform(link);
    return platform !== "unknown";
  } catch {
    return false;
  }
}

/**
 * @deprecated Gunakan getVideoMeta(link).thumbnailUrl
 * Dipertahankan untuk backward compatibility.
 */
export function getYoutubeEmbedUrl(link: string): string {
  const meta = getVideoMeta(link);
  // Untuk YouTube & Shorts, langsung kembalikan thumbnail URL
  if (meta.platform === "youtube" || meta.platform === "youtube_shorts") {
    return meta.thumbnailUrl;
  }
  return meta.thumbnailUrl;
}

/**
 * @deprecated Gunakan extractVideoId(link, detectVideoPlatform(link))
 * Dipertahankan untuk backward compatibility.
 */
export function getYoutubeVideoId(link: string): string {
  const platform = detectVideoPlatform(link);
  return extractVideoId(link, platform);
}

// ── CSV HELPERS ───────────────────────────────────────────────────────────────

function csvCell(v: string | number | null | undefined): string {
  const s = String(v ?? "");
  if (
    s.includes(",") ||
    s.includes('"') ||
    s.includes("\n") ||
    s.includes("\r")
  ) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsv(rows: (string | number | null | undefined)[][]): string {
  return rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQ = false;
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        inQ = true;
      } else if (ch === ",") {
        cells.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
  }
  cells.push(cur);
  return cells;
}

function parseCsvText(text: string): string[][] {
  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n");
  return lines.filter((l) => l.trim()).map(parseCsvLine);
}

function downloadCsv(
  rows: (string | number | null | undefined)[][],
  filename: string
) {
  const bom = "\uFEFF";
  const blob = new Blob([bom + toCsv(rows)], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── CSV IMPORT TYPES ─────────────────────────────────────────────────────────

export type CsvImportStatus = "ok" | "error" | "warning";

export interface CsvImportRow<T> {
  row: number;
  data: T;
  status: CsvImportStatus;
  message?: string;
}

// ── TEACHING ACTIVITY CSV ────────────────────────────────────────────────────

export function downloadTeachingTemplate() {
  downloadCsv(
    [
      ["TEMPLATE IMPORT KEGIATAN MENGAJAR"],
      [
        "Kolom foto tidak bisa diisi via CSV. Upload foto manual setelah import.",
      ],
      [],
      [
        "lokasi",
        "tanggal",
        "tema",
        "jumlah_peserta",
        "cerita_siswa",
        "testimoni_peserta",
        "link_foto_1",
        "link_foto_2",
      ],
      [
        "Contoh Lokasi",
        "2025-01-15",
        "Belajar Coding",
        "30",
        "Cerita siswa...",
        "Testimoni...",
        "https://drive.google.com/...",
        "",
      ],
    ],
    "template_kegiatan_mengajar.csv"
  );
}

export function parseTeachingCsv(
  file: File,
  callback: (rows: CsvImportRow<Partial<TeachingActivity>>[]) => void
) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const raw = e.target?.result;
    if (typeof raw !== "string") {
      callback([]);
      return;
    }
    const allRows = parseCsvText(raw);
    const headerIdx = allRows.findIndex((r) =>
      r.some((c) => c.trim().toLowerCase() === "lokasi")
    );
    if (headerIdx === -1) {
      callback([]);
      return;
    }
    const header = allRows[headerIdx].map((c) => c.trim().toLowerCase());
    const results: CsvImportRow<Partial<TeachingActivity>>[] = [];

    for (let i = headerIdx + 1; i < allRows.length; i++) {
      const cols = allRows[i];
      if (cols.every((c) => !c.trim())) continue;
      const get = (key: string) => cols[header.indexOf(key)]?.trim() ?? "";

      const data: Partial<TeachingActivity> = {
        lokasi: get("lokasi") || undefined,
        tanggal: get("tanggal") || undefined,
        tema: get("tema") || undefined,
        jumlah_peserta: get("jumlah_peserta")
          ? Number(get("jumlah_peserta"))
          : undefined,
        cerita_siswa: get("cerita_siswa") || undefined,
        testimoni_peserta: get("testimoni_peserta") || undefined,
        link_foto_1: get("link_foto_1") || undefined,
        link_foto_2: get("link_foto_2") || undefined,
      };

      const missing: string[] = [];
      if (!data.tema) missing.push("tema");
      results.push({
        row: i + 1,
        data,
        status: missing.length ? "warning" : "ok",
        message: missing.length
          ? `Kolom kosong: ${missing.join(", ")}`
          : undefined,
      });
    }
    callback(results);
  };
  reader.readAsText(file, "utf-8");
}

export async function importTeachingActivities(
  rows: CsvImportRow<Partial<TeachingActivity>>[],
  studentId: number,
  semesterId: number
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;
  for (const row of rows) {
    if (row.status === "error") {
      failed++;
      continue;
    }
    try {
      const fd = new FormData();
      fd.append("student_id", String(studentId));
      fd.append("semester_id", String(semesterId));
      const d = row.data;
      if (d.lokasi) fd.append("lokasi", d.lokasi);
      if (d.tanggal) fd.append("tanggal", d.tanggal);
      if (d.tema) fd.append("tema", d.tema);
      if (d.jumlah_peserta)
        fd.append("jumlah_peserta", String(d.jumlah_peserta));
      if (d.cerita_siswa) fd.append("cerita_siswa", d.cerita_siswa);
      if (d.testimoni_peserta)
        fd.append("testimoni_peserta", d.testimoni_peserta);
      if (d.link_foto_1) fd.append("link_foto_1", d.link_foto_1);
      if (d.link_foto_2) fd.append("link_foto_2", d.link_foto_2);
      await api.post("/teaching-activities", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      success++;
    } catch {
      failed++;
    }
  }
  return { success, failed };
}

// ── DESIGN / ROBOTICS CSV ────────────────────────────────────────────────────

export function downloadProjectTemplate(type: "design" | "robotics") {
  const label = type === "design" ? "Desain" : "Robotik";
  downloadCsv(
    [
      [`TEMPLATE IMPORT KARYA ${label.toUpperCase()}`],
      [],
      [
        "judul",
        "deskripsi",
        "teknologi",
        "kompetensi_siswa",
        "link_file_flyer",
        "link_gambar_drive",
      ],
      [
        "Contoh Judul",
        "Deskripsi proyek...",
        "Canva / Arduino",
        "Kompetensi...",
        "https://drive.google.com/...",
        "https://drive.google.com/...",
      ],
    ],
    `template_karya_${type}.csv`
  );
}

export function parseProjectCsv(
  file: File,
  callback: (
    rows: CsvImportRow<Partial<DesignProject | RoboticsProject>>[]
  ) => void
) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const raw = e.target?.result;
    if (typeof raw !== "string") {
      callback([]);
      return;
    }
    const allRows = parseCsvText(raw);
    const headerIdx = allRows.findIndex((r) =>
      r.some((c) => c.trim().toLowerCase() === "judul")
    );
    if (headerIdx === -1) {
      callback([]);
      return;
    }
    const header = allRows[headerIdx].map((c) => c.trim().toLowerCase());
    const results: CsvImportRow<Partial<DesignProject | RoboticsProject>>[] =
      [];

    for (let i = headerIdx + 1; i < allRows.length; i++) {
      const cols = allRows[i];
      if (cols.every((c) => !c.trim())) continue;
      const get = (key: string) => cols[header.indexOf(key)]?.trim() ?? "";

      const data: Partial<DesignProject | RoboticsProject> = {
        judul: get("judul"),
        deskripsi: get("deskripsi") || undefined,
        teknologi: get("teknologi") || undefined,
        kompetensi_siswa: get("kompetensi_siswa") || undefined,
        link_file_flyer: get("link_file_flyer") || undefined,
        link_gambar_drive: get("link_gambar_drive") || undefined,
      };

      results.push({
        row: i + 1,
        data,
        status: data.judul ? "ok" : "error",
        message: data.judul ? undefined : "Judul wajib diisi",
      });
    }
    callback(results);
  };
  reader.readAsText(file, "utf-8");
}

export async function importProjects(
  rows: CsvImportRow<Partial<DesignProject | RoboticsProject>>[],
  type: "design" | "robotics",
  studentId: number,
  semesterId: number
): Promise<{ success: number; failed: number }> {
  const endpoint =
    type === "design" ? "/design-projects" : "/robotics-projects";
  let success = 0;
  let failed = 0;
  for (const row of rows) {
    if (row.status === "error") {
      failed++;
      continue;
    }
    try {
      await api.post(endpoint, {
        student_id: studentId,
        semester_id: semesterId,
        ...row.data,
      });
      success++;
    } catch {
      failed++;
    }
  }
  return { success, failed };
}

// ── YOUTUBE / VIDEO CSV ───────────────────────────────────────────────────────

export function downloadYoutubeTemplate() {
  downloadCsv(
    [
      ["TEMPLATE IMPORT VIDEO (YouTube / YouTube Shorts / TikTok / LinkedIn)"],
      [
        "Kolom link_video mendukung: YouTube, YouTube Shorts, TikTok, LinkedIn",
      ],
      [],
      ["judul_video", "link_video", "deskripsi_video"],
      [
        "Tutorial Coding Dasar",
        "https://youtube.com/watch?v=xxx",
        "Deskripsi...",
      ],
      [
        "Tutorial Shorts",
        "https://youtube.com/shorts/xxx",
        "Deskripsi...",
      ],
      [
        "Video TikTok",
        "https://www.tiktok.com/@user/video/xxx",
        "Deskripsi...",
      ],
      [
        "Post LinkedIn",
        "https://www.linkedin.com/posts/xxx",
        "Deskripsi...",
      ],
    ],
    "template_video.csv"
  );
}

export function parseYoutubeCsv(
  file: File,
  callback: (rows: CsvImportRow<Partial<YoutubeVideo>>[]) => void
) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const raw = e.target?.result;
    if (typeof raw !== "string") {
      callback([]);
      return;
    }
    const allRows = parseCsvText(raw);
    // Cari header row: bisa "judul_video" atau "judul"
    const headerIdx = allRows.findIndex((r) =>
      r.some(
        (c) =>
          c.trim().toLowerCase() === "judul_video" ||
          c.trim().toLowerCase() === "judul"
      )
    );
    if (headerIdx === -1) {
      callback([]);
      return;
    }
    const header = allRows[headerIdx].map((c) => c.trim().toLowerCase());
    const results: CsvImportRow<Partial<YoutubeVideo>>[] = [];

    for (let i = headerIdx + 1; i < allRows.length; i++) {
      const cols = allRows[i];
      if (cols.every((c) => !c.trim())) continue;
      const get = (key: string) => cols[header.indexOf(key)]?.trim() ?? "";

      // Support both "link_video" (new) and "link_youtube" (legacy) column names
      const linkValue = get("link_video") || get("link_youtube");

      const data: Partial<YoutubeVideo> = {
        judul_video: get("judul_video") || get("judul"),
        link_youtube: linkValue,
        deskripsi_video: get("deskripsi_video") || get("deskripsi") || undefined,
      };

      const missing: string[] = [];
      if (!data.judul_video) missing.push("judul_video");
      if (!data.link_youtube) missing.push("link_video");

      // Validasi platform
      let platformWarning = "";
      if (data.link_youtube && !isValidVideoLink(data.link_youtube)) {
        platformWarning =
          "Link tidak dikenali sebagai YouTube/TikTok/LinkedIn";
      }

      const hasError = missing.length > 0;
      const hasWarning = !!platformWarning;

      results.push({
        row: i + 1,
        data,
        status: hasError ? "error" : hasWarning ? "warning" : "ok",
        message: hasError
          ? `Wajib diisi: ${missing.join(", ")}`
          : hasWarning
          ? platformWarning
          : undefined,
      });
    }
    callback(results);
  };
  reader.readAsText(file, "utf-8");
}

export async function importYoutubeVideos(
  rows: CsvImportRow<Partial<YoutubeVideo>>[],
  studentId: number,
  semesterId: number
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;
  for (const row of rows) {
    if (row.status === "error") {
      failed++;
      continue;
    }
    try {
      await api.post("/youtube-videos", {
        student_id: studentId,
        semester_id: semesterId,
        ...row.data,
      });
      success++;
    } catch {
      failed++;
    }
  }
  return { success, failed };
}

// ── CERTIFICATE CSV ──────────────────────────────────────────────────────────

export function downloadCertificateTemplate() {
  downloadCsv(
    [
      ["TEMPLATE IMPORT SERTIFIKAT"],
      [
        "Kolom gambar tidak bisa diisi via CSV. Upload gambar manual atau gunakan link_gambar_drive.",
      ],
      [],
      ["tema", "lingkup", "tanggal", "link_gambar_drive"],
      [
        "Juara 1 Coding",
        "Nasional",
        "2025-03-10",
        "https://drive.google.com/...",
      ],
    ],
    "template_sertifikat.csv"
  );
}

export function parseCertificateCsv(
  file: File,
  callback: (rows: CsvImportRow<Partial<Certificate>>[]) => void
) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const raw = e.target?.result;
    if (typeof raw !== "string") {
      callback([]);
      return;
    }
    const allRows = parseCsvText(raw);
    const headerIdx = allRows.findIndex((r) =>
      r.some((c) => c.trim().toLowerCase() === "tema")
    );
    if (headerIdx === -1) {
      callback([]);
      return;
    }
    const header = allRows[headerIdx].map((c) => c.trim().toLowerCase());
    const results: CsvImportRow<Partial<Certificate>>[] = [];

    for (let i = headerIdx + 1; i < allRows.length; i++) {
      const cols = allRows[i];
      if (cols.every((c) => !c.trim())) continue;
      const get = (key: string) => cols[header.indexOf(key)]?.trim() ?? "";

      const data: Partial<Certificate> = {
        tema: get("tema") || undefined,
        lingkup: get("lingkup") || undefined,
        tanggal: get("tanggal") || undefined,
        link_gambar_drive: get("link_gambar_drive") || undefined,
      };

      results.push({
        row: i + 1,
        data,
        status: "ok",
      });
    }
    callback(results);
  };
  reader.readAsText(file, "utf-8");
}

export async function importCertificates(
  rows: CsvImportRow<Partial<Certificate>>[],
  studentId: number,
  semesterId: number
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;
  for (const row of rows) {
    if (row.status === "error") {
      failed++;
      continue;
    }
    try {
      const fd = new FormData();
      fd.append("student_id", String(studentId));
      fd.append("semester_id", String(semesterId));
      const d = row.data;
      if (d.tema) fd.append("tema", d.tema);
      if (d.lingkup) fd.append("lingkup", d.lingkup);
      if (d.tanggal) fd.append("tanggal", d.tanggal);
      if (d.link_gambar_drive)
        fd.append("link_gambar_drive", d.link_gambar_drive);
      await api.post("/certificates", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      success++;
    } catch {
      failed++;
    }
  }
  return { success, failed };
}

// ── STUDENT SUMMARY ──────────────────────────────────────────────────────────

export async function getStudentSummary(
  student_id: number,
  semester_id: number
): Promise<StudentSummary | null> {
  try {
    const res = await api.get("/student-summary", {
      params: { student_id, semester_id },
    });
    return res.data?.data ?? null;
  } catch {
    return null;
  }
}

export async function upsertStudentSummary(
  data: Partial<StudentSummary>
): Promise<void> {
  await api.post("/student-summary", data);
}

// ── TEACHING ACTIVITIES ──────────────────────────────────────────────────────

export async function getTeachingActivities(
  student_id: number,
  semester_id: number
): Promise<TeachingActivity[]> {
  const res = await api.get("/teaching-activities", {
    params: { student_id, semester_id },
  });
  return res.data?.data ?? [];
}

export async function createTeachingActivity(
  formData: FormData
): Promise<void> {
  await api.post("/teaching-activities", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function updateTeachingActivity(
  id: number,
  formData: FormData
): Promise<void> {
  await api.put(`/teaching-activities/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function deleteTeachingActivity(id: number): Promise<void> {
  await apiDelete(`/teaching-activities/${id}`);
}

// ── DESIGN PROJECTS ──────────────────────────────────────────────────────────

export async function getDesignProjects(
  student_id: number,
  semester_id: number
): Promise<DesignProject[]> {
  const res = await api.get("/design-projects", {
    params: { student_id, semester_id },
  });
  return res.data?.data ?? [];
}

export async function createDesignProject(
  data: Partial<DesignProject> | FormData
): Promise<void> {
  if (data instanceof FormData) {
    await api.post("/design-projects", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } else {
    await api.post("/design-projects", data);
  }
}

export async function updateDesignProject(
  id: number,
  data: Partial<DesignProject> | FormData
): Promise<void> {
  if (data instanceof FormData) {
    await api.put(`/design-projects/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } else {
    await api.put(`/design-projects/${id}`, data);
  }
}

export async function deleteDesignProject(id: number): Promise<void> {
  await apiDelete(`/design-projects/${id}`);
}

// ── ROBOTICS PROJECTS ────────────────────────────────────────────────────────

export async function getRoboticsProjects(
  student_id: number,
  semester_id: number
): Promise<RoboticsProject[]> {
  const res = await api.get("/robotics-projects", {
    params: { student_id, semester_id },
  });
  return res.data?.data ?? [];
}

export async function createRoboticsProject(
  data: Partial<RoboticsProject> | FormData
): Promise<void> {
  if (data instanceof FormData) {
    await api.post("/robotics-projects", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } else {
    await api.post("/robotics-projects", data);
  }
}

export async function updateRoboticsProject(
  id: number,
  data: Partial<RoboticsProject> | FormData
): Promise<void> {
  if (data instanceof FormData) {
    await api.put(`/robotics-projects/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } else {
    await api.put(`/robotics-projects/${id}`, data);
  }
}

export async function deleteRoboticsProject(id: number): Promise<void> {
  await apiDelete(`/robotics-projects/${id}`);
}

// ── YOUTUBE VIDEOS ───────────────────────────────────────────────────────────

export async function getYoutubeVideos(
  student_id: number,
  semester_id: number
): Promise<YoutubeVideo[]> {
  const res = await api.get("/youtube-videos", {
    params: { student_id, semester_id },
  });
  return res.data?.data ?? [];
}

export async function createYoutubeVideo(
  data: Partial<YoutubeVideo>
): Promise<void> {
  await api.post("/youtube-videos", data);
}

export async function updateYoutubeVideo(
  id: number,
  data: Partial<YoutubeVideo>
): Promise<void> {
  await api.put(`/youtube-videos/${id}`, data);
}

export async function deleteYoutubeVideo(id: number): Promise<void> {
  await apiDelete(`/youtube-videos/${id}`);
}

// ── CERTIFICATES ─────────────────────────────────────────────────────────────

export async function getCertificates(
  student_id: number,
  semester_id: number
): Promise<Certificate[]> {
  const res = await api.get("/certificates", {
    params: { student_id, semester_id },
  });
  return res.data?.data ?? [];
}

export async function createCertificate(formData: FormData): Promise<void> {
  await api.post("/certificates", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function updateCertificate(
  id: number,
  formData: FormData
): Promise<void> {
  await api.put(`/certificates/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function deleteCertificate(id: number): Promise<void> {
  await apiDelete(`/certificates/${id}`);
}

// ── FULL PORTFOLIO ───────────────────────────────────────────────────────────

export async function getFullPortfolio(
  student_id: number,
  semester_id: number
): Promise<FullPortfolio | null> {
  try {
    const res = await api.get(`/students/${student_id}/portfolio`, {
      params: { semester_id },
    });
    return res.data?.data ?? null;
  } catch {
    return null;
  }
}

// ── IMAGE / DRIVE HELPERS ─────────────────────────────────────────────────────

export const UPLOADS_BASE_URL = "https://rapor.codestechno.com/upload";

export function resolveUploadUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${UPLOADS_BASE_URL}/${path}`;
}

/**
 * Ekstrak Google Drive file ID dari berbagai format URL.
 */
export function extractDriveFileId(url: string): string | null {
  if (!url) return null;
  const m1 = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  if (m1) return m1[1];
  const m2 = url.match(/[?&]id=([^&]+)/);
  if (m2) return m2[1];
  return null;
}

/**
 * Konversi link Google Drive ke URL thumbnail yang dapat di-embed langsung
 * di tag <img> tanpa CORS issue.
 */
export function driveToThumbnailUrl(link: string): string {
  const fileId = extractDriveFileId(link);
  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`;
  }
  return link;
}

/** Resolve either an uploaded file path or a Google Drive link to a displayable URL */
export function resolveImageUrl(
  filePath?: string | null,
  driveLink?: string | null
): string | null {
  if (filePath) return resolveUploadUrl(filePath);
  if (driveLink) return driveToThumbnailUrl(driveLink);
  return null;
}

/** Convert a Google Drive share link to a direct image URL if possible */
export function normalizeDriveLink(link: string): string {
  const fileId = extractDriveFileId(link);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/view`;
  }
  return link;
}

/* ============================================================================
 * UNIFIED CSV IMPORT
 * ========================================================================== */

export type UnifiedCsvRowType =
  | "teaching"
  | "design"
  | "robotics"
  | "youtube"
  | "certificate";

export interface UnifiedCsvRow {
  rowNumber: number;
  type: UnifiedCsvRowType;
  status: "ok" | "warning" | "error";
  message?: string;
  data: Record<string, string>;
}

export interface CsvImportResult {
  teaching: { success: number; failed: number };
  design: { success: number; failed: number };
  robotics: { success: number; failed: number };
  youtube: { success: number; failed: number };
  certificate: { success: number; failed: number };
  total: { success: number; failed: number };
}

const UNIFIED_TEMPLATE_HEADERS = [
  "type",
  // teaching
  "tema",
  "lokasi",
  "tanggal",
  "dokumentasi",
  // design / robotics
  "judul",
  "teknologi",
  "deskripsi",
  "link_project",
  "gambar",
  // youtube / video (support multi-platform)
  "judul_video",
  "link_video",
  "deskripsi_video",
  // certificate
  "lingkup",
  "penyelenggara",
  "tahun",
  "sertifikat",
];

export function downloadUnifiedTemplate(): void {
  const csv = UNIFIED_TEMPLATE_HEADERS.join(",") + "\n";
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "template-portofolio-lengkap.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function parseUnifiedCsv(
  file: File,
  callback: (rows: UnifiedCsvRow[]) => void
): void {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result as string;
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) {
      callback([]);
      return;
    }
    const headers = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
    const rows: UnifiedCsvRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]).map((v) => v.trim());
      const data: Record<string, string> = {};
      headers.forEach((h, idx) => {
        data[h] = values[idx] ?? "";
      });

      const type = data["type"]?.toLowerCase() as UnifiedCsvRowType;
      const validTypes: UnifiedCsvRowType[] = [
        "teaching",
        "design",
        "robotics",
        "youtube",
        "certificate",
      ];

      if (!validTypes.includes(type)) {
        rows.push({
          rowNumber: i + 1,
          type: "teaching",
          status: "error",
          message: `Tipe tidak dikenali: "${data["type"]}"`,
          data,
        });
        continue;
      }

      let status: "ok" | "warning" | "error" = "ok";
      let message: string | undefined;

      if (type === "teaching" && !data["tema"]) {
        status = "warning";
        message = "Kolom tema kosong";
      } else if (
        (type === "design" || type === "robotics") &&
        !data["judul"]
      ) {
        status = "warning";
        message = "Kolom judul kosong";
      } else if (type === "youtube") {
        // Support both "link_video" (new) and "link_youtube" (legacy)
        const videoLink = data["link_video"] || data["link_youtube"];
        if (!videoLink) {
          status = "error";
          message = "link_video wajib diisi";
        } else if (!isValidVideoLink(videoLink)) {
          status = "warning";
          message = `Platform tidak dikenali untuk link: ${videoLink}`;
        }
      } else if (type === "certificate" && !data["tema"]) {
        status = "warning";
        message = "Kolom tema kosong";
      }

      rows.push({ rowNumber: i + 1, type, status, message, data });
    }

    callback(rows);
  };
  reader.readAsText(file);
}

export async function importUnifiedPortfolio(
  rows: UnifiedCsvRow[],
  studentId: string | number,
  semesterId: string | number
): Promise<CsvImportResult> {
  const result: CsvImportResult = {
    teaching: { success: 0, failed: 0 },
    design: { success: 0, failed: 0 },
    robotics: { success: 0, failed: 0 },
    youtube: { success: 0, failed: 0 },
    certificate: { success: 0, failed: 0 },
    total: { success: 0, failed: 0 },
  };

  const validRows = rows.filter((r) => r.status !== "error");

  for (const row of validRows) {
    try {
      switch (row.type) {
        case "teaching": {
          const fd = new FormData();
          fd.append("student_id", String(studentId));
          fd.append("semester_id", String(semesterId));
          if (row.data.tema) fd.append("tema", row.data.tema);
          if (row.data.lokasi) fd.append("lokasi", row.data.lokasi);
          if (row.data.tanggal) fd.append("tanggal", row.data.tanggal);
          if (row.data.dokumentasi)
            fd.append("link_foto_1", row.data.dokumentasi);
          if (row.data.link_foto_1)
            fd.append("link_foto_1", row.data.link_foto_1);
          if (row.data.link_foto_2)
            fd.append("link_foto_2", row.data.link_foto_2);
          if (row.data.jumlah_peserta)
            fd.append("jumlah_peserta", row.data.jumlah_peserta);
          if (row.data.cerita_siswa)
            fd.append("cerita_siswa", row.data.cerita_siswa);
          if (row.data.testimoni_peserta)
            fd.append("testimoni_peserta", row.data.testimoni_peserta);
          await createTeachingActivity(fd);
          result.teaching.success++;
          break;
        }
        case "design":
        case "robotics": {
          const fd = new FormData();
          fd.append("student_id", String(studentId));
          fd.append("semester_id", String(semesterId));
          if (row.data.judul) fd.append("judul", row.data.judul);
          if (row.data.teknologi) fd.append("teknologi", row.data.teknologi);
          if (row.data.deskripsi) fd.append("deskripsi", row.data.deskripsi);
          if (row.data.kompetensi_siswa)
            fd.append("kompetensi_siswa", row.data.kompetensi_siswa);
          if (row.data.link_project)
            fd.append("link_file_flyer", row.data.link_project);
          if (row.data.link_file_flyer)
            fd.append("link_file_flyer", row.data.link_file_flyer);
          const gambarUrl =
            row.data.gambar || row.data.link_gambar_drive || "";
          if (gambarUrl) fd.append("link_gambar_drive", gambarUrl);
          if (row.type === "design") {
            await createDesignProject(fd);
            result.design.success++;
          } else {
            await createRoboticsProject(fd);
            result.robotics.success++;
          }
          break;
        }
        case "youtube": {
          // Support both "link_video" (new multi-platform) and "link_youtube" (legacy)
          const videoLink = row.data.link_video || row.data.link_youtube || "";
          await createYoutubeVideo({
            student_id: Number(studentId),
            semester_id: Number(semesterId),
            judul_video: row.data.judul_video || "",
            link_youtube: videoLink,
            deskripsi_video: row.data.deskripsi_video || undefined,
          });
          result.youtube.success++;
          break;
        }
        case "certificate": {
          const fd = new FormData();
          fd.append("student_id", String(studentId));
          fd.append("semester_id", String(semesterId));
          if (row.data.tema) fd.append("tema", row.data.tema);
          if (row.data.lingkup) fd.append("lingkup", row.data.lingkup);
          if (row.data.penyelenggara)
            fd.append("penyelenggara", row.data.penyelenggara);
          if (row.data.tahun) fd.append("tahun", row.data.tahun);
          if (row.data.tanggal) fd.append("tanggal", row.data.tanggal);
          if (row.data.sertifikat)
            fd.append("link_gambar_drive", row.data.sertifikat);
          if (row.data.link_gambar_drive)
            fd.append("link_gambar_drive", row.data.link_gambar_drive);
          await createCertificate(fd);
          result.certificate.success++;
          break;
        }
      }
      result.total.success++;
    } catch {
      result[row.type].failed++;
      result.total.failed++;
    }
  }

  return result;
}
