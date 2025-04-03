import React from 'react';
import { useGrid, filaments } from '../context/GridContext';

const Palette: React.FC = () => {
  const { currentColor, setCurrentColor } = useGrid();

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {filaments.map((f) => (
        <div key={f.color} className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded cursor-pointer border-2 mb-1 transition ${
              currentColor === f.color ? 'border-yellow-400' : 'border-white'
            }`}
            style={{ backgroundColor: f.color }}
            title={`${f.name} (${f.color})`}
            onClick={() => setCurrentColor(f.color)}
          />
          <div className="text-xs text-center">{f.name}</div>
        </div>
      ))}
    </div>
  );
};

export default Palette;
