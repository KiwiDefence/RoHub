import Link from "next/link";
import { regions } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-extrabold tracking-tight">
            Rohub
          </p>
          <p className="mt-2 max-w-sm text-sm text-white/70">
            Nu vizitezi România. O trăiești. Circuite și experiențe autentice
            pe regiuni.
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
            Rohub
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <Link href="/vacante/" className="hover:text-white">
                Toate vacanțele
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
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-white/50 sm:px-8">
          © {year} Rohub. Toate drepturile rezervate. Fotografii: Wikimedia
          Commons (România).
        </p>
      </div>
    </footer>
  );
}
