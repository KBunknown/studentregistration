import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { setAdmin } from "@/lib/reg-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Super Admin login" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@example.edu");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    if (!password) {
      setError("Enter your password to continue.");
      setLoading(false);
      return;
    }
    setAdmin(true);
    navigate({ to: "/admin" });
  };

  const google = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setAdmin(true);
    navigate({ to: "/admin" });
  };

  const inputCls =
    "block w-full rounded-md border border-border bg-white px-3 py-2.5 h-11 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-card">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h1 className="mt-6 font-heading text-2xl font-bold text-primary-navy">Super Admin login</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage international student registrations.</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-6 shadow-card sm:p-8">
          <button
            onClick={google}
            disabled={loading}
            className="flex w-full h-11 items-center justify-center gap-2 rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-70"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.75 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.56-2.77c-.99.66-2.26 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.65l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            Continue with Google
          </button>
          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground uppercase tracking-widest font-medium">
            <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
          </div>
          <form onSubmit={submit} className="grid gap-5">
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-foreground">Email address</span>
              <input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-foreground">Password</span>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  className={cn(inputCls, "pr-10")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter any password (prototype)"
                />
                <button
                  type="button"
                  aria-label="Toggle password"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
            {error && (
              <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 inline-flex items-center justify-center rounded-md bg-primary h-11 px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-deep disabled:opacity-70"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">← Back to registration portal</Link>
        </p>
      </div>
    </div>
  );
}