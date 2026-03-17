# FAQ

## Why recommend `db:setup` instead of `db:migrate`?

Because `db:setup` is the best path for a fresh environment.
It focuses on getting the current schema and required structures ready, instead of making new users care about the historical migration story.

## Why are Done / Archive / Snooze local-only?

Because they are productivity states, not portable mailbox semantics.
Keeping them local makes the model more stable and the UI more predictable.

## Why can Read / Star sync back?

Because those states are closer to native mailbox behavior and provide more obvious cross-client value.

## Is QQ send supported now?

Yes.
QQ is no longer a read-only edge case; it supports IMAP receive + SMTP send.

## Why is Origami single-user?

Because the project is intentionally optimized for one operator handling multiple inboxes.
That keeps deployment, auth, and maintenance lightweight.

## What should I check first if GitHub sign-in is not working?

Check these in order:

1. `NEXT_PUBLIC_APP_URL` matches the actual URL you are visiting
2. the GitHub OAuth App **Homepage URL** matches your app URL
3. the GitHub OAuth App **Authorization callback URL** is exactly:
   - `http://localhost:3000/api/auth/github/callback`
   - or `https://your-domain/api/auth/github/callback`
4. `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` are from the correct environment and have no copy-paste mistakes
5. for public deployments, `GITHUB_ALLOWED_LOGIN` is set as intended
6. if the installation was already claimed, you are signing in with the same GitHub account that owns the instance

Common cases:

- **callback error right after redirect**: usually a callback URL or secret mismatch
- **someone can see the login page but cannot enter**: often `GITHUB_ALLOWED_LOGIN` is doing its job
- **you renamed your GitHub login**: usually fine, because Origami stores the GitHub user id
- **the wrong owner claimed the instance**: you usually need to clear the `app_installation` record and initialize again

## Why store attachments in R2?

Because attachment binaries are large objects.
Keeping them outside the relational database reduces database pressure and keeps normal queries lighter.
