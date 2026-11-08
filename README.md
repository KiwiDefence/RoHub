# RoHubTravel

Agenție de turism — site static Next.js, pregătit pentru **GitHub Pages** / `rohubtravel.com`.

> Descoperă, Trăiește, SIMTE România.

## Dezvoltare locală

```bash
npm install
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000).

## Build static

```bash
npm run build
```

Output-ul apare în folderul `out/` (HTML/CSS/JS static).

## Deploy pe GitHub Pages + domeniu

1. În **Settings → Pages**, Source: **GitHub Actions**, Custom domain: `rohubtravel.com`
2. Workflow-ul construiește **fără** `basePath` (domeniul servește din root)
3. `public/CNAME` conține `rohubtravel.com`

Site live: [https://rohubtravel.com](https://rohubtravel.com)

## Contact (sursă unică: `src/lib/seo.ts`)

- Email: contact@rohubtravel.com
- Telefon / WhatsApp: +40 787 346 322
- Sediu: Brașov, România

## Documentație

- [docs/competition-checklist.md](docs/competition-checklist.md) — checklist competiție
- [docs/photo-attribution.md](docs/photo-attribution.md) — licențe fotografii Wikimedia Commons
- [docs/pitch-deck.md](docs/pitch-deck.md) — pitch (inclusiv cifre investitori — doar în deck)

## Stack

- Next.js 16 (App Router, `output: "export"`, `trailingSlash: true`)
- React 19
- Tailwind CSS 4
- TypeScript
- Imagini locale în `public/regions/` (`images.unoptimized: true` pentru export static)

## Note

- Formularul de contact deschide `mailto:` (fără backend).
- Nu rulăm analitice terțe / cookie-uri de marketing pe site.
- Marca vizuală (hub/compass) este originală RoHubTravel.
