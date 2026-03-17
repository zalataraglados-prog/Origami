# Outlook OAuth 详细配置

这页讲的是：**怎么把 Outlook / Microsoft 365 邮箱接入 Origami**。

它和 GitHub 登录不是一回事：

- **GitHub 登录**：负责进入 Origami
- **Outlook OAuth**：负责让 Origami 访问你的 Outlook 邮箱

如果你现在的目标是：

> “我已经能登录 Origami 了，现在想按步骤把 Outlook / Microsoft 365 邮箱真正接进去。”

那就做这页。

---

## 这一步做完后，你应该拿到什么？

如果你先走最简单的环境变量方案，最终要把这些值填进 `.env`：

```txt
OUTLOOK_CLIENT_ID=...
OUTLOOK_CLIENT_SECRET=...
```

同时你也要确保：

```txt
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

已经是正确的，因为 Microsoft OAuth 的 redirect URI 要和它对应。

你可以把这一步理解成：

> 去 Microsoft Entra 后台创建一个 Web 应用，让 Origami 可以发起 Outlook / Microsoft 365 授权，然后把微软给你的 Client ID / Secret 抄回 `.env`。

---

## 你现在在哪两个地方来回操作？

这一步主要在 **两个地方来回切换**：

### 地方 A：Microsoft Entra admin center

你会在这里：

- 注册 app
- 配 Authentication
- 创建 Client Secret
- 添加 Microsoft Graph 权限
- 视情况授予 admin consent

### 地方 B：Origami 项目的 `.env`

你会把值填回：

```txt
NEXT_PUBLIC_APP_URL=
OUTLOOK_CLIENT_ID=
OUTLOOK_CLIENT_SECRET=
```

所以记住这句就够了：

> **Microsoft Entra 后台负责“生成 Outlook OAuth 配置”，`.env` 负责“接收这套配置”。**

---

## 官方参考链接

- 注册 Microsoft Entra 应用  
  <https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app>
- 添加 Redirect URI  
  <https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-redirect-uri>
- 添加 / 管理 client secret  
  <https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-credentials>
- Microsoft Graph permissions reference  
  <https://learn.microsoft.com/en-us/graph/permissions-reference>

---

## Origami 目前会请求哪些 Microsoft scopes？

按当前代码，Origami 会请求：

- `openid`
- `email`
- `User.Read`
- `Mail.Read`
- `Mail.ReadWrite`
- `Mail.Send`
- `offline_access`

相关代码位置：

- `src/lib/providers/outlook.ts`

你现在不用死记全部细节，只要知道：

- `Mail.Read` / `Mail.ReadWrite` 跟读邮件和写回有关
- `Mail.Send` 跟发信有关
- `offline_access` 跟刷新 token 有关

---

## 先理解一个重要点：默认 env Outlook app 走的是 `tenant=common`

当前环境变量默认 Outlook app 的实现，走的是：

- `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`

这意味着它更适合：

- 个人 Outlook / Hotmail / Live 账号
- 多租户 / 不想一开始就绑定单一组织 tenant 的场景

如果你只想绑定某个特定组织 tenant，更推荐：

- 先完成 GitHub 登录
- 再在 Origami `/accounts` 里创建 **数据库版 Outlook OAuth app**
- 把 tenant 精确写成你的 tenant id 或 tenant 域名

---

## 两种配置方式：第一次建议选哪种？

### 方式 A：环境变量默认 Outlook App（第一次最推荐）

你在 `.env` 里填：

```txt
OUTLOOK_CLIENT_ID=...
OUTLOOK_CLIENT_SECRET=...
```

### 方式 B：数据库版 Outlook App

如果你后面需要：

- 不同 tenant
- 不同环境分多套 app
- 更细的 app 管理

可以在 Origami 后台 `/accounts` 里创建数据库版 Outlook app。

### 我建议第一次怎么做？

**先用方式 A。**

原因很简单：

- 变量最少
- 路线最直
- 最容易排错

---

## 开始之前，先把这张“抄表”填好

建议你先把这些值写出来：

### 本地开发

```txt
应用地址（APP URL）
http://localhost:3000

Microsoft Redirect URI
http://localhost:3000/api/oauth/outlook

