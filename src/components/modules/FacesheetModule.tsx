import React from 'react';
import { useEstimatorStore } from '../../store/useEstimatorStore';
import {
  MAHA_REGIONS,
  MAHA_CIRCLES,
  MAHA_DIVISIONS,
  MAHA_SUBDIVISIONS,
  getSubDivisionsForDivision,
  normalizeMahaRegion,
  AREA_SURCHARGE_MAP,
} from '../../data/ssrMaster';
import { AreaSurchargeType } from '../../types/estimator';
import { Building, Landmark, Scale, FileText, CheckCircle2, Sparkles } from 'lucide-react';

export const FacesheetModule: React.FC = () => {
  const { facesheet, updateFacesheet, calculationRollup, setActiveTab } = useEstimatorStore();

  const normalizedRegion = normalizeMahaRegion(facesheet.region);
  const circles = MAHA_CIRCLES[normalizedRegion] || Object.values(MAHA_CIRCLES)[0] || [];
  const activeCircle = circles.includes(facesheet.circle) ? facesheet.circle : (circles[0] || '');
  const divisions = MAHA_DIVISIONS[activeCircle] || Object.values(MAHA_DIVISIONS)[0] || [];
  const activeDivision = divisions.includes(facesheet.division) ? facesheet.division : (divisions[0] || '');
  const subdivisions = getSubDivisionsForDivision(activeDivision);
  const activeSubDivision = subdivisions.includes(facesheet.subDivision) ? facesheet.subDivision : (subdivisions[0] || '');

  const handleRegionChange = (newRegion: string) => {
    const availCircles = MAHA_CIRCLES[newRegion] || [];
    const firstCircle = availCircles[0] || '';
    const availDivs = MAHA_DIVISIONS[firstCircle] || [];
    const firstDiv = availDivs[0] || '';
    const availSubDivs = getSubDivisionsForDivision(firstDiv);
    const firstSubDiv = availSubDivs[0] || '';
    updateFacesheet({
      region: newRegion,
      circle: firstCircle,
      division: firstDiv,
      subDivision: firstSubDiv,
      authority: `Executive Engineer, ${firstDiv}`,
    });
  };

  const handleCircleChange = (newCircle: string) => {
    const availDivs = MAHA_DIVISIONS[newCircle] || [];
    const firstDiv = availDivs[0] || '';
    const availSubDivs = getSubDivisionsForDivision(firstDiv);
    const firstSubDiv = availSubDivs[0] || '';
    updateFacesheet({
      circle: newCircle,
      division: firstDiv,
      subDivision: firstSubDiv,
      authority: `Executive Engineer, ${firstDiv}`,
    });
  };

  const handleDivisionChange = (newDivision: string) => {
    const availSubDivs = getSubDivisionsForDivision(newDivision);
    const firstSubDiv = availSubDivs[0] || '';
    updateFacesheet({
      division: newDivision,
      subDivision: firstSubDiv,
      authority: `Executive Engineer, ${newDivision}`,
    });
  };

  const handleSubDivisionChange = (newSubDivision: string) => {
    updateFacesheet({
      subDivision: newSubDivision,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#81C303] uppercase tracking-wider">
            Administrative Project Scoping & Facesheet
          </span>
          <h2 className="text-xl font-bold text-[#02013F] mt-1">{facesheet.nameOfWork}</h2>
          <p className="text-xs text-slate-500 mt-1">
            Governing Schedule: <span className="font-semibold text-slate-700">{facesheet.ssrYear}</span> | Accounting Classification: <span className="font-semibold text-slate-700">{facesheet.majorHead}</span>
          </p>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setActiveTab('templates')}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-lg bg-[#FBFFEB] hover:bg-[#81C303]/20 text-[#02013F] text-xs font-bold border border-[#81C303]/50 shadow-xs transition-all hover:scale-105 active:scale-95"
            title="Populate from Smart Templates library"
          >
            <Sparkles className="w-4 h-4 text-[#81C303]" />
            <span>Smart Templates</span>
          </button>

          <div className="bg-[#02013F] text-white px-5 py-2.5 rounded-lg border border-[#81C303] text-right">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Sanctioned Estimate</div>
            <div className="text-xl font-bold text-[#81C303] tabular-nums-force">
              ₹{calculationRollup.sanctionedTotal.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-300 font-medium">({calculationRollup.formattedLakhs})</div>
          </div>
        </div>
      </div>

      {/* Card 0: Project Work Title & Scope */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-[#02013F] font-bold text-sm">
            <FileText className="w-4 h-4 text-[#81C303]" />
            <span>0. Project Work Title & Scope (कामाचे नाव व तपशील)</span>
          </div>
          <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 font-semibold px-2 py-0.5 rounded">
            Editable — Updates all print sheets, MB, Schedule B & TS
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#02013F] mb-1.5 flex items-center justify-between">
              <span>Name of Work (कामाचे नाव / शीर्षक) *</span>
              <span className="text-[10px] text-slate-400 font-normal">Full official description as per A/A and TS</span>
            </label>
            <textarea
              rows={2}
              value={facesheet.nameOfWork}
              onChange={(e) => updateFacesheet({ nameOfWork: e.target.value })}
              placeholder="Enter official work title, e.g. Construction of Two Wheeler Parking Stand Shed at S.P. Office, Wardha..."
              className="w-full text-xs p-3 rounded-lg border-2 border-slate-300 focus:border-[#81C303] focus:ring-2 focus:ring-[#81C303]/20 outline-none font-semibold text-slate-800 leading-relaxed shadow-inner"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">SSR Schedule Year</label>
              <select
                value={facesheet.ssrYear}
                onChange={(e) => updateFacesheet({ ssrYear: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white font-bold text-[#02013F]"
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
          <div className="flex items-center space-x-2 text-[#02013F] font-bold text-sm border-b border-slate-100 pb-3">
            <Building className="w-4 h-4 text-[#81C303]" />
            <span>1. PWD Territorial Jurisdiction (Cascading)</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Public Works Region (प्रादेशिक विभाग)
                </label>
                <span className="text-[10px] text-slate-400 font-semibold">{MAHA_REGIONS.length} Regions</span>
              </div>
              <select
                value={normalizedRegion}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#02013F] outline-none font-semibold text-[#02013F]"
              >
                {MAHA_REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Public Works Circle (सा.बां. मंडळ)
                </label>
                <span className="text-[10px] text-slate-400 font-semibold">{circles.length} Circles in Region</span>
              </div>
              <select
                value={activeCircle}
                onChange={(e) => handleCircleChange(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#02013F] outline-none font-semibold text-[#111827]"
              >
                {circles.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Public Works Division (सा.बां. विभाग)
                </label>
                <span className="text-[10px] text-slate-400 font-semibold">{divisions.length} Divisions in Circle</span>
              </div>
              <select
                value={activeDivision}
                onChange={(e) => handleDivisionChange(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#02013F] outline-none font-semibold text-[#111827]"
              >
                {divisions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Sub-Division Jurisdiction (सा.बां. उपविभाग)
                </label>
                <span className="text-[10px] text-slate-400 font-semibold">{subdivisions.length} Sub-Divisions</span>
              </div>
              <select
                value={activeSubDivision}
                onChange={(e) => handleSubDivisionChange(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#02013F] outline-none font-semibold text-[#111827]"
              >
                {subdivisions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Active Territorial Sync Banner */}
            <div className="bg-[#FBFFEB] border border-[#81C303]/40 rounded-lg p-2.5 mt-2 flex items-center justify-between text-[11px] text-[#02013F]">
              <div className="flex items-center space-x-1.5 truncate">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#81C303] shrink-0" />
                <span className="truncate">
                  Active: <strong>{activeDivision}</strong> / {activeSubDivision}
                </span>
              </div>
              <span className="text-[9px] bg-[#81C303] text-[#02013F] font-extrabold px-1.5 py-0.5 rounded shrink-0">
                SYNCED
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Accounting Classification & Heads */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center space-x-2 text-[#02013F] font-bold text-sm border-b border-slate-100 pb-3">
            <Landmark className="w-4 h-4 text-[#81C303]" />
            <span>2. Budget Accounting & Sanction Metadata</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fund Head / Scheme</label>
              <input
                type="text"
                value={facesheet.fundHead}
                onChange={(e) => updateFacesheet({ fundHead: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#02013F] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Major Accounting Head</label>
                <input
                  type="text"
                  value={facesheet.majorHead}
                  onChange={(e) => updateFacesheet({ majorHead: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#02013F] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Minor Head</label>
                <input
                  type="text"
                  value={facesheet.minorHead}
                  onChange={(e) => updateFacesheet({ minorHead: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#02013F] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Service / Sponsoring Department</label>
              <input
                type="text"
                value={facesheet.serviceHead}
                onChange={(e) => updateFacesheet({ serviceHead: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#02013F] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">A/A Sanction Order No.</label>
                <input
                  type="text"
                  value={facesheet.adminApprovalNo}
                  onChange={(e) => updateFacesheet({ adminApprovalNo: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#02013F] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">A/A Order Date</label>
                <input
                  type="date"
                  value={facesheet.adminApprovalDate}
                  onChange={(e) => updateFacesheet({ adminApprovalDate: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#02013F] outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Statutory Percentage & Surcharge Config */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex items-center space-x-2 text-[#02013F] font-bold text-sm border-b border-slate-100 pb-3">
          <Scale className="w-4 h-4 text-[#81C303]" />
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
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#02013F] outline-none font-medium text-slate-800"
            >
              {Object.entries(AREA_SURCHARGE_MAP).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Current Applied Surcharge: <strong className="text-[#81C303]">+{facesheet.areaSurchargePercent}%</strong> over net base rate.
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#02013F] mb-1">
                SCADA Batching Plant Deduction
              </label>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider transition-colors ${
                  facesheet.scadaDeductionActive
                    ? 'bg-blue-50 text-[#2563EB] border border-blue-200'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}
              >
                {facesheet.scadaDeductionActive ? '-₹126/Cu.M Applied' : 'Off (Manual Mix)'}
              </span>
            </div>

            <div className="flex items-center space-x-3 mt-2">
              {/* Modern Pill Toggle Switch matching exact reference image */}
              <button
                type="button"
                role="switch"
                aria-checked={facesheet.scadaDeductionActive}
                onClick={() => updateFacesheet({ scadaDeductionActive: !facesheet.scadaDeductionActive })}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 ${
                  facesheet.scadaDeductionActive ? 'bg-[#2563EB]' : 'bg-[#BAC7F9]'
                }`}
                title="Toggle SCADA Automated Concrete Batching Plant Credit (-₹126/Cu.M)"
              >
                <span className="sr-only">Toggle SCADA Deduction</span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    facesheet.scadaDeductionActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>

              <div className="text-xs">
                <span className="font-semibold text-[#111827]">
                  {facesheet.scadaDeductionActive ? 'Active (-₹126/Cu.M Credit)' : 'Cancelled (Site Manual Mix)'}
                </span>
                <span className="block text-[10px] text-slate-500">
                  {facesheet.scadaDeductionActive ? 'Standard PWD computerized plant deduction' : 'Full manual rate without SCADA discount'}
                </span>
              </div>
            </div>
            <span className="text-[11px] text-slate-500 mt-1.5 block">
              Deduction applied to RMC concrete items produced in computer-controlled automated batching plants.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Technical Sanction Status</label>
            <select
              value={facesheet.status}
              onChange={(e) => updateFacesheet({ status: e.target.value as any })}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#02013F] outline-none font-bold text-slate-800"
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
              className="w-full text-xs p-2 rounded border border-slate-300 focus:ring-1 focus:ring-[#02013F] font-semibold"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600">Physical Contingency (%)</label>
            <input
              type="number"
              value={facesheet.contingencyPercent}
              onChange={(e) => updateFacesheet({ contingencyPercent: Number(e.target.value) })}
              className="w-full text-xs p-2 rounded border border-slate-300 focus:ring-1 focus:ring-[#02013F] font-semibold"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600">Labour Welfare Cess (%)</label>
            <input
              type="number"
              value={facesheet.laborCessPercent}
              onChange={(e) => updateFacesheet({ laborCessPercent: Number(e.target.value) })}
              className="w-full text-xs p-2 rounded border border-slate-300 focus:ring-1 focus:ring-[#02013F] font-semibold"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600">Electrification Provision (₹)</label>
            <input
              type="number"
              value={facesheet.electrificationAmount}
              onChange={(e) => updateFacesheet({ electrificationAmount: Number(e.target.value) })}
              className="w-full text-xs p-2 rounded border border-slate-300 focus:ring-1 focus:ring-[#02013F] font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
