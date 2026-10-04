import React from 'react';
import { Check, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface ComparisonSectionProps {
  onOpenDemoModal: () => void;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({ onOpenDemoModal }) => {
  const comparisonRows = [
    {
      parameter: 'SSR Item Discovery & Codes',
      manual: 'Manual search through multiple 600-page PDF documents and circulars',
      kardecalc: 'Instant real-time fuzzy search across all 2,380+ SSR 2024-25 items and 112 chapters',
      advantage: true,
    },
    {
      parameter: 'Quarry Lead Transport (Statement C1)',
      manual: 'Manual spreadsheet formula lookup for mileage slabs and initial lead deductions',
      kardecalc: 'Automated Statement C1 engine with 18 materials and designated quarry distances',
      advantage: true,
    },
    {
      parameter: 'Routine Estimate Preparation',
      manual: 'Manual re-entry of items and repetitive dimensions for every standard work',
      kardecalc: 'Pre-engineered Smart Templates for CC Roads, Compound Walls, Gutters, Culverts',
      advantage: true,
    },
    {
      parameter: 'Area Surcharge & SCADA Rebates',
      manual: 'Manual percentage multiplication often missed during audit reviews',
      kardecalc: 'Automated Municipal / Tribal area surcharge and SCADA batching plant deductions',
      advantage: true,
    },
    {
      parameter: 'Minor Mineral Royalty (Schedule B)',
      manual: 'Manual material volume extraction and separate challan calculation sheets',
      kardecalc: 'Automatic BOM explosion & Schedule B generation (Sand ₹150, Metal ₹80, Murum ₹80)',
      advantage: true,
    },
    {
      parameter: 'Mandatory QC Testing (Schedule C)',
      manual: 'Calculating test frequencies manually as per PWD Red Book / MoRTH rules',
      kardecalc: 'Automated testing register calculation derived directly from measured work quantities',
      advantage: true,
    },
    {
      parameter: 'Reinforcement Steel (BBS)',
      manual: 'Prepared on separate bar bending sheets with manual transfer to estimate item',
      kardecalc: 'Integrated BBS with diameter-wise weights and 1-click push to SSR Item 26.33',
      advantage: true,
    },
    {
      parameter: 'Technical Sanction Dossier Formatting',
      manual: 'Hours spent assembling cover, index, Marathi note sheets, abstracts, and signatures',
      kardecalc: 'One-click 18-part A4 printable Technical Sanction binder with official stamps',
      advantage: true,
    },
    {
      parameter: 'Design Revisions & Quantity Changes',
      manual: 'Modifying one measurement requires manual recalculation of all downstream sheets',
      kardecalc: 'Reactive calculations update abstracts, leads, royalty, and totals instantaneously',
      advantage: true,
    },
  ];

  return (
    <section id="comparison" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider mb-3 border border-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-[#81C303]" />
            <span>Workflow Comparison</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Traditional Manual Workflow vs. KardeCalc
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#64748B]">
            See why civil engineers, contractors, and PWD consultants across Maharashtra are shifting away from fragmented Excel spreadsheets.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="py-4 px-5 font-bold w-1/4">Engineering Workflow Step</th>
                <th className="py-4 px-5 font-semibold text-slate-600 w-3/8 bg-slate-50">
                  Traditional Manual / Excel Method
                </th>
                <th className="py-4 px-5 font-bold text-slate-900 w-3/8 bg-[#FBFFEB] border-l border-slate-200">
                  <span className="flex items-center space-x-1.5">
                    <span>With KardeCalc Platform</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#81C303] text-black text-[9px] font-black">
                      OPTIMIZED
                    </span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {comparisonRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-[#F8FAFC] hover:bg-slate-50'}
                >
                  <td className="py-3.5 px-5 font-bold text-slate-900">
                    {row.parameter}
                  </td>
                  <td className="py-3.5 px-5 text-[#64748B] flex items-start space-x-2">
                    <X className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                    <span>{row.manual}</span>
                  </td>
                  <td className="py-3.5 px-5 font-medium text-[#111827] bg-[#FBFFEB]/40 border-l border-slate-200">
                    <div className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5 font-bold" />
                      <span>{row.kardecalc}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA Callout */}
        <div className="mt-10 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-50 via-white to-lime-50/50 border border-slate-200 shadow-xs text-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-[#15803D]" />
              <span>Spend Less Time on Mechanical Tasks, More on Engineering Analysis</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Eliminate formula mistakes, expedite technical sanctions, and generate audit-compliant PWD estimates with total confidence.
            </p>
          </div>
          <button
            onClick={onOpenDemoModal}
            className="px-6 py-3.5 rounded-xl bg-[#81C303] hover:bg-[#72ad02] text-black text-xs font-black uppercase tracking-wider shrink-0 transition-all shadow-sm hover:shadow-md flex items-center space-x-2 border border-[#72ad02]"
          >
            <span>Start Free 3-Day Demo</span>
            <ArrowRight className="w-3.5 h-3.5 text-black" />
          </button>
        </div>
      </div>
    </section>
  );
};
