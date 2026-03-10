# 軟體需求規格 (Software Requirements Specification - SRS)

## 專案名稱：My Training Plan (客製化間歇訓練播放器)

---

## 1. 簡介 (Introduction)

### 1.1 目的 (Purpose)
本文件旨在定義「My Training Plan (訓練計畫)」之軟體需求規格。本系統主要目的是提供使用者客製化訓練計畫，並能整合 YouTube 影片或本地端實體影片檔案作為訓練示範或背景音樂的網頁應用程式。

### 1.2 產品範圍 (Product Scope)
「My Training Plan」是一個前後台分離架構 (Client-Server) 的網頁應用程式。前端基於 React + TypeScript 開發 (SPA)，後端基於 .NET Core Web API 搭配 SQLite。
系統允許使用者：
- 建立並編輯自訂的訓練計畫（包含多個訓練階段）。
- 每個階段可以設定外部 YouTube 影片連結，可指定播放起訖秒數。
- 設定各階段的訓練時間與休息時間。
- 在播放器介面中執行訓練計畫，系統將自動倒數計時、切換指定影片片段。
- 系統的所有設定與訓練計畫會暫存於瀏覽器本地端 (Local Storage)。

---

## 2. 整體描述 (Overall Description)

### 2.1 產品視角 (Product Perspective) & 架構設計
本產品是一個前後台分離 (Client-Server) 架構的 Web 應用程式。
1. **前端 (Client)**：使用 React 技術建立單頁應用程式 (SPA)，負責所有的 UI 展示、YouTube 影片播放 (YouTube IFrame API) 及倒數邏輯。
2. **後端 (Server)**：使用 .NET Core Web API 開發，採三層式架構設計與 Autofac 實現依賴注入 (DI) 以保持高度彈性。程式直接透過 Kestrel 伺服器於本地端獨立運行，無需依賴 IIS 架設。
3. **資料庫 (Database)**：目前為實驗階段，選擇使用 SQLite。SQLite 可以直接將資料記錄在本地端的檔案中，未來有需要時由於三層式架構的切分，也可輕鬆抽換成 SQL Server 或其他資料庫。所有的狀態與資料（如專案 ID、訓練階段細節、YouTube URL）皆儲存於此資料庫中。

這套彈性架構允許系統突破純瀏覽器的儲存限制，實現真正的本地端資料中心化管理，並且開發與部署極輕量化 (不依賴重量級 IIS 或 SQL Server 服務)。

為防範著作權爭議與法律問題：
- **第一版限制 (V1)**：第一版系統中，影片來源**強制限定為外部公開的 YouTube URL 網址**。
- **免責說明**：系統僅儲存與記錄 YouTube 網址，並透過官方 IFrame API 嵌入播放功能，不牽涉任何實體影片檔的上傳、下載或複製，所有的版權與流量由來源平台管理。

### 2.2 產品功能摘要 (Product Functions)
1. **首頁儀表板管理**：提供進入點，讓使用者檢視目前的訓練專案（目前以單一主要專案實作），並進入設定頁面。
2. **訓練菜單配置 (CRUD)**：使用者能新增、編輯、刪除及排序訓練階段 (Stages)。
3. **特定影片片段設定**：能截取 YouTube 影片特定區段以配合該訓練動作。
4. **全域休息影片設定**：可設定一段 YouTube 影片專供休息時間隨機截段播放。
5. **沉浸式播放器**：全螢幕支援、超大倒數計時器、視覺化時間軸進度。
6. **智慧語音助理 (TTS)**：在階段轉換及倒數 3 秒時，用語音提示接下來的動作與倒數數字。

### 2.3 執行環境 (Operating Environment)
- **客戶端**：支援現代主流的網頁瀏覽器 (Chrome, Firefox, Safari, Edge 等)，且需要瀏覽器支援 `window.speechSynthesis` (Web Speech API) 及允許執行 JavaScript。
- **網路需求**：執行播放功能時需要連接網際網路，以載入 YouTube 影片內容。

---

## 3. 系統功能需求 (System Features)

### 3.1 首頁 (Home Dashboard)
- **描述**：應用的初始畫面，顯示使用者的歡迎訊息與專案總覽。
- **功能列表**：
    - 提供進入「建立新計畫」或進入「計畫設定頁」的按鈕或虛擬卡片。
    - 具備基本的導覽列 (Dashboard, My Projects 等 UI 視覺元件)。

### 3.2 計畫設定頁 (Practice Configuration)
- **描述**：讓使用者詳細規劃訓練菜單與階段參數的設定頁面 (從首頁的專案進入後)。
- **功能列表**：
    - **階段列表顯示**：以清單方式呈現所有訓練階段，包含該階段的名稱、YouTube 影片來源、運動時間、休息時間以及影片截取時段。
    - **階段新增與編輯**：
        - 欄位包含：階段名稱 (Name)、影片來源輸入 (YouTube URL)。
        - 時間設定：訓練持續時間 (Practice Duration)、休息時間 (Rest Time)。
        - 影片片段設定：開始播放時間 (Start Time)、結束播放時間 (End Time)；若設定結束時間，其值必須大於開始時間。
    - **操作排列與刪除**：使用者可以將特定階段上移 (Move Up)、下移 (Move Down) 或刪除 (Delete)。
    - **全域休息影片 (Global Rest Video)**：使用者可全域指定一支 YouTube 影片，系統會在每個「休息」階段自動隨機跳轉播放此影片片段以提供娛樂或背景音。
    - **總時間計算**：系統即時加總所有階段之訓練與休息時間，顯示總耗時。

