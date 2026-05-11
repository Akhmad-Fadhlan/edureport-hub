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

export const Route = createFileRoute("/_authed/classes")({
  component: ClassesPage,
});

interface Klass { id: number; nama_kelas: string }

function ClassesPage() {
  const { data, loading, reload, error } = useApiData<Klass[]>("/classes");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Klass | null>(null);
  const [nama, setNama] = useState("");

  function openNew() { setEditing(null); setNama(""); setOpen(true); }
  function openEdit(k: Klass) { setEditing(k); setNama(k.nama_kelas); setOpen(true); }

  async function save() {
    try {
      if (editing) await apiPut(`/classes/${editing.id}`, { nama_kelas: nama });
      else await apiPost("/classes", { nama_kelas: nama });
      toast.success("Tersimpan"); setOpen(false); reload();
    } catch (e: any) { toast.error(e?.response?.data?.message || "Gagal"); }
  }
  async function del(id: number) {
    if (!confirm("Hapus kelas ini?")) return;
    try { await apiDelete(`/classes/${id}`); toast.success("Dihapus"); reload(); }
    catch (e: any) { toast.error(e?.response?.data?.message || "Gagal"); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kelas</h1>
          <p className="text-sm text-muted-foreground">Kelola daftar kelas siswa.</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Tambah</Button>
      </div>
      {error && <Card className="p-4 text-sm text-destructive">{error}</Card>}
      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Nama Kelas</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={3} className="text-center py-6 text-muted-foreground">Memuat...</TableCell></TableRow>}
            {!loading && (data || []).map((k) => (
              <TableRow key={k.id}>
                <TableCell>{k.id}</TableCell>
                <TableCell>{k.nama_kelas}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(k)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => del(k.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && (!data || data.length === 0) && (
              <TableRow><TableCell colSpan={3} className="text-center py-6 text-muted-foreground">Belum ada kelas</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Kelas" : "Tambah Kelas"}</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <Label>Nama Kelas</Label>
            <Input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: 8A" />
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
