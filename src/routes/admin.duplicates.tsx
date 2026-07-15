import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, Check, X } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin-shell";
import { getAllRegistrations } from "@/lib/reg-store";
import type { Registration } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/duplicates")({
  component: Duplicates,
});

function Duplicates() {
  const [regs, setRegs] = useState<Registration[]>([]);
  useEffect(() => setRegs(getAllRegistrations()), []);

  const dupes = regs.filter((r) => r.duplicateOf);

  if (dupes.length === 0) {
    return (
      <AdminShell title="Duplicate Review">
        <div className="mt-8 glass-panel rounded-xl p-12 text-center shadow-card">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success"><Check className="h-8 w-8" /></div>
          <p className="mt-4 font-heading text-lg font-semibold text-foreground">No possible duplicates</p>
          <p className="mt-1 text-sm text-muted-foreground">All registrations look unique. You're all caught up.</p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Duplicate Review">
      <p className="text-sm text-muted-foreground">Compare records that share similar details. Confirm which should be kept.</p>
      <div className="mt-6 grid gap-6">
        {dupes.map((r) => {
          const other = regs.find((x) => x.id === r.duplicateOf);
          if (!other) return null;
          return (
            <div key={r.id} className="glass-panel rounded-xl border border-warning/30 p-6">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-warning/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-warning">
                <AlertTriangle className="h-4 w-4" /> Possible duplicate detected
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {[r, other].map((rec, i) => (
                  <div key={i} className="rounded-xl border border-border bg-muted/30 p-5">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <p className="font-heading text-sm font-bold text-primary-deep">Record {i + 1}</p>
                      <Link to="/admin/students/$id" params={{ id: rec.id }} className="text-xs font-semibold text-primary hover:underline">View full profile</Link>
                    </div>
                    <p className="mt-4 text-base font-bold text-foreground">{rec.fullName}</p>
                    <dl className="mt-3 grid gap-2.5 text-sm">
                      <div className="flex justify-between"><dt className="text-muted-foreground">Index</dt><dd className="font-medium text-foreground">{rec.index}</dd></div>
                      <div className="flex justify-between"><dt className="text-muted-foreground">Email</dt><dd className="font-medium text-foreground truncate max-w-[60%]">{rec.email}</dd></div>
                      <div className="flex justify-between"><dt className="text-muted-foreground">Program</dt><dd className="font-medium text-foreground truncate max-w-[60%]">{rec.program}</dd></div>
                      <div className="flex justify-between"><dt className="text-muted-foreground">Registered</dt><dd className="font-medium text-foreground">{new Date(rec.registrationDate).toLocaleDateString()}</dd></div>
                    </dl>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
                <button onClick={() => toast.success("Marked as unique")} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-white px-4 text-sm font-medium transition-colors hover:bg-muted">
                  <X className="h-4 w-4" /> Not a duplicate
                </button>
                <button onClick={() => toast.success("Kept Record 1, removed Record 2")} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-deep">
                  Keep Record 1
                </button>
                <button onClick={() => toast.success("Kept Record 2, removed Record 1")} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-deep">
                  Keep Record 2
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}