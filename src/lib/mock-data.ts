export const PROGRAMS = [
  "Geological Engineering",
  "Geomatic Engineering",
  "Mathematics",
  "Mathematics and Finance",
  "Mechanical Engineering",
  "Mining Engineering",
  "Minerals Engineering",
  "Petroleum Engineering",
  "Renewable Energy Engineering",
  "Computer Science and Engineering",
  "Electrical and Electronic Engineering",
  "Environmental and Safety Engineering",
  "Natural Gas Engineering",
  "Petroleum Refining and Petrochemical Engineering",
  "Petroleum Geosciences and Engineering",
  "Chemical Engineering",
  "Statistical Data Science",
  "Land Administration and Information System",
  "Economics and Industrial Organisation",
  "Logistics and Transport Management",
  "Cyber Security",
  "Information Systems and Technology",
  "Civil Engineering",
  "Robotic Engineering and Artificial Intelligence",
  "Solar Photovoltaic and Solar Thermal Systems",
  "Data Science and Analytics",
  "Spatial Planning",
  "Other Program",
];

export const LEVELS = ["Level 100", "Level 200", "Level 300", "Level 400"] as const;
export type Level = (typeof LEVELS)[number];

export const COUNTRIES = [
  // ALL African Countries
  { name: "Algeria", code: "+213" },
  { name: "Angola", code: "+244" },
  { name: "Benin", code: "+229" },
  { name: "Botswana", code: "+267" },
  { name: "Burkina Faso", code: "+226" },
  { name: "Burundi", code: "+257" },
  { name: "Cabo Verde", code: "+238" },
  { name: "Cameroon", code: "+237" },
  { name: "Central African Republic", code: "+236" },
  { name: "Chad", code: "+235" },
  { name: "Comoros", code: "+269" },
  { name: "Congo (DRC)", code: "+243" },
  { name: "Congo (Republic)", code: "+242" },
  { name: "Côte d'Ivoire", code: "+225" },
  { name: "Djibouti", code: "+253" },
  { name: "Egypt", code: "+20" },
  { name: "Equatorial Guinea", code: "+240" },
  { name: "Eritrea", code: "+291" },
  { name: "Eswatini", code: "+268" },
  { name: "Ethiopia", code: "+251" },
  { name: "Gabon", code: "+241" },
  { name: "Gambia", code: "+220" },
  { name: "Ghana", code: "+233" },
  { name: "Guinea", code: "+224" },
  { name: "Guinea-Bissau", code: "+245" },
  { name: "Kenya", code: "+254" },
  { name: "Lesotho", code: "+266" },
  { name: "Liberia", code: "+231" },
  { name: "Libya", code: "+218" },
  { name: "Madagascar", code: "+261" },
  { name: "Malawi", code: "+265" },
  { name: "Mali", code: "+223" },
  { name: "Mauritania", code: "+222" },
  { name: "Mauritius", code: "+230" },
  { name: "Morocco", code: "+212" },
  { name: "Mozambique", code: "+258" },
  { name: "Namibia", code: "+264" },
  { name: "Niger", code: "+227" },
  { name: "Nigeria", code: "+234" },
  { name: "Rwanda", code: "+250" },
  { name: "Sao Tome and Principe", code: "+239" },
  { name: "Senegal", code: "+221" },
  { name: "Seychelles", code: "+248" },
  { name: "Sierra Leone", code: "+232" },
  { name: "Somalia", code: "+252" },
  { name: "South Africa", code: "+27" },
  { name: "South Sudan", code: "+211" },
  { name: "Sudan", code: "+249" },
  { name: "Tanzania", code: "+255" },
  { name: "Togo", code: "+228" },
  { name: "Tunisia", code: "+216" },
  { name: "Uganda", code: "+256" },
  { name: "Zambia", code: "+260" },
  { name: "Zimbabwe", code: "+263" },
  
  // Diverse Global Countries
  { name: "United States", code: "+1" },
  { name: "Canada", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "Australia", code: "+61" },
  { name: "New Zealand", code: "+64" },
  { name: "France", code: "+33" },
  { name: "Germany", code: "+49" },
  { name: "Italy", code: "+39" },
  { name: "Spain", code: "+34" },
  { name: "China", code: "+86" },
  { name: "Japan", code: "+81" },
  { name: "South Korea", code: "+82" },
  { name: "India", code: "+91" },
  { name: "Pakistan", code: "+92" },
  { name: "Bangladesh", code: "+880" },
  { name: "Indonesia", code: "+62" },
  { name: "Brazil", code: "+55" },
  { name: "Argentina", code: "+54" },
  { name: "Mexico", code: "+52" },
  { name: "Colombia", code: "+57" },
  { name: "Saudi Arabia", code: "+966" },
  { name: "United Arab Emirates", code: "+971" },
  { name: "Turkey", code: "+90" },
].sort((a, b) => a.name.localeCompare(b.name));

