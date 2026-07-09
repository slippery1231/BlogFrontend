# blog-frontend

部落格前端專案，架構對齊 `template-project-frontend`：Vue 3 + TypeScript + Quasar + Tailwind CSS + Pinia + vue-i18n + Axios。

## 技術棧

| 分類 | 使用技術 |
| --- | --- |
| 框架 | Vue 3 (`<script setup>`) + TypeScript |
| UI | Quasar 2 + Tailwind CSS v4（並用；Tailwind 停用 preflight 以避免覆蓋 Quasar） |
| 狀態管理 | Pinia |
| 多語系 | vue-i18n（`zh-TW` / `en-US`） |
| HTTP | Axios（統一封裝於 `src/services/axiosService.ts`） |
| 路由 | Vue Router（模組化，`src/router/*.routes.ts`） |
| 日期 | dayjs |
| 測試 | Vitest + happy-dom |
| Lint / Format | ESLint + oxlint + oxfmt |
| 部署 | Vercel（靜態站點，SPA 路由由 `vercel.json` rewrite 處理） |

## 目錄結構

```
src/
├─ assets/scss/        # Quasar 變數與全域樣式
├─ assets/tailwind.css # Tailwind 進入點（僅 theme + utilities）
├─ boot/               # 初始化外掛（i18n）
├─ composables/        # 可重用邏輯（useLogger / useNotify / useLoading / useDialog / useDateTimeFormatter）
├─ i18n/               # 多語系字典（zh-TW、en-US）
├─ layouts/            # 版型（MainLayout）
├─ pages/<Feature>/    # 功能頁面，內含 components / composables / types.ts
│  └─ Posts/           # 文章功能
├─ plugins/            # Quasar 外掛註冊
├─ router/             # 模組化路由（index / routes / *.routes.ts）
├─ services/<domain>/  # API 服務層（axiosService + post/postService）
├─ stores/             # Pinia store
└─ test/               # Vitest 測試
```

## 開發指令

```bash
npm install         # 安裝依賴
npm run dev         # 啟動開發伺服器
npm run build       # 型別檢查 + 建構
npm run type-check  # vue-tsc 型別檢查
npm run lint        # oxlint + eslint 自動修復
npm run format      # oxfmt 格式化
npm run test        # Vitest
```

## 環境變數

於 `.env.development`（或對應環境檔）設定：

| 變數 | 說明 |
| --- | --- |
| `VITE_API_URL` | 後端 API 網域，例如 `http://localhost:5104` |
| `VITE_LOG_LEVEL` | 有值時 axios logger 使用 `info`，否則 `warn` |

## 部署

部署於 Vercel：push 後由 Vercel 自動執行 `vite build` 並提供 `dist` 靜態檔案，SPA 路由重整由 `vercel.json` 的 rewrite 規則處理。
