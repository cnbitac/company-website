import Site, { type PageKey } from "../site";
import { notFound } from "next/navigation";
import { metadataFor } from "../site-metadata";
const keys = ["home", "products", "applications", "about", "contact", "brand"];
function resolve(slug: string[]) {
  const lang = ["en","ja","de","ar"].includes(slug[0]) ? slug[0] : "zh";
  const parts = lang !== "zh" ? slug.slice(1) : slug;
  const key = parts[0] || "home";
  if (parts.length > 1 || !keys.includes(key) || (key === "home" && parts.length > 0)) return null;
  if (["ja","de","ar"].includes(lang) && key === "brand") return null;
  return { lang: lang as "zh" | "en" | "ja" | "de" | "ar", key: key as PageKey };
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const r = resolve((await params).slug);
  if (!r) return { title: "Page not found | LinkedTi" };
  return metadataFor(r.key, r.lang);
}
export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const r = resolve((await params).slug);
  if (!r) notFound();
  return <Site page={r.key} lang={r.lang} />;
}
