
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Note, NoteTag } from '../types';
import { Icons, TAG_COLORS } from '../constants';

interface DashboardProps {
  notes: Note[];
  onAddNote: (initialTag?: string, type?: 'text' | 'image' | 'slide') => void;
  onEditNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'dim') => void;
  currentTheme: 'light' | 'dark' | 'dim';
  availableTags: string[];
  onAddTag: (tag: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  notes, onAddNote, onEditNote, onDeleteNote, setTheme, currentTheme, availableTags, onAddTag 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<NoteTag | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showThemeOptions, setShowThemeOptions] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setShowThemeOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNotes = useMemo(() => {
    return notes
      .filter(note => {
        const plainContent = note.content ? note.content.replace(/<[^>]*>?/gm, '') : '';
        const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              plainContent.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = activeTag === 'All' || note.tags.includes(activeTag as NoteTag);
        return matchesSearch && matchesTag;
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, searchQuery, activeTag]);

  // Comprehensive tag list from types
  const tags: (NoteTag | 'All')[] = ['All', ...availableTags];

  const handleAddNewTag = () => {
    if (newTagInput.trim()) {
      onAddTag(newTagInput.trim());
      setActiveTag(newTagInput.trim());
      setNewTagInput('');
      setIsAddingTag(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="p-4 sm:p-6 pb-2 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <span className="material-icons-round">edit_note</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">MyNote</h1>
          </div>
          <div className="flex items-center space-x-2 relative" ref={menuRef}>
            <button 
              onClick={() => { setIsMenuOpen(!isMenuOpen); setShowThemeOptions(false); }}
              title="Menu"
              className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90"
            >
              <span className="material-icons-round">more_vert</span>
            </button>
            
            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2 space-y-1">
                  {!showThemeOptions ? (
                    <>
                      <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Menu</div>
                      <button 
                        onClick={() => setShowThemeOptions(true)}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="material-icons-round text-lg">
                            {currentTheme === 'light' ? 'light_mode' : currentTheme === 'dark' ? 'dark_mode' : 'brightness_medium'}
                          </span>
                          <span>Theme</span>
                        </div>
                        <span className="material-icons-round text-sm">chevron_right</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => setShowThemeOptions(false)}
                        className="w-full text-left px-3 py-2 text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] flex items-center space-x-1 hover:text-indigo-600 transition-colors"
                      >
                        <span className="material-icons-round text-sm">chevron_left</span>
                        <span>Back</span>
                      </button>
                      <button 
                        onClick={() => { setTheme('light'); setIsMenuOpen(false); setShowThemeOptions(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-3 transition-colors ${currentTheme === 'light' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                      >
                        <span className="material-icons-round text-lg">light_mode</span>
                        <span>Light Mode</span>
                      </button>
                      <button 
                        onClick={() => { setTheme('dark'); setIsMenuOpen(false); setShowThemeOptions(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-3 transition-colors ${currentTheme === 'dark' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                      >
                        <span className="material-icons-round text-lg">dark_mode</span>
                        <span>Dark Mode</span>
                      </button>
                      <button 
                        onClick={() => { setTheme('dim'); setIsMenuOpen(false); setShowThemeOptions(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-3 transition-colors ${currentTheme === 'dim' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                      >
                        <span className="material-icons-round text-lg">brightness_medium</span>
                        <span>Dim Mode</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
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
          <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide items-center">
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
            {isAddingTag ? (
              <div className="flex items-center space-x-1 bg-white dark:bg-slate-900 border border-indigo-500 rounded-xl px-2 py-1">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNewTag()}
                  placeholder="New tag..."
                  className="w-24 bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-300"
                  autoFocus
                  onBlur={() => {
                    if (!newTagInput.trim()) setIsAddingTag(false);
                  }}
                />
                <button onClick={handleAddNewTag} className="text-indigo-500 hover:text-indigo-600">
                  <span className="material-icons-round text-sm">check</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingTag(true)}
                className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center"
                title="Add new category"
              >
                <Icons.Add />
              </button>
            )}
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
      <div className="fixed right-6 bottom-8 z-20 flex flex-col items-end space-y-3">
        {/* FAB Menu Items */}
        <div className={`flex flex-col items-end space-y-3 transition-all duration-300 origin-bottom ${isFabOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8 pointer-events-none'}`}>
          <button 
            onClick={() => {
              setIsFabOpen(false);
              onAddNote(activeTag !== 'All' ? activeTag : undefined, 'text');
            }}
            className="flex items-center space-x-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-sm font-medium">Text Note</span>
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center">
              <span className="material-icons-round text-xl">notes</span>
            </div>
          </button>
          
          <button 
            onClick={() => {
              setIsFabOpen(false);
              onAddNote(activeTag !== 'All' ? activeTag : undefined, 'image');
            }}
            className="flex items-center space-x-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-sm font-medium">Image</span>
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
              <span className="material-icons-round text-xl">image</span>
            </div>
          </button>

          <button 
            onClick={() => {
              setIsFabOpen(false);
              onAddNote(activeTag !== 'All' ? activeTag : undefined, 'slide');
            }}
            className="flex items-center space-x-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-sm font-medium">Slide</span>
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center">
              <span className="material-icons-round text-xl">slideshow</span>
            </div>
          </button>

          <button 
            onClick={() => {
              setIsFabOpen(false);
              onAddNote(activeTag !== 'All' ? activeTag : undefined, 'diagram');
            }}
            className="flex items-center space-x-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-sm font-medium">Structure</span>
            <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 rounded-full flex items-center justify-center">
              <span className="material-icons-round text-xl">account_tree</span>
            </div>
          </button>

          <button 
            onClick={() => {
              setIsFabOpen(false);
              onAddNote(activeTag !== 'All' ? activeTag : undefined, 'table');
            }}
            className="flex items-center space-x-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-sm font-medium">Table</span>
            <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 rounded-full flex items-center justify-center">
              <span className="material-icons-round text-xl">grid_on</span>
            </div>
          </button>

          <button 
            onClick={() => {
              setIsFabOpen(false);
              onAddNote(activeTag !== 'All' ? activeTag : undefined, 'sheet');
            }}
            className="flex items-center space-x-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-sm font-medium">Sheet</span>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
              <span className="material-icons-round text-xl">table_chart</span>
            </div>
          </button>
        </div>

        {/* Main FAB Button */}
        <button 
          onClick={() => setIsFabOpen(!isFabOpen)}
          className={`w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-600/40 hover:scale-110 active:scale-95 transition-all duration-300 ${isFabOpen ? 'rotate-45 bg-slate-800 dark:bg-slate-700' : ''}`}
        >
          <span className="material-icons-round text-2xl">add</span>
        </button>
      </div>
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const startPress = () => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      onDelete();
    }, 600); // 600ms for long press
  };

  const cancelPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isLongPress.current) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    onClick();
  };

  return (
    <div 
      className={`group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden cursor-pointer transition-all hover:border-indigo-500/50 dark:hover:border-indigo-400/30 hover:shadow-xl relative active:scale-[0.98] select-none flex flex-col ${isList ? 'p-4 flex-row items-center' : ''}`}
      onClick={handleClick}
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onTouchMove={cancelPress}
      onContextMenu={(e) => {
        e.preventDefault();
        onDelete();
      }}
    >
      {note.type === 'image' && note.imageUrl && !isList && (
        <div className="w-full h-32 bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <img src={note.imageUrl} alt="Note preview" className="w-full h-full object-cover" />
        </div>
      )}
      
      {note.type === 'slide' && !isList && (
        <div className="w-full h-32 bg-indigo-50 dark:bg-indigo-900/20 flex flex-col items-center justify-center p-4 text-center border-b border-slate-100 dark:border-slate-800">
          <span className="material-icons-round text-indigo-300 dark:text-indigo-700 mb-2">slideshow</span>
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 line-clamp-2">
            {note.slides?.[0] || 'Empty Slide'}
          </p>
        </div>
      )}

      {note.type === 'diagram' && !isList && (
        <div className="w-full h-32 bg-pink-50 dark:bg-pink-900/20 flex flex-col items-center justify-center p-4 text-center border-b border-slate-100 dark:border-slate-800">
          <span className="material-icons-round text-pink-300 dark:text-pink-700 mb-2">account_tree</span>
          <p className="text-sm font-medium text-pink-600 dark:text-pink-400 line-clamp-2">
            {note.diagramData?.text || 'Empty Structure'}
          </p>
        </div>
      )}

      {note.type === 'table' && !isList && (
        <div className="w-full h-32 bg-cyan-50 dark:bg-cyan-900/20 flex flex-col items-center justify-center p-4 text-center border-b border-slate-100 dark:border-slate-800">
          <span className="material-icons-round text-cyan-300 dark:text-cyan-700 mb-2">grid_on</span>
          <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400 line-clamp-2">
            {note.tableData?.cells.length || 0}x{note.tableData?.cells[0]?.length || 0} Table
          </p>
        </div>
      )}

      {note.type === 'sheet' && !isList && (
        <div className="w-full h-32 bg-green-50 dark:bg-green-900/20 flex flex-col items-center justify-center p-4 text-center border-b border-slate-100 dark:border-slate-800">
          <span className="material-icons-round text-green-300 dark:text-green-700 mb-2">table_chart</span>
          <p className="text-sm font-medium text-green-600 dark:text-green-400 line-clamp-2">
            {note.sheetData?.rowCount || 0}x{note.sheetData?.colCount || 0} Sheet
          </p>
        </div>
      )}

      <div className={isList ? "flex-1 mr-4 overflow-hidden" : "p-5 flex-1 flex flex-col"}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white truncate pr-6 flex items-center gap-2">
            {note.type === 'image' && <span className="material-icons-round text-sm text-emerald-500">image</span>}
            {note.type === 'slide' && <span className="material-icons-round text-sm text-amber-500">slideshow</span>}
            {note.type === 'diagram' && <span className="material-icons-round text-sm text-pink-500">account_tree</span>}
            {note.type === 'table' && <span className="material-icons-round text-sm text-cyan-500">grid_on</span>}
            {note.type === 'sheet' && <span className="material-icons-round text-sm text-green-500">table_chart</span>}
            {note.title || <span className="text-slate-300 dark:text-slate-700 italic font-normal">Untitled Note</span>}
          </h3>
        </div>
        <p className={`text-slate-500 dark:text-slate-400 text-sm overflow-hidden leading-relaxed ${isList ? 'line-clamp-1' : 'line-clamp-3'}`}>
          {note.type === 'slide' 
            ? `${note.slides?.length || 0} slides` 
            : note.type === 'diagram'
            ? `${note.diagramData?.children?.length || 0} branches`
            : note.type === 'table'
            ? `${note.tableData?.cells.length || 0} rows, ${note.tableData?.cells[0]?.length || 0} columns`
            : note.type === 'sheet'
            ? `${note.sheetData?.rowCount || 0} rows, ${note.sheetData?.colCount || 0} columns`
            : (note.content ? note.content.replace(/<[^>]*>?/gm, '') : <span className="text-slate-300 dark:text-slate-700 italic">No content...</span>)}
        </p>
      </div>
      
      <div className={`flex flex-wrap gap-2 items-center justify-between ${isList ? 'flex-shrink-0 flex-col items-end gap-1' : 'px-5 pb-5 mt-auto pt-4 border-t border-slate-50 dark:border-slate-800/50'}`}>
        <div className="flex flex-wrap gap-1">
          {note.tags.map(tag => (
            <span 
              key={tag} 
              onClick={(e) => { e.stopPropagation(); onTagClick(tag); }}
              className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider transition-transform hover:scale-110 active:scale-90 ${TAG_COLORS[tag] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}
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
