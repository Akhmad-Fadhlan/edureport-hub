import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import gedungAsset from "@/assets/gedung-idn.png.asset.json";
import logoAsset from "@/assets/logo-idn.png.asset.json";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login, init, initialized, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialized) init();
  }, [initialized, init]);

  useEffect(() => {
    if (initialized && user) navigate({ to: "/dashboard" });
  }, [initialized, user, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, remember);
      toast.success("Login berhasil");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div
        className="relative hidden lg:flex flex-col justify-between p-10 text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, oklch(0.32 0.09 245 / 0.82), oklch(0.22 0.08 252 / 0.92)), url(${gedungAsset.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Soft glow overlays for elegance */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(800px 400px at 10% 0%, oklch(0.78 0.12 225 / 0.35), transparent 60%), radial-gradient(700px 500px at 100% 100%, oklch(0.55 0.16 235 / 0.35), transparent 60%)",
          }}
        />

        <div className="relative flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/25 flex items-center justify-center overflow-hidden">
            <img src={logoAsset.url} alt="IDN Boarding School" className="h-9 w-9 object-contain" />
          </div>
          <div>
            <div className="font-semibold tracking-tight">IDN Boarding School</div>
            <div className="text-xs opacity-80">Sistem Rapor Digital</div>
          </div>
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20 px-3 py-1 text-[11px] tracking-wide uppercase mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
            Kelola Rapor Digital
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight">
            Elegan, Presisi & <span className="text-sky-200">Profesional.</span>
          </h1>
          <p className="mt-4 text-sm xl:text-base opacity-85 max-w-md leading-relaxed">
            Input nilai, kelola materi, dan generate rapor PDF presisi A4 untuk
            seluruh siswa dalam satu platform yang tenang dan modern.
          </p>
        </div>

        <div className="relative text-xs opacity-70">
          © {new Date().getFullYear()} IDN Boarding School
        </div>
      </div>

      <div className="flex items-center justify-center p-6 bg-gradient-to-br from-background to-secondary/40">
        <Card className="w-full max-w-md p-8 shadow-[var(--shadow-elegant)] border-border/60">
          <div className="flex lg:hidden items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
              <img src={logoAsset.url} alt="Logo" className="h-7 w-7 object-contain" />
            </div>
            <div className="font-semibold">IDN Boarding School</div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Masuk ke Akun</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Masukkan kredensial Anda untuk melanjutkan.
          </p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Masuk
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
