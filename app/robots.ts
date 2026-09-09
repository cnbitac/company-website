import type { MetadataRoute } from "next";
import { sitePublication } from "./site-metadata";
export default function robots(): MetadataRoute.Robots {
  if (!sitePublication.allowIndexing) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/brand", "/en/brand"] },
    sitemap: sitePublication.origin + "/sitemap.xml",
  };
}
