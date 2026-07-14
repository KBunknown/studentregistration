import { createFileRoute } from "@tanstack/react-router";
import { FileClock } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { MOCK_AUDIT } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/audit")({
  component: Audit,
});

function Audit() {
  return (
    <AdminShell title="Audit Log">
      <p className="text-sm text-muted-foreground mb-6">Chronological record of administrative actions taken in the portal.</p>
      
      <div className="rounded-xl border border-border bg-white shadow-card overflow-hidden">
        <ul className="divide-y divide-border">
          {MOCK_AUDIT.map((e) => (
            <li key={e.id} className="p-5 hover:bg-muted/30 transition-colors">
              <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 items-start">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary-deep"><FileClock className="h-5 w-5" /></span>
                <div className="min-w-0">
                  <p className="truncate font-heading text-sm font-bold text-foreground">{e.action}</p>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">
                    <span className="font-semibold text-foreground">{e.actor}</span> · {e.when}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Target: <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">{e.target}</span>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AdminShell>
  );
}