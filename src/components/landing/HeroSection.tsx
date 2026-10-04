import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, FileText, Layers, Search, Calculator, ExternalLink, Stamp } from 'lucide-react';

interface HeroSectionProps {
  onOpenDemoModal: () => void;
  onLaunchDemo?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenDemoModal, onLaunchDemo }) => {
  const [activePreviewTab, setActivePreviewTab] = useState<'dossier' | 'templates' | 'catalog' | 'abstract' | 'stamps'>('abstract');

  const previews = {
    abstract: {
      title: 'General Abstract (Recapitulation Sheet)',
      subtitle: 'Statutory Recapitulation with Schedule A works, Schedule B royalty, Schedule C testing, GST 18%, and contingencies.',
      imgSrc: '/screenshots/general-abstract-preview.png',
      badge: 'Schedule A + B + C Auto-Rollup',
    },
    templates: {
      title: 'Smart Estimate Templates Archetypes',
      subtitle: 'Start with pre-engineered construction templates (Compound Wall, CC Road, Culvert, Gutter, Building) with auto SSR mapping.',
      imgSrc: '/screenshots/templates-preview.png',
      badge: '7 Real Construction Archetypes',
    },
    catalog: {
      title: 'Maharashtra PWD SSR Master Catalog (2024-25)',
      subtitle: '2,380+ items across 112 chapters with instant search, live quarry lead additions, and area surcharge calculation.',
      imgSrc: '/screenshots/catalog-preview.png',
      badge: 'Fuzzy Search & Live Lead Rates',
    },
    dossier: {
      title: '18-Part Printable Technical Sanction Dossier',
      subtitle: 'Monochromatic, audit-compliant A4 binder with Maharashtra emblem, index, Marathi note sheets, and official signature seals.',
      imgSrc: '/screenshots/printable-dossier-preview.png',
      badge: 'Audit-Ready TS Dossier',
    },
    stamps: {
      title: 'Digital Engineering Stamp & Authority Manager',
      subtitle: 'Apply official signature blocks and departmental seals for Sectional, Sub-Divisional, and Executive Engineers across Schedules.',
      imgSrc: '/screenshots/stamps-preview.png',
      badge: 'Official Signature Authority',
    },
  };

  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden bg-gradient-to-b from-[#FBFFEB]/50 via-white to-[#F8FAFC]">
      {/* Decorative Grid & Radial Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:20px_20px] opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#81C303]/15 to-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Department Accreditation Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] shadow-xs text-xs font-semibold text-slate-800">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span className="text-[#64748B]">Maharashtra PWD •</span>
            <span>Standard Schedule of Rates (SSR 2024-25) Aligned</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#16A34A]" />
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            The Purpose-Built Estimation Platform for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-800 to-emerald-700">
              Maharashtra Civil Engineers
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate spreadsheet errors and hours of manual rate lookups. KardeCalc automates cascading territorial jurisdiction, Statement C1 quarry leads, statutory royalty, and 18-part Technical Sanction dossiers strictly aligned with Maharashtra PWD standards.
          </p>

          {/* Primary CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            <button
              onClick={onOpenDemoModal}
              id="hero-request-demo-btn"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#81C303] hover:bg-[#72ad02] text-black text-sm font-black uppercase tracking-wider shadow-md hover:shadow-xl transition-all hover:scale-102 active:scale-98 flex items-center justify-center space-x-2 border border-[#72ad02]"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Request 3-Day Free Demo</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>

            {onLaunchDemo ? (
              <button
                onClick={onLaunchDemo}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white border border-[#E5E7EB] hover:border-slate-800 text-slate-800 text-sm font-bold shadow-xs hover:shadow transition-all flex items-center justify-center space-x-2"
              >
                <span>Launch Live Demo Workspace</span>
                <ExternalLink className="w-4 h-4 text-[#64748B]" />
              </button>
            ) : (
              <a
                href="#features"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white border border-[#E5E7EB] hover:border-slate-800 text-slate-800 text-sm font-bold shadow-xs hover:shadow transition-all flex items-center justify-center space-x-2"
              >
                <span>Explore Core Features</span>
                <ArrowRight className="w-4 h-4 text-[#64748B]" />
              </a>
            )}
          </div>

          {/* Micro Reassurance */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              Full Access 72-Hour Evaluation
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              No Credit Card Required
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              Pre-Loaded with SSR 2024-25
            </span>
          </div>

          {/* Key Trust Signals */}
          <div className="mt-8 pt-6 border-t border-slate-200/60 max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#111827]">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>2,380+ SSR Items</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#111827]">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>6 Regions & 120+ Divisions</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#111827]">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>Statement C1 Lead Auto</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#111827]">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>18-Part TS Print Binder</span>
            </div>
          </div>
        </div>

        {/* Interactive App Preview Showcase Container */}
        <div className="mt-12 sm:mt-16 max-w-6xl mx-auto">
          {/* Tab Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <button
              onClick={() => setActivePreviewTab('abstract')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs transition-all ${
                activePreviewTab === 'abstract'
                  ? 'bg-white text-slate-900 border-2 border-[#81C303] shadow-sm font-extrabold'
                  : 'bg-white/90 text-[#64748B] hover:text-slate-900 border border-slate-200 hover:bg-slate-50 font-semibold'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-[#15803D]" />
              <span>General Abstract</span>
            </button>

            <button
              onClick={() => setActivePreviewTab('templates')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs transition-all ${
                activePreviewTab === 'templates'
                  ? 'bg-white text-slate-900 border-2 border-[#81C303] shadow-sm font-extrabold'
                  : 'bg-white/90 text-[#64748B] hover:text-slate-900 border border-slate-200 hover:bg-slate-50 font-semibold'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#15803D]" />
              <span>Smart Templates</span>
            </button>

            <button
              onClick={() => setActivePreviewTab('catalog')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs transition-all ${
                activePreviewTab === 'catalog'
                  ? 'bg-white text-slate-900 border-2 border-[#81C303] shadow-sm font-extrabold'
                  : 'bg-white/90 text-[#64748B] hover:text-slate-900 border border-slate-200 hover:bg-slate-50 font-semibold'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-[#15803D]" />
              <span>SSR Item Catalog</span>
            </button>

            <button
              onClick={() => setActivePreviewTab('dossier')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs transition-all ${
                activePreviewTab === 'dossier'
                  ? 'bg-white text-slate-900 border-2 border-[#81C303] shadow-sm font-extrabold'
                  : 'bg-white/90 text-[#64748B] hover:text-slate-900 border border-slate-200 hover:bg-slate-50 font-semibold'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#15803D]" />
              <span>18-Part TS Dossier</span>
            </button>

            <button
              onClick={() => setActivePreviewTab('stamps')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs transition-all ${
                activePreviewTab === 'stamps'
                  ? 'bg-white text-slate-900 border-2 border-[#81C303] shadow-sm font-extrabold'
                  : 'bg-white/90 text-[#64748B] hover:text-slate-900 border border-slate-200 hover:bg-slate-50 font-semibold'
              }`}
            >
              <Stamp className="w-3.5 h-3.5 text-[#15803D]" />
              <span>Digital Stamps</span>
            </button>
          </div>

          {/* Browser Window Frame Mockup */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-2 sm:p-3 overflow-hidden ring-1 ring-slate-900/5">
            {/* Window Controls & Address Bar */}
            <div className="flex items-center justify-between pb-2.5 px-2 text-xs text-slate-600 border-b border-slate-200">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                <span className="ml-3 text-[11px] font-mono text-slate-600 hidden sm:inline">
                  KardeCalc Live Workspace • Maharashtra PWD
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-md bg-slate-50 text-[11px] font-mono text-slate-700 border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-[#81C303]" />
                <span>kardecalc.mahapwd.gov.in/workspace/{activePreviewTab}</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-lime-50 text-[#15803D] font-bold border border-[#81C303]/40">
                  {previews[activePreviewTab].badge}
                </span>
              </div>
            </div>

            {/* Real Screenshot Preview Container */}
            <div className="relative mt-2 bg-slate-50 rounded-xl overflow-hidden shadow-inner group border border-slate-200">
              <img
                src={previews[activePreviewTab].imgSrc}
                alt={previews[activePreviewTab].title}
                className="w-full h-auto max-h-[560px] object-cover object-top transition-transform duration-500 group-hover:scale-[1.01]"
              />

              {/* Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-900">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
                    <span>{previews[activePreviewTab].title}</span>
                  </h3>
                  <p className="text-xs text-slate-600 max-w-2xl mt-0.5">
                    {previews[activePreviewTab].subtitle}
                  </p>
                </div>
                <button
                  onClick={onOpenDemoModal}
                  className="self-start sm:self-auto px-4 py-2 rounded-lg bg-[#81C303] hover:bg-[#72ad02] text-black text-xs font-black shrink-0 transition-all flex items-center space-x-1.5 shadow-sm"
                >
                  <span>Test in 3-Day Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
