import React from 'react';
import { Check, X, Sparkles, ArrowRight, ShieldCheck, Printer, FileSpreadsheet, Stamp, FileText, PhoneCall } from 'lucide-react';

interface PricingSectionProps {
  onOpenDemoModal: () => void;
  onSelectPlan?: (planName: string, price: number) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenDemoModal, onSelectPlan }) => {
  return (
    <section id="pricing" className="py-16 sm:py-24 bg-[#F8FAFC] relative overflow-hidden border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-bold uppercase tracking-wider mb-3 border border-slate-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#81C303]" />
            <span>Transparent Annual Licensing</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Simple, Transparent Pricing for Civil Professionals
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Choose the license that fits your engineering needs. Both plans include full access to the complete Maharashtra PWD SSR 2024-25 database and calculation engine.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* Plan 1: Essential / Limited Plan (₹8,000 / Year) */}
          <div className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-300 shadow-xs flex flex-col justify-between relative hover:border-slate-400 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Essential / Limited Plan
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    Estimation Workstation
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  Annual License
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                Ideal for site engineers, quantity surveyors, and contractors who need calculation modeling, SSR rate analysis, and on-screen estimate verification.
              </p>

              {/* Price display */}
              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-mono">
                    ₹8,000
                  </span>
                  <span className="text-sm font-semibold text-slate-500">/ year</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Billed annually • Full 365-day access
                </span>
              </div>

              {/* Explicit Restriction Notice */}
              <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2.5">
                <Printer className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block">Important Plan Restriction:</strong>
                  <span className="text-[11px] text-amber-800 leading-snug">
                    Users on this plan <strong>CANNOT print the official estimate document</strong> or download the complete 18-part Technical Sanction PDF/Excel files. All work remains viewable and calculable on screen.
                  </span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3 mb-8">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Included in Essential Plan:
                </div>

                <div className="flex items-start space-x-2.5 text-xs text-slate-800">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>Full Maharashtra PWD SSR 2024-25 Catalog (2,380+ items, 112 chapters)</span>
                </div>

                <div className="flex items-start space-x-2.5 text-xs text-slate-800">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>Detailed Measurement Sheet (L×B×D take-offs & deduction rows)</span>
                </div>

                <div className="flex items-start space-x-2.5 text-xs text-slate-800">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>Access to all 7 Smart Construction Templates (CC Road, Compound Wall, etc.)</span>
                </div>

                <div className="flex items-start space-x-2.5 text-xs text-slate-800">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>Quarry Lead Statement C1 & dynamic item rate analysis</span>
                </div>

                <div className="flex items-start space-x-2.5 text-xs text-slate-800">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>Material Consumption Explosion (BOM for 18 materials)</span>
                </div>

                <div className="flex items-start space-x-2.5 text-xs text-slate-800">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>Schedule B Minor Mineral Extraction Royalty calculations</span>
                </div>

                <div className="flex items-start space-x-2.5 text-xs text-slate-800">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>Schedule C Mandatory Quality Control Testing Register</span>
                </div>

                <div className="flex items-start space-x-2.5 text-xs text-slate-800">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>Steel Bar Bending Schedule (BBS) with push to Item 26.33</span>
                </div>

                <div className="flex items-start space-x-2.5 text-xs text-slate-800">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>General Abstract Recapitulation (GST 18%, Contingencies, Cess)</span>
                </div>

                {/* Exclusions */}
                <div className="flex items-start space-x-2.5 text-xs text-slate-400 line-through">
                  <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>Official 18-part Technical Sanction Dossier Printing (A4 PDF)</span>
                </div>

                <div className="flex items-start space-x-2.5 text-xs text-slate-400 line-through">
                  <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>Multi-sheet Excel (.xlsx) workbook export</span>
                </div>

                <div className="flex items-start space-x-2.5 text-xs text-slate-400 line-through">
                  <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>Digital Engineering Stamp & Seal Management</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={onOpenDemoModal}
              className="w-full py-3.5 px-6 rounded-xl border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
            >
              <span>Request 3-Day Demo (Test ₹8,000 Plan)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Plan 2: Full Access Plan (₹12,000 / Year) */}
          <div className="bg-white text-slate-900 rounded-3xl p-7 sm:p-9 border-2 border-[#81C303] shadow-xl flex flex-col justify-between relative hover:border-[#72ad02] transition-all ring-4 ring-[#81C303]/10">
            {/* Recommended Badge */}
            <div className="absolute -top-3.5 right-8 bg-[#81C303] text-black text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Recommended • Full Access</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#15803D] block">
                    Full Access Plan
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    Technical Sanction Suite
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-lime-50 text-[#15803D] border border-[#81C303]/40 text-xs font-bold font-mono">
                  All Features Unlocked
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                The complete turnkey solution for registered PWD contractors, consulting engineers, and department divisions requiring full document printing, stamp seals, and Excel exports.
              </p>

              {/* Price display */}
              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-mono">
                    ₹12,000
                  </span>
                  <span className="text-sm font-semibold text-slate-500">/ year</span>
                </div>
                <span className="text-[11px] text-[#15803D] font-bold mt-1 block">
                  Billed annually • Complete unrestricted usage
                </span>
              </div>

              {/* Key Highlights of ₹12,000 plan */}
              <div className="mb-6 p-3.5 rounded-xl bg-lime-50/70 border border-[#81C303]/50 text-slate-900 text-xs flex items-start space-x-2.5">
                <Printer className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-slate-900 block">Full Document Printing Included:</strong>
                  <span className="text-[11px] text-slate-700 leading-snug">
                    Print and export unlimited official 18-part Technical Sanction PDF dossiers, Schedule A, B, C, and full multi-sheet Excel files.
                  </span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3 mb-8">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Everything in the ₹8,000 Plan, Plus:
                </div>

                <div className="flex items-start space-x-2.5 text-xs text-slate-900">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5 font-bold" />
                  <span>
                    <strong>Official 18-Part Technical Sanction Dossier Printing</strong> with Maharashtra Government emblem and formatting
                  </span>
                </div>

                <div className="flex items-start space-x-2.5 text-xs text-slate-900">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5 font-bold" />
                  <span>
                    <strong>Export to Full Multi-Sheet Excel Workbook (.xlsx)</strong> with live formulas and editable schedules
                  </span>
                </div>

                <div className="flex items-start space-x-2.5 text-xs text-slate-900">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5 font-bold" />
                  <span>
                    <strong>Digital Signature Stamps & Departmental Seals</strong> for Sectional (SE), Sub-Divisional (SDE), and Executive Engineer (EE)
                  </span>
                </div>

                <div className="flex items-start space-x-2.5 text-xs text-slate-900">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5 font-bold" />
                  <span>
                    <strong>Bilingual Marathi Statutory Documentation</strong> (Outward Letters, Parishishta-A, Technical Sanction Checklist)
                  </span>
                </div>

                <div className="flex items-start space-x-2.5 text-xs text-slate-900">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5 font-bold" />
                  <span>
                    <strong>Priority Phone & WhatsApp Technical Support</strong> for rate queries and customized quarry setups
                  </span>
                </div>

                <div className="flex items-start space-x-2.5 text-xs text-slate-900">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5 font-bold" />
                  <span>
                    <strong>Multi-Device License Access</strong> (Office Desktop, Laptop, and Field Tablet)
                  </span>
                </div>

                <div className="flex items-start space-x-2.5 text-xs text-slate-700">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>All 2,380+ SSR items, Smart Templates, and Automatic Calculations</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={onOpenDemoModal}
              className="w-full py-4 px-6 rounded-xl bg-[#81C303] hover:bg-[#72ad02] text-black text-xs font-black uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 hover:scale-101 active:scale-98 border border-[#72ad02]"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Request 3-Day Demo (Test Full Access)</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>

        {/* Side-by-Side Detailed Plan Comparison Table */}
        <div className="mt-16 max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-200 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Detailed Feature-by-Feature Comparison
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Both plans share the exact same engineering calculations. The distinction is document output & printing.
              </p>
            </div>
            <div className="text-xs font-medium text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 self-center sm:self-auto">
              Upgrade anytime by paying the ₹4,000 difference
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-white">
                  <th className="py-4 px-6 font-bold text-slate-900 w-1/2">Capability / Deliverable</th>
                  <th className="py-4 px-6 font-bold text-slate-900 text-center w-1/4 bg-slate-50/50">
                    <div>Essential Plan</div>
                    <div className="text-[11px] font-normal text-slate-500">₹8,000 / year</div>
                  </th>
                  <th className="py-4 px-6 font-bold text-slate-900 text-center w-1/4 bg-lime-50/30">
                    <div className="text-[#15803D]">Full Access Plan</div>
                    <div className="text-[11px] font-normal text-slate-500">₹12,000 / year</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-6 font-medium text-slate-900">Complete Maharashtra PWD SSR 2024-25 Catalog (2,380+ items)</td>
                  <td className="py-3.5 px-6 text-center bg-slate-50/50 text-[#16A34A] font-bold">✔ Included</td>
                  <td className="py-3.5 px-6 text-center bg-lime-50/30 text-[#16A34A] font-bold">✔ Included</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-6 font-medium text-slate-900">7 Smart Estimation Templates (CC Road, Compound Wall, Gutters, etc.)</td>
                  <td className="py-3.5 px-6 text-center bg-slate-50/50 text-[#16A34A] font-bold">✔ Included</td>
                  <td className="py-3.5 px-6 text-center bg-lime-50/30 text-[#16A34A] font-bold">✔ Included</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-6 font-medium text-slate-900">Dynamic Quarry Lead Statement (C1), Royalty, & Schedule C Registers</td>
                  <td className="py-3.5 px-6 text-center bg-slate-50/50 text-[#16A34A] font-bold">✔ Included</td>
                  <td className="py-3.5 px-6 text-center bg-lime-50/30 text-[#16A34A] font-bold">✔ Included</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-6 font-medium text-slate-900">Material Consumption Explosion (BOM) & Steel BBS Schedules</td>
                  <td className="py-3.5 px-6 text-center bg-slate-50/50 text-[#16A34A] font-bold">✔ Included</td>
                  <td className="py-3.5 px-6 text-center bg-lime-50/30 text-[#16A34A] font-bold">✔ Included</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-6 font-medium text-slate-900">On-Screen Calculation, Verification, and Project File Saving</td>
                  <td className="py-3.5 px-6 text-center bg-slate-50/50 text-[#16A34A] font-bold">✔ Included</td>
                  <td className="py-3.5 px-6 text-center bg-lime-50/30 text-[#16A34A] font-bold">✔ Included</td>
                </tr>
                <tr className="bg-amber-50/40 hover:bg-amber-50/70 transition-colors">
                  <td className="py-3.5 px-6 font-medium text-slate-900">
                    <div className="font-semibold text-amber-900">Official 18-Part Technical Sanction PDF Dossier Generation</div>
                    <div className="text-[11px] text-slate-500">Includes official government title block, page numbering, and audit-ready formatting</div>
                  </td>
                  <td className="py-3.5 px-6 text-center bg-amber-50/60 font-semibold text-rose-600">
                    <span className="inline-flex items-center gap-1"><X className="w-3.5 h-3.5" /> Locked (No PDF)</span>
                  </td>
                  <td className="py-3.5 px-6 text-center bg-lime-50/50 font-bold text-[#15803D]">
                    <span className="inline-flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Unlimited PDF Export</span>
                  </td>
                </tr>
                <tr className="bg-amber-50/40 hover:bg-amber-50/70 transition-colors">
                  <td className="py-3.5 px-6 font-medium text-slate-900">
                    <div className="font-semibold text-amber-900">Multi-Sheet Microsoft Excel (.xlsx) Workbook Export</div>
                    <div className="text-[11px] text-slate-500">Full sheets with linked formulas for Schedule B, Recapitulation, and Leads</div>
                  </td>
                  <td className="py-3.5 px-6 text-center bg-amber-50/60 font-semibold text-rose-600">
                    <span className="inline-flex items-center gap-1"><X className="w-3.5 h-3.5" /> Locked</span>
                  </td>
                  <td className="py-3.5 px-6 text-center bg-lime-50/50 font-bold text-[#15803D]">
                    <span className="inline-flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Full Excel Export</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-6 font-medium text-slate-900">Departmental Digital Stamps & Seals (SE / SDE / EE)</td>
                  <td className="py-3.5 px-6 text-center bg-slate-50/50 text-slate-400 font-semibold">—</td>
                  <td className="py-3.5 px-6 text-center bg-lime-50/30 text-[#15803D] font-bold">✔ Included</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-6 font-medium text-slate-900">Marathi Statutory Documentation (Parishishta-A, Outward Letters)</td>
                  <td className="py-3.5 px-6 text-center bg-slate-50/50 text-slate-400 font-semibold">—</td>
                  <td className="py-3.5 px-6 text-center bg-lime-50/30 text-[#15803D] font-bold">✔ Included</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-6 font-medium text-slate-900">Technical Support & Onboarding</td>
                  <td className="py-3.5 px-6 text-center bg-slate-50/50 text-slate-600">Standard Email</td>
                  <td className="py-3.5 px-6 text-center bg-lime-50/30 text-slate-900 font-semibold">Priority Phone & WhatsApp</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 text-center">
            <button
              onClick={onOpenDemoModal}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#81C303] hover:bg-[#72ad02] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
            >
              <span>Start Free 3-Day Demo — Experience Both Plans</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pricing Guarantee */}
        <div className="mt-12 text-center text-xs text-slate-600 flex items-center justify-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          <span>
            Every license comes with free SSR 2024-25 data updates, zero setup fees, and 3-day full evaluation guarantee.
          </span>
        </div>
      </div>
    </section>
  );
};
