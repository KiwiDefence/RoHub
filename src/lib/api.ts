const API_KEY = "rohub-piticot-api";
const TOKEN_KEY = "rohub-auth-token";
const TIMEOUT_MS = 8000;

export function getApiBase(): string {
  if (typeof window === "undefined") return "";
  const saved = window.localStorage.getItem(API_KEY);
  const base = saved ?? process.env.NEXT_PUBLIC_PITICOT_API ?? "";
  return base.trim().replace(/\/+$/, "");
}

export function setApiBase(url: string): void {
  if (typeof window === "undefined") return;
  const clean = url.trim().replace(/\/+$/, "");
  const withScheme = clean && !/^https?:\/\//i.test(clean) ? `http://${clean}` : clean;
  window.localStorage.setItem(API_KEY, withScheme);
}

export function getAuthToken(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(TOKEN_KEY) ?? "";
}

export function setAuthToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
  void syncNativeToken(token);
}

async function syncNativeToken(token: string | null): Promise<void> {
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (!Capacitor.isNativePlatform()) return;
    const { Preferences } = await import("@capacitor/preferences");
    if (token) await Preferences.set({ key: TOKEN_KEY, value: token });
    else await Preferences.remove({ key: TOKEN_KEY });
  } catch {
    /* web or plugin unavailable */
  }
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit & { auth?: boolean },
): Promise<T> {
  const base = getApiBase();
  if (!base) throw new ApiError(0, "Configurează adresa serverului RoHub.");

  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }
  if (init?.auth !== false) {
    const token = getAuthToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${base}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => ({}))) as T & { error?: string };
    if (!res.ok) {
      throw new ApiError(res.status, data.error || `Eroare server (${res.status})`);
    }
    return data;
  } finally {
    window.clearTimeout(timer);
  }
}
