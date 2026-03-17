---
layout: home

hero:
  name: Origami
  text: Gmail、Outlook、QQ 的统一收件箱
  tagline: 注重隐私、支持自托管，并围绕单用户工作流设计。
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/deployment
    - theme: alt
      text: 架构说明
      link: /zh/architecture
    - theme: alt
      text: GitHub
      link: https://github.com/theLucius7/Origami

features:
  - title: 统一收件箱
    details: 将多个账号的近期收件邮件聚合到同一条时间线中。
  - title: 本地化分拣
    details: Done、Archive、Snooze 仅保存在 Origami 本地，不会回写到邮件服务商。
  - title: 最小可用发信流程
    details: 可通过 Gmail 和 Outlook 撰写并发送新邮件，同时保留本地已发送记录。
  - title: R2 附件存储
    details: 大体积二进制附件放在 Cloudflare R2，元数据保存在 Turso。
  - title: 搜索语法
    details: 支持 account:、from:、subject:、is:read、is:done、is:archived、is:snoozed 等过滤器。
  - title: 面向自托管
    details: 设计目标是 Vercel + Turso + R2，并由单一 ACCESS_TOKEN 保护访问。
---

## Origami 是什么

Origami 是一个**单用户统一收件箱**。它不是共享式团队客服系统，也不打算完整复刻所有邮箱原生能力。

当前支持的提供商：

- **Gmail** — 读 + 发
- **Outlook** — 读 + 发
- **QQ 邮箱** — 目前仅支持通过 IMAP 读取

## 哪些状态是“本地”的

Origami 会把一些状态仅保存在自己的数据库里，而不是回写到源邮箱：

- Done
- Archive
- Snooze
- 本地已发送历史

这样做的好处是分拣逻辑更快、更统一，也不依赖某一家邮件提供商；代价是这些状态只存在于 Origami 内部。

## 阅读文档

- [架构说明](./architecture.md)
- [部署指南](./deployment.md)
- [项目结构](./project-structure.md)
