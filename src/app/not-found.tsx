import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Pagina nu a fost găsită",
  description:
    "Pagina pe care o cauți nu există sau a fost mutată. Mergi la pagina principală RoHubTravel.",
  path: "/404/",
  keywords: ["pagina 404", "pagină inexistentă", "RoHubTravel"],
  noIndex: true,
});

export default function NotFoundPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Acasă",
              item: "https://rohubtravel.com/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Pagina nu a fost găsită",
            },
          ],
        }}
      />
      <Header variant="solid" />
      <main id="main-content" className="flex-1 bg-fog pt-24 sm:pt-28">
        <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8 sm:pb-28">
          <Breadcrumbs
            items={[
              { name: "Acasă", href: "/" },
              { name: "404 — Pagina nu a fost găsită" },
            ]}
          />
          <p className="mt-6 font-display text-9xl font-extrabold tracking-tight text-pine/20">
            404
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            Pagina nu a fost găsită
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-stone sm:text-lg">
            Pagina pe care o cauți nu există sau a fost mutată. Îți recomandăm să
            verifici adresa sau să revii la pagina principală.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="/"
              className="rounded-sm bg-pine px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Înapoi acasă
            </a>
            <a
              href="/servicii-b2b/"
              className="rounded-sm border border-pine px-6 py-3 text-sm font-semibold text-pine transition hover:bg-pine/5"
            >
              Vezi serviciile noastre
            </a>
            <a
              href="/vacante/"
              className="rounded-sm border border-pine px-6 py-3 text-sm font-semibold text-pine transition hover:bg-pine/5"
            >
              Vacanțe pe regiuni
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
