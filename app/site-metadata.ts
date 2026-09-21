import type { Metadata } from "next";
import {internationalContent} from './international-content';
import {languagePath,type SiteLang} from './language-path';

// Official publication metadata; deploy with the verified HTTPS domain.
export const sitePublication = {
  origin: "https://www.linkedti.com",
  allowIndexing: true,
};

const pages = {
  home: [
    "工业设备状态监测与预测性维护",
    "Industrial Condition Monitoring & Predictive Maintenance",
    "交泰智能提供传感器、网关、设备健康软件与运维 Agent，将设备状态和诊断报警融入 PLC/DCS，支持预测性维护。",
    "LinkedTi provides sensors, gateways, equipment health software, and maintenance agents, integrating equipment status and diagnostic alarms with PLC/DCS systems.",
  ],
  products: [
    "产品与技术",
    "Products & Technology",
    "了解交泰智能 Aura 传感器、Conflux 网关、Euda 软件与工业运维 Agent，按现场需求组合监测、诊断与自动化接入能力。",
    "Explore Aura sensors, Conflux gateways, Euda software, and industrial maintenance agents for condition monitoring, diagnostics, and automation integration.",
  ],
  applications: [
    "行业应用与实践",
    "Industry Applications",
    "从轧机辊道轴承诊断到数据中心、半导体、化工及更多工业场景，了解交泰智能如何支持关键设备监测与维护。",
    "Explore a rolling mill bearing diagnostic project and applications in data centers, semiconductors, chemicals, and other industrial settings.",
  ],
  about: [
    "关于交泰",
    "About LinkedTi",
    "安徽交泰智能技术有限公司专注工业设备智能运维与预测性维护。了解交泰品牌故事、研发能力与工业自动化合作。",
    "Meet LinkedTi, a specialist in industrial equipment health and predictive maintenance. Discover our brand story, engineering capabilities, and automation integration.",
  ],
  contact: [
    "预测性维护应用评估",
    "Predictive Maintenance Readiness Assessment",
    "通过12道选择题，评估设备价值、停机影响、数据基础与团队能力。获取推进建议，留下一个联系方式即可与交泰智能交流。",
    "Answer 12 questions about equipment value, downtime impact, data and team readiness. See suggested next steps and leave one contact method for LinkedTi to follow up.",
  ],
  brand: [
    "品牌设计预览",
    "Brand Design Review",
    "交泰智能 Logo 与中英文组合标志设计预览。",
    "Review the LinkedTi mark and bilingual brand identity.",
  ],
} as const;

export type MetadataPage = keyof typeof pages;
const japanesePages = {
  home: ["産業設備の状態監視・故障診断・予知保全", "管理する手間を増やさず、現場の仕事をひとつ減らす。LinkedTi は設備状態監視、故障診断、PLC／DCS 連携で計画的な保全を支援します。"],
  products: ["製品・技術", "Aura センサー、Conflux ゲートウェイ、Euda 診断ソフトウェア、設備保全 AI Agent。既存設備と保全業務に合わせた構成をご提案します。"],
  applications: ["活用分野・導入事例", "鉄鋼のローラーテーブル導入事例と、データセンター、半導体、化学、空港、造船などにおける設備監視の活用をご紹介します。"],
  about: ["会社紹介", "安徽交泰智能技术有限公司（交泰智能 / LinkedTi）の事業、社名の由来、技術開発、ロゴの歩みをご紹介します。"],
  contact: ["予知保全の導入適合性評価", "12問の選択式で設備価値・停止影響・データ基盤・チーム体制を評価します。結果を確認し、連絡先を1つ残すだけで相談できます。"],
  brand: ["ブランド紹介", "交泰智能 / LinkedTi のブランドに込めた思い。"],
} as const;
export function metadataFor(page: MetadataPage, lang: SiteLang): Metadata {
  const intl = lang === 'de' || lang === 'ar' ? internationalContent[lang] : null;
  const intlTitle = intl ? ({home:intl.eyebrow,products:intl.nav[0],applications:intl.nav[1],about:intl.nav[2],contact:intl.talk,brand:intl.nav[2]})[page] : '';
  const intlDescription = intl ? ({home:intl.intro,products:intl.productsIntro,applications:intl.applicationsIntro,about:intl.aboutIntro,contact:intl.contactText,brand:intl.identityText})[page] : '';
  const en = lang === "en";
  const record = pages[page];
  const zhPath = page === "home" ? "/" : "/" + page;
  const enPath = page === "home" ? "/en" : "/en/" + page;
  const jaPath = page === "home" ? "/ja" : "/ja/" + page;
  const publicPage = page !== "brand";
  return {
    metadataBase: new URL(sitePublication.origin),
    title: `${intl ? intlTitle : lang === "ja" ? japanesePages[page][0] : record[en ? 1 : 0]} | ${lang === "zh" ? "交泰智能 LinkedTi" : "LinkedTi"}`,
    description: intl ? intlDescription : lang === "ja" ? japanesePages[page][1] : record[en ? 3 : 2],
    robots: {
      index: sitePublication.allowIndexing && publicPage,
      follow: sitePublication.allowIndexing && publicPage,
    },
    ...(publicPage
      ? {
          alternates: {
            canonical: languagePath(lang,page),
            languages: { "zh-CN": zhPath, en: enPath, ja: jaPath, de:languagePath('de',page), ar:languagePath('ar',page), "x-default": zhPath },
          },
        }
      : { alternates: null }),
  };
}
