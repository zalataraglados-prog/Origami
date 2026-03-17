# Gmail OAuth 详细配置

这页讲的是：**怎么把 Gmail 账号接入 Origami**。

它不是 GitHub 登录：

- **GitHub 登录**：让你进入 Origami 后台
- **Gmail OAuth**：让 Origami 拿到 Gmail 邮箱的访问权限

如果你现在的目标是：

> “我已经能登录 Origami 了，现在想按步骤把 Gmail 真正接进去。”

那就做这页。

---

## 这一步做完后，你应该拿到什么？

如果你先走最简单的环境变量方案，最终要把这些值填进 `.env`：

```txt
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
```

同时你也要确保：

```txt
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

已经是正确的，因为 Google OAuth redirect URI 要和它对应。

你可以把这一步理解成：

> 去 Google Cloud Console 创建一个 Web OAuth 应用，让 Origami 可以把 Gmail 授权页拉起来，然后把 Google 给你的 Client ID / Secret 抄回 `.env`。

---

## 你现在在哪两个地方来回操作？

这一步主要在 **两个地方来回切换**：

### 地方 A：Google Cloud Console

你会在这里：

- 创建或选择 project
- 启用 Gmail API
- 配 OAuth consent screen
- 创建 OAuth client ID
- 拿到 Client ID / Client Secret

### 地方 B：Origami 项目的 `.env`

你会把值填回：

```txt
NEXT_PUBLIC_APP_URL=
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
```

所以记住这句就够了：

> **Google Cloud Console 负责“生成 Gmail OAuth 配置”，`.env` 负责“接收这套配置”。**

---

## 官方参考链接

- 启用 Google Workspace API  
  <https://developers.google.com/workspace/guides/enable-apis>
- 配置 OAuth consent screen  
  <https://developers.google.com/workspace/guides/configure-oauth-consent>
- 创建 access credentials  
  <https://developers.google.com/workspace/guides/create-credentials>
- Gmail API Node.js quickstart  
  <https://developers.google.com/workspace/gmail/api/quickstart/nodejs>
- Gmail scopes 说明  
  <https://developers.google.com/workspace/gmail/api/auth/scopes>

---

## Origami 目前会请求哪些 Gmail scopes？

按当前代码，Origami 主要会请求：

- `https://www.googleapis.com/auth/gmail.modify`
- `https://www.googleapis.com/auth/gmail.send`
- `https://www.googleapis.com/auth/userinfo.email`

相关代码位置：

- `src/lib/providers/gmail.ts`

你现在不用死记这些 scope 的全部含义，只要知道：

- `gmail.modify` 跟读写邮件状态有关
- `gmail.send` 跟发信有关
- `userinfo.email` 跟识别当前 Google 账号有关

---

## 两种配置方式：第一次建议选哪种？

### 方式 A：环境变量默认 Gmail App（第一次最推荐）

在 `.env` 里填：

```txt
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
```

然后 Origami 里所有 Gmail 授权默认都走这套 app。

### 方式 B：数据库版 Gmail App

如果你不想把 Gmail OAuth 凭据写在环境变量里，也可以先登录 Origami，再去 `/accounts` 里创建数据库版 OAuth app。

### 我建议第一次怎么做？

**先用方式 A。**

原因很简单：

- 变量最少
- 步骤最直
- 最容易排错

---

## 开始之前，先把这张“抄表”填好

建议你先把这些值写出来：

### 本地开发

```txt
应用地址（APP URL）
http://localhost:3000

Google OAuth Redirect URI
http://localhost:3000/api/oauth/gmail

Project name
Origami Gmail Local

App name on consent screen
Origami Gmail Local
```

### 生产环境

```txt
应用地址（APP URL）
https://mail.example.com

Google OAuth Redirect URI
https://mail.example.com/api/oauth/gmail

Project name
Origami Gmail Production

App name on consent screen
Origami Gmail Production
```

> 强烈建议：本地和生产分两个 Google Cloud Project，不要混。

---

## 如果你看到的界面和本文不完全一样

Google Cloud Console 改版很频繁，所以按钮位置和栏目名字有时会变。你优先认这些关键词：

