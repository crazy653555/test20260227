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
- **後端 API 伺服器 (Server)**：部署於本機 IIS 虛擬機器上的 .NET Core Web API。
- **資料庫伺服器 (Database)**：部署於本機 VM 的 SQL Server。

### 2.2 技術選型
- **前端 (Frontend)**：React 18+, TypeScript, Vite, Tailwind CSS, Zustand (客製化狀態), Axios / React Query (資料請求), react-youtube。
- **後端 (Backend)**：.NET 8 Web API, C#, Entity Framework Core (EF Core) / Dapper。
- **資料庫 (Database)**：Microsoft SQL Server。

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
1. **Controller 層**：如 `ProjectsController`, `StagesController`，負責路由與 HTTP 狀態碼驗證。
2. **Service / Manager 層**：處理業務邏輯，例如「當新增階段時，自動取得目前清單最大 `OrderIdx` + 1 作為新階段的排序值」。
3. **資料存取層**：
   - 建議採用 **Entity Framework Core (Code-First)**。定義 `Project` 與 `Stage` 模型後，透過 `Add-Migration` 與 `Update-Database` 建立 SQL Server Schema。
   - 需設定 CORS (Cross-Origin Resource Sharing)，允許前端 (如 `http://localhost:5173`) 呼叫。

---

## 6. 前端實作方案 (Frontend Implementation - React)

### 6.1 架構與狀態管理 (State Management)
由於引入了後端 API，前端原有的 `usePracticeStore` (基於 LocalStorage) 需重構：
1. **Server State (伺服器狀態)**：推薦引入 `@tanstack/react-query` 來呼叫 API (`/api/projects/xxx`)。React Query 會幫忙處理 Cache、Loading、Error 狀態。
2. **Client State (客戶端狀態)**：如「目前播放到第幾個階段 (`currentStageIndex`)」、「播放器狀態 (PREPARING, PRACTICING, RESTING, FINISHED)」、「當前倒數秒數 (`timeLeft`)」，繼續保留使用 `Zustand` 或是 React 內建的 `useReducer`/`useState` 管理。

### 6.2 核心元件分配 (Component Architecture)
- **`App.tsx`**
  - 路由切換 (使用 `react-router-dom`)，負責在前台儀表板 (`PlayerDashboard`) 與後台編輯區 (`PracticeConfig`) 之間切換。
- **設定區塊 (`PracticeConfig.tsx`)**
  - 使用者編輯專案設定與 `Stages` 清單。
  - 元件內調用 `useMutation` (React Query) 發送 `POST`/`PUT`/`DELETE` API 給 .NET Core 背景儲存。
  - 清單拖曳排序可引入如 `@hello-pangea/dnd` 實作。
- **播放器區塊 (`PlayerDashboard.tsx`)**
  - 在 Component Mount 時發送 `GET /api/projects/{id}` 取得包含所有階段的完整菜單。
  - **`PlayerTimer`**：核心計時邏輯 (setInterval)，監控狀態 (秒數歸零時觸發狀態機切換)。
  - **`PlayerYoutube`**：包裝 `react-youtube`。透過接收目前階段的 `YoutubeUrl`, `StartSecond`, `EndSecond` 來動態命令 IFrame API (`loadVideoById({videoId, startSeconds...})`) 切換影片。
  - **`PlayerSpeech` (Hook 或 Context)**：監聽剩餘秒數，當等於 3, 2, 1 或是狀態變更時，呼叫 `window.speechSynthesis` 播報文字。
