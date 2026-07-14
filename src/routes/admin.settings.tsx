import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin-shell";

export const Route = createFileRoute("/admin/settings")({
  component: Settings,
});

const inputCls =
  "block w-full h-11 rounded-md border border-border bg-white px-3 text-sm shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";

function Settings() {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [contact, setContact] = useState("registrar@example.edu");
  const [openReg, setOpenReg] = useState(true);

  return (
    <AdminShell title="Settings">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-white p-6 shadow-card">
          <h2 className="font-heading text-base font-semibold text-primary-navy">Institution Branding</h2>
          <p className="mt-1 text-sm text-muted-foreground">Configure your institution name and logo. Leave blank to keep the neutral portal title.</p>
          <div className="mt-6 grid gap-5">
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-foreground">Institution Name</span>
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. University of Example" />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-foreground">Logo URL</span>
              <input className={inputCls} value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="https://…/logo.svg" />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-white p-6 shadow-card">
          <h2 className="font-heading text-base font-semibold text-primary-navy">Contact Information</h2>
          <p className="mt-1 text-sm text-muted-foreground">Displayed on public pages for student enquiries.</p>
          <div className="mt-6">
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-foreground">Registrar Email</span>
              <input type="email" className={inputCls} value={contact} onChange={(e) => setContact(e.target.value)} />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-white p-6 shadow-card lg:col-span-2">
          <h2 className="font-heading text-base font-semibold text-primary-navy">Registration Window</h2>
          <p className="mt-1 text-sm text-muted-foreground">Open or close the public registration form. When closed, students will see a message.</p>
          <div className="mt-6 flex items-center gap-4 rounded-lg border border-border bg-muted/50 p-4">
            <button 
              type="button" 
              onClick={() => setOpenReg((v) => !v)} 
              className={`relative h-7 w-12 rounded-full transition-colors ${openReg ? "bg-primary" : "bg-muted-foreground"}`}
              aria-label="Toggle registration window"
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${openReg ? "left-6" : "left-1"}`} />
            </button>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">{openReg ? "Registration is open" : "Registration is closed"}</span>
              <span className="text-xs text-muted-foreground">Students can {openReg ? "currently submit new" : "not submit"} registrations.</span>
            </div>
          </div>
        </section>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button onClick={() => toast.success("Settings saved successfully")} className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-deep">
          Save Settings
        </button>
      </div>
    </AdminShell>
  );
}