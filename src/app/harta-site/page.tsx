import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { getAllRoutes } from "@/lib/routes";
import { breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Harta site - toate paginile RoHubTravel",
  description:
    "Sitemap HTML RoHubTravel: vacanțe pe regiuni în România, Services (retreat-uri angajați) și contact. Index complet al paginilor.",
  path: "/harta-site/",
  keywords: ["harta site", "sitemap RoHubTravel", "pagini vacanțe România"],
});

export default function HartaSitePage() {
  const routes = getAllRoutes();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Acasă", path: "/" },
          { name: "Harta site", path: "/harta-site/" },
        ])}
      />
      <Header variant="solid" />
      <main className="flex-1 bg-fog pt-24 sm:pt-28">
        <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8 sm:pb-28">
          <Breadcrumbs
            items={[
              { name: "Acasă", href: "/" },
              { name: "Harta site" },
            ]}
          />
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-moss">
            Sitemap
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Toate paginile
          </h1>
          <p className="mt-4 text-base leading-relaxed text-stone sm:text-lg">
            Hartă HTML a site-ului. Varianta pentru Google:{" "}
            <a
              href="/sitemap.xml"
              className="font-medium text-moss underline-offset-4 hover:underline"
            >
              /sitemap.xml
            </a>
          </p>

          <ol className="mt-12 space-y-4">
            {routes.map((route, index) => (
              <li key={route.path} className="border-b border-stone/15 pb-4">
                <span className="mr-3 text-sm text-stone/60">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Link
                  href={route.path}
                  className="font-medium text-ink underline-offset-4 hover:text-moss hover:underline"
                >
                  {route.label}
                </Link>
                <p className="mt-1 pl-9 text-sm text-stone">{route.path}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <Footer />
    </>
  );
}
