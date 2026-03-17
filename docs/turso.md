# Turso 数据库详细配置

这页只讲一件事：**怎么给 Origami 准备一个能直接用的 Turso 数据库**。

如果你现在的目标是：

> “我还没有数据库，想先白嫖试起来，然后把 `.env` 填好，让 Origami 能连上库。”

那就按这页做。

---

## 先说结论：你最终要得到什么？

你最终要把这两个值放进 `.env`：

```txt
TURSO_DATABASE_URL=libsql://your-db-name-xxx.turso.io
TURSO_AUTH_TOKEN=...
```

只要这两个值是对的，Origami 就能连到 Turso。

---

## 官方参考链接

- Turso Quickstart  
  <https://docs.turso.tech/quickstart>
- Turso CLI 安装  
  <https://docs.turso.tech/cli/installation>
- Turso 数据库 token 创建  
  <https://docs.turso.tech/cli/db/tokens/create>
- Turso Pricing  
  <https://turso.tech/pricing>

---

## 先用一句人话理解这件事

对 Origami 来说，Turso 这块你真正需要带回来的就两样东西：

1. **数据库地址**（`TURSO_DATABASE_URL`）
2. **数据库访问 token**（`TURSO_AUTH_TOKEN`）

你可以把它理解成：

- URL = “我要连哪一个库”
- token = “我有没有权限连进去”

---

## 关于“白嫖”这件事，先讲清楚

如果你只是先试项目、先本地跑起来，通常可以先用 Turso 当前的 **Free** 套餐 / 免费额度。  
但套餐内容以后可能变，**请以官方 Pricing 页面为准**：

- <https://turso.tech/pricing>

我的建议很简单：

- **先按免费额度跑通 Origami**
- 真要上生产，再评估是否需要升级

---

## 开始之前，先抄一张表

建议你先把下面这些值写在便签里：

### 本地 / 测试环境

```txt
数据库名
origami-dev

用途
本地开发 / 测试

计划填入的变量
TURSO_DATABASE_URL=...
TURSO_AUTH_TOKEN=...
```

### 生产环境

```txt
数据库名
origami-prod

用途
正式环境

计划填入的变量
TURSO_DATABASE_URL=...
TURSO_AUTH_TOKEN=...
```

> 很推荐：**开发环境一个库，生产环境一个库。** 不要混用。

---

## 这页为什么不是“纯网页到底”？

因为 Turso 的后台 UI 可能会调整，而 **CLI 获取 URL 和 token** 这条路径通常更稳定、更容易复现。

所以我推荐的最稳路线是：

1. **网页上注册 / 登录 / 创建数据库**
2. **CLI 拿数据库 URL 和 token**
3. **填进 `.env`**

这样对普通用户反而更稳，不容易卡在后台某个按钮换名字。

---

## 如果你看到的界面和本文不完全一样

Turso 后台和文档也可能会改版，但你只要抓住这些关键词，一般不会迷路：

- `Create database`
- `Database name`
- `Groups` 或 `Location`
- `Connect`
- `Tokens`
- `libsql`

如果网页里的按钮名和本文略有差异，不要先怀疑自己走错了，很多时候只是 UI 更新了。

---

## 宝宝式步骤：从零开始准备 Turso 数据库

### 第 1 步：打开 Turso 官网并登录

打开：

- <https://turso.tech/>

然后注册 / 登录你的 Turso 账号。

如果你是第一次进入，通常会经历：

1. 注册账号
2. 进入 Turso 控制台
3. 如果系统要求你创建 organization / workspace，就按默认流程完成

如果你只是个人使用，先用默认组织就够了，不需要一开始就折腾复杂结构。

---

### 第 2 步：确认你先用免费额度

如果你现在只是：

- 本地开发
- 测试 Origami
- 自己先验证整套配置

那通常先按 **Free** 用就行。

官方 pricing：

- <https://turso.tech/pricing>

我的建议：

- **先别为了跑 demo 就急着绑卡或上高档套餐**
- 先把数据库建出来、把项目跑通

---

### 第 3 步：在网页控制台创建数据库

进入 Turso 控制台后，找：

- **Create database**

然后按下面思路填。

#### Database name 怎么起？

建议一眼能看懂环境：

- `origami-dev`
- `origami-prod`

#### Location / Group 怎么选？

通常选离你的部署环境更近的区域。

如果你现在只是本地测试，不需要为此想太多，先选一个默认推荐区域也可以。

如果你准备部署到 Vercel，通常建议：

- 尽量选一个和应用运行区域相对接近的 Turso 区域

### 这一步最重要的不是“选最完美的区域”

而是：

1. **数据库真的创建成功**
2. **你记住数据库名**

例如：

```txt
origami-dev
```

---

### 第 4 步：安装 Turso CLI

官方安装说明：

- <https://docs.turso.tech/cli/installation>

