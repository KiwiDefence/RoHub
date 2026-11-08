import type { MetadataRoute } from "next";
import { regions } from "@/lib/content";

export type SiteRoute = {
  path: string;
  label: string;
  priority: number;
  changeFrequency: NonNullable<
    MetadataRoute.Sitemap[number]["changeFrequency"]
  >;
};

/** Every public indexable route on the site. */
export function getAllRoutes(): SiteRoute[] {
  return [
    {
      path: "/",
      label: "Acasă",
      priority: 1,
      changeFrequency: "weekly",
    },
    {
      path: "/vacante/",
      label: "Vacanțe în România - index",
      priority: 0.95,
      changeFrequency: "weekly",
    },
    {
      path: "/servicii-b2b/",
      label: "Servicii - retreat-uri pentru angajați",
      priority: 0.95,
      changeFrequency: "weekly",
    },
    {
      path: "/echipa/",
      label: "Echipa RoHubTravel",
      priority: 0.8,
      changeFrequency: "monthly",
    },
    {
      path: "/inovatie/",
      label: "Inovație - Piticot & Mystery Box",
      priority: 0.85,
      changeFrequency: "monthly",
    },
    {
      path: "/inovatie/piticot/",
      label: "Piticot - circuit gamificat",
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      path: "/inovatie/mystery-box/",
      label: "Mystery Box - destinație secretă",
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      path: "/harta-site/",
      label: "Harta site-ului - toate paginile",
      priority: 0.3,
      changeFrequency: "monthly",
    },
    {
      path: "/politica-de-confidentialitate/",
      label: "Politica de confidențialitate",
      priority: 0.2,
      changeFrequency: "yearly",
    },
    {
      path: "/termeni-si-conditii/",
      label: "Termeni și condiții",
      priority: 0.2,
      changeFrequency: "yearly",
    },
    ...regions.map((region) => ({
      path: `/vacante/${region.slug}/`,
      label: `Vacanțe în ${region.name}`,
      priority: 0.9,
      changeFrequency: "weekly" as const,
    })),
  ];
}
