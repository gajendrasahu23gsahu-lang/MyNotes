
import React, { useState, useMemo } from 'react';
import { Note, NoteTag } from '../types';
import { Icons, TAG_COLORS } from '../constants';

interface DashboardProps {
  notes: Note[];
  onAddNote: () => void;
  onEditNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  toggleTheme: () => void;
  currentTheme: 'light' | 'dark';
}

const Dashboard: React.FC<DashboardProps> = ({ 
  notes, onAddNote, onEditNote, onDeleteNote, toggleTheme, currentTheme 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<NoteTag | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredNotes = useMemo(() => {
    return notes
      .filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              note.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = activeTag === 'All' || note.tags.includes(activeTag as NoteTag);
        return matchesSearch && matchesTag;
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, searchQuery, activeTag]);

  // Comprehensive tag list from types
  const tags: (NoteTag | 'All')[] = ['All', 'Work', 'Personal', 'Ideas', 'Urgent', 'Draft'];

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="p-4 sm:p-6 pb-2 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <span className="material-icons-round">edit_note</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">MyNote</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleTheme}
              title="Toggle Dark Mode"
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
              {currentTheme === 'light' ? <Icons.Dark /> : <Icons.Light />}
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <Icons.Search />
            </div>
            <input 
              type="text" 
              placeholder="Search your thoughts..."
              className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white outline-none shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <span className="material-icons-round text-sm">cancel</span>
              </button>
            )}
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  activeTag === tag 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105' 
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main View Toggle & Count */}
      <div className="px-4 sm:px-6 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{filteredNotes.length} Notes</span>
          {activeTag !== 'All' && (
             <span className="text-[10px] px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full font-bold uppercase">{activeTag}</span>
          )}
        </div>
        <button 
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors"
        >
          {viewMode === 'grid' ? <Icons.List /> : <Icons.Grid />}
        </button>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 pb-24 scrollbar-hide">
        {filteredNotes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4 animate-in fade-in duration-700">
            <span className="material-icons-round text-7xl text-slate-300 dark:text-slate-700">auto_awesome_motion</span>
            <div>
               <p className="text-slate-600 dark:text-slate-400 font-bold">Nothing found here</p>
               <p className="text-slate-400 dark:text-slate-500 text-sm">Try searching for something else or add a new note.</p>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
            {filteredNotes.map(note => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onClick={() => onEditNote(note)}
                onDelete={() => onDeleteNote(note.id)}
                onTagClick={(tag) => setActiveTag(tag)}
                isList={viewMode === 'list'}
              />
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      <button 
        onClick={onAddNote}
        className="fixed right-6 bottom-24 w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-600/40 hover:scale-110 active:scale-95 transition-all z-20 group"
      >
        <span className="material-icons-round text-3xl group-hover:rotate-180 transition-transform duration-500">add</span>
      </button>
    </div>
  );
};

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onDelete: () => void;
  onTagClick: (tag: NoteTag) => void;
  isList?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onClick, onDelete, onTagClick, isList }) => {
  return (
    <div 
      className={`group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden cursor-pointer transition-all hover:border-indigo-500/50 dark:hover:border-indigo-400/30 hover:shadow-xl relative active:scale-[0.98] ${isList ? 'p-4 flex items-center' : 'p-5'}`}
      onClick={onClick}
    >
      <div className={isList ? "flex-1 mr-4 overflow-hidden" : "mb-3"}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white truncate pr-6">
            {note.title || <span className="text-slate-300 dark:text-slate-700 italic font-normal">Untitled Note</span>}
          </h3>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-all ${isList ? 'ml-2' : 'absolute top-4 right-4'}`}
          >
            <Icons.Delete />
          </button>
        </div>
        <p className={`text-slate-500 dark:text-slate-400 text-sm overflow-hidden leading-relaxed ${isList ? 'line-clamp-1' : 'line-clamp-3'}`}>
          {note.content || <span className="text-slate-300 dark:text-slate-700 italic">No content...</span>}
        </p>
      </div>
      
      <div className={`flex flex-wrap gap-2 items-center justify-between ${isList ? 'flex-shrink-0 flex-col items-end gap-1' : 'mt-4 pt-4 border-t border-slate-50 dark:border-slate-800/50'}`}>
        <div className="flex flex-wrap gap-1">
          {note.tags.map(tag => (
            <span 
              key={tag} 
              onClick={(e) => { e.stopPropagation(); onTagClick(tag); }}
              className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider transition-transform hover:scale-110 active:scale-90 ${TAG_COLORS[tag]}`}
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          {new Date(note.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
};

export default Dashboard;
