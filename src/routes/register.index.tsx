import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, Search } from "lucide-react";
import { MeshBlobBg } from "@/components/mesh-blob-bg";

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

function LandingPage() {
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a1628]">
      <MeshBlobBg />

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
                <div className="flex items-center justify-center gap-6">
                  <img
                    src="/logo.png"
                    alt="International Student Registration"
                    className="h-28 w-28 object-contain drop-shadow-2xl sm:h-36 sm:w-36"
                  />
                  <img
                    src="/emblem.png"
                    alt="Partner emblem"
                    className="h-20 w-20 object-contain opacity-80 drop-shadow-xl sm:h-28 sm:w-28"
                  />
                </div>

                <h1 className="mt-8 font-heading text-3xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
                  {t("portal_title")}
                </h1>

                <p className="mt-4 max-w-lg text-base leading-relaxed text-blue-100/80 sm:text-lg">
                  {t("landing_sub")}
                </p>

                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                  <Link
                    to="/register/form"
                    className="inline-flex h-14 items-center gap-3 rounded-2xl bg-blue-600 px-8 text-lg font-semibold text-white shadow-[0_8px_32px_rgba(59,130,246,0.4)] transition-all hover:bg-blue-500 hover:shadow-[0_12px_40px_rgba(59,130,246,0.5)] active:scale-[0.98]"
                  >
                    {t("landing_cta")}
                    <ArrowRight className="h-5 w-5" />
                  </Link>

                  <Link
                    to="/register/already"
                    className="inline-flex h-14 items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 text-base font-medium text-white/80 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
                  >
                    <Search className="h-5 w-5" />
                    {t("landing_already")}
                  </Link>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center backdrop-blur-sm">
                    <p className="font-heading text-lg font-bold text-blue-300">5 min</p>
                    <p className="mt-1 text-xs text-blue-200/60">{t("landing_feature_1_d")}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center backdrop-blur-sm">
                    <p className="font-heading text-lg font-bold text-blue-300">
                      {t("landing_feature_2_t")}
                    </p>
                    <p className="mt-1 text-xs text-blue-200/60">{t("landing_feature_2_d")}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center backdrop-blur-sm">
                    <p className="font-heading text-lg font-bold text-blue-300">
                      {t("landing_feature_3_t")}
                    </p>
                    <p className="mt-1 text-xs text-blue-200/60">{t("landing_feature_3_d")}</p>
                  </div>
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
