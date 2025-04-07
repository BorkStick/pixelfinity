import React, { useEffect, useState } from 'react';
import { useGrid } from '../context/GridContext';

interface EditState {
  name: string;
  type: string;
  brand: string;
  color: string;
  expanded: boolean;
}

const Palette: React.FC = () => {
  const {
    currentColor,
    setCurrentColor,
    filaments,
    addFilament,
    removeFilament,
  } = useGrid();

  const [editStates, setEditStates] = useState<Record<string, EditState>>({});
  const [trashMode, setTrashMode] = useState(false);

  const [newColor, setNewColor] = useState('#888888');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('');
  const [newBrand, setNewBrand] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('trashMode');
    setTrashMode(stored === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('trashMode', trashMode.toString());
  }, [trashMode]);

  const exportPalette = () => {
    const blob = new Blob([JSON.stringify(filaments, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pixelfinity-palette.json';
    link.click();
  };

  const importPalette = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          imported.forEach((f) => {
            if (f.name && f.color) {
              addFilament({
                name: f.name,
                color: f.color,
                type: f.type,
                brand: f.brand,
              });
            }
          });
        }
      } catch (err) {
        alert('Invalid palette file');
      }
    };
    reader.readAsText(file);
  };

  const handleSave = (originalColor: string) => {
    const edited = editStates[originalColor];
    if (!edited) return;
    removeFilament(originalColor);
    addFilament({
      name: edited.name,
      color: edited.color,
      type: edited.type,
      brand: edited.brand,
    });
    setEditStates((prev) => ({
      ...prev,
      [edited.color]: { ...edited, expanded: false },
    }));
  };

  return (
    <div className="flex flex-col items-center bg-[var(--panel-bg)] p-4 rounded shadow gap-4">
      <div className="w-full flex flex-wrap justify-between items-center mb-2 gap-2">
        <h2 className="text-lg font-bold text-[var(--text)]">🎨 Palette</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTrashMode((prev) => !prev)}
            className={`text-sm px-3 py-1 rounded border ${
              trashMode
                ? 'bg-red-600 text-white border-red-700'
                : 'bg-[var(--input-bg)] text-[var(--text)] border-[var(--cell-border)]'
            }`}
          >
            {trashMode ? '🗑️ Delete Colors' : '🗑️ Trash Mode'}
          </button>

          <button
            onClick={exportPalette}
            className="text-sm px-3 py-1 rounded border bg-[var(--input-bg)] text-[var(--text)] border-[var(--cell-border)]"
          >
            📤 Export
          </button>

          <label className="cursor-pointer text-sm px-3 py-1 rounded border bg-[var(--input-bg)] text-[var(--text)] border-[var(--cell-border)]">
            📥 Import
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={importPalette}
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 w-full">
        {filaments.map((f) => {
          const isSelected = currentColor === f.color;
          const isEditing = editStates[f.color]?.expanded;

          return (
            <div
              key={f.color}
              className="flex flex-col items-center w-32 p-2 rounded border border-[var(--cell-border)] bg-[var(--input-bg)]"
            >
              <div
                className={`w-10 h-10 rounded-md cursor-pointer border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-[var(--accent)] ring-[3px] ring-[var(--accent)] ring-opacity-50 scale-110 shadow-lg'
                    : 'border-white hover:scale-105'
                }`}
                style={{ backgroundColor: f.color }}
                title={`${f.name} (${f.color})`}
                onClick={() => setCurrentColor(f.color)}
              />
              <div className="text-xs mt-1 text-center text-[var(--text)] opacity-90">
                {f.name}
              </div>
              {isSelected && (
                <div className="text-[10px] text-[var(--accent)] font-bold mt-0.5">
                  ✓ Active
                </div>
              )}
              <button
                onClick={() =>
                  setEditStates((prev) => ({
                    ...prev,
                    [f.color]: {
                      name: f.name,
                      type: f.type || '',
                      brand: f.brand || '',
                      color: f.color,
                      expanded: !prev[f.color]?.expanded,
                    },
                  }))
                }
                className="text-xs text-[var(--accent)] mt-1 underline"
              >
                {isEditing ? 'Hide Details' : 'Show Details'}
              </button>

              {trashMode && (
                <button
                  className="absolute -top-2 -right-2 text-sm text-red-400 bg-black bg-opacity-60 rounded-full px-[6px] py-[2px] hover:text-red-200"
                  onClick={() => removeFilament(f.color)}
                  title="Remove color"
                >
                  🗑️
                </button>
              )}

              {isEditing && (
                <div className="w-full mt-2 flex flex-col gap-1 text-xs text-[var(--text)]">
                  <input
                    type="text"
                    value={editStates[f.color]?.name}
                    onChange={(e) =>
                      setEditStates((prev) => ({
                        ...prev,
                        [f.color]: { ...prev[f.color], name: e.target.value },
                      }))
                    }
                    placeholder="Name"
                    className="w-full rounded px-1 py-0.5 text-xs bg-[var(--panel-bg)] border border-[var(--cell-border)]"
                  />
                  <input
                    type="text"
                    value={editStates[f.color]?.type}
                    onChange={(e) =>
                      setEditStates((prev) => ({
                        ...prev,
                        [f.color]: { ...prev[f.color], type: e.target.value },
                      }))
                    }
                    placeholder="Type"
                    className="w-full rounded px-1 py-0.5 text-xs bg-[var(--panel-bg)] border border-[var(--cell-border)]"
                  />
                  <input
                    type="text"
                    value={editStates[f.color]?.brand}
                    onChange={(e) =>
                      setEditStates((prev) => ({
                        ...prev,
                        [f.color]: { ...prev[f.color], brand: e.target.value },
                      }))
                    }
                    placeholder="Brand"
                    className="w-full rounded px-1 py-0.5 text-xs bg-[var(--panel-bg)] border border-[var(--cell-border)]"
                  />
                  <input
                    type="color"
                    value={editStates[f.color]?.color}
                    onChange={(e) =>
                      setEditStates((prev) => ({
                        ...prev,
                        [f.color]: { ...prev[f.color], color: e.target.value },
                      }))
                    }
                    className="w-full rounded"
                  />
                  <button
                    className="mt-1 text-xs bg-[var(--accent)] text-white px-2 py-0.5 rounded"
                    onClick={() => handleSave(f.color)}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add new filament */}
      <div className="flex flex-wrap items-center gap-2 justify-center mt-4">
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="px-2 py-1 rounded text-sm bg-[var(--input-bg)] text-[var(--text)] placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Type"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="px-2 py-1 rounded text-sm bg-[var(--input-bg)] text-[var(--text)] placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Brand"
          value={newBrand}
          onChange={(e) => setNewBrand(e.target.value)}
          className="px-2 py-1 rounded text-sm bg-[var(--input-bg)] text-[var(--text)] placeholder-gray-400"
        />
        <button
          className="bg-[var(--accent)] text-white px-3 py-1 rounded text-sm"
          onClick={() => {
            if (newName.trim()) {
              addFilament({
                name: newName.trim(),
                color: newColor,
                type: newType.trim(),
                brand: newBrand.trim(),
              });
              setNewName('');
              setNewType('');
              setNewBrand('');
            }
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default Palette;
