import { PiticotApp } from "@/components/piticot/PiticotApp";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Piticot - circuit gamificat pe telefon",
  description:
    "Piticot RoHubTravel: scanezi QR printat cu camera telefonului, Piticotul sare pe pietre, la final primești Storybook.",
  path: "/inovatie/piticot/",
  keywords: [
    "Piticot",
    "gamificare turism",
    "QR scan telefon",
    "storybook travel",
    "RoHubTravel inovație",
  ],
});

export default function PiticotPage() {
  return (
    <main id="main-content" className="relative h-full w-full">
      <PiticotApp />
    </main>
  );
}
