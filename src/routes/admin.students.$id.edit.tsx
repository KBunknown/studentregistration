import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin-shell";
import { getAllRegistrations, updateRegistration } from "@/lib/reg-store";
import {
  LEVELS,
  PROGRAMS,
  calcGraduationYear,
  type Registration,
  type Level,
  type StudyType,
  type AcademicStage,
  type EnglishPathway,
} from "@/lib/mock-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/students/$id/edit")({
  component: EditStudent,
});

const inputCls =
  "block w-full h-11 rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";

function PremiumSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function EditStudent() {
  const { id } = useParams({ from: "/admin/students/$id/edit" });
  const navigate = useNavigate();
  const [r, setR] = useState<Registration | null>(null);

  useEffect(() => {
    getAllRegistrations().then((regs) => {
      const found = regs.find((x) => x.id === id);
      setR(found ?? null);
    });
  }, [id]);

  if (!r)
    return (
      <AdminShell title="Edit Student">
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      </AdminShell>
    );

  const upd = <K extends keyof Registration>(k: K, v: Registration[K]) =>
    setR((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [k]: v };
      if (k === "study_type") {
        next.academic_stage = undefined;
        next.english_certificate_pathway = null;
        if (v === "english_certificate") {
          next.academic_stage = "english_certificate_year_1";
        }
      }
      if (k === "academic_stage" || k === "study_type") {
        next.graduationYear = calcGraduationYear(next.academic_stage as AcademicStage) as number;
      }
      return next;
    });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!r) return;
    try {
      await updateRegistration(r.id, r);
      toast.success("Student updated successfully");
      navigate({ to: "/admin/students/$id", params: { id: r.id } });
    } catch (err) {
      toast.error("Failed to update student");
    }
  };

  return (
    <AdminShell title="Edit Student">
      <Link
        to="/admin/students/$id"
        params={{ id: r.id }}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to profile
      </Link>

      <form onSubmit={save} className="mt-6 glass-panel rounded-xl p-6 shadow-card sm:p-8">
        <h2 className="mb-6 font-heading text-lg font-semibold text-primary-navy">
          Edit Profile Details
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-foreground">Full name</span>
            <input
              className={inputCls}
              value={r.fullName}
              onChange={(e) => upd("fullName", e.target.value)}
              required
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-foreground">Email address</span>
            <input
              type="email"
              className={inputCls}
              value={r.email}
              onChange={(e) => upd("email", e.target.value)}
              required
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-foreground">Gender</span>
            <PremiumSelect
              value={r.gender}
              onChange={(v) => upd("gender", v)}
              options={["Female", "Male", "Other", "Prefer not to say"]}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-foreground">Country</span>
            <input
              className={inputCls}
              value={r.country}
              onChange={(e) => upd("country", e.target.value)}
              required
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-foreground">Phone number</span>
            <input
              className={inputCls}
              value={`${r.phoneCode} ${r.phone}`}
              onChange={(e) => upd("phone", e.target.value.replace(/^\S+\s?/, ""))}
              required
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-foreground">WhatsApp number</span>
            <input
              className={inputCls}
              value={`${r.whatsappCode} ${r.whatsapp}`}
              onChange={(e) => upd("whatsapp", e.target.value.replace(/^\S+\s?/, ""))}
              required
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-foreground">Study Type</span>
            <PremiumSelect
              value={r.study_type || ""}
              onChange={(v) => upd("study_type", v as StudyType)}
              options={["bsc", "masters", "english_certificate"]}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-foreground">Programme Name</span>
            <input
              className={inputCls}
              value={r.program}
              onChange={(e) => upd("program", e.target.value)}
              placeholder="e.g. BSc Computer Science"
              required={r.study_type !== "english_certificate"}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-foreground">Index number</span>
            <input
              className={inputCls}
              value={r.index}
              onChange={(e) => upd("index", e.target.value)}
              required
            />
          </label>
          {r.study_type === "bsc" && (
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-foreground">BSc Level</span>
              <PremiumSelect
                value={r.academic_stage || ""}
                onChange={(v) => upd("academic_stage", v as AcademicStage)}
                options={["level_100", "level_200", "level_300", "level_400"]}
              />
            </label>
          )}
          {r.study_type === "masters" && (
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-foreground">Master's Year</span>
              <PremiumSelect
                value={r.academic_stage || ""}
                onChange={(v) => upd("academic_stage", v as AcademicStage)}
                options={["masters_year_1", "masters_year_2"]}
              />
            </label>
          )}
          {r.study_type === "english_certificate" && (
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-foreground">Plan After Certificate</span>
              <PremiumSelect
                value={r.english_certificate_pathway || ""}
                onChange={(v) => upd("english_certificate_pathway", v as EnglishPathway)}
                options={["leave_after_certificate", "continue_to_bsc", "continue_to_masters"]}
              />
            </label>
          )}
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-foreground">Room Number</span>
            <input
              className={inputCls}
              value={r.room_number || ""}
              onChange={(e) => upd("room_number", e.target.value)}
              placeholder="e.g. 105, A12, Block B-24"
              required
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-foreground">Expected graduation</span>
            <input
              readOnly
              className={cn(inputCls, "bg-muted cursor-not-allowed")}
              value={r.graduationYear}
            />
          </label>

          <div className="col-span-full mt-4 rounded-lg border border-border bg-muted p-5">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-border text-primary accent-primary focus:ring-2 focus:ring-primary/20"
                checked={r.graduated}
                onChange={(e) => upd("graduated", e.target.checked)}
              />
              <span className="text-sm font-semibold text-foreground">
                Mark student as graduated
              </span>
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t border-border pt-6">
          <Link
            to="/admin/students/$id"
            params={{ id: r.id }}
            className="inline-flex h-11 items-center justify-center rounded-md border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Cancel
          </Link>
          <button className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-deep">
            Save Changes
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
