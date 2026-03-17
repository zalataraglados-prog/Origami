# Turso Database: Detailed Setup

This page explains one thing only: **how to prepare a Turso database that Origami can actually use**.

If your goal right now is:

> “I do not have a database yet. I want to start on the free tier, fill in `.env`, and make Origami connect successfully.”

this is the page for you.

---

## First, what do you need in the end?

You will eventually put these two values into `.env`:

```txt
TURSO_DATABASE_URL=libsql://your-db-name-xxx.turso.io
TURSO_AUTH_TOKEN=...
```

If those two values are correct, Origami can connect to Turso.

---

## Official references

- Turso Quickstart  
  <https://docs.turso.tech/quickstart>
- Turso CLI installation  
  <https://docs.turso.tech/cli/installation>
- Turso database token creation  
  <https://docs.turso.tech/cli/db/tokens/create>
- Turso Pricing  
  <https://turso.tech/pricing>

---

## The plain-English mental model

For Origami, Turso really only gives you two things that matter:

1. **the database URL** (`TURSO_DATABASE_URL`)
2. **the database auth token** (`TURSO_AUTH_TOKEN`)

You can think of them like this:

- URL = “which database should Origami connect to?”
- token = “is Origami allowed to connect?”

---

## About the “free tier” part

If you are just trying Origami, doing local development, or testing the setup, you can usually start on Turso’s current **Free** tier.

But pricing can change, so always check the official page:

- <https://turso.tech/pricing>

My practical advice is simple:

- **use the free tier first to get Origami working**
- think about paid plans only after the setup already works

---

## Before you start, write these values down

### Local / test environment

```txt
Database name
origami-dev

Purpose
local development / testing

Planned env vars
TURSO_DATABASE_URL=...
TURSO_AUTH_TOKEN=...
```

### Production

```txt
Database name
origami-prod

Purpose
real deployment

Planned env vars
TURSO_DATABASE_URL=...
TURSO_AUTH_TOKEN=...
```

> Strong recommendation: use **one database for development** and **another one for production**.

---

## Why this guide is not “100% dashboard only”

Because Turso’s dashboard UI can move around, while the **CLI path for URL and token** is usually more stable and easier to reproduce.

So the most reliable path is:

1. **use the web UI to sign up / log in / create the database**
2. **use the CLI to get the database URL and token**
3. **put them into `.env`**

That is actually easier for end users than depending on a dashboard button that may move.

---

## If the UI does not look exactly like this page

Turso’s dashboard and docs can change too. Focus on these keywords:

- `Create database`
- `Database name`
- `Groups` or `Location`
- `Connect`
- `Tokens`
- `libsql`

If one button label is slightly different, do not panic. It often just means the UI changed.

---

## Baby-step guide: prepare a Turso database from scratch

### Step 1: open Turso and sign in

Open:

- <https://turso.tech/>

Then sign up / sign in to your Turso account.

If this is your first time, you will usually go through:

1. account signup
2. entering the Turso dashboard
3. creating an organization / workspace if prompted

For personal use, the default organization is usually enough.

---

### Step 2: decide to start with the free tier

If you are currently just:

- testing Origami
- doing local development
- validating the whole setup

then starting with the **Free** tier is usually fine.

Official pricing page:

- <https://turso.tech/pricing>

My advice:

- **do not overthink billing before the project even runs**
- create the database first, make Origami work, then evaluate pricing later

---

### Step 3: create the database in the web dashboard

In the Turso dashboard, look for:

- **Create database**

Then fill it in with this mindset.

#### How should I name the database?

Use names that clearly show the environment:

- `origami-dev`
- `origami-prod`

#### How should I choose Location / Group?

Usually pick a region that is reasonably close to where your app will run.

If you are only testing locally right now, do not overthink this. A default recommended region is usually fine.

If you are deploying to Vercel later, it is usually a good idea to keep Turso reasonably close to your app region.

### At this step, the two important things are not advanced tuning

They are simply:

1. **the database gets created successfully**
2. **you remember the exact database name**

For example:

```txt
origami-dev
```

---

### Step 4: install the Turso CLI

Official installation guide:

