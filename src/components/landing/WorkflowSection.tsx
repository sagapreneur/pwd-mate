import React from 'react';
import { Layers, Search, Ruler, Calculator, FileCheck, ArrowRight, Sparkles } from 'lucide-react';

interface WorkflowSectionProps {
  onOpenDemoModal: () => void;
}

export const WorkflowSection: React.FC<WorkflowSectionProps> = ({ onOpenDemoModal }) => {
  const steps = [
    {
      step: '01',
      title: 'Initialize Scope or Pick a Smart Template',
      desc: 'Set project facesheet metadata with cascading territorial jurisdiction (Region ➔ Circle ➔ Division) or choose a ready archetype like CC Road or Compound Wall.',
      icon: Layers,
      highlight: '6 Regions & 120+ Divisions',
    },
    {
      step: '02',
      title: 'Auto-Map SSR Items with Dynamic Rates',
      desc: 'Instant keyword search across 2,380+ items. Unit rates automatically incorporate Statement C1 quarry transport leads and Municipal/Tribal area surcharges.',
      icon: Search,
      highlight: 'Live SSR 2024-25 Pricing',
    },
    {
      step: '03',
      title: 'Enter Measurements in Digital Ledger (L×B×D)',
      desc: 'Calculate precise net quantities with multi-row takeoffs, deduction rows for openings/voids, multiplier coefficients, and chainage remarks.',
      icon: Ruler,
      highlight: 'Automatic Deductions & Totals',
    },
    {
      step: '04',
      title: 'Automated Multi-Schedule Engine Explosion',
      desc: 'Behind the scenes, KardeCalc computes material consumption (cement, sand, metal), statutory mineral royalty (Schedule B), mandatory testing (Schedule C), and Steel BBS.',
      icon: Calculator,
      highlight: 'Zero Discrepancy Reconciliation',
    },
    {
      step: '05',
      title: 'Generate 18-Part Technical Sanction Dossier',
      desc: 'Review the General Abstract (Recap Sheet), apply digital engineering authority stamps (SE, SDE, EE), and print or export the complete audit-ready A4 dossier.',
      icon: FileCheck,
      highlight: 'Print Ready PDF & Excel (.xlsx)',
    },
  ];

  return (
    <section id="workflow" className="py-16 sm:py-24 bg-[#F8FAFC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider mb-3 border border-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-[#81C303]" />
            <span>Structured 5-Step Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How KardeCalc Transforms Your Estimate Preparation
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#64748B]">
            From administrative project scoping to final Technical Sanction binding — follow a seamless, standardized engineering pipeline.
          </p>
        </div>

        {/* Steps Road */}
        <div className="relative">
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-[#81C303]/50 to-emerald-200 -translate-y-12 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-[#81C303] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-lime-50 text-[#15803D] border border-[#81C303]/40 flex items-center justify-center font-bold text-base shadow-2xs group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-2xl font-black font-mono text-slate-200 group-hover:text-[#81C303] transition-colors">
                        {item.step}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      ✓ {item.highlight}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workflow Bottom Action */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenDemoModal}
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-[#81C303] hover:bg-[#72ad02] text-black text-xs font-black uppercase tracking-wider shadow-sm hover:shadow-md transition-all border border-[#72ad02]"
          >
            <span>Experience the Live 5-Step Workflow in 3-Day Demo</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>
    </section>
  );
};
