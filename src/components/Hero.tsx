import Image from "next/image";
import Link from "next/link";
import { HashLink } from "@/components/HashLink";
import { HERO_IMAGE } from "@/lib/content";
import { SITE_TAGLINE } from "@/lib/seo";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      <Image
        src={HERO_IMAGE}
        alt="Munții Carpați sub zăpadă, peisaj de vacanță în România"
        fill
        priority
        sizes="100vw"
        className="animate-hero-ken object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(45,122,90,0.28),transparent_55%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-32 sm:px-8 sm:pb-24">
        <h1 className="animate-fade-up max-w-4xl font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
          {SITE_TAGLINE}
        </h1>
        <p className="animate-fade-up delay-2 mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
          Vacanțe și circuite autentice în România: gastronomie locală, crame,
          sate, mănăstiri și retreat-uri pentru companii — cu logistică clară
          din Brașov.
        </p>

        <div className="animate-fade-up delay-3 mt-8 flex flex-wrap gap-3">
          <HashLink
            href="/#contact"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-dawn px-6 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-black/35 ring-1 ring-dawn/55 transition hover:brightness-110"
          >
            Planifică vacanța
          </HashLink>
          <Link
            href="/servicii-b2b/"
            className="inline-flex min-h-12 items-center justify-center rounded-md border-2 border-white/75 bg-ink/45 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/25 backdrop-blur-sm transition hover:border-white hover:bg-ink/65"
          >
            Retreat pentru companii
          </Link>
        </div>
      </div>
    </section>
  );
}
