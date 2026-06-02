// routes/_authed/students/import-export.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { useAuth } from "@/stores/auth-store";
import { CABANG_LABEL, type Cabang } from "@/lib/cabang";
import { toast } from "sonner";
import {
  Download,
  Upload,
  Loader2,
  FileSpreadsheet,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/_authed/students/import-export")({
  component: ImportExportStudentsPage,
});

// ========== TYPES ==========
interface ImportError {
  row: number;
  column: string;
  message: string;
  data?: Record<string, any>;
}

interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: ImportError[];
}

// ========== UTILITY FUNCTIONS ==========

// Konversi Google Drive link ke direct download link
function convertGoogleDriveToDirectUrl(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  
  if (url.includes("drive.google.com/uc?export=download") || 
      url.includes("drive.usercontent.google.com")) {
    return url;
  }
  
  const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch) {
    const fileId = fileIdMatch[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  
  const openIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openIdMatch) {
    const fileId = openIdMatch[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  
  return url;
}

// Download gambar dari URL ke Blob
async function downloadImageFromUrl(url: string): Promise<Blob | null> {
  try {
    const directUrl = convertGoogleDriveToDirectUrl(url);
    if (!directUrl) return null;
    
    const response = await fetch(directUrl, {
      headers: { "Cache-Control": "no-cache" },
    });
    
    if (!response.ok) return null;
    
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error downloading image:", error);
    return null;
  }
}

// Validasi gambar
function validateImageBlob(blob: Blob): { valid: boolean; error?: string } {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!allowedTypes.includes(blob.type)) {
    return { 
      valid: false, 
      error: `Format gambar tidak didukung. Gunakan: ${allowedTypes.join(", ")}` 
    };
  }
  
  const maxSize = 2 * 1024 * 1024;
  if (blob.size > maxSize) {
    return { 
      valid: false, 
      error: `Ukuran gambar terlalu besar: ${(blob.size / 1024 / 1024).toFixed(2)}MB (maks 2MB)` 
    };
  }
  
  return { valid: true };
}

// Validasi data siswa
function validateStudentData(data: Record<string, any>, isGuru: boolean, guruCabang: string | null): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.nama || typeof data.nama !== "string" || !data.nama.trim()) {
    errors.push("Nama siswa wajib diisi");
  }
  
  if (!data.class_id) {
    errors.push("Kelas wajib dipilih");
  } else if (isNaN(Number(data.class_id))) {
    errors.push("Format kelas tidak valid");
  }
  
  if (!isGuru && !data.cabang) {
    errors.push("Cabang wajib dipilih");
  }
  
  if (data.email && typeof data.email === "string" && data.email.trim()) {
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.push("Format email tidak valid");
    }
  }
  
  if (data.linkedin && typeof data.linkedin === "string" && data.linkedin.trim()) {
    if (!data.linkedin.includes("linkedin.com")) {
      errors.push("URL LinkedIn tidak valid (harus dari linkedin.com)");
    }
  }
  
  return { valid: errors.length === 0, errors };
}

// Parse CSV
function parseCSV(csvText: string): { headers: string[]; rows: Record<string, any>[] } {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim());
  if (lines.length === 0) {
    throw new Error("File CSV kosong");
  }
  
  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, any>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, any> = {};
    headers.forEach((header, index) => {
      let value = values[index] || "";
      if (typeof value === "string") value = value.trim();
      row[header.toLowerCase()] = value || null;
    });
    rows.push(row);
  }
  
  return { headers, rows };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

