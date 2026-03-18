# Project Structure

This page is not just a directory listing. It is meant to help you answer one practical question quickly:

> if I want to change a feature, where should I start looking?

If this is your first time reading the Origami codebase, one sentence is enough to start:

> route entrypoints mostly live in `src/app/`, shared business logic mostly lives in `src/lib/`, and UI pieces mostly live in `src/components/`.

## Repository root

```text
.
├── docs/                # VitePress documentation site
├── drizzle/             # historical SQL migrations and journal
├── scripts/             # helper scripts grouped by purpose
├── src/                 # application source code
├── .env.example         # environment template
├── drizzle.config.ts    # Drizzle config
├── eslint.config.mjs    # ESLint flat config
├── next.config.ts       # Next.js config
├── package.json         # dependencies and scripts
├── vercel.json          # Vercel cron / deployment config
└── ...
```

## Why the root is not actually “messy”

Most files at the repository root are standard config files for a modern Next.js + Vercel + TypeScript project.
The real project-specific logic is still concentrated in:

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

The goal here is simple: keep helper scripts in the repo, but do not let them spill all over the root directory.

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

Contains:

- App Router routes
- pages
- Server Actions
- Route Handlers

### `src/components/`

Contains UI components, grouped by feature, such as:

- `accounts/`
- `compose/`
- `inbox/`
- `layout/`
- `sent/`
- `sync/`
- `ui/`

### `src/lib/`

This is the main business logic layer, including:

- `db/`: schema and database access foundations
- `queries/`: read-oriented data access
- `services/`: higher-level orchestration logic
- `providers/`: Gmail / Outlook / IMAP/SMTP integrations
- `oauth-apps.ts`: OAuth app resolution and management logic

## A simple mental model

A useful first-pass model of the codebase is:

- **`src/app/`** = routes, pages, HTTP endpoints, Server Actions
- **`src/components/`** = UI rendered on screen
- **`src/lib/queries/`** = mostly “read data”
- **`src/lib/services/`** = mostly “orchestrate multiple steps”
- **`src/lib/providers/`** = mostly “talk to external mail services”

If you are debugging a feature and do not know where to start, the most practical method is:

1. find the page or action that triggers the behavior
2. follow calls into `queries / services / providers`
3. only then drop into schema details or provider adapters

## Where to look by feature

### Inbox behavior

- `src/app/(app)/page.tsx`
- `src/components/inbox/*`
- `src/app/actions/email.ts`
- `src/lib/queries/emails.ts`
- `src/lib/services/email-service.ts`

### Account onboarding / OAuth apps

- `src/app/(app)/accounts/page.tsx`
- `src/app/actions/account.ts`
- `src/app/actions/oauth-apps.ts`
- `src/components/accounts/*`
- `src/lib/oauth-apps.ts`
- `src/lib/queries/oauth-apps.ts`

### Sync behavior

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

## Why `drizzle/` still keeps many migrations

Because that directory preserves the project’s upgrade history.
For a fresh deployment, you do not need to study every migration one by one; `npm run db:setup` is usually enough.

But for upgrading an existing instance, those historical migrations still matter, so they are intentionally kept.

## Recommended reading order

If you are a new contributor:

1. read [Quick Start](/en/quick-start)
2. then read [Architecture](/en/architecture)
3. then come back to this page and the relevant source files
