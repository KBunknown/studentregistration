import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  CalendarCheck2,
  CalendarRange,
  GraduationCap,
  Globe2,
  BookOpen,
  Copy,
  UserCheck,
  CalendarDays,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { AdminShell } from "@/components/admin-shell";
import { getAllRegistrations } from "@/lib/reg-store";
import type { Registration } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin dashboard | International Student Registration" },
      {
        name: "description",
        content: "Admin dashboard for International Student Registration.",
      },
    ],
  }),
  component: Dashboard,
});

const COLORS = [
  "#155EEF",
  "#123A75",
  "#2E6FE8",
  "#16875B",
  "#B7791F",
  "#C43D4B",
  "#8B5CF6",
  "#0EA5E9",
];

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="glass-panel rounded-xl p-5 transition-all hover:shadow-card-hover">
      <div className="flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary">
          <Icon className="h-4 w-4" />
        </span>
        {hint && (
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {hint}
          </span>
        )}
      </div>
      <p className="mt-4 font-heading text-2xl font-bold tabular-nums text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-xl p-5">
      <h3 className="font-heading mb-4 text-sm font-semibold text-foreground">{title}</h3>
      <div className="h-64 sm:h-72">{children}</div>
    </div>
  );
}

function Dashboard() {
  const [regs, setRegs] = useState<Registration[]>([]);
  useEffect(() => {
    getAllRegistrations().then(setRegs);
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const total = regs.length;
    const todayCount = regs.filter(
      (r) => new Date(r.registrationDate).toDateString() === today,
    ).length;
    const monthCount = regs.filter((r) => {
      const d = new Date(r.registrationDate);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length;
    const now = new Date();
    const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const weekCount = regs.filter((r) => new Date(r.registrationDate) >= weekAgo).length;
    const active = regs.filter((r) => !r.graduated).length;
    const grad = regs.filter((r) => r.graduated).length;
    const countries = new Set(regs.map((r) => r.country)).size;
    const programs = new Set(regs.map((r) => r.program)).size;
    const dupes = regs.filter((r) => r.duplicateOf).length;
    const bscCount = regs.filter((r) => r.study_type === "bsc").length;
    const mastersCount = regs.filter((r) => r.study_type === "masters").length;
    const certCount = regs.filter((r) => r.study_type === "english_certificate").length;
    return { total, todayCount, monthCount, weekCount, active, grad, countries, programs, dupes, bscCount, mastersCount, certCount };
  }, [regs]);

  const byProgram = useMemo(() => {
    const m = new Map<string, number>();
    regs.forEach((r) => m.set(r.program, (m.get(r.program) || 0) + 1));
    return Array.from(m.entries())
      .map(([name, value]) => ({ name: name.length > 22 ? name.slice(0, 20) + "…" : name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [regs]);

  const byCountry = useMemo(() => {
    const m = new Map<string, number>();
    regs.forEach((r) => m.set(r.country, (m.get(r.country) || 0) + 1));
    return Array.from(m.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [regs]);

  const stageLabels: Record<string, string> = {
    "level_100": "Level 100",
    "level_200": "Level 200",
    "level_300": "Level 300",
    "level_400": "Level 400",
    "masters_year_1": "Master's Year 1",
    "masters_year_2": "Master's Year 2",
    "english_certificate_year_1": "English Cert.",
  };

  const byLevel = useMemo(() => {
    const m = new Map<string, number>();
    regs.forEach((r) => {
      const stage = r.academic_stage || r.level || "Unknown";
      const label = stageLabels[stage] || stage;
      m.set(label, (m.get(label) || 0) + 1);
    });
    return Array.from(m.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [regs]);

  const byStudyType = [
    { name: "BSc", value: stats.bscCount },
    { name: "Master's", value: stats.mastersCount },
    { name: "English Cert.", value: stats.certCount },
  ].filter((d) => d.value > 0);

  const byMonth = useMemo(() => {
    const m = new Map<string, number>();
    regs.forEach((r) => {
      const d = new Date(r.registrationDate);
      const key = d.toLocaleString(undefined, { month: "short" });
      m.set(key, (m.get(key) || 0) + 1);
    });
    const order = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return order.filter((k) => m.has(k)).map((k) => ({ name: k, value: m.get(k)! }));
  }, [regs]);

  const activeVsGrad = [
    { name: "Active", value: stats.active },
    { name: "Graduated", value: stats.grad },
  ];

  return (
    <AdminShell title="Dashboard">
      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Stat icon={Users} label="Total registrations" value={stats.total} />
        <Stat icon={CalendarCheck2} label="Registrations today" value={stats.todayCount} />
        <Stat icon={CalendarDays} label="Registrations this week" value={stats.weekCount} />
        <Stat icon={CalendarRange} label="Registrations this month" value={stats.monthCount} />
        <Stat icon={UserCheck} label="Active students" value={stats.active} />
        <Stat icon={GraduationCap} label="Graduated students" value={stats.grad} />
        <Stat icon={Globe2} label="Countries represented" value={stats.countries} />
        <Stat icon={BookOpen} label="Programs represented" value={stats.programs} />
        <Stat icon={Copy} label="Possible duplicates" value={stats.dupes} hint="Review" />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Registrations by program">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byProgram} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid stroke="#EAF2FF" horizontal={false} />
              <XAxis type="number" stroke="#526174" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="#526174" fontSize={11} width={140} />
              <Tooltip cursor={{ fill: "#F5F8FF" }} />
              <Bar dataKey="value" fill="#155EEF" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Registrations by country">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byCountry} margin={{ left: 8, right: 8 }}>
              <CartesianGrid stroke="#EAF2FF" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#526174"
                fontSize={11}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#526174" fontSize={11} />
              <Tooltip cursor={{ fill: "#F5F8FF" }} />
              <Bar dataKey="value" fill="#123A75" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Registrations by academic stage">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={byLevel}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
              >
                {byLevel.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Registrations by month">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={byMonth} margin={{ left: 8, right: 8 }}>
              <CartesianGrid stroke="#EAF2FF" vertical={false} />
              <XAxis dataKey="name" stroke="#526174" fontSize={11} />
              <YAxis stroke="#526174" fontSize={11} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#155EEF"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Registrations by study type">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={byStudyType} dataKey="value" nameKey="name" outerRadius={90}>
                {byStudyType.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </AdminShell>
  );
}
