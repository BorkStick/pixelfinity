import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Filament, GridData, ColorHex } from '../types/GridTypes';

// Default 16x16 grid filled with base color
const GRID_SIZE = 16;
const DEFAULT_COLOR = '#2b2b2b';

const defaultGrid: GridData = Array(GRID_SIZE)
  .fill(null)
  .map(() => Array(GRID_SIZE).fill(DEFAULT_COLOR));

// Your filament palette
export const filaments: Filament[] = [
  { name: 'Red PLA', color: '#cc3232' },
  { name: 'Light Green PLA', color: '#a4cb88' },
  { name: 'Green PLA', color: '#57d188' },
  { name: 'Purple PLA', color: '#800080' },
  { name: 'Grey PLA', color: '#868489' },
  { name: 'Light Blue PLA', color: '#8abed4' },
  { name: 'Dark Blue PLA', color: '#1e255c' },
  { name: 'White PLA', color: '#ffffff' },
  { name: 'Black PLA', color: '#000000' }
];

// Define context shape
interface GridContextProps {
  grid: GridData;
  currentColor: ColorHex;
  showGridLines: boolean;
  setGrid: (grid: GridData) => void;
  updateCell: (x: number, y: number, color: ColorHex) => void;
  setCurrentColor: (color: ColorHex) => void;
  toggleGridLines: () => void;
}

// Create context
const GridContext = createContext<GridContextProps | undefined>(undefined);

// Custom hook
export const useGrid = () => {
  const ctx = useContext(GridContext);
  if (!ctx) throw new Error('useGrid must be used within GridProvider');
  return ctx;
};

// Provider component
export const GridProvider = ({ children }: { children: ReactNode }) => {
  const [grid, setGrid] = useState<GridData>(defaultGrid);
  const [currentColor, setCurrentColor] = useState<ColorHex>(filaments[0].color);
  const [showGridLines, setShowGridLines] = useState(true);

  const updateCell = (x: number, y: number, color: ColorHex) => {
    setGrid(prev =>
      prev.map((row, rowIndex) =>
        rowIndex === y
          ? row.map((cell, colIndex) => (colIndex === x ? color : cell))
          : row
      )
    );
  };

  const toggleGridLines = () => setShowGridLines(prev => !prev);

  return (
    <GridContext.Provider
      value={{ grid, currentColor, showGridLines, setGrid, updateCell, setCurrentColor, toggleGridLines }}
    >
      {children}
    </GridContext.Provider>
  );
};
