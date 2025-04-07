import React from 'react';
import { useGrid, filaments } from '../context/GridContext';

const Palette: React.FC = () => {
  const { currentColor, setCurrentColor } = useGrid();

  return (
    <div className="flex flex-wrap justify-center gap-4 bg-neutral-900 p-4 rounded shadow">
      {filaments.map((f) => {
        const isSelected = currentColor === f.color;
        return (
          <div key={f.color} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full cursor-pointer border-2 transition-transform duration-150 shadow-sm ${
                isSelected ? 'border-yellow-400 scale-110' : 'border-white hover:scale-105'
              }`}
              style={{ backgroundColor: f.color }}
              title={`${f.name} (${f.color})`}
              onClick={() => setCurrentColor(f.color)}
            />
            <div className="text-xs mt-1 text-center text-white opacity-80">{f.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Palette;
