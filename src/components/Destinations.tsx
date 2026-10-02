import Image from "next/image";
import { destinations } from "@/lib/content";

export function Destinations() {
  return (
    <section id="destinatii" className="bg-fog py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
            Destinații
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            Unde te ducem luna asta
          </h2>
          <p className="mt-4 text-base leading-relaxed text-stone sm:text-lg">
            Sejururi curate, cu ritm bun și locuri care merită timpul tău — din
            Carpați până la ocean.
          </p>
        </div>

        <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((place) => (
            <li key={place.id} className="group">
              <article>
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={place.image}
                    alt={`${place.name}, ${place.region}`}
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
                      {place.region} · {place.days}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-bold text-white">
                      {place.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/85">
                      {place.blurb}
                    </p>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
