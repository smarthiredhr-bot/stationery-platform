import { PDFDocument } from 'pdf-lib';

export interface PrintJobSpecs {
  colorMode: 'BW' | 'COLOR';
  paperSize: 'A4' | 'A3';
  isDoubleSided: boolean;
  copies: number;
  binding?: 'NONE' | 'SPIRAL' | 'HARD';
  lamination?: boolean;
}

export interface PricingRates {
  bwA4Rate: number;        // e.g., UGX 200
  colorA4Rate: number;     // e.g., UGX 1,000
  bwA3Rate: number;        // e.g., UGX 500
  colorA3Rate: number;     // e.g., UGX 2,500
  duplexMultiplier: number;// e.g., 0.9 (10% discount for double-sided)
  spiralBindingRate: number; // UGX 3,000
  hardBindingRate: number;   // UGX 10,000
  laminationRate: number;    // UGX 2,000
}

export const defaultRates: PricingRates = {
  bwA4Rate: 200,
  colorA4Rate: 1000,
  bwA3Rate: 500,
  colorA3Rate: 2500,
  duplexMultiplier: 0.9,
  spiralBindingRate: 3000,
  hardBindingRate: 10000,
  laminationRate: 2000,
};

export async function getPdfPageCount(arrayBuffer: ArrayBuffer): Promise<number> {
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  return pdfDoc.getPageCount();
}

export function calculatePrintCost(
  pages: number,
  specs: PrintJobSpecs,
  rates: PricingRates = defaultRates
) {
  let baseRate = specs.colorMode === 'COLOR' ? rates.colorA4Rate : rates.bwA4Rate;
  if (specs.paperSize === 'A3') {
    baseRate = specs.colorMode === 'COLOR' ? rates.colorA3Rate : rates.bwA3Rate;
  }

  const sheets = specs.isDoubleSided ? Math.ceil(pages / 2) : pages;
  const costPerSheet = specs.isDoubleSided ? baseRate * 2 * rates.duplexMultiplier : baseRate;
  const printTotal = sheets * costPerSheet * specs.copies;

  let finishingTotal = 0;
  if (specs.binding === 'SPIRAL') finishingTotal += rates.spiralBindingRate * specs.copies;
  if (specs.binding === 'HARD') finishingTotal += rates.hardBindingRate * specs.copies;
  if (specs.lamination) finishingTotal += rates.laminationRate * sheets * specs.copies;

  return {
    pages,
    sheets,
    printTotal,
    finishingTotal,
    grandTotal: printTotal + finishingTotal,
  };
}
