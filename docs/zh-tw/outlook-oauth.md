# Outlook OAuth 詳細配置

這頁講的是：**怎麼把正式環境裡的 Outlook / Microsoft 365 郵箱接入 Origami**。

GitHub 登入負責讓你進入 Origami；Outlook OAuth 負責讓 Origami 存取 Outlook 郵箱。

## 這頁會幫你拿到什麼

按這頁做完，你應該能拿到並確認這幾項：

- 一個可用於 Origami 的 Microsoft Entra app registration
- 一個正確的 Web Redirect URI
- 一組正確的 Microsoft Graph delegated permissions
- 一組可填回 `.env` 的 `OUTLOOK_CLIENT_ID` / `OUTLOOK_CLIENT_SECRET`

## 最後要填回 `.env` 的值

```txt
NEXT_PUBLIC_APP_URL=https://mail.example.com
OUTLOOK_CLIENT_ID=...
OUTLOOK_CLIENT_SECRET=...
```

## 官方參考

- 註冊 Microsoft Entra 應用  
  <https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app>
- 新增 Redirect URI  
  <https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-redirect-uri>
- 管理 client secret  
  <https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-credentials>
- Microsoft Graph permissions reference  
  <https://learn.microsoft.com/en-us/graph/permissions-reference>

## Origami 目前會請求的 scopes

- `openid`
- `email`
- `User.Read`
- `Mail.Read`
- `Mail.ReadWrite`
- `Mail.Send`
- `offline_access`

## 開始前先抄表

```txt
正式訪問地址
https://mail.example.com

Microsoft Redirect URI
https://mail.example.com/api/oauth/outlook

App registration name
Origami Outlook Production
```

> 如果你先用臨時網域建立 app，之後改正式網域時，也要同步改 Redirect URI。

## 你會在兩個地方來回操作

### 地方 A：Microsoft Entra admin center

你會在這裡：

- 註冊 app
- 配 Authentication
- 建立 Client Secret
- 新增 Microsoft Graph 權限

### 地方 B：Origami 的 `.env`

你會把值填回：

```txt
NEXT_PUBLIC_APP_URL=
OUTLOOK_CLIENT_ID=
OUTLOOK_CLIENT_SECRET=
```

## 使用者點擊腳本

### 第 1 步：打開 Microsoft Entra Admin Center

打開：

- <https://entra.microsoft.com>

如果你有多個租戶，先切到你要建立這個 app 的那一個。

### 第 2 步：註冊應用

按這個順序點：

1. **Entra ID**
2. **App registrations**
3. **New registration**

建議名稱：

```txt
Origami Outlook Production
```

如果你希望兼容常見 Outlook / Microsoft 帳號，建議選擇同時包含組織帳號與個人 Microsoft 帳號的 supported account types。

### 第 3 步：新增 Web Redirect URI

按這個順序點：

1. **Manage**
2. **Authentication**
3. **Add a platform**
4. 選 **Web**

Redirect URI 必須精確填成：

```txt
https://mail.example.com/api/oauth/outlook
```

最常見的錯是：

- 寫成首頁地址
- 漏了 `/api/oauth/outlook`
- 網域和 `NEXT_PUBLIC_APP_URL` 不一致

### 第 4 步：建立 Client Secret

按這個順序點：

1. **Certificates & secrets**
2. **New client secret**

建立後保存：

- Application (client) ID
- Client secret Value

> 複製的是 **Value**，不是 secret 名稱，也不是 secret ID。

### 第 5 步：新增 Microsoft Graph 權限

按這個順序點：

1. **API permissions**
2. **Add a permission**
3. **Microsoft Graph**
4. **Delegated permissions**

然後加入：

- `openid`
- `email`
- `User.Read`
- `Mail.Read`
- `Mail.ReadWrite`
- `Mail.Send`
- `offline_access`

若你的租戶策略有要求，也要在這裡處理 **Grant admin consent**。

## 現在回到 `.env`

```txt
NEXT_PUBLIC_APP_URL=https://mail.example.com
OUTLOOK_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
OUTLOOK_CLIENT_SECRET=your-microsoft-oauth-client-secret
```

## 填完後先核對

請確認：

- 目前 app registration 是正確那個
- Web redirect URI 等於 `<APP_URL>/api/oauth/outlook`
- `.env` 裡的 client id / secret 來自這一套 app
- 權限中包含 `Mail.Read`、`Mail.ReadWrite`、`Mail.Send`
- 如租戶需要，admin consent 已處理

## 怎麼驗證配置真的好了

部署完成後：

1. 先登入 Origami
2. 打開 `/accounts`
3. 選擇新增 Outlook 帳號
4. 完成 Microsoft 授權流程
5. 回到 Origami

理想結果是：

- `/accounts` 中出現新的 Outlook 帳號
- 能同步郵件
- 能閱讀郵件
- 能發信

建議再補做兩個小驗證：

1. 手動同步一次，確認最近郵件真的能拉下來
2. 發一封測試郵件，確認 `Mail.Send` 真正可用

## 最常見錯誤

### 1. `AADSTS50011` / redirect URI mismatch

優先檢查：

- Entra 裡的 Web redirect URI
- `NEXT_PUBLIC_APP_URL`
- 實際 callback `/api/oauth/outlook`

### 2. Microsoft 登入成功，但回到 Origami 後失敗

通常是 client id、client secret 或 redirect URI 其中之一錯了。

### 3. 發信時報權限不足

請確認至少有：

- `Mail.Send`
- `Mail.ReadWrite`

### 4. 在公司租戶裡授權卡住

通常更像是租戶策略或 admin consent 問題，不一定是 Origami 本身配置錯。

### 5. secret 看起來有建，但系統說無效

請確認你填回 `.env` 的真的是 **Client secret Value**，不是舊值、名稱或 ID。

## 一句話驗收標準

如果你能從 `/accounts` 完成 Outlook 授權、回跳後看到帳號接入成功，並且這個帳號既能同步又能發信，這篇配置基本就算完成了。
