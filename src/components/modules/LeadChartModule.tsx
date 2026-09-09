import React, { useState } from 'react';
import { useEstimatorStore } from '../../store/useEstimatorStore';
import { Truck, Info, HelpCircle } from 'lucide-react';

export const LeadChartModule: React.FC = () => {
  const { leadSettings, updateLeadSetting } = useEstimatorStore();
  const [selectedAuditMaterial, setSelectedAuditMaterial] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-[#F4762A] uppercase tracking-wider">
            Quarry Haulage & Carriage Rates (Statement C-1)
          </span>
          <h2 className="text-xl font-bold text-[#0B1F3A]">Quarry Lead Chart</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Non-linear distance slab lookup bands for quarried aggregates, sand, bricks and flat bitumen carriage (₹10 / MT / km).
          </p>
        </div>
        <div className="bg-[#0B1F3A] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5">
          <Truck className="w-4 h-4 text-[#F4762A]" />
          <span>Statement C-1 Auto-Lookup</span>
        </div>
      </div>

      {/* 13-Row Lead Ledger */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left dense-table border-collapse">
            <thead>
              <tr>
                <th className="w-12 text-center">Sr.</th>
                <th className="w-64">Construction Material Entity</th>
                <th className="w-24">Unit</th>
                <th>Approved Source Quarry / Supply Depot</th>
                <th className="w-36 text-right">Lead Distance (km)</th>
                <th className="w-44 text-right">Statement C-1 Rate (₹/unit)</th>
                <th className="w-24 text-center">Audit Trail</th>
              </tr>
            </thead>
            <tbody>
              {leadSettings.map((lead, idx) => (
                <tr key={lead.materialId} className="hover:bg-slate-50">
                  <td className="text-center font-mono text-slate-400 text-xs">
                    {String(idx + 1).padStart(2, '0')}
                  </td>

                  {/* Material Name */}
                  <td className="font-semibold text-slate-800 text-xs">
                    {lead.materialName}
                  </td>

                  {/* Unit */}
                  <td className="text-xs text-slate-500 font-mono">
                    {lead.unit}
                  </td>

                  {/* Source Quarry */}
                  <td>
                    <input
                      type="text"
                      value={lead.sourceQuarry}
                      onChange={(e) =>
                        updateLeadSetting(lead.materialId, lead.distanceKm, e.target.value)
                      }
                      className="w-full text-xs p-1 rounded border border-slate-200 focus:border-[#0B1F3A] outline-none"
                    />
                  </td>

                  {/* Distance (km) */}
                  <td>
                    <div className="flex items-center justify-end space-x-1">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={lead.distanceKm}
                        onChange={(e) =>
                          updateLeadSetting(
                            lead.materialId,
                            parseFloat(e.target.value) || 0,
                            lead.sourceQuarry
                          )
                        }
                        className="w-24 text-xs text-right font-mono font-bold p-1 rounded border border-slate-200 focus:border-[#0B1F3A] outline-none tabular-nums-force"
                      />
                      <span className="text-xs text-slate-400 font-medium">km</span>
                    </div>
                  </td>

                  {/* Calculated C-1 Rate */}
                  <td className="text-right font-mono font-bold text-xs tabular-nums-force text-[#0B1F3A] bg-slate-50/50">
                    ₹{lead.calculatedRate.toFixed(2)}
                  </td>

                  {/* Audit Trail Button */}
                  <td className="text-center">
                    <button
                      onClick={() =>
                        setSelectedAuditMaterial(
                          selectedAuditMaterial === lead.materialId ? null : lead.materialId
                        )
                      }
                      className="text-slate-400 hover:text-[#F4762A] p-1 rounded hover:bg-slate-100"
                      title="View step calculation breakdown"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Trail Explanation Drawer / Box */}
      {selectedAuditMaterial && (
        <div className="bg-[#0B1F3A] text-white p-5 rounded-xl border border-[#14335C] space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-[#F4762A] font-bold">
            <HelpCircle className="w-4 h-4" />
            <span>
              Statement C-1 Non-Linear Mathematical Breakdown:{' '}
              {leadSettings.find((l) => l.materialId === selectedAuditMaterial)?.materialName}
            </span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Haulage rates under Maharashtra PWD SSR Statement C-1 are computed using non-linear step intervals:
            <br />
            • <strong>0 to 1 km:</strong> Base fixed loading and minimum haulage rate.
            <br />
            • <strong>1 to 5 km:</strong> Incremental step surcharge per additional kilometer (₹13.75 / km).
            <br />
            • <strong>5 to 30 km:</strong> Base at 5 km (₹165.00) + (D - 5) × ₹12.50 / km.
            <br />
            • <strong>Above 30 km:</strong> Base at 30 km (₹477.50) + (D - 30) × ₹10.00 / km.
            <br />
            • <em>Bitumen Exception:</em> Governed by standard flat carrier rate (₹10.00 / MT / km).
          </p>
        </div>
      )}
    </div>
  );
};
