import React, { useCallback } from 'react';
import { DiagramNode } from '../types';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface DiagramEditorProps {
  data: DiagramNode;
  onChange: (data: DiagramNode) => void;
}

const DiagramNodeEditor: React.FC<{
  node: DiagramNode;
  path: number[];
  onUpdate: (path: number[], newText: string) => void;
  onAddChild: (path: number[]) => void;
  onAddSibling: (path: number[], direction: 'left' | 'right') => void;
  onRemove: (path: number[]) => void;
  isRoot?: boolean;
}> = ({ node, path, onUpdate, onAddChild, onAddSibling, onRemove, isRoot }) => {
  return (
    <div className="flex flex-col items-center">
      {/* The Node itself */}
      <div className="relative flex flex-col items-center z-10 group">
        <div className="flex items-center relative">
          {!isRoot && (
            <button
              onClick={() => onAddSibling(path, 'left')}
              className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all z-20"
              title="Add Left Sibling"
            >
              <span className="material-icons-round text-sm">add</span>
            </button>
          )}
          
          <input
            type="text"
            value={node.text}
            onChange={(e) => onUpdate(path, e.target.value)}
            placeholder={isRoot ? "Main Topic" : "Subtopic"}
            className={`px-4 py-2 bg-white dark:bg-slate-900 border ${isRoot ? 'border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-500/20' : 'border-slate-200 dark:border-slate-700'} rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none min-w-[150px] text-center text-slate-800 dark:text-slate-200 font-medium transition-all relative z-10`}
          />

          {!isRoot && (
            <button
              onClick={() => onAddSibling(path, 'right')}
              className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all z-20"
              title="Add Right Sibling"
            >
              <span className="material-icons-round text-sm">add</span>
            </button>
          )}

          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 z-20">
            <button
              onClick={() => onAddChild(path)}
              className="w-8 h-8 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shadow-sm"
              title="Add Child"
            >
              <span className="material-icons-round text-sm">add</span>
            </button>
            {!isRoot && (
              <button
                onClick={() => onRemove(path)}
                className="w-8 h-8 flex items-center justify-center bg-red-50 dark:bg-red-900/30 text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors shadow-sm"
                title="Remove Node"
              >
                <span className="material-icons-round text-sm">delete</span>
              </button>
            )}
          </div>
        </div>

        {/* Line going to children */}
        {node.children && node.children.length > 0 && (
          <div className="w-px h-10 bg-slate-300 dark:bg-slate-600"></div>
        )}
      </div>
      
      {/* Children */}
      {node.children && node.children.length > 0 && (
        <div className="flex flex-row justify-center items-start">
          {node.children.map((child, index) => {
            const isFirst = index === 0;
            const isLast = index === node.children.length - 1;
            const isOnly = node.children.length === 1;

            return (
              <div key={child.id} className="relative flex flex-col items-center px-2 sm:px-6 pt-6">
                {/* Horizontal connection lines */}
                {!isOnly && (
                  <>
                    {!isFirst && (
                      <div className="absolute top-0 left-0 w-1/2 h-px bg-slate-300 dark:bg-slate-600"></div>
                    )}
                    {!isLast && (
                      <div className="absolute top-0 right-0 w-1/2 h-px bg-slate-300 dark:bg-slate-600"></div>
                    )}
                  </>
                )}
                
                {/* Vertical line to child */}
                <div className="absolute top-0 left-1/2 w-px h-6 bg-slate-300 dark:bg-slate-600 -translate-x-1/2"></div>
                
                <DiagramNodeEditor
                  node={child}
                  path={[...path, index]}
                  onUpdate={onUpdate}
                  onAddChild={onAddChild}
                  onAddSibling={onAddSibling}
                  onRemove={onRemove}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const DiagramEditor: React.FC<DiagramEditorProps> = ({ data, onChange }) => {
  const handleUpdate = useCallback((path: number[], newText: string) => {
    const newData = JSON.parse(JSON.stringify(data));
    let current = newData;
    for (let i = 0; i < path.length; i++) {
      current = current.children[path[i]];
    }
    current.text = newText;
    onChange(newData);
  }, [data, onChange]);

  const handleAddChild = useCallback((path: number[]) => {
    const newData = JSON.parse(JSON.stringify(data));
    let current = newData;
    for (let i = 0; i < path.length; i++) {
      current = current.children[path[i]];
    }
    if (!current.children) {
      current.children = [];
    }
    current.children.push({
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      text: '',
      children: []
    });
    onChange(newData);
  }, [data, onChange]);

  const handleAddSibling = useCallback((path: number[], direction: 'left' | 'right') => {
    if (path.length === 0) return; // Cannot add sibling to root
    const newData = JSON.parse(JSON.stringify(data));
    let parent = newData;
    for (let i = 0; i < path.length - 1; i++) {
      parent = parent.children[path[i]];
    }
    
    const targetIndex = path[path.length - 1];
    const insertIndex = direction === 'left' ? targetIndex : targetIndex + 1;
    
    if (!parent.children) parent.children = [];
    parent.children.splice(insertIndex, 0, {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      text: '',
      children: []
    });
    onChange(newData);
  }, [data, onChange]);

  const handleRemove = useCallback((path: number[]) => {
    if (path.length === 0) return; // Cannot remove root
    const newData = JSON.parse(JSON.stringify(data));
    let current = newData;
    for (let i = 0; i < path.length - 1; i++) {
      current = current.children[path[i]];
    }
    current.children.splice(path[path.length - 1], 1);
    onChange(newData);
  }, [data, onChange]);

  return (
    <div className="flex-1 relative overflow-hidden bg-transparent min-h-[400px] -mx-6 -mb-6">
      <TransformWrapper 
        initialScale={1} 
        minScale={0.2} 
        maxScale={3} 
        centerOnInit 
        panning={{ excluded: ['input', 'button'] }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute top-4 right-4 z-10 flex space-x-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
              <button onClick={() => zoomIn()} className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" title="Zoom In"><span className="material-icons-round text-sm">zoom_in</span></button>
              <button onClick={() => zoomOut()} className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" title="Zoom Out"><span className="material-icons-round text-sm">zoom_out</span></button>
              <button onClick={() => resetTransform()} className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" title="Reset Zoom"><span className="material-icons-round text-sm">fit_screen</span></button>
            </div>
            <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ minWidth: "100%", minHeight: "100%", padding: "4rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="min-w-max">
                <DiagramNodeEditor
                  node={data}
                  path={[]}
                  onUpdate={handleUpdate}
                  onAddChild={handleAddChild}
                  onAddSibling={handleAddSibling}
                  onRemove={handleRemove}
                  isRoot={true}
                />
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default DiagramEditor;