- `Google Cloud Console`
- `APIs & Services`
- `Gmail API`
- `Google Auth platform`
- `Branding`
- `Audience`
- `Data Access`
- `OAuth client ID`
- `Web application`

如果你发现页面跟本文不完全一样，不一定是你走错了，很多时候只是 Google 又改 UI 了。

---

## 用户点击脚本：从零开始创建 Gmail OAuth App

### 第 1 步：打开 Google Cloud Console

打开：

- <https://console.cloud.google.com/>

### 你现在应该看到什么？

你应该已经进入 Google Cloud Console，通常能看到：

- 顶部项目切换器
- 左上角菜单
- 搜索栏

如果你已经有多个 Google Cloud Project，先确认你当前选的是准备给 Gmail 用的那一个。

---

### 第 2 步：创建或切换到一个专用 Project

如果你还没有 project，按这个顺序点：

1. 顶部项目选择器
2. **New Project**
3. 填项目名
4. 创建完成后切换进去

建议项目名直接写：

- 本地：`Origami Gmail Local`
- 生产：`Origami Gmail Production`

### 你现在应该看到什么？

切换成功后，顶部项目名应该已经变成你刚才那个名字。

如果顶部还是旧项目名，说明你还没切成功。

---

### 第 3 步：启用 Gmail API

在控制台中按这条线点：

1. **APIs & Services**
2. **Library**
3. 搜索 `Gmail API`
4. 点进去
5. 点击 **Enable**

官方文档：

- <https://developers.google.com/workspace/guides/enable-apis>

### 你现在应该看到什么？

启用成功后，通常会看到：

- `Gmail API` 页面
- 状态已经不是需要启用，而是已经启用

如果你还看到的是“尚未启用”的状态，那这一步还没完成。

---

### 第 4 步：配置 OAuth consent screen

这一步很关键，没有它 Google OAuth 很难走通。

常见入口是：

1. **Google Auth platform**
2. **Branding**
3. **Audience**
4. **Data Access**

官方文档：

- <https://developers.google.com/workspace/guides/configure-oauth-consent>

#### 4.1 Branding 里填什么？

建议直接填：

- **App name**：`Origami Gmail Local` / `Origami Gmail Production`
- **User support email**：你的邮箱
- **Developer contact email**：你的邮箱

这些值的作用很现实：

- 后面授权时，你一眼能认出这是你自己的 app

#### 4.2 Audience 选什么？

##### 如果你只是个人自用 / 测试

选：

- **External**

然后把你自己的 Google 账号加入：

- **Test users**

##### 如果你只在自己公司的 Google Workspace 里用

可以考虑：

- **Internal**

但前提是你真的只有组织内使用这个需求。

#### 4.3 Data Access / Scopes 这一步怎么看？

这里的目标不是研究所有 Google API，而是确保这套 app 可以请求 Origami 真正需要的 Gmail scopes。

你只要知道 Origami 关心的是：

- `gmail.modify`
- `gmail.send`
- `userinfo.email`

---

### 第 5 步：创建 OAuth Client ID

接下来按这条线点：

1. 找到创建凭据 / credentials 的入口
2. 选择 **OAuth client ID**
3. 应用类型选 **Web application**

官方文档：

- <https://developers.google.com/workspace/guides/create-credentials>

> 不要选 Desktop app。Origami 是服务端 Web 应用。

### Redirect URI 这一栏怎么填？

必须和 Origami 精确对应：

- 本地：`http://localhost:3000/api/oauth/gmail`
- 生产：`https://你的域名/api/oauth/gmail`

### 这一步最容易犯什么错？

- 本地开发却填了正式域名
- 正式部署却还留着 `localhost`
- 忘了 `/api/oauth/gmail`

真正正确的写法一定是：

```txt
<APP_URL>/api/oauth/gmail
```

### 你现在应该看到什么？

创建完成后，Google 会给你：

- Client ID
- Client Secret

把它们立刻复制下来。

---

## 现在回到 `.env`，把哪几行填掉？

切回 Origami 项目的 `.env`，填入：

