import React from 'react';
import { useEstimatorStore } from '../../store/useEstimatorStore';
import { MAHA_REGIONS, MAHA_CIRCLES, MAHA_DIVISIONS, MAHA_SUBDIVISIONS, AREA_SURCHARGE_MAP } from '../../data/ssrMaster';
import { AreaSurchargeType } from '../../types/estimator';
import { Building, Landmark, Scale, FileText, CheckCircle2 } from 'lucide-react';

export const FacesheetModule: React.FC = () => {
  const { facesheet, updateFacesheet, calculationRollup } = useEstimatorStore();

  const circles = MAHA_CIRCLES[facesheet.region] || [];
  const divisions = MAHA_DIVISIONS[facesheet.circle] || ['Public Works Division, Wardha'];
  const subdivisions = MAHA_SUBDIVISIONS[facesheet.division] || ['P.W. Sub-Division No. 1, Wardha'];

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-[#F4762A] uppercase tracking-wider">
            Administrative Project Scoping & Facesheet
          </span>
          <h2 className="text-xl font-bold text-[#0B1F3A] mt-1">{facesheet.nameOfWork}</h2>
          <p className="text-xs text-slate-500 mt-1">
            Governing Schedule: <span className="font-semibold text-slate-700">{facesheet.ssrYear}</span> | Accounting Classification: <span className="font-semibold text-slate-700">{facesheet.majorHead}</span>
          </p>
        </div>
        <div className="bg-[#071426] text-white px-5 py-3 rounded-lg border border-[#F4762A] text-right">
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Sanctioned Estimate</div>
          <div className="text-2xl font-bold text-[#F4762A] tabular-nums-force">
            ₹{calculationRollup.sanctionedTotal.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-300 font-medium">({calculationRollup.formattedLakhs})</div>
        </div>
      </div>

      {/* Card 0: Project Work Title & Scope */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-[#0B1F3A] font-bold text-sm">
            <FileText className="w-4 h-4 text-[#F4762A]" />
            <span>0. Project Work Title & Scope (कामाचे नाव व तपशील)</span>
          </div>
          <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 font-semibold px-2 py-0.5 rounded">
            Editable — Updates all print sheets, MB, Schedule B & TS
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0B1F3A] mb-1.5 flex items-center justify-between">
              <span>Name of Work (कामाचे नाव / शीर्षक) *</span>
              <span className="text-[10px] text-slate-400 font-normal">Full official description as per A/A and TS</span>
            </label>
            <textarea
              rows={2}
              value={facesheet.nameOfWork}
              onChange={(e) => updateFacesheet({ nameOfWork: e.target.value })}
              placeholder="Enter official work title, e.g. Construction of Two Wheeler Parking Stand Shed at S.P. Office, Wardha..."
              className="w-full text-xs p-3 rounded-lg border-2 border-slate-300 focus:border-[#F4762A] focus:ring-2 focus:ring-[#F4762A]/20 outline-none font-semibold text-slate-800 leading-relaxed shadow-inner"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">SSR Schedule Year</label>
              <select
                value={facesheet.ssrYear}
                onChange={(e) => updateFacesheet({ ssrYear: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white font-bold text-[#0B1F3A]"
              >
                <option value="2022-23">SSR 2022-23 (Standard)</option>
                <option value="2023-24">SSR 2023-24 (Maharashtra)</option>
                <option value="2024-25">SSR 2024-25 (Latest)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Approval Status</label>
              <select
                value={facesheet.status}
                onChange={(e) => updateFacesheet({ status: e.target.value as any })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white font-bold"
              >
                <option value="DRAFT">DRAFT (मसुदा)</option>
                <option value="UNDER_REVIEW">UNDER REVIEW (तपासणी)</option>
                <option value="SANCTIONED">SANCTIONED (मंजूर)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Outward No. (जावक क्र.)</label>
              <input
                type="text"
                value={facesheet.outwardNo || ''}
                onChange={(e) => updateFacesheet({ outwardNo: e.target.value })}
                placeholder="उदा. जा.क्र./सा.बां./२०२४/____"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Letter Date (पत्र दिनांक)</label>
              <input
                type="text"
                value={facesheet.letterDate || ''}
                onChange={(e) => updateFacesheet({ letterDate: e.target.value })}
                placeholder="उदा. २०/१०/२०२४"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Jurisdiction & Accounting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: PWD Jurisdictional Hierarchy */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center space-x-2 text-[#0B1F3A] font-bold text-sm border-b border-slate-100 pb-3">
            <Building className="w-4 h-4 text-[#F4762A]" />
            <span>1. PWD Territorial Jurisdiction (Cascading)</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Public Works Region</label>
              <select
                value={facesheet.region}
                onChange={(e) => updateFacesheet({ region: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0B1F3A] outline-none"
              >
                {MAHA_REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Public Works Circle</label>
              <select
                value={facesheet.circle}
                onChange={(e) => updateFacesheet({ circle: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0B1F3A] outline-none"
              >
                {circles.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Public Works Division</label>
              <select
                value={facesheet.division}
                onChange={(e) => updateFacesheet({ division: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0B1F3A] outline-none"
              >
                {divisions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sub-Division Jurisdiction</label>
              <select
                value={facesheet.subDivision}
                onChange={(e) => updateFacesheet({ subDivision: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0B1F3A] outline-none"
              >
                {subdivisions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: Accounting Classification & Heads */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center space-x-2 text-[#0B1F3A] font-bold text-sm border-b border-slate-100 pb-3">
            <Landmark className="w-4 h-4 text-[#F4762A]" />
            <span>2. Budget Accounting & Sanction Metadata</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fund Head / Scheme</label>
              <input
                type="text"
                value={facesheet.fundHead}
                onChange={(e) => updateFacesheet({ fundHead: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0B1F3A] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Major Accounting Head</label>
                <input
                  type="text"
                  value={facesheet.majorHead}
                  onChange={(e) => updateFacesheet({ majorHead: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0B1F3A] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Minor Head</label>
                <input
                  type="text"
                  value={facesheet.minorHead}
                  onChange={(e) => updateFacesheet({ minorHead: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0B1F3A] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Service / Sponsoring Department</label>
              <input
                type="text"
                value={facesheet.serviceHead}
                onChange={(e) => updateFacesheet({ serviceHead: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0B1F3A] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">A/A Sanction Order No.</label>
                <input
                  type="text"
                  value={facesheet.adminApprovalNo}
                  onChange={(e) => updateFacesheet({ adminApprovalNo: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0B1F3A] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">A/A Order Date</label>
                <input
                  type="date"
                  value={facesheet.adminApprovalDate}
                  onChange={(e) => updateFacesheet({ adminApprovalDate: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0B1F3A] outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Statutory Percentage & Surcharge Config */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex items-center space-x-2 text-[#0B1F3A] font-bold text-sm border-b border-slate-100 pb-3">
          <Scale className="w-4 h-4 text-[#F4762A]" />
          <span>3. Statutory Government Resolution (GR) Surcharges & Fiscal Rates</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Area Classification (GR Surcharge)
            </label>
            <select
              value={facesheet.areaSurchargeType}
              onChange={(e) => updateFacesheet({ areaSurchargeType: e.target.value as AreaSurchargeType })}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0B1F3A] outline-none font-medium text-slate-800"
            >
              {Object.entries(AREA_SURCHARGE_MAP).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Current Applied Surcharge: <strong className="text-[#F4762A]">+{facesheet.areaSurchargePercent}%</strong> over net base rate.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              SCADA Batching Plant Deduction
            </label>
            <div className="flex items-center space-x-3 mt-2">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={facesheet.scadaDeductionActive}
                  onChange={(e) => updateFacesheet({ scadaDeductionActive: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0B1F3A]"></div>
                <span className="ml-2 text-xs font-medium text-slate-700">
                  {facesheet.scadaDeductionActive ? 'Active (-₹126/Cu.M)' : 'Cancelled (Manual Mix)'}
                </span>
              </label>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Deduction applied to RMC concrete items produced in computer-controlled automated batching plants.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Technical Sanction Status</label>
            <select
              value={facesheet.status}
              onChange={(e) => updateFacesheet({ status: e.target.value as any })}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0B1F3A] outline-none font-bold text-slate-800"
            >
              <option value="DRAFT">DRAFT (Sectional Engineer Preparation)</option>
              <option value="UNDER_REVIEW">UNDER REVIEW (Sub-Divisional Endorsement)</option>
              <option value="SANCTIONED">SANCTIONED (Executive Engineer Technical Sanction)</option>
              <option value="LOCKED">LOCKED (Sealed Post-Tender)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600">Goods & Services Tax (GST %)</label>
            <input
              type="number"
              value={facesheet.gstPercent}
              onChange={(e) => updateFacesheet({ gstPercent: Number(e.target.value) })}
              className="w-full text-xs p-2 rounded border border-slate-300 focus:ring-1 focus:ring-[#0B1F3A] font-semibold"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600">Physical Contingency (%)</label>
            <input
              type="number"
              value={facesheet.contingencyPercent}
              onChange={(e) => updateFacesheet({ contingencyPercent: Number(e.target.value) })}
              className="w-full text-xs p-2 rounded border border-slate-300 focus:ring-1 focus:ring-[#0B1F3A] font-semibold"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600">Labour Welfare Cess (%)</label>
            <input
              type="number"
              value={facesheet.laborCessPercent}
              onChange={(e) => updateFacesheet({ laborCessPercent: Number(e.target.value) })}
              className="w-full text-xs p-2 rounded border border-slate-300 focus:ring-1 focus:ring-[#0B1F3A] font-semibold"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600">Electrification Provision (₹)</label>
            <input
              type="number"
              value={facesheet.electrificationAmount}
              onChange={(e) => updateFacesheet({ electrificationAmount: Number(e.target.value) })}
              className="w-full text-xs p-2 rounded border border-slate-300 focus:ring-1 focus:ring-[#0B1F3A] font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
