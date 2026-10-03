import { ArrowUpRight, BookOpen, GitBranch, ClipboardCheck, Download } from 'lucide-react';
import { languagePath, type SiteLang } from './language-path';
import { ruleContent } from './rule-content';
import './rules.css';

export function RulesWorkflow({ lang }: { lang: SiteLang }) {
  const c = ruleContent[lang];
  return <section className="section wrap rules-workflow">
    <div className="section-heading"><h2>{c.workflowTitle}</h2><p>{c.workflowIntro}</p></div>
    <ol className="rules-steps">{c.steps.map((s, i) => <li key={s}><span>{String(i + 1).padStart(2, '0')}</span><strong>{s}</strong></li>)}</ol>
    <p className="rules-note">{c.scope}</p>
  </section>;
}

export default function RuleKnowledge({ lang, view = 'overview' }: { lang: SiteLang; view?: 'overview' | 'details' | 'example' | 'about' }) {
  const c = ruleContent[lang];
  if (view === 'about') return <section className="section wrap rules-about"><p className="eyebrow">{c.eyebrow}</p><h2>{c.aboutTitle}</h2><p>{c.about}</p></section>;
  if (view === 'example') return <section className="section wrap rules-example"><p className="eyebrow">{c.eyebrow}</p><h2>{c.exampleTitle}</h2><p>{c.example}</p><p className="rules-note">{c.exampleNote}</p></section>;
  const detail = view === 'details';
  const icons = [BookOpen, GitBranch, ClipboardCheck];
  return <section className="section wrap rules-section" id="diagnostic-rules">
    <div className="rules-heading"><p className="eyebrow">{c.eyebrow}</p><h2>{detail ? c.detailTitle : c.title}</h2><p>{detail ? c.detailIntro : c.intro}</p></div>
    <div className={`rules-grid${detail ? ' rules-grid-detail' : ''}`}>{(detail ? c.deliverables : c.cards).map(([title, body], i) => {
      const Icon = icons[i % icons.length];
      return <article key={title}><Icon size={24} aria-hidden="true"/><h3>{title}</h3><p>{body}</p></article>;
    })}</div>
    {detail ? <><div className="rules-delivery"><p>{c.commercial}</p><a href="/brochures/linkedti-brochure-2026.pdf" className="rules-link" download><Download size={18}/>{c.download}</a></div><p className="rules-note">{c.scope}</p></> : <a className="rules-link" href={`${languagePath(lang, 'products')}#diagnostic-rules`}>{c.link}<ArrowUpRight size={18}/></a>}
  </section>;
}
