import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Search, AlertCircle } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { useI18n } from "@/lib/i18n";
import { COUNTRIES, LEVELS, PROGRAMS, graduationYearFor, type Level } from "@/lib/mock-data";
import { getDraft, saveDraft, type Draft } from "@/lib/reg-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register/")({
  head: () => ({
    meta: [
      { title: "Registration form — International Student Registration Portal" },
      {
        name: "description",
        content: "Enter your details to register as an international student.",
      },
    ],
  }),
  component: RegisterForm,
});

type Errors = Partial<Record<keyof Draft | "consent", string>>;

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-5 border-b border-primary/10 pb-2.5">
      <h2 className="font-heading text-base font-semibold text-primary-deep">{title}</h2>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
  hint,
  className,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="h-3 w-3 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}

const inputCls = "form-input";

function ProgramCombo({
  value,
  onChange,
  placeholder,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => PROGRAMS.filter((p) => p.toLowerCase().includes(q.toLowerCase())),
    [q],
  );
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-program-combo]")) setOpen(false);
    };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [open]);
  return (
    <div className="relative" data-program-combo>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          inputCls,
          "flex items-center justify-between text-left",
          error && "border-destructive focus:shadow-[0_0_0_3px_rgba(196,61,75,0.15)]",
        )}
      >
        <span className={cn("truncate", !value && "text-muted-foreground")}>
          {value || placeholder}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>
      {open && (
        <div className="glass-panel absolute z-20 mt-1 w-full overflow-hidden rounded-lg shadow-dropdown">
          <div className="flex items-center gap-2 border-b border-primary/10 px-3 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search programs"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <ul className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-4 text-center text-xs text-muted-foreground">
                No programs match your search.
              </li>
            ) : (
              filtered.map((p) => (
                <li key={p}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(p);
                      setOpen(false);
                      setQ("");
                    }}
                    className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors hover:bg-primary-soft/80"
                  >
                    <span className="truncate">{p}</span>
                    {p === value && <Check className="h-4 w-4 shrink-0 text-primary" />}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function CountrySelect({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (name: string, code: string) => void;
  error?: string;
}) {
  return (
    <select
      className={cn(inputCls, error && "border-destructive")}
      value={value}
      onChange={(e) => {
        const c = COUNTRIES.find((x) => x.name === e.target.value);
        if (c) onChange(c.name, c.code);
      }}
    >
      <option value="">Select a country</option>
      {COUNTRIES.map((c) => (
        <option key={c.name} value={c.name}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

function PhoneRow({
  code,
  number,
  onCode,
  onNumber,
  disabled,
  error,
  codeLabel,
}: {
  code: string;
  number: string;
  onCode: (v: string) => void;
  onNumber: (v: string) => void;
  disabled?: boolean;
  error?: string;
  codeLabel: string;
}) {
  return (
    <div className={cn("flex gap-2", disabled && "opacity-60")}>
      <select
        aria-label={codeLabel}
        value={code}
        disabled={disabled}
        onChange={(e) => onCode(e.target.value)}
        className={cn(inputCls, "w-28 shrink-0", error && "border-destructive")}
      >
        <option value="">+—</option>
        {[...new Set(COUNTRIES.map((c) => c.code))].map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <input
        type="tel"
        inputMode="tel"
        disabled={disabled}
        value={number}
        onChange={(e) => onNumber(e.target.value)}
        placeholder="000 000 000"
        className={cn(inputCls, error && "border-destructive")}
      />
    </div>
  );
}

function RegisterForm() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [d, setD] = useState<Draft>({});
  const [errors, setErrors] = useState<Errors>({});
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    setD(getDraft());
  }, []);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) =>
    setD((prev) => {
      const next = { ...prev, [k]: v };
      if (k === "level") next.graduationYear = graduationYearFor(v as Level) as number;
      if (k === "sameWhatsapp" && v) {
        next.whatsapp = prev.phone;
        next.whatsappCode = prev.phoneCode;
      }
      if ((k === "phone" || k === "phoneCode") && prev.sameWhatsapp) {
        next.whatsapp = k === "phone" ? (v as string) : prev.phone;
        next.whatsappCode = k === "phoneCode" ? (v as string) : prev.phoneCode;
      }
      return next;
    });

  const validate = (): boolean => {
    const e: Errors = {};
    if (!d.fullName?.trim()) e.fullName = t("required");
    if (!d.email?.trim()) e.email = t("required");
    else if (!/^\S+@\S+\.\S+$/.test(d.email)) e.email = t("invalid_email");
    if (!d.gender) e.gender = t("required");
    if (!d.country) e.country = t("required");
    if (!d.phoneCode || !d.phone?.trim()) e.phone = t("required");
    if (!d.sameWhatsapp && (!d.whatsappCode || !d.whatsapp?.trim())) e.whatsapp = t("required");
    if (!d.program) e.program = t("required");
    if (d.program === "Other Program" && !d.otherProgram?.trim()) e.otherProgram = t("required");
    if (!d.index?.trim()) e.index = t("required");
    if (!d.level) e.level = t("required");
    if (!consent) e.consent = t("required");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    saveDraft(d);
    navigate({ to: "/register/review" });
  };

  return (
    <PublicShell>
      <div className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col px-4 py-5 sm:px-5 lg:flex-row lg:gap-6 lg:px-6 lg:py-6 xl:gap-8 xl:px-8">
        {/* Intro panel — desktop left column */}
        <aside className="mb-5 flex shrink-0 flex-col justify-center lg:mb-0 lg:w-[28%] lg:max-w-sm lg:py-4 xl:w-[25%]">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-white drop-shadow-sm sm:text-3xl lg:text-[1.75rem] xl:text-3xl">
            {t("form_title")}
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85 lg:text-[15px]">
            {t("form_sub")}
          </p>
          <div className="mt-6 hidden flex-col gap-3 lg:flex">
            <div className="glass-panel-subtle rounded-lg px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-deep">
                Personal
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Name, email, gender</p>
            </div>
            <div className="glass-panel-subtle rounded-lg px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-deep">
                Contact
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Country, phone, WhatsApp</p>
            </div>
            <div className="glass-panel-subtle rounded-lg px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-deep">
                Academic
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Programme, index, level</p>
            </div>
          </div>
        </aside>

        {/* Registration panel — 65–75% on desktop */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:max-w-[75%]">
          {Object.keys(errors).length > 0 && (
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive backdrop-blur-sm">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>Please correct the highlighted fields before continuing.</p>
            </div>
          )}

          <form
            onSubmit={onReview}
            className="glass-panel flex min-h-0 flex-1 flex-col rounded-xl p-5 sm:p-6 lg:p-8"
          >
            <div className="min-h-0 flex-1 overflow-y-auto">
              <section className="mb-8">
                <SectionHeader title="Personal Information" />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("f_fullname")} required error={errors.fullName}>
                    <input
                      className={cn(inputCls, errors.fullName && "border-destructive")}
                      value={d.fullName ?? ""}
                      onChange={(e) => set("fullName", e.target.value)}
                      placeholder="e.g. Ama Mensah"
                      autoComplete="name"
                    />
                  </Field>
                  <Field label={t("f_email")} required error={errors.email}>
                    <input
                      type="email"
                      className={cn(inputCls, errors.email && "border-destructive")}
                      value={d.email ?? ""}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </Field>
                  <Field label={t("f_gender")} required error={errors.gender}>
                    <select
                      className={cn(inputCls, errors.gender && "border-destructive")}
                      value={d.gender ?? ""}
                      onChange={(e) => set("gender", e.target.value)}
                    >
                      <option value="">—</option>
                      <option value="Female">{t("f_female")}</option>
                      <option value="Male">{t("f_male")}</option>
                      <option value="Other">{t("f_other")}</option>
                      <option value="Prefer not to say">{t("f_prefer_not")}</option>
                    </select>
                  </Field>
                </div>
              </section>

              <section className="mb-8">
                <SectionHeader title="Contact Information" />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("f_country")} required error={errors.country}>
                    <CountrySelect
                      value={d.country ?? ""}
                      onChange={(name, code) => {
                        setD((prev) => {
                          const next: Draft = { ...prev, country: name };
                          if (!prev.phoneCode) next.phoneCode = code;
                          if (prev.sameWhatsapp) next.whatsappCode = next.phoneCode;
                          return next;
                        });
                      }}
                      error={errors.country}
                    />
                  </Field>
                  <div className="hidden sm:block" />
                  <Field label={t("f_phone")} required error={errors.phone}>
                    <PhoneRow
                      codeLabel={t("f_country_code")}
                      code={d.phoneCode ?? ""}
                      number={d.phone ?? ""}
                      onCode={(v) => set("phoneCode", v)}
                      onNumber={(v) => set("phone", v)}
                      error={errors.phone}
                    />
                  </Field>
                  <Field label={t("f_whatsapp")} required error={errors.whatsapp}>
                    <PhoneRow
                      codeLabel={t("f_country_code")}
                      code={d.sameWhatsapp ? (d.phoneCode ?? "") : (d.whatsappCode ?? "")}
                      number={d.sameWhatsapp ? (d.phone ?? "") : (d.whatsapp ?? "")}
                      onCode={(v) => set("whatsappCode", v)}
                      onNumber={(v) => set("whatsapp", v)}
                      disabled={!!d.sameWhatsapp}
                      error={errors.whatsapp}
                    />
                  </Field>
                  <label className="flex min-h-[44px] items-center gap-2.5 sm:col-span-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border text-primary accent-primary focus:ring-2 focus:ring-primary/20"
                      checked={!!d.sameWhatsapp}
                      onChange={(e) => set("sameWhatsapp", e.target.checked)}
                    />
                    <span className="text-sm text-foreground">{t("f_same_wa")}</span>
                  </label>
                </div>
              </section>

              <section className="mb-6">
                <SectionHeader title="Academic Information" />
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label={t("f_program")} required error={errors.program}>
                      <ProgramCombo
                        value={d.program ?? ""}
                        onChange={(v) => set("program", v)}
                        placeholder={t("f_program_ph")}
                        error={errors.program}
                      />
                    </Field>
                  </div>

                  {d.program === "Other Program" && (
                    <div className="sm:col-span-2">
                      <Field label={t("f_other_program")} required error={errors.otherProgram}>
                        <input
                          className={cn(inputCls, errors.otherProgram && "border-destructive")}
                          value={d.otherProgram ?? ""}
                          onChange={(e) => set("otherProgram", e.target.value)}
                          placeholder="e.g. BSc Applied Physics"
                        />
                      </Field>
                    </div>
                  )}

                  <Field label={t("f_index")} required error={errors.index}>
                    <input
                      className={cn(inputCls, errors.index && "border-destructive")}
                      value={d.index ?? ""}
                      onChange={(e) => set("index", e.target.value)}
                      placeholder="e.g. 9012345"
                    />
                  </Field>
                  <Field label={t("f_level")} required error={errors.level}>
                    <select
                      className={cn(inputCls, errors.level && "border-destructive")}
                      value={d.level ?? ""}
                      onChange={(e) => set("level", e.target.value as Level)}
                    >
                      <option value="">—</option>
                      {LEVELS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <div className="sm:col-span-2">
                    <div className="graduation-panel">
                      <div>
                        <p className="text-sm font-medium text-primary-deep">{t("f_grad_year")}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Calculated from your current level
                        </p>
                      </div>
                      <p className="font-heading text-2xl font-bold tabular-nums text-primary-deep">
                        {d.graduationYear || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="glass-panel-subtle rounded-lg p-4 sm:p-5">
                <label className="flex min-h-[44px] items-start gap-3">
                  <input
                    type="checkbox"
                    className={cn(
                      "mt-0.5 h-4 w-4 rounded border-border text-primary accent-primary focus:ring-2 focus:ring-primary/20",
                      errors.consent && "outline outline-1 outline-destructive",
                    )}
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  <span className="text-sm leading-relaxed text-foreground">
                    {t("f_consent")}{" "}
                    <Link to="/privacy" className="text-primary underline-offset-4 hover:underline">
                      {t("nav_privacy")}
                    </Link>
                  </span>
                </label>
                {errors.consent && (
                  <p className="mt-2 ml-7 text-xs text-destructive">{errors.consent}</p>
                )}
              </section>
            </div>

            <div className="mt-6 shrink-0 border-t border-primary/10 pt-6">
              <button type="submit" className="btn-primary w-full sm:ml-auto sm:w-auto">
                {t("btn_review")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PublicShell>
  );
}
