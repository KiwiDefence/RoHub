import type { BookingTraveler } from "@/lib/travel";

type InvoiceInput = {
  orderId: string;
  travelTitle: string;
  startsOn: string;
  endsOn: string;
  days: number;
  guests: number;
  unitPriceRon: number;
  currency: string;
  totalRon: number;
  travelers: BookingTraveler[];
  customerName: string;
  customerEmail?: string;
  paidAt?: string;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDateRo(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (!Number.isFinite(d.getTime())) return iso;
  return d.toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Builds a simple HTML invoice and triggers a browser download. */
export function downloadBookingInvoice(input: InvoiceInput): void {
  const paidLabel = input.paidAt
    ? formatDateRo(input.paidAt.slice(0, 10))
    : formatDateRo(new Date().toISOString().slice(0, 10));
  const rows = input.travelers
    .map(
      (t, i) =>
        `<tr><td>${i + 1}</td><td>${escapeHtml(t.name)}</td><td>${escapeHtml(t.phone)}</td></tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="utf-8" />
<title>Factură ${escapeHtml(input.orderId)} · RoHubTravel</title>
<style>
  body { font-family: Georgia, "Times New Roman", serif; color: #14241e; margin: 40px; }
  h1 { font-size: 28px; margin: 0 0 4px; }
  .muted { color: #5c6b64; font-size: 14px; }
  .code { display: inline-block; margin: 16px 0; padding: 12px 18px; background: #e8f0ec; font-size: 28px; font-weight: 700; letter-spacing: 0.08em; }
  table { width: 100%; border-collapse: collapse; margin-top: 24px; }
  th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #d5ddd8; font-size: 14px; }
  th { font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: #5c6b64; }
  .total { margin-top: 28px; font-size: 22px; font-weight: 700; }
  .foot { margin-top: 40px; font-size: 12px; color: #5c6b64; }
</style>
</head>
<body>
  <p class="muted">RoHubTravel · Factură / chitanță demo</p>
  <h1>Confirmare plată</h1>
  <p class="muted">Emisă pe ${escapeHtml(paidLabel)}</p>
  <div class="code">${escapeHtml(input.orderId)}</div>
  <p><strong>Client:</strong> ${escapeHtml(input.customerName)}${
    input.customerEmail ? ` · ${escapeHtml(input.customerEmail)}` : ""
  }</p>
  <p><strong>Pachet:</strong> ${escapeHtml(input.travelTitle)}</p>
  <p><strong>Perioadă:</strong> ${escapeHtml(formatDateRo(input.startsOn))} → ${escapeHtml(formatDateRo(input.endsOn))} (${input.days} zile)</p>
  <p><strong>Persoane:</strong> ${input.guests} × ${input.unitPriceRon} ${escapeHtml(input.currency)}</p>
  <table>
    <thead><tr><th>#</th><th>Nume</th><th>Telefon</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p class="total">Total plătit: ${input.totalRon} ${escapeHtml(input.currency)}</p>
  <p class="foot">Document demonstrativ RoHubTravel — nu constituie factură fiscală ANAF. Include Piticot pe traseu și transport pe circuit.</p>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `factura-RoHub-${input.orderId}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
