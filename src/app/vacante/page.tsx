import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { regions } from "@/lib/content";
import {
  VACANTE_FAQS,
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  faqJsonLd,
} from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Vacanțe în România pe regiuni",
  description:
    "Circuite și vacanțe RoHubTravel în Oltenia, Muntenia, Maramureș, Transilvania, Bucovina și Dobrogea. Experiențe autentice: gastronomie, crame, mănăstiri și natură în România.",
  path: "/vacante/",
  keywords: [
    "vacanțe România pe regiuni",
    "circuite Oltenia",
    "circuite Maramureș",
    "circuite Transilvania",
    "circuite Bucovina",
    "tururi Delta Dunării",
  ],
});

export default function VacanteIndexPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Vacanțe în România pe regiuni — RoHubTravel",
    itemListElement: regions.map((region, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: region.name,
      url: absoluteUrl(`/vacante/${region.slug}/`),
      description: region.seoDescription,
    })),
  };

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Acasă", path: "/" },
          { name: "Vacanțe", path: "/vacante/" },
        ])}
      />
      <JsonLd data={itemList} />
      <JsonLd data={faqJsonLd([...VACANTE_FAQS])} />
      <Header variant="solid" />
      <main className="flex-1 bg-fog pt-24 sm:pt-28">
        <section className="mx-auto max-w-6xl px-5 pb-10 sm:px-8">
          <Breadcrumbs
            items={[
              { name: "Acasă", href: "/" },
              { name: "Vacanțe" },
            ]}
          />
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-moss">
            Vacanțe în România
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-ink sm:text-6xl">
            Regiuni pe care le poți trăi, nu doar vizita
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone sm:text-lg">
            Fiecare pagină e un circuit RoHubTravel pe regiune — făcut pentru
            oameni care vor povești locale, gastronomie, crame și natură în
            Oltenia, Muntenia, Maramureș, Transilvania, Bucovina sau Dobrogea.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {regions.map((region) => (
              <li key={region.slug}>
                <Link
                  href={`/vacante/${region.slug}/`}
                  className="group block h-full"
                >
                  <article className="h-full">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={region.image}
                        alt={region.heroAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="pt-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-dawn">
                        {region.days}
                      </p>
                      <h2 className="mt-1 font-display text-2xl font-bold text-ink">
                        Vacanțe în {region.name}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-stone">
                        {region.blurb}
                      </p>
                      <span className="mt-3 inline-block text-sm font-semibold text-moss underline-offset-4 group-hover:underline">
                        Deschide pagina →
                      </span>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <FaqSection
          title="Cum alegi vacanța potrivită"
          faqs={VACANTE_FAQS}
        />
      </main>
      <Footer />
    </>
  );
}
