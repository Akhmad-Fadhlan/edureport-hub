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
import { apiPost, apiPut } from "@/lib/api";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";
import { CabangBadge } from "@/components/CabangBadge";
import { CABANG_LIST, CABANG_LABEL, type Cabang } from "@/lib/cabang";

export const Route = createFileRoute("/_authed/teachers")({
  component: TeachersPage,
});

interface Teacher {
  id: number;
  user_id: number;
  nama: string;
  email: string;
  mata_pelajaran: string;
  cabang?: Cabang | null;
  tanda_tangan: string;
}

function TeachersPage() {
  const [cabangFilter, setCabangFilter] = useState<string>("all");
  const params: any = {};
  if (cabangFilter !== "all") params.cabang = cabangFilter;
  const { data, loading, reload } = useApiData<Teacher[]>("/teachers", params);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [form, setForm] = useState({ user_id: "", nama: "", email: "", mata_pelajaran: "multimedia", cabang: "", tanda_tangan: "" });

  function openNew() {
    setEditing(null);
    setForm({ user_id: "", nama: "", email: "", mata_pelajaran: "multimedia", cabang: "", tanda_tangan: "" });
    setOpen(true);
  }
  function openEdit(t: Teacher) {
    setEditing(t);
    setForm({ user_id: String(t.user_id), nama: t.nama, email: t.email, mata_pelajaran: t.mata_pelajaran, cabang: t.cabang || "", tanda_tangan: t.tanda_tangan || "" });
    setOpen(true);
  }
  async function save() {
    try {
      const payload: any = { ...form };
      if (form.user_id) payload.user_id = parseInt(form.user_id);
      if (!form.cabang) delete payload.cabang;
      if (editing) await apiPut(`/teachers/${editing.id}`, payload);
      else await apiPost("/teachers", payload);
      toast.success("Tersimpan"); setOpen(false); reload();
    } catch (e: any) { toast.error(e?.response?.data?.message || "Gagal"); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Guru</h1>
          <p className="text-sm text-muted-foreground">Kelola data guru dan tanda tangan.</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Tambah</Button>
      </div>
      <Card className="p-4 flex flex-wrap gap-3">
        <Select value={cabangFilter} onValueChange={setCabangFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter Cabang" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Cabang</SelectItem>
            {CABANG_LIST.map((c) => <SelectItem key={c} value={c}>{CABANG_LABEL[c]}</SelectItem>)}
          </SelectContent>
        </Select>
      </Card>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead><TableHead>Email</TableHead>
              <TableHead>Mata Pelajaran</TableHead>
              <TableHead>Cabang</TableHead>
              <TableHead>Tanda Tangan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={6} className="text-center py-6 text-muted-foreground">Memuat...</TableCell></TableRow>}
            {!loading && (data || []).map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.nama}</TableCell>
                <TableCell>{t.email}</TableCell>
                <TableCell className="capitalize">{t.mata_pelajaran}</TableCell>
                <TableCell><CabangBadge cabang={t.cabang} /></TableCell>
                <TableCell>
                  {t.tanda_tangan ? (
                    <img src={t.tanda_tangan} alt="ttd" className="h-10 max-w-[100px] object-contain" />
                  ) : <span className="text-muted-foreground text-xs">—</span>}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Guru" : "Tambah Guru"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>User ID</Label><Input value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} placeholder="ID user terkait" /></div>
            <div className="space-y-2"><Label>Nama</Label><Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-2"><Label>Mata Pelajaran</Label><Input value={form.mata_pelajaran} onChange={(e) => setForm({ ...form, mata_pelajaran: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Cabang</Label>
              <Select value={form.cabang} onValueChange={(v) => setForm({ ...form, cabang: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih cabang" /></SelectTrigger>
                <SelectContent>
                  {CABANG_LIST.map((c) => <SelectItem key={c} value={c}>{CABANG_LABEL[c]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>URL Tanda Tangan</Label><Input value={form.tanda_tangan} onChange={(e) => setForm({ ...form, tanda_tangan: e.target.value })} placeholder="https://..." /></div>
            {form.tanda_tangan && <img src={form.tanda_tangan} alt="preview" className="h-16 object-contain border rounded p-1" />}
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
