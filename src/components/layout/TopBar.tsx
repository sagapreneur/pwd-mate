import React, { useState } from 'react';
import { useEstimatorStore } from '../../store/useEstimatorStore';
import {
  Printer,
  Download,
  Plus,
  Save,
  FolderArchive,
  CheckCircle2,
  Edit3,
  X,
  FileSpreadsheet,
  LogOut,
  User,
} from 'lucide-react';
import { exportFullMahaPwdExcel } from '../../utils/excelExporter';

interface TopBarProps {
  currentUser?: { name: string; role: string; division: string; email: string } | null;
  onLogout?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentUser, onLogout }) => {
  const {
    facesheet,
    updateFacesheet,
    calculationRollup,
    activeTab,
    setActiveTab,
    saveCurrentEstimate,
    createNewEstimate,
    savedEstimates,
    items,
    leadSettings,
    bbsElements,
    stamps,
  } = useEstimatorStore();

  const [savedToast, setSavedToast] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newWorkTitle, setNewWorkTitle] = useState('Construction of CC Road & Drain Works');
  const [renameTitle, setRenameTitle] = useState(facesheet.nameOfWork);

  const handleSave = () => {
    saveCurrentEstimate();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleConfirmNewEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    createNewEstimate(newWorkTitle);
    setShowNewModal(false);
    setActiveTab('facesheet');
  };

  const handleConfirmRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (renameTitle.trim()) {
      updateFacesheet({ nameOfWork: renameTitle.trim() });
      saveCurrentEstimate();
    }
    setShowRenameModal(false);
  };

  const handlePrint = () => {
    if (activeTab === 'dossier') {
      window.print();
    } else {
      setActiveTab('dossier');
      setTimeout(() => {
        window.print();
      }, 350);
    }
  };

  const handleExportExcel = () => {
    exportFullMahaPwdExcel({
      facesheet,
      items,
      leadSettings,
      calculationRollup,
      bbsElements,
      stamps,
    });
  };

  return (
    <>
      <header className="h-16 bg-[#0B1F3A] border-b border-[#14335C] text-white flex items-center justify-between px-6 shrink-0 shadow-sm no-print">
        {/* Active Work Title with Click-to-Edit */}
        <div className="flex items-center space-x-3 overflow-hidden max-w-xl">
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 ${
              facesheet.status === 'SANCTIONED'
                ? 'bg-emerald-500 text-white'
                : facesheet.status === 'UNDER_REVIEW'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            {facesheet.status}
          </span>

          <div
            onClick={() => {
              setRenameTitle(facesheet.nameOfWork);
              setShowRenameModal(true);
            }}
            className="flex items-center space-x-2 cursor-pointer group truncate"
            title="Click to rename work title or edit project information"
          >
            <h2 className="text-xs font-semibold text-white group-hover:text-[#F4762A] transition-colors truncate">
              {facesheet.nameOfWork}
            </h2>
            <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#F4762A] shrink-0" />
          </div>
        </div>

        {/* Action Buttons & Live Budget Chip */}
        <div className="flex items-center space-x-2.5">
          {/* New Estimate Button */}
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
            title="Create fresh new blank estimate"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New</span>
          </button>

          {/* Save Estimate Button */}
          <button
            onClick={handleSave}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95 ${
              savedToast
                ? 'bg-emerald-600 text-white'
                : 'bg-[#F4762A] hover:bg-[#D65F14] text-white'
            }`}
            title="Save active estimate to your personal library"
          >
            {savedToast ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savedToast ? 'Saved!' : 'Save'}</span>
          </button>

          {/* My Estimates Repository Button */}
          <button
            onClick={() => setActiveTab('myEstimates')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
              activeTab === 'myEstimates'
                ? 'bg-amber-400 text-slate-900 border-amber-300 font-bold shadow-sm'
                : 'bg-[#14335C] hover:bg-[#1D4B85] text-white border-slate-700'
            }`}
            title="Open all estimates created by you"
          >
            <FolderArchive className="w-3.5 h-3.5 text-amber-300" />
            <span>My Estimates ({savedEstimates.length})</span>
          </button>

          <div className="h-6 w-px bg-slate-700 mx-0.5"></div>

          {/* Export Excel */}
          <button
            onClick={handleExportExcel}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded bg-[#14335C] hover:bg-[#1D4B85] text-white text-xs font-medium border border-slate-700 transition-colors"
            title="Download 14-sheet Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xl:inline">Excel</span>
          </button>

          {/* Print / PDF Dossier */}
          <button
            onClick={handlePrint}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
              activeTab === 'dossier'
                ? 'bg-[#F4762A] text-white border-[#D65F14] shadow-sm'
                : 'bg-[#14335C] hover:bg-[#1D4B85] text-white border-slate-700'
            }`}
            title="Open complete printable Technical Sanction estimate dossier"
          >
            <Printer className="w-3.5 h-3.5 text-sky-300" />
            <span>{activeTab === 'dossier' ? 'Print' : 'Dossier'}</span>
          </button>

          {/* Live Sanctioned Budget Pill */}
          <div className="bg-[#071426] border border-[#F4762A] rounded-lg px-3 py-1 flex items-center space-x-2 shadow-inner">
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold leading-none">
                Sanctioned Cost
              </div>
              <div className="text-xs font-bold text-[#F4762A] tabular-nums-force leading-tight">
                ₹{calculationRollup.sanctionedTotal.toLocaleString('en-IN')}
              </div>
            </div>
            <span className="text-[10px] font-bold bg-[#FDEBDD] text-[#D65F14] px-1.5 py-0.5 rounded">
              {(calculationRollup.sanctionedTotal / 100000).toFixed(2)} L
            </span>
          </div>

          {/* Official Officer Profile & Logout */}
          {currentUser && (
            <div className="flex items-center space-x-2 border-l border-slate-700 pl-2.5">
              <div className="text-right hidden md:block leading-tight">
                <div className="text-[11px] font-bold text-white flex items-center justify-end space-x-1">
                  <span>{currentUser.name}</span>
                </div>
                <div className="text-[9px] text-amber-300 font-medium">
                  {currentUser.role}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 px-2 py-1.5 rounded bg-slate-800 hover:bg-red-900/40 text-slate-300 hover:text-red-300 border border-slate-700 transition-colors text-xs"
                title="Log out of Department Portal (लॉगिनमधून बाहेर पडा)"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-[11px]">Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

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

            <form onSubmit={handleConfirmNewEstimate} className="space-y-4">
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
                <p className="font-semibold">💡 Tip:</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Creating a new estimate resets the workspace with 0 items. All your previously saved estimates remain safely preserved in <strong>"My Estimates"</strong>.
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

      {/* MODAL: Rename Current Work Title */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 text-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-[#0B1F3A]">Edit Work Title (कामाचे नाव बदला)</h3>
                <p className="text-xs text-slate-500 mt-0.5">Updates name of work across all print sheets, schedules and bills.</p>
              </div>
              <button
                onClick={() => setShowRenameModal(false)}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmRename} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Name of Work (कामाचे नाव):
                </label>
                <textarea
                  rows={3}
                  value={renameTitle}
                  onChange={(e) => setRenameTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0B1F3A] outline-none font-semibold text-slate-800"
                  required
                />
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowRenameModal(false);
                    setActiveTab('facesheet');
                  }}
                  className="text-xs text-[#F4762A] hover:underline font-semibold"
                >
                  Open Full Facesheet Details →
                </button>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowRenameModal(false)}
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
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
