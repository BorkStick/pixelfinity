import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Filament {
  name: string;
  color: string;
  type?: string;
  brand?: string;
}

interface GridContextProps {
  grid: string[][];
  setGrid: React.Dispatch<React.SetStateAction<string[][]>>;
  setGridSizeAndReset: (size: number) => void;

  currentColor: string;
  setCurrentColor: (color: string) => void;

  showGridLines: boolean;
  toggleGridLines: () => void;

  filaments: Filament[];
  addFilament: (f: Filament) => void;
  removeFilament: (color: string) => void;
}

const GridContext = createContext<GridContextProps | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'pixelfinity_filaments';
const LOCAL_GRID_SIZE_KEY = 'pixelfinity_grid_size';

const generateGrid = (size: number): string[][] =>
  Array.from({ length: size }, () =>
    Array.from({ length: size }, () => '#2b2b2b')
  );

export const GridProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialGridSize = () => {
    const savedSize = localStorage.getItem(LOCAL_GRID_SIZE_KEY);
    const size = parseInt(savedSize || '10', 10);
    return isNaN(size) || size < 1 || size > 100 ? 10 : size;
  };

  const [grid, setGrid] = useState<string[][]>(() => generateGrid(getInitialGridSize()));
  const [currentColor, setCurrentColor] = useState<string>('#888888');
  const [showGridLines, setShowGridLines] = useState(true);
  const [filaments, setFilaments] = useState<Filament[]>([
    { name: 'Black', color: '#2b2b2b' },
    { name: 'White', color: '#ffffff' },
    { name: 'Red', color: '#cc3232' },
    { name: 'Blue', color: '#8abed4' },
    { name: 'Green', color: '#a4cb88' },
  ]);

  // Load filaments from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setFilaments(parsed);
      } catch (err) {
        console.warn('Failed to parse saved filaments');
      }
    }
  }, []);

  // Save filaments to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filaments));
  }, [filaments]);

  const toggleGridLines = () => setShowGridLines((prev) => !prev);

  const addFilament = (f: Filament) => {
    setFilaments((prev) => {
      if (prev.some((item) => item.color.toLowerCase() === f.color.toLowerCase())) {
        return prev;
      }
      return [...prev, f];
    });
  };

  const removeFilament = (color: string) => {
    setFilaments((prev) => prev.filter((f) => f.color !== color));
  };

  const setGridSizeAndReset = (size: number) => {
    localStorage.setItem(LOCAL_GRID_SIZE_KEY, size.toString());
    setGrid(generateGrid(size));
  };

  return (
    <GridContext.Provider
      value={{
        grid,
        setGrid,
        setGridSizeAndReset,
        currentColor,
        setCurrentColor,
        showGridLines,
        toggleGridLines,
        filaments,
        addFilament,
        removeFilament,
      }}
    >
      {children}
    </GridContext.Provider>
  );
};

export const useGrid = () => {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error('useGrid must be used within GridProvider');
  }
  return context;
};
