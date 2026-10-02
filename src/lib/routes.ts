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
      label: "Services - retreat-uri pentru angajați",
      priority: 0.95,
      changeFrequency: "weekly",
    },
    {
      path: "/harta-site/",
      label: "Harta site - toate paginile",
      priority: 0.3,
      changeFrequency: "monthly",
    },
    ...regions.map((region) => ({
      path: `/vacante/${region.slug}/`,
      label: `Vacanțe în ${region.name}`,
      priority: 0.9,
      changeFrequency: "weekly" as const,
    })),
  ];
}
