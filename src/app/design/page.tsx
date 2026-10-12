'use client';

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { 
  Image, Sparkles, Type, Download, 
  Trash2, RefreshCw, Plus
} from 'lucide-react';

interface GraphicElement {
  id: string;
  type: 'image' | 'text' | 'shape';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
}

interface CanvasPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  description: string;
}

const PRESETS: CanvasPreset[] = [
  { id: 'book', name: 'Book Cover (5x8")', width: 480, height: 768, description: 'Mystery, fiction, memoir sizes' },
  { id: 'poster', name: 'Standard Poster', width: 540, height: 760, description: 'Events, music, notices' },
  { id: 'banner', name: 'Horizontal Banner', width: 780, height: 260, description: 'Announcements, web graphics' },
  { id: 'a4', name: 'A4 Flyer', width: 540, height: 763, description: 'Circulars, office signs' },
];

const EXAMPLE_TEMPLATES = [
  {
    id: 't1',
    name: 'DARKEST HOUR (Thriller Cover)',
    presetId: 'book',
    bg: 'linear-gradient(to bottom, #110000, #33080c, #0a0102)',
    elements: [
      { id: 'h1', type: 'text', content: 'DARKEST HOUR', x: 40, y: 80, width: 400, height: 80, fontSize: 38, color: '#f8fafc', fontFamily: 'Times New Roman' },
      { id: 'h2', type: 'text', content: 'A NOVEL BY J. S. BENNETT', x: 90, y: 640, width: 300, height: 30, fontSize: 13, color: '#94a3b8', fontFamily: 'Arial' },
    ]
  },
  {
    id: 't2',
    name: 'MUSIC FESTIVAL (Poster)',
    presetId: 'poster',
    bg: 'linear-gradient(to bottom, #050510, #1e0b36, #090212)',
    elements: [
      { id: 'hp1', type: 'text', content: 'LIVE MUSIC FEST', x: 40, y: 70, width: 460, height: 70, fontSize: 34, color: '#ff007f', fontFamily: 'Impact' },
      { id: 'hp2', type: 'text', content: 'CAMP GROUND ? OCTOBER 24', x: 70, y: 680, width: 400, height: 40, fontSize: 14, color: '#38bdf8', fontFamily: 'Trebuchet MS' },
    ]
  },
  {
    id: 't3',
    name: 'BIG SALE BANNER',
    presetId: 'banner',
    bg: 'linear-gradient(to right, #4c0519, #881337)',
    elements: [
      { id: 'hb1', type: 'text', content: '50% OFF ALL STOCK', x: 50, y: 80, width: 400, height: 60, fontSize: 32, color: '#facc15', fontFamily: 'Arial Black' },
      { id: 'hb2', type: 'text', content: 'HURRY! LIMITED TIME ONLY', x: 50, y: 150, width: 300, height: 30, fontSize: 14, color: '#ffffff', fontFamily: 'Arial' },
    ]
  }
];

