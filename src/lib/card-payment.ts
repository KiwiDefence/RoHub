export type CardBrand =
  | "visa"
  | "mastercard"
  | "amex"
  | "discover"
  | "unknown";

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Detect brand from card number digits (BIN / IIN ranges). */
export function detectCardBrand(raw: string): CardBrand {
  const n = digitsOnly(raw);
  if (!n) return "unknown";
  if (/^4/.test(n)) return "visa";
  if (/^3[47]/.test(n)) return "amex";
  if (/^5[1-5]/.test(n)) return "mastercard";
  // Mastercard 2-series
  const four = Number(n.slice(0, 4));
  if (four >= 2221 && four <= 2720) return "mastercard";
  if (/^6011/.test(n) || /^65/.test(n) || /^64[4-9]/.test(n)) return "discover";
  return "unknown";
}

export function cardBrandLogo(brand: CardBrand): string | null {
  if (brand === "unknown") return null;
  return `/payments/${brand}.svg`;
}

export function cardBrandLabel(brand: CardBrand): string {
  switch (brand) {
    case "visa":
      return "Visa";
    case "mastercard":
      return "Mastercard";
    case "amex":
      return "American Express";
    case "discover":
      return "Discover";
    default:
      return "";
  }
}

/** Groups: Amex 4-6-5, others 4-4-4-4. */
export function formatCardNumber(raw: string): string {
  const brand = detectCardBrand(raw);
  const maxLen = brand === "amex" ? 15 : 16;
  const n = digitsOnly(raw).slice(0, maxLen);
  if (brand === "amex") {
    const a = n.slice(0, 4);
    const b = n.slice(4, 10);
    const c = n.slice(10, 15);
    return [a, b, c].filter(Boolean).join(" ");
  }
  return (n.match(/.{1,4}/g) ?? []).join(" ");
}

/** Formats as LL/AA (lună/an) while typing. */
export function formatCardExpiry(raw: string): string {
  const n = digitsOnly(raw).slice(0, 4);
  if (n.length === 0) return "";
  if (n.length <= 2) {
    // Soft-clamp month hint: 00–12 as user types second digit
    if (n.length === 1 && Number(n) > 1) return `0${n}/`;
    return n;
  }
  let mm = n.slice(0, 2);
  const yy = n.slice(2, 4);
  const month = Number(mm);
  if (month === 0) mm = "01";
  else if (month > 12) mm = "12";
  return `${mm}/${yy}`;
}

export function formatCardCvc(raw: string, brand: CardBrand): string {
  const max = brand === "amex" ? 4 : 3;
  return digitsOnly(raw).slice(0, max);
}
