# Cloudflare R2 / Bucket 詳細配置

## 最後你要填回 `.env` 的值

```txt
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=origami-attachments-prod
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

## 官方參考

- <https://developers.cloudflare.com/r2/>
- <https://dash.cloudflare.com/>

## 你會在兩個地方來回操作

### 地方 A：Cloudflare Dashboard

- 建立一個 R2 bucket
- 建立 API Token / Access Key
- 記下 Account ID

### 地方 B：Origami `.env`

把 Access Key、Secret、Bucket 名稱與 Endpoint 填回 `.env`。

## 驗證方式

部署後新增帶附件的郵件，確認附件可以正常上傳與下載。
