import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { ArrowRight } from "lucide-react";

const MeshBlobBg = lazy(() =>
  import("@/components/mesh-blob-bg").then((m) => ({ default: m.MeshBlobBg }))
);

export const Route = createFileRoute("/register/")({
  head: () => ({
    meta: [
      { title: "International Student Registration Portal" },
      {
        name: "description",
        content: "Secure bilingual registration portal for international students.",
      },
    ],
  }),
  component: LandingPage,
});

function LazyBackground() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Check if the user prefers reduced motion — skip the animation entirely
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    // Small delay so the fade-in starts after the canvas has had time to render a frame
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Respect reduced-motion: don't load the heavy WebGL canvas at all
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) return null;

  return (
    <div
      style={{
        opacity: ready ? 1 : 0,
        transition: "opacity 0.6s ease-in",
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Suspense fallback={null}>
        <MeshBlobBg />
      </Suspense>
    </div>
  );
}

function LandingPage() {
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a1628]">
      <LazyBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10 w-10 object-contain drop-shadow-lg"
            />
            <span className="font-heading text-sm font-bold tracking-tight text-white/90 sm:text-[15px]">
              {t("portal_title")}
            </span>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
          <div className="w-full max-w-2xl">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-12 lg:p-16">
              <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center gap-8">
                    <div className="flex h-36 w-36 items-center justify-center overflow-hidden drop-shadow-2xl">
                      <img
                        src="/logo.png"
                        alt="International Student Registration"
                        className="max-w-none"
                        style={{ height: "118%", width: "118%", objectFit: "cover" }}
                      />
                    </div>
                    <div className="flex h-36 w-36 items-center justify-center overflow-hidden drop-shadow-2xl">
                      <img
                        src="/emblem.png"
                        alt="Partner emblem"
                        className="h-full w-full object-contain opacity-80"
                      />
                    </div>
                  </div>

                <h1 className="mt-8 font-heading text-3xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
                  {t("portal_title")}
                </h1>

                <div className="mt-10">
                  <Link
                    to="/register/form"
                    className="inline-flex h-14 items-center gap-3 rounded-2xl bg-blue-600 px-10 text-lg font-semibold text-white shadow-[0_8px_32px_rgba(59,130,246,0.4)] transition-all hover:bg-blue-500 hover:shadow-[0_12px_40px_rgba(59,130,246,0.5)] active:scale-[0.98]"
                  >
                    {t("landing_cta")}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="px-6 pb-6 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-xs text-white/40">{t("portal_title")}</span>
            <img
              src="/emblem.png"
              alt="Emblem"
              className="h-7 w-7 object-contain opacity-50"
            />
          </div>
        </footer>
      </div>
    </div>
  );
}
