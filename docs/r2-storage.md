# Cloudflare R2 / Bucket 详细配置

这页只讲一件事：**怎么把 Origami 的附件存储配起来**。

Origami 会把附件放在 Cloudflare R2，而不是直接塞进数据库。对邮件附件这种二进制大文件来说，这样更合理，也更容易维护。

如果你现在的目标是：

> “我想按步骤点开 Cloudflare，把 R2 配好，然后把值填回 `.env`。”

那就按这页一步步做。

---

## 这一步做完后，你应该拿到什么？

你最终需要把这些值放进 `.env`：

```txt
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=origami-attachments-prod
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

另外建议保留：

```txt
R2_ACCOUNT_ID=...
```

虽然当前运行时代码不强依赖它，但排障时非常方便。

你可以把这一步理解成：

> 去 Cloudflare 后台创建一个 bucket，再生成一组能访问这个 bucket 的 key，然后把这些值抄回 `.env`。

---

## 你现在在哪两个地方来回操作？

这一步你主要只在 **两个地方来回切换**：

### 地方 A：Cloudflare Dashboard

你会在这里：

- 找到 Account ID
- 创建 bucket
- 创建 R2 API token
- 看到 Access Key ID / Secret Access Key

### 地方 B：Origami 项目的 `.env`

你会把这些值填回：

```txt
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_ENDPOINT=
```

所以记住这句就够了：

> **Cloudflare 后台负责“生成存储配置”，`.env` 负责“接收这些配置”。**

---

## 官方参考链接

- Cloudflare R2：创建 bucket  
  <https://developers.cloudflare.com/r2/buckets/create-buckets/>
- Cloudflare R2：API token / S3 认证  
  <https://developers.cloudflare.com/r2/api/tokens/>
- Cloudflare：查找 Account ID  
  <https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/>

---

## 开始之前，先把这张“抄表”填好

建议你先写下这些值，再去点面板：

```txt
Cloudflare Account ID = ...
Bucket name = origami-attachments-prod
R2 endpoint = https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

如果你要分环境，我推荐这样命名：

- 开发：`origami-attachments-dev`
- 生产：`origami-attachments-prod`

> 非常推荐：开发 / 生产用两个 bucket，不要混。

---

## 如果你看到的界面和本文不完全一样

Cloudflare 后台也会改版，但你抓住下面这些关键词，一般不会迷路：

- `R2 Object Storage`
- `Buckets`
- `Manage R2 API tokens`
- `Account ID`

如果菜单位置和本文不一样，优先看页面标题和搜索，不要卡在某个按钮的位置上。

---

## 用户点击脚本：从零开始配置 R2

### 第 1 步：打开 Cloudflare Dashboard

打开：

- <https://dash.cloudflare.com/>

登录你的 Cloudflare 账号。

### 你现在应该看到什么？

你应该已经进入 Cloudflare 控制台，能看到：

- 账户首页
- 左侧导航
- 或者搜索入口

如果你有多个 Cloudflare account，先确认当前选的是你准备放 R2 的那个账号。

---

### 第 2 步：先找 Account ID

在 Cloudflare Dashboard 中，按这条线找：

1. 打开 **Account home** 或 **Workers & Pages**
2. 找到 **Account ID**
3. 复制下来

官方说明：

- <https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/>

### 你现在应该把哪一行记下来？

```txt
R2_ACCOUNT_ID=<你的 Account ID>
```

同时，顺手把 endpoint 也拼出来：

```txt
R2_ENDPOINT=https://<你的 Account ID>.r2.cloudflarestorage.com
```

例如：

```txt
R2_ENDPOINT=https://1234567890abcdef1234567890abcdef.r2.cloudflarestorage.com
```

---

### 第 3 步：打开 R2 页面并创建 bucket

继续在 Cloudflare 后台中找到：

- **R2 Object Storage**

然后点创建 bucket。

### bucket 名怎么填？

建议直接这样起：

- 开发：`origami-attachments-dev`
- 生产：`origami-attachments-prod`

### 这一步你最该关注什么？

不是高级设置，而是两件事：

1. **bucket 确实创建成功了**
2. **你记住了 exact bucket name**

也就是之后要原样填回 `.env` 的这一行：

```txt
R2_BUCKET_NAME=origami-attachments-prod
```

### 你现在应该看到什么？

创建成功后，你通常应该能看到：

- bucket 列表
- 新创建的 bucket 名
- 该 bucket 的详情入口

如果连 bucket 列表里都没看到新名字，说明这一步还没成功。

---

### 第 4 步：创建 R2 API token

接下来在 Cloudflare 后台里找：

- **Manage R2 API tokens**

你通常会看到类似：

- **Create Account API token**
- **Create User API token**

