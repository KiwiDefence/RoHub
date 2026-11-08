import { PITICOT_DEMO_CODE, allStationIds } from "@/lib/piticot";

export type PiticotProgress = {
  tripCode: string;
  nickname: string;
  unlocked: string[];
  unlockedAt: Record<string, string>;
};

const storageKey = (tripCode: string) =>
  `rohub-piticot:${tripCode.trim().toUpperCase()}`;

export function loadProgress(tripCode: string): PiticotProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey(tripCode));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PiticotProgress;
    if (!parsed?.nickname || !Array.isArray(parsed.unlocked)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveProgress(progress: PiticotProgress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    storageKey(progress.tripCode),
    JSON.stringify(progress),
  );
}

export function startTrip(tripCode: string, nickname: string): PiticotProgress {
  const progress: PiticotProgress = {
    tripCode: tripCode.trim().toUpperCase() || PITICOT_DEMO_CODE,
    nickname: nickname.trim() || "Explorator",
    unlocked: [],
    unlockedAt: {},
  };
  saveProgress(progress);
  return progress;
}

export function unlockStation(
  progress: PiticotProgress,
  stationId: string,
): PiticotProgress {
  if (progress.unlocked.includes(stationId)) return progress;
  if (!allStationIds().includes(stationId)) return progress;
  const next: PiticotProgress = {
    ...progress,
    unlocked: [...progress.unlocked, stationId],
    unlockedAt: {
      ...progress.unlockedAt,
      [stationId]: new Date().toISOString(),
    },
  };
  saveProgress(next);
  return next;
}

export function resetTrip(tripCode: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKey(tripCode));
}

export function progressPercent(unlockedCount: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((unlockedCount / total) * 100);
}
