# RoHubTravel

Agenție de turism — site static Next.js, pregătit pentru **GitHub Pages**.

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

## Securitate

- Export static (fără server Node în producție)
- Content-Security-Policy (meta)
- Formular de contact cu validare + sanitizare (mailto, fără backend)
- Link-uri externe cu `rel` sigur unde e cazul
- `X-Content-Type-Options: nosniff`, `Referrer-Policy`
- Imagini doar de pe `images.unsplash.com` (allowlist în config)

## Stack

- Next.js 16 (App Router, `output: "export"`)
- React 19
- Tailwind CSS 4
- TypeScript