对于个人使用，通常两种都能配出来。最稳妥的思路是：

- 权限给 **Object Read & Write**
- scope 只给你刚才创建的那个 bucket

### 为什么这么配？

因为 Origami 只需要：

- 能往这个 bucket 上传附件
- 能从这个 bucket 读取附件

它不需要更多和别的 bucket 相关的权限。

---

### 第 5 步：保存 Access Key 和 Secret Access Key

创建 token 后，Cloudflare 会显示两样东西：

- **Access Key ID**
- **Secret Access Key**

现在立刻复制并保存。

这些值要分别回填到 `.env`：

```txt
R2_ACCESS_KEY_ID=<Access Key ID>
R2_SECRET_ACCESS_KEY=<Secret Access Key>
```

> 注意：Secret Access Key 往往不会再次完整展示。不要先关页面再回头找。

---

## 现在回到 `.env`，把哪几行填掉？

你现在切回 Origami 项目的 `.env`，把下面几行填好：

```txt
R2_ACCOUNT_ID=1234567890abcdef1234567890abcdef
R2_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxxxx
R2_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
R2_BUCKET_NAME=origami-attachments-prod
R2_ENDPOINT=https://1234567890abcdef1234567890abcdef.r2.cloudflarestorage.com
```

### 这 5 行怎么理解最简单？

- `R2_ACCOUNT_ID`：这个 R2 属于哪个 Cloudflare 账号
- `R2_ACCESS_KEY_ID`：访问 key 的公开部分
- `R2_SECRET_ACCESS_KEY`：访问 key 的私密部分
- `R2_BUCKET_NAME`：我要把附件放到哪个 bucket
- `R2_ENDPOINT`：这个 R2 存储的连接入口

---

## 填完 `.env` 后，立刻做这一轮核对

逐项看：

- `R2_ACCOUNT_ID` 是不是你刚才复制的那个 Account ID？
- `R2_ENDPOINT` 是不是严格等于 `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`？
- `R2_BUCKET_NAME` 是不是你刚创建出来的 bucket 原名？
- `R2_ACCESS_KEY_ID` 和 `R2_SECRET_ACCESS_KEY` 有没有填反？
- token 权限是不是至少有 **Object Read & Write**？
- token 的 scope 是不是包含这个 bucket？

如果这几项都对，R2 通常就没问题了。

---

## 下一步：回到 Origami 里验证上传附件

现在你可以启动 Origami：

```bash
npm run dev
```

然后登录后台，去做这条验证链路：

1. 打开写信 / compose
2. 上传一个小附件
3. 完成整个发送或保存流程
4. 再回到邮件详情试下载附件

### 你现在应该看到什么？

理想情况是：

- 上传时没有报错
- 发送 / 保存过程正常
- 详情页里的附件能被下载

只要上传和下载都正常，这套 R2 配置基本就对了。

---

## 最常见的错误，怎么快速定位？

### 1. `R2_ENDPOINT` 写错

最常见。

正确格式只能是：

```txt
https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

不要漏：

- `https://`
- `.r2.cloudflarestorage.com`

### 2. Access Key / Secret 填反了

也非常常见。

请记住：

- `R2_ACCESS_KEY_ID` 不是 `R2_SECRET_ACCESS_KEY`

### 3. token 没有对象读写权限

如果 token 权限过小，Origami 可能能启动，但附件上传一定会失败。

最小推荐：

- **Object Read & Write**
- scope 到目标 bucket

### 4. bucket 名写错环境

例如：

- token 是 prod bucket 的
- `.env` 却写了 dev bucket 名

结果看起来像“上传失败”，本质其实是 bucket / permission mismatch。

### 5. Account ID 复制错账号

如果你有多个 Cloudflare account，很容易把另一个账号的 Account ID 拿来用。

这样就会出现：

- endpoint 看起来像真的
- key 也像真的
- 但它们其实不属于同一个账号

### 6. 误以为 bucket 必须公开

通常**不需要**。

Origami 是通过服务端处理附件上传和下载的，你不需要把 bucket 公开给整个互联网。

---

## 我推荐你最终怎么配

如果你问我“最稳的配法是什么”，我的建议是：

1. **开发 / 生产分两个 bucket**
2. **token 只给 Object Read & Write**
3. **token 只 scope 到单一 bucket**
4. **`.env` 里保留 `R2_ACCOUNT_ID`**

这套做法很朴素，但最不容易出事。

---

## 下一步看什么？

R2 配好之后，通常继续：

1. [GitHub Auth 详细配置](/github-auth)
2. [Gmail OAuth 详细配置](/gmail-oauth)
3. [Outlook OAuth 详细配置](/outlook-oauth)