export default function AIStudioPage() {
  const [selectedPreset, setSelectedPreset] = useState<CanvasPreset>(PRESETS[0]);
  const [elements, setElements] = useState<GraphicElement[]>([]);
  const [canvasBg, setCanvasBg] = useState('linear-gradient(to bottom, #1e1b4b, #311042)');
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [importedImage, setImportedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const loadTemplate = (tpl: typeof EXAMPLE_TEMPLATES[0]) => {
    const preset = PRESETS.find(p => p.id === tpl.presetId) || PRESETS[0];
    setSelectedPreset(preset);
    setCanvasBg(tpl.bg);
    setElements(tpl.elements.map(el => ({ ...el, id: `${el.id}_${Date.now()}` })) as GraphicElement[]);
    setSelectedElementId(null);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsRemovingBg(true);
    const originalUrl = URL.createObjectURL(file);
    setImportedImage(originalUrl);

    try {
      const imgly = await import('@imgly/background-removal');
      const removeFn = (imgly as any).removeBackground || imgly.default;
      
      const blob = await removeFn(file, {
        progress: (_key: string, _current: number, _total: number) => {}
      });

      const transparentUrl = URL.createObjectURL(blob);
      setImportedImage(transparentUrl);

      const newEl: GraphicElement = {
        id: `img_${Date.now()}`,
        type: 'image',
        content: transparentUrl,
        x: 60,
        y: 180,
        width: 240,
        height: 320,
      };
      setElements(prev => [...prev, newEl]);
      setSelectedElementId(newEl.id);
    } catch (err) {
      console.error('BG removal failed, using source image', err);
      const newEl: GraphicElement = {
        id: `img_${Date.now()}`,
        type: 'image',
        content: originalUrl,
        x: 60,
        y: 180,
        width: 240,
        height: 320,
      };
      setElements(prev => [...prev, newEl]);
    } finally {
      setIsRemovingBg(false);
    }
  };

  const addTextElement = () => {
    if (!textInput.trim()) return;
    const newEl: GraphicElement = {
      id: `text_${Date.now()}`,
      type: 'text',
      content: textInput,
      x: 50,
      y: 120,
      width: 280,
      height: 40,
      fontSize: 24,
      color: '#ffffff',
      fontFamily: 'Arial',
    };
    setElements(prev => [...prev, newEl]);
    setTextInput('');
    setSelectedElementId(newEl.id);
  };

  const deleteSelected = () => {
    if (!selectedElementId) return;
    setElements(prev => prev.filter(el => el.id !== selectedElementId));
    setSelectedElementId(null);
  };

  const exportCanvas = async () => {
    if (!canvasRef.current) return;
    const canvas = await html2canvas(canvasRef.current, { useCORS: true });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${selectedPreset.name}_Graphic.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <a href="/" className="font-extrabold text-lg text-blue-500 tracking-tight">Stationery Express</a>
          <span className="text-slate-800">|</span>
          <h1 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Sparkles size={16} className="text-blue-500 animate-pulse" /> AI Designer, Background Remover & Cover Maker
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <a href="/print" className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 transition">
            Print Station
          </a>
          <button
            onClick={exportCanvas}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-md transition"
          >
            <Download size={14} /> Download Image
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-0 overflow-hidden h-[calc(100vh-64px)]">
        <aside className="xl:col-span-3 bg-slate-950 border-r border-slate-800 p-5 flex flex-col space-y-6 overflow-y-auto">
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">1. Choose Canvas Sizing</h2>
            <div className="grid grid-cols-1 gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPreset(preset);
                    setSelectedElementId(null);
                  }}
                  className={`p-3 rounded-xl border text-left transition ${
                    selectedPreset.id === preset.id
                      ? 'border-blue-500 bg-blue-500/10 text-white'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
                  }`}
                >
                  <div className="font-semibold text-xs">{preset.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">2. Subject & Background Remover (AI)</h2>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 rounded-xl p-6 text-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 hover:border-blue-500 transition relative overflow-hidden flex flex-col items-center justify-center min-h-[140px]"
            >
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handlePhotoUpload} 
              />
              {isRemovingBg ? (
                <div className="flex flex-col items-center space-y-2">
                  <RefreshCw size={24} className="animate-spin text-blue-500" />
                  <span className="text-xs font-semibold text-blue-400">Removing Background (AI)...</span>
                  <span className="text-[10px] text-slate-500">Separating subject locally</span>
                </div>
              ) : importedImage ? (
                <div className="flex flex-col items-center">
                  <img src={importedImage} alt="Cutout" className="max-h-24 object-contain rounded" />
                  <span className="text-[10px] text-blue-400 font-medium mt-2">Click to Upload Another & Auto-Isolate</span>
                </div>
              ) : (
                <>
                  <Image size={24} className="text-slate-500 mb-2" />
                  <span className="text-xs font-semibold text-slate-300">Drop Image to Auto-Cut</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Isolates people, products, books</span>
                </>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">3. Pre-designed Examples</h2>
            <div className="grid grid-cols-1 gap-2">
              {EXAMPLE_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => loadTemplate(tpl)}
                  className="p-2.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900/80 text-left text-xs transition flex justify-between items-center"
                >
                  <span className="font-medium">{tpl.name}</span>
                  <Plus size={14} className="text-blue-500" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">4. Design Layers</h2>
            <div className="space-y-2">
              <input
                type="text"
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                placeholder="Title, caption, or event date..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={addTextElement}
                className="w-full bg-slate-800 hover:bg-slate-700 font-semibold py-2 rounded-lg text-xs transition flex items-center justify-center gap-1.5"
              >
                <Type size={14} /> Add Text Overlays
              </button>
            </div>
          </div>

          {selectedElementId && (
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <span className="text-xs font-semibold text-blue-400">Layer Settings</span>
                <button onClick={deleteSelected} className="text-red-400 hover:text-red-500 p-1 rounded hover:bg-slate-800/80">
                  <Trash2 size={13} />
                </button>
              </div>

              {elements.find(el => el.id === selectedElementId)?.type === 'text' && (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Font Size</span>
                      <span>{elements.find(el => el.id === selectedElementId)?.fontSize}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="12" 
                      max="72"
                      value={elements.find(el => el.id === selectedElementId)?.fontSize || 14}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setElements(prev => prev.map(el => el.id === selectedElementId ? { ...el, fontSize: val } : el));
                      }}
                      className="w-full accent-blue-500"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400">Color Palette</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {['#ffffff', '#facc15', '#ef4444', '#38bdf8', '#4ade80'].map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            setElements(prev => prev.map(el => el.id === selectedElementId ? { ...el, color: c } : el));
                          }}
                          className="w-5 h-5 rounded-full border border-slate-700"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>

        <main className="xl:col-span-9 bg-slate-900 p-6 flex items-center justify-center overflow-auto relative">
          <div className="absolute top-4 right-4 flex items-center space-x-3 bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 shadow-md">
            <span className="text-xs text-slate-400">Canvas preset: <strong>{selectedPreset.name}</strong></span>
          </div>

          <div 
            ref={canvasRef}
            style={{ 
              width: `${selectedPreset.width}px`, 
              height: `${selectedPreset.height}px`,
              background: canvasBg,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)'
            }} 
            className="rounded-lg relative overflow-hidden transition-all duration-150 border border-slate-700 flex flex-col"
          >
            {elements.map((el) => {
              const isSelected = el.id === selectedElementId;

              return (
                <div
                  key={el.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElementId(el.id);
                  }}
                  style={{
                    left: `${el.x}px`,
                    top: `${el.y}px`,
                    width: `${el.width}px`,
                    height: `${el.height}px`,
                    fontFamily: el.fontFamily || 'Arial',
                    fontSize: el.fontSize ? `${el.fontSize}px` : undefined,
                    color: el.color || undefined,
                  }}
                  className={`absolute flex items-center justify-center cursor-move p-2 select-none group border ${
                    isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-transparent hover:border-slate-600'
                  }`}
                  onMouseDown={(e) => {
                    const rect = canvasRef.current?.getBoundingClientRect();
                    if (!rect) return;
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const origX = el.x;
                    const origY = el.y;

                    const moveHandler = (moveEvent: MouseEvent) => {
                      const dx = moveEvent.clientX - startX;
                      const dy = moveEvent.clientY - startY;
                      setElements(prev => prev.map(item => item.id === el.id ? { 
                        ...item, 
                        x: Math.max(0, Math.min(selectedPreset.width - item.width, origX + dx)), 
                        y: Math.max(0, Math.min(selectedPreset.height - item.height, origY + dy))
                      } : item));
                    };

                    const upHandler = () => {
                      window.removeEventListener('mousemove', moveHandler);
                      window.removeEventListener('mouseup', upHandler);
                    };

                    window.addEventListener('mousemove', moveHandler);
                    window.addEventListener('mouseup', upHandler);
                  }}
                >
                  {el.type === 'image' ? (
                    <img src={el.content} alt="Element" className="w-full h-full object-contain" />
                  ) : (
                    <span className="w-full text-center font-bold break-words">{el.content}</span>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
