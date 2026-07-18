import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Search, AlertCircle, Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useI18n, type Lang } from "@/lib/i18n";
import { COUNTRIES, LEVELS, PROGRAMS, calcGraduationYear, type Level, type StudyType, type AcademicStage, type EnglishPathway } from "@/lib/mock-data";
import { getDraft, saveDraft, type Draft } from "@/lib/reg-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register/form")({
  head: () => ({
    meta: [
      { title: "Registration form | International Student Registration" },
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

function PremiumSelect({
  value,
  onChange,
  placeholder = "Select",
  options,
  error,
  className,
  disabled,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
  error?: string;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  if (options.length > 10) {
    const selectedLabel = options.find((o) => o.value === value)?.label;
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-label={ariaLabel}
            className={cn(
              "!flex items-center justify-between gap-2 text-left whitespace-nowrap",
              className || cn(inputCls, "w-full px-3 transition-colors hover:bg-blue-50/80"),
              error && "border-destructive focus:shadow-[0_0_0_3px_rgba(196,61,75,0.15)]",
            )}
          >
            <span
              className={cn(
                "flex-1 overflow-hidden text-ellipsis whitespace-nowrap",
                !value && "text-muted-foreground",
              )}
            >
              {selectedLabel || placeholder}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] min-w-[220px] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder={t("f_search")} />
            <CommandList>
              <CommandEmpty>{t("f_no_results")}</CommandEmpty>
              <CommandGroup>
                {options.map((o) => (
                  <CommandItem
                    key={o.value}
                    value={o.label}
                    onSelect={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === o.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {o.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        aria-label={ariaLabel}
        className={cn(className, error && "border-destructive focus:ring-destructive/20")}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
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
  const { t } = useI18n();
  return (
    <PremiumSelect
      value={value}
      onChange={(v) => {
        const c = COUNTRIES.find((x) => x.name === v);
        if (c) onChange(c.name, c.code);
      }}
      placeholder={t("f_select_country")}
      options={COUNTRIES.map((c) => ({ value: c.name, label: c.name }))}
      error={error}
    />
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
  const { t } = useI18n();
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d\s()-]/g, "");
    onNumber(raw);
  };

  return (
    <div
      className={cn(
        "flex h-11 w-full items-center gap-1 overflow-hidden rounded-xl border border-blue-200 bg-white/80 px-1 shadow-[0_8px_22px_rgba(21,94,239,0.05)] backdrop-blur-[18px] transition-colors focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-400/10",
        disabled && "cursor-not-allowed opacity-60",
        error &&
          "border-destructive focus-within:border-destructive focus-within:ring-destructive/10",
      )}
    >
      <PremiumSelect
        ariaLabel={codeLabel}
        value={code}
        onChange={onCode}
        disabled={disabled}
        placeholder="+—"
        options={[...new Set(COUNTRIES.map((c) => c.code))].map((c) => ({ value: c, label: c }))}
        className="!h-full !w-[85px] shrink-0 !border-0 !bg-transparent !px-2 !shadow-none !rounded-none focus:!ring-0 hover:!bg-transparent text-sm font-medium"
      />

      <div className="h-5 w-[1px] shrink-0 bg-blue-200/60" />

      <input
        type="tel"
        disabled={disabled || !code}
        value={number}
        onChange={handleNumberChange}
        placeholder={!code ? "Select a country code first" : "Phone number"}
        className="h-full min-w-0 flex-1 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-slate-400"
      />
    </div>
  );
}

function LangSelector() {
  const { lang, setLang } = useI18n();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-9 rounded-lg border-blue-100 bg-white/80 px-2.5 text-xs shadow-sm backdrop-blur-xl hover:bg-blue-50"
        >
          <Languages className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
          <span className="whitespace-nowrap">{lang === "en" ? "EN" : "FR"}</span>
          <ChevronDown className="ml-1 h-3 w-3 text-slate-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuRadioGroup value={lang} onValueChange={(v) => setLang(v as Lang)}>
          <DropdownMenuRadioItem value="en">EN&nbsp;&nbsp;English</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="fr">FR&nbsp;&nbsp;Français</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
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
      
      // Handle Study Type cascading resets
      if (k === "study_type") {
        next.academic_stage = undefined;
        next.english_certificate_pathway = null;
        if (v === "english_certificate") {
          next.academic_stage = "english_certificate_year_1";
          next.program = "English Certificate"; // Pre-fill or don't require
        } else {
          next.program = prev.program === "English Certificate" ? "" : prev.program;
        }
      }

      if (k === "academic_stage" || k === "study_type") {
        // Sync the legacy `level` field for backwards compatibility if needed, though we primarily use `academic_stage` now.
        next.level = next.academic_stage as any;
        next.graduationYear = calcGraduationYear(next.academic_stage as AcademicStage) as number;
      }

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
    if (!d.fullName?.trim()) e.fullName = t("required") || "Required";
    if (!d.email?.trim()) e.email = t("required") || "Required";
    else if (!/^\S+@\S+\.\S+$/.test(d.email)) e.email = t("invalid_email") || "Invalid email";
    if (!d.gender) e.gender = t("required") || "Required";
    if (!d.country) e.country = t("required") || "Required";
    if (!d.phoneCode) {
      e.phone = "Select a country code first.";
    } else if (!d.phone?.trim()) {
      e.phone = "Enter your phone number.";
    } else if (!isValidPhoneNumber(`${d.phoneCode}${d.phone}`)) {
      e.phone = "This phone number is not valid for the selected country.";
    }

    if (!d.sameWhatsapp) {
      if (!d.whatsappCode) {
        e.whatsapp = "Select a country code first.";
      } else if (!d.whatsapp?.trim()) {
        e.whatsapp = "Enter your phone number.";
      } else if (!isValidPhoneNumber(`${d.whatsappCode}${d.whatsapp}`)) {
        e.whatsapp = "This phone number is not valid for the selected country.";
      }
    }
    
    if (!d.study_type) e.study_type = "Please select your study type.";
    if (!d.room_number?.trim()) e.room_number = "Please enter your room number.";
    
    if (d.study_type !== "english_certificate") {
      if (!d.program?.trim()) e.program = "Please enter your programme name.";
      if (!d.academic_stage) e.academic_stage = "Please select your academic stage.";
    } else {
      if (!d.english_certificate_pathway) e.english_certificate_pathway = "Please select your plan after completing the English Certificate.";
      if (d.english_certificate_pathway === "continue_to_bsc" || d.english_certificate_pathway === "continue_to_masters") {
         if (!d.program?.trim()) e.program = "Please enter your intended programme name.";
      }
    }

    if (!d.index?.trim()) e.index = t("required") || "Required";
    if (!consent) e.consent = t("required") || "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  useEffect(() => {
    if (!errors.phone && !errors.whatsapp) return;

    setErrors((prev) => {
      const next = { ...prev };

      if (next.phone !== undefined) {
        if (!d.phoneCode) {
          next.phone = "Select a country code first.";
        } else if (!d.phone?.trim()) {
          next.phone = "Enter your phone number.";
        } else if (!isValidPhoneNumber(`${d.phoneCode}${d.phone}`)) {
          next.phone = "This phone number is not valid for the selected country.";
        } else {
          delete next.phone;
        }
      }

      if (next.whatsapp !== undefined) {
        if (!d.sameWhatsapp) {
          if (!d.whatsappCode) {
            next.whatsapp = "Select a country code first.";
          } else if (!d.whatsapp?.trim()) {
            next.whatsapp = "Enter your phone number.";
          } else if (!isValidPhoneNumber(`${d.whatsappCode}${d.whatsapp}`)) {
            next.whatsapp = "This phone number is not valid for the selected country.";
          } else {
            delete next.whatsapp;
          }
        } else {
          delete next.whatsapp;
        }
      }

      return next;
    });
  }, [
    d.phoneCode,
    d.phone,
    d.whatsappCode,
    d.whatsapp,
    d.sameWhatsapp,
    errors.phone,
    errors.whatsapp,
  ]);

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
    <div className="mesh-gradient-bg relative min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/20 bg-white/10 backdrop-blur-xl">
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
          <div className="flex items-center gap-2">
            <LangSelector />
          </div>
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1600px] flex-col px-3 py-5 sm:px-5 lg:flex-row lg:gap-6 lg:px-6 lg:py-6 xl:gap-8 xl:px-8">
        <aside className="mb-5 flex shrink-0 flex-col justify-center lg:mb-0 lg:w-[28%] lg:max-w-sm lg:py-4 xl:w-[25%]">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-primary-navy sm:text-3xl lg:text-[1.75rem] xl:text-3xl">
            {t("form_title")}
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600 lg:text-[15px]">
            {t("form_sub")}
          </p>
          <div className="mt-6 hidden flex-col gap-3 lg:flex">
            <div className="rounded-lg border border-blue-100/60 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-deep">
                {t("sec_personal")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{t("sec_personal_desc")}</p>
            </div>
            <div className="rounded-lg border border-blue-100/60 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-deep">
                {t("sec_contact")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{t("sec_contact_desc")}</p>
            </div>
            <div className="rounded-lg border border-blue-100/60 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-deep">
                {t("sec_academic")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{t("sec_academic_desc")}</p>
            </div>
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:max-w-[75%]">
          {Object.keys(errors).length > 0 && (
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive backdrop-blur-sm">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{t("err_highlighted")}</p>
            </div>
          )}

          <form
            onSubmit={onReview}
            className="flex min-h-0 flex-1 flex-col rounded-xl border border-white/30 bg-white/20 p-4 shadow-[0_24px_70px_rgba(21,94,239,0.08)] backdrop-blur-2xl sm:p-6 lg:p-8"
          >
            <div className="min-h-0 flex-1 overflow-y-auto">
              <section className="mb-8">
                <SectionHeader title={t("sec_personal_info")} />
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
                    <PremiumSelect
                      value={d.gender ?? ""}
                      onChange={(v) => set("gender", v)}
                      placeholder={t("f_select_gender")}
                      error={errors.gender}
                      options={[
                        { value: "Female", label: t("f_female") },
                        { value: "Male", label: t("f_male") },
                        { value: "Other", label: t("f_other") },
                        { value: "Prefer not to say", label: t("f_prefer_not") },
                      ]}
                    />
                  </Field>
                </div>
              </section>

              <section className="mb-8">
                <SectionHeader title={t("sec_contact_info")} />
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
                <SectionHeader title={t("sec_academic_info") || "Academic Information"} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field label="Study Type" required error={errors.study_type}>
                      <PremiumSelect
                        value={d.study_type ?? ""}
                        onChange={(v) => set("study_type", v as StudyType)}
                        placeholder="Select Study Type"
                        error={errors.study_type}
                        options={[
                          { value: "bsc", label: "BSc" },
                          { value: "masters", label: "Master’s" },
                          { value: "english_certificate", label: "English Certificate" },
                        ]}
                      />
                    </Field>
                  </div>

                  {d.study_type && d.study_type !== "english_certificate" && (
                    <>
                      <div className="sm:col-span-2">
                        <Field label="Programme Name" required error={errors.program}>
                          <input
                            className={cn(inputCls, errors.program && "border-destructive")}
                            value={d.program ?? ""}
                            onChange={(e) => set("program", e.target.value)}
                            placeholder={d.study_type === "masters" ? "e.g. MSc Public Health" : "e.g. BSc Computer Science"}
                          />
                        </Field>
                      </div>

                      <Field label={d.study_type === "bsc" ? "Current BSc Level" : "Current Master's Year"} required error={errors.academic_stage}>
                        <PremiumSelect
                          value={d.academic_stage ?? ""}
                          onChange={(v) => set("academic_stage", v as AcademicStage)}
                          placeholder="Select Level/Year"
                          error={errors.academic_stage}
                          options={
                            d.study_type === "bsc"
                              ? [
                                  { value: "level_100", label: "Level 100" },
                                  { value: "level_200", label: "Level 200" },
                                  { value: "level_300", label: "Level 300" },
                                  { value: "level_400", label: "Level 400" },
                                ]
                              : [
                                  { value: "masters_year_1", label: "Master's Year 1" },
                                  { value: "masters_year_2", label: "Master's Year 2" },
                                ]
                          }
                        />
                      </Field>
                    </>
                  )}

                  {d.study_type === "english_certificate" && (
                    <div className="sm:col-span-2 space-y-5">
                      <Field label="Plan after English Certificate" required error={errors.english_certificate_pathway}>
                        <PremiumSelect
                          value={d.english_certificate_pathway ?? ""}
                          onChange={(v) => set("english_certificate_pathway", v as EnglishPathway)}
                          placeholder="Select your plan"
                          error={errors.english_certificate_pathway}
                          options={[
                            { value: "leave_after_certificate", label: "Complete certificate and leave" },
                            { value: "continue_to_bsc", label: "Continue to BSc" },
                            { value: "continue_to_masters", label: "Continue to Master’s" },
                          ]}
                        />
                      </Field>
                      
                      {(d.english_certificate_pathway === "continue_to_bsc" || d.english_certificate_pathway === "continue_to_masters") && (
                        <Field label="Intended Programme Name" required error={errors.program}>
                          <input
                            className={cn(inputCls, errors.program && "border-destructive")}
                            value={d.program ?? ""}
                            onChange={(e) => set("program", e.target.value)}
                            placeholder={d.english_certificate_pathway === "continue_to_masters" ? "e.g. MSc Public Health" : "e.g. BSc Computer Science"}
                          />
                        </Field>
                      )}
                    </div>
                  )}

                  <Field label="Room Number" required error={errors.room_number}>
                    <input
                      className={cn(inputCls, errors.room_number && "border-destructive")}
                      value={d.room_number ?? ""}
                      onChange={(e) => set("room_number", e.target.value)}
                      placeholder="e.g. KT 000 B"
                    />
                  </Field>
                  
                  <Field label={t("f_index")} required error={errors.index}>
                    <input
                      className={cn(inputCls, errors.index && "border-destructive")}
                      value={d.index ?? ""}
                      onChange={(e) => set("index", e.target.value)}
                      placeholder="e.g. 9012345 or REF-123"
                    />
                  </Field>

                  {d.study_type && d.academic_stage && (
                    <div className="sm:col-span-2">
                      <div className="graduation-panel">
                        <div>
                          <p className="text-sm font-medium text-primary-deep">{t("f_grad_year")}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Automatically calculated from your academic stage
                          </p>
                        </div>
                        <p className="font-heading text-2xl font-bold tabular-nums text-primary-deep">
                          {d.graduationYear || "—"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-lg border border-blue-100/60 bg-white/60 p-4 backdrop-blur-sm sm:p-5">
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
              <button type="submit" className="btn-primary w-full sm:ml-auto sm:w-auto px-4 sm:px-6 whitespace-nowrap">
                {t("btn_review")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
