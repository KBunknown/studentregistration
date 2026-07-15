import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
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
    const raw = typeof window !== "undefined" ? localStorage.getItem("isrp_last_submission") : null;
    if (raw) setR(JSON.parse(raw));
  }, []);

  return (
    <PublicShell>
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-8 sm:px-5">
        <div className="glass-panel w-full max-w-lg rounded-xl p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-success/10 ring-4 ring-success/5">
              <CheckCircle2 className="h-9 w-9 text-success" strokeWidth={1.75} />
            </div>
            <h1 className="mt-5 font-heading text-2xl font-bold text-foreground sm:text-[1.65rem]">
              {t("success_title")}
            </h1>
          </div>

          <dl className="mt-8 divide-y divide-primary/10 rounded-lg border border-primary/10 bg-white/50">
            <Row label={t("f_fullname")} value={r?.fullName} />
            <Row label={t("f_index")} value={r?.index} />
            <Row
              label={t("f_program")}
              value={r?.program === "Other Program" ? `${r?.otherProgram} (Other)` : r?.program}
            />
            <Row label={t("f_level")} value={r?.level} />
            <Row label={t("f_grad_year")} value={r?.graduationYear} />
            <Row
              label={t("s_reg_date")}
              value={r ? new Date(r.registrationDate).toLocaleString() : ""}
            />
          </dl>

          <div className="mt-8">
            <Link to="/register" className="btn-primary w-full">
              {t("nav_register")}
            </Link>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}

function Row({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="grid grid-cols-[1fr_1.2fr] items-center gap-3 px-5 py-3.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 truncate text-right text-sm font-medium text-foreground">
        {value || "—"}
      </dd>
    </div>
  );
}