- <https://docs.turso.tech/cli/installation>

Common methods:

#### macOS

```bash
brew install tursodatabase/tap/turso
```

#### Linux

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

#### Windows

The official guidance currently goes through WSL. Check the installation page for the current details.

After installation, open a new shell and run:

```bash
turso
```

If you can see the CLI help output, the CLI is installed correctly.

---

### Step 5: log the CLI into your Turso account

Run:

```bash
turso auth login
```

This usually opens your browser and lets you authorize the CLI.

Once that succeeds, the CLI can fetch database information and create tokens for you.

---

### Step 6: get the database URL

If your database name is:

```bash
origami-dev
```

run:

```bash
turso db show origami-dev --url
```

You will get something like:

```txt
libsql://origami-dev-xxxxx.turso.io
```

That is what goes into `.env`:

```txt
TURSO_DATABASE_URL=libsql://origami-dev-xxxxx.turso.io
```

### One very important detail here

Origami expects:

- **a real `libsql://...` database URL**

not a hostname you guessed manually.

The safest path is to use the exact output of `turso db show <db-name> --url`.

---

### Step 7: create the database token

Official command docs:

- <https://docs.turso.tech/cli/db/tokens/create>

Run:

```bash
turso db tokens create origami-dev
```

It will output a token.

Put it into:

```txt
TURSO_AUTH_TOKEN=...
```

### My practical advice about the token

If your only goal right now is to make Origami connect successfully:

- create a normal working token first

You can worry about expiration, read-only restrictions, and more advanced token policy later.

---

## Minimal `.env` example

```txt
TURSO_DATABASE_URL=libsql://origami-dev-xxxxx.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOi...
```

For production, replace those values with the production database values.

---

## After configuration, verify these items in order

Check them one by one:

- Was the database actually created successfully in Turso?
- Does `TURSO_DATABASE_URL` come directly from `turso db show <db-name> --url`?
- Does `TURSO_AUTH_TOKEN` come directly from `turso db tokens create <db-name>`?
- Did you accidentally put dev values into production, or the other way around?
- Did `.env` pick up extra spaces, quotes, or line breaks?

If these items are correct, the Turso part is usually fine.

---

## How should you verify that it really works?

The most direct test is:

1. put `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` into `.env`
2. from the Origami project directory, run:

```bash
npm run db:setup
```

If the database connection is correct, this should complete successfully.

Then run:

```bash
npm run dev
```

If Origami starts normally and you can continue to login / setup, your database configuration is at least working.

---

## Most common problems, and how to recognize them quickly

### 1. the database URL is wrong

This is the most common issue.

Make sure:

- it starts with `libsql://`
- it came from `turso db show <db-name> --url`
- you did not type it by hand from memory

### 2. the token belongs to another database

If you have multiple databases, it is easy to grab the wrong token.

That is why I recommend always generating the token with the exact database name, for example:

```bash
turso db tokens create origami-dev
```

### 3. dev and prod got mixed up

For example:

- `TURSO_DATABASE_URL` points to `origami-dev`
- but you think you are configuring production

My recommendation is simple:

- call the dev DB `origami-dev`
- call the prod DB `origami-prod`

Avoid ambiguous names.

### 4. the CLI is not actually logged in

If `turso db show ...` or `turso db tokens create ...` gives an auth error, go back and run:

```bash
turso auth login
```

### 5. you created the DB in the dashboard, but never created the token

Creating the database is not enough.

Origami still needs both:

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`

Missing either one will break the connection.

---

## What I recommend in practice

If you ask me for the safest Turso setup, I would recommend:

1. **create the database in the web dashboard**
2. **use the CLI to get the URL**
3. **use the CLI to create the token**
4. **separate development and production databases**
5. **get the project working on the free tier first, then think about upgrades later**

That is the simplest and least frustrating path for most users.

---

## What to read next

After the database is ready, continue in this order:

1. [Cloudflare R2 / bucket detailed setup](/en/r2-storage)
2. [GitHub Auth detailed setup](/en/github-auth)
3. [Gmail OAuth detailed setup](/en/gmail-oauth)
4. [Outlook OAuth detailed setup](/en/outlook-oauth)
