import ts from 'typescript';
import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
const source=ts.createSourceFile('assessment.tsx',readFileSync('app/assessment.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const dictionaryCode=ts.transpileModule(readFileSync('app/assessment-international.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {assessmentInternational,internationalQuestions,internationalResults}=await import('data:text/javascript;base64,'+Buffer.from(dictionaryCode).toString('base64'));
let uiCount=0;
function visit(node){if(ts.isCallExpression(node)&&node.expression.getText(source)==='t'){const en=node.arguments[1];assert(ts.isStringLiteral(en));assert(assessmentInternational[en.text],`Missing UI translation: ${en.text}`);assert(assessmentInternational[en.text].every(s=>s.length>0));uiCount++;}ts.forEachChild(node,visit);}
visit(source);
for(const lang of ['de','ar']){
 assert.equal(internationalQuestions[lang].length,12);internationalQuestions[lang].forEach(row=>assert.equal(row.length,5));
 assert.equal(Object.keys(internationalResults[lang]).length,5);
 for(const page of ['','/products','/applications','/about','/contact']){
  const html=readFileSync(`out/${lang}${page}.html`,'utf8');
  assert(html.includes(`lang="${lang}" dir="${lang==='ar'?'rtl':'ltr'}"`));
  assert(html.includes(`rel="canonical" href="https://www.linkedti.com/${lang}${page}"`));
  for(const l of ['zh-CN','en','ja','de','ar'])assert(html.includes(`hreflang="${l}"`));
  for(const [,url] of html.matchAll(/(?:src|href)="(\/[^"?#]*)/g)) {
   if(url==='/api/leads')continue;
   assert(existsSync('out'+url)||existsSync('out'+url+'.html'),`Missing destination: ${url}`);
  }
 }
}
const sitemap=readFileSync('out/sitemap.xml','utf8');assert.equal((sitemap.match(/<loc>/g)||[]).length,25);
console.log(`Passed: ${uiCount} UI translations, 24 questions, 10 result branches, 10 new routes, links/assets, metadata and 25 sitemap URLs.`);
