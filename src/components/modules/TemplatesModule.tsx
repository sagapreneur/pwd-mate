import React, { useState, useMemo } from 'react';
import { useEstimatorStore } from '../../store/useEstimatorStore';
import { PWD_SMART_TEMPLATES } from '../../data/templates';
import { SmartTemplate, TemplateCategory } from '../../types/templates';
import { generateEstimateFromTemplate } from '../../engine/templateEngine';
import {
  Wand2,
  Sparkles,
  Search,
  Building,
  Milestone,
  Waves,
  CircleDot,
  Shield,
  LayoutGrid,
  Flame,
  Castle,
  Warehouse,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
  Info,
  AlertTriangle,
  RotateCcw,
  BookmarkPlus,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  Layers,
  FileSpreadsheet,
  Check,
  Zap,
} from 'lucide-react';

const STORAGE_KEY_CUSTOM_TEMPLATES = 'kardecalc_custom_templates';

function loadCustomTemplates(): SmartTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_TEMPLATES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to load custom templates from localStorage:', err);
  }
  return [];
}

function saveCustomTemplatesToStorage(templates: SmartTemplate[]) {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_TEMPLATES, JSON.stringify(templates));
  } catch (err) {
    console.error('Failed to save custom templates to localStorage:', err);
  }
}

