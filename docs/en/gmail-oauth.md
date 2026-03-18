# Gmail OAuth Detailed Setup

This page covers **how to connect Gmail to a production Origami instance**.

GitHub sign-in gets you into Origami. Gmail OAuth lets Origami access your Gmail mailbox.

## What this page helps you get

By the time you finish this page, you should have:

- a dedicated Google Cloud project for Origami
- Gmail API enabled
- a configured OAuth consent screen
- a **Web application** OAuth client
- a working `GMAIL_CLIENT_ID` / `GMAIL_CLIENT_SECRET`

## Final `.env` values you need

```txt
NEXT_PUBLIC_APP_URL=https://mail.example.com
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
```

## Official reference

- Enable Google Workspace APIs  
  <https://developers.google.com/workspace/guides/enable-apis>
- Configure the OAuth consent screen  
  <https://developers.google.com/workspace/guides/configure-oauth-consent>
- Create OAuth credentials  
  <https://developers.google.com/workspace/guides/create-credentials>
- Gmail scopes reference  
  <https://developers.google.com/workspace/gmail/api/auth/scopes>

## Gmail scopes Origami currently requests

- `https://www.googleapis.com/auth/gmail.modify`
- `https://www.googleapis.com/auth/gmail.send`
- `https://www.googleapis.com/auth/userinfo.email`

## Write this cheat sheet first

```txt
Production app URL
https://mail.example.com

Google OAuth Redirect URI
https://mail.example.com/api/oauth/gmail

Google Cloud Project name
Origami Gmail Production

Consent Screen App name
Origami Gmail Production
```

> Do not treat a temporary preview domain as the final redirect URI for production. If the domain changes later, the Google OAuth client must be updated too.

## Where you will switch back and forth

### Place A: Google Cloud Console

You will:

- create or choose a project
- enable Gmail API
- configure the OAuth consent screen
- create a Web OAuth client

### Place B: your Origami `.env`

You will fill back:

```txt
NEXT_PUBLIC_APP_URL=
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
```

## Click-by-click setup

### 1. Open Google Cloud Console

Open:

- <https://console.cloud.google.com/>

Make sure you are in the Google account that should own this configuration.

### 2. Create or switch to a dedicated project

Recommended project name:

```txt
Origami Gmail Production
```

### 3. Enable Gmail API

Click:

1. **APIs & Services**
2. **Library**
3. search for `Gmail API`
4. open it
5. click **Enable**

### 4. Configure the OAuth consent screen

Navigation labels may move slightly over time, but you will usually see something like:

1. **Google Auth platform**
2. **Branding**
3. **Audience**
4. **Data Access**

Recommended values:

- **App name**: `Origami Gmail Production`
- **User support email**: your email
- **Developer contact email**: your email

For a self-hosted personal instance, `External` is usually the right audience, and the Google account you will actually use should be added to **Test users**.

### 5. Create the OAuth Client ID

Choose:

- **OAuth client ID**
- app type: **Web application**

Do not use **Desktop app** here. Origami is a server-side web app.

The redirect URI must be exactly:

```txt
https://mail.example.com/api/oauth/gmail
```

Most common mistakes:

- using the homepage URL instead of the callback
- forgetting `/api/oauth/gmail`
- using a domain that does not match `NEXT_PUBLIC_APP_URL`

### 6. Save Client ID and Client Secret

Copy both values immediately.

## Now go back to `.env`

```txt
NEXT_PUBLIC_APP_URL=https://mail.example.com
GMAIL_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your-google-oauth-client-secret
```

## Check before testing

Make sure:

- the current Google Cloud project is the correct one
- Gmail API is enabled
- the consent screen is configured
- the OAuth client type is **Web application**
- the redirect URI equals `<APP_URL>/api/oauth/gmail`
- the `.env` client id and secret come from this exact client

## How to verify it works

After deployment:

1. sign in to Origami
2. open `/accounts`
3. choose to add a Gmail account
4. complete the Google consent flow
5. return to Origami

Expected result:

- the Gmail account appears in `/accounts`
- sync works
- reading works
- sending works

For better coverage, also test:

1. run one sync and confirm mail really appears
2. send a small test email, ideally with a tiny attachment

## Common errors

### 1. `redirect_uri_mismatch`

Always compare these three values first:

- the redirect URI in Google Cloud
- `NEXT_PUBLIC_APP_URL`
- the actual callback `/api/oauth/gmail`

### 2. the consent screen opens, but the flow does not return correctly

That usually means the redirect URI is wrong, or the wrong client was copied into `.env`.

### 3. you see testing / app not verified warnings

Check:

- the audience is `External`
- the Google account is included in **Test users**

For a self-hosted personal instance, these warnings often just mean the app has not gone through a public verification process yet.

### 4. authorization succeeds, but sending fails with permission errors

Check the required scopes:

- `gmail.send`
- `gmail.modify`

### 5. the setup used to work before the domain changed

Check these again together:

- `NEXT_PUBLIC_APP_URL`
- the Google OAuth client redirect URI
- the actual production domain you are visiting

## One-line acceptance test

If you can authorize a Gmail account from `/accounts`, land back in Origami, and that account can both sync and send, this configuration is basically done.
