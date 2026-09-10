import type { MetadataRoute } from "next";
import { sitePublication } from "./site-metadata";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "products", "applications", "about", "contact"].flatMap((page) => {
    const zh = sitePublication.origin + (page ? "/" + page : "/");
    const en = sitePublication.origin + "/en" + (page ? "/" + page : "");
    const ja = sitePublication.origin + "/ja" + (page ? "/" + page : "");
    const alternates = { languages: { "zh-CN": zh, en, ja } };
    return [
      { url: zh, alternates },
      { url: en, alternates },
      { url: ja, alternates },
    ];
  });
}
