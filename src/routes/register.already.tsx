import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { useI18n } from "@/lib/i18n";
import { getAllRegistrations } from "@/lib/reg-store";
import type { Registration } from "@/lib/mock-data";

export const Route = createFileRoute("/register/already")({
  head: () => ({ meta: [{ title: "Already registered" }] }),
  component: Already,
});

function Already() {
  const { t } = useI18n();
  const [index, setIndex] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<Registration | null | "none">(null);

  const lookup = (e: React.FormEvent) => {
    e.preventDefault();
    const match = getAllRegistrations().find(
      (r) => r.index === index.trim() && r.email.toLowerCase() === email.trim().toLowerCase(),
    );
    setResult(match ?? "none");
  };

  const inputCls =
    "block w-full h-11 rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";

  return (
    <PublicShell>
      <div className="mx-auto max-w-xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-bold text-primary-navy sm:text-3xl">{t("already_title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("already_sub")}</p>
        </div>
        
        <form onSubmit={lookup} className="grid gap-5 rounded-xl border border-border bg-white p-6 sm:p-8 shadow-card">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-foreground">{t("f_index")}</span>
            <input className={inputCls} value={index} onChange={(e) => setIndex(e.target.value)} placeholder="e.g. 9012345" required />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-foreground">{t("f_email")}</span>
            <input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </label>
          <button className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-deep">
            <Search className="h-4 w-4" /> {t("already_lookup")}
          </button>
        </form>

        {result === "none" && (
          <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {t("already_none")}
          </div>
        )}
        {result && result !== "none" && (
          <div className="mt-6 rounded-xl border border-border bg-white shadow-card overflow-hidden">
            <div className="bg-success/10 border-b border-border px-5 py-4">
              <p className="font-heading text-sm font-semibold text-success">Registration Found</p>
            </div>
            <dl className="divide-y divide-border">
              <div className="grid grid-cols-[1fr_1.5fr] items-center gap-3 px-5 py-3">
                <dt className="text-sm text-muted-foreground">Name</dt>
                <dd className="min-w-0 truncate text-sm font-medium text-foreground text-right sm:text-left">{result.fullName}</dd>
              </div>
              <div className="grid grid-cols-[1fr_1.5fr] items-center gap-3 px-5 py-3">
                <dt className="text-sm text-muted-foreground">Program</dt>
                <dd className="min-w-0 truncate text-sm font-medium text-foreground text-right sm:text-left">{result.program}</dd>
              </div>
              <div className="grid grid-cols-[1fr_1.5fr] items-center gap-3 px-5 py-3">
                <dt className="text-sm text-muted-foreground">Level</dt>
                <dd className="min-w-0 truncate text-sm font-medium text-foreground text-right sm:text-left">{result.level}</dd>
              </div>
              <div className="grid grid-cols-[1fr_1.5fr] items-center gap-3 px-5 py-3">
                <dt className="text-sm text-muted-foreground">Expected graduation</dt>
                <dd className="min-w-0 truncate text-sm font-medium text-foreground text-right sm:text-left">{result.graduationYear}</dd>
              </div>
            </dl>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Not registered yet? <Link to="/register" className="text-primary font-medium underline-offset-4 hover:underline">{t("nav_register")}</Link>
        </p>
      </div>
    </PublicShell>
  );
}