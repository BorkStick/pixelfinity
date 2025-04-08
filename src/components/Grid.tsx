import React, { useEffect, useState } from 'react';
import { useGrid } from '../context/GridContext';

const Grid: React.FC = () => {
  const {
    grid,
    setGrid,
    currentColor,
    setCurrentColor,
    filaments,
    addFilament,
    showGridLines,
  } = useGrid();

  const [isDrawing, setIsDrawing] = useState(false);
  const [showLines, setShowLines] = useState(true); // local toggle only
  const [customName, setCustomName] = useState('');

  useEffect(() => {
    const stopDrawing = () => setIsDrawing(false);
    window.addEventListener('mouseup', stopDrawing);
    return () => window.removeEventListener('mouseup', stopDrawing);
  }, []);

  const gridSize = grid.length;

  const LabelCell = ({ text }: { text: number }) => (
    <div className="w-6 h-6 flex items-center justify-center text-xs text-[var(--text)] opacity-80 font-mono select-none">
      {text}
    </div>
  );

  const handleCellUpdate = (row: number, col: number, color: string) => {
    const newGrid = grid.map((r) => [...r]);
    newGrid[row][col] = color;
    setGrid(newGrid);
  };

  const colorExistsInPalette = filaments.some(
    (f) => f.color.toLowerCase() === currentColor.toLowerCase()
  );

  return (
    <div className="bg-[var(--panel-bg)] border border-[var(--cell-border)] p-4 rounded-lg shadow-md w-fit mx-auto space-y-1">
      {/* Top Row Labels */}
      <div
        className="grid gap-[1px]"
        style={{ gridTemplateColumns: `repeat(${gridSize + 2}, 1fr)` }}
      >
        <div />
        {Array.from({ length: gridSize }).map((_, i) => (
          <LabelCell key={`top-${i}`} text={i + 1} />
        ))}
        <div />
      </div>

      {/* Grid Rows */}
      <div
        className="grid gap-[1px]"
        style={{ gridTemplateColumns: `repeat(${gridSize + 2}, 1fr)` }}
      >
        {grid.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            <LabelCell text={rowIndex + 1} />
            {row.map((color, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className="w-6 h-6 transition-all duration-75 border border-[var(--cell-border)] hover:outline hover:outline-1 hover:outline-yellow-400"
                style={{
                  backgroundColor: color,
                  borderStyle: showLines ? 'solid' : 'none',
                  cursor: 'crosshair',
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  const isRightClick = e.button === 2;
                  handleCellUpdate(rowIndex, colIndex, isRightClick ? '#2b2b2b' : currentColor);
                  setIsDrawing(true);
                }}
                onMouseOver={(e) => {
                  if (isDrawing) {
                    const isRightClick = e.buttons === 2;
                    handleCellUpdate(rowIndex, colIndex, isRightClick ? '#2b2b2b' : currentColor);
                  }
                }}
                onContextMenu={(e) => e.preventDefault()}
              />
            ))}
            <LabelCell text={rowIndex + 1} />
          </React.Fragment>
        ))}
      </div>

      {/* Bottom Labels */}
      <div
        className="grid gap-[1px]"
        style={{ gridTemplateColumns: `repeat(${gridSize + 2}, 1fr)` }}
      >
        <div />
        {Array.from({ length: gridSize }).map((_, i) => (
          <LabelCell key={`bot-${i}`} text={i + 1} />
        ))}
        <div />
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4 text-[var(--text)]">
        <label className="text-sm flex items-center gap-2">
          🎨 Color:
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
          />
        </label>

        <label className="text-sm flex items-center gap-2">
          <input
            type="checkbox"
            checked={showLines}
            onChange={() => setShowLines((prev) => !prev)}
          />
          Show Grid Lines
        </label>
      </div>

      {/* Add to Palette */}
      {!colorExistsInPalette && (
        <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Color name"
            className="px-2 py-1 text-sm rounded bg-[var(--input-bg)] text-[var(--text)] placeholder-gray-400"
          />
          <button
            onClick={() => {
              if (customName.trim()) {
                addFilament({ name: customName.trim(), color: currentColor });
                setCustomName('');
              }
            }}
            className="text-sm px-3 py-1 rounded bg-[var(--accent)] text-white hover:opacity-90"
          >
            💾 Save to Palette
          </button>
        </div>
      )}
    </div>
  );
};

export default Grid;
