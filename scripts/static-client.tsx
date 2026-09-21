import { hydrateRoot } from 'react-dom/client';
import Site, { type PageKey } from '../app/site';
import '../app/globals.css';
const root = document.getElementById('root')!;
hydrateRoot(root, <Site page={root.dataset.page as PageKey} lang={(['en','ja','de','ar'].includes(root.dataset.lang || '') ? root.dataset.lang : 'zh') as import('../app/languages').SiteLang} />);
