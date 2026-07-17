import { Link } from "@tanstack/react-router";
import { useI18n, type Lang } from "@/lib/i18n";
import { PremiumBackground } from "@/components/premium-background";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Languages } from "lucide-react";
import type { ReactNode } from "react";

function LangSelector() {
  const { lang, setLang } = useI18n();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-11 rounded-xl border-blue-100 bg-white/80 px-3 shadow-sm backdrop-blur-xl hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500/20"
        >
          <Languages className="mr-2 h-4 w-4 text-blue-600" />
          <span className="whitespace-nowrap">{lang === "en" ? "EN  English" : "FR  Français"}</span>
          <ChevronDown className="ml-2 h-4 w-4 text-slate-500" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuRadioGroup value={lang} onValueChange={(v) => setLang(v as Lang)}>
          <DropdownMenuRadioItem value="en">EN&nbsp;&nbsp;English</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="fr">FR&nbsp;&nbsp;Français</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function PublicShell({ children }: { children: ReactNode }) {
  const { t } = useI18n();

  return (
    <PremiumBackground className="flex min-h-screen flex-col">
      <header className="glass-header sticky top-0 z-30">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3 px-3 sm:px-5 lg:px-8">
          <Link to="/register" className="flex min-w-0 items-center gap-2.5">
            <img
              src="/logo.png"
              alt="International Student Registration logo"
              className="h-10 w-10 shrink-0 object-contain"
            />
            <span className="font-heading truncate text-sm font-bold tracking-tight text-primary-navy sm:text-[15px]">
              {t("portal_title")}
            </span>
          </Link>
          <LangSelector />
        </div>
      </header>
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      <footer className="px-4 pb-6 sm:px-5 lg:px-8">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 border-t border-blue-100/70 pt-4 text-[10px] sm:text-xs text-slate-500">
          <span className="font-medium">{t("portal_title")}</span>
          <img
            src="/emblem.png"
            alt="Partner emblem"
            className="h-8 w-8 shrink-0 object-contain opacity-75"
          />
        </div>
      </footer>
    </PremiumBackground>
  );
}
