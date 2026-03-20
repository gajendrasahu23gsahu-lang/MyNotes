import React, { useState } from 'react';
import { SheetData, SheetCell } from '../types';

interface SheetEditorProps {
  data: SheetData;
  onChange: (data: SheetData) => void;
}

const SheetEditor: React.FC<SheetEditorProps> = ({ data, onChange }) => {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleCellClick = (row: number, col: number) => {
    const key = `${row},${col}`;
    if (selectedCell === key) {
      setEditingCell(key);
      setEditValue(data.cells[key]?.value || '');
    } else {
      setSelectedCell(key);
      setEditingCell(null);
    }
  };

  const handleCellChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleCellBlur = () => {
    if (editingCell) {
      const newCells = { ...data.cells };
      if (editValue.trim() === '') {
        delete newCells[editingCell];
      } else {
        newCells[editingCell] = { ...newCells[editingCell], value: editValue };
      }
      onChange({ ...data, cells: newCells });
      setEditingCell(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellBlur();
    }
  };

  const getColumnLabel = (col: number) => {
    let label = '';
    let c = col;
    while (c >= 0) {
      label = String.fromCharCode(65 + (c % 26)) + label;
      c = Math.floor(c / 26) - 1;
    }
    return label;
  };

  const toggleBold = () => {
    if (!selectedCell) return;
    const newCells = { ...data.cells };
    const cell = newCells[selectedCell] || { value: '' };
    newCells[selectedCell] = { ...cell, bold: !cell.bold };
    onChange({ ...data, cells: newCells });
  };

  const toggleItalic = () => {
    if (!selectedCell) return;
    const newCells = { ...data.cells };
    const cell = newCells[selectedCell] || { value: '' };
    newCells[selectedCell] = { ...cell, italic: !cell.italic };
    onChange({ ...data, cells: newCells });
  };

  const addRow = () => onChange({ ...data, rowCount: data.rowCount + 1 });
  const addCol = () => onChange({ ...data, colCount: data.colCount + 1 });

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
      {/* Toolbar */}
      <div className="sticky top-0 z-30 flex items-center space-x-2 p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-t-xl">
        <button onClick={toggleBold} className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${data.cells[selectedCell || '']?.bold ? 'bg-slate-200 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
          <span className="material-icons-round text-[18px] font-bold">format_bold</span>
        </button>
        <button onClick={toggleItalic} className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${data.cells[selectedCell || '']?.italic ? 'bg-slate-200 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
          <span className="material-icons-round text-[18px] italic">format_italic</span>
        </button>
        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>
        <button onClick={addRow} className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium flex items-center text-slate-600 dark:text-slate-400">
          <span className="material-icons-round text-[16px] mr-1">add</span> Row
        </button>
        <button onClick={addCol} className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium flex items-center text-slate-600 dark:text-slate-400">
          <span className="material-icons-round text-[16px] mr-1">add</span> Col
        </button>
      </div>

      {/* Formula Bar */}
      <div className="sticky top-[44px] z-30 flex items-center px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="w-10 text-center font-mono text-sm text-slate-500 font-medium border-r border-slate-200 dark:border-slate-700 mr-3 pr-3">
          {selectedCell ? `${getColumnLabel(parseInt(selectedCell.split(',')[1]))}${parseInt(selectedCell.split(',')[0]) + 1}` : ''}
        </div>
        <input 
          type="text" 
          className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400"
          placeholder="fx"
          value={selectedCell && !editingCell ? (data.cells[selectedCell]?.value || '') : editValue}
          onChange={(e) => {
            if (selectedCell) {
              setEditingCell(selectedCell);
              setEditValue(e.target.value);
            }
          }}
          onBlur={handleCellBlur}
          onKeyDown={handleKeyDown}
          disabled={!selectedCell}
        />
      </div>

      {/* Grid */}
      <div className="flex-1 bg-slate-100 dark:bg-slate-950 rounded-b-xl">
        <table className="border-collapse bg-white dark:bg-slate-900 min-w-max">
          <thead>
            <tr>
              <th className="w-10 h-8 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 sticky top-[80px] left-0 z-40 shadow-sm"></th>
              {Array.from({ length: data.colCount }).map((_, col) => (
                <th key={col} className="w-24 h-8 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 sticky top-[80px] z-30 select-none shadow-sm">
                  {getColumnLabel(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: data.rowCount }).map((_, row) => (
              <tr key={row}>
                <td className="w-10 h-8 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400 text-center sticky left-0 z-10 select-none">
                  {row + 1}
                </td>
                {Array.from({ length: data.colCount }).map((_, col) => {
                  const key = `${row},${col}`;
                  const cell = data.cells[key];
                  const isSelected = selectedCell === key;
                  const isEditing = editingCell === key;

                  return (
                    <td 
                      key={col} 
                      className={`relative w-24 h-8 border border-slate-200 dark:border-slate-700 p-0 cursor-cell
                        ${isSelected ? 'ring-2 ring-indigo-500 z-10' : ''}
                      `}
                      onClick={() => handleCellClick(row, col)}
                    >
                      {isEditing ? (
                        <input
                          autoFocus
                          type="text"
                          className="absolute inset-0 w-full h-full px-1.5 bg-white dark:bg-slate-900 border-none outline-none text-sm text-slate-800 dark:text-slate-200"
                          value={editValue}
                          onChange={handleCellChange}
                          onBlur={handleCellBlur}
                          onKeyDown={handleKeyDown}
                        />
                      ) : (
                        <div 
                          className={`w-full h-full px-1.5 flex items-center text-sm overflow-hidden whitespace-nowrap text-slate-800 dark:text-slate-200
                            ${cell?.bold ? 'font-bold' : ''}
                            ${cell?.italic ? 'italic' : ''}
                          `}
                        >
                          {cell?.value || ''}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SheetEditor;
