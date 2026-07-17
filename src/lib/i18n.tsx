import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "fr";

type Dict = Record<string, { en: string; fr: string }>;

export const dict = {
  portal_title: {
    en: "International Student Registration",
    fr: "International Student Registration",
  },
  nav_register: { en: "Register", fr: "S'inscrire" },
  nav_already: { en: "Already registered", fr: "Déjà inscrit" },
  nav_privacy: { en: "Privacy", fr: "Confidentialité" },
  nav_admin: { en: "Admin", fr: "Admin" },

  landing_headline: {
    en: "Register for the upcoming academic year",
    fr: "Inscrivez-vous pour la prochaine année académique",
  },
  landing_sub: {
    en: "Complete a short bilingual form to secure your place. Fields marked with an asterisk are required.",
    fr: "Remplissez un court formulaire bilingue pour confirmer votre place. Les champs marqués d'un astérisque sont obligatoires.",
  },
  landing_cta: { en: "Start registration", fr: "Commencer l'inscription" },
  landing_already: { en: "I have already registered", fr: "Je suis déjà inscrit" },
  landing_feature_1_t: { en: "5 minutes", fr: "5 minutes" },
  landing_feature_1_d: {
    en: "Average time to complete the form.",
    fr: "Temps moyen pour remplir le formulaire.",
  },
  landing_feature_2_t: { en: "Bilingual", fr: "Bilingue" },
  landing_feature_2_d: {
    en: "Available in English and French.",
    fr: "Disponible en anglais et en français.",
  },
  landing_feature_3_t: { en: "Secure", fr: "Sécurisé" },
  landing_feature_3_d: {
    en: "Your data is handled per our privacy notice.",
    fr: "Vos données sont traitées selon notre avis de confidentialité.",
  },

  form_title: { en: "Registration form", fr: "Formulaire d'inscription" },
  form_sub: {
    en: "Please provide accurate details. You will review before submitting.",
    fr: "Veuillez fournir des informations exactes. Vous pourrez vérifier avant l'envoi.",
  },
  f_fullname: { en: "Full name", fr: "Nom complet" },
  f_email: { en: "Email address", fr: "Adresse e-mail" },
  f_gender: { en: "Gender", fr: "Genre" },
  f_country: { en: "Country", fr: "Pays" },
  f_phone: { en: "Phone number", fr: "Numéro de téléphone" },
  f_whatsapp: { en: "WhatsApp number", fr: "Numéro WhatsApp" },
  f_same_wa: {
    en: "My WhatsApp number is the same as my phone number",
    fr: "Mon numéro WhatsApp est identique à mon numéro de téléphone",
  },
  f_program: { en: "Program", fr: "Programme" },
  f_program_ph: {
    en: "Search and select your program",
    fr: "Rechercher et sélectionner votre programme",
  },
  f_other_program: { en: "Enter your BSc program", fr: "Entrez votre programme de licence" },
  f_index: { en: "Index number / Reference number", fr: "Numéro d'index / Numéro de référence" },
  f_level: { en: "Current level", fr: "Niveau actuel" },
  f_grad_year: { en: "Expected graduation year", fr: "Année de fin d'études prévue" },
  f_consent: {
    en: "I confirm that the information provided is accurate and consent to its processing per the privacy notice.",
    fr: "Je confirme que les informations fournies sont exactes et j'accepte leur traitement conformément à l'avis de confidentialité.",
  },
  f_country_code: { en: "Country code", fr: "Indicatif" },
  f_male: { en: "Male", fr: "Homme" },
  f_female: { en: "Female", fr: "Femme" },
  f_other: { en: "Other", fr: "Autre" },
  f_prefer_not: { en: "Prefer not to say", fr: "Préfère ne pas répondre" },

  btn_review: { en: "Review Information", fr: "Vérifier les informations" },
  btn_edit: { en: "Edit Information", fr: "Modifier les informations" },
  btn_submit: { en: "Submit Registration", fr: "Soumettre l'inscription" },
  btn_back: { en: "Back", fr: "Retour" },
  btn_home: { en: "Go home", fr: "Accueil" },
  btn_download: { en: "Download summary", fr: "Télécharger le résumé" },

  review_title: { en: "Review your information", fr: "Vérifiez vos informations" },
  review_sub: {
    en: "Confirm every field before submitting your registration.",
    fr: "Vérifiez chaque champ avant de soumettre votre inscription.",
  },

  success_title: { en: "Registration successful", fr: "Inscription réussie" },
  success_sub: {
    en: "Your details have been recorded. Keep this summary for your records.",
    fr: "Vos informations ont été enregistrées. Conservez ce récapitulatif.",
  },
  s_reg_date: { en: "Registration date", fr: "Date d'inscription" },

  already_title: { en: "Already registered?", fr: "Déjà inscrit ?" },
  already_sub: {
    en: "Enter your index or reference number and email to view or update your registration.",
    fr: "Entrez votre numéro d'index ou de référence et votre e-mail pour consulter ou mettre à jour votre inscription.",
  },
  already_lookup: { en: "Look up my registration", fr: "Consulter mon inscription" },
  already_none: {
    en: "No registration matched those details.",
    fr: "Aucune inscription ne correspond à ces informations.",
  },

  privacy_title: { en: "Privacy notice", fr: "Avis de confidentialité" },
  required: { en: "This field is required.", fr: "Ce champ est obligatoire." },
  invalid_email: { en: "Enter a valid email address.", fr: "Entrez une adresse e-mail valide." },

  admin_login: { en: "Admin login", fr: "Connexion admin" },
  admin_email: { en: "Email", fr: "E-mail" },
  admin_password: { en: "Password", fr: "Mot de passe" },
  admin_sign_in: { en: "Sign in", fr: "Se connecter" },
  admin_google: { en: "Continue with Google", fr: "Continuer avec Google" },

  d_total: { en: "Total registrations", fr: "Inscriptions totales" },
  d_today: { en: "Registrations today", fr: "Inscriptions aujourd'hui" },
  d_month: { en: "Registrations this month", fr: "Inscriptions ce mois" },
  d_active: { en: "Active students", fr: "Étudiants actifs" },
  d_grad: { en: "Graduated students", fr: "Étudiants diplômés" },
  d_countries: { en: "Countries represented", fr: "Pays représentés" },
  d_programs: { en: "Programs represented", fr: "Programmes représentés" },
  d_dupes: { en: "Possible duplicates", fr: "Doublons possibles" },
} satisfies Dict;

export type DictKey = keyof typeof dict;

const I18nCtx = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: DictKey) => string;
}>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? (localStorage.getItem("isrp_lang") as Lang | null) : null;
    if (saved === "en" || saved === "fr") setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("isrp_lang", l);
  };
  const t = (k: DictKey) => dict[k][lang];
  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);
