import type { MetadataRoute } from "next";
import { getAllRoutes } from "@/lib/routes";

const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rohubtravel.com";
const siteUrl = rawSiteUrl.replace(/\/$/, "");

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return getAllRoutes().map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
