import { build } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const common = {
  configFile: false,
  plugins: [react()],
  resolve: { alias: { 'next/image': resolve('scripts/static-image.tsx') } },
  css: { postcss: { plugins: [tailwindcss()] } },
};
await build({ ...common, build: { outDir: 'out', emptyOutDir: true, rolldownOptions: { input: 'static.html' } } });
await build({ ...common, publicDir: false, build: { ssr: 'scripts/static-render.tsx', outDir: '.static-ssr', emptyOutDir: true } });
const { render, metadataFor, sitePublication } = await import(pathToFileURL(resolve('.static-ssr/static-render.js')));
const template = readFileSync('out/static.html', 'utf8');
unlinkSync('out/static.html');
const escape = s => String(s).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const urls = [];
for (const lang of ['zh', 'en', 'ja', 'de', 'ar']) for (const page of ['home', 'products', 'applications', 'about', 'contact', 'brand']) {
  if (['ja','de','ar'].includes(lang) && page === 'brand') continue;
  const route = `${lang === 'zh' ? '' : '/' + lang}${page === 'home' ? '' : '/' + page}` || '/';
  const metadata = metadataFor(page, lang);
  const head = `<title>${escape(metadata.title)}</title><meta name="description" content="${escape(metadata.description)}"><meta name="robots" content="${metadata.robots.index ? 'index, follow' : 'noindex, nofollow'}">`;
  const alternates = metadata.alternates;
  const links = alternates ? `<link rel="canonical" href="${sitePublication.origin}${alternates.canonical}">` + Object.entries(alternates.languages).map(([language, path]) => `<link rel="alternate" hreflang="${language}" href="${sitePublication.origin}${path}">`).join('') : '';
  const html = template.replace('lang="zh-CN"', `lang="${lang === 'zh' ? 'zh-CN' : lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}"`).replace('<!--metadata-->', head + links).replace('data-page="home" data-lang="zh"', `data-page="${page}" data-lang="${lang}"`).replace('<!--app-->', render(page, lang));
  const file = route === '/' ? 'out/index.html' : `out${route}.html`;
  mkdirSync(resolve(file, '..'), { recursive: true });
  writeFileSync(file, html);
  if (page !== 'brand') urls.push(`${sitePublication.origin}${route}`);
}
writeFileSync('out/robots.txt', sitePublication.allowIndexing ? `User-agent: *\nDisallow: /brand\nDisallow: /en/brand\nSitemap: ${sitePublication.origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
writeFileSync('out/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls.map(url => `<url><loc>${escape(url)}</loc></url>`).join('') + '</urlset>');
console.log('Exported 27 pages in Chinese, English, Japanese, German and Arabic to out/.');
