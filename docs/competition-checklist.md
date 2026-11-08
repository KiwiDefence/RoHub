# RoHubTravel — Competition checklist

> Living checklist for a competition-ready static site.  
> Site: https://rohubtravel.com · Stack: Next.js static export · Language: Romanian

## Locked contact block

| Field | Value |
|-------|--------|
| Phone / WhatsApp | +40 787 346 322 (`wa.me/40787346322`) |
| Email | contact@rohubtravel.com |
| Address | Brașov, România (city only — no invented street/CUI) |
| Tagline | Nu vizitezi România. O trăiești. |

## Brand

- [x] Original hub/compass mark (`public/brand/rohub-mark.svg` + `BrandMark` component)
- [x] PWA icons 192 / 512 + apple-icon / icon.png
- [x] Mark in Header, Footer, Hero
- [x] JsonLd logo points at brand SVG

## SEO & technical

- [x] `metadataBase` set to site URL
- [x] Per-page canonical via `buildPageMetadata` (no hard-coded homepage canonical in layout)
- [x] Organization + WebSite JSON-LD in root layout
- [x] Default OG = `/regions/og-share.jpg` (1200×630 class)
- [x] `manifest.webmanifest` path + icons present
- [x] `id="main-content"` on all page mains (skip link works)
- [x] Privacy + terms routes in sitemap (`routes.ts`)
- [x] Address/geo = Brașov; Romanian-only `availableLanguage`
- [x] Dead analytics-in-`<style>` removed

## Tech innovation (pitch demo)

- [x] `/inovatie/` hub + Piticot gamified board + Mystery Box booking/clues (static, localStorage)

## Content & conversion

- [x] Hero: brand + tagline + CTA pair (vacanță / B2B)
- [x] Destination cards show blurbs
- [x] Dedicated `/echipa/` page with real photos + Purice Adrian Sebastian
- [x] B2B: how-it-works instead of public TAM/SAM/SOM (investor numbers stay in `docs/pitch-deck.md` only)
- [x] Gallup stress claim linked to source
- [x] Package prices from pitch deck (750 / 1150 / 1450 / 2000 RON; min. 10 / custom 25)

## Trust & legal

- [x] `/politica-de-confidentialitate/`
- [x] `/termeni-si-conditii/`
- [x] Footer links + ANPC SAL/SOL
- [x] Real phone/email/city everywhere (Contact, FAQs, schema)

## Photos

- [x] Wikimedia Commons sources with per-file attribution — see [photo-attribution.md](./photo-attribution.md)
- [x] Alts match actual landmarks (Horezu, Peleș, Săpânța, Sibiu, Voroneț, Delta)
- [x] Region JPEGs compressed for static export
- [x] Starter Next/Vercel SVGs removed from `public/`

## Deck-only (do not put on public site)

- TAM / SAM / SOM investor cards
- Ask for mentoring-as-fundraising narrative (OK in pitch PDF, not as website CTA)
- Fake testimonials / invented CUI / ANAT until real

## Pre-submit smoke tests

```bash
npm run build
```

- [x] `out/icons/icon-192x192.png` and `512` exist
- [x] Home, `/vacante/oltenia/`, `/servicii-b2b/`, privacy, terms render
- [x] WhatsApp FAB opens chat to +40 787 346 322
- [x] No “722 111 222” / `hello@rohub.ro` / București-as-HQ leftovers
- [x] View-source: Organization JSON-LD + no homepage-only canonical on inner pages (`/vacante/oltenia/` canonical verified)

## Status

**Implementation pass:** 7 November 2026 — polish plan applied; `npm run build` green. Ready for review / deploy.
