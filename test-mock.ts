import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(url, key);

const MOCK_DATA = [
  {
    fullName: "Mock BSc Student",
    email: "mock1@example.com",
    gender: "Female",
    country: "Ghana",
    phoneCode: "+233",
    phone: "555123456",
    whatsappCode: "+233",
    whatsapp: "555123456",
    sameWhatsapp: true,
    study_type: "bsc",
    academic_stage: "level_200",
    program: "Computer Science and Engineering",
    index: "MOCK-BSC-01",
    level: "level_200",
    graduationYear: 2028,
    graduated: false,
    registrationDate: new Date().toISOString(),
    room_number: "KT 000 B",
    programme_status: "active"
  },
  {
    fullName: "Mock Masters Student",
    email: "mock2@example.com",
    gender: "Male",
    country: "Nigeria",
    phoneCode: "+234",
    phone: "8031234567",
    whatsappCode: "+234",
    whatsapp: "8031234567",
    sameWhatsapp: true,
    study_type: "masters",
    academic_stage: "masters_year_1",
    program: "MSc Data Science",
    index: "MOCK-MSC-01",
    level: "masters_year_1",
    graduationYear: 2027,
    graduated: false,
    registrationDate: new Date().toISOString(),
    room_number: "A12",
    programme_status: "active"
  },
  {
    fullName: "Mock English Cert Student",
    email: "mock3@example.com",
    gender: "Other",
    country: "Mali",
    phoneCode: "+223",
    phone: "71234567",
    whatsappCode: "+223",
    whatsapp: "71234567",
    sameWhatsapp: true,
    study_type: "english_certificate",
    academic_stage: "english_certificate_year_1",
    english_certificate_pathway: "continue_to_bsc",
    program: "BSc Applied Physics",
    index: "MOCK-ENG-01",
    level: "english_certificate_year_1",
    graduationYear: 2026,
    graduated: false,
    registrationDate: new Date().toISOString(),
    room_number: "B2",
    programme_status: "active"
  }
];

async function run() {
  const action = process.argv[2];

  if (action === "populate") {
    console.log("Inserting mock data...");
    const { error } = await supabase.from("registrations").insert(MOCK_DATA);
    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Mock data inserted successfully.");
    }
  } else if (action === "clear") {
    console.log("Clearing mock data...");
    const { error } = await supabase
      .from("registrations")
      .delete()
      .like("index", "MOCK-%");
    
    if (error) {
      console.error("Error clearing data:", error);
    } else {
      console.log("Mock data cleared successfully.");
    }
  } else {
    console.log("Usage: npx tsx test-mock.ts [populate|clear]");
  }
}

run();
