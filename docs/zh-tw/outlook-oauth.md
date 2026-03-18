# Outlook OAuth 詳細配置

## 最後你要填回 `.env` 的值

```txt
OUTLOOK_CLIENT_ID=...
OUTLOOK_CLIENT_SECRET=...
```

## 官方參考

- <https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app>
- <https://portal.azure.com/>

## Redirect URI

請在 Microsoft Entra / Azure Portal 中設定：

```txt
https://mail.example.com/api/oauth/outlook
```

## 基本流程

1. 註冊應用程式
2. 設定 Web redirect URI
3. 產生 Client secret
4. 取得 Client ID / Secret
5. 填回 `.env`

## 驗證方式

部署後到 `/accounts` 進行 Outlook 授權，確認能正常回到 Origami。