export const TemplatesModule: React.FC = () => {
  const {
    facesheet: currentFacesheet,
    leadSettings,
    setActiveTab,
    recalculateAll,
  } = useEstimatorStore();

  // State
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all' | 'custom'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customTemplates, setCustomTemplates] = useState<SmartTemplate[]>(loadCustomTemplates);
  const [activeTemplate, setActiveTemplate] = useState<SmartTemplate | null>(null);
  const [parameterValues, setParameterValues] = useState<Record<string, any>>({});
  const [workNameOverride, setWorkNameOverride] = useState('');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // All available templates (builtin + custom)
  const allTemplates = useMemo(() => {
    return [...PWD_SMART_TEMPLATES, ...customTemplates];
  }, [customTemplates]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((tpl) => {
      // Category filter
      if (selectedCategory === 'custom') {
        if (!tpl.isCustom) return false;
      } else if (selectedCategory !== 'all') {
        if (tpl.category !== selectedCategory) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = tpl.title.toLowerCase().includes(q);
        const matchMarathi = tpl.titleMarathi.toLowerCase().includes(q);
        const matchCode = tpl.code.toLowerCase().includes(q);
        const matchDesc = tpl.shortDescription.toLowerCase().includes(q);
        if (!matchTitle && !matchMarathi && !matchCode && !matchDesc) return false;
      }

      return true;
    });
  }, [allTemplates, selectedCategory, searchQuery]);

  // Open Template Wizard
  const handleSelectTemplate = (tpl: SmartTemplate) => {
    setActiveTemplate(tpl);
    const defaults: Record<string, any> = {};
    for (const p of tpl.parameters) {
      defaults[p.id] = p.defaultValue;
    }
    setParameterValues(defaults);
    setWorkNameOverride(tpl.defaultFacesheet.nameOfWork || `${tpl.title} at Proposed Location`);
    setExpandedItemId(null);
  };

  // Close Wizard
  const handleCloseWizard = () => {
    setActiveTemplate(null);
    setParameterValues({});
    setWorkNameOverride('');
    setExpandedItemId(null);
  };

  // Handle parameter input change
  const handleParamChange = (paramId: string, val: any) => {
    setParameterValues((prev) => ({
      ...prev,
      [paramId]: val,
    }));
  };

  // Compute live preview
  const preview = useMemo(() => {
    if (!activeTemplate) return null;
    return generateEstimateFromTemplate(
      activeTemplate,
      { ...parameterValues, nameOfWork: workNameOverride },
      currentFacesheet
    );
  }, [activeTemplate, parameterValues, workNameOverride, currentFacesheet]);

  // Action: Generate and Inject into active estimate
  const handleGenerateEstimate = () => {
    if (!preview || !activeTemplate) return;

    // Use store's zustand setState directly via store methods or by updating state
    useEstimatorStore.setState((state) => ({
      facesheet: {
        ...state.facesheet,
        ...preview.facesheet,
        nameOfWork: workNameOverride || preview.facesheet.nameOfWork,
      },
      items: preview.items,
      bbsElements: [],
      currentEstimateId: 'est-tpl-' + Date.now(),
      activeTab: 'measurements',
    }));

    recalculateAll();

    // Trigger toast notification
    alert(
      `✓ Successfully generated estimate "${workNameOverride || activeTemplate.title}" with ${
        preview.items.length
      } SSR items and detailed measurement sheets!\n\nYou have been redirected to the Measurement Ledger.`
    );
  };

  // Action: Save as Custom Template
  const handleSaveAsCustomTemplate = () => {
    if (!activeTemplate) return;

    const customTitle = prompt(
      'Enter a name for this customized template:',
      `${activeTemplate.title} (Customized)`
    );
    if (!customTitle || !customTitle.trim()) return;

    const customizedTemplate: SmartTemplate = {
      ...activeTemplate,
      id: `custom-tpl-${Date.now()}`,
      code: `${activeTemplate.code}-C`,
      title: customTitle.trim(),
      titleMarathi: `${activeTemplate.titleMarathi} (कस्टमाइज्ड)`,
      isCustom: true,
      badge: 'Custom',
      parameters: activeTemplate.parameters.map((p) => ({
        ...p,
        defaultValue: parameterValues[p.id] !== undefined ? parameterValues[p.id] : p.defaultValue,
      })),
      defaultFacesheet: {
        ...activeTemplate.defaultFacesheet,
        nameOfWork: workNameOverride || activeTemplate.defaultFacesheet.nameOfWork,
      },
      version: '1.0-custom',
    };

    const updated = [customizedTemplate, ...customTemplates];
    setCustomTemplates(updated);
    saveCustomTemplatesToStorage(updated);

    setSaveSuccessMsg(`Template "${customTitle}" saved to your custom library!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Action: Delete custom template
  const handleDeleteCustomTemplate = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this custom template?')) return;
    const updated = customTemplates.filter((t) => t.id !== templateId);
    setCustomTemplates(updated);
    saveCustomTemplatesToStorage(updated);
  };

  // Helper icon renderer
  const renderTemplateIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6' };
    switch (iconName) {
      case 'Shield':
        return <Shield {...props} className="w-6 h-6 text-[#81C303]" />;
      case 'Milestone':
        return <Milestone {...props} className="w-6 h-6 text-blue-600" />;
      case 'Waves':
        return <Waves {...props} className="w-6 h-6 text-cyan-600" />;
      case 'CircleDot':
        return <CircleDot {...props} className="w-6 h-6 text-amber-600" />;
      case 'Building':
        return <Building {...props} className="w-6 h-6 text-purple-600" />;
      case 'LayoutGrid':
        return <LayoutGrid {...props} className="w-6 h-6 text-emerald-600" />;
      case 'Flame':
        return <Flame {...props} className="w-6 h-6 text-rose-600" />;
      case 'Castle':
        return <Castle {...props} className="w-6 h-6 text-indigo-600" />;
      case 'Warehouse':
        return <Warehouse {...props} className="w-6 h-6 text-teal-600" />;
      default:
        return <Wand2 {...props} className="w-6 h-6 text-[#81C303]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-xs border border-[#E5E7EB] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-[#81C303] uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Construction Archetypes</span>
            </span>
            <span className="bg-[#FBFFEB] text-[#02013F] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#81C303]/30">
              SSR 2022-23 Mapped
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#02013F] mt-0.5">
            Smart Estimate Templates Library • स्मार्ट अंदाजपत्रक साचे
          </h2>
          <p className="text-xs text-[#64748B] mt-1 max-w-2xl">
            Select a predefined PWD construction archetype (Compound Wall, CC Road, Drain, Samaj Mandir, Culvert), configure project dimensions, and let KardeCalc automatically generate all applicable SSR items, detailed dimensional measurement sheets, and cost rollups.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setActiveTab('myEstimates')}
            className="px-3 py-2 rounded-lg bg-[#F8FAFC] hover:bg-[#FBFFEB] text-[#02013F] text-xs font-semibold border border-[#E5E7EB] transition-all flex items-center space-x-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#81C303]" />
            <span>My Estimates</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs px-4 py-2.5 rounded-lg flex items-center space-x-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Categories & Search Toolbar */}
      <div className="bg-white rounded-xl shadow-xs border border-[#E5E7EB] p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search templates by work, code or keywords (e.g. Compound wall, CC Road, Drain)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg text-xs font-medium text-[#111827] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#81C303]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="text-xs text-[#64748B] font-medium flex items-center space-x-2">
            <span>
              Showing <strong className="text-[#02013F]">{filteredTemplates.length}</strong> of{' '}
              {allTemplates.length} templates
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#E5E7EB]">
          <span className="text-[10px] uppercase font-bold text-[#64748B] mr-1 flex items-center space-x-1">
            <SlidersHorizontal className="w-3 h-3 text-[#81C303]" />
            <span>Discipline:</span>
          </span>

          {[
            { id: 'all', label: `All Templates (${allTemplates.length})` },
            { id: 'boundary', label: 'Compound & Boundary Walls' },
            { id: 'roads', label: 'Roads & Pavements' },
            { id: 'drainage', label: 'Drains & Culverts' },
            { id: 'buildings', label: 'Buildings & Community Halls' },
            { id: 'amenities', label: 'Public Amenities & Sheds' },
            { id: 'custom', label: `My Custom (${customTemplates.length})` },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`text-[11px] px-3 py-1 rounded-md font-medium transition-all ${
                  isSelected
                    ? 'bg-[#81C303] text-[#02013F] font-bold shadow-xs'
                    : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#FBFFEB] hover:text-[#02013F] border border-[#E5E7EB]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((tpl) => {
          return (
            <div
              key={tpl.id}
              className="bg-white rounded-xl border border-[#E5E7EB] hover:border-[#81C303] hover:shadow-md transition-all flex flex-col justify-between p-5 space-y-4 group"
            >
              <div className="space-y-3">
                {/* Header Badge & Code */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#02013F] text-white">
                      {tpl.code}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FBFFEB] text-[#02013F] border border-[#81C303]/40">
                      {tpl.badge}
                    </span>
                  </div>

                  {tpl.isCustom && (
                    <button
                      onClick={(e) => handleDeleteCustomTemplate(tpl.id, e)}
                      title="Delete Custom Template"
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Title & Description */}
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-lg bg-[#F8FAFC] group-hover:bg-[#FBFFEB] border border-[#E5E7EB] shrink-0 transition-colors">
                    {renderTemplateIcon(tpl.iconName)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#02013F] group-hover:text-[#02013F] transition-colors leading-snug">
                      {tpl.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-[#81C303] mt-0.5">
                      {tpl.titleMarathi}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                  {tpl.shortDescription}
                </p>

                {/* Metrics Badges */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E5E7EB]/60 text-[11px]">
                  <div className="bg-[#F8FAFC] p-2 rounded border border-[#E5E7EB]/60">
                    <span className="text-[10px] text-[#64748B] block">Typical Cost</span>
                    <strong className="text-[#02013F] font-bold">{tpl.typicalCostRange}</strong>
                  </div>
                  <div className="bg-[#F8FAFC] p-2 rounded border border-[#E5E7EB]/60">
                    <span className="text-[10px] text-[#64748B] block">Execution Time</span>
                    <strong className="text-[#02013F] font-bold">{tpl.typicalTimeframe}</strong>
                  </div>
                </div>

                {/* Included Items Count */}
                <div className="text-[11px] text-[#64748B] flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <Layers className="w-3.5 h-3.5 text-[#81C303]" />
                    <span>{tpl.items.length} SSR Work Items Mapped</span>
                  </span>
                  <span className="text-[10px] text-slate-400">v{tpl.version}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSelectTemplate(tpl)}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-[#02013F] hover:bg-[#030252] text-white hover:text-[#81C303] rounded-lg text-xs font-bold transition-all shadow-xs"
              >
                <span>Configure & Generate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* PARAMETRIC CONFIGURATION & PREVIEW MODAL / DRAWER */}
      {activeTemplate && preview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] w-full max-w-5xl my-auto max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E5E7EB] bg-[#F8FAFC] flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-white border border-[#E5E7EB]">
                  {renderTemplateIcon(activeTemplate.iconName)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#02013F] text-white">
                      {activeTemplate.code}
                    </span>
                    <span className="text-xs font-bold text-[#81C303]">
                      {activeTemplate.titleMarathi}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#02013F]">
                    {activeTemplate.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleCloseWizard}
                  className="px-3 py-1.5 text-xs text-[#64748B] hover:text-[#02013F] hover:bg-slate-200 rounded-lg transition-colors font-medium"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Proposed Work Name */}
              <div className="bg-[#FBFFEB] border border-[#81C303]/40 rounded-xl p-4 space-y-2">
                <label className="block text-xs font-bold text-[#02013F]">
                  Name of Proposed Work / काम किंवा योजनेचे नाव
                </label>
                <input
                  type="text"
                  value={workNameOverride}
                  onChange={(e) => setWorkNameOverride(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] focus:ring-2 focus:ring-[#81C303] outline-none"
                  placeholder="Enter specific name of work, village, tahsil, or premise..."
                />
                <span className="text-[10px] text-[#64748B]">
                  This title will be carried forward to your Project Facesheet, General Abstract, and Technical Sanction Dossier.
                </span>
              </div>

              {/* Parametric Dimension Inputs Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#02013F] uppercase tracking-wider flex items-center space-x-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#81C303]" />
                    <span>Project Specific Dimensions & Specifications</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const defaults: Record<string, any> = {};
                      activeTemplate.parameters.forEach((p) => {
                        defaults[p.id] = p.defaultValue;
                      });
                      setParameterValues(defaults);
                    }}
                    className="text-[11px] text-[#64748B] hover:text-[#02013F] flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Defaults</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-[#F8FAFC] p-4 rounded-xl border border-[#E5E7EB]">
                  {activeTemplate.parameters.map((param) => {
                    // Check dependency
                    if (param.dependsOn) {
                      const depVal = parameterValues[param.dependsOn.paramId];
                      if (depVal !== param.dependsOn.value) return null;
                    }

                    const val = parameterValues[param.id] !== undefined ? parameterValues[param.id] : param.defaultValue;

                    return (
                      <div key={param.id} className="bg-white p-3 rounded-lg border border-[#E5E7EB] space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-[#111827] leading-tight">
                            {param.label}
                          </label>
                          {param.unit && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-[#64748B] font-mono font-bold">
                              {param.unit}
                            </span>
                          )}
                        </div>

                        {param.type === 'number' && (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={val}
                              step={param.step || 0.1}
                              min={param.min}
                              max={param.max}
                              onChange={(e) => handleParamChange(param.id, Number(e.target.value))}
                              className="w-full text-xs font-bold p-1.5 rounded border border-[#E5E7EB] bg-[#F8FAFC] focus:bg-white text-[#02013F] outline-none"
                            />
                          </div>
                        )}

                        {param.type === 'select' && param.options && (
                          <select
                            value={val}
                            onChange={(e) => {
                              const selectedOpt = param.options?.find(
                                (o) => String(o.value) === e.target.value
                              );
                              handleParamChange(param.id, selectedOpt ? selectedOpt.value : e.target.value);
                            }}
                            className="w-full text-xs font-semibold p-1.5 rounded border border-[#E5E7EB] bg-[#F8FAFC] focus:bg-white text-[#02013F] outline-none"
                          >
                            {param.options.map((opt) => (
                              <option key={String(opt.value)} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        )}

                        {param.type === 'boolean' && (
                          <label className="flex items-center space-x-2 cursor-pointer pt-1">
                            <input
                              type="checkbox"
                              checked={Boolean(val)}
                              onChange={(e) => handleParamChange(param.id, e.target.checked)}
                              className="w-4 h-4 text-[#81C303] rounded border-slate-300 focus:ring-[#81C303]"
                            />
                            <span className="text-xs font-medium text-[#111827]">
                              {val ? 'Included' : 'Excluded'}
                            </span>
                          </label>
                        )}

                        {param.helpText && (
                          <p className="text-[10px] text-[#64748B] leading-tight pt-0.5">
                            {param.helpText}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cost Summary Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E5E7EB]">
                  <span className="text-[11px] font-semibold text-[#64748B]">Schedule A (Civil Works)</span>
                  <div className="text-lg font-bold text-[#02013F] mt-0.5">
                    ₹{preview.subtotalCivilCost.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-500">{preview.items.length} Work Items</span>
                </div>

                <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E5E7EB]">
                  <span className="text-[11px] font-semibold text-[#64748B]">Statutory Additions</span>
                  <div className="text-sm font-bold text-[#02013F] mt-1">
                    GST 18% + Cont. 2% + Cess 0.5%
                  </div>
                  <span className="text-[10px] text-slate-500">Auto calculated on abstract</span>
                </div>

                <div className="bg-[#FBFFEB] p-3.5 rounded-xl border border-[#81C303]/50">
                  <span className="text-[11px] font-bold text-[#81C303] uppercase">Estimated Grand Total</span>
                  <div className="text-xl font-extrabold text-[#02013F] mt-0.5">
                    ₹{preview.estimatedGrandTotal.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] font-bold text-[#81C303]">
                    ≈ {(preview.estimatedGrandTotal / 100000).toFixed(2)} Lakhs
                  </span>
                </div>
              </div>

              {/* Technical Assumptions & Verification Alerts */}
              {(preview.warnings.length > 0 || preview.assumptions.length > 0) && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Technical Assumptions & Site Verification Alerts:</span>
                  </div>
                  <ul className="text-[11px] text-amber-800 space-y-1 list-disc pl-5">
                    {preview.assumptions.map((ass, i) => (
                      <li key={`ass-${i}`}>{ass}</li>
                    ))}
                    {preview.warnings.map((warn, i) => (
                      <li key={`warn-${i}`} className="font-semibold text-amber-950">
                        {warn}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Generated SSR Items Breakdown Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#02013F] uppercase tracking-wider flex items-center space-x-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#81C303]" />
                    <span>Generated SSR Items & Measurement Take-Offs ({preview.items.length})</span>
                  </h4>
                  <span className="text-[11px] text-[#64748B]">Click any row to inspect dimensional formulas</span>
                </div>

                <div className="border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#02013F] text-white text-[11px]">
                        <th className="p-2.5 font-bold w-12 text-center">#</th>
                        <th className="p-2.5 font-bold w-20">Item No.</th>
                        <th className="p-2.5 font-bold">Description of Work Item</th>
                        <th className="p-2.5 font-bold w-20 text-center">Unit</th>
                        <th className="p-2.5 font-bold w-28 text-right">Computed Qty</th>
                        <th className="p-2.5 font-bold w-24 text-right">SSR Rate (₹)</th>
                        <th className="p-2.5 font-bold w-28 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {preview.items.map((item, idx) => {
                        const totalQty = item.measurements.reduce((acc, m) => acc + m.computedQty, 0);
                        const isExpanded = expandedItemId === item.id;
                        const itemAmount = Math.round(totalQty * item.baseRate);

                        return (
                          <React.Fragment key={item.id}>
                            <tr
                              onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                              className={`cursor-pointer transition-colors ${
                                isExpanded ? 'bg-[#FBFFEB]' : idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-[#F8FAFC] hover:bg-slate-50'
                              }`}
                            >
                              <td className="p-2.5 text-center text-slate-500 font-mono text-[11px]">
                                {idx + 1}
                              </td>
                              <td className="p-2.5 font-mono font-bold text-[#02013F]">
                                {item.itemCode}
                              </td>
                              <td className="p-2.5 text-[#111827]">
                                <div className="font-semibold text-xs text-[#02013F] flex items-center space-x-1">
                                  <span>{item.description.substring(0, 95)}...</span>
                                  {isExpanded ? (
                                    <ChevronUp className="w-3.5 h-3.5 text-[#81C303] shrink-0" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  )}
                                </div>
                                <span className="text-[10px] text-[#64748B]">
                                  {item.measurements.length} measurement take-off row(s)
                                </span>
                              </td>
                              <td className="p-2.5 text-center font-bold text-slate-600 text-[11px]">
                                {item.unit}
                              </td>
                              <td className="p-2.5 text-right font-mono font-bold text-[#02013F]">
                                {totalQty.toLocaleString('en-IN', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 3,
                                })}
                              </td>
                              <td className="p-2.5 text-right font-mono text-slate-600">
                                ₹{item.baseRate.toLocaleString('en-IN')}
                              </td>
                              <td className="p-2.5 text-right font-mono font-bold text-[#02013F]">
                                ₹{itemAmount.toLocaleString('en-IN')}
                              </td>
                            </tr>

                            {/* Expanded Detailed Measurement Rows */}
                            {isExpanded && (
                              <tr className="bg-slate-50">
                                <td colSpan={7} className="p-3 border-t border-b border-[#E5E7EB]">
                                  <div className="space-y-1.5 pl-6">
                                    <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                                      Detailed Measurement Take-Off Ledger:
                                    </div>
                                    <div className="grid grid-cols-1 gap-1 text-[11px]">
                                      {item.measurements.map((m, mIdx) => (
                                        <div
                                          key={m.id || mIdx}
                                          className="flex items-center justify-between bg-white px-3 py-1.5 rounded border border-[#E5E7EB]"
                                        >
                                          <div className="flex items-center space-x-2">
                                            <span
                                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                                m.isDeduction ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                                              }`}
                                            >
                                              {m.isDeduction ? '-' : '+'}
                                            </span>
                                            <span className="font-medium text-[#111827]">{m.label}</span>
                                          </div>

                                          <div className="flex items-center space-x-3 text-slate-600 font-mono text-[11px]">
                                            <span>
                                              {m.multiplier} × {m.length}m × {m.breadth}m × {m.depth}m
                                            </span>
                                            <span>=</span>
                                            <strong
                                              className={m.isDeduction ? 'text-rose-600 font-bold' : 'text-[#02013F] font-bold'}
                                            >
                                              {m.isDeduction ? '-' : ''}
                                              {m.computedQty.toFixed(3)} {item.unit}
                                            </strong>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-[#E5E7EB] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSaveAsCustomTemplate}
                  className="px-3 py-2 bg-white hover:bg-[#FBFFEB] text-[#02013F] border border-[#E5E7EB] hover:border-[#81C303] rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5"
                >
                  <BookmarkPlus className="w-3.5 h-3.5 text-[#81C303]" />
                  <span>Save as Custom Template</span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleCloseWizard}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#02013F] transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleGenerateEstimate}
                  className="px-5 py-2.5 bg-[#81C303] hover:bg-[#72ad02] text-[#02013F] font-extrabold rounded-lg text-xs shadow-md transition-all flex items-center space-x-2 cursor-pointer ring-2 ring-[#81C303]/40"
                >
                  <Zap className="w-4 h-4 fill-[#02013F]" />
                  <span>Generate Live Estimate & Take-Offs</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
