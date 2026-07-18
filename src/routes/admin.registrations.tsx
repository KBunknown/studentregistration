import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Download,
  UserPlus,
  X,
  MoreHorizontal,
  Eye,
  Pencil,
  GraduationCap,
} from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllRegistrations } from "@/lib/reg-store";
import { COUNTRIES, LEVELS, PROGRAMS, type Registration } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/registrations")({
  component: RegistrationsPage,
});

type SortKey =
  | "newest"
  | "oldest"
  | "name_asc"
  | "name_desc"
  | "program"
  | "level"
  | "grad_year"
  | "country"
  | "graduation_status";

function StatusBadge({ graduated }: { graduated: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        graduated
          ? "border-success/30 bg-success/10 text-success"
          : "border-primary/30 bg-primary-soft text-primary-deep",
      )}
    >
      {graduated ? "Graduated" : "Active"}
    </span>
  );
}

function PremiumSelect({
  value,
  onChange,
  options,
  placeholder = "All",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}) {
  const normalizedValue = value || "__all";
  const normalizedOptions =
    placeholder === "All" ? [{ value: "__all", label: "All" }, ...options] : options;
  return (
    <Select value={normalizedValue} onValueChange={(v) => onChange(v === "__all" ? "" : v)}>
      <SelectTrigger className={cn("h-10", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {normalizedOptions.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function RegistrationsPage() {
  const [regs, setRegs] = useState<Registration[]>([]);
  const [q, setQ] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [filters, setFilters] = useState({
    study_type: "",
    program: "",
    level: "",
    gradYear: "",
    gradStatus: "",
    country: "",
    gender: "",
    from: "",
    to: "",
    dupe: "",
  });
  const [sort, setSort] = useState<SortKey>("newest");

  useEffect(() => {
    getAllRegistrations().then(setRegs);
  }, []);

  const filtered = useMemo(() => {
    let out = regs;
    if (q.trim()) {
      const s = q.toLowerCase();
      out = out.filter(
        (r) =>
          r.fullName.toLowerCase().includes(s) ||
          r.email.toLowerCase().includes(s) ||
          r.index.includes(s),
      );
    }
    if (filters.study_type) out = out.filter((r) => r.study_type === filters.study_type);
    if (filters.program) out = out.filter((r) => r.program === filters.program);
    if (filters.level) out = out.filter((r) => (r.academic_stage || r.level) === filters.level);
    if (filters.gradYear) out = out.filter((r) => String(r.graduationYear) === filters.gradYear);
    if (filters.gradStatus)
      out = out.filter((r) => (filters.gradStatus === "graduated") === r.graduated);
    if (filters.country) out = out.filter((r) => r.country === filters.country);
    if (filters.gender) out = out.filter((r) => r.gender === filters.gender);
    if (filters.from)
      out = out.filter((r) => new Date(r.registrationDate) >= new Date(filters.from));
    if (filters.to) out = out.filter((r) => new Date(r.registrationDate) <= new Date(filters.to));
    if (filters.dupe) out = out.filter((r) => (filters.dupe === "possible") === !!r.duplicateOf);

    const cmp: Record<SortKey, (a: Registration, b: Registration) => number> = {
      newest: (a, b) => +new Date(b.registrationDate) - +new Date(a.registrationDate),
      oldest: (a, b) => +new Date(a.registrationDate) - +new Date(b.registrationDate),
      name_asc: (a, b) => a.fullName.localeCompare(b.fullName),
      name_desc: (a, b) => b.fullName.localeCompare(a.fullName),
      program: (a, b) => a.program.localeCompare(b.program),
      level: (a, b) => (a.academic_stage || a.level || "").localeCompare(b.academic_stage || b.level || ""),
      grad_year: (a, b) => a.graduationYear - b.graduationYear,
      country: (a, b) => a.country.localeCompare(b.country),
      graduation_status: (a, b) => Number(a.graduated) - Number(b.graduated),
    };
    return [...out].sort(cmp[sort]);
  }, [regs, q, filters, sort]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const clearFilters = () =>
    setFilters({
      study_type: "",
      program: "",
      level: "",
      gradYear: "",
      gradStatus: "",
      country: "",
      gender: "",
      from: "",
      to: "",
      dupe: "",
    });

  return (
    <AdminShell title="Registrations">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, index…"
            className="form-input pl-9 h-10"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowFilters((s) => !s)}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-xl border border-blue-100 bg-white/80 px-3 text-sm font-medium shadow-sm backdrop-blur-xl transition-colors hover:bg-blue-50",
              activeFilterCount > 0 && "border-primary text-primary-deep",
            )}
          >
            <Filter className="h-4 w-4" /> Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          <PremiumSelect
            value={sort}
            onChange={(v) => setSort(v as SortKey)}
            placeholder="Sort"
            className="flex-1 sm:w-[15rem] sm:flex-none font-medium"
            options={[
              { value: "newest", label: "Newest" },
              { value: "oldest", label: "Oldest" },
              { value: "name_asc", label: "Name A-Z" },
              { value: "name_desc", label: "Name Z-A" },
              { value: "program", label: "Program" },
              { value: "level", label: "Level" },
              { value: "grad_year", label: "Expected graduation year" },
              { value: "country", label: "Country" },
              { value: "graduation_status", label: "Graduation status" },
            ]}
          />
          <button
            onClick={() => setShowExport(true)}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-blue-100 bg-white/80 px-3 text-sm font-medium shadow-sm backdrop-blur-xl transition-colors hover:bg-blue-50"
          >
            <Download className="h-4 w-4" /> Export
          </button>
          <button
            onClick={() => setShowInvite(true)}
            className="hidden h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-deep sm:inline-flex"
          >
            <UserPlus className="h-4 w-4" /> Invite admin
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="glass-panel mt-4 rounded-xl p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect
              label="Study Type"
              value={filters.study_type}
              onChange={(v) => setFilters({ ...filters, study_type: v })}
              options={["bsc", "masters", "english_certificate"]}
            />
            <FilterSelect
              label="Program"
              value={filters.program}
              onChange={(v) => setFilters({ ...filters, program: v })}
              options={PROGRAMS}
            />
            <FilterSelect
              label="Academic Stage"
              value={filters.level}
              onChange={(v) => setFilters({ ...filters, level: v })}
              options={["level_100", "level_200", "level_300", "level_400", "masters_year_1", "masters_year_2", "english_certificate_year_1"]}
            />
            <FilterSelect
              label="Expected graduation year"
              value={filters.gradYear}
              onChange={(v) => setFilters({ ...filters, gradYear: v })}
              options={["2026", "2027", "2028", "2029"]}
            />
            <FilterSelect
              label="Graduation status"
              value={filters.gradStatus}
              onChange={(v) => setFilters({ ...filters, gradStatus: v })}
              options={["active", "graduated"]}
            />
            <FilterSelect
              label="Country"
              value={filters.country}
              onChange={(v) => setFilters({ ...filters, country: v })}
              options={COUNTRIES.map((c) => c.name)}
            />
            <FilterSelect
              label="Gender"
              value={filters.gender}
              onChange={(v) => setFilters({ ...filters, gender: v })}
              options={["Female", "Male", "Other", "Prefer not to say"]}
            />
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-foreground">Registration from</label>
              <input
                type="date"
                value={filters.from}
                onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                className="h-10 rounded-md border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-foreground">Registration to</label>
              <input
                type="date"
                value={filters.to}
                onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                className="h-10 rounded-md border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <FilterSelect
              label="Duplicate status"
              value={filters.dupe}
              onChange={(v) => setFilters({ ...filters, dupe: v })}
              options={["possible", "unique"]}
            />
          </div>
          <div className="mt-5 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      <p className="mt-5 text-sm text-muted-foreground font-medium">
        Showing <span className="text-foreground">{filtered.length}</span> of {regs.length}{" "}
        registrations
      </p>

      {/* Desktop table */}
      <div className="glass-panel mt-4 hidden overflow-hidden rounded-xl md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-primary/10 text-sm">
            <thead className="bg-primary-soft/40">
              <tr>
                <Th>Full name</Th>
                <Th>Study Type</Th>
                <Th>Index</Th>
                <Th>Program</Th>
                <Th>Stage</Th>
                <Th>Room</Th>
                <Th>Status</Th>
                <Th>Country</Th>
                <Th>Email</Th>
                <Th>Registered</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/8">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11}>
                    <EmptyState />
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="table-row-hover transition-colors">
                    <Td>
                      <Link
                        to="/admin/students/$id"
                        params={{ id: r.id }}
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {r.fullName}
                      </Link>
                    </Td>
                    <Td>
                      <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        r.study_type === "bsc" ? "border-blue-200 bg-blue-50 text-blue-700" :
                        r.study_type === "masters" ? "border-purple-200 bg-purple-50 text-purple-700" :
                        r.study_type === "english_certificate" ? "border-amber-200 bg-amber-50 text-amber-700" :
                        "border-gray-200 bg-gray-50 text-gray-500"
                      )}>
                        {r.study_type === "bsc" ? "BSc" : r.study_type === "masters" ? "Master's" : r.study_type === "english_certificate" ? "Eng. Cert." : "—"}
                      </span>
                    </Td>
                    <Td className="font-mono text-xs">{r.index}</Td>
                    <Td className="max-w-[180px] truncate" title={r.program}>
                      {r.program}
                    </Td>
                    <Td>{r.academic_stage?.replace(/_/g, ' ') || r.level || "—"}</Td>
                    <Td>{r.room_number || "—"}</Td>
                    <Td>
                      <StatusBadge graduated={r.graduated} />
                    </Td>
                    <Td>{r.country}</Td>
                    <Td className="max-w-[180px] truncate" title={r.email}>
                      {r.email}
                    </Td>

                    <Td className="whitespace-nowrap text-muted-foreground">
                      {new Date(r.registrationDate).toLocaleDateString()}
                    </Td>
                    <Td className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="inline-grid h-9 w-9 place-items-center rounded-xl border border-blue-100 bg-white/80 text-muted-foreground shadow-sm backdrop-blur-xl transition-colors hover:bg-blue-50 hover:text-primary"
                            aria-label="Open registration actions"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem asChild>
                            <Link to="/admin/students/$id" params={{ id: r.id }}>
                              <Eye className="h-4 w-4" />
                              View profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/admin/students/$id/edit" params={{ id: r.id }}>
                              <Pencil className="h-4 w-4" />
                              Edit profile
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
            <div key={r.id} className="glass-panel rounded-xl p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-foreground">{r.fullName}</p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">{r.index}</p>
                </div>
                <StatusBadge graduated={r.graduated} />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 text-sm">
                <div className="col-span-2">
                  <dt className="mb-0.5 text-muted-foreground">Study Type</dt>
                  <dd className="font-medium text-foreground">{r.study_type === "bsc" ? "BSc" : r.study_type === "masters" ? "Master's" : r.study_type === "english_certificate" ? "English Certificate" : "—"}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="mb-0.5 text-muted-foreground">Programme</dt>
                  <dd className="truncate font-medium text-foreground">{r.program}</dd>
                </div>
                <div>
                  <dt className="mb-0.5 text-muted-foreground">Academic Stage</dt>
                  <dd className="font-medium text-foreground">{r.academic_stage?.replace(/_/g, ' ') || r.level || "—"}</dd>
                </div>
                <div>
                  <dt className="mb-0.5 text-muted-foreground">Room</dt>
                  <dd className="font-medium text-foreground">{r.room_number || "—"}</dd>
                </div>
                <div>
                  <dt className="mb-0.5 text-muted-foreground">Grad. year</dt>
                  <dd className="font-medium text-foreground">{r.graduationYear}</dd>
                </div>
                <div>
                  <dt className="mb-0.5 text-muted-foreground">Country</dt>
                  <dd className="font-medium text-foreground">{r.country}</dd>
                </div>
                <div>
                  <dt className="mb-0.5 text-muted-foreground">Registered</dt>
                  <dd className="font-medium text-foreground">
                    {new Date(r.registrationDate).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
              <div className="mt-5 flex gap-3 border-t border-border pt-4">
                <Link
                  to="/admin/students/$id"
                  params={{ id: r.id }}
                  className="flex-1 rounded-md border border-border px-4 py-2 text-center text-sm font-medium transition-colors hover:bg-muted"
                >
                  View profile
                </Link>
                <Link
                  to="/admin/students/$id/edit"
                  params={{ id: r.id }}
                  className="flex-1 rounded-md bg-primary px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-deep"
                >
                  Edit profile
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {showExport && <ExportDialog onClose={() => setShowExport(false)} count={filtered.length} regs={regs} filtered={filtered} />}
      {showInvite && <InviteDialog onClose={() => setShowInvite(false)} />}
    </AdminShell>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-primary-deep",
        className,
      )}
    >
      {children}
    </th>
  );
}
function Td({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <td className={cn("px-5 py-4 align-middle text-foreground", className)} title={title}>
      {children}
    </td>
  );
}
function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="grid gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <PremiumSelect
        value={value}
        onChange={onChange}
        options={options.map((o) => ({ value: o, label: o }))}
      />
    </div>
  );
}
function EmptyState() {
  return (
    <div className="grid place-items-center p-12 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-primary-soft text-primary">
        <Search className="h-6 w-6" />
      </div>
      <p className="mt-4 font-heading text-lg font-semibold text-foreground">
        No registrations found
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Adjust filters or clear them to see all records.
      </p>
    </div>
  );
}
function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-xl shadow-modal">
        <div className="flex items-center justify-between border-b border-primary/10 px-6 py-4">
          <h3 className="font-heading text-lg font-semibold text-primary-navy">{title}</h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
