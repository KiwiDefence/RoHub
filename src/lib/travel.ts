import { apiRequest } from "@/lib/api";
import type { DemoTravel } from "@/lib/demo-travels";
import { DEMO_TRAVELS, getDemoTravel } from "@/lib/demo-travels";

export type BookingTraveler = {
  name: string;
  phone: string;
  /** ISO date YYYY-MM-DD — used to confirm age for age-restricted trips. */
  birthDate: string;
};

export type BookingWithTravel = {
  id: string;
  travelId: string;
  status: "confirmed";
  startsOn: string;
  endsOn: string;
  nickname: string;
  guests?: number;
  travelers?: BookingTraveler[];
  agesConfirmed?: boolean;
  paymentStatus?: "paid" | string;
  paidAt?: string | null;
  amountRon?: number | null;
  createdAt: string;
  travel: DemoTravel | null;
};

export function ageOnDate(birthDate: string, onIso: string): number {
  const birth = new Date(`${birthDate}T12:00:00`);
  const on = new Date(`${onIso}T12:00:00`);
  if (!Number.isFinite(birth.getTime()) || !Number.isFinite(on.getTime())) {
    return -1;
  }
  let age = on.getFullYear() - birth.getFullYear();
  const m = on.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && on.getDate() < birth.getDate())) age -= 1;
  return age;
}

export function listLocalTravels(): DemoTravel[] {
  return DEMO_TRAVELS;
}

export async function fetchTravels(): Promise<DemoTravel[]> {
  try {
    const res = await apiRequest<{ travels: DemoTravel[] }>("/api/travels", {
      auth: false,
    });
    return res.travels;
  } catch {
    return DEMO_TRAVELS;
  }
}

export async function fetchTravel(id: string): Promise<DemoTravel | null> {
  try {
    return await apiRequest<DemoTravel>(`/api/travels/${id}`, { auth: false });
  } catch {
    return getDemoTravel(id) ?? null;
  }
}

export async function createBooking(input: {
  travelId: string;
  nickname?: string;
  guests?: number;
  startsOn?: string;
  travelers: BookingTraveler[];
  agesConfirmed: boolean;
}): Promise<BookingWithTravel> {
  return apiRequest<BookingWithTravel>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchMyBookings(): Promise<{
  bookings: BookingWithTravel[];
  activeBooking: BookingWithTravel | null;
}> {
  return apiRequest("/api/bookings/mine");
}

export async function cancelActiveBooking(): Promise<void> {
  await apiRequest("/api/bookings/mine/active", { method: "DELETE" });
}

export async function updateActiveBooking(input: {
  startsOn: string;
  nickname?: string;
  guests?: number;
  travelers?: BookingTraveler[];
  agesConfirmed?: boolean;
}): Promise<BookingWithTravel> {
  return apiRequest<BookingWithTravel>("/api/bookings/mine/active", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

/** Which itinerary day index (0-based) today falls on, clamped. */
export function travelDayIndex(booking: BookingWithTravel): number {
  const start = Date.parse(booking.startsOn);
  const today = Date.parse(new Date().toISOString().slice(0, 10));
  if (!Number.isFinite(start) || !Number.isFinite(today)) return 0;
  const day = Math.floor((today - start) / 86_400_000);
  const total = booking.travel?.days ?? 1;
  return Math.max(0, Math.min(total - 1, day));
}

export type TripPhase = "before" | "during" | "after";

export function tripPhase(
  booking: BookingWithTravel,
  now = new Date(),
): TripPhase {
  const today = now.toISOString().slice(0, 10);
  if (today < booking.startsOn) return "before";
  if (today > booking.endsOn) return "after";
  return "during";
}

/** Minutes from midnight for "HH:MM". */
export function parseSlotMinutes(time: string): number {
  const [h, m] = time.split(":").map((n) => Number(n));
  if (!Number.isFinite(h) || !Number.isFinite(m)) return 0;
  return h * 60 + m;
}

export type SlotState = "done" | "now" | "next" | "later";
export type DayRelation = "past" | "today" | "future";

export function dayRelation(
  booking: BookingWithTravel,
  dayIndex: number,
  now = new Date(),
): DayRelation {
  const phase = tripPhase(booking, now);
  if (phase === "before") return dayIndex === 0 ? "future" : "future";
  if (phase === "after") return "past";
  const current = travelDayIndex(booking);
  if (dayIndex < current) return "past";
  if (dayIndex > current) return "future";
  return "today";
}

export function slotState(
  slots: { time: string }[],
  index: number,
  relation: DayRelation,
  now = new Date(),
): SlotState {
  if (relation === "past") return "done";
  if (relation === "future") return "later";

  const mins = now.getHours() * 60 + now.getMinutes();
  const times = slots.map((s) => parseSlotMinutes(s.time));
  let active = -1;
  for (let i = 0; i < times.length; i++) {
    if (mins >= times[i]) active = i;
  }
  if (active === -1) {
    return index === 0 ? "next" : "later";
  }
  if (index < active) return "done";
  if (index === active) return "now";
  if (index === active + 1) return "next";
  return "later";
}
