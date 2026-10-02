import type { Metadata } from "next";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Servicii B2B — Retreat-uri pentru angajați",
  description:
    "Retreat-uri RoHub pentru companii: Escape 24h, Experience 36h, Retreat 48h și programe custom. Natură, gastronomie și experiențe locale în România.",
  alternates: {
    canonical: "/servicii-b2b/",
  },
  openGraph: {
    title: "Servicii B2B — Retreat-uri pentru angajați · RoHub",
    description:
      "Nu este team-building. Este timp pentru oameni. Retreat-uri corporate în România.",
    locale: "ro_RO",
    type: "website",
  },
  keywords: [
    "retreat angajați",
    "team retreat România",
    "corporate travel",
    "RoHub B2B",
    "experiențe corporate",
  ],
};

const packages = [
  {
    id: "escape",
    code: "ROHUB 24",
    name: "ESCAPE",
    headline: "24 de ore pentru a ieși din rutină.",
    blurb:
      "O experiență de o zi, creată pentru companiile care vor să ofere angajaților o pauză reală de la mediul de lucru, fără un program de mai multe zile.",
    includes: [
      "transport organizat",
      "experiență în natură",
      "activitate culturală sau locală",
      "experiență gastronomică",
      "vizită la producători locali",
      "timp liber pentru relaxare",
      "coordonare pe durata experienței",
      "program adaptat grupului",
    ],
    suited:
      "O primă experiență RoHub sau pentru companiile care vor un retreat scurt, fără cazare.",
  },
  {
    id: "experience",
    code: "ROHUB 36",
    name: "EXPERIENCE",
    headline: "36 de ore pentru relaxare și descoperire.",
    blurb:
      "O experiență de o noapte care oferă mai mult timp pentru deconectare și pentru descoperirea locurilor și oamenilor din România.",
    includes: [
      "transport organizat",
      "cazare pentru o noapte",
      "mic dejun",
      "experiențe locale",
      "activități în natură",
      "experiență gastronomică",
      "vizite la producători locali",
      "activități culturale sau tradiționale",
      "timp liber",
      "coordonare pe durata retreat-ului",
    ],
    suited:
      "Companiile care vor să ofere angajaților mai mult decât o excursie de o zi.",
  },
  {
    id: "retreat",
    code: "ROHUB 48",
    name: "RETREAT",
    headline: "48 de ore pentru o deconectare completă.",
    blurb:
      "Două zile în care angajații pot lăsa rutina în urmă și pot descoperi România prin natură, gastronomie, tradiții și experiențe locale.",
    includes: [
      "transport organizat",
      "cazare pentru două nopți",
      "mic dejun",
      "experiențe în natură",
      "activități culturale",
      "gastronomie locală",
      "degustări și experiențe la producători locali",
      "vizite la crame",
      "experiențe tradiționale",
      "timp liber",
      "coordonare pe durata retreat-ului",
    ],
    suited:
      "Companiile care vor să ofere angajaților o experiență completă de relaxare și reconectare.",
  },
] as const;

const customOptions = [
  "destinația",
  "durata",
  "tipul de cazare",
  "transportul",
  "activitățile",
  "experiențele gastronomice",
  "vizitele la crame",
  "experiențele agricole",
  "activitățile tradiționale",
  "programul zilnic",
  "nivelul de confort",
  "experiențele locale",
] as const;

const customExamples = [
  "Mulsul vacii într-o gospodărie locală",
  "Hrănirea animalelor",
  "Culesul fructelor și legumelor",
  "Degustări de produse locale",
  "Vizite la crame",
  "Ateliere tradiționale",
  "Gastronomie locală",
  "Drumeții și activități în natură",
  "Întâlniri cu producători și oameni din comunitățile locale",
] as const;

const whyPoints = [
  {
    title: "Natură",
    text: "Locuri în care poți încetini.",
  },
  {
    title: "Gastronomie",
    text: "Gusturi locale și producători autentici.",
  },
  {
    title: "Cultură",
    text: "Tradiții, povești și oameni.",
  },
  {
    title: "Experiențe",
    text: "Activități pe care nu le găsești într-un program turistic standard.",
  },
  {
    title: "Relaxare",
    text: "Timp în care angajații nu trebuie să performeze. Doar să se bucure de experiență.",
  },
] as const;

