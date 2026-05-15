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
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

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
}

function NotesPage() {
  const { user } = useAuth();
  const semesters = useApiData<any[]>("/semesters");
  const classes = useApiData<any[]>("/classes");
  const studentsData = useApiData<Student[]>("/students", { limit: 1000 });

  const [semesterId, setSemesterId] = useState<string>("all");
  const [classId, setClassId] = useState<string>("all");

  // Gunakan query params yang benar untuk filtering
  const queryParams: any = {};
  if (semesterId !== "all") queryParams.semester_id = semesterId;
  if (classId !== "all") queryParams.class_id = classId;
  
  const { data, loading, reload } = useApiData<Note[]>("/notes", queryParams);

  const [teacherId, setTeacherId] = useState<number | null>(null);
  
  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        // Ambil teacher berdasarkan user_id dari endpoint teachers
        const res = await apiGet<any[] | { items?: any[] }>("/teachers");
        const rows = Array.isArray(res) ? res : (res.items ?? []);
        // Cari teacher yang sesuai dengan user yang login
        const teacher = rows.find((t: any) => Number(t.user_id) === Number(user.id));
        if (teacher?.id) {
          setTeacherId(Number(teacher.id));
        } else if (rows.length > 0) {
          // Fallback ke teacher pertama jika tidak ditemukan
          setTeacherId(Number(rows[0].id));
        }
      } catch (error) {
        console.error("Failed to fetch teacher:", error);
      }
    })();
  }, [user]);

  const studentMap = useMemo(() => {
    const m = new Map<number, Student>();
    (studentsData.data || []).forEach((s) => m.set(s.id, s));
    return m;
  }, [studentsData.data]);

  // Filtering berdasarkan class dilakukan di frontend karena API mungkin tidak support
  const filtered = useMemo(() => {
    let rows = data || [];
    if (classId !== "all") {
      rows = rows.filter((n) => {
        const s = studentMap.get(n.student_id);
        return s && String(s.class_id) === classId;
      });
    }
    return rows;
  }, [data, classId, studentMap]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [form, setForm] = useState({ student_id: "", semester_id: "", catatan: "" });

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

  async function save() {
    // Validasi input
    if (!form.student_id || !form.semester_id || !form.catatan.trim()) {
      toast.error("Lengkapi siswa, semester, dan catatan");
      return;
    }
    
    if (!teacherId) {
      toast.error("Data guru tidak ditemukan untuk akun ini");
      return;
    }
    
    try {
      const payload = {
        student_id: parseInt(form.student_id),
        semester_id: parseInt(form.semester_id),
        teacher_id: teacherId,
        catatan: form.catatan.trim(),
      };
      
      if (editing) {
        // PUT update - hanya kirim field yang diupdate
        await apiPut(`/notes/${editing.id}`, { catatan: payload.catatan });
        toast.success("Catatan berhasil diupdate");
      } else {
        // POST create
        await apiPost("/notes", payload);
        toast.success("Catatan berhasil ditambahkan");
      }
      
      setOpen(false);
      reload(); // Reload data setelah save
    } catch (e: any) {
      const errorMsg = e?.response?.data?.message || e?.message || "Gagal menyimpan catatan";
      toast.error(errorMsg);
      console.error("Save error:", e);
    }
  }

  async function del(id: number) {
    if (!confirm("Apakah Anda yakin ingin menghapus catatan ini?")) return;
    
    try {
      await apiDelete(`/notes/${id}`);
      toast.success("Catatan berhasil dihapus");
      reload();
    } catch (e: any) {
      const errorMsg = e?.response?.data?.message || e?.message || "Gagal menghapus catatan";
      toast.error(errorMsg);
      console.error("Delete error:", e);
    }
  }

  const filteredStudentsForForm = useMemo(() => {
    const list = studentsData.data || [];
    if (classId === "all") return list;
    return list.filter((s) => String(s.class_id) === classId);
  }, [studentsData.data, classId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Catatan Siswa</h1>
          <p className="text-sm text-muted-foreground">
            Kelola catatan perkembangan siswa per semester
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Catatan
        </Button>
      </div>

      <Card className="p-4 flex flex-wrap gap-3">
        <Select value={semesterId} onValueChange={setSemesterId}>
          <SelectTrigger className="w-[260px]">
            <SelectValue placeholder="Pilih Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Semester</SelectItem>
            {(semesters.data || []).map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.nama_semester || `${s.tahun_ajaran} - Semester ${s.semester}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={classId} onValueChange={setClassId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Pilih Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kelas</SelectItem>
            {(classes.data || []).map((k) => (
              <SelectItem key={k.id} value={String(k.id)}>
                {k.nama_kelas}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Siswa</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Catatan</TableHead>
              <TableHead>Guru</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Memuat data...
                  </div>
                </TableCell>
              </TableRow>
            )}
            
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Belum ada catatan untuk filter yang dipilih
                </TableCell>
              </TableRow>
            )}
            
            {!loading && filtered.map((n) => {
              const student = studentMap.get(n.student_id);
              return (
                <TableRow key={n.id}>
                  <TableCell className="font-medium capitalize">
                    {n.student_name || student?.nama || `ID: ${n.student_id}`}
                  </TableCell>
                  <TableCell>{student?.nama_kelas || "-"}</TableCell>
                  <TableCell>
                    {n.tahun_ajaran && n.semester_number
                      ? `${n.tahun_ajaran} - Semester ${n.semester_number}`
                      : `Semester ID: ${n.semester_id}`}
                  </TableCell>
                  <TableCell className="max-w-md whitespace-pre-wrap break-words">
                    {n.catatan}
                  </TableCell>
                  <TableCell className="capitalize">{n.teacher_name || `Guru ID: ${n.teacher_id}`}</TableCell>
                  <TableCell className="text-right space-x-2 whitespace-nowrap">
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
                      onClick={() => del(n.id)}
                      title="Hapus catatan"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Catatan" : "Tambah Catatan Baru"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Siswa *</Label>
              <Select
                value={form.student_id}
                onValueChange={(v) => setForm({ ...form, student_id: v })}
                disabled={!!editing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih siswa" />
                </SelectTrigger>
                <SelectContent>
                  {filteredStudentsForForm.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.nama} {s.nama_kelas ? `(${s.nama_kelas})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Semester *</Label>
              <Select
                value={form.semester_id}
                onValueChange={(v) => setForm({ ...form, semester_id: v })}
                disabled={!!editing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih semester" />
                </SelectTrigger>
                <SelectContent>
                  {(semesters.data || []).map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.nama_semester || `${s.tahun_ajaran} - Semester ${s.semester}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Catatan *</Label>
              <Textarea
                rows={6}
                value={form.catatan}
                onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                placeholder="Tulis catatan untuk siswa..."
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {form.catatan.length} karakter
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button onClick={save} disabled={!form.student_id || !form.semester_id || !form.catatan.trim()}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
