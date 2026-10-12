'use client';

import React, { useState, useRef } from 'react';
import { 
  Camera, Upload, FileText, CheckCircle2, 
  Copy, Printer, RefreshCw, Wand2, Sliders 
} from 'lucide-react';

export default function DocumentScannerPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [enhancedMode, setEnhancedMode] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Pre-process canvas to make handwriting & low-contrast text sharp for OCR
  const preprocessImage = (imageSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageSrc);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        if (enhancedMode) {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;

          // Grayscale & dynamic high-contrast thresholding for ink
          for (let i = 0; i < data.length; i += 4) {
            const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            // Enhance contrast to isolate pencil/pen strokes from paper
            const threshold = avg > 140 ? 255 : avg < 90 ? 0 : avg;
            data[i] = threshold;
            data[i + 1] = threshold;
            data[i + 2] = threshold;
          }
          ctx.putImageData(imgData, 0, 0);
        }

        resolve(canvas.toDataURL('image/png'));
      };
      img.src = imageSrc;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const originalSrc = reader.result as string;
      setImagePreview(originalSrc);
      await runOCR(originalSrc);
    };
    reader.readAsDataURL(file);
  };

  const runOCR = async (rawSrc: string) => {
    setIsProcessing(true);
    setProgress(15);
    setStatusText('Enhancing document contrast & ink clarity...');
    setExtractedText('');

    try {
      const processedSrc = await preprocessImage(rawSrc);

      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng');

      setStatusText('Analyzing handwriting & character patterns...');
      setProgress(50);

      const ret = await worker.recognize(processedSrc);
      setProgress(100);
      setStatusText('Extraction Complete!');
      setExtractedText(ret.data.text.trim());

      await worker.terminate();
    } catch (err) {
      console.error(err);
      setStatusText('OCR scan failed. Try a clearer image with good lighting.');
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
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Container without redundant top bar */}
      <main className="max-w-6xl mx-auto px-4 pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Camera className="text-blue-600" size={24} /> Auto Handwriting & Document Scanner
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Upload photos of handwriting, paper notes, or forms. Enhanced contrast filters clean the image for accurate text recognition.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setEnhancedMode(!enhancedMode)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition ${
                enhancedMode 
                  ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold' 
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
              title="Enhance contrast for faint pen or pencil handwriting"
            >
              <Wand2 size={14} /> Handwriting Enhancement: {enhancedMode ? 'ON' : 'OFF'}
            </button>
            <a
              href="/print"
              className="text-xs px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition"
            >
              Go to Print Station &rarr;
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Image Upload & Preview */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-sm text-slate-800 mb-3 flex items-center gap-2">
                <Upload size={16} className="text-blue-600" /> Source Document or Photo
              </h3>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-blue-50/40 transition group min-h-[300px]"
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
                      className="max-h-72 object-contain rounded-md shadow-xs border border-slate-200 mb-3"
                    />
                    <span className="text-xs font-semibold text-blue-600 group-hover:underline">
                      Click to choose another photo
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                      <Camera size={26} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">Take Photo or Upload Image</span>
                    <span className="text-xs text-slate-400 mt-1">Supports Clear Photos of Paper, Forms & Handwriting</span>
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
                    <Printer size={13} /> Print
                  </button>
                </div>
              )}
            </div>

            <textarea
              readOnly={isProcessing}
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              placeholder="Extracted words will appear here automatically. You can edit and correct any recognized words directly in this box."
              className="flex-1 w-full min-h-[320px] border border-slate-200 rounded-lg p-4 text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:border-blue-500 bg-slate-50 resize-y"
            />

            {extractedText && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{extractedText.trim().split(/\s+/).filter(Boolean).length} words recognized</span>
                <a
                  href="/print"
                  className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Send text to Printing Station &rarr;
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
