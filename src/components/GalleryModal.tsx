import React, { useEffect, useRef, useState } from 'react';
import { useGrid } from '../context/GridContext';
import { GridData } from '../types/GridTypes';

interface GalleryEntry {
  name: string;
  data: GridData;
}

const GalleryModal: React.FC = () => {
  const { grid, setGrid } = useGrid();
  const [entries, setEntries] = useState<GalleryEntry[]>([]);
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const key = 'pixelfinity-gallery';

  const save = () => {
    if (!name.trim()) return;
    const gallery = JSON.parse(localStorage.getItem(key) || '{}') as Record<string, GridData>;
    gallery[name] = grid;
    localStorage.setItem(key, JSON.stringify(gallery));
    setName('');
    load();
  };

  const load = () => {
    const gallery = JSON.parse(localStorage.getItem(key) || '{}') as Record<string, GridData>;
    const list: GalleryEntry[] = Object.entries(gallery).map(([name, data]) => ({ name, data }));
    setEntries(list);
  };

  const loadEntry = (entry: GridData) => {
    setGrid(entry);
    setVisible(false);
  };

  const removeEntry = (entryName: string) => {
    const gallery = JSON.parse(localStorage.getItem(key) || '{}') as Record<string, GridData>;
    delete gallery[entryName];
    localStorage.setItem(key, JSON.stringify(gallery));
    load();
  };

  const drawPreview = (data: GridData): string => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const size = data.length;

    canvas.width = size;
    canvas.height = size;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        ctx.fillStyle = data[y][x];
        ctx.fillRect(x, y, 1, 1);
      }
    }

    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = 128;
    scaledCanvas.height = 128;
    const scaledCtx = scaledCanvas.getContext('2d')!;
    scaledCtx.imageSmoothingEnabled = false;
    scaledCtx.drawImage(canvas, 0, 0, 128, 128);
    return scaledCanvas.toDataURL();
  };

  useEffect(() => {
    if (visible) load();
  }, [visible]);

  return (
    <>
      <button onClick={() => setVisible(true)} className="bg-gray-300 text-black px-2 py-1 rounded text-sm">
        Pixelplate Gallery
      </button>

      {visible && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center px-4">
          <div className="bg-neutral-900 text-gray-100 p-6 rounded-lg max-w-full w-[90%] md:w-[720px] max-h-[90vh] overflow-y-auto shadow-xl border border-purple-700 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold tracking-wider text-purple-300">📂 Pixelplate Gallery</h2>
              <button onClick={() => setVisible(false)} className="text-red-400 text-2xl hover:text-red-300">✕</button>
            </div>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name your pixelplate..."
              className="w-full p-2 mb-3 border border-gray-700 rounded bg-neutral-800 text-white"
            />
            <button
              onClick={save}
              className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded mb-6"
            >
              💾 Save Pixelplate
            </button>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {entries.map((entry) => (
                <div
                  key={entry.name}
                  className="bg-neutral-800 p-2 rounded shadow text-center border border-gray-700 hover:border-purple-400 transition"
                >
                  <img
                    src={drawPreview(entry.data)}
                    alt={entry.name}
                    className="mx-auto mb-2 border border-gray-600"
                    style={{
                      width: '128px',
                      height: '128px',
                      imageRendering: 'pixelated',
                    }}
                  />
                  <div className="text-sm font-semibold truncate">{entry.name}</div>
                  <div className="flex justify-center gap-2 mt-1 text-sm">
                    <button
                      onClick={() => loadEntry(entry.data)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => removeEntry(entry.name)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryModal;
