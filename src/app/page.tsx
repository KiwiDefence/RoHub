import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Destinations } from "@/components/Destinations";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import {
  HOME_FAQS,
  SITE_DESCRIPTION,
  buildPageMetadata,
  faqJsonLd,
} from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Vacanțe autentice în România",
  description: SITE_DESCRIPTION,
  path: "/",
  keywords: [
    "agenție turism București",
    "circuite România personalizate",
    "vacanțe diaspora România",
  ],
});

export default function Home() {
  return (
    <>
      <JsonLd data={faqJsonLd([...HOME_FAQS])} />
      <Header />
      <main className="flex-1">
        <Hero />
        <Destinations />
        <About />
        <FaqSection faqs={HOME_FAQS} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
