'use client';

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  LayoutTemplate, Sparkles, Type, Download, Trash2, 
  RefreshCw, Lock, Unlock, Printer, Layers, Wand2, 
  Maximize2, Upload, ChevronRight, Image as ImageIcon
} from 'lucide-react';

export type UnitType = 'm' | 'cm' | 'mm' | 'px';

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'badge';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  bgColor?: string;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  zIndex: number;
}

export interface DesignTemplate {
  id: string;
  title: string;
  category: 'banner' | 'poster' | 'business' | 'cover';
  ratioName: string;
  unit: UnitType;
  wVal: number;
  hVal: number;
  bg: string;
  previewBg: string;
  previewTags: string[];
  elements: CanvasElement[];
}

const CANVA_TEMPLATES: DesignTemplate[] = [
  {
    id: 'samira_hadid',
    title: 'Samira Hadid - Portfolio Banner',
    category: 'banner',
    ratioName: 'Landscape Banner (2m ? 1m)',
    unit: 'm',
    wVal: 2,
    hVal: 1,
    bg: '#f1f1ef',
    previewBg: 'linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)',
    previewTags: ['Creative', 'Minimal', 'Branding'],
    elements: [
      { id: 'sh_bg_shape', type: 'badge', content: '', x: 0, y: 0, width: 220, height: 420, bgColor: '#d6d3d1', borderRadius: 0, zIndex: 1 },
      { id: 'sh_title', type: 'text', content: 'SAMIRA HADID', x: 260, y: 70, width: 440, height: 60, fontSize: 38, fontWeight: '800', color: '#1c1917', fontFamily: 'Georgia, serif', textAlign: 'left', zIndex: 3 },
      { id: 'sh_sub', type: 'text', content: 'GRAPHIC DESIGNER & CREATIVE DIRECTOR', x: 265, y: 135, width: 420, height: 30, fontSize: 14, fontWeight: '600', color: '#78716c', fontFamily: 'Arial, sans-serif', textAlign: 'left', zIndex: 3 },
      { id: 'sh_c1', type: 'text', content: '?? +256 700 123 456', x: 265, y: 200, width: 260, height: 26, fontSize: 13, fontWeight: '500', color: '#292524', textAlign: 'left', zIndex: 3 },
      { id: 'sh_c2', type: 'text', content: '? hello@samirahadid.design', x: 265, y: 235, width: 260, height: 26, fontSize: 13, fontWeight: '500', color: '#292524', textAlign: 'left', zIndex: 3 },
      { id: 'sh_c3', type: 'text', content: '?? www.samirahadid.com', x: 265, y: 270, width: 260, height: 26, fontSize: 13, fontWeight: '500', color: '#292524', textAlign: 'left', zIndex: 3 },
      { id: 'sh_avatar', type: 'badge', content: '?? PORTRAIT PHOTO', x: 570, y: 70, width: 200, height: 240, bgColor: '#e7e5e4', borderColor: '#a8a29e', borderWidth: 2, borderRadius: 100, fontSize: 12, fontWeight: 'bold', color: '#78716c', textAlign: 'center', zIndex: 4 },
    ]
  },
  {
    id: 'digital_marketing',
    title: 'Digital Marketing Agency Banner',
    category: 'banner',
    ratioName: 'Street Banner (3m ? 1m)',
    unit: 'm',
    wVal: 3,
    hVal: 1,
    bg: '#042f2e',
    previewBg: 'linear-gradient(135deg, #042f2e 0%, #115e59 100%)',
    previewTags: ['Corporate', 'Agency', 'Tech'],
    elements: [
      { id: 'dm_tag', type: 'badge', content: 'GIGGLING PLATYPUS CO.', x: 40, y: 40, width: 220, height: 30, fontSize: 11, fontWeight: 'bold', color: '#2dd4bf', bgColor: '#134e4a', borderRadius: 4, textAlign: 'center', zIndex: 2 },
      { id: 'dm_head', type: 'text', content: 'DIGITAL MARKETING AGENCY', x: 40, y: 110, width: 500, height: 60, fontSize: 34, fontWeight: '900', color: '#2dd4bf', fontFamily: 'Arial Black, sans-serif', textAlign: 'left', zIndex: 3 },
      { id: 'dm_desc', type: 'text', content: 'Bring your vision and growth to life. We drive online campaigns, performance ads, and conversions worldwide.', x: 40, y: 180, width: 440, height: 50, fontSize: 13, fontWeight: '400', color: '#ccfbf1', textAlign: 'left', zIndex: 3 },
      { id: 'dm_btn', type: 'badge', content: 'JOIN NOW ?', x: 40, y: 250, width: 140, height: 42, fontSize: 13, fontWeight: 'bold', color: '#042f2e', bgColor: '#2dd4bf', borderRadius: 6, textAlign: 'center', zIndex: 4 },
      { id: 'dm_chart', type: 'badge', content: '?? ANALYTICS CIRCLE', x: 530, y: 55, width: 240, height: 240, bgColor: '#115e59', borderColor: '#2dd4bf', borderWidth: 4, borderRadius: 120, fontSize: 12, fontWeight: 'bold', color: '#99f6e4', textAlign: 'center', zIndex: 4 },
    ]
  },
  {
    id: 'smart_hired_careers',
    title: 'Smart Hired Limited - Careers Banner',
    category: 'banner',
    ratioName: 'Roadside Billboard (5m ? 1m)',
    unit: 'm',
    wVal: 5,
    hVal: 1,
    bg: '#0f172a',
    previewBg: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
    previewTags: ['Recruitment', 'Jobs', 'Visa'],
    elements: [
      { id: 'sh_badge', type: 'badge', content: 'OFFICIAL OVERSEAS RECRUITMENT', x: 40, y: 30, width: 320, height: 32, fontSize: 12, fontWeight: '800', color: '#0f172a', bgColor: '#38bdf8', borderRadius: 4, textAlign: 'center', zIndex: 2 },
      { id: 'sh_h1', type: 'text', content: 'WORK IN GERMANY & SWITZERLAND', x: 40, y: 75, width: 680, height: 60, fontSize: 34, fontWeight: '900', color: '#ffffff', fontFamily: 'Arial Black', textAlign: 'left', zIndex: 3 },
      { id: 'sh_h2', type: 'text', content: 'Hospitality ? Healthcare ? Construction ? IT Logistics ? Drivers', x: 40, y: 145, width: 650, height: 32, fontSize: 16, fontWeight: '600', color: '#93c5fd', textAlign: 'left', zIndex: 3 },
      { id: 'sh_visabox', type: 'badge', content: 'FAST WORK PERMIT ? VISA SUPPORT & TRAVEL PROCESSING', x: 40, y: 190, width: 480, height: 36, fontSize: 12, fontWeight: 'bold', color: '#ffffff', bgColor: '#16a34a', borderRadius: 6, textAlign: 'center', zIndex: 4 },
      { id: 'sh_footer', type: 'text', content: 'Smart Hired Limited ? Apply: www.smarthiredug.com ? Tel: +256 393 001 833', x: 40, y: 250, width: 700, height: 28, fontSize: 13, fontWeight: '600', color: '#cbd5e1', textAlign: 'left', zIndex: 4 },
    ]
  },
  {
    id: 'keynote_conference',
    title: 'Tech Summit - Event Poster',
    category: 'poster',
    ratioName: 'A2 Event Poster (42 ? 59.4cm)',
    unit: 'cm',
    wVal: 42,
    hVal: 59.4,
    bg: '#18002e',
    previewBg: 'linear-gradient(180deg, #18002e 0%, #3b0764 100%)',
    previewTags: ['Event', 'Conference', 'Tech'],
    elements: [
      { id: 'ts_top', type: 'badge', content: 'KEYNOTE SPEECHES | WORKSHOPS | NETWORKING', x: 40, y: 35, width: 440, height: 32, fontSize: 11, fontWeight: '700', color: '#f3e8ff', bgColor: '#581c87', borderRadius: 4, textAlign: 'center', zIndex: 2 },
      { id: 'ts_h1', type: 'text', content: 'GLOBAL TECH SUMMIT', x: 40, y: 90, width: 440, height: 70, fontSize: 38, fontWeight: '900', color: '#ffffff', fontFamily: 'Impact', textAlign: 'center', zIndex: 3 },
      { id: 'ts_date', type: 'badge', content: 'OCTOBER 24-26 ? KAMPALA SERENA HOTEL', x: 60, y: 190, width: 400, height: 36, fontSize: 13, fontWeight: '800', color: '#18002e', bgColor: '#facc15', borderRadius: 8, textAlign: 'center', zIndex: 4 },
      { id: 'ts_btn', type: 'badge', content: 'Get Your Tickets: www.techsummit.ug', x: 80, y: 330, width: 360, height: 42, fontSize: 13, fontWeight: 'bold', color: '#ffffff', bgColor: '#7c3aed', borderRadius: 20, textAlign: 'center', zIndex: 4 },
    ]
  },
  {
    id: 'darkest_hour',
    title: 'Darkest Hour - Novel Cover',
    category: 'cover',
    ratioName: 'Book Cover (15.2 ? 22.9cm)',
    unit: 'cm',
    wVal: 15.2,
    hVal: 22.9,
    bg: '#0a0102',
    previewBg: 'linear-gradient(180deg, #3f090d 0%, #0a0102 100%)',
    previewTags: ['Book', 'Novel', 'Bestseller'],
    elements: [
      { id: 'bk_top', type: 'text', content: 'THE #1 INTERNATIONAL BESTSELLER', x: 20, y: 30, width: 380, height: 25, fontSize: 11, fontWeight: '700', color: '#94a3b8', textAlign: 'center', zIndex: 2 },
      { id: 'bk_h1', type: 'text', content: 'DARKEST HOUR', x: 20, y: 75, width: 380, height: 70, fontSize: 42, fontWeight: '900', color: '#fef2f2', fontFamily: 'Times New Roman', textAlign: 'center', zIndex: 3 },
      { id: 'bk_tag', type: 'text', content: 'Some secrets should stay buried forever.', x: 20, y: 280, width: 380, height: 30, fontSize: 13, fontWeight: '400', color: '#fda4af', fontFamily: 'Georgia', textAlign: 'center', zIndex: 3 },
      { id: 'bk_auth', type: 'text', content: 'A NOVEL BY J. S. BENNETT', x: 20, y: 340, width: 380, height: 35, fontSize: 17, fontWeight: '700', color: '#ffffff', fontFamily: 'Times New Roman', textAlign: 'center', zIndex: 3 },
    ]
  }
];

