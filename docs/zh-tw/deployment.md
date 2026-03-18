# 部署指南

本頁說明 **Origami 正式環境部署** 的標準流程。

如果你只想先完成一套可上線的配置，請先看：

- [快速開始](/zh-tw/quick-start)

如果你要本地開發、除錯或修改程式碼，請改看：

- [開發與除錯](/zh-tw/development)

## 正式環境基線

推薦的正式部署組合：

- **執行環境**：Vercel
- **資料庫**：Turso / libSQL
- **物件儲存**：Cloudflare R2
- **登入方式**：GitHub OAuth App
- **信箱接入**：Gmail OAuth、Outlook OAuth、IMAP/SMTP

## 正式網域要求

在開始部署前，先確定最終正式網域，例如：

```txt
https://mail.example.com
```

該網域會同時用於：

- `NEXT_PUBLIC_APP_URL`
- GitHub OAuth callback
- Gmail OAuth callback
- Outlook OAuth callback

**這四處必須一致。**

## 必填環境變數

```txt
NEXT_PUBLIC_APP_URL=https://mail.example.com

GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GITHUB_ALLOWED_LOGIN=your-github-login

ENCRYPTION_KEY=64-char-hex-key
AUTH_SECRET=64-char-hex-key
CRON_SECRET=64-char-hex-key

TURSO_DATABASE_URL=...
TURSO_AUTH_TOKEN=...

R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=origami-attachments-prod
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

如果你想直接使用預設 OAuth app，再補上：

```txt
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
OUTLOOK_CLIENT_ID=...
OUTLOOK_CLIENT_SECRET=...
```

## 資料庫初始化

對於全新正式資料庫，建議執行：

```bash
npm install
npm run db:setup
```

說明：

- `db:setup` 適用於新環境
- `db:migrate` 適用於需要回放歷史 migration 的場景
- `db:push` 只適合你清楚知道自己在做什麼時使用

## Vercel 部署流程

建議按以下順序執行：

1. 將倉庫導入 Vercel
2. 設定正式環境變數
3. 綁定正式網域
4. 部署應用
5. 用正式網址完成首次登入

## 定時同步

`vercel.json` 內已定義同步入口：

```json
{
  "crons": [
    {
      "path": "/api/cron/sync",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

正式環境建議顯式設定 `CRON_SECRET`，不要只依賴自動派生值。

## 上線檢查清單

正式投入使用前，請至少確認：

- 正式網域可正常訪問
- GitHub 登入能順利回到 Origami
- `/setup` 可正常完成
- `/accounts` 頁面可正常開啟
- Gmail / Outlook OAuth 可完成授權與回跳
- IMAP/SMTP 帳號可新增
- 附件可正常上傳與下載
- 同步任務可正常執行
- 發信功能可正常使用

## 發布前驗證

```bash
npm run verify
```

這個指令會覆蓋：

- lint
- typecheck
- tests
- app build
- docs build
