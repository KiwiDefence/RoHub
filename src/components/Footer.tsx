export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-ink text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <p className="font-display text-2xl font-extrabold tracking-tight">
            Rohub
          </p>
          <p className="mt-2 max-w-sm text-sm text-white/70">
            Agenție de turism. Călătorii clare, oameni aproape.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-white/70">
          <a href="#destinatii" className="hover:text-white">
            Destinații
          </a>
          <a href="#despre" className="hover:text-white">
            Despre
          </a>
          <a href="#contact" className="hover:text-white">
            Contact
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-white/50 sm:px-8">
          © {year} Rohub. Toate drepturile rezervate. Fotografii via Unsplash.
        </p>
      </div>
    </footer>
  );
}
