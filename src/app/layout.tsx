import type { Metadata, Viewport } from "next";
import { Figtree, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' https://images.unsplash.com data: blob:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

export const metadata: Metadata = {
  title: {
    default: "Rohub — Agenție de Turism",
    template: "%s · Rohub",
  },
  description:
    "Rohub este agenția ta de turism pentru vacanțe memorabile în România și în lume. Destinații selectate, ghid local, experiențe autentice.",
  keywords: [
    "agenție de turism",
    "Rohub",
    "vacanțe",
    "România",
    "sejururi",
    "călătorii",
  ],
  authors: [{ name: "Rohub" }],
  creator: "Rohub",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: "Rohub",
    title: "Rohub — Agenție de Turism",
    description:
      "Vacanțe memorabile în România și în lume. Destinații selectate, ghid local, experiențe autentice.",
  },
  other: {
    "Content-Security-Policy": csp,
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "DENY",
  },
};

export const viewport: Viewport = {
  themeColor: "#1b4d3e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ro" className={`${syne.variable} ${figtree.variable} h-full`}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={csp} />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta
          name="referrer"
          content="strict-origin-when-cross-origin"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
