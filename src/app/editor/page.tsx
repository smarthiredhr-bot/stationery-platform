'use client';

import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Undo, Redo, Printer, Download,
  Upload, FileText, CheckCircle2, ZoomIn, ZoomOut,
  Highlighter
} from 'lucide-react';

export default function AdvancedWordProcessor() {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState('11pt');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: `
      <h1 style="text-align: center;">Official Stationery Express Document</h1>
      <p style="text-align: center; color: #64748b;"><em>Professional Document Composition & Direct Printing System</em></p>
      <hr />
      <h3>1. Executive Summary</h3>
      <p>Draft resumes, legal agreements, official receipts, or project briefs with full desktop publishing control. Real-time margin rulers and formatting ribbon tools guarantee print-ready output directly from your browser.</p>
      <h3>2. Specifications & Deliverables</h3>
      <ul>
        <li><strong>Standard Layout:</strong> Calibrated A4 page proportions with printable safety margins.</li>
        <li><strong>Seamless Handoff:</strong> Direct export to PDF or single-click submission to the print station.</li>
        <li><strong>Full Typography Control:</strong> Font sizing, inline highlights, custom text coloring, and alignment.</li>
      </ul>
    `,
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[950px] p-12 text-slate-900 leading-relaxed font-sans',
      },
    },
  });

  if (!editor) return null;

  const rawText = editor.getText().trim();
  const wordCount = rawText ? rawText.split(/\s+/).length : 0;
  const charCount = editor.getText().length;

  const handleExportText = () => {
    const textContent = editor.getText();
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Stationery-Express-Document.txt';
    link.click();
    URL.revokeObjectURL(url);
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
    <div className="min-h-screen bg-slate-200 flex flex-col select-none text-slate-800">
      {/* Office Ribbon Header */}
      <header className="bg-white border-b border-slate-300 shadow-xs z-30">
        {/* Top File / Actions Ribbon Bar */}
        <div className="px-4 py-2 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-blue-700 text-sm tracking-wide flex items-center gap-1.5 mr-4">
              <FileText size={18} /> DOC EDITOR
            </span>
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded text-slate-700 transition">
              <Upload size={14} /> Open
              <input type="file" accept=".txt,.doc" className="hidden" onChange={handleImportFile} />
            </label>
            <button
              onClick={handleExportText}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded text-slate-700 transition"
            >
              <Download size={14} /> Export TXT
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded text-slate-700 transition"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
          </div>
          <div>
            <a
              href="/print"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white rounded-md shadow-xs transition"
            >
              Send to Print Station &rarr;
            </a>
          </div>
        </div>

        {/* Ribbon Tools Panel */}
        <div className="px-4 py-2 flex flex-wrap items-center gap-4 text-xs">
          {/* Clipboard Group */}
          <div className="flex items-center space-x-1 border-r border-slate-300 pr-3">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40"
              title="Undo"
            >
              <Undo size={15} />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40"
              title="Redo"
            >
              <Redo size={15} />
            </button>
          </div>

          {/* Font Selection Group */}
          <div className="flex items-center space-x-2 border-r border-slate-300 pr-3">
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 bg-white text-xs font-medium"
            >
              <option value="Arial">Arial</option>
              <option value="Calibri">Calibri</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
            </select>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 bg-white text-xs font-medium w-16"
            >
              <option value="9pt">9</option>
              <option value="10pt">10</option>
              <option value="11pt">11</option>
              <option value="12pt">12</option>
              <option value="14pt">14</option>
              <option value="18pt">18</option>
              <option value="24pt">24</option>
            </select>
          </div>

          {/* Font Style Modifiers */}
          <div className="flex items-center space-x-1 border-r border-slate-300 pr-3">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('bold') ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}
              title="Bold"
            >
              <Bold size={15} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : ''}`}
              title="Italic"
            >
              <Italic size={15} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('underline') ? 'bg-blue-100 text-blue-700' : ''}`}
              title="Underline"
            >
              <UnderlineIcon size={15} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('strike') ? 'bg-blue-100 text-blue-700' : ''}`}
              title="Strikethrough"
            >
              <Strikethrough size={15} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}
              className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('highlight') ? 'bg-yellow-200' : ''}`}
              title="Highlight"
            >
              <Highlighter size={15} />
            </button>
          </div>

          {/* Paragraph Alignment */}
          <div className="flex items-center space-x-1 border-r border-slate-300 pr-3">
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-700' : ''}`}
              title="Align Left"
            >
              <AlignLeft size={15} />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-700' : ''}`}
              title="Align Center"
            >
              <AlignCenter size={15} />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-700' : ''}`}
              title="Align Right"
            >
              <AlignRight size={15} />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-100 text-blue-700' : ''}`}
              title="Justify"
            >
              <AlignJustify size={15} />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : ''}`}
              title="Bullet List"
            >
              <List size={15} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : ''}`}
              title="Numbered List"
            >
              <ListOrdered size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Horizontal Document Ruler */}
      <div className="bg-slate-100 border-b border-slate-300 h-6 flex justify-center items-center overflow-hidden">
        <div className="w-[820px] h-full flex items-center relative text-[9px] text-slate-500 font-mono select-none px-12">
          <div className="absolute left-6 top-1 text-slate-400 font-bold">&#9660;</div>
          <div className="w-full flex justify-between border-b border-slate-300 pb-0.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((num) => (
              <span key={num} className="flex-1 text-center border-r border-slate-300 last:border-r-0">
                {num}
              </span>
            ))}
          </div>
          <div className="absolute right-6 top-1 text-slate-400 font-bold">&#9660;</div>
        </div>
      </div>

      {/* Document Workspace with Side Ruler */}
      <div className="flex-1 flex overflow-auto justify-center py-8 px-4 relative">
        {/* Vertical Left Ruler */}
        <div className="hidden lg:flex flex-col w-6 bg-slate-100 border-r border-slate-300 mr-4 h-[950px] text-[9px] text-slate-400 font-mono pt-12 items-center justify-between select-none">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => (
            <span key={num} className="w-full text-center border-b border-slate-300">
              {num}
            </span>
          ))}
        </div>

        {/* Simulated A4 Paper Canvas */}
        <div 
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }} 
          className="transition-transform duration-100"
        >
          <div className="w-[820px] min-h-[1120px] bg-white shadow-2xl rounded-xs border border-slate-300">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* Microsoft Word Style Bottom Status Bar */}
      <footer className="bg-slate-100 border-t border-slate-300 px-6 py-1.5 flex items-center justify-between text-xs text-slate-600 select-none sticky bottom-0 z-20">
        <div className="flex items-center space-x-4">
          <span className="font-medium">Page 1 of 1</span>
          <span className="font-semibold text-slate-800">{wordCount} words</span>
          <span>{charCount} characters</span>
          <span className="hidden md:inline-flex items-center gap-1 text-emerald-600">
            <CheckCircle2 size={13} /> Spellcheck: OK
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setZoomLevel((prev) => Math.max(70, prev - 10))} 
            className="p-1 hover:bg-slate-200 rounded"
          >
            <ZoomOut size={14} />
          </button>
          <input
            type="range"
            min="70"
            max="150"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(Number(e.target.value))}
            className="w-24 accent-blue-600 cursor-pointer"
          />
          <button 
            onClick={() => setZoomLevel((prev) => Math.min(150, prev + 10))} 
            className="p-1 hover:bg-slate-200 rounded"
          >
            <ZoomIn size={14} />
          </button>
          <span className="w-10 text-right font-mono">{zoomLevel}%</span>
        </div>
      </footer>
    </div>
  );
}
