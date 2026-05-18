import { useEffect, type ReactNode } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarDays,
  School,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  ListChecks,
  ClipboardEdit,
  FileText,
  StickyNote,
  LogOut,
  Menu,
  FolderKanban,
  Briefcase,
} from "lucide-react";
import { useAuth, type Role } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CabangBadge } from "@/components/CabangBadge";

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  roles: Role[];
}

const ALL: Role[] = ["superadmin", "admin", "guru"];
const ADMIN: Role[] = ["superadmin", "admin"];

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, roles: ALL },
  { to: "/semesters", label: "Semester", icon: <CalendarDays className="h-4 w-4" />, roles: ADMIN },
  { to: "/classes", label: "Kelas", icon: <School className="h-4 w-4" />, roles: ADMIN },
  { to: "/students", label: "Siswa", icon: <Users className="h-4 w-4" />, roles: ALL },
  { to: "/teachers", label: "Guru", icon: <GraduationCap className="h-4 w-4" />, roles: ADMIN },
  { to: "/subjects", label: "Mata Pelajaran", icon: <BookOpen className="h-4 w-4" />, roles: ADMIN },
  { to: "/materials", label: "Materi", icon: <Layers className="h-4 w-4" />, roles: ADMIN },
  { to: "/indicators", label: "Indikator", icon: <ListChecks className="h-4 w-4" />, roles: ADMIN },
  { to: "/grades", label: "Input Nilai", icon: <ClipboardEdit className="h-4 w-4" />, roles: ALL },
  { to: "/notes", label: "Catatan Siswa", icon: <StickyNote className="h-4 w-4" />, roles: ALL },
  { to: "/portfolio", label: "Portofolio", icon: <FolderKanban className="h-4 w-4" />, roles: ALL },
  { to: "/reports", label: "Rapor PDF", icon: <FileText className="h-4 w-4" />, roles: ALL },
  { to: "/project-reports", label: "Rapor Project", icon: <Briefcase className="h-4 w-4" />, roles: ALL },
];

export function AppLayout() {
  const { user, initialized, init, logout } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!initialized) init();
  }, [initialized, init]);

  useEffect(() => {
    if (initialized && !user) navigate({ to: "/login" });
  }, [initialized, user, navigate]);

  if (!initialized || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Memuat...
      </div>
    );
  }

  const role = user.role;
  const items = NAV.filter((n) => n.roles.includes(role));

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed z-40 h-screen w-64 transform border-r bg-card transition-transform lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            iD
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">Rapor Digital</div>
            <div className="text-xs text-muted-foreground">IDN Boarding School</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {items.map((item) => {
            const active = path === item.to || path.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/70 hover:bg-secondary hover:text-foreground",
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col lg:ml-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/80 px-4 backdrop-blur lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <div className="text-sm font-medium">Selamat datang, {user.name}</div>
              <div className="text-xs text-muted-foreground capitalize flex items-center gap-2">
                <span>{role}</span>
                {user.cabang && <CabangBadge cabang={user.cabang} />}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </header>

        <main className="flex-1 p-4 lg:p-6 max-w-full">
          <Outlet />
        </main>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}
