# 交泰智能 LinkedTi 网站

中文优先的中、英、日三语企业网站，包含首页、产品、行业应用、公司介绍和联系方式。

日文入口为 `/ja`，包括 `/ja/products`、`/ja/applications`、`/ja/about`、`/ja/contact`。日文内容在 `app/japanese.tsx` 中维护。产品软件截图仍为中文界面，网站未承诺软件或技术服务已支持日文。

## 内容边界

- 产品按 Aura、Conflux、Euda 与工业运维 Agent 系列展示，具体规格由项目配置确定。
- 钢厂辊道案例为已确认项目；其他行业卡片为应用描述。钢厂案例未使用 Agent。
- 联系表单只在浏览器中生成邮件草稿，不会自动发送或保存询盘。访客可使用邮件应用、复制正文或直接拨打电话。
- 原始合同、投标文件、安装手册和证书扫描不包含在网站中。
- `/brand` 为品牌设计审阅页，不出现在主导航与站点地图中。

## 公开上线前

1. 域名在华为云，用户确认已备案；拟使用现有腾讯云轻量服务器或 CVM。核对备案号、接入商及服务器信息。
2. 确认 `sales@linkedti.com` 可收发邮件；在真实部署环境检查邮件、电话入口。
3. 将 `app/site-metadata.ts` 的 `sitePublication.origin` 改为正式 HTTPS 域名，并在对外发布时启用 `allowIndexing`。当前审阅版本禁止搜索引擎索引。
4. 保留英文品牌 LinkedTi；完整英文公司名称及地址翻译在正式物料中另行核对。
5. 品牌组合 SVG 的文字使用字体，交付印刷前需确认字体与转曲文件。

## 维护

- `app/site.tsx`：首页、导航、页脚、产品概述与品牌组件。
- `app/sections.tsx`：其他页面与询盘邮件草稿。
- `app/industry-data.json`：十个行业应用的中英文内容。
- `app/brand-design.json`：当前 Logo 图形参数。
- `app/site-metadata.ts`：中英文标题、描述、页面对应关系及发布状态。
- `app/globals.css`：蓝色视觉风格与响应式布局。

沿用 pnpm 锁文件和现有构建脚本。工作区本地预览使用 Vinext，发布构建使用兼容 Cloudflare Workers 的输出。

腾讯云部署使用 `pnpm run build:static`，上传生成的 `out/`。详见 [部署说明](deploy/README.md)。
