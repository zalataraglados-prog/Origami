# 專案結構

這一頁不是單純列目錄，而是幫你快速回答一個問題：

> 如果我想改某個功能，應該先從哪裡下手？

如果你是第一次看 Origami 原始碼，可以先記住一句話：

> 路由入口大多在 `src/app/`，共用業務邏輯多在 `src/lib/`，UI 元件多在 `src/components/`。

## 倉庫根目錄

```text
.
├── docs/                # VitePress 文件站
├── drizzle/             # 歷史 SQL migration 與 journal
├── scripts/             # 按用途分組的輔助腳本
├── src/                 # 應用程式原始碼
├── .env.example         # 環境變數模板
├── drizzle.config.ts    # Drizzle 設定
├── eslint.config.mjs    # ESLint flat config
├── next.config.ts       # Next.js 設定
├── package.json         # 依賴與 scripts
├── vercel.json          # Vercel cron / 部署設定
└── ...
```

## 為什麼根目錄其實不算亂

根目錄裡大多數檔案都是現代 Next.js + Vercel + TypeScript 專案很常見的標準設定。
真正和業務邏輯強相關的內容，仍然集中在：

- `src/`
- `docs/`
- `drizzle/`
- `scripts/`

## `scripts/`

```text
scripts/
├── README.md
├── bench/
│   └── seed-search-benchmark.mjs
└── db/
    └── push.mjs
```

設計原則很簡單：把輔助腳本留在倉庫裡，但不要讓它們散落在根目錄到處都是。

## `src/`

```text
src/
├── app/
├── components/
├── config/
├── hooks/
├── lib/
└── proxy.ts
```

### `src/app/`

放：

- App Router 路由
- 頁面
- Server Actions
- Route Handlers

### `src/components/`

放 UI 元件，通常依功能分組，例如：

- `accounts/`
- `compose/`
- `inbox/`
- `layout/`
- `sent/`
- `sync/`
- `ui/`

### `src/lib/`

這裡是主要業務邏輯層，重點包括：

- `db/`：schema 與資料庫存取基礎
- `queries/`：偏讀取型資料存取
- `services/`：更高層的編排邏輯
- `providers/`：Gmail / Outlook / IMAP/SMTP 整合
- `oauth-apps.ts`：OAuth app 解析與管理邏輯

## 一個簡單的心智模型

你可以先這樣理解整套程式碼：

- **`src/app/`**：路由入口、頁面、HTTP endpoint、Server Action
- **`src/components/`**：真正渲染到畫面上的 UI
- **`src/lib/queries/`**：偏「讀資料」
- **`src/lib/services/`**：偏「把多個步驟串起來」
- **`src/lib/providers/`**：偏「和外部郵件服務對接」

如果你在排查一個問題時不知道從哪開始，最實用的方法通常是：

1. 先找到觸發這個行為的頁面或 action
2. 再順著呼叫鏈走到 `queries / services / providers`
3. 最後再看 schema 細節或 provider adapter

## 想改某個功能時，看哪裡

### 改 Inbox 行為

- `src/app/(app)/page.tsx`
- `src/components/inbox/*`
- `src/app/actions/email.ts`
- `src/lib/queries/emails.ts`
- `src/lib/services/email-service.ts`

### 改帳號接入 / OAuth app 管理

- `src/app/(app)/accounts/page.tsx`
- `src/app/actions/account.ts`
- `src/app/actions/oauth-apps.ts`
- `src/components/accounts/*`
- `src/lib/oauth-apps.ts`
- `src/lib/queries/oauth-apps.ts`

### 改同步行為

- `src/app/actions/sync.ts`
- `src/lib/services/sync-service.ts`
- `src/lib/providers/*`

### 改發信 / 已送記錄

- `src/app/(app)/compose/page.tsx`
- `src/components/compose/*`
- `src/app/actions/send.ts`
- `src/lib/queries/sent-messages.ts`
- `src/lib/providers/gmail.ts`
- `src/lib/providers/outlook.ts`
- `src/lib/providers/imap-smtp/provider.ts`

## 為什麼 `drizzle/` 仍保留很多 migration

因為這個目錄代表的是 **專案的升級歷史**。
對新部署來說，你通常不需要逐個研究 migration；直接用 `npm run db:setup` 即可。

但對既有實例升級來說，這些 migration 仍然有價值，所以不會粗暴刪掉。

## 建議閱讀順序

如果你是新貢獻者：

1. 先讀 [快速開始](/zh-tw/quick-start)
2. 再讀 [架構](/zh-tw/architecture)
3. 最後再回來看這頁與具體原始碼
