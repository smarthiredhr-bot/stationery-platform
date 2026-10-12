'use client';

import React, { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { 
  Camera, Upload, FileText, CheckCircle2, 
  Copy, Printer, RefreshCw, AlertCircle, ArrowRight 
} from 'lucide-react';

export default function DocumentScannerPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      processOCR(file);
    };
    reader.readAsDataURL(file);
  };

  const processOCR = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setStatusText('Initializing OCR Scanner Engine...');
    setExtractedText('');

    try {
      const worker = await createWorker('eng');
      
      setStatusText('Analyzing handwriting and document layout...');
      setProgress(40);

      const ret = await worker.recognize(file);
      setProgress(100);
      setStatusText('Extraction Complete!');
      setExtractedText(ret.data.text.trim());

      await worker.terminate();
    } catch (err) {
      console.error(err);
      setStatusText('Failed to read image. Please ensure text is clear.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-20 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-extrabold text-lg text-blue-600 tracking-tight">Stationery Express</span>
            <span className="text-slate-300">|</span>
            <h1 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <Camera size={16} className="text-blue-600" /> Handwriting & Document OCR Scanner
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <a
              href="/print"
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded transition"
            >
              Print Station
            </a>
            <a
              href="/print"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
            >
              Order Print <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Auto Handwriting & Physical Doc Scanner</h2>
          <p className="text-sm text-slate-600 mt-1">
            Upload or capture photos of handwritten notes, paper applications, forms, or printed receipts. We automatically convert handwriting into clean digital text ready for printing or copying.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Image Upload & Preview */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-sm text-slate-800 mb-3 flex items-center gap-2">
                <Upload size={16} className="text-blue-600" /> Upload Source Document / Photo
              </h3>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-blue-50/40 transition group min-h-[260px]"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {imagePreview ? (
                  <div className="w-full flex flex-col items-center">
                    <img
                      src={imagePreview}
                      alt="Uploaded Document"
                      className="max-h-64 object-contain rounded-md shadow-xs border border-slate-200 mb-3"
                    />
                    <span className="text-xs font-semibold text-blue-600 group-hover:underline">
                      Click to choose another photo
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                      <Camera size={24} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">Take Photo or Upload Image</span>
                    <span className="text-xs text-slate-400 mt-1">Supports PNG, JPG, JPEG (Handwriting or Print)</span>
                  </>
                )}
              </div>
            </div>

            {/* OCR Processing Bar */}
            {isProcessing && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between text-xs font-semibold text-blue-800 mb-2">
                  <span className="flex items-center gap-1.5">
                    <RefreshCw size={14} className="animate-spin" /> {statusText}
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Extracted Digital Text */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                <FileText size={16} className="text-emerald-600" /> Extracted Digital Text
              </h3>
              {extractedText && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition font-medium"
                  >
                    {copied ? <CheckCircle2 size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    {copied ? 'Copied' : 'Copy Text'}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition font-medium"
                  >
                    <Printer size={13} /> Print Text
                  </button>
                </div>
              )}
            </div>

            <textarea
              readOnly={isProcessing}
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              placeholder="Captured handwriting and document text will appear here automatically. You can also edit and correct the text directly in this box."
              className="flex-1 w-full min-h-[300px] border border-slate-200 rounded-lg p-4 text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:border-blue-500 bg-slate-50 resize-y"
            />

            {extractedText && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{extractedText.trim().split(/\s+/).filter(Boolean).length} words extracted</span>
                <a
                  href="/print"
                  className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Send this text to the Printing Station &rarr;
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
