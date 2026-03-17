# Turso データベース詳細設定

このページは **Origami 用の Turso データベースをどう用意するか** だけを説明します。

今の目標が：

> 「まだデータベースがない。まず無料枠で試して、`.env` を埋めて、Origami がちゃんと接続できるようにしたい」

なら、このページをそのまま進めてください。

---

## まず結論：最終的に何が必要？

最終的には、次の 2 つを `.env` に入れます。

```txt
TURSO_DATABASE_URL=libsql://your-db-name-xxx.turso.io
TURSO_AUTH_TOKEN=...
```

この 2 つが正しければ、Origami は Turso に接続できます。

---

## 公式リンク

- Turso Quickstart  
  <https://docs.turso.tech/quickstart>
- Turso CLI インストール  
  <https://docs.turso.tech/cli/installation>
- Turso データベース token 作成  
  <https://docs.turso.tech/cli/db/tokens/create>
- Turso Pricing  
  <https://turso.tech/pricing>

---

## まず一番シンプルな理解

Origami が Turso に本当に必要としているものは、実は 2 つだけです。

1. **データベース URL**（`TURSO_DATABASE_URL`）
2. **データベース token**（`TURSO_AUTH_TOKEN`）

イメージとしては：

- URL = 「どのデータベースに接続するか」
- token = 「そのデータベースに接続する権限があるか」

です。

---

## 無料枠について先に一言

Origami をまず試したい、ローカル開発したい、設定を確認したい、という段階なら、通常は Turso の現在の **Free** プランから始めて大丈夫です。

ただしプラン内容は変わることがあるので、最終的には公式 Pricing を見てください。

- <https://turso.tech/pricing>

実用的な考え方としては：

- **まず無料枠で Origami を動かす**
- 本番で必要になったら有料プランを考える

で十分です。

---

## 始める前に、先にメモしておくと楽な値

### ローカル / テスト環境

```txt
データベース名
origami-dev

用途
ローカル開発 / テスト

入れる予定の変数
TURSO_DATABASE_URL=...
TURSO_AUTH_TOKEN=...
```

### 本番環境

```txt
データベース名
origami-prod

用途
本番運用

入れる予定の変数
TURSO_DATABASE_URL=...
TURSO_AUTH_TOKEN=...
```

> 強くおすすめ: development 用と production 用でデータベースは分ける。

---

## このページが「完全に Web 画面だけ」ではない理由

Turso のダッシュボード UI は変わることがありますが、**CLI で URL と token を取る手順** は比較的安定しています。

そのため、一番安全なルートは次です。

1. **Web で登録 / ログイン / DB 作成**
2. **CLI で DB URL と token を取得**
3. **`.env` に入れる**

普通のユーザーにとっても、この方が再現しやすいです。

---

## もし画面がこのページと少し違って見えても

Turso の UI やドキュメントも変わることがありますが、次のキーワードが見つかれば方向は合っています。

- `Create database`
- `Database name`
- `Groups` または `Location`
- `Connect`
- `Tokens`
- `libsql`

ボタン名が少し違っても、まずは落ち着いてページ見出しとキーワードを探してください。

---

## ベビーステップ: Turso データベースをゼロから用意する

### Step 1: Turso を開いてログインする

開く：

- <https://turso.tech/>

そのあと Turso アカウントに登録 / ログインします。

初回であれば通常は：

1. アカウント登録
2. Turso ダッシュボードへ入る
3. 必要なら organization / workspace 作成

という流れになります。

個人利用なら、最初はデフォルトの組織で十分です。

---

### Step 2: まず無料枠で始めると決める

今が：

- Origami の動作確認
- ローカル開発
- 設定の試行

なら、まず **Free** で始めるのが普通です。

公式 Pricing：

- <https://turso.tech/pricing>

おすすめは：

- **最初から課金を悩まない**
- 先にデータベースを作って、Origami を動かす

ことです。

---

### Step 3: Web ダッシュボードでデータベースを作る

Turso のダッシュボードで探すのは：

- **Create database**

です。

#### Database name はどう付ける？

環境が分かる名前がおすすめです。

- `origami-dev`
- `origami-prod`

#### Location / Group はどう選ぶ？

通常は、あとでアプリを置く場所に比較的近いリージョンを選びます。

ただし、今がローカルテストだけなら深く悩まなくて大丈夫です。デフォルト推奨リージョンでも問題ないことが多いです。

### このステップで一番大事なのは高度な最適化ではありません

大事なのは次の 2 点です。

1. **データベースがちゃんと作成されること**
2. **作成した database name を覚えておくこと**

例えば：

```txt
origami-dev
```

---

### Step 4: Turso CLI をインストールする

公式インストール説明：

- <https://docs.turso.tech/cli/installation>

