import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApiData } from "@/hooks/use-api-data";
import { apiGet, studentPhotoUrl } from "@/lib/api";
import { Loader2, Download, FileText } from "lucide-react";
import { StudentReportPdf, type PdfReportData } from "@/lib/pdf/StudentReportPdf";

export const Route = createFileRoute("/_authed/reports")({
  component: ReportsPage,
});

async function urlToDataUrl(url: string | null | undefined): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, { mode: "cors" });
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

function ReportsPage() {
  const semesters = useApiData<any[]>("/semesters");
  const classes = useApiData<any[]>("/classes");
  const [semesterId, setSemesterId] = useState<string>("");
  const [classId, setClassId] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");

  useEffect(() => {
    if (!semesterId && semesters.data) {
      const a = semesters.data.find((s: any) => s.is_active === 1);
      if (a) setSemesterId(String(a.id));
    }
  }, [semesters.data, semesterId]);

  const students = useApiData<{ items: any[] }>(classId ? "/students" : null, { class_id: classId, per_page: 200 });

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

  async function buildReport() {
    if (!studentId || !semesterId) return;
    setBuilding(true);
    try {
      const [student, materials, indicators, grades] = await Promise.all([
        apiGet<any>(`/students/${studentId}`).catch(() =>
          (students.data?.items || []).find((s) => s.id === parseInt(studentId)),
        ),
        apiGet<any[]>("/materials", { semester_id: semesterId }),
        apiGet<any[]>("/indicators"),
        apiGet<any[]>("/grades", { semester_id: semesterId, student_id: studentId }),
      ]);

      const semester = (semesters.data || []).find((s: any) => s.id === parseInt(semesterId));
      const matIds = new Set((materials || []).map((m: any) => m.id));
      const visIndicators = (indicators || []).filter((i: any) => matIds.has(i.material_id));

      const gradeMap = new Map<string, number>();
      (grades || []).forEach((g: any) => gradeMap.set(g.indicator_kode, parseFloat(g.nilai)));

      const pdfMaterials = (materials || [])
        .sort((a: any, b: any) => (a.urutan || 0) - (b.urutan || 0))
        .map((m: any) => ({
          id: m.id,
          judul: m.judul,
          kode_rapor: m.kode_rapor,
          nama_mapel: m.nama_mapel,
          catatan: m.catatan ?? null,
          indicators: visIndicators
            .filter((i: any) => i.material_id === m.id)
            .sort((a: any, b: any) => (a.urutan || 0) - (b.urutan || 0))
            .map((i: any) => ({
              id: i.id, kode: i.kode, deskripsi: i.deskripsi,
              nilai_max: parseFloat(i.nilai_max),
              nilai: gradeMap.has(i.kode) ? gradeMap.get(i.kode)! : null,
            })),
        }));

      const photoUrl = studentPhotoUrl(student?.photo);
      const photoDataUrl = await urlToDataUrl(photoUrl);

      setPdfData({
        student: {
          nama: student?.nama || "",
          email: student?.email || "",
          linkedin: student?.linkedin,
          photoDataUrl,
          nama_kelas: student?.nama_kelas,
        },
        semester: {
          nama_semester: semester?.nama_semester || "",
          tahun_ajaran: semester?.tahun_ajaran || "",
        },
        materials: pdfMaterials,
        schoolName: "SMP IDN Boarding School",
      });
    } catch (e) {
      console.error(e);
    } finally {
      setBuilding(false);
    }
  }

  const studentName = useMemo(() => {
    return (students.data?.items || []).find((s) => s.id === parseInt(studentId))?.nama || "siswa";
  }, [students.data, studentId]);

  const fileName = `${studentName}-${(semesters.data || []).find((s: any) => s.id === parseInt(semesterId))?.nama_semester || "rapor"}.pdf`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Rapor PDF</h1>
        <p className="text-sm text-muted-foreground">Preview & download rapor digital presisi A4.</p>
      </div>

      <Card className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div className="space-y-2">
          <Label>Semester</Label>
          <Select value={semesterId} onValueChange={setSemesterId}>
            <SelectTrigger><SelectValue placeholder="Semester" /></SelectTrigger>
            <SelectContent>
              {(semesters.data || []).map((s: any) => <SelectItem key={s.id} value={String(s.id)}>{s.nama_semester}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Kelas</Label>
          <Select value={classId} onValueChange={(v) => { setClassId(v); setStudentId(""); }}>
            <SelectTrigger><SelectValue placeholder="Kelas" /></SelectTrigger>
            <SelectContent>
              {(classes.data || []).map((k: any) => <SelectItem key={k.id} value={String(k.id)}>{k.nama_kelas}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Siswa</Label>
          <Select value={studentId} onValueChange={setStudentId} disabled={!classId}>
            <SelectTrigger><SelectValue placeholder="Pilih siswa" /></SelectTrigger>
            <SelectContent>
              {(students.data?.items || []).map((s: any) => <SelectItem key={s.id} value={String(s.id)}>{s.nama}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={buildReport} disabled={!studentId || building}>
          {building ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
          Generate Preview
        </Button>
      </Card>

      {pdfData && PDFDownloadLink && (
        <div className="flex justify-end">
          <PDFDownloadLink document={<StudentReportPdf data={pdfData} />} fileName={fileName}>
            {({ loading }: { loading: boolean }) => (
              <Button variant="default">
                <Download className="h-4 w-4 mr-2" />
                {loading ? "Menyiapkan..." : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      )}

      {pdfData && PDFViewer ? (
        <Card className="overflow-hidden p-0 h-[80vh]">
          <PDFViewer style={{ width: "100%", height: "100%", border: 0 }} showToolbar>
            <StudentReportPdf data={pdfData} />
          </PDFViewer>
        </Card>
      ) : (
        <Card className="p-12 text-center text-muted-foreground">
          {building ? "Menyiapkan rapor..." : "Pilih semester, kelas, siswa lalu klik Generate Preview."}
        </Card>
      )}
    </div>
  );
}
