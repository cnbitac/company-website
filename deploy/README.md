# 腾讯云服务器部署

适用于装有 Nginx 的 Linux 轻量应用服务器或 CVM。Windows 服务器需要另配 IIS；不要直接套用本目录配置。

## 构建

使用 Node.js 22.13+ 和 pnpm，项目根目录执行：

```sh
pnpm install --frozen-lockfile
pnpm run build:static
```

输出在 `out/`。仅将该文件夹内容上传到服务器，不要将源码、node_modules 或原始公司资料放在网站目录。

## 安装与更新

1. 在服务器创建新的版本目录，例如 `/var/www/linkedti/releases/20260910`，上传 `out/` 的内容。
2. 首次上线时将 `/var/www/linkedti/current` 软链接指向该版本目录；后续更新先保留旧版，再切换软链接，便于回滚。
3. 首次部署可用 `nginx.conf` 提供 HTTP；签发证书后使用 `nginx-production.conf`。按服务器现有站点结构添加到 Nginx 的 `http` 配置中，避免覆盖其他站点。运行 `nginx -t`，成功后再 reload。
4. 正式配置使用 Certbot 为 `www.linkedti.com` 签发的证书。云防火墙需放行 TCP 80、443。将 `reload-nginx.sh` 安装到 `/etc/letsencrypt/renewal-hooks/deploy/linkedti-reload-nginx` 并设为可执行；启用 `certbot.timer`，通过续期测试后，HTTP 重定向到 HTTPS。
5. 核对腾讯云接入备案；域名在华为云注册可以继续保留，只需在实际 DNS 服务商配置解析。正式切换前核对已有解析，保留邮件 MX/TXT 等记录。
6. 更新 `app/site-metadata.ts` 中正式域名与索引开关，补充已核实的备案号及链接，然后重新构建发布。

## 验收

- 首页及中英日产品、应用、关于、联系页均可直接打开、刷新；不存在的地址返回 404。
- 手机布局、语言切换、产品入口、电话和邮件草稿可用。
- 当前联系表单不在服务器存储或自动发送询盘。
- 正式版本允许搜索引擎索引，canonical 使用 `https://www.linkedti.com`；`/brand` 和 `/en/brand` 是禁止索引的设计审阅页。

## 待落实

网站备案号为用户提供的 **皖ICP备2023008887号-2**，已加入中英日页脚并链接工信部查询。用户已确认腾讯云接入备案完成。

部署状态及服务器连接资料单独保存，不写入公开仓库。部署后需验证公网 HTTPS、全部语言页面、HTTP 跳转和证书自动续期。联系表单仅生成邮件草稿，邮箱收发需另行确认。请勿将密码、私钥或云账号密钥写入仓库。

官方说明：[腾讯云接入备案](https://cloud.tencent.com/document/product/243/43878)。
