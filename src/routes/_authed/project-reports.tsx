import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApiData } from "@/hooks/use-api-data";
import { useAuth } from "@/stores/auth-store";
import { toast } from "sonner";
import { Loader2, Download, Briefcase } from "lucide-react";
import {
  getStudentSummary,
  getDesignProjects,
  getRoboticsProjects,
  getYoutubeVideos,
  getTeachingActivities,
  getCertificates,
  getYoutubeVideoId,
  resolveUploadUrl,
  type DesignProject,
  type RoboticsProject,
} from "@/lib/portfolio-api";
import { ProjectReportPdf, type ProjectReportData } from "@/lib/pdf/ProjectReportPdf";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_authed/project-reports")({
  component: ProjectReportsPage,
});

/* ============================================================================
 * HELPERS
 * ========================================================================== */

async function urlToDataUrl(url: string | null | undefined): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, { mode: "cors", credentials: "include" });
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

async function getYoutubeThumbnail(link: string): Promise<string | null> {
  const videoId = getYoutubeVideoId(link);
  if (!videoId) return null;
  const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  return await urlToDataUrl(thumbUrl);
}

async function getUploadImageDataUrl(path: string | null | undefined): Promise<string | null> {
  if (!path) return null;
  const resolvedUrl = resolveUploadUrl(path);
  if (!resolvedUrl) return null;
  // Try fetching via authenticated API proxy if needed, or direct URL
  return await urlToDataUrl(resolvedUrl);
}

// Try authenticated photo fetch via /get-student-photo or direct URL
async function getAuthImage(path: string | null | undefined): Promise<string | null> {
  if (!path) return null;
  try {
    const res = await api.post<any>("/get-student-photo", { filename: path });
    const raw = res.data?.data;
    if (typeof raw === "string" && raw.length > 10) return raw;
  } catch { /* ignore */ }
  return await getUploadImageDataUrl(path);
}

/* ============================================================================
 * MAIN PAGE
 * ========================================================================== */

