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
  title: "Politica de confidențialitate",
  description:
    "Cum colectăm și folosim datele de contact pe site-ul RoHubTravel. Informații GDPR pentru formularul de contact, email și telefon.",
  path: "/politica-de-confidentialitate/",
  keywords: ["politica confidențialitate", "GDPR turism", "RoHubTravel privacy"],
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Acasă", path: "/" },
          {
            name: "Politica de confidențialitate",
            path: "/politica-de-confidentialitate/",
          },
        ])}
      />
      <Header variant="solid" />
      <main id="main-content" className="flex-1 bg-fog pt-24">
        <div className="mx-auto max-w-3xl px-5 pb-16 sm:px-8 sm:pb-24">
          <Breadcrumbs
            items={[
              { name: "Acasă", href: "/" },
              { name: "Politica de confidențialitate" },
            ]}
          />

          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            Politica de confidențialitate
          </h1>
          <p className="mt-4 text-sm text-stone">
            Ultima actualizare: 7 noiembrie 2026 · Operator: {SITE_NAME},{" "}
            {SITE_ADDRESS_DISPLAY}
          </p>

          <div className="prose-rohub mt-10 space-y-8 text-base leading-relaxed text-stone">
            <section>
              <h2 className="font-display text-xl font-bold text-ink">
                1. Ce date colectăm
              </h2>
              <p className="mt-3">
                Site-ul RoHubTravel este static (fără conturi de utilizator).
                Colectăm date doar când ne contactezi voluntar: nume, adresă de
                email, destinație/regiune dorită și mesajul tău, prin formularul
                de contact (care deschide clientul tău de email) sau prin
                telefon/WhatsApp/email directe.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-ink">
                2. Scopul prelucrării
              </h2>
              <p className="mt-3">
                Folosim datele exclusiv pentru a răspunde solicitărilor tale
                (oferte de vacanță, retreat-uri corporate, informații despre
                itinerarii) și pentru comunicări legate de aceste solicitări.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-ink">
                3. Temei legal
              </h2>
              <p className="mt-3">
                Prelucrarea se bazează pe interesul legitim de a răspunde unei
                cereri inițiate de tine și, ulterior, pe executarea sau
                pregătirea unui contract de servicii turistice, dacă ajungem la
                o rezervare.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-ink">
                4. Cookie-uri și analitice
              </h2>
              <p className="mt-3">
                Nu folosim cookie-uri de marketing și nu rulăm analitice terțe
                (Google Analytics, Meta Pixel etc.) pe acest site. Browserul
                tău poate stoca date tehnice locale proprii; noi nu setăm
                trackere.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-ink">
                5. Stocare și destinatari
              </h2>
              <p className="mt-3">
                Mesajele ajung pe emailul nostru de contact (
                <a
                  href={`mailto:${SITE_EMAIL}`}
                  className="font-medium text-moss underline-offset-2 hover:underline"
                >
                  {SITE_EMAIL}
                </a>
                ) și, după caz, pe telefon/WhatsApp (
                {SITE_PHONE_DISPLAY}). Nu vindem datele tale. Putem partaja
                detalii necesare doar cu parteneri operaționali (ex. pensiuni,
                transport) când pregătim o rezervare concretă.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-ink">
                6. Drepturile tale
              </h2>
              <p className="mt-3">
                Poți solicita acces, rectificare, ștergere sau restricționarea
                prelucrării, precum și opoziție, scriindu-ne la {SITE_EMAIL}.
                Ai dreptul să te adresezi Autorității Naționale de
                Supraveghere a Prelucrării Datelor cu Caracter Personal
                (ANSPDCP).
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-ink">
                7. Contact
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
