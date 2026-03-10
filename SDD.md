# 系統設計說明書 (Software Design Document - SDD)

## 專案名稱：My Training Plan (客製化間歇訓練播放器)

---

## 1. 簡介 (Introduction)
本系統設計說明書 (SDD) 基於「My Training Plan 第一版 (v1)」的軟體需求規格 (SRS) 進行撰寫。本文件旨在詳細描述系統的前後端架構、資料庫結構、API 介面定義，以及前端核心元件的設計方案，作為後續軟體開發與實作的準則。

---

## 2. 系統架構 (System Architecture)
本系統採用 **前後台分離 (Client-Server Architecture)**。

### 2.1 拓撲結構
- **使用者端 (Client)**：瀏覽器 (Chrome, Edge, Safari)。
- **前端伺服器/靜態資源**：使用 Vite 打包的 React SPA 靜態檔案。
- **後端 API 伺服器 (Server)**：使用 .NET Core Web API，透過內建 Kestrel 伺服器於本地端獨立運行，不依賴 IIS。
- **資料庫 (Database)**：使用本地端 SQLite 資料庫檔案。

### 2.2 技術選型
- **前端 (Frontend)**：React 18+, TypeScript, Vite, Tailwind CSS, Zustand (客製化狀態), Axios / React Query (資料請求), react-youtube。
- **後端 (Backend)**：.NET 8 Web API, C#, 三層式架構 (3-Tier), Autofac (DI), Entity Framework Core (EF Core) / Dapper。
- **資料庫 (Database)**：SQLite。

---

## 3. 資料庫設計 (Database Design)
採用關聯式資料庫設計，包含專案設定與其關聯的訓練清單階段。

### 3.1 實體關聯圖 (ERD) 概念
`Projects` (1) ---------- (N) `Stages`

### 3.2 資料表結構 (Schema)

#### 表格 1：`Projects` (專案/設定主表)
儲存全域設定及專案基本資料。
| 欄位名稱 | 資料型態 | 屬性 | 說明 |
| :--- | :--- | :--- | :--- |
| `Id` | `UNIQUEIDENTIFIER` | PK | 主鍵 (UUID) |
| `Name` | `NVARCHAR(100)` | NOT NULL | 專案/訓練計畫名稱 |
| `GlobalRestVideoUrl` | `NVARCHAR(500)` | NULL | 全域休息時播放的 YouTube 網址 |
| `CreatedAt` | `DATETIME2` | NOT NULL | 建立時間 |
| `UpdatedAt` | `DATETIME2` | NOT NULL | 更新時間 |

#### 表格 2：`Stages` (訓練階段清單表)
記錄該專案底下的每一筆訓練階段。
| 欄位名稱 | 資料型態 | 屬性 | 說明 |
| :--- | :--- | :--- | :--- |
| `Id` | `UNIQUEIDENTIFIER` | PK | 主鍵 (UUID) |
| `ProjectId` | `UNIQUEIDENTIFIER` | FK | 關聯至 `Projects.Id` (ON DELETE CASCADE) |
| `StageName` | `NVARCHAR(100)` | NOT NULL | 訓練動作名稱 (如: 伏地挺身) |
| `YoutubeUrl` | `NVARCHAR(500)` | NOT NULL | 影片來源網址 |
| `PracticeSeconds` | `INT` | NOT NULL | 訓練持續秒數 |
| `RestSeconds` | `INT` | NOT NULL | 休息持續秒數 |
| `StartSecond` | `INT` | NOT NULL | 影片片段起始秒數 (預設 0) |
| `EndSecond` | `INT` | NULL | 影片片段結束秒數 |
| `OrderIdx` | `INT` | NOT NULL | 在清單中的排序位置 (0, 1, 2...) |

---

## 4. API 介面設計 (API Design)
後端 .NET Core 提供的 RESTful API，接收/回傳格式皆為 `application/json`。

### 4.1 專案設定端點 (Project Endpoints)
- **`GET /api/projects`**
  - **說明**：取得所有專案清單 (目前預期只有單個，但保留擴充)。
  - **回應**：`[ { "id": "uuid", "name": "預設專案", "globalRestVideoUrl": "..." } ]`
- **`GET /api/projects/{projectId}`**
  - **說明**：取得特定專案的詳細資訊，並應該包含 (Include) 其底下的所有 `Stages`。
- **`PUT /api/projects/{projectId}`**
  - **說明**：更新專案名稱或 `GlobalRestVideoUrl`。

### 4.2 訓練階段端點 (Stage Endpoints)
- **`POST /api/projects/{projectId}/stages`**
  - **說明**：在指定專案下新增一個階段。
  - **請求本體**：`{ "stageName": "...", "youtubeUrl": "...", "practiceSeconds": 60... }`
- **`PUT /api/stages/{stageId}`**
  - **說明**：更新單一階段的各項屬性。
- **`DELETE /api/stages/{stageId}`**
  - **說明**：刪除單一階段。
