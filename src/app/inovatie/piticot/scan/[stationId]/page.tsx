import { ScanClient } from "@/components/piticot/ScanClient";
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
      ? `Scan · ${station.title}`
      : "Scan · stație necunoscută",
    description: station
      ? `Piticotul sare pe piatra „${station.title}” — deblocare prin scan QR pe telefon.`
      : "Pagină de scan QR pentru Circuitul Piticotului.",
    path: `/inovatie/piticot/scan/${stationId}/`,
  });
}

export default async function PiticotScanPage({ params }: PageProps) {
  const { stationId } = await params;
  return (
    <main id="main-content" className="relative h-full w-full">
      <ScanClient stationId={stationId} />
    </main>
  );
}
