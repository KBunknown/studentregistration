import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { getAdminUsers, addAdminUser, removeAdminUser, type AdminUser } from "@/lib/reg-store";

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
  
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [loadingAdmins, setLoadingAdmins] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setAdmins(await getAdminUsers());
    } catch {
      toast.error("Failed to load admin team");
    } finally {
      setLoadingAdmins(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    try {
      await addAdminUser(newAdminEmail);
      toast.success("Admin added successfully");
      setNewAdminEmail("");
      fetchAdmins();
    } catch {
      toast.error("Failed to add admin. They might already exist.");
    }
  };

  const handleRemoveAdmin = async (id: string) => {
    if (!confirm("Remove this administrator?")) return;
    try {
      await removeAdminUser(id);
      toast.success("Admin removed");
      fetchAdmins();
    } catch {
      toast.error("Failed to remove admin");
    }
  };

  return (
    <AdminShell title="Settings">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass-panel rounded-xl p-6 shadow-card lg:col-span-2">
          <h2 className="font-heading text-base font-semibold text-primary-navy">
            Admin Team Management
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Only users with emails listed here are allowed to access the admin dashboard.
          </p>
          
          <div className="mt-6 rounded-lg border border-border overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Email Address</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {loadingAdmins ? (
                  <tr><td colSpan={2} className="p-4 text-center text-muted-foreground">Loading...</td></tr>
                ) : admins.length === 0 ? (
                  <tr><td colSpan={2} className="p-4 text-center text-muted-foreground">No admins found. Add yourself!</td></tr>
                ) : (
                  admins.map((a) => (
                    <tr key={a.id}>
                      <td className="px-4 py-3 font-medium text-foreground">{a.email}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleRemoveAdmin(a.id)}
                          className="inline-flex items-center gap-1.5 rounded text-xs font-semibold text-destructive hover:bg-destructive/10 px-2 py-1 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" /> Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            <div className="border-t border-border bg-muted/20 p-4">
              <form onSubmit={handleAddAdmin} className="flex gap-3">
                <input
                  type="email"
                  className={inputCls}
                  placeholder="new.admin@example.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-deep whitespace-nowrap"
                >
                  <Plus className="h-4 w-4" /> Add Admin
                </button>
              </form>
            </div>
          </div>
        </section>
        
        <section className="glass-panel rounded-xl p-6 shadow-card">
          <h2 className="font-heading text-base font-semibold text-primary-navy">
            Institution Branding
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure your institution name and logo. Leave blank to keep the neutral portal title.
          </p>
          <div className="mt-6 grid gap-5">
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-foreground">Institution Name</span>
              <input
                className={inputCls}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. University of Example"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-foreground">Logo URL</span>
              <input
                className={inputCls}
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="https://…/logo.svg"
              />
            </label>
          </div>
        </section>

        <section className="glass-panel rounded-xl p-6 shadow-card">
          <h2 className="font-heading text-base font-semibold text-primary-navy">
            Contact Information
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Displayed on public pages for student enquiries.
          </p>
          <div className="mt-6">
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-foreground">Registrar Email</span>
              <input
                type="email"
                className={inputCls}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="glass-panel rounded-xl p-6 shadow-card lg:col-span-2">
          <h2 className="font-heading text-base font-semibold text-primary-navy">
            Registration Window
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Open or close the public registration form. When closed, students will see a message.
          </p>
          <div className="mt-6 flex items-center gap-4 rounded-lg border border-border bg-muted/50 p-4">
            <button
              type="button"
              onClick={() => setOpenReg((v) => !v)}
              className={`relative h-7 w-12 rounded-full transition-colors ${openReg ? "bg-primary" : "bg-muted-foreground"}`}
              aria-label="Toggle registration window"
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${openReg ? "left-6" : "left-1"}`}
              />
            </button>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                {openReg ? "Registration is open" : "Registration is closed"}
              </span>
              <span className="text-xs text-muted-foreground">
                Students can {openReg ? "currently submit new" : "not submit"} registrations.
              </span>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => toast.success("Settings saved successfully")}
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-deep"
        >
          Save Settings
        </button>
      </div>
    </AdminShell>
  );
}
