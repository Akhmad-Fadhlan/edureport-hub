import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useApiData } from "@/hooks/use-api-data";
import { useAuth } from "@/stores/auth-store";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Youtube,
  Award,
  Bot,
  Palette,
  GraduationCap,
  BarChart3,
  ExternalLink,
  ImageIcon,
} from "lucide-react";
import {
  getStudentSummary,
  getTeachingActivities,
  getDesignProjects,
  getRoboticsProjects,
  getYoutubeVideos,
  getCertificates,
  createTeachingActivity,
  updateTeachingActivity,
  deleteTeachingActivity,
  createDesignProject,
  updateDesignProject,
  deleteDesignProject,
  createRoboticsProject,
  updateRoboticsProject,
  deleteRoboticsProject,
  createYoutubeVideo,
  updateYoutubeVideo,
  deleteYoutubeVideo,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  getYoutubeVideoId,
  resolveUploadUrl,
  type StudentSummary,
  type TeachingActivity,
  type DesignProject,
  type RoboticsProject,
  type YoutubeVideo,
  type Certificate,
} from "@/lib/portfolio-api";

export const Route = createFileRoute("/_authed/portfolio")({
  component: PortfolioPage,
});

// ── SUMMARY CARD ─────────────────────────────────────────────────────────────

function SummaryCard({ summary }: { summary: StudentSummary | null }) {
  if (!summary) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        Belum ada data ringkasan portofolio.
      </Card>
    );
  }
  const stats = [
    { label: "Total Tercapai", value: summary.total_tercapai, color: "text-green-600" },
    { label: "Belum Tercapai", value: summary.belum_tercapai, color: "text-red-500" },
    { label: "Selesai", value: summary.selesai, color: "text-blue-600" },
    { label: "Belum Selesai", value: summary.belum_selesai, color: "text-orange-500" },
    { label: "Desain", value: summary.total_desain, color: "text-purple-600" },
    { label: "Robotik", value: summary.total_robotik, color: "text-cyan-600" },
    { label: "Video YT", value: summary.total_video_youtube, color: "text-red-600" },
    { label: "Sertifikat", value: summary.total_sertifikat, color: "text-yellow-600" },
    { label: "Mengajar", value: summary.total_mengajar, color: "text-indigo-600" },
    { label: "Buku", value: summary.total_buku, color: "text-teal-600" },
    { label: "Lomba IT", value: summary.total_lomba_it, color: "text-pink-600" },
  ];
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">Ringkasan Portofolio</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{summary.persentase.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Persentase</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{summary.tuntas}</div>
            <div className="text-xs text-muted-foreground">Tuntas</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-muted/40 rounded-lg p-2 text-center">
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground leading-tight">{s.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── TEACHING TAB ─────────────────────────────────────────────────────────────

