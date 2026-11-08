import type { Metadata } from "next";
import { regions, type Region } from "@/lib/content";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rohubtravel.com"
).replace(/\/$/, "");

export const SITE_NAME = "RoHubTravel";
export const SITE_TAGLINE = "Nu vizitezi România. O trăiești.";
export const SITE_DESCRIPTION =
  "Agenție de turism RoHubTravel: vacanțe și circuite autentice în România - Oltenia, Muntenia, Maramureș, Transilvania, Bucovina și Dobrogea. Gastronomie, crame, natură și retreat-uri pentru companii.";

export const SITE_EMAIL = "hello@petreraducatalin.com";
export const SITE_PHONE = "+40787346322";
export const SITE_PHONE_DISPLAY = "+40 787 346 322";
export const SITE_WHATSAPP = "https://wa.me/40787346322";
export const SITE_CITY = "Brașov";
export const SITE_REGION = "Brașov";
export const SITE_COUNTRY = "RO";
export const SITE_ADDRESS_DISPLAY = "Brașov, România";
/** Brașov city center approx. */
export const SITE_GEO = { latitude: 45.6579, longitude: 25.6012 } as const;

export const BRAND_LOGO = "/brand/rohub-logo.png";
export const DEFAULT_OG_IMAGE = "/regions/og-share.jpg";
export const OG_SHARE_IMAGE = "/regions/og-share.jpg";

export const CORE_KEYWORDS = [
  "agenție de turism România",
  "vacanțe România",
  "circuite România",
  "turism autentic România",
  "RoHubTravel",
  "vacanțe Oltenia",
  "vacanțe Maramureș",
  "vacanțe Transilvania",
  "vacanțe Bucovina",
  "Delta Dunării tururi",
  "retreat angajați România",
  "team building România natură",
  "experiențe gastronomice România",
  "crame România tururi",
  "retreat Brașov",
] as const;

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image);
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} · ${SITE_NAME}`;

  return {
    title,
    description,
    keywords: [...new Set([...keywords, ...CORE_KEYWORDS])],
    alternates: {
      canonical: path,
      languages: {
        "ro-RO": path,
        "x-default": path,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "ro_RO",
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} - ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
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
  };
}

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness", "Organization"],
    "@id": absoluteUrl("/#organization"),
    name: SITE_NAME,
    legalName: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl(BRAND_LOGO),
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    description: SITE_DESCRIPTION,
    email: SITE_EMAIL,
    telephone: SITE_PHONE,
    priceRange: "$$",
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_CITY,
      addressRegion: SITE_REGION,
      addressCountry: SITE_COUNTRY,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE_GEO.latitude,
      longitude: SITE_GEO.longitude,
    },
    areaServed: {
      "@type": "Country",
      name: "România",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SITE_PHONE,
        contactType: "customer service",
        email: SITE_EMAIL,
        areaServed: "RO",
        availableLanguage: ["Romanian"],
      },
    ],
    knowsAbout: [
      "Turism România",
      "Circuite regionale",
      "Retreat-uri corporate",
      "Gastronomie locală",
      "Turism cultural",
    ],
    makesOffer: regions.map((region) => ({
      "@type": "Offer",
      name: `Vacanțe în ${region.name}`,
      url: absoluteUrl(`/vacante/${region.slug}/`),
      description: region.seoDescription,
      areaServed: region.name,
    })),
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "ro-RO",
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(
  faqs: { question: string; answer: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function regionTripJsonLd(region: Region): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: `Vacanțe în ${region.name} cu ${SITE_NAME}`,
    description: region.seoDescription,
    url: absoluteUrl(`/vacante/${region.slug}/`),
    image: absoluteUrl(region.image),
    touristType: region.bestFor,
    itinerary: {
      "@type": "ItemList",
      itemListElement: region.attractions.map((name, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name,
      })),
    },
    provider: { "@id": absoluteUrl("/#organization") },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/vacante/${region.slug}/#contact`),
      priceCurrency: "RON",
      description: `Cere ofertă personalizată pentru ${region.name}`,
    },
  };
}

export function vacanteIndexJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Vacanțe și circuite în România",
    description:
      "Circuite și vacanțe autentice în România: Oltenia, Muntenia, Maramureș, Transilvania, Bucovina și Dobrogea. Gastronomie, crame, natură și experiențe locale.",
    url: absoluteUrl("/vacante/"),
    provider: { "@id": absoluteUrl("/#organization") },
    areaServed: {
      "@type": "Country",
      name: "România",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Vacanțe în România pe regiuni",
      itemListElement: regions.map((region) => ({
        "@type": "Offer",
        name: `Vacanțe în ${region.name}`,
        description: region.seoDescription,
        url: absoluteUrl(`/vacante/${region.slug}/`),
      })),
    },
  };
}

