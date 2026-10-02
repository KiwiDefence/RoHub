import Image from "next/image";
import Link from "next/link";
import { regions } from "@/lib/content";

export function Destinations() {
  return (
    <section id="destinatii" className="bg-fog py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
            Vacanțe în România
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            Fiecare regiune are o poveste
          </h2>
          <p className="mt-4 text-base leading-relaxed text-stone sm:text-lg">
            Circuite și vacanțe în Oltenia, Muntenia, Maramureș, Transilvania,
            Bucovina și Dobrogea — locuri unde încă se trăiește, nu doar se
            vizitează.
          </p>
        </div>

        <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((place) => (
            <li key={place.slug} className="group">
              <Link href={`/vacante/${place.slug}/`} className="block">
                <article>
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={place.image}
                      alt={place.heroAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent"
                      aria-hidden
                    />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-dawn">
                        România · {place.days}
                      </p>
                      <h3 className="mt-1 font-display text-2xl font-bold text-white">
                        {place.name}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/85">
                        {place.blurb}
                      </p>
                      <span className="mt-3 inline-block text-sm font-semibold text-white underline-offset-4 group-hover:underline">
                        Vezi vacanța →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
