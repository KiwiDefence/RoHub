import Link from "next/link";
import { regions } from "@/lib/content";
import {
  BRAND_LOGO_MARK,
  SITE_ADDRESS_DISPLAY,
  SITE_EMAIL,
  SITE_PHONE,
  SITE_PHONE_DISPLAY,
} from "@/lib/seo";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-2 sm:px-8 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath}${BRAND_LOGO_MARK}`}
            alt="RoHubTravel"
            width={220}
            height={90}
            className="h-11 w-auto object-contain brightness-0 invert sm:h-[3.25rem]"
          />
          <p className="mt-4 max-w-sm text-sm text-white/70">
            Agenție de turism pentru vacanțe și circuite autentice în România -
            Oltenia, Muntenia, Maramureș, Transilvania, Bucovina și Dobrogea.
          </p>
          <p className="mt-4 text-sm text-white/60">
            {SITE_ADDRESS_DISPLAY}
            <br />
            <a
              href={`mailto:${SITE_EMAIL}`}
              className="hover:text-white"
            >
              {SITE_EMAIL}
            </a>
            <br />
            <a href={`tel:${SITE_PHONE}`} className="hover:text-white">
              {SITE_PHONE_DISPLAY}
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
                Servicii
              </Link>
            </li>
            <li>
              <Link href="/echipa/" className="hover:text-white">
                Echipa
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
            <li>
              <Link href="/harta-site/" className="hover:text-white">
                Harta site-ului
              </Link>
            </li>
            <li>
              <Link
                href="/politica-de-confidentialitate/"
                className="hover:text-white"
              >
                Politica de confidențialitate
              </Link>
            </li>
            <li>
              <Link href="/termeni-si-conditii/" className="hover:text-white">
                Termeni și condiții
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <p className="max-w-md text-xs leading-relaxed text-white/50">
            © {year} RoHubTravel. Toate drepturile rezervate. Fotografii:{" "}
            <a
              href="https://commons.wikimedia.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:text-white/80 hover:underline"
            >
              Wikimedia Commons
            </a>
            {" · "}
            <Link
              href="/politica-de-confidentialitate/"
              className="underline-offset-2 hover:text-white/80 hover:underline"
            >
              Confidențialitate
            </Link>
            {" · "}
            <Link
              href="/termeni-si-conditii/"
              className="underline-offset-2 hover:text-white/80 hover:underline"
            >
              Termeni
            </Link>
            .
          </p>

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
