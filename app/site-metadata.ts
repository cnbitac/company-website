import type { Metadata } from "next";

// Keep the review release out of search results. Set the official origin and
// enable indexing together when the public domain is ready to launch.
export const sitePublication = {
  origin: "https://linkedti-industrial.weichen-zhao.chatgpt.site",
  allowIndexing: false,
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
    "技术交流",
    "Contact Our Team",
    "联系交泰智能讨论设备监测、故障诊断与 PLC/DCS 接入需求。电话 13951419340，邮箱 sales@linkedti.com。",
    "Discuss condition monitoring, fault diagnostics, and PLC/DCS integration with LinkedTi. Call +86 139 5141 9340 or email sales@linkedti.com.",
  ],
  brand: [
    "品牌设计预览",
    "Brand Design Review",
    "交泰智能 Logo 与中英文组合标志设计预览。",
    "Review the LinkedTi mark and bilingual brand identity.",
  ],
} as const;

export type MetadataPage = keyof typeof pages;
export function metadataFor(page: MetadataPage, lang: "zh" | "en"): Metadata {
  const en = lang === "en";
  const record = pages[page];
  const zhPath = page === "home" ? "/" : "/" + page;
  const enPath = page === "home" ? "/en" : "/en/" + page;
  const publicPage = page !== "brand";
  return {
    metadataBase: new URL(sitePublication.origin),
    title: `${record[en ? 1 : 0]} | ${en ? "LinkedTi" : "交泰智能 LinkedTi"}`,
    description: record[en ? 3 : 2],
    robots: {
      index: sitePublication.allowIndexing && publicPage,
      follow: sitePublication.allowIndexing && publicPage,
    },
    ...(publicPage
      ? {
          alternates: {
            canonical: en ? enPath : zhPath,
            languages: { "zh-CN": zhPath, en: enPath, "x-default": zhPath },
          },
        }
      : { alternates: null }),
  };
}