- **`PATCH /api/projects/{projectId}/stages/reorder`**
  - **說明**：批次更新階段清單的排序。
  - **請求本體**：`[ { "stageId": "uuid1", "orderIdx": 0 }, { "stageId": "uuid2", "orderIdx": 1 } ]`

---

## 5. 後端實作方案 (Backend Implementation - .NET Core)
為確保專案極大的彈性與可維護性，後端採用 **嚴謹的三層式架構 (3-Tier Architecture)** 並結合 **Autofac** 進行依賴注入 (Dependency Injection)。整個專案具備自帶 Kestrel 伺服器的特性，能在本地端 `dotnet run` 即可獨立執行，無需依賴 IIS 環境。

### 5.1 架構分層設計
1. **API 層 (Presentation Layer / Controllers)**：
   - 負責接收 HTTP 請求、參數基礎驗證、路由配置、並回傳相對應的 HTTP 狀態碼與 JSON 結果。
   - 例：`ProjectsController`, `StagesController`。本身不包含任何業務邏輯，直接注入對應的 `IService`。
2. **業務邏輯層 (Business Logic Layer / Services)**：
   - 負責核心邏輯處理，例如計算最大排序值 (OrderIdx)、資料檢查與封裝。
   - 定義並實作如 `IProjectService`, `IStageService`。
3. **資料存取層 (Data Access Layer / Repositories)**：
   - 負責直接與 Entity Framework Core (或 Dapper) 溝通，對資料庫執行實質的 CRUD 動作。此層對上提供如 `IProjectRepository`, `IStageRepository` 等抽象介面，完美屏蔽底層 SQL 詳細實作。

### 5.2 技術配置
- **依賴注入 (DI)**：引入 `Autofac` 作為主要 DI 容器，利用 Module 的概念統一註冊各層的 Services 與 Repositories，增強擴充性。
- **資料庫套件**：引入 `Microsoft.EntityFrameworkCore.Sqlite`。於 `Program.cs` 設定連線字串至本機的 `.sqlite3` 檔案，透過 `Add-Migration` 與 `Update-Database` 維護 Schema。
- **跨域設定 (CORS)**：設定允許前端 (如 `http://localhost:5173`) 發起請求。

---

## 6. 前端實作方案 (Frontend Implementation - React)

### 6.1 架構與狀態管理 (State Management)
由於引入了後端 API，前端原有的 `usePracticeStore` (基於 LocalStorage) 需重構：
1. **Server State (伺服器狀態)**：推薦引入 `@tanstack/react-query` 來呼叫 API (`/api/projects/xxx`)。React Query 會幫忙處理 Cache、Loading、Error 狀態。
2. **Client State (客戶端狀態)**：如「目前播放到第幾個階段 (`currentStageIndex`)」、「播放器狀態 (PREPARING, PRACTICING, RESTING, FINISHED)」、「當前倒數秒數 (`timeLeft`)」，繼續保留使用 `Zustand` 或是 React 內建的 `useReducer`/`useState` 管理。

### 6.2 核心元件分配與頁面定義 (Component Architecture & Pages)
為了溝通一致性，統一以下頁面與元件命名：
- **首頁 (`Home.tsx` / Home Dashboard)**
  - 應用程式啟動進入點。提供進入建立專案、或檢視 `My Projects` 等總覽功能。
- **計畫設定頁 (`PracticeConfig.tsx` / Practice Configuration)**
  - 使用者編輯專案設定與新增/編輯 `Stages` (訓練計畫階段) 的專屬頁面。
  - 包含全局休息影片設定、新增 Stage 表單 (Rest Time、Video Segment 時間設定) 與拖曳排序等。
  - 具備操作防呆與提示：刪除訓練階段時，提供精緻的警告 Modal 彈出視窗（取代瀏覽器預設 alert）；調整影片片段時具備起訖時間連動防呆功能，若設定結尾時間，系統自動確保開始必須小於結束時間，並支援 End (Play to end) 直至影片結束。
- **播放器頁 (`PlayerDashboard.tsx` / Player Dashboard)**
  - 執行訓練計畫的核心頁面。包含大型倒數計時器、影片自動切換、側邊 Timeline 進度追蹤 (訓練與休息時間)。
  - 全螢幕模式 (Fullscreen) 下，擴充顯示下一個訓練項目的提示資訊。
- **`App.tsx`**
  - 路由切換，負責在「首頁」、「計畫設定頁」與「播放器頁」之間狀態切換。
  - **`PlayerTimer`**：核心計時邏輯 (setInterval)，監控狀態 (秒數歸零時觸發狀態機切換)。
  - **`PlayerYoutube`**：包裝 `react-youtube`。透過接收目前階段的 `YoutubeUrl`, `StartSecond`, `EndSecond` 來動態命令 IFrame API (`loadVideoById({videoId, startSeconds...})`) 切換影片。
  - **`PlayerSpeech` (Hook 或 Context)**：監聽剩餘秒數，當等於 3, 2, 1 或是狀態變更時，呼叫 `window.speechSynthesis` 播報文字。
