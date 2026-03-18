# Turso 資料庫詳細配置

## 最後你要填回 `.env` 的值

```txt
TURSO_DATABASE_URL=...
TURSO_AUTH_TOKEN=...
```

## 官方參考

- <https://turso.tech/>
- <https://docs.turso.tech/>

## 基本流程

1. 建立 Turso 帳號
2. 在 Dashboard 建立資料庫
3. 取得 database URL
4. 產生 auth token
5. 填回 `.env`

## 本地驗證

在填好 `.env` 之後執行：

```bash
npm run db:setup
```

如果能成功建立結構，代表資料庫連線基本可用。
