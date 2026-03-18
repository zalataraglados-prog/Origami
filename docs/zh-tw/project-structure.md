# 專案結構

## 倉庫根目錄

主要結構如下：

- `src/`：應用程式主體
- `docs/`：VitePress 文件站
- `scripts/`：資料庫與基準工具腳本
- `drizzle.config.ts`：Drizzle 設定
- `vercel.json`：Vercel 與 cron 設定

## `src/` 內部結構

- `src/app/`：頁面、layout、route handlers、server actions
- `src/components/`：UI 元件
- `src/lib/`：查詢、provider、services、工具函式
- `src/config/`：環境與 provider 設定
- `src/hooks/`：前端 hooks
- `src/i18n/`：介面語言與訊息字典

## `scripts/` 的用途

- `scripts/db/`：資料庫初始化與推送
- `scripts/bench/`：搜尋與同步相關基準工具

## 文件站結構

- `docs/`：簡體中文預設文件
- `docs/zh-tw/`：繁體中文
- `docs/en/`：英文
- `docs/ja/`：日文
