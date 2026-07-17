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
    "Level 100": 2029,
    "Level 200": 2028,
    "Level 300": 2027,
    "Level 400": 2026,
  };
  return map[level];
}

export type Registration = {
  id: string;
  fullName: string;
  email: string;
  gender: string;
  country: string;
  phoneCode: string;
  phone: string;
  whatsappCode: string;
  whatsapp: string;
  sameWhatsapp: boolean;
  program: string;
  otherProgram?: string;
  index: string;
  level: Level;
  graduationYear: number;
  graduated: boolean;
  registrationDate: string;
  duplicateOf?: string;
};

const FIRST = [
  "Ama",
  "Kwame",
  "Adaeze",
  "Chinedu",
  "Fatima",
  "Yaw",
  "Nana",
  "Kojo",
  "Amara",
  "Zainab",
  "Ibrahim",
  "Serwaa",
  "Kofi",
  "Efua",
  "Abena",
  "Kwesi",
  "Akosua",
  "Aisha",
  "Sena",
  "Nia",
];
const LAST = [
  "Mensah",
  "Owusu",
  "Boateng",
  "Adjei",
  "Okafor",
  "Diallo",
  "Traoré",
  "Nkrumah",
  "Asante",
  "Osei",
  "Yeboah",
  "Sesay",
  "Kamara",
  "Bello",
  "Nwosu",
  "Amadi",
  "Adeyemi",
  "Bakayoko",
  "Kone",
  "Sarr",
];

function seededRand(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export const MOCK_REGISTRATIONS: Registration[] = (() => {
  const rand = seededRand(42);
  const list: Registration[] = [];
  for (let i = 0; i < 87; i++) {
    const fn = FIRST[Math.floor(rand() * FIRST.length)];
    const ln = LAST[Math.floor(rand() * LAST.length)];
    const country = COUNTRIES[Math.floor(rand() * COUNTRIES.length)];
    const program = PROGRAMS[Math.floor(rand() * (PROGRAMS.length - 1))];
    const level = LEVELS[Math.floor(rand() * LEVELS.length)];
    const graduated = level === "Level 400" && rand() > 0.6;
    const daysAgo = Math.floor(rand() * 120);
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const phone = `${Math.floor(rand() * 9_000_000_00) + 1_000_000_00}`;
    list.push({
      id: `reg_${i.toString().padStart(4, "0")}`,
      fullName: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.com`,
      gender: rand() > 0.5 ? "Female" : "Male",
      country: country.name,
      phoneCode: country.code,
      phone,
      whatsappCode: country.code,
      whatsapp: phone,
      sameWhatsapp: true,
      program,
      index: `${9000000 + i}`,
      level,
      graduationYear: graduationYearFor(level) as number,
      graduated,
      registrationDate: d.toISOString(),
      duplicateOf: i === 5 ? "reg_0002" : i === 12 ? "reg_0003" : undefined,
    });
  }
  return list;
})();

export const MOCK_ADMINS = [
  {
    id: "a1",
    name: "Grace Boateng",
    email: "grace@example.edu",
    role: "Super Admin",
    lastActive: "2 hours ago",
  },
  {
    id: "a2",
    name: "Daniel Owusu",
    email: "daniel@example.edu",
    role: "Super Admin",
    lastActive: "Yesterday",
  },
  {
    id: "a3",
    name: "Marie Diallo",
    email: "marie@example.edu",
    role: "Super Admin",
    lastActive: "3 days ago",
  },
];

export const MOCK_AUDIT = [
  {
    id: "l1",
    when: "Today, 10:24",
    actor: "Grace Boateng",
    action: "Edited student profile",
    target: "reg_0004",
  },
  {
    id: "l2",
    when: "Today, 09:12",
    actor: "Daniel Owusu",
    action: "Marked student as graduated",
    target: "reg_0018",
  },
  {
    id: "l3",
    when: "Yesterday, 16:44",
    actor: "Grace Boateng",
    action: "Exported data (CSV)",
    target: "—",
  },
  {
    id: "l4",
    when: "Yesterday, 14:01",
    actor: "Marie Diallo",
    action: "Resolved duplicate",
    target: "reg_0005",
  },
  {
    id: "l5",
    when: "2 days ago",
    actor: "Grace Boateng",
    action: "Invited new admin",
    target: "sam@example.edu",
  },
  {
    id: "l6",
    when: "3 days ago",
    actor: "Daniel Owusu",
    action: "Updated program list",
    target: "Cyber Security",
  },
];
