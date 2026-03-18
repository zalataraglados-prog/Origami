# FAQ

## 為什麼預設推薦 `db:setup`，不是 `db:migrate`？

因為 `db:setup` 更適合 **新環境**。它代表「我要直接建立目前 schema」，而不是先重播整段歷史演進。

## 為什麼 Origami 不把 Done / Archive / Snooze 回寫到 provider？

因為這些狀態在不同 provider 之間語義差異很大。把它們保留為本地狀態，可以換來更一致的 UI 與更穩定的同步邏輯。

## 為什麼 Read / Star 又支援回寫？

因為它們更接近信箱原生狀態，而且同步價值更高。所以 Origami 把它們設計成可選能力：能回寫就回寫，不能回寫也不阻塞本地操作。

## 為什麼有些郵件同步後會從 Inbox 消失？

通常不是本地遺失資料，而是遠端狀態終於對齊了。如果遠端郵件已被刪除，或被移出 Inbox，Origami 會在下一輪同步把它從預設 Inbox 列表中移除。

## 如果我只想最小部署，應該看哪幾頁？

建議按這個順序：

1. [首頁](/zh-tw/)
2. [快速開始](/zh-tw/quick-start)
3. [部署指南](/zh-tw/deployment)
