# Gmail OAuth 详细配置

这页讲的是：**怎么把生产环境里的 Gmail 账号接入 Origami**。

它不是 GitHub 登录。GitHub 负责让你进入 Origami，Gmail OAuth 负责让 Origami 访问你的 Gmail 邮箱。

## 这页会帮你拿到什么

按这页做完，你应该能拿到并确认这几项：

- 一个专门给 Origami 用的 Google Cloud Project
- 已启用的 Gmail API
- 一个配置完成的 OAuth consent screen
- 一个类型正确的 **Web application** OAuth client
- 一组可填回 `.env` 的 `GMAIL_CLIENT_ID` / `GMAIL_CLIENT_SECRET`

## 最终你要填回 `.env` 的值

```txt
NEXT_PUBLIC_APP_URL=https://mail.example.com
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
```

## 官方参考

- 启用 Google Workspace API  
  <https://developers.google.com/workspace/guides/enable-apis>
- 配置 OAuth consent screen  
  <https://developers.google.com/workspace/guides/configure-oauth-consent>
- 创建 OAuth credentials  
  <https://developers.google.com/workspace/guides/create-credentials>
- Gmail scopes 说明  
  <https://developers.google.com/workspace/gmail/api/auth/scopes>

## Origami 当前会请求的 Gmail scopes

- `https://www.googleapis.com/auth/gmail.modify`
- `https://www.googleapis.com/auth/gmail.send`
- `https://www.googleapis.com/auth/userinfo.email`

## 开始前先抄表

```txt
正式访问地址
https://mail.example.com

Google OAuth Redirect URI
https://mail.example.com/api/oauth/gmail

Google Cloud Project name
Origami Gmail Production

Consent Screen App name
Origami Gmail Production
```

> 本页里的 `mail.example.com` 只是示例，请替换成你自己的正式域名。
>
> **不要把 Preview / 临时域名当成正式 Redirect URI。**
> 如果你后面换了正式域名，Google Cloud Console 里的 Redirect URI 也必须一起改。

## 你会在两个地方来回操作

### 地方 A：Google Cloud Console

你会在这里：

- 创建或选择 project
- 启用 Gmail API
- 配置 OAuth consent screen
- 创建 Web OAuth client

### 地方 B：Origami 项目的 `.env`

你会把值填回：

```txt
NEXT_PUBLIC_APP_URL=
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
```

## 用户点击脚本

### 第 1 步：打开 Google Cloud Console

打开：

- <https://console.cloud.google.com/>

确认当前进入的是你准备给 Origami 使用的 Google 账号。

### 第 2 步：创建或切换到专用 Project

建议项目名直接写：

```txt
Origami Gmail Production
```

创建或切换完成后，确认顶部显示的项目名已经是这一个。

### 第 3 步：启用 Gmail API

按这个顺序点：

1. **APIs & Services**
2. **Library**
3. 搜索 `Gmail API`
4. 点进去
5. 点击 **Enable**

成功后，Gmail API 应该处于已启用状态。

### 第 4 步：配置 OAuth consent screen

Google 控制台的导航名字有时会微调，但你通常会看到类似这些入口：

1. **Google Auth platform**
2. **Branding**
3. **Audience**
4. **Data Access**

#### Branding

建议填写：

- **App name**：`Origami Gmail Production`
- **User support email**：你的邮箱
- **Developer contact email**：你的邮箱

#### Audience

如果你是自托管给自己使用，通常选：

- **External**

然后把你实际要授权的 Google 账号加入：

- **Test users**

> 对个人自托管场景来说，看到 testing / test users 并不奇怪。  
> 只要是你自己或你明确加入的测试账号在授权，这通常就是正常路径。

#### Data Access

确认这套 app 可以请求 Origami 真正需要的 Gmail scopes。

### 第 5 步：创建 OAuth Client ID

按这个顺序点：

1. 进入 credentials 创建入口
2. 选择 **OAuth client ID**
3. 应用类型选 **Web application**

> 不要选 Desktop app。Origami 是服务端 Web 应用。

#### Redirect URI 填什么

必须精确填写：

```txt
https://mail.example.com/api/oauth/gmail
```

最常见的错误有三个：

- 写成首页 URL
- 漏了 `/api/oauth/gmail`
- 域名和 `NEXT_PUBLIC_APP_URL` 不一致

### 第 6 步：保存 Client ID 和 Client Secret

创建完成后，Google 会展示：

- Client ID
- Client Secret

把它们立刻复制下来。

## 现在回到 `.env`

填入：

```txt
NEXT_PUBLIC_APP_URL=https://mail.example.com
GMAIL_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your-google-oauth-client-secret
```

## 填完后先核对

逐项确认：

- 当前 Google Cloud Project 是正确那一个
- `Gmail API` 已启用
- consent screen 已配置完成
- OAuth client 类型是 **Web application**
- Redirect URI 等于 `<APP_URL>/api/oauth/gmail`
- `.env` 里的 `GMAIL_CLIENT_ID` / `GMAIL_CLIENT_SECRET` 来自刚刚这套 client

## 怎么验证配置真的好了

部署完成后：

1. 先登录 Origami
2. 打开 `/accounts`
3. 选择添加 Gmail 账号
4. 浏览器跳到 Google 授权页
5. 同意授权
6. 自动跳回 Origami

理想结果是：

- `/accounts` 里出现新的 Gmail 账号
- 能同步邮件
- 能查看邮件
- 能发信

建议你再补做两个小验证：

1. 随手同步一次，确认收件列表确实出来了
2. 发一封带小附件的测试邮件，确认读写两条链路都通

## 最常见错误

### 1. `redirect_uri_mismatch`

永远先看这三项：

- Google OAuth Client 里的 redirect URI
- `NEXT_PUBLIC_APP_URL`
- 实际 callback `/api/oauth/gmail`

### 2. 授权页能打开，但授权后回不来

通常还是 redirect URI 写错，或者 `.env` 里填了错误的 client。

### 3. 看到了 testing / app not verified 相关提示

先检查：

- Audience 是否为 **External**
- 当前 Google 账号是否已加入 **Test users**

如果这是你自己的自托管实例，这类提示很多时候只是说明 app 还没走公开发布流程，不代表 Origami 配错了。

### 4. 授权成功了，但发信时报权限不足

检查 scopes 是否包含：

- `gmail.send`
- `gmail.modify`

### 5. 明明昨天能用，换域名后今天不能用了

优先检查：

- `NEXT_PUBLIC_APP_URL`
- Google OAuth client 的 Redirect URI
- 浏览器当前访问的正式域名

这三者必须继续保持一致。

## 一句话验收标准

如果你能在 `/accounts` 里完成 Gmail 授权、回跳后看到账号接入成功，并且这账号既能同步又能发信，那这篇配置基本就算完成了。

## 下一步看什么

Gmail 配好之后，通常继续：

1. [Outlook OAuth 详细配置](/outlook-oauth)
2. [Cloudflare R2 / Bucket 详细配置](/r2-storage)
