import React from 'react';
import { useEstimatorStore } from '../../store/useEstimatorStore';
import { explodeMaterialConsumption, calculateTestingRegister } from '../../engine/calculationEngine';
import { FlaskConical, ShieldCheck } from 'lucide-react';

export const TestingRegisterModule: React.FC = () => {
  const { items } = useEstimatorStore();

  const { materialTotals } = explodeMaterialConsumption(items);
  const { testRows, totalTestingCost } = calculateTestingRegister(materialTotals);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-[#F4762A] uppercase tracking-wider">
            Quality Control & Laboratory Testing Compliance / Schedule 'C'
          </span>
          <h2 className="text-xl font-bold text-[#0B1F3A]">Material Testing Frequency (MTF) Register</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mandatory test series derived under Maharashtra PWD Handbook (Ch. 33), MORTH (Section 1700) and IS Standards.
          </p>
        </div>
        <div className="bg-[#071426] text-white px-5 py-2.5 rounded-lg border border-[#F4762A] text-right">
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Schedule C (Testing Fees)
          </div>
          <div className="text-xl font-bold text-[#F4762A] tabular-nums-force">
            ₹{totalTestingCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* MTF Register Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left dense-table border-collapse">
            <thead>
              <tr>
                <th className="w-12 text-center">Sr.</th>
                <th className="w-48">Material Category</th>
                <th>Mandatory Laboratory Test Series</th>
                <th className="w-44">Governing Code</th>
                <th className="w-28 text-right">Cumulative Qty</th>
                <th className="w-24 text-center">Required Tests</th>
                <th className="w-32 text-right">Fee / Test (₹)</th>
                <th className="w-36 text-right">Total Test Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              {testRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-xs text-slate-400">
                    No items requiring laboratory quality testing in current estimate.
                  </td>
                </tr>
              ) : (
                testRows.map((row, idx) => (
                  <tr key={row.materialId} className="hover:bg-slate-50">
                    <td className="text-center font-mono text-slate-400 text-xs">
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td className="font-semibold text-slate-800 text-xs">{row.materialName}</td>
                    <td className="text-xs text-slate-700 leading-tight">
                      <div className="font-medium text-[#0B1F3A]">{row.testSeriesName}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Threshold: 1 test per {row.threshold} units & part thereof
                      </div>
                    </td>
                    <td className="text-[11px] font-mono text-slate-500">{row.standard}</td>
                    <td className="text-right font-mono font-bold text-xs text-slate-800 tabular-nums-force">
                      {row.totalVolume.toFixed(2)}
                    </td>
                    <td className="text-center">
                      <span className="bg-[#0B1F3A] text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
                        {row.batchesCount} {row.batchesCount === 1 ? 'Test' : 'Tests'}
                      </span>
                    </td>
                    <td className="text-right font-mono text-xs text-slate-600 tabular-nums-force">
                      ₹{row.feePerBatch.toLocaleString('en-IN')}
                    </td>
                    <td className="text-right font-mono font-bold text-xs text-[#0B1F3A] tabular-nums-force bg-slate-50/50">
                      ₹{row.totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Schedule C Footer */}
        <div className="bg-[#0B1F3A] text-white p-4 flex items-center justify-between border-t border-[#14335C]">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
            <FlaskConical className="w-4 h-4 text-[#F4762A]" />
            <span>Schedule 'C' Total Quality Control Testing Fees:</span>
          </div>
          <div className="text-lg font-bold text-[#F4762A] tabular-nums-force">
            ₹{totalTestingCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
};
