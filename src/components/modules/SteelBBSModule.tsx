import React, { useState } from 'react';
import { useEstimatorStore } from '../../store/useEstimatorStore';
import { BBSElementType } from '../../types/estimator';
import { calculateSteelBBS } from '../../engine/calculationEngine';
import { Grid, Plus, Trash2, ArrowRight, Check, Sparkles } from 'lucide-react';

export const SteelBBSModule: React.FC = () => {
  const { bbsElements, addBBSElement, removeBBSElement, pushBBSToItem2633, setActiveTab } =
    useEstimatorStore();

  const [elementType, setElementType] = useState<BBSElementType>('FOOTING');
  const [elementLabel, setElementLabel] = useState('Footing F1 (12 Nos)');
  const [count, setCount] = useState<number>(12);
  const [barDia, setBarDia] = useState<number>(12);
  const [lengthM, setLengthM] = useState<number>(1.2);
  const [breadthM, setBreadthM] = useState<number>(1.2);
  const [depthM, setDepthM] = useState<number>(0.45);
  const [coverMm, setCoverMm] = useState<number>(50);
  const [spacingMm, setSpacingMm] = useState<number>(150);

  const [pushedSuccess, setPushedSuccess] = useState(false);

  const handleAddElement = (e: React.FormEvent) => {
    e.preventDefault();
    const element = calculateSteelBBS(
      elementType,
      elementLabel,
      count,
      barDia,
      lengthM,
      breadthM,
      depthM,
      coverMm,
      spacingMm
    );

    addBBSElement(element);
    setElementLabel(`${elementType} Detail ${bbsElements.length + 2}`);
  };

  const totalKg = bbsElements.reduce((sum, el) => sum + el.totalWeightKg, 0);
  const totalMT = Number((totalKg / 1000).toFixed(3));

  const handlePushTo2633 = () => {
    pushBBSToItem2633();
    setPushedSuccess(true);
    setTimeout(() => setPushedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#F4762A] uppercase tracking-wider">
            Parametric Rebar Detailing & Scheduling
          </span>
          <h2 className="text-xl font-bold text-[#0B1F3A]">Structural Steel Bar Bending Schedule (BBS)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Formula: w = D² / 162.28 kg/m (TMT Fe-500). Evaluates cutting lengths, clear covers and hooks with 1-click measurement push.
          </p>
        </div>

        {/* Tonnage Rollup & Push CTA */}
        <div className="flex items-center space-x-3">
          <div className="bg-[#071426] text-white px-4 py-2 rounded-lg border border-[#F4762A] text-right">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total Steel Mass</div>
            <div className="text-lg font-bold text-[#F4762A] tabular-nums-force">
              {totalKg.toLocaleString('en-IN')} kg <span className="text-xs text-white">({totalMT} MT)</span>
            </div>
          </div>

          <button
            onClick={handlePushTo2633}
            disabled={bbsElements.length === 0}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-all ${
              pushedSuccess
                ? 'bg-emerald-600 text-white'
                : bbsElements.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#F4762A] hover:bg-[#D65F14] text-white hover:scale-105 active:scale-95'
            }`}
          >
            {pushedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Pushed to Item 26.33!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Add Total to SSR Item 26.33</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid: Parametric Input Form + BBS Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parametric Wizard Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="flex items-center space-x-2 text-[#0B1F3A] font-bold text-xs border-b border-slate-100 pb-2.5">
            <Grid className="w-4 h-4 text-[#F4762A]" />
            <span>Parametric Structural Element Wizard</span>
          </div>

          <form onSubmit={handleAddElement} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Structural Element Type</label>
              <select
                value={elementType}
                onChange={(e) => {
                  const t = e.target.value as BBSElementType;
                  setElementType(t);
                  setElementLabel(`${t} Detail`);
                }}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 font-semibold text-slate-800"
              >
                <option value="FOOTING">Isolated Footing (Two-Way Mesh)</option>
                <option value="COLUMN">RCC Column (Longitudinal Rebar)</option>
                <option value="BEAM">RCC Beam (Tensile + Hanger)</option>
                <option value="SLAB">RCC Slab (Main + Distribution)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Element Label</label>
              <input
                type="text"
                value={elementLabel}
                onChange={(e) => setElementLabel(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Number of Units (N)</label>
                <input
                  type="number"
                  min="1"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  className="w-full text-xs p-2 rounded border border-slate-300 font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Bar Diameter (mm)</label>
                <select
                  value={barDia}
                  onChange={(e) => setBarDia(parseInt(e.target.value))}
                  className="w-full text-xs p-2 rounded border border-slate-300 font-mono font-bold bg-slate-50"
                >
                  <option value="8">8 mm (0.395 kg/m)</option>
                  <option value="10">10 mm (0.617 kg/m)</option>
                  <option value="12">12 mm (0.888 kg/m)</option>
                  <option value="16">16 mm (1.578 kg/m)</option>
                  <option value="20">20 mm (2.466 kg/m)</option>
                  <option value="25">25 mm (3.853 kg/m)</option>
                  <option value="32">32 mm (6.313 kg/m)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Length (m)</label>
                <input
                  type="number"
                  step="0.01"
                  value={lengthM}
                  onChange={(e) => setLengthM(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs p-1.5 rounded border border-slate-300 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Breadth (m)</label>
                <input
                  type="number"
                  step="0.01"
                  value={breadthM}
                  onChange={(e) => setBreadthM(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs p-1.5 rounded border border-slate-300 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Depth (m)</label>
                <input
                  type="number"
                  step="0.01"
                  value={depthM}
                  onChange={(e) => setDepthM(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs p-1.5 rounded border border-slate-300 font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Clear Cover (mm)</label>
                <input
                  type="number"
                  value={coverMm}
                  onChange={(e) => setCoverMm(parseInt(e.target.value) || 0)}
                  className="w-full text-xs p-1.5 rounded border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">C/C Spacing (mm)</label>
                <input
                  type="number"
                  value={spacingMm}
                  onChange={(e) => setSpacingMm(parseInt(e.target.value) || 0)}
                  className="w-full text-xs p-1.5 rounded border border-slate-300 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#0B1F3A] hover:bg-[#14335C] text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center space-x-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-[#F4762A]" />
              <span>Calculate & Add to Schedule</span>
            </button>
          </form>
        </div>

        {/* BBS Schedule Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-xs text-[#0B1F3A] uppercase tracking-wider">
              Bar Bending Schedule Ledger
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Total Bars: {bbsElements.reduce((sum, el) => sum + el.totalBars, 0)}
            </span>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left dense-table border-collapse">
              <thead>
                <tr>
                  <th className="w-10 text-center">#</th>
                  <th>Structural Element Description</th>
                  <th className="w-20 text-center">Dia (mm)</th>
                  <th className="w-20 text-right">Cut L (m)</th>
                  <th className="w-20 text-right">No. Bars</th>
                  <th className="w-24 text-right">Unit Wt (kg/m)</th>
                  <th className="w-28 text-right">Total Wt (kg)</th>
                  <th className="w-12 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {bbsElements.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-xs text-slate-400">
                      No structural rebar elements generated yet. Use the wizard on the left to calculate footing, column, beam or slab reinforcement.
                    </td>
                  </tr>
                ) : (
                  bbsElements.map((el, idx) => (
                    <tr key={el.id} className="hover:bg-slate-50">
                      <td className="text-center font-mono text-slate-400 text-xs">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="text-xs font-semibold text-slate-800">
                        {el.elementLabel} <span className="text-[10px] text-slate-400 font-normal">({el.count} units)</span>
                      </td>
                      <td className="text-center font-mono font-bold text-xs text-slate-900">
                        {el.barDiaMm}#
                      </td>
                      <td className="text-right font-mono text-xs text-slate-700 tabular-nums-force">
                        {el.cutLengthM.toFixed(3)}
                      </td>
                      <td className="text-right font-mono font-bold text-xs text-slate-900 tabular-nums-force">
                        {el.totalBars}
                      </td>
                      <td className="text-right font-mono text-xs text-slate-500 tabular-nums-force">
                        {el.unitWeightKgM.toFixed(3)}
                      </td>
                      <td className="text-right font-mono font-bold text-xs text-[#0B1F3A] tabular-nums-force bg-slate-50/50">
                        {el.totalWeightKg.toFixed(2)}
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => removeBBSElement(el.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="Remove element"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Schedule Footer */}
          <div className="bg-[#0B1F3A] text-white p-3.5 flex items-center justify-between border-t border-[#14335C]">
            <span className="text-xs font-semibold text-slate-300">Total Structural Rebar Mass:</span>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold text-[#F4762A] tabular-nums-force">
                {totalKg.toLocaleString('en-IN')} kg
              </span>
              <span className="bg-[#F4762A] text-white text-xs font-mono font-bold px-2 py-0.5 rounded">
                = {totalMT} Metric Tonnes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
