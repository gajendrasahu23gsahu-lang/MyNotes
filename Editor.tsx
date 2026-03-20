
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Note, NoteTag, DiagramNode, TableData, SheetData } from '../types';
import { Icons, TAG_COLORS } from '../constants';
import DiagramEditor from './DiagramEditor';
import TableEditor from './TableEditor';
import SheetEditor from './SheetEditor';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface EditorProps {
  note: Note;
  onSave: (updatedNote: Note) => void;
  onBack: () => void;
  availableTags: string[];
}

const Editor: React.FC<EditorProps> = ({ note, onSave, onBack, availableTags }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState<NoteTag[]>(note.tags);
  const [imageUrl, setImageUrl] = useState(note.imageUrl || '');
  const [slides, setSlides] = useState<string[]>(note.slides || ['']);
  const [diagramData, setDiagramData] = useState<DiagramNode>(note.diagramData || { id: 'root', text: 'Main Topic', children: [] });
  const [tableData, setTableData] = useState<TableData>(note.tableData || { cells: [['Column 1', 'Column 2'], ['', '']] });
  const [sheetData, setSheetData] = useState<SheetData>(note.sheetData || { cells: {}, rowCount: 10, colCount: 5 });
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<number>(note.updatedAt);
  
  const initialLoad = useRef(true);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && (!note.type || note.type === 'text')) {
      editorRef.current.innerHTML = note.content;
    }
  }, []);

  const handleSave = useCallback(() => {
    setIsSaving(true);
    const updatedNote: Note = {
      ...note,
      title,
      content,
      tags,
      imageUrl: note.type === 'image' ? imageUrl : undefined,
      slides: note.type === 'slide' ? slides : undefined,
      diagramData: note.type === 'diagram' ? diagramData : undefined,
      tableData: note.type === 'table' ? tableData : undefined,
      sheetData: note.type === 'sheet' ? sheetData : undefined,
      updatedAt: Date.now()
    };
    onSave(updatedNote);
    setLastSaved(Date.now());
    setTimeout(() => setIsSaving(false), 800);
  }, [title, content, tags, imageUrl, slides, diagramData, tableData, sheetData, note, onSave]);

  // Auto-save logic - refined to be more responsive
  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      const hasChanges = 
        title !== note.title || 
        content !== note.content || 
        JSON.stringify(tags) !== JSON.stringify(note.tags) ||
        imageUrl !== (note.imageUrl || '') ||
        JSON.stringify(slides) !== JSON.stringify(note.slides || ['']) ||
        JSON.stringify(diagramData) !== JSON.stringify(note.diagramData || { id: 'root', text: 'Main Topic', children: [] }) ||
        JSON.stringify(tableData) !== JSON.stringify(note.tableData || { cells: [['Column 1', 'Column 2'], ['', '']] }) ||
        JSON.stringify(sheetData) !== JSON.stringify(note.sheetData || { cells: {}, rowCount: 10, colCount: 5 });
        
      if (hasChanges) {
        handleSave();
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [title, content, tags, imageUrl, slides, diagramData, tableData, sheetData, note.title, note.content, note.tags, note.imageUrl, note.slides, note.diagramData, note.tableData, note.sheetData, handleSave]);

  const toggleTag = (tag: NoteTag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300 animate-in slide-in-from-bottom-4 duration-500">
      {/* Editor Header */}
      <header className="px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-30 w-full">
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
      <main className={`flex-1 flex flex-col w-full overflow-auto scrollbar-hide ${(!note.type || note.type === 'text' || note.type === 'image' || note.type === 'slide') ? 'max-w-4xl mx-auto' : ''}`}>
        <div className={`flex flex-col p-6 space-y-6 w-full min-h-full ${(!note.type || note.type === 'text' || note.type === 'image' || note.type === 'slide' || note.type === 'diagram') ? '' : 'min-w-max'}`}>
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
                ? `${TAG_COLORS[tag] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'} ring-2 ring-offset-2 ring-indigo-500/20 dark:ring-offset-slate-950` 
                : 'bg-slate-50 dark:bg-slate-900 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {(!note.type || note.type === 'text') && (
          <div className="flex-1 flex flex-col relative">
            <div 
              ref={editorRef}
              contentEditable
              className="flex-1 w-full bg-transparent border-none focus:ring-0 resize-none text-xl text-slate-700 dark:text-slate-300 leading-relaxed outline-none min-h-[300px] empty:before:content-[attr(data-placeholder)] empty:before:text-slate-300 dark:empty:before:text-slate-700 cursor-text [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_b]:font-bold [&_i]:italic [&_u]:underline [&_strike]:line-through"
              data-placeholder="Start typing your thoughts..."
              onInput={(e) => setContent(e.currentTarget.innerHTML)}
            />
            {/* Toolbar */}
            <div className="sticky -bottom-6 -mx-6 px-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-3 flex items-center space-x-2 overflow-x-auto z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] scrollbar-hide mt-auto">
              <select 
                onChange={(e) => {
                  document.execCommand('fontName', false, e.target.value);
                  editorRef.current?.focus();
                }}
                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-3 py-2 text-sm font-medium outline-none border border-slate-200 dark:border-slate-700 min-w-[120px] cursor-pointer"
              >
                <option value="">Default Font</option>
                <option value="Arial" style={{fontFamily: 'Arial'}}>Arial</option>
                <option value="Verdana" style={{fontFamily: 'Verdana'}}>Verdana</option>
                <option value="Times New Roman" style={{fontFamily: 'Times New Roman'}}>Times New Roman</option>
                <option value="Courier New" style={{fontFamily: 'Courier New'}}>Courier New</option>
                <option value="Georgia" style={{fontFamily: 'Georgia'}}>Georgia</option>
                <option value="Palatino" style={{fontFamily: 'Palatino'}}>Palatino</option>
                <option value="Garamond" style={{fontFamily: 'Garamond'}}>Garamond</option>
                <option value="Comic Sans MS" style={{fontFamily: 'Comic Sans MS'}}>Comic Sans</option>
                <option value="Trebuchet MS" style={{fontFamily: 'Trebuchet MS'}}>Trebuchet</option>
                <option value="Impact" style={{fontFamily: 'Impact'}}>Impact</option>
              </select>
              
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 flex-shrink-0"></div>
              
              <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('formatBlock', false, 'H1'); }} className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-lg transition-colors">H1</button>
              <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('formatBlock', false, 'H2'); }} className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-lg transition-colors">H2</button>
              <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('formatBlock', false, 'H3'); }} className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-lg transition-colors">H3</button>
              
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 flex-shrink-0"></div>
              
              <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('bold', false); }} className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-lg transition-colors">B</button>
              <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('italic', false); }} className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 italic text-lg font-serif transition-colors">I</button>
              <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('underline', false); }} className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 underline text-lg transition-colors">U</button>
              <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('strikeThrough', false); }} className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 line-through text-lg transition-colors">S</button>
              
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 flex-shrink-0"></div>
              
              <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('insertUnorderedList', false); }} className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"><span className="material-icons-round text-xl">format_list_bulleted</span></button>
              <button onMouseDown={(e) => { e.preventDefault(); document.execCommand('insertOrderedList', false); }} className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"><span className="material-icons-round text-xl">format_list_numbered</span></button>
              
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 flex-shrink-0"></div>
              
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative overflow-hidden">
                <input 
                  type="color" 
                  onChange={(e) => {
                    document.execCommand('foreColor', false, e.target.value);
                    editorRef.current?.focus();
                  }} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Text Color"
                />
                <span className="material-icons-round text-xl text-slate-700 dark:text-slate-300 pointer-events-none">palette</span>
              </div>
            </div>
          </div>
        )}

        {note.type === 'image' && (
          <div className="flex-1 flex flex-col space-y-4">
            {!imageUrl ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl min-h-[400px] bg-slate-50 dark:bg-slate-900/50">
                <span className="material-icons-round text-6xl text-slate-300 dark:text-slate-700 mb-4">add_photo_alternate</span>
                <label className="px-6 py-3 bg-indigo-600 text-white rounded-xl cursor-pointer hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center space-x-2">
                  <span className="material-icons-round text-xl">photo_library</span>
                  <span>Choose from Gallery</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImageUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                <p className="mt-4 text-sm text-slate-400 font-medium">Select an image from your device</p>
              </div>
            ) : (
              <div className="flex justify-end">
                <label className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium text-sm flex items-center space-x-2">
                  <span className="material-icons-round text-sm">swap_horiz</span>
                  <span>Change Image</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImageUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            )}
            {imageUrl && (
              <div className="mt-4 relative flex-1 min-h-[400px] -mx-6 -mb-6">
                <TransformWrapper initialScale={1} minScale={0.5} maxScale={5} centerOnInit>
                  {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                      <div className="absolute top-4 right-4 z-10 flex space-x-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <button onClick={() => zoomIn()} className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" title="Zoom In"><span className="material-icons-round text-sm">zoom_in</span></button>
                        <button onClick={() => zoomOut()} className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" title="Zoom Out"><span className="material-icons-round text-sm">zoom_out</span></button>
                        <button onClick={() => resetTransform()} className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" title="Reset Zoom"><span className="material-icons-round text-sm">fit_screen</span></button>
                      </div>
                      <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={imageUrl} alt="Note attachment" className="max-w-full max-h-full object-contain" />
                      </TransformComponent>
                    </>
                  )}
                </TransformWrapper>
              </div>
            )}
            <textarea 
              placeholder="Add a caption or notes about this image..."
              className="w-full bg-transparent border-none focus:ring-0 resize-none text-lg text-slate-700 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700 leading-relaxed outline-none min-h-[100px] mt-4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        )}

        {note.type === 'slide' && (
          <div className="flex-1 flex flex-col h-full">
            <div className="flex items-center space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all ${
                    activeSlide === index 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => {
                  setSlides([...slides, '']);
                  setActiveSlide(slides.length);
                }}
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 transition-all font-bold"
              >
                <span className="material-icons-round text-xl">add</span>
              </button>
            </div>
            
            <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 flex flex-col relative min-h-[400px]">
              {slides.length > 1 && (
                <button 
                  onClick={() => {
                    const newSlides = slides.filter((_, i) => i !== activeSlide);
                    setSlides(newSlides);
                    setActiveSlide(Math.max(0, activeSlide - 1));
                  }}
                  className="absolute top-4 right-4 w-8 h-8 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  title="Delete Slide"
                >
                  <span className="material-icons-round text-sm">delete</span>
                </button>
              )}
              <textarea 
                placeholder={`Slide ${activeSlide + 1} content...`}
                className="flex-1 w-full h-full bg-transparent border-none focus:ring-0 resize-none text-2xl sm:text-3xl text-center text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-700 leading-relaxed outline-none flex items-center justify-center"
                value={slides[activeSlide] || ''}
                onChange={(e) => {
                  const newSlides = [...slides];
                  newSlides[activeSlide] = e.target.value;
                  setSlides(newSlides);
                }}
              />
            </div>
          </div>
        )}

        {note.type === 'diagram' && (
          <DiagramEditor data={diagramData} onChange={setDiagramData} />
        )}

        {note.type === 'table' && (
          <TableEditor data={tableData} onChange={setTableData} />
        )}

        {note.type === 'sheet' && (
          <SheetEditor data={sheetData} onChange={setSheetData} />
        )}
        </div>
      </main>
    </div>
  );
};

export default Editor;
