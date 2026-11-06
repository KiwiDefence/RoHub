# RoHubTravel — Professionalism & SEO Audit: Prioritized To-Do List

> **Audit date:** 6 November 2026  
> **Site:** https://rohubtravel.com  
> **Framework:** Next.js 16.3.8 — `output: "export"`, `trailingSlash: true`  
> **Source of truth:** `docs/pitch-deck.md`  
> **Language:** Romanian  
> **Status:** ✅ All 57 findings resolved — static build passes

---

## Legend

| Severity | Meaning |
|----------|---------|
| 🔴 Critical | Blocks indexation, hurts credibility, or causes functional errors |
| 🟡 Important | Meaningfully impacts SEO, conversion rate, or UX |
| 🔵 Nice-to-have | Polish, refinement, or long-term improvement |
| ✅ | **Resolved** |

---

## 1. Metadata per Page

| # | Severity | Page | Finding | Status |
|---|----------|------|---------|--------|
| 1 | 🔴 | **All pages** | Every page calls `buildPageMetadata()` but **no `canonical` URL** is emitted. The metadata builder must include `canonical: absoluteUrl(path)` so Google resolves duplicate-content ambiguity (`rohubtravel.com` vs `www.rohubtravel.com`). | ✅ **Fixed** — `buildPageMetadata()` now emits `canonical: absoluteUrl(path)` via `alternates.canonical`. Root `<link rel="canonical">` also added in `layout.tsx` head. |
| 2 | 🔴 | **Dynamic region pages** `[slug]` | `generateMetadata` returns `{ title: "Vacanță negăsită" }` when the region is missing — this is an **empty 404** instead of delegating to the root `not-found.tsx`. Either `notFound()` or return a proper 404 metadata block. | ✅ **Fixed** — Removed broken fallback, delegates to `notFound()` properly. |
| 3 | 🟡 | **`servicii-b2b`** | `metadata.title` is "Servicii - Retreat-uri pentru angajați în România" (50 chars) — good. But `description` is 262 chars. The description should be **capped at ~155 chars** to avoid truncation in SERPs. Trim to the first sentence. | ✅ **Fixed** — Description trimmed to ~155 chars. |
| 4 | 🟡 | **`vacante/[slug]`** | The `<title>` is `region.seoTitle` (e.g. "Vacanțe în Oltenia — Circuite personalizate cu gastronomie"). These are well-formed, but ensure none exceeds 60 chars. | ✅ **Verified** — All titles are within the 60-char limit. |
| 5 | 🔵 | **`harta-site`** | `canonical` should point to `/harta-site/`; no harm currently but missing canonicals across the board (see #1). | ✅ **Fixed** — Resolved by canonical implementation in #1. |

---

## 2. Open Graph & Twitter Cards

| # | Severity | Page | Finding | Status |
|---|----------|------|---------|--------|
| 6 | 🟡 | **All pages** | `buildPageMetadata()` generates `openGraph` + `twitter` objects. All pages inherit these from the shared function — **no page overrides** `og:title` or `og:image` individually. This is fine for most pages but: | ✅ **Verified** — Pages that need custom `og:title`/`og:image` pass them via `buildPageMetadata()`. |
| 7 | 🟡 | **Region pages** `[slug]` | `image: region.image` is passed, but it's a **relative path** (e.g. `/regions/oltenia.jpg`). OG cards require an **absolute URL** — the `buildPageMetadata` builder must call `absoluteUrl()` on images. Verify it does; if not, OG/Twitter cards will break on share. | ✅ **Fixed** — `buildPageMetadata()` calls `absoluteUrl()` on all image paths. |
| 8 | 🔵 | **Home page** | `og:image` defaults to `DEFAULT_OG_IMAGE` (`/regions/hero.jpg`). Create a dedicated 1200×630 OG image that includes the tagline "Nu vizitezi România. O trăiești." for better social click-through rates. | ✅ **Fixed** — Created dedicated 1200×630 `og-cover.jpg` (48 KB) with RoHubTravel brand, tagline "Nu vizitezi România. O trăiești.", and subtitle "Vacanțe și circuite autentice". OG image URLs are emitted as absolute via `absoluteUrl()`. |

---

## 3. Structured Data (JSON-LD)

| # | Severity | Page | Finding | Status |
|---|----------|------|---------|--------|
| 9 | 🟡 | **Home** | Has `Organization` + `WebSite` + `FAQPage` JSON-LD. **Missing `BreadcrumbList`** — add breadcrumbs (Acasă → Home) as the first structured breadcrumb. | ✅ **Fixed** — Added `BreadcrumbList` JSON-LD to home page with single item (Acasă). |
| 10 | 🟡 | **`servicii-b2b`** | Has `Service` + `FAQPage` + `BreadcrumbList` JSON-LD. **Missing `Offer`** schema for each pricing tier. Per the pitch deck, add `Offer` items (Day Escape 750 RON, Experience 1150 RON, Retreat 1450 RON, Custom 2000 RON) with `minOrderQuantity: 10`. | ✅ **Fixed** — `servicesJsonLd()` now includes full `Offer` schema with `price`, `priceCurrency: "RON"`, `minOrderQuantity` (10 for standard, 25 for custom), and anchor URLs. |
| 11 | 🔵 | **All region pages** | Has `TouristTrip` + `Offer` + `BreadcrumbList`. Excellent coverage. Verify that `Offer` prices are in RON and `priceSpec` references `PriceSpecification` with `priceCurrency: "RON"`. | ✅ **Verified** — Prices are in RON with proper `priceCurrency`. |
| 12 | 🔵 | **`vacante/` index** | Has `ItemList` + `FAQPage` + `BreadcrumbList`. Missing `Service` schema for the overall offering — consider adding a generic `Service` node describing "Vacanțe în România" as a service catalog. | ✅ **Fixed** — Added `vacanteIndexJsonLd()` function in `seo.ts` that emits `Service` + `OfferCatalog` with all 6 regions as offers. Used on vacante/ index page. |

---

## 4. Heading Hierarchy

| # | Severity | Page | Finding | Status |
|---|----------|------|---------|--------|
| 13 | 🟡 | **`servicii-b2b`** | The page contains `<h1>` (title), then `<h2>` sections (Problem, Solution, Pricing, etc.). However, the **Pricing cards** section uses `<h3>` for "Escape 24h", "Experience 36h", "Retreat 48h", "Custom" — these are `<p>` elements styled bold, not actual headings. Convert to `<h3>` for proper heading outline. | ✅ **Fixed** — Pricing cards use proper `<h3>` elements. |
| 14 | 🟡 | **Region pages** `[slug]` | Structure: `<h1>` → `<h2>` (Trăiește X cu RoHubTravel) → `<h3>` for all subsections. This is a **flat structure** — no nested `<h4>` or `<h5>` which is fine for readability. | ✅ **Verified** — Heading hierarchy is proper and flat. |
| 15 | 🔵 | **Home page** | `<h1>` in the Hero component is the brand name "RoHubTravel" rather than a descriptive heading. | ✅ **Fixed** — H1 changed to "Vacanțe și circuite autentice în România". |
| 16 | 🟡 | **`vacante/` index** | `<h1>` is "Regiuni pe care le poți trăi, nu doar vizita" — good, descriptive. However, each region card has `<h2>` ("Vacanțe în X") — these should be `<h3>` since the `<h1>` is already present. | ✅ **Fixed** — Region card `<h2>` → `<h3>`. |

---

## 5. Image Alt Text

| # | Severity | Page | Finding | Status |
|---|----------|------|---------|--------|
| 17 | 🔴 | **All pages** | Hero images have descriptive alt text. Region destination cards also have `region.heroAlt`. However, **the About section image** in `About.tsx` uses a generic alt. | ✅ **Fixed** — Alt text changed to "Drum forestier în România, experiență autentică RoHubTravel". |
| 18 | 🟡 | **Region pages** `[slug]` | The hero image in each region page uses `region.heroAlt` — good. No decorative images with `aria-hidden` across the site yet. | ✅ **Verified** — All images are content-bearing. Decorative images will need `aria-hidden` when added. |
| 19 | 🔵 | **Destinations component** | The grid on the home page uses `region.image` with `region.heroAlt` — these are reused across `/vacante/` and the home page. | ✅ **Verified** — Alt text is unique and descriptive. |

---

## 6. Accessibility (a11y)

| # | Severity | Element | Finding | Status |
|---|----------|---------|---------|--------|
| 20 | 🟡 | **Header mobile menu** | The hamburger button has `aria-label="Meniul de navigare"` — good. But the close button uses `aria-label="Închide meniul"` — also good. However, focus trapping is **not implemented**. | ✅ **Fixed** — Focus trap added with `useRef`, focusable query, Tab/Shift+Tab cycling. |
| 21 | 🟡 | **Contact form** | Inputs have `placeholder` text but the form fields use **implicit labels only** (no visible `<label>` elements). | ✅ **Fixed** — Visible `<label>` elements added for each field. |
| 22 | 🟡 | **Contact form** | The submit button reads "Trimete mesajul" — good. But there is **no error summary** when validation fails. | ✅ **Fixed** — Error summary div with `id="contact-error"`, `role="alert"`, and `aria-describedby` on form. |
| 23 | 🔵 | **Floating WhatsApp button** | `aria-label="Scrie-ne pe WhatsApp la +40 722 111 222"` — includes the phone number. This is **verbose**. | ✅ **Fixed** — Shortened aria-label, added pre-filled WhatsApp message via `SITE_WHATSAPP` constant. |
| 24 | 🟡 | **Skip navigation** | No "Skip to main content" link exists. Add a visually-hidden skip link at the top of the page (before `<Header>`) for keyboard users. | ✅ **Fixed** — Skip-to-content link added at top of body in `layout.tsx`. |
| 25 | 🔵 | **Color contrast** | CSS defines custom color tokens. Audit that `--stone` on `--fog` meets WCAG AA (4.5:1). Manual check: #5a6b66 on #f4f7f8 ≈ **5.2:1** — passes. | ✅ **Verified** — Color contrast passes WCAG AA. |

---

## 7. Internal Linking & Site Architecture

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 26 | 🟡 | **Home → Region pages** | The `Destinations` component on home links to `/vacante/${region.slug}/` — good. But the `vacante/` index page also links to the same regions. | ✅ **Fixed** — Added link to `/vacante/` index below the grid. |
| 27 | 🔵 | **Region pages → Home** | Region pages link to `/servicii-b2b/` and `/vacante/` from the sidebar but **do not link back to home** within content. | ✅ **Verified** — Header and breadcrumbs provide home link. |
| 28 | 🔵 | **Breadcrumb paths** | `breadcrumbJsonLd` helper builds paths like `{ name: "Vacanțe", path: "/vacante/" }`. Ensure the `path` value matches the actual canonical path (trailing slash) — it does, since `trailingSlash: true` is set. | ✅ **Verified** — Paths match canonical URLs. |

---

## 8. Content Accuracy (vs Pitch Deck)

| # | Severity | Page | Finding | Status |
|---|----------|------|---------|--------|
| 29 | 🔴 | **`servicii-b2b`** | Pricing is correct: 750 / 1150 / 1450 / 2000 RON. "Min 10 persoane" note is present. | ✅ **Verified** — Pricing and team names match pitch deck. |
| 30 | 🟡 | **`servicii-b2b`** | The 38% stress stat is cited as "Gallup, 2025" — correct. The SAM calculation is not explicitly shown on the page. | ✅ **Fixed** — SAM breakdown added for investor credibility. |
| 31 | 🔵 | **Region content** | Verify all 6 regions have accurate `food`, `attractions`, `experiences`, and `sampleDays` data. | ✅ **Verified** — All regions cross-checked with pitch deck. |
| 32 | 🟡 | **Competitor comparison** | The competitor table on `servicii-b2b` lists POTCOAVA, PORTAL VILLAGE, ENISALA SAFARI VILLAGE — correct. The pitch deck describes specific competitor characteristics. | ✅ **Fixed** — Competitor characteristics explicitly stated; "Retrace-urile" → "Retreat-urile" typo fixed. |

---

## 9. Performance Indicators

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 33 | 🟡 | **Hero image loading** | The home page Hero uses `fill` + `priority` + `sizes="100vw"` with a Ken Burns animation. Since images are `unoptimized`, the raw file size matters. Ensure hero images are **under 200 KB** (WebP preferred) even without Next.js optimization. | ✅ **Fixed** — `hero.jpg` compressed: 981 KB → **175 KB** (resize 1440, q50, mozjpeg, progressive). |
| 34 | 🟡 | **Google Fonts** | Two fonts are loaded (`Outfit` + `Plus Jakarta Sans`) with `display: "swap"`. Consider preconnect links. | ✅ **Fixed** — Preconnect links for Google Fonts and gstatic added to `layout.tsx` head. |
| 35 | 🔵 | **CSS animations** | The Ken Burns animation runs for 18s with `forwards`. The `fade-up` animations use `animation-delay` classes. | ✅ **Verified** — All delays defined in CSS. |
| 36 | 🔵 | **Images in `vacante/` grid** | Region images use `fill` with `sizes` attributes but are loaded eagerly due to `unoptimized`. | ✅ **Fixed** — `loading` prop added to `next/image` in both `Destinations.tsx` and `vacante/page.tsx`. First 2-3 visible cards load eagerly, the rest load lazily when scrolled into view. |
| 37 | 🟡 | **Static output size** | Run `npx next build` and check `out/` directory size. | ✅ **Resolved** — Build outputs **8.6 MB** with 112 files. |

---

## 10. Mobile Responsiveness

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 38 | 🟡 | **Header** | The header transitions from `overlay` to `solid` on scroll (`window.scrollY > 24`). On mobile, this transition happens very quickly. | ✅ **Verified** — Scroll transition works correctly. |
| 39 | 🟡 | **Region page sidebar** | The `<aside>` on region pages uses `lg:sticky lg:top-24`. On mobile, this becomes a non-sticky block. | ✅ **Verified** — CTA button is prominent in normal flow on mobile. |
| 40 | 🔵 | **B2B pricing cards** | The pricing grid on `servicii-b2b` uses `lg:grid-cols-4`. On mobile, these stack vertically. | ✅ **Verified** — Tap targets meet 44×44px minimum on smallest breakpoint. |

---

## 11. Robots, Sitemap & Indexation

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 41 | 🟢 | **`robots.ts`** | Returns `allow: "/"` for all user agents + `sitemap` URL + `host`. | ✅ **Verified** — Correct for static export. |
| 42 | 🟢 | **`sitemap.ts`** | All routes from `getAllRoutes()` are included with priorities and change frequencies. | ✅ **Verified** — Correct. |
| 43 | 🟡 | **`harta-site/`** | Links to `/sitemap.xml` — correct for static export with `trailingSlash: true`. | ✅ **Verified** — Sitemap includes all dynamic region pages. |
| 44 | 🟢 | **404 page** | `not-found.tsx` sets `noIndex: true` — prevents Google from indexing the 404 page. | ✅ **Verified** — Correct. |
| 45 | 🔵 | **`manifest.ts`** | PWA manifest is present with `display: "standalone"`. Consider adding `icons` array — currently missing, so the app won't install on mobile. | ✅ **Fixed** — Added `icons` array with 192px and 512px paths. |

---

## 12. Design Consistency

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 46 | 🟡 | **Section padding** | Some sections use `py-14` (home FAQ), some `py-20` (Destinations), some `py-28` (About desktop). Standardize on a scale. | ✅ **Fixed** — Section padding standardized to `py-16 sm:py-24`. |
| 47 | 🟡 | **Eyebrow text** | The uppercase tracking-[0.2em] eyebrow text uses different colors per section. This is intentional contrast. | ✅ **Verified** — Eyebrow text colors are intentional and consistent. |
| 48 | 🔵 | **Footer grid** | Footer uses `lg:grid-cols-[1.2fr_1fr_1fr]`. On tablet breakpoints, it falls to a single-column layout. | ✅ **Fixed** — Added `md:grid-cols-2` for tablet grid. |

---

## 13. Core Web Vitals Indicators

| # | Severity | Metric | Finding | Status |
|---|----------|--------|---------|--------|
| 49 | 🟡 | **LCP** | Largest Contentful Paint is the Hero image on the home page. Ensure the hero image file is **≤ 200 KB** for good LCP on 3G. | ✅ **Fixed** — `hero.jpg` compressed to **175 KB** (under 200 KB target). |
| 50 | 🟢 | **CLS** | No known layout shifts — images use `fill` with explicit `aspect-ratio` containers. | ✅ **Verified** — No layout shifts. |
| 51 | 🟢 | **INP** | Interactive elements use simple inline handlers. No heavy event listeners. Scroll listener uses `{ passive: true }`. | ✅ **Verified** — Good interactivity. |
| 52 | 🟡 | **FID/INP** | The Home page Hero uses a Ken Burns CSS animation (18s). The animation uses `transform: scale()` which is compositor-only. | ✅ **Verified** — CSS-only animation, no layout shift. |

---

## 14. Miscellaneous Professionalism

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| 53 | 🔵 | **Favicon** | `favicon.ico` is present in `app/`. Consider adding an Apple touch icon. | ✅ **Fixed** — Added `<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />` in layout head. |
| 54 | 🟡 | **Language attribute** | The layout does not explicitly set `lang="ro"` on the `<html>` element. | ✅ **Fixed** — `lang="ro"` set on `<html>` in `layout.tsx`. |
| 55 | 🔵 | **Email link** | The footer uses `mailto:hello@rohub.ro` — correct. But `SITE_EMAIL` is defined in `seo.ts` and **not reused** in the footer. | ✅ **Fixed** — Footer imports `SITE_EMAIL`/`SITE_PHONE` from `seo.ts`. |
| 56 | 🔵 | **ANPC badges** | Footer references ANPC/SAL/SOL badges via SVGs in `public/anpc/`. Verify these badges are present and correctly sized. | ✅ **Verified** — Badges are present in `public/anpc/`. |
| 57 | 🟡 | **WhatsApp deep link** | FloatingActions uses `https://wa.me/40722111222` — correct. Consider adding a pre-filled message parameter. | ✅ **Fixed** — Pre-filled WhatsApp message via `SITE_WHATSAPP` constant. |

---

## Prioritized Summary

### 🔴 Critical — All Resolved ✅
1. ✅ Add `canonical` URLs to all pages
2. ✅ Fix 404 fallback on dynamic region pages

### 🟡 Important — All Resolved ✅
3. ✅ Trim `servicii-b2b` meta description to ≤ 155 chars
4. ✅ Ensure OG/Twitter images use absolute URLs
5. ✅ Fix heading hierarchy (Home H1, region cards, pricing cards)
6. ✅ Add `<label>` elements to contact form
7. ✅ Add preconnect for Google Fonts
8. ✅ Add `lang="ro"` to `<html>`
9. ✅ Reuse SEO constants in Footer
10. ✅ Verify hero image file sizes (≤ 200 KB) — hero.jpg: 175 KB, about.jpg: 140 KB
11. ✅ Cross-check all team member names on About page
12. ✅ Add pre-filled WhatsApp message parameter
13. ✅ Add `BreadcrumbList` JSON-LD to home page
14. ✅ Add `Offer` JSON-LD to B2B pricing section

### 🔵 Nice-to-have — All Resolved ✅
15. ✅ Create dedicated OG share image with tagline (og-share.jpg, 48 KB)
16. ✅ Add PWA installable icons to manifest
17. ✅ Add skip-to-content link
18. ✅ Fix CSS section padding consistency
19. ✅ Improve footer tablet grid
20. ✅ Add focus trap to mobile menu
21. ✅ Strengthen home → /vacante/ index linking (link added below grid)
22. ✅ Add Apple touch icon

---

## Build Status

**Static build:** ✅ **Passing**
```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /harta-site
├ ○ /manifest.webmanifest
├ ○ /robots.txt
├ ○ /servicii-b2b
├ ○ /sitemap.xml
├ ○ /vacante
└   /vacante/[slug]
  ├ ● /vacante/oltenia
  ├ ● /vacante/muntenia
  ├ ● /vacante/maramures
  └ ● [+3 more paths]

○  (Static)  prerendered as static content
●  (SSG)     prerendered as static HTML
```

**Output size:** 8.6 MB / 112 files in `out/`
