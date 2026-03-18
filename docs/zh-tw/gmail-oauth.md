# Gmail OAuth 詳細配置

## 最後你要填回 `.env` 的值

```txt
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
```

## 官方參考

- <https://developers.google.com/workspace/gmail/api/quickstart>
- <https://console.cloud.google.com/>

## Redirect URI

請在 Google Cloud Console 中把 redirect URI 設定為：

```txt
https://mail.example.com/api/oauth/gmail
```

## 基本流程

1. 建立 Google Cloud 專案
2. 啟用 Gmail API
3. 建立 OAuth Client
4. 設定 redirect URI
5. 取得 Client ID / Client Secret
6. 填回 `.env`

## 驗證方式

部署後打開 `/accounts`，選擇 Gmail 授權並確認能正常跳轉與回跳。
