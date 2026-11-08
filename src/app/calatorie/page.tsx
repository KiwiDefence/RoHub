import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TravelHub } from "@/components/travel/TravelHub";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Călătoria mea · RoHubTravel",
  description: "Itinerariu, info rapidă și acces la Circuitul Piticotului.",
  path: "/calatorie/",
});

export default function CalatoriePage() {
  return (
    <>
      <Header variant="solid" />
      <main id="main-content" className="flex-1 pt-20">
        <TravelHub />
      </main>
      <Footer />
    </>
  );
}
