import {QUESTIONS,DIMENSIONS,scoreAssessment} from './waic-assessment.mjs';
export const questions=QUESTIONS.map(q=>({...q,options:[...q.options.map(o=>({...o,value:String(o.value)})),{value:'unknown',label:'暂不清楚'}]}));
const copy={
 immediate:{label:'建议优先启动试点',advice:'先选 1–2 台关键设备，确认采集条件与验收标准，再验证预警、复核和维修闭环。'},
 pilot:{label:'建议小范围试点',advice:'从一台关键设备开始，补齐数据或协作短板。用实际运行与维修反馈验证，再决定是否扩大。'},
 postpone:{label:'建议先补基础',advice:'先整理设备与故障台账，确认数据采集方式和现场负责人，条件清楚后再评估投入。'},
 notNow:{label:'现阶段暂不优先',advice:'就本次选择的设备而言，可优先完善点检、保养和备件管理；关键设备或工况变化后再评估。'}
};
export function evaluate(answers){
 const unknown=questions.filter(q=>!['0','1','2'].includes(answers[q.id])).length;
 const raw=unknown?null:scoreAssessment(answers);
 const dims=DIMENSIONS.map(d=>{const qs=questions.filter(q=>q.dimension===d.id);const known=qs.filter(q=>['0','1','2'].includes(answers[q.id]));const score=known.reduce((n,q)=>n+Number(answers[q.id]),0);return {...d,known:known.length,score,levelLabel:known.length<3?'待补充':score>=5?'高':score>=3?'中':'低'};});
 const id=raw?.result.id || 'pending';
 return {unknown,id,stage:raw?copy[id].label:'补充信息后再判断',advice:raw?copy[id].advice:'有些现场情况还不清楚，可以先由设备负责人补充，再给出推进建议。',dimensions:dims,originalLabel:raw?.result.label,basis:raw?.result.basis,version:'waic-original-1',safetyFlag:answers.di_risk==='2'};
}
export function answerLabel(id,answers){return questions.find(q=>q.id===id)?.options.find(o=>o.value===answers[id])?.label || '未回答';}
