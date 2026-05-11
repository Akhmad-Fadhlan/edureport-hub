import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  urutan: number;
  nama_mapel?: string;
  nama_semester?: string;
}

function MaterialsPage() {
  const semesters = useApiData<any[]>("/semesters");
  const subjects = useApiData<any[]>("/subjects");
  const [semesterId, setSemesterId] = useState<string>("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");

  const params: any = {};
  if (semesterId) params.semester_id = semesterId;
  if (subjectFilter !== "all") params.subject_id = subjectFilter;

  const { data, loading, reload } = useApiData<Material[]>(semesterId ? "/materials" : null, params);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Material | null>(null);
  const [form, setForm] = useState({ judul: "", kode_rapor: "R1", subject_id: "", semester_id: "", urutan: "1" });

  function openNew() {
    setEditing(null);
    setForm({ judul: "", kode_rapor: "R1", subject_id: subjects.data?.[0]?.id?.toString() || "", semester_id: semesterId, urutan: "1" });
    setOpen(true);
  }
  function openEdit(m: Material) {
    setEditing(m);
    setForm({ judul: m.judul, kode_rapor: m.kode_rapor, subject_id: String(m.subject_id), semester_id: String(m.semester_id), urutan: String(m.urutan) });
    setOpen(true);
  }
  async function save() {
    try {
      const payload = {
        judul: form.judul, kode_rapor: form.kode_rapor,
        subject_id: parseInt(form.subject_id), semester_id: parseInt(form.semester_id),
        urutan: parseInt(form.urutan),
      };
      if (editing) await apiPut(`/materials/${editing.id}`, payload);
      else await apiPost("/materials", payload);
      toast.success("Tersimpan"); setOpen(false); reload();
    } catch (e: any) { toast.error(e?.response?.data?.message || "Gagal"); }
  }
  async function del(id: number) {
    if (!confirm("Hapus materi?")) return;
    try { await apiDelete(`/materials/${id}`); toast.success("Dihapus"); reload(); }
    catch (e: any) { toast.error(e?.response?.data?.message || "Gagal"); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Materi</h1>
          <p className="text-sm text-muted-foreground">Kelola materi per semester dan mata pelajaran.</p>
        </div>
        <Button onClick={openNew} disabled={!semesterId}><Plus className="h-4 w-4 mr-2" />Tambah Materi</Button>
      </div>

      <Card className="p-4 flex flex-wrap gap-3">
        <Select value={semesterId} onValueChange={setSemesterId}>
          <SelectTrigger className="w-[260px]"><SelectValue placeholder="Pilih semester dulu" /></SelectTrigger>
          <SelectContent>
            {(semesters.data || []).map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.nama_semester}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Mapel" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Mapel</SelectItem>
            {(subjects.data || []).map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.nama_mapel}</SelectItem>)}
          </SelectContent>
        </Select>
      </Card>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Urut</TableHead>
              <TableHead>Kode</TableHead>
              <TableHead>Judul Materi</TableHead>
              <TableHead>Mapel</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!semesterId && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Pilih semester terlebih dahulu</TableCell></TableRow>}
            {semesterId && loading && <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">Memuat...</TableCell></TableRow>}
            {semesterId && !loading && (data || []).map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.urutan}</TableCell>
                <TableCell className="font-mono">{m.kode_rapor}</TableCell>
                <TableCell className="font-medium">{m.judul}</TableCell>
                <TableCell>{m.nama_mapel}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(m)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => del(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {semesterId && !loading && (!data || data.length === 0) && (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Belum ada materi</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Materi" : "Tambah Materi"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Judul</Label><Input value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Kode Rapor</Label><Input value={form.kode_rapor} onChange={(e) => setForm({ ...form, kode_rapor: e.target.value })} placeholder="R1, R2..." /></div>
              <div className="space-y-2"><Label>Urutan</Label><Input type="number" value={form.urutan} onChange={(e) => setForm({ ...form, urutan: e.target.value })} /></div>
            </div>
            <div className="space-y-2">
              <Label>Mata Pelajaran</Label>
              <Select value={form.subject_id} onValueChange={(v) => setForm({ ...form, subject_id: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(subjects.data || []).map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.nama_mapel}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={form.semester_id} onValueChange={(v) => setForm({ ...form, semester_id: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(semesters.data || []).map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.nama_semester}</SelectItem>)}</SelectContent>
              </Select>
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
