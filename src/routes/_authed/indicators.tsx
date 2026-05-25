import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  id: number;
  material_id: number;
  kode: string;
  deskripsi: string;
  nilai_max: string;
  urutan: number;
  material_judul?: string;
  kode_rapor?: string;
  tingkat_kelas?: number | null;
  scope?: string;
}

function TingkatBadge({ tingkat }: { tingkat: number | null | undefined }) {
  if (tingkat === null || tingkat === undefined)
    return <Badge variant="secondary" className="text-xs">Global</Badge>;
  if (tingkat === 7)
    return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">Kelas 7</Badge>;
  if (tingkat === 8)
    return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 text-xs">Kelas 8</Badge>;
  return <Badge variant="outline" className="text-xs">Kelas {tingkat}</Badge>;
}

function IndicatorsPage() {
  const semesters = useApiData<any[]>("/semesters");
  const [semesterId, setSemesterId] = useState<string>("");
  const [tingkatFilter, setTingkatFilter] = useState<string>("all"); // "all" | "7" | "8"

  // Fetch materials sesuai semester + tingkat
  const materialParams: any = {};
  if (semesterId) materialParams.semester_id = semesterId;
  if (tingkatFilter !== "all") materialParams.tingkat_kelas = tingkatFilter;

  const materials = useApiData<any[]>(semesterId ? "/materials" : null, materialParams);
  const [materialFilter, setMaterialFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  // Fetch semua indikator (tanpa filter BE — filter di FE berdasarkan material yg sudah difilter)
  const { data, loading, reload } = useApiData<Indicator[]>("/indicators");

  // Himpunan material id yang relevan
  const relevantMaterialIds = useMemo(
    () => new Set((materials.data || []).map((m: any) => m.id)),
    [materials.data]
  );

  // Filter indikator
  const filtered = useMemo(() => {
    let arr = (data || []).filter((i) => {
      // Hanya tampilkan indikator yang materialnya ada di semester ini
      if (semesterId && !relevantMaterialIds.has(i.material_id)) return false;
      // Filter per materi
      if (materialFilter !== "all" && String(i.material_id) !== materialFilter) return false;
      // Filter pencarian
      if (search) {
        const q = search.toLowerCase();
        if (!i.kode.toLowerCase().includes(q) && !i.deskripsi.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    return arr;
  }, [data, search, semesterId, materialFilter, relevantMaterialIds]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Indicator | null>(null);
  const [form, setForm] = useState({
    kode: "",
    deskripsi: "",
    material_id: "",
    nilai_max: "5",
    urutan: "1",
  });

  function openNew() {
    setEditing(null);
    setForm({
      kode: "",
      deskripsi: "",
      material_id: materials.data?.[0]?.id?.toString() || "",
      nilai_max: "5",
      urutan: "1",
    });
    setOpen(true);
  }

  function openEdit(i: Indicator) {
    setEditing(i);
    setForm({
      kode: i.kode,
      deskripsi: i.deskripsi,
      material_id: String(i.material_id),
      nilai_max: String(i.nilai_max),
      urutan: String(i.urutan),
    });
    setOpen(true);
  }

  async function save() {
    try {
      const payload = {
        kode: form.kode,
        deskripsi: form.deskripsi,
        material_id: parseInt(form.material_id),
        nilai_max: parseFloat(form.nilai_max),
        urutan: parseInt(form.urutan),
      };
      if (editing) await apiPut(`/indicators/${editing.id}`, payload);
      else await apiPost("/indicators", payload);
      toast.success("Tersimpan");
      setOpen(false);
      reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Gagal menyimpan");
    }
  }

  async function del(id: number) {
    if (!confirm("Hapus indikator ini?")) return;
    try {
      await apiDelete(`/indicators/${id}`);
      toast.success("Dihapus");
      reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Gagal menghapus");
    }
  }

  // Cari label material untuk form dialog
  const selectedMaterialInForm = (materials.data || []).find(
    (m: any) => String(m.id) === form.material_id
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Indikator</h1>
          <p className="text-sm text-muted-foreground">Indikator penilaian per materi dan tingkat kelas.</p>
        </div>
        <Button onClick={openNew} disabled={!semesterId}>
          <Plus className="h-4 w-4 mr-2" />Tambah
        </Button>
      </div>

      {/* Filter bar */}
      <Card className="p-4 flex flex-wrap gap-3 items-center">
        {/* Semester */}
        <Select value={semesterId} onValueChange={(v) => { setSemesterId(v); setMaterialFilter("all"); }}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filter Semester" />
          </SelectTrigger>
          <SelectContent>
            {(semesters.data || []).map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>{s.nama_semester}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Tingkat Kelas */}
        <Select value={tingkatFilter} onValueChange={(v) => { setTingkatFilter(v); setMaterialFilter("all"); }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Tingkat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tingkat</SelectItem>
            <SelectItem value="7">Kelas 7</SelectItem>
            <SelectItem value="8">Kelas 8</SelectItem>
          </SelectContent>
        </Select>

        {/* Materi */}
        <Select value={materialFilter} onValueChange={setMaterialFilter}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filter Materi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Materi</SelectItem>
            {(materials.data || []).map((m: any) => (
              <SelectItem key={m.id} value={String(m.id)}>
                [{m.scope === "global" ? "Global" : `Kls ${m.tingkat_kelas}`}] {m.judul}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari kode / deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {semesterId && (
          <span className="text-sm text-muted-foreground ml-auto">
            {filtered.length} indikator
          </span>
        )}
      </Card>

      {/* Tabel */}
      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Kode</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Materi</TableHead>
              <TableHead>Tingkat</TableHead>
              <TableHead className="text-right w-16">Maks</TableHead>
              <TableHead className="text-right w-24">Aksi</TableHead>
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
            {semesterId && !loading && filtered.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-mono text-xs">{i.kode}</TableCell>
                <TableCell className="text-sm max-w-xs">{i.deskripsi}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{i.material_judul}</TableCell>
                <TableCell>
                  <TingkatBadge tingkat={i.tingkat_kelas} />
                </TableCell>
                <TableCell className="text-right font-medium">{i.nilai_max}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(i)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => del(i.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {semesterId && !loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  Tidak ada indikator ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Dialog tambah/edit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Indikator" : "Tambah Indikator"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Materi — hanya tampilkan materi yg sudah difilter by tingkat */}
            <div className="space-y-2">
              <Label>Materi</Label>
              <Select
                value={form.material_id}
                onValueChange={(v) => setForm({ ...form, material_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih materi" />
                </SelectTrigger>
                <SelectContent>
                  {(materials.data || []).map((m: any) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      [{m.scope === "global" ? "Global" : `Kls ${m.tingkat_kelas}`}] {m.judul}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedMaterialInForm && (
                <p className="text-xs text-muted-foreground">
                  Tingkat: {selectedMaterialInForm.scope === "global"
                    ? "Global (semua kelas)"
                    : `Kelas ${selectedMaterialInForm.tingkat_kelas}`}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Kode</Label>
              <Input
                value={form.kode}
                onChange={(e) => setForm({ ...form, kode: e.target.value })}
                placeholder="Cth: I.R1.1"
              />
            </div>

            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <textarea
                className="w-full min-h-[100px] rounded-md border bg-background p-3 text-sm resize-none"
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                placeholder="Deskripsi indikator penilaian..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Nilai Maks</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.nilai_max}
                  onChange={(e) => setForm({ ...form, nilai_max: e.target.value })}
                />
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
