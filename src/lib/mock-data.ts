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
  { name: "Ghana", code: "+233" },
  { name: "Nigeria", code: "+234" },
  { name: "South Africa", code: "+27" },
  { name: "Kenya", code: "+254" },
  { name: "United Kingdom", code: "+44" },
  { name: "United States", code: "+1" },
  { name: "Canada", code: "+1" },
  { name: "France", code: "+33" },
  { name: "Germany", code: "+49" },
  { name: "China", code: "+86" },
  { name: "India", code: "+91" },
  { name: "Brazil", code: "+55" },
  { name: "Egypt", code: "+20" },
  { name: "Cameroon", code: "+237" },
  { name: "Côte d'Ivoire", code: "+225" },
  { name: "Senegal", code: "+221" },
  { name: "Morocco", code: "+212" },
  { name: "Tanzania", code: "+255" },
  { name: "Uganda", code: "+256" },
  { name: "Rwanda", code: "+250" },
];

export const COUNTRY_DIGITS: Record<string, number> = {
  "+233": 9,  // Ghana
  "+234": 10, // Nigeria
  "+27": 9,   // South Africa
  "+254": 9,  // Kenya
  "+44": 10,  // United Kingdom
  "+1": 10,   // US / Canada
  "+33": 9,   // France
  "+49": 10,  // Germany
  "+86": 11,  // China
  "+91": 10,  // India
  "+55": 11,  // Brazil
  "+20": 10,  // Egypt
  "+237": 9,  // Cameroon
  "+225": 10, // Côte d'Ivoire
  "+221": 9,  // Senegal
  "+212": 9,  // Morocco
  "+255": 9,  // Tanzania
  "+256": 9,  // Uganda
  "+250": 9,  // Rwanda
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

const FIRST = ["Ama", "Kwame", "Adaeze", "Chinedu", "Fatima", "Yaw", "Nana", "Kojo", "Amara", "Zainab", "Ibrahim", "Serwaa", "Kofi", "Efua", "Abena", "Kwesi", "Akosua", "Aisha", "Sena", "Nia"];
const LAST = ["Mensah", "Owusu", "Boateng", "Adjei", "Okafor", "Diallo", "Traoré", "Nkrumah", "Asante", "Osei", "Yeboah", "Sesay", "Kamara", "Bello", "Nwosu", "Amadi", "Adeyemi", "Bakayoko", "Kone", "Sarr"];

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
  { id: "a1", name: "Grace Boateng", email: "grace@example.edu", role: "Super Admin", lastActive: "2 hours ago" },
  { id: "a2", name: "Daniel Owusu", email: "daniel@example.edu", role: "Super Admin", lastActive: "Yesterday" },
  { id: "a3", name: "Marie Diallo", email: "marie@example.edu", role: "Super Admin", lastActive: "3 days ago" },
];

export const MOCK_AUDIT = [
  { id: "l1", when: "Today, 10:24", actor: "Grace Boateng", action: "Edited student profile", target: "reg_0004" },
  { id: "l2", when: "Today, 09:12", actor: "Daniel Owusu", action: "Marked student as graduated", target: "reg_0018" },
  { id: "l3", when: "Yesterday, 16:44", actor: "Grace Boateng", action: "Exported data (CSV)", target: "—" },
  { id: "l4", when: "Yesterday, 14:01", actor: "Marie Diallo", action: "Resolved duplicate", target: "reg_0005" },
  { id: "l5", when: "2 days ago", actor: "Grace Boateng", action: "Invited new admin", target: "sam@example.edu" },
  { id: "l6", when: "3 days ago", actor: "Daniel Owusu", action: "Updated program list", target: "Cyber Security" },
];