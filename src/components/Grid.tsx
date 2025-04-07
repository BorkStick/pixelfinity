import React, { useEffect, useState } from 'react';
import { useGrid } from '../context/GridContext';

const Grid: React.FC = () => {
  const { grid, updateCell, currentColor, showGridLines } = useGrid();
  const gridSize = grid.length;
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const stopDrawing = () => setIsDrawing(false);
    window.addEventListener('mouseup', stopDrawing);
    return () => window.removeEventListener('mouseup', stopDrawing);
  }, []);

  const LabelCell = ({ text }: { text: number }) => (
    <div className="w-6 h-6 flex items-center justify-center text-xs text-gray-400 font-mono select-none">

      {text}
    </div>
  );

  return (
    <div className="bg-neutral-900 border border-gray-700 p-4 rounded shadow-md w-fit mx-auto space-y-1">
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

      {/* Grid with side labels */}
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
                  borderStyle: showGridLines ? 'solid' : 'none',
                  cursor: 'crosshair',
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  const isRightClick = e.button === 2;
                  updateCell(colIndex, rowIndex, isRightClick ? '#2b2b2b' : currentColor);
                  setIsDrawing(true);
                }}
                onMouseOver={(e) => {
                  if (isDrawing) {
                    const isRightClick = e.buttons === 2;
                    updateCell(colIndex, rowIndex, isRightClick ? '#2b2b2b' : currentColor);
                  }
                }}
                onContextMenu={(e) => e.preventDefault()}
              />
            ))}
            <LabelCell text={rowIndex + 1} />
          </React.Fragment>
        ))}
      </div>

      {/* Bottom Row Labels */}
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
    </div>
  );
};

export default Grid;
