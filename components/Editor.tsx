
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Note, NoteTag } from '../types';
import { Icons, TAG_COLORS } from '../constants';

interface EditorProps {
  note: Note;
  onSave: (updatedNote: Note) => void;
  onBack: () => void;
}

const Editor: React.FC<EditorProps> = ({ note, onSave, onBack }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState<NoteTag[]>(note.tags);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<number>(note.updatedAt);
  
  const initialLoad = useRef(true);

  const handleSave = useCallback(() => {
    setIsSaving(true);
    const updatedNote: Note = {
      ...note,
      title,
      content,
      tags,
      updatedAt: Date.now()
    };
    onSave(updatedNote);
    setLastSaved(Date.now());
    setTimeout(() => setIsSaving(false), 800);
  }, [title, content, tags, note, onSave]);

  // Auto-save logic - refined to be more responsive
  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      const hasChanges = title !== note.title || content !== note.content || JSON.stringify(tags) !== JSON.stringify(note.tags);
      if (hasChanges) {
        handleSave();
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [title, content, tags, note.title, note.content, note.tags, handleSave]);

  const toggleTag = (tag: NoteTag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const availableTags: NoteTag[] = ['Work', 'Personal', 'Ideas', 'Urgent', 'Draft'];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 transition-colors duration-300 animate-in slide-in-from-bottom-4 duration-500">
      {/* Editor Header */}
      <header className="px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => { handleSave(); onBack(); }}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all active:scale-90"
          >
            <Icons.Back />
          </button>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em] leading-none mb-0.5">Cloud Sync</span>
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
              {isSaving ? 'Synchronizing...' : `Saved ${new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
            </span>
          </div>
        </div>
        <button 
          onClick={() => { handleSave(); onBack(); }}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all"
        >
          Finish
        </button>
      </header>

      {/* Editor Body */}
      <main className="flex-1 flex flex-col p-6 space-y-6 max-w-4xl mx-auto w-full overflow-y-auto scrollbar-hide">
        <input 
          type="text"
          placeholder="Note Title"
          className="text-4xl sm:text-5xl font-black bg-transparent border-none focus:ring-0 placeholder:text-slate-100 dark:placeholder:text-slate-900 dark:text-white w-full outline-none transition-all"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="flex items-center space-x-3 py-3 overflow-x-auto scrollbar-hide border-y border-slate-50 dark:border-slate-900/50">
          <div className="flex items-center text-slate-300 dark:text-slate-700 mr-1">
            <span className="material-icons-round text-lg">sell</span>
          </div>
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-90 ${
                tags.includes(tag) 
                ? `${TAG_COLORS[tag]} ring-2 ring-offset-2 ring-indigo-500/20 dark:ring-offset-slate-950` 
                : 'bg-slate-50 dark:bg-slate-900 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <textarea 
          placeholder="Start typing your thoughts..."
          className="flex-1 w-full bg-transparent border-none focus:ring-0 resize-none text-xl text-slate-700 dark:text-slate-300 placeholder:text-slate-100 dark:placeholder:text-slate-900 leading-relaxed outline-none min-h-[300px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </main>
    </div>
  );
};

export default Editor;
