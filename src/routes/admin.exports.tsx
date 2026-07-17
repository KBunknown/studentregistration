import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin-shell";
import { getAllRegistrations } from "@/lib/reg-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/exports")({
  component: ExportsPage,
});

function ExportsPage() {
  const [count, setCount] = useState(0);
  const [fmt, setFmt] = useState("csv");
  const [scope, setScope] = useState<"all" | "active" | "graduated">("all");

  useEffect(() => {
    getAllRegistrations().then((regs) => {
      if (scope === "active") setCount(regs.filter((r) => !r.graduated).length);
      else if (scope === "graduated") setCount(regs.filter((r) => r.graduated).length);
      else setCount(regs.length);
    });
  }, [scope]);

  const handleExport = () => {
    toast.success("Export queued successfully");
  };

  return (
    <AdminShell title="Exports">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-muted-foreground">
          Export registration data in your preferred format. Exports include all standard fields.
        </p>

        <div className="glass-panel mt-6 rounded-xl p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary">
              <Download className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-heading text-base font-semibold text-foreground">
                Export registrations
              </h2>
              <p className="text-sm text-muted-foreground">{count} records selected</p>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">File format</label>
              <div className="flex gap-2">
                {["csv", "xlsx", "json"].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFmt(f)}
                    className={cn(
                      "flex-1 rounded-md border py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors",
                      fmt === f
                        ? "border-primary bg-primary-soft text-primary-deep"
                        : "border-primary/15 bg-white/70 hover:bg-primary-soft/50",
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">Scope</label>
              <div className="grid gap-2">
                {(
                  [
                    { id: "all", label: "All registrations" },
                    { id: "active", label: "Active students only" },
                    { id: "graduated", label: "Graduated students only" },
                  ] as const
                ).map((opt) => (
                  <label
                    key={opt.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors",
                      scope === opt.id
                        ? "border-primary bg-primary-very-light/80"
                        : "border-primary/15 bg-white/60 hover:bg-white/80",
                    )}
                  >
                    <input
                      type="radio"
                      className="h-4 w-4 accent-primary"
                      checked={scope === opt.id}
                      onChange={() => setScope(opt.id)}
                    />
                    <span className="text-sm font-medium text-foreground">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="button" onClick={handleExport} className="btn-primary w-full sm:w-auto">
              <Download className="h-4 w-4" />
              Start export
            </button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
