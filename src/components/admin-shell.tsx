import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Copy,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  FileClock,
  Settings,
  LogOut,
  Menu,
  X,
  Download,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { isAdmin, setAdmin } from "@/lib/reg-store";
import { PremiumBackground } from "@/components/premium-background";

const NAV_GROUPS = [
  {
    label: "OVERVIEW",
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "STUDENT MANAGEMENT",
    items: [
      { to: "/admin/registrations", label: "Registrations", icon: Users },
      { to: "/admin/duplicates", label: "Duplicate Review", icon: Copy },
      { to: "/admin/graduated", label: "Graduated Students", icon: GraduationCap },
    ],
  },
  {
    label: "ADMINISTRATION",
    items: [
      { to: "/admin/programs", label: "Programmes", icon: BookOpen },
      { to: "/admin/admins", label: "Super Admins", icon: ShieldCheck },
      { to: "/admin/exports", label: "Exports", icon: Download },
      { to: "/admin/audit", label: "Audit Log", icon: FileClock },
      { to: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
] as const;

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin()) navigate({ to: "/admin/login" });
    else setChecked(true);
  }, [navigate]);

  if (!checked) return null;

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  const SideNav = (
    <nav className="flex flex-col px-3 pb-4">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="mt-6 mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/50">
            {group.label}
          </p>
          <div className="flex flex-col gap-0.5">
            {group.items.map((n) => {
              const Icon = n.icon;
              const active = isActive(n.to, "exact" in n && n.exact);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-sidebar-accent font-medium text-white"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white",
                  )}
                >
                  {active && (
                    <span className="absolute inset-y-1.5 left-0 w-[2px] rounded-full bg-primary" />
                  )}
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{n.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  const SidebarHeader = (
    <div className="flex h-14 items-center gap-2.5 px-4">
      <img
        src="/logo.png"
        alt="Logo"
        className="h-8 w-8 rounded-full bg-white/10 object-contain p-0.5"
      />
      <span className="font-heading text-sm font-semibold text-white">Admin Console</span>
    </div>
  );

  const LogoutButton = (
    <div className="border-t border-sidebar-border p-3">
      <button
        onClick={() => {
          setAdmin(false);
          navigate({ to: "/admin/login" });
        }}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-white"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </div>
  );

  return (
    <PremiumBackground className="min-h-screen">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col bg-primary-navy lg:flex">
          {SidebarHeader}
          <div className="flex-1 overflow-y-auto">{SideNav}</div>
          {LogoutButton}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="glass-header sticky top-0 z-20 flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-md border border-primary/15 bg-white/60 transition-colors hover:bg-white/80 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </button>
              <h1 className="truncate font-heading text-lg font-semibold text-foreground">
                {title}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-xs text-muted-foreground">Signed in as</p>
                <p className="text-xs font-medium">admin@example.edu</p>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary-deep">
                GB
              </span>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-primary-navy/60 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 flex w-72 flex-col bg-primary-navy shadow-modal transition-transform duration-300 ease-in-out",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-8 w-8 rounded-full bg-white/10 object-contain p-0.5"
              />
              <span className="font-heading text-sm font-semibold text-white">Admin Console</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-md text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">{SideNav}</div>
          {LogoutButton}
        </div>
      </div>
    </PremiumBackground>
  );
}
