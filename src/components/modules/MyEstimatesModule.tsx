import React, { useState } from 'react';
import { useEstimatorStore } from '../../store/useEstimatorStore';
import { SavedEstimateRecord } from '../../types/estimator';
import { exportFullMahaPwdExcel } from '../../utils/excelExporter';
import {
  FolderArchive,
  Plus,
  Save,
  Search,
  Edit3,
  Copy,
  Trash2,
  Calendar,
  Building,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Layers,
  FileSpreadsheet,
  X,
  FileText,
} from 'lucide-react';

export const MyEstimatesModule: React.FC = () => {
  const {
    savedEstimates,
    currentEstimateId,
    facesheet,
    calculationRollup,
    loadSavedEstimate,
    deleteSavedEstimate,
    duplicateSavedEstimate,
    createNewEstimate,
    saveCurrentEstimate,
    setActiveTab,
    loadGoldenMasterDemo,
  } = useEstimatorStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [saveToast, setSaveToast] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Modal States
  const [showNewModal, setShowNewModal] = useState(false);
  const [newWorkTitle, setNewWorkTitle] = useState('Construction of CC Road & Drain Works');
  const [quickRenameRecord, setQuickRenameRecord] = useState<SavedEstimateRecord | null>(null);
  const [quickRenameText, setQuickRenameText] = useState('');

  const filteredEstimates = savedEstimates.filter((est) => {
    const q = searchQuery.toLowerCase();
    return (
      est.nameOfWork.toLowerCase().includes(q) ||
      est.division.toLowerCase().includes(q) ||
      est.subDivision.toLowerCase().includes(q)
    );
  });

  const totalValue = savedEstimates.reduce((sum, e) => sum + (e.sanctionedAmount || 0), 0);

  const handleSaveActive = () => {
    saveCurrentEstimate();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleConfirmNew = (e: React.FormEvent) => {
    e.preventDefault();
    createNewEstimate(newWorkTitle);
    setShowNewModal(false);
    setActiveTab('facesheet');
  };

  const handleEdit = (id: string) => {
    loadSavedEstimate(id);
    setActiveTab('facesheet');
  };

  const handleDelete = (id: string) => {
    deleteSavedEstimate(id);
    setDeleteConfirmId(null);
  };

  const handleConfirmQuickRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickRenameRecord || !quickRenameText.trim()) return;

    // If this is the currently active estimate, also update active facesheet
    if (currentEstimateId === quickRenameRecord.id) {
      useEstimatorStore.getState().updateFacesheet({ nameOfWork: quickRenameText.trim() });
    }

    // Update in savedEstimates
    const updated = savedEstimates.map((est) => {
      if (est.id !== quickRenameRecord.id) return est;
      return {
        ...est,
        nameOfWork: quickRenameText.trim(),
        updatedAt: new Date().toISOString(),
        facesheet: {
          ...est.facesheet,
          nameOfWork: quickRenameText.trim(),
        },
      };
    });

    try {
      localStorage.setItem('maha_pwd_saved_estimates', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    useEstimatorStore.setState({ savedEstimates: updated });
    setQuickRenameRecord(null);
  };

  const handleExportEstimateExcel = (est: SavedEstimateRecord) => {
    exportFullMahaPwdExcel({
      facesheet: est.facesheet,
      items: est.items,
      leadSettings: est.leadSettings,
      calculationRollup: {
        scheduleA_costOfWork: est.sanctionedAmount,
        scheduleB_royalty: 0,
        scheduleC_testing: 0,
        subtotalDirectWorks: est.sanctionedAmount,
        gstAmount: Math.round(est.sanctionedAmount * 0.18),
        contingencyAmount: Math.round(est.sanctionedAmount * 0.02),
        laborCessAmount: Math.round(est.sanctionedAmount * 0.005),
        areaSurchargeAmount: 0,
        electrificationAmount: 0,
        grandTotal: est.sanctionedAmount,
        sanctionedTotal: est.sanctionedAmount,
        formattedLakhs: `₹${(est.sanctionedAmount / 100000).toFixed(2)} Lakhs`,
      },
      bbsElements: est.bbsElements || [],
      stamps: est.stamps || [],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-[#F4762A] uppercase tracking-wider">
              Project Vault & Document Manager
            </span>
            {currentEstimateId && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Active Work Synchronized</span>
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-[#0B1F3A] mt-0.5">My Saved Estimates (सर्व जतन केलेले अंदाजपत्रक)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Open, edit, duplicate, rename, or create fresh Maharashtra PWD estimates. Every single field, item, and measurement is 100% editable.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={handleSaveActive}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#0B1F3A] hover:bg-[#14335C] text-white text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
            title="Save currently loaded estimate to your library"
          >
            <Save className="w-4 h-4 text-[#F4762A]" />
            <span>{saveToast ? 'Saved to Library!' : 'Save Active Estimate'}</span>
          </button>

          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
            title="Create a fresh blank estimate"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Estimate</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Saved Estimates</div>
            <div className="text-2xl font-bold text-[#0B1F3A] tabular-nums-force">{savedEstimates.length}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#0B1F3A]">
            <FolderArchive className="w-5 h-5 text-[#0B1F3A]" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Combined Project Portfolio Value</div>
            <div className="text-xl font-bold text-emerald-700 tabular-nums-force">
              ₹{totalValue.toLocaleString('en-IN')} <span className="text-xs text-slate-500 font-normal">({(totalValue / 100000).toFixed(2)} L)</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Building className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Active Workspace Work</div>
            <div className="text-xs font-bold text-[#0B1F3A] truncate max-w-[200px]" title={facesheet.nameOfWork}>
              {facesheet.nameOfWork}
            </div>
            <div className="text-[11px] text-[#F4762A] font-semibold tabular-nums-force">
              ₹{calculationRollup.sanctionedTotal.toLocaleString('en-IN')} ({facesheet.status})
            </div>
          </div>
          <button
            onClick={() => setActiveTab('facesheet')}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-xs font-semibold text-[#0B1F3A] flex items-center space-x-1"
          >
            <span>Edit Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search saved estimates by work name, division or sub-division..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B1F3A] outline-none"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing {filteredEstimates.length} of {savedEstimates.length} estimates
        </div>
      </div>

      {/* Estimates List */}
      {filteredEstimates.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <FolderArchive className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#0B1F3A]">No Saved Estimates Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              {searchQuery
                ? `No estimates matched "${searchQuery}". Try a different keyword.`
                : 'Your estimate library is currently empty. You can start a fresh estimate or load an authentic PWD benchmark project.'}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center space-x-1 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4" />
              <span>Start New Blank Estimate</span>
            </button>

            <button
              onClick={() => {
                loadGoldenMasterDemo();
                saveCurrentEstimate();
              }}
              className="flex items-center space-x-1 px-4 py-2 bg-[#0B1F3A] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#14335C]"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Load & Save Wardha SP Office Demo</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredEstimates.map((est) => {
            const isActive = currentEstimateId === est.id;
            const updatedDate = new Date(est.updatedAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={est.id}
                className={`bg-white rounded-xl border p-5 transition-all ${
                  isActive
                    ? 'border-[#F4762A] ring-2 ring-[#F4762A]/20 shadow-md bg-orange-50/10'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Info */}
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center space-x-2">
                      <span className="bg-[#0B1F3A] text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                        SSR {est.facesheet?.ssrYear || '2022-23'}
                      </span>
                      <span className="text-[11px] text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                        {est.division || 'P.W. Division'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {est.subDivision}
                      </span>
                      {isActive && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>CURRENTLY ACTIVE</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <h3
                        onClick={() => handleEdit(est.id)}
                        className="font-bold text-sm text-[#0B1F3A] hover:text-[#F4762A] cursor-pointer transition-colors leading-snug"
                        title="Click to edit estimate details, items, and measurements"
                      >
                        {est.nameOfWork}
                      </h3>
                      <button
                        onClick={() => {
                          setQuickRenameRecord(est);
                          setQuickRenameText(est.nameOfWork);
                        }}
                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-[#F4762A]"
                        title="Rename this estimate title"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-0.5">
                      <div className="flex items-center space-x-1">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span><strong>{est.itemCount}</strong> BOQ Items</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Saved: {updatedDate}</span>
                      </div>
                      <div className="text-slate-400">|</div>
                      <div className="text-slate-600 font-medium">
                        Fund: {est.facesheet?.fundHead || 'General Public Works'}
                      </div>
                    </div>
                  </div>

                  {/* Right Cost & Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 shrink-0">
                    <div className="text-left sm:text-right bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200 min-w-[150px]">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Sanctioned Cost</div>
                      <div className="text-base font-bold text-[#0B1F3A] tabular-nums-force">
                        ₹{est.sanctionedAmount?.toLocaleString('en-IN') || '0.00'}
                      </div>
                      <div className="text-[10px] font-semibold text-[#F4762A]">
                        ₹{((est.sanctionedAmount || 0) / 100000).toFixed(2)} Lakhs
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-1.5">
                      {/* Edit / Open Button */}
                      <button
                        onClick={() => handleEdit(est.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-[#0B1F3A] hover:bg-[#14335C] text-white text-xs font-bold rounded-lg shadow-sm transition-all hover:scale-105 active:scale-95"
                        title="Load this estimate to edit name, division, items, and measurements"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#F4762A]" />
                        <span>Edit / Open</span>
                      </button>

                      {/* Duplicate Button */}
                      <button
                        onClick={() => duplicateSavedEstimate(est.id)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition-colors"
                        title="Duplicate estimate as copy"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Export Excel Button */}
                      <button
                        onClick={() => handleExportEstimateExcel(est)}
                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs transition-colors"
                        title="Export complete 14-sheet Excel (.xlsx)"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      {deleteConfirmId === est.id ? (
                        <div className="flex items-center space-x-1 bg-red-50 p-1 rounded-lg border border-red-200">
                          <button
                            onClick={() => handleDelete(est.id)}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-1.5 py-1 text-slate-500 text-[10px]"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(est.id)}
                          className="p-2 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg text-xs transition-colors"
                          title="Delete this estimate from library"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: Create New Estimate */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 text-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-[#0B1F3A]">Create New Estimate (नवीन अंदाजपत्रक)</h3>
                <p className="text-xs text-slate-500 mt-0.5">Start a fresh Maharashtra PWD estimate with custom work title.</p>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmNew} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Name of Proposed Work (कामाचे नाव / शीर्षक) *
                </label>
                <textarea
                  rows={3}
                  value={newWorkTitle}
                  onChange={(e) => setNewWorkTitle(e.target.value)}
                  placeholder="उदा. मौजे कासारवाडी येथे अंतर्गत सिमेंट काँक्रीट रस्ता व नाली बांधकाम करणे..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0B1F3A] outline-none font-medium text-slate-800"
                  required
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
                <p className="font-semibold">💡 Notice:</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Creating a new estimate initializes a clean workspace. All your previously saved estimates are preserved in this repository.
                </p>
              </div>

              <div className="flex justify-end space-x-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Blank Estimate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Quick Rename */}
      {quickRenameRecord && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 text-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-[#0B1F3A]">Rename Saved Estimate (कामाचे नाव बदला)</h3>
                <p className="text-xs text-slate-500 mt-0.5">Update project title in your saved estimates library.</p>
              </div>
              <button
                onClick={() => setQuickRenameRecord(null)}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmQuickRename} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Name of Work (कामाचे नाव):
                </label>
                <textarea
                  rows={3}
                  value={quickRenameText}
                  onChange={(e) => setQuickRenameText(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0B1F3A] outline-none font-semibold text-slate-800"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQuickRenameRecord(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#0B1F3A] hover:bg-[#14335C] text-white rounded-lg shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
