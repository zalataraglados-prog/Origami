# GitHub Auth 详细配置

这页只讲一件事：**怎么把 Origami 自己的登录配起来**。

它和 Gmail / Outlook 邮箱接入不是一回事：

- **GitHub Auth**：登录 Origami 后台本身
- **Gmail / Outlook OAuth**：把邮箱账号接进 Origami

如果你现在的目标只是：

> “我想先把 Origami 打开，并且能用 GitHub 正常登录进去。”

那就先把这页做完。

---

## 这一步做完后，你应该拿到什么？

你做完 GitHub 这一步之后，最终应该拿到这些值，并填进 `.env`：

```txt
NEXT_PUBLIC_APP_URL=http://localhost:3000
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GITHUB_ALLOWED_LOGIN=your-github-login
AUTH_SECRET=...
```

其中：

- `NEXT_PUBLIC_APP_URL`：你打开 Origami 的地址
- `GITHUB_CLIENT_ID`：GitHub OAuth App 的 Client ID
- `GITHUB_CLIENT_SECRET`：GitHub OAuth App 的 Client Secret
- `GITHUB_ALLOWED_LOGIN`：限制只有某个 GitHub 用户可以登录，**公网部署强烈推荐**
- `AUTH_SECRET`：给登录 session 签名的密钥；不填时会回退到 `ENCRYPTION_KEY`

你可以把这一步理解成：

> 去 GitHub 后台创建一个“允许 Origami 用 GitHub 登录”的应用，然后把 GitHub 给你的两段值抄回 `.env`。

---

## 你现在在哪两个地方来回操作？

这一步你只会在 **两个地方来回切换**：

### 地方 A：GitHub 后台

你会在 GitHub 后台里：

- 创建 OAuth App
- 填 Homepage URL
- 填 Authorization callback URL
- 拿到 Client ID
- 生成 Client Secret

### 地方 B：Origami 项目的 `.env`

你会把刚才拿到的值填回：

```txt
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_ALLOWED_LOGIN=
AUTH_SECRET=
NEXT_PUBLIC_APP_URL=
```

所以你只要记住一件事：

> **GitHub 后台负责“生成值”，`.env` 负责“接收值”。**

---

## 官方参考链接

- GitHub 官方：创建 OAuth App  
  <https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app>

---

## 开始之前，先把这张“抄表”填好

建议你先在便签里写出来，再去点控制台，这样最不容易抄错。

### 本地开发时

```txt
我准备打开的 Origami 地址
http://localhost:3000

GitHub Homepage URL
http://localhost:3000

GitHub Authorization callback URL
http://localhost:3000/api/auth/github/callback

允许登录的 GitHub 用户名
your-github-login
```

### 正式部署时

```txt
我准备打开的 Origami 地址
https://mail.example.com

GitHub Homepage URL
https://mail.example.com

GitHub Authorization callback URL
https://mail.example.com/api/auth/github/callback

允许登录的 GitHub 用户名
your-github-login
```

> 非常推荐：**本地一套 GitHub OAuth App，生产一套 GitHub OAuth App。**

---

## 如果你看到的界面和本文不完全一样

GitHub 后台偶尔会换按钮文案，但你只要抓住下面这些关键词，一般不会迷路：

- `Settings`
- `Developer settings`
- `OAuth Apps`
- `New OAuth App`
- `Register a new application`

如果按钮名字跟本文略有差异，优先看：

- 左侧导航是不是还在 **Developer settings**
- 页面标题是不是还在 **OAuth Apps**

不要被一个按钮翻译的小变化吓住。

---

## 你应该选哪种配置方式？

### 方式 A：只先把本地开发跑起来

如果你现在只是想：

- 本地打开 `http://localhost:3000`
- 先验证 GitHub 登录能通

那就这样配：

```txt
NEXT_PUBLIC_APP_URL=http://localhost:3000
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GITHUB_ALLOWED_LOGIN=your-github-login
```

