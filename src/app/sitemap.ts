import type { MetadataRoute } from "next";
import { regions } from "@/lib/content";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rohubtravel.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const regionPages = regions.map((region) => ({
    url: `${siteUrl}/vacante/${region.slug}/`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/vacante/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    ...regionPages,
  ];
}
