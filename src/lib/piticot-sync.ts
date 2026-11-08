import type { PiticotProgress } from "@/lib/piticot-storage";

/**
 * Best-effort sync with the Piticot backend. The phone (localStorage) stays
 * the source of truth, so the game keeps working with no network.
 */

const API_KEY = "rohub-piticot-api";
const DEVICE_KEY = "rohub-piticot-device";
const playerKey = (tripCode: string) => `rohub-piticot-player:${tripCode}`;
const TIMEOUT_MS = 4000;

export type SyncStatus = "off" | "ok" | "error";

export function getApiBase(): string {
  if (typeof window === "undefined") return "";
  const saved = window.localStorage.getItem(API_KEY);
  const base = saved ?? process.env.NEXT_PUBLIC_PITICOT_API ?? "";
  return base.trim().replace(/\/+$/, "");
}

export function setApiBase(url: string): void {
  const clean = url.trim().replace(/\/+$/, "");
  const withScheme = clean && !/^https?:\/\//i.test(clean) ? `http://${clean}` : clean;
  window.localStorage.setItem(API_KEY, withScheme);
}

function deviceId(): string {
  let id = window.localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getApiBase();
  if (!base) throw new Error("no-api");
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${base}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    window.clearTimeout(timer);
  }
}

export async function pingServer(): Promise<boolean> {
  try {
    const res = await request<{ ok: boolean }>("/health");
    return res.ok === true;
  } catch {
    return false;
  }
}

/** Registers (or re-registers) this device and pushes all local unlocks. */
export async function syncProgress(progress: PiticotProgress): Promise<SyncStatus> {
  if (!getApiBase()) return "off";
  const body = JSON.stringify({
    tripCode: progress.tripCode,
    nickname: progress.nickname,
    deviceId: deviceId(),
    unlocked: progress.unlocked,
    unlockedAt: progress.unlockedAt,
  });
  try {
    const player = await request<{ id: string }>("/api/players", { method: "POST", body });
    window.localStorage.setItem(playerKey(progress.tripCode), player.id);
    return "ok";
  } catch {
    return "error";
  }
}

export async function forgetPlayer(tripCode: string): Promise<void> {
  const id = window.localStorage.getItem(playerKey(tripCode));
  window.localStorage.removeItem(playerKey(tripCode));
  if (!id || !getApiBase()) return;
  try {
    await request(`/api/players/${id}`, { method: "DELETE" });
  } catch {
    /* offline: the organiser can clear it from the dashboard */
  }
}
