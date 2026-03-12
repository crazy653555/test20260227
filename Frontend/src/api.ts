import axios from 'axios';

// 建立 Axios 實例，用以統一處理所有的後端 API 請求
// 此處對應 .NET Core 後端執行的 port (可依據 launchSettings.json 或實際伺服器環境修改)
const api = axios.create({
    baseURL: 'http://localhost:5232/api',
});

// 匯出供各個元件或 hooks 使用
export default api;
