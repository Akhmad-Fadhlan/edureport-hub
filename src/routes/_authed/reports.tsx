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
import { apiGet, getStudentPhoto } from "@/lib/api";
import { useAuth } from "@/stores/auth-store";
import { Loader2, Download, FileText } from "lucide-react";
import {
  StudentReportPdf,
  type PdfReportData,
} from "@/lib/pdf/StudentReportPdf";
import coverBgUrlikhwan from "@/assets/cover-bg1.png";
import coverBgUrlakhwat from "@/assets/cover-bg2.png";
import reportFirstBgUrl from "@/assets/report-first.png";

export const Route = createFileRoute("/_authed/reports")({
  component: ReportsPage,
});

/* ============================================================================
 * HELPERS
 * ========================================================================== */

/**
 * Ekstrak Google Drive File ID dari berbagai format URL Google Drive.
 * Returns null jika bukan URL Google Drive.
 */
function extractDriveFileId(url: string): string | null {
  // Format: /file/d/FILE_ID/...
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
  if (fileMatch) return fileMatch[1];

  // Format: open?id=FILE_ID atau uc?id=FILE_ID
  const idMatch = url.match(/drive\.google\.com\/(?:open|uc)\?(?:.*&)?id=([^&]+)/);
  if (idMatch) return idMatch[1];

  return null;
}

/**
 * Fetch gambar via proxy backend — menghindari CORS Google Drive.
 * Proxy sudah menangani autentikasi dan konversi ke base64.
 */
async function fetchViaProxy(
  rawUrl: string,
  proxyBase: string,
): Promise<string | null> {
  try {
    const proxyUrl = `${proxyBase}?url=${encodeURIComponent(rawUrl)}&format=jpeg`;
    console.log("Fetching via proxy:", proxyUrl);

    const res = await fetch(proxyUrl);
    if (!res.ok) return null;

    // Proxy returns JSON: { success: true, data: "data:image/png;base64,..." }
    const json = await res.json();
    if (json?.success && typeof json?.data === "string") {
      return json.data; // sudah berupa data URL, langsung pakai
    }

    return null;
  } catch (err) {
    console.error("fetchViaProxy error:", err);
    return null;
  }
}

/**
 * Konversi URL gambar ke base64 data URL.
 * - Google Drive URL → lewat proxy backend (tidak kena CORS)
 * - URL biasa → fetch langsung dengan cors mode
 * - URL proxy (sudah /api/...) → fetch langsung
 */
async function urlToDataUrl(
  url: string | null | undefined,
  proxyBase = "/api/proxy-image",
): Promise<string | null> {
  if (!url) return null;

  // Jika sudah berupa data URL, langsung kembalikan
  if (url.startsWith("data:")) return url;

  // Jika sudah berupa URL proxy internal, fetch langsung
  if (url.startsWith("/api/") || url.includes(window.location.hostname)) {
    try {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) return null;
      const blob = await res.blob();
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error("urlToDataUrl error:", err);
      return null;
    }
  }

  // Google Drive URL → wajib lewat proxy (kena CORS jika fetch langsung)
  const driveId = extractDriveFileId(url);
  if (driveId) {
    // Kirim original URL ke proxy, bukan URL yang dikonversi
    return fetchViaProxy(url, proxyBase);
  }

  // URL lain (non-Drive) → fetch langsung tanpa credentials
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error("urlToDataUrl error:", err);
    return null;
  }
}

/* ============================================================================
 * PAGE COMPONENT
 * ========================================================================== */

