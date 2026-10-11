'use client';

import React, { useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';

import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Subscript as SubIcon, Superscript as SuperIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Undo, Redo, Printer, Download,
  Upload, FileText, CheckCircle2, ZoomIn, ZoomOut,
  Highlighter, Table as TableIcon, Heading1, Heading2,
  ChevronDown, Palette, Scissors, Copy, Clipboard,
  Indent, Outdent, FilePlus, Columns, Maximize2, SplitSquareVertical,
  Minus, Sparkles, Image, Check, Search, Save
} from 'lucide-react';

// Comprehensive typography list matching Word
const FONT_FAMILIES = [
  { name: 'Calibri', font: 'Calibri, sans-serif', sample: 'AaBb' },
  { name: 'Times New Roman', font: '"Times New Roman", Times, serif', sample: 'AaBb' },
  { name: 'Arial', font: 'Arial, Helvetica, sans-serif', sample: 'AaBb' },
  { name: 'Arial Black', font: '"Arial Black", sans-serif', sample: 'AaBb' },
  { name: 'Bahnschrift', font: 'Bahnschrift, sans-serif', sample: 'AaBb' },
  { name: 'Cambria', font: 'Cambria, Georgia, serif', sample: 'AaBb' },
  { name: 'Century Gothic', font: '"Century Gothic", sans-serif', sample: 'AaBb' },
  { name: 'Courier New', font: '"Courier New", Courier, monospace', sample: 'AaBb' },
  { name: 'Franklin Gothic', font: '"Franklin Gothic Medium", sans-serif', sample: 'AaBb' },
  { name: 'Georgia', font: 'Georgia, serif', sample: 'AaBb' },
  { name: 'Impact', font: 'Impact, sans-serif', sample: 'AaBb' },
  { name: 'Segoe UI', font: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', sample: 'AaBb' },
  { name: 'Trebuchet MS', font: '"Trebuchet MS", sans-serif', sample: 'AaBb' },
  { name: 'Verdana', font: 'Verdana, Geneva, sans-serif', sample: 'AaBb' },
];

const FONT_SIZES = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '36', '48', '72'];

// Page size presets
interface PageFormat {
  id: string;
  name: string;
  width: number;  // px in 96 DPI
  height: number; // px in 96 DPI
  unitDesc: string;
}

const PAGE_FORMATS: PageFormat[] = [
  { id: 'a4', name: 'A4', width: 794, height: 1123, unitDesc: '210 x 297 mm' },
  { id: 'letter', name: 'Letter', width: 816, height: 1056, unitDesc: '8.5 x 11.0 in' },
  { id: 'legal', name: 'Legal', width: 816, height: 1344, unitDesc: '8.5 x 14.0 in' },
  { id: 'a3', name: 'A3', width: 1123, height: 1587, unitDesc: '297 x 420 mm' },
  { id: 'a5', name: 'A5', width: 559, height: 794, unitDesc: '148 x 210 mm' },
  { id: 'custom', name: 'Custom Invoice', width: 720, height: 960, unitDesc: '7.5 x 10 in' },
];

const PALETTE_COLORS = [
  '#000000', '#ffffff', '#475569', '#94a3b8', '#cbd5e1',
  '#dc2626', '#ea580c', '#d97706', '#16a34a', '#0284c7',
  '#2563eb', '#4f46e5', '#9333ea', '#db2777', '#78350f'
];

