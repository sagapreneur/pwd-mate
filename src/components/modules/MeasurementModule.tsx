import React from 'react';
import { useEstimatorStore } from '../../store/useEstimatorStore';
import { FloorTag } from '../../types/estimator';
import { Plus, Trash2, Copy, AlertTriangle, Layers, ArrowRight } from 'lucide-react';

export const MeasurementModule: React.FC = () => {
  const {
    items,
    addMeasurementRow,
    updateMeasurementRow,
    removeMeasurementRow,
    duplicateMeasurementRow,
    removeItem,
    setActiveTab,
  } = useEstimatorStore();

  const floorOptions: { value: FloorTag; label: string }[] = [
    { value: 'BASEMENT', label: 'Basement' },
    { value: 'GF', label: 'Ground Floor (GF)' },
    { value: '1F', label: '1st Floor (+1%)' },
    { value: '2F', label: '2nd Floor (+2%)' },
    { value: '3F', label: '3rd Floor (+3%)' },
    { value: '4F', label: '4th Floor (+4%)' },
  ];

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <Layers className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#0B1F3A]">No Estimate Items Added Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Browse the SSR 2022-23 catalog to select schedule items (Excavation, Concrete, Steel, Masonry) and start taking off dimensional measurements.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('catalog')}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#F4762A] hover:bg-[#D65F14] text-white text-xs font-bold shadow transition-all"
        >
          <span>Open SSR Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-[#F4762A] uppercase tracking-wider">
            Detailed Dimensional Take-Offs
          </span>
          <h2 className="text-xl font-bold text-[#0B1F3A]">Measurement Sheet Ledger</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log geometric quantities with floor-wise escalations and structural deduction opening voids ($N = -1$).
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className="flex items-center space-x-1 px-3 py-1.5 rounded bg-[#0B1F3A] hover:bg-[#14335C] text-white text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5 text-[#F4762A]" />
            <span>Add More Items</span>
          </button>
        </div>
      </div>

      {/* Items Measurement Grids */}
      <div className="space-y-6">
        {items.map((item, itemIdx) => {
          // Compute totals
          let grossAddition = 0.0;
          let deductionTotal = 0.0;

          item.measurements.forEach((m) => {
            if (m.isDeduction || m.computedQty < 0) {
              deductionTotal += Math.abs(m.computedQty);
            } else {
              grossAddition += m.computedQty;
            }
          });

          const netQuantity = Number((grossAddition - deductionTotal).toFixed(4));

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
              {/* Item Banner */}
              <div className="bg-[#0B1F3A] text-white p-3.5 flex items-center justify-between border-b border-[#14335C]">
                <div className="flex items-center space-x-3 max-w-3xl">
                  <span className="bg-[#F4762A] text-white font-mono font-bold text-xs px-2 py-0.5 rounded shadow-sm shrink-0">
                    Item {item.itemCode}
                  </span>
                  <div className="truncate">
                    <span className="text-xs font-semibold text-white">{item.description}</span>
                    <span className="text-[11px] text-slate-300 ml-2">
                      [Unit: <strong className="text-white">{item.unit}</strong> | Base Rate: <strong className="text-amber-300">₹{item.baseRate.toFixed(2)}</strong>]
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
                    Net Qty: {netQuantity} {item.unit}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                    title="Remove item from estimate"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Data Grid */}
              <div className="overflow-x-auto">
                <table className="w-full text-left dense-table border-collapse">
                  <thead>
                    <tr>
                      <th className="w-12 text-center">#</th>
                      <th className="w-32">Floor Elevation</th>
                      <th>Sub-Item Detail Description</th>
                      <th className="w-24 text-center">Mode</th>
                      <th className="w-20 text-right">No (N)</th>
                      <th className="w-24 text-right">Length (m)</th>
                      <th className="w-24 text-right">Breadth (m)</th>
                      <th className="w-24 text-right">Depth/Ht (m)</th>
                      <th className="w-28 text-right">Computed Qty</th>
                      <th className="w-20 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.measurements.map((row, rowIdx) => {
                      const isDeduct = row.isDeduction || row.multiplier < 0;

                      return (
                        <tr
                          key={row.id}
                          className={isDeduct ? 'bg-amber-50/70 hover:bg-amber-100/70' : ''}
                        >
                          <td className="text-center font-mono text-slate-400 text-xs">
                            {String(rowIdx + 1).padStart(2, '0')}
                          </td>

                          {/* Floor Tag */}
                          <td>
                            <select
                              value={row.floorTag}
                              onChange={(e) =>
                                updateMeasurementRow(item.id, row.id, {
                                  floorTag: e.target.value as FloorTag,
                                })
                              }
                              className="w-full text-[11px] p-1 rounded border border-slate-300 bg-white font-semibold text-slate-700"
                            >
                              {floorOptions.map((f) => (
                                <option key={f.value} value={f.value}>
                                  {f.label}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Sub-Item Label */}
                          <td>
                            <input
                              type="text"
                              value={row.label}
                              onChange={(e) =>
                                updateMeasurementRow(item.id, row.id, { label: e.target.value })
                              }
                              placeholder="e.g. Main Column Footing, Porch, Deduct Door Opening..."
                              className="w-full text-xs p-1 rounded border border-slate-200 focus:border-[#0B1F3A] outline-none"
                            />
                          </td>

                          {/* Deduction Toggle Mode */}
                          <td className="text-center">
                            <button
                              type="button"
                              onClick={() =>
                                updateMeasurementRow(item.id, row.id, {
                                  isDeduction: !row.isDeduction,
                                  multiplier: !row.isDeduction ? -Math.abs(row.multiplier || 1) : Math.abs(row.multiplier || 1),
                                })
                              }
                              className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all ${
                                isDeduct
                                  ? 'bg-[#FDEBDD] text-[#D65F14] border border-[#F4762A]'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {isDeduct ? 'DEDUCT (-)' : 'ADD (+)'}
                            </button>
                          </td>

                          {/* Multiplier (N) */}
                          <td>
                            <input
                              type="number"
                              step="any"
                              value={row.multiplier}
                              onChange={(e) =>
                                updateMeasurementRow(item.id, row.id, {
                                  multiplier: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-full text-xs text-right font-mono p-1 rounded border border-slate-200 tabular-nums-force"
                            />
                          </td>

                          {/* Length (L) */}
                          <td>
                            <input
                              type="number"
                              step="0.001"
                              value={row.length}
                              onChange={(e) =>
                                updateMeasurementRow(item.id, row.id, {
                                  length: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-full text-xs text-right font-mono p-1 rounded border border-slate-200 tabular-nums-force"
                            />
                          </td>

                          {/* Breadth (B) */}
                          <td>
                            <input
                              type="number"
                              step="0.001"
                              value={row.breadth}
                              onChange={(e) =>
                                updateMeasurementRow(item.id, row.id, {
                                  breadth: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-full text-xs text-right font-mono p-1 rounded border border-slate-200 tabular-nums-force"
                            />
                          </td>

                          {/* Depth/Height (D) */}
                          <td>
                            <input
                              type="number"
                              step="0.001"
                              value={row.depth}
                              onChange={(e) =>
                                updateMeasurementRow(item.id, row.id, {
                                  depth: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-full text-xs text-right font-mono p-1 rounded border border-slate-200 tabular-nums-force"
                            />
                          </td>

                          {/* Computed Qty */}
                          <td
                            className={`text-right font-mono font-bold text-xs tabular-nums-force pr-2 ${
                              isDeduct ? 'text-[#D65F14]' : 'text-[#0B1F3A]'
                            }`}
                          >
                            {row.computedQty.toFixed(3)}
                          </td>

                          {/* Row Actions */}
                          <td className="text-center space-x-1">
                            <button
                              onClick={() => duplicateMeasurementRow(item.id, row.id)}
                              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded"
                              title="Duplicate row"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => removeMeasurementRow(item.id, row.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Grid Footer Subtotals */}
              <div className="bg-slate-50 p-3 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <button
                  onClick={() => addMeasurementRow(item.id)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0B1F3A] hover:bg-[#14335C] text-white text-xs font-semibold shadow-sm w-fit"
                >
                  <Plus className="w-3.5 h-3.5 text-[#F4762A]" />
                  <span>+ Add Dimension Row</span>
                </button>

                <div className="flex items-center space-x-4 font-mono font-semibold text-slate-600">
                  <span>Gross: <strong className="text-slate-900">{grossAddition.toFixed(3)}</strong></span>
                  {deductionTotal > 0 && (
                    <span className="text-[#D65F14]">
                      Deductions: <strong>-{deductionTotal.toFixed(3)}</strong>
                    </span>
                  )}
                  <span className="bg-[#FDEBDD] text-[#D65F14] px-2.5 py-1 rounded border border-[#F4762A]">
                    Net Total: <strong>{netQuantity} {item.unit}</strong>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
