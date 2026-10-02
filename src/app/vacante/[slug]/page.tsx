import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getAllRegionSlugs, getRegion, regions } from "@/lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllRegionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = getRegion(slug);
  if (!region) {
    return { title: "Vacanță negăsită" };
  }

  return {
    title: region.seoTitle,
    description: region.seoDescription,
    alternates: {
      canonical: `/vacante/${region.slug}/`,
    },
    openGraph: {
      title: `${region.seoTitle} · RoHub`,
      description: region.seoDescription,
      type: "article",
      locale: "ro_RO",
      images: [{ url: region.image, alt: region.heroAlt }],
    },
    keywords: [
      `vacanțe ${region.name}`,
      `turism ${region.name}`,
      "agenție de turism România",
      "RoHub",
      "experiențe autentice",
    ],
  };
}

export default async function RegionPage({ params }: PageProps) {
  const { slug } = await params;
  const region = getRegion(slug);
  if (!region) notFound();

  const others = regions.filter((item) => item.slug !== region.slug).slice(0, 3);

  return (
    <>
      <Header variant="overlay" />
      <main className="flex-1">
        <section className="relative flex min-h-[70svh] items-end overflow-hidden">
          <Image
            src={region.image}
            alt={region.heroAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20"
            aria-hidden
          />
          <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-14 pt-28 sm:px-8 sm:pb-20">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dawn">
              Vacanțe în România · {region.days}
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              {region.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              {region.blurb}
            </p>
          </div>
        </section>

        <section className="bg-fog py-16 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.4fr_0.8fr] lg:gap-16">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Trăiește {region.name}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-stone sm:text-lg">
                {region.intro}
              </p>

              <h3 className="mt-10 font-display text-2xl font-bold text-ink">
                Pentru ce e renumită
              </h3>
              <ul className="mt-4 space-y-3">
                {region.famousFor.map((item) => (
                  <li
                    key={item}
                    className="border-l-2 border-dawn pl-4 text-stone"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="mt-10 font-display text-2xl font-bold text-ink">
                Ce să vezi
              </h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {region.attractions.map((item) => (
                  <li
                    key={item}
                    className="bg-mist px-4 py-3 text-sm leading-relaxed text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="mt-10 font-display text-2xl font-bold text-ink">
                Mâncare & băutură
              </h3>
              <ul className="mt-4 space-y-3">
                {region.food.map((item) => (
                  <li
                    key={item}
                    className="border-l-2 border-moss pl-4 text-stone"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="mt-10 font-display text-2xl font-bold text-ink">
                Experiențe pe care le putem organiza
              </h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {region.experiences.map((item) => (
                  <li
                    key={item}
                    className="bg-white px-4 py-3 text-sm leading-relaxed text-ink ring-1 ring-stone/15"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="h-fit bg-pine px-6 py-8 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-dawn">
                Pentru cine e
              </p>
              <p className="mt-4 text-base leading-relaxed text-white/90">
                {region.bestFor}
              </p>
              <p className="mt-6 text-sm text-white/75">
                Durată tipică: <span className="text-white">{region.days}</span>
              </p>
              <a
                href="#contact"
                className="mt-8 inline-block rounded-sm bg-dawn px-5 py-3 text-sm font-semibold text-ink transition hover:brightness-110"
              >
                Cere ofertă pentru {region.name}
              </a>
              <p className="mt-4 text-sm text-white/70">
                Răspundem pe WhatsApp, email sau telefon în maxim o zi
                lucrătoare.
              </p>
            </aside>
          </div>
        </section>

        <section className="border-t border-stone/15 bg-white py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                Alte regiuni
              </h2>
              <Link
                href="/vacante/"
                className="text-sm font-semibold text-moss underline-offset-4 hover:underline"
              >
                Toate vacanțele
              </Link>
            </div>
            <ul className="mt-8 grid gap-6 sm:grid-cols-3">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link href={`/vacante/${item.slug}/`} className="group block">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.heroAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-3 font-display text-xl font-bold text-ink">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm text-stone">{item.blurb}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Contact defaultDestination={region.name} />
      </main>
      <Footer />
    </>
  );
}
