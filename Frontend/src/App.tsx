import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { PracticeConfig } from './components/PracticeConfig';
import { PlayerDashboard } from './components/PlayerDashboard';
import { usePracticeStore } from './hooks/usePracticeStore';

/// <summary>
/// 定義應用程式可能呈現的三種主要頁面
/// HOME: 首頁 / SETUP: 專案編輯頁 / PLAYER: 播放訓練畫面
/// </summary>
type PageView = 'HOME' | 'SETUP' | 'PLAYER';

function App() {
  // 管理目前畫面顯示的狀態，並根據網址 Hash 進行初始化
  const [currentView, setCurrentView] = useState<PageView>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'SETUP') return 'SETUP';
    if (hash === 'PLAYER') return 'PLAYER';
    return 'HOME';
  });

  const { items } = usePracticeStore();

  // 若當下檢視狀態變化時，主動同步更新網址 Hash，以便使用者能正常重新整理或回上一頁
  useEffect(() => {
    window.location.hash = currentView;
  }, [currentView]);

  // 監聽網址 Hash 變化並更新元件內部狀態
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageView;
      if (['HOME', 'SETUP', 'PLAYER'].includes(hash)) {
        setCurrentView(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 處理進入訓練模式的安全檢查
  const handleStartPractice = () => {
    if (items.length === 0) {
      alert('請先設定訓練項目！');
      return;
    }
    setCurrentView('PLAYER');
  };

  return (
    <div className="min-h-screen bg-[#0b0f10] text-[#eef6f0]">
      {currentView === 'HOME' && (
        <Home
          onCreateProject={() => setCurrentView('SETUP')}
          onViewProjects={() => setCurrentView('SETUP')}
        />
      )}

      {currentView === 'SETUP' && (
        <PracticeConfig
          onStartPractice={handleStartPractice}
          onBack={() => setCurrentView('HOME')}
        />
      )}

      {currentView === 'PLAYER' && (
        <PlayerDashboard onExit={() => setCurrentView('SETUP')} />
      )}
    </div>
  );
}

export default App;