常见方式：

#### macOS

```bash
brew install tursodatabase/tap/turso
```

#### Linux

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

#### Windows

官方当前建议是通过 WSL 安装，细节以官方安装页为准。

安装完成后，开一个新 shell，执行：

```bash
turso
```

如果能看到命令帮助，说明 CLI 装好了。

---

### 第 5 步：让 CLI 登录你的 Turso 账号

执行：

```bash
turso auth login
```

它通常会打开浏览器，让你完成登录授权。

如果你还没有账号，也可以按官方 quickstart 里那种方式走 signup / login 流程。

登录成功后，CLI 就能代表你去取数据库信息和生成 token。

---

### 第 6 步：拿到数据库 URL

假设你的数据库名是：

```bash
origami-dev
```

执行：

```bash
turso db show origami-dev --url
```

你会得到一个类似这样的值：

```txt
libsql://origami-dev-xxxxx.turso.io
```

这就是你要填进 `.env` 的：

```txt
TURSO_DATABASE_URL=libsql://origami-dev-xxxxx.turso.io
```

### 这里非常重要

Origami 需要的是：

- **`libsql://...` 这种数据库 URL**

不是你随便拼出来的域名。

最稳的做法就是直接用 `turso db show <db-name> --url` 输出的结果。

---

### 第 7 步：创建数据库 token

官方命令文档：

- <https://docs.turso.tech/cli/db/tokens/create>

执行：

```bash
turso db tokens create origami-dev
```

它会输出一个 token。

把它填进：

```txt
TURSO_AUTH_TOKEN=...
```

### 关于 token，我的建议很直接

如果你现在只是让 Origami 正常连库：

- 先创建一个默认可用 token 就够了

等以后你更在意权限、过期时间、分环境策略，再去折腾更细粒度的 token 管理。

---

## 最小可用 `.env` 示例

```txt
TURSO_DATABASE_URL=libsql://origami-dev-xxxxx.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOi...
```

如果你是正式环境，就把 dev 替换成 prod 那套值。

---

## 配完之后，请按这个顺序核对

一项一项对照：

- 数据库是不是已经在 Turso 控制台创建成功了？
- `TURSO_DATABASE_URL` 是不是直接来自 `turso db show <db-name> --url`？
- `TURSO_AUTH_TOKEN` 是不是直接来自 `turso db tokens create <db-name>`？
- 你有没有把 dev 环境的 URL / token 误填进生产？
- `.env` 里有没有多复制空格、引号或换行？

只要这几项都对，Turso 这部分通常就没问题了。

---

## 现在如何验证“真的配置好了”？

最直接的验证方式：

1. 把 `TURSO_DATABASE_URL` 和 `TURSO_AUTH_TOKEN` 填进 `.env`
2. 在 Origami 项目目录执行：

```bash
npm run db:setup
```

如果数据库连接没问题，这一步应该能正常完成。

然后你再执行：

```bash
npm run dev
```

能正常启动并继续登录 / setup，说明数据库至少已经通了。

---

## 最常见的错误，怎么一眼判断？

### 1. 数据库 URL 写错了

最常见。

请确认：

- 你填的是 `libsql://...`
- 它来自 `turso db show <db-name> --url`
- 不是自己手敲猜出来的地址

### 2. token 不是这个数据库的 token

如果你有多个数据库，很容易把 token 拿错。

所以推荐你生成 token 时，明确写数据库名，例如：

```bash
turso db tokens create origami-dev
```

### 3. dev / prod 混用了

例如：

- `TURSO_DATABASE_URL` 指向 `origami-dev`
- 但你以为自己在配生产

或者反过来。

我的建议就是：

- 开发库叫 `origami-dev`
- 生产库叫 `origami-prod`

不要搞含糊命名。

### 4. CLI 没登录成功

如果 `turso db show ...` 或 `turso db tokens create ...` 报认证错误，先回去执行：

```bash
turso auth login
```

确保 CLI 真的已经登录。

### 5. 你只在网页里建了库，但没拿 token

只创建数据库还不够。Origami 连接数据库还需要：

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`

少一个都不行。

---

## 我推荐的最终做法

如果你问我“最稳的 Turso 配法是什么”，我的建议是：

1. **网页里创建数据库**
2. **CLI 里取 URL**
3. **CLI 里生成 token**
4. **开发 / 生产分开两个数据库**
5. **先按免费额度把项目跑通，再考虑升级套餐**

这是对普通用户最稳、最不绕、也最容易排错的一条路。

---

## 下一步看什么？

数据库准备好后，推荐按这个顺序继续：

1. [Cloudflare R2 / Bucket 详细配置](/r2-storage)
2. [GitHub Auth 详细配置](/github-auth)
3. [Gmail OAuth 详细配置](/gmail-oauth)
4. [Outlook OAuth 详细配置](/outlook-oauth)
