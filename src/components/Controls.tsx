import React, { useState } from 'react';
import { useGrid } from '../context/GridContext';
import { ColorHex } from '../types/GridTypes';

const Controls: React.FC = () => {
  const { grid, setGrid } = useGrid();
  const [textData, setTextData] = useState('');

  const exportGrid = () => {
    setTextData(JSON.stringify(grid));
  };

  const importGrid = () => {
    try {
      const parsed = JSON.parse(textData) as ColorHex[][];
      setGrid(parsed);
    } catch {
      alert('Invalid pixelplate data');
    }
  };

  const downloadImage = () => {
    const size = grid.length;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        ctx.fillStyle = grid[y][x];
        ctx.fillRect(x, y, 1, 1);
      }
    }

    const scale = 16;
    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = canvas.width * scale;
    scaledCanvas.height = canvas.height * scale;
    const scaledCtx = scaledCanvas.getContext('2d');
    if (!scaledCtx) return;

    scaledCtx.imageSmoothingEnabled = false;
    scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

    const link = document.createElement('a');
    link.download = 'pixelplate.png';
    link.href = scaledCanvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-8 max-w-2xl mx-auto">
      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={exportGrid} className="bg-[#8abed4] text-black font-bold px-4 py-2 rounded shadow hover:opacity-90">
          Export
        </button>
        <button onClick={importGrid} className="bg-[#a4cb88] text-black font-bold px-4 py-2 rounded shadow hover:opacity-90">
          Import
        </button>
        <button onClick={downloadImage} className="bg-[#cc3232] text-white font-bold px-4 py-2 rounded shadow hover:opacity-90">
          Download PNG
        </button>
      </div>

      <textarea
        value={textData}
        onChange={(e) => setTextData(e.target.value)}
        placeholder="Exported pixelplate data here..."
        rows={8}
        className="w-full rounded border border-gray-400 p-2 font-mono resize-none text-sm text-black dark:text-white dark:bg-neutral-800 dark:border-neutral-700"
      />
    </div>
  );
};

export default Controls;
