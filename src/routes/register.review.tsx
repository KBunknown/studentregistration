import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Send } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { useI18n } from "@/lib/i18n";
import { addRegistration, clearDraft, getDraft, type Draft } from "@/lib/reg-store";
import type { Registration } from "@/lib/mock-data";

export const Route = createFileRoute("/register/review")({
  head: () => ({ meta: [{ title: "Review your information — International Student Registration" }] }),
  component: ReviewPage,
});

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-white shadow-card">
      <div className="border-b border-border px-5 py-3">
        <h3 className="font-heading text-sm font-semibold text-primary-deep">
          {title}
        </h3>
      </div>
      <dl className="divide-y divide-border">{children}</dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="grid grid-cols-[1fr_1.5fr] items-center gap-3 px-5 py-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 truncate text-sm font-medium text-foreground text-right sm:text-left">
        {value || "—"}
      </dd>
    </div>
  );
}

function ReviewPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [d, setD] = useState<Draft>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const draft = getDraft();
    if (!draft.fullName) {
      navigate({ to: "/register" });
      return;
    }
    setD(draft);
  }, [navigate]);

  const submit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    const reg: Registration = {
      id: `reg_${Date.now()}`,
      fullName: d.fullName!,
      email: d.email!,
      gender: d.gender!,
      country: d.country!,
      phoneCode: d.phoneCode!,
      phone: d.phone!,
      whatsappCode: (d.sameWhatsapp ? d.phoneCode : d.whatsappCode) as string,
      whatsapp: (d.sameWhatsapp ? d.phone : d.whatsapp) as string,
      sameWhatsapp: !!d.sameWhatsapp,
      program: d.program!,
      otherProgram: d.otherProgram,
      index: d.index!,
      level: d.level!,
      graduationYear: d.graduationYear as number,
      graduated: false,
      registrationDate: new Date().toISOString(),
    };
    addRegistration(reg);
    if (typeof window !== "undefined") {
      localStorage.setItem("isrp_last_submission", JSON.stringify(reg));
    }
    clearDraft();
    navigate({ to: "/register/success" });
  };

  const programDisplay =
    d.program === "Other Program" ? `${d.otherProgram} (Other)` : d.program;

  return (
    <PublicShell>
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Step indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <StepDot step={1} label={t("f_fullname")} done />
          <div className="h-px w-8 bg-primary" />
          <StepDot step={2} label={t("f_program")} done />
          <div className="h-px w-8 bg-primary" />
          <StepDot step={3} label={t("review_title")} active />
        </div>

        <div className="mb-6 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {t("review_title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("review_sub")}
          </p>
        </div>

        <div className="space-y-4">
          <InfoCard title="Personal Information">
            <Row label={t("f_fullname")} value={d.fullName} />
            <Row label={t("f_email")} value={d.email} />
            <Row label={t("f_gender")} value={d.gender} />
          </InfoCard>

          <InfoCard title="Contact Information">
            <Row label={t("f_country")} value={d.country} />
            <Row
              label={t("f_phone")}
              value={d.phone ? `${d.phoneCode} ${d.phone}` : ""}
            />
            <Row
              label={t("f_whatsapp")}
              value={
                d.sameWhatsapp
                  ? d.phone
                    ? `${d.phoneCode} ${d.phone} (same as phone)`
                    : ""
                  : d.whatsapp
                    ? `${d.whatsappCode} ${d.whatsapp}`
                    : ""
              }
            />
          </InfoCard>

          <InfoCard title="Academic Information">
            <Row label={t("f_program")} value={programDisplay} />
            <Row label={t("f_index")} value={d.index} />
            <Row label={t("f_level")} value={d.level} />
            <Row label={t("f_grad_year")} value={d.graduationYear} />
          </InfoCard>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("btn_edit")}
          </Link>
          <button
            onClick={submit}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-colors hover:bg-primary-deep disabled:opacity-70"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Submitting…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {t("btn_submit")}
              </>
            )}
          </button>
        </div>
      </div>
    </PublicShell>
  );
}

function StepDot({
  step,
  label,
  done,
  active,
}: {
  step: number;
  label: string;
  done?: boolean;
  active?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`grid h-8 w-8 place-items-center rounded-full text-xs font-semibold transition-colors ${
          active
            ? "bg-primary text-white"
            : done
              ? "bg-primary text-white"
              : "bg-muted text-muted-foreground"
        }`}
      >
        {done && !active ? <CheckCircle2 className="h-4 w-4" /> : step}
      </div>
      <span className="hidden text-[10px] font-medium text-muted-foreground sm:block">
        {label.split(" ")[0]}
      </span>
    </div>
  );
}