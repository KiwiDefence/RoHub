import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
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
        <Reveal variant="scale" className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/6]">
          <Image
            src={ABOUT_IMAGE}
            alt="Peisaj de toamnă pe dealuri în România, experiență autentică RoHubTravel"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </Reveal>

        <Reveal delay={100}>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dawn">
            Despre RoHubTravel
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Turism românesc, pe oameni și pe locuri reale
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/85 sm:text-lg">
            RoHubTravel este o agenție de turism axată pe România: circuite, experiențe
            autentice, gastronomie, crame și programe pentru companii. Lucrăm cu
            ghizi locali, pensiuni și parteneri verificați — ca să trăiești
            regiunea, nu doar să o treci pe listă. Baza noastră este în Brașov.
          </p>

          <ul className="mt-10 space-y-6">
            {experiences.map((item, i) => (
              <Reveal key={item.title} as="li" delay={160 + i * 90} className="border-t border-white/15 pt-6">
                <h3 className="font-display text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80 sm:text-base">
                  {item.text}
                </p>
              </Reveal>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
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
          </Reveal>

          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6">
            {preview.map((member, i) => (
              <Reveal
                key={member.name}
                as="li"
                delay={i * 70}
                className="text-center"
              >
                <div className="relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-[1.25rem] bg-white/10 ring-1 ring-white/15">
                  <Image
                    src={member.image}
                    alt={member.imageAlt}
                    fill
                    sizes="(max-width: 640px) 45vw, 18vw"
                    className="object-cover"
                    style={{ objectPosition: member.objectPosition }}
                  />
                </div>
                <p className="mt-3 font-display text-sm font-bold leading-snug text-dawn sm:text-base">
                  {member.name}
                </p>
                <p className="mt-1 text-xs leading-snug text-white/70 sm:text-sm">
                  {member.role}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
