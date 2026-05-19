import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApiData } from "@/hooks/use-api-data";
import { api, apiDelete, getStudentPhoto } from "@/lib/api";
import { useAuth } from "@/stores/auth-store";
import { toast } from "sonner";
import { Pencil, Plus, Search, Trash2, Upload, Linkedin } from "lucide-react";

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
  cabang_id?: number;
  nama_kelas?: string;
  nama_cabang?: string;
}
interface Klass { id: number; nama_kelas: string }
interface Cabang { id: number; nama_cabang: string }

// ── Komponen avatar async ────────────────────────────────────────────────────
function StudentAvatar({ photo, nama }: { photo?: string; nama: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!photo) { setSrc(null); return; }
    let cancelled = false;
    getStudentPhoto(photo).then((url) => {
      if (!cancelled) setSrc(url);
    });
    return () => { cancelled = true; };
  }, [photo]);

  if (src) {
    return <img src={src} alt={nama} className="h-10 w-10 rounded-full object-cover" />;
  }
  return (
    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
      {nama?.[0]?.toUpperCase()}
    </div>
  );
}

// ── Halaman Utama ────────────────────────────────────────────────────────────
function StudentsPage() {
  const { isGuru, getCabangId } = useAuth();
  const guruMode = isGuru();
  const cabangId = getCabangId();

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [cabangFilter, setCabangFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const params: any = { page, per_page: 20 };
  if (search) params.search = search;
  if (classFilter !== "all") params.class_id = classFilter;
  if (guruMode && cabangId) {
    params.cabang_id = cabangId;
  } else if (cabangFilter !== "all") {
    params.cabang_id = cabangFilter;
  }

  const { data, loading, reload } = useApiData<{ items: Student[]; pagination?: any }>("/students", params);

  const classParams: any = {};
  if (guruMode && cabangId) classParams.cabang_id = cabangId;
  const classes = useApiData<Klass[]>("/classes", classParams);

  // Load semua cabang (hanya untuk admin / non-guru)
  const cabangsRaw = useApiData<{ items: Cabang[] } | Cabang[]>(!guruMode ? "/cabangs" : null);

  // Normalisasi — handle respons { items: [] } maupun array langsung
  const cabangList: Cabang[] = Array.isArray(cabangsRaw.data)
    ? cabangsRaw.data
    : (cabangsRaw.data as any)?.items ?? [];

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState({
    nama: "",
    email: "",
    linkedin: "",
    class_id: "",
    cabang_id: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Kelas difilter berdasarkan cabang yang dipilih di form
  const formCabangId = guruMode ? String(cabangId ?? "") : form.cabang_id;
  const filteredClasses = useApiData<Klass[]>(
    "/classes",
    formCabangId ? { cabang_id: formCabangId } : {}
  );

  function openNew() {
    setEditing(null);
    const defaultCabang = guruMode
      ? String(cabangId ?? "")
      : (cabangList[0]?.id?.toString() ?? "");
    setForm({
      nama: "",
      email: "",
      linkedin: "",
      class_id: "",
      cabang_id: defaultCabang,
    });
    setPhotoFile(null);
    setPhotoPreview(null);
    setOpen(true);
  }

  function openEdit(s: Student) {
    setEditing(s);
    setForm({
      nama: s.nama,
      email: s.email,
      linkedin: s.linkedin || "",
      class_id: String(s.class_id),
      cabang_id: s.cabang_id
        ? String(s.cabang_id)
        : guruMode
        ? String(cabangId ?? "")
        : "",
    });
    setPhotoFile(null);
    setPhotoPreview(null);
    if (s.photo) {
      getStudentPhoto(s.photo).then(setPhotoPreview);
    }
    setOpen(true);
  }

  function onPickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) { toast.error("Maksimal 2MB"); return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      toast.error("Hanya JPG/PNG/WEBP");
      return;
    }
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
  }

  async function save() {
    if (saving) return;
    if (!form.nama.trim()) { toast.error("Nama wajib diisi"); return; }
    if (!form.email.trim()) { toast.error("Email wajib diisi"); return; }
    if (!form.class_id) { toast.error("Pilih kelas terlebih dahulu"); return; }
    if (!guruMode && !form.cabang_id) { toast.error("Pilih cabang terlebih dahulu"); return; }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("nama", form.nama);
      fd.append("email", form.email);
      fd.append("linkedin", form.linkedin);
      fd.append("class_id", form.class_id);

      const finalCabangId = guruMode ? String(cabangId ?? "") : form.cabang_id;
      if (finalCabangId) fd.append("cabang_id", finalCabangId);
      if (photoFile) fd.append("photo", photoFile);

      if (editing) {
        await api.post(`/students/${editing.id}?_method=PUT`, fd);
      } else {
        await api.post(`/students`, fd);
      }
      toast.success("Tersimpan");
      setOpen(false);
      reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  async function del(id: number) {
    if (!confirm("Hapus siswa ini?")) return;
    try {
      await apiDelete(`/students/${id}`);
      toast.success("Dihapus");
      reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Gagal");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Data Siswa</h1>
          <p className="text-sm text-muted-foreground">Kelola data siswa, foto, dan kelas.</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" />Tambah Siswa
        </Button>
      </div>

      {/* Filter bar */}
      <Card className="p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama / email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>

        {/* Filter cabang — hanya admin */}
        {!guruMode && (
          <Select
            value={cabangFilter}
            onValueChange={(v) => { setCabangFilter(v); setClassFilter("all"); setPage(1); }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Cabang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Cabang</SelectItem>
              {cabangList.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>{c.nama_cabang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select
          value={classFilter}
          onValueChange={(v) => { setClassFilter(v); setPage(1); }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kelas</SelectItem>
            {(classes.data || []).map((k) => (
              <SelectItem key={k.id} value={String(k.id)}>{k.nama_kelas}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {/* Tabel */}
      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foto</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Kelas</TableHead>
              {!guruMode && <TableHead>Cabang</TableHead>}
              <TableHead>LinkedIn</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={guruMode ? 6 : 7}>
                  <div className="h-8 bg-muted animate-pulse rounded" />
                </TableCell>
              </TableRow>
            ))}
            {!loading && (data?.items || []).map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <StudentAvatar photo={s.photo} nama={s.nama} />
                </TableCell>
                <TableCell className="font-medium capitalize">{s.nama}</TableCell>
                <TableCell className="text-sm">{s.email}</TableCell>
                <TableCell>{s.nama_kelas || s.class_id}</TableCell>
                {!guruMode && (
                  <TableCell className="text-sm">
                    {s.nama_cabang || s.cabang_id || "—"}
                  </TableCell>
                )}
                <TableCell className="text-sm">
                  {s.linkedin
                    ? (
                      
                        href={s.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <Linkedin className="h-3 w-3" />Profile
                      </a>
                    )
                    : "—"}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => del(s.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && (!data?.items || data.items.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={guruMode ? 6 : 7}
                  className="text-center py-8 text-muted-foreground"
                >
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {data?.pagination && data.pagination.last_page > 1 && (
          <div className="flex items-center justify-between p-3 border-t text-sm">
            <div className="text-muted-foreground">
              Halaman {data.pagination.current_page} dari {data.pagination.last_page} • Total {data.pagination.total}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.pagination.last_page}
                onClick={() => setPage(page + 1)}
              >
                Berikutnya
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Dialog tambah / edit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Siswa" : "Tambah Siswa"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Foto */}
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                {photoPreview
                  ? <img src={photoPreview} alt="" className="h-full w-full object-cover" />
                  : <Upload className="h-6 w-6 text-muted-foreground" />}
              </div>
              <div>
                <Label className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={onPickPhoto}
                  />
                  <span className="px-3 py-1.5 border rounded-md hover:bg-secondary">
                    Pilih Foto
                  </span>
                </Label>
                <div className="text-xs text-muted-foreground mt-1">JPG/PNG/WEBP, maks 2MB</div>
              </div>
            </div>

            {/* Nama */}
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Nama lengkap siswa"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <Label>LinkedIn <span className="text-muted-foreground font-normal">(opsional)</span></Label>
              <Input
                value={form.linkedin}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            {/* Cabang — hanya admin */}
            {!guruMode && (
              <div className="space-y-2">
                <Label>Cabang</Label>
                <Select
                  value={form.cabang_id}
                  onValueChange={(v) => setForm({ ...form, cabang_id: v, class_id: "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      cabangsRaw.loading ? "Memuat cabang..." : "Pilih cabang"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {cabangsRaw.loading && (
                      <div className="px-3 py-2 text-sm text-muted-foreground">Memuat...</div>
                    )}
                    {!cabangsRaw.loading && cabangList.length === 0 && (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        Tidak ada cabang tersedia
                      </div>
                    )}
                    {cabangList.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.nama_cabang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Kelas — difilter berdasarkan cabang */}
            <div className="space-y-2">
              <Label>Kelas</Label>
              <Select
                value={form.class_id}
                onValueChange={(v) => setForm({ ...form, class_id: v })}
                disabled={!guruMode && !form.cabang_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    !guruMode && !form.cabang_id
                      ? "Pilih cabang dulu"
                      : filteredClasses.loading
                      ? "Memuat kelas..."
                      : "Pilih kelas"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {filteredClasses.loading && (
                    <div className="px-3 py-2 text-sm text-muted-foreground">Memuat...</div>
                  )}
                  {!filteredClasses.loading && (filteredClasses.data || []).length === 0 && (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Tidak ada kelas tersedia
                    </div>
                  )}
                  {(filteredClasses.data || []).map((k) => (
                    <SelectItem key={k.id} value={String(k.id)}>
                      {k.nama_kelas}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
