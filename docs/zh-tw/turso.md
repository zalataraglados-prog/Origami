# Turso 資料庫詳細配置

這頁只講一件事：**怎麼為正式環境的 Origami 準備一個可直接使用的 Turso 資料庫**。

## 這頁會幫你拿到什麼

按這頁做完，你應該能拿到並確認這幾項：

- 一個已建立好的 Turso 資料庫
- 正確的 `libsql://...` 資料庫 URL
- 一個確實屬於該資料庫的 auth token
- 一組可直接填回 `.env` 的資料庫連線配置

## 最後要填回 `.env` 的值

```txt
TURSO_DATABASE_URL=libsql://origami-prod-xxxxx.turso.io
TURSO_AUTH_TOKEN=...
```

對 Origami 來說，這裡真正重要的只有兩樣：

- URL：我要連哪個資料庫
- Token：我有沒有權限連進去

## 官方參考

- Turso Quickstart  
  <https://docs.turso.tech/quickstart>
- Turso CLI 安裝  
  <https://docs.turso.tech/cli/installation>
- Turso DB token 建立  
  <https://docs.turso.tech/cli/db/tokens/create>
- Turso Pricing  
  <https://turso.tech/pricing>

## 開始前先抄表

```txt
資料庫名
origami-prod

正式訪問地址
https://mail.example.com

計劃填入的變數
TURSO_DATABASE_URL=...
TURSO_AUTH_TOKEN=...
```

## 為什麼推薦「網頁建立 + CLI 取值」

因為 Turso 後台 UI 可能調整，而 CLI 取資料庫 URL 與 token 的路徑通常更穩定、也更容易重現。

建議流程：

1. 在網頁控制台建立資料庫
2. 用 CLI 取資料庫 URL
3. 用 CLI 建立資料庫 token
4. 把值填進 `.env`

## 使用者點擊腳本

### 第 1 步：打開 Turso 並登入

打開：

- <https://turso.tech/>

登入後進入控制台。

### 第 2 步：確認方案

如果你目前只是部署個人自用實例，通常可以先從當下可用的免費額度開始。方案可能變動，請以官方 Pricing 頁為準：

- <https://turso.tech/pricing>

### 第 3 步：在控制台建立資料庫

找到：

- **Create database**

建議資料庫名：

```txt
origami-prod
```

Location 通常選離你的部署區域比較近的地方即可。

這一步最重要的不是挑最完美的區域，而是：

1. 資料庫真的建立成功
2. 你記住了資料庫名稱
3. 你知道現在操作的是正式資料庫，不是測試庫

### 第 4 步：安裝 Turso CLI

#### macOS

```bash
brew install tursodatabase/tap/turso
```

#### Linux

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

安裝後執行：

```bash
turso
```

如果有看到 help 輸出，就表示 CLI 裝好了。

### 第 5 步：透過 CLI 登入

```bash
turso auth login
```

完成後，建議再順手跑一次：

```bash
turso db list
```

確認 CLI 真的能看到你剛建立的資料庫。

### 第 6 步：取得資料庫 URL

```bash
turso db show origami-prod --url
```

你會拿到類似：

```txt
libsql://origami-prod-xxxxx.turso.io
```

把它填入：

```txt
TURSO_DATABASE_URL=libsql://origami-prod-xxxxx.turso.io
```

> 不要手工猜 URL，也不要照別人的範例改字串。最穩的方法就是直接複製 CLI 輸出。

### 第 7 步：建立資料庫 token

```bash
turso db tokens create origami-prod
```

把輸出結果填入：

```txt
TURSO_AUTH_TOKEN=...
```

## 最小可用 `.env` 範例

```txt
TURSO_DATABASE_URL=libsql://origami-prod-xxxxx.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token
```

## 填完後先核對

請確認：

- 資料庫已在 Turso 控制台建立成功
- `TURSO_DATABASE_URL` 直接來自 `turso db show origami-prod --url`
- `TURSO_AUTH_TOKEN` 直接來自 `turso db tokens create origami-prod`
- `.env` 裡沒有額外空格、引號或換行
- 你現在填的是正式庫，不是開發庫

## 怎麼驗證配置真的好了

把 `TURSO_DATABASE_URL` 與 `TURSO_AUTH_TOKEN` 填進 `.env` 後，在專案目錄執行：

```bash
npm run db:setup
```

如果資料庫連線沒問題，這一步應該能正常完成。

如果想再穩一點，建議再確認：

1. `db:setup` 真的跑在你預期的那個資料庫上
2. 之後的首次部署初始化流程也能正常完成

## 最常見錯誤

### 1. 資料庫 URL 寫錯了

請確認：

- 它以 `libsql://` 開頭
- 它來自 `turso db show origami-prod --url`
- 它不是手工猜出來的地址

### 2. token 不是為這個資料庫建立的

最穩妥的做法就是明確執行：

```bash
turso db tokens create origami-prod
```

### 3. CLI 其實沒有真正登入成功

如果相關命令報認證錯誤，先重新執行：

```bash
turso auth login
```

### 4. 只在網頁建立了 DB，但沒有生成 token

Origami 需要這兩者同時存在：

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`

### 5. 把開發庫和正式庫混用了

如果你同時有 `origami-dev`、`origami-prod` 這類多個資料庫，務必再次確認：

- `.env` 裡填的是哪一個
- 部署實際連的是哪一個
- `db:setup` 跑的是哪一個

## 一句話驗收標準

如果 `npm run db:setup` 能成功完成，而且之後的首次初始化流程也能正常走通，這篇配置基本就算完成了。
