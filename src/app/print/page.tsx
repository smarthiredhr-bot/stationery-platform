'use client';

import React, { useState, ChangeEvent } from 'react';
import { getPdfPageCount, calculatePrintCost, PrintJobSpecs } from '@/lib/print-calculator';

export default function PrintEstimatorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [specs, setSpecs] = useState<PrintJobSpecs>({
    colorMode: 'BW',
    paperSize: 'A4',
    isDoubleSided: false,
    copies: 1,
    binding: 'NONE',
    lamination: false,
  });

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    if (selectedFile.type === 'application/pdf') {
      setAnalyzing(true);
      try {
        const buffer = await selectedFile.arrayBuffer();
        const pages = await getPdfPageCount(buffer);
        setPageCount(pages);
      } catch (err) {
        console.error('Failed to parse PDF', err);
        setPageCount(1);
      } finally {
        setAnalyzing(false);
      }
    } else {
      setPageCount(1);
    }
  };

  const cost = calculatePrintCost(pageCount || 1, specs);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Automated Printing & Pricing</h1>
          <p className="mt-2 text-sm text-slate-600">
            Upload your document for instant page analysis, select specifications, and submit your print job.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors bg-white">
              <input
                type="file"
                id="docUpload"
                accept=".pdf,.docx,.doc"
                className="hidden"
                onChange={handleFileUpload}
              />
              <label htmlFor="docUpload" className="cursor-pointer flex flex-col items-center">
                <span className="text-base font-semibold text-blue-600 hover:text-blue-500">
                  {file ? file.name : 'Upload PDF or Document'}
                </span>
                <span className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX up to 50MB</span>
              </label>
              {analyzing && <p className="mt-2 text-xs text-amber-600 font-medium">Analyzing pages...</p>}
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 border-b pb-2">Print Configuration</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Color Mode</label>
                  <select
                    value={specs.colorMode}
                    onChange={(e) => setSpecs({ ...specs, colorMode: e.target.value as 'BW' | 'COLOR' })}
                    className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm"
                  >
                    <option value="BW">Black & White</option>
                    <option value="COLOR">Full Colour</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Paper Size</label>
                  <select
                    value={specs.paperSize}
                    onChange={(e) => setSpecs({ ...specs, paperSize: e.target.value as 'A4' | 'A3' })}
                    className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm"
                  >
                    <option value="A4">A4 Standard</option>
                    <option value="A3">A3 Large Format</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Sides</label>
                  <select
                    value={specs.isDoubleSided ? 'true' : 'false'}
                    onChange={(e) => setSpecs({ ...specs, isDoubleSided: e.target.value === 'true' })}
                    className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm"
                  >
                    <option value="false">Single-Sided</option>
                    <option value="true">Double-Sided (Duplex)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Copies</label>
                  <input
                    type="number"
                    min="1"
                    value={specs.copies}
                    onChange={(e) => setSpecs({ ...specs, copies: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Binding</label>
                  <select
                    value={specs.binding}
                    onChange={(e) => setSpecs({ ...specs, binding: e.target.value as 'NONE' | 'SPIRAL' | 'HARD' })}
                    className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm"
                  >
                    <option value="NONE">No Binding</option>
                    <option value="SPIRAL">Spiral Binding</option>
                    <option value="HARD">Hard Cover Binding</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <input
                    type="checkbox"
                    id="lamination"
                    checked={specs.lamination}
                    onChange={(e) => setSpecs({ ...specs, lamination: e.target.checked })}
                    className="h-4 w-4 text-blue-600 rounded border-slate-300"
                  />
                  <label htmlFor="lamination" className="ml-2 text-sm text-slate-700">Lamination</label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 h-fit space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 border-b pb-2">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Detected Pages:</span>
                <span className="font-semibold text-slate-900">{pageCount}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Physical Sheets:</span>
                <span className="font-semibold text-slate-900">{cost.sheets * specs.copies}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Print Charge:</span>
                <span>UGX {cost.printTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Finishing & Add-ons:</span>
                <span>UGX {cost.finishingTotal.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-base font-bold text-slate-900">
                <span>Estimated Total:</span>
                <span className="text-blue-600">UGX {cost.grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              disabled={!file}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
