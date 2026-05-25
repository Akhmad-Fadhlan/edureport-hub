import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useApiData } from "@/hooks/use-api-data";
import { apiPost, apiPut, apiDelete } from "@/lib/api";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authed/materials")({
  component: MaterialsPage,
});

interface Material {
  id: number;
  judul: string;
  kode_rapor: string;
  subject_id: number;
  semester_id: number;
  tingkat_kelas: number | null;
  urutan: number;
  scope?: string;
  nama_mapel?: string;
}

/** Ekstrak angka pertama dari nama kelas, mis. "8A" → 8, "7B-akh" → 7 */
function parseTingkat(namaKelas: string): number | null {
  const m = namaKelas.match(/^(\d+)/);
  return m ? parseInt(m[1]) : null;
}

function TingkatBadge({ tingkat }: { tingkat: number | null }) {
  if (tingkat === null) return <Badge variant="secondary">Global</Badge>;
  if (tingkat === 7) return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Kelas 7</Badge>;
  if (tingkat === 8) return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Kelas 8</Badge>;
  return <Badge variant="outline">Kelas {tingkat}</Badge>;
}

function MaterialsPage() {
  const semesters = useApiData<any[]>("/semesters");
  const subjects = useApiData<any[]>("/subjects");

  const [semesterId, setSemesterId] = useState<string>("");
  const [tingkatFilter, setTingkatFilter] = useState<string>("all"); // "all" | "7" | "8"
  const [subjectFilter, setSubjectFilter] = useState<string>("all");

  // Bangun params query
  const params: any = {};
  if (semesterId) params.semester_id = semesterId;
  if (tingkatFilter !== "all") params.tingkat_kelas = tingkatFilter;

  const { data, loading, reload } = useApiData<Material[]>(semesterId ? "/materials" : null, params);

  // Filter lokal by subject jika diperlukan
  const filtered = (data || []).filter((m) =>
    subjectFilter === "all" ? true : String(m.subject_id) === subjectFilter
  );

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Material | null>(null);
  const [form, setForm] = useState({
    judul: "",
    subject_id: "",
    semester_id: "",
    tingkat_kelas: "" as "" | "7" | "8", // kosong = global
    urutan: "1",
  });

  function openNew() {
    setEditing(null);
    setForm({
      judul: "",
      subject_id: subjects.data?.[0]?.id?.toString() || "",
      semester_id: semesterId,
      tingkat_kelas: tingkatFilter !== "all" ? (tingkatFilter as "7" | "8") : "",
      urutan: "1",
    });
    setOpen(true);
  }

  function openEdit(m: Material) {
    setEditing(m);
    setForm({
      judul: m.judul,
      subject_id: String(m.subject_id),
      semester_id: String(m.semester_id),
      tingkat_kelas: m.tingkat_kelas ? String(m.tingkat_kelas) as "7" | "8" : "",
      urutan: String(m.urutan),
    });
    setOpen(true);
  }

  async function save() {
    try {
      const payload: any = {
        judul: form.judul,
        subject_id: parseInt(form.subject_id),
        semester_id: parseInt(form.semester_id),
        urutan: parseInt(form.urutan),
      };
      // tingkat_kelas: null = global, 7 = kelas 7, 8 = kelas 8
      payload.tingkat_kelas = form.tingkat_kelas ? parseInt(form.tingkat_kelas) : null;

      if (editing) {
        await apiPut(`/materials/${editing.id}`, payload);
      } else {
        await apiPost("/materials", payload);
      }
      toast.success("Tersimpan");
      setOpen(false);
      reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Gagal menyimpan");
    }
  }

  async function del(id: number) {
    if (!confirm("Hapus materi ini beserta semua indikatornya?")) return;
    try {
      await apiDelete(`/materials/${id}`);
      toast.success("Dihapus");
      reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Gagal menghapus");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Materi</h1>
          <p className="text-sm text-muted-foreground">
            Kelola materi per semester, mata pelajaran, dan tingkat kelas.
          </p>
        </div>
        <Button onClick={openNew} disabled={!semesterId}>
          <Plus className="h-4 w-4 mr-2" />Tambah Materi
        </Button>
      </div>

      {/* Filter bar */}
      <Card className="p-4 flex flex-wrap gap-3 items-center">
        {/* Semester */}
        <Select value={semesterId} onValueChange={(v) => { setSemesterId(v); }}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Pilih semester dulu" />
          </SelectTrigger>
          <SelectContent>
            {(semesters.data || []).map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>{s.nama_semester}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Tingkat Kelas */}
        <Select value={tingkatFilter} onValueChange={setTingkatFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Tingkat Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tingkat</SelectItem>
            <SelectItem value="7">Kelas 7</SelectItem>
            <SelectItem value="8">Kelas 8</SelectItem>
          </SelectContent>
        </Select>

        {/* Mapel */}
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Mapel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Mapel</SelectItem>
            {(subjects.data || []).map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>{s.nama_mapel}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {semesterId && (
          <span className="text-sm text-muted-foreground ml-auto">
            {filtered.length} materi ditemukan
          </span>
        )}
      </Card>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Urut</TableHead>
              <TableHead className="w-24">Kode</TableHead>
              <TableHead>Judul Materi</TableHead>
              <TableHead>Mapel</TableHead>
              <TableHead>Tingkat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!semesterId && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  Pilih semester terlebih dahulu
                </TableCell>
              </TableRow>
            )}
            {semesterId && loading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Memuat...</TableCell>
              </TableRow>
            )}
            {semesterId && !loading && filtered.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="text-center">{m.urutan}</TableCell>
                <TableCell className="font-mono text-xs">{m.kode_rapor}</TableCell>
                <TableCell className="font-medium">{m.judul}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{m.nama_mapel}</TableCell>
                <TableCell>
                  <TingkatBadge tingkat={m.tingkat_kelas} />
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(m)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => del(m.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {semesterId && !loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  Belum ada materi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Dialog tambah/edit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Materi" : "Tambah Materi"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Judul Materi</Label>
              <Input
                value={form.judul}
                onChange={(e) => setForm({ ...form, judul: e.target.value })}
                placeholder="Cth: Desain Grafis Dasar"
              />
            </div>

            <div className="space-y-2">
              <Label>Tingkat Kelas</Label>
              <Select
                value={form.tingkat_kelas || "global"}
                onValueChange={(v) => setForm({ ...form, tingkat_kelas: v === "global" ? "" : v as "7" | "8" })}
                disabled={!!editing} // tidak bisa diubah setelah dibuat
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tingkat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global (semua tingkat)</SelectItem>
                  <SelectItem value="7">Kelas 7</SelectItem>
                  <SelectItem value="8">Kelas 8</SelectItem>
                </SelectContent>
              </Select>
              {editing && (
                <p className="text-xs text-muted-foreground">Tingkat kelas tidak dapat diubah setelah dibuat.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Mata Pelajaran</Label>
              <Select value={form.subject_id} onValueChange={(v) => setForm({ ...form, subject_id: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih mapel" /></SelectTrigger>
                <SelectContent>
                  {(subjects.data || []).map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.nama_mapel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={form.semester_id} onValueChange={(v) => setForm({ ...form, semester_id: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(semesters.data || []).map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.nama_semester}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Urutan</Label>
              <Input
                type="number"
                value={form.urutan}
                onChange={(e) => setForm({ ...form, urutan: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={save}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
