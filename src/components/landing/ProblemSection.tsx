import React from 'react';
import { AlertTriangle, Clock, FileSpreadsheet, Search, RefreshCw, XCircle, ShieldAlert } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      icon: Search,
      title: 'Searching 4,000+ SSR Items in 600-Page PDFs',
      desc: 'Engineers waste hours hunting down exact item codes across dozens of SSR chapters, specification books, and regional corrigenda.',
    },
    {
      icon: FileSpreadsheet,
      title: 'Fragile Excel Spreadsheets & Broken Formulas',
      desc: 'Accidental formula overwrites, rounding discrepancies, and unlinked cells lead to costly estimation errors and audit queries.',
    },
    {
      icon: Clock,
      title: 'Tedious Statement C1 Quarry Lead Transport',
      desc: 'Calculating mileage distances from quarries, mechanical cartage slabs, and initial lead deductions manually for each raw material is painfully slow.',
    },
    {
      icon: RefreshCw,
      title: 'Rebuilding Routine Works from Scratch',
      desc: 'Compound walls, CC roads, open gutters, and culverts require re-entering the same 10-15 standard SSR items and dimensions every single time.',
    },
    {
      icon: AlertTriangle,
      title: 'Royalty & Material Consumption Reconciliations',
      desc: 'Calculating theoretical consumption for cement, sand, and metal, plus computing Schedule B mineral royalty challans is complex and time-consuming.',
    },
    {
      icon: XCircle,
      title: 'Technical Sanction Submission Rejections',
      desc: 'Missing statutory checklists, unformatted measurement sheets, or improper Marathi/English note sheets cause administrative sanction delays.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-50 text-[#DC2626] text-xs font-bold uppercase tracking-wider mb-3 border border-red-100">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>The High Cost of Manual Estimation</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Preparing PWD Estimates Manually is Slow, Repetitive, and Prone to Costly Audit Errors
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#64748B]">
            Civil engineers and contractors in Maharashtra spend significant time doing tedious SSR lookup and cross-referencing instead of engineering analysis.
          </p>
        </div>

        {/* Problem Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200 hover:border-red-200 hover:bg-white hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-red-100/70 text-[#DC2626] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-950 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
