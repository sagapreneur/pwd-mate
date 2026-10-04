import React, { useState } from 'react';
import { useEstimatorStore } from '../../store/useEstimatorStore';
import { MAHA_DIVISIONS } from '../../data/ssrMaster';
import {
  User,
  Settings,
  ShieldCheck,
  Building2,
  FileText,
  CheckCircle2,
  X,
  LogOut,
  MapPin,
  Mail,
  Phone,
  Award,
  Stamp,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface UserSession {
  name: string;
  role: string;
  division: string;
  email: string;
  phone?: string;
  subDivision?: string;
  registrationNo?: string;
  licenseClass?: string;
}

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession | null;
  onLogout?: () => void;
  onUpdateUser?: (updated: UserSession) => void;
}

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  onUpdateUser,
}) => {
  const {
    facesheet,
    updateFacesheet,
    stamps,
    updateStamp,
    recalculateAll,
  } = useEstimatorStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'defaults' | 'stamps'>('profile');
  const [saveToast, setSaveToast] = useState(false);

  // Profile Form state
  const [name, setName] = useState(currentUser?.name || 'Executive Engineer');
  const [role, setRole] = useState(currentUser?.role || 'Executive Engineer (कार्यकारी अभियंता)');
  const [division, setDivision] = useState(currentUser?.division || facesheet.division || 'Public Works Division, Wardha');
  const [subDivision, setSubDivision] = useState(facesheet.subDivision || 'P.W. Sub-Division No. 1, Wardha');
  const [email, setEmail] = useState(currentUser?.email || 'ee.wardha@mahapwd.gov.in');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 94221 88900');
  const [registrationNo, setRegistrationNo] = useState(currentUser?.registrationNo || 'MH/PWD/EE/SANCTION/042');
  const [licenseClass, setLicenseClass] = useState(currentUser?.licenseClass || 'Class I-A (Unlimited)');

  // Estimation Defaults state
  const [gstPercent, setGstPercent] = useState(facesheet.gstPercent || 18);
  const [contingencyPercent, setContingencyPercent] = useState(facesheet.contingencyPercent || 4);
  const [laborCessPercent, setLaborCessPercent] = useState(facesheet.laborCessPercent || 0.5);
  const [areaSurchargePercent, setAreaSurchargePercent] = useState(facesheet.areaSurchargePercent || 4);
  const [scadaDeductionActive, setScadaDeductionActive] = useState(facesheet.scadaDeductionActive ?? true);

  // Digital Stamps state
  const seStamp = stamps.find((s) => s.role === 'SE');
  const sdeStamp = stamps.find((s) => s.role === 'SDE');
  const eeStamp = stamps.find((s) => s.role === 'EE');

  const [preparerName, setPreparerName] = useState(seStamp?.name || 'Shri. R. K. Deshmukh');
  const [preparerTitle, setPreparerTitle] = useState(seStamp?.designation || 'Sectional Engineer');
  const [checkerName, setCheckerName] = useState(sdeStamp?.name || 'Er. S. M. Kulkarni');
  const [checkerTitle, setCheckerTitle] = useState(sdeStamp?.designation || 'Sub-Divisional Engineer');
  const [approverName, setApproverName] = useState(eeStamp?.name || 'Er. V. P. Patil');
  const [approverTitle, setApproverTitle] = useState(eeStamp?.designation || 'Executive Engineer');

  if (!isOpen) return null;

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Update session user
    const updatedUser: UserSession = {
      name: name.trim(),
      role: role.trim(),
      division: division.trim(),
      subDivision: subDivision.trim(),
      email: email.trim(),
      phone: phone.trim(),
      registrationNo: registrationNo.trim(),
      licenseClass: licenseClass.trim(),
    };

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }
    try {
      localStorage.setItem('maha_pwd_auth_session', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Failed to save session:', err);
    }

    // 2. Update active facesheet defaults
    updateFacesheet({
      division: division.trim(),
      subDivision: subDivision.trim(),
      gstPercent: Number(gstPercent),
      contingencyPercent: Number(contingencyPercent),
      laborCessPercent: Number(laborCessPercent),
      areaSurchargePercent: Number(areaSurchargePercent),
      scadaDeductionActive,
    });

    // 3. Update stamps
    updateStamp('SE', { name: preparerName, designation: preparerTitle });
    updateStamp('SDE', { name: checkerName, designation: checkerTitle });
    updateStamp('EE', { name: approverName, designation: approverTitle });

    // 4. Recalculate
    recalculateAll();

    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      onClose();
    }, 1200);
  };

  // Get Initials for Avatar
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (fullName.substring(0, 2) || 'AD').toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with KardeCalc Brand Aesthetic */}
        <div className="bg-[#02013F] text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-[#81C303]/30">
          <div className="flex items-center space-x-3.5">
            {/* Officer Avatar Badge */}
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#02013F] to-[#1e1b85] border-2 border-[#81C303] flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                {getInitials(name)}
              </div>
              <span
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#81C303] border-2 border-[#02013F]"
                title="Active Official Session"
              />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  {name || 'User Profile & Settings'}
                </h3>
                <span className="text-[10px] bg-[#81C303] text-[#02013F] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  PWD Official
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {role} • {division}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center space-x-1 px-6 pt-3 bg-[#F8FAFC] border-b border-[#E5E7EB] shrink-0 overflow-x-auto">
          {[
            { id: 'profile', label: 'Officer Profile', icon: User },
            { id: 'defaults', label: 'Estimate Defaults', icon: Sliders },
            { id: 'stamps', label: 'Signatures & Stamps', icon: Stamp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  isTabActive
                    ? 'border-[#02013F] text-[#02013F] bg-white rounded-t-lg shadow-2xs'
                    : 'border-transparent text-[#64748B] hover:text-[#02013F] hover:bg-slate-100/60 rounded-t-lg'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isTabActive ? 'text-[#81C303]' : 'text-[#94A3B8]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body Scrollable Area */}
        <form onSubmit={handleSaveAll} className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          {/* TAB 1: Profile & Jurisdiction */}
          {activeTab === 'profile' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-[#FBFFEB] border border-[#81C303]/40 rounded-xl p-4 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-[#81C303] shrink-0 mt-0.5" />
                <div className="text-xs text-[#02013F]">
                  <strong className="font-bold">Government of Maharashtra PWD Portal Authentication</strong>
                  <p className="text-slate-600 mt-0.5">
                    User information is stamped automatically on all Technical Sanctions, Measurement Books (MB), Schedule-B, and PDF Dossiers generated in this session.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#02013F] mb-1">
                    Officer / Contractor Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#02013F] outline-none font-semibold text-[#111827]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#02013F] mb-1">
                    Official Role / Designation *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#02013F] outline-none font-semibold text-[#111827]"
                  >
                    <option value="Executive Engineer (कार्यकारी अभियंता)">Executive Engineer (कार्यकारी अभियंता)</option>
                    <option value="Sub-Divisional Officer (उपविभागीय अभियंता)">Sub-Divisional Officer (उपविभागीय अभियंता)</option>
                    <option value="Sectional Engineer (शाखा अभियंता)">Sectional Engineer (शाखा अभियंता)</option>
                    <option value="Junior Engineer (कनिष्ठ अभियंता)">Junior Engineer (कनिष्ठ अभियंता)</option>
                    <option value="Registered Contractor (नोंदणीकृत मक्तेदार)">Registered Contractor (नोंदणीकृत मक्तेदार)</option>
                    <option value="Architect / Estimator Consultant">Architect / Estimator Consultant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#02013F] mb-1">
                    PWD Division *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      list="all-maha-divisions"
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      placeholder="e.g. Public Works Division, Wardha"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#02013F] outline-none font-semibold text-[#111827]"
                      required
                    />
                    <datalist id="all-maha-divisions">
                      {Object.values(MAHA_DIVISIONS).flat().map((div) => (
                        <option key={div} value={div} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#02013F] mb-1">
                    Sub-Division Jurisdiction
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={subDivision}
                      onChange={(e) => setSubDivision(e.target.value)}
                      placeholder="e.g. P.W. Sub-Division No. 1, Wardha"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#02013F] outline-none font-semibold text-[#111827]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#02013F] mb-1">
                    Official Email ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#02013F] outline-none font-semibold text-[#111827]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#02013F] mb-1">
                    Contact Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#02013F] outline-none font-semibold text-[#111827]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#02013F] mb-1">
                    Registration / Badge Number
                  </label>
                  <div className="relative">
                    <Award className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={registrationNo}
                      onChange={(e) => setRegistrationNo(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#02013F] outline-none font-semibold text-[#111827]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#02013F] mb-1">
                    PWD License Class (Contractors)
                  </label>
                  <select
                    value={licenseClass}
                    onChange={(e) => setLicenseClass(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E7EB] bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#02013F] outline-none font-semibold text-[#111827]"
                  >
                    <option value="Class I-A (Unlimited)">Class I-A (Unlimited / Above ₹15 Cr)</option>
                    <option value="Class I (Up to ₹15 Cr)">Class I (Up to ₹15 Cr)</option>
                    <option value="Class II (Up to ₹7.5 Cr)">Class II (Up to ₹7.5 Cr)</option>
                    <option value="Class III (Up to ₹3 Cr)">Class III (Up to ₹3 Cr)</option>
                    <option value="Class IV (Up to ₹1.5 Cr)">Class IV (Up to ₹1.5 Cr)</option>
                    <option value="Unemployed Graduate Engineer">Unemployed Graduate Engineer (UGE)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Estimate Defaults */}
          {activeTab === 'defaults' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                Configure your preferred statutory taxes, contingencies, and SCADA batching deductions for new estimates and templates.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white space-y-1">
                  <label className="block text-xs font-bold text-[#02013F]">
                    Default GST Rate (%)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      step="0.5"
                      value={gstPercent}
                      onChange={(e) => setGstPercent(Number(e.target.value))}
                      className="w-24 px-3 py-1.5 text-xs rounded border border-[#E5E7EB] font-bold text-[#02013F]"
                    />
                    <span className="text-xs text-slate-500">Standard PWD GST rate is 18.0%</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white space-y-1">
                  <label className="block text-xs font-bold text-[#02013F]">
                    Default Physical Contingency (%)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      step="0.5"
                      value={contingencyPercent}
                      onChange={(e) => setContingencyPercent(Number(e.target.value))}
                      className="w-24 px-3 py-1.5 text-xs rounded border border-[#E5E7EB] font-bold text-[#02013F]"
                    />
                    <span className="text-xs text-slate-500">Typically 4% for civil projects</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white space-y-1">
                  <label className="block text-xs font-bold text-[#02013F]">
                    Building & Other Construction Labor Welfare Cess (%)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      step="0.1"
                      value={laborCessPercent}
                      onChange={(e) => setLaborCessPercent(Number(e.target.value))}
                      className="w-24 px-3 py-1.5 text-xs rounded border border-[#E5E7EB] font-bold text-[#02013F]"
                    />
                    <span className="text-xs text-slate-500">Maha BOCW Cess (0.5% or 1.0%)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-white space-y-1">
                  <label className="block text-xs font-bold text-[#02013F]">
                    Regional Area Surcharge (%)
                  </label>
                  <select
                    value={areaSurchargePercent}
                    onChange={(e) => setAreaSurchargePercent(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded border border-[#E5E7EB] font-semibold text-[#02013F]"
                  >
                    <option value={0}>0% - Standard Non-Tribal Corporation / Council</option>
                    <option value={4}>4% - Tribal & Hilly Sub-Division Area (आदिवासी क्षेत्र)</option>
                    <option value={8}>8% - Difficult Ghat / Remote Forest Area</option>
                    <option value={10}>10% - Naxal Affected Region (नक्षलग्रस्त भाग)</option>
                  </select>
                </div>
              </div>

              {/* SCADA Batching Plant Deduction Toggle in Settings */}
              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#02013F]">
                      SCADA Batching Plant Deduction Default (-₹126.00/Cu.M)
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        scadaDeductionActive ? 'bg-[#2563EB] text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {scadaDeductionActive ? 'Active' : 'Off'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Automatically apply credit for computerized SCADA concrete mix plants on RCC and CC items.
                  </p>
                </div>

                {/* Modern Pill Toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={scadaDeductionActive}
                  onClick={() => setScadaDeductionActive(!scadaDeductionActive)}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 ${
                    scadaDeductionActive ? 'bg-[#2563EB]' : 'bg-[#BAC7F9]'
                  }`}
                  title="Toggle SCADA Deduction"
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      scadaDeductionActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Digital Signatures & Stamps */}
          {activeTab === 'stamps' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                Official signatory stamps printed on the Technical Sanction, Measurement Books, and Abstract of Cost.
              </div>

              <div className="space-y-4">
                {/* 1. Preparing Engineer */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center space-x-2 mb-2 text-xs font-bold text-[#02013F]">
                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">1</span>
                    <span>Prepared By (Sectional Engineer / Junior Engineer)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Officer Name"
                      value={preparerName}
                      onChange={(e) => setPreparerName(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-semibold"
                    />
                    <input
                      type="text"
                      placeholder="Designation Title"
                      value={preparerTitle}
                      onChange={(e) => setPreparerTitle(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-semibold"
                    />
                  </div>
                </div>

                {/* 2. Checking SDO */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center space-x-2 mb-2 text-xs font-bold text-[#02013F]">
                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">2</span>
                    <span>Checked & Recommended By (Sub-Divisional Officer)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Officer Name"
                      value={checkerName}
                      onChange={(e) => setCheckerName(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-semibold"
                    />
                    <input
                      type="text"
                      placeholder="Designation Title"
                      value={checkerTitle}
                      onChange={(e) => setCheckerTitle(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-semibold"
                    />
                  </div>
                </div>

                {/* 3. Sanctioning Executive Engineer */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center space-x-2 mb-2 text-xs font-bold text-[#02013F]">
                    <span className="w-5 h-5 rounded-full bg-[#81C303]/30 flex items-center justify-center text-[10px] text-[#02013F] font-bold">3</span>
                    <span>Technical Sanction Authority (Executive Engineer)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Officer Name"
                      value={approverName}
                      onChange={(e) => setApproverName(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-semibold"
                    />
                    <input
                      type="text"
                      placeholder="Designation Title"
                      value={approverTitle}
                      onChange={(e) => setApproverTitle(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
            {onLogout && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-[#DC2626] hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout (लॉगआउट करा)</span>
              </button>
            )}

            <div className="flex items-center space-x-2.5 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center space-x-2 px-5 py-2 text-xs font-bold bg-[#81C303] hover:bg-[#72ad02] text-[#02013F] rounded-lg shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                {saveToast ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#02013F]" />
                    <span>Saved Successfully!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#02013F]" />
                    <span>Save & Apply Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
