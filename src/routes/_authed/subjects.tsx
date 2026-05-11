import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApiData } from "@/hooks/use-api-data";
import { apiPost, apiPut, apiDelete } from "@/lib/api";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authed/subjects")({
  component: SubjectsPage,
});

interface Subject { id: number; nama_mapel: string; kode: string }

function SubjectsPage() {
  const { data, loading, reload } = useApiData<Subject[]>("/subjects");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [form, setForm] = useState({ nama_mapel: "", kode: "" });

  function openNew() { setEditing(null); setForm({ nama_mapel: "", kode: "" }); setOpen(true); }
  function openEdit(s: Subject) { setEditing(s); setForm({ nama_mapel: s.nama_mapel, kode: s.kode }); setOpen(true); }
  async function save() {
    try {
      if (editing) await apiPut(`/subjects/${editing.id}`, form);
      else await apiPost("/subjects", form);
      toast.success("Tersimpan"); setOpen(false); reload();
    } catch (e: any) { toast.error(e?.response?.data?.message || "Gagal"); }
  }
  async function del(id: number) {
    if (!confirm("Hapus mata pelajaran ini?")) return;
    try { await apiDelete(`/subjects/${id}`); toast.success("Dihapus"); reload(); }
    catch (e: any) { toast.error(e?.response?.data?.message || "Gagal"); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mata Pelajaran</h1>
          <p className="text-sm text-muted-foreground">Kelola mata pelajaran sistem rapor.</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Tambah</Button>
      </div>
      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Kode</TableHead><TableHead>Nama Mapel</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={3} className="text-center py-6 text-muted-foreground">Memuat...</TableCell></TableRow>}
            {!loading && (data || []).map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-mono">{s.kode}</TableCell>
                <TableCell>{s.nama_mapel}</TableCell>
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
          <DialogHeader><DialogTitle>{editing ? "Edit Mapel" : "Tambah Mapel"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Kode</Label><Input value={form.kode} onChange={(e) => setForm({ ...form, kode: e.target.value })} /></div>
            <div className="space-y-2"><Label>Nama Mapel</Label><Input value={form.nama_mapel} onChange={(e) => setForm({ ...form, nama_mapel: e.target.value })} /></div>
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
