# Gmail OAuth 詳細配置

這頁講的是：**怎麼把正式環境裡的 Gmail 帳號接入 Origami**。

GitHub 登入負責讓你進入 Origami；Gmail OAuth 負責讓 Origami 存取你的 Gmail 郵箱。

## 這頁會幫你拿到什麼

按這頁做完，你應該能拿到並確認這幾項：

- 一個專門給 Origami 用的 Google Cloud Project
- 已啟用的 Gmail API
- 一個配置完成的 OAuth consent screen
- 一個類型正確的 **Web application** OAuth client
- 一組可填回 `.env` 的 `GMAIL_CLIENT_ID` / `GMAIL_CLIENT_SECRET`

## 最後要填回 `.env` 的值

```txt
NEXT_PUBLIC_APP_URL=https://mail.example.com
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
```

## 官方參考

- 啟用 Google Workspace API  
  <https://developers.google.com/workspace/guides/enable-apis>
- 配置 OAuth consent screen  
  <https://developers.google.com/workspace/guides/configure-oauth-consent>
- 建立 OAuth credentials  
  <https://developers.google.com/workspace/guides/create-credentials>
- Gmail scopes 說明  
  <https://developers.google.com/workspace/gmail/api/auth/scopes>

## Origami 目前會請求的 Gmail scopes

- `https://www.googleapis.com/auth/gmail.modify`
- `https://www.googleapis.com/auth/gmail.send`
- `https://www.googleapis.com/auth/userinfo.email`

## 開始前先抄表

```txt
正式訪問地址
https://mail.example.com

Google OAuth Redirect URI
https://mail.example.com/api/oauth/gmail

Google Cloud Project name
Origami Gmail Production

Consent Screen App name
Origami Gmail Production
```

> 不要把臨時 preview 網域當成正式 Redirect URI。之後如果正式網域變了，Google OAuth client 也必須一起更新。

## 你會在兩個地方來回操作

### 地方 A：Google Cloud Console

你會在這裡：

- 建立或選擇 project
- 啟用 Gmail API
- 配置 OAuth consent screen
- 建立 Web OAuth client

### 地方 B：Origami 的 `.env`

你會把值填回：

```txt
NEXT_PUBLIC_APP_URL=
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
```

## 使用者點擊腳本

### 第 1 步：打開 Google Cloud Console

打開：

- <https://console.cloud.google.com/>

確認你目前使用的是要為 Origami 管理這套設定的 Google 帳號。

### 第 2 步：建立或切換到專用 Project

建議專案名稱直接寫：

```txt
Origami Gmail Production
```

### 第 3 步：啟用 Gmail API

按這個順序點：

1. **APIs & Services**
2. **Library**
3. 搜尋 `Gmail API`
4. 點進去
5. 點 **Enable**

### 第 4 步：配置 OAuth consent screen

Google 控制台的導覽名稱偶爾會調整，但通常會看到類似這些入口：

1. **Google Auth platform**
2. **Branding**
3. **Audience**
4. **Data Access**

建議填：

- **App name**：`Origami Gmail Production`
- **User support email**：你的郵箱
- **Developer contact email**：你的郵箱

如果你是自託管給自己使用，通常 `Audience` 選 `External`，並把實際要授權的 Google 帳號加入 **Test users**。

### 第 5 步：建立 OAuth Client ID

選：

- **OAuth client ID**
- 應用類型：**Web application**

不要選 **Desktop app**。Origami 是服務端 Web 應用。

Redirect URI 必須精確填成：

```txt
https://mail.example.com/api/oauth/gmail
```

最常見的錯有三個：

- 寫成首頁 URL
- 漏了 `/api/oauth/gmail`
- 網域和 `NEXT_PUBLIC_APP_URL` 不一致

### 第 6 步：保存 Client ID 與 Client Secret

建立完成後，立刻把這兩個值複製下來。

## 現在回到 `.env`

```txt
NEXT_PUBLIC_APP_URL=https://mail.example.com
GMAIL_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your-google-oauth-client-secret
```

## 填完後先核對

請確認：

- 當前 Google Cloud Project 是正確那個
- Gmail API 已啟用
- consent screen 已配置完成
- OAuth client 類型是 **Web application**
- Redirect URI 等於 `<APP_URL>/api/oauth/gmail`
- `.env` 裡的 client id / secret 來自這一套 client

## 怎麼驗證配置真的好了

部署完成後：

1. 先登入 Origami
2. 打開 `/accounts`
3. 選擇新增 Gmail 帳號
4. 完成 Google 授權流程
5. 自動回到 Origami

理想結果是：

- `/accounts` 中出現新的 Gmail 帳號
- 能同步郵件
- 能閱讀郵件
- 能發信

建議再補做兩個小驗證：

1. 手動同步一次，確認收件列表真的出來了
2. 發一封小測試郵件，最好順手帶個小附件

## 最常見錯誤

### 1. `redirect_uri_mismatch`

永遠先比這三項：

- Google Cloud 裡的 redirect URI
- `NEXT_PUBLIC_APP_URL`
- 實際 callback `/api/oauth/gmail`

### 2. 授權頁能打開，但授權後回不來

通常還是 redirect URI 寫錯，或 `.env` 裡填了錯誤的 client。

### 3. 看到 testing / app not verified 提示

先檢查：

- Audience 是否為 `External`
- 目前授權的 Google 帳號是否已加入 **Test users**

對個人自託管場景來說，這類提示很多時候只是表示 app 尚未做公開驗證，並不等於 Origami 配錯。

### 4. 授權成功了，但發信報權限不足

檢查 scopes 是否包含：

- `gmail.send`
- `gmail.modify`

### 5. 之前能用，換網域後突然不行

請重新一起核對：

- `NEXT_PUBLIC_APP_URL`
- Google OAuth client 的 Redirect URI
- 你目前實際訪問的正式網域

## 一句話驗收標準

如果你能從 `/accounts` 完成 Gmail 授權、回跳後看到帳號接入成功，並且這個帳號既能同步又能發信，這篇配置基本就算完成了。
