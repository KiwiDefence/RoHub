import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Inovație - Piticot & Mystery Box",
  description:
    "Inovația tech RoHubTravel: aplicația gamificată Piticot cu QR pe traseu și Mystery Box — vacanțe cu destinație secretă și indicii progresive.",
  path: "/inovatie/",
  keywords: [
    "Piticot RoHubTravel",
    "Mystery Box vacanță România",
    "inovație turism tech",
    "gamificare travel",
    "QR turism România",
  ],
});

export default function InovatiePage() {
  return (
    <>
      <Header variant="solid" />
      <main id="main-content">
        <div className="border-b border-stone/15 bg-fog">
          <div className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
            <Breadcrumbs
              items={[
                { name: "Acasă", href: "/" },
                { name: "Inovație" },
              ]}
            />
          </div>
        </div>

        <section className="bg-ink text-white">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dawn">
              Tech innovation
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
              Nu vindem doar drumuri. Construim jocul și misterul.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              Două produse digitale pentru juriu și pentru clienți: un Piticot
              gamificat pe traseu și Mystery Box — rezervare fără destinație
              cunoscută, doar indicii.
            </p>
          </div>
        </section>

        <section className="bg-fog py-16 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-2">
            <article className="flex flex-col rounded-xl border border-pine/20 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-dawn">
                01 · Piticot
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
                Aplicația gamificată a drumului
              </h2>
              <p className="mt-4 flex-1 text-base leading-relaxed text-stone">
                QR printat pe teren, scan cu camera telefonului. Site-ul se
                deschide pe mobil: Piticotul sare de pe o piatră pe alta, aprinde
                stația, iar la final generează Storybook + claim Mystery Box.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-ink/80">
                <li className="border-l-2 border-moss pl-3">
                  Scan telefon → animație salt
                </li>
                <li className="border-l-2 border-moss pl-3">
                  Traseu pe pietre (mobile-first)
                </li>
                <li className="border-l-2 border-moss pl-3">
                  Storybook la finalul traseului
                </li>
              </ul>
              <Link
                href="/inovatie/piticot/"
                className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-pine px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-moss"
              >
                Deschide demo Piticot
              </Link>
            </article>

            <article className="flex flex-col rounded-xl border border-pine/20 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-dawn">
                02 · Mystery Box
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
                Vacanță cu destinație secretă
              </h2>
              <p className="mt-4 flex-1 text-base leading-relaxed text-stone">
                Alegi tema — „Drumul Vinului”, „Capitale & povești”, „Delta &
                ritm lent”. Destinația rămâne secretă. Primești indicii
                progresive până aproape de plecare.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-ink/80">
                <li className="border-l-2 border-dawn pl-3">Teme fără oraș</li>
                <li className="border-l-2 border-dawn pl-3">
                  Indicii tip drip (demo pe site)
                </li>
                <li className="border-l-2 border-dawn pl-3">
                  Rezervare pe email / WhatsApp
                </li>
              </ul>
              <Link
                href="/inovatie/mystery-box/"
                className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-dawn px-6 py-3.5 text-sm font-semibold text-ink shadow-md transition hover:brightness-110"
              >
                Deschide Mystery Box
              </Link>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
