import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BookTravel } from "@/components/travel/BookTravel";
import { DEMO_TRAVELS, getDemoTravel } from "@/lib/demo-travels";
import { buildPageMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ travelId: string }> };

export function generateStaticParams() {
  return DEMO_TRAVELS.map((t) => ({ travelId: t.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { travelId } = await params;
  const travel = getDemoTravel(travelId);
  return buildPageMetadata({
    title: travel
      ? `Rezervă ${travel.title} · RoHubTravel`
      : "Rezervare demo · RoHubTravel",
    description: travel?.summary ?? "Confirmă rezervarea demo RoHubTravel.",
    path: `/calatorie/rezerva/${travelId}/`,
  });
}

export default async function RezervaPage({ params }: PageProps) {
  const { travelId } = await params;
  return (
    <>
      <Header variant="solid" />
      <main id="main-content" className="flex-1 pt-20">
        <BookTravel travelId={travelId} />
      </main>
      <Footer />
    </>
  );
}
