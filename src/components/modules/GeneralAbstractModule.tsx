import React from 'react';
import { useEstimatorStore } from '../../store/useEstimatorStore';
import { Landmark, ShieldCheck, Lock, Unlock, CheckCircle2, Printer } from 'lucide-react';

export const GeneralAbstractModule: React.FC = () => {
  const { facesheet, calculationRollup, updateFacesheet, stamps } = useEstimatorStore();

  const seStamp = stamps.find((s) => s.role === 'SE');
  const sdeStamp = stamps.find((s) => s.role === 'SDE');
  const eeStamp = stamps.find((s) => s.role === 'EE');

  const isLocked = facesheet.status === 'SANCTIONED' || facesheet.status === 'LOCKED';

  const handleToggleLock = () => {
    updateFacesheet({
      status: isLocked ? 'UNDER_REVIEW' : 'SANCTIONED',
    });
  };

  return (
    <div className="space-y-6">
      {/* Official State Header (Visible on screen and print) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center space-y-2 relative overflow-hidden">
        <div className="absolute top-4 right-4 flex items-center space-x-2 no-print">
          <button
            onClick={handleToggleLock}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
              isLocked
                ? 'bg-emerald-600 text-white'
                : 'bg-[#0B1F3A] hover:bg-[#14335C] text-white'
            }`}
          >
            {isLocked ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Technically Sanctioned (Locked)</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 text-amber-400" />
                <span>Grant Technical Sanction</span>
              </>
            )}
          </button>
        </div>

        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          GOVERNMENT OF MAHARASHTRA — PUBLIC WORKS DEPARTMENT
        </div>
        <h2 className="text-xl font-extrabold text-[#0B1F3A] uppercase tracking-wide">
          General Abstract (Recapitulation Sheet)
        </h2>
        <p className="text-xs font-semibold text-slate-700 max-w-3xl mx-auto">
          NAME OF WORK: {facesheet.nameOfWork.toUpperCase()}
        </p>
        <p className="text-[11px] text-slate-500">
          Division: <strong className="text-slate-800">{facesheet.division}</strong> | Circle: <strong className="text-slate-800">{facesheet.circle}</strong> | Financial Year: <strong className="text-slate-800">{facesheet.ssrYear}</strong>
        </p>
      </div>

      {/* Recapitulation Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left dense-table border-collapse">
            <thead>
              <tr>
                <th className="w-16 text-center">Sr. No.</th>
                <th>Statutory Particulars & Accounting Heads</th>
                <th className="w-32 text-center">Schedule / Basis</th>
                <th className="w-20 text-center">Currency</th>
                <th className="w-48 text-right">Financial Value (INR)</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1: Schedule A */}
              <tr>
                <td className="text-center font-mono font-bold text-slate-700 text-xs">01</td>
                <td className="font-semibold text-slate-900 text-xs">
                  CONSTRUCTION WORK ITEMS AS PER ABSTRACT OF COST
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                    Sum of all measured item quantities multiplied by final sanctioned unit rates
                  </div>
                </td>
                <td className="text-center font-mono font-bold text-xs text-[#0B1F3A]">Schedule 'A'</td>
                <td className="text-center font-mono text-xs text-slate-400">Rs.</td>
                <td className="text-right font-mono font-bold text-xs text-slate-900 tabular-nums-force">
                  ₹{calculationRollup.scheduleA_costOfWork.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>

              {/* Row 2: Schedule B Royalty */}
              <tr>
                <td className="text-center font-mono font-bold text-slate-700 text-xs">02</td>
                <td className="font-semibold text-slate-900 text-xs">
                  STATUTORY MINOR MINERAL EXTRACTION ROYALTY
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                    Levied on extracted river sand (₹150/Cu.M) and coarse metal aggregates (₹80/Cu.M)
                  </div>
                </td>
                <td className="text-center font-mono font-bold text-xs text-[#0B1F3A]">Schedule 'B'</td>
                <td className="text-center font-mono text-xs text-slate-400">Rs.</td>
                <td className="text-right font-mono font-bold text-xs text-slate-900 tabular-nums-force">
                  ₹{calculationRollup.scheduleB_royalty.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>

              {/* Row 3: Schedule C Testing */}
              <tr>
                <td className="text-center font-mono font-bold text-slate-700 text-xs">03</td>
                <td className="font-semibold text-slate-900 text-xs">
                  MANDATORY QUALITY CONTROL & LABORATORY TESTING CHARGES
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                    Field laboratory verification as per PWD Handbook Ch. 33 and MORTH Section 1700
                  </div>
                </td>
                <td className="text-center font-mono font-bold text-xs text-[#0B1F3A]">Schedule 'C'</td>
                <td className="text-center font-mono text-xs text-slate-400">Rs.</td>
                <td className="text-right font-mono font-bold text-xs text-slate-900 tabular-nums-force">
                  ₹{calculationRollup.scheduleC_testing.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>

              {/* Row 4: Subtotal Direct Works */}
              <tr className="bg-slate-100 font-bold border-y-2 border-slate-300">
                <td className="text-center font-mono text-slate-800 text-xs">04</td>
                <td className="text-xs text-slate-900 uppercase">
                  Total Direct Construction Works Cost (A + B + C)
                </td>
                <td className="text-center font-mono text-xs text-slate-700">(A + B + C)</td>
                <td className="text-center font-mono text-xs text-slate-400">Rs.</td>
                <td className="text-right font-mono text-xs text-slate-950 tabular-nums-force">
                  ₹{calculationRollup.subtotalDirectWorks.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>

              {/* Row 5: GST */}
              <tr>
                <td className="text-center font-mono text-slate-700 text-xs">05</td>
                <td className="text-xs text-slate-800">
                  Add for Goods & Services Tax (GST @ {facesheet.gstPercent}%) on (A + B)
                </td>
                <td className="text-center font-mono text-xs text-slate-600">18.00 %</td>
                <td className="text-center font-mono text-xs text-slate-400">Rs.</td>
                <td className="text-right font-mono font-semibold text-xs text-slate-900 tabular-nums-force">
                  ₹{calculationRollup.gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>

              {/* Row 6: Contingency */}
              <tr>
                <td className="text-center font-mono text-slate-700 text-xs">06</td>
                <td className="text-xs text-slate-800">
                  Add for Physical Contingencies Provision @ {facesheet.contingencyPercent}% on Direct Works
                </td>
                <td className="text-center font-mono text-xs text-slate-600">2.00 %</td>
                <td className="text-center font-mono text-xs text-slate-400">Rs.</td>
                <td className="text-right font-mono font-semibold text-xs text-slate-900 tabular-nums-force">
                  ₹{calculationRollup.contingencyAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>

              {/* Row 7: Labour Insurance Cess */}
              <tr>
                <td className="text-center font-mono text-slate-700 text-xs">07</td>
                <td className="text-xs text-slate-800">
                  Add for Labour Welfare Cess / Insurance @ {facesheet.laborCessPercent}% on Cost of Work 'A'
                </td>
                <td className="text-center font-mono text-xs text-slate-600">{facesheet.laborCessPercent} %</td>
                <td className="text-center font-mono text-xs text-slate-400">Rs.</td>
                <td className="text-right font-mono font-semibold text-xs text-slate-900 tabular-nums-force">
                  ₹{calculationRollup.laborCessAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>

              {/* Row 8: Electrification */}
              {calculationRollup.electrificationAmount > 0 && (
                <tr>
                  <td className="text-center font-mono text-slate-700 text-xs">08</td>
                  <td className="text-xs text-slate-800">
                    Add for Electrical Works / Electrification Provision
                  </td>
                  <td className="text-center font-mono text-xs text-slate-600">Lump-Sum</td>
                  <td className="text-center font-mono text-xs text-slate-400">Rs.</td>
                  <td className="text-right font-mono font-semibold text-xs text-slate-900 tabular-nums-force">
                    ₹{calculationRollup.electrificationAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              )}

              {/* Row 9: Total Projected Cost */}
              <tr className="bg-slate-50">
                <td className="text-center font-mono text-slate-700 text-xs">—</td>
                <td className="font-semibold text-xs text-slate-800 uppercase">
                  Total Projected Estimate Cost
                </td>
                <td className="text-center font-mono text-xs text-slate-500">Gross Total</td>
                <td className="text-center font-mono text-xs text-slate-400">Rs.</td>
                <td className="text-right font-mono font-bold text-xs text-slate-900 tabular-nums-force">
                  ₹{calculationRollup.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>

              {/* Row 10: Sanctioned Budget Total */}
              <tr className="bg-[#0B1F3A] text-white border-t-2 border-[#F4762A]">
                <td className="text-center font-mono font-bold text-xs text-[#F4762A]">FINAL</td>
                <td className="font-bold text-sm text-white uppercase tracking-wider">
                  Sanctioned Budget (Rounded Off to Nearest Rupee)
                </td>
                <td className="text-center font-mono text-xs text-amber-300 font-bold">T/S SANCTION</td>
                <td className="text-center font-mono text-xs text-slate-300">Rs.</td>
                <td className="text-right font-mono font-bold text-base text-[#F4762A] tabular-nums-force">
                  ₹{calculationRollup.sanctionedTotal.toLocaleString('en-IN')}/-
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Budget Word Banner */}
        <div className="bg-[#071426] text-white p-4 border-t border-[#14335C] flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="text-xs text-slate-300 font-medium">
            (Rupees In Words: <strong className="text-amber-300 font-semibold">{calculationRollup.formattedLakhs}</strong>)
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Statutorily Compliant with Maharashtra PWD Accounts Code</span>
          </div>
        </div>
      </div>

      {/* Official Triple Signature Block (Page-Break Avoid) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6 page-break-inside-avoid">
        <div className="text-center font-bold text-xs text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">
          Official Engineering Approval & Technical Sanction Authority Blocks
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {/* Sectional Engineer Stamp */}
          <div className="border border-slate-200 rounded-lg p-4 text-center space-y-2 bg-slate-50/50">
            <div className="h-16 flex items-end justify-center border-b border-dashed border-slate-300 pb-2">
              <span className="text-[10px] text-slate-400 italic">[Signed Digitally]</span>
            </div>
            <div>
              <div className="text-xs font-bold text-[#0B1F3A]">{seStamp?.name}</div>
              <div className="text-[11px] font-semibold text-slate-600">{seStamp?.designation}</div>
              <div className="text-[10px] text-slate-500">{seStamp?.subDivision}</div>
              <span className="inline-block mt-2 text-[9px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded uppercase">
                Prepared By
              </span>
            </div>
          </div>

          {/* Sub-Divisional Engineer Stamp */}
          <div className="border border-slate-200 rounded-lg p-4 text-center space-y-2 bg-slate-50/50">
            <div className="h-16 flex items-end justify-center border-b border-dashed border-slate-300 pb-2">
              <span className="text-[10px] text-slate-400 italic">[Verified & Endorsed]</span>
            </div>
            <div>
              <div className="text-xs font-bold text-[#0B1F3A]">{sdeStamp?.name}</div>
              <div className="text-[11px] font-semibold text-slate-600">{sdeStamp?.designation}</div>
              <div className="text-[10px] text-slate-500">{sdeStamp?.subDivision}</div>
              <span className="inline-block mt-2 text-[9px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded uppercase">
                Checked & Verified
              </span>
            </div>
          </div>

          {/* Executive Engineer Stamp */}
          <div className="border-2 border-[#0B1F3A] rounded-lg p-4 text-center space-y-2 bg-slate-50">
            <div className="h-16 flex items-end justify-center border-b border-dashed border-slate-300 pb-2">
              <span className="text-[10px] text-emerald-700 font-bold font-mono">
                {isLocked ? '✓ TECHNICALLY SANCTIONED' : '[Pending Final Sanction]'}
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-[#0B1F3A]">{eeStamp?.name}</div>
              <div className="text-[11px] font-semibold text-slate-600">{eeStamp?.designation}</div>
              <div className="text-[10px] text-slate-500">{eeStamp?.subDivision}</div>
              <span className="inline-block mt-2 text-[9px] bg-[#0B1F3A] text-white font-bold px-2.5 py-0.5 rounded uppercase">
                Technical Sanction Authority
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
