import { useState } from 'react';
import { Home } from './components/Home';
import { PracticeConfig } from './components/PracticeConfig';
import { PlayerDashboard } from './components/PlayerDashboard';
import { usePracticeStore } from './hooks/usePracticeStore';

type PageView = 'HOME' | 'SETUP' | 'PLAYER';

function App() {
  const [currentView, setCurrentView] = useState<PageView>('HOME');
  const { items } = usePracticeStore();

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
