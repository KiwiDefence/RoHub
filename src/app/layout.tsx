import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { FloatingActions } from "@/components/FloatingActions";
import { JsonLd } from "@/components/JsonLd";
import {
  CORE_KEYWORDS,
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  absoluteUrl,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
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
  "img-src 'self' data: https:;",
  "frame-ancestors 'none'",
].join("; ");

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [...CORE_KEYWORDS],
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: absoluteUrl(DEFAULT_OG_IMAGE),
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Metadata["viewport"] = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const scripts = `
// Lightweight analytics: store pageview count in localStorage
(function() {
  try {
    var storage = localStorage;
    var key = 'roh_analytics';
    var data = null;
    try { data = JSON.parse(storage.getItem(key)) || { pv: 0 }; } catch(e) { data = { pv: 0 }; }
    data.pv++;
    data.last = new Date().toISOString();
    storage.setItem(key, JSON.stringify(data));
  } catch(e) { /* storage full or unavailable */ }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ro"
      className={`${outfit.variable} ${plusJakarta.variable} flex min-h-screen flex-col`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="msapplication-TileColor" content="#1b4d3e" />
        <meta name="theme-color" content="#1b4d3e" />
        <meta name="google" content="notranslate" />
        <meta name="referrer" content="origin-when-cross-origin" />
        <meta name="pinterest" content="nopin" />
        <link rel="canonical" href={absoluteUrl("/")} />
        <style dangerouslySetInnerHTML={{ __html: scripts }} />
      </head>
      <body className="flex min-h-screen flex-col bg-pine font-sans text-ink antialiased">
        {/* Skip Navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:px-4 focus:py-2 focus:bg-dawn focus:text-ink focus:font-semibold focus:rounded-sm"
        >
          Sari la conținutul principal
        </a>

        {children}

        <FloatingActions />
      </body>
    </html>
  );
}
