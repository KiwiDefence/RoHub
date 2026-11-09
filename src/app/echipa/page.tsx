import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { teamMembers } from "@/lib/team";
import {
  SITE_NAME,
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
} from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Echipa RoHubTravel",
  description:
    "Cunoaște echipa RoHubTravel: marketing, tehnologie, vânzări, administrație și operațiuni — oamenii care construiesc vacanțe autentice în România.",
  path: "/echipa/",
  keywords: [
    "echipa RoHubTravel",
    "agenție turism Brașov echipă",
    "Roxana",
    "Radu Cătălin Petre",
    "Larisa Brătianu",
    "Mari Chiper",
    "Purice Adrian Sebastian",
  ],
});

export default function EchipaPage() {
  const peopleJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `Echipa ${SITE_NAME}`,
    url: absoluteUrl("/echipa/"),
    mainEntity: {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: SITE_NAME,
      employee: teamMembers.map((member) => ({
        "@type": "Person",
        name: member.name,
        jobTitle: member.role,
        image: absoluteUrl(member.image),
      })),
    },
  };

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Acasă", path: "/" },
          { name: "Echipa", path: "/echipa/" },
        ])}
      />
      <JsonLd data={peopleJsonLd} />
      <Header variant="solid" />
      <main id="main-content" className="flex-1 bg-fog pt-24">
        <section className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
          <Breadcrumbs
            items={[
              { name: "Acasă", href: "/" },
              { name: "Echipa" },
            ]}
          />
          <Reveal>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-moss">
              Echipa
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-ink sm:text-6xl">
              Oamenii din spatele RoHubTravel
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone sm:text-lg">
              Construim vacanțe și retreat-uri pe locuri reale din România —
              cu marketing, tehnologie, vânzări, administrație și operațiuni pe
              teren, din Brașov.
            </p>
          </Reveal>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
          <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-8">
            {teamMembers.map((member, i) => (
              <Reveal
                key={member.name}
                as="li"
                delay={i * 70}
                className="text-center"
              >
                <div className="relative mx-auto aspect-[4/5] w-full max-w-[11.5rem] overflow-hidden rounded-[1.35rem] bg-mist shadow-sm ring-1 ring-stone/10 sm:max-w-none">
                  <Image
                    src={member.image}
                    alt={member.imageAlt}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
                    className="object-cover"
                    style={{ objectPosition: member.objectPosition }}
                  />
                </div>
                <h2 className="mt-4 font-display text-base font-bold leading-snug text-pine sm:text-lg">
                  {member.name}
                </h2>
                <p className="mt-1 text-sm leading-snug text-stone">
                  {member.role}
                </p>
              </Reveal>
            ))}
          </ul>
        </section>

        <Contact defaultDestination="Contact echipă" />
      </main>
      <Footer />
    </>
  );
}
