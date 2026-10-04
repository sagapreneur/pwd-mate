import React, { useState } from 'react';
import { Eye, ExternalLink, Sparkles, Layers, Search, FileText, CheckCircle2, ChevronRight, X } from 'lucide-react';

interface ScreenshotsGalleryProps {
  onOpenDemoModal: () => void;
}

export const ScreenshotsGallery: React.FC<ScreenshotsGalleryProps> = ({ onOpenDemoModal }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const screens = [
    {
      id: 'templates',
      title: 'Smart Estimate Templates',
      tag: 'Archetype Configurator',
      desc: 'Library of pre-engineered civil construction templates (Compound Wall, CC Road, Drainage Gutter, Hume Pipe Culvert, Community Hall) with automatic SSR item mapping.',
      imgSrc: '/screenshots/templates-preview.png',
      caption: 'Pre-Engineered Civil Archetypes with estimated budget, execution timeline, and one-click configuration.',
    },
    {
      id: 'general-abstract',
      title: 'General Abstract (Recapitulation Sheet)',
      tag: 'Sanction Recapitulation',
      desc: 'Consolidated statutory summary sheet pulling direct construction costs (Schedule A), mineral royalty (Schedule B), QC testing (Schedule C), GST 18%, and contingencies.',
      imgSrc: '/screenshots/general-abstract-preview.png',
      caption: 'Complete PWD Recapitulation Sheet with automatic statutory rollups and digital sanction authority blocks.',
    },
    {
      id: 'ssr-catalog',
      title: 'SSR Master Item Catalog (2024-25)',
      tag: '2,380+ Items • 112 Chapters',
      desc: 'Comprehensive Maharashtra PWD Schedule of Rates with fuzzy item search, quick chapter chips, live quarry lead calculations, and take-off buttons.',
      imgSrc: '/screenshots/catalog-preview.png',
      caption: 'Fuzzy keyword search with live lead additions and direct dimensional take-off entry.',
    },
    {
      id: 'printable-dossier',
      title: '18-Part Printable Technical Sanction Dossier',
      tag: 'Audit-Ready Binder',
      desc: 'Official monochromatic A4 format with Government of Maharashtra emblem, index, Marathi note sheets, facesheet, and complete schedule binder.',
      imgSrc: '/screenshots/printable-dossier-preview.png',
      caption: 'Print-ready PDF & multi-sheet Excel export formatted strictly to Maharashtra PWD technical sanction guidelines.',
    },
    {
      id: 'facesheet',
      title: 'Cascading Territorial Jurisdiction & Scope',
      tag: 'Administrative Setup',
      desc: 'Project facesheet with all 6 Maharashtra PWD administrative regions, 32+ circles, 120+ divisions, budget heads, and administrative approval metadata.',
      imgSrc: '/screenshots/facesheet-preview.png',
      caption: 'Dynamic cascading jurisdiction (Region ➔ Circle ➔ Division ➔ Sub-Division) with auto-linked authority titles.',
    },
    {
      id: 'stamps',
      title: 'Digital Stamp & Signature Authority Manager',
      tag: 'Authorization Blocks',
      desc: 'Configure official engineering designations, signatory authority names, and per-schedule visibility toggles for Sectional, Sub-Divisional, and Executive Engineers.',
      imgSrc: '/screenshots/stamps-preview.png',
      caption: 'Customizable official signature blocks automatically stamped onto Cover, Abstract, and Recap sheets.',
    },
  ];

  const current = screens[activeTab];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FBFFEB] text-[#02013F] text-xs font-bold uppercase tracking-wider mb-3 border border-[#81C303]/50">
            <Sparkles className="w-3.5 h-3.5 text-[#81C303]" />
            <span>Real Application Interface</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#02013F] tracking-tight">
            See the Actual Software in Action
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#64748B]">
            Every screen is engineered with clinical precision, clear typography, and official Maharashtra PWD accounting codes.
          </p>
        </div>

        {/* Screen Selection Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {screens.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === idx
                  ? 'bg-[#02013F] text-white shadow-md scale-102'
                  : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#02013F] border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#81C303]" />
              <span>{s.title}</span>
            </button>
          ))}
        </div>

        {/* Featured Screenshot in Browser Frame Mockup */}
        <div className="bg-[#02013F] p-3 sm:p-5 rounded-3xl shadow-2xl border border-slate-800 max-w-6xl mx-auto">
          {/* Header bar */}
          <div className="flex items-center justify-between pb-3 px-2 border-b border-white/10 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              <span className="ml-2 font-mono text-[11px] text-slate-300">
                kardecalc.mahapwd.gov.in • {current.title}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-white/10 text-[#81C303] text-[10px] font-bold font-mono">
                {current.tag}
              </span>
              <button
                onClick={() => setFullscreenImage(current.imgSrc)}
                className="text-slate-400 hover:text-white transition-colors p-1"
                title="Expand full screen"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Screenshot Display */}
          <div
            onClick={() => setFullscreenImage(current.imgSrc)}
            className="mt-3 relative rounded-xl overflow-hidden cursor-zoom-in bg-slate-900 group"
          >
            <img
              src={current.imgSrc}
              alt={current.title}
              className="w-full h-auto max-h-[580px] object-cover object-top transition-transform duration-500 group-hover:scale-[1.01]"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-xs">
                <Eye className="w-3.5 h-3.5" /> Click to enlarge
              </span>
            </div>
          </div>

          {/* Description footer */}
          <div className="mt-4 px-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{current.title}</span>
                <span className="text-[11px] text-[#81C303] font-normal">({current.caption})</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 max-w-3xl">
                {current.desc}
              </p>
            </div>
            <button
              onClick={onOpenDemoModal}
              className="px-4 py-2 rounded-xl bg-[#81C303] hover:bg-[#72ad02] text-black text-xs font-bold uppercase tracking-wider shrink-0 transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <span>Test This in Demo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Lightbox Modal */}
      {fullscreenImage && (
        <div
          onClick={() => setFullscreenImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-7xl max-h-[90vh] overflow-auto rounded-xl">
            <button
              onClick={() => setFullscreenImage(null)}
              className="fixed top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white text-black transition-colors"
            >
              <X className="w-6 h-6 text-white hover:text-black" />
            </button>
            <img
              src={fullscreenImage}
              alt="Fullscreen Preview"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};
