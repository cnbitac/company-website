import type { MetadataRoute } from "next";
import { sitePublication } from "./site-metadata";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "products", "applications", "about", "contact"].flatMap((page) => {
    const zh = sitePublication.origin + (page ? "/" + page : "/");
    const en = sitePublication.origin + "/en" + (page ? "/" + page : "");
    const ja = sitePublication.origin + "/ja" + (page ? "/" + page : "");
    const de = sitePublication.origin + "/de" + (page ? "/" + page : "");
    const ar = sitePublication.origin + "/ar" + (page ? "/" + page : "");
    const alternates = { languages: { "zh-CN": zh, en, ja, de, ar } };
    return [
      { url: zh, alternates },
      { url: en, alternates },
      { url: ja, alternates },
      { url: de, alternates },
      { url: ar, alternates },
    ];
  });
}
