import { MOCK_REGISTRATIONS, type Registration } from "./mock-data";

// Draft used across the multi-step registration flow (client-only prototype).
export type Draft = Partial<Registration> & { otherProgram?: string };

const DRAFT_KEY = "isrp_draft";
const REGS_KEY = "isrp_registrations";
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

export function getAllRegistrations(): Registration[] {
  if (typeof window === "undefined") return MOCK_REGISTRATIONS;
  try {
    const stored = localStorage.getItem(REGS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return MOCK_REGISTRATIONS;
}

export function addRegistration(r: Registration) {
  if (typeof window === "undefined") return;
  const all = getAllRegistrations();
  const next = [r, ...all];
  localStorage.setItem(REGS_KEY, JSON.stringify(next));
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