export default function ServiciiB2BPage() {
  return (
    <>
      <Header variant="solid" />
      <main className="flex-1">
        <section className="bg-pine pt-28 pb-16 text-white sm:pt-32 sm:pb-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dawn">
              Servicii B2B
            </p>
            <h1 className="mt-4 max-w-3xl font-sans text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-5xl sm:leading-[1.15] md:text-6xl">
              Retreat-uri pentru angajați. Experiențe care te scot din rutină.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              La RoHub credem că oamenii nu au nevoie întotdeauna de încă o
              activitate de echipă. Uneori au nevoie pur și simplu să se
              oprească, să respire și să se reconecteze cu natura, oamenii și
              locurile din România.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              De aceea, creăm retreat-uri pentru angajați care combină
              relaxarea, natura, gastronomia și experiențele locale într-o
              experiență completă.
            </p>
            <p className="mt-8 font-sans text-xl font-semibold leading-snug text-dawn sm:text-2xl">
              Nu este team-building.
              <br />
              Este timp pentru oameni.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#pachete"
                className="rounded-sm bg-dawn px-6 py-3 text-sm font-semibold text-ink transition hover:brightness-110"
              >
                Vezi pachetele
              </a>
              <a
                href="#contact"
                className="rounded-sm border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Cere ofertă
              </a>
            </div>
          </div>
        </section>

        <section id="pachete" className="bg-fog py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <h2 className="max-w-2xl font-sans text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-5xl sm:leading-[1.15]">
              Alege experiența potrivită pentru echipa ta
            </h2>

            <div className="mt-14 space-y-16">
              {packages.map((pkg) => (
                <article
                  key={pkg.id}
                  id={pkg.id}
                  className="border-t border-stone/20 pt-12"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
                    {pkg.code}
                  </p>
                  <h3 className="mt-2 font-sans text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
                    {pkg.name}
                  </h3>
                  <p className="mt-3 max-w-2xl text-xl font-medium text-ink sm:text-2xl">
                    {pkg.headline}
                  </p>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone sm:text-lg">
                    {pkg.blurb}
                  </p>

                  <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-dawn">
                    Include
                  </p>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {pkg.includes.map((item) => (
                      <li
                        key={item}
                        className="border-l-2 border-moss pl-4 text-stone"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-8 max-w-2xl text-sm leading-relaxed text-stone sm:text-base">
                    <span className="font-semibold text-ink">Potrivit pentru:</span>{" "}
                    {pkg.suited}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="custom" className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
              ROHUB CUSTOM
            </p>
            <h2 className="mt-3 font-sans text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-5xl sm:leading-[1.15]">
              YOUR ROMANIA
            </h2>
            <p className="mt-4 max-w-2xl text-xl font-medium text-ink sm:text-2xl">
              O experiență creată pentru compania ta.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone sm:text-lg">
              Pentru grupurile de minimum{" "}
              <strong className="font-semibold text-ink">25 de persoane</strong>,
              construim retreat-uri personalizate de 48 de ore sau mai mult.
            </p>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone sm:text-lg">
              Nu alegi doar o destinație. Construim împreună întreaga experiență.
            </p>

            <p className="mt-10 text-sm font-semibold uppercase tracking-[0.16em] text-dawn">
              Poți personaliza
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {customOptions.map((item) => (
                <li key={item} className="border-l-2 border-dawn pl-4 text-stone">
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-12 text-sm font-semibold uppercase tracking-[0.16em] text-dawn">
              Exemple de experiențe
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {customExamples.map((item) => (
                <li
                  key={item}
                  className="bg-mist px-4 py-3 text-sm leading-relaxed text-ink"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-pine py-16 text-white sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dawn">
              De ce RoHub?
            </p>
            <h2 className="mt-3 max-w-2xl font-sans text-3xl font-semibold tracking-[-0.02em] sm:text-5xl sm:leading-[1.15]">
              Nu vizitezi România. O trăiești.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              Transformăm o simplă excursie într-o experiență care îi apropie pe
              oameni de România.
            </p>

            <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {whyPoints.map((point) => (
                <li key={point.title} className="border-t border-white/15 pt-6">
                  <h3 className="font-sans text-lg font-semibold uppercase tracking-[0.12em]">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80 sm:text-base">
                    {point.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-mist py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <h2 className="max-w-2xl font-sans text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl sm:leading-[1.15]">
              Vrei să creezi următorul retreat pentru angajații tăi?
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-stone sm:text-lg">
              Spune-ne câți participanți ai, perioada dorită și ce tip de
              experiență cauți.
            </p>
            <p className="mt-3 font-sans text-xl font-semibold text-pine">
              Noi ne ocupăm de restul.
            </p>
            <p className="mt-8 text-sm text-stone">
              RoHub — Discover Romania. Experience Romania.
            </p>
          </div>
        </section>

        <Contact defaultDestination="Retreat B2B" />
      </main>
      <Footer />
    </>
  );
}
