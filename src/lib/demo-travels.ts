import raw from "./demo-travels.json";

export type DemoTravelSlot = {
  time: string;
  title: string;
  detail?: string;
  place?: string;
};

export type DemoTravelDay = {
  title: string;
  slots: DemoTravelSlot[];
};

export type DemoTravelLocation = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

export type DemoTravel = {
  id: string;
  regionSlug: string;
  title: string;
  summary: string;
  days: number;
  startsOn: string;
  endsOn: string;
  includesPiticot: boolean;
  piticotTripCode: string;
  meetingPoint: string;
  hostContact: string;
  priceRon?: number;
  currency?: string;
  location?: DemoTravelLocation;
  itinerary: DemoTravelDay[];
  tips: string[];
};

type LegacyDay = {
  title: string;
  slots?: DemoTravelSlot[];
  items?: string[];
};

/** Accepts current `slots` days or older `items` payloads from a running API. */
export function normalizeTravelDay(day: LegacyDay): DemoTravelDay {
  if (day.slots?.length) {
    return { title: day.title, slots: day.slots };
  }
  const items = day.items ?? [];
  return {
    title: day.title,
    slots: items.map((title, i) => ({
      time: `${String(Math.min(9 + i, 22)).padStart(2, "0")}:00`,
      title,
    })),
  };
}

export type NormalizedDemoTravel = DemoTravel & {
  location: DemoTravelLocation;
  itinerary: DemoTravelDay[];
};

export function normalizeTravel(travel: DemoTravel): NormalizedDemoTravel {
  const location: DemoTravelLocation = travel.location ?? {
    name: travel.meetingPoint.split("—")[0]?.trim() || travel.meetingPoint,
    address: travel.meetingPoint,
    lat: 45.6579,
    lng: 25.6012,
  };

  return {
    ...travel,
    location,
    itinerary: (travel.itinerary as LegacyDay[]).map(normalizeTravelDay),
  };
}

/** Seeded travel packages — same IDs on server and static pages. */
export const DEMO_TRAVELS = (raw as DemoTravel[]).map(normalizeTravel);

export function getDemoTravel(id: string): DemoTravel | undefined {
  return DEMO_TRAVELS.find((t) => t.id === id);
}

export function getDemoTravelByRegion(slug: string): DemoTravel | undefined {
  return (
    DEMO_TRAVELS.find((t) => t.regionSlug === slug && t.includesPiticot) ??
    DEMO_TRAVELS.find((t) => t.regionSlug === slug)
  );
}

export function googleMapsUrl(location: DemoTravelLocation): string {
  return `https://www.google.com/maps/search/?api=1&query=${location.lat}%2C${location.lng}`;
}

export function googleMapsDirUrl(location: DemoTravelLocation): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${location.lat}%2C${location.lng}&travelmode=driving`;
}

export function wazeUrl(location: DemoTravelLocation): string {
  return `https://waze.com/ul?ll=${location.lat}%2C${location.lng}&navigate=yes&q=${encodeURIComponent(location.name)}`;
}
