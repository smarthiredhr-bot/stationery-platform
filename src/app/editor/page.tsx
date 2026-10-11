'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  Heading1, Heading2, List, ListOrdered, 
  AlignLeft, Download, Printer 
} from 'lucide-react';

export default function WordProcessorPage() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content: `
      <h2>Welcome to the Stationery Express Document Editor</h2>
      <p>Draft your resumes, official letters, legal drafts, or academic reports directly in your browser.</p>
      <p>Features include:</p>
      <ul>
        <li>Standard typography styles</li>
        <li>Print-ready margins and layout</li>
        <li>Instant export for printing or digital delivery</li>
      </ul>
    `,
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[750px] p-8 text-slate-800 leading-relaxed',
      },
    },
  });

  if (!editor) return null;

  const wordCount = editor.storage?.characterCount?.words?.() || 
    editor.getText().trim().split(/\s+/).filter(Boolean).length;
  const charCount = editor.getText().length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Application Toolbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center space-x-1 border border-slate-200 rounded-lg p-1 bg-slate-50">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('bold') ? 'bg-white shadow-xs font-bold text-blue-600' : 'text-slate-700'}`}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('italic') ? 'bg-white shadow-xs text-blue-600' : 'text-slate-700'}`}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('underline') ? 'bg-white shadow-xs text-blue-600' : 'text-slate-700'}`}
            title="Underline"
          >
            <UnderlineIcon size={16} />
          </button>
          <span className="w-px h-5 bg-slate-300 mx-1" />
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-white shadow-xs font-bold text-blue-600' : 'text-slate-700'}`}
            title="Heading 1"
          >
            <Heading1 size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-white shadow-xs font-bold text-blue-600' : 'text-slate-700'}`}
            title="Heading 2"
          >
            <Heading2 size={16} />
          </button>
          <span className="w-px h-5 bg-slate-300 mx-1" />
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('bulletList') ? 'bg-white shadow-xs text-blue-600' : 'text-slate-700'}`}
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-white transition-colors ${editor.isActive('orderedList') ? 'bg-white shadow-xs text-blue-600' : 'text-slate-700'}`}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-xs text-slate-500 mr-2 hidden sm:block">
            <span>{wordCount} words</span> &bull; <span>{charCount} characters</span>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
          >
            <Printer size={14} /> Print
          </button>
          <a
            href="/print"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
          >
            Send to Print Station
          </a>
        </div>
      </header>

      {/* A4 Workspace Simulation */}
      <main className="flex-1 py-10 px-4 flex justify-center overflow-auto">
        <div className="w-full max-w-[800px] bg-white shadow-lg rounded-sm border border-slate-200">
          <EditorContent editor={editor} />
        </div>
      </main>
    </div>
  );
}
