import React, { useState } from 'react';
import { Search, Ruler, Truck, Calculator, Layers, FileCheck, CheckCircle2, Shield, Hammer, FileText, ArrowRight, Sparkles } from 'lucide-react';

interface FeatureShowcaseProps {
  onOpenDemoModal: () => void;
}

export const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({ onOpenDemoModal }) => {
  const [selectedFeature, setSelectedFeature] = useState(0);

  const features = [
    {
      id: 'ssr-catalog',
      icon: Search,
      badge: '2,380+ Items • 112 Chapters',
      title: 'Statewide Maharashtra SSR 2024-25 Catalog',
      summary: 'Instant fuzzy search across all standard PWD chapters with real-time base rates and dynamic lead calculations.',
      details: [
        'Fuzzy keyword search by item description, item code (e.g. 21.01, 25.11, 26.33), or work type',
        'Direct chapter filtering: Excavation, PCC, RCC Concrete, Brickwork, Plastering, Road GSB/WMM, Bituminous, Roofing, Sanitary',
        'Live lead rates calculated in real-time alongside base SSR rates',
        'One-click item addition into current estimate or measurement take-off',
      ],
      img: '/screenshots/catalog-preview.png',
    },
    {
      id: 'measurements',
      icon: Ruler,
      badge: 'L × B × D Digital Ledger',
      title: 'Detailed Measurement Sheet with Deductions',
      summary: 'Sub-divisible dimensional take-offs with automatic row-level calculation and void deduction handling.',
      details: [
        'Multi-row measurement ledger for each SSR work item',
        'Supports Length × Breadth × Depth/Height with custom multiplication factor',
        'Dedicated "Deduction Rows" for windows, doors, voids, and overlapping openings',
        'Chainage and location remarks (e.g., Ch. 0/000 to Ch. 0/250, LHS / RHS)',
        'Net quantity calculated instantly and pushed to Schedule A Abstract of Cost',
      ],
      img: '/screenshots/facesheet-preview.png',
    },
    {
      id: 'lead-analysis',
      icon: Truck,
      badge: 'Statement C-1 Lead Transport',
      title: 'Quarry Lead Chart & Dynamic Rate Buildup',
      summary: 'Automatic quarry distance calculation, initial lead deduction, and statutory area surcharge application.',
      details: [
        'Pre-configured for 18 core materials (Sand, Metal 40mm/20mm/10mm, Murum, Rubble, Bricks, Cement, Steel, Bitumen)',
        'Designated quarry mapping with kilometer road distances',
        'Mechanical tipper vs manual cartage distance slabs as per PWD Red Book',
        'Area Surcharge selector (+4% Municipal Council, +5% Municipal Corp, +10% Tribal/Hilly areas)',
        'Automatic SCADA batching plant rebate deduction for ready mix concrete',
      ],
      img: '/screenshots/general-abstract-preview.png',
    },
    {
      id: 'consumption-royalty',
      icon: Calculator,
      badge: 'Schedule B Royalty & Testing',
      title: 'Material Consumption, Royalty & Testing Schedules',
      summary: 'Automatic Bill of Materials (BOM) explosion, mineral extraction challans, and mandatory QC test registers.',
      details: [
        'Explodes executed work quantities into constituent raw materials using standard PWD Consumption Factors (CF)',
        'Schedule B Minor Mineral Royalty statement: Sand (₹150/Cu.M), Metal & Rubble (₹80/Cu.M), Murum & Earth (₹80/Cu.M)',
        'Schedule C Quality Control Testing Register with mandatory test frequencies as per PWD Red Book Vol II & MoRTH Section 1700',
        'Reconciles theoretical consumption vs actual procurement for audit defense',
      ],
      img: '/screenshots/general-abstract-preview.png',
    },
    {
      id: 'steel-bbs',
      icon: Hammer,
      badge: 'Bar Bending Schedule',
      title: 'Reinforcement Steel BBS with 1-Click Push',
      summary: 'Structural rebar schedule by diameter with bend deductions, unit weight calculations, and direct item sync.',
      details: [
        'Covers 6mm to 32mm diameters with standard weight coefficients (D²/162 kg/m)',
        'Calculates cutting lengths for main bars, stirrups, binders, and bent-up bars',
        '45°, 90°, and 135° bend deduction geometry formulas',
        'Direct 1-Click Action: "Push Net BBS Weight to SSR Item 26.33 (TMT Rebar)"',
      ],
      img: '/screenshots/printable-dossier-preview.png',
    },
    {
      id: 'dossier-export',
      icon: FileCheck,
      badge: '18-Part Technical Sanction Format',
      title: 'Complete Printable Dossier & Excel (.xlsx) Export',
      summary: 'Monochromatic, audit-ready A4 technical binder formatted with Maharashtra emblem, index, Marathi notes, and digital stamps.',
      details: [
        'Includes Cover Face, Index, Facesheet, TS Checklist, Certificates, SDE Letter (मराठी), Parishishta-A, Grand Abstract, Schedule A, Measurement, Rate Analysis, Royalty, Lead Statement, Testing, Consumption, and BBS',
        'Digital stamp blocks for Sectional Engineer (SE), Sub-Divisional Engineer (SDE), and Executive Engineer (EE)',
        'One-click native print / save as PDF (Ctrl + P) with clean page breaks',
        'Full multi-tab Excel export (.xlsx) with formulas for offline review',
      ],
      img: '/screenshots/printable-dossier-preview.png',
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-lime-50 text-[#15803D] text-xs font-bold uppercase tracking-wider mb-3 border border-[#81C303]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#15803D]" />
            <span>Built Specifically for Maharashtra PWD Standards</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered to Prevent Audit Objections & Technical Sanction Delays
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#64748B]">
            From individual brickwork measurements to division-level technical sanction approvals, KardeCalc integrates every stage of the Maharashtra PWD estimation workflow.
          </p>
        </div>

        {/* Feature Selector Tabs for Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            const isSelected = selectedFeature === idx;
            return (
              <button
                key={feat.id}
                onClick={() => setSelectedFeature(idx)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white text-slate-900 border-2 border-[#81C303] shadow-sm scale-102 font-bold'
                    : 'bg-[#F8FAFC] text-[#64748B] border-slate-200 hover:border-slate-300 hover:bg-slate-100/70 font-semibold'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-[#15803D]' : 'text-slate-700'}`} />
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-lime-100 text-[#15803D]' : 'bg-slate-200/70 text-slate-700'
                  }`}>
                    0{idx + 1}
                  </span>
                </div>
                <span className="text-xs font-bold leading-snug truncate">
                  {feat.title.split(' ')[0]} {feat.title.split(' ')[1]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Feature Deep Dive Showcase Card */}
        <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-4">
              <span className="inline-block px-3 py-1 bg-white border border-[#E5E7EB] text-slate-800 text-xs font-bold uppercase tracking-wider rounded-full shadow-2xs">
                {features[selectedFeature].badge}
              </span>

              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {features[selectedFeature].title}
              </h3>

              <p className="text-sm text-[#64748B] leading-relaxed">
                {features[selectedFeature].summary}
              </p>

              <div className="space-y-2.5 pt-2">
                {features[selectedFeature].details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-start space-x-2.5 text-xs text-[#111827]">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                    <span className="leading-snug">{detail}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center space-x-4">
                <button
                  onClick={onOpenDemoModal}
                  className="px-5 py-2.5 rounded-xl bg-[#81C303] hover:bg-[#72ad02] text-black text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-2 shadow-sm border border-[#72ad02]"
                >
                  <span>Test in 3-Day Demo</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>
                <span className="text-[11px] text-[#64748B] font-medium">
                  Included in both plans
                </span>
              </div>
            </div>

            {/* Right UI Preview Screen */}
            <div className="lg:col-span-6">
              <div className="rounded-xl overflow-hidden shadow-lg border border-slate-300 bg-white group">
                <div className="bg-slate-100 text-slate-700 px-3 py-1.5 text-[11px] font-mono flex items-center justify-between border-b border-slate-200">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#81C303]" />
                    <span>KardeCalc Interface • {features[selectedFeature].id}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-sans">Live Application UI</span>
                </div>
                <img
                  src={features[selectedFeature].img}
                  alt={features[selectedFeature].title}
                  className="w-full h-auto max-h-[400px] object-cover object-top transition-transform duration-500 group-hover:scale-102"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
