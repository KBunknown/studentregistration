import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { getAllRegistrations } from "@/lib/reg-store";
import type { Registration } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/graduated")({
  component: Graduated,
});

function Graduated() {
  const [regs, setRegs] = useState<Registration[]>([]);
  useEffect(() => setRegs(getAllRegistrations()), []);
  const list = regs.filter((r) => r.graduated);

  return (
    <AdminShell title="Graduated Students">
      <p className="text-sm font-medium text-muted-foreground">{list.length} graduated students on record.</p>
      {list.length === 0 ? (
        <div className="mt-6 glass-panel rounded-xl p-12 text-center shadow-card">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-xl bg-primary-soft text-primary-deep"><GraduationCap className="h-8 w-8" /></div>
          <p className="mt-4 font-heading text-lg font-semibold text-foreground">No graduates yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Mark students as graduated from their individual profiles.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => (
            <Link key={r.id} to="/admin/students/$id" params={{ id: r.id }} className="group block glass-panel rounded-xl p-5 shadow-sm transition hover:border-primary/40 hover:shadow-card">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-success/10 text-success"><GraduationCap className="h-5 w-5" /></span>
                <div className="min-w-0">
                  <p className="truncate font-heading text-base font-bold text-foreground group-hover:text-primary transition-colors">{r.fullName}</p>
                  <p className="truncate text-xs font-medium text-muted-foreground mt-0.5">Class of {r.graduationYear} · {r.program}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AdminShell>
  );
}