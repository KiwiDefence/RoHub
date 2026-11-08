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
  breadcrumbJsonLd,
  buildPageMetadata,
  faqJsonLd,
} from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Vacanțe autentice în România",
  description: SITE_DESCRIPTION,
  path: "/",
  keywords: [
    "agenție turism Brașov",
    "circuite România personalizate",
    "vacanțe diaspora România",
  ],
});

export default function Home() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Acasă", path: "/" },
        ])}
      />
      <JsonLd data={faqJsonLd([...HOME_FAQS])} />
      <Header />
      <main id="main-content" className="flex-1">
        <Hero />
        <Destinations />

        <section className="bg-fog py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
                  Problema
                </p>
                <h2 className="mt-3 font-sans text-2xl font-semibold leading-snug text-ink sm:text-3xl">
                  Vacanțele standard sunt la fel: același resort, același program
                </h2>
                <p className="mt-5 text-base leading-relaxed text-stone sm:text-lg">
                  Cele mai multe oferte turistice sunt create pe locații fixe — aceeași destinație, același traseu, aceeași experiență. Nu găsești sate autentice, mănăstiri UNESCO sau crame ascunse în pliantele agențiilor.
                </p>
                <p className="mt-4 text-lg leading-relaxed text-stone sm:text-xl">
                  <span className="font-bold text-pine">38%</span> dintre
                  angajații din România au raportat stres ridicat în ziua
                  precedentă (
                  <a
                    href="https://www.gallup.com/analytics/349280/gallup-global-emotions-report.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-moss underline-offset-2 hover:underline"
                  >
                    Gallup Global Emotions
                  </a>
                  ) — au nevoie de o vacanță care să îi deconecteze cu adevărat.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
                  Soluția
                </p>
                <h2 className="mt-3 font-sans text-2xl font-semibold leading-snug text-ink sm:text-3xl">
                  Itinerarii pe regiuni, create pentru tine
                </h2>
                <p className="mt-5 text-base leading-relaxed text-stone sm:text-lg">
                  RoHubTravel construiește circuite personalizate pe regiunile României — Oltenia, Muntenia, Maramureș, Transilvania, Bucovina, Dobrogea. Fiecare experiență include locații reale, oameni reali și gastronomie autentică.
                </p>
                <p className="mt-4 text-xl font-semibold leading-snug text-pine sm:text-2xl">
                  Descoperă. Trăiește.
                  <br />
                  Simte România.
                </p>
              </div>
            </div>
          </div>
        </section>

        <About />
        <FaqSection faqs={HOME_FAQS} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
