import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface FinalCTASectionProps {
  onOpenDemoModal: () => void;
  onOpenLogin: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({ onOpenDemoModal, onOpenLogin }) => {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-white via-slate-50 to-[#FBFFEB]/50 border-t border-slate-200 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#81C303]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-lime-50 text-[#15803D] text-xs font-bold uppercase tracking-wider mb-4 border border-[#81C303]/40">
          <Sparkles className="w-3.5 h-3.5 text-[#15803D]" />
          <span>Transform Your PWD Estimation Today</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight max-w-3xl mx-auto">
          Ready to Prepare Audit-Ready PWD Estimates with Full Mathematical Rigor?
        </h2>

        <p className="mt-4 text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto leading-relaxed">
          Designed for civil engineers, registered PWD contractors, and estimation consultants across Maharashtra seeking verified formula accuracy and standard PWD compliance.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
          <button
            onClick={onOpenDemoModal}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#81C303] hover:bg-[#72ad02] text-black text-xs font-black uppercase tracking-wider shadow-md hover:shadow-xl transition-all hover:scale-102 active:scale-98 flex items-center justify-center space-x-2 border border-[#72ad02]"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Request 3-Day Free Demo</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>

          <a
            href="#pricing"
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold uppercase tracking-wider border border-slate-300 shadow-2xs hover:shadow transition-all flex items-center justify-center space-x-2"
          >
            <span>View Pricing Plans (From ₹8,000/yr)</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </a>
        </div>

        {/* Trust Points */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
          <div className="flex items-center space-x-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            <span>3 Days Free Evaluation</span>
          </div>
          <div className="flex items-center space-x-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center space-x-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            <span>Instant Cloud Access</span>
          </div>
          <div className="flex items-center space-x-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            <span>Official SSR 2024-25 Data</span>
          </div>
        </div>
      </div>
    </section>
  );
};
