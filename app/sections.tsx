"use client";
import { useState, type SubmitEvent } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Mail,
  Phone,
  MapPin,
  Network,
  Cpu,
  Factory,
  Server,
  FlaskConical,
  Plane,
  Layers,
  Construction,
  Flame,
  BatteryCharging,
  Microscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mark, Wordmark, productData, type PageKey } from "./site";
import industries from "./industry-data.json";
import Image from "next/image";
const icons = [
  Factory,
  Server,
  Cpu,
  FlaskConical,
  Plane,
  Layers,
  Construction,
  Flame,
  BatteryCharging,
  Microscope,
];
type Props = { page: PageKey; en: boolean; href: (p?: string) => string };
function PageIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="page-intro wrap">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="intro-body">{body}</p>
    </div>
  );
}
function BrandMeaning({ en }: { en: boolean }) {
  const t = (zh: string, english: string) => (en ? english : zh);
  const meanings = [
    [
      "01 / 圆融",
      "01 / A CONNECTED WHOLE",
      "从相交，到通达。",
      "Connection creates flow.",
      "圆形承接“交泰”所寄托的整体与和谐：设备、控制系统和运维人员彼此连接，共同服务于现场的有序运行。它也呼应交泰殿所承载的天地相交之意，将传统文化中的相通观念延伸到工业协作。",
      "The circle expresses the wholeness and harmony associated with Jiaotai. Equipment, control systems, and maintenance teams work together as a connected whole. It echoes the idea of union embodied by Jiaotai Dian, carrying a cultural idea of connection into industrial collaboration.",
    ],
    [
      "02 / 贯通",
      "02 / INTEGRATION",
      "让现场，接入同一条主线。",
      "Connect the field to a shared system.",
      "内部图形以一条横梁连接两条支撑线，表达将不同现场设备接入已有自动化体系。这个关系对应交泰的传感器、网关与 PLC / DCS 融合能力：让监测与诊断成为客户现有系统的一部分。",
      "A shared beam connects two supports, expressing the integration of field equipment into an existing automation environment. It reflects LinkedTi’s sensors, gateways, and PLC / DCS integration: monitoring and diagnostics become part of the customer’s established system.",
    ],
    [
      "03 / 工程",
      "03 / ENGINEERING",
      "用清晰结构，表达可靠工程。",
      "Clear structure. Reliable engineering.",
      "直线、等宽笔画和斜切收笔形成明确的工程秩序。π 的结构保留为对数学与算法的辅助联想；LinkedTi 则明确表达设备互联与可靠品质的追求。图形用于建立识别，完整的运维闭环由产品和实际工作来体现。",
      "Straight lines, consistent stroke weights, and an angled terminal establish an engineering character. The form retains a secondary association with π and computation, while LinkedTi expresses connection and reliable quality. The mark provides recognition; the full maintenance workflow is delivered through products and practice.",
    ],
  ];
  return (
    <section className="wrap brand-meaning">
      <p className="eyebrow">{t("标志中的连接观", "THE IDEA BEHIND THE MARK")}</p>
      <h2>{t("承交泰之意，连接设备与行动。", "From the idea of Jiaotai to connected action.")}</h2>
      <div className="brand-meaning-grid">
        {meanings.map(([labelZh, labelEn, titleZh, titleEn, bodyZh, bodyEn]) => (
          <article key={labelZh}>
            <span>{t(labelZh, labelEn)}</span>
            <h3>{t(titleZh, titleEn)}</h3>
            <p>{t(bodyZh, bodyEn)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
function Inquiry({ en }: { en: boolean }) {
  const [draft, setDraft] = useState("");
  const [subject, setSubject] = useState("");
  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState("");
  const [copyError, setCopyError] = useState(false);
  const t = (a: string, b: string) => (en ? b : a);
  function submit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const value = (key: string) => {
      const entry = f.get(key);
      return typeof entry === "string" ? entry.trim() : "";
    };
    const name = value("name"),
      company = value("company"),
      contact = value("contact"),
      needs = value("needs");
    if (!name || !company || !contact || !needs) {
      setFormError(
        t(
          "请填写姓名、公司、联系方式和设备需求，内容不能仅为空格。",
          "Please enter your name, company, contact details, and requirements. Fields cannot contain only spaces.",
        ),
      );
      return;
    }
    setFormError("");
    setCopyError(false);
    setSubject(t("技术交流需求 — ", "Technical inquiry — ") + company);
    setDraft(
      `${t("姓名", "Name")}: ${name}\n${t("公司", "Company")}: ${company}\n${t("联系方式", "Contact")}: ${contact}\n\n${t("设备与需求", "Equipment and requirements")}:\n${needs}`,
    );
    setCopied(false);
  }
  return (
    <div className="inquiry-panel">
      <h2>{t("聊聊你的设备与需求", "Tell us about your application")}</h2>
      <p className="muted">
        {t(
          "填写后生成咨询邮件，由你确认并通过邮箱发送。",
          "Prepare an inquiry email below, then review and send it from your email app.",
        )}
      </p>
      <form onSubmit={submit} className="inquiry-form">
        <div className="form-pair">
          <label htmlFor="name">
            {t("姓名", "Name")}
            <Input id="name" name="name" autoComplete="name" maxLength={80} required />
          </label>
          <label htmlFor="company">
            {t("公司", "Company")}
            <Input
              id="company"
              name="company"
              autoComplete="organization"
              maxLength={140}
              required
            />
          </label>
        </div>
        <label htmlFor="contact">
          {t("联系邮箱或电话", "Email or phone")}
          <Input id="contact" name="contact" maxLength={160} required />
        </label>
        <label htmlFor="needs">
          {t("设备与需求", "Equipment and requirements")}
          <Textarea
            id="needs"
            name="needs"
            rows={5}
            maxLength={2500}
            required
            placeholder={t(
              "例如：设备类型、目前的问题、已有 PLC 或 DCS 系统……",
              "For example: equipment type, current issue, and your existing PLC or DCS system…",
            )}
          />
        </label>
        <Button type="submit" className="button primary">
          {t("生成咨询邮件", "Prepare inquiry email")}
          <ArrowRight />
        </Button>
        {formError && (
          <p role="alert" className="form-note">
            {formError}
          </p>
        )}
        <p className="form-note">
          {t(
            "此表单在浏览器内整理内容，不会自动发送或保存你的信息。",
            "This form prepares text in your browser. It does not automatically send or store your information.",
          )}
        </p>
      </form>
      {draft && (
        <div className="draft-panel" aria-live="polite">
          <h3>{t("邮件已整理，尚未发送", "Your draft is ready. It has not been sent.")}</h3>
          <Textarea
            readOnly
            aria-label={t("咨询邮件正文", "Inquiry email text")}
            value={draft}
            rows={7}
          />
          <div className="actions">
            <a
              className="button primary"
              href={`mailto:sales@linkedti.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draft)}`}
            >
              {t("打开邮件应用", "Open email app")}
              <Mail size={18} />
            </a>
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(draft);
                  setCopied(true);
                  setCopyError(false);
                } catch {
                  setCopied(false);
                  setCopyError(true);
                }
              }}
            >
              {copied ? t("已复制", "Copied") : t("复制正文", "Copy text")}
            </Button>
          </div>
          {copyError && (
            <output className="form-note">
              {t(
                "浏览器未允许自动复制，请在上方正文框中选中并手动复制。",
                "Automatic copying was unavailable. Select the text above and copy it manually.",
              )}
            </output>
          )}
          <p className="form-note">
            {t(
              "若未配置邮件应用，可复制正文并发送至 sales@linkedti.com。",
              "If no email app is configured, copy the text and send it to sales@linkedti.com.",
            )}
          </p>
        </div>
      )}
    </div>
  );
}
export default function Secondary({ page, en, href }: Props) {
  const t = (a: string, b: string) => (en ? b : a);
  if (page === "products")
    return (
      <>
        <PageIntro
          eyebrow="PRODUCTS & TECHNOLOGY"
          title={t("连接设备健康的每一环。", "Connect every part of equipment health.")}
          body={t(
            "从传感器到运维智能体，按应用组合产品与能力，让数据采集、专业诊断和现场处理形成连续的工作流程。",
            "From sensors to maintenance agents, combine products and capabilities to connect data acquisition, expert diagnostics, and field action.",
          )}
        />
        <div className="product-jump wrap">
          {productData.map((p) => (
            <a key={p.id} href={"#" + p.id}>
              <p.Icon size={18} />
              {p.name}
              <ArrowUpRight size={15} />
            </a>
          ))}
        </div>
        <div className="wrap product-details">
          {productData.map((p, i) => {
            const features = [
              [
                [
                  "温振传感与电流检测产品",
                  "Temperature/vibration sensors and current sensing products",
                ],
                ["有线及无线连接配置", "Wired and wireless configurations"],
                ["面向设备趋势跟踪与诊断", "Data for condition trends and diagnostics"],
              ],
              [
                [
                  "传感器采集、边缘接入与局部逻辑",
                  "Sensor acquisition, edge integration, and local logic",
                ],
                [
                  "设备状态与报警接入 PLC/DCS",
                  "Equipment status and alarm integration with PLC/DCS",
                ],
                ["按需配置现场 HMI 与系统接口", "Optional local HMI and system interfaces"],
              ],
              [
                ["趋势、频谱与部件辅助分析", "Trend, spectrum, and component analysis"],
                ["可视化诊断规则与告警", "Visual diagnostic rules and alerts"],
                ["工单、巡检与维修验收", "Work orders, inspections, and repair acceptance"],
              ],
              [
                ["结合机理、诊断规则与大模型", "Equipment physics, rules, and language models"],
                ["串联分析、复核与报告编制", "Connect analysis, verification, and reporting"],
                ["关联处理记录与知识沉淀", "Connect maintenance records with reusable knowledge"],
              ],
            ][i];
            return (
              <section className="product-detail" id={p.id} key={p.id}>
                <div className={"product-symbol symbol-" + i}>
                  <p.Icon strokeWidth={0.8} />
                  <span>{p.code}</span>
                  <b>{p.name}</b>
                </div>
                <div>
                  <p className="eyebrow">{p.name.toUpperCase()}</p>
                  <h2>{t(p.zh, p.en)}</h2>
                  <p className="detail-body">{t(p.descZh, p.descEn)}</p>
                  <ul className="feature-list">
                    {features.map(([a, b]) => (
                      <li key={a}>
                        <Check size={17} />
                        {t(a, b)}
                      </li>
                    ))}
                  </ul>
                  <p className="detail-note">
                    {i < 2
                      ? t(
                          "具体接口与功能按型号、配置及项目需求确定。",
                          "Interfaces and functionality depend on the model, configuration, and project.",
                        )
                      : i === 3
                        ? t(
                            "流程按项目配置，现场复核与验收由相应人员完成。",
                            "Workflows depend on the project. Field verification and acceptance remain assigned to the relevant personnel.",
                          )
                        : t(
                            "功能按部署配置选用，可与现场运维流程衔接。",
                            "Features are selected for the deployment and connected to your maintenance workflows.",
                          )}
                  </p>
                  <a className="text-link" href={href("contact")}>
                    {t("讨论适用配置", "Discuss a suitable configuration")}
                    <ArrowRight size={17} />
                  </a>
                </div>
              </section>
            );
          })}
          <figure className="wide-screen screen-frame">
            <div className="window-bar">
              <span />
              <span />
              <span />
              <b>Euda / {t("运维工作台", "Maintenance workspace")}</b>
            </div>
            <Image
              unoptimized
              src="/images/euda-workspace.png"
              width={1268}
              height={647}
              loading="lazy"
              alt={t(
                "Euda工作台展示告警、设备与工单概览",
                "Euda workspace showing alarms, equipment, and work orders",
              )}
            />
            <figcaption>
              {t("软件操作手册界面示例", "Interface example from the software user manual")}
            </figcaption>
          </figure>
          <section className="workflow-section">
            <p className="eyebrow">CONNECT DATA TO ACTION</p>
            <h2>{t("让处理结果回到下一次判断。", "Let each outcome inform the next decision.")}</h2>
            <div className="workflow-steps">
              {[
                ["采集", "Sense"],
                ["诊断", "Diagnose"],
                ["预警", "Alert"],
                ["复核", "Verify"],
                ["维护", "Maintain"],
                ["验证", "Review"],
                ["知识", "Learn"],
              ].map(([a, b], i) => (
                <div key={a}>
                  <small>0{i + 1}</small>
                  <span>{t(a, b)}</span>
                  {i < 6 && <ArrowRight size={16} />}
                </div>
              ))}
            </div>
          </section>
        </div>
      </>
    );
  if (page === "applications")
    return (
      <>
        <PageIntro
          eyebrow="APPLICATIONS & EXPERIENCE"
          title={t("深入现场，解决具体问题。", "Industrial settings. Practical decisions.")}
          body={t(
            "围绕关键设备的健康变化，连接监测、诊断与维护安排。每个行业的现场不同，可靠的判断都需要数据和经验。",
            "Connect changing equipment conditions with diagnostics and maintenance planning. Every site is different; reliable decisions depend on data and experience.",
          )}
        />
        <div className="industry-grid wrap">
          {industries.map((p, i) => {
            const Icon = icons[i];
            return (
              <article
                className={"industry-card " + (i === 0 ? "featured-industry" : "")}
                key={p.industry}
              >
                <div className="industry-card-top">
                  <Icon size={28} strokeWidth={1.2} />
                  <span>
                    {i === 0 ? t("项目实践", "PROJECT EXPERIENCE") : t("行业应用", "APPLICATION")}
                  </span>
                </div>
                <p className="industry-name">{t(p.industry, p.industryEn)}</p>
                <h2>{t(p.title, p.titleEn)}</h2>
                <p>{t(p.body, p.bodyEn)}</p>
                {i === 0 && (
                  <p className="case-note">
                    {t(
                      "本项目作为既有 PLC 系统的功能补充，未使用 Agent。",
                      "This project complements an existing PLC system and did not use an AI agent.",
                    )}
                  </p>
                )}
                <a href={href("contact")} className="text-link">
                  {t("交流应用需求", "Discuss your application")}
                  <ArrowUpRight size={16} />
                </a>
              </article>
            );
          })}
        </div>
      </>
    );
  if (page === "about")
    return (
      <>
        <PageIntro
          eyebrow="ABOUT LINKEDTI"
          title={t("以连接为始，以可靠为本。", "Built on connection. Focused on reliability.")}
          body={t(
            "安徽交泰智能技术有限公司专注于工业设备状态监测、故障诊断与预测性维护，为工业用户、系统集成商和设备制造商提供软硬件产品与技术支持。",
            "LinkedTi specializes in industrial condition monitoring, fault diagnostics, and predictive maintenance, providing hardware, software, and technical support for industrial operators, system integrators, and OEMs.",
          )}
        />
        <section className="wrap about-story">
          <div className="brand-statement">
            <Mark />
            <Wordmark />
          </div>
          <div>
            <p className="eyebrow">THE NAME BEHIND THE TECHNOLOGY</p>
            <h2>{t("交而相通，连接万物。", "Connection creates understanding.")}</h2>
            <p>
              {t(
                "“交泰智能”中的“交泰”，源自《周易》泰卦。“天地交，泰”，表达天地相交、万物通达的意象。“交”意味着交流与连接，“泰”寄托着通达、安定与和谐的愿景。对我们而言，连接的价值，在于让信息流通，让协作发生。",
                "Jiaotai, the Chinese name behind LinkedTi, draws on the Tai hexagram in the I Ching: harmony emerges as heaven and earth connect. Jiao expresses exchange and connection; Tai evokes openness, stability, and harmony. For us, connection creates value by helping information flow and people work together.",
              )}
            </p>
            <p>
              {t(
                "北京故宫的交泰殿，也承载着这份寓意。它位于乾清宫与坤宁宫之间，是内廷后三宫的中殿，名称取自天地交泰之意。从传统文化走向工业现场，我们希望让设备互联互通，让数据、诊断与维护行动相互衔接。",
                "The same idea is reflected in Jiaotai Dian, the Hall of Union in Beijing’s Forbidden City. Situated between the Palace of Heavenly Purity and the Palace of Earthly Tranquility, its name evokes harmony between heaven and earth. We carry that idea into industry by connecting equipment, data, diagnostics, and maintenance action.",
              )}
            </p>
            <p>
              {t(
                "英文名称 LinkedTi 的灵感，来自 LinkedIn 所代表的人与人之间的连接。我们将这一想法延伸到设备之间：Linked 表达互联，Ti 是钛的元素符号，寄托对坚韧、稳定与可靠品质的追求。中文名承载连接的文化内涵，英文名表达让工业设备互联、让维护更有依据的技术方向。",
                "The name LinkedTi was inspired by the idea of people connecting through LinkedIn. We extend that idea to equipment: Linked stands for interconnection, while Ti is the chemical symbol for titanium, reflecting our pursuit of strength, stability, and reliable quality. Together, our Chinese and English names express one purpose: connected equipment and better-informed maintenance.",
              )}
            </p>
            <p className="story-source">
              {t("文化出处：", "Cultural references: ")}
              <a
                href="https://dict.revised.moe.edu.tw/dictView.jsp?ID=90963&la=0&powerMode=0"
                target="_blank"
                rel="noreferrer"
              >
                {t("“交泰”释义", "Jiaotai: meaning")}
              </a>
              <span> · </span>
              <a
                href="https://www.dpm.org.cn/explore/building/236467.html"
                target="_blank"
                rel="noreferrer"
              >
                {t("故宫博物院 · 交泰殿", "The Palace Museum · Hall of Union")}
              </a>
            </p>
          </div>
        </section>
        <BrandMeaning en={en} />
        <section className="section wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">ENGINEERING & COLLABORATION</p>
              <h2>
                {t("用工程能力，", "Engineering that")}
                <br />
                {t("建立长期信任。", "earns lasting trust.")}
              </h2>
            </div>
          </div>
          <div className="proof-grid">
            <article>
              <span>2024</span>
              <h3>{t("高新技术企业认定", "High-Tech Enterprise recognition")}</h3>
              <p>
                {t(
                  "于2024年获高新技术企业认定，持续投入工业设备监测与诊断技术研发。",
                  "Recognized as a High-Tech Enterprise in 2024, with continued development in industrial monitoring and diagnostics.",
                )}
              </p>
            </article>
            <article>
              <Cpu />
              <h3>{t("软件研发积累", "Software development")}</h3>
              <p>
                {t(
                  "拥有设备监测相关软件著作权，将数据分析、诊断与运维流程结合起来。",
                  "Software copyright registrations related to equipment monitoring support our development of analysis, diagnostics, and maintenance workflows.",
                )}
              </p>
            </article>
            <article>
              <Network />
              <h3>{t("工业自动化协同", "Industrial automation integration")}</h3>
              <p>
                {t(
                  "与西门子 PLC、DCS 形成方案融合，并围绕菲尼克斯 PLCnext 开展研发融合。",
                  "Solutions integrate with Siemens PLC and DCS environments, with development integration around Phoenix Contact PLCnext.",
                )}
              </p>
            </article>
          </div>
        </section>
        <section className="wrap partner-types">
          <p className="eyebrow">WORK WITH LINKEDTI</p>
          <div>
            {[
              [
                "工业用户",
                "Industrial operators",
                "围绕关键设备，建立监测与维护能力。",
                "Build monitoring and maintenance capabilities around critical assets.",
              ],
              [
                "系统集成商",
                "System integrators",
                "组合产品、接口与诊断能力，支持项目交付。",
                "Combine products, interfaces, and diagnostics for project delivery.",
              ],
              [
                "设备制造商",
                "Equipment manufacturers",
                "将设备健康能力融入整机与服务体系。",
                "Integrate equipment health into machine delivery and services.",
              ],
            ].map(([a, b, c, d]) => (
              <article key={a}>
                <h3>{t(a, b)}</h3>
                <p>{t(c, d)}</p>
              </article>
            ))}
          </div>
        </section>
      </>
    );
  if (page === "contact")
    return (
      <>
        <PageIntro
          eyebrow="LET’S CONNECT"
          title={t("从你的现场问题开始。", "Start with the challenge at your site.")}
          body={t(
            "告诉我们设备类型、遇到的问题和已有控制系统，一起讨论适合现场的监测与诊断方案。",
            "Tell us about your equipment, the issue you are investigating, and your existing control system. We will discuss an approach that fits your site.",
          )}
        />
        <section className="wrap contact-layout">
          <aside className="contact-info">
            <a href="mailto:sales@linkedti.com">
              <Mail />
              <small>{t("邮箱", "EMAIL")}</small>
              <b>sales@linkedti.com</b>
            </a>
            <a href="tel:+8613951419340">
              <Phone />
              <small>{t("电话", "PHONE")}</small>
              <b>+86 139 5141 9340</b>
            </a>
            <div>
              <MapPin />
              <small>{t("地址", "ADDRESS")}</small>
              <b>
                {t(
                  "安徽省合肥市高新区红宝石R栋",
                  "Building R, Hongbaoshi, High-tech Zone, Hefei, Anhui, China",
                )}
              </b>
            </div>
          </aside>
          <Inquiry en={en} />
        </section>
      </>
    );
  if (page === "brand")
    return (
      <>
        <PageIntro
          eyebrow="LINKEDTI / BRAND REFINEMENT"
          title={t("连接，融入系统。", "Connection within the system.")}
          body={t(
            "本轮提案保留一个外圆，内部由共用横梁、两条支撑线与一个斜切收笔构成。沿用蓝色及“中文在上、英文在下”的排版，让图形清晰地表达接入、协同与工程秩序。",
            "This proposal retains a single outer circle and introduces a shared beam, two supports, and one angled terminal. The established blue and Chinese-first wordmark express integration, collaboration, and engineering clarity.",
          )}
        />
        <section className="wrap brand-options">
          <article className="brand-option">
            <div className="brand-option-heading">
              <span>{t("01 / 原有标志", "01 / ORIGINAL MARK")}</span>
            </div>
            <div className="brand-original">
              <Image
                unoptimized
                src="/brand/original.png"
                width={328}
                height={92}
                alt={t("交泰智能原有蓝色 Logo", "Original blue LinkedTi logo")}
              />
            </div>
            <h2>{t("保留已有的识别。", "Preserve recognition.")}</h2>
            <p>
              {t(
                "圆形外框、内部线条与蓝色，是原有标志最鲜明的识别要素。品牌含义围绕这些已有元素展开，承接“交泰”的文化背景与 LinkedTi 的设备互联愿景。",
                "The circular outline, internal strokes, and blue color are the original mark’s defining features. The brand interpretation develops these existing elements through the cultural meaning of Jiaotai and LinkedTi’s vision of connected equipment.",
              )}
            </p>
          </article>
          <article className="brand-option">
            <div className="brand-option-heading">
              <span>{t("02 / 本轮提案", "02 / NEW PROPOSAL")}</span>
              <b>{t("设计预览", "DESIGN PREVIEW")}</b>
            </div>
            <div className="brand-specimen">
              <Mark />
              <Wordmark />
            </div>
            <div className="brand-light">
              <Mark />
              <Wordmark />
            </div>
            <h2>{t("以连接，承载交泰之意。", "A shared idea of connection.")}</h2>
            <p>
              {t(
                "外圆承接既有品牌的整体轮廓，内部主线将两端连为一体，呼应“让设备健康管理融入工业自动化”。直角与斜切增强轮廓辨识度，中文名称保持视觉主导。",
                "The outer circle preserves the familiar silhouette. A shared line connects two ends, reflecting equipment health integrated into industrial automation. Right angles and one diagonal terminal create a clear profile, paired with the Chinese-led wordmark.",
              )}
            </p>
            <a href="/brand/logo-a.svg" download className="text-link">
              {t("下载优化版矢量图形", "Download the refined vector mark")}
              <ArrowUpRight size={16} />
            </a>
            <a
              href="/brand/linkedti-lockup.svg"
              download
              className="text-link"
              style={{ display: "flex", marginTop: 16 }}
            >
              {t("下载中英文组合标志", "Download the bilingual logo")}
              <ArrowUpRight size={16} />
            </a>
          </article>
        </section>
        <BrandMeaning en={en} />
        <section className="wrap design-references">
          <h2>{t("参考的方法", "Methods behind the proposal")}</h2>
          <p>
            {t(
              "从成熟品牌中吸收比例、网格和应用方法，再根据交泰的原标与工业业务独立构图。",
              "Proportion, grids, and application principles inform a composition developed from LinkedTi’s own identity and industrial work.",
            )}
          </p>
          <div>
            <a
              href="https://www.ibm.com/design/language/ibm-logos/8-bar/"
              target="_blank"
              rel="noreferrer"
            >
              <b>IBM</b>
              <span>
                {t(
                  "关注视觉重量、正反色和小尺寸清晰度。",
                  "Attention to visual weight, positive and reversed versions, and clarity at small sizes.",
                )}
              </span>
              <ArrowUpRight size={18} />
            </a>
            <a href="https://www.pentagram.com/work/mit-media-lab" target="_blank" rel="noreferrer">
              <b>MIT Media Lab / Pentagram</b>
              <span>
                {t(
                  "用统一网格延续原有识别，并形成一致的系统。",
                  "A consistent grid carries recognition forward and creates a coherent identity system.",
                )}
              </span>
              <ArrowUpRight size={18} />
            </a>
          </div>
          <a
            className="text-link"
            href="/brand/proposal-angular.png"
            target="_blank"
            rel="noreferrer"
          >
            {t("查看完整提案图", "View the proposal sheet")}
            <ArrowUpRight size={18} />
          </a>
        </section>
      </>
    );
  return null;
}
