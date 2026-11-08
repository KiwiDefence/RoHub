import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import {
  SITE_ADDRESS_DISPLAY,
  SITE_EMAIL,
  SITE_NAME,
  SITE_PHONE_DISPLAY,
  breadcrumbJsonLd,
  buildPageMetadata,
} from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Termeni și condiții",
  description:
    "Condiții generale pentru cereri de ofertă, vacanțe personalizate și retreat-uri corporate RoHubTravel. Minimum 10 persoane la pachetele standard.",
  path: "/termeni-si-conditii/",
  keywords: [
    "termeni și condiții turism",
    "condiții rezervare RoHubTravel",
    "retreat corporate condiții",
  ],
});

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Acasă", path: "/" },
          { name: "Termeni și condiții", path: "/termeni-si-conditii/" },
        ])}
      />
      <Header variant="solid" />
      <main id="main-content" className="flex-1 bg-fog pt-24">
        <div className="mx-auto max-w-3xl px-5 pb-16 sm:px-8 sm:pb-24">
          <Breadcrumbs
            items={[
              { name: "Acasă", href: "/" },
              { name: "Termeni și condiții" },
            ]}
          />

          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            Termeni și condiții
          </h1>
          <p className="mt-4 text-sm text-stone">
            Ultima actualizare: 7 noiembrie 2026 · {SITE_NAME},{" "}
            {SITE_ADDRESS_DISPLAY}
          </p>

          <div className="mt-10 space-y-8 text-base leading-relaxed text-stone">
            <section>
              <h2 className="font-display text-xl font-bold text-ink">
                1. Despre servicii
              </h2>
              <p className="mt-3">
                RoHubTravel organizează vacanțe și circuite personalizate în
                România, precum și retreat-uri pentru companii (Escape 24h,
                Experience 36h, Retreat 48h, programe custom). Informațiile de
                pe site sunt orientative; oferta finală se confirmă în scris
                (email) după ce stabilim itinerariul, datele și numărul de
                participanți.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-ink">
                2. Cereri de ofertă
              </h2>
              <p className="mt-3">
                Formularul de contact, emailul și WhatsApp-ul sunt canale de
                solicitare, nu rezervări automate. Un circuit sau un retreat
                este considerat rezervat doar după acceptarea ofertei și
                confirmarea condițiilor de plată comunicate în scris.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-ink">
                3. Pachete corporate — număr minim
              </h2>
              <p className="mt-3">
                Pachetele Escape, Experience și Retreat pornesc de la{" "}
                <strong className="font-semibold text-ink">
                  minimum 10 persoane
                </strong>
                . Programul custom „Your Romania” pornește de la minimum 25 de
                persoane. Prețurile afișate pe site sunt „de la” / persoană și
                pot varia în funcție de sezon, cazare și distanță.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-ink">
                4. Prețuri și modificări
              </h2>
              <p className="mt-3">
                Prețurile pot fi actualizate. Dacă partenerii (cazare,
                transport, activități) modifică disponibilitatea sau tarifele
                după confirmare, te informăm și propunem alternative înainte de
                a continua.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-ink">
                5. Anulări
              </h2>
              <p className="mt-3">
                Condițiile de anulare și de rambursare se stabilesc în oferta
                confirmată, în funcție de politica pensiunilor, transportului și
                a celorlalți parteneri. Te rugăm să le citești înainte de
                acceptare.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-ink">
                6. Responsabilitate
              </h2>
              <p className="mt-3">
                Participanții sunt responsabili pentru documente de călătorie
                valide, asigurări personale și respectarea regulilor locurilor
                vizitate. RoHubTravel nu răspunde pentru evenimente de forță
                majoră (meteo extrem, închideri de trasee, restricții
                administrative).
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-ink">
                7. Litigii
              </h2>
              <p className="mt-3">
                Preferăm soluționarea amiabilă. Consumatorii pot apela la
                mecanismele ANPC SAL/SOL menționate în subsolul site-ului.
                Legea aplicabilă este legea română.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-ink">
                8. Contact
              </h2>
              <p className="mt-3">
                {SITE_NAME} · {SITE_ADDRESS_DISPLAY}
                <br />
                Email: {SITE_EMAIL}
                <br />
                Telefon: {SITE_PHONE_DISPLAY}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
