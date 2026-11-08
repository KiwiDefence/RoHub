/**
 * Generates printable QR PNGs for Piticot stations.
 * Output is private (not in /public) — print these; do not put them on the site.
 *
 * Usage: npm run piticot:qr
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "private", "piticot-qr");

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://rohubtravel.com").replace(
  /\/$/,
  "",
);

const stations = [
  { id: "plecare", title: "Punct de plecare", order: 1 },
  { id: "crama", title: "Degustare la crama", order: 2 },
  { id: "comoara", title: "Vanatoare de comori", order: 3 },
  { id: "casa-scriitorului", title: "Casa scriitorului", order: 4 },
  { id: "masa-locala", title: "Masa la gazda locala", order: 5 },
  { id: "final", title: "Finalul drumului", order: 6 },
];

fs.mkdirSync(outDir, { recursive: true });

const manifest = [];

for (const station of stations) {
  // Custom scheme → Xiaomi/Google Camera open the app directly when installed.
  // HTTPS /go/ is the website bridge (app check, then site) for browsers / App Links.
  const appUrl = `rohub://piticot/scan/${station.id}/`;
  const webUrl = `${SITE}/inovatie/piticot/go/${station.id}/`;
  const file = `${String(station.order).padStart(2, "0")}-${station.id}.png`;
  const webFile = `${String(station.order).padStart(2, "0")}-${station.id}-web.png`;
  const dest = path.join(outDir, file);
  const webDest = path.join(outDir, webFile);

  await QRCode.toFile(dest, appUrl, {
    type: "png",
    width: 1024,
    margin: 2,
    errorCorrectionLevel: "H",
    color: { dark: "#0f1f1a", light: "#ffffff" },
  });
  await QRCode.toFile(webDest, webUrl, {
    type: "png",
    width: 1024,
    margin: 2,
    errorCorrectionLevel: "H",
    color: { dark: "#0f1f1a", light: "#ffffff" },
  });

  manifest.push({ ...station, file, url: appUrl, webFile, webUrl });
  console.log("wrote", file, "→", appUrl);
  console.log("wrote", webFile, "→", webUrl);
}

fs.writeFileSync(
  path.join(outDir, "manifest.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), site: SITE, stations: manifest }, null, 2),
);

fs.writeFileSync(
  path.join(outDir, "README.md"),
  `# Piticot QR — print pack (privat)

Aceste PNG-uri **nu** sunt pe site. Le printezi și le lipești la stații.

## Care fișier tipăresc?

- **\`0N-id.png\` (fără \`-web\`)** — pentru demo cu aplicația instalată.
  Conține \`rohub://…\`. Camera Xiaomi / Google deschide **direct aplicația**,
  nu un link de site.
- **\`0N-id-web.png\`** — fallback pe site (\`/go/\`: verifică app, apoi website).
  Folosește-le dacă vrei scan fără app.

## Fișiere

${manifest
  .map(
    (s) =>
      `- \`${s.file}\` — ${s.title} (app)\n  \`${s.url}\`\n- \`${s.webFile}\` — ${s.title} (site)\n  \`${s.webUrl}\``,
  )
  .join("\n")}

## Print

- Minim ~5×5 cm pe etichetă, contrast bun.
- Nu publica folderul \`private/\`.
- Regenerare: \`npm run piticot:qr\`
`,
);

console.log("\nDone →", outDir);
