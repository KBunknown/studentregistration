import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { addRegistration, clearDraft, getDraft, type Draft } from "@/lib/reg-store";
import type { Registration } from "@/lib/mock-data";

export const Route = createFileRoute("/register/review")({
  head: () => ({
    meta: [{ title: "Review your information — International Student Registration" }],
  }),
  component: ReviewPage,
});

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/30 bg-white/75 shadow-[0_24px_70px_rgba(21,94,239,0.08)] backdrop-blur-2xl">
      <div className="border-b border-primary/10 px-5 py-3.5">
        <h3 className="font-heading text-sm font-semibold text-primary-deep">{title}</h3>
      </div>
      <dl className="divide-y divide-primary/8">{children}</dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="grid grid-cols-[1fr_1.5fr] items-center gap-3 px-5 py-3.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 truncate text-right text-sm font-medium text-foreground sm:text-left">
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
    try {
      await new Promise((r) => setTimeout(r, 800));
      const reg: Registration = {
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
        level: d.level || "Unknown",
        graduationYear: d.graduationYear as number,
        graduated: false,
        registrationDate: new Date().toISOString(),
        study_type: d.study_type,
        academic_stage: d.academic_stage,
        room_number: d.room_number,
        english_certificate_pathway: d.english_certificate_pathway,
        programme_status: "active",
      };

      await addRegistration(reg);

      if (typeof window !== "undefined") {
        localStorage.setItem("isrp_last_submission", JSON.stringify(reg));
      }
      clearDraft();
      navigate({ to: "/register/success" });
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const programDisplay = d.program === "Other Program" ? `${d.otherProgram} (Other)` : d.program;

  return (
    <div className="mesh-gradient-bg relative min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/20 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-5 lg:px-8">
          <Link to="/register" className="flex min-w-0 items-center gap-2.5">
            <img
              src="/logo.png"
              alt="International Student Registration logo"
              className="h-9 w-9 shrink-0 object-contain"
            />
            <span className="font-heading truncate text-sm font-bold tracking-tight text-primary-navy sm:text-[15px]">
              {t("portal_title")}
            </span>
          </Link>
          <Link
            to="/register/form"
            className="text-sm font-medium text-blue-600 underline-offset-4 hover:underline"
          >
            {t("btn_back")}
          </Link>
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1600px] flex-col px-3 py-5 sm:px-5 lg:px-8 lg:py-8">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
          <div className="mb-6 text-center lg:mb-8">
            <h1 className="font-heading text-2xl font-bold text-primary-navy drop-shadow-sm sm:text-3xl">
              {t("review_title")}
            </h1>
            <p className="mt-2 text-sm text-slate-600">{t("review_sub")}</p>
          </div>

          <div className="flex flex-1 flex-col rounded-xl border border-white/30 bg-white/75 p-4 shadow-[0_24px_70px_rgba(21,94,239,0.08)] backdrop-blur-2xl sm:p-6 lg:p-8">
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
              <InfoCard title={t("sec_personal_info")}>
                <Row label={t("f_fullname")} value={d.fullName} />
                <Row label={t("f_email")} value={d.email} />
                <Row label={t("f_gender")} value={d.gender} />
              </InfoCard>

              <InfoCard title={t("sec_contact_info")}>
                <Row label={t("f_country")} value={d.country} />
                <Row label={t("f_phone")} value={d.phone ? `${d.phoneCode} ${d.phone}` : ""} />
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

              <InfoCard title={t("sec_academic_info") || "Academic Information"}>
                <Row label="Study Type" value={
                  d.study_type === "bsc" ? "BSc" :
                  d.study_type === "masters" ? "Master's" :
                  d.study_type === "english_certificate" ? "English Certificate" : "—"
                } />
                <Row label="Programme" value={d.program} />
                {d.study_type === "english_certificate" && (
                  <Row label="Pathway" value={
                    d.english_certificate_pathway === "leave_after_certificate" ? "Leave after certificate" :
                    d.english_certificate_pathway === "continue_to_bsc" ? "Continue to BSc" :
                    d.english_certificate_pathway === "continue_to_masters" ? "Continue to Master's" : "—"
                  } />
                )}
                {d.study_type !== "english_certificate" && (
                  <Row label="Academic Stage" value={d.academic_stage?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} />
                )}
                <Row label="Room Number" value={d.room_number} />
                <Row label={t("f_index")} value={d.index} />
                <Row label={t("f_grad_year")} value={d.graduationYear} />
              </InfoCard>
            </div>

            <div className="mt-6 flex shrink-0 flex-col-reverse gap-3 border-t border-primary/10 pt-6 sm:flex-row sm:justify-between">
              <Link to="/register/form" className="btn-secondary w-full sm:w-auto px-4 sm:px-6 whitespace-nowrap">
                <ArrowLeft className="h-4 w-4" />
                {t("btn_edit")}
              </Link>
              <button
                onClick={submit}
                disabled={submitting}
                className="btn-primary w-full sm:w-auto px-4 sm:px-6 disabled:opacity-70 whitespace-nowrap"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {t("btn_submit")}...
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
        </div>
      </div>
    </div>
  );
}
