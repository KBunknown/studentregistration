import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UserPlus, Mail, ShieldCheck, MoreHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin-shell";
import { MOCK_ADMINS } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/admins")({
  component: Admins,
});

function Admins() {
  const [invite, setInvite] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <AdminShell title="Super Admins">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-muted-foreground">Manage who has access to the admin console.</p>
        <button
          onClick={() => setInvite(true)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-deep"
        >
          <UserPlus className="h-4 w-4" /> Invite Admin
        </button>
      </div>

      <div className="mt-6 glass-panel overflow-hidden rounded-xl">
        <ul className="divide-y divide-border">
          {MOCK_ADMINS.map((a) => (
            <li
              key={a.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_140px_120px_auto] hover:bg-muted/30 transition-colors"
            >
              <div className="flex min-w-0 items-center gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary-deep">
                  {a.name
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-heading text-sm font-semibold text-foreground">
                    {a.name}
                  </p>
                  <p className="truncate text-xs font-medium text-muted-foreground mt-0.5">
                    {a.email}
                  </p>
                </div>
              </div>
              <span className="hidden items-center gap-1.5 rounded-full border border-primary/20 bg-primary-very-light px-2.5 py-1 text-xs font-semibold text-primary-deep sm:inline-flex">
                <ShieldCheck className="h-3.5 w-3.5" /> {a.role}
              </span>
              <p className="hidden text-xs font-medium text-muted-foreground sm:block">
                {a.lastActive}
              </p>
              <button className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {invite && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white shadow-modal">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="font-heading text-lg font-semibold text-primary-navy">
                Invite Super Admin
              </h3>
              <button
                onClick={() => setInvite(false)}
                className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-5 p-6">
              <label className="grid gap-1.5">
                <span className="text-sm font-medium text-foreground">Email address</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="new-admin@example.edu"
                    className="block w-full h-11 rounded-md border border-border bg-white pl-10 pr-3 text-sm shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                  />
                </div>
              </label>
              <p className="text-sm text-muted-foreground">
                They'll receive a secure link to activate their super admin account. The link
                expires in 7 days.
              </p>
              <div className="mt-2 flex justify-end gap-3">
                <button
                  onClick={() => setInvite(false)}
                  className="rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.success("Invitation sent successfully");
                    setInvite(false);
                    setEmail("");
                  }}
                  className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-deep"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
