import React, { useCallback } from 'react';
import { TableData } from '../types';

interface TableEditorProps {
  data: TableData;
  onChange: (data: TableData) => void;
}

const TableEditor: React.FC<TableEditorProps> = ({ data, onChange }) => {
  const updateCell = useCallback((rowIndex: number, colIndex: number, value: string) => {
    const newCells = data.cells.map((row, rIdx) =>
      rIdx === rowIndex ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell)) : row
    );
    onChange({ cells: newCells });
  }, [data, onChange]);

  const addRow = useCallback(() => {
    const colCount = data.cells[0]?.length || 2;
    const newRow = Array(colCount).fill('');
    onChange({ cells: [...data.cells, newRow] });
  }, [data, onChange]);

  const addColumn = useCallback(() => {
    const newCells = data.cells.map(row => [...row, '']);
    onChange({ cells: newCells });
  }, [data, onChange]);

  const removeRow = useCallback((rowIndex: number) => {
    if (data.cells.length <= 1) return;
    const newCells = data.cells.filter((_, idx) => idx !== rowIndex);
    onChange({ cells: newCells });
  }, [data, onChange]);

  const removeColumn = useCallback((colIndex: number) => {
    if ((data.cells[0]?.length || 0) <= 1) return;
    const newCells = data.cells.map(row => row.filter((_, idx) => idx !== colIndex));
    onChange({ cells: newCells });
  }, [data, onChange]);

  return (
    <div className="flex-1 pb-4">
      <div className="inline-block min-w-full align-middle">
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-clip bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full border-collapse text-left">
            <thead>
              {data.cells.length > 0 && (
                <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 group/row sticky top-0 z-20 shadow-sm">
                  {data.cells[0].map((cell, colIndex) => (
                    <th key={colIndex} className="relative p-0 min-w-[150px] font-medium text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 last:border-r-0">
                      <textarea
                        value={cell}
                        onChange={(e) => updateCell(0, colIndex, e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 resize-none outline-none p-3 sm:p-4 text-sm sm:text-base font-semibold placeholder-slate-400 dark:placeholder-slate-500 min-h-[56px]"
                        placeholder={`Header ${colIndex + 1}`}
                        rows={1}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = `${target.scrollHeight}px`;
                        }}
                      />
                      {data.cells[0].length > 1 && (
                        <button
                          onClick={() => removeColumn(colIndex)}
                          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center opacity-0 group-hover/row:opacity-100 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-all"
                          title="Remove Column"
                        >
                          <span className="material-icons-round text-[16px]">close</span>
                        </button>
                      )}
                    </th>
                  ))}
                  <th className="w-12 p-0 border-l border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"></th>
                </tr>
              )}
            </thead>
            <tbody>
              {data.cells.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex + 1} className="border-b border-slate-200 dark:border-slate-700 last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group/row">
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className="relative p-0 border-r border-slate-200 dark:border-slate-700 last:border-r-0">
                      <textarea
                        value={cell}
                        onChange={(e) => updateCell(rowIndex + 1, colIndex, e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 resize-none outline-none p-3 sm:p-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 placeholder-slate-300 dark:placeholder-slate-600 min-h-[56px]"
                        placeholder="..."
                        rows={1}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = `${target.scrollHeight}px`;
                        }}
                      />
                    </td>
                  ))}
                  <td className="w-12 p-0 align-middle border-l border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => removeRow(rowIndex + 1)}
                      className="w-8 h-8 mx-auto flex items-center justify-center opacity-0 group-hover/row:opacity-100 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                      title="Remove Row"
                    >
                      <span className="material-icons-round text-[18px]">delete_outline</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex space-x-3 mt-4">
          <button 
            onClick={addRow} 
            className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 font-medium px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm"
          >
            <span className="material-icons-round text-[18px]">add</span>
            <span>Add Row</span>
          </button>
          <button 
            onClick={addColumn} 
            className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 font-medium px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm"
          >
            <span className="material-icons-round text-[18px]">add</span>
            <span>Add Column</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableEditor;
