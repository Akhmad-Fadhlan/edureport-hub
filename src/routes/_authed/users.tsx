import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { apiPost, apiPut, apiDelete } from "@/lib/api";
import { toast } from "sonner";
import {
  Pencil,
  Plus,
  Trash2,
  Search,
  Users,
  UserCheck,
  UserX,
  Building2,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { CabangBadge } from "@/components/CabangBadge";
import { CABANG_LIST, CABANG_LABEL, type Cabang } from "@/lib/cabang";
import { useAuth } from "@/stores/auth-store";

export const Route = createFileRoute("/_authed/users")({
  component: UsersPage,
});

type Role = "superadmin" | "admin" | "guru";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  cabang: Cabang | null;
  is_active: 0 | 1;
  last_login: string | null;
  created_at: string;
}

interface UserForm {
  name: string;
  email: string;
  password: string;
  role: Role;
  cabang: string;
  is_active: string;
}

const ROLE_LABEL: Record<Role, string> = {
  superadmin: "Superadmin",
  admin: "Admin",
  guru: "Guru",
};

const ROLE_BADGE_CLASS: Record<Role, string> = {
  superadmin: "bg-violet-100 text-violet-700 border-violet-200",
  admin: "bg-blue-100 text-blue-700 border-blue-200",
  guru: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-2xl font-bold mt-1">{value}</div>
        </div>
        <div
          className={`h-10 w-10 rounded-lg flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

function UsersPage() {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();

  // Guard: only superadmin
  useEffect(() => {
    if (authUser && authUser.role !== "superadmin") {
      toast.error("Akses ditolak. Hanya superadmin yang dapat mengakses halaman ini.");
      navigate({ to: "/dashboard" });
    }
  }, [authUser, navigate]);

  const [cabangFilter, setCabangFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const params: Record<string, string> = {};
  if (cabangFilter !== "all") params.cabang = cabangFilter;

  const { data: rawData, loading, reload } = useApiData<User[]>("/users", params);

  // Client-side filter (role, status, search)
  const data = (rawData || []).filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (statusFilter === "1" && !u.is_active) return false;
    if (statusFilter === "0" && u.is_active) return false;
    if (
      search &&
      !u.name.toLowerCase().includes(search.toLowerCase()) &&
      !u.email.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const totalActive = (rawData || []).filter((u) => u.is_active).length;
  const totalInactive = (rawData || []).filter((u) => !u.is_active).length;
  const uniqueCabang = new Set((rawData || []).map((u) => u.cabang).filter(Boolean)).size;

  // Form state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<UserForm>({
    name: "",
    email: "",
    password: "",
    role: "guru",
    cabang: "",
    is_active: "1",
  });

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openNew() {
    setEditing(null);
    setShowPassword(false);
    setForm({ name: "", email: "", password: "", role: "guru", cabang: "", is_active: "1" });
    setOpen(true);
  }

  function openEdit(u: User) {
    setEditing(u);
    setShowPassword(false);
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role,
      cabang: u.cabang || "",
      is_active: String(u.is_active),
    });
    setOpen(true);
  }

  async function save() {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Nama dan email wajib diisi");
      return;
    }
    if (!editing && !form.password) {
      toast.error("Password wajib diisi untuk user baru");
      return;
    }
    if (!form.cabang) {
      toast.error("Cabang wajib dipilih");
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        cabang: form.cabang,
      };
      if (form.password) payload.password = form.password;
      if (editing) payload.is_active = parseInt(form.is_active);

      if (editing) {
        await apiPut(`/users/${editing.id}`, payload);
        toast.success("User berhasil diperbarui");
      } else {
        await apiPost("/users", payload);
        toast.success("User berhasil ditambahkan");
      }

      setOpen(false);
      reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiDelete(`/users/${deleteTarget.id}`);
      toast.success("User berhasil dinonaktifkan");
      setDeleteTarget(null);
      reload();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Gagal menonaktifkan user");
    } finally {
      setDeleting(false);
    }
  }

  // Don't render if not superadmin
  if (authUser && authUser.role !== "superadmin") return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Manajemen User</h1>
            <span className="inline-flex items-center gap-1 text-xs bg-violet-100 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-full font-medium">
              <ShieldCheck className="h-3 w-3" />
              Superadmin Only
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Kelola akun pengguna sistem rapor digital.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Total User"
          value={rawData?.length ?? "—"}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          icon={<UserCheck className="h-5 w-5" />}
          label="Aktif"
          value={rawData ? totalActive : "—"}
          color="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          icon={<UserX className="h-5 w-5" />}
          label="Nonaktif"
          value={rawData ? totalInactive : "—"}
          color="bg-rose-100 text-rose-700"
        />
        <StatCard
          icon={<Building2 className="h-5 w-5" />}
          label="Cabang"
          value={rawData ? uniqueCabang : "—"}
          color="bg-amber-100 text-amber-700"
        />
      </div>

      {/* Filters */}
      <Card className="p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={cabangFilter} onValueChange={setCabangFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Semua Cabang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Cabang</SelectItem>
            {CABANG_LIST.map((c) => (
              <SelectItem key={c} value={c}>
                {CABANG_LABEL[c]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Semua Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Role</SelectItem>
            <SelectItem value="superadmin">Superadmin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="guru">Guru</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="1">Aktif</SelectItem>
            <SelectItem value="0">Nonaktif</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Cabang</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Login Terakhir</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memuat data...
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!loading && data.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  Tidak ada user ditemukan.
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              data.map((u, i) => (
                <TableRow key={u.id}>
                  <TableCell className="text-muted-foreground text-sm">{i + 1}</TableCell>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${ROLE_BADGE_CLASS[u.role]}`}
                    >
                      {ROLE_LABEL[u.role]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <CabangBadge cabang={u.cabang} />
                  </TableCell>
                  <TableCell>
                    {u.is_active ? (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                        Aktif
                      </Badge>
                    ) : (
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100">
                        Nonaktif
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {fmtDate(u.last_login)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(u)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(u)}
                        title="Nonaktifkan"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={u.id === authUser?.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>

      {/* Form Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit User" : "Tambah User Baru"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-1">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nama lengkap"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@domain.com"
              />
            </div>
            <div className="space-y-2">
              <Label>{editing ? "Password Baru (opsional)" : "Password"}</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={editing ? "Kosongkan jika tidak diubah" : "Min. 6 karakter"}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) => setForm({ ...form, role: v as Role })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guru">Guru</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="superadmin">Superadmin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cabang</Label>
                <Select
                  value={form.cabang}
                  onValueChange={(v) => setForm({ ...form, cabang: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih cabang" />
                  </SelectTrigger>
                  <SelectContent>
                    {CABANG_LIST.map((c) => (
                      <SelectItem key={c} value={c}>
                        {CABANG_LABEL[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {editing && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.is_active}
                  onValueChange={(v) => setForm({ ...form, is_active: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Aktif</SelectItem>
                    <SelectItem value="0">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Batal
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nonaktifkan User?</AlertDialogTitle>
            <AlertDialogDescription>
              User <span className="font-semibold text-foreground">{deleteTarget?.name}</span>{" "}
              ({deleteTarget?.email}) akan dinonaktifkan dan tidak dapat login lagi. Tindakan ini
              dapat dibatalkan dengan mengaktifkan kembali user tersebut.
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
              Nonaktifkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