export default function CanvaStudioPage() {
  const [activeNav, setActiveNav] = useState<'templates' | 'elements' | 'text' | 'uploads' | 'ai' | 'resize'>('templates');
  const [currentTemplate, setCurrentTemplate] = useState<DesignTemplate>(CANVA_TEMPLATES[0]);
  
  const [unit, setUnit] = useState<UnitType>(CANVA_TEMPLATES[0].unit);
  const [wVal, setWVal] = useState<number>(CANVA_TEMPLATES[0].wVal);
  const [hVal, setHVal] = useState<number>(CANVA_TEMPLATES[0].hVal);
  const [lockRatio, setLockRatio] = useState<boolean>(true);

  const [canvasBg, setCanvasBg] = useState<string>(CANVA_TEMPLATES[0].bg);
  const [elements, setElements] = useState<CanvasElement[]>(CANVA_TEMPLATES[0].elements);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [aiPrompt, setAiPrompt] = useState<string>('Create a professional recruitment banner for Smart Hired Limited advertising jobs in Germany, Switzerland, and European countries.');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [isRemovingBg, setIsRemovingBg] = useState<boolean>(false);
  const [bgStatus, setBgStatus] = useState<string>('');

  const canvasRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleSelectTemplate = (tpl: DesignTemplate) => {
    setCurrentTemplate(tpl);
    setUnit(tpl.unit);
    setWVal(tpl.wVal);
    setHVal(tpl.hVal);
    setCanvasBg(tpl.bg);
    setElements(tpl.elements.map(el => ({ ...el, id: el.id + '_' + Date.now() })));
    setSelectedId(null);
  };

  const getCanvasDimensions = () => {
    let metersW = wVal;
    let metersH = hVal;
    if (unit === 'cm') { metersW = wVal / 100; metersH = hVal / 100; }
    else if (unit === 'mm') { metersW = wVal / 1000; metersH = hVal / 1000; }
    else if (unit === 'px') { metersW = wVal / 1000; metersH = hVal / 1000; }

    const aspect = metersW / (metersH || 0.01);
    const maxW = 860;
    const maxH = 500;
    let screenW = maxW;
    let screenH = screenW / aspect;
    if (screenH > maxH) {
      screenH = maxH;
      screenW = screenH * aspect;
    }
    return { screenW: Math.round(screenW), screenH: Math.round(screenH) };
  };

  const { screenW, screenH } = getCanvasDimensions();

  const handleWidthChange = (val: number) => {
    if (lockRatio && wVal > 0) {
      const ratio = hVal / wVal;
      setHVal(parseFloat((val * ratio).toFixed(2)));
    }
    setWVal(val);
  };

  const handleHeightChange = (val: number) => {
    if (lockRatio && hVal > 0) {
      const ratio = wVal / hVal;
      setWVal(parseFloat((val * ratio).toFixed(2)));
    }
    setHVal(val);
  };

  const handleGenerateAi = () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);

    setTimeout(() => {
      const lower = aiPrompt.toLowerCase();
      let title = 'GLOBAL CAREERS IN EUROPE';
      let sub = 'Direct Visa & Relocation Support';
      let badge = 'SMART HIRED LIMITED';
      let bg = 'linear-gradient(135deg, #090d16 0%, #172554 50%, #1e40af 100%)';
      let contact = 'Smart Hired Limited ? Apply: www.smarthiredug.com ? Tel: +256 393 001 833';

      if (lower.includes('germany') || lower.includes('switzerland') || lower.includes('smart hired')) {
        title = 'JOBS IN GERMANY & SWITZERLAND';
        sub = 'Hospitality ? Healthcare ? Construction ? Logistics';
        badge = 'OFFICIAL RECRUITMENT';
      } else if (lower.includes('sale') || lower.includes('discount')) {
        title = '50% OFF EVERYTHING';
        sub = 'Limited Time Clearance Event';
        badge = 'ANNUAL MEGA SALE';
        bg = 'linear-gradient(90deg, #991b1b 0%, #dc2626 50%, #ea580c 100%)';
        contact = 'Stationery Express ? While Stocks Last';
      }

      setCanvasBg(bg);
      setElements([
        { id: 'ai_b1_' + Date.now(), type: 'badge', content: badge, x: 40, y: 35, width: 280, height: 32, fontSize: 12, fontWeight: '800', color: '#0f172a', bgColor: '#38bdf8', borderRadius: 4, textAlign: 'center', zIndex: 2 },
        { id: 'ai_t1_' + Date.now(), type: 'text', content: title, x: 40, y: 80, width: 680, height: 60, fontSize: 34, fontWeight: '900', color: '#ffffff', fontFamily: 'Arial Black', textAlign: 'left', zIndex: 3 },
        { id: 'ai_t2_' + Date.now(), type: 'text', content: sub, x: 40, y: 150, width: 650, height: 35, fontSize: 16, fontWeight: '600', color: '#93c5fd', textAlign: 'left', zIndex: 3 },
        { id: 'ai_b2_' + Date.now(), type: 'badge', content: 'FULL WORK VISA & RELOCATION ASSISTANCE', x: 40, y: 195, width: 420, height: 36, fontSize: 12, fontWeight: 'bold', color: '#ffffff', bgColor: '#16a34a', borderRadius: 6, textAlign: 'center', zIndex: 4 },
        { id: 'ai_c_' + Date.now(), type: 'text', content: contact, x: 40, y: 250, width: 700, height: 30, fontSize: 13, fontWeight: '500', color: '#cbd5e1', textAlign: 'left', zIndex: 5 },
      ]);
      setIsGeneratingAi(false);
      setActiveNav('elements');
    }, 1200);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsRemovingBg(true);
    setBgStatus('Extracting subject...');
    const originalUrl = URL.createObjectURL(file);

    try {
      const imgly = await import('@imgly/background-removal');
      const removeFn = (imgly as any).removeBackground || imgly.default;
      const blob = await removeFn(file);
      const transparentUrl = URL.createObjectURL(blob);

      const newEl: CanvasElement = {
        id: 'img_' + Date.now(),
        type: 'image',
        content: transparentUrl,
        x: Math.round(screenW * 0.55),
        y: 30,
        width: Math.round(screenW * 0.4),
        height: Math.round(screenH * 0.85),
        zIndex: elements.length + 1,
      };
      setElements(prev => [...prev, newEl]);
      setSelectedId(newEl.id);
    } catch {
      const newEl: CanvasElement = {
        id: 'img_' + Date.now(),
        type: 'image',
        content: originalUrl,
        x: Math.round(screenW * 0.55),
        y: 30,
        width: Math.round(screenW * 0.4),
        height: Math.round(screenH * 0.85),
        zIndex: elements.length + 1,
      };
      setElements(prev => [...prev, newEl]);
      setSelectedId(newEl.id);
    } finally {
      setIsRemovingBg(false);
      setBgStatus('');
    }
  };

  const handleExport = async (format: 'png' | 'pdf') => {
    if (!canvasRef.current) return;
    setSelectedId(null);

    const canvas = await html2canvas(canvasRef.current, { scale: 3, useCORS: true, backgroundColor: null });
    if (format === 'png') {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png', 1.0);
      link.download = currentTemplate.title.replace(/\s+/g, '_') + '_' + wVal + unit + 'x' + hVal + unit + '.png';
      link.click();
    } else {
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: screenW >= screenH ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [screenW * 0.5, screenH * 0.5],
      });
      pdf.addImage(imgData, 'JPEG', 0, 0, screenW * 0.5, screenH * 0.5);
      pdf.save(currentTemplate.title.replace(/\s+/g, '_') + '.pdf');
    }
  };

  const selectedEl = elements.find(el => el.id === selectedId);

  return (
    <div className="fixed inset-0 bg-[#0e131f] text-slate-100 flex flex-col select-none overflow-hidden z-50">
      
      {/* Top Navbar */}
      <header className="h-14 bg-[#141b2d] border-b border-slate-800 px-5 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <a href="/" className="font-black text-lg text-indigo-400 tracking-tight flex items-center gap-1.5">
            <Sparkles size={20} className="text-purple-400" /> Canva Studio
          </a>
          <span className="text-slate-700">|</span>
          <span className="text-xs font-semibold text-slate-300 truncate max-w-sm">{currentTemplate.title}</span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800 font-mono">
            {wVal} ? {hVal} {unit}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleExport('png')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg border border-slate-700 text-slate-200 transition flex items-center gap-1.5"
          >
            <Download size={14} /> PNG (300 DPI)
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold rounded-lg text-white shadow-md transition flex items-center gap-1.5"
          >
            <Printer size={14} /> Print PDF
          </button>
          <a
            href="/print"
            className="text-xs font-semibold text-slate-400 hover:text-white px-2 py-1 transition"
          >
            Print Queue &rarr;
          </a>
        </div>
      </header>

      {/* Main Studio Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Leftmost Icon Bar */}
        <aside className="w-16 bg-[#0c101c] border-r border-slate-800 flex flex-col items-center py-4 space-y-4 shrink-0">
          {[
            { id: 'templates', label: 'Templates', icon: LayoutTemplate },
            { id: 'elements', label: 'Elements', icon: Layers },
            { id: 'text', label: 'Text', icon: Type },
            { id: 'uploads', label: 'Uploads', icon: Upload },
            { id: 'ai', label: 'Canva AI', icon: Wand2 },
            { id: 'resize', label: '1m?10m', icon: Maximize2 },
          ].map((nav) => {
            const Icon = nav.icon;
            const isActive = activeNav === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => setActiveNav(nav.id as any)}
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition ${
                  isActive 
                    ? 'bg-purple-600/20 text-purple-400 border border-purple-500/40 shadow-xs' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="text-[9px] font-semibold mt-1 tracking-tight">{nav.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Side Drawer */}
        <div className="w-80 bg-[#141b2d] border-r border-slate-800 flex flex-col overflow-y-auto shrink-0 p-4">
          
          {/* Templates Drawer */}
          {activeNav === 'templates' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-white">Design Templates</h2>
                <p className="text-xs text-slate-400 mt-0.5">Click any complete design to load and customize.</p>
              </div>

              <div className="space-y-3">
                {CANVA_TEMPLATES.map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className="group cursor-pointer rounded-xl border border-slate-800 hover:border-purple-500 bg-[#0e131f] p-3 transition shadow-md hover:shadow-purple-500/10"
                  >
                    <div 
                      className="w-full h-24 rounded-lg relative overflow-hidden flex flex-col justify-between p-3 border border-slate-700/50 mb-2.5 transition group-hover:scale-[1.01]"
                      style={{ background: tpl.previewBg }}
                    >
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/40 text-white w-max backdrop-blur-xs">
                        {tpl.ratioName}
                      </span>
                      <span className="text-xs font-black text-white drop-shadow-md truncate">
                        {tpl.title}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-purple-400 transition">{tpl.title}</span>
                      <ChevronRight size={14} className="text-slate-500 group-hover:text-purple-400" />
                    </div>

                    <div className="flex gap-1.5 mt-2">
                      {tpl.previewTags.map(t => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Elements Drawer */}
          {activeNav === 'elements' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-white">Shapes & Badges</h2>
                <p className="text-xs text-slate-400 mt-0.5">Add graphical layers to your canvas.</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    const el: CanvasElement = { id: 'b_' + Date.now(), type: 'badge', content: 'SPECIAL OFFER', x: 50, y: 50, width: 220, height: 36, fontSize: 13, fontWeight: 'bold', color: '#0f172a', bgColor: '#38bdf8', borderRadius: 6, textAlign: 'center', zIndex: elements.length + 1 };
                    setElements(prev => [...prev, el]);
                    setSelectedId(el.id);
                  }}
                  className="p-3 bg-[#0e131f] hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5"
                >
                  <Sparkles size={18} className="text-cyan-400" />
                  <span>Callout Badge</span>
                </button>
                <button
                  onClick={() => {
                    const el: CanvasElement = { id: 's_' + Date.now(), type: 'badge', content: '', x: 50, y: 50, width: 200, height: 160, bgColor: '#1e293b', borderRadius: 12, borderColor: '#334155', borderWidth: 2, zIndex: elements.length + 1 };
                    setElements(prev => [...prev, el]);
                    setSelectedId(el.id);
                  }}
                  className="p-3 bg-[#0e131f] hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5"
                >
                  <Layers size={18} className="text-purple-400" />
                  <span>Card Container</span>
                </button>
              </div>

              {selectedEl ? (
                <div className="bg-[#0e131f] border border-purple-500/40 rounded-xl p-4 space-y-3 mt-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-purple-400">Selected Layer</span>
                    <button onClick={() => setElements(prev => prev.filter(e => e.id !== selectedId))} className="text-red-400 hover:text-red-300">
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Text Content</label>
                    <textarea
                      value={selectedEl.content}
                      onChange={e => setElements(prev => prev.map(item => item.id === selectedId ? { ...item, content: e.target.value } : item))}
                      rows={2}
                      className="w-full bg-[#141b2d] border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Font Size</label>
                      <input
                        type="range"
                        min="10"
                        max="72"
                        value={selectedEl.fontSize || 14}
                        onChange={e => setElements(prev => prev.map(item => item.id === selectedId ? { ...item, fontSize: parseInt(e.target.value) } : item))}
                        className="w-full accent-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Color</label>
                      <div className="flex gap-1">
                        {['#ffffff', '#2dd4bf', '#facc15', '#ef4444', '#38bdf8'].map(c => (
                          <button
                            key={c}
                            onClick={() => setElements(prev => prev.map(item => item.id === selectedId ? { ...item, color: c } : item))}
                            className="w-5 h-5 rounded-full border border-slate-700"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-slate-800 bg-[#0e131f] text-center text-xs text-slate-500">
                  Click any element on canvas to inspect and edit.
                </div>
              )}
            </div>
          )}

          {/* Text Drawer */}
          {activeNav === 'text' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-white">Text Overlays</h2>
                <p className="text-xs text-slate-400 mt-0.5">Click to add formatted typography blocks.</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    const el: CanvasElement = { id: 't_' + Date.now(), type: 'text', content: 'Add a heading', x: 50, y: 80, width: 440, height: 60, fontSize: 36, fontWeight: '900', color: '#ffffff', fontFamily: 'Arial Black', textAlign: 'left', zIndex: elements.length + 1 };
                    setElements(prev => [...prev, el]);
                    setSelectedId(el.id);
                  }}
                  className="w-full p-4 rounded-xl border border-slate-800 bg-[#0e131f] hover:border-purple-500 text-left transition"
                >
                  <span className="text-xl font-black text-white block">Add a heading</span>
                  <span className="text-[10px] text-slate-500">Bold display font</span>
                </button>

                <button
                  onClick={() => {
                    const el: CanvasElement = { id: 't_' + Date.now(), type: 'text', content: 'Add a subheading', x: 50, y: 140, width: 380, height: 35, fontSize: 18, fontWeight: '600', color: '#93c5fd', textAlign: 'left', zIndex: elements.length + 1 };
                    setElements(prev => [...prev, el]);
                    setSelectedId(el.id);
                  }}
                  className="w-full p-3 rounded-xl border border-slate-800 bg-[#0e131f] hover:border-purple-500 text-left transition"
                >
                  <span className="text-sm font-bold text-slate-200 block">Add a subheading</span>
                  <span className="text-[10px] text-slate-500">Medium emphasis</span>
                </button>

                <button
                  onClick={() => {
                    const el: CanvasElement = { id: 't_' + Date.now(), type: 'text', content: 'Add body text with information, contact details, or notes.', x: 50, y: 190, width: 400, height: 45, fontSize: 13, fontWeight: '400', color: '#cbd5e1', textAlign: 'left', zIndex: elements.length + 1 };
                    setElements(prev => [...prev, el]);
                    setSelectedId(el.id);
                  }}
                  className="w-full p-3 rounded-xl border border-slate-800 bg-[#0e131f] hover:border-purple-500 text-left transition"
                >
                  <span className="text-xs text-slate-300 block">Add body text</span>
                  <span className="text-[10px] text-slate-500">Small paragraph</span>
                </button>
              </div>
            </div>
          )}

          {/* Uploads Drawer */}
          {activeNav === 'uploads' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-white">Uploads & AI Cutout</h2>
                <p className="text-xs text-slate-400 mt-0.5">Upload photos, logos, or isolate portraits.</p>
              </div>

              <div
                onClick={() => photoInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-purple-500 rounded-xl p-5 text-center cursor-pointer bg-[#0e131f] transition flex flex-col items-center justify-center min-h-[140px]"
              >
                <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                {isRemovingBg ? (
                  <div className="flex flex-col items-center gap-1.5">
                    <RefreshCw size={22} className="animate-spin text-purple-400" />
                    <span className="text-xs font-bold text-purple-300">{bgStatus}</span>
                  </div>
                ) : (
                  <>
                    <ImageIcon size={26} className="text-slate-500 mb-2" />
                    <span className="text-xs font-bold text-slate-200">Upload Image</span>
                    <span className="text-[10px] text-purple-400 font-semibold mt-1">Automatic Background Removal (AI)</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* AI Generator Drawer */}
          {activeNav === 'ai' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Wand2 size={16} className="text-purple-400" /> Canva Magic AI
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Describe your banner, poster, or cover in natural language.</p>
              </div>

              <div className="space-y-3">
                <textarea
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  rows={4}
                  placeholder="Describe your design..."
                  className="w-full bg-[#0e131f] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
                />
                <button
                  disabled={isGeneratingAi}
                  onClick={handleGenerateAi}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {isGeneratingAi ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  <span>{isGeneratingAi ? 'Generating Design...' : 'Generate with AI'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Large Format 1m-10m Drawer */}
          {activeNav === 'resize' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-sm font-bold text-white">Large-Format Print Sizing</h2>
                <p className="text-xs text-slate-400 mt-0.5">Configure 1 metre up to 10 metre dimensions.</p>
              </div>

              <div className="flex bg-[#0e131f] p-1 rounded-xl border border-slate-800">
                {(['m', 'cm', 'mm', 'px'] as UnitType[]).map(u => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold transition uppercase ${
                      unit === u ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Width ({unit})</label>
                  <input
                    type="number"
                    step={unit === 'm' ? '0.1' : '1'}
                    min="0.1"
                    value={wVal}
                    onChange={e => handleWidthChange(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0e131f] border border-slate-800 rounded-lg p-2.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Height ({unit})</label>
                  <input
                    type="number"
                    step={unit === 'm' ? '0.1' : '1'}
                    min="0.1"
                    value={hVal}
                    onChange={e => handleHeightChange(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0e131f] border border-slate-800 rounded-lg p-2.5 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <button
                onClick={() => setLockRatio(!lockRatio)}
                className={`w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                  lockRatio ? 'bg-purple-600/20 border-purple-500/50 text-purple-300' : 'bg-[#0e131f] border-slate-800 text-slate-400'
                }`}
              >
                {lockRatio ? <Lock size={13} /> : <Unlock size={13} />}
                <span>Proportional Scale: {lockRatio ? 'ON' : 'OFF'}</span>
              </button>

              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Quick Banner Sizes</span>
                {[
                  { name: '1m ? 1m Square', w: 1, h: 1, u: 'm' },
                  { name: '2m ? 1m Stage Banner', w: 2, h: 1, u: 'm' },
                  { name: '3m ? 1m Street Banner', w: 3, h: 1, u: 'm' },
                  { name: '5m ? 1m Roadside Billboard', w: 5, h: 1, u: 'm' },
                  { name: '10m ? 2m Building Banner', w: 10, h: 2, u: 'm' },
                ].map(b => (
                  <button
                    key={b.name}
                    onClick={() => { setUnit(b.u as any); setWVal(b.w); setHVal(b.h); }}
                    className="w-full p-2 rounded-lg bg-[#0e131f] hover:bg-slate-800 border border-slate-800 text-left text-xs text-slate-300 flex justify-between items-center transition"
                  >
                    <span>{b.name}</span>
                    <span className="font-mono text-purple-400 font-bold">{b.w}?{b.h}{b.u}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Central Live Canvas Area */}
        <main className="flex-1 bg-[#090d16] flex flex-col items-center justify-center overflow-auto p-6 relative">
          
          <div className="absolute top-4 left-6 flex items-center gap-2 bg-[#141b2d] border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 shadow-md">
            <span>Dimensions: <strong className="text-purple-400 font-mono">{wVal} ? {hVal} {unit}</strong></span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Ratio: {(wVal / (hVal || 1)).toFixed(2)}:1</span>
          </div>

          <div
            ref={canvasRef}
            style={{
              width: screenW + 'px',
              height: screenH + 'px',
              background: canvasBg,
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9)',
            }}
            onClick={() => setSelectedId(null)}
            className="relative rounded-lg overflow-hidden border border-slate-700 transition-all duration-200"
          >
            {elements.map((el) => {
              const isSelected = el.id === selectedId;

              return (
                <div
                  key={el.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(el.id);
                  }}
                  style={{
                    left: el.x + 'px',
                    top: el.y + 'px',
                    width: el.width + 'px',
                    height: el.height + 'px',
                    fontFamily: el.fontFamily || 'Arial, sans-serif',
                    fontSize: el.fontSize ? el.fontSize + 'px' : undefined,
                    fontWeight: el.fontWeight || 'normal',
                    color: el.color || undefined,
                    backgroundColor: el.bgColor || 'transparent',
                    borderRadius: el.borderRadius ? el.borderRadius + 'px' : undefined,
                    borderColor: el.borderColor || undefined,
                    borderWidth: el.borderWidth ? el.borderWidth + 'px' : undefined,
                    textAlign: el.textAlign || 'left',
                    zIndex: el.zIndex,
                  }}
                  className={`absolute flex items-center justify-center select-none cursor-move p-2 border ${
                    isSelected ? 'border-purple-400 ring-2 ring-purple-500/30' : 'border-transparent hover:border-slate-500/40'
                  }`}
                  onMouseDown={(e) => {
                    if (e.target !== e.currentTarget && (e.target as HTMLElement).dataset.handle) return;
                    e.stopPropagation();
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const origX = el.x;
                    const origY = el.y;

                    const moveHandler = (me: MouseEvent) => {
                      const dx = me.clientX - startX;
                      const dy = me.clientY - startY;
                      setElements(prev => prev.map(item => item.id === el.id ? {
                        ...item,
                        x: Math.max(0, Math.min(screenW - item.width, origX + dx)),
                        y: Math.max(0, Math.min(screenH - item.height, origY + dy)),
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
                    <img src={el.content} alt="Element" className="w-full h-full object-contain pointer-events-none" />
                  ) : (
                    <span className="w-full break-words whitespace-pre-wrap leading-tight">{el.content}</span>
                  )}

                  {isSelected && (
                    <div
                      data-handle="se"
                      className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-purple-500 border border-white rounded-full cursor-se-resize z-50 shadow-sm"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        const startX = e.clientX;
                        const startY = e.clientY;
                        const startW = el.width;
                        const startH = el.height;

                        const resizeMove = (me: MouseEvent) => {
                          const dw = me.clientX - startX;
                          const dh = me.clientY - startY;
                          setElements(prev => prev.map(item => item.id === el.id ? {
                            ...item,
                            width: Math.max(40, startW + dw),
                            height: Math.max(20, startH + dh),
                          } : item));
                        };

                        const resizeUp = () => {
                          window.removeEventListener('mousemove', resizeMove);
                          window.removeEventListener('mouseup', resizeUp);
                        };

                        window.addEventListener('mousemove', resizeMove);
                        window.addEventListener('mouseup', resizeUp);
                      }}
                    />
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
