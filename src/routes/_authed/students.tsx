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
import { api, apiDelete, getStudentPhoto } from "@/lib/api";
import { toast } from "sonner";
import { Pencil, Plus, Search, Trash2, Upload, Linkedin } from "lucide-react";
import { StudentPhoto } from "@/components/StudentPhoto";
import { CabangBadge } from "@/components/CabangBadge";
import { CABANG_LIST, CABANG_LABEL, type Cabang } from "@/lib/cabang";
import { useAuth } from "@/stores/auth-store";

export const Route = createFileRoute("/_authed/students")({
  component: StudentsPage,
});

interface Student {
  id: number;
  nama: string;
  email: string;
  linkedin?: string;
  photo?: string;
  class_id: number;
  nama_kelas?: string;
  cabang?: Cabang | null;
}
interface Klass { id: number; nama_kelas: string; cabang?: Cabang | null }

function StudentsPage() {
  const { user, isGuru } = useAuth();
  const guru = isGuru();
  const guruCabang = (user?.cabang ?? null) as Cabang | null;

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [cabangFilter, setCabangFilter] = useState<string>(guru && guruCabang ? guruCabang : "all");
  const [page, setPage] = useState(1);

  const effectiveCabang: Cabang | "all" =
    guru && guruCabang ? guruCabang : (cabangFilter as Cabang | "all");

  const params: any = { page, per_page: 20 };
  if (search) params.search = search;
  if (classFilter !== "all") params.class_id = classFilter;
  if (effectiveCabang !== "all") params.cabang = effectiveCabang;

  const { data, loading, reload } = useApiData<{ items: Student[]; pagination?: any }>("/students", params);
  const classParams: any = {};
  if (effectiveCabang !== "all") classParams.cabang = effectiveCabang;
  const classes = useApiData<Klass[]>("/classes", classParams);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState<{ nama: string; email: string; linkedin: string; class_id: string; cabang: string }>({
    nama: "", email: "", linkedin: "", class_id: "", cabang: guru && guruCabang ? guruCabang : "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing(null);
    setForm({
      nama: "", email: "", linkedin: "",
      class_id: classes.data?.[0]?.id?.toString() || "",
      cabang: guru && guruCabang ? guruCabang : "",
    });
    setPhotoFile(null); setPhotoPreview(null);
    setOpen(true);
  }
  async function openEdit(s: Student) {
    if (guru && guruCabang && s.cabang && s.cabang !== guruCabang) {
      toast.error("Anda tidak punya akses ke siswa cabang lain");
      return;
    }
    setEditing(s);
    setForm({
      nama: s.nama, email: s.email, linkedin: s.linkedin || "",
      class_id: String(s.class_id),
      cabang: s.cabang || (guru && guruCabang ? guruCabang : ""),
    });
    setPhotoFile(null);
    if (s.photo) {
      const d = await getStudentPhoto(s.photo);
      setPhotoPreview(d);
    } else {
      setPhotoPreview(null);
    }
    setOpen(true);
  }
  function onPickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.size > 2 * 1024 * 1024) { toast.error("Maksimal 2MB"); return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) { toast.error("Hanya JPG/PNG/WEBP"); return; }
    setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f));
  }
  async function save() {
    if (saving) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("nama", form.nama);
      fd.append("email", form.email);
      fd.append("linkedin", form.linkedin);
      fd.append("class_id", form.class_id);
      if (form.cabang) fd.append("cabang", form.cabang);
      if (photoFile) fd.append("photo", photoFile);
      if (editing) {
        await api.post(`/students/${editing.id}?_method=PUT`, fd);
      } else {
        await api.post(`/students`, fd);
      }
      toast.success("Tersimpan"); setOpen(false); reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Gagal menyimpan");
    } finally { setSaving(false); }
  }
  async function del(id: number) {
    if (!confirm("Hapus siswa ini?")) return;
    try { await apiDelete(`/students/${id}`); toast.success("Dihapus"); reload(); }
    catch (e: any) { toast.error(e?.response?.data?.message || "Gagal"); }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Data Siswa</h1>
          <p className="text-sm text-muted-foreground">Kelola data siswa, foto, dan kelas.</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Tambah Siswa</Button>
      </div>

      <Card className="p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari nama / email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
        </div>
        {!guru && (
          <Select value={cabangFilter} onValueChange={(v) => { setCabangFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Filter Cabang" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Cabang</SelectItem>
              {CABANG_LIST.map((c) => <SelectItem key={c} value={c}>{CABANG_LABEL[c]}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        <Select value={classFilter} onValueChange={(v) => { setClassFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter Kelas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kelas</SelectItem>
            {(classes.data || []).map((k) => <SelectItem key={k.id} value={String(k.id)}>{k.nama_kelas}</SelectItem>)}
          </SelectContent>
        </Select>
      </Card>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foto</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Cabang</TableHead>
              <TableHead>LinkedIn</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}><TableCell colSpan={7}><div className="h-8 bg-muted animate-pulse rounded" /></TableCell></TableRow>
            ))}
            {!loading && (data?.items || []).map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <StudentPhoto
                    filename={s.photo}
                    alt={s.nama}
                    className="h-10 w-10 rounded-full object-cover"
                    fallback={
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        {s.nama?.[0]?.toUpperCase()}
                      </div>
                    }
                  />
                </TableCell>
                <TableCell className="font-medium capitalize">{s.nama}</TableCell>
                <TableCell className="text-sm">{s.email}</TableCell>
                <TableCell>{s.nama_kelas || s.class_id}</TableCell>
                <TableCell><CabangBadge cabang={s.cabang} /></TableCell>
                <TableCell className="text-sm">
                  {s.linkedin ? <a href={s.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline"><Linkedin className="h-3 w-3" />Profile</a> : "—"}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => del(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && (!data?.items || data.items.length === 0) && (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Tidak ada data</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
        {data?.pagination && data.pagination.last_page > 1 && (
          <div className="flex items-center justify-between p-3 border-t text-sm">
            <div className="text-muted-foreground">Halaman {data.pagination.current_page} dari {data.pagination.last_page} • Total {data.pagination.total}</div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Sebelumnya</Button>
              <Button variant="outline" size="sm" disabled={page >= data.pagination.last_page} onClick={() => setPage(page + 1)}>Berikutnya</Button>
            </div>
          </div>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Siswa" : "Tambah Siswa"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                {photoPreview ? <img src={photoPreview} alt="" className="h-full w-full object-cover" /> : <Upload className="h-6 w-6 text-muted-foreground" />}
              </div>
              <div>
                <Label className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium">
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onPickPhoto} />
                  <span className="px-3 py-1.5 border rounded-md hover:bg-secondary">Pilih Foto</span>
                </Label>
                <div className="text-xs text-muted-foreground mt-1">JPG/PNG/WEBP, maks 2MB</div>
              </div>
            </div>
            <div className="space-y-2"><Label>Nama Lengkap</Label><Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-2"><Label>LinkedIn</Label><Input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." /></div>
            <div className="space-y-2">
              <Label>Kelas</Label>
              <Select value={form.class_id} onValueChange={(v) => setForm({ ...form, class_id: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih kelas" /></SelectTrigger>
                <SelectContent>
                  {(classes.data || []).map((k) => <SelectItem key={k.id} value={String(k.id)}>{k.nama_kelas}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