### 方式 B：本地和生产分开两个 GitHub OAuth App（推荐）

推荐名字：

1. `Origami Local`
2. `Origami Production`

这样好处很大：

- callback URL 不会混
- secret 不会混
- 以后自己回来看也知道哪套值属于哪边

### 方式 C：公网单用户部署

如果你的 Origami 是公网可访问的，建议一定加上：

```txt
GITHUB_ALLOWED_LOGIN=your-github-login
```

这样别人即使先打开你的站点，也不能抢先绑 owner。

---

## 用户点击脚本：从零开始创建 GitHub OAuth App

下面这部分你可以理解成：**照着点就行**。

### 第 1 步：打开 GitHub 的 OAuth App 页面

打开 GitHub 后，按这个顺序点击：

1. 右上角头像
2. **Settings**
3. 左下侧栏里的 **Developer settings**
4. **OAuth Apps**
5. **New OAuth App**

如果你是第一次创建，有时候按钮会写成：

- **Register a new application**

那也是同一个入口，直接点进去即可。

### 你现在应该看到什么？

你应该已经进入一个“创建 OAuth 应用”的表单页面，页面上会看到：

- Application name
- Homepage URL
- Application description
- Authorization callback URL

如果你没看到这些字段，说明还没进对页面。

---

### 第 2 步：填写表单

下面不是解释概念，而是直接告诉你“这一栏填什么”。

#### 1）Application name 填什么？

建议你直接填：

- 本地：`Origami Local`
- 生产：`Origami Production`

#### 2）Homepage URL 填什么？

填你实际打开 Origami 的地址：

- 本地：`http://localhost:3000`
- 生产：`https://mail.example.com`

#### 3）Application description 填什么？

这项随意，可以直接写：

```txt
Single-user inbox app login for Origami
```

不写也通常没问题。

#### 4）Authorization callback URL 填什么？

这是最关键的一栏。

- 本地：`http://localhost:3000/api/auth/github/callback`
- 生产：`https://mail.example.com/api/auth/github/callback`

### 这一栏最容易犯的错

很多人会把 callback URL 写成首页 URL。那是不对的。

正确的是：

```txt
<你的应用地址>/api/auth/github/callback
```

也就是**必须带上 `/api/auth/github/callback`**。

---

### 第 3 步：点注册按钮

确认填写无误后，点击：

- **Register application**

点完之后，你会进入这个 OAuth App 的详情页。

### 你现在应该看到什么？

通常你会看到：

- 应用名称
- Client ID
- 一个用于生成 secret 的按钮

这时 **Client Secret 还没有显示出来**，因为你还没生成。

---

### 第 4 步：生成 Client Secret

在详情页里，点击：

- **Generate a new client secret**

GitHub 会展示一段新的 secret。现在你要立刻保存两样东西：

1. **Client ID**
2. **Client Secret**

它们要分别回填到 `.env`：

```txt
GITHUB_CLIENT_ID=<Client ID>
GITHUB_CLIENT_SECRET=<Client Secret>
```

> 注意：Client Secret 往往只会完整显示一次。请立刻复制走，不要关页面后才想起来。

---

## 现在回到 `.env`，把哪几行填掉？

你现在切回 Origami 项目根目录里的 `.env`，按下面这样填：

```txt
NEXT_PUBLIC_APP_URL=http://localhost:3000
GITHUB_CLIENT_ID=Iv1.xxxxxxxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_ALLOWED_LOGIN=your-github-login
AUTH_SECRET=replace-with-a-random-secret
```

### 这 5 行怎么理解最简单？

- `NEXT_PUBLIC_APP_URL`：我从哪里打开 Origami
- `GITHUB_CLIENT_ID`：GitHub 给我的 app 编号
- `GITHUB_CLIENT_SECRET`：GitHub 给我的 app 密钥
- `GITHUB_ALLOWED_LOGIN`：只允许我自己的 GitHub 用户名登录
- `AUTH_SECRET`：给登录 cookie 签名的随机值

