import type { Metadata } from "next";
import { AccountHome } from "@/components/account/AccountHome";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contul tău · RoHubTravel",
  description: "Autentificare și rezervări RoHubTravel.",
  path: "/cont/",
});

export default function ContPage() {
  return (
    <>
      <Header variant="solid" />
      <main id="main-content" className="flex-1 pt-24 sm:pt-32">
        <AccountHome />
      </main>
      <Footer />
    </>
  );
}
