import React from 'react';
import { useEstimatorStore } from '../../store/useEstimatorStore';
import { calculateDynamicItemRate } from '../../engine/calculationEngine';
import { ListOrdered, Printer, Download } from 'lucide-react';

export const AbstractModule: React.FC = () => {
  const { items, leadSettings, facesheet, calculationRollup } = useEstimatorStore();

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500 text-xs">
        No items in estimate. Add items from the SSR Catalog to view the Abstract of Cost.
      </div>
    );
  }

  // Compile Abstract Rows (split by floor)
  const abstractRows: {
    sr: number;
    itemCode: string;
    description: string;
    unit: string;
    floorTag: string;
    qty: number;
    rate: number;
    amount: number;
  }[] = [];

  let srCounter = 1;

  items.forEach((item) => {
    // Group measurements by floor
    const floorGroups: Record<string, number> = {};
    item.measurements.forEach((m) => {
      floorGroups[m.floorTag] = (floorGroups[m.floorTag] || 0) + m.computedQty;
    });

    Object.entries(floorGroups).forEach(([floorTag, qty]) => {
      if (qty !== 0) {
        const rateResult = calculateDynamicItemRate(
          item.baseRate,
          leadSettings,
          item.consumptionFactors,
          facesheet.areaSurchargePercent,
          floorTag,
          item.scadaApplicable,
          facesheet.scadaDeductionActive,
          facesheet.scadaDeductionAmount,
          item.bitumenQtyPerUnit,
          facesheet.currentBitumenRate,
          facesheet.ssrBitumenRate
        );

        const amount = Number((qty * rateResult.finalRate).toFixed(2));

        abstractRows.push({
          sr: srCounter++,
          itemCode: item.itemCode,
          description: item.description,
          unit: item.unit,
          floorTag,
          qty: Number(qty.toFixed(3)),
          rate: rateResult.finalRate,
          amount,
        });
      }
    });
  });

  const totalCostOfWork = abstractRows.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-[#F4762A] uppercase tracking-wider">
            Bill of Quantities / Schedule 'A'
          </span>
          <h2 className="text-xl font-bold text-[#0B1F3A]">Abstract of Cost Ledger</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Consolidated item quantities with floor-split unit rates and itemized financial commitments.
          </p>
        </div>
        <div className="bg-[#071426] text-white px-5 py-2.5 rounded-lg border border-[#F4762A] text-right">
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Schedule A (Cost of Work)
          </div>
          <div className="text-xl font-bold text-[#F4762A] tabular-nums-force">
            ₹{totalCostOfWork.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Abstract Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left dense-table border-collapse">
            <thead>
              <tr>
                <th className="w-12 text-center">Sr.</th>
                <th className="w-24">Item Code</th>
                <th>Standard Specification Description</th>
                <th className="w-20 text-center">Floor</th>
                <th className="w-28 text-right">Measured Qty</th>
                <th className="w-20 text-center">Unit</th>
                <th className="w-32 text-right">Final Unit Rate (₹)</th>
                <th className="w-36 text-right">Total Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {abstractRows.map((row) => (
                <tr key={`${row.itemCode}-${row.floorTag}`} className="hover:bg-slate-50">
                  <td className="text-center font-mono text-slate-400 text-xs">
                    {String(row.sr).padStart(2, '0')}
                  </td>

                  {/* Item Code Badge */}
                  <td>
                    <span className="bg-[#0B1F3A] text-white text-[11px] font-bold px-2 py-0.5 rounded font-mono">
                      {row.itemCode}
                    </span>
                  </td>

                  {/* Specification */}
                  <td className="text-xs text-slate-800 leading-relaxed font-normal">
                    {row.description}
                  </td>

                  {/* Floor Badge */}
                  <td className="text-center">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                        row.floorTag === 'GF'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-[#FDEBDD] text-[#D65F14]'
                      }`}
                    >
                      {row.floorTag}
                    </span>
                  </td>

                  {/* Measured Quantity */}
                  <td className="text-right font-mono font-bold text-xs text-slate-900 tabular-nums-force">
                    {row.qty.toFixed(3)}
                  </td>

                  {/* Unit */}
                  <td className="text-center font-mono text-xs text-slate-500">{row.unit}</td>

                  {/* Final Rate */}
                  <td className="text-right font-mono font-bold text-xs text-slate-900 tabular-nums-force">
                    ₹{row.rate.toFixed(2)}
                  </td>

                  {/* Total Amount */}
                  <td className="text-right font-mono font-bold text-xs text-[#0B1F3A] tabular-nums-force bg-slate-50/50">
                    ₹{row.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Abstract Grand Total Footer */}
        <div className="bg-[#0B1F3A] text-white p-4 flex items-center justify-between border-t border-[#14335C]">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
            <ListOrdered className="w-4 h-4 text-[#F4762A]" />
            <span>Schedule 'A' Total Cost of Civil Work Items:</span>
          </div>
          <div className="text-right flex items-center space-x-4">
            <span className="text-xs text-slate-300 font-mono">
              (Rs. {(totalCostOfWork / 100000).toFixed(2)} Lakhs)
            </span>
            <span className="text-lg font-bold text-[#F4762A] tabular-nums-force">
              ₹{totalCostOfWork.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
