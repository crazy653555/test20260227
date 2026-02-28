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
        <div className="max-w-7xl mx-auto px-4 py-8">
          <header className="mb-8 flex items-center justify-between border-b border-gray-800 pb-4">
            <button
              onClick={() => setCurrentView('HOME')}
              className="text-[#13ec5b] hover:text-[#13ec5b]/80 flex items-center gap-2"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Home
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
              <span className="material-symbols-outlined text-[#13ec5b]">edit_square</span>
              Project Setup
            </h1>
          </header>
          <div className="bg-[#1a2e22] rounded-lg p-6 shadow-lg mb-8 text-white border border-gray-800">
            <PracticeConfig />
            <div className="mt-6 flex justify-center">
              <button
                className="w-full md:w-auto px-8 py-3 bg-[#13ec5b] text-black font-bold text-lg rounded-lg shadow-lg hover:bg-[#13ec5b]/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleStartPractice}
                disabled={items.length === 0}
              >
                開始訓練
              </button>
            </div>
          </div>
        </div>
      )}

      {currentView === 'PLAYER' && (
        <PlayerDashboard onExit={() => setCurrentView('SETUP')} />
      )}
    </div>
  );
}

export default App;
