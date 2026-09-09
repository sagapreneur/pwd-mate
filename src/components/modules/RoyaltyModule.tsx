import React from 'react';
import { useEstimatorStore } from '../../store/useEstimatorStore';
import { explodeMaterialConsumption, calculateMineralRoyalty } from '../../engine/calculationEngine';
import { Coins, ShieldAlert } from 'lucide-react';

export const RoyaltyModule: React.FC = () => {
  const { items, calculationRollup } = useEstimatorStore();

  const { materialTotals } = explodeMaterialConsumption(items);
  const { royaltyRows, totalRoyalty } = calculateMineralRoyalty(materialTotals);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-[#F4762A] uppercase tracking-wider">
            Statutory Minor Mineral Extraction Levies / Schedule 'B'
          </span>
          <h2 className="text-xl font-bold text-[#0B1F3A]">Statutory Royalty Statement</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Governed by Maharashtra Minor Mineral Extraction Rules: Natural Sand (₹150 / Cu.M), Coarse Aggregates & Murum (₹80 / Cu.M).
          </p>
        </div>
        <div className="bg-[#071426] text-white px-5 py-2.5 rounded-lg border border-[#F4762A] text-right">
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Schedule B (Total Royalty)
          </div>
          <div className="text-xl font-bold text-[#F4762A] tabular-nums-force">
            ₹{totalRoyalty.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Royalty Statement Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left dense-table border-collapse">
            <thead>
              <tr>
                <th className="w-12 text-center">Sr.</th>
                <th>Naturally Extracted Mineral Entity</th>
                <th className="w-36 text-right">Derived Net Volume (Cu.M)</th>
                <th className="w-36 text-right">Statutory Royalty Rate (₹/Cu.M)</th>
                <th className="w-44 text-right">Total Royalty Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {royaltyRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs text-slate-400">
                    No minor minerals (sand, stone aggregates, murum) extracted in current items.
                  </td>
                </tr>
              ) : (
                royaltyRows.map((row, idx) => (
                  <tr key={row.materialId} className="hover:bg-slate-50">
                    <td className="text-center font-mono text-slate-400 text-xs">
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td className="font-semibold text-slate-800 text-xs">{row.materialName}</td>
                    <td className="text-right font-mono font-bold text-xs text-slate-900 tabular-nums-force">
                      {row.volumeCuM.toFixed(3)}
                    </td>
                    <td className="text-right font-mono text-xs text-slate-600 tabular-nums-force">
                      ₹{row.royaltyRate.toFixed(2)}
                    </td>
                    <td className="text-right font-mono font-bold text-xs text-[#0B1F3A] tabular-nums-force bg-slate-50/50">
                      ₹{row.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Schedule B Footer */}
        <div className="bg-[#0B1F3A] text-white p-4 flex items-center justify-between border-t border-[#14335C]">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
            <Coins className="w-4 h-4 text-[#F4762A]" />
            <span>Schedule 'B' Total Statutory Minor Mineral Royalty:</span>
          </div>
          <div className="text-lg font-bold text-[#F4762A] tabular-nums-force">
            ₹{totalRoyalty.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
};
