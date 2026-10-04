import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, User, Phone, Mail, Building, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MAHA_REGIONS, getDivisionsForRegion } from '../../data/mahaJurisdictionData';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchDemo?: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, onLaunchDemo }) => {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [userRole, setUserRole] = useState('Contractor');
  const [selectedRegion, setSelectedRegion] = useState('Pune Region');
  const [selectedDivision, setSelectedDivision] = useState('Public Works Division (North), Pune');
  const [workType, setWorkType] = useState('Roads & Bridges');
  const [message, setMessage] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full Name is required';
    if (!mobile.trim()) {
      errs.mobile = 'Mobile Number is required';
    } else if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
      errs.mobile = 'Enter a valid 10-digit Indian mobile number';
    }
    if (!email.trim()) {
      errs.email = 'Email Address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      errs.email = 'Enter a valid email address';
    }
    if (!organization.trim()) errs.organization = 'Organization / Firm Name is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedRef = `MH-DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
      setReferenceId(generatedRef);

      // Save to localStorage for real backend record retention
      const record = {
        id: generatedRef,
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        email: email.trim().toLowerCase(),
        organization: organization.trim(),
        role: userRole,
        region: selectedRegion,
        division: selectedDivision,
        workType,
        message: message.trim(),
        requestedAt: new Date().toISOString(),
        status: 'ACTIVE_3_DAY_TRIAL',
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      };

      try {
        const existing = JSON.parse(localStorage.getItem('maha_pwd_demo_requests') || '[]');
        existing.unshift(record);
        localStorage.setItem('maha_pwd_demo_requests', JSON.stringify(existing));
      } catch (err) {
        console.error('Failed to store demo request:', err);
      }

      // Celebrate with confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#02013F', '#81C303', '#2563EB', '#16A34A'],
        });
      } catch {
        // fallback if canvas-confetti is not loaded
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    const divisions = getDivisionsForRegion(region);
    if (divisions.length > 0) {
      setSelectedDivision(divisions[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-slate-50 text-slate-900 p-6 pb-5 relative border-b border-slate-200">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-200/60"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-bold text-[#15803D] mb-1.5 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#15803D]" />
            <span>3-Day Complimentary Full Access</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Request Your 3-Day Free Demo
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg">
            Experience the complete KardeCalc PWD estimation suite with real Maharashtra SSR 2024-25 data, smart templates, and automated calculations.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {isSubmitted ? (
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-[#16A34A] shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-mono font-bold rounded-full border border-emerald-200 mb-2">
                  PASSCODE REF: {referenceId}
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Your 3-Day Demo Access is Ready!
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] mt-2 max-w-md mx-auto">
                  Thank you, <strong className="text-[#111827]">{fullName}</strong>. A confirmation SMS with login instructions has been logged for <strong className="text-[#111827]">{mobile}</strong>.
                </p>
              </div>

              {/* Quick Instant Demo Credentials Box */}
              <div className="bg-[#FBFFEB] border border-[#81C303]/40 rounded-xl p-4 text-left max-w-md mx-auto space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#15803D]" />
                    <span>Instant Evaluation Credentials</span>
                  </span>
                  <span className="text-[10px] bg-[#81C303] text-black font-extrabold px-2 py-0.5 rounded">
                    ACTIVE NOW
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-white p-2.5 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-[10px] text-[#64748B] block font-sans">User ID / Email:</span>
                    <span className="font-bold text-slate-900 select-all">admin</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] block font-sans">Department Password:</span>
                    <span className="font-bold text-slate-900 select-all">PWD@Maharashtra2026</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#64748B]">
                  Your jurisdiction defaults have been calibrated for <strong>{selectedDivision}</strong> ({selectedRegion}).
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {onLaunchDemo && (
                  <button
                    onClick={() => {
                      onClose();
                      onLaunchDemo();
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-[#81C303] hover:bg-[#72ad02] text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2 border border-[#72ad02]"
                  >
                    <span>Launch 3-Day Demo Workspace</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Full Name (नाव) *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors({ ...errors, fullName: '' });
                      }}
                      placeholder="e.g. Er. Sagar Kardekar"
                      className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border ${
                        errors.fullName ? 'border-[#DC2626] bg-red-50/30' : 'border-slate-300'
                      } focus:border-[#81C303] focus:ring-2 focus:ring-[#81C303]/20 outline-none`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-[11px] text-[#DC2626] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Mobile Number (मोबाईल क्र.) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                    <input
                      type="tel"
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => {
                        setMobile(e.target.value.replace(/\D/g, ''));
                        if (errors.mobile) setErrors({ ...errors, mobile: '' });
                      }}
                      placeholder="e.g. 9422188900 (10 digits)"
                      className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border ${
                        errors.mobile ? 'border-[#DC2626] bg-red-50/30' : 'border-slate-300'
                      } focus:border-[#81C303] focus:ring-2 focus:ring-[#81C303]/20 outline-none font-mono`}
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-[11px] text-[#DC2626] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.mobile}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Official Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      placeholder="e.g. sagar@infra-contractors.com"
                      className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border ${
                        errors.email ? 'border-[#DC2626] bg-red-50/30' : 'border-slate-300'
                      } focus:border-[#81C303] focus:ring-2 focus:ring-[#81C303]/20 outline-none`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-[#DC2626] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Organization / Firm */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Organization / Firm Name *
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => {
                        setOrganization(e.target.value);
                        if (errors.organization) setErrors({ ...errors, organization: '' });
                      }}
                      placeholder="e.g. Kardekar Constructions & Infratech"
                      className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border ${
                        errors.organization ? 'border-[#DC2626] bg-red-50/30' : 'border-slate-300'
                      } focus:border-[#81C303] focus:ring-2 focus:ring-[#81C303]/20 outline-none`}
                    />
                  </div>
                  {errors.organization && (
                    <p className="text-[11px] text-[#DC2626] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.organization}
                    </p>
                  )}
                </div>

                {/* Professional Role */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Professional Role / Profile
                  </label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:border-[#81C303] outline-none font-medium"
                  >
                    <option value="PWD Contractor">PWD Registered Contractor (वर्ग १ ते ९)</option>
                    <option value="Consulting Civil Engineer">Consulting Civil Engineer (सल्लागार अभियंता)</option>
                    <option value="Estimation Engineer">Estimation & Billing Engineer</option>
                    <option value="PWD Engineer">PWD / ZP / Municipal Engineer</option>
                    <option value="Construction Firm">Construction Firm / Developer</option>
                  </select>
                </div>

                {/* Primary Work Focus */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Primary Estimation Work Focus
                  </label>
                  <select
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:border-[#81C303] outline-none font-medium"
                  >
                    <option value="Roads & Bridges">CC & Asphalt Roads, Bridges, Culverts</option>
                    <option value="Public Buildings">Public Buildings & Community Halls</option>
                    <option value="Water & Drainage">Water Supply, Drainage & Chambers</option>
                    <option value="Compound & Retaining">Compound Walls & Boundary Fencing</option>
                    <option value="All Infrastructure">Multi-disciplinary PWD Infrastructure</option>
                  </select>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Maharashtra PWD Region
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => handleRegionSelect(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:border-[#81C303] outline-none font-medium"
                  >
                    {MAHA_REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Division */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Operating PWD Division
                  </label>
                  <select
                    value={selectedDivision}
                    onChange={(e) => setSelectedDivision(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:border-[#81C303] outline-none font-medium"
                  >
                    {getDivisionsForRegion(selectedRegion).map((d: string) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Optional Message */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Specific Requirements or Message (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Need assistance with Gram Panchayat CC Road estimates and M-30 PQC rates..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#81C303] focus:ring-2 focus:ring-[#81C303]/20 outline-none"
                />
              </div>

              {/* Terms & Privacy Note */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-[#64748B] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#81C303] shrink-0 mt-0.5" />
                <span>
                  By requesting demo access, you receive 3 days of unrestricted evaluation with all SSR items, calculation modules, and smart templates. No credit card required.
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-[#81C303] hover:bg-[#72ad02] text-black font-black text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50 border border-[#72ad02]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Configuring Your 3-Day Demo Environment...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Activate 3-Day Free Demo Now</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
