import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useI18n, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function LangSelector() {
  const { lang, setLang } = useI18n();
  const Btn = ({ v, label }: { v: Lang; label: string }) => (
    <button
      type="button"
      onClick={() => setLang(v)}
      className={cn(
        "px-2.5 py-1 text-xs font-semibold tracking-wider transition-colors rounded-md",
        lang === v
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
      )}
      aria-pressed={lang === v}
    >
      {label}
    </button>
  );
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-white p-0.5">
      <Btn v="en" label="EN" />
      <Btn v="fr" label="FR" />
    </div>
  );
}

export function PublicShell({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-primary-very-light">
      {/* Slim top header */}
      <header className="sticky top-0 z-30 border-b border-border bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-3">
            <Link to="/register" className="flex min-w-0 items-center gap-2">
              <span className="font-heading text-[15px] font-bold tracking-tight text-primary-navy sm:text-base">
                International Student Registration
              </span>
            </Link>
            <div className="hidden items-center gap-1 md:flex">
              <nav className="flex items-center gap-0.5 text-sm">
                <Link
                  to="/register"
                  className="rounded-lg px-3 py-2 font-medium text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary"
                  activeProps={{ className: "!bg-primary-soft !text-primary" }}
                >
                  {t("nav_register")}
                </Link>
                <Link
                  to="/register/already"
                  className="rounded-lg px-3 py-2 font-medium text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary"
                  activeProps={{ className: "!bg-primary-soft !text-primary" }}
                >
                  {t("nav_already")}
                </Link>
                <Link
                  to="/privacy"
                  className="rounded-lg px-3 py-2 font-medium text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary"
                  activeProps={{ className: "!bg-primary-soft !text-primary" }}
                >
                  {t("nav_privacy")}
                </Link>
              </nav>
              <div className="ml-2">
                <LangSelector />
              </div>
            </div>
            <div className="flex items-center gap-2 md:hidden">
              <LangSelector />
              <button
                type="button"
                aria-label="Menu"
                onClick={() => setOpen((o) => !o)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted"
              >
                {open ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          {/* Mobile menu */}
          {open && (
            <nav className="grid gap-1 pb-3 md:hidden border-t border-border pt-2">
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-primary-soft hover:text-primary"
              >
                {t("nav_register")}
              </Link>
              <Link
                to="/register/already"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-primary-soft hover:text-primary"
              >
                {t("nav_already")}
              </Link>
              <Link
                to="/privacy"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-primary-soft hover:text-primary"
              >
                {t("nav_privacy")}
              </Link>
            </nav>
          )}
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} International Student Registration</p>
          <div className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="hover:text-foreground transition-colors"
            >
              {t("nav_privacy")}
            </Link>
            <Link
              to="/admin/login"
              className="hover:text-foreground transition-colors"
            >
              {t("nav_admin")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}