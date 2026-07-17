import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Mail, Phone, MessageCircle, MapPin, GraduationCap, Pencil } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { getAllRegistrations } from "@/lib/reg-store";
import type { Registration } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/students/$id")({
  component: StudentProfile,
});

function Field({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
      <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}

function StudentProfile() {
  const { id } = useParams({ from: "/admin/students/$id" });
  const [r, setR] = useState<Registration | null | undefined>(undefined);
  useEffect(() => {
    getAllRegistrations().then((regs) => {
      const found = regs.find((x) => x.id === id);
      setR(found ?? null);
    });
  }, [id]);

  if (r === undefined)
    return (
      <AdminShell title="Student Profile">
        <div className="grid gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </AdminShell>
    );
  if (r === null)
    return (
      <AdminShell title="Student Profile">
        <div className="glass-panel rounded-xl p-12 text-center shadow-card">
          <p className="text-lg font-semibold text-foreground">Student not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The requested registration record does not exist.
          </p>
          <Link
            to="/admin/registrations"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-deep"
          >
            Back to registrations
          </Link>
        </div>
      </AdminShell>
    );

  return (
    <AdminShell title="Student Profile">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/registrations"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to registrations
        </Link>
        <Link
          to="/admin/students/$id/edit"
          params={{ id: r.id }}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-deep"
        >
          <Pencil className="h-4 w-4" /> Edit Profile
        </Link>
      </div>

      <div className="mt-6 glass-panel rounded-xl p-6 shadow-card sm:p-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-5">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-primary-soft text-xl font-bold text-primary-deep shadow-sm">
              {r.fullName
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </span>
            <div className="min-w-0">
              <h2 className="truncate font-heading text-2xl font-bold text-primary-navy">
                {r.fullName}
              </h2>
              <p className="mt-1 text-sm font-medium text-muted-foreground">Index #{r.index}</p>
            </div>
          </div>
          <span
            className={
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm " +
              (r.graduated
                ? "border-success/30 bg-success/10 text-success"
                : "border-primary/30 bg-primary-soft text-primary-deep")
            }
          >
            <GraduationCap className="h-4 w-4" /> {r.graduated ? "Graduated" : "Active"}
          </span>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 text-sm text-foreground">
            <div className="grid h-8 w-8 place-items-center rounded bg-muted">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>{" "}
            <span className="font-medium">{r.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-foreground">
            <div className="grid h-8 w-8 place-items-center rounded bg-muted">
              <Phone className="h-4 w-4 text-muted-foreground" />
            </div>{" "}
            <span className="font-medium">
              {r.phoneCode} {r.phone}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-foreground">
            <div className="grid h-8 w-8 place-items-center rounded bg-muted">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </div>{" "}
            <span className="font-medium">
              {r.whatsappCode} {r.whatsapp}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-foreground">
            <div className="grid h-8 w-8 place-items-center rounded bg-muted">
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>{" "}
            <span className="font-medium">{r.country}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field
          label="Program"
          value={r.program === "Other Program" ? `${r.otherProgram} (Other)` : r.program}
        />
        <Field label="Current level" value={r.level} />
        <Field label="Expected graduation" value={r.graduationYear} />
        <Field label="Gender" value={r.gender} />
        <Field label="Registration date" value={new Date(r.registrationDate).toLocaleString()} />
        <Field label="Graduation status" value={r.graduated ? "Graduated" : "Active Student"} />
      </div>

      {r.duplicateOf && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/5 p-5 text-sm text-warning-foreground">
          <div>
            <p className="font-semibold text-warning">Possible Duplicate Record</p>
            <p className="mt-1 text-warning/80">
              This record shares identifying information with another registration:{" "}
              <Link
                to="/admin/students/$id"
                params={{ id: r.duplicateOf }}
                className="font-semibold underline underline-offset-4 hover:text-warning"
              >
                {r.duplicateOf}
              </Link>
              .
            </p>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
