import React from 'react';
import { useEstimatorStore } from '../../store/useEstimatorStore';
import { ActiveTab } from '../../types/estimator';
import {
  FileText,
  Search,
  Ruler,
  Truck,
  Calculator,
  ListOrdered,
  Layers,
  Coins,
  FlaskConical,
  Grid,
  Landmark,
  Stamp,
  Languages,
  Settings,
  Building2,
  FolderArchive,
  CheckCircle2,
  Printer,
  Sparkles,
} from 'lucide-react';
import { PWD_SMART_TEMPLATES } from '../../data/templates';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, facesheet, items, savedEstimates } = useEstimatorStore();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'facesheet', label: '01. Cover / Facesheet', icon: <FileText className="w-4 h-4" /> },
    { id: 'catalog', label: '02. SSR Item Catalog', icon: <Search className="w-4 h-4" />, badge: 'SSR 22-23' },
    { id: 'measurements', label: '03. Measurement Ledger', icon: <Ruler className="w-4 h-4" />, badge: items.length > 0 ? `${items.length} Items` : undefined },
    { id: 'lead', label: '04. Quarry Lead Chart', icon: <Truck className="w-4 h-4" /> },
    { id: 'rateAnalysis', label: '05. Dynamic Rate Analysis', icon: <Calculator className="w-4 h-4" /> },
    { id: 'abstract', label: '06. Abstract of Cost', icon: <ListOrdered className="w-4 h-4" /> },
    { id: 'consumption', label: '07. Material Breakdown', icon: <Layers className="w-4 h-4" /> },
    { id: 'royalty', label: '08. Statutory Royalty', icon: <Coins className="w-4 h-4" /> },
    { id: 'testing', label: '09. Quality Testing (MTF)', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'steelBbs', label: '10. Steel Rebar (BBS)', icon: <Grid className="w-4 h-4" /> },
    { id: 'generalAbstract', label: '11. General Abstract', icon: <Landmark className="w-4 h-4" /> },
  ];

  const toolItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'stamps', label: '12. Digital Stamp Manager', icon: <Stamp className="w-4 h-4" /> },
    { id: 'marathiDocs', label: '13. Marathi Statutory Docs', icon: <Languages className="w-4 h-4" /> },
    { id: 'admin', label: '14. Admin & Test Benchmarks', icon: <Settings className="w-4 h-4" /> },
    { id: 'dossier', label: '15. Printable Dossier (PDF)', icon: <Printer className="w-4 h-4 text-[#81C303]" />, badge: 'A4 Dossier' },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white text-[#111827] flex flex-col border-r border-[#E5E7EB] select-none no-print z-30 shadow-xs">
      {/* Brand Header with Larger Logo */}
      <div className="p-4 border-b border-[#E5E7EB] bg-white flex items-center justify-center shrink-0">
        <img
          src="/kardecalc-logo.png"
          alt="KardeCalc"
          className="h-11 w-auto max-w-[210px] object-contain drop-shadow-xs"
        />
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {/* Quick Launch & Library */}
        <div className="px-1 pb-1 space-y-1.5">
          <button
            onClick={() => setActiveTab('templates')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all ${
              activeTab === 'templates'
                ? 'bg-[#FBFFEB] text-[#02013F] shadow-xs border border-[#81C303]/40 border-l-4 border-l-[#81C303] font-bold'
                : 'bg-[#F8FAFC] hover:bg-[#FBFFEB] text-[#64748B] hover:text-[#02013F] border border-[#E5E7EB] font-medium'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Sparkles className={`w-4 h-4 ${activeTab === 'templates' ? 'text-[#81C303]' : 'text-slate-400'}`} />
              <span>Smart Templates</span>
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                activeTab === 'templates'
                  ? 'bg-[#02013F] text-white'
                  : 'bg-slate-200 text-[#02013F]'
              }`}
            >
              {PWD_SMART_TEMPLATES.length} Archetypes
            </span>
          </button>

          {/* My Estimates Button CTA */}
          <button
            onClick={() => setActiveTab('myEstimates')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all ${
              activeTab === 'myEstimates'
                ? 'bg-[#FBFFEB] text-[#02013F] shadow-xs border border-[#81C303]/40 border-l-4 border-l-[#81C303] font-bold'
                : 'bg-[#F8FAFC] hover:bg-[#FBFFEB] text-[#64748B] hover:text-[#02013F] border border-[#E5E7EB] font-medium'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <FolderArchive className={`w-4 h-4 ${activeTab === 'myEstimates' ? 'text-[#81C303]' : 'text-slate-400'}`} />
              <span>My Saved Estimates</span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === 'myEstimates'
                  ? 'bg-[#02013F] text-white'
                  : 'bg-slate-200 text-[#02013F]'
              }`}
            >
              {savedEstimates.length}
            </span>
          </button>
        </div>

        {/* Core Workspace */}
        <div>
          <div className="px-3 pb-1 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
            Estimate Workspace
          </div>
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#FBFFEB] text-[#02013F] shadow-xs border-l-4 border-[#81C303] font-semibold'
                      : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#02013F]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className={isActive ? 'text-[#81C303]' : 'text-[#94A3B8]'}>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        isActive
                          ? 'bg-[#81C303] text-[#02013F] font-bold'
                          : 'bg-slate-100 text-[#64748B] border border-[#E5E7EB]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Governance & Compliance */}
        <div>
          <div className="px-3 pb-1 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
            Statutory & Admin
          </div>
          <div className="space-y-0.5">
            {toolItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#FBFFEB] text-[#02013F] shadow-xs border-l-4 border-[#81C303] font-semibold'
                      : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#02013F]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className={isActive ? 'text-[#81C303]' : 'text-[#94A3B8]'}>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        isActive
                          ? 'bg-[#81C303] text-[#02013F] font-bold'
                          : 'bg-slate-100 text-[#64748B] border border-[#E5E7EB]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Division Footer Badge */}
      <div className="p-3 bg-[#F8FAFC] border-t border-[#E5E7EB] text-[11px] shrink-0">
        <div className="flex items-center justify-between text-[#111827]">
          <span className="font-semibold text-[#02013F] truncate">{facesheet.division}</span>
          <div className="flex items-center space-x-1 shrink-0 ml-1">
            <span className="bg-[#FBFFEB] text-[#81C303] border border-[#81C303]/40 px-1.5 py-0.5 rounded font-mono text-[9px] font-bold">ONLINE</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#81C303]" />
          </div>
        </div>
      </div>
    </aside>
  );
};
