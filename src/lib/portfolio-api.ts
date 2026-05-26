import { api, apiGet, apiDelete } from "./api";

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

// ── CSV HELPERS ───────────────────────────────────────────────────────────────

function csvCell(v: string | number | null | undefined): string {
  const s = String(v ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
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
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') { inQ = false; }
      else { cur += ch; }
    } else {
      if (ch === '"') { inQ = true; }
      else if (ch === ",") { cells.push(cur); cur = ""; }
      else { cur += ch; }
    }
  }
  cells.push(cur);
  return cells;
}

function parseCsvText(text: string): string[][] {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  return lines.filter((l) => l.trim()).map(parseCsvLine);
}

function downloadCsv(rows: (string | number | null | undefined)[][], filename: string) {
  const bom = "\uFEFF";
  const blob = new Blob([bom + toCsv(rows)], { type: "text/csv;charset=utf-8;" });
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
      ["Kolom foto tidak bisa diisi via CSV. Upload foto manual setelah import."],
      [],
      ["lokasi", "tanggal", "tema", "jumlah_peserta", "cerita_siswa", "testimoni_peserta", "link_foto_1", "link_foto_2"],
      ["Contoh Lokasi", "2025-01-15", "Belajar Coding", "30", "Cerita siswa...", "Testimoni...", "https://drive.google.com/...", ""],
    ],
    "template_kegiatan_mengajar.csv",
  );
}

export function parseTeachingCsv(
  file: File,
  callback: (rows: CsvImportRow<Partial<TeachingActivity>>[]) => void,
) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const raw = e.target?.result;
    if (typeof raw !== "string") { callback([]); return; }
    const allRows = parseCsvText(raw);
    // skip header lines until we find the header row
    const headerIdx = allRows.findIndex((r) =>
      r.some((c) => c.trim().toLowerCase() === "lokasi"),
    );
    if (headerIdx === -1) { callback([]); return; }
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
        jumlah_peserta: get("jumlah_peserta") ? Number(get("jumlah_peserta")) : undefined,
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
        message: missing.length ? `Kolom kosong: ${missing.join(", ")}` : undefined,
      });
    }
    callback(results);
  };
  reader.readAsText(file, "utf-8");
}

export async function importTeachingActivities(
  rows: CsvImportRow<Partial<TeachingActivity>>[],
  studentId: number,
  semesterId: number,
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;
  for (const row of rows) {
    if (row.status === "error") { failed++; continue; }
    try {
      const fd = new FormData();
      fd.append("student_id", String(studentId));
      fd.append("semester_id", String(semesterId));
      const d = row.data;
      if (d.lokasi) fd.append("lokasi", d.lokasi);
      if (d.tanggal) fd.append("tanggal", d.tanggal);
      if (d.tema) fd.append("tema", d.tema);
      if (d.jumlah_peserta) fd.append("jumlah_peserta", String(d.jumlah_peserta));
      if (d.cerita_siswa) fd.append("cerita_siswa", d.cerita_siswa);
      if (d.testimoni_peserta) fd.append("testimoni_peserta", d.testimoni_peserta);
      if (d.link_foto_1) fd.append("link_foto_1", d.link_foto_1);
      if (d.link_foto_2) fd.append("link_foto_2", d.link_foto_2);
      await api.post("/teaching-activities", fd, { headers: { "Content-Type": "multipart/form-data" } });
      success++;
    } catch { failed++; }
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
      ["judul", "deskripsi", "teknologi", "kompetensi_siswa", "link_file_flyer", "link_gambar_drive"],
      ["Contoh Judul", "Deskripsi proyek...", "Canva / Arduino", "Kompetensi...", "https://drive.google.com/...", "https://drive.google.com/..."],
    ],
    `template_karya_${type}.csv`,
  );
}

export function parseProjectCsv(
  file: File,
  callback: (rows: CsvImportRow<Partial<DesignProject | RoboticsProject>>[]) => void,
) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const raw = e.target?.result;
    if (typeof raw !== "string") { callback([]); return; }
    const allRows = parseCsvText(raw);
    const headerIdx = allRows.findIndex((r) =>
      r.some((c) => c.trim().toLowerCase() === "judul"),
    );
    if (headerIdx === -1) { callback([]); return; }
    const header = allRows[headerIdx].map((c) => c.trim().toLowerCase());
    const results: CsvImportRow<Partial<DesignProject | RoboticsProject>>[] = [];

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
  semesterId: number,
): Promise<{ success: number; failed: number }> {
  const endpoint = type === "design" ? "/design-projects" : "/robotics-projects";
  let success = 0;
  let failed = 0;
  for (const row of rows) {
    if (row.status === "error") { failed++; continue; }
    try {
      await api.post(endpoint, { student_id: studentId, semester_id: semesterId, ...row.data });
      success++;
    } catch { failed++; }
  }
  return { success, failed };
}

