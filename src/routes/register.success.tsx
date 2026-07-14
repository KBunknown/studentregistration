import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Printer } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { useI18n } from "@/lib/i18n";
import type { Registration } from "@/lib/mock-data";

export const Route = createFileRoute("/register/success")({
  head: () => ({
    meta: [{ title: "Registration successful — International Student Registration" }],
  }),
  component: Success,
});

function Success() {
  const { t } = useI18n();
  const [r, setR] = useState<Registration | null>(null);
  useEffect(() => {
    const raw =
      typeof window !== "undefined"
        ? localStorage.getItem("isrp_last_submission")
        : null;
    if (raw) setR(JSON.parse(raw));
  }, []);

  return (
    <PublicShell>
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Success hero */}
        <div className="flex flex-col items-center text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-success/10">
            <CheckCircle2 className="h-9 w-9 text-success" />
          </div>
          <h1 className="mt-5 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {t("success_title")}
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {t("success_sub")}
          </p>
        </div>

        {/* Summary card */}
        <div className="mt-8 rounded-lg border border-border bg-white shadow-card">
          <div className="border-b border-border px-5 py-3">
            <h3 className="font-heading text-sm font-semibold text-primary-deep">
              Registration Summary
            </h3>
          </div>
          <dl className="divide-y divide-border">
            <Row label={t("f_fullname")} value={r?.fullName} />
            <Row label={t("f_index")} value={r?.index} />
            <Row
              label={t("f_program")}
              value={
                r?.program === "Other Program"
                  ? `${r?.otherProgram} (Other)`
                  : r?.program
              }
            />
            <Row label={t("f_level")} value={r?.level} />
            <Row label={t("f_grad_year")} value={r?.graduationYear} />
            <Row
              label={t("s_reg_date")}
              value={r ? new Date(r.registrationDate).toLocaleString() : ""}
            />
          </dl>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            {t("btn_home")}
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-colors hover:bg-primary-deep"
          >
            <Printer className="h-4 w-4" />
            {t("btn_download")}
          </button>
        </div>
      </div>
    </PublicShell>
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