App registration name
Origami Outlook Local
```

### 生产环境

```txt
应用地址（APP URL）
https://mail.example.com

Microsoft Redirect URI
https://mail.example.com/api/oauth/outlook

App registration name
Origami Outlook Production
```

> 很推荐：本地和生产各一套 app registration，不要混着用。

---

## 如果你看到的界面和本文不完全一样

Microsoft Entra 后台也会改名字和导航位置。你优先认这些关键词：

- `Microsoft Entra admin center`
- `App registrations`
- `New registration`
- `Authentication`
- `Certificates & secrets`
- `API permissions`
- `Delegated permissions`
- `Grant admin consent`

有时 `Entra ID` 的显示也会略有不同，但只要你还在应用注册页面体系里，一般方向就是对的。

---

## 用户点击脚本：从零开始创建 Outlook OAuth App

### 第 1 步：打开 Microsoft Entra Admin Center

打开：

- <https://entra.microsoft.com>

### 你现在应该看到什么？

你应该已经进入 Microsoft Entra 管理后台，通常能看到：

- 左侧导航
- 搜索栏
- 租户 / 目录信息

如果你有多个租户，先确认当前所在的是你准备创建应用的那个租户。

---

### 第 2 步：注册应用

按这条线点：

1. **Entra ID**
2. **App registrations**
3. **New registration**

官方文档：

- <https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app>

#### Name 怎么填？

建议直接写：

- 本地：`Origami Outlook Local`
- 生产：`Origami Outlook Production`

#### Supported account types 怎么选？

这是最容易犹豫的地方。

##### 如果你打算用环境变量默认 Outlook app

建议优先考虑范围更宽的选项，例如：

- **Accounts in any organizational directory and personal Microsoft accounts**

因为默认 env app 走的是 `tenant=common`，和这种配置更一致。

##### 如果你只给某一个公司 / 组织 tenant 用

你也可以做成更收口的组织内应用。  
但这种情况下，更推荐你后面在 Origami 里改用**数据库版 Outlook app**，并把 tenant 精确写进去，而不是硬走默认 env app。

### 你现在应该看到什么？

注册成功后，你应该进入应用详情页，能看到：

- Application (client) ID
- 侧栏中的 Authentication
- 侧栏中的 Certificates & secrets
- 侧栏中的 API permissions

---

### 第 3 步：添加 Web Redirect URI

接下来按这条线点：

1. **Manage**
2. **Authentication**
3. **Add a platform**
4. 选择 **Web**

官方文档：

- <https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-redirect-uri>

### Redirect URI 这一栏怎么填？

必须精确对应 Origami：

- 本地：`http://localhost:3000/api/oauth/outlook`
- 生产：`https://你的域名/api/oauth/outlook`

### 这一步最容易犯什么错？

- 本地开发却填了生产域名
- 生产部署却还留着 `localhost`
- 忘了 `/api/oauth/outlook`

真正正确的写法一定是：

```txt
<APP_URL>/api/oauth/outlook
```

---

### 第 4 步：创建 Client Secret

按这条线点：

1. **Certificates & secrets**
2. **New client secret**

官方文档：

- <https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-credentials>

创建后你要保存两样：

- Application (client) ID
- Client secret Value

它们要分别回填到 `.env`：

```txt
OUTLOOK_CLIENT_ID=<Application (client) ID>
OUTLOOK_CLIENT_SECRET=<Client secret Value>
```

> 注意：client secret 的值通常只会完整显示一次。请立刻复制走。

---

### 第 5 步：添加 Microsoft Graph 权限

按这条线点：

1. **API permissions**
2. **Add a permission**
3. **Microsoft Graph**
4. **Delegated permissions**

然后把 Origami 需要的权限加上：

- `openid`
- `email`
- `User.Read`
- `Mail.Read`
- `Mail.ReadWrite`
- `Mail.Send`
- `offline_access`

官方参考：

- <https://learn.microsoft.com/en-us/graph/permissions-reference>

### 这一步你真正要确认什么？

不是去研究所有 Graph 权限，而是确认：

> 你创建的这套 app，已经具备 Origami 所需的 Delegated permissions。

---

### 第 6 步：看你是否需要 Grant admin consent

这取决于你的租户策略。

常见情况：

