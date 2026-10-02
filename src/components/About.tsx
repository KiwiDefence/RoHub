import Image from "next/image";
import { ABOUT_IMAGE, experiences } from "@/lib/content";

export function About() {
  return (
    <section id="despre" className="relative overflow-hidden bg-pine text-white">
      <div
        className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-moss/40 blur-3xl"
        aria-hidden
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/6]">
          <Image
            src={ABOUT_IMAGE}
            alt="Drum prin natură în România, pregătit pentru următoarea experiență RoHub"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dawn">
            Despre RoHub
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Turism românesc, pe oameni și pe locuri reale
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/85 sm:text-lg">
            RoHub e agenție de turism axată pe România: circuite, experiențe
            autentice, gastronomie, crame și programe pentru companii. Lucrăm cu
            ghiduri locale, pensiuni și parteneri verificați — ca să trăiești
            regiunea, nu doar să o treci pe listă.
          </p>

          <ul className="mt-10 space-y-6">
            {experiences.map((item) => (
              <li key={item.title} className="border-t border-white/15 pt-6">
                <h3 className="font-display text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80 sm:text-base">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
