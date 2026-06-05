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
import { useAuth } from "@/stores/auth-store";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authed/classes")({
  component: ClassesPage,
});

interface Klass { 
  id: number; 
  nama_kelas: string; 
  cabang: string; // 'jonggol', 'pamijahan', 'akhwat', 'solo', 'sentul'
  tingkat_kelas?: number | null;
}

// Mapping untuk display name cabang
const CABANG_LABELS: Record<string, string> = {
  jonggol: 'Jonggol',
  pamijahan: 'Pamijahan',
  akhwat: 'Akhwat',
  solo: 'Solo',
  sentul: 'Sentul'
};

const CABANG_OPTIONS = [
  { value: 'jonggol', label: 'Jonggol' },
  { value: 'pamijahan', label: 'Pamijahan' },
  { value: 'akhwat', label: 'Akhwat' },
  { value: 'solo', label: 'Solo' },
  { value: 'sentul', label: 'Sentul' }
];

function ClassesPage() {
  const { isGuru, getCabangId, user } = useAuth();
  const guruMode = isGuru();
  const cabangId = getCabangId();
  
  // Mapping dari cabang_id (number) ke cabang (string enum)
  const getCabangEnum = (id: number | null): string | null => {
    const mapping: Record<number, string> = {
      1: 'jonggol',
      2: 'pamijahan',
      3: 'akhwat', 
      4: 'solo',
      5: 'sentul'
    };
    return id ? mapping[id] || null : null;
  };

  // Build params untuk API
  const params: any = {};
  if (guruMode && cabangId) {
    const cabangEnum = getCabangEnum(cabangId);
    if (cabangEnum) params.cabang = cabangEnum;
  }

  const { data, loading, reload, error } = useApiData<Klass[]>("/classes", params);
  
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Klass | null>(null);
  const [namaKelas, setNamaKelas] = useState("");
  const [selectedCabang, setSelectedCabang] = useState<string>("jonggol");

  // Untuk superadmin, bisa pilih cabang
  const canSelectCabang = user?.role === 'superadmin';

  function openNew() { 
    setEditing(null); 
    setNamaKelas(""); 
    setSelectedCabang(guruMode && cabangId ? getCabangEnum(cabangId) || 'jonggol' : 'jonggol');
    setOpen(true); 
  }
  
  function openEdit(k: Klass) { 
    setEditing(k); 
    setNamaKelas(k.nama_kelas); 
    setSelectedCabang(k.cabang || 'jonggol');
    setOpen(true); 
  }

  async function save() {
    try {
      const payload: any = { 
        nama_kelas: namaKelas,
        cabang: selectedCabang
      };
      
      if (editing) {
        await apiPut(`/classes/${editing.id}`, payload);
      } else {
        await apiPost("/classes", payload);
      }
      toast.success("Tersimpan"); 
      setOpen(false); 
      reload();
    } catch (e: any) { 
      toast.error(e?.response?.data?.message || "Gagal menyimpan"); 
    }
  }
  
  async function del(id: number) {
    if (!confirm("Hapus kelas ini? Data siswa di kelas ini juga akan terpengaruh.")) return;
    try { 
      await apiDelete(`/classes/${id}`); 
      toast.success("Dihapus"); 
      reload(); 
    } catch (e: any) { 
      toast.error(e?.response?.data?.message || "Gagal menghapus"); 
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kelas</h1>
          <p className="text-sm text-muted-foreground">
            {guruMode && cabangId
              ? `Kelola daftar kelas untuk cabang ${CABANG_LABELS[getCabangEnum(cabangId) || 'jonggol']}.`
              : "Kelola daftar kelas siswa di semua cabang."}
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Kelas
        </Button>
      </div>
      
      {error && <Card className="p-4 text-sm text-destructive bg-destructive/10">{error}</Card>}
      
      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Nama Kelas</TableHead>
              <TableHead>Cabang</TableHead>
              <TableHead>Tingkat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary rounded-full border-t-transparent"></div>
                    Memuat...
                  </div>
                </TableCell>
              </TableRow>
            )}
            
            {!loading && (data || []).map((k) => (
              <TableRow key={k.id}>
                <TableCell>{k.id}</TableCell>
                <TableCell className="font-medium">{k.nama_kelas}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs bg-muted">
                    {CABANG_LABELS[k.cabang] || k.cabang}
                  </span>
                </TableCell>
                <TableCell>
                  {k.tingkat_kelas ? (
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      Kelas {k.tingkat_kelas}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(k)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => del(k.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            
            {!loading && (!data || data.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  Belum ada kelas. Klik "Tambah Kelas" untuk membuat kelas baru.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Dialog Tambah/Edit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Kelas" : "Tambah Kelas Baru"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nama_kelas">Nama Kelas</Label>
              <Input 
                id="nama_kelas"
                value={namaKelas} 
                onChange={(e) => setNamaKelas(e.target.value)} 
                placeholder="Contoh: 8A, 7B, 9C"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Gunakan format seperti "8A" untuk kelas 8, atau "7B" untuk kelas 7.
              </p>
            </div>
            
            {(canSelectCabang || !editing) && (
              <div className="space-y-2">
                <Label htmlFor="cabang">Cabang</Label>
                <Select value={selectedCabang} onValueChange={setSelectedCabang}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih cabang" />
                  </SelectTrigger>
                  <SelectContent>
                    {CABANG_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!canSelectCabang && editing && (
                  <p className="text-xs text-muted-foreground">
                    Cabang tidak dapat diubah setelah kelas dibuat.
                  </p>
                )}
              </div>
            )}
            
            {!canSelectCabang && editing && (
              <div className="space-y-2">
                <Label>Cabang Saat Ini</Label>
                <div className="p-2 bg-muted rounded-md text-sm">
                  {CABANG_LABELS[selectedCabang] || selectedCabang}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={save} disabled={!namaKelas.trim()}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