如果你还没有 `AUTH_SECRET`，可以先生成一个：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 填完 `.env` 后，立刻做这一轮核对

不要急着启动，先逐项确认：

- `NEXT_PUBLIC_APP_URL` 和你打算打开的网站地址一致吗？
- GitHub 后台里的 **Homepage URL** 和它一致吗？
- GitHub 后台里的 **Authorization callback URL** 是不是等于 `<APP_URL>/api/auth/github/callback`？
- `GITHUB_ALLOWED_LOGIN` 填的是 GitHub 用户名，不是邮箱，对吗？
- `AUTH_SECRET` 是随机值，不是空的，对吗？

如果这几项都对，GitHub 这块通常就稳了。

---

## 下一步：回到 Origami 里验证登录

现在回到项目目录，执行：

```bash
npm run dev
```

然后打开：

- `http://localhost:3000`

### 你现在应该看到什么？

你应该看到：

- Origami 登录页
- GitHub 登录按钮

点击 GitHub 登录后，应该发生：

1. 浏览器跳到 GitHub 授权页
2. 你确认授权
3. GitHub 把你带回 Origami
4. 第一次安装时进入 `/setup`
5. 完成 setup 后进入首页或 `/accounts`

---

## 首次 owner 绑定到底是什么意思？

第一次成功登录后，Origami 会做这几件事：

1. 检查当前实例是否已经绑定 owner
2. 如果还没有，就把当前 GitHub 用户写入 `app_installation`
3. 然后把你带到 `/setup`
4. 初始化完成后，之后就按这个 owner 账号登录

### 一个非常重要的点

后续校验的核心是：

- **GitHub user id**

不是只看用户名文本。

也就是说：

- 改 GitHub login 名通常**不会**把你锁在外面
- 换另一个 GitHub 账号就不行

---

## 最常见的错误，怎么快速定位？

### 1. 点 GitHub 登录后，直接 callback error

先查下面 4 项：

- `NEXT_PUBLIC_APP_URL` 对吗？
- GitHub 后台的 **Homepage URL** 对吗？
- **Authorization callback URL** 是不是精确到 `/api/auth/github/callback`？
- 你是不是把本地 Client ID / Secret 填到生产里了？

### 2. 登录页能打开，但怎么都进不去

先看：

```txt
GITHUB_ALLOWED_LOGIN=
```

如果你设置了它，那只有那个 GitHub login 能通过。  
这通常不是 bug，而是安全限制生效了。

### 3. 我明明是 owner，却还是进不去

检查你现在登录的是不是**当初第一次绑定 owner 的那个 GitHub 账号**。

### 4. 我第一次绑错人了怎么办？

通常需要清理数据库里的 `app_installation` 记录，然后重新初始化。

不确定就先备份数据库，再动。

### 5. 我看起来都填对了，但还是不行

把下面三行单独拿出来，一字一字对：

```txt
NEXT_PUBLIC_APP_URL=...
Homepage URL=...
Authorization callback URL=...
```

真正正确的 callback 只能是：

```txt
<APP_URL>/api/auth/github/callback
```

很多时候不是“逻辑错了”，只是 path 少了一段。

---

## 我推荐你最终怎么配

如果你问我“最稳的配法是什么”，我的建议是：

1. **本地一个 GitHub OAuth App**
2. **生产一个 GitHub OAuth App**
3. **公网部署一定设置 `GITHUB_ALLOWED_LOGIN`**
4. **额外设置 `AUTH_SECRET`，不要长期复用 `ENCRYPTION_KEY` 做 session 签名**

这是最不容易绕晕自己的一套。

---

## 下一步看什么？

GitHub 登录配好之后，通常继续：

1. [Cloudflare R2 / Bucket 详细配置](/r2-storage)
2. [Gmail OAuth 详细配置](/gmail-oauth)
3. [Outlook OAuth 详细配置](/outlook-oauth)
