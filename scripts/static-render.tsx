import { renderToString } from 'react-dom/server';
import Site, { type PageKey } from '../app/site';
export { metadataFor, sitePublication } from '../app/site-metadata';
export function render(page: PageKey, lang: 'zh' | 'en') { return renderToString(<Site page={page} lang={lang} />); }
