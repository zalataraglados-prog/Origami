# Cloudflare R2 / Bucket 詳細設定

このページでは **本番環境の Origami 用添付ストレージを Cloudflare R2 で設定する方法** を扱います。

Origami は添付ファイルを DB ではなく Cloudflare R2 に保存します。添付は大きなバイナリオブジェクトだからです。

## このページで最終的に揃うもの

このページを終えるころには、次を確認できるはずです。

- 正しい Cloudflare Account ID
- 作成済み R2 bucket
- その bucket にアクセスできる R2 API key
- `.env` に入れる完全な `R2_*` 設定

## 最終的に `.env` に入れる値

```txt
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=origami-attachments-prod
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

## 公式リファレンス

- R2 bucket の作成  
  <https://developers.cloudflare.com/r2/buckets/create-buckets/>
- R2 API token / S3 認証  
  <https://developers.cloudflare.com/r2/api/tokens/>
- Cloudflare Account ID の確認  
  <https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/>

## 先にメモしておく値

```txt
Cloudflare Account ID = ...
Bucket name = origami-attachments-prod
R2 endpoint = https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

## 行き来する場所

### 場所 A: Cloudflare Dashboard

ここで行うこと：

- Account ID の確認
- bucket 作成
- R2 API token 作成
- Access Key ID / Secret Access Key の取得

### 場所 B: Origami の `.env`

ここに値を戻します：

```txt
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_ENDPOINT=
```

## クリック手順

### 1. Cloudflare Dashboard を開く

- <https://dash.cloudflare.com/>

ログイン後、必ず対象の Cloudflare account に切り替えてください。

複数 account がある場合の典型的な事故は、次を混ぜることです。

- A account の Account ID
- B account の key
- C account の bucket

### 2. Account ID を確認する

- **Account ID**

これを控えて、次のように整理します。

```txt
R2_ACCOUNT_ID=<your Account ID>
R2_ENDPOINT=https://<your Account ID>.r2.cloudflarestorage.com
```

### 3. R2 を開いて bucket を作成する

- **R2 Object Storage**

bucket 名は次を推奨します。

```txt
origami-attachments-prod
```

重要なのは：

1. bucket が作成されたこと
2. 正確な bucket 名を控えること
3. その bucket が今の account 配下にあること

### 4. R2 API token を作成する

- **Manage R2 API tokens**

Origami 用の最小推奨権限：

- **Object Read & Write**

scope は対象 bucket のみに絞るのが無難です。

### 5. Access Key と Secret Access Key を保存する

Cloudflare が表示する 2 つの値をすぐにコピーします。

- **Access Key ID**
- **Secret Access Key**

> Secret Access Key は作成時に控えるのが一番楽です。失くしたら新しい key を作り直す方が早いことが多いです。

## `.env` に戻って記入する

```txt
R2_ACCOUNT_ID=1234567890abcdef1234567890abcdef
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=origami-attachments-prod
R2_ENDPOINT=https://1234567890abcdef1234567890abcdef.r2.cloudflarestorage.com
```

## テスト前の確認

- `R2_ACCOUNT_ID` はコピーした Account ID か
- `R2_ENDPOINT` は `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` と一致しているか
- `R2_BUCKET_NAME` は作成した bucket 名と完全一致しているか
- access key と secret を入れ替えていないか
- token に **Object Read & Write** があるか
- token scope に対象 bucket が含まれているか
- すべて同じ Cloudflare account 由来か

## 動作確認方法

デプロイ後、Origami 内で次の流れを試します。

1. compose を開く
2. 小さな添付ファイルをアップロードする
3. 送信または保存を完了する
4. メール詳細で添付をダウンロードする

期待する結果：

- アップロード成功
- 送信または保存成功
- ダウンロード成功

より確実に見るなら、次も試すと安心です。

1. 新しい添付のアップロードで書き込みを確認する
2. 既存添付のダウンロードで読み取りを確認する

## よくあるエラー

### 1. `R2_ENDPOINT` が間違っている

正しい形式は次だけです。

```txt
https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

### 2. Access Key と Secret を入れ替えた

次を確認してください。

- `R2_ACCESS_KEY_ID` は `R2_SECRET_ACCESS_KEY` ではない

### 3. token にオブジェクト読書き権限がない

権限が足りないと、添付アップロードは失敗しやすいです。

### 4. bucket 名が違う

`.env` の `R2_BUCKET_NAME` と Cloudflare 上の bucket 名が完全一致しているか確認してください。

### 5. 別 account の Account ID を使っている

複数 account がある場合によく起きる不整合です。

### 6. アップロードは通るのにダウンロードが失敗する

bucket 全体が壊れているのではなく、設定のどこかがずれているケースが多いです。次を再確認してください。

- `R2_ENDPOINT`
- `R2_BUCKET_NAME`
- 実際にデプロイで読み込まれている環境変数

## 一言での合格ライン

Origami で添付をアップロードでき、送信または保存でき、その後同じ添付をダウンロードできれば、この設定はほぼ完了です。
