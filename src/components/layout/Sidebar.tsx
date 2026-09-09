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
} from 'lucide-react';

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
    { id: 'dossier', label: '15. Printable Dossier (PDF)', icon: <Printer className="w-4 h-4 text-[#F4762A]" />, badge: 'A4 Dossier' },
  ];

  return (
    <aside className="w-64 bg-[#071426] text-white flex flex-col shrink-0 h-screen border-r border-[#14335C] select-none no-print">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#14335C] bg-[#0B1F3A] flex items-center space-x-3">
        <div className="w-10 h-10 rounded bg-[#F4762A] flex items-center justify-center text-white shadow-md font-bold text-lg">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-wide text-white uppercase leading-tight">PWD Mate</h1>
          <p className="text-[11px] text-[#FDEBDD] font-medium tracking-wider uppercase">Estimate & TS Pro MH</p>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {/* My Estimates Button CTA */}
        <div className="px-1 pb-1">
          <button
            onClick={() => setActiveTab('myEstimates')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
              activeTab === 'myEstimates'
                ? 'bg-[#F4762A] text-white shadow-md ring-2 ring-[#F4762A]/40'
                : 'bg-[#0B1F3A] hover:bg-[#14335C] text-slate-200 border border-slate-700'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <FolderArchive className="w-4 h-4 text-amber-400" />
              <span>My Saved Estimates</span>
            </div>
            <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-full font-mono text-white">
              {savedEstimates.length}
            </span>
          </button>
        </div>

        {/* Core Workspace */}
        <div>
          <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Estimate Workspace
          </div>
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#14335C] text-white shadow-sm border-l-4 border-[#F4762A] font-semibold'
                      : 'text-slate-300 hover:bg-[#0B1F3A] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className={isActive ? 'text-[#F4762A]' : 'text-slate-400'}>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        isActive ? 'bg-[#F4762A] text-white' : 'bg-slate-800 text-slate-400'
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
          <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Statutory & Admin
          </div>
          <div className="space-y-0.5">
            {toolItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#14335C] text-white shadow-sm border-l-4 border-[#F4762A] font-semibold'
                      : 'text-slate-300 hover:bg-[#0B1F3A] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className={isActive ? 'text-[#F4762A]' : 'text-slate-400'}>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        isActive ? 'bg-[#F4762A] text-white' : 'bg-amber-950/80 text-[#F4762A] border border-[#F4762A]/40'
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
      <div className="p-3 bg-[#0B1F3A] border-t border-[#14335C] text-[11px]">
        <div className="flex items-center justify-between text-slate-300 mb-1">
          <span className="font-semibold text-white truncate">{facesheet.division}</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>{facesheet.circle}</span>
          <span className="bg-emerald-950 text-emerald-300 px-1 rounded font-mono">ONLINE</span>
        </div>
      </div>
    </aside>
  );
};
