import { Link } from "@tanstack/react-router";
import { useI18n, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { PremiumBackground } from "@/components/premium-background";
import type { ReactNode } from "react";

function LangSelector() {
  const { lang, setLang } = useI18n();
  const Btn = ({ v, label }: { v: Lang; label: string }) => (
    <button
      type="button"
      onClick={() => setLang(v)}
      className={cn(
        "px-2.5 py-1 text-xs font-semibold tracking-wider transition-colors rounded-md min-h-[28px]",
        lang === v
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-white/60",
      )}
      aria-pressed={lang === v}
    >
      {label}
    </button>
  );
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg border border-white/60 bg-white/50 p-0.5 backdrop-blur-sm">
      <Btn v="en" label="EN" />
      <Btn v="fr" label="FR" />
    </div>
  );
}

export function PublicShell({ children }: { children: ReactNode }) {
  const { t } = useI18n();

  return (
    <PremiumBackground className="flex min-h-screen flex-col">
      <header className="glass-header sticky top-0 z-30">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-5 lg:px-8">
          <Link to="/register" className="flex min-w-0 items-center gap-2.5">
            <img src="/logo.png" alt="Logo" className="h-9 w-9 shrink-0 object-contain" />
            <img
              src="/favicon.png"
              alt=""
              aria-hidden
              className="h-5 w-5 shrink-0 object-contain opacity-80"
            />
            <span className="font-heading truncate text-sm font-bold tracking-tight text-primary-navy sm:text-[15px]">
              {t("portal_title")}
            </span>
          </Link>
          <LangSelector />
        </div>
      </header>
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </PremiumBackground>
  );
}
