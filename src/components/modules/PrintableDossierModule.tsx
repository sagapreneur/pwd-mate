import React, { useState } from 'react';
import { useEstimatorStore } from '../../store/useEstimatorStore';
import {
  calculateDynamicItemRate,
  explodeMaterialConsumption,
  calculateMineralRoyalty,
  calculateTestingRegister,
} from '../../engine/calculationEngine';
import { exportFullMahaPwdExcel } from '../../utils/excelExporter';
import {
  Printer,
  Download,
  ArrowLeft,
  CheckSquare,
  Square,
  FileCheck2,
  Layers,
  BookmarkCheck,
} from 'lucide-react';

/**
 * Converts numbers into standard Indian Currency Words (Lakhs / Crores format)
 */
function numberToIndianWords(num: number): string {
  const rounded = Math.round(num);
  if (rounded === 0) return 'Zero Rupees Only';

  const singleDigits = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen',
  ];
  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety',
  ];

  function convertLessThanThousand(n: number): string {
    let str = '';
    if (n >= 100) {
      str += singleDigits[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + singleDigits[n % 10] : '') + ' ';
    } else if (n > 0) {
      str += singleDigits[n] + ' ';
    }
    return str;
  }

  let crore = Math.floor(rounded / 10000000);
  let lakh = Math.floor((rounded % 10000000) / 100000);
  let thousand = Math.floor((rounded % 100000) / 1000);
  let remainder = rounded % 1000;

  let result = 'Rupees ';
  if (crore > 0) {
    result += convertLessThanThousand(crore) + 'Crore ';
  }
  if (lakh > 0) {
    result += convertLessThanThousand(lakh) + 'Lakh ';
  }
  if (thousand > 0) {
    result += convertLessThanThousand(thousand) + 'Thousand ';
  }
  if (remainder > 0) {
    result += convertLessThanThousand(remainder);
  }
  result += 'Only';
  return result.replace(/\s+/g, ' ').trim();
}

