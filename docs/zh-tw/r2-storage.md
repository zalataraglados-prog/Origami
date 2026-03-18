# Cloudflare R2 / Bucket 詳細配置

這頁只講一件事：**怎麼為正式環境的 Origami 配置附件儲存**。

Origami 會把附件放在 Cloudflare R2，而不是直接塞進資料庫，因為附件本質上是大體積二進位物件。

## 這頁會幫你拿到什麼

按這頁做完，你應該能拿到並確認這幾項：

- 正確的 Cloudflare Account ID
- 一個已建立的 R2 bucket
- 一組能存取該 bucket 的 R2 API key
- 一套可填回 `.env` 的完整 `R2_*` 配置

## 最後要填回 `.env` 的值

```txt
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=origami-attachments-prod
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

## 官方參考

- Cloudflare R2：建立 bucket  
  <https://developers.cloudflare.com/r2/buckets/create-buckets/>
- Cloudflare R2：API token / S3 認證  
  <https://developers.cloudflare.com/r2/api/tokens/>
- Cloudflare：查找 Account ID  
  <https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/>

## 開始前先抄表

```txt
Cloudflare Account ID = ...
Bucket name = origami-attachments-prod
R2 endpoint = https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

## 你會在兩個地方來回操作

### 地方 A：Cloudflare Dashboard

你會在這裡：

- 找到 Account ID
- 建立 bucket
- 建立 R2 API token
- 複製 Access Key ID 與 Secret Access Key

### 地方 B：Origami 的 `.env`

你會把值填回：

```txt
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_ENDPOINT=
```

## 使用者點擊腳本

### 第 1 步：打開 Cloudflare Dashboard

打開：

- <https://dash.cloudflare.com/>

先確認你已切到正確的 Cloudflare account。

如果你有多個 Cloudflare account，最經典的錯就是把：

- A 帳號的 Account ID
- B 帳號的 key
- C 帳號的 bucket

混在一起。

### 第 2 步：先找 Account ID

在 Cloudflare Dashboard 中找到：

- **Account ID**

記成：

```txt
R2_ACCOUNT_ID=<你的 Account ID>
```

同時把 endpoint 拼出來：

```txt
R2_ENDPOINT=https://<你的 Account ID>.r2.cloudflarestorage.com
```

### 第 3 步：打開 R2 並建立 bucket

進入：

- **R2 Object Storage**

建立 bucket，建議名稱：

```txt
origami-attachments-prod
```

這一步最重要的是：

1. bucket 真的建立成功
2. 你記住了精確的 bucket 名
3. 你確認它就在目前這個 Cloudflare account 下面

### 第 4 步：建立 R2 API token

繼續找到：

- **Manage R2 API tokens**

對 Origami 來說，最小推薦權限是：

- **Object Read & Write**

scope 建議只給你剛才那個 bucket。

### 第 5 步：保存 Access Key 與 Secret Access Key

Cloudflare 會展示：

- **Access Key ID**
- **Secret Access Key**

立刻複製並保存。

> `Secret Access Key` 最好在建立當下就抄走。真的漏掉了，最快的做法通常是重新建一組新的 key。

## 現在回到 `.env`

```txt
R2_ACCOUNT_ID=1234567890abcdef1234567890abcdef
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=origami-attachments-prod
R2_ENDPOINT=https://1234567890abcdef1234567890abcdef.r2.cloudflarestorage.com
```

## 填完後先核對

請確認：

- `R2_ACCOUNT_ID` 是剛才複製的 Account ID
- `R2_ENDPOINT` 嚴格等於 `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
- `R2_BUCKET_NAME` 和實際 bucket 名完全一致
- Access Key 與 Secret 沒有填反
- token 至少包含 **Object Read & Write**
- token scope 包含目標 bucket
- 這些值都來自同一個 Cloudflare account

## 怎麼驗證配置真的好了

部署完成後，你可以在 Origami 中走這條驗證鏈路：

1. 打開 compose
2. 上傳一個小附件
3. 完成發送或保存流程
4. 回到郵件詳情頁試著下載同一個附件

理想結果是：

- 上傳沒有報錯
- 發送或保存成功
- 附件可以下載

如果你想驗證得更完整一點，建議再補做兩件事：

1. 上傳一個全新的附件，確認寫入路徑沒問題
2. 再下載一次既有附件，確認讀取路徑也正常

## 最常見錯誤

### 1. `R2_ENDPOINT` 寫錯

正確格式只能是：

```txt
https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

### 2. Access Key / Secret 填反了

請確認：

- `R2_ACCESS_KEY_ID` 不是 `R2_SECRET_ACCESS_KEY`

### 3. token 沒有物件讀寫權限

如果權限太小，附件上傳通常會失敗。

### 4. bucket 名寫錯

請確認 `.env` 裡的 `R2_BUCKET_NAME` 與 Cloudflare 後台中的 bucket 名逐字一致。

### 5. Account ID 其實來自另一個帳號

這是多帳號場景最常見的錯配之一。

### 6. 上傳能過，但下載失敗

這通常表示 bucket 並非完全不可用，而是物件儲存鏈路裡還有某個值沒對齊。請回頭重查：

- `R2_ENDPOINT`
- `R2_BUCKET_NAME`
- 部署實際載入的環境變數

## 一句話驗收標準

如果你能在 Origami 裡成功上傳附件、完成發送或保存，之後還能把同一個附件下載回來，這篇配置基本就算完成了。
