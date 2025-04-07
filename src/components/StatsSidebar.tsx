import React from 'react';
import { useGrid } from '../context/GridContext';

interface StatsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const StatsSidebar: React.FC<StatsSidebarProps> = ({ isOpen, onClose }) => {
  const { grid } = useGrid();

  const tileCounts = grid.flat().reduce((acc: Record<string, number>, color) => {
    acc[color] = (acc[color] || 0) + 1;
    return acc;
  }, {});

  return (
    <div
      className={`
        fixed top-0 right-0 h-full w-72 bg-neutral-900 text-white z-50 transform transition-transform duration-300 shadow-lg
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold">📐 Grid Stats</h2>
        <button onClick={onClose} className="text-white text-xl hover:text-red-400">×</button>
      </div>
      <div className="p-4 font-mono text-sm overflow-y-auto h-full">
        <p className="mb-2">Grid Size: {grid[0].length} × {grid.length}</p>
        <div>
          <p className="font-semibold mb-1">🎨 Tile Counts:</p>
          <ul className="space-y-1">
            {Object.entries(tileCounts).map(([color, count]) => (
              <li key={color} className="flex items-center gap-2">
                <span
                  className="inline-block w-4 h-4 rounded border border-white"
                  style={{ backgroundColor: color }}
                />
                <span>{color} – {count} tile{count > 1 ? 's' : ''}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StatsSidebar;
