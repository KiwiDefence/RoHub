import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Contact } from "@/components/Contact";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { PackageIncludes } from "@/components/PackageIncludes";
import { SERVICE_IMAGES } from "@/lib/content";
import {
  SERVICES_FAQS,
  breadcrumbJsonLd,
  buildPageMetadata,
  faqJsonLd,
  servicesJsonLd,
} from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Servicii - Retreat-uri pentru angajați în România",
  description:
    "Retreat-uri corporate în România: Escape 24h, Experience 36h, Retreat 48h și programe custom. Natură, gastronomie și experiențe locale — nu team-building clasic.",
  path: "/servicii-b2b/",
  image: SERVICE_IMAGES.hero.src,
  keywords: [
    "retreat angajați România",
    "team retreat România",
    "corporate retreat România",
    "retreat corporate natură",
    "experiențe angajați România",
    "team building alternativ România",
    "RoHubTravel Servicii",
  ],
});

const packages = [
  {
    id: "escape",
    code: "ROHUB 24",
    name: "ESCAPE",
    headline: "24 de ore pentru a ieși din rutină.",
    blurb:
      "O experiență de o zi, creată pentru companiile care vor să ofere angajaților o pauză reală de la mediul de lucru, fără un program de mai multe zile.",
    price: "750 RON",
    includes: [
      {
        label: "transport organizat",
        detail:
          "Dus-întors cu mijloc de transport potrivit grupului, pe un traseu confirmat înainte de plecare.",
      },
      {
        label: "experiență în natură",
        detail:
          "Timp în aer liber pe trasee ușoare sau zone naturale alese pentru ritmul grupului — fără forțare, cu pauză reală.",
      },
      {
        label: "activitate culturală sau locală",
        detail:
          "O întâlnire cu locul: obiectiv cultural, meșteșug sau poveste locală, adaptată intereselor echipei.",
      },
      {
        label: "experiență gastronomică",
        detail:
          "Masă cu preparate locale (prânz și/sau cină), la pensiune sau gazdă verificată pe traseu.",
      },
      {
        label: "vizită la producători locali",
        detail:
          "Oprire la un producător sau atelier local — explicații, degustare sau demonstrație, după sezon și disponibilitate.",
      },
      {
        label: "timp liber pentru relaxare",
        detail:
          "Ferestre fără program obligatoriu, ca oamenii să se odihnească, să discute sau să exploreze pe ritmul lor.",
      },
      {
        label: "coordonare pe durata experienței",
        detail:
          "Un punct clar de contact RoHubTravel pe tot parcursul zilei, pentru logistică și eventuale ajustări.",
      },
      {
        label: "program adaptat grupului",
        detail:
          "Orarul și intensitatea se potrivesc mărimii grupului, nivelului de energie și obiectivelor HR.",
      },
    ],
    suited:
      "O primă experiență RoHubTravel sau pentru companiile care vor un retreat scurt, fără cazare.",
    image: SERVICE_IMAGES.escape,
  },
  {
    id: "experience",
    code: "ROHUB 36",
    name: "EXPERIENCE",
    headline: "36 de ore pentru relaxare și descoperire.",
    blurb:
      "O experiență de o noapte care oferă mai mult timp pentru deconectare și pentru descoperirea locurilor și oamenilor din România.",
    price: "1.150 RON",
    includes: [
      {
        label: "transport organizat",
        detail:
          "Dus-întors organizat pentru întregul grup, cu ore de plecare și întoarcere confirmate din timp.",
      },
      {
        label: "cazare pentru o noapte",
        detail:
          "O noapte în locație selectată — pensiune, casă de oaspeți sau unitate cu caracter local, verificată de noi.",
      },
      {
        label: "mic dejun",
        detail:
          "Mic dejun inclus în dimineața următoare, ca ziua să înceapă fără grija logisticii.",
      },
      {
        label: "experiențe locale",
        detail:
          "Activități legate de comunitatea din zonă: oameni, povești și locuri care nu apar în turismul de masă.",
      },
      {
        label: "activități în natură",
        detail:
          "Momente în peisaj — plimbări, natură și aer liber — calibrate pe confortul grupului.",
      },
      {
        label: "experiență gastronomică",
        detail:
          "Mese cu specific local pe durata sejurului, cu accent pe produse din zonă.",
      },
      {
        label: "vizite la producători locali",
        detail:
          "Vizite la producători, crame sau ateliere, cu timp real de dialog, nu doar o oprire scurtă.",
      },
      {
        label: "activități culturale sau tradiționale",
        detail:
          "Elemente de patrimoniu, meșteșug sau tradiție locală, integrate natural în program.",
      },
      {
        label: "timp liber",
        detail:
          "Spațiu în program pentru odihnă, conversație și deconectare fără agendă forțată.",
      },
      {
        label: "coordonare pe durata retreat-ului",
        detail:
          "Suport RoHubTravel de la plecare până la întoarcere, pe WhatsApp, telefon sau email.",
      },
    ],
    suited:
      "Companiile care vor să ofere angajaților mai mult decât o excursie de o zi.",
    image: SERVICE_IMAGES.experience,
  },
  {
    id: "retreat",
    code: "ROHUB 48",
    name: "RETREAT",
    headline: "48 de ore pentru o deconectare completă.",
    blurb:
      "Două zile în care angajații pot lăsa rutina în urmă și pot descoperi România prin natură, gastronomie, tradiții și experiențe locale.",
    price: "1.450 RON",
    includes: [
      {
        label: "transport organizat",
        detail:
          "Transport dus-întors pentru grup, planificat pe durata completă a retreat-ului de 48 de ore.",
      },
      {
        label: "cazare pentru două nopți",
        detail:
          "Două nopți în locații cu atmosferă regională, alese pentru confort și autenticitate.",
      },
      {
        label: "mic dejun",
        detail:
          "Mic dejun inclus în diminețile de pe parcurs, ca ritmul să rămână clar și fără surprize.",
      },
      {
        label: "experiențe în natură",
        detail:
          "Activități outdoor pe peisaj românesc — natură, aer liber și timp de respirat în afara biroului.",
      },
      {
        label: "activități culturale",
        detail:
          "Vizite și contexte culturale care dau sens locului, nu doar o listă de obiective.",
      },
      {
        label: "gastronomie locală",
        detail:
          "Mese pe rețete și produse din zonă, la gazde și locații selectate.",
      },
      {
        label: "degustări și experiențe la producători locali",
        detail:
          "Întâlniri cu producători: degustări, demonstrații și povești despre meseria lor.",
      },
      {
        label: "vizite la crame",
        detail:
          "Oprire la cramă sau podgorie, cu degustare ghidată acolo unde se potrivește traseului.",
      },
      {
        label: "experiențe tradiționale",
        detail:
          "Momente legate de tradiții locale — meșteșug, obiceiuri sau activități de gospodărie, după sezon.",
      },
      {
        label: "timp liber",
        detail:
          "Ferestre libere pe cele două zile, ca echipa să se reconecteze fără presiune de performanță.",
      },
      {
        label: "coordonare pe durata retreat-ului",
        detail:
          "Coordonare end-to-end: cazare, transferuri, activități și asistență pe tot sejurul.",
      },
    ],
    suited:
      "Companiile care vor să ofere angajaților o experiență completă de relaxare și reconectare.",
    image: SERVICE_IMAGES.retreat,
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
    text: "Timp în care angajații nu trebuie să livreze performanță. Doar să se bucure de experiență.",
  },
] as const;