export const COUNTRY_DIGITS: Record<string, number> = {
  // Common overrides where digits aren't typically 10
  "+233": 9,  // Ghana
  "+27": 9,   // South Africa
  "+254": 9,  // Kenya
  "+33": 9,   // France
  "+86": 11,  // China
  "+55": 11,  // Brazil
  "+237": 9,  // Cameroon
  "+221": 9,  // Senegal
  "+212": 9,  // Morocco
  "+255": 9,  // Tanzania
  "+256": 9,  // Uganda
  "+250": 9,  // Rwanda
  "+223": 8,  // Mali
  "+225": 10, // Côte d'Ivoire
};

export function maxDigitsForCode(code: string): number {
  return COUNTRY_DIGITS[code] ?? 10;
}

export const CURRENT_YEAR = 2026;

export function graduationYearFor(level: Level | ""): number | "" {
  if (!level) return "";
  const map: Record<Level, number> = {
    "Level 100": CURRENT_YEAR + 3,
    "Level 200": CURRENT_YEAR + 2,
    "Level 300": CURRENT_YEAR + 1,
    "Level 400": CURRENT_YEAR,
  };
  return map[level];
}

export function calcGraduationYear(stage: AcademicStage | undefined): number | "" {
  if (!stage) return "";
  const map: Record<AcademicStage, number> = {
    "level_100": CURRENT_YEAR + 3,
    "level_200": CURRENT_YEAR + 2,
    "level_300": CURRENT_YEAR + 1,
    "level_400": CURRENT_YEAR,
    "masters_year_1": CURRENT_YEAR + 1,
    "masters_year_2": CURRENT_YEAR,
    "english_certificate_year_1": CURRENT_YEAR,
  };
  return map[stage] || "";
}

export type StudyType = "bsc" | "masters" | "english_certificate";
export type AcademicStage =
  | "level_100"
  | "level_200"
  | "level_300"
  | "level_400"
  | "masters_year_1"
  | "masters_year_2"
  | "english_certificate_year_1";

export type EnglishPathway = "leave_after_certificate" | "continue_to_bsc" | "continue_to_masters";

export type Registration = {
  id?: string;
  fullName: string;
  email: string;
  gender: string;
  country: string;
  phoneCode: string;
  phone: string;
  whatsappCode: string;
  whatsapp: string;
  sameWhatsapp: boolean;
  
  // New Academic Structure
  study_type?: StudyType;
  academic_stage?: AcademicStage;
  room_number?: string;
  english_certificate_pathway?: EnglishPathway | null;
  programme_status?: string;
  requires_academic_review?: boolean;

  // Legacy fields (kept for compatibility with old records, though 'level' and 'program' are still used)
  program: string;
  otherProgram?: string;
  index: string;
  level: Level | string; // Relaxed to string for backwards compatibility / dynamic usage
  graduationYear: number;
  graduated: boolean;
  registrationDate: string;
  duplicateOf?: string;
};
