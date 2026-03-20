
import React, { useState, useEffect, useCallback } from 'react';
import { Note, User } from './types';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';

const DEFAULT_USER: User = {
  id: 'guest-user',
  email: 'guest@mynote.app',
  name: 'Guest'
};

const App: React.FC = () => {
  const [user] = useState<User>(() => {
    const saved = localStorage.getItem('mynote_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('mynote_notes');
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState<'light' | 'dark' | 'dim'>(() => {
    const saved = localStorage.getItem('mynote_theme');
    if (saved === 'dark' || saved === 'light' || saved === 'dim') return saved as 'light' | 'dark' | 'dim';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [customTags, setCustomTags] = useState<string[]>(() => {
    const saved = localStorage.getItem('mynote_tags');
    return saved ? JSON.parse(saved) : ['Work', 'Personal', 'Ideas', 'Urgent', 'Draft'];
  });

  const [activeNote, setActiveNote] = useState<Note | null>(null);
  
  // State for Custom Delete Modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Theme application
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark', 'dim');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'dim') {
      root.classList.add('dark', 'dim');
    }
    localStorage.setItem('mynote_theme', theme);
  }, [theme]);

  // Notes persistence
  useEffect(() => {
    localStorage.setItem('mynote_notes', JSON.stringify(notes));
  }, [notes]);

  // Tags persistence
  useEffect(() => {
    localStorage.setItem('mynote_tags', JSON.stringify(customTags));
  }, [customTags]);

  const handleAddNote = (initialTag?: string, type: 'text' | 'image' | 'slide' | 'diagram' | 'table' | 'sheet' = 'text') => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      type,
      slides: type === 'slide' ? [''] : undefined,
      diagramData: type === 'diagram' ? { id: 'root', text: 'Root Node', children: [] } : undefined,
      tableData: type === 'table' ? { cells: [['Column 1', 'Column 2'], ['', '']] } : undefined,
      sheetData: type === 'sheet' ? { cells: {}, rowCount: 10, colCount: 5 } : undefined,
      tags: initialTag && initialTag !== 'All' ? [initialTag] : ['Draft'],
      updatedAt: Date.now(),
      createdAt: Date.now(),
      userId: user.id
    };
    setActiveNote(newNote);
  };

  const handleAddTag = (newTag: string) => {
    if (newTag && !customTags.includes(newTag)) {
      setCustomTags(prev => [...prev, newTag]);
    }
  };

  const handleSaveNote = useCallback((updatedNote: Note) => {
    setNotes(prevNotes => {
      const existsIndex = prevNotes.findIndex(n => n.id === updatedNote.id);
      if (existsIndex !== -1) {
        const newNotes = [...prevNotes];
        newNotes[existsIndex] = updatedNote;
        return newNotes;
      } else {
        return [updatedNote, ...prevNotes];
      }
    });
  }, []);

  // Trigger the custom modal instead of window.confirm
  const handleDeleteRequest = (id: string) => {
    setDeleteId(id);
  };

  // Actually delete the note
  const executeDelete = () => {
    if (deleteId) {
      setNotes(prev => prev.filter(n => n.id !== deleteId));
      setDeleteId(null);
    }
  };

  const handleCloseEditor = () => {
    setActiveNote(null);
  };

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="flex-1 overflow-hidden relative flex flex-col min-h-0">
        {activeNote ? (
          <Editor 
            note={activeNote} 
            onSave={handleSaveNote} 
            onBack={handleCloseEditor}
            availableTags={customTags}
          />
        ) : (
          <Dashboard 
            notes={notes}
            onAddNote={handleAddNote}
            onEditNote={setActiveNote}
            onDeleteNote={handleDeleteRequest}
            setTheme={setTheme}
            currentTheme={theme}
            availableTags={customTags}
            onAddTag={handleAddTag}
          />
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-slate-100 dark:border-slate-800 scale-100 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <span className="material-icons-round text-3xl">delete_forever</span>
            </div>
            <h3 className="text-xl font-bold text-center text-slate-800 dark:text-white mb-2">Delete Note?</h3>
            <p className="text-center text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Are you sure you want to delete this note? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-600/30 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
