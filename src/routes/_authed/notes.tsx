import { createFileRoute } from "@tanstack/react-router"; 
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApiData } from "@/hooks/use-api-data";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { useAuth } from "@/stores/auth-store";
import { CabangBadge } from "@/components/CabangBadge";
import { CABANG_LIST, CABANG_LABEL, type Cabang } from "@/lib/cabang";
import { toast } from "sonner";
import {
  Pencil,
  Plus,
  Trash2,
  AlertCircle,
  RefreshCw,
  Info,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/_authed/notes")({
  component: NotesPage,
});

interface Note {
  id: number;
  student_id: number;
  semester_id: number;
  teacher_id: number;
  catatan: string;
  student_name?: string;
  teacher_name?: string;
  tahun_ajaran?: string;
  semester_number?: number;
  created_at?: string;
  updated_at?: string;
}

interface Student {
  id: number;
  nama: string;
  class_id: number;
  nama_kelas?: string;
  cabang?: string;
}

interface Klass {
  id: number;
  nama_kelas: string;
  cabang: string;
}

function NotesPage() {
  const { user } = useAuth();
  // ── Pola identik dengan students.tsx ────────────────────────────────────
  const isGuru = user?.role === "guru";
  const guruCabang = user?.cabang ?? null; // string enum, mis. "jonggol"

  // ── Filter state ─────────────────────────────────────────────────────────
  const [semesterId, setSemesterId]     = useState<string>("all");
  const [cabangFilter, setCabangFilter] = useState<string>("all");
  const [classFilter, setClassFilter]   = useState<string>("all");

  // ── Build params API — sama persis pola students.tsx ────────────────────
  // Untuk /notes, /students, /classes: kirim cabang sebagai string enum
  const cabangParam: string | null = isGuru
    ? guruCabang                                      // guru: paksa cabang dari token
    : (cabangFilter !== "all" ? cabangFilter : null); // admin: opsional dari filter

  // Params untuk fetch notes
  const notesParams: Record<string, unknown> = {};
  if (cabangParam) notesParams.cabang = cabangParam;
  if (semesterId !== "all") notesParams.semester_id = semesterId;

  // Params untuk fetch students & classes (sama, tanpa semester)
  const listParams: Record<string, unknown> = {};
  if (cabangParam) listParams.cabang = cabangParam;

  // ── Data fetch ────────────────────────────────────────────────────────────
  const semesters = useApiData<any[]>("/semesters");
  const classesData = useApiData<Klass[]>("/classes", listParams);
  const studentsData = useApiData<{ items: Student[]; pagination?: any }>(
    "/students",
    { per_page: "all", ...listParams }
  );
  const {
    data: rawNotesData,
    loading: notesLoading,
    reload,
    error: notesError,
  } = useApiData<any>("/notes", notesParams);

  // Reset filter kelas & page saat cabang berubah (hanya admin)
  useEffect(() => {
    if (!isGuru) setClassFilter("all");
  }, [cabangFilter, isGuru]);

  // Reset semester/class filter saat cabang berubah
  useEffect(() => {
    setSemesterId("all");
  }, [cabangParam]);

  // ── Teacher ID dari user login ────────────────────────────────────────────
  const [teacherId, setTeacherId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const params: Record<string, unknown> = {};
        if (cabangParam) params.cabang = cabangParam;
        const res = await apiGet<any[]>("/teachers", params);
        const rows = Array.isArray(res) ? res : [];
        const teacher =
          rows.find((t: any) => Number(t.user_id) === Number(user.id)) ??
          (rows.length > 0 ? rows[0] : null);
        if (teacher?.id) setTeacherId(Number(teacher.id));
      } catch (err) {
        console.error("Failed to fetch teacher:", err);
      }
    })();
  }, [user, cabangParam]);

  // ── Normalize data ────────────────────────────────────────────────────────
  const notesData = useMemo<Note[]>(() => {
    if (!rawNotesData) return [];
    if (Array.isArray(rawNotesData)) return rawNotesData;
    if (rawNotesData.data && Array.isArray(rawNotesData.data)) return rawNotesData.data;
    return [];
  }, [rawNotesData]);

  const allStudents = useMemo<Student[]>(() => {
    const raw = studentsData.data;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (raw.items && Array.isArray(raw.items)) return raw.items;
    return [];
  }, [studentsData.data]);

  const studentMap = useMemo(() => {
    const m = new Map<number, Student>();
    allStudents.forEach((s) => m.set(s.id, s));
    return m;
  }, [allStudents]);

  // ── Filter lokal per kelas ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let rows = notesData;
    if (classFilter !== "all") {
      rows = rows.filter((n) => {
        const s = studentMap.get(n.student_id);
        return s && String(s.class_id) === classFilter;
      });
    }
    return rows;
  }, [notesData, classFilter, studentMap]);

  // ── Form state ────────────────────────────────────────────────────────────
  const [open, setOpen]             = useState(false);
  const [editing, setEditing]       = useState<Note | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);
  const [form, setForm]             = useState({ student_id: "", semester_id: "", catatan: "" });
  const [saving, setSaving]         = useState(false);
  const [deleting, setDeleting]     = useState(false);

  function openNew() {
    setEditing(null);
    setForm({
      student_id: "",
      semester_id: semesterId !== "all" ? semesterId : "",
      catatan: "",
    });
    setOpen(true);
  }

  function openEdit(n: Note) {
    setEditing(n);
    setForm({
      student_id: String(n.student_id),
      semester_id: String(n.semester_id),
      catatan: n.catatan || "",
    });
    setOpen(true);
  }

  // Siswa yang tampil di dropdown form: filter per kelas aktif
  const studentsForForm = useMemo(() => {
    if (classFilter === "all") return allStudents;
    return allStudents.filter((s) => String(s.class_id) === classFilter);
  }, [allStudents, classFilter]);

  async function save() {
    if (!form.student_id || !form.semester_id || !form.catatan.trim()) {
      toast.error("Lengkapi siswa, semester, dan catatan");
      return;
    }
    if (!teacherId) {
      toast.error("Data guru tidak ditemukan untuk akun ini");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        student_id: parseInt(form.student_id),
        semester_id: parseInt(form.semester_id),
        teacher_id: teacherId,
        catatan: form.catatan.trim(),
      };
      if (editing) {
        await apiPut(`/notes/${editing.id}`, payload);
        toast.success("Catatan berhasil diupdate");
      } else {
        await apiPost("/notes", payload);
        toast.success("Catatan berhasil ditambahkan");
      }
      setOpen(false);
      reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Gagal menyimpan catatan");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiDelete(`/notes/${deleteTarget.id}`);
      toast.success("Catatan berhasil dihapus");
      setDeleteTarget(null);
      reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Gagal menghapus catatan");
    } finally {
      setDeleting(false);
    }
  }

  // ── Loading state ─────────────────────────────────────────────────────────
  if (semesters.loading || classesData.loading || studentsData.loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (notesError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Catatan Siswa</h1>
          <p className="text-sm text-muted-foreground">Kelola catatan perkembangan siswa per semester</p>
        </div>
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Gagal Memuat Data</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {(typeof notesError === "string" ? notesError : (notesError as any)?.message) ||
              "Terjadi kesalahan saat menghubungi server"}
          </p>
          <div className="space-x-2">
            <Button onClick={() => window.location.reload()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Halaman
            </Button>
            <Button onClick={() => reload()}>Coba Lagi</Button>
          </div>
        </Card>
      </div>
    );
  }

  // ── Render utama ──────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Catatan Siswa</h1>
          <p className="text-sm text-muted-foreground">
            {isGuru && guruCabang
              ? `Menampilkan catatan cabang ${CABANG_LABEL[guruCabang as Cabang] ?? guruCabang}`
              : "Kelola catatan perkembangan siswa per semester"}
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Catatan
        </Button>
      </div>

      {/* Info banner untuk guru — identik dengan students.tsx */}
      {isGuru && guruCabang && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
          <Info className="h-4 w-4 flex-shrink-0" />
          <span>
            Anda login sebagai <strong>Guru</strong>. Hanya catatan siswa dari cabang{" "}
            <strong>{CABANG_LABEL[guruCabang as Cabang] ?? guruCabang}</strong> yang ditampilkan.
          </span>
        </div>
      )}

      {/* Filter */}
      <Card className="p-4 flex flex-wrap gap-3">
        {/* Filter Semester */}
        <Select value={semesterId} onValueChange={setSemesterId}>
          <SelectTrigger className="w-[260px]">
            <SelectValue placeholder="Pilih Semester" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            <SelectItem value="all">Semua Semester</SelectItem>
            {(Array.isArray(semesters.data) ? semesters.data : []).map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.nama_semester || `${s.tahun_ajaran} - Semester ${s.semester}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter Cabang — hanya admin/superadmin */}
        {!isGuru && (
          <Select
            value={cabangFilter}
            onValueChange={(v) => {
              setCabangFilter(v);
              setClassFilter("all");
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Semua Cabang" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              <SelectItem value="all">Semua Cabang</SelectItem>
              {CABANG_LIST.map((c) => (
                <SelectItem key={c} value={c}>
                  {CABANG_LABEL[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Filter Kelas */}
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Semua Kelas" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            <SelectItem value="all">Semua Kelas</SelectItem>
            {(Array.isArray(classesData.data) ? classesData.data : []).map((k) => (
              <SelectItem key={k.id} value={String(k.id)}>
                {k.nama_kelas}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {/* Tabel */}
      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Siswa</TableHead>
              <TableHead>Kelas</TableHead>
              {!isGuru && <TableHead>Cabang</TableHead>}
              <TableHead>Semester</TableHead>
              <TableHead>Catatan</TableHead>
              <TableHead>Guru</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notesLoading && (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={isGuru ? 6 : 7}>
                    <div className="h-8 bg-muted animate-pulse rounded" />
                  </TableCell>
                </TableRow>
              ))
            )}
            {!notesLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={isGuru ? 6 : 7}
                  className="text-center py-10 text-muted-foreground"
                >
                  Belum ada catatan untuk filter yang dipilih.
                </TableCell>
              </TableRow>
            )}
            {!notesLoading &&
              filtered.map((n: Note) => {
                const student = studentMap.get(n.student_id);
                return (
                  <TableRow key={n.id}>
                    <TableCell className="font-medium capitalize">
                      {n.student_name || student?.nama || `ID: ${n.student_id}`}
                    </TableCell>
                    <TableCell className="text-sm">
                      {student?.nama_kelas || "—"}
                    </TableCell>
                    {!isGuru && (
                      <TableCell>
                        <CabangBadge cabang={(student?.cabang as Cabang) ?? null} />
                      </TableCell>
                    )}
                    <TableCell className="text-sm">
                      {n.tahun_ajaran && n.semester_number
                        ? `${n.tahun_ajaran} - Semester ${n.semester_number}`
                        : `Semester ID: ${n.semester_id}`}
                    </TableCell>
                    <TableCell className="max-w-xs whitespace-pre-wrap break-words text-sm">
                      {n.catatan}
                    </TableCell>
                    <TableCell className="text-sm capitalize">
                      {n.teacher_name || `Guru ID: ${n.teacher_id}`}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(n)}
                          title="Edit catatan"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(n)}
                          title="Hapus catatan"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Card>

      {/* ── Dialog Tambah / Edit ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Catatan" : "Tambah Catatan Baru"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Siswa */}
            <div className="space-y-2">
              <Label>
                Siswa <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.student_id}
                onValueChange={(v) => setForm({ ...form, student_id: v })}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih siswa" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {studentsForForm.length === 0 && (
                    <SelectItem value="_empty" disabled>
                      Tidak ada siswa tersedia
                    </SelectItem>
                  )}
                  {studentsForForm.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.nama} {s.nama_kelas ? `(${s.nama_kelas})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Semester */}
            <div className="space-y-2">
              <Label>
                Semester <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.semester_id}
                onValueChange={(v) => setForm({ ...form, semester_id: v })}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih semester" />
                </SelectTrigger>
                <SelectContent>
                  {(Array.isArray(semesters.data) ? semesters.data : []).map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.nama_semester || `${s.tahun_ajaran} - Semester ${s.semester}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Catatan */}
            <div className="space-y-2">
              <Label>
                Catatan <span className="text-destructive">*</span>
              </Label>
              <Textarea
                rows={6}
                value={form.catatan}
                onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                placeholder="Tulis catatan untuk siswa..."
                className="resize-none"
                disabled={saving}
              />
              <p className="text-xs text-muted-foreground">{form.catatan.length} karakter</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Batal
            </Button>
            <Button
              onClick={save}
              disabled={
                !form.student_id || !form.semester_id || !form.catatan.trim() || saving
              }
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Konfirmasi Hapus ── */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Catatan?</AlertDialogTitle>
            <AlertDialogDescription>
              Catatan siswa{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.student_name || `ID: ${deleteTarget?.student_id}`}
              </span>{" "}
              akan dihapus dari sistem. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
