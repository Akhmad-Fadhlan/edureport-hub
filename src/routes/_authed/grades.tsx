import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useApiData } from "@/hooks/use-api-data";
import { apiPost } from "@/lib/api";
import { useAuth } from "@/stores/auth-store";
import { toast } from "sonner";
import {
  Loader2, Save, Upload, Download, FileSpreadsheet,
  CheckCircle2, AlertCircle, X,
} from "lucide-react";

export const Route = createFileRoute("/_authed/grades")({
  component: GradesPage,
});

/* ─── Types ─────────────────────────────────────────────────────────────── */

interface Indicator {
  id: number;
  material_id: number;
  kode: string;
  deskripsi: string;
  nilai_max: string;
  material_judul?: string;
  kode_rapor?: string;
}

interface Grade {
  id: number;
  nilai: string;
  student_id: number;
  indicator_kode: string;
  indicator_id?: number;
  nilai_max: string;
}

interface ImportRow {
  kode_indikator: string;
  nilai: string | number;
  deskripsi?: string;
  status: "ok" | "error" | "warning";
  message?: string;
}

/* ─── CSV helpers ────────────────────────────────────────────────────────── */

/** Escape a single CSV cell value */
function csvCell(v: string | number | null | undefined): string {
  const s = String(v ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/** Serialize a 2-D array to CSV string */
function toCsv(rows: (string | number | null | undefined)[][]): string {
  return rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}

/** Parse a single CSV line, respecting quoted fields */
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

/** Parse full CSV text into a 2-D array of strings */
function parseCsvText(text: string): string[][] {
  // Normalize line endings
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  return lines.map(parseCsvLine);
}

/* ─── Download template as CSV ───────────────────────────────────────────── */

function downloadTemplate(
  indicators: Indicator[],
  materials: any[],
  studentName: string,
) {
  const rows: (string | number)[][] = [
    ["TEMPLATE IMPORT NILAI"],
    ["Siswa:", studentName || "(pilih siswa)"],
    [],
    ["kode_indikator", "deskripsi", "materi", "nilai_max", "nilai"],
  ];

  for (const ind of indicators) {
    const mat = materials.find((m: any) => m.id === ind.material_id);
    rows.push([ind.kode, ind.deskripsi, mat?.judul ?? "", ind.nilai_max, ""]);
  }

  const csv = toCsv(rows);
  const bom = "\uFEFF"; // UTF-8 BOM so Excel opens it correctly
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `template_nilai_${(studentName || "siswa").replace(/\s+/g, "_")}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ─── Parse uploaded CSV file ────────────────────────────────────────────── */

function parseImportFile(
  file: File,
  indicators: Indicator[],
  callback: (rows: ImportRow[]) => void,
) {
  const reader = new FileReader();

  reader.onload = (e) => {
    const raw = e.target?.result;
    if (typeof raw !== "string") {
      toast.error("Gagal membaca file.");
      callback([]);
      return;
    }

    // Strip BOM if present
    const text = raw.startsWith("\uFEFF") ? raw.slice(1) : raw;
    const rawRows = parseCsvText(text);

    // Find the header row (the row containing "kode_indikator")
    let headerIdx = -1;
    for (let i = 0; i < rawRows.length; i++) {
      const lower = rawRows[i].map((c) => c.toLowerCase().trim());
      if (lower.includes("kode_indikator")) { headerIdx = i; break; }
    }

    if (headerIdx === -1) {
      toast.error("Format tidak valid. Pastikan ada kolom 'kode_indikator'.");
      callback([]);
      return;
    }

    const headers = rawRows[headerIdx].map((c) => c.toLowerCase().trim());
    const kodeIdx   = headers.indexOf("kode_indikator");
    const nilaiIdx  = headers.indexOf("nilai");
    const deskIdx   = headers.indexOf("deskripsi");

    if (nilaiIdx === -1) {
      toast.error("Kolom 'nilai' tidak ditemukan.");
      callback([]);
      return;
    }

    const indMap = new Map(
      indicators.map((i) => [i.kode.toLowerCase().trim(), i]),
    );
    const result: ImportRow[] = [];

    for (let i = headerIdx + 1; i < rawRows.length; i++) {
      const row      = rawRows[i];
      const kode     = (row[kodeIdx]  ?? "").trim();
      const nilaiRaw = (row[nilaiIdx] ?? "").trim();
      const deskripsi = deskIdx >= 0 ? (row[deskIdx] ?? "").trim() : undefined;

      if (!kode) continue; // skip blank rows

      const ind = indMap.get(kode.toLowerCase());
      if (!ind) {
        result.push({ kode_indikator: kode, nilai: nilaiRaw, deskripsi, status: "error", message: "Kode indikator tidak ditemukan" });
        continue;
      }

      if (nilaiRaw === "") {
        result.push({ kode_indikator: kode, nilai: "", deskripsi, status: "warning", message: "Nilai kosong, akan dilewati" });
        continue;
      }

      const num = parseFloat(nilaiRaw);
      if (isNaN(num)) {
        result.push({ kode_indikator: kode, nilai: nilaiRaw, deskripsi, status: "error", message: "Nilai bukan angka" });
        continue;
      }
      if (num < 0) {
        result.push({ kode_indikator: kode, nilai: num, deskripsi, status: "error", message: "Nilai tidak boleh negatif" });
        continue;
      }
      if (num > parseFloat(ind.nilai_max)) {
        result.push({ kode_indikator: kode, nilai: num, deskripsi, status: "error", message: `Melebihi nilai maks (${ind.nilai_max})` });
        continue;
      }

      result.push({ kode_indikator: kode, nilai: num, deskripsi, status: "ok" });
    }

    callback(result);
  };

  reader.readAsText(file, "UTF-8");
}

/* ─── Small UI atoms ─────────────────────────────────────────────────────── */

function StepBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex-shrink-0">
      {children}
    </span>
  );
}

function Pill({ color, children }: { color: "green" | "yellow" | "red"; children: React.ReactNode }) {
  const cls = { green: "bg-green-100 text-green-700", yellow: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700" }[color];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}

/* ─── Import Dialog ──────────────────────────────────────────────────────── */

function ImportDialog({
  open, onClose,
  indicators, materials,
  studentName, semesterId, studentId,
  onImportDone,
}: {
  open: boolean;
  onClose: () => void;
  indicators: Indicator[];
  materials: any[];
  studentName: string;
  semesterId: string;
  studentId: string;
  onImportDone: (updated: Record<number, string>) => void;
}) {
  const [importRows, setImportRows] = useState<ImportRow[]>([]);
  const [importing, setImporting]   = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (open) setImportRows([]); }, [open]);

  const okCount   = importRows.filter((r) => r.status === "ok").length;
  const errCount  = importRows.filter((r) => r.status === "error").length;
  const warnCount = importRows.filter((r) => r.status === "warning").length;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    parseImportFile(file, indicators, setImportRows);
    e.target.value = "";
  }

  async function handleImport() {
    if (!studentId || !semesterId) return;
    const validRows = importRows.filter((r) => r.status === "ok");
    if (!validRows.length) { toast.error("Tidak ada data valid untuk diimport."); return; }

    setImporting(true);
    const indMap = new Map(indicators.map((i) => [i.kode.toLowerCase().trim(), i]));
    let ok = 0, fail = 0;
    const newValues: Record<number, string> = {};

    for (const row of validRows) {
      const ind = indMap.get(row.kode_indikator.toLowerCase());
      if (!ind) continue;
      try {
        await apiPost("/grades", {
          student_id:   parseInt(studentId),
          indicator_id: ind.id,
          semester_id:  parseInt(semesterId),
          nilai:        parseFloat(String(row.nilai)),
        });
        newValues[ind.id] = String(row.nilai);
        ok++;
      } catch { fail++; }
    }

    toast.success(`Import selesai: ${ok} nilai berhasil${fail ? `, ${fail} gagal` : ""}`);
    onImportDone(newValues);
    setImporting(false);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col gap-0 p-0">

        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-base">
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            Import Nilai dari Excel / CSV
          </DialogTitle>
          <DialogDescription className="text-xs">
            Siswa: <span className="font-medium text-foreground">{studentName}</span>
            {" · "}{indicators.length} indikator tersedia
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">

          {/* Step 1 – Download template */}
          <div className="rounded-lg border bg-card p-4 space-y-2.5">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <StepBadge>1</StepBadge>Download Template
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Template CSV berisi semua kode indikator aktif. Buka dengan Excel / Google Sheets,
              isi kolom{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[11px]">nilai</code>
              {" "}lalu simpan sebagai <strong>.csv</strong>.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-green-700 border-green-200 hover:bg-green-50"
              onClick={() => downloadTemplate(indicators, materials, studentName)}
            >
              <Download className="h-3.5 w-3.5" />
              Download Template (.csv)
            </Button>
          </div>

          {/* Step 2 – Upload */}
          <div className="rounded-lg border bg-card p-4 space-y-2.5">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <StepBadge>2</StepBadge>Upload File yang Sudah Diisi
            </p>
            <div
              className="border-2 border-dashed rounded-lg p-5 text-center cursor-pointer hover:border-primary hover:bg-accent/20 transition-colors group"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-7 w-7 mx-auto mb-1.5 text-muted-foreground group-hover:text-primary transition-colors" />
              <p className="text-sm font-medium">Klik untuk memilih file</p>
              <p className="text-xs text-muted-foreground mt-0.5">Format: .csv</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Step 3 – Preview */}
          {importRows.length > 0 && (
            <div className="rounded-lg border bg-card p-4 space-y-3">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <StepBadge>3</StepBadge>Preview &amp; Konfirmasi
              </p>

              <div className="flex gap-2 flex-wrap">
                <Pill color="green"><CheckCircle2 className="h-3 w-3" />{okCount} siap import</Pill>
                {warnCount > 0 && <Pill color="yellow"><AlertCircle className="h-3 w-3" />{warnCount} dilewati</Pill>}
                {errCount  > 0 && <Pill color="red"><X className="h-3 w-3" />{errCount} error</Pill>}
              </div>

              <div className="rounded border overflow-hidden max-h-52 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-28 text-xs py-2">Kode</TableHead>
                      <TableHead className="text-xs py-2">Deskripsi</TableHead>
                      <TableHead className="w-16 text-right text-xs py-2">Nilai</TableHead>
                      <TableHead className="w-44 text-xs py-2">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importRows.map((row, idx) => {
                      const ind = indicators.find(
                        (i) => i.kode.toLowerCase() === row.kode_indikator.toLowerCase(),
                      );
                      return (
                        <TableRow
                          key={idx}
                          className={
                            row.status === "error"   ? "bg-red-50/60"   :
                            row.status === "warning" ? "bg-amber-50/60" : ""
                          }
                        >
                          <TableCell className="font-mono text-xs py-1.5">{row.kode_indikator}</TableCell>
                          <TableCell className="text-xs py-1.5 text-muted-foreground">
                            {row.deskripsi || ind?.deskripsi || "-"}
                          </TableCell>
                          <TableCell className="text-right text-xs py-1.5 font-medium">
                            {row.nilai === "" ? <span className="text-muted-foreground">—</span> : row.nilai}
                          </TableCell>
                          <TableCell className="text-xs py-1.5">
                            {row.status === "ok" && (
                              <span className="inline-flex items-center gap-1 text-green-600">
                                <CheckCircle2 className="h-3 w-3" />Valid
                              </span>
                            )}
                            {row.status === "warning" && (
                              <span className="inline-flex items-center gap-1 text-amber-600">
                                <AlertCircle className="h-3 w-3" />{row.message}
                              </span>
                            )}
                            {row.status === "error" && (
                              <span className="inline-flex items-center gap-1 text-red-600">
                                <X className="h-3 w-3" />{row.message}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t bg-muted/20">
          <Button variant="outline" onClick={onClose} disabled={importing}>Batal</Button>
          <Button onClick={handleImport} disabled={importing || okCount === 0}>
            {importing
              ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Mengimport...</>
              : <><Upload className="h-4 w-4 mr-2" />Import {okCount > 0 ? `${okCount} Nilai` : ""}</>}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */

function GradesPage() {
  const { isGuru, getCabangId } = useAuth();
  const guruMode = isGuru();
  const cabangId = getCabangId();

  const semesters   = useApiData<any[]>("/semesters");
  const classParams: any = {};
  if (guruMode && cabangId) classParams.cabang_id = cabangId;
  const classes = useApiData<any[]>("/classes", classParams);

  const [semesterId, setSemesterId] = useState<string>("");
  const [classId,    setClassId]    = useState<string>("");
  const [studentId,  setStudentId]  = useState<string>("");
  const [showImport, setShowImport] = useState(false);

  // Auto-select active semester
  useEffect(() => {
    if (!semesterId && semesters.data) {
      const active = semesters.data.find((s: any) => s.is_active === 1);
      if (active) setSemesterId(String(active.id));
    }
  }, [semesters.data, semesterId]);

  const studentParams: any = { per_page: 200 };
  if (classId)              studentParams.class_id  = classId;
  if (guruMode && cabangId) studentParams.cabang_id = cabangId;
  const students = useApiData<{ items: any[] }>(classId ? "/students" : null, studentParams);

  const materials = useApiData<any[]>(semesterId ? "/materials" : null, { semester_id: semesterId });
  const materialIds = useMemo(
    () => new Set((materials.data || []).map((m: any) => m.id)),
    [materials.data],
  );
  const indicators = useApiData<Indicator[]>("/indicators");

  const visibleIndicators = useMemo(
    () => (indicators.data || []).filter((i) => materialIds.has(i.material_id)),
    [indicators.data, materialIds],
  );

  const gradeParams: any = {};
  if (semesterId) gradeParams.semester_id = semesterId;
  if (studentId)  gradeParams.student_id  = studentId;
  const grades = useApiData<Grade[]>(studentId ? "/grades" : null, gradeParams);

  const [values,    setValues]    = useState<Record<number, string>>({});
  const [savingIds, setSavingIds] = useState<Record<number, boolean>>({});
  const debounceRef = useRef<Record<number, any>>({});

  // Populate values from fetched grades
  useEffect(() => {
    const map: Record<number, string> = {};
    (grades.data || []).forEach((g) => {
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
        student_id:   parseInt(studentId),
        indicator_id: ind.id,
        semester_id:  parseInt(semesterId),
        nilai:        parseFloat(val),
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
          student_id:   parseInt(studentId),
          indicator_id: ind.id,
          semester_id:  parseInt(semesterId),
          nilai:        parseFloat(v),
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

  const selectedStudent = (students.data?.items || []).find(
    (s: any) => String(s.id) === studentId,
  );

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Input Nilai</h1>
          <p className="text-sm text-muted-foreground">Input nilai indikator per siswa. Tersimpan otomatis.</p>
        </div>
        <div className="flex items-center gap-2">
          {studentId && (
            <Button variant="outline" onClick={() => setShowImport(true)} className="gap-2">
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
              Import Excel
            </Button>
          )}
          {studentId && (
            <Button onClick={saveAll} className="gap-2">
              <Save className="h-4 w-4" />
              Simpan Semua
            </Button>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <Card className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label>Semester</Label>
          <Select value={semesterId} onValueChange={setSemesterId}>
            <SelectTrigger><SelectValue placeholder="Pilih semester" /></SelectTrigger>
            <SelectContent>
              {(semesters.data || []).map((s: any) => (
                <SelectItem key={s.id} value={String(s.id)}>{s.nama_semester}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Kelas</Label>
          <Select value={classId} onValueChange={(v) => { setClassId(v); setStudentId(""); }}>
            <SelectTrigger><SelectValue placeholder="Pilih kelas" /></SelectTrigger>
            <SelectContent>
              {(classes.data || []).map((k: any) => (
                <SelectItem key={k.id} value={String(k.id)}>{k.nama_kelas}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Siswa</Label>
          <Select value={studentId} onValueChange={setStudentId} disabled={!classId}>
            <SelectTrigger><SelectValue placeholder="Pilih siswa" /></SelectTrigger>
            <SelectContent>
              {(students.data?.items || []).map((s: any) => (
                <SelectItem key={s.id} value={String(s.id)}>{s.nama}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Empty states */}
      {!studentId && (
        <Card className="p-12 text-center text-muted-foreground">
          Pilih semester, kelas, dan siswa untuk mulai input nilai.
        </Card>
      )}
      {studentId && grouped.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">
          Belum ada materi/indikator untuk semester ini.
        </Card>
      )}

      {/* Grade tables grouped by material */}
      {studentId && grouped.map(({ material, items }) => (
        <Card key={material?.id} className="p-0 overflow-hidden">
          <div className="px-5 py-3 bg-secondary border-b">
            <div className="font-semibold">{material?.judul}</div>
            <div className="text-xs text-muted-foreground">{material?.nama_mapel} • {material?.kode_rapor}</div>
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
                      {savingIds[ind.id] && (
                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                      )}
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

      {/* Import dialog */}
      {showImport && (
        <ImportDialog
          open={showImport}
          onClose={() => setShowImport(false)}
          indicators={visibleIndicators}
          materials={materials.data || []}
          studentName={selectedStudent?.nama || ""}
          semesterId={semesterId}
          studentId={studentId}
          onImportDone={(newVals) => setValues((prev) => ({ ...prev, ...newVals }))}
        />
      )}
    </div>
  );
}
