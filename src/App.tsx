import React, { useEffect, useState } from 'react';
import { GridProvider, useGrid } from './context/GridContext';
import Palette from './components/Palette';
import Grid from './components/Grid';
import Controls from './components/Controls';
import GalleryModal from './components/GalleryModal';
import StatsSidebar from './components/StatsSidebar';

const ThemeAndGridButtons: React.FC<{ onStatsToggle: () => void }> = ({ onStatsToggle }) => {
  const { toggleGridLines } = useGrid();

  const toggleTheme = () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  }, []);

  return (
    <>
      <button
        onClick={toggleTheme}
        className="bg-gray-300 text-black px-2 py-1 rounded text-sm"
      >
        Toggle Theme
      </button>
      <button
        onClick={toggleGridLines}
        className="bg-gray-300 text-black px-2 py-1 rounded text-sm"
      >
        Toggle Grid
      </button>
      <button
        onClick={onStatsToggle}
        className="bg-gray-300 text-black px-2 py-1 rounded text-sm"
      >
        Show Stats
      </button>
    </>
  );
};

const AppLayout: React.FC = () => {
  const [showStats, setShowStats] = useState(false);

  return (
    <main className="bg-[var(--bg)] text-[var(--text)] min-h-screen p-6 font-mono transition-colors duration-300">
      <div className="max-w-screen-md mx-auto">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">🧱 Pixelfinity</h1>
          <div className="flex gap-2">
            <ThemeAndGridButtons onStatsToggle={() => setShowStats(true)} />
            <GalleryModal />
          </div>
        </header>

        <div className="mb-4">
          <Palette />
        </div>

        <div className="mb-6">
          <Grid />
        </div>

        <div className="mb-6">
          <Controls />
        </div>
      </div>

      {/* Sidebar */}
      <StatsSidebar isOpen={showStats} onClose={() => setShowStats(false)} />
    </main>
  );
};

const App: React.FC = () => {
  return (
    <GridProvider>
      <AppLayout />
    </GridProvider>
  );
};

export default App;
