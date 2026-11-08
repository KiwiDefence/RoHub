import Image from "next/image";
import Link from "next/link";
import { ABOUT_IMAGE, experiences } from "@/lib/content";
import { teamMembers } from "@/lib/team";

export function About() {
  const preview = teamMembers.slice(0, 5);

  return (
    <section id="despre" className="relative overflow-hidden bg-pine text-white">
      <div
        className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-moss/40 blur-3xl"
        aria-hidden
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/6]">
          <Image
            src={ABOUT_IMAGE}
            alt="Potecă prin pădure în România, experiență autentică RoHubTravel"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dawn">
            Despre RoHubTravel
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Turism românesc, pe oameni și pe locuri reale
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/85 sm:text-lg">
            RoHubTravel e agenție de turism axată pe România: circuite, experiențe
            autentice, gastronomie, crame și programe pentru companii. Lucrăm cu
            ghiduri locale, pensiuni și parteneri verificați — ca să trăiești
            regiunea, nu doar să o treci pe listă. Baza noastră este în Brașov.
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

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dawn">
                Echipa
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-4xl">
                Oamenii din spatele RoHubTravel
              </h2>
            </div>
            <Link
              href="/echipa/"
              className="text-sm font-semibold text-dawn underline-offset-4 hover:underline"
            >
              Vezi pagina echipei
            </Link>
          </div>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {preview.map((member) => (
              <li key={member.name} className="border-t border-white/15 pt-6">
                <div className="relative aspect-square overflow-hidden rounded-sm bg-white/10">
                  <Image
                    src={member.image}
                    alt={member.imageAlt}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-cover"
                    style={{ objectPosition: member.objectPosition }}
                  />
                </div>
                <p className="mt-4 font-display text-base font-bold leading-snug">
                  {member.name}
                </p>
                <p className="mt-1 text-sm leading-snug text-white/70">
                  {member.role}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
