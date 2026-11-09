import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { regions } from "@/lib/content";

export function Destinations() {
  return (
    <section id="destinatii" className="bg-fog py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
            Vacanțe în România
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            Fiecare regiune are o poveste
          </h2>
          <p className="mt-4 text-base leading-relaxed text-stone sm:text-lg">
            Circuite și vacanțe în Oltenia, Muntenia, Maramureș, Transilvania,
            Bucovina și Dobrogea - locuri unde încă se trăiește, nu doar se
            vizitează.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((place, index) => (
            <Reveal key={place.slug} as="li" className="group" delay={index * 80}>
              <Link
                href={`/vacante/${place.slug}/`}
                className="block overflow-hidden rounded-sm ring-1 ring-stone/20 transition hover:shadow-lg"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={place.image}
                    alt={place.heroAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                </div>
                <div className="bg-white px-5 py-4">
                  <p className="font-display text-xl font-bold text-ink">
                    {place.name}
                  </p>
                  <p className="mt-1 text-sm text-stone">{place.days}</p>
                  <p className="mt-2 text-sm leading-relaxed text-stone/90">
                    {place.blurb}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-10 text-center text-sm" delay={120}>
          <Link
            href="/vacante/"
            className="font-semibold text-moss underline-offset-4 hover:underline"
          >
            Vezi toate vacanțele în România
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