// ── YOUTUBE CSV ───────────────────────────────────────────────────────────────

export function downloadYoutubeTemplate() {
  downloadCsv(
    [
      ["TEMPLATE IMPORT VIDEO YOUTUBE"],
      [],
      ["judul_video", "link_youtube", "deskripsi_video"],
      ["Judul Video Saya", "https://youtube.com/watch?v=xxx", "Deskripsi..."],
    ],
    "template_video_youtube.csv",
  );
}

export function parseYoutubeCsv(
  file: File,
  callback: (rows: CsvImportRow<Partial<YoutubeVideo>>[]) => void,
) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const raw = e.target?.result;
    if (typeof raw !== "string") { callback([]); return; }
    const allRows = parseCsvText(raw);
    const headerIdx = allRows.findIndex((r) =>
      r.some((c) => c.trim().toLowerCase() === "judul_video"),
    );
    if (headerIdx === -1) { callback([]); return; }
    const header = allRows[headerIdx].map((c) => c.trim().toLowerCase());
    const results: CsvImportRow<Partial<YoutubeVideo>>[] = [];

    for (let i = headerIdx + 1; i < allRows.length; i++) {
      const cols = allRows[i];
      if (cols.every((c) => !c.trim())) continue;
      const get = (key: string) => cols[header.indexOf(key)]?.trim() ?? "";

      const data: Partial<YoutubeVideo> = {
        judul_video: get("judul_video"),
        link_youtube: get("link_youtube"),
        deskripsi_video: get("deskripsi_video") || undefined,
      };

      const missing: string[] = [];
      if (!data.judul_video) missing.push("judul_video");
      if (!data.link_youtube) missing.push("link_youtube");

      results.push({
        row: i + 1,
        data,
        status: missing.length ? "error" : "ok",
        message: missing.length ? `Wajib diisi: ${missing.join(", ")}` : undefined,
      });
    }
    callback(results);
  };
  reader.readAsText(file, "utf-8");
}

export async function importYoutubeVideos(
  rows: CsvImportRow<Partial<YoutubeVideo>>[],
  studentId: number,
  semesterId: number,
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;
  for (const row of rows) {
    if (row.status === "error") { failed++; continue; }
    try {
      await api.post("/youtube-videos", { student_id: studentId, semester_id: semesterId, ...row.data });
      success++;
    } catch { failed++; }
  }
  return { success, failed };
}

// ── CERTIFICATE CSV ──────────────────────────────────────────────────────────

export function downloadCertificateTemplate() {
  downloadCsv(
    [
      ["TEMPLATE IMPORT SERTIFIKAT"],
      ["Kolom gambar tidak bisa diisi via CSV. Upload gambar manual atau gunakan link_gambar_drive."],
      [],
      ["tema", "lingkup", "tanggal", "link_gambar_drive"],
      ["Juara 1 Coding", "Nasional", "2025-03-10", "https://drive.google.com/..."],
    ],
    "template_sertifikat.csv",
  );
}

export function parseCertificateCsv(
  file: File,
  callback: (rows: CsvImportRow<Partial<Certificate>>[]) => void,
) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const raw = e.target?.result;
    if (typeof raw !== "string") { callback([]); return; }
    const allRows = parseCsvText(raw);
    const headerIdx = allRows.findIndex((r) =>
      r.some((c) => c.trim().toLowerCase() === "tema"),
    );
    if (headerIdx === -1) { callback([]); return; }
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
  semesterId: number,
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;
  for (const row of rows) {
    if (row.status === "error") { failed++; continue; }
    try {
      const fd = new FormData();
      fd.append("student_id", String(studentId));
      fd.append("semester_id", String(semesterId));
      const d = row.data;
      if (d.tema) fd.append("tema", d.tema);
      if (d.lingkup) fd.append("lingkup", d.lingkup);
      if (d.tanggal) fd.append("tanggal", d.tanggal);
      if (d.link_gambar_drive) fd.append("link_gambar_drive", d.link_gambar_drive);
      await api.post("/certificates", fd, { headers: { "Content-Type": "multipart/form-data" } });
      success++;
    } catch { failed++; }
  }
  return { success, failed };
}

