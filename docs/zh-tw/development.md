# 開發與除錯

本頁面向 **本地開發、除錯、改程式碼、跑測試** 的場景。

如果你的目標是正式部署，請先看：

- [快速開始](/zh-tw/quick-start)
- [部署指南](/zh-tw/deployment)

## 適用場景

你應該查看本頁，如果你要：

- 在 `localhost` 跑 Origami
- 修改 UI、功能或資料模型
- 驗證 OAuth callback
- 本地跑測試與 build
- 開發文件站

## 本地環境要求

- Node.js 22+
- npm
- 一個可用的 Turso / libSQL 資料庫
- 一個可用的 R2 bucket
- GitHub OAuth App
- 如需接入 Gmail / Outlook，對應 OAuth app

## 本地環境變數

複製範例：

```bash
cp .env.local.example .env.local
```

然後至少填好：

- `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `ENCRYPTION_KEY`
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_ENDPOINT`

## 本地啟動

```bash
npm install
npm run db:setup
npm run dev
```

打開：

- `http://localhost:3000`

## 常用指令

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run docs:dev
npm run docs:build
npm run verify
```

## OAuth callback 提醒

本地開發時，所有 OAuth callback 都要與 `NEXT_PUBLIC_APP_URL` 對齊。如果你用的是 `http://localhost:3000`，那 callback 也必須填 `localhost:3000` 對應的 API 路徑。