// Generate template CSV
function generateTemplateCSV(isGuru: boolean, guruCabang: string | null): string {
  const headers = [
    "nama",
    "email",
    "linkedin",
    "class_id",
    ...(isGuru ? [] : ["cabang"]),
    "photo_url",
  ];
  
  const exampleRows = [
    {
      nama: "Ahmad Faizal",
      email: "ahmad.faizal@example.com",
      linkedin: "https://linkedin.com/in/ahmad-faizal",
      class_id: "1",
      ...(isGuru ? {} : { cabang: "jonggol" }),
      photo_url: "https://drive.google.com/file/d/EXAMPLE_ID/view",
    },
    {
      nama: "Siti Nurhaliza",
      email: "siti.nur@example.com",
      linkedin: "",
      class_id: "2",
      ...(isGuru ? {} : { cabang: "bogor" }),
      photo_url: "",
    },
  ];
  
  const csvRows = [headers.join(",")];
  
  for (const row of exampleRows) {
    const values = headers.map(header => {
      let value = row[header as keyof typeof row];
      if (value === undefined) value = "";
      if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(values.join(","));
  }
  
  return csvRows.join("\n");
}

// ========== MAIN COMPONENT ==========
function ImportExportStudentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isGuru = user?.role === "guru";
  const guruCabang = user?.cabang ?? null;
  
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  
  // Download template
  const handleDownloadTemplate = () => {
    const csvContent = generateTemplateCSV(isGuru, guruCabang);
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "template_import_siswa.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Template CSV berhasil diunduh");
  };
  
  // Proses import CSV
  const handleImport = async () => {
    if (!importFile) {
      toast.error("Pilih file CSV terlebih dahulu");
      return;
    }
    
    if (importFile.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 10MB");
      return;
    }
    
    if (!importFile.name.endsWith(".csv")) {
      toast.error("Hanya file CSV yang didukung");
      return;
    }
    
    setImporting(true);
    setImportResult(null);
    
    try {
      const csvText = await importFile.text();
      const { headers, rows } = parseCSV(csvText);
      
      const requiredHeaders = [
        "nama",
        "class_id",
        ...(isGuru ? [] : ["cabang"]),
      ];
      
      const missingHeaders = requiredHeaders.filter(
        h => !headers.map(hh => hh.toLowerCase()).includes(h)
      );
      
      if (missingHeaders.length > 0) {
        throw new Error(`Header yang diperlukan tidak ditemukan: ${missingHeaders.join(", ")}`);
      }
      
      const errors: ImportError[] = [];
      let successCount = 0;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNumber = i + 2;
        
        try {
          const validation = validateStudentData(row, isGuru, guruCabang);
          if (!validation.valid) {
            validation.errors.forEach(err => {
              errors.push({
                row: rowNumber,
                column: "general",
                message: err,
                data: row,
              });
            });
            continue;
          }
          
          let photoFile = null;
          let photoError = null;
          
          if (row.photo_url && typeof row.photo_url === "string" && row.photo_url.trim()) {
            try {
              const imageBlob = await downloadImageFromUrl(row.photo_url);
              if (!imageBlob) {
                photoError = "Gagal mendownload gambar dari URL yang diberikan";
              } else {
                const imageValidation = validateImageBlob(imageBlob);
                if (!imageValidation.valid) {
                  photoError = imageValidation.error;
                } else {
                  const extension = imageBlob.type.split("/")[1] || "jpg";
                  photoFile = new File([imageBlob], `temp_photo.${extension}`, { type: imageBlob.type });
                }
              }
            } catch (err) {
              photoError = `Error download gambar: ${err instanceof Error ? err.message : "Unknown error"}`;
            }
          }
          
          if (photoError) {
            errors.push({
              row: rowNumber,
              column: "photo_url",
              message: photoError,
              data: row,
            });
            continue;
          }
          
          const formData = new FormData();
          formData.append("nama", row.nama.trim());
          if (row.email) formData.append("email", row.email.trim());
          if (row.linkedin) formData.append("linkedin", row.linkedin.trim());
          formData.append("class_id", String(row.class_id));
          
          if (!isGuru && row.cabang) {
            formData.append("cabang", row.cabang);
          }
          
          if (photoFile) {
            formData.append("photo", photoFile);
          }
          
          await api.post("/students", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          
          successCount++;
        } catch (err: any) {
          errors.push({
            row: rowNumber,
            column: "general",
            message: err?.response?.data?.message || err?.message || "Gagal menyimpan data",
            data: row,
          });
        }
      }
      
      const result: ImportResult = {
        total: rows.length,
        success: successCount,
        failed: errors.length,
        errors,
      };
      
      setImportResult(result);
      
      if (errors.length === 0) {
        toast.success(`Berhasil mengimport ${successCount} siswa`);
        setTimeout(() => {
          setImportDialogOpen(false);
          setImportFile(null);
          navigate({ to: "/students" });
        }, 1500);
      } else {
        toast.warning(`Import selesai: ${successCount} berhasil, ${errors.length} gagal`);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal memproses file CSV");
      console.error(err);
    } finally {
      setImporting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/students" })}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Import & Export Data Siswa</h1>
          <p className="text-sm text-muted-foreground">
            Download template CSV, isi data, lalu import ke sistem
          </p>
        </div>
      </div>
      
      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Download Template Card */}
        <Card className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Download Template CSV</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Unduh file template yang berisi format kolom yang benar
                <br />
                Template sudah dilengkapi contoh data
              </p>
            </div>
            <Button onClick={handleDownloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>
        </Card>
        
        {/* Import CSV Card */}
        <Card className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Import CSV</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Upload file CSV yang sudah diisi
                <br />
                Maksimal ukuran file: 10MB
              </p>
            </div>
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
              <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Data Siswa dari CSV</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>File CSV</Label>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                      disabled={importing}
                    />
                    <p className="text-xs text-muted-foreground">
                      Pastikan format file sesuai dengan template yang disediakan
                    </p>
                  </div>
                  
                  {importResult && (
                    <div className="space-y-3">
                      <div className="rounded-lg border p-4">
                        <h4 className="font-medium mb-2">Hasil Import</h4>
                        <div className="flex items-center justify-between text-sm">
                          <span>Total baris:</span>
                          <span className="font-medium">{importResult.total}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-green-600">
                          <span>Berhasil:</span>
                          <span className="font-medium">{importResult.success}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-red-600">
                          <span>Gagal:</span>
                          <span className="font-medium">{importResult.failed}</span>
                        </div>
                      </div>
                      
                      {importResult.errors.length > 0 && (
                        <div className="space-y-2">
                          <button
                            onClick={() => setShowErrorDetails(!showErrorDetails)}
                            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:underline"
                          >
                            {showErrorDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            Detail Error ({importResult.errors.length})
                          </button>
                          
                          {showErrorDetails && (
                            <div className="max-h-64 overflow-y-auto rounded-lg border bg-muted/30 p-3">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-16">Baris</TableHead>
                                    <TableHead className="w-24">Kolom</TableHead>
                                    <TableHead>Error</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {importResult.errors.map((err, idx) => (
                                    <TableRow key={idx}>
                                      <TableCell className="font-mono text-xs">{err.row}</TableCell>
                                      <TableCell className="font-mono text-xs">{err.column}</TableCell>
                                      <TableCell className="text-xs text-red-600">
                                        {err.message}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-3 mt-4">
                  <Button variant="outline" onClick={() => {
                    setImportDialogOpen(false);
                    setImportFile(null);
                    setImportResult(null);
                  }} disabled={importing}>
                    Tutup
                  </Button>
                  <Button onClick={handleImport} disabled={!importFile || importing}>
                    {importing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      "Import Sekarang"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      </div>
      
      {/* Panduan Penggunaan */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Panduan Import CSV
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-xs">1</div>
              <div>
                <span className="font-medium">Download template CSV</span>
                <p className="text-muted-foreground mt-1">
                  Klik tombol "Download Template" untuk mendapatkan file template dengan format yang benar
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-xs">2</div>
              <div>
                <span className="font-medium">Isi data siswa di CSV</span>
                <p className="text-muted-foreground mt-1">
                  Isi data siswa sesuai kolom yang tersedia. Baris pertama (header) JANGAN dihapus atau diubah.
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li><span className="font-mono text-xs">nama</span> - Nama lengkap siswa (wajib)</li>
                  <li><span className="font-mono text-xs">email</span> - Alamat email siswa (opsional)</li>
                  <li><span className="font-mono text-xs">linkedin</span> - URL profil LinkedIn (opsional)</li>
                  <li><span className="font-mono text-xs">class_id</span> - ID kelas (wajib, lihat di menu Kelas)</li>
                  {!isGuru && <li><span className="font-mono text-xs">cabang</span> - Kode cabang (wajib untuk admin)</li>}
                  <li><span className="font-mono text-xs">photo_url</span> - URL foto dari Google Drive (opsional, maks 2MB)</li>
                </ul>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-xs">3</div>
              <div>
                <span className="font-medium">Upload & Import</span>
                <p className="text-muted-foreground mt-1">
                  Klik tombol "Import CSV", pilih file yang sudah diisi, lalu klik "Import Sekarang"
                </p>
                <div className="mt-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs">
                  <AlertCircle className="h-3 w-3 inline mr-1" />
                  Pastikan file CSV berukuran maksimal 10MB dan foto dari Google Drive dapat diakses publik
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