export function servicesJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Retreat-uri pentru angajați - RoHubTravel Servicii",
    serviceType: "Corporate retreat / employee experience travel",
    description:
      "Retreat-uri corporate în România: Escape 24h, Experience 36h, Retreat 48h și programe custom cu natură, gastronomie și experiențe locale.",
    url: absoluteUrl("/servicii-b2b/"),
    provider: { "@id": absoluteUrl("/#organization") },
    areaServed: {
      "@type": "Country",
      name: "România",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Pachete retreat angajați",
      itemListElement: [
        {
          "@type": "Offer",
          name: "ESCAPE - 24 ore",
          description:
            "Experiență de o zi: natură, gastronomie și activități locale, fără cazare.",
          price: "750",
          priceCurrency: "RON",
          minOrderQuantity: 10,
          url: absoluteUrl("/servicii-b2b/#escape"),
        },
        {
          "@type": "Offer",
          name: "EXPERIENCE - 36 ore",
          description:
            "Retreat de o noapte cu cazare, experiențe locale și timp de deconectare.",
          price: "1150",
          priceCurrency: "RON",
          minOrderQuantity: 10,
          url: absoluteUrl("/servicii-b2b/#experience"),
        },
        {
          "@type": "Offer",
          name: "RETREAT - 48 ore",
          description:
            "Două zile complete de retreat: natură, cultură, gastronomie și crame.",
          price: "1450",
          priceCurrency: "RON",
          minOrderQuantity: 10,
          url: absoluteUrl("/servicii-b2b/#retreat"),
        },
        {
          "@type": "Offer",
          name: "YOUR ROMANIA - Custom",
          description:
            "Retreat personalizat pentru grupuri de minimum 25 de persoane.",
          price: "2000",
          priceCurrency: "RON",
          minOrderQuantity: 25,
          url: absoluteUrl("/servicii-b2b/#custom"),
        },
      ],
    },
  };
}

export const HOME_FAQS = [
  {
    question: "Ce este RoHubTravel?",
    answer:
      "RoHubTravel este o agenție de turism axată pe vacanțe și circuite autentice în România. Organizăm experiențe pe regiuni - Oltenia, Muntenia, Maramureș, Transilvania, Bucovina și Dobrogea - cu gastronomie locală, crame, natură și ghizi verificați.",
  },
  {
    question: "În ce regiuni din România organizați vacanțe?",
    answer:
      "Acoperim Oltenia, Muntenia, Maramureș, Transilvania, Bucovina și Dobrogea (inclusiv Delta Dunării). Fiecare regiune are o pagină dedicată cu atracții, mâncare locală și experiențe pe care le putem organiza.",
  },
  {
    question: "Cum rezerv un circuit sau o vacanță?",
    answer: `Scrie-ne pe formularul de contact, pe email la ${SITE_EMAIL}, telefon ${SITE_PHONE_DISPLAY} sau WhatsApp. Spune-ne regiunea, perioada și numărul de persoane - răspundem în maximum o zi lucrătoare cu o propunere personalizată.`,
  },
  {
    question: "Organizați și retreat-uri pentru companii?",
    answer:
      "Da. Pe pagina Servicii găsești pachete Escape 24h, Experience 36h, Retreat 48h și programe custom pentru angajați - natură, gastronomie și experiențe locale, nu team-building clasic. Pachetele standard pornesc de la minimum 10 persoane.",
  },
  {
    question: "Vacanțele sunt potrivite pentru diaspora și oaspeți din străinătate?",
    answer:
      "Da. Itinerariile sunt gândite și pentru români din diaspora și oaspeți care vor să trăiască România autentică: mănăstiri, sate, crame, gastronomie și peisaje, cu logistică clară din Brașov, București sau alte puncte de plecare.",
  },
] as const;

export const SERVICES_FAQS = [
  {
    question: "Ce tipuri de retreat-uri pentru angajați oferiți?",
    answer:
      "Avem Escape (24h), Experience (36h), Retreat (48h) și programe custom Your Romania pentru grupuri de minimum 25 de persoane. Toate combină natură, gastronomie și experiențe locale în România. Pachetele Escape, Experience și Retreat pornesc de la minimum 10 persoane.",
  },
  {
    question: "Retreat-urile RoHubTravel sunt team-building?",
    answer:
      "Nu. Nu este team-building clasic. Este timp pentru oameni: deconectare, natură, gastronomie și experiențe locale - fără presiunea de a performa în activități forțate de echipă.",
  },
  {
    question: "Cum cer o ofertă pentru un retreat corporate?",
    answer: `Contactează-ne la ${SITE_EMAIL} sau ${SITE_PHONE_DISPLAY} cu numărul de participanți, perioada dorită și tipul de experiență (24h, 36h, 48h sau custom). Trimitem o propunere pe email sau WhatsApp în maximum o zi lucrătoare.`,
  },
] as const;

export const VACANTE_FAQS = [
  {
    question: "Cum aleg regiunea potrivită pentru vacanță în România?",
    answer:
      "Oltenia și Bucovina sunt ideale pentru mănăstiri și tradiție, Maramureș pentru sat autentic, Transilvania pentru castele și orașe medievale, Muntenia pentru weekend-uri aproape de București, iar Dobrogea/Delta pentru natură și pește proaspăt.",
  },
  {
    question: "Vacanțele RoHubTravel sunt pachete fixe sau personalizate?",
    answer:
      "Construim itinerarii pe ritmul tău: durată, ritm, tip de cazare și experiențe (crame, gastronomie, natură, cultură). Nu vindem un pachet generic — adaptăm circuitul la grup.",
  },
] as const;
