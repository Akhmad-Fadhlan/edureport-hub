import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useApiData } from "@/hooks/use-api-data";
import { apiPost, apiPut, apiDelete } from "@/lib/api";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authed/semesters")({
  component: SemestersPage,
});

interface Semester {
  id: number;
  tahun_ajaran: string;
  semester: number;
  nama_semester: string;
  is_active: number;
}

function SemestersPage() {
  const { data, loading, reload } = useApiData<Semester[]>("/semesters");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Semester | null>(null);
  const [form, setForm] = useState({
    tahun_ajaran: "2025/2026",
    semester: "1",
    nama_semester: "",
    is_active: "0",
  });

  function openNew() {
    setEditing(null);
    setForm({ tahun_ajaran: "2025/2026", semester: "1", nama_semester: "", is_active: "0" });
    setOpen(true);
  }
  function openEdit(s: Semester) {
    setEditing(s);
    setForm({
      tahun_ajaran: s.tahun_ajaran,
      semester: String(s.semester),
      nama_semester: s.nama_semester,
      is_active: String(s.is_active),
    });
    setOpen(true);
  }

  async function save() {
    const payload = {
      tahun_ajaran: form.tahun_ajaran,
      semester: parseInt(form.semester),
      nama_semester: form.nama_semester,
      is_active: parseInt(form.is_active),
    };
    try {
      if (editing) await apiPut(`/semesters/${editing.id}`, payload);
      else await apiPost("/semesters", payload);
      toast.success("Tersimpan");
      setOpen(false);
      reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Gagal menyimpan");
    }
  }

  async function del(id: number) {
    if (!confirm("Hapus semester ini?")) return;
    try {
      await apiDelete(`/semesters/${id}`);
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
          <h1 className="text-2xl font-bold">Semester</h1>
          <p className="text-sm text-muted-foreground">Kelola tahun ajaran dan semester aktif.</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Tambah</Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tahun Ajaran</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">Memuat...</TableCell></TableRow>
            )}
            {!loading && (data || []).map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.tahun_ajaran}</TableCell>
                <TableCell>{s.semester}</TableCell>
                <TableCell>{s.nama_semester}</TableCell>
                <TableCell>
                  {s.is_active ? <Badge>Aktif</Badge> : <Badge variant="secondary">Tidak Aktif</Badge>}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => del(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Semester" : "Tambah Semester"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tahun Ajaran</Label>
              <Input value={form.tahun_ajaran} onChange={(e) => setForm({ ...form, tahun_ajaran: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={form.semester} onValueChange={(v) => setForm({ ...form, semester: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Ganjil (1)</SelectItem>
                  <SelectItem value="2">Genap (2)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nama Semester</Label>
              <Input value={form.nama_semester} onChange={(e) => setForm({ ...form, nama_semester: e.target.value })} placeholder="Contoh: Ganjil 2025/2026" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.is_active} onValueChange={(v) => setForm({ ...form, is_active: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Aktif</SelectItem>
                  <SelectItem value="0">Tidak Aktif</SelectItem>
                </SelectContent>
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
