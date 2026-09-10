"use client";
import { useEffect } from "react";
import Image from "next/image";
import Secondary from "./sections";
import brandDesign from "./brand-design.json";
import {
  ArrowUpRight,
  ArrowRight,
  Activity,
  Network,
  Cpu,
  Workflow,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
export type PageKey = "home" | "products" | "applications" | "about" | "contact" | "brand";
export function Mark() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className="brand-mark">
      <rect width="64" height="64" rx="10" fill={brandDesign.blue} />
      <circle
        cx="32"
        cy="32"
        r={brandDesign.circleRadius}
        stroke="white"
        strokeWidth={brandDesign.circleStroke}
      />
      <path d={brandDesign.symbolPath} fill="white" />
    </svg>
  );
}
export function Wordmark() {
  return (
    <span className="brand-type">
      <span className="brand-chinese">交泰智能</span>
      <small>LinkedTi</small>
    </span>
  );
}
export const productData = [
  {
    name: "Aura",
    id: "aura",
    code: "01 / SENSING",
    Icon: Activity,
    zh: "工业传感器",
    en: "Industrial sensors",
    descZh: "采集温度、振动与电流等状态信息，为设备趋势跟踪与故障分析提供现场依据。",
    descEn:
      "Capture temperature, vibration, and current measurements to support condition trends and fault analysis.",
  },
  {
    name: "Conflux",
    id: "conflux",
    code: "02 / CONNECTIVITY",
    Icon: Network,
    zh: "工业网关",
    en: "Industrial gateways",
    descZh: "连接传感器与现有自动化系统，按配置执行局部逻辑，并向 PLC/DCS 提供设备状态与报警。",
    descEn:
      "Connect sensors to existing automation, execute configured local logic, and provide equipment status and alarms to PLC/DCS systems.",
  },
  {
    name: "Euda",
    id: "euda",
    code: "03 / INTELLIGENCE",
    Icon: Cpu,
    zh: "设备健康与运维软件",
    en: "Equipment health software",
    descZh: "结合专业分析与诊断规则，将设备监测衔接到工单和维护记录。",
    descEn:
      "Bring analysis and diagnostic rules together with work orders and maintenance records.",
  },
  {
    name: "Agent",
    id: "agent",
    code: "04 / COLLABORATION",
    Icon: Workflow,
    zh: "工业运维智能体",
    en: "Industrial maintenance AI",
    descZh: "融合设备机理与大模型，串联分析、现场复核、报告与知识沉淀，持续积累可复用的运维经验。",
    descEn:
      "Combine equipment physics and language models to connect analysis, field verification, reporting, and reusable maintenance knowledge.",
  },
];
function FlowVisual({ en }: { en: boolean }) {
  return (
    <figure
      className="flow-visual"
      aria-label={
        en
          ? "Architecture: sensing, edge integration, diagnostics, and maintenance feedback"
          : "架构示意：现场感知、边缘接入、智能诊断与运维反馈"
      }
    >
      <div className="flow-grid" />
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="visual-caption">
        <span className="signal-dot" />
        {en ? "CONNECTED MAINTENANCE" : "工业设备 · 智能协同"}
        <span>LinkedTi</span>
      </div>
      <svg className="flow-lines" viewBox="0 0 620 520" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="flowGradient">
            <stop stopColor="#5892ff" />
            <stop offset="1" stopColor="#91bfff" />
          </linearGradient>
        </defs>
        <path
          d="M85 165H180Q210 165 235 195L310 260L450 120M85 370H170Q205 370 230 335L310 260L485 365M450 120H520V365H485"
          stroke="url(#flowGradient)"
          strokeWidth="1.5"
        />
        <path
          className="flow-trace"
          d="M85 165H180Q210 165 235 195L310 260L485 365"
          stroke="#c3dcff"
          strokeWidth="3"
          strokeDasharray="8 240"
        />
      </svg>
      <div className="flow-node node-sensor">
        <Activity />
        <div>
          <b>Aura</b>
          <span>{en ? "Field sensing" : "现场感知"}</span>
        </div>
      </div>
      <div className="flow-node node-edge">
        <Network />
        <div>
          <b>Conflux</b>
          <span>PLC / DCS</span>
        </div>
      </div>
      <div className="flow-core">
        <div className="core-mark">
          <Mark />
        </div>
        <Wordmark />
        <span>{en ? "Equipment intelligence" : "设备健康智能"}</span>
      </div>
      <div className="flow-node node-software">
        <Cpu />
        <div>
          <b>Euda</b>
          <span>{en ? "Diagnostics" : "智能诊断"}</span>
        </div>
      </div>
      <div className="flow-node node-agent">
        <Workflow />
        <div>
          <b>Agent</b>
          <span>{en ? "Maintenance workflow" : "运维协同"}</span>
        </div>
      </div>
      <div className="visual-foot">
        <span>{en ? "SENSE → UNDERSTAND → ACT" : "感知 → 理解 → 行动"}</span>
        <span>{en ? "Architecture overview" : "技术架构示意"}</span>
      </div>
    </figure>
  );
}

