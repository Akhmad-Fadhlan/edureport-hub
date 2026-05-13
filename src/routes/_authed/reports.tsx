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
import { apiGet, studentPhotoUrl } from "@/lib/api";
import { Loader2, Download, FileText } from "lucide-react";
import {
  StudentReportPdf,
  type PdfReportData,
} from "@/lib/pdf/StudentReportPdf";
import coverBgUrl from "@/assets/cover-bg.png";
import reportFirstBgUrl from "@/assets/report-first.png";
import reportLastBgUrl from "@/assets/report-last.png";

export const Route = createFileRoute("/_authed/reports")({
  component: ReportsPage,
});

/* ============================================================================
 * HELPERS
 * ========================================================================== */

async function urlToDataUrl(url: string | null | undefined): Promise<string | null> {
  if (!url) return null;

  try {
    const res = await fetch(url, {
      mode: "cors",
      credentials: "include",
    });

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

/**
 * Normalisasi URL foto / TTD:
 * - Jika sudah absolute (http/https) → pakai langsung
 * - Jika relative path  → delegasikan ke studentPhotoUrl()
 * - Null / undefined    → null
 */
function resolveMediaUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  // pakai helper yang sama dengan halaman students
  return studentPhotoUrl(raw) ?? null;
}

/* ============================================================================
 * PAGE COMPONENT
 * ========================================================================== */

function ReportsPage() {
  const semesters = useApiData<any[]>("/semesters");
  const classes = useApiData<any[]>("/classes");

  // ── ambil data user yang sedang login ──────────────────────────────────────
  // Endpoint /auth/me harus ada di backend; kalau belum, tambahkan route-nya.
  // Field yang mungkin dikembalikan: id, nama, name, jabatan, role_label, ttd
  const currentUser = useApiData<any>("/auth/me");

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
    { class_id: classId, per_page: 200 },
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
    return () => {
      mounted = false;
    };
  }, []);

  /* --------------------------------------------------------------------------
   * BUILD REPORT
   * ------------------------------------------------------------------------ */
  async function buildReport() {
    if (!studentId || !semesterId) return;
    setBuilding(true);
    try {
      // ── 1. Fetch semua data paralel ────────────────────────────────────────
      const [studentDetail, materials, indicators, grades] = await Promise.all([
        // Coba endpoint individual; fallback ke list yang sudah ada di state
        apiGet<any>(`/students/${studentId}`).catch(
          () =>
            (students.data?.items ?? []).find(
              (s: any) => s.id === parseInt(studentId),
            ) ?? null,
        ),
        apiGet<any[]>("/materials", { semester_id: semesterId }),
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

      // ── 4. Resolve foto siswa ──────────────────────────────────────────────
      // Gunakan pola yang sama dengan halaman students.tsx → studentPhotoUrl()
     const photoUrl = studentPhotoUrl(studentDetail?.photo);
      const photoDataUrl = studentPhotoUrl(studentDetail?.photo) ?? null;
      console.log("PHOTO:", studentDetail?.photo);
console.log("PHOTO URL:", photoUrl);
console.log("PHOTO DATA:", photoDataUrl);
      // ── 5. Resolve data guru (user yang sedang login) ──────────────────────
      const teacher = currentUser.data;

      // Field nama: bisa "nama" atau "name" tergantung backend
      const teacherNama: string =
        teacher?.nama ?? teacher?.name ?? "Nama Guru IT";

      // Field jabatan: bisa "jabatan" atau "role_label"
      const teacherJabatan: string =
        teacher?.jabatan ?? teacher?.role_label ?? "Guru IT";

      // Field TTD: bisa "ttd" (path relatif atau URL absolut)
      const ttdRawUrl = resolveMediaUrl(teacher?.ttd);
      const ttdDataUrl = await urlToDataUrl(ttdRawUrl);

      // ── 6. Fetch catatan / comment ─────────────────────────────────────────
      // Backend: GET /notes?student_id=X&semester_id=Y
      // Response yang mungkin:
      //   { success: true, data: { comment: "...", catatan: "..." } }
      //   { success: true, data: [{ comment: "...", catatan: "..." }] }
      //   { success: true, data: null }
      let comment: string | null = null;
      try {
        const noteRes = await apiGet<any>("/notes", {
          student_id: studentId,
          semester_id: semesterId,
        });

        if (noteRes) {
          // Kalau response array, ambil item pertama
          const noteItem = Array.isArray(noteRes) ? noteRes[0] : noteRes;
          // Normalise field: comment atau catatan
          comment =
            noteItem?.comment ??
            noteItem?.catatan ??
            noteItem?.note ??
            null;
        }
      } catch {
        // Endpoint notes tidak tersedia atau belum ada data → biarkan null
      }

      // ── 7. Convert asset backgrounds ──────────────────────────────────────
      const [coverBgDataUrl, reportFirstBgDataUrl, reportLastBgDataUrl] =
        await Promise.all([
          urlToDataUrl(coverBgUrl),
          urlToDataUrl(reportFirstBgUrl),
          urlToDataUrl(reportLastBgUrl),
        ]);

      // ── 8. Set state ───────────────────────────────────────────────────────
      setPdfData({
        student: {
          nama: studentDetail?.nama ?? "",
          email: studentDetail?.email ?? "",
          linkedin: studentDetail?.linkedin ?? undefined,
          // photoDataUrl sudah base64 data URL atau null
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
        teacher: {
          nama: teacherNama,
          jabatan: teacherJabatan,
          ttdDataUrl: ttdDataUrl ?? null,
        },
        materials: pdfMaterials,
        comment,
        schoolName: "SMP IDN Boarding School",
        coverBgDataUrl,
        reportFirstBgDataUrl,
        reportLastBgDataUrl,
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
