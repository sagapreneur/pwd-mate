import React, { useState } from 'react';
import { Layers, Sparkles, ArrowRight, CheckCircle2, Shield, Clock, IndianRupee, SlidersHorizontal, Check } from 'lucide-react';

interface SmartTemplatesSectionProps {
  onOpenDemoModal: () => void;
}

export const SmartTemplatesSection: React.FC<SmartTemplatesSectionProps> = ({ onOpenDemoModal }) => {
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);

  const templates = [
    {
      code: 'CW-01',
      name: 'BBM Compound Wall with RCC Frame',
      marathi: 'विट बांधकाम कुंपण भिंत (आर.सी.सी. फ्रेम व कोपिंग सह)',
      category: 'Compound & Fencing',
      budget: '₹3.5 L – ₹7.5 L',
      duration: '30 to 45 Days',
      itemsCount: 9,
      desc: 'Standard brick masonry boundary wall with RCC plinth beam, vertical columns at regular intervals, coping, neat cement plastering, and gate opening provisions.',
      parameters: ['Wall Length (m)', 'Wall Height (m)', 'Plinth Depth (m)', 'Column Spacing (m)'],
      mappedItems: [
        'Item 21.01: Earthwork Excavation in Hard Murum for foundation trenches',
        'Item 24.03: Plain Cement Concrete (PCC 1:4:8) under footing & wall',
        'Item 25.11: RCC M-20 in plinth beams & tie columns with steel formwork',
        'Item 26.33: TMT Fe-500 Reinforcement steel bar bending & binding',
        'Item 27.05: Burnt Brick Masonry in cement mortar (1:6) for wall superstructure',
        'Item 32.08: Sand-faced Cement Plaster (20mm) in two coats with curing',
      ],
    },
    {
      code: 'RD-01',
      name: 'Grampanchayat Cement Concrete (CC) Road',
      marathi: 'ग्रामपंचायत सिमेंट काँक्रीट रस्ता (जी.एस.बी., एम-१० व एम-३० सह)',
      category: 'Roads & Pavements',
      budget: '₹5.0 L – ₹18.0 L',
      duration: '20 to 30 Days',
      itemsCount: 6,
      desc: 'Rigid pavement for village roads with subgrade dressing, Granular Sub-base (GSB), PCC M10 bedding base, M30 concrete pavement slab, contraction joints, and curing compound.',
      parameters: ['Road Length (m)', 'Carriageway Width (m)', 'Pavement Thickness (m)', 'GSB Thickness (m)'],
      mappedItems: [
        'Item 1.05: Clearing subgrade, scarifying & leveling ground surface',
        'Item 14.02: Granular Sub-Base (GSB) 100mm thick with rolling and compaction',
        'Item 24.03: PCC M-10 Levelling course 75mm under concrete slab',
        'Item 25.15: Ready Mix / Site Mix Cement Concrete M-30 Pavement slab 150mm',
        'Item 28.12: Diamond blade contraction joint cutting (3-5mm) & polysulphide sealant',
        'Item 29.04: Curing compound application and gunny bag ponding for 14 days',
      ],
    },
    {
      code: 'DR-01',
      name: 'Open Surface Drainage (U-Shape Gutter with Cover)',
      marathi: 'उघडी सिमेंट गटार योजना (आर.सी.सी. कव्हर स्लॅब सह)',
      category: 'Drainage & Stormwater',
      budget: '₹2.5 L – ₹6.0 L',
      duration: '15 to 25 Days',
      itemsCount: 6,
      desc: 'Pucca roadside drainage channel with PCC bedding, 230mm brick masonry side walls, neat cement plaster lining, and precast removable RCC cover slabs.',
      parameters: ['Gutter Length (m)', 'Clear Width (m)', 'Clear Depth (m)', 'Slab Thickness (m)'],
      mappedItems: [
        'Item 21.01: Excavation for drainage trench in all classes of soil & soft rock',
        'Item 24.03: PCC M-10 Bedding concrete base 100mm',
        'Item 27.05: 230mm First class brick masonry in cement mortar 1:4',
        'Item 32.14: Neat cement rendering 20mm with waterproof compound',
        'Item 25.11: Precast RCC M-20 perforated cover slabs with handles',
      ],
    },
    {
      code: 'CD-01',
      name: 'Hume Pipe Culvert (NP-2 / NP-3 Cross Drainage)',
      marathi: 'ह्युम पाईप मोरी बांधकाम (एन.पी.-२ / एन.पी.-३)',
      category: 'Cross Drainage Works',
      budget: '₹1.8 L – ₹4.5 L',
      duration: '15 to 20 Days',
      itemsCount: 5,
      desc: 'Single or multi-barrel RCC Hume pipe culvert with PCC bedding cradle, UCR masonry headwalls, wingwalls, and concrete coping.',
      parameters: ['Pipe Diameter (mm)', 'Number of Barrels', 'Culvert Width (m)', 'Headwall Height (m)'],
      mappedItems: [
        'Item 21.04: Stream bed excavation in boulder & rock strata',
        'Item 24.05: Bedding cradle concrete M-15 for pipe laying',
        'Item 36.12: Providing & laying NP-3 RCC Spun pipe with collar joints',
        'Item 27.20: Uncoursed Rubble (UCR) stone masonry headwalls & wingwalls',
        'Item 25.11: M-20 Concrete coping & parapet capping',
      ],
    },
    {
      code: 'BLD-01',
      name: 'Samaj Mandir / Community Hall Building',
      marathi: 'समाज मंदिर / सभागृह इमारत बांधकाम (आर.सी.सी. फ्रेम इमारत)',
      category: 'Public Buildings',
      budget: '₹12.0 L – ₹25.0 L',
      duration: '60 to 90 Days',
      itemsCount: 10,
      desc: 'Single-storey public building with RCC framed structure, footings, plinth beam, columns, slab, 230mm brick masonry, plaster, vitrified tiles, painting, and aluminum windows.',
      parameters: ['Plinth Area (Sq.M)', 'Building Height (m)', 'Number of Columns', 'Roof Span (m)'],
      mappedItems: [
        'Item 21.02: Column pit excavation in hard soil & murum',
        'Item 25.11: RCC M-20 in isolated footings, plinth beams, columns, and roof slab',
        'Item 26.33: TMT Fe-500 rebar reinforcement detailing',
        'Item 27.05: 230mm & 115mm Burnt brick masonry partitions',
        'Item 32.08: Internal & external cement plastering with neeru finish',
        'Item 34.12: Vitrified flooring tiles & glazed ceramic skirting',
      ],
    },
    {
      code: 'PV-01',
      name: 'Interlocking Paver Block Pavement & Footpath',
      marathi: 'इंटरब्लॉकिंग पेव्हर ब्लॉक रस्ता / पदपथ (८० मिमी एम-३०)',
      category: 'Urban Footpaths',
      budget: '₹3.0 L – ₹9.0 L',
      duration: '10 to 15 Days',
      itemsCount: 4,
      desc: 'Heavy-duty precast interlocking concrete paver blocks with GSB base, bedding sand layer, and precast PCC kerb stone edging.',
      parameters: ['Area (Sq.M)', 'Block Thickness (mm)', 'Kerb Length (m)', 'Sand Bedding (mm)'],
      mappedItems: [
        'Item 1.05: Subgrade dressing and mechanical roller compaction',
        'Item 14.02: GSB Granular sub-base layer 100mm',
        'Item 15.08: Fine sand bedding cushion 50mm compacted',
        'Item 35.18: 80mm thick M-30 grade precast interlocking paver blocks with vibratory plate compactor',
      ],
    },
    {
      code: 'BT-01',
      name: 'Asphalt Road Patchwork & Resurfacing',
      marathi: 'डांबरी रस्ता दुरुस्ती व नूतनीकरण (२० मिमी प्रेमिक्स कारपेट)',
      category: 'Road Maintenance',
      budget: '₹2.8 L – ₹8.5 L',
      duration: '10 to 15 Days',
      itemsCount: 5,
      desc: 'Flexible pavement resurfacing with surface cleaning, WBM profile correction, tack coat with VG-30 bitumen, 20mm premix carpet, and liquid seal coat.',
      parameters: ['Length (Km)', 'Carriageway Width (m)', 'Patch Area (Sq.M)', 'Bitumen Grade'],
      mappedItems: [
        'Item 16.02: Mechanical road surface sweeping & dust removal',
        'Item 17.04: Providing and applying Tack Coat with paving bitumen VG-30',
        'Item 18.06: 20mm thick Premix Carpet (PMC) with crushed aggregate',
        'Item 18.15: Providing and applying Type-A liquid seal coat with sand blinding',
      ],
    },
  ];

  const current = templates[activeTemplateIndex];

  return (
    <section id="templates" className="py-16 sm:py-24 bg-gradient-to-b from-white via-[#FBFFEB]/30 to-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-lime-50 text-[#15803D] text-xs font-bold uppercase tracking-wider mb-3 border border-[#81C303]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#15803D]" />
            <span>Pre-Engineered Civil Archetypes</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Stop Re-Inventing Routine Estimates. Start with Smart Templates.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#64748B]">
            Instead of manually picking 15 separate SSR items and typing repetitive formulas, select a construction template, enter your site dimensions, and let KardeCalc generate the entire estimate.
          </p>
        </div>

        {/* 6-Step Visual Workflow Pill Road */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs mb-12 max-w-5xl mx-auto">
          <div className="text-xs font-bold uppercase text-[#64748B] tracking-wider mb-3 text-center sm:text-left">
            The Smart Template Instant Generation Pipeline:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
            <div className="bg-lime-50 text-slate-900 border border-[#81C303]/50 p-2.5 rounded-xl font-bold flex flex-col items-center justify-center">
              <span className="text-[10px] text-[#15803D] font-black">STEP 1</span>
              <span>Select Archetype</span>
            </div>
            <div className="bg-slate-50 text-slate-700 p-2.5 rounded-xl font-bold flex flex-col items-center justify-center border border-slate-200">
              <span className="text-[10px] text-slate-500">STEP 2</span>
              <span>Site Dimensions</span>
            </div>
            <div className="bg-slate-50 text-slate-700 p-2.5 rounded-xl font-bold flex flex-col items-center justify-center border border-slate-200">
              <span className="text-[10px] text-slate-500">STEP 3</span>
              <span>Auto SSR Mapping</span>
            </div>
            <div className="bg-slate-50 text-slate-700 p-2.5 rounded-xl font-bold flex flex-col items-center justify-center border border-slate-200">
              <span className="text-[10px] text-slate-500">STEP 4</span>
              <span>Live L×B×D Math</span>
            </div>
            <div className="bg-slate-50 text-slate-700 p-2.5 rounded-xl font-bold flex flex-col items-center justify-center border border-slate-200">
              <span className="text-[10px] text-slate-500">STEP 5</span>
              <span>Review Abstract</span>
            </div>
            <div className="bg-[#81C303] text-black p-2.5 rounded-xl font-extrabold flex flex-col items-center justify-center shadow-xs">
              <span className="text-[10px] text-slate-900">STEP 6</span>
              <span>Ready Estimate</span>
            </div>
          </div>
        </div>

        {/* Template Showcase Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Template Selector List */}
          <div className="lg:col-span-5 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block mb-2">
              Select Pre-Engineered Template:
            </span>
            {templates.map((tpl, idx) => (
              <button
                key={tpl.code}
                onClick={() => setActiveTemplateIndex(idx)}
                className={`w-full p-3.5 rounded-xl text-left border transition-all flex items-center justify-between group ${
                  activeTemplateIndex === idx
                    ? 'bg-white text-slate-900 border-2 border-[#81C303] shadow-sm scale-101 font-bold'
                    : 'bg-white text-[#111827] border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-0.5 truncate pr-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        activeTemplateIndex === idx
                          ? 'bg-[#81C303] text-black'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {tpl.code}
                    </span>
                    <span className="text-xs font-bold truncate">{tpl.name}</span>
                  </div>
                  <p
                    className={`text-[11px] truncate font-devanagari ${
                      activeTemplateIndex === idx ? 'text-slate-600' : 'text-[#64748B]'
                    }`}
                  >
                    {tpl.marathi}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-semibold shrink-0 px-2 py-0.5 rounded ${
                    activeTemplateIndex === idx
                      ? 'bg-lime-100 text-[#15803D]'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tpl.itemsCount} SSR Items
                </span>
              </button>
            ))}
          </div>

          {/* Template Inspection Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 bg-lime-50 border border-[#81C303]/40 px-2.5 py-1 rounded">
                  {current.code} • {current.category}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-2">
                  {current.name}
                </h3>
                <p className="text-xs font-devanagari text-[#64748B] mt-0.5">
                  {current.marathi}
                </p>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <div className="bg-lime-50/60 px-3 py-1.5 rounded-lg border border-[#81C303]/40">
                  <span className="text-[10px] text-slate-500 block">Typical Cost</span>
                  <span className="font-bold text-slate-900">{current.budget}</span>
                </div>
                <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Execution Time</span>
                  <span className="font-bold text-slate-900">{current.duration}</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-5">
              {current.desc}
            </p>

            {/* Configurable Parameters */}
            <div className="mb-5 bg-[#F8FAFC] p-3.5 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-900 block mb-2 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#15803D]" />
                <span>Configurable Site Parameters (Automatically Calculated):</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {current.parameters.map((param, pIdx) => (
                  <div
                    key={pIdx}
                    className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-center"
                  >
                    <span className="text-[11px] font-semibold text-[#111827] block truncate">
                      {param}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pre-Mapped SSR Items List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 block">
                Pre-Mapped SSR 2024-25 Items Included in this Template:
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {current.mappedItems.map((item, mIdx) => (
                  <div
                    key={mIdx}
                    className="flex items-start space-x-2 text-xs text-[#111827] bg-slate-50 p-2 rounded-lg border border-slate-100"
                  >
                    <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-[#64748B]">
                All items, dimensions, and quantities are fully editable in your workspace.
              </span>
              <button
                onClick={onOpenDemoModal}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#81C303] hover:bg-[#72ad02] text-black text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-sm border border-[#72ad02]"
              >
                <span>Try Template in 3-Day Demo</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