- **个人微软账号 / 自己测试**：通常用户自己授权就够了
- **公司 / 学校租户**：可能需要管理员额外点 **Grant admin consent**

如果你发现授权时被组织策略拦住，优先回来检查这里。

---

## 现在回到 `.env`，把哪几行填掉？

切回 Origami 项目的 `.env`，填入：

```txt
NEXT_PUBLIC_APP_URL=http://localhost:3000
OUTLOOK_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
OUTLOOK_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

### 这 3 行怎么理解最简单？

- `NEXT_PUBLIC_APP_URL`：我从哪里打开 Origami
- `OUTLOOK_CLIENT_ID`：微软给我的这套 app 编号
- `OUTLOOK_CLIENT_SECRET`：微软给我的这套 app 密钥

---

## 填完 `.env` 后，立刻做这一轮核对

逐项确认：

- 当前看的 app registration 是不是正确那一套？
- **Supported account types** 选得对吗？
- **Authentication** 里的 Web redirect URI 是不是精确等于 `<APP_URL>/api/oauth/outlook`？
- `OUTLOOK_CLIENT_ID` / `OUTLOOK_CLIENT_SECRET` 是不是来自这套 app？
- `API permissions` 里是否已经有 `Mail.Read`、`Mail.ReadWrite`、`Mail.Send`？
- 如果你在组织 tenant 里使用，是不是需要管理员授予 admin consent？

如果这几项都没问题，Outlook OAuth 大概率就能跑通。

---

## 下一步：回到 Origami 里验证 Outlook 接入

现在启动 Origami：

```bash
npm run dev
```

然后：

1. 先完成 GitHub 登录
2. 打开 `/accounts`
3. 选择添加 Outlook 账号
4. 浏览器会跳到 Microsoft 登录 / 授权页
5. 选择账号并同意授权
6. 自动跳回 Origami

### 你现在应该看到什么？

理想情况是：

- `/accounts` 里出现新的 Outlook 账号
- 后续能同步邮件
- 能查看邮件
- 能发信
- 需要时能走写回能力

只要这条链路通了，Outlook OAuth 基本就是好的。

---

## 最常见的错误，怎么快速定位？

### 1. `AADSTS50011` / redirect URI mismatch

这是最经典的错误，永远先查三项：

- Entra 里的 Web redirect URI
- `NEXT_PUBLIC_APP_URL`
- 实际 callback `/api/oauth/outlook`

这三者必须完全一致。

### 2. 能登录微软，但回到 Origami 后失败

优先检查：

- 本地 / 生产是不是用了错的 Client ID
- Client Secret 是否复制错
- Redirect URI 是否少写了 `/api/oauth/outlook`

### 3. 发信时报缺少权限

检查这些权限是不是都在：

- `Mail.Send`
- `Mail.ReadWrite`

Origami 的发信和写回能力都依赖它们。

### 4. 个人微软账号无法授权

先看 **Supported account types**。  
如果你要支持 Outlook.com / Hotmail 这类个人账号，却把应用限制成单一组织 tenant，就会出各种奇怪问题。

### 5. 公司租户里别人授权不过

大概率是租户策略或 admin consent 的问题，不一定是 Origami 本身配置错了。

### 6. 我只想给一个 tenant 用，但默认 env app 感觉别扭

这不是错觉。因为默认 env app 走的是 `tenant=common`。如果你就是要强绑定某个组织 tenant，更推荐：

- 改用数据库版 Outlook app
- 在 Origami 里把 tenant 明确写死

---

## 我推荐你最终怎么配

如果你问我“最稳的 Outlook 配法是什么”，我的建议是：

1. **本地和生产分两个 app registration**
2. **默认 env app 只用在最简单场景**
3. **如果涉及特定 tenant，就改用数据库版 Outlook app**
4. **Redirect URI 分环境精确填写**
5. **先把权限加齐，再回 Origami 做授权测试**

这是对普通用户最不容易绕晕的一条路。

---

## 下一步看什么？

Outlook 配好之后，通常回头补齐前面的基础设施：

1. [Cloudflare R2 / Bucket 详细配置](/r2-storage)
2. [GitHub Auth 详细配置](/github-auth)
3. [Gmail OAuth 详细配置](/gmail-oauth)
