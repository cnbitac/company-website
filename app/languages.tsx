'use client';
import {languagePath,languages,type SiteLang} from './language-path';
export {languagePath,languages,type SiteLang} from './language-path';
export default function LanguageSwitcher({lang,page}:{lang:SiteLang;page:string}) {
 const labels = {zh:'中文',en:'English',ja:'日本語',de:'Deutsch',ar:'العربية'};
 return <select className="language-switcher" dir="ltr" aria-label={{zh:'选择语言',en:'Select language',ja:'言語を選択',de:'Sprache wählen',ar:'اختيار اللغة'}[lang]} value={lang} onChange={e=>{window.location.href=languagePath(e.target.value as SiteLang,page);}}>{languages.map(l=><option key={l} value={l} lang={l}>{labels[l]}</option>)}</select>;
}
