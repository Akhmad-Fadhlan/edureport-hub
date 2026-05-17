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
import { CabangBadge } from "@/components/CabangBadge";
import { CABANG_LIST, CABANG_LABEL, type Cabang } from "@/lib/cabang";
import { useAuth } from "@/stores/auth-store";

export const Route = createFileRoute("/_authed/classes")({
  component: ClassesPage,
});

interface Klass { id: number; nama_kelas: string; cabang?: Cabang | null }

function ClassesPage() {
  const { user, isGuru } = useAuth();
  const guru = isGuru();
  const guruCabang = (user?.cabang ?? null) as Cabang | null;

  const [cabangFilter, setCabangFilter] = useState<string>(guru && guruCabang ? guruCabang : "all");
  const queryParams: any = {};
  const effectiveCabang = guru && guruCabang ? guruCabang : cabangFilter;
  if (effectiveCabang !== "all") queryParams.cabang = effectiveCabang;

  const { data, loading, reload, error } = useApiData<Klass[]>("/classes", queryParams);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Klass | null>(null);
  const [nama, setNama] = useState("");
  const [cabang, setCabang] = useState<string>(guru && guruCabang ? guruCabang : "");

  function openNew() {
    setEditing(null);
    setNama("");
    setCabang(guru && guruCabang ? guruCabang : "");
    setOpen(true);
  }
  function openEdit(k: Klass) {
    if (guru && guruCabang && k.cabang && k.cabang !== guruCabang) {
      toast.error("Anda tidak punya akses ke kelas cabang lain");
      return;
    }
    setEditing(k);
    setNama(k.nama_kelas);
    setCabang(k.cabang || (guru && guruCabang ? guruCabang : ""));
    setOpen(true);
  }

  async function save() {
    try {
      const payload: any = { nama_kelas: nama };
      if (cabang) payload.cabang = cabang;
      if (editing) await apiPut(`/classes/${editing.id}`, payload);
      else await apiPost("/classes", payload);
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

      {!guru && (
        <Card className="p-4 flex flex-wrap gap-3">
          <Select value={cabangFilter} onValueChange={setCabangFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter Cabang" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Cabang</SelectItem>
              {CABANG_LIST.map((c) => <SelectItem key={c} value={c}>{CABANG_LABEL[c]}</SelectItem>)}
            </SelectContent>
          </Select>
        </Card>
      )}

      {error && <Card className="p-4 text-sm text-destructive">{error}</Card>}
      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Nama Kelas</TableHead><TableHead>Cabang</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">Memuat...</TableCell></TableRow>}
            {!loading && (data || []).map((k) => (
              <TableRow key={k.id}>
                <TableCell>{k.id}</TableCell>
                <TableCell>{k.nama_kelas}</TableCell>
                <TableCell><CabangBadge cabang={k.cabang} /></TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(k)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => del(k.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && (!data || data.length === 0) && (
              <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">Belum ada kelas</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Kelas" : "Tambah Kelas"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Kelas</Label>
              <Input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: 8A" />
            </div>
            {!guru ? (
              <div className="space-y-2">
                <Label>Cabang</Label>
                <Select value={cabang} onValueChange={setCabang}>
                  <SelectTrigger><SelectValue placeholder="Pilih cabang" /></SelectTrigger>
                  <SelectContent>
                    {CABANG_LIST.map((c) => <SelectItem key={c} value={c}>{CABANG_LABEL[c]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              guruCabang && (
                <div className="text-xs text-muted-foreground">
                  Cabang otomatis: <CabangBadge cabang={guruCabang} />
                </div>
              )
            )}
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
