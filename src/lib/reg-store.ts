import { MOCK_REGISTRATIONS, type Registration } from "./mock-data";
import { supabase } from "./supabase";

// Draft used across the multi-step registration flow (client-only prototype).
export type Draft = Partial<Registration> & { otherProgram?: string };

const DRAFT_KEY = "isrp_draft";
const AUTH_KEY = "isrp_admin_auth";

export function getDraft(): Draft {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
  } catch {
    return {};
  }
}
export function saveDraft(d: Draft) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
}
export function clearDraft() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DRAFT_KEY);
}

export async function getAllRegistrations(): Promise<Registration[]> {
  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .order("registrationDate", { ascending: false });
    
  if (error) {
    console.error("Error fetching registrations:", error);
    return MOCK_REGISTRATIONS; // fallback for preview/demo mode if DB not set up
  }
  return data as Registration[];
}

export async function addRegistration(r: Registration) {
  const { error } = await supabase.from("registrations").insert(r);
  if (error) throw error;
}

export async function updateRegistration(id: string, updates: Partial<Registration>) {
  const { error } = await supabase.from("registrations").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteRegistration(id: string) {
  const { error } = await supabase.from("registrations").delete().eq("id", id);
  if (error) throw error;
}

export function isAdmin(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEY) === "1";
}
export function setAdmin(v: boolean) {
  if (typeof window === "undefined") return;
  if (v) localStorage.setItem(AUTH_KEY, "1");
  else localStorage.removeItem(AUTH_KEY);
}
