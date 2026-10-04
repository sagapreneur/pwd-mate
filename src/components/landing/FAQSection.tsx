import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is KardeCalc?',
      a: 'KardeCalc is a specialized web-based estimation and Technical Sanction platform designed specifically for the Public Works Department (PWD) ecosystem in Maharashtra. It incorporates the complete Standard Schedule of Rates (SSR 2024-25), Statement C1 quarry lead transport calculations, material consumption factor explosions, mineral royalty (Schedule B), quality testing registers (Schedule C), Bar Bending Schedules (BBS), and audit-ready 18-part Technical Sanction dossiers.',
    },
    {
      q: 'Does KardeCalc use real Maharashtra PWD SSR items?',
      a: 'Yes. KardeCalc is pre-loaded with the official Maharashtra PWD Schedule of Rates (SSR 2024-25) containing over 2,380 items across all 112 standard chapters, including Road Survey & DPR, Excavation, Plain & Reinforced Concrete, Brickwork, Stone Masonry, Plastering, Flooring, Road GSB/WMM, Bituminous surfacing, Hume Pipe culverts, Roofing, and Sanitary works. Item descriptions and base rates are faithfully digitized and cross-checked against official government schedule publications.',
    },
    {
      q: 'What is the exact difference between the ₹8,000 and ₹12,000 plans?',
      a: 'The ₹8,000 / Year (Essential Plan) gives you full access to SSR item lookups, measurement take-offs (L×B×D), smart construction templates, lead statements, royalty, and rate analysis on screen. However, users on the ₹8,000 plan CANNOT print or download the official estimate document or technical sanction dossier.\n\nThe ₹12,000 / Year (Full Access Plan) unlocks full, unrestricted printing of the 18-part Technical Sanction PDF dossier, full multi-tab Excel (.xlsx) workbooks, digital engineering signature stamps/seals (SE, SDE, EE), and official bilingual Marathi administrative note sheets.',
    },
    {
      q: 'Can I print or export estimates on the ₹8,000 plan?',
      a: 'No. This is the primary restriction of the Essential Plan. You can create, model, calculate, and save estimates in your account, but the official A4 printable technical sanction dossier, PDF downloads, and Excel exports are disabled. If you need to submit physical or PDF binders to PWD offices, executive engineers, or auditors, you need the ₹12,000 / Year Full Access Plan.',
    },
    {
      q: 'Can I upgrade from the ₹8,000 plan to the ₹12,000 plan later?',
      a: 'Yes. You can upgrade at any point during your active subscription period by paying the ₹4,000 difference. Your project data, custom quarry setups, and estimates remain completely intact, and document printing, PDF dossier generation, and Excel export become instantly unlocked for your account.',
    },
    {
      q: 'How does the 3-Day Free Demo work?',
      a: 'When you submit the demo request form, your evaluation access is activated for 72 hours. You can test all 2,380+ SSR items, explore the 7 pre-engineered Smart Templates, test quarry lead calculations for your specific division, and experience the complete estimation workflow in your browser with zero obligation and no credit card required.',
    },
    {
      q: 'Can I edit an estimate after generating it from a Smart Template?',
      a: 'Yes, absolutely. Smart Templates (such as Compound Wall, CC Road, Gutter, or Culvert) simply automate the initial mapping of items and calculate starting quantities from your site dimensions. Once loaded into the workspace, you can add new SSR items, adjust measurement rows, modify deductions, tweak quarry lead distances, and override rates at any time.',
    },
    {
      q: 'Does KardeCalc generate official Marathi PWD paperwork?',
      a: 'Yes. The ₹12,000 Full Access Plan generates bilingual and Marathi administrative forms including Parishishta-A (परिशिष्ट-अ तांत्रिक मंजुरी टिप्पणी), outward letter formats to Superintending Engineers / Chief Engineers, and standard Marathi PWD Technical Sanction checklist formats.',
    },
    {
      q: 'How are quarry transport lead charges (Statement C1) calculated?',
      a: 'KardeCalc features a built-in Statement C1 calculation engine. You simply set your quarry source and transport distance in kilometers for 18 standard materials (Sand, Metal 20mm/40mm, Murum, Rubble, Bricks, Cement, Steel, Bitumen). The engine applies initial lead deductions and PWD mileage slabs (mechanical tipper vs cartage) as per PWD Red Book rules, automatically adding the calculated lead charges to your SSR unit rates.',
    },
    {
      q: 'Are statutory area surcharges and SCADA deductions supported?',
      a: 'Yes. In the Facesheet and Rate Analysis modules, you can select statutory area surcharges (+4% for Municipal Councils, +5% for Municipal Corporations, and +10% for designated Tribal/Hilly areas). For concrete items mixed via batching plants, the mandatory SCADA batching plant rebate deduction is automatically calculated and subtracted.',
    },
    {
      q: 'How does the Bar Bending Schedule (BBS) work?',
      a: 'The Steel BBS module allows you to detail structural reinforcement elements (footings, columns, beams, slabs) by bar diameter (6mm to 32mm). It calculates cutting lengths, deducts standard bend allowances (45°, 90°, 135°), and computes total metric tonnage. With a single click, the calculated net weight is automatically pushed into SSR Item 26.33 (TMT Fe-500 rebar) in your estimate abstract.',
    },
    {
      q: 'What happens when Maharashtra PWD publishes a new SSR revision?',
      a: 'All active subscribers receive automatic SSR updates at no additional charge. When government corrigenda or annual SSR revisions are gazetted, the new rates and chapters are updated directly in KardeCalc\'s database without requiring manual patch installations.',
    },
    {
      q: 'Do I need to install any heavy software or AutoCAD plugins?',
      a: 'No. KardeCalc runs entirely in modern web browsers (Chrome, Edge, Firefox, Safari) on any desktop, laptop, or tablet. Your estimate calculations, measurements, and project records are securely persisted with cloud backup, allowing you to prepare estimates from the site, office, or home.',
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider mb-3 border border-slate-200">
            <HelpCircle className="w-3.5 h-3.5 text-[#81C303]" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Clear, honest answers about KardeCalc, licensing options, SSR accuracy, and technical capabilities.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden transition-all bg-[#F8FAFC]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-emerald-700 transition-colors"
                >
                  <span className="flex items-center space-x-2.5">
                    <span className="text-[11px] font-mono text-slate-500 w-5">
                      {idx < 9 ? `0${idx + 1}.` : `${idx + 1}.`}
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-emerald-700' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-[13px] text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white whitespace-pre-line">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
