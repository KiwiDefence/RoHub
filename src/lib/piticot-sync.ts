import { apiRequest, getApiBase, setApiBase } from "@/lib/api";
import type { PiticotProgress } from "@/lib/piticot-storage";

/**
 * Best-effort sync with the Piticot backend. The phone (localStorage) stays
 * the source of truth, so the game keeps working with no network.
 */

const DEVICE_KEY = "rohub-piticot-device";
const playerKey = (tripCode: string) => `rohub-piticot-player:${tripCode}`;

export type SyncStatus = "off" | "ok" | "error";

export { getApiBase, setApiBase };

function deviceId(): string {
  let id = window.localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

export async function pingServer(): Promise<boolean> {
  try {
    const res = await apiRequest<{ ok: boolean }>("/health", { auth: false });
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
    const player = await apiRequest<{ id: string }>("/api/players", {
      method: "POST",
      body,
    });
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
    await apiRequest(`/api/players/${id}`, { method: "DELETE" });
  } catch {
    /* offline: the organiser can clear it from the dashboard */
  }
}
