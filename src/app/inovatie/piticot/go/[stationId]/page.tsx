import { OpenBridge } from "@/components/piticot/OpenBridge";
import { allStationIds, getStation } from "@/lib/piticot";
import { buildPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ stationId: string }>;
};

export function generateStaticParams() {
  return allStationIds().map((stationId) => ({ stationId }));
}

export async function generateMetadata({ params }: PageProps) {
  const { stationId } = await params;
  const station = getStation(stationId);
  return buildPageMetadata({
    title: station
      ? `Deschide · ${station.title}`
      : "Deschide · Circuitul Piticotului",
    description:
      "Verifică dacă aplicația RoHub Travel e instalată, apoi deschide oprirea Piticot.",
    path: `/inovatie/piticot/go/${stationId}/`,
  });
}

/** QR landing: app first, website second. */
export default async function PiticotGoPage({ params }: PageProps) {
  const { stationId } = await params;
  return (
    <main id="main-content" className="relative h-full w-full">
      <OpenBridge stationId={stationId} />
    </main>
  );
}
