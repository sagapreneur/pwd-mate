import React, { useState } from 'react';
import { useEstimatorStore } from '../../store/useEstimatorStore';
import { calculateDynamicItemRate } from '../../engine/calculationEngine';
import { Calculator, ArrowDown, Building, Sparkles } from 'lucide-react';

export const RateAnalysisModule: React.FC = () => {
  const { items, leadSettings, facesheet } = useEstimatorStore();
  const [selectedItemId, setSelectedItemId] = useState<string>(items[0]?.id || '');

  const activeItem = items.find((it) => it.id === selectedItemId) || items[0];

  if (!activeItem) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500 text-xs">
        No items in estimate to analyze. Add schedule items from the SSR Catalog.
      </div>
    );
  }

  const rateResult = calculateDynamicItemRate(
    activeItem.baseRate,
    leadSettings,
    activeItem.consumptionFactors,
    facesheet.areaSurchargePercent,
    'GF',
    activeItem.scadaApplicable,
    facesheet.scadaDeductionActive,
    facesheet.scadaDeductionAmount,
    activeItem.bitumenQtyPerUnit,
    facesheet.currentBitumenRate,
    facesheet.ssrBitumenRate,
    1.0
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#F4762A] uppercase tracking-wider">
            Defensible Cost Build-Up Ledger
          </span>
          <h2 className="text-xl font-bold text-[#0B1F3A]">Dynamic Rate Analysis Engine</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step Cess isolation, Area Surcharge (+{facesheet.areaSurchargePercent}%), Quarry Lead, SCADA plant credits, and Floor Elevation Escalations.
          </p>
        </div>

        {/* Item Selector Dropdown */}
        <div className="w-full md:w-72">
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Select Item for Rate Breakdown</label>
          <select
            value={selectedItemId || activeItem.id}
            onChange={(e) => setSelectedItemId(e.target.value)}
            className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0B1F3A] outline-none"
          >
            {items.map((it) => (
              <option key={it.id} value={it.id}>
                Item {it.itemCode}: {it.description.substring(0, 35)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Analysis Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Item Header */}
        <div className="bg-[#0B1F3A] text-white p-4 border-b border-[#14335C] flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#F4762A] text-white text-xs font-bold px-2 py-0.5 rounded font-mono">
                Item {activeItem.itemCode}
              </span>
              <span className="text-xs font-semibold">{activeItem.description}</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              Standard Engineering Unit: <strong className="text-white">{activeItem.unit}</strong> | Base SSR Rate: <strong className="text-amber-300">₹{activeItem.baseRate.toFixed(2)}</strong>
            </p>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Final Sanctioned Unit Rate (GF)</div>
            <div className="text-xl font-bold text-[#F4762A] tabular-nums-force">
              ₹{rateResult.groundFloorRate.toFixed(2)} / {activeItem.unit}
            </div>
          </div>
        </div>

        {/* Step-by-Step Breakdown Table */}
        <div className="p-6">
          <table className="w-full text-left dense-table border-collapse">
            <thead>
              <tr>
                <th className="w-16 text-center">Step #</th>
                <th>Computational Engineering Cost Component</th>
                <th className="w-64">Statutory Derivation Formulation</th>
                <th className="w-40 text-right">Step Impact (₹)</th>
                <th className="w-40 text-right">Cumulative Rate (₹)</th>
              </tr>
            </thead>
            <tbody>
              {/* Step 0 */}
              <tr>
                <td className="text-center font-mono text-slate-400 text-xs">00</td>
                <td className="font-semibold text-slate-800 text-xs">Published SSR Base Rate</td>
                <td className="text-xs text-slate-500 font-mono">Official SSR 2022-23 Schedule</td>
                <td className="text-right font-mono text-xs text-slate-500">—</td>
                <td className="text-right font-mono font-bold text-xs text-slate-900 tabular-nums-force">
                  ₹{rateResult.baseRate.toFixed(2)}
                </td>
              </tr>

              {/* Step 1 */}
              <tr>
                <td className="text-center font-mono text-slate-400 text-xs">01</td>
                <td className="font-semibold text-slate-800 text-xs">Deduct 1% Labour Welfare Cess</td>
                <td className="text-xs text-slate-500 font-mono">R_base / 1.01 (Cess Isolation)</td>
                <td className="text-right font-mono text-xs text-rose-600 tabular-nums-force">
                  -₹{(rateResult.baseRate - rateResult.rateNoCess).toFixed(2)}
                </td>
                <td className="text-right font-mono font-bold text-xs text-slate-900 tabular-nums-force">
                  ₹{rateResult.rateNoCess.toFixed(2)}
                </td>
              </tr>

              {/* Step 2 */}
              <tr>
                <td className="text-center font-mono text-slate-400 text-xs">02</td>
                <td className="font-semibold text-slate-800 text-xs">
                  Apply Area Surcharge (+{facesheet.areaSurchargePercent}%)
                </td>
                <td className="text-xs text-slate-500 font-mono">
                  {facesheet.areaSurchargeType} Allowance
                </td>
                <td className="text-right font-mono text-xs text-emerald-600 tabular-nums-force">
                  +₹{(rateResult.surchargedRate - rateResult.rateNoCess).toFixed(2)}
                </td>
                <td className="text-right font-mono font-bold text-xs text-slate-900 tabular-nums-force">
                  ₹{rateResult.surchargedRate.toFixed(2)}
                </td>
              </tr>

              {/* Step 3 */}
              <tr>
                <td className="text-center font-mono text-slate-400 text-xs">03</td>
                <td className="font-semibold text-slate-800 text-xs">Restore 1% Labour Welfare Cess</td>
                <td className="text-xs text-slate-500 font-mono">Surcharged Rate * 1.01</td>
                <td className="text-right font-mono text-xs text-emerald-600 tabular-nums-force">
                  +₹{(rateResult.rateWithCess - rateResult.surchargedRate).toFixed(2)}
                </td>
                <td className="text-right font-mono font-bold text-xs text-slate-900 tabular-nums-force">
                  ₹{rateResult.rateWithCess.toFixed(2)}
                </td>
              </tr>

              {/* Step 4: Material Quarry Leads */}
              {rateResult.leadContributions.map((lead, lIdx) => (
                <tr key={lIdx} className="bg-sky-50/50">
                  <td className="text-center font-mono text-sky-600 text-xs">04.{lIdx + 1}</td>
                  <td className="text-xs text-sky-900 font-medium pl-6">
                    + Lead Haulage: {lead.materialName}
                  </td>
                  <td className="text-xs text-slate-500 font-mono">
                    Factor {lead.factor} * ₹{lead.rate.toFixed(2)}/unit
                  </td>
                  <td className="text-right font-mono text-xs text-emerald-600 tabular-nums-force">
                    +₹{lead.contribution.toFixed(2)}
                  </td>
                  <td className="text-right font-mono text-xs text-slate-400 tabular-nums-force">—</td>
                </tr>
              ))}

              {/* Step 5: SCADA Deduction */}
              {activeItem.scadaApplicable && facesheet.scadaDeductionActive && (
                <tr className="bg-amber-50/50">
                  <td className="text-center font-mono text-amber-600 text-xs">05</td>
                  <td className="font-semibold text-amber-900 text-xs">
                    Deduct SCADA Batching Plant Supervisory Credit
                  </td>
                  <td className="text-xs text-slate-500 font-mono">Official PWD Circular Deduction</td>
                  <td className="text-right font-mono text-xs text-rose-600 tabular-nums-force">
                    -₹{rateResult.scadaDeduction.toFixed(2)}
                  </td>
                  <td className="text-right font-mono font-bold text-xs text-slate-900 tabular-nums-force">—</td>
                </tr>
              )}

              {/* Final Net Ground Floor Rate */}
              <tr className="bg-[#0B1F3A] text-white font-bold">
                <td className="text-center font-mono text-xs text-[#F4762A]">NET</td>
                <td className="text-xs text-white uppercase tracking-wide">
                  Ground Floor Net Unit Rate (R_GF)
                </td>
                <td className="text-xs text-slate-300 font-mono">Carried into Abstract for GF</td>
                <td className="text-right font-mono text-xs text-amber-300 tabular-nums-force">
                  Total Lead: +₹{rateResult.leadSurchargeTotal.toFixed(2)}
                </td>
                <td className="text-right font-mono text-sm text-[#F4762A] tabular-nums-force">
                  ₹{rateResult.groundFloorRate.toFixed(2)}
                </td>
              </tr>

              {/* Floor Escalations */}
              <tr className="bg-slate-50">
                <td className="text-center font-mono text-slate-400 text-xs">1F</td>
                <td className="text-xs text-slate-700">1st Floor Escalated Rate (+1% Lift)</td>
                <td className="text-xs text-slate-500 font-mono">R_GF * 1.01</td>
                <td className="text-right font-mono text-xs text-emerald-600 tabular-nums-force">
                  +₹{(rateResult.groundFloorRate * 0.01).toFixed(2)}
                </td>
                <td className="text-right font-mono font-bold text-xs text-slate-900 tabular-nums-force">
                  ₹{(rateResult.groundFloorRate * 1.01).toFixed(2)}
                </td>
              </tr>
              <tr className="bg-slate-50">
                <td className="text-center font-mono text-slate-400 text-xs">2F</td>
                <td className="text-xs text-slate-700">2nd Floor Escalated Rate (+2% Lift)</td>
                <td className="text-xs text-slate-500 font-mono">R_GF * 1.02</td>
                <td className="text-right font-mono text-xs text-emerald-600 tabular-nums-force">
                  +₹{(rateResult.groundFloorRate * 0.02).toFixed(2)}
                </td>
                <td className="text-right font-mono font-bold text-xs text-slate-900 tabular-nums-force">
                  ₹{(rateResult.groundFloorRate * 1.02).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
