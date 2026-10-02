import Image from "next/image";
import { HERO_IMAGE } from "@/lib/content";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      <Image
        src={HERO_IMAGE}
        alt="Peisaj de munte din România, drum spre o vacanță autentică"
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
        <p className="animate-fade-up font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
          RoHubTravel
        </p>
        <h1 className="animate-fade-up delay-1 mt-4 max-w-2xl text-2xl font-medium leading-snug text-white sm:text-3xl md:text-4xl">
          Nu vizitezi România. O trăiești.
        </h1>
        <p className="animate-fade-up delay-2 mt-4 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
          Agenție de turism pentru vacanțe în România: circuite pe regiuni,
          gastronomie, crame și experiențe locale — de la Oltenia la Delta
          Dunării.
        </p>
        <div className="animate-fade-up delay-3 mt-8 flex flex-wrap gap-3">
          <a
            href="/vacante/"
            className="rounded-sm bg-dawn px-6 py-3 text-sm font-semibold text-ink transition hover:brightness-110"
          >
            Vacanțe pe regiuni
          </a>
          <a
            href="/#contact"
            className="rounded-sm border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Scrie-ne
          </a>
        </div>
      </div>
    </section>
  );
}
