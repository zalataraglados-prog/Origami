# Origami ✉️

> **EN:** A privacy-friendly unified inbox for individuals or a single operator inside a small team, aggregating Gmail / Outlook plus domestic IMAP/SMTP mailboxes in one place and designed for self-hosting.
>
> **中文：** 一个面向个人或小团队单一操作席位的统一收件箱，可聚合 Gmail / Outlook 与国内 IMAP/SMTP 邮箱，强调隐私与自托管。

[![CI](https://github.com/theLucius7/Origami/actions/workflows/ci.yml/badge.svg)](https://github.com/theLucius7/Origami/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/github/license/theLucius7/Origami)](./LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Turso](https://img.shields.io/badge/Database-Turso-4FF8D2?logo=turso&logoColor=111)](https://turso.tech/)
[![Cloudflare R2](https://img.shields.io/badge/Object%20Storage-Cloudflare%20R2-F38020?logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/r2/)
[![Docs](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://l7cp.de/Origami/)

***

## 🌐 Documentation / 文档入口

- **English docs:** <https://l7cp.de/Origami/>
- **中文文档：** <https://l7cp.de/Origami/zh/>

### Quick links / 快速入口

| English | 中文 |
|---|---|
| [Overview](https://l7cp.de/Origami/) | [概览](https://l7cp.de/Origami/zh/) |
| [Architecture](https://l7cp.de/Origami/architecture) | [架构说明](https://l7cp.de/Origami/zh/architecture) |
| [Deployment](https://l7cp.de/Origami/deployment) | [部署指南](https://l7cp.de/Origami/zh/deployment) |
| [Project Structure](https://l7cp.de/Origami/project-structure) | [项目结构](https://l7cp.de/Origami/zh/project-structure) |

## ✨ Features / 主要特性

- Unified inbox across multiple accounts, sorted by time
- Gmail / Outlook OAuth + domestic IMAP/SMTP account connection (QQ / 163 / 126 / Yeah / custom)
- OAuth apps support both env-backed defaults and DB-managed app configs with per-account reauthorization
- Local triage states: **Done / Archive / Snooze** stay inside Origami, while **Read / Star** can optionally write back to supported providers
- Structured search syntax: `account:` / `from:` / `subject:` / `is:read` / `is:done` / `is:snoozed`
- Gmail / Outlook / IMAP/SMTP sending support for new emails (minimal viable compose flow)
- Attachments stored in Cloudflare R2, metadata stored in Turso
- Manual sync + scheduled sync via `GET /api/cron/sync`
- Single-user `ACCESS_TOKEN` protection with cookie or Bearer auth
- Lazy body hydration: initial sync stores metadata first, then fetches full body/attachments on demand
- Local sent-message history with attachment records

## 🚫 Known Limitations / 当前限制

- **Done / Archive / Snooze** remain local to Origami; **Read / Star** write-back is optional and scope-dependent
- Domestic IMAP/SMTP accounts currently use inbox-focused IMAP sync plus SMTP sending; this is not full mailbox mirroring
- Single attachment must stay **under 3 MB** (Outlook compatibility limit in current implementation)
- No thread-aware reply / forward flow yet
- No remote draft sync yet
- Inbox sync is focused on recent inbox mail, not full mailbox mirroring

## 🚀 Golden Path / 单一路径

If you just want Origami running, use this path and ignore the older migration history.

### 1. Install and create `.env`

```bash
cp .env.example .env
npm install
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Put the generated 64-char hex value into `ENCRYPTION_KEY`, then fill the rest of `.env`.

Minimum groups you usually need:

- **App:** `NEXT_PUBLIC_APP_URL`, `ACCESS_TOKEN`, `CRON_SECRET`, `ENCRYPTION_KEY`
- **Database:** `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`
- **Storage:** `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_ENDPOINT`
- **Optional OAuth defaults:** `GMAIL_CLIENT_ID` / `GMAIL_CLIENT_SECRET`, `OUTLOOK_CLIENT_ID` / `OUTLOOK_CLIENT_SECRET`

Full variable reference lives in [`docs/deployment.md`](./docs/deployment.md).

### 2. Initialize the database

```bash
npm run db:setup
```

For a brand-new database, this is the only command you should need. `db:migrate` is kept for historical replay / upgrade scenarios.

### 3. Run locally or deploy

**Local dev**

```bash
npm run dev
```

Then open `http://localhost:3000`, sign in with `ACCESS_TOKEN`, and add accounts from `/accounts`.

**Production**

- Deploy to **Vercel**
- Use **Turso/libSQL** for DB
- Use **Cloudflare R2** for attachments
- Reuse the same `db:setup` path on the target database

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/theLucius7/Origami)

### 4. Verify before shipping

```bash
npm run verify
```

That runs lint + typecheck + tests + app build + docs build in one path.

## 🏗 Architecture / 架构

Core runtime flow:

```text
Browser
  -> Next.js Proxy (ACCESS_TOKEN protection)
  -> App Router pages / Server Actions
  -> Drizzle ORM
  -> Turso (accounts, emails, triage state, sent history)
  -> Cloudflare R2 (attachment binaries)
  -> Providers
       - Gmail API
       - Microsoft Graph
       - IMAP/SMTP presets (QQ / 163 / 126 / Yeah / custom)

Vercel Cron
  -> /api/cron/sync
  -> syncAllAccounts()
```

See the full architecture write-up: [`docs/architecture.md`](./docs/architecture.md)

## 🧪 Useful Commands / 常用命令

| Command | What it does |
|---|---|
| `npm run dev` | Start local development |
| `npm run verify` | Full validation path before shipping |
| `npm run db:setup` | Recommended fresh-database bootstrap |
| `npm run db:migrate` | Historical migration replay |
| `npm run db:push` | Push current schema with SQLite FTS-safe wrapper |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run docs:dev` | Start docs locally |
| `npm run docs:build` | Build docs site |

For deployment details, environment variables, and provider setup, go straight to [`docs/deployment.md`](./docs/deployment.md).

## 🔒 Security / 安全

- Provider credentials are encrypted with **AES-256-GCM** before being stored in Turso
- Attachment binaries are stored outside the database in **Cloudflare R2**
- Downloads are proxied through the server, so clients never see raw R2 object keys
- The app is protected by a single-user **ACCESS_TOKEN** enforced by Next.js Proxy
- Cron sync is protected with `CRON_SECRET`
- `npm run audit:prod` currently reports **0 production vulnerabilities**

## 📄 License / 许可证

MIT — see [LICENSE](./LICENSE)
