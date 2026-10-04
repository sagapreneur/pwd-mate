import React, { useState } from 'react';
import { User, Phone, Mail, Building, Send, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, AlertCircle, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MAHA_REGIONS, getDivisionsForRegion } from '../../data/mahaJurisdictionData';

interface DemoRequestSectionProps {
  onLaunchDemo?: () => void;
}

export const DemoRequestSection: React.FC<DemoRequestSectionProps> = ({ onLaunchDemo }) => {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Nagpur Region');
  const [selectedDivision, setSelectedDivision] = useState('Public Works Division, Wardha');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [refCode, setRefCode] = useState('');

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
      const code = `MH-DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
      setRefCode(code);

      const demoRecord = {
        id: code,
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        email: email.trim().toLowerCase(),
        organization: organization.trim(),
        region: selectedRegion,
        division: selectedDivision,
        message: message.trim(),
        requestedAt: new Date().toISOString(),
        status: 'ACTIVE_3_DAY_TRIAL',
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      };

      try {
        const stored = JSON.parse(localStorage.getItem('maha_pwd_demo_requests') || '[]');
        stored.unshift(demoRecord);
        localStorage.setItem('maha_pwd_demo_requests', JSON.stringify(stored));
      } catch (err) {
        console.error('Storage error:', err);
      }

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#02013F', '#81C303', '#2563EB'],
        });
      } catch {
        // canvas-confetti fallback
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 500);
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    const divisions = getDivisionsForRegion(region);
    if (divisions.length > 0) {
      setSelectedDivision(divisions[0]);
    }
  };

  return (
    <section id="demo" className="py-16 sm:py-24 bg-white relative overflow-hidden border-b border-slate-200">
      {/* Background Decorative Blob */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#81C303]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#02013F]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#02013F] to-[#0a0956] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl text-white border border-[#14136e]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-[#81C303] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Access 72-Hour Free Trial</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Try KardeCalc Free for 3 Days
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300">
              No credit card required. Experience the full power of 2,380+ SSR items, smart templates, lead analysis, and live calculation rollups in your own browser.
            </p>
          </div>

          {isSuccess ? (
            <div className="bg-white text-[#111827] rounded-2xl p-6 sm:p-8 text-center max-w-lg mx-auto shadow-xl space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-[#16A34A] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-mono text-xs font-bold border border-emerald-200 mb-1.5">
                  DEMO PASSCODE: {refCode}
                </span>
                <h3 className="text-xl font-bold text-[#02013F]">
                  Demo Request Approved!
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Thank you, <strong className="text-[#111827]">{fullName}</strong> ({organization}). Your 3-day full evaluation workspace is active immediately.
                </p>
              </div>

              {/* Credentials Box */}
              <div className="bg-[#FBFFEB] border border-[#81C303]/40 rounded-xl p-3.5 text-left text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-[#02013F]">
                  <span>Evaluation Sign-In Credentials</span>
                  <span className="text-[10px] bg-[#81C303] px-2 py-0.5 rounded text-black font-extrabold">
                    READY
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-[#64748B] block font-sans">User ID / Email:</span>
                    <span className="font-bold text-[#02013F]">admin</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] block font-sans">Password:</span>
                    <span className="font-bold text-[#02013F]">PWD@Maharashtra2026</span>
                  </div>
                </div>
                <div className="text-[11px] text-[#64748B]">
                  Configured division: <strong>{selectedDivision}</strong>
                </div>
              </div>

              {onLaunchDemo && (
                <button
                  onClick={onLaunchDemo}
                  className="w-full py-3 px-6 bg-[#02013F] hover:bg-[#14136e] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <span>Launch 3-Day Demo Workspace</span>
                  <ArrowRight className="w-4 h-4 text-[#81C303]" />
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white text-[#111827] rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-[#02013F] mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors({ ...errors, fullName: '' });
                      }}
                      placeholder="e.g. Er. Sagar Kardekar"
                      className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border ${
                        errors.fullName ? 'border-[#DC2626] bg-red-50/40' : 'border-slate-300'
                      } focus:border-[#81C303] outline-none`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-[11px] text-[#DC2626] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-xs font-bold text-[#02013F] mb-1">
                    Mobile Number (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
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
                        errors.mobile ? 'border-[#DC2626] bg-red-50/40' : 'border-slate-300'
                      } focus:border-[#81C303] outline-none font-mono`}
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-[11px] text-[#DC2626] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.mobile}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-[#02013F] mb-1">
                    Official Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      placeholder="e.g. contact@infracon.co.in"
                      className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border ${
                        errors.email ? 'border-[#DC2626] bg-red-50/40' : 'border-slate-300'
                      } focus:border-[#81C303] outline-none`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-[#DC2626] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Organization */}
                <div>
                  <label className="block text-xs font-bold text-[#02013F] mb-1">
                    Organization / Firm Name *
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => {
                        setOrganization(e.target.value);
                        if (errors.organization) setErrors({ ...errors, organization: '' });
                      }}
                      placeholder="e.g. Kardekar Infratech Pvt Ltd"
                      className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border ${
                        errors.organization ? 'border-[#DC2626] bg-red-50/40' : 'border-slate-300'
                      } focus:border-[#81C303] outline-none`}
                    />
                  </div>
                  {errors.organization && (
                    <p className="text-[11px] text-[#DC2626] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.organization}
                    </p>
                  )}
                </div>

                {/* Region */}
                <div>
                  <label className="block text-xs font-bold text-[#02013F] mb-1">
                    Maharashtra PWD Region
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => handleRegionChange(e.target.value)}
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
                  <label className="block text-xs font-bold text-[#02013F] mb-1">
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

              {/* Message */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-[#02013F] mb-1">
                  Optional Note or Current Project Type
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what estimates you are preparing (e.g., Zilla Parishad CC Road, Hume pipe culvert, or compound wall)..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#81C303] outline-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-[#02013F] hover:bg-[#14136e] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Activating Your 3-Day Demo License...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#81C303]" />
                    <span>Submit & Start 3-Day Free Demo</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
