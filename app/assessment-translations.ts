import {internationalQuestions,internationalResults} from './assessment-international';
export type AssessmentLang = 'zh' | 'en' | 'ja' | 'de' | 'ar';
// Options keep the source order (2, 1, 0); monetary thresholds remain CNY in every language.
export const questionTranslations: Record<'en' | 'ja' | 'de' | 'ar', string[][]> = {
 ...internationalQuestions,
 en: [
 ['What is the purchase or replacement cost of your most critical equipment?','Consider one core machine or one irreplaceable group of machines. Amounts are in CNY.','Over CNY 500,000, or imported/custom equipment','CNY 100,000–500,000','Below CNY 100,000 and easy to replace'],
 ['Is it a production bottleneck or an essential process?','Consider the effect on upstream and downstream operations.','Yes, its failure holds up the whole line','Partly critical, with limited alternatives','No, sufficient redundancy is available'],
 ['How easily can you obtain spare parts and repair support?','Consider lead times, service response and replacement availability.','Difficult: more than one month','Moderate: advance preparation is needed','Easy: local support is readily available'],
 ['What is the typical direct loss from one unplanned stoppage?','Estimate using downtime, output and margin. Amounts are in CNY.','Over CNY 50,000','CNY 10,000–50,000','Below CNY 10,000'],
 ['Does downtime affect customer deliveries or order commitments?','Consider delays, penalties, complaints or lost orders.','Yes, with penalties, complaints or lost-order risk','Possibly, but some delay can be accommodated','Little or no effect on deliveries'],
 ['Could equipment faults create quality, safety or environmental risks?','Consider consequences beyond lost production.','Yes, potentially serious quality or safety/environmental incidents','Some quality or site risks','Little additional risk'],
 ['Can you reliably collect operating data from critical equipment?','For example vibration, temperature, current, pressure, speed and alarms.','Yes, interfaces and key parameters are accessible','Partly: sensors or interface work are needed','Mostly not: closed interfaces or no data output'],
 ['How complete are your operating, maintenance and failure records?','Historical records help establish context and validate findings.','More than two years of reasonably complete records','Scattered records without a consistent structure','Almost none; mainly verbal or handwritten notes'],
 ['Can data be linked to specific machines, operating conditions and maintenance actions?','Traceable data supports analysis and verification.','Yes, data definitions and equipment records are consistent','Partly, with manual cleaning and preparation','No, data is fragmented and hard to trace'],
 ['Can the maintenance team interpret trends, alerts and basic condition analysis?','At least one person should be able to interpret and follow up alerts.','Yes, the team has analysis or diagnostic experience','Willing to learn, but experience is limited','Nobody currently has this capability or responsibility'],
 ['How open is the site team to data-informed maintenance?','Experience and data should support one another.','Very open to using data in decisions','Mixed; training and a pilot would help','Significant resistance; reactive maintenance is the norm'],
 ['Can production, procurement and management act together on alerts?','Consider maintenance windows, spare parts and responsibility for follow-up.','Yes, cross-team coordination works well','Some friction, but management is supportive','Difficult: production rarely acts on early warnings'],
 ],
 ja: [
 ['最も重要な設備の購入・更新費用はどの程度ですか？','中核設備1台、または代替困難な設備群を対象にしてください。金額は人民元です。','50万元超、または輸入・特注設備','10万〜50万元','10万元未満で、容易に交換できる'],
 ['その設備は生産のボトルネック、または不可欠な工程ですか？','停止時に前後の工程へ与える影響も考えてください。','はい。停止するとライン全体に影響する','一部で重要。代替手段は限られている','いいえ。十分な予備能力がある'],
 ['交換部品や修理サービスは容易に手配できますか？','部品納期、修理対応、代替設備の有無を考えてください。','難しい。部品・サービスの手配に1か月超','事前の準備が必要','容易。現地で迅速に対応できる'],
 ['突発停止1回あたりの直接損失はどの程度ですか？','停止時間、生産量、利益率から概算してください。金額は人民元です。','5万元超','1万〜5万元','1万元未満'],
 ['停止は納期や受注履行に影響しますか？','遅延に伴う違約金、苦情、失注などを考えてください。','はい。違約金・苦情・失注のリスクがある','影響する場合もあるが、調整の余地がある','納期への影響はほとんどない'],
 ['設備異常は品質・安全・環境リスクにつながりますか？','生産停止による損失以外の影響も考えてください。','重大な品質不良や安全・環境事故につながり得る','一定の品質・現場リスクがある','追加のリスクはほとんどない'],
 ['重要設備の運転データを安定して収集できますか？','振動、温度、電流、圧力、回転数、警報などが対象です。','はい。インターフェースと主要データを利用できる','一部可能。センサー追加や接続が必要','ほぼ不可能。接続が閉じている、または出力がない'],
 ['運転・保全・故障の履歴はどの程度ありますか？','履歴は設備状態の理解や診断結果の検証に役立ちます。','2年以上の比較的整った記録がある','記録はあるが、体系化されていない','ほぼなく、口頭や手書きが中心'],
 ['データを設備・運転条件・保全作業に関連付けられますか？','追跡可能なデータが分析と検証の基礎になります。','はい。データ定義と設備台帳が整っている','一部可能。手作業での整理が必要','できない。情報が分散し、追跡が難しい'],
 ['保全チームは傾向・警報・基本的な状態分析を理解できますか？','警報の意味を判断し、対応できる担当者が必要です。','はい。分析や状態診断の経験がある','学ぶ意欲はあるが、経験は少ない','現時点では担当できる人がいない'],
 ['現場はデータに基づく保全を受け入れていますか？','経験とデータを組み合わせて判断する姿勢を確認します。','積極的にデータを判断に活用したい','意見が分かれており、研修や試行が必要','抵抗が強く、故障後の修理が中心'],
 ['警報が出た後、生産・調達・管理部門は連携できますか？','保全時間の確保、部品手配、対応責任を考えてください。','はい。部門間の連携が円滑','多少の課題はあるが、管理層の支援がある','難しい。予兆に基づく停止への協力が得にくい'],
 ]
};
export const resultTranslations: Record<'en' | 'ja' | 'de' | 'ar', Record<string, [string,string]>> = {
 ...internationalResults,
 en:{
 immediate:['Prioritize a focused pilot','Start with one or two critical machines. Agree on data access and acceptance criteria, then verify the alert, inspection and maintenance workflow.'],
 pilot:['Start with a small pilot','Choose one critical machine, address data or coordination gaps, and validate with operating and maintenance feedback before expanding.'],
 postpone:['Build the foundations first','Organize equipment and failure records, identify data collection methods and assign a site owner before reassessing the investment.'],
 notNow:['Not a priority at this stage','For the equipment assessed, prioritize inspections, preventive maintenance and spare parts. Reassess when equipment or operating conditions change.'],
 pending:['More information is needed','Ask the equipment owner to clarify the unknown items before deciding how to proceed.']},
 ja:{
 immediate:['重点設備での試行を優先','重要設備1〜2台を選び、データ収集条件と評価基準を確認し、警報・現場確認・保全の流れを検証しましょう。'],
 pilot:['小規模な試行から開始','重要設備1台から始め、データや連携の課題を補い、運転・保全の実績で検証してから拡張を判断しましょう。'],
 postpone:['まず基礎条件を整備','設備・故障台帳、データ収集方法、現場担当者を整理してから、導入を再評価しましょう。'],
 notNow:['現段階での優先度は低め','今回の対象設備では点検・定期保全・予備品管理を優先し、設備構成や運転条件の変化時に再評価しましょう。'],
 pending:['追加情報が必要です','不明な項目を設備担当者と確認したうえで、進め方を判断しましょう。']}
};