### 3.3 播放器頁 (Player Dashboard)
- **描述**：執行訓練計畫的核心介面 (於計畫設定頁點擊開始訓練後進入)。
- **功能列表**：
    - **狀態循環邏輯**：
        1. **PREPARING (準備中)**：固定 3 秒倒數，載入第一階段影片。
        2. **PRACTICING (訓練中)**：播放該階段指定之 YouTube 影片片段，依照設定之訓練時間倒數。
        3. **RESTING (休息中)**：若該階段有設定休息時間，則切換至此狀態，播放全域休息影片。時間歸零後切換至下一階段的 PREPARING，直到階段結束。
        4. **FINISHED (完成)**：所有階段完成後顯示恭喜畫面。
    - **大型計時與視覺進度**：畫面中央提供巨大的倒數計時器，畫面底部提供整體訓練進度條 (Global Progress Bar)。
    - **即時時間軸 (Timeline)**：右側或側邊顯示所有訓練清單，高亮目前正在進行的階段，已完成之階段呈現灰色或打勾標示。
    - **播放器控制元件**：
        - 暫停/繼續 (Play / Pause) 功能。
        - 跳過當前狀態 (Skip) 功能。
        - 進入/退出全螢幕 (Fullscreen) 切換。
        - 離開訓練 (Exit) 並返回配置中心。
    - **無縫影片控制**：採用 YouTube IFrame API，隱藏原生控制列，禁止鍵盤操作，強制自動播放。若影片播放超過自帶的結束時間，應自動調回該階段的開始時間循環播放。

### 3.4 語音提示系統 (Text-to-Speech / TTS)
- **描述**：利用瀏覽器內建 TTS 引擎播報訓練資訊。
- **觸發時機與內容**：
    - 進入 **PREPARING** 時：「準備開始，接下來是：[下一個動作名稱]」。
    - 進入 **RESTING** 時：「休息一下。下一個動作是：[下一個動作名稱]」或「最後的休息時間，即將完成訓練！」。
    - 進入 **PRACTICING** 時（訓練開始）：「開始！」。
    - **倒秒提示**：訓練中或休息中剩下 3、2、1 秒時，分別用語音播報「三」、「二」、「一」。
    - 進入 **FINISHED** 時：「訓練完成，太棒了！」。

### 3.5 資料庫設計與持久化存取
- **描述**：系統的訓練菜單等設定皆集中儲存於後端之 SQLite 資料庫。
- **實作方式**：
    - 第一版 (v1) 主要記錄與專案對應之 YouTube URL、階段名稱及各項秒數參數設定。
    - 前端 React 透過 RESTful API (例如 `GET /api/projects`, `POST /api/stages`) 即時與後端 .NET Core 伺服器同步訓練菜單的增添、修改與排序狀態。
    - **優勢**：資料集中管理且完美持久化，且透過輕量化 SQLite 與 Kestrel 伺服器，使用者能在本機輕鬆將環境跑起來，無需繁瑣設定。

---

## 4. 外部介面需求 (External Interfaces)

### 4.1 使用者介面 (User Interfaces)
- **視覺風格**：採用暗黑/電競/科技感風格，主色調為深黑 (#0b0f10, #112116) 搭配強烈對比的螢光綠 (#13ec5b / #19e65e) 以及白色文字，呈現專業且動力的氛圍。
- **響應式設計 (RWD)**：介面必須支援桌上型電腦與行動裝置。在行動裝置上，右側的時間軸 (Timeline) 或設定表單可能需要折疊或改為下方顯示排列。

### 4.2 軟體與系統介面 (Software Interfaces)
- **.NET Core Web API**：後端提供一組 RESTful HTTP(s) API，格式為 JSON，供前端控制資料庫之 CRUD (Create, Read, Update, Delete)。採 Kestrel 獨立運行，無需 IIS。
- **SQLite Database**：後端透過 Entity Framework Core 或 Dapper (經 Repository Pattern 封裝) 與 SQLite 檔案資料庫對接。
- **YouTube IFrame Player API**：播放 YouTube 影片的核心組件（需經由 `react-youtube` 進行二次封裝）。
- **Web Speech API**：使用 `window.speechSynthesis` 提供中文化 (zh-TW) 語音播報服務。

---

## 5. 非功能性需求 (Non-Functional Requirements)

### 5.1 效能需求 (Performance)
- 由於依賴 YouTube 的 iframe 載入，應確保狀態切換時盡量減少 iframe 重建，以利用 `loadVideoById` 替換影片，達到更順暢的無縫銜接體驗。
- 倒數計時需採用 `setInterval` 並盡可能精準反映每秒扣減，即便在瀏覽器背景標籤中也應維持基本的計算運行。

### 5.2 可用性與可靠性 (Usability & Reliability)
- **錯誤防範**：設定訓練時間時必須限制不可為 <= 0 秒；結束秒數必須大於開始秒數，需有適當的 Alert 提醒使用者。
- **相容性考量**：若使用者瀏覽器未支援 Text-to-Speech，系統內部應有異常處理 (try-catch / warn)，並確保不影響整個倒數與畫面流程的正常運作。
