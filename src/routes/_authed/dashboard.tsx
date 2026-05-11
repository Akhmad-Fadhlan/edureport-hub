import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { useApiData } from "@/hooks/use-api-data";
import { Users, GraduationCap, Layers, ListChecks, CalendarCheck } from "lucide-react";

export const Route = createFileRoute("/_authed/dashboard")({
  component: Dashboard,
});

interface Stat {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

function Dashboard() {
  const students = useApiData<{ items: any[]; pagination?: any }>("/students");
  const teachers = useApiData<any[]>("/teachers");
  const materials = useApiData<any[]>("/materials");
  const indicators = useApiData<any[]>("/indicators");
  const semesters = useApiData<any[]>("/semesters");

  const activeSemester = (semesters.data || []).find((s) => s.is_active === 1);

  const stats: Stat[] = [
    {
      label: "Total Siswa",
      value: students.data?.pagination?.total ?? students.data?.items?.length ?? 0,
      icon: <Users className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Total Guru",
      value: teachers.data?.length ?? 0,
      icon: <GraduationCap className="h-5 w-5" />,
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Total Materi",
      value: materials.data?.length ?? 0,
      icon: <Layers className="h-5 w-5" />,
      color: "bg-amber-100 text-amber-700",
    },
    {
      label: "Total Indikator",
      value: indicators.data?.length ?? 0,
      icon: <ListChecks className="h-5 w-5" />,
      color: "bg-violet-100 text-violet-700",
    },
    {
      label: "Semester Aktif",
      value: activeSemester?.nama_semester ?? "-",
      icon: <CalendarCheck className="h-5 w-5" />,
      color: "bg-rose-100 text-rose-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Ringkasan data sistem rapor digital.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="text-2xl font-bold mt-1">{s.value}</div>
              </div>
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.color}`}>
                {s.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
