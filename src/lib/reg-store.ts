import { MOCK_REGISTRATIONS, type Registration } from "./mock-data";
import { supabase } from "./supabase";

// Draft used across the multi-step registration flow (client-only prototype).
export type Draft = Partial<Registration> & { otherProgram?: string };

const DRAFT_KEY = "isrp_draft";

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

export async function lookupRegistration(index: string, email: string): Promise<Registration | null> {
  const { data, error } = await supabase.rpc("check_registration", {
    search_index: index,
    search_email: email,
  });
  
  if (error) {
    console.error("Error looking up registration:", error);
    return null;
  }
  
  return data ? ({ index, email } as Registration) : null;
}

export async function checkAdminSession(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

export async function logoutAdmin() {
  await supabase.auth.signOut();
}
