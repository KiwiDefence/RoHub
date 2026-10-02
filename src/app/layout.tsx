import type { Metadata, Viewport } from "next";
import { Figtree, Syne } from "next/font/google";
import { FloatingActions } from "@/components/FloatingActions";
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
  "img-src 'self' data: blob:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

export const metadata: Metadata = {
  title: {
    default: "RoHub — Vacanțe autentice în România",
    template: "%s · RoHub",
  },
  description:
    "RoHub: agenție de turism pentru vacanțe și circuite în România. Oltenia, Muntenia, Maramureș, Transilvania, Bucovina și Dobrogea — experiențe locale, gastronomie, crame.",
  keywords: [
    "agenție de turism România",
    "RoHub",
    "vacanțe România",
    "circuite România",
    "Oltenia",
    "Muntenia",
    "Maramureș",
    "turism autentic",
  ],
  authors: [{ name: "RoHub" }],
  creator: "RoHub",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: "RoHub",
    title: "RoHub — Vacanțe autentice în România",
    description:
      "Nu vizitezi România. O trăiești. Circuite și experiențe pe regiuni.",
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
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <FloatingActions />
      </body>
    </html>
  );
}
