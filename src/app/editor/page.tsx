'use client';

import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
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
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Undo, Redo, Printer, Download,
  Upload, FileText, CheckCircle2, ZoomIn, ZoomOut,
  Highlighter, Table as TableIcon, Heading1, Heading2,
  ChevronDown, Palette, Type, Search
} from 'lucide-react';

const FONT_OPTIONS = [
  { name: 'Calibri', value: 'Calibri, sans-serif' },
  { name: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { name: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { name: 'Arial Black', value: '"Arial Black", sans-serif' },
  { name: 'Courier New', value: '"Courier New", Courier, monospace' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Garamond', value: 'Garamond, serif' },
  { name: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
];

const FONT_SIZES = ['8pt', '9pt', '10pt', '11pt', '12pt', '14pt', '16pt', '18pt', '20pt', '24pt', '28pt', '36pt', '48pt', '72pt'];

const THEME_COLORS = [
  '#000000', '#ffffff', '#e2e8f0', '#94a3b8', '#64748b',
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#78350f'
];

export default function MicrosoftWordEditor() {
  const [activeTab, setActiveTab] = useState<'Home' | 'Insert' | 'Design' | 'Layout'>('Home');
  const [selectedFont, setSelectedFont] = useState('Calibri, sans-serif');
  const [selectedSize, setSelectedSize] = useState('11pt');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
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
      <p style="text-align: center; color: #64748b;"><em>Professional Document Composition & Direct Printing System</em></p>
      <hr />
      <h2>1. Executive Summary</h2>
      <p>Draft resumes, official letters, legal drafts, or academic reports with true Microsoft Word controls. Every font family, point size, margin ruler, and table renders print-ready in real time.</p>
      <h2>2. Deliverables & Specifications</h2>
      <ol>
        <li><strong>Standard Proportions:</strong> Calibrated A4 layout dimensions.</li>
        <li><strong>Automated Calculation:</strong> Real-time word, character, and sheet counting.</li>
        <li><strong>Direct Print Handoff:</strong> Send straight to the Stationery Express printing station or export to PDF.</li>
      </ol>
    `,
    editorProps: {
      attributes: {
        class: 'tiptap focus:outline-none min-h-[960px] p-16 text-slate-900 leading-relaxed bg-white',
      },
    },
  });

  if (!editor) return null;

  const rawText = editor.getText().trim();
  const wordCount = rawText ? rawText.split(/\s+/).length : 0;
  const charCount = editor.getText().length;

  const handleFontChange = (fontValue: string) => {
    setSelectedFont(fontValue);
    editor.chain().focus().setFontFamily(fontValue).run();
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    editor.chain().focus().setMark('textStyle', { style: `font-size: ${size}` }).run();
  };

  const handleApplyColor = (hex: string) => {
    editor.chain().focus().setColor(hex).run();
    setShowColorPicker(false);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      editor.commands.setContent(`<pre>${content}</pre>`);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#2b2b2b] flex flex-col select-none text-slate-200">
      {/* Top Application Bar */}
      <div className="bg-[#1f1f1f] border-b border-neutral-800 px-4 py-2 flex items-center justify-between text-xs text-neutral-300">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-blue-400 flex items-center gap-1.5">
            <FileText size={16} /> Document1 - Word
          </span>
          <span className="text-neutral-500">|</span>
          <div className="flex items-center space-x-1">
            <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-1 hover:bg-neutral-800 rounded disabled:opacity-30">
              <Undo size={14} />
            </button>
            <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-1 hover:bg-neutral-800 rounded disabled:opacity-30">
              <Redo size={14} />
            </button>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="w-80 relative hidden md:block">
          <Search size={14} className="absolute left-2.5 top-2 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search (Alt + Q)" 
            className="w-full bg-[#2d2d2d] border border-neutral-700 rounded-md py-1 pl-8 pr-3 text-xs text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-blue-500" 
          />
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/print"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1 rounded text-xs transition"
          >
            Send to Print Station &rarr;
          </a>
        </div>
      </div>

      {/* Office Ribbon Navigation Tabs */}
      <div className="bg-[#242424] border-b border-neutral-700 px-3 flex space-x-1 text-xs">
        {(['Home', 'Insert', 'Design', 'Layout'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 font-medium transition-all ${
              activeTab === tab 
                ? 'bg-[#2b2b2b] text-blue-400 border-b-2 border-blue-500' 
                : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Ribbon Tool Toolbar */}
      <div className="bg-[#2b2b2b] border-b border-neutral-700 px-4 py-2.5 flex items-center gap-4 text-xs overflow-x-auto min-h-[58px]">
        {activeTab === 'Home' && (
          <>
            <div className="flex items-center space-x-1 border-r border-neutral-700 pr-3">
              <label className="p-1.5 hover:bg-neutral-700 rounded cursor-pointer text-neutral-300" title="Open File">
                <Upload size={15} />
                <input type="file" accept=".txt" className="hidden" onChange={handleImportFile} />
              </label>
            </div>

            {/* Font Picker */}
            <div className="flex items-center space-x-2 border-r border-neutral-700 pr-3">
              <select
                value={selectedFont}
                onChange={(e) => handleFontChange(e.target.value)}
                className="bg-[#1f1f1f] text-neutral-200 border border-neutral-700 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500 w-40"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.name} value={f.value} style={{ fontFamily: f.value }}>
                    {f.name}
                  </option>
                ))}
              </select>

              {/* Font Size */}
              <select
                value={selectedSize}
                onChange={(e) => handleSizeChange(e.target.value)}
                className="bg-[#1f1f1f] text-neutral-200 border border-neutral-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500 w-16"
              >
                {FONT_SIZES.map((sz) => (
                  <option key={sz} value={sz}>{sz.replace('pt', '')}</option>
                ))}
              </select>
            </div>

            {/* Basic Modifiers */}
            <div className="flex items-center space-x-1 border-r border-neutral-700 pr-3">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1.5 rounded hover:bg-neutral-700 ${editor.isActive('bold') ? 'bg-neutral-700 text-blue-400 font-bold' : 'text-neutral-300'}`}
                title="Bold (Ctrl+B)"
              >
                <Bold size={15} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded hover:bg-neutral-700 ${editor.isActive('italic') ? 'bg-neutral-700 text-blue-400' : 'text-neutral-300'}`}
                title="Italic (Ctrl+I)"
              >
                <Italic size={15} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-1.5 rounded hover:bg-neutral-700 ${editor.isActive('underline') ? 'bg-neutral-700 text-blue-400' : 'text-neutral-300'}`}
                title="Underline (Ctrl+U)"
              >
                <UnderlineIcon size={15} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-1.5 rounded hover:bg-neutral-700 ${editor.isActive('strike') ? 'bg-neutral-700 text-blue-400' : 'text-neutral-300'}`}
                title="Strikethrough"
              >
                <Strikethrough size={15} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}
                className={`p-1.5 rounded hover:bg-neutral-700 ${editor.isActive('highlight') ? 'bg-yellow-400 text-black' : 'text-neutral-300'}`}
                title="Text Highlight Color"
              >
                <Highlighter size={15} />
              </button>

              {/* Font Color Picker Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-1.5 rounded hover:bg-neutral-700 text-neutral-300 flex items-center gap-0.5"
                  title="Font Color"
                >
                  <Palette size={15} />
                  <ChevronDown size={11} />
                </button>
                {showColorPicker && (
                  <div className="absolute top-8 left-0 z-50 bg-[#1f1f1f] border border-neutral-700 shadow-xl p-3 rounded grid grid-cols-5 gap-2 w-48">
                    {THEME_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleApplyColor(c)}
                        className="w-6 h-6 rounded border border-neutral-600 hover:scale-110 transition"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Alignment & Lists */}
            <div className="flex items-center space-x-1 border-r border-neutral-700 pr-3">
              <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-1.5 rounded hover:bg-neutral-700 ${editor.isActive({ textAlign: 'left' }) ? 'bg-neutral-700 text-blue-400' : 'text-neutral-300'}`}
                title="Align Left"
              >
                <AlignLeft size={15} />
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-1.5 rounded hover:bg-neutral-700 ${editor.isActive({ textAlign: 'center' }) ? 'bg-neutral-700 text-blue-400' : 'text-neutral-300'}`}
                title="Center"
              >
                <AlignCenter size={15} />
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-1.5 rounded hover:bg-neutral-700 ${editor.isActive({ textAlign: 'right' }) ? 'bg-neutral-700 text-blue-400' : 'text-neutral-300'}`}
                title="Align Right"
              >
                <AlignRight size={15} />
              </button>
              <button
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={`p-1.5 rounded hover:bg-neutral-700 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-neutral-700 text-blue-400' : 'text-neutral-300'}`}
                title="Justify"
              >
                <AlignJustify size={15} />
              </button>
              <span className="w-px h-4 bg-neutral-700 mx-1" />
              {/* Working Bullet & Number Lists */}
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-1.5 rounded hover:bg-neutral-700 ${editor.isActive('bulletList') ? 'bg-neutral-700 text-blue-400' : 'text-neutral-300'}`}
                title="Bullets"
              >
                <List size={15} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-1.5 rounded hover:bg-neutral-700 ${editor.isActive('orderedList') ? 'bg-neutral-700 text-blue-400' : 'text-neutral-300'}`}
                title="Numbering"
              >
                <ListOrdered size={15} />
              </button>
            </div>

            {/* Quick Headings */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-1.5 rounded hover:bg-neutral-700 ${editor.isActive('heading', { level: 1 }) ? 'bg-neutral-700 text-blue-400' : 'text-neutral-300'}`}
                title="Heading 1"
              >
                <Heading1 size={15} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-1.5 rounded hover:bg-neutral-700 ${editor.isActive('heading', { level: 2 }) ? 'bg-neutral-700 text-blue-400' : 'text-neutral-300'}`}
                title="Heading 2"
              >
                <Heading2 size={15} />
              </button>
            </div>
          </>
        )}

        {activeTab === 'Insert' && (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1f1f1f] hover:bg-neutral-700 text-neutral-200 rounded border border-neutral-700"
            >
              <TableIcon size={15} /> Insert 3x3 Table
            </button>
            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1f1f1f] hover:bg-neutral-700 text-neutral-200 rounded border border-neutral-700"
            >
              Horizontal Rule / Divider
            </button>
          </div>
        )}

        {activeTab === 'Design' && (
          <div className="flex items-center space-x-3 text-neutral-300 text-xs">
            <span>Themes: Modern, Formal, Elegant</span>
            <span className="text-neutral-500">|</span>
            <span>Standard Margins: 1.0 inch</span>
          </div>
        )}

        {activeTab === 'Layout' && (
          <div className="flex items-center space-x-3 text-neutral-300 text-xs">
            <span>Orientation: Portrait</span>
            <span className="text-neutral-500">|</span>
            <span>Page Size: A4 Standard (210 x 297mm)</span>
          </div>
        )}
      </div>

      {/* Horizontal Ruler Bar */}
      <div className="bg-[#1f1f1f] border-b border-neutral-800 h-6 flex justify-center items-center overflow-hidden">
        <div className="w-[820px] h-full flex items-center relative text-[9px] text-neutral-400 font-mono select-none px-16">
          <div className="absolute left-10 top-1 text-neutral-400 font-bold">&#9660;</div>
          <div className="w-full flex justify-between border-b border-neutral-700 pb-0.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((num) => (
              <span key={num} className="flex-1 text-center border-r border-neutral-700 last:border-r-0">
                {num}
              </span>
            ))}
          </div>
          <div className="absolute right-10 top-1 text-neutral-400 font-bold">&#9660;</div>
        </div>
      </div>

      {/* Workspace Area with Vertical Margin Ruler and A4 Paper Canvas */}
      <div className="flex-1 flex overflow-auto justify-center py-10 px-4 relative bg-[#202020]">
        {/* Vertical Left Margin Ruler */}
        <div className="hidden lg:flex flex-col w-6 bg-[#1f1f1f] border-r border-neutral-800 mr-4 h-[1120px] text-[9px] text-neutral-400 font-mono pt-16 items-center justify-between select-none">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => (
            <span key={num} className="w-full text-center border-b border-neutral-800">
              {num}
            </span>
          ))}
        </div>

        {/* Scaled A4 Simulated Page */}
        <div 
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }} 
          className="transition-transform duration-100"
        >
          <div className="w-[820px] min-h-[1160px] bg-white shadow-2xl rounded-xs border border-neutral-400">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* Word Desktop Status Bar */}
      <footer className="bg-[#1f1f1f] border-t border-neutral-800 px-6 py-1 flex items-center justify-between text-xs text-neutral-400 select-none sticky bottom-0 z-20">
        <div className="flex items-center space-x-5">
          <span>Page 1 of 1</span>
          <span className="font-medium text-neutral-200">{wordCount} words</span>
          <span>{charCount} characters</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400">
            <CheckCircle2 size={13} /> English (United States)
          </span>
        </div>

        {/* Zoom Slider Controls */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setZoomLevel((prev) => Math.max(70, prev - 10))} 
            className="p-1 hover:bg-neutral-800 rounded text-neutral-300"
          >
            <ZoomOut size={13} />
          </button>
          <input
            type="range"
            min="70"
            max="150"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(Number(e.target.value))}
            className="w-24 accent-blue-500 cursor-pointer"
          />
          <button 
            onClick={() => setZoomLevel((prev) => Math.min(150, prev + 10))} 
            className="p-1 hover:bg-neutral-800 rounded text-neutral-300"
          >
            <ZoomIn size={13} />
          </button>
          <span className="w-10 text-right font-mono text-neutral-200">{zoomLevel}%</span>
        </div>
      </footer>
    </div>
  );
}
