import { getOrderedStations, getStation } from "@/lib/piticot";
import type { PiticotProgress } from "@/lib/piticot-storage";

export type ScanGate =
  | { kind: "unlock"; message: null }
  | { kind: "here"; message: "Ești deja aici." }
  | { kind: "visited"; message: "Ai fost aici deja." }
  | { kind: "ahead"; message: "Mai ai până aici." }
  | { kind: "invalid"; message: "Codul ăsta nu e pe tablă." };

/** Furthest unlocked station order, or -1 before the first stop. */
export function furthestOrder(progress: PiticotProgress | null): number {
  if (!progress?.unlocked.length) return -1;
  const stations = getOrderedStations();
  let max = -1;
  for (const id of progress.unlocked) {
    const order = stations.find((s) => s.id === id)?.order ?? -1;
    if (order > max) max = order;
  }
  return max;
}

/**
 * Decide what a scanned station means relative to current progress.
 * Unlock only the next stop (or a missing earlier gap); block skips and repeats.
 */
export function evaluateScan(
  progress: PiticotProgress | null,
  stationId: string,
): ScanGate {
  const station = getStation(stationId);
  if (!station) return { kind: "invalid", message: "Codul ăsta nu e pe tablă." };

  const unlocked = progress?.unlocked ?? [];
  const maxOrder = furthestOrder(progress);
  const nextOrder = maxOrder + 1;

  if (unlocked.includes(station.id)) {
    if (station.order === maxOrder) {
      return { kind: "here", message: "Ești deja aici." };
    }
    return { kind: "visited", message: "Ai fost aici deja." };
  }

  if (station.order <= nextOrder) {
    return { kind: "unlock", message: null };
  }

  return { kind: "ahead", message: "Mai ai până aici." };
}
