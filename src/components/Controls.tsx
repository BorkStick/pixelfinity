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

  const displayStats = () => {
    const stats: Record<ColorHex, number> = {};
    grid.forEach(row => {
      row.forEach(color => {
        stats[color] = (stats[color] || 0) + 1;
      });
    });

    let output = `📐 Grid Size: ${grid[0].length} x ${grid.length}\n🎨 Tile Counts:\n`;
    for (const [color, count] of Object.entries(stats)) {
      output += `${color}: ${count} tile${count > 1 ? 's' : ''}\n`;
    }

    alert(output);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-wrap justify-center gap-2">
        <button onClick={exportGrid} className="bg-[#8abed4] text-black px-4 py-1 rounded">
          Export Pixelplate
        </button>
        <button onClick={importGrid} className="bg-[#a4cb88] text-black px-4 py-1 rounded">
          Import Pixelplate
        </button>
        <button onClick={downloadImage} className="bg-[#cc3232] text-white px-4 py-1 rounded">
          Download PNG
        </button>
        <button onClick={displayStats} className="bg-[#800080] text-white px-4 py-1 rounded">
          Show Grid Stats
        </button>
      </div>
      <textarea
        value={textData}
        onChange={(e) => setTextData(e.target.value)}
        placeholder="Exported pixelplate data here..."
        rows={8}
        className="w-full mt-2 p-2 text-black rounded resize-none"
      />
    </div>
  );
};

export default Controls;
