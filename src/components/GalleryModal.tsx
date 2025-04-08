import React, { useState } from 'react';
import { useGrid } from '../context/GridContext';
import { ColorHex } from '../types/GridTypes';

interface GalleryEntry {
  name: string;
  data: ColorHex[][];
  size: number;
}

const GalleryModal: React.FC = () => {
  const { grid, setGrid } = useGrid();
  const [isOpen, setIsOpen] = useState(false);
  const [saveName, setSaveName] = useState('');

  const toggleGallery = () => setIsOpen(!isOpen);

  const saveToGallery = () => {
    if (!saveName.trim()) return;
    const raw = localStorage.getItem('pixelfinity-gallery');
    let gallery: GalleryEntry[] = [];

    try {
      const parsed = raw ? JSON.parse(raw) : [];
      gallery = Array.isArray(parsed) ? parsed : [];
    } catch {}

    const entry: GalleryEntry = {
      name: saveName.trim(),
      data: grid,
      size: grid.length,
    };

    gallery.push(entry);
    localStorage.setItem('pixelfinity-gallery', JSON.stringify(gallery));
    setSaveName('');
  };

  const loadFromGallery = (data: ColorHex[][]) => {
    setGrid(data);
    setIsOpen(false);
  };

  const deleteFromGallery = (name: string) => {
    const raw = localStorage.getItem('pixelfinity-gallery');
    let gallery: GalleryEntry[] = [];

    try {
      const parsed = raw ? JSON.parse(raw) : [];
      gallery = Array.isArray(parsed) ? parsed : [];
    } catch {}

    const updated = gallery.filter((entry) => entry.name !== name);
    localStorage.setItem('pixelfinity-gallery', JSON.stringify(updated));
  };

  const drawPreview = (grid: ColorHex[][]): string => {
    const size = grid.length;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        ctx.fillStyle = grid[y][x];
        ctx.fillRect(x, y, 1, 1);
      }
    }

    const scale = 6;
    const scaled = document.createElement('canvas');
    scaled.width = size * scale;
    scaled.height = size * scale;
    const sctx = scaled.getContext('2d');
    if (!sctx) return '';

    sctx.imageSmoothingEnabled = false;
    sctx.drawImage(canvas, 0, 0, scaled.width, scaled.height);

    return scaled.toDataURL();
  };

  // Load gallery
  let gallery: GalleryEntry[] = [];
  try {
    const raw = localStorage.getItem('pixelfinity-gallery');
    const parsed = raw ? JSON.parse(raw) : [];
    gallery = Array.isArray(parsed) ? parsed : [];
  } catch {}

  return (
    <>
      <button
        onClick={toggleGallery}
        className="bg-[var(--input-bg)] text-[var(--text)] px-2 py-1 rounded text-sm border border-[var(--cell-border)]"
      >
        🖼️ Pixelplate Gallery
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-[var(--panel-bg)] text-[var(--text)] p-6 rounded-lg w-full max-w-3xl shadow-lg max-h-[90vh] overflow-y-auto border border-[var(--cell-border)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">🖼️ Pixelplate Gallery</h2>
              <button onClick={toggleGallery} className="text-xl text-red-400 hover:text-red-200">×</button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Name your pixelplate..."
                className="flex-1 px-3 py-2 rounded text-sm bg-[var(--input-bg)] text-[var(--text)] border border-[var(--cell-border)]"
              />
              <button
                onClick={saveToGallery}
                className="bg-[var(--accent)] text-white px-4 py-2 rounded text-sm"
              >
                💾 Save
              </button>
            </div>

            {gallery.length === 0 ? (
              <p className="text-sm text-gray-400">No pixelplates saved yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {gallery.map((entry) => (
                  <div
                    key={entry.name}
                    className="bg-[var(--input-bg)] p-3 rounded shadow border border-[var(--cell-border)]"
                  >
                    <img
                      src={drawPreview(entry.data)}
                      alt={entry.name}
                      className="w-full aspect-square mb-2 border border-[var(--cell-border)]"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    <div className="text-sm font-semibold truncate">{entry.name}</div>
                    <div className="text-xs text-gray-400 mb-2">Size: {entry.size} × {entry.size}</div>
                    <div className="flex justify-between">
                      <button
                        onClick={() => loadFromGallery(entry.data)}
                        className="text-blue-400 hover:underline text-xs"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => deleteFromGallery(entry.name)}
                        className="text-red-400 hover:underline text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryModal;