export default function ProfessionalWordEditor() {
  const [activeTab, setActiveTab] = useState<'Home' | 'Insert' | 'Layout'>('Home');
  const [selectedFont, setSelectedFont] = useState('Calibri, sans-serif');
  const [selectedSize, setSelectedSize] = useState('11');
  const [selectedPageSize, setSelectedPageSize] = useState<PageFormat>(PAGE_FORMATS[0]); // Default A4
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margins, setMargins] = useState<'normal' | 'narrow' | 'wide'>('normal');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Subscript,
      Superscript,
      TextStyle,
      FontFamily,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: `
      <h1 style="text-align: center;">Official Stationery Express Document</h1>
      <p style="text-align: center; color: #64748b;"><em>Professional Multi-Format Document Studio & Printing Station</em></p>
      <hr />
      <h2>1. Executive Summary</h2>
      <p>Compose resumes, contracts, formal invoices, and reports with full Microsoft Word capabilities. Switch page layouts between A4, Letter, and Legal with millimeter accuracy.</p>
      <h2>2. Document Specifications</h2>
      <ol>
        <li><strong>Standard Presets:</strong> Precise A4 printer margins ($210 \\times 297\\text{ mm}$) and Letter dimensions.</li>
        <li><strong>Rich Ribbon Toolbar:</strong> Font styles, subscripts ($H_2O$), superscripts ($E=mc^2$), and dynamic alignment.</li>
        <li><strong>Direct Print Integration:</strong> Single-click handoff directly into the Stationery Express print queue.</li>
      </ol>
    `,
    editorProps: {
      attributes: {
        class: 'tiptap focus:outline-none min-h-[900px] leading-relaxed text-slate-900',
      },
    },
  });

  if (!editor) return null;

  // Live document statistics
  const textContent = editor.getText().trim();
  const wordCount = textContent ? textContent.split(/\s+/).length : 0;
  const charCount = editor.getText().length;

  // Dynamic canvas sizing
  const canvasWidth = orientation === 'portrait' ? selectedPageSize.width : selectedPageSize.height;
  const canvasHeight = orientation === 'portrait' ? selectedPageSize.height : selectedPageSize.width;

  const marginPadding = {
    normal: 'p-16',   // 1 inch (approx 64px)
    narrow: 'p-8',    // 0.5 inch (approx 32px)
    wide: 'p-24',     // 1.5 inch (approx 96px)
  }[margins];

  // Actions
  const handleFontSelect = (font: string) => {
    setSelectedFont(font);
    editor.chain().focus().setFontFamily(font).run();
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    editor.chain().focus().setMark('textStyle', { style: `font-size: ${size}pt` }).run();
  };

  const handleColorSelect = (hex: string) => {
    editor.chain().focus().setColor(hex).run();
    setShowColorPicker(false);
  };

  const handleHighlightSelect = (hex: string) => {
    editor.chain().focus().setHighlight({ color: hex }).run();
    setShowHighlightPicker(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      editor.commands.setContent(`<p>${result.replace(/\n/g, '<br/>')}</p>`);
    };
    reader.readAsText(file);
  };

  const handleExportText = () => {
    const blob = new Blob([editor.getText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Document_${selectedPageSize.name}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#242424] flex flex-col select-none text-slate-200">
      {/* Title Bar */}
      <div className="bg-[#1e1e1e] border-b border-neutral-800 px-4 py-1.5 flex items-center justify-between text-xs text-neutral-300">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-blue-400 flex items-center gap-1.5">
            <FileText size={16} /> Document1 - Word
          </span>
          <span className="text-neutral-600">|</span>
          <div className="flex items-center space-x-1">
            <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-1 hover:bg-neutral-800 rounded disabled:opacity-30" title="Undo (Ctrl+Z)">
              <Undo size={14} />
            </button>
            <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-1 hover:bg-neutral-800 rounded disabled:opacity-30" title="Redo (Ctrl+Y)">
              <Redo size={14} />
            </button>
            <button onClick={handleExportText} className="p-1 hover:bg-neutral-800 rounded text-neutral-300" title="Quick Save">
              <Save size={14} />
            </button>
          </div>
        </div>

        {/* Global Search */}
        <div className="w-80 relative hidden md:block">
          <Search size={14} className="absolute left-2.5 top-2 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search commands (Alt + Q)" 
            className="w-full bg-[#2a2a2a] border border-neutral-700 rounded py-1 pl-8 pr-3 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-blue-500" 
          />
        </div>

        <div className="flex items-center space-x-2">
          <a
            href="/print"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1.5 rounded-md text-xs shadow-xs transition"
          >
            Send to Print Station &rarr;
          </a>
        </div>
      </div>

      {/* Ribbon Navigation Tabs */}
      <div className="bg-[#2b2b2b] border-b border-neutral-800 px-4 flex space-x-1 text-xs">
        {(['Home', 'Insert', 'Layout'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 font-medium transition-colors ${
              activeTab === tab 
                ? 'bg-[#1f1f1f] text-blue-400 border-b-2 border-blue-500' 
                : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Ribbon Toolbar */}
      <div className="bg-[#1f1f1f] border-b border-neutral-800 px-4 py-2.5 flex items-center gap-4 text-xs overflow-x-auto min-h-[64px]">
        {activeTab === 'Home' && (
          <>
            {/* Clipboard Group */}
            <div className="flex items-center space-x-1 border-r border-neutral-800 pr-3">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-1.5 hover:bg-neutral-800 rounded text-neutral-300" 
                title="Open Document"
              >
                <Upload size={16} />
                <span className="text-[10px] mt-0.5">Open</span>
                <input ref={fileInputRef} type="file" accept=".txt,.doc" className="hidden" onChange={handleImport} />
              </button>
              <button 
                onClick={handleExportText}
                className="flex flex-col items-center justify-center p-1.5 hover:bg-neutral-800 rounded text-neutral-300" 
                title="Export Text"
              >
                <Download size={16} />
                <span className="text-[10px] mt-0.5">Export</span>
              </button>
            </div>

            {/* Font Group */}
            <div className="flex items-center space-x-2 border-r border-neutral-800 pr-3">
              {/* Font Family Picker */}
              <select
                value={selectedFont}
                onChange={(e) => handleFontSelect(e.target.value)}
                className="bg-[#2a2a2a] text-neutral-200 border border-neutral-700 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500 w-44 font-medium"
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f.name} value={f.font} style={{ fontFamily: f.font }}>
                    {f.name}
                  </option>
                ))}
              </select>

              {/* Font Size Picker */}
              <select
                value={selectedSize}
                onChange={(e) => handleSizeSelect(e.target.value)}
                className="bg-[#2a2a2a] text-neutral-200 border border-neutral-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500 w-16 text-center font-medium"
              >
                {FONT_SIZES.map((sz) => (
                  <option key={sz} value={sz}>{sz}</option>
                ))}
              </select>
            </div>

            {/* Typography Formatting */}
            <div className="flex items-center space-x-1 border-r border-neutral-800 pr-3">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1.5 rounded hover:bg-neutral-800 ${editor.isActive('bold') ? 'bg-neutral-800 text-blue-400 font-bold' : 'text-neutral-300'}`}
                title="Bold (Ctrl+B)"
              >
                <Bold size={15} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded hover:bg-neutral-800 ${editor.isActive('italic') ? 'bg-neutral-800 text-blue-400' : 'text-neutral-300'}`}
                title="Italic (Ctrl+I)"
              >
                <Italic size={15} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-1.5 rounded hover:bg-neutral-800 ${editor.isActive('underline') ? 'bg-neutral-800 text-blue-400' : 'text-neutral-300'}`}
                title="Underline (Ctrl+U)"
              >
                <UnderlineIcon size={15} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-1.5 rounded hover:bg-neutral-800 ${editor.isActive('strike') ? 'bg-neutral-800 text-blue-400' : 'text-neutral-300'}`}
                title="Strikethrough"
              >
                <Strikethrough size={15} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleSubscript().run()}
                className={`p-1.5 rounded hover:bg-neutral-800 ${editor.isActive('subscript') ? 'bg-neutral-800 text-blue-400' : 'text-neutral-300'}`}
                title="Subscript"
              >
                <SubIcon size={15} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
                className={`p-1.5 rounded hover:bg-neutral-800 ${editor.isActive('superscript') ? 'bg-neutral-800 text-blue-400' : 'text-neutral-300'}`}
                title="Superscript"
              >
                <SuperIcon size={15} />
              </button>

              {/* Text Highlight Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowHighlightPicker(!showHighlightPicker)}
                  className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300 flex items-center"
                  title="Text Highlight"
                >
                  <Highlighter size={15} />
                  <ChevronDown size={10} className="ml-0.5 text-neutral-500" />
                </button>
                {showHighlightPicker && (
                  <div className="absolute top-8 left-0 z-50 bg-[#252525] border border-neutral-700 shadow-xl p-2 rounded grid grid-cols-4 gap-1 w-36">
                    {['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8'].map((c) => (
                      <button
                        key={c}
                        onClick={() => handleHighlightSelect(c)}
                        className="w-6 h-6 rounded border border-neutral-600 hover:scale-110"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Font Color Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300 flex items-center"
                  title="Font Color"
                >
                  <Palette size={15} />
                  <ChevronDown size={10} className="ml-0.5 text-neutral-500" />
                </button>
                {showColorPicker && (
                  <div className="absolute top-8 left-0 z-50 bg-[#252525] border border-neutral-700 shadow-xl p-3 rounded grid grid-cols-5 gap-2 w-48">
                    {PALETTE_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleColorSelect(c)}
                        className="w-6 h-6 rounded border border-neutral-600 hover:scale-110 transition"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Paragraph Alignment & Lists */}
            <div className="flex items-center space-x-1 border-r border-neutral-800 pr-3">
              <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-1.5 rounded hover:bg-neutral-800 ${editor.isActive({ textAlign: 'left' }) ? 'bg-neutral-800 text-blue-400' : 'text-neutral-300'}`}
                title="Align Left"
              >
                <AlignLeft size={15} />
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-1.5 rounded hover:bg-neutral-800 ${editor.isActive({ textAlign: 'center' }) ? 'bg-neutral-800 text-blue-400' : 'text-neutral-300'}`}
                title="Center"
              >
                <AlignCenter size={15} />
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-1.5 rounded hover:bg-neutral-800 ${editor.isActive({ textAlign: 'right' }) ? 'bg-neutral-800 text-blue-400' : 'text-neutral-300'}`}
                title="Align Right"
              >
                <AlignRight size={15} />
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={`p-1.5 rounded hover:bg-neutral-800 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-neutral-800 text-blue-400' : 'text-neutral-300'}`}
                title="Justify"
              >
                <AlignJustify size={15} />
              </button>
              <span className="w-px h-4 bg-neutral-800 mx-1" />
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-1.5 rounded hover:bg-neutral-800 ${editor.isActive('bulletList') ? 'bg-neutral-800 text-blue-400' : 'text-neutral-300'}`}
                title="Bullets"
              >
                <List size={15} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-1.5 rounded hover:bg-neutral-800 ${editor.isActive('orderedList') ? 'bg-neutral-800 text-blue-400' : 'text-neutral-300'}`}
                title="Numbering"
              >
                <ListOrdered size={15} />
              </button>
            </div>

            {/* Heading Presets */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`px-2 py-1 rounded hover:bg-neutral-800 text-xs font-semibold ${editor.isActive('heading', { level: 1 }) ? 'bg-neutral-800 text-blue-400' : 'text-neutral-300'}`}
              >
                H1
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`px-2 py-1 rounded hover:bg-neutral-800 text-xs font-semibold ${editor.isActive('heading', { level: 2 }) ? 'bg-neutral-800 text-blue-400' : 'text-neutral-300'}`}
              >
                H2
              </button>
            </div>
          </>
        )}

        {activeTab === 'Insert' && (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#252525] hover:bg-neutral-700 text-neutral-200 rounded border border-neutral-700"
            >
              <TableIcon size={15} /> Insert Table (3x3)
            </button>
            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#252525] hover:bg-neutral-700 text-neutral-200 rounded border border-neutral-700"
            >
              Horizontal Rule
            </button>
          </div>
        )}

        {activeTab === 'Layout' && (
          <div className="flex items-center space-x-6">
            {/* Page Size Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-neutral-400 text-xs">Size:</span>
              <select
                value={selectedPageSize.id}
                onChange={(e) => {
                  const found = PAGE_FORMATS.find((p) => p.id === e.target.value);
                  if (found) setSelectedPageSize(found);
                }}
                className="bg-[#2a2a2a] text-neutral-200 border border-neutral-700 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500 font-semibold"
              >
                {PAGE_FORMATS.map((format) => (
                  <option key={format.id} value={format.id}>
                    {format.name} ({format.unitDesc})
                  </option>
                ))}
              </select>
            </div>

            {/* Page Orientation */}
            <div className="flex items-center space-x-2">
              <span className="text-neutral-400 text-xs">Orientation:</span>
              <button
                onClick={() => setOrientation('portrait')}
                className={`px-3 py-1 rounded text-xs transition ${orientation === 'portrait' ? 'bg-blue-600 text-white font-bold' : 'bg-[#2a2a2a] text-neutral-300'}`}
              >
                Portrait
              </button>
              <button
                onClick={() => setOrientation('landscape')}
                className={`px-3 py-1 rounded text-xs transition ${orientation === 'landscape' ? 'bg-blue-600 text-white font-bold' : 'bg-[#2a2a2a] text-neutral-300'}`}
              >
                Landscape
              </button>
            </div>

            {/* Margins */}
            <div className="flex items-center space-x-2">
              <span className="text-neutral-400 text-xs">Margins:</span>
              <select
                value={margins}
                onChange={(e) => setMargins(e.target.value as any)}
                className="bg-[#2a2a2a] text-neutral-200 border border-neutral-700 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="normal">Normal (1.0 in)</option>
                <option value="narrow">Narrow (0.5 in)</option>
                <option value="wide">Wide (1.5 in)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Horizontal Margin Ruler */}
      <div className="bg-[#1e1e1e] border-b border-neutral-800 h-6 flex justify-center items-center overflow-hidden">
        <div 
          style={{ width: `${canvasWidth}px` }} 
          className="h-full flex items-center relative text-[9px] text-neutral-500 font-mono select-none px-12"
        >
          <div className="absolute left-6 top-1 text-neutral-400 font-bold">&#9660;</div>
          <div className="w-full flex justify-between border-b border-neutral-700 pb-0.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((num) => (
              <span key={num} className="flex-1 text-center border-r border-neutral-800 last:border-r-0">
                {num}
              </span>
            ))}
          </div>
          <div className="absolute right-6 top-1 text-neutral-400 font-bold">&#9660;</div>
        </div>
      </div>

      {/* Document Workspace */}
      <div className="flex-1 flex overflow-auto justify-center py-10 px-4 relative bg-[#181818]">
        {/* Scaled Page Canvas */}
        <div 
          style={{ 
            width: `${canvasWidth}px`, 
            minHeight: `${canvasHeight}px`,
            transform: `scale(${zoomLevel / 100})`, 
            transformOrigin: 'top center' 
          }} 
          className={`bg-white text-slate-900 shadow-2xl rounded-xs border border-neutral-400 ${marginPadding} transition-all duration-150`}
        >
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Microsoft Word Bottom Status Bar */}
      <footer className="bg-[#1e1e1e] border-t border-neutral-800 px-6 py-1.5 flex items-center justify-between text-xs text-neutral-400 select-none sticky bottom-0 z-20">
        <div className="flex items-center space-x-5">
          <span>Page 1 of 1</span>
          <span className="font-semibold text-neutral-200">{wordCount} words</span>
          <span>{charCount} characters</span>
          <span className="text-blue-400 font-medium">{selectedPageSize.name} ({orientation})</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400">
            <CheckCircle2 size={13} /> English (United States)
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setZoomLevel((prev) => Math.max(60, prev - 10))} 
            className="p-1 hover:bg-neutral-800 rounded text-neutral-300"
            title="Zoom Out"
          >
            <ZoomOut size={13} />
          </button>
          <input
            type="range"
            min="60"
            max="160"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(Number(e.target.value))}
            className="w-24 accent-blue-500 cursor-pointer"
          />
          <button 
            onClick={() => setZoomLevel((prev) => Math.min(160, prev + 10))} 
            className="p-1 hover:bg-neutral-800 rounded text-neutral-300"
            title="Zoom In"
          >
            <ZoomIn size={13} />
          </button>
          <button 
            onClick={() => setZoomLevel(100)}
            className="text-[11px] font-mono hover:text-white"
            title="Reset to 100%"
          >
            {zoomLevel}%
          </button>
        </div>
      </footer>
    </div>
  );
}