export default function Site({ page, lang }: { page: PageKey; lang: "zh" | "en" }) {
  const en = lang === "en";
  const t = (zh: string, english: string) => (en ? english : zh);
  const href = (p = "") => `${en ? "/en" : ""}/${p}`.replace(/\/$/, "") || "/";
  useEffect(() => {
    document.documentElement.lang = en ? "en" : "zh-CN";
  }, [en]);
  const nav = [
    ["products", "产品与技术", "Products"],
    ["applications", "行业应用", "Applications"],
    ["about", "关于交泰", "About"],
  ] as const;
  return (
    <div lang={en ? "en" : "zh-CN"}>
      <a href="#main" className="skip-link">
        {t("跳转至正文", "Skip to content")}
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a href={href()} className="brand" aria-label={t("交泰智能首页", "LinkedTi home")}>
            <Mark />
            <Wordmark />
          </a>
          <nav className="desktop-nav" aria-label={t("主导航", "Main navigation")}>
            {nav.map(([p, zh, eng]) => (
              <a href={href(p)} key={p} aria-current={page === p ? "page" : undefined}>
                {t(zh, eng)}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <a
              className="language"
              href={`${en ? "" : "/en"}${page === "home" ? "" : `/${page}`}` || "/"}
              lang={en ? "zh-CN" : "en"}
            >
              {en ? "中文" : "EN"}
              <span>↗</span>
            </a>
            <a className="header-cta" href={href("contact")}>
              {t("技术交流", "Let’s talk")}
              <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
        <nav className="mobile-nav" aria-label={t("移动导航", "Mobile navigation")}>
          {nav.map(([p, zh, eng]) => (
            <a key={p} href={href(p)} aria-current={page === p ? "page" : undefined}>
              {t(zh, eng)}
            </a>
          ))}
        </nav>
      </header>
      <main id="main">
        {page === "home" ? (
          <>
            <section className="hero wrap">
              <div className="hero-copy">
                <div className="eyebrow">
                  <span />
                  {t(
                    "工业设备状态监测与预测性维护",
                    "CONDITION MONITORING & PREDICTIVE MAINTENANCE",
                  )}
                </div>
                <h1 className="brand-promise">
                  {t("不是多一件事要管，", "Not one more thing to manage.")}
                  <br />
                  <em>{t("而是少一件事要做。", "One less thing to do.")}</em>
                </h1>
                <p>
                  {t(
                    "让设备健康管理融入现有自动化系统。交泰智能结合设备机理与 AI，提前发现异常、辅助故障诊断，让运维少些反复排查，多些从容安排。",
                    "Bring equipment health into your existing automation. LinkedTi combines equipment physics and AI to detect emerging problems and support fault diagnosis—so maintenance teams spend less time troubleshooting and more time planning ahead.",
                  )}
                </p>
                <div className="actions">
                  <a className="button primary" href={href("products")}>
                    {t("探索产品与技术", "Explore our technology")}
                    <ArrowUpRight size={19} />
                  </a>
                  <a className="text-link" href={href("contact")}>
                    {t("与技术团队交流", "Talk to our team")}
                    <ArrowRight size={18} />
                  </a>
                </div>
                <div className="hero-notes">
                  <span>PLC / DCS</span>
                  <span>{t("机理 + AI", "PHYSICS + AI")}</span>
                  <span>{t("运维闭环", "MAINTENANCE WORKFLOWS")}</span>
                </div>
              </div>
              <FlowVisual en={en} />
            </section>
            <div className="principle-bar">
              <div className="wrap">
                <span>
                  {t("立足现场，连接智能。", "Built for the field. Connected by intelligence.")}
                </span>
                <p>
                  Aura <i>→</i> Conflux <i>→</i> Euda <i>→</i> Agent
                </p>
              </div>
            </div>
            <section className="section wrap" id="products">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">01 / {t("产品体系", "PRODUCT ECOSYSTEM")}</p>
                  <h2>
                    {t("从现场感知，", "From the field,")}
                    <br />
                    {t("到智能协同。", "to intelligent action.")}
                  </h2>
                </div>
                <p>
                  {t(
                    "按现场需求组合传感器、网关、软件与 AI 能力，融入客户已有的自动化和运维体系。",
                    "Combine sensors, gateways, software, and AI to fit your site and work within your existing automation and maintenance systems.",
                  )}
                </p>
              </div>
              <div className="product-grid">
                {productData.map((p) => (
                  <a className="product-card" key={p.id} href={href("products") + "#" + p.id}>
                    <div className="product-top">
                      <p.Icon size={28} />
                      <ArrowUpRight size={20} />
                    </div>
                    <span className="micro">{p.code}</span>
                    <h3>{p.name}</h3>
                    <h4>{t(p.zh, p.en)}</h4>
                    <p>{t(p.descZh, p.descEn)}</p>
                  </a>
                ))}
              </div>
            </section>
            <section className="integration-section wrap">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">PLC / DCS INTEGRATION</p>
                  <h2>
                    {t("状态进系统，维护有依据。", "Connected status. Informed maintenance.")}
                  </h2>
                </div>
                <p>
                  {t(
                    "让设备健康诊断融入现有自动化体系：结合转速、负载等工况理解异常，把诊断依据送回熟悉的操作界面。生产控制与健康诊断共享信息，各自保持清晰的执行边界。",
                    "Bring equipment health into existing automation: interpret anomalies in the context of speed and load, and return diagnostic evidence to familiar operator interfaces. Production control and health diagnostics share information while retaining separate execution responsibilities.",
                  )}
                </p>
              </div>
              <div className="integration-grid">
                {[
                  [
                    "01 / 现场端",
                    "01 / AT THE EDGE",
                    "采集与局部处理",
                    "Sensing and local processing",
                    "采集振动等设备信号，按现场条件关联转速、负载与运行模式。自研终端执行配置好的局部逻辑，为异常分析提供工况背景。",
                    "Capture equipment signals such as vibration and, where available, associate speed, load, and operating mode. Our terminals execute configured local logic to give anomaly analysis its operating context.",
                  ],
                  [
                    "02 / 控制端",
                    "02 / IN AUTOMATION",
                    "接入既有控制系统",
                    "Connect to existing control",
                    "向客户 PLC/DCS 提供状态和报警，与西门子 PLC/DCS 融合，并围绕菲尼克斯 PLCnext 开展研发融合。",
                    "Provide status and alarms to customer PLC/DCS systems, integrate with Siemens environments, and develop integration around Phoenix Contact PLCnext.",
                  ],
                  [
                    "03 / 运维端",
                    "03 / IN MAINTENANCE",
                    "衔接诊断与现场行动",
                    "Connect diagnosis to action",
                    "通过软件与按项目配置的 Agent 流程，关联诊断、现场复核和维护记录。人员确认处理结果，经验回到知识库。",
                    "Software and project-configured agent workflows connect diagnostics, field verification, and maintenance records. People confirm the outcome, and the experience becomes reusable knowledge.",
                  ],
                ].map(([a, b, c, d, e, f]) => (
                  <article key={a}>
                    <span>{t(a, b)}</span>
                    <h3>{t(c, d)}</h3>
                    <p>{t(e, f)}</p>
                  </article>
                ))}
              </div>
            </section>
            <section className="software-section">
              <div className="wrap software-layout">
                <div>
                  <p className="eyebrow">02 / {t("设备智能", "EQUIPMENT INTELLIGENCE")}</p>
                  <h2>
                    {t("看见变化，", "See the change.")}
                    <br />
                    {t("理解原因。", "Understand the cause.")}
                  </h2>
                  <p className="muted">
                    {t(
                      "让状态数据成为维护的依据。通过趋势、频谱与诊断规则，帮助现场团队缩小排查范围。",
                      "Make condition data useful for maintenance. Trends, spectra, and diagnostic rules help teams focus their investigation.",
                    )}
                  </p>
                  <a className="text-link" href={href("products") + "#euda"}>
                    {t("了解 Euda 软件", "Discover Euda")}
                    <ArrowRight size={18} />
                  </a>
                </div>
                <figure className="screen-frame">
                  <div className="window-bar">
                    <span />
                    <span />
                    <span />
                    <b>Euda / {t("设备状态总览", "Equipment overview")}</b>
                  </div>
                  <Image
                    unoptimized
                    src="/images/euda-overview.png"
                    alt={t(
                      "软件手册中的设备状态概览界面",
                      "Equipment status overview from the software manual",
                    )}
                    width={1267}
                    height={576}
                    loading="lazy"
                  />
                  <figcaption>
                    {t("软件操作手册界面示例", "Interface example from the software user manual")}
                  </figcaption>
                </figure>
              </div>
            </section>
            <section className="section wrap">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">03 / {t("项目实践", "IN PRACTICE")}</p>
                  <h2>
                    {t("把诊断，", "Diagnostics,")}
                    <br />
                    {t("带回现场验证。", "verified in the field.")}
                  </h2>
                </div>
              </div>
              <a className="case-feature" href={href("applications")}>
                <div className="case-marker">
                  <span>Fe</span>
                  <small>STEEL INDUSTRY</small>
                </div>
                <div>
                  <span className="pill">
                    {t("钢铁 · 真实项目实践", "STEEL · PROJECT EXPERIENCE")}
                  </span>
                  <h3>
                    {t(
                      "巡检未见明显异常，检修确认轴承损伤。",
                      "No obvious signs on inspection. Bearing damage confirmed during maintenance.",
                    )}
                  </h3>
                  <p>
                    {t(
                      "交泰通过振动监测与故障分析识别轧机辊道轴承损伤线索。随后拆检确认滚珠损伤，客户及时完成更换。",
                      "Vibration monitoring and analysis identified signs of bearing damage in a rolling mill roller table. A subsequent inspection confirmed damage to the bearing balls, and the customer replaced the bearing.",
                    )}
                  </p>
                </div>
                <ArrowUpRight className="case-arrow" />
              </a>
            </section>
          </>
        ) : (
          <Secondary page={page} en={en} href={href} />
        )}
        {page !== "contact" && (
          <section className="contact-band wrap">
            <div>
              <p className="eyebrow">LET’S CONNECT</p>
              <h2>
                {t("从一台关键设备，", "Start with one")}
                <br />
                {t("开始交流。", "critical asset.")}
              </h2>
            </div>
            <a className="button primary" href={href("contact")}>
              {t("讨论你的应用", "Discuss your application")}
              <ArrowUpRight size={20} />
            </a>
          </section>
        )}
      </main>
      <footer className="wrap">
        <div className="footer-top">
          <a className="brand" href={href()}>
            <Mark />
            <Wordmark />
          </a>
          <p>{t("不是多一件事要管，而是少一件事要做。", "Not one more thing to manage. One less thing to do.")}</p>
          <div>
            <a href="mailto:sales@linkedti.com">
              <Mail size={16} />
              sales@linkedti.com
            </a>
            <a href="tel:+8613951419340">
              <Phone size={16} />
              +86 139 5141 9340
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()}{" "}
            {t("安徽交泰智能技术有限公司", "LinkedTi. All rights reserved.")}
          </span>
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
            皖ICP备2023008887号-2
          </a>
          <span>
            <MapPin size={14} />
            {t("安徽省合肥市高新区红宝石R栋", "Building R, Hongbaoshi, Hefei, Anhui, China")}
          </span>
        </div>
      </footer>
    </div>
  );
}
