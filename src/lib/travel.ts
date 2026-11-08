import { apiRequest } from "@/lib/api";
import type { DemoTravel } from "@/lib/demo-travels";
import { DEMO_TRAVELS, getDemoTravel } from "@/lib/demo-travels";

export type BookingWithTravel = {
  id: string;
  travelId: string;
  status: "confirmed";
  startsOn: string;
  endsOn: string;
  nickname: string;
  createdAt: string;
  travel: DemoTravel | null;
};

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

/** Which itinerary day index (0-based) today falls on, clamped. */
export function travelDayIndex(booking: BookingWithTravel): number {
  const start = Date.parse(booking.startsOn);
  const today = Date.parse(new Date().toISOString().slice(0, 10));
  if (!Number.isFinite(start) || !Number.isFinite(today)) return 0;
  const day = Math.floor((today - start) / 86_400_000);
  const total = booking.travel?.days ?? 1;
  return Math.max(0, Math.min(total - 1, day));
}