// ── STUDENT SUMMARY ─────────────────────────────────────────────────────────

export async function getStudentSummary(
  student_id: number,
  semester_id: number,
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

export async function upsertStudentSummary(data: Partial<StudentSummary>): Promise<void> {
  await api.post("/student-summary", data);
}

// ── TEACHING ACTIVITIES ──────────────────────────────────────────────────────

export async function getTeachingActivities(
  student_id: number,
  semester_id: number,
): Promise<TeachingActivity[]> {
  const res = await api.get("/teaching-activities", {
    params: { student_id, semester_id },
  });
  return res.data?.data ?? [];
}

export async function createTeachingActivity(formData: FormData): Promise<void> {
  await api.post("/teaching-activities", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function updateTeachingActivity(id: number, formData: FormData): Promise<void> {
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
  semester_id: number,
): Promise<DesignProject[]> {
  const res = await api.get("/design-projects", {
    params: { student_id, semester_id },
  });
  return res.data?.data ?? [];
}

export async function createDesignProject(data: Partial<DesignProject> | FormData): Promise<void> {
  if (data instanceof FormData) {
    await api.post("/design-projects", data, { headers: { "Content-Type": "multipart/form-data" } });
  } else {
    await api.post("/design-projects", data);
  }
}

export async function updateDesignProject(id: number, data: Partial<DesignProject> | FormData): Promise<void> {
  if (data instanceof FormData) {
    await api.put(`/design-projects/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
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
  semester_id: number,
): Promise<RoboticsProject[]> {
  const res = await api.get("/robotics-projects", {
    params: { student_id, semester_id },
  });
  return res.data?.data ?? [];
}

export async function createRoboticsProject(data: Partial<RoboticsProject> | FormData): Promise<void> {
  if (data instanceof FormData) {
    await api.post("/robotics-projects", data, { headers: { "Content-Type": "multipart/form-data" } });
  } else {
    await api.post("/robotics-projects", data);
  }
}

export async function updateRoboticsProject(
  id: number,
  data: Partial<RoboticsProject> | FormData,
): Promise<void> {
  if (data instanceof FormData) {
    await api.put(`/robotics-projects/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
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
  semester_id: number,
): Promise<YoutubeVideo[]> {
  const res = await api.get("/youtube-videos", {
    params: { student_id, semester_id },
  });
  return res.data?.data ?? [];
}

export async function createYoutubeVideo(data: Partial<YoutubeVideo>): Promise<void> {
  await api.post("/youtube-videos", data);
}

export async function updateYoutubeVideo(id: number, data: Partial<YoutubeVideo>): Promise<void> {
  await api.put(`/youtube-videos/${id}`, data);
}

export async function deleteYoutubeVideo(id: number): Promise<void> {
  await apiDelete(`/youtube-videos/${id}`);
}

// ── CERTIFICATES ─────────────────────────────────────────────────────────────

export async function getCertificates(
  student_id: number,
  semester_id: number,
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

export async function updateCertificate(id: number, formData: FormData): Promise<void> {
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
  semester_id: number,
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

// ── HELPERS ──────────────────────────────────────────────────────────────────

export function getYoutubeEmbedUrl(link: string): string {
  try {
    const url = new URL(link);
    let videoId = "";
    if (url.hostname.includes("youtu.be")) {
      videoId = url.pathname.slice(1);
    } else {
      videoId = url.searchParams.get("v") ?? "";
    }
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
  } catch {
    return "";
  }
}

export function getYoutubeVideoId(link: string): string {
  try {
    const url = new URL(link);
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1);
    return url.searchParams.get("v") ?? "";
  } catch {
    return "";
  }
}

export const UPLOADS_BASE_URL = "https://rapor.codestechno.com/upload";

export function resolveUploadUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${UPLOADS_BASE_URL}/${path}`;
}

/** Resolve either an uploaded file path or a Google Drive link to a displayable URL */
export function resolveImageUrl(filePath?: string | null, driveLink?: string | null): string | null {
  if (filePath) return resolveUploadUrl(filePath);
  if (driveLink) return driveLink;
  return null;
}

/** Convert a Google Drive share link to a direct image URL if possible */
export function normalizeDriveLink(link: string): string {
  try {
    const url = new URL(link);
    // https://drive.google.com/file/d/FILE_ID/view → direct embed
    const match = url.pathname.match(/\/file\/d\/([^/]+)/);
    if (match) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
  } catch { /* not a URL */ }
  return link;
}