export default function ServiciiB2BPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Acasă", path: "/" },
          { name: "Servicii", path: "/servicii-b2b/" },
        ])}
      />
      <JsonLd data={servicesJsonLd()} />
      <JsonLd data={faqJsonLd([...SERVICES_FAQS])} />
      <Header variant="overlay" />
      <main id="main-content" className="flex-1">
        <section className="relative flex min-h-[100svh] items-end overflow-hidden">
          <Image
            src={SERVICE_IMAGES.hero.src}
            alt={SERVICE_IMAGES.hero.alt}
            fill
            priority
            sizes="100vw"
            className="animate-hero-ken object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/25"
            aria-hidden
          />
          <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-28 sm:px-8 sm:pb-24">
            <Breadcrumbs
              tone="light"
              items={[
                { name: "Acasă", href: "/" },
                { name: "Servicii" },
              ]}
            />
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-dawn">
              Servicii
            </p>
            <h1 className="mt-4 max-w-3xl font-sans text-3xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-5xl sm:leading-[1.15] md:text-6xl">
              Retreat-uri pentru angajați. Experiențe care te scot din rutină.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              Natură, gastronomie și locuri reale din România - timp pentru oameni,
              nu încă o activitate de echipă.
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

        <section className="bg-fog py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
                  Problema
                </p>
                <h2 className="mt-3 font-sans text-2xl font-semibold leading-snug text-ink sm:text-3xl">
                  Retreat-urile tradiționale și team-building-ul clasic nu funcționează
                </h2>
                <p className="mt-5 text-base leading-relaxed text-stone sm:text-lg">
                  Cele mai multe retreat-uri corporate sunt legate de o singură locație fixă — aceeași activitate, același decor. Transportul, cazarea și programul sunt gestionate separat, consumând timp și resurse. Planificarea este stresantă.
                </p>
                <p className="mt-4 text-lg leading-relaxed text-stone sm:text-xl">
                  <span className="font-bold text-pine">38%</span> dintre
                  angajații din România au raportat stres ridicat în ziua
                  precedentă (
                  <a
                    href="https://www.gallup.com/analytics/349280/gallup-global-emotions-report.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-moss underline-offset-2 hover:underline"
                  >
                    Gallup Global Emotions
                  </a>
                  ).
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
                  Soluția
                </p>
                <h2 className="mt-3 font-sans text-2xl font-semibold leading-snug text-ink sm:text-3xl">
                  O experiență completă, flexibilă, dincolo de o singură locație
                </h2>
                <p className="mt-5 text-base leading-relaxed text-stone sm:text-lg">
                  RoHubTravel creează retreat-uri care combină cazarea rurală, gastronomia locală, natura, degustările, vizitele la producători locali, activități tradiționale și timp liber — o experiență completă și flexibilă, spre deosebire de competiția legată de o singură locație fixă.
                </p>
                <p className="mt-4 text-xl font-semibold leading-snug text-pine sm:text-2xl">
                  Nu este team-building.
                  <br />
                  Este timp pentru oameni.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-ink py-14 text-white sm:py-16">
          <div className="absolute inset-0 bg-gradient-to-b from-ink via-pine/20 to-ink" aria-hidden />
          <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dawn">
              Cum funcționează
            </p>
            <h2 className="mt-3 font-sans text-2xl font-semibold leading-snug sm:text-3xl">
              Trei pași. Noi ne ocupăm de restul.
            </h2>
            <ol className="mt-10 grid gap-6 sm:grid-cols-3">
              <li className="rounded-sm bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.16em] text-dawn">
                  01
                </p>
                <h3 className="mt-2 font-sans text-xl font-semibold">
                  Alegi experiența
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Escape 24h, Experience 36h, Retreat 48h sau un program custom
                  pentru echipa ta — minimum 10 persoane la pachetele standard.
                </p>
              </li>
              <li className="rounded-sm bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.16em] text-dawn">
                  02
                </p>
                <h3 className="mt-2 font-sans text-xl font-semibold">
                  Te preluăm și te ghidăm
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Transport organizat, cazare (unde e cazul), program și
                  coordonare pe durata retreat-ului — o singură interfață pentru
                  HR.
                </p>
              </li>
              <li className="rounded-sm bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.16em] text-dawn">
                  03
                </p>
                <h3 className="mt-2 font-sans text-xl font-semibold">
                  Descoperi România
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Natură, gastronomie, producători locali și timp liber — fără
                  presiunea de a „performa” într-un team-building clasic.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
              De ce alegem flexibilul
            </p>
            <h2 className="mt-3 font-sans text-2xl font-semibold leading-snug text-ink sm:text-3xl">
              Competiția e legată de o locație. Noi suntem flexibili.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-stone sm:text-lg">
              Cele mai multe retreat-uri corporate din România sunt oferite de locații fixe — un singur resort, un singur decor. RoHubTravel diferă prin flexibilitate: călătorim în sate, sate-muzeu, crame, mănăstiri și zone naturale din toată România.
            </p>

            <div className="mt-10 overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-stone/20">
                    <th className="pb-3 pr-6 pt-2 text-sm font-semibold text-ink sm:pr-8">Competiție</th>
                    <th className="pb-3 pr-6 pt-2 text-sm font-semibold text-ink sm:pr-8">Tip</th>
                    <th className="pb-3 pr-6 pt-2 text-sm font-semibold text-ink sm:pr-8">Locație</th>
                    <th className="pb-3 pt-2 text-sm font-semibold text-ink">Flexibilitate</th>
                  </tr>
                </thead>
                <tbody className="text-base sm:text-[15px]">
                  <tr className="border-b border-stone/15">
                    <td className="py-4 pr-6 sm:pr-8">POTCOAVA</td>
                    <td className="py-4 pr-6 text-stone sm:pr-8">Safari village, locație fixă</td>
                    <td className="py-4 pr-6 text-stone sm:pr-8">O singură locație</td>
                    <td className="py-4 text-stone">Activități presetate pe teren</td>
                  </tr>
                  <tr className="border-b border-stone/15">
                    <td className="py-4 pr-6 sm:pr-8">PORTAL VILLAGE</td>
                    <td className="py-4 pr-6 text-stone sm:pr-8">Retreat de familie, locație fixă</td>
                    <td className="py-4 pr-6 text-stone sm:pr-8">O singură locație</td>
                    <td className="py-4 text-stone">Program și locație fixe</td>
                  </tr>
                  <tr className="border-b border-stone/15">
                    <td className="py-4 pr-6 sm:pr-8">ENISALA SAFARI VILLAGE</td>
                    <td className="py-4 pr-6 text-stone sm:pr-8">Safari park, locație fixă</td>
                    <td className="py-4 pr-6 text-stone sm:pr-8">O singură locație</td>
                    <td className="py-4 text-stone">Activități presetate pe teren</td>
                  </tr>
                  <tr className="bg-pine/5">
                    <td className="py-4 pr-6 font-semibold text-pine sm:pr-8">RoHubTravel</td>
                    <td className="py-4 pr-6 font-semibold text-pine sm:pr-8">Retreat pe regiuni, itinerar custom</td>
                    <td className="py-4 pr-6 font-semibold text-pine sm:pr-8">Orice regiune din România</td>
                    <td className="py-4 font-semibold text-pine">Itinerar, locații, durate — tot custom</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="bg-fog py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="max-w-3xl text-base leading-relaxed text-stone sm:text-lg">
              La RoHubTravel credem că oamenii nu au nevoie întotdeauna de încă o
              activitate de echipă. Uneori au nevoie pur și simplu să se oprească,
              să respire și să se reconecteze cu natura, oamenii și locurile din
              România. De aceea creăm retreat-uri care combină relaxarea,
              gastronomia și experiențele locale.
            </p>
            <p className="mt-6 font-sans text-xl font-semibold leading-snug text-pine sm:text-2xl">
              Nu este team-building.
              <br />
              Este timp pentru oameni.
            </p>
          </div>
        </section>

        <section id="pachete" className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <h2 className="max-w-2xl font-sans text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-5xl sm:leading-[1.15]">
              Alege experiența potrivită pentru echipa ta
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone sm:text-lg">
              Toate pachetele sunt disponibile pentru grupuri de minimum{" "}
              <strong className="font-semibold text-ink">10 persoane</strong>.
              Pentru grupuri de peste 25 de persoane, îți recomandăm pachetul custom.
            </p>

            <div className="mt-14 space-y-20">
              {packages.map((pkg, index) => {
                const imageLeft = index % 2 === 0;
                return (
                  <article
                    key={pkg.id}
                    id={pkg.id}
                    className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14"
                  >
                    <div
                      className={`relative aspect-[4/3] overflow-hidden lg:aspect-[5/4] ${
                        imageLeft ? "lg:order-1" : "lg:order-2"
                      }`}
                    >
                      <Image
                        src={pkg.image.src}
                        alt={pkg.image.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>

                    <div className={imageLeft ? "lg:order-2" : "lg:order-1"}>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
                        {pkg.code}
                      </p>
                      <h3 className="mt-2 flex items-baseline gap-3 font-sans text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
                        {pkg.name}
                        <span className="text-lg font-medium text-moss">{pkg.price}</span>
                      </h3>
                      <p className="mt-3 max-w-xl text-xl font-medium text-ink sm:text-2xl">
                        {pkg.headline}
                      </p>
                      <p className="mt-4 max-w-xl text-base leading-relaxed text-stone sm:text-lg">
                        {pkg.blurb}
                      </p>

                      <PackageIncludes items={pkg.includes} />

                      <p className="mt-8 max-w-xl text-sm leading-relaxed text-stone sm:text-base">
                        <span className="font-semibold text-ink">
                          Potrivit pentru:
                        </span>{" "}
                        {pkg.suited}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="custom" className="bg-fog py-16 sm:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/6]">
              <Image
                src={SERVICE_IMAGES.custom.src}
                alt={SERVICE_IMAGES.custom.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">
                ROHUB CUSTOM
              </p>
              <h2 className="mt-3 font-sans text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-5xl sm:leading-[1.15]">
                YOUR ROMANIA
              </h2>
              <p className="mt-4 max-w-xl text-xl font-medium text-ink sm:text-2xl">
                O experiență creată pentru compania ta.
              </p>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-stone sm:text-lg">
                Pentru grupurile de minimum{" "}
                <strong className="font-semibold text-ink">25 de persoane</strong>
                , construim retreat-uri personalizate de 48 de ore sau mai mult.
              </p>
              <p className="mt-4 max-w-xl font-sans text-2xl font-semibold text-pine">
                De la 2.000 RON
              </p>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-stone sm:text-lg">
                Nu alegi doar o destinație. Construim împreună întreaga experiență
 - din Oltenia până în Delta Dunării.
              </p>

              <p className="mt-10 text-sm font-semibold uppercase tracking-[0.16em] text-dawn">
                Poți personaliza
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {customOptions.map((item) => (
                  <li
                    key={item}
                    className="border-l-2 border-dawn pl-4 text-stone"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-6xl px-5 sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-dawn">
              Exemple de experiențe
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {customExamples.map((item) => (
                <li
                  key={item}
                  className="border-l-2 border-moss bg-white/60 px-4 py-3 text-sm leading-relaxed text-ink"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-label="Locuri din România" className="bg-ink">
          <ul className="grid grid-cols-2 lg:grid-cols-4">
            {SERVICE_IMAGES.gallery.map((image) => (
              <li key={image.src} className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-700 hover:scale-105"
                />
              </li>
            ))}
          </ul>
        </section>

        <section className="relative overflow-hidden py-16 text-white sm:py-24">
          <Image
            src={SERVICE_IMAGES.why.src}
            alt={SERVICE_IMAGES.why.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-pine/88" aria-hidden />
          <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dawn">
              De ce RoHubTravel?
            </p>
            <h2 className="mt-3 max-w-2xl font-sans text-3xl font-semibold tracking-[-0.02em] sm:text-5xl sm:leading-[1.15]">
              Nu vizitezi România. O trăiești.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              Transformăm o simplă excursie într-o experiență care îi apropie pe
              oameni de România - de la mănăstiri și sate la deltă și munte.
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
              RoHubTravel - Discover Romania. Experience Romania.
            </p>
          </div>
        </section>

        <FaqSection
          title="Întrebări despre retreat-uri corporate"
          faqs={SERVICES_FAQS}
        />

        <Contact defaultDestination="Retreat Servicii" />
      </main>
      <Footer />
    </>
  );
}
