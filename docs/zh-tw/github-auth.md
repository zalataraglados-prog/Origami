# GitHub Auth 詳細配置

## 最後你要填回 `.env` 的值

```txt
NEXT_PUBLIC_APP_URL=https://mail.example.com
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GITHUB_ALLOWED_LOGIN=your-github-login
```

## 官方參考

- <https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app>

## 建立 GitHub OAuth App 的關鍵欄位

在 GitHub 打開：

**Settings → Developer settings → OAuth Apps → New OAuth App**

填寫：

- **Homepage URL** = `https://mail.example.com`
- **Authorization callback URL** = `https://mail.example.com/api/auth/github/callback`

## 填回 `.env`

完成後把 `Client ID` 與 `Client secret` 填回 `.env`，並設定：

```txt
GITHUB_ALLOWED_LOGIN=your-github-login
```

這樣可以避免其他 GitHub 帳號先綁定 owner。