```txt
NEXT_PUBLIC_APP_URL=http://localhost:3000
GMAIL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxx
```

### 这 3 行怎么理解最简单？

- `NEXT_PUBLIC_APP_URL`：我从哪里打开 Origami
- `GMAIL_CLIENT_ID`：Google 给我的这个 Web app 的公开编号
- `GMAIL_CLIENT_SECRET`：Google 给我的这个 Web app 的密钥

---

## 填完 `.env` 后，立刻做这一轮核对

逐项确认：

- 当前 Google Cloud Project 对吗？
- `Gmail API` 已经是 **Enabled** 吗？
- consent screen 设置完成了吗？
- 如果你是个人自用，是不是选了 **External**？
- 你的 Google 账号是不是加进了 **Test users**？
- OAuth client 类型是不是 **Web application**？
- Redirect URI 是不是精确等于 `<APP_URL>/api/oauth/gmail`？
- `.env` 里的 `GMAIL_CLIENT_ID` / `GMAIL_CLIENT_SECRET` 是不是刚刚那套 client 的值？

如果这几项都对，Gmail OAuth 一般就稳了。

---

## 下一步：回到 Origami 里验证 Gmail 接入

现在启动 Origami：

```bash
npm run dev
```

然后：

1. 先完成 GitHub 登录
2. 打开 `/accounts`
3. 选择添加 Gmail 账号
4. 浏览器会跳到 Google 授权页
5. 你应该能看到你刚才配置的 app 名
6. 选择 Google 账号并同意授权
7. 自动跳回 Origami

### 你现在应该看到什么？

理想情况是：

- `/accounts` 里出现新的 Gmail 账号
- 后续能同步邮件
- 能查看邮件
- 能发信
- 需要时能走写回能力

只要这条链路通了，Gmail OAuth 基本就是好的。

---

## 关于 Google verification，你最需要知道什么？

很多人会被 Google 的文案吓到，但对自托管单用户场景来说，通常没想象中复杂。

### 如果你只是自己用 / 测试

通常这样就够了：

- app 保持测试状态
- Audience 选 **External**
- 把自己的 Google 账号加进 **Test users**

### 如果你想给很多外部用户公开使用

那就要认真看 Google 对敏感 / restricted scopes 的要求了。Origami 当前请求的 `gmail.modify` 权限比较高，审核成本会上升很多。

所以对 Origami 这种自托管项目，我的建议很明确：

> 先按“自己项目、自己账号、自己 test user”这条路跑通。

---

## 最常见的错误，怎么快速定位？

### 1. `redirect_uri_mismatch`

永远先看这三项：

- Google OAuth Client 里的 redirect URI
- `NEXT_PUBLIC_APP_URL`
- 实际 callback `/api/oauth/gmail`

这三者必须完全一致。

### 2. 授权页能打开，但授权后回不来

大概率还是 redirect URI 写错了，或者本地 / 生产的 Client ID 用错了。

### 3. 看到了 “app not verified” 或 testing 限制

先检查：

- app 是不是 **External**
- 当前授权的 Google 账号是不是已经加进 **Test users**

### 4. 授权成功了，但发信时报没权限

检查 scopes：

- `gmail.send`
- `gmail.modify`

Origami 的发信和部分写回依赖它们。

### 5. API 明明启用了，还是不行

再回头查这三处：

- 当前 project 对不对
- consent screen 有没有真正完成
- OAuth client 类型是不是 **Web application**

很多时候不是 Gmail API 没开，而是 OAuth app 没配完整。

---

## 我推荐你最终怎么配

如果你问我“最稳的 Gmail 配法是什么”，我的建议是：

1. **本地和生产分两个 Google Cloud Project**
2. **每个环境各自一个 Web OAuth client**
3. **Redirect URI 分环境精确填写**
4. **个人自用就用 External + Test users**
5. **第一次先走 `.env` 默认 app**

这是对普通用户最不绕、最容易排错的一条路。

---

## 下一步看什么？

Gmail 配好之后，通常继续：

1. [Outlook OAuth 详细配置](/outlook-oauth)
2. [Cloudflare R2 / Bucket 详细配置](/r2-storage)