function ExportDialog({ onClose, count, regs, filtered }: { onClose: () => void; count: number; regs: Registration[]; filtered: Registration[] }) {
  const [fmt, setFmt] = useState("csv");
  const [scope, setScope] = useState("filtered");
  const handleExport = () => {
    const dataToExport = scope === "all" ? regs : filtered;
    if (dataToExport.length === 0) {
      toast.error("No records to export.");
      return;
    }

    let content = "";
    let mimeType = "text/plain";

    if (fmt === "json") {
      content = JSON.stringify(dataToExport, null, 2);
      mimeType = "application/json";
    } else {
      const headers = ["Index", "Full Name", "Email", "Study Type", "Program", "Academic Stage", "Room Number", "Pathway", "Gender", "Country", "Phone", "WhatsApp", "Graduation Year", "Graduated", "Date"];
      const rows = dataToExport.map(r => [
        r.index,
        r.fullName,
        r.email,
        r.study_type || "",
        r.program,
        r.academic_stage || r.level || "",
        r.room_number || "",
        r.english_certificate_pathway || "",
        r.gender || "",
        r.country || "",
        r.phoneCode ? `${r.phoneCode} ${r.phone}` : r.phone || "",
        r.whatsappCode ? `${r.whatsappCode} ${r.whatsapp}` : r.whatsapp || "",
        r.graduationYear || "",
        r.graduated ? "Yes" : "No",
        r.registrationDate
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
      
      content = [headers.join(","), ...rows].join("\n");
      mimeType = "text/csv";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations_${scope}_${new Date().toISOString().split("T")[0]}.${fmt}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Successfully exported ${dataToExport.length} records`);
    onClose();
  };

  return (
    <Modal title="Export Data" onClose={onClose}>
      <div className="grid gap-5">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-foreground">File Format</label>
          <div className="flex gap-2">
            {["csv", "json"].map((f) => (
              <button
                key={f}
                onClick={() => setFmt(f)}
                className={cn(
                  "flex-1 rounded-md border h-10 text-xs font-semibold uppercase tracking-wider transition-colors",
                  fmt === f
                    ? "border-primary bg-primary-soft text-primary-deep"
                    : "border-border hover:bg-muted",
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
            <label
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors",
                scope === "filtered"
                  ? "border-primary bg-primary-very-light"
                  : "border-border hover:bg-muted",
              )}
            >
              <input
                type="radio"
                className="h-4 w-4 accent-primary"
                checked={scope === "filtered"}
                onChange={() => setScope("filtered")}
              />
              <span className="text-sm font-medium text-foreground">
                Filtered results <span className="text-muted-foreground">({count})</span>
              </span>
            </label>
            <label
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors",
                scope === "all"
                  ? "border-primary bg-primary-very-light"
                  : "border-border hover:bg-muted",
              )}
            >
              <input
                type="radio"
                className="h-4 w-4 accent-primary"
                checked={scope === "all"}
                onChange={() => setScope("all")}
              />
              <span className="text-sm font-medium text-foreground">All registrations</span>
            </label>
          </div>
        </div>
        <div className="mt-2 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-deep"
          >
            Start Export
          </button>
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
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="new-admin@example.edu"
            className="h-10 rounded-md border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            required
          />
        </label>
        <p className="text-sm text-muted-foreground">
          An invitation link will be sent. It expires in 7 days.
        </p>
        <div className="mt-2 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.success("Invitation sent successfully");
              onClose();
            }}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-deep"
          >
            Send Invitation
          </button>
        </div>
      </div>
    </Modal>
  );
}
