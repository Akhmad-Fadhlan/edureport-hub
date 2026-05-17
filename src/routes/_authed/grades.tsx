import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApiData } from "@/hooks/use-api-data";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

export const Route = createFileRoute("/_authed/grades")({
  component: GradesPage,
});

interface Indicator { id: number; material_id: number; kode: string; deskripsi: string; nilai_max: string; material_judul?: string; kode_rapor?: string }
interface Grade {
  id: number; nilai: string; student_id: number; indicator_kode: string;
  indicator_id?: number; nilai_max: string;
}

function GradesPage() {
  const { user, isGuru } = useAuth();
  const guruCabang = isGuru() ? (user?.cabang ?? null) : null;
  const baseParams: any = guruCabang ? { cabang: guruCabang } : {};

  const semesters = useApiData<any[]>("/semesters");
  const classes = useApiData<any[]>("/classes", baseParams);
  const [semesterId, setSemesterId] = useState<string>("");
  const [classId, setClassId] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");

  // set initial active semester
  useEffect(() => {
    if (!semesterId && semesters.data) {
      const active = semesters.data.find((s: any) => s.is_active === 1);
      if (active) setSemesterId(String(active.id));
    }
  }, [semesters.data, semesterId]);

  const studentParams: any = { per_page: 200, ...baseParams };
  if (classId) studentParams.class_id = classId;
  const students = useApiData<{ items: any[] }>(classId ? "/students" : null, studentParams);

  const materials = useApiData<any[]>(semesterId ? "/materials" : null, { semester_id: semesterId });
  const materialIds = useMemo(() => new Set((materials.data || []).map((m: any) => m.id)), [materials.data]);
  const indicators = useApiData<Indicator[]>("/indicators");

  const visibleIndicators = useMemo(
    () => (indicators.data || []).filter((i) => materialIds.has(i.material_id)),
    [indicators.data, materialIds],
  );

  const gradeParams: any = {};
  if (semesterId) gradeParams.semester_id = semesterId;
  if (studentId) gradeParams.student_id = studentId;
  const grades = useApiData<Grade[]>(studentId ? "/grades" : null, gradeParams);

  const [values, setValues] = useState<Record<number, string>>({});
  const [savingIds, setSavingIds] = useState<Record<number, boolean>>({});
  const debounceRef = useRef<Record<number, any>>({});

  useEffect(() => {
    const map: Record<number, string> = {};
    (grades.data || []).forEach((g) => {
      // match by indicator code
      const ind = visibleIndicators.find((i) => i.kode === g.indicator_kode);
      if (ind) map[ind.id] = g.nilai;
    });
    setValues(map);
  }, [grades.data, visibleIndicators]);

  function onChangeValue(ind: Indicator, raw: string) {
    let v = raw.replace(/[^0-9.]/g, "");
    if (v !== "" && parseFloat(v) > parseFloat(ind.nilai_max)) {
      toast.error(`Nilai maksimum ${ind.nilai_max}`);
      v = ind.nilai_max;
    }
    setValues((prev) => ({ ...prev, [ind.id]: v }));
    if (debounceRef.current[ind.id]) clearTimeout(debounceRef.current[ind.id]);
    debounceRef.current[ind.id] = setTimeout(() => saveOne(ind, v), 700);
  }

  async function saveOne(ind: Indicator, val: string) {
    if (val === "" || !studentId || !semesterId) return;
    setSavingIds((p) => ({ ...p, [ind.id]: true }));
    try {
      await apiPost("/grades", {
        student_id: parseInt(studentId),
        indicator_id: ind.id,
        semester_id: parseInt(semesterId),
        nilai: parseFloat(val),
      });
    } catch (e: any) {
      toast.error(e?.response?.data?.message || `Gagal simpan ${ind.kode}`);
    } finally {
      setSavingIds((p) => ({ ...p, [ind.id]: false }));
    }
  }

  async function saveAll() {
    if (!studentId || !semesterId) return;
    let ok = 0, fail = 0;
    for (const ind of visibleIndicators) {
      const v = values[ind.id];
      if (v === undefined || v === "") continue;
      try {
        await apiPost("/grades", {
          student_id: parseInt(studentId), indicator_id: ind.id,
          semester_id: parseInt(semesterId), nilai: parseFloat(v),
        });
        ok++;
      } catch { fail++; }
    }
    toast.success(`Tersimpan ${ok} nilai${fail ? `, gagal ${fail}` : ""}`);
  }

  // Group indicators by material
  const grouped = useMemo(() => {
    const map = new Map<number, { material: any; items: Indicator[] }>();
    visibleIndicators.forEach((i) => {
      const mat = (materials.data || []).find((m: any) => m.id === i.material_id);
      if (!map.has(i.material_id)) map.set(i.material_id, { material: mat, items: [] });
      map.get(i.material_id)!.items.push(i);
    });
    return Array.from(map.values());
  }, [visibleIndicators, materials.data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Input Nilai</h1>
          <p className="text-sm text-muted-foreground">Input nilai indikator per siswa. Tersimpan otomatis.</p>
        </div>
        {studentId && <Button onClick={saveAll}><Save className="h-4 w-4 mr-2" />Simpan Semua</Button>}
      </div>

      <Card className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label>Semester</Label>
          <Select value={semesterId} onValueChange={setSemesterId}>
            <SelectTrigger><SelectValue placeholder="Pilih semester" /></SelectTrigger>
            <SelectContent>
              {(semesters.data || []).map((s: any) => <SelectItem key={s.id} value={String(s.id)}>{s.nama_semester}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Kelas</Label>
          <Select value={classId} onValueChange={(v) => { setClassId(v); setStudentId(""); }}>
            <SelectTrigger><SelectValue placeholder="Pilih kelas" /></SelectTrigger>
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
      </Card>

      {!studentId && <Card className="p-12 text-center text-muted-foreground">Pilih semester, kelas, dan siswa untuk mulai input nilai.</Card>}

      {studentId && grouped.length === 0 && <Card className="p-8 text-center text-muted-foreground">Belum ada materi/indikator untuk semester ini.</Card>}

      {studentId && grouped.map(({ material, items }) => (
        <Card key={material?.id} className="p-0 overflow-hidden">
          <div className="px-5 py-3 bg-secondary border-b flex items-center justify-between">
            <div>
              <div className="font-semibold">{material?.judul}</div>
              <div className="text-xs text-muted-foreground">{material?.nama_mapel} • {material?.kode_rapor}</div>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Kode</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="w-24 text-right">Maks</TableHead>
                <TableHead className="w-32 text-right">Nilai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((ind) => (
                <TableRow key={ind.id}>
                  <TableCell className="font-mono text-xs">{ind.kode}</TableCell>
                  <TableCell className="text-sm">{ind.deskripsi}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{ind.nilai_max}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {savingIds[ind.id] && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                      <Input
                        type="number" step="0.1" min={0} max={parseFloat(ind.nilai_max)}
                        className="w-20 text-right"
                        value={values[ind.id] ?? ""}
                        onChange={(e) => onChangeValue(ind, e.target.value)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ))}
    </div>
  );
}
