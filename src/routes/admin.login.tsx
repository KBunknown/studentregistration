import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { PremiumBackground } from "@/components/premium-background";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin login | International Student Registration" },
      {
        name: "description",
        content: "Admin login for International Student Registration.",
      },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate({ to: "/admin" });
      }
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    if (!password || !email) {
      setError("Enter your email and password to continue.");
      setLoading(false);
      return;
    }
    
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      setLoading(false);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      // Successfully signed up and automatically logged in!
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      navigate({ to: "/admin" });
    }
  };


  return (
    <PremiumBackground className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg">
        <div className="glass-panel rounded-xl p-6 sm:p-8 lg:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <img
              src="/logo.png"
              alt="International Student Registration logo"
              className="h-16 w-16 object-contain"
            />
            <h1 className="mt-5 font-heading text-2xl font-bold text-primary-navy">
              International Student Registration
            </h1>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Admin login
            </p>
          </div>

          <form onSubmit={submit} className="grid gap-5">
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-foreground">Email address</span>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-foreground">Password</span>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  className={cn("form-input pr-10")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
            {error && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-70"
            >
              {loading ? "Please wait…" : isSignUp ? "Create Account" : "Sign in"}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-sm font-medium text-primary hover:text-primary-deep hover:underline mt-2 text-center"
            >
              {isSignUp ? "Already have an account? Sign in" : "Authorized by a team member? Set your password"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/register" className="font-medium transition-colors hover:text-primary-deep">
            Back to International Student Registration
          </Link>
        </p>
      </div>
    </PremiumBackground>
  );
}
