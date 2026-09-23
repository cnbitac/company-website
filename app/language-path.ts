export type SiteLang = 'zh' | 'en' | 'ja' | 'de' | 'ar';
export const languages = ['zh','en','ja','de','ar'] as const;
export function languagePath(lang: SiteLang, page = 'home') {
 const target = page === 'brand' && !['zh','en'].includes(lang) ? 'about' : page;
 return `${lang === 'zh' ? '' : '/' + lang}${target === 'home' ? '' : '/' + target}` || '/';
}
