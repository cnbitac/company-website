'use client';
import {useState,useEffect,useRef,type SubmitEvent} from 'react';
import {ArrowLeft,ArrowRight,Check,ShieldCheck} from 'lucide-react';
import {Mark,Wordmark} from './site';
import {NativeSelect,NativeSelectOption} from '../components/ui/native-select';
import {Input} from '../components/ui/input';
import {Button} from '../components/ui/button';
import {questions,evaluate} from './assessment-model.mjs';
import {questionTranslations,resultTranslations,type AssessmentLang} from './assessment-translations';
import './assessment.css';
import './international.css';
import {assessmentInternational} from './assessment-international';
import LanguageSwitcher from './languages';

export default function Assessment({lang}:{lang:AssessmentLang}){
 const t=(zh:string,en:string,ja:string)=>lang==='zh'?zh:lang==='en'?en:lang==='ja'?ja:assessmentInternational[en][lang==='de'?0:1];
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [step,setStep]=useState(0);
 const [kind,setKind]=useState(lang==='zh'?'wechat':'email');
 const [contact,setContact]=useState('');
 const [consent,setConsent]=useState(false);
 const [busy,setBusy]=useState(false);
 const [receipt,setReceipt]=useState('');
 const [error,setError]=useState('');
 const [trap,setTrap]=useState('');
 const requestId=useRef('');
 const heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{document.documentElement.lang=lang==='zh'?'zh-CN':lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';},[lang]);
 useEffect(()=>{heading.current?.focus();window.scrollTo({top:0,behavior:'instant'});},[step]);
 const result=evaluate(answers);
 const translated=lang==='zh'?null:resultTranslations[lang][result.id];
 const stage=translated?.[0]??result.stage,advice=translated?.[1]??result.advice;
 const steps=[t('设备价值','Equipment value','設備価値'),t('停机影响','Downtime impact','停止影響'),t('数据基础','Data readiness','データ基盤'),t('团队能力','Team readiness','チーム体制'),t('评估建议','Next steps','評価・次の一歩')];
 const kindLabel=(value:string)=>value==='wechat'?t('微信','WeChat','WeChat'):value==='phone'?t('手机','Phone','電話'):t('邮箱','Email','メール');
 const home=lang==='zh'?'/':'/'+lang;
 function changed(){requestId.current='';setReceipt('');setError('');}
 async function submit(e:SubmitEvent<HTMLFormElement>){
  e.preventDefault();if(busy)return;
  const value=contact.trim();
  const valid=kind==='email'?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value):kind==='phone'?/^\+?[\d ()-]{7,24}$/.test(value)&&value.replace(/\D/g,'').length>=7:value.length>=2&&value.length<=80&&!/\s/.test(value);
  if(!valid){setError(t('请填写有效的联系方式。','Please enter valid contact details.','有効な連絡先を入力してください。'));return;}
  if(!consent){setError(t('请先同意我们就本次评估与你联系。','Please agree to be contacted about this assessment.','本評価に関するご連絡に同意してください。'));return;}
  setBusy(true);setError('');
  requestId.current ||= crypto.randomUUID();
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);
  try{
   const response=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({requestId:requestId.current,answers,language:lang,contactKind:kind,contact:value,consent,consentVersion:'2026-09-17',website:trap}),signal:controller.signal});
   if(response.status===429)throw new Error('limit');
   if(!response.ok)throw new Error('submit');
   const data=await response.json() as {saved?:boolean;id?:string};if(data.saved!==true||typeof data.id!=='string')throw new Error('submit');
   setReceipt(data.id);setContact('');
  }catch(err){setError(err instanceof Error&&err.message==='limit'?t('提交较频繁，请稍后再试，或直接电话联系我们。','Too many submissions. Please try later or call us.','送信回数が多いため、時間を置くかお電話でご連絡ください。'):t('暂未确认提交成功，你的选择仍保留在此页面。请重试或电话联系，重复重试不会新增同一条线索。','Submission could not be confirmed. Your answers are still here. Retry or call us; retrying will not create a duplicate.','送信結果を確認できません。回答はこの画面に残っています。再試行しても同じ問い合わせは重複登録されません。'));}
  finally{clearTimeout(timer);setBusy(false);}
 }
 return <div className="qa-shell" dir={lang==='ar'?'rtl':'ltr'} lang={lang==='zh'?'zh-CN':lang}>
 <header className="qa-header"><a href={home} className="brand"><Mark/><Wordmark/></a><LanguageSwitcher lang={lang} page="contact"/><a href={home} className="qa-back"><ArrowLeft size={16}/>{t('返回官网','Back to site','サイトに戻る')}</a></header>
 <main className="qa-layout"><aside className="qa-intro"><p className="eyebrow">LINKEDTI / APPLICATION CHECK</p><h1>{t('你的设备，从哪里开始？','Where should your equipment journey start?','あなたの設備、どこから始めますか？')}</h1><p>{t('不是多一件事要管，而是少一件事要做。','Not one more thing to manage. One less thing to do.','管理する手間を増やさず、現場の仕事をひとつ減らす。')}</p><div className="qa-facts"><span>{t('12 道选择题','12 selections','12問の選択式')}</span><span>{t('无需撰写需求','No long forms','長文入力不要')}</span><span>{t('先看结果，再联系','Results before contact','結果を見てから連絡')}</span></div><ol className="qa-steps">{steps.map((s,i)=><li key={s} className={i===step?'current':i<step?'done':''} aria-current={i===step?'step':undefined}><span>{i<step?<Check size={16}/>:String(i+1).padStart(2,'0')}</span>{s}</li>)}</ol><p className="qa-aside-note">{t('这是项目落地适用性自评，不是设备健康或故障风险诊断。','This checks project suitability, not equipment health or failure risk.','導入適合性の自己評価であり、設備の健全性や故障リスクの診断ではありません。')}</p></aside>
 <section className="qa-surface">{step<4?<><div className="qa-topline"><span>{t('应用评估','Application assessment','導入適合性評価')}</span><span>{Object.keys(answers).length} / 12</span></div><progress value={Object.keys(answers).length} max={12} aria-label={t('答题进度','Progress','回答状況')}/><h2 ref={heading} tabIndex={-1}>{steps[step]}</h2><p className="qa-muted">{t('请围绕同一台或同一组关键设备作答。金额以人民币计；不清楚可直接选择“暂不清楚”。','Answer for the same machine or group throughout. All amounts are in CNY. Select “Not sure” where needed.','同じ設備または設備群を対象に回答してください。金額は人民元です。不明な場合は「不明」を選べます。')}</p>
 <form onSubmit={e=>{e.preventDefault();setStep(s=>s+1);setError('');}}><div className="qa-questions">{questions.slice(step*3,step*3+3).map((q,i)=>{const index=step*3+i;const tr=lang==='zh'?null:questionTranslations[lang][index];return <div className="qa-question" key={q.id}><label htmlFor={q.id}><span>{String(index+1).padStart(2,'0')}</span>{tr?.[0]??q.title}</label><p id={q.id+'-hint'}>{tr?.[1]??q.hint}</p><NativeSelect id={q.id} value={answers[q.id]??''} required onChange={e=>{changed();setAnswers(a=>({...a,[q.id]:e.target.value}));}} aria-describedby={q.id+'-hint'}><NativeSelectOption value="" disabled>{t('请选择','Select an option','選択してください')}</NativeSelectOption>{q.options.map((o,j)=><NativeSelectOption value={o.value} key={o.value}>{o.value==='unknown'?t('暂不清楚','Not sure','不明'):tr?.[j+2]??o.label}</NativeSelectOption>)}</NativeSelect>{answers[q.id]&&<p className="qa-selected-answer">{answers[q.id]==='unknown'?t('暂不清楚','Not sure','不明'):tr?.[q.options.findIndex(o=>o.value===answers[q.id])+2]??q.options.find(o=>o.value===answers[q.id])?.label}</p>}</div>;})}</div><div className="qa-controls"><button type="button" disabled={step===0} className="qa-back" onClick={()=>setStep(s=>s-1)}><ArrowLeft size={16}/>{t('上一步','Back','戻る')}</button><Button type="submit" className="button primary">{step===3?t('查看我的评估','See my results','評価結果を見る'):t('下一步','Next','次へ')}<ArrowRight size={16}/></Button></div></form></>:<>
 <div className="qa-topline"><span>{t('你的初步评估','Your initial assessment','初期評価')}</span><span>12 / 12</span></div><h2 ref={heading} tabIndex={-1}>{stage}</h2><div className="qa-result"><div className="qa-verdict"><Check size={30}/></div><div><h3>{t('建议从这里开始','Start here','次の一歩')}</h3><p>{advice}</p></div></div>{result.unknown>0&&<p className="qa-unknown">{t('未知项不按零分处理；补充信息后再判断推进等级。','Unknown items are not scored as zero. Clarify them before deciding how to proceed.','不明項目は0点とせず、情報を補ってから進め方を判断します。')}</p>}{result.safetyFlag&&<p className="qa-unknown">{t('质量、安全或环保影响需单独开展现场风险核实，本评估不能替代安全评估或保护措施。','Quality, safety and environmental impacts require a separate site risk review. This assessment does not replace protective measures.','品質・安全・環境への影響は別途現場で確認が必要です。本評価は安全対策を代替しません。')}</p>}
 <div className="qa-dimensions">{result.dimensions.map((d,i)=><div key={d.id}><div><span>{steps[i]}</span><small>{d.known<3?t('待补充','Unknown','未確認'):`${d.score} / 6`}</small></div><progress value={d.score} max={6} aria-label={steps[i]}/></div>)}</div><details className="qa-explain"><summary>{t('结果如何得出？','How is this assessed?','評価方法')}</summary><p>{t('每个维度 3 题，每题 0 / 1 / 2 分。0–2 分为低、3–4 分为中、5–6 分为高。价值与影响均高、数据与团队均中以上时建议优先试点；价值或影响至少一项高时建议小范围试点；价值与影响均低时暂不优先；其余组合按数据与团队基础判断。不会将四个维度合并为一个百分制总分。','Each dimension has three questions worth 0, 1 or 2 points. Scores of 0–2 are low, 3–4 medium and 5–6 high. High value and impact with at least medium data and team readiness prioritize a pilot. High value or impact suggests a small pilot; low value and impact are not a priority. Other combinations depend on readiness. The dimensions are not combined into a percentage.','各領域は3問、各問0・1・2点です。0〜2点は低、3〜4点は中、5〜6点は高です。価値と影響が高く、データと体制が中以上なら試行を優先。価値か影響が高い場合は小規模試行、両方低い場合は優先度を低めとします。その他は基盤条件から判断し、総合百分率にはしません。')}</p></details>
 {!receipt?<form className="qa-contact" onSubmit={submit} noValidate><fieldset disabled={busy} style={{border:0,padding:0,margin:0}}><div className="qa-contact-title"><ShieldCheck size={22}/><div><h3>{t('把这份评估，变成一次有准备的交流','Turn this assessment into a useful conversation','この評価を、具体的な相談へ')}</h3><p>{t('留一个联系方式就好，评估答案会一起交给交泰智能。','One contact method is enough. Your answers will be included.','連絡先は1つで十分です。回答内容とともに受け付けます。')}</p></div></div><div className="qa-contact-fields"><label htmlFor="method">{t('联系渠道','Contact via','連絡方法')}<NativeSelect id="method" value={kind} onChange={e=>{changed();setKind(e.target.value);setContact('');}}>{['wechat','phone','email'].map(k=><NativeSelectOption key={k} value={k}>{kindLabel(k)}</NativeSelectOption>)}</NativeSelect></label><label htmlFor="contact-value">{kind==='wechat'?t('微信号 / 微信绑定手机号','WeChat ID or linked phone','WeChat ID・登録電話番号'):kindLabel(kind)}<Input id="contact-value" value={contact} onChange={e=>{changed();setContact(e.target.value);}} maxLength={160} type={kind==='email'?'email':'text'} inputMode={kind==='phone'?'tel':kind==='email'?'email':'text'} aria-invalid={!!error}/></label></div><div className="qa-trap" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" tabIndex={-1} autoComplete="off" value={trap} onChange={e=>setTrap(e.target.value)}/></div><label className="qa-consent"><input type="checkbox" checked={consent} onChange={e=>{changed();setConsent(e.target.checked);}}/><span>{t('我同意交泰智能保存本次评估和联系方式，并就设备应用与我联系。','I agree that LinkedTi may store my assessment and contact details and contact me about this application.','LinkedTi が評価回答と連絡先を保存し、設備用途について連絡することに同意します。')}</span></label><details className="qa-explain"><summary>{t('信息如何使用','How we use your information','情報の利用について')}</summary><p>{t('信息用于安徽交泰智能技术有限公司的应用评估与销售跟进，保存于网站后台，并通过企业邮件通知负责人员。你可联系 sales@linkedti.com 请求查阅、更正或删除。','Anhui LinkedTi uses this information for application review and sales follow-up. It is stored by our website and sent to responsible staff through business email. Contact sales@linkedti.com to request access, correction or deletion.','安徽交泰智能技术有限公司は、用途評価と営業対応のために情報を保存し、担当者に業務メールで通知します。確認・訂正・削除のご希望は sales@linkedti.com にご連絡ください。')}</p></details>{error&&<p className="qa-error" role="alert">{error}</p>}<Button type="submit" className="button primary" disabled={busy}>{busy?t('正在提交…','Submitting…','送信中…'):t('提交评估，联系我','Submit and contact me','評価を送信して相談する')}<ArrowRight size={16}/></Button></fieldset></form>:<div className="qa-success" role="status"><Check size={28}/><h3>{t('评估已收到','Assessment received','評価を受け付けました')}</h3><p>{t('你的评估和联系方式已保存，我们会根据你选择的方式联系你，无需再发送邮件。','Your assessment and contact details have been saved. We will follow up using your chosen method. No separate email is needed.','評価と連絡先を保存しました。選択された方法でご連絡します。別途メールを送る必要はありません。')}</p><p>{t('记录编号','Reference','受付番号')}：{receipt.slice(0,8)}</p></div>}
 {!receipt&&<div className="qa-result-actions"><button className="qa-back" disabled={busy} onClick={()=>setStep(0)}><ArrowLeft size={16}/>{t('修改我的选择','Edit my answers','回答を修正')}</button></div>}</>}
 </section></main><footer className="qa-footer"><div><a href="mailto:sales@linkedti.com">sales@linkedti.com</a> · <a href="tel:+8613951419340">+86 139 5141 9340</a><br/>© LinkedTi · <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">皖ICP备2023008887号-2</a></div></footer></div>;
}
