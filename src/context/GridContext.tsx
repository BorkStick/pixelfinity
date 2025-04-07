import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Filament {
  name: string;
  color: string;
  type?: string;   // e.g. PLA, PETG
  brand?: string;  // e.g. Prusament, Hatchbox
}


interface GridContextProps {
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

export const GridProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentColor, setCurrentColor] = useState<string>('#888888');
  const [showGridLines, setShowGridLines] = useState(true);

  const [filaments, setFilaments] = useState<Filament[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (err) {
        console.warn('Failed to parse saved filaments');
      }
    }
    return [
      { name: 'Black', color: '#2b2b2b' },
      { name: 'White', color: '#ffffff' },
      { name: 'Red', color: '#cc3232' },
      { name: 'Blue', color: '#8abed4' },
      { name: 'Green', color: '#a4cb88' },
    ];
  });

  // Save filaments to localStorage when they change
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

  return (
    <GridContext.Provider
      value={{
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