function TeachingTab({
  studentId,
  semesterId,
}: {
  studentId: number;
  semesterId: number;
}) {
  const [items, setItems] = useState<TeachingActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TeachingActivity | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    lokasi: "",
    tanggal: "",
    tema: "",
    jumlah_peserta: "",
    cerita_siswa: "",
    testimoni_peserta: "",
  });
  const [foto1, setFoto1] = useState<File | null>(null);
  const [foto2, setFoto2] = useState<File | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTeachingActivities(studentId, semesterId);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [studentId, semesterId]);

  useEffect(() => { load(); }, [load]);

  function openAdd() {
    setEditing(null);
    setForm({ lokasi: "", tanggal: "", tema: "", jumlah_peserta: "", cerita_siswa: "", testimoni_peserta: "" });
    setFoto1(null);
    setFoto2(null);
    setOpen(true);
  }

  function openEdit(item: TeachingActivity) {
    setEditing(item);
    setForm({
      lokasi: item.lokasi ?? "",
      tanggal: item.tanggal ?? "",
      tema: item.tema ?? "",
      jumlah_peserta: item.jumlah_peserta ? String(item.jumlah_peserta) : "",
      cerita_siswa: item.cerita_siswa ?? "",
      testimoni_peserta: item.testimoni_peserta ?? "",
    });
    setFoto1(null);
    setFoto2(null);
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("student_id", String(studentId));
      fd.append("semester_id", String(semesterId));
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (foto1) fd.append("foto_mengajar_1", foto1);
      if (foto2) fd.append("foto_mengajar_2", foto2);

      if (editing) {
        await updateTeachingActivity(editing.id, fd);
        toast.success("Kegiatan mengajar diperbarui");
      } else {
        await createTeachingActivity(fd);
        toast.success("Kegiatan mengajar ditambahkan");
      }
      setOpen(false);
      await load();
    } catch {
      toast.error("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus kegiatan ini?")) return;
    try {
      await deleteTeachingActivity(id);
      toast.success("Dihapus");
      await load();
    } catch {
      toast.error("Gagal menghapus");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-sm text-muted-foreground">Kegiatan Mengajar</h3>
        <Button size="sm" onClick={openAdd}>
          <Plus className="h-4 w-4 mr-1" /> Tambah
        </Button>
      </div>
      {loading ? (
        <div className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></div>
      ) : items.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground text-sm">Belum ada kegiatan mengajar.</Card>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1 flex-1">
                  <div className="font-medium">{item.tema || "(Tanpa tema)"}</div>
                  <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                    {item.lokasi && <span>📍 {item.lokasi}</span>}
                    {item.tanggal && <span>📅 {item.tanggal}</span>}
                    {item.jumlah_peserta && <span>👥 {item.jumlah_peserta} peserta</span>}
                  </div>
                  {item.cerita_siswa && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.cerita_siswa}</p>
                  )}
                  {(item.foto_mengajar_1 || item.foto_mengajar_2) && (
                    <div className="flex gap-2 mt-2">
                      {[item.foto_mengajar_1, item.foto_mengajar_2].filter(Boolean).map((f, i) => {
                        const url = resolveUploadUrl(f);
                        return url ? (
                          <img key={i} src={url} alt={`foto ${i+1}`} className="h-14 w-14 object-cover rounded border" />
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 ml-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Kegiatan Mengajar" : "Tambah Kegiatan Mengajar"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label>Lokasi</Label>
              <Input value={form.lokasi} onChange={(e) => setForm({ ...form, lokasi: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Tanggal</Label>
                <Input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} />
              </div>
              <div>
                <Label>Jumlah Peserta</Label>
                <Input type="number" value={form.jumlah_peserta} onChange={(e) => setForm({ ...form, jumlah_peserta: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Tema</Label>
              <Input value={form.tema} onChange={(e) => setForm({ ...form, tema: e.target.value })} />
            </div>
            <div>
              <Label>Cerita Siswa</Label>
              <Textarea rows={3} value={form.cerita_siswa} onChange={(e) => setForm({ ...form, cerita_siswa: e.target.value })} />
            </div>
            <div>
              <Label>Testimoni Peserta</Label>
              <Textarea rows={2} value={form.testimoni_peserta} onChange={(e) => setForm({ ...form, testimoni_peserta: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Foto 1</Label>
                <Input type="file" accept="image/*" onChange={(e) => setFoto1(e.target.files?.[0] ?? null)} />
              </div>
              <div>
                <Label>Foto 2</Label>
                <Input type="file" accept="image/*" onChange={(e) => setFoto2(e.target.files?.[0] ?? null)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── PROJECT TAB (Generic for Design & Robotics) ───────────────────────────────

type ProjectItem = { id: number; judul: string; link_file_flyer?: string; deskripsi?: string; teknologi?: string; kompetensi_siswa?: string; };
type ProjectType = "design" | "robotics";

function ProjectTab({
  type,
  studentId,
  semesterId,
}: {
  type: ProjectType;
  studentId: number;
  semesterId: number;
}) {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ judul: "", link_file_flyer: "", deskripsi: "", teknologi: "", kompetensi_siswa: "" });

  const getFn = type === "design" ? getDesignProjects : getRoboticsProjects;
  const createFn = type === "design" ? createDesignProject : createRoboticsProject;
  const updateFn = type === "design" ? updateDesignProject : updateRoboticsProject;
  const deleteFn = type === "design" ? deleteDesignProject : deleteRoboticsProject;
  const label = type === "design" ? "Desain" : "Robotik";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFn(studentId, semesterId);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [studentId, semesterId, type]);

  useEffect(() => { load(); }, [load]);

  function openAdd() {
    setEditing(null);
    setForm({ judul: "", link_file_flyer: "", deskripsi: "", teknologi: "", kompetensi_siswa: "" });
    setOpen(true);
  }

  function openEdit(item: ProjectItem) {
    setEditing(item);
    setForm({
      judul: item.judul,
      link_file_flyer: item.link_file_flyer ?? "",
      deskripsi: item.deskripsi ?? "",
      teknologi: item.teknologi ?? "",
      kompetensi_siswa: item.kompetensi_siswa ?? "",
    });
    setOpen(true);
  }

  async function handleSave() {
    if (!form.judul.trim()) { toast.error("Judul wajib diisi"); return; }
    setSaving(true);
    try {
      const payload = { student_id: studentId, semester_id: semesterId, ...form };
      if (editing) {
        await updateFn(editing.id, payload);
        toast.success(`Karya ${label} diperbarui`);
      } else {
        await createFn(payload);
        toast.success(`Karya ${label} ditambahkan`);
      }
      setOpen(false);
      await load();
    } catch {
      toast.error("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm(`Hapus karya ${label} ini?`)) return;
    try {
      await deleteFn(id);
      toast.success("Dihapus");
      await load();
    } catch {
      toast.error("Gagal menghapus");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-sm text-muted-foreground">Karya {label}</h3>
        <Button size="sm" onClick={openAdd}>
          <Plus className="h-4 w-4 mr-1" /> Tambah
        </Button>
      </div>
      {loading ? (
        <div className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></div>
      ) : items.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground text-sm">Belum ada karya {label.toLowerCase()}.</Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.judul}</div>
                  {item.teknologi && (
                    <Badge variant="secondary" className="text-xs mt-1">{item.teknologi}</Badge>
                  )}
                  {item.kompetensi_siswa && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.kompetensi_siswa}</p>
                  )}
                  {item.deskripsi && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.deskripsi}</p>
                  )}
                  {item.link_file_flyer && (
                    <a href={item.link_file_flyer} target="_blank" rel="noopener noreferrer"
                       className="text-xs text-primary flex items-center gap-1 mt-1">
                      <ExternalLink className="h-3 w-3" /> Lihat File
                    </a>
                  )}
                </div>
                <div className="flex gap-1 ml-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit Karya ${label}` : `Tambah Karya ${label}`}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label>Judul <span className="text-destructive">*</span></Label>
              <Input value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} />
            </div>
            <div>
              <Label>Link File / Flyer</Label>
              <Input placeholder="https://..." value={form.link_file_flyer} onChange={(e) => setForm({ ...form, link_file_flyer: e.target.value })} />
            </div>
            <div>
              <Label>Teknologi</Label>
              <Input placeholder="Canva, Arduino, dll" value={form.teknologi} onChange={(e) => setForm({ ...form, teknologi: e.target.value })} />
            </div>
            <div>
              <Label>Kompetensi Siswa</Label>
              <Input value={form.kompetensi_siswa} onChange={(e) => setForm({ ...form, kompetensi_siswa: e.target.value })} />
            </div>
            <div>
              <Label>Deskripsi</Label>
              <Textarea rows={3} value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── YOUTUBE TAB ───────────────────────────────────────────────────────────────

function YoutubeTab({ studentId, semesterId }: { studentId: number; semesterId: number }) {
  const [items, setItems] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<YoutubeVideo | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ judul_video: "", deskripsi_video: "", link_youtube: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await getYoutubeVideos(studentId, semesterId)); }
    finally { setLoading(false); }
  }, [studentId, semesterId]);

  useEffect(() => { load(); }, [load]);

  function openAdd() {
    setEditing(null);
    setForm({ judul_video: "", deskripsi_video: "", link_youtube: "" });
    setOpen(true);
  }

  function openEdit(item: YoutubeVideo) {
    setEditing(item);
    setForm({ judul_video: item.judul_video, deskripsi_video: item.deskripsi_video ?? "", link_youtube: item.link_youtube });
    setOpen(true);
  }

  async function handleSave() {
    if (!form.judul_video.trim() || !form.link_youtube.trim()) {
      toast.error("Judul dan link YouTube wajib diisi"); return;
    }
    setSaving(true);
    try {
      const payload = { student_id: studentId, semester_id: semesterId, ...form };
      if (editing) { await updateYoutubeVideo(editing.id, payload); toast.success("Video diperbarui"); }
      else { await createYoutubeVideo(payload); toast.success("Video ditambahkan"); }
      setOpen(false);
      await load();
    } catch { toast.error("Gagal menyimpan"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus video ini?")) return;
    try { await deleteYoutubeVideo(id); toast.success("Dihapus"); await load(); }
    catch { toast.error("Gagal menghapus"); }
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-sm text-muted-foreground">Video YouTube</h3>
        <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1" /> Tambah</Button>
      </div>
      {loading ? (
        <div className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></div>
      ) : items.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground text-sm">Belum ada video YouTube.</Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => {
            const videoId = getYoutubeVideoId(item.link_youtube);
            const thumb = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
            return (
              <Card key={item.id} className="overflow-hidden">
                {thumb && <img src={thumb} alt={item.judul_video} className="w-full h-36 object-cover" />}
                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{item.judul_video}</div>
                      {item.deskripsi_video && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.deskripsi_video}</p>
                      )}
                      <a href={item.link_youtube} target="_blank" rel="noopener noreferrer"
                         className="text-xs text-red-600 flex items-center gap-1 mt-1">
                        <Youtube className="h-3 w-3" /> Tonton di YouTube
                      </a>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Video" : "Tambah Video YouTube"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label>Judul Video <span className="text-destructive">*</span></Label>
              <Input value={form.judul_video} onChange={(e) => setForm({ ...form, judul_video: e.target.value })} />
            </div>
            <div>
              <Label>Link YouTube <span className="text-destructive">*</span></Label>
              <Input placeholder="https://youtube.com/watch?v=..." value={form.link_youtube} onChange={(e) => setForm({ ...form, link_youtube: e.target.value })} />
            </div>
            <div>
              <Label>Deskripsi</Label>
              <Textarea rows={3} value={form.deskripsi_video} onChange={(e) => setForm({ ...form, deskripsi_video: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── CERTIFICATE TAB ───────────────────────────────────────────────────────────

function CertificateTab({ studentId, semesterId }: { studentId: number; semesterId: number }) {
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ lingkup: "", tanggal: "", tema: "" });
  const [imgFile, setImgFile] = useState<File | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await getCertificates(studentId, semesterId)); }
    finally { setLoading(false); }
  }, [studentId, semesterId]);

  useEffect(() => { load(); }, [load]);

  function openAdd() {
    setEditing(null);
    setForm({ lingkup: "", tanggal: "", tema: "" });
    setImgFile(null);
    setOpen(true);
  }

  function openEdit(item: Certificate) {
    setEditing(item);
    setForm({ lingkup: item.lingkup ?? "", tanggal: item.tanggal ?? "", tema: item.tema ?? "" });
    setImgFile(null);
    setOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("student_id", String(studentId));
      fd.append("semester_id", String(semesterId));
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (imgFile) fd.append("gambar_sertifikat", imgFile);
      if (editing) { await updateCertificate(editing.id, fd); toast.success("Sertifikat diperbarui"); }
      else { await createCertificate(fd); toast.success("Sertifikat ditambahkan"); }
      setOpen(false);
      await load();
    } catch { toast.error("Gagal menyimpan"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus sertifikat ini?")) return;
    try { await deleteCertificate(id); toast.success("Dihapus"); await load(); }
    catch { toast.error("Gagal menghapus"); }
  }

  const LINGKUP_OPTIONS = ["Sekolah", "Kota", "Nasional", "Internasional"];

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-sm text-muted-foreground">Sertifikat</h3>
        <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1" /> Tambah</Button>
      </div>
      {loading ? (
        <div className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></div>
      ) : items.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground text-sm">Belum ada sertifikat.</Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item) => {
            const imgUrl = resolveUploadUrl(item.gambar_sertifikat);
            return (
              <Card key={item.id} className="overflow-hidden">
                {imgUrl ? (
                  <img src={imgUrl} alt={item.tema} className="w-full h-32 object-cover" />
                ) : (
                  <div className="w-full h-32 bg-muted flex items-center justify-center">
                    <Award className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-sm line-clamp-1">{item.tema || "(Tanpa tema)"}</div>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {item.lingkup && <Badge variant="outline" className="text-xs">{item.lingkup}</Badge>}
                        {item.tanggal && <span className="text-xs text-muted-foreground">{item.tanggal}</span>}
                      </div>
                    </div>
                    <div className="flex gap-1 ml-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Sertifikat" : "Tambah Sertifikat"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label>Tema / Nama Kegiatan</Label>
              <Input value={form.tema} onChange={(e) => setForm({ ...form, tema: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Lingkup</Label>
                <Select value={form.lingkup} onValueChange={(v) => setForm({ ...form, lingkup: v })}>
                  <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                  <SelectContent>
                    {LINGKUP_OPTIONS.map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tanggal</Label>
                <Input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Gambar Sertifikat</Label>
              <Input type="file" accept="image/*" onChange={(e) => setImgFile(e.target.files?.[0] ?? null)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

function PortfolioPage() {
  const { isGuru, getCabangId } = useAuth();
  const guruMode = isGuru();
  const cabangId = getCabangId();

  const semesters = useApiData<any[]>("/semesters");
  const classParams: any = {};
  if (guruMode && cabangId) classParams.cabang_id = cabangId;
  const classes = useApiData<any[]>("/classes", classParams);

  const [semesterId, setSemesterId] = useState("");
  const [classId, setClassId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [summary, setSummary] = useState<StudentSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    if (!semesterId && semesters.data) {
      const active = semesters.data.find((s: any) => s.is_active === 1);
      if (active) setSemesterId(String(active.id));
    }
  }, [semesters.data, semesterId]);

  const students = useApiData<{ items: any[] }>(
    classId ? "/students" : null,
    { class_id: classId, per_page: 200, ...(guruMode && cabangId ? { cabang_id: cabangId } : {}) },
  );

  useEffect(() => {
    if (!studentId || !semesterId) { setSummary(null); return; }
    setLoadingSummary(true);
    getStudentSummary(parseInt(studentId), parseInt(semesterId))
      .then(setSummary)
      .finally(() => setLoadingSummary(false));
  }, [studentId, semesterId]);

  const selectedStudent = (students.data?.items ?? []).find(
    (s: any) => String(s.id) === studentId,
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Portofolio Siswa</h1>
        <p className="text-sm text-muted-foreground">
          Kelola kegiatan mengajar, karya desain, robotik, video, sertifikat siswa.
        </p>
      </div>

      {/* Filter */}
      <Card className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <div className="space-y-2">
          <Label>Semester</Label>
          <Select value={semesterId} onValueChange={setSemesterId}>
            <SelectTrigger><SelectValue placeholder="Semester" /></SelectTrigger>
            <SelectContent>
              {(semesters.data ?? []).map((s: any) => (
                <SelectItem key={s.id} value={String(s.id)}>{s.nama_semester}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Kelas</Label>
          <Select value={classId} onValueChange={(v) => { setClassId(v); setStudentId(""); setSummary(null); }}>
            <SelectTrigger><SelectValue placeholder="Pilih kelas" /></SelectTrigger>
            <SelectContent>
              {(classes.data ?? []).map((k: any) => (
                <SelectItem key={k.id} value={String(k.id)}>{k.nama_kelas}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Siswa</Label>
          <Select value={studentId} onValueChange={(v) => { setStudentId(v); setSummary(null); }} disabled={!classId}>
            <SelectTrigger><SelectValue placeholder="Pilih siswa" /></SelectTrigger>
            <SelectContent>
              {(students.data?.items ?? []).map((s: any) => (
                <SelectItem key={s.id} value={String(s.id)}>{s.nama}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {!studentId ? (
        <Card className="p-12 text-center text-muted-foreground">
          Pilih semester, kelas, dan siswa untuk melihat portofolio.
        </Card>
      ) : (
        <>
          {/* Summary */}
          {loadingSummary ? (
            <div className="text-center py-4"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></div>
          ) : (
            <SummaryCard summary={summary} />
          )}

          {/* Tabs */}
          <Tabs defaultValue="teaching">
            <TabsList className="flex flex-wrap h-auto gap-1">
              <TabsTrigger value="teaching" className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4" /> Mengajar
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center gap-1.5">
                <Palette className="h-4 w-4" /> Desain
              </TabsTrigger>
              <TabsTrigger value="robotics" className="flex items-center gap-1.5">
                <Bot className="h-4 w-4" /> Robotik
              </TabsTrigger>
              <TabsTrigger value="youtube" className="flex items-center gap-1.5">
                <Youtube className="h-4 w-4" /> YouTube
              </TabsTrigger>
              <TabsTrigger value="certificates" className="flex items-center gap-1.5">
                <Award className="h-4 w-4" /> Sertifikat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="teaching" className="mt-4">
              <TeachingTab studentId={parseInt(studentId)} semesterId={parseInt(semesterId)} />
            </TabsContent>
            <TabsContent value="design" className="mt-4">
              <ProjectTab type="design" studentId={parseInt(studentId)} semesterId={parseInt(semesterId)} />
            </TabsContent>
            <TabsContent value="robotics" className="mt-4">
              <ProjectTab type="robotics" studentId={parseInt(studentId)} semesterId={parseInt(semesterId)} />
            </TabsContent>
            <TabsContent value="youtube" className="mt-4">
              <YoutubeTab studentId={parseInt(studentId)} semesterId={parseInt(semesterId)} />
            </TabsContent>
            <TabsContent value="certificates" className="mt-4">
              <CertificateTab studentId={parseInt(studentId)} semesterId={parseInt(semesterId)} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