よく使う方法：

#### macOS

```bash
brew install tursodatabase/tap/turso
```

#### Linux

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

#### Windows

現在の公式案内では WSL 経由です。詳細は公式インストールページを見てください。

インストール後、新しい shell を開いて次を実行します。

```bash
turso
```

ヘルプが出れば CLI は入っています。

---

### Step 5: CLI を Turso アカウントにログインさせる

実行：

```bash
turso auth login
```

通常はブラウザが開いて、CLI の認証を許可します。

これが終わると、CLI でデータベース情報取得や token 作成ができるようになります。

---

### Step 6: データベース URL を取る

データベース名が：

```bash
origami-dev
```

なら、次を実行します。

```bash
turso db show origami-dev --url
```

すると、次のような値が出ます。

```txt
libsql://origami-dev-xxxxx.turso.io
```

これを `.env` に入れます。

```txt
TURSO_DATABASE_URL=libsql://origami-dev-xxxxx.turso.io
```

### ここで大事なポイント

Origami が必要としているのは：

- **本物の `libsql://...` URL**

です。

自分で雰囲気で手入力した URL ではなく、`turso db show <db-name> --url` の結果をそのまま使うのが一番安全です。

---

### Step 7: データベース token を作る

公式コマンド説明：

- <https://docs.turso.tech/cli/db/tokens/create>

実行：

```bash
turso db tokens create origami-dev
```

すると token が出ます。

それを次に入れます。

```txt
TURSO_AUTH_TOKEN=...
```

### token についての実用的な考え方

今の目的が「Origami を正常に接続させること」なら：

- まず普通に使える token を 1 つ作る

で十分です。

期限や権限の細かい運用は、あとで必要になってから考えて問題ありません。

---

## 最小 `.env` 例

```txt
TURSO_DATABASE_URL=libsql://origami-dev-xxxxx.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOi...
```

本番なら dev の代わりに本番 DB の値を入れます。

---

## 設定後は、この順番で確認すると早い

1 項目ずつ確認してください。

- Turso 側でデータベース作成は成功しているか
- `TURSO_DATABASE_URL` は `turso db show <db-name> --url` から取ったものか
- `TURSO_AUTH_TOKEN` は `turso db tokens create <db-name>` から取ったものか
- dev / prod の値を取り違えていないか
- `.env` に余計なスペース、引用符、改行が入っていないか

ここが合っていれば、Turso 側はかなり大丈夫です。

---

## 本当に設定できたか、どう確認する？

一番直接的なのは次です。

1. `TURSO_DATABASE_URL` と `TURSO_AUTH_TOKEN` を `.env` に入れる
2. Origami のプロジェクトディレクトリで実行：

```bash
npm run db:setup
```

データベース接続が正しければ、これが通るはずです。

そのあと：

```bash
npm run dev
```

で Origami が起動し、ログイン / setup に進めるなら、少なくともデータベース設定は通っています。

---

## よくある問題を早く見抜くには

### 1. データベース URL が間違っている

一番多いです。

確認すること：

- `libsql://` で始まっているか
- `turso db show <db-name> --url` から取った値か
- 記憶で手打ちしていないか

### 2. token が別のデータベース用

複数の DB があると、token を取り違えやすいです。

なので token を作る時は必ず DB 名を明示して：

```bash
turso db tokens create origami-dev
```

のように実行するのがおすすめです。

### 3. dev と prod が混ざっている

例えば：

- `TURSO_DATABASE_URL` は `origami-dev`
- でも自分では本番設定のつもり

というケースです。

おすすめは単純で：

- 開発 DB = `origami-dev`
- 本番 DB = `origami-prod`

と名前を分けることです。

### 4. CLI がログインできていない

`turso db show ...` や `turso db tokens create ...` で認証エラーが出るなら、まず：

```bash
turso auth login
```

をやり直してください。

### 5. Web で DB だけ作って token を取っていない

DB を作るだけでは足りません。Origami が必要なのは：

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`

の両方です。

---

## 実運用でのおすすめ

一番安全なのは：

1. **Web ダッシュボードで DB を作る**
2. **CLI で URL を取る**
3. **CLI で token を作る**
4. **development / production の DB を分ける**
5. **まず無料枠で Origami を動かしてから、必要ならプランを考える**

これが一番素直で、普通のユーザーにも再現しやすいです。

---

## 次に読むページ

データベースが用意できたら、次はこの順番がおすすめです。

1. [Cloudflare R2 / bucket 詳細設定](/ja/r2-storage)
2. [GitHub Auth 詳細設定](/ja/github-auth)
3. [Gmail OAuth 詳細設定](/ja/gmail-oauth)
4. [Outlook OAuth 詳細設定](/ja/outlook-oauth)