function ProjectReportsPage() {
  const { isGuru, getCabangId, user } = useAuth();
  const guruMode = isGuru();
  const cabangId = getCabangId();

  const semesters = useApiData<any[]>("/semesters");
  const classParams: any = {};
  if (guruMode && cabangId) classParams.cabang_id = cabangId;
  const classes = useApiData<any[]>("/classes", classParams);

  const [semesterId, setSemesterId] = useState("");
  const [classId, setClassId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [building, setBuilding] = useState(false);
  const [pdfData, setPdfData] = useState<ProjectReportData | null>(null);
  const [PDFViewer, setPDFViewer] = useState<any>(null);
  const [PDFDownloadLink, setPDFDownloadLink] = useState<any>(null);

  // Set semester aktif otomatis
  useEffect(() => {
    if (!semesterId && semesters.data) {
      const active = semesters.data.find((s: any) => s.is_active === 1);
      if (active) setSemesterId(String(active.id));
    }
  }, [semesters.data, semesterId]);

  const students = useApiData<{ items: any[] }>(
    classId ? "/students" : null,
    { class_id: classId, per_page: 200, ...(guruMode && cabangId ? { cabang_id: cabangId } : {}) },
  );

  // Client-only react-pdf import
  useEffect(() => {
    let mounted = true;
    import("@react-pdf/renderer").then((mod) => {
      if (!mounted) return;
      setPDFViewer(() => mod.PDFViewer);
      setPDFDownloadLink(() => mod.PDFDownloadLink);
    });
    return () => { mounted = false; };
  }, []);

  /* --------------------------------------------------------------------------
   * BUILD PROJECT REPORT
   * -------------------------------------------------------------------------- */
  async function buildReport() {
    if (!studentId || !semesterId) return;
    setBuilding(true);
    try {
      const sid = parseInt(studentId);
      const semId = parseInt(semesterId);

      // Fetch all portfolio data in parallel
      const [summary, designs, robotics, videos, teachings, certs, studentDetail] = await Promise.all([
        getStudentSummary(sid, semId),
        getDesignProjects(sid, semId),
        getRoboticsProjects(sid, semId),
        getYoutubeVideos(sid, semId),
        getTeachingActivities(sid, semId),
        getCertificates(sid, semId),
        (async () => {
          try {
            const res = await api.get<any>(`/students/${studentId}`);
            return res.data?.data ?? null;
          } catch {
            return (students.data?.items ?? []).find((s: any) => s.id === sid) ?? null;
          }
        })(),
      ]);

      if (!summary) {
        toast.error("Belum ada data ringkasan portofolio untuk semester ini.");
        return;
      }

      const studentName = studentDetail?.nama ?? 
        (students.data?.items ?? []).find((s: any) => s.id === sid)?.nama ?? "Siswa";

      // Resolve design screenshots
      const designsWithImg = await Promise.all(
        designs.map(async (d) => ({
          judul: d.judul,
          kompetensi_siswa: d.kompetensi_siswa,
          teknologi: d.teknologi,
          deskripsi: d.deskripsi,
          screenshot: d.link_file_flyer
            ? await urlToDataUrl(d.link_file_flyer).then(v => v || null)
            : null,
        })),
      );

      // Resolve robotics screenshots
      const roboticsWithImg = await Promise.all(
        robotics.map(async (r) => ({
          judul: r.judul,
          kompetensi_siswa: r.kompetensi_siswa,
          teknologi: r.teknologi,
          deskripsi: r.deskripsi,
          screenshot: r.link_file_flyer
            ? await urlToDataUrl(r.link_file_flyer).then(v => v || null)
            : null,
        })),
      );

      // Resolve youtube thumbnails
      const videosWithThumb = await Promise.all(
        videos.map(async (v) => ({
          judul_video: v.judul_video,
          deskripsi_video: v.deskripsi_video,
          link_youtube: v.link_youtube,
          thumbnail: await getYoutubeThumbnail(v.link_youtube),
          qr: null,
        })),
      );

      // Resolve teaching photos
      const teachingsWithPhotos = await Promise.all(
        teachings.map(async (t) => ({
          lokasi: t.lokasi,
          tanggal: t.tanggal,
          tema: t.tema,
          jumlah_peserta: t.jumlah_peserta,
          cerita_siswa: t.cerita_siswa,
          testimoni_peserta: t.testimoni_peserta,
          foto1: await getAuthImage(t.foto_mengajar_1),
          foto2: await getAuthImage(t.foto_mengajar_2),
        })),
      );

      // Resolve certificate images
      const certsWithImg = await Promise.all(
        certs.map(async (c) => ({
          lingkup: c.lingkup,
          tanggal: c.tanggal,
          tema: c.tema,
          gambar: await getAuthImage(c.gambar_sertifikat),
        })),
      );

      setPdfData({
        summary: {
          nama: studentName,
          itpt: summary.total_tercapai,
          itpb: summary.belum_tercapai,
          itsl: summary.selesai,
          itbl: summary.belum_selesai,
          ittuntas: summary.tuntas,
          ityt: summary.total_video_youtube,
          itc: summary.total_sertifikat,
          itm: summary.total_mengajar,
          itb: summary.total_buku,
          itl: summary.total_lomba_it,
          itr: summary.total_robotik,
          itd: summary.total_desain,
        },
        designs: designsWithImg,
        robotics: roboticsWithImg,
        videos: videosWithThumb,
        mengajar: teachingsWithPhotos,
        certificates: certsWithImg,
      });

      toast.success("Rapor project berhasil digenerate!");
    } catch (e) {
      console.error("buildReport error:", e);
      toast.error("Gagal membuat rapor project.");
    } finally {
      setBuilding(false);
    }
  }

  const studentName = useMemo(() => {
    return (
      (students.data?.items ?? []).find((s: any) => s.id === parseInt(studentId))?.nama ?? "siswa"
    );
  }, [students.data, studentId]);

  const activeSemesterLabel = useMemo(() => {
    return (
      (semesters.data ?? []).find((s: any) => s.id === parseInt(semesterId))?.nama_semester ?? "rapor"
    );
  }, [semesters.data, semesterId]);

  const fileName = `project-${studentName}-${activeSemesterLabel}.pdf`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Rapor Project IT</h1>
        <p className="text-sm text-muted-foreground">
          Generate & download rapor portofolio project siswa sesuai template.
        </p>
      </div>

      {/* Filter bar */}
      <Card className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div className="space-y-2">
          <Label>Semester</Label>
          <Select value={semesterId} onValueChange={setSemesterId}>
            <SelectTrigger><SelectValue placeholder="Semester" /></SelectTrigger>
            <SelectContent>
              {(semesters.data ?? []).map((s: any) => (
                <SelectItem key={s.id} value={String(s.id)}>{s.nama_semester}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Kelas</Label>
          <Select value={classId} onValueChange={(v) => { setClassId(v); setStudentId(""); setPdfData(null); }}>
            <SelectTrigger><SelectValue placeholder="Kelas" /></SelectTrigger>
            <SelectContent>
              {(classes.data ?? []).map((k: any) => (
                <SelectItem key={k.id} value={String(k.id)}>{k.nama_kelas}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Siswa</Label>
          <Select value={studentId} onValueChange={(v) => { setStudentId(v); setPdfData(null); }} disabled={!classId}>
            <SelectTrigger><SelectValue placeholder="Pilih siswa" /></SelectTrigger>
            <SelectContent>
              {(students.data?.items ?? []).map((s: any) => (
                <SelectItem key={s.id} value={String(s.id)}>{s.nama}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={buildReport} disabled={!studentId || building}>
          {building ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Briefcase className="h-4 w-4 mr-2" />}
          Generate Preview
        </Button>
      </Card>

      {/* Download button */}
      {pdfData && PDFDownloadLink && (
        <div className="flex justify-end">
          <PDFDownloadLink document={<ProjectReportPdf data={pdfData} />} fileName={fileName}>
            {({ loading }: { loading: boolean }) => (
              <Button variant="default">
                <Download className="h-4 w-4 mr-2" />
                {loading ? "Menyiapkan..." : "Download PDF Rapor Project"}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      )}

      {/* PDF Preview */}
      {pdfData && PDFViewer ? (
        <Card className="overflow-hidden p-0 h-[80vh]">
          <PDFViewer style={{ width: "100%", height: "100%", border: 0 }} showToolbar>
            <ProjectReportPdf data={pdfData} />
          </PDFViewer>
        </Card>
      ) : (
        <Card className="p-12 text-center text-muted-foreground">
          {building
            ? "Menyiapkan rapor project... (mengambil data portofolio)"
            : "Pilih semester, kelas, dan siswa lalu klik Generate Preview."}
        </Card>
      )}
    </div>
  );
}
