import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login, init, initialized, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@rapor.id");
  const [password, setPassword] = useState("admin123");
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
      <div className="hidden lg:flex flex-col justify-between bg-primary text-primary-foreground p-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-white/15 flex items-center justify-center font-bold">
            iD
          </div>
          <div>
            <div className="font-semibold">IDN Boarding School</div>
            <div className="text-xs opacity-80">Sistem Rapor Digital</div>
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-tight">
            Kelola rapor digital, lebih cepat & profesional.
          </h1>
          <p className="mt-3 opacity-80 text-sm max-w-md">
            Input nilai, kelola materi, dan generate rapor PDF presisi A4 untuk
            seluruh siswa dalam satu platform.
          </p>
        </div>
        <div className="text-xs opacity-70">© {new Date().getFullYear()} IDN Boarding School</div>
      </div>
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8">
          <h2 className="text-2xl font-bold">Masuk ke Akun</h2>
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
