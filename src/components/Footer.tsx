import Link from "next/link";
import { regions } from "@/lib/content";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-extrabold tracking-tight">
            RoHubTravel
          </p>
          <p className="mt-2 max-w-sm text-sm text-white/70">
            Agenție de turism pentru vacanțe și circuite autentice în România - 
            Oltenia, Muntenia, Maramureș, Transilvania, Bucovina și Dobrogea.
          </p>
          <p className="mt-4 text-sm text-white/60">
            București ·{" "}
            <a
              href="mailto:hello@rohub.ro"
              className="hover:text-white"
            >
              hello@rohub.ro
            </a>{" "}
            ·{" "}
            <a href="tel:+40722111222" className="hover:text-white">
              +40 722 111 222
            </a>
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-dawn">
            Vacanțe
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {regions.map((region) => (
              <li key={region.slug}>
                <Link
                  href={`/vacante/${region.slug}/`}
                  className="hover:text-white"
                >
                  {region.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-dawn">
            RoHubTravel
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <Link href="/vacante/" className="hover:text-white">
                Toate vacanțele
              </Link>
            </li>
            <li>
              <Link href="/servicii-b2b/" className="hover:text-white">
                Services
              </Link>
            </li>
            <li>
              <Link href="/harta-site/" className="hover:text-white">
                Harta site
              </Link>
            </li>
            <li>
              <Link href="/#despre" className="hover:text-white">
                Despre
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <p className="max-w-md text-xs leading-relaxed text-white/50">
            © {year} RoHubTravel. Toate drepturile rezervate. Fotografii: Wikimedia
            Commons (România).
          </p>

          {/* Pictograme ANPC SAL/SOL - Ordin 449/2022, 250×50px
              Ghid: https://kitamaru.ro/blog/cum-folosesc-pictogramele-anpc/ */}
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <a
              href="https://anpc.ro/ce-este-sal/"
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="m-0 inline-block p-0 leading-none no-underline"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${basePath}/anpc/anpc-sal.svg`}
                alt="Soluționarea Alternativă a Litigiilor"
                width={250}
                height={50}
                className="m-[5px] inline-block h-[50px] w-[250px] max-w-full border-0"
              />
            </a>
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="m-0 inline-block p-0 leading-none no-underline"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${basePath}/anpc/anpc-sol.svg`}
                alt="Soluționarea Online a Litigiilor"
                width={250}
                height={50}
                className="m-[5px] inline-block h-[50px] w-[250px] max-w-full border-0"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
