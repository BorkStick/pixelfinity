import React, { useEffect, useState } from 'react';
import { GridProvider, useGrid } from './context/GridContext';
import Palette from './components/Palette.tsx';
import Grid from './components/Grid';
import Controls from './components/Controls';
import GalleryModal from './components/GalleryModal';
import StatsSidebar from './components/StatsSidebar';

const ThemeAndGridButtons: React.FC<{ onStatsToggle: () => void }> = ({ onStatsToggle }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setIsDark(next === 'dark');
  };

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeToUse = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', themeToUse);
    setIsDark(themeToUse === 'dark');
  }, []);

  return (
    <>
      <button
        onClick={toggleTheme}
        className="flex items-center gap-2 bg-[var(--input-bg)] text-[var(--text)] px-2 py-1 rounded text-sm border border-[var(--cell-border)]"
      >
        {isDark ? '🌙 Dark' : '🌞 Light'}
      </button>
      <button
        onClick={onStatsToggle}
        className="bg-[var(--input-bg)] text-[var(--text)] px-2 py-1 rounded text-sm border border-[var(--cell-border)]"
      >
        Show Stats
      </button>
    </>
  );
};

const AppLayout: React.FC = () => {
  const [showStats, setShowStats] = useState(false);
  const [gridSize, setGridSize] = useState(10);
  const [grid, setGrid] = useState<string[][]>(() =>
    Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => '#2b2b2b')
    )
  );

  const { currentColor } = useGrid();

  useEffect(() => {
    setGrid(
      Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize }, () => '#2b2b2b')
      )
    );
  }, [gridSize]);

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

        <div className="mb-4 flex gap-4 items-center">
          <label>
            Grid Size:
            <input
              type="number"
              min={1}
              max={100}
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="ml-2 px-2 py-1 w-20 border rounded bg-[var(--input-bg)] text-[var(--text)]"
            />
          </label>
        </div>

        <div className="mb-4">
          <Palette />
        </div>

        <div className="mb-6">
          <Grid
            gridSize={gridSize}
            grid={grid}
            setGrid={setGrid}
            currentColor={currentColor}
          />
        </div>

        <div className="mb-6">
          <Controls />
        </div>
      </div>

      <StatsSidebar isOpen={showStats} onClose={() => setShowStats(false)} grid={grid} />
    </main>
  );
};

const App: React.FC = () => (
  <GridProvider>
    <AppLayout />
  </GridProvider>
);

export default App;
