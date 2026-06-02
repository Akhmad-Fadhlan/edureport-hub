import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApiData } from "@/hooks/use-api-data";
import { api, apiDelete, getStudentPhoto } from "@/lib/api";
import { useAuth } from "@/stores/auth-store";
import { CabangBadge } from "@/components/CabangBadge";
import { CABANG_LIST, CABANG_LABEL, type Cabang } from "@/lib/cabang";
import { toast } from "sonner";
import {
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  Linkedin,
  X,
  Loader2,
  Info,
  FileSpreadsheet,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

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
  cabang: Cabang | null;
  nama_kelas?: string;
}

interface Klass {
  id: number;
  nama_kelas: string;
  cabang: string;
}

// ── Avatar async: load foto via API ─────────────────────────────────────────
function StudentAvatar({ photo, nama }: { photo?: string; nama: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!photo) { setSrc(null); return; }
    let cancelled = false;
    getStudentPhoto(photo)
      .then((url) => { if (!cancelled && url) setSrc(url); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [photo]);

  if (src) {
    return <img src={src} alt={nama} className="h-10 w-10 rounded-full object-cover" />;
  }
  return (
    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
      {nama?.[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

// ── Halaman Utama ────────────────────────────────────────────────────────────
function StudentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isGuru = user?.role === "guru";
  const guruCabang = user?.cabang ?? null;

  const [search, setSearch] = useState("");
  const [cabangFilter, setCabangFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const params: Record<string, unknown> = { page, per_page: 20 };
  if (search) params.search = search;

  if (isGuru) {
    if (guruCabang) params.cabang = guruCabang;
  } else {
    if (cabangFilter !== "all") params.cabang = cabangFilter;
  }
  if (classFilter !== "all") params.class_id = classFilter;

  const { data, loading, reload } = useApiData<{
    items: Student[];
    pagination?: { total: number; per_page: number; current_page: number; last_page: number };
  }>("/students", params);

  const activeCabang = isGuru ? guruCabang : (cabangFilter !== "all" ? cabangFilter : null);
  const classParams: Record<string, unknown> = activeCabang ? { cabang: activeCabang } : {};
  const { data: classesData } = useApiData<Klass[]>("/classes", classParams);

  useEffect(() => { setPage(1); }, [search, cabangFilter, classFilter]);
  useEffect(() => { if (!isGuru) setClassFilter("all"); }, [cabangFilter, isGuru]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [form, setForm] = useState({
    nama: "",
    email: "",
    linkedin: "",
    class_id: "",
    cabang: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [deletePhoto, setDeletePhoto] = useState(false);

  const formCabang = isGuru ? (guruCabang ?? "") : form.cabang;
  const { data: formClasses } = useApiData<Klass[]>(
    "/classes",
    formCabang ? { cabang: formCabang } : {}
  );

  function openNew() {
    setEditing(null);
    setPhotoFile(null);
    setPhotoPreview(null);
    setDeletePhoto(false);
    setForm({
      nama: "",
      email: "",
      linkedin: "",
      class_id: "",
      cabang: isGuru ? (guruCabang ?? "") : "",
    });
    setOpen(true);
  }

  function openEdit(s: Student) {
    setEditing(s);
    setPhotoFile(null);
    setDeletePhoto(false);
    setForm({
      nama: s.nama,
      email: s.email ?? "",
      linkedin: s.linkedin ?? "",
      class_id: String(s.class_id),
      cabang: s.cabang ?? (isGuru ? (guruCabang ?? "") : ""),
    });
    if (s.photo) {
      getStudentPhoto(s.photo).then(setPhotoPreview).catch(() => setPhotoPreview(null));
    } else {
      setPhotoPreview(null);
    }
    setOpen(true);
  }

  function onPickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) { toast.error("Foto maksimal 2MB"); return; }
    if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(f.type)) {
      toast.error("Format foto harus JPG, PNG, atau WEBP");
      return;
    }
    setPhotoFile(f);
    setDeletePhoto(false);
    const url = URL.createObjectURL(f);
    setPhotoPreview(url);
  }

  function removePhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (editing?.photo) setDeletePhoto(true);
  }

  async function save() {
    if (saving) return;
    if (!form.nama.trim()) { toast.error("Nama siswa wajib diisi"); return; }
    if (!form.class_id) { toast.error("Pilih kelas terlebih dahulu"); return; }
    if (!isGuru && !form.cabang) { toast.error("Pilih cabang terlebih dahulu"); return; }

    setSaving(true);
    setUploadProgress(0);
    try {
      const fd = new FormData();
      fd.append("nama", form.nama.trim());
      fd.append("email", form.email.trim());
      fd.append("linkedin", form.linkedin.trim());
      fd.append("class_id", form.class_id);
      if (!isGuru && form.cabang) fd.append("cabang", form.cabang);
      if (deletePhoto) fd.append("delete_photo", "1");
      if (photoFile && photoFile.size > 0) fd.append("photo", photoFile);

      const onUploadProgress = (e: any) => {
        if (e.total) setUploadProgress(Math.round((e.loaded * 100) / e.total));
      };

      if (editing) {
        try {
          await apiDelete(`/students/${editing.id}`);
        } catch (delErr: any) {
          throw new Error(
            delErr?.response?.data?.message ||
              "Gagal menghapus data siswa lama. Proses dibatalkan, data lama tetap utuh.",
          );
        }

        try {
          fd.append("id", String(editing.id));
          await api.post("/students", fd, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress,
          });
        } catch (insErr: any) {
          try {
            const rollback = new FormData();
            rollback.append("id", String(editing.id));
            rollback.append("nama", editing.nama || "");
            rollback.append("email", (editing as any).email || "");
            rollback.append("linkedin", (editing as any).linkedin || "");
            if ((editing as any).class_id)
              rollback.append("class_id", String((editing as any).class_id));
            if ((editing as any).cabang)
              rollback.append("cabang", String((editing as any).cabang));
            await api.post("/students", rollback, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            throw new Error(
              insErr?.response?.data?.message ||
                "Gagal menyimpan data baru. Data lama telah dipulihkan.",
            );
          } catch {
            throw new Error(
              insErr?.response?.data?.message ||
                "Gagal menyimpan data baru dan gagal memulihkan data lama. Silakan periksa data siswa.",
            );
          }
        }
      } else {
        await api.post("/students", fd, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress,
        });
      }

      toast.success(editing ? "Data siswa berhasil diperbarui" : "Siswa berhasil ditambahkan");
      setOpen(false);
      reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiDelete(`/students/${deleteTarget.id}`);
      toast.success("Siswa berhasil dihapus");
      setDeleteTarget(null);
      reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Gagal menghapus siswa");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Data Siswa</h1>
          <p className="text-sm text-muted-foreground">
            {isGuru && guruCabang
              ? `Menampilkan siswa cabang ${CABANG_LABEL[guruCabang as Cabang] ?? guruCabang}`
              : "Kelola data siswa semua cabang"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate({ to: "/students/import-export" })}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Import/Export
          </Button>
          <Button onClick={openNew}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Siswa
          </Button>
        </div>
      </div>

      {isGuru && guruCabang && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
          <Info className="h-4 w-4 flex-shrink-0" />
          <span>
            Anda login sebagai <strong>Guru</strong>. Hanya siswa dari cabang{" "}
            <strong>{CABANG_LABEL[guruCabang as Cabang] ?? guruCabang}</strong> yang ditampilkan.
          </span>
        </div>
      )}

      <Card className="p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama / email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {!isGuru && (
          <Select
            value={cabangFilter}
            onValueChange={(v) => { setCabangFilter(v); setClassFilter("all"); }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Semua Cabang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Cabang</SelectItem>
              {CABANG_LIST.map((c) => (
                <SelectItem key={c} value={c}>{CABANG_LABEL[c]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Semua Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kelas</SelectItem>
            {(classesData || []).map((k) => (
              <SelectItem key={k.id} value={String(k.id)}>{k.nama_kelas}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">Foto</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Kelas</TableHead>
              {!isGuru && <TableHead>Cabang</TableHead>}
              <TableHead>LinkedIn</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={isGuru ? 6 : 7}>
                    <div className="h-8 bg-muted animate-pulse rounded" />
                  </TableCell>
                </TableRow>
              ))
            )}
            {!loading && (data?.items || []).length === 0 && (
              <TableRow>
                <TableCell colSpan={isGuru ? 6 : 7} className="text-center py-10 text-muted-foreground">
                  Tidak ada data siswa ditemukan.
                </TableCell>
              </TableRow>
            )}
            {!loading && (data?.items || []).map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <StudentAvatar photo={s.photo} nama={s.nama} />
                </TableCell>
                <TableCell className="font-medium capitalize">{s.nama}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{s.email || "—"}</TableCell>
                <TableCell className="text-sm">{s.nama_kelas || "—"}</TableCell>
                {!isGuru && (
                  <TableCell>
                    <CabangBadge cabang={s.cabang} />
                  </TableCell>
                )}
                <TableCell className="text-sm">
                  {s.linkedin ? (
                    <a
                      href={s.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <Linkedin className="h-3 w-3" /> Profile
                    </a>
                  ) : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(s)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {data?.pagination && data.pagination.last_page > 1 && (
          <div className="flex items-center justify-between p-3 border-t text-sm">
            <span className="text-muted-foreground">
              Halaman {data.pagination.current_page} dari {data.pagination.last_page} •{" "}
              Total {data.pagination.total} siswa
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.pagination.last_page}
                onClick={() => setPage((p) => p + 1)}
              >
                Berikutnya
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Siswa" : "Tambah Siswa"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <div className="space-y-2">
              <Label>Foto Siswa</Label>
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0 border-2 border-dashed border-border">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Label
                    htmlFor="photo-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 border rounded-md hover:bg-secondary text-sm"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Pilih Foto
                  </Label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    className="hidden"
                    onChange={onPickPhoto}
                    disabled={saving}
                  />
                  {photoPreview && (
                    <Button type="button" variant="ghost" size="sm" onClick={removePhoto} disabled={saving}>
                      <X className="h-3.5 w-3.5 mr-1" /> Hapus
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground">JPG, PNG, WEBP — maks. 2MB</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nama Lengkap <span className="text-destructive">*</span></Label>
              <Input
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Nama siswa"
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@example.com"
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label>LinkedIn</Label>
              <Input
                value={form.linkedin}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                disabled={saving}
              />
            </div>

            {isGuru ? (
              <div className="space-y-2">
                <Label>Cabang</Label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted text-sm text-muted-foreground">
                  <Info className="h-3.5 w-3.5" />
                  {CABANG_LABEL[guruCabang as Cabang] ?? guruCabang ?? "—"}{" "}
                  <span className="text-xs">(otomatis dari akun Anda)</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Cabang <span className="text-destructive">*</span></Label>
                <Select
                  value={form.cabang}
                  onValueChange={(v) => setForm({ ...form, cabang: v, class_id: "" })}
                  disabled={saving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih cabang" />
                  </SelectTrigger>
                  <SelectContent>
                    {CABANG_LIST.map((c) => (
                      <SelectItem key={c} value={c}>{CABANG_LABEL[c]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Kelas <span className="text-destructive">*</span></Label>
              <Select
                value={form.class_id}
                onValueChange={(v) => setForm({ ...form, class_id: v })}
                disabled={saving || (!isGuru && !form.cabang) || (formClasses ?? []).length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !isGuru && !form.cabang
                        ? "Pilih cabang dulu"
                        : (formClasses ?? []).length === 0
                        ? "Tidak ada kelas tersedia"
                        : "Pilih kelas"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {(formClasses ?? []).map((k) => (
                    <SelectItem key={k.id} value={String(k.id)}>{k.nama_kelas}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {saving && uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-1">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Mengupload foto: {uploadProgress}%
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Batal
            </Button>
            <Button
              onClick={save}
              disabled={saving || !form.nama.trim() || !form.class_id || (!isGuru && !form.cabang)}
            >
              {saving
                ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />{uploadProgress > 0 ? `Upload ${uploadProgress}%` : "Menyimpan..."}</>)
                : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Siswa?</AlertDialogTitle>
            <AlertDialogDescription>
              Siswa <span className="font-semibold text-foreground">{deleteTarget?.nama}</span> akan
              dihapus dari sistem. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
