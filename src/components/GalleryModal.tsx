import React, { useState } from 'react';
import { useGrid } from '../context/GridContext';
import { ColorHex } from '../types/GridTypes';

interface GalleryEntry {
  name: string;
  data: ColorHex[][];
}

const GalleryModal: React.FC = () => {
  const { grid, setGrid } = useGrid();
  const [isOpen, setIsOpen] = useState(false);
  const [saveName, setSaveName] = useState('');

  const toggleGallery = () => {
    setIsOpen(!isOpen);
  };

  const saveToGallery = () => {
    if (!saveName.trim()) return;
    const raw = localStorage.getItem('pixelfinity-gallery');
    let gallery: GalleryEntry[] = [];

    try {
      const parsed = raw ? JSON.parse(raw) : [];
      gallery = Array.isArray(parsed) ? parsed : [];
    } catch {
      gallery = [];
    }

    gallery.push({ name: saveName.trim(), data: grid });
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
    } catch {
      gallery = [];
    }

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

    return canvas.toDataURL();
  };

  // Load gallery safely
  let gallery: GalleryEntry[] = [];
  try {
    const raw = localStorage.getItem('pixelfinity-gallery');
    const parsed = raw ? JSON.parse(raw) : [];
    gallery = Array.isArray(parsed) ? parsed : [];
  } catch {
    gallery = [];
  }

  return (
    <>
      <button onClick={toggleGallery} className="bg-gray-300 text-black px-2 py-1 rounded text-sm">
        Pixelplate Gallery
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Pixelplate Gallery</h2>
              <button onClick={toggleGallery} className="text-red-500 text-xl">×</button>
            </div>

            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Name your pixelplate..."
              className="w-full p-2 mb-2 border rounded"
            />

            <button onClick={saveToGallery} className="bg-green-600 text-white px-3 py-1 rounded mb-4">
              Save Pixelplate
            </button>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gallery.map((entry) => (
                <div key={entry.name} className="bg-gray-100 p-2 rounded shadow text-center">
                  <img
                    src={drawPreview(entry.data)}
                    alt={entry.name}
                    className="w-24 h-24 mx-auto mb-2 border"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div className="text-sm font-bold">{entry.name}</div>
                  <div className="flex justify-center gap-2 mt-1">
                    <button
                      onClick={() => loadFromGallery(entry.data)}
                      className="text-blue-600 text-sm"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => deleteFromGallery(entry.name)}
                      className="text-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryModal;
