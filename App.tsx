
import React, { useState, useEffect, useCallback } from 'react';
import { Note, User } from './types';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import { BannerAd, InterstitialAd } from './components/AdPlaceholders';

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

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('mynote_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [showInterstitial, setShowInterstitial] = useState(false);

  // Theme application
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('mynote_theme', theme);
  }, [theme]);

  // Notes persistence
  useEffect(() => {
    localStorage.setItem('mynote_notes', JSON.stringify(notes));
  }, [notes]);

  // Global 60-second Interstitial Ad Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setShowInterstitial(true);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      tags: ['Draft'],
      updatedAt: Date.now(),
      createdAt: Date.now(),
      userId: user.id
    };
    setActiveNote(newNote);
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

  const handleDeleteNote = (id: string) => {
    if (confirm("Delete this note permanently?")) {
      setNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleCloseEditor = () => {
    setActiveNote(null);
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="flex-1 overflow-hidden relative">
        {activeNote ? (
          <Editor 
            note={activeNote} 
            onSave={handleSaveNote} 
            onBack={handleCloseEditor}
          />
        ) : (
          <Dashboard 
            notes={notes}
            onAddNote={handleAddNote}
            onEditNote={setActiveNote}
            onDeleteNote={handleDeleteNote}
            toggleTheme={toggleTheme}
            currentTheme={theme}
          />
        )}
      </div>
      
      {!activeNote && <BannerAd />}

      <InterstitialAd 
        isOpen={showInterstitial} 
        onClose={() => setShowInterstitial(false)} 
      />
    </div>
  );
};

export default App;
