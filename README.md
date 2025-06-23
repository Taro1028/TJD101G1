```markdown
![TJD101 logo](/src/assets/images/Logo_S.svg)

# 🥗 TibaEAT 客製化餐食服務平台

> 結合客製化營養餐食與溫暖送餐關懷的高齡照護平台，專為高齡者與照顧者打造的安心飲食服務。

## 🌟 專案緣起
臺灣已邁入高齡化社會，為了減輕照顧者壓力並照顧長輩健康，我們打造一個結合「客製化餐食」與「溫暖關懷」的服務平台。平台透過專業營養設計與貼心送餐服務，讓長輩吃得安心，感受到被記掛的溫度，也讓照顧者更加放心。在後疫情時代，期待以科技承載關心，實踐三方共好的社會價值。

## 💻 系統功能
- 會員基本資料管理
- 客製化餐點訂購
- 會員訂購紀錄
- 留言小卡客製化互動
- 小卡及收件者管理
- 訂單與金額統計
- 後台管理員系統
- 前端訂餐界面
- 第三方快速登入（LINE Login、Google Login）
- 第三方結帳 (綠界)

## 🛠 技術架構
- 前端：HTML / CSS / JavaScript / Vue.js / Vite / Vue Router
- 後端：PHP
- 資料存取：JSON 與 MySQL
- 程式環境與工具：SCSS / Pinia / Github / Workbench
- 版控：Git
- 套件應用： Swiper / Bootstrap / Flatpickr /  Leaflet
- 開發工具：Figma / VS Code / Node.js / XAMPP

## 📂 資料結構
```bash
TJD101/
├── public/                # 靜態公開資源與 PHP 後端
│   ├── php/               # PHP 後端 API (包含 connection.php)
│   ├── images/            # 圖片資源
│   └── .htaccess          # Apache 伺服器設定
├── src/                   # 前端 Vue 原始碼
│   ├── assets/            # 靜態資源（圖片、樣式等）
│   ├── components/        # Vue元件模組
│   ├── data/              # JSON 資料來源
│   ├── layouts/           # 前台與後台的版型
│   ├── pages/             # Vue 頁面（含 admin 後台）
│   ├── router/            # Vue Router 設定檔
│   ├── stores/            # Pinia 狀態管理檔案
│   ├── utils/             # 工具函式
│   └── Main.vue           # 主入口元件
├── .env.production        # 生產環境變數
├── .env.development       # 開發環境變數
├── index.html             # 專案進入點
├── vite.config.js         # Vite 設定檔
└── package.json           # 套件與專案設定
```

## 🚀 快速開始
```bash
# 安裝依賴
npm install

# 開發環境啟動
npm run dev

# 打包正式版
npm run build
```

## 🤝 團隊成員
- 辛浩維
- 邱芋菱
- 林宜慶
- 吳珮甄

## 🔗 專案展示
👉 [Demo 展示連結](https://tibamef2e.com/tjd101/g1/)

## 📜 License
本專案僅供學術研究與作品展示使用，禁止未授權商業用途。