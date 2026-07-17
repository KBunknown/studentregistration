import { MOCK_REGISTRATIONS, type Registration } from "./mock-data";
import { supabase } from "./supabase";

// Draft used across the multi-step registration flow (client-only prototype).
export type Draft = Partial<Registration> & { otherProgram?: string };
export type AdminUser = { id: string; email: string; created_at: string; };

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

export async function getAdminUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabase.from("admin_users").select("*").order("created_at", { ascending: true });
  if (error) throw error;
  return data as AdminUser[];
}

export async function addAdminUser(email: string) {
  const { error } = await supabase.from("admin_users").insert({ email: email.toLowerCase() });
  if (error) throw error;
}

export async function removeAdminUser(id: string) {
  const { error } = await supabase.from("admin_users").delete().eq("id", id);
  if (error) throw error;
}

export async function checkAdminSession(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return false;
  
  // Verify authorization via RBAC table
  const email = session.user.email?.toLowerCase();
  if (!email) return false;
  
  const { data, error } = await supabase
    .from("admin_users")
    .select("id")
    .eq("email", email)
    .maybeSingle();
    
  if (error || !data) {
    // Unauthorized! Nuke the session.
    await supabase.auth.signOut();
    return false;
  }
  
  return true;
}

export async function logoutAdmin() {
  await supabase.auth.signOut();
}