function ReportsPage() {
  const { isGuru, getCabangId, user } = useAuth();
  const guruMode = isGuru();
  const cabangId = getCabangId();

  const semesters = useApiData<any[]>("/semesters");

  const classParams: any = {};
  if (guruMode && cabangId) classParams.cabang_id = cabangId;
  const classes = useApiData<any[]>("/classes", classParams);

  const currentTeacher = useApiData<any[]>(
    user?.id ? "/teachers" : null,
    user?.id ? { user_id: user.id } : {},
  );

  const [semesterId, setSemesterId] = useState<string>("");
  const [classId, setClassId] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");

  // Set semester aktif secara otomatis
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

  const [building, setBuilding] = useState(false);
  const [pdfData, setPdfData] = useState<PdfReportData | null>(null);
  const [PDFViewer, setPDFViewer] = useState<any>(null);
  const [PDFDownloadLink, setPDFDownloadLink] = useState<any>(null);

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
   * BUILD REPORT
   * ------------------------------------------------------------------------ */
  /** Ekstrak angka pertama dari nama_kelas, mis. "8A" → 8, "7B-akh" → 7 */
  function parseTingkatFromKelas(namaKelas: string | undefined | null): number | null {
    if (!namaKelas) return null;
    const m = namaKelas.match(/^(\d+)/);
    return m ? parseInt(m[1]) : null;
  }

  async function buildReport() {
    if (!studentId || !semesterId) return;
    setBuilding(true);
    try {
      // ── 0. Tentukan tingkat kelas siswa dari nama_kelas ────────────────────
      const studentFromList = (students.data?.items ?? []).find(
        (s: any) => s.id === parseInt(studentId),
      );
      const namaKelasRaw: string | undefined = studentFromList?.nama_kelas;
      const tingkatKelas = parseTingkatFromKelas(namaKelasRaw); // 7, 8, atau null

      // Bangun params materials: filter by tingkat agar dapat materi global + tingkat siswa
      const materialsParams: any = { semester_id: semesterId };
      if (tingkatKelas !== null) materialsParams.tingkat_kelas = String(tingkatKelas);

      // ── 1. Fetch semua data paralel ────────────────────────────────────────
      const [studentDetail, materials, indicators, grades] = await Promise.all([
        apiGet<any>(`/students/${studentId}`).catch(
          () => studentFromList ?? null,
        ),
        apiGet<any[]>("/materials", materialsParams),
        apiGet<any[]>("/indicators"),
        apiGet<any[]>("/grades", {
          semester_id: semesterId,
          student_id: studentId,
        }),
      ]);

      // ── 2. Semester info ───────────────────────────────────────────────────
      const semester = (semesters.data ?? []).find(
        (s: any) => s.id === parseInt(semesterId),
      );

      // ── 3. Susun materials + indicators + nilai ────────────────────────────
      const matIds = new Set((materials ?? []).map((m: any) => m.id));
      const visIndicators = (indicators ?? []).filter((i: any) =>
        matIds.has(i.material_id),
      );

      const gradeMap = new Map<string, number>();
      (grades ?? []).forEach((g: any) =>
        gradeMap.set(g.indicator_kode, parseFloat(g.nilai)),
      );

      const pdfMaterials = (materials ?? [])
        .sort((a: any, b: any) => (a.urutan ?? 0) - (b.urutan ?? 0))
        .map((m: any) => ({
          id: m.id,
          judul: m.judul,
          kode_rapor: m.kode_rapor,
          nama_mapel: m.nama_mapel,
          indicators: visIndicators
            .filter((i: any) => i.material_id === m.id)
            .sort((a: any, b: any) => (a.urutan ?? 0) - (b.urutan ?? 0))
            .map((i: any) => ({
              id: i.id,
              kode: i.kode,
              deskripsi: i.deskripsi,
              nilai_max: parseFloat(i.nilai_max),
              nilai: gradeMap.has(i.kode) ? gradeMap.get(i.kode)! : null,
            })),
        }));

      // ── 4. Resolve foto siswa via API (authenticated, bukan URL langsung) ──
      const photoDataUrl = studentDetail?.photo
        ? await getStudentPhoto(studentDetail.photo)
        : null;

      // ── 5. Resolve data guru dari endpoint /teachers berdasarkan user_id ──
      const teacherRecord = Array.isArray(currentTeacher.data)
        ? currentTeacher.data[0]
        : currentTeacher.data;

      // ── PERUBAHAN: nama TTD diambil dari user yang sedang login ─────────────
      // Prioritas: user.name → user.nama → teacher record → fallback
      // Sesuaikan field (name/nama/username) dengan struktur auth store kamu.
      const teacherNama: string =
        (user as any)?.name ??
        (user as any)?.nama ??
        (user as any)?.username ??
        teacherRecord?.nama ??
        "Nama Guru IT";

      const teacherJabatan: string =
        teacherRecord?.mata_pelajaran ?? teacherRecord?.jabatan ?? "Guru IT";

      // TTD guru: ambil dari field tanda_tangan, fetch via proxy agar tidak kena CORS
      const ttdRawUrl: string | null = teacherRecord?.tanda_tangan
        ? teacherRecord.tanda_tangan.startsWith("http")
          ? teacherRecord.tanda_tangan
          : null
        : null;

      // Google Drive URL wajib lewat proxy — sama seperti foto siswa
      const ttdDataUrl = await urlToDataUrl(
        ttdRawUrl,
        "https://rapor.codestechno.com/api/proxy-image", // ← absolute URL backend
      );
      console.log(
        "TTD resolved:",
        ttdRawUrl,
        "→",
        ttdDataUrl ? ttdDataUrl.slice(0, 60) + "..." : null,
      );

      // ── 6. Fetch catatan / comment ─────────────────────────────────────────
      let comment: string | null = null;
      try {
        const noteRes = await apiGet<any>("/notes", {
          student_id: studentId,
          semester_id: semesterId,
        });
        if (noteRes) {
          const noteItem = Array.isArray(noteRes) ? noteRes[0] : noteRes;
          comment =
            noteItem?.comment ??
            noteItem?.catatan ??
            noteItem?.note ??
            null;
        }
      } catch {
        // Belum ada data catatan → biarkan null
      }

      // ── 7. Convert asset backgrounds ──────────────────────────────────────
      const selectedClass = (classes.data ?? []).find(
        (k: any) => k.id === parseInt(classId),
      );
      const isAkhwat = selectedClass?.cabang?.toLowerCase() === "akhwat";
      const activeCoverBgUrl = isAkhwat ? coverBgUrlakhwat : coverBgUrlikhwan;

      // ── PERUBAHAN: reportLastBgDataUrl tidak lagi dipakai di PDF renderer,
      //    tapi tetap di-fetch agar tidak break jika suatu saat diperlukan lagi.
      const [coverBgDataUrl, reportFirstBgDataUrl, reportLastBgDataUrl] =
        await Promise.all([
          urlToDataUrl(activeCoverBgUrl),
          urlToDataUrl(reportFirstBgUrl),
          urlToDataUrl(reportLastBgUrl), // nilai ini tidak dikirim ke PdfReportData
        ]);

      const generatedDate = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // ── 8. Set state ───────────────────────────────────────────────────────
      setPdfData({
        student: {
          nama: studentDetail?.nama ?? "",
          email: studentDetail?.email ?? "",
          linkedin: studentDetail?.linkedin ?? undefined,
          photoDataUrl: photoDataUrl ?? null,
          nama_kelas:
            studentDetail?.nama_kelas ??
            (students.data?.items ?? []).find(
              (s: any) => s.id === parseInt(studentId),
            )?.nama_kelas ??
            undefined,
        },
        semester: {
          nama_semester: semester?.nama_semester ?? "",
          tahun_ajaran: semester?.tahun_ajaran ?? "",
          semester: semester?.semester ?? undefined,
        },
        generatedDate,
        teacher: {
          nama: teacherNama,       // ← nama user yang login
          jabatan: teacherJabatan,
          ttdDataUrl: ttdDataUrl ?? null,
        },
        materials: pdfMaterials,
        comment,
        schoolName: "SMP IDN Boarding School",
        coverBgDataUrl,
        reportFirstBgDataUrl,
        // reportLastBgDataUrl sengaja tidak dikirim → halaman terakhir putih bersih
      });
    } catch (e) {
      console.error("buildReport error:", e);
    } finally {
      setBuilding(false);
    }
  }

  /* --------------------------------------------------------------------------
   * DERIVED VALUES
   * ------------------------------------------------------------------------ */
  const studentName = useMemo(() => {
    return (
      (students.data?.items ?? []).find(
        (s: any) => s.id === parseInt(studentId),
      )?.nama ?? "siswa"
    );
  }, [students.data, studentId]);

  const activeSemesterLabel = useMemo(() => {
    return (
      (semesters.data ?? []).find((s: any) => s.id === parseInt(semesterId))
        ?.nama_semester ?? "rapor"
    );
  }, [semesters.data, semesterId]);

  const fileName = `${studentName}-${activeSemesterLabel}.pdf`;

  /* --------------------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------------------ */
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Rapor PDF</h1>
        <p className="text-sm text-muted-foreground">
          Preview &amp; download rapor digital presisi A4.
        </p>
      </div>

      {/* Filter bar */}
      <Card className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div className="space-y-2">
          <Label>Semester</Label>
          <Select value={semesterId} onValueChange={setSemesterId}>
            <SelectTrigger>
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              {(semesters.data ?? []).map((s: any) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.nama_semester}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Kelas</Label>
          <Select
            value={classId}
            onValueChange={(v) => {
              setClassId(v);
              setStudentId("");
              setPdfData(null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Kelas" />
            </SelectTrigger>
            <SelectContent>
              {(classes.data ?? []).map((k: any) => (
                <SelectItem key={k.id} value={String(k.id)}>
                  {k.nama_kelas}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Siswa</Label>
          <Select
            value={studentId}
            onValueChange={(v) => {
              setStudentId(v);
              setPdfData(null);
            }}
            disabled={!classId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih siswa" />
            </SelectTrigger>
            <SelectContent>
              {(students.data?.items ?? []).map((s: any) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={buildReport} disabled={!studentId || building}>
          {building ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileText className="h-4 w-4 mr-2" />
          )}
          Generate Preview
        </Button>
      </Card>

      {/* Download button */}
      {pdfData && PDFDownloadLink && (
        <div className="flex justify-end">
          <PDFDownloadLink
            document={<StudentReportPdf data={pdfData} />}
            fileName={fileName}
          >
            {({ loading }: { loading: boolean }) => (
              <Button variant="default">
                <Download className="h-4 w-4 mr-2" />
                {loading ? "Menyiapkan..." : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      )}

      {/* PDF Preview */}
      {pdfData && PDFViewer ? (
        <Card className="overflow-hidden p-0 h-[80vh]">
          <PDFViewer
            style={{ width: "100%", height: "100%", border: 0 }}
            showToolbar
          >
            <StudentReportPdf data={pdfData} />
          </PDFViewer>
        </Card>
      ) : (
        <Card className="p-12 text-center text-muted-foreground">
          {building
            ? "Menyiapkan rapor..."
            : "Pilih semester, kelas, siswa lalu klik Generate Preview."}
        </Card>
      )}
    </div>
  );
}
