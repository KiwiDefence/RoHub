const API_KEY = "rohub-piticot-api";
const TOKEN_KEY = "rohub-auth-token";
const TIMEOUT_MS = 8000;

function isNativeShell(): boolean {
  if (typeof window === "undefined") return false;
  try {
    // Capacitor injects this on the WebView; hostname is often localhost there.
    const cap = (
      window as Window & {
        Capacitor?: { isNativePlatform?: () => boolean };
      }
    ).Capacitor;
    if (cap?.isNativePlatform?.()) return true;
  } catch {
    /* ignore */
  }
  return (
    window.location.protocol === "capacitor:" ||
    document.documentElement.classList.contains("native-app")
  );
}

/** Env → saved override → sensible local default (never phone loopback in the app). */
function defaultApiBase(): string {
  const fromEnv = (process.env.NEXT_PUBLIC_PITICOT_API ?? "").trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  if (typeof window === "undefined") return "";

  // Inside the APK, localhost is the phone — only the baked env URL works.
  if (isNativeShell()) return "";

  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://127.0.0.1:4000";
  }
  if (/^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(host)) {
    return `http://${host}:4000`;
  }
  return "";
}

export function getApiBase(): string {
  if (typeof window === "undefined") return defaultApiBase();
  const saved = (window.localStorage.getItem(API_KEY) ?? "").trim();
  // Ignore stale loopback saved on a phone from older builds.
  if (saved && isNativeShell() && /^(https?:\/\/)?(127\.0\.0\.1|localhost)(:|\/|$)/i.test(saved)) {
    return defaultApiBase();
  }
  const base = saved || defaultApiBase();
  return base.replace(/\/+$/, "");
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
  if (!base) {
    throw new ApiError(
      0,
      "Serverul RoHub nu e disponibil. Pornește API-ul local sau reinstalează aplicația cu adresa corectă.",
    );
  }

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
