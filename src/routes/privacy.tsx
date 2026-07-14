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
      en: ["What we collect", "Personal details you submit through the registration form: full name, email, gender, country, phone and WhatsApp numbers, program, index number and current level."],
      fr: ["Ce que nous collectons", "Les informations personnelles soumises via le formulaire d'inscription : nom complet, e-mail, genre, pays, numéros de téléphone et WhatsApp, programme, numéro d'index et niveau actuel."],
    },
    {
      en: ["How we use it", "To manage your registration, prevent duplicates, communicate essential updates, and produce anonymised statistics on international student cohorts."],
      fr: ["Comment nous les utilisons", "Pour gérer votre inscription, éviter les doublons, communiquer des mises à jour essentielles et produire des statistiques anonymisées sur les cohortes d'étudiants internationaux."],
    },
    {
      en: ["Who can see it", "Only authorised super administrators of the portal. We do not sell or share your data with third parties."],
      fr: ["Qui peut y accéder", "Seuls les super administrateurs autorisés du portail. Nous ne vendons ni ne partageons vos données avec des tiers."],
    },
    {
      en: ["Your rights", "You may contact administrators to correct or remove your details at any time."],
      fr: ["Vos droits", "Vous pouvez contacter les administrateurs pour corriger ou supprimer vos informations à tout moment."],
    },
  ];
  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-primary-deep shadow-sm mb-6">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-primary-navy sm:text-4xl">{t("privacy_title")}</h1>
          <p className="mt-3 text-sm font-medium text-muted-foreground uppercase tracking-widest">
            {lang === "fr" ? "Dernière mise à jour : juillet 2026" : "Last updated: July 2026"}
          </p>
        </div>
        
        <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
          <div className="divide-y divide-border">
            {sections.map((s, i) => (
              <section key={i} className="p-6 sm:p-8 hover:bg-muted/30 transition-colors">
                <h2 className="font-heading text-lg font-bold text-primary-deep">{s[lang][0]}</h2>
                <p className="mt-3 text-base text-foreground leading-relaxed">{s[lang][1]}</p>
              </section>
            ))}
          </div>
        </div>
        
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>{lang === "fr" ? "Pour toute question concernant cette politique, veuillez contacter le registraire." : "For questions about this policy, please contact the registrar."}</p>
        </div>
      </div>
    </PublicShell>
  );
}