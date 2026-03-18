# プロジェクト構成

このページは単なるディレクトリ一覧ではありません。次の問いにすばやく答えるためのものです。

> 機能を変えたいとき、どこから読めばよいか？

Origami のコードを初めて読むなら、まずはこの一文だけ覚えておけば十分です。

> ルートや画面入口は `src/app/`、共通の業務ロジックは `src/lib/`、UI 部品は `src/components/` に多くあります。

## ルート構成

```text
.
├── docs/                # VitePress ドキュメントサイト
├── drizzle/             # 履歴 SQL migration と journal
├── scripts/             # 用途別に整理した補助スクリプト
├── src/                 # アプリケーション本体
├── .env.example         # 環境変数テンプレート
├── drizzle.config.ts    # Drizzle 設定
├── eslint.config.mjs    # ESLint flat config
├── next.config.ts       # Next.js 設定
├── package.json         # 依存と scripts
├── vercel.json          # Vercel cron / デプロイ設定
└── ...
```

## なぜルートが「散らかっている」わけではないのか

ルート直下の多くは、Next.js + Vercel + TypeScript プロジェクトではごく普通の設定ファイルです。
本当に業務ロジックに近いものは、主に次へ集約されています。

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

狙いはシンプルです。補助スクリプトは repo に残すが、ルートには散らさない。

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

ここには次が入ります。

- App Router ルート
- ページ
- Server Actions
- Route Handlers

### `src/components/`

UI コンポーネントを機能ごとに分けて置きます。例：

- `accounts/`
- `compose/`
- `inbox/`
- `layout/`
- `sent/`
- `sync/`
- `ui/`

### `src/lib/`

主要な業務ロジック層です。主な中身：

- `db/`：schema と DB アクセス基盤
- `queries/`：読み取り中心のデータアクセス
- `services/`：複数ステップをまとめる高レベル処理
- `providers/`：Gmail / Outlook / IMAP/SMTP 連携
- `oauth-apps.ts`：OAuth app 解決と管理ロジック

## シンプルな心智モデル

まずは次のように理解すると追いやすいです。

- **`src/app/`** = ルート、ページ、HTTP endpoint、Server Action
- **`src/components/`** = 画面に出る UI
- **`src/lib/queries/`** = 主に「読む」処理
- **`src/lib/services/`** = 主に「複数の処理をつなぐ」層
- **`src/lib/providers/`** = 主に「外部メールサービスと話す」層

もしどこから追えばいいかわからない場合は、次の順が実用的です。

1. その挙動を起こしているページや action を見つける
2. そこから `queries / services / providers` へ追う
3. 最後に schema や provider adapter の細部を見る

## 機能ごとの入口

### Inbox 挙動

- `src/app/(app)/page.tsx`
- `src/components/inbox/*`
- `src/app/actions/email.ts`
- `src/lib/queries/emails.ts`
- `src/lib/services/email-service.ts`

### Accounts / OAuth app 管理

- `src/app/(app)/accounts/page.tsx`
- `src/app/actions/account.ts`
- `src/app/actions/oauth-apps.ts`
- `src/components/accounts/*`
- `src/lib/oauth-apps.ts`
- `src/lib/queries/oauth-apps.ts`

### Sync

- `src/app/actions/sync.ts`
- `src/lib/services/sync-service.ts`
- `src/lib/providers/*`

### Compose / sent history

- `src/app/(app)/compose/page.tsx`
- `src/components/compose/*`
- `src/app/actions/send.ts`
- `src/lib/queries/sent-messages.ts`
- `src/lib/providers/gmail.ts`
- `src/lib/providers/outlook.ts`
- `src/lib/providers/imap-smtp/provider.ts`

## なぜ `drizzle/` に migration が多く残っているのか

このディレクトリは **プロジェクトのアップグレード履歴** を保持しています。
新規導入なら migration を一つずつ読む必要はなく、通常は `npm run db:setup` で十分です。

ただし既存インスタンスのアップグレードでは履歴 migration が意味を持つため、意図的に残しています。

## 推奨読書順

新しいコントリビューターなら：

1. [クイックスタート](/ja/quick-start)
2. [アーキテクチャ](/ja/architecture)
3. その後、このページと実際のソースを行き来する
