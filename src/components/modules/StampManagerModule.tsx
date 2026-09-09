import React from 'react';
import { useEstimatorStore } from '../../store/useEstimatorStore';
import { Stamp, Check, Shield } from 'lucide-react';

export const StampManagerModule: React.FC = () => {
  const { stamps, updateStamp } = useEstimatorStore();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-[#F4762A] uppercase tracking-wider">
            Signatures, Designations & Authorizations
          </span>
          <h2 className="text-xl font-bold text-[#0B1F3A]">Digital Stamp & Signature Manager</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure official engineering designations, signatory authority names, and per-schedule visibility toggles.
          </p>
        </div>
        <div className="bg-[#0B1F3A] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5">
          <Stamp className="w-4 h-4 text-[#F4762A]" />
          <span>Departmental Stamp Authority</span>
        </div>
      </div>

      {/* Stamp Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stamps.map((stamp) => (
          <div
            key={stamp.role}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="bg-[#0B1F3A] text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                  {stamp.role} Stamp
                </span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">
                  {stamp.role === 'SE' ? 'Preparing Authority' : stamp.role === 'SDE' ? 'Verification Authority' : 'Sanctioning Authority'}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Officer Full Name</label>
                <input
                  type="text"
                  value={stamp.name}
                  onChange={(e) => updateStamp(stamp.role, { name: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-slate-300 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Official Designation</label>
                <input
                  type="text"
                  value={stamp.designation}
                  onChange={(e) => updateStamp(stamp.role, { designation: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-slate-300 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Division / Office Name</label>
                <input
                  type="text"
                  value={stamp.subDivision}
                  onChange={(e) => updateStamp(stamp.role, { subDivision: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-slate-300 text-slate-700"
                />
              </div>
            </div>

            {/* Per-Sheet Visibility Toggles */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Show Stamp on Schedules:
              </span>
              <div className="space-y-1.5">
                <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stamp.showOnCover}
                    onChange={(e) => updateStamp(stamp.role, { showOnCover: e.target.checked })}
                    className="rounded border-slate-300 text-[#0B1F3A]"
                  />
                  <span>Cover / Facesheet</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stamp.showOnMeasurement}
                    onChange={(e) => updateStamp(stamp.role, { showOnMeasurement: e.target.checked })}
                    className="rounded border-slate-300 text-[#0B1F3A]"
                  />
                  <span>Measurement Sheet</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stamp.showOnAbstract}
                    onChange={(e) => updateStamp(stamp.role, { showOnAbstract: e.target.checked })}
                    className="rounded border-slate-300 text-[#0B1F3A]"
                  />
                  <span>Abstract of Cost</span>
                </label>
                <label className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stamp.showOnGeneralAbstract}
                    onChange={(e) => updateStamp(stamp.role, { showOnGeneralAbstract: e.target.checked })}
                    className="rounded border-slate-300 text-[#0B1F3A]"
                  />
                  <span>General Abstract (Recap)</span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
