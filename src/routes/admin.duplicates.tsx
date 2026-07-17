import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { AlertTriangle, Check, X } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin-shell";
import { getAllRegistrations, deleteRegistration } from "@/lib/reg-store";
import type { Registration } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/duplicates")({
  component: Duplicates,
});

function Duplicates() {
  const [regs, setRegs] = useState<Registration[]>([]);
  const fetch = () => getAllRegistrations().then(setRegs);

  useEffect(() => {
    fetch();
  }, []);

  const dupes = useMemo(() => {
    const pairs: [Registration, Registration][] = [];
    const seen = new Map<string, Registration>();
    for (const r of regs) {
      const email = r.email.toLowerCase().trim();
      if (seen.has(email)) {
        pairs.push([seen.get(email)!, r]);
      } else {
        seen.set(email, r);
      }
    }
    return pairs;
  }, [regs]);

  const handleKeep = async (keepId: string, deleteId: string) => {
    try {
      await deleteRegistration(deleteId);
      toast.success("Duplicate resolved successfully");
      fetch();
    } catch {
      toast.error("Failed to delete record");
    }
  };

  const handleIgnore = (email: string) => {
    // In a real system, we'd add it to an ignore list. For now, we just toast.
    toast.success("Marked as unique");
  };

  if (dupes.length === 0) {
    return (
      <AdminShell title="Duplicate Review">
        <div className="mt-8 glass-panel rounded-xl p-12 text-center shadow-card">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success">
            <Check className="h-8 w-8" />
          </div>
          <p className="mt-4 font-heading text-lg font-semibold text-foreground">
            No possible duplicates
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            All registrations look unique. You're all caught up.
          </p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Duplicate Review">
      <p className="text-sm text-muted-foreground">
        Compare records that share similar details. Confirm which should be kept.
      </p>
      <div className="mt-6 grid gap-6">
        {dupes.map(([r1, r2]) => {
          return (
            <div key={r1.id + r2.id} className="glass-panel rounded-xl border border-warning/30 p-6">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-warning/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-warning">
                <AlertTriangle className="h-4 w-4" /> Possible duplicate detected (Matching Email)
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {[r1, r2].map((rec, i) => (
                  <div key={i} className="rounded-xl border border-border bg-muted/30 p-5">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <p className="font-heading text-sm font-bold text-primary-deep">
                        Record {i + 1}
                      </p>
                      <Link
                        to="/admin/students/$id"
                        params={{ id: rec.id }}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        View full profile
                      </Link>
                    </div>
                    <p className="mt-4 text-base font-bold text-foreground">{rec.fullName}</p>
                    <dl className="mt-3 grid gap-2.5 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Index</dt>
                        <dd className="font-medium text-foreground">{rec.index}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Email</dt>
                        <dd className="font-medium text-foreground truncate max-w-[60%]">
                          {rec.email}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Program</dt>
                        <dd className="font-medium text-foreground truncate max-w-[60%]">
                          {rec.program}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Registered</dt>
                        <dd className="font-medium text-foreground">
                          {new Date(rec.registrationDate).toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
                <button
                  onClick={() => handleIgnore(r1.email)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-white px-4 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <X className="h-4 w-4" /> Not a duplicate
                </button>
                <button
                  onClick={() => handleKeep(r1.id, r2.id)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-deep"
                >
                  Keep Record 1
                </button>
                <button
                  onClick={() => handleKeep(r2.id, r1.id)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-deep"
                >
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
