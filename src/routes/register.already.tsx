import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getAllRegistrations } from "@/lib/reg-store";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
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
  const [searching, setSearching] = useState(false);

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setResult(null);

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from("students")
          .select("*")
          .eq("index_number", index.trim())
          .eq("email", email.trim().toLowerCase())
          .single();

        if (error || !data) {
          setResult("none");
        } else {
          setResult({
            id: data.id,
            fullName: data.full_name,
            email: data.email,
            gender: data.gender,
            country: data.country,
            phoneCode: data.phone_code,
            phone: data.phone,
            whatsappCode: data.whatsapp_code,
            whatsapp: data.whatsapp,
            sameWhatsapp: data.same_whatsapp,
            program: data.program,
            otherProgram: data.other_program,
            index: data.index_number,
            level: data.level,
            graduationYear: data.graduation_year,
            graduated: data.graduated,
            registrationDate: data.registration_date,
          });
        }
      } else {
      const regs = await getAllRegistrations();
      const match = regs.find(
          (r) => r.index === index.trim() && r.email.toLowerCase() === email.trim().toLowerCase(),
        );
        setResult(match ?? "none");
      }
    } catch {
      setResult("none");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="mesh-gradient-bg relative min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/20 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3 px-3 sm:px-5 lg:px-8">
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
        </div>
      </header>

      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-2xl font-bold text-primary-navy sm:text-3xl">
            {t("already_title")}
          </h1>
          <p className="mt-2 text-sm text-slate-600">{t("already_sub")}</p>
        </div>

        <form
          onSubmit={lookup}
          className="grid gap-5 rounded-xl border border-white/30 bg-white/20 p-4 shadow-[0_24px_70px_rgba(21,94,239,0.08)] backdrop-blur-2xl sm:p-8"
        >
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-foreground">{t("f_index")}</span>
            <input
              className="form-input"
              value={index}
              onChange={(e) => setIndex(e.target.value)}
              placeholder="e.g. 9012345 or REF-123"
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
          <button className="btn-primary mt-2 px-4 sm:px-6" disabled={searching}>
            <Search className="h-4 w-4" /> {searching ? "Searching..." : t("already_lookup")}
          </button>
        </form>

        {result === "none" && (
          <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive backdrop-blur-sm">
            {t("already_none")}
          </div>
        )}
        {result && result !== "none" && (
          <div className="mt-6 overflow-hidden rounded-xl border border-white/30 bg-white/75 shadow-[0_24px_70px_rgba(21,94,239,0.08)] backdrop-blur-2xl">
            <div className="border-b border-primary/10 bg-success/10 px-5 py-4">
              <p className="font-heading text-sm font-semibold text-success">{t("already_found")}</p>
            </div>
            <dl className="divide-y divide-primary/10">
              <div className="grid grid-cols-[1fr_1.5fr] items-center gap-3 px-5 py-3.5">
                <dt className="text-sm text-muted-foreground">{t("f_name")}</dt>
                <dd className="min-w-0 truncate text-right text-sm font-medium text-foreground sm:text-left">
                  {result.fullName}
                </dd>
              </div>
              <div className="grid grid-cols-[1fr_1.5fr] items-center gap-3 px-5 py-3.5">
                <dt className="text-sm text-muted-foreground">{t("f_program")}</dt>
                <dd className="min-w-0 truncate text-right text-sm font-medium text-foreground sm:text-left">
                  {result.program}
                </dd>
              </div>
              <div className="grid grid-cols-[1fr_1.5fr] items-center gap-3 px-5 py-3.5">
                <dt className="text-sm text-muted-foreground">{t("f_level")}</dt>
                <dd className="min-w-0 truncate text-right text-sm font-medium text-foreground sm:text-left">
                  {result.level}
                </dd>
              </div>
              <div className="grid grid-cols-[1fr_1.5fr] items-center gap-3 px-5 py-3.5">
                <dt className="text-sm text-muted-foreground">{t("f_grad_year")}</dt>
                <dd className="min-w-0 truncate text-right text-sm font-medium text-foreground sm:text-left">
                  {result.graduationYear}
                </dd>
              </div>
            </dl>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-slate-600">
          Not registered yet?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 underline-offset-4 hover:underline"
          >
            {t("nav_register")}
          </Link>
        </p>
      </div>
    </div>
  );
}
