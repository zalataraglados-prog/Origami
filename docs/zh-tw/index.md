---
layout: home

hero:
  name: Origami
  text: 面向個人與單席位團隊的統一收件匣
  tagline: 聚合 Gmail、Outlook 與國內 IMAP/SMTP 信箱，提供適合自託管場景的統一收件、整理、發信與同步能力。
  actions:
    - theme: brand
      text: 快速開始
      link: /zh-tw/quick-start
    - theme: alt
      text: 部署指南
      link: /zh-tw/deployment
    - theme: alt
      text: GitHub
      link: https://github.com/theLucius7/Origami

features:
  - title: 統一收件匣
    details: 把多個信箱整合到同一時間線，降低來回切換帳號的成本。
  - title: 本地優先整理模型
    details: Done、Archive、Snooze 保留在 Origami 本地，Read / Star 可依帳號選擇是否回寫。
  - title: 發信與送件歷史
    details: 可透過 Gmail、Outlook 與 IMAP/SMTP 發信，並保留本地 sent history。
  - title: metadata-first 同步
    details: 首次同步先抓標題、寄件者與摘要，正文與附件在需要時再補抓。
  - title: OAuth app 管理
    details: Gmail 與 Outlook 同時支援環境變數預設 app 與資料庫託管 app。
  - title: 自託管友善
    details: 預設圍繞 Vercel、Turso 與 R2 組織部署路徑，資料流清楚、維運成本可控。
---

## 產品定位

Origami 是一個 **單使用者統一收件匣**。

它不追求完全複製每個信箱服務的所有原生能力，也不想變成複雜的客服平台。它解決的是更明確的問題：

> 用一個介面管理多個信箱帳號，並在自託管前提下完成收件、整理、搜尋、發信與同步。

適合的場景包括：

- 個人多信箱管理
- 獨立開發者、自媒體與自由工作者
- 只有單一操作者的小團隊
- 想保留部署控制權與資料控制權的自託管使用者

## 核心能力

### 信箱接入

- Gmail（OAuth）
- Outlook（OAuth）
- QQ / 163 / 126 / Yeah / 自訂 IMAP/SMTP

### 本地生產力層

Origami 將以下狀態定義為本地狀態：

- Done
- Archive
- Snooze
- Local sent history

這樣做的目標是讓跨 provider 的操作體驗保持一致。

### 選擇性回寫

對於更接近信箱原生狀態的欄位：

- Read
- Star

Origami 支援依帳號開啟回寫。即使 provider 不支援或 scope 不足，本地操作仍可照常完成。

## 建議閱讀順序

如果你的目標是部署一套可直接使用的正式實例，建議按以下順序閱讀：

1. [快速開始](/zh-tw/quick-start)
2. [部署指南](/zh-tw/deployment)
3. [Turso 資料庫詳細配置](/zh-tw/turso)
4. [Cloudflare R2 / Bucket 詳細配置](/zh-tw/r2-storage)
5. [GitHub Auth 詳細配置](/zh-tw/github-auth)
6. [Gmail OAuth 詳細配置](/zh-tw/gmail-oauth)
7. [Outlook OAuth 詳細配置](/zh-tw/outlook-oauth)

## 開發文件

如果你要本地開發、除錯或修改程式碼，請直接查看：

- [開發與除錯](/zh-tw/development)

## 進一步閱讀

- [FAQ](/zh-tw/faq)
- [架構](/zh-tw/architecture)
- [專案結構](/zh-tw/project-structure)
