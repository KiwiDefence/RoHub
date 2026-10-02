# Rohub

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

Pentru a simula path-ul de pe GitHub Pages (ex. `/Rohub`):

```bash
# PowerShell
$env:NEXT_PUBLIC_BASE_PATH="/Rohub"; npm run build
```

## Deploy pe GitHub Pages

1. Creează un repo pe GitHub și împinge codul.
2. În **Settings → Pages**, setează Source pe **GitHub Actions**.
3. Workflow-ul `.github/workflows/deploy.yml` construiește și publică automat la fiecare push pe `main` / `master`.

Site-ul va fi la: `https://<user>.github.io/<repo>/`

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
