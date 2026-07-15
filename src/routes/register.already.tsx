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

  return (
    <PublicShell>
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-2xl font-bold text-white drop-shadow-sm sm:text-3xl">
            {t("already_title")}
          </h1>
          <p className="mt-2 text-sm text-white/85">{t("already_sub")}</p>
        </div>

        <form onSubmit={lookup} className="glass-panel grid gap-5 rounded-xl p-6 sm:p-8">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-foreground">{t("f_index")}</span>
            <input
              className="form-input"
              value={index}
              onChange={(e) => setIndex(e.target.value)}
              placeholder="e.g. 9012345"
              required
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-foreground">{t("f_email")}</span>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <button className="btn-primary mt-2">
            <Search className="h-4 w-4" /> {t("already_lookup")}
          </button>
        </form>

        {result === "none" && (
          <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive backdrop-blur-sm">
            {t("already_none")}
          </div>
        )}
        {result && result !== "none" && (
          <div className="glass-panel mt-6 overflow-hidden rounded-xl">
            <div className="border-b border-primary/10 bg-success/10 px-5 py-4">
              <p className="font-heading text-sm font-semibold text-success">Registration Found</p>
            </div>
            <dl className="divide-y divide-primary/10">
              <div className="grid grid-cols-[1fr_1.5fr] items-center gap-3 px-5 py-3.5">
                <dt className="text-sm text-muted-foreground">Name</dt>
                <dd className="min-w-0 truncate text-right text-sm font-medium text-foreground sm:text-left">
                  {result.fullName}
                </dd>
              </div>
              <div className="grid grid-cols-[1fr_1.5fr] items-center gap-3 px-5 py-3.5">
                <dt className="text-sm text-muted-foreground">Program</dt>
                <dd className="min-w-0 truncate text-right text-sm font-medium text-foreground sm:text-left">
                  {result.program}
                </dd>
              </div>
              <div className="grid grid-cols-[1fr_1.5fr] items-center gap-3 px-5 py-3.5">
                <dt className="text-sm text-muted-foreground">Level</dt>
                <dd className="min-w-0 truncate text-right text-sm font-medium text-foreground sm:text-left">
                  {result.level}
                </dd>
              </div>
              <div className="grid grid-cols-[1fr_1.5fr] items-center gap-3 px-5 py-3.5">
                <dt className="text-sm text-muted-foreground">Expected graduation</dt>
                <dd className="min-w-0 truncate text-right text-sm font-medium text-foreground sm:text-left">
                  {result.graduationYear}
                </dd>
              </div>
            </dl>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-white/80">
          Not registered yet?{" "}
          <Link
            to="/register"
            className="font-medium text-white underline-offset-4 hover:underline"
          >
            {t("nav_register")}
          </Link>
        </p>
      </div>
    </PublicShell>
  );
}
