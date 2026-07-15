import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/public-shell";
import { useI18n } from "@/lib/i18n";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Notice — International Student Registration" }] }),
  component: Privacy,
});

function Privacy() {
  const { t, lang } = useI18n();
  const sections: { en: [string, string]; fr: [string, string] }[] = [
    {
      en: [
        "What we collect",
        "Personal details you submit through the registration form: full name, email, gender, country, phone and WhatsApp numbers, program, index number and current level.",
      ],
      fr: [
        "Ce que nous collectons",
        "Les informations personnelles soumises via le formulaire d'inscription : nom complet, e-mail, genre, pays, numéros de téléphone et WhatsApp, programme, numéro d'index et niveau actuel.",
      ],
    },
    {
      en: [
        "How we use it",
        "To manage your registration, prevent duplicates, communicate essential updates, and produce anonymised statistics on international student cohorts.",
      ],
      fr: [
        "Comment nous les utilisons",
        "Pour gérer votre inscription, éviter les doublons, communiquer des mises à jour essentielles et produire des statistiques anonymisées sur les cohortes d'étudiants internationaux.",
      ],
    },
    {
      en: [
        "Who can see it",
        "Only authorised super administrators of the portal. We do not sell or share your data with third parties.",
      ],
      fr: [
        "Qui peut y accéder",
        "Seuls les super administrateurs autorisés du portail. Nous ne vendons ni ne partageons vos données avec des tiers.",
      ],
    },
    {
      en: [
        "Your rights",
        "You may contact administrators to correct or remove your details at any time.",
      ],
      fr: [
        "Vos droits",
        "Vous pouvez contacter les administrateurs pour corriger ou supprimer vos informations à tout moment.",
      ],
    },
  ];
  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 grid h-14 w-14 place-items-center rounded-xl bg-white/20 text-white backdrop-blur-sm">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white drop-shadow-sm sm:text-3xl">
            {t("privacy_title")}
          </h1>
        </div>

        <div className="glass-panel overflow-hidden rounded-xl">
          <div className="divide-y divide-primary/10">
            {sections.map((s, i) => (
              <section key={i} className="p-6 sm:p-8">
                <h2 className="font-heading text-base font-semibold text-primary-deep">
                  {s[lang][0]}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground sm:text-base">
                  {s[lang][1]}
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
