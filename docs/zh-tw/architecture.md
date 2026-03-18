# 架構說明

## 總覽

Origami 可以拆成四個核心部分：

1. **Web UI**：Next.js App Router
2. **資料層**：Turso / libSQL + Drizzle ORM
3. **附件儲存**：Cloudflare R2
4. **Provider 層**：Gmail、Outlook、IMAP/SMTP

## 核心設計原則

### 1. 單使用者優先

Origami 目前是單使用者工具。這讓登入模型、資料邊界與部署流程都保持簡潔。

### 2. 本地生產力層優先

Origami 不把 Done / Archive / Snooze 硬映射到每個 provider 的原生語義，而是將它們定義為本地狀態。

### 3. 選擇性回寫

Read / Star 更接近信箱原生狀態，因此可依帳號選擇性回寫；如果 provider 或 scope 不支援，仍不阻塞本地操作。

### 4. metadata-first 同步

首次同步先拉標題、寄件者與摘要，正文與附件在真正打開郵件時再按需抓取。這能大幅降低首次接入成本。

## 同步語義

- 遠端已讀 / 星標狀態會在同步時保留
- Outlook 使用 delta 模式，而不是把一般分頁游標誤當增量游標
- 遠端刪除或移出 Inbox 的郵件，會在本地被標記為 `REMOTE_REMOVED`，預設不再顯示在 Inbox 主列表

## 發信流程

發信會經由對應 provider 或 SMTP 完成，然後把本地 sent history 寫入資料庫，讓 UI 能提供一致的送件記錄。
