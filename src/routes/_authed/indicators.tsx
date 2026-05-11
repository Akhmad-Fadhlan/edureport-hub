import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authed/indicators")({
  component: IndicatorsPage,
});

interface Indicator {
  id: number; material_id: number;
  kode: string; deskripsi: string; nilai_max: string; urutan: number;
  material_judul?: string; kode_rapor?: string;
}

function IndicatorsPage() {
  const semesters = useApiData<any[]>("/semesters");
  const [semesterId, setSemesterId] = useState<string>("");
  const materials = useApiData<any[]>(semesterId ? "/materials" : null, { semester_id: semesterId });
  const [materialFilter, setMaterialFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const params: any = {};
  if (materialFilter !== "all") params.material_id = materialFilter;
  const { data, loading, reload } = useApiData<Indicator[]>("/indicators", params);

  const filtered = useMemo(() => {
    let arr = data || [];
    if (search) arr = arr.filter((i) => i.kode.toLowerCase().includes(search.toLowerCase()) || i.deskripsi.toLowerCase().includes(search.toLowerCase()));
    if (semesterId && materialFilter === "all") {
      const ids = new Set((materials.data || []).map((m: any) => m.id));
      arr = arr.filter((i) => ids.has(i.material_id));
    }
    return arr;
  }, [data, search, semesterId, materialFilter, materials.data]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Indicator | null>(null);
  const [form, setForm] = useState({ kode: "", deskripsi: "", material_id: "", nilai_max: "5", urutan: "1" });

  function openNew() {
    setEditing(null);
    setForm({ kode: "", deskripsi: "", material_id: materials.data?.[0]?.id?.toString() || "", nilai_max: "5", urutan: "1" });
    setOpen(true);
  }
  function openEdit(i: Indicator) {
    setEditing(i);
    setForm({ kode: i.kode, deskripsi: i.deskripsi, material_id: String(i.material_id), nilai_max: String(i.nilai_max), urutan: String(i.urutan) });
    setOpen(true);
  }
  async function save() {
    try {
      const payload = {
        kode: form.kode, deskripsi: form.deskripsi,
        material_id: parseInt(form.material_id),
        nilai_max: parseFloat(form.nilai_max), urutan: parseInt(form.urutan),
      };
      if (editing) await apiPut(`/indicators/${editing.id}`, payload);
      else await apiPost("/indicators", payload);
      toast.success("Tersimpan"); setOpen(false); reload();
    } catch (e: any) { toast.error(e?.response?.data?.message || "Gagal"); }
  }
  async function del(id: number) {
    if (!confirm("Hapus indikator?")) return;
    try { await apiDelete(`/indicators/${id}`); toast.success("Dihapus"); reload(); }
    catch (e: any) { toast.error(e?.response?.data?.message || "Gagal"); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Indikator</h1>
          <p className="text-sm text-muted-foreground">Indikator penilaian per materi.</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Tambah</Button>
      </div>

      <Card className="p-4 flex flex-wrap gap-3">
        <Select value={semesterId} onValueChange={(v) => { setSemesterId(v); setMaterialFilter("all"); }}>
          <SelectTrigger className="w-[220px]"><SelectValue placeholder="Filter Semester" /></SelectTrigger>
          <SelectContent>
            {(semesters.data || []).map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.nama_semester}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={materialFilter} onValueChange={setMaterialFilter}>
          <SelectTrigger className="w-[220px]"><SelectValue placeholder="Filter Materi" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Materi</SelectItem>
            {(materials.data || []).map((m: any) => <SelectItem key={m.id} value={String(m.id)}>{m.judul}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari indikator..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Materi</TableHead>
              <TableHead className="text-right">Maks</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">Memuat...</TableCell></TableRow>}
            {!loading && filtered.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-mono text-xs">{i.kode}</TableCell>
                <TableCell className="text-sm max-w-md">{i.deskripsi}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{i.material_judul}</TableCell>
                <TableCell className="text-right font-medium">{i.nilai_max}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(i)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => del(i.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Indikator" : "Tambah Indikator"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Materi</Label>
              <Select value={form.material_id} onValueChange={(v) => setForm({ ...form, material_id: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih materi" /></SelectTrigger>
                <SelectContent>{(materials.data || []).map((m: any) => <SelectItem key={m.id} value={String(m.id)}>{m.judul}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Kode</Label><Input value={form.kode} onChange={(e) => setForm({ ...form, kode: e.target.value })} placeholder="I.1.1" /></div>
            <div className="space-y-2"><Label>Deskripsi</Label><textarea className="w-full min-h-[100px] rounded-md border bg-background p-3 text-sm" value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Nilai Maks</Label><Input type="number" step="0.1" value={form.nilai_max} onChange={(e) => setForm({ ...form, nilai_max: e.target.value })} /></div>
              <div className="space-y-2"><Label>Urutan</Label><Input type="number" value={form.urutan} onChange={(e) => setForm({ ...form, urutan: e.target.value })} /></div>
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
