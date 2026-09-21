import { renderToString } from 'react-dom/server';
import Site, { type PageKey } from '../app/site';
export { metadataFor, sitePublication } from '../app/site-metadata';
export function render(page: PageKey, lang: 'zh' | 'en' | 'ja' | 'de' | 'ar') { return renderToString(<Site page={page} lang={lang} />); }