export const PrintableDossierModule: React.FC = () => {
  const {
    facesheet,
    calculationRollup,
    items,
    leadSettings,
    bbsElements,
    stamps,
    setActiveTab,
    loadGoldenMasterDemo,
    loadTrainingHomeDemo,
    loadLibraryDomeDemo,
  } = useEstimatorStore();

  // 18 Official Section visibility toggles matching S.P. OFF.WALL. Sample.xlsm
  const [includeCover, setIncludeCover] = useState(true);
  const [includeIndex, setIncludeIndex] = useState(true);
  const [includeEstimate, setIncludeEstimate] = useState(true);
  const [includeChecklist, setIncludeChecklist] = useState(true);
  const [includeCertificate, setIncludeCertificate] = useState(true);
  const [includeLetter, setIncludeLetter] = useState(true);
  const [includeParishishta, setIncludeParishishta] = useState(true);
  const [includeGenral, setIncludeGenral] = useState(true);
  const [includeGabs, setIncludeGabs] = useState(true);
  const [includeAbstract, setIncludeAbstract] = useState(true);
  const [includeMeasurment, setIncludeMeasurment] = useState(true);
  const [includeRateAna, setIncludeRateAna] = useState(true);
  const [includeRoyalty, setIncludeRoyalty] = useState(true);
  const [includeLead, setIncludeLead] = useState(true);
  const [includeTesting, setIncludeTesting] = useState(true);
  const [includeScheduleB, setIncludeScheduleB] = useState(true);
  const [includeConsumption, setIncludeConsumption] = useState(true);
  const [includeBbs, setIncludeBbs] = useState(true);

  // Quick Select/Deselect All
  const handleSelectAll = (val: boolean) => {
    setIncludeCover(val);
    setIncludeIndex(val);
    setIncludeEstimate(val);
    setIncludeChecklist(val);
    setIncludeCertificate(val);
    setIncludeLetter(val);
    setIncludeParishishta(val);
    setIncludeGenral(val);
    setIncludeGabs(val);
    setIncludeAbstract(val);
    setIncludeMeasurment(val);
    setIncludeRateAna(val);
    setIncludeRoyalty(val);
    setIncludeLead(val);
    setIncludeTesting(val);
    setIncludeScheduleB(val);
    setIncludeConsumption(val);
    setIncludeBbs(val);
  };

  // Compile Abstract Rows
  const abstractRows: {
    sr: number;
    itemCode: string;
    description: string;
    unit: string;
    floorTag: string;
    qty: number;
    rate: number;
    amount: number;
  }[] = [];

  let srCounter = 1;
  items.forEach((item) => {
    const floorGroups: Record<string, number> = {};
    item.measurements.forEach((m) => {
      floorGroups[m.floorTag] = (floorGroups[m.floorTag] || 0) + m.computedQty;
    });

    Object.entries(floorGroups).forEach(([floorTag, qty]) => {
      if (qty !== 0) {
        const rateResult = calculateDynamicItemRate(
          item.baseRate,
          leadSettings,
          item.consumptionFactors,
          facesheet.areaSurchargePercent,
          floorTag,
          item.scadaApplicable,
          facesheet.scadaDeductionActive,
          facesheet.scadaDeductionAmount,
          item.bitumenQtyPerUnit,
          facesheet.currentBitumenRate,
          facesheet.ssrBitumenRate
        );
        const amount = Number((qty * rateResult.finalRate).toFixed(2));
        abstractRows.push({
          sr: srCounter++,
          itemCode: item.itemCode,
          description: item.description,
          unit: item.unit,
          floorTag,
          qty,
          rate: rateResult.finalRate,
          amount,
        });
      }
    });
  });

  // Calculate Consumption, Royalty, Testing
  const { materialRows, materialTotals } = explodeMaterialConsumption(items);
  const { royaltyRows, totalRoyalty } = calculateMineralRoyalty(materialTotals);
  const { testRows, totalTestingCost } = calculateTestingRegister(materialTotals);

  // Rebar mass summary
  const totalBbsKg = bbsElements.reduce((acc, el) => acc + el.totalWeightKg, 0);
  const totalBbsMT = Number((totalBbsKg / 1000).toFixed(3));

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    exportFullMahaPwdExcel({
      facesheet,
      items,
      leadSettings,
      calculationRollup,
      bbsElements,
      stamps,
    });
  };

  // Reusable 3-Tier Official Signature Block Component (JE, SDE, EE)
  const MonochromaticSignatures = () => (
    <div className="mt-8 pt-4 border-t border-black text-center text-xs page-break-inside-avoid">
      <div className="grid grid-cols-3 gap-6">
        <div className="border border-black p-2">
          <div className="h-12 border-b border-dashed border-black/40 mb-1 flex items-end justify-center">
            <span className="text-[10px] text-slate-400 italic">Signature</span>
          </div>
          <p className="font-bold text-xs">Sectional Engineer / J.E.</p>
          <p className="text-[10px]">{facesheet.subDivision}</p>
        </div>
        <div className="border border-black p-2">
          <div className="h-12 border-b border-dashed border-black/40 mb-1 flex items-end justify-center">
            <span className="text-[10px] text-slate-400 italic">Signature</span>
          </div>
          <p className="font-bold text-xs">Sub-Divisional Engineer</p>
          <p className="text-[10px]">{facesheet.subDivision}</p>
        </div>
        <div className="border border-black p-2">
          <div className="h-12 border-b border-dashed border-black/40 mb-1 flex items-end justify-center">
            <span className="text-[10px] text-slate-400 italic">Signature</span>
          </div>
          <p className="font-bold text-xs">Executive Engineer</p>
          <p className="text-[10px]">{facesheet.division}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* SCREEN CONTROLS & ACTION TOOLBAR (Hidden in Print) */}
      {/* ========================================================================= */}
      <div className="no-print bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-black text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Official Monochromatic PWD Binder
              </span>
              <span className="text-xs text-slate-500">18-Part Technical Sanction Format (S.P. OFF.WALL Reference)</span>
            </div>
            <h2 className="text-xl font-bold text-[#0B1F3A] mt-1">
              Printable Technical Sanction Dossier (PDF & Excel)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly monochromatic black & white styling compliant with Maharashtra PWD standards, technical sanction rules, and official audit requirements.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('facesheet')}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Editor</span>
            </button>

            <button
              onClick={handleExportExcel}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#14335C] hover:bg-[#1D4B85] text-white text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
              title="Download authentic multi-sheet Maharashtra PWD Excel estimate matching official spreadsheets"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Full PWD Excel (.xlsx)</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-5 py-2 rounded-lg bg-black hover:bg-neutral-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Printer className="w-4 h-4 text-[#F4762A]" />
              <span>Print / Save as PDF (Ctrl + P)</span>
            </button>
          </div>
        </div>

        {/* Section Checklist with Quick Select All */}
        <div className="border-t border-slate-100 pt-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-xs text-[#0B1F3A] flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-[#F4762A]" />
              <span>Select Sheets to Include in Printable Dossier:</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSelectAll(true)}
                className="text-[11px] text-blue-700 hover:underline font-semibold"
              >
                Select All
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => handleSelectAll(false)}
                className="text-[11px] text-slate-600 hover:underline"
              >
                Deselect All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-[11px]">
            {[
              { label: '1. Cover Face', state: includeCover, set: setIncludeCover },
              { label: '2. Index', state: includeIndex, set: setIncludeIndex },
              { label: '3. Data / Face Sheet', state: includeEstimate, set: setIncludeEstimate },
              { label: '4. TS Checklist', state: includeChecklist, set: setIncludeChecklist },
              { label: '5. Certificates', state: includeCertificate, set: setIncludeCertificate },
              { label: '6. SDE Letter (मराठी)', state: includeLetter, set: setIncludeLetter },
              { label: '7. परिशिष्ट-अ (मराठी)', state: includeParishishta, set: setIncludeParishishta },
              { label: '8. General Report', state: includeGenral, set: setIncludeGenral },
              { label: '9. Grand Abstract', state: includeGabs, set: setIncludeGabs },
              { label: '10. Abstract (Sch A)', state: includeAbstract, set: setIncludeAbstract },
              { label: '11. Measurement (MMST)', state: includeMeasurment, set: setIncludeMeasurment },
              { label: '12. Rate Analysis', state: includeRateAna, set: setIncludeRateAna },
              { label: '13. Royalty (Sch B)', state: includeRoyalty, set: setIncludeRoyalty },
              { label: '14. Lead Statement', state: includeLead, set: setIncludeLead },
              { label: '15. Testing (Sch C)', state: includeTesting, set: setIncludeTesting },
              { label: '16. Tender Sch B & C', state: includeScheduleB, set: setIncludeScheduleB },
              { label: '17. Consumption', state: includeConsumption, set: setIncludeConsumption },
              { label: '18. BBS Steel', state: includeBbs, set: setIncludeBbs },
            ].map((sec, idx) => (
              <button
                key={idx}
                onClick={() => sec.set(!sec.state)}
                className={`flex items-center space-x-1.5 px-2 py-1.5 rounded border transition-colors text-left ${
                  sec.state
                    ? 'bg-neutral-100 border-black text-black font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                {sec.state ? (
                  <CheckSquare className="w-3.5 h-3.5 text-black shrink-0" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <span className="truncate">{sec.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reference Project Presets */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
              Load Reference Project:
            </span>
            <button
              onClick={() => loadGoldenMasterDemo()}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold border border-slate-300 transition-all"
            >
              🅿️ Parking Stand Shed (₹2.98 L)
            </button>
            <button
              onClick={() => loadTrainingHomeDemo()}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold border border-slate-300 transition-all"
            >
              🏢 Training Store Home (₹10.88 L)
            </button>
            <button
              onClick={() => loadLibraryDomeDemo()}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold border border-slate-300 transition-all"
            >
              🏛️ Library Dome Slab (₹9.76 L)
            </button>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {abstractRows.length} Items • Sanctioned Total: ₹{calculationRollup.sanctionedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PRINTABLE MONOCHROMATIC PAGES CONTAINER */}
      {/* ========================================================================= */}
      <div className="dossier-print-container bg-neutral-800 p-4 sm:p-8 print:bg-white print:p-0">
        
        {/* ----------------------------------------------------------------------- */}
        {/* SHEET 1: COVER FACE (OFFICIAL PWD DOSSIER COVER) */}
        {/* ----------------------------------------------------------------------- */}
        {includeCover && (
          <div className="print-page bg-white text-black p-8 sm:p-12 mb-8 max-w-[210mm] mx-auto border-2 border-black shadow-2xl mono-doc print:border-none print:shadow-none print:p-0 print:m-0 flex flex-col justify-between min-h-[297mm]">
            <div>
              {/* Official State Emblem of India / Maharashtra Government */}
              <div className="official-emblem-container flex flex-col items-center justify-center mb-6 text-center print:block print:w-full print:text-center print:mb-6">
                <img
                  src="/emblem.png"
                  alt="State Emblem of India"
                  className="official-emblem-img h-28 w-auto object-contain mb-3 print:h-28 filter contrast-125 mx-auto"
                  style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}
                />
                <p className="text-sm font-bold tracking-widest uppercase font-devanagari text-center print:text-center">
                  महाराष्ट्र शासन • सार्वजनिक बांधकाम विभाग
                </p>
                <p className="text-xs font-bold tracking-widest uppercase text-black/80 mt-0.5 text-center print:text-center">
                  GOVERNMENT OF MAHARASHTRA • PUBLIC WORKS DEPARTMENT
                </p>
              </div>

              {/* Region / Circle / Division Header matching S.P. OFF.WALL. Sample */}
              <div className="text-center border-b-2 border-black pb-4 mb-8">
                <p className="text-sm font-bold tracking-widest uppercase">
                  PUBLIC WORKS REGION , {facesheet.region.toUpperCase() || 'NAGPUR'}
                </p>
                <p className="text-xs font-bold tracking-wider uppercase mt-1">
                  PUBLIC WORKS CIRCLE, {facesheet.circle.toUpperCase() || 'CHANDRAPUR'}
                </p>
                <p className="text-xs font-bold tracking-wider uppercase mt-1">
                  - PUBLIC WORKS DIVISION, {facesheet.division.toUpperCase() || 'WARDHA'} -
                </p>
              </div>

              {/* Title Header */}
              <div className="border-2 border-black p-6 text-center my-10 bg-white">
                <p className="text-xs font-bold tracking-widest uppercase text-black mb-2">
                  GOVERNMENT OF MAHARASHTRA • PUBLIC WORKS DEPARTMENT
                </p>
                <h1 className="text-2xl font-bold tracking-wider uppercase underline underline-offset-4 mb-4">
                  - D E T A I L E D &nbsp; E S T I M A T E -
                </h1>
                <div className="mt-6 text-left border-t border-black pt-4 space-y-2">
                  <p className="text-xs font-bold">NAME OF WORK :-</p>
                  <p className="text-sm font-bold uppercase leading-relaxed pl-4">
                    {facesheet.nameOfWork}
                  </p>
                </div>
              </div>

              {/* Estimated Cost Box */}
              <div className="border-2 border-black p-4 text-center my-8">
                <span className="text-xs font-bold uppercase">ESTIMATED COST :- &nbsp;</span>
                <span className="text-lg font-bold">
                  Rs. {calculationRollup.sanctionedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })} /-
                </span>
                <p className="text-xs italic mt-1 font-serif">
                  ({numberToIndianWords(calculationRollup.sanctionedTotal)})
                </p>
              </div>

              {/* Administrative Sub-division & SSR Year */}
              <div className="text-center space-y-1 my-8">
                <p className="text-sm font-bold uppercase tracking-wider">{facesheet.subDivision.toUpperCase()}</p>
                <p className="text-xs font-bold uppercase">
                  DISTRICT: {facesheet.division.split(',')[1]?.trim() || facesheet.division || 'MAHARASHTRA'}
                </p>
                <p className="text-xs font-bold mt-2">SSR YEAR: {facesheet.ssrYear}</p>
              </div>
            </div>

            {/* Bottom Approval Meta & Official Signoff Box */}
            <div>
              <div className="border border-black p-3 text-xs space-y-1 mb-6">
                <div className="flex justify-between">
                  <span><strong>Admin Approval No:</strong> {facesheet.adminApprovalNo || 'PW/WDH/PLAN/AA/2022-23/4582'}</span>
                  <span><strong>Date:</strong> {facesheet.adminApprovalDate || '15/09/2022'}</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>Technical Sanction No:</strong> {facesheet.techSanctionNo || 'EE/PWD/WDH/TS/2022-23/1842'}</span>
                  <span><strong>Date:</strong> {facesheet.techSanctionDate || '20/10/2022'}</span>
                </div>
              </div>
              <div className="text-center text-xs font-bold tracking-widest border-t-2 border-black pt-2 uppercase">
                ----- PUBLIC WORKS DIVISION, {facesheet.division.toUpperCase()} -----
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SHEET 2: INDEX (OFFICIAL TABLE OF CONTENTS) */}
        {/* ----------------------------------------------------------------------- */}
        {includeIndex && (
          <div className="print-page bg-white text-black p-8 sm:p-12 mb-8 max-w-[210mm] mx-auto border border-black shadow-2xl mono-doc print:border-none print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between">
            <div>
              <div className="border-b-2 border-black pb-2 mb-4">
                <p className="text-xs font-bold uppercase">NAME OF WORK :- {facesheet.nameOfWork}</p>
                <h2 className="text-center text-base font-bold tracking-widest uppercase mt-2">
                  I &nbsp; N &nbsp; D &nbsp; E &nbsp; X
                </h2>
              </div>

              <table className="mono-table mb-6">
                <thead>
                  <tr>
                    <th className="w-16">Sr. No.</th>
                    <th>D E S C R I P T I O N</th>
                    <th className="w-20 text-center">PAGE START</th>
                    <th className="w-12 text-center">TO</th>
                    <th className="w-20 text-center">PAGE END</th>
                    <th className="w-28 text-center">REMARK</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { sr: 1, desc: 'COVER PAGE', start: '01', end: '01', remark: 'Enclosed' },
                    { sr: 2, desc: 'INDEX', start: '02', end: '02', remark: 'Enclosed' },
                    { sr: 3, desc: 'DATA SHEET & FACE SHEET', start: '03', end: '03', remark: 'Enclosed' },
                    { sr: 4, desc: 'CHECK LIST FOR DETAILED ESTIMATE (TS CHECKLIST)', start: '04', end: '04', remark: 'Enclosed' },
                    { sr: 5, desc: 'STATUTORY CERTIFICATES (100% CHECK, SCRUTINY, NON-SUBMERGENCE)', start: '05', end: '05', remark: 'Enclosed' },
                    { sr: 6, desc: 'OFFICIAL SDE FORWARDING LETTER (मराठी)', start: '06', end: '06', remark: 'Enclosed' },
                    { sr: 7, desc: 'परिशिष्ट - अ (प्रशासकीय मान्यतेसोबतचे विवरणपत्र)', start: '07', end: '07', remark: 'Enclosed' },
                    { sr: 8, desc: 'GENERAL REPORT & SPECIFICATIONS', start: '08', end: '08', remark: 'Enclosed' },
                    { sr: 9, desc: 'GRAND ABSTRACT (RECAPITULATION OF COST)', start: '09', end: '09', remark: 'Enclosed' },
                    { sr: 10, desc: "ABSTRACT SHEET (SCHEDULE 'A' CIVIL BOQ)", start: '10', end: '11', remark: 'Enclosed' },
                    { sr: 11, desc: "MEASUREMENT SHEET (STATEMENT 'A')", start: '12', end: '14', remark: 'Enclosed' },
                    { sr: 12, desc: 'RATE ANALYSIS (WITH 21% LABOUR CESS ISOLATION)', start: '15', end: '16', remark: 'Enclosed' },
                    { sr: 13, desc: "ROYALTY CHARGES STATEMENT (SCHEDULE 'B')", start: '17', end: '17', remark: 'Enclosed' },
                    { sr: 14, desc: 'LEAD STATEMENT FOR ROAD, BRIDGE & BUILDING WORK', start: '18', end: '18', remark: 'Enclosed' },
                    { sr: 15, desc: "QUALITY CONTROL TESTING CHARGES (SCHEDULE 'C')", start: '19', end: '19', remark: 'Enclosed' },
                    { sr: 16, desc: "TENDER SCHEDULE 'B' & 'C' (WITH WORDS)", start: '20', end: '21', remark: 'Enclosed' },
                    { sr: 17, desc: 'THEORETICAL MATERIAL CONSUMPTION & RECONCILIATION', start: '22', end: '22', remark: 'Enclosed' },
                    { sr: 18, desc: 'BAR BENDING SCHEDULE (B.B.S. - IS 2502)', start: '23', end: '23', remark: 'Enclosed' },
                  ].map((row) => (
                    <tr key={row.sr}>
                      <td className="text-center font-bold">{row.sr}</td>
                      <td className="font-semibold text-xs">{row.desc}</td>
                      <td className="text-center font-mono">{row.start}</td>
                      <td className="text-center font-mono">TO</td>
                      <td className="text-center font-mono">{row.end}</td>
                      <td className="text-center text-[10px] italic">{row.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <MonochromaticSignatures />
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SHEET 3: DATA SHEET / FACE SHEET (PREAMBLE & BUDGET HEADS SHEET) */}
        {/* ----------------------------------------------------------------------- */}
        {includeEstimate && (
          <div className="print-page bg-white text-black p-8 sm:p-12 mb-8 max-w-[210mm] mx-auto border border-black shadow-2xl mono-doc print:border-none print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between">
            <div>
              <div className="text-center border-b border-black pb-2 mb-4">
                <h2 className="text-base font-bold tracking-widest uppercase">E &nbsp; S &nbsp; T &nbsp; I &nbsp; M &nbsp; A &nbsp; T &nbsp; E</h2>
                <p className="text-xs font-bold uppercase mt-1">FACE SHEET & BUDGETARY ALLOCATION</p>
              </div>

              {/* Budget Heads Table matching S.P. OFF.WALL. Face Sheet */}
              <table className="mono-table mb-6">
                <tbody>
                  <tr>
                    <td className="w-44 font-bold">NAME OF ESTIMATE</td>
                    <td className="w-4 text-center">:</td>
                    <td className="font-bold uppercase text-[11px]">{facesheet.nameOfWork}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">DIVISION</td>
                    <td className="text-center">:</td>
                    <td className="font-bold">{facesheet.division}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">CIRCLE</td>
                    <td className="text-center">:</td>
                    <td>{facesheet.circle}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">SUB-DIVISION</td>
                    <td className="text-center">:</td>
                    <td>{facesheet.subDivision}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">FUND HEAD</td>
                    <td className="text-center">:</td>
                    <td>{facesheet.fundHead || 'STATE PLAN (PWD)'}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">MAJOR HEAD</td>
                    <td className="text-center">:</td>
                    <td>{facesheet.majorHead || '5054 - CAPITAL OUTLAY ON ROADS & BRIDGES'}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">MINOR HEAD</td>
                    <td className="text-center">:</td>
                    <td>{facesheet.minorHead || '337 - ROAD WORKS'}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">SERVICE HEAD</td>
                    <td className="text-center">:</td>
                    <td>{facesheet.serviceHead || '2059 - PUBLIC WORKS'}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">DEPTT. HEAD</td>
                    <td className="text-center">:</td>
                    <td>{facesheet.departmentalHead || 'EXECUTIVE ENGINEER, P.W. DIVISION'}</td>
                  </tr>
                </tbody>
              </table>

              {/* Framing Paragraph */}
              <div className="text-xs leading-relaxed space-y-3 my-6">
                <div className="p-3 border border-black font-bold uppercase text-center text-xs">
                  {facesheet.nameOfWork}
                </div>
                <div className="flex justify-between items-center py-2 border-y border-black font-bold text-xs">
                  <span>AMOUNTING TO Rs.</span>
                  <span>Rs. {calculationRollup.sanctionedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })} /-</span>
                </div>
                <p className="italic text-[11px]">
                  (IN WORDS :- {numberToIndianWords(calculationRollup.sanctionedTotal)})
                </p>
              </div>

              {/* Sanctions Table */}
              <div className="border border-black p-4 text-xs space-y-2 mb-6">
                <div className="flex justify-between">
                  <span><strong>ESTIMATE ADMINISTRATIVELY APPROVED VIDE:</strong> {facesheet.adminApprovalNo || 'PW/WDH/PLAN/AA/2022-23/4582'}</span>
                  <span><strong>Date:</strong> {facesheet.adminApprovalDate || '15/09/2022'}</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>ESTIMATE TECHNICALLY SANCTIONED VIDE:</strong> {facesheet.techSanctionNo || 'EE/PWD/WDH/TS/2022-23/1842'}</span>
                  <span><strong>Date:</strong> {facesheet.techSanctionDate || '20/10/2022'}</span>
                </div>
              </div>

              <div className="flex justify-between text-xs font-bold px-4 py-2 border-t border-black">
                <span>ESTIMATE PREPARED BY: Junior Engineer</span>
                <span>ESTIMATE CHECKED BY: Sub-Divisional Engineer</span>
              </div>
            </div>

            <MonochromaticSignatures />
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SHEET 4: CHECKLISH (CHECK LIST FOR TECHNICAL SANCTION) */}
        {/* ----------------------------------------------------------------------- */}
        {includeChecklist && (
          <div className="print-page bg-white text-black p-8 sm:p-12 mb-8 max-w-[210mm] mx-auto border border-black shadow-2xl mono-doc print:border-none print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between">
            <div>
              <div className="border-b-2 border-black pb-2 mb-4">
                <p className="text-xs font-bold uppercase">NAME OF WORK :- {facesheet.nameOfWork}</p>
                <h2 className="text-center text-sm font-bold tracking-wider uppercase mt-2">
                  CHECK LIST FOR DETAILED ESTIMATE TO BE SUBMITTED FOR TECHNICAL SANCTION
                </h2>
                <p className="text-center text-[10px] italic">(As per Maharashtra PWD Guidelines & Circulars)</p>
              </div>

              <table className="mono-table mono-table-tight mb-4">
                <thead>
                  <tr>
                    <th className="w-12">Sr. No.</th>
                    <th>Details of Points to be considered</th>
                    <th className="w-24 text-center">Reply by SE/EE</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { sr: 1, point: 'In General Description, Chainage wise condition of road / site, existing crust thickness noted.', reply: 'Yes' },
                    { sr: 2, point: 'Data of existing trial pits, Crust thickness chart is attached.', reply: 'Yes' },
                    { sr: 3, point: 'Provision of CC pipes / culverts for existing approach to fields/properties taken.', reply: 'Yes' },
                    { sr: 4, point: 'GSB / Soling is taken for full formation width (up to toe for drainage).', reply: 'Yes' },
                    { sr: 5, point: 'Photographs of existing works and site conditions are taken.', reply: 'Yes' },
                    { sr: 6, point: 'Geometrical improvement along with curve design & black spot rectification considered.', reply: 'Yes' },
                    { sr: 7, point: 'Provision for superelevation, extra widening on curves, sign boards made.', reply: 'Yes' },
                    { sr: 8, point: 'Drawing of invert level of drain including at junctions is attached.', reply: 'Yes' },
                    { sr: 9, point: 'Provision for rainwater harvesting in case of CC drains / roofs where feasible.', reply: 'Yes' },
                    { sr: 10, point: 'Provision for length passing through BC soil (soil stabilization / subgrade treatment).', reply: 'Yes' },
                    { sr: 11, point: 'Crust thickness / foundation designed as per CBR, traffic intensity, structural design.', reply: 'Yes' },
                    { sr: 12, point: 'Provision of plantation of trees and arboriculture is made.', reply: 'Yes' },
                    { sr: 13, point: 'Provision for utility shifting if shifting is needed.', reply: 'Yes' },
                    { sr: 14, point: 'It is ascertained that length considered is not coming under NH / ZP / other agencies.', reply: 'Yes' },
                    { sr: 15, point: 'Hydraulics of Bridges / C.D. Works is checked and face walls are designed.', reply: 'Yes' },
                    { sr: 16, point: 'Provision for batch mix plant / RMC as per PWD quality norms.', reply: 'Yes' },
                    { sr: 17, point: 'Permission of Forest Deptt. for road/work passing through forest land obtained / N.A.', reply: 'Yes / N.A.' },
                    { sr: 18, point: 'Quality control testing charges as per PWD Chapter 33 included.', reply: 'Yes' },
                    { sr: 19, point: 'Statutory mineral royalty and GST as per GoM GRs included.', reply: 'Yes' },
                  ].map((row) => (
                    <tr key={row.sr}>
                      <td className="text-center font-bold">{row.sr}</td>
                      <td className="text-[10px] leading-tight">{row.point}</td>
                      <td className="text-center font-bold text-[10px]">{row.reply}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Tiered Signoff Matrix matching CHECKLISH sheet */}
              <div className="grid grid-cols-2 gap-4 border border-black p-3 text-xs">
                <div className="border-r border-black pr-2">
                  <p className="font-bold underline text-[10px]">Points Sr. No. 1 to 5 checked by me:</p>
                  <div className="h-8"></div>
                  <p className="font-bold text-[10px]">Junior / Sectional Engineer</p>
                  <p className="text-[9px]">{facesheet.subDivision}</p>
                </div>
                <div>
                  <p className="font-bold underline text-[10px]">Points Sr. No. 6 to 11 checked by me:</p>
                  <div className="h-8"></div>
                  <p className="font-bold text-[10px]">Sub-Divisional Engineer</p>
                  <p className="text-[9px]">{facesheet.subDivision}</p>
                </div>
                <div className="border-t border-r border-black pt-2 pr-2">
                  <p className="font-bold underline text-[10px]">Points Sr. No. 12 to 16 checked by me:</p>
                  <div className="h-8"></div>
                  <p className="font-bold text-[10px]">Executive Engineer</p>
                  <p className="text-[9px]">{facesheet.division}</p>
                </div>
                <div className="border-t border-black pt-2">
                  <p className="font-bold underline text-[10px]">Points Sr. No. 17 to 19 checked by me:</p>
                  <div className="h-8"></div>
                  <p className="font-bold text-[10px]">Superintending Engineer</p>
                  <p className="text-[9px]">{facesheet.circle}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SHEET 5: CERTIFICATES (OFFICIAL 4-PART TS CERTIFICATES) */}
        {/* ----------------------------------------------------------------------- */}
        {includeCertificate && (
          <div className="print-page bg-white text-black p-8 sm:p-12 mb-8 max-w-[210mm] mx-auto border border-black shadow-2xl mono-doc print:border-none print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between">
            <div>
              <div className="text-center border-b-2 border-black pb-2 mb-4">
                <h2 className="text-base font-bold tracking-widest uppercase">C &nbsp; E &nbsp; R &nbsp; T &nbsp; I &nbsp; F &nbsp; I &nbsp; C &nbsp; A &nbsp; T &nbsp; E &nbsp; S</h2>
                <p className="text-xs font-bold uppercase mt-1">NAME OF WORK :- {facesheet.nameOfWork}</p>
              </div>

              {/* Part 1: Sub-Division Certificate (from CERTIFICATE 1) */}
              <div className="border border-black p-3 mb-4 text-xs space-y-1">
                <p className="font-bold underline uppercase">1. CERTIFICATE BY SUB-DIVISION ({facesheet.subDivision.toUpperCase()}):</p>
                <p className="italic text-[10px]">It is Certified that :-</p>
                <div className="space-y-1 pl-3 text-[10px] leading-tight">
                  <p><strong>1.1 :-</strong> Lead taken in the estimate is actually measured and quantity as well as quality of material are verified at site.</p>
                  <p><strong>1.2 :-</strong> Present crust thickness chart and bridge / C.D. works inventory attached in estimate is verified by me.</p>
                  <p><strong>1.3 :-</strong> Measurements in estimate are correctly calculated and there will be no excess in quantity during execution.</p>
                  <p><strong>1.4 :-</strong> Trial pit is taken at site by me and details are attached in the estimate.</p>
                  <p><strong>1.5 :-</strong> All provisions as per latest GRs / Circulars / IS-IRC Codes have been considered in estimate.</p>
                  <p><strong>1.6 :-</strong> Estimate is prepared & Arithmetically 100% checked by me.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 text-center text-xs">
                  <div>
                    <div className="h-6"></div>
                    <p className="font-bold text-[10px]">Junior / Sectional Engineer</p>
                    <p className="text-[9px]">{facesheet.subDivision}</p>
                  </div>
                  <div>
                    <div className="h-6"></div>
                    <p className="font-bold text-[10px]">Sub-Divisional Engineer</p>
                    <p className="text-[9px]">{facesheet.subDivision}</p>
                  </div>
                </div>
              </div>

              {/* Part 2: Division Office Certificate */}
              <div className="border border-black p-3 mb-4 text-xs space-y-1">
                <p className="font-bold underline uppercase">2. CERTIFICATE BY DIVISION OFFICE ({facesheet.division.toUpperCase()}):</p>
                <p className="italic text-[10px]">It is Certified that :-</p>
                <div className="space-y-1 pl-3 text-[10px] leading-tight">
                  <p><strong>2.1 :-</strong> Estimate is technically and 100% arithmetically checked in division office.</p>
                  <p><strong>2.2 :-</strong> Measurements are checked in division office and there will be no excess in quantity if executed as per drawing.</p>
                  <p><strong>2.3 :-</strong> Rate analysis as well as wording of each item are checked and strictly comply with SSR {facesheet.ssrYear}.</p>
                  <p><strong>2.4 :-</strong> It is verified that estimate is prepared by considering latest GRs, circulars and standard specifications.</p>
                  <p><strong>2.5 :-</strong> General Report is correctly written and is self-explanatory regarding all provisions made.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 text-center text-xs">
                  <div>
                    <div className="h-6"></div>
                    <p className="font-bold text-[10px]">Technical Branch, Division Office</p>
                    <p className="text-[9px]">{facesheet.division}</p>
                  </div>
                  <div>
                    <div className="h-6"></div>
                    <p className="font-bold text-[10px]">Executive Engineer</p>
                    <p className="text-[9px]">{facesheet.division}</p>
                  </div>
                </div>
              </div>

              {/* Part 3 & 4: Non Submergence & Rate Adoption Certificates (from sheet12) */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="border border-black p-2 space-y-1">
                  <p className="font-bold text-[10px] uppercase underline">3. NON SUBMERGENCE CERTIFICATE</p>
                  <p className="text-[9px] leading-snug">
                    Certified that the instant site / road stretch does not come under submergence of any dam, river or nalla and is situated well above High Flood Level (HFL).
                  </p>
                  <div className="pt-4 text-center">
                    <p className="font-bold text-[10px]">Sub-Divisional Engineer</p>
                  </div>
                </div>
                <div className="border border-black p-2 space-y-1">
                  <p className="font-bold text-[10px] uppercase underline">4. ADOPTION OF RATES CERTIFICATE</p>
                  <p className="text-[9px] leading-snug">
                    Certified that rates adopted in this estimate are strictly as per Maharashtra PWD Standard Schedule of Rates (SSR {facesheet.ssrYear}) w.e.f. 25/07/2022.
                  </p>
                  <div className="pt-4 text-center">
                    <p className="font-bold text-[10px]">Executive Engineer</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-[9px] italic border-t border-black pt-2">
              Statutory Technical Scrutiny & Sanction Certificates — Public Works Department Maharashtra
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SHEET 6: LETTER (OFFICIAL SDE MARATHI FORWARDING LETTER) */}
        {/* ----------------------------------------------------------------------- */}
        {includeLetter && (
          <div className="print-page bg-white text-black p-8 sm:p-12 mb-8 max-w-[210mm] mx-auto border border-black shadow-2xl mono-doc print:border-none print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between">
            <div>
              {/* Marathi Letterhead */}
              <div className="text-center border-b-2 border-black pb-3 mb-6">
                <p className="text-base font-bold font-devanagari">महाराष्ट्र शासन</p>
                <p className="text-sm font-bold font-devanagari">उपविभागीय अभियंता यांचे कार्यालय</p>
                <p className="text-xs font-bold font-devanagari">{facesheet.subDivision}</p>
                <p className="text-[11px] font-devanagari mt-1">
                  सार्वजनिक बांधकाम उपविभाग • Web: www.mahapwd.gov.in
                </p>
              </div>

              {/* Outward & Date */}
              <div className="flex justify-between text-xs font-devanagari border-b border-black pb-2 mb-4 font-semibold">
                <span>जावक क्र. {facesheet.outwardNo || 'जा.क्र./सा.बां.उपवि-१/तां/२०२६/१४२'}</span>
                <span>दिनांक:- {facesheet.letterDate || '२०/१०/२०२६'}</span>
              </div>

              {/* To Address */}
              <div className="text-xs font-devanagari space-y-1 mb-4">
                <p className="font-bold">प्रति,</p>
                <p className="font-bold pl-4">कार्यकारी अभियंता,</p>
                <p className="pl-4">{facesheet.division},</p>
                <p className="pl-4">महाराष्ट्र राज्य.</p>
              </div>

              {/* Subject & Reference */}
              <div className="border border-black p-3 text-xs font-devanagari space-y-1.5 mb-6">
                <div className="flex">
                  <span className="font-bold w-16 shrink-0">विषय :-</span>
                  <span className="font-bold">अंदाजपत्रक तांत्रिक मान्यतेकरीता सादर करणेबाबत.</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-16 shrink-0">संदर्भ :-</span>
                  <span>१) प्रशासकीय मान्यता आदेश क्र. {facesheet.adminApprovalNo || 'PW/AA/2022-23/4582'} दिनांक {facesheet.adminApprovalDate || '१५/०९/२०२२'}.</span>
                </div>
              </div>

              {/* Body Text */}
              <div className="text-xs font-devanagari leading-relaxed space-y-3 mb-6">
                <p>महोदय,</p>
                <p className="text-justify indent-8">
                  उपरोक्त संदर्भीय विषयानुसार नमूद कामाचे सविस्तर अंदाजपत्रक या उपविभागाकडून महाराष्ट्र शासन सार्वजनिक बांधकाम विभागाच्या प्रचलित दरसूचीनुसार (SSR {facesheet.ssrYear}) तयार करण्यात आले असून, तांत्रिक मान्यतेच्या पुढील कार्यवाही करिता सादर करण्यात येत आहे.
                </p>
              </div>

              {/* Works Table */}
              <table className="mono-table mb-6">
                <thead>
                  <tr>
                    <th className="w-12">अ.क्र.</th>
                    <th>कामाचे नाव</th>
                    <th className="w-44 text-right">अंदाजीत किंमत (रुपये)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center font-bold">१</td>
                    <td className="font-bold uppercase text-[11px]">{facesheet.nameOfWork}</td>
                    <td className="text-right font-mono font-bold">
                      ₹ {calculationRollup.sanctionedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="text-xs font-devanagari space-y-2 mt-4">
                <p>आपल्या माहिती व पुढील योग्य कार्यवाहीकरिता सादर.</p>
                <p className="font-bold">
                  सहपत्र :- १) सविस्तर अंदाजपत्रक (Schedule A), २) दर विश्लेषण (Rate Analysis), ३) मोजमाप पत्रिका (Measurement Sheet), ४) रॉयल्टी विवरणपत्र, ५) तपासणी शुल्क नोंदवही.
                </p>
              </div>
            </div>

            {/* SDE Signoff */}
            <div className="pt-8 text-xs font-devanagari flex flex-col items-end">
              <div className="text-center w-64">
                <div className="h-10"></div>
                <p className="font-bold">उपविभागीय अभियंता / अधिकारी</p>
                <p>{facesheet.subDivision}</p>
              </div>
              <div className="w-full text-left text-[11px] border-t border-black pt-2 mt-6">
                प्रतीलीपी :- कनिष्ठ अभियंता, {facesheet.subDivision} यांना पुढील कार्यवाही करीता अग्रेषित.
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SHEET 7: PARISHISHTA-A (मराठी प्रशासकीय विवरणपत्र - 14 POINTS) */}
        {/* ----------------------------------------------------------------------- */}
        {includeParishishta && (
          <div className="print-page bg-white text-black p-8 sm:p-12 mb-8 max-w-[210mm] mx-auto border border-black shadow-2xl mono-doc print:border-none print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between">
            <div>
              <div className="text-center border-b-2 border-black pb-2 mb-4">
                <h2 className="text-base font-bold font-devanagari tracking-wider">
                  परिशिष्ट - अ
                </h2>
                <p className="text-xs font-bold font-devanagari">
                  प्रशासकीय मान्यतेसाठी पाठविलेल्या अंदाजपत्रकासोबतचे १४ कलमी विवरणपत्र
                </p>
              </div>

              <table className="mono-table mono-table-tight text-xs font-devanagari mb-4">
                <thead>
                  <tr>
                    <th className="w-10">अ.क्र.</th>
                    <th>तपशील</th>
                    <th className="w-8 text-center">::</th>
                    <th className="w-72">उपविभागाचे उत्तर</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { sr: '१', q: 'कामाचे नाव व किंमत', a: `${facesheet.nameOfWork} — किंमत रु. ${(calculationRollup.sanctionedTotal / 100000).toFixed(2)} लक्ष` },
                    { sr: '२', q: 'रस्ते विकासासाठी ठरविलेल्या अग्रक्रमानुसार कामाचा अग्रक्रम', a: 'प्रथम प्राधान्याने' },
                    { sr: '३', q: 'काम जिल्हा स्तरीय असल्यास जिल्हा नियोजन व विकास मंडळाने शिफारस केले आहे काय?', a: 'होय, जिल्हा नियोजन समितीने मान्य केलेले आहे' },
                    { sr: '४', q: 'इतर कोणत्या योजनेखाली (CRF, NABARD, MSRDC, इ.) आहे काय?', a: 'नाही, ही मूळ कामे योजना आहे' },
                    { sr: '५', q: 'कामाची मागणी कोणी केली आहे?', a: 'मा. लोकप्रतिनिधी व स्थानिक नागरिकांच्या मागणीनुसार' },
                    { sr: '६', q: 'रस्त्याचा / इमारतीचा प्रस्तावित दर्जा', a: 'प्रजिमा / प्रमुख जिल्हा मार्ग व सार्वजनिक इमारत' },
                    { sr: '७', q: 'कामाच्या परिसरातील अस्तित्वातील नकाशे जोडले आहेत काय?', a: 'होय, स्थळदर्शक नकाशा जोडलेला आहे' },
                    { sr: '८', q: 'सदर कामामुळे जोडली जाणारी गावे व लाभार्थी लोकसंख्या', a: 'संबंधित क्षेत्रातील सर्व सार्वजनिक नागरिक व दळणवळण' },
                    { sr: '९', q: 'प्रस्तावित काम आदिवासी / बिगर आदिवासी क्षेत्रातील आहे काय?', a: 'बिगर आदिवासी क्षेत्रातील आहे' },
                    { sr: '१०', q: 'सदर काम परिसराच्या दृष्टीने शेती, उद्योग, शिक्षण विषयक महत्त्वाचे आहे काय?', a: 'होय, स्थानिक वाहतूक व जनसुविधेसाठी अत्यंत आवश्यक आहे' },
                    { sr: '११', q: 'सदर काम रोजगार हमी योजना/इतर योजनेतून घेतलेले आहे काय?', a: 'नाही' },
                    { sr: '१२', q: 'शासन परिपत्रक क्र. बीडीएस १०८२ प्रमाणे काटकसरीच्या सूचनांचे अनुपालन केले आहे काय?', a: 'होय, १००% अनुपालन करण्यात आलेले आहे' },
                    { sr: '१३', q: 'पुलांचे / मोऱ्यांची कामे असल्यास आवश्यक तपासणी केली आहे काय?', a: 'अस्तित्वातील मोऱ्यांची पाहणी करून तरतूद केलेली आहे' },
                    { sr: '१४', q: 'रस्त्याची धावपट्टी व कामाची सद्यस्थिती', a: 'कामाची आवश्यकता तातडीची असून अंदाजपत्रक योग्य आहे' },
                  ].map((row) => (
                    <tr key={row.sr}>
                      <td className="text-center font-bold">{row.sr}</td>
                      <td className="text-[10px] leading-tight">{row.q}</td>
                      <td className="text-center font-bold">::</td>
                      <td className="text-[10px] leading-tight font-semibold">{row.a}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 text-xs font-devanagari flex justify-end">
              <div className="text-center w-64 border border-black p-2">
                <div className="h-10"></div>
                <p className="font-bold">उपविभागीय अभियंता / अधिकारी</p>
                <p>{facesheet.subDivision}</p>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SHEET 8: GENRAL (GENERAL REPORT & SPECIFICATIONS) */}
        {/* ----------------------------------------------------------------------- */}
        {includeGenral && (
          <div className="print-page bg-white text-black p-8 sm:p-12 mb-8 max-w-[210mm] mx-auto border border-black shadow-2xl mono-doc print:border-none print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between">
            <div>
              <div className="text-center border-b-2 border-black pb-2 mb-6">
                <h2 className="text-base font-bold tracking-widest uppercase">G E N E R A L &nbsp; R E P O R T &nbsp; & &nbsp; S P E C I F I C A T I O N S</h2>
              </div>

              <div className="text-xs space-y-4 leading-relaxed mb-6">
                <div className="flex">
                  <span className="w-36 font-bold shrink-0">NAME OF WORK :-</span>
                  <span className="font-bold uppercase">{facesheet.nameOfWork}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-bold shrink-0">Estimated cost Rs. :-</span>
                  <span className="font-bold">Rs. {calculationRollup.sanctionedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })} /-</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-bold shrink-0">AUTHORITY :-</span>
                  <span>{facesheet.authority || `GOVERNMENT OF MAHARASHTRA / ${facesheet.division}`}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-bold shrink-0">FUND PROVISION :-</span>
                  <span>AS PER DEMAND OF USER DEPARTMENT / STATE BUDGET HEAD</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-bold shrink-0">NECESSITY :-</span>
                  <span className="text-justify">{facesheet.necessity || 'The proposed work is essentially required for public infrastructure maintenance, structural stability, road user safety, and durability as per standard Maharashtra PWD departmental guidelines.'}</span>
                </div>
                
                <div>
                  <p className="font-bold mb-2">PROVISIONS :- Following provisions are made in this detailed estimate -</p>
                  <ol className="list-decimal pl-6 space-y-1 text-[11px]">
                    {items.map((it, idx) => (
                      <li key={idx}>
                        <strong>SSR {facesheet.ssrYear} Item No. {it.itemCode}:</strong> {it.description}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="border-t border-black pt-3 space-y-2">
                  <p>
                    <strong>SPECIFICATIONS :-</strong> The work will be carried out strictly as per Maharashtra PWD standard specifications (Red Book / MoRTH) and as per specific instructions of the Engineer-in-Charge.
                  </p>
                  <p>
                    <strong>RATES & METHODOLOGY :-</strong> Rates are adopted as per Maharashtra State PWD Standard Schedule of Rates (SSR {facesheet.ssrYear}) with applicable quarry haulage lead charges, municipal council area surcharges ({facesheet.areaSurchargePercent}%), statutory labour welfare cess, and mineral royalties.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 text-center text-xs pt-8 border-t border-black">
              <div>
                <div className="h-12"></div>
                <p className="font-bold">Sub-Divisional Engineer</p>
                <p className="text-[10px]">{facesheet.subDivision}</p>
              </div>
              <div>
                <div className="h-12"></div>
                <p className="font-bold">Executive Engineer</p>
                <p className="text-[10px]">{facesheet.division}</p>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SHEET 9: GR. ABSTRACT (GENERAL ABSTRACT / RECAPITULATION SHEET) */}
        {/* ----------------------------------------------------------------------- */}
        {includeGabs && (
          <div className="print-page bg-white text-black p-8 sm:p-12 mb-8 max-w-[210mm] mx-auto border border-black shadow-2xl mono-doc print:border-none print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between">
            <div>
              <div className="border-b-2 border-black pb-2 mb-4">
                <p className="text-xs font-bold uppercase">NAME OF WORK :- {facesheet.nameOfWork}</p>
                <h2 className="text-center text-base font-bold tracking-widest uppercase mt-2">
                  G E N E R A L &nbsp; A B S T R A C T
                </h2>
                <p className="text-center text-[10px] italic">(RECAPITULATION OF COST AS PER S.P. OFF.WALL STANDARDS)</p>
              </div>

              {/* Recapitulation Table strictly matching S.P. OFF.WALL. Sample.xlsm GR. Abstract */}
              <table className="mono-table mb-4">
                <thead>
                  <tr>
                    <th className="w-16">Sr.No.</th>
                    <th>P A R T I C U L A R S</th>
                    <th className="w-20 text-center">Ref.</th>
                    <th className="w-40 text-right">AMOUNT (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center font-bold">1</td>
                    <td className="font-bold uppercase text-[11px]">{facesheet.nameOfWork} (CIVIL WORK)</td>
                    <td className="text-center font-bold">(A)</td>
                    <td className="text-right font-mono font-bold">
                      Rs. {calculationRollup.scheduleA_costOfWork.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr className="bg-neutral-50 font-bold">
                    <td className="text-center">A )</td>
                    <td>TOTAL CIVIL COST</td>
                    <td className="text-center">Rs.</td>
                    <td className="text-right font-mono">
                      Rs. {calculationRollup.scheduleA_costOfWork.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center font-bold">B )</td>
                    <td>ROYALTY CHARGES (Schedule 'B')</td>
                    <td className="text-center">Rs.</td>
                    <td className="text-right font-mono">
                      Rs. {calculationRollup.scheduleB_royalty.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center font-bold">C )</td>
                    <td>TESTING CHARGES (Schedule 'C')</td>
                    <td className="text-center">Rs.</td>
                    <td className="text-right font-mono">
                      Rs. {calculationRollup.scheduleC_testing.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr className="font-bold border-t border-black bg-neutral-50">
                    <td className="text-center">2</td>
                    <td className="uppercase">TOTAL AMOUNT OF CIVIL PORTION D [ A + B + C ]</td>
                    <td className="text-center">D</td>
                    <td className="text-right font-mono">
                      Rs. {calculationRollup.subtotalDirectWorks.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center font-bold">3</td>
                    <td>Add {facesheet.gstPercent}% GST (Work Portion) on Rs (A)</td>
                    <td className="text-center font-mono">{(facesheet.gstPercent / 100).toFixed(2)}</td>
                    <td className="text-right font-mono">
                      Rs. {calculationRollup.gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center font-bold">4</td>
                    <td>Add {facesheet.laborCessPercent}% for Insurance / Labour Cess on Rs (A)</td>
                    <td className="text-center font-mono">{(facesheet.laborCessPercent / 100).toFixed(4)}</td>
                    <td className="text-right font-mono">
                      Rs. {calculationRollup.laborCessAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr className="font-bold border-t border-black">
                    <td className="text-center"></td>
                    <td className="uppercase">TS AMOUNT [ 2 + 3 + 4 ]</td>
                    <td className="text-center">TS</td>
                    <td className="text-right font-mono">
                      Rs. {(calculationRollup.subtotalDirectWorks + calculationRollup.gstAmount + calculationRollup.laborCessAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  {calculationRollup.contingencyAmount > 0 && (
                    <tr>
                      <td className="text-center font-bold">5</td>
                      <td>Add {facesheet.contingencyPercent}% for Contingency Charges on Rs (A)</td>
                      <td className="text-center font-mono">{(facesheet.contingencyPercent / 100).toFixed(2)}</td>
                      <td className="text-right font-mono">
                        Rs. {calculationRollup.contingencyAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  )}
                  {calculationRollup.electrificationAmount > 0 && (
                    <tr>
                      <td className="text-center font-bold">6</td>
                      <td>Add For Electrical / Service Connections</td>
                      <td className="text-center">LS</td>
                      <td className="text-right font-mono">
                        Rs. {calculationRollup.electrificationAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  )}
                  <tr className="font-bold text-sm border-t-2 border-b-2 border-black">
                    <td className="text-center"></td>
                    <td className="uppercase">TOTAL PROJECTED ESTIMATE COST</td>
                    <td className="text-center">Rs.</td>
                    <td className="text-right font-mono">
                      Rs. {calculationRollup.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr className="font-bold text-sm bg-neutral-100 border-b-4 border-double border-black">
                    <td className="text-center"></td>
                    <td className="uppercase font-bold">GRAND TOTAL (ROUND OFF)</td>
                    <td className="text-center">Rs.</td>
                    <td className="text-right font-mono">
                      Rs. {calculationRollup.sanctionedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="p-3 border border-black text-xs font-serif italic">
                <strong>(IN WORDS :- {numberToIndianWords(calculationRollup.sanctionedTotal)})</strong>
              </div>
            </div>

            <MonochromaticSignatures />
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SHEET 10: ABSTRACT (SCHEDULE 'A' ITEM ABSTRACT / BOQ) */}
        {/* ----------------------------------------------------------------------- */}
        {includeAbstract && (
          <div className="print-page bg-white text-black p-8 sm:p-12 mb-8 max-w-[210mm] mx-auto border border-black shadow-2xl mono-doc print:border-none print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between">
            <div>
              <div className="border-b-2 border-black pb-2 mb-4">
                <p className="text-xs font-bold uppercase">NAME OF WORK :- {facesheet.nameOfWork}</p>
                <h2 className="text-center text-base font-bold tracking-widest uppercase mt-1">
                  A &nbsp; B &nbsp; S &nbsp; T &nbsp; R &nbsp; A &nbsp; C &nbsp; T &nbsp; &nbsp; S &nbsp; H &nbsp; E &nbsp; E &nbsp; T
                </h2>
                <p className="text-center text-[10px] font-bold uppercase">(SCHEDULE 'A' - CIVIL PORTION)</p>
              </div>

              <table className="mono-table mono-table-tight">
                <thead>
                  <tr>
                    <th className="w-10">Sr.</th>
                    <th>ITEM OF WORK & SSR ITEM NO.</th>
                    <th className="w-20 text-right">QTY</th>
                    <th className="w-14 text-center">UNIT</th>
                    <th className="w-24 text-right">RATE (Rs.)</th>
                    <th className="w-28 text-right">AMOUNT (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  {abstractRows.map((row) => (
                    <tr key={row.sr}>
                      <td className="text-center font-bold align-top">{row.sr}</td>
                      <td className="align-top">
                        <div className="font-bold text-[11px]">SSR {facesheet.ssrYear} ITEM NO. {row.itemCode}</div>
                        <div className="text-[10px] leading-snug">{row.description}</div>
                        {row.floorTag !== 'GF' && (
                          <span className="font-bold text-[9px] underline">Floor: {row.floorTag}</span>
                        )}
                      </td>
                      <td className="text-right font-mono align-top">{row.qty.toFixed(2)}</td>
                      <td className="text-center align-top text-[10px]">{row.unit}</td>
                      <td className="text-right font-mono align-top">{row.rate.toFixed(2)}</td>
                      <td className="text-right font-mono font-bold align-top">
                        {row.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold border-t-2 border-b-2 border-black bg-neutral-50">
                    <td colSpan={5} className="text-right uppercase">
                      TOTAL SCHEDULE 'A' CIVIL WORK PORTION:
                    </td>
                    <td className="text-right font-mono font-bold">
                      Rs. {calculationRollup.scheduleA_costOfWork.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <MonochromaticSignatures />
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SHEET 11: MEASURMENT (MMST / DETAILED MEASUREMENT SHEET) */}
        {/* ----------------------------------------------------------------------- */}
        {includeMeasurment && (
          <div className="print-page bg-white text-black p-8 sm:p-12 mb-8 max-w-[210mm] mx-auto border border-black shadow-2xl mono-doc print:border-none print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between">
            <div>
              <div className="border-b-2 border-black pb-2 mb-4">
                <p className="text-xs font-bold uppercase">NAME OF WORK :- {facesheet.nameOfWork}</p>
                <h2 className="text-center text-base font-bold tracking-widest uppercase mt-1">
                  M E A S U R E M E N T &nbsp; S H E E T &nbsp; (MMST)
                </h2>
                <p className="text-center text-[10px] font-bold uppercase">(STATEMENT 'A' - DETAILED DIMENSIONAL TAKE-OFF)</p>
              </div>

              <table className="mono-table mono-table-tight">
                <thead>
                  <tr>
                    <th className="w-8">Sr</th>
                    <th className="w-16">CSR REF</th>
                    <th>DESCRIPTION OF ITEM & PARTICULARS</th>
                    <th className="w-10 text-center">No.</th>
                    <th className="w-14 text-right">L</th>
                    <th className="w-14 text-right">B</th>
                    <th className="w-14 text-right">D / H</th>
                    <th className="w-20 text-right">QUANTITY</th>
                    <th className="w-12 text-center">UNIT</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, itIdx) => {
                    const netQty = it.measurements.reduce((acc, m) => acc + m.computedQty, 0);
                    return (
                      <React.Fragment key={it.id}>
                        <tr className="bg-neutral-100 font-bold border-t border-black">
                          <td className="text-center">{itIdx + 1}</td>
                          <td className="font-mono text-center">{it.itemCode}</td>
                          <td colSpan={7} className="text-xs">
                            <span className="font-bold">SSR {facesheet.ssrYear} ITEM NO. {it.itemCode} :- </span>
                            <span className="font-normal text-[10px]">{it.description}</span>
                          </td>
                        </tr>
                        {it.measurements.map((m, mIdx) => (
                          <tr key={m.id || mIdx}>
                            <td></td>
                            <td></td>
                            <td className="text-[10px] pl-4">
                              {m.label || `Take-off detail ${mIdx + 1}`}
                              {m.isDeduction && <span className="font-bold"> (Deduction)</span>}
                            </td>
                            <td className="text-center font-mono">{m.multiplier}</td>
                            <td className="text-right font-mono">{m.length.toFixed(2)}</td>
                            <td className="text-right font-mono">{m.breadth.toFixed(2)}</td>
                            <td className="text-right font-mono">{m.depth.toFixed(2)}</td>
                            <td className="text-right font-mono">
                              {m.computedQty < 0 ? `(-) ${Math.abs(m.computedQty).toFixed(2)}` : m.computedQty.toFixed(2)}
                            </td>
                            <td className="text-center text-[10px]">{it.unit}</td>
                          </tr>
                        ))}
                        <tr className="font-bold border-b-2 border-black bg-neutral-50">
                          <td></td>
                          <td></td>
                          <td className="text-right uppercase text-[10px]" colSpan={5}>
                            TOTAL NET QUANTITY (A) FOR ITEM {it.itemCode}:
                          </td>
                          <td className="text-right font-mono font-bold">{netQty.toFixed(2)}</td>
                          <td className="text-center text-[10px]">{it.unit}</td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <MonochromaticSignatures />
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SHEET 12: RATE ANA (DETAILED RATE ANALYSIS WITH 21% CESS ISOLATION) */}
        {/* ----------------------------------------------------------------------- */}
        {includeRateAna && (
          <div className="print-page bg-white text-black p-8 sm:p-12 mb-8 max-w-[210mm] mx-auto border border-black shadow-2xl mono-doc print:border-none print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between">
            <div>
              <div className="border-b-2 border-black pb-2 mb-4">
                <p className="text-xs font-bold uppercase">NAME OF WORK :- {facesheet.nameOfWork}</p>
                <h2 className="text-center text-base font-bold tracking-widest uppercase mt-1">
                  R A T E &nbsp; A N A L Y S I S
                </h2>
                <p className="text-center text-[10px] font-bold uppercase">
                  (SSR {facesheet.ssrYear}, W.E.F. 25 JULY 2022 — WITH 21% LABOUR AMENITIES/CESS/INSURANCE DEDUCTION & RE-ADDITION)
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {items.map((it, idx) => {
                  const rateCalc = calculateDynamicItemRate(
                    it.baseRate,
                    leadSettings,
                    it.consumptionFactors,
                    facesheet.areaSurchargePercent,
                    'GF',
                    it.scadaApplicable,
                    facesheet.scadaDeductionActive,
                    facesheet.scadaDeductionAmount,
                    it.bitumenQtyPerUnit,
                    facesheet.currentBitumenRate,
                    facesheet.ssrBitumenRate
                  );

                  const cess21Deduct = Number((it.baseRate * 0.21).toFixed(2));
                  const netRate79 = Number((it.baseRate - cess21Deduct).toFixed(2));
                  const surchargeAmt = Number((netRate79 * (facesheet.areaSurchargePercent / 100)).toFixed(4));
                  const cess21Readd = cess21Deduct;

                  return (
                    <div key={it.id} className="border border-black p-3 page-break-inside-avoid">
                      <div className="font-bold border-b border-black pb-1 mb-2">
                        {idx + 1}. SSR {facesheet.ssrYear} ITEM NO. {it.itemCode} : {it.description}
                      </div>
                      <table className="mono-table mono-table-tight">
                        <tbody>
                          <tr>
                            <td className="w-80">RATE AS PER SSR {facesheet.ssrYear} ITEM NO. {it.itemCode}</td>
                            <td className="w-20 text-center font-mono font-bold">Rs.</td>
                            <td className="text-right font-mono font-bold">{it.baseRate.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td>Deduct 21.00% of labour amenities /cess /insurance</td>
                            <td className="text-center font-mono">(-) 21%</td>
                            <td className="text-right font-mono">(-) {cess21Deduct.toFixed(2)}</td>
                          </tr>
                          <tr className="font-bold">
                            <td>Net Rs. (Non-Labour Component 79%)</td>
                            <td className="text-center font-mono">Net Rs.</td>
                            <td className="text-right font-mono">{netRate79.toFixed(2)}</td>
                          </tr>
                          {rateCalc.leadSurchargeTotal > 0 && (
                            <tr>
                              <td>ADD TRANSPORTATION / LEAD CHARGES</td>
                              <td className="text-center font-mono">Lead</td>
                              <td className="text-right font-mono">{rateCalc.leadSurchargeTotal.toFixed(2)}</td>
                            </tr>
                          )}
                          {facesheet.areaSurchargePercent > 0 && (
                            <tr>
                              <td>Add for Municipal Area Surcharge @ {facesheet.areaSurchargePercent}% on Net</td>
                              <td className="text-center font-mono">+{facesheet.areaSurchargePercent}%</td>
                              <td className="text-right font-mono">{surchargeAmt.toFixed(4)}</td>
                            </tr>
                          )}
                          <tr>
                            <td>Add 21.00% of labour amenities /cess /insurance</td>
                            <td className="text-center font-mono">(+) 21%</td>
                            <td className="text-right font-mono">{cess21Readd.toFixed(2)}</td>
                          </tr>
                          {rateCalc.scadaDeduction > 0 && (
                            <tr>
                              <td>Deduct for SCADA Mixer Provision</td>
                              <td className="text-center font-mono">SCADA</td>
                              <td className="text-right font-mono">(-) {rateCalc.scadaDeduction.toFixed(2)}</td>
                            </tr>
                          )}
                          <tr className="font-bold border-t-2 border-black bg-neutral-50">
                            <td>Total Rs. / Say Total Rs. (Per {it.unit})</td>
                            <td className="text-center font-mono">FINAL</td>
                            <td className="text-right font-mono font-bold">Rs. {rateCalc.finalRate.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            </div>

            <MonochromaticSignatures />
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SHEET 13: ROYALTY (SCHEDULE 'B' STATUTORY ROYALTY STATEMENT) */}
        {/* ----------------------------------------------------------------------- */}
        {includeRoyalty && (
          <div className="print-page bg-white text-black p-8 sm:p-12 mb-8 max-w-[210mm] mx-auto border border-black shadow-2xl mono-doc print:border-none print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between">
            <div>
              <div className="border-b-2 border-black pb-2 mb-4">
                <p className="text-xs font-bold uppercase">NAME OF WORK :- {facesheet.nameOfWork}</p>
                <h2 className="text-center text-base font-bold tracking-widest uppercase mt-1">
                  R O Y A L T Y &nbsp; C H A R G E S &nbsp; (SCHEDULE 'B')
                </h2>
                <p className="text-center text-[10px] font-bold uppercase">(AS PER MAHARASHTRA MINOR MINERAL EXTRACTION RULES)</p>
              </div>

              {/* Item Consumption Explosion */}
              <table className="mono-table mono-table-tight mb-4">
                <thead>
                  <tr>
                    <th className="w-10">Item No.</th>
                    <th className="w-16">Ref. No.</th>
                    <th>Item of Work Description</th>
                    <th className="w-20 text-right">Qty</th>
                    <th className="w-12 text-center">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => {
                    const totalQty = it.measurements.reduce((acc, m) => acc + m.computedQty, 0);
                    return (
                      <tr key={it.id}>
                        <td className="text-center font-bold">{idx + 1}</td>
                        <td className="font-mono text-center">{it.itemCode}</td>
                        <td className="text-[10px]">{it.description}</td>
                        <td className="text-right font-mono">{totalQty.toFixed(2)}</td>
                        <td className="text-center text-[10px]">{it.unit}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Royalty Summary Matrix matching S.P. OFF.WALL. Sample.xlsm ROYALTY */}
              <div className="border border-black p-3 mb-4">
                <p className="font-bold text-xs uppercase mb-2">Royalty Charges Matrix by Material:</p>
                <table className="mono-table">
                  <thead>
                    <tr>
                      <th>Royalty Material</th>
                      <th className="w-28 text-right">Quantity (Cu.M)</th>
                      <th className="w-28 text-right">Rate (Rs./Cu.M)</th>
                      <th className="w-36 text-right">Amount (Rs.)</th>
                      <th className="w-16 text-center">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {royaltyRows.map((r, rIdx) => (
                      <tr key={rIdx}>
                        <td className="font-bold">{r.materialName}</td>
                        <td className="text-right font-mono">{r.volumeCuM.toFixed(3)}</td>
                        <td className="text-right font-mono">Rs. {r.royaltyRate.toFixed(2)}</td>
                        <td className="text-right font-mono font-bold">Rs. {r.amount.toFixed(2)}</td>
                        <td className="text-center text-[10px]">Cum</td>
                      </tr>
                    ))}
                    <tr className="font-bold border-t-2 border-black bg-neutral-50">
                      <td colSpan={3} className="text-right uppercase">
                        TOTAL SCHEDULE 'B' ROYALTY CHARGES:
                      </td>
                      <td className="text-right font-mono font-bold">
                        Rs. {totalRoyalty.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="text-center text-[10px]">Rs.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <MonochromaticSignatures />
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SHEET 14: LEAD (QUARRY LEAD STATEMENT) */}
        {/* ----------------------------------------------------------------------- */}
        {includeLead && (
          <div className="print-page bg-white text-black p-8 sm:p-12 mb-8 max-w-[210mm] mx-auto border border-black shadow-2xl mono-doc print:border-none print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between">
            <div>
              <div className="border-b-2 border-black pb-2 mb-4">
                <p className="text-xs font-bold uppercase">NAME OF WORK :- {facesheet.nameOfWork}</p>
                <h2 className="text-center text-base font-bold tracking-widest uppercase mt-1">
                  L E A D &nbsp; S T A T E M E N T
                </h2>
                <p className="text-center text-[10px] font-bold uppercase">(LEAD CHARGES FOR ROAD, BRIDGE & BUILDING MATERIALS - SSR {facesheet.ssrYear})</p>
              </div>

              <table className="mono-table">
                <thead>
                  <tr>
                    <th className="w-10">Sr.</th>
                    <th>MATERIAL</th>
                    <th className="w-52">SOURCE / QUARRY LOCATION</th>
                    <th className="w-24 text-center">LEAD IN KM</th>
                    <th className="w-28 text-right">LEAD CHAR. (Rs.)</th>
                    <th className="w-24 text-center">HEATING</th>
                    <th className="w-28 text-right">TOTAL RATE</th>
                    <th className="w-16 text-center">UNIT</th>
                  </tr>
                </thead>
                <tbody>
                  {leadSettings.map((lead, lIdx) => (
                    <tr key={lead.materialId}>
                      <td className="text-center font-bold">{lIdx + 1}</td>
                      <td className="font-semibold text-xs">{lead.materialName}</td>
                      <td>{lead.sourceQuarry || 'LOCAL AUTHORIZED QUARRY'}</td>
                      <td className="text-center font-mono">{lead.distanceKm}</td>
                      <td className="text-right font-mono">{lead.calculatedRate.toFixed(2)}</td>
                      <td className="text-center font-mono">0</td>
                      <td className="text-right font-mono font-bold">{lead.calculatedRate.toFixed(2)}</td>
                      <td className="text-center text-[10px]">{lead.unit}</td>
                    </tr>
                  ))}
                  {facesheet.scadaDeductionActive && (
                    <tr className="font-bold border-t border-black">
                      <td className="text-center font-bold">*</td>
                      <td colSpan={5}>Deduct for SCADA Reversible Drum Mixer Provision</td>
                      <td className="text-right font-mono">(-) {facesheet.scadaDeductionAmount.toFixed(2)}</td>
                      <td className="text-center text-[10px]">Cum</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <MonochromaticSignatures />
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SHEET 15: TESTING CHARGES (SCHEDULE 'C' QUALITY TESTING REGISTER) */}
        {/* ----------------------------------------------------------------------- */}
        {includeTesting && (
          <div className="print-page bg-white text-black p-8 sm:p-12 mb-8 max-w-[210mm] mx-auto border border-black shadow-2xl mono-doc print:border-none print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between">
            <div>
              <div className="border-b-2 border-black pb-2 mb-4">
                <p className="text-xs font-bold uppercase">NAME OF WORK :- {facesheet.nameOfWork}</p>
                <h2 className="text-center text-base font-bold tracking-widest uppercase mt-1">
                  T E S T I N G &nbsp; C H A R G E S &nbsp; (SCHEDULE 'C')
                </h2>
                <p className="text-center text-[10px] font-bold uppercase">(AS PER MAHARASHTRA PWD HANDBOOK CHAPTER 33 QUALITY CONTROL SPECIFICATIONS)</p>
              </div>

              <table className="mono-table">
                <thead>
                  <tr>
                    <th className="w-10">Sr.</th>
                    <th>SPECIFICATION OF TESTING</th>
                    <th className="w-20 text-right">Qty.</th>
                    <th className="w-14 text-center">Unit</th>
                    <th className="w-36 text-center">Frequency</th>
                    <th className="w-20 text-center">Test Required</th>
                    <th className="w-24 text-right">Rate / Test</th>
                    <th className="w-28 text-right">Amount (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  {testRows.map((t, tIdx) => (
                    <tr key={tIdx}>
                      <td className="text-center font-bold">{tIdx + 1}</td>
                      <td className="font-semibold text-xs">{t.materialName}</td>
                      <td className="text-right font-mono">{t.totalVolume.toFixed(2)}</td>
                      <td className="text-center text-[10px]">{t.materialId === 'STEEL' ? 'MT' : 'Cum'}</td>
                      <td className="text-center text-[10px]">{t.threshold > 0 ? `1 per ${t.threshold} ${t.materialId === 'STEEL' ? 'MT' : 'Cum'}` : t.standard}</td>
                      <td className="text-center font-mono font-bold">{t.batchesCount}</td>
                      <td className="text-right font-mono">Rs. {t.feePerBatch.toFixed(2)}</td>
                      <td className="text-right font-mono font-bold">Rs. {t.totalCost.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold border-t-2 border-black bg-neutral-50">
                    <td colSpan={7} className="text-right uppercase">
                      TOTAL SCHEDULE 'C' QUALITY CONTROL TESTING CHARGES:
                    </td>
                    <td className="text-right font-mono font-bold">
                      Rs. {totalTestingCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <MonochromaticSignatures />
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SHEET 16: @SCHEDULE B & C (TENDER SCHEDULE WITH RATES IN WORDS) */}
        {/* ----------------------------------------------------------------------- */}
        {includeScheduleB && (
          <div className="print-page bg-white text-black p-8 sm:p-12 mb-8 max-w-[210mm] mx-auto border border-black shadow-2xl mono-doc print:border-none print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between">
            <div>
              <div className="border-b-2 border-black pb-2 mb-4">
                <p className="text-xs font-bold uppercase">NAME OF WORK :- {facesheet.nameOfWork}</p>
                <h2 className="text-center text-base font-bold tracking-widest uppercase mt-1">
                  S C H E D U L E &nbsp; " B " &nbsp; & &nbsp; " C "
                </h2>
                <p className="text-center text-[10px] font-bold uppercase">(OFFICIAL TENDER SCHEDULE WITH ITEM RATES IN WORDS & FIGURES)</p>
              </div>

              <table className="mono-table mono-table-tight">
                <thead>
                  <tr>
                    <th className="w-8">Sr. No.</th>
                    <th className="w-16">SSR No.</th>
                    <th>ITEM OF WORK</th>
                    <th className="w-16 text-right">QTY</th>
                    <th className="w-20 text-right">RATE (Fig)</th>
                    <th className="w-36 text-left">RATE IN WORDS</th>
                    <th className="w-14 text-center">UNIT</th>
                    <th className="w-24 text-right">AMOUNT (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  {abstractRows.map((row) => (
                    <tr key={row.sr}>
                      <td className="text-center font-bold align-top">{row.sr}</td>
                      <td className="text-center font-mono align-top">{row.itemCode}</td>
                      <td className="align-top text-[10px] leading-snug">
                        {row.description}
                      </td>
                      <td className="text-right font-mono align-top">{row.qty.toFixed(2)}</td>
                      <td className="text-right font-mono align-top">{row.rate.toFixed(2)}</td>
                      <td className="align-top text-[9px] font-serif italic leading-tight">
                        {numberToIndianWords(row.rate)}
                      </td>
                      <td className="text-center align-top text-[10px]">Per {row.unit}</td>
                      <td className="text-right font-mono font-bold align-top">
                        {row.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold border-t-2 border-b-2 border-black bg-neutral-50">
                    <td colSpan={7} className="text-right uppercase">
                      TOTAL SCHEDULE "B" WORK PORTION:
                    </td>
                    <td className="text-right font-mono font-bold">
                      Rs. {calculationRollup.scheduleA_costOfWork.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <MonochromaticSignatures />
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SHEET 17: CONSUMPTION (MATERIAL CONSUMPTION & RECONCILIATION) */}
        {/* ----------------------------------------------------------------------- */}
        {includeConsumption && (
          <div className="print-page bg-white text-black p-8 sm:p-12 mb-8 max-w-[210mm] mx-auto border border-black shadow-2xl mono-doc print:border-none print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between">
            <div>
              <div className="border-b-2 border-black pb-2 mb-4">
                <p className="text-xs font-bold uppercase">NAME OF WORK :- {facesheet.nameOfWork}</p>
                <h2 className="text-center text-base font-bold tracking-widest uppercase mt-1">
                  C O N S U M P T I O N &nbsp; S T A T E M E N T
                </h2>
                <p className="text-center text-[10px] font-bold uppercase">(THEORETICAL MATERIAL CONSUMPTION & RECONCILIATION REGISTER)</p>
              </div>

              {/* Material Totals Summary Grid */}
              <div className="border border-black p-3 mb-6">
                <p className="font-bold text-xs uppercase mb-2">Net Estimated Material Requirements:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {Object.entries(materialTotals).map(([matId, d]) => (
                    <div key={matId} className="border border-black p-2 text-center">
                      <span className="font-bold text-[10px] uppercase block">{d.materialName}</span>
                      <span className="font-mono font-bold text-sm">{d.totalQty.toFixed(2)}</span>
                      <span className="text-[10px] text-neutral-600 block">{d.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Resource Breakdown */}
              <table className="mono-table mono-table-tight">
                <thead>
                  <tr>
                    <th className="w-14 text-center">Item Code</th>
                    <th className="text-left min-w-[180px]">Specification</th>
                    <th className="w-16 text-right whitespace-nowrap">Item Qty</th>
                    <th className="w-32 text-left">Material</th>
                    <th className="w-14 text-right whitespace-nowrap">CF</th>
                    <th className="w-20 text-right whitespace-nowrap">Derived Qty</th>
                    <th className="w-12 text-center whitespace-nowrap">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {materialRows.map((r, idx) => (
                    <tr key={idx}>
                      <td className="text-center font-mono font-bold align-top">{r.itemCode}</td>
                      <td className="text-[10px] leading-tight whitespace-normal break-words align-top">{r.description}</td>
                      <td className="text-right font-mono whitespace-nowrap align-top">{r.itemQty.toFixed(2)}</td>
                      <td className="font-semibold text-[10px] whitespace-normal break-words align-top">{r.materialName}</td>
                      <td className="text-right font-mono whitespace-nowrap align-top">{r.factor.toFixed(3)}</td>
                      <td className="text-right font-mono font-bold whitespace-nowrap align-top">{r.derivedQty.toFixed(2)}</td>
                      <td className="text-center text-[10px] whitespace-nowrap align-top">{r.materialUnit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <MonochromaticSignatures />
          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* SHEET 18: BBS_STEEL (BAR BENDING SCHEDULE - IS 2502) */}
        {/* ----------------------------------------------------------------------- */}
        {includeBbs && (
          <div className="print-page bg-white text-black p-8 sm:p-12 mb-8 max-w-[210mm] mx-auto border border-black shadow-2xl mono-doc print:border-none print:shadow-none print:p-0 print:m-0 min-h-[297mm] flex flex-col justify-between">
            <div>
              <div className="border-b-2 border-black pb-2 mb-4">
                <p className="text-xs font-bold uppercase">NAME OF WORK :- {facesheet.nameOfWork}</p>
                <h2 className="text-center text-base font-bold tracking-widest uppercase mt-1">
                  BAR BENDING SCHEDULE (B.B.S. - IS 2502)
                </h2>
                <p className="text-center text-[10px] font-bold uppercase">(STRUCTURAL REINFORCEMENT STEEL DETAILING)</p>
              </div>

              <table className="mono-table mono-table-tight mb-6">
                <thead>
                  <tr>
                    <th className="w-10">Mark</th>
                    <th>Element Description</th>
                    <th className="w-16 text-center">Dia (mm)</th>
                    <th className="w-14 text-center">No. Bars</th>
                    <th className="w-20 text-right">Cut L (m)</th>
                    <th className="w-20 text-right">Tot L (m)</th>
                    <th className="w-20 text-right">Unit Wt (kg/m)</th>
                    <th className="w-24 text-right">Weight (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {bbsElements.map((el, idx) => (
                    <tr key={el.id}>
                      <td className="text-center font-bold">B-{idx + 1}</td>
                      <td>{el.elementLabel} ({el.elementType})</td>
                      <td className="text-center font-mono font-bold">{el.barDiaMm} mm</td>
                      <td className="text-center font-mono">{el.totalBars}</td>
                      <td className="text-right font-mono">{el.cutLengthM.toFixed(2)}</td>
                      <td className="text-right font-mono">{(el.cutLengthM * el.totalBars).toFixed(2)}</td>
                      <td className="text-right font-mono">{el.unitWeightKgM.toFixed(3)}</td>
                      <td className="text-right font-mono font-bold">{el.totalWeightKg.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold border-t-2 border-black bg-neutral-50">
                    <td colSpan={7} className="text-right uppercase">
                      TOTAL REINFORCEMENT STEEL WEIGHT:
                    </td>
                    <td className="text-right font-mono font-bold">
                      {totalBbsKg.toFixed(2)} kg ({totalBbsMT} MT)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <MonochromaticSignatures />
          </div>
        )}

      </div>
    </div>
  );
};
