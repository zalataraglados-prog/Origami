# Outlook OAuth 详细配置

这页讲的是：**怎么把生产环境里的 Outlook / Microsoft 365 邮箱接入 Origami**。

它不是 GitHub 登录。GitHub 负责登录 Origami，Outlook OAuth 负责让 Origami 访问你的 Outlook 邮箱。

## 这页会帮你拿到什么

按这页做完，你应该能拿到并确认这几项：

- 一个可用于 Origami 的 Microsoft Entra app registration
- 一个正确的 Web Redirect URI
- 一组正确的 Microsoft Graph delegated permissions
- 一组可填回 `.env` 的 `OUTLOOK_CLIENT_ID` / `OUTLOOK_CLIENT_SECRET`

## 最终你要填回 `.env` 的值

```txt
NEXT_PUBLIC_APP_URL=https://mail.example.com
OUTLOOK_CLIENT_ID=...
OUTLOOK_CLIENT_SECRET=...
```

## 官方参考

- 注册 Microsoft Entra 应用  
  <https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app>
- 添加 Redirect URI  
  <https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-redirect-uri>
- 管理 client secret  
  <https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-credentials>
- Microsoft Graph permissions reference  
  <https://learn.microsoft.com/en-us/graph/permissions-reference>

## Origami 当前会请求的 scopes

- `openid`
- `email`
- `User.Read`
- `Mail.Read`
- `Mail.ReadWrite`
- `Mail.Send`
- `offline_access`

## 开始前先抄表

```txt
正式访问地址
https://mail.example.com

Microsoft Redirect URI
https://mail.example.com/api/oauth/outlook

App registration name
Origami Outlook Production
```

> 本页里的 `mail.example.com` 只是示例，请替换成你自己的正式域名。
>
> **如果你先用临时域名创建 app，后面改正式域名时也要同步改 Redirect URI。**

## 你会在两个地方来回操作

### 地方 A：Microsoft Entra admin center

你会在这里：

- 注册 app
- 配 Authentication
- 创建 Client Secret
- 添加 Microsoft Graph 权限

### 地方 B：Origami 项目的 `.env`

你会把值填回：

```txt
NEXT_PUBLIC_APP_URL=
OUTLOOK_CLIENT_ID=
OUTLOOK_CLIENT_SECRET=
```

## 用户点击脚本

### 第 1 步：打开 Microsoft Entra Admin Center

打开：

- <https://entra.microsoft.com>

如果你有多个租户，先确认当前所在的是你准备创建应用的那个租户。

### 第 2 步：注册应用

按这个顺序点：

1. **Entra ID**
2. **App registrations**
3. **New registration**

#### Name

建议填写：

```txt
Origami Outlook Production
```

#### Supported account types

如果你希望兼容常见 Outlook / Microsoft 账号，优先选择范围更宽的选项，例如：

- **Accounts in any organizational directory and personal Microsoft accounts**

> 如果你只打算给单一企业租户使用，也可以按自己的租户策略缩小范围。  
> 但只要你需要兼容个人 Outlook.com 账号，就别选太窄。

### 第 3 步：添加 Web Redirect URI

按这个顺序点：

1. **Manage**
2. **Authentication**
3. **Add a platform**
4. 选择 **Web**

Redirect URI 必须精确填写：

```txt
https://mail.example.com/api/oauth/outlook
```

最常见的错误是：

- 写成首页地址
- 漏了 `/api/oauth/outlook`
- 域名和 `NEXT_PUBLIC_APP_URL` 不一致

### 第 4 步：创建 Client Secret

按这个顺序点：

1. **Certificates & secrets**
2. **New client secret**

创建后保存：

- Application (client) ID
- Client secret Value

这两项要回填到 `.env`。

> Microsoft 的 secret 也常常只在创建后完整展示一次。  
> 复制的是 **Value**，不是 description，也不是 secret ID。

### 第 5 步：添加 Microsoft Graph 权限

按这个顺序点：

1. **API permissions**
2. **Add a permission**
3. **Microsoft Graph**
4. **Delegated permissions**

然后添加：

- `openid`
- `email`
- `User.Read`
- `Mail.Read`
- `Mail.ReadWrite`
- `Mail.Send`
- `offline_access`

如果你的组织策略要求，也要在这里处理 **Grant admin consent**。

## 现在回到 `.env`

填入：

```txt
NEXT_PUBLIC_APP_URL=https://mail.example.com
OUTLOOK_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
OUTLOOK_CLIENT_SECRET=your-microsoft-oauth-client-secret
```

## 填完后先核对

逐项确认：

- 当前 app registration 是正确那一个
- **Authentication** 里的 Web redirect URI 等于 `<APP_URL>/api/oauth/outlook`
- `OUTLOOK_CLIENT_ID` / `OUTLOOK_CLIENT_SECRET` 来自这套 app
- `API permissions` 已包含 `Mail.Read`、`Mail.ReadWrite`、`Mail.Send`
- 如处于组织租户，必要时已经完成 admin consent

## 怎么验证配置真的好了

部署完成后：

1. 先登录 Origami
2. 打开 `/accounts`
3. 选择添加 Outlook 账号
4. 浏览器跳到 Microsoft 登录 / 授权页
5. 同意授权
6. 自动跳回 Origami

理想结果是：

- `/accounts` 里出现新的 Outlook 账号
- 能同步邮件
- 能查看邮件
- 能发信

建议你再补做两个小验证：

1. 手动同步一次，确认最近邮件能拉下来
2. 发一封测试邮件，确认 `Mail.Send` 真正可用

## 最常见错误

### 1. `AADSTS50011` / redirect URI mismatch

优先检查：

- Entra 里的 Web redirect URI
- `NEXT_PUBLIC_APP_URL`
- 实际 callback `/api/oauth/outlook`

### 2. 能登录微软，但回到 Origami 后失败

优先检查：

- Client ID 是否填错
- Client Secret 是否复制错
- Redirect URI 是否少了 `/api/oauth/outlook`

### 3. 发信时报权限不足

检查这些权限是否已存在：

- `Mail.Send`
- `Mail.ReadWrite`

### 4. 公司租户里授权不过

大概率是组织策略或 admin consent 的问题，不一定是 Origami 本身配置错了。

### 5. 明明创建了 secret，但还是提示 client secret 无效

先确认你填回 `.env` 的是不是：

- **Client secret Value**

而不是：

- secret 名称
- secret ID
- 过期后重新生成前的旧值

## 一句话验收标准

如果你能在 `/accounts` 里完成 Outlook 授权、回跳后看到账号接入成功，并且这账号既能同步又能发信，那这篇配置基本就算完成了。

## 下一步看什么

Outlook 配好之后，通常继续：

1. [Cloudflare R2 / Bucket 详细配置](/r2-storage)
2. [GitHub Auth 详细配置](/github-auth)
3. [Gmail OAuth 详细配置](/gmail-oauth)
