import Site, { type PageKey } from "../site";
import { notFound } from "next/navigation";
import { metadataFor } from "../site-metadata";
const keys = ["home", "products", "applications", "about", "contact", "brand"];
function resolve(slug: string[]) {
  const en = slug[0] === "en";
  const parts = en ? slug.slice(1) : slug;
  const key = parts[0] || "home";
  if (parts.length > 1 || !keys.includes(key) || (key === "home" && parts.length > 0)) return null;
  return { en, key: key as PageKey };
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const r = resolve((await params).slug);
  if (!r) return { title: "Page not found | LinkedTi" };
  return metadataFor(r.key, r.en ? "en" : "zh");
}
export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const r = resolve((await params).slug);
  if (!r) notFound();
  return <Site page={r.key} lang={r.en ? "en" : "zh"} />;
}
