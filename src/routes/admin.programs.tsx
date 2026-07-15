import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Pencil, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin-shell";
import { PROGRAMS } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/programs")({
  component: Programs,
});

function Programs() {
  const [list, setList] = useState<string[]>(PROGRAMS.filter((p) => p !== "Other Program"));
  const [adding, setAdding] = useState("");

  const add = () => {
    if (!adding.trim()) return;
    setList([...list, adding.trim()]);
    setAdding("");
    toast.success("Program added successfully");
  };

  return (
    <AdminShell title="Programme Management">
      <p className="text-sm text-muted-foreground mb-6">Manage the list of approved BSc programmes available during registration.</p>
      
      <div className="glass-panel rounded-xl p-6 shadow-card">
        <h2 className="font-heading text-sm font-semibold text-primary-navy mb-4">Add new programme</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={adding}
            onChange={(e) => setAdding(e.target.value)}
            placeholder="e.g. BSc Computer Science"
            className="form-input flex-1"
          />
          <button onClick={add} className="btn-primary">
            <Plus className="h-4 w-4" /> Add Programme
          </button>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="font-heading text-sm font-semibold text-primary-navy mb-4">Active Programmes ({list.length})</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {list.map((p) => (
            <div key={p} className="flex items-center justify-between glass-panel rounded-xl p-4 shadow-sm transition hover:border-border/80">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-deep"><BookOpen className="h-5 w-5" /></span>
                <span className="truncate text-sm font-semibold text-foreground">{p}</span>
              </div>
              <div className="flex items-center gap-1">
                <button aria-label="Rename" className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                <button aria-label="Remove" onClick={() => { setList(list.filter((x) => x !== p)); toast.success("Program removed"); }} className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}