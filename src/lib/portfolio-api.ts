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

export async function createDesignProject(data: Partial<DesignProject>): Promise<void> {
  await api.post("/design-projects", data);
}

export async function updateDesignProject(id: number, data: Partial<DesignProject>): Promise<void> {
  await api.put(`/design-projects/${id}`, data);
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

export async function createRoboticsProject(data: Partial<RoboticsProject>): Promise<void> {
  await api.post("/robotics-projects", data);
}

export async function updateRoboticsProject(
  id: number,
  data: Partial<RoboticsProject>,
): Promise<void> {
  await api.put(`/robotics-projects/${id}`, data);
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
