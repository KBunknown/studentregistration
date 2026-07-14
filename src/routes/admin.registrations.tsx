import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search, Filter, Download, UserPlus, X, ChevronDown, MoreHorizontal, Eye, Pencil, GraduationCap,
} from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { getAllRegistrations } from "@/lib/reg-store";
import { COUNTRIES, LEVELS, PROGRAMS, type Registration } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/registrations")({
  component: RegistrationsPage,
});

type SortKey =
  | "newest" | "oldest" | "name_asc" | "name_desc"
  | "program" | "level" | "grad_year" | "country" | "graduation_status";

function StatusBadge({ graduated }: { graduated: boolean }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
      graduated
        ? "border-success/30 bg-success/10 text-success"
        : "border-primary/30 bg-primary-soft text-primary-deep",
    )}>
      {graduated ? "Graduated" : "Active"}
    </span>
  );
}

function RegistrationsPage() {
  const [regs, setRegs] = useState<Registration[]>([]);
  const [q, setQ] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [filters, setFilters] = useState({
    program: "", level: "", gradYear: "", gradStatus: "", country: "", gender: "",
    from: "", to: "", dupe: "",
  });
  const [sort, setSort] = useState<SortKey>("newest");

  useEffect(() => setRegs(getAllRegistrations()), []);

  const filtered = useMemo(() => {
    let out = regs;
    if (q.trim()) {
      const s = q.toLowerCase();
      out = out.filter((r) =>
        r.fullName.toLowerCase().includes(s) ||
        r.email.toLowerCase().includes(s) ||
        r.index.includes(s),
      );
    }
    if (filters.program) out = out.filter((r) => r.program === filters.program);
    if (filters.level) out = out.filter((r) => r.level === filters.level);
    if (filters.gradYear) out = out.filter((r) => String(r.graduationYear) === filters.gradYear);
    if (filters.gradStatus) out = out.filter((r) => (filters.gradStatus === "graduated") === r.graduated);
    if (filters.country) out = out.filter((r) => r.country === filters.country);
    if (filters.gender) out = out.filter((r) => r.gender === filters.gender);
    if (filters.from) out = out.filter((r) => new Date(r.registrationDate) >= new Date(filters.from));
    if (filters.to) out = out.filter((r) => new Date(r.registrationDate) <= new Date(filters.to));
    if (filters.dupe) out = out.filter((r) => (filters.dupe === "possible") === !!r.duplicateOf);

    const cmp: Record<SortKey, (a: Registration, b: Registration) => number> = {
      newest: (a, b) => +new Date(b.registrationDate) - +new Date(a.registrationDate),
      oldest: (a, b) => +new Date(a.registrationDate) - +new Date(b.registrationDate),
      name_asc: (a, b) => a.fullName.localeCompare(b.fullName),
      name_desc: (a, b) => b.fullName.localeCompare(a.fullName),
      program: (a, b) => a.program.localeCompare(b.program),
      level: (a, b) => a.level.localeCompare(b.level),
      grad_year: (a, b) => a.graduationYear - b.graduationYear,
      country: (a, b) => a.country.localeCompare(b.country),
      graduation_status: (a, b) => Number(a.graduated) - Number(b.graduated),
    };
    return [...out].sort(cmp[sort]);
  }, [regs, q, filters, sort]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const clearFilters = () =>
    setFilters({ program: "", level: "", gradYear: "", gradStatus: "", country: "", gender: "", from: "", to: "", dupe: "" });

  return (
    <AdminShell title="Registrations">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, index…"
            className="block w-full rounded-md border border-border bg-white pl-9 pr-3 py-2.5 h-10 text-sm shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowFilters((s) => !s)}
            className={cn(
              "inline-flex items-center gap-2 rounded-md border border-border bg-white px-3 h-10 text-sm font-medium transition-colors hover:bg-muted",
              activeFilterCount > 0 && "border-primary text-primary-deep",
            )}
          >
            <Filter className="h-4 w-4" /> Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">{activeFilterCount}</span>
            )}
          </button>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="appearance-none rounded-md border border-border bg-white pl-3 pr-9 h-10 text-sm font-medium transition-colors hover:bg-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name_asc">Name A–Z</option>
              <option value="name_desc">Name Z–A</option>
              <option value="program">Program</option>
              <option value="level">Level</option>
              <option value="grad_year">Expected graduation year</option>
              <option value="country">Country</option>
              <option value="graduation_status">Graduation status</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <button
            onClick={() => setShowExport(true)}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-3 h-10 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Download className="h-4 w-4" /> Export
          </button>
          <button
            onClick={() => setShowInvite(true)}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 h-10 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-deep hidden sm:inline-flex"
          >
            <UserPlus className="h-4 w-4" /> Invite admin
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mt-4 rounded-xl border border-border bg-white p-5 shadow-card">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect label="Program" value={filters.program} onChange={(v) => setFilters({ ...filters, program: v })} options={PROGRAMS} />
            <FilterSelect label="Level" value={filters.level} onChange={(v) => setFilters({ ...filters, level: v })} options={[...LEVELS]} />
            <FilterSelect label="Expected graduation year" value={filters.gradYear} onChange={(v) => setFilters({ ...filters, gradYear: v })} options={["2026","2027","2028","2029"]} />
            <FilterSelect label="Graduation status" value={filters.gradStatus} onChange={(v) => setFilters({ ...filters, gradStatus: v })} options={["active","graduated"]} />
            <FilterSelect label="Country" value={filters.country} onChange={(v) => setFilters({ ...filters, country: v })} options={COUNTRIES.map((c) => c.name)} />
            <FilterSelect label="Gender" value={filters.gender} onChange={(v) => setFilters({ ...filters, gender: v })} options={["Female","Male","Other","Prefer not to say"]} />
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-foreground">Registration from</label>
              <input type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} className="h-10 rounded-md border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-foreground">Registration to</label>
              <input type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} className="h-10 rounded-md border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <FilterSelect label="Duplicate status" value={filters.dupe} onChange={(v) => setFilters({ ...filters, dupe: v })} options={["possible","unique"]} />
          </div>
          <div className="mt-5 flex justify-end">
            <button onClick={clearFilters} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Clear all filters</button>
          </div>
        </div>
      )}

      <p className="mt-5 text-sm text-muted-foreground font-medium">
        Showing <span className="text-foreground">{filtered.length}</span> of {regs.length} registrations
      </p>

      {/* Desktop table */}
      <div className="mt-4 hidden rounded-xl border border-border bg-white shadow-card md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted">
              <tr>
                <Th>Full name</Th><Th>Index</Th><Th>Program</Th><Th>Level</Th>
                <Th>Grad. year</Th><Th>Status</Th><Th>Country</Th><Th>Email</Th>
                <Th>WhatsApp</Th><Th>Registered</Th><Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={11}><EmptyState /></td></tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-muted/50">
                    <Td><Link to="/admin/students/$id" params={{ id: r.id }} className="font-medium text-foreground hover:text-primary transition-colors">{r.fullName}</Link></Td>
                    <Td className="font-mono text-xs">{r.index}</Td>
                    <Td className="max-w-[180px] truncate" title={r.program}>{r.program}</Td>
                    <Td>{r.level}</Td>
                    <Td>{r.graduationYear}</Td>
                    <Td><StatusBadge graduated={r.graduated} /></Td>
                    <Td>{r.country}</Td>
                    <Td className="max-w-[180px] truncate" title={r.email}>{r.email}</Td>
                    <Td>{r.whatsappCode} {r.whatsapp}</Td>
                    <Td className="whitespace-nowrap text-muted-foreground">{new Date(r.registrationDate).toLocaleDateString()}</Td>
                    <Td className="text-right">
                      <div className="inline-flex gap-1">
                        <Link to="/admin/students/$id" params={{ id: r.id }} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary" aria-label="View"><Eye className="h-4 w-4" /></Link>
                        <Link to="/admin/students/$id/edit" params={{ id: r.id }} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary" aria-label="Edit"><Pencil className="h-4 w-4" /></Link>
                      </div>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="mt-4 grid gap-3 md:hidden">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-white p-5 shadow-card">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-foreground">{r.fullName}</p>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">{r.email}</p>
                </div>
                <StatusBadge graduated={r.graduated} />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 text-sm">
                <div><dt className="text-muted-foreground mb-0.5">Index</dt><dd className="font-medium text-foreground">{r.index}</dd></div>
                <div><dt className="text-muted-foreground mb-0.5">Level</dt><dd className="font-medium text-foreground">{r.level}</dd></div>
                <div className="col-span-2"><dt className="text-muted-foreground mb-0.5">Program</dt><dd className="font-medium text-foreground truncate">{r.program}</dd></div>
                <div><dt className="text-muted-foreground mb-0.5">Country</dt><dd className="font-medium text-foreground">{r.country}</dd></div>
                <div><dt className="text-muted-foreground mb-0.5">Grad. year</dt><dd className="font-medium text-foreground">{r.graduationYear}</dd></div>
                <div><dt className="text-muted-foreground mb-0.5">WhatsApp</dt><dd className="font-medium text-foreground">{r.whatsappCode} {r.whatsapp}</dd></div>
                <div><dt className="text-muted-foreground mb-0.5">Registered</dt><dd className="font-medium text-foreground">{new Date(r.registrationDate).toLocaleDateString()}</dd></div>
              </dl>
              <div className="mt-5 flex gap-3 border-t border-border pt-4">
                <Link to="/admin/students/$id" params={{ id: r.id }} className="flex-1 rounded-md border border-border px-4 py-2 text-center text-sm font-medium transition-colors hover:bg-muted">View profile</Link>
                <Link to="/admin/students/$id/edit" params={{ id: r.id }} className="flex-1 rounded-md bg-primary px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-deep">Edit profile</Link>
              </div>
            </div>
          ))
        )}
      </div>

      {showExport && <ExportDialog onClose={() => setShowExport(false)} count={filtered.length} />}
      {showInvite && <InviteDialog onClose={() => setShowInvite(false)} />}
    </AdminShell>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={cn("px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground", className)}>{children}</th>;
}
function Td({ children, className, title }: { children: React.ReactNode; className?: string; title?: string }) {
  return <td className={cn("px-4 py-3 align-middle text-foreground", className)} title={title}>{children}</td>;
}
function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="grid gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none rounded-md border border-border bg-white pl-3 pr-9 h-10 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
          <option value="">All</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
}
function EmptyState() {
  return (
    <div className="grid place-items-center p-12 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-primary-soft text-primary"><Search className="h-6 w-6" /></div>
      <p className="mt-4 font-heading text-lg font-semibold text-foreground">No registrations found</p>
      <p className="mt-1 text-sm text-muted-foreground">Adjust filters or clear them to see all records.</p>
    </div>
  );
}
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white shadow-modal">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-heading text-lg font-semibold text-primary-navy">{title}</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
function ExportDialog({ onClose, count }: { onClose: () => void; count: number }) {
  const [fmt, setFmt] = useState("csv");
  const [scope, setScope] = useState("filtered");
  return (
    <Modal title="Export Data" onClose={onClose}>
      <div className="grid gap-5">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-foreground">File Format</label>
          <div className="flex gap-2">
            {["csv","xlsx","json"].map((f) => (
              <button key={f} onClick={() => setFmt(f)} className={cn("flex-1 rounded-md border h-10 text-xs font-semibold uppercase tracking-wider transition-colors", fmt === f ? "border-primary bg-primary-soft text-primary-deep" : "border-border hover:bg-muted")}>{f}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-foreground">Scope</label>
          <div className="grid gap-2">
            <label className={cn("flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors", scope === "filtered" ? "border-primary bg-primary-very-light" : "border-border hover:bg-muted")}>
              <input type="radio" className="h-4 w-4 accent-primary" checked={scope === "filtered"} onChange={() => setScope("filtered")} /> 
              <span className="text-sm font-medium text-foreground">Filtered results <span className="text-muted-foreground">({count})</span></span>
            </label>
            <label className={cn("flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors", scope === "all" ? "border-primary bg-primary-very-light" : "border-border hover:bg-muted")}>
              <input type="radio" className="h-4 w-4 accent-primary" checked={scope === "all"} onChange={() => setScope("all")} /> 
              <span className="text-sm font-medium text-foreground">All registrations</span>
            </label>
          </div>
        </div>
        <div className="mt-2 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted">Cancel</button>
          <button onClick={() => { toast.success("Export queued successfully"); onClose(); }} className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-deep">Start Export</button>
        </div>
      </div>
    </Modal>
  );
}
function InviteDialog({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  return (
    <Modal title="Invite Admin" onClose={onClose}>
      <div className="grid gap-5">
        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-foreground">Admin email address</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="new-admin@example.edu" className="h-10 rounded-md border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" required />
        </label>
        <p className="text-sm text-muted-foreground">An invitation link will be sent. It expires in 7 days.</p>
        <div className="mt-2 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted">Cancel</button>
          <button onClick={() => { toast.success("Invitation sent successfully"); onClose(); }} className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-deep">Send Invitation</button>
        </div>
      </div>
    </Modal>
  );
}