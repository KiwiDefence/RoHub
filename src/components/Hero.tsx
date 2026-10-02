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
        alt="Drum de munte la apus, drumul spre următoarea vacanță"
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
        <p className="animate-fade-up font-display text-5xl font-extrabold tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl">
          Rohub
        </p>
        <h1 className="animate-fade-up delay-1 mt-4 max-w-xl text-2xl font-medium leading-snug text-white sm:text-3xl md:text-4xl">
          Vacanțe cu sens, nu doar cu peisaje.
        </h1>
        <p className="animate-fade-up delay-2 mt-4 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
          Agenție de turism din România. Itinerarii clare, experiențe locale,
          liniște de la primul mesaj.
        </p>
        <div className="animate-fade-up delay-3 mt-8 flex flex-wrap gap-3">
          <a
            href="#destinatii"
            className="rounded-sm bg-dawn px-6 py-3 text-sm font-semibold text-ink transition hover:brightness-110"
          >
            Vezi destinațiile
          </a>
          <a
            href="#contact"
            className="rounded-sm border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Scrie-ne
          </a>
        </div>
      </div>
    </section>
  );
}
