# 快速開始

本頁只說明 **正式環境部署的最短可用路徑**。

如果你的目標是本地開發、除錯、修改程式碼或驗證 OAuth callback，請不要沿用本頁流程，直接查看：

- [開發與除錯](/zh-tw/development)

## 推薦部署組合

Origami 目前最穩定的正式環境組合是：

- **應用執行環境**：Vercel
- **資料庫**：Turso / libSQL
- **附件儲存**：Cloudflare R2
- **登入方式**：GitHub OAuth App
- **信箱接入**：Gmail OAuth、Outlook OAuth、IMAP/SMTP

## 部署前準備

開始之前，請先準備以下資源：

- 一個正式網域，例如 `mail.example.com`
- 一個 Turso 資料庫
- 一個 Cloudflare R2 bucket
- 一個 GitHub OAuth App（用於登入 Origami）
- 若要接入 Gmail 或 Outlook，對應的 OAuth app

建議按以下順序準備：

1. [建立 Turso 資料庫](/zh-tw/turso)
2. [設定 Cloudflare R2](/zh-tw/r2-storage)
3. [設定 GitHub 登入](/zh-tw/github-auth)
4. [依需求設定 Gmail OAuth](/zh-tw/gmail-oauth)
5. [依需求設定 Outlook OAuth](/zh-tw/outlook-oauth)

## 第 1 步：準備正式環境變數

在專案根目錄複製模板：

```bash
cp .env.example .env
```

然後生成密鑰：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

把產生的 64 位十六進位字串填入 `ENCRYPTION_KEY`。若你要單獨設定 `AUTH_SECRET` 或 `CRON_SECRET`，也建議各自產生新的隨機值。

最少需要填入：

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

若要直接啟用 Gmail / Outlook OAuth，再補上：

```txt
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
OUTLOOK_CLIENT_ID=...
OUTLOOK_CLIENT_SECRET=...
```

## 第 2 步：完成正式網域對應的 OAuth 設定

所有 OAuth callback 都必須使用 **最終正式網域**，並與 `NEXT_PUBLIC_APP_URL` 完全一致。

- GitHub callback：`https://mail.example.com/api/auth/github/callback`
- Gmail callback：`https://mail.example.com/api/oauth/gmail`
- Outlook callback：`https://mail.example.com/api/oauth/outlook`

## 第 3 步：安裝依賴並初始化資料庫

```bash
npm install
npm run db:setup
```

對於全新資料庫，`db:setup` 是推薦入口。

## 第 4 步：部署到 Vercel

建議流程：

1. 將倉庫導入 Vercel
2. 在 Vercel 中填入與本地一致的正式環境變數
3. 綁定正式網域
4. 觸發部署

## 第 5 步：執行發版前驗證

```bash
npm run verify
```

這會依序執行：

- lint
- typecheck
- tests
- app build
- docs build

## 第 6 步：完成首次登入與初始化

部署完成後，打開你的正式網址，依序完成：

1. 使用 GitHub 登入
2. 完成 `/setup`
3. 打開 `/accounts`
4. 新增 Gmail、Outlook 或 IMAP/SMTP 帳號
5. 回到首頁確認郵件已同步成功

## 下一步

如果你要繼續完善正式部署，建議接著閱讀：

1. [部署指南](/zh-tw/deployment)
2. [Turso 資料庫詳細配置](/zh-tw/turso)
3. [Cloudflare R2 / Bucket 詳細配置](/zh-tw/r2-storage)
4. [GitHub Auth 詳細配置](/zh-tw/github-auth)
5. [Gmail OAuth 詳細配置](/zh-tw/gmail-oauth)
6. [Outlook OAuth 詳細配置](/zh-tw/outlook-oauth)
