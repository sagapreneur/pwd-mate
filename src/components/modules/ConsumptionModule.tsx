import React from 'react';
import { useEstimatorStore } from '../../store/useEstimatorStore';
import { explodeMaterialConsumption } from '../../engine/calculationEngine';
import { Layers, Package, Cuboid as Cube } from 'lucide-react';

export const ConsumptionModule: React.FC = () => {
  const { items } = useEstimatorStore();

  const { materialRows, materialTotals } = explodeMaterialConsumption(items);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-[#F4762A] uppercase tracking-wider">
            Bill of Materials & Consumption Factor Matrix
          </span>
          <h2 className="text-xl font-bold text-[#0B1F3A]">Material Consumption Statement</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Explodes measured item volumes across 18 construction materials with automatic zero-factor exclusion.
          </p>
        </div>
        <div className="bg-[#0B1F3A] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5">
          <Layers className="w-4 h-4 text-[#F4762A]" />
          <span>CF Explosion Matrix</span>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(materialTotals).slice(0, 8).map(([matId, data]) => (
          <div key={matId} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
              {data.materialName}
            </span>
            <div className="text-xl font-bold text-[#0B1F3A] tabular-nums-force mt-1">
              {data.totalQty.toLocaleString('en-IN')} <span className="text-xs font-semibold text-slate-500">{data.unit}</span>
            </div>
            {matId === 'CEMENT' && (
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                ≈ {(data.totalQty * 0.05).toFixed(2)} Metric Tonnes
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Item-Wise Breakdown Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-xs text-[#0B1F3A] uppercase tracking-wider">
            Item-by-Item Resource Explosion Table
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {materialRows.length} active resource derivations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left dense-table border-collapse">
            <thead>
              <tr>
                <th className="w-20">Item Code</th>
                <th>Work Specification</th>
                <th className="w-28 text-right">Item Qty</th>
                <th className="w-16 text-center">Unit</th>
                <th className="w-48">Constituent Material</th>
                <th className="w-28 text-right">Factor (CF)</th>
                <th className="w-32 text-right">Net Derived Qty</th>
                <th className="w-20 text-center">Mat Unit</th>
              </tr>
            </thead>
            <tbody>
              {materialRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="font-mono font-bold text-xs text-[#0B1F3A]">
                    {row.itemCode}
                  </td>
                  <td className="text-xs text-slate-700 truncate max-w-md">
                    {row.description}
                  </td>
                  <td className="text-right font-mono text-xs text-slate-700 tabular-nums-force">
                    {row.itemQty.toFixed(3)}
                  </td>
                  <td className="text-center font-mono text-xs text-slate-500">{row.unit}</td>
                  <td className="font-semibold text-xs text-slate-800">{row.materialName}</td>
                  <td className="text-right font-mono text-xs text-slate-600 tabular-nums-force">
                    {row.factor.toFixed(3)}
                  </td>
                  <td className="text-right font-mono font-bold text-xs text-[#F4762A] tabular-nums-force bg-amber-50/50">
                    {row.derivedQty.toFixed(3)}
                  </td>
                  <td className="text-center font-mono text-xs text-slate-500">{row.materialUnit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
