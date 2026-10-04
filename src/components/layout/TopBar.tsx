import React, { useState } from 'react';
import { useEstimatorStore } from '../../store/useEstimatorStore';
import { UserSettingsModal } from './UserSettingsModal';
import {
  Plus,
  Save,
  CheckCircle2,
  Edit3,
  X,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Globe,
} from 'lucide-react';

interface TopBarProps {
  currentUser?: { name: string; role: string; division: string; email: string } | null;
  onLogout?: () => void;
  onUpdateUser?: (updated: any) => void;
  onViewLandingPage?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentUser, onLogout, onUpdateUser, onViewLandingPage }) => {
  const {
    facesheet,
    updateFacesheet,
    calculationRollup,
    setActiveTab,
    saveCurrentEstimate,
    createNewEstimate,
  } = useEstimatorStore();

  const [savedToast, setSavedToast] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
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

  return (
    <>
      <header className="sticky top-0 z-20 h-16 bg-white border-b border-[#E5E7EB] text-[#111827] flex items-center justify-between px-6 shrink-0 shadow-xs no-print">
        {/* Active Work Title with Click-to-Edit */}
        <div className="flex items-center space-x-3 overflow-hidden max-w-xl">
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 border ${
              facesheet.status === 'SANCTIONED'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : facesheet.status === 'UNDER_REVIEW'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
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
            <h2 className="text-xs font-bold text-[#02013F] group-hover:text-[#81C303] transition-colors truncate">
              {facesheet.nameOfWork}
            </h2>
            <Edit3 className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#81C303] shrink-0" />
          </div>
        </div>

        {/* Action Buttons & Live Budget Chip */}
        <div className="flex items-center space-x-2.5">
          {/* New Estimate Button */}
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all hover:scale-105 active:scale-95"
            title="Create fresh new blank estimate"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>

          {/* Save Estimate Button */}
          <button
            onClick={handleSave}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-bold shadow-xs transition-all hover:scale-105 active:scale-95 ${
              savedToast
                ? 'bg-[#16A34A] text-white'
                : 'bg-[#81C303] hover:bg-[#72ad02] text-[#02013F]'
            }`}
            title="Save active estimate to your personal library"
          >
            {savedToast ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savedToast ? 'Saved!' : 'Save'}</span>
          </button>

          {/* Live Sanctioned Budget Pill */}
          <div className="bg-[#FBFFEB] border border-[#81C303]/50 rounded-lg px-3 py-1 flex items-center space-x-2 shadow-xs">
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-wider text-[#64748B] font-semibold leading-none">
                Sanctioned Cost
              </div>
              <div className="text-xs font-bold text-[#02013F] tabular-nums-force leading-tight">
                ₹{calculationRollup.sanctionedTotal.toLocaleString('en-IN')}
              </div>
            </div>
            <span className="text-[10px] font-bold bg-[#81C303] text-[#02013F] px-1.5 py-0.5 rounded shadow-xs">
              {(calculationRollup.sanctionedTotal / 100000).toFixed(2)} L
            </span>
          </div>

          {/* Landing Page Link */}
          {onViewLandingPage && (
            <button
              type="button"
              onClick={onViewLandingPage}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-[#02013F] text-[#64748B] hover:text-[#02013F] text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
              title="View Product Marketing Landing Page"
            >
              <Globe className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="hidden md:inline">Marketing Website</span>
            </button>
          )}

          {/* Official Officer Avatar & User Settings */}
          {currentUser && (
            <div className="flex items-center space-x-2 border-l border-[#E5E7EB] pl-3">
              <button
                type="button"
                onClick={() => setShowSettingsModal(true)}
                className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-[#FBFFEB] border border-transparent hover:border-[#81C303]/50 transition-all cursor-pointer group text-left"
                title="User Profile & System Settings (वापरकर्ता प्रोफाइल आणि सेटिंग्ज)"
              >
                {/* Officer Avatar Badge with Initials & Online Status */}
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#02013F] text-white flex items-center justify-center font-extrabold text-xs shadow-xs border border-[#81C303] group-hover:scale-105 transition-transform">
                    {(() => {
                      const parts = (currentUser.name || 'User').trim().split(' ').filter(Boolean);
                      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
                      return (currentUser.name || 'AD').substring(0, 2).toUpperCase();
                    })()}
                  </div>
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#81C303] border-2 border-white shadow-2xs"
                    title="Active Session"
                  />
                </div>

                <div className="hidden md:block leading-tight">
                  <div className="text-[11px] font-bold text-[#02013F] flex items-center space-x-1">
                    <span className="truncate max-w-[120px]">{currentUser.name}</span>
                    <ChevronDown className="w-3 h-3 text-[#64748B] group-hover:text-[#02013F] transition-colors" />
                  </div>
                  <div className="text-[9px] text-[#64748B] font-medium truncate max-w-[120px]">
                    {currentUser.role || 'PWD Official'}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShowSettingsModal(true)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#02013F] hover:bg-slate-100 transition-colors"
                title="Open Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* USER SETTINGS MODAL */}
      <UserSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        currentUser={currentUser || null}
        onLogout={onLogout}
        onUpdateUser={onUpdateUser}
      />

      {/* MODAL: Create New Estimate */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 text-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-[#02013F]">Create New Estimate (नवीन अंदाजपत्रक)</h3>
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
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#02013F] outline-none font-medium text-slate-800"
                  required
                />
              </div>

              <div className="bg-[#FBFFEB] border border-[#81C303]/30 rounded-lg p-3 text-xs text-[#02013F]">
                <p className="font-semibold text-[#81C303]">💡 Tip:</p>
                <p className="text-[11px] text-slate-700 mt-0.5">
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
                  className="px-5 py-2 text-xs font-bold bg-[#81C303] hover:bg-[#72ad02] text-[#02013F] rounded-lg shadow-sm flex items-center space-x-1.5"
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
                <h3 className="font-bold text-base text-[#02013F]">Edit Work Title (कामाचे नाव बदला)</h3>
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
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#02013F] outline-none font-semibold text-slate-800"
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
                  className="text-xs text-[#02013F] hover:text-[#81C303] hover:underline font-semibold"
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
                    className="px-5 py-2 text-xs font-bold bg-[#02013F] hover:bg-[#14136e] text-white rounded-lg shadow-sm"
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
