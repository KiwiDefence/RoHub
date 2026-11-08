import raw from "./demo-travels.json";

export type DemoTravelDay = {
  title: string;
  items: string[];
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
  itinerary: DemoTravelDay[];
  tips: string[];
};

/** Seeded demo packages — same IDs on server and static pages. */
export const DEMO_TRAVELS = raw as DemoTravel[];

export function getDemoTravel(id: string): DemoTravel | undefined {
  return DEMO_TRAVELS.find((t) => t.id === id);
}

export function getDemoTravelByRegion(slug: string): DemoTravel | undefined {
  return (
    DEMO_TRAVELS.find((t) => t.regionSlug === slug && t.includesPiticot) ??
    DEMO_TRAVELS.find((t) => t.regionSlug === slug)
  );
}
