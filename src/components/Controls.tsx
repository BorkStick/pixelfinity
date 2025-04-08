import React, { useState } from 'react';
import { useGrid } from '../context/GridContext';
import { ColorHex } from '../types/GridTypes';

const Controls: React.FC = () => {
  const { grid, setGrid } = useGrid();
  const [textData, setTextData] = useState('');
  const [imageName, setImageName] = useState('pixelplate');

  const exportGrid = () => {
    setTextData(JSON.stringify(grid, null, 2));
  };

  const importGrid = () => {
    try {
      const parsed = JSON.parse(textData) as ColorHex[][];
      if (Array.isArray(parsed)) {
        setGrid(parsed);
      } else {
        throw new Error('Invalid grid data');
      }
    } catch {
      alert('Invalid pixelplate data');
    }
  };

  const downloadImage = () => {
    const pixelSize = grid.length;
    if (!pixelSize || !grid[0]) return;

    // Step 1: Draw grid to small canvas
    const canvas = document.createElement('canvas');
    canvas.width = pixelSize;
    canvas.height = pixelSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    for (let y = 0; y < pixelSize; y++) {
      for (let x = 0; x < pixelSize; x++) {
        ctx.fillStyle = grid[y][x] || '#2b2b2b';
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Step 2: Scale to 512x512
    const finalSize = 512;
    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = finalSize;
    scaledCanvas.height = finalSize;
    const scaledCtx = scaledCanvas.getContext('2d');
    if (!scaledCtx) return;

    scaledCtx.fillStyle = '#ffffff'; // Optional white background
    scaledCtx.fillRect(0, 0, finalSize, finalSize);

    scaledCtx.imageSmoothingEnabled = false;
    scaledCtx.drawImage(canvas, 0, 0, finalSize, finalSize);

    // Step 3: Save as PNG
    const link = document.createElement('a');
    link.download = `${imageName || 'pixelplate'}.png`;
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

      <input
        type="text"
        placeholder="Image file name"
        value={imageName}
        onChange={(e) => setImageName(e.target.value)}
        className="w-full rounded border border-gray-400 p-2 font-mono text-sm bg-[var(--input-bg)] text-[var(--text)]"
      />

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
