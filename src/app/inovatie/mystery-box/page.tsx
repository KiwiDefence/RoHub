import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MysteryBoxApp } from "@/components/mystery-box/MysteryBoxApp";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Mystery Box - vacanță cu destinație secretă",
  description:
    "Mystery Box RoHubTravel: rezervă o vacanță pe temă (Drumul Vinului, Capitale & povești, Delta) fără să știi destinația — indicii progresive până aproape de plecare.",
  path: "/inovatie/mystery-box/",
  keywords: [
    "Mystery Box vacanță",
    "destinație secretă România",
    "Drumul Vinului mystery",
    "vacanță surpriză",
    "RoHubTravel",
  ],
});

export default function MysteryBoxPage() {
  return (
    <>
      <Header variant="solid" />
      <main id="main-content">
        <div className="border-b border-stone/15 bg-fog">
          <div className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
            <Breadcrumbs
              items={[
                { name: "Acasă", href: "/" },
                { name: "Inovație", href: "/inovatie/" },
                { name: "Mystery Box" },
              ]}
            />
          </div>
        </div>

        <section className="bg-ink text-white">
          <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dawn">
              Experiență interactivă
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Mystery Box
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/80">
              Book fără destinație. Alegi tema, primești indicii, afli unde
              pleci abia când e timpul să împachetezi.
            </p>
            <Link
              href="/inovatie/"
              className="mt-6 inline-flex text-sm font-medium text-white/70 underline-offset-4 hover:text-white hover:underline"
            >
              ← Inovație
            </Link>
          </div>
        </section>

        <section className="bg-fog py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <MysteryBoxApp />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
